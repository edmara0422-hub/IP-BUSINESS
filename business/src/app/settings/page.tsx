'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, User, Shield, Bell, Sliders, CreditCard,
  Check, Loader2, Eye, EyeOff, ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

type Section = 'perfil' | 'seguranca' | 'notificacoes' | 'preferencias' | 'conta'

const SECTIONS = [
  { id: 'perfil' as Section,        icon: User,        label: 'Perfil',         description: 'Nome, foto e informações pessoais' },
  { id: 'seguranca' as Section,     icon: Shield,      label: 'Segurança',      description: 'Senha e autenticação' },
  { id: 'notificacoes' as Section,  icon: Bell,        label: 'Notificações',   description: 'Alertas e avisos da plataforma' },
  { id: 'preferencias' as Section,  icon: Sliders,     label: 'Preferências',   description: 'Idioma e aparência' },
  { id: 'conta' as Section,         icon: CreditCard,  label: 'Conta',          description: 'Plano, faturamento e dados' },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('perfil')
  const { profile } = useAuth()

  return (
    <div className="relative min-h-screen bg-ocean-900 text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.08),transparent_32%)]" />
        <div className="absolute left-1/2 top-0 h-[20rem] w-[min(60rem,90vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(214,220,228,0.10)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-8 md:px-8">

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/">
            <motion.div
              whileTap={{ scale: 0.94 }}
              className="flex h-10 w-10 items-center justify-center rounded-[0.9rem] border border-white/12 text-white/60 transition hover:text-white"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(10,10,12,0.92) 100%)' }}
            >
              <ArrowLeft className="h-4 w-4" />
            </motion.div>
          </Link>
          <div>
            <p className="text-[9px] uppercase tracking-[0.44em] text-white/28">Intelligence Platform Business</p>
            <h1 className="text-[1.4rem] font-semibold tracking-[-0.01em] text-white/92" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Configurações
            </h1>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[260px_1fr]">

          {/* Sidebar nav */}
          <div className="chrome-panel overflow-hidden rounded-[1.6rem] p-2">
            {/* Profile pill */}
            {profile && (
              <div className="mb-2 flex items-center gap-3 rounded-[1.1rem] px-3 py-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 text-[14px] font-semibold text-white/80"
                  style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(10,10,12,0.94) 100%)' }}
                >
                  {(profile.name ?? profile.email).charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-white/80">{profile.name ?? '—'}</p>
                  <p className="truncate text-[10px] text-white/32">{profile.email}</p>
                </div>
              </div>
            )}

            <div className="h-px bg-white/[0.05] mb-2" />

            {SECTIONS.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex w-full items-center gap-3 rounded-[1rem] px-3 py-2.5 text-left transition-all ${
                  activeSection === id ? 'bg-white/[0.08] text-white/88' : 'text-white/42 hover:text-white/66 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="flex-1 text-[12px] font-medium">{label}</span>
                {activeSection === id && <ChevronRight className="h-3 w-3 text-white/28" />}
              </button>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === 'perfil'       && <PerfilSection />}
              {activeSection === 'seguranca'    && <SegurancaSection />}
              {activeSection === 'notificacoes' && <NotificacoesSection />}
              {activeSection === 'preferencias' && <PreferenciasSection />}
              {activeSection === 'conta'        && <ContaSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ── Shared ────────────────────────────────────────────────────────────────────

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="chrome-panel relative overflow-hidden rounded-[1.6rem] p-6 md:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px silver-divider opacity-50" />
      <div className="mb-5">
        <h2 className="text-[1rem] font-semibold text-white/88" style={{ fontFamily: 'Poppins, sans-serif' }}>{title}</h2>
        {description && <p className="mt-1 text-[12px] text-white/36">{description}</p>}
      </div>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[9px] uppercase tracking-[0.22em] text-white/28">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full rounded-[1rem] border border-white/[0.08] bg-black/20 px-4 py-2.5 text-[13px] text-white/72 outline-none placeholder:text-white/22 focus:border-white/18 transition"

// ── Perfil ────────────────────────────────────────────────────────────────────

function PerfilSection() {
  const { profile } = useAuth()
  const [name, setName] = useState(profile?.name ?? '')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error } = await supabase.from('profiles').update({ name }).eq('id', profile!.id)
      if (error) throw error
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionCard title="Perfil" description="Suas informações pessoais visíveis na plataforma.">
      <form onSubmit={handleSave} className="space-y-4">
        {/* Avatar */}
        <div className="flex items-center gap-4 pb-2">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.2rem] border border-white/12 text-[20px] font-semibold text-white/80"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(10,10,12,0.94) 100%)' }}
          >
            {(name || profile?.email || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[13px] font-medium text-white/72">{name || '—'}</p>
            <p className="text-[11px] text-white/32">{profile?.email}</p>
            {profile?.role === 'admin' && (
              <span className="mt-1 inline-block text-[9px] uppercase tracking-[0.18em] text-white/36">Administrador</span>
            )}
          </div>
        </div>

        <div className="h-px bg-white/[0.05]" />

        <Field label="Nome de exibição">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" className={inputCls} />
        </Field>

        <Field label="E-mail">
          <input value={profile?.email ?? ''} disabled className={`${inputCls} opacity-40 cursor-not-allowed`} />
        </Field>

        {error && <p className="rounded-[0.75rem] border border-red-500/20 bg-red-500/10 px-3 py-2 text-[11px] text-red-400/80">{error}</p>}

        <button
          type="submit" disabled={loading}
          className="flex items-center gap-2 rounded-[1rem] border border-white/12 bg-white/[0.06] px-5 py-2.5 text-[10px] uppercase tracking-[0.22em] text-white/64 transition hover:bg-white/[0.1] hover:text-white/82 disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <><Check className="h-3.5 w-3.5" /> Salvo</> : 'Salvar perfil'}
        </button>
      </form>
    </SectionCard>
  )
}

// ── Segurança ─────────────────────────────────────────────────────────────────

function SegurancaSection() {
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
    if (newPassword !== confirmPassword) { setError('As senhas não coincidem.'); return }
    if (newPassword.length < 6) { setError('Mínimo 6 caracteres.'); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setSaved(true)
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar senha.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <SectionCard title="Senha" description="Altere sua senha de acesso à plataforma.">
        <form onSubmit={handleSave} className="space-y-4">
          <Field label="Nova senha">
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nova senha"
                className={`${inputCls} pr-10`}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/24 hover:text-white/48 transition">
                {showPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </Field>

          {newPassword && (
            <Field label="Confirmar nova senha">
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a senha" className={inputCls} />
            </Field>
          )}

          {error && <p className="rounded-[0.75rem] border border-red-500/20 bg-red-500/10 px-3 py-2 text-[11px] text-red-400/80">{error}</p>}

          <button
            type="submit" disabled={loading || !newPassword}
            className="flex items-center gap-2 rounded-[1rem] border border-white/12 bg-white/[0.06] px-5 py-2.5 text-[10px] uppercase tracking-[0.22em] text-white/64 transition hover:bg-white/[0.1] hover:text-white/82 disabled:opacity-40"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <><Check className="h-3.5 w-3.5" /> Atualizado</> : 'Atualizar senha'}
          </button>
        </form>
      </SectionCard>

      <SectionCard title="Sessões ativas" description="Dispositivos conectados à sua conta.">
        <div className="flex items-center gap-3 rounded-[1rem] border border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <div className="h-2 w-2 rounded-full bg-white/60" style={{ boxShadow: '0 0 8px rgba(255,255,255,0.4)' }} />
          <div>
            <p className="text-[12px] font-medium text-white/68">Sessão atual</p>
            <p className="text-[10px] text-white/28">Navegador · Ativo agora</p>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

// ── Notificações ──────────────────────────────────────────────────────────────

function NotificacoesSection() {
  const [toggles, setToggles] = useState({ modulos: true, tutor: false, email: true, sistema: true })

  const items = [
    { id: 'modulos' as const,  label: 'Novos módulos',        description: 'Quando um novo módulo for publicado' },
    { id: 'tutor' as const,    label: 'Resposta do Tutor IA', description: 'Quando o tutor responder uma pergunta' },
    { id: 'email' as const,    label: 'E-mails da plataforma', description: 'Atualizações e comunicados importantes' },
    { id: 'sistema' as const,  label: 'Alertas do sistema',   description: 'Manutenções e avisos técnicos' },
  ]

  return (
    <SectionCard title="Notificações" description="Controle o que você quer receber de alertas.">
      <div className="space-y-3">
        {items.map(({ id, label, description }) => (
          <div key={id} className="flex items-center justify-between gap-4 rounded-[1rem] border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <div>
              <p className="text-[12px] font-medium text-white/72">{label}</p>
              <p className="text-[10px] text-white/32">{description}</p>
            </div>
            <button
              onClick={() => setToggles((t) => ({ ...t, [id]: !t[id] }))}
              className="relative h-5 w-9 shrink-0 rounded-full border transition-all duration-300"
              style={{
                background: toggles[id] ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.08)',
                borderColor: toggles[id] ? 'rgba(255,255,255,0.36)' : 'rgba(255,255,255,0.12)',
              }}
            >
              <span
                className="absolute top-[2px] h-3.5 w-3.5 rounded-full bg-[#050505] transition-all duration-300"
                style={{ left: toggles[id] ? 'calc(100% - 18px)' : '2px' }}
              />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// ── Preferências ──────────────────────────────────────────────────────────────

function PreferenciasSection() {
  return (
    <SectionCard title="Preferências" description="Personalize sua experiência na plataforma.">
      <div className="space-y-3">
        {[
          { label: 'Idioma', value: 'Português (BR)', soon: false },
          { label: 'Tema',   value: 'Dark (padrão)',  soon: true  },
          { label: 'Densidade de conteúdo', value: 'Padrão', soon: true },
        ].map(({ label, value, soon }) => (
          <div key={label} className="flex items-center justify-between gap-4 rounded-[1rem] border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <div>
              <p className="text-[12px] font-medium text-white/72">{label}</p>
              <p className="text-[10px] text-white/32">{value}</p>
            </div>
            {soon
              ? <span className="rounded-full border border-white/[0.08] px-2.5 py-0.5 text-[8px] uppercase tracking-[0.14em] text-white/28">Em breve</span>
              : <ChevronRight className="h-3.5 w-3.5 text-white/20" />
            }
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// ── Conta ─────────────────────────────────────────────────────────────────────

function ContaSection() {
  const { profile, signOut } = useAuth()
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push('/login')
  }

  return (
    <div className="space-y-4">
      <SectionCard title="Plano" description="Informações do seu plano atual.">
        <div className="flex items-center justify-between gap-4 rounded-[1rem] border border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <div>
            <p className="text-[12px] font-medium text-white/72">IPB Intelligence</p>
            <p className="text-[10px] text-white/32">Acesso completo à plataforma</p>
          </div>
          <span className="rounded-full border border-white/14 bg-white/[0.06] px-3 py-1 text-[9px] uppercase tracking-[0.16em] text-white/52">Ativo</span>
        </div>
      </SectionCard>

      <SectionCard title="Dados da conta">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4 rounded-[1rem] border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-white/28">E-mail</p>
              <p className="text-[13px] font-medium text-white/68">{profile?.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-[1rem] border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-white/28">Função</p>
              <p className="text-[13px] font-medium text-white/68 capitalize">{profile?.role ?? 'usuário'}</p>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Encerrar sessão">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-[1rem] border border-red-500/20 bg-red-500/[0.06] px-5 py-2.5 text-[10px] uppercase tracking-[0.22em] text-red-400/70 transition hover:bg-red-500/[0.12] hover:text-red-400"
        >
          Sair da conta
        </button>
      </SectionCard>
    </div>
  )
}
