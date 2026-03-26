# IPB — Intelligence Platform Business
## Blueprint Completo v2 — 26/03/2026

---

## 1. PERGUNTA CENTRAL

**POR QUE O IPB EXISTE?**

Nenhuma plataforma no Brasil pega dados macroeconômicos reais (BCB, IBGE, Yahoo Finance), cruza com os dados do negócio do usuário (receita, margem, CAC, setor), usa IA para traduzir o que significa pra AQUELA pessoa/empresa, e entrega a ação — não só o diagnóstico.

Consultorias cobram R$50-200k pra fazer isso manualmente. O IPB automatiza com IA grátis (Groq/Llama).

**Valor:** Inteligência de mercado em tempo real + workspace de gestão + IA que cruza tudo = decisão mais rápida, mais precisa, com menos custo.

**Vantagem competitiva:** Motor lógico acadêmico (PUCPR BI Negócios) + dados reais + IA grátis + de PF iniciante a LTDA estabelecida, o app cresce com o usuário.

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
| EI / SLU | até R$4.8M | 9 módulos completos + IA |
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

### 3.1 [ BUSINESS ] — público, todos veem

Terminal de mercado ao vivo. IA cruza dados nativamente (NÃO é caixa azul separada).

#### Panorama — "Como está o mercado agora?"
- Globo 3D + HUD (SELIC, IPCA, PIB, USD/BRL) + commodities
- **News CONECTADAS aos dados** — cada notícia mostra COMO afeta indicadores e setores
  - Notícia: "BC mantém SELIC" → IA cruza: "isso mantém seu custo de financiamento em X% a.a."
  - Tag de impacto: POSITIVO/NEGATIVO/NEUTRO + qual setor afeta
- Dados de mercado reais: BCB (SELIC, IPCA), IBGE (PIB), AwesomeAPI (USD/BRL), Yahoo Finance (commodities, ações)
- Atualização: a cada 60 segundos

#### Macro — "O que está movendo a economia?"
Não só mostrar indicadores — mostrar O QUE GERAM.

| Indicador | O que gera | Quem afeta |
|-----------|-----------|------------|
| SELIC ↑ | Crédito caro, financiamento inviável | PME, varejo, startups em growth |
| SELIC ↓ | Crédito acessível, M&A aquece | Funding, expansão, contratação |
| IPCA ↑ | Poder de compra cai, margem comprime | Preço, demanda, cesta básica |
| Câmbio ↑ | Importação cara, SaaS em dólar sobe | Custo, insumos, tech |
| PIB ↑ | Demanda cresce, consumo expande | Aquisição, escala, contratação |
| Commodities ↑ | Insumos caros, exportador lucra | Agro, energia, mineração |

**IA cruza cascatas:**
- "SELIC 14.8% + IPCA 4.83% = taxa real 9.97% — maior juro real do G20"
- "Dólar R$5.72 + Meta ▲ = CPM em reais sobe 27% — CAC vai piorar"

**Setores com contexto:**
- Cada setor explica: o que é, como afeta, por que está subindo/caindo
- Commodities com impacto dinâmico (muda se sobe ou cai)
- Agentes globais com cascata (Meta sobe → CPM sobe → CAC sobe)

#### Marketing — "Quanto custa CRESCER?" (não só adquirir)
**Ciclo completo do cliente:**

| Métrica | O que mede | Por que importa |
|---------|-----------|-----------------|
| CAC | Custo de aquisição | Quanto gasto pra trazer 1 cliente |
| LTV | Valor do tempo de vida | Quanto esse cliente gera ao longo do tempo |
| LTV/CAC | Relação | <3x = insustentável. >3x = saudável |
| Payback | Meses pra recuperar CAC | Quanto tempo leva pra empatar |
| Churn | Taxa de saída | % de clientes que cancelam/mês |
| ROAS | Retorno sobre ads | Cada R$1 em ads gera R$X em receita |
| ROI | Retorno sobre investimento | Lucro / investimento total |
| MRR/ARR | Receita recorrente | Previsibilidade de caixa (SaaS) |
| NPS | Satisfação | Promotores vs detratores |

**Plataformas com comparação visual:**
- Barras horizontais comparando CPM/CPC
- Click expande análise (por que esse custo, estratégias, melhor para, risco)
- Ações recomendadas com prioridade (URGENTE/IMPORTANTE/CONSIDERAR)

#### Riscos — "O que pode me quebrar — E COMO ME BENEFICIAR?"
Cada risco é uma oportunidade invertida:

| Risco | Quem quebra | Quem lucra |
|-------|------------|-----------|
| SELIC alta | Varejo, PME sem caixa | Renda fixa, empresas com caixa forte |
| IPCA alta | Classe C/D, margens finas | Quem reajusta preço rápido, bens essenciais |
| Câmbio alto | Importador, SaaS em dólar | Exportador, fornecedor nacional |
| Setor em queda | Empresas do setor | M&A barato, concorrência sai |
| CAC subindo | Growth-stage, dependente de paid | Quem tem orgânico forte, marca |
| IA disruptando | Empregos repetitivos | Quem adota IA cedo, automação |

