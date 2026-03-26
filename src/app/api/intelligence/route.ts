import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function getClient() {
  return new Anthropic()
}

// Cache: guarda análise por 5 minutos (os dados de mercado atualizam a cada 60s, mas a análise IA não precisa ser tão frequente)
let cache: { data: unknown; ts: number } = { data: null, ts: 0 }
const CACHE_TTL = 5 * 60 * 1000

export async function POST(request: Request) {
  // Se cache válido, retorna direto
  if (cache.data && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data)
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
- Commodities: ${JSON.stringify(Object.entries(marketData.commodities ?? {}).map(([k, c]: [string, any]) => ({ nome: c.label, valor: c.value, delta: c.delta })))}
- Agentes Globais: ${JSON.stringify(marketData.globalAgents?.map((a: { label: string; delta: number }) => ({ nome: a.label, delta: a.delta })) ?? [])}
- CAC Médio: R$${marketData.marketing?.cacTrend?.value ?? 'N/A'} (delta: ${marketData.marketing?.cacTrend?.delta ?? 'N/A'}%)
- CPM Global: US$${marketData.marketing?.cpmGlobal?.value ?? 'N/A'}
- Orgânico: ${marketData.marketing?.organicShare?.value ?? 'N/A'}%

REGRAS:
1. Cruze os dados — não repita o que já está na tela. O valor é a CONEXÃO entre dados.
2. Use números reais dos dados acima, não invente.
3. Cada insight deve ter: o que está acontecendo + por que + como afeta uma empresa real.
4. Seja direto e específico — nada de "é importante considerar" ou "pode impactar".

Responda APENAS com JSON válido neste formato:
{
  "panorama": "Uma frase de 1 linha resumindo o estado do mercado AGORA cruzando macro + setores + agentes. Ex: 'Tech aquecido a 98/100 mas SELIC 14.8% trava o funding — startups crescem sem crédito'",
  "macro_insights": [
    "Insight cruzando 2+ indicadores macro e explicando a cascata. Ex: 'SELIC 14.8% + IPCA 4.83% = taxa real de 9.97% — o maior juro real do G20. Empresas que dependem de crédito pagam 37% a.a. enquanto a margem média do varejo é 8%'",
    "Segundo insight macro cruzado",
    "Terceiro insight macro cruzado"
  ],
  "marketing_insights": [
    "Insight cruzando CAC + plataformas + macro. Ex: 'CAC R$49 subindo 15% + Meta ▲ = CPM vai subir mais. TikTok CPM caindo é a janela: realocar 20% do budget economiza ~R$12 por aquisição'",
    "Segundo insight marketing cruzado"
  ],
  "riscos": [
    "Risco real cruzando dados. Ex: 'Varejo com heat 18/100 + SELIC 14.8% + IPCA 4.83% = setor pode perder mais 15% no próximo trimestre. Empresas no varejo físico devem pivotar para e-commerce ou morrem'",
    "Segundo risco cruzado"
  ],
  "oportunidades": [
    "Oportunidade real cruzando dados. Ex: 'Agro heat 88/100 + PIB 2.9% + Dólar R$5.72 = exportadores agrícolas com margem recorde. B2B agritech tem CAC baixo e LTV alto — melhor setor para entrar agora'",
    "Segunda oportunidade cruzada"
  ]
}`

    const message = await getClient().messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const jsonText = jsonMatch ? jsonMatch[0] : text
    const analysis = JSON.parse(jsonText)

    cache = { data: analysis, ts: Date.now() }
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('[intelligence] error:', error)
    return NextResponse.json({
      panorama: 'Análise IA indisponível — verifique a ANTHROPIC_API_KEY.',
      macro_insights: [],
      marketing_insights: [],
      riscos: [],
      oportunidades: [],
    })
  }
}
