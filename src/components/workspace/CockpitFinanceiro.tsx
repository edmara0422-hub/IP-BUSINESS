'use client'

import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, TrendingUp, AlertTriangle, Brain, Loader2, FileDown, ToggleLeft, ToggleRight } from 'lucide-react'
import { useWorkspaceData } from '@/hooks/useWorkspaceData'

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
        cross: `Margem ${fmtDec(margem)}% + IPCA ${ipcaRate.toFixed(1)}%`,
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
        cross: `LTV/CAC ${fmtDec(ltvCac)}x + ${userSectorObj.label ?? userSectorObj.id} AQUECIDO`,
        insight: `Equação saudável em setor aquecido. Janela para escalar paid — cada R$1 de CAC retorna R$${fmtDec(ltvCac)} em LTV. Canal mais barato do mercado para maximizar escala.`,
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

  // Contexto por setor — explica o score e a influência no negócio
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
            label: 'SELIC', value: `${fmtDec(selicRate)}%`, color: selicRate > 12 ? RED : GREEN,
            desc: `Crédito: ${fmtDec(selicRate * 2.5)}% a.a.${despesas > 0 ? ` — se financiar R$${fmt(despesas)}, paga +R$${fmt(Math.round(despesas * (selicRate * 2.5 / 100) / 12))}/mês de juros` : ' — capital de giro inviável para PME'}`,
          },
          {
            label: 'IPCA', value: `${fmtDec(ipcaRate)}%`, color: ipcaRate > 4 ? AMBER : GREEN,
            desc: despesas > 0 ? `Suas despesas em 12 meses serão R$${fmt(Math.round(despesas * (1 + ipcaRate / 100)))} — R$${fmt(Math.round(despesas * ipcaRate / 100))} a mais pelo IPCA` : `Inflação ${ipcaRate > 4.75 ? 'acima da meta — poder de compra do cliente caindo' : 'dentro da meta — consumo estável'}`,
          },
          {
            label: 'USD/BRL', value: `R$${fmtDec(usdRate, 2)}`, color: usdRate > 5.5 ? RED : usdRate > 5 ? AMBER : GREEN,
            desc: `Insumos importados ${usdRate > 5.5 ? `${((usdRate / 4.5 - 1) * 100).toFixed(0)}% mais caros vs R$4,50 (2022)` : usdRate > 5 ? 'atenção ao câmbio — pressão moderada' : 'câmbio favorável para importação'}`,
          },
          {
            label: 'CDI vs ROI', value: decisaoCDI ? '⚠ CDI > ROI' : '✓ ROI > CDI', color: decisaoCDI ? AMBER : GREEN,
            desc: caixa > 0 ? `Caixa de R$${fmt(caixa)} rende R$${fmt(Math.round(cdiRendimento))}/mês no CDI (${fmtDec(cdiMensal, 2)}%/mês)${decisaoCDI ? ' — mais que seu ROI' : ''}` : 'Insira o Caixa Disponível para comparar com o CDI',
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
  const [modoManual, setModoManual] = useState(false)
  const [iaLoading, setIaLoading]   = useState(false)
  const [iaResponse, setIaResponse] = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)
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
  const cacRefNum    = marketData?.marketing?.cac?.value     ?? 49
  const churnRefNum  = marketData?.marketing?.churn?.value   ?? 4.2
  const ltvRefNum    = marketData?.marketing?.ltv?.value     ?? 156
  const cpmUsdVal    = marketData?.marketing?.cpm?.value     ?? 0
  const cpcUsdVal    = marketData?.marketing?.cpc?.value     ?? 0
  const organicPct   = marketData?.marketing?.organicShare?.value ?? 0
  const organicDelta = marketData?.marketing?.organicShare?.delta ?? 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const platforms    = (marketData?.marketing?.platforms ?? []) as Array<{ id: string; label: string; cpm: number; delta: number }>

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
    const margemDecimal  = receita > 0 ? (receita - despesas) / receita : 0
    const margem         = margemDecimal * 100
    const lucro          = receita - despesas
    const burnLiquido    = despesas - receita
    const runway         = burnLiquido > 0 ? caixa / burnLiquido : (lucro >= 0 ? 999 : caixa / despesas)
    // LTV usa churnEfetivo — não retorna 0 quando churn não foi preenchido
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
    // Health Score inclui setor como fator de mercado (15% do peso)
    const healthBase     = semDados ? 0 : Math.round(margem * 0.22 + runwayNorm * 0.35 + ltvCacNorm * 0.18 + burnNorm * 0.12)
    const sectorBonus    = Math.round((sectorHeat / 100) * 13)
    const healthScore    = semDados ? 0 : Math.min(100, healthBase + sectorBonus)
    const breakeven      = margemDecimal > 0 ? despesas / margemDecimal : 0
    const roi            = caixa > 0 ? (lucro * 12) / caixa * 100 : 0
    const breakevenAlert = breakeven > receita && receita > 0
    const margemReal     = margem - taxaRealExata
    return { margem, lucro, runway, burnLiquido, healthScore, ltvCac, ltv, breakeven, roi, breakevenAlert, semDados, margemReal }
  }, [receita, despesas, caixa, cacEfetivo, ticketMedio, churnEfetivo, ltvRefNum, sectorHeat, taxaRealExata])

  const est = (isEst: boolean) => isEst ? ' · ref.mercado' : ''
  const metricCards = [
    { label: 'Health Score',    value: `${metrics.healthScore}/100`,  color: colorByRange(metrics.healthScore, 70, 40), desc: `runway+margem+LTV/CAC+burn+setor ${sectorHeat}/100` },
    { label: 'Margem',          value: `${fmtDec(metrics.margem)}%`,  color: colorByRange(metrics.margem, 20, 10),      desc: '(receita − despesas) / receita' },
    { label: 'Runway',          value: metrics.runway >= 999 ? '∞ meses' : `${fmtDec(metrics.runway)} meses`, color: colorByRange(Math.min(metrics.runway, 99), 6, 3), desc: 'Caixa ÷ burn real' },
    { label: 'Lucro Mensal',    value: `R$${fmt(metrics.lucro)}`,     color: metrics.lucro >= 0 ? GREEN : RED,          desc: 'Receita − despesas' },
    { label: 'Burn Líquido',    value: metrics.burnLiquido > 0 ? `-R$${fmt(metrics.burnLiquido)}/mês` : `+R$${fmt(Math.abs(metrics.burnLiquido))}/mês`, color: metrics.burnLiquido > 0 ? RED : GREEN, desc: 'Despesas − receitas' },
    { label: 'LTV/CAC',         value: `${fmtDec(metrics.ltvCac)}x`, color: colorByRange(metrics.ltvCac, 3, 1),        desc: `LTV R$${fmt(Math.round(metrics.ltv))}${churnIsEstimado ? ' · churn ref.' : ''}` },
    { label: 'Break-even',      value: `R$${fmt(metrics.breakeven)}`, color: metrics.breakevenAlert ? RED : BLUE,       desc: metrics.breakevenAlert ? '⚠ Receita abaixo do break-even!' : 'Receita mínima para cobrir custos' },
    { label: 'ROI Anualizado',  value: `${fmtDec(metrics.roi)}%`,    color: metrics.roi >= 0 ? GREEN : RED,            desc: 'Retorno sobre capital investido (anual)' },
    { label: 'Ticket Médio',    value: `R$${fmt(ticketMedio)}`,       color: ticketMedio > 0 ? BLUE : AMBER,            desc: modoManual ? 'manual' : 'receita ÷ clientes ativos' },
    { label: `CAC${est(cacIsEstimado)}`,   value: `R$${fmt(cacEfetivo)}`,   color: cac > 0 ? BLUE : AMBER, desc: cacIsEstimado ? `ref. mercado — insira seus dados` : modoManual ? 'manual' : 'verba ÷ novos clientes' },
    { label: `Churn${est(churnIsEstimado)}`, value: `${fmtDec(churnEfetivo)}%`, color: colorByRange(100 - churnEfetivo, 95, 90), desc: churnIsEstimado ? 'ref. mercado — insira seus dados' : modoManual ? 'manual' : 'perdidos ÷ ativos × 100' },
    { label: 'LTV',             value: `R$${fmt(Math.round(metrics.ltv))}`, color: metrics.ltv > 0 ? GREEN : AMBER,   desc: `(Ticket × Margem) ÷ Churn${churnIsEstimado ? ' ref.' : ''}` },
  ]

  const benchmark = fase ? buildBenchmark(fase, setores, produtos, revenue, nomeNegocio) : ''

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
    const cpmUsd       = marketData?.marketing?.cpm?.value          ?? 0
    const cpcUsd       = marketData?.marketing?.cpc?.value          ?? 0
    const organicPct   = marketData?.marketing?.organicShare?.value ?? 0
    const organicDelta = marketData?.marketing?.organicShare?.delta ?? 0
    const cacRef       = marketData?.marketing?.cac?.value          ?? 0
    const ltvRef       = marketData?.marketing?.ltv?.value          ?? 0
    const churnRef     = marketData?.marketing?.churn?.value        ?? 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const platforms    = (marketData?.marketing?.platforms ?? []) as Array<{ id: string; label: string; cpm: number; delta: number }>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metaAgent    = marketData?.globalAgents?.find((a: any) => a.id === 'meta')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const googleAgent  = marketData?.globalAgents?.find((a: any) => a.id === 'google')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const petroleo     = marketData?.commodities?.find((c: any) => c.id === 'oil')
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

    const question = `Você é analista financeiro sênior de PMEs brasileiras. NUNCA arredonde — use precisão total nos cálculos.

NEGÓCIO: ${nomeNegocio || '?'} | Fase: ${fase || '?'} | Setor: ${sectorLabel} (heat ${sectorHeat}/100) | Produto: ${produtos.join(', ') || '?'}

═══ DADOS OPERACIONAIS × MERCADO — JÁ FUNDIDOS ═══

BURN REAL (despesas + custo oculto da SELIC):
  Despesas base: R$${despesas.toFixed(2)}/mês
  Impacto SELIC ${selicRate}% nos custos (20% das despesas): +R$${(despesas * selicRate / 100 * 0.2).toFixed(2)}/mês
  → BURN REAL: R$${burnReal.toFixed(2)}/mês
  Se financiar via banco (${(selicRate * 2.5).toFixed(2)}% a.a.): +R$${custoGiroMensal.toFixed(2)}/mês de juros

TAXA REAL E MARGEM:
  Taxa real Fisher ((1+${selicRate}/100)/(1+${ipcaRate}/100)−1): ${taxaRealExata.toFixed(4)}%
  Margem bruta: ${metrics.margem.toFixed(4)}%
  Margem real líquida (margem − taxa real): ${margemReal.toFixed(4)}% ${margemReal < 0 ? '⚠ NEGATIVA' : ''}
  Break-even inflacionado 12m (IPCA ${ipcaRate}%): R$${breakevenInflado.toFixed(2)}
  ROI anualizado: ${metrics.roi.toFixed(4)}% | CDI: ${cdiAnual.toFixed(2)}% | Gap ROI−CDI: ${roiCdiGap.toFixed(4)}% ${roiCdiGap < 0 ? '⚠ CAIXA RENDE MAIS QUE O NEGÓCIO' : '✓'}

CAC AJUSTADO AO CÂMBIO:
  CAC real: R$${cacBase.toFixed(2)} | Fator câmbio (R$${usdRate.toFixed(2)}/R$4,50): ×${(usdRate / 4.50).toFixed(4)}
  → CAC ajustado: R$${cacAjustado.toFixed(2)}
  LTV real: R$${metrics.ltv.toFixed(2)} | LTV/CAC: ${metrics.ltvCac.toFixed(4)}x
  LTV referência mercado: R$${ltvRef} | CAC ref. mercado: R$${cacRef} | Churn ref: ${churnRef}%

AQUISIÇÃO & CANAIS:
  CPM mercado: US$${cpmUsd.toFixed(2)} × R$${usdRate.toFixed(2)} = R$${cpmReais.toFixed(2)}/mil impressões
  CPC médio: US$${cpcUsd.toFixed(2)} = R$${(cpcUsd * usdRate).toFixed(2)}
  Orgânico: ${organicPct.toFixed(1)}% do tráfego (MoM: ${organicDelta > 0 ? '+' : ''}${organicDelta.toFixed(1)}%) ${organicDelta < -3 ? '⚠ QUEDA ACELERADA' : ''}
  Plataformas disponíveis:
${platformLines}
${metaAgent ? `  Meta stock: ${metaAgent.delta >= 0 ? '▲' : '▼'}${Math.abs(metaAgent.delta).toFixed(2)}% — CPM Meta ${metaAgent.delta < 0 ? 'pode cair (janela)' : 'pode subir (cautela)'}` : ''}
${googleAgent ? `  Google stock: ${googleAgent.delta >= 0 ? '▲' : '▼'}${Math.abs(googleAgent.delta).toFixed(2)}% — CPC Google em pressão` : ''}

INDICADORES COMPLETOS:
  Receita: R$${receita.toFixed(2)} | Despesas: R$${despesas.toFixed(2)} | Caixa: R$${caixa.toFixed(2)}
  Lucro: R$${metrics.lucro.toFixed(2)} | Runway: ${metrics.runway >= 999 ? '∞ (lucrativo)' : metrics.runway.toFixed(2) + ' meses'}
  Ticket médio: R$${ticketMedio.toFixed(2)} | CAC: R$${cacBase.toFixed(2)} | Churn: ${churnMensal.toFixed(4)}%/mês
  Health Score: ${metrics.healthScore}/100
  ${metrics.breakevenAlert ? `⚠ RECEITA ABAIXO DO BREAK-EVEN: falta R$${(metrics.breakeven - receita).toFixed(2)}/mês para cobrir custos` : ''}

SETOR: ${sectorLabel} — ${sectorHeat}/100 ${sectorHeat >= 75 ? '(AQUECIDO — janela de crescimento aberta)' : sectorHeat >= 50 ? '(FAVORÁVEL — crescimento moderado)' : sectorHeat >= 30 ? '(NEUTRO — cautela)' : '(PRESSIONADO — contenção máxima)'}
PIB: ${pibRate.toFixed(2)}% | SELIC: ${selicRate}% | IPCA: ${ipcaRate}% | USD: R$${usdRate.toFixed(2)}
${petroleo ? `Petróleo: $${petroleo.value?.toFixed(2) ?? '?'} (${petroleo.delta > 0 ? '▲' : '▼'}${Math.abs(petroleo.delta ?? 0).toFixed(2)}%) — impacto em frete` : ''}
${briefing ? `Briefing macro: ${briefing}` : ''}
Benchmarks fase ${fase}: ${benchmark}

════════════════════════════════════════════

Gere relatório executivo usando os dados FUNDIDOS acima (nunca os brutos separados):

1. DIAGNÓSTICO — cite os valores calculados: burn real R$${burnReal.toFixed(2)}, margem real ${margemReal.toFixed(2)}%, CAC ajustado R$${cacAjustado.toFixed(2)}, taxa real ${taxaRealExata.toFixed(2)}%

2. SEMÁFORO (use valores fundidos, não brutos):
🔴 CRÍTICO / 🟡 ATENÇÃO / 🟢 SAUDÁVEL
Avalie: Burn Real, Margem Real, CAC Ajustado, CPM R$, Runway, LTV/CAC, ROI vs CDI, Churn, Orgânico

3. PLANO 7/30/90 — OBRIGATÓRIO diferenciar pelo setor ${sectorLabel} (${sectorHeat}/100):
${sectorHeat >= 70
  ? `Setor AQUECIDO: use a janela. Ações de escala com caixa protegido. Canal mais barato: ${bestPlatform?.label ?? 'orgânico'} (R$${((bestPlatform?.cpm ?? 0) * usdRate).toFixed(2)}/mil impressões).`
  : sectorHeat >= 40
  ? `Setor NEUTRO: eficiência antes de escala. Cortar CAC atual de R$${cacAjustado.toFixed(2)} e proteger margem real de ${margemReal.toFixed(2)}%.`
  : `Setor PRESSIONADO: contenção máxima. Com taxa real ${taxaRealExata.toFixed(2)}%, cada real em caixa rende mais que risco. Proteja runway.`}
Use valores reais nos prazos (ex: "reduzir CAC de R$${cacAjustado.toFixed(2)} para R$${(cacAjustado * 0.82).toFixed(2)} migrando para ${bestPlatform?.label ?? 'canal mais barato'}").

4. FRASE EXECUTIVA — 1 frase com os 3 números mais críticos fundidos.

REGRA: nunca arredonde. Use os decimais dos cálculos acima.`

    try {
      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          marketContext: `BurnReal R$${burnReal.toFixed(2)} | TaxaReal ${taxaRealExata.toFixed(4)}% | CACajustado R$${cacAjustado.toFixed(2)} | CPM R$${cpmReais.toFixed(2)}/mil | Setor ${sectorLabel} ${sectorHeat}/100`,
        }),
      })
      const d = await res.json()
      setIaResponse(d.answer ?? 'Sem resposta da IA.')
    } catch {
      setIaResponse('Erro ao conectar com a IA.')
    } finally {
      setIaLoading(false)
    }
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
          {metricCards.map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', borderTop: `2px solid ${m.color}` }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{m.label}</div>
              <div className="truncate" style={{ fontSize: 15, fontWeight: 700, color: m.color, fontFamily: 'monospace', lineHeight: 1.2 }}>{m.value}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4, lineHeight: 1.3 }}>{m.desc}</div>
            </motion.div>
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
          <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', borderTop: `2px solid ${despesas > 0 ? RED : 'rgba(255,255,255,0.1)'}` }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Burn Real</div>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'monospace', color: despesas > 0 ? RED : 'rgba(255,255,255,0.2)' }}>
              {despesas > 0 ? `R$${burnReal.toFixed(2)}` : '—'}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 3, lineHeight: 1.3 }}>
              {despesas > 0 ? `+R$${(burnReal - despesas).toFixed(2)} impacto SELIC ${selicRate}%` : 'preencha despesas'}
            </div>
          </div>
          <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', borderTop: `2px solid ${taxaRealExata > 8 ? RED : AMBER}` }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Taxa Real</div>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'monospace', color: taxaRealExata > 8 ? RED : AMBER }}>{taxaRealExata.toFixed(4)}%</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 3, lineHeight: 1.3 }}>Fisher — piso mínimo de ROI válido</div>
          </div>
          <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', borderTop: `2px solid ${metrics.margemReal < 0 ? RED : metrics.margemReal < 5 ? AMBER : GREEN}` }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Margem Real</div>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'monospace', color: metrics.margemReal < 0 ? RED : metrics.margemReal < 5 ? AMBER : GREEN }}>
              {receita > 0 ? `${metrics.margemReal.toFixed(4)}%` : '—'}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 3, lineHeight: 1.3 }}>margem bruta − taxa real Fisher</div>
          </div>
          <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', borderTop: `2px solid ${BLUE}` }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>CAC Ajustado</div>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'monospace', color: BLUE }}>R${cacAjustado.toFixed(2)}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 3, lineHeight: 1.3 }}>
              {cacIsEstimado ? 'ref.mercado' : 'seus dados'} × câmbio R${usdRate.toFixed(2)}/R$4,50
            </div>
          </div>
          {cpmReais > 0 && (
            <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', borderTop: `2px solid ${AMBER}` }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>CPM em R$</div>
              <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'monospace', color: AMBER }}>R${cpmReais.toFixed(2)}/mil</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 3, lineHeight: 1.3 }}>US${cpmUsdVal.toFixed(2)} × R${usdRate.toFixed(2)}</div>
            </div>
          )}
          {custoGiroMensal > 0 && (
            <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', borderTop: `2px solid ${RED}` }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Custo de Giro</div>
              <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'monospace', color: RED }}>R${custoGiroMensal.toFixed(2)}/mês</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 3, lineHeight: 1.3 }}>se financiar via banco a {(selicRate * 2.5).toFixed(2)}% a.a.</div>
            </div>
          )}
        </div>
      </div>

      {/* ── 4b. VERDICT — CRESCER AGORA? ── */}
      {(despesas > 0 || receita > 0) && (() => {
        const cdiAnual  = selicRate - 0.1
        const roiVsCdi  = metrics.roi - cdiAnual
        const pts = [
          metrics.runway > 6 ? 1 : metrics.runway > 3 ? 0 : -1,
          sectorHeat > 70 ? 1 : sectorHeat > 40 ? 0 : -1,
          metrics.margemReal > 5 ? 1 : metrics.margemReal > 0 ? 0 : -1,
          roiVsCdi > 5 ? 1 : roiVsCdi > -5 ? 0 : -1,
          metrics.ltvCac > 3 ? 1 : metrics.ltvCac > 1 ? 0 : -1,
        ].reduce((a, b) => a + b, 0)
        const v = pts >= 3
          ? { text: 'CRESCER AGORA', color: GREEN, icon: '▲', reason: `Setor ${sectorHeat}/100 + margem real ${metrics.margemReal.toFixed(1)}% + runway ${metrics.runway >= 999 ? '∞' : metrics.runway.toFixed(1) + 'm'} = janela aberta.` }
          : pts >= 0
          ? { text: 'AGUARDAR / TESTAR', color: AMBER, icon: '◆', reason: `Valide unit economics antes de escalar. CAC ajustado R$${cacAjustado.toFixed(0)} precisa de LTV firme (atual ${metrics.ltvCac.toFixed(1)}x).` }
          : { text: 'NÃO CRESCER AGORA', color: RED, icon: '▼', reason: `Taxa real ${taxaRealExata.toFixed(2)}% pressiona margens. Priorize: cortar burn real (R$${burnReal.toFixed(0)}/mês), proteger caixa e reter clientes.` }
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
          </>
        )}
      </div>
    </motion.div>
  )
}
