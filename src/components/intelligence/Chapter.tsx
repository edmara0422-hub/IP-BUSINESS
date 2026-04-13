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
} from '@/types/intelligence'
import ChapterCompareAndDrag from './ChapterCompareAndDrag'
import LivingCompany from './LivingCompany'
import { recordExposure } from '@/store/study-memory-store'

interface Props {
  block: ChapterBlock
}

const COLORS = {
  bg: '#0a0a0a',
  cardBg: 'rgba(255, 255, 255, 0.03)',
  border: 'rgba(255, 255, 255, 0.08)',
  text: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.6)',
  textDim: 'rgba(255, 255, 255, 0.38)',
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
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontWeight: 700,
            color: '#ffffff',
            fontSize: '0.95em',
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '1px 6px',
            borderRadius: 3,
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
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
        padding: '32px 28px',
        color: COLORS.text,
        marginBottom: 24,
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
      <section style={{ marginTop: 32 }}>
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
    <header style={{ marginBottom: 24 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.55)',
            textTransform: 'uppercase',
            padding: '3px 9px',
            border: `1px solid rgba(255,255,255,0.25)`,
            borderRadius: 999,
          }}
        >
          Capítulo {number}
        </span>
      </div>
      <h1
        style={{
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: '0.02em',
          color: COLORS.text,
          margin: 0,
          lineHeight: 1.25,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: 11,
            lineHeight: 1.55,
            color: COLORS.textMuted,
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
          color: 'rgba(255,255,255,0.85)',
          marginTop: showTimeline ? 4 : 0,
          textAlign: 'justify',
          hyphens: 'auto',
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
          fontSize: 13,
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.85)',
          margin: '0 0 16px 0',
          textAlign: 'justify',
          hyphens: 'auto',
        }}
      >
        {renderWithHighlights(section.text)}
      </p>
    )
  }

  if (section.kind === 'heading') {
    return (
      <h2
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.18em',
          color: COLORS.textMuted,
          textTransform: 'uppercase',
          margin: '22px 0 10px 0',
        }}
      >
        {section.text}
      </h2>
    )
  }

  if (section.kind === 'phase-card') {
    return <PhaseCard data={section.data} chapterId={chapterId} />
  }

  if (section.kind === 'phase-group') {
    return <PhaseGroup cards={section.cards} chapterId={chapterId} />
  }

  return null
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
            textAlign: 'left',
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
