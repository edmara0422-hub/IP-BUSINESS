'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

const RED = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE = '#1a5276'

interface SliderConfig {
  key: 'selic' | 'ipca' | 'pib' | 'usd'
  label: string
  min: number
  max: number
  step: number
  suffix: string
  greenMax: number
  amberMax: number
  impactText: (val: number) => string
}

const SLIDER_CONFIGS: SliderConfig[] = [
  {
    key: 'selic', label: 'SELIC', min: 5, max: 20, step: 0.25, suffix: '%',
    greenMax: 10, amberMax: 13,
    impactText: (val) => `Financiamento: ${(val * 2.5).toFixed(1)}% a.a. → ${val > 13 ? 'PMEs sem crédito' : 'crédito acessível'}`,
  },
  {
    key: 'ipca', label: 'IPCA', min: 1, max: 12, step: 0.25, suffix: '%',
    greenMax: 4, amberMax: 5,
    impactText: (val) => `Poder de compra: ${val > 5 ? 'caindo rápido' : 'controlado'}`,
  },
  {
    key: 'pib', label: 'PIB', min: -3, max: 6, step: 0.1, suffix: '%',
    greenMax: 6, amberMax: 2,
    impactText: (val) => `Demanda: ${val > 2 ? 'expandindo' : val > 0 ? 'fraca' : 'contraindo'}`,
  },
  {
    key: 'usd', label: 'USD', min: 4, max: 8, step: 0.1, suffix: '',
    greenMax: 5.3, amberMax: 6,
    impactText: (val) => `Importação: ${val > 6 ? 'muito cara' : val > 5.3 ? 'cara' : 'acessível'}`,
  },
]

const PRESETS: { label: string; values: { selic: number; ipca: number; pib: number; usd: number } }[] = [
  { label: 'SELIC vai a 16%', values: { selic: 16, ipca: 0, pib: 0, usd: 0 } },
  { label: 'Câmbio bate R$7', values: { selic: 0, ipca: 0, pib: 0, usd: 7 } },
  { label: 'Recessão (PIB -2%)', values: { selic: 15, ipca: 0, pib: -2, usd: 0 } },
  { label: 'Cenário ideal', values: { selic: 9, ipca: 3, pib: 4, usd: 4.5 } },
]

function calcHealth(selic: number, ipca: number, pib: number, usd: number) {
  return Math.min(95, Math.max(10, 50 + pib * 5 - (selic - 10) * 3 - (ipca - 3) * 4 - (usd - 5) * 2))
}

function sliderColor(val: number, cfg: SliderConfig) {
  if (cfg.key === 'pib') {
    if (val > cfg.amberMax) return GREEN
    if (val > 0) return AMBER
    return RED
  }
  if (val <= cfg.greenMax) return GREEN
  if (val <= cfg.amberMax) return AMBER
  return RED
}

function formatVal(key: string, val: number) {
  if (key === 'usd') return `R$${val.toFixed(2)}`
  return `${val.toFixed(2)}%`
}

// Seeded random for consistent chart noise
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

