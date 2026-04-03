'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GREEN = '#1e8449'
const BLUE = '#2e86c1'

interface Props {
  term: string
  definition: string
  example?: string
  antiExample?: string
}

export default function ConceptCard({ term, definition, example, antiExample }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [showTest, setShowTest] = useState(false)
  const [answer, setAnswer] = useState('')
  const [evaluated, setEvaluated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')

  const evaluate = async () => {
    if (!answer.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate-probe',
          question: `O aluno tentou explicar o conceito "${term}" com suas próprias palavras. A definição correta é: "${definition}". Avalie se o aluno entendeu o conceito. Seja breve (2-3 frases). Se acertou, confirme. Se errou, explique o que faltou.`,
          selectedText: answer,
          submoduleTitle: term,
          history: [],
        }),
      })
      const data = await res.json()
      setFeedback(data.response || 'Não foi possível avaliar.')
    } catch {
      setFeedback('Erro ao conectar com a IA. Tente novamente.')
    }
    setLoading(false)
    setEvaluated(true)
  }

  return (
    <motion.div className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${BLUE}15` }}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>

      {/* Header — sempre visível */}
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-4 py-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: BLUE }}>Conceito</span>
        </div>
        <p className="text-[15px] font-semibold text-white/80" style={{ fontFamily: 'Poppins, sans-serif' }}>{term}</p>
        <p className="text-[13px] text-white/45 leading-relaxed mt-1">{definition}</p>
      </button>

      {/* Expandido — exemplos + auto-teste */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 space-y-3">

              {example && (
                <div className="rounded-lg p-3" style={{ background: `${GREEN}06`, borderLeft: `3px solid ${GREEN}25` }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/20 mb-1">Exemplo</p>
                  <p className="text-[12px] text-white/45 leading-relaxed">{example}</p>
                </div>
              )}

              {antiExample && (
                <div className="rounded-lg p-3" style={{ background: 'rgba(192,57,43,0.04)', borderLeft: '3px solid rgba(192,57,43,0.2)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/20 mb-1">O que NÃO é</p>
                  <p className="text-[12px] text-white/45 leading-relaxed">{antiExample}</p>
                </div>
              )}

              {/* Auto-teste */}
              {!showTest && !evaluated && (
                <button onClick={() => setShowTest(true)}
                  className="text-[11px] font-medium px-3 py-2 rounded-lg w-full transition-all"
                  style={{ background: `${BLUE}08`, color: BLUE, border: `1px solid ${BLUE}15` }}>
                  Teste: explique com suas palavras
                </button>
              )}

              {showTest && !evaluated && (
                <div className="space-y-2">
                  <textarea value={answer} onChange={(e) => setAnswer(e.target.value)}
                    placeholder={`Explique "${term}" como se estivesse ensinando a alguém...`}
                    className="w-full bg-white/[0.03] rounded-lg px-3 py-2.5 text-[13px] text-white/60 placeholder:text-white/15 outline-none resize-none leading-relaxed"
                    style={{ border: '1px solid rgba(255,255,255,0.06)' }} rows={3} autoFocus />
                  <button onClick={evaluate} disabled={!answer.trim() || loading}
                    className="text-[12px] font-medium px-4 py-2 rounded-lg w-full disabled:opacity-30"
                    style={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}25` }}>
                    {loading ? 'IA avaliando...' : 'Avaliar →'}
                  </button>
                </div>
              )}

              {evaluated && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/20 mb-1">Feedback da IA</p>
                  <p className="text-[12px] text-white/50 leading-relaxed">{feedback}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
