'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import * as echarts from 'echarts'
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Brain,
  Calculator,
  CheckCircle2,
  DollarSign,
  Edit3,
  FileSpreadsheet,
  FileText,
  Globe,
  LayoutDashboard,
  Lightbulb,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Tag,
  Target,
  Trash2,
  TrendingUp,
  TrendingDown,
  Upload,
  Users,
  X,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import BusinessChart from '@/components/business/BusinessChart'
import BusinessClock from '@/components/business/BusinessClock'
import {
  buildAdvisorSummary,
  buildScenarioSeries,
  buildScenarioVariants,
  computeBusinessSnapshot,
  type BusinessModuleKey,
} from '@/lib/business-math'
import { ingestBusinessFile } from '@/lib/business-ingestion'
import {
  useBusinessStore,
  type BusinessWorkspace,
  type CanvasCard,
  type ComplianceRisk,
  type JourneyNode,
  type TeamMember,
} from '@/store/business-store'

const moduleMeta: Array<{
  key: BusinessModuleKey
  title: string
  subtitle: string
  sem: string
  icon: LucideIcon
}> = [
  { key: 'command',    title: 'Cockpit Financeiro',   subtitle: 'análise financeira e health score',    sem: '1º–3º Sem', icon: LayoutDashboard },
  { key: 'innovation', title: 'Inovação & Tendências', subtitle: 'gestão da inovação e radar digital',  sem: '1º Sem',    icon: Zap           },
  { key: 'scenarios',  title: 'Cenários & Forecast',   subtitle: 'macro, stress test e precificação',   sem: '3º Sem',    icon: Activity      },
  { key: 'pricing',    title: 'Smart Pricing',         subtitle: 'precificação inteligente baseada em custo', sem: '3º Sem', icon: Tag         },
  { key: 'market',     title: 'Mercado & Concorrência', subtitle: 'análise mercadológica e big data',   sem: '2º Sem',    icon: Globe         },
  { key: 'people',     title: 'Pessoas & Liderança',   subtitle: 'gestão de equipes e people analytics', sem: '2º Sem',  icon: Users         },
  { key: 'compliance', title: 'ESG & Ética',           subtitle: 'empreendedorismo social e compliance', sem: '4º Sem',  icon: ShieldCheck   },
  { key: 'twin',       title: 'Processos & Operações', subtitle: 'jornada, gargalos e digital twin',   sem: '2º Sem',    icon: Target        },
  { key: 'model',      title: 'Canvas & Pitch',        subtitle: 'empreendedorismo, canvas e viabilidade', sem: '3º Sem', icon: Lightbulb    },
]

const journeyLaneLabels: Record<JourneyNode['lane'], string> = {
  acquisition: 'Acquisition',
  conversion: 'Conversion',
  delivery: 'Delivery',
  retention: 'Retention',
}

const squadLabels: Record<TeamMember['squad'], string> = {
  growth: 'Growth',
  ops: 'Ops',
  finance: 'Finance',
}

const canvasLaneLabels: Record<CanvasCard['lane'], string> = {
  problem: 'Problem',
  solution: 'Solution',
  revenue: 'Revenue',
  'go-to-market': 'Go-to-market',
  esg: 'ESG',
  pitch: 'Pitch',
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

function formatCompact(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function workspaceKindLabel(kind: BusinessWorkspace['kind']) {
  return kind === 'client' ? 'Cliente' : 'Empresa principal'
}

function sourceStatusLabel(status: BusinessWorkspace['sourceStatus']) {
  switch (status) {
    case 'manual':
      return 'Base manual'
    case 'connected':
      return 'Workspace conectado'
    case 'validated':
      return 'Base validada'
    default:
      return 'Base vazia'
  }
}

function SectionHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  eyebrow: string
  title: string
  description: string
  icon: LucideIcon
}) {
  return (
    <div className="mb-7">
      <div className="mb-4 flex items-center gap-3">
        <div className="chrome-subtle flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.9rem]">
          <Icon className="h-4.5 w-4.5 text-white/68" />
        </div>
        <p className="text-[9px] uppercase tracking-[0.44em] text-white/26">{eyebrow}</p>
      </div>
      <h3
        className="metal-text text-[1.6rem] font-semibold leading-tight tracking-[-0.01em] md:text-[2rem]"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        {title}
      </h3>
      <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-white/40">{description}</p>
    </div>
  )
}

