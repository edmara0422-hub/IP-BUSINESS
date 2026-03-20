'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SplashCanvas from '@/components/SplashCanvas'

interface SplashScreenProps {
  onComplete: () => void
}

const TICK_MS = 96
const STEP = 2

function ProgressRail({ progress }: { progress: number }) {
  return (
    <motion.div
      className="mx-auto mt-8 w-[min(28rem,80vw)] overflow-hidden rounded-[1.4rem] border border-white/14 px-4 py-3"
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(157,165,174,0.08) 12%, rgba(12,12,14,0.82) 48%, rgba(6,6,7,0.96) 100%)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(255,255,255,0.04), 0 26px 80px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.36em] text-white/36">IPB Boot Sequence</span>
        <span className="text-xs font-semibold text-white/82">{progress}%</span>
      </div>

      <div
        className="relative h-[5px] overflow-hidden rounded-full"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.3) 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${progress}%`,
            background:
              'linear-gradient(90deg, #7d838b 0%, #fafcff 24%, #d8dde4 52%, #ffffff 76%, #7d838b 100%)',
            boxShadow:
              '0 0 18px rgba(255,255,255,0.18), 0 0 38px rgba(214,220,228,0.18)',
          }}
        />
      </div>
    </motion.div>
  )
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let completeTimeout: number | undefined

    const interval = window.setInterval(() => {
      setProgress((previous) => {
        if (previous >= 100) {
          return 100
        }

        const next = Math.min(previous + STEP, 100)

        if (next === 100) {
          window.clearInterval(interval)
          completeTimeout = window.setTimeout(onComplete, 1500)
        }

        return next
      })
    }, TICK_MS)

    return () => {
      window.clearInterval(interval)
      if (completeTimeout) {
        window.clearTimeout(completeTimeout)
      }
    }
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden bg-[#030303]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="absolute inset-0">
        <SplashCanvas />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.12),transparent_18%),radial-gradient(circle_at_50%_78%,rgba(173,181,192,0.06),transparent_24%),linear-gradient(180deg,rgba(3,3,3,0.12)_0%,rgba(3,3,3,0.62)_56%,rgba(3,3,3,0.92)_100%)]" />

      <div className="relative flex min-h-screen items-center justify-center px-5 text-center">
        <div className="w-full max-w-4xl mt-[6vh]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.18, ease: 'easeOut' }}
          >
          <motion.h1
            className="text-[clamp(3.2rem,11vw,9.6rem)] font-semibold uppercase tracking-[0.34em] text-white"
            style={{
              fontFamily: 'Poppins, sans-serif',
              paddingLeft: '0.34em',
              textShadow:
                '0 0 26px rgba(255,255,255,0.24), 0 0 84px rgba(255,255,255,0.16), 0 0 160px rgba(255,255,255,0.08)',
            }}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            IPB
          </motion.h1>

          <motion.p
            className="mt-2 text-[clamp(6px,1.6vw,10px)] uppercase tracking-[0.3em] text-white/30"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.38, ease: 'easeOut' }}
          >
            Intelligence Platform BUSINESS
          </motion.p>

          <div className="mx-auto max-w-2xl">
            <ProgressRail progress={progress} />
          </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
