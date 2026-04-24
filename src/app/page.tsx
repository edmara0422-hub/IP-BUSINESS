'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence } from 'framer-motion'
import SplashScreen from '@/components/SplashScreen'
import { useAuth } from '@/hooks/useAuth'

const MainApp = dynamic(() => import('@/components/MainApp'), {
  ssr: false,
  loading: () => null,
})

const LoginForm = dynamic(() => import('@/app/login/LoginForm'), {
  ssr: false,
  loading: () => null,
})

const LandingPage = dynamic(() => import('@/app/landing/page'), {
  ssr: false,
  loading: () => null,
})

// Se a URL já é uma aba específica → entrou direto, pula landing/splash
function isDirectTabEntry() {
  if (typeof window === 'undefined') return false
  return ['/business', '/intelligence', '/workspace'].includes(window.location.pathname)
}

export default function Home() {
  const direct = isDirectTabEntry()

  // Root URL (/) → sempre mostra landing + splash ao recarregar
  // URL de aba (/business etc.) → pula intro, abre direto no app
  const [showLanding, setShowLanding] = useState(() => !direct)
  const [showSplash,  setShowSplash]  = useState(() => !direct)
  const [justLoggedIn, setJustLoggedIn] = useState(false)
  const { user, loading } = useAuth()

  const handleLogin = useCallback(() => { setJustLoggedIn(true) }, [])

  const isLoggedIn = !!user || justLoggedIn

  // 1. Landing — sempre na raiz /
  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />
  }

  // 2. Loading auth
  if (loading && !justLoggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505]">
        <span className="text-[0.7rem] uppercase tracking-[0.3em] text-white/30">Carregando...</span>
      </main>
    )
  }

  // 3. Não logado → Login
  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />
  }

  // 4. Logado → Splash — sempre na raiz /
  if (showSplash) {
    return (
      <main className="min-h-screen bg-[#050505]">
        <AnimatePresence mode="wait">
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        </AnimatePresence>
      </main>
    )
  }

  // 5. App — aba inicial lida do path pelo MainApp
  return (
    <main className="min-h-screen bg-ocean-900">
      <MainApp />
    </main>
  )
}
