'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GREEN = '#1e8449'
const BLUE = '#2e86c1'

interface Field {
  id: string
  label: string
  placeholder: string
  helpText?: string
}

interface Props {
  frameworkId: string
  title: string
  description: string
  fields: Field[]
}

export default function FrameworkBuilder({ frameworkId, title, description, fields }: Props) {
  const [data, setData] = useState<Record<string, string>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [helpOpen, setHelpOpen] = useState<string | null>(null)

  const filled = fields.filter(f => data[f.id]?.trim()).length
  const allFilled = filled === fields.length

  const requestFeedback = async () => {
    if (!allFilled) return
    setLoading(true)
    try {
      const summary = fields.map(f => `${f.label}: ${data[f.id]}`).join('\n')
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate-framework',
          question: `O aluno preencheu o framework "${title}" com os seguintes dados:\n\n${summary}\n\nAvalie: (1) Completude — algum campo está superficial? (2) Coerência — os campos se conectam logicamente? (3) Estratégia — o que está bom e o que poderia ser aprofundado? Seja direto, prático e específico. Máximo 4 parágrafos curtos.`,
          submoduleTitle: title,
          history: [],
        }),
      })
      const result = await res.json()
      setFeedback(result.response || 'Não foi possível analisar.')
    } catch {
      setFeedback('Erro ao conectar com a IA.')
    }
    setLoading(false)
    setShowFeedback(true)
  }

  return (
    <motion.div className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${BLUE}12` }}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>

      {/* Header */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: BLUE }}>{title}</span>
        </div>
        <p className="text-[12px] text-white/35 leading-relaxed">{description}</p>
      </div>

      {/* Fields */}
      <div className="px-4 pb-3 space-y-2.5">
        {fields.map((field) => (
          <div key={field.id}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-white/40">{field.label}</label>
              {field.helpText && (
                <button onClick={() => setHelpOpen(helpOpen === field.id ? null : field.id)}
                  className="text-[9px] text-white/20 hover:text-white/35 transition-colors">
                  {helpOpen === field.id ? 'fechar' : 'ajuda'}
                </button>
              )}
            </div>
            <AnimatePresence>
              {helpOpen === field.id && field.helpText && (
                <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="text-[11px] text-white/25 mb-1.5 leading-relaxed overflow-hidden">{field.helpText}</motion.p>
              )}
            </AnimatePresence>
            <textarea
              value={data[field.id] || ''}
              onChange={(e) => setData(prev => ({ ...prev, [field.id]: e.target.value }))}
              placeholder={field.placeholder}
              className="w-full bg-white/[0.03] rounded-lg px-3 py-2 text-[13px] text-white/60 placeholder:text-white/12 outline-none resize-none leading-relaxed"
              style={{ border: `1px solid ${data[field.id]?.trim() ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}` }}
              rows={2}
            />
          </div>
        ))}
      </div>

      {/* Progress + IA Feedback */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-1 rounded-full overflow-hidden bg-white/5">
            <motion.div className="h-full rounded-full" style={{ background: GREEN, width: `${(filled / fields.length) * 100}%` }} />
          </div>
          <span className="text-[10px] text-white/20 font-mono">{filled}/{fields.length}</span>
        </div>

        {!showFeedback && (
          <button onClick={requestFeedback} disabled={!allFilled || loading}
            className="text-[12px] font-medium px-4 py-2.5 rounded-lg w-full disabled:opacity-20 transition-all"
            style={{ background: allFilled ? `${GREEN}15` : 'rgba(255,255,255,0.02)', color: allFilled ? GREEN : 'rgba(255,255,255,0.2)', border: `1px solid ${allFilled ? GREEN + '25' : 'rgba(255,255,255,0.04)'}` }}>
            {loading ? 'IA analisando...' : allFilled ? 'Receber Feedback da IA' : `Preencha todos os campos (${fields.length - filled} restantes)`}
          </button>
        )}

        {showFeedback && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-lg p-3" style={{ background: `${GREEN}06`, borderLeft: `3px solid ${GREEN}25` }}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/20 mb-1.5">Análise da IA</p>
            <p className="text-[12px] text-white/50 leading-relaxed whitespace-pre-line">{feedback}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
