'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GREEN = '#1e8449'
const RED = '#c0392b'
const AMBER = '#9a7d0a'

interface Option {
  label: string
  tradeoffs: { upside: string; downside: string; risk: 'low' | 'medium' | 'high' }
}

interface Props {
  scenario: string
  options: Option[]
  realWorldAnalog?: string
  lesson?: string
}

export default function DecisionSimulator({ scenario, options, realWorldAnalog, lesson }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const riskColor = { low: GREEN, medium: AMBER, high: RED }

  return (
    <motion.div className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>

      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: AMBER }}>Decisão</span>
        </div>
        <p className="text-[14px] text-white/60 leading-relaxed">{scenario}</p>
        {realWorldAnalog && (
          <p className="text-[11px] text-white/25 mt-1 italic">{realWorldAnalog}</p>
        )}
      </div>

      <div className="px-4 pb-4 space-y-2">
        {options.map((opt, i) => {
          const isSelected = selected === i
          const risk = riskColor[opt.tradeoffs.risk]
          return (
            <button key={i} onClick={() => !revealed && setSelected(i)}
              disabled={revealed}
              className="w-full text-left rounded-lg px-3 py-3 transition-all"
              style={{
                background: isSelected ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.15)',
                border: `1px solid ${isSelected ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)'}`,
              }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] text-white/65 font-medium">{opt.label}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: `${risk}15`, color: risk }}>
                  {opt.tradeoffs.risk === 'low' ? 'Baixo risco' : opt.tradeoffs.risk === 'medium' ? 'Risco médio' : 'Alto risco'}
                </span>
              </div>
              <AnimatePresence>
                {isSelected && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden">
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="rounded p-2" style={{ background: `${GREEN}06` }}>
                        <p className="text-[9px] uppercase tracking-wider text-white/20 mb-0.5">Upside</p>
                        <p className="text-[11px] text-white/40 leading-relaxed">{opt.tradeoffs.upside}</p>
                      </div>
                      <div className="rounded p-2" style={{ background: `${RED}04` }}>
                        <p className="text-[9px] uppercase tracking-wider text-white/20 mb-0.5">Downside</p>
                        <p className="text-[11px] text-white/40 leading-relaxed">{opt.tradeoffs.downside}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          )
        })}

        {selected !== null && !revealed && (
          <button onClick={() => setRevealed(true)}
            className="w-full text-[12px] font-medium py-2.5 rounded-lg mt-2"
            style={{ background: `${AMBER}12`, color: AMBER, border: `1px solid ${AMBER}22` }}>
            Confirmar decisão →
          </button>
        )}

        {revealed && lesson && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-lg p-3 mt-2" style={{ background: `${GREEN}06`, borderLeft: `3px solid ${GREEN}25` }}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/20 mb-1">A lição</p>
            <p className="text-[12px] leading-relaxed" style={{ color: `${GREEN}cc` }}>{lesson}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
