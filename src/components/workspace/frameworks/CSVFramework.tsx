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
const PURPLE = '#6c3483'

interface CSVLevel {
  id: 'products' | 'chain' | 'clusters'
  label: string
  subtitle: string
  icon: any
  color: string
  question: string
  placeholder: string
  example: { company: string; description: string }
}

const LEVELS: CSVLevel[] = [
  {
    id: 'products', label: 'Nível 1: Reconceber Produtos', subtitle: 'O produto resolve um problema social?',
    icon: Lightbulb, color: GREEN,
    question: 'Descreva seu produto/serviço principal. Ele resolve algum problema social ou ambiental? Como gera receita fazendo isso?',
    placeholder: 'Ex: "Vendemos filtros de água acessíveis para comunidades rurais. Cada unidade custa R$50 e filtra 1000L. Gera receita e resolve falta de água potável."',
    example: { company: 'Natura Ekos', description: 'Ingredientes da Amazônia → renda para comunidades + produto premium. Lucro PORQUE preserva.' },
  },
  {
    id: 'chain', label: 'Nível 2: Redefinir Cadeia de Valor', subtitle: 'Onde desperdiça recursos?',
    icon: Recycle, color: BLUE,
    question: 'Identifique onde sua cadeia de valor desperdiça recursos (energia, materiais, tempo, talento). Onde a ineficiência gera custo E impacto negativo?',
    placeholder: 'Ex: "Logística reversa inexistente. 30% dos materiais vão para aterro. Transporte usa diesel 100%."',
    example: { company: 'Walmart', description: 'Reduziu embalagens em 5% → economizou US$3.4 bi/ano. Eficiência = lucro + menos resíduo.' },
  },
  {
    id: 'clusters', label: 'Nível 3: Desenvolver Clusters Locais', subtitle: 'Como o ecossistema local afeta a operação?',
    icon: Globe, color: PURPLE,
    question: 'Como o ecossistema local (fornecedores, infraestrutura, educação, saúde) afeta sua operação? Onde investir no entorno geraria retorno para o negócio?',
    placeholder: 'Ex: "Falta de mão de obra qualificada na região. Infraestrutura logística precária aumenta custos em 15%."',
    example: { company: 'Embraer', description: 'Investiu em escolas técnicas em São José dos Campos → formou fornecedores locais → reduziu custos e prazo.' },
  },
]

