'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWorkspaceData } from '@/hooks/useWorkspaceData'
import { Brain, CheckCircle2, Circle, Loader2, ChevronDown, AlertTriangle } from 'lucide-react'

// ─── Palette ──────────────────────────────────────────────────────────────────
const TEAL  = '#17a589'
const RED   = '#e74c3c'
const AMBER = '#e67e22'

const DIM_COLORS = ['#5dade2', '#27ae60', '#8e44ad', '#e67e22', '#17a589', '#e74c3c']

const DIMS = [
  { id: 0, code: 'D1', label: 'Direção',    short: 'Metas e KPIs' },
  { id: 1, code: 'D2', label: 'Diálogo',    short: '1:1 e acordos' },
  { id: 2, code: 'D3', label: 'Desenvolv.', short: 'Skills e plano' },
  { id: 3, code: 'D4', label: 'Disciplina', short: 'Rituais ativos' },
  { id: 4, code: 'D5', label: 'Desempenho', short: 'Resultado' },
  { id: 5, code: 'D6', label: 'Dignidade',  short: '× multiplica tudo' },
]

const MANIFESTO = [
  {
    num: '01', color: '#5dade2',
    title: 'O Trabalho com Significado',
    body: 'Aqui, não apenas "cumprimos tarefas". Nós prestamos um serviço à sociedade, aos nossos clientes e aos nossos colegas. O trabalho só é bom quando sabemos a quem ele serve e qual problema ele resolve. Se você não vê utilidade no que faz, nossa missão é encontrar esse sentido juntos.',
    ritual: 'Antes de cada reunião: "A quem isso serve?"',
  },
  {
    num: '02', color: '#27ae60',
    title: 'Além do Financeiro',
    body: 'O salário paga as contas, mas o propósito é o que nos levanta da cama. Não aceitamos que a relação com o trabalho seja um fardo. Queremos que cada liderado entenda: "Para que eu vim ao mundo?" e como seus talentos se conectam com a sua função aqui.',
    ritual: 'Integração: converse sobre propósito antes de falar sobre metas.',
  },
  {
    num: '03', color: '#8e44ad',
    title: 'Liderança como Facilitação',
    body: 'O líder não é um fiscal de prazos, é um removedor de obstáculos. Nossa liderança é baseada na Inteligência Emocional: Empatia para entender os desejos de quem lideramos. Autocontrole para manter o ambiente saudável. Habilidade Social para construir confiança plena.',
    ritual: 'No 1:1: "O que está te travando? Como posso ajudar?"',
  },
  {
    num: '04', color: '#e67e22',
    title: 'O Valor da Entrega',
    body: 'Não buscamos apenas o resultado numérico; buscamos o impacto. Um resultado sem valor humano é vazio. Reconhecemos a excelência, a proatividade e, acima de tudo, o desejo de ser útil.',
    ritual: 'Celebre publicamente quem entregou além do esperado.',
  },
  {
    num: '05', color: '#e74c3c',
    title: 'Compromisso Mútuo',
    body: 'Se o trabalho está sendo apenas um peso, algo está errado. Líder e liderado têm o compromisso de dialogar abertamente para ajustar o curso. O trabalho deve ser uma via de crescimento pessoal e profissional.',
    ritual: 'Retrospectiva mensal: o que melhorar juntos?',
  },
]

// ─── Manifesto → 6D mapping ───────────────────────────────────────────────────
// Each dimension is fed by specific manifesto principles
const DIM_MANIF_MAP: number[][] = [
  [0],          // D1 Direção    ← P01 Trabalho com Significado
  [2, 4],       // D2 Diálogo    ← P03 Facilitação + P05 Compromisso Mútuo
  [1, 2],       // D3 Desenvolv. ← P02 Além do Financeiro + P03 Facilitação
  [3, 4],       // D4 Disciplina ← P04 Valor da Entrega + P05 Compromisso Mútuo
  [0, 1, 3],    // D5 Desempenho ← P01 + P02 + P04
  [0, 1, 2, 3, 4], // D6 Dignidade  ← todos os princípios
]

const DIM_MANIF_DESC = [
  'Clareza de propósito só existe quando P01 é praticado — o time sabe a quem o trabalho serve.',
  'Diálogo genuíno nasce de P03 (remover obstáculos) e P05 (compromisso honesto).',
  'Desenvolvimento acontece quando P02 (propósito além do financeiro) e P03 (facilitação) são vividos.',
  'Disciplina de liderança vem de P04 (celebrar entrega) e P05 (retrospectiva mútua).',
  'Resultado sustentável exige P01 (significado), P02 (engajamento) e P04 (valor da entrega).',
  'Dignidade é o multiplicador: quanto mais princípios ativos, maior o fator cultural.',
]

// ─── State ───────────────────────────────────────────────────────────────────
interface PesState {
  pesDig: boolean[]
}

const DEFAULT: PesState = {
  pesDig: [false, false, false, false, false],
}

// ─── Manifesto-driven score engine ───────────────────────────────────────────
// Scores are derived entirely from which manifesto principles are practiced
function calcRawDims(pesDig: boolean[]): number[] {
  return DIM_MANIF_MAP.map(ps => {
    const count = ps.filter(p => (pesDig ?? [])[p]).length
    return Math.round((count / ps.length) * 20)
  })
}

function calcIndex6D(dims: number[]): number {
  const [d1, d2, d3, d4, d5, d6] = dims
  const base = d1 + d2 + d3 + d4 + d5
  const mult = 0.5 + (d6 / 20) * 1.0
  return Math.min(100, Math.round(base * mult))
}

// ─── Canvas particle field ────────────────────────────────────────────────────
function ParticleField({ score }: { score: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width, H = canvas.height
    const color = score >= 70 ? '#5dade2' : score >= 45 ? '#e67e22' : '#e74c3c'
    const count = Math.max(8, Math.round(score / 4))
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.8,
    }))
    let raf: number
    function draw() {
      ctx.clearRect(0, 0, W, H)
      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 60) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = color + Math.round((1 - dist / 60) * 40).toString(16).padStart(2, '0')
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = color + '90'; ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [score])
  return <canvas ref={ref} width={300} height={56} className="w-full rounded-lg opacity-60" />
}

// ─── Arc gauge SVG ────────────────────────────────────────────────────────────
function ArcGauge({ pct, color, size = 52 }: { pct: number; color: string; size?: number }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const dash = circ * (pct / 100)
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3.5" />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth="3.5" strokeLinecap="round"
        strokeDasharray={`${circ}`} strokeDashoffset={circ - dash}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        style={{ filter: `drop-shadow(0 0 4px ${color}90)` }} />
    </svg>
  )
}

