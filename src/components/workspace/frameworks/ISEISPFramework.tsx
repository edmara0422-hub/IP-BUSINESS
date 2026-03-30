'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Loader2, Copy, AlertTriangle, CheckCircle2, FileText,
  TrendingUp, Heart, Shield, Award,
} from 'lucide-react'

const RED = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE = '#1a5276'

interface RadioOption { label: string; score: number }
interface Question { id: string; text: string; options: RadioOption[] }

const ISE_QUESTIONS: Question[] = [
  { id: 'ise1', text: 'Publica relatório de sustentabilidade?', options: [
    { label: 'GRI + asseguração externa', score: 3 }, { label: 'Sim, sem asseguração', score: 2 }, { label: 'Não', score: 0 }] },
  { id: 'ise2', text: 'Tem política de mudanças climáticas com metas?', options: [
    { label: 'SBTi', score: 3 }, { label: 'Metas internas', score: 2 }, { label: 'Não', score: 0 }] },
  { id: 'ise3', text: 'Governança ESG vinculada ao conselho?', options: [
    { label: 'Comitê ESG no conselho', score: 3 }, { label: 'Diretoria ESG', score: 2 }, { label: 'Área operacional', score: 1 }, { label: 'Não', score: 0 }] },
  { id: 'ise4', text: 'Participou do CDP?', options: [
    { label: 'Nota A/A-', score: 3 }, { label: 'B/C', score: 2 }, { label: 'D', score: 1 }, { label: 'Nunca', score: 0 }] },
  { id: 'ise5', text: 'Canal de denúncias + anticorrupção?', options: [
    { label: 'Auditoria independente', score: 3 }, { label: 'Interno', score: 2 }, { label: 'Só código', score: 1 }, { label: 'Não', score: 0 }] },
  { id: 'ise6', text: 'Mede emissões CO2 nos 3 escopos?', options: [
    { label: 'Escopo 1+2+3', score: 3 }, { label: '1+2', score: 2 }, { label: 'Só 1', score: 1 }, { label: 'Não mede', score: 0 }] },
  { id: 'ise7', text: 'Diversidade em liderança (gênero, raça)?', options: [
    { label: '>40% diverso', score: 3 }, { label: '20-40%', score: 2 }, { label: '<20%', score: 1 }, { label: 'Não mede', score: 0 }] },
  { id: 'ise8', text: 'Cadeia de fornecedores auditada para ESG?', options: [
    { label: 'Auditoria regular + critérios ESG', score: 3 }, { label: 'Esporádica', score: 1 }, { label: 'Não', score: 0 }] },
  { id: 'ise9', text: 'Remuneração de executivos atrelada a metas ESG?', options: [
    { label: 'Sim, >20% variável', score: 3 }, { label: 'Sim, <20%', score: 2 }, { label: 'Não', score: 0 }] },
  { id: 'ise10', text: 'Integra riscos ESG na estratégia de negócios?', options: [
    { label: 'Cenários + stress test', score: 3 }, { label: 'Parcialmente', score: 2 }, { label: 'Não', score: 0 }] },
]

const RSC_QUESTIONS: Question[] = [
  { id: 'rsc1', text: 'Tem código de ética documentado?', options: [
    { label: 'Sim, público + treinamento', score: 3 }, { label: 'Sim, interno', score: 2 }, { label: 'Não', score: 0 }] },
  { id: 'rsc2', text: 'Respeita direitos humanos na cadeia?', options: [
    { label: 'Auditoria + certificação', score: 3 }, { label: 'Declaração', score: 1 }, { label: 'Não mapeou', score: 0 }] },
  { id: 'rsc3', text: 'Promove voluntariado corporativo?', options: [
    { label: 'Programa com horas pagas', score: 3 }, { label: 'Incentiva informalmente', score: 1 }, { label: 'Não', score: 0 }] },
  { id: 'rsc4', text: 'Tem programa de inclusão de PcD além da cota?', options: [
    { label: 'Sim, com desenvolvimento', score: 3 }, { label: 'Cumpre a cota', score: 2 }, { label: 'Abaixo da cota', score: 0 }] },
  { id: 'rsc5', text: 'Como se posiciona em causas sociais?', options: [
    { label: 'Posicionamento público + ações', score: 3 }, { label: 'Ações internas', score: 2 }, { label: 'Evita se posicionar', score: 0 }] },
]

