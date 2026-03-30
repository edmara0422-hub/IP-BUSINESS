'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Loader2, Copy, AlertTriangle, FileText, Target,
} from 'lucide-react'

const RED = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE = '#1a5276'

interface ODS {
  id: number
  title: string
  desc: string
  color: string
  category: 'people' | 'prosperity' | 'planet' | 'peace' | 'partnership'
  metrics: string[]
  suggestedTarget: string
}

const ODS_LIST: ODS[] = [
  { id: 1, title: 'Erradicação da Pobreza', color: '#e5243b', category: 'people', desc: 'Acabar com a pobreza em todas as suas formas. Para empresas: garantir salário digno, não explorar mão-de-obra barata, investir em comunidades de baixa renda.', metrics: ['% funcionários acima do salário digno', 'Investimento na comunidade'], suggestedTarget: '100% acima do salário digno' },
  { id: 2, title: 'Fome Zero', color: '#dda63a', category: 'people', desc: 'Acabar com a fome e promover agricultura sustentável. Para empresas: reduzir desperdício alimentar na cadeia, doar excedentes, apoiar agricultura familiar.', metrics: ['Doações alimentares (ton)', 'Desperdício na cadeia'], suggestedTarget: 'Reduzir desperdício em 50%' },
  { id: 3, title: 'Saúde e Bem-estar', color: '#4c9f38', category: 'people', desc: 'Assegurar vida saudável e bem-estar para todos. Para empresas: saúde ocupacional, plano de saúde, programa de bem-estar mental, zero acidentes de trabalho.', metrics: ['Taxa de acidentes', 'Cobertura de plano de saúde'], suggestedTarget: 'Zero acidentes + 100% cobertura' },
  { id: 4, title: 'Educação de Qualidade', color: '#c5192d', category: 'people', desc: 'Garantir educação inclusiva e equitativa de qualidade. Para empresas: treinamento contínuo, bolsas de estudo, parcerias com escolas, programas de mentoria.', metrics: ['Horas de treinamento/pessoa', 'Bolsas de estudo'], suggestedTarget: '40h/pessoa/ano' },
  { id: 5, title: 'Igualdade de Gênero', color: '#ff3a21', category: 'people', desc: 'Alcançar igualdade de gênero e empoderar mulheres. Para empresas: equidade salarial, mulheres em liderança, licença parental igualitária, combate ao assédio.', metrics: ['% mulheres em liderança', 'Equidade salarial'], suggestedTarget: '50% mulheres em liderança' },
  { id: 6, title: 'Água Potável e Saneamento', color: '#26bde2', category: 'planet', desc: 'Garantir gestão sustentável da água. Para empresas: reduzir consumo, reutilizar água, tratar efluentes, não contaminar fontes hídricas.', metrics: ['Consumo de água (m³)', 'Reúso de água (%)'], suggestedTarget: 'Reduzir consumo em 30%' },
  { id: 7, title: 'Energia Acessível e Limpa', color: '#fcc30b', category: 'prosperity', desc: 'Garantir acesso a energia acessível e sustentável. Para empresas: migrar para energia renovável, eficiência energética, reduzir consumo por unidade produzida.', metrics: ['% energia renovável', 'Eficiência energética'], suggestedTarget: '100% energia renovável' },
  { id: 8, title: 'Trabalho Decente', color: '#a21942', category: 'prosperity', desc: 'Promover crescimento econômico sustentado e trabalho decente. Para empresas: salários justos, ambiente seguro, sem trabalho análogo à escravidão na cadeia, inclusão.', metrics: ['Turnover', 'eNPS', 'Empregos criados'], suggestedTarget: 'eNPS >50 + turnover <15%' },
  { id: 9, title: 'Indústria, Inovação e Infraestrutura', color: '#fd6925', category: 'prosperity', desc: 'Construir infraestrutura resiliente e fomentar inovação. Para empresas: investir em P&D, adotar tecnologias limpas, inovar em processos sustentáveis.', metrics: ['Investimento em P&D (%)', 'Patentes registradas'], suggestedTarget: '>5% da receita em P&D' },
  { id: 10, title: 'Redução das Desigualdades', color: '#dd1367', category: 'prosperity', desc: 'Reduzir desigualdade dentro e entre países. Para empresas: razão salarial justa, diversidade em todos os níveis, acessibilidade, inclusão de PcD.', metrics: ['Razão salarial max/min', 'Diversidade'], suggestedTarget: 'Razão max/min <20x' },
  { id: 11, title: 'Cidades Sustentáveis', color: '#fd9d24', category: 'prosperity', desc: 'Tornar cidades inclusivas, seguras e sustentáveis. Para empresas: mobilidade limpa, impacto urbanístico positivo, construções verdes, logística eficiente.', metrics: ['Mobilidade sustentável', 'Impacto urbanístico'], suggestedTarget: '50% mobilidade limpa' },
  { id: 12, title: 'Consumo Responsável', color: '#bf8b2e', category: 'planet', desc: 'Garantir padrões de consumo e produção sustentáveis. Para empresas: economia circular, reduzir resíduos, embalagens sustentáveis, transparência ao consumidor.', metrics: ['Resíduos reciclados (%)', 'Circularidade'], suggestedTarget: '>80% reciclagem' },
  { id: 13, title: 'Ação Contra Mudança do Clima', color: '#3f7e44', category: 'planet', desc: 'Tomar medidas urgentes contra mudança do clima. Para empresas: medir pegada de carbono, definir metas de redução (SBTi), compensar emissões, net zero.', metrics: ['Emissões CO2 (tCO2e)', 'Meta SBTi'], suggestedTarget: 'Net zero até 2050' },
  { id: 14, title: 'Vida na Água', color: '#0a97d9', category: 'planet', desc: 'Conservar e usar de forma sustentável os oceanos. Para empresas: tratar efluentes, não contaminar rios/mares, reduzir plástico, proteger ecossistemas marinhos.', metrics: ['Efluentes tratados (%)', 'Impacto em ecossistemas'], suggestedTarget: '100% efluentes tratados' },
  { id: 15, title: 'Vida Terrestre', color: '#56c02b', category: 'planet', desc: 'Proteger ecossistemas terrestres e combater desmatamento. Para empresas: desmatamento zero na cadeia, restauração florestal, proteção da biodiversidade.', metrics: ['Área preservada (ha)', 'Desmatamento zero'], suggestedTarget: 'Desmatamento zero na cadeia' },
  { id: 16, title: 'Paz, Justiça e Instituições', color: '#00689d', category: 'peace', desc: 'Promover sociedades pacíficas e instituições eficazes. Para empresas: anticorrupção, canal de denúncias, compliance robusto, transparência total.', metrics: ['Canal de denúncias', 'Anticorrupção'], suggestedTarget: 'Compliance 100%' },
  { id: 17, title: 'Parcerias', color: '#19486a', category: 'partnership', desc: 'Fortalecer parcerias para implementação. Para empresas: parcerias com ONGs, governo, academia. Participar de iniciativas coletivas (Pacto Global, ISE).', metrics: ['Parcerias ESG ativas', 'Participação em iniciativas'], suggestedTarget: '>3 parcerias ESG ativas' },
]

