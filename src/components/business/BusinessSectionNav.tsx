'use client'

import { motion } from 'framer-motion'
import { useBusinessStore, type BusinessSection } from '@/store/business-store'

const SECTIONS: { id: BusinessSection; label: string }[] = [
  { id: 'panorama',    label: 'Panorama' },
  { id: 'macro',       label: 'Macro' },
  { id: 'plataformas', label: 'Marketing' },
  { id: 'problemas',   label: 'Riscos' },
  { id: 'signals',     label: 'Signals' },
  { id: 'simulacao',   label: 'Simulação' },
]

export default function BusinessSectionNav() {
  const active = useBusinessStore((s) => s.businessActiveSection)
  const setSection = useBusinessStore((s) => s.setBusinessSection)

  return (
    <div className="flex items-center justify-start md:justify-center gap-4 md:gap-5 py-1 overflow-x-auto scrollbar-hide px-4 md:px-0">
      {SECTIONS.map((s) => {
        const isActive = active === s.id
        return (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`relative pb-1 text-[10px] font-medium uppercase tracking-[0.18em] transition-colors duration-200 ${
              isActive ? 'text-white/50' : 'text-white/15 hover:text-white/30'
            }`}
          >
            {s.label}
            {isActive && (
              <motion.div
                layoutId="bsn"
                className="absolute bottom-0 left-0 right-0 h-[0.5px]"
                style={{ background: 'rgba(192,192,192,0.35)' }}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
