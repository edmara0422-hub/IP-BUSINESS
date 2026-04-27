'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWorkspaceData } from '@/hooks/useWorkspaceData'
import { Brain, CheckCircle2, Circle, Loader2, Users2, ChevronDown } from 'lucide-react'

// ─── Palette ──────────────────────────────────────────────────────────────────
const TEAL  = '#17a589'
const RED   = '#e74c3c'
const AMBER = '#e67e22'

// ─── 6 Dimensions ─────────────────────────────────────────────────────────────
const DIMS = [
  { id: 0, code: 'D1', label: 'Direção',    color: '#5dade2', short: 'Metas e KPIs claros' },
  { id: 1, code: 'D2', label: 'Diálogo',    color: '#27ae60', short: '1:1s e comunicação' },
  { id: 2, code: 'D3', label: 'Desenvolv.', color: '#8e44ad', short: 'Skills e crescimento' },
  { id: 3, code: 'D4', label: 'Disciplina', color: '#e67e22', short: 'Rituais de execução' },
  { id: 4, code: 'D5', label: 'Desempenho', color: '#17a589', short: 'Resultado e foco' },
  { id: 5, code: 'D6', label: 'Dignidade',  color: '#e74c3c', short: 'Cultura e propósito' },
]

// ─── Manifesto (D6) ──────────────────────────────────────────────────────────
const MANIFESTO = [
  {
    title: 'Trabalho com Significado',
    body: 'Aqui prestamos um serviço à sociedade, aos clientes e colegas. Se você não vê utilidade no que faz, nossa missão é encontrar esse sentido juntos.',
  },
  {
    title: 'Além do Financeiro',
    body: 'O salário paga as contas, mas o propósito é o que nos levanta da cama. Conectamos talentos à função — perguntamos "para que vim ao mundo?".',
  },
  {
    title: 'Liderança como Facilitação',
    body: 'O líder não é fiscal de prazos — é removedor de obstáculos. Empatia para entender desejos. Autocontrole para manter o ambiente saudável. Confiança plena.',
  },
  {
    title: 'O Valor da Entrega',
    body: 'Buscamos impacto, não só números. Um resultado sem valor humano é vazio. Reconhecemos excelência, proatividade e o desejo de ser útil.',
  },
  {
    title: 'Compromisso Mútuo',
    body: 'Líder e liderado têm o compromisso de dialogar abertamente. O trabalho deve ser uma via de crescimento pessoal e profissional.',
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
  pesLiderados: 0,
  pesMetaEquipe: '', pesKpiEquipe: '',
  pesUltimo1a1: '', pesAcordos: '',
  pesGapHabilidade: '', pesPlanoDev: '',
  pesRituais: [false, false, false],
  pesPerfScore: 0, pesReconhecimento: false, pesReflexao: '',
  pesDig: [false, false, false, false, false],
}

// ─── Score engine ─────────────────────────────────────────────────────────────
function calcScores(s: PesState): number[] {
  const d1 = (s.pesMetaEquipe.trim() ? 50 : 0) + (s.pesKpiEquipe.trim() ? 50 : 0)

  let d2date = 0
  if (s.pesUltimo1a1) {
    const diff = Math.floor((Date.now() - new Date(s.pesUltimo1a1).getTime()) / 86400000)
    d2date = diff <= 7 ? 50 : diff <= 14 ? 30 : 10
  }
  const d2 = Math.min(100, d2date + (s.pesAcordos.trim() ? 50 : 0))

  const d3 = (s.pesGapHabilidade.trim() ? 50 : 0) + (s.pesPlanoDev.trim() ? 50 : 0)
  const d4 = Math.round((s.pesRituais.filter(Boolean).length / 3) * 100)
  const perfMap = [0, 25, 55, 80, 100]
  const d5 = Math.min(100, (perfMap[s.pesPerfScore] ?? 0) + (s.pesReconhecimento ? 10 : 0))
  const d6 = Math.round(((s.pesDig ?? []).filter(Boolean).length / 5) * 100)

  return [d1, d2, d3, d4, d5, d6]
}

// ─── SVG Hex Radar ────────────────────────────────────────────────────────────
function HexRadar({ scores }: { scores: number[] }) {
  const C = 150, R = 105
  const overall = Math.round(scores.reduce((a, b) => a + b, 0) / 6)
  const oColor = overall >= 70 ? TEAL : overall >= 45 ? AMBER : RED

  function pt(i: number, pct: number): [number, number] {
    const a = (i * 60 - 90) * Math.PI / 180
    return [+(C + R * pct * Math.cos(a)).toFixed(1), +(C + R * pct * Math.sin(a)).toFixed(1)]
  }

  function hexPoly(pct: number): string {
    return Array.from({ length: 6 }, (_, i) => pt(i, pct))
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`)
      .join(' ') + 'Z'
  }

  const dataPath = scores
    .map((s, i) => pt(i, Math.max(0.05, s / 100)))
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`)
    .join(' ') + 'Z'

  return (
    <svg viewBox="0 0 300 300" width="100%" style={{ maxWidth: 300, display: 'block', margin: '0 auto' }}>
      <defs>
        <radialGradient id="rg6d" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.32" />
          <stop offset="100%" stopColor="#5dade2" stopOpacity="0.04" />
        </radialGradient>
        <filter id="glow6d" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glowDot" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1.0].map(p => (
        <path key={p} d={hexPoly(p)} fill="none"
          stroke={`rgba(255,255,255,${p === 1.0 ? 0.08 : 0.03})`}
          strokeWidth={p === 1.0 ? 1 : 0.5}
          strokeDasharray={p < 1 ? '3,6' : undefined} />
      ))}

      {/* Axis spokes */}
      {Array.from({ length: 6 }, (_, i) => {
        const [x, y] = pt(i, 1.0)
        return <line key={i} x1={C} y1={C} x2={x} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      })}

      {/* Data polygon */}
      <motion.path
        d={dataPath}
        fill="url(#rg6d)"
        stroke={`rgba(23,165,137,0.65)`}
        strokeWidth="1.5"
        strokeLinejoin="round"
        filter="url(#glow6d)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
      />

      {/* Dimension dots */}
      {scores.map((s, i) => {
        const [x, y] = pt(i, Math.max(0.05, s / 100))
        return (
          <motion.circle key={i} cx={x} cy={y} r={5.5}
            fill={DIMS[i].color}
            stroke="rgba(0,0,0,0.65)" strokeWidth="1.5"
            filter="url(#glowDot)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 + i * 0.08 }} />
        )
      })}

      {/* Score labels near dots */}
      {scores.map((sc, i) => {
        if (sc < 8) return null
        const pct = Math.max(0.05, sc / 100)
        const [x, y] = pt(i, pct + (pct > 0.8 ? -0.2 : 0.18))
        return (
          <motion.text key={i} x={x} y={y + 3.5}
            textAnchor="middle" fontSize="8.5"
            fill={DIMS[i].color} fontFamily="monospace" fontWeight="700"
            initial={{ opacity: 0 }} animate={{ opacity: 0.85 }}
            transition={{ delay: 0.7 + i * 0.07 }}>
            {sc}
          </motion.text>
        )
      })}

      {/* Axis code labels */}
      {DIMS.map((d, i) => {
        const [x, y] = pt(i, 1.29)
        const anchor = x < C - 8 ? 'end' : x > C + 8 ? 'start' : 'middle'
        return (
          <text key={i} x={x} y={y + 4}
            textAnchor={anchor} fontSize="10.5"
            fill={d.color} fontFamily="monospace" fontWeight="800">
            {d.code}
          </text>
        )
      })}

      {/* Center */}
      <circle cx={C} cy={C} r={37} fill="rgba(0,0,0,0.78)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <motion.text x={C} y={C - 5} textAnchor="middle" fontSize="28"
        fill={oColor} fontFamily="monospace" fontWeight="900"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        {overall}
      </motion.text>
      <text x={C} y={C + 13} textAnchor="middle" fontSize="7.5"
        fill="rgba(255,255,255,0.22)" fontFamily="monospace" letterSpacing="1.5">
        ÍNDICE 6D
      </text>
    </svg>
  )
}

