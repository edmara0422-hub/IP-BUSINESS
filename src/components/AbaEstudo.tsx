'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Brain,
  BriefcaseBusiness,
  Calculator,
  ChevronDown,
  FileSearch,
  HandCoins,
  HeartHandshake,
  Lightbulb,
  List,
  Loader2,
  Paperclip,
  PenLine,
  Play,
  Radar,
  SendHorizontal,
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle2,
  BookmarkPlus,
  Eraser,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import BusinessClock from '@/components/business/BusinessClock'
import { useBusinessStore } from '@/store/business-store'
import type { ContentBlock, TutorMessage } from '@/types/intelligence'
import { INTELLIGENCE_CONTENT } from '@/data/intelligence-content'
import { SIM_COMPONENTS as SIM_M3 } from '@/components/intelligence/SimulationsM3'
import { SIM_M1_CREATIVITY } from '@/components/intelligence/SimulationsM1Creativity'
import { SIM_M2 } from '@/components/intelligence/SimulationsM2'
import { SIM_M6 } from '@/components/intelligence/SimulationsM6'
import { SIM_INTERACTIVE } from '@/components/intelligence/SimulationsInteractive'
import { FallacyDetector, EthicsDilemmas, PhilosophyTribunal, ProfitOptimization, DataInterpretation, InvestmentCalculator, BreakevenSimulator, KPIDashboard, DataToDecision } from '@/components/intelligence/SimulationsM4'
import { ArgumentBuilder, LeanCanvas, MacroScenario, TextReview, PitchEvaluation, ConjunturaAnalysis } from '@/components/intelligence/SimulationsM5'
import { SIM_ESG } from '@/components/intelligence/SimulationsESG'
import SmartContentRenderer from '@/components/intelligence/SmartContentRenderer'
import ContentBlockRenderer from '@/components/intelligence/ContentBlockRenderer'
import IAProfessor from '@/components/intelligence/IAProfessor'

const SIM_COMPONENTS: Record<string, React.ComponentType> = {
  ...SIM_M3,
  ...SIM_M1_CREATIVITY,
  ...SIM_M2,
  ...SIM_M6,
  ...SIM_INTERACTIVE,
  ...SIM_ESG,
  'fallacy-detector': FallacyDetector,
  'ethics-dilemmas': EthicsDilemmas,
  'philosophy-tribunal': PhilosophyTribunal,
  'profit-optimization': ProfitOptimization,
  'investment-calculator': InvestmentCalculator,
  'breakeven-simulator': BreakevenSimulator,
  'data-interpretation': DataInterpretation,
  'kpi-dashboard': KPIDashboard,
  'data-to-decision': DataToDecision,
  'argument-builder': ArgumentBuilder,
  'text-review': TextReview,
  'lean-canvas': LeanCanvas,
  'pitch-evaluation': PitchEvaluation,
  'macro-scenario': MacroScenario,
  'conjuntura-analysis': ConjunturaAnalysis,
}

// ─── Types ────────────────────────────────────────────────────────────────────

type SidebarTool = 'sumario' | 'intelligence' | 'revisao' | 'notas' | 'performance'


type IntelligenceModule = {
  id: string
  title: string
  icon: LucideIcon
  theory: string[]
  overview: string
}

// ─── Module Data ──────────────────────────────────────────────────────────────

const INTELLIGENCE_MODULES: IntelligenceModule[] = [
  {
    id: 'M1',
    title: 'Inovacao, Criatividade e Sustentabilidade',
    icon: Lightbulb,
    theory: ['Inovacao, Transformacao e Ferramentas Digitais', 'Pensamento Criativo', 'Sustentabilidade em Negocios'],
    overview: 'Este modulo organiza a base de inovacao, criatividade e sustentabilidade para transformar ideias em estruturas de negocio viaveis.',
  },
  {
    id: 'M2',
    title: 'Fundamentos de Gestao',
    icon: Calculator,
    theory: ['Gestao de Negocios', 'Demonstracoes Contabeis', 'Matematica Financeira'],
    overview: 'Aqui entram os fundamentos de gestao, leitura contabil e matematica financeira que sustentam qualquer operacao empresarial.',
  },
  {
    id: 'M3',
    title: 'Mercado e Pessoas',
    icon: Users,
    theory: ['Economia de Empresa e Analise Mercadologica', 'Lideranca e Gestao de Equipes'],
    overview: 'Este modulo aborda mercado, comportamento de escolha, dinamica competitiva e leitura de pessoas dentro da operacao.',
  },
  {
    id: 'M4',
    title: 'Logica e Humanidades',
    icon: Brain,
    theory: ['Filosofia', 'Calculo Aplicado a Negocios', 'Analise Estatistica'],
    overview: 'O modulo conecta raciocinio logico, estatistica e filosofia para dar base de criterio, modelagem e leitura de risco.',
  },
  {
    id: 'M5',
    title: 'Empreendedorismo e Estrategia',
    icon: BriefcaseBusiness,
    theory: ['Leitura e Escrita Academica', 'Empreendedorismo e Inovacao', 'Ambiente Macroeconomico'],
    overview: 'A base aqui e estrategica: narrativa, empreendedorismo e leitura do ambiente macro para decidir crescimento e posicionamento.',
  },
  {
    id: 'M6',
    title: 'Financas Avancadas',
    icon: HandCoins,
    theory: ['Analise Financeira', 'Precificacao', 'Etica'],
    overview: 'Este modulo foca leitura financeira avancada, construcao de preco e criterio etico para sustentar lucro sem perder coerencia.',
  },
  {
    id: 'M7',
    title: 'Intervencao e Sociedade',
    icon: HeartHandshake,
    theory: ['Empreendedorismo Social', 'Teologia e Sociedade', 'Projeto de Intervencao em Negocios'],
    overview: 'Aqui o estudo desloca o negocio para impacto real, intervencao estruturada e responsabilidade social aplicada.',
  },
  {
    id: 'M8',
    title: 'Pesquisa e Identidade',
    icon: FileSearch,
    theory: ['Educacao, Identidade e Solidariedade', 'Pesquisa Aplicada a Negocios'],
    overview: 'Este modulo organiza identidade, pesquisa e leitura de dados para validar decisao, comportamento e proposta de valor.',
  },
]

