'use client'

import { motion } from 'framer-motion'

/* ── Constants ────────────────────────────────────────── */

const RED = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE = '#1a5276'

function v(n: number | undefined, fb: number) {
  return n != null && Number.isFinite(n) ? n : fb
}

function trendColor(trend: string) {
  if (trend === 'up') return GREEN
  if (trend === 'down') return RED
  return AMBER
}

/* ── 1. SectorTreemap ─────────────────────────────────── */

interface SectorItem {
  id: string
  label: string
  change: number
  trend: string
  heat: number
}

export function SectorTreemap({ sectors }: { sectors: SectorItem[] }) {
  const sorted = [...sectors].sort((a, b) => v(b.heat, 0) - v(a.heat, 0))
  const totalHeat = sorted.reduce((s, d) => s + v(d.heat, 0), 0) || 1

  const W = 600
  const H = 200

  // Simple squarified layout: fill rows top-to-bottom
  const rects: Array<{ x: number; y: number; w: number; h: number; item: SectorItem }> = []
  let remaining = [...sorted]
  let yOffset = 0

  while (remaining.length > 0 && yOffset < H) {
    // Determine how many items fit in this row
    let rowItems: SectorItem[] = []
    let rowHeat = 0
    const totalRemaining = remaining.reduce((s, d) => s + v(d.heat, 0), 0) || 1
    const rowHeight = Math.max(
      30,
      Math.min(H - yOffset, (v(remaining[0].heat, 0) / totalRemaining) * (H - yOffset) * remaining.length * 0.5)
    )

    // Fill row: keep adding items while aspect ratio improves
    let bestAspect = Infinity
    for (let i = 0; i < remaining.length; i++) {
      const candidate = [...rowItems, remaining[i]]
      const candidateHeat = rowHeat + v(remaining[i].heat, 0)
      const candidateRowH = (candidateHeat / totalRemaining) * (H - yOffset)
      const worstAspect = candidate.reduce((worst, item) => {
        const itemW = (v(item.heat, 0) / candidateHeat) * W
        const ratio = candidateRowH > 0 ? Math.max(itemW / candidateRowH, candidateRowH / itemW) : Infinity
        return Math.max(worst, ratio)
      }, 0)

      if (worstAspect <= bestAspect || rowItems.length === 0) {
        bestAspect = worstAspect
        rowItems = candidate
        rowHeat = candidateHeat
      } else {
        break
      }
    }

    if (rowItems.length === 0) break

    const actualRowH = Math.max(30, (rowHeat / totalRemaining) * (H - yOffset))
    let xOffset = 0

    for (const item of rowItems) {
      const itemW = rowHeat > 0 ? (v(item.heat, 0) / rowHeat) * W : W / rowItems.length
      rects.push({ x: xOffset, y: yOffset, w: itemW, h: actualRowH, item })
      xOffset += itemW
    }

    yOffset += actualRowH
    remaining = remaining.slice(rowItems.length)
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={200}
      style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', borderRadius: 6 }}
    >
      {rects.map((r, i) => {
        const fill = trendColor(r.item.trend)
        return (
          <motion.g
            key={r.item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            <rect
              x={r.x + 1}
              y={r.y + 1}
              width={Math.max(0, r.w - 2)}
              height={Math.max(0, r.h - 2)}
              fill={fill}
              fillOpacity={0.7}
              rx={3}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={0.5}
            />
            {r.w > 30 && r.h > 18 && (
              <>
                <text
                  x={r.x + r.w / 2}
                  y={r.y + r.h / 2 - 4}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.9)"
                  fontSize={8}
                  fontFamily="monospace"
                >
                  {r.item.label}
                </text>
                <text
                  x={r.x + r.w / 2}
                  y={r.y + r.h / 2 + 8}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.7)"
                  fontSize={7}
                  fontFamily="monospace"
                >
                  {v(r.item.change, 0) > 0 ? '+' : ''}
                  {v(r.item.change, 0).toFixed(1)}%
                </text>
              </>
            )}
          </motion.g>
        )
      })}
    </svg>
  )
}

/* ── 2. CorrelationHeatmap ────────────────────────────── */

const CORR_LABELS = ['Selic', 'Câmbio', 'IPCA', 'PIB', 'CAC']

const BASE_CORRELATIONS: Record<string, number> = {
  '0-1': 0.6,
  '0-2': 0.8,
  '0-3': -0.7,
  '0-4': 0.5,
  '1-2': 0.6,
  '1-3': -0.4,
  '1-4': 0.3,
  '2-3': -0.3,
  '2-4': 0.4,
  '3-4': -0.5,
}

