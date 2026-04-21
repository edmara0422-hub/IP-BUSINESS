'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWorkspaceData } from '@/hooks/useWorkspaceData'

// ── Types ────────────────────────────────────────────────

interface CockpitState {
  fase: 1 | 2 | 3 | null
  faseMercado: 1 | 2 | 3 | null
  tipoInovacao: string
  nivelIntensidade: string
  hypeCycle: string
  trl: number
  h1: string
  h2: string
  h3: string
  okr1: string; kr1a: string; kr1b: string; kr1c: string
  okr2: string; kr2a: string; kr2b: string; kr2c: string
  funilStage: number
  governanca: Record<string, boolean>
  decisaoHoje: string
  notas: string
}

const DEFAULT: CockpitState = {
  fase: null, faseMercado: null,
  tipoInovacao: '', nivelIntensidade: '',
  hypeCycle: '', trl: 6,
  h1: '', h2: '', h3: '',
  okr1: '', kr1a: '', kr1b: '', kr1c: '',
  okr2: '', kr2a: '', kr2b: '', kr2c: '',
  funilStage: 2,
  governanca: { estrategia: false, riscos: false, politicas: false, monitoramento: false },
  decisaoHoje: '',
  notas: '',
}

// ── Helpers ─────────────────────────────────────────────

const FASE_LABELS: Record<number, { label: string; desc: string; color: string }> = {
  1: { label: 'Fase 1 · Infraestrutura', desc: 'TI como suporte operacional — servidores, redes, estabilidade.', color: '#c0392b' },
  2: { label: 'Fase 2 · Processo', desc: 'Integração de sistemas — ERP, CRM, BI. Eficiência operacional.', color: '#9a7d0a' },
  3: { label: 'Fase 3 · Estratégia', desc: 'Tecnologia define o modelo de negócio — plataforma, dados, IA.', color: '#1e8449' },
}

const TIPOS_INOVACAO = [
  { id: 'produto', label: 'Produto / Serviço', icon: '📦' },
  { id: 'processo', label: 'Processo', icon: '⚙️' },
  { id: 'organizacional', label: 'Organizacional', icon: '🏛️' },
  { id: 'modelo', label: 'Modelo de Negócio', icon: '♟️' },
]

const NIVEIS_INTENSIDADE = [
  { id: 'rotina', label: 'Rotina', desc: 'Renovação incremental — baixo risco, baixo impacto.', color: '#5dade2' },
  { id: 'radical', label: 'Radical', desc: 'Novas competências tecnológicas — alto investimento.', color: '#9a7d0a' },
  { id: 'disruptiva', label: 'Disruptiva', desc: 'Mudança no modelo de negócio — escolhas estratégicas.', color: '#c0392b' },
  { id: 'arquitetonica', label: 'Arquitetônica', desc: 'Maior impacto — afeta modelo E tecnologia simultaneamente.', color: '#7d3c98' },
]

const HYPE_PHASES = [
  { id: 'gatilho', label: 'Gatilho Tecnológico', desc: 'Tecnologia surge. Primeiras provas de conceito.' },
  { id: 'pico', label: 'Pico de Expectativas', desc: 'Entusiasmo excessivo. Expectativas irrealistas.' },
  { id: 'vale', label: 'Vale da Desilusão', desc: 'Implementações falham. Interesse diminui.' },
  { id: 'encosta', label: 'Encosta da Iluminação', desc: 'Casos reais funcionam. Benefícios ficam claros.' },
  { id: 'plato', label: 'Platô de Produtividade', desc: 'Tecnologia madura, amplamente adotada.' },
]

const FUNIL_STAGES = [
  { n: 1, label: 'Fuzzy Front-End', desc: 'Ideias difusas. Incertezas sobre mercado e tecnologia.' },
  { n: 2, label: 'Stage Gate 1', desc: 'Triagem inicial — alinhamento estratégico e viabilidade.' },
  { n: 3, label: 'Desenvolvimento', desc: 'Prototipagem, testes, validação técnica e de mercado.' },
  { n: 4, label: 'Stage Gate 2', desc: 'Decisão final — lançar ou pivotar.' },
  { n: 5, label: 'Lançamento e Escala', desc: 'Go-to-market. Métricas de adoção, receita, satisfação.' },
]

