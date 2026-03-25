'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const RED   = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE  = '#1a5276'

function v(n: number | undefined, fb: number) { return (n != null && Number.isFinite(n)) ? n : fb }
function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)) }
function trendColor(t: string) { return t === 'up' ? GREEN : t === 'down' ? RED : AMBER }
function pct(val: number, total: number) { return total > 0 ? Math.round((val / total) * 100) : 0 }

// ══════════════════════════════════════════════════════════════════════════
// ██  INTELIGÊNCIA: gera insights dinâmicos dos dados
// ══════════════════════════════════════════════════════════════════════════

interface Insight {
  id: string
  type: 'critical' | 'warning' | 'opportunity'
  title: string
  body: string
  metric: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateInsights(data: any): Insight[] {
  const insights: Insight[] = []
  const selic = v(data.macro?.selic?.value, 10.5)
  const ipca  = v(data.macro?.ipca?.value, 4.8)
  const pib   = v(data.macro?.pib?.value, 2.9)
  const usd   = v(data.macro?.usdBrl?.value, 5.72)
  const sectors = (data.sectors ?? []) as Array<{ id: string; label: string; heat: number; change: number; trend: string }>
  const comms   = data.commodities as Record<string, { value: number; delta: number; label: string }> ?? {}
  const cacD    = v(data.marketing?.cacTrend?.delta, 12)

  // Setores: quem domina, quem afunda
  const sorted = [...sectors].sort((a, b) => b.heat - a.heat)
  const top = sorted[0]
  const bottom = sorted[sorted.length - 1]
  const totalHeat = sorted.reduce((s, sec) => s + sec.heat, 0)

  if (top && top.heat > 75) {
    insights.push({
      id: 'top-sector',
      type: 'opportunity',
      title: `${top.label} concentra ${pct(top.heat, totalHeat)}% do calor do mercado`,
      body: `Com heat index de ${top.heat}/100 e variação de ${top.change > 0 ? '+' : ''}${top.change.toFixed(1)}%, ${top.label} é o setor mais ativo. ${top.heat > 85 ? 'Há risco de sobreaquecimento — empresas que entrarem agora pagam caro, mas a janela ainda está aberta.' : 'O momento é de expansão controlada — entrar com estratégia clara e unit economics definidos.'}`,
      metric: `${top.heat}/100`,
    })
  }

  if (bottom && bottom.heat < 25) {
    insights.push({
      id: 'bottom-sector',
      type: bottom.heat < 15 ? 'critical' : 'warning',
      title: `${bottom.label} em contração severa — heat ${bottom.heat}/100`,
      body: `${bottom.change < -20 ? 'A queda ultrapassa 20% e indica declínio estrutural, não cíclico. Empresas nesse setor precisam pivotar ou buscar adjacências.' : 'A contração pode ser cíclica. Empresas com caixa podem usar esse momento para aquisições a preços descontados.'}`,
      metric: `${bottom.change > 0 ? '+' : ''}${bottom.change.toFixed(1)}%`,
    })
  }

  // Concentração de mercado
  const top3Heat = sorted.slice(0, 3).reduce((s, sec) => s + sec.heat, 0)
  const concPct = pct(top3Heat, totalHeat)
  if (concPct > 55) {
    insights.push({
      id: 'concentration',
      type: 'warning',
      title: `3 setores concentram ${concPct}% da atividade econômica`,
      body: `${sorted.slice(0, 3).map(s => s.label).join(', ')} dominam o mercado. Alta concentração significa que uma queda em qualquer um deles impacta desproporcionalmente a economia. Diversificar exposição é prudente.`,
      metric: `${concPct}%`,
    })
  }

  // Correlação macro → setor
  if (selic > 12 && sectors.find(s => s.id === 'retail')?.heat && sectors.find(s => s.id === 'retail')!.heat < 40) {
    insights.push({
      id: 'selic-retail',
      type: 'critical',
      title: `SELIC ${selic.toFixed(1)}% está matando o varejo`,
      body: `Correlação direta: juro alto → crédito caro → consumo cai → varejo contrai. O setor de varejo está com heat ${sectors.find(s => s.id === 'retail')!.heat}/100 enquanto a média do mercado é ${Math.round(totalHeat / sectors.length)}. A lógica causal é clara: cada ponto de Selic acima de 10% retira ~3% da demanda discricionária.`,
      metric: `${selic.toFixed(1)}%`,
    })
  }

  if (usd > 5.5) {
    const gold = comms.gold
    const oil = comms.oil
    insights.push({
      id: 'fx-commodities',
      type: usd > 6 ? 'critical' : 'warning',
      title: `Câmbio R$${usd.toFixed(2)} amplifica commodities`,
      body: `Dólar alto encarece importação de ${oil ? `petróleo (US$${oil.value.toFixed(0)}, ${oil.delta > 0 ? '+' : ''}${oil.delta.toFixed(1)}%)` : 'petróleo'} e insumos, mas beneficia exportadores de ${gold ? `ouro (US$${gold.value.toFixed(0)}, ${gold.delta > 0 ? '+' : ''}${gold.delta.toFixed(1)}%)` : 'commodities minerais'}. O efeito líquido depende da balança: Brasil exporta mais commodity que importa — no agregado, câmbio alto favorece PIB mas pressiona inflação urbana.`,
      metric: `R$${usd.toFixed(2)}`,
    })
  }

  if (cacD > 10) {
    insights.push({
      id: 'cac-pressure',
      type: cacD > 20 ? 'critical' : 'warning',
      title: `CAC subindo ${cacD.toFixed(0)}% — eficiência caindo`,
      body: `O custo de aquisição de cliente sobe porque: (1) SELIC ${selic.toFixed(1)}% encarece financiamento de growth, (2) CPMs de plataformas sobem com mais anunciantes disputando o mesmo inventário, (3) privacidade iOS reduziu eficiência de targeting. A solução não é gastar mais — é diversificar canais e investir em LTV para compensar o CAC mais alto.`,
      metric: `+${cacD.toFixed(0)}%`,
    })
  }

  // PIB × Inovação
  if (pib > 2.5) {
    const techSec = sectors.find(s => s.id === 'tech')
    insights.push({
      id: 'pib-innovation',
      type: 'opportunity',
      title: `PIB ${pib.toFixed(1)}% + Tech heat ${techSec?.heat ?? '?'} = janela de inovação`,
      body: `Economia crescendo acima de 2.5% com setor tech aquecido cria a janela ideal para lançar produtos, levantar capital e contratar. Historicamente, as melhores empresas brasileiras nasceram em ciclos como este — quando há demanda crescente E capital disponível.`,
      metric: `+${pib.toFixed(1)}%`,
    })
  }

  return insights
}

// ══════════════════════════════════════════════════════════════════════════
// ██  TREEMAP INTELIGENTE
// ══════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SectorMap({ sectors }: { sectors: any[] }) {
  const [active, setActive] = useState<number | null>(null)
  const sorted = useMemo(() => [...sectors].sort((a, b) => v(b.heat, 0) - v(a.heat, 0)), [sectors])
  const totalHeat = sorted.reduce((s, sec) => s + v(sec.heat, 0), 0) || 1
  const avgChange = sorted.reduce((s, sec) => s + v(sec.change, 0), 0) / sorted.length

