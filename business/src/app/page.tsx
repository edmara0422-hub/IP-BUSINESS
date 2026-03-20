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
  const { user, loading } = useAuth()

  if (showSplash) {
    return (
      <main className="min-h-screen bg-ocean-900">
        <AnimatePresence mode="wait">
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        </AnimatePresence>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050507]">
        <span className="text-[0.7rem] uppercase tracking-[0.3em] text-white/30">Carregando...</span>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-ocean-900">
      <AnimatePresence mode="wait">
        {user ? <MainApp key="app" /> : <LoginPage key="login" />}
      </AnimatePresence>
    </main>
  )
}