// ─── Sidebar tool list ────────────────────────────────────────────────────────

const SIDEBAR_TOOLS: { id: SidebarTool; label: string; icon: LucideIcon }[] = [
  { id: 'sumario', label: 'Sumário', icon: List },
  { id: 'intelligence', label: 'IA Tutor', icon: Sparkles },
  { id: 'notas', label: 'Notas', icon: PenLine },
  { id: 'performance', label: 'Performance', icon: TrendingUp },
  { id: 'revisao', label: 'Vídeos', icon: Play },
]

// ─── Block renderer ───────────────────────────────────────────────────────────

// Helpers para extrair título/conteúdo de qualquer tipo de bloco (usado pelo IA Professor)
function extractBlockTitle(block: ContentBlock): string | undefined {
  if ('title' in block && block.title) return block.title
  if (block.type === 'concept') return block.term
  if (block.type === 'author-card') return block.name
  if (block.type === 'method-card') return block.name
  if (block.type === 'decision') return 'Decisão'
  if (block.type === 'challenge') return 'Desafio'
  return undefined
}

function extractBlockContent(block: ContentBlock): string | undefined {
  switch (block.type) {
    case 'text': return block.body
    case 'layered-text': return `${block.essence}\n\n${block.development}`
    case 'concept': return `${block.term}: ${block.definition}${block.example ? `\nExemplo: ${block.example}` : ''}`
    case 'decision': return `Cenário: ${block.scenario}\nOpções: ${block.options.map((o) => o.label).join(' | ')}`
    case 'challenge': return block.prompt
    case 'framework': return `${block.title}: ${block.description}`
    case 'number-crunch': return `${block.title}: ${block.scenario}`
    case 'ai-probe': return block.context
    case 'compare': return `${block.title}${block.question ? ` — ${block.question}` : ''}`
    case 'inline-exercise': return `${block.prompt}${block.context ? `\n${block.context}` : ''}`
    case 'author-card': return `${block.name} (${block.affiliation}): ${block.contribution}`
    case 'timeline': return `${block.title}: ${block.events.map((e) => `${e.year} ${e.title}`).join('; ')}`
    case 'method-card': return `${block.name} (${block.origin}): ${block.whenToUse.join('; ')}`
    default: return undefined
  }
}

