'use client'

/**
 * LIVING TEXT — texto vivo com interação inline
 *
 * Substitui leitura passiva por estudo dirigido. O texto continua sendo o
 * núcleo, mas cada parágrafo pode disparar uma experiência:
 *
 *  [[concept:id|texto]]   → pílula glossário (popover com definição)
 *  [[author:id|texto]]    → pílula autor (abre painel lateral com ficha)
 *  [[pause:id]]           → bloco "pare e pense" — exige resposta antes de continuar
 *  [[calc:id]]            → mini-cálculo embutido com sliders
 *  [[anim:id]]            → animação inline (timeline, fases, fluxo)
 *  [[quote:id]]           → citação interativa (aluno pode "discordar" do autor)
 *
 * Persistência: cada interação salva em localStorage com chave `lt-{blockId}-{kind}-{id}`
 */

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { InlineRef, LivingConcept, LivingPause, LivingCalc, LivingAnim, LivingQuote } from '@/types/intelligence'

const BLUE = '#2e86c1'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const RED = '#c0392b'

interface Props {
  blockId: string
  title: string
  body: string
  refs?: InlineRef[]
  concepts?: LivingConcept[]
  pauses?: LivingPause[]
  calcs?: LivingCalc[]
  anims?: LivingAnim[]
  quotes?: LivingQuote[]
  estimatedReading?: string
}

type Token =
  | { kind: 'text'; value: string }
  | { kind: 'bold'; value: string }
  | { kind: 'italic'; value: string }
  | { kind: 'concept'; id: string; label: string }
  | { kind: 'author'; id: string; label: string }
  | { kind: 'pause'; id: string }
  | { kind: 'calc'; id: string }
  | { kind: 'anim'; id: string }
  | { kind: 'quote'; id: string }
  | { kind: 'header'; value: string }

const STORAGE_PREFIX = 'lt-'

function loadState<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function saveState<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

/**
 * Tokeniza o body em parágrafos, e cada parágrafo em runs de texto + marcações.
 * Suporta **bold**, _italic_ e [[type:id|label]]
 */
function tokenizeParagraph(para: string): Token[] {
  // Header detection: parágrafo inteiro entre **
  const trimmed = para.trim()
  if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.slice(2, -2).includes('**')) {
    return [{ kind: 'header', value: trimmed.slice(2, -2) }]
  }

  const tokens: Token[] = []
  // Regex captura: [[type:id]] ou [[type:id|label]] ou **bold** ou _italic_
  const regex = /(\[\[(?:concept|author|pause|calc|anim|quote):[^\]]+\]\]|\*\*[^*]+\*\*|_[^_]+_)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = regex.exec(para)) !== null) {
    if (m.index > last) tokens.push({ kind: 'text', value: para.slice(last, m.index) })
    const tok = m[0]
    if (tok.startsWith('[[')) {
      const inner = tok.slice(2, -2)
      const colonIdx = inner.indexOf(':')
      const type = inner.slice(0, colonIdx)
      const rest = inner.slice(colonIdx + 1)
      const pipeIdx = rest.indexOf('|')
      const id = pipeIdx === -1 ? rest : rest.slice(0, pipeIdx)
      const label = pipeIdx === -1 ? id : rest.slice(pipeIdx + 1)
      if (type === 'concept') tokens.push({ kind: 'concept', id, label })
      else if (type === 'author') tokens.push({ kind: 'author', id, label })
      else if (type === 'pause') tokens.push({ kind: 'pause', id })
      else if (type === 'calc') tokens.push({ kind: 'calc', id })
      else if (type === 'anim') tokens.push({ kind: 'anim', id })
      else if (type === 'quote') tokens.push({ kind: 'quote', id })
    } else if (tok.startsWith('**')) {
      tokens.push({ kind: 'bold', value: tok.slice(2, -2) })
    } else if (tok.startsWith('_')) {
      tokens.push({ kind: 'italic', value: tok.slice(1, -1) })
    }
    last = m.index + tok.length
  }
  if (last < para.length) tokens.push({ kind: 'text', value: para.slice(last) })
  return tokens
}

