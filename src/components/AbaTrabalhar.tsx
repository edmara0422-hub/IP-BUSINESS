'use client'

import { useEffect, useState } from 'react'
import { useMarketData } from '@/hooks/useMarketData'
import { useIntelligence } from '@/hooks/useIntelligence'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, LayoutDashboard, Activity, Tag, Zap,
  ShieldCheck, Globe, Users, Target, Lightbulb,
  MessageSquare, AlertTriangle, BookOpen,
  TrendingUp, UserCheck, FolderOpen,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { useAccessibility, type AccessibilityMode } from '@/hooks/useAccessibility'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import type { WorkspaceProfile } from '@/components/WorkspaceOnboarding'

const IAAdvisor = dynamic(() => import('@/components/workspace/IAAdvisor'), { ssr: false })
const AbaArquivos = dynamic(() => import('@/components/AbaArquivos'), { ssr: false })
const CockpitFinanceiro = dynamic(() => import('@/components/workspace/CockpitFinanceiro'), { ssr: false })
const CenariosForecast = dynamic(() => import('@/components/workspace/CenariosForecast'), { ssr: false })
const SmartPricing = dynamic(() => import('@/components/workspace/SmartPricing'), { ssr: false })
const ESGDiagnostico = dynamic(() => import('@/components/workspace/ESGDiagnostico'), { ssr: false })
const FeedbackNPS = dynamic(() => import('@/components/workspace/FeedbackNPS'), { ssr: false })
const CanalDenuncias = dynamic(() => import('@/components/workspace/CanalDenuncias'), { ssr: false })
const AdminPanel = dynamic(() => import('@/components/workspace/AdminPanel'), { ssr: false })
const Governanca = dynamic(() => import('@/components/workspace/Governanca'), { ssr: false })
const InovacaoCockpit = dynamic(() => import('@/components/workspace/InovacaoCockpit'), { ssr: false })
const ModoConsultoria = dynamic(() => import('@/components/workspace/ModoConsultoria'), { ssr: false })

// ─────────────────────────────────────────────
// Tipos e constantes
// ─────────────────────────────────────────────

type ContextMode = 'gestao' | 'consultoria' | 'estudo' | 'arquivos'
type LayerType = 'sio' | 'sig' | 'sie' | 'compliance'

interface ModuleMeta {
  id: string
  title: string
  short: string
  icon: React.ElementType
  color: string
  layer: LayerType
}

// SIO = Operacional (dado vira informação)
// SIG = Gerencial (informação vira grupos para gestão)
// SIE = Estratégico (inteligência organizacional)
const MODULES: ModuleMeta[] = [
  // SIO — Camada Operacional
  { id: 'ia',       title: 'IA Advisor',          short: 'IA',       icon: Brain,          color: '#5dade2', layer: 'sio' },
  { id: 'cockpit',  title: 'Cockpit Financeiro',   short: 'Cockpit',  icon: LayoutDashboard, color: '#1e8449', layer: 'sio' },
  { id: 'pricing',  title: 'Smart Pricing',        short: 'Pricing',  icon: Tag,            color: '#c0392b', layer: 'sio' },
  { id: 'processos',title: 'Processos',            short: 'SOPs',     icon: Target,         color: '#2471a3', layer: 'sio' },
  // SIG — Camada Gerencial
  { id: 'pessoas',  title: 'Pessoas',              short: 'Pessoas',  icon: Users,          color: '#a04000', layer: 'sig' },
  { id: 'mercado',  title: 'Mercado',              short: 'Mercado',  icon: Globe,          color: '#b7950b', layer: 'sig' },
  { id: 'esg',      title: 'ESG',                  short: 'ESG',      icon: ShieldCheck,    color: '#1a5276', layer: 'sig' },
  { id: 'feedback', title: 'Feedback & NPS',       short: 'Feedback', icon: MessageSquare,  color: '#5dade2', layer: 'sig' },
  // SIE — Camada Estratégica
  { id: 'cenarios', title: 'Cenários & Forecast',  short: 'Cenários', icon: Activity,       color: '#9a7d0a', layer: 'sie' },
  { id: 'inovacao', title: 'Inovação',             short: 'Inovação', icon: Zap,            color: '#7d3c98', layer: 'sie' },
  { id: 'canvas',   title: 'Canvas & Pitch',       short: 'Canvas',   icon: Lightbulb,      color: '#27ae60', layer: 'sie' },
  // Compliance
  { id: 'denuncia', title: 'Canal de Denúncias',   short: 'Denúncias',icon: AlertTriangle,  color: '#c0392b', layer: 'compliance' },
  { id: 'governanca',title: 'Governança',          short: 'Gov.',     icon: ShieldCheck,    color: '#1a5276', layer: 'compliance' },
  { id: 'admin',    title: 'Painel Admin',         short: 'Admin',    icon: ShieldCheck,    color: '#5dade2', layer: 'compliance' },
]