const SECTORS = ['Tecnologia', 'Financeiro', 'Varejo', 'Saúde', 'Energia', 'Indústria', 'Telecomunicações', 'Transporte', 'Alimentos', 'Mineração', 'Imobiliário']

const ISP_BY_SECTOR: Record<string, string[]> = {
  'Tecnologia': ['Bolsas de estudo STEM', 'Inclusão digital em comunidades', 'Hackathons sociais', 'Mentoria para startups de impacto', 'Acessibilidade tecnológica'],
  'Financeiro': ['Educação financeira para comunidades', 'Programas de microcrédito', 'Inclusão bancária digital', 'Fundações de desenvolvimento social', 'Voluntariado especializado'],
  'Varejo': ['Doação de excedentes alimentares', 'Embalagem sustentável local', 'Emprego para comunidade local', 'Capacitação de fornecedores', 'Logística reversa social'],
  'Saúde': ['Acesso a medicamentos essenciais', 'Programas de prevenção comunitária', 'Saúde comunitária e postos', 'Telemedicina social', 'Doação de equipamentos'],
}
const ISP_DEFAULT = ['Programas educacionais', 'Saúde preventiva comunitária', 'Projetos ambientais locais', 'Apoio à cultura regional', 'Esporte e inclusão social']

const BENCHMARKS = [
  { name: 'Natura', detail: 'ISE desde 2005, rating AAA MSCI. Referência global.', color: GREEN },
  { name: 'Itaú', detail: 'Maior banco sustentável da América Latina. ISE + Dow Jones.', color: BLUE },
  { name: 'WEG', detail: 'Indústria de motores. Prova que setor industrial pode estar no ISE.', color: AMBER },
  { name: 'Vale', detail: 'Saiu após Brumadinho. Mostra que ISE é dinâmico — não é permanente.', color: RED },
]

const TABS = [
  { key: 'ise', label: 'ISE B3', icon: TrendingUp, color: GREEN },
  { key: 'isp', label: 'ISP', icon: Heart, color: BLUE },
  { key: 'rsc', label: 'RSC', icon: Shield, color: AMBER },
] as const

type TabKey = typeof TABS[number]['key']

function badge(pct: number) {
  if (pct >= 70) return { label: 'ELEGÍVEL — perfil compatível com ISE B3', color: GREEN }
  if (pct >= 40) return { label: 'PARCIAL — precisa melhorar', color: AMBER }
  return { label: 'NÃO ELEGÍVEL — gaps significativos', color: RED }
}

function rscBadge(pct: number) {
  if (pct >= 70) return { label: 'RSC FORTE', color: GREEN }
  if (pct >= 40) return { label: 'RSC PARCIAL', color: AMBER }
  return { label: 'RSC FRACA', color: RED }
}

