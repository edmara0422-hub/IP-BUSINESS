'use client'

import { useState, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Link2, HelpCircle, RefreshCw, ArrowRight, BookOpen, X } from 'lucide-react'
import { getReviewData, getModuleMemory, retentionColor, retentionLabel, getChapterDepth, getDepthData } from '@/store/study-memory-store'
import ConceptGraph, { getChapter1Graph } from './ConceptGraph'
import ProfessorCalc from './ProfessorCalc'

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

/**
 * Medidor visual de profundidade — barra 0-100% que mostra
 * quanto o aluno explorou do capítulo (leitura + deepDive + aplicação).
 */
function DepthMeter({ chapterId }: { chapterId: string }) {
  const { score, label } = getChapterDepth(chapterId)
  if (score === 0) return null

  const barColor =
    score >= 80 ? '#ffffff' : score >= 50 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.38)'

  return (
    <div
      className="px-4 py-2"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="text-[8px] font-bold uppercase tracking-[0.16em]"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          Profundidade
        </span>
        <span
          className="text-[9px] font-mono font-bold"
          style={{ color: barColor }}
        >
          {score}%
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: 3,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 2,
          overflow: 'hidden',
          marginBottom: 4,
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: '100%',
            background: barColor,
            borderRadius: 2,
            transition: 'width 0.5s ease-out',
          }}
        />
      </div>
      <span
        className="text-[8px]"
        style={{ color: 'rgba(255,255,255,0.35)' }}
      >
        {label}
      </span>
    </div>
  )
}

/**
 * ProfessorMarkdown — renderiza respostas do Professor como CARDS ESTRUTURADOS.
 *
 * Parser: detecta seções que começam com **Título** e agrupa o conteúdo
 * abaixo de cada título num card visual com borda, ícone e background.
 * Texto fora de seções vira parágrafo normal. Listas virm bullets.
 *
 * Resultado: mesmo conteúdo textual, 3x mais legível e memorável.
 */

const CARD_ICONS: Record<string, string> = {
  'linhagem': '◈',
  'teórica': '◈',
  'conexão': '◈',
  'ponte': '⊞',
  'aparece': '⊞',
  'camada': '▦',
  'profund': '▦',
  'caso': '▸',
  'brasileiro': '▸',
  'aplicação': '●',
  'aplicar': '●',
  'padrão': '◑',
  'tese': '◉',
  'pilar': '▣',
  'mecanismo': '⚙',
  'frase': '✦',
  'claro': '✓',
  'pré-requisito': '⊘',
  'mini-revisão': '↻',
  'insight': '✦',
  'nuance': '◇',
  'leitura': '📖',
}

function getCardIcon(title: string): string {
  const lower = title.toLowerCase()
  for (const [key, icon] of Object.entries(CARD_ICONS)) {
    if (lower.includes(key)) return icon
  }
  return '·'
}