**IA gera cadeia causal completa:**
- O QUE CAUSA → EFEITOS → QUEM AFETA → COMO AGIR → COMO LUCRAR
- Conecta ao Workspace: "→ Resolver em: Cenários & Forecast"

---

### 3.2 [ INTELLIGENCE ] — estudo (currículo PUCPR)
8 módulos do BI em Negócios. Conteúdo teórico + simulações + tutor IA.
Sugestão contextual: problema detectado em Business → disciplina que resolve.

---

### 3.3 [ WORKSPACE ] (antigo Admin)
Espaço de trabalho para TODOS os assinantes.

#### Onboarding Inteligente (IA)
```
1. "Quem é você?"
   → Pessoa Física | Pessoa Jurídica | "Não sei por onde começar"

2. Se PF:
   → Qual fase? Validação → MEI → SLU → LTDA
   → O que faz? E-commerce? Freelancer? App?

3. Se PJ:
   → Qual tipo? MEI | SLU | LTDA | Startup | Associação
   → Qual setor?
   → Qual faturamento?
   → Produto: físico ou digital?

4. IA monta Workspace personalizado
   → Módulos relevantes habilitados
   → Métricas do setor pré-carregadas
   → Benchmarks do setor disponíveis
```

#### Módulos do Workspace (todos com IA + dados de mercado reais)

**1. IA Advisor**
- Cruza TUDO: dados PF/PJ + Business tabs + histórico
- Gera CONDUTA automaticamente
- Usuário pode pedir expansão → valida → salva
- Usa Groq/Llama (grátis, rápido)
- Pode pedir upload de arquivos para análise

**2. Cockpit Financeiro**
- Receita, margem, EBITDA, health score, runway, burn rate
- CONECTADO ao mercado: "SELIC subiu 0.5% → seu custo financeiro aumentou R$X/mês"
- Upload de planilhas → IA ingesta e calcula
- Bloomberg Ticker com dados ao vivo

**3. Cenários & Forecast**
- Dados macro REAIS como base (não hardcoded)
- 3 cenários: otimista, realista, pessimista
- Stress test: "e se SELIC for a 16%? e se câmbio bater R$6.50?"
- Projeção 12-24 meses com gráficos ECharts

**4. Smart Pricing**
- Precificação com inflação e câmbio REAIS
- Markup, margem, ponto de equilíbrio
- Comparação com mercado (dados do Business tab)
- IA sugere preço baseado no setor + concorrência

**5. Inovação & Tendências**
- Radar de maturidade digital
- Tendências do setor (dados de Business)
- IA identifica gaps e oportunidades

**6. ESG — Diagnóstico Inteligente**

A pergunta central: **"Qual framework usar?"**

ODS = O QUÊ (a meta global)
ESG = COMO (a métrica interna)

**Fluxo:**
```
1. DIAGNÓSTICO (IA faz perguntas)
   "Qual seu setor?" → "Qual seu porte?" → "Tem investidores?" → "Exporta?"

2. IA RECOMENDA O FRAMEWORK
   "Para sua empresa, recomendo: GRI + ODS 8,12,13 + ESG Rating"
   "Motivo: você tem investidores internacionais que exigem rating MSCI"

3. IMPLEMENTAÇÃO GUIADA
   - TBL (Triple Bottom Line): 3Ps — People, Planet, Profit
     • 9 métricas (3 por pilar)
     • Teste dos Círculos: Ecológico → Social → Financeiro
     • Círculos Aninhados: Economia ⊂ Sociedade ⊂ Planeta

   - ESG Rating: scoring E/S/G
     • Environmental: emissões CO2, água, resíduos, energia renovável
     • Social: diversidade, saúde, gap salarial, eNPS, comunidade
     • Governance: independência do conselho, anticorrupção, transparência
     • Simula rating MSCI (CCC a AAA)

   - GRI: relatório de sustentabilidade
     • Universal Standards (obrigatórios)
     • Sector Standards (por indústria)
     • Topic Standards (por tema: 200 econômico, 300 ambiental, 400 social)
     • Matriz de Materialidade interativa

   - SASB: por indústria (foco financeiro)

   - ODS: mapeamento dos 3-5 ODS prioritários
     • 17 ODS agrupados: Pessoas, Prosperidade, Planeta, Paz/Parcerias
     • NÃO abraçar todos os 17 (= greenwashing)
     • Exemplo Natura: ODS 12, 13, 15 → dados mensuráveis, rating AAA

   - CSV (Creating Shared Value — Porter):
     • Nível 1: Reconceber produtos e mercados
     • Nível 2: Redefinir produtividade na cadeia
     • Nível 3: Desenvolver clusters locais
     • NÃO é caridade (CSR) — é estratégia que gera lucro

4. ANTI-GREENWASHING CHECK
   7 Pecados (TerraChoice):
   □ Custo Oculto
   □ Sem Prova
   □ Vagueza
   □ Irrelevância
   □ Menor de Dois Males
   □ Mentira
   □ Falsos Rótulos

   + CONAR (Brasil): precisas, comprováveis, não enganosas

   IA audita alegações vs dados reais

5. RELATÓRIO + CONDUTA
   - ISE B3 (Índice de Sustentabilidade Empresarial)
   - ISP (Investimento Social Privado)
   - RSC (Responsabilidade Social Corporativa)
   - Conecta com mercado real (dados do Business tab)
```

