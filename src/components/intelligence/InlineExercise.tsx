'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BLUE = '#2e86c1'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'

interface Props {
  prompt: string
  context?: string
  fields: Array<{
    id: string
    label: string
    placeholder?: string
    multiline?: boolean
  }>
  evaluationCriteria: string[]
  expectedConcepts?: string[]
  submoduleTitle?: string
}

/**
 * Micro-exercício embutido no fluxo do texto.
 * Aluno preenche, IA avalia na hora, feedback curto.
 * Não é challenge grande — é checkpoint ativo durante a leitura.
 */
export default function InlineExercise({
  prompt, context, fields, evaluationCriteria, expectedConcepts, submoduleTitle,
}: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.id, '']))
  )
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const allFilled = fields.every((f) => (values[f.id] || '').trim().length > 3)

  const evaluate = async () => {
    if (!allFilled) return
    setLoading(true)
    setErrorMsg(null)

    const answersBlock = fields
      .map((f) => `${f.label}: "${values[f.id]}"`)
      .join('\n')

    const criteriaBlock = evaluationCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')
    const conceptsBlock = expectedConcepts?.length
      ? `\n\nConceitos que a resposta ideal tocaria: ${expectedConcepts.join(', ')}`
      : ''

    const question = `Avalie esta resposta de exercício de estudo.

EXERCÍCIO: ${prompt}
${context ? `\nCONTEXTO: ${context}` : ''}

RESPOSTAS DO ALUNO:
${answersBlock}

CRITÉRIOS DE AVALIAÇÃO:
${criteriaBlock}
${conceptsBlock}

Dê feedback curto (3-4 frases): o que está bom, o que falta, uma sugestão específica para aprofundar. Seja direto e útil, sem julgamento. Não dê nota numérica.`

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate-challenge',
          question,
          submoduleTitle: submoduleTitle || 'Exercício',
          history: [],
        }),
      })
      const data = await res.json()
      setFeedback(data.response || 'Resposta recebida.')
    } catch {
      setErrorMsg('Não foi possível conectar com a IA. Tente novamente.')
    }
    setLoading(false)
  }

  const reset = () => {
    setFeedback(null)
    setValues(Object.fromEntries(fields.map((f) => [f.id, ''])))
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>

      <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: AMBER }}>
            Exercício ativo
          </span>
        </div>
        <p className="text-[14px] text-white/80 leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {prompt}
        </p>
        {context && (
          <p className="text-[11px] text-white/40 italic mt-2 leading-relaxed">{context}</p>
        )}
      </div>

      <div className="px-4 py-4 space-y-3">
        {fields.map((f) => (
          <div key={f.id}>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-white/30 mb-1.5">
              {f.label}
            </label>
            {f.multiline ? (
              <textarea
                value={values[f.id]}
                onChange={(e) => setValues({ ...values, [f.id]: e.target.value })}
                placeholder={f.placeholder}
                disabled={!!feedback || loading}
                rows={3}
                className="w-full bg-white/[0.03] rounded-lg px-3 py-2.5 text-[13px] text-white/70 placeholder:text-white/20 outline-none resize-none leading-relaxed disabled:opacity-50"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              />
            ) : (
              <input
                type="text"
                value={values[f.id]}
                onChange={(e) => setValues({ ...values, [f.id]: e.target.value })}
                placeholder={f.placeholder}
                disabled={!!feedback || loading}
                className="w-full bg-white/[0.03] rounded-lg px-3 py-2.5 text-[13px] text-white/70 placeholder:text-white/20 outline-none disabled:opacity-50"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              />
            )}
          </div>
        ))}

        {!feedback && (
          <button
            onClick={evaluate}
            disabled={!allFilled || loading}
            className="text-[12px] font-medium px-4 py-2.5 rounded-lg w-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30` }}>
            {loading ? 'IA analisando sua resposta...' : allFilled ? 'Receber feedback da IA →' : 'Preencha todos os campos'}
          </button>
        )}

        {errorMsg && (
          <p className="text-[11px] text-red-400/70">{errorMsg}</p>
        )}

        <AnimatePresence>
          {feedback && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-lg p-3 space-y-3"
              style={{ background: `${BLUE}06`, borderLeft: `3px solid ${BLUE}40` }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: BLUE }}>
                  Feedback
                </p>
                <p className="text-[12px] text-white/65 leading-relaxed whitespace-pre-wrap">{feedback}</p>
              </div>
              <button onClick={reset}
                className="text-[10px] font-medium text-white/40 hover:text-white/70 transition-colors">
                Tentar outra resposta
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