const LAYER_META: Record<LayerType, { label: string; desc: string; color: string }> = {
  sio:        { label: 'SIO',        desc: 'Operacional',  color: '#1e8449' },
  sig:        { label: 'SIG',        desc: 'Gerencial',    color: '#9a7d0a' },
  sie:        { label: 'SIE',        desc: 'Estratégico',  color: '#5dade2' },
  compliance: { label: 'Compliance', desc: 'Governança',   color: '#1a5276' },
}

const CONTEXT_SWITCHES: { id: ContextMode; label: string; short: string; icon: React.ElementType; color: string; desc: string; mood: string }[] = [
  { id: 'gestao',      label: 'Meu Negócio',     short: 'Gestão',     icon: TrendingUp,  color: '#10b981', desc: 'Runway · OKRs · TRL',    mood: 'Pragmática — foco em sobrevivência e crescimento' },
  { id: 'consultoria', label: 'Modo Ghost',       short: 'Ghost',      icon: UserCheck,   color: '#f59e0b', desc: 'OBI · Diagnóstico',       mood: 'Analítica — diagnóstico e valor para o cliente' },
  { id: 'estudo',      label: 'Estudo & Teoria',  short: 'Estudo',     icon: BookOpen,    color: '#6366f1', desc: 'Rezende · Peter · OBI',   mood: 'Inspiradora — teoria, conceitos e curadoria' },
  { id: 'arquivos',    label: 'Arquivos',         short: 'Arquivos',   icon: FolderOpen,  color: '#1a5276', desc: 'Relatórios do Cockpit',    mood: 'Histórico de análises' },
]

// Setores/produtos que habilitam cada switch extra
const CONSULTORIA_TRIGGERS = ['Consultoria', 'Agência', 'Consultoria Empresarial']
const ESTUDO_TRIGGERS = ['Educação', 'Conteúdo', 'Infoproduto', 'Educação Corporativa']

