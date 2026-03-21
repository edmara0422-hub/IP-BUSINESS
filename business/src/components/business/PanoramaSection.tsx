'use client'

import { useMemo, useEffect, useState, useCallback, memo } from 'react'
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

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <LivePulse />
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">{children}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ██  HUD GAUGE — SVG CUSTOM, ÚNICO CARD, LINHA HORIZONTAL
// ══════════════════════════════════════════════════════════════════════════

// Cores calibradas: vermelho profundo, verde escuro, âmbar discreto
const GAUGE_RED = '#c0392b'
const GAUGE_GREEN = '#1e8449'
const GAUGE_AMBER = '#9a7d0a'

// ══════════════════════════════════════════════════════════════════════════
// ██  ECHARTS: TREEMAP SETORES
// ══════════════════════════════════════════════════════════════════════════

// ── SectorRadial — roda de setores igual à MultidimRadial ───────────────
const SCX = 170, SCY = 170, SR_INNER = 44, SR_MAX = 126, SPOKE_S = 82, SR_LABEL = 143

function sectorColor(trend: string) {
  return trend === 'up' ? GAUGE_GREEN : trend === 'down' ? GAUGE_RED : GAUGE_AMBER
}

const SectorRadial = memo(function SectorRadial({ sectors, activeSec, onSelect, avgHeat }: {
  sectors: Array<{ label: string; heat: number; change: number; trend: string }>
  activeSec: number; onSelect: (i: number) => void; avgHeat: number
}) {
  const n = sectors.length
  return (
    <svg viewBox="0 0 340 340" style={{ width: '100%', maxWidth: 340, margin: '0 auto', display: 'block', overflow: 'visible' }}>
      <circle cx={SCX} cy={SCY} r={SR_MAX} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="3 5" />
      <circle cx={SCX} cy={SCY} r={(SR_INNER + SR_MAX) / 2} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={1} />

      {sectors.map((s, i) => {
        const angle = (i * (360 / n) - 90) * (Math.PI / 180)
        const cos = Math.cos(angle), sin = Math.sin(angle)
        const x1 = SCX + SR_INNER * cos, y1 = SCY + SR_INNER * sin
        const xFull = SCX + SR_MAX * cos, yFull = SCY + SR_MAX * sin
        const scoreR = SR_INNER + (s.heat / 100) * SPOKE_S
        const xScore = SCX + scoreR * cos, yScore = SCY + scoreR * sin
        const xLabel = SCX + SR_LABEL * cos, yLabel = SCY + SR_LABEL * sin
        const color = sectorColor(s.trend)
        const isActive = activeSec === i
        const dimmed = !isActive
        const short = s.label.split(' ')[0].substring(0, 6)
        return (
          <g key={s.label} style={{ cursor: 'pointer' }} onClick={() => onSelect(i)}>
            <line x1={x1} y1={y1} x2={xFull} y2={yFull} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <motion.path
              d={`M ${x1} ${y1} L ${xFull} ${yFull}`}
              stroke={color} strokeWidth={isActive ? 3 : 1.5} strokeLinecap="round" fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: s.heat / 100, opacity: dimmed ? 0.28 : 1 }}
              transition={{ duration: 1.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              style={isActive ? { filter: `drop-shadow(0 0 4px ${color}99)` } : {}}
            />
            <motion.circle cx={xScore} cy={yScore} fill={color}
              animate={{ r: isActive ? [3.5, 5.5, 3.5] : 2.5, opacity: dimmed ? 0.28 : 1 }}
              transition={{ r: { duration: 1.4, repeat: Infinity }, opacity: { duration: 0.3 } }}
            />
            <line x1={x1} y1={y1} x2={xFull} y2={yFull} stroke="transparent" strokeWidth={24} />
            <text x={xLabel} y={yLabel} textAnchor="middle" dominantBaseline="middle"
              fontSize={isActive ? 9.5 : 8} fontFamily="monospace" fontWeight={isActive ? 'bold' : 'normal'}
              fill={isActive ? color : dimmed ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.42)'}
              letterSpacing="0.08em"
            >{short}</text>
          </g>
        )
      })}

      <circle cx={SCX} cy={SCY} r={SR_INNER} fill="rgba(0,0,0,0.85)"
        stroke="rgba(192,192,192,0.5)" strokeWidth={1.5}
        style={{ filter: 'drop-shadow(0 0 8px rgba(192,192,192,0.2))' }}
      />
      <text x={SCX} y={SCY - 8} textAnchor="middle" dominantBaseline="middle"
        fontSize={26} fontFamily="monospace" fontWeight="bold" fill="rgba(192,192,192,0.9)"
      >{avgHeat}</text>
      <text x={SCX} y={SCY + 13} textAnchor="middle" dominantBaseline="middle"
        fontSize={7} fontFamily="monospace" fill="rgba(192,192,192,0.5)" letterSpacing="0.22em"
      >HEAT AVG</text>
    </svg>
  )
})

