'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Leaf, Users, DollarSign, BarChart3, Globe2, ShieldAlert,
  FileText, Loader2, Brain, AlertTriangle, CheckCircle2, XCircle,
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
  { key: 'relatorio', label: 'Relatório IA', icon: FileText },
] as const
type TabKey = (typeof TABS)[number]['key']

/* ── ODS Data ── */
const ODS_NAMES: Record<number, string> = {
  1: 'Erradicação da Pobreza', 2: 'Fome Zero', 3: 'Saúde e Bem-Estar',
  4: 'Educação de Qualidade', 5: 'Igualdade de Gênero', 6: 'Água Potável e Saneamento',
  7: 'Energia Acessível e Limpa', 8: 'Trabalho Decente e Crescimento Econômico',
  9: 'Indústria, Inovação e Infraestrutura', 10: 'Redução das Desigualdades',
  11: 'Cidades e Comunidades Sustentáveis', 12: 'Consumo e Produção Responsáveis',
  13: 'Ação Contra Mudança Global do Clima', 14: 'Vida na Água',
  15: 'Vida Terrestre', 16: 'Paz, Justiça e Instituições Eficazes',
  17: 'Parcerias e Meios de Implementação',
}
const ODS_MEASURE: Record<number, string> = {
  1: 'Funcionários acima do salário mínimo (%)', 2: 'Doações para bancos de alimentos (R$/ano)',
  3: 'Cobertura de plano de saúde (%)', 4: 'Horas de treinamento por colaborador',
  5: 'Mulheres em cargos de liderança (%)', 6: 'Reuso de água (%)',
  7: 'Energia renovável na matriz (%)', 8: 'Turnover voluntário (%)',
  9: '% receita em P&D', 10: 'Gap salarial entre grupos (%)',
  11: 'Investimento em mobilidade urbana (R$)', 12: 'Resíduos reciclados (%)',
  13: 'Emissões CO2 (tCO2e reduzidas)', 14: 'Efluentes tratados antes de descarte (%)',
  15: 'Área reflorestada (hectares)', 16: 'Denúncias tratadas em 30 dias (%)',
  17: 'Parcerias com ONGs e governo ativas',
}
const ODS_GROUPS: { label: string; color: string; ids: number[] }[] = [
  { label: 'Pessoas', color: RED, ids: [1, 2, 3, 4, 5] },
  { label: 'Prosperidade', color: AMBER, ids: [7, 8, 9, 10, 11] },
  { label: 'Planeta', color: GREEN, ids: [6, 12, 13, 14, 15] },
  { label: 'Paz & Parceria', color: BLUE, ids: [16, 17] },
]

