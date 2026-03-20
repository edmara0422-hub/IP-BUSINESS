'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, TrendingUp, Settings, Shield, BookOpen,
  LayoutDashboard, Sparkles, Trash2, ChevronDown,
  Plus, Check, X, Loader2, BarChart3, Lock, Unlock,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = 'admin' | 'student' | 'team'

type UserProfile = {
  id: string
  email: string
  name: string | null
  role: Role
  created_at: string
}

type Permission = {
  user_id: string
  permission: string
  granted: boolean
}

type AdminTab = 'usuarios' | 'permissoes' | 'progresso' | 'plataforma'

const MODULES = ['M1','M2','M3','M4','M5','M6','M7','M8']
const MODULE_NAMES: Record<string, string> = {
  M1: 'Inovação e Criatividade', M2: 'Fundamentos de Gestão',
  M3: 'Mercado e Pessoas', M4: 'Lógica e Humanidades',
  M5: 'Empreendedorismo e Estratégia', M6: 'Finanças Avançadas',
  M7: 'Intervenção e Sociedade', M8: 'Pesquisa e Identidade',
}
const GLOBAL_PERMISSIONS = ['intelligence', 'business', 'tutor']
const PERM_LABELS: Record<string, string> = {
  intelligence: 'Intelligence (Estudo)', business: 'Business (Dashboard)', tutor: 'Tutor IA',
}
const ROLE_LABELS: Record<Role, string> = { admin: 'Admin', student: 'Aluno', team: 'Equipe' }
const TOTAL_SUBMODULES = 24

// ─── Admin Tabs ───────────────────────────────────────────────────────────────

const TABS: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'usuarios', label: 'Usuários', icon: Users },
  { id: 'permissoes', label: 'Permissões', icon: Lock },
  { id: 'progresso', label: 'Progresso', icon: BarChart3 },
  { id: 'plataforma', label: 'Plataforma', icon: Settings },
]

