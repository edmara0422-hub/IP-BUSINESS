'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import BusinessSectionNav from '@/components/business/BusinessSectionNav'
import PanoramaSection from '@/components/business/PanoramaSection'
import RiscosSection from '@/components/business/RiscosSection'
import MacroSection from '@/components/business/MacroSection'
import MarketingSection from '@/components/business/MarketingSection'
import { useBusinessStore } from '@/store/business-store'
import { useIntelligence } from '@/hooks/useIntelligence'
import { useMarketData } from '@/hooks/useMarketData'


// ── Types ──────────────────────────────────────────────────────────────────

interface MacroPoint { value: number; delta: number; sentiment: string }
interface Commodity  { value: number; delta: number; unit: string; label: string }
interface Sector     { id: string; label: string; change: number; trend: string; heat: number }
interface GlobalAgent { id: string; label: string; delta: number; impact: string }
interface CentralProblem { id: string; label: string; affected: number; module: string; sem: string }
interface Platform { id: string; label: string; cpm: number; cpmDelta: number; reach: string; trend: string; note: string; cpc?: number; cpcDelta?: number }
interface MktMetric { value: number; delta: number; label: string }
interface Opportunity { id: string; label: string; urgency: number; type: string }
interface MarketData {
  macro: { usdBrl: MacroPoint; ipca: MacroPoint; selic: MacroPoint; pib: MacroPoint }
  commodities: Record<string, Commodity>
  sectors: Sector[]
  globalAgents: GlobalAgent[]
  centralProblems: CentralProblem[]
  platforms: Platform[]
  marketing: Record<string, MktMetric>
  opportunities: Opportunity[]
  updatedAt: string
}
interface SimOffsets { selic: number; cambio: number; ipca: number; pib: number }

// ── Helpers ────────────────────────────────────────────────────────────────

function v(n: number | undefined, fb: number) { return (n != null && Number.isFinite(n)) ? n : fb }
function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)) }

function applySimulation(data: MarketData, sim: SimOffsets): MarketData {
  const si = sim.selic, pi = sim.pib, ci = sim.cambio, ii = sim.ipca
  const selicNew = clamp(v(data.macro.selic?.value, 14.75) + si, 2, 20)
  const cambioNew = clamp(v(data.macro.usdBrl?.value, 4.98) + ci, 3, 8)
  const ipcaNew = clamp(v(data.macro.ipca?.value, 4.14) + ii, 0.5, 15)
  const pibNew = clamp(v(data.macro.pib?.value, 1.86) + pi, -3, 8)

  const sectors = data.sectors.map(s => {
    let a = 0
    if (s.id === 'retail') a = -si * 3 + pi * 2
    else if (s.id === 'fintech') a = si * 1.5 + pi
    else if (s.id === 'tech') a = pi * 2.5 - si * 0.5
    else if (s.id === 'agro') a = pi * 1.5 - ci * 2
    else if (s.id === 'energy') a = ci * 2 + pi
    else if (s.id === 'health') a = pi * 1.2
    else if (s.id === 'logistics') a = -ci * 1.5 + pi
    else if (s.id === 'services') a = pi * 1.8 - si * 0.8
    else if (s.id === 'media') a = pi * 0.5 - si
    const ch = parseFloat((s.change + a).toFixed(1))
    return { ...s, change: ch, heat: clamp(Math.round(s.heat + a * 1.2), 0, 100), trend: ch > 3 ? 'up' : ch < -3 ? 'down' : 'neutral' }
  })
  const globalAgents = data.globalAgents.map(ag => {
    let a = 0
    if (['aapl','googl','meta'].includes(ag.id)) a = pi * 0.5 - si * 0.3
    if (ag.id === 'amzn') a = -si * 0.4 + pi * 0.6
    if (ag.id === 'vale') a = ci * 0.8
    if (ag.id === 'petr') a = ci * 1.2
    return { ...ag, delta: parseFloat((ag.delta + a).toFixed(1)) }
  })
  const centralProblems = data.centralProblems.map(p => {
    let a = 0
    if (p.id === 'margin') a = si * 3 + ci * 2
    if (p.id === 'cac') a = si
    if (p.id === 'credit') a = si * 5
    if (p.id === 'talent') a = pi * 2
    if (p.id === 'ai') a = pi * 1.5
    return { ...p, affected: clamp(Math.round(p.affected + a), 5, 95) }
  })
  const opportunities = data.opportunities.map(o => {
    let a = 0
    if (o.id === 'tiktok_cpm') a = -si * 2
    if (o.id === 'ai_content') a = pi * 2
    if (o.id === 'pib_grow') a = pi * 5
    if (o.id === 'organic') a = si * 2
    if (o.id === 'agro_boom') a = pi * 3 - ci * 2
    return { ...o, urgency: clamp(Math.round(o.urgency + a), 10, 99) }
  })

  return {
    ...data,
    macro: {
      usdBrl: { ...data.macro.usdBrl, value: parseFloat(cambioNew.toFixed(2)) },
      selic: { ...data.macro.selic, value: parseFloat(selicNew.toFixed(2)) },
      ipca: { ...data.macro.ipca, value: parseFloat(ipcaNew.toFixed(2)) },
      pib: { ...data.macro.pib, value: parseFloat(pibNew.toFixed(1)) },
    },
    sectors, globalAgents, centralProblems, opportunities,
  }
}

// ════════════════════════════════════════════════════════════════════════════
// ██  MAIN
// ════════════════════════════════════════════════════════════════════════════

export default function AbaBusiness() {
  const { marketData: rawData } = useMarketData()
  const [sim, setSim] = useState<SimOffsets>({ selic: 0, cambio: 0, ipca: 0, pib: 0 })
  const activeSection = useBusinessStore((s) => s.businessActiveSection)

  const hasSim = sim.selic !== 0 || sim.cambio !== 0 || sim.ipca !== 0 || sim.pib !== 0
  const data = useMemo(() => rawData ? (hasSim ? applySimulation(rawData as MarketData, sim) : rawData as MarketData) : null, [rawData, sim, hasSim])
  const { intelligence } = useIntelligence(rawData)

  if (!data) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="h-8 w-8 rounded-full border-2 border-white/10 border-t-white/40" />
    </div>
  )

  return (
    <motion.div className="flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* ── Navegação por seções ── */}
      <div className="shrink-0 mb-2 mt-2">
        <BusinessSectionNav />
      </div>

      {/* ── Conteúdo da seção ativa ── */}
      <div className="flex-1 overflow-y-auto pt-1">
        {activeSection === 'panorama' && <PanoramaSection data={data} ai={intelligence} />}
        {activeSection === 'macro' && <MacroSection data={data} ai={intelligence} />}
        {activeSection === 'plataformas' && <MarketingSection data={data} ai={intelligence} />}
        {activeSection === 'problemas' && <RiscosSection data={data} ai={intelligence} />}
      </div>
    </motion.div>
  )
}
