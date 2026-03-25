'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Creative Method Selector ────────────────────────────────────────────────

const SCENARIOS = [
  {
    id: 1,
    situation: 'Preciso gerar ideias para um novo produto de beleza sustentável, partindo das necessidades reais do consumidor.',
    correct: 'Design Thinking',
    explanation: 'Design Thinking parte da empatia com o usuário para gerar soluções centradas em necessidades reais. As 5 fases (Empatizar, Definir, Idear, Prototipar, Testar) são ideais quando o problema exige compreensão profunda do consumidor antes de criar. A IDEO usou exatamente esse método para reinventar desde carrinhos de supermercado até experiências bancárias.',
  },
  {
    id: 2,
    situation: 'Tenho um produto existente que está estagnado e preciso encontrar formas de reinventá-lo sem partir do zero.',
    correct: 'SCAMPER',
    explanation: 'SCAMPER (Substituir, Combinar, Adaptar, Modificar, Propor outros usos, Eliminar, Reorganizar) é o método ideal para inovação incremental sobre produtos existentes. Cada operador força uma perspectiva diferente sobre o que já existe, gerando variações criativas sem exigir ruptura total. A Samsung usou SCAMPER para evoluir sua linha Galaxy sistematicamente.',
  },
  {
    id: 3,
    situation: 'Minha equipe precisa gerar o maior volume possível de ideias para uma campanha de lançamento em 2 horas.',
    correct: 'Brainstorming Estruturado',
    explanation: 'Brainstorming Estruturado é ideal para geração volumétrica de ideias em curto prazo. Com regras claras (sem julgamento, quantidade sobre qualidade, construir sobre ideias alheias, ideias selvagens bem-vindas), uma sessão de 2h pode gerar 80-120 ideias brutas. A chave é ter um facilitador treinado e separar rigorosamente a fase divergente da convergente.',
  },
  {
    id: 4,
    situation: 'Estou preso em um problema técnico complexo onde todas as abordagens convencionais já falharam.',
    correct: 'TRIZ',
    explanation: 'TRIZ (Teoria da Resolução Inventiva de Problemas) foi desenvolvida por Genrich Altshuller a partir da análise de 200.000+ patentes. Quando abordagens convencionais falham, TRIZ oferece 40 princípios inventivos e a Matriz de Contradições para resolver conflitos técnicos sistematicamente. Empresas como Samsung, Intel e Boeing usam TRIZ para superar barreiras técnicas aparentemente intransponíveis.',
  },
  {
    id: 5,
    situation: 'Preciso desafiar suposições do mercado e criar uma estratégia que ninguém no setor está considerando.',
    correct: 'Pensamento Lateral',
    explanation: 'O Pensamento Lateral de Edward de Bono é projetado para escapar de padrões lógicos convencionais. Técnicas como Provocação (Po), Movimento e os Seis Chapéus forçam o cérebro a abandonar trilhas conhecidas. Para estratégias disruptivas, o Chapéu Verde (criatividade) combinado com provocações deliberadas gera ideias que o pensamento vertical jamais alcançaria.',
  },
  {
    id: 6,
    situation: 'Preciso organizar e conectar visualmente todas as variáveis de um problema de negócio antes de tomar uma decisão.',
    correct: 'Mapa Mental',
    explanation: 'Mapas Mentais (Tony Buzan) exploram a capacidade do cérebro de criar associações radiais. Para problemas com múltiplas variáveis interconectadas, a visualização radial permite ver relações que listas lineares ocultam. Estudos mostram que Mapas Mentais aumentam a retenção de informação em até 32% e a capacidade de ver conexões não-óbvias entre elementos do problema.',
  },
  {
    id: 7,
    situation: 'Quero melhorar um processo logístico existente usando modificações sistemáticas em cada componente.',
    correct: 'SCAMPER',
    explanation: 'SCAMPER é perfeito para otimização processual porque cada operador questiona um aspecto diferente do processo: O que Substituir? O que Combinar? O que Adaptar de outro setor? O que Modificar em escala? Que outro Propósito esse processo poderia ter? O que Eliminar? Como Reorganizar a sequência? A Toyota aplicou princípios similares para desenvolver o Sistema Toyota de Produção.',
  },
  {
    id: 8,
    situation: 'Preciso resolver um conflito entre dois requisitos aparentemente incompatíveis: o produto precisa ser mais resistente E mais leve ao mesmo tempo.',
    correct: 'TRIZ',
    explanation: 'TRIZ é especializada em resolver contradições técnicas e físicas. A Matriz de Contradições cruza parâmetros conflitantes (resistência vs. peso) e sugere princípios inventivos específicos. Neste caso, princípios como Segmentação, Uso de Materiais Compostos e Estrutura Porosa seriam recomendados. A SpaceX usa princípios TRIZ para resolver exatamente este tipo de contradição em seus foguetes.',
  },
  {
    id: 9,
    situation: 'Preciso facilitar uma reunião onde 6 executivos com visões muito diferentes precisam chegar a um consenso sobre a estratégia digital.',
    correct: 'Pensamento Lateral',
    explanation: 'Os Seis Chapéus do Pensamento de Edward de Bono são ideais para este cenário. Cada chapéu representa um modo de pensar (Fatos, Emoções, Cautela, Otimismo, Criatividade, Processo). Ao fazer todos usarem o mesmo chapéu simultaneamente, elimina-se o confronto ego-a-ego e permite-se exploração paralela. Empresas como DuPont e Siemens reduziram tempo de reunião em 75% com este método.',
  },
  {
    id: 10,
    situation: 'Preciso criar um serviço completamente novo para idosos, mas não tenho nenhum dado de mercado — só hipóteses.',
    correct: 'Design Thinking',
    explanation: 'Quando não há dados de mercado e o público-alvo é desconhecido, Design Thinking é insubstituível. A fase de Empatia (entrevistas em profundidade, observação etnográfica, imersão no contexto) gera insights que pesquisas quantitativas jamais revelariam. A Airbnb saiu da falência usando Design Thinking: foram morar com hosts para entender a experiência real antes de redesenhar toda a plataforma.',
  },
]

