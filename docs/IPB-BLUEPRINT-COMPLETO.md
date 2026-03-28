# IPB — Intelligence Platform Business
## Blueprint Completo v3 — 28/03/2026

---

## 1. PERGUNTA CENTRAL

**POR QUE O IPB EXISTE?**

Nenhuma plataforma no Brasil pega dados macroeconômicos reais (BCB, IBGE, Yahoo Finance), cruza com os dados do negócio do usuário (receita, margem, CAC, setor), usa IA para traduzir o que significa pra AQUELA pessoa/empresa, e entrega a ação — não só o diagnóstico.

Consultorias cobram R$50-200k pra fazer isso manualmente. O IPB automatiza com IA grátis (Groq/Llama).

**Valor:** Inteligência de mercado em tempo real + workspace de gestão + IA que cruza tudo = decisão mais rápida, mais precisa, com menos custo.

**Vantagem competitiva:** Motor lógico acadêmico (PUCPR BI Negócios) + dados reais + IA grátis + acessível por design + de PF iniciante a LTDA estabelecida, o app cresce com o usuário.

---

## 2. QUEM COMPRA O IPB

### Pessoa Física (PF)
| Perfil | O que busca | O que o IPB entrega |
|--------|-------------|---------------------|
| Iniciante | "Não sei por onde começar" | Onboarding guiado: PF → MEI → SLU → LTDA |
| Freelancer/Autônomo | Estruturar finanças, precificar | Cockpit + Smart Pricing + cenários |
| E-commerce PF | Validar produto, entender mercado | Dados de mercado + CAC/LTV + precificação |

**Fases de crescimento PF:**
- **Validação (CPF):** até R$2.259/mês (isenção IR). App é o laboratório.
- **MEI:** até R$81k/ano (R$6.750/mês). Primeiro CNPJ. Custo fixo ~R$75/mês.
- **SLU:** R$81k a R$4.8M. Proteção patrimonial. Simples Nacional 6%.
- **LTDA:** quando entra sócio. Escala e investimento externo.

### Pessoa Jurídica (PJ)
| Tipo | Faturamento | O que o IPB entrega |
|------|-------------|---------------------|
| MEI | até R$81k/ano | Cockpit simplificado, pricing básico |
| EI / SLU | até R$4.8M | Módulos completos + IA |
| LTDA | até R$4.8M (Simples) | Tudo + gestão de equipes |
| Startup | variável | Cenários, runway, TAM/CAC/LTV, pitch |
| Associação/Fundação | variável | ESG, compliance, impacto social |
| Empresa estabelecida | variável | Big Data, benchmark, cenários avançados |

### Tipo de Produto
| Tipo | Margem | Tributação (Simples) | O que muda no IPB |
|------|--------|---------------------|-------------------|
| Físico (e-commerce) | Menor (estoque + frete) | 4% (Anexo I) | Logística, estoque, pricing com frete |
| Digital (SaaS/App) | Alta (sem fabricação) | 6% (Anexo III) | Unit economics, MRR, churn, LTV |
| Marketplace | Intermediária | Variável | GMV, take rate, sellers |

---

## 3. ESTRUTURA DO APP — 3 ABAS

### 3.1 [ BUSINESS ] — público, todos veem ✅ IMPLEMENTADO

Terminal de mercado ao vivo. IA cruza dados nativamente.

#### Panorama — "Como está o mercado agora?" ✅
- Globo 3D + HUD (SELIC, IPCA, PIB, USD/BRL) + commodities
- News conectadas aos dados — cada notícia mostra impacto no mercado (badge indicador + frase)
- 10 padrões de conexão: SELIC, IPCA, USD, PIB, petróleo, ouro, tech, varejo, agro, mercado
- Dados reais: BCB, IBGE, AwesomeAPI, Yahoo Finance
- Atualização: a cada 60 segundos

