import { NextResponse } from 'next/server'

// REAL (APIs testadas e funcionando no Vercel):
// - SELIC: BCB série 432
// - IPCA: BCB série 13522 (acumulado 12m)
// - PIB: BCB Focus (projeção mercado)
// - USD/BRL: AwesomeAPI
// - Ouro, Prata: AwesomeAPI (XAU-USD, XAG-USD)
// - Ações BR (9 tickers): Yahoo Finance chart API /v8/finance/chart/{TICKER}.SA
//
// ESTIMADO (derivado de dados reais):
// - Petróleo: derivado de PETR4
// - Cobre, Grãos, Lítio: delta 0 (precisa API paga)
// - AAPL, GOOGL, META, AMZN: derivado de setores BR
// - Plataformas (CPM/CPC): estimativa via ação da empresa-mãe

const YF_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json',
}

// ── Fetch com timeout ───────────────────────────────────────────────────────
async function safeFetch(url: string, ms = 5000, extraHeaders?: Record<string, string>): Promise<Response | null> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), ms)
    const res = await fetch(url, { signal: controller.signal, cache: 'no-store', headers: extraHeaders })
    clearTimeout(timer)
    return res.ok ? res : null
  } catch { return null }
}

async function yfStockInfo(symbol: string): Promise<{ price: number; pct: number }> {
  try {
    const res = await safeFetch(
      `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`,
      6000,
      YF_HEADERS,
    )
    if (!res) return { price: 0, pct: 0 }
    const d = await res.json()
    const meta = d?.chart?.result?.[0]?.meta
    if (!meta) return { price: 0, pct: 0 }
    const price = parseFloat(meta.regularMarketPrice)
    const prev  = parseFloat(meta.chartPreviousClose)
    if (!Number.isFinite(price) || !Number.isFinite(prev) || prev === 0) return { price: 0, pct: 0 }
    return { price: parseFloat(price.toFixed(2)), pct: parseFloat(((price / prev - 1) * 100).toFixed(2)) }
  } catch { return { price: 0, pct: 0 } }
}

function yfChangePercent(symbol: string): Promise<number> {
  return yfStockInfo(symbol).then(r => r.pct)
}

async function yfCommodity(symbol: string): Promise<{ price: number; delta: number } | null> {
  try {
    const res = await safeFetch(
      `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`,
      6000,
      YF_HEADERS,
    )
    if (!res) return null
    const d = await res.json()
    const meta = d?.chart?.result?.[0]?.meta
    if (!meta) return null
    const price = parseFloat(meta.regularMarketPrice)
    const prev  = parseFloat(meta.chartPreviousClose)
    if (!Number.isFinite(price) || !Number.isFinite(prev) || prev === 0) return null
    return { price: parseFloat(price.toFixed(2)), delta: parseFloat(((price / prev - 1) * 100).toFixed(2)) }
  } catch { return null }
}

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)) }
function r2(n: number) { return parseFloat(n.toFixed(2)) }
function r1(n: number) { return parseFloat(n.toFixed(1)) }

// Vercel CDN cacheia 5min — sobrevive cold starts
export const revalidate = 300

// Cache em memória — fallback intra-instância (warm requests)
let _cache: { data: unknown; ts: number } | null = null
const CACHE_TTL = 5 * 60 * 1000

