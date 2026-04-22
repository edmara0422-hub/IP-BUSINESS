import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({ answer: 'GROQ_API_KEY não configurada. Adicione nas variáveis de ambiente do Vercel.' })
  }

  try {
    const { question, marketContext } = await request.json()

    // O question do cockpit já contém todas as instruções e dados — não duplicar sistema.
    // marketContext é usado como contexto breve no system message.
    const systemMsg = marketContext
      ? `Você é analista financeiro sênior de PMEs brasileiras. Dados de mercado atuais: ${marketContext}. NUNCA arredonde valores — use precisão total.`
      : `Você é analista financeiro sênior de PMEs brasileiras. Responda em português, cite números reais, seja direto. NUNCA arredonde valores.`

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemma2-9b-it',
        messages: [
          { role: 'system', content: systemMsg },
          { role: 'user',   content: question },
        ],
        max_tokens: 1800,
        temperature: 0.4,
      }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      console.error('[advisor-chat] Groq error:', res.status, errBody)
      return NextResponse.json({ answer: `Erro Groq ${res.status}: ${errBody.slice(0, 200)}` })
    }

    const json = await res.json()
    const answer = json.choices?.[0]?.message?.content?.trim() ?? 'Não consegui gerar resposta.'

    return NextResponse.json({ answer })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[advisor-chat] error:', msg)
    return NextResponse.json({ answer: `Erro: ${msg}` })
  }
}
