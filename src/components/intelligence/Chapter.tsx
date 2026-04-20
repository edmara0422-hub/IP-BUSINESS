'use client'

/**
 * CHAPTER — molde unificado A → B → C → D para conteúdo de estudo dirigido.
 *
 *  A · Abertura     visual ambiente + texto introdutório curto
 *  B · Corpo        texto integral preservado + diagramas inline
 *  C · Aplicação    UMA interação focada (delegada a um sub-componente)
 *  D · Síntese      fechamento + ponte para o próximo capítulo
 *
 * Regra inviolável: nenhuma interação no meio do corpo. Aplicação só em C.
 */

import { useState, useEffect, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type {
  ChapterBlock,
  ChapterBodySection,
  ChapterPhaseCard,
  ChapterPillarCard,
  ChapterStepCard,
  ChapterDeepText,
  ChapterDeepTextConcept,
  ChapterDeepTextPause,
  ChapterDeepTextCalc,
  ChapterDeepTextQuote,
  InlineRef,
} from '@/types/intelligence'
import ChapterCompareAndDrag from './ChapterCompareAndDrag'
import LivingCompany from './LivingCompany'
import { recordExposure } from '@/store/study-memory-store'

interface Props {
  block: ChapterBlock
}

const COLORS = {
  bg: 'rgba(0, 0, 0, 0.15)',
  cardBg: 'rgba(255, 255, 255, 0.025)',
  border: 'rgba(255, 255, 255, 0.06)',
  text: 'rgba(255, 255, 255, 0.92)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
  textDim: 'rgba(255, 255, 255, 0.35)',
  accent: '#ffffff',
  // Diferenciação das 3 fases por intensidade (escuro → claro), não por cor
  phase1: 'rgba(255, 255, 255, 0.38)',
  phase2: 'rgba(255, 255, 255, 0.7)',
  phase3: '#ffffff',
}

// ─────────────────────────────────────────────────────────────────────
// Highlight parser — converte {{texto}} em span destacado mono
// Usa-se para fazer números-chave e termos críticos saltarem do texto.
// ─────────────────────────────────────────────────────────────────────
function renderWithHighlights(text: string) {
  const parts = text.split(/(\{\{[^}]+\}\})/g)
  return parts.map((part, i) => {
    if (part.startsWith('{{') && part.endsWith('}}')) {
      return (
        <span
          key={i}
          style={{
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          {part.slice(2, -2)}
        </span>
      )
    }
    return <Fragment key={i}>{part}</Fragment>
  })
}

export default function Chapter({ block }: Props) {
  // Registra que o aluno viu este capítulo (memória Ebbinghaus)
  useEffect(() => {
    recordExposure(
      block.id,
      block.title,
      block.id.split('-')[0] ?? 'M1',
      block.id,
      'read',
    )
  }, [block.id, block.title])

  return (
    <article
      style={{
        background: COLORS.bg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: '20px 16px',
        color: COLORS.text,
        marginBottom: 20,
      }}
    >
      <ChapterHeader
        number={block.number}
        title={block.title}
        subtitle={block.subtitle}
      />

      {/* A — ABERTURA */}
      <ChapterOpening
        leadText={block.opening.leadText}
        showTimeline={block.opening.showTimeline}
      />

      {/* B — CORPO */}
      <section style={{ marginTop: 22 }}>
        {block.body.map((section, i) => (
          <BodySectionRenderer key={i} section={section} chapterId={block.id} />
        ))}
      </section>

      {/* C — APLICAÇÃO */}
      <ChapterDivider label="Hora de aplicar" />
      {block.application.kind === 'compare-and-drag' && (
        <ChapterCompareAndDrag application={block.application} />
      )}

      {/* D — SÍNTESE */}
      <ChapterDivider label="Síntese" />
      <ChapterSynthesis
        closingText={block.synthesis.closingText}
        keyInsights={block.synthesis.keyInsights}
        nextChapterHint={block.synthesis.nextChapterHint}
        nextChapterBlurb={block.synthesis.nextChapterBlurb}
      />
    </article>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────────────────

function ChapterHeader({
  number,
  title,
  subtitle,
}: {
  number: number
  title: string
  subtitle?: string
}) {
  return (
    <header style={{ marginBottom: 28 }}>
      <span
        style={{
          display: 'inline-block',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.22em',
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}
      >
        Capítulo {number}
      </span>
      <h1
        style={{
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: 'rgba(255,255,255,0.95)',
          margin: 0,
          lineHeight: 1.3,
          fontFamily: 'Poppins, system-ui, sans-serif',
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: 11,
            lineHeight: 1.5,
            color: 'rgba(255,255,255,0.45)',
            margin: '6px 0 0 0',
          }}
        >
          {subtitle}
        </p>
      )}
    </header>
  )
}

// ─────────────────────────────────────────────────────────────────────
// A — Opening
// ─────────────────────────────────────────────────────────────────────

function ChapterOpening({
  leadText,
  showTimeline,
}: {
  leadText: string
  showTimeline?: boolean
}) {
  return (
    <section>
      {showTimeline && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '8px 0 18px 0',
          }}
        >
          <LivingCompany phase={1} size="md" label="A empresa antes do salto" />
        </motion.div>
      )}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: showTimeline ? 0.5 : 0 }}
        style={{
          fontSize: 13,
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.8)',
          marginTop: showTimeline ? 8 : 0,
          textAlign: 'justify',
        }}
      >
        {renderWithHighlights(leadText)}
      </motion.p>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────
