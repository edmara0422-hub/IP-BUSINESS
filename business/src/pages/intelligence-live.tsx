'use client'

import Head from 'next/head'
import { useState } from 'react'

type IntelligenceModule = {
  id: string
  title: string
  overview: string
  theory: string[]
}

const MODULES: IntelligenceModule[] = [
  {
    id: 'M1',
    title: 'Inovacao e Criatividade',
    overview:
      'Este modulo organiza a base de inovacao, criatividade e sustentabilidade para transformar ideias em estruturas de negocio viaveis.',
    theory: ['Gestao da Inovacao', 'Ferramentas Digitais', 'Pensamento Criativo', 'Sustentabilidade em Negocios'],
  },
  {
    id: 'M2',
    title: 'Fundamentos de Gestao',
    overview:
      'Aqui entram os fundamentos de gestao, leitura contabil e matematica financeira que sustentam qualquer operacao empresarial.',
    theory: ['Gestao de Negocios', 'Demonstracoes Contabeis', 'Matematica Financeira'],
  },
  {
    id: 'M3',
    title: 'Mercado e Pessoas',
    overview:
      'Este modulo aborda mercado, comportamento de escolha, dinamica competitiva e leitura de pessoas dentro da operacao.',
    theory: ['Economia de Empresa', 'Analise Mercadologica', 'Lideranca e Gestao de Equipes'],
  },
  {
    id: 'M4',
    title: 'Logica e Humanidades',
    overview:
      'O modulo conecta raciocinio logico, estatistica e filosofia para dar base de criterio, modelagem e leitura de risco.',
    theory: ['Filosofia', 'Calculo Aplicado a Negocios', 'Analise Estatistica'],
  },
  {
    id: 'M5',
    title: 'Empreendedorismo e Estrategia',
    overview:
      'A base aqui e estrategica: narrativa, empreendedorismo e leitura do ambiente macro para decidir crescimento e posicionamento.',
    theory: ['Leitura e Escrita Academica', 'Empreendedorismo e Inovacao', 'Ambiente Macroeconomico'],
  },
  {
    id: 'M6',
    title: 'Financas Avancadas',
    overview:
      'Este modulo foca leitura financeira avancada, construcao de preco e criterio etico para sustentar lucro sem perder coerencia.',
    theory: ['Analise Financeira', 'Precificacao', 'Etica'],
  },
  {
    id: 'M7',
    title: 'Intervencao e Sociedade',
    overview:
      'Aqui o estudo desloca o negocio para impacto real, intervencao estruturada e responsabilidade social aplicada.',
    theory: ['Empreendedorismo Social', 'Teologia e Sociedade', 'Projeto de Intervencao em Negocios'],
  },
  {
    id: 'M8',
    title: 'Pesquisa e Identidade',
    overview:
      'Este modulo organiza identidade, pesquisa e leitura de dados para validar decisao, comportamento e proposta de valor.',
    theory: ['Educacao, Identidade e Solidariedade', 'Pesquisa Aplicada a Negocios'],
  },
]

export default function IntelligenceLivePage() {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
  const activeModule = MODULES.find((module) => module.id === activeModuleId) ?? null

  return (
    <>
      <Head>
        <title>IPB Intelligence Live</title>
        <meta
          name="description"
          content="Source-backed live route for the Intelligence module."
        />
      </Head>

      <main className="min-h-screen bg-ocean-900 px-4 py-10 text-white md:px-8">
        <section className="mx-auto max-w-7xl space-y-6">
          <div className="chrome-board rounded-[2rem] p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/38">INTELLIGENCE</p>
            <h1 className="mt-3 text-3xl font-semibold text-white/92 md:text-4xl">
              Intelligence study system
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/64 md:text-base">
              Entrada leve da Intelligence para abrir os modulos sem depender da camada mais
              pesada do app enquanto a compilacao completa do restante continua sendo ajustada.
            </p>
          </div>

          <div className="chrome-panel rounded-[1.75rem] p-5 md:p-6">
            <p className="text-sm font-semibold text-white/84">
              Clique em M1, M2, M3... para abrir o modulo.
            </p>

            <div className="mt-5 grid grid-cols-4 gap-3 md:grid-cols-8">
              {MODULES.map((module) => {
                const active = module.id === activeModuleId

                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveModuleId((current) => (current === module.id ? null : module.id))}
                    className={`rounded-full border px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? 'border-white/24 bg-white text-black'
                        : 'border-white/12 bg-white/6 text-white/72 hover:text-white'
                    }`}
                  >
                    {module.id}
                  </button>
                )
              })}
            </div>
          </div>

          {activeModule ? (
            <div className="chrome-board rounded-[2rem] p-6 md:p-8">
              <div className="mb-6">
                <div className="mb-3 inline-flex rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/52">
                  {activeModule.id}
                </div>
                <h2 className="text-2xl font-semibold text-white/92">{activeModule.title}</h2>
                <p className="mt-3 max-w-4xl text-sm leading-relaxed text-white/64 md:text-base">
                  {activeModule.overview}
                </p>
              </div>

              <div className="chrome-panel rounded-[1.55rem] p-5 md:p-6">
                <div className="mb-5 flex items-start gap-4">
                  <div className="chrome-subtle flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] text-white/84">
                    L
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/34">
                      O que estudar (Teoria)
                    </p>
                    <h3 className="text-sm font-semibold text-white/88">Base teorica do modulo</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/64">
                      {activeModule.overview}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {activeModule.theory.map((item) => (
                    <div
                      key={`${activeModule.id}-${item}`}
                      className="chrome-subtle rounded-[1.05rem] px-4 py-3"
                    >
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/32">
                        {activeModule.id}
                      </p>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-white/78">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="chrome-panel rounded-[1.8rem] p-8 text-center">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/34">
                Intelligence pronta
              </p>
              <h2 className="mt-3 text-lg font-semibold text-white/86">
                Selecione um modulo no trilho para abrir a pagina de estudo.
              </h2>
            </div>
          )}
        </section>
      </main>
    </>
  )
}
