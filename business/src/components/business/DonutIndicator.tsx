'use client'

import { useEffect, useState } from 'react'
import { useSpring, useTransform, motion } from 'framer-motion'

interface DonutIndicatorProps {
  value: number
  delta: number
  label: string
  prefix?: string
  suffix?: string
  decimals?: number
}

export default function DonutIndicator({ value, delta, label, prefix = '', suffix = '', decimals = 1 }: DonutIndicatorProps) {
  const spring = useSpring(value, { stiffness: 60, damping: 18 })
  const display = useTransform(spring, (v: number) => `${prefix}${v.toFixed(decimals)}${suffix}`)
  const [text, setText] = useState(`${prefix}${value.toFixed(decimals)}${suffix}`)

  useEffect(() => { spring.set(value) }, [value, spring])
  useEffect(() => { const u = display.on('change', (val: string) => setText(val)); return u }, [display])

  const circumference = 2 * Math.PI * 32
  const absDelta = Math.min(Math.abs(delta), 10)
  const fillPercent = 0.3 + (absDelta / 10) * 0.7 // 30% to 100% fill based on delta magnitude

  const strokeColor = delta > 0
    ? 'rgba(46,204,113,0.6)'   // verde
    : delta < 0
      ? 'rgba(192,57,43,0.6)' // vermelho
      : 'rgba(192,192,192,0.5)' // prata

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
          {/* Background */}
          <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          {/* Value ring */}
          <motion.circle cx="40" cy="40" r="32" fill="none" stroke={strokeColor} strokeWidth="5" strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${circumference * fillPercent} ${circumference * (1 - fillPercent)}` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-xs font-bold text-white/80">{text}</span>
          {delta !== 0 && (
            <span className={`font-mono text-[9px] ${delta > 0 ? 'text-white/45' : 'text-white/30'}`}>
              {delta > 0 ? '▲' : '▼'}{Math.abs(delta).toFixed(1)}%
            </span>
          )}
        </div>
      </div>
      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/25">{label}</span>
    </div>
  )
}