function MetricCard({
  label,
  value,
  detail,
  tone = 'neutral',
  className = '',
}: {
  label: string
  value: string
  detail: string
  tone?: 'positive' | 'negative' | 'neutral'
  className?: string
}) {
  const valueClass =
    tone === 'positive'
      ? 'metal-text'
      : tone === 'negative'
        ? 'text-white/52'
        : 'text-white/82'

  const dotClass =
    tone === 'positive'
      ? 'bg-white/52 animate-pulse'
      : tone === 'negative'
        ? 'bg-white/14'
        : 'bg-white/24'

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-60, 60], [4, -4]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-60, 60], [-4, 4]), { stiffness: 300, damping: 30 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      className={`chrome-panel relative cursor-default rounded-[1.6rem] p-5 ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.015 }}
      transition={{ scale: { duration: 0.25 } }}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <p className="text-[9px] uppercase tracking-[0.34em] text-white/26">{label}</p>
        <span className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
      </div>
      <motion.p
        key={value}
        className={`text-[2.2rem] font-semibold leading-none tracking-[-0.02em] ${valueClass}`}
        style={{ fontFamily: 'Poppins, sans-serif' }}
        initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        {value}
      </motion.p>
      <p className="mt-3 text-[11px] leading-relaxed text-white/28">{detail}</p>
    </motion.div>
  )
}

function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  display?: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs uppercase tracking-[0.18em] text-white/44">{label}</label>
        <span className="metal-text text-sm font-medium">{display ?? value.toString()}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-black/30"
        style={{ accentColor: '#f3f5f8' }}
      />
    </div>
  )
}

function DataField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <label className="chrome-subtle rounded-[1rem] p-3">
      <span className="text-[10px] uppercase tracking-[0.16em] text-white/32">{label}</span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value || 0))}
        className="mt-2 w-full bg-transparent text-sm font-medium text-white/82 outline-none"
      />
    </label>
  )
}

// ── Benchmark Setorial — Big Data layer ───────────────────────────────────────
function BenchmarkBlock({
  metric,
  yourValue,
  sectorAvg,
  top10,
  unit = '',
  higherIsBetter = true,
}: {
  metric: string
  yourValue: number | null
  sectorAvg: number
  top10: number
  unit?: string
  higherIsBetter?: boolean
}) {
  const hasValue = yourValue !== null && yourValue > 0
  const position = hasValue
    ? yourValue >= top10
      ? 'top10'
      : yourValue >= sectorAvg
        ? 'above'
        : 'below'
    : 'unknown'

  const positionLabel = position === 'top10' ? 'Top 10%' : position === 'above' ? 'Acima da média' : position === 'below' ? 'Abaixo da média' : '--'
  const pct = hasValue ? Math.min((yourValue / top10) * 100, 100) : 0
  const avgPct = Math.min((sectorAvg / top10) * 100, 100)

  return (
    <div className="rounded-[1.1rem] border border-white/[0.07] bg-black/14 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/44">{metric}</p>
        <span className={`text-[9px] font-semibold uppercase tracking-[0.14em] ${
          position === 'top10' ? 'text-white/72' : position === 'above' ? 'text-white/52' : 'text-white/28'
        }`}>{positionLabel}</span>
      </div>
      <div className="relative mb-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        {/* sector avg marker */}
        <div className="absolute bottom-0 top-0 w-0.5 bg-white/20" style={{ left: `${avgPct}%` }} />
        {/* your bar */}
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${position === 'top10' ? 'bg-white/52' : position === 'above' ? 'bg-white/36' : 'bg-white/18'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/24">Você</p>
          <p className="mt-0.5 text-xs font-semibold text-white/62">{hasValue ? `${yourValue.toFixed(1)}${unit}` : '--'}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/24">Média</p>
          <p className="mt-0.5 text-xs font-semibold text-white/42">{sectorAvg.toFixed(1)}{unit}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/24">Top 10%</p>
          <p className="mt-0.5 text-xs font-semibold text-white/42">{top10.toFixed(1)}{unit}</p>
        </div>
      </div>
    </div>
  )
}

// ── CONDUTA — every analysis ends with a real action ──────────────────────────
function ConductaBlock({
  analysis,
  action,
  sem,
  discipline,
}: {
  analysis: string
  action: string
  sem: string
  discipline: string
}) {
  return (
    <div className="mt-5 overflow-hidden rounded-[1.3rem] border border-white/[0.08]"
      style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(6,6,8,0.12)_100%)' }}>
      <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-4 py-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-white/52" />
        <p className="text-[8px] font-semibold uppercase tracking-[0.38em] text-white/44">Conduta</p>
        <span className="ml-auto rounded-full border border-white/[0.08] px-2 py-0.5 text-[8px] uppercase tracking-[0.16em] text-white/30">
          {sem} • {discipline}
        </span>
      </div>
      <div className="px-4 py-3 space-y-2">
        <p className="text-[11px] leading-relaxed text-white/54">{analysis}</p>
        <p className="text-[12px] font-semibold leading-relaxed text-white/84">{action}</p>
      </div>
    </div>
  )
}

// ── Bloomberg Ticker ─────────────────────────────────────────────────────────
function BusinessTicker({ items }: { items: Array<{ label: string; value: string; delta?: string; up?: boolean | null }> }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const content = [...items, ...items] // duplicate for seamless loop

  return (
    <div className="relative overflow-hidden rounded-[1.2rem] border border-white/[0.07] px-0 py-0"
      style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(6,6,8,0.1)_100%)' }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.10),transparent)]" />
      <div className="flex items-center">
        <div className="shrink-0 border-r border-white/[0.07] px-3 py-2">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/52" />
            <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-white/34">Live</span>
          </span>
        </div>
        <div className="no-scrollbar overflow-hidden flex-1">
          <motion.div
            ref={trackRef}
            className="flex gap-0 whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          >
            {content.map((item, i) => (
              <div key={i} className="flex shrink-0 items-center gap-2 border-r border-white/[0.06] px-4 py-2">
                <span className="text-[9px] uppercase tracking-[0.18em] text-white/34">{item.label}</span>
                <span className="text-[11px] font-semibold text-white/78">{item.value}</span>
                {item.delta && (
                  <span className={`text-[9px] font-medium ${item.up === true ? 'text-white/62' : item.up === false ? 'text-white/38' : 'text-white/44'}`}>
                    {item.up === true ? '↑' : item.up === false ? '↓' : '→'} {item.delta}
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function AbaTrabalhar({ onSwitchToEstudo }: { onSwitchToEstudo?: () => void }) {
  const activeModule = useBusinessStore((state) => state.activeModule)
  const setActiveModule = useBusinessStore((state) => state.setActiveModule)
  const activeWorkspaceId = useBusinessStore((state) => state.activeWorkspaceId)
  const workspaces = useBusinessStore((state) => state.workspaces)
  const setActiveWorkspace = useBusinessStore((state) => state.setActiveWorkspace)
  const createClient = useBusinessStore((state) => state.createClient)
  const updateWorkspaceMeta = useBusinessStore((state) => state.updateWorkspaceMeta)
  const archiveWorkspace = useBusinessStore((state) => state.archiveWorkspace)
  const restoreWorkspace = useBusinessStore((state) => state.restoreWorkspace)
  const resetWorkspaceData = useBusinessStore((state) => state.resetWorkspaceData)
  const updateInput = useBusinessStore((state) => state.updateInput)
  const patchInputs = useBusinessStore((state) => state.patchInputs)
  const moveJourneyNode = useBusinessStore((state) => state.moveJourneyNode)
  const moveTeamMember = useBusinessStore((state) => state.moveTeamMember)
  const moveCanvasCard = useBusinessStore((state) => state.moveCanvasCard)
  const setUploadSummary = useBusinessStore((state) => state.setUploadSummary)
  const updateMarketSignals = useBusinessStore((state) => state.updateMarketSignals)
  const updateRisk = useBusinessStore((state) => state.updateRisk)
  const addRisk = useBusinessStore((state) => state.addRisk)
  const deleteRisk = useBusinessStore((state) => state.deleteRisk)

  const [isIngesting, setIsIngesting] = useState(false)
  const [activeCommandMomentIndex, setActiveCommandMomentIndex] = useState(0)
  const [commandPlaybackIndex, setCommandPlaybackIndex] = useState(0)
  const [isClientFormOpen, setIsClientFormOpen] = useState(false)
  const [showArchivedClients, setShowArchivedClients] = useState(false)
  const [newClientName, setNewClientName] = useState('')
  const [newClientSector, setNewClientSector] = useState('')
  const [workspaceNameDraft, setWorkspaceNameDraft] = useState('')
  const [workspaceSectorDraft, setWorkspaceSectorDraft] = useState('')

  // Market Intelligence
  const [isUpdatingMarket, setIsUpdatingMarket] = useState(false)
  const [marketLastUpdated, setMarketLastUpdated] = useState<Date | null>(null)

  // AI Advisor
  const [isAnalyzingAdvisor, setIsAnalyzingAdvisor] = useState(false)
  const [aiAdvisorResult, setAiAdvisorResult] = useState<{
    primary: string
    narrative: string
    recommendation: string
  } | null>(null)

  // Compliance editing
  const [editingRiskId, setEditingRiskId] = useState<string | null>(null)
  const [riskDraft, setRiskDraft] = useState<Partial<Omit<ComplianceRisk, 'id'>>>({})
  const [isAddingRisk, setIsAddingRisk] = useState(false)
  const [newRiskDraft, setNewRiskDraft] = useState({ area: '', legalRisk: 40, ethicalRisk: 40, impact: 50000 })
  const [eventFeed, setEventFeed] = useState<Array<{ id: number; text: string; sem: string; tag: string }>>([])

  const activeWorkspaces = workspaces.filter((workspace) => workspace.status === 'active')
  const archivedWorkspaces = workspaces.filter((workspace) => workspace.status === 'archived')
  const activeWorkspace =
    activeWorkspaces.find((workspace) => workspace.id === activeWorkspaceId) ?? activeWorkspaces[0] ?? workspaces[0]
  const updatedAtLabel = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(activeWorkspace.updatedAt))

  const inputs = activeWorkspace.inputs
  const journey = activeWorkspace.journey
  const team = activeWorkspace.team
  const modelCanvas = activeWorkspace.modelCanvas
  const risks = activeWorkspace.risks
  const marketSignals = activeWorkspace.marketSignals
  const uploadSummary = activeWorkspace.uploadSummary

  const snapshot = computeBusinessSnapshot(inputs)
  const variants = buildScenarioVariants(inputs)
  const scenarioSeries = buildScenarioSeries(inputs, 12)
  const advisor = buildAdvisorSummary(snapshot)
  const isConnectedWorkspace =
    activeWorkspace.sourceStatus === 'connected' || activeWorkspace.sourceStatus === 'validated'
  const isDemoMode =
    activeWorkspace.sourceStatus === 'manual' || activeWorkspace.sourceStatus === 'empty'
  const cockpitReady = snapshot.isConfigured

  const totalLeakage = journey.reduce((total, node) => total + node.leakageCost, 0)
  const avgCycleDays = journey.reduce((total, node) => total + node.avgDays, 0) / journey.length
  const avgConversion = journey.reduce((total, node) => total + node.conversionRate, 0) / journey.length
  const avgStress = team.reduce((total, member) => total + member.stress, 0) / team.length
  const avgProductivity = team.reduce((total, member) => total + member.productivity, 0) / team.length
  const avgEngagement = team.reduce((total, member) => total + member.engagement, 0) / team.length
  const ethicalScore = clamp(
    100 -
      risks.reduce((total, risk) => total + risk.ethicalRisk, 0) / risks.length * 0.6 -
      inputs.ethicsRisk * 0.2,
    14,
    97,
  )
  const totalRiskImpact = risks.reduce((total, risk) => total + risk.impact, 0)
  const paybackMonths =
    inputs.expectedReturn > 0 ? clamp(inputs.plannedInvestment / (inputs.expectedReturn / 12), 1, 36) : 36

  // Smart Pricing calculations (3º Sem • Precificação)
  const [targetMarginPct, setTargetMarginPct] = useState(30)
  const costPerUnit = inputs.unitsSold > 0
    ? inputs.fixedCosts / inputs.unitsSold + inputs.pricePerUnit * (inputs.variableCostRate / 100)
    : inputs.pricePerUnit * (inputs.variableCostRate / 100)
  const smartPrice = inputs.variableCostRate < 100
    ? costPerUnit / (1 - targetMarginPct / 100)
    : inputs.pricePerUnit
  const currentPriceMarginPct = inputs.pricePerUnit > 0
    ? clamp(((inputs.pricePerUnit - costPerUnit) / inputs.pricePerUnit) * 100, -99, 99)
    : 0
  const breakEvenUnits = inputs.pricePerUnit > 0 && inputs.variableCostRate < 100
    ? Math.ceil(inputs.fixedCosts / (inputs.pricePerUnit * (1 - inputs.variableCostRate / 100)))
    : 0

  // Innovation Radar values (1º Sem • Gestão da Inovação)
  const innovationRadarValues = [
    cockpitReady ? clamp(inputs.growthRate * 3.5 + 50, 0, 100) : 28,
    clamp(ethicalScore, 0, 100),
    clamp(marketSignals.find((s) => s.label === 'Demanda')?.value ?? 60, 0, 100),
    cockpitReady ? clamp(snapshot.ltvCac / 5 * 100, 0, 100) : 20,
    clamp(avgEngagement, 0, 100),
    cockpitReady ? clamp(snapshot.healthScore, 0, 100) : 18,
  ]

  // Respostas Inteligentes — contextual answers derived from data
  const smartAnswers: Array<{ sem: string; tag: string; text: string; status: 'ok' | 'alert' | 'neutral' }> = []
  if (cockpitReady) {
    if (snapshot.marginPct < 18) {
      smartAnswers.push({ sem: '3º Sem', tag: 'Precificação', text: `Margem em ${formatPercent(snapshot.marginPct)} — abaixo de 18%. Reajuste de preço de ~${formatPercent(Math.max(1, (18 - snapshot.marginPct) * 0.8))} resolve.`, status: 'alert' })
    } else {
      smartAnswers.push({ sem: '3º Sem', tag: 'Precificação', text: `Margem em ${formatPercent(snapshot.marginPct)} — saudável. Posição favorável para expansão de portfólio.`, status: 'ok' })
    }
    if (snapshot.ltvCac < 3) {
      smartAnswers.push({ sem: '2º Sem', tag: 'Marketing', text: `LTV/CAC em ${snapshot.ltvCac.toFixed(1)}x — abaixo do ideal. Foco em retenção melhora o múltiplo sem elevar CAC.`, status: 'alert' })
    } else {
      smartAnswers.push({ sem: '2º Sem', tag: 'Marketing', text: `LTV/CAC em ${snapshot.ltvCac.toFixed(1)}x — eficiência de aquisição sólida. Escalar investimento em aquisição.`, status: 'ok' })
    }
    if (snapshot.runwayMonths < 6) {
      smartAnswers.push({ sem: '1º Sem', tag: 'Finanças', text: `Runway de ${snapshot.runwayMonths.toFixed(1)} meses — captação ou corte de despesas fixas em até 90 dias.`, status: 'alert' })
    }
    smartAnswers.push({ sem: '4º Sem', tag: 'ESG', text: `Score ESG em ${ethicalScore.toFixed(0)}/100 — ${ethicalScore > 70 ? 'posição sólida para captação de linhas de impacto.' : 'melhora no score abre linhas de crédito ESG.'}`, status: ethicalScore > 70 ? 'ok' : 'neutral' })
    const demandSignal = marketSignals.find((s) => s.label === 'Demanda')
    if (demandSignal && demandSignal.value > 70) {
      smartAnswers.push({ sem: '2º Sem', tag: 'Mercado', text: `Demanda em ${demandSignal.value}% — janela para expansão de portfólio ou aumento de preço sem resistência.`, status: 'ok' })
    }
  } else {
    smartAnswers.push({ sem: '—', tag: 'Base', text: 'Preencha a base mínima (receita, despesas, caixa, preço, CAC e LTV) para receber respostas inteligentes.', status: 'neutral' })
  }

  useEffect(() => {
    setWorkspaceNameDraft(activeWorkspace.name)
    setWorkspaceSectorDraft(activeWorkspace.sector)
  }, [activeWorkspace.id, activeWorkspace.name, activeWorkspace.sector])

  const commandMoments = cockpitReady
    ? [
        {
          index: 0,
          label: isDemoMode ? 'Base manual' : 'Base conectada',
          detail: isDemoMode
            ? `Simulação manual iniciada para ${activeWorkspace.name}.`
            : `Dados conectados via ${activeWorkspace.sourceLabel}.`,
        },
        {
          index: 3,
          label: 'Ponto de margem',
          detail: `A margem projetada alcança ${formatPercent(snapshot.marginPct)} no cenário atual.`,
        },
        {
          index: 7,
          label: 'Zona de caixa',
          detail:
            snapshot.burnRate > 0
              ? `O runway estimado é ${snapshot.runwayMonths.toFixed(1)} meses.`
              : 'O caixa segue positivo e sustenta expansão controlada.',
        },
      ]
    : [
        {
          index: 0,
          label: 'Base mínima',
          detail: 'Preencha receita, despesas, caixa, preço, CAC e LTV para liberar a leitura oficial.',
        },
        {
          index: 4,
          label: 'Fonte de dados',
          detail: isConnectedWorkspace
            ? `Este contexto já tem dados conectados em ${activeWorkspace.sourceLabel}.`
            : 'Você pode preencher manualmente ou conectar um arquivo CSV, XLSX, XLS ou PDF.',
        },
        {
          index: 8,
          label: 'Cockpit liberado',
          detail: 'Quando a base mínima estiver completa, o deck ativa margem, EBITDA, runway e diagnóstico.',
        },
      ]

  const commandHighlightSequence = commandMoments.map((event) => ({
    seriesIndex: 0,
    dataIndex: event.index,
  }))

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveCommandMomentIndex((current) => (current + 1) % commandMoments.length)
    }, 2400)

    return () => window.clearInterval(interval)
  }, [commandMoments.length])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCommandPlaybackIndex((current) => (current + 1) % scenarioSeries.length)
    }, 1300)

    return () => window.clearInterval(interval)
  }, [scenarioSeries.length])

  useEffect(() => {
    const events: Array<{ id: number; text: string; sem: string; tag: string }> = []
    if (cockpitReady) {
      if (snapshot.marginPct < 18) {
        events.push({ id: 1, text: `Margem operacional em ${formatPercent(snapshot.marginPct)} — abaixo de 18%.`, sem: '3º Sem', tag: 'Precificação' })
      } else {
        events.push({ id: 1, text: `Margem em ${formatPercent(snapshot.marginPct)} — zona de expansão.`, sem: '3º Sem', tag: 'Precificação' })
      }
      if (snapshot.ltvCac < 3) {
        events.push({ id: 2, text: `LTV/CAC ${snapshot.ltvCac.toFixed(2)}x — eficiência comercial pressionada.`, sem: '2º Sem', tag: 'Marketing' })
      } else {
        events.push({ id: 2, text: `LTV/CAC ${snapshot.ltvCac.toFixed(2)}x — aquisição eficiente.`, sem: '2º Sem', tag: 'Marketing' })
      }
      if (snapshot.runwayMonths < 8) {
        events.push({ id: 3, text: `Runway ${snapshot.runwayMonths.toFixed(1)}m — defesa de caixa necessária.`, sem: '1º Sem', tag: 'Finanças' })
      } else {
        events.push({ id: 3, text: `Runway ${snapshot.runwayMonths.toFixed(1)}m — caixa seguro.`, sem: '1º Sem', tag: 'Finanças' })
      }
      events.push({ id: 4, text: `Health ${snapshot.healthScore.toFixed(0)} · EBITDA ${formatCompact(snapshot.ebitda)}`, sem: '1º–3º Sem', tag: 'Cockpit' })
    } else {
      events.push({ id: 0, text: 'Preencha a base mínima para ativar o feed de eventos ao vivo.', sem: '—', tag: 'Base' })
    }
    setEventFeed(events)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cockpitReady, snapshot.healthScore, snapshot.marginPct, snapshot.ltvCac, snapshot.runwayMonths, snapshot.ebitda])

  const playbackProgress = (commandPlaybackIndex + 1) / scenarioSeries.length
  const activeSeriesPoint = scenarioSeries[commandPlaybackIndex]
  const animatedLtvValue = cockpitReady ? inputs.ltv * (0.45 + playbackProgress * 0.55) : 0
  const animatedCacValue = cockpitReady ? inputs.cac * (0.82 + (1 - playbackProgress) * 0.18) : 0
  const animatedContributionValue = cockpitReady ? snapshot.contributionMargin * playbackProgress : 0
  const animatedEbitdaValue = cockpitReady ? snapshot.ebitda * playbackProgress : 0

  // Business Pulse Radar — 6D
  const pulseRadarValues = [
    cockpitReady ? snapshot.healthScore : 12,
    cockpitReady ? clamp(snapshot.marginPct * 2.8, 0, 100) : 10,
    cockpitReady ? clamp(snapshot.ltvCac / 5 * 100, 0, 100) : 8,
    clamp(ethicalScore, 0, 100),
    clamp(avgProductivity, 0, 100),
    clamp(marketSignals.find((s) => s.id === 'demand')?.value ?? 68, 0, 100),
  ]

  const pulseRadarOption: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    animationDuration: 1200,
    animationEasing: 'cubicOut',
    radar: {
      indicator: [
        { name: 'Health', max: 100 },
        { name: 'Margem', max: 100 },
        { name: 'LTV/CAC', max: 100 },
        { name: 'ESG', max: 100 },
        { name: 'People', max: 100 },
        { name: 'Mercado', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 4,
      center: ['50%', '50%'],
      radius: '68%',
      axisName: {
        color: 'rgba(255,255,255,0.42)',
        fontSize: 10,
        fontFamily: 'Poppins, sans-serif',
      },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.07)' } },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(255,255,255,0.012)', 'rgba(255,255,255,0.024)', 'rgba(255,255,255,0.012)', 'rgba(255,255,255,0.018)'],
        },
      },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: pulseRadarValues,
            areaStyle: {
              color: 'rgba(255,255,255,0.05)',
            },
            lineStyle: {
              color: 'rgba(255,255,255,0.48)',
              width: 1.5,
            },
            itemStyle: {
              color: 'rgba(255,255,255,0.72)',
            },
            symbolSize: 4,
          },
        ],
      },
    ],
  }

  const innovationRadarOption: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    animationDuration: 1400,
    animationEasing: 'cubicOut',
    radar: {
      indicator: [
        { name: 'Inovação', max: 100 },
        { name: 'Sustentab.', max: 100 },
        { name: 'Mercado', max: 100 },
        { name: 'Modelo', max: 100 },
        { name: 'Pessoas', max: 100 },
        { name: 'Finanças', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 4,
      center: ['50%', '50%'],
      radius: '68%',
      axisName: { color: 'rgba(255,255,255,0.42)', fontSize: 10, fontFamily: 'Poppins, sans-serif' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.07)' } },
      splitArea: { show: true, areaStyle: { color: ['rgba(255,255,255,0.012)', 'rgba(255,255,255,0.024)', 'rgba(255,255,255,0.012)', 'rgba(255,255,255,0.018)'] } },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: innovationRadarValues,
        areaStyle: { color: 'rgba(255,255,255,0.07)' },
        lineStyle: { color: 'rgba(255,255,255,0.54)', width: 2 },
        itemStyle: { color: 'rgba(255,255,255,0.78)' },
        symbolSize: 5,
      }],
    }],
  }

  const performanceOption: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    animationDuration: 600,
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(8,8,10,0.94)',
      borderColor: 'rgba(255,255,255,0.12)',
      textStyle: { color: '#f5f7fa' },
    },
    grid: { left: 16, right: 16, top: 20, bottom: 24, containLabel: true },
    legend: {
      top: 0,
      textStyle: { color: 'rgba(255,255,255,0.52)', fontSize: 11 },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: scenarioSeries.map((point) => point.month),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.12)' } },
      axisLabel: { color: 'rgba(255,255,255,0.42)', fontSize: 10 },
    },
    yAxis: [
      {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
        axisLabel: {
          color: 'rgba(255,255,255,0.42)',
          formatter: (value: number) => `${Math.round(value / 1000)}k`,
        },
      },
      {
        type: 'value',
        axisLine: { show: false },
        splitLine: { show: false },
        axisLabel: {
          color: 'rgba(255,255,255,0.34)',
          formatter: (value: number) => `${Math.round(value / 1000)}k`,
        },
      },
    ],
    series: [
      {
        name: isDemoMode ? 'Manual Revenue' : 'Revenue',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: scenarioSeries.map((point, index) => (index <= commandPlaybackIndex ? point.realisticRevenue : null)),
        lineStyle: { width: 3, color: '#f3f5f8' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(243,245,248,0.36)' },
            { offset: 1, color: 'rgba(243,245,248,0.02)' },
          ]),
        },
        markLine: cockpitReady
          ? {
              symbol: 'none',
              lineStyle: { color: 'rgba(255,255,255,0.18)', type: 'dashed' },
              label: { show: false },
              data: commandMoments.map((event) => ({ xAxis: scenarioSeries[event.index]?.month })),
            }
          : undefined,
        markPoint: cockpitReady
          ? {
              symbol: 'circle',
              symbolSize: 22,
              itemStyle: {
                color: '#f3f5f8',
                borderColor: 'rgba(5,5,5,0.94)',
                borderWidth: 1,
              },
              label: { show: false },
              data: commandMoments.map((event) => ({
                name: event.label,
                coord: [
                  scenarioSeries[event.index]?.month,
                  scenarioSeries[event.index]?.realisticRevenue,
                ],
              })),
            }
          : undefined,
      },
      {
        name: isDemoMode ? 'Manual Profit' : 'Profit',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        symbol: 'none',
        data: scenarioSeries.map((point, index) => (index <= commandPlaybackIndex ? point.realisticProfit : null)),
        lineStyle: { width: 2, color: '#b8bec6' },
      },
    ],
  }

  const scenarioOption: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    animationDuration: 900,
    animationEasing: 'elasticOut',
    animationDelay: (idx: number) => idx * 80,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(8,8,10,0.94)',
      borderColor: 'rgba(255,255,255,0.12)',
      textStyle: { color: '#f5f7fa' },
    },
    grid: { left: 16, right: 16, top: 24, bottom: 16, containLabel: true },
    xAxis: {
      type: 'category',
      data: variants.map((item) => item.label),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.12)' } },
      axisLabel: { color: 'rgba(255,255,255,0.44)' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisLabel: {
        color: 'rgba(255,255,255,0.42)',
        formatter: (value: number) => `${Math.round(value / 1000)}k`,
      },
    },
    series: [
      {
        name: 'Profit',
        type: 'bar',
        barWidth: 24,
        data: variants.map((item, index) => ({
          value: item.profit,
          itemStyle: {
            borderRadius: [10, 10, 0, 0],
            color: ['#f3f5f8', '#cbd1d8', '#8e949c'][index],
          },
        })),
      },
    ],
  }

  const marketOption: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    animationDuration: 1400,
    animationEasing: 'cubicOut',
    radar: {
      radius: '66%',
      splitNumber: 4,
      axisName: { color: 'rgba(255,255,255,0.56)' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
      splitArea: { areaStyle: { color: ['transparent'] } },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
      indicator: marketSignals.map((signal) => ({
        name: signal.label,
        max: signal.label === 'Dolar' ? 10 : 100,
      })),
    },
    tooltip: {
      backgroundColor: 'rgba(8,8,10,0.94)',
      borderColor: 'rgba(255,255,255,0.12)',
      textStyle: { color: '#f5f7fa' },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: marketSignals.map((signal) => signal.value),
            name: 'Market pressure',
            areaStyle: { color: 'rgba(243,245,248,0.18)' },
            lineStyle: { color: '#f3f5f8', width: 2 },
            itemStyle: { color: '#f3f5f8' },
          },
        ],
      },
    ],
  }

  const complianceOption: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    animationDuration: 800,
    animationEasing: 'cubicInOut',
    animationDelay: (idx: number) => idx * 40,
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(8,8,10,0.94)',
      borderColor: 'rgba(255,255,255,0.12)',
      textStyle: { color: '#f5f7fa' },
    },
    grid: { left: 50, right: 10, top: 12, bottom: 20 },
    xAxis: {
      type: 'category',
      data: ['Legal', 'Ethical', 'Impact'],
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.12)' } },
      axisLabel: { color: 'rgba(255,255,255,0.48)' },
    },
    yAxis: {
      type: 'category',
      data: risks.map((risk) => risk.area),
      axisLine: { show: false },
      axisLabel: { color: 'rgba(255,255,255,0.48)' },
    },
    visualMap: {
      min: 0,
      max: 100,
      show: false,
      inRange: {
        color: ['rgba(255,255,255,0.08)', '#8e949c', '#f3f5f8'],
      },
    },
    series: [
      {
        type: 'heatmap',
        data: risks.flatMap((risk, rowIndex) => [
          [0, rowIndex, risk.legalRisk],
          [1, rowIndex, risk.ethicalRisk],
          [2, rowIndex, clamp(Math.round(risk.impact / 1000), 0, 100)],
        ]),
        label: {
          show: true,
          color: '#050505',
          formatter: ({ value }) => `${Array.isArray(value) ? value[2] : ''}`,
        },
        itemStyle: {
          borderRadius: 12,
          borderColor: 'rgba(255,255,255,0.06)',
          borderWidth: 1,
        },
      },
    ],
  }

  const peopleOption: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    animationDuration: 1000,
    animationEasing: 'cubicOut',
    animationDelay: (idx: number) => idx * 60,
    tooltip: {
      formatter: (params: unknown) => {
        const typed = params as { data?: { name?: string; value?: number[] } }
        return `${typed.data?.name ?? ''}<br/>Produtividade: ${typed.data?.value?.[0] ?? 0}<br/>Engajamento: ${typed.data?.value?.[1] ?? 0}`
      },
      backgroundColor: 'rgba(8,8,10,0.94)',
      borderColor: 'rgba(255,255,255,0.12)',
      textStyle: { color: '#f5f7fa' },
    },
    grid: { left: 16, right: 16, top: 20, bottom: 20, containLabel: true },
    xAxis: {
      type: 'value',
      min: 40,
      max: 100,
      name: 'Produtividade',
      nameTextStyle: { color: 'rgba(255,255,255,0.44)' },
      axisLabel: { color: 'rgba(255,255,255,0.44)' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    },
    yAxis: {
      type: 'value',
      min: 40,
      max: 100,
      name: 'Engajamento',
      nameTextStyle: { color: 'rgba(255,255,255,0.44)' },
      axisLabel: { color: 'rgba(255,255,255,0.44)' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    },
    series: [
      {
        type: 'scatter',
        data: team.map((member) => ({
          name: member.name,
          value: [member.productivity, member.engagement, member.salary],
          symbolSize: 18 + member.stress / 2,
          itemStyle: {
            color:
              member.stress > 50 ? '#8e949c' : member.productivity > 84 ? '#f3f5f8' : '#cad0d7',
          },
        })),
      },
    ],
  }

  const revenueFlowOption: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(8,8,10,0.94)',
      borderColor: 'rgba(255,255,255,0.12)',
      textStyle: { color: '#f5f7fa' },
    },
    grid: { left: 16, right: 16, top: 20, bottom: 18, containLabel: true },
    xAxis: {
      type: 'category',
      data: ['LTV', 'CAC', 'Margem', 'EBITDA'],
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.12)' } },
      axisLabel: { color: 'rgba(255,255,255,0.44)' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisLabel: {
        color: 'rgba(255,255,255,0.44)',
        formatter: (value: number) => `${Math.round(value / 1000)}k`,
      },
    },
    series: [
      {
        type: 'bar',
        barWidth: 24,
        data: [
          { value: animatedLtvValue, itemStyle: { color: '#f3f5f8', borderRadius: [10, 10, 0, 0] } },
          { value: animatedCacValue, itemStyle: { color: '#a7adb5', borderRadius: [10, 10, 0, 0] } },
          { value: animatedContributionValue, itemStyle: { color: '#d9dee4', borderRadius: [10, 10, 0, 0] } },
          { value: animatedEbitdaValue, itemStyle: { color: '#8e949c', borderRadius: [10, 10, 0, 0] } },
        ],
      },
    ],
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setIsIngesting(true)

    try {
      const summary = await ingestBusinessFile(file)
      setUploadSummary(summary)

      patchInputs({
        monthlyRevenue: summary.metrics.revenue ?? inputs.monthlyRevenue,
        operatingExpenses: summary.metrics.costs ?? inputs.operatingExpenses,
        cashReserve: summary.metrics.cash ?? inputs.cashReserve,
        cac: summary.metrics.cac ?? inputs.cac,
        ltv: summary.metrics.ltv ?? inputs.ltv,
      })
    } finally {
      setIsIngesting(false)
      event.target.value = ''
    }
  }

  function handleCreateClient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const name = newClientName.trim()
    const sector = newClientSector.trim()

    if (!name || !sector) return

    createClient({ name, sector })
    setNewClientName('')
    setNewClientSector('')
    setIsClientFormOpen(false)
  }

  function handleSaveWorkspaceMeta() {
    const name = workspaceNameDraft.trim()
    const sector = workspaceSectorDraft.trim()

    if (!name || !sector) return

    updateWorkspaceMeta(activeWorkspace.id, { name, sector })
  }

  function handleArchiveActiveWorkspace() {
    archiveWorkspace(activeWorkspace.id)
  }

  function handleJourneyDrop(event: React.DragEvent<HTMLDivElement>, lane: JourneyNode['lane']) {
    event.preventDefault()
    const id = event.dataTransfer.getData('business-journey')
    if (id) moveJourneyNode(id, lane)
  }

  function handleTeamDrop(event: React.DragEvent<HTMLDivElement>, squad: TeamMember['squad']) {
    event.preventDefault()
    const id = event.dataTransfer.getData('business-team')
    if (id) moveTeamMember(id, squad)
  }

  function handleCanvasDrop(event: React.DragEvent<HTMLDivElement>, lane: CanvasCard['lane']) {
    event.preventDefault()
    const id = event.dataTransfer.getData('business-canvas')
    if (id) moveCanvasCard(id, lane)
  }

  async function handleUpdateMarket() {
    setIsUpdatingMarket(true)
    try {
      const response = await fetch('/api/market')
      if (!response.ok) throw new Error('Failed')
      const data = await response.json() as { signals: typeof marketSignals; updatedAt: string }
      updateMarketSignals(data.signals)
      setMarketLastUpdated(new Date())
    } catch {
      // silent fail — keep current data
    } finally {
      setIsUpdatingMarket(false)
    }
  }

  async function handleAnalyzeAdvisor() {
    if (!cockpitReady) return
    setIsAnalyzingAdvisor(true)
    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snapshot, inputs, workspace: { name: activeWorkspace.name, sector: activeWorkspace.sector } }),
      })
      if (!response.ok) throw new Error('Failed')
      const data = await response.json() as { primary: string; narrative: string; recommendation: string }
      setAiAdvisorResult(data)
    } catch {
      // silent fail
    } finally {
      setIsAnalyzingAdvisor(false)
    }
  }

  function handleStartEditRisk(risk: ComplianceRisk) {
    setEditingRiskId(risk.id)
    setRiskDraft({ area: risk.area, legalRisk: risk.legalRisk, ethicalRisk: risk.ethicalRisk, impact: risk.impact })
  }

  function handleSaveRisk(id: string) {
    updateRisk(id, riskDraft)
    setEditingRiskId(null)
    setRiskDraft({})
  }

  function handleAddRisk() {
    if (!newRiskDraft.area.trim()) return
    addRisk(newRiskDraft)
    setNewRiskDraft({ area: '', legalRisk: 40, ethicalRisk: 40, impact: 50000 })
    setIsAddingRisk(false)
  }

  const workspaceContextPanel = (
    <div className="chrome-panel rounded-[1.5rem] p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="chrome-subtle flex h-10 w-10 items-center justify-center rounded-[0.95rem]">
          <Users className="h-4 w-4 text-white/82" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.26em] text-white/34">Workspace Context</p>
          <h4 className="text-sm font-semibold text-white/88">Empresa, cliente e fonte de dados</h4>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {activeWorkspaces.map((workspace) => (
          <button
            key={workspace.id}
            onClick={() => setActiveWorkspace(workspace.id)}
            className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition ${
              workspace.id === activeWorkspace.id
                ? 'border-white/22 bg-white/82 text-[#050505]'
                : 'chrome-subtle border-white/10 text-white/54 hover:text-white/78'
            }`}
          >
            {workspace.name}
          </button>
        ))}
        <button
          onClick={() => setIsClientFormOpen((current) => !current)}
          className="chrome-subtle rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/54 transition hover:text-white/78"
        >
          Novo cliente
        </button>
        <button
          onClick={() => setShowArchivedClients((current) => !current)}
          className="chrome-subtle rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/54 transition hover:text-white/78"
        >
          Arquivo {archivedWorkspaces.length > 0 ? `(${archivedWorkspaces.length})` : ''}
        </button>
      </div>

      {isClientFormOpen ? (
        <form
          onSubmit={handleCreateClient}
          className="chrome-subtle mb-4 rounded-[1.1rem] p-4"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <label className="chrome-subtle rounded-[1rem] p-3">
              <span className="text-[10px] uppercase tracking-[0.16em] text-white/32">Nome do cliente</span>
              <input
                type="text"
                value={newClientName}
                onChange={(event) => setNewClientName(event.target.value)}
                placeholder="Ex.: Clínica Aurora"
                className="mt-2 w-full bg-transparent text-sm font-medium text-white/82 outline-none placeholder:text-white/24"
              />
            </label>
            <label className="chrome-subtle rounded-[1rem] p-3">
              <span className="text-[10px] uppercase tracking-[0.16em] text-white/32">Setor</span>
              <input
                type="text"
                value={newClientSector}
                onChange={(event) => setNewClientSector(event.target.value)}
                placeholder="Ex.: Saúde, varejo, consultoria"
                className="mt-2 w-full bg-transparent text-sm font-medium text-white/82 outline-none placeholder:text-white/24"
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsClientFormOpen(false)
                setNewClientName('')
                setNewClientSector('')
              }}
              className="rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-white/56"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!newClientName.trim() || !newClientSector.trim()}
              className="rounded-full border border-white/16 bg-white/84 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-[#050505] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Criar cliente
            </button>
          </div>
        </form>
      ) : null}

      {showArchivedClients ? (
        <div className="chrome-subtle mb-4 rounded-[1.1rem] p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Arquivo</p>
              <p className="mt-1 text-xs text-white/48">Clientes arquivados ficam preservados para restauração posterior.</p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/52">
              {archivedWorkspaces.length} arquivado{archivedWorkspaces.length === 1 ? '' : 's'}
            </span>
          </div>

          {archivedWorkspaces.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {archivedWorkspaces.map((workspace) => (
                <div key={workspace.id} className="chrome-subtle rounded-[1rem] p-4">
                  <p className="text-sm font-medium text-white/82">{workspace.name}</p>
                  <p className="mt-1 text-xs text-white/48">{workspace.sector}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-white/28">
                    {workspace.archivedAt
                      ? `Arquivado em ${new Intl.DateTimeFormat('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        }).format(new Date(workspace.archivedAt))}`
                      : 'Arquivado'}
                  </p>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => restoreWorkspace(workspace.id)}
                      className="rounded-full border border-white/12 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/68"
                    >
                      Restaurar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/52">Nenhum cliente arquivado por enquanto.</p>
          )}
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="chrome-subtle rounded-[1rem] p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Selecionado</p>
          <p className="mt-2 text-sm font-medium text-white/78">{activeWorkspace.name}</p>
          <p className="mt-1 text-xs text-white/48">{activeWorkspace.sector}</p>
        </div>
        <div className="chrome-subtle rounded-[1rem] p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Fonte</p>
          <p className="mt-2 text-sm font-medium text-white/78">{activeWorkspace.sourceLabel}</p>
          <p className="mt-1 text-xs text-white/48">
            {sourceStatusLabel(activeWorkspace.sourceStatus)}
          </p>
        </div>
        <div className="chrome-subtle rounded-[1rem] p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Estrutura</p>
          <p className="mt-2 text-sm font-medium text-white/78">{workspaceKindLabel(activeWorkspace.kind)}</p>
          <p className="mt-1 text-xs text-white/48">
            {activeWorkspace.kind === 'client'
              ? 'Cada cliente mantém dados, uploads e simulações isolados.'
              : 'A empresa principal organiza o cockpit base do aplicativo.'}
          </p>
        </div>
        <div className="chrome-subtle rounded-[1rem] p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Persistência</p>
          <p className="mt-2 text-sm font-medium text-white/78">
            {isConnectedWorkspace ? 'Pronto para sync' : 'Local no navegador'}
          </p>
          <p className="mt-1 text-xs text-white/48">Pronto para evoluir para Supabase.</p>
        </div>
      </div>

      <div className="chrome-subtle mt-4 rounded-[1rem] p-4">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Identificação do contexto</p>
            <p className="mt-1 text-xs text-white/48">
              Defina nome e setor antes de alimentar o cockpit com dados manuais ou arquivo real.
            </p>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/52">
            {workspaceKindLabel(activeWorkspace.kind)}
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="chrome-subtle rounded-[1rem] p-3">
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/32">Nome</span>
            <input
              type="text"
              value={workspaceNameDraft}
              onChange={(event) => setWorkspaceNameDraft(event.target.value)}
              className="mt-2 w-full bg-transparent text-sm font-medium text-white/82 outline-none"
            />
          </label>
          <label className="chrome-subtle rounded-[1rem] p-3">
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/32">Setor</span>
            <input
              type="text"
              value={workspaceSectorDraft}
              onChange={(event) => setWorkspaceSectorDraft(event.target.value)}
              className="mt-2 w-full bg-transparent text-sm font-medium text-white/82 outline-none"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap justify-between gap-3">
          <p className="max-w-2xl text-xs leading-relaxed text-white/54">
            {activeWorkspace.kind === 'client'
              ? 'Este cliente pode ser arquivado sem perder o histórico. Depois, ele pode ser restaurado no arquivo.'
              : 'A empresa principal permanece ativa e não entra na lógica de arquivamento dos clientes.'}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSaveWorkspaceMeta}
              disabled={!workspaceNameDraft.trim() || !workspaceSectorDraft.trim()}
              className="rounded-full border border-white/12 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-white/68 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Salvar identificação
            </button>
            <button
              type="button"
              onClick={() => resetWorkspaceData(activeWorkspace.id)}
              className="rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-white/56"
            >
              Limpar base
            </button>
            {activeWorkspace.kind === 'client' ? (
              <button
                type="button"
                onClick={handleArchiveActiveWorkspace}
                className="rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-white/56"
              >
                Arquivar cliente
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <label className="chrome-input mt-4 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.2rem] border border-dashed px-4 py-6 text-center">
        <div className="chrome-subtle flex h-11 w-11 items-center justify-center rounded-full border border-white/12">
          {isIngesting ? <Activity className="h-5 w-5 animate-pulse text-white/78" /> : <Upload className="h-5 w-5 text-white/78" />}
        </div>
        <div>
          <p className="text-sm font-medium text-white/84">
            {isIngesting ? 'Lendo arquivo do contexto...' : 'Conectar arquivo do contexto'}
          </p>
          <p className="mt-1 text-xs text-white/48">CSV, XLSX, XLS ou PDF contábil para gerar leitura real neste contexto.</p>
        </div>
        <input type="file" accept=".csv,.xlsx,.xls,.pdf" className="hidden" onChange={handleFileUpload} />
      </label>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="chrome-subtle rounded-[1rem] p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">O que preencher</p>
          <div className="mt-3 space-y-2 text-xs leading-relaxed text-white/58">
            <p>1. Selecione a empresa principal ou um cliente.</p>
            <p>2. Defina nome, setor e fonte dos dados do contexto.</p>
            <p>3. Preencha receita, despesas, caixa, preço, CAC e LTV, ou conecte planilha/PDF.</p>
            <p>4. O cockpit libera a leitura oficial quando a base mínima estiver completa.</p>
          </div>
        </div>

        <div className="chrome-subtle rounded-[1rem] p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Como o cockpit calcula</p>
          <div className="mt-3 space-y-2 text-xs leading-relaxed text-white/60">
            <p>Receita mensal + despesas + preço + caixa geram margem, EBITDA, burn e runway.</p>
            <p>CAC + LTV alimentam eficiência comercial, diagnóstico e risco do modelo.</p>
            <p>Sem base mínima, o cockpit não assume números oficiais e fica em estado guiado.</p>
          </div>
        </div>
      </div>

      <div className="chrome-subtle mt-4 rounded-[1rem] p-4">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Base do cockpit</p>
            <p className="mt-1 text-xs text-white/48">
              Esta base define de onde saem os números do workspace ativo antes da conexão com Supabase.
            </p>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/52">
            {cockpitReady
              ? `Cockpit liberado • ${snapshot.filledRequiredFields}/${snapshot.requiredFieldCount}`
              : `Base incompleta • ${snapshot.filledRequiredFields}/${snapshot.requiredFieldCount}`}
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <DataField
            label="Receita mensal"
            value={inputs.monthlyRevenue}
            onChange={(value) => updateInput('monthlyRevenue', value)}
          />
          <DataField
            label="Despesas operacionais"
            value={inputs.operatingExpenses}
            onChange={(value) => updateInput('operatingExpenses', value)}
          />
          <DataField
            label="Caixa disponível"
            value={inputs.cashReserve}
            onChange={(value) => updateInput('cashReserve', value)}
          />
          <DataField
            label="Preço por unidade"
            value={inputs.pricePerUnit}
            onChange={(value) => updateInput('pricePerUnit', value)}
          />
          <DataField
            label="CAC"
            value={inputs.cac}
            onChange={(value) => updateInput('cac', value)}
          />
          <DataField
            label="LTV"
            value={inputs.ltv}
            onChange={(value) => updateInput('ltv', value)}
          />
        </div>
      </div>
    </div>
  )

  const commandModule = (
    <div className="space-y-6">
      {workspaceContextPanel}

      <div className="grid gap-6 xl:grid-cols-[1.28fr_0.92fr]">
      <div className="space-y-6">
        <div className="chrome-panel scan-surface panel-glow-top rounded-[1.7rem] p-5">
          <SectionHeader
            eyebrow="1º–3º Sem • Matemática Financeira / Análise Financeira"
            title="Cockpit financeiro, causal e consultivo"
            description={
              !cockpitReady
                ? 'O deck ainda está em estado guiado. Complete a base mínima do contexto para liberar margem, EBITDA, runway, LTV/CAC e diagnóstico oficial.'
                : isDemoMode
                  ? 'O deck está em base manual. Os números abaixo vêm dos campos preenchidos no contexto e estruturam a simulação antes da conexão de dados reais.'
                  : 'O deck está conectado a um contexto com dados ingeridos. Os números oficiais vêm do motor determinístico e a camada de IA interpreta causas e ações.'
            }
            icon={LayoutDashboard}
          />

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/56">
              {workspaceKindLabel(activeWorkspace.kind)}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/56">
              {sourceStatusLabel(activeWorkspace.sourceStatus)}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/56">
              {activeWorkspace.sourceLabel}
            </span>
          </div>

          <div className="chrome-subtle mb-4 rounded-[1.15rem] p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/32">
                  {!cockpitReady ? 'Base incompleta' : isDemoMode ? 'Simulação manual 6D' : 'Leitura conectada'}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/66">
                  {!cockpitReady
                    ? 'O gráfico fica em estado guiado até que a base mínima do contexto esteja completa. Ele passa a refletir leitura oficial quando receita, despesas, caixa, preço, CAC e LTV estiverem definidos.'
                    : isDemoMode
                      ? 'Sem dados reais conectados, o gráfico opera em base manual. Ele responde aos campos e sliders do contexto ativo e demonstra a lógica do cockpit.'
                      : 'Os dados deste gráfico vêm do contexto conectado. Os pontos destacados mostram onde a margem, o caixa e a leitura causal mudam.'}
                </p>
              </div>
              <div className="chrome-subtle rounded-[1rem] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/32">Workspace ativo</p>
                <p className="mt-2 text-sm font-medium text-white/82">{activeWorkspace.name}</p>
              </div>
            </div>
          </div>

          <BusinessChart
            option={performanceOption}
            className="h-[20rem] w-full"
            highlightSequence={commandHighlightSequence}
            cycleMs={2400}
          />

          <div className="chrome-subtle mt-4 rounded-[1.15rem] p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                  {!cockpitReady ? 'Estado guiado' : isDemoMode ? 'Ponto ativo da simulação' : 'Ponto ativo da leitura'}
                </p>
                <p className="mt-2 text-sm font-medium text-white/82">
                  {commandMoments[activeCommandMomentIndex]?.label}
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/62">
                  {commandMoments[activeCommandMomentIndex]?.detail}
                </p>
              </div>

              <div className="chrome-subtle rounded-[1rem] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/32">Mês em foco</p>
                <p className="mt-2 text-sm font-medium text-white/82">
                  {activeSeriesPoint?.month}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {commandMoments.map((moment, index) => (
              <div
                key={moment.label}
                className={`rounded-[1.15rem] border p-4 transition-all duration-500 ${
                  activeCommandMomentIndex === index
                    ? 'chrome-subtle border-white/20 shadow-[0_18px_34px_rgba(0,0,0,0.18)]'
                    : 'chrome-subtle border-white/10'
                } ${
                  index === 0 ? 'floating-card-soft' : index === 1 ? 'floating-card-soft-delay' : 'floating-card-soft-delay-2'
                }`}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/32">
                  {scenarioSeries[moment.index]?.month}
                </p>
                <p className="mt-2 text-sm font-medium text-white/78">{moment.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-white/52">{moment.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="chrome-panel rounded-[1.5rem] p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="chrome-subtle flex h-10 w-10 items-center justify-center rounded-[0.95rem]">
                <BarChart3 className="h-4 w-4 text-white/82" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.26em] text-white/34">Revenue Flow</p>
                <h4 className="text-sm font-semibold text-white/88">
                  {!cockpitReady ? 'Fluxo liberado após base mínima' : isDemoMode ? 'LTV, CAC, margem e EBITDA da base manual' : 'LTV, CAC, margem e EBITDA'}
                </h4>
              </div>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-white/52">
              {!cockpitReady
                ? 'Complete a base mínima do contexto para ativar o fluxo oficial. Enquanto isso, o módulo permanece em estado guiado.'
                : `Playback ativo em ${activeSeriesPoint?.month}. As barras reagem ao avanço da simulação e à base do workspace atual.`}
            </p>
            <BusinessChart option={revenueFlowOption} className="h-[15rem] w-full" />
          </div>

          <div className="chrome-panel rounded-[1.5rem] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="chrome-subtle flex h-10 w-10 items-center justify-center rounded-[0.95rem]">
                  <Lightbulb className="h-4 w-4 text-white/82" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.26em] text-white/34">AI Advisor</p>
                  <h4 className="text-sm font-semibold text-white/88">
                    {!cockpitReady ? 'Leitura orientada' : aiAdvisorResult ? 'Diagnóstico Claude AI' : 'Diagnóstico automático'}
                  </h4>
                </div>
              </div>
              {cockpitReady ? (
                <button
                  onClick={handleAnalyzeAdvisor}
                  disabled={isAnalyzingAdvisor}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/12 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/68 transition hover:text-white disabled:opacity-50"
                >
                  <Sparkles className={`h-3 w-3 ${isAnalyzingAdvisor ? 'animate-pulse' : ''}`} />
                  {isAnalyzingAdvisor ? 'Analisando...' : 'IA real'}
                </button>
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="chrome-subtle rounded-[1.2rem] p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/32">
                  {!cockpitReady ? 'Leitura orientada' : aiAdvisorResult ? 'Leitura Claude AI' : isDemoMode ? 'Leitura simulada' : 'Leitura'}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/78">
                  {!cockpitReady
                    ? advisor.primary
                    : aiAdvisorResult
                      ? aiAdvisorResult.primary
                      : isDemoMode
                        ? `Leitura consultiva para ${activeWorkspace.name}: ${advisor.primary}`
                        : advisor.primary}
                </p>
              </div>
              <div className="chrome-subtle rounded-[1.2rem] p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/32">
                  {!cockpitReady ? 'Base mínima' : aiAdvisorResult ? 'Causa raiz (IA)' : isDemoMode ? 'Causa calculada' : 'Causa raiz'}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/78">
                  {!cockpitReady
                    ? advisor.narrative
                    : aiAdvisorResult
                      ? aiAdvisorResult.narrative
                      : isDemoMode
                        ? `Simulação em ${activeWorkspace.sourceLabel}. ${advisor.narrative}`
                        : advisor.narrative}
                </p>
              </div>
              <div className="chrome-subtle rounded-[1.2rem] p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/32">
                  {aiAdvisorResult ? 'Ação prioritária (IA)' : 'Ação sugerida'}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/78">
                  {!cockpitReady
                    ? advisor.recommendation
                    : aiAdvisorResult
                      ? aiAdvisorResult.recommendation
                      : isDemoMode
                        ? `Para transformar a simulação em leitura real, conecte um arquivo da empresa. ${advisor.recommendation}`
                        : advisor.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* ── DRE Simplificado — 1º Sem • Demonstrações Contábeis ── */}
        <div className="chrome-panel rounded-[1.7rem] p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="chrome-subtle flex h-10 w-10 items-center justify-center rounded-[0.95rem]">
              <FileText className="h-4 w-4 text-white/82" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-white/34">1º Sem • Demonstrações Contábeis</p>
              <h4 className="text-sm font-semibold text-white/88">DRE Simplificado</h4>
            </div>
          </div>
          <div className="space-y-1">
            {([
              { label: 'Receita Bruta', value: snapshot.revenue, indent: false, type: 'revenue' as const, pct: undefined },
              { label: '(–) Custos Variáveis', value: -snapshot.variableCosts, indent: true, type: 'cost' as const, pct: undefined },
              { label: '= Margem de Contribuição', value: snapshot.contributionMargin, indent: false, type: 'subtotal' as const, pct: snapshot.contributionMarginPct },
              { label: '(–) Custos Fixos', value: -inputs.fixedCosts, indent: true, type: 'cost' as const, pct: undefined },
              { label: '(–) Despesas Operacionais', value: -inputs.operatingExpenses, indent: true, type: 'cost' as const, pct: undefined },
              { label: '(–) Time / RH', value: -inputs.teamCost, indent: true, type: 'cost' as const, pct: undefined },
              { label: '= EBITDA', value: snapshot.ebitda, indent: false, type: 'subtotal' as const, pct: undefined },
              { label: '(–) ESG & Compliance', value: -inputs.esgInvestment, indent: true, type: 'cost' as const, pct: undefined },
              { label: '= Resultado Líquido', value: snapshot.profit, indent: false, type: 'total' as const, pct: snapshot.marginPct },
            ]).map(({ label, value, indent, type, pct }) => (
              <div
                key={label}
                className={`flex items-center justify-between gap-3 rounded-[0.8rem] py-2 ${
                  type === 'total' ? 'border border-white/[0.08] bg-white/[0.05] px-3' :
                  type === 'subtotal' ? 'bg-white/[0.025] px-3' : 'px-3'
                }`}
                style={{ paddingLeft: indent ? '1.5rem' : undefined }}
              >
                <p className={`text-xs ${type === 'total' || type === 'subtotal' ? 'font-semibold text-white/78' : 'text-white/44'}`}>{label}</p>
                <div className="flex items-center gap-2.5">
                  {pct !== undefined && <span className="text-[10px] text-white/30">{pct.toFixed(1)}%</span>}
                  <p className={`text-sm font-semibold tabular-nums ${
                    !cockpitReady ? 'text-white/22' :
                    type === 'total' ? (value >= 0 ? 'metal-text' : 'text-white/48') :
                    type === 'subtotal' ? 'text-white/72' : 'text-white/46'
                  }`}>
                    {cockpitReady ? formatCurrency(value) : '--'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <MetricCard
            label={isDemoMode ? 'Health Score • Manual' : 'Health Score'}
            value={cockpitReady ? `${snapshot.healthScore.toFixed(0)}/100` : '--'}
            detail={
              cockpitReady
                ? isDemoMode
                  ? 'Calculado sobre a base manual do workspace.'
                  : 'Índice integrado de margem, runway, LTV/CAC e risco sistêmico.'
                : 'Aparece quando a base mínima do cockpit estiver completa.'
            }
            tone="positive"
          />
          <MetricCard
            label={isDemoMode ? 'Break-even • Manual' : 'Break-even'}
            value={cockpitReady ? formatCurrency(snapshot.breakEvenRevenue) : '--'}
            detail={
              cockpitReady ? `${snapshot.breakEvenUnits.toFixed(0)} unidades para não operar no prejuízo.` : 'Depende de receita, despesas, preço e margem mínima.'
            }
          />
          <MetricCard
            label={isDemoMode ? 'Burn & Runway • Manual' : 'Burn & Runway'}
            value={
              cockpitReady
                ? snapshot.burnRate > 0
                  ? `${formatCurrency(snapshot.burnRate)} / ${snapshot.runwayMonths.toFixed(1)}m`
                  : 'Caixa positivo'
                : '--'
            }
            detail={
              cockpitReady
                ? 'Velocidade de queima e meses de sobrevivência do negócio.'
                : 'Libera quando caixa, despesas e receita estiverem definidos.'
            }
            tone={cockpitReady && snapshot.burnRate > 0 ? 'negative' : 'positive'}
          />
          <MetricCard
            label={isDemoMode ? 'Stress Index • Manual' : 'Stress Index'}
            value={cockpitReady ? `${snapshot.stressIndex.toFixed(0)}/100` : '--'}
            detail={
              cockpitReady
                ? 'Combina inflação, câmbio, risco ético e pressão operacional.'
                : 'O stress test fica ativo quando a base mínima estiver pronta.'
            }
            tone={cockpitReady && snapshot.stressIndex > 60 ? 'negative' : 'neutral'}
          />
        </div>

        {/* ── Big Data / Benchmark Setorial ── */}
        <div className="chrome-panel rounded-[1.5rem] p-5">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-3.5 w-3.5 text-white/42" />
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/34">Big Data · Benchmark Setorial</p>
          </div>
          <div className="space-y-3">
            <BenchmarkBlock metric="Margem Operacional" yourValue={cockpitReady ? snapshot.marginPct : null} sectorAvg={18} top10={34} unit="%" />
            <BenchmarkBlock metric="LTV/CAC" yourValue={cockpitReady ? snapshot.ltvCac : null} sectorAvg={2.8} top10={5.5} higherIsBetter />
            <BenchmarkBlock metric="Runway (meses)" yourValue={cockpitReady ? snapshot.runwayMonths : null} sectorAvg={8} top10={18} unit="m" />
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-white/24">Benchmarks baseados em PMEs brasileiras do setor de serviços e tecnologia.</p>
        </div>

        <div className="chrome-panel rounded-[1.5rem] p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="chrome-subtle flex h-10 w-10 items-center justify-center rounded-[0.95rem]">
              <Target className="h-4 w-4 text-white/82" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-white/34">Consulting Readout</p>
              <h4 className="text-sm font-semibold text-white/88">
                {!cockpitReady ? 'Leitura guiada da base' : isDemoMode ? 'Leitura consultiva da base manual' : 'Pontos críticos do mês'}
              </h4>
            </div>
          </div>

          <div className="space-y-3">
            {snapshot.diagnostics.map((item) => (
              <div key={item} className="chrome-subtle flex items-start gap-3 rounded-[1rem] px-3 py-3">
                {item === snapshot.diagnostics[0] ? (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-white/84" />
                ) : (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white/66" />
                )}
                <p className="text-sm leading-relaxed text-white/72">
                  {!cockpitReady ? item : isDemoMode ? `Base manual • ${item}` : item}
                </p>
              </div>
            ))}
          </div>

          <ConductaBlock
            sem="1º–3º Sem"
            discipline="Matemática Financeira / Análise Financeira"
            analysis={
              !cockpitReady
                ? 'Base mínima ainda incompleta — sem leitura oficial disponível.'
                : snapshot.burnRate > 0
                  ? `Burn de ${formatCurrency(snapshot.burnRate)}/mês com runway de ${snapshot.runwayMonths.toFixed(1)} meses. O negócio está consumindo caixa.`
                  : `Margem de ${formatPercent(snapshot.marginPct)} com EBITDA de ${formatCurrency(snapshot.ebitda)}. Estrutura financeira operacional.`
            }
            action={
              !cockpitReady
                ? 'Preencha receita, despesas, caixa, preço, CAC e LTV para liberar a leitura oficial do cockpit.'
                : snapshot.burnRate > 0
                  ? `Corte despesas fixas para estender runway acima de 12 meses. Priorize receita recorrente para reverter o burn.`
                  : snapshot.marginPct < 18
                    ? `Margem abaixo de 18%. Reajuste preço em ~${formatPercent((18 - snapshot.marginPct) * 0.9)} ou reduza custo variável para recuperar posição.`
                    : `Estrutura financeira saudável. Utilize o excedente para testes de expansão controlada com monitoramento de LTV/CAC.`
            }
          />
        </div>
      </div>
      </div>
    </div>
  )

  const scenarioModule = (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.25fr]">
      <div className="chrome-panel rounded-[1.7rem] p-5">
        <SectionHeader
          eyebrow="3º Sem • Ambiente Macroeconômico / Cenários"
          title="Stress test, macro e ajuste instantâneo"
          description="Cada mudança de vendas, inflação, dólar, preço ou custo recalcula caixa, margem, runway e pressão do negócio em tempo real."
          icon={Activity}
        />

        <div className="space-y-5">
          <RangeField
            label="Receita mensal"
            value={inputs.monthlyRevenue}
            min={0}
            max={280000}
            step={1000}
            display={formatCurrency(inputs.monthlyRevenue)}
            onChange={(value) => updateInput('monthlyRevenue', value)}
          />
          <RangeField
            label="Despesas operacionais"
            value={inputs.operatingExpenses}
            min={0}
            max={100000}
            step={500}
            display={formatCurrency(inputs.operatingExpenses)}
            onChange={(value) => updateInput('operatingExpenses', value)}
          />
          <RangeField
            label="Preço por unidade"
            value={inputs.pricePerUnit}
            min={0}
            max={1200}
            step={10}
            display={formatCurrency(inputs.pricePerUnit)}
            onChange={(value) => updateInput('pricePerUnit', value)}
          />
          <RangeField
            label="Crescimento %"
            value={inputs.growthRate}
            min={-20}
            max={45}
            display={formatPercent(inputs.growthRate)}
            onChange={(value) => updateInput('growthRate', value)}
          />
          <RangeField
            label="Inflação %"
            value={inputs.inflationRate}
            min={0}
            max={18}
            step={0.1}
            display={formatPercent(inputs.inflationRate)}
            onChange={(value) => updateInput('inflationRate', value)}
          />
          <RangeField
            label="Dólar"
            value={inputs.fxRate}
            min={0}
            max={8}
            step={0.01}
            display={inputs.fxRate.toFixed(2)}
            onChange={(value) => updateInput('fxRate', value)}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="chrome-panel rounded-[1.7rem] p-5">
          <SectionHeader
            eyebrow="3º Sem • Precificação e Forecast"
            title="Otimista, realista e pessimista"
            description="O motor recalcula caixa, lucro, burn rate e runway com base no mesmo conjunto matemático, sem deixar a IA inventar números."
            icon={TrendingUp}
          />
          <BusinessChart option={scenarioOption} className="h-[20rem] w-full" />
        </div>

        <motion.div
          className="grid gap-4 md:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {variants.map((variant, index) => (
            <motion.div
              key={variant.label}
              variants={{
                hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="chrome-panel rounded-[1.35rem] p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/36">{variant.label}</p>
                {index === 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-white/88" />
                ) : index === 2 ? (
                  <ArrowDownRight className="h-4 w-4 text-white/62" />
                ) : (
                  <Activity className="h-4 w-4 text-white/72" />
                )}
              </div>
              <p className="metal-text text-[1.35rem] font-semibold">{formatCurrency(variant.revenue)}</p>
              <p className="mt-1 text-xs text-white/46">Receita prevista</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[1rem] border border-white/8 bg-black/14 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">Profit</p>
                  <p className="mt-1 text-sm font-medium text-white/76">{formatCurrency(variant.profit)}</p>
                </div>
                <div className="rounded-[1rem] border border-white/8 bg-black/14 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">Runway</p>
                  <p className="mt-1 text-sm font-medium text-white/76">{variant.runwayMonths.toFixed(1)}m</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <ConductaBlock
          sem="3º Sem"
          discipline="Ambiente Macroeconômico / Cenários"
          analysis={`Cenário realista projeta ${formatCurrency(variants[1]?.revenue ?? 0)} de receita com margem de ${formatPercent(variants[1]?.marginPct ?? 0)}. Pessimista aponta runway de ${variants[2]?.runwayMonths.toFixed(1) ?? '--'}m.`}
          action={`${variants[2] && variants[2].runwayMonths < 6 ? `No cenário pessimista, runway em ${variants[2].runwayMonths.toFixed(1)}m — construa reserva de contingência de pelo menos 3 meses de custo fixo.` : variants[0] && variants[0].marginPct > 20 ? `Cenário otimista com margem ${formatPercent(variants[0].marginPct)} — defina gatilho de aceleração de investimento quando receita atingir ${formatCurrency(variants[0].revenue)}.` : 'Mantenha monitoramento mensal dos indicadores macroeconômicos e ajuste os sliders ao mudar câmbio ou inflação.'}`}
        />
      </div>
    </div>
  )

  const twinModule = (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
      <div className="chrome-panel rounded-[1.7rem] p-5">
        <SectionHeader
          eyebrow="2º Sem • Gestão de Negócios / Processos"
          title="Jornada, gargalos e perda por etapa"
          description="Arraste cada etapa da jornada para redesenhar a operação. O twin recalcula ciclo médio, conversão e custo de vazamento."
          icon={Target}
        />

        <div className="grid gap-4 xl:grid-cols-4">
          {(['acquisition', 'conversion', 'delivery', 'retention'] as JourneyNode['lane'][]).map((lane) => (
            <div
              key={lane}
              className="chrome-grid-surface rounded-[1.35rem] border border-white/10 bg-black/14 p-3"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleJourneyDrop(event, lane)}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/36">{journeyLaneLabels[lane]}</p>
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/52">
                  {journey.filter((node) => node.lane === lane).length}
                </span>
              </div>

              <div className="space-y-3">
                {journey
                  .filter((node) => node.lane === lane)
                  .map((node) => (
                    <div
                      key={node.id}
                      draggable
                      onDragStart={(event) => event.dataTransfer.setData('business-journey', node.id)}
                      className="cursor-grab rounded-[1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(10,10,12,0.82)_52%,rgba(5,5,6,0.96)_100%)] p-3 active:cursor-grabbing"
                    >
                      <p className="text-sm font-medium text-white/84">{node.title}</p>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Conv</p>
                          <p className="text-xs text-white/72">{node.conversionRate}%</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Days</p>
                          <p className="text-xs text-white/72">{node.avgDays}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Leak</p>
                          <p className="text-xs text-white/72">{formatCompact(node.leakageCost)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <motion.div
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {([
            { label: 'Cycle time', value: `${avgCycleDays.toFixed(1)} dias`, detail: 'Tempo médio da jornada completa, do lead ao ciclo de retenção.', tone: 'neutral' as const },
            { label: 'Leakage cost', value: formatCurrency(totalLeakage), detail: 'Custo potencial perdido por atrito, atraso e clique errado.', tone: 'negative' as const },
            { label: 'Avg conversion', value: formatPercent(avgConversion), detail: 'Média de eficiência entre aquisição, conversão, entrega e retenção.', tone: 'neutral' as const },
          ]).map((card) => (
            <motion.div
              key={card.label}
              variants={{
                hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <MetricCard label={card.label} value={card.value} detail={card.detail} tone={card.tone} />
            </motion.div>
          ))}
        </motion.div>

        <div className="chrome-panel rounded-[1.5rem] p-5">
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/34">Plano de ação gerado</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-[1rem] border border-white/10 bg-black/14 p-4">
              <p className="text-sm font-medium text-white/78">Leitura do cenário</p>
              <p className="mt-2 text-sm leading-relaxed text-white/62">
                O twin mostra maior perda em conversão e proposta. A redução de um dia no ciclo já melhora o lucro operacional.
              </p>
            </div>
            <div className="rounded-[1rem] border border-white/10 bg-black/14 p-4">
              <p className="text-sm font-medium text-white/78">Causa raiz</p>
              <p className="mt-2 text-sm leading-relaxed text-white/62">
                A etapa de proposta tem custo de vazamento alto e alonga o tempo de fechamento. A precificação e o timing comercial precisam ser revistos.
              </p>
            </div>
            <div className="rounded-[1rem] border border-white/10 bg-black/14 p-4">
              <p className="text-sm font-medium text-white/78">Cronograma e orçamento</p>
              <p className="mt-2 text-sm leading-relaxed text-white/62">
                Sprint de 3 semanas para reduzir fricção na proposta, com budget estimado em {formatCurrency(18500)} e ganho potencial de {formatCurrency(totalLeakage * 0.34)}.
              </p>
            </div>
          </div>
        </div>

        <ConductaBlock
          sem="2º Sem"
          discipline="Gestão de Negócios / Processos"
          analysis={`Cycle time médio de ${avgCycleDays.toFixed(1)} dias com leakage total de ${formatCurrency(totalLeakage)}. Conversão média entre etapas: ${formatPercent(avgConversion)}.`}
          action={`Concentre esforço na etapa com maior vazamento (${formatCurrency(totalLeakage * 0.34)} de ganho potencial). Reduza o cycle time em pelo menos 20% para liberar capacidade operacional sem aumentar custo fixo.`}
        />
      </div>
    </div>
  )

  const marketModule = (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
      <div className="space-y-6">
        <div className="chrome-panel scan-surface panel-glow-top rounded-[1.7rem] p-5">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 flex items-center gap-3">
                <div className="chrome-subtle flex h-11 w-11 items-center justify-center rounded-[1rem]">
                  <Globe className="h-5 w-5 text-white/82" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-white/34">2º Sem • Análise Mercadológica / Análise Estatística</p>
                  <h3 className="metal-text text-[1.3rem] font-semibold tracking-[0.08em] md:text-[1.6rem]">Mercado, concorrência e análise estatística</h3>
                </div>
              </div>
              <p className="max-w-2xl text-justify text-sm leading-relaxed text-white/56">
                Engine de Análise Mercadológica: monitora câmbio, inflação, PIB e demanda. Identifica posição competitiva e traduz o cenário externo em ação executiva com base em Análise Estatística.
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <button
                onClick={handleUpdateMarket}
                disabled={isUpdatingMarket}
                className="flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-white/68 transition hover:text-white disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isUpdatingMarket ? 'animate-spin' : ''}`} />
                {isUpdatingMarket ? 'Atualizando...' : 'Dados reais'}
              </button>
              {marketLastUpdated ? (
                <p className="text-[10px] text-white/32">
                  Atualizado {new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(marketLastUpdated)}
                </p>
              ) : (
                <p className="text-[10px] text-white/24">IBGE + AwesomeAPI</p>
              )}
            </div>
          </div>
          <BusinessChart option={marketOption} className="h-[20rem] w-full" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {marketSignals.map((signal) => (
            <MetricCard
              key={signal.id}
              label={signal.label}
              value={
                signal.label === 'Dolar'
                  ? `R$ ${signal.value.toFixed(2)}`
                  : signal.label === 'IPCA' || signal.label === 'PIB'
                    ? `${signal.value}%`
                    : String(signal.value)
              }
              detail={`Delta ${signal.delta > 0 ? '+' : ''}${signal.delta} · ${signal.sentiment === 'up' ? 'Alta' : signal.sentiment === 'down' ? 'Baixa' : 'Neutro'}`}
              tone={signal.sentiment === 'up' ? 'positive' : signal.sentiment === 'down' ? 'negative' : 'neutral'}
            />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* ── TAM/SAM/SOM — 2º Sem • Análise Mercadológica ── */}
        <div className="chrome-panel rounded-[1.7rem] p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="chrome-subtle flex h-10 w-10 items-center justify-center rounded-[0.95rem]">
              <Globe className="h-4 w-4 text-white/82" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-white/34">2º Sem • Análise Mercadológica</p>
              <h4 className="text-sm font-semibold text-white/88">TAM · SAM · SOM</h4>
            </div>
          </div>
          {(() => {
            const tam = cockpitReady ? snapshot.revenue * 800 : 0
            const sam = tam * 0.14
            const som = sam * 0.08
            return (
              <div className="space-y-3">
                {([
                  { label: 'TAM', desc: 'Mercado Total Endereçável', value: tam, pct: 100, bar: 1 },
                  { label: 'SAM', desc: 'Segmento Atingível (14% do TAM)', value: sam, pct: 14, bar: 0.44 },
                  { label: 'SOM', desc: 'Captura Realista em 3 anos (8% do SAM)', value: som, pct: (som / (tam || 1)) * 100, bar: 0.14 },
                ] as const).map(({ label, desc, value, pct, bar }) => (
                  <div key={label} className="overflow-hidden rounded-[1.1rem] border border-white/[0.07] bg-black/14">
                    <div className="relative h-1">
                      <div className="absolute inset-0 bg-white/[0.04]" />
                      <div className="absolute inset-y-0 left-0 bg-white/32 transition-all duration-700" style={{ width: `${bar * 100}%` }} />
                    </div>
                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/52">{label}</span>
                          <span className="text-[9px] text-white/28">{pct.toFixed(1)}%</span>
                        </div>
                        <p className="mt-0.5 text-[10px] text-white/36">{desc}</p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold tabular-nums text-white/72">
                        {cockpitReady ? formatCompact(value) : '--'}
                      </p>
                    </div>
                  </div>
                ))}
                {!cockpitReady && (
                  <p className="text-[11px] text-white/32">Configure receita mensal para estimar TAM, SAM e SOM do seu segmento.</p>
                )}
              </div>
            )
          })()}
        </div>

        <div className="chrome-panel rounded-[1.7rem] p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="chrome-subtle flex h-11 w-11 items-center justify-center rounded-[1rem]">
              <Upload className="h-5 w-5 text-white/82" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-white/34">Ingestion Pipeline</p>
              <h4 className="text-sm font-semibold text-white/88">CSV, XLSX, PDF e dados reais</h4>
            </div>
          </div>

          <label className="chrome-input flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.35rem] border border-dashed px-5 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-black/16">
              {isIngesting ? <Activity className="h-5 w-5 animate-pulse text-white/78" /> : <Upload className="h-5 w-5 text-white/78" />}
            </div>
            <div>
              <p className="text-sm font-medium text-white/84">
                {isIngesting ? 'Lendo arquivo...' : 'Enviar planilha ou PDF contábil'}
              </p>
              <p className="mt-1 text-xs text-white/48">Convertemos dados em cockpit e ajustamos receita, caixa, CAC e LTV.</p>
            </div>
            <input type="file" accept=".csv,.xlsx,.xls,.pdf" className="hidden" onChange={handleFileUpload} />
          </label>

          <div className="mt-5 space-y-3">
            {uploadSummary ? (
              <>
                <div className="rounded-[1.2rem] border border-white/10 bg-black/14 p-4">
                  <div className="flex items-center gap-2">
                    {uploadSummary.type === 'PDF' ? (
                      <FileText className="h-4 w-4 text-white/76" />
                    ) : (
                      <FileSpreadsheet className="h-4 w-4 text-white/76" />
                    )}
                    <p className="text-sm font-medium text-white/82">{uploadSummary.name}</p>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/54">{uploadSummary.note}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-[0.95rem] border border-white/8 bg-black/14 p-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Receita</p>
                      <p className="mt-1 text-sm text-white/74">{uploadSummary.metrics.revenue ? formatCurrency(uploadSummary.metrics.revenue) : 'n/d'}</p>
                    </div>
                    <div className="rounded-[0.95rem] border border-white/8 bg-black/14 p-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Caixa</p>
                      <p className="mt-1 text-sm text-white/74">{uploadSummary.metrics.cash ? formatCurrency(uploadSummary.metrics.cash) : 'n/d'}</p>
                    </div>
                  </div>
                </div>

                {uploadSummary.preview.length > 0 ? (
                  <div className="rounded-[1.2rem] border border-white/10 bg-black/14 p-4">
                    <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-white/32">Preview</p>
                    <div className="space-y-2">
                      {uploadSummary.preview.map((row, index) => (
                        <div key={`${uploadSummary.name}-${index}`} className="rounded-[0.95rem] border border-white/8 bg-black/16 p-3 text-xs text-white/62">
                          {Object.entries(row).slice(0, 4).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between gap-3">
                              <span className="truncate uppercase tracking-[0.12em] text-white/32">{key}</span>
                              <span className="truncate">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="rounded-[1.2rem] border border-white/10 bg-black/14 p-4">
                <p className="text-sm text-white/68">Nenhum arquivo ingerido ainda. O pipeline já está pronto para CSV, XLSX, XLS e captura de PDF.</p>
              </div>
            )}
          </div>
        </div>
        <ConductaBlock
          sem="2º Sem"
          discipline="Análise Mercadológica / Análise Estatística"
          analysis={`${marketSignals.length} sinais de mercado monitorados. ${marketSignals.filter(s => s.sentiment === 'down').length > 0 ? `${marketSignals.filter(s => s.sentiment === 'down').length} sinal(is) de baixa detectado(s).` : 'Sinais majoritariamente positivos no período atual.'}`}
          action={`${marketSignals.find(s => s.sentiment === 'down') ? `Sinal de baixa em ${marketSignals.find(s => s.sentiment === 'down')?.label ?? 'mercado'} — atenção ao posicionamento de preço e canais de distribuição.` : 'Ambiente favorável. Explore expansão de portfólio ou entrada em novo segmento com testes A/B controlados.'}`}
        />
      </div>
    </div>
  )

  const complianceModule = (
    <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
      <div className="chrome-panel scan-surface panel-glow-top rounded-[1.7rem] p-5">
        <SectionHeader
          eyebrow="4º Sem • Empreendedorismo Social / Ética"
          title="ESG, compliance e índice de impacto"
          description="Risco legal, ético e ambiental traduzidos em calor e custo. Gerador de relatório ESG com índices de impacto social para atração de linhas de crédito e investidores."
          icon={ShieldCheck}
        />
        <BusinessChart option={complianceOption} className="h-[20rem] w-full" />
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <MetricCard
            label="Ethical score"
            value={`${ethicalScore.toFixed(0)}/100`}
            detail="Saúde ética consolidada com base em riscos, ESG e exposição sistêmica."
            tone={ethicalScore > 70 ? 'positive' : 'negative'}
          />
          <MetricCard
            label="Exposure"
            value={formatCurrency(totalRiskImpact)}
            detail="Impacto financeiro agregado se os riscos críticos não forem tratados."
            tone="negative"
          />
        </div>

        <div className="chrome-panel rounded-[1.5rem] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/34">Mapa de calor de risco</p>
            <button
              onClick={() => setIsAddingRisk((v) => !v)}
              className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/54 transition hover:text-white"
            >
              {isAddingRisk ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
              {isAddingRisk ? 'Cancelar' : 'Adicionar'}
            </button>
          </div>

          {isAddingRisk ? (
            <div className="mb-4 rounded-[1rem] border border-white/12 bg-black/18 p-4">
              <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-white/36">Novo risco</p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Área de risco (ex: Fiscal, LGPD...)"
                  value={newRiskDraft.area}
                  onChange={(e) => setNewRiskDraft((d) => ({ ...d, area: e.target.value }))}
                  className="w-full rounded-[0.8rem] bg-white/6 px-3 py-2 text-sm text-white/82 outline-none placeholder:text-white/24"
                />
                <div className="grid grid-cols-3 gap-3">
                  <label className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-white/28">Legal /100</p>
                    <input type="number" min={0} max={100} value={newRiskDraft.legalRisk}
                      onChange={(e) => setNewRiskDraft((d) => ({ ...d, legalRisk: Number(e.target.value) }))}
                      className="w-full rounded-[0.8rem] bg-white/6 px-3 py-2 text-sm text-white/82 outline-none" />
                  </label>
                  <label className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-white/28">Ethical /100</p>
                    <input type="number" min={0} max={100} value={newRiskDraft.ethicalRisk}
                      onChange={(e) => setNewRiskDraft((d) => ({ ...d, ethicalRisk: Number(e.target.value) }))}
                      className="w-full rounded-[0.8rem] bg-white/6 px-3 py-2 text-sm text-white/82 outline-none" />
                  </label>
                  <label className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-white/28">Impacto R$</p>
                    <input type="number" min={0} value={newRiskDraft.impact}
                      onChange={(e) => setNewRiskDraft((d) => ({ ...d, impact: Number(e.target.value) }))}
                      className="w-full rounded-[0.8rem] bg-white/6 px-3 py-2 text-sm text-white/82 outline-none" />
                  </label>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleAddRisk}
                    disabled={!newRiskDraft.area.trim()}
                    className="rounded-full border border-white/14 bg-white/82 px-4 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#050505] disabled:opacity-40"
                  >
                    Salvar risco
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="space-y-3">
            {risks.map((risk) => (
              <div key={risk.id} className="rounded-[1rem] border border-white/10 bg-black/14 p-4">
                {editingRiskId === risk.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={riskDraft.area ?? risk.area}
                      onChange={(e) => setRiskDraft((d) => ({ ...d, area: e.target.value }))}
                      className="w-full rounded-[0.8rem] bg-white/6 px-3 py-2 text-sm text-white/82 outline-none"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <label className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-white/28">Legal /100</p>
                        <input type="number" min={0} max={100} value={riskDraft.legalRisk ?? risk.legalRisk}
                          onChange={(e) => setRiskDraft((d) => ({ ...d, legalRisk: Number(e.target.value) }))}
                          className="w-full rounded-[0.8rem] bg-white/6 px-3 py-2 text-sm text-white/82 outline-none" />
                      </label>
                      <label className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-white/28">Ethical /100</p>
                        <input type="number" min={0} max={100} value={riskDraft.ethicalRisk ?? risk.ethicalRisk}
                          onChange={(e) => setRiskDraft((d) => ({ ...d, ethicalRisk: Number(e.target.value) }))}
                          className="w-full rounded-[0.8rem] bg-white/6 px-3 py-2 text-sm text-white/82 outline-none" />
                      </label>
                      <label className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-white/28">Impacto R$</p>
                        <input type="number" min={0} value={riskDraft.impact ?? risk.impact}
                          onChange={(e) => setRiskDraft((d) => ({ ...d, impact: Number(e.target.value) }))}
                          className="w-full rounded-[0.8rem] bg-white/6 px-3 py-2 text-sm text-white/82 outline-none" />
                      </label>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingRiskId(null)}
                        className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/52">
                        Cancelar
                      </button>
                      <button onClick={() => handleSaveRisk(risk.id)}
                        className="rounded-full border border-white/14 bg-white/82 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#050505]">
                        Salvar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-white/78">{risk.area}</p>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/54">
                          impacto {formatCompact(risk.impact)}
                        </span>
                        <button onClick={() => handleStartEditRisk(risk)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/8 text-white/36 transition hover:text-white/72">
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button onClick={() => deleteRisk(risk.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/8 text-white/28 transition hover:text-white/62">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Legal</p>
                        <p className="mt-1 text-white/72">{risk.legalRisk}/100</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Ethical</p>
                        <p className="mt-1 text-white/72">{risk.ethicalRisk}/100</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">Severity</p>
                        <p className="mt-1 text-white/72">{Math.round((risk.legalRisk + risk.ethicalRisk) / 2)}/100</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <ConductaBlock
          sem="4º Sem"
          discipline="Empreendedorismo Social / Ética nos Negócios"
          analysis={`Score ESG em ${ethicalScore.toFixed(0)}/100 com exposição financeira de ${formatCurrency(totalRiskImpact)} em riscos não mitigados. ${risks.filter(r => (r.legalRisk + r.ethicalRisk) / 2 > 60).length} risco(s) crítico(s) identificado(s).`}
          action={`${ethicalScore < 60 ? 'Score crítico: implemente plano de mitigação para os riscos de maior severidade. ESG abaixo de 60 bloqueia linhas de crédito de impacto e investidores ESG.' : ethicalScore < 80 ? 'Identifique os 2 riscos de maior impacto e trace plano de ação. Score acima de 80 destravam linhas preferenciais.' : 'Posição ESG sólida. Documente as práticas e utilize o score para captação de linhas de impacto social.'}`}
        />
      </div>
    </div>
  )

  const peopleModule = (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
      <div className="chrome-panel scan-surface panel-glow-top rounded-[1.7rem] p-5">
        <SectionHeader
          eyebrow="2º Sem • Liderança e Gestão de Equipes"
          title="People Analytics e clima organizacional"
          description="Mapeie produtividade, engajamento e clima. Arraste pessoas entre squads e veja como a estrutura de liderança impacta o desempenho e a saúde do time."
          icon={Users}
        />
        <BusinessChart option={peopleOption} className="h-[20rem] w-full" />
      </div>

      <div className="space-y-6">
        <motion.div
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {([
            { label: 'Produtividade média', value: `${avgProductivity.toFixed(0)}/100`, detail: 'Leitura do capital humano em relação à execução e entrega.', tone: 'neutral' as const },
            { label: 'Engajamento médio', value: `${avgEngagement.toFixed(0)}/100`, detail: 'Pulso emocional e aderência dos times ao ciclo de estratégia.', tone: 'neutral' as const },
            { label: 'Stress', value: `${avgStress.toFixed(0)}/100`, detail: 'Temperatura social média do ambiente operacional.', tone: (avgStress > 45 ? 'negative' : 'neutral') as 'negative' | 'neutral' },
          ]).map((card) => (
            <motion.div
              key={card.label}
              variants={{
                hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <MetricCard label={card.label} value={card.value} detail={card.detail} tone={card.tone} />
            </motion.div>
          ))}
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {(['growth', 'ops', 'finance'] as TeamMember['squad'][]).map((squad) => (
            <div
              key={squad}
              className="chrome-grid-surface rounded-[1.35rem] border border-white/10 bg-black/14 p-3"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleTeamDrop(event, squad)}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/34">{squadLabels[squad]}</p>
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/52">
                  {team.filter((member) => member.squad === squad).length}
                </span>
              </div>
              <div className="space-y-3">
                {team
                  .filter((member) => member.squad === squad)
                  .map((member) => (
                    <div
                      key={member.id}
                      draggable
                      onDragStart={(event) => event.dataTransfer.setData('business-team', member.id)}
                      className="cursor-grab rounded-[1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(10,10,12,0.82)_52%,rgba(5,5,6,0.96)_100%)] p-3 active:cursor-grabbing"
                    >
                      <p className="text-sm font-medium text-white/84">{member.name}</p>
                      <p className="mt-1 text-xs text-white/46">{member.role}</p>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.14em] text-white/28">Prod</p>
                          <p className="text-xs text-white/72">{member.productivity}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.14em] text-white/28">Mood</p>
                          <p className="text-xs text-white/72">{member.engagement}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.14em] text-white/28">Stress</p>
                          <p className="text-xs text-white/72">{member.stress}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="chrome-panel rounded-[1.5rem] p-5">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-3.5 w-3.5 text-white/42" />
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/34">Big Data · Benchmark People</p>
          </div>
          <div className="space-y-3">
            <BenchmarkBlock metric="Produtividade Média" yourValue={avgProductivity} sectorAvg={72} top10={91} unit="" />
            <BenchmarkBlock metric="Engajamento Médio" yourValue={avgEngagement} sectorAvg={68} top10={88} unit="" />
            <BenchmarkBlock metric="Stress (menor = melhor)" yourValue={avgStress} sectorAvg={42} top10={22} higherIsBetter={false} unit="" />
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-white/24">Benchmarks de clima organizacional em empresas de tecnologia e consultoria.</p>
        </div>

        <div className="chrome-panel rounded-[1.5rem] p-5">
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/34">Feedback simulator</p>
          <div className="mt-4 rounded-[1.1rem] border border-white/10 bg-black/14 p-4">
            <p className="text-sm leading-relaxed text-white/70">
              “João” apresenta stress elevado em `Ops`. Se for movido para `Growth`, a produtividade sobe 10%, mas o time de operações perde ritmo na entrega.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/56">
                roleplay IA
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/56">
                temperatura emocional
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/56">
                gamificação ética
              </span>
            </div>
          </div>
        </div>

        <ConductaBlock
          sem="2º Sem"
          discipline="Liderança e Gestão de Equipes"
          analysis={`Time com produtividade média de ${avgProductivity.toFixed(0)}/100 e engajamento de ${avgEngagement.toFixed(0)}/100. Stress médio em ${avgStress.toFixed(0)}/100.`}
          action={`${avgStress > 55 ? 'Stress elevado: revise carga e redistribua tarefas entre squads. Stress acima de 55 compromete desempenho e aumenta turnover.' : avgEngagement < 65 ? 'Engajamento abaixo de 65 — realize 1:1s e mapeie barreiras de motivação por squad antes do próximo ciclo de OKR.' : 'Time equilibrado. Identifique os membros de alta performance (Produtividade > 84) para mentoria e aceleração de carreira.'}`}
        />
      </div>
    </div>
  )

  const modelModule = (
    <div className="grid gap-6 xl:grid-cols-[1.18fr_0.92fr]">
      <div className="chrome-panel rounded-[1.7rem] p-5">
        <SectionHeader
          eyebrow="3º Sem • Empreendedorismo e Inovação"
          title="Lean Canvas, viabilidade e pitch para investidor"
          description="Monte o modelo de negócio pela metodologia Lean Startup. Conecte problema, solução, receita, ESG e go-to-market. O sistema gera a narrativa automática para investidor."
          icon={Lightbulb}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(Object.keys(canvasLaneLabels) as CanvasCard['lane'][]).map((lane) => (
            <div
              key={lane}
              className="chrome-grid-surface rounded-[1.25rem] border border-white/10 bg-black/14 p-3"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleCanvasDrop(event, lane)}
            >
              <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-white/34">{canvasLaneLabels[lane]}</p>
              <div className="space-y-3">
                {modelCanvas
                  .filter((card) => card.lane === lane)
                  .map((card) => (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={(event) => event.dataTransfer.setData('business-canvas', card.id)}
                      className="cursor-grab rounded-[1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(10,10,12,0.82)_52%,rgba(5,5,6,0.96)_100%)] p-3 active:cursor-grabbing"
                    >
                      <p className="text-sm font-medium text-white/84">{card.title}</p>
                      <p className="mt-2 text-xs leading-relaxed text-white/54">{card.body}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="chrome-panel rounded-[1.7rem] p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="chrome-subtle flex h-11 w-11 items-center justify-center rounded-[1rem]">
              <Calculator className="h-5 w-5 text-white/82" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-white/34">Model Viability</p>
              <h4 className="text-sm font-semibold text-white/88">SaaS, expansão e captação</h4>
            </div>
          </div>
          <motion.div
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            {([
              { label: 'Payback', value: `${paybackMonths.toFixed(1)} meses`, detail: 'Tempo estimado para o investimento voltar em caixa.', tone: 'neutral' as const },
              { label: 'ROI', value: formatPercent(snapshot.roiPct), detail: 'Retorno direto da expansão planejada sobre o capital aportado.', tone: (snapshot.roiPct > 0 ? 'positive' : 'negative') as 'positive' | 'negative' },
              { label: 'Roadmap 24m', value: '3 ondas', detail: 'Entrada consultiva, escala SaaS e verticalização por inteligência setorial.', tone: 'neutral' as const },
            ]).map((card) => (
              <motion.div
                key={card.label}
                variants={{
                  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
                }}
              >
                <MetricCard label={card.label} value={card.value} detail={card.detail} tone={card.tone} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── OKR Tracker — 3º Sem • Empreendedorismo e Inovação ── */}
        <div className="chrome-panel rounded-[1.5rem] p-5">
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/34">3º Sem • Empreendedorismo</p>
          <h4 className="mt-1 text-sm font-semibold text-white/82">OKR Tracker</h4>
          <div className="mt-4 space-y-3">
            {([
              {
                objective: 'Escalar receita recorrente',
                krs: [
                  { label: 'Receita mensal ≥ R$50k', progress: cockpitReady ? clamp((snapshot.revenue / 50000) * 100, 0, 100) : 0 },
                  { label: 'Margem ≥ 25%', progress: cockpitReady ? clamp((snapshot.marginPct / 25) * 100, 0, 100) : 0 },
                ],
              },
              {
                objective: 'Solidificar base de clientes',
                krs: [
                  { label: 'LTV/CAC ≥ 3x', progress: cockpitReady ? clamp((snapshot.ltvCac / 3) * 100, 0, 100) : 0 },
                  { label: 'Runway ≥ 12 meses', progress: cockpitReady ? clamp((snapshot.runwayMonths / 12) * 100, 0, 100) : 0 },
                ],
              },
              {
                objective: 'Fortalecer impacto ESG',
                krs: [
                  { label: 'Score ESG ≥ 80/100', progress: clamp((ethicalScore / 80) * 100, 0, 100) },
                  { label: 'Health Score ≥ 75', progress: cockpitReady ? clamp((snapshot.healthScore / 75) * 100, 0, 100) : 0 },
                ],
              },
            ] as const).map(({ objective, krs }) => (
              <div key={objective} className="rounded-[1rem] border border-white/10 bg-black/14 p-4">
                <p className="text-sm font-semibold text-white/78">{objective}</p>
                <div className="mt-3 space-y-2.5">
                  {krs.map(({ label, progress }) => (
                    <div key={label}>
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <p className="text-[10px] text-white/44">{label}</p>
                        <span className={`text-[10px] font-semibold tabular-nums ${progress >= 100 ? 'text-white/72' : 'text-white/38'}`}>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-white/36 transition-all duration-700"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3 Caminhos Estratégicos ── */}
        <div className="chrome-panel rounded-[1.5rem] p-5">
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/34">3º Sem • Empreendedorismo</p>
          <h4 className="mt-1 text-sm font-semibold text-white/82">3 Caminhos do IPB</h4>
          <div className="mt-4 space-y-3">
            {([
              {
                path: 'Consultoria',
                label: 'Agora · Ativo',
                desc: 'Você usa o IPB como cockpit dos seus clientes. Cada workspace é um cliente. Receita por projeto ou retainer mensal.',
                tags: ['workspace multi-cliente', 'relatório', 'diagnóstico'],
                active: true,
              },
              {
                path: 'Startup SaaS',
                label: '3º–4º Sem · Roadmap',
                desc: 'Outras empresas assinam o IPB. Modelo recorrente com tier free, growth e enterprise. Big Data coletivo gera benchmarks setoriais.',
                tags: ['assinatura mensal', 'freemium', 'benchmark'],
                active: false,
              },
              {
                path: 'BI Tool Vertical',
                label: 'Eletivas · Especialização',
                desc: 'Verticalizações por setor: agronegócio, saúde, varejo, logística. Cada vertical tem módulos específicos e dados setoriais próprios.',
                tags: ['agro', 'saúde', 'varejo', 'logística'],
                active: false,
              },
            ] as const).map(({ path, label, desc, tags, active }) => (
              <div key={path} className={`overflow-hidden rounded-[1.1rem] border p-4 transition-all ${active ? 'border-white/18 bg-white/[0.05]' : 'border-white/[0.07] bg-black/14'}`}>
                <div className="mb-2 flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${active ? 'text-white/88' : 'text-white/58'}`}>{path}</p>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] ${active ? 'border-white/18 text-white/62' : 'border-white/[0.06] text-white/28'}`}>{label}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-white/52">{desc}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tags.map(t => (
                    <span key={t} className="rounded-full border border-white/[0.07] px-2 py-0.5 text-[9px] text-white/32">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[1rem] border border-white/[0.07] bg-black/14 p-3">
            <p className="text-[10px] text-white/28">Narrativa para investidor</p>
            <p className="mt-1 text-[11px] leading-relaxed text-white/52">
              Health {snapshot.healthScore.toFixed(0)}, margem {snapshot.marginPct.toFixed(1)}%, runway {snapshot.runwayMonths.toFixed(1)}m e ROI {snapshot.roiPct.toFixed(1)}% sustentam a tese de crescimento nos 3 caminhos.
            </p>
          </div>
        </div>

        <ConductaBlock
          sem="3º Sem"
          discipline="Empreendedorismo e Inovação"
          analysis={`Modelo de negócio com ${Object.keys(canvasLaneLabels).length} dimensões no canvas. ROI do projeto em ${formatPercent(snapshot.roiPct)} com payback em ${paybackMonths.toFixed(1)} meses.`}
          action={`${snapshot.roiPct > 0 ? `ROI positivo — valide o canvas com 3 clientes reais antes de escalar. Defina KPIs por lane do canvas e revise mensalmente.` : 'ROI ainda negativo — revisite o modelo de receita e reduza custo de go-to-market antes de buscar captação.'}`}
        />
      </div>
    </div>
  )

  // ── Módulo Inovação & Tendências (1º Semestre — Gestão da Inovação, Pensamento Criativo, Sustentabilidade) ──
  const innovationModule = (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
      <div className="space-y-6">
        <div className="chrome-panel rounded-[1.7rem] p-5">
          <SectionHeader
            eyebrow="1º Semestre • Gestão da Inovação"
            title="Radar de Inovação e posição estratégica"
            description="Mapeie sua posição em 6 dimensões de inovação baseadas no currículo: crescimento, sustentabilidade, mercado, modelo de negócio, pessoas e saúde financeira."
            icon={Zap}
          />
          <BusinessChart option={innovationRadarOption} className="h-[20rem] w-full" />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: 'Inovação', value: innovationRadarValues[0].toFixed(0), ok: innovationRadarValues[0] > 60 },
              { label: 'Sustentab.', value: innovationRadarValues[1].toFixed(0), ok: innovationRadarValues[1] > 60 },
              { label: 'Mercado', value: innovationRadarValues[2].toFixed(0), ok: innovationRadarValues[2] > 60 },
              { label: 'Modelo', value: innovationRadarValues[3].toFixed(0), ok: innovationRadarValues[3] > 60 },
              { label: 'Pessoas', value: innovationRadarValues[4].toFixed(0), ok: innovationRadarValues[4] > 60 },
              { label: 'Finanças', value: innovationRadarValues[5].toFixed(0), ok: innovationRadarValues[5] > 60 },
            ].map(({ label, value, ok }) => (
              <div key={label} className="chrome-subtle rounded-[1.1rem] px-3 py-3 text-center">
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/22">{label}</p>
                <p className={`mt-1.5 text-[1.1rem] font-semibold leading-none tracking-[-0.01em] ${ok ? 'metal-text' : 'text-white/38'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="chrome-panel rounded-[1.7rem] p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="chrome-subtle flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.9rem]">
              <Calculator className="h-4 w-4 text-white/68" />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/26">1º Sem • Matemática Financeira</p>
              <h4 className="text-sm font-semibold text-white/88">Calculadora de Viabilidade</h4>
            </div>
          </div>
          <motion.div
            className="space-y-4"
            initial="hidden" animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.10 } } }}
          >
            {([
              {
                label: 'ROI do Projeto',
                value: cockpitReady ? formatPercent(snapshot.roiPct) : '--',
                detail: 'Retorno sobre o investimento planejado (Matemática Financeira).',
                tone: (cockpitReady && snapshot.roiPct > 0 ? 'positive' : 'neutral') as 'positive' | 'neutral',
              },
              {
                label: 'Payback',
                value: `${paybackMonths.toFixed(1)} meses`,
                detail: 'Tempo para recuperar o capital investido no projeto.',
                tone: 'neutral' as const,
              },
              {
                label: 'Health Score',
                value: cockpitReady ? `${snapshot.healthScore.toFixed(0)}/100` : '--',
                detail: 'Índice composto de saúde financeira do negócio.',
                tone: (cockpitReady && snapshot.healthScore > 60 ? 'positive' : 'negative') as 'positive' | 'negative',
              },
            ]).map((card) => (
              <motion.div
                key={card.label}
                variants={{ hidden: { opacity: 0, y: 16, filter: 'blur(6px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } }}
              >
                <MetricCard label={card.label} value={card.value} detail={card.detail} tone={card.tone} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="chrome-panel rounded-[1.5rem] p-5">
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/34">1º Sem • Pensamento Criativo</p>
          <h4 className="mt-1 text-sm font-semibold text-white/82">Oportunidade Detectada</h4>
          <div className="mt-4 space-y-3">
            {[
              { title: 'Digitalização', text: `Adoção de ferramentas digitais ainda baixa no setor. Oportunidade de diferenciação via automação e IA aplicada aos processos.` },
              { title: 'Sustentabilidade', text: `Score ESG em ${ethicalScore.toFixed(0)}/100. ${ethicalScore < 70 ? 'Investimento em práticas ESG pode destravar linhas de crédito diferenciadas.' : 'Posição competitiva sólida em critérios ESG para captação de impacto.'}` },
              { title: 'Modelo de Receita', text: cockpitReady ? `Margem de ${formatPercent(snapshot.marginPct)} com modelo atual. Avalie modelo SaaS ou recorrência para aumentar previsibilidade.` : 'Configure a base financeira para receber diagnóstico de modelo de receita.' },
            ].map(({ title, text }) => (
              <div key={title} className="rounded-[1rem] border border-white/10 bg-black/14 p-4">
                <p className="text-sm font-medium text-white/78">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/58">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <ConductaBlock
          sem="1º Sem"
          discipline="Gestão da Inovação e Ferramentas Digitais"
          analysis={`Radar de inovação em ${innovationRadarValues.reduce((a, b) => a + b, 0) / 6 > 60 ? 'posição forte' : 'desenvolvimento'}. Dimensão mais crítica: ${['Inovação','Sustentab.','Mercado','Modelo','Pessoas','Finanças'][innovationRadarValues.indexOf(Math.min(...innovationRadarValues))]} em ${Math.min(...innovationRadarValues).toFixed(0)}/100.`}
          action={`Priorize a dimensão com menor score para equilibrar o radar. ${innovationRadarValues[0] < 60 ? 'Aumente o ritmo de crescimento — explorar novos canais e produtos.' : innovationRadarValues[1] < 60 ? 'Fortaleça práticas ESG para melhorar o score de sustentabilidade.' : 'Radar equilibrado. Mantenha o monitoramento e teste diferenciação de modelo.'}`}
        />
      </div>
    </div>
  )

  // ── Módulo Smart Pricing (3º Semestre — Precificação, Análise Financeira) ──
  const pricingModule = (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
      <div className="chrome-panel rounded-[1.7rem] p-5">
        <SectionHeader
          eyebrow="3º Semestre • Precificação"
          title="Smart Pricing — custo, margem e posição"
          description="O algoritmo calcula o preço ideal baseado nos seus custos fixos, variáveis e margem-alvo. Baseado em Precificação e Análise Financeira."
          icon={Tag}
        />

        <div className="space-y-5">
          <RangeField
            label="Custo variável (%)"
            value={inputs.variableCostRate}
            min={0} max={80} step={1}
            display={`${inputs.variableCostRate.toFixed(0)}%`}
            onChange={(v) => updateInput('variableCostRate', v)}
          />
          <RangeField
            label="Margem-alvo (%)"
            value={targetMarginPct}
            min={5} max={70} step={1}
            display={`${targetMarginPct.toFixed(0)}%`}
            onChange={setTargetMarginPct}
          />
          <RangeField
            label="Preço atual por unidade"
            value={inputs.pricePerUnit}
            min={0} max={5000} step={10}
            display={formatCurrency(inputs.pricePerUnit)}
            onChange={(v) => updateInput('pricePerUnit', v)}
          />
          <RangeField
            label="Custo fixo mensal"
            value={inputs.fixedCosts}
            min={0} max={200000} step={1000}
            display={formatCurrency(inputs.fixedCosts)}
            onChange={(v) => updateInput('fixedCosts', v)}
          />
          <RangeField
            label="Unidades vendidas / mês"
            value={inputs.unitsSold}
            min={0} max={5000} step={10}
            display={inputs.unitsSold.toLocaleString('pt-BR')}
            onChange={(v) => updateInput('unitsSold', v)}
          />
        </div>
      </div>

      <div className="space-y-5">
        <motion.div
          className="grid gap-4 sm:grid-cols-2"
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {([
            { label: 'Preço Sugerido', value: formatCurrency(smartPrice), detail: 'Preço mínimo para atingir a margem-alvo com os custos atuais.', tone: 'positive' as const },
            { label: 'Margem Atual', value: formatPercent(currentPriceMarginPct), detail: 'Margem real com o preço atual vs custos declarados.', tone: (currentPriceMarginPct >= targetMarginPct ? 'positive' : 'negative') as 'positive' | 'negative' },
            { label: 'Break-even', value: `${breakEvenUnits.toLocaleString('pt-BR')} un.`, detail: 'Unidades mínimas para cobrir todos os custos fixos.', tone: 'neutral' as const },
            { label: 'Custo por Unidade', value: formatCurrency(costPerUnit), detail: 'Soma do rateio fixo + custo variável por unidade produzida.', tone: 'neutral' as const },
          ]).map((card) => (
            <motion.div
              key={card.label}
              variants={{ hidden: { opacity: 0, y: 20, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } } }}
            >
              <MetricCard label={card.label} value={card.value} detail={card.detail} tone={card.tone} />
            </motion.div>
          ))}
        </motion.div>

        <div className="chrome-panel rounded-[1.7rem] p-5">
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/34">3 tiers de preço</p>
          <div className="mt-4 space-y-3">
            {[
              {
                tier: 'Custo',
                label: 'Break-even',
                price: costPerUnit,
                margin: 0,
                desc: 'Cobre custos fixos e variáveis. Sem margem.',
              },
              {
                tier: 'Base',
                label: `Margem ${targetMarginPct}%`,
                price: smartPrice,
                margin: targetMarginPct,
                desc: 'Preço sugerido com a margem-alvo configurada.',
              },
              {
                tier: 'Premium',
                label: 'Posicionamento +20%',
                price: smartPrice * 1.2,
                margin: targetMarginPct + 20,
                desc: 'Posicionamento premium para diferenciação de marca.',
              },
            ].map(({ tier, label, price, margin, desc }) => (
              <div key={tier} className="flex items-center gap-4 rounded-[1.1rem] border border-white/10 bg-black/14 px-4 py-3">
                <div className="shrink-0">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-white/28">{tier}</p>
                  <p className="metal-text text-[1.1rem] font-semibold leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>{formatCurrency(price)}</p>
                </div>
                <div className="h-8 w-px bg-white/[0.06]" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold text-white/54">{label}</p>
                  <p className="mt-0.5 text-[10px] leading-relaxed text-white/36">{desc}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-semibold ${margin > 0 ? 'border-white/12 text-white/52' : 'border-white/06 text-white/26'}`}>
                  {margin.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="chrome-panel rounded-[1.5rem] p-5">
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/34">3º Sem • Análise Financeira</p>
          <p className="mt-2 text-sm leading-relaxed text-white/58">
            {currentPriceMarginPct >= targetMarginPct
              ? `Preço atual de ${formatCurrency(inputs.pricePerUnit)} já supera a margem-alvo de ${targetMarginPct}%. Posição sólida — considere reinvestimento ou expansão.`
              : inputs.pricePerUnit > 0
                ? `Para atingir ${targetMarginPct}% de margem, o preço precisa subir de ${formatCurrency(inputs.pricePerUnit)} para ${formatCurrency(smartPrice)} (+${formatPercent(Math.max(0, (smartPrice / inputs.pricePerUnit - 1) * 100))}).`
                : 'Configure o preço por unidade para receber a análise de precificação.'}
          </p>
        </div>

        <ConductaBlock
          sem="3º Sem"
          discipline="Precificação"
          analysis={
            inputs.pricePerUnit > 0
              ? `Custo por unidade de ${formatCurrency(costPerUnit)}. Margem atual de ${formatPercent(currentPriceMarginPct)} vs. margem-alvo de ${targetMarginPct}%. Break-even em ${breakEvenUnits.toLocaleString('pt-BR')} unidades.`
              : 'Configure o preço por unidade e os custos para receber a análise de precificação.'
          }
          action={
            inputs.pricePerUnit > 0 && currentPriceMarginPct < targetMarginPct
              ? `Reajuste o preço para ${formatCurrency(smartPrice)} (Tier Base) para atingir ${targetMarginPct}% de margem. Ou reduza custo variável abaixo de ${(inputs.variableCostRate * 0.85).toFixed(0)}%.`
              : inputs.pricePerUnit > 0
                ? `Margem-alvo atingida. Avalie Tier Premium (${formatCurrency(smartPrice * 1.2)}) para segmentos de maior disposição a pagar sem incremento de custo.`
                : 'Preencha preço por unidade, custos fixos e variáveis para ativar o Smart Pricing.'
          }
        />
      </div>
    </div>
  )

  const activeContentMap: Record<BusinessModuleKey, React.ReactNode> = {
    command: commandModule,
    scenarios: scenarioModule,
    twin: twinModule,
    market: marketModule,
    compliance: complianceModule,
    people: peopleModule,
    model: modelModule,
    innovation: innovationModule,
    pricing: pricingModule,
  }

  // ── Bloomberg Ticker — itens ao vivo derivados do snapshot ──────────────
  const tickerItems = [
    { label: 'RECEITA', value: cockpitReady ? formatCurrency(snapshot.revenue) : '--', delta: cockpitReady ? formatPercent(Math.abs(inputs.growthRate)) : undefined, up: cockpitReady ? (inputs.growthRate >= 0 ? true : false) : null },
    { label: 'MARGEM', value: cockpitReady ? formatPercent(snapshot.marginPct) : '--', up: cockpitReady ? snapshot.marginPct > 18 : null },
    { label: 'RUNWAY', value: cockpitReady ? `${snapshot.runwayMonths.toFixed(1)}m` : '--', up: cockpitReady ? snapshot.runwayMonths > 8 : null },
    { label: 'LTV/CAC', value: cockpitReady ? `${snapshot.ltvCac.toFixed(2)}x` : '--', up: cockpitReady ? snapshot.ltvCac >= 3 : null },
    { label: 'HEALTH', value: cockpitReady ? `${snapshot.healthScore.toFixed(0)}` : '--', up: cockpitReady ? snapshot.healthScore > 60 : null },
    { label: 'EBITDA', value: cockpitReady ? formatCompact(snapshot.ebitda) : '--', up: cockpitReady ? snapshot.ebitda > 0 : null },
    { label: 'ESG', value: `${ethicalScore.toFixed(0)}/100`, up: ethicalScore > 70 },
    { label: 'PEOPLE', value: `${avgProductivity.toFixed(0)}%`, up: avgProductivity > 70 },
    ...marketSignals.slice(0, 4).map((s) => ({ label: s.label.toUpperCase(), value: `${s.value}%`, up: s.value > 55 })),
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.45 }}
      className="space-y-5"
    >
      {/* ── HERO — Clock → Ticker → Cards → Radar ── */}
      <div className="relative overflow-hidden rounded-[2rem] px-5 py-6 md:px-7 md:py-7">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px silver-divider opacity-80" />
        <div className="pointer-events-none absolute left-0 top-[8%] h-[80%] w-px bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.08)_60%,transparent)]" />
        <div className="pointer-events-none absolute right-0 top-[8%] h-[80%] w-px bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.08)_60%,transparent)]" />

        {/* 1 — Relógio */}
        <div className="mb-4">
          <BusinessClock variant="hero" showGreeting />
        </div>

        {/* 2 — Ticker ao vivo */}
        <div className="mb-5">
          <BusinessTicker items={tickerItems} />
        </div>

        {/* 3 — Cards ao vivo */}
        <motion.div
          className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {[
            { label: 'Receita', value: cockpitReady ? formatCurrency(snapshot.revenue) : '--', detail: 'Receita mensal consolidada.', tone: (cockpitReady && snapshot.revenue > 0 ? 'positive' : 'neutral') as 'positive' | 'neutral' | 'negative' },
            { label: 'Margem', value: cockpitReady ? formatPercent(snapshot.marginPct) : '--', detail: 'Resultado líquido após custos.', tone: (cockpitReady && snapshot.marginPct > 18 ? 'positive' : 'negative') as 'positive' | 'neutral' | 'negative' },
            { label: 'LTV / CAC', value: cockpitReady ? snapshot.ltvCac.toFixed(2) : '--', detail: 'Eficiência de aquisição.', tone: (cockpitReady && snapshot.ltvCac >= 3 ? 'positive' : 'negative') as 'positive' | 'neutral' | 'negative' },
            { label: 'EBITDA', value: cockpitReady ? formatCurrency(snapshot.ebitda) : '--', detail: 'Lucro operacional puro.', tone: 'neutral' as const },
          ].map((card) => (
            <motion.div key={card.label} className="min-w-0" variants={{ hidden: { opacity: 0, y: 16, filter: 'blur(6px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } }}>
              <MetricCard label={card.label} value={card.value} detail={card.detail} tone={card.tone} />
            </motion.div>
          ))}
        </motion.div>

        {/* 4 — Radar 6D + Feed de Eventos */}
        <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr] xl:items-start">
          {/* workspace meta */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
              {[
                { label: 'Workspace', value: activeWorkspace.name },
                { label: 'Setor', value: activeWorkspace.sector },
                { label: 'Fonte', value: activeWorkspace.sourceLabel },
                { label: 'Sync', value: `${updatedAtLabel}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/22">{label}</span>
                  <span className="h-px w-3 bg-white/10" />
                  <span className="text-[11px] font-medium text-white/52">{value}</span>
                </div>
              ))}
            </div>

            {/* Feed de Eventos */}
            <div className="overflow-hidden rounded-[1.5rem] border border-white/[0.07]"
              style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(6,6,8,0.1)_100%)' }}>
              <div className="flex items-center gap-2 border-b border-white/[0.05] px-4 py-2.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/44" />
                <p className="text-[8px] font-semibold uppercase tracking-[0.32em] text-white/32">Feed de Eventos</p>
                <span className="ml-auto text-[8px] uppercase tracking-[0.18em] text-white/22">ao vivo</span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {eventFeed.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 px-4 py-2.5">
                    <span className="mt-0.5 shrink-0 rounded-full border border-white/[0.08] px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.14em] text-white/28">{event.sem}</span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/36">{event.tag}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-white/60">{event.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Radar 6D */}
          <div className="relative overflow-hidden rounded-[1.8rem] p-5">
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)]" />
            <div className="relative mb-3 flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.38em] text-white/22">Business Pulse</p>
                <p className="mt-0.5 text-[0.78rem] font-semibold text-white/72">6 Dimensões</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-white/[0.07] px-2.5 py-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/42" />
                <span className="text-[9px] uppercase tracking-[0.2em] text-white/28">live</span>
              </div>
            </div>
            <BusinessChart option={pulseRadarOption} className="h-[17rem] w-full" />
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { label: 'Health', value: cockpitReady ? `${snapshot.healthScore.toFixed(0)}` : '--', ok: cockpitReady && snapshot.healthScore > 60 },
                { label: 'People', value: `${avgProductivity.toFixed(0)}`, ok: avgProductivity > 70 },
                { label: 'ESG', value: `${ethicalScore.toFixed(0)}`, ok: ethicalScore > 70 },
              ].map(({ label, value, ok }) => (
                <div key={label} className="chrome-subtle rounded-[1.1rem] px-3 py-3 text-center">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-white/22">{label}</p>
                  <p className={`mt-1.5 text-[1.1rem] font-semibold leading-none tracking-[-0.01em] ${ok ? 'metal-text' : 'text-white/38'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Respostas Inteligentes — respostas situacionais baseadas nos dados */}
      <div className="relative overflow-hidden rounded-[1.8rem] border border-white/[0.06] px-5 py-4"
        style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(6,6,8,0.08)_100%)' }}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.10),transparent)]" />
        <div className="mb-3 flex items-center gap-2.5">
          <Brain className="h-3.5 w-3.5 text-white/42" />
          <p className="text-[9px] uppercase tracking-[0.34em] text-white/34">Respostas Inteligentes</p>
          <span className="ml-auto rounded-full border border-white/[0.07] px-2 py-0.5 text-[8px] uppercase tracking-[0.18em] text-white/28">
            {cockpitReady ? 'ao vivo' : 'aguardando base'}
          </span>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-0.5">
          {smartAnswers.map((answer, i) => (
            <div
              key={i}
              className="shrink-0 rounded-[1.2rem] border px-4 py-3"
              style={{
                minWidth: '13rem',
                maxWidth: '18rem',
                borderColor: answer.status === 'alert' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
                background: answer.status === 'alert'
                  ? 'rgba(255,255,255,0.04)'
                  : answer.status === 'ok'
                    ? 'rgba(255,255,255,0.02)'
                    : 'transparent',
              }}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full border border-white/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-white/38">
                  {answer.sem}
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/44">
                  {answer.tag}
                </span>
                {answer.status === 'alert' && <AlertTriangle className="ml-auto h-3 w-3 text-white/48" />}
                {answer.status === 'ok' && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/52" />}
              </div>
              <p className="text-[11px] leading-relaxed text-white/62">{answer.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Conexão Estudo ↔ Trabalhar ── */}
      {onSwitchToEstudo && (() => {
        const studySuggestions: Array<{ problem: string; module: string; sem: string }> = []
        if (cockpitReady) {
          if (snapshot.marginPct < 18) studySuggestions.push({ problem: `Margem em ${formatPercent(snapshot.marginPct)}`, module: 'Precificação e Análise Financeira', sem: '3º Sem' })
          if (snapshot.ltvCac < 3) studySuggestions.push({ problem: `LTV/CAC em ${snapshot.ltvCac.toFixed(2)}x`, module: 'Análise Mercadológica', sem: '2º Sem' })
          if (snapshot.runwayMonths < 8) studySuggestions.push({ problem: `Runway em ${snapshot.runwayMonths.toFixed(1)}m`, module: 'Matemática Financeira', sem: '1º Sem' })
          if (avgStress > 55) studySuggestions.push({ problem: `Stress do time em ${avgStress.toFixed(0)}/100`, module: 'Liderança e Gestão de Equipes', sem: '2º Sem' })
          if (ethicalScore < 65) studySuggestions.push({ problem: `ESG em ${ethicalScore.toFixed(0)}/100`, module: 'Empreendedorismo Social e Ética', sem: '4º Sem' })
        }
        if (studySuggestions.length === 0) return null
        return (
          <div className="overflow-hidden rounded-[1.6rem] border border-white/[0.07]"
            style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(6,6,8,0.08)_100%)' }}>
            <div className="flex items-center gap-2.5 border-b border-white/[0.05] px-4 py-3">
              <BookOpen className="h-3.5 w-3.5 text-white/38" />
              <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-white/34">Aba Estudo — Conteúdo Sugerido</p>
              <button
                onClick={onSwitchToEstudo}
                className="ml-auto rounded-full border border-white/10 px-3 py-1 text-[9px] uppercase tracking-[0.18em] text-white/48 transition hover:text-white/72"
              >
                Abrir Estudo →
              </button>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {studySuggestions.map((s) => (
                <div key={s.module} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-white/34">{s.problem} detectado</p>
                    <p className="text-[12px] font-semibold text-white/72">{s.module}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/[0.08] px-2 py-0.5 text-[8px] uppercase tracking-[0.14em] text-white/28">{s.sem}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })()}

      {/* ── Nav por Semestre ── */}
      <div className="overflow-hidden rounded-[1.8rem] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(6,6,8,0.1)_100%)] backdrop-blur-2xl">
        {([
          { sem: '1º Sem', label: '1º Semestre', modules: moduleMeta.filter(m => m.sem.startsWith('1º')) },
          { sem: '2º Sem', label: '2º Semestre', modules: moduleMeta.filter(m => m.sem.startsWith('2º')) },
          { sem: '3º Sem', label: '3º Semestre', modules: moduleMeta.filter(m => m.sem.startsWith('3º')) },
          { sem: '4º Sem', label: '4º Semestre', modules: moduleMeta.filter(m => m.sem.startsWith('4º')) },
        ] as const).map((group, gi) => (
          <div key={group.sem} className={gi > 0 ? 'border-t border-white/[0.05]' : ''}>
            <div className="px-4 pt-3 pb-1.5">
              <p className="text-[8px] font-semibold uppercase tracking-[0.38em] text-white/24">{group.label}</p>
            </div>
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-2 pb-2">
              {group.modules.map((module) => {
                const Icon = module.icon
                const isActive = activeModule === module.key
                return (
                  <button
                    key={module.key}
                    onClick={() => setActiveModule(module.key)}
                    className={`chrome-tab-button relative flex shrink-0 items-center gap-3 rounded-[1.3rem] px-4 py-3.5 text-left transition-all duration-300 ${isActive ? 'chrome-tab-button-active' : ''}`}
                    style={{ minWidth: '11rem' }}
                  >
                    <div className={`relative shrink-0 flex h-7 w-7 items-center justify-center rounded-[0.6rem] ${isActive ? 'bg-black/14' : 'bg-white/[0.06]'}`}>
                      <Icon className="h-3.5 w-3.5" />
                      {isActive && <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 animate-pulse rounded-full bg-black/36" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[0.82rem] font-semibold tracking-[-0.005em] leading-tight">{module.title}</p>
                      <p className={`mt-0.5 text-[9px] uppercase tracking-[0.16em] ${isActive ? 'text-[#111]/60' : 'text-white/28'}`}>{module.subtitle}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div>{activeContentMap[activeModule]}</div>
    </motion.div>
  )
}