#### Macro — "O que está movendo a economia?" ✅
- 4 cards de briefing: CRÉDITO, INFLAÇÃO, CÂMBIO, DEMANDA
- Cada card: valor real + explicação + "afeta quem" + "→ resolver em [módulo]"
- Cascatas cruzadas: SELIC+IPCA=taxa real, Dólar+Meta=CPM, SELIC+Varejo, PIB+Agro
- Setores com contexto inteligente (9 setores)
- Commodities com impacto dinâmico
- Agentes globais com cascata (Meta→CPM→CAC)

#### Marketing — "Quanto custa crescer?" ✅
- CAC hero + LTV + LTV/CAC + Payback + Churn (unit economics)
- Barras horizontais comparando plataformas
- Ações recomendadas com prioridade
- "COMO LUCRAR" em cada risco

#### Riscos — "O que pode me quebrar — e como lucrar?" ✅
- Cadeias causais: SELIC, IPCA, câmbio, CAC, talento, IA, setores
- Cada risco com: causa → efeito → quem afeta → como agir → COMO LUCRAR
- Circular severity meters (SVG animado)
- Badges "→ Resolver em: [módulo Workspace]"

### 3.2 [ INTELLIGENCE ] — estudo (currículo PUCPR)
8 módulos do BI em Negócios. Conteúdo teórico + simulações + tutor IA.

### 3.3 [ WORKSPACE ] — espaço de trabalho ✅ PARCIALMENTE IMPLEMENTADO

#### Onboarding Inteligente ✅
```
1. "Quem é você?" → PF | PJ | "Não sei por onde começar"
2. Detalhes: fase/tipo/setor/faturamento/produto
3. Setor (multi-select, 21 opções) + market insight
4. Resumo + "Abrir Workspace"
→ Salva no localStorage, não repete
```

#### Módulos do Workspace

| # | Módulo | Status | O que faz |
|---|--------|--------|-----------|
| 1 | **IA Advisor** | ✅ FUNCIONAL | Chat com Groq. Auto-gera briefing completo cruzando TODOS os dados de mercado. Perguntas follow-up. |
| 2 | **Cockpit Financeiro** | ✅ FUNCIONAL | 4 inputs + 8 métricas calculadas + impacto SELIC/IPCA/câmbio + "Analisar com IA" |
| 3 | **Cenários & Forecast** | ✅ FUNCIONAL | Base macro real + 3 cenários + stress test (4 sliders) + SVG projeção 12m + tabela + presets "E se..." + IA |
| 4 | **Smart Pricing** | ✅ FUNCIONAL | 6 inputs + 8 métricas + SVG barras comparativas + IPCA erosão + câmbio impacto + elasticidade + 3 preços sugeridos + IA |
| 5 | Inovação & Tendências | 🔲 PLACEHOLDER | Radar maturidade digital + tendências do setor |
| 6 | **ESG Diagnóstico** | ✅ FUNCIONAL | 10 perguntas (ENV/SOC/GOV/STRAT/MKT) + 8 frameworks + score maturidade + recomendação + IA |
| 7 | Mercado & Concorrência | 🔲 PLACEHOLDER | TAM/SAM/SOM + posicionamento |
| 8 | Pessoas & Liderança | 🔲 PLACEHOLDER | People analytics |
| 9 | Processos & Operações | 🔲 PLACEHOLDER | Jornada do cliente |
| 10 | Canvas & Pitch | 🔲 PLACEHOLDER | BMC + viabilidade + pitch IA |

#### ESG — Diagnóstico Inteligente ✅

**10 perguntas cobrindo 8 frameworks:**
- ENV (1-2): resíduos/emissões + energia renovável → TBL Planet, ESG E, GRI 300
- SOC (3-4): diversidade + investimento comunidade (ISP) → TBL People, ESG S, GRI 400
- GOV (5-6): compliance + relatórios públicos → ESG G, GRI, SASB
- STRAT (7-8): CSV (produto resolve problema social?) + ODS → CSV, ODS
- MKT (9-10): certificações do setor + ISE B3 → ISE, SASB

