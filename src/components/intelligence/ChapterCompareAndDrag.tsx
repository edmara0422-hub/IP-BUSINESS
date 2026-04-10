'use client'

/**
 * CHAPTER · COMPARE-AND-DRAG
 *
 * Aplicação do Capítulo 1 (Era Digital — 3 Fases).
 * Duas etapas em sequência:
 *   1. Tabela comparativa (passiva, anima ao entrar)
 *   2. Aluno classifica empresas reais nas 3 fases (tap-to-select → tap-to-zone)
 *
 * Touch-first: sem HTML5 drag (não funciona bem no Capacitor/iOS).
 * Mecânica = tocar no item para selecionar, tocar na zona para soltar.
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ChapterApplicationCompareAndDrag } from '@/types/intelligence'

const COLORS = {
  bg: '#0a0a0a',
  cardBg: 'rgba(255, 255, 255, 0.03)',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.2)',
  text: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.6)',
  textDim: 'rgba(255, 255, 255, 0.38)',
  accent: '#ffffff',
  // Estados de feedback em monocromático
  correct: '#ffffff',                    // acerto = branco sólido
  wrong: 'rgba(255, 255, 255, 0.38)',    // erro = branco esmaecido
  // Diferenciação das 3 fases por intensidade
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

  const placedCount = Object.keys(placements).length
  const totalCount = drag.items.length
  const completed = placedCount === totalCount

  const itemsByZone = useMemo(() => {
    const map: Record<string, string[]> = {}
    drag.zones.forEach((z) => (map[z.id] = []))
    Object.entries(placements).forEach(([itemId, p]) => {
      map[p.zoneId]?.push(itemId)
    })
    return map
  }, [placements, drag.zones])

  function handleSelectItem(itemId: string) {
    if (placements[itemId]) return // já colocado
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
    setSelectedItemId(null)
  }

  function handleReset() {
    setPlacements({})
    setSelectedItemId(null)
  }

  return (
    <div>
      <p
        style={{
          fontSize: 11,
          lineHeight: 1.65,
          color: COLORS.textMuted,
          margin: '0 0 16px 0',
          textAlign: 'justify',
          hyphens: 'auto',
        }}
      >
        {intro}
      </p>

      {/* ── ETAPA 1: TABELA COMPARATIVA ───────────────────────── */}
      <CompareTableView compare={compare} />

      {/* ── ETAPA 2: DRAG (tap-to-place) ──────────────────────── */}
      <div style={{ marginTop: 32 }}>
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
              fontSize: 11,
              lineHeight: 1.55,
              fontWeight: 600,
              color: COLORS.text,
              margin: 0,
            }}
          >
            {drag.instruction}
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

        {/* itens disponíveis (não colocados ainda) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 18,
            minHeight: 48,
            padding: 14,
            background: 'rgba(0, 0, 0, 0.2)',
            border: `1px dashed ${COLORS.border}`,
            borderRadius: 10,
          }}
        >
          {drag.items.filter((i) => !placements[i.id]).length === 0 && (
            <span
              style={{
                fontSize: 10,
                color: COLORS.textDim,
                fontStyle: 'italic',
              }}
            >
              Todas as empresas foram classificadas.
            </span>
          )}
          {drag.items
            .filter((i) => !placements[i.id])
            .map((item) => (
              <ItemChip
                key={item.id}
                label={item.label}
                sublabel={item.sublabel}
                selected={selectedItemId === item.id}
                onClick={() => handleSelectItem(item.id)}
              />
            ))}
        </div>

        {/* zonas */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
          }}
        >
          {drag.zones.map((zone, i) => {
            const phaseColor =
              i === 0 ? COLORS.phase1 : i === 1 ? COLORS.phase2 : COLORS.phase3
            const isActive = selectedItemId !== null
            return (
              <DropZone
                key={zone.id}
                label={zone.label}
                accent={phaseColor}
                active={isActive}
                onClick={() => handleSelectZone(zone.id)}
              >
                {itemsByZone[zone.id]?.map((itemId) => {
                  const item = drag.items.find((i) => i.id === itemId)
                  const placement = placements[itemId]
                  if (!item || !placement) return null
                  return (
                    <PlacedChip
                      key={itemId}
                      label={item.label}
                      correct={placement.correct}
                      feedback={placement.feedback}
                    />
                  )
                })}
              </DropZone>
            )
          })}
        </div>

        {/* fechamento */}
        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                marginTop: 20,
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
                ✓ Classificação completa. Veja os feedbacks em cada zona.
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
// Sub-componentes
// ─────────────────────────────────────────────────────────────────────