**Dados que cruzam com mercado:**
- IPCA → impacto no custo de compliance ESG
- PIB → disponibilidade de capital para sustentabilidade
- Setor heat → pressão do mercado por ESG naquele setor
- Commodities → pegada de carbono
- ISE B3 → benchmark com empresas do índice

**Ferramentas visuais:**
- Radar ESG (E/S/G scores 0-100)
- Matriz de Materialidade (interativa)
- Mapa ODS (17 com 3-5 destacados)
- Círculos Aninhados (Economia ⊂ Sociedade ⊂ Planeta)
- Checklist Anti-Greenwashing (verde/vermelho)

**7. Mercado & Concorrência**
- Conectado aos dados de Business
- TAM, SAM, SOM
- Posicionamento vs concorrentes

**8. Pessoas & Liderança**
- People analytics
- Headcount, payroll, retenção, eNPS
- Gap salarial, diversidade

**9. Processos & Operações**
- Jornada do cliente (acquisition → conversion → delivery → retention)
- Gargalos e digital twin
- Drag-and-drop

**10. Canvas & Pitch**
- Business Model Canvas
- Viabilidade financeira
- Pitch deck gerado por IA

---

## 4. ADMIN (FUNDADORA)

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

## 5. CAMADAS DE DADOS

```
C1 MERCADO GLOBAL → todos veem (público, Business tab)
C2 BENCHMARKS AGREGADOS → todos veem (anônimo, como bolsa)
C3 MEU WORKSPACE → só eu + admin
C4 MEUS CLIENTES → cada um vê só o seu + admin vê todos
```

---

## 6. TECNOLOGIA

### Stack
- Next.js 16 + React
- Supabase (auth + database + RLS)
- Vercel (deploy)
- ECharts (gráficos)
- Framer Motion (animações)

### IA
- Groq API + Llama 3.3 70B (grátis, ultra rápido)
- Cruza dados de mercado + dados do workspace
- Gera CONDUTA, análises, relatórios
- Cache 5 min para não desperdiçar requests

### APIs de Dados Reais
- BCB: SELIC (série 432)
- IBGE: IPCA (agregado 433), PIB (agregado 1621)
- AwesomeAPI: USD/BRL
- Yahoo Finance: commodities, ações de setores, agentes globais
- RSS: InfoMoney, Folha, G1, Canaltech, TechCrunch, Google News

### Segurança
- Supabase RLS: cada linha acessível só pelo dono
- Benchmarks sempre anônimos e agregados
- Consentimento explícito no cadastro
- Direito de exclusão total (LGPD)
- Dados individuais NUNCA aparecem publicamente

---

## 7. FASES DE CONSTRUÇÃO

### Fase 1: Business Tab com IA Nativa
- [ ] Remover caixa azul "ANÁLISE IA" separada
- [ ] IA cruza dados nativamente nos componentes
- [ ] News conectadas aos indicadores
- [ ] Marketing com LTV, ROI, unit economics completo
- [ ] Riscos com "como me beneficiar" em cada risco
- [ ] GROQ_API_KEY configurada no Vercel

### Fase 2: Workspace + Onboarding
- [ ] Renomear Admin → Workspace
- [ ] Fluxo de onboarding: PF/PJ → tipo → setor → produto
- [ ] IA monta workspace personalizado
- [ ] Conectar dados de mercado real aos 9 módulos
- [ ] IA Advisor cruza workspace + Business

### Fase 3: ESG Inteligente
- [ ] Diagnóstico IA → recomenda framework
- [ ] TBL, ESG Rating, GRI, ODS, CSV implementados
- [ ] Anti-Greenwashing check
- [ ] ISE B3, ISP, RSC integrados
- [ ] Ferramentas visuais (radar, matriz, mapa ODS)

### Fase 4: Admin/Fundadora
- [ ] Controle total de workspaces
- [ ] Big Data agregado + benchmark anônimo
- [ ] Gestão de equipes e acessos
- [ ] Analytics de uso
- [ ] Alertas quando mercado afeta workspaces

### Fase 5: CRM de Agentes
- [ ] Cadastro por tipo (Pessoa/Empresa/Startup)
- [ ] Cockpit individual conectado ao mercado
- [ ] IA gera CONDUTA por agente
- [ ] Panorama da carteira

---

## 8. O QUE O IPB NÃO É

- NÃO é um dashboard genérico com números bonitos
- NÃO é uma planilha glorificada
- NÃO é IA decorativa (caixa azul separada)
- NÃO é consultoria manual
- NÃO precisa de conhecimento econômico do usuário

## O QUE O IPB É

**Inteligência de mercado que cruza dados reais + workspace de gestão + IA que traduz e recomenda ação — de PF iniciante a empresa estabelecida.**
