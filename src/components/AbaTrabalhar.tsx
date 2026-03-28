'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, LayoutDashboard, Activity, Tag, Zap,
  ShieldCheck, Globe, Users, Target, Lightbulb,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { useAccessibility, type AccessibilityMode } from '@/hooks/useAccessibility'

const IAAdvisor = dynamic(() => import('@/components/workspace/IAAdvisor'), { ssr: false })
const CockpitFinanceiro = dynamic(() => import('@/components/workspace/CockpitFinanceiro'), { ssr: false })
const CenariosForecast = dynamic(() => import('@/components/workspace/CenariosForecast'), { ssr: false })
const SmartPricing = dynamic(() => import('@/components/workspace/SmartPricing'), { ssr: false })
const ESGDiagnostico = dynamic(() => import('@/components/workspace/ESGDiagnostico'), { ssr: false })

interface ModuleMeta {
  id: number
  title: string
  short: string
  icon: React.ElementType
  color: string
  status: 'ready' | 'building'
}

const MODULES: ModuleMeta[] = [
  { id: 1, title: 'IA Advisor', short: 'IA', icon: Brain, color: '#5dade2', status: 'ready' },
  { id: 2, title: 'Cockpit Financeiro', short: 'Cockpit', icon: LayoutDashboard, color: '#1e8449', status: 'ready' },
  { id: 3, title: 'Cenários & Forecast', short: 'Cenários', icon: Activity, color: '#9a7d0a', status: 'ready' },
  { id: 4, title: 'Smart Pricing', short: 'Pricing', icon: Tag, color: '#c0392b', status: 'ready' },
  { id: 5, title: 'Inovação', short: 'Inovação', icon: Zap, color: '#7d3c98', status: 'building' },
  { id: 6, title: 'ESG', short: 'ESG', icon: ShieldCheck, color: '#1a5276', status: 'ready' },
  { id: 7, title: 'Mercado', short: 'Mercado', icon: Globe, color: '#b7950b', status: 'building' },
  { id: 8, title: 'Pessoas', short: 'Pessoas', icon: Users, color: '#a04000', status: 'building' },
  { id: 9, title: 'Processos', short: 'Processos', icon: Target, color: '#2471a3', status: 'building' },
  { id: 10, title: 'Canvas & Pitch', short: 'Canvas', icon: Lightbulb, color: '#27ae60', status: 'building' },
]

const ACCESSIBILITY_OPTIONS: { id: AccessibilityMode; label: string }[] = [
  { id: 'padrao', label: 'Padrão' },
  { id: 'foco', label: 'Foco' },
  { id: 'calmo', label: 'Calmo' },
  { id: 'contraste', label: 'Contraste' },
]

function Placeholder({ mod }: { mod: ModuleMeta }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <mod.icon size={32} style={{ color: mod.color, opacity: 0.3 }} />
      <p className="mt-4 text-[15px] font-semibold text-white/50">{mod.title}</p>
      <p className="mt-1 text-[12px] text-white/25">Em construção — será ativado com IA e dados reais</p>
    </div>
  )
}

