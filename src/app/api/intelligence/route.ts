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

    // Prompt compacto — ~250 tokens (era ~600)
    const prompt = `Analista-chefe IPB. Cruze dados, análises profundas com números exatos.
DADOS: SELIC ${selic}% | IPCA ${ipca}% | PIB ${pib}% | USD R$${usd} | Juro real ${taxaReal}%
Setores top: ${topSetores}
CAC R$${cac} (${cacD > 0 ? '+' : ''}${cacD}%) | CPM R$${cpmBrl}/mil | Orgânico ${org}%${perfilBlock}

REGRAS: 1)Cruze 2+ indicadores 2)Números exatos do prompt 3)Impacto concreto 4)Se há usuário, foco no setor e fase dele

Responda APENAS JSON:
{"panorama":"string","macro_insights":["s","s","s","s"],"marketing_insights":["CRESCER AGORA: SIM/NÃO — justificativa numérica","s","s"],"riscos":["RISCO: desc — Como lucrar: ação","s","s"],"oportunidades":["s","s"],"cockpit_alerts":["SELIC ${selic}%: financiar R$10k custa R$${juros10k}/mês — ação","IPCA ${ipca}%: sem reajuste perde ${ipca}pp de margem — ação","CAC +${cacD}%: LTV precisa compensar — ação"]}`

    const res = await groqFetch({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 650,
      temperature: 0.25,
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
