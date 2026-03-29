'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Loader2, Copy, FileText, ChevronRight, CheckSquare,
  Users, Leaf, Shield, Building,
} from 'lucide-react'

const GREEN = '#1e8449'
const BLUE = '#1a5276'
const AMBER = '#9a7d0a'

const STAKEHOLDERS = [
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'funcionarios', label: 'Funcionários', icon: Users },
  { id: 'fornecedores', label: 'Fornecedores', icon: Building },
  { id: 'comunidade', label: 'Comunidade', icon: Users },
  { id: 'investidores', label: 'Investidores', icon: Building },
  { id: 'governo', label: 'Governo', icon: Shield },
]

const ESG_THEMES = [
  { id: 'emissoes', label: 'Emissões GEE', category: 'E', gri: 'GRI 305' },
  { id: 'energia', label: 'Energia', category: 'E', gri: 'GRI 302' },
  { id: 'agua', label: 'Água e Efluentes', category: 'E', gri: 'GRI 303' },
  { id: 'residuos', label: 'Resíduos', category: 'E', gri: 'GRI 306' },
  { id: 'biodiversidade', label: 'Biodiversidade', category: 'E', gri: 'GRI 304' },
  { id: 'emprego', label: 'Emprego', category: 'S', gri: 'GRI 401' },
  { id: 'saude_seguranca', label: 'Saúde e Segurança', category: 'S', gri: 'GRI 403' },
  { id: 'treinamento', label: 'Treinamento', category: 'S', gri: 'GRI 404' },
  { id: 'diversidade', label: 'Diversidade e Igualdade', category: 'S', gri: 'GRI 405' },
  { id: 'direitos_humanos', label: 'Direitos Humanos', category: 'S', gri: 'GRI 412' },
  { id: 'comunidade_local', label: 'Comunidades Locais', category: 'S', gri: 'GRI 413' },
  { id: 'anticorrupcao', label: 'Anticorrupção', category: 'G', gri: 'GRI 205' },
  { id: 'impostos', label: 'Impostos', category: 'G', gri: 'GRI 207' },
  { id: 'governanca', label: 'Governança', category: 'G', gri: 'GRI 2-9' },
  { id: 'etica', label: 'Ética e Integridade', category: 'G', gri: 'GRI 2-23' },
]

const categoryColor: Record<string, string> = { E: GREEN, S: BLUE, G: AMBER }

