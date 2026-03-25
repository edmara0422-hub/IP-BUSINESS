'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Fallacy Detector ────────────────────────────────────────────────────────

const FALLACIES = [
  { phrase: '"Não podemos mudar de ERP — já investimos R$ 3 milhões nele."', answer: 'custo-irrecuperavel', fallacy: 'Falácia do Custo Irrecuperável', explanation: 'O investimento passado já foi feito e não pode ser recuperado. A decisão deve ser baseada no custo-benefício FUTURO, não no que já gastou. Se o novo ERP gera mais valor nos próximos 5 anos, o investimento passado é irrelevante.' },
  { phrase: '"A Amazon faz assim, então devemos fazer igual."', answer: 'apelo-autoridade', fallacy: 'Apelo à Autoridade', explanation: 'O que funciona para a Amazon (US$ 500B de receita, 1.5M de funcionários, mercado americano) pode não funcionar para uma PME brasileira. Contexto importa. Copiar sem adaptar é falácia.' },
  { phrase: '"Ou digitalizamos tudo em 6 meses ou vamos falir."', answer: 'falsa-dicotomia', fallacy: 'Falsa Dicotomia', explanation: 'Apresenta apenas duas opções extremas, ignorando alternativas intermediárias. Digitalização parcial, faseada ou priorizada por área são opções válidas. A realidade raramente é binária.' },
  { phrase: '"Três clientes reclamaram do atendimento — precisamos reestruturar toda a equipe."', answer: 'generalizacao', fallacy: 'Generalização Apressada', explanation: '3 reclamações em milhares de atendimentos não justifica reestruturação total. Investigue: é padrão ou caso isolado? Qual a amostra? Qual a taxa de reclamação vs. satisfação?' },
  { phrase: '"O João é estagiário, a opinião dele sobre o produto não conta."', answer: 'ad-hominem', fallacy: 'Ad Hominem', explanation: 'Desqualifica o argumento atacando a pessoa, não a ideia. Um estagiário pode ter a perspectiva mais valiosa — ele é mais próximo do perfil do consumidor jovem. Avalie o argumento, não o cargo.' },
  { phrase: '"Trocamos o gerente em março. Em abril as vendas caíram. Claramente a troca causou a queda."', answer: 'falsa-causa', fallacy: 'Falsa Causa (Post Hoc)', explanation: 'Correlação temporal não prova causalidade. A queda pode ter sido causada por sazonalidade, concorrência, economia ou dezenas de outros fatores. "Depois de" não significa "por causa de".' },
  { phrase: '"Sempre fizemos a convenção de vendas em janeiro. Não faz sentido mudar."', answer: 'apelo-tradicao', fallacy: 'Apelo à Tradição', explanation: 'O fato de algo sempre ter sido feito de um jeito não prova que é o melhor jeito. Contextos mudam. Pergunte: as condições que justificavam janeiro ainda existem?' },
  { phrase: '"Nosso café é o mais sustentável — usamos copos recicláveis."', answer: 'custo-oculto', fallacy: 'Custo Oculto (Greenwashing)', explanation: 'Destaca um atributo positivo menor (copos) enquanto ignora impactos maiores (cadeia de suprimentos, transporte, descarte). É o Pecado #1 do Greenwashing — destacar uma virtude para esconder o impacto total.' },
  { phrase: '"Se permitirmos trabalho remoto, em 6 meses ninguém mais vai aparecer no escritório e a cultura vai morrer."', answer: 'ladeira-escorregadia', fallacy: 'Ladeira Escorregadia', explanation: 'Assume uma cadeia de consequências extremas sem evidência. Milhares de empresas operam em modelo híbrido com cultura forte. O salto lógico de "remoto" para "cultura morta" não tem fundamento.' },
  { phrase: '"Depois de analisar 50 empresas de sucesso, concluímos que todas investem fortemente em marketing. Logo, investir em marketing causa sucesso."', answer: 'vies-sobrevivencia', fallacy: 'Viés de Sobrevivência', explanation: 'Só analisaram empresas que sobreviveram. E as centenas que também investiram em marketing e falharam? Sem analisar os fracassos, não é possível concluir que marketing causa sucesso.' },
]

const FALLACY_OPTIONS = [
  { key: 'ad-hominem', label: 'Ad Hominem' },
  { key: 'apelo-autoridade', label: 'Apelo à Autoridade' },
  { key: 'falsa-dicotomia', label: 'Falsa Dicotomia' },
  { key: 'falsa-causa', label: 'Falsa Causa' },
  { key: 'generalizacao', label: 'Generalização Apressada' },
  { key: 'custo-irrecuperavel', label: 'Custo Irrecuperável' },
  { key: 'apelo-tradicao', label: 'Apelo à Tradição' },
  { key: 'custo-oculto', label: 'Custo Oculto' },
  { key: 'ladeira-escorregadia', label: 'Ladeira Escorregadia' },
  { key: 'vies-sobrevivencia', label: 'Viés de Sobrevivência' },
]

