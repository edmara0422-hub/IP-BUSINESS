'use client'

import { motion } from 'framer-motion'

interface PulsoDoMercadoProps {
  score: number // 0-100
  macroHealth: number // 0-100
  setorHealth: number // 0-100
  opportunityHealth: number // 0-100
}

export default function PulsoDoMercado({ score, macroHealth, setorHealth, opportunityHealth }: PulsoDoMercadoProps) {
  const scoreColor = score >= 70
    ? 'rgba(46,204,113,0.7)'
    : score >= 40
      ? 'rgba(243,156,18,0.7)'
      : 'rgba(192,57,43,0.7)'

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="relative h-48 w-48"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 200 200" className="h-full w-full">
          {/* Outer ring — Macro */}
          <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
          <motion.circle cx="100" cy="100" r="90" fill="none" stroke="rgba(192,192,192,0.2)" strokeWidth="3"
            strokeDasharray={`${565 * (macroHealth / 100)} ${565 * (1 - macroHealth / 100)}`}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 565` }}
            animate={{ strokeDasharray: `${565 * (macroHealth / 100)} ${565 * (1 - macroHealth / 100)}` }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />

          {/* Middle ring — Setores */}
          <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
          <motion.circle cx="100" cy="100" r="70" fill="none" stroke="rgba(192,192,192,0.3)" strokeWidth="3"
            strokeDasharray={`${440 * (setorHealth / 100)} ${440 * (1 - setorHealth / 100)}`}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 440` }}
            animate={{ strokeDasharray: `${440 * (setorHealth / 100)} ${440 * (1 - setorHealth / 100)}` }}
            transition={{ duration: 2, delay: 0.3, ease: 'easeOut' }}
          />

          {/* Inner ring — Oportunidades */}
          <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
          <motion.circle cx="100" cy="100" r="50" fill="none" stroke="rgba(192,192,192,0.4)" strokeWidth="3"
            strokeDasharray={`${314 * (opportunityHealth / 100)} ${314 * (1 - opportunityHealth / 100)}`}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 314` }}
            animate={{ strokeDasharray: `${314 * (opportunityHealth / 100)} ${314 * (1 - opportunityHealth / 100)}` }}
            transition={{ duration: 2, delay: 0.6, ease: 'easeOut' }}
          />
        </svg>
      </motion.div>

      {/* Center — Score (does NOT rotate) */}
      <div className="absolute flex flex-col items-center">
        <motion.div
          className="h-3 w-3 rounded-full"
          style={{ background: scoreColor, boxShadow: `0 0 12px ${scoreColor}, 0 0 24px ${scoreColor}` }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="mt-1 font-mono text-2xl font-bold text-white/85">{score}</span>
        <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/30">Score</span>
      </div>

      {/* Labels around (do NOT rotate) */}
      <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-1">
        <span className="text-[7px] font-bold uppercase tracking-wider text-white/20">Macro</span>
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-1">
        <span className="text-[7px] font-bold uppercase tracking-wider text-white/20">Oportunidades</span>
      </div>
    </div>
  )
}
