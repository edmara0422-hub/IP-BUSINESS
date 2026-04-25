import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const EMPTY = {
  panorama: '',
  macro_insights: [] as string[],
  marketing_insights: [] as string[],
  riscos: [] as string[],
  oportunidades: [] as string[],
  cockpit_alerts: [] as string[],
}

let cache: { data: unknown; ts: number; key: string } = { data: null, ts: 0, key: '' }
// 20 minutos — reduz chamadas simultâneas com o advisor-chat
const CACHE_TTL = 20 * 60 * 1000

async function groqFetch(payload: object, apiKey: string, maxRetries = 2): Promise<Response> {
  let lastRes: Response = new Response('', { status: 500 })
  for (let i = 0; i <= maxRetries; i++) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    lastRes = res
    if (res.status !== 429) return res
    if (i < maxRetries) {
      const retryAfter = parseInt(res.headers.get('retry-after') ?? '0') * 1000 || (i + 1) * 8000
      await new Promise(r => setTimeout(r, Math.min(retryAfter, 20000)))
    }
  }
  return lastRes
}

export async function POST(request: Request) {
  const body = await request.json()
  const up = body.userProfile
  const cacheKey = `${up?.subtype ?? ''}_${up?.sectors?.[0] ?? ''}`
  if (cache.data && Date.now() - cache.ts < CACHE_TTL && cache.key === cacheKey) {
    return NextResponse.json(cache.data)
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return NextResponse.json(EMPTY)

  try {
    const m = body
    const selic = m.macro?.selic?.value  ?? 14.75
    const ipca  = m.macro?.ipca?.value   ?? 4.14
    const pib   = m.macro?.pib?.value    ?? 1.86
    const usd   = m.macro?.usdBrl?.value ?? 4.98
    const cac   = m.marketing?.cacTrend?.value ?? 120
    const cacD  = m.marketing?.cacTrend?.delta ?? 12
    const cpm   = m.marketing?.cpmGlobal?.value ?? 8.5
    const org   = m.marketing?.organicShare?.value ?? 38
    const taxaReal  = (selic - ipca).toFixed(2)
    const cpmBrl    = (cpm * usd).toFixed(0)
    const juros10k  = Math.round(10000 * selic * 2.5 / 100 / 12)
    // Top 3 setores mais quentes para manter prompt curto
    const topSetores = (m.sectors ?? [])
      .sort((a: {heat:number}, b: {heat:number}) => b.heat - a.heat)
      .slice(0, 3)
      .map((s: {label:string; heat:number; change:number}) =>
        `${s.label} ${s.heat}/100 ${s.change > 0 ? '+' : ''}${s.change?.toFixed(1)}%`
      ).join(' | ')

    const nomeNeg   = up?.nomeNegocio || up?.nome_negocio || ''
    const fase      = up?.subtype ?? ''
    const setorUser = up?.sectors?.join(', ') ?? ''
    const temPerfil = !!(fase || setorUser)

    const sectorMap: Record<string, string> = {
      'Tecnologia': 'tech', 'Consultoria': 'services', 'Agência': 'services',
      'Educação': 'services', 'Saúde': 'health', 'Agro': 'agro',
      'Varejo': 'retail', 'Financeiro': 'fintech', 'Logística': 'logistics',
    }
    const userSectorId   = sectorMap[up?.sectors?.[0]] ?? ''
    const userSectorData = m.sectors?.find((s: {id:string; heat:number}) => s.id === userSectorId)
    const userSectorLine = userSectorData ? `Setor ${setorUser}: ${userSectorData.heat}/100` : ''

    const perfilBlock = temPerfil
      ? `\nUSUÁRIO: ${nomeNeg || '?'} | ${fase} | ${setorUser} | ${userSectorLine}\nFILTRE para setor "${setorUser}" e fase "${fase}".`
      : ''

    const inadimpStr = (body.inadimplenciaPJ ?? 0) > 0 ? ` | Inadimplência PJ: ${body.inadimplenciaPJ}%` : ''
    const desempStr  = (body.desemprego ?? 0) > 0 ? ` | Desemprego PNAD: ${body.desemprego}%` : ''
    const ibcStr     = (body.ibcBr ?? 0) !== 0 ? ` | IBC-Br (GDP proxy): ${body.ibcBr}%` : ''
    const creditTop  = body.creditRates?.total?.value ?? 28.5
    const stocksStr  = (body.stocks?.br ?? []).map((s: {ticker:string;price:number;pct:number}) =>
      `${s.ticker} R$${s.price} (${s.pct >= 0 ? '+' : ''}${s.pct}%)`).join(' | ')

    const prompt = `Você é o analista-chefe da IPB — Bloomberg Intelligence para PMEs brasileiras. Seja cirúrgico, direto, com números reais.

DADOS REAIS AGORA:
Macro: SELIC ${selic}% | IPCA ${ipca}% | PIB projeção ${pib}% | USD R$${usd} | Juro real ${taxaReal}%${ibcStr}${inadimpStr}${desempStr}
Crédito PJ médio: ${creditTop}% a.a. | Custo mensal R$10k = R$${juros10k}/mês
Setores líderes: ${topSetores}
Marketing: CAC R$${cac} (${cacD > 0 ? '+' : ''}${cacD}%) | CPM R$${cpmBrl}/mil | Orgânico ${org}%
Ações BR: ${stocksStr || '—'}${perfilBlock}

REGRAS OBRIGATÓRIAS:
1. Cruce SEMPRE 2+ indicadores — nunca análise isolada
2. Use APENAS os números acima — nunca invente
3. Cada insight: causa → impacto concreto em R$ ou % → ação executável
4. panorama: 2 frases densas com os 3 maiores sinais do momento
5. cockpit_alerts: sempre os 3 alertas com número + ação desta semana
6. Se há perfil de usuário, todos os itens devem refletir o setor e fase dele

Responda APENAS JSON válido:
{"panorama":"2 frases densas com sinais do momento","macro_insights":["SELIC ${selic}% + IPCA ${ipca}% = juro real ${taxaReal}% — impacto e ação","PIB ${pib}% + setor em números — o que fazer","USD R$${usd} — quem ganha quem perde","IBC-Br / atividade real — o que está acelerando ou travando"],"marketing_insights":["CRESCER AGORA: SIM/NÃO — justificativa com CAC e CPM reais","Canal com melhor ROI agora com números","Retenção vs aquisição — qual priorizar com esses dados"],"riscos":["RISCO CRÍTICO: causa com número — ação de proteção esta semana","segundo risco com número","terceiro risco com ação"],"oportunidades":["oportunidade 1 com setor + número + janela temporal","oportunidade 2 acionável"],"cockpit_alerts":["SELIC ${selic}%: R$10k/mês de crédito custa R$${juros10k} — renegocie ou quite até [prazo]","IPCA ${ipca}%: sem reajuste você perde ${ipca}pp de margem — reajuste até [data]","CAC ${cacD > 0 ? '+' : ''}${cacD}%: se LTV não subiu proporcionalmente, canal está queimando caixa — ação"]}`

    const res = await groqFetch({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 900,
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }, apiKey)

    if (!res.ok) throw new Error(`Groq ${res.status}`)

    const json = await res.json()
    const text = json.choices?.[0]?.message?.content?.trim() ?? ''
    const match = text.match(/\{[\s\S]*\}/)
    const analysis = JSON.parse(match ? match[0] : text)

    cache = { data: analysis, ts: Date.now(), key: cacheKey }
    return NextResponse.json(analysis)
  } catch (e) {
    console.error('[intelligence]', e)
    return NextResponse.json(EMPTY)
  }
}