// ─── Expanded panel content per dimension ────────────────────────────────────
function DimPanel({ id, s, update }: { id: number; s: PesState; update: (p: Partial<PesState>) => void }) {
  const c = DIMS[id].color

  if (id === 0) return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-[10px] text-white/35 mb-1.5">Meta da equipe para o trimestre</p>
        <input value={s.pesMetaEquipe} onChange={e => update({ pesMetaEquipe: e.target.value })}
          placeholder="Ex: Fechar 10 contratos até 30/06"
          className="w-full rounded-lg px-3 py-2.5 text-[12px] outline-none"
          style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${c}25`, color: 'rgba(255,255,255,0.75)' }} />
      </div>
      <div>
        <p className="text-[10px] text-white/35 mb-1.5">KPI principal — como medir?</p>
        <input value={s.pesKpiEquipe} onChange={e => update({ pesKpiEquipe: e.target.value })}
          placeholder="Ex: Conversão ≥ 25% | NPS ≥ 70"
          className="w-full rounded-lg px-3 py-2.5 text-[12px] outline-none"
          style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${c}25`, color: 'rgba(255,255,255,0.75)' }} />
      </div>
      {!s.pesMetaEquipe && (
        <p className="text-[11px] px-3 py-2 rounded-lg" style={{ background: `${c}08`, border: `1px solid ${c}20`, color: c }}>
          Sem meta clara não há liderança — há apenas gerenciamento de agenda.
        </p>
      )}
    </div>
  )

  if (id === 1) return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-[10px] text-white/35 mb-1.5">Último 1:1 realizado</p>
        <div className="flex items-center gap-3">
          <input type="date" value={s.pesUltimo1a1} onChange={e => update({ pesUltimo1a1: e.target.value })}
            className="rounded-lg px-3 py-2 text-[12px] outline-none"
            style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${c}25`, color: 'rgba(255,255,255,0.75)' }} />
          {s.pesUltimo1a1 && (() => {
            const diff = Math.floor((Date.now() - new Date(s.pesUltimo1a1).getTime()) / 86400000)
            const dc = diff > 14 ? RED : diff > 7 ? AMBER : c
            return <span className="text-[11px] font-mono font-bold" style={{ color: dc }}>{diff === 0 ? 'hoje' : `${diff}d atrás`}</span>
          })()}
        </div>
      </div>
      <div>
        <p className="text-[10px] text-white/35 mb-1.5">Acordos e compromissos</p>
        <textarea value={s.pesAcordos} onChange={e => update({ pesAcordos: e.target.value })}
          placeholder="Marcos entrega proposta até 5ª. Eu vou destravar acesso até amanhã."
          rows={3} className="w-full rounded-lg px-3 py-2 text-[12px] outline-none resize-none"
          style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${c}25`, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }} />
      </div>
    </div>
  )

  if (id === 2) return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-[10px] text-white/35 mb-1.5">Principal gap de habilidade do time</p>
        <input value={s.pesGapHabilidade} onChange={e => update({ pesGapHabilidade: e.target.value })}
          placeholder="Ex: Negociação, produto, gestão do tempo..."
          className="w-full rounded-lg px-3 py-2.5 text-[12px] outline-none"
          style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${c}25`, color: 'rgba(255,255,255,0.75)' }} />
      </div>
      <div>
        <p className="text-[10px] text-white/35 mb-1.5">Plano de desenvolvimento ativo</p>
        <textarea value={s.pesPlanoDev} onChange={e => update({ pesPlanoDev: e.target.value })}
          placeholder="Curso X na semana 2, shadowing sênior, 1 livro/mês, feedback semanal..."
          rows={3} className="w-full rounded-lg px-3 py-2 text-[12px] outline-none resize-none"
          style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${c}25`, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }} />
      </div>
    </div>
  )

  if (id === 3) return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[10px] text-white/35">Rituais de time ativos esta semana</p>
      {[
        { label: 'Daily — 15 min / dia',        sub: 'Fiz, farei, bloqueios' },
        { label: 'Reunião semanal de time',      sub: 'Metas, prioridades, desbloqueios' },
        { label: 'Retrospectiva mensal',         sub: 'O que funcionou, o que mudamos' },
      ].map((r, ri) => (
        <button key={ri}
          onClick={() => { const arr = [...s.pesRituais]; arr[ri] = !arr[ri]; update({ pesRituais: arr }) }}
          className="flex items-start gap-3 text-left p-3 rounded-lg transition-all"
          style={{ background: s.pesRituais[ri] ? `${c}12` : 'rgba(0,0,0,0.2)', border: `1px solid ${s.pesRituais[ri] ? c + '35' : 'rgba(255,255,255,0.06)'}` }}>
          {s.pesRituais[ri]
            ? <CheckCircle2 size={14} style={{ color: c, marginTop: 1, flexShrink: 0 }} />
            : <Circle size={14} style={{ color: 'rgba(255,255,255,0.15)', marginTop: 1, flexShrink: 0 }} />}
          <div>
            <p className="text-[12px] font-semibold" style={{ color: s.pesRituais[ri] ? c : 'rgba(255,255,255,0.5)' }}>{r.label}</p>
            <p className="text-[10px] text-white/25 mt-0.5">{r.sub}</p>
          </div>
        </button>
      ))}
    </div>
  )

  if (id === 4) return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-[10px] text-white/35 mb-2">Performance geral da equipe este mês</p>
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
        style={{ background: s.pesReconhecimento ? `${TEAL}12` : 'rgba(0,0,0,0.2)', border: `1px solid ${s.pesReconhecimento ? TEAL + '35' : 'rgba(255,255,255,0.06)'}` }}>
        {s.pesReconhecimento ? <CheckCircle2 size={14} style={{ color: TEAL, flexShrink: 0 }} /> : <Circle size={14} style={{ color: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />}
        <div>
          <p className="text-[12px] font-semibold" style={{ color: s.pesReconhecimento ? TEAL : 'rgba(255,255,255,0.5)' }}>Reconhecimento público feito esta semana</p>
          <p className="text-[10px] text-white/25 mt-0.5">Celebrei resultados e comportamentos que quero repetir</p>
        </div>
      </button>
      <div>
        <p className="text-[10px] text-white/35 mb-1.5">Reflexão de liderança</p>
        <textarea value={s.pesReflexao} onChange={e => update({ pesReflexao: e.target.value })}
          placeholder="O que limitou os resultados? O que eu, como líder, posso mudar?"
          rows={3} className="w-full rounded-lg px-3 py-2 text-[12px] outline-none resize-none"
          style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${TEAL}25`, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }} />
      </div>
    </div>
  )

  // D6 Dignidade — Manifesto
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[10px] text-white/35 mb-0.5">Código de Cultura — marque os princípios que sua equipe pratica</p>
      {MANIFESTO.map((m, mi) => (
        <button key={mi}
          onClick={() => { const arr = [...(s.pesDig ?? [false,false,false,false,false])]; arr[mi] = !arr[mi]; update({ pesDig: arr }) }}
          className="flex items-start gap-3 text-left p-3 rounded-lg transition-all"
          style={{ background: (s.pesDig ?? [])[mi] ? `${c}12` : 'rgba(0,0,0,0.2)', border: `1px solid ${(s.pesDig ?? [])[mi] ? c + '35' : 'rgba(255,255,255,0.06)'}` }}>
          {(s.pesDig ?? [])[mi]
            ? <CheckCircle2 size={14} style={{ color: c, marginTop: 2, flexShrink: 0 }} />
            : <Circle size={14} style={{ color: 'rgba(255,255,255,0.15)', marginTop: 2, flexShrink: 0 }} />}
          <div>
            <p className="text-[12px] font-semibold leading-tight" style={{ color: (s.pesDig ?? [])[mi] ? c : 'rgba(255,255,255,0.5)' }}>{m.title}</p>
            <p className="text-[10px] text-white/25 mt-1 leading-relaxed">{m.body}</p>
          </div>
        </button>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function PessoasLideranca() {
  const { data: s, update } = useWorkspaceData<PesState>('pessoas-lideranca', DEFAULT)
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [iaLoading, setIaLoading] = useState(false)
  const [iaAnswer, setIaAnswer] = useState('')

  const scores = calcScores(s)
  const overall = Math.round(scores.reduce((a, b) => a + b, 0) / 6)
  const overallColor = overall >= 70 ? TEAL : overall >= 45 ? AMBER : RED

  async function askCoach(question: string) {
    setIaLoading(true); setIaAnswer('')
    try {
      const ctx = `Líder com ${s.pesLiderados} liderado(s). Índice 6D: ${overall}/100. Scores: D1=${scores[0]} D2=${scores[1]} D3=${scores[2]} D4=${scores[3]} D5=${scores[4]} D6=${scores[5]}. Meta: ${s.pesMetaEquipe || 'não definida'}. Gap: ${s.pesGapHabilidade || 'não mapeado'}.`
      const res = await fetch('/api/advisor-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, marketContext: ctx, role: 'lider' }),
      })
      const j = await res.json()
      setIaAnswer(j.answer ?? '')
    } finally { setIaLoading(false) }
  }

  return (
    <div className="flex flex-col gap-4 pb-6">

      {/* ── Header ── */}
      <div className="rounded-xl px-4 py-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <Users2 size={16} style={{ color: TEAL }} />
            <div>
              <p className="text-[13px] font-bold text-white/80 leading-none">People Intelligence</p>
              <p className="text-[9px] font-mono text-white/25 tracking-widest mt-0.5">6D · SIG · GERENCIAL</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[32px] font-black font-mono leading-none" style={{ color: overallColor }}>{overall}</span>
            <span className="text-[11px] text-white/25 font-mono self-end mb-1">/100</span>
          </div>
        </div>

        {/* Score bar */}
        <div className="h-1 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overall}%` }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            style={{ background: `linear-gradient(90deg, ${TEAL}, #5dade2)` }} />
        </div>

        {/* Liderados selector */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] text-white/25 mb-1.5 font-mono tracking-wider">LIDERADOS DIRETOS</p>
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                <button key={n} onClick={() => update({ pesLiderados: n })}
                  className="w-8 h-8 rounded-lg text-[11px] font-mono font-bold transition-all"
                  style={{ background: s.pesLiderados === n ? `${TEAL}30` : 'rgba(255,255,255,0.04)', border: `1px solid ${s.pesLiderados === n ? TEAL + '70' : 'rgba(255,255,255,0.07)'}`, color: s.pesLiderados === n ? TEAL : 'rgba(255,255,255,0.25)' }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/25 font-mono">STATUS</p>
            <p className="text-[12px] font-bold mt-0.5" style={{ color: overallColor }}>
              {overall >= 80 ? 'Liderança efetiva' : overall >= 60 ? 'Em desenvolvimento' : overall >= 40 ? 'Atenção necessária' : 'Estruturar agora'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Hex Radar ── */}
      <div className="relative">
        <div className="rounded-xl overflow-hidden py-3 px-2" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <HexRadar scores={scores} />
        </div>
      </div>

      {/* ── 6D Cards grid ── */}
      <div className="grid grid-cols-2 gap-2">
        {DIMS.map(d => {
          const sc = scores[d.id]
          const isActive = activeCard === d.id
          return (
            <motion.button key={d.id}
              onClick={() => setActiveCard(isActive ? null : d.id)}
              className="rounded-xl p-3 text-left transition-all"
              style={{
                background: isActive ? `${d.color}12` : 'rgba(0,0,0,0.25)',
                border: `1px solid ${isActive ? d.color + '45' : 'rgba(255,255,255,0.06)'}`,
              }}
              whileTap={{ scale: 0.97 }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-[9px] font-mono font-bold" style={{ color: d.color, opacity: 0.6 }}>{d.code}</p>
                  <p className="text-[12px] font-bold text-white/75 mt-0.5">{d.label}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[14px] font-black font-mono" style={{ color: d.color }}>{sc}</span>
                  <ChevronDown size={10} style={{ color: 'rgba(255,255,255,0.2)', transform: isActive ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              </div>
              {/* Mini bar */}
              <div className="h-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div className="h-full rounded-full"
                  initial={{ width: 0 }} animate={{ width: `${sc}%` }}
                  transition={{ duration: 0.6, delay: d.id * 0.06 }}
                  style={{ background: d.color }} />
              </div>
              <p className="text-[9px] text-white/25 mt-1.5">{d.short}</p>
            </motion.button>
          )
        })}
      </div>

      {/* ── Expanded panel ── */}
      <AnimatePresence mode="wait">
        {activeCard !== null && (
          <motion.div key={activeCard}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl p-4"
            style={{ background: `${DIMS[activeCard].color}0a`, border: `1px solid ${DIMS[activeCard].color}30` }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded" style={{ background: `${DIMS[activeCard].color}20`, color: DIMS[activeCard].color }}>{DIMS[activeCard].code}</span>
              <span className="text-[13px] font-bold" style={{ color: DIMS[activeCard].color }}>{DIMS[activeCard].label}</span>
              <span className="text-[11px] text-white/30">— {DIMS[activeCard].short}</span>
            </div>
            <DimPanel id={activeCard} s={s} update={update} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── IA Coach ── */}
      <div className="rounded-xl p-4" style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}25` }}>
        <div className="flex items-center gap-2 mb-3">
          <Brain size={14} style={{ color: TEAL }} />
          <span className="text-[13px] font-bold" style={{ color: TEAL }}>Coach de Liderança IA</span>
          <span className="text-[9px] font-mono text-white/20 ml-auto">6D · {overall}/100</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            'O que fazer com o score mais baixo?',
            'Como dar feedback difícil?',
            'Time não bate meta — diagnóstico',
            'Como montar um 1:1 efetivo?',
            'Delegação sem perder controle',
          ].map(q => (
            <button key={q} onClick={() => askCoach(q)}
              className="px-3 py-1.5 rounded-lg text-[11px] transition-all"
              style={{ background: `${TEAL}14`, border: `1px solid ${TEAL}28`, color: TEAL }}>
              {q}
            </button>
          ))}
        </div>
        {iaLoading && (
          <div className="flex items-center gap-2 py-1">
            <Loader2 size={13} style={{ color: TEAL }} className="animate-spin" />
            <span className="text-[11px]" style={{ color: TEAL }}>Analisando seu 6D...</span>
          </div>
        )}
        {iaAnswer && !iaLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-lg px-4 py-3 mt-1"
            style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${TEAL}20` }}>
            <p className="text-[12px] text-white/70 leading-relaxed whitespace-pre-wrap">{iaAnswer}</p>
          </motion.div>
        )}
      </div>

    </div>
  )
}
