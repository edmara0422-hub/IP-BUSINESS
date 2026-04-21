'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Leaf, Users, DollarSign, BarChart3, Globe2, ShieldAlert,
  FileText, Loader2, Brain, AlertTriangle, CheckCircle2, XCircle,
  Target, Scale, Eye,
} from 'lucide-react'

/* ── Colors ── */
const RED = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE = '#1a5276'

/* ── Tabs ── */
const TABS = [
  { key: 'tbl', label: 'TBL', icon: BarChart3 },
  { key: 'esg', label: 'ESG Rating', icon: Leaf },
  { key: 'ods', label: 'ODS', icon: Globe2 },
  { key: 'greenwash', label: 'Anti-Greenwashing', icon: ShieldAlert },
  { key: 'relatorio', label: 'Relatorio IA', icon: FileText },
] as const
type TabKey = (typeof TABS)[number]['key']

/* ── ODS Data ── */
const ODS_NAMES: Record<number, string> = {
  1: 'Erradicacao da Pobreza', 2: 'Fome Zero', 3: 'Saude e Bem-Estar',
  4: 'Educacao de Qualidade', 5: 'Igualdade de Genero', 6: 'Agua Potavel e Saneamento',
  7: 'Energia Acessivel e Limpa', 8: 'Trabalho Decente e Crescimento Economico',
  9: 'Industria, Inovacao e Infraestrutura', 10: 'Reducao das Desigualdades',
  11: 'Cidades e Comunidades Sustentaveis', 12: 'Consumo e Producao Responsaveis',
  13: 'Acao Contra Mudanca Global do Clima', 14: 'Vida na Agua',
  15: 'Vida Terrestre', 16: 'Paz, Justica e Instituicoes Eficazes',
  17: 'Parcerias e Meios de Implementacao',
}
const ODS_MEASURE: Record<number, string> = {
  1: 'Funcionarios acima do salario minimo (%)', 2: 'Doacoes para bancos de alimentos (R$/ano)',
  3: 'Cobertura de plano de saude (%)', 4: 'Horas de treinamento por colaborador',
  5: 'Mulheres em cargos de lideranca (%)', 6: 'Reuso de agua (%)',
  7: 'Energia renovavel na matriz (%)', 8: 'Turnover voluntario (%)',
  9: '% receita em P&D', 10: 'Gap salarial entre grupos (%)',
  11: 'Investimento em mobilidade urbana (R$)', 12: 'Residuos reciclados (%)',
  13: 'Emissoes CO2 (tCO2e reduzidas)', 14: 'Efluentes tratados antes de descarte (%)',
  15: 'Area reflorestada (hectares)', 16: 'Denuncias tratadas em 30 dias (%)',
  17: 'Parcerias com ONGs e governo ativas',
}
const ODS_META: Record<number, string> = {
  1: '100% dos funcionarios acima de 1.5x salario minimo em 2 anos',
  2: 'R$ 50.000/ano em doacoes alimentares ou parcerias com bancos de alimentos',
  3: '95% cobertura de plano de saude + programa de saude mental',
  4: 'Minimo 40h/ano treinamento por colaborador, com trilha de carreira',
  5: '40% mulheres em cargos de lideranca ate 2028',
  6: '30% de reuso de agua nos processos produtivos',
  7: '50% da matriz energetica de fontes renovaveis',
  8: 'Turnover voluntario < 10% e zero trabalho precario na cadeia',
  9: 'Investir 3% da receita em P&D de solucoes sustentaveis',
  10: 'Gap salarial < 5% entre grupos demograficos equivalentes',
  11: 'Programa de mobilidade sustentavel para 100% dos colaboradores',
  12: '80% dos residuos reciclados ou reaproveitados',
  13: 'Reducao de 30% nas emissoes (Escopo 1+2) ate 2027',
  14: '100% dos efluentes tratados antes de descarte',
  15: 'Compensar 100% da area impactada + 20% extra reflorestamento',
  16: '100% das denuncias investigadas em 30 dias com feedback ao denunciante',
  17: 'Minimo 3 parcerias ativas com ONGs/governo alinhadas aos ODS',
}
const ODS_GROUPS: { label: string; color: string; ids: number[] }[] = [
  { label: 'Pessoas', color: RED, ids: [1, 2, 3, 4, 5] },
  { label: 'Prosperidade', color: AMBER, ids: [7, 8, 9, 10, 11] },
  { label: 'Planeta', color: GREEN, ids: [6, 12, 13, 14, 15] },
  { label: 'Paz & Parceria', color: BLUE, ids: [16, 17] },
]

