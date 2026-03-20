(() => {
  let selectedModuleId = null

  const MODULE_THEORY = {
    M1: {
      title: 'Inovacao e Criatividade',
      overview:
        'Este modulo organiza a base de inovacao, criatividade e sustentabilidade para transformar ideias em estruturas de negocio viaveis.',
      theory: [
        'Gestao da Inovacao',
        'Ferramentas Digitais',
        'Pensamento Criativo',
        'Sustentabilidade em Negocios',
      ],
    },
    M2: {
      title: 'Fundamentos de Gestao',
      overview:
        'Aqui entram os fundamentos de gestao, leitura contabil e matematica financeira que sustentam qualquer operacao empresarial.',
      theory: ['Gestao de Negocios', 'Demonstracoes Contabeis', 'Matematica Financeira'],
    },
    M3: {
      title: 'Mercado e Pessoas',
      overview:
        'Este modulo aborda mercado, comportamento de escolha, dinamica competitiva e leitura de pessoas dentro da operacao.',
      theory: ['Economia de Empresa', 'Analise Mercadologica', 'Lideranca e Gestao de Equipes'],
    },
    M4: {
      title: 'Logica e Humanidades',
      overview:
        'O modulo conecta raciocinio logico, estatistica e filosofia para dar base de criterio, modelagem e leitura de risco.',
      theory: ['Filosofia', 'Calculo Aplicado a Negocios', 'Analise Estatistica'],
    },
    M5: {
      title: 'Empreendedorismo e Estrategia',
      overview:
        'A base aqui e estrategica: narrativa, empreendedorismo e leitura do ambiente macro para decidir crescimento e posicionamento.',
      theory: ['Leitura e Escrita Academica', 'Empreendedorismo e Inovacao', 'Ambiente Macroeconomico'],
    },
    M6: {
      title: 'Financas Avancadas',
      overview:
        'Este modulo foca leitura financeira avancada, construcao de preco e criterio etico para sustentar lucro sem perder coerencia.',
      theory: ['Analise Financeira', 'Precificacao', 'Etica'],
    },
    M7: {
      title: 'Intervencao e Sociedade',
      overview:
        'Aqui o estudo desloca o negocio para impacto real, intervencao estruturada e responsabilidade social aplicada.',
      theory: ['Empreendedorismo Social', 'Teologia e Sociedade', 'Projeto de Intervencao em Negocios'],
    },
    M8: {
      title: 'Pesquisa e Identidade',
      overview:
        'Este modulo organiza identidade, pesquisa e leitura de dados para validar decisao, comportamento e proposta de valor.',
      theory: ['Educacao, Identidade e Solidariedade', 'Pesquisa Aplicada a Negocios'],
    },
  }

  const TEXTS_TO_REMOVE = [
    'Sync do modulo',
    'Marcar como lido',
    'Intelligence de Estudo',
    'Ferramenta 6D Construida',
    'Fluxo sincronizado',
    'Recursos tecnicos da aba',
    'Relatorio de performance',
    'Biblioteca ativa em contexto',
    'Resultado 1',
    'Resultado 2',
    'Resultado 3',
    'Modulo dominante',
    'Lacuna a equilibrar',
    'Proxima entrega 6D',
    'Biblioteca ativa',
    'Tutor IA',
    'Highlight & Sync',
    'Trilha sincronizada',
  ]

  const removeElementForText = (element, text) => {
    if (text === 'Marcar como lido') {
      element.closest('button')?.remove()
      return
    }

    if (text === 'Sync do modulo') {
      ;(
        element.closest('.chrome-subtle') ||
        element.closest('.chrome-panel') ||
        element.parentElement ||
        element
      )?.remove()
      return
    }

    ;(
      element.closest('.chrome-panel') ||
      element.closest('.chrome-subtle') ||
      element.parentElement ||
      element
    )?.remove()
  }

  const cleanup = () => {
    document.querySelectorAll('*').forEach((element) => {
      const text = (element.textContent || '').trim()
      if (!text) return

      if (TEXTS_TO_REMOVE.includes(text)) {
        removeElementForText(element, text)
        return
      }

      if (/^\d+% pronto$/.test(text)) {
        ;(
          element.closest('.chrome-subtle') ||
          element.closest('.chrome-panel') ||
          element.parentElement ||
          element
        )?.remove()
      }
    })
  }

  const findStudyBoard = () => {
    const title = Array.from(document.querySelectorAll('p')).find(
      (element) => (element.textContent || '').trim() === 'Intelligence study system',
    )

    return title?.closest('.chrome-board') || null
  }

  const renderInjectedModuleDetail = () => {
    const board = findStudyBoard()
    if (!board) return

    const root = board.parentElement
    if (!root) return

    const existingHost = root.querySelector('#ipb-intelligence-module-detail-host')

    Array.from(root.children).forEach((child) => {
      if (child === board || child === existingHost) return
      child.style.display = selectedModuleId ? 'none' : ''
    })

    if (!selectedModuleId) {
      existingHost?.remove()
      return
    }

    const module = MODULE_THEORY[selectedModuleId]
    if (!module) return

    const host = existingHost || document.createElement('div')
    host.id = 'ipb-intelligence-module-detail-host'
    host.className = 'space-y-5'

    host.innerHTML = `
      <div class="chrome-panel rounded-[1.8rem] p-5">
        <div class="chrome-board rounded-[1.7rem] p-5">
          <div class="mb-5 flex items-start gap-4">
            <div class="chrome-subtle flex h-14 w-14 items-center justify-center rounded-[1.2rem]">
              <span class="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/78">${selectedModuleId}</span>
            </div>
            <div>
              <div class="mb-2 flex flex-wrap items-center gap-2">
                <span class="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/52">
                  ${selectedModuleId}
                </span>
              </div>
              <h3 class="text-[1.55rem] font-semibold text-white/94">${module.title}</h3>
              <p class="mt-3 max-w-3xl text-sm leading-relaxed text-white/62">${module.overview}</p>
            </div>
          </div>

          <div class="chrome-panel rounded-[1.55rem] p-5 md:p-6">
            <div class="mb-5 flex items-start gap-4">
              <div class="chrome-subtle flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white/84" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-[10px] uppercase tracking-[0.24em] text-white/34">O que estudar (Teoria)</p>
                <h4 class="text-sm font-semibold text-white/88">Base teorica do modulo</h4>
              </div>
            </div>

            <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              ${module.theory
                .map(
                  (item) => `
                    <div class="chrome-subtle rounded-[1.05rem] px-4 py-3">
                      <p class="text-[10px] uppercase tracking-[0.18em] text-white/32">${selectedModuleId}</p>
                      <p class="mt-1 text-sm font-medium leading-relaxed text-white/78">${item}</p>
                    </div>
                  `,
                )
                .join('')}
            </div>
          </div>
        </div>
      </div>
    `

    if (!existingHost) {
      board.insertAdjacentElement('afterend', host)
    }
  }

  const wireModuleSelection = () => {
    if (document.documentElement.dataset.ipbModuleRailWired === 'true') return

    document.addEventListener('click', (event) => {
      const button = event.target.closest('button')
      if (!button) return

      const label = (button.textContent || '').replace(/\s+/g, '').trim()
      if (!MODULE_THEORY[label]) return

      selectedModuleId = selectedModuleId === label ? null : label
      setTimeout(run, 60)
    })

    document.documentElement.dataset.ipbModuleRailWired = 'true'
  }

  const run = () =>
    window.requestAnimationFrame(() => {
      wireModuleSelection()
      cleanup()
      renderInjectedModuleDetail()
    })

  const observer = new MutationObserver(run)
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })

  window.addEventListener('load', run)
  setTimeout(run, 100)
  setTimeout(run, 400)
  setTimeout(run, 900)
  setInterval(run, 1500)
})()
