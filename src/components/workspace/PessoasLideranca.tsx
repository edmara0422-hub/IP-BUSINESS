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

// ─── State ───────────────────────────────────────────────────────────────────
interface PesState {
  pesLiderados: number
  pesMetaEquipe: string; pesKpiEquipe: string
  pesUltimo1a1: string; pesAcordos: string
  pesGapHabilidade: string; pesPlanoDev: string
  pesRituais: boolean[]
  pesPerfScore: number; pesReconhecimento: boolean; pesReflexao: string
  pesDig: boolean[]
}

const DEFAULT: PesState = {
  pesLiderados: 0, pesMetaEquipe: '', pesKpiEquipe: '',
  pesUltimo1a1: '', pesAcordos: '',
  pesGapHabilidade: '', pesPlanoDev: '',
  pesRituais: [false, false, false],
  pesPerfScore: 0, pesReconhecimento: false, pesReflexao: '',
  pesDig: [false, false, false, false, false],
}

// ─── Vector score engine (D6 multiplies D1–D5) ───────────────────────────────
// Each raw D: 0–20 pts — mirrors the Python/FastAPI model
function calcRawDims(s: PesState): number[] {
  const d1 = (s.pesMetaEquipe.trim() ? 10 : 0) + (s.pesKpiEquipe.trim() ? 10 : 0)

  let d2date = 0
  if (s.pesUltimo1a1) {
    const diff = Math.floor((Date.now() - new Date(s.pesUltimo1a1).getTime()) / 86400000)
    d2date = diff <= 7 ? 10 : diff <= 14 ? 6 : 2
  }
  const d2 = Math.min(20, d2date + (s.pesAcordos.trim() ? 10 : 0))

  const d3 = (s.pesGapHabilidade.trim() ? 10 : 0) + (s.pesPlanoDev.trim() ? 10 : 0)
  const d4 = Math.round((s.pesRituais.filter(Boolean).length / 3) * 20)

  const perfMap = [0, 5, 11, 16, 20]
  const d5 = Math.min(20, (perfMap[s.pesPerfScore] ?? 0) + (s.pesReconhecimento && s.pesPerfScore > 0 ? 4 : 0))

  const practiced = (s.pesDig ?? []).filter(Boolean).length
  const d6 = Math.round((practiced / 5) * 20)

  return [d1, d2, d3, d4, d5, d6]
}

