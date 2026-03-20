'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallback() {
  useEffect(() => {
    const supabase = createClient()
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(() => {
        window.location.href = '/'
      })
    } else {
      window.location.href = '/'
    }
  }, [])

  return (
    <div style={{ background: '#060608', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem' }}>Autenticando...</p>
    </div>
  )
}