// B — Body sections
// ─────────────────────────────────────────────────────────────────────

function BodySectionRenderer({ section, chapterId }: { section: ChapterBodySection; chapterId?: string }) {
  if (section.kind === 'paragraph') {
    return (
      <p
        style={{
          fontSize: 12,
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.75)',
          margin: '0 0 14px 0',
          textAlign: 'justify',
        }}
      >
        {renderWithHighlights(section.text)}
      </p>
    )
  }

  if (section.kind === 'heading') {
    return (
      <div style={{ margin: '28px 0 14px', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <h2
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.65)',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          {section.text}
        </h2>
      </div>
    )
  }

  if (section.kind === 'phase-card') {
    return <PhaseCard data={section.data} chapterId={chapterId} />
  }

  if (section.kind === 'phase-group') {
    return <PhaseGroup cards={section.cards} chapterId={chapterId} />
  }

  if (section.kind === 'pillar-grid') {
    return <PillarGrid title={section.title} pillars={section.pillars} />
  }

  if (section.kind === 'step-flow') {
    return <StepFlow title={section.title} steps={section.steps} />
  }

  if (section.kind === 'deep-text') {
    return <DeepTextSection section={section} />
  }

  return null
}

// ─────────────────────────────────────────────────────────────────────
// DeepTextSection — texto profundo com interações inline
// Pílulas conceito, pílulas autor, pare-e-pense, calculadoras, citações
// ─────────────────────────────────────────────────────────────────────

