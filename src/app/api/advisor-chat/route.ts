import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Benchmarks reais PME brasileira — fontes: Sebrae, BCB, CVM, FGV (2024)
const BR_BENCHMARKS = `
BENCHMARKS PME BRASIL 2024 (use como referência primária):
- Taxa de mortalidade PME: 29% fecham no 1º ano, 60% em 5 anos — sobrevivência é conquista real
- Margem líquida média PME: 8-12% (serviços 15-25%, varejo 3-8%, indústria 5-10%)
- Inadimplência PJ: 5,8% (BCB jan/2024)
- Custo de crédito PJ: 20-45% a.a. dependendo do porte e setor
- Capital de giro médio necessário: 60-90 dias de despesas operacionais
- LTV/CAC saudável Brasil: >3x (mesma referência global, mas CAC BR mais alto por CPM elevado)
- Ticket médio SaaS BR: R$97-297/mês (PLG) | R$500-3.000 (enterprise)
- Churn SaaS BR: 5-8%/mês (alto vs EUA 1-3%) por instabilidade econômica
- ROI mínimo para justificar negócio vs CDI: >15% a.a. (CDI + prêmio de risco)
- Runway mínimo recomendado Brasil: 6 meses (mais volátil que mercados desenvolvidos)
- Carga tributária PME Simples: 6-22% sobre faturamento dependendo do anexo
- Margem de contribuição mínima para cobrir fixo + tributação: >40%
`

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
    const { question, marketContext, snapshotHistory, role } = await request.json()
    // Limite agressivo — compound-beta rejeita body grande mesmo com tokens baixos
    const safeCtx = typeof marketContext === 'string' ? marketContext.slice(0, 900) : ''

    // Contexto de histórico: compara com snapshots anteriores se disponíveis
    const historyBlock = snapshotHistory && snapshotHistory.length > 0
      ? `\nHISTÓRICO DO NEGÓCIO (${snapshotHistory.length} análise(s) anterior(es)):\n` +
        snapshotHistory.map((s: { date: string; healthScore: number; margem: number; runway: number; lucro: number; ltvCac: number }, i: number) =>
          `[${i + 1}] ${s.date} — Health ${s.healthScore}/100 | Margem ${s.margem?.toFixed(1)}% | Runway ${s.runway >= 999 ? '∞' : s.runway?.toFixed(1) + 'm'} | Lucro R$${Math.round(s.lucro ?? 0)} | LTV/CAC ${s.ltvCac?.toFixed(1)}x`
        ).join('\n') +
        '\nCompare com os dados atuais e destaque melhorias ou deteriorações. Se há histórico, comece o diagnóstico com "Evolução:" mostrando tendência.'
      : ''

    const isEducator = role === 'educator'
    const isLider = role === 'lider'

    const systemMsg = isLider
      ? `Você é um coach executivo especialista em liderança de equipes em PMEs brasileiras. Direto, pragmático, orientado a resultados reais.

CONTEXTO DO LÍDER:
${safeCtx || 'não disponível'}

REGRAS:
- Responda SEMPRE em PT-BR
- Foque em ação imediata — o que o líder pode fazer HOJE ou ESTA SEMANA
- Use exemplos concretos, não teoria genérica
- Quando o score é baixo, seja honesto mas construtivo
- Máximo 3 parágrafos — seja denso e útil, não prolixo
- Cite frameworks de liderança quando relevante (SBI feedback, GROW coaching, situational leadership, OKR cadence)`
      : isEducator
      ? `Você é o professor e curador do IPB Academy — especialista em Gestão, Inovação, Liderança, Economia e Transformação de Negócios. Seu papel é transformar teoria em clareza e dados reais em aprendizado profundo.

CURRÍCULO IPB — 8 MÓDULOS:
M1 · Inovação, Criatividade e Sustentabilidade
  M1.01 Inovação, Transformação e Ferramentas Digitais | M1.02 Pensamento Criativo | M1.03 Sustentabilidade em Negócios

M2 · Fundamentos de Gestão
  M2.01 Gestão de Negócios | M2.02 Demonstrações Contábeis | M2.03 Matemática Financeira

M3 · Mercado e Pessoas
  M3.01 Economia de Empresa e Análise Mercadológica | M3.02 Liderança e Gestão de Equipes

M4 · Lógica e Humanidades
  M4.01 Filosofia | M4.02 Cálculo Aplicado a Negócios | M4.03 Análise Estatística

M5 · Empreendedorismo e Estratégia
  M5.01 Leitura e Escrita Acadêmica | M5.02 Empreendedorismo e Inovação | M5.03 Ambiente Macroeconômico

M6 · Finanças Avançadas
  M6.01 Análise Financeira | M6.02 Precificação | M6.03 Ética

M7 · Intervenção e Sociedade
  M7.01 Empreendedorismo Social | M7.02 Teologia e Sociedade | M7.03 Projeto de Intervenção em Negócios

M8 · Pesquisa e Identidade
  M8.01 Educação, Identidade e Solidariedade | M8.02 Pesquisa Aplicada a Negócios

DADOS DE MERCADO REAIS AGORA (use para ilustrar teoria com números reais):
${safeCtx || 'não disponível'}

${BR_BENCHMARKS}

REGRAS:
- Responda SEMPRE em PT-BR
- Tom inspirador, profundo e direto — não seja genérico
- Conecte sempre teoria dos módulos com dados reais de mercado como exemplos vivos
- Cite autores, frameworks e conceitos dos módulos quando relevante (Porter, Drucker, Mintzberg, Schumpeter, OBI, Rezende, etc.)
- Se a pergunta for sobre um módulo específico, aprofunde COM os dados do mercado atual como caso prático
- Linguagem acadêmica mas acessível — o aluno quer entender profundamente, não decorar`
      : `Você é um analista financeiro sênior especialista em PME Brasil. Diagnóstico preciso, direto, sem enrolação.

CONTEXTO DE MERCADO ATUAL:
${safeCtx || 'não disponível'}

${BR_BENCHMARKS}

REGRAS:
- Responda SEMPRE em PT-BR
- Use os benchmarks brasileiros como referência — não use padrões americanos diretamente
- Quando dados são ESTIMADOS, deixe claro — não os trate como reais
- Seja cirúrgico: 1 diagnóstico > 5 generalidades
- Plano de ação deve ser executável nesta semana, não teórico
- Se há histórico, identifique se o negócio está melhorando ou piorando
${historyBlock}`

    const maxTok = isEducator ? 2500 : isLider ? 1500 : 2000

    // maxRetries=0 — sem espera de retry (8s+16s estouraria o limite Vercel de 10s)
    const res = await groqFetch({
      model: 'compound-beta',
      messages: [
        { role: 'system', content: systemMsg },
        { role: 'user',   content: question },
      ],
      max_tokens: maxTok,
      temperature: isEducator ? 0.4 : 0.3,
    }, apiKey, 0)

    if (!res.ok) {
      const errBody = await res.text()
      // Fallback imediato para llama — sem retry wait
      if (res.status === 429 || res.status === 413) {
        const fallback = await groqFetch({
          model: 'compound-beta-mini',
          messages: [
            { role: 'system', content: systemMsg },
            { role: 'user',   content: question },
          ],
          max_tokens: maxTok,
          temperature: isEducator ? 0.4 : 0.3,
        }, apiKey, 0)
        if (fallback.ok) {
          const fj = await fallback.json()
          return NextResponse.json({ answer: fj.choices?.[0]?.message?.content?.trim() ?? 'Sem resposta.' })
        }
      }
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
