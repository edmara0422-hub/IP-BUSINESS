'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useWorkspaceData } from '@/hooks/useWorkspaceData'
import {
  Target, AlertTriangle, TrendingUp, Loader2, Brain,
  ChevronRight, CheckCircle2, Circle, Zap, Info,
  Link2, RefreshCw, Building2, Users2, DollarSign,
  Activity, Server, UserCheck, Bell, Shield, Clock, BarChart2,
} from 'lucide-react'

const BLUE = '#1a5276'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const RED = '#c0392b'
const PURPLE = '#7d3c98'

// ─────────────────────────────────────────────
// TD PHASES — with auto-detection logic built in
// ─────────────────────────────────────────────
interface CheckItem {
  text: string
  autoCheck: boolean          // system already knows this is done
  evidence: string | null     // why it's auto-checked
  directive: string | null    // exactly what to do if not done
}

interface TDFase {
  label: string
  desc: string
  sinaisMercado: string
  esforco: string
  items: CheckItem[]
}

const TD_FASES: TDFase[] = [
  {
    label: 'Infra',
    desc: 'Infraestrutura básica digital instalada',
    sinaisMercado: 'Maioria usa email, WhatsApp e planilhas. Sem sistemas integrados.',
    esforco: 'Concluído',
    items: [
      { text: 'Cloud e email corporativo', autoCheck: true, evidence: 'Zoho Workplace — edmararbusiness1@er-site.com', directive: null },
      { text: 'Ferramentas de comunicação digital', autoCheck: true, evidence: 'Zoho Cliq + Meet (Workplace ativo)', directive: null },
      { text: 'Backup automático de dados', autoCheck: true, evidence: 'Supabase — backups diários automáticos', directive: null },
      { text: 'Segurança básica (2FA + senhas)', autoCheck: true, evidence: 'Supabase Auth + RLS em todas as tabelas', directive: null },
    ],
  },
  {
    label: 'Processo',
    desc: 'Processos internos digitalizados',
    sinaisMercado: 'Concorrentes usam CRM e ERP. Digitização de fluxos internos é padrão.',
    esforco: 'Médio — 1-3 meses',
    items: [
      { text: 'CRM implementado', autoCheck: true, evidence: 'Zoho CRM (Workplace) — já ativo', directive: null },
      { text: 'Processos-chave documentados', autoCheck: false, evidence: null, directive: 'Criar SOPs no Zoho WorkDrive para os 3 processos principais do IPB (onboarding, suporte, ciclo de produto)' },
      { text: 'Ao menos 1 automação ativa', autoCheck: false, evidence: null, directive: 'Configurar Zoho Flow: novo usuário cadastrado → notificação automática no Cliq + email de boas-vindas' },
      { text: 'Dashboard com métricas do negócio', autoCheck: true, evidence: 'IPB Cockpit — receita, margem, runway, health score', directive: null },
    ],
  },
  {
    label: 'Estratégia',
    desc: 'Tecnologia como vantagem competitiva',
    sinaisMercado: 'Líderes tomam decisões baseadas em dados. Tech está no planejamento estratégico.',
    esforco: 'Alto — 3-6 meses',
    items: [
      { text: 'Dados de clientes centralizados', autoCheck: false, evidence: null, directive: 'Integrar Zoho CRM com IPB via API — puxar receita por cliente para o Cockpit automaticamente' },
      { text: 'Decisões baseadas em dados (DDDM)', autoCheck: false, evidence: null, directive: 'Definir 3 KPIs semanais que guiam decisões. Revisar no painel Admin toda segunda-feira.' },
      { text: 'Produto com componente digital gerando valor', autoCheck: true, evidence: 'IPB é um produto digital SaaS — cursos + workspace ativo', directive: null },
      { text: 'Tech no planejamento estratégico anual', autoCheck: false, evidence: null, directive: 'Documentar roadmap de 12 meses no Zoho Projects. Revisar com OKRs trimestral.' },
    ],
  },
  {
    label: 'Digitização',
    desc: 'Dados e produtos digitais ativos',
    sinaisMercado: 'Novos entrantes nascem digitais. Produtos físicos têm extensões digitais.',
    esforco: 'Alto — 6-12 meses',
    items: [
      { text: 'Canal digital gerando receita recorrente', autoCheck: false, evidence: null, directive: 'Lançar plano pago do IPB com cobrança recorrente via Stripe/Pagar.me integrado ao Supabase' },
      { text: 'Dados como ativo estratégico', autoCheck: false, evidence: null, directive: 'Construir pipeline de dados: Zoho CRM → Supabase → análise de churn e LTV por segmento' },
      { text: 'Integrações via API com parceiros', autoCheck: false, evidence: null, directive: 'Conectar Zoho CRM ao IPB via OAuth — primeiro passo já identificado' },
      { text: 'Modelo híbrido em operação', autoCheck: false, evidence: null, directive: 'Criar versão mobile do IPB via Capacitor — já está na stack, falta publicar nas stores' },
    ],
  },
  {
    label: 'Digitalização',
    desc: 'Modelo de negócio digital-first',
    sinaisMercado: 'Plataformas dominam. Efeitos de rede são a principal vantagem.',
    esforco: 'Muito alto — 12-24 meses',
    items: [
      { text: 'Modelo digital-first implementado', autoCheck: false, evidence: null, directive: 'Mapear 100% da jornada do cliente como digital. Eliminar touchpoints manuais.' },
      { text: 'IA integrada em processo crítico', autoCheck: true, evidence: 'IA Advisor + análise financeira com IA + cockpit estratégico com IA', directive: null },
      { text: 'Escala sem custo proporcional', autoCheck: false, evidence: null, directive: 'Implementar serverless functions para onboarding e análise — zero custo fixo por usuário' },
      { text: 'Dados geram vantagem competitiva', autoCheck: false, evidence: null, directive: 'Construir benchmarks setoriais anônimos com dados agregados dos usuários do IPB' },
    ],
  },
  {
    label: 'Transformação',
    desc: 'Empresa reinventada pela tecnologia',
    sinaisMercado: 'Empresas de tech redefinem setores tradicionais.',
    esforco: 'Horizonte de longo prazo',
    items: [],
  },
]

// Build auto-checked state from system knowledge
function buildAutoState(): boolean[][] {
  return TD_FASES.slice(0, 5).map(f => f.items.map(item => item.autoCheck))
}

// Detect correct starting phase based on auto-checks
function detectStartingPhase(checks: boolean[][]): number {
  for (let i = 0; i < checks.length; i++) {
    if (!checks[i].every(Boolean)) return i
  }
  return TD_FASES.length - 1
}

// ─────────────────────────────────────────────
// SGI+TD — pre-assessed based on known facts
// ─────────────────────────────────────────────
interface MaturityItem {
  key: string
  label: string
  desc: string
  autoValue: number       // 0=não iniciado, 1=em desenvolvimento, 2=implementado, 3=otimizado
  autoEvidence: string
  gap: string | null      // what's missing to reach next level
}

const SGI_ELEMENTOS: MaturityItem[] = [
  { key: 'sgiEstrutura', label: '🏗️ Estrutura de Projetos', desc: 'SGI gerencia incertezas; TD fornece colaboração em tempo real', autoValue: 1, autoEvidence: 'Zoho Projects disponível, ainda não estruturado com metodologia', gap: 'Definir squads e sprints no Zoho Projects. Meta: 1 sprint de 2 semanas rodando.' },
  { key: 'sgiProcessos', label: '⚙️ Processos', desc: 'SGI organiza ideação; TD automatiza o funil e coleta feedbacks', autoValue: 1, autoEvidence: 'IPB tem funil de inovação mapeado, falta automação de coleta de feedback', gap: 'Ativar Zoho Flow para coletar feedback automaticamente após cada sessão do usuário' },
  { key: 'sgiCultura', label: '🧬 Cultura', desc: 'SGI estimula experimentação; TD democratiza dados para decisões ágeis', autoValue: 0, autoEvidence: 'Não avaliado ainda', gap: 'Definir rituais de inovação: weekly de 30min para revisar o que aprendemos + o que testamos' },
  { key: 'sgiResultados', label: '📈 Resultados', desc: 'SGI foca no ROI estratégico; TD entrega analytics para medir impacto', autoValue: 1, autoEvidence: 'Cockpit Financeiro ativo com health score, mas sem benchmark externo ainda', gap: 'Conectar Cockpit ao Zoho Analytics para visualização histórica e projeções' },
]

const DDDM_PILARES: MaturityItem[] = [
  { key: 'dddmColeta', label: '💾 Coleta e Armazenamento', desc: 'Capturar dados de forma eficiente via APIs, IoT, formulários', autoValue: 2, autoEvidence: 'Supabase ativo com tabelas estruturadas + APIs de mercado (BCB, Brapi, AwesomeAPI)', gap: 'Adicionar coleta de comportamento do usuário (páginas visitadas, tempo de uso)' },
  { key: 'dddmAnalise', label: '🧠 Análise e Processamento', desc: 'Extração de informações via modelos e IA', autoValue: 1, autoEvidence: 'IA Advisor analisa dados sob demanda, falta análise automática e contínua', gap: 'Criar job semanal automático: IA analisa health score de todos os usuários e gera alerta se deteriorar' },
  { key: 'dddmVisualizacao', label: '📈 Visualização e Comunicação', desc: 'Apresentação clara para não-especialistas agirem', autoValue: 2, autoEvidence: 'IPB Cockpit Financeiro + ESG + Cenários + Pricing — todos com visualização', gap: 'Adicionar comparativo histórico (mês a mês) nos indicadores do Cockpit' },
  { key: 'dddmIntegracao', label: '🎯 Integração Estratégica', desc: 'Insights nos processos decisórios diários da liderança', autoValue: 1, autoEvidence: 'Este painel Admin está sendo construído para isso — em andamento', gap: 'Tornar a Reflexão com IA automática toda segunda-feira às 8h via notificação push' },
]

// ─────────────────────────────────────────────
// TENDÊNCIAS — pre-assessed
// ─────────────────────────────────────────────
interface TendenciaItem {
  key: string
  label: string
  desc: string
  autoValue: number
  autoEvidence: string
  risco: string
  proximo: string
}

const TENDENCIAS: TendenciaItem[] = [
  {
    key: 'tendAgentesIA',
    label: '🤖 Agentes de IA Autônomos',
    desc: 'IA com percepção, raciocínio adaptativo e ação autônoma. Redefine governança.',
    autoValue: 1,
    autoEvidence: 'IPB tem IA Advisor ativo (Groq Llama 3.3). Ainda reativo — só responde quando chamado.',
    risco: 'Concorrentes que ativarem agentes autônomos vão entregar análises antes de você perguntar.',
    proximo: 'Implementar análise proativa: IA detecta queda de margem no Cockpit e avisa automaticamente',
  },
  {
    key: 'tendRegTech',
    label: '⚖️ RegTech e Compliance Automatizado',
    desc: 'IA automatiza verificações regulatórias. Compliance vira motor de confiança.',
    autoValue: 1,
    autoEvidence: 'Módulo de Governança e Canal de Denúncias ativos. Sem automação de verificação ainda.',
    risco: 'Quem não automatiza compliance paga mais e erra mais — especialmente com LGPD evoluindo.',
    proximo: 'Automatizar relatório de conformidade LGPD mensal via IA — zero trabalho manual',
  },
  {
    key: 'tendAmbidestra',
    label: '🔀 Inovação Ambidestra',
    desc: 'Eficiência operacional + experimentação simultânea. O maior desafio da próxima década.',
    autoValue: 2,
    autoEvidence: 'IPB opera H1 (cursos + workspace) enquanto constrói H3 (IA cockpit estratégico). Ambidestra na prática.',
    risco: 'Focar só em eficiência = estagnação. Só em inovação = caos sem receita.',
    proximo: 'Formalizar os 3 Horizontes na aba Inovação e revisar distribuição de esforço toda sprint',
  },
]

const TEND_POSICAO = ['Não monitorando', 'Estudando / Pilotando', 'Implementado', 'Liderando']
const TEND_COLORS = ['rgba(255,255,255,0.15)', AMBER, '#5dade2', GREEN]

// ─────────────────────────────────────────────
// SUSTENTABILIDADE — auto-detected
// ─────────────────────────────────────────────
interface SustItem {
  text: string
  autoCheck: boolean
  evidence: string | null
  directive: string | null
}

const SUST_ITEMS: SustItem[] = [
  { text: '100% digital — zero papel em operações', autoCheck: true, evidence: 'IPB é SaaS — todas as operações são digitais por design', directive: null },
  { text: 'Cache inteligente reduz chamadas desnecessárias', autoCheck: true, evidence: 'APIs com TTL configurado (market data 5min, IA com cache)', directive: null },
  { text: 'Lazy loading e compressão de assets', autoCheck: true, evidence: 'Next.js com dynamic imports — todos os módulos carregam sob demanda', directive: null },
  { text: 'Hospedagem em infraestrutura verde', autoCheck: true, evidence: 'Vercel (edge computing) + Supabase (AWS com meta de energia renovável)', directive: null },
  { text: 'Monitoramento de pegada de carbono digital', autoCheck: false, evidence: null, directive: 'Configurar Website Carbon Calculator — mede emissões por pageview. Meta: <0.5g CO₂/visita' },
  { text: 'Meta de compensação de emissões definida', autoCheck: false, evidence: null, directive: 'Definir meta: compensar 100% das emissões via crédito de carbono verificado até Q4 2026' },
]

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
interface OKR { objetivo: string; krs: { texto: string; pct: number }[] }

interface CockpitState {
  faseEmpresa: number
  faseMercado: number
  checkEmpresa: boolean[][]
  targetNextPhase: string
  sgiEstrutura: number; sgiProcessos: number; sgiCultura: number; sgiResultados: number
  dddmColeta: number; dddmAnalise: number; dddmVisualizacao: number; dddmIntegracao: number
  tendAgentesIA: number; tendRegTech: number; tendAmbidestra: number
  sustDigital: boolean[]
  iaReflexao: string
  bootstrapped: boolean
  bootstrappedInovacao: boolean
  tipoInovacao: string; intensidade: string; faseHype: number; trl: number
  fasesFunil: boolean[]; h1: number; h2: number; h3: number; reflexaoInovacao: string
  okrs: OKR[]
  govEstrategia: boolean[]; govRiscos: boolean[]; govPoliticas: boolean[]; govMonitoramento: boolean[]
  reflexaoGov: string
  norteStar: string; cultura: string; reflexaoNorte: string
  // Execução Comercial
  sprintDias: boolean[]
  semanas4: boolean[][]
  logAdmin: string
  // Pessoas — Processo de Liderança para Resultados
  pesLiderados: number
  pesMetaEquipe: string
  pesKpiEquipe: string
  pesUltimo1a1: string
  pesAcordos: string
  pesGapHabilidade: string
  pesPlanoDev: string
  pesRituais: boolean[]
  pesPerfScore: number
  pesReconhecimento: boolean
  pesReflexao: string
}

const AUTO_CHECKS = buildAutoState()
const AUTO_PHASE = detectStartingPhase(AUTO_CHECKS)

const DEFAULT: CockpitState = {
  faseEmpresa: AUTO_PHASE,
  faseMercado: 1,
  checkEmpresa: AUTO_CHECKS,
  targetNextPhase: '',
  sgiEstrutura: 1, sgiProcessos: 1, sgiCultura: 0, sgiResultados: 1,
  dddmColeta: 2, dddmAnalise: 1, dddmVisualizacao: 2, dddmIntegracao: 1,
  tendAgentesIA: 1, tendRegTech: 1, tendAmbidestra: 2,
  sustDigital: SUST_ITEMS.map(i => i.autoCheck),
  iaReflexao: '',
  bootstrapped: true,
  bootstrappedInovacao: false,
  tipoInovacao: '', intensidade: '', faseHype: 0, trl: 3,
  fasesFunil: [false, false, false, false, false],
  h1: 70, h2: 20, h3: 10, reflexaoInovacao: '',
  okrs: [
    { objetivo: '', krs: [{ texto: '', pct: 0 }, { texto: '', pct: 0 }, { texto: '', pct: 0 }] },
    { objetivo: '', krs: [{ texto: '', pct: 0 }, { texto: '', pct: 0 }, { texto: '', pct: 0 }] },
  ],
  govEstrategia: [false, false, false, false],
  govRiscos: [false, false, false, false],
  govPoliticas: [false, false, false, false],
  govMonitoramento: [false, false, false, false],
  reflexaoGov: '',
  norteStar: '', cultura: '', reflexaoNorte: '',
  sprintDias: Array(7).fill(false),
  semanas4: [[false,false,false],[false,false,false],[false,false,false],[false,false,false]],
  logAdmin: '',
  pesLiderados: 0,
  pesMetaEquipe: '',
  pesKpiEquipe: '',
  pesUltimo1a1: '',
  pesAcordos: '',
  pesGapHabilidade: '',
  pesPlanoDev: '',
  pesRituais: [false, false, false],
  pesPerfScore: 0,
  pesReconhecimento: false,
  pesReflexao: '',
}