function CompareTableView({
  compare,
}: {
  compare: ChapterApplicationCompareAndDrag['compare']
}) {
  const phaseColors = [COLORS.phase1, COLORS.phase2, COLORS.phase3]
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      style={{
        background: COLORS.cardBg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: '18px 4px 10px 4px',
        overflowX: 'auto',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 11,
          tableLayout: 'fixed',
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                textAlign: 'left',
                padding: '6px 12px',
                color: COLORS.textDim,
                fontSize: 9,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                width: '26%',
              }}
            />
            {compare.columnHeaders.map((h, i) => (
              <th
                key={i}
                style={{
                  textAlign: 'left',
                  padding: '6px 12px',
                  color: phaseColors[i],
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {compare.rows.map((row, ri) => (
            <tr
              key={ri}
              style={{
                borderTop: `1px solid ${COLORS.border}`,
              }}
            >
              <td
                style={{
                  padding: '12px 12px',
                  color: COLORS.textMuted,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  verticalAlign: 'top',
                }}
              >
                {row.label}
              </td>
              {row.values.map((v, vi) => (
                <td
                  key={vi}
                  style={{
                    padding: '12px 12px',
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: 11,
                    lineHeight: 1.5,
                    verticalAlign: 'top',
                  }}
                >
                  {/* Visualização opcional */}
                  {row.viz === 'icons' && row.icons && (
                    <div
                      style={{
                        fontSize: 18,
                        lineHeight: 1,
                        color: phaseColors[vi],
                        marginBottom: 6,
                        fontFamily: 'ui-sans-serif, system-ui',
                      }}
                    >
                      {row.icons[vi]}
                    </div>
                  )}
                  {row.viz === 'bars' && row.intensities && (
                    <div
                      style={{
                        width: '100%',
                        height: 4,
                        background: 'rgba(255,255,255,0.06)',
                        borderRadius: 2,
                        overflow: 'hidden',
                        marginBottom: 8,
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${(row.intensities[vi] ?? 0) * 100}%`,
                        }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.7, delay: 0.2 + vi * 0.1 }}
                        style={{
                          height: '100%',
                          background: phaseColors[vi],
                        }}
                      />
                    </div>
                  )}
                  <div>{v}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}

function ItemChip({
  label,
  sublabel,
  selected,
  onClick,
}: {
  label: string
  sublabel?: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? '#ffffff' : COLORS.cardBg,
        color: selected ? '#000000' : COLORS.text,
        border: `1px solid ${selected ? '#ffffff' : COLORS.borderStrong}`,
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: 11,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        textAlign: 'left',
      }}
    >
      <span>{label}</span>
      {sublabel && (
        <span
          style={{
            fontSize: 9,
            fontWeight: 500,
            opacity: 0.7,
          }}
        >
          {sublabel}
        </span>
      )}
    </button>
  )
}

function DropZone({
  label,
  accent,
  active,
  onClick,
  children,
}: {
  label: string
  accent: string
  active: boolean
  onClick: () => void
  children?: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? `${accent}10` : 'rgba(0, 0, 0, 0.2)',
        border: active
          ? `2px dashed ${accent}`
          : `1px solid ${COLORS.border}`,
        borderRadius: 10,
        padding: 14,
        minHeight: 120,
        cursor: active ? 'pointer' : 'default',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        transition: 'all 0.15s',
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: accent,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {children}
      </div>
    </button>
  )
}

function PlacedChip({
  label,
  correct,
  feedback,
}: {
  label: string
  correct: boolean
  feedback: string
}) {
  const accent = correct ? COLORS.correct : COLORS.wrong
  const bgAlpha = correct ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)'
  const borderStyle = correct ? `1px solid ${accent}` : `1px dashed ${accent}`
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      style={{
        background: bgAlpha,
        border: borderStyle,
        borderRadius: 6,
        padding: '8px 10px',
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: accent,
          marginBottom: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span>{correct ? '✓' : '!'}</span>
        <span>{label}</span>
      </div>
      <div
        style={{
          fontSize: 10,
          lineHeight: 1.55,
          color: COLORS.textMuted,
          textAlign: 'justify',
          hyphens: 'auto',
        }}
      >
        {feedback}
      </div>
    </motion.div>
  )
}
