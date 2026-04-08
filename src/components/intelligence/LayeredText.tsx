'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { InlineRef } from '@/types/intelligence'

const BLUE = '#2e86c1'
const AMBER = '#9a7d0a'

type Layer = 'essence' | 'development' | 'depth' | 'mastery'

interface Props {
  title: string
  essence: string
  development: string
  depth: string
  mastery?: string
  refs?: InlineRef[]
}

/**
 * Texto em 4 camadas de profundidade. Aluno escolhe quanto quer aprofundar.
 * Camada 1 (essência) = 50 palavras. Camada 4 (dominar) = referências externas.
 * Texto renderizado com suporte a refs inline no formato {{refId}}.
 */
export default function LayeredText({ title, essence, development, depth, mastery, refs = [] }: Props) {
  const [layer, setLayer] = useState<Layer>('essence')
  const [openRef, setOpenRef] = useState<InlineRef | null>(null)

  const layers: Array<{ key: Layer; label: string; hint: string; content: string }> = [
    { key: 'essence', label: 'Essência', hint: '30s', content: essence },
    { key: 'development', label: 'Desenvolver', hint: '2min', content: development },
    { key: 'depth', label: 'Profundidade', hint: '8min', content: depth },
  ]
  if (mastery) layers.push({ key: 'mastery', label: 'Dominar', hint: '20min+', content: mastery })

  const active = layers.find((l) => l.key === layer)!

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Header com título e seletor de camadas */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: BLUE }}>
            Estudo em camadas
          </span>
        </div>
        <h3 className="text-[15px] font-semibold text-white/80 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {title}
        </h3>

        {/* Seletor de profundidade */}
        <div className="flex flex-wrap gap-1.5">
          {layers.map((l) => {
            const isActive = l.key === layer
            return (
              <button key={l.key} onClick={() => setLayer(l.key)}
                className="px-2.5 py-1 rounded-md text-[10px] font-medium transition-all flex items-center gap-1.5"
                style={{
                  background: isActive ? `${BLUE}18` : 'rgba(255,255,255,0.03)',
                  color: isActive ? BLUE : 'rgba(255,255,255,0.35)',
                  border: `1px solid ${isActive ? `${BLUE}30` : 'rgba(255,255,255,0.05)'}`,
                }}>
                <span>{l.label}</span>
                <span className="opacity-50 text-[9px]">{l.hint}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Conteúdo da camada ativa */}
      <AnimatePresence mode="wait">
        <motion.div key={layer}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="px-4 py-4">
          <TextWithRefs text={active.content} refs={refs} onRefClick={setOpenRef} />
        </motion.div>
      </AnimatePresence>

      {/* Painel lateral de referência (quando aluno clica numa pílula) */}
      <AnimatePresence>
        {openRef && <RefPanel refItem={openRef} onClose={() => setOpenRef(null)} />}
      </AnimatePresence>
    </motion.div>
  )
}

/**
 * Renderiza texto com suporte a {{refId}} como pílulas clicáveis
 * e **bold** / _italic_ básicos.
 */
function TextWithRefs({ text, refs, onRefClick }: { text: string; refs: InlineRef[]; onRefClick: (r: InlineRef) => void }) {
  const refMap = new Map(refs.map((r) => [r.id, r]))
  const paragraphs = text.split('\n\n').filter((p) => p.trim())

  return (
    <div className="space-y-3">
      {paragraphs.map((para, idx) => (
        <p key={idx} className="text-[13px] text-white/55 leading-relaxed">
          {renderParagraph(para, refMap, onRefClick)}
        </p>
      ))}
    </div>
  )
}

function renderParagraph(para: string, refMap: Map<string, InlineRef>, onRefClick: (r: InlineRef) => void) {
  // tokenizar por {{id}} e **bold** e _italic_
  const parts: Array<string | { kind: 'ref' | 'bold' | 'italic'; value: string }> = []
  const regex = /(\{\{[^}]+\}\}|\*\*[^*]+\*\*|_[^_]+_)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = regex.exec(para)) !== null) {
    if (m.index > last) parts.push(para.slice(last, m.index))
    const token = m[0]
    if (token.startsWith('{{')) parts.push({ kind: 'ref', value: token.slice(2, -2) })
    else if (token.startsWith('**')) parts.push({ kind: 'bold', value: token.slice(2, -2) })
    else if (token.startsWith('_')) parts.push({ kind: 'italic', value: token.slice(1, -1) })
    last = m.index + token.length
  }
  if (last < para.length) parts.push(para.slice(last))

  return parts.map((part, i) => {
    if (typeof part === 'string') return <span key={i}>{part}</span>
    if (part.kind === 'ref') {
      const ref = refMap.get(part.value)
      if (!ref) return <span key={i}>{part.value}</span>
      return (
        <button key={i} onClick={() => onRefClick(ref)}
          className="inline-flex items-center px-1.5 py-0 rounded-md text-[12px] font-medium align-baseline transition-all mx-0.5"
          style={{
            background: `${BLUE}12`,
            color: BLUE,
            border: `1px solid ${BLUE}25`,
            lineHeight: '1.4',
          }}>
          {ref.label}
        </button>
      )
    }
    if (part.kind === 'bold') return <strong key={i} className="font-semibold text-white/70">{part.value}</strong>
    if (part.kind === 'italic') return <em key={i} className="italic text-white/65">{part.value}</em>
    return null
  })
}

/**
 * Painel lateral com ficha da referência (autor, estudo, case, livro).
 */
function RefPanel({ refItem, onClose }: { refItem: InlineRef; onClose: () => void }) {
  const kindLabel: Record<InlineRef['kind'], string> = {
    author: 'Pesquisador',
    study: 'Estudo',
    case: 'Case',
    book: 'Livro',
    framework: 'Framework',
  }

  return (
    <>
      <motion.div className="fixed inset-0 z-40"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onClose} />
      <motion.div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto"
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{ background: '#0a0a0a', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>

        <div className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: AMBER }}>
            {kindLabel[refItem.kind]}
          </span>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 text-sm">✕</button>
        </div>

        <div className="px-5 py-5 space-y-4">
          <div>
            <h4 className="text-[17px] font-semibold text-white/85 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {refItem.label}
            </h4>
            {(refItem.year || refItem.affiliation) && (
              <p className="text-[11px] text-white/35">
                {[refItem.affiliation, refItem.year].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>

          <p className="text-[13px] text-white/60 leading-relaxed">{refItem.summary}</p>

          {refItem.details && (
            <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-[12px] text-white/50 leading-relaxed">{refItem.details}</p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}
