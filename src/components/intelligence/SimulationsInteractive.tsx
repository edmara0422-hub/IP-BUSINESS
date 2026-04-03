'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GREEN = '#1e8449'
const RED = '#c0392b'
const AMBER = '#9a7d0a'
const BLUE = '#2e86c1'

// ══════════════════════════════════════════════════════════════
// ██  CASO REAL INTERATIVO — Você é o CEO
// ══════════════════════════════════════════════════════════════

interface CaseData {
  company: string
  year: string
  context: string
  options: Array<{ label: string; desc: string }>
  consequences: Array<{
    year1: string
    year3: string
    year5: string
  }>
  realChoice: number
  realOutcome: string
  lesson: string
}

const CASES: CaseData[] = [
  {
    company: 'Kodak',
    year: '1997',
    context: 'Você é CEO da Kodak. Sua empresa domina 85% do mercado de filmes fotográficos. Um engenheiro seu, Steven Sasson, inventou a câmera digital em 1975. Agora em 1997, câmeras digitais começam a aparecer — mas a qualidade é péssima e representam 0.1% das vendas. Seu departamento de filmes gera US$ 14 bilhões/ano em receita.',
    options: [
      { label: 'Proteger o Filme', desc: 'Manter o foco no filme — é 99.9% da receita. Câmera digital é nicho sem lucro. Investir em marketing de filme.' },
      { label: 'Transição Gradual', desc: 'Criar divisão digital separada, manter filme como cash cow. Migrar em 10 anos. Não canibalizar o produto principal.' },
      { label: 'All-in Digital', desc: 'Redirecionar 50% do P&D para digital. Aceitar que filme vai morrer. Canibalizar nosso próprio produto antes que outros façam.' },
    ],
    consequences: [
      { year1: 'Lucro recorde! Filme segue forte. Board aplaudia.', year3: 'Câmeras digitais melhoraram muito. Concorrentes como Canon e Sony avançam. Suas vendas de filme caem 15%.', year5: 'Mercado de filme colapsa 70%. Você não tem produto digital competitivo. Demissões massivas. A Kodak pede falência em 2012.' },
      { year1: 'Filme mantém receita. Divisão digital queima dinheiro. Pressão do board.', year3: 'Divisão digital ganha tração mas compete com Canon/Sony que começaram antes. Filme cai 30%.', year5: 'Transição lenta demais. Concorrentes dominaram o digital. Você chegou tarde. A Kodak ainda pede falência — talvez 2 anos depois.' },
      { year1: 'Queda de 20% no lucro. Acionistas furiosos. Analistas rebaixam a ação. Você quase é demitido.', year3: 'Sua câmera digital lidera o mercado. A marca Kodak é sinônimo de foto digital. Filme cai mas digital compensa.', year5: 'Kodak é líder global em fotografia digital. Valuation triplicou. Você virou case de Harvard.' },
    ],
    realChoice: 0,
    realOutcome: 'A Kodak escolheu proteger o filme. Tinha a tecnologia digital pronta mas recusou canibalizar seu produto mais lucrativo. Pediu falência em 2012. O engenheiro que inventou a câmera digital em 1975 assistiu a empresa morrer por medo de mudar.',
    lesson: 'O maior risco não é inovar — é recusar inovar. Empresas morrem não por falta de tecnologia, mas por incapacidade de abandonar o que funciona hoje pelo que vai funcionar amanhã.',
  },
  {
    company: 'Americanas',
    year: '2020',
    context: 'Você é CFO da Americanas. A empresa cresce explosivamente no digital durante a pandemia. Mas os números reais mostram R$ 20 bilhões em dívidas não contabilizadas — operações de "risco sacado" (antecipação de pagamentos a fornecedores) que foram registradas como receita. O CEO pressiona por resultados cada vez melhores. O mercado aplaude.',
    options: [
      { label: 'Reportar a Verdade', desc: 'Revelar ao conselho que os números estão inflados. Aceitar a queda na ação e a crise de credibilidade. Limpar os balanços.' },
      { label: 'Corrigir Silenciosamente', desc: 'Parar de inflar novas operações e corrigir gradualmente em 3-5 anos. Ninguém precisa saber do passado.' },
      { label: 'Manter o Jogo', desc: 'Continuar inflando. O mercado está otimista, ninguém está investigando. Resolver "depois".' },
    ],
    consequences: [
      { year1: 'Ação despenca 50%. CEO demitido. Investigação do CVM. MAS: a empresa sobrevive com credibilidade.', year3: 'Reestruturação dolorosa. Fechamento de lojas. Mas investidores voltam pela transparência.', year5: 'Americanas sobrevive como empresa menor mas confiável. Marca reconstruída.' },
      { year1: 'Funciona no curto prazo. Ninguém percebe. Mas a dívida cresce com juros.', year3: 'Auditoria externa descobre inconsistências. Escândalo parcial. Multas do CVM.', year5: 'Mesma crise, só 3 anos depois. Pior: agora há evidência de encobrimento deliberado.' },
      { year1: 'Números "excelentes". Bônus recordes para executivos. Ação em alta.', year3: 'Rombo chega a R$ 25 bilhões. Impossível esconder. Escândalo explode em janeiro 2023.', year5: 'Maior fraude da história do varejo brasileiro. Recuperação judicial. 12.000 demitidos. Executivos investigados criminalmente.' },
    ],
    realChoice: 2,
    realOutcome: 'A Americanas manteve o jogo. O rombo de R$ 25,2 bilhões explodiu em janeiro de 2023. A ação caiu 77% em um dia. A empresa entrou em recuperação judicial. Milhares perderam emprego e investidores perderam bilhões.',
    lesson: 'Fraude contábil não é "criatividade financeira" — é crime. O custo de ser honesto no curto prazo é sempre menor que o custo de ser descoberto. O teste ético: se saísse na capa do jornal amanhã, você ficaria confortável?',
  },
  {
    company: 'Nubank',
    year: '2013',
    context: 'Você é David Vélez. Colombiano, ex-Sequoia Capital. Chegou ao Brasil e ficou chocado: os bancos cobram tarifas absurdas, o atendimento é péssimo e 55 milhões de brasileiros não têm conta bancária. Você tem US$ 2 milhões em seed money e uma equipe de 8 pessoas em um apartamento em São Paulo. Não tem licença bancária.',
    options: [
      { label: 'Parceria com Banco', desc: 'Fazer white-label com um banco existente (Itaú, Bradesco). Usar a licença deles. Menos risco, mais rápido, mas dependente.' },
      { label: 'Começar pelo Cartão', desc: 'Lançar primeiro um cartão de crédito sem anuidade (não precisa de licença bancária completa). Provar o conceito, depois expandir.' },
      { label: 'Licença Própria', desc: 'Aplicar para licença bancária no Banco Central. Processo de 2-3 anos. Risco alto, mas independência total.' },
    ],
    consequences: [
      { year1: 'Produto no mercado rápido. Mas o banco parceiro controla tudo — taxas, aprovações, velocidade.', year3: 'Crescimento limitado. O banco parceiro vê você como ameaça e dificulta a relação. Você é refém.', year5: 'Virou mais uma fintech dependente de banco. Nunca construiu moat próprio. Competidores que ousaram mais te ultrapassaram.' },
      { year1: 'Cartão roxo sem anuidade: 1 milhão de clientes em 12 meses. App nota 4.9 na App Store. Boca a boca viral.', year3: '10 milhões de clientes. Levantou US$ 400M em Series E. Começou conta digital + investimentos. Virou banco.', year5: '80+ milhões de clientes. Maior banco digital do mundo. IPO na NYSE: valuation US$ 45 bilhões.' },
      { year1: 'Sem produto no mercado. Processo burocrático no BC. Investidores impacientes. Time desmotivado.', year3: 'Licença aprovada mas os US$ 2M acabaram. Precisa de nova rodada em posição fraca. Concorrentes já lançaram.', year5: 'Chegou ao mercado tarde demais. Inter e C6 já capturaram o early adopter. Crescimento lento.' },
    ],
    realChoice: 1,
    realOutcome: 'O Nubank começou pelo cartão de crédito — o produto mais odiado do Brasil, onde a dor era maior. Sem anuidade, 100% digital, atendimento por chat. Em 10 anos: 100M+ clientes, maior banco digital do mundo, valuation de US$ 45B.',
    lesson: 'Comece onde a dor é maior, não onde a solução é mais completa. Um MVP que resolve UMA dor real vale mais que um produto completo que ninguém experimentou. O Nubank não criou um banco — criou um cartão. O banco veio depois.',
  },
  {
    company: 'Magazine Luiza',
    year: '2015',
    context: 'Você é Frederico Trajano, filho da fundadora Luiza Helena. O varejo físico brasileiro está em crise: recessão, lojas caras, e-commerce crescendo 20%/ano. Magazine Luiza tem 800 lojas físicas e um e-commerce fraco. Concorrentes digitais (B2W, Mercado Livre) avançam. A Via Varejo (Casas Bahia) aposta em fechar lojas.',
    options: [
      { label: 'Fechar Lojas + Full Digital', desc: 'Seguir a tendência: fechar 300 lojas, demitir, investir tudo em e-commerce. Competir de igual com Mercado Livre.' },
      { label: 'Manter Tudo como Está', desc: 'Lojas são o DNA da empresa. O digital é complementar. Não mudar o modelo que funcionou por 50 anos.' },
      { label: 'Omnichannel — Integrar Tudo', desc: 'Transformar as 800 lojas em mini-centros de distribuição + showrooms. Integrar online + offline. Vendedor da loja vende pelo app.' },
    ],
    consequences: [
      { year1: 'Economia de custos imediata. Mas perdeu presença no interior (onde Magalu é forte). Clientes tradicionais abandonam.', year3: 'E-commerce compete com Amazon e Mercado Livre — que têm mais capital e tecnologia. Sem diferencial.', year5: 'Virou mais uma loja online genérica. Perdeu a identidade e a confiança do interior do Brasil.' },
      { year1: 'Custos fixos continuam altos. E-commerce dos concorrentes cresce 30%/ano. Sua participação cai.', year3: 'Lojas viraram custo sem retorno. Vendedores desmotivados. Concorrentes digitais dominam.', year5: 'Mesma história de Via Varejo/Casas Bahia: declínio lento e doloroso. O modelo analógico não sobrevive.' },
      { year1: 'Investimento alto em tecnologia. Loja vira ponto de retirada + showroom. Vendedor ganha comissão por vendas online.', year3: 'MagaLu app: 30 milhões de usuários. Lojas no interior viram última milha logística. Entrega em horas, não dias.', year5: 'Ação valorizou 18.000% entre 2015-2020. Marketplace com 100.000+ sellers. Superapp. Maior case de transformação digital do Brasil.' },
    ],
    realChoice: 2,
    realOutcome: 'Magazine Luiza escolheu omnichannel. Frederico Trajano transformou 800 lojas em centros de distribuição. Vendedores viraram influenciadores digitais. A ação valorizou 18.000% em 5 anos. Maior transformação digital do varejo brasileiro.',
    lesson: 'Inovação não é escolher entre velho e novo — é integrar. As lojas físicas da Magalu não eram o problema — eram o ativo que ninguém mais tinha. A estratégia certa transforma fraqueza em vantagem competitiva.',
  },
]

