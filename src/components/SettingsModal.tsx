'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, Check, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/hooks/useAuth'

export default function SettingsModal({ profile, onClose, onUpdate }: {
  profile: Profile
  onClose: () => void
  onUpdate: (name: string) => void
}) {
  const [name, setName] = useState(profile.name ?? '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (newPassword && newPassword !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    if (newPassword && newPassword.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      // Atualiza nome no perfil
      await supabase.from('profiles').update({ name }).eq('id', profile.id)

      // Atualiza senha se preenchida
      if (newPassword) {
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error) throw error
      }

      onUpdate(name)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      if (newPassword) setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[rgba(6,6,8,0.98)] shadow-[0_32px_64px_rgba(0,0,0,0.6)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px silver-divider opacity-40" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.32em] text-white/28">Minha conta</p>
              <h3 className="text-[1rem] font-semibold text-white/86" style={{ fontFamily: 'Poppins, sans-serif' }}>Configurações</h3>
            </div>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.07] text-white/36 transition hover:text-white/62">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 p-6">
            {/* Avatar */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-[16px] font-semibold text-white/72">
                {(name || profile.email).charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-[13px] font-medium text-white/72">{name || '—'}</p>
                <p className="text-[10px] text-white/28">{profile.email}</p>
              </div>
            </div>

            <div className="h-px bg-white/[0.05]" />

            {/* Nome */}
            <div>
              <label className="mb-1.5 block text-[9px] uppercase tracking-[0.22em] text-white/28">Nome</label>
              <input
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full rounded-[1rem] border border-white/[0.08] bg-black/20 px-4 py-2.5 text-[13px] text-white/72 outline-none placeholder:text-white/22 focus:border-white/18 transition"
              />
            </div>

            <div className="h-px bg-white/[0.05]" />

            {/* Nova senha */}
            <div>
              <label className="mb-1.5 block text-[9px] uppercase tracking-[0.22em] text-white/28">Nova senha <span className="text-white/18">(opcional)</span></label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nova senha"
                  className="w-full rounded-[1rem] border border-white/[0.08] bg-black/20 px-4 py-2.5 pr-10 text-[13px] text-white/72 outline-none placeholder:text-white/22 focus:border-white/18 transition"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/24 hover:text-white/48 transition">
                  {showPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {newPassword && (
              <input
                type="password"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar nova senha"
                className="w-full rounded-[1rem] border border-white/[0.08] bg-black/20 px-4 py-2.5 text-[13px] text-white/72 outline-none placeholder:text-white/22 focus:border-white/18 transition"
              />
            )}

            {error && <p className="rounded-[0.75rem] border border-red-500/20 bg-red-500/10 px-3 py-2 text-[11px] text-red-400/80">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-[1rem] border border-white/12 bg-white/[0.06] py-3 text-[10px] uppercase tracking-[0.22em] text-white/64 transition hover:bg-white/[0.1] hover:text-white/82 disabled:opacity-40"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <><Check className="h-4 w-4" /> Salvo</> : 'Salvar alterações'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
