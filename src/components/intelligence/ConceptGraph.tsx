'use client'

/**
 * CONCEPT GRAPH — mapa visual de etapas/conceitos.
 *
 * TELA INTEIRA, legível, monta etapa por etapa com animação.
 * Cada nó aparece sequencialmente mostrando a progressão do conhecimento.
 * Layout VERTICAL (top-down) para leitura natural no mobile.
 * Fontes grandes, nós grandes, texto legível.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface GraphNode {
  id: string
  label: string
  module: string
  current: boolean
  relevance: number
  description?: string    // texto que aparece quando nó é revelado
}

export interface GraphEdge {
  from: string
  to: string
  label?: string
}

interface Props {
  nodes: GraphNode[]
  edges: GraphEdge[]
  height?: number
}

export default function ConceptGraph({ nodes, edges }: Props) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  // Anima nó por nó ao abrir
  useEffect(() => {
    if (visibleCount < nodes.length) {
      const timer = setTimeout(() => setVisibleCount((c) => c + 1), 400)
      return () => clearTimeout(timer)
    }
  }, [visibleCount, nodes.length])

  // Separa nós centrais (current) e periféricos
  const currentNodes = nodes.filter((n) => n.current)
  const otherNodes = nodes.filter((n) => !n.current)

  // Layout: nós centrais em coluna vertical, periféricos conectados à direita
  const nodeHeight = 64
  const gapY = 16
  const startY = 20
  const centerX = 100
  const branchX = 260

  // Posicionar nós centrais em coluna
  const positions: Record<string, { x: number; y: number }> = {}
  currentNodes.forEach((n, i) => {
    positions[n.id] = { x: centerX, y: startY + i * (nodeHeight + gapY) }
  })

  // Posicionar nós periféricos à direita dos nós que conectam
  const placedOthers = new Set<string>()
  let otherY = startY
  otherNodes.forEach((n) => {
    // Encontra edge que conecta a um nó central
    const edge = edges.find((e) => (e.from === n.id || e.to === n.id))
    const linkedCentral = edge
      ? positions[edge.from] ? edge.from : positions[edge.to] ? edge.to : null
      : null

    if (linkedCentral && positions[linkedCentral]) {
      positions[n.id] = { x: branchX, y: positions[linkedCentral].y }
      // Se já tem alguém nessa posição, desloca pra baixo
      const existing = Object.entries(positions).find(
        ([id, p]) => id !== n.id && Math.abs(p.x - branchX) < 10 && Math.abs(p.y - positions[n.id].y) < 40
      )
      if (existing) {
        positions[n.id].y += nodeHeight + gapY / 2
      }
    } else {
      positions[n.id] = { x: branchX, y: otherY }
      otherY += nodeHeight + gapY
    }
    placedOthers.add(n.id)
  })

  const maxY = Math.max(...Object.values(positions).map((p) => p.y)) + nodeHeight + 20
  const svgW = 380
  const svgH = Math.max(maxY, 300)

  return (
    <div style={{
      width: '100%',
      minHeight: '60vh',
      background: 'rgba(0,0,0,0.35)',
      borderRadius: 16,
      overflow: 'auto',
      padding: '16px 8px',
    }}>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" style={{ minHeight: svgH }}>
        {/* Edges — conectores animados */}
        {edges.map((e, i) => {
          const from = positions[e.from]
          const to = positions[e.to]
          if (!from || !to) return null
          const fromNode = nodes.find((n) => n.id === e.from)
          const toNode = nodes.find((n) => n.id === e.to)
          if (!fromNode || !toNode) return null
          const fromIdx = nodes.indexOf(fromNode)
          const toIdx = nodes.indexOf(toNode)
          const maxIdx = Math.max(fromIdx, toIdx)
          if (maxIdx >= visibleCount) return null

          return (
            <motion.g key={`edge-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}>
              <line
                x1={from.x + (from.x < to.x ? 55 : -55)}
                y1={from.y + nodeHeight / 2 - 10}
                x2={to.x + (to.x < from.x ? 55 : -55)}
                y2={to.y + nodeHeight / 2 - 10}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
              {e.label && (
                <text
                  x={(from.x + to.x) / 2 + (from.x < to.x ? 20 : -20)}
                  y={(from.y + to.y) / 2 + nodeHeight / 2 - 14}
                  textAnchor="middle"
                  fontSize={10}
                  fill="rgba(255,255,255,0.4)"
                  style={{ fontFamily: 'system-ui, sans-serif', fontStyle: 'italic' }}
                >
                  {e.label}
                </text>
              )}
            </motion.g>
          )
        })}

        {/* Central flow line */}
        {currentNodes.length > 1 && visibleCount >= 2 && (
          <motion.line
            x1={centerX}
            y1={startY + nodeHeight / 2}
            x2={centerX}
            y2={startY + (currentNodes.length - 1) * (nodeHeight + gapY) + nodeHeight / 2}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        )}

        {/* Flow arrows between central nodes */}
        {currentNodes.slice(0, -1).map((_, i) => {
          if (i + 1 >= visibleCount) return null
          const y = startY + i * (nodeHeight + gapY) + nodeHeight - 2
          return (
            <motion.polygon
              key={`arrow-${i}`}
              points={`${centerX - 4},${y + 4} ${centerX},${y + 12} ${centerX + 4},${y + 4}`}
              fill="rgba(255,255,255,0.25)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.4 }}
            />
          )
        })}

        {/* Nodes */}
        {nodes.map((n, i) => {
          if (i >= visibleCount) return null
          const pos = positions[n.id]
          if (!pos) return null
          const isCurrent = n.current
          const isSelected = selectedNode === n.id
          const w = isCurrent ? 110 : 100
          const h = nodeHeight - 8

          return (
            <motion.g key={n.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: 'spring', damping: 20 }}
              onClick={() => setSelectedNode(isSelected ? null : n.id)}
              style={{ cursor: n.description ? 'pointer' : 'default' }}
            >
              {/* Background rect */}
              <rect
                x={pos.x - w / 2}
                y={pos.y}
                width={w}
                height={h}
                rx={12}
                fill={isCurrent ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)'}
                stroke={isCurrent ? 'rgba(255,255,255,0.25)' : `rgba(255,255,255,${0.08 + n.relevance * 0.12})`}
                strokeWidth={isCurrent ? 1.5 : 1}
              />

              {/* Pulse ring for current */}
              {isCurrent && (
                <motion.rect
                  x={pos.x - w / 2 - 3}
                  y={pos.y - 3}
                  width={w + 6}
                  height={h + 6}
                  rx={14}
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={0.5}
                  animate={{ opacity: [0.3, 0.08, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}

              {/* Module badge */}
              {!isCurrent && (
                <text
                  x={pos.x}
                  y={pos.y + 14}
                  textAnchor="middle"
                  fontSize={8}
                  fontWeight={700}
                  letterSpacing="0.12em"
                  fill="rgba(255,255,255,0.3)"
                  style={{ fontFamily: 'ui-monospace, monospace' }}
                >
                  {n.module}
                </text>
              )}

              {/* Label — fonte grande e legível */}
              <text
                x={pos.x}
                y={pos.y + (isCurrent ? h / 2 + 1 : h / 2 + 5)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={isCurrent ? 13 : 11}
                fontWeight={isCurrent ? 700 : 500}
                fill={isCurrent ? '#ffffff' : `rgba(255,255,255,${0.5 + n.relevance * 0.35})`}
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {n.label}
              </text>
            </motion.g>
          )
        })}
      </svg>

      {/* Descrição do nó selecionado */}
      <AnimatePresence>
        {selectedNode && (() => {
          const node = nodes.find((n) => n.id === selectedNode)
          if (!node?.description) return null
          return (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-3 mx-2 rounded-xl px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">{node.label}</p>
              <p className="text-[13px] text-white/70 leading-relaxed">{node.description}</p>
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}

/**
 * Dados do grafo para o Capítulo 1 — Era Digital · 3 Fases.
 * Monta etapa por etapa mostrando progressão do conhecimento.
 */
export function getChapter1Graph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [
    // Coluna central — fluxo principal (etapas)
    { id: 'fase1', label: 'Infraestrutura', module: 'M1', current: true, relevance: 1,
      description: 'Anos 2000 — TI como custo operacional. Foco em uptime, servidores, SLA. Banco do Brasil investiu R$ 2 bilhões para conectar 5.000 agências.' },
    { id: 'fase2', label: 'Processo', module: 'M1', current: true, relevance: 1,
      description: 'Anos 2010 — ERPs integram operações. Natura unificou 7 países com SAP. Magazine Luiza transformou lojas em mini-CDs.' },
    { id: 'fase3', label: 'Estratégia', module: 'M1', current: true, relevance: 1,
      description: 'Anos 2020+ — Dados e IA viram o próprio negócio. iFood: R$ 100B GMV sem cozinhas. Nubank: 80M clientes com CAC fração do bancário.' },
    { id: 'td', label: 'Transformação Digital', module: 'M1', current: true, relevance: 1,
      description: 'Integração de tecnologias digitais em todas as áreas — muda como a empresa opera e entrega valor. Não é ferramenta, é cultura.' },
    { id: 'gov', label: 'Governança Digital', module: 'M1', current: true, relevance: 1,
      description: '4 pilares: Estratégia, Riscos/Segurança, Políticas, Monitoramento. Governança para PME custa R$ 0-50/mês. Não fazer pode custar o negócio.' },

    // Ramos — conceitos conectados
    { id: 'sgi', label: 'Sinergia SGI+TD', module: 'M1', current: false, relevance: 0.7,
      description: 'Gestão da Inovação (SGI) estrutura incertezas. Transformação Digital (TD) fornece ferramentas. Juntos: cultura + tecnologia + resultados.' },
    { id: 'criativo', label: 'Pensamento Criativo', module: 'M1', current: false, relevance: 0.5,
      description: 'Processo que automatiza libera tempo para criar. Guilford (1967): divergente gera ideias, convergente seleciona. Sem tempo livre, não há criação.' },
    { id: 'sustent', label: 'Sustentabilidade', module: 'M1', current: false, relevance: 0.4,
      description: 'ESG e TBL dependem de dados confiáveis — que só existem com governança digital sólida. Sem dados, sustentabilidade é discurso.' },
    { id: 'fintech', label: 'Fintech & Banking', module: 'M6', current: false, relevance: 0.6,
      description: 'Nubank é Fase 3 pura: 100% cloud, dados como ativo, modelo que transforma cliente em canal. A antítese do banco de agência.' },
    { id: 'datadec', label: 'Decisão por Dados', module: 'M4', current: false, relevance: 0.7,
      description: 'DDDM (Data-Driven Decision Making). Na Fase 3, quem não decide por dados decide por opinião — e perde para quem usa algoritmo.' },
    { id: 'porter', label: 'Vantagem Competitiva', module: 'M5', current: false, relevance: 0.6,
      description: 'Porter (1985) definiu custo e diferenciação. Na era digital, plataformas criam vantagem por efeito de rede — categoria nova que Porter não previu.' },
  ]

  const edges: GraphEdge[] = [
    { from: 'fase1', to: 'fase2', label: 'evolui para' },
    { from: 'fase2', to: 'fase3', label: 'evolui para' },
    { from: 'fase3', to: 'td', label: 'exige' },
    { from: 'td', to: 'gov', label: 'depende de' },
    { from: 'td', to: 'sgi', label: 'potencializa' },
    { from: 'fase3', to: 'fintech', label: 'exemplo' },
    { from: 'fase3', to: 'datadec', label: 'depende de' },
    { from: 'fase2', to: 'criativo', label: 'libera tempo' },
    { from: 'gov', to: 'sustent', label: 'sustenta' },
    { from: 'fase3', to: 'porter', label: 'redefine' },
  ]

  return { nodes, edges }
}
