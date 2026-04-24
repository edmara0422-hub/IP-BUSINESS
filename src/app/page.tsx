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

function sessionFlag(key: string) {
  if (typeof window === 'undefined') return false
  return !!sessionStorage.getItem(key)
}

export default function Home() {
  const [showLanding, setShowLanding] = useState(() => !sessionFlag('ipb_landing_done'))
  const [showSplash,  setShowSplash]  = useState(() => !sessionFlag('ipb_splash_done'))
  const [justLoggedIn, setJustLoggedIn] = useState(false)
  const { user, loading } = useAuth()

  const handleLogin = useCallback(() => { setJustLoggedIn(true) }, [])

  const isLoggedIn = !!user || justLoggedIn

  // 1. Landing — só na primeira vez por sessão
  if (showLanding) {
    return <LandingPage onEnter={() => {
      sessionStorage.setItem('ipb_landing_done', '1')
      setShowLanding(false)
    }} />
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

  // 4. Logado → Splash (só na primeira vez por sessão)
  if (showSplash) {
    return (
      <main className="min-h-screen bg-[#050505]">
        <AnimatePresence mode="wait">
          <SplashScreen key="splash" onComplete={() => {
            sessionStorage.setItem('ipb_splash_done', '1')
            setShowSplash(false)
          }} />
        </AnimatePresence>
      </main>
    )
  }

  // 5. App
  return (
    <main className="min-h-screen bg-ocean-900">
      <MainApp />
    </main>
  )
}
