'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── types ─────────────────────────────────────────────── */

export interface WorkspaceProfile {
  type: 'pf' | 'pj' | 'unknown'
  subtype: string
  sector: string
  revenue: string
  product: string
}

interface Props {
  onComplete: (profile: WorkspaceProfile) => void
}

/* ── constants ─────────────────────────────────────────── */

const SECTORS = ['Tecnologia', 'Varejo', 'Agro', 'Saúde', 'Educação', 'Alimentação', 'Serviços', 'Outro']
const SECTOR_INSIGHTS: Record<string, string> = {
  Tecnologia: 'Setor de tecnologia está aquecido — heat 98/100. Bom momento para entrar.',
  Varejo: 'Varejo em transformação digital — heat 74/100. Oportunidades em e-commerce.',
  Agro: 'Agronegócio segue forte — heat 88/100. Alta demanda por inovação.',
  Saúde: 'Saúde digital em crescimento — heat 91/100. Tendência de healthtechs.',
  Educação: 'EdTech acelerando — heat 82/100. Mercado receptivo a novas soluções.',
  Alimentação: 'FoodTech em expansão — heat 77/100. Delivery e dark kitchens em alta.',
  Serviços: 'Serviços profissionais estáveis — heat 69/100. Diferenciação é chave.',
  Outro: 'Mercado diversificado — explore nichos com baixa concorrência.',
}

const MODULES = [
  { icon: '◈', name: 'Painel Financeiro' },
  { icon: '◉', name: 'Simulador de Cenários' },
  { icon: '▣', name: 'Market Intelligence' },
  { icon: '◆', name: 'Signal Feed' },
  { icon: '▲', name: 'Gestão Legal' },
  { icon: '●', name: 'Plano de Ação' },
]

/* ── slide transition ──────────────────────────────────── */

const slide = {
  enter: (d: number) => ({ x: d > 0 ? 280 : -280, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -280 : 280, opacity: 0 }),
}

