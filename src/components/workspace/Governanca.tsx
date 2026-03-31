'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, FileText, CheckSquare, BookOpen, Loader2, Copy, ChevronDown, Sparkles } from 'lucide-react'

const BLUE = '#1a5276'
const GREEN = '#1e8449'

// ── Conteúdo do IPB ──

const SECTIONS = [
  {
    id: 'politicas',
    title: 'Políticas',
    icon: FileText,
    items: [
      { title: 'Política de Privacidade e Dados (LGPD)', content: 'O IPB coleta e processa dados pessoais exclusivamente para fornecer inteligência de mercado personalizada. Todos os dados são armazenados no Supabase com Row Level Security (RLS) — cada usuário acessa apenas seus próprios dados. Benchmarks são sempre anônimos e agregados. O usuário tem direito a: acesso, correção, exclusão e portabilidade dos seus dados. Consentimento explícito no cadastro. Dados individuais NUNCA aparecem publicamente.' },
      { title: 'Política de Diversidade e Inclusão', content: 'O IPB é acessível por design — não retrofit. Modos de acessibilidade: Foco (TDAH), Calmo (TEA), Alto Contraste (visual). Linguagem neutra sem suposições de gênero. Interface legível para +50. O app atende de PF iniciante a LTDA — sem discriminação por porte. Meta: 50% diversidade em liderança. Gap salarial auditado anualmente. Inclusão de PcD além da cota legal.' },
      { title: 'Política de Segurança da Informação', content: 'Infraestrutura: Vercel (CDN global) + Supabase (PostgreSQL com RLS). Autenticação via Supabase Auth com hash bcrypt. Comunicação 100% HTTPS/TLS. Sem armazenamento de senhas em texto. Chaves de API em variáveis de ambiente (nunca no código). Backups automáticos do banco. Monitoramento de uptime. Resposta a incidentes: notificação em 72h conforme LGPD.' },
      { title: 'Política de Uso Aceitável', content: 'O IPB é uma ferramenta de inteligência de mercado. Proibido: uso para manipulação de mercado, insider trading, compartilhamento de credenciais, scraping de dados, engenharia reversa. Os dados de mercado são de fontes públicas (BCB, IBGE, Yahoo Finance) e servem como referência — não como recomendação financeira. O IPB não é assessoria de investimentos.' },
    ],
  },
  {
    id: 'praticas',
    title: 'Práticas',
    icon: CheckSquare,
    items: [
      { title: 'Transparência de Dados', content: 'Todas as fontes de dados são documentadas: SELIC (BCB série 432), IPCA (BCB série 13522), PIB (BCB Focus), USD (AwesomeAPI), Ações (Brapi.dev), Commodities (AwesomeAPI). Quando uma API falha, o sistema usa fallbacks documentados — nunca dados inventados. O usuário pode verificar as fontes a qualquer momento.' },
      { title: 'IA Responsável', content: 'O IPB usa Groq/Llama 3.3 70B para análises. A IA não toma decisões pelo usuário — apresenta dados e recomenda ações. Prompts são documentados e auditáveis. Sem viés intencional. Respostas adaptadas por modo de acessibilidade (TDAH: bullets curtos, TEA: linguagem literal). A IA nunca armazena conversas — cada sessão é independente.' },
      { title: 'Sustentabilidade Digital', content: 'O IPB é 100% digital — zero papel. Hospedagem em edge (Vercel) reduz latência e consumo energético. Cache de 5 minutos para IA reduz chamadas desnecessárias. Código otimizado: 7 APIs paralelas em vez de 23 sequenciais. App leve: funciona em conexões lentas. Compromisso: medir e compensar pegada de carbono dos servidores.' },
      { title: 'Investimento Social (ISP)', content: 'O IPB democratiza inteligência de mercado — o que custa R$50-200k em consultoria, o IPB oferece via IA grátis. Intelligence: currículo PUCPR BI Negócios acessível a todos os assinantes. Plano gratuito para MEIs (módulos básicos). Plano social para ONGs e associações. Meta: 1-2% da receita destinada a ISP (educação, inclusão digital).' },
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance',
    icon: Shield,
    items: [
      { title: 'LGPD (Lei Geral de Proteção de Dados)', content: 'Conformidade total com a Lei 13.709/2018. Base legal: consentimento (Art. 7º, I) para dados pessoais, legítimo interesse (Art. 7º, IX) para dados de mercado. DPO designado. Registro de operações de tratamento. Relatório de Impacto à Proteção de Dados (RIPD) disponível. Canal de solicitação do titular: feedback no app ou email.' },
      { title: 'Marco Civil da Internet', content: 'Conformidade com Lei 12.965/2014. Neutralidade de rede respeitada. Logs de acesso armazenados por 6 meses conforme exigido. Remoção de conteúdo mediante ordem judicial. Termos de uso claros e acessíveis.' },
      { title: 'Anticorrupção', content: 'Conformidade com Lei Anticorrupção (12.846/2013). Canal de denúncias anônimo disponível no app (Workspace → Canal de Denúncias). Zero tolerância a suborno, propina ou vantagem indevida. Due diligence em parceiros comerciais. Treinamento anual da equipe.' },
      { title: 'Direitos do Consumidor (CDC)', content: 'Informação clara sobre preços e funcionalidades antes da contratação. Direito de arrependimento em 7 dias (Art. 49 CDC). Cancelamento sem multa em contratos mensais. SAC disponível. Não vinculação de serviços.' },
    ],
  },
  {
    id: 'codigos',
    title: 'Códigos',
    icon: BookOpen,
    items: [
      { title: 'Código de Ética', content: 'Princípios: integridade, transparência, respeito, inovação responsável. Proibido: discriminação de qualquer natureza, assédio moral ou sexual, conflito de interesses não declarado, uso de informação privilegiada. Todos os colaboradores assinam o código no onboarding. Revisão anual. Violações reportadas via Canal de Denúncias.' },
      { title: 'Código de Conduta Digital', content: 'Uso responsável de IA: não gerar conteúdo enganoso, não automatizar spam, não manipular dados. Respeito à propriedade intelectual. Não compartilhar dados de outros usuários. Não tentar acessar dados de terceiros. Respeitar limites de uso da API. Reportar vulnerabilidades de segurança.' },
      { title: 'Código de Fornecedores', content: 'Fornecedores de dados (BCB, IBGE, Yahoo Finance, Brapi) são públicos e auditáveis. Fornecedores de infraestrutura (Vercel, Supabase, Groq) avaliados por: segurança, privacidade, uptime, compliance. Contratos incluem cláusulas ESG. Preferência por fornecedores com compromisso ambiental.' },
    ],
  },
]

// ── Templates para empresas gerarem seus documentos ──

const GENERATOR_TEMPLATES = [
  { id: 'privacidade', label: 'Política de Privacidade (LGPD)', prompt: 'Gere uma Política de Privacidade completa seguindo a LGPD (Lei 13.709/2018) para uma empresa. Inclua: 1) Dados coletados e finalidade 2) Base legal 3) Compartilhamento 4) Direitos do titular 5) Segurança 6) Cookies 7) Contato do DPO. Seja profissional e completo.' },
  { id: 'diversidade', label: 'Política de Diversidade e Inclusão', prompt: 'Gere uma Política de Diversidade e Inclusão corporativa. Inclua: 1) Princípios 2) Metas mensuráveis (gênero, raça, PcD, LGBTQIA+) 3) Processo de análise de gap salarial 4) Canais de denúncia 5) Treinamento 6) Cronograma de implementação 6 meses.' },
  { id: 'etica', label: 'Código de Ética', prompt: 'Gere um Código de Ética corporativo completo. Inclua: 1) Valores e princípios 2) Condutas proibidas (assédio, discriminação, conflito de interesses) 3) Relação com clientes, fornecedores e governo 4) Canal de denúncias 5) Consequências de violação 6) Compromisso da liderança.' },
  { id: 'seguranca', label: 'Política de Segurança da Informação', prompt: 'Gere uma Política de Segurança da Informação. Inclua: 1) Classificação de dados 2) Controle de acesso 3) Senhas e autenticação 4) Backup 5) Resposta a incidentes 6) LGPD 7) Treinamento 8) Dispositivos pessoais (BYOD) 9) Cloud security.' },
  { id: 'compliance', label: 'Programa de Compliance', prompt: 'Gere um Programa de Compliance corporativo. Inclua: 1) Estrutura (comitê, responsáveis) 2) Canal de denúncias anônimo 3) Due diligence de parceiros 4) Anticorrupção (Lei 12.846) 5) Treinamento 6) Monitoramento 7) KPIs de compliance 8) Plano de implementação 90 dias.' },
  { id: 'conduta', label: 'Código de Conduta', prompt: 'Gere um Código de Conduta empresarial. Inclua: 1) Comportamento esperado 2) Uso de recursos da empresa 3) Redes sociais 4) Confidencialidade 5) Presentes e hospitalidade 6) Relação com concorrentes 7) Meio ambiente 8) Consequências.' },
  { id: 'fornecedores', label: 'Código de Fornecedores', prompt: 'Gere um Código de Conduta para Fornecedores. Inclua: 1) Critérios ESG 2) Trabalho justo (sem trabalho infantil/escravo) 3) Meio ambiente 4) Anticorrupção 5) Proteção de dados 6) Auditoria 7) Consequências de não conformidade.' },
  { id: 'termos', label: 'Termos de Uso (SaaS)', prompt: 'Gere Termos de Uso para uma plataforma SaaS. Inclua: 1) Definições 2) Aceitação 3) Conta do usuário 4) Planos e pagamento 5) Uso aceitável 6) Propriedade intelectual 7) Limitação de responsabilidade 8) Cancelamento 9) Foro.' },
]

export default function Governanca() {
  const [openSection, setOpenSection] = useState<string | null>('politicas')
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [generatorOpen, setGeneratorOpen] = useState(false)
  const [generating, setGenerating] = useState<string | null>(null)
  const [generated, setGenerated] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState<string | null>(null)

  const generate = useCallback(async (id: string, prompt: string) => {
    setGenerating(id)
    try {
      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: prompt, marketContext: 'Documento corporativo para empresa brasileira.' }),
      })
      const data = await res.json()
      setGenerated(prev => ({ ...prev, [id]: data.answer ?? 'Erro ao gerar.' }))
    } catch {
      setGenerated(prev => ({ ...prev, [id]: 'Erro ao conectar com IA.' }))
    } finally {
      setGenerating(null)
    }
  }, [])

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={18} color={BLUE} />
          <p className="text-[15px] font-bold text-white/80">Governança IPB</p>
        </div>
        <p className="text-[12px] text-white/35">Políticas, práticas, compliance e códigos do IPB. Abaixo: gerador para sua empresa.</p>
      </div>

      {/* 4 Seções do IPB */}
      <div className="flex flex-col gap-2 mb-8">
        {SECTIONS.map(section => {
          const Icon = section.icon
          const isOpen = openSection === section.id
          return (
            <div key={section.id} className="rounded-lg overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)', borderLeft: `3px solid ${BLUE}` }}>
              <button
                onClick={() => setOpenSection(isOpen ? null : section.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <Icon size={16} style={{ color: BLUE }} />
                <span className="text-[14px] font-semibold text-white/70 flex-1">{section.title}</span>
                <span className="text-[11px] text-white/25">{section.items.length} docs</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={14} className="text-white/25" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-3 flex flex-col gap-1.5">
                      {section.items.map(item => {
                        const itemOpen = openItem === item.title
                        return (
                          <div key={item.title}>
                            <button
                              onClick={() => setOpenItem(itemOpen ? null : item.title)}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-all"
                              style={{ background: itemOpen ? 'rgba(255,255,255,0.04)' : 'transparent' }}
                            >
                              <FileText size={12} className="text-white/20 shrink-0" />
                              <span className="text-[13px] text-white/55 flex-1">{item.title}</span>
                              <motion.div animate={{ rotate: itemOpen ? 180 : 0 }}>
                                <ChevronDown size={12} className="text-white/15" />
                              </motion.div>
                            </button>
                            <AnimatePresence>
                              {itemOpen && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                  <div className="px-3 py-3 ml-5 rounded-md" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: '2px solid rgba(255,255,255,0.06)' }}>
                                    <p className="text-[12px] text-white/45 leading-relaxed">{item.content}</p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/5 mb-6" />

      {/* Gerador para empresas */}
      <div>
        <button
          onClick={() => setGeneratorOpen(!generatorOpen)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left"
          style={{ background: 'rgba(30,132,73,0.08)', border: '1px solid rgba(30,132,73,0.15)' }}
        >
          <Sparkles size={16} color={GREEN} />
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-white/70">Gerador de Documentos para Empresas</p>
            <p className="text-[11px] text-white/30">IA gera políticas, códigos e compliance para sua empresa</p>
          </div>
          <motion.div animate={{ rotate: generatorOpen ? 180 : 0 }}>
            <ChevronDown size={16} className="text-white/25" />
          </motion.div>
        </button>

        <AnimatePresence>
          {generatorOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
              <div className="flex flex-col gap-2 mt-3">
                {GENERATOR_TEMPLATES.map(tpl => (
                  <div key={tpl.id} className="rounded-lg overflow-hidden" style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `3px solid ${GREEN}` }}>
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-semibold text-white/60">{tpl.label}</span>
                        <button
                          onClick={() => generate(tpl.id, tpl.prompt)}
                          disabled={generating === tpl.id}
                          className="text-[11px] font-bold px-3 py-1 rounded-md transition-all"
                          style={{ background: `${GREEN}18`, color: GREEN, border: `1px solid ${GREEN}30` }}
                        >
                          {generating === tpl.id ? (
                            <span className="flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Gerando...</span>
                          ) : generated[tpl.id] ? 'Regerar' : 'Gerar com IA'}
                        </button>
                      </div>

                      {generated[tpl.id] && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <div className="rounded-md p-3 mt-2" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <p className="text-[12px] text-white/50 leading-relaxed whitespace-pre-line">{generated[tpl.id]}</p>
                          </div>
                          <button
                            onClick={() => copyText(tpl.id, generated[tpl.id])}
                            className="mt-2 text-[11px] flex items-center gap-1 px-3 py-1 rounded-md transition-all"
                            style={{ border: `1px solid ${copied === tpl.id ? GREEN : 'rgba(255,255,255,0.1)'}`, color: copied === tpl.id ? GREEN : 'rgba(255,255,255,0.35)' }}
                          >
                            <Copy size={12} /> {copied === tpl.id ? 'Copiado!' : 'Copiar documento'}
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
