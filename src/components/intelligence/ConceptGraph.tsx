'use client'

/**
 * CONCEPT GRAPH — mapa visual limpo de etapas.
 * Coluna única, vertical, compacto, legível.
 * Nós centrais em sequência com setas.
 * Ramos aparecem como tags laterais, não como nós separados.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface GraphNode {
  id: string
  label: string
  module: string
  current: boolean
  relevance: number
  description?: string
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
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const currentNodes = nodes.filter((n) => n.current)
  const otherNodes = nodes.filter((n) => !n.current)

  useEffect(() => {
    if (visibleCount < currentNodes.length) {
      const t = setTimeout(() => setVisibleCount((c) => c + 1), 350)
      return () => clearTimeout(t)
    }
  }, [visibleCount, currentNodes.length])

  // Para cada nó central, encontra ramos conectados
  const getBranches = (nodeId: string) => {
    return edges
      .filter((e) => e.from === nodeId || e.to === nodeId)
      .map((e) => {
        const otherId = e.from === nodeId ? e.to : e.from
        const other = otherNodes.find((n) => n.id === otherId)
        return other ? { node: other, label: e.label } : null
      })
      .filter(Boolean) as Array<{ node: GraphNode; label?: string }>
  }

  return (
    <div style={{
      width: '100%',
      background: 'rgba(0,0,0,0.3)',
      borderRadius: 14,
      padding: '20px 16px',
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {currentNodes.map((node, i) => {
          if (i >= visibleCount) return null
          const isExpanded = expandedId === node.id
          const branches = getBranches(node.id)
          const isLast = i === currentNodes.length - 1

          return (
            <div key={node.id}>
              {/* Nó principal */}
              <motion.button
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, type: 'spring', damping: 20 }}
                onClick={() => setExpandedId(isExpanded ? null : node.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: isExpanded ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid rgba(255,255,255,${isExpanded ? 0.12 : 0.06})`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                {/* Número da etapa */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'ui-monospace, monospace',
                }}>
                  {i + 1}
                </div>

                {/* Label */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)',
                    fontFamily: 'Poppins, system-ui, sans-serif',
                    margin: 0, lineHeight: 1.3,
                  }}>
                    {node.label}
                  </p>
                  {/* Tags de ramos */}
                  {branches.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 5 }}>
                      {branches.map((b) => (
                        <span key={b.node.id} style={{
                          fontSize: 9, fontWeight: 600, letterSpacing: '0.04em',
                          color: 'rgba(255,255,255,0.35)',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: 4, padding: '1px 6px',
                        }}>
                          {b.label ? `${b.label} → ` : ''}{b.node.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Chevron */}
                <span style={{
                  fontSize: 10, color: 'rgba(255,255,255,0.25)',
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}>
                  ▶
                </span>
              </motion.button>

              {/* Descrição expandida */}
              <AnimatePresence>
                {isExpanded && node.description && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{
                      margin: '6px 0 0 40px',
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.02)',
                      borderLeft: '2px solid rgba(255,255,255,0.1)',
                    }}>
                      <p style={{
                        fontSize: 12, color: 'rgba(255,255,255,0.6)',
                        lineHeight: 1.7, margin: 0,
                      }}>
                        {node.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Seta entre etapas */}
              {!isLast && i < visibleCount - 1 && (
                <div style={{
                  display: 'flex', justifyContent: 'center',
                  padding: '4px 0',
                }}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{
                      width: 1, height: 16,
                      background: 'rgba(255,255,255,0.12)',
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Dados do grafo para o Capítulo 1 — Era Digital.
 */
export function getChapter1Graph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [
    { id: 'fase1', label: 'Infraestrutura (2000s)', module: 'M1', current: true, relevance: 1,
      description: 'TI como custo operacional. Foco: uptime, servidores, SLA. BB investiu R$ 2bi para conectar 5.000 agências. Carr (HBR 2003): "TI virou commodity".' },
    { id: 'fase2', label: 'Processo (2010s)', module: 'M1', current: true, relevance: 1,
      description: 'ERPs integram operações. Natura unificou 7 países com SAP (R$ 500M economia). Magazine Luiza: lojas viram mini-CDs, valor 100x em 5 anos.' },
    { id: 'fase3', label: 'Estratégia (2020s)', module: 'M1', current: true, relevance: 1,
      description: 'Dados e IA viram o negócio. iFood: R$ 100B GMV sem cozinhas. Nubank: 80M clientes, CAC R$ 30-50 vs R$ 800+ bancário. Brynjolfsson (MIT 2014): "segunda era das máquinas".' },
    { id: 'td', label: 'Transformação Digital', module: 'M1', current: true, relevance: 1,
      description: 'Não é ferramenta, é cultura. Digitização ≠ Digitalização ≠ Transformação. Westerman (MIT 2014): só Digirati superam pares — 26% mais lucrativos.' },
    { id: 'gov', label: 'Governança Digital', module: 'M1', current: true, relevance: 1,
      description: '4 pilares: Estratégia, Riscos, Políticas, Monitoramento. Para PME: backup + 2FA + responsável + revisão trimestral. Custo: R$ 0-50/mês.' },

    { id: 'sgi', label: 'Sinergia SGI+TD', module: 'M1', current: false, relevance: 0.7 },
    { id: 'criativo', label: 'Pensamento Criativo', module: 'M1', current: false, relevance: 0.5 },
    { id: 'sustent', label: 'Sustentabilidade', module: 'M1', current: false, relevance: 0.4 },
    { id: 'fintech', label: 'Fintech', module: 'M6', current: false, relevance: 0.6 },
    { id: 'datadec', label: 'Decisão por Dados', module: 'M4', current: false, relevance: 0.7 },
    { id: 'porter', label: 'Vantagem Competitiva', module: 'M5', current: false, relevance: 0.6 },
  ]

  const edges: GraphEdge[] = [
    { from: 'fase1', to: 'fase2' },
    { from: 'fase2', to: 'fase3' },
    { from: 'fase3', to: 'td' },
    { from: 'td', to: 'gov' },
    { from: 'td', to: 'sgi', label: 'potencializa' },
    { from: 'fase3', to: 'fintech', label: 'exemplo' },
    { from: 'fase3', to: 'datadec', label: 'depende de' },
    { from: 'fase2', to: 'criativo', label: 'libera tempo' },
    { from: 'gov', to: 'sustent', label: 'sustenta' },
    { from: 'fase3', to: 'porter', label: 'redefine' },
  ]

  return { nodes, edges }
}
