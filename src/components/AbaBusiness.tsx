'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RefreshCw, Send, ChevronRight, TrendingUp, TrendingDown, Minus,
  Zap, Play,
} from 'lucide-react'
import { useMarketData } from '@/hooks/useMarketData'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'

const Globe3D            = dynamic(() => import('@/components/business/Globe3D'),            { ssr: false })
const SectorScene3D      = dynamic(() => import('@/components/business/SectorScene3D'),      { ssr: false, loading: () => <div style={{ height: 540, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(200,200,200,0.22)', fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.3em' }}>INICIALIZANDO 3D…</div> })
const SkyscraperMarket3D = dynamic(() => import('@/components/business/SkyscraperMarket3D'), { ssr: false, loading: () => <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(200,200,200,0.22)', fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.3em' }}>INICIALIZANDO 3D…</div> })

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
// ── Helpers ────────────────────────────────────────────────────────────────
const fmtBRL = (n: number) =>
  new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
const fmtK      = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}k` : n.toString()
const pctColor  = (v: number) => v > 0 ? '#34d399' : v < 0 ? '#f87171' : 'rgba(192,192,192,0.45)'
const pctSign   = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`
const clamp     = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))

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
// ██  GLOBE HERO  (chips em órbita elíptica + painel de detalhe)
// ════════════════════════════════════════════════════════════════════════════

interface ChipData {
  id: string; label: string; value: string; unit?: string
  delta: number; color: string
  signal?: { text: string; color: string }
  oque?: string; como?: string
}

const ORB_AX   = 338
const ORB_AY   = 195
const ORB_DUR  = 80
const ORB_N    = 40

function makeOrbitKF(startAngle: number) {
  const times = Array.from({ length: ORB_N + 1 }, (_, i) => i / ORB_N)
  const x = times.map(t => Math.round(ORB_AX * Math.cos(startAngle + t * 2 * Math.PI)))
  const y = times.map(t => Math.round(ORB_AY * Math.sin(startAngle + t * 2 * Math.PI)))
  return { x, y, times }
}

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

