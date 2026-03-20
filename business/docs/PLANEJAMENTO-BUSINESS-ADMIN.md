# PLANEJAMENTO ESTRATEGICO — ABA BUSINESS & ADMINISTRATIVA

> Documento vivo. Nenhum codigo sera escrito antes da aprovacao deste plano.
> Ultima atualizacao: 2026-03-17

---

## 1. DIAGNOSTICO DO ESTADO ATUAL

### O que existe e funciona
| Componente | O que faz | Status |
|-----------|-----------|--------|
| BusinessClock | Relogio prata fino (saudacao + data + hora) | OK — NAO MEXER |
| BusinessChart | Wrapper ECharts com highlight cycling | OK |
| API /api/market | Dados reais: BCB (SELIC), IBGE (IPCA, PIB), AwesomeAPI (USD), Yahoo (commodities) | OK |
| Zustand Store | 24 inputs financeiros, workspaces, team, canvas, risks | OK |
| business-math.ts | Break-even, Burn Rate, Runway, ROI, ROE, LTV/CAC, EBITDA, Health Score | OK |
| Advisor (Claude Haiku) | Analise estrategica por IA | OK |

### O que esta ERRADO
1. **Layout bagunçado** — componentes sobrepostos, sem hierarquia visual clara
2. **Nao futuristico** — parece dashboard generico, nao painel de comando
3. **Dados estaticos visualmente** — numeros nao "vivem", nao pulsam, nao animam ao mudar
4. **Analise rasa** — sinais mostram sintoma mas nao explicam causa-efeito profundo
5. **5 secoes "Coming Soon"** — macro, setores, plataformas, problemas, simulacao vazias
6. **Sem benchmarking** — nao compara setores, marcas, mercados entre si
7. **Sem historico** — so mostra snapshot atual, sem tendencia temporal
8. **Barra de navegacao grossa** — falta refinamento visual

---

## 2. VISAO ESTRATEGICA

### O que Business DEVE ser
Um **centro de comando de inteligencia de mercado em tempo real** — como uma bolsa de valores futuristica onde:
- Tudo esta VIVO (numeros mudam, graficos redesenham, indicadores pulsam)
- Cada dado tem CONTEXTO (o que significa, como influencia, o que fazer)
- Analise e MULTIDIMENSIONAL (6D: Espaco, Tempo, Custo, Sustentabilidade, Social, Dados)
- Mostra o MUNDO GIRANDO (macro → micro → setor → empresa → pessoa)

### Quem vai usar (Agentes Economicos)
| Agente | O que precisa ver |
|--------|------------------|
| Administrador/Gestor | Panorama completo, riscos, oportunidades, ROI |
| Startup/Empreendedor | Viabilidade, CAC/LTV, runway, break-even |
| Empresa estabelecida | Benchmarking, market share, eficiencia operacional |
| Estudante/Pesquisador | Dados macro, simulacao, aprendizado |
| Consultor | Diagnostico, plano de acao, metricas de impacto |

### Pilares da Matriz Curricular aplicados ao App
| Semestre | Modulos | O que vira no App |
|----------|---------|------------------|
| 1o (Nascimento) | Inovacao + Contabilidade | Canvas interativo, Dashboard contabil, Viabilidade |
| 2o (Mercado) | Economia + Estatistica | Simulador macro/micro, Predicao, War Room |
| 3o (Operacao) | Empreendedorismo + Financas | Pitch Builder, Precificacao, Margem dinamica |
| 4o (Impacto) | Social + Projeto | ESG Score, Mapa de Impacto, Externalidades |

---

## 3. ARQUITETURA DAS SECOES

### 3.1 PANORAMA (Visao geral — tela principal)
**Proposito:** Snapshot instantaneo do mundo. O usuario abre e em 3 segundos entende o cenario.

**Layout:** Grid denso estilo cockpit, SEM scroll na area principal (tudo visivel de uma vez).

