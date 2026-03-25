'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Cores ──────────────────────────────────────────────────────────────────
const RED   = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE  = '#1a5276'

// ── Helpers ────────────────────────────────────────────────────────────────
function v(n: number | undefined, fb: number) { return (n != null && Number.isFinite(n)) ? n : fb }
function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)) }

function offsetColor(val: number) {
  if (val > 0) return GREEN
  if (val < 0) return RED
  return AMBER
}

function scoreColor(s: number) {
  if (s >= 65) return GREEN
  if (s >= 42) return AMBER
  return RED
}

function scenarioGradient(type: 'pessimista' | 'realista' | 'otimista') {
  if (type === 'pessimista') return 'rgba(192,57,43,0.12)'
  if (type === 'otimista') return 'rgba(30,132,73,0.12)'
  return 'rgba(26,82,118,0.12)'
}

function scenarioBorder(type: 'pessimista' | 'realista' | 'otimista') {
  if (type === 'pessimista') return RED
  if (type === 'otimista') return GREEN
  return BLUE
}

// ── Setores padrão ─────────────────────────────────────────────────────────
const DEFAULT_SECTORS = [
  { id: 'tech',    label: 'Tecnologia',    change: 0, trend: 'up',     heat: 72 },
  { id: 'retail',  label: 'Varejo',        change: 0, trend: 'stable', heat: 55 },
  { id: 'agro',    label: 'Agronegócio',   change: 0, trend: 'up',     heat: 68 },
  { id: 'finance', label: 'Financeiro',    change: 0, trend: 'stable', heat: 60 },
  { id: 'health',  label: 'Saúde',         change: 0, trend: 'up',     heat: 64 },
  { id: 'energy',  label: 'Energia',       change: 0, trend: 'stable', heat: 58 },
  { id: 'media',   label: 'Mídia',         change: 0, trend: 'down',   heat: 45 },
  { id: 'realestate', label: 'Imobiliário', change: 0, trend: 'down',  heat: 40 },
  { id: 'education',  label: 'Educação',   change: 0, trend: 'stable', heat: 52 },
]

// ── Slider definitions ────────────────────────────────────────────────────
interface SliderDef {
  key: string
  label: string
  unit: string
  min: number
  max: number
  step: number
}

const SLIDERS: SliderDef[] = [
  { key: 'selic',     label: 'SELIC',                  unit: 'pp',  min: -5,  max: 5,   step: 0.25 },
  { key: 'cambio',    label: 'Câmbio',                 unit: 'R$',  min: -2,  max: 2,   step: 0.1  },
  { key: 'ipca',      label: 'IPCA',                   unit: 'pp',  min: -3,  max: 3,   step: 0.25 },
  { key: 'pib',       label: 'PIB',                    unit: 'pp',  min: -3,  max: 3,   step: 0.25 },
  { key: 'tempo',     label: 'Tempo',                  unit: 'meses', min: 0, max: 24,  step: 1    },
  { key: 'confianca', label: 'Confiança Consumidor',   unit: 'pts', min: -20, max: 20,  step: 1    },
]

type SliderValues = Record<string, number>

// ── Inline slider styles ───────────────────────────────────────────────────
const sliderThumbStyle = `
  input[type="range"].sim-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: currentColor;
    cursor: pointer;
    margin-top: -4px;
    border: 1px solid rgba(255,255,255,0.2);
  }
  input[type="range"].sim-slider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: currentColor;
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.2);
  }
  input[type="range"].sim-slider::-webkit-slider-runnable-track {
    height: 3px;
    background: rgba(255,255,255,0.08);
    border-radius: 2px;
  }
  input[type="range"].sim-slider::-moz-range-track {
    height: 3px;
    background: rgba(255,255,255,0.08);
    border-radius: 2px;
  }
`

// ── Scenario computation ───────────────────────────────────────────────────
interface ScenarioResult {
  type: 'pessimista' | 'realista' | 'otimista'
  label: string
  marketScore: number
  cacImpact: number
  creditAccess: number
  sectorImpacts: { id: string; label: string; before: number; after: number }[]
  timelinePoints: number[]
}

