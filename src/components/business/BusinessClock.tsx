'use client'

import { useEffect, useState } from 'react'
import { CalendarDays, Clock3, MoonStar, SunMedium } from 'lucide-react'

interface BusinessClockProps {
  variant?: 'compact' | 'hero'
  className?: string
  showGreeting?: boolean
}

export default function BusinessClock({
  variant = 'compact',
  className = '',
  showGreeting = false,
}: BusinessClockProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  const dateLabel = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(now)

  const timeLabel = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: variant === 'hero' ? '2-digit' : undefined,
  }).format(now)

  const hour = now.getHours()
  const isDay = hour >= 6 && hour < 18
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
  const GreetingIcon = isDay ? SunMedium : MoonStar

  if (variant === 'hero') {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-[0.75rem] border border-white/12 px-2 py-0.5 text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] md:px-4 md:py-0.5 ${className}`}
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(231,236,243,0.3) 14%, rgba(86,92,101,0.9) 42%, rgba(9,10,12,0.98) 100%)',
        }}
      >
        <div className="pointer-events-none absolute inset-x-3 top-0.5 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.56)_50%,transparent_100%)]" />
        <div className="pointer-events-none absolute inset-x-[8%] bottom-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.42)_50%,transparent_100%)] opacity-70" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 md:gap-3">
            {showGreeting ? (
              <div className="flex items-center gap-1 rounded-full border border-white/12 bg-black/18 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.14em] text-white/60 md:gap-1 md:px-1.5 md:text-[8px] md:tracking-[0.18em]">
                <GreetingIcon className="h-2.5 w-2.5 text-white/74 md:h-3 md:w-3" />
                <span>{greeting}</span>
              </div>
            ) : null}

            <div className="hidden h-3.5 w-px bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.24)_50%,transparent_100%)] md:block" />

            <div className="flex items-center gap-1 text-[7px] text-white/55 md:gap-1.5 md:text-[9px]">
              <CalendarDays className="h-2.5 w-2.5 text-white/56 md:h-3 md:w-3" />
              <span className="uppercase tracking-[0.1em] md:tracking-[0.16em]">{dateLabel}</span>
            </div>

          </div>

          <p className="metal-text text-[0.6rem] font-semibold leading-none tracking-[0.14em] md:text-[0.75rem] md:tracking-[0.18em]">
            {timeLabel}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative flex min-w-[11rem] items-center gap-2 overflow-hidden rounded-[0.75rem] border border-white/12 px-2.5 py-1.5 text-white shadow-[0_6px_16px_rgba(0,0,0,0.2)] backdrop-blur-xl ${className}`}
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(229,234,241,0.32) 16%, rgba(83,89,97,0.92) 44%, rgba(10,10,12,0.98) 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-x-2 top-0.5 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.48)_50%,transparent_100%)]" />
      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/12 bg-black/22">
        <Clock3 className="h-3 w-3 text-white/78" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="metal-text truncate text-xs font-semibold tracking-[0.16em]">{timeLabel}</p>
        <p className="truncate text-[9px] uppercase tracking-[0.18em] text-white/44">{dateLabel}</p>
      </div>
    </div>
  )
}
