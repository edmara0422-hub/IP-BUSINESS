'use client'

import { useMemo, useState, useEffect } from 'react'
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
  modules: string[]
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
    title: `SELIC ${selic.toFixed(1)}% — credito travado, caixa pressionado`,
    urgency: Math.min(95, Math.round(selic * 6)),
    why: `O Banco Central mantem a SELIC em ${selic.toFixed(1)}% para conter o IPCA (${ipca.toFixed(2)}% vs meta de 3.25%). A logica: juros altos encarecem o credito, reduzem consumo e derrubam a inflacao. O problema e que o remedio doi na economia real antes de curar a inflacao.`,
    influence: [
      `IPCA acima da meta (${ipca.toFixed(2)}%) obriga o BC a agir — sem isso, a inflacao desancoraria as expectativas`,
      `Dolar R$${usd.toFixed(2)} importa inflacao via combustiveis, insumos e eletronicos`,
      `Incerteza fiscal brasileira mantem premio de risco elevado — investidor exige taxa maior para financiar o governo`,
      `Fed americano ainda restritivo — capital estrangeiro prefere dolar a mercados emergentes`,
    ],
    effects: [
      `${creditAff}% das PMEs sem acesso a credito viavel — financiamento bancario pode custar 30-50% a.a.`,
      `Custo financeiro da empresa sobe direto: divida existente fica mais cara ao renovar`,
      `Consumidor com divida (cartao, financiamento) paga mais → reduz gastos discricionarios`,
      `Varejo fisico e construtoras sofrem primeiro — produto depende de financiamento do cliente`,
      `Capital sai de risco (startups, bolsa) para renda fixa (CDI+): funding para inovacao encarece`,
      `${marginAff}% das empresas com margem comprimida — impossivel repassar custo sem perder cliente`,
    ],
    affected: `Varejo, construtoras, fintechs de credito, PMEs endividadas, startups dependentes de funding e consumidores com financiamentos ativos.`,
    action: `Liquidar divida de curto prazo agora (antes de renovar com taxa maior). Negociar prazos mais longos com fornecedores. Alocar caixa ocioso em CDI/Tesouro SELIC. Cortar gastos nao-essenciais para preservar liquidez. Evitar expansao alavancada.`,
    modules: ['Cenarios & Forecast', 'Cockpit Financeiro'],
  })

  // ── IPCA ──
  if (ipca > 4) chains.push({
    id: 'ipca', type: ipca > 6 ? 'critical' : 'risk',
    title: `Inflacao IPCA ${ipca.toFixed(2)}% — poder de compra erodindo`,
    urgency: Math.min(88, Math.round(ipca * 14)),
    why: `O IPCA em ${ipca.toFixed(2)}% supera a meta do BC. A pressao vem de tres frentes simultaneas: cambio alto que encarece importados (combustivel, eletronicos, materia-prima), frete caro que contamina toda a cadeia, e demanda ainda aquecida pelo PIB de ${pib.toFixed(1)}% que impede precos de cair.`,
    influence: [
      `Dolar R$${usd.toFixed(2)}: cada 10% de alta no cambio adiciona ~0.5pp no IPCA via importados`,
      `Petroleo US$${oil.toFixed(1)}/bbl (${oilD >= 0 ? '+' : ''}${oilD.toFixed(1)}%): combustivel afeta frete, que afeta quase tudo`,
      `PIB crescendo ${pib.toFixed(1)}% mantem demanda aquecida — dificil derrubar precos sem recessao`,
      `Energia eletrica: bandeiras tarifarias e custo hidrico pressionam conta de luz de empresas e familias`,
    ],
    effects: [
      `Ticket medio real cai mesmo com preco nominal subindo — cliente compra menos unidades`,
      `Classe C e D reduzem consumo discricionario: roupas, lazer, alimentacao fora de casa`,
      `${marginAff}% das empresas nao conseguem repassar custos sem perder cliente — margem comprime`,
      `Contratos indexados ao IPCA encarecem: aluguel, contratos de fornecimento, SLAs anuais`,
      `Expectativas de inflacao desancorando → BC pode subir SELIC ainda mais → ciclo vicioso`,
    ],
    affected: `Todo o varejo de bens nao-essenciais, servicos premium, restaurantes, empresas com cadeia importada e contratos reajustados por indices de inflacao.`,
    action: `Renegociar contratos anuais com fornecedores antes do reajuste. Revisar mix de produtos priorizando margens maiores. Comunicar valor, nao so preco. Considerar precificacao dinamica. Reavaliar contratos indexados ao IPCA na renovacao.`,
    modules: ['Smart Pricing', 'Cockpit Financeiro'],
  })

  // ── CÂMBIO ──
  if (usd > 5.3) chains.push({
    id: 'cambio', type: usd > 6 ? 'critical' : 'risk',
    title: `Dolar R$${usd.toFixed(2)} — insumos e tecnologia mais caros`,
    urgency: Math.min(80, Math.round(usd * 11)),
    why: `O real esta desvalorizado estruturalmente. O Federal Reserve americano mantem juros altos, atraindo capital global para o dolar. Somado ao risco fiscal brasileiro e deficit em conta corrente, o cambio permanece pressionado. Nao e evento passageiro — e tendencia enquanto o cenario externo nao mudar.`,
    influence: [
      `Fed com juros altos atrai dolares para os EUA — emerging markets perdem capital`,
      `Risco fiscal domestico eleva CDS do Brasil → investidor estrangeiro exige mais para emprestar`,
      `Commodities em dolar: ${goldD >= 0 ? 'ouro subindo' : 'ouro caindo'} US$${gold.toFixed(0)}/oz — exportadores brasileiros se beneficiam`,
      `Balanca comercial: agro exportador compensa parcialmente o deficit — limita a desvalorizacao`,
    ],
    effects: [
      `Tecnologia (SaaS em dolar, hardware, servidores AWS/GCP/Azure) encarece diretamente`,
      `Insumos importados: quimicos, eletronicos, materia-prima industrial — cadeia toda afetada`,
      `Combustivel importado contamina frete → custo logistico de toda a operacao sobe`,
      `IPCA permanece elevado por inflacao importada → BC mantem SELIC alta → ciclo retroalimenta`,
      `Empresas com divida em dolar ou contratos em moeda estrangeira tem passivo crescendo`,
      `Exportadores (agro, mineracao, tech) ganham competitividade — efeito positivo para eles`,
    ],
    affected: `Empresas de tecnologia com custos em dolar, e-commerce com estoque importado, industria com insumos internacionais, empresas com divida em moeda estrangeira.`,
    action: `Mapear toda a exposicao cambial (custo + receita). Contratar hedge (NDF ou opcao) para contratos futuros em dolar. Priorizar fornecedores nacionais. Negociar prazo maior de pagamento no exterior. Considerar precificacao atrelada ao dolar se produto/servico tem concorrencia importada.`,
    modules: ['Cenarios & Forecast', 'Smart Pricing'],
  })

  // ── CAC / Plataformas ──
  if (cacAff > 40) chains.push({
    id: 'cac', type: 'risk',
    title: `CAC subindo — Meta +R$${metaCPMD.toFixed(1)} CPM, Google CPC R$${googleCPC.toFixed(2)}`,
    urgency: cacAff,
    why: `O CAC medio brasileiro esta em R$${cacTrend.toFixed(0)} e subindo. Meta (CPM R$${metaCPM.toFixed(1)}) e Google (CPC R$${googleCPC.toFixed(2)}) aumentaram precos de leilao com mais anunciantes competindo pelo mesmo inventario. A degradacao do iOS 14.5 (rastreamento limitado) reduziu a eficiencia da segmentacao — mais verba desperdicada para o mesmo resultado.`,
    influence: [
      `Meta CPM subiu ${metaCPMD.toFixed(1)}% — mais anunciantes, mesmo inventario de atencao`,
      `Google CPC em keywords competitivas cresceu 15-30% por conta de leilao mais acirrado`,
      `iOS 14.5+ limitou rastreamento → segmentacao menos precisa → desperdicio de verba maior`,
      `${videoShr.toFixed(0)}% do engajamento em video → anuncios estaticos perdem eficiencia`,
      `TikTok CPM em R$${tiktokCPM.toFixed(1)} (${tiktokCPMD.toFixed(1)}%) — janela de arbitragem aberta`,
    ],
    effects: [
      `${cacAff}% das empresas com CAC 20-40% mais alto que 2 anos atras`,
      `Ratio LTV/CAC deteriora → rentabilidade por cliente cai → unit economics piora`,
      `Startups dependentes de paid traffic com runway encurtado`,
      `${organicShr.toFixed(0)}% de trafego organico — cada ponto a menos aumenta dependencia de paid`,
      `Budget de marketing para o mesmo numero de clientes aumenta proportionally`,
    ],
    affected: `E-commerce, SaaS B2C, apps de consumo, marketplaces e qualquer negocio dependente de midia paga para aquisicao de clientes.`,
    action: `Testar TikTok Ads agora (CPM baixo = janela de 3-6 meses). Investir em SEO e conteudo organico para reduzir dependencia. Ativar programa de indicacao para aquisicao por referral (CAC quase zero). Focar em retencao para aumentar LTV. Revisar segmentacao de campanhas com mais dados first-party.`,
    modules: ['Mercado & Concorrencia', 'Smart Pricing'],
  })

  // ── Talento ──
  if (talentAff > 35) chains.push({
    id: 'talent', type: 'risk',
    title: `Talento escasso e caro — ${talentAff}% das empresas impactadas`,
    urgency: talentAff,
    why: `O mercado de tecnologia e gestao esta aquecido. Programadores, analistas de dados, gestores de produto e profissionais de marketing digital estao em demanda maior que a oferta. Com trabalho remoto global, talentos brasileiros competem por vagas em dolar/euro — o salario medio do mercado local sobe para reter.`,
    influence: [
      `Mercado global de tech recruta no Brasil em dolar — eleva piso salarial local`,
      `IA ainda nao substitui completamente posicoes estrategicas — aumenta valor de quem domina`,
      `${aiAdoption.toFixed(0)}% das empresas adotando IA → demanda por profissionais de IA exploode`,
      `Inflacao corroi poder de compra → colaborador exige mais para manter padrao de vida`,
    ],
    effects: [
      `Folha de pagamento sobe mesmo sem contratar — revisao salarial para reter quem ja tem`,
      `Turnover alto = custo de substituicao (recrutamento, onboarding, ramp-up) → 1-3 salarios por saida`,
      `Produtividade cai durante transicao → projetos atrasam → receita impactada indiretamente`,
      `Startups perdem para grandes empresas na guerra por talento por nao ter beneficios equivalentes`,
    ],
    affected: `Empresas de tecnologia, agencias digitais, fintechs, consultorias e qualquer empresa com times de produto, dados ou engenharia.`,
    action: `Investir em cultura e ambiente antes de salario. Criar plano de carreira claro. Oferecer flexibilidade real (nao so no papel). Usar IA para aumentar produtividade do time atual. Contratar seniores que multiplicam juniors em vez de so contratar juniors.`,
    modules: ['Pessoas & Lideranca'],
  })

  // ── IA Disrupting ──
  if (aiAff > 30) chains.push({
    id: 'ai_risk', type: 'risk',
    title: `IA disruptando setores — ${aiAff}% das empresas nao preparadas`,
    urgency: aiAff,
    why: `Modelos de IA generativa (GPT-4, Claude, Gemini) ja executam tarefas que antes exigiam times inteiros: criacao de conteudo, analise de dados, atendimento ao cliente, codigo. Empresas que nao se adaptarem perdem para concorrentes com estrutura de custo 30-60% menor.`,
    influence: [
      `${aiAdoption.toFixed(0)}% das empresas ja usam IA no marketing — quem nao usa perde competitividade`,
      `Custo de infraestrutura de IA caiu 10x em 2 anos — acessivel para PMEs agora`,
      `Regulacao ainda incipiente — janela aberta antes de compliance obrigatorio`,
      `Concorrentes internacionais ja operam com IA — mercado se ajusta rapidamente`,
    ],
    effects: [
      `Conteudo de marketing gerado por IA custa 60% menos — agencias tradicionais sem posicionamento perdem clientes`,
      `Atendimento automatizado com qualidade humana → custo de CS cai drasticamente`,
      `Analise de dados e BI que antes custava time de data engineers → automatizavel`,
      `Novas competencias viram obrigatorias: prompt engineering, IA ops, data literacy`,
    ],
    affected: `Agencias de conteudo, call centers, analistas de dados junior, redatores sem especializacao, e qualquer papel baseado em tarefas repetitivas de conhecimento.`,
    action: `Adotar IA imediatamente em conteudo e atendimento (ROI rapido). Treinar time em ferramentas (Claude, ChatGPT, Midjourney). Reposicionar profissionais afetados para funcoes de supervisao de IA. Criar vantagem competitiva baseada em dados proprietarios que a IA nao tem acesso.`,
    modules: ['Inovacao & Tendencias'],
  })

  // ── Setores em queda ──
  if (sectorRetail && sectorRetail.change < 0) chains.push({
    id: 'retail_decline', type: sectorRetail.change < -20 ? 'critical' : 'risk',
    title: `Varejo tradicional em queda (${sectorRetail.change.toFixed(1)}% YTD) — modelo sob pressao`,
    urgency: Math.min(75, Math.abs(Math.round(sectorRetail.change * 1.5))),
    why: `O varejo fisico tradicional enfrenta tripla pressao: e-commerce roubando participacao, custo fixo alto (aluguel, folha) que nao cai com a demanda, e consumidor mais exigente por experiencia e preco. O modelo de "loja como estoque" esta obsoleto.`,
    influence: [
      `E-commerce cresceu — consumidor compara preco em segundos e compra online com entrega no dia seguinte`,
      `SELIC alta reduziu credito ao consumo — parcelamento fica mais caro para o cliente`,
      `Plataformas como Shopee e Shein competem com preco que o varejo nacional nao consegue bater`,
      `Aluguel de ponto comercial sobe por IGPM — custo fixo corroi margem mesmo sem vender menos`,
    ],
    effects: [
      `Margens comprimem: nao consegue baixar preco (vs. e-commerce) nem subir (vs. concorrencia)`,
      `Lojas fisicas viram showroom nao remunerado — cliente ve ao vivo e compra online`,
      `Devolucao e troca aumentam com omnichannel mal executado`,
      `Reducao de tamanho de lojas ou fechamento de unidades nao rentaveis`,
    ],
    affected: `Redes de varejo fisico, shopping centers, franquias de moda e eletronicos, distribuidores que dependem do varejo como canal.`,
    action: `Transformar loja em experiencia (o que e-commerce nao pode oferecer). Integrar estoque online com fisico. Usar dados de CRM para personalizar atendimento. Renegociar alugueis agressivamente. Avaliar formato de loja menor com maior giro.`,
    modules: ['Mercado & Concorrencia'],
  })

  if (sectorMedia && sectorMedia.change < -20) chains.push({
    id: 'media_decline', type: 'risk',
    title: `Midia impressa −${Math.abs(sectorMedia.change).toFixed(1)}% — setor em colapso estrutural`,
    urgency: Math.min(65, Math.abs(Math.round(sectorMedia.change))),
    why: `A midia impressa enfrenta colapso estrutural irreversivel. Anunciantes migraram para digital (mensuravel, segmentado, mais barato). Leitores migraram para redes sociais e agregadores. Nao e crise de demanda — e obsolescencia de modelo de negocio.`,
    influence: [
      `Meta e Google capturam 70%+ do budget de publicidade digital`,
      `Newsletter e podcasts substituem jornalismo impresso com custo de producao 90% menor`,
      `Geracao Z nao consome midia impressa — base leitora envelhece sem reposicao`,
    ],
    effects: [
      `Redacao profissional encolhe → qualidade do jornalismo de referencia cai`,
      `Espaco deixado por jornalismo local abre para desinformacao`,
      `Profissionais de comunicacao migram para conteudo digital e marketing de conteudo`,
    ],
    affected: `Jornais, revistas, distribuidores de midia impressa e anunciantes que ainda dependem de midia offline como principal canal.`,
    action: `Nao anunciar em midia impressa como canal principal. Redirecionar budget para digital. Avaliar parcerias com veiculos digitais de nicho com audiencia qualificada.`,
    modules: ['Mercado & Concorrencia'],
  })

  // ── PIB (oportunidade) ──
  if (pib > 2) chains.push({
    id: 'pib', type: 'opportunity',
    title: `PIB ${pib.toFixed(1)}% — janela de expansao ativa`,
    urgency: Math.min(85, Math.round(pib * 20)),
    why: `A economia brasileira cresce ${pib.toFixed(1)}%, acima da media historica. Agro em expansao, servicos aquecidos e mercado de trabalho formal criando vagas sustentam o crescimento. O consumo das familias esta positivo apesar dos juros altos.`,
    influence: [
      `Agro ${sectorAgro ? sectorAgro.change.toFixed(1) : '+28'}% gera renda para o interior e aquece mercados regionais`,
      `Mercado formal empregando mais → massa salarial sobe → consumo segue`,
      `Credito consignado e FGTS ativo sustentam consumo mesmo com SELIC alta`,
      `Tech & IA ${sectorTech ? sectorTech.change.toFixed(1) : '+34'}% puxando inovacao e produtividade`,
    ],
    effects: [
      `Mais renda circulando → CAC tende a cair em setores essenciais`,
      `Confianca empresarial sobe → M&A, franquias e expansoes se viabilizam`,
      `Risco: crescimento pode pressionar IPCA se demanda superar oferta`,
    ],
    affected: `Varejo essencial, servicos, agritech, logistica, construcao civil e educacao corporativa.`,
    action: `Janela para expansao geografica antes de ciclo de alta de juros encerrar crescimento. Investir em brand building. Construir reserva para a proxima desaceleracao. Aproveitar para renegociar contratos de fornecimento com volumes maiores.`,
    modules: ['Canvas & Pitch', 'Mercado & Concorrencia'],
  })

  // ── TikTok CPM ──
  chains.push({
    id: 'tiktok_opp', type: 'opportunity',
    title: `TikTok CPM R$${tiktokCPM.toFixed(1)} (${tiktokCPMD.toFixed(1)}%) — janela de aquisicao barata`,
    urgency: 82,
    why: `TikTok tem CPM significativamente menor que Meta (R$${metaCPM.toFixed(1)}) e Google. Enquanto outras plataformas encarecem, TikTok ainda esta em fase de crescimento de inventario de anuncios — mais espaco do que anunciantes. Essa janela fecha quando mais empresas perceberem a oportunidade.`,
    influence: [
      `TikTok ainda conquistando anunciantes brasileiros — leilao menos acirrado`,
      `Formato de video curto alinhado com ${videoShr.toFixed(0)}% do engajamento digital`,
      `Algoritmo distribui conteudo organico melhor que outras plataformas — amplifica anuncio com organico`,
      `Base de usuarios crescendo, especialmente 18-35 anos com poder de compra`,
    ],
    effects: [
      `CPM 50-60% menor que Meta na mesma audiencia → ROAS potencialmente maior`,
      `Marca que entrar agora constroi audiencia organica antes da plataforma saturar`,
      `Primeiros a testar formatos novos aprendem curva antes dos concorrentes`,
    ],
    affected: `Qualquer empresa com produto visual, massa, ou voltado para publico jovem — moda, alimentos, tecnologia, servicos de consumo.`,
    action: `Alocar 10-20% do budget de paid para TikTok agora. Produzir conteudo nativo (nao reutilizar criativos de outras plataformas). Testar por 30 dias com meta de ROAS > 2x. Se funcionar, escalar antes de competicao aumentar.`,
    modules: ['Mercado & Concorrencia'],
  })

  // ── IA em conteúdo ──
  chains.push({
    id: 'ai_content', type: 'opportunity',
    title: `IA cortando custo de conteudo em 60% — vantagem competitiva real`,
    urgency: 76,
    why: `Ferramentas como Claude, ChatGPT, Midjourney e Sora permitem produzir conteudo de qualidade com fracao do custo e tempo anterior. Empresa que adotar agora opera com estrutura 30-60% mais eficiente que concorrente tradicional.`,
    influence: [
      `${aiAdoption.toFixed(0)}% das empresas ja usam IA — quem nao usa perde velocidade de producao`,
      `Custo de tokens de IA caiu 100x nos ultimos 2 anos — escalar conteudo ficou acessivel`,
      `Regulacao ainda nao exige declaracao de conteudo gerado por IA — janela legal aberta`,
    ],
    effects: [
      `Time de marketing produz 5-10x mais conteudo sem contratar mais gente`,
      `Testes A/B mais rapidos → otimizacao de campanha mais agil → melhor ROI`,
      `SEO: mais conteudo indexado → mais trafego organico → reducao de dependencia de paid`,
    ],
    affected: `Agencias, equipes de marketing interno, e-commerce com catalogo grande e qualquer empresa que produz conteudo regularmente.`,
    action: `Adotar Claude/ChatGPT para rascunho de conteudo imediatamente. Treinar time em prompts. Criar processo de revisao humana para qualidade. Liberar time para estrategia ao inves de execucao repetitiva.`,
    modules: ['Inovacao & Tendencias'],
  })

  // ── Agro B2B ──
  if (sectorAgro && sectorAgro.change > 20) chains.push({
    id: 'agro_b2b', type: 'opportunity',
    title: `Agro ${sectorAgro.change.toFixed(1)}% — oportunidade B2B em agritech`,
    urgency: 58,
    why: `O agronegocio brasileiro cresce consistentemente e esta em processo de digitalizacao. Produtores rurais modernos adotam tecnologia para gestao, monitoramento, logistica e financiamento. Mercado B2B com ticket alto e baixo churn.`,
    influence: [
      `Brasil e maior exportador de varias commodities — agro tem dolares para investir em tech`,
      `Digitalizacao do campo ainda incipiente — espaco enorme para primeiros entrantes`,
      `Governo com linhas de credito subsidiadas para agritech via BNDES e fundos setoriais`,
    ],
    effects: [
      `Empresas que entram agora constroem base instalada com baixo custo de aquisicao`,
      `Contrato B2B com fazendeiro: ticket alto, relacionamento longo, baixa rotatividade`,
      `Oportunidade de cross-sell ampla: de insumos a financiamento, de drone a ERP rural`,
    ],
    affected: `Startups de agritech, SaaS de gestao rural, fintechs de credito rural, logistica agricola e marketplaces de insumos.`,
    action: `Mapear dor especifica do produtor (nao generica). Parceria com cooperativas como canal de distribuicao. Produto simples que funciona offline — conectividade ainda e barreira no campo.`,
    modules: ['Canvas & Pitch', 'Mercado & Concorrencia'],
  })

  return chains.sort((a, b) => b.urgency - a.urgency)
}

