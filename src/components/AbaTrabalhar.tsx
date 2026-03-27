'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  LayoutDashboard,
  Activity,
  Tag,
  Zap,
  ShieldCheck,
  Globe,
  Users,
  Target,
  Lightbulb,
  ChevronDown,
} from 'lucide-react'
import dynamic from 'next/dynamic'

const IAAdvisor = dynamic(() => import('@/components/workspace/IAAdvisor'), { ssr: false })
const CockpitFinanceiro = dynamic(() => import('@/components/workspace/CockpitFinanceiro'), { ssr: false })
const CenariosForecast = dynamic(() => import('@/components/workspace/CenariosForecast'), { ssr: false })
const SmartPricing = dynamic(() => import('@/components/workspace/SmartPricing'), { ssr: false })

interface ModuleConfig {
  id: number
  title: string
  icon: React.ElementType
  color: string
  subtitle: string
  descriptions: string[]
  connectsTo: string[]
  status: 'connected' | 'building'
  liveData?: (data: any) => string
}

const modules: ModuleConfig[] = [
  {
    id: 1,
    title: 'IA Advisor',
    icon: Brain,
    color: '#5dade2',
    subtitle: 'Inteligência artificial aplicada ao seu negócio',
    descriptions: [
      'Cruza seus dados com o mercado em tempo real',
      'Gera CONDUTA automaticamente via IA',
    ],
    connectsTo: ['Business (todas as abas)'],
    status: 'connected',
    liveData: (d: any) => {
      const selic = d?.macro?.selic?.value ?? '—'
      const pib = d?.macro?.pib?.value ?? '—'
      const cac = d?.marketing?.cac?.value ?? '—'
      return `SELIC ${selic}% + PIB ${pib}% + CAC R$${cac} — IA cruzando agora`
    },
  },
  {
    id: 2,
    title: 'Cockpit Financeiro',
    icon: LayoutDashboard,
    color: '#1e8449',
    subtitle: 'Painel financeiro inteligente',
    descriptions: [
      'Receita, margem, EBITDA, health score, runway',
      'SELIC subiu → seu custo financeiro muda em tempo real',
    ],
    connectsTo: ['Macro (SELIC, IPCA)'],
    status: 'connected',
    liveData: (d: any) => {
      const selic = d?.macro?.selic?.value
      if (!selic) return 'Carregando dados de mercado...'
      const custo = (parseFloat(selic) * 2.5).toFixed(1)
      return `Custo financeiro base: SELIC ${selic}% × 2.5 = ${custo}% a.a.`
    },
  },
  {
    id: 3,
    title: 'Cenários & Forecast',
    icon: Activity,
    color: '#9a7d0a',
    subtitle: 'Simulação de cenários macro',
    descriptions: [
      'Stress test com dados macro reais',
      'E se SELIC for a 16%? E se câmbio bater R$6.50?',
    ],
    connectsTo: ['Macro (todos indicadores)'],
    status: 'connected',
    liveData: (d: any) => {
      const selic = d?.macro?.selic?.value ?? '—'
      const ipca = d?.macro?.ipca?.value ?? '—'
      const pib = d?.macro?.pib?.value ?? '—'
      const usd = d?.macro?.cambio?.value ?? '—'
      return `Base macro: SELIC ${selic}%, IPCA ${ipca}%, PIB ${pib}%, USD R$${usd}`
    },
  },
  {
    id: 4,
    title: 'Smart Pricing',
    icon: Tag,
    color: '#c0392b',
    subtitle: 'Precificação dinâmica',
    descriptions: [
      'Precificação com inflação e câmbio reais',
      'Markup, margem, ponto de equilíbrio — atualizado pelo mercado',
    ],
    connectsTo: ['Macro (IPCA, câmbio)'],
    status: 'connected',
    liveData: (d: any) => {
      const ipca = d?.macro?.ipca?.value
      if (!ipca) return 'Carregando dados de mercado...'
      const impacto = (parseFloat(ipca) * 1.2).toFixed(1)
      return `Inflação atual: ${ipca}% — impacta markup em ${impacto}%`
    },
  },
  {
    id: 5,
    title: 'Inovação & Tendências',
    icon: Zap,
    color: '#7d3c98',
    subtitle: 'Radar de maturidade digital',
    descriptions: [
      'Radar de maturidade digital + tendências do setor',
      'IA identifica gaps e oportunidades no seu setor',
    ],
    connectsTo: ['Panorama (setores)'],
    status: 'building',
  },
  {
    id: 6,
    title: 'ESG — Diagnóstico Inteligente',
    icon: ShieldCheck,
    color: '#1a5276',
    subtitle: 'Sustentabilidade e governança',
    descriptions: [
      'Qual framework usar? TBL, ESG, GRI, ODS ou CSV?',
      'IA recomenda baseado no seu tipo de empresa e setor',
      'ODS = O QUÊ (meta global) · ESG = COMO (métrica interna)',
    ],
    connectsTo: ['Macro (IPCA, PIB)', 'Riscos'],
    status: 'building',
  },
  {
    id: 7,
    title: 'Mercado & Concorrência',
    icon: Globe,
    color: '#b7950b',
    subtitle: 'Análise competitiva e sizing',
    descriptions: [
      'TAM, SAM, SOM + posicionamento competitivo',
      'Dados de setores e plataformas em tempo real',
    ],
    connectsTo: ['Marketing (CAC, plataformas)'],
    status: 'connected',
    liveData: (d: any) => {
      const cac = d?.marketing?.cac?.value ?? '—'
      const delta = d?.marketing?.cac?.delta ?? '—'
      return `CAC médio mercado: R$${cac} (${delta}% vs mês anterior)`
    },
  },
  {
    id: 8,
    title: 'Pessoas & Liderança',
    icon: Users,
    color: '#a04000',
    subtitle: 'People analytics e cultura',
    descriptions: [
      'People analytics: headcount, payroll, retenção, eNPS',
      'Gap salarial, diversidade, turnover',
    ],
    connectsTo: ['Macro (PIB → demanda por talento)'],
    status: 'building',
  },
  {
    id: 9,
    title: 'Processos & Operações',
    icon: Target,
    color: '#2471a3',
    subtitle: 'Jornada e eficiência operacional',
    descriptions: [
      'Jornada do cliente: acquisition → conversion → delivery → retention',
      'Gargalos e digital twin',
    ],
    connectsTo: ['Marketing (CAC, funil)'],
    status: 'building',
  },
  {
    id: 10,
    title: 'Canvas & Pitch',
    icon: Lightbulb,
    color: '#27ae60',
    subtitle: 'Modelo de negócio e pitch',
    descriptions: [
      'Business Model Canvas + viabilidade financeira',
      'Pitch deck gerado por IA',
    ],
    connectsTo: ['Cockpit (financeiro)', 'Mercado'],
    status: 'building',
  },
]

