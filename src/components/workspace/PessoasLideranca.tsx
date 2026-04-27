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
interface PesState {
  pesLiderados: number
  pesMetaEquipe: string; pesKpiEquipe: string
  pesNotaLider: number; pesNotaLiderado: number
  pesUltimo1a1: string; pesAcordos: string
  pesGapHabilidade: string; pesPlanoDev: string
  pesMaturidade: number
  pesRituais: boolean[]
  pesBloqueios: string; pesDesbloqueioHoras: number
  pesPerfScore: number; pesReconhecimento: boolean; pesReflexao: string
  pesNpsUtilidade: number
  pesDig: boolean[]
}

const DEFAULT: PesState = {
  pesLiderados: 0, pesMetaEquipe: '', pesKpiEquipe: '',
  pesNotaLider: 0, pesNotaLiderado: 0,
  pesUltimo1a1: '', pesAcordos: '',
  pesGapHabilidade: '', pesPlanoDev: '',
  pesMaturidade: 0,
  pesRituais: [false, false, false],
  pesBloqueios: '', pesDesbloqueioHoras: 0,
  pesPerfScore: 0, pesReconhecimento: false, pesReflexao: '',
  pesNpsUtilidade: 0,
  pesDig: [false, false, false, false, false],
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

  const practiced = (s.pesDig ?? []).filter(Boolean).length
  const d6 = Math.round((practiced / 5) * 20)

  return [d1, d2, d3, d4, d5, d6]
}

function calcIndex6D(dims: number[], practicedCount: number): number {
  const [d1, d2, d3, d4, d5, d6] = dims
  const base  = d1 + d2 + d3 + d4 + d5
  const mult  = 0.5 + (d6 / 20) * 1.0
  const bonus = (practicedCount / 5) * 10
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

// ─── Cross-module type stubs (minimal — only fields we read) ─────────────────
interface OKR { objetivo: string; krs: { texto: string; pct: number }[] }
const COCKPIT_ZERO = { receita: 0, despesas: 0, caixa: 0, clientesAtivos: 0 }
const ADMIN_ZERO = { faseEmpresa: 0, norteStar: '', cultura: '', okrs: [] as OKR[] }
const FASE_LABELS = ['Infra', 'Processo', 'Estratégia', 'Digitização', 'Transformação', 'Nativa']

// ─── IA questions per dimension ───────────────────────────────────────────────
const DIM_IA_Q: Record<number, string[]> = {
  0: ['Como reduzir o Ruído de Direção na equipe?', 'Como alinhar expectativas de meta com o liderado?', 'O que torna um KPI realmente acionável?'],
  1: ['Como conduzir um 1:1 que gera resultado?', 'O que devo registrar como acordo?', 'Com que frequência fazer 1:1?'],
  2: ['Como identificar o gap de habilidade certo?', 'Como criar um plano de desenvolvimento real?', 'Qual método de desenvolvimento funciona melhor?'],
  3: ['Como implementar uma daily que não vira reunião?', 'Como salvar uma retrospectiva que está vazia?', 'Rituais não estão funcionando — o que fazer?'],
  4: ['NPS Interno baixo — o que fazer agora?', 'Como criar senso de utilidade no trabalho do time?', 'Como reconhecer entrega sem parecer forçado?'],
  5: ['Qual princípio do Manifesto praticar primeiro?', 'Como criar senso de propósito no dia a dia?', 'Como medir se a cultura está sendo vivida?'],
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PessoasLideranca() {
  const { data: s, update } = useWorkspaceData<PesState>('pessoas-lideranca', DEFAULT)
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [iaLoading, setIaLoading] = useState(false)
  const [iaAnswer, setIaAnswer] = useState('')
  const [dimIaLoading, setDimIaLoading] = useState<number | null>(null)
  const [dimIaAnswers, setDimIaAnswers] = useState<Record<number, string>>({})

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
  const practicedCount = (s.pesDig ?? []).filter(Boolean).length
  const index6D = calcIndex6D(rawDims, practicedCount)
  const d6mult = 0.5 + (rawDims[5] / 20) * 1.0
  const pcts = rawDims.map(d => Math.round((d / 20) * 100))
  const overallColor = index6D >= 70 ? TEAL : index6D >= 45 ? AMBER : RED
  const lowestId = pcts.indexOf(Math.min(...pcts))
  const d6Low = rawDims[5] < 8

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
      const ctx = `Dimensão ${dim.code} (${dim.label}) — score atual: ${pcts[dimId]}/100. Índice 6D: ${index6D}/100. Meta: ${s.pesMetaEquipe || 'não definida'}. Liderados: ${s.pesLiderados || '?'}.`
      const res = await fetch('/api/advisor-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, marketContext: ctx, role: 'lider' }),
      })
      const j = await res.json()
      setDimIaAnswers(prev => ({ ...prev, [dimId]: j.answer ?? '' }))
    } finally { setDimIaLoading(null) }
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

      {/* ── Energy Orb + particles ── */}
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
                  {(DIM_IA_Q[activeCard] ?? []).map(q => (
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

      {/* ════════════════════════════════════
          OKR ALIGNMENT
          ════════════════════════════════════ */}
      {okrs.length > 0 && (
        <div>
          <div className="px-1 mb-3">
            <p className="text-[9px] font-mono tracking-[0.25em] text-white/18 uppercase mb-1">Alinhamento</p>
            <p className="text-[14px] font-black text-white/70">OKRs do Negócio</p>
          </div>
          {okrs.map((okr, oi) => {
            const avg = Math.round(okr.krs.reduce((a, k) => a + (k.pct ?? 0), 0) / Math.max(1, okr.krs.length))
            const c = avg >= 70 ? TEAL : avg >= 30 ? AMBER : RED
            return (
              <div key={oi} className="rounded-xl p-3 mb-2"
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-bold text-white/65 flex-1 pr-2">{okr.objetivo}</p>
                  <span className="text-[13px] font-black font-mono shrink-0" style={{ color: c }}>{avg}%</span>
                </div>
                {okr.krs.filter(k => k.texto.trim()).map((kr, ki) => (
                  <div key={ki} className="mb-1.5">
                    <div className="flex justify-between mb-0.5">
                      <p className="text-[9.5px] text-white/30 truncate flex-1 pr-2">{kr.texto}</p>
                      <p className="text-[9.5px] font-mono text-white/30 shrink-0">{kr.pct}%</p>
                    </div>
                    <div className="h-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <motion.div className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${kr.pct}%` }}
                        transition={{ duration: 0.6, delay: ki * 0.08 }}
                        style={{ background: c }} />
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}

      {/* ════════════════════════════════════
          AI TERMINAL
          ════════════════════════════════════ */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Terminal bar */}
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex gap-1.5">
            {[RED, AMBER, TEAL].map((c, i) => <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c + '70' }} />)}
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Brain size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
            <span className="text-[10px] font-mono text-white/35">coach · neural leadership os</span>
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
