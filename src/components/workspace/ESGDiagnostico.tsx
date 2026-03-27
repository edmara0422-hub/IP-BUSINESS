'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Leaf, Users, Shield, Brain, Loader2, Target, TrendingUp, AlertTriangle,
  CheckCircle2, BarChart3, BookOpen, ChevronDown, ChevronUp, Eye, Layers,
  Globe, Heart, Landmark, Scale, Lightbulb,
} from 'lucide-react'

const RED = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE = '#1a5276'

function scoreColor(v: number): string {
  if (v >= 70) return GREEN
  if (v >= 40) return AMBER
  return RED
}

function levelLabel(v: number): string {
  if (v >= 70) return 'Alta'
  if (v >= 40) return 'Média'
  return 'Baixa'
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
  { id: 'q1', category: 'E', label: 'Sua operacao gera residuos, emissoes ou consome recursos naturais?', options: ['Gera muito (industria, producao)', 'Gera pouco (escritorio, digital)', 'Nao sei mensurar'], scores: [30, 70, 45] },
  { id: 'q2', category: 'E', label: 'Usa energia renovavel ou tem meta de reducao de carbono?', options: ['Sim, temos metas', 'Parcialmente', 'Nao, nunca pensei nisso'], scores: [90, 55, 20] },
  { id: 'q3', category: 'S', label: 'Como trata diversidade, inclusao e gap salarial?', options: ['Temos politica formal', 'Fazemos informalmente', 'Nao temos nada'], scores: [85, 50, 20] },
  { id: 'q4', category: 'S', label: 'Investe na comunidade ao redor (educacao, saude, cultura)?', options: ['Sim, com orcamento definido (ISP)', 'Acoes pontuais', 'Nao'], scores: [90, 50, 15] },
  { id: 'q5', category: 'G', label: 'Tem canal de denuncias, compliance ou auditoria independente?', options: ['Sim, estruturado', 'Em implementacao', 'Nao'], scores: [90, 55, 20] },
  { id: 'q6', category: 'G', label: 'Relatorios financeiros e de impacto sao publicos e auditados?', options: ['Sim, publicamos relatorio ESG', 'So financeiro', 'Nada publico'], scores: [90, 50, 15] },
  { id: 'q7', category: 'STR', label: 'Seu produto/servico resolve um problema social ou ambiental?', options: ['Sim, e o core do negocio (CSV nivel 1)', 'Parcialmente', 'Nao, e produto convencional'], scores: [90, 50, 20] },
  { id: 'q8', category: 'STR', label: 'Ja mapeou quais ODS sua empresa impacta?', options: ['Sim, temos 3-5 ODS definidos', 'Conheco mas nao mapeei', 'Nao sei o que e ODS'], scores: [90, 45, 10] },
  { id: 'q9', category: 'MKT', label: 'Seu setor exige certificacoes ou selos de sustentabilidade?', options: ['Sim, e obrigatorio', 'Recomendado pelo mercado', 'Nao'], scores: [80, 55, 25] },
  { id: 'q10', category: 'MKT', label: 'Conhece o ISE B3 ou ja buscou rating ESG?', options: ['Sim, estamos no processo', 'Conheco mas nao busquei', 'Nao sei o que e'], scores: [85, 50, 15] },
]

