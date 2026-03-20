'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Mode = 'login' | 'signup'

export default function LoginForm() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        })
        if (error) throw error
        setSuccess('Conta criada. Verifique seu e-mail para confirmar.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao autenticar.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#050507] px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.12),transparent_22%)]" />
        <div className="absolute left-1/2 top-0 h-[32rem] w-[min(72rem,96vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(214,220,228,0.12)_0%,transparent_70%)] blur-3xl" />
        <div className="grid-bg absolute inset-0 opacity-20" />
        <div className="absolute inset-x-0 top-0 h-px silver-divider opacity-60" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm"
      >
        <div className="mb-10 text-center">
          <p className="text-[9px] uppercase tracking-[0.52em] text-white/22">Intelligence Platform</p>
          <h1
            className="mt-2 text-[2.2rem] font-semibold leading-none tracking-[-0.03em] text-white/94"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            IPB
          </h1>
          <div className="mx-auto mt-3 h-px w-8 bg-white/12" />
        </div>

        <div className="chrome-panel overflow-hidden rounded-[2rem] p-7">
          <div className="mb-7 flex rounded-[1rem] border border-white/[0.07] bg-black/20 p-1">
            {(['login', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess('') }}
                className={`flex-1 rounded-[0.75rem] py-2 text-[10px] uppercase tracking-[0.2em] transition-all duration-200 ${
                  mode === m ? 'bg-white/[0.08] text-white/88' : 'text-white/28 hover:text-white/52'
                }`}
              >
                {m === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full rounded-[1rem] border border-white/[0.08] bg-black/20 px-4 py-3 text-[13px] text-white/72 outline-none placeholder:text-white/22 focus:border-white/20 transition"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              required
              className="w-full rounded-[1rem] border border-white/[0.08] bg-black/20 px-4 py-3 text-[13px] text-white/72 outline-none placeholder:text-white/22 focus:border-white/20 transition"
            />

            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                required
                className="w-full rounded-[1rem] border border-white/[0.08] bg-black/20 px-4 py-3 pr-11 text-[13px] text-white/72 outline-none placeholder:text-white/22 focus:border-white/20 transition"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/28 hover:text-white/52 transition"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <p className="rounded-[0.75rem] border border-red-500/20 bg-red-500/10 px-3 py-2 text-[11px] text-red-400/80">{error}</p>
            )}
            {success && (
              <p className="rounded-[0.75rem] border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] text-white/52">{success}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-[1rem] border border-white/12 bg-white/[0.06] py-3 text-[11px] uppercase tracking-[0.24em] text-white/72 transition hover:bg-white/[0.1] hover:text-white/90 disabled:opacity-40"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Entrar' : 'Criar conta'}
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[10px] text-white/18">
          Intelligence Platform BUSINESS © 2025
        </p>
      </motion.div>
    </main>
  )
}