function DeepTextSection({ section }: { section: ChapterDeepText }) {
  const [openConcept, setOpenConcept] = useState<ChapterDeepTextConcept | null>(null)
  const [openRef, setOpenRef] = useState<InlineRef | null>(null)

  const conceptMap = new Map((section.concepts ?? []).map((c) => [c.id, c]))
  const pauseMap = new Map((section.pauses ?? []).map((p) => [p.id, p]))
  const calcMap = new Map((section.calcs ?? []).map((c) => [c.id, c]))
  const quoteMap = new Map((section.quotes ?? []).map((q) => [q.id, q]))
  const refMap = new Map((section.refs ?? []).map((r) => [r.id, r]))

  const paragraphs = section.body.split('\\n\\n').filter((p) => p.trim())

  return (
    <div style={{ margin: '20px 0' }}>
      {section.title && (
        <p style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
          color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: 14,
        }}>
          {section.title}
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {paragraphs.map((para, idx) => {
          const trimmed = para.trim()

          // Block-level: [[pause:id]]
          if (trimmed.match(/^\[\[pause:([^\]]+)\]\]$/)) {
            const id = trimmed.slice(8, -2)
            const p = pauseMap.get(id)
            if (p) return <DeepPause key={idx} pause={p} />
            return null
          }

          // Block-level: [[calc:id]]
          if (trimmed.match(/^\[\[calc:([^\]]+)\]\]$/)) {
            const id = trimmed.slice(7, -2)
            const c = calcMap.get(id)
            if (c) return <DeepCalc key={idx} calc={c} />
            return null
          }

          // Block-level: [[quote:id]]
          if (trimmed.match(/^\[\[quote:([^\]]+)\]\]$/)) {
            const id = trimmed.slice(8, -2)
            const q = quoteMap.get(id)
            if (q) return <DeepQuote key={idx} quote={q} />
            return null
          }

          // Heading: **ALL CAPS**
          if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.slice(2, -2).includes('**')) {
            return (
              <h3 key={idx} style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase',
                margin: '16px 0 4px', paddingTop: 8,
                borderTop: '1px solid rgba(255,255,255,0.05)',
              }}>
                {trimmed.slice(2, -2)}
              </h3>
            )
          }

          // Regular paragraph with inline markup
          return (
            <p key={idx} style={{
              fontSize: 11, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)',
              margin: 0, textAlign: 'justify', hyphens: 'auto',
            }}>
              {renderDeepInline(para, conceptMap, refMap, setOpenConcept, setOpenRef)}
            </p>
          )
        })}
      </div>

      {/* Concept popover — inline, não fixed */}
      <AnimatePresence>
        {openConcept && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', margin: '8px 0' }}>
            <div style={{
              padding: '14px 16px', borderRadius: 14,
              background: 'rgba(154,125,10,0.06)', border: '1px solid rgba(154,125,10,0.2)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: '#9a7d0a', textTransform: 'uppercase' }}>Conceito</span>
                <button onClick={() => setOpenConcept(null)} style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
              </div>
              <h4 style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.9)', margin: '0 0 6px', fontFamily: 'Poppins, system-ui, sans-serif' }}>{openConcept.term}</h4>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0 }}>{openConcept.definition}</p>
              {openConcept.example && (
                <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid rgba(30,132,73,0.4)', borderRadius: 6 }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', margin: '0 0 4px', textTransform: 'uppercase' }}>Exemplo</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0 }}>{openConcept.example}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Author ref — inline */}
      <AnimatePresence>
        {openRef && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', margin: '8px 0' }}>
            <div style={{
              padding: '14px 16px', borderRadius: 14,
              background: 'rgba(46,134,193,0.06)', border: '1px solid rgba(46,134,193,0.2)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: '#2e86c1', textTransform: 'uppercase' }}>Pesquisador</span>
                <button onClick={() => setOpenRef(null)} style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
              </div>
              <h4 style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.9)', margin: '0 0 4px', fontFamily: 'Poppins, system-ui, sans-serif' }}>{openRef.label}</h4>
              {(openRef.year || openRef.affiliation) && (
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '0 0 6px' }}>{[openRef.affiliation, openRef.year].filter(Boolean).join(' · ')}</p>
              )}
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0 }}>{openRef.summary}</p>
              {openRef.details && (
                <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8 }}>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0 }}>{openRef.details}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function renderDeepInline(
  text: string,
  concepts: Map<string, ChapterDeepTextConcept>,
  refs: Map<string, InlineRef>,
  onConcept: (c: ChapterDeepTextConcept) => void,
  onRef: (r: InlineRef) => void,
) {
  // Parse: {{highlight}}, [[concept:id|label]], [[author:id|label]], **bold**
  const regex = /(\{\{[^}]+\}\}|\[\[(?:concept|author):[^\]]+\]\]|\*\*[^*]+\*\*)/g
  const parts: Array<string | { kind: string; id?: string; label?: string; value?: string }> = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    const tok = m[0]
    if (tok.startsWith('{{')) {
      parts.push({ kind: 'highlight', value: tok.slice(2, -2) })
    } else if (tok.startsWith('[[concept:')) {
      const inner = tok.slice(10, -2)
      const pipe = inner.indexOf('|')
      parts.push({ kind: 'concept', id: pipe === -1 ? inner : inner.slice(0, pipe), label: pipe === -1 ? inner : inner.slice(pipe + 1) })
    } else if (tok.startsWith('[[author:')) {
      const inner = tok.slice(9, -2)
      const pipe = inner.indexOf('|')
      parts.push({ kind: 'author', id: pipe === -1 ? inner : inner.slice(0, pipe), label: pipe === -1 ? inner : inner.slice(pipe + 1) })
    } else if (tok.startsWith('**')) {
      parts.push({ kind: 'bold', value: tok.slice(2, -2) })
    }
    last = m.index + tok.length
  }
  if (last < text.length) parts.push(text.slice(last))

  return parts.map((p, i) => {
    if (typeof p === 'string') return <Fragment key={i}>{p}</Fragment>
    if (p.kind === 'highlight') return <span key={i} style={{ color: '#fff', fontWeight: 600 }}>{p.value}</span>
    if (p.kind === 'bold') return <strong key={i} style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>{p.value}</strong>
    if (p.kind === 'concept') {
      const c = concepts.get(p.id!)
      return (
        <button key={i} onClick={() => c && onConcept(c)}
          style={{
            display: 'inline', padding: '0 4px', margin: '0 1px', borderRadius: 4,
            background: 'rgba(154,125,10,0.1)', color: '#9a7d0a',
            borderBottom: '1px dashed rgba(154,125,10,0.5)',
            fontSize: 'inherit', fontFamily: 'inherit', cursor: 'pointer',
            border: 'none', lineHeight: 'inherit',
          }}>
          {p.label}
        </button>
      )
    }
    if (p.kind === 'author') {
      const r = refs.get(p.id!)
      return (
        <button key={i} onClick={() => r && onRef(r)}
          style={{
            display: 'inline', padding: '0 5px', margin: '0 1px', borderRadius: 4,
            background: 'rgba(46,134,193,0.1)', color: '#2e86c1',
            border: '1px solid rgba(46,134,193,0.25)',
            fontSize: 'inherit', fontFamily: 'inherit', cursor: 'pointer',
            lineHeight: 'inherit',
          }}>
          {p.label}
        </button>
      )
    }
    return null
  })
}