export default function GRIFramework({ marketData }: { marketData: any }) {
  const [step, setStep] = useState(1)
  const [selectedStakeholders, setSelectedStakeholders] = useState<string[]>([])
  const [stakeholderThemes, setStakeholderThemes] = useState<Record<string, string[]>>({})
  const [indicatorData, setIndicatorData] = useState<Record<string, string>>({})
  const [report, setReport] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const marketContext = useMemo(() => {
    if (!marketData) return 'Dados de mercado indisponíveis'
    return `SELIC: ${marketData.selic ?? 'N/A'}% | IPCA: ${marketData.ipca ?? 'N/A'}% | USD: R$${marketData.usd ?? 'N/A'} | PIB: ${marketData.pib ?? 'N/A'}%`
  }, [marketData])

  const materialThemes = useMemo(() => {
    const allThemes = new Set<string>()
    Object.values(stakeholderThemes).forEach(themes => themes.forEach(t => allThemes.add(t)))
    return Array.from(allThemes)
  }, [stakeholderThemes])

  const toggleStakeholder = (id: string) => {
    setSelectedStakeholders(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const toggleTheme = (stakeholder: string, themeId: string) => {
    setStakeholderThemes(prev => {
      const current = prev[stakeholder] || []
      return { ...prev, [stakeholder]: current.includes(themeId) ? current.filter(t => t !== themeId) : [...current, themeId] }
    })
  }

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

  const generateReport = useCallback(async () => {
    setReportLoading(true)
    const themesData = materialThemes.map(tId => {
      const theme = ESG_THEMES.find(t => t.id === tId)!
      return `${theme.gri} — ${theme.label}: ${indicatorData[tId] || 'Não informado'}`
    }).join('\n')

    const stakeholdersText = selectedStakeholders.map(sId => {
      const s = STAKEHOLDERS.find(x => x.id === sId)!
      const themes = (stakeholderThemes[sId] || []).map(tId => ESG_THEMES.find(t => t.id === tId)?.label).join(', ')
      return `${s.label}: ${themes || 'Nenhum tema'}`
    }).join('\n')

    const prompt = `Gere um relatório GRI Standards completo baseado na análise de materialidade.

STAKEHOLDERS E TEMAS MATERIAIS:
${stakeholdersText}

DADOS DOS INDICADORES GRI:
${themesData}

Mercado: ${marketContext}

GERE UM RELATÓRIO GRI SEGUINDO A ESTRUTURA:
1. SUMÁRIO DE MATERIALIDADE — quais temas são mais relevantes e por quê
2. DESEMPENHO POR INDICADOR GRI — análise de cada indicador reportado
3. GAPS DE REPORTE — indicadores que faltam dados
4. COMPARAÇÃO COM MELHORES PRÁTICAS
5. RECOMENDAÇÕES — próximos passos para completar o relatório GRI
6. NÍVEL DE ADERÊNCIA AO GRI (Core/Comprehensive)
7. DICA: "GRI = seu impacto no mundo. SASB = risco financeiro que o mundo gera em você."

Seja prático e direto. Use linguagem profissional.`

    const result = await callIA(prompt)
    setReport(result)
    setReportLoading(false)
    setStep(4)
  }, [materialThemes, indicatorData, selectedStakeholders, stakeholderThemes, callIA, marketContext])

  const copyReport = useCallback(() => {
    navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [report])

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px 16px' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32, textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 22, color: '#fff', fontWeight: 800 }}>
          GRI Standards — <span style={{ color: GREEN }}>Relatório de Sustentabilidade</span>
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: '#888' }}>Construa seu relatório GRI guiado em 4 etapas. IA gera o relatório final.</p>
      </motion.div>

      {/* Step indicators */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, justifyContent: 'center' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: step >= s ? GREEN : 'rgba(0,0,0,0.35)', color: step >= s ? '#fff' : '#666',
              fontSize: 13, fontWeight: 700, border: `1px solid ${step >= s ? GREEN : '#333'}`,
            }}>{s}</div>
            {s < 4 && <ChevronRight size={14} color="#555" />}
          </div>
        ))}
      </div>

      {/* Step 1: Análise de Materialidade */}
      {step === 1 && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>
            Etapa 1: Análise de Materialidade
          </h3>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>Selecione seus stakeholders e para cada um, os temas ESG relevantes.</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
            {STAKEHOLDERS.map(s => {
              const selected = selectedStakeholders.includes(s.id)
              return (
                <button key={s.id} onClick={() => toggleStakeholder(s.id)}
                  style={{ background: selected ? `${GREEN}22` : 'rgba(0,0,0,0.35)', border: `1px solid ${selected ? GREEN : '#333'}`, borderRadius: 10, color: selected ? '#fff' : '#aaa', fontSize: 13, padding: '10px 18px', cursor: 'pointer', fontWeight: selected ? 600 : 400, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckSquare size={14} color={selected ? GREEN : '#555'} />{s.label}
                </button>
              )
            })}
          </div>

          {selectedStakeholders.map(sId => {
            const s = STAKEHOLDERS.find(x => x.id === sId)!
            return (
              <motion.div key={sId} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                <p style={{ fontSize: 14, color: '#fff', fontWeight: 700, marginBottom: 10, margin: 0 }}>{s.label} — Temas materiais:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  {ESG_THEMES.map(t => {
                    const sel = (stakeholderThemes[sId] || []).includes(t.id)
                    return (
                      <button key={t.id} onClick={() => toggleTheme(sId, t.id)}
                        style={{ background: sel ? `${categoryColor[t.category]}22` : 'rgba(0,0,0,0.25)', border: `1px solid ${sel ? categoryColor[t.category] : '#333'}`, borderRadius: 20, color: sel ? '#fff' : '#888', fontSize: 11, padding: '4px 12px', cursor: 'pointer' }}>
                        {t.label}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}

          <button onClick={() => setStep(2)} disabled={materialThemes.length === 0}
            style={{ background: materialThemes.length > 0 ? GREEN : '#333', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: materialThemes.length > 0 ? 'pointer' : 'not-allowed', marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            Próximo: Coleta de Dados <ChevronRight size={16} />
          </button>
        </motion.section>
      )}

      {/* Step 2: Coleta de Dados */}
      {step === 2 && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>
            Etapa 2: Coleta de Dados GRI
          </h3>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>Para cada tema material, informe os dados do indicador GRI correspondente.</p>

          {materialThemes.map((tId, i) => {
            const theme = ESG_THEMES.find(t => t.id === tId)!
            return (
              <motion.div key={tId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 10, borderLeft: `4px solid ${categoryColor[theme.category]}`, padding: '16px 20px', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ color: categoryColor[theme.category], fontSize: 11, fontWeight: 700, background: `${categoryColor[theme.category]}22`, padding: '2px 8px', borderRadius: 10 }}>{theme.gri}</span>
                  <span style={{ fontSize: 13, color: '#e0e0e0', fontWeight: 600 }}>{theme.label}</span>
                </div>
                <textarea value={indicatorData[tId] || ''} onChange={e => setIndicatorData(prev => ({ ...prev, [tId]: e.target.value }))}
                  placeholder={`Descreva os dados para ${theme.label} (ex: valor, meta, progresso...)`}
                  style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 13, padding: '10px 14px', width: '100%', minHeight: 60, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
              </motion.div>
            )
          })}

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={() => setStep(1)} style={{ background: 'rgba(0,0,0,0.35)', color: '#aaa', border: '1px solid #333', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Voltar</button>
            <button onClick={() => { setStep(3); generateReport() }}
              style={{ background: GREEN, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={16} /> Gerar Relatório GRI
            </button>
          </div>
        </motion.section>
      )}

      {/* Step 3: Loading */}
      {step === 3 && reportLoading && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: 40 }}>
          <Loader2 size={32} color={GREEN} className="animate-spin" style={{ marginBottom: 16 }} />
          <p style={{ fontSize: 14, color: '#aaa' }}>Gerando relatório GRI com IA...</p>
        </motion.section>
      )}

      {/* Step 4: Relatório */}
      {step === 4 && report && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>
            Etapa 4: Relatório GRI
          </h3>
          <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #333', borderRadius: 12, padding: 20 }}>
            <p style={{ fontSize: 13, color: '#ccc', whiteSpace: 'pre-wrap', lineHeight: 1.7, margin: 0 }}>{report}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button onClick={copyReport}
              style={{ background: 'transparent', border: `1px solid ${copied ? GREEN : '#555'}`, color: copied ? GREEN : '#aaa', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Copy size={14} />{copied ? 'Copiado!' : 'Copiar Relatório'}
            </button>
            <button onClick={() => { setStep(1); setReport('') }}
              style={{ background: 'rgba(0,0,0,0.35)', color: '#aaa', border: '1px solid #333', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Refazer análise
            </button>
          </div>
        </motion.section>
      )}
    </div>
  )
}
