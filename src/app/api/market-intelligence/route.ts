import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const SYSTEM_PROMPT = `Você é um analista sênior de inteligência de mercado — Bloomberg Intelligence adaptado para empresas brasileiras.

Seu papel:
- Interpretar condições macroeconômicas com impacto prático e direto em negócios
- Identificar setores em momentum positivo ou pressão com base nos dados fornecidos
- Cruzar SELIC, câmbio, inflação com oportunidades reais de mercado
- Linguagem executiva: direta, técnica, sem rodeios nem jargão vazio

Regras de resposta:
- Sempre cite os números reais fornecidos no contexto
- Máximo 3-4 parágrafos curtos ou bullet points objetivos
- Termine SEMPRE com uma linha "SINAL:" seguida de OPORTUNIDADE 🟢, NEUTRO 🟡 ou ATENÇÃO 🔴
- Responda integralmente em português brasileiro
- Nunca invente dados — use apenas o que está no contexto`

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
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return NextResponse.json({ answer: 'GROQ_API_KEY não configurada.' })

  try {
    const { question, marketData, userSector } = await request.json()

    const m = marketData?.macro ?? {}
    const sectors = marketData?.sectors ?? []
    const commodities = marketData?.commodities ?? {}
    const credit = marketData?.creditRates ?? {}
    const stocks = marketData?.stocks?.br ?? []

    const sectorLines = sectors
      .slice(0, 9)
      .map((s: { label: string; heat: number; change: number }) =>
        `  • ${s.label}: heat ${s.heat}/100 | ${s.change >= 0 ? '+' : ''}${s.change}% hoje`)
      .join('\n')

    const stockLines = stocks.length
      ? stocks.map((s: { ticker: string; price: number; pct: number }) =>
          `  ${s.ticker}: R$${s.price} (${s.pct >= 0 ? '+' : ''}${s.pct}%)`).join(' | ')
      : ''

    const context = `
DADOS DE MERCADO — ${new Date().toLocaleString('pt-BR')}

MACRO:
  SELIC: ${m.selic?.value ?? '—'}% a.a.
  USD/BRL: R$${m.usdBrl?.value ?? '—'} (${(m.usdBrl?.delta ?? 0) >= 0 ? '+' : ''}${m.usdBrl?.delta ?? 0})
  IPCA (12m): ${m.ipca?.value ?? '—'}%
  PIB (projeção): ${m.pib?.value ?? '—'}%

SETORES:
${sectorLines}

COMMODITIES:
  Ouro: $${commodities.gold?.value ?? '—'}/oz (${(commodities.gold?.delta ?? 0) >= 0 ? '+' : ''}${commodities.gold?.delta ?? 0}%)
  Petróleo: $${commodities.oil?.value ?? '—'}/bbl (${(commodities.oil?.delta ?? 0) >= 0 ? '+' : ''}${commodities.oil?.delta ?? 0}%)
  Prata: $${commodities.silver?.value ?? '—'}/oz

CRÉDITO PJ (taxa média a.a.):
  Total PJ: ${credit.total?.value ?? '—'}% | Comércio: ${credit.comercio?.value ?? '—'}% | Serviços: ${credit.servicos?.value ?? '—'}% | Indústria: ${credit.industria?.value ?? '—'}%

${stockLines ? `AÇÕES BR:\n  ${stockLines}` : ''}
${userSector ? `\nSETOR DO USUÁRIO: ${userSector}` : ''}
`

    let res = await groqFetch({
      model: 'compound-beta',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `${context}\n\nPERGUNTA: ${question}` },
      ],
      max_tokens: 900,
      temperature: 0.25,
    }, apiKey)

    // fallback se quota compound excedida
    if (!res.ok && (res.status === 429 || res.status === 413)) {
      res = await groqFetch({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `${context}\n\nPERGUNTA: ${question}` },
        ],
        max_tokens: 900,
        temperature: 0.25,
      }, apiKey)
    }

    if (!res.ok) {
      const err = await res.text().catch(() => res.status.toString())
      return NextResponse.json({ answer: `Erro ao consultar Groq (${res.status}): ${err}` })
    }

    const data = await res.json()
    const answer = data.choices?.[0]?.message?.content ?? 'Sem resposta.'
    return NextResponse.json({ answer })
  } catch {
    return NextResponse.json({ answer: 'Erro interno ao processar análise de mercado.' })
  }
}
