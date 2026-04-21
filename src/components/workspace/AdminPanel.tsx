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
const TEAL = '#0e6655'

// ── TD Phase definitions ──
const TD_FASES = [
  {
    label: 'Infra',
    desc: 'Infraestrutura básica digital instalada',
    sinaisMercado: 'Maioria usa email, WhatsApp e planilhas. Sem sistemas integrados.',
    checklist: [
      'Cloud e email corporativo configurados',
      'Ferramentas de comunicação digital (Meet, Teams ou Slack)',
      'Backup automático de dados implementado',
      'Controles básicos de segurança (2FA em todas as contas)',
    ],
    esforco: 'Baixo — semanas',
  },
  {
    label: 'Processo',
    desc: 'Processos internos digitalizados',
    sinaisMercado: 'Concorrentes usam CRM e ERP. Digitização de documentos é padrão.',
    checklist: [
      'CRM ou sistema de gestão de clientes implementado',
      'Processos-chave documentados e digitalizados',
      'Ao menos 1 automação de tarefa repetitiva ativa',
      'Dashboard com métricas básicas do negócio',
    ],
    esforco: 'Médio — 1-3 meses',
  },
  {
    label: 'Estratégia',
    desc: 'Tecnologia como vantagem competitiva',
    sinaisMercado: 'Líderes tomam decisões baseadas em dados. Tech está no planejamento estratégico.',
    checklist: [
      'Dados de clientes centralizados e acessíveis',
      'Decisões de negócio orientadas por dados (DDDM)',
      'Ao menos 1 produto ou serviço com componente digital',
      'Tecnologia presente no planejamento estratégico anual',
    ],
    esforco: 'Alto — 3-6 meses',
  },
  {
    label: 'Digitização',
    desc: 'Dados e produtos digitais ativos',
    sinaisMercado: 'Novos entrantes nascem digitais. Produtos físicos têm extensões digitais.',
    checklist: [
      'Produto ou canal digital gerando receita recorrente',
      'Dados tratados como ativo estratégico da empresa',
      'Integrações via API com parceiros ou plataformas',
      'Modelo híbrido (digital + físico) em operação',
    ],
    esforco: 'Alto — 6-12 meses',
  },
  {
    label: 'Digitalização',
    desc: 'Modelo de negócio digital-first',
    sinaisMercado: 'Plataformas dominam o setor. Efeitos de rede são a principal vantagem.',
    checklist: [
      'Modelo de negócio digital-first implementado',
      'IA integrada em ao menos 1 processo crítico',
      'Escala digital sem crescimento proporcional de custo',
      'Dados acumulados geram vantagem competitiva real',
    ],
    esforco: 'Muito alto — 12-24 meses',
  },
  {
    label: 'Transformação',
    desc: 'Empresa reinventada pela tecnologia',
    sinaisMercado: 'Empresas de tech invadem setores tradicionais e os redefinem.',
    checklist: [],
    esforco: '',
  },
]

// ── Maturity levels ──
const MATURITY = ['Não iniciado', 'Em desenvolvimento', 'Implementado', 'Otimizado']
const MATURITY_COLORS = ['rgba(255,255,255,0.15)', AMBER, '#5dade2', GREEN]

function MaturitySelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1 flex-wrap mt-1.5">
      {MATURITY.map((label, i) => (
        <button key={i} onClick={() => onChange(i)}
          className="text-[10px] px-2 py-1 rounded-full transition-all font-mono"
          style={{
            background: value === i ? `${MATURITY_COLORS[i]}22` : 'rgba(0,0,0,0.3)',
            border: `1px solid ${value === i ? MATURITY_COLORS[i] : 'rgba(255,255,255,0.07)'}`,
            color: value === i ? MATURITY_COLORS[i] : 'rgba(255,255,255,0.25)',
          }}>
          {label}
        </button>
      ))}
    </div>
  )
}

// ── SGI + TD elements ──
const SGI_ELEMENTOS = [
  { key: 'sgiEstrutura', label: '🏗️ Estrutura de Projetos', desc: 'SGI gerencia incertezas; TD fornece colaboração em tempo real' },
  { key: 'sgiProcessos', label: '⚙️ Processos', desc: 'SGI organiza ideação; TD automatiza o funil e coleta feedbacks' },
  { key: 'sgiCultura', label: '🧬 Cultura', desc: 'SGI estimula experimentação; TD democratiza dados para decisões ágeis' },
  { key: 'sgiResultados', label: '📈 Resultados', desc: 'SGI foca no ROI estratégico; TD entrega analytics para medir impacto' },
]

// ── DDDM pillars ──
const DDDM_PILARES = [
  { key: 'dddmColeta', label: '💾 Coleta e Armazenamento', desc: 'Capturar dados de forma eficiente. APIs, IoT, formulários, integrações.' },
  { key: 'dddmAnalise', label: '🧠 Análise e Processamento', desc: 'Extração de informações via modelos estatísticos e machine learning.' },
  { key: 'dddmVisualizacao', label: '📈 Visualização e Comunicação', desc: 'Apresentação clara para que não-especialistas possam agir.' },
  { key: 'dddmIntegracao', label: '🎯 Integração Estratégica', desc: 'Uso dos insights nos processos decisórios diários da liderança.' },
]

// ── Tendências 2025 ──
const TEND_POSICAO = ['Não monitorando', 'Estudando', 'Pilotando', 'Implementado']
const TEND_COLORS = ['rgba(255,255,255,0.15)', AMBER, PURPLE, GREEN]

