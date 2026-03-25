'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Cores ──────────────────────────────────────────────────────────────────
const RED   = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'

function trendColor(t: string) { return t === 'up' ? GREEN : t === 'down' ? RED : AMBER }
function deltaColor(d: number) { return d > 0 ? RED : d < 0 ? GREEN : AMBER }   // CPM/CAC: subida é ruim
function goodDeltaColor(d: number) { return d > 0 ? GREEN : d < 0 ? RED : AMBER } // Engagement: subida é boa

function v(n: number | undefined, fb: number) { return (n != null && Number.isFinite(n)) ? n : fb }

// ── Ícones de plataforma (unicode/emoji) ──────────────────────────────────
const PLATFORM_ICON: Record<string, string> = {
  meta_ads: 'ƒ', google_ads: 'G', tiktok: '♪', instagram: '◈',
  mercadolivre: 'ML', shopee: '◉',
}

const PLATFORM_ANALYSIS: Record<string, { why: string; strategy: string[]; bestFor: string; risk: string }> = {
  meta_ads: {
    why: 'CPM subindo devido a mudanças de privacidade iOS (ATT), leilão mais competitivo com mais anunciantes entrando, e algoritmo ML que prioriza formatos de vídeo.',
    strategy: ['Reels: CPM 30-40% menor que feed estático', 'WhatsApp Click-to-Chat: menor fricção de conversão', 'Lookalike 1-3%: melhor custo-benefício pós-iOS', 'Retargeting com janela curta (7 dias) — mais barato'],
    bestFor: 'Awareness + remarketing. Melhores resultados em B2C com produto visual.',
    risk: 'Dependência excessiva → CAC volátil. Sempre ter tráfego orgânico como back-up.',
  },
  google_ads: {
    why: 'CPC alto em keywords transacionais (crédito, seguros, software) por conta de concorrência intensa. Performance Max automatiza mas reduz controle granular.',
    strategy: ['Long-tail keywords: 60-80% menor CPC', 'YouTube Ads: CPM mais baixo que Search', 'Performance Max: bom para e-commerce com catálogo grande', 'Negative keywords: reduz desperdício 15-25%'],
    bestFor: 'Captura de demanda existente. Melhor canal para bottom-of-funnel com alta intenção de compra.',
    risk: 'Automação excessiva pode desperdiçar budget em queries irrelevantes. Monitorar search terms semanalmente.',
  },
  tiktok: {
    why: 'CPM caindo porque anunciantes brasileiros ainda estão em fase de teste — janela de entrada barata antes da saturação. Engajamento nativo ainda alto.',
    strategy: ['Creative-first: conteúdo nativo > banner adaptado', 'UGC (user generated content): +85% engajamento', 'TopView: awareness em escala com CPM único', 'Duet e Stitch: aproveitam trending sounds'],
    bestFor: 'Awareness e aquisição para 18-34 anos. Melhor ROI atual do mercado brasileiro.',
    risk: 'Conteúdo cansa rápido. Frequência de criação alta exige estrutura de produção.',
  },
  instagram: {
    why: 'Reels domina o algoritmo orgânico, mas CPM do paid sobe por concorrência. Shopping integration forte para e-commerce. Público mais velho que TikTok.',
    strategy: ['Reels patrocinados: melhor alcance orgânico + paid', 'Stories: alta taxa de swipe-up para ofertas diretas', 'Collab posts: alcance dobrado sem custo extra', 'Shopping tags: reduz fricção no funil'],
    bestFor: 'E-commerce de moda, beleza, lifestyle. Audiences 25-45 com maior poder de compra.',
    risk: 'CPM competitivo com Meta Ads — testar ambos separados, não duplicar.',
  },
  mercadolivre: {
    why: 'Marketplace ads (Mercado Ads) com CPM estável — audience tem alta intenção de compra. Comissões subiram em 2024, comprimindo margem de sellers.',
    strategy: ['Sponsored Listings: aparecer no topo de busca', 'Oferta do Dia: visibilidade massiva em datas comemorativas', 'Full + (Fulfillment): mais visibilidade no algoritmo', 'Reviews: produto com 4.5+ converte 3x mais'],
    bestFor: 'Produtos de consumo com preço competitivo. Alta intenção de compra — menor CAC para conversão.',
    risk: 'Margem espremida entre comissão (16-20%) + ads + frete. Monitorar ROAS líquido não bruto.',
  },
  shopee: {
    why: 'CPM caindo por competição entre sellers — guerra de preços intensa. Live commerce e afiliados crescendo. Público mais sensível a preço.',
    strategy: ['Flash Sales: visibilidade gratuita no app', 'Afiliados: CPA sem risco de CPM', 'Live Commerce: conversão 6-8x maior que estático', 'Vouchers: item obrigatório para destaque algorítmico'],
    bestFor: 'Categorias de baixo ticket com alta rotatividade. Melhor para construir volume, não margem.',
    risk: 'Precificação agressiva comprime margem. Cuidado com desgaste de marca por guerra de preços.',
  },
}

