'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useWorkspaceData } from '@/hooks/useWorkspaceData'
import { Target, AlertTriangle, TrendingUp, Loader2, Brain, ChevronRight, CheckCircle2, Circle } from 'lucide-react'

const BLUE = '#1a5276'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const RED = '#c0392b'
const PURPLE = '#7d3c98'

// ── TD Phase definitions ──
const TD_FASES = [
  {
    label: 'Infra',
    desc: 'Infraestrutura básica digital instalada',
    sinaisMercado: 'Maioria das empresas usa email, WhatsApp e planilhas. Sem sistemas integrados.',
    checklist: [
      'Cloud e email corporativo configurados',
      'Ferramentas de comunicação digital (Meet, Teams ou Slack)',
      'Backup automático de dados implementado',
      'Controles básicos de segurança (2FA em todas as contas)',
    ],
  },
  {
    label: 'Processo',
    desc: 'Processos internos digitalizados',
    sinaisMercado: 'Concorrentes usam CRM e ERP. Digitização de documentos e fluxos internos é padrão.',
    checklist: [
      'CRM ou sistema de gestão de clientes implementado',
      'Processos-chave documentados e digitalizados',
      'Ao menos 1 automação de tarefa repetitiva ativa',
      'Dashboard com métricas básicas do negócio',
    ],
  },
  {
    label: 'Estratégia',
    desc: 'Tecnologia como vantagem competitiva',
    sinaisMercado: 'Líderes do setor tomam decisões baseadas em dados. Tech está no planejamento estratégico.',
    checklist: [
      'Dados de clientes centralizados e acessíveis',
      'Decisões de negócio orientadas por dados (DDDM)',
      'Ao menos 1 produto ou serviço com componente digital',
      'Tecnologia presente no planejamento estratégico anual',
    ],
  },
  {
    label: 'Digitização',
    desc: 'Dados e produtos digitais ativos',
    sinaisMercado: 'Novos entrantes já nascem digitais. Produtos físicos têm versões ou extensões digitais.',
    checklist: [
      'Produto ou canal digital gerando receita recorrente',
      'Dados tratados como ativo estratégico da empresa',
      'Integrações via API com parceiros ou plataformas',
      'Modelo híbrido (digital + físico) em operação',
    ],
  },
  {
    label: 'Digitalização',
    desc: 'Modelo de negócio digital-first',
    sinaisMercado: 'Plataformas e marketplaces dominam o setor. Efeitos de rede são a principal vantagem.',
    checklist: [
      'Modelo de negócio digital-first implementado',
      'IA integrada em ao menos 1 processo crítico',
      'Escala digital sem crescimento proporcional de custo',
      'Dados acumulados geram vantagem competitiva real',
    ],
  },
  {
    label: 'Transformação',
    desc: 'Empresa reinventada pela tecnologia',
    sinaisMercado: 'O mercado é redefinido por empresas de tecnologia que invadem setores tradicionais.',
    checklist: [], // última fase — sem próximo passo
  },
]

// ── OKR + Governance types ──
interface OKR {
  objetivo: string
  krs: { texto: string; pct: number }[]
}

interface CockpitState {
  // TD
  faseEmpresa: number
  faseMercado: number
  checkEmpresa: boolean[][]
  iaReflexao: string
  // Inovação
  tipoInovacao: string
  intensidade: string
  faseHype: number
  trl: number
  fasesFunil: boolean[]
  h1: number
  h2: number
  h3: number
  reflexaoInovacao: string
  // OKRs
  okrs: OKR[]
  // Governança
  govEstrategia: boolean[]
  govRiscos: boolean[]
  govPoliticas: boolean[]
  govMonitoramento: boolean[]
  reflexaoGov: string
  // Norte
  norteStar: string
  cultura: string
  reflexaoNorte: string
}

const makeCheckEmpresa = () => TD_FASES.slice(0, 5).map(f => f.checklist.map(() => false))

const DEFAULT: CockpitState = {
  faseEmpresa: 0,
  faseMercado: 0,
  checkEmpresa: makeCheckEmpresa(),
  iaReflexao: '',
  tipoInovacao: '', intensidade: '', faseHype: 0, trl: 1,
  fasesFunil: [false, false, false, false, false],
  h1: 70, h2: 20, h3: 10,
  reflexaoInovacao: '',
  okrs: [
    { objetivo: '', krs: [{ texto: '', pct: 0 }, { texto: '', pct: 0 }, { texto: '', pct: 0 }] },
    { objetivo: '', krs: [{ texto: '', pct: 0 }, { texto: '', pct: 0 }, { texto: '', pct: 0 }] },
  ],
  govEstrategia: [false, false, false, false],
  govRiscos: [false, false, false, false],
  govPoliticas: [false, false, false, false],
  govMonitoramento: [false, false, false, false],
  reflexaoGov: '',
  norteStar: '', cultura: '', reflexaoNorte: '',
}

