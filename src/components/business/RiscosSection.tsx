'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const RED   = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'

function v(n: number | undefined, fb: number) { return (n != null && Number.isFinite(n)) ? n : fb }

interface CausalChain {
  id: string
  type: 'critical' | 'risk' | 'opportunity'
  title: string
  urgency: number
  why: string
  influence: string[]
  effects: string[]
  affected: string
  action: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildCausalChains(data: any): CausalChain[] {
  const chains: CausalChain[] = []
  const selic  = v(data.macro.selic?.value, 10.5)
  const ipca   = v(data.macro.ipca?.value, 4.8)
  const pib    = v(data.macro.pib?.value, 2.9)
  const usd    = v(data.macro.usdBrl?.value, 5.72)
  const creditAff = data.centralProblems?.find((p:{id:string}) => p.id === 'credit')?.affected ?? 47
  const marginAff = data.centralProblems?.find((p:{id:string}) => p.id === 'margin')?.affected ?? 68
  const cacAff    = data.centralProblems?.find((p:{id:string}) => p.id === 'cac')?.affected ?? 54
  const talentAff = data.centralProblems?.find((p:{id:string}) => p.id === 'talent')?.affected ?? 41
  const aiAff     = data.centralProblems?.find((p:{id:string}) => p.id === 'ai')?.affected ?? 38

  const gold    = v(data.commodities?.gold?.value, 2840)
  const oil     = v(data.commodities?.oil?.value, 74.2)
  const goldD   = v(data.commodities?.gold?.delta, 0.4)
  const oilD    = v(data.commodities?.oil?.delta, -0.8)

  const cpmGlobal   = v(data.marketing?.cpmGlobal?.value, 11.3)
  const cpmDelta    = v(data.marketing?.cpmGlobal?.delta, 2.4)
  const cacTrend    = v(data.marketing?.cacTrend?.value, 48.6)
  const organicShr  = v(data.marketing?.organicShare?.value, 31)
  const videoShr    = v(data.marketing?.videoShare?.value, 72)
  const aiAdoption  = v(data.marketing?.aiAdoption?.value, 64)

  const metaPlat   = data.platforms?.find((p:{id:string}) => p.id === 'meta_ads')
  const googlePlat = data.platforms?.find((p:{id:string}) => p.id === 'google_ads')
  const tiktokPlat = data.platforms?.find((p:{id:string}) => p.id === 'tiktok')
  const metaCPM    = metaPlat?.cpm ?? 14.2
  const metaCPMD   = metaPlat?.cpmDelta ?? 3.8
  const googleCPC  = googlePlat?.cpc ?? 2.84
  const tiktokCPM  = tiktokPlat?.cpm ?? 6.8
  const tiktokCPMD = tiktokPlat?.cpmDelta ?? -5.2

  const sectorRetail = data.sectors?.find((s:{id:string}) => s.id === 'retail')
  const sectorMedia  = data.sectors?.find((s:{id:string}) => s.id === 'media')
  const sectorTech   = data.sectors?.find((s:{id:string}) => s.id === 'tech')
  const sectorAgro   = data.sectors?.find((s:{id:string}) => s.id === 'agro')

  // ── SELIC ──
  if (selic > 10) chains.push({
    id: 'selic', type: selic > 13 ? 'critical' : 'risk',
    title: `SELIC ${selic.toFixed(1)}% — crédito travado, caixa pressionado`,
    urgency: Math.min(95, Math.round(selic * 6)),
    why: `O Banco Central mantém a SELIC em ${selic.toFixed(1)}% para conter o IPCA (${ipca.toFixed(2)}% vs meta de 3.25%). A lógica: juros altos encarecem o crédito, reduzem consumo e derrubam a inflação. O problema é que o remédio dói na economia real antes de curar a inflação.`,
    influence: [
      `IPCA acima da meta (${ipca.toFixed(2)}%) obriga o BC a agir — sem isso, a inflação desancoraria as expectativas`,
      `Dólar R$${usd.toFixed(2)} importa inflação via combustíveis, insumos e eletrônicos`,
      `Incerteza fiscal brasileira mantém prêmio de risco elevado — investidor exige taxa maior para financiar o governo`,
      `Fed americano ainda restritivo — capital estrangeiro prefere dólar a mercados emergentes`,
    ],
    effects: [
      `${creditAff}% das PMEs sem acesso a crédito viável — financiamento bancário pode custar 30-50% a.a.`,
      `Custo financeiro da empresa sobe direto: dívida existente fica mais cara ao renovar`,
      `Consumidor com dívida (cartão, financiamento) paga mais → reduz gastos discricionários`,
      `Varejo físico e construtoras sofrem primeiro — produto depende de financiamento do cliente`,
      `Capital sai de risco (startups, bolsa) para renda fixa (CDI+): funding para inovação encarece`,
      `${marginAff}% das empresas com margem comprimida — impossível repassar custo sem perder cliente`,
    ],
    affected: `Varejo, construtoras, fintechs de crédito, PMEs endividadas, startups dependentes de funding e consumidores com financiamentos ativos.`,
    action: `Liquidar dívida de curto prazo agora (antes de renovar com taxa maior). Negociar prazos mais longos com fornecedores. Alocar caixa ocioso em CDI/Tesouro SELIC. Cortar gastos não-essenciais para preservar liquidez. Evitar expansão alavancada.`,
  })

  // ── IPCA ──
  if (ipca > 4) chains.push({
    id: 'ipca', type: ipca > 6 ? 'critical' : 'risk',
    title: `Inflação IPCA ${ipca.toFixed(2)}% — poder de compra erodindo`,
    urgency: Math.min(88, Math.round(ipca * 14)),
    why: `O IPCA em ${ipca.toFixed(2)}% supera a meta do BC. A pressão vem de três frentes simultâneas: câmbio alto que encarece importados (combustível, eletrônicos, matéria-prima), frete caro que contamina toda a cadeia, e demanda ainda aquecida pelo PIB de ${pib.toFixed(1)}% que impede preços de cair.`,
    influence: [
      `Dólar R$${usd.toFixed(2)}: cada 10% de alta no câmbio adiciona ~0.5pp no IPCA via importados`,
      `Petróleo US$${oil.toFixed(1)}/bbl (${oilD >= 0 ? '+' : ''}${oilD.toFixed(1)}%): combustível afeta frete, que afeta quase tudo`,
      `PIB crescendo ${pib.toFixed(1)}% mantém demanda aquecida — difícil derrubar preços sem recessão`,
      `Energia elétrica: bandeiras tarifárias e custo hídrico pressionam conta de luz de empresas e famílias`,
    ],
    effects: [
      `Ticket médio real cai mesmo com preço nominal subindo — cliente compra menos unidades`,
      `Classe C e D reduzem consumo discricionário: roupas, lazer, alimentação fora de casa`,
      `${marginAff}% das empresas não conseguem repassar custos sem perder cliente — margem comprime`,
      `Contratos indexados ao IPCA encarecem: aluguel, contratos de fornecimento, SLAs anuais`,
      `Expectativas de inflação desancorando → BC pode subir SELIC ainda mais → ciclo vicioso`,
    ],
    affected: `Todo o varejo de bens não-essenciais, serviços premium, restaurantes, empresas com cadeia importada e contratos reajustados por índices de inflação.`,
    action: `Renegociar contratos anuais com fornecedores antes do reajuste. Revisar mix de produtos priorizando margens maiores. Comunicar valor, não só preço. Considerar precificação dinâmica. Reavaliar contratos indexados ao IPCA na renovação.`,
  })

  // ── CÂMBIO ──
  if (usd > 5.3) chains.push({
    id: 'cambio', type: usd > 6 ? 'critical' : 'risk',
    title: `Dólar R$${usd.toFixed(2)} — insumos e tecnologia mais caros`,
    urgency: Math.min(80, Math.round(usd * 11)),
    why: `O real está desvalorizado estruturalmente. O Federal Reserve americano mantém juros altos, atraindo capital global para o dólar. Somado ao risco fiscal brasileiro e déficit em conta corrente, o câmbio permanece pressionado. Não é evento passageiro — é tendência enquanto o cenário externo não mudar.`,
    influence: [
      `Fed com juros altos atrai dólares para os EUA — emerging markets perdem capital`,
      `Risco fiscal doméstico eleva CDS do Brasil → investidor estrangeiro exige mais para emprestar`,
      `Commodities em dólar: ${goldD >= 0 ? 'ouro subindo' : 'ouro caindo'} US$${gold.toFixed(0)}/oz — exportadores brasileiros se beneficiam`,
      `Balança comercial: agro exportador compensa parcialmente o déficit — limita a desvalorização`,
    ],
    effects: [
      `Tecnologia (SaaS em dólar, hardware, servidores AWS/GCP/Azure) encarece diretamente`,
      `Insumos importados: químicos, eletrônicos, matéria-prima industrial — cadeia toda afetada`,
      `Combustível importado contamina frete → custo logístico de toda a operação sobe`,
      `IPCA permanece elevado por inflação importada → BC mantém SELIC alta → ciclo retroalimenta`,
      `Empresas com dívida em dólar ou contratos em moeda estrangeira têm passivo crescendo`,
      `Exportadores (agro, mineração, tech) ganham competitividade — efeito positivo para eles`,
    ],
    affected: `Empresas de tecnologia com custos em dólar, e-commerce com estoque importado, indústria com insumos internacionais, empresas com dívida em moeda estrangeira.`,
    action: `Mapear toda a exposição cambial (custo + receita). Contratar hedge (NDF ou opção) para contratos futuros em dólar. Priorizar fornecedores nacionais. Negociar prazo maior de pagamento no exterior. Considerar precificação atrelada ao dólar se produto/serviço tem concorrência importada.`,
  })

  // ── CAC / Plataformas ──
  if (cacAff > 40) chains.push({
    id: 'cac', type: 'risk',
    title: `CAC subindo — Meta +R$${metaCPMD.toFixed(1)} CPM, Google CPC R$${googleCPC.toFixed(2)}`,
    urgency: cacAff,
    why: `O CAC médio brasileiro está em R$${cacTrend.toFixed(0)} e subindo. Meta (CPM R$${metaCPM.toFixed(1)}) e Google (CPC R$${googleCPC.toFixed(2)}) aumentaram preços de leilão com mais anunciantes competindo pelo mesmo inventário. A degradação do iOS 14.5 (rastreamento limitado) reduziu a eficiência da segmentação — mais verba desperdiçada para o mesmo resultado.`,
    influence: [
      `Meta CPM subiu ${metaCPMD.toFixed(1)}% — mais anunciantes, mesmo inventário de atenção`,
      `Google CPC em keywords competitivas cresceu 15-30% por conta de leilão mais acirrado`,
      `iOS 14.5+ limitou rastreamento → segmentação menos precisa → desperdício de verba maior`,
      `${videoShr.toFixed(0)}% do engajamento em vídeo → anúncios estáticos perdem eficiência`,
      `TikTok CPM em R$${tiktokCPM.toFixed(1)} (${tiktokCPMD.toFixed(1)}%) — janela de arbitragem aberta`,
    ],
    effects: [
      `${cacAff}% das empresas com CAC 20-40% mais alto que 2 anos atrás`,
      `Ratio LTV/CAC deteriora → rentabilidade por cliente cai → unit economics piora`,
      `Startups dependentes de paid traffic com runway encurtado`,
      `${organicShr.toFixed(0)}% de tráfego orgânico — cada ponto a menos aumenta dependência de paid`,
      `Budget de marketing para o mesmo número de clientes aumenta proportionally`,
    ],
    affected: `E-commerce, SaaS B2C, apps de consumo, marketplaces e qualquer negócio dependente de mídia paga para aquisição de clientes.`,
    action: `Testar TikTok Ads agora (CPM baixo = janela de 3-6 meses). Investir em SEO e conteúdo orgânico para reduzir dependência. Ativar programa de indicação para aquisição por referral (CAC quase zero). Focar em retenção para aumentar LTV. Revisar segmentação de campanhas com mais dados first-party.`,
  })

  // ── Talento ──
  if (talentAff > 35) chains.push({
    id: 'talent', type: 'risk',
    title: `Talento escasso e caro — ${talentAff}% das empresas impactadas`,
    urgency: talentAff,
    why: `O mercado de tecnologia e gestão está aquecido. Programadores, analistas de dados, gestores de produto e profissionais de marketing digital estão em demanda maior que a oferta. Com trabalho remoto global, talentos brasileiros competem por vagas em dólar/euro — o salário médio do mercado local sobe para reter.`,
    influence: [
      `Mercado global de tech recruta no Brasil em dólar — eleva piso salarial local`,
      `IA ainda não substitui completamente posições estratégicas — aumenta valor de quem domina`,
      `${aiAdoption.toFixed(0)}% das empresas adotando IA → demanda por profissionais de IA exploode`,
      `Inflação corrói poder de compra → colaborador exige mais para manter padrão de vida`,
    ],
    effects: [
      `Folha de pagamento sobe mesmo sem contratar — revisão salarial para reter quem já tem`,
      `Turnover alto = custo de substituição (recrutamento, onboarding, ramp-up) → 1-3 salários por saída`,
      `Produtividade cai durante transição → projetos atrasam → receita impactada indiretamente`,
      `Startups perdem para grandes empresas na guerra por talento por não ter benefícios equivalentes`,
    ],
    affected: `Empresas de tecnologia, agências digitais, fintechs, consultorias e qualquer empresa com times de produto, dados ou engenharia.`,
    action: `Investir em cultura e ambiente antes de salário. Criar plano de carreira claro. Oferecer flexibilidade real (não só no papel). Usar IA para aumentar produtividade do time atual. Contratar sêniores que multiplicam juniors em vez de só contratar juniors.`,
  })

  // ── IA Disrupting ──
  if (aiAff > 30) chains.push({
    id: 'ai_risk', type: 'risk',
    title: `IA disruptando setores — ${aiAff}% das empresas não preparadas`,
    urgency: aiAff,
    why: `Modelos de IA generativa (GPT-4, Claude, Gemini) já executam tarefas que antes exigiam times inteiros: criação de conteúdo, análise de dados, atendimento ao cliente, código. Empresas que não se adaptarem perdem para concorrentes com estrutura de custo 30-60% menor.`,
    influence: [
      `${aiAdoption.toFixed(0)}% das empresas já usam IA no marketing — quem não usa perde competitividade`,
      `Custo de infraestrutura de IA caiu 10x em 2 anos — acessível para PMEs agora`,
      `Regulação ainda incipiente — janela aberta antes de compliance obrigatório`,
      `Concorrentes internacionais já operam com IA — mercado se ajusta rapidamente`,
    ],
    effects: [
      `Conteúdo de marketing gerado por IA custa 60% menos — agências tradicionais sem posicionamento perdem clientes`,
      `Atendimento automatizado com qualidade humana → custo de CS cai drasticamente`,
      `Análise de dados e BI que antes custava time de data engineers → automatizável`,
      `Novas competências viram obrigatórias: prompt engineering, IA ops, data literacy`,
    ],
    affected: `Agências de conteúdo, call centers, analistas de dados júnior, redatores sem especialização, e qualquer papel baseado em tarefas repetitivas de conhecimento.`,
    action: `Adotar IA imediatamente em conteúdo e atendimento (ROI rápido). Treinar time em ferramentas (Claude, ChatGPT, Midjourney). Reposicionar profissionais afetados para funções de supervisão de IA. Criar vantagem competitiva baseada em dados proprietários que a IA não tem acesso.`,
  })

  // ── Setores em queda ──
  if (sectorRetail && sectorRetail.change < 0) chains.push({
    id: 'retail_decline', type: sectorRetail.change < -20 ? 'critical' : 'risk',
    title: `Varejo tradicional em queda (${sectorRetail.change.toFixed(1)}% YTD) — modelo sob pressão`,
    urgency: Math.min(75, Math.abs(Math.round(sectorRetail.change * 1.5))),
    why: `O varejo físico tradicional enfrenta tripla pressão: e-commerce roubando participação, custo fixo alto (aluguel, folha) que não cai com a demanda, e consumidor mais exigente por experiência e preço. O modelo de "loja como estoque" está obsoleto.`,
    influence: [
      `E-commerce cresceu — consumidor compara preço em segundos e compra online com entrega no dia seguinte`,
      `SELIC alta reduziu crédito ao consumo — parcelamento fica mais caro para o cliente`,
      `Plataformas como Shopee e Shein competem com preço que o varejo nacional não consegue bater`,
      `Aluguel de ponto comercial sobe por IGPM — custo fixo corrói margem mesmo sem vender menos`,
    ],
    effects: [
      `Margens comprimem: não consegue baixar preço (vs. e-commerce) nem subir (vs. concorrência)`,
      `Lojas físicas viram showroom não remunerado — cliente vê ao vivo e compra online`,
      `Devolução e troca aumentam com omnichannel mal executado`,
      `Redução de tamanho de lojas ou fechamento de unidades não rentáveis`,
    ],
    affected: `Redes de varejo físico, shopping centers, franquias de moda e eletrônicos, distribuidores que dependem do varejo como canal.`,
    action: `Transformar loja em experiência (o que e-commerce não pode oferecer). Integrar estoque online com físico. Usar dados de CRM para personalizar atendimento. Renegociar aluguéis agressivamente. Avaliar formato de loja menor com maior giro.`,
  })

  if (sectorMedia && sectorMedia.change < -20) chains.push({
    id: 'media_decline', type: 'risk',
    title: `Mídia impressa −${Math.abs(sectorMedia.change).toFixed(1)}% — setor em colapso estrutural`,
    urgency: Math.min(65, Math.abs(Math.round(sectorMedia.change))),
    why: `A mídia impressa enfrenta colapso estrutural irreversível. Anunciantes migraram para digital (mensurável, segmentado, mais barato). Leitores migraram para redes sociais e agregadores. Não é crise de demanda — é obsolescência de modelo de negócio.`,
    influence: [
      `Meta e Google capturam 70%+ do budget de publicidade digital`,
      `Newsletter e podcasts substituem jornalismo impresso com custo de produção 90% menor`,
      `Geração Z não consome mídia impressa — base leitora envelhece sem reposição`,
    ],
    effects: [
      `Redação profissional encolhe → qualidade do jornalismo de referência cai`,
      `Espaço deixado por jornalismo local abre para desinformação`,
      `Profissionais de comunicação migram para conteúdo digital e marketing de conteúdo`,
    ],
    affected: `Jornais, revistas, distribuidores de mídia impressa e anunciantes que ainda dependem de mídia offline como principal canal.`,
    action: `Não anunciar em mídia impressa como canal principal. Redirecionar budget para digital. Avaliar parcerias com veículos digitais de nicho com audiência qualificada.`,
  })

  // ── PIB (oportunidade) ──
  if (pib > 2) chains.push({
    id: 'pib', type: 'opportunity',
    title: `PIB ${pib.toFixed(1)}% — janela de expansão ativa`,
    urgency: Math.min(85, Math.round(pib * 20)),
    why: `A economia brasileira cresce ${pib.toFixed(1)}%, acima da média histórica. Agro em expansão, serviços aquecidos e mercado de trabalho formal criando vagas sustentam o crescimento. O consumo das famílias está positivo apesar dos juros altos.`,
    influence: [
      `Agro ${sectorAgro ? sectorAgro.change.toFixed(1) : '+28'}% gera renda para o interior e aquece mercados regionais`,
      `Mercado formal empregando mais → massa salarial sobe → consumo segue`,
      `Crédito consignado e FGTS ativo sustentam consumo mesmo com SELIC alta`,
      `Tech & IA ${sectorTech ? sectorTech.change.toFixed(1) : '+34'}% puxando inovação e produtividade`,
    ],
    effects: [
      `Mais renda circulando → CAC tende a cair em setores essenciais`,
      `Confiança empresarial sobe → M&A, franquias e expansões se viabilizam`,
      `Risco: crescimento pode pressionar IPCA se demanda superar oferta`,
    ],
    affected: `Varejo essencial, serviços, agritech, logística, construção civil e educação corporativa.`,
    action: `Janela para expansão geográfica antes de ciclo de alta de juros encerrar crescimento. Investir em brand building. Construir reserva para a próxima desaceleração. Aproveitar para renegociar contratos de fornecimento com volumes maiores.`,
  })

  // ── TikTok CPM ──
  chains.push({
    id: 'tiktok_opp', type: 'opportunity',
    title: `TikTok CPM R$${tiktokCPM.toFixed(1)} (${tiktokCPMD.toFixed(1)}%) — janela de aquisição barata`,
    urgency: 82,
    why: `TikTok tem CPM significativamente menor que Meta (R$${metaCPM.toFixed(1)}) e Google. Enquanto outras plataformas encarecem, TikTok ainda está em fase de crescimento de inventário de anúncios — mais espaço do que anunciantes. Essa janela fecha quando mais empresas perceberem a oportunidade.`,
    influence: [
      `TikTok ainda conquistando anunciantes brasileiros — leilão menos acirrado`,
      `Formato de vídeo curto alinhado com ${videoShr.toFixed(0)}% do engajamento digital`,
      `Algoritmo distribui conteúdo orgânico melhor que outras plataformas — amplifica anúncio com orgânico`,
      `Base de usuários crescendo, especialmente 18-35 anos com poder de compra`,
    ],
    effects: [
      `CPM 50-60% menor que Meta na mesma audiência → ROAS potencialmente maior`,
      `Marca que entrar agora constrói audiência orgânica antes da plataforma saturar`,
      `Primeiros a testar formatos novos aprendem curva antes dos concorrentes`,
    ],
    affected: `Qualquer empresa com produto visual, massa, ou voltado para público jovem — moda, alimentos, tecnologia, serviços de consumo.`,
    action: `Alocar 10-20% do budget de paid para TikTok agora. Produzir conteúdo nativo (não reutilizar criativos de outras plataformas). Testar por 30 dias com meta de ROAS > 2x. Se funcionar, escalar antes de competição aumentar.`,
  })

  // ── IA em conteúdo ──
  chains.push({
    id: 'ai_content', type: 'opportunity',
    title: `IA cortando custo de conteúdo em 60% — vantagem competitiva real`,
    urgency: 76,
    why: `Ferramentas como Claude, ChatGPT, Midjourney e Sora permitem produzir conteúdo de qualidade com fração do custo e tempo anterior. Empresa que adotar agora opera com estrutura 30-60% mais eficiente que concorrente tradicional.`,
    influence: [
      `${aiAdoption.toFixed(0)}% das empresas já usam IA — quem não usa perde velocidade de produção`,
      `Custo de tokens de IA caiu 100x nos últimos 2 anos — escalar conteúdo ficou acessível`,
      `Regulação ainda não exige declaração de conteúdo gerado por IA — janela legal aberta`,
    ],
    effects: [
      `Time de marketing produz 5-10x mais conteúdo sem contratar mais gente`,
      `Testes A/B mais rápidos → otimização de campanha mais ágil → melhor ROI`,
      `SEO: mais conteúdo indexado → mais tráfego orgânico → redução de dependência de paid`,
    ],
    affected: `Agências, equipes de marketing interno, e-commerce com catálogo grande e qualquer empresa que produz conteúdo regularmente.`,
    action: `Adotar Claude/ChatGPT para rascunho de conteúdo imediatamente. Treinar time em prompts. Criar processo de revisão humana para qualidade. Liberar time para estratégia ao invés de execução repetitiva.`,
  })

  // ── Agro B2B ──
  if (sectorAgro && sectorAgro.change > 20) chains.push({
    id: 'agro_b2b', type: 'opportunity',
    title: `Agro ${sectorAgro.change.toFixed(1)}% — oportunidade B2B em agritech`,
    urgency: 58,
    why: `O agronegócio brasileiro cresce consistentemente e está em processo de digitalização. Produtores rurais modernos adotam tecnologia para gestão, monitoramento, logística e financiamento. Mercado B2B com ticket alto e baixo churn.`,
    influence: [
      `Brasil é maior exportador de várias commodities — agro tem dólares para investir em tech`,
      `Digitalização do campo ainda incipiente — espaço enorme para primeiros entrantes`,
      `Governo com linhas de crédito subsidiadas para agritech via BNDES e fundos setoriais`,
    ],
    effects: [
      `Empresas que entram agora constroem base instalada com baixo custo de aquisição`,
      `Contrato B2B com fazendeiro: ticket alto, relacionamento longo, baixa rotatividade`,
      `Oportunidade de cross-sell ampla: de insumos a financiamento, de drone a ERP rural`,
    ],
    affected: `Startups de agritech, SaaS de gestão rural, fintechs de crédito rural, logística agrícola e marketplaces de insumos.`,
    action: `Mapear dor específica do produtor (não genérica). Parceria com cooperativas como canal de distribuição. Produto simples que funciona offline — conectividade ainda é barreira no campo.`,
  })

  return chains.sort((a, b) => b.urgency - a.urgency)
}

function CausalCard({ chain, index }: { chain: CausalChain; index: number }) {
  const [open, setOpen] = useState(index === 0)
  const col = chain.type === 'critical' ? RED : chain.type === 'risk' ? AMBER : GREEN
  const typeLabel = chain.type === 'critical' ? 'CRÍTICO' : chain.type === 'risk' ? 'RISCO' : 'OPORT.'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
      className="rounded-lg overflow-hidden"
      style={{ border: `1px solid ${col}${open ? '40' : '1a'}`, background: open ? `${col}05` : 'rgba(0,0,0,0.2)' }}>

      <div className="h-[2px] relative" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <motion.div className="absolute left-0 top-0 h-full" style={{ background: col }}
          initial={{ width: 0 }} animate={{ width: `${chain.urgency}%` }}
          transition={{ duration: 1.4, delay: index * 0.06, ease: 'easeOut' }} />
      </div>

      <button className="w-full flex items-center gap-3 px-4 py-3 text-left" onClick={() => setOpen(o => !o)}>
        <motion.span className="font-mono text-[7px] font-bold tracking-[0.18em] px-2 py-1 rounded-sm shrink-0"
          style={{ background: `${col}15`, color: col, border: `1px solid ${col}30` }}
          animate={{ opacity: chain.type === 'critical' ? [1, 0.35, 1] : 1 }}
          transition={{ duration: 1, repeat: Infinity }}>
          {typeLabel}
        </motion.span>
        <p className="text-[12px] font-semibold text-white/75 flex-1 text-left">{chain.title}</p>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[12px] font-bold" style={{ color: col }}>{chain.urgency}%</span>
          <span className="text-white/20 text-[10px]">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="overflow-hidden">
            <div className="px-4 pb-4 border-t" style={{ borderColor: `${col}15` }}>

              <div className="mt-3 rounded-sm p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-white/25 block mb-1.5">POR QUE ESTÁ ACONTECENDO</span>
                <p className="text-[11px] text-white/55 leading-relaxed">{chain.why}</p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-white/20 block mb-2">O QUE INFLUENCIA</span>
                  <div className="flex flex-col gap-1.5">
                    {chain.influence.map((inf, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="shrink-0 mt-1 h-1 w-1 rounded-full" style={{ background: col, opacity: 0.5 }} />
                        <span className="text-[10px] text-white/40 leading-relaxed">{inf}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-white/20 block mb-2">EFEITOS EM CASCATA</span>
                  <div className="flex flex-col gap-1.5">
                    {chain.effects.map((ef, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="font-mono text-[9px] shrink-0 mt-0.5 leading-none" style={{ color: col }}>→</span>
                        <span className="text-[10px] text-white/45 leading-relaxed">{ef}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-sm p-2.5" style={{ background: `${RED}08`, border: `1px solid ${RED}15` }}>
                  <span className="font-mono text-[7px] font-bold tracking-[0.2em] block mb-1" style={{ color: RED }}>QUEM É AFETADO</span>
                  <p className="text-[10px] text-white/40 leading-relaxed">{chain.affected}</p>
                </div>
                <div className="rounded-sm p-2.5" style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}15` }}>
                  <span className="font-mono text-[7px] font-bold tracking-[0.2em] block mb-1" style={{ color: GREEN }}>AÇÃO RECOMENDADA</span>
                  <p className="text-[10px] text-white/40 leading-relaxed">{chain.action}</p>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RiscosSection({ data }: { data: any }) {
  const chains = useMemo(() => buildCausalChains(data), [data])
  const [filter, setFilter] = useState<'all' | 'critical' | 'risk' | 'opportunity'>('all')

  const criticos  = chains.filter(c => c.type === 'critical')
  const riscos    = chains.filter(c => c.type === 'risk')
  const oports    = chains.filter(c => c.type === 'opportunity')

  const selic = v(data.macro.selic?.value, 10.5)
  const ipca  = v(data.macro.ipca?.value, 4.8)
  const pib   = v(data.macro.pib?.value, 2.9)
  const usd   = v(data.macro.usdBrl?.value, 5.72)

  const filtered = filter === 'all' ? chains
    : filter === 'critical' ? criticos
    : filter === 'risk' ? riscos
    : oports

  return (
    <div className="flex flex-col gap-5 px-4 pb-8">

      <div className="flex items-center gap-2">
        <motion.div className="h-1.5 w-1.5 rounded-full" style={{ background: RED }}
          animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.9, repeat: Infinity }} />
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-white/20">
          Análise Causal — O que está acontecendo e por quê
        </span>
      </div>

      {/* Snapshot macro */}
      <div className="rounded-lg p-3 grid grid-cols-4 gap-3" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { label: 'SELIC', val: `${selic.toFixed(1)}%`, status: selic > 13 ? 'critical' : selic > 10 ? 'risk' : 'ok' },
          { label: 'IPCA',  val: `${ipca.toFixed(2)}%`, status: ipca > 6 ? 'critical' : ipca > 4 ? 'risk' : 'ok' },
          { label: 'PIB',   val: `+${pib.toFixed(1)}%`, status: pib > 2 ? 'ok' : pib > 0 ? 'risk' : 'critical' },
          { label: 'USD',   val: `R$${usd.toFixed(2)}`, status: usd > 6 ? 'critical' : usd > 5.3 ? 'risk' : 'ok' },
        ].map(m => {
          const c = m.status === 'critical' ? RED : m.status === 'risk' ? AMBER : GREEN
          return (
            <div key={m.label} className="flex flex-col items-center gap-1">
              <span className="font-mono text-[8px] text-white/25 tracking-widest">{m.label}</span>
              <span className="font-mono text-[18px] font-bold" style={{ color: c }}>{m.val}</span>
              <div className="h-[2px] w-8 rounded-full" style={{ background: c, opacity: 0.5 }} />
            </div>
          )
        })}
      </div>

      {/* Contadores + filtro */}
      <div className="flex items-center gap-2 flex-wrap">
        {([
          { key: 'all',         label: 'Todos',       count: chains.length,    col: 'rgba(255,255,255,0.3)' },
          { key: 'critical',    label: 'Críticos',    count: criticos.length,  col: RED },
          { key: 'risk',        label: 'Riscos',      count: riscos.length,    col: AMBER },
          { key: 'opportunity', label: 'Oportunidades', count: oports.length,  col: GREEN },
        ] as const).map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className="flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 transition-all"
            style={{
              background: filter === f.key ? `${f.col}15` : 'rgba(0,0,0,0.2)',
              border: `1px solid ${filter === f.key ? f.col + '50' : 'rgba(255,255,255,0.06)'}`,
            }}>
            <span className="font-mono text-[9px] font-bold" style={{ color: filter === f.key ? f.col : 'rgba(255,255,255,0.3)' }}>{f.label}</span>
            <span className="font-mono text-[8px] rounded-full px-1.5 py-0.5" style={{ background: `${f.col}20`, color: f.col }}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2">
        {filtered.map((c, i) => <CausalCard key={c.id} chain={c} index={i} />)}
      </div>

    </div>
  )
}
