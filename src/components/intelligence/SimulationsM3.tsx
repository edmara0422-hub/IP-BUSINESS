'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Marketing Timeline ────────────────────────────────────────────────────────

const ERAS = [
  {
    period: '1890–1920', name: 'Era da Produção',
    problem: 'Escassez de oferta',
    logic: 'Demanda > Oferta — o problema é produzir',
    items: ['Limitação técnica e logística', 'Consumidor aceita o que está disponível', 'Marketing não é necessário'],
  },
  {
    period: '1920–1930', name: 'Era do Produto',
    problem: 'Competição técnica',
    logic: 'Melhorar qualidade e características',
    items: ['Produtos começam a competir', 'Foco em diferenciação técnica', 'Qualidade como vantagem competitiva'],
  },
  {
    period: '1930–1950', name: 'Era de Vendas',
    problem: 'Excesso de oferta',
    logic: 'Oferta > Demanda — o problema é vender',
    items: ['Necessidade de vender ativamente', 'Técnicas de persuasão e pressão', 'Foco em forçar a transação'],
  },
  {
    period: '1950–1990', name: 'Era do Marketing',
    problem: 'Coordenação de necessidades',
    logic: 'Cliente no centro da estratégia',
    items: ['Segmentação e targeting', 'Mix de marketing — 4Ps', 'Pesquisa de mercado estruturada'],
  },
  {
    period: '1980–2000', name: 'Era do Posicionamento',
    problem: 'Gestão da percepção',
    logic: 'Percepção > Realidade objetiva',
    items: ['Saturação de ofertas similares', 'Batalha pela mente do consumidor', 'Identidade de marca estruturada'],
  },
  {
    period: '1990–2010', name: 'Era do Relacionamento',
    problem: 'Economia da recorrência',
    logic: 'Retenção > Aquisição',
    items: ['CRM e programas de fidelidade', 'Customer Lifetime Value', 'Marketing de relacionamento'],
  },
  {
    period: '2000–2020', name: 'Era Digital',
    problem: 'Escassez de atenção',
    logic: 'Atenção como recurso escasso',
    items: ['Sobrecarga informacional', 'Múltiplos canais simultâneos', 'Fadiga de escolha'],
  },
  {
    period: '2020–ATUAL', name: 'Era da Decisão',
    problem: 'Custo cognitivo e risco decisório',
    logic: 'Marketing como engenharia de decisão',
    items: ['Saturação extrema de ofertas', 'Desconfiança institucional', 'Custo cognitivo elevado'],
  },
]

export function MarketingTimeline() {
  const [active, setActive] = useState(0)

  return (
    <div className="space-y-4">
      {/* Seletor de era */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {ERAS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`shrink-0 rounded-[0.75rem] border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all ${
              active === i
                ? 'border-white/20 bg-white/[0.08] text-white/88'
                : 'border-white/[0.06] text-white/28 hover:text-white/54'
            }`}
          >
            {String(i + 1).padStart(2, '0')}
          </button>
        ))}
      </div>

      {/* Detalhe da era ativa */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">{ERAS[active].period}</p>
              <p className="mt-1 text-[1rem] font-semibold text-white/90">{ERAS[active].name}</p>
            </div>
            <div className="shrink-0 rounded-[0.7rem] border border-white/[0.08] px-3 py-1.5 text-center">
              <p className="text-[8px] uppercase tracking-[0.2em] text-white/28">Era</p>
              <p className="text-[11px] font-bold text-white/56">{String(active + 1).padStart(2, '0')}/08</p>
            </div>
          </div>

          <div className="rounded-[0.9rem] border border-white/[0.06] px-4 py-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-[9px] uppercase tracking-[0.22em] text-white/28 mb-1">Problema Central</p>
            <p className="text-[13px] font-medium text-white/72">{ERAS[active].problem}</p>
            <p className="mt-1 text-[11px] text-white/38">{ERAS[active].logic}</p>
          </div>

          <div className="space-y-2">
            <p className="text-[9px] uppercase tracking-[0.22em] text-white/28">Características</p>
            {ERAS[active].items.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-white/20" />
                <p className="text-[13px] text-white/58">{item}</p>
              </div>
            ))}
          </div>

          {/* Navegação */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setActive(a => Math.max(0, a - 1))}
              disabled={active === 0}
              className="text-[10px] uppercase tracking-[0.18em] text-white/28 transition hover:text-white/56 disabled:opacity-20"
            >
              ← Anterior
            </button>
            <div className="flex gap-1">
              {ERAS.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} className={`h-1 rounded-full transition-all ${i === active ? 'w-4 bg-white/40' : 'w-1 bg-white/12'}`} />
              ))}
            </div>
            <button
              onClick={() => setActive(a => Math.min(ERAS.length - 1, a + 1))}
              disabled={active === ERAS.length - 1}
              className="text-[10px] uppercase tracking-[0.18em] text-white/28 transition hover:text-white/56 disabled:opacity-20"
            >
              Próxima →
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Marketing Definitions ─────────────────────────────────────────────────────

