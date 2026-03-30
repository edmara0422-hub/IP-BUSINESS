'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Loader2, Copy, FileText, Lightbulb, Recycle, Globe,
  AlertTriangle, CheckCircle2,
} from 'lucide-react'

const RED = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE = '#1a5276'
const PURPLE = '#7d3c98'

interface RadioQ {
  id: string
  text: string
  options: { label: string; score: number }[]
}

interface LevelDef {
  id: 'products' | 'chain' | 'clusters'
  label: string
  subtitle: string
  icon: any
  color: string
  radios: RadioQ[]
  textareaQ: { id: string; text: string; placeholder: string }
  examples: { company: string; description: string }[]
}

const LEVELS: LevelDef[] = [
  {
    id: 'products', label: 'Nivel 1: Reconceber Produtos', subtitle: 'O produto resolve um problema social?',
    icon: Lightbulb, color: GREEN,
    radios: [
      { id: 'q1', text: 'Seu produto resolve um problema social ou ambiental?', options: [
        { label: 'Sim, e o core', score: 3 }, { label: 'Parcialmente', score: 2 }, { label: 'Nao', score: 0 }, { label: 'Nao sei', score: 0 }] },
      { id: 'q2', text: 'Existe publico excluido do mercado que seu produto poderia atender?', options: [
        { label: 'Sim, ja atendemos', score: 3 }, { label: 'Sim, mas nao atendemos', score: 1 }, { label: 'Nao pensei nisso', score: 0 }] },
      { id: 'q3', text: 'Seu modelo de negocio gera receita E impacto positivo simultaneamente?', options: [
        { label: 'Sim (CSV real)', score: 3 }, { label: 'Gera receita mas doa parte (CSR)', score: 1 }, { label: 'So receita', score: 0 }] },
      { id: 'q4', text: 'Quanto da receita vem de produtos/servicos com impacto social?', options: [
        { label: '>50%', score: 3 }, { label: '10-50%', score: 2 }, { label: '<10%', score: 1 }, { label: '0%', score: 0 }] },
    ],
    textareaQ: { id: 'q5', text: 'Descreva como seu produto poderia resolver um problema social do seu setor', placeholder: 'Ex: "Vendemos filtros de agua acessiveis para comunidades rurais..."' },
    examples: [
      { company: 'Natura Ekos', description: 'Ingredientes da Amazonia = renda para comunidades + produto premium. Lucro PORQUE preserva.' },
      { company: 'Grameen Bank', description: 'Microcredito para os mais pobres = inclusao financeira + retorno. Lucro PORQUE resolve pobreza.' },
      { company: 'Unilever Pureit', description: 'Purificador acessivel = saude para milhoes + receita. Lucro PORQUE resolve acesso a agua.' },
    ],
  },
  {
    id: 'chain', label: 'Nivel 2: Redefinir Cadeia de Valor', subtitle: 'Onde desperdicar recursos?',
    icon: Recycle, color: BLUE,
    radios: [
      { id: 'q6', text: 'Seus 5 maiores custos incluem desperdicio que poderia ser otimizado?', options: [
        { label: 'Sim, ja otimizamos', score: 3 }, { label: 'Sim, identificamos mas nao agimos', score: 1 }, { label: 'Nao analisamos', score: 0 }] },
      { id: 'q7', text: 'Treina fornecedores para melhorar qualidade E reduzir impacto?', options: [
        { label: 'Programa estruturado', score: 3 }, { label: 'Informalmente', score: 1 }, { label: 'Nao', score: 0 }] },
      { id: 'q8', text: 'Tem logistica reversa ou economia circular?', options: [
        { label: 'Implementada', score: 3 }, { label: 'Em planejamento', score: 1 }, { label: 'Nao', score: 0 }] },
      { id: 'q9', text: 'Consegue reduzir custo E melhorar impacto social/ambiental na mesma acao?', options: [
        { label: 'Sim, fazemos', score: 3 }, { label: 'Possivel mas nao fizemos', score: 1 }, { label: 'Nao sabemos', score: 0 }] },
    ],
    textareaQ: { id: 'q10', text: 'Descreva o maior desperdicio na sua cadeia de valor', placeholder: 'Ex: "30% dos materiais vao para aterro. Logistica reversa inexistente..."' },
    examples: [
      { company: 'Walmart', description: 'Reduziu embalagens em 5% = economizou US$3.4 bi/ano. Eficiencia = lucro + menos residuo.' },
      { company: 'Nestle', description: 'Treinou agricultores locais = melhor materia-prima + menores custos + renda para comunidades.' },
    ],
  },
  {
    id: 'clusters', label: 'Nivel 3: Desenvolver Clusters Locais', subtitle: 'Como o ecossistema local afeta a operacao?',
    icon: Globe, color: PURPLE,
    radios: [
      { id: 'q11', text: 'A infraestrutura local (transporte, educacao, saude) afeta sua operacao?', options: [
        { label: 'Muito, e gargalo', score: 3 }, { label: 'Parcialmente', score: 2 }, { label: 'Nao', score: 0 }] },
      { id: 'q12', text: 'Investe no desenvolvimento do ecossistema ao redor?', options: [
        { label: 'Sim, com retorno mensuravel', score: 3 }, { label: 'Sim, filantropia', score: 1 }, { label: 'Nao', score: 0 }] },
      { id: 'q13', text: 'Seus fornecedores sao locais?', options: [
        { label: '>70% local', score: 3 }, { label: '30-70%', score: 2 }, { label: '<30%', score: 1 }] },
      { id: 'q14', text: 'Participa de associacoes/clusters do setor?', options: [
        { label: 'Sim, ativamente', score: 3 }, { label: 'Cadastrado mas passivo', score: 1 }, { label: 'Nao', score: 0 }] },
    ],
    textareaQ: { id: 'q15', text: 'O que melhorar no entorno geraria retorno pro negocio?', placeholder: 'Ex: "Falta mao de obra qualificada. Investir em escola tecnica reduziria custos em 15%..."' },
    examples: [
      { company: 'Embraer Sao Jose', description: 'Investiu em escolas tecnicas = fornecedores locais qualificados + menores custos e prazo.' },
      { company: 'Porto Digital Recife', description: 'Cluster de TI = 350+ empresas, infraestrutura compartilhada, talento local = competitividade.' },
    ],
  },
]

