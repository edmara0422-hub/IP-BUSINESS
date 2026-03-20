'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, BookOpen, Globe, Search, LogOut, Shield, Settings } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

type Tab = 'business' | 'estudo' | 'admin'

const AbaBusiness = dynamic(() => import('@/components/AbaBusiness'), { ssr: false, loading: () => <div className="glass-card min-h-[32rem] p-6" /> })
const AbaEstudo = dynamic(() => import('@/components/AbaEstudo'), { ssr: false, loading: () => <div className="glass-card min-h-[32rem] p-6" /> })
const AbaAdmin = dynamic(() => import('@/components/AbaAdmin'), { ssr: false, loading: () => <div className="glass-card min-h-[32rem] p-6" /> })

function ShellBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.14),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.05)_0%,transparent_24%,rgba(0,0,0,0.18)_100%)]" />
      <div className="absolute left-1/2 top-0 h-[24rem] w-[min(72rem,96vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(214,220,228,0.16)_0%,rgba(214,220,228,0.04)_46%,transparent_76%)] blur-3xl" />
      <div className="absolute left-[12%] top-[18%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)] blur-[120px]" />
      <div className="absolute right-[10%] top-[24%] h-[22rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(176,184,193,0.1)_0%,transparent_70%)] blur-[120px]" />
      <div className="absolute inset-x-[10%] bottom-[-10rem] h-[20rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(213,219,227,0.14)_0%,rgba(213,219,227,0.03)_42%,transparent_70%)] blur-[100px]" />
      <div className="absolute left-[14%] top-0 h-full w-px bg-[linear-gradient(180deg,rgba(255,255,255,0.16),transparent_28%,transparent_72%,rgba(255,255,255,0.08))]" />
      <div className="absolute right-[14%] top-0 h-full w-px bg-[linear-gradient(180deg,rgba(255,255,255,0.16),transparent_28%,transparent_72%,rgba(255,255,255,0.08))]" />
    </div>
  )
}

function ProfileButton() {
  const { profile, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const displayName = profile?.name
  const initials = (displayName ?? profile?.email ?? '?').charAt(0).toUpperCase()
  const isAdmin = profile?.role === 'admin'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-11 w-11 items-center justify-center rounded-[1rem] border border-white/14 text-white transition hover:border-white/24"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(220,225,232,0.08) 16%, rgba(76,80,87,0.94) 44%, rgba(10,10,12,0.98) 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
      >
        <span className="text-[13px] font-semibold text-white/88">{initials}</span>
        {isAdmin && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-black bg-white/90">
            <Shield className="h-2 w-2 text-[#050505]" />
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[3.2rem] w-60 overflow-hidden rounded-[1.4rem] border border-white/[0.08] bg-[rgba(6,6,8,0.97)] shadow-[0_20px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            style={{ zIndex: 9999 }}
          >
            {/* Profile header */}
            <div className="relative overflow-hidden border-b border-white/[0.06] px-4 py-4">
              <div className="pointer-events-none absolute inset-0 grid-bg opacity-10" />
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-[14px] font-semibold text-white/80">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-white/82">{displayName ?? '—'}</p>
                  <p className="truncate text-[10px] text-white/32">{profile?.email}</p>
                </div>
              </div>
              {isAdmin && (
                <div className="mt-3 flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 w-fit">
                  <Shield className="h-2.5 w-2.5 text-white/42" />
                  <span className="text-[8px] uppercase tracking-[0.22em] text-white/38">Administrador</span>
                </div>
              )}
            </div>

            {/* Menu items */}
            <div className="p-2">
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-[0.9rem] px-3 py-2.5 text-[12px] text-white/44 transition hover:bg-white/[0.04] hover:text-white/66"
              >
                <Settings className="h-3.5 w-3.5" />
                Configurações
              </Link>
              <div className="my-1 h-px bg-white/[0.05]" />
              <button
                onClick={signOut}
                className="flex w-full items-center gap-2.5 rounded-[0.9rem] px-3 py-2.5 text-[12px] text-white/44 transition hover:bg-red-500/[0.08] hover:text-red-400/70"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sair
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TopBar() {
  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-40 px-3 pt-3 md:px-6"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="chrome-shell mx-auto flex h-[4.8rem] max-w-7xl items-center justify-between gap-4 rounded-[1.9rem] px-4 md:px-6">
        <div className="flex items-center gap-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.05rem] border border-white/16"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(219,225,232,0.36) 16%, rgba(96,101,108,0.94) 42%, rgba(14,15,18,0.98) 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.24), inset 0 -1px 0 rgba(255,255,255,0.05), 0 16px 32px rgba(0,0,0,0.36)',
            }}
          >
            <span className="text-[0.8rem] font-semibold tracking-[0.32em] text-white" style={{ fontFamily: 'Poppins, sans-serif', paddingLeft: '0.32em' }}>
              IPB
            </span>
          </div>
          <p className="metal-text text-[10px] font-semibold uppercase tracking-[0.14em] text-white/74 md:text-[11px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Intelligence Platform BUSINESS
          </p>
        </div>

        <div
          className="hidden items-center gap-3 rounded-[1.4rem] border border-white/12 px-4 py-3 xl:flex xl:w-[23rem]"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(20,20,22,0.82) 56%, rgba(8,8,10,0.96) 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)' }}
        >
          <Search className="h-4 w-4 text-white/56" />
          <input type="text" placeholder="Search signals, forecasts, strategy modules..." className="w-full bg-transparent text-sm text-white/78 placeholder:text-white/34 outline-none" />
          <kbd className="rounded-md border border-white/12 px-1.5 py-0.5 text-[10px] text-white/32">⌘K</kbd>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-white/12 text-white/70 transition hover:text-white"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(18,18,20,0.84) 60%, rgba(8,8,10,0.98) 100%)' }}
          >
            <Bell className="h-4 w-4" />
          </button>
          <ProfileButton />
        </div>
      </div>
    </motion.header>
  )
}

