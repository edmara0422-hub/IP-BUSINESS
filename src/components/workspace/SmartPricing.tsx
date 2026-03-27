'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Tag, TrendingUp, AlertTriangle, Brain, Loader2, DollarSign } from 'lucide-react'

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
  const [custo, setCusto] = useState(80)
  const [preco, setPreco] = useState(150)
  const [unidades, setUnidades] = useState(200)
  const [pctDolar, setPctDolar] = useState(20)
  const [custosFixos, setCustosFixos] = useState(15000)
  const [iaLoading, setIaLoading] = useState(false)
  const [iaResponse, setIaResponse] = useState('')

  const ipcaRate = marketData?.macro?.ipca?.value ?? 4.5
  const usdRate = marketData?.macro?.usdBrl?.value ?? 5.72
  const cambioRef = 4.50

  const metrics = useMemo(() => {
    const markup = custo > 0 ? ((preco - custo) / custo) * 100 : 0
    const margem = preco > 0 ? ((preco - custo) / preco) * 100 : 0
    const receita = preco * unidades
    const lucroBruto = (preco - custo) * unidades
    const contribuicao = preco - custo
    const breakeven = contribuicao > 0 ? custosFixos / contribuicao : 0
    const margemSeguranca = unidades > 0 ? ((unidades - breakeven) / unidades) * 100 : 0

    // Câmbio impact
    const custoDolarRef = custo * (pctDolar / 100) * (1) // base at R$4.50
    const custoNacional = custo * (1 - pctDolar / 100)
    const custoComDolarRef = custoNacional + custoDolarRef
    const fatorCambio = usdRate / cambioRef
    const custoComDolarAtual = custoNacional + custo * (pctDolar / 100) * fatorCambio
    const cambioDiff = custoComDolarAtual - custoComDolarRef
    const cambioDiffPct = custoComDolarRef > 0 ? (cambioDiff / custoComDolarRef) * 100 : 0

    // Suggested prices
    const precoCompetitivo = preco * (1 + ipcaRate / 200)
    const precoEquilibrado = preco * (1 + ipcaRate / 100)
    const precoPremium = preco * (1 + ipcaRate / 100 + 0.05)

    return {
      markup, margem, receita, lucroBruto, breakeven, margemSeguranca,
      custoComDolarRef, custoComDolarAtual, cambioDiff, cambioDiffPct,
      precoCompetitivo, precoEquilibrado, precoPremium,
    }
  }, [custo, preco, unidades, pctDolar, custosFixos, ipcaRate, usdRate])

  const metricCards = [
    { label: 'Markup', value: `${fmtDec(metrics.markup)}%`, color: colorByRange(metrics.markup, 50, 20), desc: 'quanto acima do custo' },
    { label: 'Margem Bruta', value: `${fmtDec(metrics.margem)}%`, color: colorByRange(metrics.margem, 30, 15), desc: '% que sobra da venda' },
    { label: 'Receita Mensal', value: `R$${fmt(metrics.receita)}`, color: BLUE, desc: 'preço × unidades' },
    { label: 'Lucro Bruto', value: `R$${fmt(metrics.lucroBruto)}`, color: metrics.lucroBruto >= 0 ? GREEN : RED, desc: '(preço - custo) × unidades' },
    { label: 'Ponto de Equilíbrio', value: `${fmt(Math.ceil(metrics.breakeven))} un`, color: AMBER, desc: 'unidades p/ cobrir custos fixos' },
    { label: 'Margem de Segurança', value: `${fmtDec(metrics.margemSeguranca)}%`, color: colorByRange(metrics.margemSeguranca, 30, 10), desc: 'folga acima do break-even' },
  ]

  const margemAjustada = metrics.margem - ipcaRate
  const precoReajustado = preco * (1 + ipcaRate / 100)
  const diffReajuste = preco * (ipcaRate / 100)

  const suggestedPrices = [
    {
      label: 'Competitivo',
      price: metrics.precoCompetitivo,
      desc: 'Absorve metade da inflação',
      color: GREEN,
      markup: custo > 0 ? ((metrics.precoCompetitivo - custo) / custo) * 100 : 0,
      margem: metrics.precoCompetitivo > 0 ? ((metrics.precoCompetitivo - custo) / metrics.precoCompetitivo) * 100 : 0,
    },
    {
      label: 'Equilibrado',
      price: metrics.precoEquilibrado,
      desc: 'Repassa inflação total',
      color: AMBER,
      markup: custo > 0 ? ((metrics.precoEquilibrado - custo) / custo) * 100 : 0,
      margem: metrics.precoEquilibrado > 0 ? ((metrics.precoEquilibrado - custo) / metrics.precoEquilibrado) * 100 : 0,
    },
    {
      label: 'Premium',
      price: metrics.precoPremium,
      desc: 'Repassa + margem extra 5%',
      color: GREEN,
      markup: custo > 0 ? ((metrics.precoPremium - custo) / custo) * 100 : 0,
      margem: metrics.precoPremium > 0 ? ((metrics.precoPremium - custo) / metrics.precoPremium) * 100 : 0,
    },
  ]

  const handleIA = async () => {
    setIaLoading(true)
    setIaResponse('')
    const question = `Meu produto custa R$${fmt(custo)}, vendo a R$${fmt(preco)}, ${fmt(unidades)} unidades/mês. ${pctDolar}% dos custos são em dólar. IPCA está em ${fmtDec(ipcaRate)}%, dólar R$${fmtDec(usdRate, 2)}. Devo reajustar preço? Qual preço ideal? Qual estratégia de pricing?`
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 p-4"
      style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}
    >
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
          {inputField('% custos em dólar', pctDolar, setPctDolar, '%')}
          {inputField('Custos fixos/mês (R$)', custosFixos, setCustosFixos)}
        </div>
      </div>

      {/* 2. Calculated Metrics */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} style={{ color: GREEN }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Indicadores de pricing</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
          <span style={{ fontSize: 14, fontWeight: 600 }}>Como o mercado afeta seu preço</span>
        </div>
        <div className="flex flex-col gap-3">
          {/* IPCA Impact */}
          <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: `3px solid ${ipcaRate > 4 ? AMBER : GREEN}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Inflação: IPCA {fmtDec(ipcaRate)}%</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              Se não reajustar: sua margem cai de <span style={{ fontFamily: 'monospace', color: AMBER }}>{fmtDec(metrics.margem)}%</span> para <span style={{ fontFamily: 'monospace', color: RED }}>{fmtDec(margemAjustada)}%</span> em 12 meses
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
              Preço sugerido com reajuste: <span style={{ fontFamily: 'monospace', color: GREEN }}>R${fmtDec(precoReajustado, 2)}</span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
              +R${fmtDec(diffReajuste, 2)} por unidade
            </div>
          </div>

          {/* Câmbio Impact */}
          {pctDolar > 0 && (
            <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: `3px solid ${usdRate > 5.5 ? RED : GREEN}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                <DollarSign size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Dólar: R${fmtDec(usdRate, 2)}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                Com {pctDolar}% dos custos em dólar, seu custo real é <span style={{ fontFamily: 'monospace', color: AMBER }}>R${fmtDec(metrics.custoComDolarAtual, 2)}</span>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                Custo base (R$4,50): <span style={{ fontFamily: 'monospace' }}>R${fmtDec(metrics.custoComDolarRef, 2)}</span> → Custo atual: <span style={{ fontFamily: 'monospace', color: RED }}>R${fmtDec(metrics.custoComDolarAtual, 2)}</span>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                Diferença: <span style={{ fontFamily: 'monospace', color: metrics.cambioDiff > 0 ? RED : GREEN }}>+R${fmtDec(metrics.cambioDiff, 2)}</span> por unidade (<span style={{ fontFamily: 'monospace' }}>{fmtDec(metrics.cambioDiffPct)}%</span>)
              </div>
            </div>
          )}

          {/* Suggested Prices */}
          <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: `3px solid ${GREEN}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Preço sugerido</div>
            <div className="grid grid-cols-3 gap-2">
              {suggestedPrices.map(s => (
                <div key={s.label} className="rounded-lg p-2" style={{ background: 'rgba(0,0,0,0.25)', borderTop: `2px solid ${s.color}` }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'monospace', color: s.color }}>R${fmtDec(s.price, 2)}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{s.desc}</div>
                  <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                    Markup {fmtDec(s.markup)}% · Margem {fmtDec(s.margem)}%
                  </div>
                </div>
              ))}
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