| Bloco | Dado | Visualizacao | Tecnologia | Por que esse tipo |
|-------|------|-------------|------------|-------------------|
| Indicadores Macro | SELIC, IPCA, PIB, USD/BRL | **ECharts Gauge** (velocimetro) | ECharts gauge series | Mostra valor DENTRO de uma faixa (bom/perigo/critico). Gauge e o unico tipo que comunica "onde estou em relacao ao limite" |
| Commodities | Ouro, Petroleo, Prata, Graos, Cobre, Litio | **Cards compactos com mini-sparkline** | ECharts line (mini) | Commodity sem tendencia e numero morto. Sparkline mostra direcao em 30 dias |
| Saude do Mercado | Score composto 0-100 | **Radar 8D** (8 eixos) | ECharts radar | 8 dimensoes nao cabem em gauge. Radar mostra equilibrio/desequilibrio entre elas |
| Setores | 9 setores com heat + change | **Treemap** | ECharts treemap | Tamanho = relevancia, cor = performance. Treemap comunica 2 variaveis simultaneamente |
| Sinais Causais | Cadeia causa→efeito | **Feed vertical com depth** | Framer Motion + CSS | Sinais precisam de NARRATIVA, nao so numero. Cada sinal mostra: gatilho → impacto → acao |
| Timer | Proxima atualizacao | **Countdown circular** | SVG animado | Mostra que dados sao VIVOS |

**Dados em tempo real:**
- API /api/market a cada 60s
- Numeros animam com spring physics (Framer Motion) quando valor muda
- Indicador verde pulsante "LIVE" no canto
- Countdown "Proxima atualizacao em Xs"

---

### 3.2 MACRO & MICRO (Aprofundamento economico)
**Proposito:** Entender COMO a economia afeta negocios. Nao e so numero — e causa e efeito.

| Bloco | Dado | Visualizacao | Calculo | Por que |
|-------|------|-------------|---------|---------|
| Painel Macro | SELIC, IPCA, PIB, Cambio, Desemprego | **Gauges grandes** + linha historica | Variacao % periodo | Gauge para atual + linha para tendencia |
| Agentes Economicos | Familias, Empresas, Governo, Exterior | **Diagrama de fluxo circular** | Fluxo monetario entre agentes | Mostra como dinheiro circula entre agentes — fundamental de economia |
| Cadeia de Impacto | SELIC sobe → credito caro → consumo cai → varejo sofre | **Grafo de forca (Force Graph)** | Correlacao entre variaveis | Unico tipo que mostra REDE de causalidade |
| Analise Micro | Oferta/Demanda, Elasticidade | **Curvas interativas** | Preco x Quantidade | Slider para usuario mover preco e ver impacto na demanda |
| Indicadores Globais | S&P500, IBOVESPA, DXY | **Sparklines comparativas** | Variacao % | Contexto global para decisoes locais |

**Calculos necessarios:**
- Taxa real de juros = SELIC - IPCA
- Poder de compra = Salario / Cesta basica
- Elasticidade-preco = % variacao demanda / % variacao preco
- Multiplicador fiscal = 1 / (1 - Propensao marginal a consumir)

**Fonte de dados:**
- BCB: SELIC, CDI, IPCA expectativa
- IBGE: PIB, desemprego, producao industrial
- AwesomeAPI: Cambio (USD, EUR, BTC)
- Yahoo Finance: Indices globais

---

### 3.3 SETORES & COMMODITIES (Benchmarking de mercado)
**Proposito:** Comparar setores, entender quem esta subindo/caindo e POR QUE.

| Bloco | Dado | Visualizacao | Por que esse tipo |
|-------|------|-------------|-------------------|
| Mapa de Calor Setorial | 9+ setores com performance | **Treemap grande** com drill-down | Clica no setor → abre sub-setores |
| Ranking de Setores | Ordenado por performance | **Barras horizontais animadas** (tipo ranking race) | Mostra posicao relativa e movimento |
| Commodities Detalhado | 6+ commodities com historico | **Line chart multi-serie** | Compara tendencias lado a lado |
| Correlacao | Como commodities afetam setores | **Heatmap de correlacao** | Matriz que mostra: petroleo sobe → energia sobe, varejo cai |
| Benchmarking Global | Comparar BR vs EUA vs China vs EU | **Barras agrupadas** | Comparacao direta entre mercados |

**Calculos:**
- Variacao % por periodo (7d, 30d, 90d, 1a)
- Correlacao de Pearson entre series
- Z-Score (quantos desvios-padrao do normal)
- Media movel (SMA 20, SMA 50)

---

