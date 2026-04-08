import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY })
}

export const dynamic = 'force-dynamic'

interface TutorRequest {
  action?: 'explain' | 'evaluate-challenge' | 'evaluate-framework' | 'generate-probe' | 'evaluate-probe'
  selectedText?: string
  question: string
  moduleId?: string
  submoduleTitle: string
  history: { role: 'user' | 'assistant'; content: string }[]
}

const SYSTEM_PROMPTS: Record<string, string> = {
  explain: `Você é um tutor sênior de negócios, nível MBA, respondendo a um aluno DENTRO de uma sessão de estudo.
O aluno está estudando um tópico específico — suas respostas devem SE CONECTAR com o tópico atual.

Regras:
- Seja denso e preciso. Vá direto ao ponto.
- Use referências reais (autor + ano + universidade/empresa). Exemplos de empresas, preferindo brasileiras.
- Máximo 3 parágrafos curtos.
- Se a pergunta se desvia do tópico, responda e depois conecte de volta ("Voltando ao tópico [X], isso importa porque...").
- Se cabe sugerir uma ação concreta (ler X, pensar em Y, aplicar Z), sugira.
- Português brasileiro, sem jargão vazio.`,

  'evaluate-challenge': `Você é um avaliador de MBA. O aluno completou um desafio aplicado ao negócio dele.
Regras: Avalie cada critério de 0 a 100. Seja específico no feedback — diga exatamente o que está bom e o que falta. No final, dê NOTA GERAL: XX/100. Português brasileiro.`,

  'evaluate-framework': `Você é um consultor estratégico sênior avaliando um framework preenchido por um aluno.
Regras: Avalie (1) Completude (2) Coerência entre campos (3) Profundidade estratégica. Seja direto e prático. Máximo 4 parágrafos. Português brasileiro.`,

  'generate-probe': `Você gera perguntas de compreensão para alunos de negócios.
Regras: Retorne APENAS a pergunta, sem explicação. A pergunta deve testar compreensão aplicada, não memorização. Português brasileiro.`,

  'evaluate-probe': `Você avalia respostas de alunos sobre conceitos de negócios.
Regras: Avalie se demonstrou compreensão real. 2-3 frases: o que acertou, o que faltou. No final diga APROVADO ou REVISAR. Português brasileiro.`,
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TutorRequest
    const { action = 'explain', selectedText, question, submoduleTitle, history } = body

    const basePrompt = SYSTEM_PROMPTS[action] || SYSTEM_PROMPTS.explain
    const systemPrompt = `${basePrompt}\nTópico: "${submoduleTitle}".${selectedText ? `\nTexto do aluno: "${selectedText.slice(0, 500)}"` : ''}`

    const maxTokens = action === 'generate-probe' ? 200 : action === 'evaluate-probe' ? 300 : 700

    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: question },
    ]

    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: maxTokens,
      temperature: action === 'generate-probe' ? 0.9 : 0.7,
    })

    const text = completion.choices[0]?.message?.content?.trim() ?? ''

    return NextResponse.json({ response: text })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[tutor] error:', msg)
    return NextResponse.json({ response: `Erro: ${msg}` }, { status: 200 })
  }
}
