'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DIFERENCIAIS = [
  { title: 'Mercado em tempo real', desc: 'SELIC, câmbio, setores — dados reais a cada minuto' },
  { title: 'IA que cruza tudo', desc: 'Analisa o mercado e mostra como afeta SEU negócio' },
  { title: 'De PF a LTDA', desc: 'O app cresce com você — iniciante ou empresa' },
  { title: 'Acessível por design', desc: 'Inclusivo para todos — neurodiversidade, visual, motor' },
  { title: 'ESG inteligente', desc: '8 frameworks + IA recomenda o caminho certo' },
  { title: 'Workspace completo', desc: 'Cockpit, pricing, cenários — conectados ao mercado' },
]

export default function LandingPage({ onEnter }: { onEnter?: () => void }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % DIFERENCIAIS.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#050505]">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_45%)]" />
      </div>

      {/* Arco girando */}
      <div className="absolute" style={{ width: 'min(85vw, 500px)', height: 'min(85vw, 500px)' }}>
        <motion.svg viewBox="0 0 440 440" className="absolute inset-0 w-full h-full"
          animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}>
          <circle cx="220" cy="220" r="210" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <circle cx="220" cy="220" r="210" fill="none" stroke="url(#og)" strokeWidth="1.5"
            strokeDasharray="280 1040" strokeLinecap="round" />
          <defs>
            <linearGradient id="og" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
        </motion.svg>
      </div>

      {/* Centro */}
      <div className="relative z-10 flex flex-col items-center text-center px-6" style={{ maxWidth: 360 }}>

        {/* IPB */}
        <motion.h1
          className="text-[3.5rem] md:text-[5rem] font-semibold uppercase tracking-[0.3em] text-white"
          style={{ fontFamily: 'Poppins, sans-serif', paddingLeft: '0.3em',
            textShadow: '0 0 24px rgba(255,255,255,0.18), 0 0 60px rgba(255,255,255,0.08)' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          IPB
        </motion.h1>

        <motion.p
          className="text-[7px] md:text-[9px] uppercase tracking-[0.35em] text-white/18"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        >
          Intelligence Platform Business
        </motion.p>

        {/* Divider */}
        <motion.div className="mt-4 mb-4 h-px w-12 mx-auto"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4 }}
        />

        {/* Frase curta */}
        <motion.p
          className="text-[12px] md:text-[14px] font-light text-white/40 leading-relaxed"
          style={{ fontFamily: 'Poppins, sans-serif' }}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        >
          Dados reais. IA que cruza.
          <br />
          Ação que transforma.
        </motion.p>

        {/* Diferenciais rotativos */}
        <motion.div className="mt-5 h-[44px] flex items-center justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <AnimatePresence mode="wait">
            <motion.div key={idx}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
              className="text-center">
              <p className="font-mono text-[10px] md:text-[11px] font-bold tracking-[0.08em] text-white/55">
                {DIFERENCIAIS[idx].title}
              </p>
              <p className="mt-0.5 text-[9px] md:text-[10px] text-white/25">
                {DIFERENCIAIS[idx].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.button
          onClick={onEnter}
          className="mt-6 group inline-flex items-center justify-center gap-2 rounded-[1rem] border border-white/10 bg-white/[0.05] px-8 py-3 text-[10px] uppercase tracking-[0.22em] text-white/65 transition hover:bg-white/[0.09] hover:text-white/85"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        >
          Entrar no IPB
          <span className="inline-block transition group-hover:translate-x-0.5">&#8594;</span>
        </motion.button>
      </div>
    </div>
  )
}
