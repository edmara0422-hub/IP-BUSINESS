'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const GREEN = '#1e8449'
const RED = '#c0392b'
const AMBER = '#9a7d0a'

interface Props {
  context: string
  sampleQuestions: string[]
  moduleId?: string
}

export default function AIProbe({ context, sampleQuestions, moduleId }: Props) {
  const [phase, setPhase] = useState<'ready' | 'question' | 'answered'>('ready')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [passed, setPassed] = useState<boolean | null>(null)

  const startProbe = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-probe',
          question: `Gere UMA pergunta de compreensão sobre: "${context}". Exemplos de perguntas boas: ${sampleQuestions.join(' | ')}. Retorne APENAS a pergunta, sem explicação.`,
          submoduleTitle: context,
          history: [],
        }),
      })
      const data = await res.json()
      setQuestion(data.response || sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)])
    } catch {
      setQuestion(sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)])
    }
    setLoading(false)
    setPhase('question')
  }

  const submitAnswer = async () => {
    if (!answer.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate-probe',
          question: `Pergunta: "${question}". Contexto do conteúdo: "${context}". Resposta do aluno: "${answer}". Avalie se o aluno demonstrou compreensão. Responda em 2-3 frases: o que acertou e o que faltou. No final, diga APROVADO ou REVISAR.`,
          selectedText: answer,
          submoduleTitle: context,
          history: [],
        }),
      })
      const data = await res.json()
      const resp = data.response || ''
      setFeedback(resp)
      setPassed(resp.toLowerCase().includes('aprovado'))
    } catch {
      setFeedback('Erro ao conectar com a IA.')
      setPassed(null)
    }
    setLoading(false)
    setPhase('answered')
  }

  if (phase === 'ready') {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${AMBER}15` }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full" style={{ background: AMBER }} />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: AMBER }}>Verificação de Compreensão</p>
        </div>
        <p className="text-[13px] text-white/40 mb-3">A IA vai fazer uma pergunta sobre o que você acabou de estudar. Responda com suas palavras.</p>
        <button onClick={startProbe} disabled={loading}
          className="text-[12px] font-medium px-4 py-2.5 rounded-lg w-full"
          style={{ background: `${AMBER}12`, color: AMBER, border: `1px solid ${AMBER}22` }}>
          {loading ? 'Gerando pergunta...' : 'Estou pronto — pergunte'}
        </button>
      </motion.div>
    )
  }

  if (phase === 'question') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${AMBER}15` }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: AMBER }}>Pergunta</p>
        <p className="text-[14px] text-white/65 leading-relaxed mb-3 font-medium">{question}</p>
        <textarea value={answer} onChange={(e) => setAnswer(e.target.value)}
          placeholder="Sua resposta..."
          className="w-full bg-white/[0.03] rounded-lg px-3 py-2.5 text-[13px] text-white/60 placeholder:text-white/15 outline-none resize-none leading-relaxed"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }} rows={4} autoFocus />
        <button onClick={submitAnswer} disabled={!answer.trim() || loading}
          className="mt-2 text-[12px] font-medium px-4 py-2.5 rounded-lg w-full disabled:opacity-30"
          style={{ background: `${AMBER}12`, color: AMBER, border: `1px solid ${AMBER}22` }}>
          {loading ? 'IA avaliando...' : 'Enviar Resposta'}
        </button>
      </motion.div>
    )
  }

  // answered
  const color = passed ? GREEN : passed === false ? RED : AMBER
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="rounded-xl p-4" style={{ background: `${color}04`, border: `1px solid ${color}15` }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color }}>
          {passed ? 'Aprovado' : passed === false ? 'Revisar' : 'Resultado'}
        </p>
      </div>
      <p className="text-[13px] text-white/50 leading-relaxed">{feedback}</p>
    </motion.div>
  )
}
