'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GREEN = '#1e8449'
const RED = '#c0392b'
const BLUE = '#2e86c1'
const AMBER = '#9a7d0a'

// ── OBI Project Builder ──────────────────────────────────────────────────────

type Question = {
  text: string
  options: string[]
  correct: number
  explanation: string
}

type Scenario = {
  company: string
  sector: string
  context: string
  challenge: string
  questions: Question[]
}

const SCENARIOS: Scenario[] = [
  {
    company: 'Distribuidora Nacional S.A.',
    sector: 'Atacado / Distribuição',
    context: '120 lojas próprias, 500 mil transações/mês. Os gestores regionais tomam decisões com base em planilhas Excel enviadas por e-mail toda segunda-feira. Dados de diferentes lojas chegam em formatos incompatíveis.',
    challenge: 'Criar um projeto de OBI para que os gestores regionais acompanhem o desempenho de vendas em tempo real, com análise por produto, região e vendedor.',
    questions: [
      {
        text: 'Qual modelo de dados você escolhe para o Data Warehouse?',
        options: [
          'Star Schema — tabela fato central com dimensões desnormalizadas',
          'Snowflake Schema — todas as dimensões normalizadas em sub-tabelas',
          'OLTP direto — conectar o BI ao banco transacional do ERP',
          'Banco NoSQL — flexibilidade total sem esquema fixo',
        ],
        correct: 0,
        explanation: 'Star Schema é ideal aqui. Com 500k transações/mês, o desempenho de consulta é prioridade — dimensões desnormalizadas eliminam joins desnecessários. OLTP direto degradaria o ERP (erro clássico). Snowflake só seria justificável se houvesse hierarquias geográficas muito profundas.',
      },
      {
        text: 'Qual ferramenta de BI você recomenda para os gestores regionais?',
        options: [
          'Power BI — integração com Excel existente, curva de aprendizado baixa',
          'Tableau — máxima flexibilidade visual, referência em análise avançada',
          'Apache Superset — open-source, sem custo de licença',
          'Crystal Reports — relatórios estruturados para distribuição por e-mail',
        ],
        correct: 0,
        explanation: 'Power BI é a escolha certa. Os gestores já usam Excel — a curva de aprendizado é a mais baixa do mercado. A integração nativa com o ecossistema Microsoft facilita o deploy. Tableau seria ótimo, mas exige analistas mais avançados. Crystal Reports é legado — não tem interatividade real.',
      },
      {
        text: 'Qual é o KPI mais estratégico para o primeiro dashboard?',
        options: [
          'Receita Total por Região — soma de vendas agrupada por área geográfica',
          'Sell-Through por SKU por Loja — % do estoque vendido por produto/loja',
          'Número de Transações por Dia — volume operacional diário',
          'Faturamento vs. Meta por Vendedor — atingimento individual de cotas',
        ],
        correct: 1,
        explanation: 'Sell-Through por SKU por Loja é o KPI mais acionável. Ele mostra exatamente o que vende em cada loja, permitindo decisões de reposição, promoção e mix. Receita total é importante, mas não revela onde agir. O Magazine Luiza descobriu esse mesmo insight ao fazer o levantamento de requisitos com os gestores regionais.',
      },
    ],
  },
  {
    company: 'HealthTech Diagnósticos',
    sector: 'Saúde / Tecnologia',
    context: 'Rede de 45 clínicas, 3 sistemas diferentes (agendamento, prontuário, faturamento). Dados não integrados. A diretoria toma decisões com base em relatórios manuais do setor financeiro — que chegam com 15 dias de atraso.',
    challenge: 'Construir um projeto de BI integrado que elimine o silos de dados, reduza o tempo de geração de relatórios de 15 dias para menos de 24 horas e permita análise preditiva de demanda por especialidade.',
    questions: [
      {
        text: 'Qual é a primeira fase crítica do projeto?',
        options: [
          'Escolher imediatamente a ferramenta de BI e começar os dashboards',
          'Levantamento de requisitos — entrevistar médicos, gestores e equipe financeira',
          'Instalar o Data Warehouse e iniciar o ETL dos 3 sistemas',
          'Contratar um consultor de Power BI para acelerar o deploy',
        ],
        correct: 1,
        explanation: 'Levantamento de requisitos é sempre a primeira fase. Sem saber quais decisões precisam ser suportadas, você corre o risco de construir o projeto técnico perfeito para responder às perguntas erradas. A metodologia Kimball é explícita: "Business requirements first, technology last." Começar pela ferramenta é o erro mais comum — e mais caro.',
      },
      {
        text: 'Como você trata os dados dos 3 sistemas incompatíveis?',
        options: [
          'Conectar o BI diretamente nos 3 bancos via SQL — mais simples',
          'Pedir para cada sistema exportar CSV toda segunda-feira',
          'Construir um pipeline ETL que extrai, padroniza e carrega em um DW central',
          'Migrar todos os dados para um único sistema antes de começar o BI',
        ],
        correct: 2,
        explanation: 'ETL é a resposta certa. Um pipeline que extrai dos 3 sistemas, transforma (padroniza nomenclaturas, resolve conflitos, trata nulos) e carrega em um DW central é a arquitetura correta. Conectar direto em 3 bancos diferentes cria um pesadelo de joins e degrada todos os sistemas. Migrar tudo primeiro é um projeto de 18 meses — paralisa o negócio.',
      },
      {
        text: 'Qual protótipo apresentar para validação da diretoria antes do deploy?',
        options: [
          'Wireframe em papel mostrando o layout dos dashboards planejados',
          'Mockup no Figma com dados fictícios simulando a aparência final',
          'Protótipo funcional no Power BI com amostra real de 3 meses de dados',
          'Apresentação em PowerPoint com prints de exemplos de outros setores',
        ],
        correct: 2,
        explanation: 'Protótipo funcional com dados reais é o mais eficaz para validação executiva. A diretoria consegue ver suas próprias métricas, identificar inconsistências de dados e dar feedback concreto. Wireframes são bons para analistas, mas não engajam executivos. Dados reais expõem problemas de ETL cedo — antes que se tornem caros.',
      },
    ],
  },
  {
    company: 'FinançaFácil Fintech',
    sector: 'Serviços Financeiros / Fintech',
    context: 'Startup com 200k clientes, crescimento de 40% ao mês. Time de 3 analistas de dados usando SQL direto no banco transacional para gerar relatórios. O banco está ficando lento. O CEO quer um dashboard executivo em tempo real para acompanhar métricas de crescimento.',
    challenge: 'Estruturar a arquitetura de dados para suportar o crescimento acelerado, separar OLTP de OLAP e entregar um dashboard executivo com as principais métricas de uma fintech.',
    questions: [
      {
        text: 'Qual é o problema arquitetural mais urgente?',
        options: [
          'Migrar para um banco de dados mais moderno (PostgreSQL → MySQL)',
          'Separar OLTP (transacional) de OLAP (analítico) com um Data Warehouse',
          'Contratar mais analistas para dividir o trabalho de SQL',
          'Limitar o acesso dos analistas ao banco para reduzir a carga',
        ],
        correct: 1,
        explanation: 'A separação OLTP/OLAP é a solução correta. Inmon (1990) definiu isso: sistemas transacionais são otimizados para escrita (inserir transações rápido); sistemas analíticos são otimizados para leitura (varrer milhões de registros). Rodar relatórios pesados no banco transacional é como usar a cozinha do restaurante para fazer reuniões — todos saem prejudicados.',
      },
      {
        text: 'Quais KPIs compõem o dashboard executivo de uma fintech?',
        options: [
          'Número de linhas de código, uptime do sistema e tickets de suporte',
          'MRR (Receita Recorrente Mensal), CAC, LTV, Churn Rate e NPS',
          'Total de transações, média de transações por cliente e pico de uso',
          'Receita bruta, receita líquida e EBITDA mensais',
        ],
        correct: 1,
        explanation: 'MRR, CAC, LTV, Churn e NPS são as métricas norte de qualquer fintech. MRR mede crescimento de receita recorrente. CAC/LTV define a sustentabilidade do modelo (LTV deve ser ≥ 3x CAC). Churn Rate indica saúde da retenção. NPS antecipa problemas antes que virem churn. São as perguntas que o CEO de uma fintech acorda respondendo todo dia.',
      },
      {
        text: 'Qual ferramenta de BI é mais adequada para uma fintech em crescimento acelerado?',
        options: [
          'Crystal Reports — estabilidade e relatórios estruturados',
          'Metabase — open-source, deploy rápido, acessível para o time técnico',
          'Power BI — mais barato, integração com Excel do time financeiro',
          'QlikView — análise associativa avançada para padrões complexos',
        ],
        correct: 1,
        explanation: 'Metabase é ideal para fintechs early-stage. Open-source (custo zero), deploy em horas, interface amigável para o time técnico e não-técnico. Conecta diretamente ao DW, permite criar dashboards sem SQL. À medida que a empresa cresce, migrar para Power BI ou Tableau é natural — Metabase serve como ponte de baixíssimo custo de oportunidade.',
      },
    ],
  },
]