/* ─── Macro Context Bar ─── */
function macroContextSentence(selic: number, ipca: number, pib: number): string {
  if (selic > 13 && ipca > 4.75) return 'Ambiente restritivo: juro alto + inflacao acima da meta'
  if (pib > 2.5 && selic < 11) return 'Ambiente favoravel: crescimento + credito acessivel'
  return 'Ambiente misto: indicadores divergentes'
}

/* ─── Module Badge ─── */
function ModuleBadge({ name }: { name: string }) {
  return (
    <span
      className="font-mono text-[8px] px-2 py-1 rounded-sm inline-block"
      style={{
        background: 'rgba(26,82,118,0.15)',
        color: '#2471a3',
        border: '1px solid rgba(26,82,118,0.3)',
      }}
    >
      {'\u2192'} {name}
    </span>
  )
}

/* ─── Circular Severity Meter ─── */
function SeverityCircle({ urgency, color, animate }: { urgency: number; color: string; animate: boolean }) {
  const size = 60
  const strokeWidth = 4
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const arcLength = (urgency / 100) * circumference
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setMounted(true), 50)
      return () => clearTimeout(t)
    }
  }, [animate])

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeWidth}
      />
      {/* Foreground arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${circumference}`}
        strokeDashoffset={mounted ? circumference - arcLength : circumference}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{
          transition: 'stroke-dashoffset 1.2s ease-out',
          filter: `drop-shadow(0 0 3px ${color}60)`,
        }}
      />
      {/* Center number */}
      <text
        x={size / 2}
        y={size / 2 + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize="18"
        fontWeight="bold"
        fontFamily="monospace"
      >
        {urgency}
      </text>
    </svg>
  )
}