const GOV_ITEMS = [
  { id: 'estrategia', label: '🎯 Estratégia', desc: 'OKRs documentados e revisados mensalmente.' },
  { id: 'riscos', label: '🛡️ Riscos e Segurança', desc: 'LGPD, 2FA, backup automático, política de dados.' },
  { id: 'politicas', label: '📋 Políticas', desc: 'Processos documentados — quem faz o quê.' },
  { id: 'monitoramento', label: '🔄 Monitoramento', desc: 'Analytics de uso e revisão trimestral de ferramentas.' },
]

// ── Sub-components ───────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30">{title}</p>
      {children}
    </div>
  )
}

function Chip({ label, selected, onClick, color }: { label: string; selected: boolean; onClick: () => void; color?: string }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
      style={{
        background: selected ? (color ?? 'rgba(255,255,255,0.12)') : 'rgba(255,255,255,0.04)',
        border: `1px solid ${selected ? (color ?? 'rgba(255,255,255,0.3)') : 'rgba(255,255,255,0.06)'}`,
        color: selected ? '#fff' : 'rgba(255,255,255,0.45)',
      }}
    >
      {label}
    </button>
  )
}

function FaseCard({ n, selected, onClick, me }: { n: 1 | 2 | 3; selected: boolean; onClick: () => void; me?: boolean }) {
  const f = FASE_LABELS[n]
  return (
    <button
      onClick={onClick}
      className="flex-1 rounded-xl p-3 text-left transition-all"
      style={{
        background: selected ? `${f.color}22` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${selected ? f.color : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[11px] font-mono font-bold" style={{ color: selected ? f.color : 'rgba(255,255,255,0.3)' }}>F{n}</span>
        {me && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: `${f.color}33`, color: f.color }}>você</span>}
      </div>
      <p className="text-[11px] text-white/60 leading-tight">{f.label.split(' · ')[1]}</p>
    </button>
  )
}

// ── Main Component ───────────────────────────────────────

export default function InovacaoCockpit() {
  const { data, update, loaded, saving } = useWorkspaceData<CockpitState>('inovacao', DEFAULT)
  const [tab, setTab] = useState<'fase' | 'inovacao' | 'okrs' | 'funil' | 'gov' | 'norte'>('fase')

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/25">Carregando...</span>
      </div>
    )
  }

  // ── Gap analysis ─────────────────────────────────────
  const gap = data.fase && data.faseMercado ? data.faseMercado - data.fase : null

  const tabs = [
    { id: 'fase', label: 'Fase TD' },
    { id: 'inovacao', label: 'Inovação' },
    { id: 'okrs', label: 'OKRs' },
    { id: 'funil', label: 'Funil' },
    { id: 'gov', label: 'Governança' },
    { id: 'norte', label: 'Norte' },
  ] as const

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-white">Cockpit Estratégico</h2>
          <p className="text-[11px] text-white/35 mt-0.5">Onde estamos hoje? Para onde vamos?</p>
        </div>
        {saving && <span className="text-[10px] font-mono text-white/25 uppercase tracking-widest">salvando…</span>}
      </div>

      {/* Daily question */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(93,173,226,0.08)', border: '1px solid rgba(93,173,226,0.15)' }}>
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#5dade2]/60 mb-2">Pergunta do dia</p>
        <p className="text-[13px] text-white/80 leading-relaxed italic">
          "Em qual fase estamos hoje? E em qual fase o mercado ao redor já chegou? A diferença entre as duas respostas é o gap que precisa ser fechado."
        </p>
        <textarea
          value={data.decisaoHoje}
          onChange={e => update({ decisaoHoje: e.target.value })}
          placeholder="Sua resposta de hoje..."
          rows={2}
          className="mt-3 w-full bg-transparent text-[12px] text-white/70 placeholder:text-white/20 resize-none outline-none border-t border-white/06 pt-3"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-mono whitespace-nowrap transition-all"
            style={{
              background: tab === t.id ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: tab === t.id ? '#fff' : 'rgba(255,255,255,0.35)',
              border: `1px solid ${tab === t.id ? 'rgba(255,255,255,0.15)' : 'transparent'}`,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col gap-3"
        >

          {/* ── FASE TD ──────────────────────────────── */}
          {tab === 'fase' && (
            <>
              <Section title="Nossa fase atual">
                <div className="flex gap-2">
                  {([1, 2, 3] as const).map(n => (
                    <FaseCard key={n} n={n} selected={data.fase === n} onClick={() => update({ fase: n })} me />
                  ))}
                </div>
                {data.fase && (
                  <p className="text-[11px] text-white/50 leading-relaxed">{FASE_LABELS[data.fase].desc}</p>
                )}
              </Section>

              <Section title="Fase do mercado (concorrentes)">
                <div className="flex gap-2">
                  {([1, 2, 3] as const).map(n => (
                    <FaseCard key={n} n={n} selected={data.faseMercado === n} onClick={() => update({ faseMercado: n })} />
                  ))}
                </div>
              </Section>

              {gap !== null && (
                <div className="rounded-xl p-4" style={{
                  background: gap > 0 ? 'rgba(192,57,43,0.1)' : 'rgba(30,132,73,0.1)',
                  border: `1px solid ${gap > 0 ? 'rgba(192,57,43,0.3)' : 'rgba(30,132,73,0.3)'}`,
                }}>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: gap > 0 ? '#c0392b' : '#1e8449' }}>
                    {gap > 0 ? `Gap de ${gap} fase${gap > 1 ? 's' : ''} — ação urgente` : gap === 0 ? 'Alinhado com o mercado' : 'À frente do mercado'}
                  </p>
                  <p className="text-[12px] text-white/60 leading-relaxed">
                    {gap > 0
                      ? `Empresas que operam em Fase ${data.fase} enquanto o mercado está em Fase ${data.faseMercado} perdem competitividade de forma sistemática e silenciosa. O custo de ficar parado é composto.`
                      : gap === 0
                      ? 'Você está no mesmo patamar do mercado. O diferencial agora é velocidade de execução — quem se move mais rápido dentro da mesma fase vence.'
                      : 'Você está à frente. Proteja a vantagem com dados e barreiras de entrada antes que os concorrentes alcancem.'}
                  </p>
                </div>
              )}
            </>
          )}

          {/* ── INOVAÇÃO ─────────────────────────────── */}
          {tab === 'inovacao' && (
            <>
              <Section title="Tipo de inovação do IPB">
                <div className="flex flex-wrap gap-2">
                  {TIPOS_INOVACAO.map(t => (
                    <Chip key={t.id} label={`${t.icon} ${t.label}`} selected={data.tipoInovacao === t.id} onClick={() => update({ tipoInovacao: t.id })} />
                  ))}
                </div>
              </Section>

              <Section title="Nível de intensidade">
                <div className="flex flex-col gap-2">
                  {NIVEIS_INTENSIDADE.map(n => (
                    <button
                      key={n.id}
                      onClick={() => update({ nivelIntensidade: n.id })}
                      className="flex items-start gap-3 p-3 rounded-lg text-left transition-all"
                      style={{
                        background: data.nivelIntensidade === n.id ? `${n.color}15` : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${data.nivelIntensidade === n.id ? n.color : 'rgba(255,255,255,0.05)'}`,
                      }}
                    >
                      <span className="text-[11px] font-semibold mt-0.5" style={{ color: n.color }}>{n.label}</span>
                      <span className="text-[11px] text-white/45 leading-relaxed">{n.desc}</span>
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Hype Cycle — onde estamos">
                <div className="flex flex-col gap-1.5">
                  {HYPE_PHASES.map((h, i) => (
                    <button
                      key={h.id}
                      onClick={() => update({ hypeCycle: h.id })}
                      className="flex items-center gap-3 p-2.5 rounded-lg text-left transition-all"
                      style={{
                        background: data.hypeCycle === h.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                        border: `1px solid ${data.hypeCycle === h.id ? 'rgba(255,255,255,0.15)' : 'transparent'}`,
                      }}
                    >
                      <span className="text-[10px] font-mono text-white/25 w-4">{i + 1}</span>
                      <div>
                        <p className="text-[12px] font-medium text-white/70">{h.label}</p>
                        <p className="text-[10px] text-white/35">{h.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </Section>

              <Section title={`TRL atual — nível ${data.trl}/9`}>
                <input
                  type="range" min={1} max={9} value={data.trl}
                  onChange={e => update({ trl: Number(e.target.value) })}
                  className="w-full accent-blue-400"
                />
                <div className="flex justify-between text-[10px] text-white/30 font-mono">
                  <span>TRL 1 · Ideia</span>
                  <span>TRL 5 · Validado</span>
                  <span>TRL 9 · Mercado</span>
                </div>
                <p className="text-[11px] text-white/50">
                  {data.trl <= 3 ? 'Pesquisa básica — princípios observados e reportados.' :
                   data.trl <= 5 ? 'Validação em laboratório — tecnologia testada em componentes.' :
                   data.trl <= 7 ? 'Demonstração em ambiente relevante — protótipo funcional.' :
                   data.trl <= 8 ? 'Sistema completo qualificado — testes finais.' :
                   'Tecnologia provada em ambiente operacional real — produto no mercado.'}
                </p>
              </Section>
            </>
          )}

          {/* ── OKRs ─────────────────────────────────── */}
          {tab === 'okrs' && (
            <>
              <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-[10px] text-white/30 font-mono mb-1">OKR · Regra de ouro</p>
                <p className="text-[11px] text-white/50 leading-relaxed">Objetivo = o que alcançar. Key Results = como medir. Atingir 70% já é sucesso. OKRs são ambiciosos por definição.</p>
              </div>

              {[
                { okrKey: 'okr1' as const, krKeys: ['kr1a', 'kr1b', 'kr1c'] as const, label: 'Objetivo 1' },
                { okrKey: 'okr2' as const, krKeys: ['kr2a', 'kr2b', 'kr2c'] as const, label: 'Objetivo 2' },
              ].map(({ okrKey, krKeys, label }) => (
                <Section key={okrKey} title={label}>
                  <input
                    value={data[okrKey]}
                    onChange={e => update({ [okrKey]: e.target.value } as Partial<CockpitState>)}
                    placeholder={`${label} — o que quero alcançar...`}
                    className="w-full bg-transparent text-[13px] font-semibold text-white/80 placeholder:text-white/20 outline-none border-b border-white/08 pb-2"
                  />
                  <div className="flex flex-col gap-2 mt-1">
                    {krKeys.map((k, i) => (
                      <div key={k} className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-white/25 w-6">KR{i + 1}</span>
                        <input
                          value={data[k]}
                          onChange={e => update({ [k]: e.target.value } as Partial<CockpitState>)}
                          placeholder="Resultado-chave mensurável..."
                          className="flex-1 bg-transparent text-[12px] text-white/65 placeholder:text-white/20 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </Section>
              ))}

              <Section title="3 Horizontes — distribuição de esforço">
                {[
                  { key: 'h1' as const, label: 'H1 · Core (70%)', hint: 'O que mantém o negócio funcionando hoje...', color: '#1e8449' },
                  { key: 'h2' as const, label: 'H2 · Adjacente (20%)', hint: 'O que está sendo construído para amanhã...', color: '#9a7d0a' },
                  { key: 'h3' as const, label: 'H3 · Disruptivo (10%)', hint: 'O que poderia ser o próximo grande salto...', color: '#c0392b' },
                ].map(h => (
                  <div key={h.key} className="flex gap-2 items-start">
                    <span className="text-[10px] font-mono mt-2 w-20 shrink-0" style={{ color: h.color }}>{h.label}</span>
                    <textarea
                      value={data[h.key]}
                      onChange={e => update({ [h.key]: e.target.value } as Partial<CockpitState>)}
                      placeholder={h.hint}
                      rows={2}
                      className="flex-1 bg-transparent text-[12px] text-white/65 placeholder:text-white/20 resize-none outline-none border-b border-white/05 pb-2"
                    />
                  </div>
                ))}
              </Section>
            </>
          )}

          {/* ── FUNIL ────────────────────────────────── */}
          {tab === 'funil' && (
            <Section title="Funil de Inovação — estágio atual">
              <div className="flex flex-col gap-2">
                {FUNIL_STAGES.map(s => (
                  <button
                    key={s.n}
                    onClick={() => update({ funilStage: s.n })}
                    className="flex items-start gap-3 p-3 rounded-lg text-left transition-all"
                    style={{
                      background: data.funilStage === s.n ? 'rgba(93,173,226,0.12)' : data.funilStage > s.n ? 'rgba(30,132,73,0.06)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${data.funilStage === s.n ? '#5dade2' : data.funilStage > s.n ? 'rgba(30,132,73,0.2)' : 'rgba(255,255,255,0.05)'}`,
                    }}
                  >
                    <span className="text-[11px] font-mono font-bold mt-0.5 w-5" style={{
                      color: data.funilStage === s.n ? '#5dade2' : data.funilStage > s.n ? '#1e8449' : 'rgba(255,255,255,0.2)'
                    }}>
                      {data.funilStage > s.n ? '✓' : s.n}
                    </span>
                    <div>
                      <p className="text-[12px] font-semibold text-white/75">{s.label}</p>
                      <p className="text-[11px] text-white/40 mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Section>
          )}

          {/* ── GOVERNANÇA ───────────────────────────── */}
          {tab === 'gov' && (
            <>
              <Section title="Os 4 pilares da governança digital">
                <div className="flex flex-col gap-2">
                  {GOV_ITEMS.map(g => {
                    const checked = data.governanca[g.id] ?? false
                    return (
                      <button
                        key={g.id}
                        onClick={() => update({ governanca: { ...data.governanca, [g.id]: !checked } })}
                        className="flex items-start gap-3 p-3 rounded-lg text-left transition-all"
                        style={{
                          background: checked ? 'rgba(30,132,73,0.1)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${checked ? 'rgba(30,132,73,0.3)' : 'rgba(255,255,255,0.06)'}`,
                        }}
                      >
                        <span className="text-[14px] mt-0.5">{checked ? '✅' : '⬜'}</span>
                        <div>
                          <p className="text-[12px] font-semibold text-white/75">{g.label}</p>
                          <p className="text-[11px] text-white/40 mt-0.5">{g.desc}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
                <p className="text-[10px] text-white/30 font-mono">
                  {Object.values(data.governanca).filter(Boolean).length}/4 pilares implementados
                </p>
              </Section>

              <div className="rounded-xl p-4" style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.15)' }}>
                <p className="text-[11px] font-semibold text-[#c0392b] mb-1">⚠️ Maior vulnerabilidade de governança</p>
                <p className="text-[11px] text-white/55 leading-relaxed">
                  A maior vulnerabilidade não é técnica — é humana. Concentração de conhecimento em 1 pessoa é risco crítico. Documente processos antes de precisar deles.
                </p>
              </div>
            </>
          )}

          {/* ── NORTE ────────────────────────────────── */}
          {tab === 'norte' && (
            <>
              <div className="rounded-xl p-5" style={{ background: 'rgba(93,173,226,0.06)', border: '1px solid rgba(93,173,226,0.12)' }}>
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#5dade2]/50 mb-3">Onde queremos chegar</p>
                <p className="text-[13px] text-white/70 leading-relaxed">
                  O IPB como o <strong className="text-white/90">sistema operacional de gestão do gestor brasileiro</strong> — o app que qualquer gestor abre toda manhã porque lá está a inteligência que o faz tomar decisão melhor naquele dia.
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  {[
                    { label: 'Fase 3 plena', desc: 'Dados de uso → personalização → melhoria contínua do produto em tempo real.' },
                    { label: 'B2B', desc: 'Empresas compram licenças para times de gestão. Primeiro cliente: meta do H2.' },
                    { label: 'Plataforma de dados', desc: 'Benchmark setorial e ranking de maturidade a partir do comportamento de 10k gestores.' },
                  ].map(item => (
                    <div key={item.label} className="flex gap-3 items-start">
                      <span className="text-[#5dade2] text-[12px] mt-0.5">→</span>
                      <div>
                        <p className="text-[12px] font-semibold text-white/75">{item.label}</p>
                        <p className="text-[11px] text-white/45">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Section title="Notas e reflexões">
                <textarea
                  value={data.notas}
                  onChange={e => update({ notas: e.target.value })}
                  placeholder="Observações do dia, insights, decisões tomadas..."
                  rows={5}
                  className="w-full bg-transparent text-[12px] text-white/65 placeholder:text-white/20 resize-none outline-none leading-relaxed"
                />
              </Section>
            </>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  )
}
