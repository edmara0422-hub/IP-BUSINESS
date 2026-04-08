'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BLUE = '#2e86c1'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'

interface Props {
  title: string
  question?: string
  dimensions: string[]
  items: Array<{
    id: string
    label: string
    values: string[]
    highlight?: string
  }>
  insight?: string
}

/**
 * Comparação lado a lado. Aluno vê padrão emergir entre itens (cases, frameworks, métodos).
 * Células expandem ao hover; insight final só aparece depois de explorar.
 */
export default function CompareTable({ title, question, dimensions, items, insight }: Props) {
  const [focused, setFocused] = useState<string | null>(null)
  const [insightOpen, setInsightOpen] = useState(false)

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>

      <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: AMBER }}>
            Compare
          </span>
        </div>
        <h3 className="text-[15px] font-semibold text-white/80 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {title}
        </h3>
        {question && <p className="text-[12px] text-white/40 italic">{question}</p>}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr>
              <th className="px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-white/25"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                Dimensão
              </th>
              {items.map((item) => (
                <th key={item.id}
                  onMouseEnter={() => setFocused(item.id)}
                  onMouseLeave={() => setFocused(null)}
                  className="px-3 py-2 text-[11px] font-semibold cursor-default transition-all"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    color: focused === item.id ? BLUE : 'rgba(255,255,255,0.7)',
                    background: focused === item.id ? `${BLUE}08` : 'transparent',
                  }}>
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dimensions.map((dim, rowIdx) => (
              <tr key={rowIdx}>
                <td className="px-3 py-2.5 text-[10px] font-medium text-white/35"
                  style={{
                    borderBottom: rowIdx < dimensions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    background: 'rgba(255,255,255,0.02)',
                  }}>
                  {dim}
                </td>
                {items.map((item) => (
                  <td key={item.id}
                    onMouseEnter={() => setFocused(item.id)}
                    onMouseLeave={() => setFocused(null)}
                    className="px-3 py-2.5 text-[12px] transition-all"
                    style={{
                      borderBottom: rowIdx < dimensions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      color: focused === item.id ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
                      background: focused === item.id ? `${BLUE}06` : 'transparent',
                    }}>
                    {item.values[rowIdx] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Highlights por item */}
      {items.some((i) => i.highlight) && (
        <div className="px-4 py-3 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {items.filter((i) => i.highlight).map((item) => (
            <div key={item.id} className="flex items-start gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5" style={{ color: BLUE, minWidth: 70 }}>
                {item.label}
              </span>
              <p className="text-[11px] text-white/50 leading-relaxed flex-1">{item.highlight}</p>
            </div>
          ))}
        </div>
      )}

      {/* Insight final — trava por trás de botão para forçar reflexão */}
      {insight && (
        <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {!insightOpen ? (
            <button onClick={() => setInsightOpen(true)}
              className="text-[11px] font-medium px-3 py-2 rounded-lg w-full transition-all"
              style={{ background: `${GREEN}08`, color: GREEN, border: `1px solid ${GREEN}20` }}>
              Ver o padrão que emerge →
            </button>
          ) : (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-lg p-3"
                style={{ background: `${GREEN}06`, borderLeft: `3px solid ${GREEN}40` }}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: GREEN }}>
                  Padrão
                </p>
                <p className="text-[12px] text-white/60 leading-relaxed">{insight}</p>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}
    </motion.div>
  )
}