### 3.4 PLATAFORMAS & MARKETING (Inteligencia de canais)
**Proposito:** Onde investir dinheiro de marketing. Qual canal da mais retorno.

| Bloco | Dado | Visualizacao | Por que |
|-------|------|-------------|---------|
| CPM/CPC por Plataforma | Meta, Google, TikTok, Instagram, ML, Shopee | **Barras horizontais** com benchmark | Comparacao direta de custo |
| Funil de Conversao | Lead → Qualificacao → Proposta → Venda | **Funil visual** (trapezios empilhados) | Mostra onde perde mais gente |
| CAC vs LTV | Custo de aquisicao vs valor do cliente | **Gauge com zona** (verde se LTV/CAC > 3) | Indicador de saude do modelo |
| ROI por Canal | Retorno de cada plataforma | **Donut** com segmentos por canal | Proporcao do retorno total |
| Tendencia de Custos | CPM/CPC ao longo do tempo | **Area chart** | Mostra se custos estao subindo ou caindo |

**Calculos:**
- CAC = Investimento total em marketing / Clientes adquiridos
- LTV = Ticket medio x Frequencia de compra x Tempo de retencao
- ROAS = Receita de anuncios / Custo de anuncios
- CPA = Custo total / Conversoes
- Payback CAC = CAC / Receita mensal por cliente

---

### 3.5 PROBLEMAS & OPORTUNIDADES (Diagnostico estrategico)
**Proposito:** SWOT dinamico. Nao e lista estatica — atualiza conforme mercado muda.

| Bloco | Dado | Visualizacao | Por que |
|-------|------|-------------|---------|
| Matriz de Risco | Probabilidade x Impacto | **Scatter plot** (quadrantes) | Mostra onde concentrar atencao |
| Problemas Ativos | Top 5 problemas com % afetados | **Barras com gradiente vermelho** | Severidade visual imediata |
| Oportunidades | Top 5 com urgencia | **Barras com gradiente verde** | Janela de oportunidade |
| SWOT Dinamico | Forcas, Fraquezas, Oportunidades, Ameacas | **Quadrante 2x2** com cards | Classico mas interativo — cards se movem conforme dados mudam |
| Recomendacoes IA | Analise Claude | **Card narrativo** | Texto precisa de espaco, nao grafico |

**Calculos:**
- Risk Score = Probabilidade x Impacto x (1 - Mitigacao)
- Opportunity Score = Urgencia x Potencial de retorno
- SWOT Weight = Soma ponderada dos fatores internos/externos

---

### 3.6 SIMULACAO 6D (What-If interativo)
**Proposito:** O usuario MEXE nos parametros e VE o impacto em tempo real. Este e o diferencial.

| Dimensao | Slider | O que muda | Visualizacao do impacto |
|----------|--------|-----------|------------------------|
| **Tempo** | Horizonte (3m, 6m, 1a, 3a, 5a) | Projecoes financeiras | Linha de tendencia se estica/encolhe |
| **Custo** | SELIC +/- 5pp | Custo do credito, financiamentos | Gauge de SELIC muda, cascata de efeitos |
| **Espaco** | Mercado (local/regional/nacional/global) | Escala, concorrencia, regulacao | Mapa muda de cidade → pais → mundo |
| **Sustentabilidade** | Investimento ESG | Score ESG, percepcao publica | Arvore cresce/encolhe |
| **Social** | Impacto na comunidade | Externalidades positivas/negativas | Mapa de calor social |
| **Dados** | Volume de dados coletados | Precisao das predicoes | Intervalo de confianca estreita/alarga |

**Motor de simulacao (ja existe parcialmente em AbaBusiness.tsx):**
```
applySimulation(rawData, offsets) → novo MarketData
```
Precisa expandir para aceitar os 6 sliders e recalcular TUDO:
- Setores reagem diferente a cada dimensao
- Agentes reagem diferente
- Oportunidades aparecem/desaparecem
- Riscos aumentam/diminuem

**Calculos da simulacao:**
- VPL (Valor Presente Liquido) = Soma [FCt / (1+r)^t]
- TIR (Taxa Interna de Retorno) = taxa que faz VPL = 0
- Payback descontado
- Analise de sensibilidade (Monte Carlo simplificado)
- Cenarios: Otimista (+20%), Realista, Pessimista (-20%)

---

## 4. ABA ADMINISTRATIVA

