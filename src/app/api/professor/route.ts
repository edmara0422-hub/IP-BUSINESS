import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY })
}

export const dynamic = 'force-dynamic'

/**
 * IA Professor — direciona o estudo DURANTE a leitura.
 * Diferente do IA Tutor (chat livre), o Professor observa o contexto do
 * bloco atual e devolve UMA resposta curta e direta em um dos 5 modos:
 *
 *  - connect    → ligar com outros tópicos
 *  - provoke    → pergunta desafiadora aplicada
 *  - review     → o que reler antes
 *  - next       → próximo passo concreto
 *  - summarize  → essência em 3 bullets
 *
 * Usa Groq (mesma stack do Tutor) — gratuito, rápido, já configurado.
 */
interface ProfessorRequest {
  mode: 'connect' | 'provoke' | 'review' | 'next' | 'summarize'
  moduleId: string
  submoduleTitle: string
  blockTitle?: string
  blockContent?: string
  studiedTopics?: string[]
  currentPosition?: { blockIdx: number; totalBlocks: number }
}

const MODE_PROMPTS: Record<ProfessorRequest['mode'], string> = {
  connect: `Você é um professor sênior de BI em Negócios direcionando o estudo de um aluno.
Seu papel: CONECTAR o que o aluno está estudando agora com OUTROS tópicos relacionados (módulos M1–M8 do curso, ou conceitos clássicos da área).
Regra: seja BREVE (2-3 frases). Aponte UMA conexão específica e acionável. Não liste múltiplas.
Formato: "Isso conecta com [tópico]. [por quê é relevante]. Tente pensar: [pergunta provocativa]."
Português brasileiro, direto, sem preâmbulo.`,

  provoke: `Você é um professor que provoca o aluno a pensar além do texto.
Seu papel: fazer UMA pergunta que obrigue o aluno a aplicar, questionar ou estender o que acabou de ler.
Regra: pergunta única, específica, aplicável a um caso real. Sem resposta pronta.
Formato: "Pergunta: [uma frase]. [por que essa pergunta importa]."
Máximo 2 frases. Português brasileiro, direto.`,

  review: `Você é um professor que detecta lacunas de conhecimento.
Seu papel: identificar se o conteúdo atual depende de algo que o aluno pode ter esquecido ou que ainda precisa entender.
Regra: seja BREVE (1-2 frases). Se não houver dependência clara, sugira UMA leitura curta de reforço sobre o tema atual.
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
• O quê: [uma frase]
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
    if (blockContent) contextParts.push(`Conteúdo do bloco:\n${blockContent.slice(0, 2500)}`)
    if (studiedTopics?.length) contextParts.push(`Tópicos já estudados: ${studiedTopics.slice(0, 15).join(', ')}`)
    if (currentPosition) contextParts.push(`Posição: bloco ${currentPosition.blockIdx + 1} de ${currentPosition.totalBlocks}`)

    const userMessage = contextParts.join('\n\n')

    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 280,
      temperature: mode === 'provoke' ? 0.8 : 0.6,
    })

    const text = completion.choices[0]?.message?.content?.trim() ?? ''

    return NextResponse.json({ response: text, mode })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[professor] error:', msg)
    return NextResponse.json({ response: '', error: msg }, { status: 200 })
  }
}
