'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const RED = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE = '#1a5276'

interface ScenarioOffsets { selic: number; ipca: number; pib: number; usd: number }

const SCENARIOS: { title: string; color: string; bg: string; offsets: ScenarioOffsets }[] = [
  { title: 'Cenário Pessimista', color: RED, bg: 'rgba(192,57,43,0.08)', offsets: { selic: 2, ipca: 1.5, pib: -1, usd: 0.8 } },
  { title: 'Cenário Realista', color: AMBER, bg: 'rgba(154,125,10,0.08)', offsets: { selic: 0, ipca: 0, pib: 0, usd: 0 } },
  { title: 'Cenário Otimista', color: GREEN, bg: 'rgba(30,132,73,0.08)', offsets: { selic: -2, ipca: -1, pib: 1, usd: -0.5 } },
]

function interpret(selic: number, ipca: number, pib: number, usd: number) {
  return {
    custo: `${(selic * 2.5).toFixed(1)}% a.a.`,
    poder: ipca > 4.75 ? 'caindo' : 'estável',
    demanda: pib > 2 ? 'crescendo' : pib > 0 ? 'fraca' : 'contraindo',
    importacao: `R$${usd.toFixed(2)} (${usd > 5.5 ? 'cara' : 'acessível'})`,
  }
}

function ImpactLine({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <p style={{ fontFamily: 'monospace', fontSize: 13, color: good === undefined ? '#aaa' : good ? GREEN : RED, margin: '2px 0' }}>
      {label}: <span style={{ fontWeight: 600 }}>{value}</span>
    </p>
  )
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

  const stressImpact = interpret(stress.selic, stress.ipca, stress.pib, stress.usd)
  const custoBaseline = base.selic * 2.5
  const custoDiff = stress.selic * 2.5 - custoBaseline
  const despesasDiff = ((stress.ipca / 100) * 120000).toFixed(0)
  const cambioDiffPct = (((stress.usd - base.usd) / base.usd) * 100).toFixed(1)

  async function analyzeWithAI() {
    setAiLoading(true)
    setAiResponse('')
    try {
      const prompt = `Analise este cenário: SELIC ${stress.selic}%, IPCA ${stress.ipca}%, PIB ${stress.pib}%, USD R$${stress.usd.toFixed(2)}. Compare com a base atual (SELIC ${base.selic}%, IPCA ${base.ipca}%, PIB ${base.pib}%, USD R$${base.usd.toFixed(2)}). Qual o impacto para uma empresa média? Quais ações tomar?`
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ color: '#e0e0e0', padding: 24 }}
    >
      {/* 1. Current Base */}
      <div style={{ background: 'rgba(26,82,118,0.12)', border: `1px solid ${BLUE}`, borderRadius: 10, padding: 16, marginBottom: 24 }}>
        <p style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          BASE ATUAL — dados reais do mercado
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

      {/* 2. Scenario Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 28 }}>
        {SCENARIOS.map((sc) => {
          const vals = {
            selic: +(base.selic + sc.offsets.selic).toFixed(2),
            ipca: +(base.ipca + sc.offsets.ipca).toFixed(2),
            pib: +(base.pib + sc.offsets.pib).toFixed(2),
            usd: +(base.usd + sc.offsets.usd).toFixed(2),
          }
          const imp = interpret(vals.selic, vals.ipca, vals.pib, vals.usd)
          return (
            <motion.div
              key={sc.title}
              whileHover={{ scale: 1.02 }}
              style={{ background: sc.bg, borderRadius: 10, borderTop: `3px solid ${sc.color}`, padding: 16 }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 700, color: sc.color, marginBottom: 10 }}>{sc.title}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
                <span style={{ fontSize: 13 }}>SELIC: <b>{vals.selic}%</b></span>
                <span style={{ fontSize: 13 }}>IPCA: <b>{vals.ipca}%</b></span>
                <span style={{ fontSize: 13 }}>PIB: <b>{vals.pib}%</b></span>
                <span style={{ fontSize: 13 }}>USD: <b>R${vals.usd.toFixed(2)}</b></span>
              </div>
              <div style={{ borderTop: `1px solid ${sc.color}33`, paddingTop: 8 }}>
                <ImpactLine label="Custo financeiro" value={imp.custo} />
                <ImpactLine label="Poder de compra" value={imp.poder} good={imp.poder === 'estável'} />
                <ImpactLine label="Demanda" value={imp.demanda} good={imp.demanda === 'crescendo'} />
                <ImpactLine label="Importação" value={imp.importacao} good={!imp.importacao.includes('cara')} />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* 3. Stress Test */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #333', borderRadius: 10, padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Stress Test — E se...?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {([
            { key: 'selic' as const, label: 'SELIC', min: 5, max: 20, step: 0.25, suffix: '%' },
            { key: 'ipca' as const, label: 'IPCA', min: 1, max: 12, step: 0.25, suffix: '%' },
            { key: 'pib' as const, label: 'PIB', min: -3, max: 6, step: 0.1, suffix: '%' },
            { key: 'usd' as const, label: 'USD', min: 4, max: 8, step: 0.1, suffix: '' },
          ]).map((s) => (
            <div key={s.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label style={{ fontSize: 13, color: '#ccc' }}>{s.label}</label>
                <span style={{ fontSize: 13, fontWeight: 700, color: BLUE }}>
                  {s.key === 'usd' ? `R$${stress[s.key].toFixed(2)}` : `${stress[s.key].toFixed(2)}${s.suffix}`}
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={stress[s.key]}
                onChange={(e) => setStress((prev) => ({ ...prev, [s.key]: parseFloat(e.target.value) }))}
                style={{ width: '100%', accentColor: BLUE }}
              />
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(26,82,118,0.1)', borderRadius: 8, padding: 14 }}>
          <p style={{ fontFamily: 'monospace', fontSize: 13, margin: '4px 0', color: custoDiff >= 0 ? RED : GREEN }}>
            Custo financeiro: {(stress.selic * 2.5).toFixed(1)}% a.a. ({custoDiff >= 0 ? '+' : ''}{custoDiff.toFixed(1)}pp vs atual)
          </p>
          <p style={{ fontFamily: 'monospace', fontSize: 13, margin: '4px 0', color: stress.ipca > base.ipca ? RED : GREEN }}>
            Inflação acumulada 12m: {stress.ipca.toFixed(2)}% → despesas sobem R${despesasDiff}
          </p>
          <p style={{ fontFamily: 'monospace', fontSize: 13, margin: '4px 0', color: stress.pib > 2 ? GREEN : stress.pib > 0 ? AMBER : RED }}>
            Demanda: PIB {stress.pib.toFixed(1)}% → {stressImpact.demanda}
          </p>
          <p style={{ fontFamily: 'monospace', fontSize: 13, margin: '4px 0', color: stress.usd > base.usd ? RED : GREEN }}>
            Câmbio: R${stress.usd.toFixed(2)} → importação {parseFloat(cambioDiffPct) >= 0 ? '+' : ''}{cambioDiffPct}% vs atual
          </p>
        </div>
      </div>

      {/* 4. AI Button */}
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
        {aiLoading ? 'Analisando...' : 'Analisar com IA'}
      </motion.button>

      {aiResponse && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ background: 'rgba(26,82,118,0.08)', border: `1px solid ${BLUE}33`, borderRadius: 8, padding: 16 }}
        >
          <p style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Resposta IA</p>
          <p style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{aiResponse}</p>
        </motion.div>
      )}
    </motion.div>
  )
}
