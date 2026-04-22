'use client'

import { useMemo, useRef } from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, TrendingUp, AlertTriangle, Brain, Loader2, FileDown } from 'lucide-react'
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

const PHASE_DEFAULTS: Record<string, { receita: number; despesas: number; caixa: number; cac: number; ticketMedio: number; churnMensal: number }> = {
  validacao: { receita: 0, despesas: 0, caixa: 0, cac: 0, ticketMedio: 0, churnMensal: 0 },
  mei:       { receita: 0, despesas: 0, caixa: 0, cac: 0, ticketMedio: 0, churnMensal: 0 },
  slu:       { receita: 0, despesas: 0, caixa: 0, cac: 0, ticketMedio: 0, churnMensal: 0 },
  startup:   { receita: 0, despesas: 0, caixa: 0, cac: 0, ticketMedio: 0, churnMensal: 0 },
  ltda:      { receita: 0, despesas: 0, caixa: 0, cac: 0, ticketMedio: 0, churnMensal: 0 },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CockpitFinanceiro({ marketData, userProfile }: { marketData: any; userProfile?: any }) {
  const phaseDefault = PHASE_DEFAULTS[userProfile?.subtype] ?? { receita: 0, despesas: 0, caixa: 0, cac: 0, ticketMedio: 0, churnMensal: 0 }
  const { data, update } = useWorkspaceData('cockpit', phaseDefault)
  const receita = data.receita; const setReceita = (v: number) => update({ receita: v })
  const despesas = data.despesas; const setDespesas = (v: number) => update({ despesas: v })
  const caixa = data.caixa; const setCaixa = (v: number) => update({ caixa: v })
  const cac = data.cac; const setCac = (v: number) => update({ cac: v })
  const ticketMedio = data.ticketMedio ?? phaseDefault.ticketMedio; const setTicketMedio = (v: number) => update({ ticketMedio: v })
  const churnMensal = data.churnMensal ?? phaseDefault.churnMensal; const setChurnMensal = (v: number) => update({ churnMensal: v })
  const [iaLoading, setIaLoading] = useState(false)
  const [iaResponse, setIaResponse] = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)
  const pdfRef = useRef<HTMLDivElement>(null)

  const metrics = useMemo(() => {
    const margemDecimal = receita > 0 ? (receita - despesas) / receita : 0
    const margem = margemDecimal * 100
    const lucro = receita - despesas
    // Runway baseado em burn rate líquido (despesas - receitas)
    const burnLiquido = despesas - receita
    const runway = burnLiquido > 0 ? caixa / burnLiquido : (lucro >= 0 ? 999 : caixa / despesas)
    // LTV/CAC correto: (Ticket Médio × Margem%) / Churn%
    const ltv = churnMensal > 0 ? (ticketMedio * margemDecimal) / (churnMensal / 100) : 0
    const ltvCac = cac > 0 && ltv > 0 ? ltv / cac : 0
    const burnRatio = receita > 0 ? 1 - despesas / receita : 0
    const runwayNorm = Math.min((runway === 999 ? 24 : runway) / 24, 1) * 100
    const ltvCacNorm = Math.min(ltvCac / 5, 1) * 100
    const burnNorm = Math.max(burnRatio, 0) * 100
    // Health Score: só calcula se há pelo menos receita ou despesas reais
    const semDados = receita === 0 && despesas === 0 && caixa === 0
    const healthScore = semDados ? 0 : Math.round(margem * 0.25 + runwayNorm * 0.4 + ltvCacNorm * 0.2 + burnNorm * 0.15)
    const breakeven = margemDecimal > 0 ? despesas / margemDecimal : 0
    const roi = caixa > 0 ? (lucro * 12) / caixa * 100 : 0
    const breakevenAlert = breakeven > receita

    return { margem, lucro, runway, burnLiquido, healthScore, ltvCac, ltv, breakeven, roi, breakevenAlert }
  }, [receita, despesas, caixa, cac, ticketMedio, churnMensal])

  const selicRate = marketData?.macro?.selic?.value ?? 14.75
  const ipcaRate = marketData?.macro?.ipca?.value ?? 4.14
  const usdRate = marketData?.macro?.usdBrl?.value ?? 4.98

  const metricCards = [
    { label: 'Margem', value: `${fmtDec(metrics.margem)}%`, color: colorByRange(metrics.margem, 20, 10), desc: '(receita - despesas) / receita' },
    { label: 'Lucro Mensal', value: `R$${fmt(metrics.lucro)}`, color: metrics.lucro >= 0 ? GREEN : RED, desc: 'Receita menos despesas operacionais' },
    { label: 'Runway', value: metrics.runway >= 999 ? '∞ meses' : `${fmtDec(metrics.runway)} meses`, color: colorByRange(Math.min(metrics.runway, 99), 6, 3), desc: 'Caixa ÷ burn rate líquido (despesas-receitas)' },
    { label: 'Health Score', value: `${metrics.healthScore}/100`, color: colorByRange(metrics.healthScore, 70, 40), desc: 'Score ponderado — caixa pesa 40%' },
    { label: 'Burn Líquido', value: metrics.burnLiquido > 0 ? `-R$${fmt(metrics.burnLiquido)}/mês` : `+R$${fmt(Math.abs(metrics.burnLiquido))}/mês`, color: metrics.burnLiquido > 0 ? RED : GREEN, desc: 'Despesas − Receitas (negativo = lucrativo)' },
    { label: 'LTV/CAC', value: `${fmtDec(metrics.ltvCac)}x`, color: colorByRange(metrics.ltvCac, 3, 1), desc: `(Ticket×Margem)/Churn — LTV R$${fmt(Math.round(metrics.ltv))}` },
    { label: 'Break-even', value: `R$${fmt(metrics.breakeven)}`, color: metrics.breakevenAlert ? RED : BLUE, desc: metrics.breakevenAlert ? '⚠ Receita atual abaixo do break-even!' : 'Receita necessária para cobrir despesas' },
    { label: 'ROI Anualizado', value: `${fmtDec(metrics.roi)}%`, color: metrics.roi >= 0 ? GREEN : RED, desc: 'Retorno sobre capital investido (anual)' },
  ]

  const exportPDF = async () => {
    if (!pdfRef.current) return
    setPdfLoading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')
      const canvas = await html2canvas(pdfRef.current, {
        backgroundColor: '#0a0f1e',
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = (canvas.height * pdfW) / canvas.width
      const nomeNegocio = userProfile?.nomeNegocio || userProfile?.nome_negocio || userProfile?.sectors?.[0] || 'IPB'
      const dataAtual = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      // Cabeçalho
      pdf.setFillColor(10, 15, 30)
      pdf.rect(0, 0, pdfW, 14, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`COCKPIT FINANCEIRO — ${nomeNegocio.toUpperCase()}`, 8, 9)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(120, 140, 160)
      pdf.text(`Health Score: ${metrics.healthScore}/100  |  Gerado em ${dataAtual}`, pdfW - 8, 9, { align: 'right' })
      // Conteúdo
      pdf.addImage(imgData, 'PNG', 0, 14, pdfW, pdfH)
      pdf.save(`cockpit-${nomeNegocio.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0,10)}.pdf`)
    } finally {
      setPdfLoading(false)
    }
  }

  const PHASE_BENCH: Record<string, string> = {
    validacao: 'Fase Validação — foco em Runway e Burn Rate. Receita pode ser R$0. Meta: primeiro cliente pagante.',
    mei:       'Fase MEI — foco em Margem (>20%) e CAC controlado. Runway mínimo 3 meses.',
    slu:       'Fase SLU — foco em LTV/CAC (>3x) e Margem (>25%). Runway mínimo 6 meses.',
    startup:   'Fase Startup — foco em crescimento com runway >12 meses. LTV/CAC >3x é crítico.',
    ltda:      'Fase LTDA — foco em ROI, CDI vs. Marketing e eficiência operacional.',
  }

  const handleIA = async () => {
    setIaLoading(true)
    setIaResponse('')
    const nomeNegocio = userProfile?.nomeNegocio || userProfile?.nome_negocio || userProfile?.sectors?.[0] || 'o negócio'
    const fase = userProfile?.subtype ?? 'não informada'
    const setor = userProfile?.sectors?.join(', ') || 'não informado'
    const benchFase = PHASE_BENCH[fase] ?? ''

    const question = `Você é analista financeiro especializado em PMEs brasileiras. Analise o Cockpit Financeiro de "${nomeNegocio}".

CONTEXTO DO NEGÓCIO:
  Fase: ${fase} | Setor: ${setor}
  ${benchFase}

DADOS FINANCEIROS REAIS:
  Receita Mensal: R$${fmt(receita)}
  Despesas Operacionais: R$${fmt(despesas)}
  Caixa Disponível: R$${fmt(caixa)}
  CAC: R$${fmt(cac)} | Ticket Médio: R$${fmt(ticketMedio)} | Churn: ${churnMensal}%/mês

INDICADORES CALCULADOS:
  Margem: ${fmtDec(metrics.margem)}%
  Runway: ${metrics.runway >= 999 ? 'lucrativo (burn zerado)' : fmtDec(metrics.runway) + ' meses'}
  LTV/CAC: ${fmtDec(metrics.ltvCac)}x (LTV R$${fmt(Math.round(metrics.ltv))})
  Health Score: ${metrics.healthScore}/100
  Break-even: R$${fmt(metrics.breakeven)}${metrics.breakevenAlert ? ' ⚠ ALERTA: receita abaixo do break-even' : ''}
  Burn Líquido: ${metrics.burnLiquido > 0 ? '-R$' + fmt(metrics.burnLiquido) + '/mês' : 'positivo'}
  ROI Anualizado: ${fmtDec(metrics.roi)}%

CONTEXTO DE MERCADO:
  SELIC: ${selicRate}% | IPCA: ${ipcaRate}% | USD/BRL: R$${usdRate}

Gere um relatório executivo com:
1. DIAGNÓSTICO — 1 parágrafo objetivo sobre a saúde financeira atual, citando os números reais
2. ALERTAS — semáforo: o que está CRÍTICO (vermelho), ATENÇÃO (amarelo), SAUDÁVEL (verde)
3. PLANO DE AÇÃO — 3 ações prioritárias específicas para essa fase e setor, com prazo (7 dias / 30 dias / 90 dias)
4. FRASE EXECUTIVA — 1 frase de conclusão para o relatório PDF

Seja direto, use os números reais, não seja genérico.`

    const marketContext = `SELIC: ${selicRate}% | IPCA: ${ipcaRate}% | USD/BRL: R$${usdRate}`

    try {
      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, marketContext }),
      })
      const data = await res.json()
      setIaResponse(data.answer ?? 'Sem resposta da IA.')
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

  const cdiMensal = (selicRate - 0.1) / 12           // CDI ≈ SELIC − 0.1% ao ano → mensal
  const cdiRendimento = caixa * (cdiMensal / 100)    // R$/mês rendendo no CDI
  const roiMensal = metrics.roi / 12                  // ROI marketing mensal
  const decisaoCDI = roiMensal < cdiMensal            // true = CDI bate marketing

  return (
    <motion.div
      ref={pdfRef}
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
          {inputField('Ticket Médio (R$)', ticketMedio, setTicketMedio)}
          <div className="flex flex-col gap-1">
            <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Churn Mensal (%)</label>
            <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <input type="range" min={1} max={50} value={churnMensal} onChange={e => setChurnMensal(Number(e.target.value))}
                style={{ flex: 1, accentColor: BLUE, height: 4 }} />
              <span style={{ fontSize: 13, fontFamily: 'monospace', color: '#fff', minWidth: 36, textAlign: 'right' }}>{churnMensal}%</span>
            </div>
          </div>
        </div>
        {metrics.breakevenAlert && (
          <div className="mt-2 rounded-lg px-3 py-2.5" style={{ background: `${RED}18`, border: `1px solid ${RED}40` }}>
            <span style={{ fontSize: 12, color: RED, fontFamily: 'monospace', fontWeight: 700 }}>
              ⚠ ALERTA: receita R${fmt(receita)} abaixo do break-even R${fmt(metrics.breakeven)} — corte custos ou aumente ticket em {fmtDec((metrics.breakeven/receita - 1)*100)}%
            </span>
          </div>
        )}
      </div>

      {/* 1.5 Phase context */}
      {userProfile?.subtype && PHASE_BENCH[userProfile.subtype] && (
        <div className="rounded-lg px-3 py-2.5" style={{ background: `${BLUE}12`, border: `1px solid ${BLUE}30` }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>
            📍 {PHASE_BENCH[userProfile.subtype]}
          </span>
        </div>
      )}

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

      {/* 4. CDI vs Marketing ROI */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} style={{ color: GREEN }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Caixa livre vs CDI</span>
        </div>
        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: `3px solid ${decisaoCDI ? AMBER : GREEN}` }}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="rounded-lg p-2.5" style={{ background: 'rgba(0,0,0,0.25)' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>CDI mensal ({fmtDec(cdiMensal, 2)}%)</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: GREEN, fontFamily: 'monospace' }}>R${fmt(Math.round(cdiRendimento))}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>seu caixa rendendo parado</div>
            </div>
            <div className="rounded-lg p-2.5" style={{ background: 'rgba(0,0,0,0.25)' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>ROI marketing ({fmtDec(roiMensal, 2)}%/mês)</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: metrics.roi > 0 ? GREEN : RED, fontFamily: 'monospace' }}>{fmtDec(metrics.roi)}%</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>retorno anualizado estimado</div>
            </div>
          </div>
          <div className="rounded-md p-2.5 mb-2" style={{ background: `${BLUE}10`, border: `1px solid ${BLUE}25` }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              Rendimento do caixa no CDI: <span style={{ fontFamily: 'monospace', color: GREEN, fontWeight: 700 }}>R${fmt(Math.round(cdiRendimento))}/mês</span> ({fmtDec(cdiMensal, 2)}%/mês × R${fmt(caixa)})
            </span>
          </div>
          <div className="rounded-md p-2.5" style={{ background: decisaoCDI ? `${AMBER}12` : `${GREEN}10`, border: `1px solid ${decisaoCDI ? AMBER : GREEN}25` }}>
            <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: decisaoCDI ? AMBER : GREEN }}>
              {decisaoCDI
                ? `⚠ CDI bate seu ROI de marketing — considere deixar R$${fmt(Math.round(caixa * 0.3))} no banco`
                : `✓ ROI marketing (${fmtDec(roiMensal, 1)}%/mês) supera CDI (${fmtDec(cdiMensal, 2)}%/mês) — continue investindo`}
            </span>
          </div>
        </div>
      </div>

      {/* 5. IA Analysis + PDF */}
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
            style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${BLUE}40`, fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.75)' }}
          >
            <div className="flex items-center gap-2 mb-2" style={{ fontSize: 10, color: BLUE, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.1em' }}>
              ✦ ANÁLISE IPB · {new Date().toLocaleDateString('pt-BR')}
            </div>
            {iaResponse}
          </motion.div>
        )}

        {iaResponse && (
          <button
            onClick={exportPDF}
            disabled={pdfLoading}
            className="w-full mt-3 rounded-lg py-3 flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ background: 'rgba(26,82,118,0.3)', border: `1px solid ${BLUE}50`, color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}
          >
            {pdfLoading ? <Loader2 size={15} className="animate-spin" /> : <FileDown size={15} />}
            {pdfLoading ? 'Gerando PDF...' : 'Salvar relatório em PDF'}
          </button>
        )}
      </div>
    </motion.div>
  )
}
