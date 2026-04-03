'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

const GREEN = '#1e8449'
const RED = '#c0392b'
const AMBER = '#9a7d0a'

interface InputDef {
  id: string
  label: string
  defaultValue: number
  unit: string
  min?: number
  max?: number
}

interface Interpretation {
  max: number
  label: string
  color: 'green' | 'amber' | 'red'
}

interface Props {
  title: string
  scenario: string
  inputs: InputDef[]
  formula: string
  resultLabel: string
  interpretation: Interpretation[]
}

export default function NumberCruncher({ title, scenario, inputs, formula, resultLabel, interpretation }: Props) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(inputs.map(i => [i.id, i.defaultValue]))
  )

  const result = useMemo(() => {
    try {
      const fn = new Function(...inputs.map(i => i.id), `return ${formula}`)
      return fn(...inputs.map(i => values[i.id] ?? i.defaultValue))
    } catch {
      return 0
    }
  }, [values, formula, inputs])

  const interp = interpretation.find(i => result <= i.max) ?? interpretation[interpretation.length - 1]
  const colorMap = { green: GREEN, amber: AMBER, red: RED }
  const color = colorMap[interp?.color ?? 'amber']

  const fmt = (n: number) => {
    if (Math.abs(n) >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}K`
    return n.toFixed(n % 1 === 0 ? 0 : 2)
  }

  return (
    <motion.div className="rounded-xl p-4"
      style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${color}12` }}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>

      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color }}>Calculadora</span>
      </div>
      <p className="text-[14px] font-semibold text-white/70 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{title}</p>
      <p className="text-[12px] text-white/35 leading-relaxed mb-4">{scenario}</p>

      {/* Inputs */}
      <div className="space-y-3 mb-4">
        {inputs.map(input => (
          <div key={input.id}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] text-white/40">{input.label}</label>
              <span className="text-[12px] font-mono text-white/50">{fmt(values[input.id])} {input.unit}</span>
            </div>
            <input type="range"
              min={input.min ?? 0}
              max={input.max ?? input.defaultValue * 3}
              value={values[input.id]}
              onChange={(e) => setValues(prev => ({ ...prev, [input.id]: Number(e.target.value) }))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, ${color} 0%, ${color} ${((values[input.id] - (input.min ?? 0)) / ((input.max ?? input.defaultValue * 3) - (input.min ?? 0))) * 100}%, rgba(255,255,255,0.06) ${((values[input.id] - (input.min ?? 0)) / ((input.max ?? input.defaultValue * 3) - (input.min ?? 0))) * 100}%, rgba(255,255,255,0.06) 100%)` }}
            />
          </div>
        ))}
      </div>

      {/* Result */}
      <div className="rounded-lg p-4 text-center" style={{ background: `${color}08`, border: `1px solid ${color}15` }}>
        <p className="text-[10px] text-white/25 uppercase tracking-wider mb-1">{resultLabel}</p>
        <p className="text-[28px] font-bold font-mono" style={{ color }}>{fmt(result)}</p>
        <p className="text-[12px] mt-1" style={{ color: `${color}aa` }}>{interp?.label}</p>
      </div>
    </motion.div>
  )
}
