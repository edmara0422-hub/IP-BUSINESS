import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 1800 // 30 min

let _cache: { data: unknown; ts: number } | null = null
const CACHE_TTL = 30 * 60 * 1000

function adminDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}

export async function GET() {
  if (_cache && Date.now() - _cache.ts < CACHE_TTL) {
    return NextResponse.json(_cache.data, { headers: { 'X-Cache': 'HIT' } })
  }

  try {
    const db = adminDb()
    const { data: rows } = await db
      .from('workspace_data')
      .select('data')
      .eq('module_id', 'arquivos')
      .not('data', 'is', null)

    if (!rows || rows.length === 0) {
      return NextResponse.json({ count: 0, benchmarks: null })
    }

    // Coleta métricas do snapshot mais recente de cada usuário
    const metrics: { margem: number; runway: number; ltvCac: number; healthScore: number; lucro: number }[] = []
    for (const row of rows) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const snaps = (row.data as any)?.snapshots
      if (!Array.isArray(snaps) || snaps.length === 0) continue
      const latest = snaps[0]
      const m = latest?.metrics
      if (!m) continue
      // Filtra dados obviamente inválidos
      if (typeof m.margem !== 'number' || typeof m.runway !== 'number') continue
      if (m.healthScore <= 0 || m.healthScore > 100) continue
      metrics.push({
        margem:      m.margem,
        runway:      m.runway >= 999 ? 24 : m.runway, // cap runway infinito em 24m para média
        ltvCac:      m.ltvCac  ?? 0,
        healthScore: m.healthScore,
        lucro:       m.lucro   ?? 0,
      })
    }

    if (metrics.length < 3) {
      // Base insuficiente — retorna null para não distorcer benchmarks
      return NextResponse.json({ count: metrics.length, benchmarks: null })
    }

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length
    const median = (arr: number[]) => {
      const s = [...arr].sort((a, b) => a - b)
      const mid = Math.floor(s.length / 2)
      return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid]
    }
    const p25 = (arr: number[]) => {
      const s = [...arr].sort((a, b) => a - b)
      return s[Math.floor(s.length * 0.25)]
    }
    const p75 = (arr: number[]) => {
      const s = [...arr].sort((a, b) => a - b)
      return s[Math.floor(s.length * 0.75)]
    }

    const margens     = metrics.map(m => m.margem)
    const runways     = metrics.map(m => m.runway)
    const ltvCacs     = metrics.filter(m => m.ltvCac > 0).map(m => m.ltvCac)
    const healths     = metrics.map(m => m.healthScore)

    const payload = {
      count: metrics.length,
      benchmarks: {
        margem:      { median: parseFloat(median(margens).toFixed(1)),      p25: parseFloat(p25(margens).toFixed(1)),      p75: parseFloat(p75(margens).toFixed(1)),      avg: parseFloat(avg(margens).toFixed(1))      },
        runway:      { median: parseFloat(median(runways).toFixed(1)),      p25: parseFloat(p25(runways).toFixed(1)),      p75: parseFloat(p75(runways).toFixed(1)),      avg: parseFloat(avg(runways).toFixed(1))      },
        ltvCac:      ltvCacs.length > 0 ? { median: parseFloat(median(ltvCacs).toFixed(2)), p25: parseFloat(p25(ltvCacs).toFixed(2)), p75: parseFloat(p75(ltvCacs).toFixed(2)), avg: parseFloat(avg(ltvCacs).toFixed(2)) } : null,
        healthScore: { median: Math.round(median(healths)),                 p25: Math.round(p25(healths)),                 p75: Math.round(p75(healths)),                 avg: Math.round(avg(healths))                },
      },
      updatedAt: new Date().toISOString(),
    }

    _cache = { data: payload, ts: Date.now() }
    return NextResponse.json(payload, { headers: { 'Cache-Control': 'public, max-age=1800', 'X-Cache': 'MISS' } })
  } catch (e) {
    console.error('[base-benchmarks]', e)
    return NextResponse.json({ count: 0, benchmarks: null })
  }
}
