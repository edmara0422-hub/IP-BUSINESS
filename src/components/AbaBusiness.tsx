'use client'

import { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RefreshCw, Send, ChevronRight, TrendingUp, TrendingDown, Minus,
  Zap, Play,
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

// ── Helpers ────────────────────────────────────────────────────────────────
const fmtK     = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}k` : n.toString()
const pctColor = (v: number) => v > 0 ? '#34d399' : v < 0 ? '#f87171' : 'rgba(192,192,192,0.45)'
const pctSign  = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`
const clamp    = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))

// ── Audio Button (Web Speech API) ─────────────────────────────────────────
function AudioButton({ text, color = 'rgba(192,192,192,0.35)' }: { text: string; color?: string }) {
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    if (!('speechSynthesis' in window)) return
    if (playing) {
      window.speechSynthesis.cancel()
      setPlaying(false)
      return
    }
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = 'pt-BR'
    utt.rate = 1.05
    utt.pitch = 1
    const voices = window.speechSynthesis.getVoices()
    const ptBr = voices.find(v => v.lang === 'pt-BR') ?? voices.find(v => v.lang.startsWith('pt'))
    if (ptBr) utt.voice = ptBr
    utt.onend = () => setPlaying(false)
    utt.onerror = () => setPlaying(false)
    window.speechSynthesis.speak(utt)
    setPlaying(true)
  }

  return (
    <button onClick={toggle}
      title={playing ? 'Parar áudio' : 'Ouvir análise'}
      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', background: playing ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${playing ? '#34d39940' : 'rgba(200,200,200,0.1)'}`, borderRadius: 7, cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}>
      {playing ? (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <rect x="2" y="1" width="3" height="10" rx="1" fill="#34d399" />
          <rect x="7" y="1" width="3" height="10" rx="1" fill="#34d399" />
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M3 2L10 6L3 10V2Z" fill={color} />
        </svg>
      )}
      <span style={{ fontSize: 7, fontFamily: 'monospace', color: playing ? '#34d399' : color, letterSpacing: '0.1em' }}>{playing ? 'PARAR' : 'OUVIR'}</span>
    </button>
  )
}

// ── Sparkline ──────────────────────────────────────────────────────────────
const Sparkline = memo(function Sparkline({ id, delta, color, w = 56, h = 20 }: { id: string; delta: number; color: string; w?: number; h?: number }) {
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
})

// ── Section Label ──────────────────────────────────────────────────────────
const SectionLabel = memo(function SectionLabel({ label, sub }: { label: string; sub?: string }) {
  return (
    <motion.div initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5 }}
      className="flex items-center gap-3 mb-4">
      <div style={{ width: 3, height: 20, borderRadius: 99, flexShrink: 0, background: 'rgba(210,210,210,0.55)', boxShadow: '0 0 10px rgba(210,210,210,0.18)' }} />
      <span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(228,228,228,0.72)' }}>{label}</span>
      {sub && <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(192,192,192,0.30)', marginLeft: 2 }}>{sub}</span>}
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(192,192,192,0.18), transparent)' }} />
    </motion.div>
  )
})

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
        <Sparkline id={chip.id} delta={chip.delta} color={accent} w={280} h={44} />
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

