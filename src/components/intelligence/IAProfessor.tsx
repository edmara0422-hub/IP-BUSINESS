'use client'

/**
 * IA PROFESSOR — direcionador de estudo limpo e compacto.
 *
 * Layout: botão flutuante → abre painel com:
 *   1. Header com indicadores inline (profundidade + memória como dots)
 *   2. 5 botões de modo
 *   3. Resposta em texto limpo com scroll
 *
 * O grafo e a calculadora aparecem sob demanda via abas/toggle, nunca
 * empilhados em cima do texto. A regra é: TEXTO LEGÍVEL PRIMEIRO.
 *
 * Componentes visuais (grafo, calc) movidos para abas secundárias
 * acessíveis por toggle dentro da resposta — não empilham.
 */

import { useState, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Link2, HelpCircle, RefreshCw, ArrowRight, BookOpen, X } from 'lucide-react'
import { getReviewData, getModuleMemory, retentionColor, getChapterDepth, getDepthData } from '@/store/study-memory-store'
import ConceptGraph, { getChapter1Graph } from './ConceptGraph'
import ProfessorCalc from './ProfessorCalc'

const BLUE = '#2e86c1'

type Mode = 'connect' | 'deepen' | 'review' | 'apply' | 'summarize'

interface Props {
  moduleId: string
  submoduleTitle: string
  blockTitle?: string
  blockContent?: string
  studiedTopics?: string[]
  currentPosition?: { blockIdx: number; totalBlocks: number }
}

const MODES: Array<{ id: Mode; label: string; icon: typeof Link2 }> = [
  { id: 'connect',   label: 'Conectar',   icon: Link2 },
  { id: 'deepen',    label: 'Aprofundar', icon: HelpCircle },
  { id: 'review',    label: 'Revisar',    icon: RefreshCw },
  { id: 'apply',     label: 'Aplicar',    icon: ArrowRight },
  { id: 'summarize', label: 'Resumir',    icon: BookOpen },
]

