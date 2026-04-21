'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

/**
 * Hook de persistência universal para módulos do Workspace.
 * Salva/carrega estado automaticamente na tabela workspace_data (Supabase).
 * Fallback para localStorage quando usuário não está autenticado.
 */
export function useWorkspaceData<T extends object>(
  moduleId: string,
  defaultValue: T
): {
  data: T
  update: (partial: Partial<T>) => void
  replace: (next: T) => void
  loaded: boolean
  saving: boolean
} {
  const { user } = useAuth()
  const supabase = useMemo(() => createClient(), [])
  const [data, setData] = useState<T>(defaultValue)
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const lsKey = `ws_${moduleId}`

  // ── Load on mount ──────────────────────────────────────
  useEffect(() => {
    if (!user) {
      // localStorage fallback
      try {
        const raw = localStorage.getItem(lsKey)
        if (raw) setData({ ...defaultValue, ...JSON.parse(raw) })
      } catch {}
      setLoaded(true)
      return
    }

    supabase
      .from('workspace_data')
      .select('data')
      .eq('user_id', user.id)
      .eq('module_id', moduleId)
      .maybeSingle()
      .then(({ data: row }) => {
        if (row?.data) setData({ ...defaultValue, ...(row.data as T) })
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, moduleId])

  // ── Debounced save ────────────────────────────────────
  const persist = useCallback(
    async (next: T) => {
      setSaving(true)
      try {
        if (!user) {
          localStorage.setItem(lsKey, JSON.stringify(next))
        } else {
          await supabase.from('workspace_data').upsert(
            { user_id: user.id, module_id: moduleId, data: next, updated_at: new Date().toISOString() },
            { onConflict: 'user_id,module_id' }
          )
        }
      } catch (e) {
        console.error(`[workspace_data] save error (${moduleId}):`, e)
      } finally {
        setSaving(false)
      }
    },
    [user, supabase, moduleId, lsKey]
  )

  // ── update (partial patch) ───────────────────────────
  const update = useCallback(
    (partial: Partial<T>) => {
      setData(prev => {
        const next = { ...prev, ...partial }
        persist(next)
        return next
      })
    },
    [persist]
  )

  // ── replace (full replacement) ───────────────────────
  const replace = useCallback(
    (next: T) => {
      setData(next)
      persist(next)
    },
    [persist]
  )

  return { data, update, replace, loaded, saving }
}