const TENDENCIAS = [
  {
    key: 'tendAgentesIA',
    label: '🤖 Agentes de IA Autônomos',
    desc: 'IA com percepção, raciocínio adaptativo e ação autônoma. Redefine governança — a observabilidade vira prioridade 1.',
    risco: 'Quem não monitora será gerenciado por quem monitora.',
  },
  {
    key: 'tendRegTech',
    label: '⚖️ RegTech e Compliance Automatizado',
    desc: 'IA automatiza KYC, AML e detecção preditiva de anomalias. Compliance deixa de ser custo e vira motor de confiança.',
    risco: 'Quem não automatiza paga mais por compliance manual e erra mais.',
  },
  {
    key: 'tendAmbidestra',
    label: '🔀 Inovação Ambidestra',
    desc: 'Eficiência operacional (exploit) + experimentação (explore) ao mesmo tempo. O maior desafio organizacional da próxima década.',
    risco: 'Focar só em eficiência = estagnação. Só em inovação = caos.',
  },
]

// ── Sustentabilidade Digital ──
const SUST_ITEMS = [
  '100% digital — zero papel em operações internas',
  'Cache inteligente reduz chamadas desnecessárias (IA, APIs)',
  'Lazy loading e compressão de assets implementados',
  'Hospedagem em infraestrutura verde (Vercel + Supabase)',
  'Monitoramento de pegada de carbono dos servidores',
  'Meta de compensação de emissões digitais definida',
]

// ── Types ──
interface OKR {
  objetivo: string
  krs: { texto: string; pct: number }[]
}

