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
        className={`floating-silver-strip relative w-full overflow-hidden rounded-[1.85rem] border border-white/16 px-5 py-4 text-white shadow-[0_24px_48px_rgba(0,0,0,0.36)] backdrop-blur-xl md:px-6 ${className}`}
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(231,236,243,0.3) 14%, rgba(86,92,101,0.9) 42%, rgba(9,10,12,0.98) 100%)',
        }}
      >
        <div className="pointer-events-none absolute inset-x-3 top-1 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.56)_50%,transparent_100%)]" />
        <div className="pointer-events-none absolute inset-x-[8%] bottom-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.42)_50%,transparent_100%)] opacity-70" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            {showGreeting ? (
              <div className="flex items-center gap-2 rounded-full border border-white/16 bg-black/18 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/74">
                <GreetingIcon className="h-3.5 w-3.5 text-white/74" />
                <span>{greeting}</span>
              </div>
            ) : null}

            <div className="hidden h-8 w-px bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.24)_50%,transparent_100%)] md:block" />

            <div className="flex items-center gap-2 text-sm text-white/62">
              <CalendarDays className="h-4 w-4 text-white/56" />
              <span className="uppercase tracking-[0.16em]">{dateLabel}</span>
            </div>

          </div>

          <div className="flex items-end gap-3 self-start md:self-auto">
            <p className="metal-text text-[2rem] font-semibold leading-none tracking-[0.24em] md:text-[2.65rem]">
              {timeLabel}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative flex min-w-[12.75rem] items-center gap-3 overflow-hidden rounded-[1.25rem] border border-white/18 px-3 py-2.5 text-white shadow-[0_18px_36px_rgba(0,0,0,0.32)] backdrop-blur-xl ${className}`}
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(229,234,241,0.32) 16%, rgba(83,89,97,0.92) 44%, rgba(10,10,12,0.98) 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-x-2 top-1 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.48)_50%,transparent_100%)]" />
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/16 bg-black/22">
        <Clock3 className="h-4 w-4 text-white/78" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="metal-text truncate text-sm font-semibold tracking-[0.16em]">{timeLabel}</p>
        <p className="truncate text-[10px] uppercase tracking-[0.18em] text-white/44">{dateLabel}</p>
      </div>
    </div>
  )
}