/* ── Greenwashing 7 Sins ── */
const SINS = [
  'Custo oculto — destaca um atributo "verde" mas esconde impacto maior',
  'Sem prova — alega sustentabilidade sem certificação ou dado verificável',
  'Vagueza — termos genéricos como "eco-friendly" sem definição',
  'Irrelevância — alega algo verdadeiro mas insignificante',
  'Menor de dois males — produto "verde" numa categoria prejudicial',
  'Mentira — alegação ambiental falsa ou inventada',
  'Falso selo — imagem que parece certificação mas não é',
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ESGExecutar({ marketData }: { marketData: any }) {
  const [tab, setTab] = useState<TabKey>('tbl')
  const [iaLoading, setIaLoading] = useState(false)
  const [iaResponse, setIaResponse] = useState('')

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

  const selic = marketData?.macro?.selic?.value ?? 14.25
  const ipca = marketData?.macro?.ipca?.value ?? 4.5

  /* ── IA helper ── */
  const callIA = async (question: string) => {
    setIaLoading(true)
    setIaResponse('')
    try {
      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: question }] }),
      })
      const data = await res.json()
      setIaResponse(data.response ?? data.content ?? 'Sem resposta da IA.')
    } catch {
      setIaResponse('Erro ao conectar com a IA. Tente novamente.')
    } finally {
      setIaLoading(false)
    }
  }

  const toggleODS = (id: number) => {
    if (selectedODS.includes(id)) {
      setSelectedODS(selectedODS.filter(o => o !== id))
    } else if (selectedODS.length < 5) {
      setSelectedODS([...selectedODS, id])
    }
  }

  const toggleSin = (i: number) => {
    const next = [...sins]
    next[i] = !next[i]
    setSins(next)
  }

  const setSlider = (setter: React.Dispatch<React.SetStateAction<number[]>>, idx: number, val: number) => {
    setter(prev => { const n = [...prev]; n[idx] = val; return n })
  }

  const toggleCircle = (i: number) => {
    const n = [...circles]; n[i] = !n[i]; setCircles(n)
  }

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
          const active = tab === t.key
          const Icon = t.icon
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card title="People" icon={Users} color={GREEN}>
                <div className="flex flex-col gap-3">
                  <Slider label="Treinamento (h/ano)" value={tblPeople[0]} onChange={v => setSlider(setTblPeople, 0, v)} color={GREEN} />
                  <Slider label="Gap Salarial (% igualdade)" value={tblPeople[1]} onChange={v => setSlider(setTblPeople, 1, v)} color={GREEN} />
                  <Slider label="Diversidade (%)" value={tblPeople[2]} onChange={v => setSlider(setTblPeople, 2, v)} color={GREEN} />
                </div>
              </Card>
              <Card title="Planet" icon={Leaf} color={BLUE}>
                <div className="flex flex-col gap-3">
                  <Slider label="Emissoes (% reducao)" value={tblPlanet[0]} onChange={v => setSlider(setTblPlanet, 0, v)} color={BLUE} />
                  <Slider label="Reciclagem (%)" value={tblPlanet[1]} onChange={v => setSlider(setTblPlanet, 1, v)} color={BLUE} />
                  <Slider label="Energia Renovavel (%)" value={tblPlanet[2]} onChange={v => setSlider(setTblPlanet, 2, v)} color={BLUE} />
                </div>
              </Card>
              <Card title="Profit" icon={DollarSign} color={AMBER}>
                <div className="flex flex-col gap-3">
                  <Slider label="Margem (%)" value={tblProfit[0]} onChange={v => setSlider(setTblProfit, 0, v)} color={AMBER} />
                  <Slider label="Investimento P&D (%)" value={tblProfit[1]} onChange={v => setSlider(setTblProfit, 1, v)} color={AMBER} />
                  <Slider label="Impostos / Compliance (%)" value={tblProfit[2]} onChange={v => setSlider(setTblProfit, 2, v)} color={AMBER} />
                </div>
              </Card>
            </div>

            {/* TBL Score Bars */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>TBL Score</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: tblScore >= 70 ? GREEN : tblScore >= 40 ? AMBER : RED, fontFamily: 'monospace' }}>
                  {tblScore.toFixed(0)}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <HBar label="People" value={peopleScore} color={GREEN} />
                <HBar label="Planet" value={planetScore} color={BLUE} />
                <HBar label="Profit" value={profitScore} color={AMBER} />
              </div>
            </div>

            {/* Teste dos Circulos */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Teste dos Circulos</span>
              <div className="flex flex-col gap-3 mt-3">
                {[
                  { q: 'Viola limite ecologico?', warn: true },
                  { q: 'Prejudica grupo social?', warn: true },
                  { q: 'Financeiramente viavel?', warn: false },
                ].map((item, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={circles[i]} onChange={() => toggleCircle(i)}
                      className="w-5 h-5 rounded" style={{ accentColor: item.warn ? RED : GREEN }} />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{item.q}</span>
                  </label>
                ))}
              </div>
              {circles[0] && (
                <div className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: `${RED}22`, border: `1px solid ${RED}` }}>
                  <XCircle size={16} style={{ color: RED }} />
                  <span style={{ color: RED, fontWeight: 700, fontSize: 14 }}>PARE — Limite ecologico violado</span>
                </div>
              )}
              {!circles[0] && circles[1] && (
                <div className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: `${AMBER}22`, border: `1px solid ${AMBER}` }}>
                  <AlertTriangle size={16} style={{ color: AMBER }} />
                  <span style={{ color: AMBER, fontWeight: 700, fontSize: 14 }}>REDESENHE — Impacto social negativo</span>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card title="Environmental (40%)" icon={Leaf} color={GREEN}>
                <div className="flex flex-col gap-3">
                  <Slider label="Emissoes CO2" value={esgE[0]} onChange={v => setSlider(setEsgE, 0, v)} color={GREEN} />
                  <Slider label="Gestao Hidrica" value={esgE[1]} onChange={v => setSlider(setEsgE, 1, v)} color={GREEN} />
                  <Slider label="Energia Renovavel" value={esgE[2]} onChange={v => setSlider(setEsgE, 2, v)} color={GREEN} />
                </div>
              </Card>
              <Card title="Social (30%)" icon={Users} color={BLUE}>
                <div className="flex flex-col gap-3">
                  <Slider label="Diversidade Lideranca" value={esgS[0]} onChange={v => setSlider(setEsgS, 0, v)} color={BLUE} />
                  <Slider label="Saude / Seguranca" value={esgS[1]} onChange={v => setSlider(setEsgS, 1, v)} color={BLUE} />
                  <Slider label="Investimento Comunidade" value={esgS[2]} onChange={v => setSlider(setEsgS, 2, v)} color={BLUE} />
                </div>
              </Card>
              <Card title="Governance (30%)" icon={ShieldAlert} color={AMBER}>
                <div className="flex flex-col gap-3">
                  <Slider label="Independencia Conselho" value={esgG[0]} onChange={v => setSlider(setEsgG, 0, v)} color={AMBER} />
                  <Slider label="Canal Denuncias" value={esgG[1]} onChange={v => setSlider(setEsgG, 1, v)} color={AMBER} />
                  <Slider label="Transparencia Relatorios" value={esgG[2]} onChange={v => setSlider(setEsgG, 2, v)} color={AMBER} />
                </div>
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
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>
                Referencia: Natura AAA | Vale pos-Brumadinho B
              </span>
            </div>
          </>}

          {/* ══════════ TOOL 3: ODS Mapper ══════════ */}
          {tab === 'ods' && <>
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
                        <button key={id} onClick={() => toggleODS(id)}
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
                  <span style={{ fontSize: 12, color: AMBER }}>Maximo de 5 ODS atingido</span>
                </div>
              )}
            </div>

            {/* Selected ODS Details */}
            {selectedODS.length > 0 && (
              <div className="rounded-2xl p-5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>ODS Priorizados</span>
                <div className="flex flex-col gap-3 mt-3">
                  {selectedODS.map(id => (
                    <div key={id} className="flex flex-col gap-1 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: GREEN }}>ODS {id} — {ODS_NAMES[id]}</span>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>O que medir: {ODS_MEASURE[id]}</span>
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
              `Gere um plano de acao para os seguintes ODS priorizados: ${selectedODS.map(id => `ODS ${id} (${ODS_NAMES[id]})`).join(', ')}. Para cada ODS inclua: 1) Metas SMART 2) Indicadores 3) Acoes praticas 4) Prazo sugerido 5) Investimento estimado.`
            )} disabled={iaLoading || selectedODS.length === 0}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all"
              style={{ background: selectedODS.length === 0 ? 'rgba(255,255,255,0.06)' : BLUE, color: '#fff', border: 'none', cursor: iaLoading ? 'wait' : 'pointer', opacity: selectedODS.length === 0 ? 0.4 : 1 }}>
              {iaLoading ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
              {iaLoading ? 'Gerando plano...' : 'Gerar plano ODS com IA'}
            </button>
          </>}

          {/* ══════════ TOOL 4: Anti-Greenwashing ══════════ */}
          {tab === 'greenwash' && <>
            <div className="rounded-2xl p-5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 12, display: 'block' }}>
                Os 7 Pecados do Greenwashing
              </span>
              <div className="flex flex-col gap-3">
                {SINS.map((sin, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-xl transition-all"
                    style={{ background: sins[i] ? `${RED}15` : `${GREEN}10`, border: `1px solid ${sins[i] ? RED : GREEN}33` }}>
                    <span style={{ fontSize: 13, color: sins[i] ? RED : 'rgba(255,255,255,0.6)', flex: 1 }}>
                      <strong>{i + 1}.</strong> {sin}
                    </span>
                    <button onClick={() => toggleSin(i)}
                      className="relative w-12 h-6 rounded-full transition-all flex-shrink-0"
                      style={{ background: sins[i] ? RED : GREEN }}>
                      <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
                        animate={{ left: sins[i] ? 26 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                    </button>
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

              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 12 }}>
                Ref: CONAR — Conselho Nacional de Autorregulamentacao Publicitaria. Anexo U (Apelos de Sustentabilidade).
              </p>
            </div>
          </>}

          {/* ══════════ TOOL 5: Relatorio IA ══════════ */}
          {tab === 'relatorio' && <>
            <div className="rounded-2xl p-5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
                Gera um relatorio ESG completo usando todos os dados preenchidos nas outras abas, combinado com dados de mercado em tempo real.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'TBL Score', value: tblScore.toFixed(0), color: tblScore >= 70 ? GREEN : tblScore >= 40 ? AMBER : RED },
                  { label: 'ESG Rating', value: rating.label, color: rating.color },
                  { label: 'ODS', value: selectedODS.length > 0 ? selectedODS.join(', ') : 'Nenhum', color: selectedODS.length > 0 ? GREEN : 'rgba(255,255,255,0.3)' },
                  { label: 'Greenwashing', value: `${sinCount}/7`, color: sinCount === 0 ? GREEN : RED },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: item.color, fontFamily: 'monospace' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => callIA(
                `Gere um relatorio ESG completo para minha empresa. TBL scores: People ${peopleScore.toFixed(0)}, Planet ${planetScore.toFixed(0)}, Profit ${profitScore.toFixed(0)}. ESG Rating simulado: ${rating.label} (score ${esgScore.toFixed(1)}). ODS priorizados: ${selectedODS.length > 0 ? selectedODS.map(id => `${id}-${ODS_NAMES[id]}`).join(', ') : 'nenhum selecionado'}. Greenwashing riscos: ${sinCount}/7. Dados de mercado: SELIC ${selic}%, IPCA ${ipca}%. Inclua: 1) Sumario executivo. 2) Pontos fortes. 3) Gaps criticos. 4) Plano de acao 90 dias. 5) Frameworks recomendados (GRI, SASB, TCFD). 6) Custo estimado de implementacao.`
              )} disabled={iaLoading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all"
                style={{ background: GREEN, color: '#fff', border: 'none', cursor: iaLoading ? 'wait' : 'pointer' }}>
                {iaLoading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                {iaLoading ? 'Gerando relatorio...' : 'Gerar Relatorio ESG Completo com IA'}
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