const METHODS = ['Design Thinking', 'SCAMPER', 'Brainstorming Estruturado', 'Pensamento Lateral', 'TRIZ', 'Mapa Mental']

export function CreativeMethodSelector() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [finished, setFinished] = useState(false)

  function handleSelect(method: string) {
    if (revealed) return
    setSelected(method)
    setRevealed(true)
    setAnswered(a => a + 1)
    if (method === SCENARIOS[current].correct) {
      setScore(s => s + 1)
    }
  }

  function handleNext() {
    if (current < SCENARIOS.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
      setRevealed(false)
    } else {
      setFinished(true)
    }
  }

  function handleRestart() {
    setCurrent(0)
    setSelected(null)
    setRevealed(false)
    setScore(0)
    setAnswered(0)
    setFinished(false)
  }

  const scenario = SCENARIOS[current]
  const isCorrect = selected === scenario.correct

  if (finished) {
    const pct = Math.round((score / SCENARIOS.length) * 100)
    return (
      <div className="space-y-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.2rem] border border-white/[0.08] p-6 text-center space-y-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <p className="text-[9px] uppercase tracking-[0.28em] text-white/28">Resultado Final</p>
          <p className="text-[28px] font-bold text-white/80">{score}/{SCENARIOS.length}</p>
          <p className="text-[13px] text-white/48">{pct}% de acerto</p>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mx-8">
            <motion.div className="h-full rounded-full" style={{ background: pct >= 70 ? '#1e8449' : pct >= 40 ? '#9a7d0a' : '#c0392b' }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
          </div>
          <p className="text-[12px] leading-relaxed text-white/36 mt-2">
            {pct >= 80 ? 'Excelente dominio das metodologias criativas. Voce sabe quando aplicar cada ferramenta.' :
              pct >= 60 ? 'Bom conhecimento. Revise TRIZ e Pensamento Lateral para completar seu repertorio.' :
                pct >= 40 ? 'Conhecimento parcial. Recomendamos revisar o conteudo sobre cada metodologia antes de tentar novamente.' :
                  'Revise todo o conteudo sobre metodologias criativas. A escolha correta do metodo e tao importante quanto a execucao.'}
          </p>
          <button onClick={handleRestart} className="mt-2 rounded-[0.8rem] border border-white/[0.10] px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-white/44 transition hover:border-white/20 hover:text-white/70">
            Tentar Novamente
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <p className="text-[9px] uppercase tracking-[0.28em] text-white/28">Cenario {current + 1} de {SCENARIOS.length}</p>
        <p className="text-[10px] font-mono text-white/32">{score} acerto{score !== 1 ? 's' : ''}</p>
      </div>
      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div className="h-full rounded-full bg-white/20" animate={{ width: `${((current + (revealed ? 1 : 0)) / SCENARIOS.length) * 100}%` }} transition={{ duration: 0.3 }} />
      </div>

      {/* Scenario */}
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-start gap-3">
            <span className="shrink-0 font-mono text-[9px] text-white/22 mt-0.5">#{String(current + 1).padStart(2, '0')}</span>
            <p className="text-[13px] leading-relaxed text-white/72">{scenario.situation}</p>
          </div>

          {/* Method buttons */}
          <div className="grid grid-cols-2 gap-2">
            {METHODS.map(method => {
              const isThis = selected === method
              const isAnswer = method === scenario.correct
              let borderClass = 'border-white/[0.08]'
              let textClass = 'text-white/38'
              if (revealed && isAnswer) {
                borderClass = 'border-[#1e8449]/40'
                textClass = 'text-[#1e8449]'
              } else if (revealed && isThis && !isAnswer) {
                borderClass = 'border-[#c0392b]/40'
                textClass = 'text-[#c0392b]'
              }
              return (
                <button
                  key={method}
                  onClick={() => handleSelect(method)}
                  disabled={revealed}
                  className={`rounded-[0.7rem] border ${borderClass} py-2.5 px-3 text-[10px] uppercase tracking-[0.12em] ${textClass} transition hover:border-white/20 hover:text-white/70 disabled:hover:border-white/[0.08] disabled:hover:text-white/38`}
                >
                  {method}
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {revealed && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span style={{ color: isCorrect ? '#1e8449' : '#c0392b' }}>{isCorrect ? '✓' : '✗'}</span>
                    <p className="text-[11px] font-medium" style={{ color: isCorrect ? '#1e8449' : '#c0392b' }}>
                      {isCorrect ? 'Correto!' : `Incorreto — o melhor metodo e ${scenario.correct}`}
                    </p>
                  </div>
                  <p className="text-[12px] leading-relaxed text-white/44">{scenario.explanation}</p>
                  <button onClick={handleNext} className="mt-2 rounded-[0.7rem] border border-white/[0.10] px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-white/38 transition hover:border-white/20 hover:text-white/70">
                    {current < SCENARIOS.length - 1 ? 'Proximo Cenario →' : 'Ver Resultado Final'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Idea Evaluator ──────────────────────────────────────────────────────────

const DIMENSIONS = [
  { id: 'originalidade', label: 'Originalidade', desc: 'Quao inovadora e unica e a ideia?' },
  { id: 'viabilidade', label: 'Viabilidade Tecnica', desc: 'E possivel implementar com a tecnologia atual?' },
  { id: 'mercado', label: 'Potencial de Mercado', desc: 'Existe demanda real ou latente?' },
  { id: 'custo', label: 'Custo de Implementacao', desc: '1=muito caro, 5=muito barato (invertido)' },
  { id: 'alinhamento', label: 'Alinhamento Estrategico', desc: 'Se conecta com a visao e missao do negocio?' },
]

type Idea = {
  name: string
  scores: Record<string, number>
  overall: number
  recommendation: string
}

function getRecommendation(overall: number): string {
  if (overall >= 4.0) return 'Executar Agora'
  if (overall >= 3.0) return 'Desenvolver Mais'
  if (overall >= 2.0) return 'Pivotar'
  return 'Arquivar'
}

function getRecColor(rec: string): string {
  if (rec === 'Executar Agora') return '#1e8449'
  if (rec === 'Desenvolver Mais') return '#1e5fa0'
  if (rec === 'Pivotar') return '#9a7d0a'
  return '#c0392b'
}

export function IdeaEvaluator() {
  const [ideaName, setIdeaName] = useState('')
  const [scores, setScores] = useState<Record<string, number>>({ originalidade: 0, viabilidade: 0, mercado: 0, custo: 0, alinhamento: 0 })
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [showResult, setShowResult] = useState(false)
  const [currentIdea, setCurrentIdea] = useState<Idea | null>(null)

  const allScored = Object.values(scores).every(v => v > 0)

  function evaluate() {
    if (!ideaName.trim() || !allScored) return
    const overall = Object.values(scores).reduce((a, b) => a + b, 0) / DIMENSIONS.length
    const recommendation = getRecommendation(overall)
    const idea: Idea = { name: ideaName.trim(), scores: { ...scores }, overall, recommendation }
    setCurrentIdea(idea)
    setIdeas(prev => [...prev, idea])
    setShowResult(true)
  }

  function newIdea() {
    setIdeaName('')
    setScores({ originalidade: 0, viabilidade: 0, mercado: 0, custo: 0, alinhamento: 0 })
    setShowResult(false)
    setCurrentIdea(null)
  }

  function reset() {
    newIdea()
    setIdeas([])
  }

  // Radar visualization using CSS bars
  function RadarBars({ idea, compact }: { idea: Idea; compact?: boolean }) {
    const maxVal = 5
    const colors = ['#6b3fa0', '#1e5fa0', '#1e8449', '#9a7d0a', '#c0392b']
    return (
      <div className={`space-y-${compact ? '1' : '2'}`}>
        {DIMENSIONS.map((dim, i) => {
          const val = idea.scores[dim.id]
          const pct = (val / maxVal) * 100
          return (
            <div key={dim.id}>
              <div className="flex items-center justify-between mb-0.5">
                <p className={`text-[${compact ? '9' : '10'}px] text-white/52`}>{dim.label}</p>
                <p className={`text-[${compact ? '9' : '10'}px] font-mono text-white/32`}>{val}/5</p>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: colors[i] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  if (showResult && currentIdea) {
    return (
      <div className="space-y-4">
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.24em] text-white/28">Avaliacao</p>
                <p className="text-[15px] font-semibold text-white/80 mt-0.5">{currentIdea.name}</p>
              </div>
              <div className="text-right">
                <p className="text-[22px] font-bold text-white/60">{currentIdea.overall.toFixed(1)}</p>
                <p className="text-[9px] uppercase tracking-[0.14em]" style={{ color: getRecColor(currentIdea.recommendation) }}>{currentIdea.recommendation}</p>
              </div>
            </div>

            <RadarBars idea={currentIdea} />

            <motion.div
              className="rounded-[0.9rem] border px-4 py-3 text-center"
              animate={{ borderColor: getRecColor(currentIdea.recommendation) + '44' }}
            >
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/28">Recomendacao</p>
              <p className="text-[14px] font-semibold mt-0.5" style={{ color: getRecColor(currentIdea.recommendation) }}>
                {currentIdea.recommendation}
              </p>
              <p className="text-[11px] text-white/36 mt-1">
                {currentIdea.recommendation === 'Executar Agora' && 'Ideia com alto potencial em todas as dimensoes. Priorize a prototipagem imediata.'}
                {currentIdea.recommendation === 'Desenvolver Mais' && 'Boa base, mas algumas dimensoes precisam de fortalecimento antes da execucao.'}
                {currentIdea.recommendation === 'Pivotar' && 'A ideia tem merito, mas precisa de reformulacao significativa em dimensoes criticas.'}
                {currentIdea.recommendation === 'Arquivar' && 'Nao atende criterios minimos no momento. Arquive e reavalie em outro contexto.'}
              </p>
            </motion.div>

            <div className="flex gap-2">
              <button onClick={newIdea} className="flex-1 rounded-[0.7rem] border border-white/[0.10] py-2 text-[10px] uppercase tracking-[0.14em] text-white/38 transition hover:border-white/20 hover:text-white/70">
                Avaliar Nova Ideia
              </button>
              {ideas.length > 1 && (
                <button onClick={() => setShowResult(false)} className="flex-1 rounded-[0.7rem] border border-white/[0.10] py-2 text-[10px] uppercase tracking-[0.14em] text-white/38 transition hover:border-white/20 hover:text-white/70">
                  Comparar Ideias
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Comparison table */}
        {ideas.length > 1 && (
          <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-3" style={{ background: 'rgba(255,255,255,0.015)' }}>
            <p className="text-[9px] uppercase tracking-[0.28em] text-white/28">Comparativo de Ideias</p>
            <div className="space-y-3">
              {ideas.map((idea, idx) => (
                <div key={idx} className="rounded-[0.9rem] border border-white/[0.06] p-3 space-y-2" style={{ background: 'rgba(255,255,255,0.01)' }}>
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-medium text-white/68">{idea.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-bold text-white/56">{idea.overall.toFixed(1)}</p>
                      <span className="rounded-full px-2 py-0.5 text-[8px] uppercase tracking-[0.12em]" style={{ background: getRecColor(idea.recommendation) + '22', color: getRecColor(idea.recommendation) }}>
                        {idea.recommendation}
                      </span>
                    </div>
                  </div>
                  <RadarBars idea={idea} compact />
                </div>
              ))}
            </div>
            <button onClick={reset} className="w-full rounded-[0.7rem] border border-white/[0.08] py-2 text-[10px] uppercase tracking-[0.14em] text-white/28 transition hover:border-white/16 hover:text-white/50">
              Limpar Todas
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-[9px] uppercase tracking-[0.28em] text-white/28">Avalie sua ideia em 5 dimensoes</p>

      {/* Idea name input */}
      <div className="rounded-[1rem] border border-white/[0.08] p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <p className="text-[9px] uppercase tracking-[0.22em] text-white/28">Nome da Ideia</p>
        <input
          type="text"
          value={ideaName}
          onChange={e => setIdeaName(e.target.value)}
          placeholder="Ex: App de mentoria por IA para PMEs"
          className="w-full rounded-[0.7rem] border border-white/[0.08] bg-transparent px-3 py-2.5 text-[13px] text-white/72 placeholder:text-white/20 outline-none focus:border-white/20 transition"
        />
      </div>

      {/* Dimension scores */}
      <div className="space-y-3">
        {DIMENSIONS.map((dim) => (
          <div key={dim.id} className="rounded-[1rem] border border-white/[0.06] p-3.5" style={{ background: 'rgba(255,255,255,0.015)' }}>
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-[12px] text-white/68">{dim.label}</p>
                <p className="text-[10px] text-white/32">{dim.desc}</p>
              </div>
              <span className="ml-3 shrink-0 font-mono text-[11px] text-white/40">{scores[dim.id] || '—'}</span>
            </div>
            <div className="flex gap-1.5 mt-2">
              {[1, 2, 3, 4, 5].map(v => (
                <button
                  key={v}
                  onClick={() => setScores(p => ({ ...p, [dim.id]: v }))}
                  className={`flex-1 rounded-[0.5rem] border py-1.5 text-[11px] font-medium transition ${
                    scores[dim.id] === v
                      ? 'border-white/20 bg-white/[0.08] text-white/80'
                      : 'border-white/[0.06] text-white/28 hover:border-white/14 hover:text-white/50'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Evaluate button */}
      <button
        onClick={evaluate}
        disabled={!ideaName.trim() || !allScored}
        className="w-full rounded-[0.8rem] border border-white/[0.12] py-3 text-[11px] uppercase tracking-[0.18em] text-white/50 transition hover:border-white/24 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Avaliar Ideia
      </button>

      {/* Previously evaluated */}
      {ideas.length > 0 && (
        <div className="rounded-[1rem] border border-white/[0.06] p-3.5 space-y-2" style={{ background: 'rgba(255,255,255,0.01)' }}>
          <p className="text-[9px] uppercase tracking-[0.22em] text-white/28">Ideias Avaliadas ({ideas.length})</p>
          {ideas.map((idea, idx) => (
            <div key={idx} className="flex items-center justify-between py-1">
              <p className="text-[11px] text-white/52">{idea.name}</p>
              <span className="text-[9px] uppercase tracking-[0.12em]" style={{ color: getRecColor(idea.recommendation) }}>{idea.recommendation} ({idea.overall.toFixed(1)})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Export map ────────────────────────────────────────────────────────────────

export const SIM_M1_CREATIVITY: Record<string, React.ComponentType> = {
  'creative-method': CreativeMethodSelector,
  'idea-evaluator': IdeaEvaluator,
}