function ProfessorMarkdown({ text }: { text: string }) {
  // Divide em blocos por dupla quebra de linha
  const rawBlocks = text.trim().split(/\n\n+/)

  // Agrupa em seções: cada seção começa com um heading (**Título**)
  // e inclui todos os blocos até o próximo heading
  type Section = { heading: string | null; content: string[] }
  const sections: Section[] = []
  let currentSection: Section = { heading: null, content: [] }

  for (const block of rawBlocks) {
    const trimmed = block.trim()
    const headingMatch = trimmed.match(/^\*\*([^*]+)\*\*$/)
    if (headingMatch) {
      // Salva a seção anterior se tem conteúdo
      if (currentSection.heading || currentSection.content.length > 0) {
        sections.push(currentSection)
      }
      currentSection = { heading: headingMatch[1], content: [] }
    } else {
      currentSection.content.push(trimmed)
    }
  }
  if (currentSection.heading || currentSection.content.length > 0) {
    sections.push(currentSection)
  }

  return (
    <div className="space-y-3">
      {sections.map((section, si) => {
        if (!section.heading) {
          // Seção sem heading = parágrafos soltos
          return section.content.map((c, ci) => (
            <ParagraphOrList key={`${si}-${ci}`} text={c} />
          ))
        }

        // Seção com heading = card estruturado
        const icon = getCardIcon(section.heading)
        return (
          <div
            key={si}
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              padding: '12px 14px',
              borderLeft: `3px solid rgba(255,255,255,0.25)`,
            }}
          >
            {/* Card header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.55)',
                  lineHeight: 1,
                }}
              >
                {icon}
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ color: AMBER }}
              >
                {section.heading}
              </span>
            </div>
            {/* Card body */}
            <div className="space-y-2">
              {section.content.map((c, ci) => (
                <ParagraphOrList key={ci} text={c} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ParagraphOrList({ text }: { text: string }) {
  const lines = text.split('\n')
  const isList = lines.length > 1 && lines.every((l) => /^(\d+\.|[-•▸])\s/.test(l.trim()))

  if (isList) {
    return (
      <ul className="space-y-1 pl-1">
        {lines.map((line, li) => {
          const cleaned = line.trim().replace(/^(\d+\.|[-•▸])\s+/, '')
          return (
            <li
              key={li}
              className="text-[11px] leading-relaxed text-white/72 pl-3 relative"
            >
              <span
                className="absolute left-0 top-[0.5em]"
                style={{ color: AMBER, fontSize: 7 }}
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

  return (
    <p
      className="text-[11px] leading-relaxed text-white/72"
      style={{ textAlign: 'justify', hyphens: 'auto' }}
    >
      {renderInline(text)}
    </p>
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
      // Dados adaptativos do aluno
      const memoryData = mode === 'review' ? getReviewData(moduleId) : undefined
      // Profundidade enviada em TODOS os modos — calibra a resposta
      const chapterId = blockTitle ? `M1-0-cap1` : undefined // TODO: derivar do contexto real
      const depthInfo = chapterId ? getDepthData(chapterId) : undefined

      const enrichedContent = [
        blockContent ?? '',
        depthInfo ? `\n\n--- PROFUNDIDADE DO ALUNO ---\n${depthInfo}` : '',
        memoryData ? `\n\n--- DADOS DE MEMÓRIA DO ALUNO (Ebbinghaus) ---\n${memoryData}` : '',
      ].join('')

      const res = await fetch('/api/professor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          moduleId,
          submoduleTitle,
          blockTitle,
          blockContent: enrichedContent,
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

              {/* Barra de memória Ebbinghaus + Medidor de profundidade */}
              <MemoryBar moduleId={moduleId} />
              <DepthMeter chapterId="M1-0-cap1" />

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
                    {/* Grafo visual no modo Conectar */}
                    {activeMode === 'connect' && (() => {
                      const graphData = getChapter1Graph()
                      return <ConceptGraph nodes={graphData.nodes} edges={graphData.edges} />
                    })()}
                    {/* Calculadora embutida no modo Aplicar */}
                    {activeMode === 'apply' && (
                      <ProfessorCalc
                        title="Gap de Digitalização — Custo de Estar na Fase Errada"
                        description="Simule quanto sua empresa perde por não avançar entre as fases da Era Digital. O gap cresce exponencialmente porque o mercado ao redor acelera enquanto você estagna."
                        sliders={[
                          { id: 'receita', label: 'Receita anual', min: 500000, max: 50000000, default: 5000000, unit: 'R$', step: 500000 },
                          { id: 'perda', label: 'Perda anual por ineficiência', min: 1, max: 15, default: 5, unit: '%' },
                          { id: 'mercado', label: 'Crescimento do mercado digital', min: 5, max: 30, default: 12, unit: '%/ano' },
                          { id: 'anos', label: 'Anos sem avançar de fase', min: 1, max: 10, default: 5, unit: ' anos' },
                        ]}
                        formula="receita * (Math.pow(1 + mercado/100, anos) - Math.pow(1 - perda/100, anos))"
                        resultLabel="Gap acumulado em relação ao mercado"
                        resultFormat="currency"
                        interpretation={[
                          { max: 2000000, label: 'Gap gerenciável — mas crescendo rápido', color: '#ffffff' },
                          { max: 10000000, label: 'Gap crítico — concorrentes distanciando', color: 'rgba(255,180,60,0.95)' },
                          { max: 999999999999, label: 'Gap irreversível — risco existencial', color: 'rgba(255,80,80,0.95)' },
                        ]}
                      />
                    )}
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
