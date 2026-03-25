'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Argument Builder (Toulmin) ──────────────────────────────────────────────

const ARG_SCENARIOS = [
  {
    title: 'Expansão para o Nordeste',
    context: 'Sua rede de academias (15 unidades em SP) está avaliando abrir 5 unidades no Nordeste. O board quer um business case.',
    hints: { claim: 'Abrir 5 academias no Nordeste em 18 meses', data: 'Mercado fitness nordestino cresceu 22%/ano (ABF 2024). Renda média subiu 18% em 3 anos. Zero concorrente premium na região-alvo.', warrant: 'Mercado em crescimento + ausência de competidor premium = janela de oportunidade. Nosso modelo comprovado em SP é replicável.', backing: '3 das 5 maiores redes do Brasil já anunciaram planos de expansão nordestina. First-mover vantage estimado em 2 anos.', qualifier: 'Com alta probabilidade de sucesso nas capitais. Interior exige estudo adicional.', rebuttal: 'Risco: custo de operação remota + adaptação cultural. Mitigação: parceria com operador local e 6 meses de piloto em Recife antes de escalar.' },
  },
  {
    title: 'Migrar para Modelo de Assinatura',
    context: 'Sua empresa de software vende licenças perpétuas (R$ 5K/unidade). O CFO propõe migrar para SaaS (R$ 199/mês). O CEO está receoso.',
    hints: { claim: 'Migrar de licença perpétua para SaaS em 12 meses', data: 'Empresas SaaS têm valuation 8x receita vs 2x para licença. Churn estimado de 3%/mês. Break-even do switch em 18 meses. 73% dos clientes preferem assinatura (pesquisa interna).', warrant: 'Receita recorrente é mais previsível, aumenta valuation e facilita captação. Clientes preferem OPEX a CAPEX.', backing: 'Adobe migrou para SaaS em 2013 — receita triplicou em 5 anos. Mercado SaaS brasileiro cresce 30%/ano.', qualifier: 'Viável para clientes enterprise. PMEs podem resistir inicialmente.', rebuttal: 'Risco: queda de receita nos primeiros 12-18 meses (cash dip). Mitigação: manter licença perpétua como opção premium (+40%) durante transição de 24 meses.' },
  },
  {
    title: 'Implementar IA no Atendimento',
    context: 'Sua empresa recebe 15.000 tickets/mês de suporte. Time de 25 atendentes. Proposta: chatbot IA para resolver tier 1.',
    hints: { claim: 'Implementar chatbot IA para resolver 60% dos tickets tier 1 em 6 meses', data: 'Análise de 6 meses de tickets: 62% são perguntas repetitivas (status de pedido, reset de senha, FAQ). Custo atual: R$ 45/ticket humano. Benchmark do setor: chatbots resolvem 55-70% de tier 1 com CSAT de 78%.', warrant: 'Automatizar tickets repetitivos libera humanos para casos complexos, reduz custo por ticket em 80% e melhora tempo de resposta de 4h para 30s.', backing: 'Zendesk report 2024: empresas com IA no atendimento reduziram custo operacional em 35% e NPS subiu 12 pontos (humanos focados em problemas reais).', qualifier: 'Para tickets tier 1 com padrão claro. Casos complexos, reclamações e escalações continuam 100% humanos.', rebuttal: 'Risco: CSAT pode cair se chatbot for mal implementado. Mitigação: 30 dias de shadow mode (IA sugere, humano executa), threshold de confiança de 85%, fallback imediato para humano.' },
  },
  {
    title: 'Cortar Programa de Trainee',
    context: 'Em reunião de corte de custos, o CFO propõe eliminar o programa de trainee (R$ 1.2M/ano). Você discorda.',
    hints: { claim: 'Manter o programa de trainee com ajustes de escopo', data: '38% dos gerentes atuais vieram do programa. Custo por trainee: R$ 60K/ano. Custo de contratar gerente externo: R$ 180K (headhunter + onboarding + risco). Taxa de retenção de trainees: 72% após 3 anos vs 45% de contratações externas.', warrant: 'O programa é pipeline de liderança. Cortar economiza R$ 1.2M/ano mas custa R$ 3M+ em contratação externa e perda de cultura em 3-5 anos.', backing: 'P&G, Ambev e Itaú mantêm programas de trainee há 30+ anos — consideram o principal diferencial competitivo em formação de liderança.', qualifier: 'O programa atual pode ser otimizado — reduzir de 20 para 12 trainees e focar em áreas críticas.', rebuttal: 'Contra-argumento do CFO: "R$ 1.2M é 15% do budget de RH." Resposta: cortar 40% do programa (8 vagas) economiza R$ 480K mantendo o pipeline. O custo de NÃO ter líderes formados internamente é invisível hoje mas catastrófico em 5 anos.' },
  },
]

const TOULMIN_PARTS = [
  { key: 'claim', label: 'Tese (Claim)', desc: 'O que você defende', color: '#4ade80' },
  { key: 'data', label: 'Dados (Data)', desc: 'Evidências que sustentam', color: '#60a5fa' },
  { key: 'warrant', label: 'Justificativa (Warrant)', desc: 'Lógica que conecta dados à tese', color: '#f59e0b' },
  { key: 'backing', label: 'Suporte (Backing)', desc: 'Evidência adicional', color: '#a78bfa' },
  { key: 'qualifier', label: 'Qualificador', desc: 'Grau de certeza', color: '#22d3ee' },
  { key: 'rebuttal', label: 'Contra-argumento', desc: 'Objeções e respostas', color: '#f43f5e' },
]

