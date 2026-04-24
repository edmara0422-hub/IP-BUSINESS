'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import IpbBackground from '@/components/IpbBackground'

/* ── Ticker de mercado ao vivo ──────────────────────────────── */
type Tick = { label: string; value: string; delta: string; up: boolean }

function useTicker() {
  const [ticks, setTicks] = useState<Tick[]>([
    { label: 'SELIC',  value: '14.75%', delta: '+0.00',  up: false },
    { label: 'USD/BRL',value: 'R$4.98', delta: '+0.02',  up: true  },
    { label: 'IPCA',   value: '4.14%',  delta: '-0.08',  up: false },
    { label: 'PIB',    value: '1.86%',  delta: '+0.04',  up: true  },
    { label: 'Ouro',   value: '$4.817', delta: '+12.3',  up: true  },
    { label: 'IBOVESPA', value: '128k', delta: '+0.6%',  up: true  },
    { label: 'Tech BR',value: '95/100', delta: '+2',     up: true  },
    { label: 'Agro BR',value: '88/100', delta: '-1',     up: false },
  ])

  useEffect(() => {
    fetch('/api/market').then(r => r.json()).then(d => {
      if (!d?.macro) return
      setTicks([
        { label: 'SELIC',    value: `${d.macro.selic?.value ?? 14.75}%`,          delta: '0.00', up: false },
        { label: 'USD/BRL',  value: `R$${d.macro.usdBrl?.value ?? 4.98}`,          delta: `${d.macro.usdBrl?.delta >= 0 ? '+' : ''}${(d.macro.usdBrl?.delta ?? 0).toFixed(2)}`, up: (d.macro.usdBrl?.delta ?? 0) >= 0 },
        { label: 'IPCA',     value: `${d.macro.ipca?.value ?? 4.14}%`,             delta: `${(d.macro.ipca?.delta ?? 0).toFixed(2)}`, up: (d.macro.ipca?.delta ?? 0) <= 0 },
        { label: 'PIB',      value: `${d.macro.pib?.value ?? 1.86}%`,              delta: `${(d.macro.pib?.delta ?? 0).toFixed(1)}`, up: (d.macro.pib?.value ?? 0) > 2 },
        { label: 'Ouro',     value: `$${d.commodities?.gold?.value ?? 4817}`,      delta: `${(d.commodities?.gold?.delta ?? 0) >= 0 ? '+' : ''}${(d.commodities?.gold?.delta ?? 0).toFixed(1)}`, up: (d.commodities?.gold?.delta ?? 0) >= 0 },
        { label: 'Petróleo', value: `$${d.commodities?.oil?.value ?? 83}`,         delta: `${(d.commodities?.oil?.delta ?? 0) >= 0 ? '+' : ''}${(d.commodities?.oil?.delta ?? 0).toFixed(1)}`, up: (d.commodities?.oil?.delta ?? 0) >= 0 },
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
      style={{ borderTop: '1px solid rgba(192,192,192,0.07)', borderBottom: '1px solid rgba(192,192,192,0.07)', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(12px)' }}>
      <motion.div className="flex gap-8 whitespace-nowrap"
        animate={{ x: [0, -50 * ticks.length * 10] }}
        transition={{ duration: ticks.length * 5, repeat: Infinity, ease: 'linear' }}>
        {doubled.map((t, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">{t.label}</span>
            <span className="text-[11px] font-mono font-semibold text-white/70">{t.value}</span>
            <span className={`text-[9px] font-mono ${t.up ? 'text-emerald-400/70' : 'text-red-400/70'}`}>{t.delta}</span>
            <span className="text-white/10 mx-1">·</span>
          </div>
        ))}
      </motion.div>
      <div className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.8), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none" style={{ background: 'linear-gradient(270deg, rgba(0,0,0,0.8), transparent)' }} />
    </div>
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
      className="relative rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(192,192,192,0.1)', backdropFilter: 'blur(20px)' }}>
      <div className="absolute top-0 left-6 right-6 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(192,192,192,0.3), transparent)' }} />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">{icon}</span>
          <div>
            <p className="text-[12px] font-semibold text-white/80 tracking-wide">{title}</p>
            <p className="text-[9px] text-white/28 uppercase tracking-[0.15em]">{subtitle}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
              <span className="text-[10px] text-white/35">{item.label}</span>
              <span className="text-[11px] font-mono font-semibold" style={{ color: item.color ?? 'rgba(255,255,255,0.65)' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ── Métrica com contagem ───────────────────────────────────── */
function MetricaCount({ valor, sufixo, label }: { valor: number; sufixo: string; label: string }) {
  const [v, setV] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const done = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true
        let n = 0; const step = valor / 55
        const t = setInterval(() => { n += step; if (n >= valor) { setV(valor); clearInterval(t) } else setV(Math.floor(n)) }, 18)
      }
    })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [valor])
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
      <div className="text-[2.8rem] font-extrabold tabular-nums leading-none" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #d0d0d0 50%, #909090 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0 0 14px rgba(192,192,192,0.25))',
      }}>
        {v}{sufixo}
      </div>
      <p className="text-[9px] uppercase tracking-[0.28em] mt-2 text-white/28">{label}</p>
    </motion.div>
  )
}

/* ── Scroll indicator ───────────────────────────────────────── */
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none z-20">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/25">Explorar</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
              <rect x="1" y="1" width="12" height="18" rx="6" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2"/>
              <motion.rect x="6" y="4" width="2" height="5" rx="1" fill="rgba(255,255,255,0.4)"
                animate={{ y: [4, 9, 4] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── Linha divisória com label ──────────────────────────────── */
function SectionRule({ label }: { label: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
      className="flex items-center gap-4 mb-10">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(192,192,192,0.12))' }} />
      <span className="text-[9px] uppercase tracking-[0.45em] text-white/22 shrink-0">{label}</span>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(192,192,192,0.12), transparent)' }} />
    </motion.div>
  )
}

/* ── Terminal live da IA ────────────────────────────────────── */
const IA_LINES = [
  { t: '> Analisando dados do negócio...', c: 'rgba(255,255,255,0.25)' },
  { t: 'SELIC 14.75% → burn real: R$6.240/mês', c: 'rgba(192,192,192,0.6)' },
  { t: 'Margem 38% vs benchmark SaaS 80%', c: '#f87171' },
  { t: 'Runway: 4.2 meses ⚠ abaixo de 6m', c: '#fbbf24' },
  { t: 'LTV/CAC: 2.1x → meta: 3x', c: 'rgba(192,192,192,0.5)' },
  { t: '─────────────────────────────────', c: 'rgba(255,255,255,0.08)' },
  { t: 'DIAGNÓSTICO: Margem abaixo do modelo', c: '#f87171' },
  { t: 'AÇÃO 7 dias: reajustar preço +18%', c: '#34d399' },
]

function IaTerminal() {
  const [vis, setVis] = useState(0)
  const [ch, setCh] = useState(0)
  const [loop, setLoop] = useState(0)
  useEffect(() => {
    if (vis >= IA_LINES.length) {
      const t = setTimeout(() => { setVis(0); setCh(0); setLoop(l => l + 1) }, 3000)
      return () => clearTimeout(t)
    }
    const line = IA_LINES[vis]
    if (ch < line.t.length) {
      const t = setTimeout(() => setCh(c => c + 1), 22)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => { setVis(v => v + 1); setCh(0) }, 80)
    return () => clearTimeout(t)
  }, [vis, ch, loop])

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(4,4,4,0.92)', border: '1px solid rgba(192,192,192,0.1)', backdropFilter: 'blur(32px)' }}>
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex gap-1.5">
          {['#ff5f57','#ffbd2e','#28c840'].map((c, i) => <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.5 }} />)}
        </div>
        <span className="ml-2 text-[10px] font-mono text-white/20">IPB · Advisor IA</span>
        <motion.div className="ml-auto flex items-center gap-1.5"
          animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
          <span className="text-[9px] font-mono text-white/20">ativo</span>
        </motion.div>
      </div>
      <div className="p-5 font-mono text-[11px] leading-[1.9] min-h-[180px]">
        <AnimatePresence>
          {IA_LINES.slice(0, vis).map((l, i) => (
            <motion.div key={`${loop}-${i}`} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }}>
              <span style={{ color: l.c }}>{l.t}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {vis < IA_LINES.length && (
          <div><span style={{ color: IA_LINES[vis].c }}>{IA_LINES[vis].t.slice(0, ch)}</span>
            <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-[2px] h-[13px] align-middle ml-px bg-white/50 rounded-sm" />
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
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ container: containerRef })
  const arcRotate = useTransform(scrollYProgress, [0, 1], [0, 180])

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#050505] overflow-x-hidden overflow-y-auto">
      <IpbBackground />

      {/* ════ HERO ════ */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">

        {/* Arco com parallax de scroll */}
        <div className="absolute pointer-events-none" style={{ width: 'min(82vw, 500px)', height: 'min(82vw, 500px)' }}>
          <motion.svg viewBox="0 0 440 440" className="absolute inset-0 w-full h-full"
            style={{ rotate: arcRotate }}
            animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}>
            <circle cx="220" cy="220" r="210" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
            <circle cx="220" cy="220" r="210" fill="none" stroke="url(#og2)" strokeWidth="1.5"
              strokeDasharray="280 1040" strokeLinecap="round" />
            <circle cx="220" cy="220" r="170" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="0.6"
              strokeDasharray="80 400" />
            <defs>
              <linearGradient id="og2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.28)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
          </motion.svg>
        </div>

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full"
          style={{ background: 'rgba(192,192,192,0.04)', border: '1px solid rgba(192,192,192,0.12)', backdropFilter: 'blur(16px)' }}>
          <motion.div animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full" style={{ background: '#c0c0c0', boxShadow: '0 0 6px rgba(192,192,192,0.5)' }} />
          <span className="text-[10px] tracking-wide font-light text-white/45">
            Dados reais · IA que analisa · Decisões que fazem sentido
          </span>
        </motion.div>

        {/* IPB */}
        <motion.h1
          className="relative z-10 font-semibold uppercase leading-none mb-3"
          style={{
            fontFamily: 'Poppins, sans-serif', letterSpacing: '0.32em', paddingLeft: '0.32em',
            fontSize: 'clamp(4rem,13vw,9rem)',
            background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 35%, #b0b0b0 65%, #808080 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 40px rgba(192,192,192,0.15))',
          }}
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          IPB
        </motion.h1>

        <motion.p className="relative z-10 text-[8px] md:text-[10px] uppercase text-white/20 mb-5"
          style={{ letterSpacing: '0.4em' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
          Intelligence Platform Business
        </motion.p>

        <motion.div className="relative z-10 h-px w-16 mx-auto mb-6"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.65 }} />

        <motion.p className="relative z-10 text-[clamp(0.85rem,2.5vw,1.1rem)] font-light text-white/45 max-w-xs leading-relaxed"
          style={{ fontFamily: 'Poppins, sans-serif' }}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          Mercado ao vivo. IA financeira.<br />Inteligência de negócio real.
        </motion.p>

        {/* Scroll indicator */}
        <ScrollHint />
      </section>

      {/* ════ TICKER ════ */}
      <div className="relative z-10">
        <Ticker ticks={ticks} />
      </div>

      {/* ════ O QUE É O IPB ════ */}
      <section className="relative z-10 px-5 py-20 max-w-2xl mx-auto">
        <SectionRule label="O que é o IPB" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12">
          {[
            { icon: '🌍', title: 'BUSINESS',     sub: 'Mercado ao vivo',  items: [{ label: 'SELIC', value: '14.75%' }, { label: 'USD/BRL', value: 'R$4.98' }, { label: 'Setores', value: '9 ao vivo', color: '#34d399' }, { label: 'Alertas IA', value: 'ativos', color: '#34d399' }] },
            { icon: '🧠', title: 'INTELLIGENCE', sub: '8 módulos de estudo', items: [{ label: 'Conteúdo', value: '10k+ blocos' }, { label: 'Tutores IA', value: 'professor + tutor' }, { label: 'Simulações', value: 'interativas', color: '#34d399' }, { label: 'ESG', value: '8 frameworks' }] },
            { icon: '⚙️', title: 'WORKSPACE',    sub: 'Cockpit financeiro', items: [{ label: 'Health Score', value: '0–100', color: '#34d399' }, { label: 'Runway', value: 'em meses' }, { label: 'LTV/CAC', value: 'benchmark' }, { label: 'Diagnóstico IA', value: 'Groq 70B', color: '#34d399' }] },
          ].map((a, i) => (
            <AbaPreview key={i} icon={a.icon} title={a.title} subtitle={a.sub} items={a.items} delay={i * 0.12} />
          ))}
        </div>
      </section>

      {/* ════ IA ADVISOR ════ */}
      <section className="relative z-10 px-5 py-6 pb-20 max-w-2xl mx-auto">
        <SectionRule label="IA Advisor ao vivo" />

        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-[12px] text-white/30 mb-6 text-center leading-relaxed">
          Insira seus dados financeiros. A IA cruza com mercado real e entrega diagnóstico + plano de ação.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <IaTerminal />
        </motion.div>
      </section>

      {/* ════ NÚMEROS ════ */}
      <section className="relative z-10 py-20 px-6"
        style={{ borderTop: '1px solid rgba(192,192,192,0.06)', borderBottom: '1px solid rgba(192,192,192,0.06)', background: 'rgba(255,255,255,0.008)' }}>
        <div className="max-w-lg mx-auto grid grid-cols-3 gap-6">
          <MetricaCount valor={8}   sufixo=" mod" label="Módulos de estudo" />
          <MetricaCount valor={12}  sufixo=" bmk" label="Benchmarks de mercado" />
          <MetricaCount valor={100} sufixo="%"    label="Dados reais" />
        </div>
      </section>

      {/* ════ CTA FINAL ════ */}
      <section className="relative z-10 px-6 py-24 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="max-w-sm mx-auto">

          <div className="relative rounded-3xl p-10 overflow-hidden"
            style={{ background: 'rgba(5,5,5,0.92)', border: '1px solid rgba(192,192,192,0.12)', backdropFilter: 'blur(40px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: 'linear-gradient(rgba(192,192,192,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(192,192,192,0.025) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }} />
            <div className="absolute top-0 left-10 right-10 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(192,192,192,0.28), transparent)' }} />

            <div className="relative z-10">
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(192,192,192,0.05)', border: '1px solid rgba(192,192,192,0.18)', boxShadow: '0 0 20px rgba(192,192,192,0.07)' }}>
                <span className="text-[0.55rem] font-bold tracking-[0.28em] text-white" style={{ fontFamily: 'Poppins, sans-serif', paddingLeft: '0.28em' }}>IPB</span>
              </motion.div>

              <h2 className="text-[1.3rem] font-bold text-white mb-2">Pronto para começar?</h2>
              <p className="text-[12px] font-light text-white/30 mb-7 leading-relaxed">
                Mercado real, IA real, diagnóstico real.<br />Sem promessas — veja a diferença ao usar.
              </p>

              <motion.button onClick={onEnter}
                className="w-full py-4 text-sm font-bold text-black bg-white rounded-2xl"
                style={{ boxShadow: '0 0 30px rgba(255,255,255,0.09)' }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                Entrar no IPB →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 px-6 py-5 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(192,192,192,0.05)' }}>
        <span className="text-[10px] font-bold"
          style={{ background: 'linear-gradient(90deg, #c0c0c0, #ffffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          IPB
        </span>
        <p className="text-[10px] text-white/12">© 2026 Intelligence Platform Business</p>
        <div className="flex items-center gap-1.5">
          <motion.div animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 2.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full" style={{ background: '#c0c0c0', boxShadow: '0 0 4px rgba(192,192,192,0.4)' }} />
          <span className="text-[10px] text-white/15">Live</span>
        </div>
      </footer>
    </div>
  )
}
