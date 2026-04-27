'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWorkspaceData } from '@/hooks/useWorkspaceData'
import { Brain, CheckCircle2, Circle, Loader2, ChevronDown, AlertTriangle, Zap } from 'lucide-react'

// ─── Palette ──────────────────────────────────────────────────────────────────
const TEAL  = '#17a589'
const RED   = '#e74c3c'
const AMBER = '#e67e22'
const BLUE  = '#3b82f6'

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

// ─── Maturity levels — Situational Leadership ────────────────────────────────
const MATURITY = [
  { id: 1, label: 'M1', title: 'Iniciante entusiasmado',
    sub: 'Baixa competência · Alto entusiasmo',
    script: 'E1 — Direcionar: dê instruções específicas, supervisione de perto, explique o "como" e o "porquê".' },
  { id: 2, label: 'M2', title: 'Aprendiz desapontado',
    sub: 'Alguma competência · Comprometimento variável',
    script: 'E2 — Treinar: continue instruindo com mais explicações, peça opiniões, reforce o progresso visível.' },
  { id: 3, label: 'M3', title: 'Capaz relutante',
    sub: 'Boa competência · Confiança variável',
    script: 'E3 — Apoiar: encoraje, ouça ativamente, colabore nas decisões, demonstre confiança na capacidade.' },
  { id: 4, label: 'M4', title: 'Especialista autônomo',
    sub: 'Alta competência · Alto comprometimento',
    script: 'E4 — Delegar: transfira responsabilidade, monitore resultados (não o processo), celebre autonomia.' },
]

// ─── Sentiment analysis — client-side ────────────────────────────────────────
const WEAK_WORDS = ['tentar', 'tentarei', 'vou tentar', 'difícil', 'talvez', 'pode ser', 'veremos', 'não sei', 'depende', 'verei', 'devo tentar', 'quero tentar', 'provavelmente não', 'complicado']

function analyzeSentiment(text: string): { score: number; weakWords: string[]; label: string; color: string } {
  if (!text.trim()) return { score: 0, weakWords: [], label: '', color: 'rgba(255,255,255,0.2)' }
  const lower = text.toLowerCase()
  const found = WEAK_WORDS.filter(w => lower.includes(w))
  const score = Math.max(0, Math.min(10, 10 - found.length * 1.8))
  const label = score >= 8 ? 'alto comprometimento' : score >= 5 ? 'comprometimento moderado' : 'risco de não cumprimento'
  const color = score >= 8 ? TEAL : score >= 5 ? AMBER : RED
  return { score, weakWords: found, label, color }
}

// ─── State ───────────────────────────────────────────────────────────────────
interface ManifPratica { principioId: number; date: string; serviuPara?: string }

interface PesState {
  pesLiderados: number
  pesMetaEquipe: string; pesKpiEquipe: string
  pesNotaLider: number; pesNotaLiderado: number
  pesUltimo1a1: string; pesAcordos: string
  pesGapHabilidade: string; pesPlanoDev: string
  pesMaturidade: number
  pesRituais: boolean[]
  pesRituaisNomes: string[]
  pesBloqueios: string; pesDesbloqueioHoras: number
  pesPerfScore: number; pesReconhecimento: boolean; pesReflexao: string
  pesNpsUtilidade: number
  pesManifLog: ManifPratica[]
}

const DEFAULT: PesState = {
  pesLiderados: 0, pesMetaEquipe: '', pesKpiEquipe: '',
  pesNotaLider: 0, pesNotaLiderado: 0,
  pesUltimo1a1: '', pesAcordos: '',
  pesGapHabilidade: '', pesPlanoDev: '',
  pesMaturidade: 0,
  pesRituais: [false, false, false],
  pesRituaisNomes: ['Daily de equipe', 'Weekly Review', '1:1 semanal'],
  pesBloqueios: '', pesDesbloqueioHoras: 0,
  pesPerfScore: 0, pesReconhecimento: false, pesReflexao: '',
  pesNpsUtilidade: 0,
  pesManifLog: [],
}

// ─── Vector score engine ──────────────────────────────────────────────────────
function calcRawDims(s: PesState): number[] {
  // D1 — meta + KPI + alinhamento de expectativa (score de vetor)
  const metaScore  = s.pesMetaEquipe.trim() ? 7 : 0
  const kpiScore   = s.pesKpiEquipe.trim() ? 7 : 0
  const hasAlign   = s.pesNotaLider > 0 && s.pesNotaLiderado > 0
  const alignGap   = hasAlign ? Math.abs(s.pesNotaLider - s.pesNotaLiderado) : 5
  const avgNota    = hasAlign ? (s.pesNotaLider + s.pesNotaLiderado) / 2 : 0
  const alignScore = hasAlign ? Math.max(0, (avgNota / 10) * 6 - alignGap * 0.8) : 0
  const d1 = Math.min(20, metaScore + kpiScore + alignScore)

  // D2 — frequência 1:1 + sentiment analysis dos acordos
  let d2date = 0
  if (s.pesUltimo1a1) {
    const diff = Math.floor((Date.now() - new Date(s.pesUltimo1a1).getTime()) / 86400000)
    d2date = diff <= 7 ? 10 : diff <= 14 ? 6 : 2
  }
  const sent = analyzeSentiment(s.pesAcordos)
  const d2 = Math.min(20, d2date + (s.pesAcordos.trim() ? Math.round(sent.score) : 0))

  // D3 — gap + plano + adequação de maturidade M1-M4
  const gapScore   = s.pesGapHabilidade.trim() ? 7 : 0
  const planoScore = s.pesPlanoDev.trim() ? 7 : 0
  const matScore   = s.pesMaturidade > 0 && s.pesGapHabilidade.trim()
    ? ([0, 2, 4, 5, 6][s.pesMaturidade] ?? 0) : 0
  const d3 = Math.min(20, gapScore + planoScore + matScore)

  // D4 — rituais + velocidade de desbloqueio
  const rituaisScore = Math.round((s.pesRituais.filter(Boolean).length / 3) * 12)
  let velocityScore = 0
  if (s.pesBloqueios.trim() && s.pesDesbloqueioHoras > 0) {
    velocityScore = s.pesDesbloqueioHoras <= 24 ? 8
      : s.pesDesbloqueioHoras <= 72 ? 5
      : s.pesDesbloqueioHoras <= 168 ? 2 : 0
  }
  const d4 = Math.min(20, rituaisScore + velocityScore)

  // D5 — NPS interno de utilidade + reconhecimento
  const npsScore   = s.pesNpsUtilidade > 0 ? Math.round((s.pesNpsUtilidade / 10) * 16) : 0
  const reconScore = s.pesReconhecimento && s.pesNpsUtilidade > 5 ? 4 : s.pesReconhecimento ? 2 : 0
  const d5 = Math.min(20, npsScore + reconScore)

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const log = s.pesManifLog ?? []
  const practicedThisMonth = new Set(log.filter(p => p.date >= monthStart).map(p => p.principioId))
  const d6 = Math.round((practicedThisMonth.size / 5) * 20)

  return [d1, d2, d3, d4, d5, d6]
}

function calcIndex6D(dims: number[], practicedCount: number): number {
  const [d1, d2, d3, d4, d5, d6] = dims
  const base  = d1 + d2 + d3 + d4 + d5
  const mult  = 0.5 + (d6 / 20) * 1.0
  const bonus = (practicedCount / 5) * 8
  return Math.min(100, Math.round(base * mult + bonus))
}

function getPracticedThisMonth(log: ManifPratica[]): Set<number> {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  return new Set(log.filter(p => p.date >= monthStart).map(p => p.principioId))
}

