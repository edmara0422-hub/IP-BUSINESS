'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Loader2, Copy, AlertTriangle, CheckCircle2, FileText,
  TrendingUp, Heart, Shield,
} from 'lucide-react'

const RED = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE = '#1a5276'

interface RadioOption { label: string; score: number }

interface ISEQuestion {
  id: string
  text: string
  options: RadioOption[]
}

const ISE_QUESTIONS: ISEQuestion[] = [
  { id: 'ise1', text: 'A empresa publica relatório de sustentabilidade?', options: [
    { label: 'Sim, GRI + asseguração externa', score: 3 }, { label: 'Sim, sem asseguração', score: 2 }, { label: 'Não publica', score: 0 },
  ]},
  { id: 'ise2', text: 'Tem política de mudanças climáticas com metas?', options: [
    { label: 'Sim, com SBTi', score: 3 }, { label: 'Sim, metas internas', score: 2 }, { label: 'Não', score: 0 },
  ]},
  { id: 'ise3', text: 'Governança ESG vinculada ao conselho?', options: [
    { label: 'Comitê ESG no conselho', score: 3 }, { label: 'Diretoria ESG', score: 2 }, { label: 'Área operacional', score: 1 }, { label: 'Não tem', score: 0 },
  ]},
  { id: 'ise4', text: 'Participou do CDP (Carbon Disclosure Project)?', options: [
    { label: 'Sim, nota A/A-', score: 3 }, { label: 'Sim, nota B ou C', score: 2 }, { label: 'Respondeu mas D', score: 1 }, { label: 'Nunca participou', score: 0 },
  ]},
  { id: 'ise5', text: 'Tem programa anticorrupção + canal de denúncias?', options: [
    { label: 'Sim, com auditoria independente', score: 3 }, { label: 'Sim, interno', score: 2 }, { label: 'Só código de ética', score: 1 }, { label: 'Não', score: 0 },
  ]},
]

function badge(pct: number): { label: string; color: string } {
  if (pct >= 70) return { label: 'ELEGÍVEL', color: GREEN }
  if (pct >= 40) return { label: 'PARCIAL', color: AMBER }
  return { label: 'NÃO ELEGÍVEL', color: RED }
}