/* ─── Type Badge ─── */
function TypeBadge({ type, color, small }: { type: string; color: string; small?: boolean }) {
  const label = type === 'critical' ? 'CRITICO' : type === 'risk' ? 'RISCO' : 'OPORT'
  const isCritical = type === 'critical'

  return (
    <motion.span
      className={`font-mono font-bold tracking-[0.15em] rounded-sm text-center ${
        small ? 'text-[6px] px-1 py-0.5' : 'text-[7px] px-1.5 py-0.5'
      }`}
      style={{
        background: `${color}18`,
        color,
        border: `1px solid ${color}30`,
        minWidth: small ? '32px' : '42px',
        display: 'inline-block',
      }}
      animate={isCritical ? { opacity: [1, 0.4, 1] } : {}}
      transition={{ duration: 1.2, repeat: Infinity }}
    >
      {label}
    </motion.span>
  )
}

/* ─── Expanded Detail Content ─── */
function ExpandedDetail({ chain }: { chain: CausalChain }) {
  const col = chain.type === 'critical' ? RED : chain.type === 'risk' ? AMBER : GREEN

  return (
    <div className="px-4 pb-4 pt-3 space-y-3">
      {/* Full WHY */}
      <div className="rounded-sm p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-white/25 block mb-1.5">POR QUE</span>
        <p className="text-[10px] text-white/55 leading-relaxed">{chain.why}</p>
      </div>

      {/* Influences */}
      <div>
        <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-white/20 block mb-2">O QUE CAUSA</span>
        <div className="flex flex-col gap-1.5">
          {chain.influence.map((inf, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="shrink-0 mt-1 h-1 w-1 rounded-full" style={{ background: col, opacity: 0.5 }} />
              <span className="text-[9px] text-white/40 leading-relaxed">{inf}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Effects */}
      <div>
        <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-white/20 block mb-2">IMPACTO</span>
        <div className="flex flex-col gap-1.5">
          {chain.effects.map((ef, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="font-mono text-[8px] shrink-0 mt-0.5 leading-none" style={{ color: col }}>{'\u2192'}</span>
              <span className="text-[9px] text-white/45 leading-relaxed">{ef}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Full COMO AGIR */}
      <div className="rounded-sm p-2.5" style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}15` }}>
        <span className="font-mono text-[7px] font-bold tracking-[0.2em] block mb-1" style={{ color: GREEN }}>COMO AGIR</span>
        <p className="text-[9px] text-white/45 leading-relaxed">{chain.action}</p>
      </div>

      {/* QUEM E AFETADO */}
      <div className="rounded-sm p-2.5" style={{ background: `${RED}06`, border: `1px solid ${RED}12` }}>
        <span className="font-mono text-[7px] font-bold tracking-[0.2em] block mb-1" style={{ color: RED }}>QUEM E AFETADO</span>
        <p className="text-[9px] text-white/40 leading-relaxed">{chain.affected}</p>
      </div>

      {/* RESOLVER EM */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-white/25">{'\u2192'} RESOLVER EM</span>
        {chain.modules.map((mod) => (
          <ModuleBadge key={mod} name={mod} />
        ))}
      </div>
    </div>
  )
}

/* ─── Top 3 Big Card ─── */
function BigRiskCard({ chain, index, isExpanded, onToggle }: {
  chain: CausalChain
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const col = chain.type === 'critical' ? RED : chain.type === 'risk' ? AMBER : GREEN

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="rounded-lg overflow-hidden cursor-pointer"
      style={{
        background: 'rgba(0,0,0,0.35)',
        border: `1px solid ${col}25`,
      }}
      onClick={onToggle}
    >
      {/* Main content row */}
      <div className="flex items-center gap-4 p-4">
        {/* Left: Severity circle + badge */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <SeverityCircle urgency={chain.urgency} color={col} animate={true} />
          <TypeBadge type={chain.type} color={col} />
        </div>

        {/* Right: text content */}
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-white/80 leading-snug mb-1">{chain.title}</p>
          <p className="text-[9px] text-white/40 leading-relaxed line-clamp-2 mb-1.5">{chain.why}</p>
          <p className="text-[9px] leading-none mb-1.5" style={{ color: GREEN }}>
            COMO AGIR: {chain.action.split('.')[0]}.
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[8px] text-white/25 font-mono">{'\u2192'} Resolver em:</span>
            {chain.modules.map((mod) => (
              <ModuleBadge key={mod} name={mod} />
            ))}
          </div>
        </div>

        {/* Expand indicator */}
        <span className="text-white/20 text-[10px] shrink-0 self-start mt-1">
          {isExpanded ? '\u25B2' : '\u25BC'}
        </span>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t"
            style={{ borderColor: `${col}15` }}
          >
            <ExpandedDetail chain={chain} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Compact Row ─── */
function CompactRow({ chain, index, isExpanded, onToggle }: {
  chain: CausalChain
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const col = chain.type === 'critical' ? RED : chain.type === 'risk' ? AMBER : GREEN
  const isOpp = chain.type === 'opportunity'

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="rounded overflow-hidden"
      style={{
        background: isOpp ? `${GREEN}06` : 'rgba(0,0,0,0.2)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Collapsed row */}
      <button
        className="w-full flex items-center gap-2 px-3 text-left"
        style={{ height: '36px' }}
        onClick={onToggle}
      >
        {/* Colored dot */}
        <span
          className="shrink-0 rounded-full"
          style={{ width: '6px', height: '6px', background: col }}
        />

        {/* Type badge (tiny) */}
        <TypeBadge type={chain.type} color={col} small />

        {/* Title */}
        <p className="text-[10px] text-white/60 flex-1 truncate leading-none">{chain.title}</p>

        {/* Urgency % */}
        <span className="font-mono text-[10px] font-bold shrink-0" style={{ color: col }}>{chain.urgency}%</span>

        {/* Expand button */}
        <span className="text-white/20 text-[9px] shrink-0">{isExpanded ? '\u25B2' : '\u25BC'}</span>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t"
            style={{ borderColor: `${col}10` }}
          >
            <ExpandedDetail chain={chain} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Section Divider ─── */
function SectionDivider({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mt-4 mb-1.5">
      <div className="h-[1px] flex-1" style={{ background: `${color}20` }} />
      <span className="font-mono text-[7px] font-bold tracking-[0.25em]" style={{ color: `${color}99` }}>
        {label}
      </span>
      <div className="h-[1px] flex-1" style={{ background: `${color}20` }} />
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RiscosSection({ data }: { data: any }) {
  const chains = useMemo(() => buildCausalChains(data), [data])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const top3 = chains.slice(0, 3)
  const remaining = chains.slice(3)

  const remainingRisks = remaining.filter(c => c.type === 'critical' || c.type === 'risk')
  const remainingOpps  = remaining.filter(c => c.type === 'opportunity')

  const selic = v(data.macro.selic?.value, 10.5)
  const ipca  = v(data.macro.ipca?.value, 4.8)
  const pib   = v(data.macro.pib?.value, 2.9)

  const contextSentence = macroContextSentence(selic, ipca, pib)

  const toggle = (id: string) => setExpandedId(prev => prev === id ? null : id)

  return (
    <div className="flex flex-col gap-3 px-4 pb-8">

      {/* 1. Question Header */}
      <div className="text-center mb-4">
        <p className="font-mono text-[8px] font-bold tracking-[0.3em] text-white/20 uppercase">Diagnostico de Riscos</p>
        <h2 className="text-[15px] font-semibold text-white/60 mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
          O que pode me <span className="text-white/90">quebrar</span>?
        </h2>
      </div>

      {/* 2. Macro Context Sentence */}
      <p className="text-center font-mono text-[9px] text-white/30 italic -mt-3 mb-1">
        {contextSentence}
      </p>

      {/* 3. Top 3 Risks as BIG Cards */}
      <div className="flex flex-col gap-2">
        {top3.map((chain, i) => (
          <BigRiskCard
            key={chain.id}
            chain={chain}
            index={i}
            isExpanded={expandedId === chain.id}
            onToggle={() => toggle(chain.id)}
          />
        ))}
      </div>

      {/* 4. Remaining risks */}
      {remainingRisks.length > 0 && (
        <div className="flex flex-col gap-2">
          <SectionDivider label="OUTROS RISCOS" color={AMBER} />
          {remainingRisks.map((c, i) => (
            <BigRiskCard
              key={c.id}
              chain={c}
              index={i + 3}
              isExpanded={expandedId === c.id}
              onToggle={() => toggle(c.id)}
            />
          ))}
        </div>
      )}

      {/* 5. Oportunidades */}
      {remainingOpps.length > 0 && (
        <div className="flex flex-col gap-2">
          <SectionDivider label="OPORTUNIDADES" color={GREEN} />
          {remainingOpps.map((c, i) => (
            <BigRiskCard
              key={c.id}
              chain={c}
              index={i + 3 + remainingRisks.length}
              isExpanded={expandedId === c.id}
              onToggle={() => toggle(c.id)}
            />
          ))}
        </div>
      )}

    </div>
  )
}
