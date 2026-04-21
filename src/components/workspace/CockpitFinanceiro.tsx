'use client'

import { useMemo } from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, TrendingUp, AlertTriangle, Brain, Loader2 } from 'lucide-react'
import { useWorkspaceData } from '@/hooks/useWorkspaceData'

const RED = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE = '#1a5276'

function fmt(v: number): string {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function fmtDec(v: number, d = 1): string {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d })
}

function colorByRange(value: number, greenAbove: number, amberAbove: number): string {
  if (value >= greenAbove) return GREEN
  if (value >= amberAbove) return AMBER
  return RED
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CockpitFinanceiro({ marketData }: { marketData: any }) {
  const { data, update } = useWorkspaceData('cockpit', { receita: 50000, despesas: 35000, caixa: 120000, cac: 45 })
  const receita = data.receita; const setReceita = (v: number) => update({ receita: v })
  const despesas = data.despesas; const setDespesas = (v: number) => update({ despesas: v })
  const caixa = data.caixa; const setCaixa = (v: number) => update({ caixa: v })
  const cac = data.cac; const setCac = (v: number) => update({ cac: v })
  const [iaLoading, setIaLoading] = useState(false)
  const [iaResponse, setIaResponse] = useState('')

  const metrics = useMemo(() => {
    const margemDecimal = receita > 0 ? (receita - despesas) / receita : 0
    const margem = margemDecimal * 100
    const lucro = receita - despesas
    const runway = despesas > 0 ? caixa / despesas : 99
    const ltvCac = cac > 0 ? ((receita / cac) * 12) / cac : 0
    const burnRatio = receita > 0 ? 1 - despesas / receita : 0
    const runwayNorm = Math.min(runway / 12, 1) * 100
    const ltvCacNorm = Math.min(ltvCac / 5, 1) * 100
    const burnNorm = Math.max(burnRatio, 0) * 100
    const healthScore = Math.round(margem * 0.3 + runwayNorm * 0.3 + ltvCacNorm * 0.2 + burnNorm * 0.2)
    const breakeven = margemDecimal > 0 ? despesas / margemDecimal : 0
    const roi = caixa > 0 ? (lucro * 12) / caixa * 100 : 0

    return { margem, lucro, runway, healthScore, ltvCac, breakeven, roi }
  }, [receita, despesas, caixa, cac])

  const selicRate = marketData?.macro?.selic?.value ?? 13.75
  const ipcaRate = marketData?.macro?.ipca?.value ?? 4.5
  const usdRate = marketData?.macro?.usdBrl?.value ?? 5.72

  const metricCards = [
    { label: 'Margem', value: `${fmtDec(metrics.margem)}%`, color: colorByRange(metrics.margem, 20, 10), desc: '(receita - despesas) / receita' },
    { label: 'Lucro Mensal', value: `R$${fmt(metrics.lucro)}`, color: metrics.lucro >= 0 ? GREEN : RED, desc: 'Receita menos despesas operacionais' },
    { label: 'Runway', value: `${fmtDec(metrics.runway)} meses`, color: colorByRange(metrics.runway, 6, 3), desc: 'Caixa dividido por despesas mensais' },
    { label: 'Health Score', value: `${metrics.healthScore}/100`, color: colorByRange(metrics.healthScore, 70, 40), desc: 'Score ponderado de saúde financeira' },
    { label: 'Burn Rate', value: `R$${fmt(despesas)}/mês`, color: AMBER, desc: 'Total de despesas operacionais mensais' },
    { label: 'LTV/CAC', value: `${fmtDec(metrics.ltvCac)}x`, color: colorByRange(metrics.ltvCac, 3, 1), desc: 'Retorno sobre custo de aquisição' },
    { label: 'Break-even', value: `R$${fmt(metrics.breakeven)}`, color: BLUE, desc: 'Receita necessária para cobrir despesas' },
    { label: 'ROI Anualizado', value: `${fmtDec(metrics.roi)}%`, color: metrics.roi >= 0 ? GREEN : RED, desc: 'Retorno sobre capital investido (anual)' },
  ]

  const handleIA = async () => {
    setIaLoading(true)
    setIaResponse('')
    const question = `Analise estes dados financeiros: Receita R$${fmt(receita)}, Despesas R$${fmt(despesas)}, Caixa R$${fmt(caixa)}, CAC R$${fmt(cac)}, Margem ${fmtDec(metrics.margem)}%, Runway ${fmtDec(metrics.runway)} meses, Health Score ${metrics.healthScore}. Dê um diagnóstico e 3 ações prioritárias.`
    try {
      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: question }] }),
      })
      const data = await res.json()
      setIaResponse(data.response ?? data.content ?? 'Sem resposta da IA.')
    } catch {
      setIaResponse('Erro ao conectar com a IA. Tente novamente.')
    } finally {
      setIaLoading(false)
    }
  }

  const inputField = (label: string, value: number, setter: (v: number) => void) => (
    <div className="flex flex-col gap-1">
      <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{label}</label>
      <div className="flex items-center gap-1 rounded-lg px-3 py-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>R$</span>
        <input
          type="number"
          value={value}
          onChange={e => setter(Number(e.target.value) || 0)}
          className="bg-transparent outline-none w-full"
          style={{ fontSize: 14, fontFamily: 'monospace', color: '#fff', border: 'none' }}
        />
      </div>
    </div>
  )

  const selicFinancing = (despesas * (selicRate * 2.5 / 100)) / 12
  const despesasInflated = despesas * (1 + ipcaRate / 100)
  const cambioRef = 4.50
  const cambioDiff = ((usdRate - cambioRef) / cambioRef) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 p-4"
      style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}
    >
      {/* 1. Inputs */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calculator size={16} style={{ color: BLUE }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Seus dados</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {inputField('Receita Mensal (R$)', receita, setReceita)}
          {inputField('Despesas Operacionais (R$)', despesas, setDespesas)}
          {inputField('Caixa Disponível (R$)', caixa, setCaixa)}
          {inputField('CAC (R$)', cac, setCac)}
        </div>
      </div>

      {/* 2. Calculated Metrics */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} style={{ color: GREEN }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Indicadores calculados</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metricCards.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg p-3"
              style={{ background: 'rgba(0,0,0,0.3)', borderTop: `2px solid ${m.color}` }}
            >
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{m.label}</div>
              <div className="truncate" style={{ fontSize: 16, fontWeight: 700, color: m.color, fontFamily: 'monospace', lineHeight: 1.2 }}>{m.value}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4, lineHeight: 1.3 }}>{m.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. Market Impact */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} style={{ color: AMBER }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Como o mercado afeta seus números</span>
        </div>
        <div className="flex flex-col gap-3">
          {/* SELIC */}
          <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: `3px solid ${selicRate > 12 ? RED : GREEN}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Impacto SELIC</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              Custo de financiamento: SELIC {fmtDec(selicRate)}% × 2.5 = {fmtDec(selicRate * 2.5)}% a.a.
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              Se você financiar R${fmt(despesas)}, paga R${fmt(Math.round(selicFinancing))}/mês de juros
            </div>
          </div>

          {/* IPCA */}
          <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: `3px solid ${ipcaRate > 4 ? AMBER : GREEN}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Impacto IPCA</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              Inflação corroendo margem: IPCA {fmtDec(ipcaRate)}%
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              Suas despesas em 12 meses serão R${fmt(Math.round(despesasInflated))} (+R${fmt(Math.round(despesas * ipcaRate / 100))}/mês)
            </div>
          </div>

          {/* Câmbio */}
          <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: `3px solid ${usdRate > 5.5 ? RED : GREEN}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Impacto Câmbio</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              Se tem custos em dólar: R${fmtDec(usdRate, 2)} × custo USD = custo BRL
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              Câmbio {fmtDec(Math.abs(cambioDiff))}% {cambioDiff >= 0 ? 'mais alto' : 'mais baixo'} que R$4,50 de referência
            </div>
          </div>
        </div>
      </div>

      {/* 4. IA Analysis */}
      <div>
        <button
          onClick={handleIA}
          disabled={iaLoading}
          className="w-full rounded-lg py-3 flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: BLUE, color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: iaLoading ? 'wait' : 'pointer' }}
        >
          {iaLoading ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
          {iaLoading ? 'Analisando...' : 'Analisar com IA'}
        </button>

        {iaResponse && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg p-4 mt-3"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.75)' }}
          >
            {iaResponse}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