function DetailPanel({ chip, onClose }: { chip: ChipData; onClose: () => void }) {
  const DeltaIcon  = chip.delta > 0.05 ? TrendingUp : chip.delta < -0.05 ? TrendingDown : Minus
  const deltaColor = chip.delta > 0.05 ? '#34d399' : chip.delta < -0.05 ? '#f87171' : '#94a3b8'
  const absDelta   = Math.abs(chip.delta)
  const deltaStr   = absDelta < 10 ? absDelta.toFixed(2) : absDelta.toFixed(0)
  const deltaLabel = chip.delta > 0.05 ? `▲ ${deltaStr}%` : chip.delta < -0.05 ? `▼ ${deltaStr}%` : '→ estável'
  const accent     = chip.signal?.color ?? chip.color

  return (
    <div style={{ background: 'rgba(4,4,4,0.97)', border: `1px solid ${accent}30`, backdropFilter: 'blur(40px)', borderRadius: 24, padding: '22px 24px 26px', boxShadow: `0 0 70px ${accent}12, 0 28px 60px rgba(0,0,0,0.92), inset 0 1px 0 rgba(200,200,200,0.06)`, position: 'relative', overflow: 'hidden', width: 540, maxWidth: '88vw' }}>
      <div style={{ position: 'absolute', top: 0, left: '5%', right: '5%', height: 1.5, background: `linear-gradient(90deg, transparent, ${accent}60, transparent)`, borderRadius: 2 }} />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-[0.03]" />
      <button onClick={onClose}
        style={{ position: 'absolute', right: 13, top: 13, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(200,200,200,0.05)', border: '1px solid rgba(200,200,200,0.10)', borderRadius: 7, cursor: 'pointer', color: 'rgba(200,200,200,0.40)', fontSize: 16, lineHeight: 1 }}
      >×</button>
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
      <div style={{ marginBottom: 16, padding: '10px 12px 8px', background: 'rgba(200,200,200,0.025)', border: '1px solid rgba(200,200,200,0.07)', borderRadius: 12, overflow: 'hidden' }}>
        <p style={{ fontSize: 7.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(195,195,195,0.22)', marginBottom: 7 }}>Variação 14 dias</p>
        <Sparkline id={chip.id} delta={chip.delta} color={accent} w={480} h={50} />
      </div>
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
      <div className="hidden md:block">
        <div className="relative w-full" style={{ height: 660 }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} overflow="visible">
            <ellipse cx="50%" cy="50%" rx={ORB_AX} ry={ORB_AY}
              fill="none" stroke="rgba(195,195,195,0.05)" strokeWidth="1" strokeDasharray="4 10" />
          </svg>
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 380, height: 380, zIndex: 2 }}>
            {[1.06, 1.18, 1.34, 1.52].map((s, i) => (
              <motion.div key={i}
                style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1px solid rgba(192,192,192,${0.07 - i * 0.014})`, transform: `scale(${s})`, pointerEvents: 'none' }}
                animate={{ opacity: [0.55, 0.06, 0.55] }}
                transition={{ duration: 3.4 + i * 1.7, repeat: Infinity, delay: i * 1.1, ease: 'easeInOut' }}
              />
            ))}
            <div style={{ width: '100%', height: '100%' }}><Globe3D /></div>
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
          {chips.map((chip, i) => (
            <OrbitalChip key={chip.id} chip={chip} index={i} isSelected={selectedId === chip.id}
              onClick={() => setSelectedId(prev => prev === chip.id ? null : chip.id)} />
          ))}
          <AnimatePresence>
            {selectedChip && (
              <>
                <motion.div
                  style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.68)', backdropFilter: 'blur(8px)', zIndex: 25 }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  onClick={() => setSelectedId(null)}
                />
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', zIndex: 30, pointerEvents: 'none' }}>
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
// ██  MARKET PANEL (B3 + Global)
// ════════════════════════════════════════════════════════════════════════════

function StockCard({ ticker, label, price, pct, showPrice = true }: {
  ticker: string; label: string; price?: number; pct: number; showPrice?: boolean
}) {
  const col    = pctColor(pct)
  const isBull = pct > 0.05
  const isBear = pct < -0.05
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }} transition={{ duration: 0.3 }}
      style={{
        background: isBull ? 'rgba(52,211,153,0.055)' : isBear ? 'rgba(248,113,113,0.055)' : 'rgba(5,5,5,0.88)',
        border: `1px solid ${col}22`,
        borderRadius: 14,
        padding: '11px 13px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: 'rgba(200,200,200,0.44)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>{ticker}</span>
        <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: col, background: col + '18', border: `1px solid ${col}28`, borderRadius: 99, padding: '1px 7px' }}>{pctSign(pct)}</span>
      </div>
      <p style={{ fontSize: 11, color: 'rgba(210,210,210,0.58)', marginBottom: showPrice ? 5 : 7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</p>
      {showPrice && price !== undefined && (
        <p style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace', color: 'rgba(235,235,235,0.92)', marginBottom: 7, lineHeight: 1 }}>R${fmtBRL(price)}</p>
      )}
      <Sparkline id={ticker} delta={pct} color={col} w={114} h={28} />
    </motion.div>
  )
}

function MarketPanel({ data }: { data: MarketData }) {
  const [mode, setMode] = useState<'3d' | 'cards'>('3d')
  const brStocks = data.stocks?.br ?? []
  const glStocks = data.stocks?.global ?? data.globalAgents?.slice(0, 4).map(a => ({ ticker: a.id.toUpperCase(), label: a.label, pct: a.delta })) ?? []
  const fallbackBR: StockBR[] = [
    { ticker: 'PETR4', label: 'Petrobras', price: 36.50, pct: 0 },
    { ticker: 'VALE3', label: 'Vale',       price: 58.20, pct: 0 },
    { ticker: 'ITUB4', label: 'Itaú',       price: 27.90, pct: 0 },
    { ticker: 'BBDC4', label: 'Bradesco',   price: 15.80, pct: 0 },
    { ticker: 'WEGE3', label: 'WEG',        price: 50.10, pct: 0 },
  ]
  const allGlobal = [
    ...glStocks.slice(0, 4),
    { ticker: 'XAU',  label: 'Ouro',      pct: data.commodities.gold?.delta ?? 0 },
    { ticker: 'CL=F', label: 'Petróleo',  pct: data.commodities.oil?.delta  ?? 0 },
  ]
  const brList = brStocks.length > 0 ? brStocks : fallbackBR

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 8.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(195,195,195,0.28)' }}>Bolsa BR · B3</span>
            <motion.div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }}
              animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {([{ id: '3d', label: '3D' }, { id: 'cards', label: 'CARDS' }] as { id: '3d' | 'cards'; label: string }[]).map(({ id, label }) => (
              <button key={id} onClick={() => setMode(id)}
                style={{ padding: '4px 12px', borderRadius: 99, fontSize: 8, fontFamily: 'monospace', letterSpacing: '0.18em', cursor: 'pointer', transition: 'all 0.15s', fontWeight: mode === id ? 700 : 400, background: mode === id ? 'rgba(192,192,192,0.12)' : 'rgba(200,200,200,0.04)', border: `1px solid ${mode === id ? 'rgba(192,192,192,0.28)' : 'rgba(200,200,200,0.07)'}`, color: mode === id ? 'rgba(228,228,228,0.85)' : 'rgba(200,200,200,0.32)' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {mode === '3d' ? (
            <motion.div key="3d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
              <SkyscraperMarket3D stocks={brList} />
            </motion.div>
          ) : (
            <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(138px, 1fr))', gap: 8 }}>
                {brList.map(s => <StockCard key={s.ticker} ticker={s.ticker} label={s.label} price={(s as StockBR).price} pct={s.pct} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 8.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(195,195,195,0.28)' }}>Mercados Globais</span>
          <motion.div style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa' }}
            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.4, repeat: Infinity }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
          {allGlobal.map(s => <StockCard key={s.ticker} ticker={s.ticker} label={s.label} pct={s.pct} showPrice={false} />)}
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  DOMAIN NAV — barra de navegação dos 9 temas
// ════════════════════════════════════════════════════════════════════════════

const DOMAIN_NAV = [
  { num: '01', label: 'Economia',        id: 'domain-01' },
  { num: '02', label: 'Mercado & Bolsa', id: 'domain-02' },
  { num: '03', label: 'Empresas',        id: 'domain-03' },
  { num: '04', label: 'Commodities',     id: 'domain-04' },
  { num: '05', label: 'Finanças',        id: 'domain-05' },
  { num: '06', label: 'Marketing',       id: 'domain-06' },
  { num: '07', label: 'Sust.',           id: 'domain-07' },
  { num: '08', label: 'Liderança',       id: 'domain-08' },
  { num: '09', label: 'Business',        id: 'domain-09' },
]

function DomainNav() {
  const [active, setActive] = useState<string | null>(null)

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 72
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    setActive(id)
  }

  return (
    <div style={{
      display: 'flex', gap: 6, overflowX: 'auto', padding: '2px 0 8px',
      scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
    }}>
      {DOMAIN_NAV.map(d => (
        <button key={d.id} onClick={() => scrollTo(d.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 13px', borderRadius: 99, flexShrink: 0, cursor: 'pointer',
            background: active === d.id ? 'rgba(200,200,200,0.11)' : 'rgba(200,200,200,0.03)',
            border: `1px solid ${active === d.id ? 'rgba(200,200,200,0.22)' : 'rgba(200,200,200,0.07)'}`,
            transition: 'all 0.15s',
          }}
        >
          <span style={{ fontSize: 7, fontFamily: 'monospace', color: 'rgba(195,195,195,0.25)', letterSpacing: '0.12em' }}>{d.num}</span>
          <span style={{ fontSize: 8.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: active === d.id ? 700 : 400, color: active === d.id ? 'rgba(220,220,220,0.88)' : 'rgba(195,195,195,0.42)', whiteSpace: 'nowrap' }}>{d.label}</span>
        </button>
      ))}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  DOMAIN CARD — base wrapper
// ════════════════════════════════════════════════════════════════════════════

interface KPIItem { label: string; value: string; delta?: number; sub?: string; color?: string }

function DomainCard({
  num, label, badge, badgeColor, kpis, decisao, decisaoColor, children,
}: {
  num: string; label: string
  badge?: string; badgeColor?: string
  kpis?: KPIItem[]
  decisao: string; decisaoColor: string
  children?: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.38 }}
      style={{ background: 'rgba(5,5,5,0.94)', border: '1px solid rgba(200,200,200,0.07)', borderRadius: 18, overflow: 'hidden' }}
    >
      {/* Header */}
      <div style={{ padding: '13px 18px 11px', borderBottom: '1px solid rgba(200,200,200,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 7.5, fontFamily: 'monospace', color: 'rgba(195,195,195,0.18)', letterSpacing: '0.2em' }}>{num}</span>
        <div style={{ width: 1, height: 10, background: 'rgba(200,200,200,0.10)', flexShrink: 0 }} />
        <span style={{ fontSize: 8.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(195,195,195,0.42)', fontWeight: 700 }}>{label}</span>
        {badge && badgeColor && (
          <span style={{ marginLeft: 'auto', fontSize: 7, fontFamily: 'monospace', fontWeight: 700, color: badgeColor, background: badgeColor + '18', border: `1px solid ${badgeColor}28`, borderRadius: 99, padding: '2px 9px', textTransform: 'uppercase', letterSpacing: '0.14em' }}>{badge}</span>
        )}
      </div>
      {/* KPIs */}
      {kpis && kpis.length > 0 && (
        <div style={{ padding: '16px 18px 14px', display: 'grid', gridTemplateColumns: `repeat(${Math.min(kpis.length, 4)}, 1fr)`, gap: 16, borderBottom: children ? '1px solid rgba(200,200,200,0.05)' : 'none' }}>
          {kpis.map(k => {
            const col = k.color ?? (k.delta !== undefined ? pctColor(k.delta) : 'rgba(235,235,235,0.88)')
            return (
              <div key={k.label}>
                <p style={{ fontSize: 7.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(195,195,195,0.24)', marginBottom: 5 }}>{k.label}</p>
                <p style={{ fontSize: 22, fontWeight: 800, fontFamily: 'monospace', color: 'rgba(235,235,235,0.90)', lineHeight: 1, marginBottom: 4 }}>{k.value}</p>
                {k.sub && <p style={{ fontSize: 9, fontFamily: 'monospace', color: col, fontWeight: k.delta !== undefined ? 700 : 400 }}>{k.sub}</p>}
              </div>
            )
          })}
        </div>
      )}
      {children && <div style={{ borderBottom: '1px solid rgba(200,200,200,0.05)' }}>{children}</div>}
      {/* DECISÃO */}
      <div style={{ padding: '11px 18px 13px', display: 'flex', alignItems: 'flex-start', gap: 9 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: decisaoColor, marginTop: 4, flexShrink: 0 }} />
        <p style={{ fontSize: 11.5, color: 'rgba(210,210,210,0.58)', lineHeight: 1.65 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 7.5, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(195,195,195,0.22)', marginRight: 8 }}>DECISÃO</span>
          {decisao}
        </p>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  01 — ECONOMIA
// ════════════════════════════════════════════════════════════════════════════

function EconomiaCard({ data }: { data: MarketData }) {
  const { selic, ipca, usdBrl, pib } = data.macro
  const signal =
    selic.value > 13 && ipca.value > 5 ? { label: 'APERTO', color: '#f87171' } :
    selic.value > 10 || ipca.value > 4  ? { label: 'CAUTELA', color: '#fbbf24' } :
    { label: 'ESTÁVEL', color: '#34d399' }
  const decisao =
    selic.value > 13
      ? `SELIC ${selic.value}% + IPCA ${ipca.value}% comprimem margens. Revise custo de capital, negocie prazos com fornecedores e evite novos financiamentos de longo prazo.`
      : selic.value > 10
      ? `SELIC ${selic.value}% — crédito ainda caro. Priorize capital próprio para expansão. Câmbio R$${usdBrl.value} exige atenção em insumos importados.`
      : `Juros controlados e PIB projetado em ${pib.value}% — janela para expansão. Acesse BNDES e Pronampe antes que o ciclo mude.`
  return (
    <DomainCard num="01" label="Economia" badge={signal.label} badgeColor={signal.color}
      kpis={[
        { label: 'SELIC',   value: `${selic.value}%`,  sub: 'ao ano · COPOM',   color: selic.value > 13 ? '#f87171' : selic.value > 10 ? '#fbbf24' : '#34d399' },
        { label: 'IPCA',    value: `${ipca.value}%`,   sub: '12m · IBGE',        color: ipca.value > 5 ? '#f87171' : ipca.value > 3.5 ? '#fbbf24' : '#34d399' },
        { label: 'USD/BRL', value: `R$${usdBrl.value}`, sub: pctSign(usdBrl.delta), delta: usdBrl.delta },
        { label: 'PIB',     value: `${pib.value}%`,    sub: 'projeção Focus',    delta: pib.delta },
      ]}
      decisao={decisao} decisaoColor={signal.color}
    />
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  02 — MERCADO & BOLSA
// ════════════════════════════════════════════════════════════════════════════

function MercadoBolsaCard({ data }: { data: MarketData }) {
  const ibov    = data.stocks?.ibov
  const ibovPct = ibov?.pct ?? 0
  const agents  = data.globalAgents ?? []
  const signal  =
    ibovPct < -1.5 ? { label: 'QUEDA',   color: '#f87171' } :
    ibovPct >  1.5 ? { label: 'ALTA',    color: '#34d399' } :
    { label: 'LATERAL', color: '#fbbf24' }
  const decisao =
    ibovPct < -1.5
      ? 'Bolsa em queda — risco de contração de crédito e fuga de capital. Revise valuation de ativos e monitore posições em renda variável.'
      : ibovPct > 1.5
      ? `IBOVESPA em alta (+${ibovPct.toFixed(1)}%) — apetite por risco elevado. Boa janela para captação e M&A via equity.`
      : 'Mercado lateral — aguarde definição de tendência antes de decisões estruturais de capital. Foco em eficiência operacional.'
  const kpis: KPIItem[] = [
    { label: 'IBOVESPA', value: fmtK(ibov?.value ?? 128000), sub: pctSign(ibovPct), delta: ibovPct },
    ...agents.slice(0, 2).map(a => ({
      label: a.label.toUpperCase().slice(0, 10),
      value: pctSign(a.delta),
      sub: a.impact.slice(0, 20),
      delta: a.delta,
    })),
    { label: 'SENTIMENTO', value: signal.label, sub: 'consenso do dia', color: signal.color },
  ]
  return (
    <DomainCard num="02" label="Mercado & Bolsa" badge={signal.label} badgeColor={signal.color}
      kpis={kpis.slice(0, 4)} decisao={decisao} decisaoColor={signal.color}
    />
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  04 — COMMODITIES
// ════════════════════════════════════════════════════════════════════════════

function CommoditiesCard({ data }: { data: MarketData }) {
  const oil    = data.commodities.oil
  const gold   = data.commodities.gold
  const silver = data.commodities.silver
  const oilDelta  = oil?.delta ?? 0
  const goldDelta = gold?.delta ?? 0
  const signal =
    oilDelta > 3  ? { label: 'PRESSÃO', color: '#f87171' } :
    goldDelta > 2 ? { label: 'ALERTA',  color: '#fbbf24' } :
    { label: 'ESTÁVEL', color: '#34d399' }
  const decisao =
    oilDelta > 2
      ? `Petróleo +${oilDelta.toFixed(1)}% pressiona frete, energia e plásticos. Renegocie contratos logísticos e revise repasse de custos na precificação agora.`
      : goldDelta > 1.5
      ? 'Alta do ouro sinaliza aversão a risco global. Revise exposição cambial e considere hedge para operações em dólar.'
      : 'Commodities estáveis — janela para fixar contratos de insumos ao preço atual antes de nova volatilidade.'
  return (
    <DomainCard num="04" label="Commodities" badge={signal.label} badgeColor={signal.color}
      kpis={[
        { label: 'PETRÓLEO', value: oil?.value  ? `$${oil.value}`    : '—', sub: oil?.delta    !== undefined ? pctSign(oil.delta)    : '—', delta: oilDelta },
        { label: 'OURO',     value: gold?.value ? `$${gold.value}`   : '—', sub: gold?.delta   !== undefined ? pctSign(gold.delta)   : '—', delta: goldDelta },
        { label: 'PRATA',    value: silver?.value ? `$${silver.value}` : '—', sub: silver?.delta !== undefined ? pctSign(silver.delta) : '—', delta: silver?.delta ?? 0 },
        { label: 'ÍNDICE',   value: 'BCom', sub: 'commodities global', color: 'rgba(195,195,195,0.45)' },
      ]}
      decisao={decisao} decisaoColor={signal.color}
    />
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  05 — FINANÇAS
// ════════════════════════════════════════════════════════════════════════════

function FinancasCard({ data }: { data: MarketData }) {
  const rates = data.creditRates
  const selic = data.macro.selic.value
  const items = rates ? [
    { label: 'PJ Total',  value: rates.total?.value     ?? 0 },
    { label: 'Comércio',  value: rates.comercio?.value  ?? 0 },
    { label: 'Serviços',  value: rates.servicos?.value  ?? 0 },
    { label: 'Indústria', value: rates.industria?.value ?? 0 },
    { label: 'Agro',      value: rates.agro?.value      ?? 0 },
  ] : []
  const valid   = items.filter(i => i.value > 0)
  const avgRate = valid.length > 0 ? valid.reduce((s, i) => s + i.value, 0) / valid.length : selic + 15
  const signal  =
    avgRate > 28 ? { label: 'CARO',       color: '#f87171' } :
    avgRate > 18 ? { label: 'MODERADO',   color: '#fbbf24' } :
    { label: 'ACESSÍVEL', color: '#34d399' }
  const decisao =
    avgRate > 28
      ? `Crédito PJ médio ${avgRate.toFixed(0)}% a.a. — evite financiar capital de giro com dívida bancária. Use adiantamento de recebíveis (FIDC/factoring).`
      : avgRate > 18
      ? 'Taxas moderadas — acesse BNDES e linhas com FGI para reduzir spread. Compare antes de contratar.'
      : 'Crédito acessível — refinancie dívidas caras e estenda prazo de capital de giro enquanto as taxas permitem.'
  const maxR = valid.length > 0 ? Math.max(...valid.map(i => i.value), 1) : 40
  return (
    <DomainCard num="05" label="Finanças" badge={signal.label} badgeColor={signal.color}
      kpis={[
        { label: 'SELIC',      value: `${selic}%`,              sub: 'custo-base BCB',  color: selic > 13 ? '#f87171' : '#fbbf24' },
        { label: 'SPREAD PJ',  value: `+${(avgRate - selic).toFixed(0)}pp`, sub: 'acima da SELIC', color: 'rgba(195,195,195,0.55)' },
        { label: 'TAXA MÉDIA', value: `${avgRate.toFixed(1)}%`, sub: 'crédito PJ a.a.', color: signal.color },
      ]}
      decisao={decisao} decisaoColor={signal.color}
    >
      {valid.length > 0 && (
        <div style={{ padding: '10px 18px 14px' }}>
          {valid.map((item, idx) => {
            const rc = item.value > 28 ? '#f87171' : item.value > 18 ? '#fbbf24' : '#34d399'
            return (
              <motion.div key={item.label}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                viewport={{ once: true }} transition={{ delay: idx * 0.06 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: idx < valid.length - 1 ? 8 : 0 }}
              >
                <span style={{ fontSize: 8.5, fontFamily: 'monospace', color: 'rgba(195,195,195,0.30)', width: 64, flexShrink: 0 }}>{item.label}</span>
                <div style={{ flex: 1, height: 5, background: 'rgba(200,200,200,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }} whileInView={{ width: `${(item.value / maxR) * 100}%` }}
                    viewport={{ once: true }} transition={{ duration: 0.9, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${rc}50, ${rc})` }}
                  />
                </div>
                <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: rc, width: 44, textAlign: 'right', flexShrink: 0 }}>{item.value}%</span>
              </motion.div>
            )
          })}
        </div>
      )}
    </DomainCard>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  06 — MARKETING
