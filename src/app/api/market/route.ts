import { NextResponse } from 'next/server'

// ── Fetch com timeout ───────────────────────────────────────────────────────
async function safeFetch(url: string, headers?: Record<string, string>, ms = 5000): Promise<Response | null> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), ms)
    const res = await fetch(url, { signal: controller.signal, headers, cache: 'no-store' })
    clearTimeout(timer)
    return res.ok ? res : null
  } catch { return null }
}

const YH = { 'User-Agent': 'Mozilla/5.0' }
const yh = (ticker: string) => `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=2d`

async function parseYahoo(res: PromiseSettledResult<Response | null>) {
  if (res.status !== 'fulfilled' || !res.value) return null
  try {
    const d = await res.value.json()
    const meta = d?.chart?.result?.[0]?.meta
    if (!meta) return null
    const price  = meta.regularMarketPrice as number
    const prev   = meta.previousClose     as number
    return {
      price: parseFloat(price.toFixed(2)),
      delta: prev ? parseFloat(((price - prev) / prev * 100).toFixed(2)) : 0,
    }
  } catch { return null }
}

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)) }
function r2(n: number) { return parseFloat(n.toFixed(2)) }
function r1(n: number) { return parseFloat(n.toFixed(1)) }

export const dynamic = 'force-dynamic'

