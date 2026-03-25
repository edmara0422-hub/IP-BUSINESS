'use client'

import { useMemo, useEffect, useState, useCallback } from 'react'
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import * as echarts from 'echarts'
import dynamic from 'next/dynamic'
import BusinessChart from './BusinessChart'

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
// ██  ECHARTS: GAUGE MACRO
// ══════════════════════════════════════════════════════════════════════════

function MacroGauges({ selic, ipca, pib, usd }: { selic: number; ipca: number; pib: number; usd: number }) {
  const makeGauge = (center: string, min: number, max: number, val: number, name: string, fmt: string, colors: [number, string][], desc: string) => ({
    type: 'gauge' as const, center: [center, '50%'], radius: '82%',
    min, max, startAngle: 220, endAngle: -40,
    detail: { formatter: fmt, fontSize: 16, fontFamily: 'monospace', fontWeight: 'bold' as const, color: '#fff', offsetCenter: [0, '60%'] },
    title: { show: true, offsetCenter: [0, '82%'], fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' },
    data: [{ value: parseFloat(val.toFixed(2)), name }],
    axisLine: { lineStyle: { width: 10, color: colors }, roundCap: true },
    axisTick: { show: true, length: 4, lineStyle: { color: 'rgba(255,255,255,0.12)', width: 1 }, splitNumber: 5 },
    splitLine: { show: true, length: 8, lineStyle: { color: 'rgba(255,255,255,0.1)', width: 1 } },
    axisLabel: { show: true, distance: 12, fontSize: 8, color: 'rgba(255,255,255,0.15)', fontFamily: 'monospace',
      formatter: (v: number) => v === min || v === max || v === Math.round((min + max) / 2) ? `${v}` : '' },
    pointer: { length: '58%', width: 4, itemStyle: { color: 'rgba(255,255,255,0.8)', shadowColor: 'rgba(255,255,255,0.3)', shadowBlur: 8 } },
    anchor: { show: true, showAbove: true, size: 6, itemStyle: { color: 'rgba(255,255,255,0.5)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' } },
    tooltip: { show: true, formatter: () => `<b>${name}</b><br/>${val.toFixed(2)}<br/><span style="color:#999;font-size:11px">${desc}</span>` },
    animationDuration: 2000, animationEasingUpdate: 'bounceOut' as const,
  })

  const option = useMemo((): echarts.EChartsOption => ({
    backgroundColor: 'transparent',
    tooltip: { show: true, backgroundColor: 'rgba(0,0,0,0.85)', borderColor: 'rgba(255,255,255,0.1)', textStyle: { color: '#fff', fontSize: 12, fontFamily: 'monospace' } },
    series: [
      makeGauge('14%', 2, 20, selic, 'SELIC', '{value}%', [[0.4, 'rgba(46,204,113,0.5)'], [0.6, 'rgba(243,156,18,0.5)'], [1, 'rgba(192,57,43,0.6)']], 'Taxa básica de juros do BC'),
      makeGauge('38%', 0, 12, ipca, 'IPCA', '{value}%', [[0.35, 'rgba(46,204,113,0.5)'], [0.55, 'rgba(243,156,18,0.5)'], [1, 'rgba(192,57,43,0.6)']], 'Inflação acumulada 12 meses'),
      makeGauge('62%', -3, 8, pib, 'PIB', '{value}%', [[0.27, 'rgba(192,57,43,0.6)'], [0.45, 'rgba(243,156,18,0.5)'], [1, 'rgba(46,204,113,0.5)']], 'Crescimento econômico anual'),
      makeGauge('86%', 3, 8, usd, 'USD/BRL', 'R${value}', [[0.4, 'rgba(46,204,113,0.5)'], [0.65, 'rgba(243,156,18,0.5)'], [1, 'rgba(192,57,43,0.6)']], 'Cotação do dólar americano'),
    ],
  }), [selic, ipca, pib, usd])
  return <BusinessChart option={option} className="h-full w-full" />
}

// ══════════════════════════════════════════════════════════════════════════
// ██  ECHARTS: TREEMAP SETORES
// ══════════════════════════════════════════════════════════════════════════

function SectorTreemap({ sectors }: { sectors: Array<{ label: string; heat: number; change: number; trend: string }> }) {
  const option = useMemo((): echarts.EChartsOption => ({
    backgroundColor: 'transparent',
    series: [{
      type: 'treemap',
      data: sectors.map(s => ({
        name: `${s.label}\n${s.change > 0 ? '+' : ''}${s.change.toFixed(0)}%`,
        value: s.heat,
        itemStyle: {
          color: s.trend === 'up' ? `rgba(192,192,192,${0.12 + s.heat * 0.003})` : s.trend === 'down' ? `rgba(192,57,43,${0.1 + Math.abs(s.change) * 0.005})` : 'rgba(255,255,255,0.06)',
          borderColor: 'rgba(0,0,0,0.5)', borderWidth: 2,
        },
      })),
      width: '100%', height: '100%', left: 0, top: 0, right: 0, bottom: 0,
      roam: false, nodeClick: false,
      label: { show: true, color: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: 'monospace', fontWeight: 'bold', lineHeight: 16 },
      breadcrumb: { show: false }, animationDuration: 1000,
    }],
  }), [sectors])
  return <BusinessChart option={option} className="h-full w-full" />
}

// ══════════════════════════════════════════════════════════════════════════
// ██  ECHARTS: RADAR 8D
// ══════════════════════════════════════════════════════════════════════════

function Radar8D({ data }: { data: number[] }) {
  const option = useMemo((): echarts.EChartsOption => ({
    backgroundColor: 'transparent',
    radar: {
      indicator: [
        { name: 'Econômico', max: 100 }, { name: 'Commodities', max: 100 },
        { name: 'Tech', max: 100 }, { name: 'Social', max: 100 },
        { name: 'Mercado', max: 100 }, { name: 'Inovação', max: 100 },
        { name: 'ESG', max: 100 }, { name: 'Marketing', max: 100 },
      ],
      shape: 'circle', splitNumber: 4, center: ['50%', '50%'], radius: '65%',
      axisName: { color: 'rgba(255,255,255,0.35)', fontSize: 10, fontFamily: 'monospace' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
      splitArea: { show: false },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
    },
    series: [{
      type: 'radar',
      data: [{ value: data, areaStyle: { color: 'rgba(192,192,192,0.1)' } }],
      symbol: 'circle', symbolSize: 5,
      lineStyle: { color: 'rgba(192,192,192,0.6)', width: 2 },
      itemStyle: { color: 'rgba(192,192,192,0.8)', borderColor: 'rgba(255,255,255,0.4)' },
      animationDuration: 1500,
    }],
  }), [data])
  return <BusinessChart option={option} className="h-full w-full" />
}

// ══════════════════════════════════════════════════════════════════════════
// ██  ECHARTS: HEATMAP CORRELAÇÃO
// ══════════════════════════════════════════════════════════════════════════

function CorrelationHeatmap({ sectors, commodities }: { sectors: Array<{ label: string; change: number }>; commodities: Record<string, { delta: number; label: string }> }) {
  const commList = Object.values(commodities)
  const sectorNames = sectors.slice(0, 6).map(s => s.label.split(' ')[0])
  const commNames = commList.map(c => c.label)

  const heatData: [number, number, number][] = []
  sectors.slice(0, 6).forEach((s, si) => {
    commList.forEach((c, ci) => {
      const corr = parseFloat(((s.change * c.delta) / 100).toFixed(1))
      heatData.push([ci, si, corr])
    })
  })

  const option = useMemo((): echarts.EChartsOption => ({
    backgroundColor: 'transparent',
    grid: { left: 70, right: 10, top: 10, bottom: 40 },
    xAxis: { type: 'category', data: commNames, axisLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'monospace', rotate: 30 }, axisLine: { show: false }, axisTick: { show: false } },
    yAxis: { type: 'category', data: sectorNames, axisLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'monospace' }, axisLine: { show: false }, axisTick: { show: false } },
    visualMap: { show: false, min: -5, max: 5, inRange: { color: ['rgba(192,57,43,0.6)', 'rgba(255,255,255,0.05)', 'rgba(46,204,113,0.5)'] } },
    series: [{ type: 'heatmap', data: heatData, label: { show: true, color: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'monospace' }, itemStyle: { borderColor: 'rgba(0,0,0,0.6)', borderWidth: 2 } }],
  }), [sectorNames, commNames, heatData])
  return <BusinessChart option={option} className="h-full w-full" />
}