const COCKPIT_DEFAULT = { receita: 0, despesas: 0, caixa: 0, cac: 0 }

// ─────────────────────────────────────────────
// HYPE / FUNIL / GOV constants
// ─────────────────────────────────────────────
const HYPE_FASES = [
  { label: 'Gatilho Tecnológico', desc: 'Nova tecnologia surge. Interesse da mídia.' },
  { label: 'Pico de Expectativas', desc: 'Entusiasmo excessivo. Expectativas irrealistas.' },
  { label: 'Vale da Desilusão', desc: 'Falhas. Interesse diminui. Empresas fracas morrem.' },
  { label: 'Encosta da Iluminação', desc: 'Casos reais funcionam. Benefícios ficam claros.' },
  { label: 'Platô de Produtividade', desc: 'Tecnologia madura, amplamente adotada.' },
]
const FUNIL_FASES = [
  'Fuzzy Front-End — Ideias brutas, divergir é necessário',
  'Stage Gate 1 — Triagem (alinhamento, viabilidade, go/no-go)',
  'Desenvolvimento — Prototipagem, testes, validação técnica',
  'Stage Gate 2 — Decisão final (ROI, mercado validado?)',
  'Lançamento e Escala — Go-to-market, métricas, ciclo reinicia',
]
interface GovItem { text: string; autoCheck: boolean; evidence: string | null; directive: string | null }
const GOV_CHECKS: Record<string, GovItem[]> = {
  govEstrategia: [
    { text: 'Tecnologia alinhada à estratégia de longo prazo', autoCheck: true, evidence: 'IPB é o produto — tech É a estratégia', directive: null },
    { text: 'Prioridades e investimentos em tech definidos', autoCheck: true, evidence: 'TD + OKRs ativos no painel Admin', directive: null },
    { text: 'Indicadores de resultado mapeados', autoCheck: true, evidence: 'Cockpit Financeiro: receita, margem, runway, health score', directive: null },
    { text: 'Roadmap de 12 meses atualizado', autoCheck: false, evidence: null, directive: 'Documentar roadmap no Zoho Projects com marcos trimestrais e revisar com OKRs' },
  ],
  govRiscos: [
    { text: 'Ameaças identificadas e avaliadas', autoCheck: false, evidence: null, directive: 'Mapear top 5 riscos do IPB (churn, segurança, concorrência, dependência de APIs, infra) e definir mitigações' },
    { text: 'Criptografia e 2FA ativos em todas as contas', autoCheck: true, evidence: 'Supabase Auth + RLS em todas as tabelas + HTTPS via Vercel', directive: null },
    { text: 'Plano de resposta a incidentes documentado', autoCheck: false, evidence: null, directive: 'Criar runbook no Zoho WorkDrive: o que fazer se Supabase cair, se dados vazarem, se Vercel sair do ar' },
    { text: 'Treinamento de segurança realizado no time', autoCheck: false, evidence: null, directive: 'Conduzir sessão de 1h sobre: senhas seguras, phishing, acesso a dados de clientes' },
  ],
  govPoliticas: [
    { text: 'Política de uso de dados definida (LGPD)', autoCheck: false, evidence: null, directive: 'Criar documento de política de privacidade e termos de uso — publicar em ip-business-ten.vercel.app/privacidade' },
    { text: 'Acesso a dados sensíveis controlado por role', autoCheck: true, evidence: 'Supabase RLS ativo — cada usuário acessa só os próprios dados, admin acessa tudo', directive: null },
    { text: 'Política de fornecedores ESG aplicada', autoCheck: false, evidence: null, directive: 'Mapear fornecedores (Vercel, Supabase, Zoho, Groq) com critérios ESG e documentar no Zoho WorkDrive' },
    { text: 'Código de conduta digital publicado', autoCheck: false, evidence: null, directive: 'Criar código de conduta para uso do IPB e comunicar a todos os usuários por email via Zoho' },
  ],
  govMonitoramento: [
    { text: 'Monitoramento de uptime ativo', autoCheck: true, evidence: 'Vercel monitoring automático + healthz endpoint ativo em /api/healthz', directive: null },
    { text: 'Logs de acesso armazenados (mín. 6 meses)', autoCheck: true, evidence: 'Supabase logs + Vercel logs retidos automaticamente', directive: null },
    { text: 'Revisão trimestral de ferramentas e custos', autoCheck: false, evidence: null, directive: 'Agendar revisão trimestral: custos Vercel + Supabase + Zoho + Groq vs valor gerado' },
    { text: 'Métricas de impacto acompanhadas toda semana', autoCheck: true, evidence: 'IPB Cockpit + painel Admin — health score, OKRs e TD revisados semanalmente', directive: null },
  ],
}
const GOV_LABELS: Record<string, string> = { govEstrategia: '🎯 Estratégia', govRiscos: '🛡️ Riscos', govPoliticas: '📋 Políticas', govMonitoramento: '🔄 Monitoramento' }
const GOV_COLORS: Record<string, string> = { govEstrategia: BLUE, govRiscos: RED, govPoliticas: AMBER, govMonitoramento: GREEN }
const MATURITY = ['Não iniciado', 'Em desenvolvimento', 'Implementado', 'Otimizado']
const MATURITY_COLORS = ['rgba(255,255,255,0.2)', AMBER, '#5dade2', GREEN]

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// OKRs — sugestão automática baseada no diagnóstico
// ─────────────────────────────────────────────
function suggestOKRs(faseEmpresa: number, faseHype: number, trl: number, fasesFunil: boolean[]): OKR[] {
  const funilAtual = fasesFunil.lastIndexOf(true) + 1
  const okrs: OKR[] = []

  // OKR 1: baseado na fase TD atual
  if (faseEmpresa <= 1) {
    okrs.push({
      objetivo: 'Completar Fase 2 (Processo) e avançar para Estratégia',
      krs: [
        { texto: 'Criar SOPs dos 3 processos principais no Zoho WorkDrive', pct: 0 },
        { texto: 'Ter 1 automação ativa via Zoho Flow (onboarding automático)', pct: 0 },
        { texto: 'Revisar OKRs toda segunda-feira por 8 semanas consecutivas', pct: 0 },
      ],
    })
  } else if (faseEmpresa <= 2) {
    okrs.push({
      objetivo: 'Tornar decisões baseadas em dados (DDDM) padrão na operação',
      krs: [
        { texto: 'Definir 3 KPIs semanais revisados toda segunda-feira', pct: 0 },
        { texto: 'Centralizar dados de clientes no Zoho CRM → IPB Cockpit', pct: 0 },
        { texto: 'Documentar roadmap de 12 meses no Zoho Projects', pct: 0 },
      ],
    })
  } else {
    okrs.push({
      objetivo: 'Escalar operação com dados como ativo estratégico',
      krs: [
        { texto: 'Lançar canal digital com receita recorrente ativa', pct: 0 },
        { texto: 'Pipeline de dados Zoho CRM → análise de churn e LTV', pct: 0 },
        { texto: 'Benchmarks setoriais gerados automaticamente', pct: 0 },
      ],
    })
  }

  // OKR 2: baseado na janela de inovação (Hype + TRL + Funil)
  if (faseHype === 3 && trl >= 7) {
    okrs.push({
      objetivo: 'Capturar janela de mercado de IA — escalar aquisição de clientes agora',
      krs: [
        { texto: 'Atingir primeiros 50 usuários pagos no IPB até próximo trimestre', pct: 0 },
        { texto: 'MRR de R$5.000 com churn < 10% no primeiro trimestre', pct: 0 },
        { texto: funilAtual < 4 ? 'Passar o funil de inovação para Stage Gate 2 (ROI validado)' : 'Lançar go-to-market com métricas de crescimento semanais', pct: 0 },
      ],
    })
  } else if (trl < 7) {
    okrs.push({
      objetivo: 'Amadurecer o produto para nível de escala (TRL 7→9)',
      krs: [
        { texto: 'Validar tecnicamente com 10 usuários reais em ambiente de produção', pct: 0 },
        { texto: 'Reduzir bugs críticos a zero e latência < 2s em todas as telas', pct: 0 },
        { texto: 'Publicar IPB nas App Stores (iOS + Android) via Capacitor', pct: 0 },
      ],
    })
  } else {
    okrs.push({
      objetivo: 'Diferenciar o IPB em mercado maduro de IA',
      krs: [
        { texto: 'Lançar feature exclusiva não replicável por concorrentes em 90 dias', pct: 0 },
        { texto: 'NPS acima de 8 com pelo menos 20 respondentes', pct: 0 },
        { texto: 'Case de sucesso documentado de 1 cliente usando o IPB', pct: 0 },
      ],
    })
  }

  return okrs
}

// Monitor types
// ─────────────────────────────────────────────
interface Feedback { id: string; nps_score: number | null; category: string | null; message: string | null; created_at: string }
interface Denuncia { id: string; tipo: string; descricao: string; created_at: string }
function timeAgo(d: string) { const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000); return m < 60 ? `${m}min` : m < 1440 ? `${Math.floor(m / 60)}h` : `${Math.floor(m / 1440)}d` }
function npsColor(sc: number | null) { return sc === null ? 'rgba(255,255,255,0.3)' : sc >= 9 ? GREEN : sc >= 7 ? AMBER : RED }

// ─────────────────────────────────────────────
// INOVAÇÃO — síntese automática (rule-based, sem API)
// ─────────────────────────────────────────────
interface InovacaoSintese {
  janela: 'urgente' | 'favoravel' | 'aguardar' | 'matura'
  janelaLabel: string
  janelaColor: string
  prioridade: string
  acoes: string[]
  alerta: string | null
}

function getInovacaoSintese(
  tipo: string, intensidade: string,
  h1: number, h2: number, h3: number,
  fasesFunil: boolean[], faseHype: number, trl: number
): InovacaoSintese | null {
  if (!tipo || !intensidade) return null

  // Janela de mercado baseada no Hype Cycle
  const janelaMap: Record<number, { janela: InovacaoSintese['janela']; label: string; color: string }> = {
    0: { janela: 'aguardar', label: 'Aguardar — tecnologia emergindo', color: '#9a7d0a' },
    1: { janela: 'aguardar', label: 'Cuidado — pico de expectativas, hype perigoso', color: '#c0392b' },
    2: { janela: 'favoravel', label: 'Oportunidade — vale da desilusão, consolidar posição', color: '#9a7d0a' },
    3: { janela: 'urgente', label: 'JANELA ABERTA — encosta da iluminação, agir agora', color: '#1e8449' },
    4: { janela: 'matura', label: 'Mercado maduro — diferenciação é crítica', color: '#5dade2' },
  }
  const { janela, label: janelaLabel, color: janelaColor } = janelaMap[faseHype] ?? janelaMap[0]

  // Funil — qual a próxima fase
  const funilAtual = fasesFunil.lastIndexOf(true) + 1 // 0 = nenhuma, 1-5 = fase concluída
  const funilProximos: Record<number, string> = {
    0: 'Iniciar o funil: registre as ideias brutas e aplique divergência criativa',
    1: 'Avançar para Stage Gate 1: triagem com critérios de alinhamento e viabilidade',
    2: 'Iniciar desenvolvimento: prototipar, testar, validar tecnicamente',
    3: 'Avançar para Stage Gate 2: validar ROI esperado e mercado antes de escalar',
    4: 'Lançar e escalar: definir go-to-market, métricas de crescimento e ciclo de feedback',
    5: 'Funil completo: reiniciar o ciclo com novos problemas identificados no mercado',
  }
  const funilAcao = funilProximos[funilAtual] ?? funilProximos[0]

  // TRL — maturidade da tecnologia
  let trlAcao: string
  if (trl <= 3) trlAcao = 'TRL baixo: valide o conceito com protótipos antes de qualquer investimento de escala'
  else if (trl <= 6) trlAcao = 'TRL médio: foco em validação técnica e primeiros usuários reais — não otimize antes de validar'
  else if (trl <= 8) trlAcao = 'TRL 7-8: produto qualificado para escala — pare de construir features e comece a escalar aquisição'
  else trlAcao = 'TRL 9: tecnologia madura — foco em eficiência operacional e expansão de mercado'

  // Horizontes — diagnóstico de distribuição
  let horizonteAlerta: string | null = null
  if (h1 > 80) horizonteAlerta = `H1 em ${h1}% — risco de estagnação. Aumente H2/H3 ou você para de crescer.`
  else if (h1 < 40) horizonteAlerta = `H1 em ${h1}% — receita atual em risco. Garanta o core antes de inovar.`
  else if (h3 > 30) horizonteAlerta = `H3 em ${h3}% — aposta alta sem base sólida. Reequilibre com mais H1.`

  // Intensidade — risco específico
  const intensidadeRisco: Record<string, string> = {
    arquitetonica: 'Inovação arquitetônica: cada mudança afeta modelo E tecnologia em cascata — governe cada decisão',
    disruptiva: 'Inovação disruptiva: prepare resistência interna. Mudança de paradigma leva 2-3x mais tempo que o planejado',
    radical: 'Inovação radical: invista em competências novas ANTES de acelerar execução',
    rotina: 'Inovação incremental: eficiente mas insuficiente para liderar. Aumente H2/H3 ou será ultrapassado',
  }

  // Prioridade síntese
  let prioridade: string
  if (janela === 'urgente' && trl >= 7) {
    prioridade = 'Janela aberta + produto pronto: prioridade máxima é ESCALA. Pare de construir e comece a adquirir clientes agora.'
  } else if (janela === 'urgente' && trl < 7) {
    prioridade = 'Janela aberta mas produto ainda amadurecendo: acelere o TRL. Cada mês de atraso é posição perdida no mercado.'
  } else if (janela === 'favoravel' && trl >= 7) {
    prioridade = 'Momento favorável com produto pronto: consolide sua posição enquanto concorrentes ainda saem do vale.'
  } else if (janela === 'aguardar') {
    prioridade = 'Momento de preparação: construa capacidade interna. Não escale marketing ainda — o mercado não está pronto.'
  } else {
    prioridade = 'Mercado maduro: diferenciação é o único caminho. Defina o que o IPB faz que ninguém mais faz.'
  }

  return {
    janela, janelaLabel, janelaColor, prioridade,
    acoes: [funilAcao, trlAcao, intensidadeRisco[intensidade] ?? ''],
    alerta: horizonteAlerta,
  }
}