const FRAMEWORKS = [
  { id: 'tbl', icon: Layers, color: GREEN, title: 'TBL — Triple Bottom Line', subtitle: 'Os 3Ps: People, Planet, Profit', desc: 'Avalia se o lucro e gerado de forma que fortalece ou enfraquece o sistema ao redor.', apply: 'Escolha 3 indicadores por pilar (9 total), estabeleca baseline, defina metas 12 meses.', test: 'Isso viola limite ecologico? Prejudica grupo social? E financeiramente viavel?', alert: 'Se usa TBL pra compensar (poluiu mas gerou empregos), e greenwashing.' },
  { id: 'esg', icon: BarChart3, color: BLUE, title: 'ESG — Rating de Mercado', subtitle: 'Como investidores avaliam sustentabilidade: E + S + G', desc: 'Rating vai de CCC (pior) a AAA (melhor) — tipo MSCI, Sustainalytics.', apply: 'Calcule scores E, S, G separadamente. Investidores olham os 3.', test: 'Rating baixo = custo de capital mais alto. Natura AAA = capital barato.', alert: '' },
  { id: 'gri', icon: BookOpen, color: AMBER, title: 'GRI — Relatorio de Sustentabilidade', subtitle: 'O padrao global para reportar impacto (75% das grandes empresas usam)', desc: 'Logica: como a empresa impacta o mundo (de dentro pra fora).', apply: '1. Materialidade 2. Coleta de dados 3. Relatorio 4. Verificacao.', test: '', alert: 'Reportar tudo. GRI pede profundidade nos temas materiais, nao volume.' },
  { id: 'sasb', icon: Scale, color: RED, title: 'SASB — Por Industria', subtitle: 'Foco financeiro: como o mundo impacta a empresa (de fora pra dentro)', desc: 'Cada industria tem indicadores especificos — nao e one-size-fits-all.', apply: 'Identifique seu setor no SASB e use os indicadores daquela industria.', test: '', alert: '' },
  { id: 'ods', icon: Globe, color: GREEN, title: 'ODS — 17 Objetivos Globais', subtitle: 'A bussola da ONU ate 2030 — nao e checklist, e direcao', desc: 'Priorize 3-5 ODS (maximo). Abracar todos os 17 = greenwashing.', apply: 'ODS = O QUE (meta global) / ESG = COMO (metrica interna).', test: 'Natura: ODS 12, 13, 15 — dados mensuraveis — rating AAA.', alert: '' },
  { id: 'csv', icon: Lightbulb, color: AMBER, title: 'CSV — Valor Compartilhado (Porter)', subtitle: 'Gerar lucro PORQUE resolve problema social — nao e caridade (CSR)', desc: 'Niveis: 1. Reconceber produto 2. Redefinir cadeia 3. Desenvolver cluster local.', apply: 'Unilever Pureit: purificador acessivel = resolve saude + gera receita.', test: '', alert: '' },
  { id: 'ise', icon: Landmark, color: BLUE, title: 'ISE — Indice B3', subtitle: 'Selo do mercado financeiro brasileiro — quem esta, atrai capital', desc: 'Bancos dominam o ISE porque financiam todos os outros setores. Estar no ISE = investimento solido (Peter Drucker: torna a venda superflua).', apply: 'DDDM + AI-DSS + Governance Digital (COBIT, ISO 38500).', test: '', alert: '' },
  { id: 'isp', icon: Heart, color: RED, title: 'ISP — Investimento Social Privado', subtitle: 'Destinacao voluntaria de recursos pra bem-estar social/ambiental/cultural', desc: 'Diferente de filantropia: e estrategico, alinhado a RSC. Desconfianca: o que a empresa ganha? Resposta: confianca + estabilidade longo prazo.', apply: '', test: '', alert: '' },
]

