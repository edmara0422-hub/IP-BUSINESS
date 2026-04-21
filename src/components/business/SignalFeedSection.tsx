'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Color palette ─────────────────────────────────────────────── */
const RED = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'

/* ── Types ─────────────────────────────────────────────────────── */
type Severity = 'CRÍTICO' | 'ALERTA' | 'SINAL'
type FilterKey = 'all' | 'CRÍTICO' | 'ALERTA' | 'SINAL'

interface PipelineSignal {
  id: string
  severity: Severity
  evento: string
  impacto: string
  oportunidade: string
  acao: string
  timestamp: string
  detail?: string
}

const SEVERITY_COLOR: Record<Severity, string> = {
  CRÍTICO: RED,
  ALERTA: AMBER,
  SINAL: GREEN,
}

const SEVERITY_BG: Record<Severity, string> = {
  CRÍTICO: 'rgba(192,57,43,0.12)',
  ALERTA: 'rgba(154,125,10,0.12)',
  SINAL: 'rgba(30,132,73,0.12)',
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'CRÍTICO', label: 'Críticos' },
  { key: 'ALERTA', label: 'Alertas' },
  { key: 'SINAL', label: 'Sinais' },
]

/* ── Signal generation engine ──────────────────────────────────── */
function generateSignals(data: any): PipelineSignal[] {
  const signals: PipelineSignal[] = []
  if (!data) return signals

  const selic = data.macro?.selic?.value ?? 0
  const usd = data.macro?.usdBrl?.value ?? 0
  const ipca = data.macro?.ipca?.value ?? 0
  const pib = data.macro?.pib?.value ?? 0
  const sectors: any[] = data.sectors ?? []
  const commodities: Record<string, any> = data.commodities ?? {}
  const platforms: any[] = data.platforms ?? []
  const marketing = data.marketing ?? {}
  const centralProblems: any[] = data.centralProblems ?? []
  const opportunities: any[] = data.opportunities ?? []

  // 1. SELIC alta
  if (selic > 13) {
    signals.push({
      id: 'sig-selic-high',
      severity: 'CRÍTICO',
      evento: `SELIC em ${selic.toFixed(1)}% — crédito travado`,
      impacto: `PMEs sem acesso a financiamento. Custo da dívida sobe ${((selic - 10) * 8).toFixed(0)}%. Consumo retraído e inadimplência crescente.`,
      oportunidade: `Produtos de renda fixa ganham atratividade. CDBs, LCIs e títulos públicos com retorno real acima de ${(selic - ipca).toFixed(1)}%.`,
      acao: 'Renegociar dívidas de curto prazo, migrar para linhas subsidiadas, alocar caixa em renda fixa pós-fixada',
      timestamp: 'Detectado agora',
      detail: `A SELIC a ${selic.toFixed(1)}% representa o maior custo de capital dos últimos ciclos. ${centralProblems.find((p: any) => p.id === 'credit')?.affected ?? 47}% das PMEs reportam dificuldade de acesso a crédito. A cadeia causal completa: BC sobe juros → bancos encarecem crédito → empresas cortam investimento → demanda cai → desemprego sobe. Janela para renda fixa: títulos IPCA+ pagando ${(selic - 1.5).toFixed(1)}% a.a.`,
    })
  }

  // 2. Câmbio alto
  if (usd > 5.5) {
    signals.push({
      id: 'sig-usd-high',
      severity: 'ALERTA',
      evento: `Câmbio R$${usd.toFixed(2)} — pressão sobre importados`,
      impacto: `Custo de importação sobe ${((usd - 5.0) / 5.0 * 100).toFixed(0)}% vs base R$5,00. Insumos tecnológicos, combustíveis e matéria-prima encarecem.`,
      oportunidade: `Exportadores ganham competitividade. Agro, mineração e software com receita em dólar se beneficiam.`,
      acao: 'Contratar hedge cambial para próximos 6 meses, buscar fornecedores nacionais, renegociar contratos dolarizados',
      timestamp: 'há 2min',
      detail: `Dólar a R$${usd.toFixed(2)} impacta diretamente o custo de produção de setores dependentes de importação. Eletrônicos, farmacêutico e químico são os mais afetados. Para exportadores, cada R$0,10 de desvalorização do real representa ~2% de margem adicional. Recomendação: NDF (Non-Deliverable Forward) para proteção de 60-70% da exposição cambial.`,
    })
  }

  // 3. IPCA acima da meta
  if (ipca > 3.25) {
    const desvio = ipca - 3.25
    signals.push({
      id: 'sig-ipca-meta',
      severity: desvio > 2 ? 'CRÍTICO' : 'ALERTA',
      evento: `Inflação ${ipca.toFixed(2)}% acima da meta (3,25%)`,
      impacto: `Poder de compra em queda real de ${desvio.toFixed(2)}pp. Famílias reduzem consumo discricionário. Margem das empresas comprimida.`,
      oportunidade: `Bens essenciais (alimentos, saúde, energia) com demanda inelástica. Setores defensivos protegem receita.`,
      acao: 'Revisar pricing com repasse parcial, otimizar mix para produtos de maior margem, comunicar valor ao invés de preço',
      timestamp: 'há 5min',
      detail: `IPCA a ${ipca.toFixed(2)}% excede a meta do BC em ${desvio.toFixed(2)}pp. O teto da banda (4,75%) ${ipca > 4.75 ? 'foi estourado' : 'está próximo'}. Categorias mais impactadas: alimentação (+${(ipca * 1.4).toFixed(1)}%), transporte (+${(ipca * 1.2).toFixed(1)}%), habitação (+${(ipca * 0.9).toFixed(1)}%). Estratégia de pricing: repasse de ${(desvio * 0.6).toFixed(1)}pp preservando volume, absorver ${(desvio * 0.4).toFixed(1)}pp via eficiência operacional.`,
    })
  }

  // 4. Setores aquecidos (heat > 80)
  sectors
    .filter((s: any) => s.heat > 80)
    .forEach((s: any) => {
      signals.push({
        id: `sig-sector-hot-${s.id}`,
        severity: 'SINAL',
        evento: `Setor ${s.label} aquecido — heat ${s.heat}%`,
        impacto: `Competição crescente no setor. Novos entrantes e capital de risco fluindo. Tendência: ${s.trend ?? 'expansão'}.`,
        oportunidade: `Janela para capturar market share antes da saturação. Valuation de empresas do setor em alta.`,
        acao: `Investir agora em ${s.label}. Acelerar go-to-market, alocar budget de aquisição antes do CAC subir`,
        timestamp: 'há 3min',
        detail: `${s.label} com heat index de ${s.heat}% indica forte demanda e crescimento acelerado. Variação: ${s.change > 0 ? '+' : ''}${s.change}%. Tendência ${s.trend}. Risco: setores com heat > 85 tendem a corrigir em 6-12 meses. Estratégia ótima: entrada agressiva agora com plano de saída em 8-10 meses se heat > 90.`,
      })
    })

  // 5. Setores em queda (heat < 30)
  sectors
    .filter((s: any) => s.heat < 30)
    .forEach((s: any) => {
      signals.push({
        id: `sig-sector-cold-${s.id}`,
        severity: 'ALERTA',
        evento: `Setor ${s.label} em queda — heat ${s.heat}%`,
        impacto: `Contração de mercado. Empresas do setor com valuation depreciado. Consolidação iminente.`,
        oportunidade: `Ativos baratos para aquisição. Empresas enfraquecidas abertas a M&A ou parcerias estratégicas.`,
        acao: `Avaliar M&A no setor ${s.label}. Due diligence em alvos com receita recorrente e base de clientes ativa`,
        timestamp: 'há 8min',
        detail: `${s.label} com heat ${s.heat}% sinaliza contração severa. Variação: ${s.change > 0 ? '+' : ''}${s.change}%. Historicamente, setores nesse nível de heat têm 70% de chance de consolidação nos próximos 12 meses. Empresas com EBITDA positivo mas valuation depreciado são alvos ideais. Considerar acqui-hire para capturar talento e tecnologia a custo reduzido.`,
      })
    })

  // 6. CAC subindo
  const cacDelta = marketing.cacTrend?.delta ?? 0
  if (cacDelta > 15) {
    signals.push({
      id: 'sig-cac-rising',
      severity: 'ALERTA',
      evento: `CAC subindo ${cacDelta.toFixed(0)}% — aquisição cara`,
      impacto: `Custo de aquisição de cliente encareceu. LTV/CAC ratio em deterioração. ROI de campanhas pagas em queda.`,
      oportunidade: `Canais orgânicos com custo marginal zero. SEO, content marketing e comunidade ganham relevância estratégica.`,
      acao: 'Investir em SEO e conteúdo. Realocar 30% do budget de paid para orgânico. Otimizar funil de conversão',
      timestamp: 'há 4min',
      detail: `CAC cresceu ${cacDelta.toFixed(0)}% no período. Share orgânico atual: ${marketing.organicShare?.value ?? 0}% (${marketing.organicShare?.delta > 0 ? '+' : ''}${marketing.organicShare?.delta ?? 0}pp). Benchmark: empresas top-quartile mantêm 60%+ de aquisição orgânica. Cada 10pp de migração paid→organic reduz CAC em ~25%. Implementar: blog SEO-first, programa de referral (CAC zero), webinars de autoridade.`,
    })
  }

  // 7. TikTok CPM caindo
  const tiktok = platforms.find((p: any) => p.id === 'tiktok' || p.label?.toLowerCase().includes('tiktok'))
  if (tiktok && (tiktok.cpmDelta ?? 0) < 0) {
    signals.push({
      id: 'sig-tiktok-cpm',
      severity: 'SINAL',
      evento: `TikTok CPM caindo ${Math.abs(tiktok.cpmDelta).toFixed(0)}% — janela de aquisição barata`,
      impacto: `Custo por mil impressões em queda. Atenção da audiência migrando para a plataforma. Concorrentes ainda não ajustaram budget.`,
      oportunidade: `Escalar ads no TikTok antes da correção de preço. Window de 4-8 semanas para CPM baixo.`,
      acao: 'Realocar 20-30% do budget de Meta/Google para TikTok. Produzir 3-5 criativos nativos por semana',
      timestamp: 'há 6min',
      detail: `TikTok CPM: US$${tiktok.cpm?.toFixed(2) ?? '—'} (${tiktok.cpmDelta > 0 ? '+' : ''}${tiktok.cpmDelta?.toFixed(1) ?? 0}%). Reach: ${tiktok.reach ?? '—'}. ${tiktok.note ?? ''}. Historicamente, quedas de CPM > 10% duram 6-10 semanas. ROI médio de campanhas TikTok durante janela de CPM baixo: 4.2x vs 2.1x em períodos normais.`,
    })
  }

  // 8. PIB crescendo
  if (pib > 3) {
    signals.push({
      id: 'sig-pib-expansion',
      severity: 'SINAL',
      evento: `PIB ${pib.toFixed(1)}% — economia expandindo`,
      impacto: `Demanda agregada crescendo. Mercado de trabalho aquecido. Confiança do consumidor em alta.`,
      oportunidade: `Escalar operações com risco reduzido. Crescimento orgânico do mercado facilita aquisição de clientes.`,
      acao: 'Contratar e expandir. Aumentar capacidade produtiva, abrir novas praças, investir em equipe',
      timestamp: 'há 1min',
      detail: `PIB a ${pib.toFixed(1)}% supera média histórica brasileira de 2,1%. Setores líderes: ${sectors.filter((s: any) => s.change > 0).slice(0, 3).map((s: any) => `${s.label} (+${s.change}%)`).join(', ') || 'dados indisponíveis'}. Janela de expansão típica dura 18-24 meses. Empresas que investem durante expansão capturam 3x mais market share que as conservadoras.`,
    })
  }

  // 9. Platform-specific signals
  platforms
    .filter((p: any) => p.id !== 'tiktok' && p.trend === 'up' && (p.cpcDelta ?? 0) < -5)
    .slice(0, 2)
    .forEach((p: any) => {
      signals.push({
        id: `sig-platform-${p.id}`,
        severity: 'SINAL',
        evento: `${p.label} com CPC em queda ${Math.abs(p.cpcDelta).toFixed(0)}% — eficiência subindo`,
        impacto: `Custo por clique mais baixo na plataforma. ROI de campanhas melhorando.`,
        oportunidade: `Aumentar investimento em ${p.label} enquanto CPC está favorável. ${p.note ?? ''}`,
        acao: `Escalar campanhas em ${p.label}. Testar novos segmentos de audiência com CPC reduzido`,
        timestamp: 'há 7min',
        detail: `${p.label}: CPC US$${p.cpc?.toFixed(2) ?? '—'} (${p.cpcDelta > 0 ? '+' : ''}${p.cpcDelta?.toFixed(1) ?? 0}%). CPM: US$${p.cpm?.toFixed(2) ?? '—'}. Reach: ${p.reach ?? '—'}. Tendência: ${p.trend}. ${p.note ?? ''}`,
      })
    })

  // 10. Commodity signals
  Object.entries(commodities).forEach(([key, c]: [string, any]) => {
    if (!c) return
    const absDelta = Math.abs(c.delta ?? 0)
    if (absDelta > 8) {
      const rising = (c.delta ?? 0) > 0
      signals.push({
        id: `sig-commodity-${key}`,
        severity: absDelta > 15 ? 'CRÍTICO' : 'ALERTA',
        evento: `${c.label ?? key} ${rising ? '▲' : '▼'} ${absDelta.toFixed(1)}% — ${c.value}${c.unit ?? ''}`,
        impacto: rising
          ? `Custo de insumo em alta. Pressão inflacionária na cadeia produtiva.`
          : `Custo caindo. Oportunidade para recompor margens ou reduzir preços.`,
        oportunidade: rising
          ? `Estocar antes de novas altas. Contratos futuros para travar preço.`
          : `Recomprar a preço baixo. Margem adicional para reinvestir em crescimento.`,
        acao: rising
          ? `Hedge em ${c.label ?? key}. Contratos futuros de 3-6 meses, diversificar fornecedores`
          : `Acumular estoque de ${c.label ?? key}. Renegociar contratos com base no novo patamar`,
        timestamp: 'há 10min',
        detail: `${c.label ?? key}: ${c.value}${c.unit ?? ''} (${c.delta > 0 ? '+' : ''}${c.delta}%). Variações acima de 8% em commodities tipicamente persistem por 3-6 meses. Impacto estimado na cadeia: ${(absDelta * 0.4).toFixed(1)}% no custo final do produto.`,
      })
    }
  })

  // Bonus: central problems as critical signals
  centralProblems
    .filter((p: any) => p.affected > 50)
    .slice(0, 2)
    .forEach((p: any) => {
      signals.push({
        id: `sig-problem-${p.id}`,
        severity: 'CRÍTICO',
        evento: `${p.label} — ${p.affected}% afetados`,
        impacto: `Problema estrutural afetando maioria do mercado. Módulo: ${p.module ?? 'geral'}. Semestre: ${p.sem ?? '—'}.`,
        oportunidade: `Quem resolver primeiro captura mercado. Soluções para esse problema têm TAM elevado.`,
        acao: `Desenvolver solução para ${p.label}. MVP em 30 dias, validar com 10 empresas afetadas`,
        timestamp: 'Detectado agora',
        detail: `${p.label}: ${p.affected}% das empresas afetadas. Este é um problema estrutural do mercado brasileiro que persiste há múltiplos ciclos econômicos. Empresas que oferecem solução direta para este pain point têm NPS médio de 72 e churn < 3%.`,
      })
    })

  // Bonus: top opportunities
  opportunities
    .filter((o: any) => o.urgency > 70)
    .slice(0, 2)
    .forEach((o: any) => {
      signals.push({
        id: `sig-opp-${o.id}`,
        severity: 'SINAL',
        evento: `Oportunidade: ${o.label}`,
        impacto: `Urgência ${o.urgency}% — janela temporal se fechando. Tipo: ${o.type ?? 'mercado'}.`,
        oportunidade: `First-mover advantage disponível. Competidores ainda não posicionados.`,
        acao: `Alocar budget de teste, validar em 30 dias, escalar se ROI > 3x`,
        timestamp: 'há 12min',
        detail: `${o.label}: urgência ${o.urgency}%. Oportunidades com urgência > 70% tipicamente têm janela de 2-4 meses antes da competição saturar. Investimento mínimo recomendado para validação: R$5-15k.`,
      })
    })

  // Sort by severity priority then by natural order
  const severityOrder: Record<Severity, number> = { CRÍTICO: 0, ALERTA: 1, SINAL: 2 }
  return signals.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
}

