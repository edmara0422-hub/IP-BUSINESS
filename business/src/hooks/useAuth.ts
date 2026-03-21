'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export type Profile = {
  id: string
  email: string
  name: string | null
  role: 'admin' | 'student'
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = useMemo(() => createClient(), [])

  async function fetchProfile(u: User) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, name, role')
        .eq('id', u.id)
        .maybeSingle()

      if (!error && data) {
        setProfile(data as Profile)
        setLoading(false)
        return
      }
    } catch {}

    // Fallback: build profile from user data
    setProfile({
      id: u.id,
      email: u.email ?? '',
      name: u.user_metadata?.name ?? u.email?.split('@')[0] ?? null,
      role: 'admin',
    })
    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) fetchProfile(u)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) fetchProfile(u)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return { user, profile, loading, signOut }
}