function DeepPause({ pause }: { pause: ChapterDeepTextPause }) {
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!answer.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate-probe',
          question: `Pergunta de reflexão: "${pause.question}". Avalie em 2-3 frases.${pause.expectedKeywords?.length ? ` Conceitos esperados: ${pause.expectedKeywords.join(', ')}.` : ''} Termine com APROVADO ou REVISAR.`,
          selectedText: answer,
          submoduleTitle: 'Reflexão',
          history: [],
        }),
      })
      const data = await res.json()
      setFeedback(data.response || 'Resposta recebida.')
    } catch {
      setFeedback('Erro ao conectar.')
    }
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      style={{
        background: 'rgba(154,125,10,0.06)', border: '1px solid rgba(154,125,10,0.25)',
        borderRadius: 14, overflow: 'hidden',
      }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(154,125,10,0.15)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14 }}>🛑</span>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: '#9a7d0a', textTransform: 'uppercase' }}>Pare — responda antes de continuar</span>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, margin: 0, fontFamily: 'Poppins, system-ui, sans-serif' }}>
          {pause.question}
        </p>
        <textarea
          value={answer} onChange={(e) => setAnswer(e.target.value)}
          disabled={!!feedback || loading}
          placeholder="Sua reflexão..."
          rows={3}
          style={{
            width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: 10,
            padding: '10px 12px', fontSize: 13, color: 'rgba(255,255,255,0.75)',
            border: '1px solid rgba(255,255,255,0.06)', outline: 'none', resize: 'none',
            lineHeight: 1.6, fontFamily: 'inherit', opacity: feedback ? 0.6 : 1,
          }}
        />
        {!feedback && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={submit} disabled={!answer.trim() || loading}
              style={{
                fontSize: 11, fontWeight: 500, padding: '8px 14px', borderRadius: 8,
                background: 'rgba(30,132,73,0.15)', color: '#1e8449',
                border: '1px solid rgba(30,132,73,0.3)', cursor: 'pointer',
                opacity: !answer.trim() || loading ? 0.3 : 1,
              }}>
              {loading ? 'IA avaliando...' : 'Receber feedback'}
            </button>
            {pause.hint && (
              <HintButton hint={pause.hint} />
            )}
          </div>
        )}
        {feedback && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ padding: 12, background: 'rgba(255,255,255,0.03)', borderLeft: '2px solid rgba(30,132,73,0.5)', borderRadius: 6 }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#1e8449', letterSpacing: '0.15em', margin: '0 0 4px', textTransform: 'uppercase' }}>Feedback</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{feedback}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function HintButton({ hint }: { hint: string }) {
  const [show, setShow] = useState(false)
  return (
    <>
      <button onClick={() => setShow(!show)}
        style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>
        {show ? 'Ocultar dica' : 'Ver dica'}
      </button>
      {show && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', margin: 0 }}>{hint}</p>}
    </>
  )
}

