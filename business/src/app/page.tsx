'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence } from 'framer-motion'
import SplashScreen from '@/components/SplashScreen'

const MainApp = dynamic(() => import('@/components/MainApp'), {
  ssr: false,
  loading: () => null,
})


export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <main className="min-h-screen bg-ocean-900">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        ) : (
          <MainApp key="app" />
        )}
      </AnimatePresence>
    </main>
  )
}
