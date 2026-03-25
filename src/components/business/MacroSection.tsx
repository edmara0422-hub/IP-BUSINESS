'use client'

import { useState, useMemo, useEffect, useCallback, memo } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'

const SimulacaoSection = dynamic(() => import('./SimulacaoSection'), { ssr: false, loading: () => <div className="flex min-h-[20rem] items-center justify-center"><span className="text-[10px] text-white/20">Carregando simulação...</span></div> })

const RED   = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE  = '#1a5276'

// ══════════════════════════════════════════════════════════════════════════
// ██  RODAS SVG — DIMENSÕES + SETORES
// ══════════════════════════════════════════════════════════════════════════

function dimColor(s: 'good' | 'warning' | 'critical') {
  return s === 'good' ? GREEN : s === 'warning' ? AMBER : RED
}
function sectorColor(trend: string) {
  return trend === 'up' ? GREEN : trend === 'down' ? RED : AMBER
}

interface DimScore {
  label: string; short: string; score: number; weight: number
  status: 'good' | 'warning' | 'critical'
  driver: string; detail: string
  pts: { label: string; value: number }[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildDimensions(data: any): DimScore[] {
  const clamp = (n: number) => Math.round(Math.max(5, Math.min(95, n)))
  const vv = (n: number | undefined, fb: number) => (n != null && Number.isFinite(n)) ? n : fb
  const selic = vv(data.macro.selic?.value, 10.5)
  const ipca  = vv(data.macro.ipca?.value, 4.8)
  const pib   = vv(data.macro.pib?.value, 2.9)
  const usd   = vv(data.macro.usdBrl?.value, 5.72)
  const sectors = data.sectors as Array<{ id: string; heat: number; change: number }>
  const comms = Object.values(data.commodities as Record<string, { delta: number }>)
  const agents = data.globalAgents as Array<{ delta: number }>
  const cacDelta = data.marketing?.cacTrend?.delta ?? 12

  const pibPts   = Math.min(60, Math.max(0, (pib + 3) / 11 * 60))
  const selicPts = Math.max(0, 40 - Math.max(0, selic - 5) * 3.6)
  const econ     = clamp(pibPts + selicPts)
  const metaBC   = 3.25
  const ipcaOvr  = Math.max(0, ipca - metaBC)
  const infla    = clamp(100 - ipcaOvr * 13)
  const commAvgDelta = comms.reduce((s, c) => s + c.delta, 0) / Math.max(1, comms.length)
  const comm     = clamp(50 + commAvgDelta * 4)
  const techHeat = sectors.find(s => s.id === 'tech')?.heat ?? 60
  const agentAvg = agents.slice(0, 3).reduce((s, a) => s + a.delta, 0) / 3
  const tech     = clamp(techHeat * 0.72 + Math.min(95, 50 + agentAvg * 10) * 0.28)
  const mktAvg   = sectors.reduce((s, sec) => s + sec.heat, 0) / Math.max(1, sectors.length)
  const mktBroad = clamp(mktAvg)
  const inovScore = clamp(tech * 0.75 + mktBroad * 0.25)
  const esgBase  = 55 + (pib > 2 ? 6 : pib < 0 ? -8 : 0) - Math.max(0, ipca - 4) * 2.5 - Math.max(0, usd - 5.5) * 3
  const esg      = clamp(esgBase)
  const mkt      = clamp(72 - cacDelta * 1.7)
  const status   = (s: number): 'good' | 'warning' | 'critical' => s >= 65 ? 'good' : s >= 42 ? 'warning' : 'critical'

  return [
    { label: 'Econômico', short: 'ECON', score: econ, weight: 0.20, status: status(econ),
      driver: `PIB +${pib.toFixed(1)}% · SELIC ${selic.toFixed(1)}%`,
      detail: `PIB cresce ${pib.toFixed(1)}%. SELIC em ${selic.toFixed(1)}% ${selic > 13 ? 'impõe custo de capital elevado, frenando investimentos' : 'em patamar controlado'}.`,
      pts: [{ label: `PIB ${pib.toFixed(1)}%`, value: Math.round(pibPts) }, { label: `SELIC ${selic.toFixed(1)}%`, value: Math.round(selicPts) }] },
    { label: 'Inflação / Social', short: 'IPCA', score: infla, weight: 0.15, status: status(infla),
      driver: `IPCA ${ipca.toFixed(2)}% · Meta BC ${metaBC}%`,
      detail: `IPCA em ${ipca.toFixed(2)}%: ${ipca <= metaBC ? 'abaixo da meta' : ipca <= 4.75 ? 'acima da meta mas dentro da banda' : 'fora da banda — BC sob pressão'}.`,
      pts: [{ label: `Desvio meta`, value: Math.round(100 - ipcaOvr * 13) }] },
    { label: 'Commodities', short: 'COMM', score: comm, weight: 0.15, status: status(comm),
      driver: `Média ${comms.length} commod.: ${commAvgDelta > 0 ? '+' : ''}${commAvgDelta.toFixed(1)}%`,
      detail: `${commAvgDelta > 2 ? 'Alta pressiona inflação de insumos.' : commAvgDelta > -2 ? 'Commodities estáveis.' : 'Queda alivia inflação de insumos.'}`,
      pts: comms.slice(0, 3).map((c, i) => ({ label: `Commodity ${i + 1}`, value: Math.round(50 + c.delta * 4) })) },
    { label: 'Tech & Digital', short: 'TECH', score: tech, weight: 0.15, status: status(tech),
      driver: `Tech heat: ${techHeat}/100 · Big techs: ${agentAvg > 0 ? '+' : ''}${agentAvg.toFixed(1)}%`,
      detail: `Setor tech ${tech >= 70 ? 'aquecido' : tech >= 50 ? 'moderado' : 'desacelerando'}. Big techs globais: ${agentAvg.toFixed(1)}%.`,
      pts: [{ label: `Heat tech`, value: Math.round(techHeat * 0.72) }, { label: `Big techs`, value: Math.round(Math.min(95, 50 + agentAvg * 10) * 0.28) }] },
    { label: 'Mercado Amplo', short: 'MKTD', score: mktBroad, weight: 0.15, status: status(mktBroad),
      driver: `Média ${sectors.length} setores: ${mktAvg.toFixed(0)}/100`,
      detail: `${mktAvg >= 65 ? 'Expansão generalizada.' : mktAvg >= 50 ? 'Crescimento heterogêneo — setores divergem.' : 'Mercado contraindo na maioria dos setores.'}`,
      pts: sectors.slice(0, 3).map(s => ({ label: s.id, value: s.heat })) },
    { label: 'Inovação', short: 'INOV', score: inovScore, weight: 0.10, status: status(inovScore),
      driver: `Tech (75%) + Mercado (25%)`,
      detail: `${inovScore >= 70 ? 'Startups conseguem funding, M&A aquece.' : 'Custo de capital alto inibe R&D.'}`,
      pts: [{ label: 'Tech', value: Math.round(tech * 0.75) }, { label: 'Market', value: Math.round(mktBroad * 0.25) }] },
    { label: 'ESG / Sustent.', short: 'ESG', score: esg, weight: 0.10, status: status(esg),
      driver: `Proxy via macro (PIB, IPCA, câmbio)`,
      detail: `PIB positivo (+${pib > 2 ? 6 : 0}pts). IPCA pressiona desigualdade (-${(Math.max(0, ipca - 4) * 2.5).toFixed(0)}pts). Câmbio alto encarece energia limpa (-${(Math.max(0, usd - 5.5) * 3).toFixed(0)}pts).`,
      pts: [{ label: `PIB proxy`, value: esg }] },
    { label: 'Marketing', short: 'MRKT', score: mkt, weight: 0.10, status: status(mkt),
      driver: `CAC trend: +${cacDelta.toFixed(0)}% YoY`,
      detail: `CAC ${cacDelta > 0 ? `subindo +${cacDelta.toFixed(0)}%` : `caindo ${cacDelta.toFixed(0)}%`} YoY — ${cacDelta > 20 ? 'eficiência caindo drasticamente.' : cacDelta > 10 ? 'pressão gerenciável.' : 'eficiência mantida.'}`,
      pts: [{ label: `CAC trend`, value: mkt }] },
  ]
}

// ── MultidimRadial ──────────────────────────────────────────────────────────
const CX = 155, CY = 155, R_INNER = 40, R_MAX = 114, SPOKE_LEN = 74, R_LABEL = 132

const MultidimRadial = memo(function MultidimRadial({ dimensions, activeDim, onSelect, marketScore, scoreColor, scoreLabel }: {
  dimensions: DimScore[]; activeDim: number; onSelect: (i: number) => void
  marketScore: number; scoreColor: string; scoreLabel: string
}) {
  return (
    <svg viewBox="0 0 310 310" style={{ width: '100%', display: 'block', overflow: 'visible' }}>
      <circle cx={CX} cy={CY} r={R_MAX} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="3 5" />
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
        return (
          <g key={dim.short} style={{ cursor: 'pointer' }} onClick={() => onSelect(i)}>
            <line x1={x1} y1={y1} x2={xFull} y2={yFull} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <motion.path d={`M ${x1} ${y1} L ${xFull} ${yFull}`}
              stroke={color} strokeWidth={isActive ? 3 : 1.5} strokeLinecap="round" fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: dim.score / 100, opacity: isActive ? 1 : 0.3 }}
              transition={{ duration: 1.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              style={isActive ? { filter: `drop-shadow(0 0 4px ${color}99)` } : {}} />
            <motion.circle cx={xScore} cy={yScore} fill={color}
              animate={{ r: isActive ? [3, 4.5, 3] : 2, opacity: isActive ? 1 : 0.3 }}
              transition={{ r: { duration: 1.4, repeat: Infinity }, opacity: { duration: 0.3 } }} />
            <line x1={x1} y1={y1} x2={xFull} y2={yFull} stroke="transparent" strokeWidth={20} />
            <text x={xLabel} y={yLabel} textAnchor="middle" dominantBaseline="middle"
              fontSize={isActive ? 8.5 : 7.5} fontFamily="monospace" fontWeight={isActive ? 'bold' : 'normal'}
              fill={isActive ? color : 'rgba(255,255,255,0.28)'} letterSpacing="0.1em">{dim.short}</text>
          </g>
        )
      })}
      <circle cx={CX} cy={CY} r={R_INNER} fill="rgba(0,0,0,0.85)" stroke={scoreColor} strokeWidth={1.5}
        style={{ filter: `drop-shadow(0 0 8px ${scoreColor}33)` }} />
      <text x={CX} y={CY - 8} textAnchor="middle" dominantBaseline="middle"
        fontSize={26} fontFamily="monospace" fontWeight="bold" fill={scoreColor}>{marketScore}</text>
      <text x={CX} y={CY + 13} textAnchor="middle" dominantBaseline="middle"
        fontSize={6.5} fontFamily="monospace" fill={scoreColor} letterSpacing="0.2em">{scoreLabel}</text>
    </svg>
  )
})

