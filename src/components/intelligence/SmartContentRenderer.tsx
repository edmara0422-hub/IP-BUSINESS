'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Lightbulb, HelpCircle, CheckCircle2, XCircle, BookOpen } from 'lucide-react'

const GREEN = '#1e8449'
const RED = '#c0392b'
const AMBER = '#9a7d0a'
const BLUE = '#1a5276'

/**
 * SmartContentRenderer — transforma texto corrido em blocos visuais interativos.
 *
 * Detecta padrões no texto:
 * - **Bold** → destaque visual
 * - "Pergunta-chave:" → card interativo "Pare e Pense"
 * - "Exemplo:" ou "Caso real:" → card de exemplo com borda colorida
 * - Listas com "—" ou "•" → bullets visuais
 * - Headers com "**TITULO**" no início de linha → section headers
 * - Números "1." "2." etc → steps visuais
 */

interface Props {
  title: string
  body: string
}

// Parse bold text: **text** → <strong>
function parseBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white/70 font-semibold">{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

// Classify paragraph type
type BlockType = 'text' | 'header' | 'question' | 'example' | 'list' | 'steps' | 'important' | 'tip'

function classifyParagraph(para: string): { type: BlockType; content: string } {
  const trimmed = para.trim()

  if (trimmed.startsWith('Pergunta-chave:') || trimmed.startsWith('Pergunta:')) {
    return { type: 'question', content: trimmed }
  }
  if (trimmed.startsWith('Exemplo') || trimmed.startsWith('Caso real') || trimmed.startsWith('Exemplo prático')) {
    return { type: 'example', content: trimmed }
  }
  if (trimmed.startsWith('Erro ') || trimmed.startsWith('Atenção:') || trimmed.startsWith('IMPORTANTE:') || trimmed.startsWith('Cuidado:')) {
    return { type: 'important', content: trimmed }
  }
  if (trimmed.startsWith('Dica:') || trimmed.startsWith('Na prática:') || trimmed.startsWith('Uso prático:') || trimmed.startsWith('Como aplicar')) {
    return { type: 'tip', content: trimmed }
  }
  // Check if it's a list (multiple lines starting with — or •)
  const lines = trimmed.split('\n')
  const listLines = lines.filter(l => l.trim().startsWith('—') || l.trim().startsWith('•') || l.trim().startsWith('-'))
  if (listLines.length >= 2 && listLines.length >= lines.length * 0.5) {
    return { type: 'list', content: trimmed }
  }
  // Check if it starts with a step number
  if (/^\d+[\.\)]\s/.test(trimmed.split('\n')[0])) {
    const stepLines = lines.filter(l => /^\d+[\.\)]\s/.test(l.trim()))
    if (stepLines.length >= 2) {
      return { type: 'steps', content: trimmed }
    }
  }
  // Check if it's a section header (short line, all bold)
  if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length < 120 && !trimmed.includes('\n')) {
    return { type: 'header', content: trimmed.replace(/\*\*/g, '') }
  }

  return { type: 'text', content: trimmed }
}

// Individual block renderers
function TextBlock({ content }: { content: string }) {
  return (
    <p className="text-[14px] leading-[1.85] text-white/55">
      {parseBold(content)}
    </p>
  )
}

function HeaderBlock({ content }: { content: string }) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="w-1 h-5 rounded-full bg-white/20" />
      <h4 className="text-[15px] font-bold text-white/85" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {content}
      </h4>
    </div>
  )
}