// ── SectorDetailPanel — detalhe do setor ativo ──────────────────────────
function SectorDetailPanel({ sector }: { sector: { label: string; heat: number; change: number; trend: string } }) {
  const color = sectorColor(sector.trend)
  const trendLabel = sector.trend === 'up' ? 'ALTA' : sector.trend === 'down' ? 'BAIXA' : 'NEUTRO'
  return (
    <motion.div
      key={sector.label}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className="rounded-lg overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${color}22` }}
    >
      <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${color}80, transparent)` }} />
      <div className="px-4 py-3 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] font-bold tracking-[0.12em]" style={{ color }}>{sector.label}</span>
            <span className="font-mono text-[8px] tracking-widest px-1.5 py-0.5 rounded-sm" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>{trendLabel}</span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <span className="font-mono text-[8px] text-white/25 block">HEAT INDEX</span>
              <span className="font-mono text-[13px] font-bold" style={{ color }}>{sector.heat}/100</span>
            </div>
            <div>
              <span className="font-mono text-[8px] text-white/25 block">VARIAÇÃO</span>
              <span className="font-mono text-[13px] font-bold" style={{ color }}>
                {sector.change > 0 ? '+' : ''}{sector.change.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        <span className="font-mono text-[42px] font-bold leading-none shrink-0" style={{ color, opacity: 0.15 }}>
          {sector.trend === 'up' ? '▲' : sector.trend === 'down' ? '▼' : '–'}
        </span>
      </div>
      {/* Mini barra de heat */}
      <div className="px-4 pb-3">
        <div className="h-[3px] w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${sector.heat}%` }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ██  ECHARTS: RADAR 8D
// ══════════════════════════════════════════════════════════════════════════


// ══════════════════════════════════════════════════════════════════════════
// ██  ECHARTS: HEATMAP CORRELAÇÃO
// ══════════════════════════════════════════════════════════════════════════

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

