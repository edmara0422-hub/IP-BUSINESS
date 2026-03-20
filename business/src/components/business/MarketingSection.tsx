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

// ── Card de Plataforma ─────────────────────────────────────────────────────
interface Platform {
  id: string; label: string; cpm?: number; cpmDelta?: number
  cpc?: number; cpcDelta?: number; reach: string; trend: string; note: string
}

function PlatformCard({ platform, index }: { platform: Platform; index: number }) {
  const [open, setOpen] = useState(false)
  const col = trendColor(platform.trend)
  const trendLabel = platform.trend === 'up' ? 'CPM ▲' : platform.trend === 'down' ? 'CPM ▼' : 'ESTÁVEL'
  const analysis = PLATFORM_ANALYSIS[platform.id]

  const metric = platform.cpm != null
    ? { label: 'CPM', val: `US$${platform.cpm.toFixed(2)}`, delta: platform.cpmDelta ?? 0 }
    : { label: 'CPC', val: `US$${(platform.cpc ?? 0).toFixed(2)}`, delta: platform.cpcDelta ?? 0 }

  const deltaCol = deltaColor(metric.delta)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
      className="rounded-lg overflow-hidden"
      style={{ border: `1px solid ${open ? col + '28' : 'rgba(255,255,255,0.06)'}`, background: 'rgba(0,0,0,0.25)' }}>

      <button className="w-full text-left" onClick={() => setOpen(o => !o)}>
        {/* Top bar */}
        <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${col}70, transparent)` }} />

        <div className="flex items-center gap-3 px-4 py-3">
          {/* Ícone */}
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-mono text-[11px] font-bold"
            style={{ background: `${col}15`, border: `1px solid ${col}30`, color: col }}>
            {PLATFORM_ICON[platform.id] ?? platform.label[0]}
          </div>

          {/* Nome + nota */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[13px] font-semibold text-white/75">{platform.label}</span>
              <span className="font-mono text-[7px] px-1.5 py-0.5 rounded-sm shrink-0"
                style={{ background: `${col}15`, color: col, border: `1px solid ${col}25` }}>{trendLabel}</span>
            </div>
            <p className="text-[9px] text-white/30 truncate">{platform.note}</p>
          </div>

          {/* Métricas */}
          <div className="flex flex-col items-end shrink-0 gap-0.5">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-[8px] text-white/25">{metric.label}</span>
              <span className="font-mono text-[16px] font-bold text-white/80">{metric.val}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-mono text-[10px] font-bold" style={{ color: deltaCol }}>
                {metric.delta > 0 ? '▲' : metric.delta < 0 ? '▼' : '—'}{Math.abs(metric.delta).toFixed(1)}%
              </span>
              <span className="font-mono text-[8px] text-white/20">reach {platform.reach}</span>
            </div>
          </div>

          <span className="text-white/20 text-[10px] ml-1">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      <AnimatePresence>
        {open && analysis && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
            className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-white/[0.05] flex flex-col gap-3 pt-3">

              {/* Por que este CPM/CPC */}
              <div className="rounded-sm p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-white/20 block mb-1.5">POR QUE ESSE CUSTO</span>
                <p className="text-[10px] text-white/45 leading-relaxed">{analysis.why}</p>
              </div>

              {/* Estratégias */}
              <div>
                <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-white/20 block mb-2">ESTRATÉGIAS RECOMENDADAS</span>
                <div className="flex flex-col gap-1.5">
                  {analysis.strategy.map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
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
}

// ── Card de Oportunidade ───────────────────────────────────────────────────
function OppCard({ opp, index }: { opp: { id: string; label: string; urgency: number; type: string }; index: number }) {
  const col = opp.urgency >= 75 ? RED : opp.urgency >= 60 ? AMBER : GREEN
  const typeLabel = opp.type === 'canal' ? 'CANAL' : opp.type === 'tech' ? 'TECH' : opp.type === 'macro' ? 'MACRO' : 'SETOR'
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5"
      style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${col}18` }}>
      <div className="flex flex-col items-center shrink-0 w-10">
        <span className="font-mono text-[20px] font-bold leading-none" style={{ color: col }}>{opp.urgency}</span>
        <span className="font-mono text-[6px] text-white/20 mt-0.5">URGÊNCIA</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-white/55 leading-snug">{opp.label}</p>
      </div>
      <span className="font-mono text-[7px] px-1.5 py-0.5 rounded-sm shrink-0"
        style={{ background: `${col}15`, color: col, border: `1px solid ${col}25` }}>{typeLabel}</span>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ██  MAIN
