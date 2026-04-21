'use client'
// v2 — setores com contexto inteligente
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const RED   = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE  = '#1a5276'

const ADMIN_MODULES: Record<string, string[]> = {
  CREDITO:  ['Cenários & Forecast'],
  INFLACAO: ['Smart Pricing'],
  CAMBIO:   ['Cenários & Forecast'],
  DEMANDA:  ['Cockpit Financeiro'],
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getValues(data: any) {
  const vv = (n: number | undefined, fb: number) => (n != null && Number.isFinite(n)) ? n : fb
  const selic = vv(data.macro?.selic?.value, 14.75)
  const ipca  = vv(data.macro?.ipca?.value, 4.14)
  const pib   = vv(data.macro?.pib?.value, 1.86)
  const usd   = vv(data.macro?.usdBrl?.value, 4.98)
  return { selic, ipca, pib, usd }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildHeadline(data: any): { before: string; highlight: string; after: string } {
  const { selic, ipca, pib } = getValues(data)
  if (selic > 13) return { before: 'Juro alto domina: SELIC ', highlight: `${selic.toFixed(2)}%`, after: ' trava crédito e comprime margens' }
  if (ipca > 5) return { before: 'Inflação acima da meta: ', highlight: `IPCA ${ipca.toFixed(2)}%`, after: ' — poder de compra do consumidor cai' }
  if (pib > 3) return { before: 'Economia aquecida: PIB ', highlight: `${pib.toFixed(1)}%`, after: ' abre janela de crescimento' }
  return { before: 'Mercado misto: ', highlight: 'crescimento lento', after: ' com custo alto' }
}

interface InsightCard {
  id: string
  value: string
  title: string
  body: string
  color: string
  module: string
  affects: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildInsights(data: any): InsightCard[] {
  const { selic, ipca, pib, usd } = getValues(data)
  const bankRate = (selic * 2.5).toFixed(1)
  const metaBC = 3.25

  const creditColor = selic > 12 ? RED : selic > 9 ? AMBER : GREEN
  const creditTitle = selic > 9 ? 'Crédito caro' : 'Crédito acessível'
  const creditBody = `SELIC ${selic.toFixed(2)}% = empresas pagam ~${bankRate}% a.a. em financiamento bancário. ${selic > 12 ? 'Capital de giro fica inviável para PMEs. Priorize caixa próprio.' : 'Janela para financiar expansão.'}`

  const inflaColor = ipca > 6 ? RED : ipca > 4 ? AMBER : GREEN
  const inflaTitle = ipca > 4.75 ? 'Poder de compra caindo' : 'Poder de compra estável'
  const lossPerThousand = ((ipca - metaBC) / 100 * 1000).toFixed(0)
  const inflaBody = `IPCA ${ipca.toFixed(2)}% vs meta BC ${metaBC}%. ${ipca > 4.75 ? `Seu cliente perdeu ~R$${lossPerThousand} em cada mil de renda. Reajuste de preço inevitável.` : 'Dentro da banda — sem pressão imediata.'}`

  const cambioColor = usd > 6 ? RED : usd > 5.3 ? AMBER : GREEN
  const cambioTitle = usd > 5.5 ? 'Importação cara' : 'Importação acessível'
  const pctMore = ((usd / 4.5 - 1) * 100).toFixed(0)
  const cambioBody = `Dólar R$${usd.toFixed(2)}. ${usd > 5.5 ? `Insumos importados, SaaS em dólar e equipamentos custam ${pctMore}% mais que há 2 anos. Fornecedor nacional ganha competitividade.` : 'Câmbio favorável para importação e tech.'}`

  const demandaColor = pib > 2.5 ? GREEN : pib > 0 ? AMBER : RED
  const demandaTitle = pib > 2.5 ? 'Economia crescendo' : pib > 0 ? 'Economia estagnada' : 'Economia contraindo'
  const demandaBody = `PIB ${pib > 0 ? '+' : ''}${pib.toFixed(1)}%. ${pib > 2.5 ? 'Consumo em expansão — bom momento para investir em aquisição e contratar.' : pib > 0 ? 'Crescimento fraco — foque em eficiência antes de expandir.' : 'Contração — modo sobrevivência: corte custos, proteja caixa.'}`

  return [
    { id: 'CREDITO', value: `${selic.toFixed(2)}%`, title: creditTitle, body: creditBody, color: creditColor, module: 'Cenários & Forecast', affects: selic > 12 ? 'PME, varejo, startups em growth' : 'Funding, expansão, contratação' },
    { id: 'INFLACAO', value: `${ipca.toFixed(2)}%`, title: inflaTitle, body: inflaBody, color: inflaColor, module: 'Smart Pricing', affects: ipca > 4.75 ? 'Preço, demanda, cesta básica' : 'Poder de compra estável' },
    { id: 'CAMBIO', value: `R$${usd.toFixed(2)}`, title: cambioTitle, body: cambioBody, color: cambioColor, module: 'Cenários & Forecast', affects: usd > 5.5 ? 'Custo, insumos, SaaS em dólar' : 'Importação acessível' },
    { id: 'DEMANDA', value: `${pib > 0 ? '+' : ''}${pib.toFixed(1)}%`, title: demandaTitle, body: demandaBody, color: demandaColor, module: 'Cockpit Financeiro', affects: pib > 2.5 ? 'Aquisição, escala, contratação' : pib > 0 ? 'Eficiência operacional' : 'Corte de custos, caixa' },
  ]
}

// ══════════════════════════════════════════════════════════════════════════
// ██  INSIGHT CARD
// ══════════════════════════════════════════════════════════════════════════

function InsightCardComponent({ card, index }: { card: InsightCard; index: number }) {
  const labels: Record<string, string> = { CREDITO: 'CRÉDITO', INFLACAO: 'INFLAÇÃO', CAMBIO: 'CÂMBIO', DEMANDA: 'DEMANDA' }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-lg overflow-hidden flex"
      style={{
        background: 'rgba(0,0,0,0.35)',
        borderLeft: `4px solid ${card.color}`,
      }}
    >
      {/* Left: big number */}
      <div className="flex flex-col items-center justify-center px-4 py-4 min-w-[90px]"
        style={{ background: `${card.color}08` }}>
        <span className="font-mono text-[10px] font-bold tracking-[0.15em] mb-1" style={{ color: `${card.color}90` }}>
          {labels[card.id] ?? card.id}
        </span>
        <span className="font-mono text-[24px] font-bold leading-none" style={{ color: card.color }}>
          {card.value}
        </span>
      </div>

      {/* Right: content */}
      <div className="flex flex-col justify-center px-3 py-3 flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-white/85 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {card.title}
        </p>
        <p className="text-[12px] text-white/50 leading-relaxed mt-1.5">
          {card.body}
        </p>
        <p className="font-mono text-[10px] text-white/30 mt-1.5">
          Afeta: <span className="text-white/45">{card.affects}</span>
        </p>
        <span className="font-mono text-[11px] px-2 py-0.5 rounded-sm mt-2 self-start inline-flex items-center gap-1"
          style={{ background: 'rgba(26,82,118,0.15)', color: '#2471a3', border: '1px solid rgba(26,82,118,0.3)' }}>
          &rarr; {card.module}
        </span>
      </div>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ██  BOTTOM PANEL: Setores / Commodities / Agentes (tabbed)
// ══════════════════════════════════════════════════════════════════════════

type BottomTab = 'setores' | 'commodities' | 'agentes'

// ── Contexto inteligente por setor ──
const SECTOR_CONTEXT: Record<string, string> = {
  tech:      'IA e cloud computing puxam crescimento. Empresas que adotam tech escalam mais rápido e reduzem custo operacional.',
  agro:      'Brasil é líder global em exportação agrícola. Dólar alto favorece exportador mas encarece insumos importados.',
  health:    'MedTech e telemedicina crescem pós-pandemia. Regulação pesada mas mercado resiliente a ciclos econômicos.',
  energy:    'Transição energética acelera. Solar e eólica crescem 20%+ a.a. Petróleo ainda domina mas perde espaço.',
  fintech:   'Pix, open banking e crédito digital transformam o setor. Nubank e Inter lideram. Regulação do BC aumenta.',
  logistics: 'E-commerce impulsiona logística last-mile. Automação de armazéns e frota elétrica são tendências fortes.',
  services:  'Setor sensível a PIB — cresce quando economia expande, contrai rápido em recessão.',
  retail:    'Varejo físico perde espaço para e-commerce. Juro alto mata crédito ao consumidor e comprime vendas.',
  media:     'Mídia tradicional em declínio estrutural. Audiência migrou para digital. Modelo de negócio quebrado.',
}

// ── Contexto por commodity ──
const COMMODITY_CONTEXT: Record<string, (delta: number) => string> = {
  gold:    (d) => d > 0 ? 'Ouro subindo = investidores buscam proteção. Sinal de incerteza global.' : 'Ouro caindo = confiança no mercado aumenta. Dinheiro sai de porto seguro para risco.',
  oil:     (d) => d > 0 ? 'Petróleo subindo = frete e energia ficam mais caros. Pressiona inflação e custo logístico.' : 'Petróleo caindo = alívio nos custos de transporte e energia. Bom para margens.',
  silver:  (d) => d > 0 ? 'Prata sobe com demanda industrial (eletrônicos, solar) e como reserva de valor.' : 'Prata cai — menor demanda industrial ou dólar fortalecendo.',
  grains:  (d) => d > 0 ? 'Grãos subindo = custo de alimentação sobe. Pressiona inflação de alimentos no Brasil.' : 'Grãos caindo = alívio na cesta básica. Bom para poder de compra do consumidor.',
  copper:  (d) => d > 0 ? 'Cobre subindo = sinal de atividade industrial global. Usado em construção, eletrônicos e energia.' : 'Cobre caindo = desaceleração industrial. Indicador antecedente de recessão.',
  lithium: (d) => d > 0 ? 'Lítio subindo = demanda por baterias e veículos elétricos aquecida.' : 'Lítio caindo = excesso de oferta ou desaceleração do mercado de EVs.',
}

// ── Contexto por agente global ──
const AGENT_CONTEXT: Record<string, (delta: number) => string> = {
  aapl:  (d) => d > 0 ? 'Apple subindo = consumo premium aquecido. Bom sinal para produtos de alto valor agregado.' : 'Apple caindo = consumidor premium recua. Pode indicar desaceleração de gastos discricionários.',
  googl: (d) => d > 0 ? 'Google subindo = mercado de ads aquecido. CPC pode subir, encarecendo aquisição de clientes.' : 'Google caindo = investidores preocupados com IA concorrente. CPC pode cair — oportunidade.',
  meta:  (d) => d > 0 ? 'Meta subindo = mais anunciantes competindo. CPM sobe, seu custo de ads no Instagram/Facebook aumenta.' : 'Meta caindo = anunciantes reduzindo budget. CPM pode cair — janela para escalar ads.',
  amzn:  (d) => d > 0 ? 'Amazon subindo = e-commerce e cloud crescem. Pressão competitiva no varejo online aumenta.' : 'Amazon caindo = desaceleração do e-commerce global. Menos competição mas também menos demanda.',
  vale:  (d) => d > 0 ? 'Vale subindo = minério de ferro valorizado. Dólar real e Ibovespa se beneficiam. Bom para PIB.' : 'Vale caindo = China desacelerando compra de minério. Impacto negativo no PIB e câmbio.',
  petr:  (d) => d > 0 ? 'Petrobras subindo = petróleo valorizado + dividendos atraentes. Combustível pode subir.' : 'Petrobras caindo = petróleo desvaloriza ou risco político. Combustível pode cair — bom para frete.',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BottomPanel({ data }: { data: any }) {
  const [tab, setTab] = useState<BottomTab>('setores')

  const sectors = useMemo(() => {
    const raw = data.sectors as Array<{ id: string; label?: string; heat: number; change: number; trend?: string }>
    return [...raw].sort((a, b) => b.heat - a.heat)
  }, [data.sectors])

  const commodities = useMemo(() => {
    const raw = data.commodities as Record<string, { label?: string; value?: number; delta: number }>
    return Object.entries(raw).map(([key, c]) => ({
      key,
      label: c.label ?? key,
      value: c.value,
      delta: c.delta,
    }))
  }, [data.commodities])

  const agents = useMemo(() => {
    const raw = data.globalAgents as Array<{ id: string; label?: string; delta: number }>
    return raw
  }, [data.globalAgents])

  const trendColor = (val: number) => val > 0 ? GREEN : val < 0 ? RED : AMBER
  const tabs: { key: BottomTab; label: string }[] = [
    { key: 'setores', label: 'SETORES' },
    { key: 'commodities', label: 'COMMODITIES' },
    { key: 'agentes', label: 'AGENTES GLOBAIS' },
  ]

  const maxHeat = Math.max(...sectors.map(s => s.heat), 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="rounded-lg overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Tab buttons */}
      <div className="flex border-b border-white/5">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex-1 py-2 font-mono text-[11px] font-bold tracking-[0.15em] transition-colors"
            style={{
              color: tab === t.key ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)',
              background: tab === t.key ? 'rgba(255,255,255,0.04)' : 'transparent',
              borderBottom: tab === t.key ? `2px solid ${BLUE}` : '2px solid transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-3 py-2.5">
        <AnimatePresence mode="wait">
          {tab === 'setores' && (
            <motion.div key="setores" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-col gap-2">
                {sectors.map(s => {
                  const color = (s.trend === 'up' || s.change > 0) ? GREEN : (s.trend === 'down' || s.change < 0) ? RED : AMBER
                  const barW = Math.max(4, (s.heat / maxHeat) * 100)
                  const ctx = SECTOR_CONTEXT[s.id]
                  return (
                    <div key={s.id} className="rounded-md overflow-hidden" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: `3px solid ${color}` }}>
                      <div className="px-3 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[13px] font-semibold text-white/60">{s.label ?? s.id}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-white/30">oport {s.heat}/100</span>
                            <div className="flex flex-col items-end">
                              <span className="font-mono text-[12px] font-bold" style={{ color }}>
                                {s.change > 0 ? '\u25B2' : s.change < 0 ? '\u25BC' : '\u2014'}{s.change !== 0 ? Math.abs(s.change).toFixed(1) + '%' : 'hoje'}
                              </span>
                              <span className="font-mono text-[9px] text-white/20">delta diário</span>
                            </div>
                          </div>
                        </div>
                        <div className="h-[4px] rounded-full overflow-hidden mb-1.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <motion.div className="h-full rounded-full" style={{ background: color }}
                            initial={{ width: 0 }} animate={{ width: `${barW}%` }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
                        </div>
                        {ctx && <p className="text-[11px] text-white/35 leading-snug">{ctx}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {tab === 'commodities' && (
            <motion.div key="commodities" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-col gap-2">
                {commodities.map(c => {
                  const color = trendColor(c.delta)
                  const ctx = COMMODITY_CONTEXT[c.key]
                  return (
                    <div key={c.key} className="rounded-md px-3 py-2" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: `3px solid ${color}` }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-semibold text-white/60">{c.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[13px] font-bold text-white/70">${c.value != null ? (c.value > 1000 ? c.value.toFixed(0) : c.value.toFixed(2)) : '—'}</span>
                          <span className="font-mono text-[12px] font-bold" style={{ color }}>
                            {c.delta > 0 ? '\u25B2' : '\u25BC'}{Math.abs(c.delta).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      {ctx && <p className="text-[11px] text-white/35 leading-snug">{ctx(c.delta)}</p>}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {tab === 'agentes' && (
            <motion.div key="agentes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-col gap-2">
                {agents.map(a => {
                  const color = trendColor(a.delta)
                  const ctx = AGENT_CONTEXT[a.id]
                  return (
                    <div key={a.id} className="rounded-md px-3 py-2" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: `3px solid ${color}` }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-semibold text-white/60">{a.label ?? a.id}</span>
                        <span className="font-mono text-[13px] font-bold" style={{ color }}>
                          {a.delta > 0 ? '\u25B2+' : '\u25BC'}{Math.abs(a.delta).toFixed(1)}%
                        </span>
                      </div>
                      {ctx && <p className="text-[11px] text-white/35 leading-snug">{ctx(a.delta)}</p>}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ██  PRINCIPAL
// ══════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MacroSection({ data, ai }: { data: any; ai?: any }) {
  const headline = useMemo(() => buildHeadline(data), [data])
  const insights = useMemo(() => buildInsights(data), [data])

  return (
    <div className="flex flex-col gap-4 px-4 pb-8">

      {/* ── 1. DYNAMIC HEADLINE ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-2"
      >
        <p className="font-mono text-[11px] font-bold tracking-[0.3em] text-white/20 uppercase mb-2">Briefing Econômico</p>
        <h2 className="text-[17px] font-semibold text-white/70 leading-snug" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {headline.before}
          <span className="text-white/95">{headline.highlight}</span>
          {headline.after}
        </h2>
      </motion.div>

      {/* ── 2. FOUR INSIGHT CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((card, i) => (
          <InsightCardComponent key={card.id} card={card} index={i} />
        ))}
      </div>

      {/* ── CASCATAS: cruzamento de indicadores ── */}
      {(() => {
        const { selic, ipca, pib, usd } = getValues(data)
        const taxaReal = (selic - ipca).toFixed(2)
        const meta = data?.globalAgents?.find((a: any) => a.id === 'meta')
        const cacD = data?.marketing?.cacTrend?.delta ?? 12
        const retailHeat = data?.sectors?.find((s: any) => s.id === 'retail')?.heat ?? 20
        const agroHeat = data?.sectors?.find((s: any) => s.id === 'agro')?.heat ?? 80
        const techHeat = data?.sectors?.find((s: any) => s.id === 'tech')?.heat ?? 70

        const cascades: Array<{ cross: string; insight: string; color: string }> = []

        // SELIC + IPCA = taxa real
        cascades.push({
          cross: `SELIC ${selic.toFixed(2)}% + IPCA ${ipca.toFixed(2)}%`,
          insight: `Taxa real de ${taxaReal}% — ${parseFloat(taxaReal) > 8 ? 'um dos maiores juros reais do mundo. Renda fixa paga mais que bolsa, capital foge de risco.' : parseFloat(taxaReal) > 5 ? 'juro real elevado. Investimento produtivo perde pra renda fixa.' : 'juro real moderado. Capital começa a voltar pra risco.'}`,
          color: parseFloat(taxaReal) > 8 ? RED : parseFloat(taxaReal) > 5 ? AMBER : GREEN,
        })

        // Câmbio + Meta = CPM
        if (meta) {
          const cpmImpact = ((usd / 4.5 - 1) * 100).toFixed(0)
          cascades.push({
            cross: `Dólar R$${usd.toFixed(2)} + Meta ${meta.delta > 0 ? '▲' : '▼'}${Math.abs(meta.delta).toFixed(1)}%`,
            insight: `CPM em reais sobe ${cpmImpact}% pelo câmbio${meta.delta > 0 ? ' + leilão mais competitivo' : ''}. ${cacD > 10 ? `CAC subindo ${cacD.toFixed(0)}% — custo de aquisição vai piorar.` : 'CAC ainda gerenciável.'}`,
            color: cacD > 15 ? RED : cacD > 8 ? AMBER : GREEN,
          })
        }

        // SELIC + Varejo
        if (selic > 12 && retailHeat < 40) {
          cascades.push({
            cross: `SELIC ${selic.toFixed(2)}% + Varejo heat ${retailHeat}/100`,
            insight: `Juro alto mata crédito ao consumidor → varejo contrai. Cada ponto de SELIC acima de 10% retira ~3% da demanda discricionária.`,
            color: RED,
          })
        }

        // PIB + Agro + Câmbio
        if (pib > 2 && agroHeat > 70) {
          cascades.push({
            cross: `PIB +${pib.toFixed(1)}% + Agro ${agroHeat}/100 + Dólar R$${usd.toFixed(2)}`,
            insight: `Economia crescendo + agro aquecido + dólar alto = exportadores com margem recorde. B2B agritech é oportunidade.`,
            color: GREEN,
          })
        }

        // Tech + PIB
        if (techHeat > 75) {
          cascades.push({
            cross: `Tech ${techHeat}/100 + PIB +${pib.toFixed(1)}%`,
            insight: `Setor tech aquecido com economia crescendo = janela para lançar produtos digitais e captar funding.`,
            color: GREEN,
          })
        }

        return cascades.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-lg overflow-hidden"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="px-4 py-3">
              <span className="font-mono text-[11px] font-bold tracking-[0.15em] text-white/25 block mb-3">CASCATAS — CRUZAMENTO DE INDICADORES</span>
              <div className="flex flex-col gap-2.5">
                {cascades.map((c, i) => (
                  <div key={i} className="rounded-md px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: `3px solid ${c.color}` }}>
                    <span className="font-mono text-[11px] font-bold text-white/50 block mb-1">{c.cross}</span>
                    <p className="text-[12px] text-white/40 leading-snug">{c.insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null
      })()}

      {/* ══ AI INSIGHTS ══ */}
      {ai?.macro_insights?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-lg overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(26,82,118,0.12) 0%, rgba(0,0,0,0.3) 100%)', border: '1px solid rgba(26,82,118,0.2)' }}
        >
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#5dade2', boxShadow: '0 0 6px #5dade2' }} />
              <span className="font-mono text-[10px] font-bold tracking-[0.2em]" style={{ color: '#5dade2' }}>ANÁLISE IA — CRUZAMENTO DE DADOS</span>
            </div>
            <div className="flex flex-col gap-2">
              {ai.macro_insights.map((insight: string, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="font-mono text-[11px] shrink-0 mt-0.5" style={{ color: '#5dade2' }}>{'\u2192'}</span>
                  <p className="text-[12px] text-white/55 leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── 3-5. BOTTOM PANEL: Setores / Commodities / Agentes ── */}
      <BottomPanel data={data} />

    </div>
  )
}
