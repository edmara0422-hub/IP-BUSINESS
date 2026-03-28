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

## 4. ACESSIBILIDADE E INCLUSÃO

### Princípio: Acessível por Design (não retrofit)

**Criatividade (cocriação):**
- Onboarding pergunta necessidades de acessibilidade
- Usuários com deficiência como beta testers

**Inovação (IA adaptativa):**
- IA traduz dados complexos em linguagem simples (já faz)
- IA lê gráficos em texto: "Setor tech heat 98, subindo 35%"

**Sustentabilidade (TBL do próprio IPB):**
- Profit: SaaS por assinatura, IA grátis = margem alta
- People: acessibilidade, inclusão, plano social pra ONGs
- Planet: 100% digital, sem papel

### Modos de Acessibilidade

#### Modo Foco (TDAH) 🔲 A IMPLEMENTAR
- Uma informação por tela
- Bullets curtos, máximo 3 linhas
- "A coisa mais importante agora é: X"
- Barra de progresso: "Você viu 2 de 4"
- Notificações mínimas

#### Modo Calmo (TEA/Autismo) 🔲 A IMPLEMENTAR
- Sem animações (prefers-reduced-motion)
- Cores estáticas, sem pulse/glow
- Estrutura previsível e fixa
- Linguagem literal, sem metáforas
- Opção de ver TODOS os dados sem simplificação

#### Acessibilidade Visual 🔲 A IMPLEMENTAR
- Modo alto contraste
- Fontes ajustáveis (A+ A-)
- Compatível com leitores de tela (aria-labels)
- Modo daltônico (formas além de cores: ▲▼● )
- IA audiodescrição de gráficos

#### Acessibilidade Auditiva ✅ NATIVO
- App já é 100% visual/texto
- Não depende de áudio

#### Acessibilidade Motora 🔲 PARCIAL
- Navegação por teclado (Tab + Enter)
- Botões com tamanho adequado

#### Libras 🔲 FUTURO
- Integração VLibras ou similar
- Avatar tradutor

### No Onboarding 🔲 A IMPLEMENTAR
Adicionar pergunta: "Precisa de acessibilidade?"
- "Modo Foco (TDAH)" → ativa modo foco
- "Modo Calmo (sensorial)" → desliga animações
- "Alto contraste / fontes maiores" → modo visual
- "Modo padrão" → sem alterações

### No ESG do Workspace 🔲 A IMPLEMENTAR
Adicionar indicador: "Acessibilidade do seu produto/serviço"
- "Seu produto é acessível para PcD?"
- IA analisa e recomenda melhorias

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
