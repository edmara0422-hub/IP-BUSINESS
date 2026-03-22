'use client'

import { useEffect, useState } from 'react'
import { useSpring, useTransform, motion } from 'framer-motion'

interface GaugeCircularProps {
  value: number
  min: number
  max: number
  label: string
  suffix?: string
  decimals?: number
  thresholds?: { warn: number; danger: number }
}

export default function GaugeCircular({ value, min, max, label, suffix = '', decimals = 1, thresholds }: GaugeCircularProps) {
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)))
  const arcLength = 251.2 // 2 * PI * 40
  const dashOffset = arcLength * (1 - normalized * 0.75) // 270 degree arc

  const spring = useSpring(value, { stiffness: 60, damping: 18 })
  const display = useTransform(spring, (v: number) => `${v.toFixed(decimals)}${suffix}`)
  const [text, setText] = useState(`${value.toFixed(decimals)}${suffix}`)

  useEffect(() => { spring.set(value) }, [value, spring])
  useEffect(() => { const u = display.on('change', (val: string) => setText(val)); return u }, [display])

  let strokeColor = 'rgba(192,192,192,0.6)' // prata
  if (thresholds) {
    if (value >= thresholds.danger) strokeColor = 'rgba(192,57,43,0.8)' // vermelho
    else if (value >= thresholds.warn) strokeColor = 'rgba(243,156,18,0.7)' // ambar
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-[135deg]">
          {/* Background arc */}
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)"
            strokeWidth="6" strokeDasharray={`${arcLength * 0.75} ${arcLength * 0.25}`} strokeLinecap="round" />
          {/* Value arc */}
          <motion.circle cx="50" cy="50" r="40" fill="none" stroke={strokeColor}
            strokeWidth="6" strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${arcLength}` }}
            animate={{ strokeDasharray: `${arcLength * 0.75 * normalized} ${arcLength - arcLength * 0.75 * normalized}` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-base font-bold text-white/85">{text}</span>
        </div>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">{label}</span>
    </div>
  )
}