// ── Hype Cycle ──
const HYPE_FASES = [
  { label: 'Gatilho Tecnológico', desc: 'Nova tecnologia surge. Interesse da mídia.' },
  { label: 'Pico de Expectativas', desc: 'Entusiasmo excessivo. Expectativas irrealistas.' },
  { label: 'Vale da Desilusão', desc: 'Falhas. Interesse diminui. Empresas fracas morrem.' },
  { label: 'Encosta da Iluminação', desc: 'Casos reais funcionam. Benefícios ficam claros.' },
  { label: 'Platô de Produtividade', desc: 'Tecnologia madura, amplamente adotada.' },
]

const FUNIL_FASES = [
  'Fuzzy Front-End — Ideias brutas, divergir é necessário',
  'Stage Gate 1 — Triagem (alinhamento, viabilidade, go/no-go)',
  'Desenvolvimento — Prototipagem, testes, validação técnica',
  'Stage Gate 2 — Decisão final (ROI, mercado validado?)',
  'Lançamento e Escala — Go-to-market, métricas, ciclo reinicia',
]

const GOV_CHECKS = {
  govEstrategia: [
    'Tecnologia alinhada à estratégia de longo prazo',
    'Prioridades e investimentos em tech definidos',
    'Indicadores de resultado mapeados',
    'Roadmap de 12 meses atualizado',
  ],
  govRiscos: [
    'Ameaças identificadas e avaliadas',
    'Criptografia e 2FA ativos em todas as contas',
    'Plano de resposta a incidentes documentado',
    'Treinamento de segurança realizado no time',
  ],
  govPoliticas: [
    'Política de uso de dados definida (LGPD)',
    'Acesso a dados sensíveis controlado por role',
    'Política de fornecedores ESG aplicada',
    'Código de conduta digital publicado',
  ],
  govMonitoramento: [
    'Monitoramento de uptime ativo',
    'Logs de acesso armazenados (mín. 6 meses)',
    'Revisão trimestral de ferramentas e custos',
    'Métricas de impacto acompanhadas toda semana',
  ],
}

const GOV_LABELS: Record<string, string> = {
  govEstrategia: '🎯 Estratégia',
  govRiscos: '🛡️ Riscos e Segurança',
  govPoliticas: '📋 Políticas e Procedimentos',
  govMonitoramento: '🔄 Monitoramento Contínuo',
}

const GOV_COLORS: Record<string, string> = {
  govEstrategia: BLUE, govRiscos: RED, govPoliticas: AMBER, govMonitoramento: GREEN,
}

// ── Monitor types ──
interface Feedback {
  id: string; nps_score: number | null; category: string | null; message: string | null; created_at: string
}
interface Denuncia {
  id: string; tipo: string; descricao: string; created_at: string
}
function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}
function npsColor(score: number | null): string {
  if (score === null) return 'rgba(255,255,255,0.3)'
  if (score >= 9) return GREEN
  if (score >= 7) return AMBER
  return RED
}

