'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWorkspaceData } from '@/hooks/useWorkspaceData'
import dynamic from 'next/dynamic'
import {
  Leaf, Users, Shield, Target, TrendingUp, Loader2,
  CheckCircle2, RotateCcw, ChevronRight,
} from 'lucide-react'

const ESGFrameworks = dynamic(() => import('./ESGFrameworks'), { ssr: false })
const ESGExecutar = dynamic(() => import('./ESGExecutar'), { ssr: false })
const TBLFramework = dynamic(() => import('./frameworks/TBLFramework'), { ssr: false })

/* ── Colors ── */
const RED = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE = '#1a5276'
const PURPLE = '#7d3c98'
const TEAL = '#2471a3'

/* ── Category config ── */
const CATS: Record<string, { label: string; color: string; icon: typeof Leaf }> = {
  ENV:   { label: 'ENV',   color: GREEN,  icon: Leaf },
  SOC:   { label: 'SOC',   color: BLUE,   icon: Users },
  GOV:   { label: 'GOV',   color: AMBER,  icon: Shield },
  STRAT: { label: 'STRAT', color: PURPLE, icon: Target },
  MKT:   { label: 'MKT',   color: TEAL,   icon: TrendingUp },
}

/* ── 10 Questions ── */
interface Question {
  id: string
  cat: string
  text: string
  options: { label: string; score: number }[]
}

const QUESTIONS: Question[] = [
  { id: 'q1', cat: 'ENV', text: 'Sua operação gera resíduos, emissões ou consome recursos naturais?', options: [
    { label: 'Gera muito (indústria, produção)', score: 1 },
    { label: 'Gera pouco (escritório, digital)', score: 2 },
    { label: 'Não sei mensurar', score: 0 },
  ]},
  { id: 'q2', cat: 'ENV', text: 'Usa energia renovável ou tem meta de redução de carbono?', options: [
    { label: 'Sim, temos metas', score: 3 },
    { label: 'Parcialmente', score: 2 },
    { label: 'Não, nunca pensei nisso', score: 0 },
  ]},
  { id: 'q3', cat: 'SOC', text: 'Como trata diversidade, inclusão e gap salarial?', options: [
    { label: 'Temos política formal', score: 3 },
    { label: 'Fazemos informalmente', score: 2 },
    { label: 'Não temos nada', score: 0 },
  ]},
  { id: 'q4', cat: 'SOC', text: 'Investe na comunidade ao redor (educação, saúde, cultura)?', options: [
    { label: 'Sim, com orçamento definido (ISP)', score: 3 },
    { label: 'Ações pontuais', score: 1 },
    { label: 'Não', score: 0 },
  ]},
  { id: 'q5', cat: 'GOV', text: 'Tem canal de denúncias, compliance ou auditoria independente?', options: [
    { label: 'Sim, estruturado', score: 3 },
    { label: 'Em implementação', score: 2 },
    { label: 'Não', score: 0 },
  ]},
  { id: 'q6', cat: 'GOV', text: 'Relatórios financeiros e de impacto são públicos e auditados?', options: [
    { label: 'Sim, publicamos relatório ESG', score: 3 },
    { label: 'Só financeiro', score: 1 },
    { label: 'Nada público', score: 0 },
  ]},
  { id: 'q7', cat: 'STRAT', text: 'Seu produto/serviço resolve um problema social ou ambiental?', options: [
    { label: 'Sim, é o core do negócio (CSV nível 1)', score: 3 },
    { label: 'Parcialmente', score: 2 },
    { label: 'Não, é produto convencional', score: 0 },
  ]},
  { id: 'q8', cat: 'STRAT', text: 'Já mapeou quais ODS sua empresa impacta?', options: [
    { label: 'Sim, temos 3-5 ODS definidos', score: 3 },
    { label: 'Conheço mas não mapeei', score: 1 },
    { label: 'Não sei o que é ODS', score: 0 },
  ]},
  { id: 'q9', cat: 'MKT', text: 'Seu setor exige certificações ou selos de sustentabilidade?', options: [
    { label: 'Sim, é obrigatório', score: 3 },
    { label: 'Recomendado pelo mercado', score: 2 },
    { label: 'Não', score: 0 },
  ]},
  { id: 'q10', cat: 'MKT', text: 'Conhece o ISE B3 ou já buscou rating ESG?', options: [
    { label: 'Sim, estamos no processo', score: 3 },
    { label: 'Conheço mas não busquei', score: 1 },
    { label: 'Não sei o que é', score: 0 },
  ]},
]

