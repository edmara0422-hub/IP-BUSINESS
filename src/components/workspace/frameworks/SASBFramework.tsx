'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Loader2, Copy, AlertTriangle, CheckCircle2, FileText,
  Building, ChevronDown,
} from 'lucide-react'

const RED = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE = '#1a5276'

interface SASBTopic {
  id: string
  label: string
  question: string
  options: { label: string; score: number }[]
}

interface SASBSector {
  id: string
  label: string
  topics: SASBTopic[]
}

const SECTORS: SASBSector[] = [
  { id: 'financas', label: 'Financeiro (Bancos, Seguros)', topics: [
    { id: 'f1', label: 'Segurança de Dados', question: 'Como protege dados dos clientes?', options: [
      { label: 'LGPD completa + auditorias', score: 3 }, { label: 'LGPD parcial', score: 2 }, { label: 'Básico', score: 1 }, { label: 'Não sei', score: 0 },
    ]},
    { id: 'f2', label: 'Inclusão Financeira', question: 'Oferece produtos para baixa renda?', options: [
      { label: 'Sim, com metas', score: 3 }, { label: 'Alguns produtos', score: 2 }, { label: 'Não', score: 0 },
    ]},
    { id: 'f3', label: 'Risco Sistêmico', question: 'Gerencia risco de concentração?', options: [
      { label: 'Comitê dedicado + stress tests', score: 3 }, { label: 'Monitoramento básico', score: 1 }, { label: 'Não', score: 0 },
    ]},
    { id: 'f4', label: 'Ética nos Negócios', question: 'Tem compliance anticorrupção?', options: [
      { label: 'Programa robusto + canal', score: 3 }, { label: 'Código de ética', score: 2 }, { label: 'Não', score: 0 },
    ]},
  ]},
  { id: 'tecnologia', label: 'Tecnologia e Comunicações', topics: [
    { id: 't1', label: 'Privacidade do Usuário', question: 'Como gerencia dados pessoais?', options: [
      { label: 'Privacy by design', score: 3 }, { label: 'LGPD compliance', score: 2 }, { label: 'Básico', score: 1 }, { label: 'Não implementado', score: 0 },
    ]},
    { id: 't2', label: 'Consumo Energético', question: 'Data centers usam energia renovável?', options: [
      { label: '100% renovável', score: 3 }, { label: 'Parcial', score: 2 }, { label: 'Não', score: 0 }, { label: 'N/A', score: 1 },
    ]},
    { id: 't3', label: 'Capital Humano', question: 'Investe em retenção de talentos?', options: [
      { label: 'Programa robusto', score: 3 }, { label: 'Benefícios básicos', score: 1 }, { label: 'Turnover alto', score: 0 },
    ]},
    { id: 't4', label: 'Viés Algorítmico', question: 'Audita algoritmos para viés?', options: [
      { label: 'Sim, com auditoria externa', score: 3 }, { label: 'Internamente', score: 2 }, { label: 'Não', score: 0 }, { label: 'N/A', score: 1 },
    ]},
  ]},
  { id: 'saude', label: 'Saúde e Farmacêutico', topics: [
    { id: 'h1', label: 'Acesso a Medicamentos', question: 'Tem programa de acesso?', options: [
      { label: 'Sim, com pricing social', score: 3 }, { label: 'Amostras grátis', score: 1 }, { label: 'Não', score: 0 },
    ]},
    { id: 'h2', label: 'Segurança do Paciente', question: 'Taxa de eventos adversos?', options: [
      { label: 'Zero recalls no último ano', score: 3 }, { label: '<3 eventos', score: 2 }, { label: '>3 eventos', score: 0 },
    ]},
    { id: 'h3', label: 'Ética em Pesquisa', question: 'Comitê de ética em pesquisa?', options: [
      { label: 'Sim, independente', score: 3 }, { label: 'Sim, interno', score: 2 }, { label: 'Não', score: 0 },
    ]},
    { id: 'h4', label: 'Gestão de Resíduos', question: 'Como descarta resíduos hospitalares?', options: [
      { label: 'Processo certificado', score: 3 }, { label: 'Terceirizado', score: 2 }, { label: 'Sem controle', score: 0 },
    ]},
  ]},
  { id: 'energia', label: 'Energia e Mineração', topics: [
    { id: 'en1', label: 'Emissões GEE', question: 'Mede e reporta emissões?', options: [
      { label: 'Escopo 1+2+3 + metas SBTi', score: 3 }, { label: 'Escopo 1+2', score: 2 }, { label: 'Não mede', score: 0 },
    ]},
    { id: 'en2', label: 'Gestão Hídrica', question: 'Impacto em recursos hídricos?', options: [
      { label: 'Zero discharge + reúso', score: 3 }, { label: 'Tratamento básico', score: 1 }, { label: 'Sem gestão', score: 0 },
    ]},
    { id: 'en3', label: 'Segurança Operacional', question: 'Índice de acidentes?', options: [
      { label: 'Zero fatalidades + LTIFR baixo', score: 3 }, { label: 'Acima da média do setor', score: 1 }, { label: 'Sem controle', score: 0 },
    ]},
    { id: 'en4', label: 'Comunidades Afetadas', question: 'Relação com comunidades locais?', options: [
      { label: 'Programa de SLO + ISP', score: 3 }, { label: 'Diálogo eventual', score: 1 }, { label: 'Conflitos ativos', score: 0 },
    ]},
    { id: 'en5', label: 'Transição Energética', question: 'Investe em energia limpa?', options: [
      { label: '>30% do capex', score: 3 }, { label: '10-30%', score: 2 }, { label: '<10%', score: 1 }, { label: 'Nada', score: 0 },
    ]},
  ]},
  { id: 'consumo', label: 'Bens de Consumo e Varejo', topics: [
    { id: 'c1', label: 'Cadeia de Suprimentos', question: 'Audita fornecedores para ESG?', options: [
      { label: 'Auditoria anual + código', score: 3 }, { label: 'Autoavaliação', score: 1 }, { label: 'Não', score: 0 },
    ]},
    { id: 'c2', label: 'Embalagens', question: 'Usa embalagens sustentáveis?', options: [
      { label: '>80% reciclável/biodegradável', score: 3 }, { label: '50-80%', score: 2 }, { label: '<50%', score: 0 },
    ]},
    { id: 'c3', label: 'Segurança Alimentar', question: 'Recalls no último ano?', options: [
      { label: 'Zero', score: 3 }, { label: '1-2', score: 1 }, { label: '>2', score: 0 }, { label: 'N/A', score: 2 },
    ]},
    { id: 'c4', label: 'Marketing Responsável', question: 'Tem política de marketing ético?', options: [
      { label: 'Sim, auditada', score: 3 }, { label: 'Diretrizes internas', score: 2 }, { label: 'Não', score: 0 },
    ]},
  ]},
  { id: 'agro', label: 'Agronegócio', topics: [
    { id: 'a1', label: 'Desmatamento', question: 'Monitora desmatamento na cadeia?', options: [
      { label: 'Zero desmatamento + rastreio', score: 3 }, { label: 'Monitora parcial', score: 1 }, { label: 'Não', score: 0 },
    ]},
    { id: 'a2', label: 'Uso de Agrotóxicos', question: 'Gestão de defensivos?', options: [
      { label: 'MIP + redução progressiva', score: 3 }, { label: 'Uso controlado', score: 2 }, { label: 'Sem controle', score: 0 },
    ]},
    { id: 'a3', label: 'Trabalho Rural', question: 'Audita condições de trabalho?', options: [
      { label: 'Auditoria + certificação', score: 3 }, { label: 'Inspeção interna', score: 1 }, { label: 'Não', score: 0 },
    ]},
    { id: 'a4', label: 'Uso do Solo', question: 'Práticas de conservação?', options: [
      { label: 'Plantio direto + rotação', score: 3 }, { label: 'Algumas práticas', score: 2 }, { label: 'Convencional', score: 0 },
    ]},
  ]},
]