// ─── Central Energy Orb ───────────────────────────────────────────────────────
function EnergyOrb({ score, d6mult }: { score: number; d6mult: number }) {
  const color = score >= 70 ? TEAL : score >= 45 ? AMBER : RED
  return (
    <div className="relative flex items-center justify-center mx-auto" style={{ width: 190, height: 190 }}>
      {/* Outer orbit — slow rotation */}
      <motion.div className="absolute rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{ width: 182, height: 182, border: '1px dashed rgba(59,130,246,0.18)', borderRadius: '50%' }} />

      {/* Middle orbit — counter-rotation */}
      <motion.div className="absolute rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        style={{ width: 152, height: 152, border: `1px dashed ${color}28`, borderRadius: '50%' }} />

      {/* Pulse ring */}
      <motion.div className="absolute rounded-full"
        animate={{ scale: [1, 1.06, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: 124, height: 124, border: `1.5px solid ${color}50`, borderRadius: '50%', boxShadow: `0 0 24px ${color}22` }} />

      {/* Core */}
      <div className="relative flex flex-col items-center justify-center z-10"
        style={{ width: 108, height: 108, borderRadius: '50%', background: 'rgba(2,6,18,0.96)', border: `1.5px solid ${color}35`, boxShadow: `0 0 32px ${color}22, inset 0 0 20px ${color}0a` }}>
        <motion.span key={score}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 250 }}
          className="text-[40px] font-black font-mono leading-none"
          style={{ color, textShadow: `0 0 18px ${color}80` }}>
          {score}
        </motion.span>
        <span className="text-[7px] font-mono tracking-[0.2em] text-white/20 mt-0.5">ÍNDICE 6D</span>
        <span className="text-[9px] font-mono font-bold mt-0.5" style={{ color: d6mult >= 1 ? TEAL : d6mult >= 0.8 ? AMBER : RED }}>
          ×{d6mult.toFixed(2)}
        </span>
      </div>
    </div>
  )
}

// ─── Snapshot type ────────────────────────────────────────────────────────────
interface Snap { date: string; index6D: number; dims: number[] }
interface SnapStore { snaps: Snap[] }

// ─── Hex Radar ────────────────────────────────────────────────────────────────
function HexRadar({ pcts, colors }: { pcts: number[]; colors: string[] }) {
  const cx = 116, cy = 116, r = 88
  const angles = Array.from({ length: 6 }, (_, i) => (i * Math.PI * 2) / 6 - Math.PI / 2)
  const labels = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6']
  const grid = (s: number) => angles.map(a => `${cx + Math.cos(a) * r * s},${cy + Math.sin(a) * r * s}`).join(' ')
  const dataStr = pcts.map((p, i) => {
    const d = (p / 100) * r
    return `${cx + Math.cos(angles[i]) * d},${cy + Math.sin(angles[i]) * d}`
  }).join(' ')
  return (
    <svg width={232} height={232} className="mx-auto">
      {[0.2, 0.4, 0.6, 0.8, 1].map(s => (
        <polygon key={s} points={grid(s)} fill="none"
          stroke={s === 1 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}
          strokeWidth={s === 1 ? 0.8 : 0.4} />
      ))}
      {angles.map((a, i) => (
        <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r}
          stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      ))}
      <motion.polygon points={dataStr}
        fill={`${TEAL}14`} stroke={TEAL} strokeWidth="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}
        style={{ filter: `drop-shadow(0 0 8px ${TEAL}30)` }} />
      {pcts.map((p, i) => {
        const d = (p / 100) * r
        return <motion.circle key={i} cx={cx + Math.cos(angles[i]) * d} cy={cy + Math.sin(angles[i]) * d}
          r={3.5} fill={colors[i]} initial={{ r: 0 }} animate={{ r: 3.5 }} transition={{ delay: i * 0.06 }}
          style={{ filter: `drop-shadow(0 0 4px ${colors[i]})` }} />
      })}
      {angles.map((a, i) => (
        <text key={i} x={cx + Math.cos(a) * (r + 16)} y={cy + Math.sin(a) * (r + 16)}
          textAnchor="middle" dominantBaseline="middle"
          fill={colors[i]} fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.65">
          {labels[i]}
        </text>
      ))}
    </svg>
  )
}

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ data, color, sw = 80, sh = 28 }: { data: number[]; color: string; sw?: number; sh?: number }) {
  if (data.length < 2) return <div style={{ width: sw, height: sh }} />
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (sw - 4) + 2
    const y = sh - 2 - ((v - min) / range) * (sh - 8)
    return `${x},${y}`
  })
  const last = pts[pts.length - 1].split(',')
  return (
    <svg width={sw} height={sh}>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={2.5} fill={color} />
    </svg>
  )
}