export default function LivingText({
  blockId, title, body, refs = [], concepts = [], pauses = [], calcs = [], anims = [], quotes = [], estimatedReading,
}: Props) {
  const [openRef, setOpenRef] = useState<InlineRef | null>(null)
  const [openConcept, setOpenConcept] = useState<LivingConcept | null>(null)

  const refMap = useMemo(() => new Map(refs.map((r) => [r.id, r])), [refs])
  const conceptMap = useMemo(() => new Map(concepts.map((c) => [c.id, c])), [concepts])
  const pauseMap = useMemo(() => new Map(pauses.map((p) => [p.id, p])), [pauses])
  const calcMap = useMemo(() => new Map(calcs.map((c) => [c.id, c])), [calcs])
  const animMap = useMemo(() => new Map(anims.map((a) => [a.id, a])), [anims])
  const quoteMap = useMemo(() => new Map(quotes.map((q) => [q.id, q])), [quotes])

  const paragraphs = useMemo(() => body.split('\n\n').filter((p) => p.trim()), [body])

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: BLUE }}>
            Estudo dirigido
          </span>
          {estimatedReading && (
            <span className="text-[10px] text-white/30 ml-auto">{estimatedReading}</span>
          )}
        </div>
        <h3 className="text-[16px] font-semibold text-white/85 leading-snug" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {title}
        </h3>
      </div>

      {/* Conteúdo — parágrafos e blocos interativos intercalados */}
      <div className="px-5 py-5 space-y-4">
        {paragraphs.map((para, idx) => {
          const tokens = tokenizeParagraph(para)

          // Se parágrafo é UM token de tipo bloco (pause/calc/anim/quote), renderiza só o bloco
          if (tokens.length === 1) {
            const t = tokens[0]
            if (t.kind === 'pause') {
              const p = pauseMap.get(t.id)
              if (p) return <PauseBlock key={idx} blockId={blockId} pause={p} />
            }
            if (t.kind === 'calc') {
              const c = calcMap.get(t.id)
              if (c) return <CalcBlock key={idx} blockId={blockId} calc={c} />
            }
            if (t.kind === 'anim') {
              const a = animMap.get(t.id)
              if (a) return <AnimBlock key={idx} anim={a} />
            }
            if (t.kind === 'quote') {
              const q = quoteMap.get(t.id)
              if (q) return <QuoteBlock key={idx} blockId={blockId} quote={q} />
            }
            if (t.kind === 'header') return <HeaderBlock key={idx} value={t.value} />
          }

          // Parágrafo normal — renderiza tokens inline
          return (
            <p key={idx} className="text-[14px] text-white/65 leading-[1.85]" style={{ textAlign: 'justify', fontFamily: 'Inter, system-ui, sans-serif' }}>
              {tokens.map((tok, i) => {
                if (tok.kind === 'text') return <span key={i}>{tok.value}</span>
                if (tok.kind === 'bold') return <strong key={i} className="font-semibold text-white/85">{tok.value}</strong>
                if (tok.kind === 'italic') return <em key={i} className="italic text-white/75">{tok.value}</em>
                if (tok.kind === 'header') return <span key={i} className="font-bold text-white/90">{tok.value}</span>
                if (tok.kind === 'concept') {
                  const c = conceptMap.get(tok.id)
                  return (
                    <button key={i} onClick={() => c && setOpenConcept(c)}
                      className="inline-flex items-baseline px-1.5 py-0 mx-0.5 rounded text-[13px] font-medium transition-all"
                      style={{ background: `${AMBER}10`, color: AMBER, borderBottom: `1px dashed ${AMBER}50`, lineHeight: '1.4' }}>
                      {tok.label}
                    </button>
                  )
                }
                if (tok.kind === 'author') {
                  const r = refMap.get(tok.id)
                  return (
                    <button key={i} onClick={() => r && setOpenRef(r)}
                      className="inline-flex items-baseline px-1.5 py-0 mx-0.5 rounded text-[13px] font-medium transition-all"
                      style={{ background: `${BLUE}12`, color: BLUE, border: `1px solid ${BLUE}25`, lineHeight: '1.4' }}>
                      {tok.label}
                    </button>
                  )
                }
                return null
              })}
            </p>
          )
        })}
      </div>

      {/* Painel lateral autor */}
      <AnimatePresence>
        {openRef && <RefPanel refItem={openRef} onClose={() => setOpenRef(null)} />}
      </AnimatePresence>

      {/* Popover conceito */}
      <AnimatePresence>
        {openConcept && <ConceptPopover concept={openConcept} onClose={() => setOpenConcept(null)} />}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─────────────── BLOCOS INLINE ─────────────── */