export default function CSVFramework({ marketData }: { marketData: any }) {
  const [levelTexts, setLevelTexts] = useState<Record<string, string>>({})
  const [levelAnalysis, setLevelAnalysis] = useState<Record<string, string>>({})
  const [levelLoading, setLevelLoading] = useState<Record<string, boolean>>({})
  const [report, setReport] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const marketContext = useMemo(() => {
    if (!marketData) return 'Dados de mercado indisponíveis'
    return `SELIC: ${marketData.selic ?? 'N/A'}% | IPCA: ${marketData.ipca ?? 'N/A'}% | USD: R$${marketData.usd ?? 'N/A'} | PIB: ${marketData.pib ?? 'N/A'}%`
  }, [marketData])

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

  const analyzeLevel = useCallback(async (levelId: string) => {
    const level = LEVELS.find(l => l.id === levelId)!
    setLevelLoading(prev => ({ ...prev, [levelId]: true }))

    const prompt = `Analise a resposta desta empresa para o ${level.label} do framework CSV (Creating Shared Value) de Michael Porter.

PERGUNTA: ${level.question}
RESPOSTA DA EMPRESA: ${levelTexts[levelId] || 'Não informado'}

Mercado: ${marketContext}

CONCEITO CHAVE: CSV ≠ CSR. CSV gera lucro PORQUE resolve problemas sociais. CSR é filantropia. CSV é estratégia.

Exemplo de referência: ${level.example.company} — ${level.example.description}

Dê:
1) A empresa está praticando CSV ou CSR? (diferença crucial)
2) Oportunidades de Valor Compartilhado neste nível
3) Risco de greenwashing se a empresa confunde CSR com CSV
4) 2 ações concretas para gerar valor compartilhado
5) Retorno financeiro estimado das ações`

    const result = await callIA(prompt)
    setLevelAnalysis(prev => ({ ...prev, [levelId]: result }))
    setLevelLoading(prev => ({ ...prev, [levelId]: false }))
  }, [levelTexts, callIA, marketContext])

  const greenwashAlerts = useMemo(() => {
    const alerts: { text: string; color: string }[] = []
    const filledLevels = LEVELS.filter(l => (levelTexts[l.id] || '').length > 10)
    if (filledLevels.length === 1 && filledLevels[0].id === 'products')
      alerts.push({ text: 'Apenas nível 1 preenchido: CSV completo exige repensar cadeia e clusters também', color: AMBER })
    const texts = Object.values(levelTexts).join(' ').toLowerCase()
    if (texts.includes('doação') || texts.includes('filantropia') || texts.includes('doar'))
      alerts.push({ text: 'Palavras como "doação/filantropia" detectadas: isso é CSR, não CSV. CSV gera lucro resolvendo problemas.', color: RED })
    if (Object.values(levelTexts).every(t => !t || t.length < 5))
      alerts.push({ text: 'Sem informações: preencha pelo menos o Nível 1 para uma análise válida', color: AMBER })
    return alerts
  }, [levelTexts])

  const generateReport = useCallback(async () => {
    setReportLoading(true)
    const levelsData = LEVELS.map(l => `${l.label}: ${levelTexts[l.id] || 'Não informado'}`).join('\n')
    const prompt = `Gere um relatório CSV (Creating Shared Value) completo para esta empresa.

DADOS POR NÍVEL:
${levelsData}

Mercado: ${marketContext}

CONCEITO: "CSV ≠ CSR. CSV gera lucro PORQUE resolve problemas sociais."

Referências:
- Natura Ekos: ingredientes amazônicos = renda para comunidades + premium pricing
- Walmart: reduziu embalagens = US$3.4 bi economizados + menos resíduo
- Embraer: escolas técnicas = fornecedores locais + menores custos

GERE:
1. SUMÁRIO EXECUTIVO — a empresa pratica CSV ou CSR?
2. ANÁLISE POR NÍVEL (3 níveis de Porter)
3. OPORTUNIDADES DE VALOR COMPARTILHADO — onde lucro e impacto se encontram
4. GREENWASHING CHECK — confusão entre CSR e CSV
5. MODELO DE NEGÓCIO CSV — como redesenhar o modelo
6. RETORNO FINANCEIRO ESTIMADO
7. PLANO DE AÇÃO 90 DIAS
8. NOTA: "Se não gera lucro resolvendo o problema, não é CSV."`

    const result = await callIA(prompt)
    setReport(result)
    setReportLoading(false)
  }, [levelTexts, callIA, marketContext])

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
          "CSV ≠ CSR. CSV gera lucro PORQUE resolve problemas sociais."
        </p>
      </motion.div>

      {/* 3 Levels */}
      {LEVELS.map((level, idx) => {
        const Icon = level.icon
        const hasText = (levelTexts[level.id] || '').length > 10

        return (
          <motion.section key={level.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ background: `${level.color}22`, borderRadius: 8, padding: 8, display: 'flex' }}><Icon size={20} color={level.color} /></div>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, color: '#fff', fontWeight: 700 }}>{level.label}</h3>
                <p style={{ margin: 0, fontSize: 13, color: level.color, fontStyle: 'italic' }}>"{level.subtitle}"</p>
              </div>
            </div>

            {/* Example card */}
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: 14, marginBottom: 12, borderLeft: `3px solid ${level.color}44` }}>
              <span style={{ fontSize: 11, color: level.color, fontWeight: 700 }}>EXEMPLO: {level.example.company}</span>
              <p style={{ fontSize: 12, color: '#aaa', margin: '4px 0 0' }}>{level.example.description}</p>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 10, padding: '16px 20px', marginBottom: 12 }}>
              <p style={{ fontSize: 13, color: '#e0e0e0', margin: '0 0 10px' }}>{level.question}</p>
              <textarea value={levelTexts[level.id] || ''} onChange={e => setLevelTexts(prev => ({ ...prev, [level.id]: e.target.value }))}
                placeholder={level.placeholder}
                style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 13, padding: '12px 14px', width: '100%', minHeight: 80, outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => analyzeLevel(level.id)} disabled={!hasText || levelLoading[level.id]}
                style={{ background: hasText ? level.color : '#333', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: hasText ? 'pointer' : 'not-allowed', opacity: hasText ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
                {levelLoading[level.id] ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                IA analisa {level.id === 'products' ? 'Produto' : level.id === 'chain' ? 'Cadeia' : 'Cluster'}
              </button>
            </div>

            <AnimatePresence>
              {levelAnalysis[level.id] && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${level.color}44`, borderRadius: 10, padding: 16, marginTop: 8 }}>
                  <p style={{ fontSize: 11, color: level.color, fontWeight: 700, marginBottom: 8, margin: 0 }}>ANÁLISE IA — {level.label.toUpperCase()}</p>
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
              <span style={{ fontSize: 13, color: GREEN, fontWeight: 600 }}>Nenhum alerta detectado. Continue preenchendo para análise completa.</span>
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
        <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Relatório CSV com IA</h3>
        <button onClick={generateReport} disabled={reportLoading}
          style={{ background: 'linear-gradient(135deg, #1e8449, #6c3483)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 14, fontWeight: 700, cursor: reportLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center', opacity: reportLoading ? 0.7 : 1 }}>
          {reportLoading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
          {reportLoading ? 'Gerando relatório...' : 'Gerar Relatório CSV com IA'}
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
