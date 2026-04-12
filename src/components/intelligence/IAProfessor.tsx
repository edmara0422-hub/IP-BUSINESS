'use client'

import { useState, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Link2, HelpCircle, RefreshCw, ArrowRight, BookOpen, X } from 'lucide-react'
import { getReviewData, getModuleMemory, retentionColor, retentionLabel } from '@/store/study-memory-store'

const BLUE = '#2e86c1'
const AMBER = '#9a7d0a'

/**
 * Renderiza markdown leve do Professor:
 *  - **negrito** vira span branco bold
 *  - linhas vazias = quebra de parágrafo
 *  - "**Título**" no inicio de paragrafo vira heading
 *  - "1. " ou "- " no inicio vira lista
 */
/**
 * Barra de memória Ebbinghaus — mostra a retenção de cada conceito
 * como pontos coloridos: branco (fresco) → âmbar → vermelho (esquecendo).
 * Aparece no topo do Professor quando aberto.
 */
function MemoryBar({ moduleId }: { moduleId: string }) {
  const entries = getModuleMemory(moduleId)
  if (entries.length === 0) return null

  return (
    <div
      className="px-4 py-2"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="text-[8px] font-bold uppercase tracking-[0.16em]"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          Memória
        </span>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {entries.map((e) => (
          <div
            key={e.conceptId}
            title={`${e.label} — ${Math.round(e.retention * 100)}% retido`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 7px',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${retentionColor(e.retention)}25`,
            }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: retentionColor(e.retention),
              }}
            />
            <span
              className="text-[8px] font-medium truncate max-w-[90px]"
              style={{ color: retentionColor(e.retention) }}
            >
              {e.label.replace(/—.*/, '').trim()}
            </span>
            <span
              className="text-[7px] font-mono"
              style={{ color: retentionColor(e.retention), opacity: 0.7 }}
            >
              {Math.round(e.retention * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfessorMarkdown({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\n+/)
  return (
    <div className="space-y-3">
      {blocks.map((block, bi) => {
        const trimmed = block.trim()
        // Heading: parágrafo inteiro envolvido em **
        const headingMatch = trimmed.match(/^\*\*([^*]+)\*\*$/)
        if (headingMatch) {
          return (
            <div
              key={bi}
              className="text-[10px] font-bold uppercase tracking-[0.18em] mt-2"
              style={{ color: AMBER }}
            >
              {headingMatch[1]}
            </div>
          )
        }
        // Lista: linhas que começam com "1. " ou "- " ou "• "
        const lines = trimmed.split('\n')
        const isList = lines.every((l) => /^(\d+\.|[-•])\s/.test(l.trim()))
        if (isList && lines.length > 1) {
          return (
            <ul key={bi} className="space-y-1.5 pl-1">
              {lines.map((line, li) => {
                const cleaned = line.trim().replace(/^(\d+\.|[-•])\s+/, '')
                return (
                  <li
                    key={li}
                    className="text-[12px] leading-relaxed text-white/72 pl-3 relative"
                  >
                    <span
                      className="absolute left-0 top-[0.5em]"
                      style={{ color: AMBER, fontSize: 8 }}
                    >
                      ▸
                    </span>
                    {renderInline(cleaned)}
                  </li>
                )
              })}
            </ul>
          )
        }
        // Parágrafo normal
        return (
          <p
            key={bi}
            className="text-[12px] leading-relaxed text-white/72"
            style={{ textAlign: 'justify', hyphens: 'auto' }}
          >
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
      return (
        <span key={i} className="font-bold text-white">
          {p.slice(2, -2)}
        </span>
      )
    }
    return <Fragment key={i}>{p}</Fragment>
  })
}

type Mode = 'connect' | 'deepen' | 'review' | 'apply' | 'summarize'

interface Props {
  moduleId: string
  submoduleTitle: string
  blockTitle?: string
  blockContent?: string
  studiedTopics?: string[]
  currentPosition?: { blockIdx: number; totalBlocks: number }
}

const MODES: Array<{ id: Mode; label: string; icon: typeof Link2; hint: string }> = [
  { id: 'connect',   label: 'Conectar',   icon: Link2,      hint: 'Linhagem teórica e pontes com outros temas' },
  { id: 'deepen',    label: 'Aprofundar', icon: HelpCircle, hint: 'A camada que o bloco não mostrou' },
  { id: 'review',    label: 'Revisar',    icon: RefreshCw,  hint: 'Pré-requisitos mastigados' },
  { id: 'apply',     label: 'Aplicar',    icon: ArrowRight, hint: '3 aplicações reais brasileiras' },
  { id: 'summarize', label: 'Resumir',    icon: BookOpen,   hint: 'Síntese executiva do tema' },
]

/**
 * IA Professor — rodapé que expande quando o aluno pede direcionamento.
 * Vive DENTRO do Sumário, enquanto o aluno estuda um bloco.
 * Não é chat. Aluno escolhe um MODO e recebe UMA resposta curta e direta.
 *
 * Diferente do IA Tutor (chat livre, pesquisa sob demanda):
 *  - Professor é proativo: conecta, provoca, sugere próximo passo
 *  - Sabe onde o aluno está (módulo/tópico/bloco)
 *  - Resposta curta e acionável (Claude Haiku)
 */
export default function IAProfessor({
  moduleId, submoduleTitle, blockTitle, blockContent, studiedTopics, currentPosition,
}: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeMode, setActiveMode] = useState<Mode | null>(null)
  const [response, setResponse] = useState<string | null>(null)

  const ask = async (mode: Mode) => {
    setActiveMode(mode)
    setLoading(true)
    setResponse(null)
    try {
      // Para "review", inclui o mapa de memória Ebbinghaus do aluno
      const memoryData = mode === 'review' ? getReviewData(moduleId) : undefined

      const res = await fetch('/api/professor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          moduleId,
          submoduleTitle,
          blockTitle,
          blockContent: mode === 'review' && memoryData
            ? `${blockContent ?? ''}\n\n--- DADOS DE MEMÓRIA DO ALUNO (Ebbinghaus) ---\n${memoryData}`
            : blockContent,
          studiedTopics,
          currentPosition,
        }),
      })
      const data = await res.json()
      if (data.response && data.response.trim()) {
        setResponse(data.response)
      } else if (data.error) {
        setResponse(`Erro: ${data.error}`)
      } else if (!blockContent) {
        setResponse('Este bloco não tem contexto para o Professor analisar. Estamos corrigindo.')
      } else {
        setResponse('Resposta vazia da IA. Tente outro modo ou tente novamente em alguns segundos.')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setResponse(`Erro de conexão: ${msg}`)
    }
    setLoading(false)
  }

  return (
    <div className="sticky bottom-0 z-20 pointer-events-none">
      <div className="pointer-events-auto">
        {/* Rodapé recolhido — botão de chamada */}
        {!open && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setOpen(true)}
            className="ml-auto flex items-center gap-2 px-3 py-2 rounded-full shadow-lg transition-all backdrop-blur-md"
            style={{
              background: 'rgba(10,10,10,0.92)',
              border: `1px solid ${BLUE}30`,
              color: BLUE,
            }}>
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">Professor</span>
          </motion.button>
        )}

        {/* Rodapé expandido */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl"
              style={{
                background: 'rgba(10,10,10,0.94)',
                border: `1px solid ${BLUE}25`,
              }}>

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: BLUE }} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: BLUE }}>
                    Professor
                  </span>
                  {blockTitle && (
                    <span className="text-[10px] text-white/30 ml-2 truncate max-w-[200px]">
                      · {blockTitle}
                    </span>
                  )}
                </div>
                <button onClick={() => { setOpen(false); setResponse(null); setActiveMode(null) }}
                  className="text-white/40 hover:text-white/80 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Barra de memória Ebbinghaus */}
              <MemoryBar moduleId={moduleId} />

              {/* Seletor de modo */}
              <div className="px-3 py-3 flex flex-wrap gap-1.5">
                {MODES.map((m) => {
                  const Icon = m.icon
                  const isActive = activeMode === m.id
                  return (
                    <button key={m.id} onClick={() => ask(m.id)}
                      disabled={loading}
                      title={m.hint}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all disabled:opacity-40"
                      style={{
                        background: isActive ? `${BLUE}18` : 'rgba(255,255,255,0.03)',
                        color: isActive ? BLUE : 'rgba(255,255,255,0.55)',
                        border: `1px solid ${isActive ? `${BLUE}30` : 'rgba(255,255,255,0.06)'}`,
                      }}>
                      <Icon className="w-3 h-3" />
                      <span>{m.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Resposta */}
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="px-4 pb-4">
                    <div className="flex items-center gap-2 text-[11px] text-white/40">
                      <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: BLUE }} />
                      <span>Pensando...</span>
                    </div>
                  </motion.div>
                )}
                {response && !loading && (
                  <motion.div key={activeMode}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="px-4 pb-4">
                    <div className="rounded-lg p-4 max-h-[60vh] overflow-y-auto"
                      style={{ background: `${AMBER}06`, borderLeft: `2px solid ${AMBER}40` }}>
                      <ProfessorMarkdown text={response} />
                    </div>
                  </motion.div>
                )}
                {!response && !loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="px-4 pb-4">
                    <p className="text-[10px] text-white/25">Escolha um modo para receber direcionamento sobre este bloco.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