const GREENWASHING_SINS = [
  { id: 'gw1', label: 'Custo Oculto', desc: 'Destaca beneficio verde ignorando impactos negativos.' },
  { id: 'gw2', label: 'Sem Prova', desc: 'Alegacao sem certificacao ou dados verificaveis.' },
  { id: 'gw3', label: 'Vagueza', desc: 'Termos como "eco-friendly", "natural" sem especificar.' },
  { id: 'gw4', label: 'Irrelevancia', desc: 'Destaca algo ja obrigatorio por lei.' },
  { id: 'gw5', label: 'Menor de Dois Males', desc: '"Cigarro organico", "SUV economico".' },
  { id: 'gw6', label: 'Mentira', desc: 'Selo falso ou revogado.' },
  { id: 'gw7', label: 'Falsos Rotulos', desc: 'Selo proprio que parece certificacao independente.' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ESGDiagnostico({ marketData }: { marketData: any }) {
  const [mode, setMode] = useState<'DIAGNOSTICO' | 'FRAMEWORKS'>('DIAGNOSTICO')
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [iaLoading, setIaLoading] = useState(false)
  const [iaResponse, setIaResponse] = useState('')
  const [expandedFw, setExpandedFw] = useState<string | null>(null)
  const [gwChecked, setGwChecked] = useState<Record<string, boolean>>({})

  const answeredCount = Object.keys(answers).length
  const showScores = answeredCount >= 6

  const sector = marketData?.sectors?.[0]?.name?.toLowerCase() ?? 'default'
  const sectorKey = Object.keys(ISE_BENCHMARKS).find(k => sector.includes(k)) ?? 'default'
  const iseBenchmark = ISE_BENCHMARKS[sectorKey]
  const ipcaRate = marketData?.macro?.ipca?.value ?? 4.5
  const pibRate = marketData?.macro?.pib?.value ?? 2.1
  const sectorHeat = marketData?.sectors?.[0]?.heat ?? 50

  /* ---------- SCORE CALCULATION ---------- */
  const scores = useMemo(() => {
    const avg = (ids: string[]) => {
      const vals = ids.map(id => answers[id]).filter(v => v !== undefined)
      return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
    }
    const E = Math.max(0, Math.min(100, avg(['q1', 'q2'])))
    const S = Math.max(0, Math.min(100, avg(['q3', 'q4'])))
    const G = Math.max(0, Math.min(100, avg(['q5', 'q6'])))
    const strategy = avg(['q7', 'q8'])
    const market = avg(['q9', 'q10'])
    const overall = Math.round(E * 0.3 + S * 0.25 + G * 0.25 + strategy * 0.1 + market * 0.1)
    return { E, S, G, overall, strategy, market }
  }, [answers])

  /* ---------- ACTION GENERATION ---------- */
  const actions = useMemo((): ActionItem[] => {
    if (!showScores) return []
    const list: ActionItem[] = []
    if (scores.E < 50) {
      list.push({ priority: 'URGENTE', text: 'Inventariar emissoes de CO2 (Escopo 1 e 2)', impact: 'Reduz risco regulatorio e prepara para mercado de carbono', framework: 'GRI 305 + TBL Planet', effort: 'Investimento medio' })
      list.push({ priority: 'URGENTE', text: 'Implementar gestao de residuos e metas de reducao', impact: 'Reducao de custos operacionais em ate 15%', framework: 'TBL Planet + GRI 300', effort: 'Baixo custo' })
    }
    if (scores.S < 50) {
      list.push({ priority: 'URGENTE', text: 'Criar politica de diversidade e inclusao', impact: 'Equipes diversas geram 19% mais receita (BCG)', framework: 'TBL People + ODS 5/10', effort: 'Baixo custo' })
      list.push({ priority: 'IMPORTANTE', text: 'Definir ISP com orcamento e metricas', impact: 'Confianca comunitaria + estabilidade longo prazo', framework: 'ISP + ODS Pessoas', effort: 'Investimento medio' })
    }
    if (scores.G < 50) {
      list.push({ priority: 'URGENTE', text: 'Implementar canal de denuncias e compliance', impact: 'Investidores exigem transparencia — sem governanca, sem capital', framework: 'GRI Universal + SASB', effort: 'Alto investimento' })
      list.push({ priority: 'IMPORTANTE', text: 'Publicar relatorio ESG auditado', impact: 'Transparencia reduz custo de capital em ate 20%', framework: 'GRI + ISE', effort: 'Alto investimento' })
    }
    if (scores.strategy < 50) {
      list.push({ priority: 'IMPORTANTE', text: 'Reconceber produto com valor compartilhado (CSV nivel 1)', impact: 'Diferenciacao real — nao e marketing, e estrategia', framework: 'CSV Porter', effort: 'Investimento medio' })
      list.push({ priority: 'IMPORTANTE', text: 'Mapear 3-5 ODS prioritarios com dados mensuraveis', impact: 'Clareza estrategica: ODS define destino, ESG define caminho', framework: 'ODS + ESG', effort: 'Baixo custo' })
    }
    if (scores.market < 50) {
      list.push({ priority: 'IMPORTANTE', text: 'Simular rating ESG (MSCI CCC-AAA)', impact: 'Antecipa como investidores vao te avaliar', framework: 'ESG Rating + SASB', effort: 'Investimento medio' })
      list.push({ priority: 'CONSIDERAR', text: 'Buscar elegibilidade ISE B3', impact: 'Prestigio e acesso a investidores institucionais', framework: 'ISE B3', effort: 'Alto investimento' })
    }
    list.push({ priority: 'CONSIDERAR', text: 'Anti-greenwashing audit — verificar os 7 pecados', impact: 'Evita dano reputacional e penalidades do CONAR', framework: 'CONAR', effort: 'Baixo custo' })
    return list
  }, [scores, showScores])

  /* ---------- IA DEEP ANALYSIS ---------- */
  async function generateIAReport() {
    setIaLoading(true)
    setIaResponse('')
    const qLabels = QUESTIONS.map((q, i) => {
      const aIdx = answers[q.id]
      const opt = aIdx !== undefined ? q.options[q.scores.indexOf(aIdx)] ?? 'N/A' : 'Nao respondido'
      return `Q${i + 1}: ${q.label} => ${opt}`
    }).join('\n')
    const prompt = `Gere um relatorio ESG completo para esta empresa:
- Setor: ${sector}
- Respostas:
${qLabels}
- Scores: E=${scores.E}, S=${scores.S}, G=${scores.G}, Overall=${scores.overall}
- Maturidade estrategica: ${levelLabel(scores.strategy)}
- Prontidao de mercado: ${levelLabel(scores.market)}
- Mercado: IPCA ${ipcaRate}%, PIB ${pibRate}%, setor heat ${sectorHeat}

Inclua:
1. Diagnostico geral
2. Frameworks recomendados e por que (TBL, GRI, SASB, ODS, CSV, ISE, ISP, ESG Rating)
3. ODS prioritarios (maximo 5) com justificativa
4. Plano de 12 meses com custos estimados
5. ROI esperado da sustentabilidade
6. Riscos de NAO agir`
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
  const effortBadge: Record<string, string> = { 'Baixo custo': GREEN, 'Investimento medio': AMBER, 'Alto investimento': RED }

  /* ---------- GREENWASHING SCORE ---------- */
  const gwCount = Object.values(gwChecked).filter(Boolean).length
  const gwAnalysis = gwCount === 0 ? 'Parabens — sem sinais de greenwashing.' : gwCount <= 2 ? 'Atencao — revise estas alegacoes antes de publicar.' : 'Alerta — alto risco de greenwashing. Corrija antes que alguem descubra.'
  const gwColor = gwCount === 0 ? GREEN : gwCount <= 2 ? AMBER : RED

  /* ---------- CHIP COMPONENT ---------- */
  function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
    return (
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        style={{
          padding: '5px 12px', borderRadius: 999, fontSize: 11,
          border: selected ? '1.5px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.15)',
          background: selected ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
          color: selected ? '#fff' : 'rgba(255,255,255,0.6)',
          cursor: 'pointer', transition: 'all .2s',
          fontWeight: selected ? 600 : 400, lineHeight: 1.3,
        }}
      >
        {label}
      </motion.button>
    )
  }

  /* ---------- BAR COMPONENT ---------- */
  function ScoreBar({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
    return (
      <div style={{ flex: 1, minWidth: 130 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
          {icon} {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} style={{ height: '100%', background: color, borderRadius: 999 }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 26, textAlign: 'right' }}>{value}</span>
        </div>
      </div>
    )
  }

  /* ---------- BENCHMARK BAR ---------- */
  function BenchmarkBar({ label, user, ise }: { label: string; user: number; ise: number }) {
    return (
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{label}</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden', marginBottom: 3 }}>
              <motion.div animate={{ width: `${user}%` }} initial={{ width: 0 }} transition={{ duration: 0.7 }} style={{ height: '100%', background: scoreColor(user), borderRadius: 999 }} />
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
              <motion.div animate={{ width: `${ise}%` }} initial={{ width: 0 }} transition={{ duration: 0.7, delay: 0.1 }} style={{ height: '100%', background: BLUE, borderRadius: 999 }} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', minWidth: 55, textAlign: 'right' }}>
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
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay }}
        style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 18, marginBottom: 14, border: '1px solid rgba(255,255,255,0.06)' }}
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

      {/* ===== MODE TABS ===== */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        {(['DIAGNOSTICO', 'FRAMEWORKS'] as const).map(tab => (
          <motion.button
            key={tab}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMode(tab)}
            style={{
              flex: 1, padding: '10px 0', fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
              background: mode === tab ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.02)',
              color: mode === tab ? '#fff' : 'rgba(255,255,255,0.4)',
              border: 'none', cursor: 'pointer', transition: 'all .2s',
              borderBottom: mode === tab ? `2px solid ${BLUE}` : '2px solid transparent',
            }}
          >
            {tab === 'DIAGNOSTICO' ? 'DIAGNOSTICO' : 'FRAMEWORKS'}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'DIAGNOSTICO' ? (
          <motion.div key="diag" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>

            {/* ===== SECTION 1: DIAGNOSTICO ===== */}
            <Section>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Target size={16} color={BLUE} />
                <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Diagnostico ESG — 10 Perguntas</h2>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '0 0 14px' }}>
                Cobre os 8 frameworks: TBL, ESG, GRI, SASB, ODS, CSV, ISE, ISP
              </p>

              {QUESTIONS.map((q, qi) => (
                <div key={q.id} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 6, display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 4, background: q.category === 'E' ? `${GREEN}30` : q.category === 'S' ? `${AMBER}30` : q.category === 'G' ? `${BLUE}30` : q.category === 'STR' ? `${AMBER}30` : `${RED}30`, color: q.category === 'E' ? GREEN : q.category === 'S' ? AMBER : q.category === 'G' ? BLUE : q.category === 'STR' ? AMBER : RED }}>
                      {q.category === 'E' ? 'ENV' : q.category === 'S' ? 'SOC' : q.category === 'G' ? 'GOV' : q.category === 'STR' ? 'STRAT' : 'MKT'}
                    </span>
                    {qi + 1}. {q.label}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {q.options.map((opt, oi) => (
                      <Chip key={opt} label={opt} selected={answers[q.id] === q.scores[oi]} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: q.scores[oi] }))} />
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                {answeredCount}/10 respondidas {showScores ? '— scores abaixo' : '— responda pelo menos 6 para ver scores'}
              </div>
            </Section>

            {/* ===== SECTION 2: SCORE ESG ===== */}
            {showScores && (
              <Section delay={0.1}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <BarChart3 size={16} color={scoreColor(scores.overall)} />
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Score ESG</h2>
                  <span style={{ marginLeft: 'auto', fontSize: 20, fontWeight: 800, color: scoreColor(scores.overall) }}>{scores.overall}</span>
                </div>

                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 14 }}>
                  <ScoreBar label="Environmental" value={scores.E} icon={<Leaf size={13} />} color={scoreColor(scores.E)} />
                  <ScoreBar label="Social" value={scores.S} icon={<Users size={13} />} color={scoreColor(scores.S)} />
                  <ScoreBar label="Governance" value={scores.G} icon={<Shield size={13} />} color={scoreColor(scores.G)} />
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                  <div style={{ flex: 1, minWidth: 180, padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Maturidade estrategica</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: scoreColor(scores.strategy) }}>{levelLabel(scores.strategy)}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>CSV + ODS (Q7-Q8)</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 180, padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Prontidao de mercado</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: scoreColor(scores.market) }}>{levelLabel(scores.market)}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>ISE + Rating (Q9-Q10)</div>
                  </div>
                </div>

                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                  Equivalente ISE B3: <strong style={{ color: iseEligible ? GREEN : RED }}>{iseEligible ? 'ELEGIVEL' : 'NAO ELEGIVEL'}</strong> — media do setor <strong>{iseAvg}</strong>/100
                </div>
              </Section>
            )}

            {/* ===== SECTION 3: PLANO DE ACAO ===== */}
            {showScores && actions.length > 0 && (
              <Section delay={0.2}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <CheckCircle2 size={16} color={GREEN} />
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Plano de acao personalizado</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {actions.map((a, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, delay: i * 0.05 }}
                      style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px', borderLeft: `3px solid ${priorityColor[a.priority]}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', padding: '2px 6px', borderRadius: 4, background: priorityColor[a.priority], textTransform: 'uppercase', letterSpacing: 0.5 }}>{a.priority}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', flex: 1 }}>{a.text}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 5 }}>{a.impact}</div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)', padding: '1px 5px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>via {a.framework}</span>
                        <span style={{ fontSize: 10, color: effortBadge[a.effort] ?? AMBER, padding: '1px 5px', border: `1px solid ${(effortBadge[a.effort] ?? AMBER)}33`, borderRadius: 4 }}>{a.effort}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Section>
            )}

            {/* ===== SECTION 4: BENCHMARK ISE B3 ===== */}
            {showScores && (
              <Section delay={0.3}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <TrendingUp size={16} color={BLUE} />
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Benchmark — ISE B3</h2>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>
                  Setor <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{sectorKey}</strong>:
                </div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 2, background: AMBER, display: 'inline-block' }} /> Seu score
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 2, background: BLUE, display: 'inline-block' }} /> ISE B3
                  </span>
                </div>
                <BenchmarkBar label="Environmental" user={scores.E} ise={iseBenchmark.E} />
                <BenchmarkBar label="Social" user={scores.S} ise={iseBenchmark.S} />
                <BenchmarkBar label="Governance" user={scores.G} ise={iseBenchmark.G} />
                {(scores.E < iseBenchmark.E || scores.S < iseBenchmark.S || scores.G < iseBenchmark.G) && (
                  <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(192,57,43,0.08)', borderRadius: 8, border: '1px solid rgba(192,57,43,0.15)', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                    <AlertTriangle size={12} style={{ marginRight: 5, verticalAlign: -2, color: RED }} />
                    <strong>Para ser elegivel:</strong>{' '}
                    {[
                      scores.E < iseBenchmark.E ? `E +${iseBenchmark.E - scores.E}pts` : null,
                      scores.S < iseBenchmark.S ? `S +${iseBenchmark.S - scores.S}pts` : null,
                      scores.G < iseBenchmark.G ? `G +${iseBenchmark.G - scores.G}pts` : null,
                    ].filter(Boolean).join(' · ')}
                  </div>
                )}
              </Section>
            )}

            {/* ===== SECTION 5: IA REPORT ===== */}
            {showScores && (
              <Section delay={0.4}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Brain size={16} color={BLUE} />
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Analise profunda com IA</h2>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={generateIAReport} disabled={iaLoading}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8,
                    background: iaLoading ? 'rgba(26,82,118,0.2)' : `linear-gradient(135deg, ${BLUE}, ${GREEN})`,
                    border: 'none', color: '#fff', fontSize: 13, fontWeight: 600,
                    cursor: iaLoading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 8, opacity: iaLoading ? 0.6 : 1,
                  }}>
                  {iaLoading ? <><Loader2 size={14} className="animate-spin" /> Gerando relatorio...</> : 'Gerar relatorio ESG com IA'}
                </motion.button>
                {iaResponse && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: 12, padding: 14, background: 'rgba(255,255,255,0.03)',
                      borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)',
                      fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.75)',
                      whiteSpace: 'pre-wrap', maxHeight: 450, overflowY: 'auto',
                    }}>
                    {iaResponse}
                  </motion.div>
                )}
              </Section>
            )}

          </motion.div>
        ) : (
          <motion.div key="fw" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>

            {/* ===== FRAMEWORKS TAB ===== */}
            <Section>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Eye size={16} color={BLUE} />
                <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Frameworks ESG — Entenda e Aplique</h2>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>8 frameworks que avaliam sustentabilidade real</p>
            </Section>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320, 1fr))', gap: 10 }}>
              {FRAMEWORKS.map((fw, fi) => {
                const Icon = fw.icon
                const expanded = expandedFw === fw.id
                return (
                  <motion.div key={fw.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: fi * 0.04 }}
                    style={{
                      background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)',
                      borderLeft: `3px solid ${fw.color}`, overflow: 'hidden', marginBottom: 2,
                    }}>
                    <motion.button whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                      onClick={() => setExpandedFw(expanded ? null : fw.id)}
                      style={{
                        width: '100%', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
                        background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                      }}>
                      <Icon size={16} color={fw.color} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{fw.title}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{fw.subtitle}</div>
                      </div>
                      {expanded ? <ChevronUp size={14} color="rgba(255,255,255,0.3)" /> : <ChevronDown size={14} color="rgba(255,255,255,0.3)" />}
                    </motion.button>

                    <AnimatePresence>
                      {expanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                          style={{ overflow: 'hidden' }}>
                          <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{fw.desc}</div>
                            {fw.apply && (
                              <div style={{ fontSize: 12, padding: '8px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: fw.color }}>Como aplicar:</span>
                                <div style={{ color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>{fw.apply}</div>
                              </div>
                            )}
                            {fw.test && (
                              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>{fw.test}</div>
                            )}
                            {fw.alert && (
                              <div style={{ fontSize: 11, color: RED, display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                                <AlertTriangle size={12} style={{ marginTop: 1, flexShrink: 0 }} />
                                <span>{fw.alert}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>

            {/* ===== GREENWASHING DETECTOR ===== */}
            <Section delay={0.3}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <AlertTriangle size={16} color={RED} />
                <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Detector de Greenwashing — Os 7 Pecados</h2>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '0 0 14px' }}>
                Verifique se uma empresa (ou a sua) esta fazendo greenwashing
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {GREENWASHING_SINS.map(sin => {
                  const checked = gwChecked[sin.id] ?? false
                  return (
                    <motion.button key={sin.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={() => setGwChecked(prev => ({ ...prev, [sin.id]: !checked }))}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px',
                        borderRadius: 8, border: `1px solid ${checked ? `${RED}44` : 'rgba(255,255,255,0.06)'}`,
                        background: checked ? 'rgba(192,57,43,0.08)' : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all .2s',
                      }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                        border: `2px solid ${checked ? RED : 'rgba(255,255,255,0.2)'}`,
                        background: checked ? RED : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all .2s',
                      }}>
                        {checked && <CheckCircle2 size={12} color="#fff" />}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: checked ? '#fff' : 'rgba(255,255,255,0.7)' }}>{sin.label}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{sin.desc}</div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              <motion.div animate={{ opacity: 1 }} style={{
                marginTop: 14, padding: '10px 14px', borderRadius: 8,
                background: `${gwColor}15`, border: `1px solid ${gwColor}30`,
                fontSize: 13, fontWeight: 600, color: gwColor,
              }}>
                {gwCount} de 7 pecados detectados — {gwAnalysis}
              </motion.div>

              <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                CONAR (Brasil): alegacoes devem ser precisas, comprovaveis, nao enganosas.
              </div>
            </Section>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
