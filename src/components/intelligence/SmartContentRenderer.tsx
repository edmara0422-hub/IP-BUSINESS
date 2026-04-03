'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Lightbulb, HelpCircle, XCircle, BookOpen, Quote, ArrowRight } from 'lucide-react'

const GREEN = '#1e8449'
const RED = '#c0392b'
const AMBER = '#9a7d0a'

interface Props {
  title: string
  body: string
}

// ── Parse bold + italic ──
function parseFormatting(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white/75 font-semibold">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('_') && part.endsWith('_')) {
      return <em key={i} className="text-white/50 italic">{part.slice(1, -1)}</em>
    }
    return <span key={i}>{part}</span>
  })
}

// ── Classify paragraph ──
type BlockType = 'text' | 'header' | 'question' | 'example' | 'list' | 'steps' | 'important' | 'tip' | 'quote' | 'comparison'

function classifyParagraph(para: string): { type: BlockType; content: string } {
  const t = para.trim()
  if (t.startsWith('Pergunta-chave:') || t.startsWith('Pergunta:')) return { type: 'question', content: t }
  if (t.startsWith('Exemplo') || t.startsWith('Caso real') || t.startsWith('Exemplo prático')) return { type: 'example', content: t }
  if (t.startsWith('Erro ') || t.startsWith('Atenção:') || t.startsWith('IMPORTANTE:') || t.startsWith('Cuidado:')) return { type: 'important', content: t }
  if (t.startsWith('Dica:') || t.startsWith('Na prática:') || t.startsWith('Uso prático:') || t.startsWith('Como aplicar')) return { type: 'tip', content: t }

  // Citação — autor com ano entre parênteses
  if (/^".*"\s*[-—]\s*.+|.*\(\d{4}\).*:/.test(t) && t.length < 300) return { type: 'quote', content: t }

  // Comparação — padrão X vs Y ou X × Y
  if (/\bvs\.?\b|\bversus\b|×/i.test(t) && t.length < 200) return { type: 'comparison', content: t }

  // Lista
  const lines = t.split('\n')
  const listLines = lines.filter(l => /^\s*[—•\-→]\s/.test(l))
  if (listLines.length >= 2 && listLines.length >= lines.length * 0.4) return { type: 'list', content: t }

  // Steps
  if (/^\d+[\.\)]\s/.test(lines[0])) {
    const stepLines = lines.filter(l => /^\d+[\.\)]\s/.test(l.trim()))
    if (stepLines.length >= 2) return { type: 'steps', content: t }
  }

  // Header
  if (t.startsWith('**') && t.endsWith('**') && t.length < 120 && !t.includes('\n')) return { type: 'header', content: t.replace(/\*\*/g, '') }

  return { type: 'text', content: t }
}

