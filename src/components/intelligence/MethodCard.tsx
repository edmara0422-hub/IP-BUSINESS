'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BLUE = '#2e86c1'
const GREEN = '#1e8449'
const RED = '#c0392b'
const AMBER = '#9a7d0a'

interface Props {
  name: string
  origin: string
  whenToUse: string[]
  whenNotToUse: string[]
  cost: 'low' | 'medium' | 'high'
  time: string
  steps: string[]
  example: string
}

/**
 * Cartão de método/framework. Ensina JULGAMENTO, não só o método.
 * Aluno vê: quando usar, quando NÃO usar, custo, tempo, etapas, exemplo.
 * O "quando NÃO usar" é o diferencial — livros não ensinam isso.
 */
export default function MethodCard({
  name, origin, whenToUse, whenNotToUse, cost, time, steps, example,
}: Props) {
  const [section, setSection] = useState<'use' | 'steps' | 'example'>('use')

  const costLabel = { low: 'Baixo', medium: 'Médio', high: 'Alto' }[cost]
  const costColor = { low: GREEN, medium: AMBER, high: RED }[cost]

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Header */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: BLUE }}>
            Método
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h3 className="text-[17px] font-semibold text-white/85" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {name}
          </h3>
          <span className="text-[10px] text-white/35">{origin}</span>
        </div>

        {/* Metadata — custo e tempo */}
        <div className="flex gap-2">
          <div className="px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider"
            style={{ background: `${costColor}15`, color: costColor, border: `1px solid ${costColor}25` }}>
            Custo: {costLabel}
          </div>
          <div className="px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider"
            style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
            Tempo: {time}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-3 flex gap-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        {([
          { key: 'use', label: 'Quando usar' },
          { key: 'steps', label: 'Etapas' },
          { key: 'example', label: 'Exemplo' },
        ] as const).map((t) => {
          const active = section === t.key
          return (
            <button key={t.key} onClick={() => setSection(t.key)}
              className="px-2.5 py-1.5 rounded-t-md text-[10px] font-medium transition-all"
              style={{
                background: active ? `${BLUE}15` : 'transparent',
                color: active ? BLUE : 'rgba(255,255,255,0.35)',
                borderBottom: active ? `2px solid ${BLUE}` : '2px solid transparent',
              }}>
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Conteúdo */}
      <AnimatePresence mode="wait">
        <motion.div key={section}
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="px-4 py-4">

          {section === 'use' && (
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: GREEN }}>
                  ✓ Funciona quando
                </p>
                <ul className="space-y-1.5">
                  {whenToUse.map((item, i) => (
                    <li key={i} className="text-[12px] text-white/60 leading-relaxed flex gap-2">
                      <span className="text-white/25">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: RED }}>
                  ✕ Não use quando
                </p>
                <ul className="space-y-1.5">
                  {whenNotToUse.map((item, i) => (
                    <li key={i} className="text-[12px] text-white/50 leading-relaxed flex gap-2">
                      <span className="text-white/25">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {section === 'steps' && (
            <ol className="space-y-2">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="text-[10px] font-bold font-mono flex items-center justify-center rounded-full flex-shrink-0 mt-0.5"
                    style={{ width: 20, height: 20, background: `${BLUE}15`, color: BLUE }}>
                    {i + 1}
                  </span>
                  <span className="text-[12px] text-white/60 leading-relaxed flex-1">{step}</span>
                </li>
              ))}
            </ol>
          )}

          {section === 'example' && (
            <div className="rounded-lg p-3" style={{ background: `${BLUE}06`, borderLeft: `3px solid ${BLUE}40` }}>
              <p className="text-[12px] text-white/60 leading-relaxed">{example}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