function DeepCalc({ calc }: { calc: ChapterDeepTextCalc }) {
  const initial: Record<string, number> = {}
  calc.inputs.forEach((i) => { initial[i.id] = i.default })
  const [values, setValues] = useState(initial)

  let result = 0
  try {
    const fn = new Function(...Object.keys(values), `return ${calc.formula}`)
    result = fn(...Object.values(values)) as number
  } catch { /* */ }

  const formatted = calc.resultFormat === 'currency'
    ? `R$ ${Math.round(result).toLocaleString('pt-BR')}`
    : calc.resultFormat === 'percent'
    ? `${result.toFixed(1)}%`
    : Math.round(result).toLocaleString('pt-BR')

  const interp = calc.interpretation?.find((i) => result <= i.max)
  const interpColor = interp ? (interp.color === 'green' ? '#1e8449' : interp.color === 'amber' ? '#9a7d0a' : '#c0392b') : '#2e86c1'

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      style={{ background: 'rgba(46,134,193,0.06)', border: '1px solid rgba(46,134,193,0.25)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(46,134,193,0.15)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14 }}>🎚️</span>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: '#2e86c1', textTransform: 'uppercase' }}>Calcule ao vivo</span>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.8)', margin: 0, fontFamily: 'Poppins, system-ui, sans-serif' }}>{calc.title}</p>
        {calc.inputs.map((input) => (
          <div key={input.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.05em' }}>{input.label}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'ui-monospace, monospace' }}>{values[input.id]} {input.unit}</span>
            </div>
            <input type="range" min={input.min} max={input.max} value={values[input.id]}
              onChange={(e) => setValues({ ...values, [input.id]: Number(e.target.value) })}
              style={{ width: '100%', height: 4, borderRadius: 2, appearance: 'none', cursor: 'pointer',
                background: `linear-gradient(to right, #2e86c1 0%, #2e86c1 ${((values[input.id] - input.min) / (input.max - input.min)) * 100}%, rgba(255,255,255,0.08) ${((values[input.id] - input.min) / (input.max - input.min)) * 100}%, rgba(255,255,255,0.08) 100%)`,
              }}
            />
          </div>
        ))}
        <div style={{ paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', margin: '0 0 4px', textTransform: 'uppercase' }}>{calc.resultLabel}</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: interpColor, margin: 0, fontFamily: 'Poppins, system-ui, sans-serif' }}>{formatted}</p>
          {interp && <p style={{ fontSize: 11, color: interpColor, margin: '4px 0 0' }}>{interp.label}</p>}
        </div>
      </div>
    </motion.div>
  )
}

function DeepQuote({ quote }: { quote: ChapterDeepTextQuote }) {
  const [arguing, setArguing] = useState(false)
  const [argument, setArgument] = useState('')
  const [counter, setCounter] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!argument.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'explain',
          question: `Você é ${quote.author}${quote.year ? ` (${quote.year})` : ''}. Defendeu: "${quote.text}". Aluno discorda: "${argument}". Responda DEFENDENDO sua posição em 3-4 frases no estilo do autor. Não concorde facilmente.`,
          submoduleTitle: 'Citação interativa',
          history: [],
        }),
      })
      const data = await res.json()
      setCounter(data.response || '')
    } catch {
      setCounter('Erro ao conectar.')
    }
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 14 }}>⚡</span>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>Escrito pelo autor</span>
      </div>
      <blockquote style={{ paddingLeft: 12, borderLeft: '2px solid rgba(46,134,193,0.5)', margin: 0 }}>
        <p style={{ fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0, fontFamily: 'Georgia, serif' }}>
          &ldquo;{quote.text}&rdquo;
        </p>
        <footer style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
          — {quote.author}{quote.year ? `, ${quote.year}` : ''}{quote.source ? ` · ${quote.source}` : ''}
        </footer>
      </blockquote>
      {!arguing && !counter && quote.challenge && (
        <button onClick={() => setArguing(true)}
          style={{ marginTop: 12, fontSize: 11, fontWeight: 500, padding: '6px 12px', borderRadius: 8, background: 'rgba(192,57,43,0.1)', color: '#c0392b', border: '1px solid rgba(192,57,43,0.25)', cursor: 'pointer' }}>
          Discordar do autor →
        </button>
      )}
      {arguing && !counter && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{quote.challenge}</p>
          <textarea value={argument} onChange={(e) => setArgument(e.target.value)} placeholder="Por que você discorda?" rows={3}
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 12px', fontSize: 12, color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.06)', outline: 'none', resize: 'none', lineHeight: 1.6, fontFamily: 'inherit' }} />
          <button onClick={submit} disabled={!argument.trim() || loading}
            style={{ fontSize: 11, fontWeight: 500, padding: '8px 14px', borderRadius: 8, background: 'rgba(46,134,193,0.15)', color: '#2e86c1', border: '1px solid rgba(46,134,193,0.3)', cursor: 'pointer', opacity: !argument.trim() || loading ? 0.3 : 1 }}>
            {loading ? `${quote.author.split(' ')[0]} pensando...` : `Enviar para ${quote.author.split(' ')[0]}`}
          </button>
        </div>
      )}
      {counter && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ marginTop: 12, padding: 12, background: 'rgba(46,134,193,0.06)', borderLeft: '2px solid rgba(46,134,193,0.4)', borderRadius: 6 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: '#2e86c1', letterSpacing: '0.15em', margin: '0 0 4px', textTransform: 'uppercase' }}>Resposta de {quote.author}</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>{counter}</p>
        </motion.div>
      )}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// PillarGrid — grid 2×2 de pilares (visual de "fundação")
