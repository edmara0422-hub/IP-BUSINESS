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
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, name, role')
      .eq('id', u.id)
      .maybeSingle()

    if (error) console.error('[auth] fetchProfile:', error.message)

    if (data) {
      setProfile(data as Profile)
    } else {
      // Fallback: build profile from user metadata
      setProfile({
        id: u.id,
        email: u.email ?? '',
        name: u.user_metadata?.name ?? null,
        role: u.user_metadata?.role ?? 'admin',
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
      if (data.user) fetchProfile(data.user)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user)
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
