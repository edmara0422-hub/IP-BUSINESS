'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Leaf, Users, Shield, Loader2, Copy, AlertTriangle,
  CheckCircle2, FileText,
} from 'lucide-react'

const RED = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE = '#1a5276'

interface RadioOption { label: string; score: number }

interface ESGQuestion {
  id: string
  pillar: 'E' | 'S' | 'G'
  text: string
  type: 'number' | 'radio'
  unit?: string
  placeholder?: string
  options?: RadioOption[]
  scoreFn?: (v: number) => number
}

const QUESTIONS: ESGQuestion[] = [
  // E — Environmental
  { id: 'e1', pillar: 'E', text: 'Sua empresa mede emissões de CO2?', type: 'radio', options: [
    { label: 'Sim, Escopo 1+2+3', score: 3 }, { label: 'Sim, parcial', score: 2 }, { label: 'Não', score: 0 },
  ]},
  { id: 'e2', pillar: 'E', text: 'Como gerencia água?', type: 'radio', options: [
    { label: 'Metas de redução', score: 3 }, { label: 'Monitora', score: 2 }, { label: 'Não controla', score: 0 },
  ]},
  { id: 'e3', pillar: 'E', text: 'Gestão de resíduos?', type: 'radio', options: [
    { label: '>80% reciclado', score: 3 }, { label: '50-80%', score: 2 }, { label: '<50%', score: 1 }, { label: 'Não controlamos', score: 0 },
  ]},
  { id: 'e4', pillar: 'E', text: 'Usa energia renovável?', type: 'radio', options: [
    { label: '100%', score: 3 }, { label: 'Parcial', score: 2 }, { label: 'Não', score: 0 },
  ]},
  { id: 'e5', pillar: 'E', text: 'Avalia risco climático?', type: 'radio', options: [
    { label: 'Sim, com plano', score: 3 }, { label: 'Parcialmente', score: 1 }, { label: 'Não', score: 0 },
  ]},
  // S — Social
  { id: 's1', pillar: 'S', text: '% de diversidade em liderança?', type: 'number', unit: '%', placeholder: '0',
    scoreFn: (v) => v >= 40 ? 3 : v >= 20 ? 2 : v > 0 ? 1 : 0 },
  { id: 's2', pillar: 'S', text: 'Taxa de acidentes de trabalho?', type: 'radio', options: [
    { label: 'Zero', score: 3 }, { label: '<3/ano', score: 2 }, { label: '>3/ano', score: 0 },
  ]},
  { id: 's3', pillar: 'S', text: 'Investe na comunidade?', type: 'radio', options: [
    { label: 'Sim, ISP formal', score: 3 }, { label: 'Ações pontuais', score: 1 }, { label: 'Não', score: 0 },
  ]},
  { id: 's4', pillar: 'S', text: 'Audita fornecedores para trabalho irregular?', type: 'radio', options: [
    { label: 'Sim', score: 3 }, { label: 'Parcial', score: 1 }, { label: 'Não', score: 0 },
  ]},
  { id: 's5', pillar: 'S', text: 'Mede satisfação dos colaboradores?', type: 'radio', options: [
    { label: 'eNPS >50', score: 3 }, { label: '0-50', score: 2 }, { label: 'Negativo', score: 1 }, { label: 'Não mede', score: 0 },
  ]},
  // G — Governance
  { id: 'g1', pillar: 'G', text: 'Conselho tem membros independentes?', type: 'radio', options: [
    { label: '>50%', score: 3 }, { label: '20-50%', score: 2 }, { label: '<20%', score: 1 }, { label: 'Não tem conselho', score: 0 },
  ]},
  { id: 'g2', pillar: 'G', text: 'CEO é separado do presidente do conselho?', type: 'radio', options: [
    { label: 'Sim', score: 3 }, { label: 'Não', score: 1 }, { label: 'Não tem conselho', score: 0 },
  ]},
  { id: 'g3', pillar: 'G', text: 'Canal de denúncias anônimo?', type: 'radio', options: [
    { label: 'Sim, independente', score: 3 }, { label: 'Sim, interno', score: 2 }, { label: 'Não', score: 0 },
  ]},
  { id: 'g4', pillar: 'G', text: 'Metas ESG vinculadas a bônus da diretoria?', type: 'radio', options: [
    { label: 'Sim', score: 3 }, { label: 'Parcial', score: 1 }, { label: 'Não', score: 0 },
  ]},
  { id: 'g5', pillar: 'G', text: 'Transparência tributária?', type: 'radio', options: [
    { label: 'Relatório público', score: 3 }, { label: 'Só pra investidores', score: 1 }, { label: 'Nada', score: 0 },
  ]},
]

