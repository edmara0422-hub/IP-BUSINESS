'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DollarSign, Users, Leaf, Loader2, Copy, AlertTriangle,
  CheckCircle2, XCircle, FileText, ChevronDown,
} from 'lucide-react'

/* ── Colors ── */
const RED = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE = '#1a5276'

/* ── Types ── */
interface RadioOption { label: string; score: number }

interface TBLQuestion {
  id: string
  pillar: 'profit' | 'people' | 'planet'
  text: string
  type: 'number' | 'radio'
  unit?: string
  placeholder?: string
  options?: RadioOption[]
  scoreFn?: (v: number) => number
}

/* ── Questions ── */
const QUESTIONS: TBLQuestion[] = [
  // PROFIT
  { id: 'q1', pillar: 'profit', text: 'Qual sua receita mensal aproximada?', type: 'number', unit: 'R$', placeholder: '0,00',
    scoreFn: (v) => v >= 500000 ? 3 : v >= 100000 ? 2 : v > 0 ? 1 : 0 },
  { id: 'q2', pillar: 'profit', text: 'Qual sua margem de lucro?', type: 'radio', options: [
    { label: '>30%', score: 3 }, { label: '15-30%', score: 2 }, { label: '5-15%', score: 1 }, { label: '<5%', score: 0 }, { label: 'Não sei', score: 0 },
  ]},
  { id: 'q3', pillar: 'profit', text: 'Quantos empregos diretos gera?', type: 'number', unit: 'pessoas', placeholder: '0',
    scoreFn: (v) => v >= 50 ? 3 : v >= 10 ? 2 : v > 0 ? 1 : 0 },
  { id: 'q4', pillar: 'profit', text: 'Investe em P&D ou inovação?', type: 'radio', options: [
    { label: 'Sim, >5% da receita', score: 3 }, { label: 'Sim, 1-5%', score: 2 }, { label: 'Não investe', score: 0 }, { label: 'Não sei', score: 0 },
  ]},
  { id: 'q5', pillar: 'profit', text: 'Como distribui valor? (salários, impostos, dividendos, comunidade)', type: 'radio', options: [
    { label: 'Equilibrado entre stakeholders', score: 3 }, { label: 'Foco em acionistas', score: 1 }, { label: 'Não pensei nisso', score: 0 },
  ]},
  // PEOPLE
  { id: 'q6', pillar: 'people', text: 'Quantas horas de treinamento por colaborador no último ano?', type: 'number', unit: 'horas', placeholder: '0',
    scoreFn: (v) => v >= 20 ? 3 : v >= 10 ? 2 : v > 0 ? 1 : 0 },
  { id: 'q7', pillar: 'people', text: 'Tem diferença salarial entre homens e mulheres na mesma função?', type: 'radio', options: [
    { label: 'Não, salários iguais', score: 3 }, { label: 'Sim, até 10%', score: 1 }, { label: 'Sim, mais de 10%', score: 0 }, { label: 'Não medi', score: 0 },
  ]},
  { id: 'q8', pillar: 'people', text: 'Qual a diversidade em cargos de liderança? (gênero, raça)', type: 'radio', options: [
    { label: '>40% diverso', score: 3 }, { label: '20-40%', score: 2 }, { label: '<20%', score: 1 }, { label: 'Não medi', score: 0 },
  ]},
  { id: 'q9', pillar: 'people', text: 'Investe na comunidade local? (educação, saúde, cultura)', type: 'radio', options: [
    { label: 'Sim, com orçamento definido (ISP)', score: 3 }, { label: 'Ações pontuais', score: 1 }, { label: 'Não', score: 0 },
  ]},
  { id: 'q10', pillar: 'people', text: 'Como está a satisfação dos colaboradores?', type: 'radio', options: [
    { label: 'eNPS >50 (excelente)', score: 3 }, { label: 'eNPS 0-50 (ok)', score: 2 }, { label: 'eNPS negativo (ruim)', score: 0 }, { label: 'Nunca medimos', score: 0 },
  ]},
  // PLANET
  { id: 'q11', pillar: 'planet', text: 'Sua operação gera emissões de CO2? (transporte, energia, produção)', type: 'radio', options: [
    { label: 'Muito (indústria/logística)', score: 0 }, { label: 'Pouco (escritório/digital)', score: 2 }, { label: 'Não sei mensurar', score: 0 },
  ]},
  { id: 'q12', pillar: 'planet', text: 'Usa energia renovável?', type: 'radio', options: [
    { label: '100% renovável', score: 3 }, { label: 'Parcialmente', score: 2 }, { label: 'Não', score: 0 }, { label: 'Não sei', score: 0 },
  ]},
  { id: 'q13', pillar: 'planet', text: 'O que acontece com seus resíduos?', type: 'radio', options: [
    { label: '>80% reciclado', score: 3 }, { label: '50-80%', score: 2 }, { label: '<50%', score: 1 }, { label: 'Não controlamos', score: 0 },
  ]},
  { id: 'q14', pillar: 'planet', text: 'Monitora consumo de água?', type: 'radio', options: [
    { label: 'Sim, com metas de redução', score: 3 }, { label: 'Monitoramos sem meta', score: 2 }, { label: 'Não', score: 0 },
  ]},
  { id: 'q15', pillar: 'planet', text: 'Considera impacto ambiental na escolha de fornecedores?', type: 'radio', options: [
    { label: 'Sim, é critério', score: 3 }, { label: 'Às vezes', score: 1 }, { label: 'Não', score: 0 },
  ]},
]

