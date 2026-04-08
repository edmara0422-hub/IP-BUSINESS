import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

export const dynamic = 'force-dynamic'

/**
 * IA Professor — direciona o estudo DURANTE a leitura.
 * Diferente do IA Tutor (que responde pergunta livre), o Professor
 * observa o contexto e sussurra: conexões, provocações, revisões, sugestões.
 *
 * Papéis:
 *  - connect: ligar conteúdo atual com outros módulos/tópicos
 *  - provoke: pergunta desafiadora sobre o bloco atual
 *  - review: detectar se aluno precisa revisar conceito anterior
 *  - next: sugerir próximo passo no estudo
 *  - summarize: resumir o que aluno acabou de estudar
 */
interface ProfessorRequest {
  mode: 'connect' | 'provoke' | 'review' | 'next' | 'summarize'
  moduleId: string
  submoduleTitle: string
  blockTitle?: string
  blockContent?: string        // conteúdo (ou resumo) do bloco atual
  studiedTopics?: string[]     // tópicos que o aluno já viu
  currentPosition?: { blockIdx: number; totalBlocks: number }
}

const MODE_PROMPTS: Record<ProfessorRequest['mode'], string> = {
  connect: `Você é um professor experiente direcionando o estudo de um aluno de BI em Negócios.
Seu papel: CONECTAR o que o aluno está estudando agora com OUTROS tópicos que ele já viu.
Regra: seja BREVE (2-3 frases). Aponte UMA conexão específica e acionável. Não liste múltiplas.
Formato: "Isso conecta com [tópico]. [por quê é relevante]. Tente pensar: [pergunta provocativa]."
Português brasileiro, direto, sem preâmbulo.`,

  provoke: `Você é um professor que provoca o aluno a pensar além do texto.
Seu papel: fazer UMA pergunta que obrigue o aluno a aplicar, questionar ou estender o que acabou de ler.
Regra: pergunta única, específica, aplicável a um caso real. Sem resposta pronta.
Formato: "Pergunta: [uma frase]. [por que essa pergunta importa]."
Máximo 2 frases. Português brasileiro, direto.`,

  review: `Você é um professor que detecta lacunas de conhecimento.
Seu papel: identificar se o conteúdo atual depende de algo que o aluno viu antes e pode ter esquecido.
Regra: seja BREVE (1-2 frases). Se não houver dependência clara, diga "sem revisão necessária".
Formato: "Para entender isso a fundo, revise: [tópico]. Motivo: [por quê]."
Português brasileiro, direto.`,

  next: `Você é um professor direcionando o próximo passo do estudo.
Seu papel: sugerir o que o aluno deve fazer DEPOIS desse bloco — aprofundar, praticar ou avançar.
Regra: UMA sugestão concreta. Explique POR QUÊ.
Formato: "Próximo passo: [ação]. Motivo: [por quê]."
Máximo 2 frases. Português brasileiro.`,

  summarize: `Você é um professor consolidando o que o aluno acabou de estudar.
Seu papel: resumir O ESSENCIAL do bloco atual em formato memorável.
Regra: 3 bullets curtos — o QUE, o POR QUÊ e o COMO USAR.
Formato:
• O que: [uma frase]
• Por quê: [uma frase]
• Como usar: [uma frase]
Português brasileiro, direto, sem preâmbulo.`,
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ProfessorRequest
    const { mode, submoduleTitle, blockTitle, blockContent, studiedTopics, currentPosition } = body

    const systemPrompt = MODE_PROMPTS[mode] || MODE_PROMPTS.connect

    const contextParts: string[] = []
    contextParts.push(`Módulo/Tópico atual: "${submoduleTitle}"`)
    if (blockTitle) contextParts.push(`Bloco atual: "${blockTitle}"`)
    if (blockContent) contextParts.push(`Conteúdo do bloco:\n${blockContent.slice(0, 1500)}`)
    if (studiedTopics?.length) contextParts.push(`Tópicos já estudados: ${studiedTopics.slice(0, 15).join(', ')}`)
    if (currentPosition) contextParts.push(`Posição: bloco ${currentPosition.blockIdx + 1} de ${currentPosition.totalBlocks}`)

    const userMessage = contextParts.join('\n\n')

    const client = getClient()
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 250,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    const text = message.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { text: string }).text)
      .join('\n')
      .trim()

    return NextResponse.json({ response: text, mode })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[professor] error:', msg)
    return NextResponse.json({ response: '', error: msg }, { status: 200 })
  }
}
