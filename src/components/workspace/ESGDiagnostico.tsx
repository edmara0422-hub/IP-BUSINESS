'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Leaf, Users, Shield, Brain, Loader2, Target, TrendingUp, AlertTriangle, CheckCircle2, BarChart3 } from 'lucide-react'

const RED = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE = '#1a5276'

function scoreColor(v: number): string {
  if (v >= 70) return GREEN
  if (v >= 40) return AMBER
  return RED
}

interface ActionItem {
  priority: 'URGENTE' | 'IMPORTANTE' | 'CONSIDERAR'
  text: string
  impact: string
  framework: string
  effort: string
}

const ISE_BENCHMARKS: Record<string, { E: number; S: number; G: number }> = {
  tech: { E: 65, S: 72, G: 80 },
  agro: { E: 55, S: 60, G: 65 },
  health: { E: 70, S: 78, G: 75 },
  energy: { E: 50, S: 65, G: 70 },
  fintech: { E: 68, S: 75, G: 82 },
  retail: { E: 58, S: 65, G: 68 },
  default: { E: 60, S: 68, G: 72 },
}

const QUESTIONS = [
  { id: 'q1', label: 'Seu negócio tem impacto ambiental direto?', options: ['Alto (indústria, mineração, agro)', 'Médio (varejo, logística)', 'Baixo (tech, serviços, digital)'] },
  { id: 'q2', label: 'Quantos funcionários?', options: ['Só eu', '2-10', '11-50', '51-200', '200+'] },
  { id: 'q3', label: 'Tem investidores ou busca investimento?', options: ['Sim, tenho', 'Buscando', 'Não, bootstrap'] },
  { id: 'q4', label: 'Exporta ou tem operação internacional?', options: ['Sim', 'Planejando', 'Não'] },
  { id: 'q5', label: 'Já faz algo de sustentabilidade?', options: ['Nada', 'Básico (reciclagem, economia de energia)', 'Estruturado (relatório, metas)'] },
  { id: 'q6', label: 'Qual seu objetivo principal?', options: ['Reduzir custos', 'Atrair investidores', 'Compliance/regulação', 'Impacto social real', 'Vantagem competitiva'] },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ESGDiagnostico({ marketData }: { marketData: any }) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [iaLoading, setIaLoading] = useState(false)
  const [iaResponse, setIaResponse] = useState('')

  const answeredCount = Object.keys(answers).length
  const showScores = answeredCount >= 4

  const sector = marketData?.sectors?.[0]?.name?.toLowerCase() ?? 'default'
  const sectorKey = Object.keys(ISE_BENCHMARKS).find(k => sector.includes(k)) ?? 'default'
  const iseBenchmark = ISE_BENCHMARKS[sectorKey]
  const ipcaRate = marketData?.macro?.ipca?.value ?? 4.5
  const pibRate = marketData?.macro?.pib?.value ?? 2.1
  const sectorHeat = marketData?.sectors?.[0]?.heat ?? 50

  /* ---------- SCORE CALCULATION ---------- */
  const scores = useMemo(() => {
    // Environmental: Q1 (impact) + Q5 (sustainability actions)
    let E = 50
    if (answers.q1 === 'Alto (indústria, mineração, agro)') E -= 20
    else if (answers.q1 === 'Médio (varejo, logística)') E -= 5
    else if (answers.q1 === 'Baixo (tech, serviços, digital)') E += 10
    if (answers.q5 === 'Nada') E -= 20
    else if (answers.q5 === 'Básico (reciclagem, economia de energia)') E += 10
    else if (answers.q5 === 'Estruturado (relatório, metas)') E += 30

    // Social: Q2 (employees) + Q6 (objective)
    let S = 50
    if (answers.q2 === 'Só eu') S -= 5
    else if (answers.q2 === '2-10') S += 5
    else if (answers.q2 === '11-50') S += 10
    else if (answers.q2 === '51-200') S += 15
    else if (answers.q2 === '200+') S += 20
    if (answers.q6 === 'Impacto social real') S += 20
    else if (answers.q6 === 'Reduzir custos') S -= 5
    else if (answers.q6 === 'Atrair investidores') S += 10
    else if (answers.q6 === 'Compliance/regulação') S += 5
    else if (answers.q6 === 'Vantagem competitiva') S += 8

    // Governance: Q3 (investors) + Q4 (international) + Q5 (sustainability)
    let G = 40
    if (answers.q3 === 'Sim, tenho') G += 25
    else if (answers.q3 === 'Buscando') G += 15
    if (answers.q4 === 'Sim') G += 15
    else if (answers.q4 === 'Planejando') G += 8
    if (answers.q5 === 'Estruturado (relatório, metas)') G += 15
    else if (answers.q5 === 'Básico (reciclagem, economia de energia)') G += 5

    E = Math.max(0, Math.min(100, E))
    S = Math.max(0, Math.min(100, S))
    G = Math.max(0, Math.min(100, G))
    const overall = Math.round(E * 0.35 + S * 0.30 + G * 0.35)
    return { E, S, G, overall }
  }, [answers])

  /* ---------- ACTION GENERATION ---------- */
  const actions = useMemo((): ActionItem[] => {
    if (!showScores) return []
    const list: ActionItem[] = []

    if (answers.q1?.startsWith('Alto') && answers.q5 === 'Nada') {
      list.push({ priority: 'URGENTE', text: 'Inventariar emissões de CO2 (Escopo 1 e 2)', impact: 'Reduz risco regulatório e prepara para mercado de carbono', framework: 'GRI 305', effort: 'Investimento médio' })
      list.push({ priority: 'URGENTE', text: 'Implementar gestão de resíduos', impact: 'Redução de custos operacionais em até 15%', framework: 'TBL Planet', effort: 'Baixo custo' })
    }

    if (answers.q3 === 'Sim, tenho' || answers.q3 === 'Buscando') {
      list.push({ priority: 'URGENTE', text: 'Preparar relatório GRI para investidores', impact: 'Investidores exigem transparência — sem relatório, sem funding', framework: 'GRI', effort: 'Alto investimento' })
      list.push({ priority: 'IMPORTANTE', text: 'Alinhar com ODS relevantes do setor', impact: 'Comunica propósito e atrai capital ESG', framework: 'ODS', effort: 'Baixo custo' })
      list.push({ priority: 'IMPORTANTE', text: 'Simular rating ESG (MSCI CCC-AAA)', impact: 'Antecipa como investidores vão te avaliar', framework: 'ESG Rating', effort: 'Investimento médio' })
    }

    if (answers.q4 === 'Sim') {
      list.push({ priority: 'URGENTE', text: 'Compliance com padrões internacionais (SASB)', impact: 'Exigência crescente em mercados europeus e norte-americanos', framework: 'SASB', effort: 'Alto investimento' })
    }

    if (answers.q6 === 'Reduzir custos') {
      list.push({ priority: 'IMPORTANTE', text: 'Mapear desperdícios na cadeia (CSV nível 2)', impact: 'Empresas reduzem 8-20% de custos operacionais', framework: 'CSV Porter', effort: 'Baixo custo' })
    }

    if (answers.q6 === 'Impacto social real') {
      list.push({ priority: 'IMPORTANTE', text: 'Definir ISP (Investimento Social Privado)', impact: 'Estrutura investimento social com métricas de retorno', framework: 'ISP', effort: 'Investimento médio' })
      list.push({ priority: 'CONSIDERAR', text: 'Conectar com ODS Pessoas (1-5)', impact: 'Alinha impacto social com agenda global', framework: 'ODS', effort: 'Baixo custo' })
    }

    if (answers.q6 === 'Vantagem competitiva') {
      list.push({ priority: 'IMPORTANTE', text: 'Reconceber produto com valor compartilhado (CSV nível 1)', impact: 'Diferenciação real — não é marketing, é estratégia', framework: 'CSV Porter', effort: 'Investimento médio' })
      list.push({ priority: 'CONSIDERAR', text: 'Buscar elegibilidade ISE B3', impact: 'Prestígio e acesso a investidores institucionais', framework: 'ISE', effort: 'Alto investimento' })
    }

    // Always include
    list.push({ priority: 'CONSIDERAR', text: 'Anti-greenwashing audit — verificar os 7 pecados', impact: 'Evita dano reputacional e penalidades do CONAR', framework: 'CONAR', effort: 'Baixo custo' })
    list.push({ priority: 'CONSIDERAR', text: 'ODS = O QUÊ / ESG = COMO — mapear 3-5 ODS prioritários', impact: 'Clareza estratégica: ODS define destino, ESG define caminho', framework: 'ODS + ESG', effort: 'Baixo custo' })

    return list
  }, [answers, showScores])

  /* ---------- IA DEEP ANALYSIS ---------- */
  async function generateIAReport() {
    setIaLoading(true)
    setIaResponse('')
    const prompt = `Gere um relatório ESG completo para esta empresa:
- Setor: ${sector}
- Impacto ambiental: ${answers.q1 ?? 'Não respondido'}
- Funcionários: ${answers.q2 ?? 'Não respondido'}
- Investidores: ${answers.q3 ?? 'Não respondido'}
- Internacional: ${answers.q4 ?? 'Não respondido'}
- Sustentabilidade atual: ${answers.q5 ?? 'Não respondido'}
- Objetivo: ${answers.q6 ?? 'Não respondido'}
- Scores: E=${scores.E}, S=${scores.S}, G=${scores.G}
- Mercado: IPCA ${ipcaRate}%, PIB ${pibRate}%, setor heat ${sectorHeat}

Inclua:
1. Diagnóstico geral
2. Frameworks recomendados e por quê (TBL, GRI, SASB, ODS, CSV, ISE, ISP)
3. ODS prioritários (máximo 5) com justificativa
4. Plano de 12 meses com custos estimados
5. ROI esperado da sustentabilidade
6. Riscos de NÃO agir`
    try {
      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: prompt, marketContext: JSON.stringify(marketData ?? {}) }),
      })
      const data = await res.json()
      setIaResponse(data.answer || 'Sem resposta da IA.')
    } catch {
      setIaResponse('Erro ao conectar com a IA. Tente novamente.')
    } finally {
      setIaLoading(false)
    }
  }

  /* ---------- PRIORITY STYLES ---------- */
  const priorityColor: Record<string, string> = { URGENTE: RED, IMPORTANTE: AMBER, CONSIDERAR: GREEN }
  const effortBadge: Record<string, string> = { 'Baixo custo': GREEN, 'Investimento médio': AMBER, 'Alto investimento': RED }

  /* ---------- CHIP COMPONENT ---------- */
  function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
    return (
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        style={{
          padding: '6px 14px', borderRadius: 999, fontSize: 13,
          border: selected ? '1.5px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.15)',
          background: selected ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
          color: selected ? '#fff' : 'rgba(255,255,255,0.6)',
          cursor: 'pointer', transition: 'all .2s',
          fontWeight: selected ? 600 : 400,
        }}
      >
        {label}
      </motion.button>
    )
  }

  /* ---------- BAR COMPONENT ---------- */
  function ScoreBar({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
    return (
      <div style={{ flex: 1, minWidth: 140 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
          {icon} {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ height: '100%', background: color, borderRadius: 999 }}
            />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color, minWidth: 28, textAlign: 'right' }}>{value}</span>
        </div>
      </div>
    )
  }

  /* ---------- BENCHMARK BAR ---------- */
  function BenchmarkBar({ label, user, ise }: { label: string; user: number; ise: number }) {
    return (
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{label}</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden', marginBottom: 3 }}>
              <motion.div animate={{ width: `${user}%` }} initial={{ width: 0 }} transition={{ duration: 0.7 }}
                style={{ height: '100%', background: scoreColor(user), borderRadius: 999 }} />
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
              <motion.div animate={{ width: `${ise}%` }} initial={{ width: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                style={{ height: '100%', background: BLUE, borderRadius: 999 }} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', minWidth: 60, textAlign: 'right' }}>
            <span style={{ color: scoreColor(user) }}>{user}</span> / <span style={{ color: BLUE }}>{ise}</span>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- SECTION WRAPPER ---------- */
  function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 20, marginBottom: 16, border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {children}
      </motion.div>
    )
  }

  const iseEligible = scores.overall >= (iseBenchmark.E + iseBenchmark.S + iseBenchmark.G) / 3 - 10
  const iseAvg = Math.round((iseBenchmark.E + iseBenchmark.S + iseBenchmark.G) / 3)

  /* ---------- RENDER ---------- */
  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* ===== SECTION 1: DIAGNÓSTICO RÁPIDO ===== */}
      <Section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Target size={18} color={BLUE} />
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: 0 }}>Diagnóstico ESG</h2>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 16px' }}>
          Responda 6 perguntas — a IA faz o resto
        </p>

        {QUESTIONS.map((q, qi) => (
          <div key={q.id} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>
              {qi + 1}. {q.label}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {q.options.map(opt => (
                <Chip key={opt} label={opt} selected={answers[q.id] === opt} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))} />
              ))}
            </div>
          </div>
        ))}

        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
          {answeredCount}/6 respondidas {answeredCount >= 4 ? '— scores calculados abaixo' : '— responda pelo menos 4 para ver os scores'}
        </div>
      </Section>

      {/* ===== SECTION 2: SCORE ESG ===== */}
      {showScores && (
        <Section delay={0.1}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <BarChart3 size={18} color={scoreColor(scores.overall)} />
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: 0 }}>Score ESG</h2>
            <span style={{
              marginLeft: 'auto', fontSize: 22, fontWeight: 800,
              color: scoreColor(scores.overall),
            }}>
              {scores.overall}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
            <ScoreBar label="Environmental" value={scores.E} icon={<Leaf size={14} />} color={scoreColor(scores.E)} />
            <ScoreBar label="Social" value={scores.S} icon={<Users size={14} />} color={scoreColor(scores.S)} />
            <ScoreBar label="Governance" value={scores.G} icon={<Shield size={14} />} color={scoreColor(scores.G)} />
          </div>

          <div style={{
            fontSize: 12, color: 'rgba(255,255,255,0.5)', padding: '10px 12px',
            background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)',
          }}>
            Equivalente ISE B3: <strong style={{ color: iseEligible ? GREEN : RED }}>
              {iseEligible ? 'ELEGÍVEL' : 'NÃO ELEGÍVEL'}
            </strong> — empresas do seu setor no ISE têm média de <strong>{iseAvg}</strong>/100
          </div>
        </Section>
      )}

      {/* ===== SECTION 3: O QUE A IA RECOMENDA ===== */}
      {showScores && actions.length > 0 && (
        <Section delay={0.2}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <CheckCircle2 size={18} color={GREEN} />
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: 0 }}>Plano de ação personalizado</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {actions.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                style={{
                  background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '12px 14px',
                  borderLeft: `3px solid ${priorityColor[a.priority]}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: '#fff', padding: '2px 7px', borderRadius: 4,
                    background: priorityColor[a.priority], textTransform: 'uppercase', letterSpacing: 0.5,
                  }}>
                    {a.priority}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#fff', flex: 1 }}>{a.text}</span>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>{a.impact}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{
                    fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)',
                    padding: '1px 6px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4,
                  }}>
                    via {a.framework}
                  </span>
                  <span style={{
                    fontSize: 10, color: effortBadge[a.effort] ?? AMBER,
                    padding: '1px 6px', border: `1px solid ${effortBadge[a.effort] ?? AMBER}33`, borderRadius: 4,
                  }}>
                    {a.effort}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* ===== SECTION 4: BENCHMARK ISE B3 ===== */}
      {showScores && (
        <Section delay={0.3}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <TrendingUp size={18} color={BLUE} />
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: 0 }}>Benchmark — ISE B3 no seu setor</h2>
          </div>

          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
            Empresas do ISE no setor <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{sectorKey}</strong> têm em média:
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: AMBER, display: 'inline-block' }} /> Seu score
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: BLUE, display: 'inline-block' }} /> ISE B3
            </span>
          </div>

          <BenchmarkBar label="Environmental" user={scores.E} ise={iseBenchmark.E} />
          <BenchmarkBar label="Social" user={scores.S} ise={iseBenchmark.S} />
          <BenchmarkBar label="Governance" user={scores.G} ise={iseBenchmark.G} />

          {(scores.E < iseBenchmark.E || scores.S < iseBenchmark.S || scores.G < iseBenchmark.G) && (
            <div style={{
              marginTop: 10, padding: '10px 12px', background: 'rgba(192,57,43,0.08)',
              borderRadius: 8, border: '1px solid rgba(192,57,43,0.15)', fontSize: 12, color: 'rgba(255,255,255,0.6)',
            }}>
              <AlertTriangle size={13} style={{ marginRight: 6, verticalAlign: -2, color: RED }} />
              <strong>Para ser elegível:</strong>{' '}
              {[
                scores.E < iseBenchmark.E ? `E precisa subir ${iseBenchmark.E - scores.E} pts` : null,
                scores.S < iseBenchmark.S ? `S precisa subir ${iseBenchmark.S - scores.S} pts` : null,
                scores.G < iseBenchmark.G ? `G precisa subir ${iseBenchmark.G - scores.G} pts` : null,
              ].filter(Boolean).join(' · ')}
            </div>
          )}
        </Section>
      )}

      {/* ===== SECTION 5: ANÁLISE PROFUNDA COM IA ===== */}
      {showScores && (
        <Section delay={0.4}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Brain size={18} color={BLUE} />
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: 0 }}>Análise profunda com IA</h2>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateIAReport}
            disabled={iaLoading}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 8,
              background: iaLoading ? 'rgba(26,82,118,0.2)' : `linear-gradient(135deg, ${BLUE}, ${GREEN})`,
              border: 'none', color: '#fff', fontSize: 14, fontWeight: 600,
              cursor: iaLoading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8, opacity: iaLoading ? 0.6 : 1,
            }}
          >
            {iaLoading ? <><Loader2 size={16} className="animate-spin" /> Gerando relatório...</> : 'Gerar relatório ESG com IA'}
          </motion.button>

          {iaResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: 14, padding: 16, background: 'rgba(255,255,255,0.03)',
                borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)',
                fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.75)',
                whiteSpace: 'pre-wrap', maxHeight: 500, overflowY: 'auto',
              }}
            >
              {iaResponse}
            </motion.div>
          )}
        </Section>
      )}
    </div>
  )
}
