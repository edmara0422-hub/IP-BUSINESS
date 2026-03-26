'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Badges que orbitam o logo ──
const ORBIT_BADGES = [
  'Dados Reais',
  'IA que Cruza',
  'Mercado ao Vivo',
  'Smart Pricing',
  'Cenários',
  'ESG',
  'Cockpit',
  'Workspace',
  'Unit Economics',
  'Riscos',
  'Setores',
  'Commodities',
]

// ── Diferenciais que rotacionam no centro ──
const DIFERENCIAIS = [
  { title: 'Mercado em tempo real', desc: 'SELIC, câmbio, inflação, setores — dados reais atualizados a cada minuto' },
  { title: 'IA que cruza seus dados', desc: 'Inteligência artificial analisa o mercado e mostra como afeta SEU negócio' },
  { title: 'De PF a LTDA', desc: 'O app cresce com você — de iniciante a empresa estabelecida' },
  { title: 'Decisão, não diagnóstico', desc: 'Não mostra só números — entrega a ação que você precisa tomar agora' },
  { title: 'Base acadêmica real', desc: 'Motor lógico construído sobre o BI em Negócios da PUCPR' },
  { title: 'Workspace inteligente', desc: 'Cockpit financeiro, pricing, cenários e ESG conectados ao mercado ao vivo' },
]

export default function LandingPage({ onEnter }: { onEnter?: () => void }) {
  const [activeIdx, setActiveIdx] = useState(0)

  // Auto-rotate diferenciais
  useEffect(() => {
    const t = setInterval(() => setActiveIdx(i => (i + 1) % DIFERENCIAIS.length), 3500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#050507]">

      {/* ── Background radial ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(214,220,228,0.04),transparent_40%)]" />
      </div>

      {/* ── Arco orbital com badges ── */}
      <div className="absolute" style={{ width: 'min(95vw, 700px)', height: 'min(95vw, 700px)' }}>
        {/* Arco SVG girando */}
        <motion.svg
          viewBox="0 0 440 440"
          className="absolute inset-0 w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          <circle cx="220" cy="220" r="210" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <circle cx="220" cy="220" r="210" fill="none" stroke="url(#orbit-grad)" strokeWidth="1.5"
            strokeDasharray="300 1020" strokeLinecap="round" />
          <defs>
            <linearGradient id="orbit-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* Badges orbitando */}
      </div>

      {/* ── Centro: Logo + Conteúdo ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-md">

        {/* IPB */}
        <motion.h1
          className="text-[4rem] md:text-[6rem] font-semibold uppercase tracking-[0.34em] text-white"
          style={{
            fontFamily: 'Poppins, sans-serif',
            paddingLeft: '0.34em',
            textShadow: '0 0 30px rgba(255,255,255,0.2), 0 0 80px rgba(255,255,255,0.1)',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          IPB
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          className="mt-1 text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Intelligence Platform Business
        </motion.p>

        {/* Divider */}
        <motion.div
          className="mt-6 mb-6 h-px w-16 mx-auto"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />

        {/* Frase central */}
        <motion.p
          className="text-[14px] md:text-[17px] font-light text-white/50 leading-relaxed"
          style={{ fontFamily: 'Poppins, sans-serif' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Inteligência de mercado em tempo real que cruza dados reais com seu negócio e entrega a ação — não só o diagnóstico.
        </motion.p>

        {/* Diferenciais rotativos */}
        <motion.div
          className="mt-6 h-[52px] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <p className="font-mono text-[11px] md:text-[12px] font-bold tracking-[0.1em] text-white/60">
                {DIFERENCIAIS[activeIdx].title}
              </p>
              <p className="mt-1 text-[10px] md:text-[11px] text-white/30">
                {DIFERENCIAIS[activeIdx].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="mb-8" />

        {/* CTA */}
        <motion.button
          onClick={onEnter}
          className="group inline-flex items-center justify-center gap-2 rounded-[1rem] border border-white/12 bg-white/[0.06] px-10 py-3.5 text-[11px] uppercase tracking-[0.24em] text-white/72 backdrop-blur transition hover:bg-white/[0.1] hover:text-white/90"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Entrar no IPB
          <span className="inline-block transition group-hover:translate-x-1">&#8594;</span>
        </motion.button>
      </div>

    </div>
  )
}
