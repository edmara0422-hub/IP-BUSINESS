'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RefreshCw, Send, ChevronRight, TrendingUp, TrendingDown, Minus,
  Zap, ChevronDown, Play,
} from 'lucide-react'
import { useMarketData } from '@/hooks/useMarketData'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'

const Globe3D = dynamic(() => import('@/components/business/Globe3D'), { ssr: false })

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
function Sparkline({ id, delta, color, w = 56, h = 20 }: { id: string; delta: number; color: string; w?: number; h?: number }) {
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
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.2"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
    </svg>
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
      {sub && <span className="text-[9px] font-mono text-white/12">{sub}</span>}
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(192,192,192,0.07), transparent)' }} />
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  1 — GLOBE HERO
// ════════════════════════════════════════════════════════════════════════════

function DataPill({ label, value, unit, delta, color, context, side, index }: {
  label: string; value: string; unit?: string; delta: number
  color: string; context?: string; side: 'left' | 'right'; index: number
}) {
  const Icon = delta > 0.05 ? TrendingUp : delta < -0.05 ? TrendingDown : Minus

  return (
    <motion.div
      className="relative overflow-hidden rounded-[16px] flex-1"
      initial={{ opacity: 0, x: side === 'left' ? -28 : 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.09 + 0.35, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'rgba(8,8,14,0.90)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(24px)',
        boxShadow: `0 0 28px ${color}10, 0 4px 16px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {/* Accent bar */}
      <div className="absolute left-0 inset-y-0 w-[3px] rounded-l-[16px]"
        style={{ background: `linear-gradient(180deg, transparent 0%, ${color} 35%, ${color} 65%, transparent 100%)` }} />
      {/* Side glow */}
      <div className="absolute inset-0 pointer-events-none rounded-[16px]"
        style={{ background: `radial-gradient(ellipse 90% 60% at ${side === 'left' ? '110%' : '-10%'} 50%, ${color}09 0%, transparent 65%)` }} />

      <div className="relative pl-5 pr-3.5 py-3.5 h-full flex flex-col justify-between gap-2">
        {/* Label + delta */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[8px] font-mono uppercase tracking-[0.26em] text-white/30 leading-none">{label}</span>
          {delta !== 0 ? (
            <span className="flex items-center gap-0.5 rounded-full px-2 py-[3px] text-[8px] font-mono font-bold shrink-0"
              style={{ background: `${color}18`, border: `1px solid ${color}28`, color }}>
              <Icon className="w-2 h-2" />
              {Math.abs(delta) < 10 ? Math.abs(delta).toFixed(2) : Math.abs(delta).toFixed(0)}%
            </span>
          ) : (
            <span className="rounded-full px-2 py-[3px] text-[7px] font-mono text-white/24 shrink-0"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              estável
            </span>
          )}
        </div>

        {/* Value */}
        <span className="text-[24px] font-bold font-mono tabular-nums text-white/92 tracking-tight leading-none">
          {value}
        </span>

        {/* Unit + context */}
        <div className="space-y-1">
          {unit && <div className="text-[8px] font-mono text-white/24 leading-none">{unit}</div>}
          {context && <p className="text-[8.5px] text-white/30 leading-[1.5] line-clamp-2">{context}</p>}
        </div>
      </div>
    </motion.div>
  )
}

function GlobeHero({ data }: { data: MarketData }) {
  const m      = data.macro
  const ibov   = data.stocks?.ibov
  const gold   = data.commodities.gold
  const silver = data.commodities.silver
  const oil    = data.commodities.oil

  const leftChips = [
    { id: 'selic',  label: 'SELIC',   value: `${m.selic.value}`,      unit: '% ao ano',              delta: 0,              color: '#94a3b8', context: m.selic.sentiment  || 'Taxa básica de juros. Define custo do crédito e atratividade de renda fixa.' },
    { id: 'usdbrl', label: 'USD/BRL', value: `R$ ${m.usdBrl.value}`,  unit: 'câmbio comercial',       delta: m.usdBrl.delta, color: pctColor(m.usdBrl.delta), context: m.usdBrl.sentiment || 'Câmbio afeta preços, importações e margens de exportadores.' },
    { id: 'ipca',   label: 'IPCA',    value: `${m.ipca.value}%`,      unit: 'inflação acumulada 12m', delta: m.ipca.delta,   color: pctColor(-m.ipca.delta),  context: m.ipca.sentiment   || 'Inflação oficial. Acima de 4,5% pressiona BC a subir juros.' },
    { id: 'pib',    label: 'PIB',     value: `${m.pib.value}%`,       unit: 'crescimento projetado',  delta: m.pib.delta,    color: pctColor(m.pib.delta),    context: m.pib.sentiment    || 'Acima de 2% indica expansão. Abaixo de 1% sinaliza estagnação.' },
  ]
  const rightChips = [
    { id: 'ibov',   label: 'IBOVESPA', value: fmtK(ibov?.value ?? 128000), unit: 'pontos — B3',           delta: ibov?.pct ?? 0,    color: pctColor(ibov?.pct ?? 0), context: 'Índice principal da bolsa brasileira. Alta = confiança no mercado acionário.' },
    { id: 'gold',   label: 'OURO',     value: `$ ${gold?.value ?? '—'}`,   unit: 'USD por onça troy',     delta: gold?.delta ?? 0,  color: '#fbbf24',                context: 'Ativo-refúgio global. Sobe em crises, juros em queda e dólar fraco.' },
    { id: 'silver', label: 'PRATA',    value: `$ ${silver?.value ?? '—'}`, unit: 'USD por onça troy',     delta: silver?.delta ?? 0,color: '#c0c0c0',                context: 'Reserva de valor e insumo industrial: chips, solar, eletrônica.' },
    { id: 'oil',    label: 'PETRÓLEO', value: `$ ${oil?.value ?? '—'}`,    unit: 'USD por barril (Brent)', delta: oil?.delta ?? 0,   color: pctColor(oil?.delta ?? 0),context: 'Alta encarece combustíveis, logística e inflação em toda cadeia.' },
  ]

  return (
    <div className="relative w-full select-none">
      {/* Radial glow bg */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 75% at 50% 50%, rgba(192,192,192,0.04) 0%, transparent 70%)' }} />

      {/* ── Desktop: 3 colunas ── */}
      <div className="hidden md:flex items-stretch gap-5 w-full">

        {/* Coluna esquerda */}
        <div className="flex flex-col gap-3 shrink-0" style={{ width: 215 }}>
          {leftChips.map((c, i) => (
            <DataPill key={c.id} label={c.label} value={c.value} unit={c.unit}
              delta={c.delta} color={c.color} context={c.context} side="left" index={i} />
          ))}
        </div>

        {/* Globo central */}
        <div className="flex-1 flex items-center justify-center min-w-0 py-1">
          <div className="relative w-full" style={{ maxWidth: 540 }}>
            {/* Glow */}
            <div className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(192,192,192,0.07) 35%, transparent 70%)', transform: 'scale(1.45)' }} />
            {/* Rings pulsantes */}
            {[1.07, 1.20, 1.38].map((s, i) => (
              <motion.div key={i} className="absolute inset-0 rounded-full pointer-events-none"
                style={{ border: '1px solid rgba(192,192,192,0.06)', transform: `scale(${s})` }}
                animate={{ opacity: [0.55, 0.07, 0.55] }}
                transition={{ duration: 3.5 + i * 1.8, repeat: Infinity, delay: i * 1.2, ease: 'easeInOut' }} />
            ))}
            {/* Globo aspect-ratio 1:1 */}
            <div className="w-full" style={{ aspectRatio: '1 / 1' }}>
              <Globe3D />
            </div>
            {/* AO VIVO — centro do globo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 4 }}>
              <motion.div className="flex items-center gap-2 rounded-full"
                style={{ background: 'rgba(3,5,8,0.88)', border: '1px solid rgba(52,211,153,0.30)', backdropFilter: 'blur(18px)', padding: '8px 18px' }}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}>
                <motion.div className="w-2 h-2 rounded-full bg-emerald-400"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.75, 1.35, 0.75] }}
                  transition={{ duration: 1.6, repeat: Infinity }} />
                <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-emerald-400/90">Ao Vivo</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Coluna direita */}
        <div className="flex flex-col gap-3 shrink-0" style={{ width: 215 }}>
          {rightChips.map((c, i) => (
            <DataPill key={c.id} label={c.label} value={c.value} unit={c.unit}
              delta={c.delta} color={c.color} context={c.context} side="right" index={i} />
          ))}
        </div>
      </div>

      {/* ── Mobile: globo + grid ── */}
      <div className="md:hidden flex flex-col gap-4">
        <div className="relative mx-auto w-full" style={{ maxWidth: 320 }}>
          {[1.08, 1.26].map((s, i) => (
            <motion.div key={i} className="absolute inset-0 rounded-full pointer-events-none"
              style={{ border: '1px solid rgba(192,192,192,0.06)', transform: `scale(${s})` }}
              animate={{ opacity: [0.5, 0.07, 0.5] }}
              transition={{ duration: 3.5 + i * 1.8, repeat: Infinity, delay: i * 1.2 }} />
          ))}
          <div className="w-full" style={{ aspectRatio: '1 / 1' }}><Globe3D /></div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 4 }}>
            <motion.div className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{ background: 'rgba(3,5,8,0.88)', border: '1px solid rgba(52,211,153,0.28)', backdropFilter: 'blur(16px)' }}>
              <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.6, repeat: Infinity }} />
              <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-emerald-400/80">Ao Vivo</span>
            </motion.div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {[...leftChips, ...rightChips].map((c, i) => (
            <DataPill key={c.id} label={c.label} value={c.value} unit={c.unit}
              delta={c.delta} color={c.color} context={c.context} side={i < 4 ? 'left' : 'right'} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  2 — MACRO MEANING
// ════════════════════════════════════════════════════════════════════════════

const MACRO_CARDS = [
  {
    id: 'selic', label: 'SELIC',
    oque: 'Taxa básica de juros definida pelo COPOM/BCB. Referência para todo crédito e custo de capital no Brasil.',
    como: 'Sobe → crédito PJ mais caro (20-45% a.a.) → capital de giro encarece → consumo cai → PME sente pressão de caixa. Cai → expansão fica mais barata → momento de investir e crescer.',
    sinalFn: (v: number) => v > 13 ? { text: 'Crédito restritivo', color: '#f87171' } : v > 10 ? { text: 'Neutro', color: '#fbbf24' } : { text: 'Expansivo', color: '#34d399' },
  },
  {
    id: 'usdbrl', label: 'USD / BRL',
    oque: 'Câmbio real/dólar. Reflete confiança externa no Brasil, fluxo de capital e saldo da balança comercial.',
    como: 'Dólar alto → insumos importados e tech encarecem → agro e exportação ganham. Dólar baixo → importação fica barata → margens de exportação comprimem. PME importadora sofre com câmbio alto.',
    sinalFn: (v: number) => v > 5.8 ? { text: 'Dólar pressionado', color: '#f87171' } : v > 5.0 ? { text: 'Câmbio elevado', color: '#fbbf24' } : { text: 'Câmbio favorável', color: '#34d399' },
  },
  {
    id: 'ipca', label: 'IPCA',
    oque: 'Inflação oficial (IBGE). Mede variação de preços ao consumidor. Meta BCB 2024: 3% ±1.5 pp.',
    como: 'Alto → poder de compra cai + margens reais reduzem + reajuste salarial necessário. PME tem menor poder de repasse que grandes empresas — sente antes e mais forte.',
    sinalFn: (v: number) => v > 5 ? { text: 'Inflação elevada', color: '#f87171' } : v > 3.5 ? { text: 'Acima da meta', color: '#fbbf24' } : { text: 'Controlado', color: '#34d399' },
  },
  {
    id: 'pib', label: 'PIB',
    oque: 'Produto Interno Bruto — soma de tudo produzido. Projeção Focus (BCB) é o consenso do mercado financeiro.',
    como: '>2% → demanda aquece, expanda agora. 0–2% → crescimento fraco, priorize eficiência e caixa. <0% → recessão técnica, preserve runway mínimo de 6 meses e corte variáveis.',
    sinalFn: (v: number) => v < 0.5 ? { text: 'Contração', color: '#f87171' } : v < 1.5 ? { text: 'Crescimento fraco', color: '#fbbf24' } : { text: 'Expansão', color: '#34d399' },
  },
]

function MacroMeaningCard({ card, value, expanded, onToggle }: {
  card: typeof MACRO_CARDS[0]; value: number; expanded: boolean; onToggle: () => void
}) {
  const sinal = card.sinalFn(value)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.4 }}
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: 'rgba(255,255,255,0.022)', border: '1px solid rgba(192,192,192,0.08)' }}
      onClick={onToggle}
    >
      <div className="px-3.5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-mono font-semibold text-white/55">{card.label}</span>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: sinal.color, boxShadow: `0 0 5px ${sinal.color}80` }} />
          <span className="text-[9px] font-mono" style={{ color: sinal.color }}>{sinal.text}</span>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.22 }}>
          <ChevronDown className="w-3.5 h-3.5 text-white/20" />
        </motion.div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3.5 flex flex-col gap-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
              onClick={e => e.stopPropagation()}>
              <div className="pt-3">
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/18">O que é</span>
                <p className="text-[12px] text-white/48 leading-[1.75] mt-1.5">{card.oque}</p>
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/18">Como afeta seu negócio</span>
                <p className="text-[12px] text-white/48 leading-[1.75] mt-1.5">{card.como}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function MacroMeaning({ data }: { data: MarketData }) {
  const [expanded, setExpanded] = useState<string | null>('selic')
  const vals: Record<string, number> = {
    selic: data.macro.selic.value,
    usdbrl: data.macro.usdBrl.value,
    ipca: data.macro.ipca.value,
    pib: data.macro.pib.value,
  }
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {MACRO_CARDS.map(card => (
        <MacroMeaningCard key={card.id} card={card} value={vals[card.id] ?? 0}
          expanded={expanded === card.id}
          onToggle={() => setExpanded(expanded === card.id ? null : card.id)} />
      ))}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  3 — MARKET PANEL (B3 + Global)
// ════════════════════════════════════════════════════════════════════════════

function StockRow({ ticker, label, price, pct, showPrice = true }: {
  ticker: string; label: string; price?: number; pct: number; showPrice?: boolean
}) {
  const col  = pctColor(pct)
  const Icon = pct > 0.1 ? TrendingUp : pct < -0.1 ? TrendingDown : Minus
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
      <div className="flex items-center gap-2.5">
        <div className="flex h-6 w-11 items-center justify-center rounded-md text-[9px] font-mono font-bold shrink-0"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)' }}>
          {ticker}
        </div>
        <span className="text-[10px] text-white/30">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        {showPrice && price !== undefined && (
          <span className="text-[11px] font-mono text-white/45">R${fmtBRL(price)}</span>
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
  const glStocks = data.stocks?.global ?? data.globalAgents?.slice(0, 4).map(a => ({ ticker: a.id.toUpperCase(), label: a.label, pct: a.delta })) ?? []
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
        style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(192,192,192,0.08)' }}>
        <div className="px-4 pt-4 pb-2 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <span className="text-[9px] font-mono uppercase tracking-[0.35em] text-white/22">Bolsa BR · B3</span>
          <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400/55"
            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
        <div className="px-4 py-1">
          {(brStocks.length > 0 ? brStocks : fallbackBR).map(s =>
            <StockRow key={s.ticker} ticker={s.ticker} label={s.label} price={(s as StockBR).price} pct={s.pct} />)}
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(192,192,192,0.08)' }}>
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

// ════════════════════════════════════════════════════════════════════════════
// ██  4 — SECTOR ANALYSIS (expandable)
// ════════════════════════════════════════════════════════════════════════════

const SECTOR_ANALYSIS: Record<string, { oportunidade: string; risco: string; como: string; quem: string }> = {
  retail:    { oportunidade: 'SELIC em queda estimula consumo. Fintechs de BNPL crescem. Social commerce e omnichannel expandem.', risco: 'Inflação corrói poder de compra. Inadimplência PJ 5.8%. Margens típicas de 3-8%.', como: 'Parcelamento sem juros + cashback. Integrar canais físico/digital. Estoque enxuto (just-in-time).', quem: 'Varejo popular, e-commerce, marketplace, franquias' },
  fintech:   { oportunidade: 'Open Finance abre novas receitas. Crédito digital cresce 30% a.a. Embedded finance em expansão.', risco: 'BACEN mais rigoroso. NIM comprimido com SELIC alta. Fraude e chargeback elevados no Brasil.', como: 'Produtos de renda fixa com cashback. BaaS para nichos. Crédito consignado digital.', quem: 'Fintechs de crédito, pagamentos, banking-as-a-service, seguradoras digitais' },
  tech:      { oportunidade: 'IA generativa reduz custo operacional 30-60%. SaaS vertical cresce 22% a.a. no Brasil.', risco: 'Câmbio encarece custos em USD. Churn SaaS BR 5-8%/mês vs 1-3% nos EUA. CAC elevado.', como: 'Precificação em USD para exportação. PLG para reduzir CAC. Verticais com alto switching cost.', quem: 'SaaS vertical, AI-native, devtools, marketplaces B2B' },
  agro:      { oportunidade: 'Commodities em alta histórica. Câmbio favorece exportação. Agrotech cresce 45% a.a.', risco: 'Risco climático (La Niña/El Niño). Custo de insumos em dólar. Logística cara para escoamento.', como: 'Hedge cambial. Contrato futuro de commodities. Tecnologia de precisão para reduzir custo.', quem: 'Produtores de soja, milho, pecuária, café; agtechs, tradings' },
  energy:    { oportunidade: 'Mercado livre de energia cresce 18% a.a. Solar distribuído em boom. ESG como diferencial competitivo.', risco: 'Regulação ANEEL/CMSE. Risco hidrológico em ano seco. Capital intensivo.', como: 'Solar com financiamento no cliente. PCLD com grandes consumidores. RECs para ESG corporativo.', quem: 'Geradoras, distribuidoras, integradores solar, energytechs' },
  health:    { oportunidade: 'Envelhecimento da população. Telemedicina cresce 28% a.a. Healthtech com SaaS recorrente.', risco: 'ANS com regulação crescente. Inadimplência nos planos >15%. Custo de sinistro alto.', como: 'B2B via planos corporativos. Preventivo e wellness. IA para diagnóstico e redução de custo.', quem: 'Healthtechs, clínicas, operadoras de plano, farmácias' },
  logistics: { oportunidade: 'E-commerce gera demanda last-mile. Fulfillment centers ganham escala. Cross-docking urbano.', risco: 'Câmbio encarece frota importada. Diesel e pedágio pressionam margem. Concorrência de marketplace.', como: 'Roteirização com IA. Micro-fulfillment urban. Frota elétrica para urban delivery.', quem: 'Transportadoras, 3PLs, marketplaces de entrega, fintechs de frete' },
  services:  { oportunidade: 'Terceirização de TI e BPO acelera. Consultoria ESG em alta demanda. Serviços recorrentes crescem.', risco: 'SELIC alta limita expansão dos clientes PME. Comoditização. Alta rotatividade de talentos.', como: 'Contratos recorrentes com SLA. Precificação por resultado/outcome. Especialização vertical.', quem: 'Consultorias, bureaus, prestadores B2B, agências especializadas' },
  media:     { oportunidade: 'Criadores independentes escalam com plataformas. Adtech BR cresce. Comunidades pagas em alta.', risco: 'CPM volátil com macro. Atenção fragmentada. LGPD limita targeting. Algoritmos mudam constantemente.', como: 'Owned media (newsletter, podcast). Comunidade paga. Branded content B2B.', quem: 'Agências, creators, adtechs, OTTs, publishers' },
}

function SectorCard({ sector, delay }: { sector: Sector; delay: number }) {
  const [open, setOpen] = useState(false)
  const analysis = SECTOR_ANALYSIS[sector.id]
  const h   = sector.heat
  const col = h >= 75 ? '#34d399' : h >= 50 ? 'rgba(255,255,255,0.48)' : h >= 30 ? 'rgba(255,255,255,0.28)' : '#f87171'
  const bg  = h >= 75 ? 'rgba(52,211,153,0.05)'  : h >= 50 ? 'rgba(192,192,192,0.04)' : h >= 30 ? 'rgba(100,100,110,0.04)' : 'rgba(248,113,113,0.05)'
  const bdr = h >= 75 ? 'rgba(52,211,153,0.14)'  : h >= 50 ? 'rgba(192,192,192,0.07)' : h >= 30 ? 'rgba(100,100,110,0.07)' : 'rgba(248,113,113,0.12)'
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay, duration: 0.4 }}
      className="rounded-xl overflow-hidden" style={{ background: bg, border: `1px solid ${bdr}` }}>
      <div className="px-3.5 py-3 flex items-center justify-between cursor-pointer" onClick={() => setOpen(o => !o)}>
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[11px] font-semibold text-white/58">{sector.label}</span>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-20 h-1 rounded-full bg-white/[0.06]">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${h}%`, background: col, opacity: 0.48 }} />
              </div>
              <span className="text-[9px] font-mono text-white/28">{h}/100</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-semibold" style={{ color: pctColor(sector.change) }}>
            {sector.change >= 0 ? '+' : ''}{sector.change}%
          </span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }}>
            <ChevronDown className="w-3.5 h-3.5 text-white/20" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {open && analysis && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden">
            <div className="px-3.5 pb-3.5 grid grid-cols-2 gap-x-4 gap-y-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem' }}>
              {[
                { heading: 'Oportunidades', text: analysis.oportunidade, color: '#34d399' },
                { heading: 'Riscos',        text: analysis.risco,        color: '#f87171' },
                { heading: 'Como atuar',    text: analysis.como,         color: '#60a5fa' },
                { heading: 'Quem se beneficia', text: analysis.quem,     color: 'rgba(255,255,255,0.22)' },
              ].map(({ heading, text, color }) => (
                <div key={heading}>
                  <span className="text-[9px] font-mono uppercase tracking-[0.22em]" style={{ color }}>{heading}</span>
                  <p className="text-[11px] text-white/38 leading-[1.72] mt-1.5">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function SectorAnalysis({ sectors }: { sectors: Sector[] }) {
  const sorted = [...sectors].sort((a, b) => b.heat - a.heat)
  return (
    <div className="flex flex-col gap-2">
      {sorted.map((s, i) => <SectorCard key={s.id} sector={s} delay={i * 0.04} />)}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  5 — CADEIA DE IMPACTO
// ════════════════════════════════════════════════════════════════════════════

const IMPACT_CHAINS = [
  {
    id: 'selic', title: 'SELIC', color: '#94a3b8',
    up:   { label: 'Sobe',   color: '#f87171', effects: ['Crédito PJ mais caro (20-45% a.a.)', 'Capital de giro encarece', 'Consumo das famílias contrai', 'Pressão em varejo e serviços', 'CDB vira concorrente direto do negócio'] },
    down: { label: 'Cai',    color: '#34d399', effects: ['Crédito mais barato e acessível', 'Custo de capital reduz', 'Consumo aquece', 'Expansão e M&A ficam viáveis', 'Ativos de risco sobem de valor'] },
  },
  {
    id: 'usdbrl', title: 'USD/BRL', color: '#60a5fa',
    up:   { label: 'Sobe',   color: '#f87171', effects: ['Insumos importados encarecem', 'Tech e SaaS em USD ficam caros', 'Agro e exportação ganham competitividade', 'Inflação de custo pressiona PME', 'Margens reais caem'] },
    down: { label: 'Cai',    color: '#34d399', effects: ['Importações ficam mais baratas', 'Insumos e tecnologia acessíveis', 'Margem de exportação comprime', 'Alívio inflacionário', 'Consumo de bens importados cresce'] },
  },
  {
    id: 'ipca', title: 'IPCA', color: '#f87171',
    up:   { label: 'Sobe',   color: '#f87171', effects: ['Poder de compra cai', 'Margens reais reduzem', 'Pressão salarial (dissídio)', 'PME tem menor poder de repasse', 'BCB reage subindo a SELIC'] },
    down: { label: 'Cai',    color: '#34d399', effects: ['Poder de compra sobe', 'Margens reais expandem', 'Pressão salarial menor', 'BCB pode cortar a SELIC', 'Competitividade de exportação melhora'] },
  },
  {
    id: 'pib', title: 'PIB', color: '#34d399',
    up:   { label: 'Cresce', color: '#34d399', effects: ['Demanda agregada sobe', 'Receitas das empresas crescem', 'Emprego e renda expandem', 'Investimento privado acelera', 'Momento de expandir e contratar'] },
    down: { label: 'Cai',    color: '#f87171', effects: ['Demanda contrai', 'Receitas sob pressão', 'Desemprego pode subir', 'Crédito fica mais restritivo', 'Preservar caixa e cortar variáveis'] },
  },
]

function ImpactChain() {
  const [selected, setSelected] = useState<string>('selic')
  const chain = IMPACT_CHAINS.find(c => c.id === selected)!
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.016)', border: '1px solid rgba(192,192,192,0.08)' }}>
      <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <span className="text-[9px] font-mono uppercase tracking-[0.35em] text-white/22">Cadeia de Impacto — escolha um indicador</span>
      </div>
      <div className="px-4 py-3 flex gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        {IMPACT_CHAINS.map(c => (
          <button key={c.id} onClick={() => setSelected(c.id)}
            className="flex-1 py-2 rounded-xl text-[9px] font-mono uppercase tracking-wider transition-all"
            style={{
              background: selected === c.id ? `${c.color}18` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${selected === c.id ? c.color + '38' : 'rgba(255,255,255,0.06)'}`,
              color: selected === c.id ? c.color : 'rgba(255,255,255,0.26)',
            }}>
            {c.title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={selected}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
          className="p-4 grid grid-cols-2 gap-4">
          {[chain.up, chain.down].map((dir, di) => (
            <div key={di} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dir.color }} />
                <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: dir.color }}>
                  {chain.title} {dir.label}
                </span>
              </div>
              {dir.effects.map((effect, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: di === 0 ? -6 : 6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.055, duration: 0.22 }}
                  className="flex items-start gap-2">
                  <div className="mt-1.5 w-1 h-1 rounded-full shrink-0 bg-white/15" />
                  <span className="text-[11px] text-white/36 leading-[1.65]">{effect}</span>
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  6 — CRÉDITO PJ
// ════════════════════════════════════════════════════════════════════════════

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
        <span className="text-[9px] font-mono text-white/12">BCB/SGS</span>
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
            <span className="text-[10px] font-mono font-semibold text-white/40 w-10 text-right">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  7 — PLANO DE AÇÃO IA
// ════════════════════════════════════════════════════════════════════════════

function ActionPlan({ data, userSector }: { data: MarketData; userSector?: string }) {
  const [plan, setPlan]     = useState('')
  const [loading, setLoading] = useState(false)
  const [typed, setTyped]   = useState('')
  const typingRef           = useRef<ReturnType<typeof setInterval> | null>(null)
  const scrollRef           = useRef<HTMLDivElement>(null)

  const generate = useCallback(async () => {
    if (loading) return
    setLoading(true)
    setPlan('')
    setTyped('')
    if (typingRef.current) clearInterval(typingRef.current)

    const q = `Gere um PLANO DE AÇÃO EXECUTÁVEL para uma PME brasileira${userSector ? ` do setor de ${userSector}` : ''} com base nos dados de mercado atuais.

Formato obrigatório:
🎯 DIAGNÓSTICO (2 linhas máximo)
⚡ AÇÃO IMEDIATA 1 (esta semana): [ação específica com número]
⚡ AÇÃO IMEDIATA 2 (esta semana): [ação específica com número]
📅 AÇÃO CURTO PRAZO (este mês): [ação específica]
⚠️ ALERTA CRÍTICO: [principal risco imediato]
💡 OPORTUNIDADE IGNORADA: [o que muitas PMEs não estão vendo agora]

Seja cirúrgico. Use os dados de mercado reais fornecidos. Zero generalidades.`

    try {
      const res = await fetch('/api/market-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, marketData: data, userSector }),
      })
      const d = await res.json()
      const text: string = d.answer ?? ''
      setPlan(text)
      let i = 0
      typingRef.current = setInterval(() => {
        i++
        setTyped(text.slice(0, i))
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        if (i >= text.length && typingRef.current) clearInterval(typingRef.current)
      }, 11)
    } catch {
      setTyped('Erro ao gerar plano de ação.')
    } finally {
      setLoading(false)
    }
  }, [data, loading, userSector])

  useEffect(() => () => { if (typingRef.current) clearInterval(typingRef.current) }, [])

  const isEmoji = (line: string) => /^[🎯⚡📅⚠️💡]/.test(line)

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(3,3,3,0.95)', border: '1px solid rgba(52,211,153,0.14)', backdropFilter: 'blur(32px)' }}>
      <div className="flex items-center gap-3 px-4 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.4)' }}>
        <div className="flex gap-1.5">
          {['#ff5f57', '#ffbd2e', '#28c840'].map((c, i) =>
            <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.45 }} />)}
        </div>
        <Play className="w-3 h-3 text-white/22 ml-1" />
        <span className="text-[10px] font-mono text-white/20 tracking-wider">IPB · Plano de Ação · Groq Compound</span>
        {loading && (
          <motion.div className="ml-auto" animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
            <RefreshCw className="w-3 h-3 text-white/18" />
          </motion.div>
        )}
      </div>

      <div className="px-4 py-4">
        {!plan && !loading && (
          <div className="flex flex-col items-center gap-4 py-6">
            <p className="text-[12px] text-white/28 text-center leading-[1.8] max-w-xs">
              Plano executável com base nas condições atuais — SELIC, câmbio, setores e oportunidades reais de mercado.
            </p>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={generate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-mono font-semibold"
              style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.28)', color: '#34d399' }}>
              <Zap className="w-3.5 h-3.5" />
              Gerar Plano de Ação
            </motion.button>
          </div>
        )}

        {loading && !typed && (
          <div className="flex items-center gap-2.5 py-6 text-white/20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
              <RefreshCw className="w-3.5 h-3.5" />
            </motion.div>
            <span className="text-[11px] font-mono">Analisando mercado e gerando plano...</span>
          </div>
        )}

        {typed && (
          <div ref={scrollRef} className="font-mono text-[11px] leading-[1.9] max-h-[340px] overflow-y-auto">
            {typed.split('\n').map((line, i) => (
              <div key={i} className="mb-0.5"
                style={{ color: isEmoji(line) ? 'rgba(255,255,255,0.65)' : 'rgba(192,192,192,0.40)' }}>
                {line || <br />}
              </div>
            ))}
            {(loading || typed.length < plan.length) && (
              <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.55, repeat: Infinity }}
                className="inline-block w-[2px] h-[12px] align-middle ml-px bg-white/45 rounded-sm" />
            )}
          </div>
        )}

        {typed && !loading && (
          <div className="flex justify-end mt-3">
            <motion.button whileTap={{ scale: 0.96 }} onClick={generate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-mono"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.25)' }}>
              <RefreshCw className="w-2.5 h-2.5" />
              atualizar plano
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  8 — IA MARKET INTELLIGENCE
// ════════════════════════════════════════════════════════════════════════════

const IA_PRESETS = [
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
  const iaScrollRef           = useRef<HTMLDivElement>(null)

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
        if (iaScrollRef.current) iaScrollRef.current.scrollTop = iaScrollRef.current.scrollHeight
        if (i >= text.length && typingRef.current) clearInterval(typingRef.current)
      }, 11)
    } catch {
      setTyped('Erro ao conectar com o Advisor IA.')
    } finally {
      setLoading(false)
    }
  }, [data, loading, userSector])

  useEffect(() => {
    if (!fired && data) { setFired(true); setTimeout(() => runQuery(IA_PRESETS[0]), 900) }
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
          {['#ff5f57', '#ffbd2e', '#28c840'].map((c, i) =>
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

      <div className="px-4 py-3 flex flex-wrap gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        {IA_PRESETS.map(p => (
          <button key={p} onClick={() => runQuery(p)} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-mono text-white/32 transition-all hover:text-white/55 disabled:opacity-40"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <ChevronRight className="w-2.5 h-2.5" />
            {p}
          </button>
        ))}
      </div>

      <div ref={iaScrollRef} className="px-4 py-4 font-mono text-[11px] leading-[1.9] min-h-[160px] max-h-[300px] overflow-y-auto">
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
                  <span style={{ color: isSignal ? signalColor : line.startsWith('>') ? 'rgba(255,255,255,0.18)' : 'rgba(192,192,192,0.60)' }}>
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

// ════════════════════════════════════════════════════════════════════════════
// ██  9 — SIMULAÇÃO DE CENÁRIO
// ════════════════════════════════════════════════════════════════════════════

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
          <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/16 mb-2">Impacto setorial</span>
          {simData.sectors.slice(0, 6).map(s => (
            <div key={s.id} className="flex items-center justify-between py-1">
              <span className="text-[10px] text-white/28 truncate max-w-[140px]">{s.label}</span>
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

// ════════════════════════════════════════════════════════════════════════════
// ██  MAIN
// ════════════════════════════════════════════════════════════════════════════

export default function AbaBusiness() {
  const { marketData: rawData, refetch, lastUpdated } = useMarketData() as {
    marketData: MarketData | null; refetch?: () => void; lastUpdated?: string
  }
  const [sim, setSim]               = useState<SimOffsets>({ selic: 0, cambio: 0, ipca: 0, pib: 0 })
  const [userSector, setUserSector] = useState<string>()
  const [refreshing, setRefreshing] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    const sb = createClient()
    sb.from('workspace_profiles').select('setor').eq('user_id', user.id).maybeSingle()
      .then(({ data: d }: { data: { setor?: string } | null }) => { if (d?.setor) setUserSector(d.setor) })
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
    <motion.div className="relative flex flex-col gap-8 pb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* 1 — GLOBE HERO */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <SectionLabel label="Mercado Global ao Vivo" sub="indicadores em tempo real" />
          <button onClick={handleRefresh} disabled={refreshing}
            className="flex items-center gap-1.5 text-[9px] font-mono text-white/20 hover:text-white/38 transition-colors disabled:opacity-40 mb-4">
            <motion.div animate={refreshing ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: 'linear' }}>
              <RefreshCw className="w-3 h-3" />
            </motion.div>
            {updatedStr ? `atualizado ${updatedStr}` : 'atualizar'}
          </button>
        </div>
        <GlobeHero data={data} />
      </div>

      {/* 2 — MACRO MEANING */}
      <div>
        <SectionLabel label="Macro: O que Significa" sub="para o seu negócio" />
        <MacroMeaning data={data} />
      </div>

      {/* 3 — BOLSA & EMPRESAS */}
      <div>
        <SectionLabel label="Bolsa & Empresas" sub="B3 + globais" />
        <MarketPanel data={data} />
      </div>

      {/* 4 — SETORES: ANÁLISE COMPLETA */}
      <div>
        <SectionLabel label="Setores: Análise Completa" sub="oportunidades · riscos · como atuar" />
        <SectorAnalysis sectors={data.sectors} />
      </div>

      {/* 5 — CADEIA DE IMPACTO */}
      <div>
        <SectionLabel label="Cadeia de Impacto" sub="como cada indicador afeta o ecossistema" />
        <ImpactChain />
      </div>

      {/* 6 — CRÉDITO PJ */}
      <div>
        <SectionLabel label="Crédito PJ" sub="taxas médias BCB/SGS" />
        <CreditBar data={data} />
      </div>

      {/* 7 — PLANO DE AÇÃO IA */}
      <div>
        <SectionLabel label="Plano de Ação: Hoje" sub="gerado por Groq Compound com dados reais" />
        <ActionPlan data={data} userSector={userSector} />
      </div>

      {/* 8 — IA MARKET INTELLIGENCE */}
      <div>
        <SectionLabel label="Market Intelligence · IA" sub="pergunte sobre mercado, setores, macro" />
        <IaAdvisor data={data} userSector={userSector} />
      </div>

      {/* 9 — SIMULAÇÃO DE CENÁRIO */}
      <div>
        <SectionLabel label="Simulação de Cenário" sub="ajuste macro e veja o impacto setorial" />
        <ScenarioSim data={data} sim={sim} setSim={setSim} />
      </div>

    </motion.div>
  )
}
