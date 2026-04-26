import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY })
}

export const dynamic = 'force-dynamic'

interface TutorRequest {
  action?: 'explain' | 'deep-dive' | 'real-case' | 'compare' | 'evaluate-challenge' | 'evaluate-framework' | 'generate-probe' | 'evaluate-probe'
  selectedText?: string
  question: string
  moduleId?: string
  submoduleTitle: string
  blockContent?: string
  history: { role: 'user' | 'assistant'; content: string }[]
}

const SYSTEM_PROMPTS: Record<string, string> = {
  explain: `Você é um tutor sênior de negócios (MBA/Doutorado) respondendo a um aluno em sessão de estudo.

COMO RESPONDER:
- Vá direto ao ponto. Primeira frase já responde.
- Use **negrito** para termos-chave e _itálico_ para ênfase.
- Cite autores reais (nome + ano + universidade): Carr (2003, HBR), Porter (1985, Harvard), Brynjolfsson (2014, MIT).
- Dê exemplos de empresas brasileiras quando possível (Magazine Luiza, Nubank, Natura, iFood, Embraer).
- Se o aluno selecionou um trecho do texto, explique AQUELE trecho — não o tópico inteiro.
- Se a pergunta desvia do tópico, responda e reconecte: "Voltando ao tema..."
- Termine com 1 insight prático que o aluno pode usar imediatamente.
- Use listas com — quando listar itens.
- Máximo 4 parágrafos. Português brasileiro. Sem preâmbulos ("ótima pergunta!").`,

  'deep-dive': `Você é um professor aprofundando um tema além do que o material básico cobre.

COMO RESPONDER:
- Revele a CAMADA que o texto não mostrou — o debate acadêmico, a controvérsia, o dado que surpreende.
- Cite pelo menos 2 autores com ano e universidade.
- Inclua 1 caso real brasileiro com número concreto (R$, %, prazo).
- Use **negrito** para conceitos-chave.
- Termine com "Para ir além:" e 1 referência real (livro ou paper com autor + ano).
- Máximo 5 parágrafos. Português brasileiro. Sem preâmbulos.`,

  'real-case': `Você é um professor que ensina por CASOS REAIS.

COMO RESPONDER:
- Conte 1 caso real completo (empresa brasileira preferencialmente).
- Estrutura: **Contexto** (empresa, ano, situação) → **Decisão** (o que fizeram) → **Resultado** (números reais) → **Lição** (o que aprender).
- Use **negrito** nos marcos do caso.
- Inclua pelo menos 1 número concreto (receita, economia, market share, prazo).
- Termine com: "A lição aplicável:" + 1 frase acionável.
- Máximo 5 parágrafos. Português brasileiro. Sem preâmbulos.`,

  'compare': `Você é um professor que ensina comparando conceitos, autores ou abordagens.

COMO RESPONDER:
- Compare 2-3 itens lado a lado.
- Para cada item: **Nome** — definição em 1 frase + quando usar + limitação.
- Use — para listar.
- Termine com: "Na prática, use X quando... e Y quando..."
- Máximo 4 parágrafos. Português brasileiro. Sem preâmbulos.`,

  'evaluate-challenge': `Você é um avaliador de MBA. O aluno completou um desafio aplicado.
Avalie cada critério de 0 a 100. Seja específico — diga exatamente o que está bom e o que falta.
Use **negrito** nos critérios. No final: **NOTA GERAL: XX/100**. Português brasileiro.`,

  'evaluate-framework': `Você é um consultor estratégico sênior avaliando um framework preenchido.
Avalie: (1) **Completude** (2) **Coerência** entre campos (3) **Profundidade** estratégica.
Seja direto e prático. Máximo 4 parágrafos. Português brasileiro.`,

  'generate-probe': `Você gera perguntas de compreensão para alunos de negócios.
Retorne APENAS a pergunta, sem explicação. Teste compreensão aplicada, não memorização.
Português brasileiro.`,

  'evaluate-probe': `Você avalia respostas de alunos sobre conceitos de negócios.
Avalie se demonstrou compreensão real. 2-3 frases: o que acertou, o que faltou.
Use **negrito** nos pontos-chave. No final: **APROVADO** ou **REVISAR**. Português brasileiro.`,
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TutorRequest
    const { action = 'explain', selectedText, question, submoduleTitle, blockContent, history } = body

    const basePrompt = SYSTEM_PROMPTS[action] || SYSTEM_PROMPTS.explain

    const contextParts: string[] = [basePrompt, `\nTópico atual: "${submoduleTitle}".`]
    if (selectedText) contextParts.push(`\nTexto selecionado pelo aluno: "${selectedText.slice(0, 800)}"`)
    if (blockContent) contextParts.push(`\nConteúdo do bloco que o aluno está lendo (resumo): "${blockContent.slice(0, 1200)}"`)

    const systemPrompt = contextParts.join('')

    const maxTokens = action === 'generate-probe' ? 200
      : action === 'evaluate-probe' ? 400
      : (action === 'deep-dive' || action === 'real-case') ? 1200
      : 900

    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: question },
    ]

    const completion = await getGroq().chat.completions.create({
      model: 'compound-beta',
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
