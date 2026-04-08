'use client'

import { motion } from 'framer-motion'

const BLUE = '#2e86c1'
const AMBER = '#9a7d0a'

interface Props {
  name: string
  role: string
  affiliation: string
  years: string
  keyStudy: string
  keyYear: number
  contribution: string
  book?: string
  quote?: string
}

/**
 * Ficha de pesquisador/autor. Dá rosto a uma ideia.
 * Aluno conecta CONCEITO com QUEM criou, QUANDO, ONDE e PORQUÊ.
 */
export default function AuthorCard({
  name, role, affiliation, years, keyStudy, keyYear, contribution, book, quote,
}: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Header — nome e papel */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: AMBER }}>
              Pesquisador
            </span>
          </div>
          <h4 className="text-[16px] font-semibold text-white/85" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {name}
          </h4>
          <p className="text-[11px] text-white/45 mt-0.5">{role} · {affiliation}</p>
        </div>
        <span className="text-[10px] font-mono text-white/30 whitespace-nowrap pt-1">{years}</span>
      </div>

      {/* Contribuição */}
      <div className="px-4 py-3 space-y-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/25 mb-1">Contribuição</p>
          <p className="text-[13px] text-white/60 leading-relaxed">{contribution}</p>
        </div>

        <div className="rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: BLUE }}>
            Estudo-chave · {keyYear}
          </p>
          <p className="text-[12px] text-white/55 leading-relaxed">{keyStudy}</p>
        </div>

        {book && (
          <div className="flex items-center gap-2 text-[11px] text-white/40">
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/25">Livro</span>
            <span className="italic">{book}</span>
          </div>
        )}

        {quote && (
          <blockquote className="pl-3 border-l-2" style={{ borderColor: `${BLUE}40` }}>
            <p className="text-[12px] text-white/50 italic leading-relaxed">"{quote}"</p>
          </blockquote>
        )}
      </div>
    </motion.div>
  )
}
