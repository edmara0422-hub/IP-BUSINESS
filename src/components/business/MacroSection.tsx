'use client'

import { useState, useMemo, useEffect, useCallback, memo } from 'react'
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
// ██  MultidimRadial (single, bigger, centered)
// ══════════════════════════════════════════════════════════════════════════

const CX = 155, CY = 155, R_INNER = 40, R_MAX = 114, SPOKE_LEN = 74, R_LABEL = 132

const MultidimRadial = memo(function MultidimRadial({ dimensions, activeDim, onSelect, marketScore, scoreColor, scoreLabel }: {
  dimensions: DimScore[]; activeDim: number; onSelect: (i: number) => void
  marketScore: number; scoreColor: string; scoreLabel: string
}) {
  return (
    <svg viewBox="0 0 310 310" style={{ width: '100%', display: 'block', overflow: 'visible' }}>
      <circle cx={CX} cy={CY} r={R_MAX} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="3 5" />
      <circle cx={CX} cy={CY} r={(R_INNER + R_MAX) / 2} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
      {dimensions.map((dim, i) => {
        const angle = (i * 45 - 90) * (Math.PI / 180)
        const cos = Math.cos(angle), sin = Math.sin(angle)
        const x1 = CX + R_INNER * cos, y1 = CY + R_INNER * sin
        const xFull = CX + R_MAX * cos, yFull = CY + R_MAX * sin
        const scoreR = R_INNER + (dim.score / 100) * SPOKE_LEN
        const xScore = CX + scoreR * cos, yScore = CY + scoreR * sin
        const xLabel = CX + R_LABEL * cos, yLabel = CY + R_LABEL * sin
        const color = dimColor(dim.status)
        const isActive = activeDim === i
        return (
          <g key={dim.short} style={{ cursor: 'pointer' }} onClick={() => onSelect(i)}>
            <line x1={x1} y1={y1} x2={xFull} y2={yFull} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <motion.path d={`M ${x1} ${y1} L ${xFull} ${yFull}`}
              stroke={color} strokeWidth={isActive ? 3 : 1.5} strokeLinecap="round" fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: dim.score / 100, opacity: isActive ? 1 : 0.3 }}
              transition={{ duration: 1.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              style={isActive ? { filter: `drop-shadow(0 0 4px ${color}99)` } : {}} />
            <motion.circle cx={xScore} cy={yScore} fill={color}
              animate={{ r: isActive ? [3, 4.5, 3] : 2, opacity: isActive ? 1 : 0.3 }}
              transition={{ r: { duration: 1.4, repeat: Infinity }, opacity: { duration: 0.3 } }} />
            <line x1={x1} y1={y1} x2={xFull} y2={yFull} stroke="transparent" strokeWidth={20} />
            <text x={xLabel} y={yLabel} textAnchor="middle" dominantBaseline="middle"
              fontSize={isActive ? 8.5 : 7.5} fontFamily="monospace" fontWeight={isActive ? 'bold' : 'normal'}
              fill={isActive ? color : 'rgba(255,255,255,0.28)'} letterSpacing="0.1em">{dim.short}</text>
          </g>
        )
      })}
      <circle cx={CX} cy={CY} r={R_INNER} fill="rgba(0,0,0,0.85)" stroke={scoreColor} strokeWidth={1.5}
        style={{ filter: `drop-shadow(0 0 8px ${scoreColor}33)` }} />
      <text x={CX} y={CY - 8} textAnchor="middle" dominantBaseline="middle"
        fontSize={26} fontFamily="monospace" fontWeight="bold" fill={scoreColor}>{marketScore}</text>
      <text x={CX} y={CY + 13} textAnchor="middle" dominantBaseline="middle"
        fontSize={6.5} fontFamily="monospace" fill={scoreColor} letterSpacing="0.2em">{scoreLabel}</text>
    </svg>
  )
})