export function FallacyDetector() {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  const item = FALLACIES[idx]
  const myAnswer = answers[idx]
  const isRevealed = revealed[idx] || false
  const isCorrect = myAnswer === item.answer
  const totalRevealed = Object.keys(revealed).length
  const totalCorrect = Object.keys(revealed).filter(k => answers[Number(k)] === FALLACIES[Number(k)].answer).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 overflow-x-auto">
          {FALLACIES.map((_, i) => {
            const done = revealed[i]
            const right = done && answers[i] === FALLACIES[i].answer
            return (
              <button key={i} onClick={() => setIdx(i)}
                className={`shrink-0 h-7 w-7 rounded-lg border text-[10px] font-bold transition-all ${
                  idx === i ? 'border-white/20 bg-white/[0.08] text-white/88'
                    : done ? (right ? 'border-green-500/30 text-green-400/50' : 'border-red-500/30 text-red-400/50')
                      : 'border-white/[0.06] text-white/24'
                }`}>
                {i + 1}
              </button>
            )
          })}
        </div>
        {totalRevealed > 0 && <p className="text-[10px] text-white/28 shrink-0 ml-2">{totalCorrect}/{totalRevealed}</p>}
      </div>

      <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/28">Frase {idx + 1}/{FALLACIES.length}</p>
          <p className="mt-3 text-[14px] text-white/72 leading-relaxed italic">{item.phrase}</p>
        </div>

        <div className="space-y-1.5">
          <p className="text-[9px] uppercase tracking-[0.22em] text-white/28">Qual falácia?</p>
          <div className="grid grid-cols-2 gap-1.5">
            {FALLACY_OPTIONS.map(o => (
              <button key={o.key} onClick={() => !isRevealed && setAnswers(prev => ({ ...prev, [idx]: o.key }))}
                className={`rounded-[0.6rem] border px-2.5 py-2 text-left text-[11px] transition-all ${
                  myAnswer === o.key
                    ? (isRevealed
                      ? (o.key === item.answer ? 'border-green-500/40 bg-green-500/[0.08] text-green-300/80' : 'border-red-500/40 bg-red-500/[0.08] text-red-300/80')
                      : 'border-white/20 bg-white/[0.08] text-white/80')
                    : (isRevealed && o.key === item.answer ? 'border-green-500/30 bg-green-500/[0.04] text-green-300/60' : 'border-white/[0.06] text-white/36 hover:text-white/56')
                }`}>
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {myAnswer && !isRevealed && (
          <button onClick={() => setRevealed(prev => ({ ...prev, [idx]: true }))}
            className="w-full rounded-[0.8rem] border border-white/20 bg-white/[0.06] py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:bg-white/[0.1] transition-all">
            Verificar
          </button>
        )}

        {isRevealed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-[0.8rem] border p-4 space-y-2 ${isCorrect ? 'border-green-500/20' : 'border-amber-500/20'}`}
            style={{ background: isCorrect ? 'rgba(34,197,94,0.04)' : 'rgba(245,158,11,0.04)' }}>
            <p className="text-[11px] font-bold" style={{ color: isCorrect ? '#4ade80' : '#f59e0b' }}>
              {isCorrect ? 'Correto!' : `Resposta: ${item.fallacy}`}
            </p>
            <p className="text-[12px] text-white/56 leading-relaxed">{item.explanation}</p>
          </motion.div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">← Anterior</button>
        <button onClick={() => setIdx(i => Math.min(FALLACIES.length - 1, i + 1))} disabled={idx === FALLACIES.length - 1}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">Próxima →</button>
      </div>
    </div>
  )
}

// ── Ethics Dilemmas ─────────────────────────────────────────────────────────

const DILEMMAS = [
  {
    title: 'O Layoff Estratégico',
    context: 'Sua empresa precisa cortar custos em 20%. A opção mais rápida: demitir 200 funcionários da fábrica antiga e automatizar. A comunidade local depende da fábrica — é o maior empregador da cidade (8.000 habitantes).',
    frameworks: {
      utilitarismo: { analysis: 'Maior bem para o maior número: 200 perdem emprego, mas 1.800 restantes mantêm seus cargos e a empresa sobrevive. Se a empresa falir, todos os 2.000 perdem. Utilitarismo favorece o layoff.', verdict: 'Favorece layoff' },
      deontologia: { analysis: 'Pode ser universalizado? Se toda empresa demitisse ao primeiro sinal de crise, o sistema colapsa. Kant diria: pessoas não são meios para fins. Demitir para aumentar lucro dos acionistas viola a dignidade.', verdict: 'Contra layoff' },
      virtudes: { analysis: 'Uma pessoa justa e corajosa buscaria alternativas antes: redução de jornada, requalificação, realocação. O layoff como primeira opção é preguiça moral.', verdict: 'Contra (sem esgotar alternativas)' },
      cuidado: { analysis: 'Quem é vulnerável? 200 famílias numa cidade de 8.000. Sem a fábrica, a cidade pode colapsar. A responsabilidade da empresa com a comunidade pesa.', verdict: 'Contra layoff direto' },
    },
    realDecision: 'Uma empresa real (Michelin, 2020) enfrentou cenário similar e optou por: plano de requalificação de 18 meses + ajuda para realocação + investimento em nova indústria local. Custo maior no curto prazo, mas preservou reputação e evitou processo trabalhista.',
  },
  {
    title: 'Os Dados do Usuário',
    context: 'Seu app coleta dados de localização. O time de produto descobriu que cruzar localização + compras permite prever comportamentos com 87% de precisão. Isso valeria R$ 15M/ano vendendo insights para varejistas. Os termos de uso permitem "análise de dados para melhoria do serviço" — mas vender para terceiros não está explícito.',
    frameworks: {
      utilitarismo: { analysis: 'R$ 15M beneficia a empresa e acionistas. Varejistas melhoram ofertas. Usuários recebem promoções mais relevantes. Mas o risco de vazamento afeta milhões.', verdict: 'Depende do risco' },
      deontologia: { analysis: 'Os termos dizem "melhoria do serviço", não "venda para terceiros". Usar dados para algo não consentido viola o imperativo categórico. Se todos fizessem, ninguém confiaria em apps.', verdict: 'Contra a venda' },
      virtudes: { analysis: 'Uma pessoa honesta pediria consentimento explícito antes. Usar brecha jurídica não é ético só porque é legal.', verdict: 'Contra sem consentimento' },
      cuidado: { analysis: 'Usuários são a parte vulnerável — não sabem o que está sendo feito com seus dados. A relação de confiança é assimétrica.', verdict: 'Contra sem transparência' },
    },
    realDecision: 'A Apple (2021) escolheu o caminho oposto: App Tracking Transparency — obrigou apps a pedir permissão explícita para rastrear. Custou US$ 10B em receita de anúncios para o Facebook, mas fortaleceu a marca Apple como defensora da privacidade.',
  },
  {
    title: 'O Fornecedor Barato',
    context: 'Seu fornecedor mais barato (30% abaixo dos concorrentes) fica no sudeste asiático. Auditoria interna encontrou: jornada de 14h/dia, trabalhadores menores de 16 anos, e salário abaixo do mínimo local. Trocar de fornecedor aumenta custo em 30% e reduz sua margem de 15% para 5%.',
    frameworks: {
      utilitarismo: { analysis: 'Manter: preço baixo beneficia consumidores, empresa lucrativa mantém empregos locais. Trocar: trabalhadores do fornecedor continuam na mesma situação (outro comprador assumirá). Mas trocar sinaliza para o mercado que exploração tem custo.', verdict: 'Ambíguo' },
      deontologia: { analysis: 'Trabalho infantil não pode ser universalizado. Beneficiar-se de exploração, mesmo indiretamente, viola a dignidade humana. Kant seria categórico: troque de fornecedor.', verdict: 'Troque de fornecedor' },
      virtudes: { analysis: 'Uma pessoa justa não lucra sobre sofrimento infantil. Independente do custo. Se você descobriu, você é responsável pelo que faz com essa informação.', verdict: 'Troque e denuncie' },
      cuidado: { analysis: 'As crianças são a parte mais vulnerável. A empresa tem responsabilidade direta com sua cadeia de fornecimento. A distância geográfica não elimina a responsabilidade moral.', verdict: 'Proteja os vulneráveis' },
    },
    realDecision: 'A Nike (anos 90) manteve fornecedores com trabalho infantil. O escândalo custou US$ 1B em valor de mercado e décadas de reputação. Hoje investe US$ 100M/ano em auditoria de supply chain. O custo de manter foi maior que o custo de trocar.',
  },
  {
    title: 'O Algoritmo Discriminatório',
    context: 'Seu banco usa IA para aprovar crédito. O modelo tem 92% de acurácia. Porém, análise revelou que ele rejeita 3x mais pessoas negras e 2x mais mulheres — mesmo com score de crédito similar. O viés vem dos dados históricos (discriminação passada).',
    frameworks: {
      utilitarismo: { analysis: '92% de acurácia maximiza lucro e minimiza inadimplência. Corrigir o viés pode reduzir acurácia para 88%. Mas a discriminação sistêmica gera dano social enorme a longo prazo.', verdict: 'Corrija o modelo' },
      deontologia: { analysis: 'Discriminar por raça/gênero não pode ser universalizado. Viola direitos fundamentais. A eficiência do modelo não justifica a injustiça.', verdict: 'Corrija imediatamente' },
      virtudes: { analysis: 'Uma empresa justa não perpetua discriminação, mesmo que lucrativa. Corrigir o viés é o mínimo. O modelo reflete os valores da empresa.', verdict: 'Corrija e audite' },
      cuidado: { analysis: 'Pessoas negras e mulheres são historicamente marginalizadas no acesso a crédito. Perpetuar viés algorítmico aprofunda desigualdade.', verdict: 'Priorize os vulneráveis' },
    },
    realDecision: 'O Apple Card (Goldman Sachs, 2019) enfrentou acusação de viés de gênero — homens recebiam limites 20x maiores que mulheres. A investigação regulatória e dano reputacional foram enormes. Hoje, reguladores exigem auditoria de viés em IA financeira.',
  },
  {
    title: 'O Greenwashing Tentador',
    context: 'Sua empresa reduziu emissões em 5% — mas aumentou uso de água em 15% e resíduos em 20% (expansão da produção). O departamento de marketing quer lançar campanha "Empresa Carbono Consciente" destacando apenas a redução de emissões.',
    frameworks: {
      utilitarismo: { analysis: 'A campanha melhora imagem e pode aumentar vendas. Mas se descoberta como greenwashing, o dano é maior que o ganho. Risco > benefício.', verdict: 'Não compensa o risco' },
      deontologia: { analysis: 'Destacar 5% de melhoria enquanto esconde 15-20% de piora é enganoso. Se universalizado, ninguém confiaria em comunicações de sustentabilidade.', verdict: 'Contra a campanha' },
      virtudes: { analysis: 'Honestidade exige mostrar o quadro completo. Uma empresa virtuosa reportaria: "Reduzimos emissões em 5%, mas temos desafios em água e resíduos que estamos trabalhando para resolver."', verdict: 'Transparência total' },
      cuidado: { analysis: 'O consumidor que compra "por ser sustentável" está sendo enganado. A relação de confiança é violada.', verdict: 'Contra a campanha' },
    },
    realDecision: 'A Volkswagen (Dieselgate, 2015) foi pega manipulando dados de emissões. Custo: US$ 33 bilhões em multas, recalls e processos. CEO preso. O greenwashing é o crime corporativo com pior relação custo-benefício que existe.',
  },
]

const FW_COLORS: Record<string, { label: string; color: string }> = {
  utilitarismo: { label: 'Utilitarismo', color: '#4ade80' },
  deontologia: { label: 'Deontologia', color: '#60a5fa' },
  virtudes: { label: 'Ética das Virtudes', color: '#f59e0b' },
  cuidado: { label: 'Ética do Cuidado', color: '#a78bfa' },
}

export function EthicsDilemmas() {
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})
  const [expandedFw, setExpandedFw] = useState<string | null>(null)

  const dilemma = DILEMMAS[idx]
  const isRevealed = revealed[idx] || false

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {DILEMMAS.map((d, i) => (
          <button key={i} onClick={() => { setIdx(i); setExpandedFw(null) }}
            className={`shrink-0 rounded-[0.75rem] border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all ${
              idx === i ? 'border-white/20 bg-white/[0.08] text-white/88' : 'border-white/[0.06] text-white/28 hover:text-white/54'
            }`}>
            {String(i + 1).padStart(2, '0')}
          </button>
        ))}
      </div>

      <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/28">Dilema {idx + 1}</p>
          <p className="mt-1 text-[1rem] font-semibold text-white/90">{dilemma.title}</p>
          <p className="mt-2 text-[13px] text-white/50 leading-relaxed">{dilemma.context}</p>
        </div>

        {!isRevealed && (
          <button onClick={() => setRevealed(prev => ({ ...prev, [idx]: true }))}
            className="w-full rounded-[0.8rem] border border-white/20 bg-white/[0.06] py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:bg-white/[0.1] transition-all">
            Analisar pelos 4 Frameworks
          </button>
        )}

        {isRevealed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            {Object.entries(dilemma.frameworks).map(([key, fw]) => {
              const meta = FW_COLORS[key]
              const isOpen = expandedFw === key
              return (
                <motion.div key={key} layout className="rounded-[0.9rem] border border-white/[0.06] overflow-hidden" style={{ background: 'rgba(255,255,255,0.015)' }}>
                  <button onClick={() => setExpandedFw(isOpen ? null : key)} className="w-full px-4 py-3 flex items-center justify-between text-left">
                    <div className="flex items-center gap-3">
                      <span className="shrink-0 h-2 w-2 rounded-full" style={{ background: meta.color }} />
                      <p className="text-[12px] font-medium text-white/72">{meta.label}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-md border" style={{ color: meta.color, borderColor: `${meta.color}33` }}>{fw.verdict}</span>
                      <span className="text-white/28 text-[12px]">{isOpen ? '−' : '+'}</span>
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 overflow-hidden">
                        <p className="text-[12px] text-white/50 leading-relaxed">{fw.analysis}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}

            {/* Real decision */}
            <div className="rounded-[0.9rem] border border-white/[0.08] p-4 mt-3" style={{ background: 'rgba(255,255,255,0.025)' }}>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">O que aconteceu na prática</p>
              <p className="text-[12px] text-white/60 leading-relaxed">{dilemma.realDecision}</p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button onClick={() => { setIdx(i => Math.max(0, i - 1)); setExpandedFw(null) }} disabled={idx === 0}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">← Anterior</button>
        <button onClick={() => { setIdx(i => Math.min(DILEMMAS.length - 1, i + 1)); setExpandedFw(null) }} disabled={idx === DILEMMAS.length - 1}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">Próximo →</button>
      </div>
    </div>
  )
}

// ── Profit Optimization ─────────────────────────────────────────────────────

const OPTIM_SCENARIOS = [
  {
    name: 'Cafeteria Premium',
    desc: 'Cafeteria artesanal. Custo fixo R$ 8.000/mês. Custo variável R$ 6/café. Função demanda: preço × (500 − 20 × preço).',
    fixedCost: 8000,
    varCost: 6,
    demandA: 500,
    demandB: 20,
    unit: 'cafés/mês',
    currency: 'R$',
  },
  {
    name: 'SaaS de Gestão',
    desc: 'Software B2B. Custo fixo R$ 45.000/mês. Custo variável R$ 15/cliente. Função demanda: preço × (2000 − 8 × preço).',
    fixedCost: 45000,
    varCost: 15,
    demandA: 2000,
    demandB: 8,
    unit: 'clientes/mês',
    currency: 'R$',
  },
  {
    name: 'E-commerce de Roupas',
    desc: 'Loja online. Custo fixo R$ 25.000/mês. Custo variável R$ 35/peça. Função demanda: preço × (3000 − 15 × preço).',
    fixedCost: 25000,
    varCost: 35,
    demandA: 3000,
    demandB: 15,
    unit: 'peças/mês',
    currency: 'R$',
  },
  {
    name: 'Consultoria por Hora',
    desc: 'Consultoria empresarial. Custo fixo R$ 12.000/mês. Custo variável R$ 50/hora. Função demanda: preço × (400 − 1.5 × preço).',
    fixedCost: 12000,
    varCost: 50,
    demandA: 400,
    demandB: 1.5,
    unit: 'horas/mês',
    currency: 'R$',
  },
]

export function ProfitOptimization() {
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [price, setPrice] = useState(15)

  const s = OPTIM_SCENARIOS[scenarioIdx]
  const maxPrice = Math.floor(s.demandA / s.demandB)
  const quantity = Math.max(0, s.demandA - s.demandB * price)
  const revenue = price * quantity
  const totalCost = s.fixedCost + s.varCost * quantity
  const profit = revenue - totalCost

  // Optimal price: derivative of profit = 0
  // Profit = p*(a - b*p) - (F + v*(a - b*p))
  // = ap - bp² - F - va + vbp
  // = -bp² + (a + vb)p - F - va
  // dProfit/dp = -2bp + (a + vb) = 0
  // p* = (a + vb) / (2b)
  const optimalPrice = Math.round((s.demandA + s.varCost * s.demandB) / (2 * s.demandB))
  const optQuantity = Math.max(0, s.demandA - s.demandB * optimalPrice)
  const optRevenue = optimalPrice * optQuantity
  const optProfit = optRevenue - (s.fixedCost + s.varCost * optQuantity)

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {OPTIM_SCENARIOS.map((sc, i) => (
          <button key={i} onClick={() => { setScenarioIdx(i); setPrice(15) }}
            className={`shrink-0 rounded-[0.75rem] border px-3 py-2 text-[10px] font-semibold transition-all ${
              scenarioIdx === i ? 'border-white/20 bg-white/[0.08] text-white/88' : 'border-white/[0.06] text-white/28 hover:text-white/54'
            }`}>
            {sc.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/28">{s.name}</p>
          <p className="mt-1 text-[12px] text-white/44">{s.desc}</p>
        </div>

        {/* Price slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-[9px] uppercase tracking-[0.22em] text-white/28">Preço unitário</p>
            <p className="text-[16px] font-bold text-white/80">{s.currency} {price}</p>
          </div>
          <input type="range" min={1} max={maxPrice} value={price}
            onChange={e => setPrice(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-white/[0.08] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/60 [&::-webkit-slider-thumb]:cursor-pointer" />
          <div className="flex justify-between text-[9px] text-white/20">
            <span>{s.currency} 1</span>
            <span>{s.currency} {maxPrice}</span>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Demanda', value: `${Math.round(quantity)} ${s.unit}`, color: '#60a5fa' },
            { label: 'Receita', value: `${s.currency} ${revenue.toLocaleString('pt-BR')}`, color: '#4ade80' },
            { label: 'Custo Total', value: `${s.currency} ${totalCost.toLocaleString('pt-BR')}`, color: '#f97316' },
            { label: 'Lucro', value: `${s.currency} ${profit.toLocaleString('pt-BR')}`, color: profit > 0 ? '#4ade80' : '#ef4444' },
          ].map(m => (
            <div key={m.label} className="rounded-[0.7rem] border border-white/[0.06] p-3" style={{ background: 'rgba(255,255,255,0.015)' }}>
              <p className="text-[9px] uppercase tracking-[0.18em] text-white/28">{m.label}</p>
              <p className="text-[14px] font-bold mt-0.5" style={{ color: m.color }}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Profit bar */}
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-[0.18em] text-white/28">Lucro vs Máximo Possível</p>
          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ background: profit > 0 ? '#4ade80' : '#ef4444' }}
              animate={{ width: `${Math.max(0, Math.min(100, (profit / Math.max(optProfit, 1)) * 100))}%` }}
              transition={{ duration: 0.3 }} />
          </div>
          <p className="text-[10px] text-white/24 text-right">{optProfit > 0 ? `${Math.round((profit / optProfit) * 100)}% do lucro máximo` : ''}</p>
        </div>

        {/* Optimal hint */}
        <div className="rounded-[0.8rem] border border-white/[0.06] p-3" style={{ background: 'rgba(255,255,255,0.015)' }}>
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/28 mb-1">Ponto Ótimo (RMg = CMg)</p>
          <p className="text-[12px] text-white/56">
            Preço ótimo: <span className="font-bold text-white/80">{s.currency} {optimalPrice}</span> →
            Demanda: <span className="font-bold text-white/80">{Math.round(optQuantity)}</span> →
            Lucro máximo: <span className="font-bold" style={{ color: '#4ade80' }}>{s.currency} {optProfit.toLocaleString('pt-BR')}</span>
          </p>
          {Math.abs(price - optimalPrice) <= 2 && <p className="text-[10px] mt-1 text-green-400/60">Você está no ponto ótimo!</p>}
        </div>
      </div>
    </div>
  )
}

// ── Data Interpretation ─────────────────────────────────────────────────────

const DATA_SETS = [
  {
    name: 'Vendas Mensais — Loja de Roupas',
    context: 'Receita mensal dos últimos 12 meses (R$ mil). A gerente diz: "vendas estão estáveis em R$ 85K/mês".',
    data: [72, 68, 95, 88, 110, 75, 82, 130, 78, 65, 92, 85],
    questions: [
      { q: 'A média é próxima de R$ 85K?', answer: true, explanation: 'Média = R$ 86.7K. Sim, próxima de R$ 85K. A gerente está certa nesse ponto.' },
      { q: 'As vendas são "estáveis"?', answer: false, explanation: 'Desvio padrão = R$ 18.4K. CV = 21.2%. Isso é alta variabilidade — vendas oscilam de R$ 65K a R$ 130K. "Estáveis" é uma afirmação enganosa.' },
      { q: 'A mediana é mais representativa que a média neste caso?', answer: true, explanation: 'Mediana = R$ 83.5K. Como há outliers (R$ 130K e R$ 65K), a mediana é mais representativa do mês "típico".' },
    ],
    stats: { mean: 86.7, median: 83.5, stdDev: 18.4, cv: 21.2, min: 65, max: 130 },
  },
  {
    name: 'Salários da Equipe de TI',
    context: '15 desenvolvedores. O RH reportou: "salário médio de R$ 12.800". O sindicato reclama que "a maioria ganha menos de R$ 10K".',
    data: [6, 7, 7.5, 8, 8, 8.5, 9, 9, 9.5, 10, 11, 12, 15, 22, 40],
    questions: [
      { q: 'O RH está certo que a média é ~R$ 12.800?', answer: true, explanation: 'Média = R$ 12.8K. Matematicamente correto. Mas é representativo?' },
      { q: 'O sindicato está certo que a maioria ganha menos de R$ 10K?', answer: true, explanation: 'Mediana = R$ 9K. 60% da equipe ganha R$ 9.5K ou menos. O sindicato está certo.' },
      { q: 'A média é enganosa neste caso?', answer: true, explanation: 'O salário de R$ 40K (possivelmente o tech lead) e R$ 22K puxam a média para cima. A mediana (R$ 9K) é 30% menor que a média (R$ 12.8K). Distribuição muito assimétrica — a média engana.' },
    ],
    stats: { mean: 12.8, median: 9.0, stdDev: 9.1, cv: 71.1, min: 6, max: 40 },
  },
  {
    name: 'Tempo de Entrega — E-commerce',
    context: 'Prazo prometido: 5 dias úteis. Dados dos últimos 200 pedidos. Diretoria afirma: "cumprimos o prazo na média".',
    data: [3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 7, 7, 8, 12, 15],
    questions: [
      { q: 'A média está dentro do prazo de 5 dias?', answer: true, explanation: 'Média = 5.7 dias. Acima do prometido, mas a diretoria pode argumentar que "está perto".' },
      { q: '95% dos pedidos chegam em até 8 dias?', answer: false, explanation: 'Há entregas de 12 e 15 dias — outliers graves. Com média 5.7 e σ=2.9, o limite de 2σ é 11.5 dias. 95% dos pedidos NÃO chegam em 8 dias.' },
      { q: 'Os outliers (12 e 15 dias) devem ser investigados separadamente?', answer: true, explanation: 'São mais de 2σ acima da média — eventos atípicos. Provavelmente problemas logísticos específicos (transportadora, região, produto). Investigar a causa é mais útil que incluir na média.' },
    ],
    stats: { mean: 5.7, median: 5.0, stdDev: 2.9, cv: 50.9, min: 3, max: 15 },
  },
]

export function DataInterpretation() {
  const [dataIdx, setDataIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  const dataset = DATA_SETS[dataIdx]

  const qKey = (qi: number) => `${dataIdx}-${qi}`

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {DATA_SETS.map((d, i) => (
          <button key={i} onClick={() => setDataIdx(i)}
            className={`flex-1 rounded-[0.75rem] border px-2 py-2 text-[10px] font-semibold text-center transition-all ${
              dataIdx === i ? 'border-white/20 bg-white/[0.08] text-white/88' : 'border-white/[0.06] text-white/28'
            }`}>
            {String(i + 1).padStart(2, '0')}
          </button>
        ))}
      </div>

      <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div>
          <p className="text-[1rem] font-semibold text-white/90">{dataset.name}</p>
          <p className="mt-1 text-[12px] text-white/44">{dataset.context}</p>
        </div>

        {/* Data visualization - bar chart */}
        <div className="flex items-end gap-1 h-16">
          {dataset.data.map((v, i) => {
            const maxVal = Math.max(...dataset.data)
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <motion.div className="w-full rounded-t-sm bg-blue-400/40"
                  animate={{ height: `${(v / maxVal) * 100}%` }}
                  transition={{ duration: 0.3, delay: i * 0.02 }} />
              </div>
            )
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Média', value: dataset.stats.mean.toFixed(1) },
            { label: 'Mediana', value: dataset.stats.median.toFixed(1) },
            { label: 'Desvio Padrão', value: dataset.stats.stdDev.toFixed(1) },
            { label: 'CV', value: `${dataset.stats.cv.toFixed(1)}%` },
            { label: 'Mínimo', value: dataset.stats.min },
            { label: 'Máximo', value: dataset.stats.max },
          ].map(s => (
            <div key={s.label} className="rounded-[0.5rem] border border-white/[0.04] px-2 py-1.5 text-center">
              <p className="text-[8px] uppercase tracking-[0.15em] text-white/24">{s.label}</p>
              <p className="text-[12px] font-bold text-white/64">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Questions */}
        <div className="space-y-3">
          <p className="text-[9px] uppercase tracking-[0.22em] text-white/28">Verdadeiro ou Falso?</p>
          {dataset.questions.map((q, qi) => {
            const key = qKey(qi)
            const myAns = answers[key]
            const isRev = revealed[key]
            const isRight = myAns === q.answer
            return (
              <div key={qi} className="rounded-[0.8rem] border border-white/[0.06] p-3 space-y-2" style={{ background: 'rgba(255,255,255,0.015)' }}>
                <p className="text-[12px] text-white/60">{q.q}</p>
                <div className="flex gap-2">
                  {[true, false].map(val => (
                    <button key={String(val)} onClick={() => { if (!isRev) { setAnswers(prev => ({ ...prev, [key]: val })); setRevealed(prev => ({ ...prev, [key]: true })) } }}
                      className={`flex-1 rounded-[0.6rem] border py-1.5 text-[11px] font-bold transition-all ${
                        isRev && val === q.answer ? 'border-green-500/40 bg-green-500/[0.08] text-green-300/80'
                          : isRev && myAns === val && !isRight ? 'border-red-500/40 bg-red-500/[0.08] text-red-300/80'
                            : myAns === val && !isRev ? 'border-white/20 bg-white/[0.08] text-white/80'
                              : 'border-white/[0.06] text-white/28 hover:text-white/50'
                      }`}>
                      {val ? 'Verdadeiro' : 'Falso'}
                    </button>
                  ))}
                </div>
                {isRev && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-[11px] text-white/44 leading-relaxed">{q.explanation}</motion.p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Philosophy Tribunal ─────────────────────────────────────────────────────

const TRIBUNAL_CASES = [
  {
    decision: 'Amazon monitorar produtividade de funcionários de armazém com câmeras e timers ao segundo',
    philosophers: {
      kant: { name: 'Kant', verdict: 'Contra', analysis: 'Tratar pessoas como meios para eficiência viola a dignidade humana. Se universalizado — todo empregador monitorando cada segundo — a relação de confiança entre empregador e empregado é destruída.' },
      aristoteles: { name: 'Aristóteles', verdict: 'Contra', analysis: 'A virtude da temperança exige equilíbrio. Monitoramento total destrói a autonomia, que é necessária para o florescimento humano (eudaimonia). Funcionários vigiados não exercem virtude — exercem obediência.' },
      laoTzu: { name: 'Lao Tzu', verdict: 'Contra', analysis: 'Wu Wei — forçar controle gera resistência. O líder sábio cria condições para que as pessoas produzam naturalmente. Vigilância total é o oposto: é desconfiança institucionalizada.' },
    },
  },
  {
    decision: 'Empresa farmacêutica aumentar preço de medicamento essencial em 5.000% (caso Daraprim/Shkreli)',
    philosophers: {
      rawls: { name: 'Rawls', verdict: 'Contra', analysis: 'Sob o Véu da Ignorância, ninguém escolheria um sistema onde doenças raras significam falência. O Princípio da Diferença exige que desigualdades beneficiem os menos favorecidos — não os explorem.' },
      kant: { name: 'Kant', verdict: 'Contra', analysis: 'Usar a necessidade vital do paciente como alavanca de lucro instrumentaliza seres humanos. Não pode ser universalizado: se toda empresa fizesse isso com produtos essenciais, a sociedade colapsa.' },
      popper: { name: 'Popper', verdict: 'Questiona', analysis: 'A hipótese "o mercado regulará o preço" é testável. O teste falhou: sem concorrentes e com demanda inelástica, o mercado não corrigiu. Evidência empírica refuta a hipótese de autorregulação neste caso.' },
    },
  },
  {
    decision: 'Tesla coletar dados de direção de todos os motoristas para treinar IA de condução autônoma',
    philosophers: {
      sartre: { name: 'Sartre', verdict: 'Condicional', analysis: 'Se o motorista consente livremente e com plena informação, é uma escolha legítima. Má-fé seria consentimento enterrado em 40 páginas de termos que ninguém lê.' },
      kant: { name: 'Kant', verdict: 'Condicional', analysis: 'Se há consentimento informado e os dados são usados para o fim declarado, respeita a autonomia. Se os dados são usados para outros fins não consentidos, viola o imperativo categórico.' },
      aristoteles: { name: 'Aristóteles', verdict: 'A favor', analysis: 'A virtude da prudência (phronesis) pesa benefícios e riscos. Se os dados salvam vidas futuras (reduzindo acidentes), a prudência favorece — desde que com transparência e segurança.' },
    },
  },
  {
    decision: 'Patagonia devolver 100% do lucro para causas ambientais (decisão de Yvon Chouinard, 2022)',
    philosophers: {
      aristoteles: { name: 'Aristóteles', verdict: 'A favor', analysis: 'Generosidade é virtude central. Chouinard demonstra que o propósito da empresa pode transcender o lucro individual. É eudaimonia corporativa — florescimento que vai além do financeiro.' },
      sartre: { name: 'Sartre', verdict: 'A favor', analysis: 'Escolha autêntica. Chouinard não agiu por pressão ou marketing — agiu por convicção pessoal. É o oposto da má-fé: assumiu responsabilidade total por suas escolhas.' },
      rawls: { name: 'Rawls', verdict: 'A favor', analysis: 'Redirecionar lucro para os menos favorecidos (o planeta, comunidades afetadas) é a aplicação direta do Princípio da Diferença. Desigualdade de riqueza justificada apenas se beneficia os mais vulneráveis.' },
    },
  },
  {
    decision: 'China implementar sistema de crédito social que pontua cidadãos por comportamento',
    philosophers: {
      kant: { name: 'Kant', verdict: 'Contra', analysis: 'Viola a autonomia moral fundamental. Pessoas devem agir bem por dever moral, não por medo de punição algorítmica. Um sistema que coage virtude destrói a possibilidade de virtude genuína.' },
      laoTzu: { name: 'Lao Tzu', verdict: 'Contra', analysis: '"Quando o Tao é perdido, surge a virtude. Quando a virtude é perdida, surge a moralidade. Quando a moralidade é perdida, surgem os rituais." O crédito social é o último estágio — controle externo porque o interno falhou.' },
      popper: { name: 'Popper', verdict: 'Contra', analysis: 'Sociedade aberta vs. sociedade fechada. O crédito social é o mecanismo de uma sociedade fechada — suprime dissidência, punibilidade algorítmica, sem possibilidade de refutação. Anti-científico por natureza.' },
    },
  },
  {
    decision: 'OpenAI tornar GPT-4 proprietário após ter começado como organização sem fins lucrativos',
    philosophers: {
      sartre: { name: 'Sartre', verdict: 'Questiona', analysis: 'A promessa original de "IA aberta para a humanidade" criou expectativa legítima. Mudar o modelo é livre escolha — mas negar que houve mudança é má-fé. Autenticidade exige reconhecer: "mudamos porque as circunstâncias mudaram."' },
      rawls: { name: 'Rawls', verdict: 'Contra', analysis: 'Se IA é a tecnologia mais transformadora do século, concentrar acesso nas mãos de quem pode pagar viola o Princípio da Diferença. Sob o Véu da Ignorância, ninguém escolheria um mundo onde IA poderosa é privilégio de poucos.' },
      popper: { name: 'Popper', verdict: 'Condicional', analysis: 'A hipótese "IA aberta é mais perigosa que IA proprietária" é testável. Se modelos abertos (Llama, Mistral) não geraram mais dano que proprietários, a hipótese é falsificada. A decisão deveria ser baseada em evidência, não em medo.' },
    },
  },
]

export function PhilosophyTribunal() {
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})
  const [expandedP, setExpandedP] = useState<string | null>(null)

  const c = TRIBUNAL_CASES[idx]
  const isRevealed = revealed[idx] || false

  const verdictColor = (v: string) => v === 'A favor' ? '#4ade80' : v === 'Contra' ? '#ef4444' : '#f59e0b'

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {TRIBUNAL_CASES.map((_, i) => (
          <button key={i} onClick={() => { setIdx(i); setExpandedP(null) }}
            className={`shrink-0 h-7 w-7 rounded-lg border text-[10px] font-bold transition-all ${
              idx === i ? 'border-white/20 bg-white/[0.08] text-white/88' : 'border-white/[0.06] text-white/24'
            }`}>{i + 1}</button>
        ))}
      </div>

      <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/28">Caso {idx + 1}/{TRIBUNAL_CASES.length}</p>
          <p className="mt-2 text-[14px] text-white/72 leading-relaxed">{c.decision}</p>
        </div>

        {!isRevealed && (
          <button onClick={() => setRevealed(prev => ({ ...prev, [idx]: true }))}
            className="w-full rounded-[0.8rem] border border-white/20 bg-white/[0.06] py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:bg-white/[0.1] transition-all">
            Convocar o Tribunal
          </button>
        )}

        {isRevealed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            {Object.entries(c.philosophers).map(([key, p]) => {
              const isOpen = expandedP === key
              return (
                <motion.div key={key} layout className="rounded-[0.9rem] border border-white/[0.06] overflow-hidden" style={{ background: 'rgba(255,255,255,0.015)' }}>
                  <button onClick={() => setExpandedP(isOpen ? null : key)} className="w-full px-4 py-3 flex items-center justify-between text-left">
                    <p className="text-[12px] font-medium text-white/72">{p.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border" style={{ color: verdictColor(p.verdict), borderColor: `${verdictColor(p.verdict)}33` }}>{p.verdict}</span>
                      <span className="text-white/28 text-[12px]">{isOpen ? '−' : '+'}</span>
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 overflow-hidden">
                        <p className="text-[12px] text-white/50 leading-relaxed">{p.analysis}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button onClick={() => { setIdx(i => Math.max(0, i - 1)); setExpandedP(null) }} disabled={idx === 0}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">← Anterior</button>
        <button onClick={() => { setIdx(i => Math.min(TRIBUNAL_CASES.length - 1, i + 1)); setExpandedP(null) }} disabled={idx === TRIBUNAL_CASES.length - 1}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">Próximo →</button>
      </div>
    </div>
  )
}

// ── Investment Calculator ────────────────────────────────────────────────────

const INV_PRESETS = [
  { name: 'Expansão de Loja', investment: 500000, flows: [150000, 200000, 250000, 180000, 160000], rate: 12 },
  { name: 'Novo Software SaaS', investment: 200000, flows: [30000, 80000, 150000, 200000, 220000], rate: 15 },
  { name: 'Máquina Industrial', investment: 800000, flows: [200000, 220000, 240000, 260000, 280000], rate: 10 },
]

function calcVPL(investment: number, flows: number[], rate: number): number {
  return flows.reduce((sum, fc, i) => sum + fc / Math.pow(1 + rate / 100, i + 1), 0) - investment
}

function calcTIR(investment: number, flows: number[]): number {
  let low = -50, high = 200
  for (let iter = 0; iter < 100; iter++) {
    const mid = (low + high) / 2
    const vpl = [-investment, ...flows].reduce((sum, fc, i) => sum + fc / Math.pow(1 + mid / 100, i), 0)
    if (vpl > 0) low = mid; else high = mid
  }
  return (low + high) / 2
}

function calcPayback(investment: number, flows: number[]): number {
  let acc = -investment
  for (let i = 0; i < flows.length; i++) {
    acc += flows[i]
    if (acc >= 0) return i + (acc - flows[i] > 0 ? 0 : (investment - flows.slice(0, i).reduce((a, b) => a + b, 0)) / flows[i])
  }
  return -1
}

export function InvestmentCalculator() {
  const [preset, setPreset] = useState(0)
  const [investment, setInvestment] = useState(INV_PRESETS[0].investment)
  const [flows, setFlows] = useState(INV_PRESETS[0].flows)
  const [rate, setRate] = useState(INV_PRESETS[0].rate)

  const loadPreset = (i: number) => {
    setPreset(i)
    setInvestment(INV_PRESETS[i].investment)
    setFlows([...INV_PRESETS[i].flows])
    setRate(INV_PRESETS[i].rate)
  }

  const vpl = calcVPL(investment, flows, rate)
  const tir = calcTIR(investment, flows)
  const payback = calcPayback(investment, flows)

  const updateFlow = (i: number, val: number) => {
    const newFlows = [...flows]
    newFlows[i] = val
    setFlows(newFlows)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {INV_PRESETS.map((p, i) => (
          <button key={i} onClick={() => loadPreset(i)}
            className={`flex-1 rounded-[0.75rem] border px-2 py-2 text-[10px] font-semibold text-center transition-all ${
              preset === i ? 'border-white/20 bg-white/[0.08] text-white/88' : 'border-white/[0.06] text-white/28'
            }`}>{p.name}</button>
        ))}
      </div>

      <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        {/* Investment */}
        <div className="space-y-1">
          <div className="flex justify-between"><p className="text-[9px] uppercase tracking-[0.22em] text-white/28">Investimento Inicial</p><p className="text-[13px] font-bold text-red-400/70">-R$ {investment.toLocaleString('pt-BR')}</p></div>
          <input type="range" min={50000} max={2000000} step={50000} value={investment} onChange={e => setInvestment(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-white/[0.08] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/60 [&::-webkit-slider-thumb]:cursor-pointer" />
        </div>

        {/* Discount rate */}
        <div className="space-y-1">
          <div className="flex justify-between"><p className="text-[9px] uppercase tracking-[0.22em] text-white/28">Taxa de Desconto</p><p className="text-[13px] font-bold text-white/60">{rate}% a.a.</p></div>
          <input type="range" min={5} max={30} value={rate} onChange={e => setRate(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-white/[0.08] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/60 [&::-webkit-slider-thumb]:cursor-pointer" />
        </div>

        {/* Cash flows */}
        <div className="space-y-2">
          <p className="text-[9px] uppercase tracking-[0.22em] text-white/28">Fluxos de Caixa Anuais</p>
          {flows.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <p className="text-[10px] text-white/28 w-12 shrink-0">Ano {i + 1}</p>
              <input type="range" min={0} max={500000} step={10000} value={f} onChange={e => updateFlow(i, Number(e.target.value))}
                className="flex-1 h-1 rounded-full appearance-none bg-white/[0.06] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-400/60 [&::-webkit-slider-thumb]:cursor-pointer" />
              <p className="text-[11px] font-medium text-green-400/60 w-16 text-right">R$ {(f / 1000).toFixed(0)}K</p>
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06]">
          <div className="rounded-[0.7rem] border border-white/[0.06] p-3 text-center">
            <p className="text-[8px] uppercase tracking-[0.15em] text-white/24">VPL</p>
            <p className="text-[15px] font-bold mt-0.5" style={{ color: vpl >= 0 ? '#4ade80' : '#ef4444' }}>
              R$ {(vpl / 1000).toFixed(0)}K
            </p>
            <p className="text-[8px] mt-0.5" style={{ color: vpl >= 0 ? '#4ade8088' : '#ef444488' }}>{vpl >= 0 ? 'ACEITAR' : 'REJEITAR'}</p>
          </div>
          <div className="rounded-[0.7rem] border border-white/[0.06] p-3 text-center">
            <p className="text-[8px] uppercase tracking-[0.15em] text-white/24">TIR</p>
            <p className="text-[15px] font-bold mt-0.5" style={{ color: tir > rate ? '#4ade80' : '#ef4444' }}>
              {tir.toFixed(1)}%
            </p>
            <p className="text-[8px] mt-0.5 text-white/24">vs {rate}% custo</p>
          </div>
          <div className="rounded-[0.7rem] border border-white/[0.06] p-3 text-center">
            <p className="text-[8px] uppercase tracking-[0.15em] text-white/24">Payback</p>
            <p className="text-[15px] font-bold mt-0.5 text-blue-400/70">
              {payback > 0 ? `${payback.toFixed(1)} anos` : 'N/A'}
            </p>
            <p className="text-[8px] mt-0.5 text-white/24">simples</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Break-Even Simulator ────────────────────────────────────────────────────

const BE_PRESETS = [
  { name: 'Cafeteria', fixedCost: 15000, price: 12, varCost: 4 },
  { name: 'SaaS B2B', fixedCost: 45000, price: 199, varCost: 25 },
  { name: 'E-commerce', fixedCost: 25000, price: 89, varCost: 35 },
]

export function BreakevenSimulator() {
  const [presetIdx, setPresetIdx] = useState(0)
  const [fixedCost, setFixedCost] = useState(BE_PRESETS[0].fixedCost)
  const [price, setPrice] = useState(BE_PRESETS[0].price)
  const [varCost, setVarCost] = useState(BE_PRESETS[0].varCost)

  const loadPreset = (i: number) => {
    setPresetIdx(i)
    setFixedCost(BE_PRESETS[i].fixedCost)
    setPrice(BE_PRESETS[i].price)
    setVarCost(BE_PRESETS[i].varCost)
  }

  const mc = price - varCost
  const mcPct = price > 0 ? (mc / price) * 100 : 0
  const beUnits = mc > 0 ? Math.ceil(fixedCost / mc) : Infinity
  const beRevenue = beUnits * price
  const isValid = mc > 0

  // Sensitivity: +20% fixed cost
  const beSensFc = mc > 0 ? Math.ceil((fixedCost * 1.2) / mc) : Infinity
  // Sensitivity: -10% price
  const mcLower = (price * 0.9) - varCost
  const beSensPrice = mcLower > 0 ? Math.ceil(fixedCost / mcLower) : Infinity
  // Sensitivity: +25% var cost
  const mcHigherVar = price - (varCost * 1.25)
  const beSensVar = mcHigherVar > 0 ? Math.ceil(fixedCost / mcHigherVar) : Infinity

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {BE_PRESETS.map((p, i) => (
          <button key={i} onClick={() => loadPreset(i)}
            className={`flex-1 rounded-[0.75rem] border px-2 py-2 text-[10px] font-semibold text-center transition-all ${
              presetIdx === i ? 'border-white/20 bg-white/[0.08] text-white/88' : 'border-white/[0.06] text-white/28'
            }`}>{p.name}</button>
        ))}
      </div>

      <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        {/* Sliders */}
        {[
          { label: 'Custo Fixo/mês', value: fixedCost, set: setFixedCost, min: 2000, max: 100000, step: 1000, format: (v: number) => `R$ ${v.toLocaleString('pt-BR')}`, color: '#f97316' },
          { label: 'Preço de Venda', value: price, set: setPrice, min: 5, max: 500, step: 1, format: (v: number) => `R$ ${v}`, color: '#4ade80' },
          { label: 'Custo Variável', value: varCost, set: setVarCost, min: 1, max: 300, step: 1, format: (v: number) => `R$ ${v}`, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="space-y-1">
            <div className="flex justify-between">
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/28">{s.label}</p>
              <p className="text-[13px] font-bold" style={{ color: s.color }}>{s.format(s.value)}</p>
            </div>
            <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={e => s.set(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none bg-white/[0.08] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/60 [&::-webkit-slider-thumb]:cursor-pointer" />
          </div>
        ))}

        {/* Results */}
        {isValid ? (
          <motion.div animate={{ opacity: 1 }} className="space-y-3 pt-2 border-t border-white/[0.06]">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-[0.7rem] border border-white/[0.06] p-3 text-center">
                <p className="text-[8px] uppercase tracking-[0.15em] text-white/24">Margem Contribuição</p>
                <p className="text-[14px] font-bold text-white/70 mt-0.5">R$ {mc.toFixed(2)}</p>
                <p className="text-[9px] text-white/28">{mcPct.toFixed(1)}%</p>
              </div>
              <div className="rounded-[0.7rem] border border-white/[0.06] p-3 text-center">
                <p className="text-[8px] uppercase tracking-[0.15em] text-white/24">Break-Even</p>
                <p className="text-[14px] font-bold text-amber-400/70 mt-0.5">{beUnits.toLocaleString('pt-BR')} un.</p>
                <p className="text-[9px] text-white/28">por mês</p>
              </div>
              <div className="rounded-[0.7rem] border border-white/[0.06] p-3 text-center">
                <p className="text-[8px] uppercase tracking-[0.15em] text-white/24">Receita Mínima</p>
                <p className="text-[14px] font-bold text-blue-400/70 mt-0.5">R$ {(beRevenue / 1000).toFixed(1)}K</p>
                <p className="text-[9px] text-white/28">por mês</p>
              </div>
            </div>

            {/* Sensitivity */}
            <div className="rounded-[0.8rem] border border-white/[0.06] p-3 space-y-2" style={{ background: 'rgba(255,255,255,0.015)' }}>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/28">Análise de Sensibilidade</p>
              {[
                { label: 'Custo fixo +20%', value: beSensFc, diff: beSensFc - beUnits },
                { label: 'Preço -10%', value: beSensPrice, diff: beSensPrice - beUnits },
                { label: 'Custo variável +25%', value: beSensVar, diff: beSensVar - beUnits },
              ].map(s => (
                <div key={s.label} className="flex justify-between items-center">
                  <p className="text-[11px] text-white/40">{s.label}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-medium text-white/60">{s.value === Infinity ? 'Inviável' : `${s.value.toLocaleString('pt-BR')} un.`}</p>
                    {s.value !== Infinity && <span className="text-[9px] text-red-400/60">+{s.diff}</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="rounded-[0.8rem] border border-red-500/20 p-3 text-center" style={{ background: 'rgba(239,68,68,0.04)' }}>
            <p className="text-[12px] text-red-400/70 font-semibold">Preço abaixo do custo variável — modelo inviável!</p>
            <p className="text-[10px] text-white/36 mt-1">Cada unidade vendida AUMENTA o prejuízo.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── KPI Dashboard ───────────────────────────────────────────────────────────

const KPI_STARTUPS = [
  {
    name: 'CloudTask (SaaS B2B)',
    sector: 'Software de gestão de projetos',
    kpis: {
      mrr: { value: 'R$ 380K', trend: '+8%/mês', status: 'good' },
      arr: { value: 'R$ 4.56M', trend: '', status: 'good' },
      cac: { value: 'R$ 2.800', trend: '+15% vs trimestre anterior', status: 'bad' },
      ltv: { value: 'R$ 9.200', trend: '-5% vs trimestre anterior', status: 'warning' },
      ltvCac: { value: '3.3x', trend: 'Era 4.1x há 6 meses', status: 'warning' },
      churn: { value: '4.2%/mês', trend: 'Era 2.8% há 6 meses', status: 'bad' },
      nps: { value: '42', trend: 'Era 58 há 6 meses', status: 'bad' },
      marginBruta: { value: '78%', trend: 'Estável', status: 'good' },
      burnRate: { value: 'R$ 120K/mês', trend: '', status: 'warning' },
      runway: { value: '14 meses', trend: 'Com caixa atual de R$ 1.68M', status: 'warning' },
    },
    hiddenProblem: 'Churn acelerando (de 2.8% para 4.2% em 6 meses) está destruindo o LTV e comprimindo LTV/CAC. Se churn continuar subindo, o modelo fica inviável em ~8 meses. O NPS caindo de 58 para 42 confirma insatisfação crescente. Prioridade #1: descobrir POR QUÊ clientes estão saindo (cohort analysis + entrevistas de churn).',
    actions: ['Análise de cohort para identificar QUANDO e QUAL perfil de cliente está churnando', 'Entrevistas com últimos 30 churns para diagnosticar causa raiz', 'Pausar aumento de CAC (marketing) até estabilizar retenção — adquirir mais clientes que churnam é queimar dinheiro', 'Meta: churn abaixo de 3% em 90 dias antes de voltar a investir em growth'],
  },
  {
    name: 'ModaViva (E-commerce)',
    sector: 'Moda feminina D2C',
    kpis: {
      mrr: { value: 'R$ 920K', trend: '+3%/mês', status: 'warning' },
      ticketMedio: { value: 'R$ 189', trend: '-12% vs ano anterior', status: 'bad' },
      cac: { value: 'R$ 85', trend: '+40% em 12 meses', status: 'bad' },
      ltv: { value: 'R$ 520', trend: 'Estável', status: 'good' },
      ltvCac: { value: '6.1x', trend: 'Era 10.8x há 12 meses', status: 'warning' },
      conversao: { value: '2.1%', trend: 'Estável', status: 'good' },
      recompra: { value: '28% em 90 dias', trend: '-8pp vs ano anterior', status: 'bad' },
      marginBruta: { value: '52%', trend: '-5pp vs ano anterior', status: 'bad' },
      burnRate: { value: 'Cash positive', trend: 'EBITDA R$ 45K/mês', status: 'good' },
      runway: { value: 'Infinito (lucrativa)', trend: '', status: 'good' },
    },
    hiddenProblem: 'CAC subiu 40% em 12 meses — provavelmente por saturação de canal (Meta Ads ficando mais caro) ou competição. Ao mesmo tempo, ticket médio caiu 12% e recompra caiu 8pp. A empresa está gastando mais para trazer clientes que compram menos e voltam menos. A margem bruta caindo 5pp sugere que está dando descontos para compensar.',
    actions: ['Diversificar canais de aquisição: testar SEO, influencers, programa de indicação (reduzir dependência de paid)', 'Investigar queda de ticket médio: mix de produtos mudou? Está promovendo mais itens baratos?', 'Programa de fidelidade para atacar recompra: cashback, early access, personalização', 'Parar de dar descontos que destroem margem — investir em percepção de valor em vez de preço'],
  },
  {
    name: 'DeliverEats (Marketplace)',
    sector: 'Delivery de restaurantes regional',
    kpis: {
      gmv: { value: 'R$ 4.2M/mês', trend: '+25%/mês', status: 'good' },
      takeRate: { value: '18%', trend: 'Estável', status: 'good' },
      receita: { value: 'R$ 756K/mês', trend: '+25%/mês', status: 'good' },
      cac: { value: 'R$ 12 (consumidor)', trend: '+60% em 6 meses', status: 'bad' },
      pedidosMes: { value: '89.000', trend: '+30%/mês', status: 'good' },
      ticketMedio: { value: 'R$ 47', trend: '-8%', status: 'warning' },
      restaurantes: { value: '340 ativos', trend: '+15/mês', status: 'good' },
      tempoEntrega: { value: '42 min', trend: 'Era 32 min há 3 meses', status: 'bad' },
      burnRate: { value: 'R$ 380K/mês', trend: 'Acelerando', status: 'bad' },
      runway: { value: '7 meses', trend: 'Com caixa de R$ 2.66M', status: 'bad' },
    },
    hiddenProblem: 'Crescimento de GMV (+25%) mascara problemas graves: CAC disparou (+60%), tempo de entrega piorou (32→42 min), e burn rate está consumindo o runway em 7 meses. A empresa está crescendo rápido DEMAIS — a operação (logística, entregadores) não acompanha. Clientes vão começar a reclamar e churnar se o tempo de entrega não melhorar.',
    actions: ['FREIO no growth: reduzir investimento em aquisição até operação estabilizar', 'Prioridade #1: tempo de entrega. Contratar mais entregadores na região saturada, otimizar roteirização', 'Levantar bridge round urgente ou cortar burn rate em 40% — 7 meses de runway com burn acelerando é emergência', 'Parar de adicionar restaurantes em regiões onde logística já está no limite'],
  },
]

const STATUS_COLORS: Record<string, string> = { good: '#4ade80', warning: '#f59e0b', bad: '#ef4444' }

export function KPIDashboard() {
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  const startup = KPI_STARTUPS[idx]
  const isRevealed = revealed[idx] || false

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {KPI_STARTUPS.map((s, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`flex-1 rounded-[0.75rem] border px-2 py-2 text-[10px] font-semibold text-center transition-all ${
              idx === i ? 'border-white/20 bg-white/[0.08] text-white/88' : 'border-white/[0.06] text-white/28'
            }`}>{s.name.split(' ')[0]}</button>
        ))}
      </div>

      <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/28">{startup.sector}</p>
          <p className="mt-1 text-[1rem] font-semibold text-white/90">{startup.name}</p>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(startup.kpis).map(([key, kpi]) => (
            <div key={key} className="rounded-[0.6rem] border border-white/[0.04] px-3 py-2" style={{ background: 'rgba(255,255,255,0.015)' }}>
              <p className="text-[8px] uppercase tracking-[0.15em] text-white/24">{formatKpiLabel(key)}</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <p className="text-[13px] font-bold" style={{ color: STATUS_COLORS[kpi.status] }}>{kpi.value}</p>
                {kpi.trend && <p className="text-[8px] text-white/28">{kpi.trend}</p>}
              </div>
            </div>
          ))}
        </div>

        {!isRevealed && (
          <button onClick={() => setRevealed(prev => ({ ...prev, [idx]: true }))}
            className="w-full rounded-[0.8rem] border border-white/20 bg-white/[0.06] py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:bg-white/[0.1] transition-all">
            Revelar Diagnóstico
          </button>
        )}

        {isRevealed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-2 border-t border-white/[0.06]">
            <div className="rounded-[0.8rem] border border-red-500/15 p-4" style={{ background: 'rgba(239,68,68,0.03)' }}>
              <p className="text-[9px] uppercase tracking-[0.2em] text-red-400/50 mb-1">Problema Escondido</p>
              <p className="text-[12px] text-white/56 leading-relaxed">{startup.hiddenProblem}</p>
            </div>
            <div className="rounded-[0.8rem] border border-green-500/15 p-4 space-y-2" style={{ background: 'rgba(34,197,94,0.03)' }}>
              <p className="text-[9px] uppercase tracking-[0.2em] text-green-400/50">Ações Recomendadas</p>
              {startup.actions.map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[10px] font-bold text-green-400/50 mt-0.5 shrink-0">{i + 1}.</span>
                  <p className="text-[11px] text-white/50 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function formatKpiLabel(key: string): string {
  const map: Record<string, string> = {
    mrr: 'MRR', arr: 'ARR', cac: 'CAC', ltv: 'LTV', ltvCac: 'LTV/CAC', churn: 'Churn',
    nps: 'NPS', marginBruta: 'Margem Bruta', burnRate: 'Burn Rate', runway: 'Runway',
    ticketMedio: 'Ticket Médio', conversao: 'Conversão', recompra: 'Recompra',
    gmv: 'GMV', takeRate: 'Take Rate', receita: 'Receita', pedidosMes: 'Pedidos/Mês',
    restaurantes: 'Restaurantes', tempoEntrega: 'Tempo Entrega',
  }
  return map[key] || key
}

// ── Data to Decision ────────────────────────────────────────────────────────

const D2D_CASES = [
  {
    company: 'FitPro App (Fitness)',
    context: 'App de treino com 50K usuários. CEO quer investir R$ 500K em campanhas de aquisição para chegar a 200K.',
    data: [
      { metric: 'Usuários totais', value: '50.000' },
      { metric: 'DAU (diário ativo)', value: '8.200 (16.4%)' },
      { metric: 'Retenção D7', value: '22%' },
      { metric: 'Retenção D30', value: '8%' },
      { metric: 'Conversão free→paid', value: '1.8%' },
      { metric: 'LTV (paid)', value: 'R$ 180' },
      { metric: 'CAC atual', value: 'R$ 22' },
      { metric: 'NPS', value: '31' },
    ],
    wrongConclusion: 'LTV/CAC = 8.2x — excelente! Vamos investir pesado em aquisição.',
    rightConclusion: 'Retenção D30 de 8% significa que 92% dos usuários vão embora em 1 mês. O LTV de R$ 180 é dos 1.8% que convertem — não do total. LTV real por usuário adquirido = R$ 180 × 0.018 = R$ 3.24. LTV/CAC real = 3.24/22 = 0.15x. A empresa PERDE R$ 18.76 por cada usuário adquirido.',
    recommendation: 'NÃO investir em aquisição. Prioridade absoluta: melhorar retenção e conversão ANTES de escalar. Investir R$ 500K em aquisição com esses números = queimar R$ 500K. Meta: retenção D30 > 25% e conversão > 5% antes de escalar.',
  },
  {
    company: 'GourmetBox (Assinatura)',
    context: 'Box mensal de alimentos gourmet. 3.200 assinantes. Margem caiu 8pp no último ano.',
    data: [
      { metric: 'Assinantes ativos', value: '3.200' },
      { metric: 'Ticket mensal', value: 'R$ 149' },
      { metric: 'Custo dos produtos', value: 'R$ 72/box (era R$ 58)' },
      { metric: 'Custo logístico', value: 'R$ 28/box (era R$ 22)' },
      { metric: 'Margem bruta', value: '33% (era 41%)' },
      { metric: 'Churn mensal', value: '6.5%' },
      { metric: 'NPS', value: '62' },
      { metric: 'Motivo #1 de churn', value: '"Caro demais" (45%)' },
    ],
    wrongConclusion: 'NPS de 62 é bom e assinantes gostam do produto. Só precisamos aumentar preço para recuperar margem.',
    rightConclusion: 'Custo de produtos subiu 24% e logística 27% — os dois maiores custos dispararam. NPS é bom MAS o motivo #1 de churn é "caro demais". Aumentar preço vai ACELERAR churn. Com churn de 6.5%/mês, metade dos assinantes some em 10 meses.',
    recommendation: 'Atacar custos, não preço: (1) Renegociar fornecedores ou mudar mix de produtos para recuperar R$ 14/box, (2) Otimizar logística — consolidar envios, negociar frete por volume, (3) Criar tier mais barato (R$ 99 com menos itens) para reter os "caro demais", (4) Programa de indicação para reduzir CAC e compensar churn.',
  },
  {
    company: 'EduTech Pro (Cursos Online)',
    context: 'Plataforma de cursos corporativos. 180 empresas clientes. Time comercial pede contratar mais 5 vendedores.',
    data: [
      { metric: 'Clientes ativos', value: '180 empresas' },
      { metric: 'Ticket médio anual', value: 'R$ 42K' },
      { metric: 'Ciclo de vendas', value: '95 dias' },
      { metric: 'Taxa de conversão', value: '12% (lead→cliente)' },
      { metric: 'Vendedores atuais', value: '8' },
      { metric: 'Leads por vendedor/mês', value: '45' },
      { metric: 'Capacidade máx/vendedor', value: '~50 leads/mês' },
      { metric: 'Leads totais/mês', value: '280' },
    ],
    wrongConclusion: 'Temos 280 leads e 8 vendedores atendendo 360 leads/mês (capacidade). Podemos lidar com os leads atuais sem contratar.',
    rightConclusion: 'Na verdade: 280 leads ÷ 8 vendedores = 35 leads/vendedor. Capacidade é 50. Ou seja, cada vendedor está com 70% de capacidade. O problema NÃO é falta de vendedores — é falta de leads. Contratar +5 vendedores = 13 vendedores atendendo 21.5 leads cada = capacidade ociosa de 57%.',
    recommendation: 'Não contratar vendedores. Investir em geração de demanda: (1) Marketing de conteúdo para gerar leads qualificados, (2) Programa de indicação com clientes atuais, (3) Parcerias com consultorias de RH. Meta: chegar a 500 leads/mês antes de contratar o 9º vendedor. Se cada lead adicional custa R$ 200 vs custo de vendedor de R$ 15K/mês, o ROI de marketing é 10x melhor.',
  },
]

export function DataToDecision() {
  const [idx, setIdx] = useState(0)
  const [stage, setStage] = useState<'data' | 'wrong' | 'right'>('data')

  const c = D2D_CASES[idx]

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {D2D_CASES.map((d, i) => (
          <button key={i} onClick={() => { setIdx(i); setStage('data') }}
            className={`flex-1 rounded-[0.75rem] border px-2 py-2 text-[10px] font-semibold text-center transition-all ${
              idx === i ? 'border-white/20 bg-white/[0.08] text-white/88' : 'border-white/[0.06] text-white/28'
            }`}>{d.company.split(' ')[0]}</button>
        ))}
      </div>

      <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/28">{c.company}</p>
          <p className="mt-1 text-[12px] text-white/50">{c.context}</p>
        </div>

        {/* Data */}
        <div className="space-y-1.5">
          {c.data.map((d, i) => (
            <div key={i} className="flex justify-between items-center rounded-[0.5rem] border border-white/[0.04] px-3 py-1.5">
              <p className="text-[10px] text-white/36">{d.metric}</p>
              <p className="text-[11px] font-medium text-white/68">{d.value}</p>
            </div>
          ))}
        </div>

        {stage === 'data' && (
          <button onClick={() => setStage('wrong')}
            className="w-full rounded-[0.8rem] border border-white/20 bg-white/[0.06] py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:bg-white/[0.1] transition-all">
            Ver Análise
          </button>
        )}

        {stage === 'wrong' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="rounded-[0.8rem] border border-red-500/15 p-4" style={{ background: 'rgba(239,68,68,0.03)' }}>
              <p className="text-[9px] uppercase tracking-[0.2em] text-red-400/50 mb-1">Conclusão Errada (comum)</p>
              <p className="text-[12px] text-white/50 leading-relaxed">{c.wrongConclusion}</p>
            </div>
            <button onClick={() => setStage('right')}
              className="w-full rounded-[0.8rem] border border-white/15 bg-white/[0.04] py-2.5 text-[10px] uppercase tracking-[0.18em] text-white/40 hover:text-white/60 transition-all">
              Ver Análise Correta
            </button>
          </motion.div>
        )}

        {stage === 'right' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="rounded-[0.8rem] border border-red-500/15 p-3" style={{ background: 'rgba(239,68,68,0.03)' }}>
              <p className="text-[9px] uppercase tracking-[0.2em] text-red-400/40 mb-1">Conclusão Errada</p>
              <p className="text-[11px] text-white/36 leading-relaxed">{c.wrongConclusion}</p>
            </div>
            <div className="rounded-[0.8rem] border border-green-500/15 p-4" style={{ background: 'rgba(34,197,94,0.03)' }}>
              <p className="text-[9px] uppercase tracking-[0.2em] text-green-400/50 mb-1">Análise Correta</p>
              <p className="text-[12px] text-white/56 leading-relaxed">{c.rightConclusion}</p>
            </div>
            <div className="rounded-[0.8rem] border border-blue-500/15 p-4" style={{ background: 'rgba(96,165,250,0.03)' }}>
              <p className="text-[9px] uppercase tracking-[0.2em] text-blue-400/50 mb-1">Recomendação</p>
              <p className="text-[12px] text-white/56 leading-relaxed">{c.recommendation}</p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button onClick={() => { setIdx(i => Math.max(0, i - 1)); setStage('data') }} disabled={idx === 0}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">← Anterior</button>
        <button onClick={() => { setIdx(i => Math.min(D2D_CASES.length - 1, i + 1)); setStage('data') }} disabled={idx === D2D_CASES.length - 1}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">Próximo →</button>
      </div>
    </div>
  )
}

// ── Export map ───────────────────────────────────────────────────────────────

export const SIM_M4: Record<string, React.ComponentType> = {
  'fallacy-detector': FallacyDetector,
  'ethics-dilemmas': EthicsDilemmas,
  'profit-optimization': ProfitOptimization,
  'data-interpretation': DataInterpretation,
  'philosophy-tribunal': PhilosophyTribunal,
  'investment-calculator': InvestmentCalculator,
  'breakeven-simulator': BreakevenSimulator,
  'kpi-dashboard': KPIDashboard,
  'data-to-decision': DataToDecision,
}