// Ticker horizontal estilo Bloomberg
function NewsTicker({ news }: { news: NewsItem[] }) {
  if (news.length === 0) return null
  const items = [...news, ...news] // duplica para loop contínuo
  return (
    <div className="overflow-hidden relative" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-center">
        {/* Badge LIVE fixo */}
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 z-10"
          style={{ background: 'rgba(0,0,0,0.8)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <motion.div className="h-1.5 w-1.5 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
          <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-red-400/80">LIVE</span>
        </div>
        {/* Marquee */}
        <div className="flex-1 overflow-hidden">
          <div className="flex whitespace-nowrap" style={{ animation: 'marquee 60s linear infinite' }}>
            {items.map((n, i) => {
              const m = CAT_META[n.category] ?? CAT_META.all
              return (
                <a key={`${n.id}-${i}`} href={n.link} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-1.5 hover:bg-white/[0.03] transition-colors">
                  <span className="font-mono text-[8px] font-bold tracking-widest uppercase" style={{ color: m.color }}>{m.label}</span>
                  <span className="text-[10px] text-white/50 hover:text-white/80 transition-colors">{n.title}</span>
                  <span className="font-mono text-[8px] text-white/20">{timeAgo(n.pubDate)}</span>
                  <span className="text-white/10 text-[10px]">·</span>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function NewsCard({ item, index, isNew }: { item: NewsItem; index: number; isNew: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const meta = CAT_META[item.category] ?? CAT_META.all
  const minsOld = Math.floor((Date.now() - new Date(item.pubDate).getTime()) / 60000)
  return (
    <motion.div className="relative rounded-sm overflow-hidden cursor-pointer"
      style={{ border: `1px solid ${expanded ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.04)'}` }}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.035 }}
      whileHover={{ y: -2, transition: { type: 'spring', stiffness: 400, damping: 22 } }}
      onClick={() => setExpanded(e => !e)}>
      {/* Flash glow para notícias novas (< 60min) */}
      {isNew && (
        <motion.div className="absolute inset-0 pointer-events-none"
          style={{ background: `${meta.color}08` }}
          animate={{ opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: 3 }} />
      )}
      {/* Barra lateral colorida */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background: meta.color }} />
      {/* Flash "NOVO" */}
      {isNew && minsOld < 60 && (
        <div className="absolute top-2 right-2">
          <motion.span className="font-mono text-[7px] font-bold tracking-widest px-1.5 py-0.5 rounded-sm"
            style={{ background: `${meta.color}25`, color: meta.color, border: `1px solid ${meta.color}44` }}
            animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
            NOVO · {minsOld}min
          </motion.span>
        </div>
      )}
      <div className="pl-3 pr-3 py-2.5" style={{ background: expanded ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.012)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[8px] font-bold tracking-[0.18em] uppercase" style={{ color: meta.color }}>{meta.label}</span>
          <span className="font-mono text-[8px] text-white/18">{item.source}</span>
          <span className="font-mono text-[8px] text-white/15 ml-auto">{timeAgo(item.pubDate)}</span>
          <span className="font-mono text-[9px] text-white/20">{expanded ? '▲' : '▼'}</span>
        </div>
        <p className="text-[11px] font-medium leading-snug"
          style={{ color: expanded ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)', WebkitLineClamp: expanded ? undefined : 2, display: expanded ? 'block' : '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.title}
        </p>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
              <a href={item.link} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 font-mono text-[9px] hover:underline"
                style={{ color: meta.color }} onClick={e => e.stopPropagation()}>
                Abrir notícia completa ↗
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

      {/* Filtros */}
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

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-4 w-4 animate-spin rounded-full border border-white/10 border-t-white/40" />
          <span className="font-mono text-[9px] text-white/20 ml-2">Carregando notícias reais...</span>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={filter} className="grid grid-cols-1 lg:grid-cols-2 gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
            {filtered.slice(0, 8).map((n, i) => (
              <NewsCard key={n.id} item={n} index={i} isNew={isNew(n.id)} />
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
// ██  ANÁLISE MULTIDIMENSIONAL — LÓGICA E COMPONENTES
// ══════════════════════════════════════════════════════════════════════════

interface DimScore {
  label: string; short: string; score: number; weight: number
  status: 'good' | 'warning' | 'critical'
  driver: string   // fator principal em 1 linha
  detail: string   // explicação completa ao expandir
  pts: { label: string; value: number }[]  // contribuições
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildDimensions(data: any): DimScore[] {
  const clamp = (n: number) => Math.round(Math.max(5, Math.min(95, n)))
  const selic = v(data.macro.selic?.value, 10.5)
  const ipca  = v(data.macro.ipca?.value, 4.8)
  const pib   = v(data.macro.pib?.value, 2.9)
  const usd   = v(data.macro.usdBrl?.value, 5.72)
  const sectors = data.sectors as Array<{ id: string; heat: number; change: number }>
  const comms = Object.values(data.commodities as Record<string, { delta: number }>)
  const agents = data.globalAgents as Array<{ delta: number }>
  const cacDelta = data.marketing?.cacTrend?.delta ?? 12

  // ── 1. ECONÔMICO (peso 20%) ─────────────────────────────────────────
  const pibPts  = Math.min(60, Math.max(0, (pib + 3) / 11 * 60))          // -3→8 mapeia 0→60
  const selicPts = Math.max(0, 40 - Math.max(0, selic - 5) * 3.6)         // acima de 5% custa pts
  const econ = clamp(pibPts + selicPts)

  // ── 2. INFLAÇÃO / SOCIAL (peso 15%) ────────────────────────────────
  const metaBC = 3.25
  const ipcaOvr = Math.max(0, ipca - metaBC)
  const infla = clamp(100 - ipcaOvr * 13)

  // ── 3. COMMODITIES (peso 15%) ───────────────────────────────────────
  const commAvgDelta = comms.reduce((s, c) => s + c.delta, 0) / Math.max(1, comms.length)
  const comm = clamp(50 + commAvgDelta * 4)

  // ── 4. TECH & DIGITAL (peso 15%) ────────────────────────────────────
  const techHeat = sectors.find(s => s.id === 'tech')?.heat ?? 60
  const agentAvg = agents.slice(0, 3).reduce((s, a) => s + a.delta, 0) / 3
  const tech = clamp(techHeat * 0.72 + Math.min(95, 50 + agentAvg * 10) * 0.28)

  // ── 5. MERCADO AMPLO (peso 15%) ─────────────────────────────────────
  const mktAvg = sectors.reduce((s, sec) => s + sec.heat, 0) / Math.max(1, sectors.length)
  const mktBroad = clamp(mktAvg)

  // ── 6. INOVAÇÃO (peso 10%) ──────────────────────────────────────────
  const inovScore = clamp(tech * 0.75 + mktBroad * 0.25)

  // ── 7. ESG / SUSTENTABILIDADE (peso 10%) ────────────────────────────
  const esgBase = 55 + (pib > 2 ? 6 : pib < 0 ? -8 : 0) - Math.max(0, ipca - 4) * 2.5 - Math.max(0, usd - 5.5) * 3
  const esg = clamp(esgBase)

  // ── 8. MARKETING (peso 10%) ─────────────────────────────────────────
  const mkt = clamp(72 - cacDelta * 1.7)

  const status = (s: number): 'good' | 'warning' | 'critical' =>
    s >= 65 ? 'good' : s >= 42 ? 'warning' : 'critical'

  return [
    {
      label: 'Econômico', short: 'ECON', score: econ, weight: 0.20, status: status(econ),
      driver: `PIB +${pib.toFixed(1)}% · SELIC ${selic.toFixed(1)}%`,
      detail: `PIB cresce ${pib.toFixed(1)}% ${pib > 2.5 ? '(acima da média histórica — ciclo expansionista)' : pib > 0 ? '(crescimento moderado, abaixo do potencial)' : '(contração — recessão técnica)'}. SELIC em ${selic.toFixed(1)}% ${selic > 13 ? 'impõe custo de capital elevado, frenando investimentos e M&A' : 'em patamar que não inibe crescimento excessivamente'}.`,
      pts: [{ label: `PIB ${pib.toFixed(1)}%`, value: Math.round(pibPts) }, { label: `SELIC ${selic.toFixed(1)}%`, value: Math.round(selicPts) }],
    },
    {
      label: 'Inflação / Social', short: 'IPCA', score: infla, weight: 0.15, status: status(infla),
      driver: `IPCA ${ipca.toFixed(2)}% · Meta BC ${metaBC}%`,
      detail: `Meta Banco Central: ${metaBC}% (±1.5%). IPCA em ${ipca.toFixed(2)}%: ${ipca <= metaBC ? 'abaixo da meta — consumo pode aquecer' : ipca <= 4.75 ? 'acima da meta mas dentro da banda de tolerância' : 'fora da banda — BC sob pressão para subir juros'}. Famílias da classe C/D ${ipca > 6 ? 'com poder de compra seriamente comprometido' : 'com poder de compra levemente corroído'}.`,
      pts: [{ label: `Desvio da meta`, value: Math.round(100 - ipcaOvr * 13) }],
    },
    {
      label: 'Commodities', short: 'COMM', score: comm, weight: 0.15, status: status(comm),
      driver: `Média ${comms.length} commodities: ${commAvgDelta > 0 ? '+' : ''}${commAvgDelta.toFixed(1)}%`,
      detail: `${commAvgDelta > 2 ? 'Alta pressiona inflação de insumos mas beneficia exportadores (agro, mineração).' : commAvgDelta > -2 ? 'Commodities estáveis — sem pressão inflacionária adicional via importados.' : 'Queda alivia inflação de insumos mas reduz receita do agronegócio.'}`,
      pts: comms.slice(0, 3).map((c, i) => ({ label: `Commodity ${i + 1}`, value: Math.round(50 + c.delta * 4) })),
    },
    {
      label: 'Tech & Digital', short: 'TECH', score: tech, weight: 0.15, status: status(tech),
      driver: `Setor tech heat: ${techHeat}/100 · Big techs: ${agentAvg > 0 ? '+' : ''}${agentAvg.toFixed(1)}%`,
      detail: `Setor tecnologia ${tech >= 70 ? 'aquecido acima da média' : tech >= 50 ? 'com desempenho moderado' : 'em desaceleração'}. Google/Apple/Meta com variação média de ${agentAvg > 0 ? '+' : ''}${agentAvg.toFixed(1)}% — ${agentAvg > 3 ? 'expansão de plataformas, bom para anunciantes' : agentAvg > -2 ? 'estabilidade no ecossistema digital' : 'contração de plataformas, CPM subindo'}.`,
      pts: [{ label: `Heat setor tech`, value: Math.round(techHeat * 0.72) }, { label: `Big techs globais`, value: Math.round(Math.min(95, 50 + agentAvg * 10) * 0.28) }],
    },
    {
      label: 'Mercado Amplo', short: 'MKTD', score: mktBroad, weight: 0.15, status: status(mktBroad),
      driver: `Média ${sectors.length} setores: ${mktAvg.toFixed(0)}/100`,
      detail: `Score médio de ${sectors.length} setores monitorados. ${mktAvg >= 65 ? 'Expansão generalizada — oportunidade para crescimento orgânico.' : mktAvg >= 50 ? 'Crescimento heterogêneo — setores divergem, identificar os vencedores.' : 'Mercado contraindo na maioria dos setores — postura defensiva recomendada.'}`,
      pts: sectors.slice(0, 3).map(s => ({ label: s.id, value: s.heat })),
    },
    {
      label: 'Inovação', short: 'INOV', score: inovScore, weight: 0.10, status: status(inovScore),
      driver: `Tech heat (75%) + Mercado amplo (25%)`,
      detail: `Proxy de capacidade inovativa: combina calor do setor tech (75%) com saúde geral do mercado (25%). ${inovScore >= 70 ? 'Ambiente favorável — startups conseguem funding, M&A aquece.' : 'Ritmo de inovação desacelerado — custo de capital alto inibe R&D.'}`,
      pts: [{ label: 'Tech component', value: Math.round(tech * 0.75) }, { label: 'Market component', value: Math.round(mktBroad * 0.25) }],
    },
    {
      label: 'ESG / Sustent.', short: 'ESG', score: esg, weight: 0.10, status: status(esg),
      driver: `Proxy via macro (PIB, IPCA, câmbio)`,
      detail: `Score estimado via proxies macroeconômicos — dados ESG diretos de empresas indisponíveis. PIB positivo sugere atividade sustentável (+${pib > 2 ? 6 : 0}pts). IPCA alto pressiona desigualdade (-${(Math.max(0, ipca - 4) * 2.5).toFixed(0)}pts). Câmbio alto encarece energia limpa importada (-${(Math.max(0, usd - 5.5) * 3).toFixed(0)}pts).`,
      pts: [{ label: `PIB proxy`, value: esg > 55 ? esg : 50 }, { label: `IPCA pressão`, value: Math.round(100 - ipcaOvr * 13) }],
    },
    {
      label: 'Marketing', short: 'MRKT', score: mkt, weight: 0.10, status: status(mkt),
      driver: `CAC trend: +${cacDelta.toFixed(0)}% YoY`,
      detail: `Baseado no custo de aquisição de cliente (CAC). CAC ${cacDelta > 0 ? `subindo +${cacDelta.toFixed(0)}%` : `caindo ${cacDelta.toFixed(0)}%`} YoY — ${cacDelta > 20 ? 'canal saturado, eficiência caindo drasticamente.' : cacDelta > 10 ? 'pressão crescente mas gerenciável com otimização de mix.' : 'eficiência mantida nos canais digitais.'}`,
      pts: [{ label: `CAC trend`, value: mkt }],
    },
  ]
}

// ── MultidimRadial — roda interativa SVG ────────────────────────────────
const CX = 170, CY = 170, R_INNER = 44, R_MAX = 126, SPOKE_LEN = 82, R_LABEL = 143

function dimColor(s: 'good' | 'warning' | 'critical') {
  return s === 'good' ? GAUGE_GREEN : s === 'warning' ? GAUGE_AMBER : GAUGE_RED
}

const MultidimRadial = memo(function MultidimRadial({ dimensions, activeDim, onSelect, marketScore, scoreColor, scoreLabel }: {
  dimensions: DimScore[]; activeDim: number; onSelect: (i: number) => void
  marketScore: number; scoreColor: string; scoreLabel: string
}) {
  return (
    <svg viewBox="0 0 340 340" style={{ width: '100%', maxWidth: 340, margin: '0 auto', display: 'block', overflow: 'visible' }}>
      {/* Outer ring */}
      <circle cx={CX} cy={CY} r={R_MAX} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="3 5" />
      {/* Mid ring */}
      <circle cx={CX} cy={CY} r={(R_INNER + R_MAX) / 2} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={1} />

      {dimensions.map((dim, i) => {
        const angle = (i * 45 - 90) * (Math.PI / 180)
        const cos = Math.cos(angle), sin = Math.sin(angle)
        const x1 = CX + R_INNER * cos, y1 = CY + R_INNER * sin
        const xFull = CX + R_MAX * cos, yFull = CY + R_MAX * sin
        const scoreR = R_INNER + (dim.score / 100) * SPOKE_LEN
        const xScore = CX + scoreR * cos, yScore = CY + scoreR * sin
        const xLabel = CX + R_LABEL * cos, yLabel = CY + R_LABEL * sin
        const color = dimColor(dim.status)
        const isActive = activeDim === i
        const dimmed = !isActive
        return (
          <g key={dim.short} style={{ cursor: 'pointer' }} onClick={() => onSelect(i)}>
            {/* Background spoke */}
            <line x1={x1} y1={y1} x2={xFull} y2={yFull} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            {/* Score spoke — pathLength 0→score% */}
            <motion.path
              d={`M ${x1} ${y1} L ${xFull} ${yFull}`}
              stroke={color} strokeWidth={isActive ? 3 : 1.5} strokeLinecap="round" fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: dim.score / 100, opacity: dimmed ? 0.3 : 1 }}
              transition={{ duration: 1.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              style={isActive ? { filter: `drop-shadow(0 0 4px ${color}99)` } : {}}
            />
            {/* Dot at score end */}
            <motion.circle cx={xScore} cy={yScore} fill={color}
              animate={{ r: isActive ? [3.5, 5.5, 3.5] : 2.5, opacity: dimmed ? 0.3 : 1 }}
              transition={{ r: { duration: 1.4, repeat: Infinity }, opacity: { duration: 0.3 } }}
            />
            {/* Invisible wider hit area */}
            <line x1={x1} y1={y1} x2={xFull} y2={yFull} stroke="transparent" strokeWidth={24} />
            {/* Label */}
            <text x={xLabel} y={yLabel} textAnchor="middle" dominantBaseline="middle"
              fontSize={isActive ? 9.5 : 8} fontFamily="monospace" fontWeight={isActive ? 'bold' : 'normal'}
              fill={isActive ? color : dimmed ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.42)'}
              letterSpacing="0.12em"
            >{dim.short}</text>
          </g>
        )
      })}

      {/* Center circle */}
      <circle cx={CX} cy={CY} r={R_INNER} fill="rgba(0,0,0,0.85)"
        stroke={scoreColor} strokeWidth={1.5}
        style={{ filter: `drop-shadow(0 0 10px ${scoreColor}33)` }}
      />
      <text x={CX} y={CY - 8} textAnchor="middle" dominantBaseline="middle"
        fontSize={26} fontFamily="monospace" fontWeight="bold" fill={scoreColor}
      >{marketScore}</text>
      <text x={CX} y={CY + 13} textAnchor="middle" dominantBaseline="middle"
        fontSize={7} fontFamily="monospace" fill={scoreColor} letterSpacing="0.22em"
      >{scoreLabel}</text>
    </svg>
  )
})

// ── DimDetailPanel — painel da dimensão ativa ────────────────────────────
function DimDetailPanel({ dim, scoreColor }: { dim: DimScore; scoreColor: string }) {
  const color = dimColor(dim.status)
  const statusLabel = dim.status === 'good' ? 'SAUDÁVEL' : dim.status === 'warning' ? 'MODERADO' : 'CRÍTICO'
  const contribution = Math.round(dim.score * dim.weight)
  return (
    <motion.div
      key={dim.short}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className="rounded-lg overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${color}22` }}
    >
      {/* Top bar */}
      <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${color}80, transparent)` }} />

      <div className="px-4 py-3 flex items-start justify-between gap-4">
        {/* Left: nome + driver */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] font-bold tracking-[0.15em]" style={{ color }}>{dim.short}</span>
            <span className="font-mono text-[10px] text-white/40">{dim.label}</span>
            <span className="font-mono text-[8px] tracking-widest px-1.5 py-0.5 rounded-sm" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>{statusLabel}</span>
          </div>
          <p className="font-mono text-[9px] text-white/35 mb-2">{dim.driver}</p>
          <p className="text-[10px] text-white/50 leading-relaxed">{dim.detail}</p>
        </div>
        {/* Right: score grande */}
        <div className="flex flex-col items-center shrink-0">
          <span className="font-mono text-[36px] font-bold leading-none" style={{ color }}>{dim.score}</span>
          <span className="font-mono text-[8px] text-white/25 mt-1">peso {Math.round(dim.weight * 100)}%</span>
          <div className="mt-1 rounded-sm px-2 py-0.5" style={{ background: `${scoreColor}15`, border: `1px solid ${scoreColor}25` }}>
            <span className="font-mono text-[8px]" style={{ color: scoreColor }}>+{contribution}pts</span>
          </div>
        </div>
      </div>

      {/* Pts breakdown */}
      <div className="px-4 pb-3 flex flex-wrap gap-2">
        {dim.pts.map((p, i) => (
          <div key={i} className="flex items-center gap-1.5 rounded-sm px-2 py-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-[9px] text-white/30">{p.label}</span>
            <span className="font-mono text-[10px] font-bold" style={{ color }}>{p.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ██  PANORAMA — COMMAND CENTER
// ══════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PanoramaSection({ data }: { data: any }) {
  const agents = data.globalAgents as Array<{ id: string; label: string; delta: number; impact: string }>
  const commodities = data.commodities as Record<string, { value: number; delta: number; label: string }>
  const problems = data.centralProblems as Array<{ id: string; label: string; affected: number }>
  const opportunities = data.opportunities as Array<{ id: string; label: string; urgency: number }>


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
        <SectionLabel>Panorama Global</SectionLabel>
        <div className="relative rounded-lg border border-white/[0.06] overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.01) 0%, rgba(0,0,0,0.5) 80%)' }}>
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

      {/* ══ BLOCO 2.5: FEED DE NOTÍCIAS ══ */}
      <div className="rounded-sm px-4 py-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <NewsFeed />
      </div>


    </div>
  )
}