// Cada pilar é um bloco com ícone, título, descrição, métrica e case.
// ─────────────────────────────────────────────────────────────────────

function PillarGrid({ title, pillars }: { title?: string; pillars: ChapterPillarCard[] }) {
  return (
    <div style={{ margin: '24px 0' }}>
      {title && (
        <p style={{
          fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', marginBottom: 14,
        }}>
          {title}
        </p>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12,
      }}>
        {pillars.map((p, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.4 }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14,
              padding: '14px 14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>{p.icon}</span>
              <span style={{
                fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)',
                fontFamily: 'Poppins, system-ui, sans-serif',
              }}>
                {p.title}
              </span>
            </div>
            <p style={{
              fontSize: 11, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)',
              margin: 0,
            }}>
              {renderWithHighlights(p.description)}
            </p>
            {p.metric && (
              <div style={{
                display: 'flex', alignItems: 'baseline', gap: 6,
                marginTop: 4,
              }}>
                <span style={{
                  fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.9)',
                  fontFamily: 'Poppins, system-ui, sans-serif',
                }}>
                  {p.metric.value}
                </span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
                  {p.metric.label}
                </span>
              </div>
            )}
            {p.caseCompany && (
              <div style={{
                marginTop: 2, padding: '6px 10px',
                background: 'rgba(255,255,255,0.02)',
                borderLeft: '2px solid rgba(255,255,255,0.1)',
                borderRadius: 6,
              }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
                  {p.caseCompany}
                </span>
                {p.caseResult && (
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', margin: '2px 0 0', lineHeight: 1.5 }}>
                    {p.caseResult}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// StepFlow — fluxo horizontal/vertical de passos numerados
// Visual de "jornada" com números circulares e setas entre passos.
// ─────────────────────────────────────────────────────────────────────

function StepFlow({ title, steps }: { title?: string; steps: ChapterStepCard[] }) {
  return (
    <div style={{ margin: '24px 0' }}>
      {title && (
        <p style={{
          fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', marginBottom: 16,
        }}>
          {title}
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {steps.map((s, i) => (
          <Fragment key={i}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.35 }}
              style={{
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
                padding: '12px 0',
              }}>
              {/* Número circular */}
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)',
                fontFamily: 'Poppins, system-ui, sans-serif',
              }}>
                {s.number}
              </div>
              {/* Conteúdo */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)',
                  margin: 0, fontFamily: 'Poppins, system-ui, sans-serif',
                }}>
                  {s.title}
                </p>
                <p style={{
                  fontSize: 11, lineHeight: 1.65, color: 'rgba(255,255,255,0.55)',
                  margin: '4px 0 0',
                }}>
                  {renderWithHighlights(s.description)}
                </p>
                {s.author && (
                  <p style={{
                    fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 4,
                    fontStyle: 'italic',
                  }}>
                    {s.author}
                  </p>
                )}
                {s.caseSnippet && (
                  <p style={{
                    fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4,
                    paddingLeft: 8, borderLeft: '2px solid rgba(255,255,255,0.08)',
                  }}>
                    {s.caseSnippet}
                  </p>
                )}
              </div>
            </motion.div>
            {/* Linha entre passos */}
            {i < steps.length - 1 && (
              <div style={{
                width: 1, height: 12, marginLeft: 15,
                background: 'rgba(255,255,255,0.08)',
              }} />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// PhaseGroup — 3 phase cards conectados por uma trajetória vertical
// que evolui de cinza fraco (Fase 1) a branco puro (Fase 3),
// reforçando visualmente que existe uma evolução, não 3 itens soltos.
// ─────────────────────────────────────────────────────────────────────

function PhaseGroup({ cards, chapterId }: { cards: ChapterPhaseCard[]; chapterId?: string }) {
  return (
    <div
      style={{
        position: 'relative',
        paddingLeft: 28,
        margin: '4px 0 18px 0',
      }}
    >
      {/* trajetória vertical: gradiente que escurece pra clarear */}
      <div
        style={{
          position: 'absolute',
          left: 11,
          top: 24,
          bottom: 24,
          width: 1,
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,1) 100%)',
        }}
      />
      {cards.map((card, i) => {
        const dotColor =
          card.index === 1
            ? COLORS.phase1
            : card.index === 2
              ? COLORS.phase2
              : COLORS.phase3
        return (
          <div key={i} style={{ position: 'relative' }}>
            {/* nó da trajetória */}
            <div
              style={{
                position: 'absolute',
                left: -22,
                top: 22,
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: dotColor,
                border: '2px solid #0a0a0a',
                boxShadow: `0 0 0 1px ${dotColor}`,
                zIndex: 2,
              }}
            />
            <PhaseCard data={card} chapterId={chapterId} />
          </div>
        )
      })}
    </div>
  )
}

function PhaseCard({ data, chapterId }: { data: ChapterPhaseCard; chapterId?: string }) {
  const [expanded, setExpanded] = useState(false)
  const accent =
    data.index === 1
      ? COLORS.phase1
      : data.index === 2
        ? COLORS.phase2
        : COLORS.phase3
  const hasDeep = !!data.deepDive

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      style={{
        background: COLORS.cardBg,
        border: `1px solid ${COLORS.border}`,
        borderLeft: `3px solid ${accent}`,
        borderRadius: 12,
        padding: '18px 20px',
        margin: '0 0 16px 0',
      }}
    >
      {/* Organismo vivo desta fase, no topo do card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '4px 0 14px 0',
        }}
      >
        <LivingCompany phase={data.index} size="md" />
      </motion.div>

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 10,
          marginBottom: 8,
          flexWrap: 'wrap',
        }}
      >
        <h3
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.02em',
            color: accent,
            margin: 0,
          }}
        >
          {data.title}
        </h3>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: COLORS.textDim,
            letterSpacing: '0.08em',
            fontFamily: 'ui-monospace, monospace',
          }}
        >
          {data.period}
        </span>
      </div>
      <p
        style={{
          fontSize: 13,
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.85)',
          margin: '0 0 12px 0',
          textAlign: 'justify',
          hyphens: 'auto',
        }}
      >
        {renderWithHighlights(data.text)}
      </p>
      <div
        style={{
          fontSize: 11,
          color: COLORS.textMuted,
          padding: '10px 12px',
          background: 'rgba(255, 255, 255, 0.025)',
          borderRadius: 6,
          borderLeft: `2px solid ${accent}`,
          lineHeight: 1.6,
          textAlign: 'justify',
          hyphens: 'auto',
        }}
      >
        <span style={{ color: accent, fontWeight: 700, letterSpacing: '0.02em' }}>
          ▸ {data.caseStudy.company} · {data.caseStudy.year}
        </span>
        <br />
        {renderWithHighlights(data.caseStudy.story)}
      </div>

      {/* DEEP DIVE — tap to expand */}
      {hasDeep && (
        <>
          <button
            onClick={() => {
              const next = !expanded
              setExpanded(next)
              if (next && chapterId) {
                recordExposure(
                  `${chapterId}-deepdive-fase${data.index}`,
                  `${data.title} — DeepDive`,
                  chapterId.split('-')[0] ?? 'M1',
                  chapterId,
                  'deepdive',
                )
              }
            }}
            style={{
              marginTop: 12,
              background: 'transparent',
              border: 'none',
              color: COLORS.textDim,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              padding: '4px 0',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>{expanded ? '−' : '+'}</span>
            <span>{expanded ? 'Recolher' : 'Aprofundar'}</span>
          </button>
          <AnimatePresence initial={false}>
            {expanded && data.deepDive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 14,
                    borderTop: `1px solid ${COLORS.border}`,
                  }}
                >
                  {/* Key numbers */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(110px, 1fr))',
                      gap: 10,
                      marginBottom: 14,
                    }}
                  >
                    {data.deepDive.keyNumbers.map((kn, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '8px 10px',
                          background: 'rgba(255, 255, 255, 0.035)',
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: 5,
                        }}
                      >
                        <div
                          style={{
                            fontFamily: 'ui-monospace, monospace',
                            fontSize: 13,
                            fontWeight: 700,
                            color: '#ffffff',
                            letterSpacing: '0.01em',
                            marginBottom: 2,
                          }}
                        >
                          {kn.value}
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            color: COLORS.textDim,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            lineHeight: 1.4,
                          }}
                        >
                          {kn.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quote */}
                  {data.deepDive.quote && (
                    <blockquote
                      style={{
                        margin: '0 0 12px 0',
                        padding: '8px 0 8px 14px',
                        borderLeft: `2px solid ${accent}`,
                        fontSize: 11,
                        lineHeight: 1.6,
                        color: COLORS.textMuted,
                        fontStyle: 'italic',
                      }}
                    >
                      &ldquo;{data.deepDive.quote.text}&rdquo;
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 9,
                          fontStyle: 'normal',
                          color: COLORS.textDim,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                        }}
                      >
                        — {data.deepDive.quote.author}
                      </div>
                    </blockquote>
                  )}

                  {/* Insight de fechamento */}
                  <div
                    style={{
                      fontSize: 11,
                      lineHeight: 1.6,
                      color: '#ffffff',
                      fontWeight: 500,
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: 5,
                      textAlign: 'justify',
                      hyphens: 'auto',
                    }}
                  >
                    {renderWithHighlights(data.deepDive.insight)}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Divider
// ─────────────────────────────────────────────────────────────────────

function ChapterDivider({ label }: { label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        margin: '36px 0 20px 0',
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.55)',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 1,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.18), transparent)',
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// D — Synthesis
// ─────────────────────────────────────────────────────────────────────

function ChapterSynthesis({
  closingText,
  keyInsights,
  nextChapterHint,
  nextChapterBlurb,
}: {
  closingText: string
  keyInsights?: string[]
  nextChapterHint?: string
  nextChapterBlurb?: string
}) {
  return (
    <section
      style={{
        background: 'rgba(255, 255, 255, 0.025)',
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: '22px 22px',
      }}
    >
      {/* Frase-chave em destaque */}
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.55,
          color: '#ffffff',
          fontWeight: 500,
          margin: '0 0 18px 0',
          letterSpacing: '-0.005em',
          textAlign: 'justify',
          hyphens: 'auto',
        }}
      >
        {renderWithHighlights(closingText)}
      </p>

      {/* Bullets de fechamento */}
      {keyInsights && keyInsights.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 22px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {keyInsights.map((insight, i) => (
            <li
              key={i}
              style={{
                fontSize: 11,
                lineHeight: 1.6,
                color: COLORS.textMuted,
                padding: '6px 0 6px 22px',
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 14,
                  width: 12,
                  height: 1,
                  background: 'rgba(255, 255, 255, 0.35)',
                }}
              />
              {renderWithHighlights(insight)}
            </li>
          ))}
        </ul>
      )}

      {/* CTA do próximo capítulo */}
      {nextChapterHint && (
        <button
          type="button"
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.04)',
            border: `1px solid rgba(255, 255, 255, 0.22)`,
            borderRadius: 8,
            padding: '14px 16px',
            cursor: 'pointer',
            textAlign: 'justify',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            transition: 'all 0.15s',
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: COLORS.textDim,
              textTransform: 'uppercase',
            }}
          >
            Próximo capítulo
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#ffffff',
              letterSpacing: '0.01em',
            }}
          >
            {nextChapterHint} →
          </div>
          {nextChapterBlurb && (
            <div
              style={{
                fontSize: 11,
                lineHeight: 1.5,
                color: COLORS.textMuted,
                marginTop: 2,
              }}
            >
              {nextChapterBlurb}
            </div>
          )}
        </button>
      )}
    </section>
  )
}
