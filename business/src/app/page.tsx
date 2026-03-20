'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence } from 'framer-motion'
import SplashScreen from '@/components/SplashScreen'
import { useAuth } from '@/hooks/useAuth'

const MainApp = dynamic(() => import('@/components/MainApp'), {
  ssr: false,
  loading: () => null,
})

const LoginPage = dynamic(() => import('@/app/login/LoginForm'), {
  ssr: false,
  loading: () => null,
})


export default function Home() {
  const [showSplash, setShowSplash] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const { user, loading } = useAuth()

  // Quando user muda (login feito), marca como logado
  if (user && !loggedIn) setLoggedIn(true)

  // 1. Loading auth
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050507]">
        <span className="text-[0.7rem] uppercase tracking-[0.3em] text-white/30">Carregando...</span>
      </main>
    )
  }

  // 2. Não logado → Login primeiro
  if (!user && !loggedIn) {
    return <LoginPage />
  }

  // 3. Logado → Splash depois MainApp
  if (showSplash) {
    return (
      <main className="min-h-screen bg-ocean-900">
        <AnimatePresence mode="wait">
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        </AnimatePresence>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-ocean-900">
      <MainApp />
    </main>
  )
}
