'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, BookOpen, Briefcase, Globe, LogOut, Shield, Settings, SunMedium, MoonStar } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useAccessibility } from '@/hooks/useAccessibility'
import IpbBackground from '@/components/IpbBackground'

type Tab = 'business' | 'estudo' | 'admin'

const AbaBusiness  = dynamic(() => import('@/components/AbaBusiness'),   { ssr: false, loading: () => <div className="min-h-[32rem]" /> })
const AbaEstudo    = dynamic(() => import('@/components/AbaEstudo'),     { ssr: false, loading: () => <div className="min-h-[32rem]" /> })
const AbaWorkspace = dynamic(() => import('@/components/AbaTrabalhar'),  { ssr: false, loading: () => <div className="min-h-[32rem]" /> })

/* ── Clock inline no TopBar ── */
function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])
  const h = now.getHours()
  const greeting = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
  const isDay = h >= 6 && h < 18
  const date = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }).format(now)
  return { greeting, isDay, date }
}

/* ── Profile Button ── */
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
  const isAdmin = profile?.role === 'admin'

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
            <div className="p-2">
              <Link href="/settings" onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-[0.9rem] px-3 py-2.5 text-[12px] text-white/44 transition hover:bg-white/[0.04] hover:text-white/66">
                <Settings className="h-3.5 w-3.5" />
                Configurações
              </Link>
              <div className="my-1 h-px bg-white/[0.05]" />
              <button onClick={signOut}
                className="flex w-full items-center gap-2.5 rounded-[0.9rem] px-3 py-2.5 text-[12px] text-white/44 transition hover:bg-red-500/[0.08] hover:text-red-400/70">
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

/* ── TopBar unificada ── */
function TopBar() {
  const { greeting, isDay, date } = useClock()
  const { profile, user } = useAuth()
  const displayName = profile?.name ?? user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? ''
  const firstName = displayName.split(' ')[0]
  const GreetIcon = isDay ? SunMedium : MoonStar

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-40 px-3 pt-2 pb-2 md:px-6"
      style={{
        background: 'rgba(5,5,5,0.82)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderBottom: '1px solid rgba(192,192,192,0.06)',
      }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">

        {/* Esquerda: logo IPB */}
        <div className="flex items-center gap-2 md:gap-3">
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[0.5rem] border border-white/16 md:h-7 md:w-7 md:rounded-[0.6rem]"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(219,225,232,0.36) 16%, rgba(96,101,108,0.94) 42%, rgba(14,15,18,0.98) 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.24), inset 0 -1px 0 rgba(255,255,255,0.05), 0 16px 32px rgba(0,0,0,0.36)',
            }}
          >
            <span className="text-[0.45rem] font-semibold tracking-[0.28em] text-white md:text-[0.55rem]"
              style={{ fontFamily: 'Poppins, sans-serif', paddingLeft: '0.32em' }}>
              IPB
            </span>
          </div>
          <p className="metal-text hidden text-[8px] font-semibold uppercase tracking-[0.1em] text-white/50 sm:block md:text-[9px]"
            style={{ fontFamily: 'Poppins, sans-serif' }}>
            Intelligence Platform BUSINESS
          </p>
        </div>

        {/* Centro: saudação + data */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
            <GreetIcon className="h-2.5 w-2.5 text-white/50" />
            <span className="text-[9px] font-medium text-white/45">
              {greeting}{firstName ? `, ${firstName}` : ''}
            </span>
          </div>
          <span className="hidden text-[9px] uppercase tracking-[0.12em] text-white/25 sm:block">{date}</span>
        </div>

        {/* Direita: notificações + perfil */}
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

/* ── Tab Switcher ── */
function TabSwitcher({ active, onSwitch }: { active: Tab; onSwitch: (tab: Tab) => void }) {
  return (
    <motion.div
      className="fixed bottom-10 left-0 right-0 z-40 px-3 pb-2 md:bottom-3 md:px-6"
      style={{
        background: 'rgba(5,5,5,0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      initial={{ y: 70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="chrome-pill mx-auto grid max-w-7xl grid-cols-3 gap-1 rounded-[1.2rem] p-0.5 md:rounded-[1.4rem]">
        {([
          { id: 'business', icon: Globe,      label: 'BUSINESS' },
          { id: 'estudo',   icon: BookOpen,   label: 'INTELLIGENCE' },
          { id: 'admin',    icon: Briefcase,  label: 'WORKSPACE' },
        ] as { id: Tab; icon: React.ElementType; label: string }[]).map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => onSwitch(id)}
            className={`flex items-center justify-center gap-1 rounded-[0.8rem] px-2 py-1.5 text-[9px] font-semibold tracking-[0.1em] transition-all duration-300 ${active === id ? 'chrome-active text-[#050505]' : 'text-white/78 hover:text-white'}`}>
            <Icon className="h-3 w-3" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

/* ── Main ── */
export default function MainApp() {
  useAccessibility()
  const [activeTab, setActiveTab] = useState<Tab>('business')
  // Rastreia abas já visitadas — uma vez montada, a aba nunca desmonta
  const [visited, setVisited] = useState<Set<Tab>>(new Set<Tab>(['business']))

  const handleSwitch = useCallback((tab: Tab) => {
    setVisited(prev => { const s = new Set(prev); s.add(tab); return s })
    setActiveTab(tab)
  }, [])

  return (
    <div className="relative min-h-screen bg-[#050505] mobile-scale">
      <IpbBackground />
      <TopBar />

      <div className="relative z-10 mx-auto max-w-7xl px-2 mt-[5rem] mb-[12rem] md:px-8 md:mt-[5rem] md:mb-[8rem]">
        {/* Abas ficam montadas após a primeira visita — só mostra/esconde com display */}
        <div style={{ display: activeTab === 'business' ? 'block' : 'none' }}>
          {visited.has('business') && <AbaBusiness />}
        </div>
        <div style={{ display: activeTab === 'estudo' ? 'block' : 'none' }}>
          {visited.has('estudo') && <AbaEstudo />}
        </div>
        <div style={{ display: activeTab === 'admin' ? 'block' : 'none' }}>
          {visited.has('admin') && <AbaWorkspace />}
        </div>
      </div>

      <TabSwitcher active={activeTab} onSwitch={handleSwitch} />
    </div>
  )
}
