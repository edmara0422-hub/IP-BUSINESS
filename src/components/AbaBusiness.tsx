'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Send, ChevronRight, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react'
import IpbBackground from '@/components/IpbBackground'
import { useMarketData } from '@/hooks/useMarketData'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

// ── Types ──────────────────────────────────────────────────────────────────
interface MacroPoint   { value: number; delta: number; sentiment: string }
interface Commodity    { value: number; delta: number; unit: string; label: string }
interface Sector       { id: string; label: string; change: number; trend: string; heat: number }
interface GlobalAgent  { id: string; label: string; delta: number; impact: string }
interface StockBR      { ticker: string; label: string; price: number; pct: number }
interface StockGlobal  { ticker: string; label: string; pct: number }
interface MarketData {
  macro: { usdBrl: MacroPoint; ipca: MacroPoint; selic: MacroPoint; pib: MacroPoint }
  commodities: Record<string, Commodity>
  sectors: Sector[]
  globalAgents: GlobalAgent[]
  stocks?: { ibov?: { value: number; pct: number }; br?: StockBR[]; global?: StockGlobal[] }
  creditRates?: Record<string, { value: number; label: string; unit: string }>
  opportunities?: { id: string; label: string; urgency: number; type: string }[]
  updatedAt: string
}
interface SimOffsets { selic: number; cambio: number; ipca: number; pib: number }

// ── Helpers ────────────────────────────────────────────────────────────────
const fmtBRL = (n: number) =>
  new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
const fmtK      = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}k` : n.toString()
const pctColor  = (v: number) => v > 0 ? '#34d399' : v < 0 ? '#f87171' : 'rgba(192,192,192,0.45)'
const pctSign   = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`
const clamp     = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))

function applySimulation(data: MarketData, sim: SimOffsets): MarketData {
  const si = sim.selic, pi = sim.pib, ci = sim.cambio
  const sectors = data.sectors.map(s => {
    let a = 0
    if      (s.id === 'retail')    a = -si * 3 + pi * 2
    else if (s.id === 'fintech')   a = si * 1.5 + pi
    else if (s.id === 'tech')      a = pi * 2.5 - si * 0.5
    else if (s.id === 'agro')      a = pi * 1.5 - ci * 2
    else if (s.id === 'energy')    a = ci * 2 + pi
    else if (s.id === 'health')    a = pi * 1.2
    else if (s.id === 'logistics') a = -ci * 1.5 + pi
    else if (s.id === 'services')  a = pi * 1.8 - si * 0.8
    else if (s.id === 'media')     a = pi * 0.5 - si
    const ch = parseFloat((s.change + a).toFixed(1))
    return { ...s, change: ch, heat: clamp(Math.round(s.heat + a * 1.2), 0, 100), trend: ch > 3 ? 'up' : ch < -3 ? 'down' : 'neutral' }
  })
  return {
    ...data,
    macro: {
      usdBrl: { ...data.macro.usdBrl, value: parseFloat(clamp(data.macro.usdBrl.value + ci, 3, 8).toFixed(2)) },
      selic:  { ...data.macro.selic,  value: parseFloat(clamp(data.macro.selic.value + si,  2, 20).toFixed(2)) },
      ipca:   { ...data.macro.ipca,   value: parseFloat(clamp(data.macro.ipca.value + sim.ipca, 0.5, 15).toFixed(2)) },
      pib:    { ...data.macro.pib,    value: parseFloat(clamp(data.macro.pib.value + pi, -3, 8).toFixed(1)) },
    },
    sectors,
  }
}

// ── Sparkline ──────────────────────────────────────────────────────────────
function Sparkline({ id, delta, color, w = 64, h = 22 }: { id: string; delta: number; color: string; w?: number; h?: number }) {
  const pts = useMemo(() => {
    const dateStr = new Date().toDateString()
    let seed = 0
    for (const c of id + dateStr) seed = (Math.imul(31, seed) + c.charCodeAt(0)) | 0
    const arr: number[] = []
    for (let i = 0; i < 14; i++) {
      seed = (Math.imul(1664525, seed) + 1013904223) | 0
      const r  = (Math.abs(seed) % 1000) / 1000
      const tr = Math.sign(delta) * 0.06 * (i / 13)
      arr.push(clamp(r * 0.6 + 0.2 + tr, 0.05, 0.95))
    }
    const mn = Math.min(...arr), mx = Math.max(...arr), rng = mx - mn || 0.1
    const norm = arr.map(v => (v - mn) / rng)
    return norm.map((v, i) => `${(i / 13) * w},${h - v * (h - 2) - 1}`).join(' ')
  }, [id, delta, w, h])
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.3"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
    </svg>
  )
}

