'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, BookOpen, Briefcase, Globe, Search, LogOut, Shield, Settings } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useAccessibility } from '@/hooks/useAccessibility'

type Tab = 'business' | 'estudo' | 'admin'

const AbaBusiness = dynamic(() => import('@/components/AbaBusiness'), { ssr: false, loading: () => <div className="glass-card min-h-[32rem] p-6" /> })
const AbaEstudo = dynamic(() => import('@/components/AbaEstudo'), { ssr: false, loading: () => <div className="glass-card min-h-[32rem] p-6" /> })
const AbaWorkspace = dynamic(() => import('@/components/AbaTrabalhar'), { ssr: false, loading: () => <div className="glass-card min-h-[32rem] p-6" /> })
const WorkspaceOnboarding = dynamic(() => import('@/components/WorkspaceOnboarding'), { ssr: false, loading: () => null })

function ShellBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.04),transparent_30%)]" />
    </div>
  )
}

function ProfileButton() {
  const { user, profile, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const displayName = profile?.name ?? user?.user_metadata?.name ?? user?.email?.split('@')[0]
  const email = profile?.email ?? user?.email ?? ''
  const initials = (displayName ?? email ?? 'U').charAt(0).toUpperCase()
  const isAdmin = true

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-6 w-6 items-center justify-center rounded-[0.5rem] border border-white/14 text-white transition hover:border-white/24 md:h-7 md:w-7 md:rounded-[0.6rem]"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(220,225,232,0.08) 16%, rgba(76,80,87,0.94) 44%, rgba(10,10,12,0.98) 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
      >
        <span className="text-[10px] font-semibold text-white/88">{initials}</span>
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
                  <p className="truncate text-[10px] text-white/32">{email}</p>
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
      <div className="chrome-pill mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-[1.2rem] p-0.5 px-2.5 md:rounded-[1.4rem] md:px-4">
        <div className="flex items-center gap-2 md:gap-4">
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[0.5rem] border border-white/16 md:h-7 md:w-7 md:rounded-[0.6rem]"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(219,225,232,0.36) 16%, rgba(96,101,108,0.94) 42%, rgba(14,15,18,0.98) 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.24), inset 0 -1px 0 rgba(255,255,255,0.05), 0 16px 32px rgba(0,0,0,0.36)',
            }}
          >
            <span className="text-[0.45rem] font-semibold tracking-[0.28em] text-white md:text-[0.55rem]" style={{ fontFamily: 'Poppins, sans-serif', paddingLeft: '0.32em' }}>
              IPB
            </span>
          </div>
          <p className="metal-text text-[6px] font-semibold uppercase tracking-[0.1em] text-white/50 sm:text-[8px] md:text-[9px] md:tracking-[0.12em]" style={{ fontFamily: 'Poppins, sans-serif' }}>
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

        <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
          <button
            className="flex h-6 w-6 items-center justify-center rounded-[0.5rem] border border-white/12 text-white/70 transition hover:text-white md:h-7 md:w-7 md:rounded-[0.6rem]"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(18,18,20,0.84) 60%, rgba(8,8,10,0.98) 100%)' }}
          >
            <Bell className="h-3 w-3" />
          </button>
          <ProfileButton />
        </div>
      </div>
    </motion.header>
  )
}

function TabSwitcher({ active, onSwitch }: { active: Tab; onSwitch: (tab: Tab) => void }) {
  return (
    <motion.div
      className="fixed bottom-5 left-0 right-0 z-40 px-3 md:bottom-3 md:px-6"
      initial={{ y: 70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="chrome-pill mx-auto grid max-w-7xl grid-cols-3 gap-1 rounded-[1.2rem] p-0.5 md:rounded-[1.4rem]">
        <button
          onClick={() => onSwitch('business')}
          className={`flex items-center justify-center gap-1 rounded-[0.8rem] px-2 py-1.5 text-[9px] font-semibold tracking-[0.1em] transition-all duration-300 ${active === 'business' ? 'chrome-active text-[#050505]' : 'text-white/78 hover:text-white'}`}
        >
          <Globe className="h-3 w-3" />
          <span>BUSINESS</span>
        </button>

        <button
          onClick={() => onSwitch('estudo')}
          className={`flex items-center justify-center gap-1 rounded-[0.8rem] px-2 py-1.5 text-[9px] font-semibold tracking-[0.1em] transition-all duration-300 ${active === 'estudo' ? 'chrome-active text-[#050505]' : 'text-white/78 hover:text-white'}`}
        >
          <BookOpen className="h-3 w-3" />
          <span>INTELLIGENCE</span>
        </button>

        <button
          onClick={() => onSwitch('admin')}
          className={`flex items-center justify-center gap-1 rounded-[0.8rem] px-2 py-1.5 text-[9px] font-semibold tracking-[0.1em] transition-all duration-300 ${active === 'admin' ? 'chrome-active text-[#050505]' : 'text-white/78 hover:text-white'}`}
        >
          <Briefcase className="h-3 w-3" />
          <span>WORKSPACE</span>
        </button>
      </div>
    </motion.div>
  )
}

export default function MainApp() {
  useAccessibility() // Applies CSS classes to body based on saved mode
  const [activeTab, setActiveTab] = useState<Tab>('business')
  const [workspaceReady, setWorkspaceReady] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('ipb-workspace-ready') === 'true'
    return false
  })

  const handleWorkspaceComplete = (_p: unknown) => {
    setWorkspaceReady(true)
    localStorage.setItem('ipb-workspace-ready', 'true')
  }
  const { profile } = useAuth()

  return (
    <motion.div
      className="relative min-h-screen bg-ocean-900 mobile-scale"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <ShellBackdrop />
      <TopBar />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-start px-2 pb-24 pt-[9rem] md:px-8 md:pb-32 md:pt-28">
        <div className="command-stage w-full overflow-hidden rounded-[2.2rem]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.06)_18%,rgba(255,255,255,0.36)_50%,rgba(255,255,255,0.06)_82%,transparent_100%)] opacity-60" />
          <div className="pointer-events-none absolute bottom-0 left-[7%] right-[7%] h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.03)_20%,rgba(255,255,255,0.14)_50%,rgba(255,255,255,0.03)_80%,transparent_100%)] opacity-45" />
          <div className="pointer-events-none absolute left-0 top-[8%] h-[76%] w-px bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.06)_14%,rgba(255,255,255,0.18)_50%,rgba(255,255,255,0.06)_86%,transparent_100%)] opacity-55" />
          <div className="pointer-events-none absolute right-0 top-[8%] h-[76%] w-px bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.06)_14%,rgba(255,255,255,0.18)_50%,rgba(255,255,255,0.06)_86%,transparent_100%)] opacity-55" />
          <AnimatePresence mode="wait">
            {activeTab === 'business' && <AbaBusiness key="business" />}
            {activeTab === 'estudo'   && <AbaEstudo key="estudo" />}
            {activeTab === 'admin' && (workspaceReady ? <AbaWorkspace key="workspace" /> : <WorkspaceOnboarding key="onboarding" onComplete={handleWorkspaceComplete} />)}
          </AnimatePresence>
        </div>
      </div>

      <TabSwitcher active={activeTab} onSwitch={setActiveTab} />
    </motion.div>
  )
}