function getCorrelation(row: number, col: number, data: any): number {
  if (row === col) return 1.0
  const key = row < col ? `${row}-${col}` : `${col}-${row}`
  let base = BASE_CORRELATIONS[key] ?? 0

  // Adjust based on actual data values
  if (data) {
    const selic = v(data.selic, 13)
    const cambio = v(data.cambio ?? data.dolar, 5)
    const ipca = v(data.ipca, 5)

    // High selic intensifies selic-pib negative correlation
    if (key === '0-3' && selic > 13) {
      base = Math.max(-1, base - 0.05 * ((selic - 13) / 2))
    }
    // High selic also strengthens selic-ipca link
    if (key === '0-2' && selic > 13) {
      base = Math.min(1, base + 0.03 * ((selic - 13) / 2))
    }
    // Weak currency strengthens imported inflation link
    if (key === '1-2' && cambio > 5.5) {
      base = Math.min(1, base + 0.05 * ((cambio - 5.5) / 1))
    }
    // High ipca strengthens ipca-cac
    if (key === '2-4' && ipca > 6) {
      base = Math.min(1, base + 0.04 * ((ipca - 6) / 2))
    }
  }

  return Math.max(-1, Math.min(1, base))
}

function corrColor(val: number): string {
  const t = (val + 1) / 2 // 0..1  where 0 = -1 (blue), 1 = +1 (red)
  if (t > 0.5) {
    const f = (t - 0.5) * 2 // 0..1
    const r = Math.round(180 + 75 * f)
    const g = Math.round(220 * (1 - f))
    const b = Math.round(220 * (1 - f))
    return `rgb(${r},${g},${b})`
  } else {
    const f = t * 2 // 0..1  where 0 = deepest blue
    const r = Math.round(220 * f)
    const g = Math.round(220 * f)
    const b = Math.round(180 + 75 * (1 - f))
    return `rgb(${r},${g},${b})`
  }
}

