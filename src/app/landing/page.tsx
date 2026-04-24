'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import IpbBackground from '@/components/IpbBackground'

/* ── Ticker de mercado ao vivo ──────────────────────────────── */
type Tick = { label: string; value: string; delta: string; up: boolean }

function useTicker() {
  const [ticks, setTicks] = useState<Tick[]>([
    { label: 'SELIC',     value: '14.75%',  delta: '+0.00', up: false },
    { label: 'USD/BRL',   value: 'R$4.98',  delta: '+0.02', up: true  },
    { label: 'IPCA',      value: '4.14%',   delta: '-0.08', up: false },
    { label: 'PIB',       value: '1.86%',   delta: '+0.04', up: true  },
    { label: 'Ouro',      value: '$4.817',  delta: '+12.3', up: true  },
    { label: 'IBOVESPA',  value: '128k',    delta: '+0.6%', up: true  },
    { label: 'Tech BR',   value: '95/100',  delta: '+2',    up: true  },
    { label: 'Agro BR',   value: '88/100',  delta: '-1',    up: false },
  ])

  useEffect(() => {
    fetch('/api/market').then(r => r.json()).then(d => {
      if (!d?.macro) return
      setTicks([
        { label: 'SELIC',    value: `${d.macro.selic?.value ?? 14.75}%`,         delta: '0.00', up: false },
        { label: 'USD/BRL',  value: `R$${d.macro.usdBrl?.value ?? 4.98}`,         delta: `${(d.macro.usdBrl?.delta ?? 0) >= 0 ? '+' : ''}${(d.macro.usdBrl?.delta ?? 0).toFixed(2)}`, up: (d.macro.usdBrl?.delta ?? 0) >= 0 },
        { label: 'IPCA',     value: `${d.macro.ipca?.value ?? 4.14}%`,            delta: `${(d.macro.ipca?.delta ?? 0).toFixed(2)}`, up: (d.macro.ipca?.delta ?? 0) <= 0 },
        { label: 'PIB',      value: `${d.macro.pib?.value ?? 1.86}%`,             delta: `${(d.macro.pib?.delta ?? 0).toFixed(1)}`, up: (d.macro.pib?.value ?? 0) > 2 },
        { label: 'Ouro',     value: `$${d.commodities?.gold?.value ?? 4817}`,     delta: `${(d.commodities?.gold?.delta ?? 0) >= 0 ? '+' : ''}${(d.commodities?.gold?.delta ?? 0).toFixed(1)}`, up: (d.commodities?.gold?.delta ?? 0) >= 0 },
        { label: 'Petróleo', value: `$${d.commodities?.oil?.value ?? 83}`,        delta: `${(d.commodities?.oil?.delta ?? 0) >= 0 ? '+' : ''}${(d.commodities?.oil?.delta ?? 0).toFixed(1)}`, up: (d.commodities?.oil?.delta ?? 0) >= 0 },
        ...(d.sectors?.slice(0, 2) ?? []).map((s: { label: string; heat: number; change: number }) => ({
          label: s.label.split(' ')[0], value: `${s.heat}/100`,
          delta: `${s.change >= 0 ? '+' : ''}${s.change}%`, up: s.change >= 0,
        })),
      ])
    }).catch(() => {})
  }, [])

  return ticks
}

function Ticker({ ticks }: { ticks: Tick[] }) {
  const doubled = [...ticks, ...ticks]
  return (
    <div className="relative overflow-hidden py-2.5"
      style={{ borderTop: '1px solid rgba(192,192,192,0.07)', borderBottom: '1px solid rgba(192,192,192,0.07)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)' }}>
      <motion.div className="flex gap-8 whitespace-nowrap"
        animate={{ x: [0, -50 * ticks.length * 10] }}
        transition={{ duration: ticks.length * 5, repeat: Infinity, ease: 'linear' }}>
        {doubled.map((t, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono text-white/25 tracking-widest uppercase">{t.label}</span>
            <span className="text-[11px] font-mono font-semibold text-white/65">{t.value}</span>
            <span className={`text-[9px] font-mono ${t.up ? 'text-emerald-400/65' : 'text-red-400/65'}`}>{t.delta}</span>
            <span className="text-white/10 mx-1">·</span>
          </div>
        ))}
      </motion.div>
      <div className="absolute left-0 top-0 bottom-0 w-20 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.9), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none" style={{ background: 'linear-gradient(270deg, rgba(0,0,0,0.9), transparent)' }} />
    </div>
  )
}