// ── Macro Card ─────────────────────────────────────────────────────────────
function MacroCard({ id, label, value, unit, delta, color, sub, delay }: {
  id: string; label: string; value: string; unit?: string; delta: number
  color: string; sub?: string; delay: number
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
      className="relative rounded-2xl p-4 flex flex-col gap-1 overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.022)', border: '1px solid rgba(192,192,192,0.09)', backdropFilter: 'blur(20px)' }}>
      <div className="absolute top-0 left-4 right-4 h-px"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(192,192,192,0.18),transparent)' }} />
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/28">{label}</span>
        <motion.div className="w-1.5 h-1.5 rounded-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}80` }}
          animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.2, repeat: Infinity }} />
      </div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <span className="text-[1.4rem] font-bold tabular-nums leading-none text-white/88 font-mono">{value}</span>
          {unit && <span className="text-[9px] text-white/22 ml-1 font-mono">{unit}</span>}
          {sub && <div className="text-[8px] text-white/16 mt-0.5 font-mono">{sub}</div>}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-mono font-semibold" style={{ color }}>
            {delta > 0 ? '+' : ''}{delta.toFixed(2)}
          </span>
          <Sparkline id={id} delta={delta} color={color} />
        </div>
      </div>
    </motion.div>
  )
}

function CommandCenter({ data }: { data: MarketData }) {
  const m    = data.macro
  const ibov = data.stocks?.ibov
  const cards = [
    { id: 'selic',  label: 'SELIC',     value: `${m.selic.value}`,           unit: '% a.a.',  delta: 0,                       color: '#94a3b8', sub: 'taxa básica' },
    { id: 'usdbrl', label: 'USD/BRL',   value: `${m.usdBrl.value}`,          unit: 'R$',      delta: m.usdBrl.delta,           color: pctColor(m.usdBrl.delta),     sub: 'câmbio' },
    { id: 'ipca',   label: 'IPCA',      value: `${m.ipca.value}`,            unit: '% 12m',   delta: m.ipca.delta,             color: pctColor(-m.ipca.delta),      sub: 'inflação' },
    { id: 'pib',    label: 'PIB',       value: `${m.pib.value}`,             unit: '% proj',  delta: m.pib.delta,              color: pctColor(m.pib.delta),        sub: 'Focus' },
    { id: 'gold',   label: 'OURO',      value: `${data.commodities.gold?.value ?? '—'}`, unit: 'USD/oz', delta: data.commodities.gold?.delta ?? 0, color: pctColor(data.commodities.gold?.delta ?? 0), sub: 'commodity' },
    { id: 'ibov',   label: 'IBOVESPA',  value: fmtK(ibov?.value ?? 128000),  unit: 'pts',     delta: ibov?.pct ?? 0,           color: pctColor(ibov?.pct ?? 0),     sub: 'B3' },
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
      {cards.map((c, i) => <MacroCard key={c.id} {...c} delay={i * 0.07} />)}
    </div>
  )
}

// ── Stocks Panel ───────────────────────────────────────────────────────────
function StockRow({ ticker, label, price, pct, showPrice = true }: {
  ticker: string; label: string; price?: number; pct: number; showPrice?: boolean
}) {
  const col  = pctColor(pct)
  const Icon = pct > 0.1 ? TrendingUp : pct < -0.1 ? TrendingDown : Minus
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
      <div className="flex items-center gap-2.5">
        <div className="flex h-6 w-10 items-center justify-center rounded-md text-[9px] font-mono font-bold shrink-0"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}>
          {ticker}
        </div>
        <span className="text-[10px] text-white/30">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        {showPrice && price !== undefined && (
          <span className="text-[11px] font-mono text-white/50">R${fmtBRL(price)}</span>
        )}
        <div className="flex items-center gap-1">
          <Icon className="w-3 h-3" style={{ color: col }} />
          <span className="text-[11px] font-mono font-semibold w-14 text-right" style={{ color: col }}>
            {pctSign(pct)}
          </span>
        </div>
      </div>
    </div>
  )
}