// ══════════════════════════════════════════════════════════════════════════
// ██  ECHARTS: BENCHMARKING BARRAS
// ══════════════════════════════════════════════════════════════════════════

function BenchmarkBars({ sectors }: { sectors: Array<{ label: string; change: number; trend: string }> }) {
  const sorted = [...sectors].sort((a, b) => b.change - a.change)
  const option = useMemo((): echarts.EChartsOption => ({
    backgroundColor: 'transparent',
    grid: { left: 4, right: 45, top: 4, bottom: 4, containLabel: true },
    xAxis: { type: 'value', show: false },
    yAxis: {
      type: 'category', data: sorted.map(s => s.label), inverse: true,
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' },
    },
    series: [{
      type: 'bar', data: sorted.map(s => ({
        value: s.change,
        itemStyle: { color: s.change > 0 ? 'rgba(192,192,192,0.25)' : 'rgba(192,57,43,0.35)', borderRadius: [0, 3, 3, 0] },
      })),
      barWidth: 12, barCategoryGap: '20%',
      label: { show: true, position: 'right', color: 'rgba(255,255,255,0.45)', fontSize: 10, fontFamily: 'monospace',
        formatter: (p: unknown) => { const v = (p as { value: number }).value; return `${v > 0 ? '+' : ''}${v.toFixed(0)}%` } },
      animationDuration: 1200,
    }],
  }), [sorted])
  return <BusinessChart option={option} className="h-full w-full" />
}

