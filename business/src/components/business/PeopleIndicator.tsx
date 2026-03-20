'use client'

import { motion } from 'framer-motion'

interface PeopleIndicatorProps {
  percentage: number
  label: string
  total?: number
}

export default function PeopleIndicator({ percentage, label, total = 10 }: PeopleIndicatorProps) {
  const filled = Math.round((percentage / 100) * total)

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-0.5">
        {Array.from({ length: total }, (_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className={`text-[11px] ${i < filled ? 'text-white/60' : 'text-white/10'}`}
          >
            ☻
          </motion.div>
        ))}
      </div>
      <span className="font-mono text-xs font-bold text-white/60">{percentage}%</span>
      <span className="text-[10px] text-white/30">{label}</span>
    </div>
  )
}