// ── TD Rail ──
function TDRail({
  title, accentColor, currentPhase, onSetPhase,
  checkEmpresa, onToggleCheck, onAdvance, isEmpresa,
}: {
  title: string
  accentColor: string
  currentPhase: number
  onSetPhase: (i: number) => void
  checkEmpresa?: boolean[][]
  onToggleCheck?: (phaseIdx: number, itemIdx: number) => void
  onAdvance?: () => void
  isEmpresa: boolean
}) {
  return (
    <div>
      <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-3">
        {title}
      </p>
      <div className="flex flex-col">
        {TD_FASES.map((fase, i) => {
          const isActive = currentPhase === i
          const isDone = currentPhase > i
          const isNext = currentPhase === i - 1
          const checks = isEmpresa && checkEmpresa ? (checkEmpresa[i] ?? []) : []
          const allChecked = checks.length > 0 && checks.every(Boolean)
          const isLast = i === TD_FASES.length - 1

          return (
            <div key={i} className="flex gap-3">
              {/* Track line + node */}
              <div className="flex flex-col items-center" style={{ width: 28 }}>
                <button
                  onClick={() => onSetPhase(i)}
                  className="rounded-full flex items-center justify-center shrink-0 transition-all"
                  style={{
                    width: 28, height: 28,
                    background: isDone ? GREEN : isActive ? accentColor : 'rgba(255,255,255,0.06)',
                    border: `2px solid ${isDone ? GREEN : isActive ? accentColor : 'rgba(255,255,255,0.1)'}`,
                    boxShadow: isActive ? `0 0 0 4px ${accentColor}22` : 'none',
                  }}
                >
                  {isDone
                    ? <CheckCircle2 size={14} color="#fff" />
                    : <span className="text-[10px] font-bold font-mono" style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.25)' }}>{i + 1}</span>
                  }
                </button>
                {!isLast && (
                  <div className="flex-1 w-0.5 my-0.5" style={{
                    minHeight: 20,
                    background: isDone ? GREEN : 'rgba(255,255,255,0.07)',
                    transition: 'background 0.4s',
                  }} />
                )}
              </div>

              {/* Content */}
              <div className={`pb-4 flex-1 ${isLast ? '' : ''}`}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[13px] font-bold" style={{
                    color: isDone ? GREEN : isActive ? '#fff' : 'rgba(255,255,255,0.3)',
                  }}>
                    F{i + 1} · {fase.label}
                  </span>
                  {isDone && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: `${GREEN}20`, color: GREEN }}>CONCLUÍDO</span>}
                  {isActive && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: `${accentColor}22`, color: accentColor }}>ATUAL</span>}
                </div>
                <p className="text-[11px] text-white/30 leading-snug mb-2">{fase.desc}</p>

                {/* Market signals (for market rail) */}
                {!isEmpresa && isActive && (
                  <div className="rounded-lg px-3 py-2 mb-2" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${accentColor}20` }}>
                    <p className="text-[10px] font-mono text-white/25 mb-1 uppercase tracking-wider">Sinais observados no mercado</p>
                    <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{fase.sinaisMercado}</p>
                  </div>
                )}

                {/* Checklist for empresa — next steps to advance */}
                {isEmpresa && isActive && !isLast && checkEmpresa && onToggleCheck && (
                  <div className="rounded-lg p-3 mb-2" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-2">
                      Para avançar para {TD_FASES[i + 1].label}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {fase.checklist.map((item, ci) => {
                        const checked = checks[ci] ?? false
                        return (
                          <button key={ci}
                            onClick={() => onToggleCheck(i, ci)}
                            className="flex items-start gap-2 text-left transition-all rounded px-1 py-0.5"
                          >
                            {checked
                              ? <CheckCircle2 size={13} style={{ color: GREEN, marginTop: 1, shrink: 0 }} className="shrink-0" />
                              : <Circle size={13} style={{ color: 'rgba(255,255,255,0.2)', marginTop: 1 }} className="shrink-0" />
                            }
                            <span className="text-[12px] leading-snug" style={{ color: checked ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.32)' }}>
                              {item}
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    {allChecked && onAdvance && (
                      <motion.button
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        onClick={onAdvance}
                        className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg py-2 font-bold text-[12px] transition-all"
                        style={{ background: `${GREEN}22`, border: `1px solid ${GREEN}55`, color: GREEN }}
                      >
                        Avançar para F{i + 2} · {TD_FASES[i + 1].label}
                        <ChevronRight size={14} />
                      </motion.button>
                    )}
                  </div>
                )}

                {/* If done, show next-phase checklist collapsed */}
                {isEmpresa && isDone && !isLast && checkEmpresa && (
                  <p className="text-[10px] text-white/20 mb-1">
                    {fase.checklist.length} itens concluídos ✓
                  </p>
                )}

                {/* Last phase achieved */}
                {isEmpresa && isActive && isLast && (
                  <div className="rounded-lg px-3 py-2" style={{ background: `${GREEN}12`, border: `1px solid ${GREEN}30` }}>
                    <p className="text-[12px] font-bold" style={{ color: GREEN }}>🏆 Transformação Digital completa</p>
                    <p className="text-[11px] text-white/35 mt-0.5">Foco em manter, inovar e liderar.</p>
                  </div>
                )}

                {/* Next phase preview (for isNext) */}
                {isEmpresa && isNext && !isActive && (
                  <p className="text-[10px] text-white/20 italic">
                    Próxima fase — complete os itens acima para avançar
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

type AdminTab = 'td' | 'inovacao' | 'okrs' | 'gov' | 'norte' | 'monitor'

export default function AdminPanel() {
  const [tab, setTab] = useState<AdminTab>('td')
  const { data: s, update } = useWorkspaceData<CockpitState>('admin-cockpit', DEFAULT)
  const [iaLoading, setIaLoading] = useState(false)
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [denuncias, setDenuncias] = useState<Denuncia[]>([])
  const [monitorLoading, setMonitorLoading] = useState(false)

  const loadMonitor = async () => {
    setMonitorLoading(true)
    try {
      const supabase = createClient()
      const [fbRes, dnRes] = await Promise.all([
        supabase.from('feedbacks').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('denuncias').select('*').order('created_at', { ascending: false }).limit(50),
      ])
      if (fbRes.data) setFeedbacks(fbRes.data)
      if (dnRes.data) setDenuncias(dnRes.data)
    } catch { /* silent */ }
    finally { setMonitorLoading(false) }
  }

  useEffect(() => { if (tab === 'monitor') loadMonitor() }, [tab])

  // Ensure checkEmpresa is always valid length
  const checkEmpresa: boolean[][] = (() => {
    const existing = s.checkEmpresa ?? []
    return TD_FASES.slice(0, 5).map((f, i) =>
      existing[i] ?? f.checklist.map(() => false)
    )
  })()

  const toggleCheck = (phaseIdx: number, itemIdx: number) => {
    const next = checkEmpresa.map((row, pi) =>
      pi === phaseIdx ? row.map((v, ci) => ci === itemIdx ? !v : v) : [...row]
    )
    update({ checkEmpresa: next })
  }

  const advanceEmpresa = () => {
    if (s.faseEmpresa < TD_FASES.length - 1) {
      update({ faseEmpresa: s.faseEmpresa + 1 })
    }
  }

  const gap = s.faseMercado - s.faseEmpresa

  // AI reflexão — pulls all cockpit context
  const handleIA = async () => {
    setIaLoading(true)
    try {
      // pull market data for context
      let marketCtx = ''
      try {
        const mkt = await fetch('/api/market').then(r => r.json())
        marketCtx = `SELIC ${mkt?.macro?.selic?.value ?? '—'}%, IPCA ${mkt?.macro?.ipca?.value ?? '—'}%, USD/BRL ${mkt?.macro?.usdBrl?.value ?? '—'}.`
      } catch { /* use without */ }

      const okrSummary = s.okrs.map((o, i) =>
        `OKR${i + 1}: "${o.objetivo}" — KRs: ${o.krs.map(k => `${k.texto} (${k.pct}%)`).join(', ')}`
      ).join('. ')

      const govDone = [s.govEstrategia, s.govRiscos, s.govPoliticas, s.govMonitoramento]
        .map(arr => arr.filter(Boolean).length).reduce((a, b) => a + b, 0)

      const prompt = `Você é um consultor de transformação digital e estratégia empresarial. Analise o estado atual da empresa com base nos dados abaixo e gere uma reflexão estratégica direta, em bullet points, com 3 seções: (1) Diagnóstico, (2) Prioridade imediata, (3) Próximo passo em 7 dias.

DADOS:
- Fase TD da empresa: F${s.faseEmpresa + 1} (${TD_FASES[s.faseEmpresa].label})
- Fase TD do mercado: F${s.faseMercado + 1} (${TD_FASES[s.faseMercado].label})
- Gap: ${gap > 0 ? `${gap} fases atrás do mercado` : gap < 0 ? `${Math.abs(gap)} fases à frente` : 'alinhado com o mercado'}
- Itens concluídos na fase atual: ${checkEmpresa[s.faseEmpresa]?.filter(Boolean).length ?? 0}/${TD_FASES[s.faseEmpresa]?.checklist?.length ?? 0}
- Tipo de inovação: ${s.tipoInovacao || 'não definido'}
- Intensidade: ${s.intensidade || 'não definido'}
- TRL: ${s.trl}/9
- Fase Hype Cycle: ${HYPE_FASES[s.faseHype]?.label ?? '—'}
- OKRs: ${okrSummary || 'não definidos'}
- Pilares de governança completos: ${govDone}/16
- Norte estratégico: ${s.norteStar || 'não definido'}
- Mercado macro: ${marketCtx}

Seja direto, útil e autoresponsivo. Máximo 200 palavras.`

      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
      })
      const data = await res.json()
      update({ iaReflexao: data.response ?? data.content ?? 'Sem resposta.' })
    } catch {
      update({ iaReflexao: 'Erro ao conectar com a IA. Tente novamente.' })
    } finally {
      setIaLoading(false)
    }
  }

  const npsScores = feedbacks.filter(f => f.nps_score !== null).map(f => f.nps_score as number)
  const npsAvg = npsScores.length > 0 ? (npsScores.reduce((a, b) => a + b, 0) / npsScores.length).toFixed(1) : '—'
  const promoters = npsScores.filter(n => n >= 9).length
  const detractors = npsScores.filter(n => n <= 6).length
  const npsNet = npsScores.length > 0 ? Math.round(((promoters - detractors) / npsScores.length) * 100) : 0

  const TABS: { id: AdminTab; label: string; color: string }[] = [
    { id: 'td', label: 'TD', color: BLUE },
    { id: 'inovacao', label: 'Inovação', color: PURPLE },
    { id: 'okrs', label: 'OKRs', color: GREEN },
    { id: 'gov', label: 'Governança', color: AMBER },
    { id: 'norte', label: 'Norte', color: '#5dade2' },
    { id: 'monitor', label: 'Monitor', color: RED },
  ]

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">

      {/* Pergunta do dia */}
      <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(26,82,118,0.1)', border: '1px solid rgba(26,82,118,0.2)' }}>
        <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-1.5">Pergunta do dia</p>
        <p className="text-[13px] text-white/55 leading-relaxed">
          Em qual fase <span style={{ color: '#5dade2' }}>estamos</span>?{' '}
          Em qual fase o <span style={{ color: AMBER }}>mercado</span> chegou?{' '}
          <span className="text-white/30">Todo dia aplicar, desenvolver, aprender, evoluir.</span>
        </p>
        {gap > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <AlertTriangle size={11} style={{ color: RED }} />
            <span className="text-[11px]" style={{ color: RED }}>
              Gap de {gap} fase{gap > 1 ? 's' : ''} — perda silenciosa de competitividade
            </span>
          </div>
        )}
        {gap === 0 && s.faseEmpresa > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <TrendingUp size={11} style={{ color: GREEN }} />
            <span className="text-[11px]" style={{ color: GREEN }}>Alinhado com o mercado — manter ritmo</span>
          </div>
        )}
        {gap < 0 && (
          <div className="mt-2 flex items-center gap-2">
            <TrendingUp size={11} style={{ color: GREEN }} />
            <span className="text-[11px]" style={{ color: GREEN }}>
              À frente em {Math.abs(gap)} fase{Math.abs(gap) > 1 ? 's' : ''} — liderar
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold font-mono tracking-wider transition-all"
            style={{
              background: tab === t.id ? `${t.color}20` : 'rgba(0,0,0,0.25)',
              border: `1px solid ${tab === t.id ? t.color + '55' : 'rgba(255,255,255,0.06)'}`,
              color: tab === t.id ? t.color : 'rgba(255,255,255,0.3)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

          {/* ─── TD ─── */}
          {tab === 'td' && (
            <div className="flex flex-col gap-6">

              {/* Rail Empresa */}
              <TDRail
                title="Trilho da empresa"
                accentColor="#5dade2"
                currentPhase={s.faseEmpresa}
                onSetPhase={i => update({ faseEmpresa: i })}
                checkEmpresa={checkEmpresa}
                onToggleCheck={toggleCheck}
                onAdvance={advanceEmpresa}
                isEmpresa={true}
              />

              <div className="h-px bg-white/5" />

              {/* Rail Mercado */}
              <TDRail
                title="Trilho do mercado"
                accentColor={AMBER}
                currentPhase={s.faseMercado}
                onSetPhase={i => update({ faseMercado: i })}
                isEmpresa={false}
              />

              <div className="h-px bg-white/5" />

              {/* Posição relativa */}
              <div className="rounded-lg p-4" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-white/25 uppercase tracking-widest">Posição relativa</span>
                  <span className="text-[11px] font-mono font-bold" style={{ color: gap > 0 ? RED : gap < 0 ? GREEN : AMBER }}>
                    {gap > 0 ? `GAP ${gap}` : gap < 0 ? `+${Math.abs(gap)} FRENTES` : 'ALINHADO'}
                  </span>
                </div>
                <div className="flex items-end gap-1.5" style={{ height: 48 }}>
                  {TD_FASES.map((_, i) => (
                    <div key={i} className="flex-1 rounded-sm relative overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.04)', height: `${((i + 1) / 6) * 100}%` }}>
                      {s.faseEmpresa === i && (
                        <div className="absolute inset-0 rounded-sm" style={{ background: '#5dade2', opacity: 0.55 }} />
                      )}
                      {s.faseMercado === i && (
                        <div className="absolute bottom-0 left-0 right-0 rounded-b-sm" style={{ height: 4, background: AMBER }} />
                      )}
                      {s.faseEmpresa > i && (
                        <div className="absolute inset-0 rounded-sm" style={{ background: GREEN, opacity: 0.2 }} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-2">
                  <span className="text-[9px] text-white/30 flex items-center gap-1">
                    <span className="inline-block w-3 h-2 rounded-sm" style={{ background: '#5dade2', opacity: 0.55 }} /> Empresa
                  </span>
                  <span className="text-[9px] text-white/30 flex items-center gap-1">
                    <span className="inline-block w-3 rounded-sm" style={{ height: 4, background: AMBER }} /> Mercado
                  </span>
                  <span className="text-[9px] text-white/30 flex items-center gap-1">
                    <span className="inline-block w-3 h-2 rounded-sm" style={{ background: GREEN, opacity: 0.2 }} /> Concluído
                  </span>
                </div>
              </div>

              {/* IA Reflexão */}
              <div>
                <button onClick={handleIA} disabled={iaLoading}
                  className="w-full rounded-lg py-2.5 flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: BLUE, color: '#fff', fontSize: 13, fontWeight: 600, cursor: iaLoading ? 'wait' : 'pointer' }}
                >
                  {iaLoading ? <Loader2 size={14} className="animate-spin" /> : <Brain size={14} />}
                  {iaLoading ? 'Analisando todos os dados...' : 'Reflexão com IA — analisar posição atual'}
                </button>

                {s.iaReflexao && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg p-4 mt-3"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', fontSize: 13, lineHeight: 1.75, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.65)' }}
                  >
                    {s.iaReflexao}
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* ─── INOVAÇÃO ─── */}
          {tab === 'inovacao' && (
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Qual tipo de inovação?</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'produto', label: 'Produto / Serviço', desc: 'Novo produto ou melhoria substancial' },
                    { id: 'organizacional', label: 'Organizacional', desc: 'Estrutura, gestão, parcerias' },
                    { id: 'processo', label: 'Processo', desc: 'Como entregamos o que já entregamos' },
                    { id: 'modelo', label: 'Modelo de Negócio', desc: 'Como capturamos e criamos valor' },
                  ].map(t => (
                    <button key={t.id} onClick={() => update({ tipoInovacao: t.id })}
                      className="rounded-lg px-3 py-2.5 text-left transition-all"
                      style={{
                        background: s.tipoInovacao === t.id ? 'rgba(125,60,152,0.18)' : 'rgba(0,0,0,0.25)',
                        border: `2px solid ${s.tipoInovacao === t.id ? PURPLE : 'rgba(255,255,255,0.06)'}`,
                      }}>
                      <p className="text-[12px] font-bold" style={{ color: s.tipoInovacao === t.id ? '#a569bd' : 'rgba(255,255,255,0.4)' }}>{t.label}</p>
                      <p className="text-[10px] mt-0.5 text-white/20 leading-snug">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Qual a intensidade?</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'rotina', label: '🔄 Rotina', desc: 'Renovação natural, baixo impacto no modelo' },
                    { id: 'radical', label: '🚀 Radical', desc: 'Novas competências, alto investimento' },
                    { id: 'disruptiva', label: '💥 Disruptiva', desc: 'Reavalia o modelo de negócio' },
                    { id: 'arquitetonica', label: '🏗️ Arquitetônica', desc: 'Afeta modelo + tecnologia, maior risco' },
                  ].map(t => (
                    <button key={t.id} onClick={() => update({ intensidade: t.id })}
                      className="rounded-lg px-3 py-2.5 text-left transition-all"
                      style={{
                        background: s.intensidade === t.id ? 'rgba(125,60,152,0.18)' : 'rgba(0,0,0,0.25)',
                        border: `2px solid ${s.intensidade === t.id ? PURPLE : 'rgba(255,255,255,0.06)'}`,
                      }}>
                      <p className="text-[12px] font-bold" style={{ color: s.intensidade === t.id ? '#a569bd' : 'rgba(255,255,255,0.4)' }}>{t.label}</p>
                      <p className="text-[10px] mt-0.5 text-white/20 leading-snug">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-3">3 Horizontes — distribuição de esforço</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'h1' as const, label: 'H1 Core', color: GREEN, desc: 'Principal, incremental, quick wins' },
                    { key: 'h2' as const, label: 'H2 Adjacente', color: AMBER, desc: 'Novos canais, risco moderado' },
                    { key: 'h3' as const, label: 'H3 Disruptivo', color: PURPLE, desc: 'Novos mercados, risco alto' },
                  ].map(h => (
                    <div key={h.key} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', borderTop: `2px solid ${h.color}` }}>
                      <p className="text-[11px] font-bold mb-1" style={{ color: h.color }}>{h.label}</p>
                      <p className="text-[9px] text-white/20 mb-3 leading-snug">{h.desc}</p>
                      <input type="range" min={0} max={100} value={s[h.key]}
                        onChange={e => update({ [h.key]: Number(e.target.value) } as Partial<CockpitState>)}
                        className="w-full h-1" style={{ accentColor: h.color }} />
                      <p className="font-mono text-[16px] font-bold mt-1" style={{ color: h.color }}>{s[h.key]}%</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Funil de inovação — onde estamos?</p>
                <div className="flex flex-col gap-1.5">
                  {FUNIL_FASES.map((f, i) => (
                    <button key={i}
                      onClick={() => { const next = [...s.fasesFunil]; next[i] = !next[i]; update({ fasesFunil: next }) }}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all"
                      style={{
                        background: s.fasesFunil[i] ? 'rgba(30,132,73,0.1)' : 'rgba(0,0,0,0.25)',
                        border: `1px solid ${s.fasesFunil[i] ? GREEN + '40' : 'rgba(255,255,255,0.06)'}`,
                      }}>
                      <span className="text-[12px] font-mono font-bold w-5 shrink-0" style={{ color: s.fasesFunil[i] ? GREEN : 'rgba(255,255,255,0.2)' }}>
                        {s.fasesFunil[i] ? '✓' : String(i + 1)}
                      </span>
                      <span className="text-[12px] leading-snug" style={{ color: s.fasesFunil[i] ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.3)' }}>{f}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Hype Cycle — fase da tecnologia principal</p>
                <div className="flex flex-col gap-1.5">
                  {HYPE_FASES.map((f, i) => (
                    <button key={i} onClick={() => update({ faseHype: i })}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all"
                      style={{
                        background: s.faseHype === i ? 'rgba(125,60,152,0.13)' : 'rgba(0,0,0,0.25)',
                        border: `1px solid ${s.faseHype === i ? PURPLE + '50' : 'rgba(255,255,255,0.06)'}`,
                      }}>
                      <span className="text-[11px] font-mono font-bold w-5 shrink-0" style={{ color: s.faseHype === i ? '#a569bd' : 'rgba(255,255,255,0.2)' }}>
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-[12px] font-semibold" style={{ color: s.faseHype === i ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)' }}>{f.label}</p>
                        <p className="text-[10px] text-white/20">{f.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest">TRL — Maturidade tecnológica</p>
                  <span className="font-mono text-[20px] font-bold" style={{ color: s.trl >= 7 ? GREEN : s.trl >= 4 ? AMBER : RED }}>{s.trl}/9</span>
                </div>
                <input type="range" min={1} max={9} value={s.trl}
                  onChange={e => update({ trl: Number(e.target.value) })}
                  className="w-full h-1.5" style={{ accentColor: s.trl >= 7 ? GREEN : s.trl >= 4 ? AMBER : RED }} />
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-white/20">Conceito básico</span>
                  <span className="text-[9px] text-white/20">Protótipo</span>
                  <span className="text-[9px] text-white/20">Produção</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Notas</p>
                <textarea value={s.reflexaoInovacao} onChange={e => update({ reflexaoInovacao: e.target.value })}
                  placeholder="O que aprendemos? O que vamos desenvolver? Onde o mercado chegou?" rows={3}
                  className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }} />
              </div>
            </div>
          )}

          {/* ─── OKRs ─── */}
          {tab === 'okrs' && (
            <div className="flex flex-col gap-5">
              <p className="text-[11px] text-white/30 leading-relaxed">
                OKRs são ambiciosos por definição — <span style={{ color: GREEN }}>atingir 70% já é sucesso.</span>{' '}
                Objetivo = o que alcançar. Key Results = como medir.
              </p>
              {s.okrs.map((okr, oi) => (
                <div key={oi} className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${GREEN}` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Target size={13} style={{ color: GREEN }} />
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Objetivo {oi + 1}</span>
                  </div>
                  <input value={okr.objetivo}
                    onChange={e => { const next = [...s.okrs]; next[oi] = { ...okr, objetivo: e.target.value }; update({ okrs: next }) }}
                    placeholder="O que quero alcançar?"
                    className="w-full rounded-lg px-3 py-2 text-[13px] outline-none mb-3"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)' }} />
                  <div className="flex flex-col gap-2">
                    {okr.krs.map((kr, ki) => (
                      <div key={ki} className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-white/25 shrink-0 w-6">KR{ki + 1}</span>
                        <input value={kr.texto}
                          onChange={e => { const next = [...s.okrs]; next[oi].krs[ki] = { ...kr, texto: e.target.value }; update({ okrs: next }) }}
                          placeholder="Como vou medir?"
                          className="flex-1 rounded-md px-2.5 py-1.5 text-[12px] outline-none"
                          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }} />
                        <div className="flex items-center gap-1.5 shrink-0">
                          <input type="range" min={0} max={100} value={kr.pct}
                            onChange={e => { const next = [...s.okrs]; next[oi].krs[ki] = { ...kr, pct: Number(e.target.value) }; update({ okrs: next }) }}
                            className="w-14 h-1"
                            style={{ accentColor: kr.pct >= 70 ? GREEN : kr.pct >= 40 ? AMBER : RED }} />
                          <span className="font-mono text-[11px] w-8 text-right" style={{ color: kr.pct >= 70 ? GREEN : kr.pct >= 40 ? AMBER : RED }}>
                            {kr.pct}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── GOVERNANÇA ─── */}
          {tab === 'gov' && (
            <div className="flex flex-col gap-4">
              <p className="text-[11px] text-white/30 leading-relaxed">
                Os 4 pilares da governança digital — se um falha, a casa desaba.
              </p>
              {(Object.entries(GOV_CHECKS) as [keyof typeof GOV_CHECKS, string[]][]).map(([key, items]) => {
                const arr = (s[key] as boolean[]) ?? items.map(() => false)
                const done = arr.filter(Boolean).length
                return (
                  <div key={key} className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${GOV_COLORS[key]}` }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[13px] font-semibold text-white/60">{GOV_LABELS[key]}</span>
                      <span className="font-mono text-[12px] font-bold" style={{ color: done === items.length ? GREEN : done >= 2 ? AMBER : RED }}>
                        {done}/{items.length}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {items.map((item, i) => (
                        <button key={i}
                          onClick={() => { const next = [...arr]; next[i] = !next[i]; update({ [key]: next } as Partial<CockpitState>) }}
                          className="flex items-center gap-2.5 text-left rounded-md px-2.5 py-1.5 transition-all"
                          style={{ background: arr[i] ? `${GOV_COLORS[key]}08` : 'transparent' }}>
                          <span className="text-[12px] font-mono shrink-0 w-4" style={{ color: arr[i] ? GREEN : 'rgba(255,255,255,0.2)' }}>
                            {arr[i] ? '✓' : '○'}
                          </span>
                          <span className="text-[12px] leading-snug" style={{ color: arr[i] ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.28)' }}>{item}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Notas</p>
                <textarea value={s.reflexaoGov} onChange={e => update({ reflexaoGov: e.target.value })}
                  placeholder="O que precisa ser resolvido em governança? Qual vulnerabilidade existe hoje?"
                  rows={3}
                  className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }} />
              </div>
            </div>
          )}

          {/* ─── NORTE ─── */}
          {tab === 'norte' && (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg px-4 py-3" style={{ background: 'rgba(93,173,226,0.06)', border: '1px solid rgba(93,173,226,0.15)' }}>
                <p className="text-[11px] text-white/35 leading-relaxed">
                  A pergunta que separa empresas que sobrevivem das que lideram não é "qual tecnologia adotar?" —
                  é "onde queremos chegar?". Em 2025, quem lidera é quem tem cultura de dados, governança ativa
                  e inovação ambidestra: eficiência hoje + experimentação amanhã.
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Onde queremos chegar?</p>
                <textarea value={s.norteStar} onChange={e => update({ norteStar: e.target.value })}
                  placeholder="Nossa estrela do norte — o estado futuro que orienta cada decisão do dia..." rows={4}
                  className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(93,173,226,0.18)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }} />
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Cultura — o que estamos construindo internamente?</p>
                <textarea value={s.cultura} onChange={e => update({ cultura: e.target.value })}
                  placeholder="Valores praticados vs declarados, rituais, clima, o que é aceito e o que não é..." rows={4}
                  className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }} />
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Reflexão livre</p>
                <textarea value={s.reflexaoNorte} onChange={e => update({ reflexaoNorte: e.target.value })}
                  placeholder="O que aprendemos hoje? O que vai mudar amanhã? O que evoluímos esta semana?"
                  rows={3}
                  className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }} />
              </div>
            </div>
          )}

          {/* ─── MONITOR ─── */}
          {tab === 'monitor' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'FEEDBACKS', value: feedbacks.length, color: '#5dade2' },
                  { label: 'NPS MÉDIO', value: npsAvg, color: parseFloat(npsAvg) >= 8 ? GREEN : parseFloat(npsAvg) >= 6 ? AMBER : RED },
                  { label: 'NPS NET', value: npsNet, color: npsNet >= 50 ? GREEN : npsNet >= 0 ? AMBER : RED },
                  { label: 'DENÚNCIAS', value: denuncias.length, color: RED },
                ].map(card => (
                  <div key={card.label} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-[10px] text-white/25 font-mono">{card.label}</p>
                    <p className="text-[24px] font-bold font-mono" style={{ color: card.color }}>{card.value}</p>
                  </div>
                ))}
              </div>

              {monitorLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 size={16} className="animate-spin text-white/25" />
                </div>
              ) : (
                <>
                  {feedbacks.length > 0 && (
                    <>
                      <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest">Feedbacks recentes</p>
                      <div className="flex flex-col gap-2">
                        {feedbacks.slice(0, 10).map(fb => (
                          <div key={fb.id} className="rounded-lg p-3"
                            style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${npsColor(fb.nps_score)}` }}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                {fb.nps_score !== null && (
                                  <span className="font-mono text-[16px] font-bold" style={{ color: npsColor(fb.nps_score) }}>{fb.nps_score}</span>
                                )}
                                {fb.category && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                                    {fb.category}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-white/20 font-mono">{timeAgo(fb.created_at)}</span>
                            </div>
                            {fb.message && <p className="text-[13px] text-white/50 leading-relaxed">{fb.message}</p>}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {feedbacks.length === 0 && <p className="text-center text-[13px] text-white/25 py-6">Nenhum feedback ainda</p>}
                  {denuncias.length > 0 && (
                    <>
                      <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mt-2">Denúncias</p>
                      <div className="flex flex-col gap-2">
                        {denuncias.map(dn => (
                          <div key={dn.id} className="rounded-lg p-3"
                            style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${RED}` }}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                                style={{ background: 'rgba(192,57,43,0.15)', color: RED }}>{dn.tipo}</span>
                              <span className="text-[10px] text-white/20 font-mono">{timeAgo(dn.created_at)}</span>
                            </div>
                            <p className="text-[13px] text-white/50 leading-relaxed mt-1">{dn.descricao}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  <button onClick={loadMonitor}
                    className="mx-auto text-[11px] text-white/20 hover:text-white/40 font-mono transition-colors">
                    Atualizar dados
                  </button>
                </>
              )}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  )
}
