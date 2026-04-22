import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

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
      // Respeita Retry-After do Groq; fallback exponencial
      const retryAfter = parseInt(res.headers.get('retry-after') ?? '0') * 1000 || (i + 1) * 8000
      await new Promise(r => setTimeout(r, Math.min(retryAfter, 20000)))
    }
  }
  return lastRes
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({ answer: 'GROQ_API_KEY não configurada.' })
  }

  try {
    const { question, marketContext } = await request.json()

    const systemMsg = marketContext
      ? `Analista financeiro sênior PME Brasil. Dados de mercado: ${marketContext}. Responda em PT-BR com precisão.`
      : `Analista financeiro sênior PME Brasil. Responda em PT-BR, cite números reais, seja direto.`

    const res = await groqFetch({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemMsg },
        { role: 'user',   content: question },
      ],
      max_tokens: 800,
      temperature: 0.4,
    }, apiKey)

    if (!res.ok) {
      const errBody = await res.text()
      console.error('[advisor-chat] Groq error:', res.status, errBody)
      return NextResponse.json({ answer: `Erro Groq ${res.status}: ${errBody.slice(0, 200)}` })
    }

    const json = await res.json()
    const answer = json.choices?.[0]?.message?.content?.trim() ?? 'Sem resposta.'
    return NextResponse.json({ answer })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[advisor-chat] error:', msg)
    return NextResponse.json({ answer: `Erro: ${msg}` })
  }
}