function computeScenario(
  type: 'pessimista' | 'realista' | 'otimista',
  sliders: SliderValues,
  baseSelic: number,
  baseUsd: number,
  baseIpca: number,
  basePib: number,
  baseCac: number,
  sectors: Array<{ id: string; label: string; change: number; trend: string; heat: number }>,
): ScenarioResult {
  const mult = type === 'pessimista' ? -1.5 : type === 'otimista' ? 1.5 : 1
  const sign = type === 'pessimista' ? -1 : type === 'otimista' ? 1 : 0

  // Apply scenario multiplier — pessimista amplifies negatives, otimista amplifies positives
  const selicOff  = sliders.selic  * (type === 'realista' ? 1 : Math.abs(mult)) * (type === 'pessimista' ? 1 : 1)
  const cambioOff = sliders.cambio * (type === 'realista' ? 1 : Math.abs(mult)) * (type === 'pessimista' ? 1 : 1)
  const ipcaOff   = sliders.ipca   * (type === 'realista' ? 1 : Math.abs(mult)) * (type === 'pessimista' ? 1 : 1)
  const pibOff    = sliders.pib    * (type === 'realista' ? 1 : Math.abs(mult)) * (type === 'pessimista' ? 1 : 1)
  const confOff   = sliders.confianca * (type === 'realista' ? 1 : Math.abs(mult)) * (type === 'pessimista' ? 1 : 1)
  const tempo     = sliders.tempo

  // For pessimista: worsen each; for otimista: improve each
  const scenarioBias = sign * 0.08 // small bias per scenario direction

  const effSelic = baseSelic + selicOff + (type !== 'realista' ? sign * -1.5 : 0)
  const effUsd   = baseUsd  + cambioOff + (type !== 'realista' ? sign * -0.3 : 0)
  const effIpca  = baseIpca + ipcaOff + (type !== 'realista' ? sign * -0.5 : 0)
  const effPib   = basePib  + pibOff + (type !== 'realista' ? sign * 0.5 : 0)
  const effConf  = 50 + confOff + (type !== 'realista' ? sign * 5 : 0)

  // Market score calculation
  const pibScore   = clamp(50 + effPib * 8, 0, 100)
  const selicScore = clamp(80 - (effSelic - 5) * 4, 0, 100)
  const ipcaScore  = clamp(80 - Math.max(0, effIpca - 3) * 10, 0, 100)
  const usdScore   = clamp(70 - Math.max(0, effUsd - 5) * 6, 0, 100)
  const confScore  = clamp(effConf, 0, 100)

  const raw = pibScore * 0.25 + selicScore * 0.2 + ipcaScore * 0.2 + usdScore * 0.15 + confScore * 0.2
  const timeFactor = 1 + (tempo / 24) * scenarioBias * 3
  const marketScore = clamp(Math.round(raw * timeFactor), 0, 100)

  // CAC impact (higher selic + ipca = higher CAC = negative)
  const cacDelta = (effSelic - baseSelic) * 2.5 + (effIpca - baseIpca) * 1.8 - effPib * 0.8 - confOff * 0.15
  const cacImpact = clamp(Math.round(baseCac + cacDelta), 5, 200)

  // Credit access (inverse of selic pressure)
  const creditBase = clamp(100 - (effSelic - 5) * 5, 0, 100)
  const creditAccess = clamp(Math.round(creditBase + effPib * 2 + confOff * 0.3), 0, 100)

  // Sector impacts
  const sectorWeights: Record<string, { selicW: number; pibW: number; usdW: number; confW: number }> = {
    tech:       { selicW: -0.8, pibW: 1.2, usdW: -0.6, confW: 0.4 },
    retail:     { selicW: -1.5, pibW: 1.0, usdW: -0.3, confW: 1.2 },
    agro:       { selicW: -0.4, pibW: 0.6, usdW: 0.8,  confW: 0.3 },
    finance:    { selicW: 0.5,  pibW: 0.8, usdW: -0.5, confW: 0.6 },
    health:     { selicW: -0.3, pibW: 0.4, usdW: -0.4, confW: 0.2 },
    energy:     { selicW: -0.5, pibW: 0.7, usdW: 0.5,  confW: 0.3 },
    media:      { selicW: -0.6, pibW: 0.5, usdW: -0.2, confW: 0.8 },
    realestate: { selicW: -2.0, pibW: 1.0, usdW: -0.2, confW: 1.0 },
    education:  { selicW: -0.7, pibW: 0.5, usdW: -0.3, confW: 0.5 },
  }

  const sectorImpacts = sectors.map(sec => {
    const w = sectorWeights[sec.id] ?? { selicW: -0.5, pibW: 0.5, usdW: -0.3, confW: 0.4 }
    const delta = (effSelic - baseSelic) * w.selicW + (effPib - basePib) * w.pibW +
                  (effUsd - baseUsd) * w.usdW + confOff * w.confW * 0.1
    return {
      id: sec.id,
      label: sec.label,
      before: sec.heat,
      after: clamp(Math.round(sec.heat + delta), 0, 100),
    }
  })

  // Timeline projection (market score at each month from 0 to 24)
  const timelinePoints: number[] = []
  for (let m = 0; m <= 24; m++) {
    const tFactor = 1 + (m / 24) * scenarioBias * 3
    const mScore = clamp(Math.round(raw * tFactor), 0, 100)
    timelinePoints.push(mScore)
  }

  return {
    type,
    label: type === 'pessimista' ? 'Pessimista' : type === 'otimista' ? 'Otimista' : 'Realista',
    marketScore,
    cacImpact,
    creditAccess,
    sectorImpacts,
    timelinePoints,
  }
}