function badge(pct: number): { label: string; color: string } {
  if (pct >= 70) return { label: 'FORTE', color: GREEN }
  if (pct >= 40) return { label: 'MÉDIO', color: AMBER }
  return { label: 'FRACO', color: RED }
}

export default function SASBFramework({ marketData }: { marketData: any }) {
  const [selectedSector, setSelectedSector] = useState<string>('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [sectorAnalysis, setSectorAnalysis] = useState('')
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [report, setReport] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const marketContext = useMemo(() => {
    if (!marketData) return 'Dados de mercado indisponíveis'
    return `SELIC: ${marketData.selic ?? 'N/A'}% | IPCA: ${marketData.ipca ?? 'N/A'}% | USD: R$${marketData.usd ?? 'N/A'} | PIB: ${marketData.pib ?? 'N/A'}%`
  }, [marketData])

  const sector = SECTORS.find(s => s.id === selectedSector)

  const sectorScore = useMemo(() => {
    if (!sector) return { sum: 0, max: 0, pct: 0 }
    const max = sector.topics.length * 3
    const sum = sector.topics.reduce((a, t) => {
      const opt = t.options.find(o => o.label === answers[t.id])
      return a + (opt?.score ?? 0)
    }, 0)
    return { sum, max, pct: max > 0 ? Math.round((sum / max) * 100) : 0 }
  }, [sector, answers])

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

  const analyzeSector = useCallback(async () => {
    if (!sector) return
    setAnalysisLoading(true)
    const answersText = sector.topics.map(t => `${t.label}: ${t.question} → ${answers[t.id] ?? 'Não respondido'}`).join('\n')
    const prompt = `Analise os riscos ESG financeiramente materiais deste setor (${sector.label}) usando a metodologia SASB.

RESPOSTAS:
${answersText}

Score: ${sectorScore.sum}/${sectorScore.max} (${sectorScore.pct}%)
Mercado: ${marketContext}

SASB complementa GRI: GRI = seu impacto no mundo. SASB = risco financeiro que o mundo gera em você.

Dê: 1) Riscos financeiros ESG do setor, 2) Performance da empresa, 3) Gaps críticos, 4) 3 ações para mitigar riscos financeiros ESG.`

    const result = await callIA(prompt)
    setSectorAnalysis(result)
    setAnalysisLoading(false)
  }, [sector, answers, sectorScore, callIA, marketContext])

  const generateReport = useCallback(async () => {
    if (!sector) return
    setReportLoading(true)
    const answersText = sector.topics.map(t => `${t.label}: ${answers[t.id] ?? 'Não respondido'}`).join('\n')
    const prompt = `Gere um relatório SASB completo para o setor ${sector.label}.

DADOS:
${answersText}
Score: ${sectorScore.pct}%
Mercado: ${marketContext}

GERE:
1. SUMÁRIO EXECUTIVO
2. RISCOS FINANCEIROS MATERIAIS do setor
3. ANÁLISE POR TÓPICO SASB
4. GREENWASHING CHECK — a empresa está gerenciando riscos reais ou só aparência?
5. IMPACTO NO VALUATION — como ESG afeta custo de capital
6. PLANO DE AÇÃO 90 DIAS
7. SASB vs GRI — quando usar cada um
8. NOTA: "SASB = risco financeiro que o mundo gera em você"`

    const result = await callIA(prompt)
    setReport(result)
    setReportLoading(false)
  }, [sector, answers, sectorScore, callIA, marketContext])

  const copyReport = useCallback(() => {
    navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [report])

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px 16px' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32, textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 22, color: '#fff', fontWeight: 800 }}>
          SASB — <span style={{ color: BLUE }}>Materialidade Financeira</span>
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: '#888' }}>Identifique riscos ESG financeiramente relevantes para seu setor.</p>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: AMBER, fontStyle: 'italic' }}>
          "SASB complementa GRI: GRI = seu impacto no mundo. SASB = risco financeiro que o mundo gera em você."
        </p>
      </motion.div>

      {/* Sector selector */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Qual seu setor?</h3>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid #333', borderRadius: 10, color: selectedSector ? '#fff' : '#888', fontSize: 14, padding: '12px 20px', width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {sector ? sector.label : 'Selecione o setor da empresa...'} <ChevronDown size={16} color="#888" />
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'rgba(20,20,20,0.98)', border: '1px solid #333', borderRadius: 10, marginTop: 4, zIndex: 10, overflow: 'hidden' }}>
                {SECTORS.map(s => (
                  <button key={s.id} onClick={() => { setSelectedSector(s.id); setDropdownOpen(false); setAnswers({}); setSectorAnalysis(''); setReport('') }}
                    style={{ background: 'transparent', border: 'none', color: '#e0e0e0', fontSize: 13, padding: '10px 20px', width: '100%', textAlign: 'left', cursor: 'pointer', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Building size={14} color={BLUE} />{s.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Sector topics */}
      {sector && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>
            Tópicos Materiais — {sector.label}
          </h3>
          {sector.topics.map((topic, i) => (
            <motion.div key={topic.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 10, borderLeft: `4px solid ${BLUE}`, padding: '16px 20px', marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ color: BLUE, fontSize: 11, fontWeight: 700, background: `${BLUE}22`, padding: '2px 8px', borderRadius: 10 }}>{topic.label}</span>
                  <p style={{ fontSize: 13, color: '#e0e0e0', margin: '8px 0 0' }}>{topic.question}</p>
                </div>
                {answers[topic.id] && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{ background: (topic.options.find(o => o.label === answers[topic.id])?.score ?? 0) >= 2 ? GREEN : AMBER, color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>
                    {topic.options.find(o => o.label === answers[topic.id])?.score ?? 0}/3
                  </motion.span>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {topic.options.map(opt => {
                  const selected = answers[topic.id] === opt.label
                  return (
                    <button key={opt.label} onClick={() => setAnswers(prev => ({ ...prev, [topic.id]: opt.label }))}
                      style={{ background: selected ? `${BLUE}22` : 'rgba(0,0,0,0.25)', border: `1px solid ${selected ? BLUE : '#333'}`, borderRadius: 20, color: selected ? '#fff' : '#aaa', fontSize: 12, padding: '6px 14px', cursor: 'pointer', fontWeight: selected ? 600 : 400 }}>
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          ))}

          {/* Sector score + IA analysis */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: '12px 20px', marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: '#888', fontSize: 13 }}>Score SASB:</span>
              <span style={{ color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'monospace' }}>{sectorScore.sum}/{sectorScore.max}</span>
              <span style={{ color: BLUE, fontSize: 14, fontWeight: 600 }}>({sectorScore.pct}%)</span>
              {Object.keys(answers).length === sector.topics.length && (
                <span style={{ background: badge(sectorScore.pct).color, color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>{badge(sectorScore.pct).label}</span>
              )}
            </div>
            <button onClick={analyzeSector} disabled={Object.keys(answers).length < sector.topics.length || analysisLoading}
              style={{ background: Object.keys(answers).length === sector.topics.length ? BLUE : '#333', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: Object.keys(answers).length === sector.topics.length ? 'pointer' : 'not-allowed', opacity: Object.keys(answers).length === sector.topics.length ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
              {analysisLoading ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
              IA analisa riscos
            </button>
          </div>

          <AnimatePresence>
            {sectorAnalysis && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${BLUE}44`, borderRadius: 10, padding: 16, marginTop: 8 }}>
                <p style={{ fontSize: 11, color: BLUE, fontWeight: 700, marginBottom: 8, margin: 0 }}>ANÁLISE IA — RISCOS SETORIAIS SASB</p>
                <p style={{ fontSize: 13, color: '#ccc', whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: 0 }}>{sectorAnalysis}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      )}

      {/* Report */}
      {sector && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 40 }}>
          <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Relatório SASB com IA</h3>
          <button onClick={generateReport} disabled={reportLoading || Object.keys(answers).length < (sector?.topics.length ?? 0)}
            style={{ background: 'linear-gradient(135deg, #1a5276, #1e8449)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 14, fontWeight: 700, cursor: reportLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center', opacity: reportLoading ? 0.7 : 1 }}>
            {reportLoading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
            {reportLoading ? 'Gerando relatório...' : 'Gerar Relatório SASB com IA'}
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
      )}
    </div>
  )
}
