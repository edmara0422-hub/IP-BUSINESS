'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, LayoutDashboard, Activity, Tag, Zap,
  ShieldCheck, Globe, Users, Target, Lightbulb,
  MessageSquare, AlertTriangle,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { useAccessibility, type AccessibilityMode } from '@/hooks/useAccessibility'
import { useAuth } from '@/hooks/useAuth'

const IAAdvisor = dynamic(() => import('@/components/workspace/IAAdvisor'), { ssr: false })
const CockpitFinanceiro = dynamic(() => import('@/components/workspace/CockpitFinanceiro'), { ssr: false })
const CenariosForecast = dynamic(() => import('@/components/workspace/CenariosForecast'), { ssr: false })
const SmartPricing = dynamic(() => import('@/components/workspace/SmartPricing'), { ssr: false })
const ESGDiagnostico = dynamic(() => import('@/components/workspace/ESGDiagnostico'), { ssr: false })
const FeedbackNPS = dynamic(() => import('@/components/workspace/FeedbackNPS'), { ssr: false })
const CanalDenuncias = dynamic(() => import('@/components/workspace/CanalDenuncias'), { ssr: false })
const AdminPanel = dynamic(() => import('@/components/workspace/AdminPanel'), { ssr: false })
const Governanca = dynamic(() => import('@/components/workspace/Governanca'), { ssr: false })
const InovacaoCockpit = dynamic(() => import('@/components/workspace/InovacaoCockpit'), { ssr: false })

interface ModuleMeta {
  id: string
  title: string
  short: string
  icon: React.ElementType
  color: string
  group: 'trabalho' | 'compliance'
}

const MODULES: ModuleMeta[] = [
  // Trabalho
  { id: 'ia', title: 'IA Advisor', short: 'IA', icon: Brain, color: '#5dade2', group: 'trabalho' },
  { id: 'cockpit', title: 'Cockpit Financeiro', short: 'Cockpit', icon: LayoutDashboard, color: '#1e8449', group: 'trabalho' },
  { id: 'cenarios', title: 'Cenários & Forecast', short: 'Cenários', icon: Activity, color: '#9a7d0a', group: 'trabalho' },
  { id: 'pricing', title: 'Smart Pricing', short: 'Pricing', icon: Tag, color: '#c0392b', group: 'trabalho' },
  { id: 'inovacao', title: 'Inovação', short: 'Inovação', icon: Zap, color: '#7d3c98', group: 'trabalho' },
  { id: 'esg', title: 'ESG', short: 'ESG', icon: ShieldCheck, color: '#1a5276', group: 'trabalho' },
  { id: 'mercado', title: 'Mercado', short: 'Mercado', icon: Globe, color: '#b7950b', group: 'trabalho' },
  { id: 'pessoas', title: 'Pessoas', short: 'Pessoas', icon: Users, color: '#a04000', group: 'trabalho' },
  { id: 'processos', title: 'Processos', short: 'Processos', icon: Target, color: '#2471a3', group: 'trabalho' },
  { id: 'canvas', title: 'Canvas & Pitch', short: 'Canvas', icon: Lightbulb, color: '#27ae60', group: 'trabalho' },
  // Compliance
  { id: 'feedback', title: 'Feedback & NPS', short: 'Feedback', icon: MessageSquare, color: '#5dade2', group: 'compliance' },
  { id: 'denuncia', title: 'Canal de Denúncias', short: 'Denúncias', icon: AlertTriangle, color: '#c0392b', group: 'compliance' },
  { id: 'governanca', title: 'Governança', short: 'Governança', icon: ShieldCheck, color: '#1a5276', group: 'compliance' },
  { id: 'admin', title: 'Painel Admin', short: 'Admin', icon: ShieldCheck, color: '#5dade2', group: 'compliance' },
]

const ACC_OPTIONS: { id: AccessibilityMode; label: string; desc: string }[] = [
  { id: 'padrao', label: 'Padrão', desc: 'Experiência completa' },
  { id: 'foco', label: 'Foco', desc: 'Menos estímulos visuais' },
  { id: 'calmo', label: 'Calmo', desc: 'Sem animações' },
  { id: 'contraste', label: 'Contraste', desc: 'Fontes maiores' },
]

function Placeholder({ mod }: { mod: ModuleMeta }) {
  const Icon = mod.icon
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Icon size={32} style={{ color: mod.color, opacity: 0.3 }} />
      <p className="mt-4 text-[15px] font-semibold text-white/50">{mod.title}</p>
      <p className="mt-1 text-[12px] text-white/25">Em construção — será ativado com IA e dados reais</p>
    </div>
  )
}