// ─── Role Badge ───────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: Role }) {
  const colors: Record<Role, string> = {
    admin: 'border-white/16 text-white/52',
    student: 'border-white/8 text-white/32',
    team: 'border-white/12 text-white/42',
  }
  return (
    <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[8px] uppercase tracking-[0.16em] ${colors[role]}`}>
      {role === 'admin' && <Shield className="h-2.5 w-2.5" />}
      {role === 'team' && <LayoutDashboard className="h-2.5 w-2.5" />}
      {role === 'student' && <BookOpen className="h-2.5 w-2.5" />}
      {ROLE_LABELS[role]}
    </span>
  )
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({ value, onChange, disabled }: { value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!value)}
      className={`relative h-5 w-9 rounded-full border transition-all duration-200 ${
        value ? 'border-white/20 bg-white/20' : 'border-white/[0.08] bg-white/[0.04]'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-all duration-200 ${value ? 'left-[18px]' : 'left-0.5'}`} />
    </button>
  )
}

// ─── Add User Form ────────────────────────────────────────────────────────────

function AddUserForm({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<Role>('student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role }),
      })
      const data = await res.json() as { error?: string }
      if (data.error) throw new Error(data.error)
      onAdded()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar usuário')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[rgba(6,6,8,0.96)] p-5 shadow-[0_20px_48px_rgba(0,0,0,0.5)]"
    >
      <p className="mb-4 text-[9px] uppercase tracking-[0.32em] text-white/28">Novo usuário</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
          className="w-full rounded-[0.9rem] border border-white/[0.08] bg-black/20 px-3 py-2.5 text-[12px] text-white/72 outline-none placeholder:text-white/22 focus:border-white/16 transition"
        />
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail" required
          className="w-full rounded-[0.9rem] border border-white/[0.08] bg-black/20 px-3 py-2.5 text-[12px] text-white/72 outline-none placeholder:text-white/22 focus:border-white/16 transition"
        />
        <div className="flex gap-1 rounded-[0.9rem] border border-white/[0.07] bg-black/20 p-1">
          {(['student','team','admin'] as Role[]).map((r) => (
            <button key={r} type="button" onClick={() => setRole(r)}
              className={`flex-1 rounded-[0.65rem] py-1.5 text-[9px] uppercase tracking-[0.14em] transition ${role === r ? 'bg-white/[0.08] text-white/82' : 'text-white/28 hover:text-white/52'}`}
            >
              {ROLE_LABELS[r]}
            </button>
          ))}
        </div>
        {error && <p className="text-[11px] text-red-400/70">{error}</p>}
        <div className="flex gap-2">
          <button type="button" onClick={onClose}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[0.9rem] border border-white/[0.07] py-2 text-[10px] text-white/36 transition hover:text-white/56"
          >
            <X className="h-3 w-3" /> Cancelar
          </button>
          <button type="submit" disabled={loading}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[0.9rem] border border-white/12 bg-white/[0.06] py-2 text-[10px] text-white/64 transition hover:bg-white/[0.1] disabled:opacity-40"
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Check className="h-3 w-3" /> Criar</>}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AbaAdmin() {
  const [activeTab, setActiveTab] = useState<AdminTab>('usuarios')
  const [users, setUsers] = useState<UserProfile[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [progress, setProgress] = useState<{ user_id: string; submodule_id: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [roleMenuOpen, setRoleMenuOpen] = useState<string | null>(null)
  const supabase = createClient()

  async function loadData() {
    const [{ data: profiles }, { data: perms }, { data: prog }] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at'),
      supabase.from('user_permissions').select('*'),
      supabase.from('study_progress').select('user_id, submodule_id'),
    ])
    setUsers((profiles ?? []) as UserProfile[])
    setPermissions((perms ?? []) as Permission[])
    setProgress(prog ?? [])
    setLoading(false)
    if (!selectedUser && profiles && profiles.length > 0) {
      const first = (profiles as UserProfile[]).find((p) => p.role !== 'admin')
      if (first) setSelectedUser(first.id)
    }
  }

  useEffect(() => { loadData() }, [])

  async function updateRole(userId: string, role: Role) {
    await supabase.from('profiles').update({ role }).eq('id', userId)
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u))
    setRoleMenuOpen(null)
  }

  async function deleteUser(userId: string) {
    if (!confirm('Excluir este usuário?')) return
    await fetch('/api/admin/delete-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    setUsers((prev) => prev.filter((u) => u.id !== userId))
  }

  function hasPermission(userId: string, perm: string) {
    const p = permissions.find((x) => x.user_id === userId && x.permission === perm)
    return p ? p.granted : true // default: granted
  }

  async function togglePermission(userId: string, perm: string) {
    const current = hasPermission(userId, perm)
    await supabase.from('user_permissions').upsert({ user_id: userId, permission: perm, granted: !current }, { onConflict: 'user_id,permission' })
    setPermissions((prev) => {
      const existing = prev.find((x) => x.user_id === userId && x.permission === perm)
      if (existing) return prev.map((x) => x.user_id === userId && x.permission === perm ? { ...x, granted: !current } : x)
      return [...prev, { user_id: userId, permission: perm, granted: !current }]
    })
  }

  function getReadCount(userId: string) {
    return progress.filter((p) => p.user_id === userId).length
  }

  const students = users.filter((u) => u.role === 'student')
  const selectedUserData = users.find((u) => u.id === selectedUser)

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2rem] px-6 py-6 md:px-8">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px silver-divider opacity-60" />
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-[9px] uppercase tracking-[0.52em] text-white/22">Painel de Gestão</p>
            <h2 className="text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-white/94" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Administração <span className="metal-text">IPB</span>
            </h2>
          </div>
          <div className="flex gap-3">
            {[
              { label: 'Usuários', value: users.filter(u => u.role !== 'admin').length },
              { label: 'Alunos', value: students.length },
              { label: 'Equipe', value: users.filter(u => u.role === 'team').length },
            ].map(({ label, value }) => (
              <div key={label} className="chrome-subtle rounded-[1.1rem] px-4 py-3 text-center">
                <p className="text-[1.1rem] font-semibold text-white/86">{value}</p>
                <p className="text-[8px] uppercase tracking-[0.18em] text-white/28">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-[1.3rem] border border-white/[0.06] bg-black/20 p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[1rem] py-2.5 text-[10px] uppercase tracking-[0.18em] transition-all duration-200 ${
              activeTab === id ? 'bg-white/[0.08] text-white/88' : 'text-white/28 hover:text-white/52'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">

        {/* ── USUÁRIOS ── */}
        {activeTab === 'usuarios' && (
          <motion.div key="usuarios" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-[9px] uppercase tracking-[0.32em] text-white/28">Perfis cadastrados</p>
              <button onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-white/42 transition hover:border-white/18 hover:text-white/64"
              >
                <Plus className="h-3 w-3" /> Adicionar
              </button>
            </div>

            <AnimatePresence>
              {showAddForm && (
                <AddUserForm onClose={() => setShowAddForm(false)} onAdded={loadData} />
              )}
            </AnimatePresence>

            {loading ? (
              <div className="py-12 text-center text-[12px] text-white/28">Carregando...</div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="flex items-center gap-3 rounded-[1.3rem] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(6,6,8,0.04)_100%)] px-4 py-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[13px] font-semibold text-white/68">
                    {(user.name ?? user.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[13px] font-medium text-white/78">{user.name ?? '—'}</p>
                      <RoleBadge role={user.role} />
                    </div>
                    <p className="truncate text-[10px] text-white/30">{user.email}</p>
                  </div>

                  {/* Role selector */}
                  <div className="relative">
                    <button onClick={() => setRoleMenuOpen(roleMenuOpen === user.id ? null : user.id)}
                      className="flex items-center gap-1 rounded-[0.7rem] border border-white/[0.07] px-2.5 py-1.5 text-[9px] text-white/36 transition hover:border-white/14 hover:text-white/56"
                    >
                      {ROLE_LABELS[user.role]} <ChevronDown className="h-2.5 w-2.5" />
                    </button>
                    <AnimatePresence>
                      {roleMenuOpen === user.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -4 }}
                          transition={{ duration: 0.12 }}
                          className="absolute right-0 top-8 z-50 w-28 overflow-hidden rounded-[1rem] border border-white/[0.08] bg-[rgba(6,6,8,0.97)] shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
                        >
                          {(['student','team','admin'] as Role[]).map((r) => (
                            <button key={r} onClick={() => updateRole(user.id, r)}
                              className={`flex w-full items-center gap-2 px-3 py-2 text-[11px] transition hover:bg-white/[0.05] ${user.role === r ? 'text-white/72' : 'text-white/36'}`}
                            >
                              {user.role === r && <Check className="h-3 w-3" />}
                              {user.role !== r && <span className="w-3" />}
                              {ROLE_LABELS[r]}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button onClick={() => deleteUser(user.id)}
                    className="rounded-[0.7rem] p-1.5 text-white/18 transition hover:bg-red-500/10 hover:text-red-400/60"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* ── PERMISSÕES ── */}
        {activeTab === 'permissoes' && (
          <motion.div key="permissoes" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-4">
            {/* User selector */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {users.filter((u) => u.role !== 'admin').map((u) => (
                <button key={u.id} onClick={() => setSelectedUser(u.id)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] transition ${
                    selectedUser === u.id ? 'border-white/20 bg-white/[0.08] text-white/82' : 'border-white/[0.07] text-white/32 hover:text-white/52'
                  }`}
                >
                  {u.name ?? u.email.split('@')[0]}
                </button>
              ))}
            </div>

            {selectedUserData && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[11px] font-semibold text-white/62">
                    {(selectedUserData.name ?? selectedUserData.email).charAt(0).toUpperCase()}
                  </div>
                  <p className="text-[12px] text-white/52">{selectedUserData.name ?? selectedUserData.email}</p>
                  <RoleBadge role={selectedUserData.role} />
                </div>

                {/* Global permissions */}
                <div className="overflow-hidden rounded-[1.3rem] border border-white/[0.07]">
                  <div className="border-b border-white/[0.05] px-4 py-2.5">
                    <p className="text-[9px] uppercase tracking-[0.28em] text-white/28">Acesso às seções</p>
                  </div>
                  {GLOBAL_PERMISSIONS.map((perm) => {
                    const granted = hasPermission(selectedUser!, perm)
                    return (
                      <div key={perm} className="flex items-center justify-between border-b border-white/[0.04] px-4 py-3 last:border-0">
                        <div className="flex items-center gap-2.5">
                          {perm === 'intelligence' && <BookOpen className="h-3.5 w-3.5 text-white/36" />}
                          {perm === 'business' && <LayoutDashboard className="h-3.5 w-3.5 text-white/36" />}
                          {perm === 'tutor' && <Sparkles className="h-3.5 w-3.5 text-white/36" />}
                          <p className="text-[12px] text-white/62">{PERM_LABELS[perm]}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {granted ? <Unlock className="h-3 w-3 text-white/24" /> : <Lock className="h-3 w-3 text-white/24" />}
                          <Toggle value={granted} onChange={() => togglePermission(selectedUser!, perm)} />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Module permissions */}
                <div className="overflow-hidden rounded-[1.3rem] border border-white/[0.07]">
                  <div className="border-b border-white/[0.05] px-4 py-2.5">
                    <p className="text-[9px] uppercase tracking-[0.28em] text-white/28">Módulos Intelligence</p>
                  </div>
                  <div className="grid grid-cols-2 gap-0">
                    {MODULES.map((mod, i) => {
                      const granted = hasPermission(selectedUser!, `module_${mod}`)
                      return (
                        <div key={mod} className={`flex items-center justify-between border-white/[0.04] px-4 py-3 ${i % 2 === 0 ? 'border-r' : ''} ${i < MODULES.length - 2 ? 'border-b' : ''}`}>
                          <div>
                            <p className="text-[10px] font-semibold text-white/52">{mod}</p>
                            <p className="text-[9px] text-white/24 leading-tight">{MODULE_NAMES[mod].split(' ').slice(0, 2).join(' ')}</p>
                          </div>
                          <Toggle value={granted} onChange={() => togglePermission(selectedUser!, `module_${mod}`)} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {users.filter((u) => u.role !== 'admin').length === 0 && (
              <p className="py-8 text-center text-[12px] text-white/28">Nenhum aluno ou equipe cadastrado.</p>
            )}
          </motion.div>
        )}

        {/* ── PROGRESSO ── */}
        {activeTab === 'progresso' && (
          <motion.div key="progresso" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-3">
            <p className="px-1 text-[9px] uppercase tracking-[0.32em] text-white/28">Progresso por aluno</p>
            {students.length === 0 ? (
              <p className="py-8 text-center text-[12px] text-white/28">Nenhum aluno cadastrado ainda.</p>
            ) : (
              students.map((student) => {
                const readCount = getReadCount(student.id)
                const pct = Math.round((readCount / TOTAL_SUBMODULES) * 100)
                const moduleProgress = MODULES.map((mod) => {
                  const subCount = progress.filter((p) => p.user_id === student.id && p.submodule_id.startsWith(mod)).length
                  return { mod, subCount }
                })

                return (
                  <div key={student.id} className="overflow-hidden rounded-[1.3rem] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(6,6,8,0.03)_100%)]">
                    <div className="flex items-center gap-3 px-4 py-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[13px] font-semibold text-white/68">
                        {(student.name ?? student.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-[13px] font-medium text-white/72">{student.name ?? '—'}</p>
                        <p className="truncate text-[10px] text-white/28">{student.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] font-semibold text-white/72">{pct}%</p>
                        <p className="text-[9px] text-white/28">{readCount}/{TOTAL_SUBMODULES}</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="px-4 pb-3">
                      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                        <div className="h-full rounded-full bg-white/36 transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                      {/* Per-module mini bars */}
                      <div className="flex gap-1">
                        {moduleProgress.map(({ mod, subCount }) => (
                          <div key={mod} className="flex-1" title={`${mod}: ${subCount} lidos`}>
                            <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                              <div className="h-full rounded-full bg-white/24 transition-all duration-500" style={{ width: subCount > 0 ? '100%' : '0%' }} />
                            </div>
                            <p className="mt-0.5 text-center text-[7px] text-white/18">{mod}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </motion.div>
        )}

        {/* ── PLATAFORMA ── */}
        {activeTab === 'plataforma' && (
          <motion.div key="plataforma" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-4">
            <p className="px-1 text-[9px] uppercase tracking-[0.32em] text-white/28">Configurações da plataforma</p>

            <div className="space-y-2 rounded-[1.3rem] border border-white/[0.07] p-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[13px] text-white/68">Nome da plataforma</p>
                  <p className="text-[10px] text-white/28">Exibido na topbar e emails</p>
                </div>
                <p className="text-[12px] text-white/42">Intelligence Platform BUSINESS</p>
              </div>
              <div className="h-px bg-white/[0.05]" />
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[13px] text-white/68">Módulos ativos</p>
                  <p className="text-[10px] text-white/28">M1 ao M8</p>
                </div>
                <p className="text-[12px] font-semibold text-white/52">8</p>
              </div>
              <div className="h-px bg-white/[0.05]" />
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[13px] text-white/68">Tutor IA</p>
                  <p className="text-[10px] text-white/28">Groq · Llama 3.3 70B</p>
                </div>
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-white/36">Ativo</span>
              </div>
              <div className="h-px bg-white/[0.05]" />
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[13px] text-white/68">Banco de dados</p>
                  <p className="text-[10px] text-white/28">Supabase PostgreSQL</p>
                </div>
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-white/36">Conectado</span>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  )
}