// ── SectorRadial ────────────────────────────────────────────────────────────
const SCX = 155, SCY = 155, SR_INNER = 40, SR_MAX = 114, SPOKE_S = 74, SR_LABEL = 132

const SectorRadial = memo(function SectorRadial({ sectors, activeSec, onSelect, avgHeat }: {
  sectors: Array<{ label: string; heat: number; change: number; trend: string }>
  activeSec: number; onSelect: (i: number) => void; avgHeat: number
}) {
  const n = sectors.length
  return (
    <svg viewBox="0 0 310 310" style={{ width: '100%', display: 'block', overflow: 'visible' }}>
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
        const short = s.label.split(' ')[0].substring(0, 6)
        return (
          <g key={s.label} style={{ cursor: 'pointer' }} onClick={() => onSelect(i)}>
            <line x1={x1} y1={y1} x2={xFull} y2={yFull} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <motion.path d={`M ${x1} ${y1} L ${xFull} ${yFull}`}
              stroke={color} strokeWidth={isActive ? 3 : 1.5} strokeLinecap="round" fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: s.heat / 100, opacity: isActive ? 1 : 0.28 }}
              transition={{ duration: 1.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              style={isActive ? { filter: `drop-shadow(0 0 4px ${color}99)` } : {}} />
            <motion.circle cx={xScore} cy={yScore} fill={color}
              animate={{ r: isActive ? [3, 4.5, 3] : 2, opacity: isActive ? 1 : 0.28 }}
              transition={{ r: { duration: 1.4, repeat: Infinity }, opacity: { duration: 0.3 } }} />
            <line x1={x1} y1={y1} x2={xFull} y2={yFull} stroke="transparent" strokeWidth={20} />
            <text x={xLabel} y={yLabel} textAnchor="middle" dominantBaseline="middle"
              fontSize={isActive ? 8.5 : 7.5} fontFamily="monospace" fontWeight={isActive ? 'bold' : 'normal'}
              fill={isActive ? color : 'rgba(255,255,255,0.28)'} letterSpacing="0.08em">{short}</text>
          </g>
        )
      })}
      <circle cx={SCX} cy={SCY} r={SR_INNER} fill="rgba(0,0,0,0.85)"
        stroke="rgba(192,192,192,0.5)" strokeWidth={1.5}
        style={{ filter: 'drop-shadow(0 0 8px rgba(192,192,192,0.2))' }} />
      <text x={SCX} y={SCY - 8} textAnchor="middle" dominantBaseline="middle"
        fontSize={26} fontFamily="monospace" fontWeight="bold" fill="rgba(192,192,192,0.9)">{avgHeat}</text>
      <text x={SCX} y={SCY + 13} textAnchor="middle" dominantBaseline="middle"
        fontSize={6.5} fontFamily="monospace" fill="rgba(192,192,192,0.5)" letterSpacing="0.2em">HEAT AVG</text>
    </svg>
  )
})

