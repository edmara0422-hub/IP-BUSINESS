'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Tag, TrendingUp, AlertTriangle, Brain, Loader2, DollarSign, BarChart3, Target } from 'lucide-react'
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
export default function SmartPricing({ marketData }: { marketData: any }) {
  const { data, update } = useWorkspaceData('pricing', { custo: 80, preco: 150, unidades: 200, custosFixos: 15000, pctDolar: 20, margemDesejada: 30 })
  const custo = data.custo; const setCusto = (v: number) => update({ custo: v })
  const preco = data.preco; const setPreco = (v: number) => update({ preco: v })
  const unidades = data.unidades; const setUnidades = (v: number) => update({ unidades: v })
  const custosFixos = data.custosFixos; const setCustosFixos = (v: number) => update({ custosFixos: v })
  const pctDolar = data.pctDolar; const setPctDolar = (v: number) => update({ pctDolar: v })
  const margemDesejada = data.margemDesejada; const setMargemDesejada = (v: number) => update({ margemDesejada: v })
  const [iaLoading, setIaLoading] = useState(false)
  const [iaResponse, setIaResponse] = useState('')

  const ipcaRate = marketData?.macro?.ipca?.value ?? 4.14
  const usdRate = marketData?.macro?.usdBrl?.value ?? 4.98
  const cambioRef = 4.50

  const calc = useMemo(() => {
    const markup = custo > 0 ? ((preco - custo) / custo) * 100 : 0
    const margemBruta = preco > 0 ? ((preco - custo) / preco) * 100 : 0
    const receita = preco * unidades
    const lucroBruto = (preco - custo) * unidades
    const contribuicao = preco - custo
    const breakeven = contribuicao > 0 ? custosFixos / contribuicao : Infinity
    const margemSeguranca = unidades > 0 && isFinite(breakeven) ? ((unidades - breakeven) / unidades) * 100 : -100
    const custoReal = custo * (1 + (pctDolar / 100) * (usdRate / cambioRef - 1))
    const precoMinimo = margemDesejada < 100 ? custoReal / (1 - margemDesejada / 100) : custoReal * 10

    // Price points for chart
    const pMinBreakeven = contribuicao > 0 ? custo * 1.05 + custosFixos / (unidades || 1) : custoReal * 1.2
    const pCompetitivo = custo * 1.5
    const pAtual = preco
    const pEquilibrado = margemDesejada < 100 ? (custoReal * (1 + ipcaRate / 100)) / (1 - margemDesejada / 100) : custoReal * 2
    const pPremium = pEquilibrado * 1.15

    // Câmbio
    const custoBase = custo
    const custoAtualCambio = custoReal
    const cambioDiff = custoAtualCambio - custoBase
    const cambioPct = custoBase > 0 ? (cambioDiff / custoBase) * 100 : 0
    const margemAjustadaCambio = preco > 0 ? ((preco - custoAtualCambio) / preco) * 100 : 0

    // Elasticidade
    const precoUp10 = preco * 1.1
    const receitaUp10Full = precoUp10 * unidades
    const diffReceitaFull = receitaUp10Full - receita
    const volumeLoss15 = unidades * 0.85
    const receitaUp10Loss = precoUp10 * volumeLoss15
    const diffReceitaLoss = receitaUp10Loss - receita
    const precoOtimo = custoReal * 1.8

    // Recomendacao
    let precoRecomendado = pEquilibrado
    if (margemBruta < margemDesejada) precoRecomendado = Math.max(pEquilibrado, precoMinimo)
    if (margemBruta > margemDesejada + 15) precoRecomendado = pCompetitivo

    return {
      markup, margemBruta, receita, lucroBruto, breakeven, margemSeguranca,
      custoReal, precoMinimo,
      pMinBreakeven, pCompetitivo, pAtual, pEquilibrado, pPremium,
      custoBase, custoAtualCambio, cambioDiff, cambioPct, margemAjustadaCambio,
      precoUp10, diffReceitaFull, diffReceitaLoss, precoOtimo,
      precoRecomendado,
    }
  }, [custo, preco, unidades, pctDolar, custosFixos, margemDesejada, ipcaRate, usdRate])

  const metricCards = [
    { label: 'Markup', value: `${fmtDec(calc.markup)}%`, color: colorByRange(calc.markup, 50, 20), desc: '(preço-custo)/custo' },
    { label: 'Margem Bruta', value: `${fmtDec(calc.margemBruta)}%`, color: colorByRange(calc.margemBruta, 30, 15), desc: '(preço-custo)/preço' },
    { label: 'Receita Mensal', value: `R$${fmt(calc.receita)}`, color: BLUE, desc: 'preço × unidades' },
    { label: 'Lucro Bruto', value: `R$${fmt(calc.lucroBruto)}`, color: calc.lucroBruto >= 0 ? GREEN : RED, desc: '(preço-custo) × unid.' },
    { label: 'Breakeven', value: isFinite(calc.breakeven) ? `${fmt(Math.ceil(calc.breakeven))} un` : '---', color: AMBER, desc: 'custos fixos / contrib.' },
    { label: 'Margem Segurança', value: `${fmtDec(calc.margemSeguranca)}%`, color: colorByRange(calc.margemSeguranca, 30, 10), desc: 'folga acima do breakeven' },
    { label: 'Custo Real (c/ dólar)', value: `R$${fmtDec(calc.custoReal, 2)}`, color: calc.custoReal > custo ? AMBER : GREEN, desc: 'custo ajustado ao câmbio' },
    { label: 'Preço Mínimo', value: `R$${fmtDec(calc.precoMinimo, 2)}`, color: preco >= calc.precoMinimo ? GREEN : RED, desc: `p/ margem de ${margemDesejada}%` },
  ]

  const barData = [
    { label: 'Preço Mínimo', value: calc.pMinBreakeven },
    { label: 'Competitivo', value: calc.pCompetitivo },
    { label: 'Atual', value: calc.pAtual },
    { label: 'Equilibrado', value: calc.pEquilibrado },
    { label: 'Premium', value: calc.pPremium },
  ]
  const maxBar = Math.max(...barData.map(b => b.value), 1)
  const breakevenPrice = isFinite(calc.breakeven) && calc.breakeven > 0 ? custosFixos / (unidades || 1) + custo : custo

  const handleIA = async () => {
    setIaLoading(true)
    setIaResponse('')
    const question = `Analise pricing detalhado: custo unitário R$${fmtDec(custo,2)}, custo real (câmbio) R$${fmtDec(calc.custoReal,2)}, preço atual R$${fmtDec(preco,2)}, ${fmt(unidades)} un/mês, custos fixos R$${fmt(custosFixos)}, ${pctDolar}% custos em dólar. IPCA ${fmtDec(ipcaRate)}%, dólar R$${fmtDec(usdRate,2)}. Margem bruta atual ${fmtDec(calc.margemBruta)}%, desejada ${margemDesejada}%. Breakeven ${isFinite(calc.breakeven)?fmt(Math.ceil(calc.breakeven)):'N/A'} un. Preço mínimo R$${fmtDec(calc.precoMinimo,2)}, equilibrado R$${fmtDec(calc.pEquilibrado,2)}. Recomende a melhor estratégia de precificação.`
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

  const inputField = (label: string, value: number, setter: (v: number) => void, prefix = 'R$') => (
    <div className="flex flex-col gap-1">
      <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{label}</label>
      <div className="flex items-center gap-1 rounded-lg px-3 py-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{prefix}</span>
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

  const sliderField = (label: string, value: number, setter: (v: number) => void, min: number, max: number, suffix = '%') => (
    <div className="flex flex-col gap-1">
      <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{label}</label>
      <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <input type="range" min={min} max={max} value={value} onChange={e => setter(Number(e.target.value))}
          style={{ flex: 1, accentColor: BLUE, height: 4 }} />
        <span style={{ fontSize: 13, fontFamily: 'monospace', color: '#fff', minWidth: 40, textAlign: 'right' }}>{value}{suffix}</span>
      </div>
    </div>
  )

  const margemAtualIpca = calc.margemBruta
  const margemErodida = calc.margemBruta - ipcaRate
  const precoReajustado = preco * (1 + ipcaRate / 100)

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 p-4" style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>

      {/* 1. Product Input */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Tag size={16} style={{ color: BLUE }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Seu produto</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {inputField('Custo unitário (R$)', custo, setCusto)}
          {inputField('Preço atual (R$)', preco, setPreco)}
          {inputField('Unidades vendidas/mês', unidades, setUnidades, '#')}
          {inputField('Custos fixos/mês (R$)', custosFixos, setCustosFixos)}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {sliderField('% custos em dólar', pctDolar, setPctDolar, 0, 100)}
          {sliderField('Margem desejada (%)', margemDesejada, setMargemDesejada, 10, 80)}
        </div>
      </div>

      {/* 2. Pricing Dashboard */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} style={{ color: GREEN }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Pricing Dashboard</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {metricCards.map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }} className="rounded-lg p-3"
              style={{ background: 'rgba(0,0,0,0.3)', borderTop: `2px solid ${m.color}` }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{m.label}</div>
              <div className="truncate" style={{ fontSize: 16, fontWeight: 700, color: m.color, fontFamily: 'monospace', lineHeight: 1.2 }}>{m.value}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>{m.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. Simulador de Preco - SVG Bar Chart */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={16} style={{ color: AMBER }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Simulador de Preco</span>
        </div>
        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <svg viewBox="0 0 400 150" width="100%" height="150" style={{ overflow: 'visible' }}>
            {barData.map((bar, i) => {
              const y = i * 28 + 8
              const w = maxBar > 0 ? (bar.value / maxBar) * 240 : 0
              const isAtual = bar.label === 'Atual'
              const aboveBreakeven = bar.value >= breakevenPrice
              const barColor = aboveBreakeven ? GREEN : RED
              return (
                <g key={bar.label}>
                  <text x={0} y={y + 10} fill="rgba(255,255,255,0.5)" fontSize={11} fontFamily="monospace">{bar.label}</text>
                  <rect x={100} y={y} width={Math.max(w, 2)} height={12} rx={6} ry={6} fill={barColor} opacity={0.85}
                    stroke={isAtual ? '#fff' : 'none'} strokeWidth={isAtual ? 1.5 : 0} />
                  <text x={105 + w} y={y + 10} fill="rgba(255,255,255,0.7)" fontSize={11} fontFamily="monospace">
                    R${fmtDec(bar.value, 2)}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* 4. Market Impact */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} style={{ color: AMBER }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Impacto do Mercado</span>
        </div>
        <div className="flex flex-col gap-3">
          {/* IPCA Card */}
          <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: `3px solid ${ipcaRate > 4 ? AMBER : GREEN}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>IPCA {fmtDec(ipcaRate)}%</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
              Sem reajuste: margem cai de <span style={{ fontFamily: 'monospace', color: AMBER }}>{fmtDec(margemAtualIpca)}%</span> para <span style={{ fontFamily: 'monospace', color: RED }}>{fmtDec(margemErodida)}%</span> em 12 meses
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              Com reajuste IPCA: novo preco <span style={{ fontFamily: 'monospace', color: GREEN }}>R${fmtDec(precoReajustado, 2)}</span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              Diferenca: +R${fmtDec(preco * ipcaRate / 100, 2)}/unidade
            </div>
            {/* Mini margin erosion bar */}
            <div className="flex items-center gap-2 mt-2">
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Antes</span>
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${Math.max(margemErodida, 0)}%`, background: RED, borderRadius: 3 }} />
                <div style={{ width: `${Math.max(ipcaRate, 0)}%`, background: AMBER, borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Depois</span>
            </div>
          </div>

          {/* Cambio Card */}
          {pctDolar > 0 && (
            <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: `3px solid ${usdRate > 5.5 ? RED : GREEN}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                <DollarSign size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Cambio (USD R${fmtDec(usdRate, 2)})
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                Custo em R$4,50: <span style={{ fontFamily: 'monospace' }}>R${fmtDec(calc.custoBase, 2)}</span>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                Custo em R${fmtDec(usdRate, 2)}: <span style={{ fontFamily: 'monospace', color: AMBER }}>R${fmtDec(calc.custoAtualCambio, 2)}</span>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                Impacto: <span style={{ fontFamily: 'monospace', color: calc.cambioDiff > 0 ? RED : GREEN }}>+R${fmtDec(calc.cambioDiff, 2)}</span>/unidade (<span style={{ fontFamily: 'monospace' }}>{fmtDec(calc.cambioPct)}%</span>)
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                Margem real: <span style={{ fontFamily: 'monospace', color: colorByRange(calc.margemAjustadaCambio, 25, 10) }}>{fmtDec(calc.margemAjustadaCambio)}%</span>
              </div>
            </div>
          )}

          {/* Elasticidade Card */}
          <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: `3px solid ${BLUE}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Elasticidade</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
              Se subir 10% o preco (R${fmtDec(calc.precoUp10, 2)}):
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              Mantendo volume: receita <span style={{ fontFamily: 'monospace', color: GREEN }}>sobe R${fmt(calc.diffReceitaFull)}</span>/mes
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              Perdendo 15% volume: receita <span style={{ fontFamily: 'monospace', color: calc.diffReceitaLoss >= 0 ? GREEN : RED }}>
                {calc.diffReceitaLoss >= 0 ? 'sobe' : 'cai'} R${fmt(Math.abs(calc.diffReceitaLoss))}</span>/mes
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              Ponto otimo: maxima receita em ~<span style={{ fontFamily: 'monospace', color: BLUE }}>R${fmtDec(calc.precoOtimo, 2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Recomendacao IA */}
      <div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg p-4 mb-3"
          style={{ background: 'rgba(26,82,118,0.15)', border: `1px solid ${BLUE}` }}>
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} style={{ color: BLUE }} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Recomendacao</span>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
            Dado IPCA <span style={{ fontFamily: 'monospace', color: AMBER }}>{fmtDec(ipcaRate)}%</span>, cambio{' '}
            <span style={{ fontFamily: 'monospace', color: AMBER }}>R${fmtDec(usdRate, 2)}</span> e margem desejada{' '}
            <span style={{ fontFamily: 'monospace', color: AMBER }}>{margemDesejada}%</span>, recomendo preco{' '}
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: GREEN, fontSize: 15 }}>R${fmtDec(calc.precoRecomendado, 2)}</span>
          </div>
        </motion.div>

        <button onClick={handleIA} disabled={iaLoading}
          className="w-full rounded-lg py-3 flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: BLUE, color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: iaLoading ? 'wait' : 'pointer' }}>
          {iaLoading ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
          {iaLoading ? 'Analisando...' : 'Analisar com IA'}
        </button>

        {iaResponse && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-lg p-4 mt-3"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.75)' }}>
            {iaResponse}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