/* ── reusable pieces ───────────────────────────────────── */

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-10 flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === current ? 'w-6 bg-white/70' : 'w-1.5 bg-white/20'
          }`}
        />
      ))}
    </div>
  )
}

function Card({
  title,
  subtitle,
  selected,
  onClick,
}: {
  title: string
  subtitle: string
  selected?: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full cursor-pointer rounded-[1.4rem] border px-6 py-5 text-left transition-colors duration-200 ${
        selected
          ? 'border-white/30 bg-white/[0.06]'
          : 'border-white/[0.08] bg-white/[0.02] hover:border-white/16 hover:bg-white/[0.04]'
      }`}
    >
      <p className="font-[Poppins,sans-serif] text-[15px] font-semibold text-white/90">{title}</p>
      <p className="mt-1 text-[13px] text-white/40">{subtitle}</p>
    </motion.button>
  )
}

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-[13px] transition-colors duration-150 ${
        selected
          ? 'border-white/30 bg-white/[0.08] text-white/90'
          : 'border-white/[0.08] text-white/40 hover:border-white/16 hover:text-white/60'
      }`}
    >
      {label}
    </button>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 text-center font-[Poppins,sans-serif] text-2xl font-bold tracking-tight text-white/90">
      {children}
    </h2>
  )
}

/* ── main component ────────────────────────────────────── */

export default function WorkspaceOnboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)

  const [profile, setProfile] = useState<WorkspaceProfile>({
    type: 'pf',
    subtype: '',
    sector: '',
    revenue: '',
    product: '',
  })

  // helper for "não sei" path
  const [sells, setSells] = useState<boolean | null>(null)
  const [hasCnpj, setHasCnpj] = useState<boolean | null>(null)

  const go = (next: number) => {
    setDir(next > step ? 1 : -1)
    setStep(next)
  }

  const patch = (partial: Partial<WorkspaceProfile>) =>
    setProfile((p) => ({ ...p, ...partial }))

  /* ── step renderers ────────────────────────────────── */

  const renderStep1 = () => (
    <div className="flex flex-col gap-4">
      <Title>Quem é você?</Title>
      <Card
        title="Pessoa Física"
        subtitle="Autônomo, freelancer, iniciante"
        onClick={() => { patch({ type: 'pf' }); go(1) }}
      />
      <Card
        title="Pessoa Jurídica"
        subtitle="MEI, SLU, LTDA, startup, associação"
        onClick={() => { patch({ type: 'pj' }); go(1) }}
      />
      <Card
        title="Não sei por onde começar"
        subtitle="Me ajude a entender"
        onClick={() => { patch({ type: 'unknown' }); go(1) }}
      />
    </div>
  )

  const renderStep2PF = () => {
    const phases = [
      { id: 'validacao', title: 'Validação', sub: 'Testando uma ideia, sem CNPJ' },
      { id: 'mei', title: 'MEI', sub: 'Faturamento até R$81k/ano' },
      { id: 'slu', title: 'SLU', sub: 'Empresa individual, Simples Nacional' },
      { id: 'ltda', title: 'LTDA', sub: 'Sociedade com sócios' },
    ]
    const activities = ['E-commerce', 'Freelancer', 'App/SaaS', 'Conteúdo', 'Serviços', 'Outro']

    return (
      <div className="flex flex-col gap-4">
        <Title>Qual sua fase?</Title>
        {phases.map((p) => (
          <Card
            key={p.id}
            title={p.title}
            subtitle={p.sub}
            selected={profile.subtype === p.id}
            onClick={() => patch({ subtype: p.id })}
          />
        ))}

        <p className="mt-4 text-center text-[13px] text-white/40">O que você faz?</p>
        <div className="flex flex-wrap justify-center gap-2">
          {activities.map((a) => (
            <Chip
              key={a}
              label={a}
              selected={profile.product === a}
              onClick={() => patch({ product: a })}
            />
          ))}
        </div>

        {profile.subtype && profile.product && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => go(2)}
            className="mx-auto mt-4 rounded-full border border-white/20 bg-white/[0.06] px-8 py-2.5 text-[14px] font-medium text-white/80 transition-colors hover:bg-white/[0.10]"
          >
            Continuar
          </motion.button>
        )}
      </div>
    )
  }

  const renderStep2PJ = () => {
    const types = ['MEI', 'SLU', 'LTDA', 'Startup', 'Associação', 'Fundação']
    const revenues = ['Até R$81k', 'R$81k–360k', 'R$360k–4.8M', 'Acima R$4.8M']
    const products = ['Digital/SaaS', 'Físico', 'Marketplace', 'Serviço']

    return (
      <div className="flex flex-col gap-5">
        <Title>Detalhes da empresa</Title>

        <div>
          <p className="mb-2 text-[12px] uppercase tracking-widest text-white/30">Tipo</p>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <Chip key={t} label={t} selected={profile.subtype === t.toLowerCase()} onClick={() => patch({ subtype: t.toLowerCase() })} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[12px] uppercase tracking-widest text-white/30">Setor</p>
          <div className="flex flex-wrap gap-2">
            {SECTORS.map((s) => (
              <Chip key={s} label={s} selected={profile.sector === s} onClick={() => patch({ sector: s })} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[12px] uppercase tracking-widest text-white/30">Faturamento</p>
          <div className="flex flex-wrap gap-2">
            {revenues.map((r) => (
              <Chip key={r} label={r} selected={profile.revenue === r} onClick={() => patch({ revenue: r })} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[12px] uppercase tracking-widest text-white/30">Produto</p>
          <div className="flex flex-wrap gap-2">
            {products.map((p) => (
              <Chip key={p} label={p} selected={profile.product === p} onClick={() => patch({ product: p })} />
            ))}
          </div>
        </div>

        {profile.subtype && profile.sector && profile.revenue && profile.product && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => go(2)}
            className="mx-auto mt-2 rounded-full border border-white/20 bg-white/[0.06] px-8 py-2.5 text-[14px] font-medium text-white/80 transition-colors hover:bg-white/[0.10]"
          >
            Continuar
          </motion.button>
        )}
      </div>
    )
  }

  const renderStep2Unknown = () => {
    const recommend = () => {
      if (sells && hasCnpj) return { text: 'Recomendamos organizar como MEI ou SLU, dependendo do faturamento.', sub: 'mei' }
      if (sells && !hasCnpj) return { text: 'Você já vende — hora de formalizar como MEI para crescer com segurança.', sub: 'mei' }
      if (!sells && hasCnpj) return { text: 'Tem CNPJ mas ainda não vende? Foque em validação e primeiros clientes.', sub: 'validacao' }
      return { text: 'Recomendamos começar com validação — teste sua ideia antes de formalizar.', sub: 'validacao' }
    }

    const rec = sells !== null && hasCnpj !== null ? recommend() : null

    return (
      <div className="flex flex-col gap-6">
        <Title>Vamos descobrir juntos</Title>

        <div>
          <p className="mb-3 text-[14px] text-white/60">Você já vende algo?</p>
          <div className="flex gap-3">
            <Chip label="Sim" selected={sells === true} onClick={() => setSells(true)} />
            <Chip label="Não" selected={sells === false} onClick={() => setSells(false)} />
          </div>
        </div>

        <div>
          <p className="mb-3 text-[14px] text-white/60">Tem CNPJ?</p>
          <div className="flex gap-3">
            <Chip label="Sim" selected={hasCnpj === true} onClick={() => setHasCnpj(true)} />
            <Chip label="Não" selected={hasCnpj === false} onClick={() => setHasCnpj(false)} />
          </div>
        </div>

        {rec && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.4rem] border border-white/[0.08] bg-white/[0.03] px-5 py-4"
          >
            <p className="text-[12px] uppercase tracking-widest text-white/30">Recomendação IA</p>
            <p className="mt-2 text-[14px] leading-relaxed text-white/70">{rec.text}</p>
          </motion.div>
        )}

        {rec && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => {
              patch({ subtype: rec.sub, type: sells && hasCnpj ? 'pj' : 'pf' })
              go(2)
            }}
            className="mx-auto rounded-full border border-white/20 bg-white/[0.06] px-8 py-2.5 text-[14px] font-medium text-white/80 transition-colors hover:bg-white/[0.10]"
          >
            Continuar
          </motion.button>
        )}
      </div>
    )
  }

  const renderStep3 = () => {
    const needsSector = !profile.sector
    const insight = SECTOR_INSIGHTS[profile.sector] || ''

    return (
      <div className="flex flex-col gap-5">
        <Title>Seu setor</Title>

        {needsSector && (
          <div className="flex flex-wrap justify-center gap-2">
            {SECTORS.map((s) => (
              <Chip key={s} label={s} selected={profile.sector === s} onClick={() => patch({ sector: s })} />
            ))}
          </div>
        )}

        {profile.sector && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.4rem] border border-white/[0.08] bg-white/[0.03] px-5 py-4"
          >
            <p className="text-[12px] uppercase tracking-widest text-white/30">Market Insight</p>
            <p className="mt-2 font-mono text-[13px] leading-relaxed text-white/60">{insight}</p>
          </motion.div>
        )}

        {profile.sector && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => go(3)}
            className="mx-auto mt-2 rounded-full border border-white/20 bg-white/[0.06] px-8 py-2.5 text-[14px] font-medium text-white/80 transition-colors hover:bg-white/[0.10]"
          >
            Continuar
          </motion.button>
        )}
      </div>
    )
  }

  const renderStep4 = () => {
    const typeLabel = profile.type === 'pf' ? 'Pessoa Física' : profile.type === 'pj' ? 'Pessoa Jurídica' : 'Iniciante'
    const subtypeLabel = profile.subtype.charAt(0).toUpperCase() + profile.subtype.slice(1)

    return (
      <div className="flex flex-col gap-5">
        <Title>Workspace pronto</Title>

        <div className="rounded-[1.4rem] border border-white/[0.08] bg-white/[0.03] px-6 py-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] uppercase tracking-widest text-white/30">Tipo</span>
              <span className="font-mono text-[13px] text-white/70">{typeLabel} — {subtypeLabel}</span>
            </div>
            <div className="h-px bg-white/[0.06]" />
            <div className="flex items-center justify-between">
              <span className="text-[12px] uppercase tracking-widest text-white/30">Setor</span>
              <span className="font-mono text-[13px] text-white/70">{profile.sector}</span>
            </div>
            {profile.revenue && (
              <>
                <div className="h-px bg-white/[0.06]" />
                <div className="flex items-center justify-between">
                  <span className="text-[12px] uppercase tracking-widest text-white/30">Faturamento</span>
                  <span className="font-mono text-[13px] text-white/70">{profile.revenue}</span>
                </div>
              </>
            )}
            {profile.product && (
              <>
                <div className="h-px bg-white/[0.06]" />
                <div className="flex items-center justify-between">
                  <span className="text-[12px] uppercase tracking-widest text-white/30">Produto</span>
                  <span className="font-mono text-[13px] text-white/70">{profile.product}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-white/[0.08] bg-white/[0.03] px-6 py-5">
          <p className="mb-3 text-[12px] uppercase tracking-widest text-white/30">Módulos habilitados</p>
          <div className="grid grid-cols-2 gap-2">
            {MODULES.map((m) => (
              <div key={m.name} className="flex items-center gap-2.5 rounded-xl bg-white/[0.03] px-3 py-2">
                <span className="text-[14px] text-white/50">{m.icon}</span>
                <span className="text-[12px] text-white/60">{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onComplete(profile)}
          className="mx-auto mt-2 rounded-full border border-white/30 bg-white/[0.08] px-10 py-3 text-[15px] font-semibold text-white/90 transition-colors hover:bg-white/[0.14]"
        >
          Abrir Workspace
        </motion.button>
      </div>
    )
  }

  /* ── step routing ──────────────────────────────────── */

  const renderCurrentStep = () => {
    if (step === 0) return renderStep1()
    if (step === 1) {
      if (profile.type === 'pf') return renderStep2PF()
      if (profile.type === 'pj') return renderStep2PJ()
      return renderStep2Unknown()
    }
    if (step === 2) return renderStep3()
    return renderStep4()
  }

  /* ── render ────────────────────────────────────────── */

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <StepDots current={step} total={4} />

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step + '-' + profile.type}
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>

        {step > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => go(step - 1)}
            className="mx-auto mt-8 block text-[12px] text-white/25 transition-colors hover:text-white/50"
          >
            Voltar
          </motion.button>
        )}
      </div>
    </div>
  )
}