export function CorrelationHeatmap({ data }: { data: any }) {
  const PAD = 50
  const CELL = 50
  const SIZE = PAD + CELL * 5

  return (
    <svg
      viewBox={`0 0 ${SIZE + 10} ${SIZE + 10}`}
      width="100%"
      style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', borderRadius: 6, maxWidth: 400 }}
    >
      {/* Column labels */}
      {CORR_LABELS.map((label, c) => (
        <text
          key={`col-${c}`}
          x={PAD + c * CELL + CELL / 2}
          y={PAD - 8}
          textAnchor="middle"
          fill="rgba(255,255,255,0.7)"
          fontSize={8}
          fontFamily="monospace"
        >
          {label}
        </text>
      ))}

      {/* Row labels */}
      {CORR_LABELS.map((label, r) => (
        <text
          key={`row-${r}`}
          x={PAD - 6}
          y={PAD + r * CELL + CELL / 2 + 3}
          textAnchor="end"
          fill="rgba(255,255,255,0.7)"
          fontSize={8}
          fontFamily="monospace"
        >
          {label}
        </text>
      ))}

      {/* Cells */}
      {CORR_LABELS.map((_, r) =>
        CORR_LABELS.map((__, c) => {
          const corr = getCorrelation(r, c, data)
          const color = corrColor(corr)
          const idx = r * 5 + c
          return (
            <motion.g
              key={`${r}-${c}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.02, duration: 0.3 }}
            >
              <rect
                x={PAD + c * CELL + 1}
                y={PAD + r * CELL + 1}
                width={CELL - 2}
                height={CELL - 2}
                fill={color}
                fillOpacity={0.85}
                rx={3}
              />
              <text
                x={PAD + c * CELL + CELL / 2}
                y={PAD + r * CELL + CELL / 2 + 3}
                textAnchor="middle"
                fill={Math.abs(corr) > 0.5 ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.8)'}
                fontSize={9}
                fontWeight="bold"
                fontFamily="monospace"
              >
                {corr > 0 ? '+' : ''}
                {corr.toFixed(2)}
              </text>
            </motion.g>
          )
        })
      )}
    </svg>
  )
}

/* ── 3. SectorBubbleChart ─────────────────────────────── */

interface AgentItem {
  id: string
  label: string
  delta: number
}

export function SectorBubbleChart({
  sectors,
  agents,
}: {
  sectors: SectorItem[]
  agents: AgentItem[]
}) {
  const VW = 500
  const VH = 320
  const PAD = { top: 20, right: 30, bottom: 35, left: 45 }
  const plotW = VW - PAD.left - PAD.right
  const plotH = VH - PAD.top - PAD.bottom

  // Compute axis ranges
  const allChanges = [
    ...sectors.map((s) => v(s.change, 0)),
    ...agents.map((a) => v(a.delta, 0)),
  ]
  const minX = Math.min(-10, ...allChanges) - 2
  const maxX = Math.max(10, ...allChanges) + 2
  const minY = 0
  const maxY = 100

  const scaleX = (val: number) => PAD.left + ((val - minX) / (maxX - minX)) * plotW
  const scaleY = (val: number) => PAD.top + plotH - ((val - minY) / (maxY - minY)) * plotH

  // Gridlines
  const xTicks: number[] = []
  const xStep = Math.ceil((maxX - minX) / 8)
  for (let t = Math.ceil(minX); t <= maxX; t += xStep) xTicks.push(t)

  const yTicks = [0, 20, 40, 60, 80, 100]

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      width="100%"
      style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', borderRadius: 6 }}
    >
      {/* Gridlines */}
      {xTicks.map((t) => (
        <line
          key={`gx-${t}`}
          x1={scaleX(t)}
          x2={scaleX(t)}
          y1={PAD.top}
          y2={PAD.top + plotH}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={0.5}
        />
      ))}
      {yTicks.map((t) => (
        <line
          key={`gy-${t}`}
          x1={PAD.left}
          x2={PAD.left + plotW}
          y1={scaleY(t)}
          y2={scaleY(t)}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={0.5}
        />
      ))}

      {/* Axes */}
      <line
        x1={PAD.left}
        x2={PAD.left + plotW}
        y1={PAD.top + plotH}
        y2={PAD.top + plotH}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1}
      />
      <line
        x1={PAD.left}
        x2={PAD.left}
        y1={PAD.top}
        y2={PAD.top + plotH}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1}
      />

      {/* X axis ticks & labels */}
      {xTicks.map((t) => (
        <text
          key={`xl-${t}`}
          x={scaleX(t)}
          y={PAD.top + plotH + 14}
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize={7}
          fontFamily="monospace"
        >
          {t}%
        </text>
      ))}

      {/* Y axis ticks & labels */}
      {yTicks.map((t) => (
        <text
          key={`yl-${t}`}
          x={PAD.left - 6}
          y={scaleY(t) + 3}
          textAnchor="end"
          fill="rgba(255,255,255,0.5)"
          fontSize={7}
          fontFamily="monospace"
        >
          {t}
        </text>
      ))}

      {/* Axis labels */}
      <text
        x={PAD.left + plotW / 2}
        y={VH - 4}
        textAnchor="middle"
        fill="rgba(255,255,255,0.4)"
        fontSize={8}
        fontFamily="monospace"
      >
        Variação (%)
      </text>
      <text
        x={12}
        y={PAD.top + plotH / 2}
        textAnchor="middle"
        fill="rgba(255,255,255,0.4)"
        fontSize={8}
        fontFamily="monospace"
        transform={`rotate(-90, 12, ${PAD.top + plotH / 2})`}
      >
        Heat
      </text>

      {/* Sector bubbles */}
      {sectors.map((s, i) => {
        const cx = scaleX(v(s.change, 0))
        const cy = scaleY(v(s.heat, 50))
        const r = Math.max(6, Math.min(28, v(s.heat, 50) * 0.28))
        const fill = trendColor(s.trend)

        return (
          <motion.g
            key={s.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, duration: 0.5, type: 'spring' }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          >
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill={fill}
              fillOpacity={0.6}
              stroke={fill}
              strokeOpacity={0.9}
              strokeWidth={1}
            />
            <text
              x={cx}
              y={cy - r - 4}
              textAnchor="middle"
              fill="rgba(255,255,255,0.75)"
              fontSize={7}
              fontFamily="monospace"
            >
              {s.label}
            </text>
          </motion.g>
        )
      })}

      {/* Agent diamonds */}
      {agents.map((a, i) => {
        const cx = scaleX(v(a.delta, 0))
        const cy = scaleY(50 + i * 4 - (agents.length * 2))
        const size = 5
        const points = `${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}`

        return (
          <motion.g
            key={a.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
          >
            <polygon
              points={points}
              fill={BLUE}
              fillOpacity={0.7}
              stroke={BLUE}
              strokeOpacity={0.9}
              strokeWidth={0.8}
            />
            <text
              x={cx + size + 3}
              y={cy + 3}
              fill="rgba(255,255,255,0.55)"
              fontSize={6}
              fontFamily="monospace"
            >
              {a.label}
            </text>
          </motion.g>
        )
      })}
    </svg>
  )
}