export default function AbaTrabalhar() {
  const { mode, changeMode } = useAccessibility()
  const [activeId, setActiveId] = useState(1)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [marketData, setMarketData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/market').then(r => r.json()).then(setMarketData).catch(() => {})
  }, [])

  const active = MODULES.find(m => m.id === activeId) ?? MODULES[0]

  const renderModule = () => {
    switch (activeId) {
      case 1: return <IAAdvisor marketData={marketData} />
      case 2: return <CockpitFinanceiro marketData={marketData} />
      case 3: return <CenariosForecast marketData={marketData} />
      case 4: return <SmartPricing marketData={marketData} />
      case 6: return <ESGDiagnostico marketData={marketData} />
      default: return <Placeholder mod={active} />
    }
  }

  return (
    <div className="w-full">

      {/* ── Mobile: tabs horizontais no topo ── */}
      <div className="md:hidden overflow-x-auto scrollbar-hide border-b border-white/5">
        <div className="flex gap-0.5 px-2 py-2 min-w-max">
          {MODULES.map(mod => {
            const Icon = mod.icon
            const isActive = activeId === mod.id
            return (
              <button
                key={mod.id}
                onClick={() => setActiveId(mod.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-left transition-all shrink-0"
                style={{
                  background: isActive ? `${mod.color}18` : 'transparent',
                  borderLeft: isActive ? `2px solid ${mod.color}` : '2px solid transparent',
                }}
              >
                <Icon size={14} style={{ color: isActive ? mod.color : 'rgba(255,255,255,0.25)' }} />
                <span className={`text-[11px] font-medium ${isActive ? 'text-white/70' : 'text-white/25'}`}>
                  {mod.short}
                </span>
                {mod.status === 'building' && (
                  <span className="w-1 h-1 rounded-full bg-amber-500/50" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Desktop: sidebar + conteúdo ── */}
      <div className="flex min-h-[70vh]">

        {/* Sidebar — desktop only */}
        <div className="hidden md:flex flex-col w-[200px] shrink-0 border-r border-white/5 py-3">
          {/* Header */}
          <div className="px-3 mb-3">
            <p className="font-mono text-[9px] font-bold tracking-[0.2em] text-white/15 uppercase">Workspace</p>
          </div>

          {/* Module list */}
          <div className="flex flex-col gap-0.5 px-1.5 flex-1">
            {MODULES.map(mod => {
              const Icon = mod.icon
              const isActive = activeId === mod.id
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveId(mod.id)}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all"
                  style={{
                    background: isActive ? `${mod.color}15` : 'transparent',
                    borderLeft: isActive ? `3px solid ${mod.color}` : '3px solid transparent',
                  }}
                >
                  <Icon size={15} style={{ color: isActive ? mod.color : 'rgba(255,255,255,0.25)' }} />
                  <div className="flex-1 min-w-0">
                    <span className={`text-[12px] font-medium block truncate ${isActive ? 'text-white/80' : 'text-white/30'}`}>
                      {mod.title}
                    </span>
                  </div>
                  {mod.status === 'building' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Accessibility + config */}
          <div className="px-3 pt-3 border-t border-white/5 space-y-2">
            <div className="flex flex-wrap gap-1">
              {ACCESSIBILITY_OPTIONS.map(a => (
                <button
                  key={a.id}
                  onClick={() => changeMode(a.id)}
                  className="font-mono text-[8px] px-2 py-0.5 rounded-full transition-all"
                  style={{
                    background: mode === a.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: mode === a.id ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.05)',
                    color: mode === a.id ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)',
                  }}
                >
                  {a.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => { localStorage.removeItem('ipb-workspace-ready'); window.location.reload() }}
              className="font-mono text-[9px] text-white/15 hover:text-white/30 transition-colors"
            >
              Refazer configuração
            </button>
          </div>
        </div>

        {/* Conteúdo — área principal, largura total */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          {/* Module header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
            <active.icon size={18} style={{ color: active.color }} />
            <div>
              <p className="text-[14px] font-bold text-white/80">{active.title}</p>
            </div>
            {active.status === 'ready' && (
              <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(39,174,96,0.15)', color: '#27ae60' }}>
                Conectado
              </span>
            )}
          </div>

          {/* Module content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="p-4"
            >
              {renderModule()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile: accessibility + config */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-t border-white/5">
        <div className="flex gap-1">
          {ACCESSIBILITY_OPTIONS.map(a => (
            <button
              key={a.id}
              onClick={() => changeMode(a.id)}
              className="font-mono text-[8px] px-2 py-0.5 rounded-full"
              style={{
                background: mode === a.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: mode === a.id ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.05)',
                color: mode === a.id ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)',
              }}
            >
              {a.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => { localStorage.removeItem('ipb-workspace-ready'); window.location.reload() }}
          className="font-mono text-[9px] text-white/15"
        >
          Refazer
        </button>
      </div>
    </div>
  )
}
