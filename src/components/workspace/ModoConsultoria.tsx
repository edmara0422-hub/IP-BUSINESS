'use client'

import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, FileText, Loader2, AlertTriangle, Brain,
  TrendingUp, CheckCircle2, RefreshCw, ChevronRight,
  Download, UserCircle, ToggleLeft, ToggleRight, Settings, Target,
} from 'lucide-react'

const RED = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE = '#1a5276'

function fmt(v: number) { return v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
function fmtDec(v: number, d = 1) { return v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }) }
function colorByRange(v: number, g: number, a: number) { return v >= g ? GREEN : v >= a ? AMBER : RED }
function fmtBRL(v: number) { return `R$${fmt(Math.round(v))}` }

interface ConsultorProfile { nome: string; empresa: string }

interface ClienteData {
  nome: string; setor: string; fase: string
  receita: number; despesas: number; caixa: number
  clientesAtivos: number; novosClientes: number; clientesPerdidos: number; verbaMkt: number
  divida: number; pctDolar: number
  modoManual: boolean; cacManual: number; ticketManual: number; churnManual: number
}

const EMPTY: ClienteData = {
  nome: '', setor: '', fase: '',
  receita: 0, despesas: 0, caixa: 0,
  clientesAtivos: 0, novosClientes: 0, clientesPerdidos: 0, verbaMkt: 0,
  divida: 0, pctDolar: 0,
  modoManual: false, cacManual: 0, ticketManual: 0, churnManual: 0,
}

const SETORES = ['Tecnologia', 'Varejo', 'Saúde', 'Educação', 'Alimentação', 'Serviços', 'Indústria', 'Logística', 'Imobiliário', 'Financeiro', 'Agronegócio', 'Outro']
const FASES = [
  { value: 'validacao', label: 'Validação' },
  { value: 'mei', label: 'MEI' },
  { value: 'slu', label: 'SLU' },
  { value: 'startup', label: 'Startup' },
  { value: 'ltda', label: 'LTDA / Empresa consolidada' },
]