function QuestionBlock({ content }: { content: string }) {
  const [revealed, setRevealed] = useState(false)
  const question = content.replace(/^Pergunta(-chave)?:\s*/i, '')

  return (
    <motion.div
      className="rounded-xl p-4"
      style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}20` }}
    >
      <div className="flex items-start gap-3">
        <HelpCircle size={18} color={AMBER} className="shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: AMBER }}>Pare e Pense</p>
          <p className="text-[14px] text-white/65 leading-relaxed">{parseBold(question)}</p>
          {!revealed && (
            <button
              onClick={() => setRevealed(true)}
              className="mt-3 text-[12px] font-medium px-4 py-1.5 rounded-lg transition-all"
              style={{ background: `${AMBER}15`, color: AMBER, border: `1px solid ${AMBER}25` }}
            >
              Refletir sobre isso
            </button>
          )}
          {revealed && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
              <p className="text-[12px] text-white/40 italic">Reflita antes de avançar. Essa pergunta conecta o conceito à sua realidade.</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function ExampleBlock({ content }: { content: string }) {
  const [open, setOpen] = useState(false)
  const firstLine = content.split('\n')[0]
  const rest = content.split('\n').slice(1).join('\n').trim()

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid rgba(255,255,255,0.12)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
        <BookOpen size={16} className="shrink-0 text-white/35" />
        <span className="text-[13px] font-semibold text-white/60 flex-1">{parseBold(firstLine)}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown size={14} className="text-white/25" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && rest && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-4 pb-3 pl-11">
              <p className="text-[13px] text-white/45 leading-relaxed whitespace-pre-line">{parseBold(rest)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ImportantBlock({ content }: { content: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: `${RED}08`, borderLeft: `3px solid ${RED}40` }}>
      <div className="flex items-start gap-3">
        <XCircle size={16} color={RED} className="shrink-0 mt-0.5" />
        <p className="text-[13px] text-white/55 leading-relaxed">{parseBold(content)}</p>
      </div>
    </div>
  )
}

function TipBlock({ content }: { content: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '3px solid rgba(255,255,255,0.15)' }}>
      <div className="flex items-start gap-3">
        <Lightbulb size={16} className="shrink-0 mt-0.5 text-white/40" />
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-1 text-white/40">Na Prática</p>
          <p className="text-[13px] text-white/55 leading-relaxed">{parseBold(content)}</p>
        </div>
      </div>
    </div>
  )
}

function ListBlock({ content }: { content: string }) {
  const lines = content.split('\n')
  const headerLine = lines.find(l => !l.trim().startsWith('—') && !l.trim().startsWith('•') && !l.trim().startsWith('-') && l.trim().length > 0)
  const listItems = lines.filter(l => l.trim().startsWith('—') || l.trim().startsWith('•') || l.trim().startsWith('-'))

  return (
    <div>
      {headerLine && <p className="text-[14px] text-white/60 mb-2">{parseBold(headerLine)}</p>}
      <div className="flex flex-col gap-1.5 pl-1">
        {listItems.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: 'rgba(255,255,255,0.25)' }} />
            <p className="text-[13px] text-white/50 leading-relaxed">{parseBold(item.replace(/^[—•-]\s*/, ''))}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepsBlock({ content }: { content: string }) {
  const lines = content.split('\n').filter(l => l.trim())

  return (
    <div className="flex flex-col gap-2">
      {lines.map((line, i) => {
        const match = line.match(/^(\d+)[\.\)]\s*(.*)/)
        if (match) {
          return (
            <div key={i} className="flex items-start gap-3 rounded-lg px-3 py-2" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <span className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 text-[11px] font-bold bg-white/10 text-white/60">
                {match[1]}
              </span>
              <p className="text-[13px] text-white/55 leading-relaxed pt-0.5">{parseBold(match[2])}</p>
            </div>
          )
        }
        return <p key={i} className="text-[13px] text-white/50 pl-9">{parseBold(line)}</p>
      })}
    </div>
  )
}

// Mini Quiz component
function MiniQuiz({ question, options, correctIndex }: { question: string; options: string[]; correctIndex: number }) {
  const [selected, setSelected] = useState<number | null>(null)
  const answered = selected !== null

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-[11px] font-bold uppercase tracking-wider text-white/25 mb-2">Quiz Rápido</p>
      <p className="text-[14px] text-white/65 mb-3">{question}</p>
      <div className="flex flex-col gap-1.5">
        {options.map((opt, i) => {
          const isCorrect = i === correctIndex
          const isSelected = i === selected
          let bg = 'rgba(0,0,0,0.2)'
          let border = 'rgba(255,255,255,0.06)'
          let color = 'rgba(255,255,255,0.45)'

          if (answered) {
            if (isCorrect) { bg = `${GREEN}15`; border = GREEN; color = GREEN }
            else if (isSelected && !isCorrect) { bg = `${RED}15`; border = RED; color = RED }
          } else if (isSelected) {
            bg = 'rgba(255,255,255,0.06)'; border = 'rgba(255,255,255,0.15)'
          }

          return (
            <button
              key={i}
              onClick={() => !answered && setSelected(i)}
              disabled={answered}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[13px] transition-all"
              style={{ background: bg, border: `1px solid ${border}`, color }}
            >
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
          {selected === correctIndex ? 'Correto!' : `Incorreto. A resposta certa era: ${options[correctIndex]}`}
        </motion.p>
      )}
    </div>
  )
}

// Flashcard — conceito de um lado, definição do outro
function Flashcard({ front, back }: { front: string; back: string }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <motion.button
      onClick={() => setFlipped(!flipped)}
      className="w-full rounded-xl p-4 text-left transition-all"
      style={{ background: flipped ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/25">{flipped ? 'Definição' : 'Conceito'}</span>
        <span className="text-[9px] text-white/20">toque para virar</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={flipped ? 'back' : 'front'} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
          className="text-[14px] leading-relaxed" style={{ color: flipped ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.75)' }}>
          {flipped ? back : front}
        </motion.p>
      </AnimatePresence>
    </motion.button>
  )
}

// Termo clicável — expande explicação
function ExpandableTerm({ term, explanation }: { term: string; explanation: string }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="inline">
      <button onClick={() => setOpen(!open)}
        className="underline decoration-dotted decoration-white/20 underline-offset-2 text-white/70 hover:text-white/90 transition-colors cursor-help">
        {term}
      </button>
      <AnimatePresence>
        {open && (
          <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="block mt-1 mb-2 rounded-lg px-3 py-2 text-[12px] text-white/45 leading-relaxed"
            style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
            {explanation}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

// Resumo do tópico — 3 bullets do que aprendeu
function TopicSummary({ points }: { points: string[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 text-left">
        <CheckCircle2 size={16} className="text-white/30 shrink-0" />
        <span className="text-[12px] font-bold uppercase tracking-wider text-white/30 flex-1">O que você aprendeu</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }}><ChevronDown size={14} className="text-white/20" /></motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-3 flex flex-col gap-2">
              {points.map((p, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[12px] text-white/30 shrink-0 mt-0.5">✓</span>
                  <span className="text-[13px] text-white/50 leading-relaxed">{p}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Progress bar de leitura
function ReadingProgress({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex-1 h-1 rounded-full overflow-hidden bg-white/5">
        <motion.div className="h-full rounded-full bg-white/20" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
      </div>
      <span className="text-[10px] text-white/20 font-mono shrink-0">{pct}%</span>
    </div>
  )
}

// Detectar termos-chave no texto e gerar flashcards automaticamente
function extractKeyTerms(text: string): Array<{ front: string; back: string }> {
  const cards: Array<{ front: string; back: string }> = []
  // Pattern: **Term** seguido de dois pontos ou travessão e definição
  const regex = /\*\*([^*]+)\*\*\s*[:—–-]\s*([^.]+\.)/g
  let match
  while ((match = regex.exec(text)) !== null) {
    if (match[1].length < 50 && match[2].length > 20) {
      cards.push({ front: match[1], back: match[2].trim() })
    }
    if (cards.length >= 4) break
  }
  return cards
}

// Gerar resumo automático do texto
function extractSummaryPoints(text: string): string[] {
  const points: string[] = []
  const sentences = text.split(/[.!]\s/).filter(s => s.length > 30 && s.length < 150)
  // Pegar frases que contêm palavras-chave de conclusão
  const keywords = ['portanto', 'resume', 'principal', 'fundamental', 'essencial', 'chave', 'central', 'conclus', 'import']
  for (const s of sentences) {
    if (keywords.some(k => s.toLowerCase().includes(k)) && points.length < 3) {
      points.push(s.trim() + '.')
    }
  }
  // Se não encontrou, pegar as primeiras 3 frases significativas
  if (points.length < 2) {
    for (const s of sentences.slice(0, 5)) {
      if (s.includes('**') && points.length < 3) {
        points.push(s.replace(/\*\*/g, '').trim() + '.')
      }
    }
  }
  return points.slice(0, 3)
}

// Main renderer
export default function SmartContentRenderer({ title, body }: Props) {
  const paragraphs = body.split('\n\n').filter(Boolean)
  const blocks = paragraphs.map(p => classifyParagraph(p))
  const flashcards = extractKeyTerms(body)
  const summaryPoints = extractSummaryPoints(body)

  return (
    <div className="scroll-mt-6">
      {/* Progresso de leitura */}
      <ReadingProgress current={1} total={1} />

      {title && (
        <h4 className="mb-5 text-[1.05rem] font-semibold leading-snug tracking-[-0.01em] text-white/80" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {title}
        </h4>
      )}

      <div className="space-y-4">
        {blocks.map((block, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
          >
            {block.type === 'text' && <TextBlock content={block.content} />}
            {block.type === 'header' && <HeaderBlock content={block.content} />}
            {block.type === 'question' && <QuestionBlock content={block.content} />}
            {block.type === 'example' && <ExampleBlock content={block.content} />}
            {block.type === 'important' && <ImportantBlock content={block.content} />}
            {block.type === 'tip' && <TipBlock content={block.content} />}
            {block.type === 'list' && <ListBlock content={block.content} />}
            {block.type === 'steps' && <StepsBlock content={block.content} />}
          </motion.div>
        ))}

        {/* Flashcards automáticos — conceitos-chave do texto */}
        {flashcards.length > 0 && (
          <div className="mt-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/25 mb-3">Conceitos-chave — toque para virar</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {flashcards.map((card, i) => (
                <Flashcard key={i} front={card.front} back={card.back} />
              ))}
            </div>
          </div>
        )}

        {/* Resumo automático */}
        {summaryPoints.length > 0 && (
          <div className="mt-4">
            <TopicSummary points={summaryPoints} />
          </div>
        )}
      </div>
    </div>
  )
}

// Export components for use in content
export { MiniQuiz, Flashcard, ExpandableTerm, TopicSummary }
