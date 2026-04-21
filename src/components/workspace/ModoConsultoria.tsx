'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, FileText, Loader2, AlertTriangle, Brain,
  TrendingUp, Target, CheckCircle2, RefreshCw, ChevronRight,
} from 'lucide-react'

const RED = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE = '#1a5276'

function fmt(v: number) { return v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
function fmtDec(v: number, d = 1) { return v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }) }
function colorByRange(v: number, g: number, a: number) { return v >= g ? GREEN : v >= a ? AMBER : RED }

interface ClienteData {
  nome: string
  faturamento: number
  custos: number
  divida: number
  pctDolar: number
  runwayMeses: number
}

const EMPTY: ClienteData = { nome: '', faturamento: 0, custos: 0, divida: 0, pctDolar: 0, runwayMeses: 3 }

const PERGUNTAS = [
  {
    campo: 'faturamento' as keyof ClienteData,
    titulo: 'Faturamento Médio Mensal',
    subtitulo: 'Qual foi a média de faturamento mensal nos últimos 3 meses?',
    prefix: 'R$',
    tipo: 'number',
    why: 'Base do SIO — sem receita não há cálculo de margem ou runway',
  },
  {
    campo: 'custos' as keyof ClienteData,
    titulo: 'Custo Total de Operação',
    subtitulo: 'Somando aluguel, salários, marketing e mercadoria, quanto gasta por mês?',
    prefix: 'R$',
    tipo: 'number',
    why: 'Define o SIG — permite calcular Margem Real e Lucro Líquido',
  },
  {
    campo: 'divida' as keyof ClienteData,
    titulo: 'Parcela Mensal de Dívidas / Juros',
    subtitulo: 'Empréstimos, antecipação de recebíveis ou financiamentos ativos? Qual o total mensal?',
    prefix: 'R$',
    tipo: 'number',
    why: 'Ativa o SIE — com SELIC 14.75% o sistema detecta se o lucro está sendo "comido" pelo capital',
  },
  {
    campo: 'pctDolar' as keyof ClienteData,
    titulo: 'Exposição ao Dólar / Inflação',
    subtitulo: 'Qual % do seu custo depende de insumos importados ou ferramentas pagas em dólar?',
    prefix: '%',
    tipo: 'range',
    why: 'Alimenta o Smart Pricing — cruza com USD R$4,98 e IPCA para detectar "prejuízo invisível"',
  },
  {
    campo: 'runwayMeses' as keyof ClienteData,
    titulo: 'Runway Atual (Meses de Caixa)',
    subtitulo: 'Se parar de vender hoje, por quantos meses o saldo bancário paga suas despesas fixas?',
    prefix: 'meses',
    tipo: 'range',
    why: 'Gera o Health Score e o senso de urgência — base do diagnóstico de sobrevivência',
  },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ModoConsultoria({ marketData }: { marketData: any }) {
  const [step, setStep] = useState<'intro' | 'form' | 'diagnostico'>('intro')
  const [perguntaIdx, setPerguntaIdx] = useState(0)
  const [cliente, setCliente] = useState<ClienteData>(EMPTY)
  const [iaLoading, setIaLoading] = useState(false)
  const [iaReport, setIaReport] = useState('')
  const [showScript, setShowScript] = useState(false)

  const selicRate = marketData?.macro?.selic?.value ?? 14.75
  const ipcaRate = marketData?.macro?.ipca?.value ?? 4.14
  const usdRate = marketData?.macro?.usdBrl?.value ?? 4.98
  const cambioRef = 4.50

  const diag = useMemo(() => {
    const { faturamento, custos, divida, pctDolar, runwayMeses } = cliente
    if (faturamento === 0) return null

    const lucro = faturamento - custos - divida
    const margem = (lucro / faturamento) * 100

    const fatorCambio = 1 + (pctDolar / 100) * (usdRate / cambioRef - 1)
    const custoReal = custos * fatorCambio * (1 + ipcaRate / 100)
    const lucroReal = faturamento - custoReal - divida
    const margemReal = (lucroReal / faturamento) * 100
    const erosaoMargem = margem - margemReal

    const reajusteNecessario = (ipcaRate / 100) + (pctDolar / 100 * (usdRate / cambioRef - 1))
    const faturamentoReajustado = faturamento * (1 + reajusteNecessario)

    const cdiMensal = (selicRate - 0.1) / 12
    const custoCapital = divida > 0 ? divida * (selicRate * 2.5 / 100 / 12) : 0

    // Health Score (0-100)
    const margemNorm = Math.max(Math.min(margem / 30, 1), 0) * 25
    const runwayNorm = Math.min(runwayMeses / 12, 1) * 40
    const erosaoNorm = Math.max(20 - erosaoMargem * 2, 0)
    const dividaNorm = divida === 0 ? 15 : Math.max(15 - (divida / faturamento) * 60, 0)
    const healthScore = Math.round(margemNorm + runwayNorm + erosaoNorm + dividaNorm)

    const healthColor = healthScore >= 70 ? GREEN : healthScore >= 40 ? AMBER : RED
    const healthLabel = healthScore >= 70 ? 'Saudável' : healthScore >= 40 ? 'Risco Moderado' : 'Crítico'

    const alerts: { level: 'red' | 'amber'; text: string }[] = []
    if (margem < 0) alerts.push({ level: 'red', text: `Margem negativa (${fmtDec(margem)}%) — operação gerando prejuízo` })
    else if (margem < 10) alerts.push({ level: 'amber', text: `Margem ${fmtDec(margem)}% abaixo do mínimo saudável (20%)` })
    if (erosaoMargem > 5) alerts.push({ level: 'amber', text: `IPCA + câmbio corroem ${fmtDec(erosaoMargem)}pp de margem — "prejuízo invisível"` })
    if (runwayMeses < 3) alerts.push({ level: 'red', text: `Runway crítico: ${runwayMeses} meses — liquidez em risco imediato` })
    else if (runwayMeses < 6) alerts.push({ level: 'amber', text: `Runway apertado: ${runwayMeses} meses — planejar captação` })
    if (divida > faturamento * 0.25) alerts.push({ level: 'red', text: `Dívida ${fmtDec((divida / faturamento) * 100)}% da receita com SELIC ${fmtDec(selicRate, 2)}%` })

    return {
      lucro, margem, lucroReal, margemReal, custoReal, erosaoMargem,
      reajusteNecessario, faturamentoReajustado, custoCapital, cdiMensal,
      healthScore, healthColor, healthLabel, alerts,
    }
  }, [cliente, selicRate, ipcaRate, usdRate])

  const handleGerarIA = async () => {
    if (!diag) return
    setIaLoading(true)
    setIaReport('')
    const q = `Você é um consultor sênior de Inteligência Organizacional (OBI) baseado em Rezende e Peter. Gere um diagnóstico executivo para o cliente "${cliente.nome || 'Cliente Alpha'}".

DADOS DO CLIENTE:
- Faturamento mensal: R$${fmt(cliente.faturamento)}
- Custos operacionais: R$${fmt(cliente.custos)}
- Dívidas/juros mensais: R$${fmt(cliente.divida)}
- Exposição ao dólar: ${cliente.pctDolar}%
- Runway: ${cliente.runwayMeses} meses

ANÁLISE DO SISTEMA IPB:
- Margem nominal: ${fmtDec(diag.margem)}%
- Margem real (c/ inflação/câmbio): ${fmtDec(diag.margemReal)}%
- Erosão de margem: ${fmtDec(diag.erosaoMargem)}pp
- Health Score: ${diag.healthScore}/100 (${diag.healthLabel})
- SELIC: ${fmtDec(selicRate, 2)}% | IPCA: ${fmtDec(ipcaRate, 1)}% | USD: R$${fmtDec(usdRate, 2)}

Estruture o diagnóstico assim (use EXATAMENTE estes títulos):

📊 SUMÁRIO EXECUTIVO
(3 linhas: saúde atual, risco principal, veredito)

🔍 GARGALO IDENTIFICADO
(o que está destruindo margem — use os dados reais)

⚡ PLANO DE AÇÃO
48h: [ação específica com número]
15 dias: [ação específica]
30 dias: [ação estratégica]

💡 PERGUNTA DE REFLEXÃO
(1 pergunta estratégica para o gestor pensar)

Seja cirúrgico, use os dados reais, máx 280 palavras.`

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

  const resetCliente = () => {
    setCliente(EMPTY)
    setStep('intro')
    setIaReport('')
    setPerguntaIdx(0)
  }

  const updateField = (campo: keyof ClienteData, val: string | number) => {
    setCliente(prev => ({ ...prev, [campo]: typeof val === 'string' ? val : Number(val) || 0 }))
  }

  const pAtual = PERGUNTAS[perguntaIdx]

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
        {step !== 'intro' && (
          <button onClick={resetCliente} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] text-white/30 hover:text-white/50 hover:bg-white/5 transition-colors">
            <RefreshCw size={11} />
            Novo Cliente
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">

        {/* INTRO */}
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="rounded-xl p-5" style={{ background: `${BLUE}10`, border: `1px solid ${BLUE}30` }}>
              <p className="text-[11px] font-mono font-bold text-white/30 uppercase tracking-widest mb-3">Roteiro de Diagnóstico OBI</p>
              {[
                { label: 'SIO — Captura de Dados', desc: 'Faturamento, custos e dívidas do cliente' },
                { label: 'SIG — Rentabilidade', desc: 'Margem real, breakeven, "prejuízo invisível"' },
                { label: 'SIE — Cenários', desc: 'Impacto de SELIC, câmbio e IPCA' },
                { label: 'OBI — Relatório', desc: 'Diagnóstico executivo + plano de ação 48h/15d/30d' },
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
              <div className="mb-3">
                <label className="text-[11px] text-white/30">Nome do cliente (opcional)</label>
                <input
                  value={cliente.nome}
                  onChange={e => updateField('nome', e.target.value)}
                  placeholder="Ex: Agro São Paulo, Consultora Maria..."
                  className="mt-1.5 w-full rounded-lg px-3 py-2 bg-transparent outline-none"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}
                />
              </div>
              <button
                onClick={() => setStep('form')}
                className="w-full rounded-lg py-2.5 flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ background: BLUE, color: '#fff', fontSize: 13, fontWeight: 600 }}
              >
                <ChevronRight size={14} />
                Iniciar Diagnóstico (5 perguntas)
              </button>
            </div>

            {/* Script colapsável */}
            <div className="mt-3 rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              <button className="w-full flex items-center justify-between px-3 py-2.5"
                style={{ background: 'rgba(0,0,0,0.2)' }}
                onClick={() => setShowScript(!showScript)}>
                <span className="text-[11px] font-bold text-white/40">📋 Script de abordagem para clientes</span>
                <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.25)', transform: showScript ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {showScript && (
                <div className="px-3 py-3 flex flex-col gap-2" style={{ background: 'rgba(0,0,0,0.15)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-[11px] text-white/50 leading-relaxed italic">
                    "Eu não quero que você mude agora. Eu quero te mostrar como a IA interpreta os dados que você já tem na planilha
                    e te dá um Gatilho de Decisão que o Excel não consegue.
                    Me deixa rodar um diagnóstico rápido com 5 números para ver se a IA encontra um 'ponto cego' na sua margem?"
                  </p>
                  <p className="text-[10px] font-mono" style={{ color: AMBER }}>
                    Você não vende acesso — você vende co-autoria. Primeiros clientes sentem que o produto foi feito para eles.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* PERGUNTAS */}
        {step === 'form' && (
          <motion.div key="form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              {PERGUNTAS.map((_, i) => (
                <div key={i} className="flex-1 h-1 rounded-full" style={{ background: i <= perguntaIdx ? '#5dade2' : 'rgba(255,255,255,0.1)' }} />
              ))}
            </div>

            <div className="rounded-xl p-5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-[10px] font-mono font-bold text-white/25 uppercase tracking-widest mb-1">
                Pergunta {perguntaIdx + 1} de {PERGUNTAS.length}
              </p>
              <p className="text-[14px] font-bold text-white/80 mb-1">{pAtual.titulo}</p>
              <p className="text-[12px] text-white/40 mb-4 leading-relaxed">{pAtual.subtitulo}</p>

              <div className="mb-3">
                {pAtual.tipo === 'number' ? (
                  <div className="flex items-center gap-2 rounded-lg px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <span className="text-[13px] font-mono text-white/40">{pAtual.prefix}</span>
                    <input
                      type="number"
                      value={(cliente[pAtual.campo] as number) || ''}
                      onChange={e => updateField(pAtual.campo, e.target.value)}
                      placeholder="0"
                      className="flex-1 bg-transparent outline-none text-[16px] font-mono text-white/85"
                      style={{ border: 'none' }}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={pAtual.campo === 'pctDolar' ? 0 : 0}
                        max={pAtual.campo === 'pctDolar' ? 100 : 24}
                        value={cliente[pAtual.campo] as number}
                        onChange={e => updateField(pAtual.campo, e.target.value)}
                        style={{ flex: 1, accentColor: '#5dade2', height: 6 }}
                      />
                      <span className="text-[18px] font-bold font-mono text-white/80" style={{ minWidth: 60, textAlign: 'right' }}>
                        {cliente[pAtual.campo]}{pAtual.campo === 'pctDolar' ? '%' : 'm'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-md px-3 py-2 mb-4" style={{ background: `${BLUE}10`, border: `1px solid ${BLUE}20` }}>
                <p className="text-[10px] text-white/30"><span className="font-mono" style={{ color: '#5dade2' }}>Por que pedimos:</span> {pAtual.why}</p>
              </div>

              <div className="flex gap-2">
                {perguntaIdx > 0 && (
                  <button onClick={() => setPerguntaIdx(i => i - 1)}
                    className="px-4 py-2 rounded-lg text-[12px] text-white/40 hover:text-white/60 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    Voltar
                  </button>
                )}
                <button
                  onClick={() => {
                    if (perguntaIdx < PERGUNTAS.length - 1) setPerguntaIdx(i => i + 1)
                    else setStep('diagnostico')
                  }}
                  className="flex-1 py-2.5 rounded-lg text-[13px] font-bold transition-opacity hover:opacity-90"
                  style={{ background: '#5dade2', color: '#0a0a0a' }}
                >
                  {perguntaIdx < PERGUNTAS.length - 1 ? 'Próxima pergunta →' : 'Gerar Diagnóstico OBI →'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* DIAGNÓSTICO */}
        {step === 'diagnostico' && diag && (
          <motion.div key="diag" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-4">

            {/* Flash diagnóstico */}
            <div className="rounded-xl p-4" style={{ background: `${diag.healthColor}12`, border: `2px solid ${diag.healthColor}40` }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] font-mono font-bold text-white/25 uppercase tracking-widest">
                    {cliente.nome ? `Diagnóstico — ${cliente.nome}` : 'Diagnóstico OBI'}
                  </p>
                  <p className="text-[13px] font-bold mt-0.5" style={{ color: diag.healthColor }}>
                    Health Score {diag.healthScore}/100 · {diag.healthLabel}
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

            {/* Grid de indicadores */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Margem Nominal', value: `${fmtDec(diag.margem)}%`, color: colorByRange(diag.margem, 20, 10), desc: 'Antes do efeito macro' },
                { label: 'Margem Real', value: `${fmtDec(diag.margemReal)}%`, color: colorByRange(diag.margemReal, 15, 5), desc: 'c/ IPCA + câmbio' },
                { label: 'Lucro Mensal', value: `R$${fmt(Math.round(diag.lucro))}`, color: diag.lucro >= 0 ? GREEN : RED, desc: 'Receita − custos − dívidas' },
                { label: 'Runway', value: `${cliente.runwayMeses}m`, color: colorByRange(cliente.runwayMeses, 6, 3), desc: 'Meses de sobrevivência' },
              ].map(card => (
                <div key={card.label} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', borderTop: `2px solid ${card.color}` }}>
                  <p className="text-[10px] text-white/30 mb-1">{card.label}</p>
                  <p className="text-[16px] font-bold font-mono" style={{ color: card.color }}>{card.value}</p>
                  <p className="text-[10px] text-white/20 mt-1">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Smart Pricing insight */}
            {diag.erosaoMargem > 2 && (
              <div className="rounded-lg p-3" style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}30` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <TrendingUp size={13} style={{ color: AMBER }} />
                  <span className="text-[11px] font-bold font-mono text-white/50">SMART PRICING — REAJUSTE NECESSÁRIO</span>
                </div>
                <p className="text-[12px] text-white/60 leading-relaxed">
                  Para absorver IPCA <span className="font-mono" style={{ color: AMBER }}>{fmtDec(ipcaRate)}%</span> e câmbio{' '}
                  <span className="font-mono" style={{ color: AMBER }}>R${fmtDec(usdRate, 2)}</span> com exposição{' '}
                  <span className="font-mono" style={{ color: AMBER }}>{cliente.pctDolar}%</span> em dólar:
                </p>
                <p className="text-[13px] font-bold font-mono mt-2" style={{ color: GREEN }}>
                  Receita de proteção: R${fmt(Math.round(diag.faturamentoReajustado))}/mês
                  <span className="text-[11px] font-normal text-white/30 ml-2">(+{fmtDec(diag.reajusteNecessario * 100)}%)</span>
                </p>
              </div>
            )}

            {/* Impacto SELIC */}
            {cliente.divida > 0 && (
              <div className="rounded-lg p-3" style={{ background: `${RED}08`, border: `1px solid ${RED}25` }}>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={12} style={{ color: RED }} />
                  <span className="text-[11px] font-mono font-bold text-white/40">CUSTO DO CAPITAL — SELIC {fmtDec(selicRate, 2)}%</span>
                </div>
                <p className="text-[12px] text-white/55">
                  Custo real das dívidas com juros de mercado:{' '}
                  <span className="font-mono font-bold" style={{ color: RED }}>R${fmt(Math.round(diag.custoCapital))}/mês</span>
                  {' '}adicional além da parcela declarada
                </p>
              </div>
            )}

            {/* Botão gerar relatório IA */}
            <button onClick={handleGerarIA} disabled={iaLoading}
              className="w-full rounded-lg py-3 flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: BLUE, color: '#fff', fontSize: 13, fontWeight: 600 }}>
              {iaLoading ? <Loader2 size={15} className="animate-spin" /> : <Brain size={15} />}
              {iaLoading ? 'Gerando Relatório OBI...' : 'Gerar Relatório OBI com IA'}
            </button>

            {/* Relatório IA */}
            {iaReport && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-4"
                style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${BLUE}30` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText size={13} style={{ color: '#5dade2' }} />
                    <span className="text-[10px] font-mono font-bold tracking-widest text-white/40">RELATÓRIO OBI · {new Date().toLocaleDateString('pt-BR')}</span>
                  </div>
                  {cliente.nome && <span className="text-[10px] font-mono text-white/25">{cliente.nome}</span>}
                </div>
                <div className="text-[13px] text-white/65 leading-relaxed whitespace-pre-line">{iaReport}</div>
                <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-[10px] font-mono text-white/20">
                    "Pensar estrategicamente e agir operacionalmente." — Peter, 1993
                  </p>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={11} style={{ color: GREEN }} />
                    <span className="text-[10px] font-mono text-white/25">IPB · OBI Diagnóstico</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