function loadConsultor(): ConsultorProfile | null {
  try {
    const s = localStorage.getItem('ipb-consultor-profile')
    return s ? JSON.parse(s) : null
  } catch { return null }
}
function saveConsultor(p: ConsultorProfile) {
  localStorage.setItem('ipb-consultor-profile', JSON.stringify(p))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ModoConsultoria({ marketData }: { marketData: any }) {
  const [step, setStep] = useState<'perfil' | 'intro' | 'form' | 'diagnostico'>(() => {
    const c = loadConsultor()
    return c?.nome ? 'intro' : 'perfil'
  })
  const [consultor, setConsultor] = useState<ConsultorProfile>(() => loadConsultor() ?? { nome: '', empresa: '' })
  const [editandoPerfil, setEditandoPerfil] = useState(false)
  const [cliente, setCliente] = useState<ClienteData>(EMPTY)
  const [iaLoading, setIaLoading] = useState(false)
  const [iaReport, setIaReport] = useState('')
  const [showScript, setShowScript] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const pdfRef = useRef<HTMLDivElement>(null)

  const selicRate = marketData?.macro?.selic?.value ?? 14.75
  const ipcaRate = marketData?.macro?.ipca?.value ?? 4.14
  const usdRate = marketData?.macro?.usdBrl?.value ?? 4.98
  const cambioRef = 4.50

  const diag = useMemo(() => {
    const {
      receita, despesas, caixa, divida, pctDolar,
      clientesAtivos, novosClientes, clientesPerdidos, verbaMkt,
      modoManual, cacManual, ticketManual, churnManual,
    } = cliente

    const semDados = receita === 0 && despesas === 0 && caixa === 0
    if (semDados) return null

    const ticketMedio = modoManual ? ticketManual : (clientesAtivos > 0 ? receita / clientesAtivos : 0)
    const cac = modoManual ? cacManual : (novosClientes > 0 ? verbaMkt / novosClientes : 0)
    const churnMensal = modoManual ? churnManual : (clientesAtivos > 0 ? (clientesPerdidos / clientesAtivos) * 100 : 0)

    const burnLiquido = despesas + divida
    const lucro = receita - burnLiquido
    const margem = receita > 0 ? (lucro / receita) * 100 : 0
    const margemDecimal = margem / 100
    const runwayMeses = burnLiquido > 0 ? Math.min(caixa / burnLiquido, 36) : 0

    const fatorCambio = 1 + (pctDolar / 100) * (usdRate / cambioRef - 1)
    const custoReal = despesas * fatorCambio * (1 + ipcaRate / 100)
    const lucroReal = receita - custoReal - divida
    const margemReal = receita > 0 ? (lucroReal / receita) * 100 : 0
    const erosaoMargem = margem - margemReal

    const ltv = churnMensal > 0 ? (ticketMedio * Math.max(margemDecimal, 0)) / (churnMensal / 100) : 0
    const ltvCac = cac > 0 ? ltv / cac : 0

    const reajusteNecessario = (ipcaRate / 100) + (pctDolar / 100 * (usdRate / cambioRef - 1))
    const receitaReajustada = receita * (1 + reajusteNecessario)
    const custoCapital = divida > 0 ? divida * (selicRate * 2.5 / 100 / 12) : 0

    const margemNorm = Math.max(Math.min(margem / 30, 1), 0) * 25
    const runwayNorm = Math.min(runwayMeses / 12, 1) * 40
    const ltvCacNorm = Math.min(ltvCac / 3, 1) * 20
    const burnNorm = receita > 0 ? Math.max(1 - burnLiquido / receita, 0) * 15 : 0
    const healthScore = Math.round(margemNorm + runwayNorm + ltvCacNorm + burnNorm)
    const healthColor = healthScore >= 70 ? GREEN : healthScore >= 40 ? AMBER : RED
    const healthLabel = healthScore >= 70 ? 'Saudável' : healthScore >= 40 ? 'Risco Moderado' : 'Crítico'

    const alerts: { level: 'red' | 'amber'; text: string }[] = []
    if (margem < 0) alerts.push({ level: 'red', text: `Margem negativa (${fmtDec(margem)}%) — operação gerando prejuízo` })
    else if (margem < 10) alerts.push({ level: 'amber', text: `Margem ${fmtDec(margem)}% abaixo do mínimo saudável (20%)` })
    if (erosaoMargem > 5) alerts.push({ level: 'amber', text: `IPCA + câmbio corroem ${fmtDec(erosaoMargem)}pp de margem` })
    if (runwayMeses < 3) alerts.push({ level: 'red', text: `Runway crítico: ${fmtDec(runwayMeses, 1)}m — liquidez em risco` })
    else if (runwayMeses < 6) alerts.push({ level: 'amber', text: `Runway apertado: ${fmtDec(runwayMeses, 1)}m — planejar captação` })
    if (receita > 0 && divida > receita * 0.25) alerts.push({ level: 'red', text: `Dívida ${fmtDec((divida / receita) * 100)}% da receita com SELIC ${fmtDec(selicRate, 2)}%` })
    if (ltvCac > 0 && ltvCac < 1) alerts.push({ level: 'red', text: `LTV/CAC ${fmtDec(ltvCac, 1)}x — aquisição custa mais que o cliente vale` })

    return {
      lucro, margem, lucroReal, margemReal, erosaoMargem,
      runwayMeses, burnLiquido, ltv, ltvCac,
      reajusteNecessario, receitaReajustada, custoCapital,
      healthScore, healthColor, healthLabel, alerts,
      ticketMedio, cac, churnMensal,
    }
  }, [cliente, selicRate, ipcaRate, usdRate])

  // For form preview (before diagnostico step)
  const previewTicket = cliente.modoManual ? cliente.ticketManual : (cliente.clientesAtivos > 0 ? cliente.receita / cliente.clientesAtivos : 0)
  const previewCac = cliente.modoManual ? cliente.cacManual : (cliente.novosClientes > 0 ? cliente.verbaMkt / cliente.novosClientes : 0)
  const previewChurn = cliente.modoManual ? cliente.churnManual : (cliente.clientesAtivos > 0 ? (cliente.clientesPerdidos / cliente.clientesAtivos) * 100 : 0)

  const update = (campo: keyof ClienteData, val: string | number | boolean) => {
    setCliente(prev => ({ ...prev, [campo]: typeof val === 'string' && campo !== 'nome' && campo !== 'setor' && campo !== 'fase' ? (Number(val) || 0) : val }))
  }

  const resetCliente = () => { setCliente(EMPTY); setStep('intro'); setIaReport('') }

  const salvarConsultor = () => {
    if (!consultor.nome.trim()) return
    saveConsultor(consultor)
    setEditandoPerfil(false)
    if (step === 'perfil') setStep('intro')
  }

  const handleGerarIA = async () => {
    if (!diag) return
    setIaLoading(true)
    setIaReport('')
    const faseLabel: Record<string, string> = { validacao: 'Validação', mei: 'MEI', slu: 'SLU', startup: 'Startup', ltda: 'LTDA' }
    const nomeCliente = cliente.nome || 'Cliente'
    const nomeConsultor = consultor.nome || 'Consultor'
    const empresa = consultor.empresa ? ` (${consultor.empresa})` : ''

    const q = `Você é um consultor sênior de Inteligência Organizacional (OBI) baseado em Rezende e Peter. Gere um diagnóstico executivo personalizado.

CONSULTOR: ${nomeConsultor}${empresa}
CLIENTE: ${nomeCliente}${cliente.setor ? ` · Setor: ${cliente.setor}` : ''}${cliente.fase ? ` · Fase: ${faseLabel[cliente.fase] ?? cliente.fase}` : ''}

DADOS FINANCEIROS:
- Receita mensal: ${fmtBRL(cliente.receita)}
- Despesas operacionais: ${fmtBRL(cliente.despesas)}
- Caixa disponível: ${fmtBRL(cliente.caixa)}
- Dívidas/juros mensais: ${fmtBRL(cliente.divida)}
- Exposição ao dólar: ${cliente.pctDolar}%

INDICADORES CALCULADOS:
- Margem: ${fmtDec(diag.margem)}% nominal | ${fmtDec(diag.margemReal)}% real
- Runway: ${fmtDec(diag.runwayMeses, 1)} meses
- Ticket Médio: ${fmtBRL(diag.ticketMedio)} | CAC: ${fmtBRL(diag.cac)} | Churn: ${fmtDec(diag.churnMensal)}%/mês
- LTV: ${fmtBRL(diag.ltv)} | LTV/CAC: ${fmtDec(diag.ltvCac, 1)}x
- Health Score: ${diag.healthScore}/100 (${diag.healthLabel})

CONTEXTO MACRO:
- SELIC: ${fmtDec(selicRate, 2)}% | IPCA: ${fmtDec(ipcaRate, 1)}% | USD: R$${fmtDec(usdRate, 2)}

Estruture assim (use EXATAMENTE estes títulos):

📊 SUMÁRIO EXECUTIVO
(3 linhas: saúde atual, risco principal, veredito)

🔍 GARGALO IDENTIFICADO
(o que está destruindo margem — use os dados reais do cliente)

⚡ PLANO DE AÇÃO
48h: [ação específica com número]
15 dias: [ação específica]
30 dias: [ação estratégica]

💡 PERGUNTA DE REFLEXÃO
(1 pergunta estratégica para o gestor)

Análise elaborada por ${nomeConsultor}${empresa} via IP Business. Seja cirúrgico, máx 280 palavras.`

    try {
      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, marketContext: `SELIC ${selicRate}%, IPCA ${ipcaRate}%, USD/BRL R$${usdRate}` }),
      })
      const data = await res.json()
      setIaReport(data.answer ?? 'Sem resposta.')
    } catch {
      setIaReport('Erro ao conectar com a IA.')
    } finally {
      setIaLoading(false)
    }
  }

  const exportPDF = async () => {
    if (!pdfRef.current || !diag) return
    setPdfLoading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2, backgroundColor: '#0a0d12', useCORS: true, logging: false,
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const imgH = (canvas.height * pageW) / canvas.width
      let y = 0
      while (y < imgH) {
        if (y > 0) pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, -y, pageW, imgH)
        y += pageH
      }
      const nomeFile = cliente.nome ? `diagnostico-${cliente.nome.toLowerCase().replace(/\s+/g, '-')}` : 'diagnostico-cliente'
      pdf.save(`${nomeFile}-${new Date().toISOString().slice(0, 10)}.pdf`)
    } finally {
      setPdfLoading(false)
    }
  }

  const showPerfil = step === 'perfil' || editandoPerfil

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}25` }}>
            <Users size={15} style={{ color: '#5dade2' }} />
          </div>
          <div>
            <p className="text-[13px] font-bold text-white/80">Modo Ghost — Consultoria</p>
            <p className="text-[10px] font-mono text-white/25">Switch 2 · SIE · OBI Diagnóstico</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {consultor.nome && !editandoPerfil && (
            <button onClick={() => setEditandoPerfil(true)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] text-white/25 hover:text-white/45 hover:bg-white/5 transition-colors">
              <Settings size={10} />
              {consultor.nome}
            </button>
          )}
          {step !== 'intro' && step !== 'perfil' && !editandoPerfil && (
            <button onClick={resetCliente}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] text-white/30 hover:text-white/50 hover:bg-white/5 transition-colors">
              <RefreshCw size={11} />
              Novo Cliente
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ── PERFIL DO CONSULTOR ── */}
        {showPerfil && (
          <motion.div key="perfil" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="rounded-xl p-5" style={{ background: `${BLUE}10`, border: `1px solid ${BLUE}30` }}>
              <div className="flex items-center gap-2 mb-3">
                <UserCircle size={16} style={{ color: '#5dade2' }} />
                <p className="text-[13px] font-bold text-white/70">Perfil do Consultor</p>
              </div>
              <p className="text-[11px] text-white/35 mb-4 leading-relaxed">
                Seu nome e empresa aparecem nos relatórios PDF e na assinatura dos diagnósticos.
              </p>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[11px] text-white/40 mb-1 block">Seu nome *</label>
                  <input value={consultor.nome} onChange={e => setConsultor(p => ({ ...p, nome: e.target.value }))}
                    placeholder="Ex: Ana Lima"
                    className="w-full rounded-lg px-3 py-2 bg-transparent outline-none"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 13, color: 'rgba(255,255,255,0.7)' }} />
                </div>
                <div>
                  <label className="text-[11px] text-white/40 mb-1 block">Empresa / Consultoria (opcional)</label>
                  <input value={consultor.empresa} onChange={e => setConsultor(p => ({ ...p, empresa: e.target.value }))}
                    placeholder="Ex: Lima Consultoria Estratégica"
                    className="w-full rounded-lg px-3 py-2 bg-transparent outline-none"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 13, color: 'rgba(255,255,255,0.7)' }} />
                </div>
                <div className="flex gap-2 mt-1">
                  {editandoPerfil && (
                    <button onClick={() => setEditandoPerfil(false)}
                      className="px-4 py-2 rounded-lg text-[12px] text-white/40 hover:text-white/60 transition-colors"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      Cancelar
                    </button>
                  )}
                  <button onClick={salvarConsultor} disabled={!consultor.nome.trim()}
                    className="flex-1 rounded-lg py-2.5 flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-40"
                    style={{ background: BLUE, color: '#fff', fontSize: 13, fontWeight: 600 }}>
                    <CheckCircle2 size={14} />
                    Salvar e continuar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── INTRO ── */}
        {step === 'intro' && !editandoPerfil && (
          <motion.div key="intro" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="rounded-xl p-5" style={{ background: `${BLUE}10`, border: `1px solid ${BLUE}30` }}>
              {consultor.nome && (
                <div className="flex items-center gap-2 mb-3 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: `${BLUE}30` }}>
                    <UserCircle size={11} style={{ color: '#5dade2' }} />
                  </div>
                  <p className="text-[11px] text-white/40">
                    <span className="font-bold text-white/60">{consultor.nome}</span>
                    {consultor.empresa && <span className="text-white/25"> · {consultor.empresa}</span>}
                  </p>
                </div>
              )}
              <p className="text-[11px] font-mono font-bold text-white/30 uppercase tracking-widest mb-3">Roteiro de Diagnóstico OBI</p>
              {[
                { label: 'SIO — Perfil do Cliente', desc: 'Setor, fase, dados financeiros e operacionais' },
                { label: 'SIG — Rentabilidade', desc: 'Margem real, LTV/CAC, breakeven, "prejuízo invisível"' },
                { label: 'SIE — Cenários', desc: 'Impacto de SELIC, câmbio e IPCA na saúde do negócio' },
                { label: 'OBI — Relatório', desc: 'Diagnóstico executivo + plano de ação 48h/15d/30d + PDF' },
              ].map((e, i) => (
                <div key={i} className="flex items-start gap-3 mb-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${BLUE}30` }}>
                    <span className="text-[9px] font-mono font-bold" style={{ color: '#5dade2' }}>{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-white/60">{e.label}</p>
                    <p className="text-[11px] text-white/30">{e.desc}</p>
                  </div>
                </div>
              ))}
              <button onClick={() => setStep('form')}
                className="w-full mt-2 rounded-lg py-2.5 flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ background: BLUE, color: '#fff', fontSize: 13, fontWeight: 600 }}>
                <ChevronRight size={14} />
                Iniciar Diagnóstico
              </button>
            </div>

            {/* Script colapsável */}
            <div className="mt-3 rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              <button className="w-full flex items-center justify-between px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.2)' }}
                onClick={() => setShowScript(!showScript)}>
                <span className="text-[11px] font-bold text-white/40">📋 Script de abordagem para clientes</span>
                <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.25)', transform: showScript ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {showScript && (
                <div className="px-3 py-3 flex flex-col gap-2" style={{ background: 'rgba(0,0,0,0.15)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-[11px] text-white/50 leading-relaxed italic">
                    "Eu não quero que você mude agora. Eu quero te mostrar como a IA interpreta os dados que você já tem
                    e te dá um Gatilho de Decisão que o Excel não consegue. Me deixa rodar um diagnóstico rápido para ver
                    se a IA encontra um 'ponto cego' na sua margem?"
                  </p>
                  <p className="text-[10px] font-mono" style={{ color: AMBER }}>
                    Você não vende acesso — você vende co-autoria. Primeiros clientes sentem que o produto foi feito para eles.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── FORMULÁRIO ── */}
        {step === 'form' && !editandoPerfil && (
          <motion.div key="form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-4">

            {/* Identificação */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-[10px] font-mono font-bold text-white/25 uppercase tracking-widest mb-3">Identificação do Cliente</p>
              <div className="flex flex-col gap-2.5">
                <div>
                  <label className="text-[11px] text-white/35 mb-1 block">Nome / Empresa</label>
                  <input value={cliente.nome} onChange={e => update('nome', e.target.value)}
                    placeholder="Ex: Agro São Paulo, Restaurante Família..."
                    className="w-full rounded-lg px-3 py-2 bg-transparent outline-none"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 13, color: 'rgba(255,255,255,0.7)' }} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-white/35 mb-1 block">Setor</label>
                    <select value={cliente.setor} onChange={e => update('setor', e.target.value)}
                      className="w-full rounded-lg px-3 py-2 outline-none appearance-none"
                      style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 12, color: cliente.setor ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}>
                      <option value="">Selecionar...</option>
                      {SETORES.map(s => <option key={s} value={s} style={{ background: '#111' }}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-white/35 mb-1 block">Fase</label>
                    <select value={cliente.fase} onChange={e => update('fase', e.target.value)}
                      className="w-full rounded-lg px-3 py-2 outline-none appearance-none"
                      style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 12, color: cliente.fase ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}>
                      <option value="">Selecionar...</option>
                      {FASES.map(f => <option key={f.value} value={f.value} style={{ background: '#111' }}>{f.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Dados Financeiros */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-[10px] font-mono font-bold text-white/25 uppercase tracking-widest mb-3">Dados Financeiros</p>
              <div className="flex flex-col gap-2.5">
                {([
                  ['receita', 'Receita Mensal', 'Faturamento bruto médio dos últimos 3 meses'],
                  ['despesas', 'Despesas Operacionais', 'Aluguel + salários + marketing + mercadoria'],
                  ['caixa', 'Caixa Disponível', 'Saldo bancário atual'],
                  ['divida', 'Parcelas de Dívidas/Mês', 'Empréstimos, antecipações, financiamentos ativos'],
                ] as [keyof ClienteData, string, string][]).map(([campo, label, hint]) => (
                  <div key={campo}>
                    <label className="text-[11px] text-white/35 mb-0.5 block">{label}</label>
                    <div className="flex items-center gap-2 rounded-lg px-3 py-2"
                      style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <span className="text-[12px] font-mono text-white/30">R$</span>
                      <input type="number" value={(cliente[campo] as number) || ''}
                        onChange={e => update(campo, e.target.value)}
                        placeholder="0"
                        className="flex-1 bg-transparent outline-none text-[14px] font-mono text-white/80"
                        style={{ border: 'none' }} />
                    </div>
                    <p className="text-[10px] text-white/20 mt-0.5 pl-1">{hint}</p>
                  </div>
                ))}
                <div>
                  <label className="text-[11px] text-white/35 mb-1 block">Exposição ao Dólar — {cliente.pctDolar}%</label>
                  <input type="range" min={0} max={100} value={cliente.pctDolar}
                    onChange={e => update('pctDolar', e.target.value)}
                    style={{ width: '100%', accentColor: '#5dade2', height: 6 }} />
                  <p className="text-[10px] text-white/20 mt-0.5">% dos custos em insumos importados ou ferramentas em dólar</p>
                </div>
              </div>
            </div>

            {/* Operacional — Clientes */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-mono font-bold text-white/25 uppercase tracking-widest">Operacional — Clientes</p>
                <button onClick={() => update('modoManual', !cliente.modoManual)}
                  className="flex items-center gap-1.5 text-[10px] transition-colors"
                  style={{ color: cliente.modoManual ? '#5dade2' : 'rgba(255,255,255,0.25)' }}>
                  {cliente.modoManual ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                  Manual
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {([
                  ['clientesAtivos', 'Clientes Ativos', ''],
                  ['novosClientes', 'Novos (mês)', ''],
                  ['clientesPerdidos', 'Perdidos (mês)', ''],
                  ['verbaMkt', 'Verba Mkt', 'R$'],
                ] as [keyof ClienteData, string, string][]).map(([campo, label, prefix]) => (
                  <div key={campo}>
                    <label className="text-[11px] text-white/35 mb-0.5 block">{label}</label>
                    <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-2"
                      style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {prefix && <span className="text-[11px] font-mono text-white/30">{prefix}</span>}
                      <input type="number" value={(cliente[campo] as number) || ''}
                        onChange={e => update(campo, e.target.value)}
                        placeholder="0"
                        className="flex-1 bg-transparent outline-none text-[13px] font-mono text-white/80"
                        style={{ border: 'none', minWidth: 0 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Preview KPIs */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: 'Ticket Médio', value: fmtBRL(previewTicket) },
                  { label: 'CAC', value: fmtBRL(previewCac) },
                  { label: 'Churn', value: `${fmtDec(previewChurn)}%` },
                ].map(kpi => (
                  <div key={kpi.label} className="rounded-lg p-2 text-center"
                    style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${cliente.modoManual ? 'rgba(93,173,226,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
                    <p className="text-[9px] text-white/25 mb-0.5">{kpi.label}</p>
                    <p className="text-[12px] font-mono font-bold text-white/60">{kpi.value}</p>
                    <p className="text-[8px] text-white/20 mt-0.5">{cliente.modoManual ? 'manual' : 'auto'}</p>
                  </div>
                ))}
              </div>

              {/* Inputs manuais */}
              {cliente.modoManual && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {([
                    ['ticketManual', 'Ticket', 'R$'],
                    ['cacManual', 'CAC', 'R$'],
                    ['churnManual', 'Churn', '%'],
                  ] as [keyof ClienteData, string, string][]).map(([campo, label, prefix]) => (
                    <div key={campo}>
                      <label className="text-[10px] text-white/30 mb-0.5 block">{label}</label>
                      <div className="flex items-center gap-1 rounded-lg px-2 py-1.5"
                        style={{ background: 'rgba(93,173,226,0.06)', border: '1px solid rgba(93,173,226,0.2)' }}>
                        <span className="text-[10px] font-mono text-white/25">{prefix}</span>
                        <input type="number" value={(cliente[campo] as number) || ''}
                          onChange={e => update(campo, e.target.value)}
                          placeholder="0"
                          className="flex-1 bg-transparent outline-none text-[12px] font-mono text-white/75"
                          style={{ border: 'none', minWidth: 0 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setStep('diagnostico')}
              className="w-full rounded-lg py-2.5 flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: '#5dade2', color: '#0a0a0a', fontSize: 13, fontWeight: 600 }}>
              <Target size={14} />
              Gerar Diagnóstico OBI →
            </button>
          </motion.div>
        )}

        {/* ── DIAGNÓSTICO ── */}
        {step === 'diagnostico' && !editandoPerfil && (
          <motion.div key="diag" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-4">

            {/* Área capturada no PDF */}
            <div ref={pdfRef} style={{ background: '#0a0d12' }}>

              {/* Header com branding do consultor */}
              <div className="rounded-xl p-4 mb-4" style={{ background: `${BLUE}15`, border: `1px solid ${BLUE}30` }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-mono font-bold text-white/25 uppercase tracking-widest">Diagnóstico OBI · IP Business</p>
                    <p className="text-[14px] font-bold text-white/85 mt-0.5">
                      {cliente.nome || 'Cliente'}{cliente.setor ? ` · ${cliente.setor}` : ''}
                    </p>
                    {cliente.fase && (
                      <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded"
                        style={{ background: `${BLUE}25`, color: '#5dade2' }}>
                        {FASES.find(f => f.value === cliente.fase)?.label ?? cliente.fase}
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    {consultor.nome && (
                      <>
                        <p className="text-[11px] font-bold text-white/55">{consultor.nome}</p>
                        {consultor.empresa && <p className="text-[10px] text-white/28">{consultor.empresa}</p>}
                      </>
                    )}
                    <p className="text-[10px] text-white/20 mt-0.5 font-mono">{new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </div>

              {diag ? (
                <>
                  {/* Health Score */}
                  <div className="rounded-xl p-4 mb-4" style={{ background: `${diag.healthColor}12`, border: `2px solid ${diag.healthColor}40` }}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-[10px] font-mono font-bold text-white/25 uppercase tracking-widest">Health Score</p>
                        <p className="text-[13px] font-bold mt-0.5" style={{ color: diag.healthColor }}>
                          {diag.healthScore}/100 · {diag.healthLabel}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[32px] font-bold font-mono leading-none" style={{ color: diag.healthColor }}>{diag.healthScore}</p>
                        <p className="text-[9px] text-white/20 font-mono">/100</p>
                      </div>
                    </div>
                    {diag.alerts.length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        {diag.alerts.map((a, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <AlertTriangle size={11} style={{ color: a.level === 'red' ? RED : AMBER, flexShrink: 0, marginTop: 1 }} />
                            <p className="text-[11px]" style={{ color: a.level === 'red' ? RED : AMBER }}>{a.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* KPIs Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { label: 'Margem', value: `${fmtDec(diag.margem)}%`, color: colorByRange(diag.margem, 20, 10), desc: `Real: ${fmtDec(diag.margemReal)}%` },
                      { label: 'Runway', value: `${fmtDec(diag.runwayMeses, 1)}m`, color: colorByRange(diag.runwayMeses, 6, 3), desc: 'Meses de sobrevivência' },
                      { label: 'LTV/CAC', value: `${fmtDec(diag.ltvCac, 1)}x`, color: colorByRange(diag.ltvCac, 3, 1), desc: `LTV ${fmtBRL(diag.ltv)}` },
                      { label: 'Churn/mês', value: `${fmtDec(diag.churnMensal)}%`, color: colorByRange(5 - diag.churnMensal, 3, 1), desc: `CAC ${fmtBRL(diag.cac)}` },
                    ].map(card => (
                      <div key={card.label} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', borderTop: `2px solid ${card.color}` }}>
                        <p className="text-[10px] text-white/30 mb-1">{card.label}</p>
                        <p className="text-[16px] font-bold font-mono" style={{ color: card.color }}>{card.value}</p>
                        <p className="text-[10px] text-white/20 mt-1">{card.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Smart Pricing */}
                  {diag.erosaoMargem > 2 && (
                    <div className="rounded-lg p-3 mb-3" style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}30` }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <TrendingUp size={13} style={{ color: AMBER }} />
                        <span className="text-[11px] font-bold font-mono text-white/50">SMART PRICING — REAJUSTE NECESSÁRIO</span>
                      </div>
                      <p className="text-[12px] text-white/60 leading-relaxed">
                        IPCA <span className="font-mono" style={{ color: AMBER }}>{fmtDec(ipcaRate)}%</span> + câmbio{' '}
                        <span className="font-mono" style={{ color: AMBER }}>R${fmtDec(usdRate, 2)}</span> ({cliente.pctDolar}% exposição):
                      </p>
                      <p className="text-[13px] font-bold font-mono mt-1" style={{ color: GREEN }}>
                        Receita de proteção: {fmtBRL(Math.round(diag.receitaReajustada))}/mês
                        <span className="text-[11px] font-normal text-white/30 ml-2">(+{fmtDec(diag.reajusteNecessario * 100)}%)</span>
                      </p>
                    </div>
                  )}

                  {/* Custo capital */}
                  {cliente.divida > 0 && (
                    <div className="rounded-lg p-3 mb-3" style={{ background: `${RED}08`, border: `1px solid ${RED}25` }}>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle size={12} style={{ color: RED }} />
                        <span className="text-[11px] font-mono font-bold text-white/40">CUSTO DO CAPITAL — SELIC {fmtDec(selicRate, 2)}%</span>
                      </div>
                      <p className="text-[12px] text-white/55">
                        Custo real das dívidas:{' '}
                        <span className="font-mono font-bold" style={{ color: RED }}>{fmtBRL(Math.round(diag.custoCapital))}/mês</span>
                        {' '}adicional além da parcela declarada
                      </p>
                    </div>
                  )}

                  {/* Relatório IA */}
                  {iaReport && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${BLUE}30` }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText size={13} style={{ color: '#5dade2' }} />
                          <span className="text-[10px] font-mono font-bold tracking-widest text-white/40">RELATÓRIO OBI</span>
                        </div>
                        {cliente.nome && <span className="text-[10px] font-mono text-white/25">{cliente.nome}</span>}
                      </div>
                      <div className="text-[13px] text-white/65 leading-relaxed whitespace-pre-line">{iaReport}</div>
                      <div className="mt-4 pt-3 flex items-start justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-[10px] font-mono text-white/20">"Pensar estrategicamente e agir operacionalmente." — Peter, 1993</p>
                        <div className="text-right shrink-0 ml-3">
                          {consultor.nome && (
                            <p className="text-[10px] font-mono text-white/30">
                              por <span className="text-white/50">{consultor.nome}</span>
                              {consultor.empresa && <span className="text-white/25"> · {consultor.empresa}</span>}
                            </p>
                          )}
                          <p className="text-[9px] font-mono text-white/15 mt-0.5">via IP Business · {new Date().toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Rodapé PDF */}
                  <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="text-[9px] font-mono text-white/15">IP Business · OBI Diagnóstico</p>
                    <p className="text-[9px] font-mono text-white/15">{new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                </>
              ) : (
                <div className="rounded-xl p-8 text-center" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-[13px] text-white/30">Preencha os dados financeiros para gerar o diagnóstico.</p>
                  <button onClick={() => setStep('form')} className="mt-3 text-[12px]" style={{ color: '#5dade2' }}>
                    ← Voltar ao formulário
                  </button>
                </div>
              )}
            </div>

            {diag && (
              <div className="flex flex-col gap-2">
                <button onClick={handleGerarIA} disabled={iaLoading}
                  className="w-full rounded-lg py-3 flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: BLUE, color: '#fff', fontSize: 13, fontWeight: 600 }}>
                  {iaLoading ? <Loader2 size={15} className="animate-spin" /> : <Brain size={15} />}
                  {iaLoading ? 'Gerando Relatório OBI...' : iaReport ? 'Regenerar Relatório IA' : 'Gerar Relatório OBI com IA'}
                </button>

                {iaReport && (
                  <button onClick={exportPDF} disabled={pdfLoading}
                    className="w-full rounded-lg py-2.5 flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600 }}>
                    {pdfLoading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                    {pdfLoading ? 'Gerando PDF...' : 'Exportar PDF com Branding'}
                  </button>
                )}

                <button onClick={() => setStep('form')}
                  className="w-full rounded-lg py-2 text-[12px] text-white/30 hover:text-white/50 transition-colors">
                  ← Editar dados do cliente
                </button>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
