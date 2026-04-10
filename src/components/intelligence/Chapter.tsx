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

import { motion } from 'framer-motion'
import type {
  ChapterBlock,
  ChapterBodySection,
  ChapterPhaseCard,
} from '@/types/intelligence'
import ChapterCompareAndDrag from './ChapterCompareAndDrag'

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

export default function Chapter({ block }: Props) {
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
        estimatedMinutes={block.estimatedMinutes}
      />

      {/* A — ABERTURA */}
      <ChapterOpening
        leadText={block.opening.leadText}
        showTimeline={block.opening.showTimeline}
      />

      {/* B — CORPO */}
      <section style={{ marginTop: 32 }}>
        {block.body.map((section, i) => (
          <BodySectionRenderer key={i} section={section} />
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
        nextChapterHint={block.synthesis.nextChapterHint}
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
  estimatedMinutes,
}: {
  number: number
  title: string
  subtitle?: string
  estimatedMinutes: number
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
        <span style={{ fontSize: 10, color: COLORS.textDim, fontFamily: 'ui-monospace, monospace' }}>
          {estimatedMinutes} min
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
      {showTimeline && <Timeline3Phases />}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: showTimeline ? 0.6 : 0 }}
        style={{
          fontSize: 13,
          lineHeight: 1.625,
          color: 'rgba(255,255,255,0.85)',
          marginTop: showTimeline ? 20 : 0,
          textAlign: 'justify',
          hyphens: 'auto',
        }}
      >
        {leadText}
      </motion.p>
    </section>
  )
}

function Timeline3Phases() {
  const points = [
    { x: 8, label: '2000', color: COLORS.phase1 },
    { x: 50, label: '2010', color: COLORS.phase2 },
    { x: 92, label: '2020 →', color: COLORS.phase3 },
  ]
  return (
    <div
      style={{
        position: 'relative',
        height: 64,
        marginBottom: 8,
      }}
    >
      <svg
        viewBox="0 0 100 30"
        style={{ width: '100%', height: '100%' }}
        preserveAspectRatio="none"
      >
        <motion.line
          x1="8"
          y1="15"
          x2="92"
          y2="15"
          stroke={COLORS.border}
          strokeWidth="0.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        {points.map((p, i) => (
          <motion.circle
            key={p.label}
            cx={p.x}
            cy="15"
            r="1.6"
            fill={p.color}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.18 }}
          />
        ))}
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          justifyContent: 'space-between',
          paddingInline: '4%',
          alignItems: 'flex-end',
          pointerEvents: 'none',
        }}
      >
        {points.map((p, i) => (
          <motion.span
            key={p.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.18 }}
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: p.color,
              letterSpacing: '0.04em',
            }}
          >
            {p.label}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// B — Body sections
// ─────────────────────────────────────────────────────────────────────

function BodySectionRenderer({ section }: { section: ChapterBodySection }) {
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
        {section.text}
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
    return <PhaseCard data={section.data} />
  }

  return null
}

function PhaseCard({ data }: { data: ChapterPhaseCard }) {
  const accent =
    data.index === 1
      ? COLORS.phase1
      : data.index === 2
        ? COLORS.phase2
        : COLORS.phase3

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
        padding: '20px 22px',
        margin: '0 0 18px 0',
      }}
    >
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
        {data.text}
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
        {data.caseStudy.story}
      </div>
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
  nextChapterHint,
}: {
  closingText: string
  nextChapterHint?: string
}) {
  return (
    <section>
      <p
        style={{
          fontSize: 13,
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.85)',
          margin: '0 0 14px 0',
          textAlign: 'justify',
          hyphens: 'auto',
        }}
      >
        {closingText}
      </p>
      {nextChapterHint && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: `1px solid rgba(255, 255, 255, 0.18)`,
            borderRadius: 6,
            fontSize: 11,
            color: COLORS.text,
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          {nextChapterHint} →
        </div>
      )}
    </section>
  )
}