function MarketPanel({ data }: { data: MarketData }) {
  const brStocks = data.stocks?.br ?? []
  const glStocks = (data.stocks?.global ?? data.globalAgents?.slice(0, 4).map(a => ({ ticker: a.id.toUpperCase(), label: a.label, pct: a.delta })) ?? [])

  const fallbackBR = [
    { ticker: 'PETR4', label: 'Petrobras', price: 36.50, pct: 0 },
    { ticker: 'VALE3', label: 'Vale',       price: 58.20, pct: 0 },
    { ticker: 'ITUB4', label: 'Itaú',       price: 27.90, pct: 0 },
    { ticker: 'BBDC4', label: 'Bradesco',   price: 15.80, pct: 0 },
    { ticker: 'WEGE3', label: 'WEG',        price: 50.10, pct: 0 },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(192,192,192,0.08)', backdropFilter: 'blur(20px)' }}>
        <div className="px-4 pt-4 pb-2 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <span className="text-[9px] font-mono uppercase tracking-[0.35em] text-white/22">Bolsa BR · B3</span>
          <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400/55"
            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
        <div className="px-4 py-1">
          {(brStocks.length > 0 ? brStocks : fallbackBR).map(s =>
            <StockRow key={s.ticker} ticker={s.ticker} label={s.label} price={s.price} pct={s.pct} />)}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(192,192,192,0.08)', backdropFilter: 'blur(20px)' }}>
        <div className="px-4 pt-4 pb-2 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <span className="text-[9px] font-mono uppercase tracking-[0.35em] text-white/22">Empresas Globais</span>
          <motion.div className="w-1.5 h-1.5 rounded-full bg-blue-400/45"
            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.4, repeat: Infinity }} />
        </div>
        <div className="px-4 py-1">
          {glStocks.slice(0, 4).map(s => <StockRow key={s.ticker} ticker={s.ticker} label={s.label} pct={s.pct} showPrice={false} />)}
          <StockRow ticker="XAU"  label="Ouro"     pct={data.commodities.gold?.delta ?? 0} showPrice={false} />
          <StockRow ticker="CL=F" label="Petróleo" pct={data.commodities.oil?.delta  ?? 0} showPrice={false} />
        </div>
      </div>
    </div>
  )
}

// ── Sector Heatmap ─────────────────────────────────────────────────────────
function SectorCell({ sector, delay }: { sector: Sector; delay: number }) {
  const h   = sector.heat
  const bg  = h >= 75 ? 'rgba(52,211,153,0.12)' : h >= 50 ? 'rgba(192,192,192,0.06)' : h >= 30 ? 'rgba(100,100,110,0.06)' : 'rgba(248,113,113,0.1)'
  const bdr = h >= 75 ? 'rgba(52,211,153,0.2)'  : h >= 50 ? 'rgba(192,192,192,0.09)' : h >= 30 ? 'rgba(100,100,110,0.09)' : 'rgba(248,113,113,0.18)'
  const col = h >= 75 ? '#34d399' : h >= 50 ? 'rgba(255,255,255,0.5)' : h >= 30 ? 'rgba(255,255,255,0.3)' : '#f87171'
  return (
    <motion.div initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }} transition={{ delay, duration: 0.5 }}
      className="relative rounded-xl p-3 flex flex-col gap-1"
      style={{ background: bg, border: `1px solid ${bdr}` }}>
      <span className="text-[8px] font-semibold text-white/42 leading-tight">{sector.label}</span>
      <div className="flex items-end justify-between mt-1">
        <div>
          <span className="text-[1.1rem] font-bold font-mono tabular-nums leading-none" style={{ color: col }}>{h}</span>
          <span className="text-[8px] font-mono text-white/15 ml-0.5">/100</span>
        </div>
        <span className="text-[10px] font-mono font-semibold" style={{ color: pctColor(sector.change) }}>
          {sector.change >= 0 ? '+' : ''}{sector.change}%
        </span>
      </div>
      <div className="h-0.5 rounded-full mt-1 bg-white/[0.05]">
        <div className="h-full rounded-full" style={{ width: `${h}%`, background: col, opacity: 0.45 }} />
      </div>
    </motion.div>
  )
}