export default function ISEISPFramework({ marketData }: { marketData: any }) {
  const [tab, setTab] = useState<TabKey>('ise')

  const [iseAnswers, setIseAnswers] = useState<Record<string, string>>({})
  const [iseScores, setIseScores] = useState<Record<string, number>>({})
  const [iseAnalysis, setIseAnalysis] = useState('')
  const [iseLoading, setIseLoading] = useState(false)

  const [revenue, setRevenue] = useState('')
  const [currentISP, setCurrentISP] = useState('')
  const [sector, setSector] = useState('')
  const [ispAnalysis, setIspAnalysis] = useState('')
  const [ispLoading, setIspLoading] = useState(false)

  const [rscAnswers, setRscAnswers] = useState<Record<string, string>>({})
  const [rscScoresMap, setRscScoresMap] = useState<Record<string, number>>({})
  const [rscAnalysis, setRscAnalysis] = useState('')
  const [rscLoading, setRscLoading] = useState(false)

  const [report, setReport] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const marketContext = useMemo(() => {
    if (!marketData) return 'Dados de mercado indisponíveis'
    return `SELIC: ${marketData.selic ?? 'N/A'}% | IPCA: ${marketData.ipca ?? 'N/A'}% | USD: R$${marketData.usd ?? 'N/A'} | PIB: ${marketData.pib ?? 'N/A'}%`
  }, [marketData])

  /* ISE */
  const handleISE = (qId: string, label: string) => {
    const q = ISE_QUESTIONS.find(x => x.id === qId)!
    setIseAnswers(p => ({ ...p, [qId]: label }))
    setIseScores(p => ({ ...p, [qId]: q.options.find(o => o.label === label)?.score ?? 0 }))
  }
  const iseScore = useMemo(() => {
    const ans = ISE_QUESTIONS.filter(q => iseScores[q.id] !== undefined)
    const sum = ans.reduce((a, q) => a + (iseScores[q.id] ?? 0), 0)
    return { sum, max: 30, pct: Math.round((sum / 30) * 100), answered: ans.length }
  }, [iseScores])

  /* RSC */
  const handleRSC = (qId: string, label: string) => {
    const q = RSC_QUESTIONS.find(x => x.id === qId)!
    setRscAnswers(p => ({ ...p, [qId]: label }))
    setRscScoresMap(p => ({ ...p, [qId]: q.options.find(o => o.label === label)?.score ?? 0 }))
  }
  const rscScore = useMemo(() => {
    const ans = RSC_QUESTIONS.filter(q => rscScoresMap[q.id] !== undefined)
    const sum = ans.reduce((a, q) => a + (rscScoresMap[q.id] ?? 0), 0)
    return { sum, max: 15, pct: Math.round((sum / 15) * 100), answered: ans.length }
  }, [rscScoresMap])

  /* ISP */
  const ispCalc = useMemo(() => {
    const rev = parseFloat(revenue) || 0
    if (rev === 0) return { min: 0, max: 0, current: 0, pctCurrent: 0 }
    const cur = parseFloat(currentISP) || 0
    return { min: rev * 0.01, max: rev * 0.02, current: cur, pctCurrent: (cur / rev) * 100 }
  }, [revenue, currentISP])

  const ispSuggestions = useMemo(() => ISP_BY_SECTOR[sector] || ISP_DEFAULT, [sector])

  /* Greenwashing */
  const greenwashing = useMemo(() => {
    const warnings: string[] = []
    if (iseScore.pct >= 70 && ispCalc.pctCurrent === 0 && parseFloat(revenue) > 0)
      warnings.push('Contradição: elegível pro ISE mas não investe na comunidade.')
    if (iseScores['ise1'] === 3 && iseScores['ise6'] === 0)
      warnings.push('Relatório sem dados de carbono = greenwashing.')
    if (ispCalc.pctCurrent >= 2 && rscScore.pct < 40)
      warnings.push('Investe dinheiro mas não tem práticas internas — ISP como marketing?')
    return warnings
  }, [iseScore, iseScores, ispCalc, rscScore, revenue])

  /* IA */
  const callIA = useCallback(async (question: string): Promise<string> => {
    try {
      const res = await fetch('/api/advisor-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, marketContext }),
      })
      const data = await res.json()
      return data.answer || 'Sem resposta da IA.'
    } catch { return 'Erro ao consultar IA. Tente novamente.' }
  }, [marketContext])

  const analyzeISE = useCallback(async () => {
    setIseLoading(true)
    const txt = ISE_QUESTIONS.map(q => `${q.text} → ${iseAnswers[q.id] ?? 'N/R'} (${iseScores[q.id] ?? 0}/3)`).join('\n')
    const result = await callIA(`Avalie elegibilidade ISE B3.\n\nRESPOSTAS:\n${txt}\n\nScore: ${iseScore.sum}/30 (${iseScore.pct}%) — ${badge(iseScore.pct).label}\nMercado: ${marketContext}\n\nDê: 1) Elegibilidade SIM/PARCIAL/NÃO 2) Gaps 3) Benefícios financeiros do ISE 4) 3 ações prioritárias 5) Benchmark vs Natura/Itaú/WEG`)
    setIseAnalysis(result)
    setIseLoading(false)
  }, [iseAnswers, iseScores, iseScore, callIA, marketContext])

  const analyzeISP = useCallback(async () => {
    setIspLoading(true)
    const result = await callIA(`Analise ISP.\n\nReceita mensal: R$ ${revenue || 'N/I'}\nISP atual: R$ ${currentISP || 'N/I'} (${ispCalc.pctCurrent.toFixed(2)}%)\nSetor: ${sector || 'N/I'}\nRecomendado: 1-2% = R$ ${ispCalc.min.toLocaleString('pt-BR')} a R$ ${ispCalc.max.toLocaleString('pt-BR')}\nMercado: ${marketContext}\n\nSugira plano ISP completo: 1) Avaliação do atual 2) Melhores iniciativas para o setor 3) Leis de incentivo 4) ROI do ISP 5) Plano com orçamento`)
    setIspAnalysis(result)
    setIspLoading(false)
  }, [revenue, currentISP, sector, ispCalc, callIA, marketContext])

  const analyzeRSC = useCallback(async () => {
    setRscLoading(true)
    const txt = RSC_QUESTIONS.map(q => `${q.text} → ${rscAnswers[q.id] ?? 'N/R'} (${rscScoresMap[q.id] ?? 0}/3)`).join('\n')
    const result = await callIA(`Avalie RSC.\n\nRESPOSTAS:\n${txt}\n\nScore RSC: ${rscScore.sum}/15 (${rscScore.pct}%)\nMercado: ${marketContext}\n\nDê: 1) Nível de RSC 2) Gaps 3) Diferença RSC vs ISP vs CSV 4) 3 ações concretas 5) Exemplos de empresas referência`)
    setRscAnalysis(result)
    setRscLoading(false)
  }, [rscAnswers, rscScoresMap, rscScore, callIA, marketContext])

  const generateReport = useCallback(async () => {
    setReportLoading(true)
    const iseData = ISE_QUESTIONS.map(q => `${q.text} → ${iseAnswers[q.id] ?? 'N/R'}`).join('\n')
    const rscData = RSC_QUESTIONS.map(q => `${q.text} → ${rscAnswers[q.id] ?? 'N/R'}`).join('\n')
    const gwText = greenwashing.length > 0 ? greenwashing.join('\n') : 'Nenhum alerta.'
    const prompt = `Gere relatório ISE/ISP/RSC completo.\n\nISE B3:\n${iseData}\nScore ISE: ${iseScore.pct}% — ${badge(iseScore.pct).label}\n\nISP:\nReceita: R$ ${revenue || 'N/I'} | ISP atual: R$ ${currentISP || 'N/I'} (${ispCalc.pctCurrent.toFixed(2)}%)\nSetor: ${sector || 'N/I'}\nRecomendado: R$ ${ispCalc.min.toLocaleString('pt-BR')} a R$ ${ispCalc.max.toLocaleString('pt-BR')}\n\nRSC:\n${rscData}\nScore RSC: ${rscScore.pct}%\n\nGREENWASHING:\n${gwText}\n\nMercado: ${marketContext}\n\nGERE:\n1) Elegibilidade ISE\n2) Plano ISP com % ideal\n3) Gaps de RSC\n4) Greenwashing detected\n5) Benchmark vs Natura/Itaú/WEG\n6) Plano 90 dias`
    const result = await callIA(prompt)
    setReport(result)
    setReportLoading(false)
  }, [iseAnswers, rscAnswers, iseScore, rscScore, revenue, currentISP, sector, ispCalc, greenwashing, callIA, marketContext])

  const copyReport = useCallback(() => {
    navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [report])

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const renderQuestions = (questions: Question[], answers: Record<string, string>, scores: Record<string, number>, handler: (id: string, label: string) => void, accentColor: string) => (
    questions.map((q, i) => (
      <motion.div key={q.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
        style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 10, borderLeft: `4px solid ${accentColor}`, padding: '14px 18px', marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <p style={{ fontSize: 13, color: '#e0e0e0', margin: 0, flex: 1 }}>
            <span style={{ color: accentColor, fontWeight: 700, marginRight: 8 }}>{q.id.toUpperCase()}</span>{q.text}
          </p>
          {scores[q.id] !== undefined && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
              style={{ background: scores[q.id] >= 2 ? GREEN : scores[q.id] === 1 ? AMBER : RED, color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20, marginLeft: 10, whiteSpace: 'nowrap' }}>
              {scores[q.id]}/3
            </motion.span>
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {q.options.map(opt => {
            const sel = answers[q.id] === opt.label
            return (
              <button key={opt.label} onClick={() => handler(q.id, opt.label)}
                style={{ background: sel ? `${accentColor}22` : 'rgba(0,0,0,0.25)', border: `1px solid ${sel ? accentColor : '#333'}`, borderRadius: 20, color: sel ? '#fff' : '#aaa', fontSize: 12, padding: '5px 12px', cursor: 'pointer', fontWeight: sel ? 600 : 400, transition: 'all .2s' }}>
                {opt.label}
              </button>
            )
          })}
        </div>
      </motion.div>
    ))
  )

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24, textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 22, color: '#fff', fontWeight: 800 }}>
          ISE <span style={{ color: GREEN }}>B3</span> + <span style={{ color: BLUE }}>ISP</span> + <span style={{ color: AMBER }}>RSC</span>
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: '#888' }}>Sustentabilidade Empresarial, Investimento Social e Responsabilidade Corporativa</p>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: 4 }}>
        {TABS.map(t => {
          const Icon = t.icon
          const active = tab === t.key
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ flex: 1, background: active ? `${t.color}22` : 'transparent', border: active ? `1px solid ${t.color}55` : '1px solid transparent', borderRadius: 8, color: active ? '#fff' : '#777', fontSize: 13, fontWeight: active ? 700 : 400, padding: '10px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all .2s' }}>
              <Icon size={15} color={active ? t.color : '#555'} />{t.label}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* TAB ISE */}
        {tab === 'ise' && (
          <motion.div key="ise" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
            <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: 16, marginBottom: 16, borderLeft: `4px solid ${GREEN}` }}>
              <p style={{ fontSize: 13, color: '#ccc', margin: 0, lineHeight: 1.7 }}>
                Criado em 2005 pela B3 para identificar empresas sustentáveis. <strong style={{ color: GREEN }}>Estar no ISE = opção sólida de investimento = custo de capital menor.</strong>
              </p>
              <p style={{ fontSize: 12, color: '#999', margin: '8px 0 0', fontStyle: 'italic' }}>
                Peter Drucker: "O objetivo do marketing é tornar a venda supérflua." O selo ISE condiciona a escolha do investidor.
              </p>
            </div>

            {renderQuestions(ISE_QUESTIONS, iseAnswers, iseScores, handleISE, GREEN)}

            {/* Score bar */}
            <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: '14px 20px', marginTop: 8, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: '#888', fontSize: 13 }}>Score ISE:</span>
                  <span style={{ color: '#fff', fontSize: 18, fontWeight: 700, fontFamily: 'monospace' }}>{iseScore.sum}/30</span>
                  <span style={{ color: GREEN, fontSize: 14, fontWeight: 600 }}>({iseScore.pct}%)</span>
                  {iseScore.answered === 10 && <span style={{ background: badge(iseScore.pct).color, color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 20 }}>{badge(iseScore.pct).label}</span>}
                </div>
                <button onClick={analyzeISE} disabled={iseScore.answered < 10 || iseLoading}
                  style={{ background: iseScore.answered === 10 ? GREEN : '#333', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: iseScore.answered === 10 ? 'pointer' : 'not-allowed', opacity: iseScore.answered === 10 ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {iseLoading ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                  IA avalia elegibilidade ISE
                </button>
              </div>
              {/* Progress bar */}
              <div style={{ marginTop: 10, background: 'rgba(0,0,0,0.3)', borderRadius: 6, height: 8, overflow: 'hidden' }}>
                <motion.div animate={{ width: `${iseScore.pct}%` }} transition={{ duration: 0.5 }}
                  style={{ height: '100%', borderRadius: 6, background: badge(iseScore.pct).color }} />
              </div>
            </div>

            {/* Benchmarks */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 8, marginBottom: 16 }}>
              {BENCHMARKS.map(b => (
                <div key={b.name} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '10px 12px', borderTop: `3px solid ${b.color}` }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#fff', fontWeight: 700 }}>{b.name}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: '#999', lineHeight: 1.5 }}>{b.detail}</p>
                </div>
              ))}
            </div>

            <AnimatePresence>
              {iseAnalysis && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${GREEN}44`, borderRadius: 10, padding: 16 }}>
                  <p style={{ fontSize: 11, color: GREEN, fontWeight: 700, margin: '0 0 8px' }}>ANALISE IA — ELEGIBILIDADE ISE B3</p>
                  <p style={{ fontSize: 13, color: '#ccc', whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: 0 }}>{iseAnalysis}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* TAB ISP */}
        {tab === 'isp' && (
          <motion.div key="isp" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
            <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: 16, marginBottom: 16, borderLeft: `4px solid ${BLUE}` }}>
              <p style={{ fontSize: 13, color: '#ccc', margin: 0, lineHeight: 1.7 }}>
                <strong style={{ color: BLUE }}>ISP</strong> é a destinação voluntária de recursos para impacto social/ambiental/cultural, sem expectativa de retorno financeiro direto.
              </p>
              <p style={{ fontSize: 12, color: '#999', margin: '6px 0 0' }}>
                Diferente de doação: ISP é estratégico, alinhado à RSC, com métricas e impacto duradouro.
              </p>
            </div>

            {/* Inputs */}
            <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 10, padding: '16px 20px', marginBottom: 14 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 14 }}>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ fontSize: 12, color: '#888', marginBottom: 4, display: 'block' }}>Receita mensal (R$)</label>
                  <input type="number" value={revenue} onChange={e => setRevenue(e.target.value)} placeholder="0,00"
                    style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 14, fontFamily: 'monospace', padding: '8px 12px', width: '100%', outline: 'none' }} />
                </div>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ fontSize: 12, color: '#888', marginBottom: 4, display: 'block' }}>Investimento social atual (R$/mês)</label>
                  <input type="number" value={currentISP} onChange={e => setCurrentISP(e.target.value)} placeholder="0,00"
                    style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 14, fontFamily: 'monospace', padding: '8px 12px', width: '100%', outline: 'none' }} />
                </div>
              </div>
              <label style={{ fontSize: 12, color: '#888', marginBottom: 6, display: 'block' }}>Setor da empresa</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {SECTORS.map(s => (
                  <button key={s} onClick={() => setSector(s)}
                    style={{ background: sector === s ? `${BLUE}22` : 'rgba(0,0,0,0.25)', border: `1px solid ${sector === s ? BLUE : '#333'}`, borderRadius: 20, color: sector === s ? '#fff' : '#aaa', fontSize: 12, padding: '5px 14px', cursor: 'pointer', fontWeight: sector === s ? 600 : 400 }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculator */}
            {parseFloat(revenue) > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
                  <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: 14, borderTop: `3px solid ${AMBER}`, textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 11, color: '#888' }}>ISP Mínimo (1%)</p>
                    <p style={{ margin: '4px 0 0', fontSize: 16, color: '#fff', fontWeight: 700, fontFamily: 'monospace' }}>{fmt(ispCalc.min)}</p>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: 14, borderTop: `3px solid ${GREEN}`, textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 11, color: '#888' }}>ISP Ideal (2%)</p>
                    <p style={{ margin: '4px 0 0', fontSize: 16, color: '#fff', fontWeight: 700, fontFamily: 'monospace' }}>{fmt(ispCalc.max)}</p>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: 14, borderTop: `3px solid ${ispCalc.pctCurrent >= 1 ? GREEN : RED}`, textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 11, color: '#888' }}>Atual</p>
                    <p style={{ margin: '4px 0 0', fontSize: 16, color: '#fff', fontWeight: 700, fontFamily: 'monospace' }}>{ispCalc.pctCurrent.toFixed(2)}%</p>
                  </div>
                </div>
                {/* Visual bar */}
                <div style={{ marginTop: 10, background: 'rgba(0,0,0,0.3)', borderRadius: 6, height: 10, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '50%', top: 0, width: 2, height: '100%', background: '#555' }} title="1% referência" />
                  <motion.div animate={{ width: `${Math.min(ispCalc.pctCurrent * 25, 100)}%` }} transition={{ duration: 0.5 }}
                    style={{ height: '100%', borderRadius: 6, background: ispCalc.pctCurrent < 1 ? RED : ispCalc.pctCurrent <= 2 ? GREEN : BLUE }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: '#666' }}>0%</span>
                  <span style={{ fontSize: 10, color: '#666' }}>2%</span>
                  <span style={{ fontSize: 10, color: '#666' }}>4%</span>
                </div>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {ispCalc.pctCurrent < 1 && <><AlertTriangle size={14} color={RED} /><span style={{ fontSize: 12, color: RED }}>Abaixo da referência de mercado</span></>}
                  {ispCalc.pctCurrent >= 1 && ispCalc.pctCurrent <= 2 && <><CheckCircle2 size={14} color={GREEN} /><span style={{ fontSize: 12, color: GREEN }}>Dentro do recomendado</span></>}
                  {ispCalc.pctCurrent > 2 && <><Award size={14} color={BLUE} /><span style={{ fontSize: 12, color: BLUE }}>Acima da média — potencial para selo ISP</span></>}
                </div>
              </motion.div>
            )}

            {/* Suggestions */}
            {sector && (
              <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: 14, marginBottom: 14, borderLeft: `4px solid ${BLUE}` }}>
                <p style={{ margin: '0 0 8px', fontSize: 12, color: BLUE, fontWeight: 700 }}>SUGESTOES ISP — {sector.toUpperCase()}</p>
                {ispSuggestions.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: BLUE, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#bbb' }}>{s}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={analyzeISP} disabled={!revenue || ispLoading}
                style={{ background: revenue ? BLUE : '#333', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: revenue ? 'pointer' : 'not-allowed', opacity: revenue ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
                {ispLoading ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                IA sugere plano ISP
              </button>
            </div>

            <AnimatePresence>
              {ispAnalysis && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${BLUE}44`, borderRadius: 10, padding: 16, marginTop: 10 }}>
                  <p style={{ fontSize: 11, color: BLUE, fontWeight: 700, margin: '0 0 8px' }}>ANALISE IA — PLANO ISP</p>
                  <p style={{ fontSize: 13, color: '#ccc', whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: 0 }}>{ispAnalysis}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* TAB RSC */}
        {tab === 'rsc' && (
          <motion.div key="rsc" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
            <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: 16, marginBottom: 16, borderLeft: `4px solid ${AMBER}` }}>
              <p style={{ fontSize: 13, color: '#ccc', margin: 0, lineHeight: 1.7 }}>
                <strong style={{ color: AMBER }}>RSC</strong> vai além das obrigações legais: condições de trabalho justas, respeito aos direitos humanos, uso responsável de recursos naturais, apoio a causas sociais.
              </p>
              <p style={{ fontSize: 12, color: '#999', margin: '6px 0 0' }}>
                RSC ≠ CSV ≠ ISP: RSC é o guarda-chuva. ISP é uma ação. CSV é estratégia de negócio.
              </p>
            </div>

            {/* Comparison table */}
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.3)' }}>
                    {['Conceito', 'O que é', 'Retorno', 'Exemplo'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', color: '#999', fontWeight: 600, textAlign: 'left', borderBottom: '1px solid #333' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { c: 'RSC', d: 'Práticas além da lei', r: 'Reputação', e: 'Código de ética', col: AMBER },
                    { c: 'ISP', d: 'Investimento social voluntário', r: 'Impacto social', e: 'Fundação educacional', col: BLUE },
                    { c: 'CSV', d: 'Lucro porque resolve problema', r: 'Lucro + impacto', e: 'Natura Ekos', col: GREEN },
                  ].map(row => (
                    <tr key={row.c} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '10px 12px', color: row.col, fontWeight: 700 }}>{row.c}</td>
                      <td style={{ padding: '10px 12px', color: '#ccc' }}>{row.d}</td>
                      <td style={{ padding: '10px 12px', color: '#aaa' }}>{row.r}</td>
                      <td style={{ padding: '10px 12px', color: '#999', fontStyle: 'italic' }}>{row.e}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {renderQuestions(RSC_QUESTIONS, rscAnswers, rscScoresMap, handleRSC, AMBER)}

            {/* Score */}
            <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: '14px 20px', marginTop: 8, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: '#888', fontSize: 13 }}>Score RSC:</span>
                  <span style={{ color: '#fff', fontSize: 18, fontWeight: 700, fontFamily: 'monospace' }}>{rscScore.sum}/15</span>
                  <span style={{ color: AMBER, fontSize: 14, fontWeight: 600 }}>({rscScore.pct}%)</span>
                  {rscScore.answered === 5 && <span style={{ background: rscBadge(rscScore.pct).color, color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 20 }}>{rscBadge(rscScore.pct).label}</span>}
                </div>
                <button onClick={analyzeRSC} disabled={rscScore.answered < 5 || rscLoading}
                  style={{ background: rscScore.answered === 5 ? AMBER : '#333', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: rscScore.answered === 5 ? 'pointer' : 'not-allowed', opacity: rscScore.answered === 5 ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {rscLoading ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
                  IA avalia RSC
                </button>
              </div>
              <div style={{ marginTop: 10, background: 'rgba(0,0,0,0.3)', borderRadius: 6, height: 8, overflow: 'hidden' }}>
                <motion.div animate={{ width: `${rscScore.pct}%` }} transition={{ duration: 0.5 }}
                  style={{ height: '100%', borderRadius: 6, background: rscBadge(rscScore.pct).color }} />
              </div>
            </div>

            <AnimatePresence>
              {rscAnalysis && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${AMBER}44`, borderRadius: 10, padding: 16 }}>
                  <p style={{ fontSize: 11, color: AMBER, fontWeight: 700, margin: '0 0 8px' }}>ANALISE IA — RSC</p>
                  <p style={{ fontSize: 13, color: '#ccc', whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: 0 }}>{rscAnalysis}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Greenwashing alerts */}
      {greenwashing.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: `${RED}15`, border: `1px solid ${RED}44`, borderRadius: 10, padding: 14, marginTop: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <AlertTriangle size={16} color={RED} />
            <span style={{ fontSize: 13, color: RED, fontWeight: 700 }}>GREENWASHING DETECTADO</span>
          </div>
          {greenwashing.map((w, i) => (
            <p key={i} style={{ fontSize: 12, color: '#ccc', margin: '4px 0', paddingLeft: 24, lineHeight: 1.5 }}>• {w}</p>
          ))}
        </motion.div>
      )}

      {/* Final report */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 24, marginBottom: 40 }}>
        <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 14, borderBottom: '1px solid #333', paddingBottom: 8 }}>
          Relatório ISE + ISP + RSC com IA
        </h3>
        <button onClick={generateReport} disabled={reportLoading}
          style={{ background: 'linear-gradient(135deg, #1e8449, #1a5276)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 14, fontWeight: 700, cursor: reportLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center', opacity: reportLoading ? 0.7 : 1 }}>
          {reportLoading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
          {reportLoading ? 'Gerando relatório...' : 'Gerar Relatório Completo ISE + ISP + RSC'}
        </button>
        <AnimatePresence>
          {report && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 14 }}>
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
