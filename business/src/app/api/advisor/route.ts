import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic()

export const dynamic = 'force-static'

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

export async function POST(request: Request) {
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

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text.trim() : ''

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const jsonText = jsonMatch ? jsonMatch[0] : text
    const analysis = JSON.parse(jsonText) as { primary: string; narrative: string; recommendation: string }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('[advisor] error:', error)
    return NextResponse.json(
      {
        primary: 'Configure a variável ANTHROPIC_API_KEY no arquivo .env.local para ativar o diagnóstico por IA.',
        narrative: 'O advisor usa o Claude Haiku para gerar análises estratégicas em tempo real a partir dos dados do cockpit.',
        recommendation: 'Crie o arquivo .env.local na raiz do projeto com: ANTHROPIC_API_KEY=sua_chave_aqui',
      },
      { status: 200 },
    )
  }
}
