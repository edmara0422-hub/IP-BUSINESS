'use client'

/**
 * CONCEPT GRAPH — grafo SVG de conexões entre conceitos.
 *
 * Renderiza conceitos como nós circulares num mapa visual.
 * Nós do capítulo atual ficam brancos e pulsam.
 * Nós de outros módulos ficam em cinza fraco.
 * Linhas conectam conceitos relacionados.
 *
 * Usado pelo Professor no modo "Conectar" para mostrar
 * visualmente como o tema atual se liga ao resto.
 */

import { motion } from 'framer-motion'

export interface GraphNode {
  id: string
  label: string
  /** Módulo de origem (M1, M2...) */
  module: string
  /** true = conceito do capítulo atual */
  current: boolean
  /** 0–1, relevância para o tema atual */
  relevance: number
}

export interface GraphEdge {
  from: string
  to: string
  label?: string
}

interface Props {
  nodes: GraphNode[]
  edges: GraphEdge[]
  /** Altura do SVG */
  height?: number
}

// Layout force-directed simplificado: posiciona nós em layout circular
// com os nós "current" no centro e os outros ao redor
function layoutNodes(nodes: GraphNode[], w: number, h: number) {
  const current = nodes.filter((n) => n.current)
  const others = nodes.filter((n) => !n.current)
  const cx = w / 2
  const cy = h / 2
  const innerR = Math.min(w, h) * 0.15
  const outerR = Math.min(w, h) * 0.38

  const positioned: Record<string, { x: number; y: number }> = {}

  // Nós atuais no centro (em mini-cluster)
  current.forEach((n, i) => {
    const angle = (i * 2 * Math.PI) / Math.max(current.length, 1) - Math.PI / 2
    positioned[n.id] = {
      x: cx + Math.cos(angle) * innerR,
      y: cy + Math.sin(angle) * innerR,
    }
  })

  // Nós externos em anel
  others.forEach((n, i) => {
    const angle = (i * 2 * Math.PI) / Math.max(others.length, 1) - Math.PI / 2
    positioned[n.id] = {
      x: cx + Math.cos(angle) * outerR,
      y: cy + Math.sin(angle) * outerR,
    }
  })

  return positioned
}

export default function ConceptGraph({ nodes, edges, height = 220 }: Props) {
  const w = 320
  const h = height
  const positions = layoutNodes(nodes, w, h)

  return (
    <div
      style={{
        width: '100%',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 14,
      }}
    >
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
        {/* Edges */}
        {edges.map((e, i) => {
          const from = positions[e.from]
          const to = positions[e.to]
          if (!from || !to) return null
          return (
            <motion.line
              key={`edge-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={0.8}
              strokeDasharray="2 2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.06 }}
            />
          )
        })}

        {/* Edge labels */}
        {edges.map((e, i) => {
          const from = positions[e.from]
          const to = positions[e.to]
          if (!from || !to || !e.label) return null
          const mx = (from.x + to.x) / 2
          const my = (from.y + to.y) / 2
          return (
            <motion.text
              key={`elabel-${i}`}
              x={mx}
              y={my - 4}
              textAnchor="middle"
              fontSize={5.5}
              fill="rgba(255,255,255,0.35)"
              style={{ fontFamily: 'ui-monospace, monospace' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.05 }}
            >
              {e.label}
            </motion.text>
          )
        })}

        {/* Nodes */}
        {nodes.map((n, i) => {
          const pos = positions[n.id]
          if (!pos) return null
          const r = n.current ? 18 : 12 + n.relevance * 6
          const fill = n.current ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)'
          const stroke = n.current ? '#ffffff' : `rgba(255,255,255,${0.2 + n.relevance * 0.3})`
          const textColor = n.current ? '#ffffff' : `rgba(255,255,255,${0.45 + n.relevance * 0.35})`

          return (
            <motion.g
              key={n.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.05, type: 'spring' }}
            >
              {/* Pulse pra nós atuais */}
              {n.current && (
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={r + 4}
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth={0.5}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                />
              )}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={r}
                fill={fill}
                stroke={stroke}
                strokeWidth={n.current ? 1.2 : 0.7}
              />
              {/* Módulo label */}
              {!n.current && (
                <text
                  x={pos.x}
                  y={pos.y - r - 4}
                  textAnchor="middle"
                  fontSize={5}
                  fill="rgba(255,255,255,0.25)"
                  style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, letterSpacing: '0.1em' }}
                >
                  {n.module}
                </text>
              )}
              {/* Label do conceito — quebra em 2 linhas se necessário */}
              {n.label.split(' ').length <= 3 ? (
                <text
                  x={pos.x}
                  y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={n.current ? 6.5 : 5.5}
                  fontWeight={n.current ? 700 : 500}
                  fill={textColor}
                >
                  {n.label}
                </text>
              ) : (
                <>
                  <text
                    x={pos.x}
                    y={pos.y - 3}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={n.current ? 6 : 5}
                    fontWeight={n.current ? 700 : 500}
                    fill={textColor}
                  >
                    {n.label.split(' ').slice(0, 2).join(' ')}
                  </text>
                  <text
                    x={pos.x}
                    y={pos.y + 5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={n.current ? 6 : 5}
                    fontWeight={n.current ? 700 : 500}
                    fill={textColor}
                  >
                    {n.label.split(' ').slice(2).join(' ')}
                  </text>
                </>
              )}
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}

/**
 * Dados estáticos do grafo para o Capítulo 1 — Era Digital · 3 Fases.
 * Chamado pelo Professor no modo "Conectar".
 */
export function getChapter1Graph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [
    // Nós do capítulo atual (centro)
    { id: 'fase1', label: 'Infraestrutura', module: 'M1', current: true, relevance: 1 },
    { id: 'fase2', label: 'Processo', module: 'M1', current: true, relevance: 1 },
    { id: 'fase3', label: 'Estratégia', module: 'M1', current: true, relevance: 1 },
    // Nós de outros módulos / conceitos
    { id: 'td', label: 'Transformação Digital', module: 'M1', current: false, relevance: 0.9 },
    { id: 'gov', label: 'Governança Digital', module: 'M1', current: false, relevance: 0.8 },
    { id: 'sgi', label: 'Sinergia SGI+TD', module: 'M1', current: false, relevance: 0.7 },
    { id: 'criativo', label: 'Pensamento Criativo', module: 'M1', current: false, relevance: 0.5 },
    { id: 'sustent', label: 'Sustentabilidade', module: 'M3', current: false, relevance: 0.4 },
    { id: 'fintech', label: 'Fintech & Open Banking', module: 'M4', current: false, relevance: 0.6 },
    { id: 'datadec', label: 'Decisão por Dados', module: 'M5', current: false, relevance: 0.7 },
    { id: 'porter', label: 'Vantagem Competitiva', module: 'Estratégia', current: false, relevance: 0.6 },
  ]

  const edges: GraphEdge[] = [
    { from: 'fase1', to: 'fase2', label: 'evolui' },
    { from: 'fase2', to: 'fase3', label: 'evolui' },
    { from: 'fase3', to: 'td', label: 'é resultado de' },
    { from: 'td', to: 'gov', label: 'exige' },
    { from: 'td', to: 'sgi', label: 'potencializa' },
    { from: 'fase3', to: 'fintech', label: 'caso' },
    { from: 'fase3', to: 'datadec', label: 'depende de' },
    { from: 'fase2', to: 'criativo', label: 'libera tempo pra' },
    { from: 'gov', to: 'sustent', label: 'sustenta' },
    { from: 'fase3', to: 'porter', label: 'redefine' },
  ]

  return { nodes, edges }
}