export function ArgumentBuilder() {
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  const scenario = ARG_SCENARIOS[idx]

  const partKey = (part: string) => `${idx}-${part}`
  const togglePart = (part: string) => setRevealed(prev => ({ ...prev, [partKey(part)]: !prev[partKey(part)] }))

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {ARG_SCENARIOS.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`shrink-0 rounded-[0.75rem] border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all ${
              idx === i ? 'border-white/20 bg-white/[0.08] text-white/88' : 'border-white/[0.06] text-white/28 hover:text-white/54'
            }`}>{String(i + 1).padStart(2, '0')}</button>
        ))}
      </div>

      <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/28">Business Case {idx + 1}</p>
          <p className="mt-1 text-[1rem] font-semibold text-white/90">{scenario.title}</p>
          <p className="mt-2 text-[13px] text-white/50 leading-relaxed">{scenario.context}</p>
        </div>

        <p className="text-[9px] uppercase tracking-[0.22em] text-white/28">Construa o argumento — clique para revelar cada elemento</p>

        <div className="space-y-2">
          {TOULMIN_PARTS.map(part => {
            const isOpen = revealed[partKey(part.key)] || false
            const hint = scenario.hints[part.key as keyof typeof scenario.hints]
            return (
              <motion.div key={part.key} layout className="rounded-[0.9rem] border border-white/[0.06] overflow-hidden" style={{ background: 'rgba(255,255,255,0.015)' }}>
                <button onClick={() => togglePart(part.key)} className="w-full px-4 py-3 flex items-center justify-between text-left">
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 h-2 w-2 rounded-full" style={{ background: part.color }} />
                    <div>
                      <p className="text-[12px] font-medium text-white/72">{part.label}</p>
                      <p className="text-[9px] text-white/28">{part.desc}</p>
                    </div>
                  </div>
                  <span className="text-white/28 text-[12px]">{isOpen ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 overflow-hidden">
                      <div className="rounded-[0.6rem] border px-3 py-2" style={{ borderColor: `${part.color}22`, background: `${part.color}08` }}>
                        <p className="text-[12px] text-white/56 leading-relaxed">{hint}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">← Anterior</button>
        <button onClick={() => setIdx(i => Math.min(ARG_SCENARIOS.length - 1, i + 1))} disabled={idx === ARG_SCENARIOS.length - 1}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">Próximo →</button>
      </div>
    </div>
  )
}

// ── Lean Canvas ─────────────────────────────────────────────────────────────

const CANVAS_BLOCKS = [
  { key: 'problem', label: 'Problema', desc: 'Top 3 problemas do cliente', row: 1, col: 1, color: '#ef4444' },
  { key: 'solution', label: 'Solução', desc: 'Top 3 soluções propostas', row: 1, col: 2, color: '#4ade80' },
  { key: 'uvp', label: 'Proposta de Valor Única', desc: 'Frase única que diferencia', row: 1, col: 3, color: '#f59e0b' },
  { key: 'advantage', label: 'Vantagem Injusta', desc: 'O que não pode ser copiado', row: 1, col: 4, color: '#a78bfa' },
  { key: 'segments', label: 'Segmentos de Clientes', desc: 'Quem são os early adopters?', row: 1, col: 5, color: '#60a5fa' },
  { key: 'metrics', label: 'Métricas-Chave', desc: 'KPIs que provam tração', row: 2, col: 1, color: '#22d3ee' },
  { key: 'channels', label: 'Canais', desc: 'Como alcançar clientes', row: 2, col: 2, color: '#fb923c' },
  { key: 'costs', label: 'Estrutura de Custos', desc: 'Custos fixos e variáveis', row: 3, col: 1, color: '#f43f5e' },
  { key: 'revenue', label: 'Fontes de Receita', desc: 'Como o dinheiro entra', row: 3, col: 2, color: '#4ade80' },
]

const CANVAS_EXAMPLES = [
  {
    name: 'App de Saúde Mental Corporativo',
    data: {
      problem: '1. Burnout atinge 44% dos trabalhadores brasileiros\n2. Empresas perdem R$ 200B/ano com afastamentos por saúde mental\n3. Planos de saúde não cobrem terapia preventiva',
      solution: '1. Sessões de terapia online via app (15 min/dia)\n2. Monitoramento de bem-estar com IA\n3. Dashboard para RH com métricas anônimas de saúde organizacional',
      uvp: 'Reduza afastamentos por burnout em 40% com terapia preventiva integrada ao dia de trabalho',
      advantage: 'Base de dados proprietária de 500K sessões que treina IA para intervenção precoce. Rede de 2.000 psicólogos credenciados.',
      segments: 'Early adopters: RHs de empresas tech (200-1000 funcionários) que já medem eNPS e investem em employer branding',
      metrics: 'NPS > 50, retenção D30 > 60%, redução de afastamentos > 25% em 6 meses, LTV/CAC > 4x',
      channels: 'Venda consultiva B2B (inside sales), eventos de RH, parcerias com consultorias de benefícios, LinkedIn thought leadership',
      costs: 'Fixo: R$ 180K/mês (tech + psicólogos + vendas). Variável: R$ 8/sessão para psicólogo. Break-even: 150 empresas.',
      revenue: 'Assinatura por funcionário: R$ 29/mês. Ticket médio empresa: R$ 8.700/mês. Upsell: workshops presenciais R$ 5K/evento.',
    },
  },
  {
    name: 'Marketplace de Manutenção Predial',
    data: {
      problem: '1. Síndicos não sabem avaliar orçamentos de manutenção\n2. 70% dos prestadores não cumprem prazo\n3. Falta transparência nos custos (superfaturamento)',
      solution: '1. Marketplace com prestadores avaliados e verificados\n2. Orçamento comparativo automático (mínimo 3 propostas)\n3. Acompanhamento em tempo real + pagamento pós-conclusão',
      uvp: 'O iFood da manutenção predial — 3 orçamentos em 24h, prestadores verificados, pagamento só depois de aprovado',
      advantage: 'Network effect: mais condomínios atraem mais prestadores → mais prestadores melhoram preço → mais condomínios aderem. Base de 8.000 avaliações.',
      segments: 'Early adopters: administradoras de condomínios em capitais (gerenciam 50+ prédios). Síndicos profissionais.',
      metrics: 'GMV, take rate (15%), NPS condômino > 60, NPS prestador > 50, tempo médio para 3 orçamentos < 24h',
      channels: 'Parceria com administradoras (canal indireto), Google Ads "manutenção predial", eventos de síndicos, indicação entre condomínios',
      costs: 'Fixo: R$ 95K/mês (tech + comercial + suporte). Variável: R$ 12/transação (verificação + pagamento). Break-even: GMV R$ 800K/mês.',
      revenue: 'Take rate 15% sobre serviço. Destaque premium para prestadores: R$ 199/mês. Seguro garantia opcional: 3% do serviço.',
    },
  },
]

export function LeanCanvas() {
  const [exIdx, setExIdx] = useState(0)
  const [activeBlock, setActiveBlock] = useState<string | null>(null)

  const example = CANVAS_EXAMPLES[exIdx]

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {CANVAS_EXAMPLES.map((e, i) => (
          <button key={i} onClick={() => { setExIdx(i); setActiveBlock(null) }}
            className={`flex-1 rounded-[0.75rem] border px-2 py-2 text-[10px] font-semibold text-center transition-all ${
              exIdx === i ? 'border-white/20 bg-white/[0.08] text-white/88' : 'border-white/[0.06] text-white/28'
            }`}>{e.name.split(' ').slice(0, 3).join(' ')}</button>
        ))}
      </div>

      <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <p className="text-[1rem] font-semibold text-white/90">{example.name}</p>

        {/* Canvas grid */}
        <div className="grid grid-cols-2 gap-1.5">
          {CANVAS_BLOCKS.map(block => {
            const isActive = activeBlock === block.key
            const content = example.data[block.key as keyof typeof example.data]
            return (
              <motion.button key={block.key} onClick={() => setActiveBlock(isActive ? null : block.key)}
                className={`rounded-[0.7rem] border px-3 py-2.5 text-left transition-all ${
                  isActive ? 'border-white/20 bg-white/[0.06]' : 'border-white/[0.06] hover:border-white/12'
                }`}
                layout>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: block.color }} />
                  <p className="text-[10px] font-semibold text-white/60">{block.label}</p>
                </div>
                {!isActive && <p className="text-[8px] text-white/24 mt-0.5 ml-3.5">{block.desc}</p>}
              </motion.button>
            )
          })}
        </div>

        {/* Expanded content */}
        <AnimatePresence mode="wait">
          {activeBlock && (
            <motion.div key={activeBlock} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="rounded-[0.9rem] border border-white/[0.08] p-4" style={{ background: 'rgba(255,255,255,0.025)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full" style={{ background: CANVAS_BLOCKS.find(b => b.key === activeBlock)?.color }} />
                <p className="text-[11px] font-bold text-white/72">{CANVAS_BLOCKS.find(b => b.key === activeBlock)?.label}</p>
              </div>
              <p className="text-[12px] text-white/56 leading-relaxed whitespace-pre-line">
                {example.data[activeBlock as keyof typeof example.data]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Macro Scenario ──────────────────────────────────────────────────────────

const MACRO_SCENARIOS = [
  {
    phase: 'Expansão',
    year: '2019 (pré-COVID)',
    indicators: {
      pib: { value: '+1.2%', trend: 'Crescendo lentamente' },
      selic: { value: '4.5%', trend: 'Mínima histórica' },
      ipca: { value: '4.3%', trend: 'Dentro da meta' },
      cambio: { value: 'R$ 4.03', trend: 'Estável' },
      desemprego: { value: '11.9%', trend: 'Caindo devagar' },
      confianca: { value: '97 (neutra)', trend: 'Melhorando' },
    },
    decisions: [
      { action: 'Tomar empréstimo para expandir', answer: 'good', why: 'Selic em mínima histórica = custo de capital baixo. Momento ideal para financiar expansão. Crédito barato não dura para sempre.' },
      { action: 'Manter caixa alto e não investir', answer: 'bad', why: 'Com Selic a 4.5%, dinheiro parado rende quase nada. Concorrentes que investiram agora ganham market share. Custo de oportunidade alto.' },
      { action: 'Contratar agressivamente', answer: 'neutral', why: 'Desemprego alto (11.9%) significa talento disponível a custo razoável. Mas PIB de 1.2% ainda é fraco — contrate para posições estratégicas, não em massa.' },
    ],
  },
  {
    phase: 'Choque (Recessão)',
    year: '2020 (COVID)',
    indicators: {
      pib: { value: '-3.9%', trend: 'Queda brusca' },
      selic: { value: '2.0%', trend: 'Emergencial' },
      ipca: { value: '4.5%', trend: 'Subindo' },
      cambio: { value: 'R$ 5.35', trend: 'Disparou (+33%)' },
      desemprego: { value: '14.7%', trend: 'Disparando' },
      confianca: { value: '58 (pânico)', trend: 'Colapsou' },
    },
    decisions: [
      { action: 'Cortar 40% do quadro imediatamente', answer: 'bad', why: 'Corte massivo destrói capacidade operacional e moral. Quando a economia voltar (e voltará), recontratar custa 3x mais. Melhor: reduzir jornada, negociar férias coletivas, renegociar contratos.' },
      { action: 'Renegociar todos os contratos (aluguel, fornecedores)', answer: 'good', why: 'Na crise, todos querem manter clientes. Locadores preferem reduzir aluguel a ter imóvel vazio. Fornecedores preferem vender com margem menor a perder cliente. Janela de negociação única.' },
      { action: 'Comprar concorrente fragilizado', answer: 'good', why: '"Seja ganancioso quando outros têm medo" (Buffett). Empresas boas a preço de liquidação. Quem tem caixa na crise compra market share a desconto. Magazine Luiza comprou Netshoes na crise por fração do valor.' },
    ],
  },
  {
    phase: 'Pico Inflacionário',
    year: '2022',
    indicators: {
      pib: { value: '+2.9%', trend: 'Recuperação' },
      selic: { value: '13.75%', trend: 'Ciclo de alta agressivo' },
      ipca: { value: '5.8%', trend: 'Acima da meta' },
      cambio: { value: 'R$ 5.22', trend: 'Volátil' },
      desemprego: { value: '9.3%', trend: 'Melhorando' },
      confianca: { value: '83 (cautelosa)', trend: 'Incerta' },
    },
    decisions: [
      { action: 'Repassar 100% da inflação ao preço', answer: 'neutral', why: 'Depende da elasticidade. Produtos inelásticos (necessidades): repasse funciona. Produtos elásticos (luxo, opcionais): repasse = perda de clientes. Melhor: absorver parte e repassar parte, comunicando com transparência.' },
      { action: 'Trocar dívida pós-fixada por pré-fixada', answer: 'good', why: 'Com Selic a 13.75%, dívida pós-fixada (CDI+spread) está caríssima. Se o ciclo está no pico, Selic vai cair. Travar taxa pré-fixada agora protege contra o custo atual e permite planejar.' },
      { action: 'Investir em marketing de aquisição', answer: 'bad', why: 'CAC sobe quando todos competem e consumidor está cauteloso. Foco em retenção tem ROI 5-7x maior que aquisição em ambiente de juros altos. Invista nos clientes que já tem.' },
    ],
  },
  {
    phase: 'Estabilização',
    year: '2025',
    indicators: {
      pib: { value: '+2.1%', trend: 'Crescimento moderado' },
      selic: { value: '13.25%', trend: 'Ainda alta, início de queda' },
      ipca: { value: '4.5%', trend: 'Convergindo para meta' },
      cambio: { value: 'R$ 5.80', trend: 'Real desvalorizado' },
      desemprego: { value: '6.5%', trend: 'Próximo ao pleno emprego' },
      confianca: { value: '92 (moderada)', trend: 'Cautelosamente otimista' },
    },
    decisions: [
      { action: 'Começar a investir em expansão', answer: 'good', why: 'Selic começando a cair = custo de capital diminuindo. Desemprego baixo = economia aquecida. Quem se posiciona na estabilização colhe na expansão. Momento de planejar e iniciar, não de esperar.' },
      { action: 'Focar em exportação aproveitando câmbio', answer: 'good', why: 'Real a R$ 5.80 torna produtos brasileiros competitivos internacionalmente. Se sua operação é em reais e receita em dólar, a margem aumenta automaticamente. Janela cambial.' },
      { action: 'Aumentar quadro em 50%', answer: 'bad', why: 'Desemprego de 6.5% significa guerra por talentos = salários subindo. Contratar em massa agora é caro. Melhor: contratar cirurgicamente para posições-chave e investir em produtividade (automação, IA) para as demais.' },
    ],
  },
]

const DECISION_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  good: { bg: 'rgba(34,197,94,0.04)', border: 'border-green-500/20', text: '#4ade80' },
  bad: { bg: 'rgba(239,68,68,0.04)', border: 'border-red-500/20', text: '#ef4444' },
  neutral: { bg: 'rgba(245,158,11,0.04)', border: 'border-amber-500/20', text: '#f59e0b' },
}

const DECISION_LABELS: Record<string, string> = { good: 'Boa decisão', bad: 'Decisão arriscada', neutral: 'Depende do contexto' }

export function MacroScenario() {
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  const scenario = MACRO_SCENARIOS[idx]
  const dKey = (di: number) => `${idx}-${di}`

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {MACRO_SCENARIOS.map((s, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`shrink-0 rounded-[0.75rem] border px-3 py-2 text-[10px] font-semibold transition-all ${
              idx === i ? 'border-white/20 bg-white/[0.08] text-white/88' : 'border-white/[0.06] text-white/28 hover:text-white/54'
            }`}>{s.phase}</button>
        ))}
      </div>

      <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/28">{scenario.year}</p>
            <p className="mt-1 text-[1rem] font-semibold text-white/90">Fase: {scenario.phase}</p>
          </div>
        </div>

        {/* Indicators */}
        <div className="grid grid-cols-3 gap-1.5">
          {Object.entries(scenario.indicators).map(([key, ind]) => (
            <div key={key} className="rounded-[0.6rem] border border-white/[0.04] px-2.5 py-2 text-center" style={{ background: 'rgba(255,255,255,0.015)' }}>
              <p className="text-[8px] uppercase tracking-[0.15em] text-white/24">{key.toUpperCase()}</p>
              <p className="text-[13px] font-bold text-white/70 mt-0.5">{ind.value}</p>
              <p className="text-[8px] text-white/28">{ind.trend}</p>
            </div>
          ))}
        </div>

        {/* Decisions */}
        <div className="space-y-2">
          <p className="text-[9px] uppercase tracking-[0.22em] text-white/28">Decisões — avalie cada uma</p>
          {scenario.decisions.map((d, di) => {
            const isRev = revealed[dKey(di)] || false
            const style = DECISION_COLORS[d.answer]
            return (
              <div key={di} className="rounded-[0.8rem] border border-white/[0.06] overflow-hidden" style={{ background: 'rgba(255,255,255,0.015)' }}>
                <button onClick={() => setRevealed(prev => ({ ...prev, [dKey(di)]: !prev[dKey(di)] }))}
                  className="w-full px-4 py-3 flex items-center justify-between text-left">
                  <p className="text-[12px] text-white/64">{d.action}</p>
                  <span className="text-white/28 text-[12px] shrink-0 ml-2">{isRev ? '−' : '?'}</span>
                </button>
                <AnimatePresence>
                  {isRev && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-3 overflow-hidden">
                      <div className={`rounded-[0.6rem] border ${style.border} p-3`} style={{ background: style.bg }}>
                        <p className="text-[10px] font-bold mb-1" style={{ color: style.text }}>{DECISION_LABELS[d.answer]}</p>
                        <p className="text-[11px] text-white/50 leading-relaxed">{d.why}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">← Anterior</button>
        <button onClick={() => setIdx(i => Math.min(MACRO_SCENARIOS.length - 1, i + 1))} disabled={idx === MACRO_SCENARIOS.length - 1}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">Próximo →</button>
      </div>
    </div>
  )
}

// ── Text Review ─────────────────────────────────────────────────────────────

const REVIEW_TEXTS = [
  {
    title: 'Email ao Conselho',
    original: 'Prezados membros do conselho, gostaria de informar que depois de uma extensa análise que levou em consideração diversos fatores relevantes para nossa operação, chegamos à conclusão de que seria interessante considerar a possibilidade de eventualmente expandir nossas operações para novas regiões, tendo em vista que alguns estudos indicam que pode haver oportunidades de crescimento em determinados mercados que ainda não foram explorados pela nossa empresa.',
    problems: ['Falta de tese clara — "considerar a possibilidade de eventualmente" não é recomendação', 'Linguagem vaga — "diversos fatores", "alguns estudos", "determinados mercados"', 'Excesso de palavras — 1 frase de 67 palavras quando 15 bastam', 'Nenhum dado concreto — onde estão os números?'],
    improved: 'Prezados,\n\nRecomendo aprovar a expansão para o Nordeste com investimento de R$ 2M até Q3.\n\nRazões:\n1. Mercado nordestino cresceu 22%/ano — 3x a média nacional\n2. Zero concorrente premium na região-alvo\n3. Piloto em Recife validou modelo em 6 meses (ROI de 18%)\n\nApresentação completa anexa. Solicito aprovação até 15/04.\n\nAtt.',
  },
  {
    title: 'Relatório de Vendas',
    original: 'As vendas do trimestre foram boas. Tivemos um aumento em relação ao trimestre anterior. O time trabalhou muito e isso se refletiu nos resultados. Alguns produtos venderam mais que outros. A equipe está motivada para o próximo trimestre e acredita que vai melhorar ainda mais. Precisamos de mais investimento em marketing para continuar crescendo.',
    problems: ['"Boas" e "aumento" sem números — quanto? Boas comparado a quê?', '"Alguns produtos venderam mais" — quais? quanto? por quê?', '"Acredita que vai melhorar" — baseado em quê?', '"Precisamos de mais investimento" — quanto? para quê? qual o retorno esperado?', 'Zero dados em todo o parágrafo'],
    improved: 'Vendas Q1/2025: R$ 3.2M (+18% vs Q4/2024). Meta de R$ 2.8M superada em 14%.\n\nDestaques:\n— Produto A: R$ 1.4M (+32%) — puxado por nova campanha digital (CAC caiu 22%)\n— Produto B: R$ 980K (-5%) — concorrente lançou alternativa 15% mais barata\n— Produto C: R$ 820K (+8%) — estável\n\nProjeção Q2: R$ 3.5M baseado em pipeline atual de R$ 5.2M × conversão histórica de 67%.\n\nSolicitação: R$ 150K adicional em marketing digital para Produto A (ROI projetado: 4.2x baseado em performance Q1).',
  },
  {
    title: 'Proposta de Projeto',
    original: 'Acreditamos que a implementação de um sistema de CRM traria muitos benefícios para a empresa. Várias empresas líderes já utilizam CRM e obtiveram resultados impressionantes. Nossa equipe de vendas precisa de uma ferramenta melhor. O investimento não é tão alto se considerarmos os benefícios a longo prazo. Sugerimos começar o quanto antes.',
    problems: ['"Muitos benefícios" — quais? Quantifique.', '"Várias empresas líderes" — quais? Que resultados? (apelo à autoridade)', '"Não é tão alto" — quanto custa? Comparado a quê?', '"O quanto antes" — quando? Qual timeline?', 'Nenhum dado, nenhuma referência, nenhuma métrica de sucesso'],
    improved: 'Proposta: Implementar Salesforce CRM em 90 dias. Investimento: R$ 180K (licença + implantação + treinamento).\n\nProblema atual: 35% dos leads não recebem follow-up no prazo. Taxa de conversão: 12% (benchmark do setor: 22%). Receita perdida estimada: R$ 800K/ano.\n\nRetorno projetado:\n— Conversão de 12% → 19% em 6 meses (baseado em case da empresa X do mesmo setor)\n— Receita adicional: R$ 540K/ano\n— Payback: 4 meses\n\nTimeline: Kickoff em 01/05. Go-live em 30/07. Avaliação de ROI em 30/01/2026.\n\nPróximo passo: Aprovação do investimento até 15/04.',
  },
  {
    title: 'Resumo Executivo — TCC',
    original: 'Este trabalho tem como objetivo analisar a inovação nas empresas brasileiras. A inovação é muito importante nos dias de hoje. Muitos autores falam sobre inovação. Schumpeter foi um dos primeiros a estudar o tema. As empresas que inovam tendem a ter mais sucesso. Neste trabalho foram entrevistadas algumas empresas. Os resultados mostraram que a inovação é importante.',
    problems: ['Circular — começa e termina dizendo que inovação é importante', '"Muitos autores" — quais? O que disseram especificamente?', '"Algumas empresas" — quantas? Quais? Por que essas?', '"Tendem a ter mais sucesso" — que tipo de sucesso? Medido como?', 'Nenhuma descoberta original — apenas repete o senso comum'],
    improved: 'Este estudo investigou como a cultura organizacional influencia a adoção de inovação aberta em 12 PMEs industriais paranaenses (2023-2024), usando entrevistas semiestruturadas e análise de conteúdo (Bardin, 2011).\n\nPrincipal achado: Empresas com cultura de tolerância ao erro (8 das 12) adotaram 3.2x mais práticas de inovação aberta do que as com cultura punitiva. O fator mediador foi a segurança psicológica (Edmondson, 1999), não o investimento em P&D.\n\nContribuição: Demonstra que o fator limitante da inovação em PMEs brasileiras não é capital — é cultura. Propõe um modelo de diagnóstico cultural em 5 dimensões aplicável a PMEs.',
  },
]

export function TextReview() {
  const [idx, setIdx] = useState(0)
  const [stage, setStage] = useState<'original' | 'problems' | 'improved'>('original')

  const text = REVIEW_TEXTS[idx]

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {REVIEW_TEXTS.map((t, i) => (
          <button key={i} onClick={() => { setIdx(i); setStage('original') }}
            className={`shrink-0 rounded-[0.75rem] border px-3 py-2 text-[10px] font-semibold transition-all ${
              idx === i ? 'border-white/20 bg-white/[0.08] text-white/88' : 'border-white/[0.06] text-white/28'
            }`}>{String(i + 1).padStart(2, '0')}</button>
        ))}
      </div>

      <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <p className="text-[1rem] font-semibold text-white/90">{text.title}</p>

        <div className="rounded-[0.9rem] border border-white/[0.06] p-4" style={{ background: 'rgba(255,255,255,0.015)' }}>
          <p className="text-[9px] uppercase tracking-[0.2em] text-red-400/50 mb-2">Texto Original</p>
          <p className="text-[12px] text-white/50 leading-relaxed italic">{text.original}</p>
        </div>

        {stage === 'original' && (
          <button onClick={() => setStage('problems')}
            className="w-full rounded-[0.8rem] border border-white/20 bg-white/[0.06] py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:bg-white/[0.1] transition-all">
            Identificar Problemas
          </button>
        )}

        {(stage === 'problems' || stage === 'improved') && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-[0.9rem] border border-amber-500/15 p-4 space-y-2" style={{ background: 'rgba(245,158,11,0.03)' }}>
            <p className="text-[9px] uppercase tracking-[0.2em] text-amber-400/50">Problemas Identificados</p>
            {text.problems.map((p, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[10px] text-amber-400/50 mt-0.5 shrink-0">×</span>
                <p className="text-[11px] text-white/50 leading-relaxed">{p}</p>
              </div>
            ))}
          </motion.div>
        )}

        {stage === 'problems' && (
          <button onClick={() => setStage('improved')}
            className="w-full rounded-[0.8rem] border border-white/15 bg-white/[0.04] py-2.5 text-[10px] uppercase tracking-[0.18em] text-white/40 hover:text-white/60 transition-all">
            Ver Versão Corrigida
          </button>
        )}

        {stage === 'improved' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-[0.9rem] border border-green-500/15 p-4" style={{ background: 'rgba(34,197,94,0.03)' }}>
            <p className="text-[9px] uppercase tracking-[0.2em] text-green-400/50 mb-2">Versão Corrigida</p>
            <p className="text-[12px] text-white/60 leading-relaxed whitespace-pre-line">{text.improved}</p>
          </motion.div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button onClick={() => { setIdx(i => Math.max(0, i - 1)); setStage('original') }} disabled={idx === 0}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">← Anterior</button>
        <button onClick={() => { setIdx(i => Math.min(REVIEW_TEXTS.length - 1, i + 1)); setStage('original') }} disabled={idx === REVIEW_TEXTS.length - 1}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">Próximo →</button>
      </div>
    </div>
  )
}

// ── Pitch Evaluation ────────────────────────────────────────────────────────

const PITCHES = [
  {
    name: 'PetCare AI',
    pitch: 'App de diagnóstico veterinário por IA. Dona tira foto do pet, IA sugere possíveis condições. Equipe: 2 devs, 0 veterinários. MRR: R$ 0 (pré-revenue). TAM: R$ 80B (mercado pet global). Levantando R$ 3M seed.',
    metrics: { tam: 'R$ 80B', sam: 'Não informado', cac: 'Não informado', ltv: 'Não informado', mrr: 'R$ 0', equipe: '2 devs, 0 vets', traction: 'MVP com 200 downloads' },
    verdict: 'NOT_INVEST',
    reasons: ['Zero validação de mercado (200 downloads ≠ tração)', 'Nenhum veterinário na equipe — risco regulatório e de credibilidade fatal', 'TAM de R$ 80B é greenwashing de número — SAM/SOM não informados', 'Pedir R$ 3M sem revenue é valuation agressivo demais para seed', 'Risco de responsabilidade legal se diagnóstico errado causar dano ao animal'],
  },
  {
    name: 'FinControl',
    pitch: 'ERP financeiro para PMEs. Integra banco, NF, conciliação. Equipe: ex-CFO de scale-up + CTO ex-iFood. MRR: R$ 85K (18 meses de operação). 120 clientes. Churn: 2.1%/mês. LTV/CAC: 5.2x. Levantando R$ 5M Série A.',
    metrics: { mrr: 'R$ 85K', arr: 'R$ 1.02M', cac: 'R$ 1.800', ltv: 'R$ 9.360', ltvCac: '5.2x', churn: '2.1%/mês', clientes: '120', nps: '67' },
    verdict: 'INVEST',
    reasons: ['Unit economics saudáveis (LTV/CAC 5.2x, churn 2.1%)', 'Equipe complementar e com experiência relevante (CFO + CTO)', 'NPS de 67 indica product-market fit', '18 meses de operação com crescimento consistente', 'Mercado de PMEs no Brasil é enorme e mal atendido por ERPs caros (SAP, Oracle)'],
  },
  {
    name: 'GreenDeliver',
    pitch: 'Delivery com veículos elétricos. Foco em restaurantes premium. Equipe: 3 fundadores, 15 entregadores. GMV: R$ 280K/mês. Take rate: 25%. Custo operacional: 85% da receita. Levantando R$ 8M seed.',
    metrics: { gmv: 'R$ 280K/mês', takeRate: '25%', receita: 'R$ 70K/mês', custoOp: '85% da receita', margem: '15% (R$ 10.5K/mês)', burnRate: 'R$ 60K/mês', runway: '~3 meses' },
    verdict: 'NOT_INVEST',
    reasons: ['Margem de 15% com custo operacional de 85% — unit economics negativo após custos fixos', 'R$ 8M de seed para uma operação que gera R$ 10.5K/mês de margem é desproporcional', 'Runway de 3 meses = empresa morrendo. Pedido de fundraise é emergência, não growth', 'Diferencial "elétrico" não é defensável — qualquer delivery pode trocar para EV', 'Take rate de 25% é alto demais para restaurantes premium — vão migrar quando aparecer alternativa'],
  },
  {
    name: 'EduPro B2B',
    pitch: 'Plataforma de capacitação corporativa com IA. Cria trilhas personalizadas por cargo. Equipe: CEO ex-Falconi + CPO ex-Coursera + CTO ex-Google. MRR: R$ 320K. 45 empresas clientes (média 800 funcionários). NRR: 128%. Levantando R$ 15M Série A.',
    metrics: { mrr: 'R$ 320K', arr: 'R$ 3.84M', clientes: '45 empresas', ticketMedio: 'R$ 7.1K/mês', nrr: '128%', churn: '1.5%/mês', cac: 'R$ 22K', paybackCac: '3.1 meses' },
    verdict: 'INVEST',
    reasons: ['NRR de 128% = clientes existentes gastam mais a cada mês (expansão > churn)', 'Payback de CAC em 3.1 meses = excelente eficiência de capital', 'Equipe de elite (Falconi + Coursera + Google) — execução comprovada', 'Ticket de R$ 7.1K/mês para 800 funcionários = R$ 8.90/funcionário — muito acessível', 'Mercado de T&D corporativo no Brasil: R$ 20B/ano e altamente fragmentado'],
  },
]

export function PitchEvaluation() {
  const [idx, setIdx] = useState(0)
  const [decision, setDecision] = useState<Record<number, string>>({})
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  const pitch = PITCHES[idx]
  const myDecision = decision[idx]
  const isRevealed = revealed[idx] || false
  const isCorrect = myDecision === pitch.verdict

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PITCHES.map((p, i) => {
          const done = revealed[i]
          const right = done && decision[i] === PITCHES[i].verdict
          return (
            <button key={i} onClick={() => setIdx(i)}
              className={`shrink-0 rounded-[0.75rem] border px-3 py-2 text-[10px] font-semibold transition-all ${
                idx === i ? 'border-white/20 bg-white/[0.08] text-white/88'
                  : done ? (right ? 'border-green-500/30 text-green-400/60' : 'border-red-500/30 text-red-400/60')
                    : 'border-white/[0.06] text-white/28'
              }`}>{p.name}</button>
          )
        })}
      </div>

      <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div>
          <p className="text-[1rem] font-semibold text-white/90">{pitch.name}</p>
          <p className="mt-2 text-[13px] text-white/50 leading-relaxed">{pitch.pitch}</p>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(pitch.metrics).map(([k, v]) => (
            <div key={k} className="rounded-[0.5rem] border border-white/[0.04] px-2.5 py-1.5">
              <p className="text-[8px] uppercase tracking-[0.15em] text-white/24">{k}</p>
              <p className="text-[11px] font-medium text-white/64">{v}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          {[{ key: 'INVEST', label: 'Investiria', color: '#4ade80' }, { key: 'NOT_INVEST', label: 'Não Investiria', color: '#ef4444' }].map(opt => (
            <button key={opt.key} onClick={() => !isRevealed && setDecision(prev => ({ ...prev, [idx]: opt.key }))}
              className={`flex-1 rounded-[0.8rem] border py-3 text-[12px] font-bold transition-all ${
                myDecision === opt.key
                  ? (isRevealed ? (opt.key === pitch.verdict ? 'border-green-500/40 bg-green-500/[0.08]' : 'border-red-500/40 bg-red-500/[0.08]') : 'border-white/20 bg-white/[0.08]')
                  : 'border-white/[0.06] text-white/36 hover:text-white/56'
              }`} style={{ color: myDecision === opt.key ? opt.color : undefined }}>
              {opt.label}
            </button>
          ))}
        </div>

        {myDecision && !isRevealed && (
          <button onClick={() => setRevealed(prev => ({ ...prev, [idx]: true }))}
            className="w-full rounded-[0.8rem] border border-white/20 bg-white/[0.06] py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:bg-white/[0.1] transition-all">
            Ver Análise VC
          </button>
        )}

        {isRevealed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-[0.8rem] border p-4 space-y-2 ${isCorrect ? 'border-green-500/20' : 'border-amber-500/20'}`}
            style={{ background: isCorrect ? 'rgba(34,197,94,0.04)' : 'rgba(245,158,11,0.04)' }}>
            <p className="text-[11px] font-bold" style={{ color: isCorrect ? '#4ade80' : '#f59e0b' }}>
              {isCorrect ? 'Decisão alinhada com VCs!' : `VCs decidiram: ${pitch.verdict === 'INVEST' ? 'INVESTIR' : 'NÃO INVESTIR'}`}
            </p>
            {pitch.reasons.map((r, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[10px] text-white/28 mt-0.5 shrink-0">→</span>
                <p className="text-[11px] text-white/50 leading-relaxed">{r}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ── Conjuntura Analysis ─────────────────────────────────────────────────────
// Reusa a estrutura do MacroScenario mas com painel mais completo

export function ConjunturaAnalysis() {
  // Wrapper que reutiliza MacroScenario com label diferente
  return <MacroScenario />
}

// ── Export map ───────────────────────────────────────────────────────────────

export const SIM_M5: Record<string, React.ComponentType> = {
  'argument-builder': ArgumentBuilder,
  'lean-canvas': LeanCanvas,
  'macro-scenario': MacroScenario,
  'text-review': TextReview,
  'pitch-evaluation': PitchEvaluation,
  'conjuntura-analysis': ConjunturaAnalysis,
}
