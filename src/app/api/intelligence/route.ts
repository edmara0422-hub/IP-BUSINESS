import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const EMPTY = {
  panorama: '',
  macro_insights: [] as string[],
  marketing_insights: [] as string[],
  riscos: [] as string[],
  oportunidades: [] as string[],
  cockpit_alerts: [] as string[],
}

let cache: { data: unknown; ts: number; key: string } = { data: null, ts: 0, key: '' }
const CACHE_TTL = 5 * 60 * 1000

export async function POST(request: Request) {
  // Cache diferenciado por perfil do usuário
  const body = await request.json()
  const up = body.userProfile
  const cacheKey = `${up?.subtype ?? ''}_${up?.sectors?.[0] ?? ''}`
  if (cache.data && Date.now() - cache.ts < CACHE_TTL && cache.key === cacheKey) {
    return NextResponse.json(cache.data)
  }
  // Recria request-like object para uso abaixo
  const m = body

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return NextResponse.json(EMPTY)

  try {
    const selic = m.macro?.selic?.value  ?? 14.75
    const ipca  = m.macro?.ipca?.value   ?? 4.14
    const pib   = m.macro?.pib?.value    ?? 1.86
    const usd   = m.macro?.usdBrl?.value ?? 4.98
    const cac   = m.marketing?.cacTrend?.value ?? 120
    const cacD  = m.marketing?.cacTrend?.delta ?? 12
    const cpm   = m.marketing?.cpmGlobal?.value ?? 8.5
    const org   = m.marketing?.organicShare?.value ?? 38
    const taxaReal = (selic - ipca).toFixed(2)
    const cpmBrl   = (cpm * usd).toFixed(0)
    const juros10k = Math.round(10000 * selic * 2.5 / 100 / 12)
    const setores  = m.sectors?.map((s: { label: string; heat: number; change: number }) =>
      `${s.label}: heat ${s.heat}/100, variação ${s.change > 0 ? '+' : ''}${s.change?.toFixed(1)}%`
    ).join(' | ') ?? ''

    // Perfil do usuário (se disponível)
    const up = m.userProfile
    const nomeNeg  = up?.nomeNegocio || up?.nome_negocio || ''
    const fase     = up?.subtype ?? ''
    const setorUser = up?.sectors?.join(', ') ?? ''
    const prodUser  = up?.product?.join(', ') ?? ''
    const revUser   = up?.revenue ?? ''
    const temPerfil = !!(fase || setorUser)

    // Setor do usuário nos dados de mercado
    const sectorMap: Record<string, string> = {
      'Tecnologia': 'tech', 'Consultoria': 'services', 'Agência': 'services',
      'Educação': 'services', 'Saúde': 'health', 'Agro': 'agro',
      'Varejo': 'retail', 'Financeiro': 'fintech', 'Logística': 'logistics',
      'Energia': 'energy',
    }
    const userSectorId = sectorMap[up?.sectors?.[0]] ?? ''
    const userSectorData = m.sectors?.find((s: {id:string; heat:number; change:number}) => s.id === userSectorId)
    const userSectorLine = userSectorData
      ? `Setor do usuário (${setorUser}): heat ${userSectorData.heat}/100, variação ${userSectorData.change > 0 ? '+' : ''}${userSectorData.change?.toFixed(1)}%`
      : ''

    const perfilBlock = temPerfil ? `
PERFIL DO USUÁRIO (personalizar análise para este contexto):
  Nome: ${nomeNeg || 'não informado'}
  Fase: ${fase} | Setor: ${setorUser} | Produto: ${prodUser} | Faturamento: ${revUser}
  ${userSectorLine}
IMPORTANTE: Todos os insights devem ser filtrados pelo setor "${setorUser || 'geral'}" e fase "${fase || 'geral'}". Mencione o setor explicitamente nos insights relevantes.` : ''

    const prompt = `Você é o analista-chefe do IPB (Intelligence Platform Business). Cruze os dados e gere análises PROFUNDAS — nunca genéricas.

DADOS REAIS AGORA:
SELIC: ${selic}% | IPCA: ${ipca}% | PIB: ${pib}% | USD/BRL: R$${usd}
Taxa de juro real: ${taxaReal}% (SELIC − IPCA)
Setores: ${setores}
CAC médio: R$${cac} (${cacD > 0 ? '+' : ''}${cacD}% delta) | CPM: US$${cpm} = R$${cpmBrl} | Orgânico: ${org}%
${perfilBlock}

REGRAS OBRIGATÓRIAS:
1. Cruze SEMPRE 2+ indicadores. Nunca cite um dado sozinho.
2. Use os números exatos acima. Não invente valores.
3. Cada insight: o que está acontecendo + por que + impacto concreto com número.
4. Se há perfil do usuário, FILTRE os insights para o setor e fase dele — seja específico.
5. Riscos: inclua % estimado de PMEs afetadas + "Como lucrar: [ação concreta]".
6. Marketing: dê veredicto "CRESCER AGORA: SIM" ou "CRESCER AGORA: NÃO" e justifique com números.
7. cockpit_alerts: 3 alertas diretos para ${temPerfil ? `empresa ${fase} no setor ${setorUser}` : 'quem tem negócio ativo'} — frase curta + número real.

Responda APENAS JSON válido:
{
  "panorama": "1 frase executiva cruzando macro + setores mais quentes/frios + o que fazer AGORA",
  "macro_insights": [
    "SELIC ${selic}% − IPCA ${ipca}% = juro real ${taxaReal}% — [impacto específico em crédito ou investimento com número]",
    "USD R$${usd} + [setor mais afetado pelos dados] = [impacto calculado em R$]",
    "PIB ${pib}% + [setor com maior heat] = [oportunidade ou risco com número]",
    "SELIC ${selic}% → financiar R$10k/mês custa R$${juros10k} em juros — [recomendação]"
  ],
  "marketing_insights": [
    "CRESCER AGORA: [SIM/NÃO] — CPM US$${cpm} × câmbio R$${usd} = R$${cpmBrl}/mil impressões — [veredicto com número e ação]",
    "CAC R$${cac} subiu ${cacD}% — IPCA ${ipca}% corrói margem — [o que fazer: orgânico vs pago com dado concreto]",
    "Orgânico ${org}% do tráfego — [ação específica para reduzir dependência de tráfego pago]"
  ],
  "riscos": [
    "RISCO 1: [nome direto] — afeta ~[X]% das PMEs brasileiras — Como lucrar: [ação específica com dado]",
    "RISCO 2: [nome direto] — afeta ~[X]% das PMEs brasileiras — Como lucrar: [ação específica com dado]",
    "RISCO 3: [nome direto] — afeta ~[X]% das PMEs brasileiras — Como lucrar: [ação específica com dado]"
  ],
  "oportunidades": [
    "[Setor quente] heat [X]/100 + [dado macro] = janela para [quem] fazer [o quê] agora",
    "[Contexto] + [dado real] = oportunidade estimada de [valor ou % de crescimento] para [perfil]"
  ],
  "cockpit_alerts": [
    "SELIC ${selic}%: financiar seu capital de giro custa R$${juros10k}/mês por cada R$10k — priorize receita antes de captar",
    "IPCA ${ipca}%: sem reajuste de preço este ano, sua margem cai ${ipca} pontos percentuais — reajuste agora",
    "CAC +${cacD}%: seu custo por cliente subiu — calcule se seu LTV ainda justifica o investimento em paid"
  ]
}`

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1200,
        temperature: 0.25,
        response_format: { type: 'json_object' },
      }),
    })

    if (!res.ok) throw new Error(`Groq ${res.status}`)

    const json = await res.json()
    const text  = json.choices?.[0]?.message?.content?.trim() ?? ''
    const match = text.match(/\{[\s\S]*\}/)
    const analysis = JSON.parse(match ? match[0] : text)

    cache = { data: analysis, ts: Date.now(), key: cacheKey }
    return NextResponse.json(analysis)
  } catch (e) {
    console.error('[intelligence]', e)
    return NextResponse.json(EMPTY)
  }
}