function CadernoBlock({ block, moduleId, submoduleTitle }: { block: ContentBlock; moduleId?: string; submoduleTitle?: string }) {
  const [videoOpen, setVideoOpen] = useState(false)

  if (block.type === 'text') {
    return (
      <div id={`block-${block.id}`}>
        <SmartContentRenderer title={block.title ?? ''} body={block.body} />
      </div>
    )
  }

  if (block.type === 'video') {
    return (
      <div id={`block-${block.id}`} className="scroll-mt-6">
        <p className="mb-2 text-[9px] uppercase tracking-[0.32em] text-white/26">Vídeo</p>
        {!videoOpen ? (
          <button
            onClick={() => setVideoOpen(true)}
            className="group relative w-full overflow-hidden rounded-[1.3rem] border border-white/8 bg-black/40"
            style={{ aspectRatio: '16/9' }}
          >
            {block.thumbnail ? (
              <img src={block.thumbnail} alt={block.title} className="absolute inset-0 h-full w-full object-cover opacity-50" />
            ) : (
              <div className="absolute inset-0 grid-bg opacity-40" />
            )}
            <div className="relative flex h-full flex-col items-center justify-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/16 bg-black/50 backdrop-blur-sm transition group-hover:bg-white/10">
                <Play className="ml-0.5 h-5 w-5 text-white/84" />
              </div>
              <p className="text-sm font-medium text-white/72">{block.title}</p>
              {block.duration && <p className="text-[10px] text-white/36">{block.duration}</p>}
            </div>
          </button>
        ) : (
          <div className="overflow-hidden rounded-[1.3rem]" style={{ aspectRatio: '16/9' }}>
            <iframe src={block.url} className="h-full w-full" allowFullScreen title={block.title} />
          </div>
        )}
      </div>
    )
  }

  if (block.type === 'simulation') {
    const SimComp = SIM_COMPONENTS[block.simulationId]
    return (
      <div id={`block-${block.id}`} className="scroll-mt-6 rounded-[1.3rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div>
          <p className="text-[9px] uppercase tracking-[0.28em] text-white/26">Simulação Interativa</p>
          <p className="mt-1 text-[0.95rem] font-semibold text-white/86">{block.title}</p>
          {block.description && <p className="mt-1 text-[12px] leading-relaxed text-white/38">{block.description}</p>}
        </div>
        {SimComp ? <SimComp /> : (
          <p className="text-[12px] text-white/28">Simulação em preparação.</p>
        )}
      </div>
    )
  }

  if (block.type === 'attachment') {
    return (
      <div id={`block-${block.id}`} className="scroll-mt-6 chrome-subtle flex items-center gap-3 rounded-[1rem] px-4 py-3">
        <Paperclip className="h-4 w-4 shrink-0 text-white/44" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white/72">{block.title}</p>
          <p className="text-[10px] uppercase tracking-[0.12em] text-white/28">{block.fileType}</p>
        </div>
      </div>
    )
  }

  // Novos tipos interativos (incluindo blocos do redesign: layered-text, compare, inline-exercise, author-card, timeline, method-card)
  const interactiveTypes = [
    'concept', 'ai-probe', 'framework', 'challenge', 'number-crunch', 'decision',
    'layered-text', 'compare', 'inline-exercise', 'author-card', 'timeline', 'method-card',
    'guided-lesson', 'living-text', 'chapter',
  ]
  if ('type' in block && interactiveTypes.includes(block.type)) {
    return (
      <div id={`block-${block.id}`} className="scroll-mt-6">
        <ContentBlockRenderer block={block} moduleId={moduleId} submoduleTitle={submoduleTitle} />
      </div>
    )
  }

  return null
}

// ─── StudyProgressRail (DO NOT MODIFY) ────────────────────────────────────────