export function OBIProjectBuilder() {
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [questionIdx, setQuestionIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [finished, setFinished] = useState(false)

  const scenario = SCENARIOS[scenarioIdx]
  const question = scenario.questions[questionIdx]
  const totalQuestions = SCENARIOS.reduce((s, sc) => s + sc.questions.length, 0)
  const currentQuestionNumber = SCENARIOS.slice(0, scenarioIdx).reduce((s, sc) => s + sc.questions.length, 0) + questionIdx + 1

  function handleSelect(idx: number) {
    if (revealed) return
    setSelected(idx)
    setRevealed(true)
    setTotalAnswered(t => t + 1)
    if (idx === question.correct) setScore(s => s + 1)
  }

  function handleNext() {
    const hasMoreQuestions = questionIdx < scenario.questions.length - 1
    const hasMoreScenarios = scenarioIdx < SCENARIOS.length - 1

    if (hasMoreQuestions) {
      setQuestionIdx(q => q + 1)
    } else if (hasMoreScenarios) {
      setScenarioIdx(s => s + 1)
      setQuestionIdx(0)
    } else {
      setFinished(true)
    }
    setSelected(null)
    setRevealed(false)
  }

  function handleRestart() {
    setScenarioIdx(0)
    setQuestionIdx(0)
    setSelected(null)
    setRevealed(false)
    setScore(0)
    setTotalAnswered(0)
    setFinished(false)
  }

  if (finished) {
    const pct = Math.round((score / totalQuestions) * 100)
    const level = pct >= 80 ? 'Arquiteto de BI' : pct >= 60 ? 'Analista Sênior' : pct >= 40 ? 'Analista Jr.' : 'Iniciando'
    const color = pct >= 80 ? GREEN : pct >= 60 ? BLUE : pct >= 40 ? AMBER : RED

    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 text-center space-y-4"
        style={{ background: `${color}0a`, border: `1px solid ${color}25` }}>
        <p className="text-[11px] uppercase tracking-[0.12em] font-bold" style={{ color }}>Projeto Concluído</p>
        <div>
          <p className="text-5xl font-black" style={{ color }}>{score}/{totalQuestions}</p>
          <p className="text-[13px] text-white/40 mt-1">{pct}% de acerto</p>
        </div>
        <div className="rounded-xl px-4 py-3 inline-block" style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
          <p className="text-[14px] font-bold" style={{ color }}>{level}</p>
          <p className="text-[11px] text-white/35 mt-0.5">
            {pct >= 80
              ? 'Você domina o ciclo completo de OBI — da camada de dados ao dashboard executivo.'
              : pct >= 60
              ? 'Boa base em BI. Aprofunde modelagem dimensional e critérios de seleção de ferramentas.'
              : 'Revise as camadas do OBI e a metodologia Kimball — são a base de tudo.'}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {SCENARIOS.map((sc, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] uppercase tracking-wider text-white/25 mb-1">Cenário {i + 1}</p>
              <p className="text-[12px] font-semibold text-white/60">{sc.company.split(' ')[0]}</p>
              <p className="text-[11px] text-white/30">{sc.sector.split(' / ')[0]}</p>
            </div>
          ))}
        </div>
        <button onClick={handleRestart}
          className="text-[12px] px-5 py-2 rounded-xl font-semibold transition-all"
          style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
          Refazer Projeto
        </button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header com progresso */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-white/20">
            Cenário {scenarioIdx + 1}/{SCENARIOS.length} · Questão {questionIdx + 1}/{scenario.questions.length}
          </p>
          <p className="text-[11px] text-white/30 mt-0.5">Questão {currentQuestionNumber} de {totalQuestions}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-1 rounded-full overflow-hidden bg-white/5">
            <motion.div className="h-full rounded-full" style={{ background: BLUE, width: `${(currentQuestionNumber / totalQuestions) * 100}%` }} />
          </div>
          <span className="text-[11px] font-mono text-white/25">{score} pts</span>
        </div>
      </div>

      {/* Empresa e contexto */}
      <AnimatePresence mode="wait">
        {questionIdx === 0 && (
          <motion.div key={scenarioIdx}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="rounded-xl p-4 space-y-2"
            style={{ background: `${BLUE}08`, border: `1px solid ${BLUE}20` }}>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded" style={{ background: `${BLUE}15`, color: BLUE }}>
                {scenario.sector}
              </span>
            </div>
            <p className="text-[14px] font-bold text-white/80">{scenario.company}</p>
            <p className="text-[12px] text-white/45 leading-relaxed">{scenario.context}</p>
            <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[11px] font-semibold text-white/50 mb-1">Desafio</p>
              <p className="text-[12px] text-white/60 leading-relaxed">{scenario.challenge}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pergunta */}
      <AnimatePresence mode="wait">
        <motion.div key={`${scenarioIdx}-${questionIdx}`}
          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
          className="space-y-3">
          <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[11px] uppercase tracking-wider text-white/25 font-bold mb-2">Decisão de Projeto</p>
            <p className="text-[14px] text-white/75 leading-snug">{question.text}</p>
          </div>

          <div className="space-y-2">
            {question.options.map((opt, i) => {
              const isSelected = selected === i
              const isCorrect = i === question.correct
              let bg = 'rgba(255,255,255,0.03)'
              let border = 'rgba(255,255,255,0.07)'
              let textColor = 'rgba(255,255,255,0.55)'

              if (revealed) {
                if (isCorrect) { bg = `${GREEN}10`; border = `${GREEN}35`; textColor = `${GREEN}` }
                else if (isSelected) { bg = `${RED}10`; border = `${RED}35`; textColor = `${RED}` }
                else { textColor = 'rgba(255,255,255,0.2)' }
              } else if (isSelected) {
                bg = `${BLUE}12`; border = `${BLUE}40`; textColor = '#6cb4f0'
              }

              return (
                <motion.button key={i}
                  onClick={() => handleSelect(i)}
                  whileTap={!revealed ? { scale: 0.98 } : {}}
                  className="w-full text-left rounded-xl p-3 transition-all"
                  style={{ background: bg, border: `1px solid ${border}`, color: textColor }}>
                  <div className="flex items-start gap-3">
                    <span className="text-[11px] font-mono font-bold mt-0.5 shrink-0" style={{ color: textColor }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <p className="text-[13px] leading-snug">{opt}</p>
                    {revealed && isCorrect && <span className="ml-auto text-[12px] shrink-0">✓</span>}
                    {revealed && isSelected && !isCorrect && <span className="ml-auto text-[12px] shrink-0">✗</span>}
                  </div>
                </motion.button>
              )
            })}
          </div>

          {revealed && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-4 space-y-2"
              style={{
                background: selected === question.correct ? `${GREEN}08` : `${AMBER}08`,
                border: `1px solid ${selected === question.correct ? GREEN : AMBER}25`,
              }}>
              <p className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: selected === question.correct ? GREEN : AMBER }}>
                {selected === question.correct ? 'Decisão Correta' : 'Quase — veja o raciocínio'}
              </p>
              <p className="text-[13px] text-white/55 leading-relaxed">{question.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {revealed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
          <button onClick={handleNext}
            className="text-[12px] px-5 py-2.5 rounded-xl font-semibold transition-all"
            style={{ background: `${BLUE}18`, color: BLUE, border: `1px solid ${BLUE}30` }}>
            {scenarioIdx === SCENARIOS.length - 1 && questionIdx === scenario.questions.length - 1
              ? 'Ver Resultado'
              : 'Próxima Decisão →'}
          </button>
        </motion.div>
      )}
    </div>
  )
}

// ── Export map ────────────────────────────────────────────────────────────────

export const SIM_M1_OBI: Record<string, React.ComponentType> = {
  'obi-project-builder': OBIProjectBuilder,
}