function getDaysSinceLastPractice(log: ManifPratica[]): number | null {
  if (!log.length) return null
  const sorted = [...log].sort((a, b) => b.date.localeCompare(a.date))
  return Math.floor((Date.now() - new Date(sorted[0].date).getTime()) / 86400000)
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

// ─── Snapshot + team types ────────────────────────────────────────────────────
interface Snap { date: string; index6D: number; dims: number[] }
interface SnapStore { snaps: Snap[] }
interface SbiFeedback { id: string; date: string; situacao: string; comportamento: string; impacto: string }
interface AcordoItem { id: string; texto: string; prazo: string; feito: boolean }
interface Liderado {
  id: string; nome: string; cargo: string; maturidade: number
  ultimo1a1: string; acordos: AcordoItem[]; sbiFeedbacks: SbiFeedback[]; notas: string
}
interface TeamStore { liderados: Liderado[] }

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

// ─── Dim panel inputs ─────────────────────────────────────────────────────────
function DimPanel({ id, s, update }: { id: number; s: PesState; update: (p: Partial<PesState>) => void }) {
  const c = DIM_COLORS[id]
  const inp = `w-full rounded-lg px-3 py-2.5 text-[12px] outline-none`
  const inpStyle = { background: 'rgba(0,0,0,0.4)', border: `1px solid ${c}25`, color: 'rgba(255,255,255,0.8)' }
  const ta = `${inp} resize-none`

  // D1 — Clareza + Alinhamento de Expectativa (Score de Vetor)
  if (id === 0) {
    const hasAlign = s.pesNotaLider > 0 && s.pesNotaLiderado > 0
    const gap = hasAlign ? Math.abs(s.pesNotaLider - s.pesNotaLiderado) : null
    const isRuido = gap !== null && gap > 2
    return (
      <div className="flex flex-col gap-3">
        <div><p className="text-[10px] text-white/30 mb-1.5">Meta da equipe para o trimestre</p>
          <input value={s.pesMetaEquipe} onChange={e => update({ pesMetaEquipe: e.target.value })}
            placeholder="Ex: Fechar 10 contratos até 30/06" className={inp} style={inpStyle} /></div>
        <div><p className="text-[10px] text-white/30 mb-1.5">KPI principal — como medir?</p>
          <input value={s.pesKpiEquipe} onChange={e => update({ pesKpiEquipe: e.target.value })}
            placeholder="Ex: Conversão ≥ 25% | NPS ≥ 70" className={inp} style={inpStyle} /></div>
        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-3">Alinhamento de Expectativa</p>
          {(['pesNotaLider', 'pesNotaLiderado'] as const).map((key, ki) => (
            <div key={key} className="mb-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] text-white/30">{ki === 0 ? 'Líder — clareza da meta' : 'Liderado — clareza percebida'}</p>
                <span className="text-[10px] font-mono font-bold" style={{ color: c }}>{s[key] || '—'}/10</span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => update({ [key]: n })}
                    className="flex-1 py-1.5 rounded text-[8px] font-mono font-bold transition-all"
                    style={{ background: s[key] === n ? `${c}30` : 'rgba(0,0,0,0.3)', border: `1px solid ${s[key] === n ? c + '60' : 'rgba(255,255,255,0.05)'}`, color: s[key] === n ? c : 'rgba(255,255,255,0.2)' }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {isRuido && (
            <div className="flex items-start gap-2 mt-1 px-2.5 py-2 rounded-lg" style={{ background: `${RED}0c`, border: `1px solid ${RED}30` }}>
              <AlertTriangle size={11} style={{ color: RED, marginTop: 1, flexShrink: 0 }} />
              <p className="text-[10px] leading-relaxed" style={{ color: RED }}>
                Ruído de Direção — gap de {gap} pontos. Revise as metas em conjunto antes do próximo ciclo.
              </p>
            </div>
          )}
          {hasAlign && !isRuido && (
            <p className="text-[9.5px] mt-1.5 text-center font-mono" style={{ color: TEAL }}>Alinhado ✓ — gap {gap} pt</p>
          )}
        </div>
        {!s.pesMetaEquipe && <p className="text-[11px] px-3 py-2 rounded-lg" style={{ background: `${c}08`, border: `1px solid ${c}20`, color: c }}>Sem meta clara não há liderança — há apenas gerenciamento de agenda.</p>}
      </div>
    )
  }

  // D2 — Diálogo + Sentiment Analysis dos acordos
  if (id === 1) {
    const sentiment = analyzeSentiment(s.pesAcordos)
    const hasSentiment = s.pesAcordos.trim().length > 10
    return (
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-[10px] text-white/30 mb-1.5">Último 1:1 realizado</p>
          <div className="flex items-center gap-3">
            <input type="date" value={s.pesUltimo1a1} onChange={e => update({ pesUltimo1a1: e.target.value })}
              className="rounded-lg px-3 py-2 text-[12px] outline-none" style={inpStyle} />
            {s.pesUltimo1a1 && (() => {
              const diff = Math.floor((Date.now() - new Date(s.pesUltimo1a1).getTime()) / 86400000)
              return <span className="text-[11px] font-mono font-bold" style={{ color: diff > 14 ? RED : diff > 7 ? AMBER : c }}>{diff === 0 ? 'hoje' : `${diff}d atrás`}</span>
            })()}
          </div>
        </div>
        <div>
          <p className="text-[10px] text-white/30 mb-1.5">Acordos e compromissos</p>
          <textarea value={s.pesAcordos} onChange={e => update({ pesAcordos: e.target.value })}
            placeholder="O que ficou combinado? Quem faz o quê?" rows={3} className={ta} style={{ ...inpStyle, lineHeight: 1.6 }} />
          {hasSentiment && (
            <div className="flex items-center justify-between mt-1.5 px-2.5 py-2 rounded-lg"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider shrink-0">Sentiment</span>
                {sentiment.weakWords.length > 0 && (
                  <span className="text-[8.5px] font-mono truncate" style={{ color: RED }}>
                    ↓ {sentiment.weakWords.slice(0, 3).join(', ')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[9px] font-mono" style={{ color: sentiment.color }}>{sentiment.label}</span>
                <span className="text-[10px] font-black font-mono" style={{ color: sentiment.color }}>{Math.round(sentiment.score)}/10</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // D3 — Capacitação + Maturidade M1–M4
  if (id === 2) {
    const selectedMat = MATURITY.find(m => m.id === s.pesMaturidade)
    return (
      <div className="flex flex-col gap-3">
        <div><p className="text-[10px] text-white/30 mb-1.5">Principal gap de habilidade do time</p>
          <input value={s.pesGapHabilidade} onChange={e => update({ pesGapHabilidade: e.target.value })}
            placeholder="Ex: Negociação, produto, gestão do tempo..." className={inp} style={inpStyle} /></div>
        <div><p className="text-[10px] text-white/30 mb-1.5">Plano de desenvolvimento ativo</p>
          <textarea value={s.pesPlanoDev} onChange={e => update({ pesPlanoDev: e.target.value })}
            placeholder="Curso, shadowing, leitura, feedback..." rows={3} className={ta} style={{ ...inpStyle, lineHeight: 1.6 }} /></div>
        <div>
          <p className="text-[10px] text-white/30 mb-2">Maturidade do liderado nesta habilidade</p>
          <div className="grid grid-cols-2 gap-1.5">
            {MATURITY.map(m => (
              <button key={m.id} onClick={() => update({ pesMaturidade: m.id })}
                className="text-left p-2.5 rounded-lg transition-all"
                style={{ background: s.pesMaturidade === m.id ? `${c}18` : 'rgba(0,0,0,0.25)', border: `1px solid ${s.pesMaturidade === m.id ? c + '45' : 'rgba(255,255,255,0.06)'}` }}>
                <p className="text-[10px] font-bold font-mono" style={{ color: s.pesMaturidade === m.id ? c : 'rgba(255,255,255,0.35)' }}>{m.label}</p>
                <p className="text-[9px] text-white/25 mt-0.5 leading-tight">{m.title}</p>
              </button>
            ))}
          </div>
        </div>
        {s.pesGapHabilidade.trim() && selectedMat && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-lg px-3 py-2.5" style={{ background: `${c}08`, border: `1px solid ${c}22` }}>
            <p className="text-[8.5px] font-mono uppercase tracking-widest mb-1.5" style={{ color: c, opacity: 0.7 }}>Script Situacional</p>
            <p className="text-[10.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{selectedMat.script}</p>
            <p className="text-[9px] text-white/20 mt-1 italic">{selectedMat.sub}</p>
          </motion.div>
        )}
      </div>
    )
  }

  // D4 — Disciplina + Health Check de Desbloqueio
  if (id === 3) {
    const hasBloqueio = s.pesBloqueios.trim().length > 0
    const vel = !hasBloqueio || s.pesDesbloqueioHoras === 0 ? null
      : s.pesDesbloqueioHoras <= 24  ? { l: 'alta velocidade', c: TEAL }
      : s.pesDesbloqueioHoras <= 72  ? { l: 'desbloqueio médio', c: AMBER }
      : s.pesDesbloqueioHoras <= 168 ? { l: 'lento', c: RED }
      : { l: 'bloqueio crônico', c: RED }
    return (
      <div className="flex flex-col gap-2.5">
        <p className="text-[10px] text-white/30">Rituais ativos esta semana</p>
        {[
          { l: 'Daily — 15 min / dia', s: 'Fiz, farei, bloqueios' },
          { l: 'Reunião semanal de time', s: 'Metas, prioridades, desbloqueios' },
          { l: 'Retrospectiva mensal', s: 'O que funcionou, o que muda' },
        ].map((r, ri) => (
          <button key={ri} onClick={() => { const arr = [...s.pesRituais]; arr[ri] = !arr[ri]; update({ pesRituais: arr }) }}
            className="flex items-start gap-3 text-left p-3 rounded-lg transition-all"
            style={{ background: s.pesRituais[ri] ? `${c}12` : 'rgba(0,0,0,0.2)', border: `1px solid ${s.pesRituais[ri] ? c + '40' : 'rgba(255,255,255,0.06)'}` }}>
            {s.pesRituais[ri] ? <CheckCircle2 size={14} style={{ color: c, marginTop: 1, flexShrink: 0 }} /> : <Circle size={14} style={{ color: 'rgba(255,255,255,0.15)', marginTop: 1, flexShrink: 0 }} />}
            <div>
              <p className="text-[12px] font-semibold" style={{ color: s.pesRituais[ri] ? c : 'rgba(255,255,255,0.5)' }}>{r.l}</p>
              <p className="text-[10px] text-white/25 mt-0.5">{r.s}</p>
            </div>
          </button>
        ))}
        <div className="mt-1 rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-2.5">Health Check — Desbloqueio</p>
          <div><p className="text-[10px] text-white/30 mb-1.5">Último bloqueio reportado pelo time</p>
            <input value={s.pesBloqueios} onChange={e => update({ pesBloqueios: e.target.value })}
              placeholder="Ex: Acesso ao sistema, aprovação pendente..." className={inp} style={inpStyle} /></div>
          {hasBloqueio && (
            <div className="mt-2.5">
              <p className="text-[10px] text-white/30 mb-1.5">Horas para resolver</p>
              <div className="flex gap-1.5 flex-wrap">
                {[8, 24, 48, 72, 120, 168].map(h => (
                  <button key={h} onClick={() => update({ pesDesbloqueioHoras: h })}
                    className="px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all"
                    style={{ background: s.pesDesbloqueioHoras === h ? `${c}25` : 'rgba(0,0,0,0.3)', border: `1px solid ${s.pesDesbloqueioHoras === h ? c + '50' : 'rgba(255,255,255,0.05)'}`, color: s.pesDesbloqueioHoras === h ? c : 'rgba(255,255,255,0.22)' }}>
                    {h < 24 ? h + 'h' : Math.round(h / 24) + 'd'}
                  </button>
                ))}
              </div>
              {vel && <p className="text-[10px] font-mono font-bold mt-1.5" style={{ color: vel.c }}>Velocidade: {vel.l}</p>}
            </div>
          )}
        </div>
      </div>
    )
  }

  // D5 — NPS Interno de Utilidade (substituiu Excelente/Regular)
  if (id === 4) {
    const npsColor = s.pesNpsUtilidade === 0 ? 'rgba(255,255,255,0.15)'
      : s.pesNpsUtilidade <= 4 ? RED : s.pesNpsUtilidade <= 6 ? AMBER : TEAL
    const npsLabels = ['', 'inutilidade percebida', 'baixíssima utilidade', 'utilidade baixa', 'utilidade limitada',
      'neutro', 'alguma utilidade', 'útil', 'muito útil', 'grande impacto', 'máximo impacto']
    const retention = s.pesNpsUtilidade === 0 ? null
      : s.pesNpsUtilidade <= 4 ? { l: 'risco alto de desengajamento', c: RED }
      : s.pesNpsUtilidade <= 6 ? { l: 'atenção — monitorar', c: AMBER }
      : { l: 'equipe engajada', c: TEAL }
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] text-white/30">NPS Interno de Utilidade</p>
            {s.pesNpsUtilidade > 0 && <span className="text-[9.5px] font-mono" style={{ color: npsColor }}>{npsLabels[s.pesNpsUtilidade]}</span>}
          </div>
          <p className="text-[9px] text-white/20 mb-3 italic">"Sinto que meu trabalho foi útil esta semana?"</p>
          <div className="flex gap-0.5">
            {Array.from({ length: 11 }, (_, i) => i).map(n => {
              const nc = n === 0 ? 'rgba(255,255,255,0.15)' : n <= 4 ? RED : n <= 6 ? AMBER : TEAL
              return (
                <button key={n} onClick={() => update({ pesNpsUtilidade: n })}
                  className="flex-1 py-2 rounded text-[8.5px] font-mono font-black transition-all"
                  style={{ background: s.pesNpsUtilidade === n ? `${nc}28` : 'rgba(0,0,0,0.3)', border: `1px solid ${s.pesNpsUtilidade === n ? nc + '60' : 'rgba(255,255,255,0.05)'}`, color: s.pesNpsUtilidade === n ? nc : 'rgba(255,255,255,0.2)' }}>
                  {n}
                </button>
              )
            })}
          </div>
          {retention && (
            <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <span className="text-[8.5px] font-mono text-white/18 uppercase tracking-wider">Retenção de Talentos</span>
              <span className="text-[9.5px] font-mono font-bold" style={{ color: retention.c }}>{retention.l}</span>
            </div>
          )}
        </div>
        <button onClick={() => update({ pesReconhecimento: !s.pesReconhecimento })}
          className="flex items-center gap-3 p-3 rounded-lg transition-all text-left"
          style={{ background: s.pesReconhecimento ? `${TEAL}12` : 'rgba(0,0,0,0.2)', border: `1px solid ${s.pesReconhecimento ? TEAL + '40' : 'rgba(255,255,255,0.06)'}` }}>
          {s.pesReconhecimento ? <CheckCircle2 size={14} style={{ color: TEAL, flexShrink: 0 }} /> : <Circle size={14} style={{ color: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />}
          <div>
            <p className="text-[12px] font-semibold" style={{ color: s.pesReconhecimento ? TEAL : 'rgba(255,255,255,0.5)' }}>Reconhecimento público feito esta semana</p>
            <p className="text-[10px] text-white/25 mt-0.5">Celebrei resultados e comportamentos que quero repetir</p>
          </div>
        </button>
        <div><p className="text-[10px] text-white/30 mb-1.5">Reflexão de liderança</p>
          <textarea value={s.pesReflexao} onChange={e => update({ pesReflexao: e.target.value })}
            placeholder="O que limitou os resultados? O que eu, como líder, posso mudar?" rows={3}
            className={ta} style={{ ...inpStyle, lineHeight: 1.6 }} /></div>
      </div>
    )
  }

  // D6 — linked to manifesto log
  const now6 = new Date()
  const ms6 = new Date(now6.getFullYear(), now6.getMonth(), 1).toISOString()
  const practicedIds = new Set((s.pesManifLog ?? []).filter(p => p.date >= ms6).map(p => p.principioId))
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[11px] text-white/35 mb-2 leading-relaxed">D6 é o <span style={{ color: RED }}>multiplicador</span> de tudo. Registre no Manifesto abaixo quando praticar cada princípio — o log alimenta este score automaticamente.</p>
      {MANIFESTO.map((m, mi) => {
        const active = practicedIds.has(mi)
        return (
          <div key={mi} className="flex items-start gap-3 p-3 rounded-lg"
            style={{ background: active ? `${m.color}12` : 'rgba(0,0,0,0.2)', border: `1px solid ${active ? m.color + '40' : 'rgba(255,255,255,0.06)'}` }}>
            {active ? <CheckCircle2 size={13} style={{ color: m.color, marginTop: 2, flexShrink: 0 }} /> : <Circle size={13} style={{ color: 'rgba(255,255,255,0.15)', marginTop: 2, flexShrink: 0 }} />}
            <div>
              <p className="text-[11px] font-semibold" style={{ color: active ? m.color : 'rgba(255,255,255,0.45)' }}>{m.num} · {m.title}</p>
              <p className="text-[9.5px] text-white/20 mt-0.5 italic">"{m.ritual}"</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Cross-module type stubs (minimal — only fields we read) ─────────────────
interface OKR { objetivo: string; krs: { texto: string; pct: number }[] }
const COCKPIT_ZERO = { receita: 0, despesas: 0, caixa: 0, clientesAtivos: 0 }
const ADMIN_ZERO = { faseEmpresa: 0, norteStar: '', cultura: '', okrs: [] as OKR[] }
const FASE_LABELS = ['Infra', 'Processo', 'Estratégia', 'Digitização', 'Transformação', 'Nativa']

// ─── IA questions — dynamic, referencing what the user actually filled in ────
function getDimIaQ(id: number, s: PesState): string[] {
  switch (id) {
    case 0: return [
      s.pesMetaEquipe ? `Avalie se esta meta está clara e acionável: "${s.pesMetaEquipe.slice(0, 70)}"` : 'Me ajuda a escrever uma meta trimestral para meu time',
      s.pesKpiEquipe ? `Este KPI mede o que importa? "${s.pesKpiEquipe.slice(0, 60)}"` : 'Como transformar minha meta em um KPI mensurável?',
      'Como conversar com o liderado para medir o alinhamento real sobre a meta?',
    ]
    case 1: return [
      s.pesAcordos.trim().length > 10 ? `Analise estes acordos e aponte risco de não cumprimento: "${s.pesAcordos.slice(0, 120)}"` : 'Me ajuda a estruturar os acordos do próximo 1:1',
      'Como registrar compromissos no 1:1 que garantam execução real?',
      'Que perguntas fazer no 1:1 para identificar bloqueios que o liderado não diz?',
    ]
    case 2: return [
      s.pesGapHabilidade.trim() ? `Como desenvolver esta habilidade no liderado: "${s.pesGapHabilidade.slice(0, 60)}"?` : 'Me ajuda a identificar o principal gap de habilidade do meu time',
      s.pesMaturidade ? `Liderado em ${MATURITY.find(m => m.id === s.pesMaturidade)?.label} — que abordagem usar no dia a dia?` : 'Como identificar o nível de maturidade M1-M4 do meu liderado?',
      'Como montar um plano de desenvolvimento que o liderado realmente vai seguir?',
    ]
    case 3: return [
      s.pesBloqueios.trim() ? `Como resolver este bloqueio rápido: "${s.pesBloqueios.slice(0, 70)}"?` : 'Qual tipo de bloqueio devo eliminar primeiro para liberar a energia do time?',
      'Como fazer a Daily de 15 min sem virar reunião de status?',
      'Minha retrospectiva mensal não engaja o time — o que devo mudar?',
    ]
    case 4: return [
      s.pesNpsUtilidade > 0 && s.pesNpsUtilidade <= 5 ? `NPS Interno em ${s.pesNpsUtilidade}/10 — o que fazer esta semana para reverter?` : 'Como criar senso real de utilidade no trabalho do time?',
      'Como dar reconhecimento que realmente eleva o engajamento?',
      s.pesReflexao.trim() ? `Sobre esta reflexão: "${s.pesReflexao.slice(0, 80)}" — o que me sugere?` : 'Como identificar o que está drenando a energia e utilidade percebida do time?',
    ]
    case 5: return [
      'Qual dos 5 princípios do Manifesto meu time deve praticar primeiro e por quê?',
      'Como introduzir os valores de cultura no dia a dia sem parecer forçado?',
      'Como saber se a cultura de utilidade está sendo vivida ou só declarada?',
    ]
    default: return []
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PessoasLideranca() {
  const { data: s, update } = useWorkspaceData<PesState>('pessoas-lideranca', DEFAULT)
  const { data: snapStore, update: updateSnapStore } = useWorkspaceData<SnapStore>('pessoas-snaps', { snaps: [] })
  const { data: teamStore, update: updateTeamStore } = useWorkspaceData<TeamStore>('pessoas-team', { liderados: [] })
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [iaLoading, setIaLoading] = useState(false)
  const [iaAnswer, setIaAnswer] = useState('')
  const [dimIaLoading, setDimIaLoading] = useState<number | null>(null)
  const [dimIaAnswers, setDimIaAnswers] = useState<Record<number, string>>({})
  const [manifIaLoading, setManifIaLoading] = useState<number | null>(null)
  const [manifIaAnswers, setManifIaAnswers] = useState<Record<number, string>>({})
  const [showClear, setShowClear] = useState(false)
  const [presentMode, setPresentMode] = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'individual' | 'time'>('individual')

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
  const daysSince1a1 = s.pesUltimo1a1
    ? Math.floor((Date.now() - new Date(s.pesUltimo1a1).getTime()) / 86400000)
    : null

  const rawDims = calcRawDims(s)
  const manifLog = s.pesManifLog ?? []
  const practicedThisMonth = getPracticedThisMonth(manifLog)
  const practicedCount = practicedThisMonth.size
  const daysSinceManif = getDaysSinceLastPractice(manifLog)
  const manifEntropia = daysSinceManif !== null && daysSinceManif >= 7
  const manifMetaMensal = 2
  const manifPraticasMes = manifLog.filter(p => {
    const now = new Date(); const ms = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    return p.date >= ms
  }).length
  const index6D = calcIndex6D(rawDims, practicedCount)
  const d6mult = 0.5 + (rawDims[5] / 20) * 1.0
  const pcts = rawDims.map(d => Math.round((d / 20) * 100))
  const overallColor = index6D >= 70 ? TEAL : index6D >= 45 ? AMBER : RED
  const lowestId = pcts.indexOf(Math.min(...pcts))
  const d6Low = rawDims[5] < 8

  // Snap + team derived
  const snaps = snapStore.snaps ?? []
  const liderados = teamStore.liderados ?? []
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

  // Cross-module risk signals
  const riskSignals: { level: 'critical' | 'warn' | 'ok'; msg: string }[] = []
  if (hasFinanceiro && runway < 3 && pcts[1] < 50)
    riskSignals.push({ level: 'critical', msg: `Runway em ${runway} mês${runway === 1 ? '' : 'es'} + D2 (Diálogo) em ${pcts[1]}% — equipe sem informação em crise financeira. Faça 1:1 de contexto esta semana.` })
  if (hasFinanceiro && runway < 6 && d6Low)
    riskSignals.push({ level: 'warn', msg: `Caixa curto (${runway}m) + cultura fraca (D6 ${pcts[5]}%) = combinação de alto risco de churn de talentos.` })
  if (daysSince1a1 !== null && daysSince1a1 > 21 && pcts[4] < 50)
    riskSignals.push({ level: 'critical', msg: `${daysSince1a1} dias sem 1:1 + performance abaixo do esperado (D5 ${pcts[4]}%). Sem diálogo não há liderança.` })
  if (okrs.length > 0 && okrAvgPct < 20 && pcts[0] < 40)
    riskSignals.push({ level: 'warn', msg: `OKRs em ${okrAvgPct}% de progresso + D1 (Direção) em ${pcts[0]}% — equipe sem clareza de onde estamos indo.` })
  if (margem > 0 && margem < 15 && pcts[4] < 60)
    riskSignals.push({ level: 'warn', msg: `Margem apertada (${margem}%) com performance abaixo (D5 ${pcts[4]}%) — o negócio precisa de resultado agora.` })
  // D1 — Ruído de Direção
  if (s.pesNotaLider > 0 && s.pesNotaLiderado > 0 && Math.abs(s.pesNotaLider - s.pesNotaLiderado) > 2)
    riskSignals.push({ level: 'warn', msg: `Ruído de Direção — gap de ${Math.abs(s.pesNotaLider - s.pesNotaLiderado)} pts (Líder ${s.pesNotaLider}/10 · Liderado ${s.pesNotaLiderado}/10). O time não vê a meta com a mesma clareza.` })
  // D2 — Comprometimento fraco detectado via sentiment
  const sentMain = analyzeSentiment(s.pesAcordos)
  if (s.pesAcordos.trim().length > 10 && sentMain.score < 5)
    riskSignals.push({ level: 'critical', msg: `Comprometimento fraco no 1:1 — score ${Math.round(sentMain.score)}/10. Palavras de risco: ${sentMain.weakWords.slice(0, 2).join(', ')}.` })
  // D5 — NPS interno baixo = risco de churn de talento
  if (s.pesNpsUtilidade > 0 && s.pesNpsUtilidade <= 3)
    riskSignals.push({ level: 'critical', msg: `NPS Interno de Utilidade em ${s.pesNpsUtilidade}/10 — alto risco de desengajamento e churn de talentos.` })
  if (s.pesNpsUtilidade >= 4 && s.pesNpsUtilidade <= 5)
    riskSignals.push({ level: 'warn', msg: `NPS Interno em ${s.pesNpsUtilidade}/10 — equipe no limiar. Clareza de propósito e reconhecimento podem reverter.` })

  async function askCoach(q: string) {
    setIaLoading(true); setIaAnswer('')
    try {
      const ctx = [
        `Índice 6D: ${index6D}/100 | D1=${pcts[0]} D2=${pcts[1]} D3=${pcts[2]} D4=${pcts[3]} D5=${pcts[4]} D6=${pcts[5]} (×${d6mult.toFixed(2)})`,
        `Liderados: ${s.pesLiderados || '?'} | Fase empresa: ${faseLabel} | ${practicedCount}/5 princípios do Manifesto praticados`,
        hasFinanceiro ? `Receita: R$${cockpit.receita.toLocaleString('pt-BR')} | Runway: ${runway === 99 ? '∞' : runway + 'm'} | Margem: ${margem}%` : 'Dados financeiros: não preenchidos',
        okrs.length > 0 ? `OKRs (${okrs.length}): progresso médio ${okrAvgPct}% | ${okrs.map(o => o.objetivo).join('; ')}` : 'OKRs: não definidos',
        admin.norteStar ? `Norte Estr.: "${admin.norteStar.slice(0, 120)}"` : '',
        `Meta equipe: ${s.pesMetaEquipe || 'não definida'} | Gap: ${s.pesGapHabilidade || 'não mapeado'}`,
        daysSince1a1 !== null ? `Último 1:1: ${daysSince1a1} dias atrás` : 'Último 1:1: nunca registrado',
      ].filter(Boolean).join(' | ')
      const res = await fetch('/api/advisor-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, marketContext: ctx, role: 'lider' }),
      })
      const j = await res.json()
      setIaAnswer(j.answer ?? '')
    } finally { setIaLoading(false) }
  }

  async function askDimIa(dimId: number, q: string) {
    setDimIaLoading(dimId)
    try {
      const dim = DIMS[dimId]
      const base = `${dim.code} (${dim.label}) score: ${pcts[dimId]}/100 | Índice 6D: ${index6D}/100 | Time: ${s.pesLiderados || '?'} pessoas`
      let ctx = base
      if (dimId === 0)
        ctx = `${base} | Meta: "${s.pesMetaEquipe || 'não definida'}" | KPI: "${s.pesKpiEquipe || 'não definido'}" | Nota Líder: ${s.pesNotaLider || '—'}/10 · Nota Liderado: ${s.pesNotaLiderado || '—'}/10`
      else if (dimId === 1) {
        const diff = s.pesUltimo1a1 ? Math.floor((Date.now() - new Date(s.pesUltimo1a1).getTime()) / 86400000) : null
        const sent = analyzeSentiment(s.pesAcordos)
        ctx = `${base} | Último 1:1: ${diff !== null ? diff + 'd atrás' : 'nunca'} | Acordos: "${s.pesAcordos.slice(0, 150) || 'não registrados'}" | Comprometimento: ${Math.round(sent.score)}/10 (${sent.label || 'não avaliado'})`
      } else if (dimId === 2) {
        const mat = MATURITY.find(m => m.id === s.pesMaturidade)
        ctx = `${base} | Gap: "${s.pesGapHabilidade || 'não mapeado'}" | Plano: "${s.pesPlanoDev.slice(0, 100) || 'não definido'}" | Maturidade: ${mat ? mat.label + ' — ' + mat.title : 'não avaliada'}`
      } else if (dimId === 3) {
        ctx = `${base} | Rituais ativos: ${s.pesRituais.filter(Boolean).length}/3 | Bloqueio: "${s.pesBloqueios || 'não reportado'}" | Desbloqueio: ${s.pesDesbloqueioHoras > 0 ? s.pesDesbloqueioHoras + 'h' : 'não medido'}`
      } else if (dimId === 4) {
        ctx = `${base} | NPS Interno: ${s.pesNpsUtilidade > 0 ? s.pesNpsUtilidade + '/10' : 'não avaliado'} | Reconhecimento: ${s.pesReconhecimento ? 'feito' : 'não feito'} | Reflexão: "${s.pesReflexao.slice(0, 100) || 'não registrada'}"`
      } else if (dimId === 5) {
        ctx = `${base} | Princípios praticados este mês: ${practicedCount}/5 | Multiplicador D6: ×${d6mult.toFixed(2)}`
      }
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
      const ctx = [
        `Manifesto princípio ${mi + 1}: ${MANIFESTO[mi].title} | Praticado este mês: ${practicedThisMonth.has(mi) ? 'sim' : 'não'} | Total práticas: ${manifLog.filter(p => p.principioId === mi).length}x`,
        `Índice 6D: ${index6D}/100 | D6 mult ×${d6mult.toFixed(2)} | ${practicedCount}/5 princípios ativos`,
        `Time: ${s.pesLiderados || '?'} pessoas | Fase: ${faseLabel}`,
        daysSince1a1 !== null ? `Último 1:1: ${daysSince1a1}d atrás` : 'Último 1:1: nunca',
        s.pesNpsUtilidade > 0 ? `NPS Interno: ${s.pesNpsUtilidade}/10` : '',
        s.pesBloqueios.trim() ? `Bloqueio atual: "${s.pesBloqueios.slice(0, 80)}"` : '',
        s.pesGapHabilidade.trim() ? `Gap de habilidade: "${s.pesGapHabilidade.slice(0, 80)}"` : '',
        s.pesAcordos.trim() ? `Acordos 1:1: "${s.pesAcordos.slice(0, 100)}"` : '',
      ].filter(Boolean).join(' | ')
      const res = await fetch('/api/advisor-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, marketContext: ctx, role: 'lider' }),
      })
      const j = await res.json()
      setManifIaAnswers(prev => ({ ...prev, [mi]: j.answer ?? '' }))
    } finally { setManifIaLoading(null) }
  }

  // Auto-generate contextual IA alert
  const autoAlert = (() => {
    if (d6Low && index6D < 40) return { level: 'critical', msg: `Alerta de Entropia Cultural — D6 (Dignidade) está em ${pcts[5]}%. Com multiplicador ×${d6mult.toFixed(2)}, todos os outros esforços são reduzidos à metade. Aplique o Manifesto antes de cobrar resultado.` }
    if (d6Low) return { level: 'warn', msg: `D6 baixo (${pcts[5]}%) está drenando o índice. Pratique os princípios do Manifesto para elevar o multiplicador acima de ×1.0.` }
    if (index6D < 30) return { level: 'critical', msg: `Índice crítico. Dimensão mais fraca: ${DIMS[lowestId].label} (${pcts[lowestId]}%). Foque aqui primeiro.` }
    if (index6D >= 80) return { level: 'ok', msg: `Liderança em alta performance (${index6D}/100). Multiplicador D6 ×${d6mult.toFixed(2)} potencializando o time.` }
    return { level: 'info', msg: `Dimensão mais fraca: ${DIMS[lowestId].label} (${pcts[lowestId]}%). Melhorar este ponto tem o maior impacto no índice agora.` }
  })()

  // ── Presentation Mode — Analytical Dashboard ─────────────────────────────
  const dashActions = (() => {
    const acts: { priority: 'urgente' | 'alta' | 'media'; action: string; why: string }[] = []
    // 1:1 cadence
    if (daysSince1a1 !== null && daysSince1a1 > 14)
      acts.push({ priority: 'urgente', action: 'Agende 1:1 hoje — cadência quebrada', why: `${daysSince1a1} dias sem conversa individual com o time` })
    // NPS churn risk
    if (s.pesNpsUtilidade > 0 && s.pesNpsUtilidade <= 4)
      acts.push({ priority: 'urgente', action: 'Conversa de propósito + reconhecimento formal', why: `NPS Interno ${s.pesNpsUtilidade}/10 — risco real de perder talentos` })
    // Commitment sentiment
    if (s.pesAcordos.trim().length > 10 && sentMain.score < 5)
      acts.push({ priority: 'alta', action: 'Revise e reescreva os acordos do último 1:1', why: `Comprometimento fraco detectado — score ${Math.round(sentMain.score)}/10` })
    // Lowest dimension action
    const lowestPct = pcts[lowestId]
    if (lowestPct < 60) {
      const dimActionMap: Record<number, string> = {
        0: 'Alinhe meta e KPI — escreva em conjunto com o liderado',
        1: 'Estruture próximo 1:1 com acordos escritos e prazo',
        2: 'Defina plano de desenvolvimento para o gap mapeado',
        3: 'Elimine o bloqueio reportado e ative os rituais de equipe',
        4: 'Aplique reconhecimento explícito — nomeie o comportamento específico',
        5: 'Pratique os princípios do Manifesto — comece por dignidade',
      }
      acts.push({ priority: lowestPct < 35 ? 'urgente' : 'alta', action: dimActionMap[lowestId], why: `${DIMS[lowestId].label} em ${lowestPct}% — dimensão mais fraca do sistema` })
    }
    // Financial cross-signal
    if (hasFinanceiro && runway < 6)
      acts.push({ priority: runway < 3 ? 'urgente' : 'alta', action: 'Contextualize o time sobre a saúde financeira', why: `Runway ${runway === 99 ? '∞' : runway + 'm'} exige liderança transparente — silêncio aumenta ansiedade` })
    // D1 gap
    if (s.pesNotaLider > 0 && s.pesNotaLiderado > 0 && Math.abs(s.pesNotaLider - s.pesNotaLiderado) > 2)
      acts.push({ priority: 'media', action: 'Conversa de alinhamento sobre a meta com o time', why: `Gap de percepção: você vê ${s.pesNotaLider}/10, liderado vê ${s.pesNotaLiderado}/10` })
    // D6 multiplier drag
    if (d6Low)
      acts.push({ priority: 'media', action: 'Revise o Manifesto e escolha 1 princípio para praticar esta semana', why: `D6 (Dignidade) em ${pcts[5]}% — multiplicador ×${d6mult.toFixed(2)} reduzindo todo o índice` })
    return acts.slice(0, 4)
  })()

  if (presentMode) {
    const hasTeam = liderados.filter(l => l.nome.trim()).length > 0
    const slides = [
      'capa',
      'acoes',
      'diagnostico',
      'negocios',
      ...(hasTeam ? ['time'] : []),
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
                <p className="text-[10px] font-mono text-white/20 mt-0.5">{faseLabel} · {s.pesLiderados > 0 ? `${s.pesLiderados} pessoa${s.pesLiderados > 1 ? 's' : ''}` : 'sem equipe definida'}</p>
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
                  const c = pct < 40 ? RED : pct < 65 ? AMBER : d.color
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
                const c = pct < 40 ? RED : pct < 65 ? AMBER : d.color
                return (
                  <div key={d.id} className="rounded-xl px-3 py-2.5 flex items-center gap-3"
                    style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${c}18` }}>
                    <span className="text-[10px] font-mono w-6 shrink-0" style={{ color: d.color, opacity: 0.6 }}>{d.code}</span>
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
                { label: 'NPS Interno', value: s.pesNpsUtilidade > 0 ? String(s.pesNpsUtilidade) : '—', unit: s.pesNpsUtilidade > 0 ? '/10' : '', color: s.pesNpsUtilidade <= 0 ? 'rgba(255,255,255,0.15)' : s.pesNpsUtilidade <= 4 ? RED : s.pesNpsUtilidade <= 6 ? AMBER : TEAL, sub: s.pesNpsUtilidade <= 0 ? 'Não avaliado' : s.pesNpsUtilidade <= 4 ? 'Risco alto de churn' : s.pesNpsUtilidade <= 6 ? 'Equipe no limiar' : 'Equipe engajada' },
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

          {/* ══ SLIDE: TIME ══ */}
          {curSlide === 'time' && (<>
            <div>
              <p className="text-[8px] font-mono tracking-[0.22em] text-white/18 uppercase">Slide 5 — Time</p>
              <p className="text-[18px] font-bold text-white/80 mt-1">Análise Individual</p>
            </div>

            <div className="flex flex-col gap-2">
              {liderados.filter(l => l.nome.trim()).map(l => {
                const lScore = calcIndex6D(l.scores, 0)
                const lColor = lScore >= 70 ? TEAL : lScore >= 45 ? AMBER : RED
                const lLowest = l.scores.indexOf(Math.min(...l.scores))
                return (
                  <div key={l.id} className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${lColor}20` }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[13px] font-bold text-white/70">{l.nome}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-white/22">foco: {DIMS[lLowest]?.label}</span>
                        <span className="text-[22px] font-black font-mono" style={{ color: lColor }}>{lScore}</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      {l.scores.map((sc, si) => {
                        const dp = Math.round((sc / 20) * 100)
                        const dc = dp < 40 ? RED : dp < 65 ? AMBER : DIM_COLORS[si]
                        return (
                          <div key={si} className="flex-1 flex flex-col items-center gap-0.5">
                            <div className="w-full h-10 rounded-lg flex flex-col justify-end overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                              <motion.div className="w-full rounded-lg"
                                style={{ height: `${dp}%`, background: dc, opacity: 0.8 }}
                                initial={{ scaleY: 0, originY: 1 }} animate={{ scaleY: 1 }} transition={{ duration: 0.4, delay: si * 0.05 }} />
                            </div>
                            <span className="text-[7.5px] font-mono" style={{ color: DIM_COLORS[si], opacity: 0.55 }}>{DIMS[si].code}</span>
                            <span className="text-[9px] font-bold font-mono" style={{ color: dc }}>{dp}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
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

        {/* Fase + 1:1 */}
        <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wider mb-1">Fase · 1:1</p>
          <p className="text-[13px] font-black text-white/60 leading-none">{faseLabel}</p>
          <p className="text-[9px] mt-1" style={{ color: daysSince1a1 === null ? 'rgba(255,255,255,0.2)' : daysSince1a1 > 14 ? RED : daysSince1a1 > 7 ? AMBER : TEAL }}>
            {daysSince1a1 === null ? '1:1 nunca registrado' : daysSince1a1 === 0 ? '1:1 hoje' : `1:1 ${daysSince1a1}d atrás`}
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

      {/* ── Tab toggle: Individual / Time ── */}
      <div className="flex gap-1.5">
        {(['individual', 'time'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="flex-1 py-2 rounded-xl text-[11px] font-bold font-mono transition-all"
            style={{ background: activeTab === tab ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.2)', border: `1px solid ${activeTab === tab ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.05)'}`, color: activeTab === tab ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)' }}>
            {tab === 'individual' ? 'Individual' : 'Time'}
          </button>
        ))}
      </div>

      {/* ── Time Tab ── */}
      {activeTab === 'time' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-[14px] font-black text-white/70">Liderados</p>
            <button onClick={() => updateTeamStore({ liderados: [...liderados, { id: Date.now().toString(), nome: '', cargo: '', maturidade: 0, ultimo1a1: '', acordos: [], sbiFeedbacks: [], notas: '' }] })}
              className="text-[10px] font-mono px-2.5 py-1 rounded-lg"
              style={{ background: `${TEAL}15`, color: TEAL, border: `1px solid ${TEAL}30` }}>
              + pessoa
            </button>
          </div>

          {liderados.length === 0 && (
            <div className="rounded-xl px-4 py-8 text-center" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[11px] text-white/25">Adicione seus liderados para acompanhar 1:1s,<br/>acordos e desenvolvimento individual</p>
            </div>
          )}

          {liderados.map((l, li) => {
            const daysl1a1 = l.ultimo1a1 ? Math.floor((Date.now() - new Date(l.ultimo1a1).getTime()) / 86400000) : null
            const l1a1Color = daysl1a1 === null ? 'rgba(255,255,255,0.2)' : daysl1a1 > 14 ? RED : daysl1a1 > 7 ? AMBER : TEAL
            const mat = MATURITY.find(m => m.id === l.maturidade)
            const acordosPend = (l.acordos ?? []).filter(a => !a.feito).length
            const updateL = (patch: Partial<Liderado>) => { const u = liderados.map((x, i) => i === li ? { ...x, ...patch } : x); updateTeamStore({ liderados: u }) }

            return (
              <div key={l.id} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {/* Person header */}
                <div className="px-4 pt-4 pb-3 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <input value={l.nome} onChange={e => updateL({ nome: e.target.value })}
                      placeholder="Nome do liderado" className="text-[14px] font-bold bg-transparent outline-none text-white/75 w-full"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }} />
                    <input value={l.cargo} onChange={e => updateL({ cargo: e.target.value })}
                      placeholder="Cargo / função" className="text-[11px] bg-transparent outline-none text-white/30 w-full mt-1" />
                  </div>
                  <button onClick={() => updateTeamStore({ liderados: liderados.filter((_, i) => i !== li) })}
                    className="text-[11px] text-white/15 hover:text-red-400 mt-0.5">×</button>
                </div>

                {/* Signal strip */}
                <div className="grid grid-cols-3 gap-px mx-4 mb-3">
                  {/* Maturidade */}
                  <div className="rounded-lg px-2.5 py-2" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <p className="text-[7.5px] font-mono text-white/20 uppercase mb-1">Maturidade</p>
                    <div className="flex gap-1">
                      {MATURITY.map(m => (
                        <button key={m.id} onClick={() => updateL({ maturidade: l.maturidade === m.id ? 0 : m.id })}
                          className="flex-1 py-0.5 rounded text-[8px] font-mono font-bold transition-all"
                          style={{ background: l.maturidade === m.id ? `${TEAL}25` : 'rgba(255,255,255,0.04)', color: l.maturidade === m.id ? TEAL : 'rgba(255,255,255,0.2)', border: `1px solid ${l.maturidade === m.id ? TEAL + '40' : 'rgba(255,255,255,0.06)'}` }}>
                          {m.label}
                        </button>
                      ))}
                    </div>
                    {mat && <p className="text-[8px] text-white/20 mt-1 truncate">{mat.title}</p>}
                  </div>

                  {/* Último 1:1 */}
                  <div className="rounded-lg px-2.5 py-2" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <p className="text-[7.5px] font-mono text-white/20 uppercase mb-1">Último 1:1</p>
                    <input type="date" value={l.ultimo1a1} onChange={e => updateL({ ultimo1a1: e.target.value })}
                      className="text-[9px] bg-transparent outline-none font-mono w-full"
                      style={{ color: l1a1Color }} />
                    <p className="text-[8px] mt-0.5" style={{ color: l1a1Color }}>
                      {daysl1a1 === null ? 'nunca' : daysl1a1 === 0 ? 'hoje' : `${daysl1a1}d atrás`}
                    </p>
                  </div>

                  {/* Acordos */}
                  <div className="rounded-lg px-2.5 py-2" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <p className="text-[7.5px] font-mono text-white/20 uppercase mb-1">Acordos</p>
                    <p className="text-[18px] font-black font-mono leading-none" style={{ color: acordosPend > 0 ? AMBER : 'rgba(255,255,255,0.2)' }}>{acordosPend}</p>
                    <p className="text-[8px] text-white/20">pendentes</p>
                  </div>
                </div>

                {/* Estratégia M1-M4 */}
                {mat && (
                  <div className="mx-4 mb-3 rounded-lg px-3 py-2" style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}15` }}>
                    <p className="text-[9px] font-mono" style={{ color: TEAL, opacity: 0.7 }}>{mat.script}</p>
                  </div>
                )}

                {/* Acordos list */}
                <div className="mx-4 mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wider">Acordos</p>
                    <button onClick={() => updateL({ acordos: [...(l.acordos ?? []), { id: Date.now().toString(), texto: '', prazo: '', feito: false }] })}
                      className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                      style={{ color: TEAL, border: `1px solid ${TEAL}25`, background: `${TEAL}08` }}>+ acordo</button>
                  </div>
                  {(l.acordos ?? []).map((a, ai) => (
                    <div key={a.id} className="flex items-center gap-2 mb-1.5">
                      <button onClick={() => { const ac = [...(l.acordos ?? [])]; ac[ai] = { ...a, feito: !a.feito }; updateL({ acordos: ac }) }}
                        style={{ color: a.feito ? TEAL : 'rgba(255,255,255,0.2)', flexShrink: 0 }}>
                        {a.feito ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                      </button>
                      <input value={a.texto} onChange={e => { const ac = [...(l.acordos ?? [])]; ac[ai] = { ...a, texto: e.target.value }; updateL({ acordos: ac }) }}
                        placeholder="Acordo / compromisso..."
                        className="flex-1 text-[10.5px] bg-transparent outline-none min-w-0"
                        style={{ color: a.feito ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.55)', textDecoration: a.feito ? 'line-through' : 'none' }} />
                      <input type="date" value={a.prazo} onChange={e => { const ac = [...(l.acordos ?? [])]; ac[ai] = { ...a, prazo: e.target.value }; updateL({ acordos: ac }) }}
                        className="text-[9px] font-mono bg-transparent outline-none w-24 shrink-0"
                        style={{ color: 'rgba(255,255,255,0.2)' }} />
                      <button onClick={() => updateL({ acordos: (l.acordos ?? []).filter((_, i) => i !== ai) })}
                        className="text-[10px] text-white/10 hover:text-red-400 shrink-0">×</button>
                    </div>
                  ))}
                </div>

                {/* Feedback SBI */}
                <div className="mx-4 mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wider">Feedback SBI</p>
                    <button onClick={() => updateL({ sbiFeedbacks: [...(l.sbiFeedbacks ?? []), { id: Date.now().toString(), date: new Date().toISOString().split('T')[0], situacao: '', comportamento: '', impacto: '' }] })}
                      className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                      style={{ color: BLUE, border: `1px solid ${BLUE}25`, background: `${BLUE}08` }}>+ feedback</button>
                  </div>
                  {(l.sbiFeedbacks ?? []).slice(-2).map((fb, fi) => (
                    <div key={fb.id} className="rounded-lg p-2.5 mb-1.5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[8px] font-mono text-white/20">{fb.date}</span>
                        <button onClick={() => updateL({ sbiFeedbacks: (l.sbiFeedbacks ?? []).filter(f => f.id !== fb.id) })} className="text-[9px] text-white/10 hover:text-red-400">×</button>
                      </div>
                      {(['situacao', 'comportamento', 'impacto'] as const).map((field, fi2) => (
                        <div key={field} className="flex items-start gap-1.5 mb-1">
                          <span className="text-[7.5px] font-mono uppercase shrink-0 mt-0.5 w-16" style={{ color: BLUE, opacity: 0.6 }}>{field === 'situacao' ? 'situação' : field === 'comportamento' ? 'comportamento' : 'impacto'}</span>
                          <input value={fb[field]} onChange={e => { const fbs = [...(l.sbiFeedbacks ?? [])]; const idx = fbs.findIndex(f => f.id === fb.id); if (idx >= 0) { fbs[idx] = { ...fbs[idx], [field]: e.target.value }; updateL({ sbiFeedbacks: fbs }) } }}
                            className="flex-1 text-[10px] bg-transparent outline-none text-white/50 min-w-0"
                            placeholder={field === 'situacao' ? 'Em qual contexto...' : field === 'comportamento' ? 'Você fez / disse...' : 'O efeito foi...'} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* IA por pessoa */}
                <div className="mx-4 mb-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex flex-col gap-1.5">
                    {[
                      mat ? `${l.nome || 'Este liderado'} está em ${mat.label} — como aplicar ${mat.script.split(':')[0]}?` : `Como identificar o nível de maturidade de ${l.nome || 'este liderado'}?`,
                      daysl1a1 !== null && daysl1a1 > 7 ? `${daysl1a1} dias sem 1:1 com ${l.nome || 'este liderado'} — como retomar?` : `Como preparar o próximo 1:1 com ${l.nome || 'este liderado'}?`,
                      acordosPend > 0 ? `${acordosPend} acordo${acordosPend > 1 ? 's' : ''} pendente${acordosPend > 1 ? 's' : ''} com ${l.nome || 'este liderado'} — como garantir o cumprimento?` : `Como criar acordos que ${l.nome || 'este liderado'} realmente vai cumprir?`,
                    ].slice(0, 2).map(q => (
                      <button key={q} onClick={() => askManifIa(-1 - li, q)}
                        className="text-left px-3 py-2 rounded-lg text-[10px] font-mono leading-snug"
                        style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}18`, color: TEAL, opacity: 0.75 }}>
                        › {q}
                      </button>
                    ))}
                  </div>
                  {manifIaLoading === -1 - li && (
                    <div className="flex items-center gap-2 mt-2">
                      <Loader2 size={10} style={{ color: TEAL }} className="animate-spin" />
                      <span className="text-[9.5px] font-mono" style={{ color: TEAL, opacity: 0.6 }}>analisando...</span>
                    </div>
                  )}
                  {manifIaAnswers[-1 - li] && manifIaLoading !== -1 - li && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg px-3 py-2.5 mt-2"
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <p className="text-[11px] text-white/60 leading-relaxed whitespace-pre-wrap">{manifIaAnswers[-1 - li]}</p>
                    </motion.div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Individual content ── */}
      {activeTab === 'individual' && (<>
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="pt-5 pb-3 flex flex-col items-center gap-1">
          <EnergyOrb score={index6D} d6mult={d6mult} />
          <p className="text-[9.5px] font-mono text-white/18 text-center px-6 leading-relaxed">
            Score = (D1+D2+D3+D4+D5) × D6<sub className="text-[8px]">mult</sub> + Bônus Manifesto
          </p>
        </div>

        {/* Particle field */}
        <div className="px-3 pb-3">
          <ParticleField score={index6D} />
        </div>

        {/* Liderados — compact inline */}
        <div className="flex items-start gap-2 px-4 pb-4">
          <p className="text-[9px] font-mono text-white/18 uppercase tracking-wider shrink-0 mt-2">Time</p>
          <div className="flex gap-1.5 flex-wrap flex-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map(n => (
              <button key={n} onClick={() => update({ pesLiderados: n })}
                className="w-7 h-7 rounded-md text-[10px] font-mono font-bold transition-all"
                style={{ background: s.pesLiderados === n ? `${TEAL}28` : 'rgba(255,255,255,0.03)', border: `1px solid ${s.pesLiderados === n ? TEAL + '60' : 'rgba(255,255,255,0.06)'}`, color: s.pesLiderados === n ? TEAL : 'rgba(255,255,255,0.2)' }}>
                {n}
              </button>
            ))}
            <input
              type="number" min={1} max={999}
              placeholder="outro"
              value={s.pesLiderados > 20 ? s.pesLiderados : ''}
              onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v) && v > 0) update({ pesLiderados: v }) }}
              className="w-14 h-7 rounded-md text-[10px] font-mono outline-none text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }} />
          </div>
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
          MANIFESTO — Log + IA + Dashboard
          ════════════════════════════════════ */}
      <div>
        {/* Header com dashboard de contagem */}
        <div className="px-1 mb-4">
          <p className="text-[9px] font-mono tracking-[0.25em] text-white/18 uppercase mb-1">Código de Cultura · D6</p>
          <div className="flex items-end gap-3">
            <h2 className="text-[17px] font-black text-white/80 leading-tight">Manifesto de Liderança</h2>
            <div className="flex flex-col items-end mb-0.5">
              <span className="text-[18px] font-black font-mono leading-none" style={{ color: d6Low ? RED : d6mult >= 1.3 ? TEAL : AMBER }}>
                ×{d6mult.toFixed(2)}
              </span>
              <span className="text-[8px] font-mono text-white/20">{practicedCount}/5 este mês</span>
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

          {/* Métricas do mês */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="rounded-lg px-2.5 py-2" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[7.5px] font-mono text-white/18 uppercase mb-0.5">Práticas/mês</p>
              <div className="flex items-end gap-1">
                <span className="text-[20px] font-black font-mono leading-none" style={{ color: manifPraticasMes >= manifMetaMensal ? TEAL : AMBER }}>{manifPraticasMes}</span>
                <span className="text-[9px] font-mono text-white/20 pb-0.5">/{manifMetaMensal} meta</span>
              </div>
            </div>
            <div className="rounded-lg px-2.5 py-2" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[7.5px] font-mono text-white/18 uppercase mb-0.5">Última prática</p>
              <span className="text-[13px] font-black font-mono leading-none" style={{ color: manifEntropia ? RED : daysSinceManif === null ? 'rgba(255,255,255,0.2)' : TEAL }}>
                {daysSinceManif === null ? '—' : daysSinceManif === 0 ? 'hoje' : `${daysSinceManif}d`}
              </span>
            </div>
            <div className="rounded-lg px-2.5 py-2" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[7.5px] font-mono text-white/18 uppercase mb-0.5">Total log</p>
              <span className="text-[20px] font-black font-mono leading-none text-white/40">{manifLog.length}</span>
            </div>
          </div>

          {/* Entropia alert */}
          {manifEntropia && (
            <div className="mt-2 rounded-lg px-3 py-2 flex items-start gap-2" style={{ background: `${RED}0c`, border: `1px solid ${RED}30` }}>
              <AlertTriangle size={11} style={{ color: RED, marginTop: 1, flexShrink: 0 }} />
              <p className="text-[10px] leading-relaxed" style={{ color: RED, opacity: 0.8 }}>
                {daysSinceManif}d sem praticar o Manifesto — sistema operando no modo sobrevivência. Cultura se deteriora sem rituais.
              </p>
            </div>
          )}

          {/* Incoerência detectada */}
          {practicedCount > 0 && pcts[1] < 40 && (
            <div className="mt-2 rounded-lg px-3 py-2" style={{ background: `${AMBER}08`, border: `1px solid ${AMBER}25` }}>
              <p className="text-[9.5px] leading-relaxed" style={{ color: AMBER, opacity: 0.8 }}>
                Incoerência detectada — {practicedCount} princípio{practicedCount > 1 ? 's' : ''} marcado{practicedCount > 1 ? 's' : ''} mas D2 (Diálogo) em {pcts[1]}%. O manifesto não está chegando no time via conversas reais.
              </p>
            </div>
          )}
        </div>

        {/* Princípios */}
        <div className="relative flex flex-col">
          <div className="absolute left-5 top-5 bottom-5 w-px" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.02))' }} />

          {MANIFESTO.map((m, mi) => {
            const practiced = practicedThisMonth.has(mi)
            const praticasTotal = manifLog.filter(p => p.principioId === mi).length
            const manifQs = (() => {
              const nps = s.pesNpsUtilidade
              const gap = s.pesGapHabilidade.trim()
              const bloq = s.pesBloqueios.trim()
              const acord = s.pesAcordos.trim()
              if (mi === 0) return [
                s.pesMetaEquipe.trim() ? `Como conectar a meta "${s.pesMetaEquipe.slice(0,45)}" com propósito real para o time?` : 'Como fazer o time ver o impacto real do trabalho deles no dia a dia?',
                'Como aplicar a pergunta "a quem isso serve?" antes de cada reunião?',
              ]
              if (mi === 1) return [
                nps > 0 && nps <= 6 ? `NPS Interno em ${nps}/10 — o que está bloqueando o propósito do time?` : 'Como descobrir o que realmente motiva cada pessoa individualmente?',
                'Como ter a conversa de propósito sem parecer superficial?',
              ]
              if (mi === 2) return [
                bloq.trim() ? `Bloqueio atual: "${bloq.slice(0,50)}" — como remover esta semana como facilitador?` : 'Como criar o hábito de perguntar "o que está te travando?" em cada 1:1?',
                gap ? `Gap de habilidade: "${gap.slice(0,50)}" — como apoiar sem fazer pelo liderado?` : 'Como liderar com facilitação em vez de cobrança?',
              ]
              if (mi === 3) return [
                s.pesReconhecimento ? 'Como tornar o reconhecimento público específico e genuíno — não genérico?' : 'Como reconhecer uma entrega concreta desta semana de forma que impacte?',
                'Como calibrar o que é "ir além do esperado" no contexto atual do negócio?',
              ]
              return [
                acord ? `Acordos do 1:1: "${acord.slice(0,50)}" — como garantir que sejam honrados?` : 'Como criar acordos no 1:1 que as pessoas realmente cumprem?',
                daysSince1a1 !== null && daysSince1a1 > 0 ? `${daysSince1a1} dias desde o último 1:1 — como estruturar a próxima retrospectiva?` : 'Como iniciar retrospectiva mensal sem burocracia?',
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

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      {praticasTotal > 0 && (
                        <span className="text-[8px] font-mono text-white/22">{praticasTotal}× praticado</span>
                      )}
                      {practiced && (
                        <span className="text-[8px] font-mono flex items-center gap-1" style={{ color: m.color, opacity: 0.7 }}>
                          <CheckCircle2 size={9} /> este mês
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => update({ pesManifLog: [...manifLog, { principioId: mi, date: new Date().toISOString(), serviuPara: '' }] })}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9.5px] font-bold font-mono transition-all uppercase tracking-wider"
                      style={{ background: `${m.color}18`, border: `1px solid ${m.color}40`, color: m.color }}>
                      + registrar prática
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {manifLog.length > 0 && (
          <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wider mb-2">Histórico de práticas</p>
            <div className="flex flex-col gap-1">
              {[...manifLog].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6).map((p, i) => {
                const d = new Date(p.date)
                const label = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
                const mc = MANIFESTO[p.principioId]
                return (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-[8px] font-mono text-white/18 w-24 shrink-0">{label}</span>
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: mc?.color ?? TEAL }} />
                    <span className="text-[9.5px] text-white/40 flex-1 truncate">{mc?.title ?? `P0${p.principioId + 1}`}</span>
                    <button onClick={() => update({ pesManifLog: manifLog.filter((_, ii) => ii !== manifLog.findIndex(x => x === p)) })}
                      className="text-[9px] text-white/10 hover:text-red-400 shrink-0">×</button>
                  </div>
                )
              })}
            </div>
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
                    <ArcGauge pct={pct} color={d.color} size={52} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[12px] font-black font-mono leading-none" style={{ color: d.color }}>{pct}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-[9px] font-mono font-bold" style={{ color: d.color, opacity: 0.55 }}>{d.code}</p>
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
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded" style={{ background: `${DIM_COLORS[activeCard]}20`, color: DIM_COLORS[activeCard] }}>{DIMS[activeCard].code}</span>
                <span className="text-[13px] font-bold" style={{ color: DIM_COLORS[activeCard] }}>{DIMS[activeCard].label}</span>
                <span className="text-[11px] font-mono font-black ml-auto" style={{ color: DIM_COLORS[activeCard] }}>{pcts[activeCard]}/100</span>
              </div>
              <DimPanel id={activeCard} s={s} update={update} />

              {/* IA por dimensão */}
              <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Brain size={11} style={{ color: TEAL }} />
                  <span className="text-[9.5px] font-mono text-white/30">IA pode ajudar nesta dimensão</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {getDimIaQ(activeCard, s).map(q => (
                    <button key={q} onClick={() => askDimIa(activeCard, q)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all"
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

      </>)}

    </div>
  )
}