export default function CenariosForecast({ marketData }: { marketData: any }) {
  const base = {
    selic: marketData?.macro?.selic?.value ?? 13.75,
    ipca: marketData?.macro?.ipca?.value ?? 4.5,
    pib: marketData?.macro?.pib?.value ?? 2.0,
    usd: marketData?.macro?.usdBrl?.value ?? 5.2,
  }

  const [stress, setStress] = useState({ ...base })
  const [aiResponse, setAiResponse] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const health = calcHealth(stress.selic, stress.ipca, stress.pib, stress.usd)

  // Chart data
  const chartData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1)
    return months.map((m) => {
      const noise = (seed: number) => (seededRandom(m * 100 + seed) - 0.5) * 6
      const realista = Math.min(95, Math.max(10, health + noise(1)))
      const pessimista = Math.min(95, Math.max(10, health * 0.7 + noise(2)))
      const otimista = Math.min(95, Math.max(10, health * 1.3 + noise(3)))
      return { month: m, pessimista, realista, otimista }
    })
  }, [health])

  // Scenario table rows
  const scenarios = [
    { name: 'Pessimista', color: RED, bg: 'rgba(192,57,43,0.10)', selic: stress.selic + 2, ipca: stress.ipca + 1.5, pib: stress.pib - 1, usd: stress.usd + 0.8 },
    { name: 'Realista', color: AMBER, bg: 'rgba(154,125,10,0.10)', selic: stress.selic, ipca: stress.ipca, pib: stress.pib, usd: stress.usd },
    { name: 'Otimista', color: GREEN, bg: 'rgba(30,132,73,0.10)', selic: stress.selic - 2, ipca: stress.ipca - 1, pib: stress.pib + 1, usd: stress.usd - 0.5 },
  ]

  function demandaText(pib: number) {
    return pib > 2 ? 'Expandindo' : pib > 0 ? 'Fraca' : 'Contraindo'
  }
  function importText(usd: number) {
    return usd > 6 ? 'Muito cara' : usd > 5.3 ? 'Cara' : 'Acessível'
  }

  function applyPreset(p: typeof PRESETS[0]) {
    setStress({
      selic: p.values.selic || stress.selic,
      ipca: p.values.ipca || stress.ipca,
      pib: p.values.pib !== 0 ? p.values.pib : (p.label === 'Cenário ideal' ? p.values.pib : stress.pib),
      usd: p.values.usd || stress.usd,
    })
    // Special cases: full overwrite for presets that set all values
    if (p.label === 'Cenário ideal') {
      setStress(p.values)
    }
    if (p.label === 'Recessão (PIB -2%)') {
      setStress((prev) => ({ ...prev, selic: 15, pib: -2 }))
    }
    if (p.label === 'SELIC vai a 16%') {
      setStress((prev) => ({ ...prev, selic: 16 }))
    }
    if (p.label === 'Câmbio bate R$7') {
      setStress((prev) => ({ ...prev, usd: 7 }))
    }
  }

  async function analyzeWithAI() {
    setAiLoading(true)
    setAiResponse('')
    try {
      const projData = chartData.map((d) => `Mês ${d.month}: Pess=${d.pessimista.toFixed(0)}, Real=${d.realista.toFixed(0)}, Otim=${d.otimista.toFixed(0)}`).join('; ')
      const prompt = `Analise este cenário macroeconômico para uma empresa média brasileira:

CENÁRIO AJUSTADO: SELIC ${stress.selic}%, IPCA ${stress.ipca}%, PIB ${stress.pib}%, USD R$${stress.usd.toFixed(2)}.
BASE ATUAL: SELIC ${base.selic}%, IPCA ${base.ipca}%, PIB ${base.pib}%, USD R$${base.usd.toFixed(2)}.

PROJEÇÃO 12 MESES (Índice de Saúde Empresarial 0-100):
${projData}

Cenário Pessimista: SELIC ${(stress.selic + 2).toFixed(1)}%, IPCA ${(stress.ipca + 1.5).toFixed(1)}%, PIB ${(stress.pib - 1).toFixed(1)}%, USD R$${(stress.usd + 0.8).toFixed(2)}
Cenário Otimista: SELIC ${(stress.selic - 2).toFixed(1)}%, IPCA ${(stress.ipca - 1).toFixed(1)}%, PIB ${(stress.pib + 1).toFixed(1)}%, USD R$${(stress.usd - 0.5).toFixed(2)}

Faça uma análise estratégica considerando:
1. Impacto no custo de financiamento
2. Impacto na demanda e receita
3. Risco cambial para importações
4. Recomendações práticas (3-5 ações concretas)
5. Janela de oportunidade se houver`
      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      })
      const data = await res.json()
      setAiResponse(data.response || data.message || 'Sem resposta.')
    } catch {
      setAiResponse('Erro ao consultar IA.')
    } finally {
      setAiLoading(false)
    }
  }

  // SVG chart helpers
  const chartW = 600
  const chartH = 200
  const padL = 36
  const padR = 12
  const padT = 12
  const padB = 28
  const plotW = chartW - padL - padR
  const plotH = chartH - padT - padB

  function toX(month: number) { return padL + ((month - 1) / 11) * plotW }
  function toY(val: number) { return padT + plotH - (val / 100) * plotH }

  function polyline(data: { month: number; val: number }[]) {
    return data.map((d) => `${toX(d.month).toFixed(1)},${toY(d.val).toFixed(1)}`).join(' ')
  }

  const sty = {
    section: { marginBottom: 24 } as React.CSSProperties,
    sectionTitle: { fontSize: 14, fontWeight: 700 as const, color: '#fff', marginBottom: 12, textTransform: 'uppercase' as const, letterSpacing: 1 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ color: '#e0e0e0', padding: 24 }}
    >
      {/* 1. Base Atual */}
      <div style={{ background: 'rgba(26,82,118,0.12)', border: `1px solid ${BLUE}`, borderRadius: 10, padding: 16, marginBottom: 24 }}>
        <p style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Base Atual — dados reais do mercado
        </p>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {[
            { label: 'SELIC', val: `${base.selic}%` },
            { label: 'IPCA', val: `${base.ipca}%` },
            { label: 'PIB', val: `${base.pib}%` },
            { label: 'USD', val: `R$${base.usd.toFixed(2)}` },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 12, color: '#999' }}>{item.label}</span>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>{item.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. "E se..." Quick Scenarios — placed before sliders for UX */}
      <div style={{ ...sty.section }}>
        <p style={{ ...sty.sectionTitle, fontSize: 12 }}>E se...</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PRESETS.map((p) => (
            <motion.button
              key={p.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => applyPreset(p)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.04)',
                color: '#ccc',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {p.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 2. Stress Test Sliders */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #333', borderRadius: 10, padding: 20, marginBottom: 24 }}>
        <h3 style={{ ...sty.sectionTitle, marginBottom: 16 }}>Stress Test</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
          {SLIDER_CONFIGS.map((cfg) => {
            const val = stress[cfg.key]
            const baseVal = base[cfg.key]
            const color = sliderColor(val, cfg)
            const pct = ((val - cfg.min) / (cfg.max - cfg.min)) * 100
            return (
              <div key={cfg.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <label style={{ fontSize: 13, color: '#ccc', fontWeight: 600 }}>{cfg.label}</label>
                  <div style={{ fontSize: 13, display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <span style={{ color: '#666', fontSize: 11 }}>base {formatVal(cfg.key, baseVal)}</span>
                    <span style={{ fontWeight: 700, color, fontSize: 15 }}>{formatVal(cfg.key, val)}</span>
                  </div>
                </div>
                <div style={{ position: 'relative', height: 6, borderRadius: 3, background: '#222', marginBottom: 6 }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 3, width: `${pct}%`, background: color, opacity: 0.7, transition: 'all 0.15s' }} />
                  <input
                    type="range"
                    min={cfg.min}
                    max={cfg.max}
                    step={cfg.step}
                    value={val}
                    onChange={(e) => setStress((prev) => ({ ...prev, [cfg.key]: parseFloat(e.target.value) }))}
                    style={{ position: 'absolute', top: -6, left: 0, width: '100%', height: 18, opacity: 0, cursor: 'pointer' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: -4,
                      left: `${pct}%`,
                      transform: 'translateX(-50%)',
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: color,
                      border: '2px solid #fff',
                      transition: 'left 0.15s',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
                <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#888', margin: 0, lineHeight: 1.4 }}>
                  {cfg.impactText(val)}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. Projecao 12 Meses SVG Chart */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #333', borderRadius: 10, padding: 20, marginBottom: 24 }}>
        <h3 style={{ ...sty.sectionTitle, marginBottom: 16 }}>Projecao 12 Meses — Indice de Saude Empresarial</h3>
        <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', height: 'auto' }}>
          {/* Gridlines */}
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line x1={padL} y1={toY(v)} x2={chartW - padR} y2={toY(v)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              <text x={padL - 4} y={toY(v) + 4} fill="#666" fontSize={9} textAnchor="end">{v}</text>
            </g>
          ))}
          {/* X axis labels */}
          {chartData.map((d) => (
            <text key={d.month} x={toX(d.month)} y={chartH - 6} fill="#666" fontSize={9} textAnchor="middle">
              {d.month}
            </text>
          ))}
          {/* Lines */}
          <polyline points={polyline(chartData.map((d) => ({ month: d.month, val: d.pessimista })))} fill="none" stroke={RED} strokeWidth={2} strokeLinejoin="round" />
          <polyline points={polyline(chartData.map((d) => ({ month: d.month, val: d.realista })))} fill="none" stroke={AMBER} strokeWidth={2} strokeLinejoin="round" />
          <polyline points={polyline(chartData.map((d) => ({ month: d.month, val: d.otimista })))} fill="none" stroke={GREEN} strokeWidth={2} strokeLinejoin="round" />
          {/* Dots at endpoints */}
          {[
            { val: chartData[11].pessimista, color: RED },
            { val: chartData[11].realista, color: AMBER },
            { val: chartData[11].otimista, color: GREEN },
          ].map((d, i) => (
            <circle key={i} cx={toX(12)} cy={toY(d.val)} r={3} fill={d.color} />
          ))}
        </svg>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 8 }}>
          {[
            { label: 'Pessimista', color: RED },
            { label: 'Realista', color: AMBER },
            { label: 'Otimista', color: GREEN },
          ].map((l) => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
              <span style={{ fontSize: 11, color: '#aaa' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Tabela de Impacto */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #333', borderRadius: 10, padding: 20, marginBottom: 24, overflowX: 'auto' }}>
        <h3 style={{ ...sty.sectionTitle, marginBottom: 16 }}>Tabela de Impacto</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Cenario', 'SELIC', 'IPCA', 'PIB', 'USD', 'Financiamento', 'Demanda', 'Importacao'].map((h) => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#888', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scenarios.map((sc) => (
              <tr key={sc.name} style={{ background: sc.bg }}>
                <td style={{ padding: '10px', fontWeight: 700, color: sc.color, borderLeft: `3px solid ${sc.color}`, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {sc.name}
                </td>
                <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{sc.selic.toFixed(1)}%</td>
                <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{sc.ipca.toFixed(1)}%</td>
                <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{sc.pib.toFixed(1)}%</td>
                <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>R${sc.usd.toFixed(2)}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontFamily: 'monospace' }}>{(sc.selic * 2.5).toFixed(1)}% a.a.</td>
                <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: sc.pib > 2 ? GREEN : sc.pib > 0 ? AMBER : RED }}>{demandaText(sc.pib)}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: sc.usd > 6 ? RED : sc.usd > 5.3 ? AMBER : GREEN }}>{importText(sc.usd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 6. IA Analysis */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={analyzeWithAI}
        disabled={aiLoading}
        style={{
          width: '100%',
          padding: '12px 0',
          borderRadius: 8,
          border: `1px solid ${BLUE}`,
          background: `${BLUE}22`,
          color: '#fff',
          fontWeight: 700,
          fontSize: 14,
          cursor: aiLoading ? 'wait' : 'pointer',
          marginBottom: 16,
        }}
      >
        {aiLoading ? 'Analisando cenarios...' : 'Analisar Cenarios com IA'}
      </motion.button>

      {aiResponse && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ background: 'rgba(26,82,118,0.08)', border: `1px solid ${BLUE}33`, borderRadius: 8, padding: 16 }}
        >
          <p style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Analise IA — Cenarios & Forecast</p>
          <p style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{aiResponse}</p>
        </motion.div>
      )}
    </motion.div>
  )
}
