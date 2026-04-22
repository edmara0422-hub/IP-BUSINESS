'use client'

import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, TrendingUp, AlertTriangle, Brain, Loader2, FileDown, ToggleLeft, ToggleRight } from 'lucide-react'
import { useWorkspaceData } from '@/hooks/useWorkspaceData'

const RED   = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE  = '#1a5276'

function fmt(v: number) { return v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
function fmtDec(v: number, d = 1) { return v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }) }
function colorByRange(v: number, g: number, a: number) { return v >= g ? GREEN : v >= a ? AMBER : RED }

const ZERO_DEFAULT = { receita: 0, despesas: 0, caixa: 0, clientesAtivos: 0, novosClientes: 0, clientesPerdidos: 0, verbaMkt: 0, cacManual: 0, ticketManual: 0, churnManual: 0 }

// Benchmarks por fase + setor combinados
function buildBenchmark(fase: string, setores: string[], produtos: string[], revenue: string, nome: string): string {
  const setor = setores[0] ?? ''
  const produto = produtos[0] ?? ''
  const isSaaS = ['App/SaaS', 'Digital/SaaS', 'SaaS', 'App'].some(p => produtos.includes(p) || produto.includes(p))
  const isConsult = ['Consultoria', 'Agência'].some(s => setores.includes(s))
  const isEdu = ['Educação', 'Infoproduto', 'Conteúdo'].some(s => setores.includes(s))

  const faseLabel: Record<string, string> = {
    validacao: 'Validação', mei: 'MEI', slu: 'SLU', startup: 'Startup', ltda: 'LTDA',
  }

  const benchmarks: Record<string, { meta: string; runway: string; margem: string; ltvcac: string }> = {
    validacao: { meta: 'primeiro cliente pagante', runway: '3+ meses de caixa', margem: 'qualquer margem positiva', ltvcac: 'LTV/CAC > 1x' },
    mei:       { meta: 'faturar acima do break-even', runway: '3+ meses', margem: '>20%', ltvcac: '>2x' },
    slu:       { meta: 'escalar com margem saudável', runway: '6+ meses', margem: '>25%', ltvcac: '>3x' },
    startup:   { meta: 'crescimento + retenção', runway: '12+ meses', margem: '>30% bruta', ltvcac: '>3x obrigatório' },
    ltda:      { meta: 'eficiência e ROI acima do CDI', runway: '6+ meses', margem: '>35%', ltvcac: '>5x' },
  }

  const b = benchmarks[fase] ?? benchmarks['validacao']
  const tipoNeg = isSaaS ? 'SaaS/App' : isConsult ? 'Consultoria' : isEdu ? 'Infoproduto/Educação' : setor || produto || 'Negócio'
  const cacRef = isSaaS ? 'R$50–150' : isConsult ? 'R$80–300' : isEdu ? 'R$20–80' : 'R$50–200'
  const ticketRef = isSaaS ? 'R$29–199/mês' : isConsult ? 'R$500–5.000/projeto' : isEdu ? 'R$97–497' : 'variável'

  return `${nome ? nome + ' · ' : ''}${faseLabel[fase] ?? fase} · ${tipoNeg}${revenue ? ' · ' + revenue : ''}
  Meta desta fase: ${b.meta}
  Benchmarks: Runway ${b.runway} | Margem ${b.margem} | ${b.ltvcac}
  Referência de mercado: CAC típico ${cacRef} | Ticket típico ${ticketRef}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CockpitFinanceiro({ marketData, userProfile, cockpitAlerts }: { marketData: any; userProfile?: any; cockpitAlerts?: string[] }) {
  const { data, update } = useWorkspaceData('cockpit', ZERO_DEFAULT)
  const [modoManual, setModoManual] = useState(false)
  const [iaLoading, setIaLoading]   = useState(false)
  const [iaResponse, setIaResponse] = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)
  const pdfRef = useRef<HTMLDivElement>(null)

  // Inputs financeiros base
  const receita   = data.receita   ?? 0; const setReceita   = (v: number) => update({ receita: v })
  const despesas  = data.despesas  ?? 0; const setDespesas  = (v: number) => update({ despesas: v })
  const caixa     = data.caixa     ?? 0; const setCaixa     = (v: number) => update({ caixa: v })

  // Inputs operacionais (para cálculo automático)
  const clientesAtivos  = data.clientesAtivos  ?? 0; const setClientesAtivos  = (v: number) => update({ clientesAtivos: v })
  const novosClientes   = data.novosClientes   ?? 0; const setNovosClientes   = (v: number) => update({ novosClientes: v })
  const clientesPerdidos = data.clientesPerdidos ?? 0; const setClientesPerdidos = (v: number) => update({ clientesPerdidos: v })
  const verbaMkt        = data.verbaMkt        ?? 0; const setVerbaMkt        = (v: number) => update({ verbaMkt: v })

  // Inputs manuais (modo override)
  const cacManual    = data.cacManual    ?? 0; const setCacManual    = (v: number) => update({ cacManual: v })
  const ticketManual = data.ticketManual ?? 0; const setTicketManual = (v: number) => update({ ticketManual: v })
  const churnManual  = data.churnManual  ?? 0; const setChurnManual  = (v: number) => update({ churnManual: v })

  // Cálculo automático ou manual
  const ticketMedio = modoManual ? ticketManual : (clientesAtivos > 0 ? receita / clientesAtivos : 0)
  const cac         = modoManual ? cacManual    : (novosClientes > 0  ? verbaMkt / novosClientes  : 0)
  const churnMensal = modoManual ? churnManual  : (clientesAtivos > 0 ? (clientesPerdidos / clientesAtivos) * 100 : 0)

  const selicRate = marketData?.macro?.selic?.value  ?? 14.75
  const ipcaRate  = marketData?.macro?.ipca?.value   ?? 4.14
  const usdRate   = marketData?.macro?.usdBrl?.value ?? 4.98

  const metrics = useMemo(() => {
    const margemDecimal = receita > 0 ? (receita - despesas) / receita : 0
    const margem   = margemDecimal * 100
    const lucro    = receita - despesas
    const burnLiquido = despesas - receita
    const runway   = burnLiquido > 0 ? caixa / burnLiquido : (lucro >= 0 ? 999 : caixa / despesas)
    const ltv      = churnMensal > 0 ? (ticketMedio * margemDecimal) / (churnMensal / 100) : 0
    const ltvCac   = cac > 0 && ltv > 0 ? ltv / cac : 0
    const burnRatio   = receita > 0 ? 1 - despesas / receita : 0
    const runwayNorm  = Math.min((runway === 999 ? 24 : runway) / 24, 1) * 100
    const ltvCacNorm  = Math.min(ltvCac / 5, 1) * 100
    const burnNorm    = Math.max(burnRatio, 0) * 100
    const semDados    = receita === 0 && despesas === 0 && caixa === 0
    const healthScore = semDados ? 0 : Math.round(margem * 0.25 + runwayNorm * 0.4 + ltvCacNorm * 0.2 + burnNorm * 0.15)
    const breakeven   = margemDecimal > 0 ? despesas / margemDecimal : 0
    const roi         = caixa > 0 ? (lucro * 12) / caixa * 100 : 0
    const breakevenAlert = breakeven > receita && receita > 0
    return { margem, lucro, runway, burnLiquido, healthScore, ltvCac, ltv, breakeven, roi, breakevenAlert, semDados }
  }, [receita, despesas, caixa, cac, ticketMedio, churnMensal])

  const metricCards = [
    { label: 'Health Score',    value: `${metrics.healthScore}/100`,  color: colorByRange(metrics.healthScore, 70, 40), desc: 'Score ponderado: runway 40%, margem 25%, LTV/CAC 20%, burn 15%' },
    { label: 'Margem',          value: `${fmtDec(metrics.margem)}%`,  color: colorByRange(metrics.margem, 20, 10),      desc: '(receita − despesas) / receita' },
    { label: 'Runway',          value: metrics.runway >= 999 ? '∞ meses' : `${fmtDec(metrics.runway)} meses`, color: colorByRange(Math.min(metrics.runway, 99), 6, 3), desc: 'Caixa ÷ burn rate líquido' },
    { label: 'Lucro Mensal',    value: `R$${fmt(metrics.lucro)}`,     color: metrics.lucro >= 0 ? GREEN : RED,          desc: 'Receita − despesas operacionais' },
    { label: 'Burn Líquido',    value: metrics.burnLiquido > 0 ? `-R$${fmt(metrics.burnLiquido)}/mês` : `+R$${fmt(Math.abs(metrics.burnLiquido))}/mês`, color: metrics.burnLiquido > 0 ? RED : GREEN, desc: 'Despesas − receitas' },
    { label: 'LTV/CAC',         value: `${fmtDec(metrics.ltvCac)}x`, color: colorByRange(metrics.ltvCac, 3, 1),        desc: `(Ticket×Margem)/Churn — LTV R$${fmt(Math.round(metrics.ltv))}` },
    { label: 'Break-even',      value: `R$${fmt(metrics.breakeven)}`, color: metrics.breakevenAlert ? RED : BLUE,       desc: metrics.breakevenAlert ? '⚠ Receita abaixo do break-even!' : 'Receita necessária para cobrir custos' },
    { label: 'ROI Anualizado',  value: `${fmtDec(metrics.roi)}%`,    color: metrics.roi >= 0 ? GREEN : RED,            desc: 'Retorno sobre capital investido (anual)' },
    { label: 'Ticket Médio',    value: `R$${fmt(ticketMedio)}`,       color: ticketMedio > 0 ? BLUE : AMBER,            desc: modoManual ? 'inserido manualmente' : 'receita ÷ clientes ativos' },
    { label: 'CAC',             value: `R$${fmt(cac)}`,               color: cac > 0 ? BLUE : AMBER,                   desc: modoManual ? 'inserido manualmente' : 'verba marketing ÷ novos clientes' },
    { label: 'Churn Mensal',    value: `${fmtDec(churnMensal)}%`,     color: colorByRange(100 - churnMensal, 95, 90),   desc: modoManual ? 'inserido manualmente' : 'clientes perdidos ÷ ativos × 100' },
    { label: 'LTV',             value: `R$${fmt(Math.round(metrics.ltv))}`, color: metrics.ltv > 0 ? GREEN : AMBER,   desc: '(Ticket Médio × Margem) ÷ Churn%' },
  ]

  // Contexto completo do onboarding
  const nomeNegocio = userProfile?.nomeNegocio || userProfile?.nome_negocio || userProfile?.sectors?.[0] || ''
  const fase   = userProfile?.subtype   ?? ''
  const setores = userProfile?.sectors  ?? []
  const produtos = userProfile?.product ?? []
  const revenue  = userProfile?.revenue ?? ''
  const benchmark = fase ? buildBenchmark(fase, setores, produtos, revenue, nomeNegocio) : ''

  const exportPDF = async () => {
    if (!pdfRef.current) return
    setPdfLoading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF }   = await import('jspdf')
      const canvas = await html2canvas(pdfRef.current, { backgroundColor: '#0a0f1e', scale: 2, useCORS: true, logging: false })
      const imgData = canvas.toDataURL('image/png')
      const pdf  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = (canvas.height * pdfW) / canvas.width
      const dataAtual = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      pdf.setFillColor(10, 15, 30)
      pdf.rect(0, 0, pdfW, 14, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`COCKPIT FINANCEIRO — ${(nomeNegocio || 'IPB').toUpperCase()}`, 8, 9)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(120, 140, 160)
      pdf.text(`Health Score: ${metrics.healthScore}/100  |  ${dataAtual}`, pdfW - 8, 9, { align: 'right' })
      pdf.addImage(imgData, 'PNG', 0, 14, pdfW, pdfH)
      pdf.save(`cockpit-${(nomeNegocio || 'ipb').toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`)
    } finally {
      setPdfLoading(false)
    }
  }

  const handleIA = async () => {
    setIaLoading(true)
    setIaResponse('')
    const question = `Você é analista financeiro especializado em PMEs brasileiras. Analise o Cockpit Financeiro.

PERFIL DO NEGÓCIO (onboarding completo):
  Nome: ${nomeNegocio || 'não informado'}
  Fase: ${fase || 'não informada'}
  Setor(es): ${setores.join(', ') || 'não informado'}
  Produto/Serviço: ${produtos.join(', ') || 'não informado'}
  Faturamento declarado: ${revenue || 'não informado'}

BENCHMARKS DESTA FASE+SETOR:
  ${benchmark || 'sem referência'}

DADOS FINANCEIROS REAIS:
  Receita Mensal: R$${fmt(receita)}
  Despesas Operacionais: R$${fmt(despesas)}
  Caixa Disponível: R$${fmt(caixa)}
  Clientes Ativos: ${clientesAtivos} | Novos: ${novosClientes} | Perdidos: ${clientesPerdidos}
  Verba Marketing: R$${fmt(verbaMkt)}

INDICADORES CALCULADOS:
  Ticket Médio: R$${fmt(ticketMedio)} ${modoManual ? '(manual)' : '(automático)'}
  CAC: R$${fmt(cac)} ${modoManual ? '(manual)' : '(automático)'}
  Churn: ${fmtDec(churnMensal)}%/mês ${modoManual ? '(manual)' : '(automático)'}
  Margem: ${fmtDec(metrics.margem)}%
  Runway: ${metrics.runway >= 999 ? 'lucrativo' : fmtDec(metrics.runway) + ' meses'}
  LTV: R$${fmt(Math.round(metrics.ltv))} | LTV/CAC: ${fmtDec(metrics.ltvCac)}x
  Health Score: ${metrics.healthScore}/100
  Break-even: R$${fmt(metrics.breakeven)}${metrics.breakevenAlert ? ' ⚠ ABAIXO DO BREAK-EVEN' : ''}
  Burn Líquido: ${metrics.burnLiquido > 0 ? '-R$' + fmt(metrics.burnLiquido) + '/mês' : 'positivo'}
  ROI Anualizado: ${fmtDec(metrics.roi)}%

CONTEXTO DE MERCADO:
  SELIC: ${selicRate}% | IPCA: ${ipcaRate}% | USD/BRL: R$${usdRate}

Gere relatório executivo:
1. DIAGNÓSTICO — parágrafo objetivo sobre saúde financeira, citando números reais e comparando com benchmarks da fase
2. SEMÁFORO — liste: 🔴 CRÍTICO / 🟡 ATENÇÃO / 🟢 SAUDÁVEL para cada indicador relevante
3. PLANO DE AÇÃO — 3 ações com prazo: 7 dias / 30 dias / 90 dias, específicas para essa fase e setor
4. FRASE EXECUTIVA — 1 frase de conclusão para o relatório

Seja direto, use os números reais, compare com os benchmarks informados.`

    try {
      const res  = await fetch('/api/advisor-chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, marketContext: `SELIC ${selicRate}% | IPCA ${ipcaRate}% | USD R$${usdRate}` }) })
      const d    = await res.json()
      setIaResponse(d.answer ?? 'Sem resposta da IA.')
    } catch {
      setIaResponse('Erro ao conectar com a IA.')
    } finally {
      setIaLoading(false)
    }
  }

  const inputNum = (label: string, value: number, setter: (v: number) => void, prefix = 'R$') => (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.02em' }}>{label}</label>
      <div className="flex items-center gap-2 rounded-lg px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.1)' }}>
        {prefix && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', userSelect: 'none', flexShrink: 0 }}>{prefix}</span>}
        <input
          type="number"
          value={value === 0 ? '' : value}
          placeholder="0"
          onChange={e => setter(e.target.value === '' ? 0 : Number(e.target.value) || 0)}
          className="bg-transparent outline-none flex-1 min-w-0"
          style={{ fontSize: 15, fontFamily: 'monospace', color: '#fff', border: 'none' }}
        />
      </div>
    </div>
  )

  const cdiMensal    = (selicRate - 0.1) / 12
  const cdiRendimento = caixa * (cdiMensal / 100)
  const roiMensal    = metrics.roi / 12
  const decisaoCDI   = roiMensal < cdiMensal

  return (
    <motion.div ref={pdfRef} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 p-4" style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>

      {/* ── CONTEXTO DO ONBOARDING COMPLETO ── */}
      {benchmark && (
        <div className="rounded-lg px-4 py-3" style={{ background: `${BLUE}12`, border: `1px solid ${BLUE}35` }}>
          <p style={{ fontSize: 10, color: BLUE, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4 }}>📍 CONTEXTO DO NEGÓCIO</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{benchmark}</p>
        </div>
      )}

      {/* ── 1. INPUTS FINANCEIROS BASE ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calculator size={16} style={{ color: BLUE }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Dados financeiros</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {inputNum('Receita Mensal', receita, setReceita)}
          {inputNum('Despesas Operacionais', despesas, setDespesas)}
          {inputNum('Caixa Disponível', caixa, setCaixa)}
          {inputNum('Verba Marketing/Aquisição', verbaMkt, setVerbaMkt)}
        </div>
      </div>

      {/* ── 2. INPUTS OPERACIONAIS → CÁLCULO AUTOMÁTICO ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} style={{ color: GREEN }} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Clientes</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>→ CAC / Ticket / Churn automáticos</span>
          </div>
          <button onClick={() => setModoManual(m => !m)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors"
            style={{ background: modoManual ? `${AMBER}20` : 'rgba(255,255,255,0.04)', border: `1px solid ${modoManual ? AMBER + '50' : 'rgba(255,255,255,0.08)'}`, fontSize: 10, color: modoManual ? AMBER : 'rgba(255,255,255,0.3)' }}>
            {modoManual ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
            {modoManual ? 'Manual' : 'Automático'}
          </button>
        </div>

        {!modoManual ? (
          <div className="flex flex-col gap-2.5">
            {inputNum('Clientes Ativos', clientesAtivos, setClientesAtivos, '#')}
            {inputNum('Novos Clientes (mês)', novosClientes, setNovosClientes, '+')}
            {inputNum('Clientes Perdidos (mês)', clientesPerdidos, setClientesPerdidos, '−')}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {inputNum('CAC (R$)', cacManual, setCacManual)}
            {inputNum('Ticket Médio (R$)', ticketManual, setTicketManual)}
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.02em' }}>Churn Mensal (%) — {fmtDec(churnManual)}%</label>
              <div className="flex items-center gap-3 rounded-lg px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <input type="range" min={0} max={50} step={0.5} value={churnManual} onChange={e => setChurnManual(Number(e.target.value))}
                  style={{ flex: 1, accentColor: BLUE, height: 4 }} />
                <span style={{ fontSize: 15, fontFamily: 'monospace', color: '#fff', minWidth: 40, textAlign: 'right' }}>{fmtDec(churnManual)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Calculados em tempo real */}
        {!modoManual && (clientesAtivos > 0 || novosClientes > 0) && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: 'Ticket Médio', value: `R$${fmt(ticketMedio)}`, ok: ticketMedio > 0 },
              { label: 'CAC',          value: `R$${fmt(cac)}`,         ok: cac > 0 },
              { label: 'Churn',        value: `${fmtDec(churnMensal)}%`, ok: churnMensal < 10 },
            ].map(c => (
              <div key={c.label} className="rounded-lg px-3 py-2 text-center" style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${c.ok ? GREEN : AMBER}30` }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>{c.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'monospace', color: c.ok ? GREEN : AMBER }}>{c.value}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', marginTop: 1 }}>calculado</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 3. INDICADORES CALCULADOS ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} style={{ color: AMBER }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Indicadores calculados</span>
        </div>
        {metrics.breakevenAlert && (
          <div className="mb-3 rounded-lg px-3 py-2.5" style={{ background: `${RED}18`, border: `1px solid ${RED}40` }}>
            <span style={{ fontSize: 12, color: RED, fontFamily: 'monospace', fontWeight: 700 }}>
              ⚠ Receita R${fmt(receita)} abaixo do break-even R${fmt(metrics.breakeven)} — corte custos ou aumente ticket em {fmtDec((metrics.breakeven / receita - 1) * 100)}%
            </span>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metricCards.map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', borderTop: `2px solid ${m.color}` }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{m.label}</div>
              <div className="truncate" style={{ fontSize: 15, fontWeight: 700, color: m.color, fontFamily: 'monospace', lineHeight: 1.2 }}>{m.value}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4, lineHeight: 1.3 }}>{m.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── 4. IMPACTO DE MERCADO ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} style={{ color: GREEN }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Impacto do mercado nos seus números</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: `3px solid ${selicRate > 12 ? RED : GREEN}` }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>SELIC {fmtDec(selicRate)}%</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Custo crédito: {fmtDec(selicRate * 2.5)}% a.a.</div>
            {despesas > 0 && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Financia R${fmt(despesas)} → +R${fmt(Math.round((despesas * (selicRate * 2.5 / 100)) / 12))}/mês juros</div>}
          </div>
          <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: `3px solid ${ipcaRate > 4 ? AMBER : GREEN}` }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>IPCA {fmtDec(ipcaRate)}%</div>
            {despesas > 0 && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Despesas em 12m: R${fmt(Math.round(despesas * (1 + ipcaRate / 100)))} (+R${fmt(Math.round(despesas * ipcaRate / 100))}/mês)</div>}
          </div>
          <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: `3px solid ${decisaoCDI ? AMBER : GREEN}` }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>CDI vs. ROI</div>
            {caixa > 0 && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Caixa rendendo: R${fmt(Math.round(cdiRendimento))}/mês ({fmtDec(cdiMensal, 2)}%/mês)</div>}
            <div style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: decisaoCDI ? AMBER : GREEN }}>
              {decisaoCDI ? `⚠ CDI bate seu ROI — avalie realocar caixa` : `✓ ROI marketing supera CDI`}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4.5 ALERTAS DE MERCADO AUTOMÁTICOS ── */}
      {cockpitAlerts && cockpitAlerts.length > 0 && (
        <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${AMBER}30` }}>
          <div className="px-3 py-2" style={{ background: `${AMBER}10` }}>
            <p style={{ fontSize: 10, color: AMBER, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>
              ⚡ ALERTAS DE MERCADO — conectado ao Business
            </p>
            <div className="flex flex-col gap-2">
              {cockpitAlerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ fontSize: 11, color: AMBER, marginTop: 1 }}>▸</span>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{alert}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 5. IA + PDF ── */}
      <div>
        {metrics.semDados && (
          <div className="mb-3 rounded-lg px-3 py-2.5 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Preencha Receita, Despesas ou Caixa para ativar o diagnóstico IA</p>
          </div>
        )}
        <button onClick={handleIA} disabled={iaLoading || metrics.semDados}
          className="w-full rounded-lg py-3 flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ background: BLUE, color: '#fff', fontSize: 14, fontWeight: 600, cursor: (iaLoading || metrics.semDados) ? 'not-allowed' : 'pointer' }}>
          {iaLoading ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
          {iaLoading ? 'Analisando...' : 'Analisar com IA — Diagnóstico completo'}
        </button>

        {iaResponse && (
          <>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-lg p-4 mt-3"
              style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${BLUE}40`, fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.75)' }}>
              <div style={{ fontSize: 10, color: BLUE, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }}>
                ✦ ANÁLISE IPB · {nomeNegocio || 'Cockpit'} · {new Date().toLocaleDateString('pt-BR')}
              </div>
              {iaResponse}
            </motion.div>

            <button onClick={exportPDF} disabled={pdfLoading}
              className="w-full mt-3 rounded-lg py-3 flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ background: 'rgba(26,82,118,0.3)', border: `1px solid ${BLUE}50`, color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}>
              {pdfLoading ? <Loader2 size={15} className="animate-spin" /> : <FileDown size={15} />}
              {pdfLoading ? 'Gerando PDF...' : 'Salvar relatório em PDF'}
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}