// ── DimDetailPanel ──────────────────────────────────────────────────────────
function DimDetailPanel({ dim, scoreColor, extra }: {
  dim: DimScore; scoreColor: string; extra?: React.ReactNode
}) {
  const color = dimColor(dim.status)
  const statusLabel = dim.status === 'good' ? 'SAUDÁVEL' : dim.status === 'warning' ? 'MODERADO' : 'CRÍTICO'
  const contribution = Math.round(dim.score * dim.weight)
  return (
    <motion.div key={dim.short}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${color}22` }}>
      <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${color}80, transparent)` }} />
      <div className="px-3 py-2.5 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="font-mono text-[10px] font-bold" style={{ color }}>{dim.short}</span>
            <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-sm" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>{statusLabel}</span>
          </div>
          <p className="font-mono text-[8px] text-white/30 mb-1">{dim.driver}</p>
          <p className="text-[10px] text-white/45 leading-relaxed">{dim.detail}</p>
        </div>
        <div className="flex flex-col items-center shrink-0">
          <span className="font-mono text-[28px] font-bold leading-none" style={{ color }}>{dim.score}</span>
          <span className="font-mono text-[7px] text-white/20 mt-0.5">peso {Math.round(dim.weight * 100)}%</span>
          <div className="mt-1 rounded-sm px-1.5 py-0.5" style={{ background: `${scoreColor}15`, border: `1px solid ${scoreColor}25` }}>
            <span className="font-mono text-[7px]" style={{ color: scoreColor }}>+{contribution}pts</span>
          </div>
        </div>
      </div>
      {extra && <div className="px-3 pb-3">{extra}</div>}
      {!extra && (
        <div className="px-3 pb-2.5 flex flex-wrap gap-1.5">
          {dim.pts.map((p, i) => (
            <div key={i} className="flex items-center gap-1 rounded-sm px-1.5 py-0.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-[8px] text-white/25">{p.label}</span>
              <span className="font-mono text-[9px] font-bold" style={{ color }}>{p.value}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ── SectorDetailPanel ───────────────────────────────────────────────────────
function SectorDetailPanel({ sector, ctx }: {
  sector: { id: string; label: string; heat: number; change: number; trend: string }
  ctx?: { driver: string; macro: string }
}) {
  const color = sectorColor(sector.trend)
  const trendLabel = sector.trend === 'up' ? 'ALTA' : sector.trend === 'down' ? 'BAIXA' : 'NEUTRO'
  return (
    <motion.div key={sector.label}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${color}22` }}>
      <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${color}80, transparent)` }} />
      <div className="px-3 py-2.5 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-mono text-[10px] font-bold" style={{ color }}>{sector.label}</span>
            <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-sm" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>{trendLabel}</span>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <div><span className="font-mono text-[7px] text-white/20 block">HEAT</span>
              <span className="font-mono text-[14px] font-bold" style={{ color }}>{sector.heat}/100</span></div>
            <div><span className="font-mono text-[7px] text-white/20 block">YTD</span>
              <span className="font-mono text-[14px] font-bold" style={{ color }}>{sector.change > 0 ? '+' : ''}{sector.change.toFixed(1)}%</span></div>
          </div>
        </div>
        <span className="font-mono text-[38px] font-bold leading-none shrink-0" style={{ color, opacity: 0.12 }}>
          {sector.trend === 'up' ? '▲' : sector.trend === 'down' ? '▼' : '–'}
        </span>
      </div>
      <div className="px-3 pb-2.5">
        <div className="h-[3px] w-full rounded-full overflow-hidden mb-2.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div className="h-full rounded-full" style={{ background: color }}
            initial={{ width: 0 }} animate={{ width: `${sector.heat}%` }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
        </div>
        {ctx && (
          <div className="flex flex-col gap-1.5">
            <div>
              <span className="font-mono text-[7px] text-white/18 block mb-0.5">DRIVER</span>
              <p className="text-[9px] text-white/40 leading-snug">{ctx.driver}</p>
            </div>
            <div>
              <span className="font-mono text-[7px] text-white/18 block mb-0.5">CONTEXTO MACRO</span>
              <p className="text-[9px] text-white/35 leading-snug">{ctx.macro}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function v(n: number | undefined, fb: number) { return (n != null && Number.isFinite(n)) ? n : fb }

// ── Agente global detalhado ────────────────────────────────────────────────
interface AgentDetail {
  id: string; label: string; delta: number; impact: string
  sector: string; mktCap: string
  whyMatters: string
  cascades: string[]
  brazilEffect: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildAgents(data: any): AgentDetail[] {
  const agents = data.globalAgents as Array<{ id: string; label: string; delta: number; impact: string }>
  const usd = v(data.macro.usdBrl?.value, 5.72)
  const selic = v(data.macro.selic?.value, 10.5)

  const details: Record<string, Omit<AgentDetail, 'id' | 'label' | 'delta' | 'impact'>> = {
    aapl: {
      sector: 'Consumer Tech',
      mktCap: 'US$ 3.3T',
      whyMatters: `Apple define o comportamento do consumidor premium global. Quando Apple cresce, indica demanda por produto de alto valor — o que impacta diretamente categorias de ticket alto no Brasil.`,
      cascades: [
        `iPhone mais caro com dólar R$${usd.toFixed(2)} → consumidor brasileiro paga mais → pressão inflacionária em eletrônicos`,
        `Ecossistema App Store: desenvolvedores brasileiros recebem em dólar — benefício para tech local`,
        `Tendência de hardware premium influencia posicionamento de Samsung, Motorola e LG no Brasil`,
        `Comportamento de consumo: se Apple sobe, consumidor premium está confiante — positivo para luxo e serviços premium BR`,
      ],
      brazilEffect: `Impacto direto em distribuidores de eletrônicos (Magazine Luiza, Americanas). Indireto em toda cadeia de consumo premium.`,
    },
    googl: {
      sector: 'AdTech / Cloud',
      mktCap: 'US$ 2.1T',
      whyMatters: `Google controla o maior inventário de anúncios do mundo e a principal fonte de tráfego orgânico. Mudanças no algoritmo ou no CPC afetam diretamente o custo de aquisição de clientes de qualquer empresa digital no Brasil.`,
      cascades: [
        `CPC sobe → CAC de todas as empresas que usam Google Ads sobe junto`,
        `Mudanças de algoritmo (core updates) podem derrubar tráfego orgânico de sites inteiros em horas`,
        `Google Cloud concorre com AWS/Azure — preços afetam stack de tech de startups BR`,
        `YouTube: maior plataforma de vídeo no Brasil — mudanças em monetização afetam criadores e anunciantes`,
      ],
      brazilEffect: `Qualquer empresa com presença digital no Brasil é afetada. Google Ads é o principal canal de aquisição pago para PMEs brasileiras.`,
    },
    meta: {
      sector: 'Social / AdTech',
      mktCap: 'US$ 1.5T',
      whyMatters: `Meta (Facebook + Instagram + WhatsApp) é o maior canal de social commerce do Brasil. CPM subindo significa que aquisição de clientes via social fica mais cara para TODOS que anunciam — independente do segmento.`,
      cascades: [
        `CPM subindo → CAC médio sobe para todas as empresas que dependem de Meta Ads`,
        `WhatsApp Business: canal de vendas primário para PMEs brasileiras — mudanças de API afetam fluxo de vendas`,
        `Instagram Shopping: influencia diretamente o e-commerce de moda e beleza no Brasil`,
        `Threads e Reels: novos formatos redistribuem atenção e orçamento de conteúdo`,
      ],
      brazilEffect: `Brasil é um dos maiores mercados da Meta globalmente. Decisões de produto da Meta impactam DIRETO o e-commerce e varejo digital brasileiro.`,
    },
    amzn: {
      sector: 'E-commerce / Cloud',
      mktCap: 'US$ 2.2T',
      whyMatters: `Amazon BR pressiona preços de todo o e-commerce nacional com logística rápida e preços competitivos. AWS é a principal infraestrutura de cloud no Brasil — preços e disponibilidade afetam toda a stack de tech.`,
      cascades: [
        `Fulfillment rápido eleva expectativa do consumidor → varejo tradicional perde na experiência`,
        `Amazon Ads crescendo → mais um leilão de anúncios subindo em custo`,
        `AWS pricing afeta diretamente o custo de infraestrutura de startups e fintechs brasileiras`,
        `Seller central: marketplace atrai vendedores que antes estavam só no Mercado Livre`,
      ],
      brazilEffect: `Pressão direta no varejo eletrônico. Magazine Luiza, Americanas e Mercado Livre ajustam estratégias em resposta à Amazon BR.`,
    },
    vale: {
      sector: 'Mineração / Commodities',
      mktCap: 'R$ 280B',
      whyMatters: `Vale é a maior mineradora do mundo em ferro. O preço do minério de ferro determina a receita da Vale, que impacta o câmbio (entrada de dólares), a Bolsa e o PIB industrial brasileiro.`,
      cascades: [
        `Minério de ferro cai → receita da Vale cai → menos dólares entrando no Brasil → real se desvaloriza`,
        `Vale é o maior peso do Ibovespa → seu desempenho move a bolsa toda`,
        `Siderúrgicas nacionais dependem do minério Vale → setor industrial impactado`,
        `China é o maior comprador — desaceleração chinesa afeta Vale mais que qualquer fator interno`,
      ],
      brazilEffect: `Câmbio, Ibovespa, geração de empregos no interior de MG e PA, arrecadação federal via dividendos e impostos.`,
    },
    petr: {
      sector: 'Energia / Petróleo',
      mktCap: 'R$ 480B',
      whyMatters: `Petrobras controla o preço do combustível no Brasil. Diesel e gasolina afetam o custo logístico de TODA a cadeia produtiva — do produtor rural ao delivery urbano. Além disso, é a maior empresa da Bolsa brasileira.`,
      cascades: [
        `Petróleo sobe (US$${v(data.commodities?.oil?.value, 74.2).toFixed(0)}/bbl) → pressão para Petrobras repassar → combustível mais caro → frete sobe → inflação sobe`,
        `Preço de gasolina afeta poder de compra direto das famílias com carro`,
        `Diesel caro: frete rodoviário sobe → mercadoria em prateleira fica mais cara`,
        `Política de dividendos da Petrobras movimenta bilhões no mercado — influencia Ibovespa`,
        `SELIC alta (${selic.toFixed(1)}%) + Petrobras estável = investidor compara dividend yield com CDI`,
      ],
      brazilEffect: `Inflação, custo logístico, Ibovespa e arrecadação federal. Petrobras paga bilhões em impostos e dividendos ao governo.`,
    },
  }

  return agents.map(ag => ({
    ...ag,
    ...(details[ag.id] ?? {
      sector: 'Global',
      mktCap: '—',
      whyMatters: `Agente econômico global com impacto encadeado no mercado brasileiro.`,
      cascades: [ag.impact],
      brazilEffect: ag.impact,
    }),
  }))
}

// ── Card do agente ─────────────────────────────────────────────────────────
function AgentCard({ agent, index }: { agent: AgentDetail; index: number }) {
  const [open, setOpen] = useState(false)
  const col = agent.delta > 0 ? GREEN : agent.delta < 0 ? RED : AMBER
  const sign = agent.delta > 0 ? '+' : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
      className="rounded-lg overflow-hidden"
      style={{ border: `1px solid rgba(255,255,255,${open ? '0.1' : '0.05'})`, background: 'rgba(0,0,0,0.25)' }}>

      <button className="w-full flex items-center gap-3 px-4 py-3 text-left" onClick={() => setOpen(o => !o)}>
        {/* Delta badge */}
        <div className="shrink-0 flex flex-col items-center gap-0.5 w-14">
          <span className="font-mono text-[18px] font-bold leading-none" style={{ color: col }}>{sign}{agent.delta.toFixed(1)}%</span>
          <div className="h-[2px] w-10 rounded-full" style={{ background: col, opacity: 0.5 }} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[13px] font-semibold text-white/75">{agent.label}</span>
            <span className="font-mono text-[8px] text-white/20 tracking-wider">{agent.sector}</span>
          </div>
          <p className="text-[10px] text-white/35 truncate">{agent.impact}</p>
        </div>

        {/* Market cap + expand */}
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className="font-mono text-[9px] text-white/20">{agent.mktCap}</span>
          <span className="text-white/20 text-[10px]">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
            className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-white/[0.05]">
              {/* Por que importa */}
              <div className="mt-3 rounded-sm p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-white/20 block mb-1.5">POR QUE ESSE AGENTE IMPORTA</span>
                <p className="text-[10px] text-white/50 leading-relaxed">{agent.whyMatters}</p>
              </div>

              {/* Cascata */}
              <div className="mt-3">
                <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-white/20 block mb-2">EFEITOS EM CASCATA</span>
                <div className="flex flex-col gap-1.5">
                  {agent.cascades.map((c, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-mono text-[9px] shrink-0 mt-0.5" style={{ color: col }}>→</span>
                      <span className="text-[10px] text-white/40 leading-relaxed">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Efeito no Brasil */}
              <div className="mt-3 rounded-sm p-2.5" style={{ background: `${BLUE}15`, border: `1px solid ${BLUE}30` }}>
                <span className="font-mono text-[7px] font-bold tracking-[0.2em] block mb-1" style={{ color: '#5dade2' }}>IMPACTO DIRETO NO BRASIL</span>
                <p className="text-[10px] text-white/40 leading-relaxed">{agent.brazilEffect}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Card commodity ─────────────────────────────────────────────────────────
function CommodityCard({ name, value, delta, unit, label, index }: {
  name: string; value: number; delta: number; unit: string; label: string; index: number
}) {
  const col = delta > 0 ? GREEN : delta < 0 ? RED : AMBER
  const context: Record<string, string> = {
    gold:    'Ouro sobe em momentos de incerteza global. Alta = risco percebido no mundo. Impacta joalheria e reservas de valor.',
    oil:     'Petróleo define custo do frete e combustível. Alta pressiona inflação em toda a cadeia produtiva brasileira.',
    silver:  'Prata é insumo industrial (eletrônicos, energia solar). Alta indica demanda industrial aquecida.',
    grains:  'Grãos afetam diretamente o preço de alimentos. Brasil como exportador ganha em receita de câmbio.',
    copper:  'Cobre é termômetro da economia global. Alta indica expansão industrial. Insumo essencial em construção e eletrônicos.',
    lithium: 'Lítio é insumo de baterias EV. Queda indica excesso de oferta — setor de veículos elétricos desacelerando.',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }}
      className="rounded-lg p-3 flex flex-col gap-2"
      style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid rgba(255,255,255,0.06)` }}>

      <div className="flex items-start justify-between">
        <span className="font-mono text-[9px] font-bold tracking-widest text-white/30">{label.toUpperCase()}</span>
        <span className={`font-mono text-[10px] font-bold`} style={{ color: col }}>{delta > 0 ? '+' : ''}{delta.toFixed(1)}%</span>
      </div>

      <div>
        <span className="font-mono text-[20px] font-bold text-white/80">
          {value > 1000 ? value.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) : value.toFixed(2)}
        </span>
        <span className="font-mono text-[10px] text-white/25 ml-1">{unit}</span>
      </div>

      <div className="h-[2px] w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <motion.div className="h-full rounded-full" style={{ background: col }}
          initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.abs(delta) * 10 + 20)}%` }}
          transition={{ duration: 1, delay: index * 0.05 }} />
      </div>

      <p className="text-[9px] text-white/25 leading-relaxed">{context[name] ?? ''}</p>
    </motion.div>
  )
}

// ── Indicador macro detalhado ──────────────────────────────────────────────
function MacroIndicator({ label, value, unit, delta, status, description, context, index }: {
  label: string; value: string; unit: string; delta: number; status: 'critical' | 'risk' | 'ok'
  description: string; context: string; index: number
}) {
  const col = status === 'critical' ? RED : status === 'risk' ? AMBER : GREEN

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}
      className="rounded-lg p-3 flex flex-col gap-2"
      style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${col}25` }}>

      <div className="flex items-center justify-between">
        <span className="font-mono text-[8px] font-bold tracking-[0.2em]" style={{ color: col }}>{label}</span>
        <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-sm"
          style={{ background: `${col}15`, color: col, border: `1px solid ${col}30` }}>
          {status === 'critical' ? 'CRÍTICO' : status === 'risk' ? 'ATENÇÃO' : 'NORMAL'}
        </span>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-[28px] font-bold leading-none text-white/85">{value}</span>
        <span className="font-mono text-[12px] text-white/40">{unit}</span>
        <span className="font-mono text-[11px] font-bold ml-1" style={{ color: delta > 0 ? RED : delta < 0 ? GREEN : AMBER }}>
          {delta > 0 ? '▲' : delta < 0 ? '▼' : '—'}{Math.abs(delta).toFixed(2)}
        </span>
      </div>

      <p className="text-[10px] text-white/35 leading-relaxed">{description}</p>

      <div className="rounded-sm px-2 py-1.5 mt-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-[9px] text-white/25 leading-relaxed italic">{context}</p>
      </div>
    </motion.div>
  )
}

// ── Principal ──────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MacroSection({ data }: { data: any }) {
  const agents = useMemo(() => buildAgents(data), [data])
  const dimensions = useMemo(() => buildDimensions(data), [data])
  const sectors = data.sectors as Array<{ id: string; label: string; change: number; trend: string; heat: number }>

  // ── Estado das rodas ──
  const [activeDim, setActiveDim] = useState(0)
  const [manualLock, setManualLock] = useState(false)
  const [activeSec, setActiveSec] = useState(0)
  const [secLock, setSecLock] = useState(false)

  const handleDimSelect = useCallback((i: number) => {
    if (manualLock && activeDim === i) { setManualLock(false) } else { setActiveDim(i); setManualLock(true) }
  }, [manualLock, activeDim])
  const handleSecSelect = useCallback((i: number) => {
    if (secLock && activeSec === i) { setSecLock(false) } else { setActiveSec(i); setSecLock(true) }
  }, [secLock, activeSec])

  useEffect(() => {
    if (manualLock) return
    const t = setInterval(() => setActiveDim(p => (p + 1) % 8), 2800)
    return () => clearInterval(t)
  }, [manualLock])
  useEffect(() => {
    if (secLock) return
    const t = setInterval(() => setActiveSec(p => (p + 1) % sectors.length), 2400)
    return () => clearInterval(t)
  }, [secLock, sectors.length])

  const marketScore = useMemo(() => Math.round(dimensions.reduce((a, d) => a + d.score * d.weight, 0)), [dimensions])
  const scoreStatus = marketScore >= 65 ? 'good' : marketScore >= 45 ? 'warning' : 'critical'
  const scoreColor  = scoreStatus === 'good' ? GREEN : scoreStatus === 'warning' ? AMBER : RED
  const scoreLabel  = scoreStatus === 'good' ? 'SAUDÁVEL' : scoreStatus === 'warning' ? 'MODERADO' : 'CRÍTICO'

  const selic = v(data.macro.selic?.value, 10.5)
  const ipca  = v(data.macro.ipca?.value, 4.8)
  const pib   = v(data.macro.pib?.value, 2.9)
  const usd   = v(data.macro.usdBrl?.value, 5.72)
  const selicD = v(data.macro.selic?.delta, 0)
  const ipcaD  = v(data.macro.ipca?.delta, 0)
  const pibD   = v(data.macro.pib?.delta, 0)
  const usdD   = v(data.macro.usdBrl?.delta, 0)

  const commodities = data.commodities as Record<string, { value: number; delta: number; unit: string; label: string }>

  const sectorContext: Record<string, { driver: string; macro: string }> = {
    tech:      { driver: `IA e digitalização acelerada`,       macro: `PIB +${pib.toFixed(1)}% aquece demanda por tech. SELIC alta encarece captação de startups.` },
    agro:      { driver: `Exportação forte, câmbio favorável`, macro: `Dólar R$${usd.toFixed(2)} beneficia exportadores. PIB agro puxa crescimento nacional.` },
    health:    { driver: `Envelhecimento pop. + MedTech`,      macro: `Independente de ciclo — demanda inelástica. SELIC alta limita expansão de clínicas alavancadas.` },
    energy:    { driver: `Transição energética + ESG`,         macro: `Petróleo US$${v(data.commodities?.oil?.value, 74.2).toFixed(0)}/bbl + agenda ESG aceleram renováveis.` },
    fintech:   { driver: `Bancarização + Open Finance`,        macro: `SELIC ${selic.toFixed(1)}% comprime margem de crédito. Spread bancário alto cria espaço para fintechs.` },
    logistics: { driver: `E-commerce + last mile`,             macro: `Diesel afeta custo direto. PIB aquecido gera mais volume. Dólar encarece peças importadas.` },
    services:  { driver: `Recuperação pós-pandemia`,           macro: `Emprego formal em alta → serviços crescem. SELIC alta desacelera serviços de alto ticket.` },
    retail:    { driver: `Pressão do e-commerce`,              macro: `SELIC ${selic.toFixed(1)}% = crédito caro ao consumidor. IPCA ${ipca.toFixed(2)}% corrói poder de compra.` },
    media:     { driver: `Migração para digital`,              macro: `Estrutural — não é cíclico. Anunciantes abandonam impresso independente do PIB.` },
  }

  const dimShort = dimensions[activeDim]?.short

  // ── Extra content completo por dimensão ──
  const dimExtra: React.ReactNode = (() => {
    if (dimShort === 'ECON') return (
      <div className="flex flex-col gap-3 border-t border-white/[0.05] pt-3">
        <div className="grid grid-cols-2 gap-2">
          <MacroIndicator index={0} label="SELIC" value={selic.toFixed(1)} unit="% a.a."
            delta={selicD} status={selic > 13 ? 'critical' : selic > 10 ? 'risk' : 'ok'}
            description="Taxa básica de juros. Referência para todo o crédito no país."
            context={`Meta Copom: conter IPCA (${ipca.toFixed(2)}%) próximo a 3.25%. SELIC ${selic.toFixed(1)}% = mais alta desde 2016.`} />
          <MacroIndicator index={1} label="PIB" value={`+${pib.toFixed(1)}`} unit="% a.a."
            delta={pibD} status={pib > 2 ? 'ok' : pib > 0 ? 'risk' : 'critical'}
            description="Produto Interno Bruto. Soma de tudo que o Brasil produz."
            context={`Puxado por Agro (+28%), Serviços (+${(pib * 0.8).toFixed(1)}%). PIB forte dificulta queda do IPCA.`} />
        </div>
        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-white/20 block mb-2">COMO SE INFLUENCIAM</span>
          <div className="flex flex-col gap-1.5">
            {[
              { from: 'USD ▲', to: 'IPCA ▲', why: 'importados ficam mais caros', col: RED },
              { from: 'IPCA ▲', to: 'SELIC ▲', why: 'BC aumenta juros (regra de Taylor)', col: AMBER },
              { from: 'SELIC ▲', to: 'PIB ▼', why: 'crédito encarece, consumo recua', col: RED },
              { from: 'PIB ▲', to: 'IPCA ▲', why: 'demanda aquecida pressiona preços', col: AMBER },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[9px]">
                <span className="font-mono font-bold text-white/55 w-14 shrink-0">{r.from}</span>
                <span className="font-mono" style={{ color: r.col }}>→</span>
                <span className="font-mono font-bold text-white/55 w-14 shrink-0">{r.to}</span>
                <span className="text-white/25 flex-1">{r.why}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
    if (dimShort === 'IPCA') return (
      <div className="flex flex-col gap-3 border-t border-white/[0.05] pt-3">
        <div className="grid grid-cols-2 gap-2">
          <MacroIndicator index={0} label="IPCA" value={ipca.toFixed(2)} unit="% 12m"
            delta={ipcaD} status={ipca > 6 ? 'critical' : ipca > 4 ? 'risk' : 'ok'}
            description="Inflação oficial. Meta BC: 3.25% (±1.5pp)."
            context={`Desvio da meta: +${Math.max(0, ipca - 3.25).toFixed(2)}pp. Pressão: câmbio, combustível, serviços.`} />
          <MacroIndicator index={1} label="USD/BRL" value={`R$${usd.toFixed(2)}`} unit=""
            delta={usdD} status={usd > 6 ? 'critical' : usd > 5.3 ? 'risk' : 'ok'}
            description="Câmbio. Cada R$0.10 de alta adiciona ~0.1pp ao IPCA."
            context={`Fed alto + risco fiscal BR pressionam. Exportadores agro/minério beneficiados.`} />
        </div>
      </div>
    )
    if (dimShort === 'COMM') return (
      <div className="flex flex-col gap-3 border-t border-white/[0.05] pt-3">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(commodities).map(([name, c], i) => (
            <CommodityCard key={name} name={name} index={i} value={c.value} delta={c.delta} unit={c.unit} label={c.label} />
          ))}
        </div>
        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-white/20 block mb-2">IMPACTO NO BRASIL</span>
          <div className="flex flex-col gap-1.5">
            {[
              { item: 'Petróleo sobe', effect: 'Frete sobe → inflação em toda a cadeia', col: RED },
              { item: 'Grãos sobem', effect: 'Exportação maior → mais dólares → real aprecia', col: GREEN },
              { item: 'Minério sobe', effect: 'Vale ganha → Ibovespa sobe → câmbio melhora', col: GREEN },
              { item: 'Ouro sobe', effect: 'Incerteza global → capital foge de emergentes', col: AMBER },
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="font-mono text-[9px] shrink-0 mt-0.5" style={{ color: r.col }}>→</span>
                <span className="text-[9px] text-white/25"><span className="font-bold text-white/40">{r.item}:</span> {r.effect}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
    if (dimShort === 'TECH') return (
      <div className="flex flex-col gap-2 border-t border-white/[0.05] pt-3">
        <p className="text-[9px] text-white/25 mb-1">Movimentos dessas empresas propagam em cadeia pelo mercado digital BR.</p>
        {agents.map((ag, i) => <AgentCard key={ag.id} agent={ag} index={i} />)}
      </div>
    )
    if (dimShort === 'MKTD') return (
      <div className="flex flex-col gap-2 border-t border-white/[0.05] pt-3">
        {[...sectors].sort((a, b) => b.heat - a.heat).map((s, i) => {
          const col = sectorColor(s.trend)
          return (
            <div key={s.id} className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-white/20 w-4 shrink-0">{i + 1}</span>
              <span className="text-[10px] text-white/55 flex-1">{s.label}</span>
              <div className="w-20 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div className="h-full rounded-full" style={{ background: col }}
                  initial={{ width: 0 }} animate={{ width: `${s.heat}%` }} transition={{ duration: 0.8, delay: i * 0.04 }} />
              </div>
              <span className="font-mono text-[10px] font-bold w-12 text-right" style={{ color: col }}>
                {s.change > 0 ? '+' : ''}{s.change.toFixed(1)}%
              </span>
            </div>
          )
        })}
      </div>
    )
    if (dimShort === 'MRKT') return (
      <div className="flex flex-col gap-2 border-t border-white/[0.05] pt-3">
        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[8px] text-white/30">CAC TREND</span>
            <span className="font-mono text-[16px] font-bold" style={{ color: RED }}>+{(data.marketing?.cacTrend?.delta ?? 12).toFixed(0)}% YoY</span>
          </div>
          <p className="text-[9px] text-white/30 leading-relaxed">CAC subindo = cada R$ investido em mídia retorna menos. Canais orgânicos e CRM ganham relevância estratégica. Empresas que não diversificam aquisição perdem margem.</p>
        </div>
        <div className="flex flex-col gap-1.5">
          {[
            { plat: 'Meta Ads', note: 'CPM crescendo com iOS tracking limit + concorrência', col: AMBER },
            { plat: 'Google Ads', note: 'CPC estável mas audience intent muda com IA', col: GREEN },
            { plat: 'TikTok Ads', note: 'CPM mais baixo — oportunidade de CAC reduzido', col: GREEN },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="font-mono text-[8px] font-bold w-20 shrink-0" style={{ color: r.col }}>{r.plat}</span>
              <span className="text-[8px] text-white/25 flex-1">{r.note}</span>
            </div>
          ))}
        </div>
      </div>
    )
    if (dimShort === 'INOV') return (
      <div className="flex flex-col gap-3 border-t border-white/[0.05] pt-3">
        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-white/20 block mb-2">ECOSSISTEMA DE INOVAÇÃO</span>
          <div className="flex flex-col gap-1.5">
            {[
              { label: 'Startups', note: `SELIC ${selic.toFixed(1)}% encarece captação — VCs mais seletivos. Valuations em compressão.`, col: selic > 13 ? RED : AMBER },
              { label: 'M&A', note: `PIB +${pib.toFixed(1)}% aquece consolidações. Empresas grandes compram inovação ao invés de desenvolver.`, col: GREEN },
              { label: 'R&D', note: `Dólar alto encarece tecnologia importada (servidores, licenças). Incentivo para soluções nacionais.`, col: AMBER },
              { label: 'IA Adoção', note: `Independente do ciclo — pressão competitiva força adoção. Quem não adota perde eficiência vs concorrência.`, col: GREEN },
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="font-mono text-[8px] font-bold w-16 shrink-0 mt-0.5" style={{ color: r.col }}>{r.label}</span>
                <span className="text-[9px] text-white/30 flex-1 leading-relaxed">{r.note}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-white/20 block mb-1.5">OPORTUNIDADES ATUAIS</span>
          <div className="flex flex-col gap-1">
            {['IA generativa: redução de custo operacional 30-50%', 'Open Finance: novos modelos de distribuição financeira', 'Agritech: Brasil como laboratório global de agro digital', 'HealthTech: digitalização forçada pós-pandemia irreversível'].map((o, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="font-mono text-[9px] shrink-0" style={{ color: GREEN }}>→</span>
                <span className="text-[9px] text-white/30">{o}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
    if (dimShort === 'ESG') return (
      <div className="flex flex-col gap-3 border-t border-white/[0.05] pt-3">
        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-white/20 block mb-2">IMPACTO MACRO NO ESG</span>
          <div className="flex flex-col gap-1.5">
            {[
              { fator: `PIB +${pib.toFixed(1)}%`, efeito: 'Crescimento gera arrecadação → mais recursos para social e infraestrutura', col: pib > 2 ? GREEN : AMBER },
              { fator: `IPCA ${ipca.toFixed(2)}%`, efeito: 'Inflação alta corrói salário real e aprofunda desigualdade → ESG Social negativo', col: ipca > 5 ? RED : AMBER },
              { fator: `USD R$${usd.toFixed(2)}`, efeito: 'Câmbio alto encarece equipamentos de energia limpa (painéis, turbinas importadas)', col: usd > 5.5 ? RED : AMBER },
              { fator: `SELIC ${selic.toFixed(1)}%`, efeito: 'Juros altos encarecem green bonds e projetos de longo prazo de sustentabilidade', col: selic > 12 ? RED : AMBER },
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="font-mono text-[8px] font-bold w-20 shrink-0 mt-0.5" style={{ color: r.col }}>{r.fator}</span>
                <span className="text-[9px] text-white/30 flex-1 leading-relaxed">{r.efeito}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-white/20 block mb-1.5">AGENDA ESG NO BRASIL</span>
          <div className="flex flex-col gap-1">
            {['Desmatamento zero: compromisso 2030 pressionando agro a se adaptar', 'B3 ESG Index: empresas listadas com critérios sustentáveis atraem mais capital externo', 'LGPD + ANPD: compliance de dados virou requisito ESG de Governança', 'Diversidade: pressão de investidores institucionais por metas mensuráveis'].map((o, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="font-mono text-[9px] shrink-0" style={{ color: GREEN }}>→</span>
                <span className="text-[9px] text-white/30">{o}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
    return null
  })()

  return (
    <div className="flex flex-col gap-4 px-4 pb-8">

      {/* Header */}
      <div className="flex items-center gap-2">
        <motion.div className="h-1.5 w-1.5 rounded-full bg-blue-400/60"
          animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-white/20">
          Macro & Micro — Agentes Econômicos
        </span>
      </div>

      {/* ── RODAS — largura total ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Roda 8D */}
        <div className="flex flex-col items-center w-full">
          <div className="flex items-center justify-between w-full mb-1 px-1">
            <span className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-white/25">8 Dimensões</span>
            {!manualLock && <span className="font-mono text-[6px] text-white/15 animate-pulse">AUTO</span>}
          </div>
          <MultidimRadial dimensions={dimensions} activeDim={activeDim} onSelect={handleDimSelect}
            marketScore={marketScore} scoreColor={scoreColor} scoreLabel={scoreLabel} />
          <div className="flex justify-center gap-1 mt-2">
            {dimensions.map((dim, i) => (
              <button key={i} onClick={() => handleDimSelect(i)}
                className="rounded-full transition-all duration-300 outline-none"
                style={{ width: activeDim === i ? 14 : 4, height: 4, background: activeDim === i ? dimColor(dim.status) : 'rgba(255,255,255,0.12)' }} />
            ))}
          </div>
        </div>
        {/* Roda Setores */}
        <div className="flex flex-col items-center w-full">
          <div className="flex items-center justify-between w-full mb-1 px-1">
            <span className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-white/25">Setores Heat</span>
            {!secLock && <span className="font-mono text-[6px] text-white/15 animate-pulse">AUTO</span>}
          </div>
          <SectorRadial sectors={sectors} activeSec={activeSec} onSelect={handleSecSelect}
            avgHeat={Math.round(sectors.reduce((a, s) => a + s.heat, 0) / sectors.length)} />
          <div className="flex justify-center gap-1 mt-2">
            {sectors.map((s, i) => (
              <button key={i} onClick={() => handleSecSelect(i)}
                className="rounded-full transition-all duration-300 outline-none"
                style={{ width: activeSec === i ? 14 : 4, height: 4, background: activeSec === i ? sectorColor(s.trend) : 'rgba(255,255,255,0.12)' }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── PAINEL 8D — largura total ── */}
      <AnimatePresence mode="wait">
        <DimDetailPanel key={activeDim} dim={dimensions[activeDim]} scoreColor={scoreColor} extra={dimExtra} />
      </AnimatePresence>

      {/* ── PAINEL SETORES — largura total ── */}
      <AnimatePresence mode="wait">
        <SectorDetailPanel key={activeSec} sector={sectors[activeSec]} ctx={sectorContext[sectors[activeSec].id]} />
      </AnimatePresence>

      {/* ── SIMULAÇÃO 6D ── */}
      <SimulacaoSection data={data} />

    </div>
  )
}