export default function AbaTrabalhar() {
  const { mode, changeMode } = useAccessibility()
  const { profile } = useAuth()
  const isAdmin = profile?.role === 'admin'
  const [activeId, setActiveId] = useState('ia')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [marketData, setMarketData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/market').then(r => r.json()).then(setMarketData).catch(() => {})
  }, [])

  const active = MODULES.find(m => m.id === activeId) ?? MODULES[0]

  const renderModule = () => {
    switch (activeId) {
      case 'ia': return <IAAdvisor marketData={marketData} />
      case 'cockpit': return <CockpitFinanceiro marketData={marketData} />
      case 'cenarios': return <CenariosForecast marketData={marketData} />
      case 'pricing': return <SmartPricing marketData={marketData} />
      case 'esg': return <ESGDiagnostico marketData={marketData} />
      case 'inovacao': return <InovacaoCockpit />
      case 'feedback': return <FeedbackNPS />
      case 'denuncia': return <CanalDenuncias />
      case 'governanca': return <Governanca />
      case 'admin': return <AdminPanel />
      default: return <Placeholder mod={active} />
    }
  }

  const trabalho = MODULES.filter(m => m.group === 'trabalho')
  const compliance = MODULES.filter(m => m.group === 'compliance' && (m.id !== 'admin' || isAdmin))

  return (
    <div className="w-full">

      {/* ── Mobile: tabs horizontais ── */}
      <div className="md:hidden overflow-x-auto scrollbar-hide border-b border-white/5">
        <div className="flex gap-0.5 px-2 py-2 min-w-max">
          {MODULES.filter(m => m.id !== 'admin' || isAdmin).map(mod => {
            const Icon = mod.icon
            const isActive = activeId === mod.id
            return (
              <button
                key={mod.id}
                onClick={() => setActiveId(mod.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg shrink-0 transition-all"
                style={{
                  background: isActive ? `${mod.color}18` : 'transparent',
                  borderLeft: isActive ? `2px solid ${mod.color}` : '2px solid transparent',
                }}
              >
                <Icon size={14} style={{ color: isActive ? mod.color : 'rgba(255,255,255,0.25)' }} />
                <span className={`text-[11px] font-medium ${isActive ? 'text-white/70' : 'text-white/25'}`}>
                  {mod.short}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Desktop: sidebar + conteúdo ── */}
      <div className="flex min-h-[70vh]">

        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-[200px] shrink-0 border-r border-white/5 py-3">
          <div className="px-3 mb-2">
            <p className="font-mono text-[9px] font-bold tracking-[0.2em] text-white/15 uppercase">Workspace</p>
          </div>

          {/* Módulos de trabalho */}
          <div className="flex flex-col gap-0.5 px-1.5">
            {trabalho.map(mod => {
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
                  <span className={`text-[12px] font-medium truncate ${isActive ? 'text-white/80' : 'text-white/30'}`}>
                    {mod.title}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Divider */}
          <div className="mx-3 my-3 h-px bg-white/5" />
          <div className="px-3 mb-2">
            <p className="font-mono text-[8px] font-bold tracking-[0.2em] text-white/12 uppercase">Compliance</p>
          </div>

          {/* Módulos de compliance */}
          <div className="flex flex-col gap-0.5 px-1.5">
            {compliance.map(mod => {
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
                  <span className={`text-[12px] font-medium truncate ${isActive ? 'text-white/80' : 'text-white/30'}`}>
                    {mod.title}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Acessibilidade + Config */}
          <div className="mt-auto px-3 pt-3 border-t border-white/5 space-y-3">
            <div>
              <p className="font-mono text-[8px] font-bold tracking-[0.15em] text-white/15 uppercase mb-2">Acessibilidade</p>
              <div className="flex flex-col gap-1">
                {ACC_OPTIONS.map(a => (
                  <button
                    key={a.id}
                    onClick={() => changeMode(a.id)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all"
                    style={{
                      background: mode === a.id ? 'rgba(93,173,226,0.12)' : 'transparent',
                      border: mode === a.id ? '1px solid rgba(93,173,226,0.25)' : '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <span className={`text-[11px] font-medium ${mode === a.id ? 'text-white/70' : 'text-white/25'}`}>
                      {a.label}
                    </span>
                    <span className={`text-[9px] ${mode === a.id ? 'text-white/40' : 'text-white/12'}`}>
                      {a.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { localStorage.removeItem('ipb-workspace-ready'); window.location.reload() }}
              className="w-full text-center font-mono text-[10px] text-white/15 hover:text-white/35 transition-colors py-1"
            >
              Refazer configuração
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          {(() => { const Icon = active.icon; return (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
            <Icon size={18} style={{ color: active.color }} />
            <p className="text-[14px] font-bold text-white/80">{active.title}</p>
          </div>
          ) })()}

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

      {/* Mobile: acessibilidade */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-t border-white/5">
        <div className="flex gap-1">
          {ACC_OPTIONS.map(a => (
            <button
              key={a.id}
              onClick={() => changeMode(a.id)}
              className="text-[9px] px-2.5 py-1 rounded-full transition-all"
              style={{
                background: mode === a.id ? 'rgba(93,173,226,0.12)' : 'transparent',
                border: mode === a.id ? '1px solid rgba(93,173,226,0.25)' : '1px solid rgba(255,255,255,0.05)',
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
