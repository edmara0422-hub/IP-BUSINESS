'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, TrendingUp, AlertTriangle, Brain, FolderPlus, Loader2, FileDown, ToggleLeft, ToggleRight } from 'lucide-react'
import { useWorkspaceData } from '@/hooks/useWorkspaceData'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import type { CockpitSnapshot } from '@/components/AbaArquivos'
import { ARQUIVOS_MODULE } from '@/components/AbaArquivos'

const RED   = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE  = '#1a5276'

function fmt(v: number) { return v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
function fmtDec(v: number, d = 1) { return v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }) }
function colorByRange(v: number, g: number, a: number) { return v >= g ? GREEN : v >= a ? AMBER : RED }

// ── TASK 1: Tabela de benchmarks por modelo de receita ─────────────────────
const MODEL_BENCHMARKS: Record<string, {
  label: string; exemplo: string; margemRef: number; churnRef: number
  ltvMult: number; cacTeto: number; ticketRef: number; churnDesc: string
}> = {
  saas:        { label: 'SaaS / Assinatura',      exemplo: 'software, app, plataforma digital com plano mensal/anual',     margemRef: 80, churnRef: 3,  ltvMult: 24,  cacTeto: 3.0,  ticketRef: 97,    churnDesc: 'baixo — recorrência alta' },
  servico:     { label: 'Serviço / Consultoria',  exemplo: 'agência, consultoria, freelancer, contabilidade, advocacia',    margemRef: 60, churnRef: 15, ltvMult: 6,   cacTeto: 0.5,  ticketRef: 500,   churnDesc: 'médio — retenção é chave' },
  clinica:     { label: 'Clínica / Saúde',        exemplo: 'médico, psicólogo, dentista, fisioterapeuta, nutricionista',    margemRef: 48, churnRef: 8,  ltvMult: 10,  cacTeto: 1.0,  ticketRef: 280,   churnDesc: 'baixo — vínculo forte com profissional' },
  educacao:    { label: 'Educação / Mentoria',     exemplo: 'escola, professor particular, mentor, coach, treinamento',     margemRef: 65, churnRef: 18, ltvMult: 5,   cacTeto: 0.6,  ticketRef: 350,   churnDesc: 'médio — resultado percebido é chave' },
  infoproduto: { label: 'Infoproduto / Curso',    exemplo: 'curso online, ebook, workshop, comunidade, masterclass',        margemRef: 87, churnRef: 60, ltvMult: 1.5, cacTeto: 0.4,  ticketRef: 197,   churnDesc: 'muito alto — front-end intenso' },
  ecommerce:   { label: 'E-commerce',             exemplo: 'loja online, dropshipping, marketplace próprio, D2C',           margemRef: 27, churnRef: 38, ltvMult: 3,   cacTeto: 0.25, ticketRef: 100,   churnDesc: 'alto — recompra é desafio' },
  varejo:      { label: 'Varejo Físico / Loja',   exemplo: 'loja física, boutique, papelaria, pet shop, farmácia',          margemRef: 28, churnRef: 45, ltvMult: 2.5, cacTeto: 0.1,  ticketRef: 120,   churnDesc: 'muito alto — tráfego local é chave' },
  alimentacao: { label: 'Alimentação / Delivery', exemplo: 'restaurante, lanchonete, confeitaria, dark kitchen, marmitex',  margemRef: 22, churnRef: 35, ltvMult: 4,   cacTeto: 0.15, ticketRef: 60,    churnDesc: 'alto — experiência e localização' },
  fisico:      { label: 'Produto Físico / Indústria', exemplo: 'fabricante, artesão, cosmético próprio, suplemento, roupa', margemRef: 32, churnRef: 40, ltvMult: 2,   cacTeto: 0.2,  ticketRef: 150,   churnDesc: 'alto — compra esporádica' },
  projetos:    { label: 'Projetos / Obra / Evento', exemplo: 'construtora, arquitetura, eventos, produção audiovisual',    margemRef: 20, churnRef: 70, ltvMult: 1.2, cacTeto: 0.3,  ticketRef: 5000,  churnDesc: 'muito alto — cada projeto é novo cliente' },
  marketplace: { label: 'Marketplace / Plataforma', exemplo: 'intermediador entre oferta e demanda, hub de serviços',      margemRef: 15, churnRef: 20, ltvMult: 12,  cacTeto: 2.0,  ticketRef: 50,    churnDesc: 'médio — volume e liquidez são tudo' },
  agro:        { label: 'Agronegócio / Produção', exemplo: 'produtor rural, pecuária, aquicultura, cooperativa agrícola',   margemRef: 18, churnRef: 90, ltvMult: 1.0, cacTeto: 0.05, ticketRef: 10000, churnDesc: 'sazonal — ciclo anual de receita' },
}

// Perfis de maturidade
type MaturityProfile = 'ideia' | 'pre-receita' | 'solvencia' | 'fluxo' | 'escala'
function detectProfile(receita: number, caixa: number, despesas: number, fase: string, motivoCaixaZero: string, margem: number): MaturityProfile {
  if (receita === 0 && despesas === 0 && caixa === 0) return 'ideia'
  if (receita === 0 && despesas > 0 && (fase === 'validacao' || ['pre-receita', 'lancando'].includes(motivoCaixaZero))) return 'pre-receita'
  if (receita > 0 && caixa === 0 && despesas > 0 && motivoCaixaZero === 'zerado-problema') return 'solvencia'
  if (caixa === 0 && margem > 40 && motivoCaixaZero === 'zerado-intencional') return 'fluxo'
  return 'escala'
}

const ZERO_DEFAULT = {
  receita: 0, despesas: 0, caixa: 0, clientesAtivos: 0, novosClientes: 0,
  clientesPerdidos: 0, verbaMkt: 0, cacManual: 0, ticketManual: 0, churnManual: 0,
  // Calibragem multi-select
  modelosReceita: [] as string[], objetivos: [] as string[],
  faseNegocio: '', motivoCaixaZero: '',
  ticketProjetado: 0, margemEstimada: 0,
  // Calibragem profunda
  naturezaCobranca: '',   // 'recorrente' | 'unica' | 'hibrida'
  cicloMedioMeses: 0,     // permanência média do cliente em meses
  complexidadeVenda: [] as string[],  // ['self-service', 'consultivo']
  aporteMensal: 0,        // injeção mensal do sócio/bootstrap (R$)
  cargaTributaria: 0,     // % de impostos + taxas de transação
  // Legacy (migration compat)
  modeloReceita: '', objetivoAtual: '',
}

// Mapeamento setor onboarding → id mercado (módulo — usado em MarketIntelligence e handleIA)
const SECTOR_MAP: Record<string, string> = {
  'Tecnologia': 'tech', 'App/SaaS': 'tech', 'Digital/SaaS': 'tech', 'Tecnologia & IA': 'tech',
  'Consultoria': 'services', 'Agência': 'services', 'Serviços': 'services',
  'Saúde': 'health', 'MedTech': 'health', 'Saúde & MedTech': 'health',
  'Varejo': 'retail', 'E-commerce': 'retail', 'Varejo Tradicional': 'retail',
  'Financeiro': 'fintech', 'Fintech': 'fintech',
  'Logística': 'logistics', 'Logística Smart': 'logistics',
  'Agronegócio': 'agro', 'Agricultura': 'agro',
  'Energia': 'energy', 'Energia Renovável': 'energy',
  'Mídia': 'media', 'Comunicação': 'media', 'Mídia Impressa': 'media',
}

// Contexto por setor — módulo-level (não recria a cada render)
const SECTOR_CONTEXT: Record<string, { why: string; impact: (h: number) => string }> = {
  tech:      { why: 'IA e cloud computing puxam crescimento. Empresas que adotam tech escalam mais rápido.', impact: h => h > 70 ? 'Momento favorável para lançar produto digital e captar investimento.' : h > 40 ? 'Crescimento moderado — foque em retenção antes de escalar.' : 'Setor desacelerando — corte burn e proteja caixa.' },
  agro:      { why: 'Dólar alto favorece exportador mas encarece insumos importados. PIB agro sólido.', impact: h => h > 70 ? 'Oportunidade B2B: produtores com dinheiro procuram ferramentas de gestão.' : h > 40 ? 'Cautela — commodities voláteis impactam margens do cliente.' : 'Setor pressionado por câmbio e clima.' },
  health:    { why: 'MedTech e telemedicina crescem pós-pandemia. Mercado resiliente a recessões.', impact: h => h > 70 ? 'Procura por saúde não para — bom para crescer ticket médio.' : h > 40 ? 'Regulação pesada pode travar expansão rápida.' : 'Regulação + SELIC alto encarecem capex em saúde.' },
  energy:    { why: 'Transição energética acelera. Solar e eólica crescem 20%+/a.a.', impact: h => h > 70 ? 'Projetos de energia renovável com captação facilitada.' : h > 40 ? 'Petróleo volátil — custo de frete incerto.' : 'Custo de energia pressionando margens do setor.' },
  fintech:   { why: 'Pix, open banking e crédito digital transformam o setor. SELIC alta aumenta spread.', impact: h => h > 70 ? 'SELIC alta = spread bancário alto = oportunidade para alternativas de crédito.' : h > 40 ? 'Regulação do BC aumenta compliance — custo operacional sobe.' : 'Capital de risco seco para fintech em cenário de juro alto.' },
  logistics: { why: 'E-commerce impulsiona logística last-mile. Frota elétrica e automação crescem.', impact: h => h > 70 ? 'E-commerce aquecido = volume de entregas crescendo — bom para operadores.' : h > 40 ? 'Combustível volátil corrói margem operacional.' : 'Dólar alto encarece peças e frota. Revisar precificação.' },
  services:  { why: 'Setor sensível a PIB. Cresce quando economia expande, contrai rápido em recessão.', impact: h => h > 70 ? 'PIB crescendo = consumidor com renda. Momento de conquistar novos clientes.' : h > 40 ? 'Crescimento fraco — foque em LTV e upsell da base existente.' : 'SELIC alta trava consumo de serviços discricionários. Cautela.' },
  retail:    { why: 'Varejo físico perde espaço para e-commerce. SELIC alta mata crédito ao consumidor.', impact: h => h > 50 ? 'Exceção no setor — foco em experiência ou nicho premium.' : h > 25 ? 'Juro alto comprime vendas a prazo. Revisar mix e giro de estoque.' : 'Setor crítico: juro alto + e-commerce corroendo share. Pivotar ou focar em sobrevivência.' },
  media:     { why: 'Mídia tradicional em colapso estrutural. Audiência migrou para digital.', impact: () => 'Modelo de negócio legado. Reconversão para digital é única saída sustentável.' },
}