// ══════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MarketingSection({ data }: { data: any }) {
  const [filter, setFilter] = useState<'all' | 'up' | 'down' | 'neutral'>('all')

  const platforms = data.platforms as Platform[]
  const mkt = data.marketing as Record<string, { value: number; delta: number; label: string }>
  const opportunities = data.opportunities as Array<{ id: string; label: string; urgency: number; type: string }>

  const selic  = v(data.macro.selic?.value, 10.5)
  const usd    = v(data.macro.usdBrl?.value, 5.72)
  const cacVal = v(mkt?.cacTrend?.value, 48.6)
  const cacD   = v(mkt?.cacTrend?.delta, 12.1)

  // Score geral de marketing (0-100, onde baixo = caro/difícil)
  const mktScore = useMemo(() => {
    const cpmScore   = Math.max(0, 100 - (v(mkt?.cpmGlobal?.value, 11.3) - 5) * 5)
    const cacScore   = Math.max(0, 100 - cacD * 2)
    const orgScore   = v(mkt?.organicShare?.value, 31)
    return Math.round((cpmScore * 0.35 + cacScore * 0.35 + orgScore * 0.3))
  }, [mkt, cacD])

  const scoreStatus = mktScore >= 60 ? 'good' : mktScore >= 40 ? 'warning' : 'critical'
  const scoreColor  = scoreStatus === 'good' ? GREEN : scoreStatus === 'warning' ? AMBER : RED
  const scoreLabel  = scoreStatus === 'good' ? 'FAVORÁVEL' : scoreStatus === 'warning' ? 'MODERADO' : 'PRESSÃO ALTA'

  const filtered = filter === 'all' ? platforms : platforms.filter(p => p.trend === filter)

  return (
    <div className="flex flex-col gap-5 px-4 pb-8">

      {/* ── Header ── */}
      <div className="flex items-center gap-2">
        <motion.div className="h-1.5 w-1.5 rounded-full"
          style={{ background: scoreColor }}
          animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-white/20">
          Plataformas & Marketing
        </span>
      </div>

      {/* ── Score geral + métricas chave ── */}
      <div className="rounded-lg overflow-hidden" style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${scoreColor}22` }}>
        <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${scoreColor}80, transparent)` }} />
        <div className="p-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-white/25 block mb-1">SCORE DE MERCADO DIGITAL</span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[48px] font-bold leading-none" style={{ color: scoreColor }}>{mktScore}</span>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded-sm mb-1"
                    style={{ background: `${scoreColor}15`, color: scoreColor, border: `1px solid ${scoreColor}30` }}>{scoreLabel}</span>
                  <span className="font-mono text-[8px] text-white/20">quanto + baixo = + caro anunciar</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 text-right">
              <div>
                <span className="font-mono text-[7px] text-white/20 block">CAC MÉDIO BR</span>
                <span className="font-mono text-[18px] font-bold" style={{ color: deltaColor(cacD) }}>R${cacVal.toFixed(0)}</span>
                <span className="font-mono text-[10px] font-bold ml-1" style={{ color: deltaColor(cacD) }}>▲{cacD.toFixed(1)}%</span>
              </div>
              <div>
                <span className="font-mono text-[7px] text-white/20 block">SELIC IMPACTO</span>
                <span className="font-mono text-[11px] font-bold" style={{ color: selic > 13 ? RED : AMBER }}>
                  {selic.toFixed(1)}% a.a. comprime margem
                </span>
              </div>
            </div>
          </div>

          {/* 6 métricas em grid */}
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(mkt ?? {}).map(([key, m]) => {
              const isGood = key === 'organicShare' || key === 'videoShare' || key === 'aiAdoption'
              const col = isGood ? goodDeltaColor(m.delta) : deltaColor(m.delta)
              const isPercent = key !== 'cacTrend' && key !== 'cpmGlobal' && key !== 'cpcGlobal'
              const prefix = key === 'cacTrend' ? 'R$' : key === 'cpmGlobal' || key === 'cpcGlobal' ? 'US$' : ''
              const suffix = isPercent ? '%' : ''
              return (
                <div key={key} className="rounded-lg p-2.5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="font-mono text-[7px] text-white/20 block mb-1 leading-tight">{m.label}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-[15px] font-bold text-white/75">{prefix}{m.value}{suffix}</span>
                  </div>
                  <span className="font-mono text-[9px] font-bold" style={{ color: col }}>
                    {m.delta > 0 ? '▲' : '▼'}{Math.abs(m.delta).toFixed(1)}{suffix}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Análise de CAC ── */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-white/20 block mb-3">POR QUE O CAC ESTÁ SUBINDO</span>
        <div className="flex flex-col gap-2">
          {[
            { causa: 'Leilão mais competitivo', efeito: 'Mais anunciantes disputando o mesmo inventory → preço sobe automaticamente', col: RED },
            { causa: `USD R$${usd.toFixed(2)}`, efeito: 'Plataformas cobram em dólar — câmbio alto encarece CPM/CPC em reais diretamente', col: RED },
            { causa: 'iOS privacy (ATT)', efeito: 'Menos dados de tracking → otimização pior → custo por resultado sobe', col: AMBER },
            { causa: 'IA nas plataformas', efeito: 'Automação privilegia formatos de maior CPM — exige adaptação de criativo', col: AMBER },
            { causa: 'Menos tráfego orgânico', efeito: `Share orgânico caiu ${Math.abs(v(mkt?.organicShare?.delta, -4.2)).toFixed(1)}% — mais dependência de paid aumenta pressão no CAC`, col: RED },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5 w-2 h-2 rounded-full" style={{ background: r.col }} />
              <div>
                <span className="font-mono text-[9px] font-bold text-white/50">{r.causa}: </span>
                <span className="text-[9px] text-white/30">{r.efeito}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-sm p-3" style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}20` }}>
          <span className="font-mono text-[7px] font-bold tracking-[0.2em] block mb-1.5" style={{ color: GREEN }}>COMO REDUZIR O CAC</span>
          {['Diversificar canais — não depender só de Meta/Google', 'Investir em conteúdo orgânico (SEO, social orgânico, email)', 'Melhorar LTV — mesmo CAC alto vira viável com cliente que compra mais', 'Testar TikTok — CPM menor, janela de entrada curta'].map((a, i) => (
            <div key={i} className="flex items-start gap-1.5 mt-1">
              <span className="font-mono text-[9px] shrink-0" style={{ color: GREEN }}>→</span>
              <span className="text-[9px] text-white/35">{a}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Plataformas ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/20">Plataformas</span>
          <div className="flex gap-1">
            {([['all', 'Todas'], ['up', 'CPM▲'], ['down', 'CPM▼'], ['neutral', 'Estáveis']] as const).map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)}
                className="font-mono text-[7px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-sm transition-all"
                style={{
                  background: filter === val ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.2)',
                  color: filter === val ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)',
                  border: `1px solid ${filter === val ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'}`,
                }}>{label}</button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => <PlatformCard key={p.id} platform={p} index={i} />)}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Sinais de mercado ── */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/20 block mb-3">Sinais do Mercado Digital</span>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Vídeo curto', signal: `+${v(mkt?.videoShare?.delta, 8.6).toFixed(1)}% engajamento`, note: 'Reels, TikTok e Shorts dominam o feed — criativo estático perde alcance', col: GREEN },
            { label: 'IA no Marketing', signal: `${v(mkt?.aiAdoption?.value, 64)}% adoção`, note: 'Copywriting, imagens, segmentação e lances automatizados com IA', col: GREEN },
            { label: 'Orgânico caindo', signal: `${v(mkt?.organicShare?.delta, -4.2).toFixed(1)}% reach`, note: 'Algoritmos priorizam anúncios e posts de amigos vs páginas de marca', col: RED },
            { label: 'Dark Social', signal: 'Invisible sharing', note: 'WhatsApp, Telegram e DMs geram tráfego não rastreável — underreported no GA', col: AMBER },
            { label: 'Social Commerce', signal: 'Em aceleração', note: 'Compra sem sair do app: TikTok Shop, Instagram Shopping, WhatsApp Pay', col: GREEN },
            { label: 'Cookie Deprecation', signal: '3rd party out', note: 'Google finalizando cookies de terceiros — first-party data vira ativo crítico', col: AMBER },
          ].map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${s.col}18` }}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[8px] font-bold text-white/40">{s.label}</span>
                <span className="font-mono text-[8px] font-bold" style={{ color: s.col }}>{s.signal}</span>
              </div>
              <p className="text-[8px] text-white/25 leading-relaxed">{s.note}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Oportunidades ── */}
      <div>
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/20 block mb-3">Oportunidades — por Urgência</span>
        <div className="flex flex-col gap-2">
          {[...opportunities].sort((a, b) => b.urgency - a.urgency).map((o, i) => (
            <OppCard key={o.id} opp={o} index={i} />
          ))}
        </div>
      </div>

    </div>
  )
}