// ══════════════════════════════════════════════════════════════════════════
// ██  NEWS FEED
// ══════════════════════════════════════════════════════════════════════════

interface NewsItem { id: string; title: string; source: string; category: string; pubDate: string; link: string }

function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([])
  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch('/api/news')
      if (res.ok) { const data = await res.json(); setNews(data.news ?? []) }
    } catch { /* silently fail */ }
  }, [])
  useEffect(() => { fetchNews(); const t = setInterval(fetchNews, 300_000); return () => clearInterval(t) }, [fetchNews])

  if (news.length === 0) return null
  return (
    <div className="flex flex-col gap-1.5 overflow-y-auto" style={{ maxHeight: '240px' }}>
      {news.slice(0, 8).map((n, i) => (
        <motion.a key={n.id} href={n.link} target="_blank" rel="noopener noreferrer"
          className="flex items-start gap-2 rounded-lg px-3 py-2 hover:bg-white/[0.03] transition-colors"
          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
          <span className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${
            n.category === 'economia' ? 'bg-amber-400/50' :
            n.category === 'mercado' ? 'bg-emerald-400/50' :
            n.category === 'inovacao' ? 'bg-blue-400/50' :
            n.category === 'startups' ? 'bg-purple-400/50' : 'bg-white/30'
          }`} />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-white/55 leading-snug line-clamp-2">{n.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] text-white/20">{n.source}</span>
              <span className="text-[9px] text-white/10">·</span>
              <span className="text-[9px] text-white/15">{timeAgo(n.pubDate)}</span>
            </div>
          </div>
        </motion.a>
      ))}
    </div>
  )
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

// ══════════════════════════════════════════════════════════════════════════
// ██  SINAIS PROFUNDOS (expandíveis)
// ══════════════════════════════════════════════════════════════════════════

interface DeepSignal {
  id: string; type: 'risk' | 'opportunity' | 'alert' | 'info'
  title: string; urgency: number
  trigger: string; cause: string; effect1: string; effect2: string; opportunity: string; action: string
}

function buildDeepSignals(data: { macro: { selic: { value: number }; ipca: { value: number }; pib: { value: number }; usdBrl: { value: number } }; centralProblems: Array<{ id: string; affected: number }>; opportunities: Array<{ id: string; label: string; urgency: number }> }): DeepSignal[] {
  const signals: DeepSignal[] = []
  const selic = data.macro.selic.value, ipca = data.macro.ipca.value, pib = data.macro.pib.value, usd = data.macro.usdBrl.value
  const creditAffected = data.centralProblems.find(p => p.id === 'credit')?.affected ?? 47
  const marginAffected = data.centralProblems.find(p => p.id === 'margin')?.affected ?? 68

  if (selic > 10) signals.push({
    id: 'deep-selic', type: 'alert', title: `SELIC ${selic.toFixed(1)}% — Crédito restrito`, urgency: Math.min(92, Math.round(selic * 6)),
    trigger: `SELIC em ${selic.toFixed(1)}%, acima da média histórica de 10.5%. Banco Central mantém taxa alta para conter inflação.`,
    cause: `Custo do crédito sobe → Financiamentos ficam até 40% mais caros → Empresas pagam mais juros sobre dívida existente.`,
    effect1: `Consumo cai → Varejo físico sofre → Demissões aumentam no comércio. ${creditAffected}% das PMEs sem acesso a crédito viável.`,
    effect2: `Inadimplência sobe → Bancos apertam critérios → Ciclo de restrição se autoalimenta. Confiança do consumidor cai.`,
    opportunity: `Renda fixa paga bem (CDB, Tesouro Direto). Fintechs de crédito alternativo ganham espaço. Empresas com caixa forte compram concorrentes endividados.`,
    action: `Reduzir dependência de crédito bancário. Renegociar dívidas de curto prazo. Focar em geração de caixa orgânico. Investir reservas em renda fixa.`,
  })

  if (ipca > 4.5) signals.push({
    id: 'deep-ipca', type: 'risk', title: `IPCA ${ipca.toFixed(2)}% — Poder de compra erodido`, urgency: Math.min(88, Math.round(ipca * 14)),
    trigger: `Inflação em ${ipca.toFixed(2)}%, acima da meta do BC (3.25%). Preços de alimentos e combustíveis pressionam famílias.`,
    cause: `Custo de insumos sobe → Repasse ao consumidor é limitado pela concorrência → Margem se comprime dos dois lados.`,
    effect1: `${marginAffected}% das empresas com margem comprimida. Classe C e D cortam gastos discricionários. Ticket médio cai.`,
    effect2: `Empresas cortam investimentos → Inovação desacelera → Produtividade estagna. Espiral deflacionária de qualidade.`,
    opportunity: `Produtos essenciais e low-cost ganham mercado. Marcas próprias crescem. Modelos de assinatura retêm receita recorrente.`,
    action: `Renegociar com fornecedores (volume ou prazo). Otimizar mix para produtos de maior margem. Focar em valor percebido, não preço.`,
  })

  if (pib > 2) signals.push({
    id: 'deep-pib', type: 'opportunity', title: `PIB +${pib.toFixed(1)}% — Janela de expansão`, urgency: Math.round(pib * 22),
    trigger: `Economia crescendo ${pib.toFixed(1)}%, acima da média histórica de 2.2%. Mercado de trabalho aquecido.`,
    cause: `Mais empregos → Renda disponível sobe → Consumo aumenta → Empresas faturam mais → Contratam mais (ciclo virtuoso).`,
    effect1: `Setores tech (+34%) e agro (+28%) lideram. Startups conseguem funding mais fácil. IPOs voltam a ser viáveis.`,
    effect2: `Confiança empresarial alta → Investimentos em expansão → M&A aquece. Mas risco de superaquecimento e inflação.`,
    opportunity: `Janela para expansão geográfica e novos produtos. CAC tende a cair com mais consumo. Investir em brand building.`,
    action: `Expandir operações enquanto custo de capital permite. Investir em aquisição de clientes. Construir reserva para desaceleração futura.`,
  })

  if (usd > 5.3) signals.push({
    id: 'deep-cambio', type: 'alert', title: `Dólar R$${usd.toFixed(2)} — Importação encarecida`, urgency: Math.min(80, Math.round(usd * 12)),
    trigger: `Real desvalorizado em R$${usd.toFixed(2)}. Fuga de capital estrangeiro + incerteza fiscal + juros americanos altos.`,
    cause: `Matéria-prima importada encarece → Tecnologia e eletrônicos sobem → Custo de produção aumenta em toda cadeia.`,
    effect1: `Combustível mais caro → Frete sobe → Preço final ao consumidor aumenta. Inflação importada pressiona IPCA.`,
    effect2: `Exportadores (agro, mineração) se beneficiam. Balança comercial melhora mas consumo interno sofre.`,
    opportunity: `Exportação fica competitiva. Substituição de importações ganha viabilidade. Turismo receptivo aquece.`,
    action: `Buscar fornecedores nacionais. Fazer hedge cambial para contratos em dólar. Renegociar prazos de pagamento em moeda forte.`,
  })

  data.opportunities.slice(0, 2).forEach(opp => signals.push({
    id: `deep-opp-${opp.id}`, type: 'opportunity', title: opp.label, urgency: opp.urgency,
    trigger: `Oportunidade detectada com urgência ${opp.urgency}% — janela temporal limitada.`,
    cause: `Condições de mercado criaram gap competitivo. Quem agir primeiro captura valor desproporcional.`,
    effect1: `Empresas que aproveitam reduzem CAC em até 30%. First-mover advantage comprovado.`,
    effect2: `Janela fecha em 60-90 dias conforme concorrentes reagem. Preços de mídia tendem a subir.`,
    opportunity: `ROI estimado de 3-5x se executado corretamente com testes A/B e iteração rápida.`,
    action: `Alocar 10-15% do orçamento de marketing para teste. Validar em 30 dias. Escalar se ROI > 3x.`,
  }))

  return signals.sort((a, b) => b.urgency - a.urgency).slice(0, 5)
}

const SIG_BORDER: Record<string, string> = {
  risk: 'border-l-red-500/40', opportunity: 'border-l-emerald-500/40',
  alert: 'border-l-amber-500/40', info: 'border-l-white/20',
}

function DeepSignalCard({ signal, index }: { signal: DeepSignal; index: number }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }}
      className={`rounded-lg border-l-2 ${SIG_BORDER[signal.type]} cursor-pointer`}
      style={{ background: 'rgba(255,255,255,0.02)' }}
      onClick={() => setExpanded(!expanded)}>
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className={`text-[8px] font-bold uppercase tracking-wider ${signal.type === 'risk' ? 'text-red-400/40' : signal.type === 'opportunity' ? 'text-emerald-400/40' : 'text-amber-400/40'}`}>
            {signal.type === 'risk' ? 'RISCO' : signal.type === 'opportunity' ? 'OPORT.' : 'ALERTA'}
          </span>
          <p className="text-[11px] font-medium text-white/55 truncate">{signal.title}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className="font-mono text-[10px] text-white/25">{signal.urgency}%</span>
          <span className="text-[10px] text-white/15">{expanded ? '▾' : '▸'}</span>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-3 pb-3 space-y-2 border-t border-white/[0.04] pt-2">
              <Step label="GATILHO" text={signal.trigger} color="text-white/40" />
              <Step label="CAUSA" text={signal.cause} color="text-white/35" />
              <Step label="EFEITO 1º" text={signal.effect1} color="text-white/35" />
              <Step label="EFEITO 2º" text={signal.effect2} color="text-white/30" />
              <Step label="OPORTUNIDADE" text={signal.opportunity} color="text-emerald-400/40" />
              <Step label="AÇÃO" text={signal.action} color="text-amber-300/45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Step({ label, text, color }: { label: string; text: string; color: string }) {
  return (
    <div>
      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/15">{label}</span>
      <p className={`text-[10px] ${color} leading-relaxed mt-0.5`}>{text}</p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ██  PANORAMA — COMMAND CENTER
// ══════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PanoramaSection({ data }: { data: any }) {
  const signals = useMemo(() => buildDeepSignals(data), [data])

  const radarData = useMemo(() => {
    const selicScore = Math.max(0, 100 - v(data.macro.selic?.value, 10.5) * 5)
    const pibScore = Math.min(100, v(data.macro.pib?.value, 2.9) * 25) // used in radarData array below
    const commodityAvg = Object.values(data.commodities as Record<string, { delta: number }>)
      .reduce((s: number, c) => s + (c.delta > 0 ? 60 + c.delta * 5 : 40 + c.delta * 3), 0) / Math.max(1, Object.keys(data.commodities).length)
    const techHeat = (data.sectors as Array<{ id: string; heat: number }>).find((s: { id: string }) => s.id === 'tech')?.heat ?? 50
    const socialScore = Math.max(20, 100 - v(data.macro.ipca?.value, 4.8) * 10)
    const marketAvg = (data.sectors as Array<{ heat: number }>).reduce((s: number, sec: { heat: number }) => s + sec.heat, 0) / (data.sectors.length || 1)
    const esgScore = 55
    const mktScore = Math.max(20, 100 - (data.marketing?.cacTrend?.delta ?? 12) * 2)
    return [selicScore, commodityAvg, techHeat, socialScore, marketAvg, Math.min(100, techHeat * 1.1), esgScore, mktScore].map(v => Math.round(Math.max(5, Math.min(95, v))))
  }, [data])

  const marketScore = useMemo(() => Math.round(radarData.reduce((a, b) => a + b, 0) / radarData.length), [radarData])
  const sectors = data.sectors as Array<{ id: string; label: string; change: number; heat: number; trend: string }>
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
          <div className="h-[380px] lg:h-[420px]">
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
              return (
                <motion.div key={ind.label} className="relative cursor-pointer group"
                  style={{ width: 148 }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                  {/* Fundo glassmorphism */}
                  <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(14px)' }} />
                  {/* Borda de alerta no topo */}
                  <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${alertColor}, transparent)` }} />
                  {/* Cantos em L */}
                  <svg className="absolute top-0 left-0" width="12" height="12"><path d="M0,10 L0,0 L10,0" fill="none" stroke={alertColor} strokeWidth="1.5"/></svg>
                  <svg className="absolute top-0 right-0" width="12" height="12"><path d="M12,10 L12,0 L2,0" fill="none" stroke={alertColor} strokeWidth="1.5"/></svg>
                  <svg className="absolute bottom-0 left-0" width="12" height="12"><path d="M0,2 L0,12 L10,12" fill="none" stroke={alertColor} strokeWidth="1.5"/></svg>
                  <svg className="absolute bottom-0 right-0" width="12" height="12"><path d="M12,2 L12,12 L2,12" fill="none" stroke={alertColor} strokeWidth="1.5"/></svg>
                  {/* Scan line animada */}
                  <motion.div className="absolute left-0 right-0 h-px pointer-events-none"
                    style={{ background: `linear-gradient(90deg, transparent, ${alertColor}, transparent)`, opacity: 0.4 }}
                    animate={{ top: ['0%', '100%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }} />
                  {/* Conteudo */}
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
                    {/* Barra de progresso */}
                    <div className="mt-2 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div className="h-full rounded-full" style={{ background: alertColor }}
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} />
                    </div>
                    <span className="font-mono text-[8px] tracking-[0.1em] mt-1 block" style={{ color: 'rgba(255,255,255,0.2)' }}>{ind.desc}</span>
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
                    <span className="font-mono text-[8px] tracking-[0.1em] mt-1 block text-right" style={{ color: 'rgba(255,255,255,0.2)' }}>{ind.desc}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Score central flutuando embaixo do globo */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-4 rounded-lg px-4 py-2"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
            <div className="flex items-center gap-2">
              <motion.div className="h-2.5 w-2.5 rounded-full"
                style={{ background: marketScore >= 60 ? 'rgba(52,211,153,0.8)' : 'rgba(251,191,36,0.8)',
                  boxShadow: `0 0 10px ${marketScore >= 60 ? 'rgba(52,211,153,0.5)' : 'rgba(251,191,36,0.5)'}` }}
                animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="font-mono text-xl font-bold text-white/80">{marketScore}</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/25">Market Score</span>
            </div>
            <div className="h-5 w-px bg-white/10" />
            {/* Commodities inline */}
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

      {/* ══ BLOCO 2: GAUGES MACRO (velocimetros detalhados) ══ */}
      <div>
        <SectionLabel>Indicadores Macro — Velocímetros</SectionLabel>
        <div className="h-48 rounded-lg border border-white/[0.06] cursor-pointer hover:border-white/[0.12] transition-colors"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.015) 0%, rgba(0,0,0,0.4) 70%)' }}>
          <MacroGauges selic={v(data.macro.selic?.value, 10.5)} ipca={v(data.macro.ipca?.value, 4.8)} pib={v(data.macro.pib?.value, 2.9)} usd={v(data.macro.usdBrl?.value, 5.72)} />
        </div>
      </div>

      {/* ══ BLOCO 3: RADAR 8D + TREEMAP ══ */}
      <div>
        <SectionLabel>Análise Multidimensional + Setores</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Radar */}
          <div className="relative h-64 lg:h-72 rounded-lg border border-white/[0.06]"
            style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.5) 80%)' }}>
            <div className="pointer-events-none absolute left-0 top-0 h-4 w-4 border-l border-t border-white/10" />
            <div className="pointer-events-none absolute right-0 top-0 h-4 w-4 border-r border-t border-white/10" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-l border-b border-white/10" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-r border-b border-white/10" />
            <Radar8D data={radarData} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center">
                <motion.div className="h-3 w-3 rounded-full"
                  style={{ background: marketScore >= 60 ? 'rgba(52,211,153,0.7)' : 'rgba(251,191,36,0.7)',
                    boxShadow: `0 0 14px ${marketScore >= 60 ? 'rgba(52,211,153,0.5)' : 'rgba(251,191,36,0.5)'}` }}
                  animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                <span className="font-mono text-2xl font-bold text-white/85">{marketScore}</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">Score</span>
              </div>
            </div>
          </div>
          {/* Treemap */}
          <div className="h-64 lg:h-72 rounded-lg border border-white/[0.06] overflow-hidden" style={{ background: 'rgba(0,0,0,0.35)' }}>
            <SectorTreemap sectors={sectors} />
          </div>
        </div>
      </div>

      {/* ══ BLOCO 4: AGENTES GLOBAIS ══ */}
      <div>
        <SectionLabel>Agentes Globais — Benchmarking</SectionLabel>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {agents.map((a, i) => (
            <motion.div key={a.id}
              className="flex items-center justify-between rounded-lg border border-white/[0.05] px-3 py-2.5"
              style={{ background: 'rgba(0,0,0,0.25)' }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <span className="text-[11px] font-medium text-white/50">{a.label}</span>
              <div className="flex flex-col items-end">
                <span className={`font-mono text-sm font-bold ${a.delta > 0 ? 'text-emerald-400/60' : 'text-red-400/50'}`}>
                  {a.delta > 0 ? '+' : ''}{a.delta.toFixed(1)}%
                </span>
                <span className="text-[9px] text-white/20 max-w-[100px] text-right">{a.impact}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ══ BLOCO 5: SINAIS PROFUNDOS ══ */}
      <div>
        <SectionLabel>Sinais de Mercado — Cadeia Causal</SectionLabel>
        <div className="flex flex-col gap-2">
          {signals.map((sig, i) => <DeepSignalCard key={sig.id} signal={sig} index={i} />)}
        </div>
      </div>

      {/* ══ BLOCO 6: NOTICIAS + HEATMAP ══ */}
      <div>
        <SectionLabel>Notícias em Tempo Real + Correlações</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="rounded-lg border border-white/[0.06] p-3" style={{ background: 'rgba(0,0,0,0.25)' }}>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/25 mb-2 block">Feed de Notícias</span>
            <NewsFeed />
          </div>
          <div className="rounded-lg border border-white/[0.06] overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/25 p-3 block">Correlação Commodities × Setores</span>
            <div className="h-56">
              <CorrelationHeatmap sectors={sectors} commodities={commodities} />
            </div>
          </div>
        </div>
      </div>

      {/* ══ BLOCO 7: BENCHMARKING SETORIAL ══ */}
      <div>
        <SectionLabel>Benchmarking Setorial — Ranking</SectionLabel>
        <div className="h-72 rounded-lg border border-white/[0.06] p-2" style={{ background: 'rgba(0,0,0,0.25)' }}>
          <BenchmarkBars sectors={sectors} />
        </div>
      </div>

      {/* ══ BLOCO 8: RISCOS & OPORTUNIDADES ══ */}
      <div>
        <SectionLabel>Riscos & Oportunidades</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-400/30">Problemas Centrais</span>
            {problems.map((p, i) => (
              <motion.div key={p.id} className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                <span className="text-[11px] text-white/40 w-36 truncate">{p.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
                  <motion.div className="h-full rounded-full"
                    style={{ background: p.affected > 55 ? 'rgba(192,57,43,0.45)' : 'rgba(243,156,18,0.35)' }}
                    initial={{ width: 0 }} animate={{ width: `${p.affected}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }} />
                </div>
                <span className="font-mono text-xs font-bold text-white/50 w-9 text-right">{p.affected}%</span>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-400/30">Oportunidades</span>
            {opportunities.map((o, i) => (
              <motion.div key={o.id} className="flex items-center gap-3"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                <span className="text-[11px] text-white/40 w-36 truncate">{o.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
                  <motion.div className="h-full rounded-full" style={{ background: 'rgba(46,204,113,0.35)' }}
                    initial={{ width: 0 }} animate={{ width: `${o.urgency}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }} />
                </div>
                <span className="font-mono text-xs font-bold text-emerald-400/50 w-9 text-right">{o.urgency}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