export function CasoRealInterativo() {
  const [caseIdx, setCaseIdx] = useState(0)
  const [choice, setChoice] = useState<number | null>(null)
  const [phase, setPhase] = useState<'context' | 'consequence' | 'reveal'>('context')
  const [scores, setScores] = useState<number[]>([])
  const [done, setDone] = useState(false)

  const c = CASES[caseIdx]

  const handleChoice = (i: number) => {
    setChoice(i)
    setPhase('consequence')
  }

  const showReveal = () => setPhase('reveal')

  const nextCase = () => {
    const score = choice === c.realChoice ? 100 : (choice !== null && Math.abs(choice - c.realChoice) === 1 ? 50 : 0)
    const newScores = [...scores, score]
    setScores(newScores)

    if (caseIdx < CASES.length - 1) {
      setCaseIdx(i => i + 1)
      setChoice(null)
      setPhase('context')
    } else {
      setDone(true)
    }
  }

  if (done) {
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    const profile = avg >= 70 ? 'Disruptivo' : avg >= 40 ? 'Equilibrado' : 'Conservador'
    const profileDesc = avg >= 70
      ? 'Você tende a tomar decisões ousadas e antecipar mudanças. Risco: pode agir rápido demais sem validar.'
      : avg >= 40
      ? 'Você equilibra risco e segurança. Risco: pode ser lento demais em mercados que mudam rápido.'
      : 'Você prioriza estabilidade e proteção do existente. Risco: pode perder janelas de oportunidade.'

    return (
      <div className="space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-white/25">Seu Perfil de Gestão</p>
        <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${avg >= 70 ? GREEN : avg >= 40 ? AMBER : RED}20` }}>
          <p className="text-[32px] font-bold" style={{ color: avg >= 70 ? GREEN : avg >= 40 ? AMBER : RED }}>{profile}</p>
          <p className="text-[14px] text-white/50 mt-2">Alinhamento com decisões reais: {avg}%</p>
          <p className="text-[12px] text-white/30 mt-3">{profileDesc}</p>
        </div>
        <div className="space-y-2">
          {CASES.map((cs, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: 'rgba(0,0,0,0.15)' }}>
              <span className="text-[12px] text-white/45">{cs.company} ({cs.year})</span>
              <span className="text-[12px] font-mono font-bold" style={{ color: scores[i] >= 70 ? GREEN : scores[i] >= 40 ? AMBER : RED }}>{scores[i]}%</span>
            </div>
          ))}
        </div>
        <button onClick={() => { setCaseIdx(0); setChoice(null); setPhase('context'); setScores([]); setDone(false) }}
          className="w-full text-[12px] py-2.5 rounded-lg" style={{ background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}30` }}>
          Jogar Novamente
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-white/25">Caso Real — Você Decide</p>
        <span className="text-[11px] text-white/20 font-mono">{caseIdx + 1}/{CASES.length}</span>
      </div>

      <div className="flex gap-1">
        {CASES.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full" style={{ background: i < caseIdx ? GREEN : i === caseIdx ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.06)' }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'context' && (
          <motion.div key="ctx" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[18px] font-bold text-white/80">{c.company}</span>
                <span className="text-[12px] font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>{c.year}</span>
              </div>
              <p className="text-[13px] text-white/50 leading-relaxed mb-4">{c.context}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/20 mb-3">O que você faz?</p>
              <div className="space-y-2">
                {c.options.map((opt, i) => (
                  <button key={i} onClick={() => handleChoice(i)}
                    className="w-full text-left rounded-lg px-4 py-3 transition-all"
                    style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-[13px] text-white/65 font-semibold">{opt.label}</p>
                    <p className="text-[11px] text-white/30 mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'consequence' && choice !== null && (
          <motion.div key="csq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/20 mb-3">Consequências da sua decisão</p>
              <p className="text-[13px] text-white/40 mb-3">Você escolheu: <strong className="text-white/65">{c.options[choice].label}</strong></p>
              <div className="space-y-3">
                {[
                  { label: 'Ano 1', text: c.consequences[choice].year1 },
                  { label: 'Ano 3', text: c.consequences[choice].year3 },
                  { label: 'Ano 5', text: c.consequences[choice].year5 },
                ].map((yr, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.3 }}
                    className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.15)', borderLeft: `3px solid rgba(255,255,255,${0.06 + i * 0.04})` }}>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-wider">{yr.label}</span>
                    <p className="text-[12px] text-white/45 leading-relaxed mt-1">{yr.text}</p>
                  </motion.div>
                ))}
              </div>
              <button onClick={showReveal}
                className="w-full mt-4 text-[12px] font-medium py-2.5 rounded-lg"
                style={{ background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}30` }}>
                O que realmente aconteceu? →
              </button>
            </div>
          </motion.div>
        )}

        {phase === 'reveal' && choice !== null && (
          <motion.div key="rev" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${choice === c.realChoice ? GREEN : AMBER}20` }}>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: choice === c.realChoice ? GREEN : AMBER }}>
                {choice === c.realChoice ? 'Você acertou!' : 'Na vida real, foi diferente...'}
              </p>
              <p className="text-[13px] text-white/55 leading-relaxed mb-4">{c.realOutcome}</p>

              <div className="rounded-lg p-3 mb-3" style={{ background: `${GREEN}06`, borderLeft: `3px solid ${GREEN}25` }}>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-wider mb-1">A Lição</p>
                <p className="text-[13px] leading-relaxed" style={{ color: `${GREEN}cc` }}>{c.lesson}</p>
              </div>

              <button onClick={nextCase}
                className="w-full text-[12px] font-medium py-2.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {caseIdx < CASES.length - 1 ? 'Próximo Caso →' : 'Ver Meu Perfil'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// ██  LABORATÓRIO DE CRIATIVIDADE — Sessão Guiada Real
