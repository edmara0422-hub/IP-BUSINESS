'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { apiFetch } from '@/lib/api'

const Globe3D = dynamic(() => import('./Globe3D'), { ssr: false, loading: () => <div className="flex h-full items-center justify-center"><span className="text-[10px] text-white/20">Carregando globo...</span></div> })

function v(n: number | undefined, fb: number) { return (n != null && Number.isFinite(n)) ? n : fb }

// ── AnimVal ──────────────────────────────────────────────────────────────
function AnimVal({ value, dec = 1, pre = '', suf = '' }: { value: number; dec?: number; pre?: string; suf?: string }) {
  const spring = useSpring(value, { stiffness: 60, damping: 18 })
  const display = useTransform(spring, (v: number) => `${pre}${v.toFixed(dec)}${suf}`)
  const [text, setText] = useState(`${pre}${value.toFixed(dec)}${suf}`)
  useEffect(() => { spring.set(value) }, [value, spring])
  useEffect(() => { const u = display.on('change', (val: string) => setText(val)); return u }, [display])
  return <span>{text}</span>
}

function LivePulse() {
  return <motion.span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400/60"
    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    style={{ boxShadow: '0 0 6px rgba(52,211,153,0.4)' }} />
}

function UpdateTimer() {
  const [sec, setSec] = useState(60)
  useEffect(() => { const t = setInterval(() => setSec(s => s <= 1 ? 60 : s - 1), 1000); return () => clearInterval(t) }, [])
  const pct = (sec / 60) * 100
  return (
    <div className="flex items-center gap-2">
      <svg width="18" height="18" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
        <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(52,211,153,0.3)" strokeWidth="2"
          strokeDasharray={`${pct * 0.94} 100`} strokeLinecap="round"
          transform="rotate(-90 18 18)" style={{ transition: 'stroke-dasharray 1s linear' }} />
      </svg>
      <span className="font-mono text-[10px] text-white/20">{sec}s</span>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ██  NEWS FEED
// ══════════════════════════════════════════════════════════════════════════

interface NewsItem { id: string; title: string; source: string; category: string; pubDate: string; link: string }

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

const CAT_META: Record<string, { label: string; color: string }> = {
  economia:   { label: 'Economia',  color: '#b7950b' },
  mercado:    { label: 'Mercado',   color: '#1e8449' },
  inovacao:   { label: 'Inovação',  color: '#2471a3' },
  tecnologia: { label: 'Tech',      color: '#7d3c98' },
  startups:   { label: 'Startups',  color: '#a04000' },
  all:        { label: 'Tudo',      color: 'rgba(255,255,255,0.35)' },
}

const SECTOR_MAP: Record<string, string> = {
  economia: 'Macro', mercado: 'Setores', tecnologia: 'Tech', startups: 'Inovação', inovacao: 'Inovação',
}

const NEG_WORDS = /queda|cai|perde|crise|risco|inflação|alta de juros/i
const POS_WORDS = /sobe|cresce|alta|recorde|oportunidade|investimento/i

function getSentiment(title: string): 'POSITIVO' | 'NEGATIVO' | 'NEUTRO' {
  if (NEG_WORDS.test(title)) return 'NEGATIVO'
  if (POS_WORDS.test(title)) return 'POSITIVO'
  return 'NEUTRO'
}

const SENTIMENT_COLORS: Record<string, string> = {
  POSITIVO: '#1e8449',
  NEGATIVO: '#c0392b',
  NEUTRO: '#9a7d0a',
}

// Thin ticker line
function NewsTicker({ news }: { news: NewsItem[] }) {
  if (news.length === 0) return null
  const items = [...news, ...news]
  return (
    <div className="overflow-hidden relative h-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="flex items-center h-full">
        <div className="shrink-0 flex items-center gap-1 px-2 h-full z-10"
          style={{ background: 'rgba(0,0,0,0.8)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <motion.div className="h-1.5 w-1.5 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
          <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-red-400/80">LIVE</span>
        </div>
        <div className="flex-1 overflow-hidden h-full">
          <div className="flex items-center h-full whitespace-nowrap" style={{ animation: 'marquee 60s linear infinite' }}>
            {items.map((n, i) => {
              const m = CAT_META[n.category] ?? CAT_META.all
              return (
                <a key={`${n.id}-${i}`} href={n.link} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 hover:bg-white/[0.03] transition-colors h-full">
                  <span className="font-mono text-[7px] font-bold tracking-widest uppercase" style={{ color: m.color }}>{m.label}</span>
                  <span className="text-[9px] text-white/45">{n.title}</span>
                  <span className="font-mono text-[7px] text-white/15">{timeAgo(n.pubDate)}</span>
                  <span className="text-white/10 text-[8px]">·</span>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function RichNewsCard({ item, index, isNew }: { item: NewsItem; index: number; isNew: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const meta = CAT_META[item.category] ?? CAT_META.all
  const minsOld = Math.floor((Date.now() - new Date(item.pubDate).getTime()) / 60000)
  const sentiment = getSentiment(item.title)
  const sentimentColor = SENTIMENT_COLORS[sentiment]
  const sector = SECTOR_MAP[item.category] ?? 'Geral'

  return (
    <motion.div className="relative rounded-lg overflow-hidden cursor-pointer"
      style={{
        background: 'rgba(0,0,0,0.3)',
        border: `1px solid ${expanded ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'}`,
        borderLeft: `3px solid ${meta.color}`,
      }}
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      whileHover={{ y: -2, transition: { type: 'spring', stiffness: 400, damping: 22 } }}
      onClick={() => setExpanded(e => !e)}>
      {/* Flash glow for new news */}
      {isNew && (
        <motion.div className="absolute inset-0 pointer-events-none"
          style={{ background: `${meta.color}08` }}
          animate={{ opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: 3 }} />
      )}

      <div className="px-3 py-3">
        {/* Top row: category badge + sector + NOVO badge */}
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <span className="font-mono text-[7px] font-bold tracking-[0.15em] uppercase px-1.5 py-0.5 rounded-sm"
            style={{ background: `${meta.color}20`, color: meta.color, border: `1px solid ${meta.color}33` }}>
            {meta.label}
          </span>
          <span className="font-mono text-[7px] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-sm"
            style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {sector}
          </span>
          <span className="font-mono text-[7px] font-bold px-1.5 py-0.5 rounded-sm"
            style={{ background: `${sentimentColor}18`, color: sentimentColor, border: `1px solid ${sentimentColor}33` }}>
            {sentiment}
          </span>
          {isNew && minsOld < 60 && (
            <motion.span className="font-mono text-[7px] font-bold tracking-widest px-1.5 py-0.5 rounded-sm ml-auto"
              style={{ background: `${meta.color}25`, color: meta.color, border: `1px solid ${meta.color}44` }}
              animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
              NOVO
            </motion.span>
          )}
        </div>

        {/* Source + time */}
        <div className="flex items-center gap-1.5 mb-1">
          <span className="font-mono text-[8px] text-white/25">{item.source}</span>
          <span className="font-mono text-[8px] text-white/15">·</span>
          <span className="font-mono text-[8px] text-white/15">{timeAgo(item.pubDate)}</span>
        </div>

        {/* Title */}
        <p className="text-[11px] font-medium leading-snug"
          style={{
            color: expanded ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)',
            WebkitLineClamp: expanded ? undefined : 2,
            display: expanded ? 'block' : '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
          {item.title}
        </p>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
              <a href={item.link} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2.5 font-mono text-[9px] hover:underline"
                style={{ color: meta.color }} onClick={e => e.stopPropagation()}>
                Ver notícia completa ↗
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [newCount, setNewCount] = useState(0)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchNews = useCallback(async () => {
    try {
      const res = await apiFetch('/api/news')
      if (res.ok) {
        const text = await res.text()
        const d = (text.startsWith('{') || text.startsWith('[')) ? JSON.parse(text) : { news: [] }
        const items: NewsItem[] = d.news ?? []
        setNews(prev => {
          const prevIds = new Set(prev.map(n => n.id))
          const fresh = items.filter(n => !prevIds.has(n.id))
          if (fresh.length > 0) setNewCount(c => c + fresh.length)
          return items
        })
        setLastUpdate(new Date())
      }
    } catch { /* silently fail */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    fetchNews()
    const t = setInterval(fetchNews, 60_000) // atualiza a cada 60s
    return () => clearInterval(t)
  }, [fetchNews])

  const filtered = filter === 'all' ? news : news.filter(n => n.category === filter)
  const cats = ['all', ...Array.from(new Set(news.map(n => n.category)))]
  const isNew = (id: string) => {
    const item = news.find(n => n.id === id)
    if (!item) return false
    return (Date.now() - new Date(item.pubDate).getTime()) < 3_600_000
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <LivePulse />
          <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-white/25 uppercase">Inteligência de Mercado</span>
          {lastUpdate && <span className="font-mono text-[8px] text-white/15">· {timeAgo(lastUpdate.toISOString())}</span>}
        </div>
        <div className="flex items-center gap-2">
          {newCount > 0 && (
            <motion.button className="font-mono text-[8px] font-bold px-2 py-0.5 rounded-sm"
              style={{ background: '#c0392b22', color: '#c0392b', border: '1px solid #c0392b44' }}
              animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1, repeat: 2 }}
              onClick={() => setNewCount(0)}>
              +{newCount} novas ×
            </motion.button>
          )}
          <UpdateTimer />
        </div>
      </div>

      {/* Ticker */}
      <NewsTicker news={news} />

      {/* Filters */}
      <div className="flex items-center gap-1 mt-3 mb-3 flex-wrap">
        {cats.slice(0, 6).map(cat => {
          const m = CAT_META[cat] ?? CAT_META.all
          const active = filter === cat
          const count = cat === 'all' ? news.length : news.filter(n => n.category === cat).length
          return (
            <button key={cat} onClick={() => setFilter(cat)}
              className="font-mono text-[8px] font-bold tracking-[0.1em] uppercase rounded-sm px-2.5 py-1 transition-all"
              style={{
                background: active ? `${m.color}22` : 'rgba(255,255,255,0.02)',
                color: active ? m.color : 'rgba(255,255,255,0.25)',
                border: `1px solid ${active ? m.color + '55' : 'rgba(255,255,255,0.05)'}`,
              }}>
              {m.label} <span style={{ opacity: 0.5 }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Rich news cards grid */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-4 w-4 animate-spin rounded-full border border-white/10 border-t-white/40" />
          <span className="font-mono text-[9px] text-white/20 ml-2">Carregando notícias reais...</span>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={filter} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
            {filtered.slice(0, 6).map((n, i) => (
              <RichNewsCard key={n.id} item={n} index={i} isNew={isNew(n.id)} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {filtered.length === 0 && !loading && (
        <p className="text-center font-mono text-[10px] text-white/18 py-4">Sem notícias nesta categoria</p>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ██  PANORAMA — COMMAND CENTER
// ══════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PanoramaSection({ data }: { data: any }) {
  const agents = data.globalAgents as Array<{ id: string; label: string; delta: number; impact: string }>
  const commodities = data.commodities as Record<string, { value: number; delta: number; label: string }>

  return (
    <div className="flex flex-col gap-5 px-4 pb-8">

      {/* ── Header: LIVE + Timer ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LivePulse />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Intelligence Network — Tempo Real</span>
        </div>
        <UpdateTimer />
      </div>

      {/* ══ BLOCO 1: GLOBO 3D CENTRAL + DADOS FLUTUANTES ══ */}
      <div>
        <div className="relative rounded-lg border border-white/[0.06] overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.01) 0%, rgba(0,0,0,0.5) 80%)' }}>
          {/* Question overlay */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 text-center">
            <p className="font-mono text-[8px] font-bold tracking-[0.3em] text-white/20 uppercase">Intelligence Platform Business</p>
            <h2 className="text-[15px] font-semibold text-white/60 mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Como está o mercado <span className="text-white/90">AGORA</span>?
            </h2>
          </div>

          {/* Globo grande centralizado */}
          <div className="h-[480px] lg:h-[540px]">
            <Globe3D data={{ agents }} />
          </div>

          {/* ── HUD Indicators ── */}
          <div className="absolute top-4 left-4 flex flex-col gap-3">
            {[
              { label: 'SELIC', value: v(data.macro.selic?.value, 10.5), suf: '%', dec: 1, delta: v(data.macro.selic?.delta, 0), desc: 'TAXA BÁSICA DE JUROS', min: 2, max: 20, alert: v(data.macro.selic?.value, 10.5) > 12 },
              { label: 'IPCA', value: v(data.macro.ipca?.value, 4.8), suf: '%', dec: 2, delta: v(data.macro.ipca?.delta, 0), desc: 'INFLAÇÃO 12 MESES', min: 0, max: 12, alert: v(data.macro.ipca?.value, 4.8) > 6 },
            ].map(ind => {
              const pct = Math.max(0, Math.min(100, ((ind.value - ind.min) / (ind.max - ind.min)) * 100))
              const alertColor = ind.alert ? 'rgba(192,57,43,0.7)' : 'rgba(192,192,192,0.4)'
              const ontem = (ind.value - ind.delta).toFixed(ind.dec)
              return (
                <motion.div key={ind.label} className="relative cursor-pointer group"
                  style={{ width: 148 }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                  <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(14px)' }} />
                  <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${alertColor}, transparent)` }} />
                  <svg className="absolute top-0 left-0" width="12" height="12"><path d="M0,10 L0,0 L10,0" fill="none" stroke={alertColor} strokeWidth="1.5"/></svg>
                  <svg className="absolute top-0 right-0" width="12" height="12"><path d="M12,10 L12,0 L2,0" fill="none" stroke={alertColor} strokeWidth="1.5"/></svg>
                  <svg className="absolute bottom-0 left-0" width="12" height="12"><path d="M0,2 L0,12 L10,12" fill="none" stroke={alertColor} strokeWidth="1.5"/></svg>
                  <svg className="absolute bottom-0 right-0" width="12" height="12"><path d="M12,2 L12,12 L2,12" fill="none" stroke={alertColor} strokeWidth="1.5"/></svg>
                  <motion.div className="absolute left-0 right-0 h-px pointer-events-none"
                    style={{ background: `linear-gradient(90deg, transparent, ${alertColor}, transparent)`, opacity: 0.4 }}
                    animate={{ top: ['0%', '100%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }} />
                  <div className="relative px-3 pt-2.5 pb-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9px] font-bold tracking-[0.2em]" style={{ color: alertColor }}>{ind.label}</span>
                      {ind.alert && <motion.span className="font-mono text-[8px] text-red-400/70" animate={{ opacity: [1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity }}>◆ ALERT</motion.span>}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[26px] font-bold leading-none text-white/90">
                        <AnimVal value={ind.value} dec={ind.dec} suf={ind.suf} />
                      </span>
                      <span className={`font-mono text-xs font-bold ${ind.delta > 0 ? 'text-red-400/70' : ind.delta < 0 ? 'text-emerald-400/70' : 'text-white/20'}`}>
                        {ind.delta > 0 ? '▲' : ind.delta < 0 ? '▼' : '–'}{Math.abs(ind.delta).toFixed(1)}
                      </span>
                    </div>
                    <div className="mt-2 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div className="h-full rounded-full" style={{ background: alertColor }}
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-mono text-[8px] tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.2)' }}>{ind.desc}</span>
                      <span className="font-mono text-[8px]" style={{ color: 'rgba(255,255,255,0.18)' }}>ONTEM {ontem}{ind.suf}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="absolute top-4 right-4 flex flex-col gap-3 items-end">
            {[
              { label: 'PIB', value: v(data.macro.pib?.value, 2.9), suf: '%', dec: 1, delta: v(data.macro.pib?.delta, 0), pre: '', desc: 'CRESCIMENTO ANUAL', min: -3, max: 8, good: v(data.macro.pib?.value, 2.9) > 2 },
              { label: 'USD/BRL', value: v(data.macro.usdBrl?.value, 5.72), pre: 'R$', suf: '', dec: 2, delta: v(data.macro.usdBrl?.delta, 0), desc: 'COTAÇÃO DO DÓLAR', min: 3, max: 8, good: false },
            ].map(ind => {
              const pct = Math.max(0, Math.min(100, ((ind.value - ind.min) / (ind.max - ind.min)) * 100))
              const color = ind.good ? 'rgba(52,211,153,0.6)' : 'rgba(192,192,192,0.4)'
              const ontem = ((ind.pre ?? '') + (ind.value - ind.delta).toFixed(ind.dec) + ind.suf)
              return (
                <motion.div key={ind.label} className="relative cursor-pointer group"
                  style={{ width: 148 }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                  <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(14px)' }} />
                  <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
                  <svg className="absolute top-0 left-0" width="12" height="12"><path d="M0,10 L0,0 L10,0" fill="none" stroke={color} strokeWidth="1.5"/></svg>
                  <svg className="absolute top-0 right-0" width="12" height="12"><path d="M12,10 L12,0 L2,0" fill="none" stroke={color} strokeWidth="1.5"/></svg>
                  <svg className="absolute bottom-0 left-0" width="12" height="12"><path d="M0,2 L0,12 L10,12" fill="none" stroke={color} strokeWidth="1.5"/></svg>
                  <svg className="absolute bottom-0 right-0" width="12" height="12"><path d="M12,2 L12,12 L2,12" fill="none" stroke={color} strokeWidth="1.5"/></svg>
                  <motion.div className="absolute left-0 right-0 h-px pointer-events-none"
                    style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: 0.4 }}
                    animate={{ top: ['0%', '100%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }} />
                  <div className="relative px-3 pt-2.5 pb-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9px] font-bold tracking-[0.2em]" style={{ color }}>{ind.label}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[26px] font-bold leading-none text-white/90">
                        <AnimVal value={ind.value} dec={ind.dec} pre={ind.pre ?? ''} suf={ind.suf} />
                      </span>
                      <span className={`font-mono text-xs font-bold ${ind.delta > 0 ? (ind.good ? 'text-emerald-400/70' : 'text-red-400/70') : ind.delta < 0 ? (ind.good ? 'text-red-400/70' : 'text-emerald-400/70') : 'text-white/20'}`}>
                        {ind.delta > 0 ? '▲' : ind.delta < 0 ? '▼' : '–'}{Math.abs(ind.delta).toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-2 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div className="h-full rounded-full" style={{ background: color }}
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-mono text-[8px] tracking-[0.1em] text-right" style={{ color: 'rgba(255,255,255,0.2)' }}>{ind.desc}</span>
                      <span className="font-mono text-[8px]" style={{ color: 'rgba(255,255,255,0.18)' }}>ONTEM {ontem}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Commodities inline no rodapé do globo */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-4 rounded-lg px-4 py-2"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
            {Object.entries(commodities).slice(0, 4).map(([key, c]) => (
              <div key={key} className="flex items-center gap-1">
                <span className="text-[8px] font-bold uppercase text-white/20">{c.label}</span>
                <span className="font-mono text-[11px] font-semibold text-white/55">
                  <AnimVal value={c.value} dec={c.value > 1000 ? 0 : 1} pre="$" />
                </span>
                <span className={`font-mono text-[9px] ${c.delta > 0 ? 'text-emerald-400/45' : c.delta < 0 ? 'text-red-400/40' : 'text-white/15'}`}>
                  {c.delta > 0 ? '▲' : c.delta < 0 ? '▼' : '–'}{Math.abs(c.delta).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Commodities restantes abaixo do globo */}
        <div className="flex items-center justify-center gap-3 mt-2">
          {Object.entries(commodities).slice(4).map(([key, c]) => (
            <div key={key} className="flex items-center gap-1.5 rounded-lg border border-white/[0.05] px-2.5 py-1.5"
              style={{ background: 'rgba(0,0,0,0.2)' }}>
              <span className="text-[9px] font-bold uppercase text-white/20">{c.label}</span>
              <span className="font-mono text-[11px] font-semibold text-white/55">
                <AnimVal value={c.value} dec={c.value > 1000 ? 0 : 1} pre="$" />
              </span>
              <span className={`font-mono text-[9px] ${c.delta > 0 ? 'text-emerald-400/45' : c.delta < 0 ? 'text-red-400/40' : 'text-white/15'}`}>
                {c.delta > 0 ? '▲' : c.delta < 0 ? '▼' : '–'}{Math.abs(c.delta).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ BLOCO 2: FEED DE NOTÍCIAS ══ */}
      <div className="rounded-sm px-4 py-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <NewsFeed />
      </div>

    </div>
  )
}
