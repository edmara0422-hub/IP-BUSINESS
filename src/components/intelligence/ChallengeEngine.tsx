'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const GREEN = '#1e8449'
const AMBER = '#9a7d0a'

interface Props {
  prompt: string
  rubric: string[]
  artifactType: string
  exampleResponse?: string
  moduleId?: string
}

export default function ChallengeEngine({ prompt, rubric, artifactType, exampleResponse, moduleId }: Props) {
  const [phase, setPhase] = useState<'challenge' | 'loading' | 'result'>('challenge')
  const [response, setResponse] = useState('')
  const [showExample, setShowExample] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [score, setScore] = useState(0)

  const submit = async () => {
    if (!response.trim()) return
    setPhase('loading')
    try {
      const rubricText = rubric.map((r, i) => `${i + 1}. ${r}`).join('\n')
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate-challenge',
          question: `DESAFIO: "${prompt}"\n\nRESPOSTA DO ALUNO:\n"${response}"\n\nCRITÉRIOS DE AVALIAÇÃO:\n${rubricText}\n\nAvalie a resposta em cada critério (0-100). Dê feedback específico e construtivo para cada um. No final, dê uma NOTA GERAL de 0 a 100. Formato:\n- Critério: nota/100 — feedback\n- ...\n- NOTA GERAL: XX/100`,
          submoduleTitle: artifactType,
          history: [],
        }),
      })
      const data = await res.json()
      const text = data.response || ''
      setFeedback(text)
      const scoreMatch = text.match(/NOTA GERAL:\s*(\d+)/i)
      setScore(scoreMatch ? parseInt(scoreMatch[1]) : 70)
    } catch {
      setFeedback('Erro ao conectar com a IA.')
      setScore(0)
    }
    setPhase('result')
  }

  const scoreColor = score >= 80 ? GREEN : score >= 50 ? AMBER : '#c0392b'

  if (phase === 'result') {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${scoreColor}15` }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: scoreColor }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: scoreColor }}>Resultado do Desafio</span>
          </div>
          <span className="text-[20px] font-bold font-mono" style={{ color: scoreColor }}>{score}/100</span>
        </div>
        <p className="text-[12px] text-white/45 leading-relaxed whitespace-pre-line">{feedback}</p>
        <button onClick={() => { setPhase('challenge'); setResponse(''); setFeedback('') }}
          className="mt-3 text-[11px] px-3 py-1.5 rounded-lg text-white/25" style={{ background: 'rgba(255,255,255,0.03)' }}>
          Tentar novamente
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${GREEN}12` }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full" style={{ background: GREEN }} />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: GREEN }}>Desafio — Aplique ao Seu Negócio</span>
      </div>

      <p className="text-[14px] text-white/65 leading-relaxed mb-3">{prompt}</p>

      {exampleResponse && (
        <div className="mb-3">
          <button onClick={() => setShowExample(!showExample)}
            className="text-[10px] text-white/20 hover:text-white/35 transition-colors">
            {showExample ? 'Ocultar exemplo' : 'Ver exemplo de resposta'}
          </button>
          {showExample && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mt-1.5 rounded-lg p-2.5 text-[11px] text-white/30 leading-relaxed"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              {exampleResponse}
            </motion.div>
          )}
        </div>
      )}

      <div className="mb-2">
        <p className="text-[9px] text-white/15 uppercase tracking-wider mb-1">Critérios de avaliação:</p>
        <div className="flex flex-wrap gap-1">
          {rubric.map((r, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.25)' }}>{r}</span>
          ))}
        </div>
      </div>

      <textarea value={response} onChange={(e) => setResponse(e.target.value)}
        placeholder="Descreva sua análise aplicada ao seu negócio..."
        className="w-full bg-white/[0.03] rounded-lg px-3 py-2.5 text-[13px] text-white/60 placeholder:text-white/15 outline-none resize-none leading-relaxed"
        style={{ border: '1px solid rgba(255,255,255,0.06)' }} rows={5} />

      <button onClick={submit} disabled={!response.trim() || phase === 'loading'}
        className="mt-2 text-[12px] font-medium px-4 py-2.5 rounded-lg w-full disabled:opacity-30"
        style={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}25` }}>
        {phase === 'loading' ? 'IA avaliando...' : 'Enviar para Avaliação da IA'}
      </button>
    </motion.div>
  )
}