/* ── Greenwashing 7 Sins + remedies ── */
const SINS = [
  { sin: 'Custo oculto — destaca um atributo "verde" mas esconde impacto maior', fix: 'Divulgue o ciclo de vida completo do produto (LCA). Mostre todos os impactos, nao so o positivo.' },
  { sin: 'Sem prova — alega sustentabilidade sem certificacao ou dado verificavel', fix: 'Obtenha certificacao de terceiro independente (ISO 14001, B Corp, FSC). Publique os dados brutos.' },
  { sin: 'Vagueza — termos genericos como "eco-friendly" sem definicao', fix: 'Substitua por metricas concretas: "Reducao de 23% em emissoes CO2 vs 2023" ao inves de "eco-friendly".' },
  { sin: 'Irrelevancia — alega algo verdadeiro mas insignificante', fix: 'Comunique apenas diferenciais reais. Ex: nao destaque "sem CFC" — ja e obrigatorio por lei.' },
  { sin: 'Menor de dois males — produto "verde" numa categoria prejudicial', fix: 'Reavalie se o produto/servico em si deve existir. Considere pivotar para alternativa genuina.' },
  { sin: 'Mentira — alegacao ambiental falsa ou inventada', fix: 'Implemente auditoria interna trimestral de claims. Penalidade interna para areas que falsificarem dados.' },
  { sin: 'Falso selo — imagem que parece certificacao mas nao e', fix: 'Use apenas selos oficiais reconhecidos (Inmetro, FSC, Rainforest Alliance). Remova qualquer selo auto-criado.' },
]

/* ── MSCI Rating helper ── */
function msciRating(score: number): { label: string; color: string } {
  if (score >= 91) return { label: 'AAA', color: BLUE }
  if (score >= 76) return { label: 'AA', color: GREEN }
  if (score >= 61) return { label: 'A', color: GREEN }
  if (score >= 46) return { label: 'BBB', color: AMBER }
  if (score >= 31) return { label: 'BB', color: AMBER }
  if (score >= 16) return { label: 'B', color: RED }
  return { label: 'CCC', color: RED }
}

