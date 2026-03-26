'use client'

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
  const selic = vv(data.macro?.selic?.value, 10.5)
  const ipca  = vv(data.macro?.ipca?.value, 4.8)
  const pib   = vv(data.macro?.pib?.value, 2.9)
  const usd   = vv(data.macro?.usdBrl?.value, 5.72)
  return { selic, ipca, pib, usd }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildHeadline(data: any): { before: string; highlight: string; after: string } {
  const { selic, ipca, pib } = getValues(data)
  if (selic > 13) return { before: 'Juro alto domina: SELIC ', highlight: `${selic.toFixed(1)}%`, after: ' trava crédito e comprime margens' }
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
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildInsights(data: any): InsightCard[] {
  const { selic, ipca, pib, usd } = getValues(data)
  const bankRate = (selic * 2.5).toFixed(1)
  const metaBC = 3.25

  const creditColor = selic > 12 ? RED : selic > 9 ? AMBER : GREEN
  const creditTitle = selic > 9 ? 'Crédito caro' : 'Crédito acessível'
  const creditBody = `SELIC ${selic.toFixed(1)}% = empresas pagam ~${bankRate}% a.a. em financiamento bancário. ${selic > 12 ? 'Capital de giro fica inviável para PMEs. Priorize caixa próprio.' : 'Janela para financiar expansão.'}`

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
    { id: 'CREDITO', value: `${selic.toFixed(1)}%`, title: creditTitle, body: creditBody, color: creditColor, module: 'Cenários & Forecast' },
    { id: 'INFLACAO', value: `${ipca.toFixed(2)}%`, title: inflaTitle, body: inflaBody, color: inflaColor, module: 'Smart Pricing' },
    { id: 'CAMBIO', value: `R$${usd.toFixed(2)}`, title: cambioTitle, body: cambioBody, color: cambioColor, module: 'Cenários & Forecast' },
    { id: 'DEMANDA', value: `${pib > 0 ? '+' : ''}${pib.toFixed(1)}%`, title: demandaTitle, body: demandaBody, color: demandaColor, module: 'Cockpit Financeiro' },
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
              <div className="flex flex-col gap-0.5 overflow-x-auto">
                {sectors.map(s => {
                  const color = (s.trend === 'up' || s.change > 0) ? GREEN : (s.trend === 'down' || s.change < 0) ? RED : AMBER
                  const barW = Math.max(4, (s.heat / maxHeat) * 100)
                  return (
                    <div key={s.id} className="flex items-center gap-2" style={{ height: 28 }}>
                      <span className="font-mono text-[11px] text-white/50 w-[80px] shrink-0 truncate">{s.label ?? s.id}</span>
                      <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${barW}%` }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      <span className="font-mono text-[11px] w-[32px] text-right" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.heat}</span>
                      <span className="font-mono text-[11px] w-[52px] text-right" style={{ color }}>
                        {s.change > 0 ? '\u25B2' : s.change < 0 ? '\u25BC' : '\u25CF'}{Math.abs(s.change).toFixed(1)}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {tab === 'commodities' && (
            <motion.div key="commodities" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-wrap gap-2 py-1">
                {commodities.map(c => {
                  const color = trendColor(c.delta)
                  return (
                    <span key={c.key} className="font-mono text-[12px] px-2.5 py-1.5 rounded-md inline-flex items-center gap-1.5"
                      style={{ background: `${color}10`, color, border: `1px solid ${color}25` }}>
                      <span className="text-white/60">{c.label}</span>
                      {c.value != null && <span className="font-bold">${c.value.toFixed(2)}</span>}
                      <span>{c.delta > 0 ? '\u25B2' : '\u25BC'}{Math.abs(c.delta).toFixed(1)}%</span>
                    </span>
                  )
                })}
              </div>
            </motion.div>
          )}

          {tab === 'agentes' && (
            <motion.div key="agentes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-wrap gap-2 py-1">
                {agents.map(a => {
                  const color = trendColor(a.delta)
                  return (
                    <span key={a.id} className="font-mono text-[12px] px-2.5 py-1.5 rounded-md inline-flex items-center gap-1.5"
                      style={{ background: `${color}10`, color, border: `1px solid ${color}25` }}>
                      <span className="text-white/60">{a.label ?? a.id}</span>
                      <span className="font-bold">{a.delta > 0 ? '\u25B2' : '\u25BC'}{Math.abs(a.delta).toFixed(1)}%</span>
                    </span>
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
export default function MacroSection({ data }: { data: any }) {
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

      {/* ── 3-5. BOTTOM PANEL: Setores / Commodities / Agentes ── */}
      <BottomPanel data={data} />

    </div>
  )
}