function HeaderBlock({ value }: { value: string }) {
  return (
    <div className="pt-3 pb-1">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-px" style={{ background: BLUE }} />
        <h4 className="text-[12px] font-bold uppercase tracking-[0.15em]" style={{ color: BLUE, fontFamily: 'Poppins, sans-serif' }}>
          {value}
        </h4>
      </div>
    </div>
  )
}

function PauseBlock({ blockId, pause }: { blockId: string; pause: LivingPause }) {
  const stateKey = `${blockId}-pause-${pause.id}`
  const [answer, setAnswer] = useState<string>(() => loadState(stateKey, ''))
  const [feedback, setFeedback] = useState<string | null>(() => loadState(stateKey + '-fb', null))
  const [loading, setLoading] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const submit = async () => {
    if (!answer.trim()) return
    setLoading(true)
    saveState(stateKey, answer)
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate-probe',
          question: `Pergunta de reflexão durante leitura: "${pause.question}". Avalie a resposta do aluno em 2-3 frases. ${pause.expectedKeywords?.length ? `Conceitos que a resposta ideal toca: ${pause.expectedKeywords.join(', ')}.` : ''} Seja direto: o que está bom, o que falta. Termine com APROVADO ou REVISAR.`,
          selectedText: answer,
          submoduleTitle: 'Reflexão durante leitura',
          history: [],
        }),
      })
      const data = await res.json()
      const fb = data.response || 'Resposta recebida.'
      setFeedback(fb)
      saveState(stateKey + '-fb', fb)
    } catch {
      setFeedback('Não foi possível conectar com a IA.')
    }
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl my-2"
      style={{ background: `${AMBER}06`, border: `1px solid ${AMBER}25` }}>
      <div className="px-4 py-3" style={{ borderBottom: `1px solid ${AMBER}15` }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[14px]">🛑</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: AMBER }}>
            Pare — responda antes de continuar
          </span>
        </div>
        <p className="text-[14px] font-medium text-white/80 leading-relaxed mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {pause.question}
        </p>
      </div>
      <div className="px-4 py-3 space-y-2">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={!!feedback || loading}
          placeholder="Sua reflexão..."
          rows={3}
          className="w-full bg-white/[0.03] rounded-lg px-3 py-2.5 text-[13px] text-white/75 placeholder:text-white/25 outline-none resize-none leading-relaxed disabled:opacity-60"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        />
        <div className="flex items-center gap-2">
          {!feedback && (
            <button onClick={submit} disabled={!answer.trim() || loading}
              className="text-[11px] font-medium px-3 py-2 rounded-lg transition-all disabled:opacity-30"
              style={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30` }}>
              {loading ? 'IA avaliando...' : 'Receber feedback'}
            </button>
          )}
          {pause.hint && !feedback && (
            <button onClick={() => setShowHint(!showHint)}
              className="text-[10px] font-medium text-white/40 hover:text-white/70 transition-colors">
              {showHint ? 'Ocultar dica' : 'Ver dica'}
            </button>
          )}
        </div>
        {showHint && pause.hint && !feedback && (
          <p className="text-[11px] text-white/45 italic">{pause.hint}</p>
        )}
        <AnimatePresence>
          {feedback && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-lg p-3"
              style={{ background: 'rgba(255,255,255,0.03)', borderLeft: `2px solid ${GREEN}50` }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: GREEN }}>
                Feedback
              </p>
              <p className="text-[12px] text-white/65 leading-relaxed whitespace-pre-wrap">{feedback}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function CalcBlock({ blockId, calc }: { blockId: string; calc: LivingCalc }) {
  const stateKey = `${blockId}-calc-${calc.id}`
  const initial: Record<string, number> = {}
  calc.inputs.forEach((i) => { initial[i.id] = i.default })
  const [values, setValues] = useState<Record<string, number>>(() => loadState(stateKey, initial))

  const result = useMemo(() => {
    try {
      const fn = new Function(...Object.keys(values), `return ${calc.formula}`)
      return fn(...Object.values(values)) as number
    } catch {
      return 0
    }
  }, [values, calc.formula])

  const handleChange = useCallback((id: string, val: number) => {
    setValues((prev) => {
      const next = { ...prev, [id]: val }
      saveState(stateKey, next)
      return next
    })
  }, [stateKey])

  const formatted = useMemo(() => {
    if (calc.resultFormat === 'currency') return `R$ ${Math.round(result).toLocaleString('pt-BR')}`
    if (calc.resultFormat === 'percent') return `${result.toFixed(1)}%`
    return Math.round(result).toLocaleString('pt-BR')
  }, [result, calc.resultFormat])

  const interpretation = useMemo(() => {
    if (!calc.interpretation) return null
    return calc.interpretation.find((i) => result <= i.max)
  }, [result, calc.interpretation])

  const interpColor = interpretation
    ? interpretation.color === 'green' ? GREEN : interpretation.color === 'amber' ? AMBER : RED
    : BLUE

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl my-2 overflow-hidden"
      style={{ background: `${BLUE}06`, border: `1px solid ${BLUE}25` }}>
      <div className="px-4 py-3" style={{ borderBottom: `1px solid ${BLUE}15` }}>
        <div className="flex items-center gap-2">
          <span className="text-[14px]">🎚️</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: BLUE }}>
            Calcule ao vivo
          </span>
        </div>
        <p className="text-[13px] font-medium text-white/80 mt-1.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {calc.title}
        </p>
      </div>
      <div className="px-4 py-3 space-y-3">
        {calc.inputs.map((input) => (
          <div key={input.id}>
            <div className="flex items-baseline justify-between mb-1">
              <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider">{input.label}</label>
              <span className="text-[11px] font-mono text-white/70">{values[input.id]} {input.unit}</span>
            </div>
            <input type="range"
              min={input.min} max={input.max}
              value={values[input.id]}
              onChange={(e) => handleChange(input.id, Number(e.target.value))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${BLUE} 0%, ${BLUE} ${((values[input.id] - input.min) / (input.max - input.min)) * 100}%, rgba(255,255,255,0.08) ${((values[input.id] - input.min) / (input.max - input.min)) * 100}%, rgba(255,255,255,0.08) 100%)`,
              }}
            />
          </div>
        ))}
        <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[10px] uppercase tracking-wider text-white/35 mb-1">{calc.resultLabel}</p>
          <p className="text-[22px] font-bold font-mono" style={{ color: interpColor, fontFamily: 'Poppins, sans-serif' }}>
            {formatted}
          </p>
          {interpretation && (
            <p className="text-[11px] mt-1" style={{ color: interpColor }}>{interpretation.label}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function AnimBlock({ anim }: { anim: LivingAnim }) {
  if (anim.kind === 'phases') {
    const phases = (anim.data.phases as Array<{ label: string; period: string; desc: string }>) || []
    return (
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-xl my-2 px-4 py-4"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {anim.title && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-3">{anim.title}</p>
        )}
        <div className="flex items-stretch gap-2">
          {phases.map((ph, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="flex-1 rounded-lg p-3"
              style={{ background: 'rgba(46,134,193,0.06)', border: '1px solid rgba(46,134,193,0.2)' }}>
              <p className="text-[9px] font-mono text-white/40">{ph.period}</p>
              <p className="text-[12px] font-bold text-white/85 mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{ph.label}</p>
              <p className="text-[10px] text-white/55 mt-1.5 leading-relaxed">{ph.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  if (anim.kind === 'timeline') {
    const events = (anim.data.events as Array<{ year: number; label: string }>) || []
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="rounded-xl my-2 px-4 py-4"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {anim.title && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-3">{anim.title}</p>
        )}
        <div className="relative pt-2">
          <div className="absolute left-0 right-0 top-5 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <div className="flex justify-between relative">
            {events.map((ev, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center" style={{ width: `${100 / events.length}%` }}>
                <div className="w-2 h-2 rounded-full" style={{ background: BLUE, boxShadow: `0 0 0 3px ${BLUE}20` }} />
                <p className="text-[9px] font-mono text-white/40 mt-2">{ev.year}</p>
                <p className="text-[9px] text-white/65 text-center leading-tight mt-1 max-w-[80px]">{ev.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  // fallback genérico
  return null
}

function QuoteBlock({ blockId, quote }: { blockId: string; quote: LivingQuote }) {
  const stateKey = `${blockId}-quote-${quote.id}`
  const [arguing, setArguing] = useState(false)
  const [argument, setArgument] = useState<string>(() => loadState(stateKey, ''))
  const [counter, setCounter] = useState<string | null>(() => loadState(stateKey + '-counter', null))
  const [loading, setLoading] = useState(false)

  const submitArgument = async () => {
    if (!argument.trim()) return
    setLoading(true)
    saveState(stateKey, argument)
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'explain',
          question: `Você é ${quote.author}${quote.year ? ` (${quote.year})` : ''}. Defendeu a tese: "${quote.text}". Um aluno está discordando, dizendo: "${argument}". Responda DEFENDENDO sua posição original em 3-4 frases, no estilo do autor, com argumentos sólidos. Não concorde facilmente.`,
          submoduleTitle: 'Citação interativa',
          history: [],
        }),
      })
      const data = await res.json()
      const c = data.response || ''
      setCounter(c)
      saveState(stateKey + '-counter', c)
    } catch {
      setCounter('Não foi possível conectar com o autor.')
    }
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl my-2 overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[14px]">⚡</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
            Escrito pelo autor
          </span>
        </div>
        <blockquote className="pl-3 border-l-2" style={{ borderColor: `${BLUE}50` }}>
          <p className="text-[14px] italic text-white/75 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
            "{quote.text}"
          </p>
          <footer className="text-[11px] text-white/40 mt-2">
            — {quote.author}{quote.year ? `, ${quote.year}` : ''}{quote.source ? ` · ${quote.source}` : ''}
          </footer>
        </blockquote>
        {!arguing && !counter && quote.challenge && (
          <button onClick={() => setArguing(true)}
            className="mt-3 text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all"
            style={{ background: `${RED}10`, color: RED, border: `1px solid ${RED}25` }}>
            Discordar do autor →
          </button>
        )}
        {arguing && !counter && (
          <div className="mt-3 space-y-2">
            <p className="text-[11px] text-white/50">{quote.challenge}</p>
            <textarea
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              placeholder="Por que você discorda?"
              rows={3}
              className="w-full bg-white/[0.03] rounded-lg px-3 py-2.5 text-[12px] text-white/75 placeholder:text-white/25 outline-none resize-none leading-relaxed"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}
            />
            <button onClick={submitArgument} disabled={!argument.trim() || loading}
              className="text-[11px] font-medium px-3 py-2 rounded-lg disabled:opacity-30"
              style={{ background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}30` }}>
              {loading ? `${quote.author} pensando...` : `Enviar para ${quote.author.split(' ')[0]}`}
            </button>
          </div>
        )}
        {counter && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-3 rounded-lg p-3"
            style={{ background: `${BLUE}06`, borderLeft: `2px solid ${BLUE}40` }}>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: BLUE }}>
              Resposta de {quote.author}
            </p>
            <p className="text-[12px] text-white/65 leading-relaxed italic">{counter}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

/* ─────────────── POPOVERS ─────────────── */

function ConceptPopover({ concept, onClose }: { concept: LivingConcept; onClose: () => void }) {
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md p-5 rounded-2xl"
        style={{ background: '#0a0a0a', border: `1px solid ${AMBER}30`, transform: 'translate(-50%, -50%)' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: AMBER }}>
            Conceito
          </span>
          <button onClick={onClose} className="ml-auto text-white/40 hover:text-white/80 text-sm">✕</button>
        </div>
        <h4 className="text-[18px] font-semibold text-white/90 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {concept.term}
        </h4>
        <p className="text-[13px] text-white/65 leading-relaxed">{concept.definition}</p>
        {concept.example && (
          <div className="mt-3 rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.02)', borderLeft: `2px solid ${GREEN}40` }}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-1">Exemplo</p>
            <p className="text-[12px] text-white/55 leading-relaxed">{concept.example}</p>
          </div>
        )}
      </motion.div>
    </>
  )
}

function RefPanel({ refItem, onClose }: { refItem: InlineRef; onClose: () => void }) {
  const kindLabel: Record<InlineRef['kind'], string> = {
    author: 'Pesquisador',
    study: 'Estudo',
    case: 'Case',
    book: 'Livro',
    framework: 'Framework',
  }
  return (
    <>
      <motion.div className="fixed inset-0 z-40"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
      <motion.div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto"
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{ background: '#0a0a0a', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: BLUE }}>
            {kindLabel[refItem.kind]}
          </span>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 text-sm">✕</button>
        </div>
        <div className="px-5 py-5 space-y-4">
          <div>
            <h4 className="text-[18px] font-semibold text-white/90 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {refItem.label}
            </h4>
            {(refItem.year || refItem.affiliation) && (
              <p className="text-[11px] text-white/40">
                {[refItem.affiliation, refItem.year].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
          <p className="text-[13px] text-white/65 leading-relaxed">{refItem.summary}</p>
          {refItem.details && (
            <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-[12px] text-white/55 leading-relaxed">{refItem.details}</p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}
