'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Leadership Style ────────────────────────────────────────────────────────

const LEADERSHIP_SCENARIOS = [
  { situation: 'Novo estagiário chega na equipe. Nunca trabalhou na área. Está motivado mas não sabe por onde começar.', s1: 'Dou instruções detalhadas passo a passo e acompanho de perto', s2: 'Explico o contexto, defino metas e faço check-ins frequentes', s3: 'Pergunto o que ele precisa e ofereço suporte quando pedir', s4: 'Apresento o projeto e deixo ele explorar sozinho' },
  { situation: 'Analista sênior com 5 anos de casa. Competente, mas desmotivada após ser preterida numa promoção.', s1: 'Reforço as metas e prazos — foco no que precisa ser entregue', s2: 'Converso sobre desenvolvimento de carreira e traço plano juntos', s3: 'Ofereço projetos mais desafiadores e reconheço publicamente seu trabalho', s4: 'Dou autonomia total — ela sabe o que fazer' },
  { situation: 'Time precisa entregar um relatório urgente para o CEO em 48 horas. A equipe nunca fez algo assim antes.', s1: 'Assumo a coordenação, distribuo tarefas específicas e reviso cada parte', s2: 'Defino a estrutura, distribuo responsabilidades e faço checkpoint a cada 6h', s3: 'Pergunto à equipe como querem dividir e fico disponível para dúvidas', s4: 'Delego para o membro mais sênior e confio no resultado' },
  { situation: 'Desenvolvedor pleno pede para liderar um projeto novo. Tem competência técnica mas nunca liderou.', s1: 'Nego — ele não tem experiência suficiente para liderar', s2: 'Aceito, defino os guardrails juntos e faço mentoria semanal', s3: 'Aceito e ofereço suporte se ele precisar', s4: 'Aceito e deixo ele conduzir com total autonomia' },
  { situation: 'Equipe de vendas bateu recorde no trimestre. Moral está alta. Próximo trimestre tem meta 30% maior.', s1: 'Apresento a nova meta com plano detalhado de como atingir', s2: 'Celebro o resultado, apresento o desafio e construo o plano junto com a equipe', s3: 'Celebro e pergunto à equipe como querem abordar a meta maior', s4: 'Celebro e confio que vão encontrar o caminho — já provaram que sabem' },
  { situation: 'Funcionário que era ótimo começou a entregar abaixo do esperado há 3 semanas. Você não sabe o motivo.', s1: 'Chamo para conversa, mostro os números e peço que melhore imediatamente', s2: 'Chamo para 1:1, pergunto se está tudo bem e ofereço ajuda para diagnosticar o problema', s3: 'Dou mais espaço e espero ele vir falar comigo quando estiver pronto', s4: 'Não interfiro — deve ser algo passageiro' },
  { situation: 'Dois membros da equipe discordam publicamente sobre a abordagem técnica de um projeto crítico.', s1: 'Decido qual abordagem usar e encerro a discussão', s2: 'Facilito a discussão, peço que cada um apresente prós e contras, e ajudo a equipe a decidir', s3: 'Deixo os dois resolverem entre si e me procurarem se precisarem', s4: 'Ignoro — conflito técnico é normal e se resolve sozinho' },
  { situation: 'Empresa está fazendo layoff. Sua equipe não será afetada, mas a moral caiu drasticamente.', s1: 'Reforço que o trabalho deve continuar normalmente e foco nas entregas', s2: 'Reúno a equipe, sou transparente sobre a situação e abro espaço para perguntas e sentimentos', s3: 'Converso individualmente com quem parecer mais afetado', s4: 'Não abordo — quem ficou deveria estar aliviado' },
  { situation: 'Membro da equipe remota entrega consistentemente, mas nunca participa das reuniões e não interage com colegas.', s1: 'Torno a participação em reuniões obrigatória e cobro presença', s2: 'Converso em 1:1 para entender o motivo e encontrar formato que funcione para ele e para a equipe', s3: 'Deixo como está — resultado é o que importa', s4: 'Nem percebi que isso era um problema' },
  { situation: 'Você recebe uma ideia inovadora de um júnior. A ideia tem potencial mas precisa de muito refinamento.', s1: 'Agradeço, mas digo que não é o momento — temos prioridades', s2: 'Elogio a iniciativa, ajudo a refinar e dou um prazo para ele apresentar a v2', s3: 'Encorajo e peço que apresente para a equipe na próxima reunião', s4: 'Dou carta branca para desenvolver nos horários livres' },
  { situation: 'A equipe precisa adotar uma ferramenta nova que ninguém conhece. O prazo de implementação é 30 dias.', s1: 'Eu aprendo primeiro e depois ensino a equipe com treinamento estruturado', s2: 'Identifico quem tem mais aptidão, dou ownership da implementação e ofereço treinamento externo', s3: 'Pergunto à equipe como querem abordar o aprendizado', s4: 'Distribuo links de tutorial e espero que aprendam no ritmo deles' },
  { situation: 'Fim de ano. Precisa avaliar performance de 8 pessoas. 2 foram excepcionais, 4 boas, 2 abaixo.', s1: 'Preencho as avaliações baseado nos números e entrego ao RH', s2: 'Para cada pessoa, preparo feedback SBI específico, discuto em 1:1 e co-crio o PDI', s3: 'Peço que cada pessoa faça autoavaliação primeiro e converso sobre as diferenças', s4: 'Delego para os sub-líderes e reviso apenas os casos extremos' },
]

