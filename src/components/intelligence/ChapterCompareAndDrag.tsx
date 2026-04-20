'use client'

/**
 * CHAPTER · COMPARE-AND-DRAG (versão "Empresa Viva")
 *
 * Aplicação do Capítulo 1 — substitui completamente a tabela e o drag
 * mecânico por uma comparação visual dos 3 organismos da empresa nas
 * 3 fases (LivingCompany), seguida de uma classificação onde o aluno
 * "alimenta" cada organismo com empresas reais.
 *
 * Etapa 1: 3 organismos lado a lado + dimensões abaixo (não é tabela,
 *          é a empresa viva nos 3 estados).
 *
 * Etapa 2: cards descritivos das 5 empresas. Aluno toca um card → ele
 *          se eleva → toca o organismo certo → o organismo "engole" o
 *          card e a empresa vira um nó dentro dele.
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ChapterApplicationCompareAndDrag } from '@/types/intelligence'
import LivingCompany from './LivingCompany'

const COLORS = {
  bg: '#0a0a0a',
  cardBg: 'rgba(255, 255, 255, 0.03)',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.2)',
  text: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.6)',
  textDim: 'rgba(255, 255, 255, 0.38)',
  accent: '#ffffff',
  correct: '#ffffff',
  wrong: 'rgba(255, 255, 255, 0.38)',
  phase1: 'rgba(255, 255, 255, 0.38)',
  phase2: 'rgba(255, 255, 255, 0.7)',
  phase3: '#ffffff',
}

interface Props {
  application: ChapterApplicationCompareAndDrag
}

type Placement = {
  zoneId: string
  correct: boolean
  feedback: string
}

export default function ChapterCompareAndDrag({ application }: Props) {
  const { intro, compare, drag } = application

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [placements, setPlacements] = useState<Record<string, Placement>>({})
  const [lastFeedback, setLastFeedback] = useState<{
    text: string
    correct: boolean
  } | null>(null)

  const placedCount = Object.keys(placements).length
  const totalCount = drag.items.length
  const completed = placedCount === totalCount

  const itemsByZone = useMemo(() => {
    const map: Record<string, Array<{ id: string; label: string }>> = {}
    drag.zones.forEach((z) => (map[z.id] = []))
    Object.entries(placements).forEach(([itemId, p]) => {
      const item = drag.items.find((i) => i.id === itemId)
      if (item) {
        map[p.zoneId]?.push({ id: item.id, label: item.label })
      }
    })
    return map
  }, [placements, drag.zones, drag.items])

  function handleSelectItem(itemId: string) {
    if (placements[itemId]) return
    setSelectedItemId((prev) => (prev === itemId ? null : itemId))
  }

  function handleSelectZone(zoneId: string) {
    if (!selectedItemId) return
    const item = drag.items.find((i) => i.id === selectedItemId)
    if (!item) return

    const correct = item.correctZone === zoneId
    setPlacements((prev) => ({
      ...prev,
      [item.id]: {
        zoneId,
        correct,
        feedback: correct ? item.correctFeedback : item.wrongFeedback,
      },
    }))
    setLastFeedback({
      text: correct ? item.correctFeedback : item.wrongFeedback,
      correct,
    })
    setSelectedItemId(null)
  }

  function handleReset() {
    setPlacements({})
    setSelectedItemId(null)
    setLastFeedback(null)
  }

  return (
    <div>
      <p
        style={{
          fontSize: 10,
          lineHeight: 1.55,
          color: COLORS.textMuted,
          margin: '0 0 14px 0',
          textAlign: 'justify',
          hyphens: 'auto',
        }}
      >
        {intro}
      </p>

      {/* ── ETAPA 1: 3 ORGANISMOS LADO A LADO ─────────────────────
           Quando há item selecionado, os organismos viram alvos
           clicáveis (pulsam e brilham). É a substituição dos
           botões redundantes "Alimentar Fase X". */}
      <ThreeOrganisms
        compare={compare}
        placements={itemsByZone}
        zones={drag.zones}
        selectionActive={!!selectedItemId}
        onSelectZone={handleSelectZone}
      />

      {/* ── ETAPA 2: CARDS DE EMPRESAS PARA CLASSIFICAR ──────── */}
      <div style={{ marginTop: 18 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 12,
            flexWrap: 'wrap',
          }}
        >
          <p
            style={{
              fontSize: 10,
              lineHeight: 1.45,
              fontWeight: 600,
              color: COLORS.text,
              margin: 0,
            }}
          >
            {selectedItemId
              ? '↑ Toque no organismo da fase em que essa empresa opera hoje'
              : drag.instruction}
          </p>
          <span
            style={{
              fontSize: 10,
              color: completed ? COLORS.text : COLORS.textDim,
              fontWeight: 600,
              fontFamily: 'ui-monospace, monospace',
            }}
          >
            {placedCount} / {totalCount}
          </span>
        </div>

        {/* Cards de empresa para classificar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            marginBottom: 14,
          }}
        >
          {drag.items
            .filter((i) => !placements[i.id])
            .map((item) => (
              <CompanyCard
                key={item.id}
                label={item.label}
                sublabel={item.sublabel}
                selected={selectedItemId === item.id}
                anyOtherSelected={
                  selectedItemId !== null && selectedItemId !== item.id
                }
                onClick={() => handleSelectItem(item.id)}
              />
            ))}
          {drag.items.filter((i) => !placements[i.id]).length === 0 && (
            <div
              style={{
                fontSize: 10,
                color: COLORS.textDim,
                fontStyle: 'italic',
                padding: '14px 0',
                textAlign: 'center',
                border: `1px dashed ${COLORS.border}`,
                borderRadius: 8,
              }}
            >
              Todas as empresas foram alimentadas aos organismos.
            </div>
          )}
        </div>

        {/* Feedback contextual da última classificação */}
        <AnimatePresence>
          {lastFeedback && (
            <motion.div
              key={lastFeedback.text}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                fontSize: 11,
                lineHeight: 1.6,
                color: lastFeedback.correct ? COLORS.text : COLORS.textMuted,
                padding: '12px 14px',
                background: 'rgba(255, 255, 255, 0.025)',
                border: `1px ${lastFeedback.correct ? 'solid' : 'dashed'} ${
                  lastFeedback.correct ? COLORS.text : COLORS.textDim
                }`,
                borderRadius: 8,
                marginBottom: 12,
                textAlign: 'justify',
                hyphens: 'auto',
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  marginRight: 6,
                }}
              >
                {lastFeedback.correct ? '✓' : '!'}
              </span>
              {lastFeedback.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fechamento da etapa */}
        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                marginTop: 8,
                padding: '14px 18px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: `1px solid rgba(255, 255, 255, 0.18)`,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: 11, color: COLORS.text, fontWeight: 600 }}>
                ✓ Os 3 organismos estão completos. Você acabou de mapear o
                tecido digital do Brasil.
              </span>
              <button
                onClick={handleReset}
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: COLORS.textMuted,
                  background: 'transparent',
                  border: `1px solid ${COLORS.border}`,
                  padding: '6px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                Refazer
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// THREE ORGANISMS — substitui a tabela
// ─────────────────────────────────────────────────────────────────────

