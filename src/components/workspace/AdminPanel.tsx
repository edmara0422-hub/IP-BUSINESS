'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useWorkspaceData } from '@/hooks/useWorkspaceData'
import { Target, AlertTriangle, TrendingUp, Loader2 } from 'lucide-react'

const BLUE = '#1a5276'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const RED = '#c0392b'
const PURPLE = '#7d3c98'

// ── State ──
interface OKR {
  objetivo: string
  krs: { texto: string; pct: number }[]
}

interface CockpitState {
  faseEmpresa: number
  faseMercado: number
  reflexaoTD: string
  tipoInovacao: string
  intensidade: string
  faseHype: number
  trl: number
  fasesFunil: boolean[]
  h1: number
  h2: number
  h3: number
  reflexaoInovacao: string
  okrs: OKR[]
  govEstrategia: boolean[]
  govRiscos: boolean[]
  govPoliticas: boolean[]
  govMonitoramento: boolean[]
  reflexaoGov: string
  norteStar: string
  cultura: string
  reflexaoNorte: string
}

const DEFAULT: CockpitState = {
  faseEmpresa: 0, faseMercado: 0, reflexaoTD: '',
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

// ── Constants ──
const TD_FASES = [
  { label: 'Infra', desc: 'Infraestrutura básica digital instalada' },
  { label: 'Processo', desc: 'Processos internos digitalizados' },
  { label: 'Estratégia', desc: 'Tecnologia como vantagem competitiva' },
  { label: 'Digitização', desc: 'Dados e produtos digitais ativos' },
  { label: 'Digitalização', desc: 'Modelo de negócio digital-first' },
  { label: 'Transformação', desc: 'Empresa reinventada pela tecnologia' },
]

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

type AdminTab = 'td' | 'inovacao' | 'okrs' | 'gov' | 'norte' | 'monitor'

export default function AdminPanel() {
  const [tab, setTab] = useState<AdminTab>('td')
  const { data: s, update } = useWorkspaceData<CockpitState>('admin-cockpit', DEFAULT)
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [denuncias, setDenuncias] = useState<Denuncia[]>([])
  const [loading, setLoading] = useState(false)

  const loadMonitor = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const [fbRes, dnRes] = await Promise.all([
        supabase.from('feedbacks').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('denuncias').select('*').order('created_at', { ascending: false }).limit(50),
      ])
      if (fbRes.data) setFeedbacks(fbRes.data)
      if (dnRes.data) setDenuncias(dnRes.data)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  useEffect(() => { if (tab === 'monitor') loadMonitor() }, [tab])

  const gap = s.faseMercado - s.faseEmpresa
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
          Em qual fase <span style={{ color: '#5dade2' }}>estamos</span> hoje?{' '}
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
              À frente do mercado em {Math.abs(gap)} fase{Math.abs(gap) > 1 ? 's' : ''} — liderar
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
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">
                  Fase da <span style={{ color: '#5dade2' }}>empresa</span>
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {TD_FASES.map((f, i) => (
                    <button key={i} onClick={() => update({ faseEmpresa: i })}
                      className="rounded-lg px-3 py-2.5 text-left transition-all"
                      style={{
                        background: s.faseEmpresa === i ? 'rgba(26,82,118,0.2)' : 'rgba(0,0,0,0.25)',
                        border: `2px solid ${s.faseEmpresa === i ? '#5dade2' : 'rgba(255,255,255,0.06)'}`,
                      }}>
                      <p className="text-[12px] font-bold" style={{ color: s.faseEmpresa === i ? '#5dade2' : 'rgba(255,255,255,0.4)' }}>
                        F{i + 1} · {f.label}
                      </p>
                      <p className="text-[10px] mt-0.5 text-white/20 leading-snug">{f.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">
                  Fase do <span style={{ color: AMBER }}>mercado</span>
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {TD_FASES.map((f, i) => (
                    <button key={i} onClick={() => update({ faseMercado: i })}
                      className="rounded-lg px-3 py-2.5 text-left transition-all"
                      style={{
                        background: s.faseMercado === i ? 'rgba(154,125,10,0.15)' : 'rgba(0,0,0,0.25)',
                        border: `2px solid ${s.faseMercado === i ? AMBER : 'rgba(255,255,255,0.06)'}`,
                      }}>
                      <p className="text-[12px] font-bold" style={{ color: s.faseMercado === i ? AMBER : 'rgba(255,255,255,0.4)' }}>
                        F{i + 1} · {f.label}
                      </p>
                      <p className="text-[10px] mt-0.5 text-white/20 leading-snug">{f.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gap visual */}
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
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Reflexão do dia</p>
                <textarea value={s.reflexaoTD} onChange={e => update({ reflexaoTD: e.target.value })}
                  placeholder="O que mudou hoje? Qual ação vai fechar o gap?" rows={3}
                  className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }} />
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
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Reflexão</p>
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
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Reflexão</p>
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

              {loading ? (
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