const AUTHORS = [
  {
    name: 'Raimar Richers', year: '1981',
    quote: '"Marketing é a intenção de entender e atender o mercado."',
    core: 'Começa na leitura da realidade, não no produto',
    insight: 'Marketing não começa com criação. Começa com escuta.',
  },
  {
    name: 'Peter Drucker', year: 'séc. XX',
    quote: '"O objetivo do marketing é tornar a venda supérflua."',
    core: 'Decisão preparada antes da transação',
    insight: 'Quando marketing funciona, o cliente já decidiu antes de ser abordado.',
  },
  {
    name: 'Philip Kotler', year: 'contemporâneo',
    quote: '"Processo social pelo qual indivíduos e grupos obtêm o que necessitam por meio da criação, oferta e troca de produtos de valor."',
    core: 'Sistema de troca sob condições de restrição',
    insight: 'Não é persuasão. É viabilização de escolha.',
  },
]

export function MarketingDefinitions() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      <p className="text-[9px] uppercase tracking-[0.28em] text-white/28">Três definições. Um núcleo.</p>

      {AUTHORS.map((a, i) => (
        <motion.div
          key={a.name}
          layout
          onClick={() => setActive(active === i ? null : i)}
          className="cursor-pointer rounded-[1.1rem] border border-white/[0.08] p-4 transition hover:border-white/[0.14]"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/32">{a.year}</p>
              <p className="text-[13px] font-semibold text-white/80">{a.name}</p>
            </div>
            <motion.span animate={{ rotate: active === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-[11px] text-white/28 shrink-0 mt-1">↓</motion.span>
          </div>

          <AnimatePresence>
            {active === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: 'hidden' }}
              >
                <div className="mt-3 space-y-3">
                  <p className="text-[13px] italic leading-relaxed text-white/62">{a.quote}</p>
                  <div className="rounded-[0.8rem] border border-white/[0.06] px-3 py-2.5">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/26">Núcleo</p>
                    <p className="text-[12px] text-white/58 mt-0.5">{a.core}</p>
                  </div>
                  <p className="text-[12px] text-white/42">{a.insight}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* Núcleo comum */}
      <div className="rounded-[1.1rem] border border-white/[0.06] px-4 py-3.5" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <p className="text-[9px] uppercase tracking-[0.24em] text-white/28 mb-2">Núcleo em comum</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {['Troca', 'Valor', 'Escolha', 'Escassez', 'Decisão'].map(tag => (
            <span key={tag} className="rounded-full border border-white/[0.10] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white/50">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-[12px] leading-relaxed text-white/40">
          Independente do autor, o núcleo é sempre o mesmo: organizar trocas sob escassez, reduzindo o custo de decisão do comprador.
        </p>
      </div>
    </div>
  )
}

// ── Value Balance ─────────────────────────────────────────────────────────────

const BENEFITS_DEF = [
  { id: 'funcional', label: 'Funcional', desc: 'Resolve o problema' },
  { id: 'social', label: 'Social', desc: 'Status e aprovação' },
  { id: 'emocional', label: 'Emocional', desc: 'Satisfação e prazer' },
]
const COSTS_DEF = [
  { id: 'dinheiro', label: 'Dinheiro', desc: 'Preço total' },
  { id: 'tempo', label: 'Tempo', desc: 'Espera e esforço' },
  { id: 'risco', label: 'Risco', desc: 'Medo de errar' },
  { id: 'esforco', label: 'Esforço', desc: 'Energia necessária' },
  { id: 'social_c', label: 'Custo Social', desc: 'Risco de julgamento' },
]

export function ValueBalance() {
  const [benefits, setBenefits] = useState<Record<string, number>>({ funcional: 3, social: 2, emocional: 2 })
  const [costs, setCosts] = useState<Record<string, number>>({ dinheiro: 3, tempo: 2, risco: 2, esforco: 2, social_c: 1 })

  const totalB = Object.values(benefits).reduce((a, b) => a + b, 0)
  const totalC = Object.values(costs).reduce((a, b) => a + b, 0)
  const maxB = BENEFITS_DEF.length * 5
  const maxC = COSTS_DEF.length * 5
  const normB = totalB / maxB
  const normC = totalC / maxC
  const delta = normB - normC
  const approved = delta >= 0
  const zone = Math.abs(delta) < 0.06

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Benefícios */}
        <div className="space-y-3">
          <p className="text-[9px] uppercase tracking-[0.24em] text-white/28">Benefício Percebido</p>
          {BENEFITS_DEF.map((b) => (
            <div key={b.id}>
              <div className="flex justify-between mb-1">
                <p className="text-[10px] text-white/52">{b.label}</p>
                <p className="text-[10px] font-mono text-white/32">{benefits[b.id]}</p>
              </div>
              <input
                type="range" min={0} max={5} value={benefits[b.id]}
                onChange={(e) => setBenefits(p => ({ ...p, [b.id]: Number(e.target.value) }))}
                className="w-full h-1 accent-white/60"
              />
            </div>
          ))}
        </div>

        {/* Custos */}
        <div className="space-y-3">
          <p className="text-[9px] uppercase tracking-[0.24em] text-white/28">Custo Percebido</p>
          {COSTS_DEF.map((c) => (
            <div key={c.id}>
              <div className="flex justify-between mb-1">
                <p className="text-[10px] text-white/52">{c.label}</p>
                <p className="text-[10px] font-mono text-white/32">{costs[c.id]}</p>
              </div>
              <input
                type="range" min={0} max={5} value={costs[c.id]}
                onChange={(e) => setCosts(p => ({ ...p, [c.id]: Number(e.target.value) }))}
                className="w-full h-1 accent-white/60"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Resultado */}
      <div className="rounded-[1.1rem] border border-white/[0.08] p-4 space-y-3">
        {/* Barra */}
        <div className="relative h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: approved ? '#1e8449' : '#c0392b' }}
            animate={{ width: `${(normB / (normB + normC || 1)) * 100}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>
        <div className="flex justify-between text-[9px] uppercase tracking-[0.14em] text-white/26">
          <span>Benefício {Math.round(normB * 100)}%</span>
          <span>Custo {Math.round(normC * 100)}%</span>
        </div>
        <motion.div
          animate={{ borderColor: zone ? 'rgba(154,125,10,0.3)' : approved ? 'rgba(30,132,73,0.3)' : 'rgba(192,57,43,0.3)' }}
          className="rounded-[0.8rem] border px-3 py-2.5 text-center"
        >
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/28">O cérebro decide</p>
          <p
            className="text-[13px] font-semibold mt-0.5"
            style={{ color: zone ? '#9a7d0a' : approved ? '#1e8449' : '#c0392b' }}
          >
            {zone ? 'Zona de indecisão — qualquer fator vira o jogo' : approved ? 'Aprovado — vale a troca' : 'Rejeitado — custo supera benefício'}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

// ── Need / Desire / Demand ────────────────────────────────────────────────────

const SCENARIOS = [
  {
    id: 's1',
    situation: 'Uma pessoa está com fome há 8 horas.',
    answer: 'necessidade',
    explanation: 'Fome é uma carência humana básica, fisiológica e independente de cultura. É necessidade pura — existiria em qualquer época ou sociedade.',
  },
  {
    id: 's2',
    situation: 'Ela quer especificamente uma pizza margherita de uma marca italiana específica.',
    answer: 'desejo',
    explanation: 'A necessidade (fome) existe, mas a forma culturalmente específica de satisfazê-la é desejo. Pizza margherita de marca específica é aprendido culturalmente.',
  },
  {
    id: 's3',
    situation: 'Ela tem R$80, a pizza custa R$65 e o delivery está disponível agora.',
    answer: 'demanda',
    explanation: 'Necessidade (fome) + Desejo (pizza específica) + Capacidade real de troca (dinheiro + disponibilidade) = Demanda. O que o mercado efetivamente realiza.',
  },
  {
    id: 's4',
    situation: 'Um empreendedor quer um carro de R$400k, mas tem R$15k de dívidas e fatura R$8k/mês.',
    answer: 'desejo',
    explanation: 'Há desejo, mas não existe capacidade real de troca. Sem demanda, a transação não se realiza. Falar com desejo sem entender demanda real é erro estratégico.',
  },
]

const OPTIONS = ['necessidade', 'desejo', 'demanda']

export function NeedDesireDemand() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  function answer(sid: string, opt: string) {
    if (revealed[sid]) return
    setAnswers(p => ({ ...p, [sid]: opt }))
    setRevealed(p => ({ ...p, [sid]: true }))
  }

  const correct = SCENARIOS.filter(s => answers[s.id] === s.answer).length
  const done = Object.keys(revealed).length === SCENARIOS.length

  return (
    <div className="space-y-4">
      <p className="text-[9px] uppercase tracking-[0.28em] text-white/28">Identifique cada cenário</p>

      {SCENARIOS.map((scenario, i) => {
        const isRevealed = revealed[scenario.id]
        const isCorrect = answers[scenario.id] === scenario.answer

        return (
          <div key={scenario.id} className="rounded-[1.1rem] border border-white/[0.08] p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.015)' }}>
            <div className="flex items-start gap-3">
              <span className="shrink-0 font-mono text-[9px] text-white/22 mt-0.5">#{String(i + 1).padStart(2, '0')}</span>
              <p className="text-[13px] leading-relaxed text-white/68">{scenario.situation}</p>
            </div>

            {!isRevealed ? (
              <div className="flex gap-2">
                {OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => answer(scenario.id, opt)}
                    className="flex-1 rounded-[0.7rem] border border-white/[0.08] py-2 text-[10px] uppercase tracking-[0.14em] text-white/38 transition hover:border-white/20 hover:text-white/70"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span style={{ color: isCorrect ? '#1e8449' : '#c0392b' }}>{isCorrect ? '✓' : '✗'}</span>
                  <p className="text-[11px] font-medium" style={{ color: isCorrect ? '#1e8449' : '#c0392b' }}>
                    {isCorrect ? 'Correto' : `Incorreto — é ${scenario.answer}`}
                  </p>
                </div>
                <p className="text-[12px] leading-relaxed text-white/44">{scenario.explanation}</p>
              </motion.div>
            )}
          </div>
        )
      })}

      {done && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.1rem] border border-white/[0.08] px-4 py-3 text-center">
          <p className="text-[9px] uppercase tracking-[0.24em] text-white/28">Resultado</p>
          <p className="mt-1 text-[20px] font-semibold text-white/80">{correct}/{SCENARIOS.length}</p>
          <p className="text-[11px] text-white/36 mt-0.5">
            {correct === SCENARIOS.length ? 'Domínio completo da tríade.' : 'Revise os cenários incorretos — a distinção é estratégica.'}
          </p>
        </motion.div>
      )}
    </div>
  )
}

// ── Innovation Types ──────────────────────────────────────────────────────────

const INOV_EXAMPLES = [
  { label: 'iPhone (2007)', correct: 'disruptiva', options: ['incremental', 'radical', 'disruptiva'], hint: 'Redefiniu mercados inteiros — celular, câmera, GPS, player de música — em um único produto.' },
  { label: 'AirPods Pro (versão com cancelamento de ruído)', correct: 'incremental', options: ['incremental', 'radical', 'disruptiva'], hint: 'Melhoria significativa sobre versão anterior, dentro do mesmo produto e mercado.' },
  { label: 'Uber (surgimento do ride-hailing)', correct: 'disruptiva', options: ['incremental', 'radical', 'disruptiva'], hint: 'Não inventou o transporte — reinventou o modelo de negócio e deslocou um mercado inteiro.' },
  { label: 'Motor a jato de aviação (anos 1940)', correct: 'radical', options: ['incremental', 'radical', 'disruptiva'], hint: 'Ruptura tecnológica dentro do setor existente — substitui tecnologia anterior de forma definitiva.' },
  { label: 'Nubank (banco digital brasileiro)', correct: 'disruptiva', options: ['incremental', 'radical', 'disruptiva'], hint: 'Entrou por baixo (público desbancarizado/descontente) com custo radicalmente menor, depois subiu.' },
  { label: 'Novo modelo de ERP com IA integrada', correct: 'incremental', options: ['incremental', 'radical', 'disruptiva'], hint: 'Adição de funcionalidade relevante em produto existente para mercado existente.' },
]

export function InnovationTypes() {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})
  const [showDef, setShowDef] = useState(false)

  function answer(i: number, opt: string) {
    if (revealed[i]) return
    setAnswers(p => ({ ...p, [i]: opt }))
    setRevealed(p => ({ ...p, [i]: true }))
  }

  const correct = INOV_EXAMPLES.filter((ex, i) => answers[i] === ex.correct).length
  const done = Object.keys(revealed).length === INOV_EXAMPLES.length

  const COLORS: Record<string, string> = { incremental: '#9a7d0a', radical: '#1e5fa0', disruptiva: '#7d1e1e' }

  return (
    <div className="space-y-4">
      <button onClick={() => setShowDef(p => !p)} className="text-[9px] uppercase tracking-[0.24em] text-white/36 transition hover:text-white/60">
        {showDef ? '↑ Ocultar definições' : '↓ Ver definições antes de responder'}
      </button>

      <AnimatePresence>
        {showDef && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            <div className="grid grid-cols-3 gap-2 pb-2">
              {[
                { type: 'incremental', desc: 'Melhoria contínua de produto/processo existente. Mesmo mercado, mesma tecnologia base.', color: '#9a7d0a' },
                { type: 'radical', desc: 'Ruptura tecnológica profunda. Substitui tecnologia anterior. Mesmo mercado ou setor.', color: '#1e5fa0' },
                { type: 'disruptiva', desc: 'Transforma mercado existente ou cria um novo, geralmente entrando por baixo com modelo diferente.', color: '#7d1e1e' },
              ].map(d => (
                <div key={d.type} className="rounded-[0.8rem] border border-white/[0.06] p-3" style={{ background: 'rgba(255,255,255,0.015)' }}>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] mb-1" style={{ color: d.color }}>{d.type}</p>
                  <p className="text-[11px] leading-relaxed text-white/48">{d.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-[9px] uppercase tracking-[0.28em] text-white/28">Classifique cada exemplo</p>

      {INOV_EXAMPLES.map((ex, i) => {
        const isRevealed = revealed[i]
        const isCorrect = answers[i] === ex.correct
        return (
          <div key={i} className="rounded-[1.1rem] border border-white/[0.08] p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.015)' }}>
            <div className="flex items-start gap-3">
              <span className="font-mono text-[9px] text-white/22 mt-0.5">#{String(i + 1).padStart(2, '0')}</span>
              <p className="text-[13px] font-medium text-white/72">{ex.label}</p>
            </div>
            {!isRevealed ? (
              <div className="flex gap-2">
                {ex.options.map(opt => (
                  <button key={opt} onClick={() => answer(i, opt)}
                    className="flex-1 rounded-[0.7rem] border border-white/[0.08] py-2 text-[10px] uppercase tracking-[0.14em] text-white/38 transition hover:border-white/20 hover:text-white/70">
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span style={{ color: isCorrect ? '#1e8449' : '#c0392b' }}>{isCorrect ? '✓' : '✗'}</span>
                  <p className="text-[11px] font-medium" style={{ color: isCorrect ? '#1e8449' : '#c0392b' }}>
                    {isCorrect ? 'Correto' : `Incorreto — é ${ex.correct}`}
                  </p>
                  <span className="ml-auto rounded-full px-2 py-0.5 text-[9px] uppercase tracking-[0.14em]" style={{ background: COLORS[ex.correct] + '33', color: COLORS[ex.correct] }}>
                    {ex.correct}
                  </span>
                </div>
                <p className="text-[12px] leading-relaxed text-white/44">{ex.hint}</p>
              </motion.div>
            )}
          </div>
        )
      })}

      {done && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.1rem] border border-white/[0.08] px-4 py-3 text-center">
          <p className="text-[9px] uppercase tracking-[0.24em] text-white/28">Resultado</p>
          <p className="mt-1 text-[20px] font-semibold text-white/80">{correct}/{INOV_EXAMPLES.length}</p>
          <p className="text-[11px] text-white/36 mt-0.5">
            {correct === INOV_EXAMPLES.length ? 'Domínio completo da taxonomia.' : 'Revise as definições e tente novamente — a distinção é estratégica.'}
          </p>
        </motion.div>
      )}
    </div>
  )
}

// ── Digital Maturity Radar ────────────────────────────────────────────────────

const MATURITY_DIMS = [
  { id: 'estrategia', label: 'Estratégia Digital', desc: 'Visão clara de transformação e liderança comprometida' },
  { id: 'dados', label: 'Cultura de Dados', desc: 'Decisões baseadas em dados, não intuição' },
  { id: 'processos', label: 'Processos Digitais', desc: 'Automação e integração de fluxos operacionais' },
  { id: 'cliente', label: 'Experiência do Cliente', desc: 'Digital e físico integrados — omnichannel' },
  { id: 'talento', label: 'Talento Digital', desc: 'Equipe com competências digitais e mindset ágil' },
  { id: 'tecnologia', label: 'Tecnologia & Infraestrutura', desc: 'Plataformas, APIs, cloud e segurança' },
]

const MATURITY_LEVELS = [
  { score: 1, label: 'Inicial', color: '#c0392b' },
  { score: 2, label: 'Emergente', color: '#9a7d0a' },
  { score: 3, label: 'Estruturado', color: '#1e5fa0' },
  { score: 4, label: 'Integrado', color: '#1e8449' },
  { score: 5, label: 'Otimizado', color: '#6b3fa0' },
]

export function DigitalMaturityRadar() {
  const [scores, setScores] = useState<Record<string, number>>({ estrategia: 2, dados: 2, processos: 2, cliente: 2, talento: 2, tecnologia: 2 })

  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / MATURITY_DIMS.length
  const level = MATURITY_LEVELS[Math.min(Math.round(avg) - 1, 4)]

  return (
    <div className="space-y-4">
      <p className="text-[9px] uppercase tracking-[0.28em] text-white/28">Avalie a maturidade digital da sua empresa</p>

      <div className="space-y-3">
        {MATURITY_DIMS.map((dim) => (
          <div key={dim.id}>
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-[12px] text-white/68">{dim.label}</p>
                <p className="text-[10px] text-white/32">{dim.desc}</p>
              </div>
              <span className="ml-3 shrink-0 font-mono text-[11px] text-white/40">{scores[dim.id]}/5</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(v => (
                <button key={v} onClick={() => setScores(p => ({ ...p, [dim.id]: v }))}
                  className="flex-1 h-2 rounded-full transition-all"
                  style={{ background: v <= scores[dim.id] ? (MATURITY_LEVELS[v - 1]?.color + 'cc') : 'rgba(255,255,255,0.08)' }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <motion.div
        animate={{ borderColor: level?.color + '44' }}
        className="rounded-[1.1rem] border px-4 py-3"
        style={{ background: 'rgba(255,255,255,0.015)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/28">Maturidade Digital</p>
            <p className="text-[15px] font-semibold mt-0.5" style={{ color: level?.color }}>{level?.label}</p>
          </div>
          <p className="text-[22px] font-bold text-white/60">{avg.toFixed(1)}</p>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ background: level?.color }}
            animate={{ width: `${(avg / 5) * 100}%` }} transition={{ duration: 0.4 }} />
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-white/36">
          {avg < 2 ? 'Urgente: digitalização ainda não é prioridade estrutural.' :
            avg < 3 ? 'Iniciativas isoladas — falta integração e visão sistêmica.' :
              avg < 4 ? 'Base sólida. O próximo passo é integração entre dimensões.' :
                avg < 4.5 ? 'Maturidade avançada — otimizar e inovar continuamente.' :
                  'Referência de excelência digital no seu setor.'}
        </p>
      </motion.div>
    </div>
  )
}

// ── Export map ────────────────────────────────────────────────────────────────

export const SIM_COMPONENTS: Record<string, React.ComponentType> = {
  'marketing-timeline': MarketingTimeline,
  'marketing-definitions': MarketingDefinitions,
  'value-balance': ValueBalance,
  'need-desire-demand': NeedDesireDemand,
  'innovation-types': InnovationTypes,
  'digital-maturity': DigitalMaturityRadar,
}
