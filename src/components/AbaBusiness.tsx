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
// ██  1 — GLOBE HERO  (chips em órbita elíptica + painel de detalhe)
// ════════════════════════════════════════════════════════════════════════════

interface ChipData {
  id: string; label: string; value: string; unit?: string
  delta: number; color: string
  signal?: { text: string; color: string }
  oque?: string; como?: string
}

// ── Orbit math ────────────────────────────────────────────────────────────────
const ORB_AX   = 338   // horizontal semi-axis (px)
const ORB_AY   = 195   // vertical semi-axis (px)
const ORB_DUR  = 80    // seconds per full revolution
const ORB_N    = 40    // keyframe segments (41 points, first === last → seamless)

function makeOrbitKF(startAngle: number) {
  const times = Array.from({ length: ORB_N + 1 }, (_, i) => i / ORB_N)
  const x = times.map(t => Math.round(ORB_AX * Math.cos(startAngle + t * 2 * Math.PI)))
  const y = times.map(t => Math.round(ORB_AY * Math.sin(startAngle + t * 2 * Math.PI)))
  return { x, y, times }
}

// ── Small chip that orbits the globe ─────────────────────────────────────────
function OrbitalChip({ chip, index, isSelected, onClick }: {
  chip: ChipData; index: number; isSelected: boolean; onClick: () => void
}) {
  const startAngle = (index / 8) * 2 * Math.PI - Math.PI / 2
  const { x: xKF, y: yKF, times } = makeOrbitKF(startAngle)

  const DeltaIcon  = chip.delta > 0.05 ? TrendingUp : chip.delta < -0.05 ? TrendingDown : Minus
  const deltaColor = chip.delta > 0.05 ? '#34d399' : chip.delta < -0.05 ? '#f87171' : '#94a3b8'
  const absDelta   = Math.abs(chip.delta)
  const deltaStr   = absDelta < 10 ? absDelta.toFixed(1) : absDelta.toFixed(0)
  const deltaSign  = chip.delta > 0.05 ? '▲' : chip.delta < -0.05 ? '▼' : '→'
  const accent     = chip.signal?.color ?? chip.color

  return (
    <motion.div
      style={{ position: 'absolute', left: '50%', top: '50%', width: 136, marginLeft: -68, marginTop: -44, zIndex: isSelected ? 20 : 10, cursor: 'pointer' }}
      animate={{ x: xKF, y: yKF }}
      transition={{ duration: ORB_DUR, repeat: Infinity, ease: 'linear', times }}
      onClick={(e) => { e.stopPropagation(); onClick() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: isSelected ? 1.07 : 1 }}
        transition={{ delay: index * 0.12 + 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: isSelected ? 'rgba(10,10,10,0.98)' : 'rgba(5,5,5,0.92)',
          border: `1px solid ${isSelected ? accent + '50' : 'rgba(195,195,195,0.10)'}`,
          backdropFilter: 'blur(26px)',
          borderRadius: 15,
          padding: '9px 11px 10px',
          boxShadow: isSelected
            ? `0 0 32px ${accent}28, 0 10px 30px rgba(0,0,0,0.85), inset 0 1px 0 rgba(210,210,210,0.08)`
            : `0 4px 18px rgba(0,0,0,0.65), inset 0 1px 0 rgba(200,200,200,0.05)`,
          overflow: 'hidden',
        }}
      >
        {/* Shimmer sweep */}
        <motion.div
          style={{ position: 'absolute', inset: 0, background: `linear-gradient(105deg, transparent 25%, ${accent}08 50%, transparent 75%)`, pointerEvents: 'none' }}
          animate={{ x: ['-140%', '240%'] }}
          transition={{ duration: 6 + index * 0.7, delay: index * 0.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <p style={{ fontSize: 7.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(195,195,195,0.30)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {chip.label}
        </p>
        <p style={{ fontSize: 19, fontWeight: 700, fontFamily: 'monospace', color: 'rgba(235,235,235,0.96)', lineHeight: 1, marginBottom: 5 }}>
          {chip.value}
        </p>
        {/* Mini sparkline */}
        <div style={{ marginBottom: 5, opacity: 0.65 }}>
          <Sparkline id={chip.id} delta={chip.delta} color={deltaColor} w={46} h={13} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 8.5, fontFamily: 'monospace', fontWeight: 700, color: deltaColor, background: deltaColor + '16', border: `1px solid ${deltaColor}26`, borderRadius: 99, padding: '2px 7px', display: 'inline-flex', alignItems: 'center', gap: 3, alignSelf: 'flex-start' }}>
            <DeltaIcon style={{ width: 8, height: 8, flexShrink: 0 }} />
            {deltaSign}{deltaStr}% hoje
          </span>
          {chip.signal && (
            <span style={{ fontSize: 7.5, fontWeight: 600, color: chip.signal.color, background: chip.signal.color + '12', border: `1px solid ${chip.signal.color}20`, borderRadius: 99, padding: '2px 7px', alignSelf: 'flex-start', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
              {chip.signal.text}
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Detail panel — overlay centered on the orbit stage ───────────────────────
function DetailPanel({ chip, onClose }: { chip: ChipData; onClose: () => void }) {
  const DeltaIcon  = chip.delta > 0.05 ? TrendingUp : chip.delta < -0.05 ? TrendingDown : Minus
  const deltaColor = chip.delta > 0.05 ? '#34d399' : chip.delta < -0.05 ? '#f87171' : '#94a3b8'
  const absDelta   = Math.abs(chip.delta)
  const deltaStr   = absDelta < 10 ? absDelta.toFixed(2) : absDelta.toFixed(0)
  const deltaLabel = chip.delta > 0.05 ? `▲ ${deltaStr}%` : chip.delta < -0.05 ? `▼ ${deltaStr}%` : '→ estável'
  const accent     = chip.signal?.color ?? chip.color

  return (
    <div style={{ background: 'rgba(4,4,4,0.97)', border: `1px solid ${accent}30`, backdropFilter: 'blur(40px)', borderRadius: 24, padding: '22px 24px 26px', boxShadow: `0 0 70px ${accent}12, 0 28px 60px rgba(0,0,0,0.92), inset 0 1px 0 rgba(200,200,200,0.06)`, position: 'relative', overflow: 'hidden', width: 540, maxWidth: '88vw' }}>
      {/* top accent line */}
      <div style={{ position: 'absolute', top: 0, left: '5%', right: '5%', height: 1.5, background: `linear-gradient(90deg, transparent, ${accent}60, transparent)`, borderRadius: 2 }} />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-[0.03]" />

      <button onClick={onClose}
        style={{ position: 'absolute', right: 13, top: 13, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(200,200,200,0.05)', border: '1px solid rgba(200,200,200,0.10)', borderRadius: 7, cursor: 'pointer', color: 'rgba(200,200,200,0.40)', fontSize: 16, lineHeight: 1 }}
      >×</button>

      {/* Header: label + value + badges */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, paddingRight: 30 }}>
        <div>
          <p style={{ fontSize: 8, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.26em', color: 'rgba(195,195,195,0.28)', marginBottom: 5 }}>{chip.label}</p>
          <p style={{ fontSize: 40, fontWeight: 800, fontFamily: 'monospace', color: 'rgba(235,235,235,0.97)', lineHeight: 1 }}>{chip.value}</p>
          {chip.unit && <p style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(195,195,195,0.28)', marginTop: 4 }}>{chip.unit}</p>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, paddingTop: 2 }}>
          <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: deltaColor, background: deltaColor + '18', border: `1px solid ${deltaColor}2e`, borderRadius: 99, padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <DeltaIcon style={{ width: 11, height: 11 }} />{deltaLabel}
          </span>
          {chip.signal && (
            <span style={{ fontSize: 10, fontWeight: 600, color: chip.signal.color, background: chip.signal.color + '18', border: `1px solid ${chip.signal.color}28`, borderRadius: 99, padding: '3px 10px' }}>
              {chip.signal.text}
            </span>
          )}
        </div>
      </div>

      {/* Sparkline chart */}
      <div style={{ marginBottom: 16, padding: '10px 12px 8px', background: 'rgba(200,200,200,0.025)', border: '1px solid rgba(200,200,200,0.07)', borderRadius: 12, overflow: 'hidden' }}>
        <p style={{ fontSize: 7.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(195,195,195,0.22)', marginBottom: 7 }}>Variação 14 dias</p>
        <Sparkline id={chip.id} delta={chip.delta} color={accent} w={480} h={50} />
      </div>

      {/* Two-column explanations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {chip.oque && (
          <div style={{ padding: '11px 13px', background: 'rgba(200,200,200,0.025)', border: '1px solid rgba(200,200,200,0.065)', borderRadius: 12 }}>
            <p style={{ fontSize: 7.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(195,195,195,0.24)', marginBottom: 6 }}>O que é</p>
            <p style={{ fontSize: 12.5, color: 'rgba(215,215,215,0.52)', lineHeight: 1.66 }}>{chip.oque}</p>
          </div>
        )}
        {chip.como && (
          <div style={{ padding: '11px 13px', background: `${accent}07`, border: `1px solid ${accent}18`, borderRadius: 12 }}>
            <p style={{ fontSize: 7.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: `${accent}80`, marginBottom: 6 }}>Impacto no negócio</p>
            <p style={{ fontSize: 12.5, color: 'rgba(215,215,215,0.57)', lineHeight: 1.66 }}>{chip.como}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function GlobeHero({ data }: { data: MarketData }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const m      = data.macro
  const ibov   = data.stocks?.ibov
  const gold   = data.commodities.gold
  const silver = data.commodities.silver
  const oil    = data.commodities.oil

  const sv = m.selic.value
  const uv = m.usdBrl.value
  const iv = m.ipca.value
  const pv = m.pib.value
  const gp = ibov?.pct ?? 0
  const op = oil?.delta ?? 0

  const chips: ChipData[] = [
    {
      id: 'selic', label: 'SELIC', value: `${sv}`, unit: '% ao ano', delta: 0, color: '#94a3b8',
      signal: sv > 13 ? { text: 'Crédito restritivo', color: '#f87171' } : sv > 10 ? { text: 'Neutro', color: '#fbbf24' } : { text: 'Expansivo', color: '#34d399' },
      oque: 'Taxa básica de juros definida pelo COPOM/BCB. Referência para todo crédito e custo de capital no Brasil.',
      como: 'Sobe → crédito PJ mais caro (20–45% a.a.) → capital de giro encarece → consumo cai → PME sente pressão de caixa. Cai → expansão fica mais barata → momento de investir e crescer.',
    },
    {
      id: 'usdbrl', label: 'USD/BRL', value: `R$ ${uv}`, unit: 'câmbio comercial', delta: m.usdBrl.delta, color: pctColor(m.usdBrl.delta),
      signal: uv > 5.8 ? { text: 'Dólar pressionado', color: '#f87171' } : uv > 5.0 ? { text: 'Câmbio elevado', color: '#fbbf24' } : { text: 'Câmbio favorável', color: '#34d399' },
      oque: 'Câmbio real/dólar. Reflete confiança externa no Brasil, fluxo de capital e saldo da balança comercial.',
      como: 'Dólar alto → insumos importados e tech encarecem → agro e exportação ganham. Dólar baixo → importação barata, mas margens de exportação comprimem. PME importadora sofre mais.',
    },
    {
      id: 'ipca', label: 'IPCA', value: `${iv}%`, unit: 'inflação acum. 12m', delta: m.ipca.delta, color: pctColor(-m.ipca.delta),
      signal: iv > 5 ? { text: 'Inflação elevada', color: '#f87171' } : iv > 3.5 ? { text: 'Acima da meta', color: '#fbbf24' } : { text: 'Controlado', color: '#34d399' },
      oque: 'Inflação oficial (IBGE). Mede variação de preços ao consumidor. Meta BCB 2025: 3% ±1.5 pp.',
      como: 'Alto → poder de compra cai + margens reais reduzem + reajuste salarial necessário. PME tem menor poder de repasse que grandes empresas — sente antes e mais forte.',
    },
    {
      id: 'pib', label: 'PIB', value: `${pv}%`, unit: 'crescimento projetado', delta: m.pib.delta, color: pctColor(m.pib.delta),
      signal: pv < 0.5 ? { text: 'Contração', color: '#f87171' } : pv < 1.5 ? { text: 'Crescimento fraco', color: '#fbbf24' } : { text: 'Expansão', color: '#34d399' },
      oque: 'Produto Interno Bruto — soma de tudo produzido. Projeção Focus (BCB) é o consenso do mercado financeiro.',
      como: '>2% → demanda aquece, expanda agora. 0–2% → priorize eficiência e caixa. <0% → recessão técnica, preserve runway de 6 meses e corte variáveis.',
    },
    {
      id: 'ibov', label: 'IBOVESPA', value: fmtK(ibov?.value ?? 128000), unit: 'pontos — B3', delta: gp, color: pctColor(gp),
      signal: gp > 1 ? { text: 'Bolsa em alta', color: '#34d399' } : gp < -1 ? { text: 'Bolsa em queda', color: '#f87171' } : { text: 'Bolsa lateral', color: '#fbbf24' },
      oque: 'Principal índice da B3. Agrega as maiores empresas do Brasil ponderadas por valor de mercado.',
      como: 'Alta → confiança, acesso a crédito e IPOs facilitados. Queda → risco de credit crunch, valuation de PMEs comprimido, saída de capital estrangeiro.',
    },
    {
      id: 'gold', label: 'OURO', value: `$ ${gold?.value ?? '—'}`, unit: 'USD / onça troy', delta: gold?.delta ?? 0, color: '#fbbf24',
      signal: (gold?.delta ?? 0) > 1 ? { text: 'Refúgio ativo', color: '#fbbf24' } : (gold?.delta ?? 0) < -1 ? { text: 'Pressão de venda', color: '#f87171' } : { text: 'Estável', color: '#94a3b8' },
      oque: 'Ativo-refúgio global. Sobe em crises, queda de juros americanos e enfraquecimento do dólar.',
      como: 'Alta do ouro sinaliza aversão a risco global. Empresas com dívida em dólar ou insumos importados sofrem mais neste cenário.',
    },
    {
      id: 'silver', label: 'PRATA', value: `$ ${silver?.value ?? '—'}`, unit: 'USD / onça troy', delta: silver?.delta ?? 0, color: '#c0c0c0',
      signal: (silver?.delta ?? 0) > 1 ? { text: 'Commodity em alta', color: '#34d399' } : (silver?.delta ?? 0) < -1 ? { text: 'Recuo industrial', color: '#f87171' } : { text: 'Estável', color: '#94a3b8' },
      oque: 'Commodity dual: reserva de valor + insumo industrial (chips, painéis solares, eletrônica).',
      como: 'Alta = demanda industrial crescente ou aversão a risco. Relevante para tech, energia renovável e manufatura.',
    },
    {
      id: 'oil', label: 'PETRÓLEO', value: `$ ${oil?.value ?? '—'}`, unit: 'USD / barril (Brent)', delta: op, color: pctColor(op),
      signal: op > 2 ? { text: 'Pressão inflacionária', color: '#f87171' } : op < -2 ? { text: 'Alívio nos custos', color: '#34d399' } : { text: 'Estável', color: '#fbbf24' },
      oque: 'Brent: referência global de petróleo. Afeta diretamente combustíveis, plásticos, frete e logística.',
      como: 'Alta → combustível mais caro → frete sobe → preços ao consumidor pressionados. PME logística e transportes sentem primeiro.',
    },
  ]

  const selectedChip = chips.find(c => c.id === selectedId) ?? null

  return (
    <div className="relative w-full select-none" onClick={() => setSelectedId(null)}>

      {/* ── Desktop: órbita elíptica ── */}
      <div className="hidden md:block">

        {/* Orbit stage */}
        <div className="relative w-full" style={{ height: 660 }}>

          {/* SVG: trilha da órbita */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} overflow="visible">
            <ellipse cx="50%" cy="50%" rx={ORB_AX} ry={ORB_AY}
              fill="none" stroke="rgba(195,195,195,0.05)" strokeWidth="1" strokeDasharray="4 10" />
          </svg>

          {/* Globo 380px centralizado */}
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 380, height: 380, zIndex: 2 }}>
            {[1.06, 1.18, 1.34, 1.52].map((s, i) => (
              <motion.div key={i}
                style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1px solid rgba(192,192,192,${0.07 - i * 0.014})`, transform: `scale(${s})`, pointerEvents: 'none' }}
                animate={{ opacity: [0.55, 0.06, 0.55] }}
                transition={{ duration: 3.4 + i * 1.7, repeat: Infinity, delay: i * 1.1, ease: 'easeInOut' }}
              />
            ))}
            <div style={{ width: '100%', height: '100%' }}><Globe3D /></div>
            {/* AO VIVO badge */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 4 }}>
              <motion.div
                style={{ background: 'rgba(2,2,2,0.92)', border: '1px solid rgba(52,211,153,0.28)', backdropFilter: 'blur(18px)', padding: '9px 22px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 8 }}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <motion.div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399' }}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.75, 1.4, 0.75] }}
                  transition={{ duration: 1.6, repeat: Infinity }} />
                <span style={{ fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.38em', color: 'rgba(52,211,153,0.88)' }}>Ao Vivo</span>
              </motion.div>
            </div>
          </div>

          {/* 8 chips em órbita elíptica */}
          {chips.map((chip, i) => (
            <OrbitalChip
              key={chip.id}
              chip={chip}
              index={i}
              isSelected={selectedId === chip.id}
              onClick={() => setSelectedId(prev => prev === chip.id ? null : chip.id)}
            />
          ))}

          {/* Detail panel — overlay centralizado DENTRO do stage, acima dos chips */}
          <AnimatePresence>
            {selectedChip && (
              <>
                {/* Backdrop escurece órbita, chip clicado fica visível */}
                <motion.div
                  style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.68)', backdropFilter: 'blur(8px)', zIndex: 25 }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  onClick={() => setSelectedId(null)}
                />
                {/* Wrapper de centramento (CSS puro, sem conflito com Framer transforms) */}
                <div
                  style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', zIndex: 30, pointerEvents: 'none' }}
                >
                  <motion.div
                    style={{ pointerEvents: 'auto' }}
                    initial={{ opacity: 0, scale: 0.88, y: 18 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 10 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    onClick={e => e.stopPropagation()}
                  >
                    <DetailPanel chip={selectedChip} onClose={() => setSelectedId(null)} />
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Mobile: globo + grid 2 col ── */}
      <div className="md:hidden flex flex-col gap-4">
        <div className="relative mx-auto w-full" style={{ maxWidth: 300 }}>
          {[1.08, 1.28].map((s, i) => (
            <motion.div key={i}
              style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(192,192,192,0.06)', transform: `scale(${s})`, pointerEvents: 'none' }}
              animate={{ opacity: [0.5, 0.07, 0.5] }}
              transition={{ duration: 3.5 + i * 1.8, repeat: Infinity, delay: i * 1.2 }}
            />
          ))}
          <div className="w-full" style={{ aspectRatio: '1 / 1' }}><Globe3D /></div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 4 }}>
            <motion.div style={{ background: 'rgba(3,5,8,0.88)', border: '1px solid rgba(52,211,153,0.28)', backdropFilter: 'blur(16px)', borderRadius: 99, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <motion.div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }}
                animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.6, repeat: Infinity }} />
              <span style={{ fontSize: 8, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(52,211,153,0.8)' }}>Ao Vivo</span>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {chips.map((chip, i) => {
            const DeltaIcon  = chip.delta > 0.05 ? TrendingUp : chip.delta < -0.05 ? TrendingDown : Minus
            const deltaColor = chip.delta > 0.05 ? '#34d399' : chip.delta < -0.05 ? '#f87171' : '#94a3b8'
            const deltaStr   = Math.abs(chip.delta) < 10 ? Math.abs(chip.delta).toFixed(1) : Math.abs(chip.delta).toFixed(0)
            const deltaSign  = chip.delta > 0.05 ? '▲' : chip.delta < -0.05 ? '▼' : '→'
            const isOpen     = selectedId === chip.id
            return (
              <motion.div key={chip.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                onClick={e => { e.stopPropagation(); setSelectedId(prev => prev === chip.id ? null : chip.id) }}
                style={{ background: isOpen ? 'rgba(12,14,22,0.98)' : 'rgba(7,9,16,0.88)', border: `1px solid ${isOpen ? (chip.signal?.color ?? chip.color) + '44' : 'rgba(255,255,255,0.08)'}`, backdropFilter: 'blur(20px)', borderRadius: 16, padding: '12px 13px', cursor: 'pointer' }}
              >
                <p style={{ fontSize: 7.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.28)', marginBottom: 3 }}>{chip.label}</p>
                <p style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace', color: 'rgba(255,255,255,0.94)', lineHeight: 1, marginBottom: 6 }}>{chip.value}</p>
                <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: deltaColor, display: 'inline-flex', alignItems: 'center', gap: 3, background: deltaColor + '18', border: `1px solid ${deltaColor}28`, borderRadius: 99, padding: '2px 7px' }}>
                  <DeltaIcon style={{ width: 8, height: 8 }} />{deltaSign}{deltaStr}%
                </span>
                {chip.signal && <p style={{ fontSize: 8, fontWeight: 600, color: chip.signal.color, marginTop: 4 }}>{chip.signal.text}</p>}
                <AnimatePresence>
                  {isOpen && (chip.oque || chip.como) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden', marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}
                    >
                      {chip.oque && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.48)', lineHeight: 1.6, marginBottom: chip.como ? 7 : 0 }}>{chip.oque}</p>}
                      {chip.como && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.52)', lineHeight: 1.6 }}>{chip.como}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        <AnimatePresence>
          {selectedChip && (
            <div onClick={e => e.stopPropagation()}>
              <DetailPanel chip={selectedChip} onClose={() => setSelectedId(null)} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  2 — MARKET PANEL (B3 + Global)
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

      {/* 2 — BOLSA & EMPRESAS */}
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