function SectorHeatmap({ sectors }: { sectors: Sector[] }) {
  const sorted = [...sectors].sort((a, b) => b.heat - a.heat)
  return (
    <div className="grid grid-cols-3 gap-2">
      {sorted.map((s, i) => <SectorCell key={s.id} sector={s} delay={i * 0.05} />)}
    </div>
  )
}

// ── IA Advisor ─────────────────────────────────────────────────────────────
const PRESETS = [
  'Análise geral do mercado agora',
  'Qual setor tem mais oportunidade?',
  'Impacto da SELIC no meu negócio',
  'Riscos externos mais críticos',
]

function IaAdvisor({ data, userSector }: { data: MarketData; userSector?: string }) {
  const [answer, setAnswer]   = useState('')
  const [loading, setLoading] = useState(false)
  const [typed, setTyped]     = useState('')
  const [input, setInput]     = useState('')
  const [fired, setFired]     = useState(false)
  const typingRef             = useRef<ReturnType<typeof setInterval> | null>(null)
  const bottomRef             = useRef<HTMLDivElement>(null)

  const runQuery = useCallback(async (q: string) => {
    if (!q.trim() || loading) return
    setLoading(true)
    setAnswer('')
    setTyped('')
    if (typingRef.current) clearInterval(typingRef.current)
    try {
      const res = await fetch('/api/market-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, marketData: data, userSector }),
      })
      const d = await res.json()
      const text: string = d.answer ?? ''
      setAnswer(text)
      let i = 0
      typingRef.current = setInterval(() => {
        i++
        setTyped(text.slice(0, i))
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        if (i >= text.length && typingRef.current) clearInterval(typingRef.current)
      }, 11)
    } catch {
      setTyped('Erro ao conectar com o Advisor IA.')
    } finally {
      setLoading(false)
    }
  }, [data, loading, userSector])

  useEffect(() => {
    if (!fired && data) { setFired(true); setTimeout(() => runQuery(PRESETS[0]), 900) }
  }, [data, fired, runQuery])

  useEffect(() => () => { if (typingRef.current) clearInterval(typingRef.current) }, [])

  const signalLine  = typed.split('\n').find(l => l.startsWith('SINAL:'))
  const signalColor = signalLine?.includes('🟢') ? '#34d399' : signalLine?.includes('🔴') ? '#f87171' : '#fbbf24'

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(3,3,3,0.95)', border: '1px solid rgba(192,192,192,0.1)', backdropFilter: 'blur(32px)' }}>
      <div className="flex items-center gap-3 px-4 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.4)' }}>
        <div className="flex gap-1.5">
          {['#ff5f57','#ffbd2e','#28c840'].map((c, i) =>
            <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.45 }} />)}
        </div>
        <Zap className="w-3 h-3 text-white/22 ml-1" />
        <span className="text-[10px] font-mono text-white/20 tracking-wider">IPB · Market Intelligence · Groq Compound</span>
        <motion.div className="ml-auto flex items-center gap-1.5"
          animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: loading ? '#fbbf24' : '#34d399' }} />
          <span className="text-[9px] font-mono text-white/18">{loading ? 'analisando' : 'conectado'}</span>
        </motion.div>
      </div>

      <div className="px-4 py-3 flex flex-wrap gap-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        {PRESETS.map(p => (
          <button key={p} onClick={() => runQuery(p)} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-mono text-white/32 transition-all hover:text-white/55 disabled:opacity-40"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <ChevronRight className="w-2.5 h-2.5" />
            {p}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 font-mono text-[11px] leading-[1.9] min-h-[160px] max-h-[300px] overflow-y-auto">
        <AnimatePresence mode="wait">
          {loading && !typed && (
            <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-white/18">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
                <RefreshCw className="w-3 h-3" />
              </motion.div>
              <span>Cruzando dados de mercado com Groq Compound...</span>
            </motion.div>
          )}
        </AnimatePresence>
        {typed && (
          <div>
            {typed.split('\n').map((line, i) => {
              const isSignal = line.startsWith('SINAL:')
              return (
                <div key={i} style={{ borderTop: isSignal ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingTop: isSignal ? '0.75rem' : 0, marginTop: isSignal ? '0.75rem' : 0 }}>
                  <span style={{ color: isSignal ? signalColor : line.startsWith('>') ? 'rgba(255,255,255,0.18)' : 'rgba(192,192,192,0.62)' }}>
                    {line}
                  </span>
                </div>
              )
            })}
            {(loading || typed.length < answer.length) && (
              <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.55, repeat: Infinity }}
                className="inline-block w-[2px] h-[12px] align-middle ml-px bg-white/45 rounded-sm" />
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 pb-4 flex items-center gap-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem' }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { runQuery(input); setInput('') } }}
          placeholder="Pergunte sobre mercado, setores, macro..."
          className="flex-1 bg-transparent text-[11px] font-mono text-white/48 placeholder:text-white/14 outline-none py-2" />
        <button onClick={() => { runQuery(input); setInput('') }} disabled={!input.trim() || loading}
          className="flex h-7 w-7 items-center justify-center rounded-full transition-opacity disabled:opacity-30"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Send className="w-3 h-3 text-white/45" />
        </button>
      </div>
    </div>
  )
}