function StudyProgressRail({
  modules,
  activeIndex,
  onSelect,
}: {
  modules: IntelligenceModule[]
  activeIndex: number | null
  onSelect: (index: number) => void
}) {
  return (
    <div className="chrome-panel overflow-hidden rounded-[1.65rem] p-5 md:p-6">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-white/84">
          Clique em M1, M2, M3... para abrir o modulo.
        </h3>
      </div>

      <div className="relative px-2 md:px-4">
        <div className="pointer-events-none absolute inset-x-0 top-[1.3rem] h-px bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.26)_18%,rgba(255,255,255,0.16)_52%,rgba(255,255,255,0.08)_100%)]" />

        <div className="relative flex items-start justify-between gap-2 md:gap-3">
          {modules.map((module, index) => {
            const active = index === activeIndex
            const floatDistance = active ? -6 : -3
            const floatDuration = 3.6 + index * 0.18

            return (
              <button
                key={module.id}
                onClick={() => onSelect(index)}
                className="group flex min-w-0 flex-1 flex-col items-center gap-2 text-center"
                title={module.title}
              >
                <motion.div
                  animate={{ y: [0, floatDistance, 0] }}
                  transition={{ duration: floatDuration, repeat: Infinity, ease: 'easeInOut', delay: index * 0.12 }}
                >
                  <motion.div
                    className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 md:h-12 md:w-12 ${
                      active
                        ? 'border-white/24 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(218,224,231,0.34)_20%,rgba(22,24,28,0.96)_100%)]'
                        : 'border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(14,16,20,0.92)_100%)]'
                    }`}
                    whileHover={{ y: -2, scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={`absolute inset-[5px] rounded-full ${
                        active
                          ? 'bg-[radial-gradient(circle,rgba(255,255,255,0.42)_0%,rgba(186,194,203,0.16)_45%,transparent_78%)]'
                          : 'bg-[radial-gradient(circle,rgba(255,255,255,0.16)_0%,transparent_72%)]'
                      }`}
                    />
                    <span className={`relative text-[10px] font-semibold uppercase tracking-[0.16em] ${active ? 'text-white' : 'text-white/54'}`}>
                      {module.id}
                    </span>
                  </motion.div>
                </motion.div>

                <div className={`mx-auto h-1.5 w-1.5 rounded-full transition-all duration-300 ${active ? 'bg-white/82 shadow-[0_0_10px_rgba(255,255,255,0.32)]' : 'bg-white/20 group-hover:bg-white/42'}`} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Video Player ─────────────────────────────────────────────────────────────

function VideoPlayer({ url }: { url: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)

  function handleStart() {
    const v = ref.current
    if (!v) return
    setStarted(true)
    // inicia mutado para passar pela política de autoplay do Chromium,
    // depois desmuta dentro da mesma cadeia (contexto de gesto do usuário)
    v.muted = true
    v.play()
      .then(() => { v.muted = false; v.volume = 1 })
      .catch(() => { /* fallback: usuário pode clicar play nos controles nativos */ })
  }

  return (
    <div className="relative h-full w-full bg-black">
      <video ref={ref} src={url} className="h-full w-full" controls preload="auto" />
      {!started && (
        <button
          onClick={handleStart}
          className="absolute inset-0 flex items-center justify-center bg-black/50"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black/60 backdrop-blur-sm transition hover:bg-white/10">
            <Play className="ml-1 h-6 w-6 text-white/90" />
          </div>
        </button>
      )}
    </div>
  )
}

// ─── Video Panel ──────────────────────────────────────────────────────────────

function VideoPanel({ blocks }: { blocks: ContentBlock[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const videos = blocks.filter((b) => b.type === 'video') as Extract<ContentBlock, { type: 'video' }>[]

  if (videos.length === 0) {
    return <p className="text-[12px] leading-relaxed text-white/28">Nenhum vídeo neste tópico ainda.</p>
  }

  return (
    <div className="mx-auto max-w-[260px] space-y-2 md:max-w-none">
      <p className="mb-3 text-[9px] uppercase tracking-[0.32em] text-white/28">Vídeos do tópico</p>
      {videos.map((block) =>
        openId === block.id ? (
          <div key={block.id} className="mx-auto max-w-[280px] space-y-2 md:max-w-none">
            <div className="overflow-hidden rounded-[0.75rem] bg-black md:rounded-[1rem]" style={{ aspectRatio: '16/9' }}>
              {/\.(mp4|webm|ogg|mov)(\?|$)/i.test(block.url) ? (
                <VideoPlayer url={block.url} />
              ) : (
                <iframe
                  src={block.url.includes('drive.google.com') ? block.url.replace('/preview', '/preview?embedded=true') : block.url}
                  className="h-full w-full"
                  allowFullScreen
                  allow="autoplay; encrypted-media; picture-in-picture"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={block.title}
                />
              )}
            </div>
            <button
              onClick={() => setOpenId(null)}
              className="w-full rounded-[0.85rem] py-1.5 text-[9px] uppercase tracking-[0.2em] text-white/28 transition hover:text-white/52"
            >
              ← Voltar à lista
            </button>
          </div>
        ) : (
          <button
            key={block.id}
            onClick={() => setOpenId(block.id)}
            className="group flex w-full items-center gap-3 rounded-[1rem] border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-left transition hover:bg-white/[0.05]"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/30 transition group-hover:border-white/20">
              <Play className="ml-0.5 h-3 w-3 text-white/52" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[12px] text-white/64">{block.title}</p>
              {block.duration && <p className="text-[9px] text-white/28">{block.duration}</p>}
            </div>
          </button>
        )
      )}
    </div>
  )
}

// ─── Sidebar Panel ────────────────────────────────────────────────────────────

function StudySidebar({
  tool,
  onToolChange,
  blocks,
  submoduleTitle,
  tutorMessages,
  tutorInput,
  onTutorInputChange,
  isTutorLoading,
  onAskTutor,
  onClearTutor,
  onSaveToNotes,
  notes,
  onNotesChange,
  totalSubmodules,
  readCount,
  activeBlockIdx,
  onGoToBlock,
}: {
  tool: SidebarTool
  onToolChange: (t: SidebarTool) => void
  blocks: ContentBlock[]
  submoduleTitle: string
  tutorMessages: TutorMessage[]
  tutorInput: string
  onTutorInputChange: (v: string) => void
  isTutorLoading: boolean
  onAskTutor: (question: string) => void
  onClearTutor: () => void
  onSaveToNotes: () => void
  notes: string
  onNotesChange: (v: string) => void
  totalSubmodules: number
  readCount: number
  activeBlockIdx: number
  onGoToBlock: (i: number) => void
}) {

  return (
    <div className="flex h-full flex-col rounded-[1.5rem] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(6,6,8,0.06)_100%)] backdrop-blur-xl">
      {/* Tool tabs */}
      <div className="flex gap-1 border-b border-white/[0.06] p-2">
        {SIDEBAR_TOOLS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onToolChange(id)}
            title={label}
            className={`flex flex-1 flex-col items-center gap-1 rounded-[0.9rem] py-2.5 transition-all duration-200 ${
              tool === id ? 'bg-white/[0.08] text-white/90' : 'text-white/28 hover:text-white/52'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="text-[8px] uppercase tracking-[0.18em]">{label}</span>
          </button>
        ))}
      </div>

      {/* Tool content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">

          {/* Sumário */}
          {tool === 'sumario' && (
            <motion.div key="sumario" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="space-y-1">
              <p className="mb-3 text-[9px] uppercase tracking-[0.32em] text-white/28">Índice do caderno</p>
              {(() => {
                const cadernoBlocks = blocks.filter((b) => b.type !== 'video')
                if (cadernoBlocks.length === 0) return <p className="text-[12px] text-white/28">Nenhum bloco ainda.</p>
                return cadernoBlocks.map((block, i) => {
                  const title = 'title' in block ? block.title : block.id
                  const icon = block.type === 'simulation' ? '◈' : block.type === 'attachment' ? '⊕' : '·'
                  const isActive = i === activeBlockIdx
                  return (
                    <button
                      key={block.id}
                      onClick={() => onGoToBlock(i)}
                      className={`flex w-full items-start gap-2 rounded-[0.85rem] px-3 py-2 text-left text-[12px] transition ${
                        isActive ? 'bg-white/[0.08] text-white/88' : 'text-white/46 hover:bg-white/[0.04] hover:text-white/76'
                      }`}
                    >
                      <span className="shrink-0 text-[10px] text-white/22 mt-0.5 w-3">{icon}</span>
                      <span className="leading-snug">{title}</span>
                    </button>
                  )
                })
              })()}
            </motion.div>
          )}

          {/* Intelligence — IA Tutor */}
          {tool === 'intelligence' && (
            <motion.div key="intelligence" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="flex h-full flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[9px] uppercase tracking-[0.32em] text-white/28">IA Tutor · {submoduleTitle}</p>
                {tutorMessages.length > 0 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={onSaveToNotes}
                      title="Salvar em Notas"
                      className="flex items-center gap-1 rounded-[0.6rem] px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-white/32 transition hover:bg-white/[0.05] hover:text-white/62"
                    >
                      <BookmarkPlus className="h-3 w-3" />
                      Notas
                    </button>
                    <button
                      onClick={onClearTutor}
                      title="Limpar conversa"
                      className="flex items-center gap-1 rounded-[0.6rem] px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-white/32 transition hover:bg-white/[0.05] hover:text-white/62"
                    >
                      <Eraser className="h-3 w-3" />
                      Limpar
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto">
                {tutorMessages.length === 0 && (
                  <div className="space-y-3">
                    <p className="text-[12px] leading-relaxed text-white/34">
                      Selecione um trecho do caderno e clique em <span className="text-white/60">Explicar</span>, ou escolha abaixo.
                    </p>
                    <div className="space-y-1.5">
                      <p className="text-[9px] uppercase tracking-[0.22em] text-white/22">Sugestões sobre {submoduleTitle}</p>
                      {[
                        `Qual o conceito-chave de ${submoduleTitle}?`,
                        `Dê um exemplo real aplicado de ${submoduleTitle}.`,
                        `Quais erros comuns em ${submoduleTitle}?`,
                        `Como conectar ${submoduleTitle} com outros tópicos?`,
                      ].map((s, i) => (
                        <button key={i} onClick={() => onAskTutor(s)}
                          className="w-full text-left px-3 py-2 rounded-lg text-[11px] leading-relaxed text-white/50 hover:text-white/80 transition-all"
                          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {tutorMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`rounded-[1rem] px-3 py-2.5 text-[12px] leading-relaxed ${
                      msg.role === 'user' ? 'bg-white/[0.06] text-white/72' : 'text-white/62'
                    }`}
                  >
                    {msg.role === 'assistant' && <p className="mb-1 text-[9px] uppercase tracking-[0.2em] text-white/28">Tutor</p>}
                    {msg.content}
                  </div>
                ))}
                {isTutorLoading && (
                  <div className="flex items-center gap-2 text-white/36">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span className="text-[11px]">Pensando...</span>
                  </div>
                )}
              </div>

              <form
                onSubmit={(e) => { e.preventDefault(); if (tutorInput.trim()) { onAskTutor(tutorInput.trim()); onTutorInputChange('') } }}
                className="flex items-center gap-2 rounded-[1.1rem] border border-white/[0.08] bg-black/20 px-3 py-2"
              >
                <input
                  value={tutorInput}
                  onChange={(e) => onTutorInputChange(e.target.value)}
                  placeholder="Pergunta..."
                  className="flex-1 bg-transparent text-[12px] text-white/72 outline-none placeholder:text-white/24"
                />
                <button type="submit" disabled={!tutorInput.trim() || isTutorLoading} className="text-white/42 transition hover:text-white/82 disabled:opacity-30">
                  <SendHorizontal className="h-3.5 w-3.5" />
                </button>
              </form>
            </motion.div>
          )}

          {/* Vídeos */}
          {tool === 'revisao' && (
            <VideoPanel blocks={blocks} />
          )}

          {/* Notas */}
          {tool === 'notas' && (
            <motion.div key="notas" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="flex h-full flex-col gap-2">
              <p className="text-[9px] uppercase tracking-[0.32em] text-white/28">Suas notas</p>
              <textarea
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="Escreva suas anotações..."
                className="flex-1 resize-none rounded-[1rem] border border-white/[0.06] bg-black/16 p-3 text-[12px] leading-relaxed text-white/68 outline-none placeholder:text-white/22"
                rows={12}
              />
              {notes.length > 0 && (
                <p className="text-right text-[9px] text-white/22">{notes.length} caracteres · salvo</p>
              )}
            </motion.div>
          )}

          {/* Performance */}
          {tool === 'performance' && (
            <motion.div key="performance" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="space-y-4">
              <p className="text-[9px] uppercase tracking-[0.32em] text-white/28">Progresso do módulo</p>

              <div className="chrome-subtle rounded-[1.1rem] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/32">Sub-módulos lidos</p>
                  <span className="text-[10px] font-semibold text-white/68">{readCount} / {totalSubmodules}</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-white/52 transition-all duration-700"
                    style={{ width: totalSubmodules > 0 ? `${(readCount / totalSubmodules) * 100}%` : '0%' }}
                  />
                </div>
              </div>

              {readCount === totalSubmodules && totalSubmodules > 0 ? (
                <div className="flex items-center gap-2 rounded-[1rem] border border-white/10 px-3 py-2.5">
                  <CheckCircle2 className="h-4 w-4 text-white/62" />
                  <p className="text-[12px] text-white/62">Módulo completo</p>
                </div>
              ) : (
                <p className="text-[12px] leading-relaxed text-white/34">
                  Abra cada sub-módulo para marcar como lido e avançar no progresso.
                </p>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AbaEstudo() {
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null)
  const [openSubmoduleId, setOpenSubmoduleId] = useState<string | null>(null)
  const [activeSidebarTool, setActiveSidebarTool] = useState<SidebarTool>('sumario')
  const [tutorHistory, setTutorHistory] = useState<Record<string, TutorMessage[]>>({})
  const [tutorInput, setTutorInput] = useState('')
  const [isTutorLoading, setIsTutorLoading] = useState(false)
  const [selectionPopup, setSelectionPopup] = useState<{ x: number; y: number; text: string } | null>(null)
  const [activeBlockIdx, setActiveBlockIdx] = useState<Record<string, number>>({})
  const popupRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function onMouseUp() {
      setTimeout(() => {
        const selection = window.getSelection()
        if (!selection || selection.isCollapsed || selection.rangeCount === 0) return
        const text = selection.toString().trim()
        if (text.length < 4) return
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        if (rect.width === 0 && rect.height === 0) return
        setSelectionPopup({ x: rect.left + rect.width / 2, y: rect.top - 52, text })
      }, 20)
    }

    function onMouseDown(e: MouseEvent) {
      if (popupRef.current && popupRef.current.contains(e.target as Node)) return
      setSelectionPopup(null)
    }

    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousedown', onMouseDown)
    return () => {
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  const { studyNotes, studyProgress, updateStudyNote, markSubmoduleRead } = useBusinessStore()

  const current = activeModuleIndex !== null ? INTELLIGENCE_MODULES[activeModuleIndex] : null
  const currentContent = current ? INTELLIGENCE_CONTENT.find((c) => c.moduleId === current.id) : null
  const currentTutorMessages = tutorHistory[openSubmoduleId ?? ''] ?? []

  const readCount = current
    ? current.theory.filter((_, i) => studyProgress[`${current.id}-${i}`]).length
    : 0

  function handleSelectModule(index: number) {
    if (activeModuleIndex === index) {
      setActiveModuleIndex(null)
      setOpenSubmoduleId(null)
    } else {
      setActiveModuleIndex(index)
      setOpenSubmoduleId(null)
    }
  }

  function handleClearTutor() {
    setTutorHistory((h) => ({ ...h, [openSubmoduleId ?? '']: [] }))
  }

  function handleSaveToNotes() {
    const subId = openSubmoduleId ?? ''
    const msgs = tutorHistory[subId] ?? []
    if (msgs.length === 0) return
    const formatted = msgs
      .map((m) => (m.role === 'user' ? `Pergunta: ${m.content}` : `Tutor: ${m.content}`))
      .join('\n\n')
    const current = studyNotes[subId] ?? ''
    const separator = current ? '\n\n---\n\n' : ''
    updateStudyNote(subId, current + separator + formatted)
    setActiveSidebarTool('notas')
  }

  function handleToggleSubmodule(subId: string, moduleId: string, topicIndex: number) {
    if (openSubmoduleId === subId) {
      setOpenSubmoduleId(null)
    } else {
      setOpenSubmoduleId(subId)
      setActiveSidebarTool('sumario')
      markSubmoduleRead(`${moduleId}-${topicIndex}`)
      setActiveBlockIdx((prev) => ({ ...prev, [subId]: prev[subId] ?? 0 }))
    }
  }

  async function handleAskTutor(question: string, preText?: string) {
    const text = preText ?? ''
    const q = question || `Explica este trecho: "${text.slice(0, 160)}"`
    setActiveSidebarTool('intelligence')
    setSelectionPopup(null)

    const prev = tutorHistory[openSubmoduleId ?? ''] ?? []
    const userMsg: TutorMessage = { role: 'user', content: q }
    const updated = [...prev, userMsg]
    setTutorHistory((h) => ({ ...h, [openSubmoduleId ?? '']: updated }))
    setIsTutorLoading(true)

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedText: text,
          question: q,
          moduleId: current?.id ?? '',
          submoduleTitle: current?.theory[Number((openSubmoduleId ?? '').split('-').pop())] ?? current?.title ?? '',
          history: prev,
        }),
      })
      const data = (await res.json()) as { response: string }
      setTutorHistory((h) => ({
        ...h,
        [openSubmoduleId ?? '']: [...updated, { role: 'assistant', content: data.response }],
      }))
    } finally {
      setIsTutorLoading(false)
    }
  }

  const CurrentIcon = current?.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* ── Cinematic hero + trilho ── */}
      <div className="relative overflow-hidden rounded-[2rem] px-6 py-7 md:px-8 md:py-8">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px silver-divider opacity-80" />
        <div className="pointer-events-none absolute inset-x-[8%] bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)]" />
        <div className="pointer-events-none absolute left-[8%] top-[22%] h-28 w-36 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_76%)] blur-2xl" />
        <div className="pointer-events-none absolute bottom-[-1rem] right-[8%] h-24 w-28 rounded-full bg-[radial-gradient(circle,rgba(192,199,208,0.07)_0%,transparent_76%)] blur-2xl" />
        <div className="pointer-events-none absolute left-0 top-[15%] h-[60%] w-px bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.06)_50%,transparent)]" />
        <div className="pointer-events-none absolute right-0 top-[15%] h-[60%] w-px bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.06)_50%,transparent)]" />

        <div className="mb-7">
          <BusinessClock variant="hero" showGreeting />
        </div>

        <div className="mb-8">
          <p className="mb-3 text-[9px] uppercase tracking-[0.52em] text-white/22">Intelligence Operating System</p>
          <h2
            className="text-[clamp(1.9rem,3.8vw,3.2rem)] font-semibold leading-[1.06] tracking-[-0.02em] text-white/94"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Conhecimento estruturado,<br />
            <span className="metal-text">módulo por módulo.</span>
          </h2>
          <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/36">
            8 módulos, 24 disciplinas. Clique em um trilho para abrir a página de estudo.
          </p>
        </div>

        {/* StudyProgressRail — NÃO MODIFICAR */}
        <StudyProgressRail
          modules={INTELLIGENCE_MODULES}
          activeIndex={activeModuleIndex}
          onSelect={handleSelectModule}
        />
      </div>

      {/* ── Module content ── */}
      <AnimatePresence mode="wait">
        {current ? (
          <motion.div
            key={`module-${current.id}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {/* Module hero card */}
            <div className="relative overflow-hidden rounded-[2rem] px-6 py-7 md:px-8">
              <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px silver-divider opacity-60" />
              <div className="pointer-events-none absolute right-[8%] top-[20%] h-32 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_72%)] blur-2xl" />

              <div className="flex items-start gap-5">
                <div className="chrome-subtle flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.4rem]">
                  {CurrentIcon ? <CurrentIcon className="h-7 w-7 text-white/88" /> : null}
                </div>
                <div className="min-w-0">
                  <p className="mb-2 text-[9px] uppercase tracking-[0.44em] text-white/26">Módulo {current.id}</p>
                  <h3
                    className="text-[clamp(1.3rem,2.8vw,1.9rem)] font-semibold leading-tight tracking-[-0.01em] text-white/94"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {current.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-white/44">{current.overview}</p>
                </div>
                <div className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border border-white/[0.08] px-2.5 py-1.5">
                  <Radar className="h-3 w-3 text-white/42" />
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/38">{current.id}</span>
                </div>
              </div>
            </div>

            {/* Sub-modules accordion */}
            <div className="space-y-2">
              {current.theory.map((theoryItem, index) => {
                const subId = `${current.id}-${index}`
                const isOpen = openSubmoduleId === subId
                const topic = currentContent?.topics[index]
                const isRead = studyProgress[`${current.id}-${index}`]

                return (
                  <div key={subId} className="overflow-hidden rounded-[1.5rem] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(6,6,8,0.04)_100%)] backdrop-blur-xl">
                    {/* Accordion header */}
                    <button
                      onClick={() => handleToggleSubmodule(subId, current.id, index)}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-white/[0.02]"
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold uppercase tracking-[0.1em] transition-all duration-300 ${
                        isOpen ? 'border-white/24 bg-white/88 text-[#050505]' : 'border-white/12 text-white/46'
                      }`}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] uppercase tracking-[0.28em] text-white/28">{current.id} · Disciplina</p>
                        <p className={`mt-0.5 text-[0.92rem] font-semibold tracking-[-0.005em] transition-colors ${isOpen ? 'text-white/92' : 'text-white/64'}`}>
                          {theoryItem}
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        {isRead && !isOpen && <CheckCircle2 className="h-3.5 w-3.5 text-white/36" />}
                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                          <ChevronDown className="h-4 w-4 text-white/28" />
                        </motion.div>
                      </div>
                    </button>

                    {/* Accordion panel — Caderno + Sidebar */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="border-t border-white/[0.06] p-5">
                            <div className="grid gap-5 xl:grid-cols-[1fr_256px]">
                              {/* Sidebar — order-1 on mobile (aparece primeiro), order-2 em xl */}
                              <div className="order-1 xl:order-2">
                                <StudySidebar
                                  tool={activeSidebarTool}
                                  onToolChange={setActiveSidebarTool}
                                  blocks={topic?.blocks ?? []}
                                  submoduleTitle={theoryItem}
                                  tutorMessages={currentTutorMessages}
                                  tutorInput={tutorInput}
                                  onTutorInputChange={setTutorInput}
                                  isTutorLoading={isTutorLoading}
                                  onAskTutor={(q) => handleAskTutor(q)}
                                  onClearTutor={handleClearTutor}
                                  onSaveToNotes={handleSaveToNotes}
                                  notes={studyNotes[subId] ?? ''}
                                  onNotesChange={(text) => updateStudyNote(subId, text)}
                                  totalSubmodules={current.theory.length}
                                  readCount={readCount}
                                  activeBlockIdx={activeBlockIdx[subId] ?? 0}
                                  onGoToBlock={(i) => setActiveBlockIdx((prev) => ({ ...prev, [subId]: i }))}
                                />
                              </div>

                              {/* Caderno — 1 bloco por vez */}
                              <div className={(activeSidebarTool === 'sumario' || activeSidebarTool === 'intelligence') ? 'order-2 xl:order-1 min-w-0' : 'hidden'}>
                                {(() => {
                                  const blocks = topic?.blocks ?? []
                                  if (blocks.length === 0) {
                                    return (
                                      <div className="py-12 text-center">
                                        <p
                                          className="select-none text-[clamp(2.5rem,8vw,5rem)] font-semibold leading-none tracking-[-0.04em] text-white/[0.05]"
                                          style={{ fontFamily: 'Poppins, sans-serif' }}
                                        >
                                          {current.id}
                                        </p>
                                        <p className="mt-4 text-[12px] text-white/28">Conteúdo em preparação.</p>
                                        <p className="mt-1 text-[11px] text-white/18">Use o Tutor IA na sidebar para aprofundar o tema.</p>
                                      </div>
                                    )
                                  }
                                  const cadernoBlocks = blocks.filter((b) => b.type !== 'video')
                                  const idx = Math.min(activeBlockIdx[subId] ?? 0, Math.max(0, cadernoBlocks.length - 1))
                                  const block = cadernoBlocks[idx]
                                  const hasPrev = idx > 0
                                  const hasNext = idx < cadernoBlocks.length - 1
                                  return (
                                    <AnimatePresence mode="wait">
                                      <motion.div
                                        key={block.id}
                                        initial={{ opacity: 0, x: 12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -12 }}
                                        transition={{ duration: 0.22 }}
                                        className="space-y-8"
                                      >
                                        <CadernoBlock block={block} moduleId={current.id} submoduleTitle={theoryItem} />

                                        {/* Navegação */}
                                        <div className="flex items-center gap-3 pt-2">
                                          {hasPrev && (
                                            <button
                                              onClick={(e) => { e.stopPropagation(); setActiveBlockIdx((prev) => ({ ...prev, [subId]: idx - 1 })) }}
                                              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-white/36 transition hover:border-white/18 hover:text-white/60"
                                            >
                                              ← Anterior
                                            </button>
                                          )}
                                          <div className="flex-1" />
                                          <span className="text-[9px] uppercase tracking-[0.2em] text-white/18">{idx + 1} / {cadernoBlocks.length}</span>
                                          <div className="flex-1" />
                                          {hasNext ? (
                                            <button
                                              onClick={(e) => { e.stopPropagation(); setActiveBlockIdx((prev) => ({ ...prev, [subId]: idx + 1 })) }}
                                              className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-white/46 transition hover:border-white/20 hover:text-white/72"
                                            >
                                              Continuar →
                                            </button>
                                          ) : (
                                            <div className="flex items-center gap-2 rounded-full border border-white/[0.06] px-4 py-2 text-[9px] uppercase tracking-[0.22em] text-white/18">
                                              Fim do tópico
                                            </div>
                                          )}
                                        </div>

                                        {/* IA Professor — direciona estudo do bloco atual (Sumário) */}
                                        {activeSidebarTool === 'sumario' && (
                                          <div className="pt-4">
                                            <IAProfessor
                                              moduleId={current.id}
                                              submoduleTitle={theoryItem}
                                              blockTitle={extractBlockTitle(block)}
                                              blockContent={extractBlockContent(block)}
                                              studiedTopics={current.theory}
                                              currentPosition={{ blockIdx: idx, totalBlocks: cadernoBlocks.length }}
                                            />
                                          </div>
                                        )}
                                      </motion.div>
                                    </AnimatePresence>
                                  )
                                })()}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ) : (
          /* Empty state */
          <motion.div
            key="empty-module-state"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.28 }}
            className="relative overflow-hidden rounded-[2rem] px-8 py-16"
          >
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]" />
            <div className="mx-auto flex max-w-lg flex-col items-center gap-5 text-center">
              <p
                className="select-none text-[clamp(4rem,12vw,8rem)] font-semibold leading-none tracking-[-0.04em] text-white/[0.06]"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                M?
              </p>
              <div className="h-px w-12 bg-white/12" />
              <p className="text-[10px] uppercase tracking-[0.38em] text-white/28">Intelligence pronta</p>
              <h3 className="max-w-xs text-base font-medium leading-relaxed text-white/56">
                Selecione um módulo no trilho acima para abrir a página de estudo.
              </h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating selection popup — Portal para escapar de transforms do Framer Motion */}
      {selectionPopup && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          <motion.button
            key="selection-popup"
            ref={popupRef}
            initial={{ opacity: 0, scale: 0.8, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 4 }}
            transition={{ duration: 0.18 }}
            style={{ position: 'fixed', left: selectionPopup.x, top: selectionPopup.y, transform: 'translateX(-50%)', zIndex: 9999 }}
            onClick={() => handleAskTutor('', selectionPopup.text)}
            className="flex items-center gap-1.5 rounded-full border border-white/16 bg-[rgba(10,10,12,0.94)] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/82 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:bg-white/10 transition"
          >
            <Sparkles className="h-3 w-3" />
            Explicar
          </motion.button>
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  )
}