/* ── Maturity helpers ── */
function maturityLabel(v: number) {
  if (v >= 81) return { label: 'REFERÊNCIA', color: BLUE }
  if (v >= 61) return { label: 'AVANÇADO', color: GREEN }
  if (v >= 31) return { label: 'EM DESENVOLVIMENTO', color: AMBER }
  return { label: 'INICIAL', color: RED }
}

/* ── IA help prompts per question (when score = 0) ── */
const IA_HELP: Record<string, string> = {
  q1: 'Minha empresa não sabe mensurar resíduos e emissões. Me ajude a: 1) Listar os principais resíduos/emissões do meu setor. 2) Dar uma estimativa da pegada de carbono de uma empresa digital/escritório. 3) Sugerir 3 ações práticas para começar a medir. Seja específico e prático.',
  q2: 'Minha empresa nunca pensou em energia renovável ou metas de carbono. Me ajude a: 1) Calcular quanto gastaria para migrar para energia renovável. 2) Sugerir metas realistas de redução de carbono para o primeiro ano. 3) Listar fornecedores de energia renovável no Brasil. Seja prático.',
  q3: 'Minha empresa não tem política de diversidade, inclusão ou análise de gap salarial. Gere um MODELO DE POLÍTICA DE DIVERSIDADE E INCLUSÃO completo para uma empresa do meu porte, incluindo: 1) Princípios e valores. 2) Metas mensuráveis (gênero, raça, PcD). 3) Processo de análise de gap salarial. 4) Cronograma de implementação em 6 meses.',
  q4: 'Minha empresa não investe na comunidade (ISP). Me ajude a: 1) Calcular quanto deveria investir (% da receita recomendado para ISP). 2) Sugerir 5 ações de Investimento Social Privado para o meu setor. 3) Explicar como isso geraria valor compartilhado (CSV). 4) Comparar ISP vs ISE — qual a diferença e se minha empresa poderia buscar o ISE.',
  q5: 'Minha empresa não tem canal de denúncias nem compliance. Gere: 1) Modelo de Canal de Denúncias (anônimo, LGPD). 2) Checklist básico de compliance para meu porte. 3) Código de ética modelo. 4) Como implementar em 30 dias com custo mínimo.',
  q6: 'Minha empresa não publica relatórios financeiros ou de impacto. Gere: 1) Template de relatório ESG simplificado (para PME). 2) Quais dados coletar nos primeiros 90 dias. 3) Modelo GRI simplificado para empresa pequena. 4) Como publicar de forma transparente.',
  q7: 'Não sei se meu produto/serviço resolve um problema social ou ambiental. Me ajude a analisar: 1) Qual problema social/ambiental meu setor causa ou poderia resolver. 2) Como aplicar CSV (Creating Shared Value) de Porter ao meu negócio — nos 3 níveis. 3) Exemplos de empresas do meu setor que fazem CSV. 4) Se meu produto já resolve algo sem eu perceber.',
  q8: 'Não sei o que são ODS (Objetivos de Desenvolvimento Sustentável). Me ajude: 1) Explique os 17 ODS em 1 frase cada. 2) Mapeie quais 3-5 ODS meu setor mais impacta. 3) Explique a diferença: ODS = O QUÊ, ESG = COMO. 4) Dê exemplo da Natura (ODS 12, 13, 15 → rating AAA). 5) ALERTA: abraçar todos os 17 = greenwashing.',
  q9: 'Não sei se meu setor exige certificações de sustentabilidade. Me ajude: 1) Liste todas as certificações relevantes para o meu setor. 2) Quais são obrigatórias vs recomendadas. 3) Custo médio e tempo de obtenção de cada uma. 4) Se vale a pena buscar a certificação B Corp.',
  q10: 'Não sei o que é ISE B3 nem rating ESG. Me ajude: 1) Explique o ISE B3 e quem pode entrar. 2) Como funciona o rating ESG (MSCI: CCC a AAA). 3) Quanto custa buscar um rating. 4) Exemplo: Natura AAA vs Vale B pós-Brumadinho. 5) O que minha empresa precisa para ser elegível.',
}