export default function IAProfessor({
  moduleId, submoduleTitle, blockTitle, blockContent, studiedTopics, currentPosition,
}: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeMode, setActiveMode] = useState<Mode | null>(null)
  const [response, setResponse] = useState<string | null>(null)
  const [showVisual, setShowVisual] = useState(false)

  const ask = async (mode: Mode) => {
    setActiveMode(mode)
    setLoading(true)
    setResponse(null)
    setShowVisual(false)
    try {
      const memoryData = mode === 'review' ? getReviewData(moduleId) : undefined
      const chapterId = blockTitle ? 'M1-0-cap1' : undefined
      const depthInfo = chapterId ? getDepthData(chapterId) : undefined

      const enrichedContent = [
        blockContent ?? '',
        depthInfo ? `\n\n--- PROFUNDIDADE DO ALUNO ---\n${depthInfo}` : '',
        memoryData ? `\n\n--- DADOS DE MEMÓRIA (Ebbinghaus) ---\n${memoryData}` : '',
      ].join('')

      const res = await fetch('/api/professor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode, moduleId, submoduleTitle, blockTitle,
          blockContent: enrichedContent, studiedTopics, currentPosition,
        }),
      })
      const data = await res.json()
      if (data.response?.trim()) setResponse(data.response)
      else if (data.error) setResponse(`Erro: ${data.error}`)
      else setResponse('Resposta vazia. Tente novamente.')
    } catch (err) {
      setResponse(`Erro: ${err instanceof Error ? err.message : String(err)}`)
    }
    setLoading(false)
  }

  // Indicadores compactos
  const memEntries = getModuleMemory(moduleId)
  const { score: depthScore } = getChapterDepth('M1-0-cap1')

  const hasVisual = activeMode === 'connect' || activeMode === 'apply'

  return (
    <div className="sticky bottom-0 z-20 pointer-events-none">
      <div className="pointer-events-auto">
        {/* ── Botão recolhido ── */}
        {!open && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setOpen(true)}
            className="ml-auto flex items-center gap-2 px-3 py-2 rounded-full shadow-lg backdrop-blur-md"
            style={{
              background: 'rgba(10,10,10,0.92)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#ffffff',
            }}>
            <Sparkles className="w-3 h-3" style={{ opacity: 0.6 }} />
            <span className="text-[10px] font-semibold tracking-wide">Professor</span>
            {/* Mini dots de memória no botão */}
            {memEntries.length > 0 && (
              <div className="flex gap-0.5 ml-1">
                {memEntries.slice(0, 5).map((e) => (
                  <div key={e.conceptId} style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: retentionColor(e.retention),
                  }} />
                ))}
              </div>
            )}
          </motion.button>
        )}

        {/* ── Painel expandido ��─ */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl"
              style={{
                background: 'rgba(10,10,10,0.96)',
                border: '1px solid rgba(255,255,255,0.08)',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
              }}>

              {/* ── Header: título + indicadores inline + fechar ── */}
              <div className="flex items-center justify-between px-4 py-2.5 shrink-0"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/50">
                    Professor
                  </span>
                  {/* Profundidade inline */}
                  {depthScore > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div style={{
                        width: 28, height: 3, borderRadius: 2,
                        background: 'rgba(255,255,255,0.08)', overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${depthScore}%`, height: '100%', borderRadius: 2,
                          background: depthScore >= 60 ? '#ffffff' : 'rgba(255,255,255,0.4)',
                        }} />
                      </div>
                      <span className="text-[8px] font-mono text-white/30">{depthScore}%</span>
                    </div>
                  )}
                  {/* Memória dots inline */}
                  {memEntries.length > 0 && (
                    <div className="flex gap-0.5">
                      {memEntries.slice(0, 6).map((e) => (
                        <div key={e.conceptId} style={{
                          width: 4, height: 4, borderRadius: '50%',
                          background: retentionColor(e.retention),
                        }} />
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => { setOpen(false); setResponse(null); setActiveMode(null) }}
                  className="text-white/30 hover:text-white/70 transition-colors p-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* ── 5 botões de modo ── */}
              <div className="px-3 py-2.5 flex flex-wrap gap-1.5 shrink-0">
                {MODES.map((m) => {
                  const Icon = m.icon
                  const isActive = activeMode === m.id
                  return (
                    <button key={m.id} onClick={() => ask(m.id)} disabled={loading}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[9px] font-semibold transition-all disabled:opacity-30"
                      style={{
                        background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                        color: isActive ? '#ffffff' : 'rgba(255,255,255,0.45)',
                        border: `1px solid ${isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
                      }}>
                      <Icon className="w-2.5 h-2.5" />
                      <span>{m.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* ���─ Resposta (scrollável) ── */}
              <div className="flex-1 overflow-y-auto px-4 pb-4" style={{ minHeight: 60 }}>
                <AnimatePresence mode="wait">
                  {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="py-4">
                      <div className="flex items-center gap-2 text-[10px] text-white/35">
                        <motion.div
                          className="w-1 h-1 rounded-full bg-white/50"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        <span>Analisando o capítulo...</span>
                      </div>
                    </motion.div>
                  )}
                  {response && !loading && (
                    <motion.div key={activeMode}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

                      {/* Toggle visual (grafo/calc) — só aparece se disponível */}
                      {hasVisual && (
                        <button
                          onClick={() => setShowVisual((v) => !v)}
                          className="flex items-center gap-1.5 mb-3 text-[8px] font-bold uppercase tracking-[0.18em] text-white/30 hover:text-white/55 transition-colors"
                        >
                          <span>{showVisual ? '−' : '+'}</span>
                          <span>{activeMode === 'connect' ? 'Mapa de conexões' : 'Calculadora'}</span>
                        </button>
                      )}

                      {/* Visual colapsável */}
                      <AnimatePresence>
                        {showVisual && activeMode === 'connect' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                            {(() => {
                              const g = getChapter1Graph()
                              return <ConceptGraph nodes={g.nodes} edges={g.edges} height={180} />
                            })()}
                          </motion.div>
                        )}
                        {showVisual && activeMode === 'apply' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                            <ProfessorCalc
                              title="Gap de Digitalização"
                              description="Custo de não avançar entre fases."
                              sliders={[
                                { id: 'receita', label: 'Receita anual', min: 500000, max: 50000000, default: 5000000, unit: 'R$', step: 500000 },
                                { id: 'perda', label: 'Perda por ineficiência', min: 1, max: 15, default: 5, unit: '%' },
                                { id: 'mercado', label: 'Crescimento digital', min: 5, max: 30, default: 12, unit: '%/ano' },
                                { id: 'anos', label: 'Anos parado', min: 1, max: 10, default: 5, unit: ' anos' },
                              ]}
                              formula="receita * (Math.pow(1 + mercado/100, anos) - Math.pow(1 - perda/100, anos))"
                              resultLabel="Gap acumulado"
                              resultFormat="currency"
                              interpretation={[
                                { max: 2000000, label: 'Gerenciável', color: '#ffffff' },
                                { max: 10000000, label: 'Crítico', color: 'rgba(255,180,60,0.95)' },
                                { max: 999999999999, label: 'Irreversível', color: 'rgba(255,80,80,0.95)' },
                              ]}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Texto da resposta — SEMPRE visível, limpo */}
                      <div className="rounded-lg p-3"
                        style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid rgba(255,255,255,0.12)' }}>
                        <ProfessorMarkdown text={response} />
                      </div>
                    </motion.div>
                  )}
                  {!response && !loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="py-4">
                      <p className="text-[9px] text-white/22">Escolha um modo acima.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Markdown renderer — limpo, sem cards pesados
// Headings viram labels sutis. Texto é a prioridade.
// ──────────────────────────���───────────────────────���──────────────────

function ProfessorMarkdown({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\n+/)
  return (
    <div className="space-y-2.5">
      {blocks.map((block, bi) => {
        const trimmed = block.trim()
        // Heading standalone: **Título**
        const headingMatch = trimmed.match(/^\*\*([^*]+)\*\*$/)
        if (headingMatch) {
          return (
            <div key={bi}
              className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/35 mt-3 mb-1 pt-2"
              style={{ borderTop: bi > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              {headingMatch[1]}
            </div>
          )
        }
        // Lista
        const lines = trimmed.split('\n')
        const isList = lines.length > 1 && lines.every((l) => /^(\d+\.|[-•▸])\s/.test(l.trim()))
        if (isList) {
          return (
            <div key={bi} className="space-y-1 pl-2">
              {lines.map((line, li) => {
                const cleaned = line.trim().replace(/^(\d+\.|[-•▸])\s+/, '')
                return (
                  <div key={li} className="text-[11px] leading-relaxed text-white/65 flex gap-2">
                    <span className="text-white/20 mt-0.5 shrink-0">·</span>
                    <span>{renderInline(cleaned)}</span>
                  </div>
                )
              })}
            </div>
          )
        }
        // Parágrafo
        return (
          <p key={bi} className="text-[11px] leading-[1.7] text-white/65"
            style={{ textAlign: 'justify', hyphens: 'auto' }}>
            {renderInline(trimmed)}
          </p>
        )
      })}
    </div>
  )
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <span key={i} className="font-semibold text-white/90">{p.slice(2, -2)}</span>
    }
    return <Fragment key={i}>{p}</Fragment>
  })
}