const STYLE_PROFILES = [
  { key: 's1', label: 'Diretivo', color: '#ef4444', desc: 'Alta direção, baixo suporte. Você tende a assumir o controle e dar instruções claras.', strength: 'Eficaz em crises e com equipes inexperientes. Decisões rápidas.', gap: 'Pode sufocar a autonomia e criatividade. Equipes maduras se sentem infantilizadas.', tip: 'Calibre: use S1 apenas com baixa competência + baixo comprometimento. Para os demais, suba o nível de delegação.' },
  { key: 's2', label: 'Orientador', color: '#f59e0b', desc: 'Alta direção, alto suporte. Você guia com contexto, mentoria e check-ins.', strength: 'Desenvolve pessoas enquanto mantém qualidade. Equilibra resultado e crescimento.', gap: 'Pode ser lento — nem toda situação permite coaching. Risco de não delegar o suficiente.', tip: 'Ideal para a maioria das situações. Evolua para S3/S4 à medida que a equipe amadurece.' },
  { key: 's3', label: 'Apoiador', color: '#22c55e', desc: 'Baixa direção, alto suporte. Você confia na competência e oferece suporte emocional.', strength: 'Ótimo para profissionais competentes que precisam de encorajamento. Fortalece autonomia.', gap: 'Se usado com pessoas inexperientes, gera confusão e abandono. Pode parecer passivo.', tip: 'Certifique-se de que a pessoa TEM competência antes de usar este estilo. Apoiar sem direcionar exige maturidade do liderado.' },
  { key: 's4', label: 'Delegador', color: '#3b82f6', desc: 'Baixa direção, baixo suporte. Você delega e confia no resultado.', strength: 'Libera seu tempo para estratégia. Empodera seniores.', gap: 'Se usado prematuramente, parece abandono. Se usado sempre, perde conexão com a equipe.', tip: 'Reserve para pessoas com alta competência E alto comprometimento. Mesmo delegando, mantenha 1:1s regulares.' },
]