function calcIndex6D(dims: number[], practicedCount: number): number {
  const [d1, d2, d3, d4, d5, d6] = dims
  const base = d1 + d2 + d3 + d4 + d5              // 0–100
  const mult = 0.5 + (d6 / 20) * 1.0               // interp [0,20] → [0.5, 1.5]
  const bonus = (practicedCount / 5) * 10           // up to +10
  return Math.min(100, Math.round(base * mult + bonus))
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

// ─── Dim panel inputs ─────────────────────────────────────────────────────────
function DimPanel({ id, s, update }: { id: number; s: PesState; update: (p: Partial<PesState>) => void }) {
  const c = DIM_COLORS[id]
  const inp = `w-full rounded-lg px-3 py-2.5 text-[12px] outline-none`
  const inpStyle = { background: 'rgba(0,0,0,0.4)', border: `1px solid ${c}25`, color: 'rgba(255,255,255,0.8)' }
  const ta = `${inp} resize-none`

  if (id === 0) return (
    <div className="flex flex-col gap-3">
      <div><p className="text-[10px] text-white/30 mb-1.5">Meta da equipe para o trimestre</p>
        <input value={s.pesMetaEquipe} onChange={e => update({ pesMetaEquipe: e.target.value })}
          placeholder="Ex: Fechar 10 contratos até 30/06" className={inp} style={inpStyle} /></div>
      <div><p className="text-[10px] text-white/30 mb-1.5">KPI principal — como medir?</p>
        <input value={s.pesKpiEquipe} onChange={e => update({ pesKpiEquipe: e.target.value })}
          placeholder="Ex: Conversão ≥ 25% | NPS ≥ 70" className={inp} style={inpStyle} /></div>
      {!s.pesMetaEquipe && <p className="text-[11px] px-3 py-2 rounded-lg" style={{ background: `${c}08`, border: `1px solid ${c}20`, color: c }}>Sem meta clara não há liderança — há apenas gerenciamento de agenda.</p>}
    </div>
  )

  if (id === 1) return (
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
      <div><p className="text-[10px] text-white/30 mb-1.5">Acordos e compromissos</p>
        <textarea value={s.pesAcordos} onChange={e => update({ pesAcordos: e.target.value })}
          placeholder="O que ficou combinado? Quem faz o quê?" rows={3} className={ta} style={{ ...inpStyle, lineHeight: 1.6 }} /></div>
    </div>
  )

  if (id === 2) return (
    <div className="flex flex-col gap-3">
      <div><p className="text-[10px] text-white/30 mb-1.5">Principal gap de habilidade do time</p>
        <input value={s.pesGapHabilidade} onChange={e => update({ pesGapHabilidade: e.target.value })}
          placeholder="Ex: Negociação, produto, gestão do tempo..." className={inp} style={inpStyle} /></div>
      <div><p className="text-[10px] text-white/30 mb-1.5">Plano de desenvolvimento ativo</p>
        <textarea value={s.pesPlanoDev} onChange={e => update({ pesPlanoDev: e.target.value })}
          placeholder="Curso, shadowing, leitura, feedback..." rows={3} className={ta} style={{ ...inpStyle, lineHeight: 1.6 }} /></div>
    </div>
  )

  if (id === 3) return (
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
    </div>
  )

  if (id === 4) return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-[10px] text-white/30 mb-2">Performance geral da equipe este mês</p>
        <div className="flex gap-2">
          {[{ v: 1, l: 'Abaixo', c: RED }, { v: 2, l: 'Regular', c: AMBER }, { v: 3, l: 'Boa', c: '#5dade2' }, { v: 4, l: 'Excelente', c: TEAL }]
            .map(o => (
              <button key={o.v} onClick={() => update({ pesPerfScore: o.v })}
                className="flex-1 py-2.5 rounded-lg text-[11px] font-bold transition-all"
                style={{ background: s.pesPerfScore === o.v ? `${o.c}20` : 'rgba(0,0,0,0.3)', border: `1px solid ${s.pesPerfScore === o.v ? o.c + '50' : 'rgba(255,255,255,0.07)'}`, color: s.pesPerfScore === o.v ? o.c : 'rgba(255,255,255,0.25)' }}>
                {o.l}
              </button>
            ))}
        </div>
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

  // D6 — linked to manifesto
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[11px] text-white/35 mb-2 leading-relaxed">D6 é o <span style={{ color: RED }}>multiplicador</span> de todos os outros. Marque os princípios que sua equipe pratica — cada um eleva o fator Dignidade no cálculo.</p>
      {MANIFESTO.map((m, mi) => (
        <button key={mi} onClick={() => { const arr = [...(s.pesDig ?? [false,false,false,false,false])]; arr[mi] = !arr[mi]; update({ pesDig: arr }) }}
          className="flex items-start gap-3 text-left p-3 rounded-lg transition-all"
          style={{ background: (s.pesDig ?? [])[mi] ? `${m.color}12` : 'rgba(0,0,0,0.2)', border: `1px solid ${(s.pesDig ?? [])[mi] ? m.color + '40' : 'rgba(255,255,255,0.06)'}` }}>
          {(s.pesDig ?? [])[mi] ? <CheckCircle2 size={13} style={{ color: m.color, marginTop: 2, flexShrink: 0 }} /> : <Circle size={13} style={{ color: 'rgba(255,255,255,0.15)', marginTop: 2, flexShrink: 0 }} />}
          <div>
            <p className="text-[11px] font-semibold" style={{ color: (s.pesDig ?? [])[mi] ? m.color : 'rgba(255,255,255,0.45)' }}>{m.num} · {m.title}</p>
            <p className="text-[9.5px] text-white/20 mt-0.5 italic">"{m.ritual}"</p>
          </div>
        </button>
      ))}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PessoasLideranca() {
  const { data: s, update } = useWorkspaceData<PesState>('pessoas-lideranca', DEFAULT)
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [iaLoading, setIaLoading] = useState(false)
  const [iaAnswer, setIaAnswer] = useState('')

  const rawDims = calcRawDims(s)
  const practicedCount = (s.pesDig ?? []).filter(Boolean).length
  const index6D = calcIndex6D(rawDims, practicedCount)
  const d6mult = 0.5 + (rawDims[5] / 20) * 1.0
  const pcts = rawDims.map(d => Math.round((d / 20) * 100)) // normalize to 0–100% for display
  const overallColor = index6D >= 70 ? TEAL : index6D >= 45 ? AMBER : RED
  const lowestId = pcts.indexOf(Math.min(...pcts))
  const d6Low = rawDims[5] < 8

  async function askCoach(q: string) {
    setIaLoading(true); setIaAnswer('')
    try {
      const ctx = `Índice 6D: ${index6D}/100 | Multiplicador D6: ×${d6mult.toFixed(2)} | D1=${pcts[0]} D2=${pcts[1]} D3=${pcts[2]} D4=${pcts[3]} D5=${pcts[4]} D6=${pcts[5]} | ${practicedCount}/5 princípios praticados | Liderados: ${s.pesLiderados || '?'} | Meta: ${s.pesMetaEquipe || 'não definida'}`
      const res = await fetch('/api/advisor-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, marketContext: ctx, role: 'lider' }),
      })
      const j = await res.json()
      setIaAnswer(j.answer ?? '')
    } finally { setIaLoading(false) }
  }

  // Auto-generate contextual IA alert
  const autoAlert = (() => {
    if (d6Low && index6D < 40) return { level: 'critical', msg: `Alerta de Entropia Cultural — D6 (Dignidade) está em ${pcts[5]}%. Com multiplicador ×${d6mult.toFixed(2)}, todos os outros esforços são reduzidos à metade. Aplique o Manifesto antes de cobrar resultado.` }
    if (d6Low) return { level: 'warn', msg: `D6 baixo (${pcts[5]}%) está drenando o índice. Pratique os princípios do Manifesto para elevar o multiplicador acima de ×1.0.` }
    if (index6D < 30) return { level: 'critical', msg: `Índice crítico. Dimensão mais fraca: ${DIMS[lowestId].label} (${pcts[lowestId]}%). Foque aqui primeiro.` }
    if (index6D >= 80) return { level: 'ok', msg: `Liderança em alta performance (${index6D}/100). Multiplicador D6 ×${d6mult.toFixed(2)} potencializando o time.` }
    return { level: 'info', msg: `Dimensão mais fraca: ${DIMS[lowestId].label} (${pcts[lowestId]}%). Melhorar este ponto tem o maior impacto no índice agora.` }
  })()

  return (
    <div className="flex flex-col gap-5 pb-8">

      {/* ── Neural OS Header ── */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div>
          <p className="text-[9px] font-mono tracking-[0.22em] text-white/18 uppercase">Neural Leadership OS</p>
          <p className="text-[10px] font-mono text-white/30 mt-0.5">SIG · Gerencial · Pessoas</p>
        </div>
        <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.4, repeat: Infinity }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ border: `1px solid ${TEAL}45`, background: `${TEAL}0a` }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL, boxShadow: `0 0 6px ${TEAL}` }} />
          <span className="text-[9px] font-mono font-bold" style={{ color: TEAL }}>SISTEMA ATIVO</span>
        </motion.div>
      </div>

      {/* ── Energy Orb + particles ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(2,6,18,0.85)', border: `1px solid ${overallColor}20`, boxShadow: `0 0 40px ${overallColor}10` }}>
        <div className="pt-5 pb-3 flex flex-col items-center gap-2">
          <EnergyOrb score={index6D} d6mult={d6mult} />
          <p className="text-[10px] font-mono text-white/20 text-center px-6 leading-relaxed">
            Score = (D1+D2+D3+D4+D5) × D6<sub className="text-[8px]">mult</sub> + Bônus Manifesto
          </p>
        </div>

        {/* Particle field */}
        <div className="px-3 pb-3">
          <ParticleField score={index6D} />
        </div>

        {/* Liderados — compact inline */}
        <div className="flex items-center gap-2 px-4 pb-4">
          <p className="text-[9px] font-mono text-white/18 uppercase tracking-wider shrink-0">Time</p>
          <div className="flex gap-1.5 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
              <button key={n} onClick={() => update({ pesLiderados: n })}
                className="w-7 h-7 rounded-md text-[10px] font-mono font-bold transition-all"
                style={{ background: s.pesLiderados === n ? `${TEAL}28` : 'rgba(255,255,255,0.03)', border: `1px solid ${s.pesLiderados === n ? TEAL + '60' : 'rgba(255,255,255,0.06)'}`, color: s.pesLiderados === n ? TEAL : 'rgba(255,255,255,0.2)' }}>
                {n}
              </button>
            ))}
          </div>
          {s.pesLiderados > 0 && <p className="text-[9px] text-white/20 font-mono">{s.pesLiderados} pessoa{s.pesLiderados > 1 ? 's' : ''}</p>}
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
          MANIFESTO — Nódulos Neurais
          ════════════════════════════════════ */}
      <div>
        <div className="px-1 mb-4">
          <p className="text-[9px] font-mono tracking-[0.25em] text-white/18 uppercase mb-1">Código de Cultura</p>
          <div className="flex items-end gap-2">
            <h2 className="text-[17px] font-black text-white/80 leading-tight">Manifesto · Cultura de<br />Valor e Utilidade</h2>
            <span className="text-[10px] font-mono font-bold mb-0.5 px-2 py-0.5 rounded" style={{ background: `${RED}18`, color: RED }}>
              D6 ×{d6mult.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Neural node list */}
        <div className="relative flex flex-col">
          {/* Vertical connecting wire */}
          <div className="absolute left-5 top-5 bottom-5 w-px" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.02))' }} />

          {MANIFESTO.map((m, mi) => {
            const practiced = (s.pesDig ?? [])[mi]
            return (
              <motion.div key={mi} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: mi * 0.07 }}
                className="flex gap-4 pb-4">

                {/* Node circle */}
                <div className="relative shrink-0 z-10">
                  <motion.div
                    animate={practiced ? { boxShadow: [`0 0 0px ${m.color}00`, `0 0 14px ${m.color}70`, `0 0 0px ${m.color}00`] } : {}}
                    transition={{ duration: 2.2, repeat: Infinity }}
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: practiced ? `${m.color}20` : 'rgba(2,6,18,0.9)', border: `1.5px solid ${practiced ? m.color + '60' : 'rgba(255,255,255,0.08)'}` }}>
                    <span className="text-[11px] font-mono font-black" style={{ color: practiced ? m.color : 'rgba(255,255,255,0.2)' }}>{m.num}</span>
                  </motion.div>
                </div>

                {/* Principle content */}
                <div className="flex-1 min-w-0 rounded-xl p-3 pb-3.5"
                  style={{ background: practiced ? `${m.color}08` : 'rgba(0,0,0,0.2)', border: `1px solid ${practiced ? m.color + '28' : 'rgba(255,255,255,0.05)'}` }}>
                  <p className="text-[12.5px] font-bold leading-tight mb-2" style={{ color: practiced ? m.color : 'rgba(255,255,255,0.65)' }}>{m.title}</p>
                  <p className="text-[11px] text-white/38 leading-relaxed mb-3">{m.body}</p>

                  {/* Ritual divider */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-px flex-1" style={{ background: `${m.color}18` }} />
                    <span className="text-[8.5px] font-mono" style={{ color: m.color, opacity: 0.5 }}>RITUAL</span>
                    <div className="h-px flex-1" style={{ background: `${m.color}18` }} />
                  </div>
                  <p className="text-[10.5px] italic leading-relaxed" style={{ color: m.color, opacity: practiced ? 0.7 : 0.3 }}>"{m.ritual}"</p>

                  {/* Praticamos toggle */}
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

        {/* Como usar */}
        <div className="rounded-xl px-3 py-3 mt-1" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-[8.5px] font-mono text-white/18 uppercase tracking-widest mb-2">Como usar este manifesto</p>
          {['Integração: entregar aos novos líderes no primeiro dia de cargo.', 'Rituais: ler um ponto antes de reuniões importantes de planejamento.', 'Ambiente: visível no canal de comunicação da equipe ou na parede.'].map((t, i) => (
            <p key={i} className="text-[10px] text-white/25 leading-relaxed"><span className="font-mono text-white/12">{i + 1}. </span>{t}</p>
          ))}
        </div>
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
                style={{ background: isActive ? `${d.color}10` : 'rgba(2,6,18,0.6)', border: `1px solid ${isActive ? d.color + '50' : 'rgba(255,255,255,0.06)'}`, boxShadow: isActive ? `0 0 20px ${d.color}15` : 'none' }}
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
              style={{ background: `${DIM_COLORS[activeCard]}08`, border: `1px solid ${DIM_COLORS[activeCard]}30` }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded" style={{ background: `${DIM_COLORS[activeCard]}20`, color: DIM_COLORS[activeCard] }}>{DIMS[activeCard].code}</span>
                <span className="text-[13px] font-bold" style={{ color: DIM_COLORS[activeCard] }}>{DIMS[activeCard].label}</span>
                <span className="text-[11px] font-mono font-black ml-auto" style={{ color: DIM_COLORS[activeCard] }}>{pcts[activeCard]}/100</span>
              </div>
              <DimPanel id={activeCard} s={s} update={update} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ════════════════════════════════════
          AI TERMINAL
          ════════════════════════════════════ */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(2,6,18,0.9)', border: `1px solid ${TEAL}25`, boxShadow: `0 0 30px ${TEAL}08` }}>
        {/* Terminal bar */}
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex gap-1.5">
            {[RED, AMBER, TEAL].map((c, i) => <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c + '70' }} />)}
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Brain size={12} style={{ color: TEAL }} />
            <span className="text-[10px] font-mono" style={{ color: TEAL }}>coach@neural-leadership-os ~ %</span>
          </div>
        </div>

        <div className="p-4">
          {/* Auto alert */}
          <div className="flex items-start gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <Zap size={12} style={{ color: autoAlert.level === 'ok' ? TEAL : autoAlert.level === 'critical' ? RED : AMBER, marginTop: 1.5, flexShrink: 0 }} />
            <p className="text-[11px] font-mono leading-relaxed" style={{ color: autoAlert.level === 'ok' ? TEAL : autoAlert.level === 'critical' ? RED : 'rgba(255,255,255,0.5)' }}>
              [IA] {autoAlert.msg}
            </p>
          </div>

          {/* Quick prompts */}
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              'O que fazer com o score mais baixo?',
              'Como dar feedback difícil?',
              'Time não bate meta — diagnóstico',
              'Como estruturar o próximo 1:1?',
              `D6 está em ${pcts[5]}% — como melhorar?`,
            ].map(q => (
              <button key={q} onClick={() => askCoach(q)}
                className="px-2.5 py-1.5 rounded-lg text-[10.5px] font-mono transition-all"
                style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}25`, color: TEAL }}>
                › {q}
              </button>
            ))}
          </div>

          {iaLoading && (
            <div className="flex items-center gap-2">
              <Loader2 size={12} style={{ color: TEAL }} className="animate-spin" />
              <span className="text-[11px] font-mono" style={{ color: TEAL }}>analisando índice 6D...</span>
            </div>
          )}
          {iaAnswer && !iaLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-lg px-4 py-3 mt-1"
              style={{ background: 'rgba(23,165,137,0.06)', border: `1px solid ${TEAL}20` }}>
              <p className="text-[9px] font-mono text-white/25 mb-1.5">[IA RESPONSE]</p>
              <p className="text-[12px] text-white/65 leading-relaxed whitespace-pre-wrap font-mono">{iaAnswer}</p>
            </motion.div>
          )}
        </div>
      </div>

    </div>
  )
}