// ── Credit Bar ─────────────────────────────────────────────────────────────
function CreditBar({ data }: { data: MarketData }) {
  const rates = data.creditRates
  if (!rates) return null
  const items = [
    { label: 'PJ Total',  value: rates.total?.value    ?? 0 },
    { label: 'Comércio',  value: rates.comercio?.value ?? 0 },
    { label: 'Serviços',  value: rates.servicos?.value ?? 0 },
    { label: 'Indústria', value: rates.industria?.value ?? 0 },
    { label: 'Agro',      value: rates.agro?.value     ?? 0 },
  ]
  const max = Math.max(...items.map(i => i.value), 1)
  return (
    <div className="rounded-2xl p-4"
      style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(192,192,192,0.07)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/22">Crédito PJ — % a.a.</span>
        <span className="text-[8px] font-mono text-white/12">BCB/SGS</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {items.map(item => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="text-[9px] font-mono text-white/28 w-16 shrink-0">{item.label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/[0.05]">
              <motion.div className="h-full rounded-full"
                initial={{ width: 0 }} whileInView={{ width: `${(item.value / max) * 100}%` }}
                viewport={{ once: true }} transition={{ duration: 0.8 }}
                style={{ background: item.value > 25 ? 'rgba(248,113,113,0.5)' : 'rgba(192,192,192,0.3)' }} />
            </div>
            <span className="text-[10px] font-mono font-semibold text-white/42 w-10 text-right">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Scenario Simulation ────────────────────────────────────────────────────
function SliderRow({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void
}) {
  const col = value > 0 ? '#f87171' : value < 0 ? '#34d399' : 'rgba(192,192,192,0.35)'
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/28">{label}</span>
        <span className="text-[11px] font-mono font-semibold" style={{ color: col }}>
          {value > 0 ? '+' : ''}{value.toFixed(1)}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: col }} />
    </div>
  )
}

function ScenarioSim({ data, sim, setSim }: { data: MarketData; sim: SimOffsets; setSim: (s: SimOffsets) => void }) {
  const hasSim  = sim.selic !== 0 || sim.cambio !== 0 || sim.ipca !== 0 || sim.pib !== 0
  const simData = useMemo(() => hasSim ? applySimulation(data, sim) : data, [data, sim, hasSim])
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.016)', border: '1px solid rgba(192,192,192,0.08)' }}>
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <span className="text-[9px] font-mono uppercase tracking-[0.35em] text-white/22">Simulação de Cenário</span>
        {hasSim && (
          <button onClick={() => setSim({ selic: 0, cambio: 0, ipca: 0, pib: 0 })}
            className="text-[9px] font-mono text-white/22 hover:text-white/42 transition-colors">
            resetar
          </button>
        )}
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <SliderRow label="SELIC (pp)"   value={sim.selic}  min={-5} max={5}  step={0.25} onChange={v => setSim({ ...sim, selic: v })}  />
          <SliderRow label="USD/BRL (R$)" value={sim.cambio} min={-2} max={2}  step={0.05} onChange={v => setSim({ ...sim, cambio: v })} />
          <SliderRow label="IPCA (pp)"    value={sim.ipca}   min={-3} max={5}  step={0.25} onChange={v => setSim({ ...sim, ipca: v })}   />
          <SliderRow label="PIB (pp)"     value={sim.pib}    min={-3} max={3}  step={0.1}  onChange={v => setSim({ ...sim, pib: v })}    />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-white/16 mb-2">Impacto setorial</span>
          {simData.sectors.slice(0, 6).map(s => (
            <div key={s.id} className="flex items-center justify-between py-1">
              <span className="text-[9px] text-white/28 truncate max-w-[140px]">{s.label}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1 rounded-full bg-white/[0.05]">
                  <div className="h-full rounded-full" style={{ width: `${s.heat}%`, background: pctColor(s.change), opacity: 0.45 }} />
                </div>
                <span className="text-[10px] font-mono w-12 text-right" style={{ color: pctColor(s.change) }}>
                  {s.change >= 0 ? '+' : ''}{s.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Section Label ──────────────────────────────────────────────────────────
function SectionLabel({ label, sub }: { label: string; sub?: string }) {
  return (
    <motion.div initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5 }}
      className="flex items-center gap-3 mb-4">
      <div className="w-0.5 h-4 rounded-full" style={{ background: 'rgba(192,192,192,0.22)' }} />
      <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/25">{label}</span>
      {sub && <span className="text-[8px] font-mono text-white/12">{sub}</span>}
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(192,192,192,0.07), transparent)' }} />
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  MAIN
// ════════════════════════════════════════════════════════════════════════════
export default function AbaBusiness() {
  const { marketData: rawData, refetch, lastUpdated } = useMarketData() as {
    marketData: MarketData | null; refetch?: () => void; lastUpdated?: string
  }
  const [sim, setSim]           = useState<SimOffsets>({ selic: 0, cambio: 0, ipca: 0, pib: 0 })
  const [userSector, setUserSector] = useState<string>()
  const [refreshing, setRefreshing] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    const sb = createClient()
    sb.from('workspace_profiles').select('setor').eq('user_id', user.id).maybeSingle()
      .then(({ data: d }) => { if (d?.setor) setUserSector(d.setor) })
  }, [user?.id])

  const hasSim = sim.selic !== 0 || sim.cambio !== 0 || sim.ipca !== 0 || sim.pib !== 0
  const data   = useMemo(
    () => rawData ? (hasSim ? applySimulation(rawData as MarketData, sim) : rawData as MarketData) : null,
    [rawData, sim, hasSim],
  )

  const handleRefresh = async () => {
    if (refreshing || !refetch) return
    setRefreshing(true)
    await refetch()
    setTimeout(() => setRefreshing(false), 1200)
  }

  if (!data) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="h-8 w-8 rounded-full border-2 border-white/10 border-t-white/35" />
    </div>
  )

  const updatedStr = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <motion.div className="relative flex flex-col gap-7 pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* COMMAND CENTER */}
      <div>
        <div className="flex items-center justify-between">
          <SectionLabel label="Command Center" sub="dados em tempo real" />
          <button onClick={handleRefresh} disabled={refreshing}
            className="flex items-center gap-1.5 text-[9px] font-mono text-white/20 hover:text-white/38 transition-colors disabled:opacity-40 mb-4">
            <motion.div animate={refreshing ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: 'linear' }}>
              <RefreshCw className="w-3 h-3" />
            </motion.div>
            {updatedStr ? `atualizado ${updatedStr}` : 'atualizar'}
          </button>
        </div>
        <CommandCenter data={data} />
      </div>

      {/* MERCADOS */}
      <div>
        <SectionLabel label="Mercados" sub="B3 + globais" />
        <MarketPanel data={data} />
      </div>

      {/* HEATMAP */}
      <div>
        <SectionLabel label="Heatmap Setorial" sub="9 setores · calor de oportunidade" />
        <SectorHeatmap sectors={data.sectors} />
      </div>

      {/* CRÉDITO */}
      <div>
        <SectionLabel label="Crédito PJ" sub="taxas médias BCB/SGS" />
        <CreditBar data={data} />
      </div>

      {/* IA ADVISOR */}
      <div>
        <SectionLabel label="Market Intelligence · IA" sub="Groq Compound · análise ao vivo" />
        <IaAdvisor data={data} userSector={userSector} />
      </div>

      {/* SIMULAÇÃO */}
      <div>
        <SectionLabel label="Simulação de Cenário" sub="ajuste macro e veja o impacto setorial" />
        <ScenarioSim data={data} sim={sim} setSim={setSim} />
      </div>

    </motion.div>
  )
}
