'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, ChevronDown, ChevronUp, Trash2, FileDown } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

export interface CockpitSnapshot {
  id: string
  nome: string
  empresa: string
  createdAt: string
  inputs: Record<string, number | string>
  metrics: {
    healthScore: number; margem: number; runway: number; lucro: number
    ltvCac: number; ltv: number; breakeven: number; roi: number; margemReal: number
    runwayCritico?: boolean; runwayProtegido?: boolean; roiIneficiente?: boolean; breakevenMeta?: boolean
  }
  iaResponse: string
  selicRate: number; ipcaRate: number; usdRate: number
  sectorLabel: string; sectorHeat: number
}

const fmt    = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
const fmtDec = (v: number, d = 1) => v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d })
const RED = '#c0392b'; const GREEN = '#1e8449'; const AMBER = '#9a7d0a'; const BLUE = '#1a5276'
const colorByRange = (v: number, g: number, a: number) => v >= g ? GREEN : v >= a ? AMBER : RED

export const ARQUIVOS_MODULE = 'arquivos'

export default function AbaArquivos() {
  const { user } = useAuth()
  const supabase  = useMemo(() => createClient(), [])
  const [snapshots, setSnapshots] = useState<CockpitSnapshot[]>([])
  const [loading,   setLoading]   = useState(true)
  const [expanded,  setExpanded]  = useState<string | null>(null)
  const [deleting,  setDeleting]  = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        if (!user) {
          const raw = localStorage.getItem(`ws_${ARQUIVOS_MODULE}`)
          setSnapshots(raw ? (JSON.parse(raw)?.snapshots ?? []) : [])
        } else {
          const { data: row } = await supabase
            .from('workspace_data').select('data')
            .eq('user_id', user.id).eq('module_id', ARQUIVOS_MODULE).maybeSingle()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const remote: CockpitSnapshot[] = (row?.data as any)?.snapshots ?? []

          // Migra dados do localStorage para o Supabase se existirem
          const localRaw = localStorage.getItem(`ws_${ARQUIVOS_MODULE}`)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const local: CockpitSnapshot[] = localRaw ? (JSON.parse(localRaw) as any)?.snapshots ?? [] : []
          if (local.length > 0) {
            const remoteIds = new Set(remote.map(s => s.id))
            const toMigrate = local.filter(s => !remoteIds.has(s.id))
            if (toMigrate.length > 0) {
              const merged = [...toMigrate, ...remote]
              await supabase.from('workspace_data').upsert(
                { user_id: user.id, module_id: ARQUIVOS_MODULE, data: { snapshots: merged }, updated_at: new Date().toISOString() },
                { onConflict: 'user_id,module_id' }
              )
              localStorage.removeItem(`ws_${ARQUIVOS_MODULE}`)
              setSnapshots(merged)
              setLoading(false)
              return
            }
            localStorage.removeItem(`ws_${ARQUIVOS_MODULE}`)
          }

          setSnapshots(remote)
        }
      } catch { setSnapshots([]) }
      setLoading(false)
    })()
  }, [user, supabase])

  const persistSnapshots = async (next: CockpitSnapshot[]) => {
    const payload = { snapshots: next }
    if (!user) { localStorage.setItem(`ws_${ARQUIVOS_MODULE}`, JSON.stringify(payload)); return }
    await supabase.from('workspace_data').upsert(
      { user_id: user.id, module_id: ARQUIVOS_MODULE, data: payload, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,module_id' }
    )
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    const next = snapshots.filter(s => s.id !== id)
    setSnapshots(next)
    await persistSnapshots(next)
    setDeleting(null)
    if (expanded === id) setExpanded(null)
  }

  const exportPDF = async (s: CockpitSnapshot) => {
    try {
      const el = document.getElementById(`arquivo-${s.id}`)
      if (!el) return
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF }   = await import('jspdf')
      const canvas  = await html2canvas(el, { backgroundColor: '#0a0f1e', scale: 2, useCORS: true, logging: false, allowTaint: true, foreignObjectRendering: false })
      const imgData = canvas.toDataURL('image/png')
      const pdf     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pdfW    = pdf.internal.pageSize.getWidth()
      const pageH   = pdf.internal.pageSize.getHeight()
      const imgH    = (canvas.height * pdfW) / canvas.width
      pdf.setFillColor(10, 15, 30)
      pdf.rect(0, 0, pdfW, 14, 'F')
      pdf.setTextColor(255, 255, 255); pdf.setFontSize(10); pdf.setFont('helvetica', 'bold')
      pdf.text(`COCKPIT — ${s.empresa.toUpperCase()}`, 8, 9)
      pdf.setFontSize(8); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(120, 140, 160)
      pdf.text(`Health ${s.metrics.healthScore}/100  |  ${new Date(s.createdAt).toLocaleDateString('pt-BR')}`, pdfW - 8, 9, { align: 'right' })
      const HEADER = 14
      pdf.addImage(imgData, 'PNG', 0, HEADER, pdfW, imgH)
      let heightLeft = imgH - (pageH - HEADER)
      while (heightLeft > 0) {
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, -(imgH - heightLeft), pdfW, imgH)
        heightLeft -= pageH
      }
      const blob    = pdf.output('blob')
      const blobUrl = URL.createObjectURL(blob)
      const link    = document.createElement('a')
      link.href = blobUrl
      link.download = `cockpit-${s.empresa.toLowerCase().replace(/\s+/g, '-')}-${s.createdAt.slice(0, 10)}.pdf`
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
    } catch (e) { console.error('PDF error', e) }
  }

  const byEmpresa = useMemo(() => {
    const groups: Record<string, CockpitSnapshot[]> = {}
    for (const s of snapshots) {
      const key = s.empresa || 'Sem nome'
      if (!groups[key]) groups[key] = []
      groups[key].push(s)
    }
    return groups
  }, [snapshots])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[20rem]">
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em' }}>CARREGANDO...</span>
    </div>
  )

  if (snapshots.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[20rem] gap-4 p-6">
      <FolderOpen size={40} style={{ color: 'rgba(255,255,255,0.08)' }} />
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>Nenhum arquivo salvo</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', lineHeight: 1.6 }}>
          No Cockpit Financeiro → "Analisar com IA" → "Salvar em Arquivos"
        </p>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-6 p-4" style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
      <div className="flex items-center gap-2">
        <FolderOpen size={16} style={{ color: BLUE }} />
        <span style={{ fontSize: 14, fontWeight: 600 }}>Arquivos</span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
          {snapshots.length} relatório{snapshots.length !== 1 ? 's' : ''}
        </span>
      </div>

      {Object.entries(byEmpresa).map(([empresa, snaps]) => (
        <div key={empresa} className="flex flex-col gap-2">
          <div style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.14em', paddingLeft: 2, paddingBottom: 2 }}>
            {empresa.toUpperCase()}
          </div>

          {snaps.map(s => (
            <div key={s.id} className="rounded-xl overflow-hidden"
              style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.07)' }}>

              {/* Header row */}
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                style={{ background: expanded === s.id ? 'rgba(26,82,118,0.1)' : 'transparent' }}
                onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              >
                <div className="flex flex-col gap-0.5">
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{s.nome}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', fontFamily: 'monospace' }}>
                    {new Date(s.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: colorByRange(s.metrics.healthScore, 70, 40) }}>
                    {s.metrics.healthScore}/100
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.25)' }}>
                    {expanded === s.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                </div>
              </div>

              {/* Expanded detail */}
              <AnimatePresence>
                {expanded === s.id && (
                  <motion.div
                    id={`arquivo-${s.id}`}
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="px-4 pb-4 flex flex-col gap-4 border-t border-white/5 pt-3">

                      {/* Métricas */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Margem',    value: `${fmtDec(s.metrics.margem, 1)}%`,  color: colorByRange(s.metrics.margem, 20, 10) },
                          { label: 'Runway',    value: s.metrics.runwayCritico ? '⚠ CRÍTICO' : s.metrics.runway >= 999 ? '∞' : `${fmtDec(s.metrics.runway, 1)}m`, color: s.metrics.runwayCritico ? RED : colorByRange(Math.min(s.metrics.runway, 99), 6, 3) },
                          { label: 'Lucro',     value: `R$${fmt(s.metrics.lucro)}`,          color: s.metrics.lucro >= 0 ? GREEN : RED },
                          { label: 'LTV/CAC',   value: `${fmtDec(s.metrics.ltvCac, 1)}x`,   color: colorByRange(s.metrics.ltvCac, 3, 1) },
                          { label: 'ROI',       value: `${fmtDec(s.metrics.roi, 1)}%`,       color: s.metrics.roiIneficiente ? AMBER : s.metrics.roi >= 0 ? GREEN : RED },
                          { label: 'Break-even',value: `R$${fmt(s.metrics.breakeven)}`,       color: s.metrics.breakevenMeta ? AMBER : BLUE },
                        ].map(m => (
                          <div key={m.label} className="rounded-lg px-2.5 py-2" style={{ background: 'rgba(0,0,0,0.3)', borderTop: `2px solid ${m.color}` }}>
                            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>{m.label}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: m.color }}>{m.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Contexto macro */}
                      <div className="flex flex-wrap gap-3" style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)' }}>
                        <span>SELIC {s.selicRate}%</span>
                        <span>IPCA {s.ipcaRate}%</span>
                        <span>USD R${s.usdRate?.toFixed(2)}</span>
                        {s.sectorLabel && <span>{s.sectorLabel} {s.sectorHeat}/100</span>}
                      </div>

                      {/* Análise IA */}
                      {s.iaResponse && (
                        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${BLUE}28` }}>
                          <div style={{ fontSize: 9, color: BLUE, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>
                            ✦ ANÁLISE IA
                          </div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                            {s.iaResponse}
                          </div>
                        </div>
                      )}

                      {/* Ações */}
                      <div className="flex gap-2">
                        <button onClick={() => exportPDF(s)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-opacity hover:opacity-80"
                          style={{ background: 'rgba(26,82,118,0.18)', border: `1px solid ${BLUE}35`, fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
                          <FileDown size={13} /> PDF
                        </button>
                        <button onClick={() => handleDelete(s.id)} disabled={deleting === s.id}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-opacity hover:opacity-80 disabled:opacity-40"
                          style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.18)', fontSize: 11, color: 'rgba(192,57,43,0.55)' }}>
                          <Trash2 size={13} />
                          {deleting === s.id ? 'Removendo...' : 'Excluir'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