const CATEGORY_LABELS: Record<string, string> = {
  people: 'Pessoas',
  prosperity: 'Prosperidade',
  planet: 'Planeta',
  peace: 'Paz',
  partnership: 'Parcerias',
}

export default function ODSFramework({ marketData }: { marketData: any }) {
  const [selectedODS, setSelectedODS] = useState<number[]>([])
  const [expandedODS, setExpandedODS] = useState<number | null>(null)
  const [odsStatus, setOdsStatus] = useState<Record<number, string>>({})
  const [report, setReport] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const marketContext = useMemo(() => {
    if (!marketData) return 'Dados de mercado indisponíveis'
    return `SELIC: ${marketData.selic ?? 'N/A'}% | IPCA: ${marketData.ipca ?? 'N/A'}% | USD: R$${marketData.usd ?? 'N/A'} | PIB: ${marketData.pib ?? 'N/A'}%`
  }, [marketData])

  const toggleODS = (id: number) => {
    setSelectedODS(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 5) return prev
      return [...prev, id]
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
    const odsData = selectedODS.map(id => {
      const ods = ODS_LIST.find(o => o.id === id)!
      return `ODS ${id} (${ods.title}): Status atual: ${odsStatus[id] || 'Não informado'} | Métricas: ${ods.metrics.join(', ')} | Meta sugerida: ${ods.suggestedTarget}`
    }).join('\n')

    const prompt = `Gere um plano de implementação ODS para esta empresa.

ODS SELECIONADOS:
${odsData}

Mercado: ${marketContext}

CONCEITO CHAVE: "ODS = O QUÊ. ESG = COMO."
Exemplo: Natura escolheu ODS 12, 13, 15 → conquistou rating AAA no MSCI.

GERE:
1. SUMÁRIO — quais ODS foram priorizados e por quê
2. PLANO POR ODS — para cada ODS selecionado:
   a) Diagnóstico do status atual
   b) Gap até a meta
   c) 3 ações concretas com prazo
   d) KPIs para medir progresso
3. SINERGIAS — como os ODS selecionados se complementam
4. GREENWASHING CHECK — avisos se a seleção parece superficial
5. CONEXÃO COM ESG — como cada ODS se conecta com E, S ou G
6. CUSTO ESTIMADO de implementação
7. BENCHMARKS — empresas referência em cada ODS
8. NOTA: "Abraçar todos os 17 ODS = greenwashing. Focar em 3-5 = estratégia real."`

    const result = await callIA(prompt)
    setReport(result)
    setReportLoading(false)
  }, [selectedODS, odsStatus, callIA, marketContext])

  const copyReport = useCallback(() => {
    navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [report])

  const categories = ['people', 'prosperity', 'planet', 'peace', 'partnership']

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px 16px' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32, textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 22, color: '#fff', fontWeight: 800 }}>
          ODS — <span style={{ color: '#26bde2' }}>Objetivos de Desenvolvimento Sustentável</span>
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: '#888' }}>Mapeie os ODS relevantes para sua empresa. Selecione até 5.</p>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: AMBER, fontStyle: 'italic' }}>"ODS = O QUÊ. ESG = COMO."</p>
      </motion.div>

      {/* ODS Grid by Category */}
      {categories.map(cat => {
        const odsInCat = ODS_LIST.filter(o => o.category === cat)
        return (
          <motion.section key={cat} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, color: '#aaa', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
              {CATEGORY_LABELS[cat]}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {odsInCat.map(ods => {
                const selected = selectedODS.includes(ods.id)
                const expanded = expandedODS === ods.id
                const disabled = !selected && selectedODS.length >= 5
                return (
                  <motion.div key={ods.id} layout style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${selected ? ods.color : '#333'}`, background: selected ? `${ods.color}12` : 'rgba(0,0,0,0.35)', opacity: disabled ? 0.4 : 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', cursor: disabled ? 'not-allowed' : 'pointer' }}
                      onClick={() => !disabled && setExpandedODS(expanded ? null : ods.id)}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: ods.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{ods.id}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#e0e0e0' }}>{ods.title}</div>
                        {!expanded && <div style={{ fontSize: 11, color: '#666', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ods.desc.split('.')[0]}.</div>}
                      </div>
                      {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: ods.color, flexShrink: 0 }} />}
                    </div>
                    <AnimatePresence>
                      {expanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                          <div style={{ padding: '0 14px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.6, margin: '10px 0' }}>{ods.desc}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                              {ods.metrics.map(m => (
                                <span key={m} style={{ background: `${ods.color}15`, border: `1px solid ${ods.color}33`, borderRadius: 20, fontSize: 11, color: '#ccc', padding: '3px 10px' }}>{m}</span>
                              ))}
                            </div>
                            <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Meta: <span style={{ color: ods.color, fontWeight: 600 }}>{ods.suggestedTarget}</span></div>
                            <button onClick={(e) => { e.stopPropagation(); toggleODS(ods.id) }}
                              style={{ background: selected ? 'rgba(192,57,43,0.15)' : `${ods.color}22`, border: `1px solid ${selected ? '#c0392b' : ods.color}`, borderRadius: 8, color: selected ? '#c0392b' : ods.color, fontSize: 12, fontWeight: 700, padding: '8px 16px', cursor: 'pointer' }}>
                              {selected ? 'Remover' : 'Selecionar este ODS'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>
        )
      })}

      {/* Warning if >5 */}
      {selectedODS.length >= 5 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 10, padding: 14, borderLeft: `4px solid ${AMBER}`, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertTriangle size={18} color={AMBER} />
          <span style={{ fontSize: 13, color: '#e0e0e0' }}>Limite de 5 ODS atingido. Abraçar todos = greenwashing. Focar em 3-5 = estratégia real.</span>
        </motion.div>
      )}

      {/* Selected ODS details */}
      {selectedODS.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>
            Detalhamento dos ODS Selecionados
          </h3>
          {selectedODS.map((id, i) => {
            const ods = ODS_LIST.find(o => o.id === id)!
            return (
              <motion.div key={id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 10, borderLeft: `4px solid ${ods.color}`, padding: '16px 20px', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ background: ods.color, color: '#fff', fontSize: 14, fontWeight: 800, width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ods.id}</span>
                  <span style={{ fontSize: 14, color: '#fff', fontWeight: 700 }}>{ods.title}</span>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 12, color: '#888', margin: '0 0 4px' }}>O que medir:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {ods.metrics.map(m => (
                      <span key={m} style={{ background: `${ods.color}15`, border: `1px solid ${ods.color}33`, borderRadius: 20, fontSize: 11, color: '#ccc', padding: '4px 10px' }}>{m}</span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 12, color: '#888', margin: '0 0 4px' }}>Meta sugerida:</p>
                  <span style={{ fontSize: 13, color: ods.color, fontWeight: 600 }}>{ods.suggestedTarget}</span>
                </div>

                <div>
                  <p style={{ fontSize: 12, color: '#888', margin: '0 0 4px' }}>Status atual da empresa:</p>
                  <textarea value={odsStatus[id] || ''} onChange={e => setOdsStatus(prev => ({ ...prev, [id]: e.target.value }))}
                    placeholder="Descreva o que já fazem para este ODS..."
                    style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 13, padding: '10px 14px', width: '100%', minHeight: 50, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
                </div>
              </motion.div>
            )
          })}

          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: 14, marginTop: 8, fontSize: 13, color: '#888' }}>
            <span style={{ fontWeight: 700, color: '#aaa' }}>Exemplo: </span>
            Natura: ODS <span style={{ color: '#bf8b2e', fontWeight: 700 }}>12</span>, <span style={{ color: '#3f7e44', fontWeight: 700 }}>13</span>, <span style={{ color: '#56c02b', fontWeight: 700 }}>15</span> → rating <span style={{ color: GREEN, fontWeight: 700 }}>AAA</span>
          </div>
        </motion.section>
      )}

      {/* Report */}
      {selectedODS.length > 0 && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 40 }}>
          <h3 style={{ fontSize: 16, color: '#fff', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #333', paddingBottom: 8 }}>Plano de Implementação com IA</h3>
          <button onClick={generateReport} disabled={reportLoading}
            style={{ background: 'linear-gradient(135deg, #26bde2, #1a5276)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 14, fontWeight: 700, cursor: reportLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center', opacity: reportLoading ? 0.7 : 1 }}>
            {reportLoading ? <Loader2 size={16} className="animate-spin" /> : <Target size={16} />}
            {reportLoading ? 'Gerando plano...' : 'Gerar Plano de Implementação ODS'}
          </button>
          <AnimatePresence>
            {report && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 16 }}>
                <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #333', borderRadius: 12, padding: 20 }}>
                  <p style={{ fontSize: 13, color: '#ccc', whiteSpace: 'pre-wrap', lineHeight: 1.7, margin: 0 }}>{report}</p>
                </div>
                <button onClick={copyReport}
                  style={{ background: 'transparent', border: `1px solid ${copied ? GREEN : '#555'}`, color: copied ? GREEN : '#aaa', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Copy size={14} />{copied ? 'Copiado!' : 'Copiar Plano'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      )}
    </div>
  )
}
