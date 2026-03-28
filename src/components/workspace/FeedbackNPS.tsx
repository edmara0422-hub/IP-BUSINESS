'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function FeedbackNPS() {
  const [npsScore, setNpsScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [category, setCategory] = useState<string>('')

  const categories = ['Usabilidade', 'IA Advisor', 'Dados de mercado', 'Workspace', 'ESG', 'Acessibilidade', 'Performance', 'Outro']

  const npsLabel = npsScore === null ? '' : npsScore >= 9 ? 'Promotor' : npsScore >= 7 ? 'Neutro' : 'Detrator'
  const npsColor = npsScore === null ? '' : npsScore >= 9 ? '#1e8449' : npsScore >= 7 ? '#9a7d0a' : '#c0392b'

  const handleSubmit = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      await supabase.from('feedbacks').insert({
        nps_score: npsScore,
        category,
        message: feedback || null,
        user_id: user?.id ?? null,
      })
    } catch (e) {
      console.error('Erro ao salvar feedback:', e)
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(39,174,96,0.15)' }}>
          <span className="text-[24px]">&#10003;</span>
        </div>
        <p className="text-[16px] font-semibold text-white/80">Obrigado pelo feedback!</p>
        <p className="text-[13px] text-white/40 mt-2">Sua opinião ajuda o IPB a melhorar.</p>
        <button
          onClick={() => { setSubmitted(false); setNpsScore(null); setFeedback(''); setCategory('') }}
          className="mt-6 font-mono text-[11px] text-white/25 hover:text-white/50 transition-colors"
        >
          Enviar outro feedback
        </button>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">

      {/* NPS */}
      <div>
        <p className="text-[14px] font-semibold text-white/70 mb-1">De 0 a 10, o quanto recomendaria o IPB?</p>
        <p className="text-[11px] text-white/30 mb-3">NPS — Net Promoter Score</p>
        <div className="flex gap-1.5">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              onClick={() => setNpsScore(i)}
              className="flex-1 py-2.5 rounded-lg font-mono text-[13px] font-bold transition-all"
              style={{
                background: npsScore === i
                  ? i >= 9 ? 'rgba(30,132,73,0.25)' : i >= 7 ? 'rgba(154,125,10,0.25)' : 'rgba(192,57,43,0.25)'
                  : 'rgba(255,255,255,0.03)',
                border: npsScore === i ? `1px solid ${i >= 9 ? '#1e8449' : i >= 7 ? '#9a7d0a' : '#c0392b'}50` : '1px solid rgba(255,255,255,0.06)',
                color: npsScore === i ? '#fff' : 'rgba(255,255,255,0.3)',
              }}
            >
              {i}
            </button>
          ))}
        </div>
        {npsScore !== null && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 font-mono text-[11px] font-bold text-center"
            style={{ color: npsColor }}
          >
            {npsLabel} ({npsScore}/10)
          </motion.p>
        )}
      </div>

      {/* Categoria */}
      <div>
        <p className="text-[13px] font-semibold text-white/60 mb-2">Sobre o que é seu feedback?</p>
        <div className="flex flex-wrap gap-1.5">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="text-[11px] px-3 py-1.5 rounded-full transition-all"
              style={{
                background: category === c ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                border: category === c ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.06)',
                color: category === c ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Comentário */}
      <div>
        <p className="text-[13px] font-semibold text-white/60 mb-2">Conte mais (opcional)</p>
        <textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder="O que podemos melhorar? O que está bom?"
          rows={4}
          className="w-full rounded-lg px-4 py-3 text-[13px] text-white/80 placeholder:text-white/20 bg-transparent outline-none resize-none"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}
        />
      </div>

      {/* Enviar */}
      <button
        onClick={handleSubmit}
        disabled={npsScore === null}
        className="w-full py-3 rounded-lg font-mono text-[12px] font-bold uppercase tracking-wider transition-all disabled:opacity-30"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        Enviar Feedback
      </button>
    </div>
  )
}