**Resultado:**
- Score maturidade ESG (0-100): INICIAL → EM DESENVOLVIMENTO → AVANÇADO → REFERÊNCIA
- 5 barras por dimensão
- Recomendação automática de frameworks
- IA cruza diagnóstico + mercado + plano 90 dias

**Frameworks cobertos:** TBL, ESG Rating, GRI, SASB, ODS, CSV, ISE B3, ISP

---

## 4. ACESSIBILIDADE, INCLUSÃO, DIVERSIDADE E IGUALDADE

### Princípio: O IPB é CSV na prática

O IPB não FALA sobre inclusão — PRATICA inclusão. Não é uma seção do app, é o DNA.

**Criatividade (cocriação):** Plataforma desenhada com usuários diversos como consultores de UX desde a fase 0. Não é "adaptar depois" — é construir COM.

**Inovação (IA adaptativa):** IA que traduz dados complexos em linguagem acessível para QUALQUER pessoa — independente de escolaridade, deficiência, idioma, contexto.

**Sustentabilidade (TBL do IPB):**
- Profit: SaaS acessível = mercado maior. 45 milhões de PcD no Brasil, 80 milhões sem acesso a consultoria.
- People: inclusão real, não selo decorativo. Plano social pra ONGs, MEIs, iniciantes.
- Planet: 100% digital, pegada mínima.

---

### 4.1 ACESSIBILIDADE (Deficiência)

**Quem é excluído hoje de inteligência de mercado?**
Praticamente TODOS que têm alguma deficiência. Dashboards são visuais, textos são técnicos, navegação exige mouse.

#### Neurodiversidade

**Modo Foco (TDAH)** 🔲 A IMPLEMENTAR
- Uma informação por tela, não 50 ao mesmo tempo
- Bullets curtos, máximo 3 linhas por resposta da IA
- "A coisa mais importante agora é: X" — hierarquia clara
- Barra de progresso: "Você viu 2 de 4 seções"
- Timer de foco: "Dedique 5 min a isso"
- Notificações mínimas e configuráveis
- Hiperfoco como aliado: gamificação sutil (progresso, conquistas)

**Modo Calmo (TEA/Autismo)** 🔲 A IMPLEMENTAR
- Sem animações (CSS prefers-reduced-motion)
- Cores estáticas, sem pulse/glow/piscando
- Estrutura previsível: mesma posição, mesma ordem SEMPRE
- Linguagem literal, sem metáforas ("mercado aquecido" → "setor crescendo 35%")
- Roteiro fixo: "Primeiro veja isso → depois isso → ação"
- Opção de ver TODOS os dados sem simplificação (detalhismo TEA como vantagem)
- Transições suaves ou desligáveis

#### Deficiência Visual

**Alto Contraste + Fontes** 🔲 A IMPLEMENTAR
- Toggle alto contraste no perfil
- Fontes ajustáveis (A+ A- no header)
- Compatível com VoiceOver (iOS) e TalkBack (Android) via aria-labels
- IA audiodescrição: "O gráfico mostra que tech está em 98 de 100, subindo 35%"
- Modo daltônico: usar formas além de cores (▲ subindo, ▼ caindo, ● estável)

#### Deficiência Auditiva ✅ NATIVO
- App já é 100% visual/texto — não depende de áudio
- Se adicionar vídeos: legendas obrigatórias

**Libras** 🔲 FUTURO
- Integração VLibras (widget governamental gratuito)
- Avatar tradutor nas explicações da IA

#### Deficiência Motora 🔲 PARCIAL
- Navegação completa por teclado (Tab + Enter + Arrows)
- Botões com área de toque mínima 44x44px (WCAG)
- Alternativa a drag-and-drop (em Processos & Operações)

---

### 4.2 INCLUSÃO SOCIAL