// ══════════════════════════════════════════════════════════════════════════
// ██  DimDetailPanel (with business impact + onde resolver)
// ══════════════════════════════════════════════════════════════════════════

function DimDetailPanel({ dim, scoreColor, businessImpact }: {
  dim: DimScore; scoreColor: string; businessImpact: string
}) {
  const color = dimColor(dim.status)
  const statusLabel = dim.status === 'good' ? 'SAUDAVEL' : dim.status === 'warning' ? 'MODERADO' : 'CRITICO'
  const contribution = Math.round(dim.score * dim.weight)
  const modules = ADMIN_MODULES[dim.short] ?? []

  return (
    <motion.div key={dim.short}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${color}22` }}>
      <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${color}80, transparent)` }} />

      {/* Header: Name + Score + Status */}
      <div className="px-3 py-2.5 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="font-mono text-[10px] font-bold" style={{ color }}>{dim.short}</span>
            <span className="font-mono text-[10px] text-white/50">{dim.label}</span>
            <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-sm" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>{statusLabel}</span>
          </div>
          <p className="font-mono text-[8px] text-white/30 mb-1">{dim.driver}</p>
          <p className="text-[10px] text-white/45 leading-relaxed">{dim.detail}</p>
        </div>
        <div className="flex flex-col items-center shrink-0">
          <span className="font-mono text-[28px] font-bold leading-none" style={{ color }}>{dim.score}</span>
          <span className="font-mono text-[7px] text-white/20 mt-0.5">peso {Math.round(dim.weight * 100)}%</span>
          <div className="mt-1 rounded-sm px-1.5 py-0.5" style={{ background: `${scoreColor}15`, border: `1px solid ${scoreColor}25` }}>
            <span className="font-mono text-[7px]" style={{ color: scoreColor }}>+{contribution}pts</span>
          </div>
        </div>
      </div>

      {/* COMO AFETA SEU NEGOCIO */}
      {businessImpact && (
        <div className="px-3 pb-2">
          <div className="rounded-sm px-2.5 py-2" style={{ background: `${BLUE}12`, border: `1px solid ${BLUE}25` }}>
            <span className="font-mono text-[7px] font-bold tracking-[0.15em] block mb-1" style={{ color: '#5dade2' }}>COMO AFETA SEU NEGOCIO</span>
            <p className="text-[10px] text-white/50 leading-relaxed">{businessImpact}</p>
          </div>
        </div>
      )}

      {/* ONDE RESOLVER */}
      {modules.length > 0 && (
        <div className="px-3 pb-2.5">
          <span className="font-mono text-[7px] font-bold tracking-[0.15em] text-white/20 block mb-1.5">ONDE RESOLVER</span>
          <div className="flex flex-wrap gap-1.5">
            {modules.map((mod) => (
              <span key={mod} className="font-mono text-[8px] px-2 py-1 rounded-sm"
                style={{ background: 'rgba(26,82,118,0.15)', color: '#2471a3', border: '1px solid rgba(26,82,118,0.3)' }}>
                {'\u2192'} {mod}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Breakdown points */}
      <div className="px-3 pb-2.5 flex flex-wrap gap-1.5">
        {dim.pts.map((p, i) => (
          <div key={i} className="flex items-center gap-1 rounded-sm px-1.5 py-0.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-[8px] text-white/25">{p.label}</span>
            <span className="font-mono text-[9px] font-bold" style={{ color }}>{p.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ██  PRINCIPAL
// ══════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MacroSection({ data }: { data: any }) {
  const dimensions = useMemo(() => buildDimensions(data), [data])

  // ── Radar state ──
  const [activeDim, setActiveDim] = useState(0)
  const [manualLock, setManualLock] = useState(false)

  const handleDimSelect = useCallback((i: number) => {
    if (manualLock && activeDim === i) { setManualLock(false) } else { setActiveDim(i); setManualLock(true) }
  }, [manualLock, activeDim])

  useEffect(() => {
    if (manualLock) return
    const t = setInterval(() => setActiveDim(p => (p + 1) % 8), 2800)
    return () => clearInterval(t)
  }, [manualLock])

  const marketScore = useMemo(() => Math.round(dimensions.reduce((a, d) => a + d.score * d.weight, 0)), [dimensions])
  const scoreStatus = marketScore >= 65 ? 'good' : marketScore >= 45 ? 'warning' : 'critical'
  const scoreColor  = scoreStatus === 'good' ? GREEN : scoreStatus === 'warning' ? AMBER : RED
  const scoreLabel  = scoreStatus === 'good' ? 'SAUDAVEL' : scoreStatus === 'warning' ? 'MODERADO' : 'CRITICO'

  const currentBizImpact = businessImpactSentence(dimensions[activeDim], data)

  // ── Hero summary sentence ──
  const heroSummary = marketScore >= 65
    ? `Score ${marketScore} \u2014 ambiente saud\u00e1vel: condi\u00e7\u00f5es favor\u00e1veis para crescer e investir.`
    : marketScore >= 45
    ? `Score ${marketScore} \u2014 ambiente moderado: crescimento existe mas juro alto freia expans\u00e3o.`
    : `Score ${marketScore} \u2014 ambiente cr\u00edtico: foco em resili\u00eancia e efici\u00eancia operacional.`

  return (
    <div className="flex flex-col gap-4 px-4 pb-8">

      {/* ── 1. HERO SCORE ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="rounded-lg overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.45)', border: `1px solid ${scoreColor}25` }}>
        <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${scoreColor}80, ${scoreColor}20, transparent)` }} />
        <div className="px-4 py-4 flex items-center gap-4">
          <div className="flex flex-col items-center shrink-0">
            <span className="font-mono font-bold leading-none" style={{ color: scoreColor, fontSize: 42 }}>{marketScore}</span>
            <span className="font-mono text-[9px] font-bold tracking-[0.2em] mt-1 px-2 py-0.5 rounded-sm"
              style={{ background: `${scoreColor}15`, color: scoreColor, border: `1px solid ${scoreColor}30` }}>
              {scoreLabel}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-mono text-[8px] font-bold tracking-[0.15em] text-white/25 block mb-1">MARKET SCORE</span>
            <p className="text-[11px] text-white/50 leading-relaxed">{heroSummary}</p>
          </div>
        </div>
      </motion.div>

      {/* ── 2. RADAR 8D (single, centered, max-width 400px) ── */}
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center justify-between w-full mb-1 px-1">
          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-white/25">Radar 8 Dimens\u00f5es</span>
          {!manualLock && <span className="font-mono text-[6px] text-white/15 animate-pulse">AUTO</span>}
        </div>
        <div className="w-full" style={{ maxWidth: 400, margin: '0 auto' }}>
          <MultidimRadial dimensions={dimensions} activeDim={activeDim} onSelect={handleDimSelect}
            marketScore={marketScore} scoreColor={scoreColor} scoreLabel={scoreLabel} />
        </div>
        {/* Dot indicators */}
        <div className="flex justify-center gap-1 mt-2">
          {dimensions.map((dim, i) => (
            <button key={i} onClick={() => handleDimSelect(i)}
              className="rounded-full transition-all duration-300 outline-none"
              style={{ width: activeDim === i ? 14 : 4, height: 4, background: activeDim === i ? dimColor(dim.status) : 'rgba(255,255,255,0.12)' }} />
          ))}
        </div>
      </div>

      {/* ── 3. DIMENSION DETAIL PANEL ── */}
      <AnimatePresence mode="wait">
        <DimDetailPanel key={activeDim} dim={dimensions[activeDim]} scoreColor={scoreColor}
          businessImpact={currentBizImpact} />
      </AnimatePresence>

    </div>
  )
}
