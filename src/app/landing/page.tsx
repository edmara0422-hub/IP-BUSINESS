'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const fade = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
}

const stagger = (i: number) => ({
  ...fade,
  transition: { ...fade.transition, delay: i * 0.12 },
})

function Divider() {
  return <div className="mx-auto h-px w-full max-w-5xl silver-divider opacity-40" />
}

function CTAButton() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center justify-center gap-2 rounded-[1rem] border border-white/12 bg-white/[0.06] px-10 py-3.5 text-[11px] uppercase tracking-[0.24em] text-white/72 backdrop-blur transition hover:bg-white/[0.1] hover:text-white/90"
    >
      Entrar no IPB
      <span className="inline-block transition group-hover:translate-x-0.5">&#8594;</span>
    </Link>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-center text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-white/90 sm:text-[2rem]"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      {children}
    </h2>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[1.4rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-7 ${className}`}>
      {children}
    </div>
  )
}

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-[#050507] text-white selection:bg-white/20 overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4">
        {/* BG */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.12),transparent_22%)]" />
          <div className="absolute left-1/2 top-0 h-[36rem] w-[min(80rem,100vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(214,220,228,0.10)_0%,transparent_70%)] blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <p className="text-[9px] uppercase tracking-[0.52em] text-white/22">Intelligence Platform</p>
          <h1
            className="mt-4 text-[5rem] font-semibold leading-none tracking-[-0.04em] text-white/94 sm:text-[7rem]"
            style={{
              fontFamily: 'Poppins, sans-serif',
              textShadow: '0 0 80px rgba(255,255,255,0.12), 0 0 32px rgba(255,255,255,0.06)',
            }}
          >
            IPB
          </h1>
          <p className="mt-4 text-[13px] tracking-wide text-white/44 sm:text-[15px]">
            Inteligencia de mercado em tempo real
          </p>
          <p
            className="mt-3 max-w-md text-[11px] tracking-wide text-white/28 sm:text-[12px]"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            Dados reais. IA que cruza. Acao que transforma.
          </p>
          <div className="mt-10">
            <CTAButton />
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="h-8 w-px bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </section>

      <Divider />

      {/* ── O PROBLEMA ── */}
      <section className="mx-auto min-h-[80vh] flex flex-col items-center justify-center max-w-5xl px-4 py-24">
        <motion.div {...fade}>
          <SectionTitle>Voce toma decisoes no escuro?</SectionTitle>
        </motion.div>
        <div className="mt-14 grid w-full gap-4 sm:grid-cols-3">
          {[
            { stat: 'R$50-200k', text: 'Consultorias cobram isso para analise de mercado' },
            { stat: '0 cruzamento', text: 'Planilhas nao cruzam dados macro com seu negocio' },
            { stat: 'SELIC / Cambio', text: 'Noticias nao dizem como afetam SUA margem' },
          ].map((item, i) => (
            <motion.div key={i} {...stagger(i)}>
              <Card className="h-full">
                <p
                  className="text-[13px] font-medium text-white/60"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {item.stat}
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-white/36">{item.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── A SOLUCAO ── */}
      <section className="mx-auto min-h-[80vh] flex flex-col items-center justify-center max-w-5xl px-4 py-24">
        <motion.div {...fade}>
          <SectionTitle>O IPB cruza tudo em tempo real</SectionTitle>
        </motion.div>

        <div className="mt-14 grid w-full gap-4 sm:grid-cols-3">
          {[
            { label: 'Dados reais', sub: 'BCB, IBGE, Yahoo Finance' },
            { label: 'IA analisa e cruza', sub: 'Groq / Llama' },
            { label: 'Acao para seu negocio', sub: 'Workspace' },
          ].map((step, i) => (
            <motion.div key={i} {...stagger(i)} className="flex flex-col items-center text-center">
              <Card className="w-full">
                <p
                  className="text-[11px] uppercase tracking-[0.2em] text-white/50"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="mt-3 text-[15px] font-medium text-white/80" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {step.label}
                </p>
                <p className="mt-2 text-[12px] text-white/32">{step.sub}</p>
              </Card>
              {i < 2 && (
                <div className="hidden h-px w-8 bg-white/10 sm:block sm:absolute sm:right-0 sm:top-1/2" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.p {...fade} className="mt-10 text-center text-[12px] text-white/28">
          De PF iniciante a LTDA estabelecida — o app cresce com voce
        </motion.p>
      </section>

      <Divider />

      {/* ── O QUE O IPB FAZ ── */}
      <section className="mx-auto min-h-screen flex flex-col items-center justify-center max-w-5xl px-4 py-24">
        <motion.div {...fade}>
          <SectionTitle>Tres camadas de inteligencia</SectionTitle>
        </motion.div>

        <div className="mt-14 grid w-full gap-5 sm:grid-cols-3">
          {[
            {
              title: 'BUSINESS',
              subtitle: 'O mercado em tempo real',
              bullets: [
                'Panorama global com dados ao vivo',
                'Macro: como a economia afeta seu negocio',
                'Marketing: quanto custa crescer',
                'Riscos: o que pode quebrar — e como lucrar',
              ],
            },
            {
              title: 'INTELLIGENCE',
              subtitle: 'Conhecimento estruturado',
              bullets: [
                '8 modulos do BI em Negocios (PUCPR)',
                'Simulacoes praticas com IA',
                'Conteudo que conecta teoria ao mercado real',
              ],
            },
            {
              title: 'WORKSPACE',
              subtitle: 'Seu espaco de trabalho',
              bullets: [
                'Cockpit financeiro conectado ao mercado',
                'Cenarios com dados macro reais',
                'Smart Pricing, ESG, Inovacao',
                'IA Advisor que cruza tudo',
              ],
            },
          ].map((card, i) => (
            <motion.div key={i} {...stagger(i)}>
              <Card className="h-full">
                <p
                  className="text-[11px] uppercase tracking-[0.28em] text-white/50"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {card.title}
                </p>
                <p className="mt-2 text-[14px] font-medium text-white/72" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {card.subtitle}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {card.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-[12px] leading-relaxed text-white/36">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/20" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── PARA QUEM ── */}
      <section className="mx-auto min-h-[80vh] flex flex-col items-center justify-center max-w-5xl px-4 py-24">
        <motion.div {...fade}>
          <SectionTitle>De onde voce esta ate onde quer chegar</SectionTitle>
        </motion.div>

        <motion.div {...fade} className="mt-14 w-full">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-0">
            {['Iniciante', 'MEI', 'SLU', 'LTDA', 'Empresa'].map((stage, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03]">
                    <span
                      className="text-[10px] uppercase tracking-widest text-white/50"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] text-white/44">{stage}</p>
                </div>
                {i < 4 && (
                  <div className="mx-4 hidden h-px w-10 bg-gradient-to-r from-white/12 to-white/4 sm:block" />
                )}
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-[12px] text-white/28">O IPB se adapta ao seu momento</p>
        </motion.div>
      </section>

      <Divider />

      {/* ── DIFERENCIAL ── */}
      <section className="mx-auto min-h-[80vh] flex flex-col items-center justify-center max-w-5xl px-4 py-24">
        <motion.div {...fade}>
          <SectionTitle>Por que o IPB?</SectionTitle>
        </motion.div>

        <div className="mt-14 grid w-full gap-4 sm:grid-cols-2">
          {[
            { title: 'Dados reais', desc: 'BCB, IBGE, Yahoo Finance. Nao e mock.' },
            { title: 'IA que cruza', desc: 'Nao e caixa decorativa. IA esta nos dados.' },
            { title: 'Base academica', desc: 'Motor logico do BI em Negocios (PUCPR).' },
            { title: 'Custo zero de IA', desc: 'Groq / Llama. Performance sem custo.' },
          ].map((item, i) => (
            <motion.div key={i} {...stagger(i)}>
              <Card>
                <p className="text-[13px] font-medium text-white/72" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {item.title}
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-white/32">{item.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── CTA FINAL ── */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 py-24 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_110%,rgba(255,255,255,0.06),transparent_40%)]" />

        <motion.div {...fade} className="relative z-10 flex flex-col items-center">
          <h2
            className="max-w-lg text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-white/90 sm:text-[2rem]"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Inteligencia de mercado ao seu alcance
          </h2>
          <p className="mt-4 text-[13px] text-white/36">
            Decisao mais rapida. Mais precisa. Com menos custo.
          </p>
          <div className="mt-10">
            <CTAButton />
          </div>
        </motion.div>

        <p className="absolute bottom-8 text-[10px] text-white/18">
          Intelligence Platform BUSINESS &copy; 2026
        </p>
      </section>
    </main>
  )
}
