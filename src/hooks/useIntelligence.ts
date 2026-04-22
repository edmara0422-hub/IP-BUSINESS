'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '@/lib/api'

export interface IntelligenceData {
  panorama: string
  macro_insights: string[]
  marketing_insights: string[]
  riscos: string[]
  oportunidades: string[]
  cockpit_alerts: string[]
}

const EMPTY: IntelligenceData = {
  panorama: '',
  macro_insights: [],
  marketing_insights: [],
  riscos: [],
  oportunidades: [],
  cockpit_alerts: [],
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useIntelligence(marketData: any, userProfile?: any) {
  const [data, setData] = useState<IntelligenceData>(EMPTY)
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    if (!marketData?.macro) return
    setLoading(true)
    try {
      const res = await apiFetch('/api/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...marketData, userProfile }),
      })
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch { /* silently fail */ }
    finally { setLoading(false) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketData, userProfile?.subtype, userProfile?.sectors?.join(',')])

  useEffect(() => {
    fetch()
    // Refresh a cada 5 minutos
    const t = setInterval(fetch, 5 * 60 * 1000)
    return () => clearInterval(t)
  }, [fetch])

  return { intelligence: data, loading }
}