// ══════════════════════════════════════════════════════════════════════════
export async function GET() {

  // ── Defaults (atualizados Mar/2026 — usados se qualquer fetch falhar) ──
  let usdBrl = 5.25, usdDelta = 0.01
  let ipca = 3.90, pib = 1.6, selic = 14.75

  // commodities
  let goldP = 3050, goldD = 0.2
  let oilP = 69.5,  oilD = -0.5
  let silP = 34.2,  silD = 0.3
  let copP = 4.35,  copD = 0.1
  let cornP = 465,  cornD = -0.8
  let lithD = -1.5

  // agentes globais (% delta diário)
  let aaplD = 1.4, googlD = -0.8, metaD = 2.1
  let amznD = 3.2, valeD = -1.2,  petrD = 0.6

  // setores — delta diário da ação representativa
  let dTech = 0.5, dAgro = 0.3, dHealth = 0.2
  let dEnergy = 0.1, dFintech = -0.1, dLogistics = 0.2
  let dServices = 0.1, dRetail = -0.4

  // ── Fetch em paralelo ───────────────────────────────────────────────────
  try {
    const [
      fxRes, selicRes, ipcaRes, pibRes,
      goldRes, oilRes, silRes, copRes, cornRes, lithRes,
      aaplRes, googlRes, metaRes, amznRes, valeRes, petrRes,
      techRes, agroRes, healthRes, energyRes, fintechRes, logRes, retailRes,
    ] = await Promise.allSettled([
      // Macro (APIs brasileiras que FUNCIONAM)
      safeFetch('https://economia.awesomeapi.com.br/json/last/USD-BRL'),
      safeFetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json'),
      safeFetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados/ultimos/1?formato=json'), // IPCA acumulado 12m
      safeFetch('https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoAnuais?$filter=Indicador%20eq%20%27PIB%20Total%27%20and%20DataReferencia%20eq%20%272026%27&$top=1&$orderby=Data%20desc&$format=json'), // PIB Focus
      // Commodities (Yahoo Finance)
      safeFetch(yh('GC=F'),  YH),   // Ouro
      safeFetch(yh('CL=F'),  YH),   // Petróleo WTI
      safeFetch(yh('SI=F'),  YH),   // Prata
      safeFetch(yh('HG=F'),  YH),   // Cobre
      safeFetch(yh('ZC=F'),  YH),   // Milho/Grãos
      safeFetch(yh('LTHM'),  YH),   // Livent — proxy Lítio
      // Agentes globais (Yahoo Finance)
      safeFetch(yh('AAPL'),  YH),
      safeFetch(yh('GOOGL'), YH),
      safeFetch(yh('META'),  YH),
      safeFetch(yh('AMZN'),  YH),
      safeFetch(yh('VALE'),  YH),   // Vale NYSE ADR
      safeFetch(yh('PBR'),   YH),   // Petrobras NYSE ADR
      // Setores — ação representativa da B3 / NYSE
      safeFetch(yh('TOTVS3.SA'), YH), // Tech: TOTVS
      safeFetch(yh('SLCE3.SA'),  YH), // Agro: SLC Agrícola
      safeFetch(yh('RDOR3.SA'),  YH), // Saúde: Rede D'Or
      safeFetch(yh('EGIE3.SA'),  YH), // Energia: Engie Brasil
      safeFetch(yh('NU'),        YH), // Fintech: Nubank NYSE
      safeFetch(yh('RAIL3.SA'),  YH), // Logística: Rumo
      safeFetch(yh('MGLU3.SA'),  YH), // Varejo: Magazine Luiza
    ])

    // ── Parse macro ──
    if (fxRes.status === 'fulfilled' && fxRes.value) {
      try {
        const d = await fxRes.value.json()
        usdBrl  = parseFloat(d?.USDBRL?.bid    ?? '5.25')
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
    // IPCA acumulado 12m via BCB série 13522
    if (ipcaRes.status === 'fulfilled' && ipcaRes.value) {
      try {
        const d = await ipcaRes.value.json()
        const val = parseFloat(d?.[0]?.valor)
        if (Number.isFinite(val)) ipca = val
      } catch { /* fallback */ }
    }
    // PIB via BCB Focus (projeção mercado)
    if (pibRes.status === 'fulfilled' && pibRes.value) {
      try {
        const d = await pibRes.value.json()
        const val = parseFloat(d?.value?.[0]?.Mediana)
        if (Number.isFinite(val)) pib = val
      } catch { /* fallback */ }
    }

    // ── Parse commodities ──
    const g = await parseYahoo(goldRes);  if (g) { goldP = g.price; goldD = g.delta }
    const o = await parseYahoo(oilRes);   if (o) { oilP  = o.price; oilD  = o.delta }
    const s = await parseYahoo(silRes);   if (s) { silP  = s.price; silD  = s.delta }
    const cu = await parseYahoo(copRes);  if (cu){ copP  = cu.price; copD = cu.delta }
    const cn = await parseYahoo(cornRes); if (cn){ cornP = cn.price; cornD = cn.delta }
    const li = await parseYahoo(lithRes); if (li){ lithD = li.delta }

    // ── Parse agentes ──
    const aapl  = await parseYahoo(aaplRes);  if (aapl)  aaplD  = aapl.delta
    const googl = await parseYahoo(googlRes); if (googl) googlD = googl.delta
    const meta  = await parseYahoo(metaRes);  if (meta)  metaD  = meta.delta
    const amzn  = await parseYahoo(amznRes);  if (amzn)  amznD  = amzn.delta
    const vale  = await parseYahoo(valeRes);  if (vale)  valeD  = vale.delta
    const petr  = await parseYahoo(petrRes);  if (petr)  petrD  = petr.delta

    // ── Parse setores ──
    const totv  = await parseYahoo(techRes);    if (totv)  dTech      = totv.delta
    const slce  = await parseYahoo(agroRes);    if (slce)  dAgro      = slce.delta
    const rdor  = await parseYahoo(healthRes);  if (rdor)  dHealth    = rdor.delta
    const egie  = await parseYahoo(energyRes);  if (egie)  dEnergy    = egie.delta
    const nu    = await parseYahoo(fintechRes); if (nu)    dFintech   = nu.delta
    const rail  = await parseYahoo(logRes);     if (rail)  dLogistics = rail.delta
    const mglu  = await parseYahoo(retailRes);  if (mglu)  dRetail    = mglu.delta
    // Serviços: estimado via macro (sem ação representativa)
    dServices = pib > 2 ? 0.3 : pib > 0 ? 0.1 : -0.3

  } catch { /* todos os fallbacks permanecem */ }

  // ── Helpers de setor ───────────────────────────────────────────────────
  // change = base YoY ajustado pelo delta diário da ação representativa
  // heat   = score 0-100 ajustado pelo delta
  const sectorChange = (d: number, base: number) => r1(base + d * 2)
  const sectorHeat   = (d: number, base: number) => clamp(Math.round(base + d * 5), 0, 100)
  const sectorTrend  = (ch: number) => ch > 3 ? 'up' : ch < -3 ? 'down' : 'neutral'

  const techCh = sectorChange(dTech, 34.2)
  const agroCh = sectorChange(dAgro, 28.1)
  const healthCh = sectorChange(dHealth, 22.4)
  const energyCh = sectorChange(dEnergy, 19.3)
  const fintechCh = sectorChange(dFintech, 17.1)
  const logCh = sectorChange(dLogistics, 15.0)
  const servicesCh = sectorChange(dServices, 3.2)
  const retailCh = sectorChange(dRetail, -12.1)

  // ── Plataformas — estimativa via ação da empresa mãe ──────────────────
  // META delta → CPM Meta/Instagram (mais anunciantes quando ação sobe)
  const metaCpm     = r2(14.2 + metaD * 0.2)
  const metaCpmD    = r1(3.8  + metaD * 0.3)
  const igCpm       = r2(11.4 + metaD * 0.15)
  const igCpmD      = r1(2.1  + metaD * 0.25)
  // GOOGL delta → CPC Google
  const gCpc        = r2(2.84 + googlD * 0.1)
  const gCpcD       = r1(1.2  + googlD * 0.2)
  // TikTok: inversamente afetado — quando Meta sobe, TikTok ganha share barato
  const ttCpm       = r2(clamp(6.8 - metaD * 0.1, 3, 12))
  const ttCpmD      = r1(-5.2 - metaD * 0.2)
  // CAC médio deriva de CPM/CPC das plataformas principais
  const cacValue    = r1(48.6 + metaD * 0.5 + googlD * 0.3)
  const cacDelta    = r1(12.1 + (metaCpmD + gCpcD * 3) * 0.4)
  // CPM global = média ponderada
  const cpmGlobal   = r1((metaCpm * 0.35 + igCpm * 0.25 + ttCpm * 0.25 + 8.2 * 0.15))
  const cpmGlobalD  = r1((metaCpmD * 0.35 + igCpmD * 0.25 + ttCpmD * 0.25) )

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

  return NextResponse.json({
    macro: {
      usdBrl: { value: r2(usdBrl), delta: r2(usdDelta),           sentiment: usdDelta > 0.05 ? 'up' : usdDelta < -0.05 ? 'down' : 'neutral' },
      ipca:   { value: r2(ipca),   delta: r2(ipca - 4.62),        sentiment: ipca > 5 ? 'up' : ipca < 3.5 ? 'down' : 'neutral' },
      selic:  { value: r2(selic),  delta: 0,                       sentiment: selic > 11 ? 'up' : selic < 9 ? 'down' : 'neutral' },
      pib:    { value: r1(pib),    delta: r1(pib - 2.4),           sentiment: pib > 3 ? 'up' : pib < 1 ? 'down' : 'neutral' },
    },
    commodities: {
      gold:    { value: goldP,              delta: goldD,  unit: 'USD/oz',  label: 'Ouro' },
      oil:     { value: oilP,               delta: oilD,   unit: 'USD/bbl', label: 'Petróleo' },
      silver:  { value: silP,               delta: silD,   unit: 'USD/oz',  label: 'Prata' },
      grains:  { value: Math.round(cornP),  delta: cornD,  unit: 'USD/t',   label: 'Grãos' },
      copper:  { value: copP,               delta: copD,   unit: 'USD/lb',  label: 'Cobre' },
      lithium: { value: 14200,              delta: lithD,  unit: 'USD/t',   label: 'Lítio' },
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
    updatedAt: new Date().toISOString(),
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
    },
  })
}