**Quem não tem acesso a inteligência de mercado hoje?**
- MEIs e PFs que não podem pagar consultoria
- Periferias e interior sem acesso a educação de negócios
- Primeira geração de empreendedores na família
- Imigrantes e refugiados empreendendo no Brasil

**O que o IPB faz:**

| Barreira | Como o IPB resolve |
|----------|-------------------|
| "Não entendo economia" | IA traduz: "SELIC alta = crédito caro pra você" |
| "Não tenho dinheiro pra consultor" | IA grátis (Groq), plano freemium |
| "Não sei por onde começar" | Onboarding: "Não sei" → IA guia passo a passo |
| "Não tenho formação" | Intelligence: currículo PUCPR acessível |
| "Sou do interior" | 100% online, funciona com internet básica |
| "Meu negócio é pequeno demais" | De MEI a LTDA — o app cresce com você |

**Planos de inclusão social** 🔲 A DEFINIR
- Plano gratuito para MEIs (módulos básicos)
- Plano social para ONGs, associações, fundações
- Parceria com incubadoras e aceleradoras sociais
- Programa "Primeiro Negócio" para iniciantes

---

### 4.3 DIVERSIDADE

**O app reconhece que negócios são diversos?**

| Diversidade | Como o IPB atende |
|-------------|-------------------|
| **Gênero** | Onboarding não assume gênero. Dados de gap salarial no módulo Pessoas. ESG mede diversidade em liderança. |
| **Raça/Etnia** | Módulo Pessoas: indicadores de diversidade racial. ESG: inclusão como indicador de governança. |
| **LGBTQIA+** | Linguagem neutra no app. Sem suposições sobre estrutura familiar/societária. |
| **Idade** | Interface legível pra +50. Fontes ajustáveis. IA explica termos técnicos. |
| **Geográfica** | Dados de mercado cobrem todo o Brasil, não só eixo SP-RJ. Agro forte = interior representado. |
| **Porte** | De PF sem CNPJ a empresa listada em bolsa — mesmo app, experiência adaptada. |
| **Setor** | 21 setores no onboarding. ESG adaptado por setor. Dados de mercado por setor. |
| **Tipo de produto** | Físico, digital, SaaS, marketplace, serviço — cada um com métricas diferentes. |

**No módulo Pessoas & Liderança** 🔲 A IMPLEMENTAR
- Indicadores de diversidade: gênero, raça, idade em cargos de liderança
- Gap salarial por gênero (mesma função)
- Índice de inclusão (pesquisa interna)
- Metas de diversidade com acompanhamento
- IA analisa e recomenda ações

---

### 4.4 IGUALDADE

**Igualdade de acesso à informação = igualdade de oportunidade**

O problema central: inteligência de mercado é cara e excludente. Quem tem dinheiro contrata McKinsey. Quem não tem, decide no escuro.

**O IPB equaliza:**

| Antes do IPB | Com o IPB |
|-------------|-----------|
| Consultoria R$50-200k | IA grátis com mesmos dados |
| Relatório de mercado em inglês | Português brasileiro, linguagem simples |
| Dashboard pra quem sabe ler dados | IA explica o que cada número significa |
| Só pra quem tem CNPJ | Funciona pra PF, MEI, iniciante |
| Sustentabilidade só pra grande empresa | ESG acessível pra qualquer porte |
| Análise manual e lenta | Tempo real, atualizado a cada 60s |

**Igualdade no app:**
- Mesma qualidade de IA pra todos os planos
- Dados de mercado reais pra todos (não mock pra plano free)
- ESG não é só pra empresa grande — MEI pode começar com TBL
- Mesma interface: PF vê a mesma qualidade visual que LTDA

---

### 4.5 NO ONBOARDING 🔲 A IMPLEMENTAR

Adicionar após a seleção de setor:

