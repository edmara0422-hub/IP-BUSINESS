'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWorkspaceData } from '@/hooks/useWorkspaceData'
import { Brain, CheckCircle2, Circle, Loader2, ChevronDown } from 'lucide-react'

const TEAL  = '#17a589'
const RED   = '#e74c3c'
const AMBER = '#e67e22'

const DIMS = [
  { id: 0, code: 'D1', label: 'Direção',    color: '#5dade2', short: 'Metas e KPIs claros' },
  { id: 1, code: 'D2', label: 'Diálogo',    color: '#27ae60', short: '1:1s e comunicação' },
  { id: 2, code: 'D3', label: 'Desenvolv.', color: '#8e44ad', short: 'Skills e crescimento' },
  { id: 3, code: 'D4', label: 'Disciplina', color: '#e67e22', short: 'Rituais de execução' },
  { id: 4, code: 'D5', label: 'Desempenho', color: '#17a589', short: 'Resultado e foco' },
  { id: 5, code: 'D6', label: 'Dignidade',  color: '#e74c3c', short: 'Cultura e propósito' },
]

const MANIFESTO: { num: string; title: string; body: string; ritual: string }[] = [
  {
    num: '01',
    title: 'O Trabalho com Significado',
    body: 'Aqui, não apenas "cumprimos tarefas". Nós prestamos um serviço à sociedade, aos nossos clientes e aos nossos colegas. O trabalho só é bom quando sabemos a quem ele serve e qual problema ele resolve. Se você não vê utilidade no que faz, nossa missão é encontrar esse sentido juntos.',
    ritual: 'Antes de cada reunião: pergunte "a quem isso serve?"',
  },
  {
    num: '02',
    title: 'Além do Financeiro',
    body: 'O salário paga as contas, mas o propósito é o que nos levanta da cama. Não aceitamos que a relação com o trabalho seja um fardo. Queremos que cada liderado entenda: "Para que eu vim ao mundo?" e como seus talentos se conectam com a sua função aqui.',
    ritual: 'Integração: converse sobre propósito antes de falar sobre metas.',
  },
  {
    num: '03',
    title: 'Liderança como Facilitação',
    body: 'O líder não é um fiscal de prazos, é um removedor de obstáculos. Nossa liderança é baseada na Inteligência Emocional: Empatia para entender os desejos de quem lideramos. Autocontrole para manter o ambiente saudável. Habilidade Social para construir confiança plena.',
    ritual: 'No 1:1: "O que está te travando? Como posso ajudar?"',
  },
  {
    num: '04',
    title: 'O Valor da Entrega',
    body: 'Não buscamos apenas o resultado numérico; buscamos o impacto. Um resultado sem valor humano é vazio. Reconhecemos a excelência, a proatividade e, acima de tudo, o desejo de ser útil.',
    ritual: 'Celebre publicamente quem entregou além do esperado.',
  },
  {
    num: '05',
    title: 'Compromisso Mútuo',
    body: 'Se o trabalho está sendo apenas um peso, algo está errado. Líder e liderado têm o compromisso de dialogar abertamente para ajustar o curso. O trabalho deve ser uma via de crescimento pessoal e profissional.',
    ritual: 'Retrospectiva mensal: o que melhorar juntos?',
  },
]

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
function HexRadar({ scores, liderados }: { scores: number[]; liderados: number }) {
  const C = 150, R = 105
  const overall = Math.round(scores.reduce((a, b) => a + b, 0) / 6)
  const oColor = overall >= 70 ? TEAL : overall >= 45 ? AMBER : RED

  function pt(i: number, pct: number): [number, number] {
    const a = (i * 60 - 90) * Math.PI / 180
    return [+(C + R * pct * Math.cos(a)).toFixed(1), +(C + R * pct * Math.sin(a)).toFixed(1)]
  }
  function hexPoly(pct: number): string {
    return Array.from({ length: 6 }, (_, i) => pt(i, pct))
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ') + 'Z'
  }
  const dataPath = scores
    .map((s, i) => pt(i, Math.max(0.05, s / 100)))
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ') + 'Z'

  return (
    <svg viewBox="0 0 300 300" width="100%" style={{ maxWidth: 300, display: 'block', margin: '0 auto' }}>
      <defs>
        <radialGradient id="rg6d" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.3" />
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

      {[0.25, 0.5, 0.75, 1.0].map(p => (
        <path key={p} d={hexPoly(p)} fill="none"
          stroke={`rgba(255,255,255,${p === 1.0 ? 0.07 : 0.03})`}
          strokeWidth={p === 1.0 ? 1 : 0.5}
          strokeDasharray={p < 1 ? '3,6' : undefined} />
      ))}
      {Array.from({ length: 6 }, (_, i) => {
        const [x, y] = pt(i, 1.0)
        return <line key={i} x1={C} y1={C} x2={x} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      })}

      <motion.path d={dataPath} fill="url(#rg6d)" stroke={`rgba(23,165,137,0.65)`}
        strokeWidth="1.5" strokeLinejoin="round" filter="url(#glow6d)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.15 }} />

      {scores.map((s, i) => {
        const [x, y] = pt(i, Math.max(0.05, s / 100))
        return (
          <motion.circle key={i} cx={x} cy={y} r={5} fill={DIMS[i].color}
            stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" filter="url(#glowDot)"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 + i * 0.08 }} />
        )
      })}

      {DIMS.map((d, i) => {
        const [x, y] = pt(i, 1.29)
        const anchor = x < C - 8 ? 'end' : x > C + 8 ? 'start' : 'middle'
        return (
          <text key={i} x={x} y={y + 4} textAnchor={anchor} fontSize="10.5"
            fill={d.color} fontFamily="monospace" fontWeight="800">{d.code}</text>
        )
      })}

      <circle cx={C} cy={C} r={37} fill="rgba(0,0,0,0.78)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <motion.text x={C} y={C - 5} textAnchor="middle" fontSize="27"
        fill={oColor} fontFamily="monospace" fontWeight="900"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        {overall}
      </motion.text>
      <text x={C} y={C + 13} textAnchor="middle" fontSize="7"
        fill="rgba(255,255,255,0.22)" fontFamily="monospace" letterSpacing="1.5">ÍNDICE 6D</text>
      {liderados > 0 && (
        <text x={C} y={C + 27} textAnchor="middle" fontSize="8"
          fill="rgba(255,255,255,0.18)" fontFamily="monospace">{liderados} liderado{liderados > 1 ? 's' : ''}</text>
      )}
    </svg>
  )
}

// ─── Expanded panel inputs ────────────────────────────────────────────────────
function DimPanel({ id, s, update }: { id: number; s: PesState; update: (p: Partial<PesState>) => void }) {
  const c = DIMS[id].color

  if (id === 0) return (
    <div className="flex flex-col gap-3">
      <Field label="Meta da equipe para o trimestre" color={c}>
        <input value={s.pesMetaEquipe} onChange={e => update({ pesMetaEquipe: e.target.value })}
          placeholder="Ex: Fechar 10 contratos até 30/06" className="w-full rounded-lg px-3 py-2.5 text-[12px] outline-none"
          style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${c}25`, color: 'rgba(255,255,255,0.75)' }} />
      </Field>
      <Field label="KPI principal — como medir?" color={c}>
        <input value={s.pesKpiEquipe} onChange={e => update({ pesKpiEquipe: e.target.value })}
          placeholder="Ex: Conversão ≥ 25% | NPS ≥ 70" className="w-full rounded-lg px-3 py-2.5 text-[12px] outline-none"
          style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${c}25`, color: 'rgba(255,255,255,0.75)' }} />
      </Field>
      {!s.pesMetaEquipe && <Tip color={c}>Sem meta clara não há liderança — há apenas gerenciamento de agenda.</Tip>}
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
            return <span className="text-[11px] font-mono font-bold" style={{ color: diff > 14 ? RED : diff > 7 ? AMBER : c }}>{diff === 0 ? 'hoje' : `${diff}d atrás`}</span>
          })()}
        </div>
      </div>
      <Field label="Acordos e compromissos registrados" color={c}>
        <textarea value={s.pesAcordos} onChange={e => update({ pesAcordos: e.target.value })}
          placeholder="Marcos entrega proposta até 5ª. Eu vou destravar acesso até amanhã."
          rows={3} className="w-full rounded-lg px-3 py-2 text-[12px] outline-none resize-none"
          style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${c}25`, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }} />
      </Field>
    </div>
  )

  if (id === 2) return (
    <div className="flex flex-col gap-3">
      <Field label="Principal gap de habilidade do time" color={c}>
        <input value={s.pesGapHabilidade} onChange={e => update({ pesGapHabilidade: e.target.value })}
          placeholder="Ex: Negociação, produto, gestão do tempo..." className="w-full rounded-lg px-3 py-2.5 text-[12px] outline-none"
          style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${c}25`, color: 'rgba(255,255,255,0.75)' }} />
      </Field>
      <Field label="Plano de desenvolvimento ativo" color={c}>
        <textarea value={s.pesPlanoDev} onChange={e => update({ pesPlanoDev: e.target.value })}
          placeholder="Curso X na semana 2, shadowing sênior, 1 livro/mês, feedback semanal..."
          rows={3} className="w-full rounded-lg px-3 py-2 text-[12px] outline-none resize-none"
          style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${c}25`, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }} />
      </Field>
    </div>
  )

  if (id === 3) return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[10px] text-white/35">Rituais de time ativos esta semana</p>
      {['Daily — 15 min / dia · Fiz, farei, bloqueios', 'Reunião semanal de time · Metas, prioridades', 'Retrospectiva mensal · O que funcionou, o que muda']
        .map((r, ri) => {
          const [lbl, sub] = r.split(' · ')
          return (
            <CheckRow key={ri} checked={s.pesRituais[ri]} color={c} label={lbl} sub={sub}
              onToggle={() => { const arr = [...s.pesRituais]; arr[ri] = !arr[ri]; update({ pesRituais: arr }) }} />
          )
        })}
      {!s.pesRituais.some(Boolean) && <Tip color={RED}>Rituais são o esqueleto da execução. Sem eles, a equipe opera no improviso.</Tip>}
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
      <CheckRow checked={s.pesReconhecimento} color={TEAL} label="Reconhecimento público feito esta semana"
        sub="Celebrei resultados e comportamentos que quero repetir"
        onToggle={() => update({ pesReconhecimento: !s.pesReconhecimento })} />
      <Field label="Reflexão de liderança" color={c}>
        <textarea value={s.pesReflexao} onChange={e => update({ pesReflexao: e.target.value })}
          placeholder="O que limitou os resultados? O que eu, como líder, posso mudar?"
          rows={3} className="w-full rounded-lg px-3 py-2 text-[12px] outline-none resize-none"
          style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${TEAL}25`, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }} />
      </Field>
    </div>
  )

  // D6 — praticamos (linked to manifesto above)
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[11px] text-white/40 mb-1.5 leading-relaxed">Marque os princípios que sua equipe pratica ativamente. Isso alimenta o score D6 no radar.</p>
      {MANIFESTO.map((m, mi) => (
        <CheckRow key={mi} checked={(s.pesDig ?? [])[mi]} color={c} label={m.title}
          sub={m.ritual}
          onToggle={() => { const arr = [...(s.pesDig ?? [false,false,false,false,false])]; arr[mi] = !arr[mi]; update({ pesDig: arr }) }} />
      ))}
    </div>
  )
}

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
function Field({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
      {children}
    </div>
  )
}
function Tip({ color, children }: { color: string; children: React.ReactNode }) {
  return <p className="text-[11px] px-3 py-2 rounded-lg" style={{ background: `${color}08`, border: `1px solid ${color}20`, color }}>{children}</p>
}
function CheckRow({ checked, color, label, sub, onToggle }: { checked: boolean; color: string; label: string; sub?: string; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="flex items-start gap-3 text-left p-3 rounded-lg transition-all w-full"
      style={{ background: checked ? `${color}12` : 'rgba(0,0,0,0.2)', border: `1px solid ${checked ? color + '35' : 'rgba(255,255,255,0.06)'}` }}>
      {checked ? <CheckCircle2 size={14} style={{ color, marginTop: 1, flexShrink: 0 }} /> : <Circle size={14} style={{ color: 'rgba(255,255,255,0.15)', marginTop: 1, flexShrink: 0 }} />}
      <div>
        <p className="text-[12px] font-semibold leading-tight" style={{ color: checked ? color : 'rgba(255,255,255,0.5)' }}>{label}</p>
        {sub && <p className="text-[10px] text-white/25 mt-0.5">{sub}</p>}
      </div>
    </button>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PessoasLideranca() {
  const { data: s, update } = useWorkspaceData<PesState>('pessoas-lideranca', DEFAULT)
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [iaLoading, setIaLoading] = useState(false)
  const [iaAnswer, setIaAnswer] = useState('')

  const scores = calcScores(s)
  const overall = Math.round(scores.reduce((a, b) => a + b, 0) / 6)
  const overallColor = overall >= 70 ? TEAL : overall >= 45 ? AMBER : RED

  async function askCoach(q: string) {
    setIaLoading(true); setIaAnswer('')
    try {
      const ctx = `Líder com ${s.pesLiderados} liderado(s). Índice 6D: ${overall}/100. D1=${scores[0]} D2=${scores[1]} D3=${scores[2]} D4=${scores[3]} D5=${scores[4]} D6=${scores[5]}. Meta: ${s.pesMetaEquipe || 'não definida'}. Gap: ${s.pesGapHabilidade || 'não mapeado'}.`
      const res = await fetch('/api/advisor-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, marketContext: ctx, role: 'lider' }),
      })
      const j = await res.json()
      setIaAnswer(j.answer ?? '')
    } finally { setIaLoading(false) }
  }

  return (
    <div className="flex flex-col gap-6 pb-8">

      {/* ════════════════════════════════════════════
          MANIFESTO — sempre visível, texto completo
          ════════════════════════════════════════════ */}
      <div>
        {/* Título do manifesto */}
        <div className="px-1 mb-4">
          <p className="text-[9px] font-mono tracking-[0.25em] text-white/20 uppercase mb-1">Manifesto</p>
          <h2 className="text-[18px] font-black text-white/85 leading-tight">Cultura de Valor<br />e Utilidade</h2>
          <p className="text-[11px] text-white/30 mt-1.5 leading-relaxed">
            O trabalho só é bom quando sabemos a quem ele serve.<br />
            Entregue no primeiro dia. Leia um ponto antes de cada reunião de planejamento.
          </p>
        </div>

        {/* 5 Princípios */}
        <div className="flex flex-col gap-3">
          {MANIFESTO.map((m, mi) => {
            const practiced = (s.pesDig ?? [])[mi]
            const numColor = ['#5dade2','#27ae60','#8e44ad','#e67e22','#e74c3c'][mi]
            return (
              <motion.div key={mi}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: mi * 0.07, duration: 0.35 }}
                className="rounded-xl overflow-hidden"
                style={{ border: `1px solid ${practiced ? numColor + '35' : 'rgba(255,255,255,0.06)'}`, background: practiced ? `${numColor}08` : 'rgba(0,0,0,0.2)' }}>

                {/* Principle card */}
                <div className="px-4 pt-4 pb-3">
                  <div className="flex items-start gap-3 mb-3">
                    {/* Big number */}
                    <span className="text-[28px] font-black font-mono leading-none shrink-0 mt-0.5" style={{ color: numColor, opacity: practiced ? 1 : 0.25 }}>
                      {m.num}
                    </span>
                    <div className="flex-1">
                      <p className="text-[13px] font-bold leading-tight" style={{ color: practiced ? numColor : 'rgba(255,255,255,0.7)' }}>
                        {m.title}
                      </p>
                      <p className="text-[11.5px] text-white/45 leading-relaxed mt-2">
                        {m.body}
                      </p>
                    </div>
                  </div>

                  {/* Ritual hint */}
                  <div className="flex items-center gap-2 mb-3 pl-10">
                    <div className="h-px flex-1" style={{ background: `${numColor}20` }} />
                    <p className="text-[9.5px] font-mono" style={{ color: numColor, opacity: 0.55 }}>
                      ritual
                    </p>
                    <div className="h-px flex-1" style={{ background: `${numColor}20` }} />
                  </div>
                  <p className="text-[11px] pl-10 italic" style={{ color: numColor, opacity: practiced ? 0.75 : 0.35 }}>
                    "{m.ritual}"
                  </p>

                  {/* Praticamos toggle */}
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => { const arr = [...(s.pesDig ?? [false,false,false,false,false])]; arr[mi] = !arr[mi]; update({ pesDig: arr }) }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all"
                      style={{ background: practiced ? `${numColor}20` : 'rgba(255,255,255,0.05)', border: `1px solid ${practiced ? numColor + '45' : 'rgba(255,255,255,0.08)'}`, color: practiced ? numColor : 'rgba(255,255,255,0.25)' }}>
                      {practiced ? <CheckCircle2 size={11} /> : <Circle size={11} />}
                      {practiced ? 'PRATICAMOS' : 'marcar como praticado'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Como usar */}
        <div className="mt-4 rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1.5">Como usar este manifesto</p>
          <div className="flex flex-col gap-1">
            {[
              'Integração — entregue aos novos líderes no primeiro dia de cargo',
              'Rituais — leia um ponto antes de reuniões importantes de planejamento',
              'Ambiente — deixe visível no canal de comunicação da equipe',
            ].map((item, i) => (
              <p key={i} className="text-[10.5px] text-white/30 leading-relaxed">
                <span className="text-white/15 font-mono">{i + 1}. </span>{item}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          6D DASHBOARD
          ════════════════════════════════════════════ */}
      <div>
        <div className="px-1 mb-4 flex items-end justify-between">
          <div>
            <p className="text-[9px] font-mono tracking-[0.25em] text-white/20 uppercase mb-1">Diagnóstico</p>
            <h2 className="text-[16px] font-black text-white/75 leading-none">Índice 6D</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[28px] font-black font-mono leading-none" style={{ color: overallColor }}>{overall}</span>
            <div className="pb-1">
              <p className="text-[9px] text-white/25 font-mono leading-none">/100</p>
              <p className="text-[9px] font-bold mt-0.5" style={{ color: overallColor }}>
                {overall >= 70 ? 'efetiva' : overall >= 45 ? 'em dev.' : 'atenção'}
              </p>
            </div>
          </div>
        </div>

        {/* Liderados — compacto */}
        <div className="flex items-center gap-2 mb-4 px-1">
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-wider shrink-0">Liderados</p>
          <div className="flex gap-1.5 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
              <button key={n} onClick={() => update({ pesLiderados: n })}
                className="w-7 h-7 rounded-md text-[10px] font-mono font-bold transition-all"
                style={{ background: s.pesLiderados === n ? `${TEAL}30` : 'rgba(255,255,255,0.04)', border: `1px solid ${s.pesLiderados === n ? TEAL + '70' : 'rgba(255,255,255,0.07)'}`, color: s.pesLiderados === n ? TEAL : 'rgba(255,255,255,0.2)' }}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Radar */}
        <div className="rounded-xl py-3 px-2 mb-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <HexRadar scores={scores} liderados={s.pesLiderados} />
        </div>

        {/* 6D Cards */}
        <div className="grid grid-cols-2 gap-2">
          {DIMS.map(d => {
            const sc = scores[d.id]
            const isActive = activeCard === d.id
            return (
              <motion.button key={d.id}
                onClick={() => setActiveCard(isActive ? null : d.id)}
                className="rounded-xl p-3 text-left transition-all"
                style={{ background: isActive ? `${d.color}12` : 'rgba(0,0,0,0.22)', border: `1px solid ${isActive ? d.color + '45' : 'rgba(255,255,255,0.06)'}` }}
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
                <div className="h-0.5 rounded-full mb-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div className="h-full rounded-full"
                    initial={{ width: 0 }} animate={{ width: `${sc}%` }}
                    transition={{ duration: 0.6, delay: d.id * 0.06 }}
                    style={{ background: d.color }} />
                </div>
                <p className="text-[9px] text-white/25">{d.short}</p>
              </motion.button>
            )
          })}
        </div>

        {/* Expanded input panel */}
        <AnimatePresence mode="wait">
          {activeCard !== null && (
            <motion.div key={activeCard}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="rounded-xl p-4 mt-2"
              style={{ background: `${DIMS[activeCard].color}0a`, border: `1px solid ${DIMS[activeCard].color}30` }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded" style={{ background: `${DIMS[activeCard].color}20`, color: DIMS[activeCard].color }}>{DIMS[activeCard].code}</span>
                <span className="text-[13px] font-bold" style={{ color: DIMS[activeCard].color }}>{DIMS[activeCard].label}</span>
              </div>
              <DimPanel id={activeCard} s={s} update={update} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ════════════════════════════════════════════
          IA COACH
          ════════════════════════════════════════════ */}
      <div className="rounded-xl p-4" style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}25` }}>
        <div className="flex items-center gap-2 mb-1">
          <Brain size={14} style={{ color: TEAL }} />
          <span className="text-[13px] font-bold" style={{ color: TEAL }}>Coach de Liderança IA</span>
        </div>
        <p className="text-[10px] text-white/30 mb-3 font-mono">índice 6D: {overall}/100 · {s.pesLiderados || '?'} liderado(s) · {(s.pesDig ?? []).filter(Boolean).length}/5 princípios praticados</p>
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
          <div className="flex items-center gap-2">
            <Loader2 size={13} style={{ color: TEAL }} className="animate-spin" />
            <span className="text-[11px]" style={{ color: TEAL }}>Analisando seu 6D...</span>
          </div>
        )}
        {iaAnswer && !iaLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-lg px-4 py-3"
            style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${TEAL}20` }}>
            <p className="text-[12px] text-white/70 leading-relaxed whitespace-pre-wrap">{iaAnswer}</p>
          </motion.div>
        )}
      </div>

    </div>
  )
}