// ── Interfaces ────────────────────────────────────────────────────────────
interface Platform {
  id: string; label: string; cpm?: number; cpmDelta?: number
  cpc?: number; cpcDelta?: number; reach: string; trend: string; note: string
}

// ══════════════════════════════════════════════════════════════════════════
// ██  MAIN
// ══════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MarketingSection({ data }: { data: any }) {
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null)

  const platforms = data.platforms as Platform[]
  const mkt = data.marketing as Record<string, { value: number; delta: number; label: string }>
  const opportunities = data.opportunities as Array<{ id: string; label: string; urgency: number; type: string }>

  const selic  = v(data.macro.selic?.value, 10.5)
  const usd    = v(data.macro.usdBrl?.value, 5.72)
  const cacVal = v(mkt?.cacTrend?.value, 48.6)
  const cacD   = v(mkt?.cacTrend?.delta, 12.1)

  const cpmVal = v(mkt?.cpmGlobal?.value, 11.3)
  const cpmD   = v(mkt?.cpmGlobal?.delta, 8.2)
  const cpcVal = v(mkt?.cpcGlobal?.value, 1.42)
  const cpcD   = v(mkt?.cpcGlobal?.delta, 5.7)
  const orgVal = v(mkt?.organicShare?.value, 31)
  const orgD   = v(mkt?.organicShare?.delta, -4.2)

  // Build CAC explanation line
  const cacReasons: string[] = []
  if (selic > 12) cacReasons.push('Selic alta')
  if (cpmD > 5) cacReasons.push('CPM subindo')
  if (orgD < 0) cacReasons.push('orgânico caindo')
  if (usd > 5.5) cacReasons.push('câmbio pressionado')
  const cacExplanation = cacReasons.length > 0 ? cacReasons.join(' + ') : 'pressão competitiva'

  // Sorted platforms by cost-effectiveness (lowest CPM/CPC first)
  const sortedPlatforms = useMemo(() => {
    return [...platforms].sort((a, b) => {
      const costA = a.cpm ?? a.cpc ?? 999
      const costB = b.cpm ?? b.cpc ?? 999
      return costA - costB
    })
  }, [platforms])

  // Best platform (cheapest)
  const bestPlatformId = sortedPlatforms.length > 0 ? sortedPlatforms[0].id : null

  // Generate action items based on current data
  const actions = useMemo(() => {
    const items: Array<{ action: string; impact: string; priority: 'URGENTE' | 'IMPORTANTE' | 'CONSIDERAR' }> = []

    // Find cheapest CPM platform
    const cheapestCPM = sortedPlatforms.find(p => p.cpm != null)
    const cheapestCPC = sortedPlatforms.find(p => p.cpc != null)

    if (cheapestCPM && cheapestCPM.id === 'tiktok') {
      items.push({
        action: `Realocar budget para TikTok — CPM ${cheapestCPM.cpm?.toFixed(2)} é o menor do mercado`,
        impact: `Redução estimada de 20-35% no custo por impressão vs Meta`,
        priority: 'URGENTE',
      })
    } else if (cheapestCPM) {
      items.push({
        action: `Concentrar awareness em ${cheapestCPM.label} — CPM US$${cheapestCPM.cpm?.toFixed(2)} mais barato`,
        impact: `Redução de custo por mil impressões vs outras plataformas`,
        priority: 'URGENTE',
      })
    }

    if (orgD < -2) {
      items.push({
        action: `Investir em SEO e conteúdo orgânico — share caiu ${Math.abs(orgD).toFixed(1)}%`,
        impact: 'Cada 1% de orgânico recuperado = menos R$ gasto em paid',
        priority: 'URGENTE',
      })
    }

    if (cacD > 8) {
      items.push({
        action: 'Melhorar LTV do cliente para compensar CAC alto',
        impact: `CAC subiu ${cacD.toFixed(1)}% — foco em retenção reduz dependência de aquisição`,
        priority: 'IMPORTANTE',
      })
    }

    if (cpmD > 5) {
      items.push({
        action: 'Migrar criativos para vídeo curto (Reels/Shorts/TikTok)',
        impact: 'Vídeo tem CPM 30-40% menor que estático nas principais plataformas',
        priority: 'IMPORTANTE',
      })
    }

    items.push({
      action: 'Construir first-party data (email, WhatsApp, CRM)',
      impact: 'Cookie deprecation tornará retargeting 3rd party inviável — dados próprios serão vantagem competitiva',
      priority: 'CONSIDERAR',
    })

    return items
  }, [sortedPlatforms, orgD, cacD, cpmD])

  // Opportunity explanations
  const oppExplanations: Record<string, string> = {
    'canal': 'Janela de custo baixo fecha rápido quando concorrentes entram',
    'tech': 'Adoção precoce gera vantagem competitiva exponencial',
    'macro': 'Condições macro mudam trimestralmente — agir agora ou perder',
    'setor': 'Setores em transformação criam gaps de mercado temporários',
  }

  return (
    <div className="flex flex-col gap-5 px-4 pb-8">

      {/* ── Header ── */}
      <div className="flex items-center gap-2">
        <motion.div className="h-1.5 w-1.5 rounded-full"
          style={{ background: deltaColor(cacD) }}
          animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-white/20">
          Plataformas & Marketing
        </span>
      </div>

      {/* ══ 1. HERO: CAC COMO PROTAGONISTA ══ */}
      <div className="rounded-lg overflow-hidden" style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${deltaColor(cacD)}22` }}>
        <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${deltaColor(cacD)}80, transparent)` }} />
        <div className="p-5">
          <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-white/25 block mb-3">
            QUANTO CUSTA ADQUIRIR 1 CLIENTE?
          </span>

          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[14px] text-white/30">R$</span>
              <span className="font-mono text-[52px] font-bold leading-none text-white/90">{cacVal.toFixed(0)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] font-bold" style={{ color: deltaColor(cacD) }}>
                {cacD > 0 ? '▲' : cacD < 0 ? '▼' : '—'} {Math.abs(cacD).toFixed(1)}%
              </span>
              <span className="font-mono text-[9px] text-white/25">vs mês anterior</span>
            </div>
          </div>

          <div className="rounded-sm px-3 py-2 mb-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="font-mono text-[10px] text-white/40">
              {cacD > 0 ? 'Subiu' : 'Caiu'} {Math.abs(cacD).toFixed(1)}% porque <span className="text-white/60 font-bold">[{cacExplanation}]</span>
            </span>
          </div>

          <div className="text-center">
            <span className="font-mono text-[9px]" style={{ color: selic > 13 ? RED : AMBER }}>
              SELIC {selic.toFixed(1)}% impacta direto no custo de crédito para growth
            </span>
          </div>
        </div>
      </div>

      {/* ══ 2. 3-COLUMN METRICS ROW ══ */}
      <div className="grid grid-cols-3 gap-2">
        {/* CPM Médio */}
        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="font-mono text-[7px] text-white/25 block mb-1.5">CPM MÉDIO</span>
          <span className="font-mono text-[22px] font-bold text-white/80 block leading-none">US${cpmVal.toFixed(1)}</span>
          <span className="font-mono text-[10px] font-bold block mt-1" style={{ color: deltaColor(cpmD) }}>
            {cpmD > 0 ? '▲' : '▼'}{Math.abs(cpmD).toFixed(1)}%
          </span>
          <p className="font-mono text-[8px] text-white/25 mt-1.5 leading-relaxed">
            {cpmD > 3 ? 'CPM subindo = mais caro aparecer' : cpmD < -2 ? 'CPM caindo = oportunidade de escala' : 'CPM estável — monitorar'}
          </p>
        </div>

        {/* CPC Médio */}
        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="font-mono text-[7px] text-white/25 block mb-1.5">CPC MÉDIO</span>
          <span className="font-mono text-[22px] font-bold text-white/80 block leading-none">US${cpcVal.toFixed(2)}</span>
          <span className="font-mono text-[10px] font-bold block mt-1" style={{ color: deltaColor(cpcD) }}>
            {cpcD > 0 ? '▲' : '▼'}{Math.abs(cpcD).toFixed(1)}%
          </span>
          <p className="font-mono text-[8px] text-white/25 mt-1.5 leading-relaxed">
            {cpcD > 3 ? 'CPC alto = cliques caros' : cpcD < -2 ? 'CPC caindo = clicks mais baratos' : 'CPC estável — monitorar'}
          </p>
        </div>

        {/* Tráfego Orgânico */}
        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="font-mono text-[7px] text-white/25 block mb-1.5">ORGÂNICO</span>
          <span className="font-mono text-[22px] font-bold text-white/80 block leading-none">{orgVal}%</span>
          <span className="font-mono text-[10px] font-bold block mt-1" style={{ color: goodDeltaColor(orgD) }}>
            {orgD > 0 ? '▲' : '▼'}{Math.abs(orgD).toFixed(1)}%
          </span>
          <p className="font-mono text-[8px] text-white/25 mt-1.5 leading-relaxed">
            {orgD < -2 ? 'Orgânico caindo = mais dependência de paid' : orgD > 2 ? 'Orgânico crescendo = menos custo' : 'Orgânico estável'}
          </p>
        </div>
      </div>

      {/* ══ 3. PLATFORM RANKING TABLE ══ */}
      <div className="rounded-lg overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/25">
            RANKING DE PLATAFORMAS — por custo-benefício
          </span>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[32px_28px_1fr_72px_56px_64px_1fr] items-center px-3 py-2 gap-2"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)' }}>
          <span className="font-mono text-[7px] text-white/20">#</span>
          <span className="font-mono text-[7px] text-white/20"></span>
          <span className="font-mono text-[7px] text-white/20">PLATAFORMA</span>
          <span className="font-mono text-[7px] text-white/20 text-right">CPM/CPC</span>
          <span className="font-mono text-[7px] text-white/20 text-right">DELTA</span>
          <span className="font-mono text-[7px] text-white/20 text-center">TREND</span>
          <span className="font-mono text-[7px] text-white/20">MELHOR PARA</span>
        </div>

        {/* Table rows */}
        {sortedPlatforms.map((p, i) => {
          const analysis = PLATFORM_ANALYSIS[p.id]
          const isBest = p.id === bestPlatformId
          const isExpanded = expandedPlatform === p.id
          const col = trendColor(p.trend)
          const metric = p.cpm != null
            ? { label: 'CPM', val: `US$${p.cpm.toFixed(2)}`, delta: p.cpmDelta ?? 0 }
            : { label: 'CPC', val: `US$${(p.cpc ?? 0).toFixed(2)}`, delta: p.cpcDelta ?? 0 }
          const dCol = deltaColor(metric.delta)
          const trendLabel = p.trend === 'up' ? '▲ SUBINDO' : p.trend === 'down' ? '▼ CAINDO' : '— ESTÁVEL'

          return (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              style={{ borderLeft: isBest ? `2px solid ${GREEN}` : '2px solid transparent' }}>

              <button className="w-full text-left" onClick={() => setExpandedPlatform(isExpanded ? null : p.id)}>
                <div className="grid grid-cols-[32px_28px_1fr_72px_56px_64px_1fr] items-center px-3 py-2.5 gap-2 transition-colors"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: isExpanded ? 'rgba(255,255,255,0.03)' : 'transparent',
                  }}>
                  {/* Rank */}
                  <span className="font-mono text-[13px] font-bold" style={{ color: isBest ? GREEN : 'rgba(255,255,255,0.25)' }}>
                    {i + 1}
                  </span>

                  {/* Icon */}
                  <div className="w-6 h-6 rounded flex items-center justify-center font-mono text-[9px] font-bold"
                    style={{ background: `${col}12`, color: col, border: `1px solid ${col}25` }}>
                    {PLATFORM_ICON[p.id] ?? p.label[0]}
                  </div>

                  {/* Name */}
                  <div className="min-w-0">
                    <span className="font-mono text-[11px] font-semibold text-white/70">{p.label}</span>
                  </div>

                  {/* CPM/CPC value */}
                  <span className="font-mono text-[12px] font-bold text-white/80 text-right">{metric.val}</span>

                  {/* Delta */}
                  <span className="font-mono text-[10px] font-bold text-right" style={{ color: dCol }}>
                    {metric.delta > 0 ? '▲' : metric.delta < 0 ? '▼' : '—'}{Math.abs(metric.delta).toFixed(1)}%
                  </span>

                  {/* Trend badge */}
                  <span className="font-mono text-[7px] font-bold px-1.5 py-0.5 rounded-sm text-center"
                    style={{ background: `${col}12`, color: col, border: `1px solid ${col}20` }}>
                    {trendLabel}
                  </span>

                  {/* Best for (short) */}
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="font-mono text-[8px] text-white/30 truncate">
                      {analysis?.bestFor?.split('.')[0] ?? p.note}
                    </span>
                    <span className="text-white/15 text-[9px] shrink-0 ml-auto">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>
              </button>

              {/* Expanded detail */}
              <AnimatePresence>
                {isExpanded && analysis && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                    className="overflow-hidden">
                    <div className="px-4 pb-4 pt-3 flex flex-col gap-3" style={{ background: 'rgba(0,0,0,0.15)' }}>

                      {/* Por que este custo */}
                      <div className="rounded-sm p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-white/20 block mb-1.5">POR QUE ESSE CUSTO</span>
                        <p className="text-[10px] text-white/45 leading-relaxed">{analysis.why}</p>
                      </div>

                      {/* Estratégias */}
                      <div>
                        <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-white/20 block mb-2">ESTRATÉGIAS RECOMENDADAS</span>
                        <div className="flex flex-col gap-1.5">
                          {analysis.strategy.map((s, si) => (
                            <div key={si} className="flex items-start gap-2">
                              <span className="font-mono text-[9px] shrink-0 mt-0.5" style={{ color: GREEN }}>→</span>
                              <span className="text-[10px] text-white/40 leading-relaxed">{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Best for + Risk */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-sm p-2.5" style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}25` }}>
                          <span className="font-mono text-[7px] font-bold tracking-[0.15em] block mb-1" style={{ color: GREEN }}>MELHOR PARA</span>
                          <p className="text-[9px] text-white/35 leading-relaxed">{analysis.bestFor}</p>
                        </div>
                        <div className="rounded-sm p-2.5" style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}25` }}>
                          <span className="font-mono text-[7px] font-bold tracking-[0.15em] block mb-1" style={{ color: AMBER }}>ATENÇÃO</span>
                          <p className="text-[9px] text-white/35 leading-relaxed">{analysis.risk}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* ══ 4. AÇÕES RECOMENDADAS ══ */}
      <div className="rounded-lg overflow-hidden" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
            AÇÕES RECOMENDADAS
          </span>
        </div>

        <div className="flex flex-col">
          {actions.map((item, i) => {
            const priorityColor = item.priority === 'URGENTE' ? RED : item.priority === 'IMPORTANTE' ? AMBER : GREEN
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="flex gap-3 px-4 py-3"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  borderLeft: `3px solid ${priorityColor}`,
                  background: item.priority === 'URGENTE' ? 'rgba(255,255,255,0.02)' : 'transparent',
                }}>
                <div className="shrink-0 mt-0.5">
                  <span className="font-mono text-[7px] font-bold px-1.5 py-0.5 rounded-sm"
                    style={{ background: `${priorityColor}15`, color: priorityColor, border: `1px solid ${priorityColor}30` }}>
                    {item.priority}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] text-white/60 leading-snug mb-0.5">{item.action}</p>
                  <p className="font-mono text-[8px] text-white/25 leading-relaxed">{item.impact}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ══ 5. MARKET SIGNALS (3x2) ══ */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/20 block mb-3">Sinais do Mercado Digital</span>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { label: 'Vídeo curto', signal: `+${v(mkt?.videoShare?.delta, 8.6).toFixed(1)}% engajamento`, note: 'Reels, TikTok e Shorts dominam o feed — criativo estático perde alcance', col: GREEN, severity: GREEN },
            { label: 'IA no Marketing', signal: `${v(mkt?.aiAdoption?.value, 64)}% adoção`, note: 'Copywriting, imagens, segmentação e lances automatizados com IA', col: GREEN, severity: GREEN },
            { label: 'Orgânico caindo', signal: `${v(mkt?.organicShare?.delta, -4.2).toFixed(1)}% reach`, note: 'Algoritmos priorizam anúncios e posts de amigos vs páginas de marca', col: RED, severity: RED },
            { label: 'Dark Social', signal: 'Invisible sharing', note: 'WhatsApp, Telegram e DMs geram tráfego não rastreável — underreported no GA', col: AMBER, severity: AMBER },
            { label: 'Social Commerce', signal: 'Em aceleração', note: 'Compra sem sair do app: TikTok Shop, Instagram Shopping, WhatsApp Pay', col: GREEN, severity: GREEN },
            { label: 'Cookie Deprecation', signal: '3rd party out', note: 'Google finalizando cookies de terceiros — first-party data vira ativo crítico', col: AMBER, severity: RED },
          ].map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${s.col}18` }}>
              <div className="flex items-center gap-1.5 mb-1">
                {/* Severity dot */}
                <div className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: s.severity }} />
                <span className="font-mono text-[8px] font-bold text-white/40">{s.label}</span>
                <span className="font-mono text-[8px] font-bold ml-auto" style={{ color: s.col }}>{s.signal}</span>
              </div>
              <p className="text-[8px] text-white/25 leading-relaxed">{s.note}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ══ 6. OPORTUNIDADES ══ */}
      <div>
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/20 block mb-3">Oportunidades — por Urgência</span>
        <div className="flex flex-col gap-2">
          {[...opportunities].sort((a, b) => b.urgency - a.urgency).map((o, i) => {
            const col = o.urgency >= 75 ? RED : o.urgency >= 60 ? AMBER : GREEN
            const typeLabel = o.type === 'canal' ? 'CANAL' : o.type === 'tech' ? 'TECH' : o.type === 'macro' ? 'MACRO' : 'SETOR'
            const whyText = oppExplanations[o.type] ?? 'Oportunidade identificada pelo modelo de análise'
            return (
              <motion.div key={o.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-lg px-3 py-2.5"
                style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${col}18` }}>
                <div className="flex flex-col items-center shrink-0 w-10">
                  <span className="font-mono text-[20px] font-bold leading-none" style={{ color: col }}>{o.urgency}</span>
                  <span className="font-mono text-[6px] text-white/20 mt-0.5">URGÊNCIA</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-white/55 leading-snug">{o.label}</p>
                  <p className="font-mono text-[8px] text-white/20 mt-1 leading-relaxed">POR QUÊ: {whyText}</p>
                </div>
                <span className="font-mono text-[7px] px-1.5 py-0.5 rounded-sm shrink-0"
                  style={{ background: `${col}15`, color: col, border: `1px solid ${col}25` }}>{typeLabel}</span>
              </motion.div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
