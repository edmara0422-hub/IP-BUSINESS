import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Cache: guarda análise por 5 minutos
let cache: { data: unknown; ts: number } = { data: null, ts: 0 }
const CACHE_TTL = 5 * 60 * 1000

export async function POST(request: Request) {
  if (cache.data && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data)
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({
      panorama: '',
      macro_insights: [],
      marketing_insights: [],
      riscos: [],
      oportunidades: [],
    })
  }

  try {
    const marketData = await request.json()

    const prompt = `Você é um analista de inteligência de mercado do IPB (Intelligence Platform Business). Analise os dados de mercado abaixo e gere insights cruzados REAIS — não genéricos.

DADOS DE MERCADO EM TEMPO REAL:
- SELIC: ${marketData.macro?.selic?.value ?? 'N/A'}%
- IPCA: ${marketData.macro?.ipca?.value ?? 'N/A'}%
- PIB: ${marketData.macro?.pib?.value ?? 'N/A'}%
- USD/BRL: R$${marketData.macro?.usdBrl?.value ?? 'N/A'}
- Setores: ${JSON.stringify(marketData.sectors?.map((s: { label: string; heat: number; change: number }) => ({ nome: s.label, heat: s.heat, variacao: s.change })) ?? [])}
- Commodities: ${JSON.stringify(Object.entries(marketData.commodities ?? {}).map(([, c]: [string, unknown]) => { const cm = c as { label: string; value: number; delta: number }; return { nome: cm.label, valor: cm.value, delta: cm.delta } }))}
- Agentes Globais: ${JSON.stringify(marketData.globalAgents?.map((a: { label: string; delta: number }) => ({ nome: a.label, delta: a.delta })) ?? [])}
- CAC Médio: R$${marketData.marketing?.cacTrend?.value ?? 'N/A'} (delta: ${marketData.marketing?.cacTrend?.delta ?? 'N/A'}%)
- CPM Global: US$${marketData.marketing?.cpmGlobal?.value ?? 'N/A'}
- Orgânico: ${marketData.marketing?.organicShare?.value ?? 'N/A'}%

REGRAS:
1. Cruze os dados — não repita o que já está na tela. O valor é a CONEXÃO entre dados.
2. Use números reais dos dados acima, não invente.
3. Cada insight deve ter: o que está acontecendo + por que + como afeta uma empresa real.
4. Seja direto e específico — nada de "é importante considerar" ou "pode impactar".
5. Responda em português brasileiro.

Responda APENAS com JSON válido neste formato:
{
  "panorama": "Uma frase de 1 linha resumindo o estado do mercado AGORA cruzando macro + setores + agentes",
  "macro_insights": [
    "Insight 1 cruzando 2+ indicadores macro",
    "Insight 2 cruzando indicadores",
    "Insight 3 cruzando indicadores"
  ],
  "marketing_insights": [
    "Insight 1 cruzando CAC + plataformas",
    "Insight 2 cruzando marketing + macro"
  ],
  "riscos": [
    "Risco 1 cruzando dados reais",
    "Risco 2 cruzando dados reais"
  ],
  "oportunidades": [
    "Oportunidade 1 cruzando dados reais",
    "Oportunidade 2 cruzando dados reais"
  ]
}`

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    })

    if (!res.ok) {
      throw new Error(`Groq API error: ${res.status}`)
    }

    const json = await res.json()
    const text = json.choices?.[0]?.message?.content?.trim() ?? ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const jsonText = jsonMatch ? jsonMatch[0] : text
    const analysis = JSON.parse(jsonText)

    cache = { data: analysis, ts: Date.now() }
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('[intelligence] error:', error)
    return NextResponse.json({
      panorama: '',
      macro_insights: [],
      marketing_insights: [],
      riscos: [],
      oportunidades: [],
    })
  }
}