const PILLAR_META = {
  profit: { label: 'Profit', subtitle: 'Econômico', question: 'A empresa é viável?', color: GREEN, icon: DollarSign },
  people: { label: 'People', subtitle: 'Social', question: 'A empresa é justa?', color: BLUE, icon: Users },
  planet: { label: 'Planet', subtitle: 'Ambiental', question: 'A empresa é sustentável?', color: AMBER, icon: Leaf },
} as const

/* ── Helpers ── */
function badge(pct: number): { label: string; color: string } {
  if (pct >= 70) return { label: 'FORTE', color: GREEN }
  if (pct >= 40) return { label: 'MÉDIO', color: AMBER }
  return { label: 'FRACO', color: RED }
}

function formatCurrency(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/* ── Component ── */
export default function TBLFramework({ marketData }: { marketData: any }) {
  const [answers, setAnswers] = useState<Record<string, number | string>>({})
  const [scores, setScores] = useState<Record<string, number>>({})
  const [circles, setCircles] = useState<Record<string, boolean | null>>({ eco: null, social: null, finance: null })
  const [pillarAnalysis, setPillarAnalysis] = useState<Record<string, string>>({})
  const [pillarLoading, setPillarLoading] = useState<Record<string, boolean>>({})
  const [report, setReport] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const marketContext = useMemo(() => {
    if (!marketData) return 'Dados de mercado indisponíveis'
    return `SELIC: ${marketData.selic ?? 'N/A'}% | IPCA: ${marketData.ipca ?? 'N/A'}% | USD: R$${marketData.usd ?? 'N/A'} | PIB: ${marketData.pib ?? 'N/A'}%`
  }, [marketData])

  /* Score a question */
  const scoreQuestion = useCallback((q: TBLQuestion, value: number | string) => {
    if (q.type === 'radio') {
      const opt = q.options?.find(o => o.label === value)
      return opt?.score ?? 0
    }
    if (q.type === 'number' && q.scoreFn) {
      return q.scoreFn(Number(value) || 0)
    }
    return 0
  }, [])

  const handleAnswer = useCallback((qId: string, value: number | string) => {
    const q = QUESTIONS.find(x => x.id === qId)!
    const s = scoreQuestion(q, value)
    setAnswers(prev => ({ ...prev, [qId]: value }))
    setScores(prev => ({ ...prev, [qId]: s }))
  }, [scoreQuestion])

  /* Pillar scores */
  const pillarScores = useMemo(() => {
    const calc = (pillar: string) => {
      const qs = QUESTIONS.filter(q => q.pillar === pillar)
      const answered = qs.filter(q => scores[q.id] !== undefined)
      if (answered.length === 0) return { sum: 0, max: 15, pct: 0, answered: 0, total: 5 }
      const sum = answered.reduce((a, q) => a + (scores[q.id] ?? 0), 0)
      return { sum, max: 15, pct: Math.round((sum / 15) * 100), answered: answered.length, total: 5 }
    }
    return { profit: calc('profit'), people: calc('people'), planet: calc('planet') }
  }, [scores])

  const overallPct = useMemo(() => {
    const { profit, people, planet } = pillarScores
    if (profit.answered + people.answered + planet.answered === 0) return 0
    return Math.round((profit.pct + people.pct + planet.pct) / 3)
  }, [pillarScores])

  /* Greenwashing checks */
  const greenwashAlerts = useMemo(() => {
    const alerts: { text: string; color: string }[] = []
    const { profit, people, planet } = pillarScores
    if (profit.pct >= 60 && planet.pct < 30)
      alerts.push({ text: 'Alerta: lucro alto com impacto ambiental baixo pode ser greenwashing', color: RED })
    if (profit.pct >= 60 && people.pct < 30)
      alerts.push({ text: 'Risco: lucro alto sem investimento social pode indicar externalidades negativas', color: AMBER })
    const dontKnowCount = Object.entries(answers).filter(([, v]) => v === 'Não sei' || v === 'Não medi' || v === 'Não sei mensurar').length
    if (dontKnowCount >= 4)
      alerts.push({ text: 'Alerta: sem dados = sem sustentabilidade real. Muitas respostas "não sei".', color: RED })
    if (people.pct < 40 && profit.pct >= 50)
      alerts.push({ text: 'Risco: alegações ESG sem prática social robusta', color: AMBER })
    return alerts
  }, [pillarScores, answers])

  /* IA calls */
  const callIA = useCallback(async (question: string): Promise<string> => {
    try {
      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, marketContext }),
      })
      const data = await res.json()
      return data.answer || 'Sem resposta da IA.'
    } catch {
      return 'Erro ao consultar IA. Tente novamente.'
    }
  }, [marketContext])

  const analyzePillar = useCallback(async (pillar: 'profit' | 'people' | 'planet') => {
    setPillarLoading(prev => ({ ...prev, [pillar]: true }))
    const qs = QUESTIONS.filter(q => q.pillar === pillar)
    const answersText = qs.map(q => `${q.text} → ${answers[q.id] ?? 'Não respondido'} (score: ${scores[q.id] ?? 0}/3)`).join('\n')
    const meta = PILLAR_META[pillar]
    const ps = pillarScores[pillar]
    const prompt = `Analise o pilar ${meta.label} (${meta.subtitle}) do Triple Bottom Line desta empresa.

RESPOSTAS:
${answersText}

Score do pilar: ${ps.sum}/15 (${ps.pct}%) — ${badge(ps.pct).label}
Mercado: ${marketContext}

Dê: 1) Diagnóstico em 2 linhas, 2) Pontos fortes, 3) Gaps críticos, 4) 2 ações prioritárias com prazo. Seja direto.`

    const result = await callIA(prompt)
    setPillarAnalysis(prev => ({ ...prev, [pillar]: result }))
    setPillarLoading(prev => ({ ...prev, [pillar]: false }))
  }, [answers, scores, pillarScores, callIA, marketContext])

  const generateReport = useCallback(async () => {
    setReportLoading(true)
    const allAnswers = QUESTIONS.map(q => `${q.id.toUpperCase()}: ${q.text} → ${answers[q.id] ?? 'Não respondido'} (score: ${scores[q.id] ?? 0}/3)`).join('\n')
    const circlesText = `Viola limite ecológico: ${circles.eco === null ? 'Não respondido' : circles.eco ? 'SIM' : 'NÃO'}\nPrejudica grupo social: ${circles.social === null ? 'Não respondido' : circles.social ? 'SIM' : 'NÃO'}\nFinanceiramente viável: ${circles.finance === null ? 'Não respondido' : circles.finance ? 'SIM' : 'NÃO'}`

    const prompt = `Gere um relatório Triple Bottom Line completo para esta empresa.

DADOS:
Profit: ${QUESTIONS.filter(q => q.pillar === 'profit').map(q => `${q.text} → ${answers[q.id] ?? 'N/R'}`).join(' | ')}
People: ${QUESTIONS.filter(q => q.pillar === 'people').map(q => `${q.text} → ${answers[q.id] ?? 'N/R'}`).join(' | ')}
Planet: ${QUESTIONS.filter(q => q.pillar === 'planet').map(q => `${q.text} → ${answers[q.id] ?? 'N/R'}`).join(' | ')}
Scores: Profit ${pillarScores.profit.pct}%, People ${pillarScores.people.pct}%, Planet ${pillarScores.planet.pct}%
Teste dos Círculos: ${circlesText}
Mercado: SELIC ${marketData?.selic ?? 'N/A'}%, IPCA ${marketData?.ipca ?? 'N/A'}%

GERE:
1. SUMÁRIO EXECUTIVO (3 linhas)
2. ANÁLISE POR PILAR (pontos fortes + gaps críticos de cada P)
3. TESTE DOS CÍRCULOS — resultado e implicações
4. DETECÇÃO DE GREENWASHING — riscos encontrados
5. PLANO DE AÇÃO 90 DIAS (3 ações por pilar com custo estimado)
6. COMO O MERCADO IMPACTA (SELIC/IPCA → custo de ser sustentável)
7. FRAMEWORKS COMPLEMENTARES RECOMENDADOS (quais usar além do TBL)
8. NOTA FINAL: esta empresa é sustentável de verdade?`

    const result = await callIA(prompt)
    setReport(result)
    setReportLoading(false)
  }, [answers, scores, circles, pillarScores, marketData, callIA])

  const copyReport = useCallback(() => {
    navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [report])

  /* ── Render helpers ── */
  const renderQuestion = (q: TBLQuestion, index: number) => {
    const meta = PILLAR_META[q.pillar]
    const answered = answers[q.id] !== undefined
    const sc = scores[q.id]

    return (
      <motion.div
        key={q.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        style={{
          background: '#1a1a2e',
          borderRadius: 10,
          borderLeft: `4px solid ${meta.color}`,
          padding: '16px 20px',
          marginBottom: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <p style={{ fontSize: 13, color: '#e0e0e0', margin: 0, flex: 1 }}>
            <span style={{ color: meta.color, fontWeight: 700, marginRight: 8 }}>{q.id.toUpperCase()}</span>
            {q.text}
          </p>
          {answered && sc !== undefined && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                background: sc >= 2 ? GREEN : sc === 1 ? AMBER : RED,
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 10px',
                borderRadius: 20,
                marginLeft: 10,
                whiteSpace: 'nowrap',
              }}
            >
              {sc}/3
            </motion.span>
          )}
        </div>

        {q.type === 'number' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {q.unit === 'R$' && <span style={{ color: '#888', fontSize: 13 }}>R$</span>}
            <input
              type="number"
              placeholder={q.placeholder}
              value={answers[q.id] !== undefined ? String(answers[q.id]) : ''}
              onChange={e => handleAnswer(q.id, Number(e.target.value))}
              style={{
                background: '#0d0d1a',
                border: '1px solid #333',
                borderRadius: 6,
                color: '#fff',
                fontSize: 14,
                fontFamily: 'monospace',
                padding: '8px 12px',
                width: 180,
                outline: 'none',
              }}
            />
            {q.unit && q.unit !== 'R$' && <span style={{ color: '#888', fontSize: 12 }}>{q.unit}</span>}
          </div>
        )}

        {q.type === 'radio' && q.options && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {q.options.map(opt => {
              const selected = answers[q.id] === opt.label
              return (
                <button
                  key={opt.label}
                  onClick={() => handleAnswer(q.id, opt.label)}
                  style={{
                    background: selected ? `${meta.color}22` : '#0d0d1a',
                    border: `1px solid ${selected ? meta.color : '#333'}`,
                    borderRadius: 20,
                    color: selected ? '#fff' : '#aaa',
                    fontSize: 12,
                    padding: '6px 14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: selected ? 600 : 400,
                  }}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        )}
      </motion.div>
    )
  }

  const renderPillarSection = (pillar: 'profit' | 'people' | 'planet') => {
    const meta = PILLAR_META[pillar]
    const qs = QUESTIONS.filter(q => q.pillar === pillar)
    const ps = pillarScores[pillar]
    const Icon = meta.icon
    const allAnswered = ps.answered === 5

    return (
      <motion.section
        key={pillar}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ background: `${meta.color}22`, borderRadius: 8, padding: 8, display: 'flex' }}>
            <Icon size={20} color={meta.color} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, color: '#fff', fontWeight: 700 }}>
              {meta.label} <span style={{ color: '#888', fontWeight: 400 }}>({meta.subtitle})</span>
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: meta.color, fontStyle: 'italic' }}>"{meta.question}"</p>
          </div>
        </div>

        {qs.map((q, i) => renderQuestion(q, i))}

        {/* Pillar summary */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#0d0d1a', borderRadius: 10, padding: '12px 20px', marginTop: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#888', fontSize: 13 }}>Score:</span>
            <span style={{ color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'monospace' }}>
              {ps.sum}/15
            </span>
            <span style={{ color: meta.color, fontSize: 14, fontWeight: 600 }}>({ps.pct}%)</span>
            {allAnswered && (
              <span style={{
                background: badge(ps.pct).color,
                color: '#fff', fontSize: 11, fontWeight: 700,
                padding: '2px 10px', borderRadius: 20,
              }}>
                {badge(ps.pct).label}
              </span>
            )}
          </div>
          <button
            onClick={() => analyzePillar(pillar)}
            disabled={!allAnswered || pillarLoading[pillar]}
            style={{
              background: allAnswered ? meta.color : '#333',
              color: '#fff', border: 'none', borderRadius: 8,
              padding: '8px 16px', fontSize: 13, fontWeight: 600,
              cursor: allAnswered ? 'pointer' : 'not-allowed',
              opacity: allAnswered ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {pillarLoading[pillar] ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
            IA analisa {meta.label}
          </button>
        </div>

        <AnimatePresence>
          {pillarAnalysis[pillar] && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: '#0f0f1e',
                border: `1px solid ${meta.color}44`,
                borderRadius: 10,
                padding: 16,
                marginTop: 8,
              }}
            >
              <p style={{ fontSize: 11, color: meta.color, fontWeight: 700, marginBottom: 8, margin: 0 }}>
                ANÁLISE IA — {meta.label.toUpperCase()}
              </p>
              <p style={{ fontSize: 13, color: '#ccc', whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: 0 }}>
                {pillarAnalysis[pillar]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    )
  }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32, textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 22, color: '#fff', fontWeight: 800 }}>
          Triple Bottom Line — <span style={{ color: GREEN }}>People</span>, <span style={{ color: AMBER }}>Planet</span>, <span style={{ color: BLUE }}>Profit</span>
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: '#888' }}>
          Avalie seu negócio em 3 dimensões. IA analisa e gera relatório.
        </p>
      </motion.div>

      {/* Pillar sections */}
      {renderPillarSection('profit')}
      {renderPillarSection('people')}
      {renderPillarSection('planet')}

      {/* Section 4: RESULTADO TBL */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>
          Resultado TBL
        </h3>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          {(['profit', 'people', 'planet'] as const).map(p => {
            const ps = pillarScores[p]
            const meta = PILLAR_META[p]
            const b = badge(ps.pct)
            return (
              <div key={p} style={{
                flex: '1 1 200px', background: '#1a1a2e', borderRadius: 10, padding: 16,
                borderTop: `3px solid ${meta.color}`, textAlign: 'center',
              }}>
                <p style={{ margin: 0, fontSize: 13, color: meta.color, fontWeight: 700 }}>{meta.label}</p>
                <p style={{ margin: '6px 0', fontSize: 28, color: '#fff', fontWeight: 800, fontFamily: 'monospace' }}>
                  {ps.pct}<span style={{ fontSize: 14, color: '#888' }}>%</span>
                </p>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: b.color, padding: '2px 12px', borderRadius: 20 }}>
                  {b.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Horizontal bars */}
        {(['profit', 'people', 'planet'] as const).map(p => {
          const ps = pillarScores[p]
          const meta = PILLAR_META[p]
          const b = badge(ps.pct)
          return (
            <div key={p} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#aaa' }}>{meta.label}</span>
                <span style={{ fontSize: 12, color: '#aaa', fontFamily: 'monospace' }}>{ps.pct}%</span>
              </div>
              <div style={{ background: '#0d0d1a', borderRadius: 6, height: 12, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${ps.pct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ height: '100%', background: b.color, borderRadius: 6 }}
                />
              </div>
            </div>
          )
        })}

        <div style={{
          background: '#0d0d1a', borderRadius: 10, padding: 16, marginTop: 16, textAlign: 'center',
        }}>
          <span style={{ color: '#888', fontSize: 13 }}>TBL Score Geral:</span>
          <span style={{ color: '#fff', fontSize: 24, fontWeight: 800, marginLeft: 12, fontFamily: 'monospace' }}>
            {overallPct}%
          </span>
          <span style={{
            background: badge(overallPct).color, color: '#fff', fontSize: 11, fontWeight: 700,
            padding: '2px 12px', borderRadius: 20, marginLeft: 12,
          }}>
            {badge(overallPct).label}
          </span>
        </div>
      </motion.section>

      {/* Section 5: TESTE DOS CÍRCULOS */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>
          Teste dos Círculos
        </h3>

        {[
          { key: 'eco', text: 'Sua operação viola algum limite ecológico?', yesColor: RED, yesMsg: 'PARE — redesenhe antes de continuar', yesIcon: XCircle },
          { key: 'social', text: 'Sua operação prejudica algum grupo social?', yesColor: AMBER, yesMsg: 'REDESENHE — ajuste o impacto social', yesIcon: AlertTriangle },
          { key: 'finance', text: 'Sua operação é financeiramente viável?', yesColor: GREEN, yesMsg: 'EXECUTE — o caminho está correto', yesIcon: CheckCircle2 },
        ].map(item => (
          <div key={item.key} style={{
            background: '#1a1a2e', borderRadius: 10, padding: 16, marginBottom: 12,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 13, color: '#e0e0e0', flex: 1 }}>{item.text}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {['SIM', 'NÃO'].map(opt => {
                  const val = opt === 'SIM'
                  const selected = circles[item.key] === val
                  return (
                    <button
                      key={opt}
                      onClick={() => setCircles(prev => ({ ...prev, [item.key]: val }))}
                      style={{
                        background: selected ? (val ? item.yesColor + '33' : '#33333366') : '#0d0d1a',
                        border: `1px solid ${selected ? (val ? item.yesColor : '#666') : '#333'}`,
                        color: selected ? '#fff' : '#888', borderRadius: 8,
                        padding: '6px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
            <AnimatePresence>
              {circles[item.key] !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    background: `${circles[item.key] ? item.yesColor : '#555'}11`,
                    border: `1px solid ${circles[item.key] ? item.yesColor : '#555'}44`,
                    borderRadius: 8, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8,
                  }}
                >
                  {circles[item.key] ? (
                    <>
                      <item.yesIcon size={16} color={item.yesColor} />
                      <span style={{ fontSize: 13, color: item.yesColor, fontWeight: 700 }}>{item.yesMsg}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 13, color: '#888' }}>
                      {item.key === 'finance' ? 'Atenção: viabilidade financeira é fundamental.' : 'Bom — nenhum alerta neste critério.'}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.section>

      {/* Section 6: GREENWASHING CHECK */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>
          Greenwashing Check
        </h3>

        {greenwashAlerts.length === 0 ? (
          <div style={{ background: '#1a1a2e', borderRadius: 10, padding: 16, borderLeft: `4px solid ${GREEN}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} color={GREEN} />
              <span style={{ fontSize: 13, color: GREEN, fontWeight: 600 }}>
                Nenhum alerta de greenwashing detectado. Continue preenchendo para análise completa.
              </span>
            </div>
          </div>
        ) : (
          greenwashAlerts.map((alert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: '#1a1a2e', borderRadius: 10, padding: 16,
                borderLeft: `4px solid ${alert.color}`, marginBottom: 10,
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <AlertTriangle size={18} color={alert.color} />
              <span style={{ fontSize: 13, color: '#e0e0e0' }}>{alert.text}</span>
            </motion.div>
          ))
        )}
      </motion.section>

      {/* Section 7: RELATÓRIO + EXPORTAR */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>
          Relatório TBL com IA
        </h3>

        <button
          onClick={generateReport}
          disabled={reportLoading}
          style={{
            background: 'linear-gradient(135deg, #1e8449, #1a5276)',
            color: '#fff', border: 'none', borderRadius: 10,
            padding: '14px 28px', fontSize: 14, fontWeight: 700,
            cursor: reportLoading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center',
            opacity: reportLoading ? 0.7 : 1,
          }}
        >
          {reportLoading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
          {reportLoading ? 'Gerando relatório...' : 'Gerar Relatório TBL com IA'}
        </button>

        <AnimatePresence>
          {report && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 16 }}
            >
              <div style={{
                background: '#0d0d1a', border: '1px solid #333', borderRadius: 12, padding: 20,
              }}>
                <p style={{ fontSize: 13, color: '#ccc', whiteSpace: 'pre-wrap', lineHeight: 1.7, margin: 0 }}>
                  {report}
                </p>
              </div>
              <button
                onClick={copyReport}
                style={{
                  background: 'transparent', border: `1px solid ${copied ? GREEN : '#555'}`,
                  color: copied ? GREEN : '#aaa', borderRadius: 8,
                  padding: '8px 20px', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <Copy size={14} />
                {copied ? 'Copiado!' : 'Copiar Relatório'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </div>
  )
}