// ── Componente de inteligência de mercado rico ─────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MarketIntelligence({ marketData, selicRate, ipcaRate, usdRate, caixa, despesas, cdiMensal, cdiRendimento, decisaoCDI, userProfile, receita, margem, runway, ltvCac, cac, churnMensal, taxaRealExata, burnReal, cacAjustado, margemReal }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  marketData: any; selicRate: number; ipcaRate: number; usdRate: number
  caixa: number; despesas: number; cdiMensal: number; cdiRendimento: number; decisaoCDI: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userProfile?: any
  receita: number; margem: number; runway: number; ltvCac: number; cac: number; churnMensal: number
  taxaRealExata: number; burnReal: number; cacAjustado: number; margemReal: number
}) {

  const sectors = (marketData?.sectors ?? []) as Array<{ id: string; label?: string; heat: number; change: number; trend?: string }>

  const userSectorId = useMemo(() => {
    const setor = userProfile?.sectors?.[0] ?? userProfile?.product?.[0] ?? ''
    if (!setor) return null
    return SECTOR_MAP[setor] ?? null
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile?.sectors, userProfile?.product])

  // Análise cruzada: seus dados reais × mercado — não repete macro cards, gera impacto específico
  const crossInsights = useMemo(() => {
    const insights: Array<{ cross: string; insight: string; color: string }> = []
    const userSectorObj = userSectorId ? sectors.find(s => s.id === userSectorId) : null
    const cacTrendDelta = marketData?.marketing?.cacTrend?.delta ?? 0
    const cpmPressure   = ((usdRate / 4.5 - 1) * 100)

    // ── INSIGHTS DE MERCADO PURO (disparam sempre, independem de dados do usuário) ──

    // M1. Taxa real Fisher — sempre relevante
    insights.push({
      cross: `Taxa Real Fisher ${taxaRealExata.toFixed(4)}% (SELIC ${selicRate}% − IPCA ${ipcaRate}%)`,
      insight: `Um dos maiores juros reais do mundo. Qualquer ROI abaixo de ${taxaRealExata.toFixed(2)}% é destruição de valor real${margemReal < 0 ? ` — sua margem real atual é ${margemReal.toFixed(2)}% (negativa)` : receita > 0 ? ` — sua margem real é ${margemReal.toFixed(2)}%` : ''}.`,
      color: taxaRealExata > 8 ? RED : AMBER,
    })

    // M2. Burn Real com SELIC — dispara se tem despesas
    if (burnReal > 0) {
      insights.push({
        cross: `Burn Real R$${burnReal.toFixed(2)} vs Declarado R$${despesas.toFixed(2)}`,
        insight: `SELIC ${selicRate}% adiciona R$${(burnReal - despesas).toFixed(2)}/mês de custo oculto em crédito e fornecedores. Se financiar via banco: +R$${(despesas * (selicRate * 2.5 / 100) / 12).toFixed(2)}/mês adicionais.`,
        color: RED,
      })
    }

    // M3. CAC Ajustado ao câmbio — sempre
    insights.push({
      cross: `CAC Ajustado R$${cacAjustado.toFixed(2)} (câmbio R$${usdRate.toFixed(2)}/R$4,50)`,
      insight: `Pressão cambial de ${((usdRate / 4.5 - 1) * 100).toFixed(1)}% encarece paid media em reais. CAC base R$${cac.toFixed(2)} → ajustado R$${cacAjustado.toFixed(2)}. Canal mais barato do mercado para reduzir este impacto.`,
      color: cpmPressure > 15 ? RED : AMBER,
    })

    // ── INSIGHTS COM DADOS DO USUÁRIO (quando disponíveis) ──

    // U1. Runway curto + CDI
    if (runway > 0 && runway < 12) {
      insights.push({
        cross: `Runway ${fmtDec(runway)}m + CDI ${(selicRate - 0.1).toFixed(2)}% a.a.`,
        insight: `Com runway curto, cada mês de burn consome R$${fmt(Math.round(cdiRendimento))}/mês que o CDI pagaria parado. Receita antes de captação — captar agora custa ${(selicRate * 2.5).toFixed(2)}% a.a.`,
        color: runway < 4 ? RED : AMBER,
      })
    }

    // U2. Margem real negativa
    if (receita > 0 && margemReal < 0) {
      insights.push({
        cross: `Margem Real ${margemReal.toFixed(2)}% (margem ${fmtDec(margem)}% − taxa real ${taxaRealExata.toFixed(2)}%)`,
        insight: `Margem real negativa: seu negócio destrói valor em termos reais. Sem reajuste de preço este ano, perde R$${fmt(Math.round(receita * Math.abs(margemReal) / 100))}/mês em poder aquisitivo.`,
        color: RED,
      })
    } else if (receita > 0 && margem > 0 && margem < ipcaRate * 4) {
      insights.push({
        cross: `Margem ${fmtDec(margem, 2)}% + IPCA ${ipcaRate.toFixed(2)}%`,
        insight: `Margem real de ${margemReal.toFixed(2)}%. Sem reajuste este ano, R$${fmt(Math.round(receita * ipcaRate / 100))} sumidos em 12 meses. Reajuste mínimo necessário: ${ipcaRate.toFixed(2)}%.`,
        color: AMBER,
      })
    }

    // U3. Churn + setor pressionado
    if (churnMensal > 2 && userSectorObj && userSectorObj.heat < 50) {
      insights.push({
        cross: `Churn ${fmtDec(churnMensal)}%/mês + ${userSectorObj.label ?? userSectorObj.id} PRESSIONADO`,
        insight: `Setor fraco amplifica churn — clientes com pressão financeira cancelam primeiro. Retenção custa 5× menos que reativação. Foco: onboarding e suporte ativo.`,
        color: RED,
      })
    }

    // U4. LTV/CAC + setor aquecido
    if (ltvCac > 3 && userSectorObj && userSectorObj.heat > 70) {
      insights.push({
        cross: `LTV/CAC ${fmtDec(ltvCac, 2)}x + ${userSectorObj.label ?? userSectorObj.id} AQUECIDO`,
        insight: `Equação saudável em setor aquecido. Janela para escalar paid — cada R$1 de CAC retorna R$${fmtDec(ltvCac, 2)} em LTV. Canal mais barato do mercado para maximizar escala.`,
        color: GREEN,
      })
    }

    // U5. CAC subindo + margem apertada
    if (cacTrendDelta > 8 && margem < 30 && receita > 0) {
      insights.push({
        cross: `Tendência CAC mkt +${cacTrendDelta.toFixed(0)}% + Margem ${fmtDec(margem)}%`,
        insight: `CAC do mercado subindo ${cacTrendDelta.toFixed(0)}% com margem já em ${fmtDec(margem)}%. Compressão dupla — reveja precificação antes de escalar paid.`,
        color: AMBER,
      })
    }

    return insights
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receita, despesas, margem, runway, ltvCac, cac, churnMensal, selicRate, ipcaRate, usdRate, cdiRendimento, taxaRealExata, burnReal, cacAjustado, margemReal, sectors, userSectorId, marketData])

  const userSector = userSectorId ? sectors.find(s => s.id === userSectorId) : null

  const heatLabel = (h: number) => h >= 75 ? { text: 'AQUECIDO', color: GREEN } : h >= 50 ? { text: 'FAVORÁVEL', color: GREEN } : h >= 30 ? { text: 'NEUTRO', color: AMBER } : { text: 'PRESSIONADO', color: RED }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <TrendingUp size={16} style={{ color: GREEN }} />
        <span style={{ fontSize: 14, fontWeight: 600 }}>Inteligência de Mercado</span>
      </div>

      {/* 4 cards macro com impacto nos seus números */}
      <div className="grid grid-cols-2 gap-2">
        {[
          {
            label: 'SELIC', value: `${fmtDec(selicRate, 2)}%`, color: selicRate > 12 ? RED : GREEN,
            desc: `Crédito: ${fmtDec(selicRate * 2.5, 2)}% a.a.${despesas > 0 ? ` — se financiar R$${fmt(despesas)}, paga +R$${(despesas * (selicRate * 2.5 / 100) / 12).toFixed(2)}/mês de juros` : ' — capital de giro inviável para PME'}`,
          },
          {
            label: 'IPCA', value: `${fmtDec(ipcaRate, 2)}%`, color: ipcaRate > 4 ? AMBER : GREEN,
            desc: despesas > 0 ? `Suas despesas em 12 meses serão R$${fmt(Math.round(despesas * (1 + ipcaRate / 100)))} — R$${fmt(Math.round(despesas * ipcaRate / 100))} a mais pelo IPCA` : `Inflação ${ipcaRate > 4.75 ? 'acima da meta — poder de compra do cliente caindo' : 'dentro da meta — consumo estável'}`,
          },
          {
            label: 'USD/BRL', value: `R$${fmtDec(usdRate, 2)}`, color: usdRate > 5.5 ? RED : usdRate > 5 ? AMBER : GREEN,
            desc: `Insumos importados ${usdRate > 5.5 ? `${((usdRate / 4.5 - 1) * 100).toFixed(0)}% mais caros vs R$4,50 (2022)` : usdRate > 5 ? 'atenção ao câmbio — pressão moderada' : 'câmbio favorável para importação'}`,
          },
          {
            label: 'CDI vs ROI', value: decisaoCDI ? '⚠ CDI > ROI' : '✓ ROI > CDI', color: decisaoCDI ? AMBER : GREEN,
            desc: caixa > 0 ? `Caixa de R$${fmt(caixa)} rende R$${cdiRendimento.toFixed(2)}/mês no CDI (${fmtDec(cdiMensal, 4)}%/mês)${decisaoCDI ? ' — mais que seu ROI' : ''}` : 'Insira o Caixa Disponível para comparar com o CDI',
          },
        ].map(c => (
          <div key={c.label} className="rounded-lg p-2.5" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${c.color}` }}>
            <div style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: c.color, marginBottom: 2 }}>{c.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'monospace', color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 3, lineHeight: 1.5 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      {/* Setor do usuário em destaque */}
      {userSector && (() => {
        const ctx = SECTOR_CONTEXT[userSector.id]
        const hl = heatLabel(userSector.heat)
        return (
          <div className="rounded-lg p-3" style={{ background: 'rgba(93,173,226,0.06)', border: '1px solid rgba(93,173,226,0.2)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#5dade2', boxShadow: '0 0 5px #5dade2' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#5dade2' }}>Seu setor: {userSector.label ?? userSector.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: hl.color, background: `${hl.color}18`, padding: '1px 6px', borderRadius: 4 }}>{hl.text}</span>
                <span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color: hl.color }}>{userSector.heat}/100</span>
              </div>
            </div>
            <div className="h-[3px] rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div className="h-full rounded-full" style={{ background: '#5dade2' }}
                initial={{ width: 0 }} animate={{ width: `${(userSector.heat / 100) * 100}%` }} transition={{ duration: 0.7 }} />
            </div>
            {ctx && (
              <>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, marginBottom: 6 }}>{ctx.why}</p>
                <div className="rounded-md px-2.5 py-2" style={{ background: `${hl.color}10`, borderLeft: `2px solid ${hl.color}` }}>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                    <span style={{ color: hl.color, fontWeight: 700 }}>O que isso significa para você: </span>
                    {ctx.impact(userSector.heat)}
                  </p>
                </div>
              </>
            )}
          </div>
        )
      })()}

      {/* Impactos cruzados: seus dados × mercado */}
      <div className="rounded-lg overflow-hidden" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-3 pt-2.5 pb-1 border-b border-white/5">
          <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>IMPACTO NO SEU NEGÓCIO</span>
        </div>
        <div className="px-3 py-2.5 flex flex-col gap-2">
          {crossInsights.map((c, i) => (
            <div key={i} className="rounded-md px-2.5 py-2" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: `3px solid ${c.color}` }}>
              <div style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: c.color, marginBottom: 3 }}>{c.cross}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{c.insight}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Input numérico com estado local de string — permite digitar e ver 0 explicitamente
function parseBR(v: string): number {
  const s = v.trim()
  if (!s) return 0
  // "1.500,50" ou "1500,50" → vírgula = decimal
  if (s.includes(',')) return parseFloat(s.replace(/\./g, '').replace(',', '.')) || 0
  // "1.500" com 3 dígitos após ponto → separador de milhar
  const parts = s.split('.')
  if (parts.length === 2 && parts[1].length === 3 && !parts[1].includes(',')) return parseFloat(s.replace('.', '')) || 0
  return parseFloat(s) || 0
}

function NumInput({ label, value, onChange, prefix = 'R$', info }: { label: string; value: number; onChange: (v: number) => void; prefix?: string; info?: string }) {
  const [str, setStr] = useState(value === 0 ? '' : String(value))

  // Sincroniza quando valor externo muda (ex: reset)
  const prevRef = useRef(value)
  if (prevRef.current !== value) {
    prevRef.current = value
    const parsed = str === '' ? 0 : parseBR(str)
    if (parsed !== value) setStr(value === 0 ? '' : String(value))
  }

  return (
    <div className="flex flex-col gap-1">
      <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.02em' }}>{label}</label>
      <div className="flex items-center gap-2 rounded-lg px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.1)' }}>
        {prefix && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', userSelect: 'none', flexShrink: 0 }}>{prefix}</span>}
        <input
          type="text"
          inputMode="decimal"
          value={str}
          placeholder="0"
          onChange={e => { setStr(e.target.value); onChange(parseBR(e.target.value)) }}
          className="bg-transparent outline-none flex-1 min-w-0"
          style={{ fontSize: 15, fontFamily: 'monospace', color: '#fff', border: 'none' }}
        />
      </div>
      {info && <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', lineHeight: 1.4, marginTop: 1 }}>{info}</p>}
    </div>
  )
}

// Ticker de agentes globais e commodities com impacto no negócio
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AgentsTicker({ marketData }: { marketData: any }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const agents = (marketData?.globalAgents ?? []) as Array<{ id: string; label: string; delta: number; value?: number }>
  // commodities vem como objeto {gold:{...}, oil:{...}} — convertemos para array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const commodities = Object.entries(marketData?.commodities ?? {}).map(([id, c]: [string, any]) => ({ id, ...c })) as Array<{ id: string; label: string; delta: number; value?: number }>

  const AGENT_IMPACT: Record<string, (d: number) => string> = {
    meta:  d => d < 0 ? `Meta ▼${Math.abs(d).toFixed(2)}% — CPM pode cair: janela para escalar ads` : `Meta ▲${d.toFixed(2)}% — CPM subindo: cautela em paid media`,
    googl: d => d < 0 ? `Google ▼${Math.abs(d).toFixed(2)}% — CPC pode cair: oportunidade em search` : `Google ▲${d.toFixed(2)}% — CPC subindo: revisar bids`,
    aapl:  d => d < 0 ? `Apple ▼${Math.abs(d).toFixed(2)}% — consumidor premium recuando: demanda discricionária cai` : `Apple ▲${d.toFixed(2)}% — consumo premium aquecido`,
    amzn:  d => d < 0 ? `Amazon ▼${Math.abs(d).toFixed(2)}% — e-commerce desacelerando: menos demanda inbound` : `Amazon ▲${d.toFixed(2)}% — e-commerce aquecido`,
    vale:  d => d < 0 ? `Vale ▼${Math.abs(d).toFixed(2)}% — China desacelerando: câmbio pode pressionar` : `Vale ▲${d.toFixed(2)}% — commodities aquecidas: PIB favorável`,
    petr:  d => d < 0 ? `Petrobras ▼${Math.abs(d).toFixed(2)}% — combustível pode cair: frete mais barato` : `Petrobras ▲${d.toFixed(2)}% — combustível subindo: frete mais caro`,
  }
  const COMMODITY_IMPACT: Record<string, (d: number, v?: number) => string> = {
    oil:    (d, v) => d < 0 ? `Petróleo $${v?.toFixed(2) ?? '?'} ▼${Math.abs(d).toFixed(2)}% — frete ~2% mais barato nos próximos 7 dias` : `Petróleo $${v?.toFixed(2) ?? '?'} ▲${d.toFixed(2)}% — custo de energia e frete subindo`,
    gold:   (d)   => d < 0 ? `Ouro ▼${Math.abs(d).toFixed(2)}% — confiança aumenta: capital volta ao risco` : `Ouro ▲${d.toFixed(2)}% — busca por segurança: aversão a risco`,
    copper: (d)   => d < 0 ? `Cobre ▼${Math.abs(d).toFixed(2)}% — desaceleração industrial: indicador antecedente de recessão` : `Cobre ▲${d.toFixed(2)}% — demanda industrial aquecida`,
    lithium:(d)   => d < 0 ? `Lítio ▼${Math.abs(d).toFixed(2)}% — excesso de oferta de EVs: tecnologia de bateria barateia` : `Lítio ▲${d.toFixed(2)}% — mercado de EVs aquecido`,
    silver: (d)   => d < 0 ? `Prata ▼${Math.abs(d).toFixed(2)}% — menor demanda industrial` : `Prata ▲${d.toFixed(2)}% — demanda industrial ou proteção`,
    grains: (d)   => d < 0 ? `Grãos ▼${Math.abs(d).toFixed(2)}% — alívio na cesta básica: poder de compra do consumidor melhora` : `Grãos ▲${d.toFixed(2)}% — pressão na cesta básica: consumo discreto cai`,
  }

  const items = [
    ...agents.map(a => ({ text: AGENT_IMPACT[a.id]?.(a.delta) ?? `${a.label} ${a.delta >= 0 ? '▲' : '▼'}${Math.abs(a.delta).toFixed(2)}%`, urgent: Math.abs(a.delta) > 1 })),
    ...commodities.map(c => ({ text: COMMODITY_IMPACT[c.id]?.(c.delta, c.value) ?? `${c.label} ${c.delta >= 0 ? '▲' : '▼'}${Math.abs(c.delta).toFixed(2)}%`, urgent: Math.abs(c.delta) > 2 })),
  ].filter(i => i.text)

  if (items.length === 0) return null

  // Duplicate for seamless loop
  const allItems = [...items, ...items]

  return (
    <div className="rounded-lg overflow-hidden" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <div style={{ display: 'flex', gap: 0, animation: `tickerScroll ${Math.max(items.length * 8, 30)}s linear infinite`, width: 'max-content' }}>
          {allItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2" style={{ borderRight: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
              <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: item.urgent ? '#e74c3c' : 'rgba(255,255,255,0.25)', letterSpacing: '0.05em' }}>◆</span>
              <span style={{ fontSize: 11, fontFamily: 'monospace', color: item.urgent ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Benchmarks por fase + setor combinados
function buildBenchmark(fase: string, setores: string[], produtos: string[], revenue: string, nome: string): string {
  const setor = setores[0] ?? ''
  const produto = produtos[0] ?? ''
  const isSaaS = ['App/SaaS', 'Digital/SaaS', 'SaaS', 'App'].some(p => produtos.includes(p) || produto.includes(p))
  const isConsult = ['Consultoria', 'Agência'].some(s => setores.includes(s))
  const isEdu = ['Educação', 'Infoproduto', 'Conteúdo'].some(s => setores.includes(s))

  const faseLabel: Record<string, string> = {
    validacao: 'Validação', mei: 'MEI', slu: 'SLU', startup: 'Startup', ltda: 'LTDA',
  }

  const benchmarks: Record<string, { meta: string; runway: string; margem: string; ltvcac: string }> = {
    validacao: { meta: 'primeiro cliente pagante', runway: '3+ meses de caixa', margem: 'qualquer margem positiva', ltvcac: 'LTV/CAC > 1x' },
    mei:       { meta: 'faturar acima do break-even', runway: '3+ meses', margem: '>20%', ltvcac: '>2x' },
    slu:       { meta: 'escalar com margem saudável', runway: '6+ meses', margem: '>25%', ltvcac: '>3x' },
    startup:   { meta: 'crescimento + retenção', runway: '12+ meses', margem: '>30% bruta', ltvcac: '>3x obrigatório' },
    ltda:      { meta: 'eficiência e ROI acima do CDI', runway: '6+ meses', margem: '>35%', ltvcac: '>5x' },
  }

  const b = benchmarks[fase] ?? benchmarks['validacao']
  const tipoNeg = isSaaS ? 'SaaS/App' : isConsult ? 'Consultoria' : isEdu ? 'Infoproduto/Educação' : setor || produto || 'Negócio'
  const cacRef = isSaaS ? 'R$50–150' : isConsult ? 'R$80–300' : isEdu ? 'R$20–80' : 'R$50–200'
  const ticketRef = isSaaS ? 'R$29–199/mês' : isConsult ? 'R$500–5.000/projeto' : isEdu ? 'R$97–497' : 'variável'

  return `${nome ? nome + ' · ' : ''}${faseLabel[fase] ?? fase} · ${tipoNeg}${revenue ? ' · ' + revenue : ''}
  Meta desta fase: ${b.meta}
  Benchmarks: Runway ${b.runway} | Margem ${b.margem} | ${b.ltvcac}
  Referência de mercado: CAC típico ${cacRef} | Ticket típico ${ticketRef}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CockpitFinanceiro({ marketData, userProfile, cockpitAlerts }: { marketData: any; userProfile?: any; cockpitAlerts?: string[] }) {
  const { data, update } = useWorkspaceData('cockpit', ZERO_DEFAULT)
  const { user } = useAuth()
  const [showCalib,     setShowCalib]     = useState(false)
  const [modoManual,    setModoManual]    = useState(false)
  const [iaLoading,     setIaLoading]     = useState(false)
  const [iaCooldown,    setIaCooldown]    = useState(0)
  const [iaResponse,    setIaResponse]    = useState('')

  // Countdown tick
  useEffect(() => {
    if (iaCooldown <= 0) return
    const t = setTimeout(() => setIaCooldown(c => Math.max(0, c - 1)), 1000)
    return () => clearTimeout(t)
  }, [iaCooldown])
  const [pdfLoading,    setPdfLoading]    = useState(false)
  const [showSave,      setShowSave]      = useState(false)
  const [saveNome,      setSaveNome]      = useState('')
  const [savingArq,     setSavingArq]     = useState(false)
  const [savedOk,       setSavedOk]       = useState(false)
  const pdfRef = useRef<HTMLDivElement>(null)

  // Inputs financeiros base
  const receita   = data.receita   ?? 0; const setReceita   = (v: number) => update({ receita: v })
  const despesas  = data.despesas  ?? 0; const setDespesas  = (v: number) => update({ despesas: v })
  const caixa     = data.caixa     ?? 0; const setCaixa     = (v: number) => update({ caixa: v })

  // Inputs operacionais (para cálculo automático)
  const clientesAtivos  = data.clientesAtivos  ?? 0; const setClientesAtivos  = (v: number) => update({ clientesAtivos: v })
  const novosClientes   = data.novosClientes   ?? 0; const setNovosClientes   = (v: number) => update({ novosClientes: v })
  const clientesPerdidos = data.clientesPerdidos ?? 0; const setClientesPerdidos = (v: number) => update({ clientesPerdidos: v })
  const verbaMkt        = data.verbaMkt        ?? 0; const setVerbaMkt        = (v: number) => update({ verbaMkt: v })

  // Inputs manuais (modo override)
  const cacManual    = data.cacManual    ?? 0; const setCacManual    = (v: number) => update({ cacManual: v })
  const ticketManual = data.ticketManual ?? 0; const setTicketManual = (v: number) => update({ ticketManual: v })
  const churnManual  = data.churnManual  ?? 0; const setChurnManual  = (v: number) => update({ churnManual: v })

  // Calibragem de contexto (Smart Setup) — multi-select com migração de dados legados
  // Array.isArray preserva [] vazio corretamente (data.modelosReceita?.length falha com [])
  const modelosReceita: string[] = Array.isArray(data.modelosReceita) ? data.modelosReceita : (data.modeloReceita ? [data.modeloReceita] : [])
  const objetivos: string[]      = Array.isArray(data.objetivos)      ? data.objetivos      : (data.objetivoAtual  ? [data.objetivoAtual]  : [])

  const toggleModelo = (v: string) => {
    const next = modelosReceita.includes(v) ? modelosReceita.filter(x => x !== v) : [...modelosReceita, v]
    update({ modelosReceita: next })
  }
  const toggleObjetivo = (v: string) => {
    const next = objetivos.includes(v) ? objetivos.filter(x => x !== v) : [...objetivos, v]
    update({ objetivos: next })
  }

  const faseNegocio      = data.faseNegocio      ?? ''; const setFaseNegocio      = (v: string) => update({ faseNegocio: v })
  const motivoCaixaZero  = data.motivoCaixaZero  ?? ''; const setMotivoCaixaZero  = (v: string) => update({ motivoCaixaZero: v })
  const ticketProjetado  = data.ticketProjetado  ?? 0;  const setTicketProjetado  = (v: number) => update({ ticketProjetado: v })
  const margemEstimada   = data.margemEstimada   ?? 0;  const setMargemEstimada   = (v: number) => update({ margemEstimada: v })
  // Calibragem profunda
  const naturezaCobranca  = data.naturezaCobranca  ?? ''; const setNaturezaCobranca  = (v: string) => update({ naturezaCobranca: v })
  const cicloMedioMeses   = data.cicloMedioMeses   ?? 0;  const setCicloMedioMeses   = (v: number) => update({ cicloMedioMeses: v })
  const complexidadeVenda: string[] = Array.isArray(data.complexidadeVenda) ? data.complexidadeVenda : (data.complexidadeVenda ? [data.complexidadeVenda as string] : [])
  const toggleComplexidade = (v: string) => {
    const next = complexidadeVenda.includes(v) ? complexidadeVenda.filter(x => x !== v) : [...complexidadeVenda, v]
    update({ complexidadeVenda: next })
  }
  const aporteMensal      = data.aporteMensal      ?? 0;  const setAporteMensal      = (v: number) => update({ aporteMensal: v })
  const cargaTributaria   = data.cargaTributaria   ?? 0;  const setCargaTributaria   = (v: number) => update({ cargaTributaria: v })

  // Cálculo automático ou manual
  const ticketMedio = modoManual ? ticketManual : (clientesAtivos > 0 ? receita / clientesAtivos : 0)
  const cac         = modoManual ? cacManual    : (novosClientes > 0  ? verbaMkt / novosClientes  : 0)
  const churnMensal = modoManual ? churnManual  : (clientesAtivos > 0 ? (clientesPerdidos / clientesAtivos) * 100 : 0)

  // 3-layer fallback helpers (Real → Calibragem → Benchmark)
  // Agrega múltiplos modelos em 1 benchmark combinado
  const bmList = modelosReceita.map(m => MODEL_BENCHMARKS[m]).filter(Boolean) as Array<typeof MODEL_BENCHMARKS[string]>
  const bm = bmList.length === 0 ? null : bmList.length === 1 ? bmList[0] : {
    label:     bmList.map(b => b.label.split(' /')[0]).join(' + '),
    margemRef: Math.round(bmList.reduce((s, b) => s + b.margemRef, 0) / bmList.length),
    churnRef:  Math.round(bmList.reduce((s, b) => s + b.churnRef,  0) / bmList.length),
    ltvMult:   Math.max(...bmList.map(b => b.ltvMult)),
    cacTeto:   Math.min(...bmList.map(b => b.cacTeto)),
    ticketRef: Math.round(bmList.reduce((s, b) => s + b.ticketRef, 0) / bmList.length),
    churnDesc: 'combinado',
  }
  const ticketEfetivo    = ticketMedio > 0 ? ticketMedio : ticketProjetado > 0 ? ticketProjetado : (bm?.ticketRef ?? 0)
  const calibragemMargem = margemEstimada > 0 ? margemEstimada / 100 : bm ? bm.margemRef / 100 : 0.30

  const selicRate = marketData?.macro?.selic?.value  ?? 14.75
  const ipcaRate  = marketData?.macro?.ipca?.value   ?? 4.14
  const usdRate   = marketData?.macro?.usdBrl?.value ?? 4.98

  // Contexto do onboarding — necessário antes das refs de mercado
  const nomeNegocio = userProfile?.nomeNegocio || userProfile?.nome_negocio || userProfile?.sectors?.[0] || ''
  const fase    = userProfile?.subtype  ?? ''
  const setores = userProfile?.sectors  ?? []
  const produtos = userProfile?.product ?? []
  const revenue  = userProfile?.revenue ?? ''

  // ── Referências de mercado (fallback quando dado do usuário é 0) ───────────
  const cacRefNum    = marketData?.marketing?.cacTrend?.value     ?? 49
  const churnRefNum  = 4.2
  const ltvRefNum    = 156
  const cpmUsdVal    = marketData?.marketing?.cpmGlobal?.value    ?? 0
  const cpcUsdVal    = marketData?.marketing?.cpcGlobal?.value    ?? 0
  const organicPct   = marketData?.marketing?.organicShare?.value ?? 0
  const organicDelta = marketData?.marketing?.organicShare?.delta ?? 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const platforms    = (marketData?.platforms ?? []) as Array<{ id: string; label: string; cpm: number; delta: number }>

  // Setor do usuário no mercado
  const userSectorIdMain = SECTOR_MAP[setores[0] ?? ''] ?? null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userSectorMain   = userSectorIdMain ? (marketData?.sectors ?? []).find((s: any) => s.id === userSectorIdMain) : null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sectorHeat       = (userSectorMain as any)?.heat ?? 50
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sectorLabel      = (userSectorMain as any)?.label ?? setores[0] ?? ''

  // Valores efetivos: dado real do usuário ou referência de mercado
  const cacEfetivo       = cac > 0 ? cac : cacRefNum
  const churnEfetivo     = churnMensal > 0 ? churnMensal : churnRefNum
  const cacIsEstimado    = cac === 0
  const churnIsEstimado  = churnMensal === 0
  // Churn implícito via ciclo médio de permanência (quando churn real = 0 e ciclo informado)
  const churnImplicito = churnMensal === 0 && cicloMedioMeses > 0 ? 100 / cicloMedioMeses : 0
  const churnParaLTV   = churnMensal > 0 ? churnMensal : churnImplicito > 0 ? churnImplicito : churnRefNum

  // Fórmulas de sensibilidade (sempre calculadas, independem de dados completos)
  const taxaRealExata    = ((1 + selicRate / 100) / (1 + ipcaRate / 100) - 1) * 100
  const burnReal         = despesas > 0 ? despesas + despesas * (selicRate / 100) * 0.2 : 0
  const cacAjustado      = cacEfetivo * (usdRate / 4.50)
  const cpmReais         = cpmUsdVal * usdRate
  const custoGiroMensal  = despesas > 0 ? despesas * (selicRate * 2.5 / 100) / 12 : 0

  const metrics = useMemo(() => {
    // ── COALESCE: margem — se receita=0, usa calibragem/benchmark ──
    const margemIsEstimada = receita === 0
    const margemBruta      = receita > 0 ? (receita - despesas) / receita * 100 : calibragemMargem * 100
    // Margem líquida: desconta carga tributária + taxas de transação se informada
    const margemLiquida    = cargaTributaria > 0 ? Math.max(margemBruta - cargaTributaria, 0) : margemBruta
    const margemDecimal    = margemLiquida / 100
    const margem           = margemLiquida
    const lucro            = receita - despesas
    const burnLiquido      = despesas - receita

    // ── ENGRENAGEM 3: Runway com Aporte ──────────────────────────────────
    const burnParaRunway    = burnReal > 0 ? burnReal : (despesas > 0 ? despesas : 0)
    const cobertura         = receita + aporteMensal  // total de caixa que entra por mês
    const burnEfetivo       = Math.max(0, burnParaRunway - aporteMensal)  // burn que não é coberto pela receita normal já está em burnParaRunway
    const runwayProtegido   = aporteMensal > 0 && aporteMensal >= burnParaRunway && lucro < 0
    const runway            = runwayProtegido
      ? 999
      : burnEfetivo > 0
        ? (cobertura >= burnParaRunway ? 999 : Math.max(0, caixa / burnEfetivo))
        : (lucro >= 0 ? 999 : 0)
    // Caixa zerado explicado pelo usuário → não é crise, é contexto
    const runwayExplicado   = runway === 0 && despesas > 0 && !runwayProtegido &&
      ['zerado-intencional', 'lancando', 'pre-receita'].includes(motivoCaixaZero)
    const runwayCritico     = runway === 0 && despesas > 0 && !runwayProtegido && !runwayExplicado

    // ── LTV por natureza de cobrança ──────────────────────────────────────
    const margemLtv      = Math.max(margemDecimal, 0.1)
    const ltvMult        = bm?.ltvMult ?? 1
    const ltv = naturezaCobranca === 'unica'
      // Venda única: LTV = ticket × margem (sem recorrência, sem divisor de churn)
      ? (ticketEfetivo > 0 ? ticketEfetivo * margemLtv : ltvRefNum)
      : ticketEfetivo > 0 && churnParaLTV > 0
        // Recorrente/híbrido: fórmula clássica churn
        ? (ticketEfetivo * margemLtv) / (churnParaLTV / 100)
        : bm && ticketEfetivo > 0
        ? ticketEfetivo * margemLtv * ltvMult
        : ltvRefNum

    const ltvCac         = cacEfetivo > 0 && ltv > 0 ? ltv / cacEfetivo : 0
    const burnRatio      = receita > 0 ? 1 - despesas / receita : 0
    const runwayParaNorm = runwayProtegido ? 12 : (runway === 999 ? 24 : runway)
    const runwayNorm     = Math.min(runwayParaNorm / 24, 1) * 100
    const ltvCacNorm     = Math.min(ltvCac / 5, 1) * 100
    const burnNorm       = Math.max(burnRatio, 0) * 100
    const semDados       = receita === 0 && despesas === 0 && caixa === 0 && aporteMensal === 0
    const healthBase     = semDados ? 0 : Math.round(margem * 0.22 + runwayNorm * 0.35 + ltvCacNorm * 0.18 + burnNorm * 0.12)
    const sectorBonus    = Math.round((sectorHeat / 100) * 13)
    const healthScore    = semDados ? 0 : Math.min(100, healthBase + sectorBonus)

    // ── ENGRENAGEM 1: Break-even Universal ───────────────────────────────
    const burnBase       = burnReal > 0 ? burnReal : (despesas > 0 ? despesas : 0)
    const breakeven      = burnBase > 0
      ? (receita === 0 ? despesas : burnBase / (1 - Math.max(margemDecimal, 0.05)))
      : 0
    const breakevenAlert = receita > 0 && breakeven > receita
    const breakevenMeta  = receita === 0 && despesas > 0

    // ── ENGRENAGEM 2: ROI Anualizado baseado em LTV/CAC ──────────────────
    const cacAdj            = cacEfetivo * (usdRate / 4.50)
    const roi               = cacAdj > 0 ? ((ltv - cacAdj) / cacAdj) * 12 * 100 : 0
    const roiIneficiente    = receita > 0 && roi < selicRate && (despesas > 0 || receita > 0)
    const roiSemValidacao   = receita === 0 && (despesas > 0)

    // ── ENGRENAGEM 4: Margem Real Fisher ──────────────────────────────────
    const margemReal     = margem - taxaRealExata

    return { margem, margemIsEstimada, lucro, runway, runwayCritico, runwayProtegido, runwayExplicado, burnLiquido, healthScore, ltvCac, ltv, breakeven, roi, roiIneficiente, roiSemValidacao, breakevenAlert, breakevenMeta, semDados, margemReal }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receita, despesas, caixa, cacEfetivo, ticketMedio, ticketEfetivo, churnEfetivo, churnParaLTV, ltvRefNum, sectorHeat, taxaRealExata, burnReal, usdRate, selicRate, calibragemMargem, bm, aporteMensal, cargaTributaria, naturezaCobranca, motivoCaixaZero])

  // origem: verde = seus dados, amarelo = ref.mercado, azul = calculado/fundido
  const O_REAL  = { text: 'seus dados',   color: GREEN }
  const O_REF   = { text: 'ref. mercado', color: AMBER }
  const O_CALC  = { text: 'calculado',    color: '#5dade2' }
  const O_FUND  = { text: 'fundido',      color: '#5dade2' }

  const sanityAlerts = useMemo(() => {
    const alerts: Array<{ field: string; msg: string; tip: string }> = []
    if (despesas > 0 && despesas < 150) {
      alerts.push({
        field: 'Despesas',
        msg: `Despesas R$${fmtDec(despesas, 2)} — valor impossível para operar`,
        tip: 'O que você esqueceu de incluir: pró-labore ou horas suas, aluguel/home office, ferramentas e softwares, impostos e taxas, fornecedores, plataformas de venda, marketing',
      })
    }
    if (receita > 0 && despesas === 0) {
      alerts.push({
        field: 'Despesas',
        msg: `Receita R$${fmt(receita)} com despesas R$0 — impossível`,
        tip: 'Todo negócio tem custos. Inclua pelo menos: pró-labore, ferramentas, impostos e custo de entrega do produto ou serviço',
      })
    }
    if (receita > 0 && despesas > 0 && metrics.margem > 95) {
      alerts.push({
        field: 'Margem',
        msg: `Margem ${fmtDec(metrics.margem, 1)}% — número irreal`,
        tip: 'Só infoprodutos chegam perto de 87%. Revise: impostos, gateway de pagamento, custo de suporte e entrega estão nas despesas?',
      })
    }
    if (complexidadeVenda.includes('consultivo') && cacEfetivo > 0 && ticketEfetivo > 0 && cacEfetivo > ticketEfetivo * 0.2) {
      alerts.push({
        field: 'CAC × Ticket',
        msg: `CAC R$${fmt(Math.round(cacEfetivo))} = ${fmtDec(cacEfetivo / ticketEfetivo * 100, 0)}% do ticket — modelo consultivo insustentável`,
        tip: 'Venda consultiva exige vendedor, proposta e reuniões — custo alto que precisa de ticket alto para compensar. Meta: CAC < 20% do ticket',
      })
    }
    if (verbaMkt > 100 && novosClientes === 0) {
      alerts.push({
        field: 'Marketing',
        msg: `R$${fmt(Math.round(verbaMkt))}/mês em marketing com 0 novos clientes — CAC infinito`,
        tip: 'Gasto em tráfego pago sem conversão queima caixa sem retorno. Pause a verba, revise a oferta e a landing page antes de reativar',
      })
    }
    return alerts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receita, despesas, metrics.margem, complexidadeVenda.join(','), cacEfetivo, ticketEfetivo, verbaMkt, novosClientes])

  const metricCards = useMemo(() => [
    { label: 'Health Score',   value: `${metrics.healthScore}/100`,  color: colorByRange(metrics.healthScore, 70, 40), desc: sanityAlerts.length > 0 ? `⚠ Dados incompletos — corrija os avisos abaixo para um diagnóstico confiável` : `Nota geral do negócio (0–100): pondera margem, runway, LTV/CAC, setor e burn. >70 = saudável`, origin: O_FUND },
    { label: 'Margem',         value: `${fmtDec(metrics.margem, 2)}%`, color: colorByRange(metrics.margem, 20, 10),   desc: metrics.margemIsEstimada ? `Estimada (referência do modelo) — preencha Receita para valor real` : `De cada R$100 de receita, R$${(metrics.margem).toFixed(0)} sobram após pagar as despesas`, origin: metrics.margemIsEstimada ? O_REF : receita > 0 && despesas > 0 ? O_REAL : O_CALC },
    { label: 'Runway',
      value: metrics.runwayProtegido ? 'Protegido — aporte ativo'
           : metrics.runwayExplicado  ? (motivoCaixaZero === 'zerado-intencional' ? 'Zerado — reinvestindo' : motivoCaixaZero === 'lancando' ? 'Investindo agora' : 'Pré-receita')
           : metrics.runwayCritico    ? '0,0 meses ⚠'
           : metrics.runway >= 999    ? '∞ meses'
           : `${fmtDec(metrics.runway, 2)} meses`,
      color: metrics.runwayProtegido ? GREEN
           : metrics.runwayExplicado  ? BLUE
           : metrics.runwayCritico    ? RED
           : colorByRange(Math.min(metrics.runway, 99), 6, 3),
      desc: metrics.runwayProtegido ? `Aporte R$${fmt(aporteMensal)}/mês cobre o burn — sem prazo de extinção imediato`
          : metrics.runwayExplicado  ? (motivoCaixaZero === 'zerado-intencional' ? 'Caixa zerado por escolha — você reinveste tudo. Risco: sem reserva para imprevistos.' : motivoCaixaZero === 'lancando' ? 'Caixa consumido pelo investimento no crescimento. Controle o burn rate.' : 'Fase pré-receita — sem caixa operacional ainda, normal nesta fase.')
          : metrics.runwayCritico    ? 'CRÍTICO — o caixa zerou com despesas ativas. Sem receita ou aporte, o negócio para.'
          : `Quantos meses o caixa aguenta no ritmo atual de gastos. Mínimo saudável: 6 meses`,
      origin: caixa > 0 || despesas > 0 || aporteMensal > 0 ? O_REAL : O_CALC },
    { label: 'Lucro Mensal',   value: `R$${fmt(metrics.lucro)}`,     color: metrics.lucro >= 0 ? GREEN : RED,         desc: `O que sobra (ou falta) no mês: receita menos todas as despesas. Negativo = prejuízo operacional`, origin: receita > 0 || despesas > 0 ? O_REAL : O_CALC },
    { label: 'Burn Líquido',   value: metrics.burnLiquido > 0 ? `-R$${fmt(metrics.burnLiquido)}/mês` : `+R$${fmt(Math.abs(metrics.burnLiquido))}/mês`, color: metrics.burnLiquido > 0 ? RED : GREEN, desc: metrics.burnLiquido > 0 ? `Você está gastando R$${fmt(metrics.burnLiquido)} a mais do que ganha por mês` : `Você está gerando R$${fmt(Math.abs(metrics.burnLiquido))} de sobra por mês`, origin: despesas > 0 ? O_REAL : O_CALC },
    { label: 'LTV/CAC',        value: `${fmtDec(metrics.ltvCac, 2)}x`, color: colorByRange(metrics.ltvCac, 3, 1),    desc: `Para cada R$1 gasto para adquirir um cliente, você recupera R$${fmtDec(metrics.ltvCac, 1)}. Meta mínima: 3x${cacIsEstimado || metrics.margemIsEstimada ? ' (dados estimados)' : ''}`, origin: cacIsEstimado || churnIsEstimado ? O_FUND : O_CALC },
    { label: 'Break-even',     value: `R$${fmt(metrics.breakeven)}`, color: metrics.breakevenAlert ? RED : metrics.breakevenMeta ? AMBER : BLUE, desc: metrics.breakevenAlert ? `⚠ Você precisa aumentar receita em R$${fmt(metrics.breakeven - receita)} para cobrir os custos` : metrics.breakevenMeta ? `Quanto você precisa faturar por mês para sobreviver (cobrir todas as despesas)` : `Receita mínima para cobrir todos os custos com a margem atual`, origin: despesas > 0 ? O_FUND : O_CALC },
    { label: 'ROI Anualizado', value: `${fmtDec(metrics.roi, 2)}%`,  color: metrics.roiSemValidacao ? AMBER : metrics.roiIneficiente ? AMBER : metrics.roi >= 0 ? GREEN : RED, desc: metrics.roiSemValidacao ? `⚠ Estimado — sem receita real para confirmar. Preencha Receita` : metrics.roiIneficiente ? `⚠ Seu retorno anual é menor que a SELIC ${selicRate}% — o banco paga mais que seu negócio` : `Retorno anual do capital investido em aquisição de clientes`, origin: O_FUND },
    { label: 'Ticket Médio',   value: `R$${fmt(ticketEfetivo)}`,     color: ticketMedio > 0 ? BLUE : ticketEfetivo > 0 ? AMBER : AMBER, desc: ticketMedio > 0 ? `Valor médio que cada cliente paga por mês (receita ÷ clientes ativos)` : ticketProjetado > 0 ? `Ticket que você projetou na calibragem` : bm ? `Referência do modelo ${bm.label}` : `Preencha Receita + Clientes Ativos para calcular`, origin: ticketMedio > 0 ? O_REAL : ticketEfetivo > 0 ? O_REF : null },
    { label: 'CAC',            value: `R$${fmt(cacEfetivo)}`,        color: cac > 0 ? BLUE : AMBER,                  desc: cac > 0 ? `Quanto você gasta para conquistar 1 novo cliente (verba ÷ novos clientes)` : `Referência de mercado — preencha Verba Mkt + Novos Clientes para o seu dado real`, origin: cacIsEstimado ? O_REF : O_REAL },
    { label: 'Churn',          value: `${fmtDec(churnEfetivo, 2)}%`, color: colorByRange(100 - churnEfetivo, 95, 90), desc: churnIsEstimado ? `Referência de mercado — preencha Clientes Ativos + Perdidos para o real` : `% de clientes que saíram este mês. Cada 1% a mais dobra o custo de crescimento`, origin: churnIsEstimado ? O_REF : O_REAL },
    { label: 'LTV',            value: `R$${fmt(Math.round(metrics.ltv))}`, color: metrics.ltv > 0 ? GREEN : AMBER,  desc: `Quanto um cliente vale no total enquanto fica com você (ticket × margem ÷ churn)`, origin: churnIsEstimado || ticketMedio === 0 ? O_FUND : O_CALC },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [metrics, sanityAlerts, sectorHeat, receita, despesas, caixa, cacEfetivo, churnEfetivo, ticketMedio, cac, cacIsEstimado, churnIsEstimado, modoManual, selicRate, motivoCaixaZero, aporteMensal])

  const benchmark = useMemo(
    () => fase ? buildBenchmark(fase, setores, produtos, revenue, nomeNegocio) : '',
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fase, setores.join(','), produtos.join(','), revenue, nomeNegocio]
  )

  const exportPDF = async () => {
    if (!pdfRef.current) return
    setPdfLoading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF }   = await import('jspdf')
      const canvas = await html2canvas(pdfRef.current, { backgroundColor: '#0a0f1e', scale: 2, useCORS: true, logging: false })
      const imgData = canvas.toDataURL('image/png')
      const pdf  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = (canvas.height * pdfW) / canvas.width
      const dataAtual = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      pdf.setFillColor(10, 15, 30)
      pdf.rect(0, 0, pdfW, 14, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`COCKPIT FINANCEIRO — ${(nomeNegocio || 'IPB').toUpperCase()}`, 8, 9)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(120, 140, 160)
      pdf.text(`Health Score: ${metrics.healthScore}/100  |  ${dataAtual}`, pdfW - 8, 9, { align: 'right' })
      pdf.addImage(imgData, 'PNG', 0, 14, pdfW, pdfH)
      pdf.save(`cockpit-${(nomeNegocio || 'ipb').toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`)
    } finally {
      setPdfLoading(false)
    }
  }

  const handleIA = async () => {
    setIaLoading(true)
    setIaResponse('')
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 25000)
    try {
      const pibRate      = marketData?.macro?.pib?.value           ?? 1.9
      const cpmUsd       = marketData?.marketing?.cpmGlobal?.value ?? 0
      const cacRef       = marketData?.marketing?.cacTrend?.value  ?? 0
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const platforms    = (marketData?.platforms ?? []) as Array<{ id: string; label: string; cpm: number; delta: number }>
      const userSectorIdIA  = SECTOR_MAP[setores[0] ?? ''] ?? null
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userSectorData  = userSectorIdIA ? (marketData?.sectors ?? []).find((s: any) => s.id === userSectorIdIA) : null
      const sectorHeatIA    = (userSectorData as any)?.heat  ?? 0
      const sectorLabelIA   = (userSectorData as any)?.label ?? setores[0] ?? 'não definido'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bestPlatform    = platforms.length > 0 ? platforms.reduce((a: any, b: any) => (a.cpm ?? 999) < (b.cpm ?? 999) ? a : b) : null

      const taxaRealIA  = ((1 + selicRate / 100) / (1 + ipcaRate / 100) - 1) * 100
      const burnRealIA  = despesas + despesas * (selicRate / 100) * 0.2
      const cacBase     = cac > 0 ? cac : cacRef
      const cacAjustIA  = cacBase * (usdRate / 4.50)
      const cpmReais    = cpmUsd * usdRate
      const margemRealIA = metrics.margem - taxaRealIA

      const calibLineIA = bm
        ? `\nModelos: ${bm.label} | Margem ref ${bm.margemRef}% | Churn ref ${bm.churnRef}%/mês | LTV mult ${bm.ltvMult}x`
        : ''
      const contextParts = [
        motivoCaixaZero ? `Caixa R$0: ${motivoCaixaZero}` : '',
        objetivos.length > 0 ? `Objetivos: ${objetivos.join(', ')}` : '',
        ticketProjetado > 0 && receita === 0 ? `Ticket projetado: R$${ticketProjetado.toFixed(2)}` : '',
        margemEstimada > 0 && receita === 0 ? `Margem estimada: ${margemEstimada}%` : '',
      ].filter(Boolean).join(' | ')

      const question = `Analista financeiro PME Brasil. Responda em PT-BR.

NEGÓCIO: ${nomeNegocio || '?'} | Fase: ${fase || faseNegocio || '?'} | Setor: ${sectorLabelIA} ${sectorHeatIA}/100 | Produto: ${produtos[0] || '?'}${calibLineIA}
MACRO: SELIC ${selicRate}% | IPCA ${ipcaRate}% | USD R$${usdRate.toFixed(2)} | PIB ${pibRate.toFixed(1)}%${contextParts ? '\nContexto: ' + contextParts : ''}

DADOS:
Receita R$${receita.toFixed(2)} | Despesas R$${despesas.toFixed(2)} | Caixa R$${caixa.toFixed(2)}
Burn Real R$${burnRealIA.toFixed(2)}/mês | Margem ${metrics.margem.toFixed(2)}%${receita === 0 ? ` (${margemEstimada > 0 ? 'calibrada' : 'ref 30%'})` : ''} | Margem Real ${margemRealIA.toFixed(2)}%
Runway ${metrics.runway >= 999 ? '∞' : metrics.runway.toFixed(1) + 'm'}${metrics.runwayCritico ? ' ⚠CRÍTICO' : ''} | Health ${metrics.healthScore}/100
LTV R$${metrics.ltv.toFixed(2)} | CAC R$${cacAjustIA.toFixed(2)} | LTV/CAC ${metrics.ltvCac.toFixed(2)}x
ROI ${metrics.roi.toFixed(2)}% vs CDI ${(selicRate - 0.1).toFixed(1)}%${metrics.roiSemValidacao ? ' ⚠ESTIMADO' : ''}
Break-even R$${metrics.breakeven.toFixed(2)} | Canal barato: ${bestPlatform?.label ?? 'orgânico'} R$${((bestPlatform?.cpm ?? 0) * usdRate).toFixed(2)}/mil
${benchmark ? `Ref ${fase}: ${benchmark}` : ''}

Relatório em 4 seções:
1. DIAGNÓSTICO (2-3 linhas com valores acima)
2. SEMÁFORO 🔴🟡🟢 (Burn Real, Margem Real, Runway, LTV/CAC, ROI)
3. PLANO 7/30/90 dias (ações concretas para ${sectorLabelIA})
4. FRASE EXECUTIVA (1 frase, 3 números)`

      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          marketContext: `Burn R$${burnRealIA.toFixed(2)} | TaxaReal ${taxaRealIA.toFixed(2)}% | CAC R$${cacAjustIA.toFixed(2)} | CPM R$${cpmReais.toFixed(2)}/mil | ${sectorLabelIA} ${sectorHeatIA}/100`,
        }),
      })
      const d = await res.json()
      setIaResponse(d.answer ?? 'Sem resposta da IA.')
    } catch (e: unknown) {
      const isAbort = e instanceof Error && e.name === 'AbortError'
      setIaResponse(isAbort ? 'Tempo limite (25s). Tente novamente.' : 'Erro ao conectar com a IA.')
    } finally {
      clearTimeout(timer)
      setIaLoading(false)
      setIaCooldown(90) // 90s entre chamadas — evita exceder 6k TPM do Groq
    }
  }

  const handleSalvarArquivo = async () => {
    setSavingArq(true)
    const snapshot: CockpitSnapshot = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      nome: saveNome.trim() || `${nomeNegocio || 'Diagnóstico'} — ${new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}`,
      empresa: nomeNegocio || 'Empresa',
      createdAt: new Date().toISOString(),
      inputs: { receita, despesas, caixa, verbaMkt, clientesAtivos, novosClientes, clientesPerdidos, cacManual, ticketManual, churnManual, modelosReceita, objetivos, faseNegocio, motivoCaixaZero, ticketProjetado, margemEstimada, naturezaCobranca, cicloMedioMeses, complexidadeVenda, aporteMensal, cargaTributaria },
      metrics: { healthScore: metrics.healthScore, margem: metrics.margem, runway: metrics.runway, lucro: metrics.lucro, ltvCac: metrics.ltvCac, ltv: metrics.ltv, breakeven: metrics.breakeven, roi: metrics.roi, margemReal: metrics.margemReal, runwayCritico: metrics.runwayCritico, runwayProtegido: metrics.runwayProtegido, roiIneficiente: metrics.roiIneficiente, breakevenMeta: metrics.breakevenMeta },
      iaResponse, selicRate, ipcaRate, usdRate, sectorLabel, sectorHeat,
    }
    try {
      const sb = createClient()
      let existing: CockpitSnapshot[] = []
      if (!user) {
        const raw = localStorage.getItem(`ws_${ARQUIVOS_MODULE}`)
        existing = raw ? (JSON.parse(raw)?.snapshots ?? []) : []
      } else {
        const { data: row } = await sb.from('workspace_data').select('data').eq('user_id', user.id).eq('module_id', ARQUIVOS_MODULE).maybeSingle()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        existing = (row?.data as any)?.snapshots ?? []
      }
      const payload = { snapshots: [snapshot, ...existing] }
      if (!user) { localStorage.setItem(`ws_${ARQUIVOS_MODULE}`, JSON.stringify(payload)) }
      else { await sb.from('workspace_data').upsert({ user_id: user.id, module_id: ARQUIVOS_MODULE, data: payload, updated_at: new Date().toISOString() }, { onConflict: 'user_id,module_id' }) }
      setShowSave(false)
      setSavedOk(true)
      setTimeout(() => setSavedOk(false), 3500)
    } catch (e) { console.error('[salvar arquivo]', e) }
    setSavingArq(false)
  }

  const inputNum = (label: string, value: number, setter: (v: number) => void, prefix = 'R$', info?: string) => (
    <NumInput label={label} value={value} onChange={setter} prefix={prefix} info={info} />
  )

  const cdiMensal    = (selicRate - 0.1) / 12
  const cdiRendimento = caixa * (cdiMensal / 100)
  const roiMensal    = metrics.roi / 12
  const decisaoCDI   = roiMensal < cdiMensal

  return (
    <motion.div ref={pdfRef} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 p-4" style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>

      {/* ── DESCRIÇÃO DO COCKPIT ── */}
      <div className="rounded-lg px-4 py-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 10 }}>PARA QUE SERVE O COCKPIT</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {([
            { title: 'Parar de Chutar',    desc: 'Diz se o seu preço (ticket) realmente paga o seu custo real (burn). Sem achismo.' },
            { title: 'Alerta de Colisão',  desc: 'Avisa antes do dinheiro acabar — o Runway mostra quantos meses de fôlego você tem hoje.' },
            { title: 'Filtro de Ruído',    desc: 'Separa o que importa agora do que pode esperar. Foco no gargalo real, não no que aparece mais.' },
            { title: 'Prova de Valor',     desc: 'O que você mostra para sócio, investidor ou cliente para provar viabilidade em números.' },
          ] as { title: string; desc: string }[]).map(item => (
            <div key={item.title}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>{item.title}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', lineHeight: 1.55 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTEXTO DO ONBOARDING COMPLETO ── */}
      {benchmark && (
        <div className="rounded-lg px-4 py-3" style={{ background: `${BLUE}12`, border: `1px solid ${BLUE}35` }}>
          <p style={{ fontSize: 10, color: BLUE, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4 }}>📍 CONTEXTO DO NEGÓCIO</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{benchmark}</p>
        </div>
      )}

      {/* ── 0. CALIBRAGEM DE CONTEXTO (Smart Setup) ── */}
      <div>
            <button
              onClick={() => setShowCalib(c => !c)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors"
              style={{ background: modelosReceita.length > 0 ? 'rgba(0,0,0,0.25)' : `${AMBER}10`, border: `1px solid ${modelosReceita.length > 0 ? 'rgba(255,255,255,0.08)' : AMBER + '40'}` }}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span style={{ fontSize: 12 }}>⚙</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: modelosReceita.length > 0 ? 'rgba(255,255,255,0.55)' : AMBER }}>
                  Calibragem de Contexto
                </span>
                {modelosReceita.length === 0 && (
                  <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: AMBER, background: `${AMBER}20`, padding: '1px 6px', borderRadius: 3, letterSpacing: '0.08em' }}>
                    CONFIGURAR
                  </span>
                )}
                {modelosReceita.length > 0 && (
                  <span style={{ fontSize: 9, color: GREEN, background: `${GREEN}18`, padding: '1px 5px', borderRadius: 3 }}>
                    ✓ {modelosReceita.length === 1 ? bm?.label : `${modelosReceita.length} modelos`}
                  </span>
                )}
                {objetivos.length > 0 && (
                  <span style={{ fontSize: 9, color: BLUE, background: `${BLUE}20`, padding: '1px 5px', borderRadius: 3 }}>
                    {objetivos.join(' · ')}
                  </span>
                )}
              </div>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>{showCalib ? '▲' : '▼'}</span>
            </button>

            {showCalib && (
              <div className="mt-2 rounded-lg p-4 flex flex-col gap-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>

                {/* Modelo de receita — chips multi-select */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Modelo de receita <span style={{ color: 'rgba(255,255,255,0.25)' }}>— selecione todos que se aplicam</span></label>
                    {modelosReceita.length > 0 && <button onClick={() => update({ modelosReceita: [] })} style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer' }}>limpar</button>}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(MODEL_BENCHMARKS).map(([k, mb]) => {
                      const sel = modelosReceita.includes(k)
                      return (
                        <button key={k} onClick={() => toggleModelo(k)}
                          className="px-2.5 py-1 rounded-full transition-all"
                          style={{ fontSize: 11, border: `1px solid ${sel ? GREEN + '70' : 'rgba(255,255,255,0.1)'}`, background: sel ? `${GREEN}18` : 'rgba(255,255,255,0.03)', color: sel ? GREEN : 'rgba(255,255,255,0.45)', fontWeight: sel ? 600 : 400 }}>
                          {sel ? '✓ ' : ''}{mb.label}
                        </button>
                      )
                    })}
                  </div>
                  {bm && (
                    <div className="flex flex-col gap-0.5">
                      {bmList.map(mb => (
                        <p key={mb.label} style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', lineHeight: 1.5 }}>
                          <span style={{ color: 'rgba(255,255,255,0.35)' }}>{mb.label}</span> — {mb.exemplo}
                        </p>
                      ))}
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', marginTop: 2 }}>
                        Benchmarks: margem {bm.margemRef}% · churn {bm.churnRef}%/mês · ticket R${bm.ticketRef} · LTV mult {bm.ltvMult}x
                      </p>
                    </div>
                  )}
                </div>

                {/* Objetivo — chips multi-select */}
                <div className="flex flex-col gap-2">
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Objetivo atual <span style={{ color: 'rgba(255,255,255,0.25)' }}>— pode ter mais de um</span></label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { v: 'validar',    label: 'Validar mercado' },
                      { v: 'crescer',    label: 'Crescer receita' },
                      { v: 'lucrar',     label: 'Aumentar lucratividade' },
                      { v: 'sobreviver', label: 'Sobreviver / reduzir burn' },
                      { v: 'reter',      label: 'Reter clientes' },
                      { v: 'organizar',  label: 'Organizar operação' },
                      { v: 'escalar',    label: 'Escalar operação' },
                      { v: 'captar',     label: 'Captar investimento' },
                      { v: 'vender',     label: 'Preparar para venda / exit' },
                    ].map(({ v: ov, label }) => {
                      const sel = objetivos.includes(ov)
                      return (
                        <button key={ov} onClick={() => toggleObjetivo(ov)}
                          className="px-2.5 py-1 rounded-full transition-all"
                          style={{ fontSize: 11, border: `1px solid ${sel ? BLUE + '70' : 'rgba(255,255,255,0.1)'}`, background: sel ? `${BLUE}18` : 'rgba(255,255,255,0.03)', color: sel ? '#5dade2' : 'rgba(255,255,255,0.45)', fontWeight: sel ? 600 : 400 }}>
                          {sel ? '✓ ' : ''}{label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Fase + Caixa R$0 — linha compacta */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Fase do negócio</label>
                    <select value={faseNegocio} onChange={e => setFaseNegocio(e.target.value)}
                      className="rounded-lg px-3 py-2 outline-none"
                      style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 12, color: faseNegocio ? '#fff' : 'rgba(255,255,255,0.3)' }}>
                      <option value="">Selecionar...</option>
                      <option value="ideia" style={{ background: '#0a0f1e' }}>Ideia / pré-produto</option>
                      <option value="validacao" style={{ background: '#0a0f1e' }}>Validação</option>
                      <option value="lancando" style={{ background: '#0a0f1e' }}>Lançando</option>
                      <option value="crescimento" style={{ background: '#0a0f1e' }}>Crescimento</option>
                      <option value="escala" style={{ background: '#0a0f1e' }}>Escala / maturidade</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Situação do caixa</label>
                    <select value={motivoCaixaZero} onChange={e => setMotivoCaixaZero(e.target.value)}
                      className="rounded-lg px-3 py-2 outline-none"
                      style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 12, color: motivoCaixaZero ? '#fff' : 'rgba(255,255,255,0.3)' }}>
                      <option value="">Selecionar...</option>
                      <option value="positivo" style={{ background: '#0a0f1e' }}>Tenho reserva / caixa positivo</option>
                      <option value="pre-receita" style={{ background: '#0a0f1e' }}>Ainda sem receita / pré-operação</option>
                      <option value="lancando" style={{ background: '#0a0f1e' }}>Lançando / investindo para crescer</option>
                      <option value="zerado-intencional" style={{ background: '#0a0f1e' }}>Reinvisto tudo — caixa zerado intencional</option>
                      <option value="zerado-problema" style={{ background: '#0a0f1e' }}>Caixa zerado por problema de fluxo</option>
                    </select>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', lineHeight: 1.4 }}>Contexto que muda o diagnóstico — "zerado por reinvestimento" é diferente de "zerado por dívida"</p>
                  </div>
                </div>

                {/* ── Natureza da Cobrança ── */}
                <div className="flex flex-col gap-2 pt-3 border-t border-white/5">
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Natureza da cobrança <span style={{ color: 'rgba(255,255,255,0.25)' }}>— como o dinheiro entra</span></label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { v: 'recorrente', label: 'Recorrente', desc: 'assinatura, mensalidade' },
                      { v: 'unica',      label: 'Única',      desc: 'curso, produto, projeto' },
                      { v: 'hibrida',    label: 'Híbrida',    desc: 'setup + mensalidade' },
                    ].map(({ v, label, desc }) => {
                      const sel = naturezaCobranca === v
                      return (
                        <button key={v} onClick={() => setNaturezaCobranca(sel ? '' : v)}
                          className="flex flex-col px-3 py-2 rounded-lg transition-all"
                          style={{ border: `1px solid ${sel ? BLUE + '70' : 'rgba(255,255,255,0.1)'}`, background: sel ? `${BLUE}18` : 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
                          <span style={{ fontSize: 11, color: sel ? '#5dade2' : 'rgba(255,255,255,0.5)', fontWeight: sel ? 600 : 400 }}>{sel ? '✓ ' : ''}{label}</span>
                          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>{desc}</span>
                        </button>
                      )
                    })}
                  </div>
                  {naturezaCobranca === 'unica' && (
                    <p style={{ fontSize: 10, color: AMBER, lineHeight: 1.5 }}>
                      LTV = ticket × margem (sem recorrência). ROI depende de volume constante de novas vendas.
                    </p>
                  )}
                  {naturezaCobranca !== 'unica' && naturezaCobranca !== '' && (
                    <div className="flex flex-col gap-1.5 mt-1">
                      <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                        Ciclo médio de permanência do cliente{cicloMedioMeses > 0 ? ` — ${cicloMedioMeses} meses (churn implícito ${fmtDec(100 / cicloMedioMeses, 1)}%/mês)` : ' — opcional'}
                      </label>
                      <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <input type="text" inputMode="decimal" value={cicloMedioMeses || ''}
                          placeholder="ex: 6 meses"
                          onChange={e => setCicloMedioMeses(parseBR(e.target.value))}
                          className="bg-transparent outline-none flex-1"
                          style={{ fontSize: 14, fontFamily: 'monospace', color: '#fff', border: 'none' }} />
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>meses</span>
                        {cicloMedioMeses > 0 && <button onClick={() => setCicloMedioMeses(0)} style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Complexidade de Venda ── */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Como você fecha vendas <span style={{ color: 'rgba(255,255,255,0.25)' }}>— pode marcar os dois</span></label>
                    {complexidadeVenda.length > 0 && <button onClick={() => update({ complexidadeVenda: [] })} style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer' }}>limpar</button>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex gap-2">
                      {[
                        { v: 'nao-vende',    label: 'Ainda não vendo', desc: 'pré-venda, validando, ideação' },
                        { v: 'self-service', label: 'Self-service',     desc: 'compra sozinho, sem reunião' },
                        { v: 'consultivo',   label: 'Consultivo',       desc: 'reunião, proposta, SDR' },
                      ].map(({ v, label, desc }) => {
                        const isNaoVende = v === 'nao-vende'
                        const sel = isNaoVende
                          ? complexidadeVenda.includes('nao-vende')
                          : complexidadeVenda.includes(v)
                        const disabled = isNaoVende
                          ? (complexidadeVenda.includes('self-service') || complexidadeVenda.includes('consultivo'))
                          : complexidadeVenda.includes('nao-vende')
                        return (
                          <button key={v}
                            onClick={() => {
                              if (isNaoVende) update({ complexidadeVenda: sel ? [] : ['nao-vende'] })
                              else if (!disabled) toggleComplexidade(v)
                            }}
                            className="flex flex-col flex-1 px-3 py-2 rounded-lg transition-all"
                            style={{
                              border: `1px solid ${sel ? (isNaoVende ? 'rgba(255,255,255,0.3)' : AMBER + '60') : 'rgba(255,255,255,0.1)'}`,
                              background: sel ? (isNaoVende ? 'rgba(255,255,255,0.06)' : `${AMBER}12`) : 'rgba(255,255,255,0.03)',
                              textAlign: 'left', opacity: disabled ? 0.3 : 1, cursor: disabled ? 'default' : 'pointer',
                            }}>
                            <span style={{ fontSize: 11, color: sel ? (isNaoVende ? 'rgba(255,255,255,0.6)' : AMBER) : 'rgba(255,255,255,0.5)', fontWeight: sel ? 600 : 400 }}>{sel ? '✓ ' : ''}{label}</span>
                            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>{desc}</span>
                          </button>
                        )
                      })}
                    </div>
                    {complexidadeVenda.includes('nao-vende') && (
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
                        Fase pré-receita — CAC e ticket não se aplicam ainda. Foco: validar proposta de valor antes de montar processo de vendas.
                      </p>
                    )}
                    {complexidadeVenda.includes('self-service') && complexidadeVenda.includes('consultivo') && (
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', lineHeight: 1.5 }}>
                        Híbrido: self-service para ticket baixo, consultivo para contas maiores.
                      </p>
                    )}
                    {complexidadeVenda.includes('consultivo') && !complexidadeVenda.includes('self-service') && (
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', lineHeight: 1.5 }}>
                        CAC consultivo inclui vendedor + proposta. Meta: CAC &lt; 20% do ticket.
                      </p>
                    )}
                  </div>
                </div>

                {/* ── Aporte Mensal ── */}
                <div className="flex flex-col gap-1.5">
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
                    Aporte mensal{aporteMensal > 0 ? ` — R$${fmt(aporteMensal)}/mês injetados` : ' — opcional'}
                  </label>
                  <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>R$</span>
                    <input
                      key={`aporte-${aporteMensal === 0 ? 'vazio' : 'set'}`}
                      type="text" inputMode="decimal"
                      defaultValue={aporteMensal > 0 ? aporteMensal : ''}
                      placeholder="deixe em branco se não há aporte"
                      onBlur={e => setAporteMensal(parseBR(e.target.value))}
                      className="bg-transparent outline-none flex-1"
                      style={{ fontSize: 14, fontFamily: 'monospace', color: '#fff', border: 'none' }} />
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>/mês</span>
                    {aporteMensal > 0 && <button onClick={() => setAporteMensal(0)} style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>}
                  </div>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', lineHeight: 1.4 }}>
                    Injeção de sócio/bootstrap que cobre burn — altera o Runway de "Crítico" para "Protegido"
                  </p>
                </div>

                {/* ── Carga Tributária ── */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
                      Impostos + taxas de transação{cargaTributaria > 0 ? ` — ${fmtDec(cargaTributaria, 1)}% descontado da margem` : ' — opcional'}
                    </label>
                    {cargaTributaria > 0 && <button onClick={() => setCargaTributaria(0)} style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer' }}>↺ remover</button>}
                  </div>
                  <div className="flex items-center gap-3 rounded-lg px-3 py-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <input type="range" min={0} max={40} step={0.5}
                      value={cargaTributaria || 0}
                      onChange={e => setCargaTributaria(Number(e.target.value))}
                      style={{ flex: 1, accentColor: RED, height: 4 }} />
                    <span style={{ fontSize: 14, fontFamily: 'monospace', color: cargaTributaria > 0 ? '#fff' : 'rgba(255,255,255,0.3)', minWidth: 36, textAlign: 'right' }}>
                      {cargaTributaria > 0 ? fmtDec(cargaTributaria, 1) : '0'}%
                    </span>
                  </div>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', lineHeight: 1.4 }}>
                    Ex: Simples 6% + gateway 3% = 9%. Desconta direto da Margem para mostrar o que sobra de verdade.
                  </p>
                </div>

                {/* Personalizar ticket e margem — opcionais, collapsíveis */}
                {(receita === 0 || margemEstimada > 0) && (
                  <div className="flex flex-col gap-3 pt-2 border-t border-white/5">
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)' }}>
                      Opcional — sem preenchimento, o sistema usa os benchmarks do modelo automaticamente
                    </p>
                    {receita === 0 && (
                      <div className="flex flex-col gap-1.5">
                        <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                          Ticket projetado{bm ? ` — deixe em branco para usar R$${bm.ticketRef} (ref. ${bm.label})` : ''}
                        </label>
                        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>R$</span>
                          <input type="text" inputMode="decimal" value={ticketProjetado || ''}
                            placeholder={bm ? `${bm.ticketRef} (benchmark)` : 'opcional'}
                            onChange={e => setTicketProjetado(parseBR(e.target.value))}
                            className="bg-transparent outline-none flex-1"
                            style={{ fontSize: 14, fontFamily: 'monospace', color: '#fff', border: 'none' }} />
                          {ticketProjetado > 0 && <button onClick={() => setTicketProjetado(0)} style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                          Margem estimada {margemEstimada === 0 ? `— usando ${bm ? bm.margemRef + '%' : '30%'} automaticamente` : `— ${fmtDec(margemEstimada)}%`}
                        </label>
                        {margemEstimada > 0 && <button onClick={() => setMargemEstimada(0)} style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer' }}>↺ usar benchmark</button>}
                      </div>
                      <div className="flex items-center gap-3 rounded-lg px-3 py-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <input type="range" min={0} max={100} step={1}
                          value={margemEstimada || (bm?.margemRef ?? 30)}
                          onChange={e => setMargemEstimada(Number(e.target.value))}
                          style={{ flex: 1, accentColor: BLUE, height: 4 }} />
                        <span style={{ fontSize: 14, fontFamily: 'monospace', color: margemEstimada > 0 ? '#fff' : 'rgba(255,255,255,0.3)', minWidth: 36, textAlign: 'right' }}>
                          {margemEstimada > 0 ? fmtDec(margemEstimada) : bm ? fmtDec(bm.margemRef) : '30'}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {receita > 0 && margemEstimada === 0 && (
                  <button onClick={() => setMargemEstimada(bm?.margemRef ?? 30)}
                    className="text-left"
                    style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    + personalizar margem estimada
                  </button>
                )}
              </div>
            )}
      </div>

      {/* ── 1. INPUTS FINANCEIROS BASE ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calculator size={16} style={{ color: BLUE }} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Dados financeiros</span>
          </div>
          <button onClick={() => { update(ZERO_DEFAULT); setIaResponse('') }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
            ✕ Limpar tudo
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {inputNum('Receita Mensal', receita, setReceita, 'R$', 'Tudo que entrou de vendas — não inclua empréstimo ou aporte')}
          {inputNum('Despesas Operacionais', despesas, setDespesas, 'R$', 'Tudo que você pagou para operar: salários, aluguel, fornecedores, ferramentas')}
          {inputNum('Caixa Disponível', caixa, setCaixa, 'R$', 'Saldo atual nas contas bancárias — o quanto você pode gastar hoje')}
          {inputNum('Verba Mkt / Aquisição', verbaMkt, setVerbaMkt, 'R$', 'Gasto com anúncios, tráfego pago, indicação — usado para calcular seu CAC')}
        </div>
      </div>

      {/* ── 2. INPUTS OPERACIONAIS → CÁLCULO AUTOMÁTICO ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} style={{ color: GREEN }} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Clientes</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>→ CAC / Ticket / Churn automáticos</span>
          </div>
          <button onClick={() => setModoManual(m => !m)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors"
            style={{ background: modoManual ? `${AMBER}20` : 'rgba(255,255,255,0.04)', border: `1px solid ${modoManual ? AMBER + '50' : 'rgba(255,255,255,0.08)'}`, fontSize: 10, color: modoManual ? AMBER : 'rgba(255,255,255,0.3)' }}>
            {modoManual ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
            {modoManual ? 'Manual' : 'Automático'}
          </button>
        </div>

        {!modoManual ? (
          <div className="grid grid-cols-3 gap-2">
            {inputNum('Ativos', clientesAtivos, setClientesAtivos, '#', 'Clientes que pagaram este mês')}
            {inputNum('Novos', novosClientes, setNovosClientes, '+', 'Que fecharam pela 1ª vez este mês')}
            {inputNum('Perdidos', clientesPerdidos, setClientesPerdidos, '−', 'Que cancelaram ou não renovaram')}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {inputNum('CAC (R$)', cacManual, setCacManual, 'R$', 'Custo por cliente adquirido — verba ÷ novos clientes')}
            {inputNum('Ticket Médio (R$)', ticketManual, setTicketManual, 'R$', 'Valor médio que cada cliente paga por mês/compra')}
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.02em' }}>Churn Mensal (%) — {fmtDec(churnManual)}%</label>
              <div className="flex items-center gap-3 rounded-lg px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <input type="range" min={0} max={50} step={0.5} value={churnManual} onChange={e => setChurnManual(Number(e.target.value))}
                  style={{ flex: 1, accentColor: BLUE, height: 4 }} />
                <span style={{ fontSize: 15, fontFamily: 'monospace', color: '#fff', minWidth: 40, textAlign: 'right' }}>{fmtDec(churnManual)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Calculados em tempo real */}
        {!modoManual && (clientesAtivos > 0 || novosClientes > 0) && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: 'Ticket Médio', value: `R$${fmt(ticketMedio)}`, ok: ticketMedio > 0 },
              { label: 'CAC',          value: `R$${fmt(cac)}`,         ok: cac > 0 },
              { label: 'Churn',        value: `${fmtDec(churnMensal)}%`, ok: churnMensal < 10 },
            ].map(c => (
              <div key={c.label} className="rounded-lg px-3 py-2 text-center" style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${c.ok ? GREEN : AMBER}30` }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>{c.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'monospace', color: c.ok ? GREEN : AMBER }}>{c.value}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', marginTop: 1 }}>calculado</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 3. INDICADORES CALCULADOS ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} style={{ color: AMBER }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Indicadores calculados</span>
        </div>

        {sanityAlerts.length > 0 && (
          <div className="mb-3 rounded-lg p-3 flex flex-col gap-3" style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}40` }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: AMBER, letterSpacing: '0.05em' }}>⚠ DIAGNÓSTICO BLOQUEADO — dados insuficientes</p>
            {sanityAlerts.map(a => (
              <div key={a.field} className="flex flex-col gap-1.5">
                <div className="flex items-start gap-2">
                  <span style={{ fontSize: 13, color: RED, flexShrink: 0 }}>✕</span>
                  <div className="flex flex-col gap-0.5">
                    <span style={{ fontSize: 12, fontWeight: 600, color: AMBER }}>{a.msg}</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.55 }}>{a.tip}</span>
                  </div>
                </div>
                <div className="rounded px-2.5 py-1.5" style={{ background: 'rgba(0,0,0,0.3)', borderLeft: `2px solid ${RED}60` }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                    <span style={{ color: RED }}>Impacto:</span> Health Score, Runway e Margem calculados agora refletem {a.field === 'Despesas' ? 'um negócio quase sem custo, não o seu negócio real' : 'uma margem irreal que não existe na prática'}. Corrija antes de usar os números abaixo para tomar decisões.
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {metrics.breakevenAlert && (
          <div className="mb-3 rounded-lg px-3 py-2.5" style={{ background: `${RED}18`, border: `1px solid ${RED}40` }}>
            <span style={{ fontSize: 12, color: RED, fontFamily: 'monospace', fontWeight: 700 }}>
              ⚠ Receita R${fmt(receita)} abaixo do break-even R${fmt(metrics.breakeven)} — corte custos ou aumente ticket em {fmtDec((metrics.breakeven / receita - 1) * 100)}%
            </span>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ opacity: sanityAlerts.length > 0 ? 0.45 : 1, pointerEvents: sanityAlerts.length > 0 ? 'none' : 'auto', position: 'relative' }}>
          {sanityAlerts.length > 0 && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: AMBER, background: 'rgba(10,15,30,0.85)', padding: '4px 10px', borderRadius: 4, border: `1px solid ${AMBER}40`, letterSpacing: '0.08em' }}>
                NÚMEROS NÃO CONFIÁVEIS — CORRIJA OS DADOS ACIMA
              </span>
            </div>
          )}
          {metricCards.map((m) => (
            <div key={m.label}
              className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', borderTop: `2px solid ${m.color}` }}>
              <div className="flex items-center justify-between mb-1">
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{m.label}</div>
                {m.origin && (
                  <span style={{ fontSize: 8, fontFamily: 'monospace', fontWeight: 700, color: m.origin.color, background: `${m.origin.color}15`, padding: '1px 5px', borderRadius: 3, letterSpacing: '0.05em' }}>
                    {m.origin.text}
                  </span>
                )}
              </div>
              <div className="truncate" style={{ fontSize: 15, fontWeight: 700, color: m.color, fontFamily: 'monospace', lineHeight: 1.2 }}>{m.value}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4, lineHeight: 1.3 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4a. ANÁLISE FUNDIDA (operacional × mercado) ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} style={{ color: '#5dade2' }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Análise Fundida</span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>seus dados × mercado</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: 'Burn Real',    value: despesas > 0 ? `R$${burnReal.toFixed(2)}` : '—', color: despesas > 0 ? RED : 'rgba(255,255,255,0.2)', desc: despesas > 0 ? `+R$${(burnReal - despesas).toFixed(2)} impacto SELIC ${selicRate.toFixed(2)}%` : 'preencha despesas', origin: despesas > 0 ? O_FUND : null },
            { label: 'Taxa Real',    value: `${taxaRealExata.toFixed(4)}%`,       color: taxaRealExata > 8 ? RED : AMBER,                              desc: 'Fisher — piso mínimo de ROI válido',              origin: { text: 'mercado puro', color: AMBER } },
            { label: 'Margem Real',  value: (receita > 0 || margemEstimada > 0 || bm) ? `${metrics.margemReal.toFixed(4)}%` : '—', color: metrics.margemReal < 0 ? RED : metrics.margemReal < 5 ? AMBER : GREEN, desc: receita === 0 && bm ? `ref. ${bm.label}: ${bm.margemRef}% − taxa real Fisher` : 'margem bruta − taxa real Fisher', origin: receita > 0 ? O_FUND : bm ? { text: 'benchmark', color: AMBER } : null },
            { label: 'CAC Ajustado', value: `R$${cacAjustado.toFixed(2)}`,        color: BLUE,                                                          desc: `${cacIsEstimado ? 'ref.mercado' : 'seus dados'} × câmbio R$${usdRate.toFixed(2)}/R$4,50`, origin: cacIsEstimado ? O_FUND : O_REAL },
            ...(cpmReais > 0 ? [{ label: 'CPM em R$', value: `R$${cpmReais.toFixed(2)}/mil`, color: AMBER, desc: `US$${cpmUsdVal.toFixed(2)} × R$${usdRate.toFixed(2)}`, origin: { text: 'mercado puro', color: AMBER } }] : []),
            ...(custoGiroMensal > 0 ? [{ label: 'Custo de Giro', value: `R$${custoGiroMensal.toFixed(2)}/mês`, color: RED, desc: `se financiar via banco a ${(selicRate * 2.5).toFixed(2)}% a.a.`, origin: despesas > 0 ? O_FUND : null }] : []),
          ].map((card, i) => (
            <div key={i} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', borderTop: `2px solid ${card.color}` }}>
              <div className="flex items-center justify-between mb-1">
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{card.label}</div>
                {card.origin && (
                  <span style={{ fontSize: 8, fontFamily: 'monospace', fontWeight: 700, color: card.origin.color, background: `${card.origin.color}15`, padding: '1px 5px', borderRadius: 3 }}>
                    {card.origin.text}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'monospace', color: card.color }}>{card.value}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 3, lineHeight: 1.3 }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4b. VERDICT — CRESCER AGORA? ── */}
      {(despesas > 0 || receita > 0) && (() => {
        const cdiAnual = selicRate - 0.1
        const roiVsCdi = metrics.roi - cdiAnual
        const matProf  = detectProfile(receita, caixa, despesas, faseNegocio || fase, motivoCaixaZero, metrics.margem)
        const bmLbl    = bm?.label ?? ''

        // ── Pontuação para semáforo ────────────────────────────────────────
        const margemPts = receita > 0 ? (metrics.margemReal > 5 ? 1 : metrics.margemReal > 0 ? 0 : -1) : -1
        const roiPts    = metrics.roiSemValidacao ? -1 : (roiVsCdi > 5 ? 1 : roiVsCdi > -5 ? 0 : -1)
        const pts = [
          metrics.runwayCritico ? -2 : metrics.runwayExplicado ? 0 : metrics.runwayProtegido ? 1 : metrics.runway > 6 ? 1 : metrics.runway > 3 ? 0 : -1,
          sectorHeat > 70 ? 1 : sectorHeat > 40 ? 0 : -1,
          margemPts, roiPts,
          metrics.ltvCac > 3 ? 1 : metrics.ltvCac > 1 ? 0 : -1,
        ].reduce((a, b) => a + b, 0)
        const semaforo = pts >= 3 ? 'crescer' : pts >= 0 ? 'aguardar' : 'nao'
        const v = semaforo === 'crescer'
          ? { text: 'CRESCER AGORA',     color: GREEN, icon: '▲' }
          : semaforo === 'aguardar'
          ? { text: 'AGUARDAR / TESTAR', color: AMBER, icon: '◆' }
          : { text: 'NÃO CRESCER AGORA', color: RED,   icon: '▼' }

        // ── Achados: lê todos os dados e calibragem ────────────────────────
        type Finding = { ok: boolean; label: string; detail: string }
        const findings: Finding[] = []

        // Qualidade dos dados
        if (sanityAlerts.length > 0) {
          findings.push({ ok: false, label: 'Dados incompletos', detail: sanityAlerts.map(a => a.msg).join(' · ') })
        }

        // Runway / sobrevivência
        if (metrics.runwayProtegido) {
          findings.push({ ok: true, label: `Runway protegido`, detail: `Aporte R$${fmt(aporteMensal)}/mês cobre o burn — sem prazo de extinção imediato` })
        } else if (metrics.runwayExplicado) {
          const ctx = motivoCaixaZero === 'zerado-intencional' ? 'reinvestindo tudo por escolha — sem reserva para imprevistos'
                    : motivoCaixaZero === 'lancando'           ? 'consumindo caixa para crescer — burn deve ser intencional e controlado'
                    :                                            'pré-receita, sem caixa operacional ainda'
          findings.push({ ok: true, label: 'Caixa zerado por contexto', detail: ctx })
        } else if (metrics.runwayCritico) {
          findings.push({ ok: false, label: 'Runway ZERO', detail: `R$${fmt(despesas)}/mês de burn com caixa vazio e sem receita — sem aporte, o negócio para` })
        } else if (metrics.runway < 3) {
          findings.push({ ok: false, label: `Runway ${fmtDec(metrics.runway)}m`, detail: `Menos de 3 meses de fôlego — prioridade máxima é aumentar caixa` })
        } else if (metrics.runway < 6) {
          findings.push({ ok: false, label: `Runway ${fmtDec(metrics.runway)}m`, detail: `Abaixo do mínimo saudável (6 meses) — não é hora de escalar paid` })
        } else if (metrics.runway < 999) {
          findings.push({ ok: true, label: `Runway ${fmtDec(metrics.runway)}m`, detail: `Fôlego adequado para testar e iterar` })
        } else {
          findings.push({ ok: true, label: 'Runway ∞', detail: 'Receita cobre despesas — sem prazo de extinção' })
        }

        // Receita / validação de mercado
        if (receita === 0 && despesas > 0) {
          findings.push({ ok: false, label: 'Receita R$0', detail: `Burn R$${fmt(despesas)}/mês sem validação de mercado — nenhuma métrica abaixo pode ser confirmada` })
        } else if (receita > 0) {
          if (metrics.margemReal < 0) {
            findings.push({ ok: false, label: `Margem real ${fmtDec(metrics.margemReal)}%`, detail: `Margem bruta ${fmtDec(metrics.margem)}% menos taxa Fisher ${taxaRealExata.toFixed(2)}% = negativa — você perde poder aquisitivo` })
          } else if (metrics.margem < 15) {
            findings.push({ ok: false, label: `Margem ${fmtDec(metrics.margem)}%`, detail: `Abaixo de 15% — insuficiente para reinvestir em crescimento` })
          } else {
            findings.push({ ok: true, label: `Margem ${fmtDec(metrics.margem)}%`, detail: `Real ${fmtDec(metrics.margemReal)}% após taxa Fisher — ${cargaTributaria > 0 ? `já descontado ${fmtDec(cargaTributaria)}% de impostos` : 'adicione carga tributária na calibragem para margem real pura'}` })
          }
        }

        // LTV/CAC
        if (metrics.ltvCac > 0) {
          if (metrics.ltvCac >= 3) {
            findings.push({ ok: true, label: `LTV/CAC ${fmtDec(metrics.ltvCac)}x`, detail: `Cada R$1 de CAC retorna R$${fmtDec(metrics.ltvCac)} em LTV — unidade econômica sustentável` })
          } else if (metrics.ltvCac >= 1) {
            findings.push({ ok: false, label: `LTV/CAC ${fmtDec(metrics.ltvCac)}x`, detail: `Abaixo de 3x (mínimo para escala) — ${naturezaCobranca === 'unica' ? 'venda única depende de volume constante para compensar' : 'reduza CAC ou aumente retenção'}` })
          } else {
            findings.push({ ok: false, label: `LTV/CAC ${fmtDec(metrics.ltvCac)}x`, detail: `Cada cliente custa mais do que vale — escalar agora queima caixa sem retorno` })
          }
        }

        // Setor
        if (sectorLabel) {
          findings.push({ ok: sectorHeat >= 50, label: `Setor ${sectorHeat}/100`, detail: sectorHeat > 70 ? `${sectorLabel} aquecido — janela favorável para entrada` : sectorHeat > 40 ? `${sectorLabel} neutro — crescimento possível mas sem vento a favor` : `${sectorLabel} pressionado — crescer em setor fraco exige unit economics muito forte` })
        }

        // CAC cambial (se tem verba)
        if (verbaMkt > 0 && cac > 0) {
          const cacDelta = cacAjustado - cac
          if (cacDelta > cac * 0.1) {
            findings.push({ ok: false, label: `CAC ajustado R$${fmt(Math.round(cacAjustado))}`, detail: `USD ${usdRate.toFixed(2)} encarece paid media em ${((usdRate / 4.5 - 1) * 100).toFixed(0)}% — CAC real R$${fmt(Math.round(cac))} → R$${fmt(Math.round(cacAjustado))}` })
          }
        }

        // Calibragem de contexto
        if (bmLbl) {
          const bmMargemRef = bm!.margemRef
          findings.push({ ok: metrics.margem >= bmMargemRef * 0.8 || receita === 0, label: `Modelo: ${bmLbl}`, detail: receita === 0 ? `Benchmark de referência: margem ${bm!.margemRef}%, churn ${bm!.churnRef}%/mês, LTV mult ${bm!.ltvMult}x` : `Margem ${fmtDec(metrics.margem)}% vs benchmark ${bmMargemRef}% — ${metrics.margem >= bmMargemRef * 0.8 ? 'dentro do esperado' : 'abaixo do benchmark do modelo'}` })
        }
        if (objetivos.length > 0) {
          findings.push({ ok: true, label: `Objetivos: ${objetivos.join(', ')}`, detail: '' })
        }

        // ── Gargalo principal: primeiro achado negativo crítico ────────────
        const blockers = findings.filter(f => !f.ok)
        const blocker  = blockers[0] ?? null

        // ── Ações concretas baseadas em perfil + calibragem + objetivos ────
        const acoes: string[] = []
        const temObj = (o: string) => objetivos.includes(o)
        const temMod = (m: string) => modelosReceita.includes(m)

        if (sanityAlerts.length > 0) {
          acoes.push('Preencha os custos reais do negócio — sem dados corretos nenhuma decisão abaixo é confiável')
          acoes.push('Depois: volte ao Cockpit e reavalie o Health Score com os números reais')
        } else if (matProf === 'ideia') {
          acoes.push('Defina quem paga, quanto paga e por quê — antes de qualquer custo')
          acoes.push('Meta única: 1 cliente pagante real, mesmo que informal, para validar o ticket')
          if (sectorHeat > 60) acoes.push(`Setor ${sectorHeat}/100 favorece entrada agora — velocidade de validação importa`)
        } else if (matProf === 'pre-receita') {
          acoes.push(`Burn atual R$${fmt(despesas)}/mês — liste cada gasto e corte o que não gera tração direta`)
          acoes.push(naturezaCobranca === 'unica' ? 'Primeira venda: foque no volume mínimo para cobrir o burn' : 'Primeira assinatura recorrente: esse é o único número que importa agora')
          if (temObj('validar')) acoes.push('Validação ≠ produto perfeito — venda antes de construir')
          else if (temObj('captar')) acoes.push('Sem receita real, investidor de equity não entra — primeiro revenue, depois captação')
        } else if (matProf === 'solvencia') {
          acoes.push('Fluxo de caixa é emergência — renegocie prazo de recebimento com clientes já ativos')
          acoes.push('Antecipe recebíveis ou abra crédito rotativo antes de perder fornecedores')
          acoes.push('Zero gastos não-essenciais até caixa ter pelo menos 45 dias de cobertura')
        } else if (matProf === 'fluxo') {
          if (metrics.ltvCac < 3) acoes.push(`LTV/CAC ${fmtDec(metrics.ltvCac)}x — melhore retenção antes de reinvestir em aquisição`)
          acoes.push('Construa reserva de 3 meses antes de acelerar — reinvestimento sem reserva é risco desnecessário')
          if (temObj('crescer')) acoes.push('Crescimento orgânico primeiro: referências e upsell da base custarão menos que paid agora')
        } else {
          // escala
          if (semaforo === 'crescer') {
            acoes.push(verbaMkt > 0 ? `Escale paid com cuidado cambial — CAC ajustado R$${fmt(Math.round(cacAjustado))} vs base R$${fmt(Math.round(cac))}` : 'Ative canal pago — unit economics suporta escala agora')
            if (temMod('saas') || naturezaCobranca === 'recorrente') acoes.push(`Churn ${fmtDec(churnEfetivo)}%/mês: cada 1% reduzido = +R$${fmt(Math.round(metrics.ltv * 0.01 * clientesAtivos))} de LTV na base`)
            if (temObj('escalar')) acoes.push('Escala com LTV/CAC saudável — priorize o canal de menor CPM')
          } else if (semaforo === 'aguardar') {
            acoes.push(`Ajuste o gargalo de unit economics primeiro (LTV/CAC ${fmtDec(metrics.ltvCac)}x → meta 3x)`)
            acoes.push(metrics.ltvCac < 3 && naturezaCobranca !== 'unica' ? 'Retenção é mais barata que aquisição — foque em reduzir churn antes de escalar' : 'Revise precificação ou CAC antes de investir mais em aquisição')
          } else {
            acoes.push(`Pare escala: burn real R$${fmt(Math.round(burnReal))}/mês corroído pela SELIC ${selicRate}%`)
            acoes.push('Prioridade: runway mínimo 6 meses antes de qualquer reinvestimento em crescimento')
            if (metrics.margemReal < 0) acoes.push(`Reajuste preços em pelo menos ${Math.abs(metrics.margemReal).toFixed(1)}% para sair de margem real negativa`)
          }
        }

        return (
          <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${v.color}30` }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3" style={{ background: `${v.color}10` }}>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>VERDICT</span>
                <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: 3 }}>{matProf}{bmLbl ? ` · ${bmLbl.split(' /')[0]}` : ''}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: v.color }}>{v.icon}</span>
                <span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color: v.color }}>{v.text}</span>
              </div>
            </div>

            {/* Achados */}
            <div className="px-4 py-3 flex flex-col gap-1.5" style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: 4 }}>LEITURA DOS DADOS</p>
              {findings.filter(f => f.label).map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ fontSize: 12, color: f.ok ? GREEN : RED, flexShrink: 0, lineHeight: 1.4 }}>{f.ok ? '✓' : '✕'}</span>
                  <div>
                    <span style={{ fontSize: 11, color: f.ok ? 'rgba(255,255,255,0.55)' : AMBER, fontWeight: 600 }}>{f.label}</span>
                    {f.detail && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 6 }}>{f.detail}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Gargalo */}
            {blocker && (
              <div className="px-4 py-2.5" style={{ background: `${RED}08`, borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: 3 }}>GARGALO PRINCIPAL</p>
                <p style={{ fontSize: 11, color: AMBER, lineHeight: 1.5 }}><span style={{ fontWeight: 700 }}>{blocker.label}</span>{blocker.detail ? ` — ${blocker.detail}` : ''}</p>
              </div>
            )}

            {/* Ações */}
            {acoes.length > 0 && (
              <div className="px-4 py-3" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: 6 }}>PRÓXIMAS AÇÕES</p>
                <div className="flex flex-col gap-1.5">
                  {acoes.map((a, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span style={{ fontSize: 10, fontFamily: 'monospace', color: v.color, flexShrink: 0, marginTop: 1 }}>→</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })()}

      {/* ── 4c. CANAL DE AQUISIÇÃO (verba × plataformas) ── */}
      {platforms.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} style={{ color: GREEN }} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Canal de Aquisição</span>
            {organicPct > 0 && (
              <span style={{ fontSize: 10, color: organicDelta < -3 ? RED : 'rgba(255,255,255,0.3)' }}>
                Orgânico {organicPct.toFixed(0)}% {organicDelta < 0 ? `▼${Math.abs(organicDelta).toFixed(1)}%` : `▲${organicDelta.toFixed(1)}%`}
              </span>
            )}
          </div>
          <div className="rounded-lg overflow-hidden" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {platforms.slice(0, 6).map((p, i) => {
              const cpmR          = (p.cpm ?? 0) * usdRate
              const clientesEst   = verbaMkt > 0 && cpmR > 0 ? Math.floor((verbaMkt / cpmR) * 1000 * 0.02) : 0
              const isBest        = i === 0
              return (
                <div key={p.id} className="flex items-center justify-between px-3 py-2.5"
                  style={{ borderBottom: i < Math.min(platforms.length, 6) - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: isBest ? `${GREEN}08` : 'transparent' }}>
                  <div className="flex items-center gap-2">
                    {isBest && <span style={{ fontSize: 9, color: GREEN, fontFamily: 'monospace', fontWeight: 700 }}>MELHOR</span>}
                    <span style={{ fontSize: 12, color: isBest ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.4)' }}>{p.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>R${cpmR.toFixed(2)}/mil</span>
                    {verbaMkt > 0 && (
                      <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: isBest ? 700 : 400, color: isBest ? GREEN : 'rgba(255,255,255,0.3)', minWidth: 60, textAlign: 'right' }}>
                        ~{clientesEst} clientes
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
            {verbaMkt > 0 && (
              <div className="px-3 py-2 border-t border-white/5">
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', lineHeight: 1.4 }}>
                  R${verbaMkt.toFixed(0)}/mês de verba · conv. 2% estimada · valores reais dependem da campanha
                </p>
              </div>
            )}
            {verbaMkt === 0 && (
              <div className="px-3 py-2 border-t border-white/5">
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', lineHeight: 1.4 }}>Preencha Verba Mkt/Aquisição para ver estimativa de clientes por canal</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 5. INTELIGÊNCIA DE MERCADO ── */}
      <MarketIntelligence
        marketData={marketData}
        selicRate={selicRate} ipcaRate={ipcaRate} usdRate={usdRate}
        caixa={caixa} despesas={despesas}
        cdiMensal={cdiMensal} cdiRendimento={cdiRendimento} decisaoCDI={decisaoCDI}
        userProfile={userProfile}
        receita={receita} margem={metrics.margem} runway={metrics.runway}
        ltvCac={metrics.ltvCac} cac={cacEfetivo} churnMensal={churnEfetivo}
        taxaRealExata={taxaRealExata} burnReal={burnReal} cacAjustado={cacAjustado}
        margemReal={metrics.margemReal}
      />

      {/* ── 5. IA + PDF ── */}
      <div>
        {metrics.semDados && (
          <div className="mb-3 rounded-lg px-3 py-2.5 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Preencha Receita, Despesas ou Caixa para ativar o diagnóstico IA</p>
          </div>
        )}
        <button onClick={handleIA} disabled={iaLoading || metrics.semDados || iaCooldown > 0}
          className="w-full rounded-lg py-3 flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ background: iaCooldown > 0 ? 'rgba(26,82,118,0.4)' : BLUE, color: '#fff', fontSize: 14, fontWeight: 600, cursor: (iaLoading || metrics.semDados || iaCooldown > 0) ? 'not-allowed' : 'pointer' }}>
          {iaLoading ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
          {iaLoading ? 'Analisando...' : iaCooldown > 0 ? `Aguardar ${iaCooldown}s para nova análise` : 'Analisar com IA — Diagnóstico completo'}
        </button>
        {iaCooldown > 0 && (
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 4 }}>
            Limite de chamadas Groq — próxima análise em {iaCooldown}s
          </p>
        )}

        {iaResponse && (
          <>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-lg p-4 mt-3"
              style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${BLUE}40`, fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.75)' }}>
              <div style={{ fontSize: 10, color: BLUE, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }}>
                ✦ ANÁLISE IPB · {nomeNegocio || 'Cockpit'} · {new Date().toLocaleDateString('pt-BR')}
              </div>
              {iaResponse}
            </motion.div>

            <button onClick={exportPDF} disabled={pdfLoading}
              className="w-full mt-3 rounded-lg py-3 flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ background: 'rgba(26,82,118,0.3)', border: `1px solid ${BLUE}50`, color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}>
              {pdfLoading ? <Loader2 size={15} className="animate-spin" /> : <FileDown size={15} />}
              {pdfLoading ? 'Gerando PDF...' : 'Salvar relatório em PDF'}
            </button>

            {/* ── Salvar em Arquivos ── */}
            {!showSave && !savedOk && (
              <button onClick={() => { setSaveNome(`${nomeNegocio || 'Diagnóstico'} — ${new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}`); setShowSave(true) }}
                className="w-full mt-2 rounded-lg py-2.5 flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                <FolderPlus size={14} /> Salvar em Arquivos
              </button>
            )}
            {showSave && (
              <div className="mt-2 rounded-lg p-3 flex flex-col gap-2" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <input type="text" value={saveNome} onChange={e => setSaveNome(e.target.value)}
                  placeholder="Nome do arquivo..."
                  className="bg-transparent outline-none w-full"
                  style={{ fontSize: 13, color: '#fff', border: 'none' }} />
                <div className="flex gap-2">
                  <button onClick={handleSalvarArquivo} disabled={savingArq}
                    className="flex-1 rounded-lg py-2 text-center transition-opacity hover:opacity-80 disabled:opacity-40"
                    style={{ background: BLUE, fontSize: 12, color: '#fff', fontWeight: 600 }}>
                    {savingArq ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button onClick={() => setShowSave(false)}
                    className="px-4 rounded-lg transition-opacity hover:opacity-80"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}
            {savedOk && (
              <div className="mt-2 rounded-lg px-3 py-2.5 text-center" style={{ background: 'rgba(30,132,73,0.1)', border: '1px solid rgba(30,132,73,0.25)' }}>
                <span style={{ fontSize: 12, color: GREEN }}>✓ Salvo em Arquivos — abra a aba FILES para ver</span>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