/* ── Component ── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ESGDiagnostico({ marketData }: { marketData: any }) {
  const { data: esgSaved, update: updateEsg } = useWorkspaceData('esg', {
    answers: {} as Record<string, number>,
    phase: 'DIAG' as 'DIAG' | 'RESULT',
  })
  const answers = esgSaved.answers
  const setAnswers = (v: Record<string, number>) => updateEsg({ answers: v })
  const phase = esgSaved.phase
  const setPhase = (v: 'DIAG' | 'RESULT') => updateEsg({ phase: v })
  const [esgTab, setEsgTab] = useState<'diagnostico' | 'frameworks' | 'executar' | 'tbl'>('diagnostico')
  const [iaLoading, setIaLoading] = useState(false)
  const [iaResponse, setIaResponse] = useState('')
  const [helpLoading, setHelpLoading] = useState<string | null>(null)
  const [helpResponses, setHelpResponses] = useState<Record<string, string>>({})

  const allAnswered = Object.keys(answers).length === 10

  /* ── Score calculation ── */
  const scores = useMemo(() => {
    const q = (id: string) => answers[id] ?? 0
    const envScore = ((q('q1') + q('q2')) / 6) * 100
    const socScore = ((q('q3') + q('q4')) / 6) * 100
    const govScore = ((q('q5') + q('q6')) / 6) * 100
    const stratScore = ((q('q7') + q('q8')) / 6) * 100
    const mktScore = ((q('q9') + q('q10')) / 6) * 100
    const totalScore = (envScore + socScore + govScore + stratScore + mktScore) / 5
    return { envScore, socScore, govScore, stratScore, mktScore, totalScore }
  }, [answers])

  /* ── Framework recommendation ── */
  const frameworks = useMemo(() => {
    const q = (id: string) => answers[id] ?? 0
    const list: { name: string; why: string; relevance: number }[] = []

    list.push({ name: 'TBL — Triple Bottom Line', why: 'Base universal: People, Planet, Profit. Toda empresa começa aqui.', relevance: 100 })

    if (scores.stratScore > 50 && q('q8') > 0)
      list.push({ name: 'ODS — Objetivos de Desenvolvimento Sustentável', why: 'Você já conhece ou mapeia ODS — use como bússola estratégica.', relevance: Math.round(scores.stratScore) })

    if (q('q7') === 3)
      list.push({ name: 'CSV — Criação de Valor Compartilhado', why: 'Seu core business resolve problema social/ambiental — modelo Porter.', relevance: 95 })

    if (scores.govScore > 50 || q('q6') === 3)
      list.push({ name: 'GRI — Global Reporting Initiative', why: 'Governança forte demanda relatório padronizado de impacto.', relevance: Math.round(scores.govScore) })

    if (scores.mktScore > 50 || q('q10') > 0)
      list.push({ name: 'ESG Rating + ISE B3', why: 'Mercado exige ou você já busca rating — posicione-se.', relevance: Math.round(scores.mktScore) })

    if (q('q4') === 3)
      list.push({ name: 'ISP — Investimento Social Privado', why: 'Você tem orçamento definido para comunidade — formalize como ISP.', relevance: 85 })

    if (scores.mktScore > 30)
      list.push({ name: 'SASB — Sustainability Accounting Standards', why: 'Indicadores específicos do seu setor para investidores.', relevance: Math.round(scores.mktScore * 0.8) })

    list.push({ name: 'Anti-Greenwashing Check', why: 'Verificação obrigatória: suas práticas resistem ao escrutínio?', relevance: 100 })

    return list
  }, [answers, scores])

  /* ── IA help per question ── */
  const callHelp = async (qId: string) => {
    const prompt = IA_HELP[qId]
    if (!prompt) return
    setHelpLoading(qId)
    try {
      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: prompt, marketContext: JSON.stringify(marketData ?? {}) }),
      })
      const data = await res.json()
      setHelpResponses(prev => ({ ...prev, [qId]: data.answer ?? 'Sem resposta.' }))
    } catch {
      setHelpResponses(prev => ({ ...prev, [qId]: 'Erro ao consultar IA.' }))
    } finally {
      setHelpLoading(null)
    }
  }

  /* ── IA call ── */
  const callIA = async () => {
    setIaLoading(true)
    setIaResponse('')
    const selic = marketData?.selic ?? marketData?.macro?.selic?.value ?? '—'
    const ipca = marketData?.ipca ?? marketData?.macro?.ipca?.value ?? '—'
    const pib = marketData?.pib ?? marketData?.macro?.pib?.value ?? '—'

    const answerDetails = QUESTIONS.map(q => {
      const chosen = q.options.find(o => o.score === answers[q.id])
      return `${q.id} (${q.cat}): "${q.text}" → ${chosen?.label ?? 'Não respondida'} (score ${answers[q.id] ?? 0})`
    }).join('\n')

    const prompt = `Diagnóstico ESG de empresa. Scores: ENV ${scores.envScore.toFixed(0)}%, SOC ${scores.socScore.toFixed(0)}%, GOV ${scores.govScore.toFixed(0)}%, STRAT ${scores.stratScore.toFixed(0)}%, MKT ${scores.mktScore.toFixed(0)}%. Total: ${scores.totalScore.toFixed(0)}%. Respostas detalhadas:\n${answerDetails}\nDados de mercado: SELIC ${selic}%, IPCA ${ipca}%, PIB ${pib}%.\n\nAnalise:\n1. Qual a maturidade ESG real desta empresa?\n2. Quais os 3 maiores gaps?\n3. Quais frameworks priorizar e por quê?\n4. Quais ODS são mais relevantes?\n5. Risco de greenwashing?\n6. Plano de ação: 3 coisas para fazer nos próximos 90 dias\n7. Como o mercado atual (SELIC, IPCA) impacta o custo de compliance ESG?`

    try {
      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: prompt, marketContext: marketData }),
      })
      const data = await res.json()
      setIaResponse(data.response ?? data.message ?? 'Sem resposta da IA.')
    } catch {
      setIaResponse('Erro ao consultar IA. Tente novamente.')
    } finally {
      setIaLoading(false)
    }
  }

  /* ── Analyze handler ── */
  const handleAnalyze = () => {
    setPhase('RESULT')
    callIA()
  }

  /* ── Reset ── */
  const handleReset = () => {
    setPhase('DIAG')
    setAnswers({})
    setIaResponse('')
  }

  /* ── Category bars data ── */
  const bars = [
    { key: 'ENV', label: 'Ambiental', score: scores.envScore, color: GREEN },
    { key: 'SOC', label: 'Social', score: scores.socScore, color: BLUE },
    { key: 'GOV', label: 'Governança', score: scores.govScore, color: AMBER },
    { key: 'STRAT', label: 'Estratégia', score: scores.stratScore, color: PURPLE },
    { key: 'MKT', label: 'Mercado', score: scores.mktScore, color: TEAL },
  ]

  const mat = maturityLabel(scores.totalScore)

  /* ══════════ RENDER ══════════ */

  const ESG_TABS = [
    { id: 'diagnostico' as const, label: 'Diagnóstico' },
    { id: 'frameworks' as const, label: 'Frameworks' },
  ]

  if (esgTab === 'frameworks') {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
          {ESG_TABS.map(t => (
            <button key={t.id} onClick={() => setEsgTab(t.id)}
              style={{ flex: 1, padding: '8px 0', fontSize: 13, fontWeight: 700, fontFamily: 'monospace', letterSpacing: 1, borderBottom: esgTab === t.id ? '2px solid #1a5276' : '2px solid transparent', color: esgTab === t.id ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              {t.label}
            </button>
          ))}
        </div>
        <ESGFrameworks marketData={marketData} />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
      {/* Tab selector */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
        {ESG_TABS.map(t => (
          <button key={t.id} onClick={() => setEsgTab(t.id)}
            style={{ flex: 1, padding: '8px 0', fontSize: 13, fontWeight: 700, fontFamily: 'monospace', letterSpacing: 1, borderBottom: esgTab === t.id ? '2px solid #1a5276' : '2px solid transparent', color: esgTab === t.id ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            {t.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {phase === 'DIAG' ? (
          <motion.div key="diag" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
            {/* ── Header ── */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#e5e7eb', margin: 0 }}>Diagnóstico ESG Inteligente</h2>
              <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 6 }}>10 perguntas · 8 frameworks · IA recomenda o caminho</p>
            </div>

            {/* ── Questions ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {QUESTIONS.map((q, idx) => {
                const cat = CATS[q.cat]
                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    style={{
                      background: '#111827',
                      borderRadius: 10,
                      borderLeft: `4px solid ${cat.color}`,
                      padding: '16px 18px',
                    }}
                  >
                    {/* Badge + number */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: '#fff',
                        background: cat.color, borderRadius: 20,
                        padding: '2px 10px', letterSpacing: 0.5,
                      }}>{cat.label}</span>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>Q{idx + 1}</span>
                      {answers[q.id] !== undefined && <CheckCircle2 size={14} color={GREEN} />}
                    </div>

                    {/* Question text */}
                    <p style={{ fontSize: 14, color: '#d1d5db', margin: '0 0 12px', lineHeight: 1.5 }}>{q.text}</p>

                    {/* Options as chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {q.options.map((opt) => {
                        const selected = answers[q.id] === opt.score
                        return (
                          <button
                            key={opt.label}
                            onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.score }))}
                            style={{
                              fontSize: 12, padding: '6px 14px',
                              borderRadius: 20, cursor: 'pointer',
                              border: `1.5px solid ${selected ? cat.color : '#374151'}`,
                              background: selected ? cat.color + '22' : 'transparent',
                              color: selected ? '#e5e7eb' : '#9ca3af',
                              fontWeight: selected ? 600 : 400,
                              transition: 'all 0.2s',
                            }}
                          >
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>

                    {/* IA Help button — when answer is score 0 or "não sei" */}
                    {answers[q.id] === 0 && !helpResponses[q.id] && (
                      <motion.button
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => callHelp(q.id)}
                        disabled={helpLoading === q.id}
                        style={{
                          marginTop: 12, fontSize: 12, fontWeight: 600,
                          padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
                          background: 'rgba(93,173,226,0.12)',
                          border: '1px solid rgba(93,173,226,0.25)',
                          color: '#5dade2',
                          display: 'flex', alignItems: 'center', gap: 6,
                        }}
                      >
                        {helpLoading === q.id ? (
                          <><Loader2 size={14} className="animate-spin" /> Gerando...</>
                        ) : (
                          <>IA ajuda a criar →</>
                        )}
                      </motion.button>
                    )}

                    {/* IA Help response */}
                    {helpResponses[q.id] && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          marginTop: 12, padding: '14px 16px',
                          borderRadius: 8,
                          background: 'rgba(93,173,226,0.06)',
                          border: '1px solid rgba(93,173,226,0.15)',
                        }}
                      >
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#5dade2', marginBottom: 8, letterSpacing: 1 }}>
                          RECOMENDAÇÃO IA
                        </p>
                        <div style={{ fontSize: 13, color: '#d1d5db', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                          {helpResponses[q.id]}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* ── Analyze button ── */}
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <motion.button
                whileHover={allAnswered ? { scale: 1.03 } : {}}
                whileTap={allAnswered ? { scale: 0.97 } : {}}
                disabled={!allAnswered}
                onClick={handleAnalyze}
                style={{
                  fontSize: 15, fontWeight: 700, padding: '14px 40px',
                  borderRadius: 10, border: 'none', cursor: allAnswered ? 'pointer' : 'not-allowed',
                  background: allAnswered ? GREEN : '#374151',
                  color: allAnswered ? '#fff' : '#6b7280',
                  transition: 'all 0.3s',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Analisar Diagnóstico <ChevronRight size={18} />
                </span>
              </motion.button>
              <p style={{ fontSize: 11, color: '#6b7280', marginTop: 8 }}>
                {Object.keys(answers).length}/10 respondidas
              </p>
            </div>
          </motion.div>
        ) : (
          /* ═══════════ RESULT PHASE ═══════════ */
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
            {/* ── Overall Score ── */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, letterSpacing: 1, textTransform: 'uppercase' }}>Maturidade ESG</p>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                style={{ fontSize: 36, fontWeight: 800, color: mat.color, margin: '8px 0 4px' }}
              >
                {scores.totalScore.toFixed(0)}
              </motion.div>
              <span style={{
                fontSize: 12, fontWeight: 700, color: '#fff',
                background: mat.color, borderRadius: 20,
                padding: '3px 14px', letterSpacing: 0.5,
              }}>{mat.label}</span>
            </div>

            {/* ── Category Bars ── */}
            <div style={{ background: '#111827', borderRadius: 10, padding: '18px 20px', marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Scores por Dimensão</p>
              {bars.map(b => (
                <div key={b.key} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#d1d5db' }}>{b.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: b.color }}>{b.score.toFixed(0)}%</span>
                  </div>
                  <div style={{ height: 6, background: '#1f2937', borderRadius: 3 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(b.score, 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{ height: 6, borderRadius: 3, background: b.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* ── Framework Recommendations ── */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Frameworks Recomendados</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {frameworks.map((fw, i) => {
                  const isAntiGW = fw.name.includes('Anti-Greenwashing')
                  const borderColor = isAntiGW ? RED : i === 0 ? GREEN : BLUE
                  return (
                    <motion.div
                      key={fw.name}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      style={{
                        background: '#111827', borderRadius: 10,
                        borderLeft: `4px solid ${borderColor}`,
                        padding: '14px 16px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#e5e7eb', margin: 0 }}>{fw.name}</p>
                        <p style={{ fontSize: 11, color: '#9ca3af', margin: '4px 0 0' }}>{fw.why}</p>
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: borderColor,
                        background: borderColor + '18', borderRadius: 20,
                        padding: '3px 10px', whiteSpace: 'nowrap', marginLeft: 12,
                      }}>{fw.relevance}%</span>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* ── IA Analysis ── */}
            <div style={{ background: '#111827', borderRadius: 10, padding: '18px 20px', marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Análise IA</p>
              {iaLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 0' }}>
                  <Loader2 size={18} color={BLUE} style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: 13, color: '#9ca3af' }}>Analisando diagnóstico com IA...</span>
                  <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                </div>
              ) : iaResponse ? (
                <div style={{ fontSize: 13, color: '#d1d5db', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{iaResponse}</div>
              ) : (
                <p style={{ fontSize: 12, color: '#6b7280' }}>Aguardando análise...</p>
              )}
            </div>

            {/* ── Reset button ── */}
            <div style={{ textAlign: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleReset}
                style={{
                  fontSize: 14, fontWeight: 600, padding: '12px 32px',
                  borderRadius: 10, border: `1.5px solid #374151`,
                  background: 'transparent', color: '#9ca3af', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}
              >
                <RotateCcw size={15} /> Refazer Diagnóstico
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