const PILLAR_META = {
  E: { label: 'Environmental', subtitle: 'Ambiental', color: GREEN, icon: Leaf },
  S: { label: 'Social', subtitle: 'Social', color: BLUE, icon: Users },
  G: { label: 'Governance', subtitle: 'Governança', color: AMBER, icon: Shield },
} as const

function badge(pct: number): { label: string; color: string } {
  if (pct >= 70) return { label: 'FORTE', color: GREEN }
  if (pct >= 40) return { label: 'MÉDIO', color: AMBER }
  return { label: 'FRACO', color: RED }
}

function msciRating(pct: number): string {
  if (pct >= 90) return 'AAA'
  if (pct >= 78) return 'AA'
  if (pct >= 65) return 'A'
  if (pct >= 52) return 'BBB'
  if (pct >= 40) return 'BB'
  if (pct >= 25) return 'B'
  return 'CCC'
}

export default function ESGRatingFramework({ marketData }: { marketData: any }) {
  const [answers, setAnswers] = useState<Record<string, number | string>>({})
  const [scores, setScores] = useState<Record<string, number>>({})
  const [pillarAnalysis, setPillarAnalysis] = useState<Record<string, string>>({})
  const [pillarLoading, setPillarLoading] = useState<Record<string, boolean>>({})
  const [report, setReport] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const marketContext = useMemo(() => {
    if (!marketData) return 'Dados de mercado indisponíveis'
    return `SELIC: ${marketData.selic ?? 'N/A'}% | IPCA: ${marketData.ipca ?? 'N/A'}% | USD: R$${marketData.usd ?? 'N/A'} | PIB: ${marketData.pib ?? 'N/A'}%`
  }, [marketData])

  const scoreQuestion = useCallback((q: ESGQuestion, value: number | string) => {
    if (q.type === 'radio') return q.options?.find(o => o.label === value)?.score ?? 0
    if (q.type === 'number' && q.scoreFn) return q.scoreFn(Number(value) || 0)
    return 0
  }, [])

  const handleAnswer = useCallback((qId: string, value: number | string) => {
    const q = QUESTIONS.find(x => x.id === qId)!
    setAnswers(prev => ({ ...prev, [qId]: value }))
    setScores(prev => ({ ...prev, [qId]: scoreQuestion(q, value) }))
  }, [scoreQuestion])

  const pillarScores = useMemo(() => {
    const calc = (pillar: string) => {
      const qs = QUESTIONS.filter(q => q.pillar === pillar)
      const answered = qs.filter(q => scores[q.id] !== undefined)
      if (answered.length === 0) return { sum: 0, max: 15, pct: 0, answered: 0, total: 5 }
      const sum = answered.reduce((a, q) => a + (scores[q.id] ?? 0), 0)
      return { sum, max: 15, pct: Math.round((sum / 15) * 100), answered: answered.length, total: 5 }
    }
    return { E: calc('E'), S: calc('S'), G: calc('G') }
  }, [scores])

  const overallPct = useMemo(() => {
    const { E, S, G } = pillarScores
    if (E.answered + S.answered + G.answered === 0) return 0
    return Math.round((E.pct + S.pct + G.pct) / 3)
  }, [pillarScores])

  const greenwashAlerts = useMemo(() => {
    const alerts: { text: string; color: string }[] = []
    const { E, S, G } = pillarScores
    if (E.pct >= 60 && G.pct < 30)
      alerts.push({ text: 'Ambiental forte mas governança fraca: práticas podem não ser sustentáveis sem estrutura de gestão', color: RED })
    if (G.pct >= 60 && E.pct < 30)
      alerts.push({ text: 'Boa governança mas baixo desempenho ambiental: risco de compliance sem ação real', color: AMBER })
    if (E.pct < 30 && S.pct < 30 && G.pct < 30)
      alerts.push({ text: 'Todos os pilares fracos: empresa tem risco ESG significativo', color: RED })
    const noAnswers = Object.entries(answers).filter(([, v]) => v === 'Não' || v === 'Nada' || v === 'Não mede' || v === 'Não tem conselho').length
    if (noAnswers >= 6)
      alerts.push({ text: 'Muitas respostas negativas: risco reputacional e regulatório elevado', color: AMBER })
    return alerts
  }, [pillarScores, answers])

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

  const analyzePillar = useCallback(async (pillar: 'E' | 'S' | 'G') => {
    setPillarLoading(prev => ({ ...prev, [pillar]: true }))
    const qs = QUESTIONS.filter(q => q.pillar === pillar)
    const answersText = qs.map(q => `${q.text} → ${answers[q.id] ?? 'Não respondido'} (score: ${scores[q.id] ?? 0}/3)`).join('\n')
    const meta = PILLAR_META[pillar]
    const ps = pillarScores[pillar]
    const prompt = `Analise o pilar ${meta.label} (${meta.subtitle}) do ESG Rating desta empresa.

RESPOSTAS:
${answersText}

Score: ${ps.sum}/15 (${ps.pct}%) — ${badge(ps.pct).label}
Mercado: ${marketContext}

Dê: 1) Diagnóstico em 2 linhas, 2) Pontos fortes, 3) Gaps críticos, 4) 2 ações prioritárias com prazo. Seja direto.`

    const result = await callIA(prompt)
    setPillarAnalysis(prev => ({ ...prev, [pillar]: result }))
    setPillarLoading(prev => ({ ...prev, [pillar]: false }))
  }, [answers, scores, pillarScores, callIA, marketContext])

  const generateReport = useCallback(async () => {
    setReportLoading(true)
    const rating = msciRating(overallPct)
    const prompt = `Gere um relatório ESG Rating completo para esta empresa.

DADOS:
Environmental: ${QUESTIONS.filter(q => q.pillar === 'E').map(q => `${q.text} → ${answers[q.id] ?? 'N/R'}`).join(' | ')}
Social: ${QUESTIONS.filter(q => q.pillar === 'S').map(q => `${q.text} → ${answers[q.id] ?? 'N/R'}`).join(' | ')}
Governance: ${QUESTIONS.filter(q => q.pillar === 'G').map(q => `${q.text} → ${answers[q.id] ?? 'N/R'}`).join(' | ')}
Scores: E ${pillarScores.E.pct}%, S ${pillarScores.S.pct}%, G ${pillarScores.G.pct}%
MSCI Rating calculado: ${rating}
Mercado: ${marketContext}

Referências de mercado: Natura: AAA | Itaú: AA | Vale pós-Brumadinho: B

GERE:
1. SUMÁRIO EXECUTIVO (3 linhas)
2. ANÁLISE POR PILAR (E, S, G — pontos fortes + gaps)
3. RATING MSCI EQUIVALENTE — justificativa
4. DETECÇÃO DE GREENWASHING — riscos encontrados
5. COMPARAÇÃO COM BENCHMARKS (Natura, Itaú, Vale)
6. PLANO DE AÇÃO 90 DIAS (2 ações por pilar)
7. IMPACTO NO CUSTO DE CAPITAL (SELIC/IPCA)
8. NOTA FINAL: este rating é sustentável?`

    const result = await callIA(prompt)
    setReport(result)
    setReportLoading(false)
  }, [answers, pillarScores, overallPct, callIA, marketContext])

  const copyReport = useCallback(() => {
    navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [report])

  const renderQuestion = (q: ESGQuestion, index: number) => {
    const meta = PILLAR_META[q.pillar]
    const answered = answers[q.id] !== undefined
    const sc = scores[q.id]

    return (
      <motion.div key={q.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
        style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 10, borderLeft: `4px solid ${meta.color}`, padding: '16px 20px', marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <p style={{ fontSize: 13, color: '#e0e0e0', margin: 0, flex: 1 }}>
            <span style={{ color: meta.color, fontWeight: 700, marginRight: 8 }}>{q.id.toUpperCase()}</span>{q.text}
          </p>
          {answered && sc !== undefined && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
              style={{ background: sc >= 2 ? GREEN : sc === 1 ? AMBER : RED, color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20, marginLeft: 10, whiteSpace: 'nowrap' }}>
              {sc}/3
            </motion.span>
          )}
        </div>
        {q.type === 'number' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="number" placeholder={q.placeholder} value={answers[q.id] !== undefined ? String(answers[q.id]) : ''} onChange={e => handleAnswer(q.id, Number(e.target.value))}
              style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 14, fontFamily: 'monospace', padding: '8px 12px', width: 180, outline: 'none' }} />
            {q.unit && <span style={{ color: '#888', fontSize: 12 }}>{q.unit}</span>}
          </div>
        )}
        {q.type === 'radio' && q.options && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {q.options.map(opt => {
              const selected = answers[q.id] === opt.label
              return (
                <button key={opt.label} onClick={() => handleAnswer(q.id, opt.label)}
                  style={{ background: selected ? `${meta.color}22` : 'rgba(0,0,0,0.25)', border: `1px solid ${selected ? meta.color : '#333'}`, borderRadius: 20, color: selected ? '#fff' : '#aaa', fontSize: 12, padding: '6px 14px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: selected ? 600 : 400 }}>
                  {opt.label}
                </button>
              )
            })}
          </div>
        )}
      </motion.div>
    )
  }

  const renderPillarSection = (pillar: 'E' | 'S' | 'G') => {
    const meta = PILLAR_META[pillar]
    const qs = QUESTIONS.filter(q => q.pillar === pillar)
    const ps = pillarScores[pillar]
    const Icon = meta.icon
    const allAnswered = ps.answered === 5

    return (
      <motion.section key={pillar} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ background: `${meta.color}22`, borderRadius: 8, padding: 8, display: 'flex' }}><Icon size={20} color={meta.color} /></div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, color: '#fff', fontWeight: 700 }}>{meta.label} <span style={{ color: '#888', fontWeight: 400 }}>({meta.subtitle})</span></h3>
          </div>
        </div>
        {qs.map((q, i) => renderQuestion(q, i))}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: '12px 20px', marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#888', fontSize: 13 }}>Score:</span>
            <span style={{ color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'monospace' }}>{ps.sum}/15</span>
            <span style={{ color: meta.color, fontSize: 14, fontWeight: 600 }}>({ps.pct}%)</span>
            {allAnswered && <span style={{ background: badge(ps.pct).color, color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>{badge(ps.pct).label}</span>}
          </div>
          <button onClick={() => analyzePillar(pillar)} disabled={!allAnswered || pillarLoading[pillar]}
            style={{ background: allAnswered ? meta.color : '#333', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: allAnswered ? 'pointer' : 'not-allowed', opacity: allAnswered ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
            {pillarLoading[pillar] ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
            IA analisa {meta.label}
          </button>
        </div>
        <AnimatePresence>
          {pillarAnalysis[pillar] && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${meta.color}44`, borderRadius: 10, padding: 16, marginTop: 8 }}>
              <p style={{ fontSize: 11, color: meta.color, fontWeight: 700, marginBottom: 8, margin: 0 }}>ANÁLISE IA — {meta.label.toUpperCase()}</p>
              <p style={{ fontSize: 13, color: '#ccc', whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: 0 }}>{pillarAnalysis[pillar]}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    )
  }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px 16px' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32, textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 22, color: '#fff', fontWeight: 800 }}>
          ESG Rating — <span style={{ color: GREEN }}>E</span>nvironmental, <span style={{ color: BLUE }}>S</span>ocial, <span style={{ color: AMBER }}>G</span>overnance
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: '#888' }}>Avalie seu rating ESG equivalente ao MSCI. IA analisa e compara com benchmarks.</p>
      </motion.div>

      {renderPillarSection('E')}
      {renderPillarSection('S')}
      {renderPillarSection('G')}

      {/* MSCI Rating Result */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Rating ESG (MSCI Equivalente)</h3>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          {(['E', 'S', 'G'] as const).map(p => {
            const ps = pillarScores[p]
            const meta = PILLAR_META[p]
            return (
              <div key={p} style={{ flex: '1 1 200px', background: 'rgba(0,0,0,0.35)', borderRadius: 10, padding: 16, borderTop: `3px solid ${meta.color}`, textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 13, color: meta.color, fontWeight: 700 }}>{meta.label}</p>
                <p style={{ margin: '6px 0', fontSize: 28, color: '#fff', fontWeight: 800, fontFamily: 'monospace' }}>{ps.pct}<span style={{ fontSize: 14, color: '#888' }}>%</span></p>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: badge(ps.pct).color, padding: '2px 12px', borderRadius: 20 }}>{badge(ps.pct).label}</span>
              </div>
            )
          })}
        </div>

        <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: 20, textAlign: 'center', marginBottom: 16 }}>
          <span style={{ color: '#888', fontSize: 13 }}>Seu MSCI Rating:</span>
          <span style={{ color: '#fff', fontSize: 32, fontWeight: 800, marginLeft: 12, fontFamily: 'monospace' }}>{msciRating(overallPct)}</span>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: 14, fontSize: 13, color: '#888' }}>
          <span style={{ fontWeight: 700, color: '#aaa' }}>Benchmarks: </span>
          Natura: <span style={{ color: GREEN, fontWeight: 700 }}>AAA</span> | Itaú: <span style={{ color: '#3498db', fontWeight: 700 }}>AA</span> | Vale pós-Brumadinho: <span style={{ color: RED, fontWeight: 700 }}>B</span> | Seu rating: <span style={{ color: '#fff', fontWeight: 700 }}>{msciRating(overallPct)}</span>
        </div>
      </motion.section>

      {/* Greenwashing Check */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Greenwashing Check</h3>
        {greenwashAlerts.length === 0 ? (
          <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 10, padding: 16, borderLeft: `4px solid ${GREEN}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} color={GREEN} />
              <span style={{ fontSize: 13, color: GREEN, fontWeight: 600 }}>Nenhum alerta de greenwashing detectado.</span>
            </div>
          </div>
        ) : greenwashAlerts.map((alert, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 10, padding: 16, borderLeft: `4px solid ${alert.color}`, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={18} color={alert.color} />
            <span style={{ fontSize: 13, color: '#e0e0e0' }}>{alert.text}</span>
          </motion.div>
        ))}
      </motion.section>

      {/* Report */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Relatório ESG com IA</h3>
        <button onClick={generateReport} disabled={reportLoading}
          style={{ background: 'linear-gradient(135deg, #1e8449, #1a5276)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 14, fontWeight: 700, cursor: reportLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center', opacity: reportLoading ? 0.7 : 1 }}>
          {reportLoading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
          {reportLoading ? 'Gerando relatório...' : 'Gerar Relatório ESG com IA'}
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