  return (
    <div>
      {/* Barra de proporção */}
      <div className="flex rounded-lg overflow-hidden h-10 mb-3" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        {sorted.map((sec, i) => {
          const w = (v(sec.heat, 0) / totalHeat) * 100
          const col = trendColor(sec.trend)
          const isActive = active === i
          return (
            <motion.div
              key={sec.id}
              className="relative cursor-pointer flex items-center justify-center overflow-hidden"
              style={{
                width: `${w}%`,
                background: isActive ? `${col}40` : `${col}22`,
                borderRight: '1px solid rgba(0,0,0,0.4)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              whileHover={{ scale: 1.02 }}
            >
              {w > 8 && (
                <span className="font-mono text-[7px] font-bold" style={{ color: col }}>
                  {sec.label.split(' ')[0]}
                </span>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Insight do hover */}
      <AnimatePresence mode="wait">
        {active !== null && sorted[active] && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="rounded-lg px-3 py-2 mb-2"
            style={{ background: `${trendColor(sorted[active].trend)}12`, border: `1px solid ${trendColor(sorted[active].trend)}25` }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold" style={{ color: trendColor(sorted[active].trend) }}>
                {sorted[active].label}
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] text-white/40">
                  Heat <span className="font-bold text-white/60">{sorted[active].heat}/100</span>
                </span>
                <span className="font-mono text-[9px]" style={{ color: trendColor(sorted[active].trend) }}>
                  {sorted[active].change > 0 ? '+' : ''}{sorted[active].change.toFixed(1)}%
                </span>
                <span className="font-mono text-[8px] text-white/30">
                  {pct(sorted[active].heat, totalHeat)}% do mercado
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resumo textual */}
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-white/30">
          {sorted.filter(s => s.trend === 'up').length} setores em alta · {sorted.filter(s => s.trend === 'down').length} em queda
        </span>
        <span className="font-mono text-[9px]" style={{ color: avgChange > 0 ? GREEN : avgChange < 0 ? RED : AMBER }}>
          Média: {avgChange > 0 ? '+' : ''}{avgChange.toFixed(1)}%
        </span>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ██  HEATMAP DE CORRELAÇÃO COM EXPLICAÇÃO
// ══════════════════════════════════════════════════════════════════════════

const CORR_LABELS = ['Selic', 'Câmbio', 'IPCA', 'PIB', 'CAC']
const BASE_CORR: Record<string, number> = {
  '0-1': 0.6, '0-2': 0.8, '0-3': -0.7, '0-4': 0.5,
  '1-2': 0.6, '1-3': -0.4, '1-4': 0.3,
  '2-3': -0.3, '2-4': 0.4,
  '3-4': -0.5,
}

const CORR_EXPLAIN: Record<string, string> = {
  '0-1': 'Selic sobe → investidor busca dólar → câmbio sobe junto em crise',
  '0-2': 'BC sobe Selic para conter inflação — correlação mais forte do mercado BR',
  '0-3': 'Juro alto freia investimento e consumo → PIB desacelera',
  '0-4': 'Crédito caro → empresas gastam mais pra adquirir clientes',
  '1-2': 'Dólar alto importa inflação via combustíveis e insumos',
  '1-3': 'Câmbio alto encarece importação → desacelera produção',
  '1-4': 'Plataformas de ads cobram em dólar → CAC sobe em reais',
  '2-3': 'Inflação alta corrói poder de compra → demanda cai → PIB freia',
  '2-4': 'Inflação comprime margem → empresa gasta mais pra converter',
  '3-4': 'PIB crescendo → mais clientes disponíveis → CAC cai naturalmente',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCorr(r: number, c: number, data: any): number {
  if (r === c) return 1
  const key = r < c ? `${r}-${c}` : `${c}-${r}`
  let base = BASE_CORR[key] ?? 0
  const selic = v(data?.macro?.selic?.value, 10.5)
  const usd = v(data?.macro?.usdBrl?.value, 5.72)
  const ipca = v(data?.macro?.ipca?.value, 4.8)
  if (key === '0-3' && selic > 13) base = Math.max(-1, base - 0.05 * ((selic - 13) / 2))
  if (key === '0-2' && selic > 13) base = Math.min(1, base + 0.03 * ((selic - 13) / 2))
  if (key === '1-2' && usd > 5.5) base = Math.min(1, base + 0.05 * ((usd - 5.5) / 1))
  if (key === '2-4' && ipca > 6) base = Math.min(1, base + 0.04 * ((ipca - 6) / 2))
  return clamp(base, -1, 1)
}

function corrBg(val: number): string {
  if (val > 0.5) return `rgba(192,57,43,${Math.min(0.7, val * 0.6)})`
  if (val > 0) return `rgba(192,57,43,${val * 0.35})`
  if (val > -0.5) return `rgba(26,82,118,${Math.abs(val) * 0.35})`
  return `rgba(26,82,118,${Math.min(0.7, Math.abs(val) * 0.6)})`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CorrelationMatrix({ data }: { data: any }) {
  const [selected, setSelected] = useState<string | null>(null)
  const selExplain = selected ? CORR_EXPLAIN[selected] : null

  return (
    <div>
      {/* Matrix grid */}
      <div className="overflow-x-auto">
        <div className="inline-grid gap-[2px]" style={{ gridTemplateColumns: `40px repeat(5, 1fr)`, minWidth: 320 }}>
          {/* Header row */}
          <div />
          {CORR_LABELS.map(l => (
            <div key={l} className="flex items-center justify-center py-1">
              <span className="font-mono text-[8px] font-bold text-white/40">{l}</span>
            </div>
          ))}

          {/* Data rows */}
          {CORR_LABELS.map((rowLabel, r) => (
            <>
              <div key={`rl-${r}`} className="flex items-center justify-end pr-2">
                <span className="font-mono text-[8px] font-bold text-white/40">{rowLabel}</span>
              </div>
              {CORR_LABELS.map((_, c) => {
                const corr = getCorr(r, c, data)
                const key = r < c ? `${r}-${c}` : `${c}-${r}`
                const isDiag = r === c
                const isSelected = selected === key
                return (
                  <motion.button
                    key={`${r}-${c}`}
                    onClick={() => !isDiag && setSelected(isSelected ? null : key)}
                    className="flex items-center justify-center rounded-sm py-2.5"
                    style={{
                      background: isDiag ? 'rgba(255,255,255,0.04)' : corrBg(corr),
                      border: isSelected ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                      cursor: isDiag ? 'default' : 'pointer',
                    }}
                    whileHover={!isDiag ? { scale: 1.08 } : {}}
                  >
                    <span className={`font-mono text-[10px] font-bold ${isDiag ? 'text-white/15' : 'text-white/70'}`}>
                      {isDiag ? '—' : `${corr > 0 ? '+' : ''}${corr.toFixed(2)}`}
                    </span>
                  </motion.button>
                )
              })}
            </>
          ))}
        </div>
      </div>

      {/* Explicação da correlação selecionada */}
      <AnimatePresence>
        {selExplain && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 rounded-lg px-3 py-2.5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-white/25 block mb-1">POR QUE ESSA CORRELAÇÃO</span>
            <p className="text-[10px] text-white/50 leading-relaxed">{selExplain}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legenda */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(26,82,118,0.6)' }} />
          <span className="font-mono text-[7px] text-white/25">Inversa (−1)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <span className="font-mono text-[7px] text-white/25">Neutra (0)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(192,57,43,0.6)' }} />
          <span className="font-mono text-[7px] text-white/25">Direta (+1)</span>
        </div>
      </div>

      <p className="text-[8px] text-white/20 text-center mt-2">
        Clique em qualquer célula para ver a lógica causal
      </p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ██  SCATTER COM QUADRANTES ESTRATÉGICOS
// ══════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StrategicScatter({ sectors, agents }: { sectors: any[]; agents: any[] }) {
  const [hover, setHover] = useState<string | null>(null)

  // Quadrants: definidos por change (x) e heat (y)
  // Q1 (top-right): Alta + Quente = ESCALAR
  // Q2 (top-left): Queda + Quente = PROTEGER
  // Q3 (bottom-left): Queda + Frio = EVITAR
  // Q4 (bottom-right): Alta + Frio = OPORTUNIDADE

  const W = 460, H = 280
  const PAD = { top: 15, right: 15, bottom: 28, left: 38 }
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom

  const allX = sectors.map(s => v(s.change, 0))
  const xMin = Math.min(-15, ...allX) - 3
  const xMax = Math.max(15, ...allX) + 3

  const sx = (val: number) => PAD.left + ((val - xMin) / (xMax - xMin)) * plotW
  const sy = (val: number) => PAD.top + plotH - (val / 100) * plotH
  const zeroX = sx(0)
  const midY = sy(50)

  const hovered = sectors.find(s => s.id === hover) ?? agents.find(a => a.id === hover)

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', fontFamily: 'monospace' }}>
        {/* Quadrant backgrounds */}
        <rect x={zeroX} y={PAD.top} width={PAD.left + plotW - zeroX + PAD.right} height={midY - PAD.top} fill="rgba(30,132,73,0.05)" />
        <rect x={PAD.left} y={PAD.top} width={zeroX - PAD.left} height={midY - PAD.top} fill="rgba(154,125,10,0.05)" />
        <rect x={PAD.left} y={midY} width={zeroX - PAD.left} height={PAD.top + plotH - midY} fill="rgba(192,57,43,0.05)" />
        <rect x={zeroX} y={midY} width={PAD.left + plotW - zeroX + PAD.right} height={PAD.top + plotH - midY} fill="rgba(26,82,118,0.05)" />

        {/* Quadrant labels */}
        <text x={zeroX + 6} y={PAD.top + 12} fontSize={7} fill="rgba(30,132,73,0.4)" fontWeight="bold">ESCALAR</text>
        <text x={PAD.left + 4} y={PAD.top + 12} fontSize={7} fill="rgba(154,125,10,0.4)" fontWeight="bold">PROTEGER</text>
        <text x={PAD.left + 4} y={PAD.top + plotH - 4} fontSize={7} fill="rgba(192,57,43,0.4)" fontWeight="bold">EVITAR</text>
        <text x={zeroX + 6} y={PAD.top + plotH - 4} fontSize={7} fill="rgba(26,82,118,0.4)" fontWeight="bold">OPORTUNIDADE</text>

        {/* Axes */}
        <line x1={zeroX} y1={PAD.top} x2={zeroX} y2={PAD.top + plotH} stroke="rgba(255,255,255,0.12)" strokeWidth={1} strokeDasharray="4 4" />
        <line x1={PAD.left} y1={midY} x2={PAD.left + plotW} y2={midY} stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="4 4" />
        <line x1={PAD.left} y1={PAD.top + plotH} x2={PAD.left + plotW} y2={PAD.top + plotH} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />

        {/* X ticks */}
        {[-30, -20, -10, 0, 10, 20, 30, 40].filter(t => t >= xMin && t <= xMax).map(t => (
          <text key={t} x={sx(t)} y={H - 8} textAnchor="middle" fontSize={7} fill="rgba(255,255,255,0.3)">
            {t > 0 ? '+' : ''}{t}%
          </text>
        ))}
        {/* Y ticks */}
        {[0, 25, 50, 75, 100].map(t => (
          <text key={t} x={PAD.left - 5} y={sy(t) + 3} textAnchor="end" fontSize={7} fill="rgba(255,255,255,0.3)">
            {t}
          </text>
        ))}

        {/* Axis labels */}
        <text x={PAD.left + plotW / 2} y={H - 1} textAnchor="middle" fontSize={7} fill="rgba(255,255,255,0.25)">
          Variação (%)
        </text>
        <text x={8} y={PAD.top + plotH / 2} textAnchor="middle" fontSize={7} fill="rgba(255,255,255,0.25)"
          transform={`rotate(-90, 8, ${PAD.top + plotH / 2})`}>
          Heat Index
        </text>

        {/* Sector bubbles */}
        {sectors.map((s, i) => {
          const cx = sx(v(s.change, 0))
          const cy = sy(v(s.heat, 50))
          const r = Math.max(5, Math.min(22, v(s.heat, 50) * 0.22))
          const col = trendColor(s.trend)
          const isHovered = hover === s.id
          return (
            <motion.g key={s.id} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, duration: 0.5, type: 'spring' }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
              onMouseEnter={() => setHover(s.id)} onMouseLeave={() => setHover(null)}>
              <circle cx={cx} cy={cy} r={isHovered ? r + 3 : r}
                fill={col} fillOpacity={isHovered ? 0.8 : 0.5} stroke={col} strokeWidth={isHovered ? 2 : 1}
                style={{ transition: 'all 0.2s', cursor: 'pointer' }} />
              {(r > 8 || isHovered) && (
                <text x={cx} y={cy - r - 5} textAnchor="middle" fontSize={isHovered ? 8 : 7}
                  fontWeight={isHovered ? 'bold' : 'normal'} fill={isHovered ? col : 'rgba(255,255,255,0.5)'}>
                  {s.label.split(' ')[0]}
                </text>
              )}
            </motion.g>
          )
        })}

        {/* Agent diamonds */}
        {agents.map((a, i) => {
          const cx = sx(v(a.delta, 0))
          const cy = sy(55 + i * 3 - agents.length)
          const sz = 4
          const pts = `${cx},${cy - sz} ${cx + sz},${cy} ${cx},${cy + sz} ${cx - sz},${cy}`
          const isHovered = hover === a.id
          return (
            <motion.g key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              onMouseEnter={() => setHover(a.id)} onMouseLeave={() => setHover(null)}>
              <polygon points={pts} fill={isHovered ? BLUE : `${BLUE}88`} stroke={BLUE} strokeWidth={1}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }} />
              {isHovered && (
                <text x={cx + sz + 4} y={cy + 3} fontSize={7} fontWeight="bold" fill={BLUE}>
                  {a.label}
                </text>
              )}
            </motion.g>
          )
        })}
      </svg>

      {/* Hover detail */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 rounded-lg px-3 py-2"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] font-bold text-white/60">{hovered.label}</span>
              {'heat' in hovered && (
                <span className="font-mono text-[9px] text-white/35">Heat {hovered.heat}/100 · {hovered.change > 0 ? '+' : ''}{hovered.change.toFixed(1)}%</span>
              )}
              {'impact' in hovered && (
                <span className="text-[9px] text-white/35">{hovered.impact}</span>
              )}
              {'heat' in hovered && (
                <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-sm" style={{
                  background: hovered.change > 0 && hovered.heat > 50 ? `${GREEN}18` : hovered.change < 0 && hovered.heat < 50 ? `${RED}18` : hovered.change > 0 ? `${BLUE}18` : `${AMBER}18`,
                  color: hovered.change > 0 && hovered.heat > 50 ? GREEN : hovered.change < 0 && hovered.heat < 50 ? RED : hovered.change > 0 ? BLUE : AMBER,
                  border: `1px solid ${hovered.change > 0 && hovered.heat > 50 ? GREEN : hovered.change < 0 && hovered.heat < 50 ? RED : hovered.change > 0 ? BLUE : AMBER}30`,
                }}>
                  {hovered.change > 0 && hovered.heat > 50 ? 'ESCALAR' : hovered.change < 0 && hovered.heat < 50 ? 'EVITAR' : hovered.change > 0 ? 'OPORTUNIDADE' : 'PROTEGER'}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: GREEN, opacity: 0.6 }} />
          <span className="font-mono text-[7px] text-white/25">Setor em alta</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: RED, opacity: 0.6 }} />
          <span className="font-mono text-[7px] text-white/25">Setor em queda</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rotate-45" style={{ background: BLUE, opacity: 0.6 }} />
          <span className="font-mono text-[7px] text-white/25">Agente global</span>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ██  COMPONENTE PRINCIPAL — ANÁLISE VISUAL INTEGRADA
// ══════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AnaliseVisual({ data }: { data: any }) {
  const insights = useMemo(() => generateInsights(data), [data])
  const typeColor = (t: string) => t === 'critical' ? RED : t === 'warning' ? AMBER : GREEN
  const typeLabel = (t: string) => t === 'critical' ? 'CRÍTICO' : t === 'warning' ? 'ALERTA' : 'OPORTUNIDADE'

  return (
    <div className="flex flex-col gap-5">

      {/* ── INSIGHTS GERADOS POR IA ── */}
      {insights.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <motion.div className="h-1.5 w-1.5 rounded-full bg-white/40"
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">
              Diagnóstico de Mercado
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {insights.map((ins, i) => {
              const col = typeColor(ins.type)
              return (
                <motion.div
                  key={ins.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-lg overflow-hidden"
                  style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${col}20` }}
                >
                  <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${col}70, transparent)` }} />
                  <div className="px-4 py-3">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[7px] font-bold tracking-[0.15em] px-1.5 py-0.5 rounded-sm"
                          style={{ background: `${col}18`, color: col, border: `1px solid ${col}30` }}>
                          {typeLabel(ins.type)}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-white/60">{ins.title}</span>
                      </div>
                      <span className="font-mono text-[14px] font-bold shrink-0" style={{ color: col }}>{ins.metric}</span>
                    </div>
                    <p className="text-[9px] text-white/38 leading-relaxed">{ins.body}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── MAPA DE SETORES ── */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-white/20">DISTRIBUIÇÃO DE CALOR — SETORES</span>
          <span className="text-[8px] text-white/20">hover para detalhes</span>
        </div>
        <SectorMap sectors={data.sectors} />
      </div>

      {/* ── SCATTER ESTRATÉGICO + CORRELAÇÃO ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg p-4" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-white/20 block mb-1">POSICIONAMENTO ESTRATÉGICO</span>
          <span className="text-[8px] text-white/15 block mb-3">Cada bolha = setor · tamanho = heat · quadrante = ação recomendada</span>
          <StrategicScatter sectors={data.sectors} agents={data.globalAgents} />
        </div>

        <div className="rounded-lg p-4" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-white/20 block mb-1">CORRELAÇÕES MACRO</span>
          <span className="text-[8px] text-white/15 block mb-3">Como os indicadores se influenciam mutuamente — clique para entender</span>
          <CorrelationMatrix data={data} />
        </div>
      </div>

    </div>
  )
}
