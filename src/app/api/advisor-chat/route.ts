import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({ answer: 'GROQ_API_KEY não configurada. Adicione nas variáveis de ambiente do Vercel.' })
  }

  try {
    const { question, marketContext } = await request.json()

    const prompt = `Você é o IA Advisor do IPB — Intelligence Platform Business. Você tem acesso aos dados de mercado em tempo real do Brasil.

DADOS DE MERCADO AGORA:
${marketContext}

REGRAS:
1. Responda em português brasileiro, direto e objetivo
2. USE os dados de mercado acima para fundamentar sua resposta — cite números reais
3. Cada resposta deve ter: diagnóstico + por que + o que fazer agora
4. Não seja genérico — seja específico com os dados
5. Máximo 3-4 parágrafos
6. Se o usuário perguntar sobre precificação, use IPCA e câmbio reais
7. Se perguntar sobre crédito/financiamento, use SELIC real
8. Se perguntar sobre setor, use os dados de heat e variação
9. Termine com uma ação concreta: "AÇÃO: [o que fazer agora]"

PERGUNTA DO USUÁRIO:
${question}`

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
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