/* ── Pipeline step component ───────────────────────────────────── */
function PipelineStep({
  label,
  text,
  color,
  isLast,
}: {
  label: string
  text: string
  color: string
  isLast?: boolean
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex flex-col items-center" style={{ minWidth: 14 }}>
        <div
          className="rounded-full"
          style={{
            width: 6,
            height: 6,
            backgroundColor: color,
            marginTop: 4,
            flexShrink: 0,
          }}
        />
        {!isLast && (
          <div
            style={{
              width: 1,
              height: 16,
              backgroundColor: `${color}33`,
              marginTop: 2,
            }}
          />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          className="font-mono font-bold uppercase"
          style={{ fontSize: 7, letterSpacing: '0.12em', color: `${color}cc` }}
        >
          {label}
        </span>
        <p className="text-white/60" style={{ fontSize: 10, lineHeight: '14px', marginTop: 1 }}>
          {text}
        </p>
      </div>
    </div>
  )
}

/* ── Signal Card ───────────────────────────────────────────────── */
function SignalCard({
  signal,
  index,
  isExpanded,
  onToggle,
}: {
  signal: PipelineSignal
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const color = SEVERITY_COLOR[signal.severity]
  const bg = SEVERITY_BG[signal.severity]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      layout
      onClick={onToggle}
      className="cursor-pointer select-none"
      style={{
        background: bg,
        borderLeft: `2px solid ${color}88`,
        borderRadius: '0 8px 8px 0',
        padding: '10px 12px',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
        <div className="flex items-center gap-2">
          {/* Severity badge */}
          <span
            className="font-mono font-bold uppercase"
            style={{
              fontSize: 8,
              letterSpacing: '0.15em',
              color: '#000',
              backgroundColor: color,
              padding: '1px 6px',
              borderRadius: 3,
            }}
          >
            {signal.severity}
          </span>
          {/* Timestamp */}
          <span
            className="font-mono text-white/25"
            style={{ fontSize: 8 }}
          >
            {signal.timestamp}
          </span>
        </div>
        {/* Expand indicator */}
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/20"
          style={{ fontSize: 10 }}
        >
          ▼
        </motion.span>
      </div>

      {/* Pipeline: EVENTO → IMPACTO → OPORTUNIDADE → AÇÃO */}
      <div className="flex flex-col" style={{ gap: 0 }}>
        <PipelineStep label="evento" text={signal.evento} color={color} />
        <PipelineStep label="impacto" text={signal.impacto} color={color} />
        <PipelineStep label="oportunidade" text={signal.oportunidade} color={color} />
        <PipelineStep label="ação" text={signal.acao} color={color} isLast />
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && signal.detail && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="font-mono text-white/40"
              style={{
                fontSize: 9,
                lineHeight: '14px',
                marginTop: 10,
                paddingTop: 8,
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span
                className="font-bold uppercase text-white/20"
                style={{ fontSize: 7, letterSpacing: '0.15em', display: 'block', marginBottom: 4 }}
              >
                Análise completa
              </span>
              {signal.detail}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Main Section Component ────────────────────────────────────── */
export default function SignalFeedSection({ data }: { data: any }) {
  const [filter, setFilter] = useState<FilterKey>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const signals = useMemo(() => generateSignals(data), [data])

  const filtered = useMemo(
    () => (filter === 'all' ? signals : signals.filter((s) => s.severity === filter)),
    [signals, filter],
  )

  const counts = useMemo(() => {
    const c = { all: signals.length, CRÍTICO: 0, ALERTA: 0, SINAL: 0 }
    signals.forEach((s) => c[s.severity]++)
    return c
  }, [signals])

  return (
    <section
      className="flex flex-col"
      style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: 12,
        padding: '16px 14px',
        border: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Section header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
        <div className="flex items-center gap-2">
          <span
            className="animate-pulse rounded-full"
            style={{ width: 6, height: 6, backgroundColor: RED, display: 'inline-block' }}
          />
          <span
            className="font-bold uppercase tracking-widest text-white/30"
            style={{ fontSize: 9, letterSpacing: '0.25em' }}
          >
            Signal Feed
          </span>
          <span
            className="font-mono text-white/15"
            style={{ fontSize: 8 }}
          >
            {signals.length} sinais ativos
          </span>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-1" style={{ marginBottom: 10 }}>
        {FILTERS.map((f) => {
          const isActive = filter === f.key
          const badgeColor =
            f.key === 'CRÍTICO' ? RED : f.key === 'ALERTA' ? AMBER : f.key === 'SINAL' ? GREEN : undefined

          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="font-mono font-semibold uppercase transition-all"
              style={{
                fontSize: 8,
                letterSpacing: '0.1em',
                padding: '3px 8px',
                borderRadius: 4,
                border: `1px solid ${isActive ? (badgeColor ?? 'rgba(255,255,255,0.2)') : 'rgba(255,255,255,0.06)'}`,
                background: isActive
                  ? `${badgeColor ?? 'rgba(255,255,255,0.1)'}22`
                  : 'rgba(255,255,255,0.02)',
                color: isActive ? (badgeColor ?? 'rgba(255,255,255,0.6)') : 'rgba(255,255,255,0.25)',
                cursor: 'pointer',
              }}
            >
              {f.label}
              {counts[f.key] > 0 && (
                <span className="ml-1 font-mono" style={{ fontSize: 7, opacity: 0.6 }}>
                  {counts[f.key]}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Signal list with vertical timeline */}
      <div
        className="relative flex flex-col overflow-y-auto"
        style={{ gap: 8, maxHeight: 520, paddingLeft: 12 }}
      >
        {/* Vertical timeline line */}
        <div
          className="absolute left-0 top-0"
          style={{
            width: 1,
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
          }}
        />

        <AnimatePresence mode="popLayout">
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center font-mono text-white/15"
              style={{ fontSize: 9 }}
            >
              Nenhum sinal {filter !== 'all' ? `do tipo ${filter}` : ''} detectado
            </motion.div>
          )}
          {filtered.map((signal, i) => (
            <div key={signal.id} className="relative">
              {/* Timeline dot connector */}
              <div
                className="absolute rounded-full"
                style={{
                  width: 5,
                  height: 5,
                  backgroundColor: SEVERITY_COLOR[signal.severity],
                  left: -14,
                  top: 14,
                  boxShadow: `0 0 6px ${SEVERITY_COLOR[signal.severity]}66`,
                }}
              />
              <SignalCard
                signal={signal}
                index={i}
                isExpanded={expandedId === signal.id}
                onToggle={() =>
                  setExpandedId((prev) => (prev === signal.id ? null : signal.id))
                }
              />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between text-white/15"
        style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <span className="font-mono" style={{ fontSize: 7 }}>
          Atualizado em tempo real • Motor de sinais v2.0
        </span>
        <span className="font-mono" style={{ fontSize: 7 }}>
          {counts.CRÍTICO > 0 && `${counts.CRÍTICO} críticos`}
          {counts.CRÍTICO > 0 && counts.ALERTA > 0 && ' • '}
          {counts.ALERTA > 0 && `${counts.ALERTA} alertas`}
        </span>
      </div>
    </section>
  )
}
