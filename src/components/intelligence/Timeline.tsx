'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BLUE = '#2e86c1'
const AMBER = '#9a7d0a'

interface Event {
  year: number
  title: string
  description: string
  authorRef?: string
  milestone?: boolean
}

interface Props {
  title: string
  events: Event[]
}

/**
 * Linha do tempo navegável. Aluno vê EVOLUÇÃO de um conceito/campo.
 * Marcos (milestones) destacados. Clica no ano para expandir descrição.
 */
export default function Timeline({ title, events }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null)
  const sorted = [...events].sort((a, b) => a.year - b.year)

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>

      <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: BLUE }}>
            Linha do tempo
          </span>
        </div>
        <h3 className="text-[15px] font-semibold text-white/80" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {title}
        </h3>
      </div>

      <div className="px-4 py-4">
        <div className="relative">
          {/* Linha vertical */}
          <div className="absolute left-[18px] top-1 bottom-1 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

          <div className="space-y-1">
            {sorted.map((ev, idx) => {
              const isOpen = expanded === idx
              const isMilestone = ev.milestone
              return (
                <div key={idx} className="relative">
                  <button onClick={() => setExpanded(isOpen ? null : idx)}
                    className="w-full flex items-start gap-3 py-2 text-left transition-all">
                    {/* Bolinha */}
                    <div className="relative z-10 flex items-center justify-center"
                      style={{ width: 36, height: 20 }}>
                      <div className="rounded-full transition-all"
                        style={{
                          width: isMilestone ? 10 : 6,
                          height: isMilestone ? 10 : 6,
                          background: isMilestone ? AMBER : BLUE,
                          boxShadow: isMilestone ? `0 0 0 3px ${AMBER}20` : `0 0 0 2px ${BLUE}15`,
                        }} />
                    </div>
                    {/* Ano e título */}
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[11px] font-mono font-bold"
                          style={{ color: isMilestone ? AMBER : 'rgba(255,255,255,0.55)' }}>
                          {ev.year}
                        </span>
                        <span className="text-[13px] text-white/70 leading-snug">{ev.title}</span>
                      </div>
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden">
                        <div className="pl-[48px] pr-2 pb-3">
                          <p className="text-[12px] text-white/50 leading-relaxed">{ev.description}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