function DetailPanelMobile({ chip, onClose }: { chip: ChipData; onClose: () => void }) {
  const DeltaIcon  = chip.delta > 0.05 ? TrendingUp : chip.delta < -0.05 ? TrendingDown : Minus
  const deltaColor = chip.delta > 0.05 ? '#34d399' : chip.delta < -0.05 ? '#f87171' : '#94a3b8'
  const absDelta   = Math.abs(chip.delta)
  const deltaStr   = absDelta < 10 ? absDelta.toFixed(2) : absDelta.toFixed(0)
  const deltaLabel = chip.delta > 0.05 ? `▲ ${deltaStr}%` : chip.delta < -0.05 ? `▼ ${deltaStr}%` : '→ estável'
  const accent     = chip.signal?.color ?? chip.color
  return (
    <div style={{ background: 'rgba(4,4,4,0.98)', border: `1px solid ${accent}35`, backdropFilter: 'blur(40px)', borderRadius: '20px 20px 0 0', padding: '16px 18px 28px', boxShadow: `0 -20px 60px rgba(0,0,0,0.96), 0 0 40px ${accent}10`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1.5, background: `linear-gradient(90deg, transparent, ${accent}55, transparent)` }} />
      <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(200,200,200,0.18)', margin: '0 auto 14px' }} />
      <button onClick={onClose} style={{ position: 'absolute', right: 14, top: 14, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(200,200,200,0.06)', border: '1px solid rgba(200,200,200,0.12)', borderRadius: 8, cursor: 'pointer', color: 'rgba(200,200,200,0.45)', fontSize: 17 }}>×</button>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14, paddingRight: 36 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 8, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.24em', color: 'rgba(195,195,195,0.30)', marginBottom: 5 }}>{chip.label}</p>
          <p style={{ fontSize: 30, fontWeight: 800, fontFamily: 'monospace', color: 'rgba(235,235,235,0.97)', lineHeight: 1 }}>{chip.value}</p>
          {chip.unit && <p style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(195,195,195,0.28)', marginTop: 4 }}>{chip.unit}</p>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, paddingTop: 2 }}>
          <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: deltaColor, background: deltaColor + '18', border: `1px solid ${deltaColor}2e`, borderRadius: 99, padding: '3px 9px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <DeltaIcon style={{ width: 10, height: 10 }} />{deltaLabel}
          </span>
          {chip.signal && <span style={{ fontSize: 9, fontWeight: 600, color: chip.signal.color, background: chip.signal.color + '18', border: `1px solid ${chip.signal.color}28`, borderRadius: 99, padding: '2px 9px' }}>{chip.signal.text}</span>}
        </div>
      </div>
      <div style={{ marginBottom: 12, padding: '9px 12px 7px', background: 'rgba(200,200,200,0.025)', border: '1px solid rgba(200,200,200,0.07)', borderRadius: 12 }}>
        <p style={{ fontSize: 7, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(195,195,195,0.22)', marginBottom: 6 }}>Variação 14 dias</p>
        <Sparkline id={chip.id} delta={chip.delta} color={accent} w={320} h={38} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
        {chip.oque && (
          <div style={{ padding: '10px 12px', background: 'rgba(200,200,200,0.025)', border: '1px solid rgba(200,200,200,0.07)', borderRadius: 12 }}>
            <p style={{ fontSize: 7, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(195,195,195,0.24)', marginBottom: 5 }}>O que é</p>
            <p style={{ fontSize: 12, color: 'rgba(215,215,215,0.55)', lineHeight: 1.65 }}>{chip.oque}</p>
          </div>
        )}
        {chip.como && (
          <div style={{ padding: '10px 12px', background: `${accent}08`, border: `1px solid ${accent}1a`, borderRadius: 12 }}>
            <p style={{ fontSize: 7, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.18em', color: `${accent}80`, marginBottom: 5 }}>Impacto</p>
            <p style={{ fontSize: 12, color: 'rgba(215,215,215,0.57)', lineHeight: 1.65 }}>{chip.como}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Globe Audio Bar — waveform heights determinísticos (seed por índice) ───
const WAVE_H = Array.from({ length: 28 }, (_, i) => {
  let s = (i * 1664525 + 1013904223) | 0
  s = (Math.imul(s, 1664525) + 1013904223) | 0
  return (Math.abs(s) % 14) + 4
})
const WAVE_DUR = Array.from({ length: 28 }, (_, i) => {
  let s = (i * 22695477 + 1) | 0
  s = (Math.imul(s, 1664525) + 1013904223) | 0
  return 0.35 + (Math.abs(s) % 30) / 100
})

const GlobeAudioBar = memo(function GlobeAudioBar({
  chips, audioText, chipOffsets,
}: { chips: ChipData[]; audioText: string; chipOffsets: number[] }) {
  const [playing, setPlaying] = useState(false)
  const [currentIdx, setCurrentIdx] = useState<number | null>(null)

  const toggle = useCallback(() => {
    if (!('speechSynthesis' in window)) return
    if (playing) {
      window.speechSynthesis.cancel()
      setPlaying(false)
      setCurrentIdx(null)
      return
    }
    const utt = new SpeechSynthesisUtterance(audioText)
    utt.lang = 'pt-BR'; utt.rate = 1.0; utt.pitch = 1
    const voices = window.speechSynthesis.getVoices()
    const ptBr = voices.find(v => v.lang === 'pt-BR') ?? voices.find(v => v.lang.startsWith('pt'))
    if (ptBr) utt.voice = ptBr
    utt.onboundary = (e) => {
      if (e.name !== 'word') return
      // charIndex indica posição atual no texto — usamos para saber qual chip está sendo lido
      let idx = chipOffsets.length - 1
      for (let i = 0; i < chipOffsets.length; i++) {
        if (e.charIndex < chipOffsets[i]) { idx = Math.max(0, i - 1); break }
      }
      setCurrentIdx(idx)
    }
    utt.onend = () => { setPlaying(false); setCurrentIdx(null) }
    utt.onerror = () => { setPlaying(false); setCurrentIdx(null) }
    window.speechSynthesis.speak(utt)
    setPlaying(true)
    setCurrentIdx(0)
  }, [audioText, chipOffsets, playing])

  useEffect(() => () => { if (playing) window.speechSynthesis.cancel() }, [playing])

  const activeChip = currentIdx !== null ? chips[currentIdx] : null
  const accentColor = activeChip?.signal?.color ?? '#34d399'

  return (
    <div style={{ margin: '12px 0 2px', padding: '14px 18px', background: playing ? 'rgba(52,211,153,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${playing ? 'rgba(52,211,153,0.20)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, transition: 'all 0.3s' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Botão play/pause */}
        <button onClick={toggle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', background: playing ? `${accentColor}18` : 'rgba(255,255,255,0.06)', border: `1.5px solid ${playing ? accentColor + '55' : 'rgba(255,255,255,0.12)'}`, cursor: 'pointer', flexShrink: 0, transition: 'all 0.22s' }}>
          {playing ? (
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
              <rect x="2" y="1" width="3" height="10" rx="1" fill={accentColor} />
              <rect x="7" y="1" width="3" height="10" rx="1" fill={accentColor} />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M4 2L12 7L4 12V2Z" fill="rgba(192,192,192,0.65)" />
            </svg>
          )}
        </button>

        {/* Label + subtítulo */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: playing ? accentColor : 'rgba(192,192,192,0.5)', letterSpacing: '0.05em', marginBottom: 3, transition: 'color 0.3s' }}>
            {playing && activeChip
              ? `Narrando: ${activeChip.label} — ${activeChip.value}`
              : 'Ouvir análise completa do mercado'}
          </p>
          <p style={{ fontSize: 8.5, color: 'rgba(192,192,192,0.25)', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
            {playing && activeChip
              ? activeChip.signal?.text ?? 'estável'
              : `${chips.length} indicadores com análise completa · O que é · Como afeta seu negócio`}
          </p>
        </div>

        {/* Dots de progresso */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', flexShrink: 0 }}>
          {chips.map((c, i) => {
            const isActive = playing && currentIdx === i
            const isDone   = playing && currentIdx !== null && i < currentIdx
            const col      = c.signal?.color ?? '#34d399'
            return (
              <div key={c.id} title={c.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <motion.div
                  animate={isActive ? { scale: [1, 1.6, 1], opacity: [0.8, 1, 0.8] } : {}}
                  transition={{ duration: 0.75, repeat: isActive ? Infinity : 0 }}
                  style={{ width: isActive ? 9 : 6, height: isActive ? 9 : 6, borderRadius: '50%', background: isActive ? col : isDone ? col + '55' : 'rgba(255,255,255,0.10)', boxShadow: isActive ? `0 0 8px ${col}80` : 'none', transition: 'all 0.3s' }}
                />
                <span style={{ fontSize: 5.5, fontFamily: 'monospace', color: isActive ? col : isDone ? col + '77' : 'rgba(255,255,255,0.14)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{c.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Waveform animada — alturas determinísticas */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${accentColor}12` }}>
              {WAVE_H.map((h, i) => (
                <motion.div key={i}
                  animate={{ scaleY: [0.2, 1, 0.2] }}
                  transition={{ duration: WAVE_DUR[i], repeat: Infinity, delay: i * 0.055, ease: 'easeInOut' }}
                  style={{ width: 3, height: h, background: i % 4 === 0 ? accentColor + 'bb' : accentColor + '44', borderRadius: 2, flexShrink: 0, transformOrigin: 'center' }}
                />
              ))}
              <span style={{ marginLeft: 10, fontSize: 8, fontFamily: 'monospace', color: accentColor + '66', letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>
                NARRANDO · PT-BR
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

const GlobeHero = memo(function GlobeHero({ data }: { data: MarketData }) {
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

  const chips: ChipData[] = useMemo(() => [
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [sv, uv, iv, pv, gp, op, gold?.value, gold?.delta, silver?.value, silver?.delta, oil?.value])

  const selectedChip = chips.find(c => c.id === selectedId) ?? null

  const { globeAudioText, chipOffsets } = useMemo(() => {
    const offsets: number[] = []
    let text = `Análise completa do Mercado Global ao Vivo. Acompanhe agora os ${chips.length} principais indicadores econômicos que afetam diretamente o resultado do seu negócio. `
    chips.forEach((c, i) => {
      offsets.push(text.length)
      const deltaDir = c.delta > 0.05 ? `subindo ${c.delta.toFixed(2) ?? ''}%` : c.delta < -0.05 ? `caindo ${Math.abs(c.delta).toFixed(2)}%` : 'estável hoje'
      const sinal = c.signal?.text ?? 'estável'
      const oque = c.oque ?? ''
      const como = c.como ?? ''
      text += `Indicador ${i + 1}: ${c.label}. Valor atual: ${c.value}${c.unit ? `, ${c.unit}` : ''}. Variação: ${deltaDir}. Situação: ${sinal}. `
      if (oque) text += `O que é: ${oque} `
      if (como) text += `Como isso impacta o seu negócio: ${como} `
    })
    text += `Fim da análise completa do Mercado Global ao Vivo.`
    return { globeAudioText: text, chipOffsets: offsets }
  }, [chips])

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
        {/* Áudio — análise completa do globo (desktop) */}
        <GlobeAudioBar chips={chips} audioText={globeAudioText} chipOffsets={chipOffsets} />
      </div>

      {/* ── MOBILE: globo grande + chips orbitando com sparkline ── */}
      {/* Negative margins break out of px-2 parent so globe centers on full screen width */}
      <div className="md:hidden flex flex-col gap-3" style={{ marginLeft: -8, marginRight: -8, width: 'calc(100% + 16px)' }}>
        <div className="relative w-full select-none" style={{ height: 580, overflow: 'hidden' }} onClick={() => setSelectedId(null)}>
          {/* Orbit ellipse guide */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} overflow="visible">
            <ellipse cx="50%" cy="50%" rx={148} ry={182}
              fill="none" stroke="rgba(195,195,195,0.05)" strokeWidth="1" strokeDasharray="4 10" />
          </svg>
          {/* Globe — elemento dominante */}
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 300, height: 300, zIndex: 2 }}>
            {[1.06, 1.18, 1.34, 1.52].map((s, i) => (
              <motion.div key={i}
                style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1px solid rgba(192,192,192,${0.07 - i * 0.014})`, transform: `scale(${s})`, pointerEvents: 'none' }}
                animate={{ opacity: [0.55, 0.06, 0.55] }}
                transition={{ duration: 3.4 + i * 1.7, repeat: Infinity, delay: i * 1.1, ease: 'easeInOut' }}
              />
            ))}
            <div style={{ width: '100%', height: '100%' }}><Globe3D /></div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 4 }}>
              <motion.div style={{ background: 'rgba(2,2,2,0.92)', border: '1px solid rgba(52,211,153,0.28)', backdropFilter: 'blur(18px)', padding: '6px 14px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 7 }}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, duration: 0.5 }}>
                <motion.div style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399' }}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.75, 1.4, 0.75] }}
                  transition={{ duration: 1.6, repeat: Infinity }} />
                <span style={{ fontSize: 9, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.34em', color: 'rgba(52,211,153,0.88)' }}>Ao Vivo</span>
              </motion.div>
            </div>
          </div>
          {/* Orbital chips — com sparkline + signal como desktop */}
          {chips.map((chip, i) => {
            const MOB_AX = 148, MOB_AY = 182, MOB_N = 40
            const startAngle = (i / 8) * 2 * Math.PI - Math.PI / 2
            const times = Array.from({ length: MOB_N + 1 }, (_, k) => k / MOB_N)
            const xKF = times.map(t => Math.round(MOB_AX * Math.cos(startAngle + t * 2 * Math.PI)))
            const yKF = times.map(t => Math.round(MOB_AY * Math.sin(startAngle + t * 2 * Math.PI)))
            const DeltaIcon = chip.delta > 0.05 ? TrendingUp : chip.delta < -0.05 ? TrendingDown : Minus
            const deltaColor = chip.delta > 0.05 ? '#34d399' : chip.delta < -0.05 ? '#f87171' : '#94a3b8'
            const absDelta = Math.abs(chip.delta)
            const deltaStr = absDelta < 10 ? absDelta.toFixed(1) : absDelta.toFixed(0)
            const deltaSign = chip.delta > 0.05 ? '▲' : chip.delta < -0.05 ? '▼' : '→'
            const accent = chip.signal?.color ?? chip.color
            const isSelected = selectedId === chip.id
            return (
              <motion.div key={chip.id}
                style={{ position: 'absolute', left: '50%', top: '50%', width: 84, marginLeft: -42, marginTop: -34, zIndex: isSelected ? 20 : 10, cursor: 'pointer' }}
                animate={{ x: xKF, y: yKF }}
                transition={{ duration: ORB_DUR, repeat: Infinity, ease: 'linear', times }}
                onClick={e => { e.stopPropagation(); setSelectedId(prev => prev === chip.id ? null : chip.id) }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.75 }}
                  animate={{ opacity: 1, scale: isSelected ? 1.07 : 1 }}
                  transition={{ delay: i * 0.12 + 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    background: isSelected ? 'rgba(10,10,10,0.98)' : 'rgba(5,5,5,0.94)',
                    border: `1px solid ${isSelected ? accent + '55' : 'rgba(195,195,195,0.11)'}`,
                    backdropFilter: 'blur(26px)',
                    borderRadius: 11,
                    padding: '7px 9px 8px',
                    boxShadow: isSelected
                      ? `0 0 24px ${accent}28, 0 8px 22px rgba(0,0,0,0.88), inset 0 1px 0 rgba(210,210,210,0.08)`
                      : `0 4px 14px rgba(0,0,0,0.72), inset 0 1px 0 rgba(200,200,200,0.05)`,
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    style={{ position: 'absolute', inset: 0, background: `linear-gradient(105deg, transparent 25%, ${accent}08 50%, transparent 75%)`, pointerEvents: 'none' }}
                    animate={{ x: ['-140%', '240%'] }}
                    transition={{ duration: 6 + i * 0.7, delay: i * 0.6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <p style={{ fontSize: 6, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(195,195,195,0.30)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {chip.label}
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 700, fontFamily: 'monospace', color: 'rgba(235,235,235,0.96)', lineHeight: 1, marginBottom: 4 }}>
                    {chip.value}
                  </p>
                  <div style={{ marginBottom: 3, opacity: 0.6 }}>
                    <Sparkline id={chip.id} delta={chip.delta} color={deltaColor} w={42} h={11} />
                  </div>
                  <span style={{ fontSize: 7, fontFamily: 'monospace', fontWeight: 700, color: deltaColor, background: deltaColor + '16', border: `1px solid ${deltaColor}26`, borderRadius: 99, padding: '1px 5px', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                    <DeltaIcon style={{ width: 7, height: 7, flexShrink: 0 }} />
                    {deltaSign}{deltaStr}%
                  </span>
                  {chip.signal && <p style={{ fontSize: 6, color: chip.signal.color, marginTop: 3, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chip.signal.text}</p>}
                </motion.div>
              </motion.div>
            )
          })}
          {/* Backdrop only — chips dim when panel open */}
          <AnimatePresence>
            {selectedChip && (
              <motion.div
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: 25 }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                onClick={() => setSelectedId(null)}
              />
            )}
          </AnimatePresence>
        </div>
        {/* Detail bottom sheet — fixed, escapes overflow:hidden, slides up from bottom */}
        <AnimatePresence>
          {selectedChip && (
            <>
              <motion.div
                style={{ position: 'fixed', inset: 0, zIndex: 290 }}
                initial={{ opacity: 0 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedId(null)}
              />
              <motion.div
                style={{ position: 'fixed', bottom: 72, left: 0, right: 0, zIndex: 300 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
              >
                <DetailPanelMobile chip={selectedChip} onClose={() => setSelectedId(null)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <GlobeAudioBar chips={chips} audioText={globeAudioText} chipOffsets={chipOffsets} />
      </div>
    </div>
  )
})

// ════════════════════════════════════════════════════════════════════════════
// ██  DOMAIN NAV
// ════════════════════════════════════════════════════════════════════════════

const DOMAIN_NAV = [
  { num: '01', label: 'Macro',        id: 'section-macro' },
  { num: '02', label: 'Mercado',      id: 'section-mercado' },
  { num: '03', label: 'B3',           id: 'section-b3' },
  { num: '04', label: 'Commodities',  id: 'section-commodities' },
  { num: '05', label: 'Crédito PJ',   id: 'section-credito' },
  { num: '06', label: 'Setores',      id: 'section-setores' },
  { num: '07', label: 'Marketing',    id: 'section-intel' },
  { num: '08', label: 'Sust.',        id: 'section-intel' },
  { num: '09', label: 'Business IA',  id: 'section-ia' },
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
        <button key={d.num} onClick={() => scrollTo(d.id)}
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
// ██  AREA CHART
// ════════════════════════════════════════════════════════════════════════════

function AreaChart({ id, delta, color = '#34d399' }: { id: string; delta: number; color?: string }) {
  const POINTS = 60
  const W = 600, H = 140, PAD = 8
  const cw = W - PAD * 2, ch = H - PAD * 2

  const pts = useMemo(() => {
    let seed = 0
    const key = id + new Date().toDateString()
    for (const c of key) seed = (Math.imul(31, seed) + c.charCodeAt(0)) | 0
    const raw: number[] = []
    for (let i = 0; i < POINTS; i++) {
      seed = (Math.imul(1664525, seed) + 1013904223) | 0
      const r = (Math.abs(seed) % 1000) / 1000
      const trend = (delta / 100) * (i / (POINTS - 1))
      raw.push(clamp(r * 0.55 + 0.225 + trend, 0.05, 0.95))
    }
    const mn = Math.min(...raw), mx = Math.max(...raw), rng = mx - mn || 0.1
    return raw.map(v => (v - mn) / rng)
  }, [id, delta])

  const coords = pts.map((v, i) => ({ x: PAD + (i / (POINTS - 1)) * cw, y: PAD + (1 - v) * ch }))
  const linePath = coords.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L ${(PAD + cw).toFixed(1)},${(PAD + ch).toFixed(1)} L ${PAD},${(PAD + ch).toFixed(1)} Z`
  const last = coords[coords.length - 1]
  const gradId = `ag-${id}`

  const safeColor = color.startsWith('rgba') ? '#c0c0c0' : color

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={safeColor} stopOpacity="0.22" />
          <stop offset="88%" stopColor={safeColor} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map(v => (
        <line key={v} x1={PAD} y1={PAD + v * ch} x2={PAD + cw} y2={PAD + v * ch}
          stroke="rgba(200,200,200,0.05)" strokeWidth="1" />
      ))}
      <path d={areaPath} fill={`url(#${gradId})`} />
      <motion.path d={linePath} fill="none" stroke={safeColor} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }} />
      <circle cx={last.x} cy={last.y} r="3.5" fill={safeColor} />
      <circle cx={last.x} cy={last.y} r="6.5" fill={safeColor} opacity="0.18" />
    </svg>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  ANNOTATED AREA CHART
// ════════════════════════════════════════════════════════════════════════════

function AnnotatedAreaChart({ id, delta, color, peakLabel, peakSub, troughLabel, troughSub }: {
  id: string; delta: number; color: string
  peakLabel: string; peakSub: string; troughLabel: string; troughSub: string
}) {
  const POINTS = 60
  const W = 700, PAD = 10
  const CHART_TOP = 46, CHART_H = 140, CHART_BOT = CHART_TOP + CHART_H
  const H = CHART_BOT + 46
  const cw = W - PAD * 2

  const pts = useMemo(() => {
    let seed = 0
    const key = id + new Date().toDateString()
    for (const c of key) seed = (Math.imul(31, seed) + c.charCodeAt(0)) | 0
    const raw: number[] = []
    for (let i = 0; i < POINTS; i++) {
      seed = (Math.imul(1664525, seed) + 1013904223) | 0
      const r = (Math.abs(seed) % 1000) / 1000
      const trend = (delta / 100) * (i / (POINTS - 1))
      raw.push(clamp(r * 0.55 + 0.225 + trend, 0.05, 0.95))
    }
    const mn = Math.min(...raw), mx = Math.max(...raw), rng = mx - mn || 0.1
    return raw.map(v => (v - mn) / rng)
  }, [id, delta])

  const coords = pts.map((v, i) => ({
    x: PAD + (i / (POINTS - 1)) * cw,
    y: CHART_TOP + (1 - v) * CHART_H,
  }))

  const linePath = coords.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L ${(PAD + cw).toFixed(1)},${CHART_BOT} L ${PAD},${CHART_BOT} Z`
  const last = coords[coords.length - 1]
  const gradId = `aac-${id}`
  const safeColor = color.startsWith('rgba') ? '#c0c0c0' : color

  let peakIdx = 8, troughIdx = 8
  for (let i = 8; i < POINTS - 8; i++) {
    if (pts[i] > pts[peakIdx]) peakIdx = i
    if (pts[i] < pts[troughIdx]) troughIdx = i
  }
  const peakPt  = coords[peakIdx]
  const troughPt = coords[troughIdx]

  const ANN_W = 114
  const cx = (x: number) => Math.max(4, Math.min(W - ANN_W - 4, x - ANN_W / 2))

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={safeColor} stopOpacity="0.18" />
          <stop offset="90%" stopColor={safeColor} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map(v => (
        <line key={v} x1={PAD} y1={CHART_TOP + v * CHART_H} x2={PAD + cw} y2={CHART_TOP + v * CHART_H}
          stroke="rgba(200,200,200,0.04)" strokeWidth="1" />
      ))}
      <path d={areaPath} fill={`url(#${gradId})`} />
      <motion.path d={linePath} fill="none" stroke={safeColor} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }} />

      {/* Peak callout — above chart */}
      <line x1={peakPt.x} y1={peakPt.y - 5} x2={peakPt.x} y2={CHART_TOP - 4}
        stroke={safeColor} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.4" />
      <circle cx={peakPt.x} cy={peakPt.y} r="3.5" fill={safeColor} />
      <circle cx={peakPt.x} cy={peakPt.y} r="7"   fill={safeColor} opacity="0.12" />
      <rect x={cx(peakPt.x)} y={2} width={ANN_W} height={38} rx="6"
        fill="rgba(6,6,6,0.94)" stroke={safeColor} strokeOpacity="0.25" strokeWidth="0.7" />
      <text x={cx(peakPt.x) + ANN_W / 2} y={15} textAnchor="middle"
        fontSize="8" fontFamily="monospace" fontWeight="700" fill={safeColor} letterSpacing="0.8">{peakLabel}</text>
      <text x={cx(peakPt.x) + ANN_W / 2} y={30} textAnchor="middle"
        fontSize="7.5" fontFamily="monospace" fill="rgba(200,200,200,0.42)">{peakSub}</text>

      {/* Trough callout — below chart */}
      <line x1={troughPt.x} y1={troughPt.y + 5} x2={troughPt.x} y2={CHART_BOT + 4}
        stroke={safeColor} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.4" />
      <circle cx={troughPt.x} cy={troughPt.y} r="3.5" fill={safeColor} />
      <circle cx={troughPt.x} cy={troughPt.y} r="7"   fill={safeColor} opacity="0.12" />
      <rect x={cx(troughPt.x)} y={CHART_BOT + 6} width={ANN_W} height={38} rx="6"
        fill="rgba(6,6,6,0.94)" stroke={safeColor} strokeOpacity="0.25" strokeWidth="0.7" />
      <text x={cx(troughPt.x) + ANN_W / 2} y={CHART_BOT + 19} textAnchor="middle"
        fontSize="8" fontFamily="monospace" fontWeight="700" fill={safeColor} letterSpacing="0.8">{troughLabel}</text>
      <text x={cx(troughPt.x) + ANN_W / 2} y={CHART_BOT + 34} textAnchor="middle"
        fontSize="7.5" fontFamily="monospace" fill="rgba(200,200,200,0.42)">{troughSub}</text>

      {/* Current dot */}
      <circle cx={last.x} cy={last.y} r="4"   fill={safeColor} />
      <circle cx={last.x} cy={last.y} r="8.5" fill={safeColor} opacity="0.14" />
      <text x={Math.min(last.x + 6, W - 38)} y={last.y - 7}
        fontSize="8" fontFamily="monospace" fontWeight="700" fill={safeColor} opacity="0.8">AGORA</text>
    </svg>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ██  MARKET PANEL — unified chart + annotations + analysis per stock/index
// ════════════════════════════════════════════════════════════════════════════

const MarketPanel = memo(function MarketPanel({ data }: { data: MarketData }) {
  const ibov  = data.stocks?.ibov
  const { usdBrl } = data.macro
  const oil   = data.commodities.oil
  const gold  = data.commodities.gold
  const brStocks = data.stocks?.br ?? []
  const fallback: StockBR[] = [
    { ticker: 'PETR4', label: 'Petrobras',  price: 36.50, pct: 0 },
    { ticker: 'VALE3', label: 'Vale',        price: 58.20, pct: 0 },
    { ticker: 'ITUB4', label: 'Itaú Unib.', price: 27.90, pct: 0 },
    { ticker: 'BBDC4', label: 'Bradesco',   price: 15.80, pct: 0 },
    { ticker: 'WEGE3', label: 'WEG',        price: 50.10, pct: 0 },
    { ticker: 'ABEV3', label: 'Ambev',      price: 13.20, pct: 0 },
  ]
  const stocks = brStocks.length > 0 ? brStocks : fallback
  const [activeId, setActiveId] = useState('ibov')

  type TabDef = { id: string; label: string; value: string; delta: number; group: string; desc: string; oQueE: string; peakLabel: string; peakSub: string; troughLabel: string; troughSub: string; signal: string; signalColor: string; cenario: string; impacto: string; decisao: string }

  const ibovPct = ibov?.pct ?? 0
  const ibovVal = fmtK(ibov?.value ?? 128000)
  const selic   = data.macro.selic.value

  const STOCK_META: Record<string, { desc: string; oQueE: string }> = {
    PETR4: { desc: 'Petrobras · pré-sal', oQueE: 'Petrobras (PETR4) é a maior empresa de petróleo do Brasil e uma das maiores do mundo. Opera no pré-sal — camada de óleo de altíssima qualidade no fundo do oceano. O preço da ação oscila com o petróleo Brent, o câmbio e decisões políticas do governo, que é acionista controlador.' },
    VALE3: { desc: 'Vale · minério de ferro', oQueE: 'Vale (VALE3) é a maior produtora de minério de ferro do mundo e a 2ª de níquel. Exporta para a China, que usa minério para fabricar aço. Quando a China cresce, a Vale sobe. Quando a China freia, cai. O dólar alto também aumenta as receitas em reais.' },
    ITUB4: { desc: 'Itaú · maior banco privado', oQueE: 'Itaú Unibanco (ITUB4) é o maior banco privado da América Latina. Lucra com a diferença entre o juro que cobra em empréstimos e o que paga em depósitos. Com SELIC alta, essa diferença (spread) cresce — o banco lucra mais, mas o crédito fica caro para empresas.' },
    BBDC4: { desc: 'Bradesco · crédito varejo', oQueE: 'Bradesco (BBDC4) é o 2º maior banco privado do Brasil, com forte presença no crédito ao consumidor e para PMEs. É um termômetro real da inadimplência popular: quando as famílias brasileiras não conseguem pagar, o Bradesco sente primeiro.' },
    WEGE3: { desc: 'WEG · automação industrial', oQueE: 'WEG (WEGE3) fabrica motores elétricos, geradores e equipamentos de automação. É uma das poucas empresas brasileiras com receita global — mais de 60% vem de fora do Brasil. Quando indústrias no mundo inteiro investem em eficiência e automação, a WEG cresce.' },
    ABEV3: { desc: 'Ambev · consumo & bebidas', oQueE: 'Ambev (ABEV3) é a maior empresa de bebidas da América Latina — Brahma, Skol, Antarctica, Corona. Reflete diretamente o poder de consumo da população brasileira. Alta indica confiança do consumidor; queda indica aperto de renda ou custos subindo mais que o repasse.' },
  }

  const stockTab = (s: StockBR, peak: [string,string], trough: [string,string], cenario: string, impacto: string, decisao: string): TabDef => {
    const col = s.pct > 0.5 ? '#34d399' : s.pct < -0.5 ? '#f87171' : '#fbbf24'
    const sig = s.pct > 0.5 ? 'EM ALTA' : s.pct < -0.5 ? 'EM QUEDA' : 'ESTÁVEL'
    const meta = STOCK_META[s.ticker] ?? { desc: s.label, oQueE: s.label }
    return { id: s.ticker, label: s.ticker, value: s.price ? `R$${s.price.toFixed(2)}` : '—', delta: s.pct, group: 'ação', desc: meta.desc, oQueE: meta.oQueE, peakLabel: peak[0], peakSub: peak[1], troughLabel: trough[0], troughSub: trough[1], signal: sig, signalColor: col, cenario, impacto, decisao }
  }

  const petr = stocks.find(s => s.ticker === 'PETR4')
  const vale = stocks.find(s => s.ticker === 'VALE3')
  const itub = stocks.find(s => s.ticker === 'ITUB4')
  const bbdc = stocks.find(s => s.ticker === 'BBDC4')
  const wege = stocks.find(s => s.ticker === 'WEGE3')
  const abev = stocks.find(s => s.ticker === 'ABEV3')

  const tabs: TabDef[] = [
    {
      id: 'ibov', label: 'IBOV', value: ibovVal, delta: ibovPct, group: 'índice', desc: '~500 maiores da B3',
      oQueE: 'O IBOVESPA é o principal índice da Bolsa de Valores brasileira (B3). Reúne as ~500 ações mais negociadas e serve de termômetro da economia: sobe quando há otimismo com o Brasil, cai quando há medo de crise, alta de juros ou instabilidade política. É o primeiro número que investidores e analistas olham todo dia.',
      peakLabel: 'RESISTÊNCIA', peakSub: 'euforia / fluxo externo',
      troughLabel: 'SUPORTE', troughSub: 'saída de capital risco',
      signal: ibovPct > 1.5 ? 'ALTA' : ibovPct < -1.5 ? 'QUEDA' : 'LATERAL',
      signalColor: ibovPct > 1.5 ? '#34d399' : ibovPct < -1.5 ? '#f87171' : '#fbbf24',
      cenario: ibovPct > 1.5 ? `IBOV em alta de ${pctSign(ibovPct)} a ${ibovVal} pts. Apetite por risco elevado, fluxo estrangeiro positivo.` : ibovPct < -1.5 ? `IBOV em queda de ${pctSign(ibovPct)} a ${ibovVal} pts. Saída de capital, aversão a risco elevada.` : `IBOV lateral a ${ibovVal} pts (${pctSign(ibovPct)}). Mercado aguarda COPOM e dados fiscais para definir tendência.`,
      impacto: ibovPct > 1.5 ? 'Captação via equity facilitada, crédito flui melhor, valuation de PMEs sobe. Janela para captações estratégicas.' : ibovPct < -1.5 ? 'Crédito se contrai, valuation cai. PMEs com caixa curto devem revisar vencimentos e evitar novos compromissos.' : 'Incerteza — crédito disponível mas cauteloso. Boa janela para renegociar passivos antes da próxima tendência.',
      decisao: ibovPct > 1.5 ? 'Aproveite para captações e renegociações. Avalie M&A — múltiplos sobem com o índice. Janela curta.' : ibovPct < -1.5 ? 'Preserve caixa. Evite capital fixo no curto prazo. Monitore inadimplência da carteira.' : 'Aguarde definição antes de decisões estruturais de capital. Priorize eficiência e reduza custos fixos.',
    },
    ...(petr ? [stockTab(petr,
      ['ALTA C/ PETRÓLEO', 'brent puxou valorização'],
      ['PRESSÃO POLÍTICA', 'risco dividendo + câmbio'],
      `Petrobras (PETR4) a ${petr.price ? `R$${petr.price.toFixed(2)}` : '—'} (${pctSign(petr.pct)}). Desempenho atrelado ao Brent, política de dividendos e câmbio. Pré-sal garante base sólida, mas risco político pressiona prêmio de risco.`,
      'Alta da Petrobras sinaliza otimismo com energia e câmbio. Fornecedores do segmento (serviços, equipamentos, logística) se beneficiam com o ambiente favorável.',
      petr.pct > 0.5 ? 'Alta reforça tese de energia brasileira. Setores correlatos ganham — avalie parceiros fornecedores.' : petr.pct < -0.5 ? 'Queda reflete risco político. Revise exposição ao setor energético e monitore política de preços de combustíveis.' : 'Lateral — aguarde clareza sobre dividendos e Brent antes de decisão de exposição ao setor.',
    )] : []),
    ...(vale ? [stockTab(vale,
      ['DEMANDA CHINA', 'minério de ferro em alta'],
      ['DESACELERAÇÃO', 'China corta produção aço'],
      `Vale (VALE3) a ${vale.price ? `R$${vale.price.toFixed(2)}` : '—'} (${pctSign(vale.pct)}). Maior produtora de minério de ferro do mundo — preço ditado pelo mercado de aço chinês. USD/BRL amplifica receitas em reais.`,
      'Alta da Vale reflete expansão industrial global. Beneficia exportação de minério, siderurgia nacional e cadeia logística de exportação. Empresas com insumos metálicos ganham em ambiente de alta.',
      vale.pct > 0.5 ? 'Expansão industrial global — cadeia siderúrgica nacional ganha. Avalie parceiros e fornecedores correlatos.' : vale.pct < -0.5 ? 'Fraqueza da China comprime commodities metálicas. Revise exposição à indústria pesada e avalie pressão de custos.' : 'Estável — monitore China e Brent para sinalizar o próximo movimento.',
    )] : []),
    ...(itub ? [stockTab(itub,
      ['SPREAD FAVORÁVEL', `SELIC ${selic}% + inadimp. baixa`],
      ['COMPRESSÃO NIM', 'inadimplência pressiona'],
      `Itaú Unibanco (ITUB4) a ${itub.price ? `R$${itub.price.toFixed(2)}` : '—'} (${pctSign(itub.pct)}). Maior banco privado do Brasil — resultado ditado por spread de crédito, SELIC em ${selic}% e qualidade da carteira.`,
      `SELIC ${selic}% gera spread ${selic > 13 ? 'elevado — banco lucra mas comprime tomadores PJ' : 'moderado'}. Alta do Itaú = confiança no sistema de crédito e inadimplência controlada — bom sinal para o mercado geral.`,
      itub.pct > 0.5 ? 'Crédito saudável — momento para renegociar taxas e ampliar linhas de capital de giro com bancos.' : itub.pct < -0.5 ? 'Piora no crédito. Monitore inadimplência no seu setor e revise política de prazo com clientes.' : 'Crédito disponível sem catalisador. Mantenha negociação ativa com gerente de conta.',
    )] : []),
    ...(bbdc ? [stockTab(bbdc,
      ['INADIMP. CONTROLADA', 'expansão crédito varejo'],
      ['PIORA DE CARTEIRA', 'provisões sobem'],
      `Bradesco (BBDC4) a ${bbdc.price ? `R$${bbdc.price.toFixed(2)}` : '—'} (${pctSign(bbdc.pct)}). Banco de varejo com forte exposição à inadimplência de pessoas físicas e PMEs. Termômetro real do crédito popular.`,
      'Bradesco é espelho do crédito popular e PMEs. Alta sinaliza queda de inadimplência — bom para quem financia clientes. Queda alerta para piora da carteira nacional.',
      bbdc.pct > 0.5 ? 'Crédito ao consumidor aquecido. Bom momento para ampliar parcelamentos e condições de crédito ao cliente.' : bbdc.pct < -0.5 ? 'Pressão de inadimplência no varejo. Revise política de crédito, prazos e exposição a clientes vulneráveis.' : 'Estável. Monitore provisões do próximo resultado para antecipar tendência.',
    )] : []),
    ...(wege ? [stockTab(wege,
      ['EXPORTAÇÃO AQUECIDA', 'câmbio + demanda global'],
      ['INDÚSTRIA FRACA', 'capex corporativo cai'],
      `WEG (WEGE3) a ${wege.price ? `R$${wege.price.toFixed(2)}` : '—'} (${pctSign(wege.pct)}). Líder em motores elétricos e automação industrial. Mais de 60% das receitas fora do Brasil — protege de flutuações domésticas.`,
      'WEG é proxy de atividade industrial global. Alta = empresas investindo em capex e automação. Queda indica postergação de investimentos industriais — cuidado com projetos de expansão.',
      wege.pct > 0.5 ? 'Empresas industriais estão investindo. Bom momento para capex em automação e eficiência energética.' : wege.pct < -0.5 ? 'Desaceleração industrial. Postergue capex não urgente e revise ROI de automação antes de aprovar.' : 'Neutro. Projetos com payback <24 meses podem avançar com segurança.',
    )] : []),
    ...(abev ? [stockTab(abev,
      ['CONSUMO AQUECIDO', 'renda e vendas sazonais'],
      ['PRESSÃO DE CUSTO', 'insumos + câmbio sobem'],
      `Ambev (ABEV3) a ${abev.price ? `R$${abev.price.toFixed(2)}` : '—'} (${pctSign(abev.pct)}). Maior bebidas da América Latina — termômetro de consumo doméstico, poder de precificação e eficiência de cadeia.`,
      'Ambev reflete consumo popular e poder de repasse de custos. Alta = confiança do consumidor + margens saudáveis. Queda = pressão de custos ou queda de volume.',
      abev.pct > 0.5 ? 'Consumo aquecido. Ampliar canais de distribuição e pontos de venda pode capturar demanda incremental.' : abev.pct < -0.5 ? 'Pressão no consumo. Revise mix de produto e canal — foque em itens de maior margem.' : 'Estável. Foque em eficiência de cadeia e margem por canal.',
    )] : []),
    {
      id: 'usd', label: 'USD/BRL', value: `R$${usdBrl.value}`, delta: usdBrl.delta, group: 'macro', desc: 'câmbio real × dólar',
      oQueE: 'A taxa de câmbio USD/BRL mostra quantos reais são necessários para comprar 1 dólar americano. Afeta diretamente qualquer empresa que importe insumos, pague software estrangeiro, tenha dívida em dólar ou concorra com produtos importados. Dólar alto = custos sobem. Dólar baixo = importar fica mais barato.',
      peakLabel: 'DÓLAR EM ALTA', peakSub: 'fuga de risco / pressão fiscal',
      troughLabel: 'REAL FORTE', troughSub: 'fluxo estrangeiro positivo',
      signal: usdBrl.value > 5.8 ? 'PRESSIONADO' : usdBrl.value > 5.0 ? 'ELEVADO' : 'FAVORÁVEL',
      signalColor: usdBrl.value > 5.8 ? '#f87171' : usdBrl.value > 5.0 ? '#fbbf24' : '#34d399',
      cenario: `Dólar a R$${usdBrl.value} (${pctSign(usdBrl.delta)}). ${usdBrl.value > 5.8 ? 'Câmbio acima de R$5,80 reflete pressão fiscal e percepção de risco-Brasil elevada.' : usdBrl.value > 5.0 ? 'Câmbio elevado gera pressão em insumos importados e frete internacional.' : 'Real valorizado, fluxo de capital positivo — patamar historicamente favorável para importadores.'}`,
      impacto: usdBrl.value > 5.0 ? 'Insumos importados, máquinas, software e matérias-primas estrangeiras encarecem. Energia e combustíveis sobem por repasse. Exportadores ganham; importadores perdem.' : 'Boa janela para importar equipamentos, tecnologia e insumos. Custo de software SaaS e serviços em dólar cai.',
      decisao: usdBrl.value > 5.8 ? 'Antecipe compras de insumos importados. Negocie hedge cambial. Repasse o custo gradualmente.' : usdBrl.value > 5.0 ? `Avalie substituição de insumos importados por nacionais. Revise precificação de produtos com componentes em dólar.` : 'Aproveite para importar, atualizar equipamentos e fixar contratos de fornecimento em dólar.',
    },
    {
      id: 'gold', label: 'OURO', value: `$${gold?.value ?? '—'}`, delta: gold?.delta ?? 0, group: 'macro', desc: 'ativo-refúgio global',
      oQueE: 'O ouro é o principal ativo-refúgio do mundo. Quando há medo — guerra, crise bancária, inflação fora de controle — investidores compram ouro e o preço sobe. Quando o ambiente volta ao normal e o risco cai, o capital migra para ações e o ouro recua. É um termômetro do medo global.',
      peakLabel: 'REFÚGIO MÁXIMO', peakSub: 'stress financeiro global',
      troughLabel: 'APETITE POR RISCO', troughSub: 'capital migra p/ renda variável',
      signal: (gold?.delta ?? 0) > 1.5 ? 'REFÚGIO ATIVO' : (gold?.delta ?? 0) < -1.5 ? 'RISCO CAI' : 'ESTÁVEL',
      signalColor: (gold?.delta ?? 0) > 1.5 ? '#fbbf24' : (gold?.delta ?? 0) < -1.5 ? '#34d399' : '#c0c0c0',
      cenario: `Ouro a $${gold?.value ?? '—'}/onça (${pctSign(gold?.delta ?? 0)}). ${(gold?.delta ?? 0) > 1.5 ? 'Alta demanda por refúgio — tensão geopolítica ou expectativa de corte de juros no Fed.' : (gold?.delta ?? 0) < -1.5 ? 'Capital migra para ativos de risco — menor aversão, bolsas e crédito corporativo ganham fluxo.' : 'Ambiente neutro de risco global.'}`,
      impacto: (gold?.delta ?? 0) > 1.5 ? 'Stress global eleva custo de capital externo. Empresas com dívida em dólar ficam vulneráveis.' : 'Ambiente favorável para captação e crédito internacional. Câmbio pode valorizar com retorno de fluxo.',
      decisao: (gold?.delta ?? 0) > 1.5 ? 'Revise exposição cambial. Considere hedge. Evite compromissos de longo prazo com fornecedores internacionais.' : (gold?.delta ?? 0) < -1.5 ? 'Boa janela para captação. Câmbio pode valorizar — monitore condições de crédito externo.' : 'Sem ação urgente. Monitore correlação ouro/USD para detectar mudança de tendência.',
    },
    {
      id: 'oil', label: 'PETRÓLEO', value: `$${oil?.value ?? '—'}`, delta: oil?.delta ?? 0, group: 'macro', desc: 'Brent · frete & energia',
      oQueE: 'O petróleo Brent é a referência global de energia. Seu preço afeta diretamente o frete, o diesel, a gasolina, plásticos e embalagens. Quando sobe, toda a cadeia logística fica mais cara — distribuidoras, transportadoras, varejo. É controlado pela OPEP+, que regula a oferta mundial para influenciar o preço.',
      peakLabel: 'OFERTA RESTRITA', peakSub: 'OPEP+ corta / tensão geopolítica',
      troughLabel: 'EXCESSO DE OFERTA', troughSub: 'OPEP+ relaxa / demanda fraca',
      signal: (oil?.delta ?? 0) > 2 ? 'PRESSÃO ALTA' : (oil?.delta ?? 0) < -2 ? 'ALÍVIO DE CUSTOS' : 'ESTÁVEL',
      signalColor: (oil?.delta ?? 0) > 2 ? '#f87171' : (oil?.delta ?? 0) < -2 ? '#34d399' : '#fbbf24',
      cenario: `Petróleo (Brent) a $${oil?.value ?? '—'}/barril (${pctSign(oil?.delta ?? 0)}). ${(oil?.delta ?? 0) > 2 ? 'Cortes da OPEP+ ou tensões geopolíticas pressionam o crude.' : (oil?.delta ?? 0) < -2 ? 'Excesso de oferta ou queda de demanda global comprimem o Brent.' : 'Equilíbrio entre oferta OPEP+ e demanda global.'}`,
      impacto: (oil?.delta ?? 0) > 2 ? 'Cada +10% no petróleo = +4–8% no diesel e +6–12% no frete rodoviário. Logística, varejo e indústria sentem direto no caixa.' : (oil?.delta ?? 0) < -2 ? 'Queda reduz frete, combustível, energia industrial e petroquímicos — impacto positivo direto no caixa.' : 'Custo de frete e energia previsíveis — janela de planejamento para empresas logísticas.',
      decisao: (oil?.delta ?? 0) > 2 ? 'Antecipe renegociação de contratos logísticos. Revise precificação com alto frete. Avalie contratos futuros de diesel.' : (oil?.delta ?? 0) < -2 ? 'Negocie contratos logísticos com preço fixo agora. Revise orçamento de energia.' : 'Momento estável para fixar contratos de frete. Monitore conflitos geopolíticos.',
    },
  ]

  const active    = tabs.find(t => t.id === activeId) ?? tabs[0]
  const chartColor = active.delta > 0 ? '#34d399' : active.delta < 0 ? '#f87171' : '#c0c0c0'

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
    <div style={{ background: 'rgba(5,5,5,0.94)', border: '1px solid rgba(200,200,200,0.07)', borderRadius: 18, overflow: 'hidden' }}>
      {/* Tab row */}
      <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', borderBottom: '1px solid rgba(200,200,200,0.05)' }}>
        {tabs.map(tab => {
          const isActive = activeId === tab.id
          const col = tab.delta > 0 ? '#34d399' : tab.delta < 0 ? '#f87171' : '#c0c0c0'
          return (
            <button key={tab.id} onClick={() => setActiveId(tab.id)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '10px 14px', flexShrink: 0, cursor: 'pointer', background: isActive ? 'rgba(200,200,200,0.06)' : 'transparent', borderBottom: `2px solid ${isActive ? col : 'transparent'}`, transition: 'all 0.14s', borderRight: '1px solid rgba(200,200,200,0.04)' }}>
              <span style={{ fontSize: 6.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.14em', color: isActive ? col + 'cc' : 'rgba(192,192,192,0.22)' }}>{tab.group}</span>
              <span style={{ fontSize: 11, fontWeight: 800, fontFamily: 'monospace', color: isActive ? 'rgba(235,235,235,0.95)' : 'rgba(192,192,192,0.42)' }}>{tab.label}</span>
              <span style={{ fontSize: 9.5, fontFamily: 'monospace', fontWeight: 700, color: isActive ? 'rgba(228,228,228,0.80)' : 'rgba(192,192,192,0.35)' }}>{tab.value}</span>
              <span style={{ fontSize: 8, fontFamily: 'monospace', fontWeight: 700, color: col }}>{pctSign(tab.delta)}</span>
              <span style={{ fontSize: 7, color: isActive ? 'rgba(180,180,180,0.38)' : 'rgba(150,150,150,0.18)', whiteSpace: 'nowrap', fontFamily: 'sans-serif' }}>{tab.desc}</span>
            </button>
          )
        })}
      </div>

      {/* Annotated chart */}
      <div style={{ padding: '4px 10px 0' }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            <AnnotatedAreaChart
              id={activeId} delta={active.delta} color={chartColor}
              peakLabel={active.peakLabel} peakSub={active.peakSub}
              troughLabel={active.troughLabel} troughSub={active.troughSub}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Signal + 3-col analysis */}
      <AnimatePresence mode="wait">
        <motion.div key={activeId + '-a'}
          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ borderTop: '1px solid rgba(200,200,200,0.05)', padding: '14px 16px 18px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 7, fontFamily: 'monospace', fontWeight: 700, color: active.signalColor, background: active.signalColor + '18', border: `1px solid ${active.signalColor}30`, borderRadius: 99, padding: '3px 10px', textTransform: 'uppercase', letterSpacing: '0.18em' }}>{active.signal}</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(200,200,200,0.04)' }} />
            <AudioButton
              color={active.signalColor}
              text={`${active.label}. ${active.oQueE} Cenário: ${active.cenario} Impacto no negócio: ${active.impacto} Decisão: ${active.decisao}`}
            />
            <span style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(192,192,192,0.28)' }}>{active.label} · {active.value}</span>
          </div>

          {/* O que é */}
          <div style={{ marginBottom: 14, padding: '10px 12px', background: 'rgba(255,255,255,0.025)', borderRadius: 10, borderLeft: `2px solid ${active.signalColor}40` }}>
            <p style={{ fontSize: 7, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.22em', color: active.signalColor + '99', marginBottom: 5, fontWeight: 700 }}>O que é</p>
            <p style={{ fontSize: 12, color: 'rgba(210,210,210,0.60)', lineHeight: 1.75 }}>{active.oQueE}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))', gap: 14 }}>
            {[
              { label: 'Cenário', text: active.cenario, color: 'rgba(192,192,192,0.26)' },
              { label: 'Impacto no Negócio', text: active.impacto, color: '#f87171aa' },
              { label: 'Decisão', text: active.decisao, color: '#34d399aa' },
            ].map(col => (
              <div key={col.label}>
                <p style={{ fontSize: 7, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: col.color, marginBottom: 6, fontWeight: 700 }}>{col.label}</p>
                <p style={{ fontSize: 11.5, color: 'rgba(208,208,208,0.50)', lineHeight: 1.7 }}>{col.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
    </div>
  )
})


// ════════════════════════════════════════════════════════════════════════════
// ██  MACRO STATS PANEL
// ════════════════════════════════════════════════════════════════════════════

const MacroStatsPanel = memo(function MacroStatsPanel({ data }: { data: MarketData }) {
  const { selic, ipca, usdBrl, pib } = data.macro
  const signal =
    selic.value > 13 && ipca.value > 5 ? { label: 'APERTO',  color: '#f87171' } :
    selic.value > 10 || ipca.value > 4  ? { label: 'CAUTELA', color: '#fbbf24' } :
    { label: 'ESTÁVEL', color: '#34d399' }
  const decisao =
    selic.value > 13
      ? `SELIC ${selic.value}% + IPCA ${ipca.value}% comprimem margens. Revise custo de capital e evite novos financiamentos de longo prazo.`
      : selic.value > 10
      ? `SELIC ${selic.value}% — crédito caro. Priorize capital próprio. Câmbio R$${usdBrl.value} exige atenção em insumos importados.`
      : `Juros controlados e PIB ${pib.value}% — janela para expansão. Acesse BNDES e Pronampe.`

  const stats = [
    { label: 'SELIC',   value: `${selic.value}%`,   sub: 'ao ano',     color: selic.value > 13 ? '#f87171' : selic.value > 10 ? '#fbbf24' : '#34d399' },
    { label: 'IPCA',    value: `${ipca.value}%`,    sub: '12m · IBGE', color: ipca.value > 5 ? '#f87171' : ipca.value > 3.5 ? '#fbbf24' : '#34d399' },
    { label: 'USD/BRL', value: `R$${usdBrl.value}`, sub: pctSign(usdBrl.delta), color: pctColor(usdBrl.delta) },
    { label: 'PIB',     value: `${pib.value}%`,     sub: 'projeção Focus', color: pctColor(pib.delta) },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.38 }}
      style={{ background: 'rgba(5,5,5,0.94)', border: '1px solid rgba(200,200,200,0.07)', borderRadius: 18, overflow: 'hidden' }}>
      <div style={{ padding: '11px 12px 9px', borderBottom: '1px solid rgba(200,200,200,0.05)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 7.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(192,192,192,0.28)', fontWeight: 700, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>Macro · 01</span>
        <AudioButton color={signal.color} text={`Indicadores macro. SELIC ${selic.value} por cento ao ano. IPCA ${ipca.value} por cento em doze meses. Dólar R$${usdBrl.value}. PIB projeção ${pib.value} por cento. ${decisao}`} />
        <span style={{ fontSize: 7, fontFamily: 'monospace', fontWeight: 700, color: signal.color, background: signal.color + '18', border: `1px solid ${signal.color}28`, borderRadius: 99, padding: '2px 7px', textTransform: 'uppercase', letterSpacing: '0.10em', flexShrink: 0 }}>{signal.label}</span>
      </div>
      <div style={{ padding: '12px 12px 10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {stats.map(s => (
          <div key={s.label}>
            <p style={{ fontSize: 7, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(192,192,192,0.24)', marginBottom: 3 }}>{s.label}</p>
            <p style={{ fontSize: 17, fontWeight: 800, fontFamily: 'monospace', color: 'rgba(235,235,235,0.90)', lineHeight: 1, marginBottom: 3 }}>{s.value}</p>
            <p style={{ fontSize: 9, fontFamily: 'monospace', color: s.color, fontWeight: 600 }}>{s.sub}</p>
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 12px 13px', borderTop: '1px solid rgba(200,200,200,0.04)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: signal.color, marginTop: 4, flexShrink: 0 }} />
        <p style={{ fontSize: 10.5, color: 'rgba(208,208,208,0.44)', lineHeight: 1.65 }}>{decisao}</p>
      </div>
    </motion.div>
  )
})

// ════════════════════════════════════════════════════════════════════════════
// ██  COMMODITIES STATS PANEL
// ════════════════════════════════════════════════════════════════════════════

const CommoditiesStatsPanel = memo(function CommoditiesStatsPanel({ data }: { data: MarketData }) {
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
      ? `Petróleo +${oilDelta.toFixed(1)}% pressiona frete e energia. Renegocie contratos logísticos e revise repasse de custos na precificação.`
      : goldDelta > 1.5
      ? 'Alta do ouro sinaliza aversão a risco global. Revise exposição cambial e considere hedge para operações em dólar.'
      : 'Commodities estáveis — fixe contratos de insumos ao preço atual antes de nova volatilidade.'

  const items = [
    { id: 'oil',    label: 'PETRÓLEO', value: oil?.value    ? `$${oil.value}`    : '—', delta: oilDelta,          unit: 'USD/barril' },
    { id: 'gold',   label: 'OURO',     value: gold?.value   ? `$${gold.value}`   : '—', delta: goldDelta,         unit: 'USD/onça' },
    { id: 'silver', label: 'PRATA',    value: silver?.value ? `$${silver.value}` : '—', delta: silver?.delta ?? 0, unit: 'USD/onça' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.38, delay: 0.06 }}
      style={{ background: 'rgba(5,5,5,0.94)', border: '1px solid rgba(200,200,200,0.07)', borderRadius: 18, overflow: 'hidden' }}>
      <div style={{ padding: '11px 12px 9px', borderBottom: '1px solid rgba(200,200,200,0.05)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 7.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(192,192,192,0.28)', fontWeight: 700, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>Comod · 04</span>
        <AudioButton color={signal.color} text={`Commodities. Petróleo ${oil?.value ? `$${oil.value} por barril` : 'indisponível'}, variação ${pctSign(oilDelta)}. Ouro ${gold?.value ? `$${gold.value} por onça` : 'indisponível'}, variação ${pctSign(goldDelta)}. Prata ${silver?.value ? `$${silver.value} por onça` : 'indisponível'}. ${decisao}`} />
        <span style={{ fontSize: 7, fontFamily: 'monospace', fontWeight: 700, color: signal.color, background: signal.color + '18', border: `1px solid ${signal.color}28`, borderRadius: 99, padding: '2px 7px', textTransform: 'uppercase', letterSpacing: '0.10em', flexShrink: 0 }}>{signal.label}</span>
      </div>
      <div style={{ padding: '12px 12px 8px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {items.map(item => {
          const col = item.delta !== 0 ? pctColor(item.delta) : '#c0c0c0'
          return (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 7, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(192,192,192,0.26)', marginBottom: 2 }}>{item.label}</p>
                <p style={{ fontSize: 15, fontWeight: 800, fontFamily: 'monospace', color: 'rgba(235,235,235,0.88)', lineHeight: 1 }}>{item.value}</p>
                <p style={{ fontSize: 8, color: 'rgba(192,192,192,0.28)', marginTop: 1 }}>{item.unit}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                <Sparkline id={item.id} delta={item.delta} color={col} w={36} h={16} />
                <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: col }}>{pctSign(item.delta)}</span>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ padding: '10px 12px 13px', borderTop: '1px solid rgba(200,200,200,0.04)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: signal.color, marginTop: 4, flexShrink: 0 }} />
        <p style={{ fontSize: 10.5, color: 'rgba(208,208,208,0.44)', lineHeight: 1.65 }}>{decisao}</p>
      </div>
    </motion.div>
  )
})

// ════════════════════════════════════════════════════════════════════════════
// ██  CREDIT STATS PANEL
// ════════════════════════════════════════════════════════════════════════════

const CreditStatsPanel = memo(function CreditStatsPanel({ data }: { data: MarketData }) {
  const rates = data.creditRates
  const selic = data.macro.selic.value
  const items = rates ? [
    { label: 'PJ Total',  value: rates.total?.value     ?? 0 },
    { label: 'Comércio',  value: rates.comercio?.value  ?? 0 },
    { label: 'Serviços',  value: rates.servicos?.value  ?? 0 },
    { label: 'Indústria', value: rates.industria?.value ?? 0 },
    { label: 'Agro',      value: rates.agro?.value      ?? 0 },
  ] : []
  const valid    = items.filter(i => i.value > 0)
  const avgRate  = valid.length > 0 ? valid.reduce((s, i) => s + i.value, 0) / valid.length : selic + 15
  const signal   =
    avgRate > 28 ? { label: 'CARO',       color: '#f87171' } :
    avgRate > 18 ? { label: 'MODERADO',   color: '#fbbf24' } :
    { label: 'ACESSÍVEL', color: '#34d399' }
  const decisao  =
    avgRate > 28
      ? `Crédito PJ médio ${avgRate.toFixed(0)}% a.a. — use adiantamento de recebíveis (FIDC/factoring) em vez de dívida bancária.`
      : avgRate > 18
      ? 'Taxas moderadas — acesse BNDES e linhas com FGI para reduzir spread antes de contratar.'
      : 'Crédito acessível — refinancie dívidas caras e estenda prazo de capital de giro agora.'
  const maxR = valid.length > 0 ? Math.max(...valid.map(i => i.value), 1) : 40

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.38, delay: 0.12 }}
      style={{ background: 'rgba(5,5,5,0.94)', border: '1px solid rgba(200,200,200,0.07)', borderRadius: 18, overflow: 'hidden' }}>
      <div style={{ padding: '11px 12px 9px', borderBottom: '1px solid rgba(200,200,200,0.05)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 7.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(192,192,192,0.28)', fontWeight: 700, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>Crédito PJ · 05</span>
        <AudioButton color={signal.color} text={`Crédito PJ. Taxa média ${avgRate.toFixed(1)} por cento ao ano. Spread sobre SELIC: mais ${(avgRate - selic).toFixed(0)} pontos percentuais. ${decisao}`} />
        <span style={{ fontSize: 7, fontFamily: 'monospace', fontWeight: 700, color: signal.color, background: signal.color + '18', border: `1px solid ${signal.color}28`, borderRadius: 99, padding: '2px 7px', textTransform: 'uppercase', letterSpacing: '0.10em', flexShrink: 0 }}>{signal.label}</span>
      </div>
      <div style={{ padding: '12px 12px 6px', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <div>
          <p style={{ fontSize: 7, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(192,192,192,0.24)', marginBottom: 2 }}>Taxa Média</p>
          <p style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace', color: 'rgba(235,235,235,0.90)', lineHeight: 1 }}>{avgRate.toFixed(1)}%</p>
          <p style={{ fontSize: 8, color: 'rgba(192,192,192,0.28)', marginTop: 2 }}>a.a. PJ</p>
        </div>
        <div>
          <p style={{ fontSize: 7, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(192,192,192,0.24)', marginBottom: 2 }}>Spread</p>
          <p style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: signal.color }}>+{(avgRate - selic).toFixed(0)} pp</p>
        </div>
      </div>
      {valid.length > 0 && (
        <div style={{ padding: '8px 12px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {valid.map((item, idx) => {
            const rc = item.value > 28 ? '#f87171' : item.value > 18 ? '#fbbf24' : '#34d399'
            return (
              <motion.div key={item.label}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                viewport={{ once: true }} transition={{ delay: idx * 0.06 }}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 7.5, fontFamily: 'monospace', color: 'rgba(192,192,192,0.28)', width: 48, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                <div style={{ flex: 1, height: 4, background: 'rgba(200,200,200,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }} whileInView={{ width: `${(item.value / maxR) * 100}%` }}
                    viewport={{ once: true }} transition={{ duration: 0.9, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    style={{ height: '100%', borderRadius: 2, background: `linear-gradient(90deg, ${rc}50, ${rc})` }}
                  />
                </div>
                <span style={{ fontSize: 9.5, fontFamily: 'monospace', fontWeight: 700, color: rc, width: 30, textAlign: 'right', flexShrink: 0 }}>{item.value}%</span>
              </motion.div>
            )
          })}
        </div>
      )}
      <div style={{ padding: '10px 12px 13px', borderTop: '1px solid rgba(200,200,200,0.04)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: signal.color, marginTop: 4, flexShrink: 0 }} />
        <p style={{ fontSize: 10.5, color: 'rgba(208,208,208,0.44)', lineHeight: 1.65 }}>{decisao}</p>
      </div>
    </motion.div>
  )
})

// ════════════════════════════════════════════════════════════════════════════
// ██  SECTOR CARD  (compact — mesmo estilo CreditStatsPanel)
// ════════════════════════════════════════════════════════════════════════════

const SectorCard = memo(function SectorCard({ sectors }: { sectors: Sector[] }) {
  const sorted  = [...sectors].sort((a, b) => b.heat - a.heat)
  const top     = sorted[0]
  const bottom  = sorted[sorted.length - 1]

  const heatColor = (h: number) =>
    h >= 75 ? '#34d399' : h >= 60 ? '#a3e635' : h >= 45 ? '#fbbf24' : h >= 30 ? '#fb923c' : '#f87171'

  const signalLabel = (h: number) =>
    h >= 75 ? 'OPORTUNIDADE' : h >= 50 ? 'NEUTRO' : h >= 30 ? 'CAUTELA' : 'RISCO'

  const topColor   = heatColor(top?.heat ?? 0)
  const badge      = { label: signalLabel(top?.heat ?? 0), color: topColor }

  const decisao =
    (top?.heat ?? 0) >= 75
      ? `${top.label} lidera com heat ${top.heat}/100. Concentre recursos aqui — janela de oportunidade aberta. Evite ${bottom.label} (heat ${bottom.heat}/100).`
      : (top?.heat ?? 0) >= 50
      ? `Mercado neutro — nenhum setor em alta forte. Foque em eficiência antes de expansão. Monitor ${top.label} como candidato.`
      : `Ambiente de cautela generalizada. Preserve caixa e aguarde sinal de reversão antes de novos projetos.`

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.38, delay: 0.18 }}
      style={{ background: 'rgba(5,5,5,0.94)', border: '1px solid rgba(200,200,200,0.07)', borderRadius: 18, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '11px 12px 9px', borderBottom: '1px solid rgba(200,200,200,0.05)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 7.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(192,192,192,0.28)', fontWeight: 700, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>Setores · 09</span>
        <AudioButton color={badge.color} text={`Análise setorial. Setor líder: ${top?.label}, score ${top?.heat} de 100. Maior risco: ${bottom?.label}, score ${bottom?.heat} de 100. ${sorted.map(s => `${s.label}: ${s.heat}`).join('. ')}. ${decisao}`} />
        <span style={{ fontSize: 7, fontFamily: 'monospace', fontWeight: 700, color: badge.color, background: badge.color + '18', border: `1px solid ${badge.color}28`, borderRadius: 99, padding: '2px 7px', textTransform: 'uppercase', letterSpacing: '0.10em', flexShrink: 0 }}>{badge.label}</span>
      </div>

      {/* Top stat */}
      {top && (
        <div style={{ padding: '12px 12px 6px', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div>
            <p style={{ fontSize: 7, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(192,192,192,0.24)', marginBottom: 2 }}>Setor Líder</p>
            <p style={{ fontSize: 17, fontWeight: 800, fontFamily: 'monospace', color: 'rgba(235,235,235,0.90)', lineHeight: 1 }}>{top.heat}<span style={{ fontSize: 11, color: 'rgba(192,192,192,0.35)', marginLeft: 2 }}>/100</span></p>
            <p style={{ fontSize: 8, color: topColor, marginTop: 3, fontWeight: 600 }}>{top.label}</p>
          </div>
          <div>
            <p style={{ fontSize: 7, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(192,192,192,0.24)', marginBottom: 2 }}>Maior Risco</p>
            <p style={{ fontSize: 14, fontWeight: 700, fontFamily: 'monospace', color: heatColor(bottom?.heat ?? 0) }}>{bottom?.heat ?? 0}/100</p>
            <p style={{ fontSize: 8.5, color: 'rgba(192,192,192,0.30)', marginTop: 1 }}>{bottom?.label}</p>
          </div>
        </div>
      )}

      {/* Bar list */}
      <div style={{ padding: '8px 12px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sorted.map((s, idx) => {
          const col = heatColor(s.heat)
          return (
            <motion.div key={s.id}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: idx * 0.05 }}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 7.5, fontFamily: 'monospace', color: 'rgba(192,192,192,0.28)', width: 68, flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</span>
              <div style={{ flex: 1, height: 4, background: 'rgba(200,200,200,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }} whileInView={{ width: `${s.heat}%` }}
                  viewport={{ once: true }} transition={{ duration: 0.9, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: '100%', borderRadius: 2, background: `linear-gradient(90deg, ${col}50, ${col})` }}
                />
              </div>
              <span style={{ fontSize: 10.5, fontFamily: 'monospace', fontWeight: 700, color: col, width: 26, textAlign: 'right', flexShrink: 0 }}>{s.heat}</span>
            </motion.div>
          )
        })}
      </div>

      {/* Decisão */}
      <div style={{ padding: '10px 12px 10px', borderTop: '1px solid rgba(200,200,200,0.04)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: topColor, marginTop: 4, flexShrink: 0 }} />
        <p style={{ fontSize: 10.5, color: 'rgba(208,208,208,0.44)', lineHeight: 1.65 }}>{decisao}</p>
      </div>

      {/* Metodologia */}
      <div style={{ padding: '8px 12px 12px', borderTop: '1px solid rgba(200,200,200,0.05)', background: 'rgba(255,255,255,0.015)' }}>
        <p style={{ fontSize: 8.5, fontFamily: 'monospace', color: 'rgba(192,192,192,0.48)', lineHeight: 1.7 }}>
          <span style={{ color: 'rgba(192,192,192,0.30)', textTransform: 'uppercase', letterSpacing: '0.18em', marginRight: 7 }}>~cálculo</span>
          Heat score = base editorial por setor (Tech 95, Agro 88, Saúde 82, Energia 76, Fintech 71, Logística 65, Serviços 42, Varejo 18, Mídia 5) ajustada pela variação diária real da B3 (×5). Dado ao vivo.
        </p>
      </div>
    </motion.div>
  )
})

// ════════════════════════════════════════════════════════════════════════════
// ██  SECTOR HEATMAP
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

const SectorHeatmap = memo(function SectorHeatmap({ sectors }: { sectors: Sector[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const sorted = [...sectors].sort((a, b) => b.heat - a.heat)

  const heatColor = (h: number) =>
    h >= 75 ? '#34d399' :
    h >= 60 ? '#a3e635' :
    h >= 45 ? '#fbbf24' :
    h >= 30 ? '#fb923c' :
    '#f87171'

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 175px), 1fr))', gap: 8 }}>
        {sorted.map((s, i) => {
          const color = heatColor(s.heat)
          const isSelected = selected === s.id
          const signalLabel =
            s.heat >= 75 ? 'OPORTUNIDADE' :
            s.heat >= 50 ? 'NEUTRO' :
            s.heat >= 30 ? 'CAUTELA' : 'RISCO'
          return (
            <motion.button key={s.id}
              initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              onClick={() => setSelected(isSelected ? null : s.id)}
              style={{ background: isSelected ? `linear-gradient(135deg, ${color}18, ${color}08)` : `linear-gradient(135deg, ${color}10, ${color}04)`, border: `1px solid ${isSelected ? color + '55' : color + '22'}`, borderRadius: 14, padding: '13px 14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 9 }}>
                <span style={{ fontSize: 10, color: 'rgba(220,220,220,0.68)', fontWeight: 600, lineHeight: 1.3, flex: 1, marginRight: 8 }}>{s.label}</span>
                <span style={{ fontSize: 22, fontWeight: 800, fontFamily: 'monospace', color, lineHeight: 1, flexShrink: 0 }}>{s.heat}</span>
              </div>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 6 }}>
                <div style={{ height: '100%', width: `${s.heat}%`, background: color, borderRadius: 2 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 7, fontFamily: 'monospace', color: color + '80', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>{signalLabel}</span>
                <span style={{ fontSize: 8.5, fontFamily: 'monospace', color: pctColor(s.change), fontWeight: 700 }}>{s.change >= 0 ? '+' : ''}{s.change}%</span>
              </div>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {selected && (() => {
          const sector = sorted.find(s => s.id === selected)!
          const analysis = SECTOR_ANALYSIS[selected]
          const color = heatColor(sector.heat)
          return (
            <motion.div
              key={selected}
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden', marginTop: 10 }}
            >
              <div style={{ background: 'rgba(5,5,5,0.96)', border: `1px solid ${color}25`, borderRadius: 16, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(228,228,228,0.85)' }}>{sector.label}</span>
                  <span style={{ fontSize: 7, fontFamily: 'monospace', fontWeight: 700, color, background: color + '18', border: `1px solid ${color}28`, borderRadius: 99, padding: '2px 9px', textTransform: 'uppercase', letterSpacing: '0.14em' }}>Heat {sector.heat}/100</span>
                  {analysis?.quem && <span style={{ fontSize: 9, color: 'rgba(192,192,192,0.32)', marginLeft: 'auto' }}>{analysis.quem}</span>}
                </div>
                {analysis && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))', gap: 12 }}>
                    {[
                      { label: 'Oportunidades', text: analysis.oportunidade, color: '#34d399' },
                      { label: 'Riscos',         text: analysis.risco,        color: '#f87171' },
                      { label: 'Como Atuar',     text: analysis.como,         color: '#c0c0c0' },
                    ].map(col => (
                      <div key={col.label}>
                        <p style={{ fontSize: 7, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: col.color + 'aa', marginBottom: 6, fontWeight: 700 }}>{col.label}</p>
                        <p style={{ fontSize: 11, color: 'rgba(208,208,208,0.50)', lineHeight: 1.68 }}>{col.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </div>
  )
})

// ════════════════════════════════════════════════════════════════════════════
// ██  INTELLIGENCE CARDS  (Marketing · Sustentabilidade · Liderança)
// ════════════════════════════════════════════════════════════════════════════

interface IntelStat { label: string; value: string; color: string; source?: string }

const IntelCard = memo(function IntelCard({ num, label, badge, badgeColor, stats, insight, decisao, decisaoColor, footnote }: {
  num: string; label: string
  badge: string; badgeColor: string
  stats: IntelStat[]
  insight: string
  decisao: string; decisaoColor: string
  footnote?: string
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.38 }}
      style={{ background: 'rgba(5,5,5,0.94)', border: '1px solid rgba(200,200,200,0.07)', borderRadius: 18, overflow: 'hidden' }}>
      <div style={{ padding: '11px 16px 9px', borderBottom: '1px solid rgba(200,200,200,0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 7.5, fontFamily: 'monospace', color: 'rgba(192,192,192,0.18)', letterSpacing: '0.2em' }}>{num}</span>
        <div style={{ width: 1, height: 10, background: 'rgba(200,200,200,0.10)', flexShrink: 0 }} />
        <span style={{ fontSize: 8, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.28em', color: 'rgba(192,192,192,0.40)', fontWeight: 700 }}>{label}</span>
        <AudioButton color={badgeColor} text={`${label}. ${stats.map(s => `${s.label}: ${s.value}`).join('. ')}. ${insight} Decisão: ${decisao}`} />
        <span style={{ fontSize: 7, fontFamily: 'monospace', fontWeight: 700, color: badgeColor, background: badgeColor + '18', border: `1px solid ${badgeColor}28`, borderRadius: 99, padding: '2px 9px', textTransform: 'uppercase', letterSpacing: '0.14em' }}>{badge}</span>
      </div>
      <div style={{ padding: '14px 16px 10px', display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 12 }}>
        {stats.map(s => (
          <div key={s.label}>
            <p style={{ fontSize: 7.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(192,192,192,0.24)', marginBottom: 4 }}>{s.label}</p>
            <p style={{ fontSize: 20, fontWeight: 800, fontFamily: 'monospace', color: s.color, lineHeight: 1 }}>{s.value}</p>
            {s.source && (
              <p style={{ fontSize: 7.5, fontFamily: 'monospace', color: 'rgba(192,192,192,0.50)', marginTop: 5, lineHeight: 1.5, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 5, padding: '2px 6px', display: 'inline-block' }}>{s.source}</p>
            )}
          </div>
        ))}
      </div>
      <div style={{ padding: '8px 16px 10px', borderTop: '1px solid rgba(200,200,200,0.04)', borderBottom: '1px solid rgba(200,200,200,0.04)' }}>
        <p style={{ fontSize: 11, color: 'rgba(208,208,208,0.38)', lineHeight: 1.68 }}>{insight}</p>
      </div>
      <div style={{ padding: '10px 16px 13px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: decisaoColor, marginTop: 4, flexShrink: 0 }} />
        <p style={{ fontSize: 11, color: 'rgba(210,210,210,0.52)', lineHeight: 1.65 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 7.5, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(192,192,192,0.22)', marginRight: 8 }}>DECISÃO</span>
          {decisao}
        </p>
      </div>
      {footnote && (
        <div style={{ padding: '8px 16px 12px', borderTop: '1px solid rgba(200,200,200,0.05)', background: 'rgba(255,255,255,0.015)' }}>
          <p style={{ fontSize: 8.5, fontFamily: 'monospace', color: 'rgba(192,192,192,0.48)', lineHeight: 1.7 }}>
            <span style={{ color: 'rgba(192,192,192,0.30)', textTransform: 'uppercase', letterSpacing: '0.18em', marginRight: 7 }}>~cálculo</span>{footnote}
          </p>
        </div>
      )}
    </motion.div>
  )
})

const MarketingIntel = memo(function MarketingIntel({ data }: { data: MarketData }) {
  const { ipca, pib, selic } = data.macro
  const retail = data.sectors.find(s => s.id === 'retail')
  const media  = data.sectors.find(s => s.id === 'media')
  const icc    = Math.round(clamp(60 + pib.value * 4 - ipca.value * 3 - (selic.value - 10) * 1.5, 20, 90))
  const iccCol = icc >= 65 ? '#34d399' : icc >= 50 ? '#fbbf24' : '#f87171'
  const signal = icc >= 65 ? { label: 'AQUECIDA', color: '#34d399' } : icc >= 50 ? { label: 'MODERADA', color: '#fbbf24' } : { label: 'RETRAÍDA', color: '#f87171' }
  const decisao = icc >= 65
    ? 'Confiança elevada — invista em aquisição agora. CAC é mais eficiente em ciclos de expansão de consumo.'
    : icc >= 50
    ? `IPCA ${ipca.value}% comprime poder de compra. Enfatize custo-benefício e valor percebido na comunicação.`
    : 'Demanda retraída — priorize retenção e LTV sobre aquisição. Fidelização tem ROI superior neste ciclo.'
  return (
    <IntelCard num="06" label="Marketing"
      badge={signal.label} badgeColor={signal.color}
      stats={[
        { label: 'Confiança', value: String(icc),                color: iccCol,                          source: `~Proxy: 60 + PIB×4 − IPCA×3 − (SELIC−10)×1.5` },
        { label: 'Demanda',   value: String(retail?.heat ?? 55), color: pctColor(retail?.change ?? 0),   source: `~Heat varejo: base edit. + Δ B3 ×5` },
        { label: 'Mídia',     value: String(media?.heat ?? 58),  color: pctColor(media?.change ?? 0),    source: `~Heat mídia: base edit. + Δ B3 ×5` },
      ]}
      insight={`Índice de Confiança (proxy) ${icc}/100. Demanda online ${retail?.heat ?? 55}/100, variação ${pctSign(retail?.change ?? 0)}. Mídia digital ${media?.heat ?? 58}/100.`}
      decisao={decisao} decisaoColor={signal.color}
      footnote={`ICC não usa API oficial — é calculado via fórmula proxy com dados reais do BCB (SELIC, IPCA, PIB Focus). Demanda e Mídia = scores setoriais: base editorial calibrada + variação diária real da B3.`}
    />
  )
})

const SustentabilidadeIntel = memo(function SustentabilidadeIntel({ data }: { data: MarketData }) {
  const energy = data.sectors.find(s => s.id === 'energy')
  const agro   = data.sectors.find(s => s.id === 'agro')
  const green  = Math.round(clamp(((energy?.heat ?? 55) + (agro?.heat ?? 50)) / 2 + 5, 10, 95))
  const rc     = green < 50 ? '#f87171' : green < 70 ? '#fbbf24' : '#34d399'
  const risk   = green < 50 ? 'ALTO' : green < 70 ? 'MÉDIO' : 'BAIXO'
  const decisao = green < 50
    ? 'Risco ESG elevado — acesse crédito verde (LCA, CRA) para reduzir custo de capital e atrair investidores institucionais.'
    : green < 70
    ? 'Perfil ESG moderado. Implemente relatório GRI/SASB para acessar capital verde com spread 15–25% menor.'
    : 'Bom score ESG — capitalize na narrativa para green bonds e fundos de impacto com menor custo de capital.'
  return (
    <IntelCard num="07" label="Sustentabilidade"
      badge={`RISCO ${risk}`} badgeColor={rc}
      stats={[
        { label: 'Green Score', value: String(green),               color: rc,                            source: `~(Energia + Agro) ÷ 2 + 5` },
        { label: 'Energia',     value: String(energy?.heat ?? '—'), color: pctColor(energy?.change ?? 0), source: `~Heat setor: base edit. + Δ B3 ×5` },
        { label: 'Agro',        value: String(agro?.heat ?? '—'),   color: pctColor(agro?.change ?? 0),   source: `~Heat setor: base edit. + Δ B3 ×5` },
      ]}
      insight={`Score ESG proxy ${green}/100. Energia renovável: ${energy?.heat ?? '—'}/100. Agro sustentável: ${agro?.heat ?? '—'}/100. Crédito verde (LCA/CRA) disponível.`}
      decisao={decisao} decisaoColor={rc}
      footnote={`Green Score não usa API oficial — é calculado como média dos heats de Energia e Agro + 5 pontos. Cada heat setorial combina base editorial (calibrada para BR) com variação diária real da B3.`}
    />
  )
})

const LiderancaIntel = memo(function LiderancaIntel({ data }: { data: MarketData }) {
  const { ipca, pib } = data.macro
  const tech     = data.sectors.find(s => s.id === 'tech')
  const services = data.sectors.find(s => s.id === 'services')
  const desemp   = clamp(6.5 - pib.value * 0.4, 4.5, 12).toFixed(1)
  const salPress = ipca.value > 4.5 ? 'ALTA' : ipca.value > 3 ? 'MÉDIA' : 'BAIXA'
  const salCol   = ipca.value > 4.5 ? '#f87171' : ipca.value > 3 ? '#fbbf24' : '#34d399'
  const signal   = ipca.value > 5 ? { label: 'PRESSÃO SAL.', color: '#f87171' } : pib.value > 2 ? { label: 'AQUECIDO', color: '#fbbf24' } : { label: 'ESTÁVEL', color: '#34d399' }
  const decisao  = ipca.value > 5
    ? `IPCA ${ipca.value}% gera pressão salarial. Antecipe revisões e implemente benefícios não-monetários para reter talentos.`
    : pib.value > 2
    ? 'PIB em expansão aquece mercado de talentos. Acelere contratações estratégicas antes que fique mais caro.'
    : 'Mercado equilibrado — boa janela para contratar talentos a custo moderado. Priorize tech e eficiência.'
  return (
    <IntelCard num="08" label="Liderança"
      badge={signal.label} badgeColor={signal.color}
      stats={[
        { label: 'Desemprego',   value: `${desemp}%`,              color: Number(desemp) > 8 ? '#f87171' : '#34d399', source: `~Proxy PNAD: 6,5 − PIB×0,4` },
        { label: 'Pressão Sal.', value: salPress,                   color: salCol,                                     source: `~Derivado do IPCA real (BCB)` },
        { label: 'Demanda Tech', value: String(tech?.heat ?? '—'),  color: pctColor(tech?.change ?? 0),                source: `~Heat setor: base edit. + Δ B3 ×5` },
      ]}
      insight={`Desemprego estimado ${desemp}% (proxy PNAD). Pressão salarial ${salPress} com IPCA ${ipca.value}%. Demanda por tech ${tech?.heat ?? '—'}/100 · Serviços ${services?.heat ?? '—'}/100.`}
      decisao={decisao} decisaoColor={signal.color}
      footnote={`Desemprego usa proxy: 6,5 − PIB×0,4 (clamp 4,5–12%) — IBGE/PNAD divulgado mensalmente, sem API em tempo real. Pressão Salarial derivada do IPCA real do BCB. Demanda Tech = heat setorial (base editorial + Δ B3).`}
    />
  )
})

// ════════════════════════════════════════════════════════════════════════════
// ██  PLANO DE AÇÃO IA
// ════════════════════════════════════════════════════════════════════════════

const ActionPlan = memo(function ActionPlan({ data, userSector }: { data: MarketData; userSector?: string }) {
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
          <div className="flex justify-between items-center mt-3">
            <AudioButton color="#34d399" text={typed} />
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
})

// ════════════════════════════════════════════════════════════════════════════
// ██  IA MARKET INTELLIGENCE
// ════════════════════════════════════════════════════════════════════════════

const IA_PRESETS = [
  'Análise geral do mercado agora',
  'Qual setor tem mais oportunidade?',
  'Impacto da SELIC no meu negócio',
  'Riscos externos mais críticos',
]

function MicButton({ onResult }: { onResult: (text: string) => void }) {
  const [listening, setListening] = useState(false)
  const recRef = useRef<unknown>(null)

  const toggle = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SRClass = ((window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition) as (new() => any) | undefined
    if (!SRClass) return
    if (listening) { (recRef.current as any)?.stop(); setListening(false); return }
    const rec = new SRClass()
    rec.lang = 'pt-BR'
    rec.continuous = false
    rec.interimResults = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => { onResult(e.results[0][0].transcript); setListening(false) }
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
    recRef.current = rec
    rec.start()
    setListening(true)
  }

  return (
    <button onClick={toggle} title={listening ? 'Parar gravação' : 'Falar pergunta'}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: listening ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${listening ? '#f87171' : 'rgba(255,255,255,0.10)'}`, cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' }}>
      {listening ? (
        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.7, repeat: Infinity }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <rect x="4" y="1" width="4" height="6" rx="2" fill="#f87171" />
            <path d="M2 6c0 2.2 1.8 4 4 4s4-1.8 4-4" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <line x1="6" y1="10" x2="6" y2="12" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </motion.div>
      ) : (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <rect x="4" y="1" width="4" height="6" rx="2" fill="rgba(255,255,255,0.35)" />
          <path d="M2 6c0 2.2 1.8 4 4 4s4-1.8 4-4" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <line x1="6" y1="10" x2="6" y2="12" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )}
    </button>
  )
}

const IaAdvisor = memo(function IaAdvisor({ data, userSector }: { data: MarketData; userSector?: string }) {
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
        {typed && !loading && <AudioButton color={signalColor} text={typed} />}
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
        <MicButton onResult={text => { setInput(text); setTimeout(() => { runQuery(text); setInput('') }, 200) }} />
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
})

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

  const handleRefresh = useCallback(async () => {
    if (refreshing || !refetch) return
    setRefreshing(true)
    await refetch()
    setTimeout(() => setRefreshing(false), 1200)
  }, [refreshing, refetch])

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
    <motion.div className="relative flex flex-col gap-5 pb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      <div className="flex flex-col gap-5">

        {/* Globe hero */}
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

        {/* Chart + Analysis + B3 */}
        <div id="section-mercado">
          <SectionLabel label="Mercado & B3" sub="índices, ações e variação" />
          <MarketPanel data={data} />
        </div>

        {/* 3-col stats */}
        <div id="section-macro">
          <SectionLabel label="Dados Estruturais" sub="macro · commodities · crédito · setores" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MacroStatsPanel data={data} />
            <CommoditiesStatsPanel data={data} />
            <CreditStatsPanel data={data} />
            <SectorCard sectors={data.sectors} />
          </div>
        </div>

        {/* Intel 3-col */}
        <div id="section-intel">
          <SectionLabel label="Inteligência de Gestão" sub="marketing · sustentabilidade · liderança" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 12 }}>
            <MarketingIntel data={data} />
            <SustentabilidadeIntel data={data} />
            <LiderancaIntel data={data} />
          </div>
        </div>

        {/* AI */}
        <div id="section-ia">
          <SectionLabel label="Executive Intelligence · IA" sub="análise e plano de ação com dados reais" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 440px), 1fr))', gap: 14 }}>
            <ActionPlan data={data} userSector={userSector} />
            <IaAdvisor data={data} userSector={userSector} />
          </div>
        </div>

      </div>
    </motion.div>
  )
}