// ─── IA questions — manifesto-driven ─────────────────────────────────────────────
function getDimIaQ(id: number, pesDig: boolean[]): string[] {
  const practicedPs = DIM_MANIF_MAP[id].filter(p => (pesDig ?? [])[p])
  const missingPs   = DIM_MANIF_MAP[id].filter(p => !(pesDig ?? [])[p])
  const dim = DIMS[id]
  const pct = Math.round((practicedPs.length / DIM_MANIF_MAP[id].length) * 100)
  if (missingPs.length === 0) return [
    dim.label + ' está plena — todos os princípios que a alimentam estão ativos. Como aprofundar esse nível?',
    'Como usar este momento forte em ' + dim.label + ' para ampliar o impacto no time?',
  ]
  const missing = MANIFESTO[missingPs[0]].title
  return [
    dim.label + ' em ' + pct + '% — o princípio "' + missing + '" não está ativo. O que está impedindo sua prática?',
    'Como colocar "' + missing + '" em ação ainda esta semana para fortalecer ' + dim.label + '?',
  ]
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PessoasLideranca() {
  const { data: s, update } = useWorkspaceData<PesState>('pessoas-lideranca', DEFAULT)
  const { data: snapStore, update: updateSnapStore } = useWorkspaceData<SnapStore>('pessoas-snaps', { snaps: [] })
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [dimIaLoading, setDimIaLoading] = useState<number | null>(null)
  const [dimIaAnswers, setDimIaAnswers] = useState<Record<number, string>>({})
  const [manifIaLoading, setManifIaLoading] = useState<number | null>(null)
  const [manifIaAnswers, setManifIaAnswers] = useState<Record<number, string>>({})
  const [showClear, setShowClear] = useState(false)
  const [presentMode, setPresentMode] = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)

  // Cross-module context
  const { data: cockpit } = useWorkspaceData<typeof COCKPIT_ZERO>('cockpit', COCKPIT_ZERO)
  const { data: admin } = useWorkspaceData<typeof ADMIN_ZERO>('admin-cockpit', ADMIN_ZERO)

  // Business derived signals
  const runway   = cockpit.despesas > 0 ? Math.round(cockpit.caixa / cockpit.despesas) : 99
  const margem   = cockpit.receita > 0 ? Math.round(((cockpit.receita - cockpit.despesas) / cockpit.receita) * 100) : 0
  const hasFinanceiro = cockpit.receita > 0
  const okrs     = (admin.okrs ?? []).filter(o => o.objetivo.trim())
  const okrAvgPct = okrs.length > 0
    ? Math.round(okrs.reduce((acc, o) => acc + (o.krs.reduce((a, k) => a + (k.pct ?? 0), 0) / Math.max(1, o.krs.length)), 0) / okrs.length)
    : 0
  const faseLabel = FASE_LABELS[admin.faseEmpresa] ?? 'Fase ?'

  const rawDims = calcRawDims(s.pesDig)
  const practicedCount = (s.pesDig ?? []).filter(Boolean).length
  const index6D = calcIndex6D(rawDims)
  const d6mult = 0.5 + (rawDims[5] / 20) * 1.0
  const pcts = rawDims.map(d => Math.round((d / 20) * 100))
  const overallColor = index6D >= 70 ? TEAL : index6D >= 45 ? AMBER : RED
  const lowestId = pcts.indexOf(Math.min(...pcts))
  const d6Low = rawDims[5] < 8

  // Snap derived
  const snaps = snapStore.snaps ?? []
  const lastSnap = snaps.length > 0 ? snaps[snaps.length - 1] : null

  // Auto-snapshot: save when index changes ≥5 pts (debounced 2s)
  const snapsRef = useRef(snaps)
  const rawDimsRef = useRef(rawDims)
  snapsRef.current = snaps
  rawDimsRef.current = rawDims
  useEffect(() => {
    if (index6D === 0) return
    const t = setTimeout(() => {
      const cur = snapsRef.current
      const last = cur.length > 0 ? cur[cur.length - 1].index6D : -99
      if (Math.abs(index6D - last) < 5) return
      updateSnapStore({ snaps: [...cur.slice(-11), { date: new Date().toISOString(), index6D, dims: [...rawDimsRef.current] }] })
    }, 2000)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index6D])

  // Risk signals — manifesto + cross-module
  const riskSignals: { level: 'critical' | 'warn' | 'ok'; msg: string }[] = []
  if (practicedCount === 0)
    riskSignals.push({ level: 'critical', msg: 'Nenhum princípio do Manifesto praticado — Índice 6D no nível mínimo. Escolha um princípio e comece.' })
  if (d6Low && practicedCount > 0)
    riskSignals.push({ level: 'warn', msg: `Dignidade (D6) em ${pcts[5]}% — multiplicador ×${d6mult.toFixed(2)} reduzindo todos os outros scores. Pratique mais princípios.` })
  if (hasFinanceiro && runway < 6 && d6Low)
    riskSignals.push({ level: 'warn', msg: `Caixa curto (${runway}m) + cultura fraca = risco alto de churn de talentos.` })
  if (okrs.length > 0 && okrAvgPct < 20 && pcts[0] < 40)
    riskSignals.push({ level: 'warn', msg: `OKRs em ${okrAvgPct}% + D1 (Direção) em ${pcts[0]}% — o princípio "Trabalho com Significado" não está ativo.` })
  if (margem > 0 && margem < 15 && pcts[4] < 60)
    riskSignals.push({ level: 'warn', msg: `Margem apertada (${margem}%) + D5 (Desempenho) em ${pcts[4]}% — pratique P01, P02 e P04 para elevar resultado.` })

  async function askDimIa(dimId: number, q: string) {
    setDimIaLoading(dimId)
    try {
      const dim = DIMS[dimId]
      const practicedPs = DIM_MANIF_MAP[dimId].filter(p => (s.pesDig ?? [])[p]).map(p => MANIFESTO[p].title)
      const missingPs   = DIM_MANIF_MAP[dimId].filter(p => !(s.pesDig ?? [])[p]).map(p => MANIFESTO[p].title)
      const ctx = [
        `${dim.code} (${dim.label}) score: ${pcts[dimId]}/100 | Índice 6D: ${index6D}/100`,
        `Princípios que alimentam esta dimensão: ${DIM_MANIF_MAP[dimId].map(p => MANIFESTO[p].num + ' ' + MANIFESTO[p].title).join(', ')}`,
        practicedPs.length > 0 ? `Princípios praticados: ${practicedPs.join(', ')}` : 'Nenhum princípio desta dimensão praticado ainda',
        missingPs.length > 0 ? `Princípios não praticados: ${missingPs.join(', ')}` : 'Todos praticados',
        `${practicedCount}/5 princípios totais ativos | D6 mult ×${d6mult.toFixed(2)} | Fase: ${faseLabel}`,
        hasFinanceiro ? `Runway: ${runway === 99 ? '∞' : runway + 'm'} | Margem: ${margem}%` : '',
        okrs.length > 0 ? `OKRs: ${okrAvgPct}% progresso` : '',
      ].filter(Boolean).join(' | ')
      const res = await fetch('/api/advisor-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, marketContext: ctx, role: 'lider' }),
      })
      const j = await res.json()
      setDimIaAnswers(prev => ({ ...prev, [dimId]: j.answer ?? '' }))
    } finally { setDimIaLoading(null) }
  }

  async function askManifIa(mi: number, q: string) {
    setManifIaLoading(mi)
    try {
      const dimsFed = DIM_MANIF_MAP
        .map((ps, di) => ps.includes(mi) ? DIMS[di].label : null)
        .filter(Boolean).join(', ')
      const ctx = [
        `Manifesto P${MANIFESTO[mi].num}: "${MANIFESTO[mi].title}" | Praticado: ${(s.pesDig ?? [])[mi] ? 'sim' : 'não'}`,
        `Este princípio alimenta: ${dimsFed}`,
        `Índice 6D: ${index6D}/100 | D6 ×${d6mult.toFixed(2)} | ${practicedCount}/5 princípios ativos`,
        `Fase empresa: ${faseLabel}`,
        hasFinanceiro ? `Runway: ${runway === 99 ? '∞' : runway + 'm'} | Margem: ${margem}%` : '',
        okrs.length > 0 ? `OKRs: ${okrAvgPct}% progresso | Norte: "${admin.norteStar?.slice(0, 80) || 'não definido'}"` : '',
      ].filter(Boolean).join(' | ')
      const res = await fetch('/api/advisor-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, marketContext: ctx, role: 'lider' }),
      })
      const j = await res.json()
      setManifIaAnswers(prev => ({ ...prev, [mi]: j.answer ?? '' }))
    } finally { setManifIaLoading(null) }
  }

  // ── Presentation Mode — Analytical Dashboard ─────────────────────────────
  const dashActions = (() => {
    const acts: { priority: 'urgente' | 'alta' | 'media'; action: string; why: string }[] = []
    // No principles practiced
    if (practicedCount === 0)
      acts.push({ priority: 'urgente', action: 'Escolha 1 princípio do Manifesto e pratique esta semana', why: 'Nenhum princípio ativo — Índice 6D no nível mínimo' })
    // Lowest dimension: suggest the missing principle
    const lowestPct = pcts[lowestId]
    if (lowestPct < 60) {
      const missingPs = DIM_MANIF_MAP[lowestId].filter(p => !(s.pesDig ?? [])[p])
      const suggestion = missingPs.length > 0
        ? `Ative o princípio "${MANIFESTO[missingPs[0]].title}" para fortalecer ${DIMS[lowestId].label}`
        : `Aprofunde a prática dos princípios de ${DIMS[lowestId].label}`
      acts.push({ priority: lowestPct < 35 ? 'urgente' : 'alta', action: suggestion, why: `${DIMS[lowestId].label} em ${lowestPct}% — dimensão mais fraca do sistema` })
    }
    // D6 multiplier drag
    if (d6Low && practicedCount > 0)
      acts.push({ priority: 'media', action: 'Ative mais princípios do Manifesto para elevar o multiplicador D6', why: `D6 em ${pcts[5]}% — multiplicador ×${d6mult.toFixed(2)} reduzindo todo o índice` })
    // Financial cross-signal
    if (hasFinanceiro && runway < 6)
      acts.push({ priority: runway < 3 ? 'urgente' : 'alta', action: 'Contextualize o time sobre a saúde financeira com base no Manifesto P05', why: `Runway ${runway === 99 ? '∞' : runway + 'm'} exige compromisso mútuo e transparência` })
    if (okrs.length > 0 && okrAvgPct < 30 && pcts[0] < 50)
      acts.push({ priority: 'alta', action: 'Pratique P01 (Trabalho com Significado) — conecte OKRs ao propósito real', why: `OKRs em ${okrAvgPct}% e D1 em ${pcts[0]}% — falta clareza de direção` })
    return acts.slice(0, 4)
  })()

  if (presentMode) {
    const slides = [
      'capa',
      'acoes',
      'diagnostico',
      'negocios',
      ...(snaps.length > 1 ? ['evolucao'] : []),
    ]
    const totalSlides = slides.length
    const curSlide = slides[Math.min(slideIndex, totalSlides - 1)]

    const goNext = () => setSlideIndex(i => Math.min(i + 1, totalSlides - 1))
    const goPrev = () => setSlideIndex(i => Math.max(i - 1, 0))

    return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 120px)' }}>

      {/* ── Slide area ── */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div key={curSlide}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col gap-4 px-1 pt-2 pb-4"
          >

          {/* ══ SLIDE: CAPA ══ */}
          {curSlide === 'capa' && (<>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[8px] font-mono tracking-[0.22em] text-white/18 uppercase">Neural Leadership OS</p>
                <p className="text-[10px] font-mono text-white/20 mt-0.5">{faseLabel} · {practicedCount}/5 princípios ativos</p>
              </div>
            </div>

            <div className="rounded-2xl p-6 flex flex-col items-center gap-3" style={{ background: `linear-gradient(135deg, ${overallColor}14, rgba(0,0,0,0.5))`, border: `1px solid ${overallColor}30` }}>
              <p className="text-[9px] font-mono tracking-widest text-white/25 uppercase">Índice de Liderança 6D</p>
              <motion.div key={index6D} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
                className="text-[88px] font-black font-mono leading-none"
                style={{ color: overallColor, textShadow: `0 0 60px ${overallColor}50` }}>
                {index6D}
              </motion.div>
              <div className="flex items-center gap-4 text-center">
                <div>
                  <p className="text-[18px] font-black font-mono" style={{ color: overallColor }}>×{d6mult.toFixed(2)}</p>
                  <p className="text-[8px] font-mono text-white/22">multiplicador D6</p>
                </div>
                {lastSnap && (
                  <div>
                    <p className="text-[18px] font-black font-mono" style={{ color: index6D >= lastSnap.index6D ? TEAL : RED }}>
                      {index6D >= lastSnap.index6D ? '+' : ''}{index6D - lastSnap.index6D}
                    </p>
                    <p className="text-[8px] font-mono text-white/22">vs último</p>
                  </div>
                )}
                <div>
                  <p className="text-[18px] font-black font-mono text-white/60">{pcts.filter(p => p >= 60).length}/6</p>
                  <p className="text-[8px] font-mono text-white/22">dimensões ok</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-[9px] font-mono text-white/20 mb-2 uppercase tracking-wider">Status por dimensão</p>
              <div className="flex gap-1.5">
                {DIMS.map(d => {
                  const pct = pcts[d.id]
                  const c = pct < 40 ? RED : pct < 65 ? AMBER : DIM_COLORS[d.id]
                  return (
                    <div key={d.id} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-full overflow-hidden" style={{ height: `${Math.max(4, Math.round(pct / 100 * 48))}px`, background: `${c}22`, border: `1px solid ${c}30` }}>
                        <motion.div className="w-full h-full rounded-full" style={{ background: c }}
                          initial={{ scaleY: 0, originY: 1 }} animate={{ scaleY: 1 }} transition={{ duration: 0.5, delay: d.id * 0.07 }} />
                      </div>
                      <span className="text-[8px] font-mono" style={{ color: c, opacity: 0.7 }}>{d.code}</span>
                      <span className="text-[9px] font-bold font-mono" style={{ color: c }}>{pct}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {admin.norteStar && (
              <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-[8px] font-mono text-white/18 uppercase tracking-wider mb-1">Norte Estratégico</p>
                <p className="text-[11px] text-white/55 leading-relaxed italic">"{admin.norteStar}"</p>
              </div>
            )}
          </>)}

          {/* ══ SLIDE: AÇÕES ══ */}
          {curSlide === 'acoes' && (<>
            <div>
              <p className="text-[8px] font-mono tracking-[0.22em] text-white/18 uppercase">Slide 2 — Tomada de Decisão</p>
              <p className="text-[18px] font-bold text-white/80 mt-1">Ações Prioritárias</p>
              <p className="text-[10px] text-white/25 mt-0.5">Geradas automaticamente a partir dos dados</p>
            </div>

            {dashActions.length === 0 ? (
              <div className="rounded-2xl p-8 flex flex-col items-center gap-2" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[13px] text-white/25">Nenhuma ação gerada</p>
                <p className="text-[10px] text-white/18 text-center">Preencha os dados nas dimensões<br/>para ativar o diagnóstico automático</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {dashActions.map((act, i) => {
                  const cfg = {
                    urgente: { label: 'URGENTE', bg: `${RED}14`, border: `${RED}35`, color: RED, num: `${RED}` },
                    alta:    { label: 'ALTA',    bg: `${AMBER}10`, border: `${AMBER}30`, color: AMBER, num: AMBER },
                    media:   { label: 'MÉDIA',   bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', num: 'rgba(255,255,255,0.3)' },
                  }[act.priority]
                  return (
                    <div key={i} className="rounded-xl p-4" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1.5 shrink-0">
                          <span className="text-[20px] font-black font-mono leading-none" style={{ color: cfg.num, opacity: 0.35 }}>{i + 1}</span>
                          <span className="text-[7px] font-mono font-black px-1.5 py-0.5 rounded"
                            style={{ background: `${cfg.border}`, color: cfg.color, border: `1px solid ${cfg.border}`, letterSpacing: '0.1em' }}>
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-[14px] font-semibold text-white/85 leading-snug">{act.action}</p>
                          <p className="text-[10px] text-white/30 mt-1.5 leading-relaxed">{act.why}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {riskSignals.filter(r => r.level === 'critical').length > 0 && (
              <div className="rounded-xl px-3 py-2.5" style={{ background: `${RED}08`, border: `1px solid ${RED}20` }}>
                <p className="text-[8.5px] font-mono uppercase tracking-wider mb-1.5" style={{ color: RED, opacity: 0.6 }}>Alertas críticos</p>
                {riskSignals.filter(r => r.level === 'critical').slice(0, 2).map((r, i) => (
                  <p key={i} className="text-[10px] leading-relaxed mb-1" style={{ color: RED, opacity: 0.75 }}>• {r.msg}</p>
                ))}
              </div>
            )}
          </>)}

          {/* ══ SLIDE: DIAGNÓSTICO ══ */}
          {curSlide === 'diagnostico' && (<>
            <div>
              <p className="text-[8px] font-mono tracking-[0.22em] text-white/18 uppercase">Slide 3 — Diagnóstico</p>
              <p className="text-[18px] font-bold text-white/80 mt-1">Análise 6 Dimensões</p>
            </div>

            <div className="rounded-2xl p-3" style={{ background: 'rgba(0,0,0,0.38)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <HexRadar pcts={pcts} colors={DIM_COLORS} />
            </div>

            <div className="flex flex-col gap-2">
              {DIMS.map(d => {
                const pct = pcts[d.id]
                const prevDim = lastSnap ? Math.round((lastSnap.dims[d.id] / 20) * 100) : null
                const delta = prevDim !== null ? pct - prevDim : null
                const c = pct < 40 ? RED : pct < 65 ? AMBER : DIM_COLORS[d.id]
                return (
                  <div key={d.id} className="rounded-xl px-3 py-2.5 flex items-center gap-3"
                    style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${c}18` }}>
                    <span className="text-[10px] font-mono w-6 shrink-0" style={{ color: DIM_COLORS[d.id], opacity: 0.6 }}>{d.code}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-white/65">{d.label}</span>
                        <div className="flex items-center gap-1.5">
                          {delta !== null && delta !== 0 && (
                            <span className="text-[9px] font-mono" style={{ color: delta > 0 ? TEAL : RED }}>{delta > 0 ? '+' : ''}{delta}</span>
                          )}
                          <span className="text-[14px] font-black font-mono" style={{ color: c }}>{pct}</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <motion.div className="h-full rounded-full" style={{ background: c }}
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5, delay: d.id * 0.06 }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>)}

          {/* ══ SLIDE: NEGÓCIOS ══ */}
          {curSlide === 'negocios' && (<>
            <div>
              <p className="text-[8px] font-mono tracking-[0.22em] text-white/18 uppercase">Slide 4 — Contexto</p>
              <p className="text-[18px] font-bold text-white/80 mt-1">Sinais do Negócio</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Runway', value: !hasFinanceiro ? '—' : runway === 99 ? '∞' : String(runway), unit: hasFinanceiro && runway !== 99 ? 'm' : '', color: !hasFinanceiro ? 'rgba(255,255,255,0.15)' : runway < 3 ? RED : runway < 6 ? AMBER : TEAL, sub: !hasFinanceiro ? 'Preencha o Cockpit' : runway < 3 ? 'CRÍTICO — caixa em risco' : runway < 6 ? 'Atenção — runway curto' : 'Saudável' },
                { label: 'Margem Líq.', value: margem > 0 ? `${margem}` : '—', unit: margem > 0 ? '%' : '', color: margem <= 0 ? 'rgba(255,255,255,0.15)' : margem < 10 ? RED : margem < 20 ? AMBER : TEAL, sub: margem <= 0 ? 'Sem dados financeiros' : margem < 10 ? 'Margem crítica' : margem < 20 ? 'Margem regular' : 'Margem saudável' },
                { label: 'Multiplicador D6', value: `×${d6mult.toFixed(2)}`, unit: '', color: d6Low ? RED : d6mult >= 1.3 ? TEAL : AMBER, sub: d6Low ? 'Cultura drenando resultado' : d6mult >= 1.3 ? 'Cultura amplificando' : 'Cultura neutra' },
                { label: 'Princípios Ativos', value: String(practicedCount), unit: '/5', color: practicedCount === 0 ? RED : practicedCount < 3 ? AMBER : TEAL, sub: practicedCount === 0 ? 'Nenhum princípio praticado' : practicedCount < 3 ? 'Cultura em formação' : 'Cultura ativa' },
              ].map((sig, i) => (
                <div key={i} className="rounded-2xl px-4 py-4 flex flex-col gap-1.5"
                  style={{ background: 'rgba(0,0,0,0.38)', border: `1px solid ${sig.color}22` }}>
                  <p className="text-[8.5px] font-mono text-white/22 uppercase tracking-wide">{sig.label}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-[32px] font-black font-mono leading-none" style={{ color: sig.color }}>{sig.value}</span>
                    {sig.unit && <span className="text-[12px] font-mono pb-1" style={{ color: sig.color, opacity: 0.55 }}>{sig.unit}</span>}
                  </div>
                  <p className="text-[10px] text-white/28 leading-snug">{sig.sub}</p>
                </div>
              ))}
            </div>

            {okrs.length > 0 && (
              <div className="rounded-xl px-3 py-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[8.5px] font-mono text-white/22 uppercase tracking-wider">OKRs da Empresa</p>
                  <span className="text-[10px] font-mono font-bold" style={{ color: okrAvgPct >= 70 ? TEAL : okrAvgPct >= 40 ? AMBER : RED }}>{okrAvgPct}% progresso</span>
                </div>
                {okrs.slice(0, 3).map((o, i) => (
                  <p key={i} className="text-[10px] text-white/40 mb-0.5 truncate">• {o.objetivo}</p>
                ))}
              </div>
            )}
          </>)}

          {/* ══ SLIDE: EVOLUÇÃO ══ */}
          {curSlide === 'evolucao' && (<>
            <div>
              <p className="text-[8px] font-mono tracking-[0.22em] text-white/18 uppercase">Slide — Histórico</p>
              <p className="text-[18px] font-bold text-white/80 mt-1">Evolução do Índice</p>
              {snaps.length >= 2 && (
                <p className="text-[11px] mt-1" style={{ color: snaps[snaps.length - 1].index6D >= snaps[0].index6D ? TEAL : RED }}>
                  {snaps[snaps.length - 1].index6D >= snaps[0].index6D ? '▲' : '▼'} {Math.abs(snaps[snaps.length - 1].index6D - snaps[0].index6D)} pts desde o início
                </p>
              )}
            </div>

            {snaps.length >= 3 && (
              <div className="rounded-2xl p-4" style={{ background: 'rgba(0,0,0,0.38)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <Sparkline data={snaps.map(sn => sn.index6D)} color={overallColor} sw={280} sh={80} />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              {[...snaps].reverse().slice(0, 10).map((snap, i) => {
                const d = new Date(snap.date)
                const label = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
                const c = snap.index6D >= 70 ? TEAL : snap.index6D >= 45 ? AMBER : RED
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[9px] font-mono text-white/20 w-20 shrink-0">{label}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <motion.div className="h-full rounded-full" style={{ background: c }}
                        initial={{ width: 0 }} animate={{ width: `${snap.index6D}%` }} transition={{ duration: 0.5, delay: i * 0.04 }} />
                    </div>
                    <span className="text-[12px] font-black font-mono w-7 text-right shrink-0" style={{ color: c }}>{snap.index6D}</span>
                  </div>
                )
              })}
            </div>
          </>)}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Navigation bar ── */}
      <div className="sticky bottom-0 pt-3 pb-2" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}>
        <div className="flex items-center justify-between px-1">
          <button onClick={() => { setPresentMode(false); setSlideIndex(0) }}
            className="text-[9px] font-mono text-white/25 px-2.5 py-1.5 rounded-lg"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            ← sair
          </button>

          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setSlideIndex(i)}
                className="rounded-full transition-all"
                style={{ width: i === slideIndex ? 16 : 6, height: 6, background: i === slideIndex ? overallColor : 'rgba(255,255,255,0.15)' }} />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button onClick={goPrev} disabled={slideIndex === 0}
              className="px-2.5 py-1.5 rounded-lg text-[9px] font-mono transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.08)', color: slideIndex === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.4)' }}>
              ‹
            </button>
            <button onClick={goNext} disabled={slideIndex === totalSlides - 1}
              className="px-2.5 py-1.5 rounded-lg text-[9px] font-mono font-bold transition-all"
              style={{ border: `1px solid ${slideIndex === totalSlides - 1 ? 'rgba(255,255,255,0.08)' : overallColor + '50'}`, color: slideIndex === totalSlides - 1 ? 'rgba(255,255,255,0.12)' : overallColor }}>
              ›
            </button>
          </div>
        </div>
      </div>

    </div>
  )}

  return (
    <div className="flex flex-col gap-5 pb-8">

      {/* ── Neural OS Header ── */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div>
          <p className="text-[9px] font-mono tracking-[0.22em] text-white/18 uppercase">Neural Leadership OS</p>
          <p className="text-[10px] font-mono text-white/30 mt-0.5">SIG · Gerencial · Pessoas</p>
        </div>
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {!showClear ? (
              <motion.button key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowClear(true)}
                className="text-[9px] font-mono text-white/18 px-2 py-1 rounded-lg transition-colors hover:text-white/35"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                limpar
              </motion.button>
            ) : (
              <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono text-white/30">zerar tudo?</span>
                <button onClick={() => { update(DEFAULT); setShowClear(false) }}
                  className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                  style={{ color: RED, border: `1px solid ${RED}30`, background: `${RED}0a` }}>sim</button>
                <button onClick={() => setShowClear(false)}
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded text-white/25"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}>não</button>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.4, repeat: Infinity }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ border: `1px solid ${TEAL}45`, background: `${TEAL}0a` }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL, boxShadow: `0 0 6px ${TEAL}` }} />
            <span className="text-[9px] font-mono font-bold" style={{ color: TEAL }}>ATIVO</span>
          </motion.div>
        </div>
      </div>

      {/* ── Intelligence Strip — dados cruzados de outros módulos ── */}
      <div className="grid grid-cols-2 gap-2">
        {/* Runway */}
        <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wider mb-1">Runway</p>
          <div className="flex items-end gap-1">
            <span className="text-[20px] font-black font-mono leading-none"
              style={{ color: !hasFinanceiro ? 'rgba(255,255,255,0.15)' : runway < 3 ? RED : runway < 6 ? AMBER : TEAL }}>
              {!hasFinanceiro ? '—' : runway === 99 ? '∞' : runway}
            </span>
            {hasFinanceiro && runway !== 99 && <span className="text-[10px] text-white/25 pb-0.5 font-mono">m</span>}
          </div>
          <p className="text-[9px] text-white/20 mt-0.5">{!hasFinanceiro ? 'Preencha o Cockpit' : runway < 3 ? 'CRÍTICO' : runway < 6 ? 'atenção' : 'saudável'}</p>
        </div>

        {/* Margem */}
        <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wider mb-1">Margem</p>
          <div className="flex items-end gap-1">
            <span className="text-[20px] font-black font-mono leading-none"
              style={{ color: !hasFinanceiro ? 'rgba(255,255,255,0.15)' : margem < 10 ? RED : margem < 25 ? AMBER : TEAL }}>
              {!hasFinanceiro ? '—' : margem}
            </span>
            {hasFinanceiro && <span className="text-[10px] text-white/25 pb-0.5 font-mono">%</span>}
          </div>
          <p className="text-[9px] text-white/20 mt-0.5">{!hasFinanceiro ? 'Preencha o Cockpit' : margem < 10 ? 'pressão alta' : 'operacional'}</p>
        </div>

        {/* OKR Progress */}
        <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wider mb-1">OKRs</p>
          <div className="flex items-end gap-1">
            <span className="text-[20px] font-black font-mono leading-none"
              style={{ color: okrs.length === 0 ? 'rgba(255,255,255,0.15)' : okrAvgPct < 30 ? RED : okrAvgPct < 70 ? AMBER : TEAL }}>
              {okrs.length === 0 ? '—' : okrAvgPct}
            </span>
            {okrs.length > 0 && <span className="text-[10px] text-white/25 pb-0.5 font-mono">%</span>}
          </div>
          <p className="text-[9px] text-white/20 mt-0.5">{okrs.length === 0 ? 'Defina OKRs no Painel' : `${okrs.length} objetivo${okrs.length > 1 ? 's' : ''}`}</p>
        </div>

        {/* Fase + manifesto */}
        <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wider mb-1">Fase · Manifesto</p>
          <p className="text-[13px] font-black text-white/60 leading-none">{faseLabel}</p>
          <p className="text-[9px] mt-1" style={{ color: practicedCount === 0 ? RED : practicedCount < 3 ? AMBER : TEAL }}>
            {practicedCount}/5 princípios ativos
          </p>
        </div>
      </div>

      {/* Risk signals cross-module */}
      {riskSignals.length > 0 && (
        <div className="flex flex-col gap-2">
          {riskSignals.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
              style={{ background: r.level === 'critical' ? `${RED}0c` : `${AMBER}0c`, border: `1px solid ${r.level === 'critical' ? RED : AMBER}30` }}>
              <AlertTriangle size={12} style={{ color: r.level === 'critical' ? RED : AMBER, marginTop: 1.5, flexShrink: 0 }} />
              <p className="text-[10.5px] leading-relaxed" style={{ color: r.level === 'critical' ? RED : 'rgba(255,255,255,0.45)' }}>{r.msg}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Orb ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="pt-5 pb-3 flex flex-col items-center gap-1">
          <EnergyOrb score={index6D} d6mult={d6mult} />
          <p className="text-[9.5px] font-mono text-white/18 text-center px-6 leading-relaxed">
            Score = (D1+D2+D3+D4+D5) × D6<sub className="text-[8px]">mult</sub> + Bônus Manifesto
          </p>
        </div>
        <div className="px-3 pb-3">
          <ParticleField score={index6D} />
        </div>
      </div>

      {/* ── D6 Entropy Alert ── */}
      <AnimatePresence>
        {d6Low && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="rounded-xl px-4 py-3 flex items-start gap-3"
            style={{ background: `${RED}0c`, border: `1px solid ${RED}35` }}>
            <AlertTriangle size={14} style={{ color: RED, marginTop: 1, flexShrink: 0 }} />
            <div>
              <p className="text-[11px] font-bold" style={{ color: RED }}>Alerta de Entropia Cultural</p>
              <p className="text-[10.5px] text-white/40 mt-0.5 leading-relaxed">
                D6 (Dignidade) em {pcts[5]}% — multiplicador ×{d6mult.toFixed(2)} está drenando os outros pilares.
                Pratique os princípios do Manifesto antes de cobrar resultado.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════
          MANIFESTO — 5 Princípios + IA
          ════════════════════════════════════ */}
      <div>
        {/* Header com multiplicador ao vivo */}
        <div className="px-1 mb-4">
          <p className="text-[9px] font-mono tracking-[0.25em] text-white/18 uppercase mb-1">Código de Cultura · D6</p>
          <div className="flex items-end gap-3">
            <h2 className="text-[17px] font-black text-white/80 leading-tight">Manifesto de Liderança</h2>
            <div className="flex flex-col items-end mb-0.5">
              <span className="text-[18px] font-black font-mono leading-none" style={{ color: d6Low ? RED : d6mult >= 1.3 ? TEAL : AMBER }}>
                ×{d6mult.toFixed(2)}
              </span>
              <span className="text-[8px] font-mono text-white/20">{practicedCount}/5 ativos</span>
            </div>
          </div>
          <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div className="h-full rounded-full" animate={{ width: `${Math.min(100, d6mult * 66.7)}%` }} transition={{ duration: 0.6 }}
              style={{ background: d6Low ? RED : d6mult >= 1.3 ? TEAL : AMBER }} />
          </div>
          <div className="flex justify-between mt-0.5">
            <span className="text-[7.5px] font-mono text-white/15">×0.5 — inativo</span>
            <span className="text-[7.5px] font-mono text-white/15">×1.5 — plena força</span>
          </div>
        </div>

        {/* Princípios */}
        <div className="relative flex flex-col">
          <div className="absolute left-5 top-5 bottom-5 w-px" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.02))' }} />

          {MANIFESTO.map((m, mi) => {
            const practiced = (s.pesDig ?? [])[mi]
            // Which 6D dimensions this principle feeds
            const dimsFed = DIM_MANIF_MAP.map((ps, di) => ps.includes(mi) ? DIMS[di] : null).filter(Boolean) as typeof DIMS
            const manifQs = (() => {
              if (mi === 0) return [
                'Como fazer o time ver o impacto real do trabalho deles — a quem estamos servindo?',
                practiced ? 'Estou praticando P01 — como aprofundar essa clareza de propósito no dia a dia?' : 'Como introduzir a pergunta "a quem isso serve?" antes de cada decisão?',
              ]
              if (mi === 1) return [
                'Como ter a conversa de propósito com alguém do time sem parecer superficial?',
                practiced ? 'P02 ativo — como conectar o crescimento pessoal de cada um com a função que exercem?' : 'Como descobrir o que realmente move cada pessoa além do salário?',
              ]
              if (mi === 2) return [
                'Como praticar liderança como facilitação — removendo obstáculos em vez de cobrar resultados?',
                practiced ? 'P03 ativo — como usar empatia para identificar o que está travando o time?' : 'Qual obstáculo posso remover esta semana para liberar energia produtiva?',
              ]
              if (mi === 3) return [
                'Como reconhecer uma entrega de forma que realmente impacte — não genérica?',
                practiced ? 'P04 ativo — como calibrar o que significa "ir além do esperado" no contexto atual?' : 'Como celebrar proatividade e utilidade de forma visível para o time?',
              ]
              return [
                'Como criar acordos de compromisso mútuo que as pessoas realmente honrem?',
                practiced ? 'P05 ativo — como estruturar retrospectiva mensal que gere mudança real?' : 'Como abrir o diálogo sobre o que está pesando para ajustar o curso juntos?',
              ]
            })()

            return (
              <motion.div key={mi} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: mi * 0.07 }}
                className="flex gap-4 pb-4">

                <div className="relative shrink-0 z-10">
                  <motion.div
                    animate={practiced ? { boxShadow: [`0 0 0px ${m.color}00`, `0 0 14px ${m.color}70`, `0 0 0px ${m.color}00`] } : {}}
                    transition={{ duration: 2.2, repeat: Infinity }}
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: practiced ? `${m.color}20` : 'rgba(2,6,18,0.9)', border: `1.5px solid ${practiced ? m.color + '60' : 'rgba(255,255,255,0.08)'}` }}>
                    <span className="text-[11px] font-mono font-black" style={{ color: practiced ? m.color : 'rgba(255,255,255,0.2)' }}>{m.num}</span>
                  </motion.div>
                </div>

                <div className="flex-1 min-w-0 rounded-xl p-3 pb-3.5"
                  style={{ background: practiced ? `${m.color}08` : 'rgba(0,0,0,0.2)', border: `1px solid ${practiced ? m.color + '28' : 'rgba(255,255,255,0.05)'}` }}>

                  <p className="text-[12.5px] font-bold leading-tight mb-2" style={{ color: practiced ? m.color : 'rgba(255,255,255,0.65)' }}>{m.title}</p>
                  <p className="text-[11px] text-white/38 leading-relaxed mb-3">{m.body}</p>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-px flex-1" style={{ background: `${m.color}18` }} />
                    <span className="text-[8.5px] font-mono" style={{ color: m.color, opacity: 0.5 }}>RITUAL</span>
                    <div className="h-px flex-1" style={{ background: `${m.color}18` }} />
                  </div>
                  <p className="text-[10.5px] italic leading-relaxed mb-3" style={{ color: m.color, opacity: practiced ? 0.7 : 0.3 }}>"{m.ritual}"</p>

                  {/* Dimensões alimentadas */}
                  <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">alimenta →</span>
                    {dimsFed.map(d => (
                      <span key={d.id} className="text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded"
                        style={{ background: `${DIM_COLORS[d.id]}15`, color: DIM_COLORS[d.id], border: `1px solid ${DIM_COLORS[d.id]}30` }}>
                        {d.code}
                      </span>
                    ))}
                  </div>

                  {/* IA por princípio */}
                  <div className="pt-2.5" style={{ borderTop: `1px solid ${m.color}15` }}>
                    <div className="flex flex-col gap-1.5 mb-2">
                      {manifQs.map(q => (
                        <button key={q} onClick={() => askManifIa(mi, q)}
                          className="text-left px-2.5 py-1.5 rounded-lg text-[10px] font-mono leading-snug transition-all"
                          style={{ background: `${m.color}08`, border: `1px solid ${m.color}20`, color: m.color, opacity: 0.75 }}>
                          › {q}
                        </button>
                      ))}
                    </div>
                    {manifIaLoading === mi && (
                      <div className="flex items-center gap-2">
                        <Loader2 size={10} style={{ color: m.color }} className="animate-spin" />
                        <span className="text-[9.5px] font-mono" style={{ color: m.color, opacity: 0.6 }}>analisando...</span>
                      </div>
                    )}
                    {manifIaAnswers[mi] && manifIaLoading !== mi && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="rounded-lg px-3 py-2.5"
                        style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${m.color}15` }}>
                        <p className="text-[11px] text-white/60 leading-relaxed whitespace-pre-wrap">{manifIaAnswers[mi]}</p>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => { const arr = [...(s.pesDig ?? [false,false,false,false,false])]; arr[mi] = !arr[mi]; update({ pesDig: arr }) }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9.5px] font-bold font-mono transition-all uppercase tracking-wider"
                      style={{ background: practiced ? `${m.color}20` : 'rgba(255,255,255,0.04)', border: `1px solid ${practiced ? m.color + '45' : 'rgba(255,255,255,0.07)'}`, color: practiced ? m.color : 'rgba(255,255,255,0.22)' }}>
                      {practiced ? <CheckCircle2 size={10} /> : <Circle size={10} />}
                      {practiced ? 'praticamos' : 'marcar'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {practicedCount === 0 && (
          <div className="rounded-xl px-3 py-3" style={{ background: `${AMBER}08`, border: `1px solid ${AMBER}20` }}>
            <p className="text-[10px] leading-relaxed" style={{ color: AMBER, opacity: 0.75 }}>
              Nenhum princípio ativo. Multiplicador ×{d6mult.toFixed(2)} reduzindo todos os scores em {Math.round((1 - d6mult) * 100)}%.
            </p>
          </div>
        )}
        {practicedCount === 5 && (
          <div className="rounded-xl px-3 py-3" style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}20` }}>
            <p className="text-[10px] leading-relaxed" style={{ color: TEAL, opacity: 0.75 }}>
              Cultura plena — ×{d6mult.toFixed(2)} amplificando todos os scores.
            </p>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════
          6D DIAGNÓSTICO
          ════════════════════════════════════ */}
      <div>
        <div className="px-1 mb-3">
          <p className="text-[9px] font-mono tracking-[0.25em] text-white/18 uppercase mb-1">Diagnóstico Vetorial</p>
          <p className="text-[14px] font-black text-white/70">6 Dimensões de Liderança</p>
        </div>

        {/* Arc gauge cards */}
        <div className="grid grid-cols-2 gap-2">
          {DIMS.map(d => {
            const pct = pcts[d.id]
            const isActive = activeCard === d.id
            const isD6 = d.id === 5
            return (
              <motion.button key={d.id}
                onClick={() => setActiveCard(isActive ? null : d.id)}
                className="rounded-xl p-3 text-left transition-all"
                style={{ background: isActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.3)', border: `1px solid ${isActive ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)'}` }}
                whileTap={{ scale: 0.96 }}>
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <ArcGauge pct={pct} color={DIM_COLORS[d.id]} size={52} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[12px] font-black font-mono leading-none" style={{ color: DIM_COLORS[d.id] }}>{pct}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-[9px] font-mono font-bold" style={{ color: DIM_COLORS[d.id], opacity: 0.55 }}>{d.code}</p>
                      {isD6 && <span className="text-[8px] font-mono font-bold" style={{ color: d6mult >= 1 ? TEAL : RED }}>×{d6mult.toFixed(1)}</span>}
                    </div>
                    <p className="text-[12px] font-bold text-white/70 leading-tight mt-0.5">{d.label}</p>
                    <p className="text-[9px] text-white/22 mt-0.5">{d.short}</p>
                  </div>
                  <ChevronDown size={10} style={{ color: 'rgba(255,255,255,0.18)', transform: isActive ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Expanded panel */}
        <AnimatePresence mode="wait">
          {activeCard !== null && (
            <motion.div key={activeCard}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.17 }}
              className="rounded-xl p-4 mt-2"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded" style={{ background: `${DIM_COLORS[activeCard]}20`, color: DIM_COLORS[activeCard] }}>{DIMS[activeCard].code}</span>
                <span className="text-[13px] font-bold" style={{ color: DIM_COLORS[activeCard] }}>{DIMS[activeCard].label}</span>
                <span className="text-[11px] font-mono font-black ml-auto" style={{ color: DIM_COLORS[activeCard] }}>{pcts[activeCard]}/100</span>
              </div>

              {/* Insight: quais princípios alimentam esta dimensão */}
              <p className="text-[10px] text-white/30 leading-relaxed mb-3">{DIM_MANIF_DESC[activeCard]}</p>
              <div className="flex flex-col gap-1.5 mb-4">
                {DIM_MANIF_MAP[activeCard].map(pi => {
                  const m = MANIFESTO[pi]
                  const practiced = (s.pesDig ?? [])[pi]
                  return (
                    <div key={pi} className="flex items-center gap-3 px-3 py-2 rounded-lg"
                      style={{ background: practiced ? `${m.color}12` : 'rgba(0,0,0,0.25)', border: `1px solid ${practiced ? m.color + '35' : 'rgba(255,255,255,0.06)'}` }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: practiced ? `${m.color}25` : 'rgba(255,255,255,0.04)', border: `1px solid ${practiced ? m.color + '50' : 'rgba(255,255,255,0.08)'}` }}>
                        <span className="text-[8px] font-mono font-black" style={{ color: practiced ? m.color : 'rgba(255,255,255,0.2)' }}>{m.num}</span>
                      </div>
                      <span className="text-[11px] flex-1" style={{ color: practiced ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.25)' }}>{m.title}</span>
                      <span className="text-[8.5px] font-mono font-bold" style={{ color: practiced ? DIM_COLORS[activeCard] : 'rgba(255,255,255,0.15)' }}>
                        {practiced ? '● ativo' : '○ inativo'}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* IA analysis */}
              <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Brain size={11} style={{ color: TEAL }} />
                  <span className="text-[9.5px] font-mono text-white/30">Análise IA baseada no Manifesto</span>
                </div>
                <div className="flex flex-col gap-1.5 mb-2">
                  {getDimIaQ(activeCard, s.pesDig).map(q => (
                    <button key={q} onClick={() => askDimIa(activeCard, q)}
                      className="text-left px-2.5 py-1.5 rounded-lg text-[10px] font-mono leading-snug transition-all"
                      style={{ background: 'rgba(23,165,137,0.08)', border: '1px solid rgba(23,165,137,0.2)', color: TEAL }}>
                      › {q}
                    </button>
                  ))}
                </div>
                {dimIaLoading === activeCard && (
                  <div className="flex items-center gap-2">
                    <Loader2 size={11} style={{ color: TEAL }} className="animate-spin" />
                    <span className="text-[10px] font-mono" style={{ color: TEAL }}>analisando {DIMS[activeCard].code}...</span>
                  </div>
                )}
                {dimIaAnswers[activeCard] && dimIaLoading !== activeCard && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="rounded-lg px-3 py-2.5 mt-1"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-[11.5px] text-white/60 leading-relaxed whitespace-pre-wrap">{dimIaAnswers[activeCard]}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


    </div>
  )
}