// ══════════════════════════════════════════════════════════════

function CountdownTimer({ seconds, onFinish }: { seconds: number; onFinish: () => void }) {
  const [left, setLeft] = useState(seconds)
  const finished = useRef(false)

  useEffect(() => {
    setLeft(seconds)
    finished.current = false
  }, [seconds])

  useEffect(() => {
    const t = setInterval(() => {
      setLeft(l => {
        if (l <= 1) {
          clearInterval(t)
          if (!finished.current) { finished.current = true; setTimeout(onFinish, 100) }
          return 0
        }
        return l - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [seconds, onFinish])

  const urgent = left <= 10
  const mins = Math.floor(left / 60)
  const secs = left % 60

  return (
    <motion.div className="flex items-center gap-2" animate={urgent ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 0.5, repeat: urgent ? Infinity : 0 }}>
      <div className="font-mono text-[20px] font-bold" style={{ color: urgent ? RED : 'rgba(255,255,255,0.6)' }}>
        {mins}:{secs.toString().padStart(2, '0')}
      </div>
      {urgent && <motion.div className="w-2 h-2 rounded-full" style={{ background: RED }} animate={{ opacity: [1, 0.2] }} transition={{ duration: 0.5, repeat: Infinity }} />}
    </motion.div>
  )
}

const WARMUPS = [
  { prompt: 'Liste 8 usos alternativos para um CLIPE DE PAPEL', time: 60 },
  { prompt: 'Escreva 6 maneiras de MELHORAR UMA CADEIRA', time: 45 },
  { prompt: 'Combine 2 objetos aleatórios em 1 produto novo: GUARDA-CHUVA + MOCHILA', time: 45 },
]

const SCAMPER_OPS = [
  { op: 'S — Substituir', prompt: 'O que pode ser substituído no seu produto? Material, processo, pessoa, ingrediente?' },
  { op: 'C — Combinar', prompt: 'O que pode ser combinado? Funções, mercados, produtos?' },
  { op: 'A — Adaptar', prompt: 'O que de OUTRO setor pode ser adaptado para o seu?' },
  { op: 'M — Modificar', prompt: 'E se fosse 10x maior? 10x menor? 10x mais rápido?' },
  { op: 'P — Outros Usos', prompt: 'Que OUTRO público poderia usar isso? Para que mais serve?' },
  { op: 'E — Eliminar', prompt: 'O que acontece se remover completamente algo do produto?' },
  { op: 'R — Reorganizar', prompt: 'E se a ordem fosse invertida? O cliente fizesse antes do fornecedor?' },
]

const HATS = [
  { hat: 'Branco — Fatos', color: '#ffffff', prompt: 'Só FATOS sobre o problema. O que sabemos? Dados? Números?', bg: 'rgba(255,255,255,0.05)' },
  { hat: 'Vermelho — Emoção', color: '#e74c3c', prompt: 'O que seu INSTINTO diz? Sem justificar. Pressentimentos.', bg: 'rgba(231,76,60,0.06)' },
  { hat: 'Preto — Riscos', color: '#2c3e50', prompt: 'O que pode DAR ERRADO? Riscos, problemas, obstáculos.', bg: 'rgba(44,62,80,0.08)' },
  { hat: 'Amarelo — Oportunidade', color: '#f1c40f', prompt: 'O que pode DAR CERTO? Benefícios, oportunidades.', bg: 'rgba(241,196,15,0.06)' },
  { hat: 'Verde — Criatividade', color: '#2ecc71', prompt: 'Ideias NOVAS. Alternativas malucas. Sem filtro.', bg: 'rgba(46,204,113,0.06)' },
  { hat: 'Azul — Conclusão', color: '#3498db', prompt: 'SÍNTESE: qual a melhor ideia? Próximo passo concreto?', bg: 'rgba(52,152,219,0.06)' },
]

const PROVOCATIONS = [
  'E se seu produto fosse GRATUITO?',
  'E se só existisse por 24 HORAS?',
  'E se fosse feito por CRIANÇAS?',
  'E se funcionasse ao CONTRÁRIO?',
  'E se fosse ILEGAL? (o que isso revelaria?)',
]

type LabPhase = 'setup' | 'warmup' | 'choose' | 'session' | 'harvest' | 'action' | 'summary'
type Technique = 'scamper' | 'hats' | 'provocation'

export function LaboratorioCriatividade() {
  const [phase, setPhase] = useState<LabPhase>('setup')
  const [product, setProduct] = useState('')
  const [problem, setProblem] = useState('')
  const [technique, setTechnique] = useState<Technique>('scamper')
  const [warmupIdx, setWarmupIdx] = useState(0)
  const [warmupAnswers, setWarmupAnswers] = useState<string[]>([])
  const [currentWarmup, setCurrentWarmup] = useState('')
  const [roundIdx, setRoundIdx] = useState(0)
  const [roundIdeas, setRoundIdeas] = useState<string[]>([])
  const [currentIdea, setCurrentIdea] = useState('')
  const [allIdeas, setAllIdeas] = useState<string[]>([])
  const [topIdeas, setTopIdeas] = useState<Set<number>>(new Set())
  const [actionSteps, setActionSteps] = useState<Record<number, string>>({})
  const [startTime] = useState(Date.now())

  const onWarmupFinish = useCallback(() => {
    setWarmupAnswers(prev => [...prev, currentWarmup])
    setCurrentWarmup('')
    if (warmupIdx < WARMUPS.length - 1) {
      setWarmupIdx(i => i + 1)
    } else {
      setPhase('choose')
    }
  }, [currentWarmup, warmupIdx])

  const getRounds = () => {
    if (technique === 'scamper') return SCAMPER_OPS
    if (technique === 'hats') return HATS
    return PROVOCATIONS.map((p, i) => ({ prompt: p.replace('seu produto', product || 'seu produto') }))
  }

  const rounds = getRounds()
  const roundTime = technique === 'scamper' ? 60 : technique === 'hats' ? 90 : 75

  const onRoundFinish = useCallback(() => {
    if (currentIdea.trim()) {
      setRoundIdeas(prev => [...prev, currentIdea])
    }
    setCurrentIdea('')
    if (roundIdx < rounds.length - 1) {
      setRoundIdx(i => i + 1)
    } else {
      const final = currentIdea.trim() ? [...roundIdeas, currentIdea] : roundIdeas
      setAllIdeas(final)
      setPhase('harvest')
    }
  }, [currentIdea, roundIdx, rounds.length, roundIdeas])

  const saveIdea = () => {
    if (currentIdea.trim()) {
      setRoundIdeas(prev => [...prev, currentIdea])
      setCurrentIdea('')
    }
  }

  // ── SETUP ──
  if (phase === 'setup') {
    return (
      <div className="space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-white/25">Laboratório de Criatividade</p>
        <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[14px] text-white/60 mb-4">Vamos conduzir uma sessão real de criatividade com o SEU negócio. Prepare-se para pensar rápido.</p>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-white/25 uppercase tracking-wider">Seu produto ou serviço</label>
              <input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Ex: Loja de açaí gourmet"
                className="w-full bg-white/[0.03] rounded-lg px-3 py-2.5 text-[13px] text-white/60 placeholder:text-white/15 outline-none mt-1"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }} />
            </div>
            <div>
              <label className="text-[10px] text-white/25 uppercase tracking-wider">Problema que quer resolver</label>
              <input value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="Ex: Clientes não voltam depois da primeira compra"
                className="w-full bg-white/[0.03] rounded-lg px-3 py-2.5 text-[13px] text-white/60 placeholder:text-white/15 outline-none mt-1"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }} />
            </div>
          </div>
          <button onClick={() => product.trim() && setPhase('warmup')} disabled={!product.trim()}
            className="w-full mt-4 text-[12px] font-medium py-2.5 rounded-lg disabled:opacity-20"
            style={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30` }}>
            Iniciar Sessão →
          </button>
        </div>
      </div>
    )
  }

  // ── WARMUP ──
  if (phase === 'warmup') {
    const wu = WARMUPS[warmupIdx]
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/25">Aquecimento {warmupIdx + 1}/{WARMUPS.length}</p>
          <CountdownTimer key={warmupIdx} seconds={wu.time} onFinish={onWarmupFinish} />
        </div>
        <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${AMBER}15` }}>
          <p className="text-[15px] text-white/70 font-semibold mb-3">{wu.prompt}</p>
          <textarea value={currentWarmup} onChange={(e) => setCurrentWarmup(e.target.value)}
            placeholder="Escreva o máximo que conseguir antes do tempo acabar..."
            className="w-full bg-white/[0.03] rounded-lg px-3 py-2.5 text-[13px] text-white/60 placeholder:text-white/15 outline-none resize-none leading-relaxed"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }} rows={4} autoFocus />
          <button onClick={onWarmupFinish}
            className="mt-2 text-[11px] px-3 py-1.5 rounded-lg text-white/30" style={{ background: 'rgba(255,255,255,0.03)' }}>
            Próximo →
          </button>
        </div>
      </div>
    )
  }

  // ── CHOOSE TECHNIQUE ──
  if (phase === 'choose') {
    return (
      <div className="space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-white/25">Escolha a Técnica</p>
        <p className="text-[13px] text-white/40">Agora vamos aplicar uma técnica ao seu problema: <strong className="text-white/60">{problem || product}</strong></p>
        <div className="space-y-2">
          {[
            { id: 'scamper' as Technique, label: 'SCAMPER Express', desc: '7 rodadas de 60s. Cada operador aplicado ao seu produto.', rounds: '7 rodadas' },
            { id: 'hats' as Technique, label: '6 Chapéus Speed', desc: '6 perspectivas diferentes sobre seu problema. 90s cada.', rounds: '6 rodadas' },
            { id: 'provocation' as Technique, label: 'Provocação De Bono', desc: '5 provocações radicais que forçam pensamento lateral.', rounds: '5 rodadas' },
          ].map(t => (
            <button key={t.id} onClick={() => { setTechnique(t.id); setRoundIdx(0); setRoundIdeas([]); setPhase('session') }}
              className="w-full text-left rounded-xl p-4 transition-all"
              style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[14px] text-white/65 font-semibold">{t.label}</span>
                <span className="text-[10px] text-white/20 font-mono">{t.rounds}</span>
              </div>
              <p className="text-[11px] text-white/30">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── SESSION ──
  if (phase === 'session') {
    const round = rounds[roundIdx]
    const roundLabel = technique === 'scamper' ? (round as typeof SCAMPER_OPS[0]).op
      : technique === 'hats' ? (round as typeof HATS[0]).hat
      : `Provocação ${roundIdx + 1}`
    const prompt = technique === 'scamper' ? (round as typeof SCAMPER_OPS[0]).prompt
      : technique === 'hats' ? (round as typeof HATS[0]).prompt
      : (round as { prompt: string }).prompt
    const hatBg = technique === 'hats' ? (round as typeof HATS[0]).bg : 'rgba(0,0,0,0.2)'
    const hatColor = technique === 'hats' ? (round as typeof HATS[0]).color : undefined

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/25">Rodada {roundIdx + 1}/{rounds.length}</p>
          <CountdownTimer key={`${technique}-${roundIdx}`} seconds={roundTime} onFinish={onRoundFinish} />
        </div>
        <div className="flex gap-1">
          {rounds.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full" style={{ background: i < roundIdx ? GREEN : i === roundIdx ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.06)' }} />
          ))}
        </div>
        <div className="rounded-xl p-4" style={{ background: hatBg, border: `1px solid ${hatColor ? hatColor + '20' : 'rgba(255,255,255,0.06)'}` }}>
          <p className="text-[12px] font-bold mb-1" style={{ color: hatColor || 'rgba(255,255,255,0.4)' }}>{roundLabel}</p>
          <p className="text-[13px] text-white/55 mb-1">{prompt}</p>
          <p className="text-[11px] text-white/20 mb-3 italic">Aplicado a: {product}</p>
          <textarea value={currentIdea} onChange={(e) => setCurrentIdea(e.target.value)}
            placeholder="Escreva suas ideias aqui — rápido, sem filtro..."
            className="w-full bg-white/[0.03] rounded-lg px-3 py-2.5 text-[13px] text-white/60 placeholder:text-white/15 outline-none resize-none leading-relaxed"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }} rows={4} autoFocus />
          <div className="flex gap-2 mt-2">
            <button onClick={saveIdea} className="text-[11px] px-3 py-1.5 rounded-lg" style={{ background: `${GREEN}10`, color: GREEN }}>+ Salvar Ideia</button>
            <button onClick={onRoundFinish} className="text-[11px] px-3 py-1.5 rounded-lg text-white/30" style={{ background: 'rgba(255,255,255,0.03)' }}>Próxima Rodada →</button>
          </div>
          {roundIdeas.length > 0 && (
            <div className="mt-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-[9px] text-white/15 uppercase tracking-wider mb-1">{roundIdeas.length} ideias salvas</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── HARVEST ──
  if (phase === 'harvest') {
    return (
      <div className="space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-white/25">Colheita — Escolha as Top 3</p>
        <p className="text-[12px] text-white/35">Você gerou {allIdeas.length} ideias. Selecione as 3 melhores.</p>
        <div className="space-y-1.5">
          {allIdeas.map((idea, i) => (
            <button key={i} onClick={() => {
              const next = new Set(topIdeas)
              if (next.has(i)) next.delete(i)
              else if (next.size < 3) next.add(i)
              setTopIdeas(next)
            }}
              className="w-full text-left rounded-lg px-3 py-2.5 text-[12px] transition-all"
              style={{
                background: topIdeas.has(i) ? `${GREEN}10` : 'rgba(0,0,0,0.15)',
                border: `1px solid ${topIdeas.has(i) ? GREEN + '30' : 'rgba(255,255,255,0.04)'}`,
                color: topIdeas.has(i) ? GREEN : 'rgba(255,255,255,0.45)',
              }}>
              {idea}
            </button>
          ))}
        </div>
        {topIdeas.size === 3 && (
          <button onClick={() => setPhase('action')}
            className="w-full text-[12px] py-2.5 rounded-lg" style={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30` }}>
            Definir Próximos Passos →
          </button>
        )}
      </div>
    )
  }

  // ── ACTION ──
  if (phase === 'action') {
    const topArr = Array.from(topIdeas)
    return (
      <div className="space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-white/25">Próximos Passos</p>
        <p className="text-[12px] text-white/35">Para cada ideia top, defina 1 ação concreta para esta semana.</p>
        {topArr.map((idx, i) => (
          <div key={i} className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.15)', borderLeft: `3px solid ${GREEN}30` }}>
            <p className="text-[12px] text-white/50 mb-2">{allIdeas[idx]}</p>
            <input value={actionSteps[idx] || ''} onChange={(e) => setActionSteps(prev => ({ ...prev, [idx]: e.target.value }))}
              placeholder="Próximo passo concreto..."
              className="w-full bg-white/[0.03] rounded-lg px-3 py-2 text-[12px] text-white/60 placeholder:text-white/15 outline-none"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }} />
          </div>
        ))}
        <button onClick={() => setPhase('summary')}
          className="w-full text-[12px] py-2.5 rounded-lg" style={{ background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}30` }}>
          Ver Resumo da Sessão
        </button>
      </div>
    )
  }

  // ── SUMMARY ──
  const elapsed = Math.round((Date.now() - startTime) / 60000)
  const topArr = Array.from(topIdeas)
  return (
    <div className="space-y-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-white/25">Sessão Concluída</p>
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,0,0,0.15)' }}>
          <p className="text-[22px] font-bold font-mono" style={{ color: GREEN }}>{allIdeas.length}</p>
          <p className="text-[9px] text-white/25 uppercase">Ideias</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,0,0,0.15)' }}>
          <p className="text-[22px] font-bold font-mono text-white/50">{elapsed}</p>
          <p className="text-[9px] text-white/25 uppercase">Minutos</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,0,0,0.15)' }}>
          <p className="text-[22px] font-bold font-mono" style={{ color: BLUE }}>{technique.toUpperCase()}</p>
          <p className="text-[9px] text-white/25 uppercase">Técnica</p>
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.15)', border: `1px solid ${GREEN}15` }}>
        <p className="text-[11px] font-bold uppercase tracking-wider text-white/20 mb-3">Top 3 + Ações</p>
        {topArr.map((idx, i) => (
          <div key={i} className="mb-3 last:mb-0">
            <p className="text-[13px] text-white/55 font-medium">{i + 1}. {allIdeas[idx]}</p>
            {actionSteps[idx] && <p className="text-[11px] mt-1 pl-4" style={{ color: GREEN }}>→ {actionSteps[idx]}</p>}
          </div>
        ))}
      </div>

      <button onClick={() => { setPhase('setup'); setProduct(''); setProblem(''); setWarmupIdx(0); setWarmupAnswers([]); setRoundIdx(0); setRoundIdeas([]); setAllIdeas([]); setTopIdeas(new Set()); setActionSteps({}) }}
        className="w-full text-[12px] py-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)' }}>
        Nova Sessão
      </button>
    </div>
  )
}

// ── Export map ──────────────────────────────────────────────────────────────────

export const SIM_INTERACTIVE: Record<string, React.ComponentType> = {
  'caso-real': CasoRealInterativo,
  'lab-criatividade': LaboratorioCriatividade,
}