export default function ISEISPFramework({ marketData }: { marketData: any }) {
  const [iseAnswers, setIseAnswers] = useState<Record<string, string>>({})
  const [iseScores, setIseScores] = useState<Record<string, number>>({})
  const [iseAnalysis, setIseAnalysis] = useState('')
  const [iseLoading, setIseLoading] = useState(false)

  const [revenue, setRevenue] = useState('')
  const [currentISP, setCurrentISP] = useState('')
  const [sector, setSector] = useState('')
  const [ispAnalysis, setIspAnalysis] = useState('')
  const [ispLoading, setIspLoading] = useState(false)

  const [report, setReport] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const marketContext = useMemo(() => {
    if (!marketData) return 'Dados de mercado indisponíveis'
    return `SELIC: ${marketData.selic ?? 'N/A'}% | IPCA: ${marketData.ipca ?? 'N/A'}% | USD: R$${marketData.usd ?? 'N/A'} | PIB: ${marketData.pib ?? 'N/A'}%`
  }, [marketData])

  const handleISEAnswer = (qId: string, label: string) => {
    const q = ISE_QUESTIONS.find(x => x.id === qId)!
    const score = q.options.find(o => o.label === label)?.score ?? 0
    setIseAnswers(prev => ({ ...prev, [qId]: label }))
    setIseScores(prev => ({ ...prev, [qId]: score }))
  }

  const iseScore = useMemo(() => {
    const answered = ISE_QUESTIONS.filter(q => iseScores[q.id] !== undefined)
    if (answered.length === 0) return { sum: 0, max: 15, pct: 0, answered: 0 }
    const sum = answered.reduce((a, q) => a + (iseScores[q.id] ?? 0), 0)
    return { sum, max: 15, pct: Math.round((sum / 15) * 100), answered: answered.length }
  }, [iseScores])

  const ispRecommended = useMemo(() => {
    const rev = parseFloat(revenue) || 0
    if (rev === 0) return { min: 0, max: 0, current: 0, pctCurrent: 0 }
    const cur = parseFloat(currentISP) || 0
    return { min: rev * 0.01, max: rev * 0.02, current: cur, pctCurrent: rev > 0 ? (cur / rev) * 100 : 0 }
  }, [revenue, currentISP])

  const callIA = useCallback(async (question: string): Promise<string> => {
    try {
      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, marketContext }),
      })
      const data = await res.json()
      return data.answer || 'Sem resposta da IA.'
    } catch { return 'Erro ao consultar IA. Tente novamente.' }
  }, [marketContext])

  const analyzeISE = useCallback(async () => {
    setIseLoading(true)
    const answersText = ISE_QUESTIONS.map(q => `${q.text} → ${iseAnswers[q.id] ?? 'Não respondido'} (${iseScores[q.id] ?? 0}/3)`).join('\n')
    const prompt = `Avalie se esta empresa seria elegível para o ISE B3 (Índice de Sustentabilidade Empresarial da B3).

RESPOSTAS:
${answersText}

Score: ${iseScore.sum}/15 (${iseScore.pct}%) — ${badge(iseScore.pct).label}
Mercado: ${marketContext}

CONCEITO: "Estar no ISE = opção sólida de investimento = custo de capital menor"

Dê:
1) Elegibilidade: SIM/PARCIAL/NÃO e por quê
2) Gaps para atender os requisitos ISE B3
3) Benefícios financeiros de estar no ISE (custo de capital, reputação, acesso a investidores ESG)
4) 3 ações prioritárias para melhorar elegibilidade
5) Comparação: empresas do ISE vs. não-ISE (performance financeira)`

    const result = await callIA(prompt)
    setIseAnalysis(result)
    setIseLoading(false)
  }, [iseAnswers, iseScores, iseScore, callIA, marketContext])

  const analyzeISP = useCallback(async () => {
    setIspLoading(true)
    const prompt = `Analise o Investimento Social Privado (ISP) desta empresa.

DADOS:
Receita anual: R$ ${revenue || 'Não informado'}
ISP atual: R$ ${currentISP || 'Não informado'} (${ispRecommended.pctCurrent.toFixed(2)}% da receita)
Setor: ${sector || 'Não informado'}
ISP recomendado: 1-2% da receita = R$ ${ispRecommended.min.toLocaleString('pt-BR')} a R$ ${ispRecommended.max.toLocaleString('pt-BR')}

Mercado: ${marketContext}

Dê:
1) O ISP atual é adequado? Acima ou abaixo do benchmark?
2) Melhores iniciativas de ISP para o setor ${sector || 'não informado'}
3) Como usar leis de incentivo (Rouanet, Lei do Esporte, FIA/FMDCA, PRONON/PRONAS)
4) ROI do ISP: benefício fiscal + reputação + engajamento
5) 3 ações concretas com orçamento sugerido`

    const result = await callIA(prompt)
    setIspAnalysis(result)
    setIspLoading(false)
  }, [revenue, currentISP, sector, ispRecommended, callIA, marketContext])

  const generateReport = useCallback(async () => {
    setReportLoading(true)
    const iseData = ISE_QUESTIONS.map(q => `${q.text} → ${iseAnswers[q.id] ?? 'N/R'}`).join('\n')
    const prompt = `Gere um relatório ISE B3 + ISP completo.

ISE B3:
${iseData}
Score ISE: ${iseScore.pct}% — ${badge(iseScore.pct).label}

ISP:
Receita: R$ ${revenue || 'N/I'} | ISP atual: R$ ${currentISP || 'N/I'} (${ispRecommended.pctCurrent.toFixed(2)}%)
Setor: ${sector || 'N/I'}
Recomendado: R$ ${ispRecommended.min.toLocaleString('pt-BR')} a R$ ${ispRecommended.max.toLocaleString('pt-BR')}

Mercado: ${marketContext}

GERE:
1. SUMÁRIO EXECUTIVO
2. ELEGIBILIDADE ISE B3 — diagnóstico completo
3. ISP — análise do investimento social
4. BENEFÍCIOS FINANCEIROS — custo de capital, acesso a capital ESG
5. LEIS DE INCENTIVO FISCAL aplicáveis
6. GREENWASHING CHECK — ISP como fachada vs. estratégia real
7. PLANO DE AÇÃO 90 DIAS
8. NOTA: "Estar no ISE = custo de capital menor = mais valor para o acionista"`

    const result = await callIA(prompt)
    setReport(result)
    setReportLoading(false)
  }, [iseAnswers, iseScore, revenue, currentISP, sector, ispRecommended, callIA, marketContext])

  const copyReport = useCallback(() => {
    navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [report])

  const formatBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px 16px' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32, textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 22, color: '#fff', fontWeight: 800 }}>
          ISE B3 + ISP — <span style={{ color: GREEN }}>Índice de Sustentabilidade</span> & <span style={{ color: BLUE }}>Investimento Social</span>
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: '#888' }}>Avalie elegibilidade para o ISE B3 e planeje seu Investimento Social Privado.</p>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: GREEN, fontStyle: 'italic' }}>"Estar no ISE = opção sólida de investimento = custo de capital menor"</p>
      </motion.div>

      {/* Section 1: ISE B3 */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ background: `${GREEN}22`, borderRadius: 8, padding: 8, display: 'flex' }}><TrendingUp size={20} color={GREEN} /></div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, color: '#fff', fontWeight: 700 }}>ISE B3 — Elegibilidade</h3>
            <p style={{ margin: 0, fontSize: 13, color: GREEN, fontStyle: 'italic' }}>"Sua empresa seria elegível para o ISE?"</p>
          </div>
        </div>

        {ISE_QUESTIONS.map((q, i) => (
          <motion.div key={q.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 10, borderLeft: `4px solid ${GREEN}`, padding: '16px 20px', marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <p style={{ fontSize: 13, color: '#e0e0e0', margin: 0, flex: 1 }}>
                <span style={{ color: GREEN, fontWeight: 700, marginRight: 8 }}>{q.id.toUpperCase()}</span>{q.text}
              </p>
              {iseScores[q.id] !== undefined && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{ background: iseScores[q.id] >= 2 ? GREEN : iseScores[q.id] === 1 ? AMBER : RED, color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20, marginLeft: 10 }}>
                  {iseScores[q.id]}/3
                </motion.span>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {q.options.map(opt => {
                const selected = iseAnswers[q.id] === opt.label
                return (
                  <button key={opt.label} onClick={() => handleISEAnswer(q.id, opt.label)}
                    style={{ background: selected ? `${GREEN}22` : 'rgba(0,0,0,0.25)', border: `1px solid ${selected ? GREEN : '#333'}`, borderRadius: 20, color: selected ? '#fff' : '#aaa', fontSize: 12, padding: '6px 14px', cursor: 'pointer', fontWeight: selected ? 600 : 400 }}>
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </motion.div>
        ))}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: '12px 20px', marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#888', fontSize: 13 }}>Score ISE:</span>
            <span style={{ color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'monospace' }}>{iseScore.sum}/15</span>
            <span style={{ color: GREEN, fontSize: 14, fontWeight: 600 }}>({iseScore.pct}%)</span>
            {iseScore.answered === 5 && <span style={{ background: badge(iseScore.pct).color, color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>{badge(iseScore.pct).label}</span>}
          </div>
          <button onClick={analyzeISE} disabled={iseScore.answered < 5 || iseLoading}
            style={{ background: iseScore.answered === 5 ? GREEN : '#333', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: iseScore.answered === 5 ? 'pointer' : 'not-allowed', opacity: iseScore.answered === 5 ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
            {iseLoading ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
            IA avalia ISE
          </button>
        </div>

        <AnimatePresence>
          {iseAnalysis && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${GREEN}44`, borderRadius: 10, padding: 16, marginTop: 8 }}>
              <p style={{ fontSize: 11, color: GREEN, fontWeight: 700, marginBottom: 8, margin: 0 }}>ANÁLISE IA — ELEGIBILIDADE ISE B3</p>
              <p style={{ fontSize: 13, color: '#ccc', whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: 0 }}>{iseAnalysis}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Section 2: ISP */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ background: `${BLUE}22`, borderRadius: 8, padding: 8, display: 'flex' }}><Heart size={20} color={BLUE} /></div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, color: '#fff', fontWeight: 700 }}>ISP — Investimento Social Privado</h3>
            <p style={{ margin: 0, fontSize: 13, color: BLUE, fontStyle: 'italic' }}>"Quanto investir na comunidade?"</p>
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 10, padding: '16px 20px', marginBottom: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ fontSize: 12, color: '#888', marginBottom: 4, display: 'block' }}>Receita anual (R$)</label>
              <input type="number" value={revenue} onChange={e => setRevenue(e.target.value)} placeholder="0,00"
                style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 14, fontFamily: 'monospace', padding: '8px 12px', width: '100%', outline: 'none' }} />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ fontSize: 12, color: '#888', marginBottom: 4, display: 'block' }}>ISP atual (R$/ano)</label>
              <input type="number" value={currentISP} onChange={e => setCurrentISP(e.target.value)} placeholder="0,00"
                style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 14, fontFamily: 'monospace', padding: '8px 12px', width: '100%', outline: 'none' }} />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#888', marginBottom: 4, display: 'block' }}>Setor da empresa</label>
            <input type="text" value={sector} onChange={e => setSector(e.target.value)} placeholder="Ex: Tecnologia, Varejo, Indústria..."
              style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 14, padding: '8px 12px', width: '100%', outline: 'none' }} />
          </div>
        </div>

        {/* ISP Calculator */}
        {parseFloat(revenue) > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, textAlign: 'center' }}>
              <div style={{ flex: '1 1 150px', background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: 12, borderTop: `3px solid ${AMBER}` }}>
                <p style={{ margin: 0, fontSize: 11, color: '#888' }}>ISP Mínimo (1%)</p>
                <p style={{ margin: '4px 0 0', fontSize: 18, color: '#fff', fontWeight: 700, fontFamily: 'monospace' }}>{formatBRL(ispRecommended.min)}</p>
              </div>
              <div style={{ flex: '1 1 150px', background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: 12, borderTop: `3px solid ${GREEN}` }}>
                <p style={{ margin: 0, fontSize: 11, color: '#888' }}>ISP Ideal (2%)</p>
                <p style={{ margin: '4px 0 0', fontSize: 18, color: '#fff', fontWeight: 700, fontFamily: 'monospace' }}>{formatBRL(ispRecommended.max)}</p>
              </div>
              <div style={{ flex: '1 1 150px', background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: 12, borderTop: `3px solid ${ispRecommended.pctCurrent >= 1 ? GREEN : RED}` }}>
                <p style={{ margin: 0, fontSize: 11, color: '#888' }}>ISP Atual</p>
                <p style={{ margin: '4px 0 0', fontSize: 18, color: '#fff', fontWeight: 700, fontFamily: 'monospace' }}>{ispRecommended.pctCurrent.toFixed(2)}%</p>
              </div>
            </div>

            {ispRecommended.pctCurrent < 1 && ispRecommended.current > 0 && (
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={14} color={AMBER} />
                <span style={{ fontSize: 12, color: AMBER }}>ISP abaixo do recomendado (1-2% da receita).</span>
              </div>
            )}
            {ispRecommended.pctCurrent >= 1 && (
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={14} color={GREEN} />
                <span style={{ fontSize: 12, color: GREEN }}>ISP dentro ou acima do benchmark recomendado.</span>
              </div>
            )}
          </motion.div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={analyzeISP} disabled={!revenue || ispLoading}
            style={{ background: revenue ? BLUE : '#333', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: revenue ? 'pointer' : 'not-allowed', opacity: revenue ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
            {ispLoading ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
            IA analisa ISP
          </button>
        </div>

        <AnimatePresence>
          {ispAnalysis && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${BLUE}44`, borderRadius: 10, padding: 16, marginTop: 8 }}>
              <p style={{ fontSize: 11, color: BLUE, fontWeight: 700, marginBottom: 8, margin: 0 }}>ANÁLISE IA — INVESTIMENTO SOCIAL PRIVADO</p>
              <p style={{ fontSize: 13, color: '#ccc', whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: 0 }}>{ispAnalysis}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Report */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Relatório ISE + ISP com IA</h3>
        <button onClick={generateReport} disabled={reportLoading}
          style={{ background: 'linear-gradient(135deg, #1e8449, #1a5276)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 14, fontWeight: 700, cursor: reportLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center', opacity: reportLoading ? 0.7 : 1 }}>
          {reportLoading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
          {reportLoading ? 'Gerando relatório...' : 'Gerar Relatório ISE + ISP com IA'}
        </button>
        <AnimatePresence>
          {report && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 16 }}>
              <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #333', borderRadius: 12, padding: 20 }}>
                <p style={{ fontSize: 13, color: '#ccc', whiteSpace: 'pre-wrap', lineHeight: 1.7, margin: 0 }}>{report}</p>
              </div>
              <button onClick={copyReport}
                style={{ background: 'transparent', border: `1px solid ${copied ? GREEN : '#555'}`, color: copied ? GREEN : '#aaa', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Copy size={14} />{copied ? 'Copiado!' : 'Copiar Relatório'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </div>
  )
}