// ════════════════════════════════════════════════════════════════════════════

function MarketingCard({ data }: { data: MarketData }) {
  const { ipca, pib, selic } = data.macro
  const retail = data.sectors.find(s => s.id === 'retail')
  const media  = data.sectors.find(s => s.id === 'media')
  const icc    = Math.round(clamp(60 + pib.value * 4 - ipca.value * 3 - (selic.value - 10) * 1.5, 20, 90))
  const iccCol = icc >= 65 ? '#34d399' : icc >= 50 ? '#fbbf24' : '#f87171'
  const signal = icc >= 65 ? { label: 'AQUECIDA', color: '#34d399' } : icc >= 50 ? { label: 'MODERADA', color: '#fbbf24' } : { label: 'RETRAÍDA', color: '#f87171' }
  const decisao =
    icc >= 65
      ? 'Confiança elevada — invista em aquisição agora. CAC tende a ser mais eficiente em ciclos de expansão de consumo.'
      : icc >= 50
      ? `IPCA ${ipca.value}% comprime poder de compra. Enfatize custo-benefício, parcelamento e valor percebido na comunicação.`
      : 'Demanda retraída — priorize retenção e LTV sobre aquisição. Campanhas de fidelização têm ROI superior neste ciclo.'
  return (
    <DomainCard num="06" label="Marketing" badge={signal.label} badgeColor={signal.color}
      kpis={[
        { label: 'CONF. CONSUMIDOR', value: String(icc),                sub: 'índice proxy IPB',  color: iccCol },
        { label: 'DEMANDA ONLINE',   value: String(retail?.heat ?? 55), sub: '/100 · heat score', color: pctColor(retail?.change ?? 0) },
        { label: 'PRESSÃO PREÇO',    value: `${ipca.value}%`,           sub: 'IPCA 12m',          color: ipca.value > 5 ? '#f87171' : '#fbbf24' },
        { label: 'MÍDIA DIGITAL',    value: String(media?.heat ?? 58),  sub: '/100 · heat score', color: pctColor(media?.change ?? 0) },
      ]}
      decisao={decisao} decisaoColor={signal.color}
    />
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  07 — SUSTENTABILIDADE
// ════════════════════════════════════════════════════════════════════════════

function SustentabilidadeCard({ data }: { data: MarketData }) {
  const energy = data.sectors.find(s => s.id === 'energy')
  const agro   = data.sectors.find(s => s.id === 'agro')
  const green  = Math.round(clamp(((energy?.heat ?? 55) + (agro?.heat ?? 50)) / 2 + 5, 10, 95))
  const rc     = green < 50 ? '#f87171' : green < 70 ? '#fbbf24' : '#34d399'
  const risk   = green < 50 ? 'ALTO' : green < 70 ? 'MÉDIO' : 'BAIXO'
  const decisao =
    green < 50
      ? 'Risco ESG elevado — acesse crédito verde (LCA, CRA) para reduzir custo de capital e ampliar acesso a investidores institucionais.'
      : green < 70
      ? 'Perfil ESG moderado. Implemente relatório GRI/SASB para acessar capital verde com spread 15–25% menor que linhas convencionais.'
      : 'Bom score ESG — capitalize na narrativa para green bonds e fundos de impacto com menor custo de capital.'
  return (
    <DomainCard num="07" label="Sustentabilidade" badge={`RISCO ${risk}`} badgeColor={rc}
      kpis={[
        { label: 'GREEN SCORE',   value: String(green),                 sub: '/100 · proxy IPB',  color: rc },
        { label: 'ENERGIA',       value: String(energy?.heat ?? '—'),   sub: '/100 · heat score', color: pctColor(energy?.change ?? 0) },
        { label: 'AGRO SUST.',    value: String(agro?.heat ?? '—'),     sub: '/100 · heat score', color: pctColor(agro?.change ?? 0) },
        { label: 'CRÉDITO VERDE', value: 'LCA/CRA',                     sub: 'acesso disponível', color: '#34d399' },
      ]}
      decisao={decisao} decisaoColor={rc}
    />
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  08 — LIDERANÇA
// ════════════════════════════════════════════════════════════════════════════

function LiderancaCard({ data }: { data: MarketData }) {
  const { ipca, pib } = data.macro
  const tech     = data.sectors.find(s => s.id === 'tech')
  const services = data.sectors.find(s => s.id === 'services')
  const desemp   = clamp(6.5 - pib.value * 0.4, 4.5, 12).toFixed(1)
  const salPress = ipca.value > 4.5 ? 'ALTA' : ipca.value > 3 ? 'MÉDIA' : 'BAIXA'
  const salCol   = ipca.value > 4.5 ? '#f87171' : ipca.value > 3 ? '#fbbf24' : '#34d399'
  const signal   = ipca.value > 5 ? { label: 'PRESSÃO SAL.', color: '#f87171' } : pib.value > 2 ? { label: 'AQUECIDO', color: '#fbbf24' } : { label: 'ESTÁVEL', color: '#34d399' }
  const decisao  =
    ipca.value > 5
      ? `IPCA ${ipca.value}% gera pressão salarial no dissídio. Antecipe revisões e implemente benefícios não-monetários para reter talentos sem pressionar folha.`
      : pib.value > 2
      ? 'PIB em expansão aquece o mercado de talentos. Acelere contratações estratégicas antes que o mercado fique mais restrito e caro.'
      : 'Mercado em equilíbrio — boa janela para contratar talentos a custo moderado. Priorize roles em eficiência e tecnologia.'
  return (
    <DomainCard num="08" label="Liderança" badge={signal.label} badgeColor={signal.color}
      kpis={[
        { label: 'DESEMPREGO',   value: `${desemp}%`,                    sub: 'proxy PNAD/IBGE', color: Number(desemp) > 8 ? '#f87171' : '#34d399' },
        { label: 'PRESSÃO SAL.', value: salPress,                         sub: `IPCA ${ipca.value}%`, color: salCol },
        { label: 'DEMANDA TECH', value: String(tech?.heat ?? '—'),        sub: '/100 · heat',    color: pctColor(tech?.change ?? 0) },
        { label: 'SERVIÇOS',     value: String(services?.heat ?? '—'),    sub: '/100 · empregab.', color: pctColor(services?.change ?? 0) },
      ]}
      decisao={decisao} decisaoColor={signal.color}
    />
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  09 — BUSINESS (Inteligência Setorial)
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
  const analysis = SECTOR_ANALYSIS[sector.id]
  const h        = sector.heat
  const signal   =
    h >= 75 ? { label: 'OPORTUNIDADE', color: '#34d399' } :
    h >= 50 ? { label: 'NEUTRO',       color: '#c0c0c0' } :
    h >= 30 ? { label: 'CAUTELA',      color: '#fbbf24' } :
              { label: 'ALTO RISCO',   color: '#f87171' }
  const chgColor = pctColor(sector.change)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay, duration: 0.4 }}
      style={{ background: 'rgba(5,5,5,0.94)', border: `1px solid ${signal.color}1a`, borderRadius: 18, overflow: 'hidden', position: 'relative' }}
    >
      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${signal.color}70, transparent)` }} />
      <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid rgba(200,200,200,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 7.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: signal.color, background: signal.color + '16', border: `1px solid ${signal.color}28`, borderRadius: 99, padding: '2px 8px', fontWeight: 700, flexShrink: 0 }}>{signal.label}</span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(228,228,228,0.82)' }}>{sector.label}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 22, fontWeight: 800, fontFamily: 'monospace', color: signal.color, lineHeight: 1 }}>{h}</span>
            <span style={{ fontSize: 8.5, fontFamily: 'monospace', color: 'rgba(200,200,200,0.22)', alignSelf: 'flex-end', marginBottom: 2 }}>/100</span>
            <span style={{ fontSize: 9.5, fontFamily: 'monospace', fontWeight: 700, color: chgColor, background: chgColor + '16', border: `1px solid ${chgColor}26`, borderRadius: 99, padding: '2px 7px' }}>{sector.change >= 0 ? '+' : ''}{sector.change}%</span>
          </div>
        </div>
        <div style={{ height: 4, background: 'rgba(200,200,200,0.07)', borderRadius: 2, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }} whileInView={{ width: `${h}%` }} viewport={{ once: true }}
            transition={{ duration: 1.1, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: '100%', borderRadius: 2, background: `linear-gradient(90deg, ${signal.color}40, ${signal.color}cc)` }}
          />
        </div>
      </div>
      {analysis && (
        <div style={{ padding: '12px 16px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          {([
            { label: 'Oportunidades', text: analysis.oportunidade, color: '#34d399' },
            { label: 'Riscos',        text: analysis.risco,        color: '#f87171' },
            { label: 'Como Atuar',    text: analysis.como,         color: '#c0c0c0' },
          ] as { label: string; text: string; color: string }[]).map(({ label, text, color }) => (
            <div key={label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <p style={{ fontSize: 7, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.18em', color: color + 'aa', fontWeight: 700 }}>{label}</p>
              </div>
              <p style={{ fontSize: 11, color: 'rgba(208,208,208,0.46)', lineHeight: 1.64, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>{text}</p>
            </div>
          ))}
        </div>
      )}
      {analysis?.quem && (
        <div style={{ padding: '8px 16px 10px', borderTop: '1px solid rgba(200,200,200,0.04)' }}>
          <span style={{ fontSize: 7.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.16em', color: 'rgba(200,200,200,0.22)' }}>Quem se beneficia: </span>
          <span style={{ fontSize: 10, color: 'rgba(200,200,200,0.34)' }}>{analysis.quem}</span>
        </div>
      )}
    </motion.div>
  )
}

function BusinessCard({ sectors }: { sectors: Sector[] }) {
  const [mode, setMode] = useState<'3d' | 'cards'>('3d')
  const sorted = [...sectors].sort((a, b) => b.heat - a.heat)
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginBottom: 14 }}>
        {([{ id: '3d', label: '3D INTERATIVO' }, { id: 'cards', label: 'CARDS' }] as { id: 'cards' | '3d'; label: string }[]).map(({ id, label }) => (
          <button key={id} onClick={() => setMode(id)}
            style={{ padding: '5px 16px', borderRadius: 99, fontSize: 8.5, fontFamily: 'monospace', letterSpacing: '0.18em', cursor: 'pointer', transition: 'all 0.18s', fontWeight: mode === id ? 700 : 400, background: mode === id ? 'rgba(200,200,200,0.10)' : 'rgba(200,200,200,0.03)', border: `1px solid ${mode === id ? 'rgba(200,200,200,0.22)' : 'rgba(200,200,200,0.07)'}`, color: mode === id ? 'rgba(220,220,220,0.85)' : 'rgba(200,200,200,0.28)', boxShadow: 'none' }}>
            {label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {mode === '3d' ? (
          <motion.div key="3d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
            <SectorScene3D sectors={sorted} />
          </motion.div>
        ) : (
          <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
              {sorted.map((s, i) => <SectorCard key={s.id} sector={s} delay={i * 0.05} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  PLANO DE AÇÃO IA
// ════════════════════════════════════════════════════════════════════════════

function ActionPlan({ data, userSector }: { data: MarketData; userSector?: string }) {
  const [plan, setPlan]       = useState('')
  const [loading, setLoading] = useState(false)
  const [typed, setTyped]     = useState('')
  const typingRef             = useRef<ReturnType<typeof setInterval> | null>(null)
  const scrollRef             = useRef<HTMLDivElement>(null)

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
// ██  IA MARKET INTELLIGENCE
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
// ██  MAIN
// ════════════════════════════════════════════════════════════════════════════

export default function AbaBusiness() {
  const { marketData: rawData, refetch, lastUpdated } = useMarketData() as {
    marketData: MarketData | null; refetch?: () => void; lastUpdated?: string
  }
  const [userSector, setUserSector] = useState<string>()
  const [refreshing, setRefreshing] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    const sb = createClient()
    sb.from('workspace_profiles').select('setor').eq('user_id', user.id).maybeSingle()
      .then(({ data: d }: { data: { setor?: string } | null }) => { if (d?.setor) setUserSector(d.setor) })
  }, [user?.id])

  const data = useMemo(() => rawData as MarketData | null, [rawData])

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
    <motion.div className="relative flex flex-col gap-6 pb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* Nav — 9 domínios */}
      <DomainNav />

      {/* HERO — Globe ao Vivo */}
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

      {/* Domains 01 + 02 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 440px), 1fr))', gap: 14 }}>
        <div id="domain-01"><EconomiaCard data={data} /></div>
        <div id="domain-02"><MercadoBolsaCard data={data} /></div>
      </div>

      {/* Domain 03 — Empresas */}
      <div id="domain-03">
        <SectionLabel label="03 · Empresas" sub="B3 + mercados globais" />
        <MarketPanel data={data} />
      </div>

      {/* Domains 04 – 08 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 440px), 1fr))', gap: 14 }}>
        <div id="domain-04"><CommoditiesCard data={data} /></div>
        <div id="domain-05"><FinancasCard data={data} /></div>
        <div id="domain-06"><MarketingCard data={data} /></div>
        <div id="domain-07"><SustentabilidadeCard data={data} /></div>
        <div id="domain-08"><LiderancaCard data={data} /></div>
      </div>

      {/* Domain 09 — Business */}
      <div id="domain-09">
        <SectionLabel label="09 · Business" sub="análise competitiva setorial · onde atacar · onde defender" />
        <BusinessCard sectors={data.sectors} />
      </div>

      {/* Executive IA */}
      <div>
        <SectionLabel label="Executive Intelligence · IA" sub="análise e plano de ação com dados reais" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 440px), 1fr))', gap: 14 }}>
          <ActionPlan data={data} userSector={userSector} />
          <IaAdvisor data={data} userSector={userSector} />
        </div>
      </div>

    </motion.div>
  )
}
