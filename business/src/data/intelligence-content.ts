import type { ModuleContent } from '@/types/intelligence'

// Conteúdo dos módulos de Intelligence.
// Cada tópico corresponde a um item do array theory[] em INTELLIGENCE_MODULES.
// Blocos: text | video | simulation | attachment
// Para adicionar conteúdo: insira blocos no array blocks[] do tópico correspondente.

export const INTELLIGENCE_CONTENT: ModuleContent[] = [
  {
    moduleId: 'M1',
    topics: [
      {
        id: 'M1-0',
        title: 'Gestao da Inovacao, Transformacao e Ferramentas Digitais',
        blocks: [
          {
            id: 'M1-0-v1',
            type: 'video',
            title: 'M1-01 Inovação, Transformação e Ferramentas Digitais',
            url: 'https://qvvqbngiwqfuxsbgcxtc.supabase.co/storage/v1/object/public/videos/IPB/Inovacao.mp4',
          },
          {
            id: 'M1-0-v2',
            type: 'video',
            title: 'M1-01 A Dupla Face da IA',
            url: 'https://qvvqbngiwqfuxsbgcxtc.supabase.co/storage/v1/object/public/videos/IPB/A_Dupla_Face_da_IA.mp4',
          },
          {
            id: 'M1-0-t1',
            type: 'text',
            title: 'Era Digital: A Evolução da Tecnologia nas Empresas (2000–2020)',
            body: 'A evolução da tecnologia nas empresas pode ser segmentada em três fases distintas ao longo das últimas décadas:\n\n— Infraestrutura (anos 2000): foco na estabilidade de servidores e redes operacionais. O problema central era técnico: manter sistemas funcionando.\n— Processo (anos 2010): integração de sistemas como ERPs e CRMs no cotidiano da gestão. A tecnologia entra nos fluxos de trabalho.\n— Estratégia (anos 2020 em diante): a tecnologia define a criação de produtos, o atendimento ao cliente e a capacidade de inovar — tornando-se pilar de competitividade e reputação.\n\nEssa progressão é fundamental para entender por que a gestão da inovação e a transformação digital não são projetos de TI — são decisões de negócio. Empresas que operam em fase de Processo enquanto o mercado está em fase de Estratégia perdem competitividade de forma sistemática e silenciosa.',
          },
          {
            id: 'M1-0-t2',
            type: 'text',
            title: 'O que é Inovação — Invenção, Tipos e os Casos que Mudaram o Mercado',
            body: 'Inovação não é criatividade aleatória. É a aplicação sistemática de novas ideias para gerar valor — para o cliente, para a organização ou para a sociedade.\n\nSchumpeter define inovação como a introdução de novos produtos, processos, métodos organizacionais ou mercados que rompem o equilíbrio existente. Drucker complementa: inovação é a função específica do empreendedorismo — transformar recursos em riqueza por meio de uma nova capacidade de criar.\n\n**O que separa inovação de invenção:**\n— Invenção: nova ideia ou descoberta técnica\n— Inovação: ideia transformada em valor real no mercado\n\n**Os três tipos de inovação:**\n\n**Incremental** — melhorias contínuas sobre algo que já existe. Risco baixo, retorno previsível, horizonte curto. É a base da maioria das operações. Sem ela, o negócio deteriora.\n\n**Radical** — cria algo fundamentalmente novo: tecnologia, modelo de negócio ou categoria inexistente. Exemplos: smartphone, streaming, Uber. Risco alto, retorno transformador, horizonte longo.\n\n**Disruptiva** (Clayton Christensen) — começa atendendo mercados negligenciados ou de baixo custo e progressivamente avança até dominar o mercado principal. Exemplos: Netflix (começou com DVD pelo correio), Nubank (excluídos do sistema bancário). Lógica: "simples demais para importar" → "boa o suficiente para todos".\n\nBlockbuster, Kodak e Nokia não foram destruídas por falta de tecnologia — elas tinham acesso às mesmas tecnologias que seus concorrentes. Foram destruídas por incapacidade de inovar no modelo de negócio. A pergunta estratégica: **qual tipo de inovação meu negócio está gerenciando — e com qual intensidade?**',
          },
          {
            id: 'M1-0-s1',
            type: 'simulation',
            title: 'Classificador de Tipos de Inovação',
            simulationId: 'innovation-types',
            description: 'Analise 6 casos reais de negócios e identifique se cada um representa inovação Incremental, Radical ou Disruptiva. Desenvolva o diagnóstico crítico.',
          },
          {
            id: 'M1-0-t3',
            type: 'text',
            title: 'Transformação Digital: Definição, Domínios e Cultura',
            body: 'Transformação digital é o processo de integração de tecnologias digitais em todas as áreas de uma organização, mudando fundamentalmente a forma como ela opera e entrega valor. Não se trata de implementar novas tecnologias — é uma mudança cultural que exige desafiar continuamente o status quo, experimentar e aceitar o fracasso como parte do processo.\n\n**Os 4 Domínios da Transformação Digital** (Rogers, Columbia Business School):\n1. Clientes — de audiência para rede. O cliente não é receptor passivo; é ator, produtor de conteúdo, influenciador e co-criador.\n2. Competição — de setor para ecossistema. Concorrentes agora vêm de setores adjacentes ou de plataformas que antes não existiam.\n3. Dados — de subproduto para ativo estratégico. Dados deixam de ser resultado da operação — passam a ser o insumo que orienta toda decisão.\n4. Inovação — de planejada para contínua. O ciclo comprime: de anos para meses, de meses para semanas.\n\n**Maturidade Digital**\nA maioria das empresas está em estágios intermediários com assimetrias: digital no marketing mas analógico nos processos internos; dados coletados mas não utilizados; tecnologia comprada mas cultura não transformada.\n\nO erro mais comum: tratar a transformação digital como projeto de TI. Ela começa nas perguntas de negócio — qual valor entregamos? como o cliente experimenta isso? como capturamos retorno? A tecnologia é a resposta, não a pergunta.',
          },
          {
            id: 'M1-0-t4',
            type: 'text',
            title: 'Governança Digital: Conceito, Importância e os 4 Pilares',
            body: 'Governança digital é o conjunto de práticas e processos que garantem que a tecnologia seja usada de maneira eficiente e alinhada às estratégias organizacionais. Ela abrange desde a gestão de recursos tecnológicos e segurança da informação até a conformidade regulatória, assegurando que os investimentos gerem valor real.\n\nEm um ambiente onde os dados são o principal ativo, negligenciar a governança digital pode comprometer a sustentabilidade da organização a longo prazo.\n\n**Por que a governança digital importa:**\n— Segurança da informação: protege dados sensíveis contra ameaças internas e externas\n— Alinhamento estratégico: garante que o uso de tecnologia esteja conectado à estratégia de longo prazo\n— Eficiência operacional: processos automatizados e bem gerenciados reduzem desperdícios e promovem inovação\n— Conformidade legal: regulamentações como a LGPD (Brasil) e o GDPR (Europa) tornaram a governança digital obrigatória\n\n**Os 4 Pilares da Governança Digital:**\n\n**Estratégia** — define como a tecnologia será usada para atingir objetivos organizacionais: prioridades, investimentos e indicadores de resultado. Não faz sentido investir em tecnologia sem alinhamento ao que a empresa almeja no futuro.\n\n**Riscos e Segurança** — identifica, avalia e mitiga ameaças ao negócio. Inclui políticas de segurança (criptografia, autenticação em dois fatores) e treinamento contínuo dos colaboradores.\n\n**Políticas e Procedimentos** — regras claras sobre uso de tecnologia padronizam processos e elevam a confiabilidade dos dados. Quanto mais padronizados os processos, mais fidedignos os dados — e mais seguras as decisões.\n\n**Monitoramento Contínuo** — a tecnologia avança constantemente. As práticas de governança precisam acompanhar esse ritmo, ajustando sistemas e processos conforme necessário.',
          },
          {
            id: 'M1-0-t5',
            type: 'text',
            title: 'Sinergia entre Sistemas de Gestão da Inovação e Transformação Digital',
            body: 'Sistemas de Gestão da Inovação (SGI) e Transformação Digital (TD) frequentemente evoluem de forma paralela — mas sua integração gera benefícios que nenhum dos dois atinge sozinho.\n\nO SGI orienta as iniciativas de TD ao estruturar processos para lidar com projetos de alta incerteza. A TD oferece as ferramentas tecnológicas para potencializar a eficácia desses sistemas.\n\n**4 elementos centrais da integração SGI + TD:**\n\nEstrutura de Projetos — SGI gerencia incertezas com metodologias estruturadas; TD fornece ferramentas de colaboração em tempo real.\n\nProcessos — SGI organiza o fluxo de ideação; TD automatiza o funil e a coleta de feedbacks.\n\nCultura — SGI estimula a experimentação e aceitação do erro; TD democratiza dados para decisões ágeis e seguras.\n\nResultados — SGI mantém o foco estratégico no ROI; TD entrega analytics para medir o impacto em larga escala.\n\n**O Funil de Inovação no contexto integrado:**\nIdeia → Triagem → Prototipagem → Validação → Escala\n\nA maioria das ideias morre na triagem — e isso é positivo: o custo de eliminar cedo é mínimo comparado ao custo de escalar algo que não funciona. O objetivo não é gerar muitas ideias; é identificar poucas com potencial real e testá-las rápido. A TD fornece os dados e ferramentas para que esse processo aconteça com velocidade e menor incerteza.',
          },
          {
            id: 'M1-0-t6',
            type: 'text',
            title: 'Cultura Organizacional e Gestão da Mudança',
            body: 'A tecnologia é apenas um dos componentes da transformação digital. O fator humano e a cultura organizacional representam os maiores desafios — e, simultaneamente, os maiores facilitadores do sucesso. A resistência à mudança é um fenômeno natural em organizações com identidades culturais fortes e processos tradicionais.\n\n**Barreiras à Inovação Digital:**\n— Medo do erro e punição ao fracasso — inibem a experimentação necessária para inovar\n— Culturas centralizadoras — inibem o protagonismo dos colaboradores\n— Desalinhamento entre discurso da liderança e práticas diárias\n— Visão de que a transformação digital é responsabilidade exclusiva do setor de TI\n\n**5 Estratégias para a Mudança Bem-Sucedida:**\n\n1. Diagnóstico e Alinhamento Estratégico — compreender o cenário atual e definir a visão. A governança digital garante que cada investimento em tecnologia contribua para as metas organizacionais.\n\n2. Liderança Ativa — líderes devem ser os primeiros a incorporar comportamentos digitais e valores de inovação. Discurso sem exemplo é ruído.\n\n3. Comunicação Transparente — explicar o "porquê" da mudança gera engajamento. Decisões baseadas em dados precisos constroem confiança.\n\n4. Treinamento e Capacitação — desenvolver habilidades técnicas e comportamentais (soft skills) para o novo ambiente. Eficiência operacional exige que as tecnologias adotadas sejam utilizadas de forma otimizada.\n\n5. Espaços Seguros para Experimentar — criar ambientes onde ideias possam ser testadas sem medo de punição severa em caso de erro.\n\nEstudos indicam que práticas estruturadas de gestão da mudança reduzem o ceticismo frente às novas ferramentas, impactando positivamente a atitude dos colaboradores e a velocidade de adoção.',
          },
          {
            id: 'M1-0-t7',
            type: 'text',
            title: 'Frameworks de Governança e Modelos de Gestão de TI',
            body: 'A implementação da governança digital não exige a criação de processos do zero — exige a adaptação de frameworks reconhecidos que equilibram controle e agilidade. A combinação de modelos cobre desde a estratégia executiva até a operação técnica.\n\n**COBIT** (Control Objectives for Information and Related Technologies)\nReferência global para governança e gestão de TI empresarial. Atua no nível estratégico, conectando objetivos de negócio às metas de tecnologia. Define "o que" deve ser feito para garantir a entrega de valor — papéis, responsabilidades e métricas de controle.\n\n**ISO/IEC 38500**\nNorma de princípios para a governança corporativa da TI, orientando dirigentes sobre o uso eficaz, eficiente e aceitável da tecnologia. Três pilares: avaliação do uso atual e futuro da TI, direção para implementação de planos e políticas, e monitoramento de conformidade e desempenho.\n\n**ITIL 4** (Information Technology Infrastructure Library)\nFoca na parte tática e operacional, organizando fluxos de trabalho para entrega de serviços de TI. A versão 4 integra IA e computação em nuvem — essencial para ambientes que buscam agilidade e melhoria contínua.\n\n**Estruturas organizacionais de governança:**\n\nComitês de Governança — reúnem gestores de diferentes áreas para decisões colaborativas sobre tecnologia. Evitam decisões individualizadas em questões de alta complexidade.\n\nModelos Descentralizados — organizações menores ou mais ágeis concedem autonomia a cada departamento para gerenciar suas tecnologias seguindo diretrizes gerais. Estruturas excessivamente centralizadas comprometem a velocidade de decisão — e velocidade é diferencial competitivo.',
          },
          {
            id: 'M1-0-t8',
            type: 'text',
            title: 'Ferramentas Digitais e Tomada de Decisão Baseada em Dados',
            body: '**Analytics-to-Value (AtV)**\nEmpresas líderes adotam o Analytics-to-Value — práticas que utilizam digital e analytics para otimizar portfólios e reduzir custos. Diferente dos métodos tradicionais (Design-to-Value) que focam em componentes isolados, o AtV explora dados internos e externos em larga escala, gerando insights em poucos dias para todo o portfólio.\n\n**Tomada de Decisão Baseada em Dados (DDDM)**\nDDDM é o uso de fatos, métricas e dados para orientar decisões comerciais estratégicas. A tecnologia de análise sozinha não é suficiente — é necessário criar uma cultura que estimule o pensamento crítico e a curiosidade em todos os níveis da organização.\n\n**4 pilares da decisão baseada em dados:**\n— Coleta e Armazenamento: capturar dados de forma eficiente e estruturada\n— Análise e Processamento: extrair informações via modelos estatísticos e machine learning\n— Visualização e Comunicação: apresentar resultados de forma clara para não-especialistas\n— Integração Estratégica: usar insights nos processos decisórios diários da liderança\n\n**Ferramentas por categoria:**\n— Inteligência e Dados: CRM (Salesforce, HubSpot), Analytics (Google Analytics, Mixpanel), BI (Power BI, Looker)\n— Operação e Produtividade: gestão de projetos (Notion, Linear, Jira), automação (Zapier, n8n, Make), ERP (SAP, Totvs, Omie)\n— Comunicação e Colaboração: Slack/Teams, Figma, Miro/FigJam\n— IA Aplicada: LLMs (ChatGPT, Claude, Gemini) para escrita, análise e síntese; IA generativa em marketing; IA em análise financeira\n\nA lógica de escolha: não existe ferramenta universalmente certa. Existe a ferramenta certa para o estágio, o tamanho e o problema específico da empresa. Stack complexo em empresa pequena = custo sem retorno. Stack simples em empresa grande = gargalo operacional.',
          },
          {
            id: 'M1-0-s2',
            type: 'simulation',
            title: 'Radar de Maturidade Digital',
            simulationId: 'digital-maturity',
            description: 'Avalie sua empresa (ou um negócio que você conhece) em 6 dimensões de maturidade digital. Descubra em qual estágio ela se encontra e onde estão os maiores gaps.',
          },
          {
            id: 'M1-0-t9',
            type: 'text',
            title: 'Governança de Dados, LGPD e Sandbox Regulatório',
            body: 'A transformação digital no Brasil ocorre sob um rigoroso arcabouço legal que visa proteger o cidadão e incentivar a inovação responsável.\n\nA Lei Geral de Proteção de Dados (LGPD) e a Lei do Governo Digital (14.129/2021) são os pilares desse ecossistema regulatório.\n\n**Sandbox Regulatório:**\nAmbiente experimental que permite a testagem de modelos de negócios inovadores com flexibilidade temporária em normas e penalidades. O Marco Civil das Startups (LC 182/21) institucionalizou essa prática, permitindo que órgãos como a ANPD explorem tecnologias emergentes.\n\nA ANPD lançou um sandbox focado em Inteligência Artificial e Proteção de Dados, com ênfase em:\n— Transparência Algorítmica: garantir que titulares compreendam decisões automatizadas\n— Mitigação de Vieses: identificar e reduzir discriminação em modelos de machine learning\n— Segurança e Privacidade: avaliar uso de dados pessoais no treinamento de modelos generativos\n\nEsse ambiente controlado permite que a inovação ocorra sem gerar lacunas jurídicas que possam frear investimentos ou comprometer direitos fundamentais.\n\n**Para a gestão de negócios, a LGPD implica diretamente em:**\n— Coleta de dados: apenas com finalidade definida e consentimento explícito\n— Armazenamento: com segurança e pelo tempo estritamente necessário\n— Compartilhamento: limitado, documentado e com base legal\n— Direito do titular: exclusão, portabilidade e acesso aos próprios dados\n\nConformidade não é custo — é ativo. Empresas que tratam a LGPD como diferencial competitivo constroem confiança com clientes e parceiros.',
          },
          {
            id: 'M1-0-t10',
            type: 'text',
            title: 'Tendências Futuras: IA, Agentes Autônomos e RegTech 2025–2026',
            body: 'O futuro da gestão da inovação está intrinsecamente ligado à evolução da Inteligência Artificial. Em 2025, profissionais de compliance e governança veem a IA não apenas como ferramenta de automação, mas como vetor de aculturamento ético.\n\n**Agentes de IA e Governança Corporativa:**\nDiferente da automação robótica tradicional (RPA), os agentes de IA possuem capacidades de percepção, raciocínio adaptativo e ação autônoma. Isso redefine a governança: as empresas agora gerenciam agentes que podem tomar decisões independentes e acessar dados sensíveis.\n\nA observabilidade torna-se a prioridade número um: não se pode gerenciar ou proteger o que não se vê. Cada ação de um agente autônomo deve ser rastreável, auditável e reversível.\n\n**RegTech e Compliance Automatizado:**\nAs RegTechs (Regulatory Technology) utilizam IA para automatizar verificações de KYC (Know Your Customer) e triagens de AML (Anti-Money Laundering).\n\nEm 2025, o compliance deixa de ser focado apenas em evitar multas para se tornar motor de confiança e reputação. A detecção preditiva de anomalias permite que empresas respondam a riscos em tempo real — reduzindo drasticamente erros humanos e custo operacional.\n\n**Implicações estratégicas para 2025–2026:**\n— Governança de modelos de IA: políticas para uso ético e responsável de sistemas generativos\n— Infraestrutura de dados em nuvem: base para escalabilidade e segurança\n— Cultura de dados: o maior diferencial não será a tecnologia, mas a capacidade humana de interpretá-la e agir sobre ela\n— Inovação ambidestra: manter eficiência operacional (exploitação) enquanto se explora novas fronteiras (exploração) — o maior desafio organizacional da próxima década',
          },
        ],
      },
      {
        id: 'M1-1',
        title: 'Pensamento Criativo',
        blocks: [
          {
            id: 'M1-2-t1',
            type: 'text',
            title: 'Pensamento Criativo e Resolução de Problemas',
            body: 'Conteúdo em breve. Este bloco receberá o material sobre metodologias de pensamento criativo e sua aplicação em contextos empresariais.',
          },
        ],
      },
      {
        id: 'M1-2',
        title: 'Sustentabilidade em Negocios',
        blocks: [
          {
            id: 'M1-3-t1',
            type: 'text',
            title: 'Sustentabilidade como Vantagem Competitiva',
            body: 'Conteúdo em breve. Este bloco receberá o material sobre sustentabilidade empresarial, ESG e impacto no modelo de negócios.',
          },
        ],
      },
    ],
  },
  {
    moduleId: 'M2',
    topics: [
      { id: 'M2-0', title: 'Gestao de Negocios', blocks: [] },
      { id: 'M2-1', title: 'Demonstracoes Contabeis', blocks: [] },
      { id: 'M2-2', title: 'Matematica Financeira', blocks: [] },
    ],
  },
  {
    moduleId: 'M3',
    topics: [
      {
        id: 'M3-0',
        title: 'Economia de Empresa e Analise Mercadologica',
        blocks: [
          {
            id: 'M3-0-v1',
            type: 'video',
            title: 'M3-01 Economia de Empresa e Análise Mercadológica',
            url: 'https://qvvqbngiwqfuxsbgcxtc.supabase.co/storage/v1/object/public/videos/IPB/Marketing__Escassez_e_Escolha.mp4',
          },
          {
            id: 'M3-0-t1',
            type: 'text',
            title: 'Introdução',
            body: 'Marketing pode ser definido como uma série de atividades que levam a uma transação de troca com lucro entre comprador e vendedor. O composto de marketing — produto, preço, ponto-de-venda e promoção — é a ferramenta básica das empresas de hoje.\n\nA gênese do marketing reside em uma transformação estrutural profunda da economia política e da capacidade produtiva global. O marketing não emerge de uma necessidade comunicacional, mas de um imperativo econômico decorrente do colapso da assimetria histórica entre oferta e demanda.\n\nEra da Produção → Demanda > Oferta — o problema é produzir.\nEra do Marketing → Oferta > Demanda — o problema é vender.\n\nÉ nesse ponto que emerge o problema central que estrutura todo o campo do marketing: em um ambiente onde múltiplas ofertas competem por recursos limitados — tempo, dinheiro, atenção — como se organiza o processo de escolha?',
          },
          {
            id: 'M3-0-t2',
            type: 'text',
            title: 'Escassez, Custo de Oportunidade e a Natureza Decisória do Mercado',
            body: 'A economia define escassez não como falta absoluta, mas como a condição estrutural na qual os recursos disponíveis são insuficientes para atender a todas as necessidades e desejos simultaneamente.\n\nEscassez → Recursos < Necessidades\nEscolha → Toda decisão implica renúncia\nCusto de Oportunidade → Valor da melhor alternativa descartada\n\nToda a teoria econômica moderna, de Adam Smith a Mankiw, parte da mesma premissa: recursos são limitados, desejos são ilimitados, logo toda escolha implica renúncia.\n\nDo ponto de vista do consumidor, toda decisão de compra é, simultaneamente:\n— Uma decisão de aquisição\n— Uma decisão de renúncia\n— Uma decisão de alocação de recursos escassos\n\nDo ponto de vista das organizações, toda estratégia de marketing é uma estratégia de priorização:\n— Escolher mercados é renunciar a outros\n— Escolher posicionamentos é abandonar outros\n— Escolher públicos é excluir outros\n\nPara o marketing estratégico, se o tempo e a atenção do consumidor são finitos, a competição deixa de ser apenas contra concorrentes diretos e passa a ser uma luta contra qualquer estímulo que dispute a mesma janela de atenção ou o mesmo orçamento mental. O sucesso de uma marca reside na sua capacidade de organizar o processo de escolha de tal forma que o consumidor perceba que a renúncia necessária é a menor e mais vantajosa possível.',
          },
          {
            id: 'M3-0-s1',
            type: 'simulation',
            title: 'Timeline da Evolução do Marketing',
            simulationId: 'marketing-timeline',
            description: 'As 8 eras do marketing — da Era da Produção (1890) à Era da Decisão (2020–atual). Navegue por cada período e identifique o problema central e a lógica de cada fase.',
          },
          {
            id: 'M3-0-t3',
            type: 'text',
            title: 'O que é Marketing?',
            body: 'Antes de existir anúncio, marca ou estratégia, existe um problema mais profundo: como organizar trocas em um mundo onde recursos são limitados e escolhas têm custo? Marketing nasce exatamente nesse ponto.\n\nEnquanto tudo que se produzia era absorvido pelo mercado, marketing era desnecessário. Quando a capacidade de produzir superou a capacidade de absorver, surgiu a pergunta central: como fazer alguém escolher isto — e não aquilo?\n\nMarketing não nasce da criatividade. Marketing nasce da escassez.\n\nA American Marketing Association define marketing como o processo social pelo qual indivíduos e grupos obtêm o que necessitam e desejam, nos esforços de uma organização em satisfazer os desejos e necessidades de seu cliente, por meio da criação e troca de produtos e valores.\n\nAs definições de Kotler, Richers e Drucker convergem para o mesmo núcleo: marketing é o sistema pelo qual se organiza a criação, oferta, comunicação e entrega de valor para viabilizar trocas sob condições de restrição.\n\nO núcleo não é "promoção". O núcleo é troca.\n\nMarketing é um sistema de organização de valor, escolha e troca sob escassez. Existe para:\n— Reduzir incerteza\n— Reduzir risco percebido\n— Reduzir custo de decisão\n— Organizar percepção de valor\n— Facilitar escolha\n\nSe uma empresa precisa empurrar demais, explicar demais, insistir demais — isso não é marketing forte. É sistema fraco tentando compensar na força.',
          },
          {
            id: 'M3-0-s2',
            type: 'simulation',
            title: 'Mapa de Definições: Richers, Drucker e Kotler',
            simulationId: 'marketing-definitions',
            description: 'Compare as três definições fundacionais do marketing. Identifique o núcleo conceitual de cada autor e o que elas têm em comum.',
          },
          {
            id: 'M3-0-t4',
            type: 'text',
            title: 'Valor: o conceito mais mal interpretado do marketing',
            body: 'Valor não está no produto. Valor está na relação entre benefício percebido e custo percebido.\n\nO cérebro nunca pergunta "isso é objetivamente bom?" — ele pergunta "isso vale o que vai me custar?"\n\nCusto não é só dinheiro. Custo é:\n— Esforço físico e logístico\n— Tempo (custo de oportunidade do tempo gasto)\n— Risco (medo de errar)\n— Exposição social (risco de julgamento)\n— Energia mental (esforço cognitivo da decisão)\n— Frustração potencial\n\nPor isso produtos tecnicamente melhores perdem, soluções objetivamente piores vencem e marcas medianas dominam mercados. O cérebro não escolhe o melhor — escolhe o menos arriscado e menos custoso agora.\n\nApple e Chanel dominam porque manipulam essa balança:\n\nA exposição social deixa de ser custo e vira o maior benefício — comprar um iPhone ou uma bolsa Chanel zera o risco de julgamento negativo e entrega status, pertencimento e poder. O risco e o esforço mental despencam — a força da marca funciona como atalho cognitivo, eliminando a necessidade de comparar especificações.\n\nÉ a materialização de Drucker: "O objetivo do marketing é tornar a venda supérflua." Quando marketing e branding são bem executados ao longo do tempo, constroem atalhos sólidos no cérebro do consumidor. A lógica do menor risco e menor custo invisível comanda o show mesmo no mercado de alto luxo.',
          },
          {
            id: 'M3-0-s3',
            type: 'simulation',
            title: 'Balança de Valor Percebido',
            simulationId: 'value-balance',
            description: 'Ajuste os benefícios percebidos (funcional, social, emocional) e os custos percebidos (dinheiro, tempo, risco, esforço) e observe como o cérebro do consumidor decide.',
          },
          {
            id: 'M3-0-t5',
            type: 'text',
            title: 'Necessidade, Desejo e Demanda',
            body: 'Na teoria clássica:\n\nNecessidade = carência humana básica, fisiológica ou psicológica. Independe de cultura.\nDesejo = forma culturalmente específica de satisfazer uma necessidade. É aprendido.\nDemanda = desejo + capacidade real de troca. É o que o mercado efetivamente realiza.\n\nIsso é estrutural. Muitos negócios quebram porque:\n— Falam com o desejo mas não existe demanda real\n— Não existe capacidade de pagamento\n— Não existe contexto decisório adequado\n\nEntender a tríade é entender por que não basta ter um produto que as pessoas querem. É preciso que exista condição real de troca. Marketing sem demanda real é comunicação sem destino.',
          },
          {
            id: 'M3-0-s4',
            type: 'simulation',
            title: 'Diagnóstico: Necessidade, Desejo ou Demanda?',
            simulationId: 'need-desire-demand',
            description: 'Cenários reais de negócio — identifique se há necessidade, desejo ou demanda. Descubra por que produtos falham mesmo sendo desejados.',
          },
        ],
      },
      { id: 'M3-1', title: 'Lideranca e Gestao de Equipes', blocks: [] },
    ],
  },
  {
    moduleId: 'M4',
    topics: [
      { id: 'M4-0', title: 'Filosofia', blocks: [] },
      { id: 'M4-1', title: 'Calculo Aplicado a Negocios', blocks: [] },
      { id: 'M4-2', title: 'Analise Estatistica', blocks: [] },
    ],
  },
  {
    moduleId: 'M5',
    topics: [
      { id: 'M5-0', title: 'Leitura e Escrita Academica', blocks: [] },
      { id: 'M5-1', title: 'Empreendedorismo e Inovacao', blocks: [] },
      { id: 'M5-2', title: 'Ambiente Macroeconomico', blocks: [] },
    ],
  },
  {
    moduleId: 'M6',
    topics: [
      { id: 'M6-0', title: 'Analise Financeira', blocks: [] },
      { id: 'M6-1', title: 'Precificacao', blocks: [] },
      { id: 'M6-2', title: 'Etica', blocks: [] },
    ],
  },
  {
    moduleId: 'M7',
    topics: [
      { id: 'M7-0', title: 'Empreendedorismo Social', blocks: [] },
      { id: 'M7-1', title: 'Teologia e Sociedade', blocks: [] },
      { id: 'M7-2', title: 'Projeto de Intervencao em Negocios', blocks: [] },
    ],
  },
  {
    moduleId: 'M8',
    topics: [
      { id: 'M8-0', title: 'Educacao, Identidade e Solidariedade', blocks: [] },
      { id: 'M8-1', title: 'Pesquisa Aplicada a Negocios', blocks: [] },
    ],
  },
]
