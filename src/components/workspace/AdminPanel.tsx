'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

interface Feedback {
  id: string
  nps_score: number | null
  category: string | null
  message: string | null
  created_at: string
}

interface Denuncia {
  id: string
  tipo: string
  descricao: string
  created_at: string
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

function npsColor(score: number | null): string {
  if (score === null) return 'rgba(255,255,255,0.3)'
  if (score >= 9) return '#1e8449'
  if (score >= 7) return '#9a7d0a'
  return '#c0392b'
}

export default function AdminPanel() {
  const [tab, setTab] = useState<'feedbacks' | 'denuncias'>('feedbacks')
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [denuncias, setDenuncias] = useState<Denuncia[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const supabase = createClient()

      const [fbRes, dnRes] = await Promise.all([
        supabase.from('feedbacks').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('denuncias').select('*').order('created_at', { ascending: false }).limit(50),
      ])

      if (fbRes.data) setFeedbacks(fbRes.data)
      if (dnRes.data) setDenuncias(dnRes.data)
    } catch (e) {
      console.error('Erro ao carregar dados admin:', e)
    } finally {
      setLoading(false)
    }
  }

  // NPS stats
  const npsScores = feedbacks.filter(f => f.nps_score !== null).map(f => f.nps_score as number)
  const npsAvg = npsScores.length > 0 ? (npsScores.reduce((a, b) => a + b, 0) / npsScores.length).toFixed(1) : '—'
  const promoters = npsScores.filter(s => s >= 9).length
  const detractors = npsScores.filter(s => s <= 6).length
  const npsNet = npsScores.length > 0 ? Math.round(((promoters - detractors) / npsScores.length) * 100) : 0

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[10px] text-white/25 font-mono">FEEDBACKS</p>
          <p className="text-[24px] font-bold text-white/70 font-mono">{feedbacks.length}</p>
        </div>
        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[10px] text-white/25 font-mono">NPS MÉDIO</p>
          <p className="text-[24px] font-bold font-mono" style={{ color: npsColor(parseFloat(npsAvg as string) || null) }}>{npsAvg}</p>
        </div>
        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[10px] text-white/25 font-mono">NPS NET</p>
          <p className="text-[24px] font-bold font-mono" style={{ color: npsNet >= 50 ? '#1e8449' : npsNet >= 0 ? '#9a7d0a' : '#c0392b' }}>{npsNet}</p>
        </div>
        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(192,57,43,0.1)' }}>
          <p className="text-[10px] text-white/25 font-mono">DENÚNCIAS</p>
          <p className="text-[24px] font-bold text-white/70 font-mono">{denuncias.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5">
        <button
          onClick={() => setTab('feedbacks')}
          className="flex-1 py-2 text-[12px] font-bold font-mono tracking-wider transition-all"
          style={{
            color: tab === 'feedbacks' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)',
            borderBottom: tab === 'feedbacks' ? '2px solid #5dade2' : '2px solid transparent',
          }}
        >
          FEEDBACKS ({feedbacks.length})
        </button>
        <button
          onClick={() => setTab('denuncias')}
          className="flex-1 py-2 text-[12px] font-bold font-mono tracking-wider transition-all"
          style={{
            color: tab === 'denuncias' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)',
            borderBottom: tab === 'denuncias' ? '2px solid #c0392b' : '2px solid transparent',
          }}
        >
          DENÚNCIAS ({denuncias.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-[12px] text-white/25">Carregando...</p>
        </div>
      ) : tab === 'feedbacks' ? (
        <div className="flex flex-col gap-2">
          {feedbacks.length === 0 && (
            <p className="text-center text-[13px] text-white/25 py-8">Nenhum feedback ainda</p>
          )}
          {feedbacks.map(fb => (
            <motion.div
              key={fb.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg p-3"
              style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${npsColor(fb.nps_score)}` }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {fb.nps_score !== null && (
                    <span className="font-mono text-[16px] font-bold" style={{ color: npsColor(fb.nps_score) }}>
                      {fb.nps_score}
                    </span>
                  )}
                  {fb.category && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                      {fb.category}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-white/20 font-mono">{timeAgo(fb.created_at)}</span>
              </div>
              {fb.message && (
                <p className="text-[13px] text-white/50 leading-relaxed">{fb.message}</p>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {denuncias.length === 0 && (
            <p className="text-center text-[13px] text-white/25 py-8">Nenhuma denúncia registrada</p>
          )}
          {denuncias.map(dn => (
            <motion.div
              key={dn.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg p-3"
              style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '3px solid #c0392b' }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(192,57,43,0.15)', color: '#c0392b' }}>
                  {dn.tipo}
                </span>
                <span className="text-[10px] text-white/20 font-mono">{timeAgo(dn.created_at)}</span>
              </div>
              <p className="text-[13px] text-white/50 leading-relaxed mt-1">{dn.descricao}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Refresh */}
      <button
        onClick={loadData}
        className="mx-auto text-[11px] text-white/20 hover:text-white/40 font-mono transition-colors"
      >
        Atualizar dados
      </button>
    </div>
  )
}
