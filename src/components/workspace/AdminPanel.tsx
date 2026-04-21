'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useWorkspaceData } from '@/hooks/useWorkspaceData'
import {
  Target, AlertTriangle, TrendingUp, Loader2, Brain,
  ChevronRight, CheckCircle2, Circle, Zap, Info,
  Link2, RefreshCw, Building2, Users2, DollarSign,
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
const GOV_CHECKS = {
  govEstrategia: ['Tecnologia alinhada à estratégia de longo prazo', 'Prioridades e investimentos em tech definidos', 'Indicadores de resultado mapeados', 'Roadmap de 12 meses atualizado'],
  govRiscos: ['Ameaças identificadas e avaliadas', 'Criptografia e 2FA ativos em todas as contas', 'Plano de resposta a incidentes documentado', 'Treinamento de segurança realizado no time'],
  govPoliticas: ['Política de uso de dados definida (LGPD)', 'Acesso a dados sensíveis controlado por role', 'Política de fornecedores ESG aplicada', 'Código de conduta digital publicado'],
  govMonitoramento: ['Monitoramento de uptime ativo', 'Logs de acesso armazenados (mín. 6 meses)', 'Revisão trimestral de ferramentas e custos', 'Métricas de impacto acompanhadas toda semana'],
}
const GOV_LABELS: Record<string, string> = { govEstrategia: '🎯 Estratégia', govRiscos: '🛡️ Riscos', govPoliticas: '📋 Políticas', govMonitoramento: '🔄 Monitoramento' }
const GOV_COLORS: Record<string, string> = { govEstrategia: BLUE, govRiscos: RED, govPoliticas: AMBER, govMonitoramento: GREEN }
const MATURITY = ['Não iniciado', 'Em desenvolvimento', 'Implementado', 'Otimizado']
const MATURITY_COLORS = ['rgba(255,255,255,0.2)', AMBER, '#5dade2', GREEN]

// ─────────────────────────────────────────────
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
type AdminTab = 'td' | 'inovacao' | 'okrs' | 'gov' | 'norte' | 'monitor'

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

  useEffect(() => { if (tab === 'monitor') { loadMonitor(); loadZoho() } }, [tab]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const TABS: { id: AdminTab; label: string; color: string }[] = [
    { id: 'td', label: 'TD', color: BLUE },
    { id: 'inovacao', label: 'Inovação', color: PURPLE },
    { id: 'okrs', label: 'OKRs', color: GREEN },
    { id: 'gov', label: 'Governança', color: AMBER },
    { id: 'norte', label: 'Norte', color: '#5dade2' },
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
              <p className="text-[11px] text-white/30">OKRs são ambiciosos — <span style={{ color: GREEN }}>70% já é sucesso.</span></p>
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
              <p className="text-[11px] text-white/30">4 pilares — se um falha, a casa desaba.</p>
              {(Object.entries(GOV_CHECKS) as [keyof typeof GOV_CHECKS, string[]][]).map(([key, items]) => {
                const arr = (s[key] as boolean[]) ?? items.map(() => false)
                const done = arr.filter(Boolean).length
                return (
                  <div key={key} className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${GOV_COLORS[key]}` }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[13px] font-semibold text-white/60">{GOV_LABELS[key]}</span>
                      <span className="font-mono text-[12px] font-bold" style={{ color: done === items.length ? GREEN : done >= 2 ? AMBER : RED }}>{done}/{items.length}</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {items.map((item, i) => (
                        <button key={i} onClick={() => { const next = [...arr]; next[i] = !next[i]; update({ [key]: next } as Partial<CockpitState>) }}
                          className="flex items-center gap-2.5 text-left rounded-md px-2.5 py-1.5 transition-all" style={{ background: arr[i] ? `${GOV_COLORS[key]}08` : 'transparent' }}>
                          <span className="text-[12px] font-mono shrink-0 w-4" style={{ color: arr[i] ? GREEN : 'rgba(255,255,255,0.2)' }}>{arr[i] ? '✓' : '○'}</span>
                          <span className="text-[12px] leading-snug" style={{ color: arr[i] ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.28)' }}>{item}</span>
                        </button>
                      ))}
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
              <div className="rounded-lg px-4 py-3" style={{ background: 'rgba(93,173,226,0.06)', border: '1px solid rgba(93,173,226,0.15)' }}>
                <p className="text-[11px] text-white/35 leading-relaxed">A pergunta que separa quem sobrevive de quem lidera: "onde queremos chegar?". Cultura de dados + governança + inovação ambidestra = liderança em 2025.</p>
              </div>
              <div><p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Onde queremos chegar?</p>
                <textarea value={s.norteStar} onChange={e => update({ norteStar: e.target.value })} placeholder="Nossa estrela do norte..." rows={4} className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(93,173,226,0.18)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }} />
              </div>
              <div><p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Cultura</p>
                <textarea value={s.cultura} onChange={e => update({ cultura: e.target.value })} placeholder="Valores praticados vs declarados, rituais, clima..." rows={4} className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }} />
              </div>
              <div><p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Reflexão livre</p>
                <textarea value={s.reflexaoNorte} onChange={e => update({ reflexaoNorte: e.target.value })} placeholder="O que aprendemos hoje?" rows={3} className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }} />
              </div>
            </div>
          )}

          {/* ═══ MONITOR ═══ */}
          {tab === 'monitor' && (
            <div className="flex flex-col gap-5">

              {/* ── Zoho CRM ── */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Link2 size={13} style={{ color: '#5dade2' }} />
                    <span className="text-[12px] font-bold text-white/60">Zoho CRM</span>
                    {zohoStatus?.connected && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: `${GREEN}20`, color: GREEN }}>CONECTADO</span>}
                    {zohoStatus && !zohoStatus.connected && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: `${AMBER}20`, color: AMBER }}>NÃO CONECTADO</span>}
                  </div>
                  <button onClick={loadZoho} className="flex items-center gap-1 text-[10px] text-white/20 hover:text-white/40 transition-colors">
                    <RefreshCw size={10} className={zohoLoading ? 'animate-spin' : ''} />
                    Atualizar
                  </button>
                </div>

                {zohoLoading && <div className="flex items-center justify-center py-6"><Loader2 size={14} className="animate-spin text-white/25" /></div>}

                {!zohoLoading && zohoStatus && !zohoStatus.connected && (
                  <div className="flex flex-col gap-3">
                    {!zohoStatus.configured ? (
                      <div className="rounded-lg p-3" style={{ background: 'rgba(154,125,10,0.08)', border: '1px solid rgba(154,125,10,0.2)' }}>
                        <p className="text-[11px] font-bold mb-1" style={{ color: AMBER }}>Configuração necessária</p>
                        <p className="text-[11px] text-white/40 leading-relaxed mb-2">Adicione no Vercel (Settings → Environment Variables):</p>
                        <div className="flex flex-col gap-1 font-mono text-[10px]" style={{ color: AMBER }}>
                          <span>ZOHO_CLIENT_ID=&lt;seu client id&gt;</span>
                          <span>ZOHO_CLIENT_SECRET=&lt;seu client secret&gt;</span>
                          <span>NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app</span>
                        </div>
                        <p className="text-[10px] text-white/30 mt-2 leading-relaxed">
                          Crie as credenciais em: <span style={{ color: '#5dade2' }}>api-console.zoho.com → Server-based Applications</span>
                        </p>
                        <p className="text-[10px] text-white/30 mt-1">
                          Authorized Redirect URI: <span style={{ color: '#5dade2' }}>seu-dominio.vercel.app/api/zoho/callback</span>
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <p className="text-[11px] text-white/40">Credenciais configuradas. Clique para autorizar o acesso ao Zoho CRM.</p>
                        <a href="/api/zoho/connect"
                          className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-[12px] transition-all"
                          style={{ background: 'rgba(93,173,226,0.12)', border: '1px solid rgba(93,173,226,0.3)', color: '#5dade2' }}>
                          <Link2 size={13} />
                          Conectar Zoho CRM
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {!zohoLoading && zohoStatus?.connected && zohoData?.summary && (
                  <div className="flex flex-col gap-3">
                    {zohoStatus.org?.name && (
                      <div className="flex items-center gap-2">
                        <Building2 size={11} style={{ color: GREEN }} />
                        <span className="text-[11px] text-white/40">{zohoStatus.org.name}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                      <div>
                        <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">Pipeline por fase</p>
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
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── NPS + Denúncias ── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[{ label: 'FEEDBACKS', value: feedbacks.length, color: '#5dade2' }, { label: 'NPS MÉDIO', value: npsAvg, color: parseFloat(npsAvg) >= 8 ? GREEN : parseFloat(npsAvg) >= 6 ? AMBER : RED }, { label: 'NPS NET', value: npsNet, color: npsNet >= 50 ? GREEN : npsNet >= 0 ? AMBER : RED }, { label: 'DENÚNCIAS', value: denuncias.length, color: RED }].map(card => (
                  <div key={card.label} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-[10px] text-white/25 font-mono">{card.label}</p>
                    <p className="text-[24px] font-bold font-mono" style={{ color: card.color }}>{card.value}</p>
                  </div>
                ))}
              </div>
              {monitorLoading ? <div className="flex items-center justify-center py-10"><Loader2 size={16} className="animate-spin text-white/25" /></div> : (
                <>
                  {feedbacks.length > 0 && <><p className="text-[10px] font-mono text-white/25 uppercase tracking-widest">Feedbacks recentes</p>
                    <div className="flex flex-col gap-2">{feedbacks.slice(0, 10).map(fb => (
                      <div key={fb.id} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${npsColor(fb.nps_score)}` }}>
                        <div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2">{fb.nps_score !== null && <span className="font-mono text-[16px] font-bold" style={{ color: npsColor(fb.nps_score) }}>{fb.nps_score}</span>}{fb.category && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>{fb.category}</span>}</div><span className="text-[10px] text-white/20 font-mono">{timeAgo(fb.created_at)}</span></div>
                        {fb.message && <p className="text-[13px] text-white/50 leading-relaxed">{fb.message}</p>}
                      </div>
                    ))}</div></>}
                  {feedbacks.length === 0 && <p className="text-center text-[13px] text-white/25 py-6">Nenhum feedback ainda</p>}
                  {denuncias.length > 0 && <><p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mt-2">Denúncias</p>
                    <div className="flex flex-col gap-2">{denuncias.map(dn => (
                      <div key={dn.id} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${RED}` }}>
                        <div className="flex items-center justify-between mb-1"><span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(192,57,43,0.15)', color: RED }}>{dn.tipo}</span><span className="text-[10px] text-white/20 font-mono">{timeAgo(dn.created_at)}</span></div>
                        <p className="text-[13px] text-white/50 leading-relaxed mt-1">{dn.descricao}</p>
                      </div>
                    ))}</div></>}
                  <button onClick={loadMonitor} className="mx-auto text-[11px] text-white/20 hover:text-white/40 font-mono transition-colors">Atualizar dados</button>
                </>
              )}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  )
}
