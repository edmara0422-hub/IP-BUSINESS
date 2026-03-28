'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function CanalDenuncias() {
  const [type, setType] = useState<string>('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const types = [
    'Assédio moral ou sexual',
    'Discriminação',
    'Fraude ou corrupção',
    'Vazamento de dados (LGPD)',
    'Conflito de interesses',
    'Condições de trabalho',
    'Outro',
  ]

  const handleSubmit = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      await supabase.from('denuncias').insert({
        tipo: type,
        descricao: description,
        // SEM user_id — 100% anônimo
      })
    } catch (e) {
      console.error('Erro ao salvar denúncia:', e)
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
        <p className="text-[16px] font-semibold text-white/80">Denúncia registrada</p>
        <p className="text-[13px] text-white/40 mt-2 max-w-xs">
          Sua denúncia é 100% anônima. Não armazenamos identificação.
          Será analisada pela equipe de compliance.
        </p>
        <button
          onClick={() => { setSubmitted(false); setType(''); setDescription('') }}
          className="mt-6 font-mono text-[11px] text-white/25 hover:text-white/50 transition-colors"
        >
          Enviar outra denúncia
        </button>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">

      {/* Aviso de anonimato */}
      <div className="rounded-lg px-4 py-3" style={{ background: 'rgba(30,132,73,0.08)', border: '1px solid rgba(30,132,73,0.15)' }}>
        <p className="text-[13px] text-white/60 leading-relaxed">
          Este canal é <strong className="text-white/80">100% anônimo</strong>. Não armazenamos seu nome, email ou qualquer identificação.
          Protegido pela LGPD. Ninguém saberá quem enviou.
        </p>
      </div>

      {/* Tipo */}
      <div>
        <p className="text-[14px] font-semibold text-white/70 mb-2">Tipo da denúncia</p>
        <div className="flex flex-col gap-1.5">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className="text-left px-4 py-2.5 rounded-lg text-[13px] transition-all"
              style={{
                background: type === t ? 'rgba(192,57,43,0.12)' : 'rgba(255,255,255,0.03)',
                border: type === t ? '1px solid rgba(192,57,43,0.25)' : '1px solid rgba(255,255,255,0.06)',
                color: type === t ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Descrição */}
      <div>
        <p className="text-[13px] font-semibold text-white/60 mb-2">Descreva o que aconteceu</p>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Descreva com o máximo de detalhes possível. Sua identidade é protegida."
          rows={5}
          className="w-full rounded-lg px-4 py-3 text-[13px] text-white/80 placeholder:text-white/20 bg-transparent outline-none resize-none"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}
        />
      </div>

      {/* Enviar */}
      <button
        onClick={handleSubmit}
        disabled={!type || !description.trim()}
        className="w-full py-3 rounded-lg font-mono text-[12px] font-bold uppercase tracking-wider transition-all disabled:opacity-30"
        style={{
          background: 'rgba(192,57,43,0.1)',
          border: '1px solid rgba(192,57,43,0.2)',
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        Enviar Denúncia Anônima
      </button>

      <p className="text-center text-[10px] text-white/15">
        Canal de Denúncias IPB — Compliance — LGPD
      </p>
    </div>
  )
}