### Proposito
A aba do GESTOR/ADMINISTRADOR. Aqui voce puxa os dados do mercado (Business) e aplica ao SEU negocio especificamente.

### Estrutura
| Secao | O que faz | Diferenca do Business |
|-------|----------|----------------------|
| **Meu Painel** | KPIs do SEU workspace (receita, margem, runway) | Business = mercado geral. Admin = sua empresa |
| **Diagnostico** | Health Score, Stress Index, gaps | Cruza seus dados com benchmarks do mercado |
| **Benchmarking** | Compara SEUS numeros vs media do setor | Usa dados de Business como referencia |
| **Plano de Acao** | Advisor IA gera recomendacoes especificas | Baseado nos SEUS inputs + cenario macro |
| **Equipe** | Team management, skill mapping, engajamento | Gestao de pessoas do SEU time |
| **Compliance** | LGPD, riscos legais, eticos | Checklist regulatorio |
| **Relatorios** | Exportar PDF/CSV com analises | Documentacao para stakeholders |

### LGPD e Protecao de Dados
| Requisito | Implementacao |
|-----------|--------------|
| Consentimento | Modal de aceite no primeiro acesso + politica de privacidade |
| Minimizacao | So coletar dados essenciais para as simulacoes |
| Transparencia | Painel mostrando quais dados estao armazenados |
| Portabilidade | Botao "Exportar meus dados" (JSON/CSV) |
| Exclusao | Botao "Excluir minha conta e dados" |
| Seguranca | Dados sensiveis criptografados, Supabase RLS |
| Retencao | Politica de retencao (ex: 2 anos inativos → exclusao) |

---

## 5. TECNOLOGIA — O QUE USAR E POR QUE

### Visualizacao
| Tipo de Grafico | Biblioteca | Por que essa e nao outra |
|----------------|-----------|-------------------------|
| Gauge/Velocimetro | **ECharts** | Unica lib que faz gauge bonito com gradiente. Recharts nao tem gauge nativo |
| Treemap | **ECharts** | Suporta drill-down, tooltips ricos, animacao. Recharts treemap e basico |
| Radar | **ECharts** | Melhor radar com area fill + animacao |
| Force Graph | **ECharts** | Grafo de rede com fisica. D3 seria alternativa mas ECharts ja esta instalado |
| Barras/Linhas/Area | **ECharts** | Consistencia — manter uma unica engine |
| Scatter/Bubble | **ECharts** | Zoom, brush selection, tooltip |
| Heatmap | **ECharts** | Suporta grandes datasets com cores customizadas |
| Funil | **ECharts** | Tipo nativo com labels e sorting |

**Decisao: ECharts como engine UNICA.** Remover Recharts (redundante). Uma engine = consistencia visual + menor bundle.

### Animacao
| Elemento | Biblioteca | Por que |
|----------|-----------|---------|
| Numeros animados (spring) | **Framer Motion** | Spring physics natural, sem parecer robotico |
| Transicoes de secao | **Framer Motion** | AnimatePresence para entrada/saida suave |
| Pulse/glow | **CSS Animations** | Leve, nao precisa JS |
| Rotacao de aneis | **CSS Animations** | Transform rotate e GPU-accelerated |

### Calculos Financeiros
| Calculo | Biblioteca | Por que |
|---------|-----------|---------|
| Todos os financeiros | **Decimal.js** | Ja instalado. Evita floating-point errors (0.1+0.2 != 0.3) |
| Regressao/Predicao | **Implementar manual** | Regressao linear e simples (~20 linhas). Nao precisa lib pesada |
| Monte Carlo basico | **Implementar manual** | Loop com Math.random + distribuicao normal |

### Dados em Tempo Real
| Fonte | Dado | Intervalo | Metodo |
|-------|------|----------|--------|
| BCB API | SELIC, CDI | 60s | fetch + cache |
| IBGE API | IPCA, PIB | 60s | fetch + cache |
| AwesomeAPI | USD/BRL, EUR/BRL | 60s | fetch + cache |
| Yahoo Finance | Commodities, indices | 60s | fetch + fallback |

**Por que nao WebSocket:** APIs publicas brasileiras nao oferecem WS. Polling a cada 60s e suficiente para dados que mudam 1x/dia (SELIC) ou 1x/minuto (cambio). Futuro: se tiver API premium, migrar para WS.