"Como podemos adaptar o IPB pra você?"
- "Modo Foco — menos informação por tela, direto ao ponto" (TDAH)
- "Modo Calmo — sem animações, estrutura previsível" (TEA)
- "Fontes maiores / alto contraste" (Visual)
- "Modo padrão" (sem alterações)

→ Salva no localStorage e aplica em todo o app

---

### 4.6 NO ESG DO WORKSPACE 🔲 A IMPLEMENTAR

Adicionar 11ª pergunta ao diagnóstico ESG:

"Seu produto/serviço é acessível para pessoas com deficiência?"
- "Sim, foi projetado com acessibilidade" → score 3
- "Parcialmente, temos algumas adaptações" → score 2
- "Não pensamos nisso" → score 0

IA analisa e recomenda: "Seu produto não é acessível → 45M de PcD no Brasil são mercado potencial não atendido. Acessibilidade é CSV: lucro + impacto social."

---

### 4.7 O IPB COMO REFERÊNCIA

O IPB pratica o que ensina no ESG:
- **TBL People:** inclusão real no código, não em slide
- **CSV:** lucra PORQUE inclui — mercado maior, não menor
- **ODS 4 (Educação):** Intelligence democratiza conhecimento
- **ODS 8 (Trabalho Decente):** Workspace capacita empreendedores
- **ODS 10 (Redução de Desigualdades):** mesma inteligência pra MEI e LTDA
- **ODS 5 (Igualdade de Gênero):** indicadores de gap no módulo Pessoas
- **Anti-Greenwashing:** não fala de inclusão sem praticar — o código prova

---

## 5. ADMIN (FUNDADORA)

Acesso exclusivo da administradora/fundadora do IPB.

### Controles
- Visão de TODOS os workspaces
- Gestão de equipes e acessos
- Controle de assinaturas
- Liberar/bloquear módulos por plano

### Big Data
- Dados agregados de todos os usuários (anônimo, LGPD)
- Benchmark por setor
- Quanto mais usuários → mais dados → mais inteligência → mais valor
- Analytics de uso: quais módulos são mais usados, onde usuários travam

### Alertas
- In-app: quando evento de mercado afeta um workspace
- "SELIC subiu → 47 workspaces do varejo impactados"

---

## 6. CAMADAS DE DADOS

```
C1 MERCADO GLOBAL → todos veem (público, Business tab)
C2 BENCHMARKS AGREGADOS → todos veem (anônimo, como bolsa)
C3 MEU WORKSPACE → só eu + admin
C4 MEUS CLIENTES → cada um vê só o seu + admin vê todos
```

---

## 7. TECNOLOGIA

### Stack
- Next.js 16 + React
- Supabase (auth + database + RLS)
- Vercel (deploy)
- Capacitor (iOS nativo)
- ECharts (gráficos)
- Framer Motion (animações)

### IA
- Groq API + Llama 3.3 70B (grátis, ultra rápido)
- Cruza dados de mercado + dados do workspace
- Gera CONDUTA, análises, relatórios, briefings
- Cache 5 min para não desperdiçar requests
- Endpoints: /api/intelligence, /api/advisor-chat