// ── TEXT — com truncamento pra textos longos ──
function TextBlock({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = content.length > 400
  const display = isLong && !expanded ? content.slice(0, 380) + '...' : content

  return (
    <div>
      <p className="text-[14px] leading-[1.85] text-white/55 text-justify">
        {parseFormatting(display)}
      </p>
      {isLong && !expanded && (
        <button onClick={() => setExpanded(true)} className="mt-1 text-[12px] text-white/30 hover:text-white/50 flex items-center gap-1 transition-colors">
          Ler mais <ArrowRight size={12} />
        </button>
      )}
    </div>
  )
}

// ── HEADER ──
function HeaderBlock({ content }: { content: string }) {
  return (
    <div className="flex items-center gap-2 mt-3 mb-1">
      <div className="w-1 h-5 rounded-full bg-white/20" />
      <h4 className="text-[15px] font-bold text-white/85" style={{ fontFamily: 'Poppins, sans-serif' }}>{content}</h4>
    </div>
  )
}

// ── QUESTION — Pare e Pense ──
function QuestionBlock({ content }: { content: string }) {
  const [revealed, setRevealed] = useState(false)
  const question = content.replace(/^Pergunta(-chave)?:\s*/i, '')
  return (
    <motion.div className="rounded-xl p-4" style={{ background: `${AMBER}08`, border: `1px solid ${AMBER}18` }}>
      <div className="flex items-start gap-3">
        <HelpCircle size={18} color={AMBER} className="shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: AMBER }}>Pare e Pense</p>
          <p className="text-[14px] text-white/60 leading-relaxed text-justify">{parseFormatting(question)}</p>
          {!revealed ? (
            <button onClick={() => setRevealed(true)}
              className="mt-3 text-[12px] font-medium px-4 py-1.5 rounded-lg transition-all"
              style={{ background: `${AMBER}12`, color: AMBER, border: `1px solid ${AMBER}22` }}>
              Refletir sobre isso
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-lg px-3 py-2" style={{ background: 'rgba(0,0,0,0.15)' }}>
              <p className="text-[12px] text-white/35 italic">Reflita antes de avançar. Anote sua resposta e compare com o que vem a seguir.</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── EXAMPLE — expandível ──
function ExampleBlock({ content }: { content: string }) {
  const [open, setOpen] = useState(false)
  const firstLine = content.split('\n')[0]
  const rest = content.split('\n').slice(1).join('\n').trim()
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid rgba(255,255,255,0.12)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
        <BookOpen size={16} className="shrink-0 text-white/35" />
        <span className="text-[13px] font-semibold text-white/60 flex-1">{parseFormatting(firstLine)}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }}><ChevronDown size={14} className="text-white/20" /></motion.div>
      </button>
      <AnimatePresence>
        {open && rest && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-4 pb-3 pl-11">
              <p className="text-[13px] text-white/45 leading-relaxed whitespace-pre-line text-justify">{parseFormatting(rest)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── IMPORTANT ──
function ImportantBlock({ content }: { content: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: `${RED}06`, borderLeft: `3px solid ${RED}35` }}>
      <div className="flex items-start gap-3">
        <XCircle size={16} color={RED} className="shrink-0 mt-0.5" />
        <p className="text-[13px] text-white/55 leading-relaxed text-justify">{parseFormatting(content)}</p>
      </div>
    </div>
  )
}

// ── TIP ──
function TipBlock({ content }: { content: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid rgba(255,255,255,0.12)' }}>
      <div className="flex items-start gap-3">
        <Lightbulb size={16} className="shrink-0 mt-0.5 text-white/40" />
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-1 text-white/35">Na Prática</p>
          <p className="text-[13px] text-white/55 leading-relaxed text-justify">{parseFormatting(content)}</p>
        </div>
      </div>
    </div>
  )
}

// ── QUOTE — citação com autor ──
function QuoteBlock({ content }: { content: string }) {
  return (
    <div className="rounded-xl p-4 my-1" style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-start gap-3">
        <Quote size={14} className="shrink-0 mt-1 text-white/20" />
        <p className="text-[13px] text-white/50 leading-relaxed italic text-justify">{parseFormatting(content)}</p>
      </div>
    </div>
  )
}

// ── COMPARISON — vs/versus ──
function ComparisonBlock({ content }: { content: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-[13px] text-white/60 leading-relaxed text-center font-medium">{parseFormatting(content)}</p>
    </div>
  )
}

// ── LIST ──
function ListBlock({ content }: { content: string }) {
  const lines = content.split('\n')
  const headerLine = lines.find(l => !/^\s*[—•\-→]\s/.test(l) && l.trim().length > 0)
  const listItems = lines.filter(l => /^\s*[—•\-→]\s/.test(l))
  return (
    <div>
      {headerLine && <p className="text-[14px] text-white/60 mb-2 text-justify">{parseFormatting(headerLine)}</p>}
      <div className="flex flex-col gap-1.5 pl-1">
        {listItems.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-white/20" />
            <p className="text-[13px] text-white/50 leading-relaxed text-justify">{parseFormatting(item.replace(/^\s*[—•\-→]\s*/, ''))}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── STEPS ──
function StepsBlock({ content }: { content: string }) {
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const lines = content.split('\n').filter(l => l.trim())

  return (
    <div className="flex flex-col gap-1.5">
      {lines.map((line, i) => {
        const match = line.match(/^(\d+)[\.\)]\s*(.*)/)
        if (match) {
          const isActive = activeStep === i
          return (
            <motion.button key={i} onClick={() => setActiveStep(isActive ? null : i)}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-all"
              style={{ background: isActive ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.15)' }}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <span className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 text-[11px] font-bold bg-white/10 text-white/60">
                {match[1]}
              </span>
              <p className={`text-[13px] leading-relaxed pt-0.5 text-justify ${isActive ? 'text-white/65' : 'text-white/45'}`}>
                {parseFormatting(match[2])}
              </p>
            </motion.button>
          )
        }
        return <p key={i} className="text-[13px] text-white/40 pl-9 text-justify">{parseFormatting(line)}</p>
      })}
    </div>
  )
}

// ── MINI QUIZ ──
function MiniQuiz({ question, options, correctIndex }: { question: string; options: string[]; correctIndex: number }) {
  const [selected, setSelected] = useState<number | null>(null)
  const answered = selected !== null
  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-[11px] font-bold uppercase tracking-wider text-white/25 mb-2">Quiz Rápido</p>
      <p className="text-[14px] text-white/65 mb-3">{question}</p>
      <div className="flex flex-col gap-1.5">
        {options.map((opt, i) => {
          const isCorrect = i === correctIndex
          const isSelected = i === selected
          let bg = 'rgba(0,0,0,0.15)'
          let border = 'rgba(255,255,255,0.06)'
          let color = 'rgba(255,255,255,0.45)'
          if (answered) {
            if (isCorrect) { bg = `${GREEN}12`; border = GREEN; color = GREEN }
            else if (isSelected) { bg = `${RED}12`; border = RED; color = RED }
          }
          return (
            <button key={i} onClick={() => !answered && setSelected(i)} disabled={answered}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[13px] transition-all"
              style={{ background: bg, border: `1px solid ${border}`, color }}>
              {answered && isCorrect && <CheckCircle2 size={14} />}
              {answered && isSelected && !isCorrect && <XCircle size={14} />}
              {!answered && <span className="w-4 h-4 rounded-full border border-white/15 shrink-0" />}
              {opt}
            </button>
          )
        })}
      </div>
      {answered && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-[12px]"
          style={{ color: selected === correctIndex ? GREEN : RED }}>
          {selected === correctIndex ? 'Correto!' : `A resposta certa era: ${options[correctIndex]}`}
        </motion.p>
      )}
    </div>
  )
}


// ── READING PROGRESS ──
function ReadingProgress({ total }: { total: number }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex-1 h-[2px] rounded-full overflow-hidden bg-white/5">
        <motion.div className="h-full rounded-full bg-white/15" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2, ease: 'easeOut' }} />
      </div>
      <span className="text-[10px] text-white/15 font-mono shrink-0">{total} blocos</span>
    </div>
  )
}

// ── SECTION DIVIDER ──
function SectionDivider() {
  return <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />
}

// ══════════════════════════════════════════════════════════════
// ██  GROUP BLOCKS INTO MICRO-LESSONS (SLIDES)
// ══════════════════════════════════════════════════════════════

interface Slide {
  blocks: Array<{ type: BlockType | 'divider'; content: string }>
  label: string
}

function groupIntoSlides(blocks: Array<{ type: BlockType; content: string }>): Slide[] {
  // Só divide em slides se o conteúdo for muito longo (10+ blocos)
  if (blocks.length <= 10) {
    return [{ blocks, label: 'Conteúdo' }]
  }

  const slides: Slide[] = []
  let current: Slide = { blocks: [], label: '' }
  let slideNum = 1

  for (const block of blocks) {
    // Start new slide on headers — mas só se o slide atual já tem bastante conteúdo
    if (block.type === 'header' && current.blocks.length >= 6) {
      if (!current.label) current.label = `Parte ${slideNum}`
      slides.push(current)
      slideNum++
      current = { blocks: [block], label: block.content }
      continue
    }

    current.blocks.push(block)

    // Split if slide gets very long (>10 blocks)
    if (current.blocks.length >= 10 && block.type === 'text') {
      if (!current.label) current.label = `Parte ${slideNum}`
      slides.push(current)
      slideNum++
      current = { blocks: [], label: '' }
    }
  }

  if (current.blocks.length > 0) {
    if (!current.label) current.label = `Parte ${slideNum}`
    slides.push(current)
  }

  return slides
}

// ══════════════════════════════════════════════════════════════
// ██  MAIN RENDERER
// ══════════════════════════════════════════════════════════════

export default function SmartContentRenderer({ title, body }: Props) {
  const paragraphs = body.split('\n\n').filter(Boolean)
  const blocks = useMemo(() => paragraphs.map(p => classifyParagraph(p)), [body])
  const slides = useMemo(() => groupIntoSlides(blocks), [blocks])

  const [currentSlide, setCurrentSlide] = useState(0)
  const isMultiSlide = slides.length > 1
  const slide = slides[currentSlide] ?? slides[0]

  const goNext = () => setCurrentSlide(c => Math.min(c + 1, slides.length - 1))
  const goPrev = () => setCurrentSlide(c => Math.max(c - 1, 0))
  const isLast = currentSlide >= slides.length - 1
  const isFirst = currentSlide === 0

  // Add dividers between headers within a slide
  const withDividers: Array<{ type: BlockType | 'divider'; content: string }> = []
  let lastWasHeader = false
  for (const block of slide.blocks) {
    if (block.type === 'header' && !lastWasHeader && withDividers.length > 0) {
      withDividers.push({ type: 'divider', content: '' })
    }
    withDividers.push(block)
    lastWasHeader = block.type === 'header'
  }

  return (
    <div className="scroll-mt-6">
      {/* Progress */}
      {isMultiSlide && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 flex gap-1">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)}
                className="flex-1 h-1 rounded-full transition-all"
                style={{ background: i <= currentSlide ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.06)' }} />
            ))}
          </div>
          <span className="text-[10px] text-white/20 font-mono shrink-0">{currentSlide + 1}/{slides.length}</span>
        </div>
      )}

      {!isMultiSlide && <ReadingProgress total={blocks.length} />}

      {title && isFirst && (
        <h4 className="mb-5 text-[1.05rem] font-semibold leading-snug tracking-[-0.01em] text-white/80" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {title}
        </h4>
      )}

      {/* Slide label */}
      {isMultiSlide && !isFirst && slide.label && (
        <p className="text-[11px] font-bold uppercase tracking-wider text-white/20 mb-3">{slide.label}</p>
      )}

      {/* Slide content */}
      <AnimatePresence mode="wait">
        <motion.div key={currentSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}>
          <div className="space-y-4">
            {withDividers.map((block, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3), duration: 0.3 }}>
                {block.type === 'divider' && <SectionDivider />}
                {block.type === 'text' && <TextBlock content={block.content} />}
                {block.type === 'header' && <HeaderBlock content={block.content} />}
                {block.type === 'question' && <QuestionBlock content={block.content} />}
                {block.type === 'example' && <ExampleBlock content={block.content} />}
                {block.type === 'important' && <ImportantBlock content={block.content} />}
                {block.type === 'tip' && <TipBlock content={block.content} />}
                {block.type === 'list' && <ListBlock content={block.content} />}
                {block.type === 'steps' && <StepsBlock content={block.content} />}
                {block.type === 'quote' && <QuoteBlock content={block.content} />}
                {block.type === 'comparison' && <ComparisonBlock content={block.content} />}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {isMultiSlide && (
        <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <button onClick={goPrev} disabled={isFirst}
            className="text-[12px] font-medium px-4 py-2 rounded-lg transition-all disabled:opacity-20"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
            ← Anterior
          </button>
          <span className="text-[11px] text-white/15 font-mono">{currentSlide + 1} de {slides.length}</span>
          {isLast ? (
            <span className="text-[12px] font-medium px-4 py-2 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.3)' }}>
              Fim ✓
            </span>
          ) : (
            <button onClick={goNext}
              className="text-[12px] font-medium px-4 py-2 rounded-lg transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
              Próximo →
            </button>
          )}
        </div>
      )}

    </div>
  )
}

export { MiniQuiz }