/* ── Tech strip ─────────────────────────────────────────────── */
const TECH_TAGS = [
  'Groq Llama 3.3-70B', 'BCB/SGS API', 'IBGE', 'Supabase', 'Next.js 15',
  'Real-time', 'SELIC · USD · IPCA', 'Benchmark Setorial', 'LTV/CAC', 'Health Score',
  'Runway Cálculo', 'VERDICT IA', 'Canvas Particles', 'Framer Motion',
]

function TechStrip() {
  const doubled = [...TECH_TAGS, ...TECH_TAGS]
  return (
    <div className="relative overflow-hidden py-3"
      style={{ borderBottom: '1px solid rgba(192,192,192,0.05)' }}>
      <motion.div className="flex gap-3 whitespace-nowrap"
        animate={{ x: [0, -200 * TECH_TAGS.length] }}
        transition={{ duration: TECH_TAGS.length * 3.5, repeat: Infinity, ease: 'linear' }}>
        {doubled.map((tag, i) => (
          <span key={i} className="shrink-0 px-3 py-1 text-[9px] font-mono tracking-wider text-white/22 rounded-full"
            style={{ border: '1px solid rgba(192,192,192,0.07)', background: 'rgba(255,255,255,0.015)' }}>
            {tag}
          </span>
        ))}
      </motion.div>
      <div className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(5,5,5,1), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none" style={{ background: 'linear-gradient(270deg, rgba(5,5,5,1), transparent)' }} />
    </div>
  )
}