// ── Mini SVG Timeline Chart ────────────────────────────────────────────────
function TimelineChart({ points, color, height = 48 }: { points: number[]; color: string; height?: number }) {
  if (points.length < 2) return null
  const w = 200
  const h = height
  const pad = 4
  const minV = Math.min(...points)
  const maxV = Math.max(...points)
  const range = maxV - minV || 1

  const coords = points.map((p, i) => ({
    x: pad + (i / (points.length - 1)) * (w - pad * 2),
    y: pad + (1 - (p - minV) / range) * (h - pad * 2),
  }))

  const pathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ')
  const areaD = pathD + ` L${coords[coords.length - 1].x.toFixed(1)},${h} L${coords[0].x.toFixed(1)},${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`tl-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#tl-${color.replace('#', '')})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Start and end dots */}
      <circle cx={coords[0].x} cy={coords[0].y} r={2} fill={color} />
      <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r={2.5} fill={color} stroke="rgba(255,255,255,0.3)" strokeWidth={0.5} />
      {/* Labels */}
      <text x={coords[0].x} y={coords[0].y - 5} fontSize={6} fill="rgba(255,255,255,0.5)" textAnchor="start" fontFamily="monospace">{points[0]}</text>
      <text x={coords[coords.length - 1].x} y={coords[coords.length - 1].y - 5} fontSize={7} fill={color} textAnchor="end" fontFamily="monospace" fontWeight="bold">{points[points.length - 1]}</text>
    </svg>
  )
}