interface CockpitState {
  // TD — Fases
  faseEmpresa: number
  faseMercado: number
  checkEmpresa: boolean[][]
  targetNextPhase: string
  // TD — SGI
  sgiEstrutura: number
  sgiProcessos: number
  sgiCultura: number
  sgiResultados: number
  // TD — DDDM
  dddmColeta: number
  dddmAnalise: number
  dddmVisualizacao: number
  dddmIntegracao: number
  // TD — Tendências
  tendAgentesIA: number
  tendRegTech: number
  tendAmbidestra: number
  // TD — Sustentabilidade
  sustDigital: boolean[]
  // TD — IA
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

const DEFAULT: CockpitState = {
  faseEmpresa: 0, faseMercado: 0,
  checkEmpresa: TD_FASES.slice(0, 5).map(f => f.checklist.map(() => false)),
  targetNextPhase: '',
  sgiEstrutura: 0, sgiProcessos: 0, sgiCultura: 0, sgiResultados: 0,
  dddmColeta: 0, dddmAnalise: 0, dddmVisualizacao: 0, dddmIntegracao: 0,
  tendAgentesIA: 0, tendRegTech: 0, tendAmbidestra: 0,
  sustDigital: SUST_ITEMS.map(() => false),
  iaReflexao: '',
  tipoInovacao: '', intensidade: '', faseHype: 0, trl: 1,
  fasesFunil: [false, false, false, false, false],
  h1: 70, h2: 20, h3: 10, reflexaoInovacao: '',
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

// ── Cockpit financial default ──
const COCKPIT_DEFAULT = { receita: 0, despesas: 0, caixa: 0, cac: 0 }

// ── Hype / Funil ──
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

// ── Governance ──
const GOV_CHECKS = {
  govEstrategia: ['Tecnologia alinhada à estratégia de longo prazo', 'Prioridades e investimentos em tech definidos', 'Indicadores de resultado mapeados', 'Roadmap de 12 meses atualizado'],
  govRiscos: ['Ameaças identificadas e avaliadas', 'Criptografia e 2FA ativos em todas as contas', 'Plano de resposta a incidentes documentado', 'Treinamento de segurança realizado no time'],
  govPoliticas: ['Política de uso de dados definida (LGPD)', 'Acesso a dados sensíveis controlado por role', 'Política de fornecedores ESG aplicada', 'Código de conduta digital publicado'],
  govMonitoramento: ['Monitoramento de uptime ativo', 'Logs de acesso armazenados (mín. 6 meses)', 'Revisão trimestral de ferramentas e custos', 'Métricas de impacto acompanhadas toda semana'],
}
const GOV_LABELS: Record<string, string> = { govEstrategia: '🎯 Estratégia', govRiscos: '🛡️ Riscos e Segurança', govPoliticas: '📋 Políticas e Procedimentos', govMonitoramento: '🔄 Monitoramento Contínuo' }
const GOV_COLORS: Record<string, string> = { govEstrategia: BLUE, govRiscos: RED, govPoliticas: AMBER, govMonitoramento: GREEN }

// ── Monitor types ──
interface Feedback { id: string; nps_score: number | null; category: string | null; message: string | null; created_at: string }
interface Denuncia { id: string; tipo: string; descricao: string; created_at: string }
function timeAgo(d: string) { const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000); return m < 60 ? `${m}min` : m < 1440 ? `${Math.floor(m / 60)}h` : `${Math.floor(m / 1440)}d` }
function npsColor(s: number | null) { return s === null ? 'rgba(255,255,255,0.3)' : s >= 9 ? GREEN : s >= 7 ? AMBER : RED }

// ── TD Rail component ──
function TDRail({ title, accentColor, currentPhase, onSetPhase, checkEmpresa, onToggleCheck, onAdvance, isEmpresa, targetNextPhase, onTargetChange }: {
  title: string; accentColor: string; currentPhase: number; onSetPhase: (i: number) => void
  checkEmpresa?: boolean[][]; onToggleCheck?: (pi: number, ci: number) => void; onAdvance?: () => void
  isEmpresa: boolean; targetNextPhase?: string; onTargetChange?: (v: string) => void
}) {
  return (
    <div>
      <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-3">{title}</p>
      <div className="flex flex-col">
        {TD_FASES.map((fase, i) => {
          const isActive = currentPhase === i
          const isDone = currentPhase > i
          const isLast = i === TD_FASES.length - 1
          const checks = isEmpresa && checkEmpresa ? (checkEmpresa[i] ?? []) : []
          const allChecked = checks.length > 0 && checks.every(Boolean)
          return (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center" style={{ width: 28 }}>
                <button onClick={() => onSetPhase(i)}
                  className="rounded-full flex items-center justify-center shrink-0 transition-all"
                  style={{ width: 28, height: 28, background: isDone ? GREEN : isActive ? accentColor : 'rgba(255,255,255,0.06)', border: `2px solid ${isDone ? GREEN : isActive ? accentColor : 'rgba(255,255,255,0.1)'}`, boxShadow: isActive ? `0 0 0 4px ${accentColor}22` : 'none' }}>
                  {isDone ? <CheckCircle2 size={14} color="#fff" /> : <span className="text-[10px] font-bold font-mono" style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.25)' }}>{i + 1}</span>}
                </button>
                {!isLast && <div className="flex-1 w-0.5 my-0.5" style={{ minHeight: 20, background: isDone ? GREEN : 'rgba(255,255,255,0.07)', transition: 'background 0.4s' }} />}
              </div>
              <div className="pb-4 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[13px] font-bold" style={{ color: isDone ? GREEN : isActive ? '#fff' : 'rgba(255,255,255,0.3)' }}>F{i + 1} · {fase.label}</span>
                  {isDone && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: `${GREEN}20`, color: GREEN }}>CONCLUÍDO</span>}
                  {isActive && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: `${accentColor}22`, color: accentColor }}>ATUAL</span>}
                  {isActive && fase.esforco && <span className="text-[9px] text-white/20">{fase.esforco}</span>}
                </div>
                <p className="text-[11px] text-white/30 leading-snug mb-2">{fase.desc}</p>

                {/* Market signals */}
                {!isEmpresa && isActive && (
                  <div className="rounded-lg px-3 py-2 mb-2" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${accentColor}20` }}>
                    <p className="text-[10px] font-mono text-white/25 mb-1 uppercase tracking-wider">Sinais observados no mercado</p>
                    <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{fase.sinaisMercado}</p>
                  </div>
                )}

                {/* Empresa checklist for current phase */}
                {isEmpresa && isActive && !isLast && checkEmpresa && onToggleCheck && (
                  <div className="rounded-lg p-3 mb-2" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-2">Para avançar para {TD_FASES[i + 1].label}</p>
                    <div className="flex flex-col gap-1.5">
                      {fase.checklist.map((item, ci) => {
                        const checked = checks[ci] ?? false
                        return (
                          <button key={ci} onClick={() => onToggleCheck(i, ci)} className="flex items-start gap-2 text-left rounded px-1 py-0.5 transition-all">
                            {checked ? <CheckCircle2 size={13} style={{ color: GREEN, marginTop: 1 }} className="shrink-0" /> : <Circle size={13} style={{ color: 'rgba(255,255,255,0.2)', marginTop: 1 }} className="shrink-0" />}
                            <span className="text-[12px] leading-snug" style={{ color: checked ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.32)' }}>{item}</span>
                          </button>
                        )
                      })}
                    </div>
                    {/* Target date */}
                    {onTargetChange && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[10px] text-white/25 shrink-0">Meta:</span>
                        <input type="text" value={targetNextPhase ?? ''} onChange={e => onTargetChange(e.target.value)}
                          placeholder="Ex: Q3 2025 / 3 meses"
                          className="flex-1 bg-transparent outline-none text-[11px]"
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', paddingBottom: 2 }} />
                      </div>
                    )}
                    {allChecked && onAdvance && (
                      <motion.button initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        onClick={onAdvance}
                        className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg py-2 font-bold text-[12px] transition-all"
                        style={{ background: `${GREEN}22`, border: `1px solid ${GREEN}55`, color: GREEN }}>
                        Avançar para F{i + 2} · {TD_FASES[i + 1].label} <ChevronRight size={14} />
                      </motion.button>
                    )}
                  </div>
                )}
                {isEmpresa && isDone && !isLast && <p className="text-[10px] text-white/20 mb-1">{fase.checklist.length} itens concluídos ✓</p>}
                {isEmpresa && isActive && isLast && (
                  <div className="rounded-lg px-3 py-2" style={{ background: `${GREEN}12`, border: `1px solid ${GREEN}30` }}>
                    <p className="text-[12px] font-bold" style={{ color: GREEN }}>🏆 Transformação Digital completa</p>
                    <p className="text-[11px] text-white/35 mt-0.5">Foco em manter, inovar e liderar.</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Section header ──
function SectionHeader({ label, color = 'rgba(255,255,255,0.15)' }: { label: string; color?: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="h-px flex-1" style={{ background: color, opacity: 0.3 }} />
      <span className="text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color }}>{label}</span>
      <div className="h-px flex-1" style={{ background: color, opacity: 0.3 }} />
    </div>
  )
}

type AdminTab = 'td' | 'inovacao' | 'okrs' | 'gov' | 'norte' | 'monitor'

export default function AdminPanel() {
  const [tab, setTab] = useState<AdminTab>('td')
  const { data: s, update } = useWorkspaceData<CockpitState>('admin-cockpit', DEFAULT)
  const { data: cockpit } = useWorkspaceData('cockpit', COCKPIT_DEFAULT)
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

  const checkEmpresa: boolean[][] = (() => {
    const existing = s.checkEmpresa ?? []
    return TD_FASES.slice(0, 5).map((f, i) => existing[i] ?? f.checklist.map(() => false))
  })()

  const toggleCheck = (pi: number, ci: number) => {
    const next = checkEmpresa.map((row, p) => p === pi ? row.map((v, c) => c === ci ? !v : v) : [...row])
    update({ checkEmpresa: next })
  }

  const gap = s.faseMercado - s.faseEmpresa

  // SGI average maturity
  const sgiAvg = Math.round(([s.sgiEstrutura, s.sgiProcessos, s.sgiCultura, s.sgiResultados].reduce((a, b) => a + b, 0)) / 4)
  const dddmAvg = Math.round(([s.dddmColeta, s.dddmAnalise, s.dddmVisualizacao, s.dddmIntegracao].reduce((a, b) => a + b, 0)) / 4)
  const sustDone = (s.sustDigital ?? []).filter(Boolean).length

  // ── IA — reads all data including financials ──
  const handleIA = async () => {
    setIaLoading(true)
    try {
      let marketCtx = ''
      try {
        const mkt = await fetch('/api/market').then(r => r.json())
        marketCtx = `SELIC ${mkt?.macro?.selic?.value ?? '—'}%, IPCA ${mkt?.macro?.ipca?.value ?? '—'}%, USD/BRL ${mkt?.macro?.usdBrl?.value ?? '—'}`
      } catch { /* continue without */ }

      const receita = (cockpit as typeof COCKPIT_DEFAULT).receita ?? 0
      const despesas = (cockpit as typeof COCKPIT_DEFAULT).despesas ?? 0
      const caixa = (cockpit as typeof COCKPIT_DEFAULT).caixa ?? 0
      const runway = despesas > 0 ? Math.round(caixa / despesas) : 0
      const margem = receita > 0 ? Math.round(((receita - despesas) / receita) * 100) : 0

      const okrSummary = s.okrs.map((o, i) =>
        `OKR${i + 1}: "${o.objetivo}" | ${o.krs.map(k => `KR: ${k.texto} (${k.pct}%)`).join(', ')}`
      ).join('. ')

      const govDone = [s.govEstrategia, s.govRiscos, s.govPoliticas, s.govMonitoramento].map(a => a.filter(Boolean).length).reduce((a, b) => a + b, 0)

      const tendSummary = TENDENCIAS.map(t => `${t.label.replace(/^[^ ]+ /, '')}: ${TEND_POSICAO[(s as Record<string, number>)[t.key] ?? 0]}`).join(', ')

      const prompt = `Você é um consultor sênior de transformação digital e estratégia. Analise os dados abaixo e gere uma reflexão estratégica em 3 seções exatas:

1. DIAGNÓSTICO — o que os dados revelam sobre a posição atual
2. PRIORIDADE IMEDIATA — a 1 ação mais importante para os próximos 30 dias
3. PRÓXIMOS 7 DIAS — 3 ações concretas e específicas

POSIÇÃO TD:
- Empresa: F${s.faseEmpresa + 1} (${TD_FASES[s.faseEmpresa].label}) | Mercado: F${s.faseMercado + 1} (${TD_FASES[s.faseMercado].label})
- Gap: ${gap > 0 ? `${gap} fase(s) atrás do mercado` : gap < 0 ? `${Math.abs(gap)} fases à frente` : 'alinhado'}
- Checklist atual: ${checkEmpresa[s.faseEmpresa]?.filter(Boolean).length ?? 0}/${TD_FASES[s.faseEmpresa]?.checklist?.length ?? 0} itens

MATURIDADE:
- SGI+TD: ${MATURITY[sgiAvg]} (média dos 4 elementos)
- DDDM (dados): ${MATURITY[dddmAvg]} (média dos 4 pilares)
- Sustentabilidade: ${sustDone}/${SUST_ITEMS.length} práticas ativas
- Tendências 2025: ${tendSummary}

FINANCEIRO (dados reais do workspace):
- Receita: R$${receita.toLocaleString('pt-BR')} | Despesas: R$${despesas.toLocaleString('pt-BR')}
- Margem: ${margem}% | Runway: ${runway} meses | Caixa: R$${caixa.toLocaleString('pt-BR')}
- Mercado macro: ${marketCtx}

ESTRATÉGIA:
- OKRs: ${okrSummary || 'não definidos'}
- Governança: ${govDone}/16 controles ativos
- Norte: ${s.norteStar || 'não definido'}
- Tipo inovação: ${s.tipoInovacao || '—'} | Intensidade: ${s.intensidade || '—'}
- TRL: ${s.trl}/9 | Hype Cycle: ${HYPE_FASES[s.faseHype]?.label ?? '—'}

Seja direto, específico e autoresponsivo. Use os dados financeiros para calibrar o nível de urgência. Máximo 250 palavras.`

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
        {gap > 0 && <div className="mt-2 flex items-center gap-2"><AlertTriangle size={11} style={{ color: RED }} /><span className="text-[11px]" style={{ color: RED }}>Gap de {gap} fase{gap > 1 ? 's' : ''} — perda silenciosa de competitividade</span></div>}
        {gap === 0 && s.faseEmpresa > 0 && <div className="mt-2 flex items-center gap-2"><TrendingUp size={11} style={{ color: GREEN }} /><span className="text-[11px]" style={{ color: GREEN }}>Alinhado com o mercado — manter ritmo</span></div>}
        {gap < 0 && <div className="mt-2 flex items-center gap-2"><TrendingUp size={11} style={{ color: GREEN }} /><span className="text-[11px]" style={{ color: GREEN }}>À frente em {Math.abs(gap)} fase{Math.abs(gap) > 1 ? 's' : ''} — liderar</span></div>}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold font-mono tracking-wider transition-all"
            style={{ background: tab === t.id ? `${t.color}20` : 'rgba(0,0,0,0.25)', border: `1px solid ${tab === t.id ? t.color + '55' : 'rgba(255,255,255,0.06)'}`, color: tab === t.id ? t.color : 'rgba(255,255,255,0.3)' }}>
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

          {/* ═══ TD ═══ */}
          {tab === 'td' && (
            <div className="flex flex-col gap-6">

              <SectionHeader label="Trilho de fases" color="#5dade2" />

              <TDRail title="Trilho da empresa" accentColor="#5dade2" currentPhase={s.faseEmpresa} onSetPhase={i => update({ faseEmpresa: i })}
                checkEmpresa={checkEmpresa} onToggleCheck={toggleCheck} onAdvance={() => update({ faseEmpresa: s.faseEmpresa + 1 })}
                isEmpresa={true} targetNextPhase={s.targetNextPhase} onTargetChange={v => update({ targetNextPhase: v })} />

              <div className="h-px bg-white/5" />

              <TDRail title="Trilho do mercado" accentColor={AMBER} currentPhase={s.faseMercado} onSetPhase={i => update({ faseMercado: i })} isEmpresa={false} />

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
                      {s.faseEmpresa > i && <div className="absolute inset-0" style={{ background: GREEN, opacity: 0.18 }} />}
                      {s.faseEmpresa === i && <div className="absolute inset-0" style={{ background: '#5dade2', opacity: 0.55 }} />}
                      {s.faseMercado === i && <div className="absolute bottom-0 left-0 right-0" style={{ height: 4, background: AMBER }} />}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-2">
                  <span className="text-[9px] text-white/30 flex items-center gap-1"><span className="inline-block w-3 h-2 rounded-sm" style={{ background: '#5dade2', opacity: 0.55 }} /> Empresa</span>
                  <span className="text-[9px] text-white/30 flex items-center gap-1"><span className="inline-block w-3 rounded-sm" style={{ height: 4, background: AMBER }} /> Mercado</span>
                  <span className="text-[9px] text-white/30 flex items-center gap-1"><span className="inline-block w-3 h-2 rounded-sm" style={{ background: GREEN, opacity: 0.18 }} /> Concluído</span>
                </div>
              </div>

              {/* ── SGI + TD ── */}
              <SectionHeader label="SGI + TD — maturidade de execução" color={TEAL} />
              <div className="flex flex-col gap-3">
                {SGI_ELEMENTOS.map(el => (
                  <div key={el.key} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${MATURITY_COLORS[(s as Record<string, number>)[el.key] ?? 0]}` }}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[12px] font-semibold text-white/65">{el.label}</p>
                        <p className="text-[10px] text-white/25 mt-0.5 leading-snug">{el.desc}</p>
                      </div>
                      <span className="text-[10px] font-mono shrink-0 mt-0.5" style={{ color: MATURITY_COLORS[(s as Record<string, number>)[el.key] ?? 0] }}>
                        {MATURITY[(s as Record<string, number>)[el.key] ?? 0]}
                      </span>
                    </div>
                    <MaturitySelector value={(s as Record<string, number>)[el.key] ?? 0} onChange={v => update({ [el.key]: v } as Partial<CockpitState>)} />
                  </div>
                ))}
              </div>

              {/* ── DDDM ── */}
              <SectionHeader label="DDDM — decisão baseada em dados" color="#5dade2" />
              <div className="flex flex-col gap-3">
                {DDDM_PILARES.map(p => (
                  <div key={p.key} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${MATURITY_COLORS[(s as Record<string, number>)[p.key] ?? 0]}` }}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[12px] font-semibold text-white/65">{p.label}</p>
                        <p className="text-[10px] text-white/25 mt-0.5 leading-snug">{p.desc}</p>
                      </div>
                      <span className="text-[10px] font-mono shrink-0 mt-0.5" style={{ color: MATURITY_COLORS[(s as Record<string, number>)[p.key] ?? 0] }}>
                        {MATURITY[(s as Record<string, number>)[p.key] ?? 0]}
                      </span>
                    </div>
                    <MaturitySelector value={(s as Record<string, number>)[p.key] ?? 0} onChange={v => update({ [p.key]: v } as Partial<CockpitState>)} />
                  </div>
                ))}
              </div>

              {/* ── Tendências 2025 ── */}
              <SectionHeader label="Tendências 2025 — watchlist" color={PURPLE} />
              <div className="flex flex-col gap-3">
                {TENDENCIAS.map(t => {
                  const pos = (s as Record<string, number>)[t.key] ?? 0
                  return (
                    <div key={t.key} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${TEND_COLORS[pos]}` }}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-[12px] font-semibold text-white/65">{t.label}</p>
                        <span className="text-[10px] font-mono shrink-0" style={{ color: TEND_COLORS[pos] }}>{TEND_POSICAO[pos]}</span>
                      </div>
                      <p className="text-[10px] text-white/30 leading-snug mb-1">{t.desc}</p>
                      <p className="text-[9px] italic mb-2" style={{ color: RED, opacity: 0.7 }}>{t.risco}</p>
                      <div className="flex gap-1 flex-wrap">
                        {TEND_POSICAO.map((label, i) => (
                          <button key={i} onClick={() => update({ [t.key]: i } as Partial<CockpitState>)}
                            className="text-[10px] px-2 py-1 rounded-full transition-all font-mono"
                            style={{ background: pos === i ? `${TEND_COLORS[i]}22` : 'rgba(0,0,0,0.3)', border: `1px solid ${pos === i ? TEND_COLORS[i] : 'rgba(255,255,255,0.07)'}`, color: pos === i ? TEND_COLORS[i] : 'rgba(255,255,255,0.25)' }}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* ── Sustentabilidade Digital ── */}
              <SectionHeader label="Sustentabilidade digital" color={GREEN} />
              <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${GREEN}` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-semibold text-white/55">Práticas ativas</span>
                  <span className="font-mono text-[12px] font-bold" style={{ color: sustDone >= 5 ? GREEN : sustDone >= 3 ? AMBER : RED }}>{sustDone}/{SUST_ITEMS.length}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {SUST_ITEMS.map((item, i) => {
                    const checked = (s.sustDigital ?? [])[i] ?? false
                    return (
                      <button key={i}
                        onClick={() => { const next = [...(s.sustDigital ?? SUST_ITEMS.map(() => false))]; next[i] = !next[i]; update({ sustDigital: next }) }}
                        className="flex items-start gap-2.5 text-left rounded-md px-2 py-1.5 transition-all">
                        {checked ? <CheckCircle2 size={13} style={{ color: GREEN, marginTop: 1 }} className="shrink-0" /> : <Circle size={13} style={{ color: 'rgba(255,255,255,0.2)', marginTop: 1 }} className="shrink-0" />}
                        <span className="text-[12px] leading-snug" style={{ color: checked ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.28)' }}>{item}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ── IA Reflexão ── */}
              <SectionHeader label="IA — análise completa" color={BLUE} />
              <div>
                <p className="text-[10px] text-white/25 mb-2 leading-relaxed">
                  Lê: fase TD · SGI · DDDM · tendências · sustentabilidade · OKRs · governança · <span style={{ color: GREEN }}>dados financeiros reais</span> · mercado macro
                </p>
                <button onClick={handleIA} disabled={iaLoading}
                  className="w-full rounded-lg py-2.5 flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: BLUE, color: '#fff', fontSize: 13, fontWeight: 600, cursor: iaLoading ? 'wait' : 'pointer' }}>
                  {iaLoading ? <Loader2 size={14} className="animate-spin" /> : <Brain size={14} />}
                  {iaLoading ? 'Analisando todos os dados...' : 'Gerar reflexão estratégica com IA'}
                </button>
                {s.iaReflexao && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg p-4 mt-3"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.65)' }}>
                    {s.iaReflexao}
                  </motion.div>
                )}
              </div>

            </div>
          )}

          {/* ═══ INOVAÇÃO ═══ */}
          {tab === 'inovacao' && (
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Qual tipo de inovação?</p>
                <div className="grid grid-cols-2 gap-2">
                  {[{ id: 'produto', label: 'Produto / Serviço', desc: 'Novo produto ou melhoria substancial' }, { id: 'organizacional', label: 'Organizacional', desc: 'Estrutura, gestão, parcerias' }, { id: 'processo', label: 'Processo', desc: 'Como entregamos o que já entregamos' }, { id: 'modelo', label: 'Modelo de Negócio', desc: 'Como capturamos e criamos valor' }].map(t => (
                    <button key={t.id} onClick={() => update({ tipoInovacao: t.id })} className="rounded-lg px-3 py-2.5 text-left transition-all"
                      style={{ background: s.tipoInovacao === t.id ? 'rgba(125,60,152,0.18)' : 'rgba(0,0,0,0.25)', border: `2px solid ${s.tipoInovacao === t.id ? PURPLE : 'rgba(255,255,255,0.06)'}` }}>
                      <p className="text-[12px] font-bold" style={{ color: s.tipoInovacao === t.id ? '#a569bd' : 'rgba(255,255,255,0.4)' }}>{t.label}</p>
                      <p className="text-[10px] mt-0.5 text-white/20 leading-snug">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Qual a intensidade?</p>
                <div className="grid grid-cols-2 gap-2">
                  {[{ id: 'rotina', label: '🔄 Rotina', desc: 'Renovação natural, baixo impacto no modelo' }, { id: 'radical', label: '🚀 Radical', desc: 'Novas competências, alto investimento' }, { id: 'disruptiva', label: '💥 Disruptiva', desc: 'Reavalia o modelo de negócio' }, { id: 'arquitetonica', label: '🏗️ Arquitetônica', desc: 'Afeta modelo + tecnologia, maior risco' }].map(t => (
                    <button key={t.id} onClick={() => update({ intensidade: t.id })} className="rounded-lg px-3 py-2.5 text-left transition-all"
                      style={{ background: s.intensidade === t.id ? 'rgba(125,60,152,0.18)' : 'rgba(0,0,0,0.25)', border: `2px solid ${s.intensidade === t.id ? PURPLE : 'rgba(255,255,255,0.06)'}` }}>
                      <p className="text-[12px] font-bold" style={{ color: s.intensidade === t.id ? '#a569bd' : 'rgba(255,255,255,0.4)' }}>{t.label}</p>
                      <p className="text-[10px] mt-0.5 text-white/20 leading-snug">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-3">3 Horizontes</p>
                <div className="grid grid-cols-3 gap-2">
                  {[{ key: 'h1' as const, label: 'H1 Core', color: GREEN, desc: 'Principal, incremental' }, { key: 'h2' as const, label: 'H2 Adjacente', color: AMBER, desc: 'Novos canais, risco moderado' }, { key: 'h3' as const, label: 'H3 Disruptivo', color: PURPLE, desc: 'Novos mercados, risco alto' }].map(h => (
                    <div key={h.key} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', borderTop: `2px solid ${h.color}` }}>
                      <p className="text-[11px] font-bold mb-1" style={{ color: h.color }}>{h.label}</p>
                      <p className="text-[9px] text-white/20 mb-3 leading-snug">{h.desc}</p>
                      <input type="range" min={0} max={100} value={s[h.key]} onChange={e => update({ [h.key]: Number(e.target.value) } as Partial<CockpitState>)} className="w-full h-1" style={{ accentColor: h.color }} />
                      <p className="font-mono text-[16px] font-bold mt-1" style={{ color: h.color }}>{s[h.key]}%</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Funil de inovação</p>
                <div className="flex flex-col gap-1.5">
                  {FUNIL_FASES.map((f, i) => (
                    <button key={i} onClick={() => { const next = [...s.fasesFunil]; next[i] = !next[i]; update({ fasesFunil: next }) }}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all"
                      style={{ background: s.fasesFunil[i] ? 'rgba(30,132,73,0.1)' : 'rgba(0,0,0,0.25)', border: `1px solid ${s.fasesFunil[i] ? GREEN + '40' : 'rgba(255,255,255,0.06)'}` }}>
                      <span className="text-[12px] font-mono font-bold w-5 shrink-0" style={{ color: s.fasesFunil[i] ? GREEN : 'rgba(255,255,255,0.2)' }}>{s.fasesFunil[i] ? '✓' : String(i + 1)}</span>
                      <span className="text-[12px] leading-snug" style={{ color: s.fasesFunil[i] ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.3)' }}>{f}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Hype Cycle</p>
                <div className="flex flex-col gap-1.5">
                  {HYPE_FASES.map((f, i) => (
                    <button key={i} onClick={() => update({ faseHype: i })} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all"
                      style={{ background: s.faseHype === i ? 'rgba(125,60,152,0.13)' : 'rgba(0,0,0,0.25)', border: `1px solid ${s.faseHype === i ? PURPLE + '50' : 'rgba(255,255,255,0.06)'}` }}>
                      <span className="text-[11px] font-mono font-bold w-5 shrink-0" style={{ color: s.faseHype === i ? '#a569bd' : 'rgba(255,255,255,0.2)' }}>{i + 1}</span>
                      <div><p className="text-[12px] font-semibold" style={{ color: s.faseHype === i ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)' }}>{f.label}</p><p className="text-[10px] text-white/20">{f.desc}</p></div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest">TRL</p>
                  <span className="font-mono text-[20px] font-bold" style={{ color: s.trl >= 7 ? GREEN : s.trl >= 4 ? AMBER : RED }}>{s.trl}/9</span>
                </div>
                <input type="range" min={1} max={9} value={s.trl} onChange={e => update({ trl: Number(e.target.value) })} className="w-full h-1.5" style={{ accentColor: s.trl >= 7 ? GREEN : s.trl >= 4 ? AMBER : RED }} />
                <div className="flex justify-between mt-1"><span className="text-[9px] text-white/20">Conceito</span><span className="text-[9px] text-white/20">Protótipo</span><span className="text-[9px] text-white/20">Produção</span></div>
              </div>
              <textarea value={s.reflexaoInovacao} onChange={e => update({ reflexaoInovacao: e.target.value })} placeholder="Notas de inovação..." rows={3}
                className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none"
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }} />
            </div>
          )}

          {/* ═══ OKRs ═══ */}
          {tab === 'okrs' && (
            <div className="flex flex-col gap-5">
              <p className="text-[11px] text-white/30">OKRs são ambiciosos — <span style={{ color: GREEN }}>70% já é sucesso.</span></p>
              {s.okrs.map((okr, oi) => (
                <div key={oi} className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${GREEN}` }}>
                  <div className="flex items-center gap-2 mb-3"><Target size={13} style={{ color: GREEN }} /><span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Objetivo {oi + 1}</span></div>
                  <input value={okr.objetivo} onChange={e => { const next = [...s.okrs]; next[oi] = { ...okr, objetivo: e.target.value }; update({ okrs: next }) }}
                    placeholder="O que quero alcançar?" className="w-full rounded-lg px-3 py-2 text-[13px] outline-none mb-3"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)' }} />
                  <div className="flex flex-col gap-2">
                    {okr.krs.map((kr, ki) => (
                      <div key={ki} className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-white/25 shrink-0 w-6">KR{ki + 1}</span>
                        <input value={kr.texto} onChange={e => { const next = [...s.okrs]; next[oi].krs[ki] = { ...kr, texto: e.target.value }; update({ okrs: next }) }}
                          placeholder="Como vou medir?" className="flex-1 rounded-md px-2.5 py-1.5 text-[12px] outline-none"
                          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }} />
                        <div className="flex items-center gap-1.5 shrink-0">
                          <input type="range" min={0} max={100} value={kr.pct} onChange={e => { const next = [...s.okrs]; next[oi].krs[ki] = { ...kr, pct: Number(e.target.value) }; update({ okrs: next }) }}
                            className="w-14 h-1" style={{ accentColor: kr.pct >= 70 ? GREEN : kr.pct >= 40 ? AMBER : RED }} />
                          <span className="font-mono text-[11px] w-8 text-right" style={{ color: kr.pct >= 70 ? GREEN : kr.pct >= 40 ? AMBER : RED }}>{kr.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ═══ GOVERNANÇA ═══ */}
          {tab === 'gov' && (
            <div className="flex flex-col gap-4">
              <p className="text-[11px] text-white/30">4 pilares — se um falha, a casa desaba.</p>
              {(Object.entries(GOV_CHECKS) as [keyof typeof GOV_CHECKS, string[]][]).map(([key, items]) => {
                const arr = (s[key] as boolean[]) ?? items.map(() => false)
                const done = arr.filter(Boolean).length
                return (
                  <div key={key} className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${GOV_COLORS[key]}` }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[13px] font-semibold text-white/60">{GOV_LABELS[key]}</span>
                      <span className="font-mono text-[12px] font-bold" style={{ color: done === items.length ? GREEN : done >= 2 ? AMBER : RED }}>{done}/{items.length}</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {items.map((item, i) => (
                        <button key={i} onClick={() => { const next = [...arr]; next[i] = !next[i]; update({ [key]: next } as Partial<CockpitState>) }}
                          className="flex items-center gap-2.5 text-left rounded-md px-2.5 py-1.5 transition-all" style={{ background: arr[i] ? `${GOV_COLORS[key]}08` : 'transparent' }}>
                          <span className="text-[12px] font-mono shrink-0 w-4" style={{ color: arr[i] ? GREEN : 'rgba(255,255,255,0.2)' }}>{arr[i] ? '✓' : '○'}</span>
                          <span className="text-[12px] leading-snug" style={{ color: arr[i] ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.28)' }}>{item}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
              <textarea value={s.reflexaoGov} onChange={e => update({ reflexaoGov: e.target.value })} placeholder="O que precisa ser resolvido em governança?" rows={3}
                className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none"
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }} />
            </div>
          )}

          {/* ═══ NORTE ═══ */}
          {tab === 'norte' && (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg px-4 py-3" style={{ background: 'rgba(93,173,226,0.06)', border: '1px solid rgba(93,173,226,0.15)' }}>
                <p className="text-[11px] text-white/35 leading-relaxed">A pergunta que separa quem sobrevive de quem lidera não é "qual tecnologia adotar?" — é "onde queremos chegar?". Cultura de dados + governança ativa + inovação ambidestra = quem lidera em 2025.</p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Onde queremos chegar?</p>
                <textarea value={s.norteStar} onChange={e => update({ norteStar: e.target.value })} placeholder="Nossa estrela do norte — o estado futuro que orienta cada decisão..." rows={4}
                  className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(93,173,226,0.18)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }} />
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Cultura</p>
                <textarea value={s.cultura} onChange={e => update({ cultura: e.target.value })} placeholder="Valores praticados vs declarados, rituais, clima..." rows={4}
                  className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }} />
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Reflexão livre</p>
                <textarea value={s.reflexaoNorte} onChange={e => update({ reflexaoNorte: e.target.value })} placeholder="O que aprendemos hoje? O que vai mudar amanhã?" rows={3}
                  className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }} />
              </div>
            </div>
          )}

          {/* ═══ MONITOR ═══ */}
          {tab === 'monitor' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[{ label: 'FEEDBACKS', value: feedbacks.length, color: '#5dade2' }, { label: 'NPS MÉDIO', value: npsAvg, color: parseFloat(npsAvg) >= 8 ? GREEN : parseFloat(npsAvg) >= 6 ? AMBER : RED }, { label: 'NPS NET', value: npsNet, color: npsNet >= 50 ? GREEN : npsNet >= 0 ? AMBER : RED }, { label: 'DENÚNCIAS', value: denuncias.length, color: RED }].map(card => (
                  <div key={card.label} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-[10px] text-white/25 font-mono">{card.label}</p>
                    <p className="text-[24px] font-bold font-mono" style={{ color: card.color }}>{card.value}</p>
                  </div>
                ))}
              </div>
              {monitorLoading ? (
                <div className="flex items-center justify-center py-10"><Loader2 size={16} className="animate-spin text-white/25" /></div>
              ) : (
                <>
                  {feedbacks.length > 0 && <>
                    <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest">Feedbacks recentes</p>
                    <div className="flex flex-col gap-2">
                      {feedbacks.slice(0, 10).map(fb => (
                        <div key={fb.id} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${npsColor(fb.nps_score)}` }}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">{fb.nps_score !== null && <span className="font-mono text-[16px] font-bold" style={{ color: npsColor(fb.nps_score) }}>{fb.nps_score}</span>}{fb.category && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>{fb.category}</span>}</div>
                            <span className="text-[10px] text-white/20 font-mono">{timeAgo(fb.created_at)}</span>
                          </div>
                          {fb.message && <p className="text-[13px] text-white/50 leading-relaxed">{fb.message}</p>}
                        </div>
                      ))}
                    </div>
                  </>}
                  {feedbacks.length === 0 && <p className="text-center text-[13px] text-white/25 py-6">Nenhum feedback ainda</p>}
                  {denuncias.length > 0 && <>
                    <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mt-2">Denúncias</p>
                    <div className="flex flex-col gap-2">
                      {denuncias.map(dn => (
                        <div key={dn.id} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${RED}` }}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(192,57,43,0.15)', color: RED }}>{dn.tipo}</span>
                            <span className="text-[10px] text-white/20 font-mono">{timeAgo(dn.created_at)}</span>
                          </div>
                          <p className="text-[13px] text-white/50 leading-relaxed mt-1">{dn.descricao}</p>
                        </div>
                      ))}
                    </div>
                  </>}
                  <button onClick={loadMonitor} className="mx-auto text-[11px] text-white/20 hover:text-white/40 font-mono transition-colors">Atualizar dados</button>
                </>
              )}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  )
}