function ThreeOrganisms({
  compare,
  placements,
  zones,
  selectionActive,
  onSelectZone,
}: {
  compare: ChapterApplicationCompareAndDrag['compare']
  placements: Record<string, Array<{ id: string; label: string }>>
  zones: ChapterApplicationCompareAndDrag['drag']['zones']
  selectionActive: boolean
  onSelectZone: (zoneId: string) => void
}) {
  const phases: Array<{ idx: 1 | 2 | 3; zoneId: string }> = zones.map(
    (z, i) => ({ idx: (i + 1) as 1 | 2 | 3, zoneId: z.id })
  )
  const phaseColors = [COLORS.phase1, COLORS.phase2, COLORS.phase3]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      style={{
        background: COLORS.cardBg,
        border: `1px solid ${
          selectionActive ? 'rgba(255,255,255,0.22)' : COLORS.border
        }`,
        borderRadius: 12,
        padding: '14px 10px',
        transition: 'border-color 0.25s',
      }}
    >
      {/* 3 organismos lado a lado — quando selectionActive=true viram alvos */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 5,
          marginBottom: 14,
        }}
      >
        {phases.map((p, i) => (
          <OrganismTarget
            key={p.idx}
            phase={p.idx}
            label={compare.columnHeaders[i]}
            phaseColor={phaseColors[i]}
            extras={placements[p.zoneId] ?? []}
            active={selectionActive}
            onClick={() => onSelectZone(p.zoneId)}
          />
        ))}
      </div>

      {/* dimensões abaixo (legendas das 3 colunas) */}
      <div
        style={{
          borderTop: `1px solid ${COLORS.border}`,
          paddingTop: 14,
        }}
      >
        {compare.rows.map((row, ri) => (
          <div
            key={ri}
            style={{
              display: 'grid',
              gridTemplateColumns: '70px 1fr 1fr 1fr',
              gap: 4,
              padding: '7px 0',
              borderBottom:
                ri === compare.rows.length - 1
                  ? 'none'
                  : `1px solid ${COLORS.border}`,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: 8,
                fontWeight: 600,
                color: COLORS.textDim,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                lineHeight: 1.3,
              }}
            >
              {row.label}
            </div>
            {row.values.map((v, vi) => (
              <div
                key={vi}
                style={{
                  fontSize: 9,
                  lineHeight: 1.35,
                  color: 'rgba(255,255,255,0.78)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  wordBreak: 'break-word',
                  overflow: 'hidden',
                }}
              >
                {/* indicador visual de intensidade quando viz=bars */}
                {row.viz === 'bars' && row.intensities && (
                  <div
                    style={{
                      width: 14,
                      height: 3,
                      background: 'rgba(255,255,255,0.06)',
                      borderRadius: 1.5,
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${(row.intensities[vi] ?? 0) * 100}%`,
                      }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.6, delay: 0.2 + vi * 0.1 }}
                      style={{
                        height: '100%',
                        background: phaseColors[vi],
                      }}
                    />
                  </div>
                )}
                {row.viz === 'icons' && row.icons && (
                  <span
                    style={{
                      color: phaseColors[vi],
                      fontSize: 10,
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {row.icons[vi]}
                  </span>
                )}
                <span>{v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// ORGANISM TARGET — organismo clicável (alvo de classificação)
// Quando active=true (há um card selecionado), pulsa e fica clicável.
// Quando active=false, é só visualização normal.
// ─────────────────────────────────────────────────────────────────────

function OrganismTarget({
  phase,
  label,
  phaseColor,
  extras,
  active,
  onClick,
}: {
  phase: 1 | 2 | 3
  label: string
  phaseColor: string
  extras: Array<{ id: string; label: string }>
  active: boolean
  onClick: () => void
}) {
  const inner = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <LivingCompany phase={phase} size="sm" extras={extras} />
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: phaseColor,
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 1.35,
        }}
      >
        {label}
      </div>
    </div>
  )

  if (!active) {
    return <div>{inner}</div>
  }

  // Intensidade do halo proporcional à fase: Fase 1 quase imperceptível,
  // Fase 3 brilho completo. Reforça a metáfora visual.
  const haloAlpha =
    phase === 1 ? 'rgba(255,255,255,0.04)' : phase === 2 ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.18)'
  const bgAlpha =
    phase === 1 ? 'rgba(255,255,255,0.015)' : phase === 2 ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.06)'
  const scaleMax = phase === 1 ? 1.015 : phase === 2 ? 1.025 : 1.04
  const duration = phase === 1 ? 2.4 : phase === 2 ? 1.9 : 1.5

  return (
    <motion.button
      type="button"
      onClick={onClick}
      animate={{
        scale: [1, scaleMax, 1],
        boxShadow: [
          '0 0 0 0 rgba(255,255,255,0)',
          `0 0 0 4px ${haloAlpha}`,
          '0 0 0 0 rgba(255,255,255,0)',
        ],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileTap={{ scale: 0.96 }}
      style={{
        background: bgAlpha,
        border: `1.5px dashed ${phaseColor}`,
        borderRadius: 12,
        padding: '10px 6px 8px 6px',
        cursor: 'pointer',
        width: '100%',
      }}
    >
      {inner}
    </motion.button>
  )
}

// ─────────────────────────────────────────────────────────────────────
// COMPANY CARD — card descritivo da empresa a ser classificada
// ─────────────────────────────────────────────────────────────────────

function CompanyCard({
  label,
  sublabel,
  selected,
  anyOtherSelected,
  onClick,
}: {
  label: string
  sublabel?: string
  selected: boolean
  anyOtherSelected?: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      animate={{
        scale: selected ? 1.015 : 1,
        opacity: anyOtherSelected ? 0.4 : 1,
      }}
      transition={{ duration: 0.15 }}
      style={{
        background: selected ? 'rgba(255,255,255,0.08)' : COLORS.cardBg,
        color: COLORS.text,
        border: `1px solid ${selected ? '#ffffff' : COLORS.borderStrong}`,
        borderLeft: `3px solid ${selected ? '#ffffff' : 'rgba(255,255,255,0.35)'}`,
        borderRadius: 8,
        padding: '12px 14px',
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        width: '100%',
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.01em',
          color: COLORS.text,
        }}
      >
        {label}
      </div>
      {sublabel && (
        <div
          style={{
            fontSize: 10,
            lineHeight: 1.5,
            color: COLORS.textMuted,
            fontWeight: 500,
          }}
        >
          {sublabel}
        </div>
      )}
    </motion.button>
  )
}