// ── Heat Bar ───────────────────────────────────────────────────────────────
function HeatBar({ before, after, label }: { before: number; after: number; label: string }) {
  const delta = after - before
  const deltaCol = delta > 0 ? GREEN : delta < 0 ? RED : AMBER

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0' }}>
      <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.5)', width: 68, flexShrink: 0, textAlign: 'right' }}>
        {label}
      </span>
      <div style={{ flex: 1, position: 'relative', height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
        {/* Before bar */}
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '50%',
          width: `${before}%`, background: 'rgba(255,255,255,0.12)', borderRadius: '4px 4px 0 0',
        }} />
        {/* After bar */}
        <motion.div
          initial={{ width: `${before}%` }}
          animate={{ width: `${after}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'absolute', left: 0, top: '50%', height: '50%',
            background: deltaCol, borderRadius: '0 0 4px 4px', opacity: 0.7,
          }}
        />
      </div>
      <span style={{ fontFamily: 'monospace', fontSize: 8, color: deltaCol, width: 36, textAlign: 'right' }}>
        {delta > 0 ? '+' : ''}{delta}
      </span>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ██  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SimulacaoSection({ data }: { data: any }) {
  const [sliders, setSliders] = useState<SliderValues>({
    selic: 0, cambio: 0, ipca: 0, pib: 0, tempo: 6, confianca: 0,
  })

  const updateSlider = useCallback((key: string, val: number) => {
    setSliders(prev => ({ ...prev, [key]: val }))
  }, [])

  const resetAll = useCallback(() => {
    setSliders({ selic: 0, cambio: 0, ipca: 0, pib: 0, tempo: 6, confianca: 0 })
  }, [])

  // Base values from data
  const baseSelic = v(data?.macro?.selic?.value, 10.5)
  const baseUsd   = v(data?.macro?.usdBrl?.value, 5.72)
  const baseIpca  = v(data?.macro?.ipca?.value, 4.8)
  const basePib   = v(data?.macro?.pib?.value, 2.9)
  const baseCac   = v(data?.marketing?.cacTrend?.value, 48.6)

  const sectors = useMemo(() => {
    if (data?.sectors && Array.isArray(data.sectors) && data.sectors.length > 0) {
      return data.sectors.map((s: { id: string; label?: string; change?: number; trend?: string; heat?: number }) => ({
        id: s.id,
        label: s.label ?? s.id,
        change: s.change ?? 0,
        trend: s.trend ?? 'stable',
        heat: s.heat ?? 50,
      }))
    }
    return DEFAULT_SECTORS
  }, [data?.sectors])

  const scenarios = useMemo(() => {
    const types: Array<'pessimista' | 'realista' | 'otimista'> = ['pessimista', 'realista', 'otimista']
    return types.map(t => computeScenario(t, sliders, baseSelic, baseUsd, baseIpca, basePib, baseCac, sectors))
  }, [sliders, baseSelic, baseUsd, baseIpca, basePib, baseCac, sectors])

  const hasChanges = Object.entries(sliders).some(([k, val]) => k === 'tempo' ? val !== 6 : val !== 0)

  return (
    <section style={{ padding: '12px 0' }}>
      <style>{sliderThumbStyle}</style>

      {/* ── Header ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 18, height: 18, borderRadius: 4,
            background: `linear-gradient(135deg, ${BLUE}, ${GREEN})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, color: '#fff',
          }}>
            6D
          </div>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.5px' }}>
            SIMULAÇÃO 6D
          </span>
          <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>
            SCENARIO ENGINE
          </span>
        </div>
        <AnimatePresence>
          {hasChanges && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={resetAll}
              style={{
                background: 'rgba(192,57,43,0.15)',
                border: `1px solid ${RED}44`,
                borderRadius: 4,
                padding: '2px 8px',
                color: RED,
                fontSize: 8,
                fontFamily: 'monospace',
                cursor: 'pointer',
                letterSpacing: '0.5px',
              }}
            >
              RESET
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Sliders Grid ──────────────────────────────────────────── */}
      <div style={{
        background: 'rgba(10,25,47,0.6)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 6,
        padding: '10px 12px',
        marginBottom: 10,
      }}>
        <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', marginBottom: 8, letterSpacing: '1px' }}>
          AJUSTE OS PARÂMETROS MACROECONÔMICOS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 16px' }}>
          {SLIDERS.map(sl => {
            const val = sliders[sl.key]
            const col = sl.key === 'tempo' ? BLUE : offsetColor(val)
            return (
              <div key={sl.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
                    {sl.label}
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: 9, color: col, fontWeight: 700 }}>
                    {sl.key === 'tempo'
                      ? `${val} ${sl.unit}`
                      : `${val > 0 ? '+' : ''}${val.toFixed(sl.step < 1 ? (sl.step < 0.25 ? 2 : 2) : 0)} ${sl.unit}`
                    }
                  </span>
                </div>
                <input
                  type="range"
                  className="sim-slider"
                  min={sl.min}
                  max={sl.max}
                  step={sl.step}
                  value={val}
                  onChange={e => updateSlider(sl.key, parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    height: 12,
                    WebkitAppearance: 'none',
                    appearance: 'none' as never,
                    background: 'transparent',
                    cursor: 'pointer',
                    color: col,
                    outline: 'none',
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* Current base values reference */}
        <div style={{
          display: 'flex', gap: 12, marginTop: 8, paddingTop: 6,
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          {[
            { label: 'SELIC', value: `${baseSelic.toFixed(1)}%` },
            { label: 'USD/BRL', value: `R$${baseUsd.toFixed(2)}` },
            { label: 'IPCA', value: `${baseIpca.toFixed(2)}%` },
            { label: 'PIB', value: `${basePib.toFixed(1)}%` },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>
                {item.label}
              </span>
              <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', fontWeight: 600 }}>
                {item.value}
              </span>
            </div>
          ))}
          <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', marginLeft: 'auto' }}>
            BASE ATUAL
          </span>
        </div>
      </div>

      {/* ── 3 Scenario Cards ─────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8,
        marginBottom: 10,
      }}>
        {scenarios.map(sc => (
          <motion.div
            key={sc.type}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: scenarioGradient(sc.type),
              border: `1px solid ${scenarioBorder(sc.type)}22`,
              borderRadius: 6,
              padding: '8px 10px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Scenario label */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{
                fontFamily: 'Poppins, sans-serif', fontSize: 9, fontWeight: 600,
                color: scenarioBorder(sc.type), letterSpacing: '0.5px', textTransform: 'uppercase',
              }}>
                {sc.label}
              </span>
              <span style={{
                fontSize: 7, fontFamily: 'monospace',
                color: scenarioBorder(sc.type), opacity: 0.6,
              }}>
                {sc.type === 'pessimista' ? '×1.5 NEG' : sc.type === 'otimista' ? '×1.5 POS' : '×1.0'}
              </span>
            </div>

            {/* Market Score */}
            <div style={{ textAlign: 'center', marginBottom: 6 }}>
              <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', marginBottom: 2 }}>
                MARKET SCORE
              </div>
              <motion.div
                key={sc.marketScore}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  fontFamily: 'monospace', fontSize: 22, fontWeight: 800,
                  color: scoreColor(sc.marketScore),
                  lineHeight: 1,
                }}
              >
                {sc.marketScore}
              </motion.div>
              <div style={{
                width: '80%', height: 3, borderRadius: 2, margin: '4px auto 0',
                background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
              }}>
                <motion.div
                  animate={{ width: `${sc.marketScore}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{ height: '100%', borderRadius: 2, background: scoreColor(sc.marketScore) }}
                />
              </div>
            </div>

            {/* Metrics row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 6 }}>
              <div style={{
                background: 'rgba(0,0,0,0.2)', borderRadius: 4, padding: '4px 6px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>CAC</div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: sc.cacImpact > baseCac ? RED : GREEN }}>
                  R${sc.cacImpact}
                </div>
                <div style={{ fontSize: 7, fontFamily: 'monospace', color: sc.cacImpact > baseCac ? RED : GREEN, opacity: 0.7 }}>
                  {sc.cacImpact > baseCac ? '+' : ''}{Math.round(sc.cacImpact - baseCac)}
                </div>
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.2)', borderRadius: 4, padding: '4px 6px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>CRÉDITO</div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: scoreColor(sc.creditAccess) }}>
                  {sc.creditAccess}%
                </div>
                <div style={{ fontSize: 7, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>
                  acesso
                </div>
              </div>
            </div>

            {/* Timeline chart */}
            <div style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace', marginBottom: 2 }}>
                PROJEÇÃO 0-24M
              </div>
              <TimelineChart points={sc.timelinePoints} color={scenarioBorder(sc.type)} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                <span style={{ fontSize: 6, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>0m</span>
                <span style={{ fontSize: 6, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>12m</span>
                <span style={{ fontSize: 6, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>24m</span>
              </div>
            </div>

            {/* Top sector impacts (top 3) */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 4 }}>
              <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace', marginBottom: 2 }}>
                SETORES MAIS IMPACTADOS
              </div>
              {sc.sectorImpacts
                .sort((a, b) => Math.abs(b.after - b.before) - Math.abs(a.after - a.before))
                .slice(0, 3)
                .map(si => {
                  const d = si.after - si.before
                  return (
                    <div key={si.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1px 0' }}>
                      <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.45)', fontFamily: 'Poppins, sans-serif' }}>
                        {si.label}
                      </span>
                      <span style={{ fontSize: 8, fontFamily: 'monospace', fontWeight: 600, color: d > 0 ? GREEN : d < 0 ? RED : AMBER }}>
                        {d > 0 ? '+' : ''}{d}
                      </span>
                    </div>
                  )
                })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Responsive override for mobile ────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          .sim-scenarios-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* ── Impacto nos Setores (full table) ──────────────────────── */}
      <div style={{
        background: 'rgba(10,25,47,0.5)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 6,
        padding: '8px 10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.3px' }}>
              Impacto nos Setores
            </span>
            <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>
              CENÁRIO REALISTA
            </span>
          </div>
          <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
            ANTES → DEPOIS
          </span>
        </div>

        {scenarios[1].sectorImpacts.map(si => (
          <HeatBar key={si.id} label={si.label} before={si.before} after={si.after} />
        ))}

        {/* Legend */}
        <div style={{
          display: 'flex', gap: 12, marginTop: 6, paddingTop: 4,
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          {[
            { color: 'rgba(255,255,255,0.12)', label: 'Heat atual' },
            { color: GREEN, label: 'Melhora' },
            { color: RED, label: 'Piora' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <div style={{ width: 8, height: 4, borderRadius: 2, background: item.color, opacity: 0.7 }} />
              <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
