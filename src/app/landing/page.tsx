'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import IpbBackground from '@/components/IpbBackground'

const DIFERENCIAIS = [
  { title: 'Mercado em tempo real',  desc: 'SELIC, câmbio, setores — dados reais a cada minuto' },
  { title: 'IA que cruza tudo',       desc: 'Analisa o mercado e mostra como afeta SEU negócio' },
  { title: 'De PF a LTDA',           desc: 'O app cresce com você — iniciante ou empresa' },
  { title: 'Acessível por design',    desc: 'Inclusivo para todos — neurodiversidade, visual, motor' },
  { title: 'ESG inteligente',         desc: '8 frameworks + IA recomenda o caminho certo' },
  { title: 'Workspace completo',      desc: 'Cockpit, pricing, cenários — conectados ao mercado' },
]

const PILARES = [
  { label: 'Mercado',      desc: 'SELIC, câmbio, setores e commodities ao vivo' },
  { label: 'Inteligência', desc: '8 módulos de estudo com IA consultiva' },
  { label: 'Workspace',    desc: 'Cockpit financeiro, cenários e diagnóstico' },
  { label: 'Estratégia',   desc: 'ESG, pricing, plano de ação executável' },
]

export default function LandingPage({ onEnter }: { onEnter?: () => void }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % DIFERENCIAIS.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-x-hidden">
      <IpbBackground />

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">

        {/* Arco girando */}
        <div className="absolute pointer-events-none" style={{ width: 'min(80vw, 480px)', height: 'min(80vw, 480px)' }}>
          <motion.svg viewBox="0 0 440 440" className="absolute inset-0 w-full h-full"
            animate={{ rotate: 360 }} transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}>
            <circle cx="220" cy="220" r="210" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
            <circle cx="220" cy="220" r="210" fill="none" stroke="url(#og)" strokeWidth="1.5"
              strokeDasharray="260 1040" strokeLinecap="round" />
            <defs>
              <linearGradient id="og" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.22)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
          </motion.svg>
        </div>

        {/* Badge pulsante */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="relative z-10 inline-flex items-center gap-2 px-4 py-2 mb-10 rounded-full"
          style={{ background: 'rgba(192,192,192,0.04)', border: '1px solid rgba(192,192,192,0.13)', backdropFilter: 'blur(16px)' }}
        >
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#c0c0c0', boxShadow: '0 0 6px rgba(192,192,192,0.5)' }}
          />
          <span className="text-[11px] tracking-wide font-light text-white/50">Plataforma de inteligência para negócios</span>
        </motion.div>

        {/* Logo IPB */}
        <div className="relative z-10 flex flex-col items-center">
          <motion.h1
            className="text-[clamp(3.8rem,12vw,8rem)] font-semibold uppercase leading-none"
            style={{
              fontFamily: 'Poppins, sans-serif',
              letterSpacing: '0.3em',
              paddingLeft: '0.3em',
              background: 'linear-gradient(135deg, #ffffff 0%, #e8e8e8 30%, #c0c0c0 60%, #909090 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 30px rgba(192,192,192,0.18))',
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            IPB
          </motion.h1>

          <motion.p
            className="mt-2 text-[8px] md:text-[10px] uppercase text-white/22"
            style={{ letterSpacing: '0.38em' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          >
            Intelligence Platform Business
          </motion.p>

          {/* Divider */}
          <motion.div className="mt-5 mb-5 h-px w-14 mx-auto"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6 }}
          />

          {/* Headline */}
          <motion.h2
            className="text-[clamp(1.1rem,3vw,1.6rem)] font-light text-white/75 leading-tight mb-2"
            style={{ fontFamily: 'Poppins, sans-serif' }}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
          >
            Dados reais. IA que cruza.
          </motion.h2>
          <motion.h2
            className="text-[clamp(1.1rem,3vw,1.6rem)] font-light text-white/40 leading-tight mb-6"
            style={{ fontFamily: 'Poppins, sans-serif' }}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          >
            Ação que transforma.
          </motion.h2>

          {/* Diferencial rotativo */}
          <motion.div className="h-[44px] flex items-center justify-center mb-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
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
            className="group inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-bold text-black bg-white"
            style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.15), 0 8px 32px rgba(255,255,255,0.1)' }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          >
            Entrar no IPB
            <span className="inline-block transition group-hover:translate-x-0.5">→</span>
          </motion.button>
        </div>
      </section>

      {/* ── PILARES — seção de scroll ── */}
      <section className="relative z-10 py-20 px-6"
        style={{ borderTop: '1px solid rgba(192,192,192,0.06)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, transparent, rgba(192,192,192,0.4))' }} />
            <span className="text-[9px] uppercase tracking-[0.45em] text-white/28">O que o IPB entrega</span>
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, rgba(192,192,192,0.4), transparent)' }} />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {PILARES.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl p-4 overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.018)',
                border: '1px solid rgba(192,192,192,0.1)',
                backdropFilter: 'blur(20px)',
              }}>
              <div className="absolute top-0 left-4 right-4 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(192,192,192,0.25), transparent)' }} />
              <p className="text-[11px] font-semibold text-white/70 mb-1.5">{p.label}</p>
              <p className="text-[9px] text-white/28 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative z-10 px-6 py-20 text-center"
        style={{ borderTop: '1px solid rgba(192,192,192,0.05)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="max-w-sm mx-auto">
          <p className="text-[13px] text-white/30 mb-6 leading-relaxed font-light">
            Mercado real. IA real. Decisões que fazem sentido.
          </p>
          <motion.button
            onClick={onEnter}
            className="w-full py-4 text-sm font-bold text-black bg-white rounded-2xl"
            style={{ boxShadow: '0 0 30px rgba(255,255,255,0.07)' }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          >
            Começar agora →
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-5 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(192,192,192,0.05)' }}>
        <span className="text-[10px] font-bold"
          style={{ background: 'linear-gradient(90deg, #c0c0c0, #ffffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          IPB
        </span>
        <p className="text-[10px] text-white/15">© 2026 Intelligence Platform Business</p>
        <div className="flex items-center gap-1.5">
          <motion.div animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 2.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#c0c0c0', boxShadow: '0 0 4px rgba(192,192,192,0.4)' }} />
          <span className="text-[10px] text-white/15">Live</span>
        </div>
      </footer>
    </div>
  )
}
