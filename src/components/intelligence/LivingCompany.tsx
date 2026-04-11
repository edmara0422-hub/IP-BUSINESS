'use client'

/**
 * LIVING COMPANY — organismo visual da "empresa viva" nos 3 estados
 * que representam as 3 fases da Era Digital.
 *
 *   phase=1  Infraestrutura → 6 setores desconectados, sala de TI no canto
 *                              com LEDs piscando, dados parados em silos
 *
 *   phase=2  Processo → setores costurados por linhas de fluxo, TI no
 *                       centro como hub, dados circulando entre eles
 *
 *   phase=3  Estratégia → setores fundidos num núcleo central pulsante,
 *                         partículas orbitando, sem distinção interna
 *
 * É o coração visual do Capítulo 1 — usado em phase cards, tabela
 * comparativa e classificação. Reusa a mesma linguagem em toda parte.
 */

import { motion } from 'framer-motion'
import { useId } from 'react'

interface Props {
  phase: 1 | 2 | 3
  size?: 'sm' | 'md' | 'lg'
  label?: string
  /** empresas que o aluno colocou neste organismo (durante a classificação) */
  extras?: Array<{ id: string; label: string }>
  /** false = renderiza estático para previews leves */
  animated?: boolean
}

const SIZE_MAP = {
  sm: 140,
  md: 200,
  lg: 260,
}

// 6 setores em layout circular (6 posições ao redor de um centro)
const SECTORS = [
  { id: 'vendas', label: 'Vendas',     angle: -90 },
  { id: 'estoque', label: 'Estoque',    angle: -30 },
  { id: 'fin',     label: 'Financeiro', angle:  30 },
  { id: 'op',      label: 'Operação',   angle:  90 },
  { id: 'rh',      label: 'RH',         angle: 150 },
  { id: 'sac',     label: 'Atend.',     angle: 210 },
]

// raio onde os setores ficam (relativo ao centro 100,100 do viewBox 200x200)
const SECTOR_RADIUS = 62

function polar(angleDeg: number, radius: number) {
  const r = (angleDeg * Math.PI) / 180
  return { x: 100 + Math.cos(r) * radius, y: 100 + Math.sin(r) * radius }
}