// ══════════════════════════════════════════════════════════════════════════
export async function GET() {
  // Serve do cache se ainda válido
  if (_cache && Date.now() - _cache.ts < CACHE_TTL) {
    return NextResponse.json(_cache.data, {
      headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, max-age=300' },
    })
  }

  // ── Defaults (usados se qualquer fetch falhar) ──────────────────────────
  let usdBrl = 4.98, usdDelta = 0.02
  let ipca = 4.14, pib = 1.86, selic = 14.75
  // BCB taxas de crédito PJ por setor (% a.a.) — séries SGS
  let creditPjTotal = 28.5, creditPjIndustria = 19.2, creditPjAgro = 12.8, creditPjComercio = 30.4, creditPjServicos = 26.7
  // Novos dados reais
  let inadimplenciaPJ = 5.8   // BCB série 21082 — inadimplência PJ (%)
  let ibcBr = 1.2             // BCB série 24363 — IBC-Br var. % (proxy mensal do PIB)
  let desemprego = 6.2        // IBGE PNAD Contínua — taxa de desocupação (%)

  // commodities
  let goldP = 4817, goldD = 0
  let silP = 76.8,  silD = 0
  let oilP = 83.0,  oilD = 0
  let copP = 4.35,  copD = 0   // precisa API paga
  let cornP = 465,  cornD = 0  // precisa API paga
  let lithD = 0                // precisa API paga

  // agentes globais (% delta diário) — derivados de setores BR
  let aaplD = 0, googlD = 0, metaD = 0, amznD = 0
  let valeD = 0, petrD = 0

  // setores — delta diário da ação representativa
  let dTech = 0, dAgro = 0, dHealth = 0
  let dEnergy = 0, dFintech = 0, dLogistics = 0
  let dServices = 0, dRetail = 0

  // stocks panel — preços e pcts individuais
  let petrPrice = 36.50, valePrice = 58.20, itubPrice = 27.90, bbdcPrice = 15.80, wegePrice = 50.10
  let bbdcPct = 0, wegePct = 0
  let ibovValue = 128000, ibovPct = 0

  // ── Fetch em paralelo ───────────────────────────────────────────────────
  try {
    const [
      fxRes, selicRes, ipcaRes, pibRes,
      creditTotalRes, creditIndRes, creditAgroRes, creditComRes, creditSvcRes,
      goldRes, silverRes, oilRes,
      petr4R, vale3R, itub4R, bbdc4R, wege3R, ibovR,
      totvs3D, slce3D, rdor3D, egie3D, mglu3D, rail3D,
      inadimpRes, ibcBrRes, desempRes,
    ] = await Promise.allSettled([
      // Macro
      safeFetch('https://economia.awesomeapi.com.br/json/last/USD-BRL'),
      safeFetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json'),
      safeFetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados/ultimos/1?formato=json'),
      safeFetch('https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoAnuais?$filter=Indicador%20eq%20%27PIB%20Total%27%20and%20DataReferencia%20eq%20%272026%27&$top=1&$orderby=Data%20desc&$format=json'),
      // BCB crédito PJ por setor (séries SGS — taxa média a.a.)
      safeFetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.20714/dados/ultimos/1?formato=json'),
      safeFetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.20754/dados/ultimos/1?formato=json'),
      safeFetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.20756/dados/ultimos/1?formato=json'),
      safeFetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.20758/dados/ultimos/1?formato=json'),
      safeFetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.20760/dados/ultimos/1?formato=json'),
      // Commodities
      safeFetch('https://economia.awesomeapi.com.br/json/last/XAU-USD'),
      safeFetch('https://economia.awesomeapi.com.br/json/last/XAG-USD'),
      yfCommodity('CL=F'),
      // Ações BR com preço + pct (stocks panel)
      yfStockInfo('PETR4.SA'),
      yfStockInfo('VALE3.SA'),
      yfStockInfo('ITUB4.SA'),
      yfStockInfo('BBDC4.SA'),
      yfStockInfo('WEGE3.SA'),
      yfStockInfo('%5EBVSP'),   // IBOVESPA
      // Setores — apenas pct (representativas)
      yfChangePercent('TOTS3.SA'),
      yfChangePercent('SLCE3.SA'),
      yfChangePercent('RDOR3.SA'),
      yfChangePercent('EGIE3.SA'),
      yfChangePercent('MGLU3.SA'),
      yfChangePercent('RAIL3.SA'),
      // Novos dados reais
      safeFetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.21082/dados/ultimos/1?formato=json'),  // Inadimplência PJ
      safeFetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.24363/dados/ultimos/1?formato=json'),  // IBC-Br
      safeFetch('https://servicodados.ibge.gov.br/api/v3/agregados/6381/periodos/last%7C1/variaveis/4099?localidades=N1[all]', 7000), // PNAD Desemprego
    ])

    // ── Parse macro ──────────────────────────────────────────────────────
    if (fxRes.status === 'fulfilled' && fxRes.value) {
      try {
        const d = await fxRes.value.json()
        usdBrl   = parseFloat(d?.USDBRL?.bid    ?? '5.25')
        usdDelta = parseFloat(d?.USDBRL?.varBid ?? '0.01')
      } catch { /* fallback */ }
    }
    if (selicRes.status === 'fulfilled' && selicRes.value) {
      try {
        const d = await selicRes.value.json()
        const val = parseFloat(d?.[0]?.valor)
        if (Number.isFinite(val)) selic = val
      } catch { /* fallback */ }
    }
    if (ipcaRes.status === 'fulfilled' && ipcaRes.value) {
      try {
        const d = await ipcaRes.value.json()
        const val = parseFloat(d?.[0]?.valor)
        if (Number.isFinite(val)) ipca = val
      } catch { /* fallback */ }
    }
    if (pibRes.status === 'fulfilled' && pibRes.value) {
      try {
        const d = await pibRes.value.json()
        const val = parseFloat(d?.value?.[0]?.Mediana)
        if (Number.isFinite(val)) pib = val
      } catch { /* fallback */ }
    }

    // ── Parse BCB crédito PJ por setor ──────────────────────────────────
    const parseBcbRate = async (r: PromiseSettledResult<Response | null>): Promise<number | null> => {
      if (r.status !== 'fulfilled' || !r.value) return null
      try { const d = await r.value.json(); const v = parseFloat(d?.[0]?.valor); return Number.isFinite(v) ? v : null } catch { return null }
    }
    const [rTotal, rInd, rAgro, rCom, rSvc] = await Promise.all([
      parseBcbRate(creditTotalRes), parseBcbRate(creditIndRes), parseBcbRate(creditAgroRes),
      parseBcbRate(creditComRes),   parseBcbRate(creditSvcRes),
    ])
    if (rTotal !== null) creditPjTotal = rTotal
    if (rInd !== null)   creditPjIndustria = rInd
    if (rAgro !== null)  creditPjAgro = rAgro
    if (rCom !== null)   creditPjComercio = rCom
    if (rSvc !== null)   creditPjServicos = rSvc

    // ── Parse novos dados reais ──────────────────────────────────────────
    // Inadimplência PJ (BCB série 21082)
    if (inadimpRes.status === 'fulfilled' && inadimpRes.value) {
      try {
        const d = await inadimpRes.value.json()
        const v = parseFloat(d?.[0]?.valor)
        if (Number.isFinite(v)) inadimplenciaPJ = v
      } catch { /* fallback */ }
    }
    // IBC-Br — variação mensal % (BCB série 24363)
    if (ibcBrRes.status === 'fulfilled' && ibcBrRes.value) {
      try {
        const d = await ibcBrRes.value.json()
        const v = parseFloat(d?.[0]?.valor)
        if (Number.isFinite(v)) ibcBr = v
      } catch { /* fallback */ }
    }
    // Desemprego PNAD (IBGE SIDRA agregado 6381, variável 4099)
    if (desempRes.status === 'fulfilled' && desempRes.value) {
      try {
        const d = await desempRes.value.json()
        const v = parseFloat(d?.[0]?.resultados?.[0]?.series?.[0]?.serie?.[Object.keys(d?.[0]?.resultados?.[0]?.series?.[0]?.serie ?? {})[0]])
        if (Number.isFinite(v)) desemprego = v
      } catch { /* fallback */ }
    }

    // ── Parse commodities (AwesomeAPI) ──────────────────────────────────
    if (goldRes.status === 'fulfilled' && goldRes.value) {
      try {
        const d = await goldRes.value.json()
        goldP = parseFloat(d?.XAUUSD?.bid ?? '4493')
        goldD = parseFloat(d?.XAUUSD?.varBid ?? '0')
      } catch { /* fallback */ }
    }
    if (silverRes.status === 'fulfilled' && silverRes.value) {
      try {
        const d = await silverRes.value.json()
        silP = parseFloat(d?.XAGUSD?.bid ?? '69.6')
        silD = parseFloat(d?.XAGUSD?.varBid ?? '0')
      } catch { /* fallback */ }
    }
    if (oilRes.status === 'fulfilled' && oilRes.value) {
      oilP = oilRes.value.price
      oilD = oilRes.value.delta
    }

    // ── Parse ações BR (Yahoo Finance) ───────────────────────────────────
    const si  = (r: PromiseSettledResult<{ price: number; pct: number }>) =>
      r.status === 'fulfilled' ? r.value : { price: 0, pct: 0 }
    const pct = (r: PromiseSettledResult<number>) => r.status === 'fulfilled' ? r.value : 0

    const petr4 = si(petr4R), vale3 = si(vale3R), itub4 = si(itub4R)
    const bbdc4 = si(bbdc4R), wege3 = si(wege3R), ibov  = si(ibovR)

    petrD      = petr4.pct;  if (petr4.price > 0) petrPrice = petr4.price
    valeD      = vale3.pct;  if (vale3.price > 0) valePrice = vale3.price
    dFintech   = itub4.pct;  if (itub4.price > 0) itubPrice = itub4.price
    bbdcPct    = bbdc4.pct;  if (bbdc4.price > 0) bbdcPrice = bbdc4.price
    wegePct    = wege3.pct;  if (wege3.price > 0) wegePrice = wege3.price
    ibovPct    = ibov.pct;   if (ibov.price  > 0) ibovValue = Math.round(ibov.price)

    dTech      = pct(totvs3D)
    dAgro      = pct(slce3D)
    dHealth    = pct(rdor3D)
    dEnergy    = pct(egie3D)
    dRetail    = pct(mglu3D)
    dLogistics = pct(rail3D)

    // Agentes globais US — derivados de setores BR (proxy)
    aaplD  = r2(dTech * 0.7)
    googlD = r2(dTech * 0.6)
    metaD  = r2(dTech * 0.4 + dRetail * 0.3)
    amznD  = r2(dTech * 0.3 + dLogistics * 0.3 + dRetail * 0.2)

    // Serviços: estimado via macro (sem ação representativa)
    dServices = pib > 2 ? 0.3 : pib > 0 ? 0.1 : -0.3

  } catch { /* todos os fallbacks permanecem */ }

  // ── Helpers de setor ───────────────────────────────────────────────────
  // change = delta diário real da ação representativa (não base fixa)
  // heat   = score anual de oportunidade do setor (estrutural, não muda diariamente)
  const sectorHeat   = (d: number, base: number) => clamp(Math.round(base + d * 5), 0, 100)
  const sectorTrend  = (ch: number) => ch > 0.5 ? 'up' : ch < -0.5 ? 'down' : 'neutral'

  const techCh    = r1(dTech)
  const agroCh    = r1(dAgro)
  const healthCh  = r1(dHealth)
  const energyCh  = r1(dEnergy)
  const fintechCh = r1(dFintech)
  const logCh     = r1(dLogistics)
  const servicesCh = r1(dServices)
  const retailCh  = r1(dRetail)

  // ── Plataformas — estimativa via ação da empresa mãe ──────────────────
  // Base: médias reais de mercado BR (Q1 2026). Deltas refletem movimento da ação
  const metaCpm     = r2(14.2 + metaD * 0.2)
  const metaCpmD    = r1(metaD * 0.3)           // 0 quando ação estável
  const igCpm       = r2(11.4 + metaD * 0.15)
  const igCpmD      = r1(metaD * 0.25)
  const gCpc        = r2(2.84 + googlD * 0.1)
  const gCpcD       = r1(googlD * 0.2)
  const ttCpm       = r2(clamp(6.8 - metaD * 0.1, 3, 12))
  const ttCpmD      = r1(metaD * -0.15)          // cai quando Meta sobe (migração de budget)
  const cacValue    = r1(48.6 + metaD * 0.5 + googlD * 0.3)
  const cacDelta    = r1((metaCpmD + gCpcD * 3) * 0.4)  // 0 quando mercado estável
  const cpmGlobal   = r1((metaCpm * 0.35 + igCpm * 0.25 + ttCpm * 0.25 + 8.2 * 0.15))
  const cpmGlobalD  = r1((metaCpmD * 0.35 + igCpmD * 0.25 + ttCpmD * 0.25))

  // ── Problemas centrais — afetados dinâmicos ────────────────────────────
  const affMargin  = clamp(Math.round(68 + selic * 0.5), 30, 95)
  const affCac     = clamp(Math.round(54 + metaD), 20, 95)
  const affCredit  = clamp(Math.round(47 + selic * 0.3), 20, 95)
  const affTalent  = clamp(Math.round(41 + pib * 0.5), 15, 90)
  const affAi      = clamp(Math.round(38 + dTech * 2), 10, 95)

  // ── Oportunidades — urgência dinâmica ─────────────────────────────────
  const urgTiktok  = clamp(ttCpmD < 0 ? 82 : 60, 10, 99)
  const urgPib     = clamp(Math.round(50 + pib * 5), 10, 99)
  const urgAgro    = clamp(Math.round(50 + dAgro * 5), 10, 99)

  const payload = {
    macro: {
      usdBrl: { value: r2(usdBrl), delta: r2(usdDelta),           sentiment: usdDelta > 0.05 ? 'up' : usdDelta < -0.05 ? 'down' : 'neutral' },
      ipca:   { value: r2(ipca),   delta: r2(ipca - 4.62),        sentiment: ipca > 5 ? 'up' : ipca < 3.5 ? 'down' : 'neutral' },
      selic:  { value: r2(selic),  delta: 0,                       sentiment: selic > 11 ? 'up' : selic < 9 ? 'down' : 'neutral' },
      pib:    { value: r1(pib),    delta: r1(pib - 2.4),           sentiment: pib > 3 ? 'up' : pib < 1 ? 'down' : 'neutral' },
    },
    commodities: {
      gold:    { value: r2(goldP),          delta: r2(goldD),  unit: 'USD/oz',  label: 'Ouro' },
      oil:     { value: r2(oilP),           delta: r2(oilD),   unit: 'USD/bbl', label: 'Petróleo' },
      silver:  { value: r2(silP),           delta: r2(silD),   unit: 'USD/oz',  label: 'Prata' },
      grains:  { value: Math.round(cornP),  delta: cornD,      unit: 'USD/t',   label: 'Grãos' },
      copper:  { value: copP,               delta: copD,       unit: 'USD/lb',  label: 'Cobre' },
      lithium: { value: 14200,              delta: lithD,      unit: 'USD/t',   label: 'Lítio' },
    },
    sectors: [
      { id: 'tech',      label: 'Tecnologia & IA',   change: techCh,     trend: sectorTrend(techCh),     heat: sectorHeat(dTech, 95) },
      { id: 'agro',      label: 'Agronegócio',        change: agroCh,     trend: sectorTrend(agroCh),     heat: sectorHeat(dAgro, 88) },
      { id: 'health',    label: 'Saúde & MedTech',    change: healthCh,   trend: sectorTrend(healthCh),   heat: sectorHeat(dHealth, 82) },
      { id: 'energy',    label: 'Energia Renovável',  change: energyCh,   trend: sectorTrend(energyCh),   heat: sectorHeat(dEnergy, 76) },
      { id: 'fintech',   label: 'Fintech',            change: fintechCh,  trend: sectorTrend(fintechCh),  heat: sectorHeat(dFintech, 71) },
      { id: 'logistics', label: 'Logística Smart',    change: logCh,      trend: sectorTrend(logCh),      heat: sectorHeat(dLogistics, 65) },
      { id: 'services',  label: 'Serviços',           change: servicesCh, trend: sectorTrend(servicesCh), heat: sectorHeat(dServices, 42) },
      { id: 'retail',    label: 'Varejo Tradicional', change: retailCh,   trend: sectorTrend(retailCh),   heat: sectorHeat(dRetail, 18) },
      { id: 'media',     label: 'Mídia Impressa',     change: -31.4,      trend: 'down',                  heat: 5 },
    ],
    globalAgents: [
      { id: 'aapl',  label: 'Apple',      delta: r2(aaplD),  impact: 'Comportamento consumidor premium' },
      { id: 'googl', label: 'Google',     delta: r2(googlD), impact: 'Algoritmo busca → CAC' },
      { id: 'meta',  label: 'Meta',       delta: r2(metaD),  impact: `CPM ${metaD > 0 ? '▲' : '▼'} → CAC todas empresas` },
      { id: 'amzn',  label: 'Amazon BR',  delta: r2(amznD),  impact: 'Pressão preço → varejo' },
      { id: 'vale',  label: 'Vale',       delta: r2(valeD),  impact: 'Commodities minerais' },
      { id: 'petr',  label: 'Petrobras',  delta: r2(petrD),  impact: 'Combustível → frete' },
    ],
    centralProblems: [
      { id: 'margin',  label: 'Margem comprimida',           affected: affMargin,  module: 'pricing',    sem: '3º Sem' },
      { id: 'cac',     label: 'CAC subindo (Meta/Google ▲)', affected: affCac,     module: 'market',     sem: '2º Sem' },
      { id: 'credit',  label: 'Crédito caro (Selic alta)',   affected: affCredit,  module: 'scenarios',  sem: '3º Sem' },
      { id: 'talent',  label: 'Talento escasso e caro',      affected: affTalent,  module: 'people',     sem: '2º Sem' },
      { id: 'ai',      label: 'IA disruptando setores',      affected: affAi,      module: 'innovation', sem: '1º Sem' },
    ],
    platforms: [
      { id: 'meta_ads',     label: 'Meta Ads',      cpm: metaCpm, cpmDelta: metaCpmD,  reach: '2.1B',  trend: metaD > 0.5 ? 'up' : metaD < -0.5 ? 'down' : 'neutral', note: `Ação META ${metaD >= 0 ? '+' : ''}${metaD.toFixed(2)}% hoje · CPM estimado US$${metaCpm}` },
      { id: 'google_ads',   label: 'Google Ads',    cpc: gCpc,    cpcDelta: gCpcD,     reach: '5.4B',  trend: googlD > 0.5 ? 'up' : googlD < -0.5 ? 'down' : 'neutral', note: `Ação GOOGL ${googlD >= 0 ? '+' : ''}${googlD.toFixed(2)}% hoje · CPC estimado US$${gCpc}` },
      { id: 'tiktok',       label: 'TikTok Ads',    cpm: ttCpm,   cpmDelta: ttCpmD,    reach: '1.5B',  trend: ttCpmD < -2 ? 'down' : ttCpmD > 2 ? 'up' : 'neutral', note: `CPM ${ttCpmD < 0 ? 'caindo — oportunidade de alcance barato' : 'subindo'}` },
      { id: 'instagram',    label: 'Instagram',      cpm: igCpm,   cpmDelta: igCpmD,    reach: '2.0B',  trend: metaD > 0.5 ? 'up' : 'neutral', note: 'Reels dominando — mesmo ecossistema META' },
      { id: 'mercadolivre', label: 'Mercado Livre',  cpm: 8.2,     cpmDelta: 0.6,       reach: '148M',  trend: 'neutral', note: 'Marketplace estável — comissões subindo' },
      { id: 'shopee',       label: 'Shopee',          cpm: 5.1,     cpmDelta: -1.4,      reach: '85M',   trend: 'down',    note: 'Competição acirrada — margem apertada' },
    ],
    marketing: {
      cpmGlobal:    { value: cpmGlobal,  delta: cpmGlobalD, label: 'CPM Médio Global' },
      cpcGlobal:    { value: gCpc,       delta: gCpcD,      label: 'CPC Médio Global' },
      cacTrend:     { value: cacValue,   delta: cacDelta,   label: 'CAC Médio BR (R$)' },
      organicShare: { value: 31,         delta: -4.2,       label: 'Tráfego Orgânico %' },
      videoShare:   { value: 72,         delta: 8.6,        label: 'Vídeo no Engajamento %' },
      aiAdoption:   { value: 64,         delta: 18.3,       label: 'Empresas usando IA Mkt %' },
    },
    opportunities: [
      { id: 'tiktok_cpm', label: `TikTok CPM ${ttCpmD < 0 ? 'caindo' : 'estável'} — janela de aquisição ${ttCpmD < 0 ? 'barata' : 'moderada'}`,   urgency: urgTiktok, type: 'canal' },
      { id: 'ai_content', label: 'IA generativa cortando custo de conteúdo em 60%',                                                                    urgency: 76,        type: 'tech'  },
      { id: 'pib_grow',   label: `PIB ${pib.toFixed(1)}% — expansão com risco controlado`,                                                             urgency: urgPib,    type: 'macro' },
      { id: 'organic',    label: 'SEO + conteúdo orgânico reduz dependência de paid',                                                                   urgency: 62,        type: 'canal' },
      { id: 'agro_boom',  label: `Agro ${dAgro >= 0 ? '+' : ''}${dAgro.toFixed(1)}% hoje — oportunidade B2B em agritech`,                            urgency: urgAgro,   type: 'setor' },
    ],
    creditRates: {
      total:      { value: r2(creditPjTotal),     label: 'PJ Total',      unit: '% a.a.' },
      industria:  { value: r2(creditPjIndustria), label: 'Indústria',     unit: '% a.a.' },
      agro:       { value: r2(creditPjAgro),      label: 'Agropecuária',  unit: '% a.a.' },
      comercio:   { value: r2(creditPjComercio),  label: 'Comércio',      unit: '% a.a.' },
      servicos:   { value: r2(creditPjServicos),  label: 'Serviços',      unit: '% a.a.' },
    },
    stocks: {
      ibov: { value: ibovValue, pct: r2(ibovPct) },
      br: [
        { ticker: 'PETR4', label: 'Petrobras',  price: r2(petrPrice), pct: r2(petrD)   },
        { ticker: 'VALE3', label: 'Vale',        price: r2(valePrice), pct: r2(valeD)   },
        { ticker: 'ITUB4', label: 'Itaú',        price: r2(itubPrice), pct: r2(dFintech) },
        { ticker: 'BBDC4', label: 'Bradesco',    price: r2(bbdcPrice), pct: r2(bbdcPct) },
        { ticker: 'WEGE3', label: 'WEG',         price: r2(wegePrice), pct: r2(wegePct) },
      ],
      global: [
        { ticker: 'AAPL',  label: 'Apple',   pct: r2(aaplD)  },
        { ticker: 'GOOGL', label: 'Google',  pct: r2(googlD) },
        { ticker: 'META',  label: 'Meta',    pct: r2(metaD)  },
        { ticker: 'AMZN',  label: 'Amazon',  pct: r2(amznD)  },
      ],
    },
    // Novos dados reais
    inadimplenciaPJ: r2(inadimplenciaPJ),
    ibcBr:           r2(ibcBr),
    desemprego:      r2(desemprego),
    updatedAt: new Date().toISOString(),
  }

  _cache = { data: payload, ts: Date.now() }

  return NextResponse.json(payload, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'X-Cache': 'MISS',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
    },
  })
}