export function LeadershipStyle() {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResult, setShowResult] = useState(false)

  const scenario = LEADERSHIP_SCENARIOS[idx]
  const totalAnswered = Object.keys(answers).length
  const allDone = totalAnswered === LEADERSHIP_SCENARIOS.length

  const tally = STYLE_PROFILES.map(p => ({
    ...p,
    count: Object.values(answers).filter(a => a === p.key).length,
  })).sort((a, b) => b.count - a.count)

  const dominant = tally[0]

  return (
    <div className="space-y-4">
      {!showResult ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-[9px] uppercase tracking-[0.28em] text-white/28">Cenário {idx + 1}/{LEADERSHIP_SCENARIOS.length}</p>
            <p className="text-[10px] text-white/24">{totalAnswered}/{LEADERSHIP_SCENARIOS.length} respondidos</p>
          </div>

          <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-[13px] text-white/64 leading-relaxed">{scenario.situation}</p>

            <div className="space-y-2">
              {(['s1', 's2', 's3', 's4'] as const).map(s => (
                <button key={s} onClick={() => setAnswers(prev => ({ ...prev, [idx]: s }))}
                  className={`w-full text-left rounded-[0.8rem] border px-4 py-3 text-[12px] leading-relaxed transition-all ${
                    answers[idx] === s ? 'border-white/20 bg-white/[0.08] text-white/80' : 'border-white/[0.06] text-white/44 hover:border-white/12'
                  }`}>
                  {scenario[s]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
              className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">← Anterior</button>
            {allDone ? (
              <button onClick={() => setShowResult(true)}
                className="rounded-[0.8rem] border border-white/20 bg-white/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:bg-white/[0.1]">
                Ver Resultado
              </button>
            ) : (
              <p className="text-[10px] text-white/20">{LEADERSHIP_SCENARIOS.length - totalAnswered} restantes</p>
            )}
            <button onClick={() => setIdx(i => Math.min(LEADERSHIP_SCENARIOS.length - 1, i + 1))} disabled={idx === LEADERSHIP_SCENARIOS.length - 1}
              className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">Próximo →</button>
          </div>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/28">Seu Estilo Dominante</p>
                <p className="text-[20px] font-bold mt-1" style={{ color: dominant.color }}>{dominant.label}</p>
              </div>
              <p className="text-[28px] font-bold text-white/40">{dominant.count}/{LEADERSHIP_SCENARIOS.length}</p>
            </div>
            <p className="text-[13px] text-white/56 leading-relaxed">{dominant.desc}</p>
          </div>

          {/* Bars */}
          <div className="space-y-3">
            {tally.map(t => (
              <div key={t.key} className="space-y-1">
                <div className="flex justify-between items-center">
                  <p className="text-[11px] font-semibold" style={{ color: t.color }}>{t.label}</p>
                  <p className="text-[10px] text-white/36">{t.count} respostas</p>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: t.color }}
                    animate={{ width: `${(t.count / LEADERSHIP_SCENARIOS.length) * 100}%` }} transition={{ duration: 0.4 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Analysis */}
          <div className="space-y-3">
            {[tally[0], tally[tally.length - 1]].map((t, i) => (
              <div key={t.key} className="rounded-[0.9rem] border border-white/[0.06] p-4 space-y-2" style={{ background: 'rgba(255,255,255,0.015)' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: t.color }}>
                  {i === 0 ? 'Ponto Forte' : 'Área de Desenvolvimento'} — {t.label}
                </p>
                <p className="text-[11px] text-white/44 leading-relaxed">{i === 0 ? t.strength : t.gap}</p>
                <p className="text-[11px] text-white/56 leading-relaxed">→ {t.tip}</p>
              </div>
            ))}
          </div>

          <button onClick={() => { setShowResult(false); setIdx(0) }}
            className="w-full rounded-[0.8rem] border border-white/[0.08] py-2 text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/50">
            Refazer
          </button>
        </motion.div>
      )}
    </div>
  )
}

// ── Tuckman Diagnostic ──────────────────────────────────────────────────────

const TUCKMAN_QUESTIONS = [
  { q: 'As pessoas evitam discordar abertamente umas das outras', phase: 'forming' },
  { q: 'Os papéis e responsabilidades de cada membro são claros para todos', phase: 'norming' },
  { q: 'Existem disputas recorrentes sobre prioridades ou métodos de trabalho', phase: 'storming' },
  { q: 'A equipe resolve problemas complexos sem precisar do líder', phase: 'performing' },
  { q: 'Novos membros relatam dificuldade em entender "como as coisas funcionam aqui"', phase: 'forming' },
  { q: 'Há tensão entre 2-3 pessoas que afeta o clima do grupo', phase: 'storming' },
  { q: 'Existem acordos claros sobre como a equipe se comunica e toma decisões', phase: 'norming' },
  { q: 'A equipe antecipa problemas e propõe soluções antes de serem pedidas', phase: 'performing' },
  { q: 'As pessoas fazem perguntas básicas sobre o propósito do time ou do projeto', phase: 'forming' },
  { q: 'A equipe celebra conquistas e faz retrospectivas regularmente', phase: 'performing' },
]

const TUCKMAN_PHASES = [
  { key: 'forming', label: 'Forming', color: '#60a5fa', desc: 'Formação — a equipe ainda está se conhecendo', actions: ['Defina propósito e metas com clareza cristalina', 'Estabeleça papéis e responsabilidades por escrito', 'Crie rituais de integração (icebreakers, almoços)', 'Seja mais diretivo — a equipe precisa de estrutura agora'] },
  { key: 'storming', label: 'Storming', color: '#f97316', desc: 'Conflito — diferenças aparecem, tensão é natural', actions: ['NÃO evite o conflito — medie com Thomas-Kilmann', 'Normalize: "discordância é sinal de que estamos pensando"', 'Reforce o propósito comum acima das diferenças individuais', 'Abra espaço para conversas difíceis em ambiente seguro'] },
  { key: 'norming', label: 'Norming', color: '#eab308', desc: 'Normatização — regras se formam, confiança cresce', actions: ['Formalize os acordos de trabalho (working agreements)', 'Transicione de diretivo para orientador/apoiador', 'Incentive feedback peer-to-peer', 'Comece a delegar decisões menores para a equipe'] },
  { key: 'performing', label: 'Performing', color: '#22c55e', desc: 'Performance — equipe opera com autonomia e entrega', actions: ['Delegue e saia do caminho — confie na equipe', 'Foque em remover obstáculos, não em direcionar', 'Invista em desafios novos para evitar estagnação', 'Mantenha 1:1s e retrospectivas para manter a saúde'] },
]

export function TuckmanDiagnostic() {
  const [scores, setScores] = useState<Record<number, number>>({})
  const allFilled = Object.keys(scores).length === TUCKMAN_QUESTIONS.length

  const phaseScores = TUCKMAN_PHASES.map(p => ({
    ...p,
    score: TUCKMAN_QUESTIONS.reduce((sum, q, i) => sum + (q.phase === p.key ? (scores[i] || 0) : 0), 0),
    count: TUCKMAN_QUESTIONS.filter(q => q.phase === p.key).length,
  }))

  const dominant = [...phaseScores].sort((a, b) => (b.score / b.count) - (a.score / a.count))[0]

  return (
    <div className="space-y-4">
      <p className="text-[9px] uppercase tracking-[0.28em] text-white/28">Avalie cada afirmação de 1 (discordo totalmente) a 5 (concordo totalmente)</p>

      <div className="space-y-3">
        {TUCKMAN_QUESTIONS.map((q, i) => (
          <div key={i} className="rounded-[0.9rem] border border-white/[0.06] p-4 space-y-2" style={{ background: 'rgba(255,255,255,0.015)' }}>
            <p className="text-[12px] text-white/60 leading-relaxed">{q.q}</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setScores(prev => ({ ...prev, [i]: n }))}
                  className={`flex-1 rounded-[0.5rem] border py-1.5 text-[11px] font-bold transition-all ${
                    scores[i] === n ? 'border-white/30 bg-white/[0.1] text-white/90' : 'border-white/[0.06] text-white/24 hover:text-white/50'
                  }`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {allFilled && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/28">Fase Dominante</p>
              <p className="text-[18px] font-bold mt-1" style={{ color: dominant.color }}>{dominant.label}</p>
            </div>
          </div>
          <p className="text-[13px] text-white/50">{dominant.desc}</p>

          {/* Bars */}
          <div className="space-y-2">
            {phaseScores.map(p => {
              const avg = p.score / p.count
              return (
                <div key={p.key} className="flex items-center gap-3">
                  <p className="text-[10px] w-[80px] shrink-0 truncate" style={{ color: p.color }}>{p.label}</p>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: p.color }}
                      animate={{ width: `${(avg / 5) * 100}%` }} transition={{ duration: 0.4 }} />
                  </div>
                  <p className="text-[10px] text-white/36 w-6 text-right">{avg.toFixed(1)}</p>
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="rounded-[0.8rem] border border-white/[0.06] p-4 space-y-2" style={{ background: 'rgba(255,255,255,0.015)' }}>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/28">Ações para Avançar</p>
            {dominant.actions.map((a, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="mt-[6px] h-1 w-1 shrink-0 rounded-full" style={{ background: dominant.color }} />
                <p className="text-[12px] text-white/50 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ── Conflict Management ─────────────────────────────────────────────────────

const CONFLICT_SCENARIOS = [
  { situation: 'Dois gestores disputam o mesmo orçamento para projetos igualmente prioritários. O CEO precisa decidir hoje.', best: 'comprometer', explanation: 'Tempo curto + dois lados com poder similar + ambos prioritários = compromisso é a saída mais pragmática. Cada um recebe parte do orçamento. Colaborar seria ideal, mas não há tempo.' },
  { situation: 'Um funcionário denuncia assédio moral de um colega. As evidências são claras e múltiplas testemunhas confirmam.', best: 'competir', explanation: 'Questão ética inegociável. Não há espaço para acomodar, comprometer ou evitar. Ação imediata é obrigatória — investigar, proteger a vítima, aplicar consequências.' },
  { situation: 'Equipe de marketing quer mudar a identidade visual. Equipe de vendas diz que os clientes vão estranhar. Ambos têm dados.', best: 'colaborar', explanation: 'Questão importante para ambos + relacionamento de longo prazo + há dados dos dois lados. Ideal: reunir os dados, definir critérios objetivos e co-criar uma solução que atenda marketing e vendas (ex: mudança gradual com teste A/B).' },
  { situation: 'Colega de outro departamento pede que você mude a data de um relatório que impacta pouco o seu trabalho mas é crucial para ele.', best: 'acomodar', explanation: 'O assunto importa muito mais para o outro do que para você. Ceder aqui preserva o relacionamento e custa quase nada. Acomodar é a escolha inteligente quando a questão é assimétrica.' },
  { situation: 'Dois programadores discutem sobre usar tabs ou espaços na formatação do código. A discussão se estende há 20 minutos.', best: 'evitar', explanation: 'Questão trivial que não impacta resultado. O melhor é interromper: "vamos usar o linter padrão e seguir". Gastar energia aqui é desperdício — evitar/encerrar e seguir em frente.' },
  { situation: 'Fornecedor quer reajuste de 15%. Sua empresa pode absorver 5% sem afetar margem. Perder o fornecedor custaria 3 meses de busca.', best: 'comprometer', explanation: 'Ambos têm algo a perder. Nenhum pode impor sua posição sem custo. Comprometer (7-8% com contrato mais longo, por exemplo) atende os dois lados razoavelmente.' },
]

const CONFLICT_STYLES = [
  { key: 'competir', label: 'Competir', color: '#ef4444', desc: 'Alta assertividade, baixa cooperação' },
  { key: 'acomodar', label: 'Acomodar', color: '#60a5fa', desc: 'Baixa assertividade, alta cooperação' },
  { key: 'evitar', label: 'Evitar', color: '#a78bfa', desc: 'Baixa assertividade, baixa cooperação' },
  { key: 'comprometer', label: 'Comprometer', color: '#f59e0b', desc: 'Assertividade média, cooperação média' },
  { key: 'colaborar', label: 'Colaborar', color: '#22c55e', desc: 'Alta assertividade, alta cooperação' },
]

export function ConflictManagement() {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  const scenario = CONFLICT_SCENARIOS[idx]
  const myAnswer = answers[idx]
  const isRevealed = revealed[idx] || false
  const isCorrect = myAnswer === scenario.best
  const correct = Object.keys(revealed).filter(k => answers[Number(k)] === CONFLICT_SCENARIOS[Number(k)].best).length
  const total = Object.keys(revealed).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 overflow-x-auto">
          {CONFLICT_SCENARIOS.map((_, i) => {
            const done = revealed[i]
            const right = done && answers[i] === CONFLICT_SCENARIOS[i].best
            return (
              <button key={i} onClick={() => setIdx(i)}
                className={`shrink-0 rounded-[0.75rem] border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all ${
                  idx === i ? 'border-white/20 bg-white/[0.08] text-white/88'
                    : done ? (right ? 'border-green-500/30 text-green-400/60' : 'border-red-500/30 text-red-400/60')
                      : 'border-white/[0.06] text-white/28'
                }`}>
                {String(i + 1).padStart(2, '0')}
              </button>
            )
          })}
        </div>
        {total > 0 && <p className="text-[10px] text-white/24 shrink-0 ml-2">{correct}/{total}</p>}
      </div>

      <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <p className="text-[13px] text-white/60 leading-relaxed">{scenario.situation}</p>

        <div className="space-y-2">
          <p className="text-[9px] uppercase tracking-[0.22em] text-white/28">Qual estilo usar?</p>
          <div className="grid grid-cols-2 gap-2">
            {CONFLICT_STYLES.map(s => (
              <button key={s.key} onClick={() => !isRevealed && setAnswers(prev => ({ ...prev, [idx]: s.key }))}
                className={`rounded-[0.7rem] border px-3 py-2.5 text-left transition-all ${
                  myAnswer === s.key
                    ? (isRevealed ? (s.key === scenario.best ? 'border-green-500/40 bg-green-500/[0.08]' : 'border-red-500/40 bg-red-500/[0.08]') : 'border-white/20 bg-white/[0.08]')
                    : (isRevealed && s.key === scenario.best ? 'border-green-500/30 bg-green-500/[0.04]' : 'border-white/[0.06]')
                }`}>
                <p className="text-[11px] font-bold" style={{ color: s.color }}>{s.label}</p>
                <p className="text-[9px] text-white/28 mt-0.5">{s.desc}</p>
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
            className={`rounded-[0.8rem] border p-4 ${isCorrect ? 'border-green-500/20' : 'border-amber-500/20'}`}
            style={{ background: isCorrect ? 'rgba(34,197,94,0.04)' : 'rgba(245,158,11,0.04)' }}>
            <p className="text-[11px] font-bold mb-1" style={{ color: isCorrect ? '#4ade80' : '#f59e0b' }}>
              {isCorrect ? 'Correto!' : `Melhor abordagem: ${CONFLICT_STYLES.find(s => s.key === scenario.best)?.label}`}
            </p>
            <p className="text-[12px] text-white/56 leading-relaxed">{scenario.explanation}</p>
          </motion.div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">← Anterior</button>
        <button onClick={() => setIdx(i => Math.min(CONFLICT_SCENARIOS.length - 1, i + 1))} disabled={idx === CONFLICT_SCENARIOS.length - 1}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">Próximo →</button>
      </div>
    </div>
  )
}

// ── Leadership 360 Diagnostic ───────────────────────────────────────────────

const L360_DIMENSIONS = [
  { id: 'situational', label: 'Liderança Situacional', desc: 'Adapta estilo ao contexto e maturidade do liderado' },
  { id: 'ei', label: 'Inteligência Emocional', desc: 'Autoconsciência, autorregulação, empatia' },
  { id: 'delegation', label: 'Delegação', desc: 'Distribui responsabilidades e confia na equipe' },
  { id: 'feedback', label: 'Feedback', desc: 'Dá retorno frequente, específico e construtivo' },
  { id: 'conflict', label: 'Gestão de Conflitos', desc: 'Transforma tensão em resultado sem evitar ou impor' },
  { id: 'motivation', label: 'Motivação', desc: 'Gera engajamento via autonomia, competência e propósito' },
  { id: 'safety', label: 'Segurança Psicológica', desc: 'Equipe se sente segura para discordar, errar e propor' },
  { id: 'team', label: 'Maturidade da Equipe', desc: 'Equipe opera com autonomia, resolve problemas e entrega' },
]

const L360_LEVELS = [
  { min: 0, max: 2, label: 'Crítico', color: '#ef4444', advice: 'Priorize desenvolvimento urgente em liderança. Invista em mentoria, coaching e formação estruturada. Foque nas 2 dimensões mais baixas primeiro.' },
  { min: 2, max: 3, label: 'Em Desenvolvimento', color: '#f97316', advice: 'Base em construção. Implemente 1:1s semanais, pratique feedback SBI diariamente e peça feedback da equipe sobre seu estilo.' },
  { min: 3, max: 3.8, label: 'Competente', color: '#eab308', advice: 'Sólido na maioria das dimensões. Foque em elevar as 2 dimensões mais baixas e comece a desenvolver outros líderes na equipe.' },
  { min: 3.8, max: 4.5, label: 'Avançado', color: '#22c55e', advice: 'Liderança consistente. Próximo passo: mentorear outros gestores e construir cultura de liderança na organização.' },
  { min: 4.5, max: 5.1, label: 'Referência', color: '#3b82f6', advice: 'Excelência em liderança. Compartilhe seu modelo: escreva, ensine, forme a próxima geração de líderes.' },
]

export function Leadership360() {
  const [scores, setScores] = useState<Record<string, number>>({})
  const allFilled = L360_DIMENSIONS.every(d => scores[d.id] !== undefined)
  const avg = allFilled ? L360_DIMENSIONS.reduce((s, d) => s + (scores[d.id] || 0), 0) / L360_DIMENSIONS.length : 0
  const level = L360_LEVELS.find(l => avg >= l.min && avg < l.max) || L360_LEVELS[0]

  const sorted = allFilled ? [...L360_DIMENSIONS].sort((a, b) => (scores[a.id] || 0) - (scores[b.id] || 0)) : []
  const weakest = sorted[0]
  const strongest = sorted[sorted.length - 1]

  return (
    <div className="space-y-4">
      <p className="text-[9px] uppercase tracking-[0.28em] text-white/28">Avalie sua liderança em 8 dimensões (1 = fraco, 5 = excelente)</p>

      <div className="space-y-3">
        {L360_DIMENSIONS.map(dim => (
          <div key={dim.id} className="rounded-[0.9rem] border border-white/[0.06] p-4 space-y-2" style={{ background: 'rgba(255,255,255,0.015)' }}>
            <div>
              <p className="text-[12px] font-semibold text-white/72">{dim.label}</p>
              <p className="text-[10px] text-white/32">{dim.desc}</p>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setScores(prev => ({ ...prev, [dim.id]: n }))}
                  className={`flex-1 rounded-[0.5rem] border py-1.5 text-[11px] font-bold transition-all ${
                    scores[dim.id] === n ? 'border-white/30 bg-white/[0.1] text-white/90' : 'border-white/[0.06] text-white/24 hover:text-white/50'
                  }`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {allFilled && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/28">Nível de Liderança</p>
              <p className="text-[18px] font-bold mt-1" style={{ color: level.color }}>{level.label}</p>
            </div>
            <p className="text-[28px] font-bold text-white/60">{avg.toFixed(1)}</p>
          </div>

          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ background: level.color }}
              animate={{ width: `${(avg / 5) * 100}%` }} transition={{ duration: 0.5 }} />
          </div>

          {/* Radar bars */}
          <div className="space-y-2">
            {L360_DIMENSIONS.map(dim => {
              const val = scores[dim.id] || 0
              const dimColor = val >= 4 ? '#22c55e' : val >= 3 ? '#eab308' : '#ef4444'
              return (
                <div key={dim.id} className="flex items-center gap-3">
                  <p className="text-[10px] text-white/36 w-[110px] shrink-0 truncate">{dim.label}</p>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: dimColor }}
                      animate={{ width: `${(val / 5) * 100}%` }} transition={{ duration: 0.4 }} />
                  </div>
                  <p className="text-[10px] font-bold text-white/40 w-4 text-right">{val}</p>
                </div>
              )
            })}
          </div>

          {/* Insights */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-[0.7rem] border border-green-500/10 p-3" style={{ background: 'rgba(34,197,94,0.03)' }}>
              <p className="text-[9px] uppercase tracking-[0.2em] text-green-400/50 mb-1">Ponto Forte</p>
              <p className="text-[11px] font-semibold text-white/60">{strongest?.label}</p>
              <p className="text-[10px] text-white/32 mt-0.5">Nota: {scores[strongest?.id]}/5</p>
            </div>
            <div className="rounded-[0.7rem] border border-red-500/10 p-3" style={{ background: 'rgba(239,68,68,0.03)' }}>
              <p className="text-[9px] uppercase tracking-[0.2em] text-red-400/50 mb-1">Prioridade</p>
              <p className="text-[11px] font-semibold text-white/60">{weakest?.label}</p>
              <p className="text-[10px] text-white/32 mt-0.5">Nota: {scores[weakest?.id]}/5</p>
            </div>
          </div>

          <div className="rounded-[0.8rem] border border-white/[0.06] p-3" style={{ background: 'rgba(255,255,255,0.015)' }}>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/28 mb-1">Recomendação</p>
            <p className="text-[12px] text-white/56 leading-relaxed">{level.advice}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ── Export map ───────────────────────────────────────────────────────────────

export const SIM_M3_LEADERSHIP: Record<string, React.ComponentType> = {
  'leadership-style': LeadershipStyle,
  'tuckman-diagnostic': TuckmanDiagnostic,
  'conflict-management': ConflictManagement,
  'leadership-360': Leadership360,
}
