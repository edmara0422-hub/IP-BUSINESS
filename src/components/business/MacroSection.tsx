'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const RED   = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE  = '#1a5276'

// ══════════════════════════════════════════════════════════════════════════
// ██  HELPERS
// ══════════════════════════════════════════════════════════════════════════

function dimColor(s: 'good' | 'warning' | 'critical') {
  return s === 'good' ? GREEN : s === 'warning' ? AMBER : RED
}

interface DimScore {
  label: string; short: string; score: number; weight: number
  status: 'good' | 'warning' | 'critical'
  driver: string; detail: string
  pts: { label: string; value: number }[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildDimensions(data: any): DimScore[] {
  const clamp = (n: number) => Math.round(Math.max(5, Math.min(95, n)))
  const vv = (n: number | undefined, fb: number) => (n != null && Number.isFinite(n)) ? n : fb
  const selic = vv(data.macro.selic?.value, 10.5)
  const ipca  = vv(data.macro.ipca?.value, 4.8)
  const pib   = vv(data.macro.pib?.value, 2.9)
  const usd   = vv(data.macro.usdBrl?.value, 5.72)
  const sectors = data.sectors as Array<{ id: string; heat: number; change: number }>
  const comms = Object.values(data.commodities as Record<string, { delta: number }>)
  const agents = data.globalAgents as Array<{ delta: number }>
  const cacDelta = data.marketing?.cacTrend?.delta ?? 12

  const pibPts   = Math.min(60, Math.max(0, (pib + 3) / 11 * 60))
  const selicPts = Math.max(0, 40 - Math.max(0, selic - 5) * 3.6)
  const econ     = clamp(pibPts + selicPts)
  const metaBC   = 3.25
  const ipcaOvr  = Math.max(0, ipca - metaBC)
  const infla    = clamp(100 - ipcaOvr * 13)
  const commAvgDelta = comms.reduce((s, c) => s + c.delta, 0) / Math.max(1, comms.length)
  const comm     = clamp(50 + commAvgDelta * 4)
  const techHeat = sectors.find(s => s.id === 'tech')?.heat ?? 60
  const agentAvg = agents.slice(0, 3).reduce((s, a) => s + a.delta, 0) / 3
  const tech     = clamp(techHeat * 0.72 + Math.min(95, 50 + agentAvg * 10) * 0.28)
  const mktAvg   = sectors.reduce((s, sec) => s + sec.heat, 0) / Math.max(1, sectors.length)
  const mktBroad = clamp(mktAvg)
  const inovScore = clamp(tech * 0.75 + mktBroad * 0.25)
  const esgBase  = 55 + (pib > 2 ? 6 : pib < 0 ? -8 : 0) - Math.max(0, ipca - 4) * 2.5 - Math.max(0, usd - 5.5) * 3
  const esg      = clamp(esgBase)
  const mkt      = clamp(72 - cacDelta * 1.7)
  const status   = (s: number): 'good' | 'warning' | 'critical' => s >= 65 ? 'good' : s >= 42 ? 'warning' : 'critical'

  return [
    { label: 'Econômico', short: 'ECON', score: econ, weight: 0.20, status: status(econ),
      driver: `PIB +${pib.toFixed(1)}% · SELIC ${selic.toFixed(1)}%`,
      detail: `PIB cresce ${pib.toFixed(1)}%. SELIC em ${selic.toFixed(1)}% ${selic > 13 ? 'impõe custo de capital elevado, frenando investimentos' : 'em patamar controlado'}.`,
      pts: [{ label: `PIB ${pib.toFixed(1)}%`, value: Math.round(pibPts) }, { label: `SELIC ${selic.toFixed(1)}%`, value: Math.round(selicPts) }] },
    { label: 'Inflação / Social', short: 'IPCA', score: infla, weight: 0.15, status: status(infla),
      driver: `IPCA ${ipca.toFixed(2)}% · Meta BC ${metaBC}%`,
      detail: `IPCA em ${ipca.toFixed(2)}%: ${ipca <= metaBC ? 'abaixo da meta' : ipca <= 4.75 ? 'acima da meta mas dentro da banda' : 'fora da banda — BC sob pressão'}.`,
      pts: [{ label: `Desvio meta`, value: Math.round(100 - ipcaOvr * 13) }] },
    { label: 'Commodities', short: 'COMM', score: comm, weight: 0.15, status: status(comm),
      driver: `Média ${comms.length} commod.: ${commAvgDelta > 0 ? '+' : ''}${commAvgDelta.toFixed(1)}%`,
      detail: `${commAvgDelta > 2 ? 'Alta pressiona inflação de insumos.' : commAvgDelta > -2 ? 'Commodities estáveis.' : 'Queda alivia inflação de insumos.'}`,
      pts: comms.slice(0, 3).map((c, i) => ({ label: `Commodity ${i + 1}`, value: Math.round(50 + c.delta * 4) })) },
    { label: 'Tech & Digital', short: 'TECH', score: tech, weight: 0.15, status: status(tech),
      driver: `Tech heat: ${techHeat}/100 · Big techs: ${agentAvg > 0 ? '+' : ''}${agentAvg.toFixed(1)}%`,
      detail: `Setor tech ${tech >= 70 ? 'aquecido' : tech >= 50 ? 'moderado' : 'desacelerando'}. Big techs globais: ${agentAvg.toFixed(1)}%.`,
      pts: [{ label: `Heat tech`, value: Math.round(techHeat * 0.72) }, { label: `Big techs`, value: Math.round(Math.min(95, 50 + agentAvg * 10) * 0.28) }] },
    { label: 'Mercado Amplo', short: 'MKTD', score: mktBroad, weight: 0.15, status: status(mktBroad),
      driver: `Média ${sectors.length} setores: ${mktAvg.toFixed(0)}/100`,
      detail: `${mktAvg >= 65 ? 'Expansão generalizada.' : mktAvg >= 50 ? 'Crescimento heterogêneo — setores divergem.' : 'Mercado contraindo na maioria dos setores.'}`,
      pts: sectors.slice(0, 3).map(s => ({ label: s.id, value: s.heat })) },
    { label: 'Inovação', short: 'INOV', score: inovScore, weight: 0.10, status: status(inovScore),
      driver: `Tech (75%) + Mercado (25%)`,
      detail: `${inovScore >= 70 ? 'Startups conseguem funding, M&A aquece.' : 'Custo de capital alto inibe R&D.'}`,
      pts: [{ label: 'Tech', value: Math.round(tech * 0.75) }, { label: 'Market', value: Math.round(mktBroad * 0.25) }] },
    { label: 'ESG / Sustent.', short: 'ESG', score: esg, weight: 0.10, status: status(esg),
      driver: `Proxy via macro (PIB, IPCA, câmbio)`,
      detail: `PIB positivo (+${pib > 2 ? 6 : 0}pts). IPCA pressiona desigualdade (-${(Math.max(0, ipca - 4) * 2.5).toFixed(0)}pts). Câmbio alto encarece energia limpa (-${(Math.max(0, usd - 5.5) * 3).toFixed(0)}pts).`,
      pts: [{ label: `PIB proxy`, value: esg }] },
    { label: 'Marketing', short: 'MRKT', score: mkt, weight: 0.10, status: status(mkt),
      driver: `CAC trend: +${cacDelta.toFixed(0)}% YoY`,
      detail: `CAC ${cacDelta > 0 ? `subindo +${cacDelta.toFixed(0)}%` : `caindo ${cacDelta.toFixed(0)}%`} YoY — ${cacDelta > 20 ? 'eficiência caindo drasticamente.' : cacDelta > 10 ? 'pressão gerenciável.' : 'eficiência mantida.'}`,
      pts: [{ label: `CAC trend`, value: mkt }] },
  ]
}

// ══════════════════════════════════════════════════════════════════════════
// ██  "COMO AFETA SEU NEGÓCIO" — dynamic sentence per dimension
// ══════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function businessImpactSentence(dim: DimScore, data: any): string {
  const vv = (n: number | undefined, fb: number) => (n != null && Number.isFinite(n)) ? n : fb
  const selic = vv(data.macro.selic?.value, 10.5)
  const pib   = vv(data.macro.pib?.value, 2.9)
  const ipca  = vv(data.macro.ipca?.value, 4.8)
  const cacDelta = data.marketing?.cacTrend?.delta ?? 12
  const comms = Object.values(data.commodities as Record<string, { delta: number }>)
  const commAvgDelta = comms.reduce((s, c) => s + c.delta, 0) / Math.max(1, comms.length)
  const sectors = data.sectors as Array<{ heat: number }>
  const mktAvg = sectors.reduce((s, sec) => s + sec.heat, 0) / Math.max(1, sectors.length)

  switch (dim.short) {
    case 'ECON':
      return `PIB ${pib > 0 ? '+' : ''}${pib.toFixed(1)}% = ${pib > 1 ? 'mais' : 'menos'} demanda. SELIC ${selic.toFixed(1)}% = crédito ${selic > 12 ? 'caro' : 'acessível'}.`
    case 'IPCA':
      return `Inflação ${ipca.toFixed(2)}% ${ipca > 4.75 ? 'corrói' : 'mantém'} poder de compra do cliente.`
    case 'COMM':
      return `Commodities ${commAvgDelta > 2 ? 'subindo' : commAvgDelta > -2 ? 'estáveis' : 'caindo'} = insumos ${commAvgDelta > 2 ? 'mais caros' : 'mais baratos'}.`
    case 'TECH':
      return `Setor tech heat ${dim.score} = ${dim.score >= 65 ? 'fácil' : 'difícil'} adotar ferramentas digitais.`
    case 'MKTD':
      return `Mercado ${mktAvg >= 55 ? 'expandindo' : 'contraindo'} = ${mktAvg >= 55 ? 'bom' : 'mau'} momento para escalar.`
    case 'INOV':
      return `Ambiente ${dim.score >= 60 ? 'favorável' : 'hostil'} para inovação e lançamentos.`
    case 'ESG':
      return `Pressão ESG ${dim.score >= 60 ? 'alta' : 'baixa'} = compliance ${dim.score >= 60 ? 'urgente' : 'pode esperar'}.`
    case 'MRKT':
      return `CAC ${cacDelta > 0 ? 'subindo' : 'caindo'} = aquisição de cliente ${cacDelta > 0 ? 'comprime' : 'libera'} margem.`
    default:
      return ''
  }
}

// ══════════════════════════════════════════════════════════════════════════
// ██  "ONDE RESOLVER" — admin module badges per dimension
// ══════════════════════════════════════════════════════════════════════════

const ADMIN_MODULES: Record<string, string[]> = {
  ECON: ['Cenários & Forecast', 'Cockpit Financeiro'],
  IPCA: ['Smart Pricing', 'Cockpit Financeiro'],
  COMM: ['Smart Pricing', 'Cenários & Forecast'],
  TECH: ['Inovação & Tendências'],
  MKTD: ['Mercado & Concorrência'],
  INOV: ['Inovação & Tendências', 'Canvas & Pitch'],
  ESG:  ['ESG & Ética'],
  MRKT: ['Mercado & Concorrência', 'Smart Pricing'],
}

// ══════════════════════════════════════════════════════════════════════════
// ██  DimensionCard — interactive card with expand/collapse
// ══════════════════════════════════════════════════════════════════════════

function DimensionCard({ dim, isExpanded, onToggle, businessImpact }: {
  dim: DimScore; isExpanded: boolean; onToggle: () => void; businessImpact: string
}) {
  const color = dimColor(dim.status)
  const statusLabel = dim.status === 'good' ? 'SAUDÁVEL' : dim.status === 'warning' ? 'MODERADO' : 'CRÍTICO'
  const modules = ADMIN_MODULES[dim.short] ?? []

  return (
    <motion.div
      layout
      onClick={onToggle}
      className="rounded-lg overflow-hidden cursor-pointer"
      style={{
        background: isExpanded ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.3)',
        border: `1px solid ${isExpanded ? color + '40' : 'rgba(255,255,255,0.06)'}`,
        gridColumn: isExpanded ? '1 / -1' : undefined,
      }}
      transition={{ layout: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
    >
      {/* Colored top border */}
      <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${color}80, ${color}30)` }} />

      {/* Collapsed content */}
      <div className="px-3 py-2.5">
        <p className="font-mono text-[12px] font-bold tracking-[0.1em]" style={{ color }}>{dim.short}</p>
        <p className="text-[12px] text-white/40 mt-0.5 leading-tight">{dim.label}</p>

        <div className="mt-2 flex items-end justify-between">
          <span className="font-mono text-[24px] font-bold leading-none" style={{ color }}>{dim.score}</span>
          <span className="font-mono text-[13px] px-1.5 py-0.5 rounded-sm mb-1"
            style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
            {statusLabel}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-2 w-full h-[4px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${dim.score}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <p className="font-mono text-[12px] text-white/30 mt-1.5 leading-tight truncate">{dim.driver}</p>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 pb-3 border-t border-white/5 pt-2.5">
              {/* Detail paragraph */}
              <p className="text-[12px] text-white/45 leading-relaxed mb-3">{dim.detail}</p>

              {/* COMO AFETA SEU NEGÓCIO */}
              {businessImpact && (
                <div className="mb-3">
                  <div className="rounded-sm px-2.5 py-2" style={{ background: `${BLUE}12`, border: `1px solid ${BLUE}25` }}>
                    <span className="font-mono text-[13px] font-bold tracking-[0.15em] block mb-1" style={{ color: '#5dade2' }}>COMO AFETA SEU NEGÓCIO</span>
                    <p className="text-[12px] text-white/50 leading-relaxed">{businessImpact}</p>
                  </div>
                </div>
              )}

              {/* ONDE RESOLVER */}
              {modules.length > 0 && (
                <div className="mb-3">
                  <span className="font-mono text-[13px] font-bold tracking-[0.15em] text-white/20 block mb-1.5">ONDE RESOLVER</span>
                  <div className="flex flex-wrap gap-1.5">
                    {modules.map((mod) => (
                      <span key={mod} className="font-mono text-[12px] px-2 py-1 rounded-sm"
                        style={{ background: 'rgba(26,82,118,0.15)', color: '#2471a3', border: '1px solid rgba(26,82,118,0.3)' }}>
                        {'\u2192'} {mod}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Breakdown points */}
              <div className="flex flex-wrap gap-1.5">
                {dim.pts.map((p, i) => (
                  <div key={i} className="flex items-center gap-1 rounded-sm px-1.5 py-0.5"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-[12px] text-white/25">{p.label}</span>
                    <span className="font-mono text-[13px] font-bold" style={{ color }}>{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ██  PRINCIPAL
// ══════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MacroSection({ data }: { data: any }) {
  const dimensions = useMemo(() => buildDimensions(data), [data])

  // ── Accordion state — only one expanded at a time, -1 = none ──
  const [expandedIdx, setExpandedIdx] = useState<number>(-1)

  const handleToggle = useCallback((i: number) => {
    setExpandedIdx(prev => prev === i ? -1 : i)
  }, [])

  const marketScore = useMemo(() => Math.round(dimensions.reduce((a, d) => a + d.score * d.weight, 0)), [dimensions])
  const scoreStatus = marketScore >= 65 ? 'good' : marketScore >= 45 ? 'warning' : 'critical'
  const scoreColor  = scoreStatus === 'good' ? GREEN : scoreStatus === 'warning' ? AMBER : RED
  const scoreLabel  = scoreStatus === 'good' ? 'SAUDÁVEL' : scoreStatus === 'warning' ? 'MODERADO' : 'CRÍTICO'

  // ── Hero summary sentence ──
  const heroSummary = marketScore >= 65
    ? `Ambiente saudável: condições favoráveis para crescer e investir.`
    : marketScore >= 45
    ? `Ambiente moderado: crescimento existe mas juro alto freia expansão.`
    : `Ambiente crítico: foco em resiliência e eficiência operacional.`

  return (
    <div className="flex flex-col gap-4 px-4 pb-8">

      {/* ── 1. QUESTION HEADER ── */}
      <div className="text-center mb-4">
        <p className="font-mono text-[12px] font-bold tracking-[0.3em] text-white/20 uppercase">Análise Macroeconômica</p>
        <h2 className="text-[15px] font-semibold text-white/60 mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
          O que está movendo a <span className="text-white/90">economia</span>?
        </h2>
      </div>

      {/* ── 2. MARKET SCORE HERO ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
      >
        <span className="font-mono font-bold leading-none" style={{ color: scoreColor, fontSize: 36 }}>{marketScore}</span>
        <span className="font-mono text-[13px] font-bold tracking-[0.2em] mt-1.5 px-2.5 py-0.5 rounded-sm"
          style={{ background: `${scoreColor}15`, color: scoreColor, border: `1px solid ${scoreColor}30` }}>
          {scoreLabel}
        </span>
        <p className="text-[13px] text-white/50 leading-relaxed text-center mt-2 max-w-[320px]">{heroSummary}</p>

        {/* Thin progress bar */}
        <div className="mt-3 w-full max-w-[280px] h-[4px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: scoreColor }}
            initial={{ width: 0 }}
            animate={{ width: `${marketScore}%` }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </motion.div>

      {/* ── 3. DIMENSION CARDS GRID ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {dimensions.map((dim, i) => (
          <DimensionCard
            key={dim.short}
            dim={dim}
            isExpanded={expandedIdx === i}
            onToggle={() => handleToggle(i)}
            businessImpact={businessImpactSentence(dim, data)}
          />
        ))}
      </motion.div>

    </div>
  )
}