const ACC_OPTIONS: { id: AccessibilityMode; label: string; desc: string }[] = [
  { id: 'padrao',    label: 'Padrão',    desc: 'Experiência completa' },
  { id: 'foco',      label: 'Foco',      desc: 'Menos estímulos visuais' },
  { id: 'calmo',     label: 'Calmo',     desc: 'Sem animações' },
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

const PHASE_LABELS: Record<string, { label: string; color: string }> = {
  validacao: { label: 'Validação', color: '#9a7d0a' },
  mei:       { label: 'MEI',       color: '#1e8449' },
  slu:       { label: 'SLU',       color: '#1e8449' },
  ltda:      { label: 'LTDA',      color: '#2471a3' },
  startup:   { label: 'Startup',   color: '#7d3c98' },
}

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────

export default function AbaTrabalhar() {
  const { mode, changeMode } = useAccessibility()
  const { profile, user } = useAuth()
  const isAdmin = profile?.role === 'admin'
  const [activeId, setActiveId] = useState('ia')
  const [contextMode, setContextMode] = useState<ContextMode>('gestao')
  const [userProfile, setUserProfile] = useState<WorkspaceProfile | null>(null)

  // Visibilidade dos switches baseada no onboarding
  const allSectors = userProfile?.sectors ?? []
  const allProducts = userProfile?.product ?? []
  const showConsultoria = isAdmin || allSectors.some(s => CONSULTORIA_TRIGGERS.includes(s)) || allProducts.some(p => CONSULTORIA_TRIGGERS.includes(p))
  const showEstudo     = isAdmin || allSectors.some(s => ESTUDO_TRIGGERS.includes(s))     || allProducts.some(p => ESTUDO_TRIGGERS.includes(p))

  const visibleSwitches = CONTEXT_SWITCHES.filter(sw =>
    sw.id === 'gestao' || sw.id === 'arquivos' ||
    (sw.id === 'consultoria' && showConsultoria) || (sw.id === 'estudo' && showEstudo)
  )
  const supabase = createClient()

  useEffect(() => {
    if (!user) return
    supabase
      .from('workspace_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data }: { data: any }) => { if (data) setUserProfile({ ...data, nomeNegocio: data.nome_negocio ?? '' } as WorkspaceProfile) })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])


  const { marketData } = useMarketData()
  const { intelligence } = useIntelligence(marketData)

  // Quando muda para consultoria/arquivos, vai pro módulo correspondente
  const effectiveActiveId = contextMode === 'consultoria' ? 'consultoria' : contextMode === 'arquivos' ? 'arquivos' : activeId

  const active = MODULES.find(m => m.id === effectiveActiveId) ?? MODULES[0]

  const renderModule = () => {
    // Consultoria sempre mostra ModoConsultoria
    if (contextMode === 'consultoria') return <ModoConsultoria marketData={marketData} />

    // Estudo: IA Advisor em modo pesquisador
    if (contextMode === 'estudo') return <IAAdvisor marketData={marketData} userProfile={userProfile} contextMode="estudo" />

    // Arquivos: relatórios salvos do Cockpit
    if (contextMode === 'arquivos') return <AbaArquivos />

    switch (activeId) {
      case 'ia':         return <IAAdvisor marketData={marketData} userProfile={userProfile} contextMode="gestao" />
      case 'cockpit':    return <CockpitFinanceiro marketData={marketData} userProfile={userProfile} cockpitAlerts={intelligence.cockpit_alerts} />
      case 'cenarios':   return <CenariosForecast marketData={marketData} userProfile={userProfile} />
      case 'pricing':    return <SmartPricing marketData={marketData} userProfile={userProfile} />
      case 'esg':        return <ESGDiagnostico marketData={marketData} />
      case 'inovacao':   return <InovacaoCockpit />
      case 'feedback':   return <FeedbackNPS />
      case 'denuncia':   return <CanalDenuncias />
      case 'governanca': return <Governanca />
      case 'admin':      return <AdminPanel />
      default:           return <Placeholder mod={active} />
    }
  }

  const visibleModules = MODULES.filter(m => m.layer !== 'compliance' && (m.id !== 'admin' || isAdmin))
  const compliance = MODULES.filter(m => m.layer === 'compliance' && (m.id !== 'admin' || isAdmin))

  const layers: LayerType[] = ['sig', 'sie', 'sio']

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div className="w-full">

      {/* Título do projeto */}
      <div className="px-4 py-3 border-b border-white/5">
        <p className="text-[9px] font-mono font-bold tracking-[0.2em] text-white/15 uppercase">
          Projeto de Inteligência Organizacional (OBI) + Software BI &amp; Prototipagem
        </p>
      </div>

      {/* ── Mobile: tabs horizontais ── */}
      <div className="md:hidden overflow-x-auto scrollbar-hide border-b border-white/5">
        {/* Switches mobile */}
        <div className="flex gap-1 px-2 pt-2">
          {visibleSwitches.map(sw => {
            const Icon = sw.icon
            const isActive = contextMode === sw.id
            return (
              <button key={sw.id} onClick={() => setContextMode(sw.id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg shrink-0 transition-all text-[10px]"
                style={{ background: isActive ? `${sw.color}20` : 'transparent', border: `1px solid ${isActive ? sw.color + '50' : 'rgba(255,255,255,0.06)'}`, color: isActive ? sw.color : 'rgba(255,255,255,0.3)' }}>
                <Icon size={11} />
                {sw.short}
              </button>
            )
          })}
        </div>
        {contextMode !== 'consultoria' && contextMode !== 'estudo' && (
          <div className="flex gap-0.5 px-2 py-2 min-w-max">
            {MODULES.filter(m => m.layer !== 'compliance' || isAdmin).map(mod => {
              const Icon = mod.icon
              const isActive = activeId === mod.id
              return (
                <button key={mod.id} onClick={() => setActiveId(mod.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg shrink-0 transition-all"
                  style={{ background: isActive ? `${mod.color}18` : 'transparent', borderLeft: isActive ? `2px solid ${mod.color}` : '2px solid transparent' }}>
                  <Icon size={14} style={{ color: isActive ? mod.color : 'rgba(255,255,255,0.25)' }} />
                  <span className={`text-[11px] font-medium ${isActive ? 'text-white/70' : 'text-white/25'}`}>{mod.short}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Desktop: sidebar + conteúdo ── */}
      <div className="flex min-h-[70vh]">

        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-[200px] shrink-0 border-r border-white/5 py-3"
          style={{ borderRight: contextMode === 'consultoria' ? '1px solid rgba(245,158,11,0.15)' : contextMode === 'estudo' ? '1px solid rgba(99,102,241,0.15)' : undefined }}>

          {/* Sidebar title por contexto */}
          <div className="px-3 mb-3">
            {contextMode === 'gestao' && (
              <p className="text-[10px] font-bold text-white/35 truncate">
                {userProfile?.nomeNegocio
                    ? `Workspace · ${userProfile.nomeNegocio}`
                    : userProfile?.sectors?.[0]
                    ? `Workspace · ${userProfile.sectors[0]}`
                    : 'Workspace · Meu Negócio'}
              </p>
            )}
            {contextMode === 'consultoria' && (
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold" style={{ color: '#f59e0b' }}>OBI · Diagnóstico de Cliente</p>
                <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', letterSpacing: '0.1em' }}>GHOST</span>
              </div>
            )}
            {contextMode === 'estudo' && (
              <p className="text-[10px] font-bold" style={{ color: '#6366f1' }}>Academia de Gestão IPB</p>
            )}
          </div>

          {/* Context switches */}
          <div className="px-2 mb-3">
            <p className="font-mono text-[8px] font-bold tracking-[0.2em] text-white/12 uppercase px-1 mb-1.5">Contexto</p>
            <div className="flex flex-col gap-0.5">
              {visibleSwitches.map(sw => {
                const Icon = sw.icon
                const isActive = contextMode === sw.id
                return (
                  <button key={sw.id} onClick={() => setContextMode(sw.id)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all"
                    style={{ background: isActive ? `${sw.color}18` : 'transparent', borderLeft: isActive ? `3px solid ${sw.color}` : '3px solid transparent' }}>
                    <Icon size={13} style={{ color: isActive ? sw.color : 'rgba(255,255,255,0.2)' }} />
                    <div className="min-w-0">
                      <p className={`text-[11px] font-bold truncate ${isActive ? 'text-white/75' : 'text-white/25'}`}>{sw.label}</p>
                      <p className="text-[9px] text-white/20 truncate">{sw.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mx-3 h-px bg-white/5 mb-3" />

          {/* Fase atual */}
          {userProfile && (() => {
            const ph = PHASE_LABELS[userProfile.subtype] ?? { label: userProfile.subtype, color: '#5dade2' }
            return (
              <div className="mx-3 mb-3 rounded-lg px-2.5 py-2" style={{ background: `${ph.color}10`, border: `1px solid ${ph.color}25` }}>
                <p className="font-mono text-[8px] font-bold tracking-[0.2em] text-white/20 mb-0.5">FASE ATUAL</p>
                <p className="text-[12px] font-semibold" style={{ color: ph.color }}>{ph.label}</p>
                {userProfile.sectors?.length > 0 && (
                  <p className="text-[10px] text-white/25 truncate mt-0.5">{userProfile.sectors[0]}</p>
                )}
              </div>
            )
          })()}

          {/* Módulos por camada — visíveis apenas no modo Gestão */}
          {contextMode === 'gestao' && (
            <>
              {layers.map(layer => {
                const mods = visibleModules.filter(m => m.layer === layer)
                if (!mods.length) return null
                const lm = LAYER_META[layer]
                return (
                  <div key={layer} className="mb-2">
                    <div className="px-3 mb-1 flex items-center gap-1.5">
                      <span className="font-mono text-[8px] font-bold tracking-[0.2em] uppercase" style={{ color: lm.color }}>{lm.label}</span>
                      <span className="text-[8px] text-white/15">·</span>
                      <span className="text-[8px] text-white/15">{lm.desc}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 px-1.5">
                      {mods.map(mod => {
                        const Icon = mod.icon
                        const isActive = activeId === mod.id
                        return (
                          <button key={mod.id} onClick={() => setActiveId(mod.id)}
                            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-all"
                            style={{ background: isActive ? `${mod.color}15` : 'transparent', borderLeft: isActive ? `3px solid ${mod.color}` : '3px solid transparent' }}>
                            <Icon size={13} style={{ color: isActive ? mod.color : 'rgba(255,255,255,0.2)' }} />
                            <span className={`text-[11px] font-medium truncate ${isActive ? 'text-white/80' : 'text-white/25'}`}>{mod.title}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              <div className="mx-3 my-2 h-px bg-white/5" />
              <div className="px-3 mb-1">
                <p className="font-mono text-[8px] font-bold tracking-[0.2em] text-white/12 uppercase">Compliance</p>
              </div>
              <div className="flex flex-col gap-0.5 px-1.5">
                {compliance.map(mod => {
                  const Icon = mod.icon
                  const isActive = activeId === mod.id
                  return (
                    <button key={mod.id} onClick={() => setActiveId(mod.id)}
                      className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-all"
                      style={{ background: isActive ? `${mod.color}15` : 'transparent', borderLeft: isActive ? `3px solid ${mod.color}` : '3px solid transparent' }}>
                      <Icon size={13} style={{ color: isActive ? mod.color : 'rgba(255,255,255,0.2)' }} />
                      <span className={`text-[11px] font-medium truncate ${isActive ? 'text-white/80' : 'text-white/25'}`}>{mod.title}</span>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {/* No modo consultoria/estudo: hint com mood da IA */}
          {contextMode !== 'gestao' && (() => {
            const sw = CONTEXT_SWITCHES.find(s => s.id === contextMode)!
            return (
              <div className="mx-3 rounded-lg p-3" style={{ background: `${sw.color}0d`, border: `1px solid ${sw.color}30` }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <sw.icon size={11} style={{ color: sw.color }} />
                  <p className="text-[11px] font-bold" style={{ color: sw.color }}>{sw.label}</p>
                </div>
                <p className="text-[10px] text-white/25 leading-relaxed">{sw.mood}</p>
                {contextMode === 'consultoria' && (
                  <p className="text-[9px] font-mono mt-1.5" style={{ color: 'rgba(245,158,11,0.5)' }}>
                    Dados temporários · não afetam seu perfil
                  </p>
                )}
              </div>
            )
          })()}

          {/* Acessibilidade + Config */}
          <div className="mt-auto px-3 pt-3 border-t border-white/5 space-y-3">
            <div>
              <p className="font-mono text-[8px] font-bold tracking-[0.15em] text-white/15 uppercase mb-2">Acessibilidade</p>
              <div className="flex flex-col gap-1">
                {ACC_OPTIONS.map(a => (
                  <button key={a.id} onClick={() => changeMode(a.id)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all"
                    style={{ background: mode === a.id ? 'rgba(93,173,226,0.12)' : 'transparent', border: mode === a.id ? '1px solid rgba(93,173,226,0.25)' : '1px solid rgba(255,255,255,0.04)' }}>
                    <span className={`text-[11px] font-medium ${mode === a.id ? 'text-white/70' : 'text-white/25'}`}>{a.label}</span>
                    <span className={`text-[9px] ${mode === a.id ? 'text-white/40' : 'text-white/12'}`}>{a.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          {/* Header do módulo */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
            {contextMode !== 'gestao' ? (() => {
              const sw = CONTEXT_SWITCHES.find(s => s.id === contextMode)!
              const Icon = sw.icon
              return (
                <>
                  <Icon size={18} style={{ color: sw.color }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-bold text-white/80">{sw.label}</p>
                      {contextMode === 'consultoria' && (
                        <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded animate-pulse" style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', letterSpacing: '0.1em' }}>GHOST</span>
                      )}
                    </div>
                    <p className="text-[10px] font-mono" style={{ color: `${sw.color}90` }}>{sw.mood}</p>
                  </div>
                </>
              )
            })() : (() => {
              const Icon = active.icon
              const lm = LAYER_META[active.layer]
              return (
                <>
                  <Icon size={18} style={{ color: active.color }} />
                  <div>
                    <p className="text-[14px] font-bold text-white/80">{active.title}</p>
                    <p className="text-[10px] font-mono" style={{ color: lm.color }}>{lm.label} · {lm.desc}</p>
                  </div>
                </>
              )
            })()}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={effectiveActiveId + contextMode}
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
            <button key={a.id} onClick={() => changeMode(a.id)}
              className="text-[9px] px-2.5 py-1 rounded-full transition-all"
              style={{ background: mode === a.id ? 'rgba(93,173,226,0.12)' : 'transparent', border: mode === a.id ? '1px solid rgba(93,173,226,0.25)' : '1px solid rgba(255,255,255,0.05)', color: mode === a.id ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)' }}>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
