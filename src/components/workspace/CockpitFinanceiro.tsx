'use client'

import { useMemo, useRef, useState } from 'react'
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

const ZERO_DEFAULT = { receita: 0, despesas: 0, caixa: 0, clientesAtivos: 0, novosClientes: 0, clientesPerdidos: 0, verbaMkt: 0, cacManual: 0, ticketManual: 0, churnManual: 0 }

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
function NumInput({ label, value, onChange, prefix = 'R$' }: { label: string; value: number; onChange: (v: number) => void; prefix?: string }) {
  const [str, setStr] = useState(value === 0 ? '' : String(value))

  // Sincroniza quando valor externo muda (ex: reset)
  const prevRef = useRef(value)
  if (prevRef.current !== value) {
    prevRef.current = value
    const parsed = str === '' ? 0 : parseFloat(str) || 0
    if (parsed !== value) setStr(value === 0 ? '' : String(value))
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.02em' }}>{label}</label>
      <div className="flex items-center gap-2 rounded-lg px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.1)' }}>
        {prefix && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', userSelect: 'none', flexShrink: 0 }}>{prefix}</span>}
        <input
          type="number"
          value={str}
          placeholder="0"
          onChange={e => { setStr(e.target.value); onChange(e.target.value === '' ? 0 : parseFloat(e.target.value) || 0) }}
          className="bg-transparent outline-none flex-1 min-w-0"
          style={{ fontSize: 15, fontFamily: 'monospace', color: '#fff', border: 'none' }}
        />
      </div>
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
  const [modoManual,    setModoManual]    = useState(false)
  const [iaLoading,     setIaLoading]     = useState(false)
  const [iaResponse,    setIaResponse]    = useState('')
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

  // Cálculo automático ou manual
  const ticketMedio = modoManual ? ticketManual : (clientesAtivos > 0 ? receita / clientesAtivos : 0)
  const cac         = modoManual ? cacManual    : (novosClientes > 0  ? verbaMkt / novosClientes  : 0)
  const churnMensal = modoManual ? churnManual  : (clientesAtivos > 0 ? (clientesPerdidos / clientesAtivos) * 100 : 0)

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

  // Fórmulas de sensibilidade (sempre calculadas, independem de dados completos)
  const taxaRealExata    = ((1 + selicRate / 100) / (1 + ipcaRate / 100) - 1) * 100
  const burnReal         = despesas > 0 ? despesas + despesas * (selicRate / 100) * 0.2 : 0
  const cacAjustado      = cacEfetivo * (usdRate / 4.50)
  const cpmReais         = cpmUsdVal * usdRate
  const custoGiroMensal  = despesas > 0 ? despesas * (selicRate * 2.5 / 100) / 12 : 0

  const metrics = useMemo(() => {
    // ── COALESCE: margem — se receita=0, usa 30% como alvo de consultoria ──
    // Permite que LTV, break-even e health score não colem em zero
    const margemIsEstimada = receita === 0
    const margemDecimal    = receita > 0 ? (receita - despesas) / receita : 0.30
    const margem           = margemDecimal * 100
    const lucro            = receita - despesas
    const burnLiquido      = despesas - receita

    // ── ENGRENAGEM 3: Runway Adaptativo ───────────────────────────────────
    const burnParaRunway = burnReal > 0 ? burnReal : (despesas > 0 ? despesas : 0)
    const runway         = burnParaRunway > 0
      ? (lucro >= 0 ? 999 : Math.max(0, caixa / burnParaRunway))
      : (lucro >= 0 ? 999 : 0)
    const runwayCritico  = runway === 0 && despesas > 0

    // LTV usa margem efetiva (30% estimada se receita=0) + churnEfetivo
    const margemLtv      = Math.max(margemDecimal, 0.1)
    const ltv            = ticketMedio > 0 && churnEfetivo > 0
      ? (ticketMedio * margemLtv) / (churnEfetivo / 100)
      : ltvRefNum
    const ltvCac         = cacEfetivo > 0 && ltv > 0 ? ltv / cacEfetivo : 0
    const burnRatio      = receita > 0 ? 1 - despesas / receita : 0
    const runwayNorm     = Math.min((runway === 999 ? 24 : runway) / 24, 1) * 100
    const ltvCacNorm     = Math.min(ltvCac / 5, 1) * 100
    const burnNorm       = Math.max(burnRatio, 0) * 100
    const semDados       = receita === 0 && despesas === 0 && caixa === 0
    const healthBase     = semDados ? 0 : Math.round(margem * 0.22 + runwayNorm * 0.35 + ltvCacNorm * 0.18 + burnNorm * 0.12)
    const sectorBonus    = Math.round((sectorHeat / 100) * 13)
    const healthScore    = semDados ? 0 : Math.min(100, healthBase + sectorBonus)

    // ── ENGRENAGEM 1: Break-even Universal ───────────────────────────────
    // Sem receita: break-even de sobrevivência = despesas totais (sem margem alvo)
    // Com receita: BurnReal / (1 − margemReal)
    const burnBase       = burnReal > 0 ? burnReal : (despesas > 0 ? despesas : 0)
    const breakeven      = burnBase > 0
      ? (receita === 0 ? despesas : burnBase / (1 - Math.max(margemDecimal, 0.05)))
      : 0
    const breakevenAlert = receita > 0 && breakeven > receita
    const breakevenMeta  = receita === 0 && despesas > 0

    // ── ENGRENAGEM 2: ROI Anualizado baseado em LTV/CAC (universal) ───────
    const cacAdj            = cacEfetivo * (usdRate / 4.50)
    const roi               = cacAdj > 0 ? ((ltv - cacAdj) / cacAdj) * 12 * 100 : 0
    // ROI sem receita real = estimado (não confiável, não sinaliza como ineficiente)
    const roiIneficiente    = receita > 0 && roi < selicRate && (despesas > 0 || receita > 0)
    const roiSemValidacao   = receita === 0 && (despesas > 0) // ROI alto mas sem receita real

    // ── ENGRENAGEM 4: Margem Real Fisher ──────────────────────────────────
    const margemReal     = margem - taxaRealExata

    return { margem, margemIsEstimada, lucro, runway, runwayCritico, burnLiquido, healthScore, ltvCac, ltv, breakeven, roi, roiIneficiente, roiSemValidacao, breakevenAlert, breakevenMeta, semDados, margemReal }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receita, despesas, caixa, cacEfetivo, ticketMedio, churnEfetivo, ltvRefNum, sectorHeat, taxaRealExata, burnReal, usdRate, selicRate])

  // origem: verde = seus dados, amarelo = ref.mercado, azul = calculado/fundido
  const O_REAL  = { text: 'seus dados',   color: GREEN }
  const O_REF   = { text: 'ref. mercado', color: AMBER }
  const O_CALC  = { text: 'calculado',    color: '#5dade2' }
  const O_FUND  = { text: 'fundido',      color: '#5dade2' }

  const metricCards = useMemo(() => [
    { label: 'Health Score',   value: `${metrics.healthScore}/100`,  color: colorByRange(metrics.healthScore, 70, 40), desc: `setor ${sectorHeat}/100 + runway + margem + LTV/CAC + burn`, origin: O_FUND },
    { label: 'Margem',         value: `${fmtDec(metrics.margem, 2)}%`, color: colorByRange(metrics.margem, 20, 10),   desc: metrics.margemIsEstimada ? 'alvo referência 30% — sem receita real' : '(receita − despesas) / receita', origin: metrics.margemIsEstimada ? O_REF : receita > 0 && despesas > 0 ? O_REAL : O_CALC },
    { label: 'Runway',         value: metrics.runwayCritico ? '0,0 meses ⚠' : metrics.runway >= 999 ? '∞ meses' : `${fmtDec(metrics.runway, 2)} meses`, color: metrics.runwayCritico ? RED : colorByRange(Math.min(metrics.runway, 99), 6, 3), desc: metrics.runwayCritico ? 'CRÍTICO — caixa zerado com despesas ativas' : 'Caixa ÷ burn real (SELIC inclusa)', origin: caixa > 0 || despesas > 0 ? O_REAL : O_CALC },
    { label: 'Lucro Mensal',   value: `R$${fmt(metrics.lucro)}`,     color: metrics.lucro >= 0 ? GREEN : RED,         desc: 'Receita − despesas', origin: receita > 0 || despesas > 0 ? O_REAL : O_CALC },
    { label: 'Burn Líquido',   value: metrics.burnLiquido > 0 ? `-R$${fmt(metrics.burnLiquido)}/mês` : `+R$${fmt(Math.abs(metrics.burnLiquido))}/mês`, color: metrics.burnLiquido > 0 ? RED : GREEN, desc: 'Despesas − receitas', origin: despesas > 0 ? O_REAL : O_CALC },
    { label: 'LTV/CAC',        value: `${fmtDec(metrics.ltvCac, 2)}x`, color: colorByRange(metrics.ltvCac, 3, 1),    desc: `LTV R$${metrics.ltv.toFixed(2)}${cacIsEstimado || metrics.margemIsEstimada ? ' · dados estimados' : ''}`, origin: cacIsEstimado || churnIsEstimado ? O_FUND : O_CALC },
    { label: 'Break-even',     value: `R$${fmt(metrics.breakeven)}`, color: metrics.breakevenAlert ? RED : metrics.breakevenMeta ? AMBER : BLUE, desc: metrics.breakevenAlert ? '⚠ Receita abaixo do break-even!' : metrics.breakevenMeta ? `sobrevivência — você precisa de R$${fmt(metrics.breakeven)}/mês para cobrir custos` : 'BurnReal ÷ (1 − margem)', origin: despesas > 0 ? O_FUND : O_CALC },
    { label: 'ROI Anualizado', value: `${fmtDec(metrics.roi, 2)}%`,  color: metrics.roiSemValidacao ? AMBER : metrics.roiIneficiente ? AMBER : metrics.roi >= 0 ? GREEN : RED, desc: metrics.roiSemValidacao ? `⚠ ROI Estimado — sem validação real (Receita R$0). Insira receita p/ confirmar.` : metrics.roiIneficiente ? `⚠ ROI < SELIC ${selicRate}% — negócio rende menos que o banco` : '(LTV − CAC) / CAC × 12 meses', origin: O_FUND },
    { label: 'Ticket Médio',   value: `R$${fmt(ticketMedio)}`,       color: ticketMedio > 0 ? BLUE : AMBER,          desc: modoManual ? 'manual' : ticketMedio === 0 ? 'insira receita + clientes para calcular' : 'receita ÷ clientes ativos', origin: ticketMedio > 0 ? O_REAL : null },
    { label: 'CAC',            value: `R$${fmt(cacEfetivo)}`,        color: cac > 0 ? BLUE : AMBER,                  desc: cacIsEstimado ? 'ref. mercado — insira seus dados' : modoManual ? 'manual' : 'verba ÷ novos clientes', origin: cacIsEstimado ? O_REF : O_REAL },
    { label: 'Churn',          value: `${fmtDec(churnEfetivo, 2)}%`, color: colorByRange(100 - churnEfetivo, 95, 90), desc: churnIsEstimado ? 'ref. mercado — insira seus dados' : modoManual ? 'manual' : 'perdidos ÷ ativos × 100', origin: churnIsEstimado ? O_REF : O_REAL },
    { label: 'LTV',            value: `R$${fmt(Math.round(metrics.ltv))}`, color: metrics.ltv > 0 ? GREEN : AMBER,  desc: `(Ticket × Margem) ÷ Churn`, origin: churnIsEstimado || ticketMedio === 0 ? O_FUND : O_CALC },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [metrics, sectorHeat, receita, despesas, caixa, cacEfetivo, churnEfetivo, ticketMedio, cac, cacIsEstimado, churnIsEstimado, modoManual, selicRate])

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

    // ── Extração completa de marketData ────────────────────────────────────
    const pibRate      = marketData?.macro?.pib?.value              ?? 1.9
    const cpmUsd       = marketData?.marketing?.cpmGlobal?.value    ?? 0
    const cpcUsd       = marketData?.marketing?.cpcGlobal?.value    ?? 0
    const organicPct   = marketData?.marketing?.organicShare?.value ?? 0
    const organicDelta = marketData?.marketing?.organicShare?.delta ?? 0
    const cacRef       = marketData?.marketing?.cacTrend?.value     ?? 0
    const ltvRef       = 156
    const churnRef     = 4.2
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const platforms    = (marketData?.platforms ?? []) as Array<{ id: string; label: string; cpm: number; delta: number }>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metaAgent    = marketData?.globalAgents?.find((a: any) => a.id === 'meta')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const googleAgent  = marketData?.globalAgents?.find((a: any) => a.id === 'googl')
    // commodities é objeto {oil:{...}} — acesso direto pela chave
    const petroleo     = marketData?.commodities?.oil
    const briefing     = marketData?.briefing ?? ''

    const userSectorIdIA = SECTOR_MAP[setores[0] ?? ''] ?? null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userSectorData = userSectorIdIA ? (marketData?.sectors ?? []).find((s: any) => s.id === userSectorIdIA) : null
    const sectorHeat  = (userSectorData as any)?.heat  ?? 0
    const sectorLabel = (userSectorData as any)?.label ?? setores[0] ?? 'não definido'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bestPlatform = platforms.length > 0 ? platforms.reduce((a: any, b: any) => a.cpm < b.cpm ? a : b) : null

    // ── Fórmulas de sensibilidade (precisão máxima, sem arredondamento) ────
    // Taxa real exata — fórmula Fisher: ((1+SELIC)/(1+IPCA))−1
    const taxaRealExata   = ((1 + selicRate / 100) / (1 + ipcaRate / 100) - 1) * 100
    // Burn real: despesas + impacto oculto de crédito mais caro com SELIC alta
    const burnReal        = despesas + despesas * (selicRate / 100) * 0.2
    // Custo mensal se financiar via capital de giro bancário (SELIC × 2.5)
    const custoGiroMensal = despesas * (selicRate * 2.5 / 100) / 12
    // CAC ajustado ao câmbio atual (base histórico R$4,50)
    const cacBase         = cac > 0 ? cac : cacRef
    const cacAjustado     = cacBase * (usdRate / 4.50)
    // CPM convertido para R$ (custo por 1000 impressões)
    const cpmReais        = cpmUsd * usdRate
    // Margem real líquida após taxa real
    const margemReal      = metrics.margem - taxaRealExata
    // Break-even inflacionado em 12 meses
    const breakevenInflado = metrics.breakeven * (1 + ipcaRate / 100)
    // CDI mensal (proxy)
    const cdiAnual        = selicRate - 0.1
    // ROI vs CDI gap
    const roiCdiGap       = metrics.roi - cdiAnual

    const platformLines = platforms.slice(0, 6).map((p: any) =>
      `  ${p.label}: US$${p.cpm.toFixed(2)} = R$${(p.cpm * usdRate).toFixed(2)}/mil impressões${p.id === bestPlatform?.id ? ' ← MELHOR CUSTO AGORA' : ''}`
    ).join('\n')

    const question = `Analista financeiro PME Brasil. Responda em PT-BR, sem arredondamento.

NEGÓCIO: ${nomeNegocio || '?'} | Fase: ${fase || '?'} | Setor: ${sectorLabel} ${sectorHeat}/100 | Produto: ${produtos[0] || '?'}
MACRO: SELIC ${selicRate}% | IPCA ${ipcaRate}% | USD R$${usdRate.toFixed(2)} | PIB ${pibRate.toFixed(1)}%

DADOS FUNDIDOS:
Receita R$${receita.toFixed(2)} | Despesas R$${despesas.toFixed(2)} | Caixa R$${caixa.toFixed(2)}
Burn Real R$${burnReal.toFixed(2)}/mês (SELIC +R$${(despesas * selicRate / 100 * 0.2).toFixed(2)} oculto)
Margem ${metrics.margem.toFixed(2)}%${receita === 0 ? ' (alvo 30%, receita R$0)' : ''} | Margem Real ${margemReal.toFixed(2)}% | Taxa Fisher ${taxaRealExata.toFixed(2)}%
Runway ${metrics.runway >= 999 ? '∞' : metrics.runway.toFixed(1) + 'm'}${metrics.runwayCritico ? ' ⚠CRÍTICO' : ''} | Health ${metrics.healthScore}/100
LTV R$${metrics.ltv.toFixed(2)} | CAC ajust R$${cacAjustado.toFixed(2)} | LTV/CAC ${metrics.ltvCac.toFixed(2)}x
ROI ${metrics.roi.toFixed(2)}% vs CDI ${(selicRate - 0.1).toFixed(1)}%${metrics.roiSemValidacao ? ' ⚠SEM RECEITA REAL' : ''}
Break-even R$${metrics.breakeven.toFixed(2)}${metrics.breakevenMeta ? ' (sobrevivência)' : ''}
Canal mais barato: ${bestPlatform?.label ?? 'orgânico'} R$${((bestPlatform?.cpm ?? 0) * usdRate).toFixed(2)}/mil
${benchmark ? `Benchmark ${fase}: ${benchmark}` : ''}

Gere relatório em 4 seções curtas:
1. DIAGNÓSTICO (2-3 linhas com os valores acima)
2. SEMÁFORO 🔴🟡🟢 (Burn Real, Margem Real, Runway, LTV/CAC, ROI vs CDI)
3. PLANO 7/30/90 dias (ações específicas com valores reais do setor ${sectorLabel})
4. FRASE EXECUTIVA (1 frase, 3 números críticos)`

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 25000)
    try {
      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          marketContext: `BurnReal R$${burnReal.toFixed(2)} | TaxaReal ${taxaRealExata.toFixed(4)}% | CACajustado R$${cacAjustado.toFixed(2)} | CPM R$${cpmReais.toFixed(2)}/mil | Setor ${sectorLabel} ${sectorHeat}/100`,
        }),
      })
      const d = await res.json()
      setIaResponse(d.answer ?? 'Sem resposta da IA.')
    } catch (e: unknown) {
      const isAbort = e instanceof Error && e.name === 'AbortError'
      setIaResponse(isAbort ? 'Tempo limite atingido (25s). Tente novamente — o Groq pode estar sobrecarregado.' : 'Erro ao conectar com a IA.')
    } finally {
      clearTimeout(timer)
      setIaLoading(false)
    }
  }

  const handleSalvarArquivo = async () => {
    setSavingArq(true)
    const snapshot: CockpitSnapshot = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      nome: saveNome.trim() || `${nomeNegocio || 'Diagnóstico'} — ${new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}`,
      empresa: nomeNegocio || 'Empresa',
      createdAt: new Date().toISOString(),
      inputs: { receita, despesas, caixa, verbaMkt, clientesAtivos, novosClientes, clientesPerdidos, cacManual, ticketManual, churnManual },
      metrics: { healthScore: metrics.healthScore, margem: metrics.margem, runway: metrics.runway, lucro: metrics.lucro, ltvCac: metrics.ltvCac, ltv: metrics.ltv, breakeven: metrics.breakeven, roi: metrics.roi, margemReal: metrics.margemReal, runwayCritico: metrics.runwayCritico, roiIneficiente: metrics.roiIneficiente, breakevenMeta: metrics.breakevenMeta },
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

  const inputNum = (label: string, value: number, setter: (v: number) => void, prefix = 'R$') => (
    <NumInput label={label} value={value} onChange={setter} prefix={prefix} />
  )

  const cdiMensal    = (selicRate - 0.1) / 12
  const cdiRendimento = caixa * (cdiMensal / 100)
  const roiMensal    = metrics.roi / 12
  const decisaoCDI   = roiMensal < cdiMensal

  return (
    <motion.div ref={pdfRef} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 p-4" style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>

      {/* ── CONTEXTO DO ONBOARDING COMPLETO ── */}
      {benchmark && (
        <div className="rounded-lg px-4 py-3" style={{ background: `${BLUE}12`, border: `1px solid ${BLUE}35` }}>
          <p style={{ fontSize: 10, color: BLUE, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4 }}>📍 CONTEXTO DO NEGÓCIO</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{benchmark}</p>
        </div>
      )}

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
          {inputNum('Receita Mensal', receita, setReceita)}
          {inputNum('Despesas Operacionais', despesas, setDespesas)}
          {inputNum('Caixa Disponível', caixa, setCaixa)}
          {inputNum('Verba Mkt/Aquisição', verbaMkt, setVerbaMkt)}
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
            {inputNum('Ativos', clientesAtivos, setClientesAtivos, '#')}
            {inputNum('Novos', novosClientes, setNovosClientes, '+')}
            {inputNum('Perdidos', clientesPerdidos, setClientesPerdidos, '−')}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {inputNum('CAC (R$)', cacManual, setCacManual)}
            {inputNum('Ticket Médio (R$)', ticketManual, setTicketManual)}
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
        {metrics.breakevenAlert && (
          <div className="mb-3 rounded-lg px-3 py-2.5" style={{ background: `${RED}18`, border: `1px solid ${RED}40` }}>
            <span style={{ fontSize: 12, color: RED, fontFamily: 'monospace', fontWeight: 700 }}>
              ⚠ Receita R${fmt(receita)} abaixo do break-even R${fmt(metrics.breakeven)} — corte custos ou aumente ticket em {fmtDec((metrics.breakeven / receita - 1) * 100)}%
            </span>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
            { label: 'Margem Real',  value: receita > 0 ? `${metrics.margemReal.toFixed(4)}%` : '—', color: metrics.margemReal < 0 ? RED : metrics.margemReal < 5 ? AMBER : GREEN, desc: 'margem bruta − taxa real Fisher', origin: receita > 0 ? O_FUND : null },
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
        const cdiAnual  = selicRate - 0.1
        const roiVsCdi  = metrics.roi - cdiAnual
        // Sem receita real: penaliza margem e ROI (são estimativas, não dados reais)
        const margemPts = receita > 0 ? (metrics.margemReal > 5 ? 1 : metrics.margemReal > 0 ? 0 : -1) : -1
        const roiPts    = metrics.roiSemValidacao ? -1 : (roiVsCdi > 5 ? 1 : roiVsCdi > -5 ? 0 : -1)
        const pts = [
          metrics.runwayCritico ? -2 : metrics.runway > 6 ? 1 : metrics.runway > 3 ? 0 : -1,
          sectorHeat > 70 ? 1 : sectorHeat > 40 ? 0 : -1,
          margemPts,
          roiPts,
          metrics.ltvCac > 3 ? 1 : metrics.ltvCac > 1 ? 0 : -1,
        ].reduce((a, b) => a + b, 0)
        const margemDesc = receita > 0 ? `margem real ${metrics.margemReal.toFixed(1)}%` : 'sem receita validada'
        const v = pts >= 3
          ? { text: 'CRESCER AGORA', color: GREEN, icon: '▲', reason: `Setor ${sectorHeat}/100 + ${margemDesc} + runway ${metrics.runway >= 999 ? '∞' : metrics.runway.toFixed(1) + 'm'} = janela aberta.` }
          : pts >= 0
          ? { text: 'AGUARDAR / TESTAR', color: AMBER, icon: '◆', reason: `Valide unit economics antes de escalar. CAC ajustado R$${cacAjustado.toFixed(0)} precisa de LTV firme (atual ${metrics.ltvCac.toFixed(1)}x).` }
          : { text: 'NÃO CRESCER AGORA', color: RED, icon: '▼', reason: receita === 0 ? `Receita R$0 + runway crítico. Valide receita antes de qualquer escala. Foco: cobrir os R$${despesas.toFixed(0)}/mês de despesas.` : `Taxa real ${taxaRealExata.toFixed(2)}% pressiona margens. Priorize: cortar burn real (R$${burnReal.toFixed(0)}/mês), proteger caixa e reter clientes.` }
        return (
          <div className="rounded-lg px-4 py-3" style={{ background: `${v.color}08`, border: `1px solid ${v.color}30` }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>VERDICT</span>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: v.color }}>{v.icon}</span>
                <span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color: v.color }}>{v.text}</span>
              </div>
            </div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{v.reason}</p>
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
              const cpmR          = p.cpm * usdRate
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
        <button onClick={handleIA} disabled={iaLoading || metrics.semDados}
          className="w-full rounded-lg py-3 flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ background: BLUE, color: '#fff', fontSize: 14, fontWeight: 600, cursor: (iaLoading || metrics.semDados) ? 'not-allowed' : 'pointer' }}>
          {iaLoading ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
          {iaLoading ? 'Analisando...' : 'Analisar com IA — Diagnóstico completo'}
        </button>

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