// ─────────────────────────────────────────────
// Section header
// ─────────────────────────────────────────────
function SectionHeader({ label, color = 'rgba(255,255,255,0.12)' }: { label: string; color?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1" style={{ background: color, opacity: 0.4 }} />
      <span className="text-[9px] font-mono uppercase tracking-[0.22em] shrink-0" style={{ color }}>{label}</span>
      <div className="h-px flex-1" style={{ background: color, opacity: 0.4 }} />
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
type AdminTab = 'td' | 'inovacao' | 'okrs' | 'gov' | 'norte' | 'monitor' | 'execucao' | 'pessoas'

export default function AdminPanel() {
  const [tab, setTab] = useState<AdminTab>('td')
  const { data: s, update } = useWorkspaceData<CockpitState>('admin-cockpit', DEFAULT)
  const { data: cockpit } = useWorkspaceData('cockpit', COCKPIT_DEFAULT)
  const [iaLoading, setIaLoading] = useState(false)
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [denuncias, setDenuncias] = useState<Denuncia[]>([])
  const [monitorLoading, setMonitorLoading] = useState(false)
  const [zohoStatus, setZohoStatus] = useState<{ configured: boolean; connected: boolean; level: number; org?: { name?: string } | null } | null>(null)
  const [zohoData, setZohoData] = useState<{ summary?: { totalDeals: number; totalPipeline: number; wonThisMonth: number; totalContacts: number }; pipeline?: { stage: string; count: number; value: number }[] } | null>(null)
  const [zohoLoading, setZohoLoading] = useState(false)
  const [stackHealth, setStackHealth] = useState<{ ok: boolean; latencyMs: number | null } | null>(null)
  const [userStats, setUserStats] = useState<{ total: number; newThisWeek: number } | null>(null)
  const [openScript, setOpenScript] = useState<'entrevista' | 'objecao' | null>(null)
  const [pesExpandIdx, setPesExpandIdx] = useState<number | null>(0)
  const [pesIaLoading, setPesIaLoading] = useState(false)
  const [pesIaAnswer, setPesIaAnswer] = useState('')

  // Bootstrap: apply auto-facts on first load if not yet done
  useEffect(() => {
    if (!s.bootstrapped) {
      update({
        faseEmpresa: AUTO_PHASE,
        faseMercado: 1,
        checkEmpresa: AUTO_CHECKS,
        sgiEstrutura: 1, sgiProcessos: 1, sgiCultura: 0, sgiResultados: 1,
        dddmColeta: 2, dddmAnalise: 1, dddmVisualizacao: 2, dddmIntegracao: 1,
        tendAgentesIA: 1, tendRegTech: 1, tendAmbidestra: 2,
        sustDigital: SUST_ITEMS.map(i => i.autoCheck),
        bootstrapped: true,
      })
    }
  }, [s.bootstrapped]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-detecta Inovação na primeira abertura
  useEffect(() => {
    if (!s.bootstrappedInovacao) {
      update({
        // IPB é produto SaaS com IA — arquitetônica afeta modelo + tecnologia
        tipoInovacao: 'produto',
        intensidade: 'arquitetonica',
        // 3 Horizontes: H1=core IPB, H2=integrações(Zoho/mobile), H3=IA estratégica
        h1: 60, h2: 30, h3: 10,
        // Funil: ideia→gate→desenvolvimento (F1-3 concluídos), F4-5 em curso
        fasesFunil: [true, true, true, false, false],
        // Hype Cycle: IA em 2025 está na Encosta da Iluminação (casos reais funcionando)
        faseHype: 3,
        // TRL: sistema em produção real → TRL 7 (sistema completo e qualificado)
        trl: 7,
        bootstrappedInovacao: true,
      })
    }
  }, [s.bootstrappedInovacao]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-avança a fase se todos os itens da fase atual já estão verificados pelo sistema
  useEffect(() => {
    if (!s.bootstrapped) return
    const currentFase = TD_FASES[s.faseEmpresa]
    if (!currentFase || currentFase.items.length === 0) return
    const storedChecks = (s.checkEmpresa ?? [])[s.faseEmpresa] ?? []
    const allDone = currentFase.items.every((item, ci) => item.autoCheck || (storedChecks[ci] ?? false))
    if (allDone && s.faseEmpresa < TD_FASES.length - 1) {
      update({ faseEmpresa: s.faseEmpresa + 1 })
    }
  }, [s.bootstrapped, s.faseEmpresa, s.checkEmpresa]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadMonitor = async () => {
    setMonitorLoading(true)
    try {
      const supabase = createClient()
      const [fbRes, dnRes] = await Promise.all([
        supabase.from('feedbacks').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('denuncias').select('*').order('created_at', { ascending: false }).limit(50),
      ])
      if (fbRes.data) setFeedbacks(fbRes.data)
      if (dnRes.data) setDenuncias(dnRes.data)
    } catch { /* silent */ }
    finally { setMonitorLoading(false) }
  }

  const loadZoho = async () => {
    setZohoLoading(true)
    try {
      const status = await fetch('/api/zoho/status').then(r => r.json())
      setZohoStatus(status)
      if (status.connected) {
        const crm = await fetch('/api/zoho/crm').then(r => r.json())
        if (!crm.error) setZohoData(crm)
      }
    } catch { /* silent */ }
    finally { setZohoLoading(false) }
  }

  const loadStack = async () => {
    try {
      const t0 = Date.now()
      const res = await fetch('/api/healthz')
      const latencyMs = Date.now() - t0
      setStackHealth({ ok: res.ok, latencyMs })
    } catch {
      setStackHealth({ ok: false, latencyMs: null })
    }
    try {
      const supabase = createClient()
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const [{ count: total }, { count: newThisWeek }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
      ])
      setUserStats({ total: total ?? 0, newThisWeek: newThisWeek ?? 0 })
    } catch { /* silent */ }
  }

  useEffect(() => { if (tab === 'monitor') { loadMonitor(); loadZoho(); loadStack() } }, [tab]) // eslint-disable-line react-hooks/exhaustive-deps

  const checkEmpresa: boolean[][] = (() => {
    const ex = s.checkEmpresa ?? []
    return TD_FASES.slice(0, 5).map((f, i) => ex[i] ?? f.items.map(() => false))
  })()

  const toggleCheck = (pi: number, ci: number) => {
    // Only allow toggling non-auto items
    if (TD_FASES[pi]?.items[ci]?.autoCheck) return
    const next = checkEmpresa.map((row, p) => p === pi ? row.map((v, c) => c === ci ? !v : v) : [...row])
    update({ checkEmpresa: next })
  }

  const gap = s.faseMercado - s.faseEmpresa

  // IA — reads everything including financials
  const handleIA = async () => {
    setIaLoading(true)
    try {
      let marketCtx = ''
      try {
        const mkt = await fetch('/api/market').then(r => r.json())
        marketCtx = `SELIC ${mkt?.macro?.selic?.value ?? '—'}%, IPCA ${mkt?.macro?.ipca?.value ?? '—'}%, USD/BRL ${mkt?.macro?.usdBrl?.value ?? '—'}`
      } catch { /* continue */ }

      const fin = cockpit as typeof COCKPIT_DEFAULT
      const margem = fin.receita > 0 ? Math.round(((fin.receita - fin.despesas) / fin.receita) * 100) : 0
      const runway = fin.despesas > 0 ? Math.round(fin.caixa / fin.despesas) : 0

      const currentFase = TD_FASES[s.faseEmpresa]
      const pending = currentFase?.items.filter((item, i) => !checkEmpresa[s.faseEmpresa]?.[i]).map(i => i.directive ?? i.text).join('; ')

      const sgiAvg = Math.round(([s.sgiEstrutura, s.sgiProcessos, s.sgiCultura, s.sgiResultados].reduce((a, b) => a + b, 0)) / 4)
      const dddmAvg = Math.round(([s.dddmColeta, s.dddmAnalise, s.dddmVisualizacao, s.dddmIntegracao].reduce((a, b) => a + b, 0)) / 4)
      const sustDone = (s.sustDigital ?? []).filter(Boolean).length

      const okrSummary = s.okrs.map((o, i) => `OKR${i + 1}: "${o.objetivo}" | ${o.krs.map(k => `${k.texto}(${k.pct}%)`).join(', ')}`).join('. ')

      const prompt = `Você é um consultor sênior de transformação digital. Analise os dados reais abaixo e gere uma reflexão estratégica em 3 seções:

1. DIAGNÓSTICO — síntese da posição atual com base nos dados
2. PRIORIDADE — a 1 ação mais importante dos próximos 30 dias com justificativa financeira
3. PRÓXIMOS 7 DIAS — 3 ações específicas e executáveis

POSIÇÃO TD:
- Empresa: F${s.faseEmpresa + 1} (${TD_FASES[s.faseEmpresa]?.label}) | Mercado: F${s.faseMercado + 1} (${TD_FASES[s.faseMercado]?.label})
- Gap: ${gap > 0 ? `${gap} fase(s) atrás — risco silencioso` : gap < 0 ? `${Math.abs(gap)} fases à frente` : 'alinhado'}
- Itens pendentes nesta fase: ${pending || 'nenhum — pronto para avançar'}

MATURIDADE (0-3):
- SGI+TD média: ${MATURITY[sgiAvg]} | DDDM média: ${MATURITY[dddmAvg]}
- Tendências: IA Autônoma=${TEND_POSICAO[s.tendAgentesIA ?? 0]}, RegTech=${TEND_POSICAO[s.tendRegTech ?? 0]}, Ambidestra=${TEND_POSICAO[s.tendAmbidestra ?? 0]}
- Sustentabilidade: ${sustDone}/${SUST_ITEMS.length} práticas

FINANCEIRO REAL:
- Receita R$${fin.receita.toLocaleString('pt-BR')} | Despesas R$${fin.despesas.toLocaleString('pt-BR')}
- Margem ${margem}% | Runway ${runway} meses | Caixa R$${fin.caixa.toLocaleString('pt-BR')}
- Macro: ${marketCtx}

ESTRATÉGIA:
- OKRs: ${okrSummary || 'não definidos ainda'}
- Norte: ${s.norteStar || 'não definido'}

Use os dados financeiros para calibrar urgência. Se runway < 6 meses, priorize receita. Se margem < 10%, priorize custos. Seja direto, específico, sem rodeios. Máx 250 palavras.`

      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: prompt, marketContext: marketCtx }),
      })
      const data = await res.json()
      update({ iaReflexao: data.answer ?? data.response ?? data.content ?? 'Sem resposta.' })
    } catch {
      update({ iaReflexao: 'Erro ao conectar. Tente novamente.' })
    } finally { setIaLoading(false) }
  }

  const npsScores = feedbacks.filter(f => f.nps_score !== null).map(f => f.nps_score as number)
  const npsAvg = npsScores.length > 0 ? (npsScores.reduce((a, b) => a + b, 0) / npsScores.length).toFixed(1) : '—'
  const promoters = npsScores.filter(n => n >= 9).length
  const detractors = npsScores.filter(n => n <= 6).length
  const npsNet = npsScores.length > 0 ? Math.round(((promoters - detractors) / npsScores.length) * 100) : 0

  // Smart alerts — rule-based, no API
  const monitorAlertas: { level: 'red' | 'amber' | 'green'; icon: string; titulo: string; detalhe: string }[] = (() => {
    const fin = cockpit as typeof COCKPIT_DEFAULT
    const margem = fin.receita > 0 ? Math.round(((fin.receita - fin.despesas) / fin.receita) * 100) : 0
    const runway = fin.despesas > 0 ? Math.round(fin.caixa / fin.despesas) : 99
    const alerts: { level: 'red' | 'amber' | 'green'; icon: string; titulo: string; detalhe: string }[] = []
    if (fin.despesas > 0 && runway < 3) alerts.push({ level: 'red', icon: '🔴', titulo: `Runway crítico: ${runway} meses`, detalhe: 'Prioridade máxima: aumentar receita ou cortar despesas hoje.' })
    else if (fin.despesas > 0 && runway < 6) alerts.push({ level: 'amber', icon: '🟡', titulo: `Runway apertado: ${runway} meses`, detalhe: 'Menos de 6 meses. Planeje captação ou redução de custos este mês.' })
    if (fin.receita > 0 && margem < 0) alerts.push({ level: 'red', icon: '🔴', titulo: `Margem negativa: ${margem}%`, detalhe: 'Despesas maiores que receita. Revise contratos e recorrentes.' })
    else if (fin.receita > 0 && margem < 20) alerts.push({ level: 'amber', icon: '🟡', titulo: `Margem baixa: ${margem}%`, detalhe: 'Meta mínima saudável: 20%. Identifique o maior custo variável.' })
    if (denuncias.length > 0) alerts.push({ level: 'red', icon: '🔴', titulo: `${denuncias.length} denúncia(s) pendente(s)`, detalhe: 'Responda toda denúncia em até 48h. Falta de resposta agrava o risco legal.' })
    if (npsScores.length > 0 && npsNet < 0) alerts.push({ level: 'red', icon: '🔴', titulo: `NPS negativo: ${npsNet}`, detalhe: 'Mais detratores que promotores. Analise feedbacks negativos e aja esta semana.' })
    else if (npsScores.length > 0 && npsNet < 30) alerts.push({ level: 'amber', icon: '🟡', titulo: `NPS abaixo do ideal: ${npsNet}`, detalhe: 'Meta: >50 para SaaS educacional. Entreviste os últimos 3 detratores.' })
    const gap = s.faseMercado - s.faseEmpresa
    if (gap >= 2) alerts.push({ level: 'red', icon: '🔴', titulo: `Gap TD crítico: ${gap} fases atrás do mercado`, detalhe: 'Concorrentes com vantagem estrutural. Acelere TD F' + (s.faseEmpresa + 1) + '.' })
    else if (gap === 1) alerts.push({ level: 'amber', icon: '🟡', titulo: 'Gap TD: 1 fase atrás do mercado', detalhe: 'Complete os itens pendentes desta fase para alcançar o mercado.' })
    const okrsDefined = s.okrs?.some(o => o.objetivo.trim().length > 0)
    if (!okrsDefined) alerts.push({ level: 'amber', icon: '🟡', titulo: 'OKRs não definidos', detalhe: 'Sem OKRs ativos você opera sem metas mensuráveis. Defina pelo menos 1 objetivo esta semana.' })
    if (alerts.length === 0) alerts.push({ level: 'green', icon: '🟢', titulo: 'Todos os indicadores OK', detalhe: 'Nenhum alerta crítico identificado. Continue monitorando semanalmente.' })
    return alerts
  })()

  // Plano da semana — top 3 pendentes mais críticos
  const planoDaSemana: string[] = (() => {
    const items: string[] = []
    const fin = cockpit as typeof COCKPIT_DEFAULT
    const margem = fin.receita > 0 ? Math.round(((fin.receita - fin.despesas) / fin.receita) * 100) : 0
    const runway = fin.despesas > 0 ? Math.round(fin.caixa / fin.despesas) : 99
    if (runway < 6 && fin.despesas > 0) items.push(`Revisar despesas e prospectar 2 novos clientes (runway: ${runway}m)`)
    if (margem > 0 && margem < 20) items.push(`Mapear o maior custo variável e renegociar (margem atual: ${margem}%)`)
    if (denuncias.length > 0) items.push(`Responder ${denuncias.length} denúncia(s) pendente(s) no prazo de 48h`)
    // Add pending TD directives
    const faseItems = TD_FASES[s.faseEmpresa]?.items ?? []
    const stored = (s.checkEmpresa ?? [])[s.faseEmpresa] ?? []
    faseItems.forEach((item, ci) => {
      if (!item.autoCheck && !(stored[ci] ?? false) && item.directive) {
        if (items.length < 3) items.push(item.directive)
      }
    })
    if (!s.okrs?.some(o => o.objetivo.trim().length > 0)) items.push('Definir 1 OKR para o trimestre na aba OKRs')
    return items.slice(0, 3)
  })()

  const TABS: { id: AdminTab; label: string; color: string }[] = [
    { id: 'execucao', label: 'Execução', color: RED },
    { id: 'td', label: 'TD', color: BLUE },
    { id: 'inovacao', label: 'Inovação', color: PURPLE },
    { id: 'okrs', label: 'OKRs', color: GREEN },
    { id: 'gov', label: 'Governança', color: AMBER },
    { id: 'norte', label: 'Norte', color: '#5dade2' },
    { id: 'pessoas', label: 'Pessoas', color: '#17a589' },
    { id: 'monitor', label: 'Monitor', color: RED },
  ]

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">

      {/* Pergunta do dia */}
      <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(26,82,118,0.1)', border: '1px solid rgba(26,82,118,0.2)' }}>
        <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-1.5">Pergunta do dia</p>
        <p className="text-[13px] text-white/55 leading-relaxed">
          Em qual fase <span style={{ color: '#5dade2' }}>estamos</span>?{' '}
          Em qual fase o <span style={{ color: AMBER }}>mercado</span> chegou?{' '}
          <span className="text-white/30">Todo dia aplicar, desenvolver, aprender, evoluir.</span>
        </p>
        {gap > 0 && <div className="mt-2 flex items-center gap-2"><AlertTriangle size={11} style={{ color: RED }} /><span className="text-[11px]" style={{ color: RED }}>Gap de {gap} fase{gap > 1 ? 's' : ''} — perda silenciosa de competitividade</span></div>}
        {gap === 0 && s.faseEmpresa > 0 && <div className="mt-2 flex items-center gap-2"><TrendingUp size={11} style={{ color: GREEN }} /><span className="text-[11px]" style={{ color: GREEN }}>Alinhado com o mercado — manter ritmo</span></div>}
        {gap < 0 && <div className="mt-2 flex items-center gap-2"><TrendingUp size={11} style={{ color: GREEN }} /><span className="text-[11px]" style={{ color: GREEN }}>À frente em {Math.abs(gap)} fase{Math.abs(gap) > 1 ? 's' : ''} — liderar</span></div>}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold font-mono tracking-wider transition-all"
            style={{ background: tab === t.id ? `${t.color}20` : 'rgba(0,0,0,0.25)', border: `1px solid ${tab === t.id ? t.color + '55' : 'rgba(255,255,255,0.06)'}`, color: tab === t.id ? t.color : 'rgba(255,255,255,0.3)' }}>
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

          {/* ═══ TD ═══ */}
          {tab === 'td' && (
            <div className="flex flex-col gap-6">

              {/* Auto-detection banner */}
              <div className="rounded-lg px-3 py-2.5 flex items-start gap-2.5" style={{ background: 'rgba(30,132,73,0.08)', border: '1px solid rgba(30,132,73,0.2)' }}>
                <Zap size={13} style={{ color: GREEN, marginTop: 1, flexShrink: 0 }} />
                <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <span style={{ color: GREEN }}>Diagnóstico automático ativo.</span>{' '}
                  O sistema detectou seu stack (Zoho Workplace + Supabase + Vercel + IPB) e pré-preencheu o que já está feito.
                  Itens marcados com <span className="font-mono" style={{ color: '#5dade2' }}>via [fonte]</span> foram verificados automaticamente.
                </p>
              </div>

              {/* Plano de ação semanal */}
              {(() => {
                const currentFase = TD_FASES[s.faseEmpresa]
                const currentChecks = checkEmpresa[s.faseEmpresa] ?? []
                const acoesTD = currentFase?.items
                  .filter((item, ci) => !item.autoCheck && !(currentChecks[ci] ?? false) && item.directive)
                  .map(item => item.directive as string) ?? []
                const acoesOKR = s.okrs
                  .flatMap(o => o.krs.filter(k => k.pct < 70 && k.texto).map(k => `KR "${k.texto}" — ${k.pct}% → meta 70%`))
                  .slice(0, 2)
                const acoes = [...acoesTD, ...acoesOKR].slice(0, 4)
                if (acoes.length === 0) return null
                return (
                  <div className="rounded-xl p-4" style={{ background: 'rgba(26,82,118,0.1)', border: '1px solid rgba(26,82,118,0.25)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Target size={13} style={{ color: '#5dade2' }} />
                      <span className="text-[11px] font-bold font-mono text-white/50 uppercase tracking-widest">Plano de ação — esta semana</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {acoes.map((acao, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <span className="text-[10px] font-mono font-bold shrink-0 mt-0.5" style={{ color: '#5dade2' }}>{i + 1}</span>
                          <p className="text-[12px] leading-snug text-white/50">{acao}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              <SectionHeader label="Trilho da empresa" color="#5dade2" />

              {/* Rail */}
              <div className="flex flex-col">
                {TD_FASES.map((fase, fi) => {
                  const isActive = s.faseEmpresa === fi
                  const isDone = s.faseEmpresa > fi
                  const isLast = fi === TD_FASES.length - 1
                  const checks = checkEmpresa[fi] ?? []
                  const effectiveChecks = fase.items.map((item, ci) => item.autoCheck || (checks[ci] ?? false))
                  const allChecked = effectiveChecks.length > 0 && effectiveChecks.every(Boolean)
                  const doneCount = effectiveChecks.filter(Boolean).length

                  return (
                    <div key={fi} className="flex gap-3">
                      {/* Node + line */}
                      <div className="flex flex-col items-center" style={{ width: 28 }}>
                        <button onClick={() => update({ faseEmpresa: fi })}
                          className="rounded-full flex items-center justify-center shrink-0 transition-all"
                          style={{ width: 28, height: 28, background: isDone ? GREEN : isActive ? '#5dade2' : 'rgba(255,255,255,0.06)', border: `2px solid ${isDone ? GREEN : isActive ? '#5dade2' : 'rgba(255,255,255,0.1)'}`, boxShadow: isActive ? '0 0 0 4px rgba(93,173,226,0.15)' : 'none' }}>
                          {isDone ? <CheckCircle2 size={14} color="#fff" /> : <span className="text-[10px] font-bold font-mono" style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.25)' }}>{fi + 1}</span>}
                        </button>
                        {!isLast && <div className="flex-1 w-0.5 my-0.5" style={{ minHeight: 20, background: isDone ? GREEN : 'rgba(255,255,255,0.07)', transition: 'background 0.4s' }} />}
                      </div>

                      {/* Content */}
                      <div className="pb-5 flex-1">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="text-[13px] font-bold" style={{ color: isDone ? GREEN : isActive ? '#fff' : 'rgba(255,255,255,0.28)' }}>F{fi + 1} · {fase.label}</span>
                          {isDone && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: `${GREEN}20`, color: GREEN }}>CONCLUÍDO</span>}
                          {isActive && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(93,173,226,0.15)', color: '#5dade2' }}>FASE ATUAL</span>}
                          {isActive && fase.esforco && <span className="text-[9px] text-white/20">{fase.esforco}</span>}
                        </div>
                        <p className="text-[11px] text-white/28 leading-snug mb-2">{fase.desc}</p>

                        {/* Active phase: show items */}
                        {isActive && !isLast && (
                          <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center justify-between mb-2.5">
                              <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider">
                                Para avançar para F{fi + 2} · {TD_FASES[fi + 1]?.label}
                              </p>
                              <span className="text-[10px] font-mono" style={{ color: allChecked ? GREEN : AMBER }}>{doneCount}/{fase.items.length}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                              {fase.items.map((item, ci) => {
                                const checked = item.autoCheck || (checks[ci] ?? false)
                                return (
                                  <div key={ci}>
                                    <button onClick={() => toggleCheck(fi, ci)}
                                      className="flex items-start gap-2.5 w-full text-left rounded px-1 py-0.5 transition-all"
                                      style={{ cursor: item.autoCheck ? 'default' : 'pointer' }}>
                                      {checked
                                        ? <CheckCircle2 size={13} style={{ color: GREEN, marginTop: 1, flexShrink: 0 }} />
                                        : <Circle size={13} style={{ color: 'rgba(255,255,255,0.2)', marginTop: 1, flexShrink: 0 }} />
                                      }
                                      <div className="flex-1">
                                        <span className="text-[12px] leading-snug" style={{ color: checked ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.32)' }}>
                                          {item.text}
                                        </span>
                                        {item.autoCheck && item.evidence && (
                                          <span className="ml-2 text-[9px] font-mono px-1.5 py-0.5 rounded-full align-middle" style={{ background: 'rgba(93,173,226,0.1)', color: '#5dade2' }}>
                                            via {item.evidence.split('—')[0].trim()}
                                          </span>
                                        )}
                                      </div>
                                    </button>
                                    {checked && item.evidence && (
                                      <p className="text-[10px] text-white/20 ml-7 mt-0.5 leading-snug">{item.evidence}</p>
                                    )}
                                    {!checked && !item.autoCheck && item.directive && (
                                      <div className="ml-7 mt-1 flex items-start gap-1.5">
                                        <ChevronRight size={10} style={{ color: AMBER, marginTop: 1, flexShrink: 0 }} />
                                        <p className="text-[10px] leading-snug" style={{ color: AMBER }}>
                                          O que fazer: {item.directive}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>

                            {/* Target date */}
                            <div className="mt-3 flex items-center gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                              <span className="text-[10px] text-white/25 shrink-0">Meta:</span>
                              <input type="text" value={s.targetNextPhase} onChange={e => update({ targetNextPhase: e.target.value })}
                                placeholder="Ex: Q3 2025 / próximos 60 dias"
                                className="flex-1 bg-transparent outline-none text-[11px]"
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)', paddingBottom: 2 }} />
                            </div>

                            {allChecked && (
                              <motion.button initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                                onClick={() => update({ faseEmpresa: fi + 1, targetNextPhase: '' })}
                                className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg py-2 font-bold text-[12px] transition-all"
                                style={{ background: `${GREEN}22`, border: `1px solid ${GREEN}55`, color: GREEN }}>
                                Avançar para F{fi + 2} · {TD_FASES[fi + 1]?.label} <ChevronRight size={14} />
                              </motion.button>
                            )}
                          </div>
                        )}

                        {isDone && !isLast && (
                          <p className="text-[10px] text-white/20">{fase.items.length} itens verificados ✓</p>
                        )}
                        {isActive && isLast && (
                          <div className="rounded-lg px-3 py-2" style={{ background: `${GREEN}12`, border: `1px solid ${GREEN}30` }}>
                            <p className="text-[12px] font-bold" style={{ color: GREEN }}>🏆 Transformação Digital completa</p>
                            <p className="text-[11px] text-white/30 mt-0.5">Foco em liderar, inovar e manter.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Market rail */}
              <div className="h-px bg-white/5" />
              <SectionHeader label="Trilho do mercado" color={AMBER} />
              <div className="flex flex-col">
                {TD_FASES.map((fase, fi) => {
                  const isActive = s.faseMercado === fi
                  const isDone = s.faseMercado > fi
                  const isLast = fi === TD_FASES.length - 1
                  return (
                    <div key={fi} className="flex gap-3">
                      <div className="flex flex-col items-center" style={{ width: 28 }}>
                        <button onClick={() => update({ faseMercado: fi })}
                          className="rounded-full flex items-center justify-center shrink-0 transition-all"
                          style={{ width: 28, height: 28, background: isDone ? `${AMBER}60` : isActive ? AMBER : 'rgba(255,255,255,0.06)', border: `2px solid ${isDone ? AMBER : isActive ? AMBER : 'rgba(255,255,255,0.1)'}`, boxShadow: isActive ? `0 0 0 4px ${AMBER}22` : 'none' }}>
                          {isDone ? <CheckCircle2 size={14} color="#fff" /> : <span className="text-[10px] font-bold font-mono" style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.25)' }}>{fi + 1}</span>}
                        </button>
                        {!isLast && <div className="flex-1 w-0.5 my-0.5" style={{ minHeight: 12, background: isDone ? `${AMBER}50` : 'rgba(255,255,255,0.07)' }} />}
                      </div>
                      <div className="pb-3 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[12px] font-semibold" style={{ color: isDone ? `${AMBER}` : isActive ? '#fff' : 'rgba(255,255,255,0.25)' }}>F{fi + 1} · {fase.label}</span>
                          {isActive && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: `${AMBER}18`, color: AMBER }}>MERCADO AQUI</span>}
                        </div>
                        {isActive && <p className="text-[11px] leading-snug mt-1 mb-0" style={{ color: 'rgba(255,255,255,0.4)' }}>{fase.sinaisMercado}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Posição relativa */}
              <div className="rounded-lg p-4" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-white/25 uppercase tracking-widest">Posição relativa</span>
                  <span className="text-[11px] font-mono font-bold" style={{ color: gap > 0 ? RED : gap < 0 ? GREEN : AMBER }}>
                    {gap > 0 ? `GAP ${gap}` : gap < 0 ? `+${Math.abs(gap)} FRENTES` : 'ALINHADO'}
                  </span>
                </div>
                <div className="flex items-end gap-1.5" style={{ height: 48 }}>
                  {TD_FASES.map((_, i) => (
                    <div key={i} className="flex-1 rounded-sm relative overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.04)', height: `${((i + 1) / 6) * 100}%` }}>
                      {s.faseEmpresa > i && <div className="absolute inset-0" style={{ background: GREEN, opacity: 0.18 }} />}
                      {s.faseEmpresa === i && <div className="absolute inset-0" style={{ background: '#5dade2', opacity: 0.55 }} />}
                      {s.faseMercado === i && <div className="absolute bottom-0 left-0 right-0" style={{ height: 4, background: AMBER }} />}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-2">
                  <span className="text-[9px] text-white/30 flex items-center gap-1"><span className="inline-block w-3 h-2 rounded-sm" style={{ background: '#5dade2', opacity: 0.55 }} /> Empresa</span>
                  <span className="text-[9px] text-white/30 flex items-center gap-1"><span className="inline-block w-3 rounded-sm" style={{ height: 4, background: AMBER }} /> Mercado</span>
                  <span className="text-[9px] text-white/30 flex items-center gap-1"><span className="inline-block w-3 h-2 rounded-sm" style={{ background: GREEN, opacity: 0.18 }} /> Concluído</span>
                </div>
              </div>

              {/* SGI + TD */}
              <SectionHeader label="SGI + TD — maturidade de execução" color="#0e6655" />
              <div className="flex flex-col gap-3">
                {SGI_ELEMENTOS.map(el => {
                  const val = (s as Record<string, number>)[el.key] ?? el.autoValue
                  return (
                    <div key={el.key} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${MATURITY_COLORS[val]}` }}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-[12px] font-semibold text-white/65">{el.label}</p>
                        <span className="text-[10px] font-mono shrink-0" style={{ color: MATURITY_COLORS[val] }}>{MATURITY[val]}</span>
                      </div>
                      <p className="text-[10px] text-white/25 leading-snug mb-2">{el.autoEvidence}</p>
                      {el.gap && val < 3 && (
                        <div className="flex items-start gap-1.5 mb-2">
                          <ChevronRight size={10} style={{ color: AMBER, marginTop: 1, flexShrink: 0 }} />
                          <p className="text-[10px] leading-snug" style={{ color: AMBER }}>Próximo passo: {el.gap}</p>
                        </div>
                      )}
                      <div className="flex gap-1 flex-wrap">
                        {MATURITY.map((label, i) => (
                          <button key={i} onClick={() => update({ [el.key]: i } as Partial<CockpitState>)}
                            className="text-[9px] px-2 py-0.5 rounded-full transition-all font-mono"
                            style={{ background: val === i ? `${MATURITY_COLORS[i]}22` : 'rgba(0,0,0,0.3)', border: `1px solid ${val === i ? MATURITY_COLORS[i] : 'rgba(255,255,255,0.07)'}`, color: val === i ? MATURITY_COLORS[i] : 'rgba(255,255,255,0.22)' }}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* DDDM */}
              <SectionHeader label="DDDM — decisão baseada em dados" color="#5dade2" />
              <div className="flex flex-col gap-3">
                {DDDM_PILARES.map(p => {
                  const val = (s as Record<string, number>)[p.key] ?? p.autoValue
                  return (
                    <div key={p.key} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${MATURITY_COLORS[val]}` }}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-[12px] font-semibold text-white/65">{p.label}</p>
                        <span className="text-[10px] font-mono shrink-0" style={{ color: MATURITY_COLORS[val] }}>{MATURITY[val]}</span>
                      </div>
                      <p className="text-[10px] text-white/25 leading-snug mb-2">{p.autoEvidence}</p>
                      {p.gap && val < 3 && (
                        <div className="flex items-start gap-1.5 mb-2">
                          <ChevronRight size={10} style={{ color: AMBER, marginTop: 1, flexShrink: 0 }} />
                          <p className="text-[10px] leading-snug" style={{ color: AMBER }}>Próximo: {p.gap}</p>
                        </div>
                      )}
                      <div className="flex gap-1 flex-wrap">
                        {MATURITY.map((label, i) => (
                          <button key={i} onClick={() => update({ [p.key]: i } as Partial<CockpitState>)}
                            className="text-[9px] px-2 py-0.5 rounded-full transition-all font-mono"
                            style={{ background: val === i ? `${MATURITY_COLORS[i]}22` : 'rgba(0,0,0,0.3)', border: `1px solid ${val === i ? MATURITY_COLORS[i] : 'rgba(255,255,255,0.07)'}`, color: val === i ? MATURITY_COLORS[i] : 'rgba(255,255,255,0.22)' }}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Tendências */}
              <SectionHeader label="Tendências 2025 — watchlist" color={PURPLE} />
              <div className="flex flex-col gap-3">
                {TENDENCIAS.map(t => {
                  const pos = (s as Record<string, number>)[t.key] ?? t.autoValue
                  return (
                    <div key={t.key} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${TEND_COLORS[pos]}` }}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-[12px] font-semibold text-white/65">{t.label}</p>
                        <span className="text-[10px] font-mono shrink-0" style={{ color: TEND_COLORS[pos] }}>{TEND_POSICAO[pos]}</span>
                      </div>
                      <p className="text-[10px] text-white/30 leading-snug mb-1">{t.autoEvidence}</p>
                      <div className="flex items-start gap-1.5 mb-2">
                        <ChevronRight size={10} style={{ color: AMBER, marginTop: 1, flexShrink: 0 }} />
                        <p className="text-[10px] leading-snug" style={{ color: AMBER }}>Próximo: {t.proximo}</p>
                      </div>
                      <p className="text-[9px] italic mb-2" style={{ color: 'rgba(192,57,43,0.7)' }}>{t.risco}</p>
                      <div className="flex gap-1 flex-wrap">
                        {TEND_POSICAO.map((label, i) => (
                          <button key={i} onClick={() => update({ [t.key]: i } as Partial<CockpitState>)}
                            className="text-[9px] px-2 py-0.5 rounded-full transition-all font-mono"
                            style={{ background: pos === i ? `${TEND_COLORS[i]}22` : 'rgba(0,0,0,0.3)', border: `1px solid ${pos === i ? TEND_COLORS[i] : 'rgba(255,255,255,0.07)'}`, color: pos === i ? TEND_COLORS[i] : 'rgba(255,255,255,0.22)' }}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Sustentabilidade */}
              <SectionHeader label="Sustentabilidade digital" color={GREEN} />
              <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${GREEN}` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-semibold text-white/55">Práticas verificadas</span>
                  <span className="font-mono text-[12px] font-bold" style={{ color: SUST_ITEMS.filter((item, i) => item.autoCheck || (s.sustDigital ?? [])[i]).length >= 5 ? GREEN : AMBER }}>
                    {SUST_ITEMS.filter((item, i) => item.autoCheck || (s.sustDigital ?? [])[i]).length}/{SUST_ITEMS.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {SUST_ITEMS.map((item, i) => {
                    const checked = item.autoCheck || ((s.sustDigital ?? [])[i] ?? false)
                    return (
                      <div key={i}>
                        <button onClick={() => { if (!item.autoCheck) { const next = [...(s.sustDigital ?? SUST_ITEMS.map(x => x.autoCheck))]; next[i] = !next[i]; update({ sustDigital: next }) } }}
                          className="flex items-start gap-2.5 w-full text-left rounded px-1 py-0.5"
                          style={{ cursor: item.autoCheck ? 'default' : 'pointer' }}>
                          {checked ? <CheckCircle2 size={13} style={{ color: GREEN, marginTop: 1, flexShrink: 0 }} /> : <Circle size={13} style={{ color: 'rgba(255,255,255,0.2)', marginTop: 1, flexShrink: 0 }} />}
                          <div>
                            <span className="text-[12px] leading-snug" style={{ color: checked ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.28)' }}>{item.text}</span>
                            {item.autoCheck && <span className="ml-2 text-[9px] font-mono px-1.5 py-0.5 rounded-full align-middle" style={{ background: 'rgba(93,173,226,0.1)', color: '#5dade2' }}>auto</span>}
                          </div>
                        </button>
                        {checked && item.evidence && <p className="text-[10px] text-white/20 ml-7 mt-0.5">{item.evidence}</p>}
                        {!checked && item.directive && (
                          <div className="ml-7 mt-1 flex items-start gap-1.5">
                            <ChevronRight size={10} style={{ color: AMBER, marginTop: 1, flexShrink: 0 }} />
                            <p className="text-[10px] leading-snug" style={{ color: AMBER }}>{item.directive}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* IA */}
              <SectionHeader label="IA — análise estratégica completa" color={BLUE} />
              <div>
                <div className="flex items-start gap-2 mb-3 rounded-lg px-3 py-2" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Info size={11} style={{ color: '#5dade2', marginTop: 1, flexShrink: 0 }} />
                  <p className="text-[10px] text-white/30 leading-relaxed">
                    Lê: fase TD atual · itens pendentes com diretivas · SGI · DDDM · tendências · sustentabilidade ·{' '}
                    <span style={{ color: GREEN }}>dados financeiros reais do Cockpit</span> · OKRs · norte estratégico · macro de mercado.
                    Calibra urgência pelo runway e margem real.
                  </p>
                </div>
                <button onClick={() => { update({ iaReflexao: '' }); handleIA() }} disabled={iaLoading}
                  className="w-full rounded-lg py-2.5 flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: BLUE, color: '#fff', fontSize: 13, fontWeight: 600, cursor: iaLoading ? 'wait' : 'pointer' }}>
                  {iaLoading ? <Loader2 size={14} className="animate-spin" /> : <Brain size={14} />}
                  {iaLoading ? 'Analisando todos os dados...' : 'Gerar reflexão estratégica com IA'}
                </button>
                {s.iaReflexao && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg p-4 mt-3"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.65)' }}>
                    {s.iaReflexao}
                  </motion.div>
                )}
              </div>

            </div>
          )}

          {/* ═══ INOVAÇÃO ═══ */}
          {tab === 'inovacao' && (
            <div className="flex flex-col gap-5">

              {/* Banner diagnóstico */}
              <div className="rounded-lg px-3 py-2.5 flex items-start gap-2.5" style={{ background: 'rgba(125,60,152,0.08)', border: '1px solid rgba(125,60,152,0.2)' }}>
                <Zap size={13} style={{ color: PURPLE, marginTop: 1, flexShrink: 0 }} />
                <p className="text-[11px] leading-relaxed text-white/45">
                  <span style={{ color: '#a569bd' }}>Diagnóstico automático ativo.</span>{' '}
                  IPB detectado como <span style={{ color: '#a569bd' }}>produto SaaS arquitetônico</span> (afeta modelo + tecnologia).
                  IA em <span style={{ color: '#a569bd' }}>Encosta da Iluminação</span> (2025). TRL 7 — sistema em produção real.
                  Ajuste conforme necessário.
                </p>
              </div>

              <div><p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Tipo de inovação</p>
                <div className="grid grid-cols-2 gap-2">
                  {[{ id: 'produto', label: 'Produto / Serviço', desc: 'Novo produto ou melhoria substancial', auto: true }, { id: 'organizacional', label: 'Organizacional', desc: 'Estrutura, gestão, parcerias', auto: false }, { id: 'processo', label: 'Processo', desc: 'Como entregamos o que já entregamos', auto: false }, { id: 'modelo', label: 'Modelo de Negócio', desc: 'Como capturamos e criamos valor', auto: false }].map(t => (
                    <button key={t.id} onClick={() => update({ tipoInovacao: t.id })} className="rounded-lg px-3 py-2.5 text-left transition-all"
                      style={{ background: s.tipoInovacao === t.id ? 'rgba(125,60,152,0.18)' : 'rgba(0,0,0,0.25)', border: `2px solid ${s.tipoInovacao === t.id ? PURPLE : 'rgba(255,255,255,0.06)'}` }}>
                      <div className="flex items-center gap-1.5">
                        <p className="text-[12px] font-bold" style={{ color: s.tipoInovacao === t.id ? '#a569bd' : 'rgba(255,255,255,0.4)' }}>{t.label}</p>
                        {t.auto && <span className="text-[8px] font-mono px-1 py-0.5 rounded" style={{ background: 'rgba(125,60,152,0.2)', color: '#a569bd' }}>auto</span>}
                      </div>
                      <p className="text-[10px] mt-0.5 text-white/20 leading-snug">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div><p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Intensidade</p>
                <div className="grid grid-cols-2 gap-2">
                  {[{ id: 'rotina', label: '🔄 Rotina', desc: 'Renovação natural, baixo impacto', auto: false }, { id: 'radical', label: '🚀 Radical', desc: 'Novas competências, alto investimento', auto: false }, { id: 'disruptiva', label: '💥 Disruptiva', desc: 'Reavalia o modelo de negócio', auto: false }, { id: 'arquitetonica', label: '🏗️ Arquitetônica', desc: 'Afeta modelo + tecnologia', auto: true }].map(t => (
                    <button key={t.id} onClick={() => update({ intensidade: t.id })} className="rounded-lg px-3 py-2.5 text-left transition-all"
                      style={{ background: s.intensidade === t.id ? 'rgba(125,60,152,0.18)' : 'rgba(0,0,0,0.25)', border: `2px solid ${s.intensidade === t.id ? PURPLE : 'rgba(255,255,255,0.06)'}` }}>
                      <div className="flex items-center gap-1.5">
                        <p className="text-[12px] font-bold" style={{ color: s.intensidade === t.id ? '#a569bd' : 'rgba(255,255,255,0.4)' }}>{t.label}</p>
                        {t.auto && <span className="text-[8px] font-mono px-1 py-0.5 rounded" style={{ background: 'rgba(125,60,152,0.2)', color: '#a569bd' }}>auto</span>}
                      </div>
                      <p className="text-[10px] mt-0.5 text-white/20 leading-snug">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div><p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-3">3 Horizontes</p>
                <div className="grid grid-cols-3 gap-2">
                  {[{ key: 'h1' as const, label: 'H1 Core', color: GREEN, desc: 'Principal, incremental' }, { key: 'h2' as const, label: 'H2 Adjacente', color: AMBER, desc: 'Novos canais, risco moderado' }, { key: 'h3' as const, label: 'H3 Disruptivo', color: PURPLE, desc: 'Novos mercados, risco alto' }].map(h => (
                    <div key={h.key} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', borderTop: `2px solid ${h.color}` }}>
                      <p className="text-[11px] font-bold mb-1" style={{ color: h.color }}>{h.label}</p>
                      <p className="text-[9px] text-white/20 mb-3 leading-snug">{h.desc}</p>
                      <input type="range" min={0} max={100} value={s[h.key]} onChange={e => update({ [h.key]: Number(e.target.value) } as Partial<CockpitState>)} className="w-full h-1" style={{ accentColor: h.color }} />
                      <p className="font-mono text-[16px] font-bold mt-1" style={{ color: h.color }}>{s[h.key]}%</p>
                    </div>
                  ))}
                </div>
              </div>
              <div><p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Funil de inovação</p>
                <div className="flex flex-col gap-1.5">
                  {FUNIL_FASES.map((f, i) => (
                    <button key={i} onClick={() => { const next = [...s.fasesFunil]; next[i] = !next[i]; update({ fasesFunil: next }) }}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all"
                      style={{ background: s.fasesFunil[i] ? 'rgba(30,132,73,0.1)' : 'rgba(0,0,0,0.25)', border: `1px solid ${s.fasesFunil[i] ? GREEN + '40' : 'rgba(255,255,255,0.06)'}` }}>
                      <span className="text-[12px] font-mono font-bold w-5 shrink-0" style={{ color: s.fasesFunil[i] ? GREEN : 'rgba(255,255,255,0.2)' }}>{s.fasesFunil[i] ? '✓' : String(i + 1)}</span>
                      <span className="text-[12px] leading-snug" style={{ color: s.fasesFunil[i] ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.3)' }}>{f}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div><p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Hype Cycle</p>
                <div className="flex flex-col gap-1.5">
                  {HYPE_FASES.map((f, i) => (
                    <button key={i} onClick={() => update({ faseHype: i })} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all"
                      style={{ background: s.faseHype === i ? 'rgba(125,60,152,0.13)' : 'rgba(0,0,0,0.25)', border: `1px solid ${s.faseHype === i ? PURPLE + '50' : 'rgba(255,255,255,0.06)'}` }}>
                      <span className="text-[11px] font-mono font-bold w-5 shrink-0" style={{ color: s.faseHype === i ? '#a569bd' : 'rgba(255,255,255,0.2)' }}>{i + 1}</span>
                      <div><p className="text-[12px] font-semibold" style={{ color: s.faseHype === i ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)' }}>{f.label}</p><p className="text-[10px] text-white/20">{f.desc}</p></div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2"><p className="text-[10px] font-mono text-white/25 uppercase tracking-widest">TRL</p><span className="font-mono text-[20px] font-bold" style={{ color: s.trl >= 7 ? GREEN : s.trl >= 4 ? AMBER : RED }}>{s.trl}/9</span></div>
                <input type="range" min={1} max={9} value={s.trl} onChange={e => update({ trl: Number(e.target.value) })} className="w-full h-1.5" style={{ accentColor: s.trl >= 7 ? GREEN : s.trl >= 4 ? AMBER : RED }} />
                <div className="flex justify-between mt-1"><span className="text-[9px] text-white/20">Conceito</span><span className="text-[9px] text-white/20">Protótipo</span><span className="text-[9px] text-white/20">Produção</span></div>
              </div>
              {/* Síntese automática */}
              {(() => {
                const sintese = getInovacaoSintese(s.tipoInovacao, s.intensidade, s.h1, s.h2, s.h3, s.fasesFunil, s.faseHype, s.trl)
                if (!sintese) return (
                  <div className="rounded-lg p-4 text-center text-[11px] text-white/25" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    Selecione tipo e intensidade para gerar o diagnóstico de inovação
                  </div>
                )
                return (
                  <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${sintese.janelaColor}40` }}>
                    {/* Janela */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold px-2 py-1 rounded-full" style={{ background: `${sintese.janelaColor}20`, color: sintese.janelaColor }}>
                        JANELA DE MERCADO
                      </span>
                      <span className="text-[11px] font-bold" style={{ color: sintese.janelaColor }}>{sintese.janelaLabel}</span>
                    </div>

                    {/* Prioridade */}
                    <div className="rounded-lg p-3" style={{ background: `${sintese.janelaColor}10`, borderLeft: `3px solid ${sintese.janelaColor}` }}>
                      <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-1">Prioridade #1</p>
                      <p className="text-[13px] font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.75)' }}>{sintese.prioridade}</p>
                    </div>

                    {/* Alerta horizontes */}
                    {sintese.alerta && (
                      <div className="flex items-start gap-2 rounded-lg p-2.5" style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)' }}>
                        <AlertTriangle size={11} style={{ color: RED, marginTop: 1, flexShrink: 0 }} />
                        <p className="text-[11px] leading-snug" style={{ color: RED }}>{sintese.alerta}</p>
                      </div>
                    )}

                    {/* Ações */}
                    <div>
                      <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">Próximas ações</p>
                      <div className="flex flex-col gap-2">
                        {sintese.acoes.filter(Boolean).map((acao, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-[10px] font-mono font-bold shrink-0 mt-0.5" style={{ color: sintese.janelaColor }}>{i + 1}</span>
                            <p className="text-[12px] leading-snug text-white/50">{acao}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })()}

              <textarea value={s.reflexaoInovacao} onChange={e => update({ reflexaoInovacao: e.target.value })} placeholder="Suas notas de inovação..." rows={3} className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }} />
            </div>
          )}

          {/* ═══ OKRs ═══ */}
          {tab === 'okrs' && (
            <div className="flex flex-col gap-5">

              {/* Saúde geral */}
              {(() => {
                const allKrs = s.okrs.flatMap(o => o.krs.filter(k => k.texto))
                if (allKrs.length === 0) return null
                const onTrack = allKrs.filter(k => k.pct >= 70).length
                const atRisk = allKrs.filter(k => k.pct > 0 && k.pct < 40).length
                const avg = Math.round(allKrs.reduce((a, b) => a + b.pct, 0) / allKrs.length)
                return (
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'PROGRESSO MÉDIO', value: `${avg}%`, color: avg >= 70 ? GREEN : avg >= 40 ? AMBER : RED },
                      { label: 'NO CAMINHO', value: `${onTrack}/${allKrs.length} KRs`, color: GREEN },
                      { label: 'EM RISCO', value: `${atRisk} KRs`, color: atRisk > 0 ? RED : 'rgba(255,255,255,0.25)' },
                    ].map(c => (
                      <div key={c.label} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-[9px] font-mono text-white/20 mb-1">{c.label}</p>
                        <p className="text-[16px] font-bold font-mono" style={{ color: c.color }}>{c.value}</p>
                      </div>
                    ))}
                  </div>
                )
              })()}

              {/* Sugestão automática */}
              {s.okrs.every(o => !o.objetivo) && (
                <div className="rounded-xl p-4" style={{ background: 'rgba(30,132,73,0.06)', border: '1px solid rgba(30,132,73,0.2)' }}>
                  <p className="text-[11px] text-white/40 mb-3">
                    <span style={{ color: GREEN }}>Sistema identificou OKRs relevantes</span> com base na fase TD, janela de inovação e gaps do diagnóstico.
                  </p>
                  <button onClick={() => update({ okrs: suggestOKRs(s.faseEmpresa, s.faseHype, s.trl, s.fasesFunil) })}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-bold transition-all"
                    style={{ background: `${GREEN}20`, border: `1px solid ${GREEN}55`, color: GREEN }}>
                    <Zap size={13} />
                    Preencher OKRs com base no diagnóstico
                  </button>
                </div>
              )}

              <p className="text-[11px] text-white/25">OKRs são ambiciosos — <span style={{ color: GREEN }}>70% já é sucesso.</span> Edite conforme sua realidade.</p>

              {s.okrs.map((okr, oi) => (
                <div key={oi} className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${GREEN}` }}>
                  <div className="flex items-center gap-2 mb-3"><Target size={13} style={{ color: GREEN }} /><span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Objetivo {oi + 1}</span></div>
                  <input value={okr.objetivo} onChange={e => { const next = [...s.okrs]; next[oi] = { ...okr, objetivo: e.target.value }; update({ okrs: next }) }} placeholder="O que quero alcançar?" className="w-full rounded-lg px-3 py-2 text-[13px] outline-none mb-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)' }} />
                  <div className="flex flex-col gap-2">
                    {okr.krs.map((kr, ki) => (
                      <div key={ki} className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-white/25 shrink-0 w-6">KR{ki + 1}</span>
                        <input value={kr.texto} onChange={e => { const next = [...s.okrs]; next[oi].krs[ki] = { ...kr, texto: e.target.value }; update({ okrs: next }) }} placeholder="Como vou medir?" className="flex-1 rounded-md px-2.5 py-1.5 text-[12px] outline-none" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }} />
                        <div className="flex items-center gap-1.5 shrink-0">
                          <input type="range" min={0} max={100} value={kr.pct} onChange={e => { const next = [...s.okrs]; next[oi].krs[ki] = { ...kr, pct: Number(e.target.value) }; update({ okrs: next }) }} className="w-14 h-1" style={{ accentColor: kr.pct >= 70 ? GREEN : kr.pct >= 40 ? AMBER : RED }} />
                          <span className="font-mono text-[11px] w-8 text-right" style={{ color: kr.pct >= 70 ? GREEN : kr.pct >= 40 ? AMBER : RED }}>{kr.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ═══ GOVERNANÇA ═══ */}
          {tab === 'gov' && (
            <div className="flex flex-col gap-4">

              {/* Banner auto-detecção */}
              <div className="rounded-lg px-3 py-2.5 flex items-start gap-2.5" style={{ background: 'rgba(30,132,73,0.08)', border: '1px solid rgba(30,132,73,0.2)' }}>
                <Zap size={13} style={{ color: GREEN, marginTop: 1, flexShrink: 0 }} />
                <p className="text-[11px] leading-relaxed text-white/45">
                  <span style={{ color: GREEN }}>Diagnóstico automático ativo.</span>{' '}
                  Itens verificados via Supabase RLS, Vercel monitoring e stack do IPB marcados automaticamente com <span style={{ color: '#5dade2' }}>auto</span>.
                  Itens pendentes mostram a diretiva exata.
                </p>
              </div>

              {/* Health score geral */}
              {(() => {
                const total = Object.values(GOV_CHECKS).flat()
                const allKeys = Object.keys(GOV_CHECKS) as (keyof CockpitState)[]
                const done = total.filter((item, gi) => {
                  const key = allKeys[Math.floor(gi / 4)]
                  const arr = (s[key] as boolean[]) ?? []
                  return item.autoCheck || (arr[gi % 4] ?? false)
                }).length
                const pct = Math.round((done / total.length) * 100)
                return (
                  <div className="flex items-center gap-3 rounded-lg px-4 py-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex-1">
                      <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-1">Maturidade de governança</p>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct >= 75 ? GREEN : pct >= 50 ? AMBER : RED }} />
                      </div>
                    </div>
                    <span className="font-mono text-[20px] font-bold shrink-0" style={{ color: pct >= 75 ? GREEN : pct >= 50 ? AMBER : RED }}>{done}/{total.length}</span>
                  </div>
                )
              })()}

              <p className="text-[11px] text-white/25">4 pilares — se um falha, a casa desaba.</p>
              {(Object.entries(GOV_CHECKS) as [string, GovItem[]][]).map(([key, items]) => {
                const arr = (s[key as keyof CockpitState] as boolean[]) ?? []
                const effective = items.map((item, i) => item.autoCheck || (arr[i] ?? false))
                const done = effective.filter(Boolean).length
                const color = GOV_COLORS[key]
                return (
                  <div key={key} className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${color}` }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[13px] font-semibold text-white/60">{GOV_LABELS[key]}</span>
                      <span className="font-mono text-[12px] font-bold" style={{ color: done === items.length ? GREEN : done >= 2 ? AMBER : RED }}>{done}/{items.length}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {items.map((item, i) => {
                        const checked = item.autoCheck || (arr[i] ?? false)
                        return (
                          <div key={i}>
                            <button onClick={() => { if (item.autoCheck) return; const next = items.map((it, j) => it.autoCheck || (arr[j] ?? false)); next[i] = !checked; update({ [key]: next } as Partial<CockpitState>) }}
                              className="flex items-start gap-2.5 w-full text-left rounded-md px-2.5 py-1.5 transition-all"
                              style={{ background: checked ? `${color}08` : 'transparent', cursor: item.autoCheck ? 'default' : 'pointer' }}>
                              <span className="text-[12px] font-mono shrink-0 w-4 mt-0.5" style={{ color: checked ? GREEN : 'rgba(255,255,255,0.2)' }}>{checked ? '✓' : '○'}</span>
                              <div className="flex-1">
                                <span className="text-[12px] leading-snug" style={{ color: checked ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.28)' }}>{item.text}</span>
                                {item.autoCheck && item.evidence && (
                                  <span className="ml-2 text-[9px] font-mono px-1.5 py-0.5 rounded-full align-middle" style={{ background: 'rgba(93,173,226,0.1)', color: '#5dade2' }}>auto</span>
                                )}
                              </div>
                            </button>
                            {checked && item.evidence && (
                              <p className="text-[10px] text-white/20 ml-9 mt-0.5 leading-snug">{item.evidence}</p>
                            )}
                            {!checked && item.directive && (
                              <div className="ml-9 mt-1 flex items-start gap-1.5">
                                <ChevronRight size={10} style={{ color: AMBER, marginTop: 1, flexShrink: 0 }} />
                                <p className="text-[10px] leading-snug" style={{ color: AMBER }}>{item.directive}</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              <textarea value={s.reflexaoGov} onChange={e => update({ reflexaoGov: e.target.value })} placeholder="O que precisa ser resolvido?" rows={3} className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }} />
            </div>
          )}

          {/* ═══ NORTE ═══ */}
          {tab === 'norte' && (
            <div className="flex flex-col gap-4">

              {/* Painel de posição integrado */}
              {(() => {
                const allGovItems = Object.entries(GOV_CHECKS).flatMap(([key, items], gi) =>
                  items.map((item, i) => item.autoCheck || ((s[key as keyof CockpitState] as boolean[] ?? [])[i] ?? false))
                )
                const govScore = Math.round((allGovItems.filter(Boolean).length / allGovItems.length) * 100)
                const okrKrs = s.okrs.flatMap(o => o.krs.filter(k => k.texto))
                const okrAvg = okrKrs.length > 0 ? Math.round(okrKrs.reduce((a, b) => a + b.pct, 0) / okrKrs.length) : 0
                const sintese = getInovacaoSintese(s.tipoInovacao, s.intensidade, s.h1, s.h2, s.h3, s.fasesFunil, s.faseHype, s.trl)
                const sustScore = Math.round((SUST_ITEMS.filter((item, i) => item.autoCheck || (s.sustDigital ?? [])[i]).length / SUST_ITEMS.length) * 100)

                return (
                  <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(93,173,226,0.2)' }}>
                    <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest">Posição atual — síntese integrada</p>

                    {/* Indicadores */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'TD', value: `F${s.faseEmpresa + 1} · ${TD_FASES[s.faseEmpresa]?.label ?? '—'}`, color: '#5dade2', sub: gap === 0 ? 'Alinhado ao mercado' : gap > 0 ? `${gap} fase(s) atrás` : `${Math.abs(gap)} fase(s) à frente` },
                        { label: 'INOVAÇÃO', value: sintese?.janelaLabel.split('—')[0].trim() ?? '—', color: sintese?.janelaColor ?? PURPLE, sub: `TRL ${s.trl}/9 · ${HYPE_FASES[s.faseHype]?.label ?? '—'}` },
                        { label: 'OKRs', value: okrKrs.length > 0 ? `${okrAvg}% médio` : 'Não definidos', color: okrAvg >= 70 ? GREEN : okrAvg >= 40 ? AMBER : 'rgba(255,255,255,0.25)', sub: `${okrKrs.filter(k => k.pct >= 70).length}/${okrKrs.length} KRs no caminho` },
                        { label: 'GOVERNANÇA', value: `${govScore}%`, color: govScore >= 75 ? GREEN : govScore >= 50 ? AMBER : RED, sub: `${allGovItems.filter(Boolean).length}/${allGovItems.length} pilares ativos` },
                      ].map(c => (
                        <div key={c.label} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <p className="text-[9px] font-mono text-white/20 mb-1">{c.label}</p>
                          <p className="text-[13px] font-bold leading-tight" style={{ color: c.color }}>{c.value}</p>
                          <p className="text-[10px] text-white/25 mt-0.5">{c.sub}</p>
                        </div>
                      ))}
                    </div>

                    {/* Veredicto */}
                    {(() => {
                      const tdOk = s.faseEmpresa >= 1
                      const inoOk = sintese?.janela === 'urgente' || sintese?.janela === 'favoravel'
                      const okrOk = okrKrs.length > 0
                      const govOk = govScore >= 50
                      const score = [tdOk, inoOk, okrOk, govOk].filter(Boolean).length
                      const msgs = [
                        { ok: tdOk, msg: tdOk ? null : 'Completar F2 do TD é pré-requisito para tudo' },
                        { ok: inoOk, msg: inoOk ? null : 'Definir posição no Hype Cycle para calibrar timing' },
                        { ok: okrOk, msg: okrOk ? null : 'Sem OKRs não há como saber se você está no caminho' },
                        { ok: govOk, msg: govOk ? null : 'Governança abaixo de 50% — risco operacional elevado' },
                      ].filter(m => !m.ok).map(m => m.msg!)

                      return (
                        <div className="rounded-lg p-3" style={{ background: score >= 3 ? 'rgba(30,132,73,0.08)' : 'rgba(154,125,10,0.08)', border: `1px solid ${score >= 3 ? GREEN : AMBER}30` }}>
                          <p className="text-[11px] font-bold mb-1" style={{ color: score >= 3 ? GREEN : AMBER }}>
                            {score === 4 ? 'Posição sólida — foco em execução e escala' : score >= 2 ? 'Fundação em construção — continue avançando' : 'Atenção: gaps críticos antes de escalar'}
                          </p>
                          {msgs.map((m, i) => (
                            <div key={i} className="flex items-start gap-1.5 mt-1">
                              <ChevronRight size={10} style={{ color: AMBER, marginTop: 1, flexShrink: 0 }} />
                              <p className="text-[10px] leading-snug" style={{ color: AMBER }}>{m}</p>
                            </div>
                          ))}
                        </div>
                      )
                    })()}
                  </div>
                )
              })()}

              {/* Estrela do Norte */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest">Onde queremos chegar?</p>
                  {!s.norteStar && (
                    <button onClick={() => update({ norteStar: 'Ser a plataforma de inteligência de negócios mais acessível e acionável para médias empresas brasileiras — onde dados viram decisões e decisões viram crescimento sustentável.' })}
                      className="text-[9px] font-mono px-2 py-1 rounded transition-colors" style={{ background: 'rgba(93,173,226,0.1)', color: '#5dade2' }}>
                      Sugerir
                    </button>
                  )}
                </div>
                <textarea value={s.norteStar} onChange={e => update({ norteStar: e.target.value })} placeholder="Nossa estrela do norte..." rows={4} className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(93,173,226,0.18)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }} />
              </div>

              {/* Cultura */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest">Cultura</p>
                  {!s.cultura && (
                    <button onClick={() => update({ cultura: 'Dados antes de opinião. Aprendizado antes de escala. Foco antes de expansão. Construímos rápido, medimos tudo e descartamos o que não funciona sem ego.' })}
                      className="text-[9px] font-mono px-2 py-1 rounded transition-colors" style={{ background: 'rgba(93,173,226,0.1)', color: '#5dade2' }}>
                      Sugerir
                    </button>
                  )}
                </div>
                <textarea value={s.cultura} onChange={e => update({ cultura: e.target.value })} placeholder="Valores praticados vs declarados, rituais, clima..." rows={4} className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }} />
              </div>

              {/* Reflexão */}
              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Reflexão livre</p>
                <textarea value={s.reflexaoNorte} onChange={e => update({ reflexaoNorte: e.target.value })} placeholder="O que aprendemos hoje?" rows={3} className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }} />
              </div>
            </div>
          )}

          {/* ═══ MONITOR ═══ */}
          {tab === 'monitor' && (
            <div className="flex flex-col gap-5">

              {/* ── Header refresh ── */}
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest">Cockpit operacional</p>
                <button onClick={() => { loadMonitor(); loadZoho(); loadStack() }}
                  className="flex items-center gap-1.5 text-[10px] text-white/25 hover:text-white/50 font-mono transition-colors">
                  <RefreshCw size={10} className={(monitorLoading || zohoLoading) ? 'animate-spin' : ''} />
                  Atualizar tudo
                </button>
              </div>

              {/* ── Stack Health ── */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Server size={13} style={{ color: '#5dade2' }} />
                  <span className="text-[12px] font-bold text-white/60">Stack</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {/* Vercel / API */}
                  <div className="rounded-lg p-3 flex flex-col gap-1" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-1.5">
                      <Activity size={10} style={{ color: stackHealth === null ? 'rgba(255,255,255,0.2)' : stackHealth.ok ? GREEN : RED }} />
                      <p className="text-[9px] text-white/25 font-mono">VERCEL / API</p>
                    </div>
                    <p className="text-[15px] font-bold font-mono" style={{ color: stackHealth === null ? 'rgba(255,255,255,0.2)' : stackHealth.ok ? GREEN : RED }}>
                      {stackHealth === null ? '—' : stackHealth.ok ? 'OK' : 'DOWN'}
                    </p>
                    {stackHealth?.latencyMs !== null && stackHealth !== null && (
                      <p className="text-[9px] font-mono" style={{ color: (stackHealth.latencyMs ?? 0) < 500 ? GREEN : AMBER }}>{stackHealth.latencyMs}ms</p>
                    )}
                  </div>
                  {/* Supabase */}
                  <div className="rounded-lg p-3 flex flex-col gap-1" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-1.5">
                      <Shield size={10} style={{ color: userStats !== null ? GREEN : 'rgba(255,255,255,0.2)' }} />
                      <p className="text-[9px] text-white/25 font-mono">SUPABASE</p>
                    </div>
                    <p className="text-[15px] font-bold font-mono" style={{ color: userStats !== null ? GREEN : 'rgba(255,255,255,0.2)' }}>
                      {userStats !== null ? 'OK' : '—'}
                    </p>
                    <p className="text-[9px] font-mono text-white/20">RLS + Auth ativo</p>
                  </div>
                  {/* Zoho */}
                  <div className="rounded-lg p-3 flex flex-col gap-1" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-1.5">
                      <Link2 size={10} style={{ color: zohoStatus === null ? 'rgba(255,255,255,0.2)' : zohoStatus.connected ? GREEN : AMBER }} />
                      <p className="text-[9px] text-white/25 font-mono">ZOHO CRM</p>
                    </div>
                    <p className="text-[15px] font-bold font-mono" style={{ color: zohoStatus === null ? 'rgba(255,255,255,0.2)' : zohoStatus.connected ? GREEN : AMBER }}>
                      {zohoStatus === null ? '—' : zohoStatus.connected ? 'OK' : 'DESCONECT.'}
                    </p>
                    <p className="text-[9px] font-mono text-white/20">{zohoStatus?.org?.name ?? 'CRM'}</p>
                  </div>
                </div>
              </div>

              {/* ── Usuários ── */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck size={13} style={{ color: PURPLE }} />
                  <span className="text-[12px] font-bold text-white/60">Usuários</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { label: 'TOTAL', value: userStats?.total ?? '—', color: PURPLE },
                    { label: 'NOVOS 7D', value: userStats?.newThisWeek ?? '—', color: '#5dade2' },
                    { label: 'FEEDBACKS', value: feedbacks.length, color: GREEN },
                    { label: 'NPS NET', value: npsScores.length > 0 ? npsNet : '—', color: npsScores.length > 0 ? (npsNet >= 50 ? GREEN : npsNet >= 0 ? AMBER : RED) : 'rgba(255,255,255,0.2)' },
                  ].map(card => (
                    <div key={card.label} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <p className="text-[9px] text-white/25 font-mono mb-1">{card.label}</p>
                      <p className="text-[22px] font-bold font-mono" style={{ color: card.color }}>{card.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Alertas Inteligentes ── */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Bell size={13} style={{ color: AMBER }} />
                  <span className="text-[12px] font-bold text-white/60">Alertas</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.25)' }}>automático</span>
                </div>
                <div className="flex flex-col gap-2">
                  {monitorAlertas.map((a, i) => {
                    const borderColor = a.level === 'red' ? RED : a.level === 'amber' ? AMBER : GREEN
                    return (
                      <div key={i} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${borderColor}` }}>
                        <p className="text-[12px] font-bold mb-0.5" style={{ color: borderColor }}>{a.titulo}</p>
                        <p className="text-[11px] text-white/40 leading-relaxed">{a.detalhe}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ── Plano da Semana ── */}
              {planoDaSemana.length > 0 && (
                <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={13} style={{ color: '#5dade2' }} />
                    <span className="text-[12px] font-bold text-white/60">Plano desta semana</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {planoDaSemana.map((acao, i) => (
                      <div key={i} className="flex items-start gap-3 py-2 px-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.25)' }}>
                        <span className="text-[11px] font-bold font-mono mt-0.5 shrink-0" style={{ color: '#5dade2' }}>{i + 1}</span>
                        <p className="text-[12px] text-white/55 leading-relaxed">{acao}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Zoho CRM detalhado ── */}
              {zohoStatus?.connected && zohoData?.summary && (
                <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart2 size={13} style={{ color: GREEN }} />
                    <span className="text-[12px] font-bold text-white/60">Pipeline Zoho CRM</span>
                    {zohoStatus.org?.name && <span className="text-[10px] text-white/25 font-mono">— {zohoStatus.org.name}</span>}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    {[
                      { label: 'DEALS', value: zohoData.summary.totalDeals, color: '#5dade2', icon: Target },
                      { label: 'PIPELINE', value: `R$${(zohoData.summary.totalPipeline / 1000).toFixed(0)}k`, color: GREEN, icon: DollarSign },
                      { label: 'GANHO MÊS', value: `R$${(zohoData.summary.wonThisMonth / 1000).toFixed(0)}k`, color: AMBER, icon: TrendingUp },
                      { label: 'CONTATOS', value: zohoData.summary.totalContacts, color: PURPLE, icon: Users2 },
                    ].map(card => {
                      const Icon = card.icon
                      return (
                        <div key={card.label} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div className="flex items-center gap-1.5 mb-1"><Icon size={10} style={{ color: card.color }} /><p className="text-[9px] text-white/25 font-mono">{card.label}</p></div>
                          <p className="text-[20px] font-bold font-mono" style={{ color: card.color }}>{card.value}</p>
                        </div>
                      )
                    })}
                  </div>
                  {zohoData.pipeline && zohoData.pipeline.length > 0 && (
                    <div className="flex flex-col gap-1">
                      {zohoData.pipeline.slice(0, 6).map(p => (
                        <div key={p.stage} className="flex items-center justify-between py-1.5 px-2 rounded" style={{ background: 'rgba(0,0,0,0.2)' }}>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-white/45">{p.stage}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>{p.count}</span>
                          </div>
                          <span className="text-[11px] font-mono font-bold" style={{ color: p.value > 0 ? GREEN : 'rgba(255,255,255,0.25)' }}>
                            {p.value > 0 ? `R$${(p.value / 1000).toFixed(0)}k` : '—'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {zohoStatus && !zohoStatus.connected && (
                <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Link2 size={13} style={{ color: AMBER }} />
                    <span className="text-[12px] font-bold text-white/60">Zoho CRM</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: `${AMBER}20`, color: AMBER }}>NÃO CONECTADO</span>
                  </div>
                  {!zohoStatus.configured ? (
                    <p className="text-[11px] text-white/35 leading-relaxed">Configure <span className="font-mono" style={{ color: AMBER }}>ZOHO_CLIENT_ID</span> e <span className="font-mono" style={{ color: AMBER }}>ZOHO_CLIENT_SECRET</span> no Vercel.</p>
                  ) : (
                    <a href="/api/zoho/connect" className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-[12px] transition-all" style={{ background: 'rgba(93,173,226,0.12)', border: '1px solid rgba(93,173,226,0.3)', color: '#5dade2' }}>
                      <Link2 size={13} />Conectar Zoho CRM
                    </a>
                  )}
                </div>
              )}

              {/* ── NPS + Feedbacks ── */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={13} style={{ color: GREEN }} />
                  <span className="text-[12px] font-bold text-white/60">NPS & Feedbacks</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: 'NPS MÉDIO', value: npsAvg, color: parseFloat(npsAvg) >= 8 ? GREEN : parseFloat(npsAvg) >= 6 ? AMBER : RED },
                    { label: 'NPS NET', value: npsNet, color: npsNet >= 50 ? GREEN : npsNet >= 0 ? AMBER : RED },
                    { label: 'DENÚNCIAS', value: denuncias.length, color: denuncias.length > 0 ? RED : 'rgba(255,255,255,0.3)' },
                  ].map(card => (
                    <div key={card.label} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <p className="text-[9px] text-white/25 font-mono mb-1">{card.label}</p>
                      <p className="text-[22px] font-bold font-mono" style={{ color: card.color }}>{card.value}</p>
                    </div>
                  ))}
                </div>
                {monitorLoading ? (
                  <div className="flex items-center justify-center py-6"><Loader2 size={14} className="animate-spin text-white/25" /></div>
                ) : (
                  <>
                    {feedbacks.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Recentes</p>
                        {feedbacks.slice(0, 5).map(fb => (
                          <div key={fb.id} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${npsColor(fb.nps_score)}` }}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                {fb.nps_score !== null && <span className="font-mono text-[16px] font-bold" style={{ color: npsColor(fb.nps_score) }}>{fb.nps_score}</span>}
                                {fb.category && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>{fb.category}</span>}
                              </div>
                              <span className="text-[10px] text-white/20 font-mono">{timeAgo(fb.created_at)}</span>
                            </div>
                            {fb.message && <p className="text-[12px] text-white/45 leading-relaxed">{fb.message}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                    {feedbacks.length === 0 && <p className="text-[12px] text-white/20 text-center py-4">Nenhum feedback ainda</p>}
                    {denuncias.length > 0 && (
                      <div className="flex flex-col gap-2 mt-3">
                        <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Denúncias</p>
                        {denuncias.map(dn => (
                          <div key={dn.id} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${RED}` }}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(192,57,43,0.15)', color: RED }}>{dn.tipo}</span>
                              <span className="text-[10px] text-white/20 font-mono">{timeAgo(dn.created_at)}</span>
                            </div>
                            <p className="text-[12px] text-white/45 leading-relaxed mt-1">{dn.descricao}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

            </div>
          )}

          {/* ═══ EXECUÇÃO COMERCIAL ═══ */}
          {tab === 'execucao' && (() => {
            const fin = cockpit as typeof COCKPIT_DEFAULT
            const sprintDias = s.sprintDias?.length === 7 ? s.sprintDias : Array(7).fill(false)
            const semanas4 = s.semanas4?.length === 4 ? s.semanas4 : [[false,false,false],[false,false,false],[false,false,false],[false,false,false]]
            const sprintDone = sprintDias.filter(Boolean).length

            const SPRINT_DIAS = [
              { dia: 1, label: 'Lista de Alvos', acao: 'Identifique 20 contatos do LinkedIn/rede que sejam o avatar do cliente (donos de pequenas empresas ou consultores)' },
              { dia: 2, label: 'Convite Beta', acao: '"Estou finalizando uma IA de Gestão Estratégica e preciso de um olhar crítico antes de lançar. Topa testar o Smart Pricing com seus dados?"' },
              { dia: 3, label: 'Demo de Stress', acao: 'Mostre o app mesmo que "no arame". Objetivo: ver se o usuário entende o que o Runway quer dizer' },
              { dia: 4, label: 'Coleta de Atrito', acao: 'Anote onde travou. Se não entendeu o Health Score, o UX falhou. Isso economiza meses de dev errado' },
              { dia: 5, label: '"Sim" Hipotético', acao: '"Se isso estivesse pronto por R$156/mês, você assinaria? Se não, o que falta?" — valida Stage Gate 2' },
              { dia: 6, label: 'Ajuste de Rota', acao: 'Priorize o que falta no código com base nos feedbacks. Às vezes a feature que você achava vital é ignorada' },
              { dia: 7, label: 'Documentação', acao: 'Atualize OKRs e Roadmap na aba OKRs com o que você ouviu' },
            ]

            const SEMANAS_4 = [
              {
                titulo: 'Semana 1 — Validação de Oferta',
                cor: RED,
                kpis: [
                  'Disparar pitch para 50 contatos qualificados no LinkedIn',
                  'Conseguir 5 chamadas de demonstração agendadas',
                  'KPI: ≥10% de taxa de resposta',
                ],
              },
              {
                titulo: 'Semana 2 — Protótipo em Combate',
                cor: AMBER,
                kpis: [
                  'Realizar as demos mostrando Gatilho de Decisão (não funcionalidades)',
                  'Identificar se o cliente entende Preço Mínimo vs SELIC',
                  'KPI: 1 carta de intenção ou pré-venda',
                ],
              },
              {
                titulo: 'Semana 3 — Blindagem Jurídica',
                cor: BLUE,
                kpis: [
                  'Publicar Política de Privacidade/LGPD no site',
                  'Subir Governança de 50% → 65%',
                  'KPI: documento publicado em /privacidade',
                ],
              },
              {
                titulo: 'Semana 4 — Primeira Receita',
                cor: GREEN,
                kpis: [
                  'Converter validações em assinaturas pagas R$156+',
                  'Emitir primeira nota fiscal ou recebimento via Stripe/Asaas',
                  'KPI: R$500 de MRR (primeiro cliente)',
                ],
              },
            ]

            return (
              <div className="flex flex-col gap-5">

                {/* Alerta de Gap Comercial */}
                <div className="rounded-xl p-4" style={{ background: `${RED}12`, border: `1px solid ${RED}40` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={14} style={{ color: RED }} />
                    <span className="text-[11px] font-mono font-bold tracking-wider" style={{ color: RED }}>DIAGNÓSTICO: GAP DE EXECUÇÃO COMERCIAL</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
                      <div className="text-[9px] font-mono text-white/25 mb-1">TRL</div>
                      <div className="text-[18px] font-bold font-mono" style={{ color: '#5dade2' }}>{s.trl}</div>
                      <div className="text-[9px] text-white/30">produção real</div>
                    </div>
                    <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
                      <div className="text-[9px] font-mono text-white/25 mb-1">HYPE CYCLE</div>
                      <div className="text-[11px] font-bold" style={{ color: GREEN }}>Encosta</div>
                      <div className="text-[9px] text-white/30">iluminação</div>
                    </div>
                    <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
                      <div className="text-[9px] font-mono text-white/25 mb-1">MRR</div>
                      <div className="text-[18px] font-bold font-mono" style={{ color: fin.receita > 0 ? GREEN : RED }}>R${fin.receita.toLocaleString('pt-BR')}</div>
                      <div className="text-[9px]" style={{ color: fin.receita === 0 ? RED : 'rgba(255,255,255,0.3)' }}>{fin.receita === 0 ? 'zero — alerta' : '/mês'}</div>
                    </div>
                  </div>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    Produto em TRL {s.trl} (produção real) + Hype na Encosta da Iluminação = <span style={{ color: GREEN }}>janela aberta</span>.
                    {fin.receita === 0
                      ? <> Mas MRR R$0 = <span style={{ color: RED, fontWeight: 700 }}>morte por perfeccionismo</span>. Automação de onboarding só faz sentido com &gt;5 clientes/semana. Hoje: zero.</>
                      : <> Continue crescendo — cada semana perdida é posição cedida.</>
                    }
                  </p>
                  <div className="mt-3 rounded-md px-3 py-2" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <p className="text-[11px] font-mono" style={{ color: AMBER }}>
                      📋 Pergunta do log: "O que você fez hoje que aproximou o Runway 0 de R$500 (primeiro cliente)?"
                    </p>
                  </div>
                </div>

                {/* H1 vs H3 Alert */}
                {s.h3 > 20 && fin.receita === 0 && (
                  <div className="rounded-lg px-3 py-2.5" style={{ background: `${AMBER}12`, border: `1px solid ${AMBER}35` }}>
                    <span className="text-[11px] font-mono" style={{ color: AMBER }}>
                      ⚠ H3 (Agentes IA) em {s.h3}% com MRR zero. Guarde para o final de semana — de seg a sex, foco total no H1 (venda do core).
                    </span>
                  </div>
                )}

                {/* Sprint 7 Dias */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Zap size={14} style={{ color: RED }} />
                      <span className="text-[12px] font-bold text-white/70">Sprint de Validação Alpha — 7 Dias</span>
                    </div>
                    <span className="text-[11px] font-mono" style={{ color: sprintDone === 7 ? GREEN : AMBER }}>
                      {sprintDone}/7 dias
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {SPRINT_DIAS.map((d, i) => (
                      <div key={d.dia} className="rounded-lg p-3 flex items-start gap-3 cursor-pointer transition-all"
                        style={{ background: sprintDias[i] ? 'rgba(30,132,73,0.1)' : 'rgba(0,0,0,0.25)', border: `1px solid ${sprintDias[i] ? 'rgba(30,132,73,0.3)' : 'rgba(255,255,255,0.06)'}` }}
                        onClick={() => { const next = [...sprintDias]; next[i] = !next[i]; update({ sprintDias: next }) }}>
                        <div className="mt-0.5 shrink-0">
                          {sprintDias[i]
                            ? <CheckCircle2 size={15} style={{ color: GREEN }} />
                            : <Circle size={15} style={{ color: 'rgba(255,255,255,0.2)' }} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-mono font-bold" style={{ color: RED }}>DIA {d.dia}</span>
                            <span className="text-[11px] font-bold" style={{ color: sprintDias[i] ? GREEN : 'rgba(255,255,255,0.6)' }}>{d.label}</span>
                          </div>
                          <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{d.acao}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4 Semanas */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={14} style={{ color: GREEN }} />
                    <span className="text-[12px] font-bold text-white/70">Plano de 4 Semanas — Sair do Prédio</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {SEMANAS_4.map((sem, si) => {
                      const kpisDone = (semanas4[si] ?? []).filter(Boolean).length
                      return (
                        <div key={si} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${sem.cor}` }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[12px] font-bold" style={{ color: sem.cor }}>{sem.titulo}</span>
                            <span className="text-[10px] font-mono" style={{ color: kpisDone === 3 ? GREEN : 'rgba(255,255,255,0.2)' }}>{kpisDone}/3</span>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {sem.kpis.map((kpi, ki) => (
                              <div key={ki} className="flex items-start gap-2 cursor-pointer"
                                onClick={() => { const ns = semanas4.map((r, ri) => ri === si ? r.map((v, vi) => vi === ki ? !v : v) : [...r]); update({ semanas4: ns }) }}>
                                {(semanas4[si]?.[ki] ?? false)
                                  ? <CheckCircle2 size={13} style={{ color: GREEN, flexShrink: 0, marginTop: 1 }} />
                                  : <Circle size={13} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0, marginTop: 1 }} />}
                                <span className="text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>{kpi}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Scripts de Campo */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Info size={14} style={{ color: BLUE }} />
                    <span className="text-[12px] font-bold text-white/70">Scripts de Campo</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {/* Script entrevista */}
                    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                      <button className="w-full flex items-center justify-between px-3 py-2.5 text-left"
                        style={{ background: openScript === 'entrevista' ? 'rgba(26,82,118,0.15)' : 'rgba(0,0,0,0.2)' }}
                        onClick={() => setOpenScript(openScript === 'entrevista' ? null : 'entrevista')}>
                        <span className="text-[12px] font-bold text-white/60">📋 Script de Entrevista — Validação do IPB</span>
                        <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.3)', transform: openScript === 'entrevista' ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                      </button>
                      {openScript === 'entrevista' && (
                        <div className="px-3 py-3 flex flex-col gap-3" style={{ background: 'rgba(0,0,0,0.15)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          {[
                            { titulo: '1. Contexto do Problema (antes de mostrar o app)', perguntas: [
                              '"Como você toma a decisão de reajustar seus preços hoje? Você olha para o mercado ou apenas para seus custos?"',
                              '"Qual foi a última vez que um indicador econômico (Dólar ou SELIC) afetou seu lucro e você só percebeu tarde demais?"',
                              '"Quanto tempo por semana você gasta alimentando planilhas para ter uma visão clara do seu caixa?"',
                            ]},
                            { titulo: '2. Teste de Funcionalidade (durante a demo)', perguntas: [
                              'Smart Pricing: "Esse valor de Preço Mínimo faz sentido para você ou parece fora da realidade do seu mercado?"',
                              'Cockpit: "O que o indicador de Runway te diz agora? Se esse número caísse pela metade amanhã, qual seria sua primeira reação?"',
                              'IA Advisor: "Essa análise te trouxe algum insight que sua planilha não mostrava, ou ela disse o óbvio?"',
                            ]},
                            { titulo: '3. Teste de UX', perguntas: [
                              '"Se você tivesse que usar isso toda segunda-feira às 08h, o que seria a coisa mais chata ou difícil?"',
                              '"Qual dessas informações é a mais irrelevante para você? O que eu poderia remover sem que você sentisse falta?"',
                              '"O que falta aqui para você confiar 100% na decisão que essa IA está sugerindo?"',
                            ]},
                            { titulo: '4. Pergunta de Ouro (validação de mercado)', perguntas: [
                              '"O IPB substitui a necessidade de um consultor ou funcionário sênior de finanças para você?"',
                              '"De 0 a 10, o quanto você ficaria decepcionado se eu decidisse não lançar esse app?" (Se < 8, MVP ainda não está forte)',
                            ]},
                          ].map((sec, si) => (
                            <div key={si}>
                              <p className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-wider mb-1.5">{sec.titulo}</p>
                              <div className="flex flex-col gap-1">
                                {sec.perguntas.map((p, pi) => (
                                  <p key={pi} className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)', paddingLeft: 8, borderLeft: '2px solid rgba(26,82,118,0.4)' }}>{p}</p>
                                ))}
                              </div>
                            </div>
                          ))}
                          <div className="rounded-md px-3 py-2" style={{ background: `${AMBER}12`, border: `1px solid ${AMBER}25` }}>
                            <p className="text-[11px]" style={{ color: AMBER }}>⚠ Dica: Não defenda o app durante a entrevista. Se o usuário não entendeu, anote "função X falhou" — o erro é do produto, não do usuário.</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Script objeção */}
                    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                      <button className="w-full flex items-center justify-between px-3 py-2.5 text-left"
                        style={{ background: openScript === 'objecao' ? 'rgba(26,82,118,0.15)' : 'rgba(0,0,0,0.2)' }}
                        onClick={() => setOpenScript(openScript === 'objecao' ? null : 'objecao')}>
                        <span className="text-[12px] font-bold text-white/60">💬 Script: "Minha planilha já resolve bem"</span>
                        <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.3)', transform: openScript === 'objecao' ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                      </button>
                      {openScript === 'objecao' && (
                        <div className="px-3 py-3 flex flex-col gap-3" style={{ background: 'rgba(0,0,0,0.15)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <div>
                            <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-1">Objeção</p>
                            <p className="text-[12px] text-white/50 italic">"Minha planilha já resolve bem, não vejo por que mudar."</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-1">Sua resposta (foco em co-criação)</p>
                            <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                              "Justamente por isso eu queria o seu feedback. A planilha é ótima para organizar o passado, mas o IPB foca em
                              <span style={{ color: '#5dade2' }}> prever o impacto de mercado (SELIC/Dólar) no seu preço de amanhã</span>.
                              Eu não quero que você mude agora. Eu quero te mostrar como a IA interpreta os dados que você já tem na planilha
                              e te dá um Gatilho de Decisão que o Excel não consegue.
                              <span style={{ color: GREEN }}> Você me deixa rodar um teste rápido com seus números para ver se a IA encontra um 'ponto cego' na sua margem?</span>"
                            </p>
                          </div>
                          <div className="rounded-md px-3 py-2" style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}25` }}>
                            <p className="text-[11px]" style={{ color: GREEN }}>
                              Você não está vendendo uma assinatura — está vendendo a oportunidade de ser co-autor de uma tecnologia inovadora.
                              Primeiros usuários sentem que o produto foi feito para eles → LTV altíssimo.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Log Diário */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={14} style={{ color: AMBER }} />
                    <span className="text-[12px] font-bold text-white/70">Log Diário</span>
                  </div>
                  <textarea
                    value={s.logAdmin ?? ''}
                    onChange={e => update({ logAdmin: e.target.value })}
                    placeholder="O que você fez hoje que aproximou o Runway 0 de R$500 (primeiro cliente pagante)?"
                    rows={3}
                    className="w-full rounded-lg px-3 py-2.5 bg-transparent outline-none resize-none"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}
                  />
                </div>

              </div>
            )
          })()}

          {/* ═══ PESSOAS ═══ */}
          {tab === 'pessoas' && (() => {
            const TEAL = '#17a589'
            const etapas = [
              { id: 0, num: '01', label: 'Clareza', color: '#5dade2', desc: 'Meta + KPIs da equipe definidos?' },
              { id: 1, num: '02', label: 'Alinhamento', color: GREEN, desc: '1:1 feito + acordos registrados?' },
              { id: 2, num: '03', label: 'Capacitação', color: PURPLE, desc: 'Gap de habilidade + plano de dev?' },
              { id: 3, num: '04', label: 'Execução', color: AMBER, desc: 'Rituais de time ativos?' },
              { id: 4, num: '05', label: 'Resultado', color: TEAL, desc: 'Performance medida + reconhecimento?' },
            ]

            // Calcular liderança score
            const scores: number[] = [
              s.pesMetaEquipe.trim() && s.pesKpiEquipe.trim() ? 20 : s.pesMetaEquipe.trim() ? 10 : 0,
              s.pesUltimo1a1 && s.pesAcordos.trim() ? 20 : s.pesUltimo1a1 ? 10 : 0,
              s.pesGapHabilidade.trim() && s.pesPlanoDev.trim() ? 20 : s.pesGapHabilidade.trim() ? 10 : 0,
              s.pesRituais.filter(Boolean).length * Math.round(20 / 3),
              (s.pesPerfScore > 0 ? 10 : 0) + (s.pesReconhecimento ? 10 : 0),
            ]
            const liderScore = Math.min(100, scores.reduce((a, b) => a + b, 0))
            const liderColor = liderScore >= 80 ? TEAL : liderScore >= 50 ? AMBER : RED

            return (
              <div className="flex flex-col gap-5">

                {/* Score Header */}
                <div className="rounded-xl px-4 py-4" style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}30` }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users2 size={15} style={{ color: TEAL }} />
                      <span className="text-[12px] font-bold text-white/70">Processo de Liderança</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[22px] font-black font-mono" style={{ color: liderColor }}>{liderScore}</span>
                      <span className="text-[11px] text-white/30 font-mono">/100</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${liderScore}%`, background: liderColor }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-white/30 mb-1">Liderados diretos</p>
                      <div className="flex items-center gap-2">
                        {[1,2,3,4,5,6,8,10].map(n => (
                          <button key={n} onClick={() => update({ pesLiderados: n })}
                            className="w-7 h-7 rounded-lg text-[11px] font-mono font-bold transition-all"
                            style={{ background: s.pesLiderados === n ? `${TEAL}30` : 'rgba(0,0,0,0.3)', border: `1px solid ${s.pesLiderados === n ? TEAL + '70' : 'rgba(255,255,255,0.08)'}`, color: s.pesLiderados === n ? TEAL : 'rgba(255,255,255,0.3)' }}>
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/30">Status</p>
                      <p className="text-[11px] font-bold" style={{ color: liderColor }}>
                        {liderScore >= 80 ? 'Liderança efetiva' : liderScore >= 50 ? 'Em desenvolvimento' : 'Atenção necessária'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5 Etapas colapsáveis */}
                {etapas.map(etapa => (
                  <div key={etapa.id} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${pesExpandIdx === etapa.id ? etapa.color + '40' : 'rgba(255,255,255,0.06)'}`, background: pesExpandIdx === etapa.id ? `${etapa.color}08` : 'rgba(0,0,0,0.15)' }}>
                    <button className="w-full flex items-center gap-3 px-4 py-3" onClick={() => setPesExpandIdx(pesExpandIdx === etapa.id ? null : etapa.id)}>
                      <span className="text-[10px] font-mono font-bold" style={{ color: etapa.color, opacity: 0.6 }}>{etapa.num}</span>
                      <span className="text-[12px] font-bold flex-1 text-left" style={{ color: pesExpandIdx === etapa.id ? etapa.color : 'rgba(255,255,255,0.6)' }}>{etapa.label}</span>
                      <span className="text-[10px] text-white/25 flex-1 text-left hidden sm:block">{etapa.desc}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-mono font-bold" style={{ color: etapa.color }}>{scores[etapa.id]}/20</span>
                        <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.2)', transform: pesExpandIdx === etapa.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                      </div>
                    </button>

                    {pesExpandIdx === etapa.id && (
                      <div className="px-4 pb-4 flex flex-col gap-3">
                        {/* Etapa 01 — Clareza */}
                        {etapa.id === 0 && (
                          <>
                            <div>
                              <p className="text-[10px] text-white/35 mb-1.5">Meta da equipe para o trimestre</p>
                              <input value={s.pesMetaEquipe} onChange={e => update({ pesMetaEquipe: e.target.value })}
                                placeholder="Ex: Fechar 10 novos contratos até 30/06"
                                className="w-full rounded-lg px-3 py-2 text-[12px] outline-none"
                                style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${etapa.color}25`, color: 'rgba(255,255,255,0.7)' }} />
                            </div>
                            <div>
                              <p className="text-[10px] text-white/35 mb-1.5">KPI principal (como vai medir o progresso?)</p>
                              <input value={s.pesKpiEquipe} onChange={e => update({ pesKpiEquipe: e.target.value })}
                                placeholder="Ex: Taxa de conversão ≥ 25% | NPS ≥ 70"
                                className="w-full rounded-lg px-3 py-2 text-[12px] outline-none"
                                style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${etapa.color}25`, color: 'rgba(255,255,255,0.7)' }} />
                            </div>
                            {(!s.pesMetaEquipe || !s.pesKpiEquipe) && (
                              <div className="rounded-md px-3 py-2" style={{ background: `${etapa.color}08`, border: `1px solid ${etapa.color}20` }}>
                                <p className="text-[11px]" style={{ color: etapa.color }}>Sem meta clara não há liderança — há apenas gerenciamento de agenda.</p>
                              </div>
                            )}
                          </>
                        )}

                        {/* Etapa 02 — Alinhamento */}
                        {etapa.id === 1 && (
                          <>
                            <div>
                              <p className="text-[10px] text-white/35 mb-1.5">Último 1:1 realizado</p>
                              <input type="date" value={s.pesUltimo1a1} onChange={e => update({ pesUltimo1a1: e.target.value })}
                                className="rounded-lg px-3 py-2 text-[12px] outline-none"
                                style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${etapa.color}25`, color: 'rgba(255,255,255,0.7)' }} />
                              {s.pesUltimo1a1 && (() => {
                                const diff = Math.floor((Date.now() - new Date(s.pesUltimo1a1).getTime()) / 86400000)
                                return <span className="ml-2 text-[11px]" style={{ color: diff > 14 ? RED : diff > 7 ? AMBER : etapa.color }}>{diff === 0 ? 'hoje' : `${diff}d atrás`}</span>
                              })()}
                            </div>
                            <div>
                              <p className="text-[10px] text-white/35 mb-1.5">Acordos e compromissos registrados</p>
                              <textarea value={s.pesAcordos} onChange={e => update({ pesAcordos: e.target.value })}
                                placeholder="Ex: Marcos vai entregar proposta até 5ª. Eu vou destravar acesso ao sistema até amanhã."
                                rows={3} className="w-full rounded-lg px-3 py-2 text-[12px] outline-none resize-none"
                                style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${etapa.color}25`, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }} />
                            </div>
                          </>
                        )}

                        {/* Etapa 03 — Capacitação */}
                        {etapa.id === 2 && (
                          <>
                            <div>
                              <p className="text-[10px] text-white/35 mb-1.5">Principal gap de habilidade do time</p>
                              <input value={s.pesGapHabilidade} onChange={e => update({ pesGapHabilidade: e.target.value })}
                                placeholder="Ex: Negociação, técnico de produto, gestão do tempo..."
                                className="w-full rounded-lg px-3 py-2 text-[12px] outline-none"
                                style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${etapa.color}25`, color: 'rgba(255,255,255,0.7)' }} />
                            </div>
                            <div>
                              <p className="text-[10px] text-white/35 mb-1.5">Plano de desenvolvimento ativo</p>
                              <textarea value={s.pesPlanoDev} onChange={e => update({ pesPlanoDev: e.target.value })}
                                placeholder="Ex: Curso X na semana 2, shadowing com sênior, leitura 1 livro/mês, feedback semanal..."
                                rows={3} className="w-full rounded-lg px-3 py-2 text-[12px] outline-none resize-none"
                                style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${etapa.color}25`, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }} />
                            </div>
                          </>
                        )}

                        {/* Etapa 04 — Execução */}
                        {etapa.id === 3 && (
                          <>
                            <p className="text-[10px] text-white/35">Rituais de time ativos esta semana</p>
                            {[
                              { label: 'Daily (15 min / dia)', sub: 'O que fiz, o que farei, o que bloqueia' },
                              { label: 'Reunião semanal de time', sub: 'Revisão de metas, prioridades, bloqueios' },
                              { label: 'Retrospectiva mensal', sub: 'O que funcionou, o que não funcionou, melhorias' },
                            ].map((r, ri) => (
                              <button key={ri} onClick={() => { const arr = [...s.pesRituais]; arr[ri] = !arr[ri]; update({ pesRituais: arr }) }}
                                className="flex items-start gap-3 text-left p-3 rounded-lg transition-all"
                                style={{ background: s.pesRituais[ri] ? `${etapa.color}12` : 'rgba(0,0,0,0.2)', border: `1px solid ${s.pesRituais[ri] ? etapa.color + '35' : 'rgba(255,255,255,0.06)'}` }}>
                                {s.pesRituais[ri]
                                  ? <CheckCircle2 size={14} style={{ color: etapa.color, marginTop: 1, flexShrink: 0 }} />
                                  : <Circle size={14} style={{ color: 'rgba(255,255,255,0.15)', marginTop: 1, flexShrink: 0 }} />}
                                <div>
                                  <p className="text-[12px] font-semibold" style={{ color: s.pesRituais[ri] ? etapa.color : 'rgba(255,255,255,0.5)' }}>{r.label}</p>
                                  <p className="text-[10px] text-white/25 mt-0.5">{r.sub}</p>
                                </div>
                              </button>
                            ))}
                            {s.pesRituais.filter(Boolean).length === 0 && (
                              <div className="rounded-md px-3 py-2" style={{ background: `${RED}08`, border: `1px solid ${RED}20` }}>
                                <p className="text-[11px]" style={{ color: RED }}>Rituais são o esqueleto da execução. Sem eles, a equipe opera no improviso.</p>
                              </div>
                            )}
                          </>
                        )}

                        {/* Etapa 05 — Resultado */}
                        {etapa.id === 4 && (
                          <>
                            <div>
                              <p className="text-[10px] text-white/35 mb-2">Performance geral da equipe este mês</p>
                              <div className="flex gap-2">
                                {[
                                  { v: 1, label: 'Abaixo', color: RED },
                                  { v: 2, label: 'Regular', color: AMBER },
                                  { v: 3, label: 'Boa', color: '#5dade2' },
                                  { v: 4, label: 'Excelente', color: TEAL },
                                ].map(opt => (
                                  <button key={opt.v} onClick={() => update({ pesPerfScore: opt.v })}
                                    className="flex-1 py-2 rounded-lg text-[11px] font-bold transition-all"
                                    style={{ background: s.pesPerfScore === opt.v ? `${opt.color}20` : 'rgba(0,0,0,0.3)', border: `1px solid ${s.pesPerfScore === opt.v ? opt.color + '50' : 'rgba(255,255,255,0.07)'}`, color: s.pesPerfScore === opt.v ? opt.color : 'rgba(255,255,255,0.25)' }}>
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <button onClick={() => update({ pesReconhecimento: !s.pesReconhecimento })}
                              className="flex items-center gap-3 p-3 rounded-lg transition-all text-left"
                              style={{ background: s.pesReconhecimento ? `${TEAL}12` : 'rgba(0,0,0,0.2)', border: `1px solid ${s.pesReconhecimento ? TEAL + '35' : 'rgba(255,255,255,0.06)'}` }}>
                              {s.pesReconhecimento
                                ? <CheckCircle2 size={14} style={{ color: TEAL, flexShrink: 0 }} />
                                : <Circle size={14} style={{ color: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />}
                              <div>
                                <p className="text-[12px] font-semibold" style={{ color: s.pesReconhecimento ? TEAL : 'rgba(255,255,255,0.5)' }}>Reconhecimento público feito esta semana</p>
                                <p className="text-[10px] text-white/25 mt-0.5">Celebrei resultados e comportamentos que quero repetir</p>
                              </div>
                            </button>
                            <div>
                              <p className="text-[10px] text-white/35 mb-1.5">Reflexão de liderança (o que posso melhorar?)</p>
                              <textarea value={s.pesReflexao} onChange={e => update({ pesReflexao: e.target.value })}
                                placeholder="O que mais limitou os resultados da equipe esta semana? O que eu, como líder, posso mudar?"
                                rows={3} className="w-full rounded-lg px-3 py-2 text-[12px] outline-none resize-none"
                                style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${TEAL}25`, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }} />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* IA Coach */}
                <div className="rounded-xl p-4" style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}25` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Brain size={14} style={{ color: TEAL }} />
                    <span className="text-[12px] font-bold" style={{ color: TEAL }}>Coach de Liderança IA</span>
                  </div>
                  <p className="text-[11px] text-white/40 mb-3 leading-relaxed">
                    Baseado nos seus dados ({liderScore}/100 · {s.pesLiderados || '?'} liderados · {s.pesRituais.filter(Boolean).length}/3 rituais), o que você quer trabalhar hoje?
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[
                      'Como dar feedback difícil?',
                      'Time não bate meta — o que fazer?',
                      'Como montar um 1:1 efetivo?',
                      'Delegação sem perder controle',
                      `Analisar meu score (${liderScore}/100)`,
                    ].map(q => (
                      <button key={q} onClick={async () => {
                        setPesIaLoading(true)
                        setPesIaAnswer('')
                        try {
                          const ctx = `Líder com ${s.pesLiderados} liderados. Score: ${liderScore}/100. Rituais ativos: ${s.pesRituais.filter(Boolean).length}/3. Meta equipe: ${s.pesMetaEquipe || 'não definida'}. Gap: ${s.pesGapHabilidade || 'não mapeado'}. Performance: ${['','Abaixo','Regular','Boa','Excelente'][s.pesPerfScore] || 'não avaliada'}.`
                          const res = await fetch('/api/advisor-chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q, marketContext: ctx, role: 'lider' }) })
                          const j = await res.json()
                          setPesIaAnswer(j.answer ?? '')
                        } finally { setPesIaLoading(false) }
                      }}
                        className="px-3 py-1.5 rounded-lg text-[11px] transition-all"
                        style={{ background: `${TEAL}15`, border: `1px solid ${TEAL}30`, color: TEAL }}>
                        {q}
                      </button>
                    ))}
                  </div>
                  {pesIaLoading && (
                    <div className="flex items-center gap-2">
                      <Loader2 size={13} style={{ color: TEAL }} className="animate-spin" />
                      <span className="text-[11px]" style={{ color: TEAL }}>Analisando...</span>
                    </div>
                  )}
                  {pesIaAnswer && !pesIaLoading && (
                    <div className="rounded-lg px-3 py-3 mt-1" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${TEAL}20` }}>
                      <p className="text-[12px] text-white/70 leading-relaxed whitespace-pre-wrap">{pesIaAnswer}</p>
                    </div>
                  )}
                </div>

              </div>
            )
          })()}

        </motion.div>
      </AnimatePresence>
    </div>
  )
}