---

## 6. COMPONENTES VISUAIS — LINGUAGEM DE DESIGN

Baseado nas imagens de referencia (dashboard futuristico azul/prata):

| Elemento | Uso | Estilo |
|----------|-----|--------|
| **Gauge velocimetro** | Macro indicators | Arco 270 graus, gradiente verde→amarelo→vermelho, fundo escuro |
| **Treemap** | Setores | Blocos com borda fina, cor por heat, hover com glow |
| **Radar** | Score multidimensional | 8 eixos, area preenchida semi-transparente, borda brilhante |
| **Cards com borda neon lateral** | Sinais, oportunidades | Borda esquerda colorida (vermelho=risco, verde=oportunidade, ambar=alerta) |
| **Barras horizontais** | Rankings, comparacoes | Gradiente sutil, valor na ponta, animacao de preenchimento |
| **Circulos de progresso** | KPIs com meta | Arco SVG, percentual central, animacao spring |
| **Sparklines** | Tendencia inline | Linha fina sem eixos, area sutil, dentro de cards |
| **Scatter quadrantes** | Matriz risco/oportunidade | 4 quadrantes coloridos, pontos com label |
| **Timer countdown** | Proxima atualizacao | Arco circular que diminui, segundos no centro |
| **Pulse dot** | Indicador LIVE | Circulo verde com animacao pulse CSS |
| **Grid de dots** | Heatmap/populacao | Matriz 10x10, preenchimento gradual, tooltip |