export default function AbaTrabalhar() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [marketData, setMarketData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/market')
      .then((r) => r.json())
      .then(setMarketData)
      .catch(() => {})
  }, [])

  const toggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="font-mono text-[11px] font-bold tracking-[0.3em] text-white/20 uppercase">
          Workspace
        </p>
        <h2
          className="text-[18px] font-semibold text-white/70 mt-1"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Seu espaço de <span className="text-white/95">trabalho</span>
        </h2>
        <button
          onClick={() => { localStorage.removeItem('ipb-workspace-ready'); window.location.reload() }}
          className="mt-3 font-mono text-[10px] text-white/20 hover:text-white/40 transition-colors"
        >
          Refazer configuração
        </button>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {modules.map((mod) => {
          const Icon = mod.icon
          const isExpanded = expandedId === mod.id
          const isConnected = mod.status === 'connected'

          return (
            <motion.div
              key={mod.id}
              layout
              className="rounded-lg overflow-hidden cursor-pointer"
              style={{
                background: isExpanded
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.3)',
                borderLeft: `4px solid ${mod.color}`,
                border: isExpanded ? `1px solid ${mod.color}40` : undefined,
                borderLeftWidth: '4px',
                borderLeftColor: mod.color,
              }}
              onClick={() => toggle(mod.id)}
              whileHover={{ scale: 1.005 }}
              transition={{ layout: { duration: 0.25, ease: 'easeInOut' } }}
            >
              {/* Card Header */}
              <div className="flex items-center gap-3 p-4">
                <div
                  className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `${mod.color}20` }}
                >
                  <Icon size={18} color={mod.color} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-white/90 truncate">
                      {mod.title}
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0"
                      style={{
                        background: isConnected
                          ? 'rgba(39,174,96,0.15)'
                          : 'rgba(243,156,18,0.15)',
                        color: isConnected ? '#27ae60' : '#f39c12',
                      }}
                    >
                      {isConnected ? 'Conectado ao mercado' : 'Em construção'}
                    </span>
                  </div>
                  <p className="text-[12px] text-white/40 truncate">{mod.subtitle}</p>
                </div>

                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown size={16} className="text-white/30" />
                </motion.div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-4 pb-4 pt-1 space-y-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Functional modules */}
                      {mod.id === 1 ? (
                        <IAAdvisor marketData={marketData} />
                      ) : mod.id === 2 ? (
                        <CockpitFinanceiro marketData={marketData} />
                      ) : mod.id === 3 ? (
                        <CenariosForecast marketData={marketData} />
                      ) : mod.id === 4 ? (
                        <SmartPricing marketData={marketData} />
                      ) : (
                        <>
                          {/* Descriptions */}
                          <div className="space-y-1.5">
                            {mod.descriptions.map((desc, i) => (
                              <p key={i} className="text-[13px] text-white/60 leading-relaxed">
                                {desc}
                              </p>
                            ))}
                          </div>

                          {/* Connection Badges */}
                          <div className="flex flex-wrap gap-2">
                            {mod.connectsTo.map((conn, i) => (
                              <span
                                key={i}
                                className="text-[11px] px-2.5 py-1 rounded-md"
                                style={{
                                  background: 'rgba(26,82,118,0.15)',
                                  color: '#2471a3',
                                }}
                              >
                                → Conecta com: {conn}
                              </span>
                            ))}
                          </div>

                          {/* Live Data or Building Message */}
                          <div
                            className="rounded-md px-3 py-2.5 text-[12px] leading-relaxed"
                            style={{
                              background: isConnected
                                ? 'rgba(39,174,96,0.08)'
                                : 'rgba(243,156,18,0.08)',
                              borderLeft: `3px solid ${isConnected ? '#27ae6050' : '#f39c1250'}`,
                            }}
                          >
                            {isConnected && mod.liveData ? (
                              <span className="text-white/60">
                                {mod.liveData(marketData)}
                              </span>
                            ) : (
                              <span className="text-white/40 italic">
                                Este módulo será ativado em breve com IA e dados reais
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
