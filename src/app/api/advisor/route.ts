import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface AdvisorRequest {
  snapshot: {
    marginPct: number
    ebitda: number
    ltvCac: number
    healthScore: number
    burnRate: number
    runwayMonths: number
    stressIndex: number
    breakEvenRevenue: number
    roiPct: number
    revenue: number
  }
  inputs: {
    monthlyRevenue: number
    operatingExpenses: number
    cashReserve: number
    cac: number
    ltv: number
  }
  workspace: {
    name: string
    sector: string
  }
}

async function groqFetch(payload: object, apiKey: string): Promise<Response> {
  return fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return NextResponse.json(
    { primary: 'GROQ_API_KEY não configurada.', narrative: '', recommendation: '' },
    { status: 200 },
  )

  try {
    const body = (await request.json()) as AdvisorRequest
    const { snapshot, inputs, workspace } = body

    const prompt = `Você é um consultor de negócios sênior analisando a empresa "${workspace.name}" no setor "${workspace.sector}".

Dados financeiros atuais:
- Receita mensal: R$ ${inputs.monthlyRevenue.toLocaleString('pt-BR')}
- Despesas operacionais: R$ ${inputs.operatingExpenses.toLocaleString('pt-BR')}
- Caixa disponível: R$ ${inputs.cashReserve.toLocaleString('pt-BR')}
- Margem líquida: ${snapshot.marginPct.toFixed(1)}%
- EBITDA: R$ ${snapshot.ebitda.toLocaleString('pt-BR')}
- LTV/CAC: ${snapshot.ltvCac.toFixed(2)}x
- Health Score: ${snapshot.healthScore.toFixed(0)}/100
- Burn Rate: R$ ${snapshot.burnRate.toFixed(0)}/mês
- Runway: ${snapshot.runwayMonths.toFixed(1)} meses
- Stress Index: ${snapshot.stressIndex.toFixed(0)}/100
- Break-even: R$ ${snapshot.breakEvenRevenue.toLocaleString('pt-BR')}
- ROI: ${snapshot.roiPct.toFixed(1)}%

Forneça uma análise executiva estratégica. Responda APENAS com JSON válido neste formato exato:
{
  "primary": "Leitura direta do estado do negócio em 1-2 frases usando os números reais.",
  "narrative": "Causa raiz do maior risco ou oportunidade identificada, com referência aos dados.",
  "recommendation": "Ação executiva prioritária e específica que o gestor deve tomar agora."
}

Seja direto, use os números, evite generalidades. Responda APENAS o JSON.`

    let res = await groqFetch({
      model: 'compound-beta',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 512,
      temperature: 0.25,
    }, apiKey)

    if (!res.ok && (res.status === 429 || res.status === 413)) {
      res = await groqFetch({
        model: 'compound-beta-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 512,
        temperature: 0.25,
      }, apiKey)
    }

    if (!res.ok) {
      const err = await res.text().catch(() => String(res.status))
      return NextResponse.json(
        { primary: `Erro Groq ${res.status}: ${err.slice(0, 100)}`, narrative: '', recommendation: '' },
        { status: 200 },
      )
    }

    const data = await res.json()
    const text = (data.choices?.[0]?.message?.content ?? '').trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const analysis = JSON.parse(jsonMatch ? jsonMatch[0] : text) as { primary: string; narrative: string; recommendation: string }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('[advisor] error:', error)
    return NextResponse.json(
      { primary: 'Erro ao gerar análise.', narrative: '', recommendation: '' },
      { status: 200 },
    )
  }
}