### Paleta
- **Fundo:** slate-950/95 (quase preto, glassmorphism)
- **Texto primario:** silver/prata (#C0C0C0)
- **Accent positivo:** emerald-400/500
- **Accent negativo:** red-400/500
- **Accent neutro:** amber-400/500
- **Glow/neon:** white/10 a white/5 (bordas sutis)
- **Gradientes:** De transparent → cor com opacidade baixa

---

## 7. LAYOUT — COMO ORGANIZAR SEM BAGUNCA

### Principio: HIERARQUIA VISUAL
```
Nivel 1: O que o olho ve PRIMEIRO (grande, centro)     → Gauges Macro + Score
Nivel 2: O que o olho ve SEGUNDO (medio, laterais)     → Setores + Commodities
Nivel 3: O que o olho ve TERCEIRO (menor, abaixo)      → Sinais + Agentes
Nivel 4: Detalhes sob demanda (scroll ou click)         → Plataformas + Marketing
```

### Grid do Panorama (mobile-first, expande para desktop)
```
Desktop (lg+):
+---------------------------------------------------+
| [Relogio fino — NAO MEXER]                        |
+----------+----------+----------+------------------+
| SELIC    | IPCA     | PIB      | USD/BRL          |  <- Gauges ECharts
| gauge    | gauge    | gauge    | gauge            |
+----------+----------+----------+------------------+
| Treemap Setores     | Radar 8D                    |  <- Analise
| (clicavel)          | (score central)              |
+---------------------+-----------------------------+
| Commodities         | Sinais Causais              |  <- Detalhe
| (cards + sparkline) | (feed com profundidade)     |
+---------------------+-----------------------------+
| [Agentes Globais — horizontal scroll]              |  <- Extra
+---------------------------------------------------+

Mobile:
Stack vertical, cada bloco ocupa 100% largura
Gauges em grid 2x2
Treemap e Radar empilhados
```

### Navegacao entre secoes
**Barra fina** (nao grossa!) — pills minimalistas, texto 10px, sublinhado animado:
```
[Panorama]  [Macro]  [Setores]  [Plataformas]  [Riscos]  [Simulacao]
     --------
```
- Altura maxima: 32px total
- Sem background grosso
- Underline animado (Framer Motion layoutId)
- Centralizado

---

## 8. SINAIS — COMO FAZER PROFUNDOS

### Problema atual
Sinais atuais sao rasos: "SELIC alta → credito caro". Ponto.

### Como devem ser (cadeia causal completa)
```
+-- GATILHO ------------------------------------------------+
| SELIC em 15% (acima da media historica de 10.5%)          |
+-- CAUSA DIRETA -------------------------------------------+
| Custo do credito sobe → Financiamentos mais caros         |
+-- EFEITO 1o NIVEL ----------------------------------------+
| Consumo cai → Varejo sofre → Demissoes aumentam           |
+-- EFEITO 2o NIVEL ----------------------------------------+
| Inadimplencia sobe → Bancos apertam credito (ciclo)       |
+-- OPORTUNIDADE -------------------------------------------+
| Renda fixa paga bem → Investir em CDB/Tesouro             |
| Fintechs de credito ganham espaco                          |
+-- ACAO RECOMENDADA ---------------------------------------+
| Reduzir dependencia de credito, focar em caixa             |
| Renegociar dividas antes que juros subam mais              |
+-----------------------------------------------------------+
```

Cada sinal expande ao clicar. Fechado mostra 1 linha. Aberto mostra a cadeia completa.

---

## 9. FASES DE IMPLEMENTACAO

### Fase 1 — Fundacao (AGORA)
- [ ] Corrigir layout (sem sobreposicao, hierarquia visual)
- [ ] Barra de navegacao FINA e centralizada
- [ ] Panorama com Gauges ECharts + Treemap + Radar + Commodities + Sinais profundos
- [ ] Timer de atualizacao + pulse LIVE
- [ ] Numeros com animacao spring ao mudar

### Fase 2 — Secoes Completas
- [ ] Macro & Micro (gauges grandes, grafo causal, agentes economicos)
- [ ] Setores & Commodities (treemap drill-down, heatmap correlacao, benchmarking)
- [ ] Plataformas & Marketing (barras CPM/CPC, funil, CAC vs LTV gauge)
- [ ] Problemas & Oportunidades (scatter quadrantes, SWOT dinamico, IA advisor)

### Fase 3 — Simulacao 6D
- [ ] 6 sliders interativos (Tempo, Custo, Espaco, Sustentabilidade, Social, Dados)
- [ ] Motor de simulacao expandido
- [ ] VPL, TIR, Payback, Monte Carlo basico
- [ ] Cenarios Otimista/Realista/Pessimista

### Fase 4 — Administrativa
- [ ] Meu Painel (KPIs do workspace)
- [ ] Diagnostico (Health Score vs benchmark)
- [ ] Benchmarking (meus numeros vs setor)
- [ ] LGPD compliance (consentimento, exportacao, exclusao)
- [ ] Relatorios PDF/CSV

### Fase 5 — Polimento
- [ ] Remover Recharts (manter so ECharts)
- [ ] Otimizar bundle (lazy load por secao)
- [ ] Testes E2E para fluxos criticos
- [ ] Acessibilidade (aria-labels, contraste)

---

## 10. DECISOES TECNICAS IMPORTANTES

| Decisao | Escolha | Justificativa |
|---------|---------|---------------|
| Engine de graficos | ECharts unico | Consistencia. Recharts e redundante e inferior em gauge/treemap/graph |
| Animacao de numeros | Framer Motion useSpring | Spring physics e mais natural que easing linear |
| Calculos financeiros | Decimal.js | Precisao. R$120.000,00 nao pode virar R$119.999,99 |
| Polling vs WebSocket | Polling 60s | APIs publicas BR nao oferecem WS. 60s e suficiente |
| State management | Zustand com persist | Ja funciona. Nao trocar |
| Formato de data | Intl.DateTimeFormat pt-BR | Nativo, sem lib extra |
| Responsividade | Tailwind breakpoints | Mobile-first, grid adaptativo |
| LGPD | Supabase RLS + consentimento | RLS no banco + UI de consentimento |

---

## 11. O QUE NAO FAZER

1. **NAO mexer no relogio** (BusinessClock) — esta perfeito
2. **NAO usar Three.js no Panorama** — pesado demais para dashboard. Reservar para Simulacao 3D futura
3. **NAO criar componentes SVG manuais** quando ECharts faz melhor
4. **NAO empilhar tudo vertical** — usar grid 2D como as referencias
5. **NAO mostrar numero sem contexto** — sempre ter label + delta + significado
6. **NAO fazer scroll infinito** — tudo importante visivel sem scroll
7. **NAO inventar dados** — so mostrar o que a API realmente retorna

---

> **PROXIMO PASSO:** Revise este documento. Me diga o que mudar, adicionar ou remover. So depois de aprovado eu toco em codigo.