function TabSwitcher({ active, onSwitch }: { active: Tab; onSwitch: (tab: Tab) => void }) {
  const { profile } = useAuth()
  const isAdmin = profile?.role === 'admin'

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 z-40 w-[min(40rem,calc(100vw-1.5rem))] -translate-x-1/2"
      initial={{ y: 70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={`chrome-pill grid gap-1.5 rounded-[1.8rem] p-1.5 ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <button
          onClick={() => onSwitch('business')}
          className={`flex items-center justify-center gap-2 rounded-[1.3rem] px-5 py-4 text-sm font-semibold tracking-[0.16em] transition-all duration-300 ${active === 'business' ? 'chrome-active text-[#050505]' : 'text-white/78 hover:text-white'}`}
        >
          <Globe className="h-4 w-4" />
          <span>BUSINESS</span>
        </button>

        <button
          onClick={() => onSwitch('estudo')}
          className={`flex items-center justify-center gap-2 rounded-[1.3rem] px-5 py-4 text-sm font-semibold tracking-[0.16em] transition-all duration-300 ${active === 'estudo' ? 'chrome-active text-[#050505]' : 'text-white/78 hover:text-white'}`}
        >
          <BookOpen className="h-4 w-4" />
          <span>INTELLIGENCE</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => onSwitch('admin')}
            className={`flex items-center justify-center gap-2 rounded-[1.3rem] px-5 py-4 text-sm font-semibold tracking-[0.16em] transition-all duration-300 ${active === 'admin' ? 'chrome-active text-[#050505]' : 'text-white/78 hover:text-white'}`}
          >
            <Shield className="h-4 w-4" />
            <span>ADMIN</span>
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default function MainApp() {
  const [activeTab, setActiveTab] = useState<Tab>('business')
  const { user, profile, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login'
    }
  }, [loading, user])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507]">
        <span className="text-[0.7rem] uppercase tracking-[0.3em] text-white/30">Carregando...</span>
      </div>
    )
  }

  if (!user) return null

  return (
    <motion.div
      className="relative min-h-screen bg-ocean-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <ShellBackdrop />
      <TopBar />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-32 pt-24 md:px-8 md:pt-28">
        <div className="command-stage overflow-hidden min-h-[calc(100vh-10rem)] rounded-[2.2rem]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.06)_18%,rgba(255,255,255,0.36)_50%,rgba(255,255,255,0.06)_82%,transparent_100%)] opacity-60" />
          <div className="pointer-events-none absolute bottom-0 left-[7%] right-[7%] h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.03)_20%,rgba(255,255,255,0.14)_50%,rgba(255,255,255,0.03)_80%,transparent_100%)] opacity-45" />
          <div className="pointer-events-none absolute left-0 top-[8%] h-[76%] w-px bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.06)_14%,rgba(255,255,255,0.18)_50%,rgba(255,255,255,0.06)_86%,transparent_100%)] opacity-55" />
          <div className="pointer-events-none absolute right-0 top-[8%] h-[76%] w-px bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.06)_14%,rgba(255,255,255,0.18)_50%,rgba(255,255,255,0.06)_86%,transparent_100%)] opacity-55" />
          <AnimatePresence mode="wait">
            {activeTab === 'business' && <AbaBusiness key="business" />}
            {activeTab === 'estudo'   && <AbaEstudo key="estudo" />}
            {activeTab === 'admin'    && profile?.role === 'admin' && <AbaAdmin key="admin" />}
          </AnimatePresence>
        </div>
      </div>

      <TabSwitcher active={activeTab} onSwitch={setActiveTab} />
    </motion.div>
  )
}