/* ── Scroll indicator imersivo ──────────────────────────────── */
function ScrollHint() {
  const [vis, setVis] = useState(true)
  useEffect(() => {
    const fn = () => setVis(window.scrollY < 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <AnimatePresence>
      {vis && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: 6 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-7 left-0 right-0 flex flex-col items-center gap-3 pointer-events-none z-20"
        >
          {/* texto prata pulsando */}
          <motion.span
            className="text-[8px] uppercase font-mono tracking-[0.55em]"
            style={{
              background: 'linear-gradient(180deg, #fff 0%, #d0d0d0 40%, #888 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.35))',
            }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}>
            Descobrir
          </motion.span>

          {/* grupo: raio + chevrons em cascata */}
          <div className="relative flex flex-col items-center">

            {/* raio de luz descendo */}
            <motion.div
              className="absolute top-0 w-px"
              style={{
                height: 28,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)',
              }}
              animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* 3 chevrons em cascata */}
            {[0, 1, 2].map(i => (
              <motion.svg
                key={i}
                width="18" height="10" viewBox="0 0 18 10" fill="none"
                style={{ marginTop: i === 0 ? 28 : -3 }}
                animate={{ opacity: [0, 1, 0], y: [0, 4, 0] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.22,
                }}
              >
                <path
                  d="M2 2 L9 8 L16 2"
                  stroke={`rgba(255,255,255,${0.65 - i * 0.2})`}
                  strokeWidth={1.8 - i * 0.3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </motion.svg>
            ))}

            {/* anel expandindo (pulse) */}
            <motion.div
              className="absolute rounded-full border border-white/10"
              style={{ width: 36, height: 36, top: 18 }}
              animate={{ scale: [0.6, 1.6], opacity: [0.25, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── Linha divisória ────────────────────────────────────────── */
function SectionRule({ label }: { label: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
      className="flex items-center gap-4 mb-12">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(192,192,192,0.1))' }} />
      <span className="text-[8px] uppercase tracking-[0.55em] text-white/18 shrink-0 font-mono">{label}</span>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(192,192,192,0.1), transparent)' }} />
    </motion.div>
  )
}

/* ── Card de preview da aba ─────────────────────────────────── */
function AbaPreview({ icon, title, subtitle, items, delay }: {
  icon: string; title: string; subtitle: string
  items: { label: string; value: string; color?: string }[]
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}
      className="relative rounded-2xl overflow-hidden cursor-default"
      style={{ background: 'rgba(255,255,255,0.022)', border: '1px solid rgba(192,192,192,0.1)', backdropFilter: 'blur(24px)', transition: 'box-shadow 0.3s' }}>
      <div className="absolute top-0 left-6 right-6 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(192,192,192,0.28), transparent)' }} />
      <div className="p-5">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-[0.5rem] shrink-0"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <span className="text-sm">{icon}</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-white/75 tracking-[0.08em] font-mono">{title}</p>
            <p className="text-[8px] text-white/22 uppercase tracking-[0.2em] mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
              <span className="text-[9px] text-white/28 font-mono">{item.label}</span>
              <span className="text-[10px] font-mono font-semibold" style={{ color: item.color ?? 'rgba(255,255,255,0.58)' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ── Como funciona: 3 passos ────────────────────────────────── */
function ComoFunciona() {
  const steps = [
    {
      num: '01',
      title: 'Insira os dados',
      desc: 'Receita, despesas, setor, modelo de cobrança. 2 minutos.',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="2" width="14" height="14" rx="3" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2"/>
          <line x1="5" y1="6.5" x2="13" y2="6.5" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
          <line x1="5" y1="9" x2="10" y2="9" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
          <line x1="5" y1="11.5" x2="8" y2="11.5" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
        </svg>
      ),
    },
    {
      num: '02',
      title: 'IA processa',
      desc: 'Groq Llama 3.3-70B cruza com SELIC, benchmarks setoriais e histórico.',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="6.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2"/>
          <circle cx="9" cy="9" r="2" fill="rgba(255,255,255,0.2)"/>
          <line x1="9" y1="2.5" x2="9" y2="5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="9" y1="13" x2="9" y2="15.5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="2.5" y1="9" x2="5" y2="9" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="13" y1="9" x2="15.5" y2="9" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      num: '03',
      title: 'Diagnóstico real',
      desc: 'Health Score, VERDICT, runway em meses e plano de ação com prazo.',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <polyline points="2,13 6,8 9,11 13,5 16,7" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <circle cx="16" cy="7" r="1.5" fill="rgba(52,211,153,0.6)"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="relative">
      {/* linha conectora */}
      <div className="absolute top-[2.1rem] left-[3.5rem] right-[3.5rem] h-px hidden md:block"
        style={{ background: 'linear-gradient(90deg, rgba(192,192,192,0.08), rgba(192,192,192,0.14), rgba(192,192,192,0.08))' }} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center text-center px-4 py-6 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(192,192,192,0.07)' }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full mb-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 0 20px rgba(255,255,255,0.03)' }}>
              {s.icon}
            </div>
            <span className="text-[8px] font-mono text-white/18 tracking-[0.3em] mb-2">{s.num}</span>
            <p className="text-[12px] font-semibold text-white/70 mb-2 tracking-wide">{s.title}</p>
            <p className="text-[10px] text-white/25 leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ── Métrica com contagem ───────────────────────────────────── */
function MetricaCount({ valor, sufixo, label, delay = 0 }: { valor: number; sufixo: string; label: string; delay?: number }) {
  const [v, setV] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const done = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true
        setTimeout(() => {
          let n = 0; const step = valor / 55
          const t = setInterval(() => { n += step; if (n >= valor) { setV(valor); clearInterval(t) } else setV(Math.floor(n)) }, 18)
        }, delay)
      }
    })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [valor, delay])
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
      <div className="text-[2.6rem] font-extrabold tabular-nums leading-none" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #d0d0d0 45%, #888 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0 0 12px rgba(192,192,192,0.2))',
      }}>
        {v}{sufixo}
      </div>
      <p className="text-[8px] uppercase tracking-[0.32em] mt-2 text-white/22 font-mono">{label}</p>
    </motion.div>
  )
}

/* ── Terminal live da IA ────────────────────────────────────── */
const IA_LINES = [
  { t: '> conectando ao mercado...', c: 'rgba(255,255,255,0.2)' },
  { t: '✓ SELIC 14.75% · USD R$4.98 · IPCA 4.14%', c: 'rgba(192,192,192,0.4)' },
  { t: '> carregando benchmark SaaS B2B...', c: 'rgba(255,255,255,0.2)' },
  { t: '✓ margem ref: 78% · LTV/CAC ref: 3.4x · churn ref: 2.1%', c: 'rgba(192,192,192,0.4)' },
  { t: '─────────────────────────────────────────', c: 'rgba(255,255,255,0.06)' },
  { t: '> analisando cockpit financeiro...', c: 'rgba(255,255,255,0.2)' },
  { t: 'margem bruta: 38% ← 40pp abaixo do ref', c: '#f87171' },
  { t: 'runway: 4.2m ← abaixo do mínimo (6m)', c: '#fbbf24' },
  { t: 'LTV/CAC: 2.1x ← dentro do aceitável', c: 'rgba(192,192,192,0.5)' },
  { t: 'burn real c/ SELIC: R$6.240/mês', c: 'rgba(192,192,192,0.4)' },
  { t: '─────────────────────────────────────────', c: 'rgba(255,255,255,0.06)' },
  { t: 'VERDICT: ALERTA — margem crítica', c: '#f87171' },
  { t: 'AÇÃO 7 dias: precificação +18% · corte fixo R$1.2k', c: '#34d399' },
]

function IaTerminal() {
  const [vis, setVis] = useState(0)
  const [ch, setCh] = useState(0)
  const [loop, setLoop] = useState(0)
  useEffect(() => {
    if (vis >= IA_LINES.length) {
      const t = setTimeout(() => { setVis(0); setCh(0); setLoop(l => l + 1) }, 3500)
      return () => clearTimeout(t)
    }
    const line = IA_LINES[vis]
    if (ch < line.t.length) {
      const t = setTimeout(() => setCh(c => c + 1), 18)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => { setVis(v => v + 1); setCh(0) }, 60)
    return () => clearTimeout(t)
  }, [vis, ch, loop])

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(3,3,3,0.95)', border: '1px solid rgba(192,192,192,0.1)', backdropFilter: 'blur(32px)' }}>
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.4)' }}>
        <div className="flex gap-1.5">
          {['#ff5f57','#ffbd2e','#28c840'].map((c, i) => <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.45 }} />)}
        </div>
        <span className="ml-2 text-[10px] font-mono text-white/18 tracking-wider">IPB · Advisor IA · Groq Compound</span>
        <motion.div className="ml-auto flex items-center gap-1.5"
          animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
          <span className="text-[9px] font-mono text-white/18">conectado</span>
        </motion.div>
      </div>
      <div className="p-5 font-mono text-[10px] leading-[2] min-h-[220px]">
        <AnimatePresence>
          {IA_LINES.slice(0, vis).map((l, i) => (
            <motion.div key={`${loop}-${i}`} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.12 }}>
              <span style={{ color: l.c }}>{l.t}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {vis < IA_LINES.length && (
          <div><span style={{ color: IA_LINES[vis].c }}>{IA_LINES[vis].t.slice(0, ch)}</span>
            <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.55, repeat: Infinity }}
              className="inline-block w-[2px] h-[11px] align-middle ml-px bg-white/45 rounded-sm" />
          </div>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   PÁGINA
══════════════════════════════════════════════════════════════ */
export default function LandingPage({ onEnter }: { onEnter?: () => void }) {
  const ticks = useTicker()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroY       = useTransform(scrollY, [0, 300], [0, -40])
  const smoothY     = useSpring(heroY, { stiffness: 80, damping: 20 })

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-x-hidden overflow-y-auto">
      <IpbBackground />

      {/* ════ HERO ════ */}
      <section ref={heroRef} className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">

        {/* Arco rotativo + scan line */}
        <div className="absolute pointer-events-none" style={{ width: 'min(84vw, 520px)', height: 'min(84vw, 520px)' }}>
          <motion.svg viewBox="0 0 440 440" className="absolute inset-0 w-full h-full"
            animate={{ rotate: 360 }} transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}>
            <circle cx="220" cy="220" r="212" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            <circle cx="220" cy="220" r="212" fill="none" stroke="url(#arc1)" strokeWidth="1.5"
              strokeDasharray="300 1030" strokeLinecap="round" />
            <circle cx="220" cy="220" r="168" fill="none" stroke="rgba(255,255,255,0.012)" strokeWidth="0.7"
              strokeDasharray="90 420" />
            <defs>
              <linearGradient id="arc1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.32)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
          </motion.svg>
          {/* scan horizontal */}
          <motion.div className="absolute left-0 right-0 h-px pointer-events-none"
            style={{ top: '50%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
            animate={{ scaleX: [0.4, 1, 0.4], opacity: [0, 0.6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
        </div>

        {/* conteúdo com parallax */}
        <motion.div style={{ opacity: heroOpacity, y: smoothY }} className="relative z-10 flex flex-col items-center">

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-8 rounded-full font-mono"
            style={{ background: 'rgba(192,192,192,0.035)', border: '1px solid rgba(192,192,192,0.1)', backdropFilter: 'blur(16px)' }}>
            <motion.div animate={{ scale: [1, 1.8, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.8, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full" style={{ background: '#c0c0c0', boxShadow: '0 0 7px rgba(192,192,192,0.5)' }} />
            <span className="text-[9px] tracking-[0.14em] text-white/35">
              Sistema ativo · Groq 70B · BCB ao vivo
            </span>
          </motion.div>

          {/* IPB */}
          <motion.h1
            style={{
              fontFamily: 'Poppins, sans-serif', letterSpacing: '0.34em', paddingLeft: '0.34em',
              fontSize: 'clamp(4rem,13vw,9rem)',
              background: 'linear-gradient(150deg, #ffffff 0%, #e0e0e0 30%, #b0b0b0 60%, #707070 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 48px rgba(192,192,192,0.14))',
            }}
            className="font-semibold uppercase leading-none mb-3"
            initial={{ opacity: 0, scale: 0.88, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            IPB
          </motion.h1>

          <motion.p className="text-[8px] md:text-[9px] uppercase text-white/18 mb-5 font-mono"
            style={{ letterSpacing: '0.48em' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.52 }}>
            Intelligence Platform Business
          </motion.p>

          <motion.div className="h-px w-14 mx-auto mb-6"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)' }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.62 }} />

          <motion.p
            style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(0.88rem,2.8vw,1.15rem)' }}
            className="font-light text-white/38 max-w-[22rem] leading-relaxed mb-2"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68 }}>
            O sistema que transforma dados reais<br />em decisões que fazem sentido.
          </motion.p>

          <motion.p className="text-[9px] text-white/18 font-mono tracking-[0.12em] mb-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.82 }}>
            Sem achismo. Sem promessas. Só resultado.
          </motion.p>

          {/* Botão hero — vidro, sutil, não bloqueia scroll */}
          <motion.button onClick={onEnter}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 32px rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.94, boxShadow: '0 0 16px rgba(255,255,255,0.06)' }}
            className="relative overflow-hidden px-7 py-2.5 rounded-full text-[11px] font-semibold tracking-[0.12em] text-white/65 transition-colors"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)',
              border: '1px solid rgba(255,255,255,0.14)',
              backdropFilter: 'blur(16px)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
            }}>
            <span style={{
              background: 'linear-gradient(90deg, #e0e0e0, #ffffff, #c0c0c0)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Entrar no IPB
            </span>
            {/* shimmer */}
            <motion.div className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)', x: '-100%' }}
              animate={{ x: ['−100%', '200%'] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 1 }} />
          </motion.button>
        </motion.div>

        <ScrollHint />
      </section>

      {/* ════ TICKER ════ */}
      <div className="relative z-10">
        <Ticker ticks={ticks} />
      </div>

      {/* ════ TECH STRIP ════ */}
      <div className="relative z-10">
        <TechStrip />
      </div>

      {/* ════ PLATAFORMA ════ */}
      <section className="relative z-10 px-5 py-20 max-w-2xl mx-auto">
        <SectionRule label="Plataforma" />

        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center text-[12px] text-white/25 mb-10 leading-relaxed max-w-sm mx-auto">
          Três ambientes integrados. Dados de mercado, estudo profundo e cockpit financeiro operando em conjunto.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: '◎', title: 'BUSINESS',     sub: 'Mercado ao vivo',
              items: [{ label: 'SELIC · USD · IPCA', value: 'real-time' }, { label: 'Setores monitorados', value: '9 ativos', color: '#34d399' }, { label: 'Alertas macro IA', value: 'ativos', color: '#34d399' }, { label: 'Commodities', value: 'ouro · petróleo' }] },
            { icon: '◈', title: 'INTELLIGENCE', sub: '8 módulos de estudo',
              items: [{ label: 'Conteúdo interativo', value: '10k+ blocos' }, { label: 'Tutor IA', value: 'por módulo', color: '#34d399' }, { label: 'Simulações', value: 'estratégicas' }, { label: 'ESG / frameworks', value: '8 modelos' }] },
            { icon: '◑', title: 'WORKSPACE',    sub: 'Cockpit financeiro',
              items: [{ label: 'Health Score', value: '0 → 100', color: '#34d399' }, { label: 'Runway cálculo', value: 'em meses' }, { label: 'LTV/CAC', value: 'vs benchmark' }, { label: 'Diagnóstico IA', value: 'Groq 70B', color: '#34d399' }] },
          ].map((a, i) => (
            <AbaPreview key={i} icon={a.icon} title={a.title} subtitle={a.sub} items={a.items} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* ════ COMO FUNCIONA ════ */}
      <section className="relative z-10 px-5 py-6 pb-20 max-w-2xl mx-auto">
        <SectionRule label="Como funciona" />
        <ComoFunciona />
      </section>

      {/* ════ IA ADVISOR ════ */}
      <section className="relative z-10 px-5 py-6 pb-20 max-w-2xl mx-auto">
        <SectionRule label="IA Advisor · ao vivo" />

        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-[11px] text-white/22 mb-7 text-center leading-relaxed">
          Conecte os dados. A IA cruza com mercado real e entrega diagnóstico + plano de ação em segundos.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <IaTerminal />
        </motion.div>
      </section>

      {/* ════ NÚMEROS ════ */}
      <section className="relative z-10 py-20 px-6"
        style={{ borderTop: '1px solid rgba(192,192,192,0.05)', borderBottom: '1px solid rgba(192,192,192,0.05)', background: 'rgba(255,255,255,0.007)' }}>
        <div className="max-w-lg mx-auto grid grid-cols-4 gap-4">
          <MetricaCount valor={8}   sufixo=""    label="Módulos"          delay={0}   />
          <MetricaCount valor={70}  sufixo="B"   label="Params IA"        delay={100} />
          <MetricaCount valor={12}  sufixo=""    label="Benchmarks"       delay={200} />
          <MetricaCount valor={100} sufixo="%"   label="Dados reais"      delay={300} />
        </div>
      </section>

      {/* ════ CTA FINAL ════ */}
      <section className="relative z-10 px-6 py-28 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-sm mx-auto">

          <div className="relative rounded-3xl p-10 overflow-hidden"
            style={{ background: 'rgba(4,4,4,0.96)', border: '1px solid rgba(192,192,192,0.11)', backdropFilter: 'blur(48px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 48px 120px rgba(0,0,0,0.5)' }}>
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: 'linear-gradient(rgba(192,192,192,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(192,192,192,0.02) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }} />
            <div className="absolute top-0 left-12 right-12 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(192,192,192,0.25), transparent)' }} />

            <div className="relative z-10">
              <motion.div
                animate={{ boxShadow: ['0 0 12px rgba(192,192,192,0.04)', '0 0 28px rgba(192,192,192,0.12)', '0 0 12px rgba(192,192,192,0.04)'] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-11 h-11 rounded-[0.75rem] flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(192,192,192,0.16)' }}>
                <span className="text-[0.5rem] font-bold tracking-[0.3em] text-white/70" style={{ fontFamily: 'Poppins, sans-serif', paddingLeft: '0.3em' }}>IPB</span>
              </motion.div>

              <h2 className="text-[1.25rem] font-bold text-white/88 mb-2 leading-tight">
                Inteligência real.<br />A partir de agora.
              </h2>
              <p className="text-[11px] font-light text-white/25 mb-8 leading-relaxed">
                Mercado real, IA real, diagnóstico real.<br />Entre e veja a diferença ao usar.
              </p>

              <motion.button onClick={onEnter}
                className="relative w-full py-4 text-[13px] font-bold tracking-[0.08em] text-black bg-white rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 0 40px rgba(255,255,255,0.08)' }}
                whileHover={{ scale: 1.025, boxShadow: '0 0 60px rgba(255,255,255,0.18)' }}
                whileTap={{ scale: 0.96, boxShadow: '0 0 20px rgba(255,255,255,0.06)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                <span className="relative z-10">Entrar no IPB →</span>
                {/* ripple shimmer no hover */}
                <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)', x: '-100%' }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 0.55, ease: 'easeInOut' }} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 px-6 py-5 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(192,192,192,0.04)' }}>
        <span className="text-[10px] font-bold font-mono"
          style={{ background: 'linear-gradient(90deg, #b0b0b0, #ffffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          IPB
        </span>
        <p className="text-[9px] text-white/10 font-mono">© 2026 Intelligence Platform Business</p>
        <div className="flex items-center gap-1.5">
          <motion.div animate={{ opacity: [0.15, 0.8, 0.15] }} transition={{ duration: 2.8, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full" style={{ background: '#c0c0c0', boxShadow: '0 0 5px rgba(192,192,192,0.4)' }} />
          <span className="text-[9px] text-white/12 font-mono tracking-wider">LIVE</span>
        </div>
      </footer>
    </div>
  )
}