### APIs de Dados Reais
- BCB: SELIC (série 432)
- IBGE: IPCA (agregado 433), PIB (agregado 1621)
- AwesomeAPI: USD/BRL
- Yahoo Finance: commodities (ouro, petróleo, prata, cobre, grãos, lítio), ações de setores (TOTVS, SLC, Rede D'Or, Engie, Nubank, Rumo, Magazine Luiza), agentes globais (Apple, Google, Meta, Amazon, Vale, Petrobras)
- RSS: InfoMoney, Folha Mercado, G1 Economia, UOL, Agência Brasil, Canaltech, TechCrunch, Google News BR

### Segurança
- Supabase RLS: cada linha acessível só pelo dono
- Benchmarks sempre anônimos e agregados
- Consentimento explícito no cadastro
- Direito de exclusão total (LGPD)
- Dados individuais NUNCA aparecem publicamente

---

## 8. FASES DE CONSTRUÇÃO

### Fase 1: Business Tab com IA Nativa ✅ CONCLUÍDA
- [x] IA cruza dados nativamente nos componentes
- [x] News conectadas aos indicadores (10 padrões)
- [x] Marketing com LTV, ROI, unit economics
- [x] Riscos com "como lucrar" em cada risco
- [x] GROQ_API_KEY configurada no Vercel
- [x] Cascatas cruzadas no Macro
- [x] Setores/commodities/agentes com contexto

### Fase 2: Workspace + Onboarding ✅ PARCIALMENTE CONCLUÍDA
- [x] Renomear Admin → Workspace
- [x] Onboarding: PF/PJ → tipo → setor → produto (multi-select, 21 setores)
- [x] IA Advisor funcional (briefing automático + chat)
- [x] Cockpit Financeiro funcional
- [x] Cenários & Forecast funcional (SVG chart + stress test + presets)
- [x] Smart Pricing funcional (barras + elasticidade + preço sugerido)
- [ ] Melhorar Cockpit (ainda básico)
- [ ] Melhorar Cenários (ainda básico)
- [ ] Módulos 5, 7, 8, 9, 10 (placeholders)

### Fase 3: ESG Inteligente ✅ PARCIALMENTE CONCLUÍDA
- [x] Diagnóstico 10 perguntas + 8 frameworks
- [x] Score maturidade + recomendação automática
- [x] IA cruza diagnóstico + mercado
- [ ] TBL interativo (sliders People/Planet/Profit)
- [ ] ESG Rating simulação MSCI (CCC-AAA)
- [ ] ODS mapeamento visual (17 ODS)
- [ ] Anti-Greenwashing checklist (7 pecados)
- [ ] ISE B3 benchmark

### Fase 4: Acessibilidade e Inclusão 🔲 NÃO INICIADA
- [ ] Pergunta de acessibilidade no onboarding
- [ ] Modo Foco (TDAH): uma info por vez, bullets curtos
- [ ] Modo Calmo (TEA): sem animações, estrutura fixa
- [ ] Alto contraste + fontes ajustáveis
- [ ] Aria-labels nos componentes
- [ ] Modo daltônico (formas além de cores)
- [ ] IA audiodescrição de gráficos
- [ ] Indicador "Acessibilidade do produto" no ESG

### Fase 5: Admin/Fundadora 🔲 NÃO INICIADA
- [ ] Controle total de workspaces
- [ ] Big Data agregado + benchmark anônimo
- [ ] Gestão de equipes e acessos
- [ ] Analytics de uso
- [ ] Alertas quando mercado afeta workspaces

### Fase 6: CRM de Agentes 🔲 NÃO INICIADA
- [ ] Cadastro por tipo (Pessoa/Empresa/Startup)
- [ ] Cockpit individual conectado ao mercado
- [ ] IA gera CONDUTA por agente
- [ ] Panorama da carteira

### Fase 7: Acessibilidade Avançada 🔲 FUTURO
- [ ] VLibras / Libras (avatar tradutor)
- [ ] Navegação por voz
- [ ] Audiodescrição completa de gráficos
- [ ] Auditoria de viés da IA

---

## 9. O QUE O IPB NÃO É

- NÃO é um dashboard genérico com números bonitos
- NÃO é uma planilha glorificada
- NÃO é IA decorativa (caixa azul separada)
- NÃO é consultoria manual
- NÃO precisa de conhecimento econômico do usuário
- NÃO exclui — é acessível por design

## O QUE O IPB É

**Inteligência de mercado que cruza dados reais + workspace de gestão + IA que traduz e recomenda ação — acessível, inclusivo, de PF iniciante a empresa estabelecida.**

**CSV na prática:** o IPB lucra PORQUE resolve exclusão informacional e promove inclusão — não apesar disso.