export default function LivingCompany({
  phase,
  size = 'md',
  label,
  extras = [],
  animated = true,
}: Props) {
  const px = SIZE_MAP[size]
  const uid = useId().replace(/:/g, '')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <svg
        viewBox="0 0 200 200"
        width={px}
        height={px}
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* glow do núcleo (Fase 3) */}
          <radialGradient id={`coreGlow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          {/* glow suave dos setores conectados (Fase 2) */}
          <radialGradient id={`sectorGlow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* ═══════════════ FASE 1 — SILOS ═══════════════
            Visual deliberadamente apagado: setores quase invisíveis
            (a empresa "mal acorda"), só a sala de TI tem vida porque
            é todo o investimento que existe. */}
        {phase === 1 && (
          <>
            {SECTORS.map((s) => {
              const p = polar(s.angle, SECTOR_RADIUS)
              return (
                <g key={s.id}>
                  {/* setor: caixa quase invisível, sem fill, contorno fraco */}
                  <rect
                    x={p.x - 14}
                    y={p.y - 10}
                    width={28}
                    height={20}
                    rx={3}
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth={0.5}
                    strokeDasharray="1.5 1.5"
                  />
                  {/* 3 pontos de dados muito apagados, parados */}
                  <circle cx={p.x - 6} cy={p.y} r={0.9} fill="rgba(255,255,255,0.22)" />
                  <circle cx={p.x}     cy={p.y} r={0.9} fill="rgba(255,255,255,0.22)" />
                  <circle cx={p.x + 6} cy={p.y} r={0.9} fill="rgba(255,255,255,0.22)" />
                </g>
              )
            })}

            {/* Sala de TI no canto inferior direito — único elemento vivo */}
            <g>
              <rect
                x={155}
                y={158}
                width={32}
                height={26}
                rx={3}
                fill="rgba(255,255,255,0.06)"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth={0.9}
              />
              <text
                x={171}
                y={156}
                textAnchor="middle"
                fontSize={6}
                fill="rgba(255,255,255,0.55)"
                style={{ letterSpacing: '0.1em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}
              >
                TI
              </text>
              {/* 3 LEDs piscando lentamente — único pulso da fase */}
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  cx={163 + i * 8}
                  cy={172}
                  r={1.6}
                  fill="#ffffff"
                  animate={
                    animated
                      ? { opacity: [0.3, 1, 0.3] }
                      : { opacity: 0.7 }
                  }
                  transition={
                    animated
                      ? {
                          duration: 1.6,
                          repeat: Infinity,
                          delay: i * 0.4,
                          ease: 'easeInOut',
                        }
                      : undefined
                  }
                />
              ))}
              {/* 2 racks empilhados estilizados */}
              <line x1={163} y1={177} x2={183} y2={177} stroke="rgba(255,255,255,0.35)" strokeWidth={0.6} />
              <line x1={163} y1={181} x2={183} y2={181} stroke="rgba(255,255,255,0.35)" strokeWidth={0.6} />
            </g>
          </>
        )}

        {/* ═══════════════ FASE 2 — COSTURA ═══════════════ */}
        {phase === 2 && (
          <>
            {/* TI virou hub central */}
            <circle
              cx={100}
              cy={100}
              r={11}
              fill="rgba(255,255,255,0.08)"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth={0.9}
            />
            <text
              x={100}
              y={102}
              textAnchor="middle"
              fontSize={6}
              fill="#ffffff"
              style={{ letterSpacing: '0.1em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}
            >
              TI
            </text>

            {/* linhas de fluxo do hub para cada setor */}
            {SECTORS.map((s, i) => {
              const p = polar(s.angle, SECTOR_RADIUS)
              return (
                <motion.line
                  key={`line-${s.id}`}
                  x1={100}
                  y1={100}
                  x2={p.x}
                  y2={p.y}
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth={0.8}
                  initial={animated ? { pathLength: 0, opacity: 0 } : false}
                  animate={animated ? { pathLength: 1, opacity: 1 } : { opacity: 1 }}
                  transition={animated ? { duration: 0.6, delay: 0.15 + i * 0.08 } : undefined}
                />
              )
            })}

            {/* setores: caixas pulsando levemente */}
            {SECTORS.map((s, i) => {
              const p = polar(s.angle, SECTOR_RADIUS)
              return (
                <motion.g
                  key={s.id}
                  initial={animated ? { opacity: 0 } : false}
                  animate={animated ? { opacity: 1 } : undefined}
                  transition={animated ? { delay: 0.4 + i * 0.06 } : undefined}
                >
                  <rect
                    x={p.x - 13}
                    y={p.y - 9}
                    width={26}
                    height={18}
                    rx={3}
                    fill="rgba(255,255,255,0.06)"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth={0.8}
                  />
                </motion.g>
              )
            })}

            {/* dados circulando: 1 partícula por linha indo do hub ao setor */}
            {animated && SECTORS.map((s, i) => {
              const p = polar(s.angle, SECTOR_RADIUS)
              return (
                <motion.circle
                  key={`particle-${s.id}`}
                  r={1.4}
                  fill="#ffffff"
                  initial={{ cx: 100, cy: 100, opacity: 0 }}
                  animate={{
                    cx: [100, p.x],
                    cy: [100, p.y],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    delay: 0.8 + i * 0.25,
                    ease: 'easeOut',
                  }}
                />
              )
            })}
          </>
        )}

        {/* ═══════════════ FASE 3 — NÚCLEO ═══════════════ */}
        {phase === 3 && (
          <>
            {/* glow externo */}
            <motion.circle
              cx={100}
              cy={100}
              r={50}
              fill={`url(#coreGlow-${uid})`}
              animate={
                animated
                  ? { scale: [0.95, 1.05, 0.95], opacity: [0.4, 0.6, 0.4] }
                  : { scale: 1, opacity: 0.5 }
              }
              transition={
                animated
                  ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
                  : undefined
              }
              style={{ transformOrigin: '100px 100px' }}
            />

            {/* núcleo central pulsando intenso */}
            <motion.circle
              cx={100}
              cy={100}
              r={22}
              fill="rgba(255,255,255,0.18)"
              stroke="#ffffff"
              strokeWidth={1.2}
              animate={
                animated
                  ? { scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }
                  : { scale: 1 }
              }
              transition={
                animated
                  ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
                  : undefined
              }
              style={{ transformOrigin: '100px 100px' }}
            />

            {/* núcleo brilhante interno */}
            <circle cx={100} cy={100} r={9} fill="#ffffff" />

            {/* 3 órbitas concêntricas finíssimas */}
            {[34, 46, 58].map((r) => (
              <circle
                key={r}
                cx={100}
                cy={100}
                r={r}
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth={0.4}
                strokeDasharray="0.8 2"
              />
            ))}

            {/* partículas orbitando — uma por órbita */}
            {animated && [
              { r: 34, dur: 4, phase: 0 },
              { r: 46, dur: 6, phase: 1.5 },
              { r: 58, dur: 8, phase: 3 },
              { r: 34, dur: 4, phase: 2 },
              { r: 46, dur: 6, phase: 4 },
              { r: 58, dur: 8, phase: 0.5 },
            ].map((o, i) => (
              <motion.g
                key={i}
                animate={{ rotate: 360 }}
                transition={{
                  duration: o.dur,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: o.phase,
                }}
                style={{ transformOrigin: '100px 100px' }}
              >
                <circle cx={100 + o.r} cy={100} r={1.6} fill="#ffffff" />
              </motion.g>
            ))}
          </>
        )}

        {/* extras: empresas adicionadas pelo aluno (durante a classificação) */}
        {extras.length > 0 && (
          <g>
            {extras.map((ex, i) => {
              const angle = -90 + (i * 360) / Math.max(extras.length, 1)
              const r = phase === 3 ? 76 : 88
              const p = polar(angle, r)
              return (
                <motion.g
                  key={ex.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: 'backOut' }}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={3}
                    fill="#ffffff"
                    stroke="#ffffff"
                    strokeWidth={0.5}
                  />
                </motion.g>
              )
            })}
          </g>
        )}
      </svg>

      {label && (
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.16em',
            color: 'rgba(255,255,255,0.55)',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          {label}
        </div>
      )}
    </div>
  )
}
