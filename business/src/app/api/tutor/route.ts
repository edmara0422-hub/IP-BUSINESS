import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export const dynamic = 'force-static'

interface TutorRequest {
  selectedText: string
  question: string
  moduleId: string
  submoduleTitle: string
  history: { role: 'user' | 'assistant'; content: string }[]
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TutorRequest
    const { selectedText, question, submoduleTitle, history } = body

    const systemPrompt = `Você é um tutor sênior de negócios, nível MBA, especializado em "${submoduleTitle}".
${selectedText ? `O aluno selecionou este trecho: "${selectedText.slice(0, 300)}"` : ''}

Regras de resposta:
- Seja denso e preciso — vá direto ao núcleo do conceito, sem introduções óbvias
- Use referências reais e atuais: autores como Kotler, Drucker, Porter, Damodaran, Kahneman, Thaler, Christensen, Osterwalder — cite nomes e obras quando relevante
- Traga exemplos de empresas reais e recentes (Amazon, Apple, Nubank, Magazine Luiza, Tesla, etc.)
- Conecte o conceito ao contexto prático de quem está construindo ou gerindo um negócio
- Máximo 3 parágrafos curtos e densos — sem enrolação
- Responda sempre em português brasileiro`

    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: question },
    ]

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 700,
      temperature: 0.7,
    })

    const text = completion.choices[0]?.message?.content?.trim() ?? ''

    return NextResponse.json({ response: text })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[tutor] error:', msg)
    return NextResponse.json({ response: `Erro: ${msg}` }, { status: 200 })
  }
}