/* ── Slider component ── */
function Slider({ label, value, onChange, color }: {
  label: string; value: number; onChange: (v: number) => void; color: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: 'monospace' }}>{value}</span>
      </div>
      <input type="range" min={0} max={100} value={value} onChange={e => onChange(+e.target.value)}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} ${value}%, rgba(255,255,255,0.1) ${value}%)`,
          accentColor: color,
        }} />
    </div>
  )
}

/* ── Tool Header ── */
function ToolHeader({ title, what, why, icon: Icon, color }: {
  title: string; what: string; why: string; icon: typeof Leaf; color: string
}) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-1" style={{ background: `${color}12`, border: `1px solid ${color}33` }}>
      <div className="flex items-center gap-2">
        <Icon size={18} style={{ color }} />
        <span style={{ fontSize: 15, fontWeight: 800, color }}>{title}</span>
      </div>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}><strong>O que e:</strong> {what}</span>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}><strong>Por que importa:</strong> {why}</span>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ESGExecutar({ marketData }: { marketData: any }) {
  const [tab, setTab] = useState<TabKey>('tbl')
  const [iaLoading, setIaLoading] = useState(false)
  const [iaResponse, setIaResponse] = useState('')
  const [iaLoadingPillar, setIaLoadingPillar] = useState<string | null>(null)
  const [pillarInsights, setPillarInsights] = useState<Record<string, string>>({})

  /* ── TBL State ── */
  const [tblPeople, setTblPeople] = useState([50, 50, 50])
  const [tblPlanet, setTblPlanet] = useState([50, 50, 50])
  const [tblProfit, setTblProfit] = useState([50, 50, 50])
  const [circles, setCircles] = useState([false, false, false])

  /* ── ESG State ── */
  const [esgE, setEsgE] = useState([50, 50, 50])
  const [esgS, setEsgS] = useState([50, 50, 50])
  const [esgG, setEsgG] = useState([50, 50, 50])

  /* ── ODS State ── */
  const [selectedODS, setSelectedODS] = useState<number[]>([])

  /* ── Greenwashing State ── */
  const [sins, setSins] = useState<boolean[]>(new Array(7).fill(false))

  /* ── Computed ── */
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length
  const peopleScore = avg(tblPeople)
  const planetScore = avg(tblPlanet)
  const profitScore = avg(tblProfit)
  const tblScore = avg([peopleScore, planetScore, profitScore])

  const eScore = avg(esgE)
  const sScore = avg(esgS)
  const gScore = avg(esgG)
  const esgScore = eScore * 0.4 + sScore * 0.3 + gScore * 0.3
  const rating = msciRating(esgScore)
  const sinCount = sins.filter(Boolean).length

  const selic = marketData?.macro?.selic?.value ?? 14.75
  const ipca = marketData?.macro?.ipca?.value ?? 4.14
  const pib = marketData?.macro?.pib?.value ?? 1.86

  /* ── IA helpers ── */
  const callIA = async (question: string) => {
    setIaLoading(true); setIaResponse('')
    try {
      const res = await fetch('/api/advisor-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: question }] }),
      })
      const data = await res.json()
      setIaResponse(data.response ?? data.content ?? 'Sem resposta da IA.')
    } catch { setIaResponse('Erro ao conectar com a IA. Tente novamente.') }
    finally { setIaLoading(false) }
  }

  const callPillarIA = async (pillar: string, prompt: string) => {
    setIaLoadingPillar(pillar)
    try {
      const res = await fetch('/api/advisor-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
      })
      const data = await res.json()
      setPillarInsights(prev => ({ ...prev, [pillar]: data.response ?? data.content ?? 'Sem resposta.' }))
    } catch { setPillarInsights(prev => ({ ...prev, [pillar]: 'Erro ao conectar com a IA.' })) }
    finally { setIaLoadingPillar(null) }
  }

  const toggleODS = (id: number) => {
    if (selectedODS.includes(id)) setSelectedODS(selectedODS.filter(o => o !== id))
    else if (selectedODS.length < 5) setSelectedODS([...selectedODS, id])
  }
  const toggleSin = (i: number) => { const n = [...sins]; n[i] = !n[i]; setSins(n) }
  const setSlider = (setter: React.Dispatch<React.SetStateAction<number[]>>, idx: number, val: number) => {
    setter(prev => { const n = [...prev]; n[idx] = val; return n })
  }
  const toggleCircle = (i: number) => { const n = [...circles]; n[i] = !n[i]; setCircles(n) }

  const trafficColor = (v: number) => v >= 70 ? GREEN : v >= 40 ? AMBER : RED
  const weakest = (e: number, s: number, g: number) => e <= s && e <= g ? 'Environmental' : s <= g ? 'Social' : 'Governance'

  /* ── Bar helper ── */
  const HBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="flex items-center gap-3">
      <span style={{ width: 60, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{label}</span>
      <div className="flex-1 h-5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div className="h-5 rounded-full" style={{ background: color }}
          initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.6 }} />
      </div>
      <span style={{ width: 40, textAlign: 'right', fontSize: 13, fontWeight: 700, color, fontFamily: 'monospace' }}>
        {value.toFixed(0)}
      </span>
    </div>
  )

  /* ── Section card ── */
  const Card = ({ children, title, icon: Icon, color }: {
    children: React.ReactNode; title: string; icon: typeof Leaf; color: string
  }) => (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${color}33` }}>
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} style={{ color }} />
        <span style={{ fontSize: 14, fontWeight: 700, color }}>{title}</span>
      </div>
      {children}
    </div>
  )

  /* ── Pillar IA Button ── */
  const PillarIAButton = ({ pillar, prompt, color }: { pillar: string; prompt: string; color: string }) => (
    <div className="mt-3 flex flex-col gap-2">
      <button onClick={() => callPillarIA(pillar, prompt)} disabled={iaLoadingPillar === pillar}
        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
        style={{ background: `${color}22`, border: `1px solid ${color}55`, color, cursor: iaLoadingPillar === pillar ? 'wait' : 'pointer' }}>
        {iaLoadingPillar === pillar ? <Loader2 size={12} className="animate-spin" /> : <Brain size={12} />}
        IA analisa este pilar
      </button>
      {pillarInsights[pillar] && (
        <div className="p-3 rounded-lg text-xs" style={{ background: `${color}10`, border: `1px solid ${color}22`, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {pillarInsights[pillar]}
        </div>
      )}
    </div>
  )

  /* ══════════════ RENDER ══════════════ */
  return (
    <div className="flex flex-col gap-5 p-6 text-white min-h-screen" style={{ background: '#0b0f1a' }}>
      <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold" style={{ color: GREEN }}>
        ESG Executar — Ferramentas Interativas
      </motion.h2>

      {/* ── Tab Bar ── */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => {
          const active = tab === t.key; const Icon = t.icon
          return (
            <button key={t.key} onClick={() => { setTab(t.key); setIaResponse('') }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                background: active ? GREEN : 'rgba(255,255,255,0.06)',
                color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                border: active ? `1px solid ${GREEN}` : '1px solid rgba(255,255,255,0.08)',
              }}>
              <Icon size={14} /> {t.label}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="flex flex-col gap-5">

          {/* ══════════ TOOL 1: TBL ══════════ */}
          {tab === 'tbl' && <>
            <ToolHeader title="Triple Bottom Line (TBL)" icon={BarChart3} color={GREEN}
              what="Avalia sua empresa em 3 dimensoes — People, Planet, Profit — ao inves de so lucro."
              why="Empresas que so medem lucro ignoram riscos sociais e ambientais que destroem valor no longo prazo." />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card title="People" icon={Users} color={GREEN}>
                <div className="flex flex-col gap-3">
                  <Slider label="Treinamento (h/ano)" value={tblPeople[0]} onChange={v => setSlider(setTblPeople, 0, v)} color={GREEN} />
                  <Slider label="Gap Salarial (% igualdade)" value={tblPeople[1]} onChange={v => setSlider(setTblPeople, 1, v)} color={GREEN} />
                  <Slider label="Diversidade (%)" value={tblPeople[2]} onChange={v => setSlider(setTblPeople, 2, v)} color={GREEN} />
                </div>
                <PillarIAButton pillar="people" color={GREEN}
                  prompt={`Analise o pilar PEOPLE (TBL) da minha empresa. Scores: Treinamento=${tblPeople[0]}/100, Gap Salarial=${tblPeople[1]}/100, Diversidade=${tblPeople[2]}/100. Media=${peopleScore.toFixed(0)}. De 3 recomendacoes praticas e especificas para melhorar cada indicador fraco (<60). Seja direto e acionavel.`} />
              </Card>
              <Card title="Planet" icon={Leaf} color={BLUE}>
                <div className="flex flex-col gap-3">
                  <Slider label="Emissoes (% reducao)" value={tblPlanet[0]} onChange={v => setSlider(setTblPlanet, 0, v)} color={BLUE} />
                  <Slider label="Reciclagem (%)" value={tblPlanet[1]} onChange={v => setSlider(setTblPlanet, 1, v)} color={BLUE} />
                  <Slider label="Energia Renovavel (%)" value={tblPlanet[2]} onChange={v => setSlider(setTblPlanet, 2, v)} color={BLUE} />
                </div>
                <PillarIAButton pillar="planet" color={BLUE}
                  prompt={`Analise o pilar PLANET (TBL) da minha empresa. Scores: Emissoes=${tblPlanet[0]}/100, Reciclagem=${tblPlanet[1]}/100, Energia Renovavel=${tblPlanet[2]}/100. Media=${planetScore.toFixed(0)}. De 3 recomendacoes praticas e especificas para melhorar cada indicador fraco (<60). Considere o mercado de carbono brasileiro e regulamentacoes atuais.`} />
              </Card>
              <Card title="Profit" icon={DollarSign} color={AMBER}>
                <div className="flex flex-col gap-3">
                  <Slider label="Margem (%)" value={tblProfit[0]} onChange={v => setSlider(setTblProfit, 0, v)} color={AMBER} />
                  <Slider label="Investimento P&D (%)" value={tblProfit[1]} onChange={v => setSlider(setTblProfit, 1, v)} color={AMBER} />
                  <Slider label="Impostos / Compliance (%)" value={tblProfit[2]} onChange={v => setSlider(setTblProfit, 2, v)} color={AMBER} />
                </div>
                <PillarIAButton pillar="profit" color={AMBER}
                  prompt={`Analise o pilar PROFIT (TBL) da minha empresa. Scores: Margem=${tblProfit[0]}/100, P&D=${tblProfit[1]}/100, Compliance=${tblProfit[2]}/100. Media=${profitScore.toFixed(0)}. SELIC atual: ${selic}%, IPCA: ${ipca}%. Como esses indicadores macro afetam o custo de compliance ESG? De 3 recomendacoes praticas.`} />
              </Card>
            </div>

            {/* TBL Score Bars */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>TBL Score</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: trafficColor(tblScore), fontFamily: 'monospace' }}>
                  {tblScore.toFixed(0)}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <HBar label="People" value={peopleScore} color={GREEN} />
                <HBar label="Planet" value={planetScore} color={BLUE} />
                <HBar label="Profit" value={profitScore} color={AMBER} />
              </div>
            </div>

            {/* Circulos Aninhados Visual */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Circulos Aninhados — Visao Integrada</span>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4, marginBottom: 12 }}>
                No modelo TBL, Profit esta dentro de Society que esta dentro de Planet. Nao sao independentes.
              </p>
              <div className="flex justify-center items-center" style={{ height: 200 }}>
                <motion.div className="relative flex items-center justify-center rounded-full"
                  style={{ width: 190, height: 190, border: `3px solid ${BLUE}`, background: `${BLUE}15` }}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}>
                  <span style={{ position: 'absolute', top: 8, fontSize: 10, fontWeight: 700, color: BLUE }}>
                    PLANET {planetScore.toFixed(0)}
                  </span>
                  <motion.div className="flex items-center justify-center rounded-full"
                    style={{ width: 130, height: 130, border: `3px solid ${GREEN}`, background: `${GREEN}15` }}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.25 }}>
                    <span style={{ position: 'absolute', top: 8, fontSize: 10, fontWeight: 700, color: GREEN }}>
                      PEOPLE {peopleScore.toFixed(0)}
                    </span>
                    <motion.div className="flex items-center justify-center rounded-full"
                      style={{ width: 70, height: 70, border: `3px solid ${AMBER}`, background: `${AMBER}22` }}
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: AMBER, textAlign: 'center', lineHeight: 1.2 }}>
                        PROFIT<br />{profitScore.toFixed(0)}
                      </span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Teste dos Circulos */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Target size={16} style={{ color: 'rgba(255,255,255,0.7)' }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Teste dos Circulos — Semaforo de Viabilidade</span>
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
                Responda com honestidade. Se qualquer limite ecologico for violado, o projeto PARA.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { q: 'Viola limite ecologico? (emissoes, desmatamento, poluicao)', warn: true },
                  { q: 'Prejudica algum grupo social? (comunidade, trabalhadores, minorias)', warn: true },
                  { q: 'E financeiramente viavel sem externalizar custos?', warn: false },
                ].map((item, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <input type="checkbox" checked={circles[i]} onChange={() => toggleCircle(i)}
                      className="w-5 h-5 rounded" style={{ accentColor: item.warn ? RED : GREEN }} />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{item.q}</span>
                    <div className="ml-auto w-4 h-4 rounded-full" style={{
                      background: i < 2 ? (circles[i] ? RED : GREEN) : (circles[i] ? GREEN : RED),
                    }} />
                  </label>
                ))}
              </div>
              {circles[0] && (
                <div className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: `${RED}22`, border: `1px solid ${RED}` }}>
                  <XCircle size={16} style={{ color: RED }} />
                  <span style={{ color: RED, fontWeight: 700, fontSize: 14 }}>PARE — Limite ecologico violado. Redesenhe o projeto.</span>
                </div>
              )}
              {!circles[0] && circles[1] && (
                <div className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: `${AMBER}22`, border: `1px solid ${AMBER}` }}>
                  <AlertTriangle size={16} style={{ color: AMBER }} />
                  <span style={{ color: AMBER, fontWeight: 700, fontSize: 14 }}>REDESENHE — Impacto social negativo detectado</span>
                </div>
              )}
              {!circles[0] && !circles[1] && circles[2] && (
                <div className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: `${GREEN}22`, border: `1px solid ${GREEN}` }}>
                  <CheckCircle2 size={16} style={{ color: GREEN }} />
                  <span style={{ color: GREEN, fontWeight: 700, fontSize: 14 }}>EXECUTE — Projeto viavel e responsavel</span>
                </div>
              )}
            </div>
          </>}

          {/* ══════════ TOOL 2: ESG Rating ══════════ */}
          {tab === 'esg' && <>
            <ToolHeader title="ESG Rating (MSCI-style)" icon={Leaf} color={GREEN}
              what="Simula um rating ESG baseado na metodologia MSCI — de CCC (pior) a AAA (melhor)."
              why="Investidores institucionais usam ratings ESG para decidir onde alocar capital. Sem rating, sem acesso a capital sustentavel." />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card title="Environmental (40%)" icon={Leaf} color={GREEN}>
                <div className="flex flex-col gap-3">
                  <Slider label="Emissoes CO2" value={esgE[0]} onChange={v => setSlider(setEsgE, 0, v)} color={GREEN} />
                  <Slider label="Gestao Hidrica" value={esgE[1]} onChange={v => setSlider(setEsgE, 1, v)} color={GREEN} />
                  <Slider label="Energia Renovavel" value={esgE[2]} onChange={v => setSlider(setEsgE, 2, v)} color={GREEN} />
                </div>
                <PillarIAButton pillar="esg_e" color={GREEN}
                  prompt={`Analise o pilar ENVIRONMENTAL do meu rating ESG. Scores: CO2=${esgE[0]}/100, Agua=${esgE[1]}/100, Energia=${esgE[2]}/100. Media=${eScore.toFixed(0)}. O que preciso fazer para subir pelo menos 1 nivel no rating MSCI neste pilar? Seja pratico.`} />
              </Card>
              <Card title="Social (30%)" icon={Users} color={BLUE}>
                <div className="flex flex-col gap-3">
                  <Slider label="Diversidade Lideranca" value={esgS[0]} onChange={v => setSlider(setEsgS, 0, v)} color={BLUE} />
                  <Slider label="Saude / Seguranca" value={esgS[1]} onChange={v => setSlider(setEsgS, 1, v)} color={BLUE} />
                  <Slider label="Investimento Comunidade" value={esgS[2]} onChange={v => setSlider(setEsgS, 2, v)} color={BLUE} />
                </div>
                <PillarIAButton pillar="esg_s" color={BLUE}
                  prompt={`Analise o pilar SOCIAL do meu rating ESG. Scores: Diversidade=${esgS[0]}/100, Saude=${esgS[1]}/100, Comunidade=${esgS[2]}/100. Media=${sScore.toFixed(0)}. O que preciso fazer para subir pelo menos 1 nivel no rating MSCI neste pilar? Seja pratico.`} />
              </Card>
              <Card title="Governance (30%)" icon={ShieldAlert} color={AMBER}>
                <div className="flex flex-col gap-3">
                  <Slider label="Independencia Conselho" value={esgG[0]} onChange={v => setSlider(setEsgG, 0, v)} color={AMBER} />
                  <Slider label="Canal Denuncias" value={esgG[1]} onChange={v => setSlider(setEsgG, 1, v)} color={AMBER} />
                  <Slider label="Transparencia Relatorios" value={esgG[2]} onChange={v => setSlider(setEsgG, 2, v)} color={AMBER} />
                </div>
                <PillarIAButton pillar="esg_g" color={AMBER}
                  prompt={`Analise o pilar GOVERNANCE do meu rating ESG. Scores: Conselho=${esgG[0]}/100, Denuncias=${esgG[1]}/100, Transparencia=${esgG[2]}/100. Media=${gScore.toFixed(0)}. O que preciso fazer para subir pelo menos 1 nivel no rating MSCI neste pilar? Considere LGPD e regulamentacoes brasileiras.`} />
              </Card>
            </div>

            {/* Rating display */}
            <div className="rounded-2xl p-6 flex flex-col items-center gap-3" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>ESG Score (MSCI-style)</span>
              <div className="px-8 py-3 rounded-2xl" style={{ background: `${rating.color}22`, border: `2px solid ${rating.color}` }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: rating.color, fontFamily: 'monospace' }}>{rating.label}</span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: rating.color, fontFamily: 'monospace' }}>{esgScore.toFixed(1)} / 100</span>
              <div className="flex gap-6 mt-2">
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>E: {eScore.toFixed(0)}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>S: {sScore.toFixed(0)}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>G: {gScore.toFixed(0)}</span>
              </div>

              {/* Weakest pillar highlight */}
              <div className="mt-3 px-4 py-2 rounded-lg" style={{ background: `${RED}15`, border: `1px solid ${RED}33` }}>
                <span style={{ fontSize: 12, color: RED }}>
                  Pilar mais fraco: <strong>{weakest(eScore, sScore, gScore)}</strong> — priorize melhorias aqui primeiro.
                </span>
              </div>
            </div>

            {/* Benchmark comparison */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Scale size={16} style={{ color: BLUE }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: BLUE }}>Benchmark — Compare com Lideres</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { name: 'Natura', rating: 'AAA', e: 92, s: 88, g: 95 },
                  { name: 'Itau Unibanco', rating: 'AA', e: 78, s: 82, g: 90 },
                  { name: 'WEG', rating: 'AA', e: 80, s: 75, g: 88 },
                  { name: 'Seu Score', rating: rating.label, e: Math.round(eScore), s: Math.round(sScore), g: Math.round(gScore), highlight: true },
                ].map((b, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{
                    background: b.highlight ? `${rating.color}15` : 'rgba(255,255,255,0.03)',
                    border: b.highlight ? `1px solid ${rating.color}44` : '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div className="flex flex-col">
                      <span style={{ fontSize: 13, fontWeight: 700, color: b.highlight ? rating.color : 'rgba(255,255,255,0.7)' }}>{b.name}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>E:{b.e} S:{b.s} G:{b.g}</span>
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 800, fontFamily: 'monospace', color: b.highlight ? rating.color : 'rgba(255,255,255,0.5)' }}>{b.rating}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => callIA(
                `Meu ESG Rating simulado e ${rating.label} (score ${esgScore.toFixed(1)}/100). E=${eScore.toFixed(0)}, S=${sScore.toFixed(0)}, G=${gScore.toFixed(0)}. Compare com os criterios do ISE B3 (Indice de Sustentabilidade Empresarial da B3). Minha empresa se qualificaria? Quais gaps preciso fechar? Quais dimensoes do ISE B3 estou mais distante? Seja especifico sobre os criterios do ISE B3.`
              )} disabled={iaLoading}
                className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold"
                style={{ background: `${BLUE}22`, border: `1px solid ${BLUE}`, color: BLUE, cursor: iaLoading ? 'wait' : 'pointer' }}>
                {iaLoading ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
                {iaLoading ? 'Analisando...' : 'IA compara com ISE B3'}
              </button>
            </div>
          </>}

          {/* ══════════ TOOL 3: ODS Mapper ══════════ */}
          {tab === 'ods' && <>
            <ToolHeader title="ODS Mapper — Objetivos de Desenvolvimento Sustentavel" icon={Globe2} color={GREEN}
              what="Mapeia quais dos 17 ODS da ONU sua empresa impacta e cria um plano de acao para cada um."
              why="Investidores e consumidores exigem alinhamento com ODS. Mas abracar todos = greenwashing. Foco em 3-5 e o caminho." />

            <div className="rounded-2xl p-5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
                Selecione ate 5 ODS prioritarios para sua empresa.
              </p>
              {ODS_GROUPS.map(g => (
                <div key={g.label} className="mb-4">
                  <span style={{ fontSize: 11, fontWeight: 700, color: g.color, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {g.label}
                  </span>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {g.ids.map(id => {
                      const selected = selectedODS.includes(id)
                      return (
                        <button key={id} onClick={() => toggleODS(id)} title={ODS_NAMES[id]}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                          style={{
                            background: selected ? g.color : 'rgba(255,255,255,0.06)',
                            color: selected ? '#fff' : 'rgba(255,255,255,0.4)',
                            border: selected ? `2px solid ${g.color}` : '2px solid rgba(255,255,255,0.08)',
                            opacity: !selected && selectedODS.length >= 5 ? 0.3 : 1,
                            cursor: !selected && selectedODS.length >= 5 ? 'not-allowed' : 'pointer',
                          }}>
                          {id}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
              {selectedODS.length >= 5 && (
                <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg" style={{ background: `${AMBER}22` }}>
                  <AlertTriangle size={14} style={{ color: AMBER }} />
                  <span style={{ fontSize: 12, color: AMBER }}>Maximo de 5 ODS atingido — foco e essencial</span>
                </div>
              )}
            </div>

            {/* Greenwashing warning for too many */}
            {selectedODS.length > 5 && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg" style={{ background: `${RED}22`, border: `2px solid ${RED}` }}>
                <XCircle size={18} style={{ color: RED }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: RED }}>Abracar todos os ODS = greenwashing. Investidores veem isso como falta de estrategia.</span>
              </div>
            )}

            {/* Selected ODS Details with measure + meta */}
            {selectedODS.length > 0 && (
              <div className="rounded-2xl p-5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>ODS Priorizados — O que Medir e Metas</span>
                <div className="flex flex-col gap-3 mt-3">
                  {selectedODS.map(id => (
                    <div key={id} className="flex flex-col gap-2 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: GREEN }}>ODS {id} — {ODS_NAMES[id]}</span>
                      <div className="flex items-start gap-2">
                        <Eye size={13} style={{ color: BLUE, marginTop: 2, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}><strong style={{ color: BLUE }}>O que medir:</strong> {ODS_MEASURE[id]}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Target size={13} style={{ color: AMBER, marginTop: 2, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}><strong style={{ color: AMBER }}>Meta sugerida:</strong> {ODS_META[id]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: `${RED}15`, border: `1px solid ${RED}44` }}>
              <AlertTriangle size={14} style={{ color: RED }} />
              <span style={{ fontSize: 12, color: RED }}>NAO abracar todos os 17 — foco em 3-5 ODS relevantes. Tentar todos = greenwashing.</span>
            </div>

            <button onClick={() => callIA(
              `Gere um plano de implementacao para os seguintes ODS priorizados: ${selectedODS.map(id => `ODS ${id} (${ODS_NAMES[id]}) — indicador: ${ODS_MEASURE[id]} — meta sugerida: ${ODS_META[id]}`).join('; ')}. Para CADA ODS gere: 1) 3 Acoes praticas imediatas 2) Indicadores KPI com periodicidade 3) Investimento estimado (R$) 4) Prazo de implementacao 5) Quick wins para os primeiros 30 dias. Considere o contexto brasileiro e SELIC a ${selic}%.`
            )} disabled={iaLoading || selectedODS.length === 0}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all"
              style={{ background: selectedODS.length === 0 ? 'rgba(255,255,255,0.06)' : BLUE, color: '#fff', cursor: iaLoading ? 'wait' : 'pointer', opacity: selectedODS.length === 0 ? 0.4 : 1 }}>
              {iaLoading ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
              {iaLoading ? 'Gerando plano...' : 'IA gera plano ODS completo'}
            </button>
          </>}

          {/* ══════════ TOOL 4: Anti-Greenwashing ══════════ */}
          {tab === 'greenwash' && <>
            <ToolHeader title="Anti-Greenwashing — Os 7 Pecados" icon={ShieldAlert} color={RED}
              what="Checklist baseada nos 7 Pecados do Greenwashing (TerraChoice) para auditar suas praticas de comunicacao ambiental."
              why="Greenwashing gera multas do CONAR, processos judiciais e destruicao de reputacao. Prevenir e mais barato que remediar." />

            <div className="rounded-2xl p-5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 12, display: 'block' }}>
                Marque os pecados que sua empresa COMETE atualmente:
              </span>
              <div className="flex flex-col gap-3">
                {SINS.map((item, i) => (
                  <div key={i} className="flex flex-col gap-2 p-3 rounded-xl transition-all"
                    style={{ background: sins[i] ? `${RED}15` : `${GREEN}08`, border: `1px solid ${sins[i] ? RED : GREEN}33` }}>
                    <div className="flex items-center justify-between gap-3">
                      <span style={{ fontSize: 13, color: sins[i] ? RED : 'rgba(255,255,255,0.6)', flex: 1 }}>
                        <strong>{i + 1}.</strong> {item.sin}
                      </span>
                      <button onClick={() => toggleSin(i)}
                        className="relative w-12 h-6 rounded-full transition-all flex-shrink-0"
                        style={{ background: sins[i] ? RED : GREEN }}>
                        <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
                          animate={{ left: sins[i] ? 26 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                      </button>
                    </div>
                    {sins[i] && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        className="flex items-start gap-2 px-3 py-2 rounded-lg" style={{ background: `${GREEN}12`, border: `1px solid ${GREEN}33` }}>
                        <CheckCircle2 size={14} style={{ color: GREEN, marginTop: 2, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: GREEN, lineHeight: 1.5 }}><strong>Como resolver:</strong> {item.fix}</span>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span style={{ fontSize: 14, fontWeight: 700, color: sinCount > 0 ? RED : GREEN }}>
                  {sinCount}/7 riscos detectados
                </span>
              </div>

              {sinCount > 0 ? (
                <div className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: `${RED}22`, border: `1px solid ${RED}` }}>
                  <XCircle size={16} style={{ color: RED }} />
                  <span style={{ color: RED, fontWeight: 700, fontSize: 14 }}>REVISE antes de comunicar</span>
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: `${GREEN}22`, border: `1px solid ${GREEN}` }}>
                  <CheckCircle2 size={16} style={{ color: GREEN }} />
                  <span style={{ color: GREEN, fontWeight: 700, fontSize: 14 }}>Aprovado — suas praticas resistem ao escrutinio</span>
                </div>
              )}
            </div>

            {/* CONAR Compliance Check */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${AMBER}33` }}>
              <div className="flex items-center gap-2 mb-3">
                <Scale size={16} style={{ color: AMBER }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: AMBER }}>Checklist CONAR — Anexo U (Sustentabilidade)</span>
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
                O CONAR exige que toda comunicacao de sustentabilidade atenda a estes criterios:
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { q: 'Suas alegacoes sao PRECISAS? (dados concretos, nao genericos)', color: sinCount === 0 ? GREEN : AMBER },
                  { q: 'Suas alegacoes sao COMPROVAVEIS? (certificacoes, auditorias, relatorios)', color: sins[1] ? RED : GREEN },
                  { q: 'Suas alegacoes NAO SAO ENGANOSAS? (nao omitem impactos negativos)', color: sins[0] || sins[2] ? RED : GREEN },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: `${item.color}10` }}>
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{item.q}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => callIA(
              `Audite minhas praticas de comunicacao ambiental. Riscos de greenwashing detectados: ${sins.map((s, i) => s ? `Pecado ${i + 1}: ${SINS[i].sin}` : null).filter(Boolean).join('; ') || 'Nenhum risco detectado'}. Total: ${sinCount}/7 pecados. Analise: 1) Quais riscos sao mais graves e urgentes? 2) Qual a probabilidade de acao do CONAR ou Procon contra nos? 3) Plano de correcao priorizado por impacto. 4) Como comunicar sustentabilidade de forma genuina e eficaz? 5) Exemplos de empresas que foram punidas por greenwashing no Brasil.`
            )} disabled={iaLoading}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold"
              style={{ background: `${RED}22`, border: `1px solid ${RED}`, color: RED, cursor: iaLoading ? 'wait' : 'pointer' }}>
              {iaLoading ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
              {iaLoading ? 'Auditando...' : 'IA audita minhas praticas'}
            </button>
          </>}

          {/* ══════════ TOOL 5: Relatorio IA ══════════ */}
          {tab === 'relatorio' && <>
            <ToolHeader title="Relatorio ESG Completo com IA" icon={FileText} color={GREEN}
              what="Gera um relatorio ESG estruturado usando todos os dados preenchidos nas outras abas + dados de mercado."
              why="Um relatorio ESG bem feito e exigido por investidores, bancos (linhas verdes) e reguladores. E seu cartao de visita sustentavel." />

            <div className="rounded-2xl p-5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 12, display: 'block' }}>
                Resumo dos Dados — Inputs do Relatorio
              </span>

              {/* Summary grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'TBL Score', value: tblScore.toFixed(0), color: trafficColor(tblScore) },
                  { label: 'ESG Rating', value: rating.label, color: rating.color },
                  { label: 'ODS Selecionados', value: selectedODS.length > 0 ? selectedODS.join(', ') : 'Nenhum', color: selectedODS.length > 0 ? GREEN : 'rgba(255,255,255,0.3)' },
                  { label: 'Greenwashing', value: `${sinCount}/7`, color: sinCount === 0 ? GREEN : RED },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: item.color, fontFamily: 'monospace' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Market data section */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'SELIC', value: `${selic}%`, color: AMBER },
                  { label: 'IPCA', value: `${ipca}%`, color: RED },
                  { label: 'PIB', value: `${pib}%`, color: BLUE },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: item.color, fontFamily: 'monospace' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Detailed breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: GREEN }}>TBL Detalhado</span>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4, lineHeight: 1.6 }}>
                    People: {peopleScore.toFixed(0)}/100<br />
                    Planet: {planetScore.toFixed(0)}/100<br />
                    Profit: {profitScore.toFixed(0)}/100
                  </div>
                </div>
                <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: BLUE }}>ESG Detalhado</span>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4, lineHeight: 1.6 }}>
                    E: {eScore.toFixed(0)}/100 (peso 40%)<br />
                    S: {sScore.toFixed(0)}/100 (peso 30%)<br />
                    G: {gScore.toFixed(0)}/100 (peso 30%)
                  </div>
                </div>
                <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: RED }}>Riscos</span>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4, lineHeight: 1.6 }}>
                    Greenwashing: {sinCount}/7 pecados<br />
                    Pilar fraco: {weakest(eScore, sScore, gScore)}<br />
                    Circulos: {circles[0] ? 'PARE' : circles[1] ? 'REDESENHE' : 'OK'}
                  </div>
                </div>
              </div>

              <button onClick={() => callIA(
                `Gere relatorio ESG completo para minha empresa. Estruture EXATAMENTE assim:

1. SUMARIO EXECUTIVO — visao geral da maturidade ESG da empresa em 3 paragrafos.

2. TBL (Triple Bottom Line): People ${peopleScore.toFixed(0)}/100, Planet ${planetScore.toFixed(0)}/100, Profit ${profitScore.toFixed(0)}/100. Score geral: ${tblScore.toFixed(0)}/100. Analise cada pilar, gaps e acoes.

3. ESG RATING: ${rating.label} (score ${esgScore.toFixed(1)}/100) — E=${eScore.toFixed(0)}, S=${sScore.toFixed(0)}, G=${gScore.toFixed(0)}. Pilar mais fraco: ${weakest(eScore, sScore, gScore)}. Gaps criticos e prioridades de melhoria para subir pelo menos 1 nivel.

4. ODS PRIORIZADOS: ${selectedODS.length > 0 ? selectedODS.map(id => `ODS ${id} (${ODS_NAMES[id]})`).join(', ') : 'Nenhum selecionado'}. Plano de acao por ODS com metas SMART.

5. GREENWASHING: ${sinCount}/7 riscos detectados${sinCount > 0 ? '. Pecados ativos: ' + sins.map((s, i) => s ? SINS[i].sin : null).filter(Boolean).join('; ') : ''}. Como resolver cada um com urgencia.

6. IMPACTO DO MERCADO: SELIC ${selic}%, IPCA ${ipca}%, PIB ${pib}%. Como esses indicadores afetam: custo de compliance ESG, acesso a linhas de credito verdes, custos de certificacao, e retorno de investimentos sustentaveis.

7. PLANO 90 DIAS: 3 acoes prioritarias com custo estimado em R$, responsavel sugerido, e KPI de acompanhamento.

8. FRAMEWORKS RECOMENDADOS: Quais usar (GRI, SASB, TCFD, CDP, ISSB) e por que, considerando o porte e maturidade da empresa. Qual comecar primeiro.`
              )} disabled={iaLoading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all"
                style={{ background: GREEN, color: '#fff', cursor: iaLoading ? 'wait' : 'pointer' }}>
                {iaLoading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                {iaLoading ? 'Gerando relatorio completo...' : 'Gerar Relatorio ESG Completo com IA'}
              </button>
            </div>
          </>}

          {/* ── IA Response (shared) ── */}
          {iaResponse && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-5" style={{ background: 'rgba(0,0,0,0.45)', border: `1px solid ${GREEN}33` }}>
              <div className="flex items-center gap-2 mb-3">
                <Brain size={16} style={{ color: GREEN }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: GREEN }}>Analise IA</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap' }}>
                {iaResponse}
              </div>
            </motion.div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  )
}