export default function CSVFramework({ marketData }: { marketData: any }) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({})
  const [levelAnalysis, setLevelAnalysis] = useState<Record<string, string>>({})
  const [levelLoading, setLevelLoading] = useState<Record<string, boolean>>({})
  const [report, setReport] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const marketContext = useMemo(() => {
    if (!marketData) return 'Dados de mercado indisponiveis'
    return `SELIC: ${marketData.selic ?? 'N/A'}% | IPCA: ${marketData.ipca ?? 'N/A'}% | USD: R$${marketData.usd ?? 'N/A'} | PIB: ${marketData.pib ?? 'N/A'}%`
  }, [marketData])

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

  const setRadio = (qId: string, label: string) => setAnswers(prev => ({ ...prev, [qId]: label }))

  const levelScore = useCallback((level: LevelDef) => {
    let sum = 0
    level.radios.forEach(q => {
      const sel = answers[q.id]
      const opt = q.options.find(o => o.label === sel)
      if (opt) sum += opt.score
    })
    return Math.round((sum / 12) * 100)
  }, [answers])

  const levelAnswered = useCallback((level: LevelDef) => {
    return level.radios.filter(q => answers[q.id]).length
  }, [answers])

  const greenwashAlerts = useMemo(() => {
    const alerts: { text: string; color: string }[] = []
    if (answers.q3 === 'Gera receita mas doa parte (CSR)')
      alerts.push({ text: 'Atencao: doar parte do lucro e CSR, nao CSV. CSV e quando o lucro EXISTE porque resolve o problema.', color: RED })
    if (answers.q1 === 'Nao' && answers.q4 === '0%')
      alerts.push({ text: 'Risco: produto convencional sem impacto + alegacao de sustentabilidade = potencial greenwashing.', color: RED })
    if (!textAnswers.q5 && !textAnswers.q10 && !textAnswers.q15)
      alerts.push({ text: 'Sem detalhes concretos = dificil validar. Preencha as questoes abertas.', color: AMBER })
    const s1 = levelScore(LEVELS[0]), s2 = levelScore(LEVELS[1]), s3 = levelScore(LEVELS[2])
    if (s1 > 60 && s2 < 30 && s3 < 30)
      alerts.push({ text: 'CSV real precisa dos 3 niveis. So produto nao basta.', color: AMBER })
    return alerts
  }, [answers, textAnswers, levelScore])

  const analyzeLevel = useCallback(async (level: LevelDef) => {
    setLevelLoading(prev => ({ ...prev, [level.id]: true }))
    const radioSummary = level.radios.map(q => `${q.text} -> ${answers[q.id] || 'Nao respondido'}`).join('\n')
    const score = levelScore(level)
    const prompt = `Analise as respostas desta empresa para o ${level.label} do framework CSV (Creating Shared Value) de Michael Porter.

RESPOSTAS:
${radioSummary}
Questao aberta: ${textAnswers[level.textareaQ.id] || 'Nao informado'}

SCORE: ${score}% (${score >= 75 ? 'Excelente' : score >= 50 ? 'Bom' : score >= 25 ? 'Inicial' : 'Critico'})
Mercado: ${marketContext}

CONCEITO: CSV gera lucro PORQUE resolve problemas sociais. CSV != CSR.
Exemplos: ${level.examples.map(e => `${e.company}: ${e.description}`).join(' | ')}

De:
1) A empresa pratica CSV ou CSR neste nivel?
2) Oportunidades de Valor Compartilhado
3) Riscos de greenwashing detectados
4) 2 acoes concretas com retorno estimado
5) Score justificado (${score}%)`

    const result = await callIA(prompt)
    setLevelAnalysis(prev => ({ ...prev, [level.id]: result }))
    setLevelLoading(prev => ({ ...prev, [level.id]: false }))
  }, [answers, textAnswers, callIA, marketContext, levelScore])

  const generateReport = useCallback(async () => {
    setReportLoading(true)
    const allAnswers = LEVELS.map(l => {
      const radioSummary = l.radios.map(q => `  ${q.text} -> ${answers[q.id] || 'Nao respondido'}`).join('\n')
      return `${l.label} (Score: ${levelScore(l)}%):\n${radioSummary}\n  Aberta: ${textAnswers[l.textareaQ.id] || 'Nao informado'}`
    }).join('\n\n')

    const gwAlerts = greenwashAlerts.map(a => `- ${a.text}`).join('\n') || 'Nenhum alerta'

    const prompt = `Gere um relatorio CSV (Creating Shared Value) completo.

TODAS AS RESPOSTAS (15 questoes):
${allAnswers}

GREENWASHING DETECTADO:
${gwAlerts}

Mercado: ${marketContext}

Referencias: Natura Ekos (ingredientes amazonicos), Walmart (embalagens -5% = US$3.4bi), Nestle (agricultores), Embraer (escolas tecnicas), Grameen Bank (microcredito), Porto Digital Recife (cluster TI)

GERE:
1. SUMARIO EXECUTIVO — CSV ou CSR?
2. SCORE POR NIVEL (3 niveis com %)
3. ANALISE DE GREENWASHING com base nas contradicoes
4. OPORTUNIDADES DE VALOR COMPARTILHADO
5. MODELO DE NEGOCIO CSV — como redesenhar
6. RETORNO FINANCEIRO ESTIMADO
7. PLANO DE ACAO 90 DIAS
8. NOTA: "Se nao gera lucro resolvendo o problema, nao e CSV."`

    const result = await callIA(prompt)
    setReport(result)
    setReportLoading(false)
  }, [answers, textAnswers, callIA, marketContext, levelScore, greenwashAlerts])

  const copyReport = useCallback(() => {
    navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [report])

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px 16px' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32, textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 22, color: '#fff', fontWeight: 800 }}>
          CSV — <span style={{ color: GREEN }}>Creating Shared Value</span>
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: '#888' }}>Framework de Michael Porter: gere lucro resolvendo problemas sociais.</p>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: RED, fontStyle: 'italic', fontWeight: 600 }}>
          "CSV != CSR. CSV gera lucro PORQUE resolve problemas sociais."
        </p>
      </motion.div>

      {LEVELS.map((level, idx) => {
        const Icon = level.icon
        const answered = levelAnswered(level)
        const score = levelScore(level)
        const canAnalyze = answered >= 2

        return (
          <motion.section key={level.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ background: `${level.color}22`, borderRadius: 8, padding: 8, display: 'flex' }}>
                <Icon size={20} color={level.color} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 16, color: '#fff', fontWeight: 700 }}>{level.label}</h3>
                <p style={{ margin: 0, fontSize: 13, color: level.color, fontStyle: 'italic' }}>"{level.subtitle}"</p>
              </div>
              {answered > 0 && (
                <div style={{ background: `${level.color}22`, borderRadius: 8, padding: '4px 12px' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: score >= 50 ? GREEN : score >= 25 ? AMBER : RED }}>{score}%</span>
                </div>
              )}
            </div>

            {/* Examples */}
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: 14, marginBottom: 14, borderLeft: `3px solid ${level.color}44` }}>
              {level.examples.map((ex, i) => (
                <div key={i} style={{ marginBottom: i < level.examples.length - 1 ? 6 : 0 }}>
                  <span style={{ fontSize: 11, color: level.color, fontWeight: 700 }}>{ex.company}: </span>
                  <span style={{ fontSize: 12, color: '#aaa' }}>{ex.description}</span>
                </div>
              ))}
            </div>

            {/* Radio questions */}
            <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 10, padding: '16px 20px', marginBottom: 12 }}>
              {level.radios.map((q, qi) => (
                <div key={q.id} style={{ marginBottom: qi < level.radios.length - 1 ? 16 : 12, paddingBottom: qi < level.radios.length - 1 ? 16 : 0, borderBottom: qi < level.radios.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <p style={{ fontSize: 13, color: '#e0e0e0', margin: '0 0 8px', fontWeight: 600 }}>
                    Q{idx * 5 + qi + 1}. {q.text}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {q.options.map(opt => {
                      const selected = answers[q.id] === opt.label
                      return (
                        <button key={opt.label} onClick={() => setRadio(q.id, opt.label)}
                          style={{
                            background: selected ? `${level.color}33` : 'rgba(0,0,0,0.25)',
                            border: `1px solid ${selected ? level.color : '#333'}`,
                            color: selected ? '#fff' : '#999', borderRadius: 6,
                            padding: '6px 12px', fontSize: 12, cursor: 'pointer',
                            fontWeight: selected ? 700 : 400, transition: 'all 0.2s',
                          }}>
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Textarea question */}
              <div>
                <p style={{ fontSize: 13, color: '#e0e0e0', margin: '0 0 8px', fontWeight: 600 }}>
                  Q{idx * 5 + 5}. {level.textareaQ.text}
                </p>
                <textarea
                  value={textAnswers[level.textareaQ.id] || ''}
                  onChange={e => setTextAnswers(prev => ({ ...prev, [level.textareaQ.id]: e.target.value }))}
                  placeholder={level.textareaQ.placeholder}
                  style={{
                    background: 'rgba(0,0,0,0.25)', border: '1px solid #333', borderRadius: 8,
                    color: '#fff', fontSize: 13, padding: '10px 14px', width: '100%',
                    minHeight: 60, outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5,
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => analyzeLevel(level)} disabled={!canAnalyze || levelLoading[level.id]}
                style={{
                  background: canAnalyze ? level.color : '#333', color: '#fff', border: 'none',
                  borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600,
                  cursor: canAnalyze ? 'pointer' : 'not-allowed', opacity: canAnalyze ? 1 : 0.5,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                {levelLoading[level.id] ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                IA analisa {level.id === 'products' ? 'Produto' : level.id === 'chain' ? 'Cadeia' : 'Cluster'}
              </button>
            </div>

            <AnimatePresence>
              {levelAnalysis[level.id] && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${level.color}44`, borderRadius: 10, padding: 16, marginTop: 8 }}>
                  <p style={{ fontSize: 11, color: level.color, fontWeight: 700, margin: '0 0 8px' }}>ANALISE IA — {level.label.toUpperCase()}</p>
                  <p style={{ fontSize: 13, color: '#ccc', whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: 0 }}>{levelAnalysis[level.id]}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )
      })}

      {/* Greenwashing Check */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Greenwashing Check — CSV vs CSR</h3>
        {greenwashAlerts.length === 0 ? (
          <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 10, padding: 16, borderLeft: `4px solid ${GREEN}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} color={GREEN} />
              <span style={{ fontSize: 13, color: GREEN, fontWeight: 600 }}>Nenhum alerta detectado. Continue preenchendo para analise completa.</span>
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
        <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Relatorio CSV com IA</h3>
        <button onClick={generateReport} disabled={reportLoading}
          style={{
            background: `linear-gradient(135deg, ${GREEN}, ${PURPLE})`, color: '#fff', border: 'none',
            borderRadius: 10, padding: '14px 28px', fontSize: 14, fontWeight: 700,
            cursor: reportLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center',
            gap: 8, width: '100%', justifyContent: 'center', opacity: reportLoading ? 0.7 : 1,
          }}>
          {reportLoading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
          {reportLoading ? 'Gerando relatorio...' : 'Gerar Relatorio CSV com IA'}
        </button>
        <AnimatePresence>
          {report && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 16 }}>
              <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #333', borderRadius: 12, padding: 20 }}>
                <p style={{ fontSize: 13, color: '#ccc', whiteSpace: 'pre-wrap', lineHeight: 1.7, margin: 0 }}>{report}</p>
              </div>
              <button onClick={copyReport}
                style={{
                  background: 'transparent', border: `1px solid ${copied ? GREEN : '#555'}`,
                  color: copied ? GREEN : '#aaa', borderRadius: 8, padding: '8px 20px',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 10,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                <Copy size={14} />{copied ? 'Copiado!' : 'Copiar Relatorio'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </div>
  )
}
