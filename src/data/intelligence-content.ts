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
            id: 'M1-0-cap1',
            type: 'chapter',
            number: 1,
            title: 'Era Digital · As 3 Fases da Tecnologia',
            subtitle: 'Como o papel da TI mudou nas empresas — de bastidor operacional a coração do negócio',
            opening: {
              leadText: 'A evolução da tecnologia nas empresas pode ser segmentada em três fases distintas. Cada fase redefiniu o papel da TI dentro do negócio — de bastidor operacional a coração estratégico. Entender em qual fase sua empresa está hoje é o {{primeiro passo}} para qualquer transformação digital real.',
              showTimeline: true,
            },
            body: [
              {
                kind: 'paragraph',
                text: 'A evolução da tecnologia nas empresas pode ser segmentada em três fases distintas. Não são degraus de uma escada — são modos de operar. O que importa é reconhecer onde está o {{centro de gravidade}} da sua TI hoje.',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Fase 1 — Infraestrutura',
                    period: 'Anos 2000',
                    text: 'Foco na estabilidade de servidores e redes operacionais. A TI era setor de suporte: o sucesso era medido em {{uptime}}, não em receita. Manter os sistemas no ar para que o negócio acontecesse era a função inteira. Investir em tecnologia significava comprar hardware, contratar suporte e rezar para nada cair.',
                    caseStudy: {
                      company: 'Banco do Brasil',
                      year: 2003,
                      story: '{{R$ 2 bilhões}} investidos em datacenter para sustentar {{5.000 agências}} em rede. Cada hora de queda custava {{R$ 40 milhões}} em transações perdidas. TI era custo necessário, não diferencial competitivo.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'R$ 2 bi', label: 'Investimento em datacenter' },
                        { value: '5.000', label: 'Agências conectadas' },
                        { value: '99,9%', label: 'SLA exigido (uptime)' },
                      ],
                      quote: {
                        text: 'When a resource becomes essential to competition but inconsequential to strategy, the risks it creates become more important than the advantages it provides.',
                        author: 'Nicholas Carr · IT Doesn\'t Matter · HBR 2003',
                      },
                      insight: 'O paradoxo da Fase 1: TI virou {{pré-requisito de existir}}, não diferencial de competir. A consequência inevitável foi a corrida para a Fase 2 — quando estabilidade já era esperada e o jogo passou a ser eficiência.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Fase 2 — Processo',
                    period: 'Anos 2010',
                    text: 'Integração de sistemas como {{ERPs}} e CRMs no cotidiano da gestão. A informação para de morrer em planilhas isoladas e começa a fluir entre setores. A TI vira ferramenta de organização e padronização — mas ainda a serviço de um modelo de negócio existente. Aqui a pergunta dos diretores muda: "como otimizar?".',
                    caseStudy: {
                      company: 'Natura',
                      year: 2012,
                      story: 'Integração de {{7 países}} sob um único SAP. Decisões logísticas que levavam {{semanas viraram horas}}. Planilhas regionais viraram dashboards globais — mas a operação continuava sendo venda direta + varejo, só que mais rápida e auditável.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '7 países', label: 'Integrados sob 1 ERP' },
                        { value: 'Semanas → horas', label: 'Tempo de decisão logística' },
                        { value: '~R$ 500M', label: 'Economia projetada em 5 anos' },
                      ],
                      quote: {
                        text: 'You can see the computer age everywhere but in the productivity statistics.',
                        author: 'Robert Solow · MIT · Paradoxo de Solow 1987',
                      },
                      insight: 'A Fase 2 entrega {{eficiência}} mas não cria modelos de negócio novos. O teto da Fase 2 é o quanto o modelo antigo aguenta — quando a digitalização chega no limite, ou se rompe o modelo (Fase 3) ou se estagna.',
                    },
                  },
                  {
                    index: 3,
                    title: 'Fase 3 — Estratégia',
                    period: 'Anos 2020 →',
                    text: 'A tecnologia define a criação de produtos, o atendimento ao cliente e a capacidade de inovar — tornando-se pilar de competitividade e reputação. A TI deixa de ser área de apoio e vira o próprio negócio. Dados, algoritmos e {{efeitos de rede}} criam vantagens que se auto-reforçam: mais usuários geram mais dados, que melhoram o algoritmo, que atrai mais usuários.',
                    caseStudy: {
                      company: 'iFood',
                      year: 2023,
                      story: '{{R$ 100 bilhões/ano}} movimentados {{sem cozinha própria}} nem motoboy próprio. A plataforma é o produto. Sem o algoritmo de matching e a infraestrutura digital, simplesmente não existe negócio para operar.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'R$ 100 bi', label: 'GMV anual' },
                        { value: '0', label: 'Cozinhas próprias' },
                        { value: '0', label: 'Frota própria' },
                      ],
                      quote: {
                        text: 'The key insight is that digital technologies do their most transformative work in combination with complementary investments in organizational capital.',
                        author: 'Erik Brynjolfsson · MIT · The Second Machine Age 2014',
                      },
                      insight: 'A Fase 3 inverte o jogo: TI deixa de ser {{custo a se controlar}} e vira {{ativo a se multiplicar}}. O investimento se mede em retorno de produto, não em uptime. E quem fica preso em Fase 1 ou 2 perde o jogo sem perceber que ele mudou.',
                    },
                  },
                ],
              },
              {
                kind: 'paragraph',
                text: 'A pergunta que separa empresas que sobrevivem das que lideram não é "qual tecnologia adotar?" — é "em qual fase estamos hoje, e em qual fase o mercado ao redor já chegou?". A diferença entre as duas respostas é o {{gap}} que precisa ser fechado. E quanto maior o gap, mais doloroso o salto.',
              },
              {
                kind: 'paragraph',
                text: 'Empresas que operam em fase de Processo enquanto o mercado está em fase de Estratégia perdem competitividade de forma sistemática e silenciosa. O problema é que essa perda é {{invisível}} até que um concorrente digital capture seus clientes. Quando percebe, o gap já é grande demais para fechar com investimento incremental.',
              },
              {
                kind: 'paragraph',
                text: 'O custo de ficar parado é composto. Enquanto uma empresa estagnada perde eficiência linearmente (5-8% ao ano em custos evitáveis), seus concorrentes digitalizados crescem exponencialmente via efeitos de rede e dados acumulados. Em 5 anos, uma empresa de R$ 10 milhões de receita com 5% de perda anual e mercado crescendo 12% pode acumular um gap de mais de {{R$ 9 milhões}} — quase sua receita inteira.',
              },
],
            application: {
              kind: 'compare-and-drag',
              intro: 'Antes de classificar, veja as três fases lado a lado em quatro dimensões. Repare como a velocidade de decisão e a vantagem competitiva crescem juntas — não por acaso. Depois, arraste cinco empresas conhecidas para a fase em que elas operam hoje.',
              compare: {
                columnHeaders: ['Fase 1 · Infra', 'Fase 2 · Processo', 'Fase 3 · Estratégia'],
                rows: [
                  {
                    label: 'Papel da TI',
                    values: ['Suporte operacional', 'Organização e fluxo', 'O próprio negócio'],
                    viz: 'icons',
                    icons: ['◯', '◑', '●'],
                  },
                  {
                    label: 'Foco do investimento',
                    values: ['Servidores e redes', 'ERP, CRM, BI', 'Dados, IA, plataforma'],
                    viz: 'icons',
                    icons: ['▦', '⊞', '◈'],
                  },
                  {
                    label: 'Velocidade de decisão',
                    values: ['Semanas', 'Dias', 'Tempo real'],
                    viz: 'bars',
                    intensities: [0.18, 0.55, 1.0],
                  },
                  {
                    label: 'Vantagem competitiva',
                    values: ['Nenhuma', 'Eficiência operacional', 'Plataforma e dados'],
                    viz: 'bars',
                    intensities: [0.05, 0.5, 1.0],
                  },
                ],
              },
              drag: {
                instruction: 'Toque numa empresa, depois toque na fase em que ela opera hoje:',
                zones: [
                  { id: 'fase1', label: 'Fase 1 · Infraestrutura' },
                  { id: 'fase2', label: 'Fase 2 · Processo' },
                  { id: 'fase3', label: 'Fase 3 · Estratégia' },
                ],
                items: [
                  {
                    id: 'mercearia',
                    label: 'Mercearia de bairro',
                    sublabel: 'Estoque numa planilha. Vendas no caderno. Conta no banco digital. Cada parte opera por conta própria.',
                    correctZone: 'fase1',
                    correctFeedback: 'Certo. A maioria das micro e pequenas empresas brasileiras ainda vive na Fase 1 — tecnologia avulsa, sem integração entre estoque, vendas e financeiro. Funciona, mas a empresa não enxerga a si mesma.',
                    wrongFeedback: 'Repense. A mercearia tradicional opera na Fase 1: usa tecnologia, mas cada peça é isolada. Não há fluxo de dados entre setores — é o oposto de "processo integrado".',
                  },
                  {
                    id: 'natura',
                    label: 'Natura',
                    sublabel: '7 países integrados sob um único SAP. Decisões em horas, não semanas. O modelo continua sendo venda direta — só que mais rápido.',
                    correctZone: 'fase2',
                    correctFeedback: 'Certo. A integração SAP em 7 países é Fase 2 madura: a operação é digital, integrada e auditável, mas o modelo de negócio continua sendo venda direta + varejo. A TI virou a malha — não virou o produto.',
                    wrongFeedback: 'Não exatamente. Natura digitalizou e integrou tudo, mas o modelo de negócio (venda direta + varejo) continua o mesmo. Isso é Fase 2: eficiência sobre o modelo antigo, não reinvenção.',
                  },
                  {
                    id: 'magalu',
                    label: 'Magazine Luiza',
                    sublabel: 'Lojas físicas viraram mini-CDs de uma plataforma. O app virou super-app. Marketplace passa de R$ 50 bi/ano.',
                    correctZone: 'fase3',
                    correctFeedback: 'Certo. Magalu é a transição mais emblemática do Brasil: nasceu Fase 1, atravessou Fase 2, e VIROU plataforma. Lojas hoje servem o app, não o contrário. Modelo de negócio inteiro foi reescrito.',
                    wrongFeedback: 'Repense. Desde a chegada de Frederico Trajano, Magalu se transformou numa plataforma digital onde a tecnologia É o produto. Lojas viraram mini-CDs servindo o app — isso é Fase 3.',
                  },
                  {
                    id: 'nubank',
                    label: 'Nubank',
                    sublabel: 'Sem agência. Sem fila. Sem papelada. O algoritmo aprova o crédito, o app é o atendimento.',
                    correctZone: 'fase3',
                    correctFeedback: 'Certo. Nubank é Fase 3 nascida pronta — não veio de salto, começou onde os outros precisam chegar. O produto inteiro É tecnologia: algoritmo de crédito, app, atendimento. Sem software, não existe banco.',
                    wrongFeedback: 'Repense. Nubank não tem agência física para "manter no ar" (Fase 1) nem digitalizou processos antigos (Fase 2). Nasceu como software puro — Fase 3 desde o dia zero.',
                  },
                  {
                    id: 'ifood',
                    label: 'iFood',
                    sublabel: 'Sem cozinha. Sem frota. O algoritmo casa pedido com restaurante e entregador. R$ 100 bi/ano.',
                    correctZone: 'fase3',
                    correctFeedback: 'Certo. iFood é Fase 3 levada ao extremo: a empresa praticamente não tem ativos físicos. É só matching algorítmico — restaurantes e entregadores são parceiros, não folha. A plataforma É o produto inteiro.',
                    wrongFeedback: 'Repense. iFood não tem cozinha (não é Fase 1 com servidores no ar), nem digitalizou um restaurante existente (não é Fase 2). É só algoritmo de matching — Fase 3 no extremo.',
                  },
                ],
              },
            },
            synthesis: {
              closingText: 'Mover-se entre fases não é só comprar tecnologia nova — é {{repensar o papel da TI}} dentro da empresa. Nem toda empresa precisa estar na Fase 3, mas toda empresa precisa saber em qual fase está e por quê. Esse repensar — essa mudança de identidade da organização — é o que se chama Transformação Digital.',
              keyInsights: [
                'TI deixa de ser bastidor quando dados e algoritmos criam vantagens que se {{auto-reforçam}}.',
                'Não existe atalho entre fases — cada salto exige redesenhar o papel da tecnologia, não só comprar mais dela.',
                'O risco maior não é estar atrasado, é {{não saber em qual fase você está}} hoje.',
              ],
              nextChapterHint: 'Capítulo 2 · Transformação Digital',
              nextChapterBlurb: 'Por que comprar tecnologia não basta — e o que separa digitização de transformação real.',
            },
          },
          {
            id: 'M1-0-cap2',
            type: 'chapter',
            number: 2,
            title: 'Transformação Digital',
            subtitle: 'Não é comprar tecnologia — é repensar como a empresa cria e entrega valor',
            opening: {
              leadText: 'A transformação digital é o processo de integração de tecnologias digitais em {{todas as áreas}} de uma organização, mudando a forma como ela opera e entrega valor aos seus clientes. Não se trata apenas de implementar novas tecnologias, mas de uma {{mudança cultural}} que exige que as organizações desafiem continuamente o status quo, experimentem e se sintam confortáveis com o fracasso.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'A transformação digital é o processo de integração de tecnologias digitais em todas as áreas de uma organização, mudando a forma como ela opera e entrega valor aos seus clientes. Não se trata apenas de implementar novas tecnologias, mas de uma {{mudança cultural}} que exige que as organizações desafiem continuamente o status quo, experimentem e se sintam confortáveis com o fracasso.',
              },
              {
                kind: 'paragraph',
                text: 'Aqui é fundamental distinguir três conceitos que costumam ser confundidos — e a confusão custa bilhões em investimentos mal direcionados. **Digitização** é converter papel em PDF — é condição necessária mas insuficiente. **Digitalização** é automatizar fluxos usando tecnologia — o processo continua o mesmo, só fica mais rápido. **Transformação Digital** é fundamentalmente repensar o modelo de negócio e a proposta de valor usando capacidades digitais. Segundo IBGE (PINTEC 2020) e pesquisas do Sebrae, apenas {{23%}} das PMEs brasileiras utilizam algum sistema integrado, e menos de 5% utilizam dados para decisão (CETIC.br, TIC Empresas 2022).',
              },
              {
                kind: 'pillar-grid',
                title: 'Os 4 domínios da transformação (Rogers, Columbia 2016)',
                pillars: [
                  { icon: '👥', title: 'Clientes', description: 'De audiência passiva a {{rede ativa}} que co-cria valor. Não pergunte o que querem — observe o que fazem.', metric: { value: '80M', label: 'clientes Nubank (sem agência)' }, caseCompany: 'Nubank', caseResult: 'CAC R$30-50 vs R$800+ bancário tradicional' },
                  { icon: '⚔️', title: 'Competição', description: 'Não vem mais só do setor. {{Plataformas}} redefinem fronteiras — iFood compete com restaurantes E com supermercados.', metric: { value: 'R$100B', label: 'GMV iFood (sem cozinha)' }, caseCompany: 'iFood', caseResult: 'Zero ativos físicos, 100% plataforma' },
                  { icon: '📊', title: 'Dados', description: 'De subproduto caro a {{ativo estratégico}} sempre ligado. Quem não decide por dados decide por opinião.', metric: { value: '2B+', label: 'eventos/dia (Mercado Livre)' }, caseCompany: 'Mercado Livre', caseResult: 'Personalização em tempo real para 200M+ usuários' },
                  { icon: '💡', title: 'Inovação', description: 'De produto acabado a {{MVP contínuo}}. Lançar rápido, medir, iterar. Falhar barato e cedo.', metric: { value: '5 dias', label: 'ciclo Design Sprint (Google)' }, caseCompany: 'Google', caseResult: 'Gmail nasceu de experimentação livre' },
                ],
              },
              {
                kind: 'paragraph',
                text: 'David Rogers (Columbia Business School, 2016) propôs que a transformação digital acontece nesses 4 domínios simultaneamente — não sequencialmente. O insight central: {{transformação não é sobre tecnologia — é sobre estratégia}}. George Westerman (MIT Sloan, 2014) pesquisou 391 empresas em 30 países e classificou-as em 4 quadrantes. Apenas os "Digirati" (alta capacidade digital + alta liderança) superam consistentemente os pares — 26% mais lucrativos, 9% maior receita, 12% maior valorização de mercado.',
              },
                            {
                kind: 'heading',
                text: 'Teoria da inovação aplicada a negócios',
              },
              {
                kind: 'paragraph',
                text: 'Joseph Schumpeter (1942) cunhou o conceito de {{destruição criativa}} — a inovação como motor do capitalismo que destrói o velho para criar o novo. Toda empresa que inova canibaliza algo que existia antes. A Kodak inventou a câmera digital mas não canibalizou o filme — e faliu. O Nubank canibalizou a agência bancária — e virou o maior banco digital do mundo fora da China.',
              },
              {
                kind: 'paragraph',
                text: 'Clayton Christensen (Harvard, 1997) separou inovação em tipos: {{incremental}} (melhorar o que existe — Havaianas reinventando design), {{radical}} (criar categoria nova — PIX substituindo TED/DOC) e {{disruptiva}} (começar por baixo e dominar — Nubank atendendo quem bancos tradicionais ignoravam). Distinção crítica: iPhone NÃO é disruptivo por Christensen — nasceu premium. Disruptiva começa simples e barata.',
              },
              {
                kind: 'paragraph',
                text: 'Eric Ries (2011) propôs o {{Lean Startup}}: construir-medir-aprender. Em vez de planejar 2 anos e lançar produto acabado, lançar o MVP (Minimum Viable Product) em semanas, medir o que funciona e iterar. Chan Kim e Renée Mauborgne (INSEAD, 2005) propuseram a {{Estratégia do Oceano Azul}}: em vez de competir no mercado existente (oceano vermelho), criar mercado novo onde não há concorrência. O iFood não competiu com restaurantes — criou uma nova categoria de consumo.',
              },
              {
                kind: 'paragraph',
                text: 'Henry Chesbrough (Berkeley, 2003) introduziu a {{inovação aberta}}: empresas não precisam inovar sozinhas. Podem importar ideias de fora (universidades, startups, fornecedores) e exportar tecnologias que não usam. A Natura faz isso com comunidades da Amazônia; a Embraer com centros de pesquisa internacionais. O oposto — inovação fechada — é o modelo que matou a Kodak.',
              },
              {
                kind: 'heading',
                text: 'Frameworks prescritivos: como executar',
              },
              {
                kind: 'paragraph',
                text: '**OKRs** (Objectives and Key Results) — framework usado por Google, Nubank e iFood para alinhar inovação com resultado. Objetivo = o que quero alcançar. Key Results = como vou medir. Diferente de KPIs tradicionais, OKRs são ambiciosos por definição — atingir 70% já é sucesso. **Design Sprint** (Google Ventures, 2016) — método de 5 dias para validar uma ideia sem construir produto: mapear o problema (segunda), desenhar soluções (terça), decidir a melhor (quarta), prototipar (quinta), testar com usuários (sexta).',
              },
              {
                kind: 'paragraph',
                text: '**Agile/Scrum** não é metodologia de TI — é cultura organizacional. Ciclos curtos (sprints de 2 semanas), entrega contínua, feedback do cliente a cada ciclo. Empresas como Spotify organizaram equipes em {{squads}} (times autônomos de 6-8 pessoas) que combinam velocidade de startup com escala de corporação. No Brasil, a Magazine Luiza adotou squads para transformar lojas em plataforma — cada squad era responsável por uma funcionalidade do super-app.',
              },
{
                kind: 'heading',
                text: 'Sinergia entre gestão da inovação e transformação digital',
              },
              {
                kind: 'paragraph',
                text: 'Os Sistemas de Gestão da Inovação (SGI) e a Transformação Digital (TD) frequentemente evoluem de forma paralela, embora ambos visem a dinâmica inovadora. A integração desses domínios permite que o SGI oriente as iniciativas de TD ao estruturar processos para lidar com projetos de alta incerteza, enquanto a TD oferece as ferramentas tecnológicas para potencializar a eficácia desses sistemas.',
              },
              {
                kind: 'pillar-grid',
                title: '4 elementos da integração SGI + TD',
                pillars: [
                  { icon: '🏗️', title: 'Estrutura de Projetos', description: 'SGI gerencia incertezas com metodologias; TD fornece ferramentas de {{colaboração em tempo real}}.' },
                  { icon: '⚙️', title: 'Processos', description: 'SGI organiza o fluxo de ideação; TD {{automatiza}} o funil e a coleta de feedbacks.' },
                  { icon: '🧬', title: 'Cultura', description: 'SGI estimula experimentação e {{aceitação do erro}}; TD democratiza dados para decisões ágeis.' },
                  { icon: '📈', title: 'Resultados', description: 'SGI mantém foco estratégico no {{ROI}}; TD entrega analytics para medir impacto em larga escala.' },
                ],
              },
              {
                kind: 'paragraph',
                text: 'A integração entre SGI e TD gera benefícios mútuos que podem ser compreendidos nesses quatro elementos centrais. Na prática, empresas que integram os dois domínios reportam ciclos de inovação {{40% mais curtos}} e taxa de sucesso de novos projetos 2x maior do que empresas que tratam inovação e tecnologia como silos separados.',
              },
],
            application: {
              kind: 'compare-and-drag',
              intro: 'Três conceitos são confundidos constantemente. Veja a diferença — depois classifique ações reais.',
              compare: {
                columnHeaders: ['Digitização', 'Digitalização', 'Transformação'],
                rows: [
                  { label: 'O que faz', values: ['Converte formato', 'Automatiza processo', 'Repensa modelo'], viz: 'icons', icons: ['📄', '⚙️', '🔄'] },
                  { label: 'Nível de mudança', values: ['Formato', 'Processo', 'Identidade'], viz: 'bars', intensities: [0.2, 0.55, 1.0] },
                ],
              },
              drag: {
                instruction: 'Classifique: digitização, digitalização ou transformação?',
                zones: [
                  { id: 'dz', label: 'Digitização' },
                  { id: 'dl', label: 'Digitalização' },
                  { id: 'td', label: 'Transformação' },
                ],
                items: [
                  { id: 'pdf', label: 'Escanear contratos na nuvem', correctZone: 'dz', correctFeedback: 'Certo. Mudar formato é digitização.', wrongFeedback: 'Escanear é só mudar formato — digitização.' },
                  { id: 'erp', label: 'Natura integra 7 países com SAP', correctZone: 'dl', correctFeedback: 'Certo. Automatizou processos, modelo continua.', wrongFeedback: 'SAP automatiza processos existentes — digitalização.' },
                  { id: 'magalu', label: 'Magalu: lojas viram plataforma', correctZone: 'td', correctFeedback: 'Certo. Mudou o que a empresa É.', wrongFeedback: 'Magalu mudou o modelo inteiro — transformação.' },
                  { id: 'pix', label: 'PIX substitui TED/DOC', correctZone: 'td', correctFeedback: 'Certo. Sistema novo que tornou antigo obsoleto.', wrongFeedback: 'PIX redesenhou pagamentos — transformação.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Transformação digital não é sobre comprar tecnologia — é sobre {{repensar como a empresa cria e entrega valor}}. Rogers (Columbia, 2016): os 4 domínios devem ser transformados simultaneamente, não sequencialmente.',
              keyInsights: [
                'Digitização ≠ Digitalização ≠ Transformação — a confusão custa {{bilhões}} em investimentos mal direcionados.',
                'SGI + TD integrados geram benefícios em 4 frentes: projetos, processos, cultura e {{resultados mensuráveis}}.',
              ],
              nextChapterHint: 'Capítulo 3 · Governança, Cultura e Mudança',
              nextChapterBlurb: 'Os 4 pilares que sustentam qualquer transformação — e os 5 passos para não fracassar.',
            },
          },
          {
            id: 'M1-0-cap3',
            type: 'chapter',
            number: 3,
            title: 'Governança Digital, Cultura e Gestão da Mudança',
            subtitle: 'Os 4 pilares que sustentam — e os 5 passos que executam',
            opening: {
              leadText: 'A governança digital é o conjunto de práticas que garantem que a tecnologia seja usada de maneira eficiente e alinhada às estratégias organizacionais. Em um ambiente em que os dados são o principal ativo, não dar o devido valor à governança pode colocar em risco a {{sustentabilidade}} de uma organização. Pilares são estruturas que mantêm algo em pé — se um falha, a casa desaba.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'A governança digital é o conjunto de práticas e de processos que garantem que a tecnologia seja usada de maneira eficiente e alinhada às estratégias organizacionais. Ela envolve a gestão de recursos tecnológicos, a segurança da informação, a conformidade com regulamentações e a garantia de que os investimentos em tecnologia estejam gerando valor para a organização.',
              },
              {
                kind: 'paragraph',
                text: 'Em um ambiente em que os dados são o principal ativo, não dar o devido valor à governança digital pode colocar em risco a {{sustentabilidade}} de uma organização ao longo do tempo. As principais atribuições da governança digital incluem: {{Segurança da informação}} — proteger as informações sensíveis contra ameaças internas e externas. {{Alinhamento estratégico}} — garantir que o uso da tecnologia esteja alinhado à estratégia de longo prazo da organização. {{Melhoria da eficiência}} — processos automatizados e bem gerenciados reduzem desperdícios, melhoram a produtividade e promovem a inovação. {{Conformidade legal}} — regulamentações como a LGPD no Brasil e o GDPR na Europa tornaram a governança digital essencial para garantir que as empresas estejam em conformidade com as leis de proteção de dados. Para a governança digital manter-se sólida, é fundamental que seus pilares sejam bem construídos e funcionem conjuntamente. Caso contrário, a "casa pode desabar".',
              },
              {
                kind: 'pillar-grid',
                title: 'Os 4 pilares da governança digital',
                pillars: [
                  { icon: '🎯', title: 'Estratégia', description: 'Estabelece como a tecnologia será usada para atingir objetivos. Prioridades, investimentos e {{indicadores}}. Não faz sentido investir em tech desalinhada do futuro da empresa.', metric: { value: '+30%', label: 'pedidos digitais (Ambev BEES)' }, caseCompany: 'Ambev', caseResult: '1M+ PDVs conectados via BEES' },
                  { icon: '🛡️', title: 'Riscos e Segurança', description: 'Identificar, avaliar e mitigar ameaças. Criptografia, {{2FA}}, treinamento contínuo. A maior vulnerabilidade não é técnica — é humana.', metric: { value: '$4.88M', label: 'custo médio breach (IBM 2024)' }, caseCompany: 'Renner', caseResult: 'R$ 20M perdidos por ransomware (2021)' },
                  { icon: '📋', title: 'Políticas e Procedimentos', description: 'Regras claras padronizam processos. Quanto mais padronizado, mais {{fidedignos}} os dados — e mais seguras as decisões. Inclui uso de dispositivos, acesso a dados sensíveis, escolha de fornecedores.', metric: { value: '5d → 2h', label: 'relatórios (Itaú open data)' }, caseCompany: 'Itaú', caseResult: 'Dados abertos entre áreas com governança' },
                  { icon: '🔄', title: 'Monitoramento Contínuo', description: 'Não faz sentido construir e não manter. O monitoramento garante que sistemas sejam {{ajustados}} conforme a tecnologia avança.', metric: { value: '2B+', label: 'eventos/dia (Mercado Livre)' }, caseCompany: 'Mercado Livre', caseResult: 'Auto-scaling sem intervenção humana' },
                ],
              },
              {
                kind: 'heading',
                text: 'Cultura organizacional e gestão da mudança',
              },
              {
                kind: 'paragraph',
                text: 'A tecnologia é apenas um dos componentes da transformação digital; o fator humano e a cultura organizacional representam os maiores desafios e, simultaneamente, os maiores facilitadores do sucesso. A resistência à mudança é um fenômeno natural em organizações com identidades culturais fortes e processos tradicionais.',
              },
              {
                kind: 'paragraph',
                text: 'As barreiras mais comuns incluem o {{medo do erro}}, a resistência à mudança e a punição ao fracasso, que inibem a experimentação necessária para inovar. Culturas centralizadoras que inibem o protagonismo dos colaboradores e o desalinhamento entre o discurso da liderança e as práticas diárias também enfraquecem o engajamento. Além disso, a falta de uma visão integrada, onde a transformação é vista apenas como responsabilidade do setor de TI, compromete o esforço coletivo necessário.',
              },
              {
                kind: 'step-flow',
                title: '5 passos para a mudança bem-sucedida',
                steps: [
                  { number: 1, title: 'Diagnóstico e Alinhamento Estratégico', description: 'Compreender o cenário atual e definir a visão estratégica. A governança digital garante que as iniciativas estejam alinhadas aos {{objetivos estratégicos}}. Cada investimento em tecnologia deve contribuir para o alcance das metas organizacionais.', caseSnippet: 'Magalu: Trajano fez diagnóstico antes de investir — identificou lojas como ativo, não passivo.' },
                  { number: 2, title: 'Liderança Ativa', description: 'Líderes devem ser os {{primeiros}} a incorporar comportamentos digitais e valores de inovação. Se o diretor não usa o CRM, a equipe também não vai.', author: 'Kotter, Harvard, 1996: 70% das transformações falham por falta de urgência no topo', caseSnippet: 'Natura: CEO nos treinamentos SAP — adoção acelerou 40% vs cronograma.' },
                  { number: 3, title: 'Comunicação Transparente', description: 'Explicar o "porquê" da mudança para gerar engajamento. A governança digital assegura que as decisões sejam baseadas em {{informações e dados precisos}}, não em hierarquia ou intuição.', caseSnippet: 'Nubank: explicou novo sistema IA a todos — zero sabotagem interna.' },
                  { number: 4, title: 'Treinamento e Capacitação', description: 'Desenvolver habilidades técnicas e comportamentais ({{soft skills}}) para o novo ambiente. A governança promove eficiência no uso de recursos tecnológicos, evitando desperdícios.', author: 'Brynjolfsson, MIT, 2003: investimentos complementares em treinamento são 5-10x maiores que em tech', caseSnippet: 'TOTVS: 500+ cursos. Com treinamento: 85% retenção. Sem: 40%.' },
                  { number: 5, title: 'Espaços Seguros para Experimentar', description: 'Criar ambientes onde ideias possam ser testadas {{sem medo}} de punição severa em caso de erro. Estudos indicam que práticas de gestão da mudança impactam positivamente a atitude dos funcionários.', author: 'Edmondson, Harvard, 2018: segurança psicológica = fator #1 de alta performance', caseSnippet: 'Google Aristotle (180 equipes): segurança psicológica é o fator #1.' },
                ],
              },
                            {
                kind: 'paragraph',
                text: 'A gestão de riscos na transformação digital envolve a adoção de novas tecnologias que podem introduzir vulnerabilidades de segurança. A governança digital ajuda a identificar, avaliar e mitigar esses riscos, garantindo que a organização esteja protegida. A gestão da mudança é uma metodologia que planeja, comunica, implementa e avalia as transformações para garantir que {{todos os colaboradores}} adotem as novas tecnologias.',
              },
{
                kind: 'heading',
                text: 'Estruturas e frameworks de governança',
              },
              {
                kind: 'paragraph',
                text: 'A implementação da governança digital não requer a criação de processos do zero, mas sim a adaptação de frameworks reconhecidos que equilibram controle e agilidade. Comitês de governança devem reunir gestores de diferentes áreas para discutir e aprovar decisões relacionadas à tecnologia. Garantem que as decisões sejam tomadas de forma colaborativa e estratégica. Decisões individualizadas devem ser evitadas quando se trata de governança digital, pois o nível de complexidade das informações tende a ser maior quando construída com {{apoio tecnológico}}. Organizações menores ou mais ágeis podem optar por um modelo descentralizado, em que cada departamento tem autonomia para gerenciar suas próprias tecnologias, seguindo diretrizes gerais. Estruturas excessivamente centralizadoras, em que o gestor exige assumir todas as decisões, comprometem a velocidade de decisão — e velocidade é diferencial competitivo.',
              },
              {
                kind: 'paragraph',
                text: '**COBIT** (ISACA, 1996/2019) é a referência global para governança de TI no nível estratégico — conecta objetivos de negócio às metas de tecnologia, definindo papéis, responsabilidades e métricas de controle. **ISO/IEC 38500** (2008/2015) fornece princípios para dirigentes: avaliação do uso atual e futuro da TI, direção para implementação de planos e políticas, e monitoramento de conformidade. **ITIL 4** (2019) foca na parte tática e operacional, organizando fluxos de entrega integrando IA e cloud.',
              },
              {
                kind: 'paragraph',
                text: 'Para PMEs, governança simplificada: backup automático diário (R$ 0-50/mês), autenticação em dois fatores em todas as contas (R$ 0), um responsável por tecnologia (mesmo acumulando função), política de senhas com gerenciador, e revisão trimestral de ferramentas e custos. Governança digital para PME não é burocracia — é evitar que um ransomware apague seus dados, que um ex-funcionário acesse seu CRM, ou que você pague {{5 ferramentas}} para fazer o trabalho de 2.',
              },
],
            application: {
              kind: 'compare-and-drag',
              intro: 'Os 4 pilares sustentam a governança. Classifique cada prática no pilar correto.',
              compare: {
                columnHeaders: ['Estratégia', 'Riscos', 'Políticas', 'Monitoramento'],
                rows: [
                  { label: 'Foco', values: ['Direção e KPIs', 'Proteção', 'Padronização', 'Evolução'], viz: 'icons', icons: ['🎯', '🛡️', '📋', '🔄'] },
                  { label: 'Custo de falhar', values: ['Investimento perdido', 'Dados vazados', 'Decisões erradas', 'Obsolescência'], viz: 'bars', intensities: [0.6, 1.0, 0.7, 0.5] },
                ],
              },
              drag: {
                instruction: 'Classifique cada prática no pilar correto:',
                zones: [
                  { id: 'est', label: 'Estratégia' },
                  { id: 'ris', label: 'Riscos' },
                  { id: 'pol', label: 'Políticas' },
                  { id: 'mon', label: 'Monitoramento' },
                ],
                items: [
                  { id: 'kpi', label: 'Definir KPIs de resultado da tecnologia', correctZone: 'est', correctFeedback: 'Certo. Medir resultado é Estratégia.', wrongFeedback: 'KPIs são Estratégia.' },
                  { id: '2fa', label: '2FA obrigatório em todas as contas', correctZone: 'ris', correctFeedback: 'Certo. Proteção de acesso = Riscos.', wrongFeedback: '2FA é proteção — Riscos.' },
                  { id: 'senhas', label: 'Política de senhas de 12+ caracteres', correctZone: 'pol', correctFeedback: 'Certo. Padronização = Políticas.', wrongFeedback: 'Senhas padronizadas = Políticas.' },
                  { id: 'rev', label: 'Revisão trimestral de ferramentas', correctZone: 'mon', correctFeedback: 'Certo. Revisão periódica = Monitoramento.', wrongFeedback: 'Revisão é Monitoramento.' },
                  { id: 'inc', label: 'Plano de resposta a ataques', correctZone: 'ris', correctFeedback: 'Certo. Resposta a incidente = Riscos.', wrongFeedback: 'Plano de resposta = Riscos.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Governança não é burocracia — é o que impede que um ransomware apague seus dados, que um ex-funcionário acesse seu CRM, ou que você pague 5 ferramentas para fazer o trabalho de 2. Os 5 passos da mudança são o caminho comprovado: de {{Kotter}} (Harvard) a {{Edmondson}} (Harvard).',
              keyInsights: [
                'Kotter (1996): {{70% das transformações falham}} — motivo #1 é liderança, não tecnologia.',
                'Governança para PME: R$ 0-50/mês. Renner perdeu {{R$ 20M}} sem ela.',
                'Segurança psicológica (Edmondson, Harvard 2018) é o fator {{#1}} de equipes de alta performance.',
              ],
              nextChapterHint: 'Capítulo 4 · Ferramentas Digitais e Marco Regulatório',
              nextChapterBlurb: 'De Analytics-to-Value à LGPD — as ferramentas que operacionalizam a transformação.',
            },
          },
          {
            id: 'M1-0-cap4',
            type: 'chapter',
            number: 4,
            title: 'Ferramentas Digitais, LGPD e Tendências',
            subtitle: 'De Analytics-to-Value à era dos agentes autônomos',
            opening: {
              leadText: 'Empresas líderes estão adotando práticas que exploram dados em {{larga escala}} para otimizar portfólio e decisões. Mas ferramentas sozinhas não bastam — é necessário uma cultura que estimule {{pensamento crítico}} em todos os níveis. E o marco regulatório brasileiro define os limites dentro dos quais a inovação deve operar.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'Empresas líderes estão adotando o Analytics-to-Value (AtV), um conjunto de práticas que utiliza digital e analytics para otimizar o portfólio e reduzir custos de produtos. Enquanto os métodos tradicionais (Design-to-Value) focam em componentes isolados, o AtV explora dados internos e externos em {{larga escala}}, gerando insights em poucos dias para todo o portfólio da empresa.',
              },
              {
                kind: 'paragraph',
                text: 'A Tomada de Decisão Baseada em Dados (Data-Driven Decision Making — DDDM) é definida como o uso de fatos, métricas e dados para orientar decisões comerciais estratégicas. No entanto, a tecnologia de análise sozinha não é suficiente; é necessário criar uma cultura que estimule o {{pensamento crítico}} e a curiosidade em todos os níveis da organização.',
              },
              {
                kind: 'pillar-grid',
                title: 'Os 4 pilares da decisão baseada em dados',
                pillars: [
                  { icon: '💾', title: 'Coleta e Armazenamento', description: 'Habilidade de capturar dados de forma eficiente. APIs, IoT, formulários, {{integrações automáticas}}.' },
                  { icon: '🧠', title: 'Análise e Processamento', description: 'Extração de informações relevantes através de modelos estatísticos e {{machine learning}}.' },
                  { icon: '📈', title: 'Visualização e Comunicação', description: 'Apresentação clara de resultados para que {{não-especialistas}} possam agir sobre eles.' },
                  { icon: '🎯', title: 'Integração Estratégica', description: 'Uso dos insights nos processos decisórios {{diários}} da liderança — não num relatório que ninguém lê.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Governança de dados e o marco regulatório brasileiro',
              },
              {
                kind: 'paragraph',
                text: 'A transformação digital no Brasil ocorre sob um rigoroso arcabouço legal que visa proteger o cidadão e incentivar a inovação responsável. A Lei Geral de Proteção de Dados ({{LGPD}}, Lei 13.709/2018) e a Lei do Governo Digital (14.129/2021) são os pilares desse ecossistema.',
              },
              {
                kind: 'paragraph',
                text: 'O sandbox regulatório é um ambiente experimental que permite a testagem de modelos de negócios inovadores com flexibilidade temporária em normas e penalidades. O Marco Civil das Startups (LC 182/21) institucionalizou essa prática, permitindo que órgãos reguladores como a ANPD explorem tecnologias emergentes. Recentemente, a ANPD lançou um sandbox focado em Inteligência Artificial e Proteção de Dados, com ênfase em {{transparência algorítmica}}, mitigação de vieses e segurança de dados pessoais em modelos generativos.',
              },
              {
                kind: 'heading',
                text: 'Tendências 2025-2026: IA, agentes autônomos e RegTech',
              },
              {
                kind: 'paragraph',
                text: 'O futuro da gestão da inovação está intrinsecamente ligado à evolução da Inteligência Artificial. Em 2025, os profissionais de compliance e governança veem a IA não apenas como uma ferramenta de automação, mas como um vetor de aculturamento ético.',
              },
              {
                kind: 'step-flow',
                title: '3 tendências que redefinem governança',
                steps: [
                  { number: 1, title: 'Agentes de IA Autônomos', description: 'Diferente da automação robótica tradicional (RPA), os agentes de IA possuem capacidades de percepção, raciocínio adaptativo e {{ação autônoma}}. Isso redefine a governança: empresas agora gerenciam agentes que tomam decisões independentes e acessam dados sensíveis. A observabilidade torna-se prioridade número um — não se pode gerenciar ou proteger o que não se vê.' },
                  { number: 2, title: 'RegTech e Compliance Automatizado', description: 'As RegTechs (Regulatory Technology) utilizam IA para automatizar verificações de KYC (Know Your Customer) e triagens de AML (Anti-Money Laundering). Em 2025, o compliance deixa de ser focado apenas em evitar multas para se tornar um motor de {{confiança e reputação}}. A detecção preditiva de anomalias permite responder a riscos em tempo real.' },
                  { number: 3, title: 'Inovação Ambidestra', description: 'Manter a eficiência operacional (exploração do modelo atual) enquanto se explora novas fronteiras (experimentação com modelos novos). O maior desafio organizacional da próxima década: fazer os dois ao mesmo tempo sem que um {{sabote}} o outro.' },
                ],
              },
                            {
                kind: 'heading',
                text: 'Cases brasileiros de transformação',
              },
              {
                kind: 'paragraph',
                text: 'A **B3** (Bolsa de Valores) se transformou de pregão viva-voz em hub fintech — hoje processa {{13 milhões}} de ordens por dia com latência de microssegundos. A **Stone** provou que dá para competir com Cielo e Rede começando por microempreendedores que ninguém atendia — modelo disruptivo clássico de Christensen. A **Embraer** inova em indústria pesada: compete com Boeing e Airbus criando aviões para nichos que as gigantes ignoram — jatos regionais onde nenhuma grande quer investir.',
              },
              {
                kind: 'paragraph',
                text: 'O **Mercado Pago** (braço financeiro do Mercado Livre) virou o maior banco digital da América Latina por volume de transações — sem pedir licença bancária tradicional. Começou como meio de pagamento do marketplace e expandiu para crédito, investimento e seguros. Exemplo perfeito de como {{plataforma cria ecossistema financeiro}} sem precisar ser banco.',
              },
              {
                kind: 'heading',
                text: 'IA generativa na prática: ROI, riscos e responsabilidade',
              },
              {
                kind: 'paragraph',
                text: 'O maior desafio da IA generativa em 2025 não é técnico — é de {{ROI}}. A maioria das empresas que adotou ChatGPT/Copilot ainda não consegue medir retorno concreto (McKinsey, 2024). O problema: IA generativa é excelente para tarefas pontuais (rascunho de e-mail, resumo de documento) mas difícil de escalar para processos críticos sem governança de dados.',
              },
              {
                kind: 'paragraph',
                text: 'Quem é responsável quando um agente de IA nega um empréstimo injustamente? Quando um chatbot dá informação errada que causa prejuízo? A {{liability}} da IA corporativa é o maior buraco jurídico de 2025. Empresas que implementam IA sem trilha de auditoria (observabilidade) estão criando risco legal que pode superar o benefício operacional. Prompt engineering — a habilidade de instruir modelos de linguagem — está se tornando disciplina formal, não gambiarra.',
              },
              {
                kind: 'heading',
                text: 'Sustentabilidade digital e ESG',
              },
              {
                kind: 'paragraph',
                text: 'A transformação digital tem um custo ambiental invisível. Data centers globais consomem {{1-2% da eletricidade mundial}} — equivalente à aviação comercial. Cada consulta a um modelo de IA gasta 10x mais energia que uma busca no Google. Empresas como Microsoft se comprometeram a ser {{carbono negativo}} até 2030, mas a explosão de IA generativa está dificultando a meta.',
              },
              {
                kind: 'paragraph',
                text: 'A conexão entre digital e ESG é dupla: tecnologia pode {{habilitar}} sustentabilidade (IoT para eficiência energética, IA para otimização logística, blockchain para rastreabilidade de cadeia) mas também pode {{mascarar}} greenwashing (relatórios automatizados que selecionam dados favoráveis). Empresas digitalmente maduras têm responsabilidade de usar tecnologia para sustentabilidade real — não só para marketing.',
              },
{
                kind: 'paragraph',
                text: 'Em 2025, governança de modelos de IA (políticas para uso ético e responsável de sistemas generativos), infraestrutura de dados em nuvem (base para escalabilidade e segurança) e cultura de dados (o maior diferencial não será a tecnologia, mas a {{capacidade humana}} de interpretá-la e agir sobre ela) são as três frentes que definem quem lidera e quem segue.',
              },
],
            application: {
              kind: 'compare-and-drag',
              intro: 'Os 4 pilares da decisão baseada em dados. Classifique cada atividade no pilar correto.',
              compare: {
                columnHeaders: ['Coleta', 'Análise', 'Visualização', 'Integração'],
                rows: [
                  { label: 'O que faz', values: ['Captura dados', 'Extrai insights', 'Comunica resultados', 'Usa nas decisões'], viz: 'icons', icons: ['💾', '🧠', '📈', '🎯'] },
                  { label: 'Ferramenta', values: ['APIs, IoT, formulários', 'ML, estatística, BI', 'Dashboards, relatórios', 'Processos diários'], viz: 'icons', icons: ['⚙️', '🔬', '📊', '🔗'] },
                ],
              },
              drag: {
                instruction: 'Classifique cada atividade no pilar correto da DDDM:',
                zones: [
                  { id: 'col', label: 'Coleta' },
                  { id: 'ana', label: 'Análise' },
                  { id: 'vis', label: 'Visualização' },
                  { id: 'int', label: 'Integração' },
                ],
                items: [
                  { id: 'api', label: 'Conectar API de vendas ao banco de dados', correctZone: 'col', correctFeedback: 'Certo. Capturar dados automaticamente é Coleta.', wrongFeedback: 'Conectar API para capturar dados é Coleta.' },
                  { id: 'ml', label: 'Treinar modelo preditivo de churn', correctZone: 'ana', correctFeedback: 'Certo. ML para extrair insight é Análise.', wrongFeedback: 'Modelo preditivo é Análise.' },
                  { id: 'dash', label: 'Dashboard de KPIs para o board', correctZone: 'vis', correctFeedback: 'Certo. Dashboard para decisores é Visualização.', wrongFeedback: 'Dashboard é Visualização.' },
                  { id: 'reuniao', label: 'Usar dados na reunião semanal de vendas', correctZone: 'int', correctFeedback: 'Certo. Usar no dia a dia é Integração.', wrongFeedback: 'Usar dados na rotina é Integração.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Ferramentas digitais sem cultura data-driven são como Ferrari na garagem. A LGPD não é obstáculo — é framework de confiança. E os agentes de IA estão redefinindo o que significa {{governar}} tecnologia: não basta controlar ferramentas, agora é preciso gerenciar entidades que decidem sozinhas.',
              keyInsights: [
                'DDDM depende de 4 pilares: Coleta → Análise → Visualização → {{Integração}} nos processos diários.',
                'LGPD + sandbox regulatório = inovação {{dentro da lei}}, não apesar dela.',
                'Agentes de IA + RegTech transformam compliance de custo em {{motor de confiança}}.',
              ],
            },
          },
                  {
            id: 'M1-0-cap5',
            type: 'chapter',
            number: 5,
            title: 'Tipos e Intensidade da Inovação',
            subtitle: 'De produto a modelo de negócio — e de rotina a arquitetônica',
            opening: {
              leadText: 'Uma inovação necessariamente precisa ser {{implementada}} e proporcionar impactos econômicos e sociais mensuráveis para empresas, indivíduos, governos e a sociedade. Do contrário, trata-se apenas de mera ideia ou invenção.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'A inovação pode ser classificada de acordo com seu tipo. São consideradas inovações as modificações que resultem em melhor desempenho, usabilidade, eficiência, redução de custos e acessibilidade. Com o crescimento da pauta de sustentabilidade, responsabilidade social e economia circular, o design de produto vem ganhando maior relevância e ampliando o {{conceito de inovação}}.',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Inovação de Produto/Serviço',
                    period: 'O mais comum',
                    text: 'Mudança de produtos e serviços através de melhoria em design, usabilidade, desempenho, funcionalidade. É a forma mais {{palpável}} de inovar — impacta diretamente no faturamento. Pode ser algo que concorrentes já praticam (refrigerante zero açúcar) ou inédito (refrigerante com café).',
                    caseStudy: {
                      company: 'Havaianas',
                      year: 1994,
                      story: 'Mesmo produto desde 1962, reinventado por {{design e posicionamento}}. De R$ 2 a produto global em 100+ países. Criatividade no marketing, não na borracha.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'Menor risco', label: 'Investimento geralmente menor' },
                        { value: 'Direto', label: 'Impacto no faturamento' },
                      ],
                      insight: 'Essencial para toda empresa manter ou expandir seu {{mercado}}. Não precisa ser revolucionário — precisa gerar valor.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Inovação Organizacional',
                    period: 'Estrutural e abrangente',
                    text: 'Mudanças na cultura, equipes, hierarquia, processos internos. Pode afetar contratação, treinamento, gerenciamento, espaço físico, plano de carreiras. Maior investimento financeiro e de {{esforço organizacional}}.',
                    caseStudy: {
                      company: 'Spotify',
                      year: 2012,
                      story: 'Organizou equipes em {{squads}} autônomos de 6-8 pessoas. Combinou velocidade de startup com escala corporativa. Magazine Luiza adotou modelo similar para transformar lojas em plataforma.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'Squads', label: 'Times autônomos multidisciplinares' },
                        { value: 'Várias áreas', label: 'RH, TI, espaço, cultura' },
                      ],
                      insight: 'Equipes ágeis não são só TI — são {{cultura organizacional}}. Requer mudança em contratação, avaliação e incentivos.',
                    },
                  },
                  {
                    index: 3,
                    title: 'Inovação de Processo',
                    period: 'Eficiência e fluxo',
                    text: 'Mudanças significativas em fluxos organizacionais: gestão da inovação, marketing, vendas, qualidade, logística, TI. Objetivo: maior eficiência, menor custo, mais engajamento, menor impacto {{ambiental}}.',
                    caseStudy: {
                      company: 'Natura',
                      year: 2012,
                      story: 'SAP integrou {{7 países}}. Decisões logísticas que levavam semanas viraram horas. Economia projetada de ~R$ 500M. O processo mudou — o modelo de negócio não.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'R$ 500M', label: 'Economia projetada' },
                        { value: '7 países', label: 'Integrados' },
                      ],
                      insight: 'Pode ser pontual (uma área) ou impactar {{todos os processos}}. A maioria das inovações de processo é incremental.',
                    },
                  },
                  {
                    index: 4,
                    title: 'Inovação de Modelo de Negócio',
                    period: 'Mudança no core',
                    text: 'Mudança significativa nas atividades core. Altera o valor agregado ao cliente e a forma de conduzir o negócio. Maior risco, mas pode garantir {{sobrevivência}} ou levar a outro patamar.',
                    caseStudy: {
                      company: 'Xerox',
                      year: 2000,
                      story: 'Mudou de {{venda de impressoras}} para prestação de serviços de impressão. Garantiu negócio mais sustentável e receita recorrente. Mesmo hardware, modelo completamente diferente.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'Maior risco', label: 'Mas maior potencial' },
                        { value: 'Recorrência', label: 'De venda única a serviço' },
                      ],
                      insight: 'Pode ou não impactar o propósito/missão, mas altera {{significativamente}} como o valor é entregue ao cliente.',
                    },
                  },
                ],
              },
              {
                kind: 'heading',
                text: 'Intensidade da inovação',
              },
              {
                kind: 'pillar-grid',
                title: '4 níveis de intensidade',
                pillars: [
                  { icon: '🔄', title: 'Rotina', description: 'Renovação natural para atender à dinâmica de mercado. {{Baixo impacto}} no modelo e nas capacidades técnicas. A política interna de incentivo é capaz de promovê-la.' },
                  { icon: '🚀', title: 'Radical', description: 'Mantém bases do modelo de negócio mas exige {{novas competências tecnológicas}}. Investimentos elevados e alto impacto no perfil dos colaboradores.' },
                  { icon: '💥', title: 'Disruptiva', description: 'Requer reavaliação e mudança no {{modelo de negócio}}. Foco nas escolhas estratégicas. Maior enfoque na mudança cultural.' },
                  { icon: '🏗️', title: 'Arquitetônica', description: 'Maior impacto e risco — afeta tanto o modelo de negócio quanto a tecnologia. Muitas vezes em {{continuidade}} a uma inovação disruptiva ou radical.' },
                ],
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada tipo de inovação tem características distintas. Classifique corretamente.',
              compare: {
                columnHeaders: ['Produto', 'Processo', 'Organizacional', 'Modelo'],
                rows: [
                  { label: 'Foco', values: ['O que se vende', 'Como se faz', 'Como se organiza', 'Como se captura valor'] },
                  { label: 'Risco', values: ['Baixo-médio', 'Baixo', 'Médio', 'Alto'], viz: 'bars', intensities: [0.35, 0.2, 0.5, 0.9] },
                ],
              },
              drag: {
                instruction: 'Classifique cada exemplo no tipo de inovação:',
                zones: [
                  { id: 'prod', label: 'Produto' },
                  { id: 'proc', label: 'Processo' },
                  { id: 'org', label: 'Organizacional' },
                  { id: 'modelo', label: 'Modelo' },
                ],
                items: [
                  { id: 'hav', label: 'Havaianas: chinelo com design premium', correctZone: 'prod', correctFeedback: 'Certo. Mesmo produto, novo design = produto.', wrongFeedback: 'Design e posicionamento = inovação de produto.' },
                  { id: 'nat', label: 'Natura: SAP integrando 7 países', correctZone: 'proc', correctFeedback: 'Certo. Integração de operações = processo.', wrongFeedback: 'ERP integrando operações = processo.' },
                  { id: 'spo', label: 'Spotify: squads autônomos', correctZone: 'org', correctFeedback: 'Certo. Mudança na estrutura = organizacional.', wrongFeedback: 'Squads mudam a estrutura = organizacional.' },
                  { id: 'xer', label: 'Xerox: venda → serviço de impressão', correctZone: 'modelo', correctFeedback: 'Certo. Mudança na forma de capturar valor = modelo.', wrongFeedback: 'De venda para serviço = modelo de negócio.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Inovação não é sinônimo de tecnologia. Pode ser no {{produto}}, no {{processo}}, na {{organização}} ou no {{modelo de negócio}}. A intensidade vai de rotina (incremental) a arquitetônica (tudo muda). O tipo e a intensidade determinam o risco, o investimento e o impacto.',
              keyInsights: [
                'Inovação sem implementação é apenas {{ideia}}. Precisa gerar impacto mensurável.',
                'Inovação de modelo de negócio tem maior risco mas pode garantir a {{sobrevivência}} da empresa.',
                'Inovação arquitetônica afeta modelo de negócio E tecnologia — é a mais {{transformadora}}.',
              ],
              nextChapterHint: 'Capítulo 6 · Gestão da Inovação',
              nextChapterBlurb: 'Canvas CIE, funil de inovação, stage gates, horizontes e corporate ventures.',
            },
          },
          {
            id: 'M1-0-cap6',
            type: 'chapter',
            number: 6,
            title: 'Gestão da Inovação na Prática',
            subtitle: 'Canvas CIE, funil, stage gates, horizontes e corporate ventures',
            opening: {
              leadText: 'Inovar não consiste somente em ter ideias disruptivas. É um processo que exige {{planejamento}}, disciplina e recursos. O Canvas da Inovação Estratégica responde 5 perguntas: O que inovar? Como? Onde? Com quais recursos? Qual estrutura?',
            },
            body: [
              {
                kind: 'pillar-grid',
                title: '4Ps da Inovação — Como inovar',
                pillars: [
                  { icon: '🎯', title: 'Propósito', description: 'O {{porquê}} de inovar. Toda decisão liga-se a resultados: receita, custos, sustentabilidade. Deve dar suporte à missão e visão da empresa.' },
                  { icon: '⚙️', title: 'Processos', description: 'O {{como}} será desenvolvida. O funil de inovação é o método mais conhecido: geração de ideias → triagem → desenvolvimento → lançamento.' },
                  { icon: '👥', title: 'Pessoas', description: 'Profissionais com espírito empreendedor, gestores ágeis com mentalidade {{Lean}}. Eventos e congressos desenvolvem pensamento amplo.' },
                  { icon: '📋', title: 'Políticas', description: 'Criar ambiente propício dando ênfase ao {{aprendizado}}, não só ao erro. Definir formas de mensurar sucesso e recompensar resultados.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Os três horizontes da inovação',
              },
              {
                kind: 'paragraph',
                text: 'Steve Blank (2015) destaca que o primeiro horizonte é o nível do {{conhecido}}: o modelo de negócio atual. Inovação incremental, quick wins, eficiência. O segundo horizonte cria novos produtos/serviços dentro do mesmo modelo — terreno parcialmente conhecido. O terceiro é disruptivo: distancia-se da operação tradicional.',
              },
              {
                kind: 'pillar-grid',
                title: 'Três horizontes — distribuição de esforço',
                pillars: [
                  { icon: '🎯', title: 'H1 — Core (70%)', description: 'Principais produtos e serviços. Inovações incrementais, domínio total. {{Quick wins}} e eficiência.', metric: { value: '70%', label: 'dos esforços' } },
                  { icon: '🔭', title: 'H2 — Adjacente (20%)', description: 'Áreas próximas ao core. Novos canais, novos clientes, mesma tecnologia. Risco {{moderado}}.', metric: { value: '20%', label: 'dos esforços' } },
                  { icon: '🚀', title: 'H3 — Disruptivo (10%)', description: 'Projetos que se distanciam da operação tradicional. Novos mercados. Risco alto, retorno {{exponencial}}.', metric: { value: '10%', label: 'dos esforços' } },
                ],
              },
              {
                kind: 'heading',
                text: 'Funil de inovação e stage gates',
              },
              {
                kind: 'paragraph',
                text: 'O funil de inovação e os estágios de decisão ({{stage gates}}, Robert Cooper 2001) são as ferramentas mais utilizadas para representar o fluxo criativo. Cada fase é demarcada por um estágio de decisão que analisa se a ideia avança. O equilíbrio entre inovação e mercado é ponto fundamental.',
              },
              {
                kind: 'step-flow',
                title: 'Funil de inovação — do Fuzzy Front-End ao mercado',
                steps: [
                  { number: 1, title: 'Fuzzy Front-End (FFE)', description: 'Conjunto difuso de ideias. Incertezas sobre mercado, tecnologia e gestão. Quanto mais ideias nessa fase, {{melhor}}. Divergir é necessário.', caseSnippet: 'A saída é um conceito sobre o produto ou solução a ser desenvolvida.' },
                  { number: 2, title: 'Stage Gate 1 — Triagem', description: 'Avaliação inicial: alinhamento estratégico, viabilidade técnica, potencial de mercado. {{Go/no-go}} — a ideia segue ou vai para o banco de ideias.', caseSnippet: 'Cooper (2001): banco de ideias permite revisitar projetos estacionados no futuro.' },
                  { number: 3, title: 'Desenvolvimento', description: 'Prototipagem, testes, validação técnica e de mercado. Investimento cresce — o stage gate aqui avalia {{progresso}} real.', caseSnippet: 'TRL (NASA, 1974): mede maturidade da tecnologia em 9 níveis.' },
                  { number: 4, title: 'Stage Gate 2 — Decisão Final', description: 'Produto/serviço está pronto? Mercado validado? ROI projetado atende? {{Lançar ou pivotar}}.', caseSnippet: 'Hype Cycle (Gartner): acompanha a maturidade e potencial futuro das tecnologias.' },
                  { number: 5, title: 'Lançamento e Escala', description: 'Go-to-market. Métricas de adoção, receita, satisfação. O ciclo reinicia com {{aprendizados}} do mercado.', caseSnippet: 'Lean Startup: construir-medir-aprender em ciclos contínuos.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Corporate ventures e ecossistema',
              },
              {
                kind: 'paragraph',
                text: 'Corporate ventures são grandes organizações que investem capital em startups ou em ideias inovadoras dos colaboradores internos. Classificações: {{CVC}} (Corporate Venture Capital — compra ações de startup), {{CVE}} (Externo — cede ajuda como espaço, marca, canais), {{CVI}} (Interno — investe em ideias dos colaboradores).',
              },
              {
                kind: 'paragraph',
                text: 'A inovação se materializa em dois movimentos: {{spin-in}} (integração da startup ao negócio da investidora, via aquisição total) e {{spin-off}} (quando o investimento interno se torna independente, geralmente com criação de nova empresa). Hubs de inovação aberta das grandes organizações abrem portas para incubar startups com potencial de spin-in.',
              },
              {
                kind: 'paragraph',
                text: 'O Business Model Canvas (Osterwalder & Pigneur, 2011) permite definir e visualizar modelos de negócio de forma sistêmica e visual em uma única página. Pode ser usado em 3 momentos: o {{atual}} (como a empresa opera hoje), o de {{inovação}} (ampliação do escopo) e o de {{disrupção}} (negócios não existentes).',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada horizonte tem características e nível de risco diferentes. Classifique.',
              compare: {
                columnHeaders: ['H1 Core', 'H2 Adjacente', 'H3 Disruptivo'],
                rows: [
                  { label: 'Risco', values: ['Baixo', 'Moderado', 'Alto'], viz: 'bars', intensities: [0.2, 0.5, 0.9] },
                  { label: 'Esforço', values: ['70%', '20%', '10%'] },
                  { label: 'Retorno', values: ['Previsível', 'Médio prazo', 'Exponencial'] },
                ],
              },
              drag: {
                instruction: 'Classifique cada ação no horizonte correto:',
                zones: [
                  { id: 'h1', label: 'H1 Core' },
                  { id: 'h2', label: 'H2 Adjacente' },
                  { id: 'h3', label: 'H3 Disruptivo' },
                ],
                items: [
                  { id: 'opt', label: 'Otimizar processo de entrega existente', correctZone: 'h1', correctFeedback: 'Certo. Melhoria incremental no core = H1.', wrongFeedback: 'Otimizar o que existe = Horizonte 1.' },
                  { id: 'canal', label: 'Vender produto existente em novo canal', correctZone: 'h2', correctFeedback: 'Certo. Mesmo produto, novo canal = adjacente.', wrongFeedback: 'Novo canal para produto existente = H2.' },
                  { id: 'novo', label: 'Criar negócio em mercado totalmente novo', correctZone: 'h3', correctFeedback: 'Certo. Mercado novo = disruptivo.', wrongFeedback: 'Mercado inexplorado = H3 disruptivo.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Gestão da inovação não é improviso — é {{processo}}. O Canvas CIE responde 5 perguntas essenciais. Os 3 horizontes distribuem risco (70/20/10). O funil com stage gates filtra ideias. E corporate ventures conectam grandes empresas com o ecossistema de startups.',
              keyInsights: [
                'Funil de inovação: quanto mais ideias no {{topo}}, melhor. A maioria DEVE morrer na triagem — isso é positivo.',
                'Stage gates (Cooper, 2001): decisões {{go/no-go}} em cada fase previnem investimento em projetos fadados ao fracasso.',
                'Spin-in e spin-off são os dois movimentos que materializam a inovação no {{mercado}}.',
              ],
              nextChapterHint: 'Capítulo 7 · Cultura de Inovação',
              nextChapterBlurb: 'Cultura interna e externa, liderança inovadora, TRL e Hype Cycle.',
            },
          },
          {
            id: 'M1-0-cap7',
            type: 'chapter',
            number: 7,
            title: 'Cultura de Inovação',
            subtitle: 'Dimensão interna, externa, liderança e maturidade tecnológica',
            opening: {
              leadText: 'Cultura de inovação é um conjunto de práticas e valores compartilhados que favorecem atitudes inovadoras. Tem duas dimensões: a {{interna}} (a própria organização) e a {{externa}} (o setor e a sociedade). Sem cultura, ferramentas e processos viram burocracia.',
            },
            body: [
              {
                kind: 'heading',
                text: 'Cultura interna',
              },
              {
                kind: 'paragraph',
                text: 'Cada empresa possui uma cultura corporativa: um conjunto de regras, tácitas e explícitas, que condiciona as atitudes de todos que a compõem. Os elementos básicos incluem: padrões de linguagem e formação de grupos, normas do grupo de trabalho, valores organizacionais (confiança, responsabilidade), filosofia das políticas (funcionários, clientes, acionistas), regras de comportamento e promoção, e o {{clima organizacional}}.',
              },
              {
                kind: 'pillar-grid',
                title: 'Elementos da cultura organizacional',
                pillars: [
                  { icon: '💬', title: 'Linguagem e Grupos', description: 'Padrões de tratamento e interação entre pessoas. Como se formam {{grupos informais}}.' },
                  { icon: '📏', title: 'Normas', description: 'Regras do grupo: dias de pagamento, dress code, rituais. O que é aceito e o que {{não é}}.' },
                  { icon: '💎', title: 'Valores', description: 'Confiança, responsabilidade, transparência. O que a empresa diz que valoriza vs o que {{pratica}}.' },
                  { icon: '🌡️', title: 'Clima', description: 'Percepção do ambiente físico e psicológico. Como as pessoas {{sentem}} o local de trabalho.' },
                ],
              },
              {
                kind: 'paragraph',
                text: '**Liderança inovadora, mas não centralizadora:** A inovação precisa começar na alta administração. Mas o problema em organizações comandadas por um "gênio criativo" é que as novas ideias costumam vir apenas dele. Cria-se a regra tácita de "o chefe tem ideias e nós as {{executamos}}" — prejudicial porque torna a empresa dependente de uma única pessoa.',
              },
              {
                kind: 'heading',
                text: 'Cultura externa',
              },
              {
                kind: 'paragraph',
                text: 'Um profissional inovador precisa de sólida formação na área em que atua — criação tem tudo a ver com conhecimento. Mas e se a oferta de profissionais qualificados é baixa? Se não existe sistema de patentes? Se não há acesso a bancos de dados públicos? Se a transferência de tecnologia é difícil? Esses são problemas da segunda dimensão da cultura de inovação: o contexto {{setorial e social}}.',
              },
              {
                kind: 'heading',
                text: 'Nível de Maturidade Tecnológica (TRL)',
              },
              {
                kind: 'paragraph',
                text: 'O TRL (Technology Readiness Level) é uma metodologia desenvolvida pela {{NASA}} em 1974 para mensurar e comparar a evolução da maturidade de novas tecnologias. Muito utilizada por empresas e agentes de fomento na tomada de decisão da alocação de recursos conforme milestones são superados. Quanto mais recente a tecnologia, maiores as incertezas e chances de fracasso.',
              },
              {
                kind: 'heading',
                text: 'Hype Cycle (Curva Gartner)',
              },
              {
                kind: 'paragraph',
                text: 'Hype Cycle é uma curva de padrões que tendem a se repetir no ciclo de vida de uma tecnologia, desenvolvida pela {{Gartner}} em 2018. Desde então, a consultoria divulga anualmente mais de 100 Hype Cycles em vários setores para acompanhar a maturidade da inovação e o potencial futuro das tecnologias.',
              },
              {
                kind: 'step-flow',
                title: 'As 5 fases do Hype Cycle',
                steps: [
                  { number: 1, title: 'Gatilho Tecnológico', description: 'Nova tecnologia surge. Primeiras provas de conceito geram {{interesse}} da mídia e investidores.' },
                  { number: 2, title: 'Pico de Expectativas Infladas', description: 'Publicidade gera entusiasmo excessivo. Expectativas {{irrealistas}}. Muitas startups surgem.' },
                  { number: 3, title: 'Vale da Desilusão', description: 'Implementações falham. Interesse diminui. Empresas mais fracas {{morrem}}. Mídia perde interesse.' },
                  { number: 4, title: 'Encosta da Iluminação', description: 'Casos de uso reais começam a funcionar. Benefícios ficam mais {{claros}} e práticos.' },
                  { number: 5, title: 'Platô de Produtividade', description: 'Tecnologia madura, amplamente adotada. Critérios de viabilidade {{comprovados}}. Mercado consolidado.' },
                ],
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'TRL e Hype Cycle medem maturidade de formas diferentes. Classifique.',
              compare: {
                columnHeaders: ['TRL', 'Hype Cycle'],
                rows: [
                  { label: 'Origem', values: ['NASA (1974)', 'Gartner (2018)'] },
                  { label: 'Mede', values: ['Maturidade técnica', 'Maturidade de mercado'] },
                  { label: 'Uso', values: ['Decisão de investimento', 'Expectativa vs realidade'] },
                ],
              },
              drag: {
                instruction: 'Em qual fase do Hype Cycle está cada tecnologia (2025)?',
                zones: [
                  { id: 'pico', label: 'Pico de Expectativas' },
                  { id: 'vale', label: 'Vale da Desilusão' },
                  { id: 'plato', label: 'Platô de Produtividade' },
                ],
                items: [
                  { id: 'genai', label: 'IA Generativa (ChatGPT, Claude)', correctZone: 'pico', correctFeedback: 'Certo. Expectativas altíssimas, ROI real ainda incerto.', wrongFeedback: 'IA generativa está no pico — muito hype, pouco ROI comprovado.' },
                  { id: 'block', label: 'Blockchain/Crypto', correctZone: 'vale', correctFeedback: 'Certo. Após boom de 2021, agora busca casos de uso reais.', wrongFeedback: 'Blockchain passou do hype — está no vale buscando aplicações reais.' },
                  { id: 'cloud', label: 'Cloud Computing', correctZone: 'plato', correctFeedback: 'Certo. Madura, amplamente adotada, critérios claros.', wrongFeedback: 'Cloud já é madura e produtiva — platô.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Cultura de inovação tem duas dimensões: {{interna}} (valores, liderança, clima) e {{externa}} (profissionais, patentes, ecossistema). TRL mede maturidade técnica. Hype Cycle mede expectativa de mercado. Sem cultura, as melhores ferramentas viram burocracia.',
              keyInsights: [
                'Liderança inovadora não é centralizadora. "O chefe tem ideias e nós executamos" = {{dependência}} perigosa.',
                'TRL (NASA, 1974): 9 níveis de maturidade. Quanto mais recente, mais {{incerteza}} e risco.',
                'Hype Cycle: toda tecnologia passa por expectativa inflada → desilusão → {{produtividade real}}.',
              ],
            },
          },

],
      },
      {
        id: 'M1-1',
        title: 'Pensamento Criativo',
        blocks: [
                    {
            id: 'M1-1-cap1',
            type: 'chapter',
            number: 1,
            title: 'O que é Pensamento Criativo',
            subtitle: 'Da neurociência ao modelo de Guilford — criatividade como competência treinável',
            opening: {
              leadText: 'Pensamento criativo é a capacidade cognitiva de gerar ideias, soluções ou conexões que são simultaneamente {originais e úteis}. Diferente do senso comum, criatividade não é um dom exclusivo de artistas — é uma competência treinável, mensurável e essencial para a sobrevivência empresarial.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'Pensamento criativo é a capacidade cognitiva de gerar ideias, soluções ou conexões que são simultaneamente originais e úteis. Diferente do senso comum, criatividade não é um "dom" exclusivo de artistas — é uma competência {{treinável}}, mensurável e essencial para a sobrevivência empresarial.',
              },
              {
                kind: 'paragraph',
                text: 'Pesquisas com fMRI (ressonância magnética funcional) revelam que a criatividade não reside em um hemisfério específico. O neurocientista Rex Jung (Universidade do Novo México) demonstrou que o processo criativo envolve três redes cerebrais simultâneas que trabalham em {{colaboração}}.',
              },
              {
                kind: 'pillar-grid',
                title: '3 redes cerebrais da criatividade (Rex Jung, 2013)',
                pillars: [
                  { icon: '💭', title: 'DMN — Default Mode', description: 'Ativa durante devaneios e associações livres. É a rede da {{imaginação}} — gera conexões inesperadas quando a mente vagueia.' },
                  { icon: '📋', title: 'ECN — Executive Control', description: 'Avalia, refina e seleciona ideias. É o {{editor interno}} que filtra o que a DMN produz.' },
                  { icon: '⚡', title: 'SN — Salience Network', description: 'Alterna entre DMN e ECN. Detecta quando uma ideia merece atenção — é o {{detector de eureka}}.' },
                ],
              },
              {
                kind: 'paragraph',
                text: 'O insight criativo (momento "eureka") ocorre quando a Salience Network detecta uma conexão inesperada gerada pela DMN e a passa para validação pela ECN. Isso explica por que muitas ideias brilhantes surgem no chuveiro ou durante caminhadas — momentos em que a DMN opera {{livremente}}.',
              },
              {
                kind: 'pillar-grid',
                title: 'O que define uma pessoa criativa',
                pillars: [
                  { icon: '🔍', title: 'Curiosidade', description: 'Interesse genuíno por como as coisas funcionam e por que são como são.' },
                  { icon: '🔄', title: 'Ângulo inusitado', description: 'Capacidade de ver as coisas de forma que outros {{não veem}}.' },
                  { icon: '💪', title: 'Perseverança', description: 'Não desistir na primeira dificuldade. O processo criativo é {{lento e trabalhoso}}.' },
                  { icon: '🤝', title: 'Humildade', description: 'Perceber os próprios limites e pedir ajuda. Criatividade raramente é {{solo}}.' },
                ],
              },
              {
                kind: 'pillar-grid',
                title: 'Os 4 Ps da Criatividade (Mel Rhodes, 1961)',
                pillars: [
                  { icon: '🧠', title: 'Person', description: 'Traços cognitivos e de personalidade: abertura a experiências, {{tolerância à ambiguidade}}.' },
                  { icon: '⚙️', title: 'Process', description: 'Etapas do pensamento criativo: preparação, incubação, iluminação, verificação ({{Wallas}}, 1926).' },
                  { icon: '📦', title: 'Product', description: 'O resultado tangível avaliado por {{originalidade}} e utilidade. Sem produto, criatividade é devaneio.' },
                  { icon: '🌍', title: 'Press', description: 'O ambiente que facilita ou bloqueia: cultura, {{pressão}}, recursos, liberdade para errar.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Mitos que precisam morrer',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: '"Criatividade é inata"',
                    period: 'FALSO',
                    text: 'Estudos longitudinais de {{George Land}} (NASA) mostraram que 98% das crianças de 5 anos são "gênios criativos", mas apenas 2% dos adultos mantêm esse nível. A criatividade é {{desaprendida}}, não ausente.',
                    caseStudy: {
                      company: 'NASA / George Land',
                      year: 1968,
                      story: 'Teste aplicado a {{1.600 crianças}} de 4-5 anos e repetido ao longo de 15 anos. Resultado: 98% (5 anos) → 30% (10 anos) → 12% (15 anos) → {{2% adultos}}.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '98%', label: 'Crianças de 5 anos (gênios criativos)' },
                        { value: '2%', label: 'Adultos (mesmo teste)' },
                        { value: '15 anos', label: 'Duração do estudo' },
                      ],
                      insight: 'A criatividade não é adicionada pela educação — é {{removida}} por ela. O sistema premia convergência (resposta certa) e pune divergência (resposta diferente).',
                    },
                  },
                  {
                    index: 2,
                    title: '"Brainstorming sempre funciona"',
                    period: 'PARCIALMENTE FALSO',
                    text: 'Sem estrutura adequada, grupos produzem {{menos}} e piores ideias que indivíduos trabalhando sozinhos. O problema: bloqueio de produção (só um fala por vez), medo de julgamento e free-riding.',
                    caseStudy: {
                      company: 'Universidade de Tübingen',
                      year: 1987,
                      story: '{{Diehl & Stroebe}} publicaram no Journal of Personality and Social Psychology: grupos sem regras geram menos ideias que a soma dos indivíduos sozinhos. Solução: {{brainwriting}} estruturado.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '-40%', label: 'Produtividade de grupo sem estrutura' },
                        { value: '3 causas', label: 'Bloqueio, medo, free-riding' },
                        { value: '6-3-5', label: 'Brainwriting: 108 ideias em 30min' },
                      ],
                      insight: 'A solução não é abolir brainstorming — é {{estruturá-lo}}. Brainwriting 6-3-5 elimina os 3 problemas de uma vez.',
                    },
                  },
                  {
                    index: 3,
                    title: '"Pressão mata criatividade"',
                    period: 'PARCIALMENTE VERDADEIRO',
                    text: '{{Teresa Amabile}} (Harvard) mostrou que pressão moderada com propósito claro pode aumentar criatividade, mas pressão por {{controle}} a destrói. A diferença: pressão com significado vs pressão com medo.',
                    caseStudy: {
                      company: 'Harvard Business School',
                      year: 1996,
                      story: 'Amabile estudou diários de {{238 profissionais}} em projetos criativos. Resultado: motivação {{intrínseca}} (significado, autonomia) aumenta criatividade. Recompensas extrínsecas e deadlines apertados a destroem.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '238', label: 'Profissionais estudados' },
                        { value: '#1', label: 'Motivação intrínseca como driver' },
                        { value: '1998', label: '"How to Kill Creativity" (HBR)' },
                      ],
                      insight: 'A pergunta não é "quanta pressão?" — é "{{que tipo}} de pressão?". Pressão por propósito energiza. Pressão por controle paralisa.',
                    },
                  },
                ],
              },
              {
                kind: 'heading',
                text: 'Guilford: pensamento divergente vs convergente',
              },
              {
                kind: 'paragraph',
                text: 'Joy Paul Guilford, considerado o mentor do estudo científico da criatividade, criou em 1967 um conceito decisivo: a diferenciação entre pensamento convergente (raciocínio analítico que leva a uma solução) e pensamento divergente (que apresenta várias alternativas para o mesmo problema). Os dois são importantes e se {{retroalimentam}}.',
              },
              {
                kind: 'pillar-grid',
                title: 'As 4 métricas do pensamento divergente (Guilford, 1967)',
                pillars: [
                  { icon: '📊', title: 'Fluência', description: '{{Quantidade}} de ideias geradas. Volume bruto. Amazon: 200+ ideias para "entregar mais rápido".' },
                  { icon: '🔀', title: 'Flexibilidade', description: '{{Variedade}} de categorias. Amazon: drones, lockers, motoristas de app — categorias diferentes.' },
                  { icon: '💎', title: 'Originalidade', description: '{{Raridade}} estatística das respostas. As ideias que ninguém mais teve.' },
                  { icon: '🔬', title: 'Elaboração', description: 'Nível de {{detalhe}} e desenvolvimento. Não basta a ideia — precisa de corpo.' },
                ],
              },
              {
                kind: 'paragraph',
                text: 'O erro mais comum em empresas: equipes convergem prematuramente — julgam ideias antes de gerar volume suficiente. Estudos da IDEO mostram que as melhores ideias surgem após a {{ideia #50}}. Regra de ouro: separe fisicamente as sessões divergentes das convergentes. Nunca faça ambas na mesma reunião.',
              },
              {
                kind: 'heading',
                text: 'Estilos criativos e ambiente organizacional',
              },
              {
                kind: 'paragraph',
                text: 'Michael Kirton propôs que todas as pessoas são criativas, mas diferem no ESTILO: {{Adaptadores}} preferem melhorar o que existe (inovação incremental). {{Inovadores}} preferem mudar o sistema (inovação radical). Nenhum estilo é melhor — equipes eficazes precisam de ambos.',
              },
              {
                kind: 'paragraph',
                text: 'Göran Ekvall (Universidade de Lund, Suécia) identificou 9 condições que influenciam a criatividade das equipes: Desafio, Liberdade, Tempo para pensar, Apoio a ideias, Confiança, Descontração, Conflitos saudáveis, Debates e Disposição para riscos. As dimensões com nota mais baixa são os {{gargalos}} da criatividade — não falta de talento, falta de ambiente.',
              },
              {
                kind: 'step-flow',
                title: 'As 6 etapas do processo criativo',
                steps: [
                  { number: 1, title: 'Reconhecimento de Insights', description: 'Perceber oportunidades. Mantenha um "caderno de insights" — anote toda vez que pensar "isso poderia ser {{melhor}}".' },
                  { number: 2, title: 'Geração de Alternativas', description: 'Fluência e flexibilidade. Produzir muitas alternativas em categorias distintas. {{Quantidade}} antes de qualidade.' },
                  { number: 3, title: 'Seleção de Alternativas', description: 'Bom-senso e crítica construtiva. Pessoas analíticas indicam pontos a {{aprimorar}}.' },
                  { number: 4, title: 'Iteração', description: 'Repetir etapas 2 e 3. O processo é {{lento e trabalhoso}}. Não desista na primeira rodada.' },
                  { number: 5, title: 'Transferência ao Mundo Real', description: 'Nasce o produto: mercadoria, serviço, estratégia ou nova maneira de ver as coisas.' },
                  { number: 6, title: 'Aprendizado', description: 'O processo {{nunca acaba}}. Recomeça em busca de aperfeiçoamentos.' },
                ],
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Criatividade de Produto',
                    period: 'Reinventar o que se vende',
                    text: 'A mesma base técnica, reinventada por design e posicionamento. Criatividade aplicada ao {{marketing}}, não ao produto em si.',
                    caseStudy: {
                      company: 'Havaianas',
                      year: 1994,
                      story: 'De chinelo de {{R$ 2}} a produto global em {{100+ países}}. O produto é o mesmo desde 1962 — a criatividade foi no posicionamento.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'R$ 2 → R$ 80', label: 'Preço (1994 vs 2024)' },
                        { value: '100+', label: 'Países' },
                        { value: '1962', label: 'Produto inalterado' },
                      ],
                      insight: 'Inovação de produto não exige mudar o produto — exige mudar como o mercado {{percebe}} o produto.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Criatividade de Modelo',
                    period: 'Reinventar como captura valor',
                    text: '8 pessoas reimaginaram a experiência bancária. A criatividade não foi tecnológica — foi no {{modelo}} e na experiência.',
                    caseStudy: {
                      company: 'Nubank',
                      year: 2013,
                      story: '{{80 milhões}} de clientes. CAC de R$ 30-50 vs R$ 800+ bancário. Maior banco digital do mundo fora da China.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '80M', label: 'Clientes' },
                        { value: 'R$ 30-50', label: 'CAC' },
                        { value: '8', label: 'Funcionários iniciais' },
                      ],
                      insight: 'Christensen: inovação disruptiva começa atendendo quem ninguém atende — os {{excluídos}}.',
                    },
                  },
                  {
                    index: 3,
                    title: 'Criatividade Estratégica',
                    period: 'Competir onde ninguém compete',
                    text: 'Não tentou ser maior — criou aviões para {{nichos}} que as gigantes ignoravam.',
                    caseStudy: {
                      company: 'Embraer',
                      year: 2000,
                      story: 'Jatos de {{70-130 assentos}}. Líder mundial aviação regional. Receita {{US$ 5B+}}.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'US$ 5B+', label: 'Receita anual' },
                        { value: '#1', label: 'Aviação regional' },
                        { value: '70-130', label: 'Assentos' },
                      ],
                      insight: 'Chan Kim (INSEAD): Oceano Azul é criar mercado sem concorrência. Embraer criou o {{oceano azul}} dos regionais.',
                    },
                  },
                ],
              },
],
            application: {
              kind: 'compare-and-drag',
              intro: 'Dois tipos de pensamento se complementam no processo criativo. Veja a diferença — depois classifique ações reais.',
              compare: {
                columnHeaders: ['Divergente', 'Convergente'],
                rows: [
                  { label: 'Objetivo', values: ['Gerar muitas alternativas', 'Selecionar a melhor'] },
                  { label: 'Atitude', values: ['Suspender julgamento', 'Avaliar e filtrar'] },
                  { label: 'Métrica', values: ['Volume e variedade', 'Viabilidade e impacto'] },
                  { label: 'Risco', values: ['Caos sem decisão', 'Matar ideias cedo'], viz: 'bars', intensities: [0.6, 0.7] },
                ],
              },
              drag: {
                instruction: 'Classifique: pensamento divergente ou convergente?',
                zones: [
                  { id: 'div', label: 'Divergente' },
                  { id: 'con', label: 'Convergente' },
                ],
                items: [
                  { id: 'brainstorm', label: 'Gerar 50 ideias sem julgar', correctZone: 'div', correctFeedback: 'Certo. Volume sem julgamento = divergente.', wrongFeedback: 'Gerar volume é divergir.' },
                  { id: 'filtrar', label: 'Escolher as 3 melhores por ROI', correctZone: 'con', correctFeedback: 'Certo. Filtrar por critério = convergente.', wrongFeedback: 'Selecionar por critério é convergir.' },
                  { id: 'wild', label: 'Propor a ideia mais absurda possível', correctZone: 'div', correctFeedback: 'Certo. Ideias selvagens = divergência máxima.', wrongFeedback: 'Absurdo proposital é divergência.' },
                  { id: 'vote', label: 'Equipe vota na melhor proposta', correctZone: 'con', correctFeedback: 'Certo. Votação = convergência democrática.', wrongFeedback: 'Votação é seleção = convergir.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Criatividade não é dom — é {competência treinável}. Guilford provou que pode ser medida (fluência, flexibilidade, originalidade, elaboração). O ambiente (Ekvall) importa mais que o talento individual. E o processo criativo tem 6 etapas — não é eureka mágico.',
              keyInsights: [
                'George Land (NASA): {98%} das crianças de 5 anos são gênios criativos. Adultos: 2%. Criatividade é desaprendida.',
                'Guilford (1967): pensamento {divergente} gera ideias, {convergente} seleciona. Nunca faça os dois na mesma reunião.',
                'Ekvall: o ambiente criativo tem {9 dimensões} mensuráveis. A mais baixa é o gargalo.',
              ],
              nextChapterHint: 'Capítulo 2 · Métodos de Criatividade',
              nextChapterBlurb: 'Design Thinking, Brainstorming Estruturado e SCAMPER — ferramentas que transformam teoria em prática.',
            },
          },
          {
            id: 'M1-1-cap2',
            type: 'chapter',
            number: 2,
            title: 'Métodos de Criatividade',
            subtitle: 'Design Thinking, Brainstorming Estruturado e SCAMPER — as ferramentas que funcionam',
            opening: {
              leadText: 'Conhecer a teoria da criatividade sem dominar os métodos é como saber que precisa inovar mas não saber {como começar}. Os três métodos abaixo cobrem 80% dos cenários de inovação em empresas — de startups a multinacionais.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'Design Thinking é uma abordagem de resolução de problemas centrada no ser humano, popularizada pela IDEO e pela d.school de Stanford. Não é um processo linear — é iterativo e profundamente empático. O objetivo não é perguntar ao cliente o que ele quer, mas {{observar o que ele faz}}.',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Fase 1 — Empatizar',
                    period: 'Observar',
                    text: 'Técnicas: entrevistas em profundidade (5 Porquês da Toyota), observação etnográfica ({{shadowing}}), mapa de empatia (o que o usuário diz, pensa, faz e sente).',
                    caseStudy: {
                      company: 'IDEO',
                      year: 1999,
                      story: 'Redesenhou carrinhos de supermercado passando dias em lojas. Descobertas: idosos têm medo de carrinhos pesados, mães precisam de espaço para crianças. {{Nenhuma pesquisa quantitativa}} revelaria isso.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '5 dias', label: 'Do briefing ao protótipo' },
                        { value: '200+', label: 'Ideias geradas' },
                        { value: 'Regra #50', label: 'Melhores ideias surgem após a 50ª' },
                      ],
                      insight: 'Empatia não é pesquisa de mercado. É {{observar}} o que as pessoas fazem quando ninguém está olhando.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Fase 2 — Definir',
                    period: 'Sintetizar',
                    text: 'Sintetizar observações em POV acionável: "[Usuário] precisa de [Necessidade] porque [{{Insight surpreendente}}]".',
                    caseStudy: {
                      company: 'Airbnb',
                      year: 2009,
                      story: 'POV: "Viajantes econômicos precisam de experiências {{autênticas}} porque hotéis os fazem sentir turistas, não moradores." Redirecionou de "quartos baratos" para "pertencer a qualquer lugar".',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '1 frase', label: 'Formato do POV' },
                        { value: 'Pertencer', label: 'Novo posicionamento Airbnb' },
                        { value: '$100B+', label: 'Valor Airbnb (2024)' },
                      ],
                      insight: 'Um bom POV muda a direção da empresa inteira. Um ruim desperdiça {{meses}} de ideação.',
                    },
                  },
                  {
                    index: 3,
                    title: 'Fase 3 — Idear',
                    period: 'Divergir',
                    text: 'Geração volumétrica seguindo regras da IDEO: adiar julgamento, uma conversa por vez, construir sobre ideias dos outros, encorajar ideias selvagens, ser visual, buscar {{quantidade}}.',
                    caseStudy: {
                      company: 'Google',
                      year: 2004,
                      story: 'Gmail nasceu do "{{20% time}}" — tempo livre para ideias selvagens. Funcionários podiam trabalhar em projetos pessoais 1 dia por semana. Resultado: Gmail, Google Maps, AdSense.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '20%', label: 'Tempo livre Google' },
                        { value: 'Gmail', label: 'Nasceu de ideação livre' },
                        { value: '$350B+', label: 'Receita AdSense (acumulada)' },
                      ],
                      insight: 'Regra IDEO: as melhores ideias surgem após a #50. Se você julgou antes, {{matou o potencial}}.',
                    },
                  },
                  {
                    index: 4,
                    title: 'Fase 4 — Prototipar',
                    period: 'Construir',
                    text: '"Se uma imagem vale mil palavras, um protótipo vale {{mil reuniões}}." Deve ser rápido, barato e descartável.',
                    caseStudy: {
                      company: 'Natura',
                      year: 2000,
                      story: 'Protótipos de embalagem Ekos com materiais reciclados testados em lojas. Descoberta: a {{textura}} importava mais que o visual. Redesenho evitou erro de milhões.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'R$ 0', label: 'Custo da pesquisa (lojas próprias)' },
                        { value: 'Textura > Visual', label: 'Insight principal' },
                        { value: '5 níveis', label: 'Fidelidade de protótipo' },
                      ],
                      insight: 'Protótipo de papel, role-playing, Mágico de Oz (simular funcionalidade manualmente). Não precisa de {{código}}.',
                    },
                  },
                  {
                    index: 5,
                    title: 'Fase 5 — Testar',
                    period: 'Aprender',
                    text: 'Não é validação — é {{aprendizado}}. Observar uso real, iterar. Falhar rápido e barato é o objetivo.',
                    caseStudy: {
                      company: 'Dropbox',
                      year: 2008,
                      story: 'Validou o produto inteiro com um {{vídeo de demonstração}} antes de construir a tecnologia. O vídeo gerou 75.000 sign-ups overnight. Sem uma linha de código.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '75.000', label: 'Sign-ups do vídeo (overnight)' },
                        { value: '0', label: 'Linhas de código no teste' },
                        { value: '$12B', label: 'Valor Dropbox no IPO' },
                      ],
                      insight: 'Nielsen: {{5 usuários}} revelam 85% dos problemas de usabilidade. Não precisa de centenas.',
                    },
                  },
                ],
              },
              {
                kind: 'paragraph',
                text: '**DT para PME em 3 dias:** Dia 1 (Empatia) — ligue para 5 clientes e pergunte a última frustração. Dia 2 (Ideação) — equipe gera soluções via brainwriting. Dia 3 (Protótipo) — versão mais simples possível, teste com 3 clientes. Custo: {{R$ 0}}.',
              },
              {
                kind: 'heading',
                text: 'Brainstorming estruturado',
              },
              {
                kind: 'paragraph',
                text: 'Alex Osborn criou o brainstorming em 1953 com uma premissa simples: grupos geram mais ideias que indivíduos. Diehl & Stroebe (1987) provaram que isso só funciona COM estrutura. Sem regras, grupos produzem {{menos}} que a soma dos indivíduos sozinhos.',
              },
              {
                kind: 'pillar-grid',
                title: 'Variantes que funcionam',
                pillars: [
                  { icon: '✍️', title: 'Brainwriting 6-3-5', description: '6 pessoas, 3 ideias cada, 5 rodadas de 5 minutos. Cada um escreve em silêncio, passa a folha. {{108 ideias em 30 minutos}}.', metric: { value: '108', label: 'ideias em 30 min' } },
                  { icon: '🔄', title: 'Round Robin', description: 'Cada participante contribui uma ideia por rodada. Garante que {{todos}} participem igualmente.' },
                  { icon: '⏱️', title: 'Crazy 8s', description: '8 ideias em 8 minutos. Força {{velocidade}} que supera o filtro interno de autocensura.' },
                  { icon: '🎲', title: 'Brainstorming Reverso', description: '"Como {{piorar}} o problema?" Depois inverte. Gera insights que o brainstorming direto não alcança.' },
                ],
              },
              {
                kind: 'heading',
                text: 'SCAMPER — 7 operadores',
              },
              {
                kind: 'paragraph',
                text: 'SCAMPER é acrônimo criado por Bob Eberle (1971), baseado nas listas de Alex Osborn. É a ferramenta mais prática para inovar sobre algo que {{já existe}}.',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'S — Substituir',
                    period: 'Trocar componentes',
                    text: 'O que pode ser substituído? Materiais, pessoas, processos, ingredientes.',
                    caseStudy: {
                      company: 'Beyond Meat',
                      year: 2016,
                      story: 'Substituiu proteína animal por {{vegetal}} — mesmo produto (hambúrguer), ingrediente diferente, mercado bilionário.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '$10B+', label: 'Mercado plant-based (2024)' },
                        { value: '1 operador', label: 'S de SCAMPER' },
                      ],
                      insight: 'Pergunta-chave: "E se eu substituísse [X] por [Y]?"',
                    },
                  },
                  {
                    index: 2,
                    title: 'C — Combinar',
                    period: 'Unir funções',
                    text: 'O que pode ser combinado? Funções, mercados, ideias, materiais.',
                    caseStudy: {
                      company: 'Apple',
                      year: 2007,
                      story: 'iPhone {{combinou}} telefone + câmera + GPS + player + computador. Não inventou nada — combinou tudo.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '5 dispositivos', label: 'Combinados em 1' },
                        { value: '-50%', label: 'Market share Nokia em 2 anos' },
                      ],
                      insight: 'A maioria das inovações é {{combinação}}, não invenção.',
                    },
                  },
                  {
                    index: 3,
                    title: 'E — Eliminar',
                    period: 'Remover o desnecessário',
                    text: 'O que pode ser removido sem perder a função essencial?',
                    caseStudy: {
                      company: 'IKEA',
                      year: 1958,
                      story: 'Eliminou a {{montagem}} na fábrica — transferiu para o consumidor. Custo -30-50%, criou experiência de "monte seu móvel".',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '-30-50%', label: 'Redução de custo' },
                        { value: '€45B', label: 'Receita IKEA (2023)' },
                      ],
                      insight: 'Eliminar é a forma mais {{subestimada}} de inovação.',
                    },
                  },
                ],
              },
              {
                kind: 'paragraph',
                text: 'Como usar: defina o produto a inovar → passe por cada operador (7-10 min cada) → gere pelo menos 3 ideias por operador ({{mínimo 21 total}}) → avalie e combine as melhores → prototipe os 2-3 mais promissores.',
              },
],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada método serve a um tipo de problema. Classifique corretamente.',
              compare: {
                columnHeaders: ['Design Thinking', 'Brainstorming', 'SCAMPER'],
                rows: [
                  { label: 'Quando usar', values: ['Problema desconhecido', 'Precisa de volume', 'Produto existente'] },
                  { label: 'Foco', values: ['Usuário', 'Quantidade', 'Produto'] },
                  { label: 'Tempo', values: ['1-6 semanas', '30-60 min', '30-60 min'] },
                  { label: 'Custo', values: ['Médio', 'Baixo', 'Baixo'], viz: 'bars', intensities: [0.6, 0.2, 0.2] },
                ],
              },
              drag: {
                instruction: 'Qual método usar em cada situação?',
                zones: [
                  { id: 'dt', label: 'Design Thinking' },
                  { id: 'bs', label: 'Brainstorming' },
                  { id: 'sc', label: 'SCAMPER' },
                ],
                items: [
                  { id: 'user', label: 'Clientes reclamam mas não sabe do quê', correctZone: 'dt', correctFeedback: 'Certo. Problema desconhecido com usuário = DT.', wrongFeedback: 'Quando o problema não é claro, empatize primeiro = DT.' },
                  { id: 'vol', label: 'Precisa de 100 ideias em 1 hora', correctZone: 'bs', correctFeedback: 'Certo. Volume máximo = Brainstorming 6-3-5.', wrongFeedback: 'Volume em pouco tempo = Brainstorming.' },
                  { id: 'prod', label: 'Produto existe mas precisa evoluir', correctZone: 'sc', correctFeedback: 'Certo. Inovar sobre existente = SCAMPER.', wrongFeedback: 'Produto existente → SCAMPER (7 operadores).' },
                ],
              },
            },
            synthesis: {
              closingText: 'Nenhum método é universalmente superior. Design Thinking resolve problemas de {usuário}. Brainstorming gera {volume}. SCAMPER evolui {produto existente}. A maestria é saber qual usar quando.',
              keyInsights: [
                'IDEO: as melhores ideias surgem após a {ideia #50}. Separe divergir de convergir.',
                'Diehl & Stroebe (1987): brainstorming sem estrutura produz {MENOS} que indivíduos sozinhos.',
                'SCAMPER aplicado ao iPhone: Combinou (C), Eliminou teclado (E), Substituiu por touch (S).',
              ],
              nextChapterHint: 'Capítulo 3 · Ferramentas Avançadas e Bloqueios',
              nextChapterBlurb: 'Pensamento Lateral, TRIZ, Mapas Mentais — e como identificar e superar os 5 tipos de bloqueio criativo.',
            },
          },
          {
            id: 'M1-1-cap3',
            type: 'chapter',
            number: 3,
            title: 'Ferramentas Avançadas e Bloqueios Criativos',
            subtitle: 'Pensamento Lateral, TRIZ, Mapas Mentais — e os 5 bloqueios que matam criatividade',
            opening: {
              leadText: 'Design Thinking e SCAMPER resolvem a maioria dos problemas. Mas quando o impasse é profundo, quando as ideias convencionais já se esgotaram, ou quando há {contradição técnica} que parece impossível — ferramentas avançadas entram em jogo.',
            },
            body: [
              {
                kind: 'pillar-grid',
                title: 'Ferramentas avançadas de criatividade',
                pillars: [
                  { icon: '🔀', title: 'Pensamento Lateral', description: 'De Bono (1967). Pensar fora do caminho lógico. {{Provocação}}, Analogia, Inversão.' },
                  { icon: '⚡', title: 'TRIZ', description: 'Altshuller (1946). 40 princípios de {{200.000 patentes}}. Resolve contradições técnicas.' },
                  { icon: '🗺️', title: 'Mapas Mentais', description: 'Buzan (1970s). Ideação visual radial. Boeing usa mapas de {{7+ metros}}.' },
                  { icon: '🔒', title: 'Restrição Criativa', description: 'Limites {{geram}} inovação. Twitter: 140 caracteres criou linguagem própria.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Os seis chapéus do pensamento (De Bono, 1985)',
              },
              {
                kind: 'paragraph',
                text: 'Cada chapéu representa um modo de pensar. A regra: todos usam o MESMO chapéu ao mesmo tempo — elimina conflitos ego-a-ego e permite exploração {{paralela}}.',
              },
              {
                kind: 'pillar-grid',
                title: '6 Chapéus do Pensamento',
                pillars: [
                  { icon: '⬜', title: 'Branco — Fatos', description: 'Apenas dados e informações verificáveis. "O que {{sabemos}}? O que não sabemos?"' },
                  { icon: '🟥', title: 'Vermelho — Emoções', description: 'Intuição e pressentimentos SEM justificativa. "O que meu {{instinto}} diz?"' },
                  { icon: '⬛', title: 'Preto — Cautela', description: 'Riscos e obstáculos. O mais natural para executivos — mas usado de forma {{controlada}}.' },
                  { icon: '🟨', title: 'Amarelo — Otimismo', description: 'Benefícios e oportunidades. Obrigatório {{após}} o Preto para balancear.' },
                  { icon: '🟩', title: 'Verde — Criatividade', description: 'Ideias novas, alternativas, provocações. É o chapéu que mais usa técnicas de {{De Bono}}.' },
                  { icon: '🟦', title: 'Azul — Processo', description: 'Meta-pensamento. Gerencia o processo dos outros chapéus. Usado pelo {{facilitador}}.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Bloqueios criativos',
              },
              {
                kind: 'paragraph',
                text: 'Bloqueios criativos não são falhas de caráter — são estados cognitivos previsíveis com causas identificáveis e soluções comprovadas. James L. Adams (Stanford, 1974) classificou os bloqueios em "{{Conceptual Blockbusting}}".',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Bloqueio Perceptivo',
                    period: 'Não ver o problema',
                    text: 'O cérebro "trava" em uma representação fixa. {{Fixação funcional}}: ver objetos apenas no uso convencional. Delimitação prematura: definir o problema estreito demais.',
                    caseStudy: {
                      company: 'Uber',
                      year: 2009,
                      story: 'Perguntar "como fazer um {{carro}} melhor?" produz incrementos. Perguntar "como mover pessoas sem carro?" produziu Uber, Lime, Hyperloop.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '$150B+', label: 'Mercado de mobilidade (2024)' },
                        { value: '1 pergunta', label: 'Mudou o enquadramento inteiro' },
                      ],
                      insight: 'Solução: mudar o {{enquadramento}}. A pergunta errada produz a resposta certa para o problema errado.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Bloqueio Emocional',
                    period: 'Medo de julgamento',
                    text: 'Causa #1 de silêncio em brainstorming. Desconforto com ambiguidade, medo do fracasso, {{síndrome do impostor}}.',
                    caseStudy: {
                      company: 'Google',
                      year: 2015,
                      story: 'Projeto Aristotle: {{180 equipes}} estudadas. Fator #1 de alta performance: {{segurança psicológica}} — poder errar sem medo. Não era talento individual.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '180', label: 'Equipes estudadas' },
                        { value: '#1', label: 'Segurança psicológica' },
                        { value: 'Gmail', label: 'Nasceu de espaço seguro' },
                      ],
                      quote: {
                        text: 'There is no innovation without experimentation, and there is no experimentation without the freedom to fail.',
                        author: 'Amy Edmondson · Harvard · The Fearless Organization 2018',
                      },
                      insight: 'Solução: exercícios de "pior ideia possível". Quando pede para serem {{propositalmente ruins}}, relaxam.',
                    },
                  },
                  {
                    index: 3,
                    title: 'Bloqueio Cultural',
                    period: '"Sempre fizemos assim"',
                    text: 'Normas organizacionais que punem pensamento diferente. {{Groupthink}}: grupos coesos suprimem dissidência. Hierarquia rígida: chefe sempre tem razão = criatividade morre.',
                    caseStudy: {
                      company: 'CIA / Red Teams',
                      year: 2001,
                      story: 'Após falhas de inteligência, CIA criou {{Red Teams}} — equipes designadas para atacar a ideia dominante. Evita Groupthink em decisões críticas. Empresas podem designar "advogado do diabo" rotativo.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'Red Team', label: 'Equipe que ataca a ideia' },
                        { value: 'Rotativo', label: 'Advogado do diabo muda a cada reunião' },
                      ],
                      insight: 'A frase mais cara da história corporativa: "{{Sempre fizemos assim}}".',
                    },
                  },
                  {
                    index: 4,
                    title: 'Bloqueio Ambiental',
                    period: 'Sem tempo, sem espaço',
                    text: 'Interrupções constantes (cérebro leva {{23 minutos}} para retomar foco), ambientes monótonos, excesso de reuniões, ferramentas inadequadas.',
                    caseStudy: {
                      company: '3M',
                      year: 1948,
                      story: '3M permite {{15% do tempo}} para projetos pessoais. O Post-it nasceu daí — Spencer Silver descobriu o adesivo em 1968, Art Fry aplicou em marcadores de livro em 1974. Sem tempo livre, não existiria.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '23 min', label: 'Tempo para retomar foco após interrupção' },
                        { value: '15%', label: 'Tempo livre 3M' },
                        { value: 'Post-it', label: 'Nasceu de tempo livre' },
                      ],
                      insight: 'Cal Newport (Deep Work): blocos de {{90+ minutos}} sem interrupção para trabalho criativo.',
                    },
                  },
                ],
              },
              {
                kind: 'heading',
                text: 'Prototipagem rápida',
              },
              {
                kind: 'paragraph',
                text: 'A prototipagem rápida é o antídoto para o excesso de planejamento. Uma ideia no papel não vale nada até ser testada com pessoas reais. A velocidade de aprendizado é diretamente proporcional à velocidade de {{prototipagem}}.',
              },
              {
                kind: 'step-flow',
                title: '5 níveis de fidelidade de protótipo',
                steps: [
                  { number: 1, title: 'Sketch (0-2h)', description: 'Desenho à mão. Zero investimento. Objetivo: comunicar a ideia visualmente.', caseSnippet: 'Airbnb: fundadores desenharam fluxo da experiência em guardanapos.' },
                  { number: 2, title: 'Storyboard (2-8h)', description: 'Sequência de cenas mostrando a jornada do usuário.', caseSnippet: 'Pixar: testa histórias inteiras antes de animar um frame. Se não funciona em desenho simples, não funciona com US$ 200M.' },
                  { number: 3, title: 'Mockup Interativo (8-24h)', description: 'Figma, Sketch ou PowerPoint com links. Simulação clicável.', caseSnippet: 'Dropbox: vídeo de demonstração gerou 75.000 sign-ups sem uma linha de código.' },
                  { number: 4, title: 'Protótipo Funcional (24-48h)', description: 'Versão simplificada que funciona de verdade, mesmo com "gambiarra".', caseSnippet: 'Zappos: fotografava sapatos em lojas, postava online. Se compravam, ia à loja e enviava. Mágico de Oz puro.' },
                  { number: 5, title: 'MVP (48h-2 semanas)', description: 'Menor produto que entrega valor real e gera aprendizado validado.', author: 'Eric Ries (Lean Startup): "A versão que permite dar uma volta no loop Construir-Medir-Aprender com mínimo esforço"' },
                ],
              },
              {
                kind: 'heading',
                text: 'Restrição como motor criativo',
              },
              {
                kind: 'paragraph',
                text: 'Limites geram inovação. Marissa Mayer (Google): as melhores interfaces nasceram de restrições de velocidade de página. A IKEA define o preço ANTES de projetar — forçando designers a serem criativos com materiais. O Apollo 13 produziu solução genial usando APENAS materiais dentro da nave: sacos plásticos, fita adesiva e {{mangueiras de trajes espaciais}}.',
              },
              {
                kind: 'pillar-grid',
                title: 'Restrições produtivas para empresas',
                pillars: [
                  { icon: '⏱️', title: 'Tempo', description: '"Resolva em 48h, não 4 semanas" — elimina {{perfeccionismo}} e força priorização.' },
                  { icon: '💰', title: 'Orçamento', description: '"Lance com R$ 0 de marketing" — força criatividade em {{distribuição orgânica}}.' },
                  { icon: '✂️', title: 'Features', description: '"Só pode ter 3 funcionalidades" — força foco no {{essencial}}.' },
                  { icon: '👤', title: 'Público', description: '"Resolva para 1 pessoa específica" — força {{empatia}} profunda.' },
                ],
              },
],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada ferramenta avançada ataca um tipo diferente de desafio criativo.',
              compare: {
                columnHeaders: ['Pensamento Lateral', 'TRIZ', 'Mapas Mentais'],
                rows: [
                  { label: 'Criador', values: ['De Bono (1967)', 'Altshuller (1946)', 'Buzan (1970s)'] },
                  { label: 'Quando usar', values: ['Impasse lógico', 'Contradição técnica', 'Complexidade visual'] },
                  { label: 'Técnica', values: ['Provocação/Inversão', '40 princípios de patentes', 'Radial + cores'] },
                ],
              },
              drag: {
                instruction: 'Identifique o tipo de bloqueio criativo:',
                zones: [
                  { id: 'perc', label: 'Perceptivo' },
                  { id: 'cult', label: 'Cultural' },
                  { id: 'emoc', label: 'Emocional' },
                  { id: 'cogn', label: 'Cognitivo' },
                  { id: 'amb', label: 'Ambiental' },
                ],
                items: [
                  { id: 'b1', label: '"Aqui sempre foi assim"', correctZone: 'cult', correctFeedback: 'Certo. Tradição impedindo mudança = bloqueio cultural.', wrongFeedback: '"Sempre foi assim" é barreira cultural.' },
                  { id: 'b2', label: '"Vão achar minha ideia ridícula"', correctZone: 'emoc', correctFeedback: 'Certo. Medo de julgamento = bloqueio emocional.', wrongFeedback: 'Medo de parecer bobo = emocional.' },
                  { id: 'b3', label: '"Não tem nada pra melhorar aqui"', correctZone: 'perc', correctFeedback: 'Certo. Não ver o problema = bloqueio perceptivo.', wrongFeedback: 'Não enxergar o problema é perceptivo.' },
                  { id: 'b4', label: '"Não tenho tempo pra pensar em ideias"', correctZone: 'amb', correctFeedback: 'Certo. Sem tempo = bloqueio ambiental.', wrongFeedback: 'Pressão e falta de tempo = ambiental.' },
                  { id: 'b5', label: '"Só sei fazer desse jeito"', correctZone: 'cogn', correctFeedback: 'Certo. Padrão mental fixo = bloqueio cognitivo.', wrongFeedback: 'Pensamento preso em 1 caminho = cognitivo.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Bloqueios criativos não são falta de talento — são {sintomas do ambiente, cultura e hábito}. Identificar o tipo de bloqueio é metade da solução. A outra metade é escolher a ferramenta certa: Pensamento Lateral para impasses, TRIZ para contradições, Mapas Mentais para complexidade.',
              keyInsights: [
                'De Bono: "Se fábricas poluem rios, obriguem-nas a captar água {abaixo} e devolver {acima}." Provocação gera insight.',
                'Altshuller analisou {200.000 patentes} e encontrou 40 princípios que se repetem. Inovação tem padrão.',
                'Os 5 bloqueios (perceptivo, cultural, emocional, cognitivo, ambiental) são {mensuráveis e tratáveis}.',
              ],
            },
          },
{
            id: 'M1-1-s1',
            type: 'simulation',
            title: 'Seletor de Método Criativo — Qual Técnica Usar?',
            simulationId: 'creative-method',
            description: '10 cenários empresariais reais. Escolha o método certo e veja por que.',
          },
          {
            id: 'M1-1-s2',
            type: 'simulation',
            title: 'Avaliador de Ideias — Matriz de Viabilidade',
            simulationId: 'idea-evaluator',
            description: 'Pontue ideias em 5 dimensões e veja recomendação: executar, desenvolver, pivotar ou arquivar.',
          },
          {
            id: 'M1-1-s3',
            type: 'simulation',
            title: 'Laboratório de Criatividade — Sessão Guiada Real',
            simulationId: 'lab-criatividade',
            description: 'Sessão prática de SCAMPER, 6 Chapéus ou Provocação com timer real.',
          },
          
        ],
      },
      {
        id: 'M1-2',
        title: 'Sustentabilidade em Negocios',
        blocks: [
          {
            id: 'M1-2-v1',
            type: 'video',
            title: 'M1-03 O Tripé da Sustentabilidade',
            url: 'https://qvvqbngiwqfuxsbgcxtc.supabase.co/storage/v1/object/public/videos/IPB/Sustentabilidade.mp4',
          },
          {
            id: 'M1-2-cap1',
            type: 'chapter',
            number: 1,
            title: 'Por que Sustentabilidade Virou Estratégia',
            subtitle: 'Do TBL ao modelo de Círculos Aninhados — sustentabilidade como pilar de negócio',
            opening: {
              leadText: 'A sustentabilidade deixou de ser filantropia. Hoje é o eixo central da governança corporativa — e ignorá-la é {{risco financeiro}}. A pressão vem de investidores (critérios ESG), consumidores (escolha consciente), reguladores (LGPD, marco ESG europeu) e funcionários (propósito).',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'A sustentabilidade nas empresas ganhou tração global a partir da década de 1990. Antes, a gestão era dominada pela visão de Milton Friedman, que pregava que a única responsabilidade social de uma empresa seria {{aumentar seus lucros}}. No entanto, crises ambientais globais e o aumento da desigualdade evidenciaram a insuficiência dessa abordagem.',
              },
              {
                kind: 'paragraph',
                text: 'O entendimento de que os recursos naturais são finitos e de que a estabilidade social é pré-requisito para a continuidade econômica levou à criação de novos modelos de gestão. Em 1994, {{John Elkington}} introduziu o Triple Bottom Line — a premissa de que empresas devem prestar contas não apenas em termos econômicos, mas também sociais e ambientais.',
              },

              {
                kind: 'paragraph',
                text: 'Em 2023, mais de US$ 35 trilhões em ativos globais foram geridos sob critérios ESG (Global Sustainable Investment Alliance). No Brasil, o ISE B3 mostra que empresas sustentáveis superam o Ibovespa em {{retorno ajustado ao risco}} no longo prazo. Sustentabilidade não é custo — é vantagem competitiva mensurável.',
              },
              {
                kind: 'heading',
                text: 'Triple Bottom Line (TBL) — Os 3Ps',
              },
              {
                kind: 'paragraph',
                text: 'John Elkington (1994) propôs que o sucesso de uma empresa seja medido em três dimensões simultâneas — não apenas no lucro. O TBL expandiu a contabilidade corporativa para incluir impacto social e ambiental.',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'People — Pessoas',
                    period: 'Impacto social',
                    text: 'Condições de trabalho, diversidade, impacto na comunidade, cadeia de fornecedores. Como a empresa afeta as {{pessoas}} ao seu redor — funcionários, comunidade, fornecedores.',
                    caseStudy: {
                      company: 'Natura',
                      year: 2010,
                      story: 'Modelo de {{comunidades fornecedoras}} na Amazônia. Mais de 2.000 famílias extrativistas com renda garantida e preservação ambiental. Negócio rentável E social.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '2.000+', label: 'Famílias fornecedoras' },
                        { value: '33', label: 'Comunidades amazônicas' },
                        { value: 'R$ 2B', label: 'Receita Natura Amazônia (2022)' },
                      ],
                      insight: 'People não é filantropia — é cadeia de {{suprimentos}} sustentável que reduz risco e gera valor.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Planet — Planeta',
                    period: 'Impacto ambiental',
                    text: 'Emissões de carbono, uso de água, resíduos, biodiversidade, energia renovável. Não é só "não poluir" — é {{regenerar}} o que foi degradado.',
                    caseStudy: {
                      company: 'Ambev',
                      year: 2018,
                      story: 'Meta de usar {{100% de energia renovável}} até 2025. Reduziu consumo de água por litro de bebida em {{30%}} desde 2012. Cada real economizado em água é lucro operacional.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '-30%', label: 'Redução consumo água' },
                        { value: '100%', label: 'Meta energia renovável' },
                        { value: 'R$ 2.5 bi', label: 'Investimento ambiental (2018-2025)' },
                      ],
                      insight: 'Planet é gestão de {{recursos escassos}}. Água, energia e materiais custam dinheiro — eficiência ambiental = eficiência financeira.',
                    },
                  },
                  {
                    index: 3,
                    title: 'Profit — Lucro',
                    period: 'Viabilidade econômica',
                    text: 'Sem lucro sustentável, People e Planet são insustentáveis. O TBL não é anti-lucro — é {{lucro responsável}} que não destrói as bases da sua própria existência.',
                    caseStudy: {
                      company: 'Magazine Luiza',
                      year: 2020,
                      story: 'Programa de trainee exclusivo para pessoas negras gerou {{controvérsia}} mas aumentou vendas: clientes se identificaram com a marca. Inclusão virou diferencial de {{mercado}}, não só de imagem.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '+12%', label: 'Vendas após programa inclusão' },
                        { value: '53%', label: 'População BR negra (IBGE)' },
                        { value: '#1', label: 'Brand awareness varejo' },
                      ],
                      insight: 'TBL funciona quando as 3 dimensões se {{reforçam}}. People gera brand loyalty. Planet reduz custos. Profit sustenta ambos.',
                    },
                  },
                ],
              },
              {
                kind: 'paragraph',
                text: 'A maioria das pessoas imagina sustentabilidade como 3 círculos que se sobrepõem — economia, sociedade e meio ambiente com uma "zona ideal" no centro. Elkington criticou esse modelo: na prática, empresas otimizam o círculo econômico e tratam os outros como {{secundários}}. O modelo de Círculos Aninhados inverte: a economia está DENTRO da sociedade, que está DENTRO do meio ambiente. Sem planeta viável, não há sociedade. Sem sociedade funcional, não há economia.',
              },
              {
                kind: 'paragraph',
                text: 'Em 2018, o próprio Elkington publicou um artigo na Harvard Business Review pedindo o "recall" do TBL. Não porque estava errado, mas porque foi {{cooptado}} por relatórios corporativos que medem os 3Ps sem mudar nada de verdade. O TBL virou ferramenta de relações públicas em vez de ferramenta de transformação.',
              },
              {
                kind: 'paragraph',
                text: 'Elkington identificou falhas específicas: empresas usavam {{trade-offs}} em vez de sinergia (justificando danos ambientais com lucros elevados), métricas sociais e ambientais eram incomensuráveis em relação ao lucro financeiro, e o TBL virou ferramenta de {{greenwashing}} — relatórios proliferaram enquanto degradação ambiental e desigualdade pioraram.',
              },
              {
                kind: 'paragraph',
                text: 'O modelo de Círculos Aninhados inverte a hierarquia: o meio ambiente é o círculo maior que engloba tudo. A sociedade existe dentro do meio ambiente, e a economia é um {{subproduto}} da sociedade. As decisões econômicas tornam-se meios para um fim — o bem-estar social e a integridade ambiental — e não fins em si mesmos.',
              },

            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Os 3 Ps se aplicam a diferentes aspectos do negócio. Classifique.',
              compare: {
                columnHeaders: ['People', 'Planet', 'Profit'],
                rows: [
                  { label: 'Foco', values: ['Impacto social', 'Impacto ambiental', 'Viabilidade econômica'] },
                  { label: 'Métrica', values: ['Diversidade, salário', 'Emissões, resíduos', 'Receita, margem'] },
                ],
              },
              drag: {
                instruction: 'Classifique cada ação no P correto:',
                zones: [
                  { id: 'people', label: 'People' },
                  { id: 'planet', label: 'Planet' },
                  { id: 'profit', label: 'Profit' },
                ],
                items: [
                  { id: 'div', label: 'Programa de diversidade racial', correctZone: 'people', correctFeedback: 'Certo. Diversidade = People.', wrongFeedback: 'Diversidade impacta pessoas = People.' },
                  { id: 'agua', label: 'Reduzir consumo de água 30%', correctZone: 'planet', correctFeedback: 'Certo. Recurso natural = Planet.', wrongFeedback: 'Água = recurso ambiental = Planet.' },
                  { id: 'rec', label: 'Aumentar margem líquida', correctZone: 'profit', correctFeedback: 'Certo. Margem = Profit.', wrongFeedback: 'Margem financeira = Profit.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Sustentabilidade não é custo — é {{estratégia}}. O TBL mede em 3 dimensões (People, Planet, Profit). Os Círculos Aninhados mostram a hierarquia real: economia depende de sociedade que depende de meio ambiente.',
              keyInsights: [
                'Elkington pediu o "recall" do próprio TBL em 2018 — estava sendo usado para {{relações públicas}}, não transformação.',
                'US$ 35 trilhões em ativos sob critérios ESG. Ignorar sustentabilidade é ignorar o {{mercado}}.',
                'People + Planet + Profit se {{reforçam}}. Inclusão gera vendas. Eficiência ambiental reduz custos.',
              ],
              nextChapterHint: 'Capítulo 2 · ESG e Rating',
              nextChapterBlurb: 'Como o mercado financeiro avalia sustentabilidade — e como montar o rating da sua empresa.',
            },
          },
          {
            id: 'M1-2-cap2',
            type: 'chapter',
            number: 2,
            title: 'ESG — Como o Mercado Avalia Sustentabilidade',
            subtitle: 'Environmental, Social, Governance — de relatório a critério de investimento',
            opening: {
              leadText: 'O ESG transformou sustentabilidade em critério de {{investimento}}. Não é mais "ser bonzinho" — é gestão de risco financeiro. Fundos que aplicam filtro ESG controlam trilhões em ativos globais.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'Enquanto o TBL nasceu de uma perspectiva de cidadania corporativa e ética, o ESG emergiu do setor financeiro. Lançado formalmente pela ONU em 2004 no relatório "Who Cares Wins", o ESG transformou os pilares do tripé em critérios de análise de {{risco e investimento}}. A relação com os ODS: os ODS são o "quê" deve ser alcançado globalmente, o ESG é o "como" as empresas integram esses objetivos em seus processos.',
              },

              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'E — Environmental',
                    period: 'Ambiental',
                    text: 'Emissões de carbono (Escopo 1, 2, 3), gestão de resíduos, uso de água, energia renovável, biodiversidade. O pilar mais {{mensurável}} e o mais regulado.',
                    caseStudy: {
                      company: 'Vale',
                      year: 2019,
                      story: 'Brumadinho: {{270 mortes}} por falha ambiental. Valor de mercado caiu {{R$ 70 bilhões}} em dias. O E do ESG não é relatório — é risco existencial.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '-R$ 70B', label: 'Valor de mercado perdido' },
                        { value: '270', label: 'Vidas perdidas' },
                        { value: 'R$ 37B', label: 'Provisão para reparação' },
                      ],
                      insight: 'Falha ambiental não é multa — é risco de {{extinção}} da empresa. Brumadinho é o caso mais caro da história corporativa brasileira.',
                    },
                  },
                  {
                    index: 2,
                    title: 'S — Social',
                    period: 'Social',
                    text: 'Direitos humanos, diversidade, condições de trabalho, impacto na comunidade, segurança do consumidor. O pilar mais {{difícil de medir}} mas que mais afeta reputação.',
                    caseStudy: {
                      company: 'Magazine Luiza',
                      year: 2020,
                      story: 'Trainee exclusivo para negros. Vendas subiram {{12%}}. Provou que inclusão não é custo — é conexão com 53% da população brasileira que é negra.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '+12%', label: 'Vendas após programa' },
                        { value: '53%', label: 'População negra BR' },
                        { value: '#1', label: 'Brand awareness varejo' },
                      ],
                      insight: 'Social gera {{brand loyalty}}. Consumidores escolhem marcas que representam seus valores.',
                    },
                  },
                  {
                    index: 3,
                    title: 'G — Governance',
                    period: 'Governança',
                    text: 'Composição do conselho, transparência, ética, combate à corrupção, políticas de remuneração. O pilar que {{sustenta}} os outros dois.',
                    caseStudy: {
                      company: 'Americanas',
                      year: 2023,
                      story: 'Fraude contábil de {{R$ 20 bilhões}}. Falha de governança pura: conselho não supervisionou, auditorias falharam. Prova que G sem enforcement é decorativo.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'R$ 20B', label: 'Fraude contábil' },
                        { value: '0', label: 'Enforcement do conselho' },
                        { value: '-97%', label: 'Valor das ações' },
                      ],
                      insight: 'Sem {{Governance}}, Environmental e Social são promessas vazias. G é o alicerce.',
                    },
                  },
                ],
              },
              {
                kind: 'paragraph',
                text: 'O rating ESG é feito por agências como MSCI, Sustainalytics, S&P Global e Moodys. Varia de AAA (líder) a CCC (laggard). Empresas com rating alto acessam capital mais barato, atraem talentos e {{reduzem risco regulatório}}. No Brasil, o ISE B3 é o principal índice de sustentabilidade — inclui ~40 empresas que atendem critérios rigorosos em E, S e G.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada pilar ESG cobre uma dimensão diferente. Classifique.',
              compare: {
                columnHeaders: ['E (Ambiental)', 'S (Social)', 'G (Governança)'],
                rows: [
                  { label: 'Mede', values: ['Impacto ambiental', 'Impacto em pessoas', 'Transparência e ética'] },
                  { label: 'Risco', values: ['Multa ambiental', 'Reputação', 'Fraude'], viz: 'bars', intensities: [0.8, 0.6, 0.9] },
                ],
              },
              drag: {
                instruction: 'Classifique cada evento no pilar ESG correto:',
                zones: [
                  { id: 'e', label: 'Environmental' },
                  { id: 's', label: 'Social' },
                  { id: 'g', label: 'Governance' },
                ],
                items: [
                  { id: 'brum', label: 'Rompimento de barragem', correctZone: 'e', correctFeedback: 'Certo. Desastre ambiental = E.', wrongFeedback: 'Barragem = impacto ambiental.' },
                  { id: 'trai', label: 'Programa de diversidade racial', correctZone: 's', correctFeedback: 'Certo. Inclusão = Social.', wrongFeedback: 'Diversidade = impacto social.' },
                  { id: 'fraud', label: 'Fraude contábil no balanço', correctZone: 'g', correctFeedback: 'Certo. Fraude = falha de Governança.', wrongFeedback: 'Fraude contábil = Governance.' },
                ],
              },
            },
            synthesis: {
              closingText: 'ESG não é relatório — é {{critério de investimento}}. E mede impacto ambiental, S mede impacto social, G sustenta ambos. Sem Governance, o resto é promessa vazia.',
              keyInsights: [
                'Vale/Brumadinho: falha no E custou {{R$ 70 bilhões}} e 270 vidas.',
                'Americanas: falha no G escondeu fraude de {{R$ 20 bilhões}}.',
                'ISE B3: empresas sustentáveis superam Ibovespa em retorno ajustado ao {{risco}}.',
              ],
              nextChapterHint: 'Capítulo 3 · Frameworks de Reporte',
              nextChapterBlurb: 'GRI, SASB, ODS e CSV — como reportar sustentabilidade para diferentes públicos.',
            },
          },
          {
            id: 'M1-2-cap3',
            type: 'chapter',
            number: 3,
            title: 'Frameworks de Reporte e Valor Compartilhado',
            subtitle: 'GRI, SASB, ODS e CSV — o framework certo para cada público',
            opening: {
              leadText: 'Não adianta ser sustentável sem {{comunicar}} de forma estruturada. Cada framework serve a um público diferente: GRI para stakeholders amplos, SASB para investidores, ODS para impacto global, CSV para vantagem competitiva.',
            },
            body: [
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'GRI — Global Reporting Initiative',
                    period: 'Stakeholders amplos',
                    text: 'Padrão mais usado no mundo para relatos de sustentabilidade. {{75%}} das 250 maiores empresas globais usam GRI. Foco em materialidade: reportar o que é relevante para TODOS os stakeholders (investidores, comunidade, governo, funcionários).',
                    caseStudy: {
                      company: 'Natura',
                      year: 2002,
                      story: 'Primeira empresa brasileira a publicar relatório GRI. Hoje publica {{relatório integrado}} anual com 400+ indicadores. Referência global em transparência corporativa.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '75%', label: 'Top 250 empresas usam GRI' },
                        { value: '400+', label: 'Indicadores Natura' },
                        { value: '2002', label: 'Primeiro relatório GRI BR' },
                      ],
                      insight: 'GRI responde: "qual é o {{impacto total}} da empresa no mundo?" — para quem quer transparência completa.',
                    },
                  },
                  {
                    index: 2,
                    title: 'SASB — Sustainability Accounting Standards',
                    period: 'Investidores',
                    text: 'Complemento financeiro do GRI. Fala direto com investidores. Define {{métricas específicas}} por setor — o que é material para uma mineradora é diferente do que é material para um banco.',
                    caseStudy: {
                      company: 'Itaú',
                      year: 2020,
                      story: 'Adotou SASB para comunicar riscos ESG aos investidores internacionais em {{linguagem financeira}}. Resultado: inclusão em índices globais de sustentabilidade, capital mais barato.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '77', label: 'Setores com padrões específicos' },
                        { value: 'Financeiro', label: 'Linguagem dos investidores' },
                        { value: '$$$', label: 'Acesso a capital ESG' },
                      ],
                      insight: 'SASB responde: "quais riscos ESG afetam o {{valor}} da empresa?" — para quem investe.',
                    },
                  },
                  {
                    index: 3,
                    title: 'ODS — Objetivos de Desenvolvimento Sustentável',
                    period: 'Agenda global 2030',
                    text: '17 objetivos da ONU que funcionam como {{bússola estratégica}}. Para empresas, a pergunta é: "quais ODS meu negócio impacta positiva ou negativamente?" Não é para abraçar todos — é para ser honesto sobre onde gera valor e onde gera dano.',
                    caseStudy: {
                      company: 'Ambev',
                      year: 2019,
                      story: 'Conectou estratégia de sustentabilidade a {{5 ODS}} específicos: Água Limpa (6), Energia (7), Trabalho Decente (8), Produção Responsável (12) e Ação Climática (13).',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '17', label: 'Objetivos globais' },
                        { value: '2030', label: 'Prazo da agenda' },
                        { value: '5', label: 'ODS priorizados pela Ambev' },
                      ],
                      insight: 'ODS responde: "onde meu negócio {{conecta}} com o futuro do planeta?" — para posicionamento estratégico.',
                    },
                  },
                  {
                    index: 4,
                    title: 'CSV — Creating Shared Value',
                    period: 'Vantagem competitiva',
                    text: 'Michael Porter e Mark Kramer (Harvard, 2011) propuseram que valor compartilhado não é RSC — é {{estratégia}}. A empresa lucra PORQUE resolve um problema social, não apesar dele.',
                    caseStudy: {
                      company: 'Nestlé',
                      year: 2006,
                      story: 'Programa de {{fornecedores locais}} de café na África. Treinou agricultores, garantiu qualidade e fornecimento estável. Lucrou mais E desenvolveu comunidades. CSV na prática.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'Porter+Kramer', label: 'Harvard (2011)' },
                        { value: 'Lucro', label: 'PORQUE resolve problema social' },
                        { value: 'Win-win', label: 'Empresa + sociedade' },
                      ],
                      insight: 'CSV responde: "como lucrar {{resolvendo}} um problema social?" — para vantagem competitiva sustentável.',
                    },
                  },
                ],
              },
            
              {
                kind: 'paragraph',
                text: 'Perspectivas complementares: o GRI olha de "{{dentro para fora}}", focando em como a empresa impacta economia, ambiente e sociedade — fala com funcionários, ONGs, governos. O SASB olha de "{{fora para dentro}}", medindo como questões ESG afetam o desempenho financeiro — fala com investidores, credores e analistas.',
              },
              {
                kind: 'paragraph',
                text: 'O CSV (Porter & Kramer, Harvard 2011) difere fundamentalmente da CSR tradicional. A CSR redistribui lucro existente; o CSV {{expande}} o bolo econômico e social simultaneamente. Três níveis: reconceber produtos/mercados (atender necessidades não supridas), redefinir produtividade na cadeia (investir em bem-estar de funcionários e fornecedores), e desenvolver {{clusters locais}} (fortalecer ecossistema de fornecedores e instituições).',
              },

              {
                kind: 'heading',
                text: 'Os 17 ODS — Objetivos de Desenvolvimento Sustentável da ONU',
              },
              {
                kind: 'paragraph',
                text: 'Estabelecidos pela ONU em 2015, os 17 ODS compõem a Agenda 2030. São metas globais voltadas para governos, sociedade civil e empresas para erradicar a pobreza, proteger o planeta e garantir prosperidade. Para empresas, a pergunta é: "quais ODS meu negócio impacta — positiva ou {{negativamente}}?"',
              },
              {
                kind: 'step-flow',
                title: '17 ODS — passo a passo',
                steps: [
                  { number: 1, title: 'Erradicação da Pobreza', description: 'Acabar com a pobreza em todas as formas. Empresas: salários dignos, inclusão de base da pirâmide na {{cadeia de valor}}.' },
                  { number: 2, title: 'Fome Zero', description: 'Segurança alimentar e agricultura sustentável. Empresas de alimentos: redução de {{desperdício}}, fornecedores familiares.' },
                  { number: 3, title: 'Saúde e Bem-Estar', description: 'Vida saudável para todos. Empresas: plano de saúde, ergonomia, saúde {{mental}} dos colaboradores.' },
                  { number: 4, title: 'Educação de Qualidade', description: 'Educação inclusiva e equitativa. Empresas: universidade corporativa, bolsas, capacitação de {{comunidades}}.' },
                  { number: 5, title: 'Igualdade de Gênero', description: 'Empoderar mulheres e meninas. Empresas: equidade salarial, mulheres em {{liderança}}, licença parental.' },
                  { number: 6, title: 'Água Limpa e Saneamento', description: 'Acesso à água e gestão sustentável. Empresas: redução de consumo, tratamento de {{efluentes}}, reuso.' },
                  { number: 7, title: 'Energia Acessível e Limpa', description: 'Energia renovável para todos. Empresas: matriz energética limpa, eficiência, {{autogeração}} solar.' },
                  { number: 8, title: 'Trabalho Decente e Crescimento', description: 'Emprego produtivo e decente. Empresas: condições dignas, combate ao trabalho {{análogo à escravidão}} na cadeia.' },
                  { number: 9, title: 'Indústria, Inovação e Infraestrutura', description: 'Infraestrutura resiliente e industrialização sustentável. Empresas: P&D, {{inovação}} de processos, tecnologia limpa.' },
                  { number: 10, title: 'Redução das Desigualdades', description: 'Reduzir desigualdade dentro e entre países. Empresas: diversidade, inclusão, {{equidade}} de oportunidades.' },
                  { number: 11, title: 'Cidades Sustentáveis', description: 'Cidades inclusivas, seguras e resilientes. Empresas: mobilidade, logística verde, impacto {{urbano}} positivo.' },
                  { number: 12, title: 'Consumo e Produção Responsáveis', description: 'Padrões sustentáveis. Empresas: economia circular, redução de {{resíduos}}, design para reciclagem.' },
                  { number: 13, title: 'Ação Contra Mudança Climática', description: 'Combater alterações climáticas. Empresas: metas de carbono, {{compensação}}, adaptação climática.' },
                  { number: 14, title: 'Vida na Água', description: 'Conservar oceanos e recursos marinhos. Empresas: redução de plástico, tratamento de {{efluentes}} costeiros.' },
                  { number: 15, title: 'Vida Terrestre', description: 'Proteger ecossistemas terrestres. Empresas: combate ao desmatamento, {{biodiversidade}} na cadeia de fornecedores.' },
                  { number: 16, title: 'Paz, Justiça e Instituições Fortes', description: 'Instituições eficazes e inclusivas. Empresas: {{anticorrupção}}, transparência, governança sólida.' },
                  { number: 17, title: 'Parcerias para os Objetivos', description: 'Fortalecer parcerias globais. Empresas: {{colaboração}} com governo, academia e sociedade civil.' },
                ],
              },
              {
                kind: 'paragraph',
                text: 'A relação ODS-ESG: ODS é o "quê" deve ser alcançado globalmente. ESG é o "como" as empresas integram esses objetivos. Uma empresa pode adotar o ODS 5 (Igualdade de Gênero) como meta e usar indicadores ESG (pilar Social) para reportar a porcentagem de mulheres em {{liderança}}. O alinhamento aumenta transparência, melhora reputação e atende regulamentações como a CSRD europeia.',
              },
              {
                kind: 'heading',
                text: 'GRI vs SASB — perspectivas complementares',
              },
              {
                kind: 'paragraph',
                text: 'O GRI olha de "{{dentro para fora}}": como a empresa impacta economia, ambiente e sociedade. Usa princípios universais para qualquer setor, com flexibilidade para customizar. O SASB olha de "{{fora para dentro}}": como questões ESG afetam o desempenho financeiro. Cobra métricas pré-definidas em 77 padrões específicos por indústria, facilitando comparação entre empresas do mesmo setor.',
              },
              {
                kind: 'heading',
                text: 'CSV — 3 níveis de valor compartilhado (Porter & Kramer)',
              },
              {
                kind: 'step-flow',
                title: 'Como criar valor compartilhado',
                steps: [
                  { number: 1, title: 'Reconceber Produtos e Mercados', description: 'Desenvolver produtos que atendam a necessidades sociais não supridas: alimentos nutritivos para baixa renda, tecnologias de saúde {{acessíveis}}.' },
                  { number: 2, title: 'Redefinir Produtividade na Cadeia', description: 'Melhorar eficiência no uso de recursos, investir no bem-estar dos funcionários e {{capacitar}} fornecedores para reduzir custos e aumentar qualidade.' },
                  { number: 3, title: 'Desenvolver Clusters Locais', description: 'Fortalecer ecossistema local de fornecedores, infraestrutura e instituições educacionais para criar ambiente de negócios mais {{produtivo e resiliente}}.' },
                ],
              },
],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada framework serve a um público diferente. Classifique.',
              compare: {
                columnHeaders: ['GRI', 'SASB', 'ODS', 'CSV'],
                rows: [
                  { label: 'Público', values: ['Todos stakeholders', 'Investidores', 'Agenda global', 'Estratégia'] },
                  { label: 'Pergunta', values: ['Qual impacto total?', 'Quais riscos ESG?', 'Onde conecto?', 'Como lucrar resolvendo?'] },
                ],
              },
              drag: {
                instruction: 'Qual framework usar em cada situação?',
                zones: [
                  { id: 'gri', label: 'GRI' },
                  { id: 'sasb', label: 'SASB' },
                  { id: 'ods', label: 'ODS' },
                  { id: 'csv', label: 'CSV' },
                ],
                items: [
                  { id: 'inv', label: 'Comunicar riscos ESG a investidores', correctZone: 'sasb', correctFeedback: 'Certo. Investidores querem SASB.', wrongFeedback: 'Linguagem financeira = SASB.' },
                  { id: 'rel', label: 'Relatório completo para todos os públicos', correctZone: 'gri', correctFeedback: 'Certo. Stakeholders amplos = GRI.', wrongFeedback: 'Transparência total = GRI.' },
                  { id: 'lucro', label: 'Lucrar resolvendo problema social', correctZone: 'csv', correctFeedback: 'Certo. Valor compartilhado = CSV.', wrongFeedback: 'Lucro + impacto social = CSV.' },
                  { id: 'agenda', label: 'Conectar estratégia à agenda 2030', correctZone: 'ods', correctFeedback: 'Certo. Agenda global = ODS.', wrongFeedback: 'Agenda ONU 2030 = ODS.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Não existe framework "melhor" — existe o {{certo para o público}}. GRI para transparência ampla. SASB para investidores. ODS para posicionamento global. CSV para estratégia de valor compartilhado.',
              keyInsights: [
                'GRI: {{75%}} das 250 maiores empresas usam. É o padrão de transparência.',
                'SASB: 77 setores com métricas {{específicas}}. Fala a linguagem do investidor.',
                'CSV (Porter, Harvard 2011): lucrar PORQUE resolve problema social, não {{apesar}} dele.',
              ],
              nextChapterHint: 'Capítulo 4 · Greenwashing, ISE e Política',
              nextChapterBlurb: 'Como identificar greenwashing, o papel dos índices brasileiros e como criar política de sustentabilidade.',
            },
          },
          {
            id: 'M1-2-cap4',
            type: 'chapter',
            number: 4,
            title: 'Greenwashing, Índices e Política de Sustentabilidade',
            subtitle: 'Como separar substância de discurso — e implementar na prática',
            opening: {
              leadText: 'Greenwashing é o maior risco reputacional da sustentabilidade corporativa. Separar quem faz de quem {{finge}} é o desafio central. Índices como ISE e ISP dão estrutura. E toda estratégia precisa virar política implementável.',
            },
            body: [
              {
                kind: 'heading',
                text: 'Greenwashing — como identificar',
              },
              {
                kind: 'paragraph',
                text: 'Greenwashing é a prática de projetar uma imagem de sustentabilidade sem substância real. Sinais: linguagem vaga ("eco-friendly" sem métricas), destaque a 1 ação positiva escondendo 10 negativas, selos sem certificação independente, {{marketing verde}} sem mudança operacional.',
              },
              {
                kind: 'pillar-grid',
                title: '7 pecados do greenwashing (TerraChoice)',
                pillars: [
                  { icon: '🎭', title: 'Trade-off oculto', description: 'Destaca 1 atributo verde ignorando impactos maiores. Papel "reciclado" de empresa que {{desmata}}.' },
                  { icon: '❌', title: 'Sem prova', description: 'Afirmações ambientais sem dados, certificações ou {{evidência}} verificável.' },
                  { icon: '🌫️', title: 'Vagueza', description: '"Natural", "eco", "verde" — termos sem {{definição}} regulada. Tudo e nada ao mesmo tempo.' },
                  { icon: '📜', title: 'Selo falso', description: 'Criar selo próprio que parece certificação independente mas {{não é}}.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Cisnes Verdes e o futuro',
              },
              {
                kind: 'paragraph',
                text: 'John Elkington (2020) publicou "Green Swans: The Coming Boom in Regenerative Capitalism". Cisne Negro (Nassim Taleb) = evento catastrófico imprevisível. {{Cisne Verde}} = inovação regenerativa que cria valor exponencial para economia, sociedade e meio ambiente simultaneamente. É o TBL levado ao extremo: não minimizar dano, mas {{gerar abundância}}.',
              },
              {
                kind: 'heading',
                text: 'ISE e ISP — índices brasileiros',
              },
              {
                kind: 'paragraph',
                text: 'O {{ISE B3}} (Índice de Sustentabilidade Empresarial) seleciona ~40 empresas que atendem critérios rigorosos em E, S e G. Empresas no ISE acessam capital mais barato e sinalizam maturidade ESG ao mercado. O {{ISP}} (Investimento Social Privado) é o repasse voluntário de recursos privados para projetos de interesse público, diferente de RSC (obrigação) e CSV (estratégia).',
              },
              {
                kind: 'heading',
                text: 'Política de sustentabilidade — como implementar',
              },
              {
                kind: 'paragraph',
                text: 'A política de sustentabilidade é o conjunto de normas e diretrizes internas que orientam o manejo sustentável das operações empresariais. Transforma intenção em {{ação sistemática}}. Sem política formalizada, sustentabilidade depende de pessoas — e pessoas saem.',
              },
              {
                kind: 'step-flow',
                title: '8 passos para implementar política de sustentabilidade',
                steps: [
                  { number: 1, title: 'Diagnóstico', description: 'Mapear impactos atuais: onde a empresa gera valor e {{dano}} em E, S e G.' },
                  { number: 2, title: 'Definir materialidade', description: 'Quais temas são relevantes para o negócio E para stakeholders? {{Matriz de materialidade}}.' },
                  { number: 3, title: 'Estabelecer metas', description: 'Metas SMART: específicas, mensuráveis, alcançáveis, relevantes, com {{prazo}}.' },
                  { number: 4, title: 'Criar governança', description: 'Quem é responsável? Comitê de sustentabilidade com {{poder de decisão}}, não decorativo.' },
                  { number: 5, title: 'Capacitar equipe', description: 'Treinamento em sustentabilidade para TODOS os níveis — não só alta liderança.' },
                  { number: 6, title: 'Implementar processos', description: 'Traduzir metas em processos operacionais: compras, logística, RH, marketing.' },
                  { number: 7, title: 'Medir e reportar', description: 'Indicadores trimestrais. Relatório anual (GRI ou SASB). {{Transparência}} total.' },
                  { number: 8, title: 'Revisar e iterar', description: 'Metas evoluem. O que era ambicioso em 2023 é {{piso}} em 2025. Revisão anual obrigatória.' },
                ],
              },
            
              {
                kind: 'heading',
                text: 'Marketing verde e CONAR',
              },
              {
                kind: 'paragraph',
                text: 'No Brasil, o CONAR (Conselho Nacional de Autorregulamentação Publicitária) estabelece regras para marketing verde. Exige que alegações de sustentabilidade sejam {{precisas, comprováveis}} e não induzam ao erro. Não se pode usar termos vagos como "amigo da natureza" sem especificar qual aspecto justifica a afirmação e sem possuir evidências. A publicidade não deve destacar benefício ambiental marginal se a operação principal causa {{danos significativos}}.',
              },
              {
                kind: 'heading',
                text: 'Economia regenerativa — a próxima fronteira',
              },
              {
                kind: 'paragraph',
                text: 'A economia regenerativa busca redesenhar mercados para que empresas sejam motores de {{cura}} para o planeta. Princípios: {{Circularidade Total}} (eliminar conceito de resíduo — todos os materiais retornam ao ciclo), {{Impacto Net-Positive}} (não apenas "neutro em carbono" mas remover ativamente mais CO2 do que emite), {{Resiliência Sistêmica}} (saúde do sistema global sobre otimização de curto prazo) e {{Tecnologia para o Bem}} (IA e biotech para resolver crises climáticas e de saúde com ética).',
              },
],
            application: {
              kind: 'compare-and-drag',
              intro: 'Separar greenwashing de sustentabilidade real. Classifique.',
              compare: {
                columnHeaders: ['Greenwashing', 'Sustentabilidade real'],
                rows: [
                  { label: 'Linguagem', values: ['Vaga ("eco-friendly")', 'Específica (métricas)'] },
                  { label: 'Evidência', values: ['Sem dados', 'Relatório GRI/SASB'] },
                  { label: 'Escopo', values: ['1 ação isolada', 'Política integrada'] },
                ],
              },
              drag: {
                instruction: 'Greenwashing ou sustentabilidade real?',
                zones: [
                  { id: 'green', label: 'Greenwashing' },
                  { id: 'real', label: 'Real' },
                ],
                items: [
                  { id: 'eco', label: '"Produto eco-friendly" sem certificação', correctZone: 'green', correctFeedback: 'Certo. Sem certificação = greenwashing.', wrongFeedback: 'Sem prova = greenwashing.' },
                  { id: 'gri', label: 'Relatório GRI com 400 indicadores', correctZone: 'real', correctFeedback: 'Certo. Dados verificáveis = real.', wrongFeedback: 'GRI com métricas = substância.' },
                  { id: 'selo', label: 'Selo verde criado pela própria empresa', correctZone: 'green', correctFeedback: 'Certo. Auto-certificação = greenwashing.', wrongFeedback: 'Selo próprio sem auditoria = fake.' },
                  { id: 'meta', label: 'Meta de 100% energia renovável até 2025', correctZone: 'real', correctFeedback: 'Certo. Meta específica com prazo = real.', wrongFeedback: 'Meta SMART com prazo = sustentabilidade real.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Sustentabilidade real tem {{métricas}}, {{governança}} e {{transparência}}. Greenwashing tem marketing. Os 8 passos transformam intenção em política implementável. E os Cisnes Verdes de Elkington apontam o futuro: não minimizar dano, mas gerar abundância.',
              keyInsights: [
                'TerraChoice: 7 pecados do greenwashing. O mais comum: {{trade-off oculto}} (destacar 1 coisa boa escondendo 10 ruins).',
                'ISE B3: ~40 empresas. Capital mais barato + sinalização de {{maturidade}} ESG.',
                'Política sem governança é documento. Com governança é {{transformação}}.',
              ],
            },
          },
                    {
            id: 'M1-2-cap5',
            type: 'chapter',
            number: 5,
            title: 'Política de Sustentabilidade na Prática',
            subtitle: 'Como criar, implementar e manter — do diagnóstico à comunicação de resultados',
            opening: {
              leadText: 'A política de sustentabilidade é um conjunto de normas e diretrizes internas que orientam o manejo sustentável das operações empresariais. Seu objetivo é minimizar impactos negativos no meio ambiente, na sociedade e na economia. Para que seja eficaz, {{não pode ser separada}} da estratégia geral da empresa (Toledo & Farias Filho, 2023).',
            },
            body: [
              {
                kind: 'pillar-grid',
                title: 'Os 3 pilares da política',
                pillars: [
                  { icon: '🌿', title: 'Ambiental', description: 'Preservação dos recursos naturais e redução dos impactos negativos no {{planeta}}.' },
                  { icon: '👥', title: 'Social', description: 'Bem-estar dos colaboradores, práticas justas e apoio às {{comunidades}} locais.' },
                  { icon: '💰', title: 'Econômico', description: 'Saúde financeira da organização sem comprometer as {{gerações futuras}}.' },
                ],
              },
              {
                kind: 'step-flow',
                title: '8 passos para criar e implementar (Toledo & Farias Filho, 2023)',
                steps: [
                  { number: 1, title: 'Identifique problemas', description: 'Observe o que prejudica meio ambiente ou sociedade. Envolva o máximo de pessoas. Use {{brainstorming}}. Desperdício, alto consumo de energia são comuns.' },
                  { number: 2, title: 'Defina objetivos', description: 'Não tente resolver tudo de uma vez. Metas claras e específicas: reduzir desperdício de papel, economizar energia. Ações {{simples mas eficazes}}.' },
                  { number: 3, title: 'Crie ações', description: 'Partiu prática: materiais recicláveis, LED, redução de plásticos. Traduzir metas em ações {{concretas}}.' },
                  { number: 4, title: 'Envolva todos', description: 'Ponto crucial: cada colaborador precisa entender seu papel. Envolvimento gera {{engajamento}} e melhores resultados.' },
                  { number: 5, title: 'Implemente', description: 'Coloque em prática. Comece pelo simples e rápido. Não espere grandes mudanças — foque no {{próximo passo}}.' },
                  { number: 6, title: 'Monitore', description: 'Acompanhe regularmente. {{Mensurar}} é essencial (Toledo & Farias Filho, 2023). Meça para saber se funciona.' },
                  { number: 7, title: 'Comunique resultados', description: 'Compartilhe vitórias e contribuições. Seja {{honesto e transparente}} — divulgue inclusive o que não funcionou.' },
                  { number: 8, title: 'Ajuste se necessário', description: 'Se algo não funciona, ajuste metas ou ações. Mantenha informações {{atualizadas}} para não repetir erros.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Exemplo prático de política',
              },
              {
                kind: 'paragraph',
                text: 'Uma política de sustentabilidade prática contém: **Visão** (onde queremos chegar em sustentabilidade), **Objetivos** (metas SMART por pilar), **Ações de Educação** (treinar equipe em práticas sustentáveis), **Gestão Ambiental** (processos de redução de impacto), **Monitoramento e Avaliação** (indicadores trimestrais) e **Comunicação** (relatório anual transparente). O primeiro passo é sempre o {{diagnóstico}} profundo das operações.',
              },
              {
                kind: 'paragraph',
                text: 'Nenhuma política terá sucesso se não estiver alinhada à estratégia global da empresa — esse alinhamento é {{imprescindível}} (Toledo & Farias Filho, 2023). Sustentabilidade não é departamento — é princípio que permeia toda a organização.',
              },
            
              {
                kind: 'heading',
                text: 'Metodologia SMART para indicadores',
              },
              {
                kind: 'paragraph',
                text: 'Um dos maiores pontos na criação de indicadores de sustentabilidade é a metodologia SMART — amplamente utilizada em administração e gestão estratégica. O termo é acrônimo de "esperto/ágil" em inglês e refere-se a cinco características essenciais para qualquer {{meta ou indicador}}.',
              },
              {
                kind: 'pillar-grid',
                title: 'SMART — 5 critérios para metas eficazes',
                pillars: [
                  { icon: '🎯', title: 'S — Específico', description: 'A meta precisa ser {{clara e bem definida}}. "Reduzir emissões" é vago. "Reduzir emissões de CO2 em 15% na operação logística" é específico.' },
                  { icon: '📊', title: 'M — Mensurável', description: 'Deve ser possível {{avaliar o progresso}}. Se não mede, não sabe se funciona. KPIs claros com linha de base.' },
                  { icon: '✅', title: 'A — Atingível', description: 'A meta precisa ser {{alcançável}} com os recursos disponíveis. Ambiciosa mas realista — 0% emissão em 6 meses não é atingível.' },
                  { icon: '💎', title: 'R — Relevante', description: 'Deve ser {{importante}}, alinhada com valores e objetivos estratégicos da empresa. Não desperdiçar esforço em meta irrelevante.' },
                  { icon: '⏰', title: 'T — Temporal', description: 'Deve ter {{prazo definido}}. "Algum dia" não é meta. "Até dezembro de 2026" é.' },
                ],
              },
],
            application: {
              kind: 'compare-and-drag',
              intro: 'Classifique cada etapa na fase correta do ciclo.',
              compare: {
                columnHeaders: ['Diagnóstico', 'Planejamento', 'Execução', 'Controle'],
                rows: [
                  { label: 'Ação', values: ['Identificar problemas', 'Definir objetivos', 'Implementar ações', 'Monitorar e ajustar'] },
                ],
              },
              drag: {
                instruction: 'Em qual fase está cada atividade?',
                zones: [
                  { id: 'diag', label: 'Diagnóstico' },
                  { id: 'plan', label: 'Planejamento' },
                  { id: 'exec', label: 'Execução' },
                  { id: 'ctrl', label: 'Controle' },
                ],
                items: [
                  { id: 'bs', label: 'Brainstorming de problemas ambientais', correctZone: 'diag', correctFeedback: 'Certo. Identificar problemas = diagnóstico.', wrongFeedback: 'Brainstorming de problemas é diagnóstico.' },
                  { id: 'meta', label: 'Definir meta de redução de energia', correctZone: 'plan', correctFeedback: 'Certo. Meta específica = planejamento.', wrongFeedback: 'Definir meta = planejamento.' },
                  { id: 'led', label: 'Trocar lâmpadas por LED', correctZone: 'exec', correctFeedback: 'Certo. Ação concreta = execução.', wrongFeedback: 'Trocar lâmpadas = execução.' },
                  { id: 'kpi', label: 'Medir consumo de energia mensal', correctZone: 'ctrl', correctFeedback: 'Certo. Medir resultados = controle.', wrongFeedback: 'Mensurar = controle.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Política de sustentabilidade sem {{implementação}} é documento morto. Os 8 passos de Toledo & Farias Filho (2023) transformam intenção em ação: diagnosticar, planejar, agir, envolver, implementar, monitorar, comunicar e ajustar.',
              keyInsights: [
                'Toledo & Farias Filho (2023): nenhuma política terá sucesso sem alinhamento à {{estratégia global}}.',
                'Comece pelo simples: LED, reciclagem, redução de plástico. Não espere a mudança {{perfeita}}.',
                'Mensurar é essencial. Se não mede, não sabe se {{funciona}}.',
              ],
            },
          },
          {
            id: 'M1-2-cap6',
            type: 'chapter',
            number: 6,
            title: 'BPMN — Modelagem de Processos de Negócio',
            subtitle: 'Como mapear, analisar e otimizar processos usando a notação padrão global',
            opening: {
              leadText: 'A modelagem de processos é um conjunto de atividades voltadas para a representação de fluxos de trabalho. A {{BPMN}} (Business Process Model and Notation) é o padrão global que permite a analistas documentar procedimentos e a implementadores automatizá-los — sem perda de significado.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'Antes da BPMN, o mercado utilizava diversas linguagens (IDEF, EPC, UML) que careciam de ponte entre o desenho de negócio e a execução técnica. A BPMN foi projetada para preencher essa lacuna, funcionando como um {{tradutor universal}} entre áreas de negócio e TI.',
              },
              {
                kind: 'paragraph',
                text: 'O BPMN define um único tipo de diagrama: o Diagrama de Processos de Negócio (DPN). Nele são dispostos os elementos que representam atividades, decisões, eventos e fluxos. O escopo é exclusivamente processos de negócio — não cobre modelagem de estrutura organizacional, dados ou regras de negócio separadamente.',
              },
              {
                kind: 'pillar-grid',
                title: '4 categorias de elementos gráficos',
                pillars: [
                  { icon: '⚡', title: 'Objetos de Fluxo', description: 'Eventos (início/fim), Atividades (tarefas) e Gateways (decisões). São os elementos {{dinâmicos}} que definem o comportamento.' },
                  { icon: '➡️', title: 'Objetos de Conexão', description: 'Fluxos de sequência, fluxos de mensagens e associações. Definem a {{ordem}} de execução e troca de informações.' },
                  { icon: '🏊', title: 'Swimlanes', description: 'Pools (organizações) e Lanes (departamentos). Organizam atividades por {{participante}} e função.' },
                  { icon: '📎', title: 'Artefatos', description: 'Objetos de dados, anotações e grupos. Fornecem {{contexto}} sem alterar a lógica do fluxo.' },
                ],
              },
              {
                kind: 'paragraph',
                text: 'O conceito central é o **Token** — uma construção teórica que representa a instância ativa de um processo enquanto percorre o diagrama. Gateways, eventos e atividades atuam como mecanismos que criam, dividem, fundem ou consomem tokens. A lógica de execução é a gestão do {{ciclo de vida}} desses tokens do início ao fim.',
              },
              {
                kind: 'heading',
                text: 'Gateways — filtros de decisão',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Gateway Exclusivo (XOR)',
                    period: 'Ou um ou outro',
                    text: 'O mais comum. Apenas {{um caminho}} de saída pode ser seguido. Na convergência, repassa o primeiro token que chega. Perguntas devem ser objetivas.',
                    caseStudy: {
                      company: 'Exemplo prático',
                      year: 2024,
                      story: 'Check-in de hotel: cliente tem reserva? SIM → busca dados. NÃO → verifica disponibilidade. Apenas {{um caminho}} é seguido.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'XOR', label: 'Exclusive OR' },
                        { value: '1', label: 'Caminho de saída ativo' },
                      ],
                      insight: 'Use quando a decisão é {{binária}} ou com opções mutuamente exclusivas.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Gateway Paralelo (AND)',
                    period: 'Todos ao mesmo tempo',
                    text: 'Cria caminhos que ocorrem {{simultaneamente}}. Na divergência, cria tokens para todos os caminhos. Na convergência, só prossegue quando TODOS chegarem — ponto de sincronização.',
                    caseStudy: {
                      company: 'Exemplo prático',
                      year: 2024,
                      story: 'Pedido online: após pagamento confirmado, {{simultaneamente}} separa estoque + gera nota fiscal + notifica transportadora. Só despacha quando os 3 terminarem.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'AND', label: 'Parallel gateway' },
                        { value: 'Todos', label: 'Caminhos executados' },
                      ],
                      insight: 'Essencial para evitar {{race conditions}} — garante sincronização antes de prosseguir.',
                    },
                  },
                  {
                    index: 3,
                    title: 'Gateway Inclusivo (OR)',
                    period: 'Um ou mais caminhos',
                    text: 'Permite que {{um ou mais}} caminhos sejam seguidos com base em condições. Na convergência, aguarda apenas os fluxos que foram ativados. O mais complexo dos gateways.',
                    caseStudy: {
                      company: 'Exemplo prático',
                      year: 2024,
                      story: 'Aprovação de crédito: pode precisar de análise financeira E/OU análise cadastral E/OU visita presencial, dependendo do valor. {{Cada condição}} ativa um caminho.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'OR', label: 'Inclusive gateway' },
                        { value: '1+', label: 'Caminhos podem ser ativos' },
                      ],
                      insight: 'Devido à complexidade, muitas vezes é substituído por combinações de XOR + AND para maior {{clareza visual}}.',
                    },
                  },
                  {
                    index: 4,
                    title: 'Gateway Baseado em Eventos',
                    period: 'Quem chegar primeiro',
                    text: 'Não decide por dados mas por qual {{evento externo}} ocorre primeiro. O primeiro evento "vence" e define o caminho, consumindo os outros.',
                    caseStudy: {
                      company: 'Exemplo prático',
                      year: 2024,
                      story: 'Aguardando fornecedor: resposta do fornecedor OU vencimento do prazo (30 dias). Se o {{prazo vence}} primeiro, cancela pedido automaticamente.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'Event', label: 'Baseado em evento externo' },
                        { value: '1º', label: 'Primeiro evento define caminho' },
                      ],
                      insight: 'Ideal para processos com {{prazos}} e dependências externas imprevisíveis.',
                    },
                  },
                ],
              },
              {
                kind: 'heading',
                text: 'Swimlanes — quem faz o quê',
              },
              {
                kind: 'paragraph',
                text: 'BPMN usa swimlanes para dividir e organizar atividades. **Pools** representam organizações — especificam "quem faz o quê" em áreas separadas. **Lanes** representam departamentos ou funções dentro de uma organização. Um pool é a empresa, uma lane é o {{departamento}} dentro dela.',
              },
              {
                kind: 'heading',
                text: 'Tipos de processos',
              },
              {
                kind: 'pillar-grid',
                title: '3 tipos de processos BPMN',
                pillars: [
                  { icon: '🏠', title: 'Processo Privado', description: 'Ocorre {{dentro}} da organização. Atividades internas e como interagem entre si. O mais detalhado.' },
                  { icon: '🌐', title: 'Processo Abstrato', description: 'Interações de um processo privado com entidade {{externa}}. Mostra só atividades que comunicam com fora.' },
                  { icon: '🤝', title: 'Processo de Colaboração', description: 'Interações entre {{dois ou mais}} processos via troca de mensagens. Foco na comunicação entre organizações.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Níveis de maturidade na modelagem',
              },
              {
                kind: 'step-flow',
                title: '3 níveis de profundidade',
                steps: [
                  { number: 1, title: 'Descritivo', description: 'Documentação de alto nível. Qualquer pessoa entende. Subconjunto reduzido de símbolos. Foco no {{happy path}}. Ideal para manuais e apresentações a executivos.' },
                  { number: 2, title: 'Analítico', description: 'Análise de desempenho e melhoria. Trata todas as exceções e regras complexas. Permite {{simulações}} de carga e tempo. Ferramentas como Bizagi atribuem custos a cada tarefa.' },
                  { number: 3, title: 'Técnico/Executável', description: 'Automação total. Detalhes técnicos para interpretação por BPMS: scripts, formulários, conectores de banco. Fidelidade à semântica BPMN 2.0 é {{inegociável}}.' },
                ],
              },
              {
                kind: 'paragraph',
                text: 'A transição para a visão de processos ponta a ponta é um dos pilares do BPM moderno. Diferente da gestão funcional clássica, o foco no processo permite que a organização visualize como o valor é criado para o cliente final, atravessando fronteiras departamentais e eliminando {{silos}} que geram ineficiência.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada gateway controla o fluxo de forma diferente. Classifique.',
              compare: {
                columnHeaders: ['XOR (Exclusivo)', 'AND (Paralelo)', 'OR (Inclusivo)', 'Evento'],
                rows: [
                  { label: 'Caminhos', values: ['Apenas 1', 'Todos', '1 ou mais', '1º evento'] },
                  { label: 'Sincroniza?', values: ['Não', 'Sim (todos)', 'Sim (ativos)', 'Não'] },
                ],
              },
              drag: {
                instruction: 'Qual gateway usar em cada situação?',
                zones: [
                  { id: 'xor', label: 'XOR' },
                  { id: 'and', label: 'AND' },
                  { id: 'or', label: 'OR' },
                  { id: 'evt', label: 'Evento' },
                ],
                items: [
                  { id: 'sim', label: 'Pedido: aprovar OU reprovar', correctZone: 'xor', correctFeedback: 'Certo. Decisão binária = XOR.', wrongFeedback: 'Aprovar ou reprovar = exclusivo.' },
                  { id: 'para', label: 'Separar estoque + gerar NF + notificar (tudo junto)', correctZone: 'and', correctFeedback: 'Certo. Todos simultâneos = AND.', wrongFeedback: 'Tudo ao mesmo tempo = paralelo.' },
                  { id: 'inc', label: 'Crédito: análise financeira E/OU cadastral', correctZone: 'or', correctFeedback: 'Certo. Um ou mais caminhos = OR.', wrongFeedback: 'Depende de condições = inclusivo.' },
                  { id: 'ev', label: 'Aguardar resposta OU vencer prazo', correctZone: 'evt', correctFeedback: 'Certo. Primeiro evento decide = baseado em evento.', wrongFeedback: 'Quem chegar primeiro = evento.' },
                ],
              },
            },
            synthesis: {
              closingText: 'BPMN é o {{tradutor universal}} entre negócio e TI. Os 4 gateways (XOR, AND, OR, Evento) controlam fluxo. Swimlanes definem responsabilidades. E os 3 níveis de maturidade (descritivo → analítico → executável) guiam a evolução da modelagem.',
              keyInsights: [
                'Token: instância ativa que percorre o diagrama. Gateways {{criam, dividem e fundem}} tokens.',
                'Gateway Paralelo (AND): só prossegue quando {{TODOS}} os caminhos terminam — sincronização obrigatória.',
                '3 níveis: descritivo (todos entendem), analítico (simulações), executável ({{automação}} em BPMS).',
              ],
            },
          },

          
                    {
            id: 'M1-2-cap7',
            type: 'chapter',
            number: 7,
            title: 'Certificações, Selos e Indicadores Globais',
            subtitle: 'B Corps, Instituto Ethos, Great Place to Work, Fair Trade e mais — como medir e provar sustentabilidade',
            opening: {
              leadText: 'Sustentabilidade sem {{certificação}} é promessa. Selos e indicadores globais padronizam a avaliação e permitem que empresas brasileiras sejam comparadas a organizações internacionais — ganhando visibilidade no cenário global.',
            },
            body: [
              {
                kind: 'heading',
                text: 'Certificações de empresa',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'B Corps (Empresas B)',
                    period: 'Propósito + Lucro',
                    text: 'Certificadas pela {{B Lab}} — cumprem altos padrões de desempenho social, ambiental, transparência e responsabilidade legal. Equilibram propósito e lucro. Focam em benefícios para TODOS os stakeholders, não apenas acionistas.',
                    caseStudy: {
                      company: 'Natura',
                      year: 2014,
                      story: 'Primeira empresa de capital aberto do mundo a receber certificação {{B Corp}}. Avaliada em trabalhadores, comunidade, meio ambiente e clientes. Recertifica periodicamente com pontuação mínima na B Impact Assessment.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '7.000+', label: 'B Corps no mundo' },
                        { value: '80+', label: 'Pontuação mínima (de 200)' },
                        { value: 'Auditoria', label: 'B Impact Assessment' },
                      ],
                      insight: 'B Corp não certifica produto — certifica a {{empresa inteira}}. Avalia impacto abrangente em todas as dimensões.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Great Place to Work',
                    period: 'Ambiente de trabalho',
                    text: 'Organização internacional que avalia e certifica empresas pela qualidade do ambiente de trabalho e {{satisfação dos colaboradores}}. Pesquisas de clima, feedbacks, análise de gestão de pessoas.',
                    caseStudy: {
                      company: 'Magazine Luiza',
                      year: 2022,
                      story: 'Consistentemente no ranking GPTW Brasil. Pesquisa de satisfação com {{92% de aprovação}} dos funcionários. Foco em desenvolvimento de carreira, benefícios e cultura inclusiva.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '100+', label: 'Países com ranking GPTW' },
                        { value: '92%', label: 'Aprovação Magalu' },
                        { value: 'Anual', label: 'Certificação renovável' },
                      ],
                      insight: 'GPTW prova que ambiente bom = {{retenção}} de talentos. Empresas no ranking têm turnover 50% menor.',
                    },
                  },
                  {
                    index: 3,
                    title: 'Instituto Ethos',
                    period: 'Referência brasileira',
                    text: 'Organização brasileira sem fins lucrativos que mobiliza empresas para práticas sustentáveis e responsáveis. Oferece {{indicadores}} para medir e melhorar práticas sociais, ambientais e econômicas.',
                    caseStudy: {
                      company: 'Itaú',
                      year: 2010,
                      story: 'Usa indicadores Ethos como base para relatório de sustentabilidade. Alinhamento com {{ODS da ONU}} e práticas visíveis globalmente, mesmo tendo foco brasileiro.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'Brasil', label: 'Foco nacional, impacto global' },
                        { value: 'ODS', label: 'Alinhado à agenda ONU' },
                        { value: 'Ferramentas', label: 'Indicadores + diagnóstico' },
                      ],
                      insight: 'Ethos permite empresas brasileiras serem {{comparadas}} a organizações internacionais em padrões reconhecidos.',
                    },
                  },
                  {
                    index: 4,
                    title: 'Ethisphere',
                    period: 'Ética global',
                    text: 'Publica anualmente o ranking das empresas mais éticas do mundo (World\'s Most Ethical Companies). Avalia governança corporativa, responsabilidade social, transparência, {{cultura ética}} e integridade.',
                    caseStudy: {
                      company: 'Natura',
                      year: 2023,
                      story: 'Única empresa brasileira de cosméticos no ranking Ethisphere. Avaliação por {{questionário extenso}}, análise de documentos e auditorias independentes.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '136', label: 'Empresas no ranking 2024' },
                        { value: '44', label: 'Países representados' },
                        { value: '5 áreas', label: 'Governança, RSC, transparência, cultura, integridade' },
                      ],
                      insight: 'Estar no ranking Ethisphere é sinal de que ética não é {{discurso}} — é prática auditada.',
                    },
                  },
                ],
              },
              {
                kind: 'heading',
                text: 'Rankings e índices de sustentabilidade',
              },
              {
                kind: 'pillar-grid',
                title: 'Índices que medem sustentabilidade corporativa',
                pillars: [
                  { icon: '🏆', title: 'Corporate Knights Global 100', description: '100 empresas mais sustentáveis do mundo. {{21 indicadores}} ESG: energia, carbono, água, diversidade. Métricas quantitativas e qualitativas.', metric: { value: '21', label: 'indicadores ESG' } },
                  { icon: '🌿', title: 'UEBT', description: 'Union for Ethical BioTrade. Certifica comércio ético de recursos da {{biodiversidade}}. L\'Oréal, Body Shop, Aveda certificadas. Foco em América Latina, África e Ásia.' },
                  { icon: '🇧🇷', title: 'ISE B3', description: 'Índice de Sustentabilidade Empresarial brasileiro. ~40 empresas com critérios rigorosos em E, S e G. Acesso a {{capital mais barato}}.', metric: { value: '~40', label: 'empresas selecionadas' } },
                  { icon: '🌐', title: 'Pacto Global ONU', description: 'Iniciativa para empresas alinharem operações a {{10 princípios}} universais em direitos humanos, trabalho, meio ambiente e anticorrupção.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Padrões de reporte e transparência',
              },
              {
                kind: 'paragraph',
                text: 'Não são "selos" para produto — são normas globais de como uma empresa deve {{medir e contar}} sua história de sustentabilidade para o mercado e investidores.',
              },
              {
                kind: 'pillar-grid',
                title: 'Padrões de disclosure',
                pillars: [
                  { icon: '📊', title: 'GRI', description: 'Padrão mais usado para relatórios de sustentabilidade. {{75%}} das 250 maiores empresas. Fala com todos os stakeholders.' },
                  { icon: '💰', title: 'SASB', description: 'Focado em indicadores que afetam desempenho {{financeiro}}. 77 padrões por indústria. Favorito de investidores.' },
                  { icon: '🌡️', title: 'CDP', description: 'Carbon Disclosure Project. Transparência sobre {{emissões de carbono}}, gestão de água e florestas. Nota de A a D-.' },
                  { icon: '⚠️', title: 'TCFD', description: 'Task Force on Climate-related Financial Disclosures. Riscos financeiros relacionados a {{mudanças climáticas}}. Recomendação, não obrigação (ainda).' },
                ],
              },
              {
                kind: 'heading',
                text: 'Selos de produto e cadeia de suprimentos',
              },
              {
                kind: 'paragraph',
                text: 'Certificam que a matéria-prima ou produto específico foi extraído ou produzido de forma {{ética e sustentável}}.',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Fair Trade International',
                    period: 'Comércio justo',
                    text: 'Garante {{comércio justo}}: preços mínimos para pequenos produtores e proibição de trabalho infantil. Selo reconhecido globalmente em café, cacau, algodão e mais.',
                    caseStudy: {
                      company: 'Café brasileiro',
                      year: 2023,
                      story: 'Brasil é o maior produtor de café Fair Trade do mundo. Cooperativas em {{Minas Gerais}} exportam com prêmio de preço de 20-30% acima do mercado convencional.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '+20-30%', label: 'Prêmio de preço' },
                        { value: '1.9M', label: 'Produtores certificados' },
                        { value: '70+', label: 'Países de origem' },
                      ],
                      insight: 'Fair Trade prova que pagar mais ao produtor {{não reduz}} margem — aumenta qualidade e fidelidade da cadeia.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Rainforest Alliance',
                    period: 'O selo do sapinho',
                    text: 'Atesta que o produto vem de fazendas que protegem {{biodiversidade}} e respeitam trabalhadores. O famoso sapinho verde em embalagens de chá, café, chocolate e banana.',
                    caseStudy: {
                      company: 'Nestlé',
                      year: 2020,
                      story: 'KitKat usa cacau {{100% Rainforest Alliance}}. Rastreabilidade da fazenda à fábrica. Investimento em comunidades produtoras do Oeste da África.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '🐸', label: 'Selo do sapinho' },
                        { value: '70+', label: 'Países certificados' },
                        { value: '6M+', label: 'Hectares certificados' },
                      ],
                      insight: 'Consumidor reconhece o sapinho — é o selo de produto sustentável mais {{visível}} no varejo global.',
                    },
                  },
                  {
                    index: 3,
                    title: 'FSC',
                    period: 'Florestas responsáveis',
                    text: 'Forest Stewardship Council. Garante que papel ou madeira vem de florestas manejadas de forma {{responsável}}. Três tipos: FSC 100%, FSC Misto e FSC Reciclado.',
                    caseStudy: {
                      company: 'Suzano',
                      year: 2023,
                      story: 'Maior produtora de celulose do mundo. {{100%}} das operações com certificação FSC. {{2.4 milhões}} de hectares de florestas plantadas certificadas no Brasil.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '200M+', label: 'Hectares certificados global' },
                        { value: '2.4M', label: 'Hectares Suzano (BR)' },
                        { value: '100%', label: 'Operações Suzano certificadas' },
                      ],
                      insight: 'FSC é pré-requisito para exportar papel e madeira para {{Europa e América do Norte}}.',
                    },
                  },
                  {
                    index: 4,
                    title: 'Cradle to Cradle (C2C)',
                    period: 'Economia circular',
                    text: 'Certifica produtos baseados na {{economia circular}}: tudo é reaproveitado, nada vira lixo. Avalia material, reutilização, energia, água e justiça social.',
                    caseStudy: {
                      company: 'Interface (pisos)',
                      year: 2020,
                      story: 'Fabricante de carpetes com certificação C2C Gold. Coleta carpetes usados e transforma em {{novos produtos}}. Zero resíduo em aterro desde 2020.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '5 categorias', label: 'Material, reuso, energia, água, social' },
                        { value: 'Basic→Platinum', label: '5 níveis de certificação' },
                        { value: '0', label: 'Resíduo em aterro (Interface)' },
                      ],
                      insight: 'C2C é o padrão mais {{exigente}} — não basta reciclar, precisa provar que o ciclo é 100% fechado.',
                    },
                  },
                ],
              },
              {
                kind: 'heading',
                text: 'Outras alternativas',
              },
              {
                kind: 'paragraph',
                text: '**1% for the Planet**: empresas que doam 1% das vendas totais para causas ambientais (Patagonia é cofundadora). **Pacto Global da ONU**: 10 princípios universais em direitos humanos, trabalho, meio ambiente e anticorrupção. **CSRD** (Corporate Sustainability Reporting Directive): diretiva europeia que torna reporte ESG {{obrigatório}} para empresas que operam na UE — afeta exportadores brasileiros.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada certificação/selo tem foco diferente. Classifique.',
              compare: {
                columnHeaders: ['Empresa inteira', 'Reporte', 'Produto/Cadeia'],
                rows: [
                  { label: 'Exemplos', values: ['B Corp, GPTW, Ethisphere', 'GRI, SASB, CDP, TCFD', 'Fair Trade, FSC, C2C'] },
                  { label: 'Avalia', values: ['Cultura e impacto total', 'Transparência e dados', 'Matéria-prima e produção'] },
                ],
              },
              drag: {
                instruction: 'Classifique cada certificação na categoria:',
                zones: [
                  { id: 'emp', label: 'Empresa inteira' },
                  { id: 'rep', label: 'Reporte' },
                  { id: 'prod', label: 'Produto/Cadeia' },
                ],
                items: [
                  { id: 'bcorp', label: 'B Corp (B Lab)', correctZone: 'emp', correctFeedback: 'Certo. B Corp certifica a empresa inteira.', wrongFeedback: 'B Corp avalia impacto total da empresa.' },
                  { id: 'cdp', label: 'CDP (Carbon Disclosure)', correctZone: 'rep', correctFeedback: 'Certo. CDP é padrão de reporte de carbono.', wrongFeedback: 'CDP é transparência/reporte.' },
                  { id: 'fsc', label: 'FSC (Forest Stewardship)', correctZone: 'prod', correctFeedback: 'Certo. FSC certifica madeira/papel da cadeia.', wrongFeedback: 'FSC certifica produto/cadeia florestal.' },
                  { id: 'gptw', label: 'Great Place to Work', correctZone: 'emp', correctFeedback: 'Certo. GPTW avalia ambiente de trabalho da empresa.', wrongFeedback: 'GPTW avalia a empresa como ambiente.' },
                  { id: 'ft', label: 'Fair Trade', correctZone: 'prod', correctFeedback: 'Certo. Fair Trade certifica comércio justo na cadeia.', wrongFeedback: 'Fair Trade é selo de cadeia de suprimentos.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Certificações se dividem em 3 níveis: {{empresa inteira}} (B Corp, GPTW, Ethisphere), {{reporte}} (GRI, SASB, CDP, TCFD) e {{produto/cadeia}} (Fair Trade, FSC, C2C, Rainforest Alliance). Ter certificação diferencia no mercado. Não ter é risco reputacional crescente.',
              keyInsights: [
                'B Corp certifica a empresa {{inteira}} — não um produto. 7.000+ empresas no mundo.',
                'CDP, TCFD e CSRD estão tornando reporte ESG {{obrigatório}}, não voluntário.',
                'Cradle to Cradle é o mais exigente: prova que o ciclo é {{100% fechado}} — zero resíduo.',
              ],
            },
          },
{
            id: 'M1-2-s3',
            type: 'simulation',
            title: 'GRI vs. SASB — Escolha o Framework Certo',
            simulationId: 'gri-sasb-choice',
            description: 'Cenários reais: qual framework usar para cada situação?',
          },
          
          
        ],
      },

    ],
  },
  {
    moduleId: 'M2',
    topics: [
      {
        id: 'M2-0',
        title: 'Gestao de Negocios',
        blocks: [
          {
            id: 'M2-0-cap1',
            type: 'chapter',
            number: 1,
            title: 'Modelos de Negócio e Canvas',
            subtitle: 'Como uma empresa cria, entrega e captura valor — do conceito ao Canvas',
            opening: {
              leadText: 'Um modelo de negócio descreve a lógica pela qual uma organização {{cria, entrega e captura valor}}. Não é o mesmo que plano de negócio — o modelo é a arquitetura estratégica; o plano é o documento operacional. Sem modelo claro, a empresa opera às cegas.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'Alexander Osterwalder e Yves Pigneur (2010) criaram o Business Model Canvas (BMC) — ferramenta visual que permite definir e visualizar modelos de negócio de forma sistêmica, integrada e em uma {{única página}}. O Canvas divide o modelo em 9 blocos que cobrem desde a proposta de valor até a estrutura de custos.',
              },
              {
                kind: 'pillar-grid',
                title: 'Os 9 blocos do Business Model Canvas',
                pillars: [
                  { icon: '💎', title: 'Proposta de Valor', description: 'Que {{problema}} você resolve? Que necessidade atende? O que torna sua oferta única.' },
                  { icon: '👥', title: 'Segmentos de Clientes', description: 'Para {{quem}} você cria valor? Quais segmentos são prioridade?' },
                  { icon: '📣', title: 'Canais', description: '{{Como}} você alcança e entrega valor aos clientes? Loja, app, marketplace, vendedor direto.' },
                  { icon: '🤝', title: 'Relacionamento', description: 'Que tipo de {{relação}} cada segmento espera? Self-service, assistência pessoal, comunidade.' },
                  { icon: '💰', title: 'Fontes de Receita', description: 'Por {{que valor}} os clientes pagam? Venda, assinatura, freemium, licenciamento.' },
                  { icon: '🔧', title: 'Recursos Principais', description: 'Que {{ativos}} são essenciais? Físicos, intelectuais, humanos, financeiros.' },
                  { icon: '⚙️', title: 'Atividades-Chave', description: 'Que {{ações}} são críticas? Produção, resolução de problemas, plataforma/rede.' },
                  { icon: '🤲', title: 'Parcerias Principais', description: 'Quem são os {{parceiros}} e fornecedores estratégicos? O que eles fornecem que você não faz?' },
                  { icon: '📊', title: 'Estrutura de Custos', description: 'Quais são os {{custos}} mais importantes? Fixos, variáveis, economias de escala.' },
                ],
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Canvas na Prática — Nubank',
                    period: 'Fintech',
                    text: 'Proposta de valor: banco sem tarifa, sem agência, 100% app. Segmento: {{jovens}} e excluídos bancários. Canais: app + indicação. Receita: interchange + crédito. Custo: 100% cloud, zero agência.',
                    caseStudy: {
                      company: 'Nubank',
                      year: 2013,
                      story: '8 pessoas, 1 apartamento. Canvas inteiro cabia num {{guardanapo}}: sem agência = sem custo fixo = tarifa zero = aquisição por indicação. Hoje: 80M clientes.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '80M', label: 'Clientes' },
                        { value: 'R$ 30', label: 'CAC (vs R$ 800+ bancário)' },
                        { value: '0', label: 'Agências físicas' },
                      ],
                      insight: 'O Canvas do Nubank eliminava 3 blocos inteiros (lojas, vendedores, custo fixo) — e isso ERA a {{inovação}}.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Canvas na Prática — iFood',
                    period: 'Plataforma',
                    text: 'Proposta de valor: conveniência (qualquer restaurante, qualquer hora). Segmento: {{3 lados}} (consumidor, restaurante, entregador). Receita: comissão por pedido. Recurso-chave: algoritmo.',
                    caseStudy: {
                      company: 'iFood',
                      year: 2023,
                      story: 'R$ 100B GMV/ano {{sem cozinha}} própria. O Canvas é pura plataforma: cada bloco conecta 3 stakeholders diferentes. Complexidade no modelo, simplicidade na experiência.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'R$ 100B', label: 'GMV anual' },
                        { value: '3 lados', label: 'Consumidor + restaurante + entregador' },
                        { value: '0', label: 'Ativos físicos' },
                      ],
                      insight: 'Plataformas têm Canvas com {{múltiplos segmentos}} — cada lado precisa da proposta de valor própria.',
                    },
                  },
                ],
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Os 9 blocos do Canvas cobrem 4 áreas. Classifique.',
              compare: {
                columnHeaders: ['Oferta', 'Clientes', 'Infraestrutura', 'Finanças'],
                rows: [
                  { label: 'Blocos', values: ['Proposta de Valor', 'Segmentos, Canais, Relação', 'Recursos, Atividades, Parcerias', 'Receita, Custos'] },
                ],
              },
              drag: {
                instruction: 'Classifique cada bloco na área correta:',
                zones: [
                  { id: 'of', label: 'Oferta' },
                  { id: 'cl', label: 'Clientes' },
                  { id: 'inf', label: 'Infraestrutura' },
                  { id: 'fin', label: 'Finanças' },
                ],
                items: [
                  { id: 'pv', label: 'Proposta de Valor', correctZone: 'of', correctFeedback: 'Certo. O que você oferece.', wrongFeedback: 'Proposta de valor = Oferta.' },
                  { id: 'seg', label: 'Segmentos de Clientes', correctZone: 'cl', correctFeedback: 'Certo. Para quem.', wrongFeedback: 'Segmentos = Clientes.' },
                  { id: 'rec', label: 'Recursos Principais', correctZone: 'inf', correctFeedback: 'Certo. Com o que faz.', wrongFeedback: 'Recursos = Infraestrutura.' },
                  { id: 'rev', label: 'Fontes de Receita', correctZone: 'fin', correctFeedback: 'Certo. Como ganha dinheiro.', wrongFeedback: 'Receita = Finanças.' },
                ],
              },
            },
            synthesis: {
              closingText: 'O Canvas reduz um modelo de negócio inteiro a {{9 blocos}} numa página. É ferramenta de pensamento, não de burocracia. Quando não consegue preencher um bloco, encontrou o gap estratégico.',
              keyInsights: [
                'Osterwalder & Pigneur (2010): Canvas permite {{visualizar}} o modelo de negócio completo numa página.',
                'Plataformas (iFood, Uber) têm Canvas com {{múltiplos segmentos}} — cada lado tem proposta de valor própria.',
                'O bloco mais crítico é Proposta de Valor — se não resolve {{problema real}}, os outros 8 não salvam.',
              ],
              nextChapterHint: 'Capítulo 2 · Planejamento Estratégico',
              nextChapterBlurb: 'SWOT, 5 Forças de Porter e Objetivos — como definir direção de longo prazo.',
            },
          },
          {
            id: 'M2-0-cap2',
            type: 'chapter',
            number: 2,
            title: 'Planejamento Estratégico',
            subtitle: 'SWOT, 5 Forças de Porter e Objetivos — definir direção antes de agir',
            opening: {
              leadText: 'Planejamento estratégico é o processo de definir a direção de longo prazo — onde a empresa quer chegar e {{como}} pretende chegar lá. Sem planejamento, a empresa opera por reação; com planejamento, opera por escolha.',
            },
            body: [
              {
                kind: 'pillar-grid',
                title: 'Análise SWOT — 4 quadrantes',
                pillars: [
                  { icon: '💪', title: 'S — Forças', description: 'Vantagens {{internas}}: competências, recursos, marca, equipe, tecnologia. O que você faz melhor que o concorrente.' },
                  { icon: '⚠️', title: 'W — Fraquezas', description: 'Limitações {{internas}}: gaps de competência, recursos escassos, processos falhos. Onde você é vulnerável.' },
                  { icon: '🚀', title: 'O — Oportunidades', description: 'Fatores {{externos}} favoráveis: tendências de mercado, regulação, tecnologia nova. O que o ambiente oferece.' },
                  { icon: '🔥', title: 'T — Ameaças', description: 'Fatores {{externos}} adversos: concorrentes, crise, regulação restritiva. O que pode te prejudicar.' },
                ],
              },
              {
                kind: 'paragraph',
                text: 'A SWOT cruza análise interna (Forças × Fraquezas) com análise externa (Oportunidades × Ameaças). O poder está nos cruzamentos: usar {{Forças}} para capturar Oportunidades, e eliminar Fraquezas que amplificam Ameaças.',
              },
              {
                kind: 'heading',
                text: '5 Forças de Porter — análise competitiva',
              },
              {
                kind: 'paragraph',
                text: 'Michael Porter (Harvard, 1979) propôs que a rentabilidade de um setor é determinada por 5 forças competitivas — não apenas pela rivalidade direta. Entender as 5 forças é entender {{por que}} alguns setores são lucrativos e outros não.',
              },
              {
                kind: 'pillar-grid',
                title: '5 Forças Competitivas (Porter, 1979)',
                pillars: [
                  { icon: '⚔️', title: 'Rivalidade entre concorrentes', description: 'Intensidade da competição. Muitos concorrentes + produtos similares = guerra de {{preço}} e margem baixa.' },
                  { icon: '🚪', title: 'Ameaça de novos entrantes', description: 'Quão fácil é entrar no setor? Barreiras: capital, regulação, marca, {{escala}}. Baixas barreiras = mais competição.' },
                  { icon: '🔄', title: 'Ameaça de substitutos', description: 'Produtos/serviços que resolvem o mesmo problema de forma {{diferente}}. Netflix substituiu Blockbuster sem ser locadora.' },
                  { icon: '💼', title: 'Poder dos fornecedores', description: 'Poucos fornecedores ou matéria exclusiva = fornecedor {{dita}} termos. Diversificar reduz dependência.' },
                  { icon: '🛒', title: 'Poder dos compradores', description: 'Compradores grandes ou com muitas opções = comprador {{pressiona}} preço. Diferenciação reduz esse poder.' },
                ],
              },
              {
                kind: 'paragraph',
                text: 'Definir objetivos estratégicos usando a metodologia SMART: {{Específicos}} (claros), {{Mensuráveis}} (com indicador), {{Atingíveis}} (realistas), {{Relevantes}} (alinhados à missão) e {{Temporais}} (com prazo). "Crescer" não é objetivo. "Aumentar receita em 20% até dezembro 2026" é.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'SWOT e Porter analisam dimensões diferentes. Classifique.',
              compare: {
                columnHeaders: ['SWOT', '5 Forças de Porter'],
                rows: [
                  { label: 'Foco', values: ['Empresa vs ambiente', 'Setor inteiro'] },
                  { label: 'Pergunta', values: ['Onde estamos?', 'O setor é lucrativo?'] },
                  { label: 'Autor', values: ['Andrews (Harvard, 1960s)', 'Porter (Harvard, 1979)'] },
                ],
              },
              drag: {
                instruction: 'Classifique: é fator SWOT ou Força de Porter?',
                zones: [
                  { id: 'swot', label: 'SWOT' },
                  { id: 'porter', label: 'Porter' },
                ],
                items: [
                  { id: 'marca', label: 'Marca forte da empresa', correctZone: 'swot', correctFeedback: 'Certo. Força interna = SWOT.', wrongFeedback: 'Marca da empresa = Força (SWOT).' },
                  { id: 'sub', label: 'Netflix substituindo Blockbuster', correctZone: 'porter', correctFeedback: 'Certo. Ameaça de substituto = Porter.', wrongFeedback: 'Substituto é força setorial = Porter.' },
                  { id: 'crise', label: 'Crise econômica no país', correctZone: 'swot', correctFeedback: 'Certo. Ameaça externa = SWOT.', wrongFeedback: 'Fator externo adverso = Ameaça (SWOT).' },
                  { id: 'forn', label: 'Fornecedor único de matéria-prima', correctZone: 'porter', correctFeedback: 'Certo. Poder do fornecedor = Porter.', wrongFeedback: 'Poder de barganha = Porter.' },
                ],
              },
            },
            synthesis: {
              closingText: 'SWOT analisa a empresa {{por dentro e por fora}}. Porter analisa o setor como um todo. SMART transforma análise em ação. Os três juntos = estratégia completa.',
              keyInsights: [
                'SWOT: o poder está nos {{cruzamentos}} — Força × Oportunidade = ação estratégica prioritária.',
                'Porter (1979): {{5 forças}} determinam a rentabilidade do setor, não só a rivalidade direta.',
                'Objetivo sem prazo é desejo. Com SMART, vira {{meta acionável}}.',
              ],
              nextChapterHint: 'Capítulo 3 · Gestão de Processos',
              nextChapterBlurb: 'Cadeia de Valor, processos core e como transformar atividades em vantagem competitiva.',
            },
          },
          {
            id: 'M2-0-cap3',
            type: 'chapter',
            number: 3,
            title: 'Gestão de Processos e Cadeia de Valor',
            subtitle: 'Como cada atividade cria (ou destrói) valor para o cliente',
            opening: {
              leadText: 'Um processo é uma sequência de atividades que transforma insumos em resultados. Toda empresa é, essencialmente, um conjunto de processos — alguns geram valor, outros geram {{custo sem valor}}.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'Michael Porter (Harvard, 1985) criou o modelo da Cadeia de Valor para visualizar como cada atividade dentro da empresa contribui para a margem de lucro. A cadeia divide as atividades em {{primárias}} (que tocam o produto/serviço diretamente) e de {{suporte}} (que sustentam as primárias).',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Atividades Primárias',
                    period: 'Criam valor diretamente',
                    text: '**Logística de entrada** (receber matéria-prima), **Operações** (transformar insumo em produto), **Logística de saída** (entregar ao cliente), **Marketing e Vendas** (atrair e converter), **Serviço** (pós-venda e suporte).',
                    caseStudy: {
                      company: 'Amazon',
                      year: 2023,
                      story: 'A vantagem competitiva da Amazon está na {{logística de saída}}: entrega em 1 dia (Prime). Investiu US$ 60B+ em centros de distribuição. A atividade primária mais forte define a empresa.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'US$ 60B+', label: 'Investimento em logística' },
                        { value: '1 dia', label: 'Entrega Prime' },
                        { value: '200+', label: 'Centros de distribuição' },
                      ],
                      insight: 'A atividade primária mais forte da cadeia de valor define a {{vantagem competitiva}} da empresa.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Atividades de Suporte',
                    period: 'Sustentam as primárias',
                    text: '**Infraestrutura** (gestão, planejamento, finanças), **RH** (recrutamento, treinamento), **Desenvolvimento de Tecnologia** (P&D, sistemas), **Aquisição** (compras, fornecedores).',
                    caseStudy: {
                      company: 'Google',
                      year: 2023,
                      story: 'A atividade de suporte mais forte do Google é {{Desenvolvimento de Tecnologia}} (P&D). Investe US$ 40B+/ano em pesquisa. A busca é a primária, mas a IA que sustenta é suporte.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'US$ 40B+', label: 'P&D anual' },
                        { value: '180.000', label: 'Funcionários' },
                        { value: '#1', label: 'Busca global' },
                      ],
                      insight: 'Atividades de suporte {{invisíveis}} para o cliente podem ser a maior fonte de vantagem competitiva.',
                    },
                  },
                ],
              },
              {
                kind: 'paragraph',
                text: 'A margem é a diferença entre o valor total gerado e o custo total das atividades. Para aumentar margem, ou {{aumenta valor percebido}} (diferenciação) ou {{reduz custo}} das atividades (eficiência). Porter: estratégia é escolher quais atividades fazer diferente do concorrente.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Atividades primárias vs suporte. Classifique.',
              compare: {
                columnHeaders: ['Primárias', 'Suporte'],
                rows: [
                  { label: 'Relação com produto', values: ['Direta', 'Indireta'] },
                  { label: 'Exemplos', values: ['Logística, operações, vendas', 'RH, P&D, infra, compras'] },
                ],
              },
              drag: {
                instruction: 'Primária ou Suporte?',
                zones: [
                  { id: 'pri', label: 'Primária' },
                  { id: 'sup', label: 'Suporte' },
                ],
                items: [
                  { id: 'log', label: 'Entrega do produto ao cliente', correctZone: 'pri', correctFeedback: 'Certo. Logística de saída = primária.', wrongFeedback: 'Entrega toca o produto = primária.' },
                  { id: 'rh', label: 'Treinamento de funcionários', correctZone: 'sup', correctFeedback: 'Certo. RH = suporte.', wrongFeedback: 'Treinamento = suporte (RH).' },
                  { id: 'mkt', label: 'Campanha de marketing', correctZone: 'pri', correctFeedback: 'Certo. Marketing e vendas = primária.', wrongFeedback: 'Marketing toca o cliente = primária.' },
                  { id: 'ti', label: 'Desenvolvimento de sistema interno', correctZone: 'sup', correctFeedback: 'Certo. Tecnologia = suporte.', wrongFeedback: 'Sistema interno = suporte (tecnologia).' },
                ],
              },
            },
            synthesis: {
              closingText: 'A Cadeia de Valor mostra que toda atividade ou {{cria valor}} ou gera custo sem valor. A vantagem competitiva vem de fazer atividades diferentes — ou de fazer as mesmas atividades de forma diferente.',
              keyInsights: [
                'Porter (1985): estratégia é {{escolher}} quais atividades fazer diferente do concorrente.',
                'Amazon: US$ 60B+ em logística. A atividade primária mais forte {{define}} a empresa.',
                'Margem = valor total - custo total. Ou diferencia (mais valor) ou eficienta (menos custo).',
              ],
              nextChapterHint: 'Capítulo 4 · Tipos de Empresa e Tributação',
              nextChapterBlurb: 'MEI, ME, LTDA — estrutura jurídica e regime tributário que impactam seu negócio.',
            },
          },
          {
            id: 'M2-0-cap4',
            type: 'chapter',
            number: 4,
            title: 'Tipos de Empresa e Regime Tributário',
            subtitle: 'MEI, ME, LTDA, Simples, Presumido — a estrutura que define quanto você paga',
            opening: {
              leadText: 'A escolha da estrutura jurídica e do regime tributário impacta diretamente a carga fiscal, a responsabilidade dos sócios e a {{capacidade de crescimento}} do negócio. Errar aqui custa caro — literalmente.',
            },
            body: [
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'MEI — Microempreendedor Individual',
                    period: 'Até R$ 81k/ano',
                    text: 'Faturamento até R$ 81 mil/ano. Pode ter {{1 funcionário}}. Impostos fixos (~R$ 70/mês). Sem sócio. CNPJ simplificado. Ideal para começar ou formalizar atividade autônoma.',
                    caseStudy: {
                      company: 'Estatística Brasil',
                      year: 2024,
                      story: '{{15 milhões}} de MEIs no Brasil. 70% da formalização de novos negócios. Custo fixo de ~R$ 70/mês cobre INSS + ISS/ICMS. O caminho mais rápido de CPF para CNPJ.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '15M', label: 'MEIs no Brasil' },
                        { value: 'R$ 81k', label: 'Limite anual' },
                        { value: '~R$ 70', label: 'Imposto fixo/mês' },
                      ],
                      insight: 'MEI é porta de entrada, não destino. Ao ultrapassar R$ 81k, migra para {{ME}} automaticamente.',
                    },
                  },
                  {
                    index: 2,
                    title: 'ME / EPP — Microempresa',
                    period: 'Até R$ 4.8M/ano',
                    text: 'Faturamento até R$ 4.8 milhões/ano. Pode ter sócios e mais funcionários. Acesso ao {{Simples Nacional}} (tributação unificada). Maioria das PMEs brasileiras.',
                    caseStudy: {
                      company: 'Sebrae',
                      year: 2023,
                      story: 'Simples Nacional atende {{5.7 milhões}} de empresas. Unifica 8 tributos em 1 guia (DAS). Alíquota inicia em {{6%}} para comércio e 15.5% para serviços.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '5.7M', label: 'Empresas no Simples' },
                        { value: '6%', label: 'Alíquota inicial (comércio)' },
                        { value: '1 guia', label: 'DAS unifica 8 tributos' },
                      ],
                      insight: 'Simples simplifica mas nem sempre é o mais {{barato}}. Acima de certo faturamento, Lucro Presumido pode pagar menos.',
                    },
                  },
                  {
                    index: 3,
                    title: 'LTDA / S.A.',
                    period: 'Sem limite',
                    text: 'LTDA: responsabilidade limitada ao capital social. S.A.: pode ter ações negociadas em bolsa. Obrigatória para empresas maiores, investimento externo e {{governança corporativa}} formal.',
                    caseStudy: {
                      company: 'Magazine Luiza',
                      year: 2015,
                      story: 'Migrou de LTDA familiar para S.A. aberta na B3. Permitiu captar capital para a {{transformação digital}} que multiplicou valor por 100x. Estrutura jurídica habilitou a estratégia.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'B3', label: 'Bolsa de valores brasileira' },
                        { value: '100x', label: 'Valorização Magalu' },
                        { value: 'Governança', label: 'Conselho obrigatório' },
                      ],
                      insight: 'A estrutura jurídica não é burocracia — é {{habilitador estratégico}}. S.A. abre portas que LTDA não abre.',
                    },
                  },
                ],
              },
              {
                kind: 'heading',
                text: 'Regimes tributários',
              },
              {
                kind: 'pillar-grid',
                title: '3 regimes tributários no Brasil',
                pillars: [
                  { icon: '📦', title: 'Simples Nacional', description: '8 tributos em 1 guia. Alíquota de {{6% a 33%}} conforme faturamento e atividade. Até R$ 4.8M/ano. O mais simples mas nem sempre mais barato.', metric: { value: '5.7M', label: 'empresas' } },
                  { icon: '📊', title: 'Lucro Presumido', description: 'Base de cálculo presumida (8% comércio, 32% serviços). Até R$ 78M/ano. Pode ser mais {{barato}} que Simples para margens altas.', metric: { value: 'R$ 78M', label: 'limite anual' } },
                  { icon: '📈', title: 'Lucro Real', description: 'Imposto sobre lucro efetivo. Obrigatório acima de R$ 78M ou setores regulados. Mais complexo mas mais {{justo}} para margens baixas.', metric: { value: 'Obrigatório', label: 'bancos, seguradoras' } },
                ],
              },
              {
                kind: 'paragraph',
                text: 'A escolha do regime impacta diretamente quanto a empresa paga de imposto. Um restaurante com margem de 15% no Simples pode pagar mais do que no Presumido. Um SaaS com margem de 60% no Presumido pode pagar mais do que no Simples. A resposta é sempre: {{depende do caso}}. Contador é investimento, não custo.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada tipo de empresa serve a um momento do negócio. Classifique.',
              compare: {
                columnHeaders: ['MEI', 'ME/Simples', 'LTDA/S.A.'],
                rows: [
                  { label: 'Faturamento', values: ['Até R$ 81k', 'Até R$ 4.8M', 'Sem limite'] },
                  { label: 'Complexidade', values: ['Mínima', 'Média', 'Alta'], viz: 'bars', intensities: [0.15, 0.5, 0.9] },
                ],
              },
              drag: {
                instruction: 'Qual estrutura para cada situação?',
                zones: [
                  { id: 'mei', label: 'MEI' },
                  { id: 'me', label: 'ME/Simples' },
                  { id: 'sa', label: 'LTDA/S.A.' },
                ],
                items: [
                  { id: 'free', label: 'Freelancer que fatura R$ 60k/ano', correctZone: 'mei', correctFeedback: 'Certo. Abaixo de R$ 81k = MEI.', wrongFeedback: 'R$ 60k/ano cabe no MEI.' },
                  { id: 'rest', label: 'Restaurante com R$ 2M/ano', correctZone: 'me', correctFeedback: 'Certo. PME com sócios = ME/Simples.', wrongFeedback: 'R$ 2M com sócios = ME/Simples.' },
                  { id: 'inv', label: 'Startup querendo investidor externo', correctZone: 'sa', correctFeedback: 'Certo. Investimento externo exige S.A. ou LTDA.', wrongFeedback: 'Investidor exige governança = LTDA/S.A.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Estrutura jurídica e regime tributário são decisões {{estratégicas}}, não burocráticas. MEI para começar, ME para crescer, S.A. para escalar. Simples para simplificar, Presumido para otimizar, Real para margens baixas.',
              keyInsights: [
                '15 milhões de MEIs no Brasil. Porta de entrada: R$ 70/mês e {{CNPJ}} em 15 minutos.',
                'Simples nem sempre é mais barato. Acima de certo faturamento, Presumido pode {{economizar}} 30%+.',
                'Magazine Luiza: LTDA → S.A. habilitou a transformação digital. Estrutura jurídica = {{habilitador estratégico}}.',
              ],
            },
          },
          {
            id: 'M2-0-s1',
            type: 'simulation',
            title: 'Business Model Canvas — Monte Seu Modelo de Negócio',
            simulationId: 'business-model-canvas',
            description: 'Preencha os 9 blocos do Canvas para o seu negócio. Veja se a lógica fecha.',
          },
        ],
      },

      {
        id: 'M2-1',
        title: 'Demonstracoes Contabeis',
        blocks: [
          {
            id: 'M2-1-cap1',
            type: 'chapter',
            number: 1,
            title: 'Balanço Patrimonial',
            subtitle: 'A fotografia financeira — o que a empresa tem, deve e quanto sobra',
            opening: {
              leadText: 'O Balanço Patrimonial é a fotografia financeira da empresa em um determinado momento. Ele responde: "o que a empresa {{tem}}, o que ela {{deve}} e quanto {{sobra}} para os donos?" A equação fundamental da contabilidade: Ativo = Passivo + Patrimônio Líquido.',
            },
            body: [
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Ativo — O que a empresa TEM',
                    period: 'Lado esquerdo',
                    text: '**Ativo Circulante**: bens e direitos que viram dinheiro em até 12 meses — caixa, banco, contas a receber, estoque. **Ativo Não Circulante**: bens de longo prazo — imóveis, máquinas, veículos, {{investimentos}} de longo prazo, intangíveis (marca, patente).',
                    caseStudy: {
                      company: 'Magazine Luiza',
                      year: 2023,
                      story: 'Ativo total: {{R$ 35 bilhões}}. Ativo circulante (estoque + recebíveis) = 60%. O marketplace (intangível) vale mais que todas as lojas físicas juntas.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'R$ 35B', label: 'Ativo total Magalu' },
                        { value: '60%', label: 'Circulante' },
                        { value: 'Intangível', label: 'Marketplace > lojas' },
                      ],
                      insight: 'Em empresas digitais, o ativo mais valioso é {{intangível}} — marca, plataforma, base de dados. Não aparece no prédio.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Passivo — O que a empresa DEVE',
                    period: 'Lado direito (dívidas)',
                    text: '**Passivo Circulante**: obrigações de até 12 meses — fornecedores, salários, impostos, empréstimos de curto prazo. **Passivo Não Circulante**: dívidas de longo prazo — financiamentos, debêntures, {{provisões}} trabalhistas.',
                    caseStudy: {
                      company: 'Americanas',
                      year: 2023,
                      story: 'Fraude contábil de {{R$ 20 bilhões}} escondida no passivo. Fornecedores não contabilizados. O balanço "saudável" era mentira. Prova de que ler o balanço é tão importante quanto {{produzi-lo}}.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'R$ 20B', label: 'Fraude contábil' },
                        { value: '-97%', label: 'Queda das ações' },
                        { value: 'Passivo oculto', label: 'Fornecedores não registrados' },
                      ],
                      insight: 'O passivo conta a história real da empresa. Se está {{inflado}} ou oculto, o balanço inteiro é mentira.',
                    },
                  },
                  {
                    index: 3,
                    title: 'Patrimônio Líquido — O que SOBRA',
                    period: 'Lado direito (donos)',
                    text: 'PL = Ativo - Passivo. É o que pertence aos sócios/acionistas. Inclui capital social, reservas de lucros e {{lucros acumulados}}. PL negativo = empresa deve mais do que tem = insolvência técnica.',
                    caseStudy: {
                      company: 'Nubank',
                      year: 2022,
                      story: 'PL negativo por anos — {{estratégia deliberada}}: investir em crescimento antes de lucrar. Em 2023, primeiro ano de lucro: R$ 1 bilhão. PL virou positivo. Investidores financiaram o gap.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'R$ 1B', label: 'Primeiro lucro (2023)' },
                        { value: 'Negativo', label: 'PL por anos (estratégico)' },
                        { value: '80M', label: 'Clientes que justificaram' },
                      ],
                      insight: 'PL negativo não é sempre ruim. Startups em {{hipercrescimento}} queimam caixa de propósito. O que importa é o caminho para o positivo.',
                    },
                  },
                ],
              },
              {
                kind: 'paragraph',
                text: 'A equação Ativo = Passivo + PL SEMPRE fecha. Se não fecha, tem erro contábil (ou fraude). O balanço é auditado anualmente por empresas independentes (Big 4: Deloitte, PwC, EY, KPMG). Ler o balanço é a habilidade financeira mais importante para qualquer {{gestor}} — não só para contadores.',
              },
              {
                kind: 'pillar-grid',
                title: 'Indicadores-chave do Balanço',
                pillars: [
                  { icon: '📊', title: 'Liquidez Corrente', description: 'Ativo Circulante / Passivo Circulante. Acima de 1 = empresa paga dívidas de curto prazo. Abaixo de 1 = {{alerta}}.', metric: { value: '> 1.0', label: 'saudável' } },
                  { icon: '⚖️', title: 'Endividamento', description: 'Passivo Total / Ativo Total. Quanto do ativo é financiado por {{dívida}}. Acima de 70% = risco.', metric: { value: '< 70%', label: 'confortável' } },
                  { icon: '💰', title: 'ROE', description: 'Lucro Líquido / PL. Retorno sobre o capital dos {{donos}}. Quanto a empresa gera de lucro para cada real investido.', metric: { value: '> 15%', label: 'bom para BR' } },
                ],
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada item do balanço tem seu lugar. Classifique.',
              compare: {
                columnHeaders: ['Ativo', 'Passivo', 'PL'],
                rows: [
                  { label: 'Significa', values: ['O que TEM', 'O que DEVE', 'O que SOBRA'] },
                  { label: 'Exemplo', values: ['Caixa, estoque, imóvel', 'Fornecedores, empréstimos', 'Capital social, lucros'] },
                ],
              },
              drag: {
                instruction: 'Classifique cada item:',
                zones: [
                  { id: 'ativo', label: 'Ativo' },
                  { id: 'passivo', label: 'Passivo' },
                  { id: 'pl', label: 'Patrimônio Líquido' },
                ],
                items: [
                  { id: 'cx', label: 'Dinheiro em caixa', correctZone: 'ativo', correctFeedback: 'Certo. Caixa = ativo circulante.', wrongFeedback: 'Dinheiro é algo que a empresa TEM = ativo.' },
                  { id: 'forn', label: 'Dívida com fornecedor', correctZone: 'passivo', correctFeedback: 'Certo. Dívida = passivo.', wrongFeedback: 'Dívida = algo que DEVE = passivo.' },
                  { id: 'lucro', label: 'Lucros acumulados', correctZone: 'pl', correctFeedback: 'Certo. Lucro dos donos = PL.', wrongFeedback: 'Lucro acumulado pertence aos donos = PL.' },
                  { id: 'maq', label: 'Máquinas da fábrica', correctZone: 'ativo', correctFeedback: 'Certo. Bem físico = ativo não circulante.', wrongFeedback: 'Máquina é bem = ativo.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Balanço = {{fotografia}}. Ativo (tem) = Passivo (deve) + PL (sobra). Sempre fecha. Se não fecha, tem problema. Liquidez, endividamento e ROE são os 3 indicadores que todo gestor deve saber ler.',
              keyInsights: [
                'Ativo = Passivo + PL. Se não fecha, tem erro ou {{fraude}} (Americanas R$ 20B).',
                'Em empresas digitais, o ativo mais valioso é {{intangível}} — marca, plataforma, dados.',
                'PL negativo pode ser estratégico em startups. O que importa é o {{caminho}} para o positivo.',
              ],
              nextChapterHint: 'Capítulo 2 · DRE',
              nextChapterBlurb: 'A operação gerou lucro ou prejuízo? Da receita bruta ao lucro líquido.',
            },
          },
          {
            id: 'M2-1-cap2',
            type: 'chapter',
            number: 2,
            title: 'DRE — Demonstração do Resultado',
            subtitle: 'Da receita bruta ao lucro líquido — onde a empresa ganha e onde perde',
            opening: {
              leadText: 'A DRE mostra o desempenho financeiro ao longo de um período (mês, trimestre, ano). Ela responde: "a operação gerou {{lucro}} ou {{prejuízo}}?" Diferente do balanço (fotografia), a DRE é um filme — mostra o que aconteceu ao longo do tempo.',
            },
            body: [
              {
                kind: 'step-flow',
                title: 'Estrutura da DRE — de cima para baixo',
                steps: [
                  { number: 1, title: 'Receita Bruta', description: 'Tudo que a empresa vendeu no período. {{Sem descontos}}, sem devoluções, sem impostos sobre venda.' },
                  { number: 2, title: '(-) Deduções', description: 'Impostos sobre venda (ICMS, PIS, COFINS), devoluções e descontos concedidos. Receita Bruta - Deduções = {{Receita Líquida}}.' },
                  { number: 3, title: '(-) CMV / CPV', description: 'Custo da Mercadoria Vendida (comércio) ou Custo do Produto Vendido (indústria). O que custou para {{produzir ou comprar}} o que vendeu. Receita Líquida - CMV = Lucro Bruto.' },
                  { number: 4, title: '(-) Despesas Operacionais', description: 'Administrativas (aluguel, salários gestão), Comerciais (marketing, comissões), Financeiras (juros). Lucro Bruto - Despesas = {{EBIT}} (Lucro Operacional).' },
                  { number: 5, title: '(-) IR e CSLL', description: 'Imposto de Renda e Contribuição Social sobre o lucro. EBIT - Impostos = {{Lucro Líquido}}. É o que realmente sobra.' },
                ],
              },
              {
                kind: 'pillar-grid',
                title: 'Margens — os indicadores que revelam eficiência',
                pillars: [
                  { icon: '📊', title: 'Margem Bruta', description: 'Lucro Bruto / Receita Líquida. Mede eficiência na {{produção}}. Magazine Luiza: ~25%. Nubank: ~70%.', metric: { value: '> 30%', label: 'saudável para varejo' } },
                  { icon: '⚙️', title: 'Margem Operacional (EBIT)', description: 'EBIT / Receita Líquida. Mede eficiência na {{operação}} como um todo. Inclui custos administrativos.', metric: { value: '> 15%', label: 'bom' } },
                  { icon: '💰', title: 'Margem Líquida', description: 'Lucro Líquido / Receita Líquida. O que realmente {{sobra}} depois de tudo. Ambev: ~20%. Varejo: ~3-5%.', metric: { value: 'Varia', label: 'por setor' } },
                ],
              },
              {
                kind: 'paragraph',
                text: 'A DRE é onde gestores encontram problemas: margem bruta caindo = custos de produção subindo. Margem operacional caindo = empresa inchando (despesas crescendo mais que receita). Margem líquida negativa = empresa operando no {{prejuízo}}. Cada linha da DRE é uma alavanca estratégica.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada margem mede eficiência em nível diferente. Classifique.',
              compare: {
                columnHeaders: ['Margem Bruta', 'Margem Operacional', 'Margem Líquida'],
                rows: [
                  { label: 'Mede', values: ['Eficiência produção', 'Eficiência operação', 'Resultado final'] },
                  { label: 'Desconta', values: ['Só custos diretos', '+ despesas', '+ impostos'] },
                ],
              },
              drag: {
                instruction: 'Qual margem é afetada por cada evento?',
                zones: [
                  { id: 'mb', label: 'Margem Bruta' },
                  { id: 'mo', label: 'Margem Operacional' },
                  { id: 'ml', label: 'Margem Líquida' },
                ],
                items: [
                  { id: 'mat', label: 'Matéria-prima subiu 20%', correctZone: 'mb', correctFeedback: 'Certo. Custo direto afeta margem bruta.', wrongFeedback: 'Matéria-prima = custo direto = margem bruta.' },
                  { id: 'alug', label: 'Aluguel do escritório dobrou', correctZone: 'mo', correctFeedback: 'Certo. Despesa administrativa afeta operacional.', wrongFeedback: 'Aluguel = despesa operacional.' },
                  { id: 'ir', label: 'Mudança na alíquota de IR', correctZone: 'ml', correctFeedback: 'Certo. Imposto sobre lucro afeta margem líquida.', wrongFeedback: 'IR impacta o resultado final = líquida.' },
                ],
              },
            },
            synthesis: {
              closingText: 'A DRE é um {{funil}}: receita entra no topo, custos e despesas são subtraídos, lucro (ou prejuízo) sai embaixo. Cada linha é uma alavanca. Margem caindo = sinal de alerta. Margem subindo = eficiência melhorando.',
              keyInsights: [
                'DRE de cima para baixo: Receita → (-) CMV → Lucro Bruto → (-) Despesas → EBIT → (-) IR → {{Lucro Líquido}}.',
                'Margem bruta alta + margem líquida baixa = empresa eficiente na produção mas {{inchada}} na operação.',
                'Ambev: margem líquida ~20%. Varejo brasileiro: ~3-5%. O setor define o {{benchmark}}.',
              ],
              nextChapterHint: 'Capítulo 3 · Fluxo de Caixa',
              nextChapterBlurb: 'O oxigênio do negócio — por que empresas lucrativas quebram.',
            },
          },
          {
            id: 'M2-1-cap3',
            type: 'chapter',
            number: 3,
            title: 'Fluxo de Caixa',
            subtitle: 'O oxigênio do negócio — por que empresas lucrativas quebram',
            opening: {
              leadText: 'Fluxo de caixa é o registro de todas as entradas e saídas de dinheiro. Diferente da DRE (regime de competência), o fluxo usa {{regime de caixa}} — registra quando o dinheiro efetivamente entra ou sai. Empresa lucrativa na DRE pode quebrar por falta de caixa.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'A diferença entre lucro e caixa é o conceito mais importante de finanças empresariais. Vendeu R$ 100 mil em janeiro, mas o cliente paga em 90 dias? Na DRE, o lucro aparece em janeiro. No caixa, o dinheiro só entra em {{abril}}. Se o aluguel vence em fevereiro, a empresa pode estar "lucrativa" e sem dinheiro para pagar.',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Fluxo Operacional',
                    period: 'O dia a dia',
                    text: 'Entradas e saídas da {{operação}}: recebimento de vendas, pagamento de fornecedores, salários, impostos. É o coração do negócio. Se o operacional é negativo recorrente, o modelo tem problema.',
                    caseStudy: {
                      company: 'iFood',
                      year: 2020,
                      story: 'Fluxo operacional negativo por anos — {{queimava caixa}} para crescer (subsídios a entregadores e restaurantes). Estratégia: dominar mercado primeiro, monetizar depois. Em 2023, operacional virou positivo.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'Negativo', label: 'Operacional até 2022' },
                        { value: 'Positivo', label: 'Operacional a partir de 2023' },
                        { value: 'R$ 100B', label: 'GMV que justificou a queima' },
                      ],
                      insight: 'Queimar caixa é estratégia válida SE tem {{plano}} para virar positivo. Sem plano, é caminho para falência.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Fluxo de Investimento',
                    period: 'O futuro',
                    text: 'Compra/venda de ativos de longo prazo: equipamentos, imóveis, {{aquisições}}, investimentos. Normalmente negativo em empresas que crescem (investindo). Positivo pode significar que está vendendo ativos.',
                    caseStudy: {
                      company: 'Ambev',
                      year: 2023,
                      story: 'Investiu {{R$ 4 bilhões}} em novas fábricas e automação. Fluxo de investimento fortemente negativo. O investimento de hoje é a margem de amanhã.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'R$ 4B', label: 'CAPEX anual' },
                        { value: 'Negativo', label: 'Fluxo (investindo)' },
                        { value: 'ROI', label: 'Retorno em 3-5 anos' },
                      ],
                      insight: 'Fluxo de investimento positivo em empresa que não está crescendo = {{vendendo os móveis}} para pagar o aluguel.',
                    },
                  },
                  {
                    index: 3,
                    title: 'Fluxo de Financiamento',
                    period: 'De onde vem o dinheiro',
                    text: 'Captação e pagamento de dívidas, emissão de ações, dividendos. {{Como}} a empresa se financia: capital próprio (ações) ou de terceiros (dívida).',
                    caseStudy: {
                      company: 'Nubank',
                      year: 2021,
                      story: 'IPO na NYSE captou {{US$ 2.6 bilhões}}. Fluxo de financiamento massivamente positivo. Esse dinheiro financiou o crescimento que gerou 80M de clientes.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'US$ 2.6B', label: 'IPO NYSE' },
                        { value: 'Ações', label: 'Capital próprio (não dívida)' },
                        { value: '80M', label: 'Clientes financiados' },
                      ],
                      insight: 'Financiar por ação (equity) dilui sócios mas não gera juros. Por dívida não dilui mas gera {{obrigação fixa}}.',
                    },
                  },
                ],
              },
              {
                kind: 'paragraph',
                text: '**Runway** é quanto tempo a empresa sobrevive com o caixa atual, sem nova receita. Fórmula: Caixa ÷ Queima Mensal = meses de sobrevivência. Startups consideram {{6 meses}} o mínimo seguro. Abaixo disso, é emergência de captação.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada tipo de fluxo conta uma história diferente. Classifique.',
              compare: {
                columnHeaders: ['Operacional', 'Investimento', 'Financiamento'],
                rows: [
                  { label: 'Conta', values: ['Dia a dia', 'Ativos/futuro', 'Dívida/capital'] },
                  { label: 'Saudável', values: ['Positivo', 'Negativo (crescendo)', 'Depende'] },
                ],
              },
              drag: {
                instruction: 'Classifique cada movimento no fluxo correto:',
                zones: [
                  { id: 'op', label: 'Operacional' },
                  { id: 'inv', label: 'Investimento' },
                  { id: 'fin', label: 'Financiamento' },
                ],
                items: [
                  { id: 'venda', label: 'Receber pagamento de cliente', correctZone: 'op', correctFeedback: 'Certo. Receita da operação.', wrongFeedback: 'Receber de cliente = operacional.' },
                  { id: 'maq', label: 'Comprar máquina nova', correctZone: 'inv', correctFeedback: 'Certo. Ativo de longo prazo.', wrongFeedback: 'Compra de ativo = investimento.' },
                  { id: 'emp', label: 'Tomar empréstimo bancário', correctZone: 'fin', correctFeedback: 'Certo. Captação de dívida.', wrongFeedback: 'Empréstimo = financiamento.' },
                  { id: 'sal', label: 'Pagar salários', correctZone: 'op', correctFeedback: 'Certo. Despesa operacional.', wrongFeedback: 'Salário = custo da operação.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Lucro ≠ Caixa. Empresa lucrativa quebra por falta de {{oxigênio}} (caixa). Os 3 fluxos (operacional, investimento, financiamento) contam histórias complementares. Runway = quanto tempo você sobrevive.',
              keyInsights: [
                'Vendeu R$ 100k em janeiro, cliente paga em abril. Na DRE = lucro. No caixa = {{zero}}.',
                'iFood queimou caixa por anos de propósito. Sem plano de virar positivo, queima = {{falência}}.',
                'Runway < 6 meses = emergência. Acima de 12 meses = {{tranquilidade}} para focar em produto.',
              ],
            },
          },
          {
            id: 'M2-1-s1',
            type: 'simulation',
            title: 'Monte um Balanço Patrimonial — Ativo = Passivo + PL',
            simulationId: 'balance-sheet-builder',
            description: 'Monte um balanço completo e veja se a equação fecha.',
          },
          {
            id: 'M2-1-s2',
            type: 'simulation',
            title: 'Simulador de DRE — Calcule Suas Margens',
            simulationId: 'dre-analyzer',
            description: 'Insira receita e custos e veja as 3 margens (bruta, operacional, líquida).',
          },
          {
            id: 'M2-1-s3',
            type: 'simulation',
            title: 'Projeção de Fluxo de Caixa — 6 Meses',
            simulationId: 'cash-flow-projection',
            description: 'Projete entradas e saídas para os próximos 6 meses e veja seu runway.',
          },
        ],
      },

      {
        id: 'M2-2',
        title: 'Matematica Financeira',
        blocks: [
          {
            id: 'M2-2-cap1',
            type: 'chapter',
            number: 1,
            title: 'Juros Simples vs Juros Compostos',
            subtitle: 'A diferença que muda tudo — por que Einstein chamou juros compostos de 8ª maravilha',
            opening: {
              leadText: 'Juros simples crescem em linha reta. Juros compostos crescem em {{curva exponencial}} — porque incidem sobre juros anteriores, não só sobre o principal. Essa diferença transforma investimentos e destrói devedores.',
            },
            body: [
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Juros Simples',
                    period: 'Crescimento linear',
                    text: 'Fórmula: J = C × i × t. Os juros incidem apenas sobre o {{capital inicial}}. R$ 10.000 a 10% a.a. por 5 anos = R$ 5.000 de juros. Total: R$ 15.000. Crescimento previsível e constante.',
                    caseStudy: {
                      company: 'Exemplo prático',
                      year: 2024,
                      story: 'Empréstimo de R$ 50.000 a juros simples de 2% a.m. por 12 meses: juros = R$ 50.000 × 0.02 × 12 = {{R$ 12.000}}. Total a pagar: R$ 62.000. Cada mês paga o mesmo valor de juros.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'J = C×i×t', label: 'Fórmula' },
                        { value: 'Linear', label: 'Crescimento' },
                        { value: 'Raro', label: 'Pouco usado no mercado real' },
                      ],
                      insight: 'Juros simples são usados em pouquíssimas situações reais. O mercado financeiro opera quase exclusivamente com {{compostos}}.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Juros Compostos',
                    period: 'Crescimento exponencial',
                    text: 'Fórmula: M = C × (1 + i)^t. Juros incidem sobre {{juros anteriores}}. R$ 10.000 a 10% a.a. por 5 anos = R$ 16.105. Diferença de R$ 1.105 vs simples. Em 30 anos: R$ 174.494 vs R$ 40.000.',
                    caseStudy: {
                      company: 'Investimento real',
                      year: 2024,
                      story: 'R$ 1.000/mês a {{1% a.m.}} (Selic ~12% a.a.) por 20 anos: aporte total R$ 240.000. Valor final: {{R$ 989.000}}. Os juros compostos geraram R$ 749.000 — mais de 3x o que você colocou.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'M = C(1+i)^t', label: 'Fórmula' },
                        { value: 'Exponencial', label: 'Crescimento' },
                        { value: '3x', label: 'Juros > aporte em 20 anos' },
                      ],
                      insight: 'Einstein (atribuído): "Juros compostos são a {{8ª maravilha}} do mundo. Quem entende, ganha. Quem não entende, paga."',
                    },
                  },
                ],
              },
              {
                kind: 'paragraph',
                text: 'A regra dos 72: divida 72 pela taxa anual para saber em quantos anos o dinheiro dobra. Taxa de 12% a.a. → 72 ÷ 12 = {{6 anos}} para dobrar. Taxa de 6% → 12 anos. Ferramenta mental rápida para avaliar investimentos e dívidas.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Juros simples vs compostos. Classifique.',
              compare: {
                columnHeaders: ['Simples', 'Compostos'],
                rows: [
                  { label: 'Incide sobre', values: ['Só capital inicial', 'Capital + juros anteriores'] },
                  { label: 'Crescimento', values: ['Linear', 'Exponencial'] },
                  { label: 'Uso real', values: ['Raro', 'Padrão do mercado'] },
                ],
              },
              drag: {
                instruction: 'Simples ou Compostos?',
                zones: [
                  { id: 'sim', label: 'Simples' },
                  { id: 'comp', label: 'Compostos' },
                ],
                items: [
                  { id: 'cart', label: 'Juros do cartão de crédito', correctZone: 'comp', correctFeedback: 'Certo. Cartão = compostos (e altíssimos).', wrongFeedback: 'Cartão usa juros compostos — por isso a dívida explode.' },
                  { id: 'selic', label: 'Rendimento da Selic', correctZone: 'comp', correctFeedback: 'Certo. Investimentos usam compostos.', wrongFeedback: 'Selic rende juros sobre juros = compostos.' },
                  { id: 'multa', label: 'Multa fixa de atraso', correctZone: 'sim', correctFeedback: 'Certo. Multa fixa não compõe.', wrongFeedback: 'Multa fixa = valor fixo = simples.' },
                ],
              },
            },
            synthesis: {
              closingText: 'A diferença entre simples e compostos parece pequena no curto prazo. No longo prazo, é a diferença entre {{riqueza e estagnação}}. Em 30 anos a 10% a.a.: simples dá R$ 40k; compostos dá R$ 174k.',
              keyInsights: [
                'Regra dos 72: 72 ÷ taxa = anos para {{dobrar}}. Selic 12% = 6 anos.',
                'R$ 1.000/mês a 1% a.m. por 20 anos: aporte R$ 240k, resultado {{R$ 989k}}.',
                'Juros compostos são padrão no mercado. Quem não entende, paga {{caro}}.',
              ],
              nextChapterHint: 'Capítulo 2 · Valor do Dinheiro no Tempo',
              nextChapterBlurb: 'VP, VF, VPL e TIR — ferramentas para decidir se um investimento vale a pena.',
            },
          },
          {
            id: 'M2-2-cap2',
            type: 'chapter',
            number: 2,
            title: 'Valor do Dinheiro no Tempo',
            subtitle: 'VP, VF, VPL e TIR — as ferramentas de decisão de investimento',
            opening: {
              leadText: 'R$ 100 hoje valem mais que R$ 100 daqui a um ano — porque hoje podem ser investidos e render juros. Esse princípio, o {{valor do dinheiro no tempo}}, fundamenta toda decisão de investimento.',
            },
            body: [
              {
                kind: 'pillar-grid',
                title: 'Conceitos fundamentais',
                pillars: [
                  { icon: '⬅️', title: 'Valor Presente (VP)', description: 'Quanto vale HOJE um valor futuro. "Se vou receber R$ 10.000 em 2 anos, quanto isso vale {{agora}}?" Desconta pela taxa de juros.' },
                  { icon: '➡️', title: 'Valor Futuro (VF)', description: 'Quanto vale NO FUTURO um valor de hoje. "Se invisto R$ 10.000 hoje a 10% a.a., quanto terei em {{5 anos}}?" Multiplica pela taxa.' },
                  { icon: '📊', title: 'VPL', description: 'Valor Presente Líquido. Soma de todos os fluxos de caixa futuros trazidos a valor presente, {{menos}} o investimento inicial. VPL > 0 = investimento vale.', metric: { value: '> 0', label: 'investir' } },
                  { icon: '📈', title: 'TIR', description: 'Taxa Interna de Retorno. A taxa que faz o VPL = 0. Se TIR > custo de capital, o investimento {{gera valor}}. Se TIR < custo, destrói.', metric: { value: '> WACC', label: 'gera valor' } },
                ],
              },
              {
                kind: 'paragraph',
                text: 'VPL e TIR são as duas ferramentas mais usadas por empresas para decidir investimentos. O VPL dá o valor absoluto (quanto o projeto agrega em reais). A TIR dá a taxa percentual de retorno. Quando divergem (VPL diz sim, TIR diz não), {{priorize o VPL}} — ele é mais confiável para projetos mutuamente exclusivos.',
              },
              {
                kind: 'paragraph',
                text: '**Payback** é o tempo para recuperar o investimento inicial. Payback simples ignora o valor do tempo; payback descontado traz os fluxos a valor presente. Limitação: ignora o que acontece {{depois}} de recuperar o investimento. Um projeto com payback de 5 anos pode gerar lucro por 20 anos — o payback não captura isso.',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'VPL na Prática',
                    period: 'Decisão de investir',
                    text: 'Investimento: R$ 500k. Fluxos esperados: R$ 150k/ano por 5 anos. Taxa de desconto: 12%. VPL = {{R$ 40.837}}. Como VPL > 0, o investimento gera valor acima do custo de capital.',
                    caseStudy: {
                      company: 'Expansão de fábrica',
                      year: 2024,
                      story: 'Ambev avalia nova linha de produção: investimento {{R$ 80M}}, fluxos de R$ 25M/ano por 6 anos. VPL a 10%: R$ 28.8M positivo. Aprovado — gera valor.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'R$ 28.8M', label: 'VPL do projeto' },
                        { value: '10%', label: 'Taxa de desconto (WACC)' },
                        { value: '6 anos', label: 'Horizonte dos fluxos' },
                      ],
                      insight: 'VPL > 0 não garante sucesso — garante que, SE os fluxos se confirmarem, o projeto {{gera valor}} acima do custo de capital.',
                    },
                  },
                  {
                    index: 2,
                    title: 'TIR na Prática',
                    period: 'Comparação de retorno',
                    text: 'Mesmo projeto da Ambev: TIR = {{18.7%}}. Como 18.7% > 10% (WACC), confirma que gera valor. Mas se outro projeto tem TIR de 25% com mesmo risco, priorize o de TIR maior.',
                    caseStudy: {
                      company: 'Startup vs Renda Fixa',
                      year: 2024,
                      story: 'Investir R$ 100k numa startup com TIR projetada de 35% ou num CDB de {{12%}}? A TIR maior justifica o risco maior — desde que a projeção seja confiável.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '18.7%', label: 'TIR do projeto Ambev' },
                        { value: '> WACC', label: 'Condição para investir' },
                        { value: 'Excel', label: 'Função TIR() calcula automaticamente' },
                      ],
                      insight: 'TIR alta com projeção {{otimista}} = risco. Sempre faça cenários pessimista, base e otimista.',
                    },
                  },
                ],
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada ferramenta responde uma pergunta diferente. Classifique.',
              compare: {
                columnHeaders: ['VPL', 'TIR', 'Payback'],
                rows: [
                  { label: 'Responde', values: ['Quanto agrega (R$)', 'Qual retorno (%)', 'Quando recupera'] },
                  { label: 'Limitação', values: ['Depende da taxa', 'Projetos excludentes', 'Ignora pós-payback'] },
                ],
              },
              drag: {
                instruction: 'Qual ferramenta usar?',
                zones: [
                  { id: 'vpl', label: 'VPL' },
                  { id: 'tir', label: 'TIR' },
                  { id: 'pay', label: 'Payback' },
                ],
                items: [
                  { id: 'val', label: '"Quanto esse projeto agrega em reais?"', correctZone: 'vpl', correctFeedback: 'Certo. Valor absoluto = VPL.', wrongFeedback: 'Valor em reais = VPL.' },
                  { id: 'ret', label: '"Qual a taxa de retorno?"', correctZone: 'tir', correctFeedback: 'Certo. Percentual = TIR.', wrongFeedback: 'Taxa de retorno = TIR.' },
                  { id: 'tmp', label: '"Quando recupero o investimento?"', correctZone: 'pay', correctFeedback: 'Certo. Tempo = Payback.', wrongFeedback: 'Tempo de recuperação = Payback.' },
                ],
              },
            },
            synthesis: {
              closingText: 'R$ 100 hoje ≠ R$ 100 amanhã. VPL traduz fluxos futuros em {{valor presente}}. TIR dá a taxa de retorno. Payback dá o tempo. Quando VPL e TIR divergem, priorize VPL.',
              keyInsights: [
                'VPL > 0 = investimento {{gera valor}} acima do custo de capital. Regra de ouro.',
                'TIR > WACC = retorno supera o custo do dinheiro. Mas cuidado com projeções {{otimistas}}.',
                'Payback ignora o que acontece depois. Projeto de payback longo pode ser o mais {{lucrativo}}.',
              ],
              nextChapterHint: 'Capítulo 3 · Indicadores Financeiros',
              nextChapterBlurb: 'ROI, Liquidez e Endividamento — os números que todo gestor deve saber de cor.',
            },
          },
          {
            id: 'M2-2-cap3',
            type: 'chapter',
            number: 3,
            title: 'Indicadores Financeiros',
            subtitle: 'ROI, Liquidez e Endividamento — os 3 números que todo gestor precisa saber',
            opening: {
              leadText: 'Indicadores financeiros traduzem demonstrações contábeis em {{decisões}}. Não adianta ter balanço e DRE se ninguém lê. ROI, liquidez e endividamento são os indicadores mínimos que todo gestor deve monitorar.',
            },
            body: [
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'ROI — Retorno sobre Investimento',
                    period: 'O básico dos básicos',
                    text: 'Fórmula: ROI = (Ganho - Custo) / Custo × 100. Mede o {{retorno percentual}} de qualquer investimento. ROI de 50% = para cada R$ 1 investido, voltaram R$ 1,50.',
                    caseStudy: {
                      company: 'Marketing Digital',
                      year: 2024,
                      story: 'Campanha Google Ads: investiu {{R$ 10.000}}, gerou R$ 35.000 em vendas. ROI = (35k - 10k) / 10k = {{250%}}. Para cada R$ 1, voltaram R$ 3,50. Campanha excelente.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '250%', label: 'ROI da campanha' },
                        { value: 'R$ 3,50', label: 'Retorno por R$ 1 investido' },
                        { value: 'Universal', label: 'Funciona para qualquer investimento' },
                      ],
                      insight: 'ROI não considera {{tempo}}. ROI de 100% em 1 mês é melhor que 100% em 5 anos. Compare sempre no mesmo horizonte.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Liquidez Corrente',
                    period: 'Capacidade de pagar',
                    text: 'Fórmula: Ativo Circulante / Passivo Circulante. Mede se a empresa consegue pagar suas dívidas de {{curto prazo}}. Acima de 1 = saudável. Abaixo de 1 = alerta.',
                    caseStudy: {
                      company: 'Varejo brasileiro',
                      year: 2023,
                      story: 'Liquidez média do varejo BR: {{1.2}}. Magazine Luiza em crise (2022): liquidez caiu para 0.95 — cada R$ 1 de dívida tinha apenas R$ 0,95 em caixa. Reestruturou e voltou a 1.1.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '> 1.0', label: 'Saudável' },
                        { value: '< 1.0', label: 'Alerta' },
                        { value: '< 0.5', label: 'Emergência' },
                      ],
                      insight: 'Liquidez muito alta (> 3.0) pode significar dinheiro {{parado}} que deveria estar investido. O ótimo é entre 1.2 e 2.0.',
                    },
                  },
                  {
                    index: 3,
                    title: 'Endividamento',
                    period: 'Quanto é de terceiros',
                    text: 'Fórmula: Passivo Total / Ativo Total × 100. Quanto do ativo é financiado por {{dívida de terceiros}}. Acima de 70% = risco elevado. Acima de 90% = zona de perigo.',
                    caseStudy: {
                      company: 'Americanas',
                      year: 2023,
                      story: 'Endividamento real (após fraude descoberta): acima de {{100%}} — devia mais do que tinha. Passivo de R$ 42 bilhões contra ativo de R$ 22 bilhões. Insolvência técnica.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '< 50%', label: 'Confortável' },
                        { value: '50-70%', label: 'Atenção' },
                        { value: '> 70%', label: 'Risco elevado' },
                      ],
                      insight: 'Dívida não é ruim por si. Dívida que gera retorno acima dos juros é {{alavancagem}}. Dívida que não gera retorno é armadilha.',
                    },
                  },
                ],
              },
              {
                kind: 'pillar-grid',
                title: 'Outros indicadores essenciais',
                pillars: [
                  { icon: '📊', title: 'EBITDA', description: 'Lucro antes de juros, impostos, depreciação e amortização. Mede geração de caixa {{operacional}}. Usado em valuation.', metric: { value: 'Operacional', label: 'puro' } },
                  { icon: '🔄', title: 'Giro do Ativo', description: 'Receita / Ativo Total. Quantas vezes o ativo "gira" em receita por ano. Mede {{eficiência}} no uso dos recursos.' },
                  { icon: '💰', title: 'Margem EBITDA', description: 'EBITDA / Receita. Rentabilidade operacional sem distorções contábeis. Ambev: ~35%. Varejo: {{~8%}}.', metric: { value: '> 15%', label: 'bom' } },
                  { icon: '⏱️', title: 'Ciclo Financeiro', description: 'Prazo médio estoque + prazo recebimento - prazo pagamento. Quantos dias a empresa financia a {{operação}} com capital próprio.' },
                ],
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada indicador responde uma pergunta diferente. Classifique.',
              compare: {
                columnHeaders: ['ROI', 'Liquidez', 'Endividamento'],
                rows: [
                  { label: 'Pergunta', values: ['Valeu investir?', 'Consigo pagar?', 'Quanto devo?'] },
                  { label: 'Ideal', values: ['Quanto maior melhor', '1.2 a 2.0', 'Abaixo de 50%'] },
                ],
              },
              drag: {
                instruction: 'Qual indicador responde cada pergunta?',
                zones: [
                  { id: 'roi', label: 'ROI' },
                  { id: 'liq', label: 'Liquidez' },
                  { id: 'end', label: 'Endividamento' },
                ],
                items: [
                  { id: 'camp', label: '"A campanha de marketing valeu a pena?"', correctZone: 'roi', correctFeedback: 'Certo. Retorno do investimento = ROI.', wrongFeedback: 'Valeu investir = ROI.' },
                  { id: 'pag', label: '"Consigo pagar o fornecedor este mês?"', correctZone: 'liq', correctFeedback: 'Certo. Capacidade de pagar curto prazo = liquidez.', wrongFeedback: 'Pagar dívida curta = liquidez.' },
                  { id: 'div', label: '"Quanto do meu ativo é financiado por dívida?"', correctZone: 'end', correctFeedback: 'Certo. Proporção de dívida = endividamento.', wrongFeedback: 'Proporção de terceiros = endividamento.' },
                ],
              },
            },
            synthesis: {
              closingText: 'ROI mede {{retorno}}. Liquidez mede {{capacidade de pagar}}. Endividamento mede {{dependência de terceiros}}. Os 3 juntos dão o diagnóstico financeiro mínimo de qualquer empresa.',
              keyInsights: [
                'ROI não considera tempo. Compare ROI sempre no {{mesmo horizonte}}.',
                'Liquidez muito alta (> 3.0) = dinheiro {{parado}}. Ótimo: 1.2 a 2.0.',
                'Dívida que gera retorno acima dos juros é {{alavancagem}}. Abaixo, é armadilha.',
              ],
            },
          },
          {
            id: 'M2-2-s1',
            type: 'simulation',
            title: 'Simulador Juros Simples vs Compostos',
            simulationId: 'compound-interest',
            description: 'Compare juros simples e compostos lado a lado com seus números.',
          },
          {
            id: 'M2-2-s2',
            type: 'simulation',
            title: 'Quiz de Indicadores Financeiros — Calcule e Interprete',
            simulationId: 'financial-indicators',
            description: 'Calcule ROI, liquidez e endividamento com dados reais de empresas.',
          },
        ],
      },

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
            body: 'Marketing pode ser definido como uma série de atividades que levam a uma transação de troca com lucro entre comprador e vendedor. O composto de marketing — produto, preço, ponto-de-venda e promoção — é a ferramenta básica das empresas de hoje.\n\nA gênese do marketing reside em uma transformação estrutural profunda da economia política e da capacidade produtiva global. O marketing não emerge de uma necessidade comunicacional, mas de um imperativo econômico decorrente do colapso da assimetria histórica entre oferta e demanda.\n\nEra da Produção → Demanda > Oferta — o problema é produzir.\nEra do Marketing → Oferta > Demanda — o problema é vender.\n\nÉ nesse ponto que emerge o problema central que estrutura todo o campo do marketing: em um ambiente onde múltiplas ofertas competem por recursos limitados — tempo, dinheiro, atenção — como se organiza o processo de escolha?\n\n**Na prática brasileira:**\n— O mercado de cosméticos no Brasil movimenta R$ 130 bilhões/ano (4º maior do mundo). A Natura não vende apenas produtos — organiza o processo de escolha via consultoras, que reduzem o risco e o esforço de decisão da consumidora.\n— O iFood não inventou a entrega de comida — organizou o processo de escolha entre milhares de restaurantes usando dados, algoritmos de recomendação e avaliações.\n— O Mercado Livre não produz nada — é puro marketing: organiza a troca entre quem quer vender e quem quer comprar, reduzindo custo, risco e esforço de ambos os lados.\n\nPergunta-chave: Como sua empresa organiza o processo de escolha do cliente? Se a resposta é "não organiza", isso explica por que vender é tão difícil.',
          },
          {
            id: 'M3-mkt-concept1',
            type: 'concept',
            term: 'Marketing',
            definition: 'Marketing é o sistema pelo qual se organiza a criação, oferta, comunicação e entrega de valor para viabilizar trocas sob condições de escassez.',
            example: 'O iFood não inventou a entrega de comida — organizou o processo de escolha entre milhares de restaurantes usando dados, algoritmos e avaliações.',
            antiExample: 'Postar no Instagram sem estratégia NÃO é marketing. É comunicação sem sistema — não organiza escolha, não reduz risco, não facilita troca.',
          },
          {
            id: 'M3-mkt-decision1',
            type: 'decision',
            scenario: 'Você é dono de uma marca de cosméticos artesanais. Suas vendas são boas pelo Instagram, mas o crescimento estagnou. O Mercado Livre oferece parceria para listar seus produtos. Você aceita?',
            options: [
              { label: 'Aceitar e listar todos os produtos', tradeoffs: { upside: 'Acesso a 80M+ compradores ativos no marketplace', downside: 'Comissão de 16-19% e perda de controle da experiência do cliente', risk: 'medium' as const } },
              { label: 'Aceitar apenas com produtos exclusivos para o canal', tradeoffs: { upside: 'Testa o canal sem canibalizar vendas diretas', downside: 'Exige SKUs novos e gestão de estoque separada', risk: 'low' as const } },
              { label: 'Recusar e investir no próprio e-commerce', tradeoffs: { upside: 'Controle total da marca e margem de 100%', downside: 'Investimento alto em tráfego pago e tecnologia, sem garantia de resultado', risk: 'high' as const } },
            ],
            realWorldAnalog: 'A Natura opera nos dois modelos: venda direta por consultoras + marketplace próprio + presença em farmácias. A diversificação de canais foi chave para crescer de R$ 7B para R$ 26B em receita.',
            lesson: 'Marketing não é escolher UM canal. É organizar o processo de escolha do cliente onde ele já está — e cada canal tem trade-offs diferentes.',
          },
          {
            id: 'M3-0-t2',
            type: 'text',
            title: 'Escassez, Custo de Oportunidade e a Natureza Decisória do Mercado',
            body: 'A economia define escassez não como falta absoluta, mas como a condição estrutural na qual os recursos disponíveis são insuficientes para atender a todas as necessidades e desejos simultaneamente.\n\nEscassez → Recursos < Necessidades\nEscolha → Toda decisão implica renúncia\nCusto de Oportunidade → Valor da melhor alternativa descartada\n\nToda a teoria econômica moderna, de Adam Smith a Mankiw, parte da mesma premissa: recursos são limitados, desejos são ilimitados, logo toda escolha implica renúncia.\n\nDo ponto de vista do consumidor, toda decisão de compra é, simultaneamente:\n— Uma decisão de aquisição\n— Uma decisão de renúncia\n— Uma decisão de alocação de recursos escassos\n\nDo ponto de vista das organizações, toda estratégia de marketing é uma estratégia de priorização:\n— Escolher mercados é renunciar a outros\n— Escolher posicionamentos é abandonar outros\n— Escolher públicos é excluir outros\n\nPara o marketing estratégico, se o tempo e a atenção do consumidor são finitos, a competição deixa de ser apenas contra concorrentes diretos e passa a ser uma luta contra qualquer estímulo que dispute a mesma janela de atenção ou o mesmo orçamento mental. O sucesso de uma marca reside na sua capacidade de organizar o processo de escolha de tal forma que o consumidor perceba que a renúncia necessária é a menor e mais vantajosa possível.',
          },
          {
            id: 'M3-mkt-concept2',
            type: 'concept',
            term: 'Custo de Oportunidade',
            definition: 'O valor da melhor alternativa descartada ao fazer uma escolha. Toda decisão econômica implica renúncia — e o custo real inclui aquilo que você deixou de ganhar.',
            example: 'Se você investe R$ 100K em estoque e o dinheiro renderia 12% ao ano no CDI, o custo de oportunidade do estoque é R$ 12K/ano — mesmo que "não tenha gastado" nada além do estoque.',
            antiExample: 'Dizer "foi de graça" quando um serviço é grátis ignora o tempo investido. Se você gastou 8 horas para conseguir algo "grátis" e sua hora vale R$ 100, o custo de oportunidade foi R$ 800.',
          },
          {
            id: 'M3-mkt-exercise1',
            type: 'inline-exercise',
            prompt: 'Analise o custo de oportunidade de uma decisão real do seu negócio (ou de um negócio que você conhece).',
            context: 'Toda decisão empresarial envolve renúncia. O custo de oportunidade não é abstrato — ele aparece como lucro não realizado, clientes não atendidos ou mercados não explorados.',
            fields: [
              { id: 'decision', label: 'Qual decisão está analisando?', placeholder: 'Ex: Investir R$ 50K em reforma da loja vs. em marketing digital' },
              { id: 'chosen', label: 'O que foi escolhido e por quê?', placeholder: 'Descreva a opção escolhida e a justificativa', multiline: true },
              { id: 'opportunity-cost', label: 'Qual o custo de oportunidade? O que foi renunciado?', placeholder: 'Quanto a alternativa descartada geraria em receita, crescimento ou aprendizado?', multiline: true },
            ],
            evaluationCriteria: ['Identifica claramente a alternativa renunciada', 'Quantifica (ou estima) o valor da renúncia', 'Conclui se a escolha foi acertada considerando o trade-off'],
            expectedConcepts: ['custo de oportunidade', 'trade-off', 'alocação de recursos'],
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
            id: 'M3-mkt-framework1',
            type: 'framework',
            frameworkId: 'marketing-diagnostic',
            title: 'Diagnóstico — Sua Empresa Organiza o Processo de Escolha?',
            description: 'Marketing é organizar valor, escolha e troca sob escassez. Avalie como sua empresa está nessas 5 funções.',
            fields: [
              { id: 'uncertainty', label: 'Como você reduz a incerteza do cliente?', placeholder: 'Ex: garantia, reviews, prova social, demonstração grátis...', helpText: 'Clientes com incerteza alta não compram. O que você faz para eliminar dúvidas?' },
              { id: 'risk', label: 'Como você reduz o risco percebido?', placeholder: 'Ex: devolução sem custo, teste grátis, depoimentos...', helpText: 'Risco percebido = "e se eu me arrepender?" Quanto menor, maior a conversão.' },
              { id: 'decision-cost', label: 'Como você reduz o custo de decisão?', placeholder: 'Ex: comparador de produtos, recomendação personalizada, curadoria...', helpText: 'Se o cliente precisa pensar muito para escolher, ele desiste. Simplifique.' },
              { id: 'value-org', label: 'Como você organiza a percepção de valor?', placeholder: 'Ex: preço-âncora, planos comparativos, destaque do mais vendido...', helpText: 'O valor não está no produto — está na percepção. Como você posiciona?' },
              { id: 'exchange', label: 'Como você facilita a troca?', placeholder: 'Ex: PIX, parcelamento, frete grátis, checkout de 1 clique...', helpText: 'Cada barreira na hora de pagar é um cliente perdido.' },
            ],
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
            id: 'M3-mkt-compare1',
            type: 'compare',
            title: 'Valor Percebido — Como Marcas Manipulam a Balança',
            question: 'O que faz um produto "valer" 10x mais que outro similar?',
            dimensions: ['Produto', 'Preço', 'Benefício funcional', 'Benefício emocional/social', 'Custo invisível reduzido', 'Resultado na balança'],
            items: [
              { id: 'havaianas', label: 'Havaianas Slim', values: ['Chinelo de borracha', 'R$ 45', 'Conforto básico', 'Status de "cool brasileiro", design colorido', 'Baixo risco social — aceita em qualquer contexto casual', 'Benefício percebido >> custo → vende 200M pares/ano'], highlight: 'O chinelo é o mesmo. O valor percebido mudou com reposicionamento.' },
              { id: 'iphone', label: 'iPhone', values: ['Smartphone', 'R$ 8.000+', 'Câmera, apps, ecossistema Apple', 'Status social, pertencimento, "segurança" de escolha', 'Zero risco de julgamento negativo + atalho cognitivo (não precisa comparar specs)', 'Benefício emocional domina → margem de 45% (vs 5% da concorrência)'], highlight: 'A marca como atalho cognitivo elimina o esforço mental da escolha.' },
              { id: 'nubank', label: 'Nubank', values: ['Banco digital', 'R$ 0 (sem tarifas)', 'App funcional, cartão sem anuidade', 'Anti-banco, modernidade, autonomia', 'Elimina filas, burocracia, gerente insistente', 'Custo zero + risco baixo → 100M+ clientes em 10 anos'], highlight: 'Zerou custos visíveis E invisíveis simultaneamente.' },
            ],
            insight: 'Produtos premium não vencem por serem "melhores" — vencem porque manipulam a equação de valor percebido. Reduzir custos invisíveis (risco social, esforço mental, tempo) pode ser mais poderoso que melhorar o produto.',
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
            body: 'Na teoria clássica:\n\nNecessidade = carência humana básica, fisiológica ou psicológica. Independe de cultura.\nDesejo = forma culturalmente específica de satisfazer uma necessidade. É aprendido.\nDemanda = desejo + capacidade real de troca. É o que o mercado efetivamente realiza.\n\nIsso é estrutural. Muitos negócios quebram porque:\n— Falam com o desejo mas não existe demanda real\n— Não existe capacidade de pagamento\n— Não existe contexto decisório adequado\n\nEntender a tríade é entender por que não basta ter um produto que as pessoas querem. É preciso que exista condição real de troca. Marketing sem demanda real é comunicação sem destino.\n\n**Teste prático para seu negócio:**\n— Necessidade existe? → As pessoas precisam do que você vende? (Se não, desista ou pivote)\n— Desejo existe? → As pessoas QUEREM a forma como você entrega? (Se não, redesenhe)\n— Demanda existe? → As pessoas PODEM pagar pelo que você cobra? (Se não, ajuste preço ou público)\n\nExemplo: Comida saudável é necessidade (todo mundo precisa comer bem). Açaí gourmet é desejo (forma específica de atender a necessidade). Açaí a R$ 45 num bairro de renda baixa não gera demanda — mesmo que o desejo exista, não há capacidade de troca. O mesmo açaí a R$ 45 nos Jardins (SP) gera fila.\n\nO marketing não cria necessidades — organiza desejos em demanda viável.',
          },
          {
            id: 'M3-mkt-concept3',
            type: 'concept',
            term: 'Demanda',
            definition: 'Demanda é desejo sustentado por capacidade real de troca. Não basta querer — é preciso poder pagar. Sem demanda real, marketing é comunicação sem destino.',
            example: 'Açaí gourmet a R$ 45 nos Jardins (SP) gera fila. O mesmo açaí a R$ 45 num bairro de renda baixa não gera demanda — o desejo existe, mas não há capacidade de troca.',
            antiExample: '"Todo mundo quer nosso produto!" não significa que há demanda. Se ninguém paga o preço que você precisa cobrar, não há demanda — há apenas desejo sem troca.',
          },
          {
            id: 'M3-mkt-exercise2',
            type: 'inline-exercise',
            prompt: 'Aplique o teste Necessidade-Desejo-Demanda ao seu negócio (ou a um produto/serviço que você conhece).',
            context: 'Marketing não cria necessidades — organiza desejos em demanda viável. O teste abaixo revela em qual ponto sua oferta pode estar falhando.',
            fields: [
              { id: 'product', label: 'Qual o produto ou serviço?', placeholder: 'Ex: Curso online de gestão financeira para MEIs' },
              { id: 'need', label: 'A necessidade existe? As pessoas PRECISAM disso?', placeholder: 'Qual necessidade básica (fisiológica ou psicológica) isso atende?', multiline: true },
              { id: 'desire', label: 'O desejo existe? As pessoas QUEREM a forma como você entrega?', placeholder: 'Elas preferem seu formato, marca e experiência? Ou há formas mais desejadas?', multiline: true },
              { id: 'demand', label: 'A demanda existe? As pessoas PODEM pagar o que você cobra?', placeholder: 'Há capacidade real de troca no público-alvo? Quanto estariam dispostas a pagar?', multiline: true },
            ],
            evaluationCriteria: ['Distingue claramente necessidade, desejo e demanda', 'Identifica se o gargalo está na necessidade, no desejo ou na demanda', 'Propõe ajuste concreto se algum nível falha'],
            expectedConcepts: ['necessidade', 'desejo', 'demanda', 'capacidade de troca'],
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
      {
        id: 'M3-1',
        title: 'Lideranca e Gestao de Equipes',
        blocks: [
          {
            id: 'M3-1-t1',
            type: 'text',
            title: 'O que é Liderança — E Por que Gestão Não é a Mesma Coisa',
            body: 'Liderança e gestão são complementares, mas não são sinônimos. Confundir os dois é o erro mais comum em organizações.\n\n**Gestão** = fazer as coisas certas acontecerem. Planejar, organizar, controlar, medir. Foco: eficiência, processo, resultado previsível.\n\n**Liderança** = fazer as pessoas certas quererem fazer as coisas certas. Inspirar, alinhar, desenvolver, dar direção. Foco: visão, pessoas, mudança.\n\nPeter Drucker resumiu: "Gestão é fazer certo as coisas. Liderança é fazer as coisas certas."\n\nJohn Kotter (Harvard) complementa: gestão lida com complexidade — liderança lida com mudança. Organizações precisam das duas coisas, mas o desequilíbrio é o que gera problemas.\n\n**Na prática empresarial:**\n— Empresa com muita gestão e pouca liderança: processos impecáveis, zero inovação, equipe desmotivada executando sem saber por quê\n— Empresa com muita liderança e pouca gestão: visão inspiradora, execução caótica, resultados inconsistentes\n— Empresa equilibrada: direção clara + execução disciplinada + pessoas engajadas\n\n**Teste rápido — Você está liderando ou apenas gerenciando?**\n— Quanto tempo do seu dia é gasto em planilhas vs. conversas com pessoas?\n— Sua equipe sabe POR QUÊ faz o que faz, ou apenas O QUÊ fazer?\n— Se você sair por 30 dias, a equipe continua funcionando e tomando boas decisões?\n— Quando foi a última vez que alguém da equipe trouxe uma ideia nova sem você pedir?',
          },
          {
            id: 'M3-lid-concept1',
            type: 'concept',
            term: 'Liderança vs Gestão',
            definition: 'Gestão é fazer certo as coisas (eficiência, processo, controle). Liderança é fazer as coisas certas (visão, pessoas, mudança). São complementares, não sinônimos.',
            example: 'Magazine Luiza: Frederico Trajano LIDERA a transformação digital (visão) enquanto o time de operações GERENCIA a integração de 1.300 lojas (processo).',
            antiExample: 'Um gerente que cria planilhas perfeitas mas cuja equipe não sabe POR QUÊ faz o que faz está gerenciando, não liderando.',
          },
          {
            id: 'M3-lid-exercise1',
            type: 'inline-exercise',
            prompt: 'Faça o teste rápido: Você está liderando ou apenas gerenciando?',
            context: 'Peter Drucker: "Gestão é fazer certo as coisas. Liderança é fazer as coisas certas." A maioria dos gestores dedica 80% do tempo gerenciando e 20% liderando — quando deveria ser o oposto.',
            fields: [
              { id: 'time-split', label: 'Quanto do seu dia é planilhas vs. conversas com pessoas?', placeholder: 'Ex: 70% planilhas, 30% pessoas' },
              { id: 'why-test', label: 'Sua equipe sabe POR QUÊ faz o que faz?', placeholder: 'Pergunte a 3 pessoas da equipe. O que elas diriam?', multiline: true },
              { id: 'absence-test', label: 'Se você saísse por 30 dias, a equipe continuaria funcionando?', placeholder: 'Quais decisões parariam? O que continuaria rodando?', multiline: true },
            ],
            evaluationCriteria: ['Autoavaliação honesta do equilíbrio liderança vs gestão', 'Identifica gaps concretos na liderança', 'Propõe pelo menos uma mudança prática'],
            expectedConcepts: ['liderança', 'gestão', 'autonomia', 'propósito'],
          },
          {
            id: 'M3-1-t2',
            type: 'text',
            title: 'As 5 Teorias de Liderança que Você Precisa Conhecer',
            body: 'A teoria de liderança evoluiu em ondas. Cada uma responde a uma pergunta diferente:\n\n**1. Teoria dos Traços (anos 1900–1940)**\nPergunta: "Líderes nascem prontos?"\nIdeia: Liderança é inata — carisma, inteligência, determinação são características de nascença.\nLimitação: Não explica por que pessoas sem esses traços lideram bem, nem por que pessoas com esses traços falham.\nUso prático: Ajuda a identificar potenciais, mas não deve ser usada para excluir candidatos.\n\n**2. Teoria Comportamental (anos 1940–1960)**\nPergunta: "Liderança pode ser aprendida?"\nIdeia: O que importa não é quem o líder É, mas o que ele FAZ. Dois eixos fundamentais:\n— Orientação para Tarefa: foco em metas, prazos, processos, resultados\n— Orientação para Pessoas: foco em relacionamento, desenvolvimento, bem-estar\nGrid Gerencial (Blake & Mouton): cruza os dois eixos numa matriz 9×9\n— (1,1) Gestão empobrecida — mínimo esforço\n— (9,1) Gestão autoritária — resultados a qualquer custo\n— (1,9) Gestão "country club" — todos felizes, ninguém entrega\n— (9,9) Gestão de equipe — alta performance + alto cuidado com pessoas\nUso prático: Diagnóstico do estilo atual. Onde você está no grid?\n\n**3. Liderança Situacional (Hersey & Blanchard, 1969)**\nPergunta: "Existe um estilo ideal para todas as situações?"\nIdeia: NÃO. O melhor estilo depende da maturidade do liderado.\n\n4 Estilos × 4 Maturidades:\n— S1 Direcionar → para quem tem baixa competência e baixo comprometimento\n— S2 Orientar → para quem tem alguma competência mas ainda inseguro\n— S3 Apoiar → para quem é competente mas desmotivado ou inseguro\n— S4 Delegar → para quem é competente E comprometido\n\nErro fatal: usar S1 (direcionar) com profissionais sêniores → mata a motivação. Usar S4 (delegar) com juniores → gera abandono.\nUso prático: Para cada membro da sua equipe, pergunte: qual a competência E o comprometimento desta pessoa NESTA tarefa específica? Adapte o estilo.\n\n**4. Liderança Transformacional (Burns, 1978 / Bass, 1985)**\nPergunta: "Como líderes geram mudanças profundas?"\nIdeia: Líderes transformacionais elevam as aspirações dos liderados acima dos interesses individuais.\n4 componentes (os "4 Is"):\n— Influência Idealizada: líder como modelo — comportamento coerente com o discurso\n— Motivação Inspiracional: comunicar visão de futuro que gera significado\n— Estimulação Intelectual: desafiar suposições, encorajar criatividade\n— Consideração Individualizada: tratar cada pessoa como única, desenvolver potencial\nUso prático: O líder transformacional não diz "faça porque eu mando". Diz "faça porque isso importa — e eu faço junto."\n\n**5. Liderança Servidora (Robert Greenleaf, 1970)**\nPergunta: "E se o líder existisse para servir a equipe, e não o contrário?"\nIdeia: O líder existe para remover obstáculos, desenvolver pessoas e criar condições para que a equipe performe.\nPrincípios: escuta ativa, empatia, cura, consciência, persuasão (não coerção), visão de longo prazo, crescimento das pessoas.\nUso prático: Pergunte: "O que posso fazer para que você trabalhe melhor?" em vez de "Por que você não entregou?"',
          },
          {
            id: 'M3-lid-compare1',
            type: 'compare',
            title: '5 Teorias de Liderança — Quando Usar Cada Uma',
            question: 'Qual teoria de liderança é mais útil para qual situação?',
            dimensions: ['Pergunta central', 'Foco', 'Quando usar', 'Limitação'],
            items: [
              { id: 'traits', label: 'Teoria dos Traços', values: ['Líderes nascem prontos?', 'Quem o líder É (carisma, inteligência)', 'Identificar potenciais de liderança', 'Não explica líderes sem traços clássicos'], highlight: 'Útil para seleção, mas nunca para excluir.' },
              { id: 'behavioral', label: 'Comportamental', values: ['Liderança pode ser aprendida?', 'O que o líder FAZ (tarefa vs pessoas)', 'Diagnóstico de estilo atual (Grid 9×9)', 'Ignora o contexto situacional'], highlight: 'Busque o (9,9): alta performance + alto cuidado.' },
              { id: 'situational', label: 'Situacional', values: ['Existe UM estilo ideal?', 'Maturidade do liderado (competência + comprometimento)', 'Adaptar estilo a cada pessoa/tarefa', 'Exige leitura precisa da maturidade'], highlight: 'O estilo CERTO depende da PESSOA, não do líder.' },
              { id: 'transformational', label: 'Transformacional', values: ['Como gerar mudanças profundas?', '4 Is: Influência, Inspiração, Intelectual, Individual', 'Mudança cultural, visão de longo prazo', 'Pode criar dependência do líder carismático'], highlight: '"Faça porque isso importa — e eu faço junto."' },
              { id: 'servant', label: 'Servidora', values: ['E se o líder servisse a equipe?', 'Remover obstáculos, desenvolver pessoas', 'Equipes maduras, cultura de confiança', 'Pode ser vista como fraqueza em culturas hierárquicas'], highlight: '"O que posso fazer para você trabalhar melhor?"' },
            ],
            insight: 'Não existe UMA teoria certa. Líderes eficazes combinam elementos de todas — adaptando o estilo à pessoa, à situação e ao momento da organização.',
          },
          {
            id: 'M3-1-s1',
            type: 'simulation',
            title: 'Qual é o Seu Estilo de Liderança?',
            simulationId: 'leadership-style',
            description: 'Responda 12 cenários reais de gestão e descubra seu perfil dominante: Diretivo, Orientador, Apoiador ou Delegador. Receba análise dos pontos fortes e gaps.',
          },
          {
            id: 'M3-1-t3',
            type: 'text',
            title: 'Inteligência Emocional — A Competência #1 da Liderança',
            body: 'Daniel Goleman demonstrou que a inteligência emocional (IE) responde por 67% das competências necessárias para performance superior em liderança — o dobro da inteligência cognitiva e expertise técnica combinadas.\n\n**Os 5 Componentes da IE na Liderança:**\n\n**1. Autoconsciência**\nO que é: Reconhecer suas próprias emoções, forças, fraquezas e seu impacto nos outros.\nNa prática:\n— Líder autoconsciente: "Eu sei que fico impaciente em reuniões longas. Vou pedir para o João facilitar esta."\n— Líder sem autoconsciência: "Essa reunião é uma perda de tempo!" (desmotiva toda a equipe)\nComo desenvolver: Diário de reflexão — 5 minutos no final do dia: "O que senti? O que causou? Como reagi? O que faria diferente?"\n\n**2. Autorregulação**\nO que é: Controlar impulsos e emoções disruptivas. Pensar antes de agir.\nNa prática:\n— Líder autorregulado: recebe crítica → respira → pergunta "me explica melhor"\n— Líder desregulado: recebe crítica → reage defensivamente → equipe nunca mais traz feedback\nComo desenvolver: Regra dos 6 segundos — entre o estímulo e a resposta, conte até 6. Esse intervalo ativa o córtex pré-frontal (razão) sobre a amígdala (reação).\n\n**3. Motivação Intrínseca**\nO que é: Busca por excelência por satisfação interna, não por recompensa externa.\nNa prática: Líderes motivados intrinsecamente são otimistas diante de fracassos, comprometidos com metas de longo prazo e energizados por desafios.\nComo desenvolver: Conecte cada tarefa a um propósito maior. "Não estamos preenchendo planilhas — estamos garantindo que 500 famílias recebam seu pedido no prazo."\n\n**4. Empatia**\nO que é: Capacidade de compreender as emoções e perspectivas dos outros.\nNa prática:\n— Líder empático: "Percebi que você está sobrecarregado. Vamos reorganizar as prioridades juntos."\n— Líder sem empatia: "Todo mundo tem muito trabalho. Dá um jeito."\nComo desenvolver: Em cada 1:1, comece com "Como você está?" e escute a resposta de verdade.\n\n**5. Habilidades Sociais**\nO que é: Gestão de relacionamentos — influenciar, inspirar, desenvolver, resolver conflitos.\nNa prática: Construir redes, facilitar cooperação, negociar, comunicar com clareza.\nComo desenvolver: Pratique dar feedback com o modelo SBI: Situação → Comportamento → Impacto.\n\n**O ROI da Inteligência Emocional:**\n— Equipes com líderes de alta IE têm 20% mais engajamento (Gallup)\n— Líderes emocionalmente inteligentes retêm talentos 4x mais (CCL)\n— Empresas com liderança de alta IE superam pares em 20% no lucro (Hay Group)',
          },
          {
            id: 'M3-lid-concept2',
            type: 'concept',
            term: 'Inteligência Emocional (IE)',
            definition: 'Capacidade de reconhecer, compreender e gerenciar suas próprias emoções e as dos outros. Responde por 67% das competências de liderança superior — o dobro de QI + expertise técnica combinados.',
            example: 'Líder autorregulado recebe crítica → respira → pergunta "me explica melhor". Ativa o córtex pré-frontal (razão) sobre a amígdala (reação). Resultado: equipe continua trazendo feedback.',
            antiExample: 'Líder desregulado recebe crítica → reage defensivamente → equipe nunca mais traz feedback. Resultado: problemas ficam invisíveis até explodir.',
          },
          {
            id: 'M3-lid-framework1',
            type: 'framework',
            frameworkId: 'ie-diagnostic',
            title: 'Autodiagnóstico — 5 Componentes da Inteligência Emocional',
            description: 'Avalie-se em cada componente da IE de Goleman. Seja brutalmente honesto — este diagnóstico é para você, não para mostrar a ninguém.',
            fields: [
              { id: 'autoconsciencia', label: 'Autoconsciência: Você reconhece suas emoções e seu impacto nos outros?', placeholder: 'De 1 a 10, onde está? Dê um exemplo recente.', helpText: 'Teste: Você consegue nomear a emoção que está sentindo AGORA? Se não, há espaço para crescer.' },
              { id: 'autorregulacao', label: 'Autorregulação: Você controla impulsos antes de reagir?', placeholder: 'Na última vez que recebeu uma crítica, como reagiu?', helpText: 'Regra dos 6 segundos: entre o estímulo e a resposta, conte até 6.' },
              { id: 'motivacao', label: 'Motivação Intrínseca: Você busca excelência por satisfação interna?', placeholder: 'O que te move: bônus e promoção, ou crescimento e impacto?', helpText: 'Se só trabalha bem quando há recompensa externa, a motivação é frágil.' },
              { id: 'empatia', label: 'Empatia: Você compreende emoções e perspectivas dos outros?', placeholder: 'Na última 1:1, você realmente ouviu — ou estava esperando sua vez de falar?', helpText: 'Empatia não é concordar. É compreender antes de responder.' },
              { id: 'hab-sociais', label: 'Habilidades Sociais: Você influencia, inspira e resolve conflitos?', placeholder: 'Quando foi a última vez que mediou um conflito com sucesso? Como?', helpText: 'Modelo SBI para feedback: Situação → Comportamento → Impacto.' },
            ],
          },
          {
            id: 'M3-1-t4',
            type: 'text',
            title: 'Formação de Equipes — Do Grupo ao Time de Alta Performance',
            body: 'Um grupo de pessoas trabalhando juntas NÃO é uma equipe. Equipe exige interdependência, objetivo compartilhado e responsabilidade mútua.\n\n**Modelo de Tuckman — As 5 Fases de Desenvolvimento de Equipes:**\n\n**1. Forming (Formação)**\nO que acontece: Pessoas se conhecem, são educadas, evitam conflito. Dependência do líder é alta.\nO líder deve: Direcionar com clareza — definir propósito, papéis, regras do jogo.\nErro: Assumir que "estamos todos alinhados" só porque ninguém discordou.\n\n**2. Storming (Conflito)**\nO que acontece: Diferenças aparecem. Disputas por influência, estilo, prioridades. Tensão é natural e NECESSÁRIA.\nO líder deve: Mediar conflitos, não evitá-los. Normalizar o desconforto: "Discordância é sinal de que estamos pensando."\nErro fatal: Suprimir o conflito → vira conflito subterrâneo (fofoca, sabotagem passiva, desengajamento).\n\n**3. Norming (Normatização)**\nO que acontece: Regras implícitas se formam. Confiança cresce. Papéis ficam claros.\nO líder deve: Facilitar acordos sobre como trabalhar juntos. Reforçar comportamentos positivos.\nErro: Não formalizar os acordos — "a gente se entende" até que não se entende mais.\n\n**4. Performing (Performance)**\nO que acontece: A equipe opera com autonomia, resolve problemas sozinha, entrega consistentemente.\nO líder deve: Delegar e remover obstáculos. Sair do caminho.\nErro: Microgerenciar uma equipe madura → destrói confiança e autonomia.\n\n**5. Adjourning (Dissolução)**\nO que acontece: Projeto termina, equipe se dispersa.\nO líder deve: Celebrar conquistas, fazer retrospectiva, reconhecer contribuições individuais.\nErro: Ignorar o encerramento → pessoas saem sem closure, levam ressentimentos.\n\n**Diagnóstico rápido — Em qual fase sua equipe está?**\n— As pessoas evitam discordar abertamente? → Forming\n— Existem tensões recorrentes entre membros? → Storming\n— A equipe tem acordos claros sobre como trabalhar? → Norming\n— A equipe resolve problemas sem precisar do líder? → Performing\n\nA maioria das equipes fica presa entre Storming e Norming porque líderes evitam o conflito saudável.',
          },
          {
            id: 'M3-1-s2',
            type: 'simulation',
            title: 'Diagnóstico Tuckman — Em Qual Fase Está Sua Equipe?',
            simulationId: 'tuckman-diagnostic',
            description: 'Responda 10 perguntas sobre o comportamento da sua equipe e descubra em qual fase de Tuckman ela está. Receba ações específicas para avançar para a próxima fase.',
          },
          {
            id: 'M3-1-t5',
            type: 'text',
            title: 'Feedback — A Ferramenta Mais Poderosa (e Mal Usada) da Gestão',
            body: 'Feedback não é "bronca educada". Feedback é informação sobre desempenho com o objetivo de gerar mudança. A maioria dos gestores evita dar feedback por medo de conflito. O resultado: problemas crescem silenciosamente até explodir.\n\n**O Modelo SBI — Situação, Comportamento, Impacto:**\n\nEstrutura simples e eficaz desenvolvida pelo Center for Creative Leadership:\n\n— Situação: "Na reunião de ontem com o cliente..."\n— Comportamento: "...você interrompeu a apresentação da Maria três vezes..."\n— Impacto: "...e o cliente ficou confuso sobre quem era o responsável pelo projeto."\n\n**Por que funciona:**\n— Separa o comportamento da identidade da pessoa (não é "você é rude", é "você interrompeu")\n— Dá um exemplo concreto e verificável\n— Mostra a consequência real (não é opinião, é impacto observável)\n\n**Feedback Positivo — Tão Importante Quanto o Corretivo:**\nA proporção ideal (Losada & Heaphy, 2004): 3 feedbacks positivos para cada 1 corretivo.\n— Abaixo de 3:1 → equipe desmotivada, defensiva\n— Acima de 6:1 → feedback perde credibilidade ("ele elogia tudo")\n\nExemplo de feedback positivo com SBI:\n— Situação: "No projeto X que entregamos semana passada..."\n— Comportamento: "...você tomou a iniciativa de resolver o bug de integração sozinho sem esperar o sprint planning..."\n— Impacto: "...e isso nos economizou 3 dias e impressionou o cliente."\n\n**Feedback 360° — Como Implementar:**\n1. Defina 5-8 competências-chave da empresa\n2. Cada pessoa é avaliada por: gestor + pares + subordinados + autoavaliação\n3. Use escala simples (1-5) + 1 pergunta aberta por competência\n4. Resultado é confidencial e compartilhado apenas com o avaliado + gestor\n5. Gera PDI (Plano de Desenvolvimento Individual) com 2-3 ações concretas\n\n**Erros fatais no feedback:**\n— Feedback só na avaliação anual → tarde demais para mudar\n— Feedback vago: "Precisa melhorar" → melhorar o quê? como?\n— Feedback em público: humilha → gera ressentimento\n— Feedback sanduíche (elogio-crítica-elogio): todo mundo percebe → perde credibilidade\n— Feedback sem follow-up: deu feedback e esqueceu → a pessoa conclui que não era importante',
          },
          {
            id: 'M3-lid-decision1',
            type: 'decision',
            scenario: 'Você é gerente de uma equipe de 8 pessoas. Um membro sênior entregou um projeto com qualidade abaixo do esperado. O cliente reclamou. Você precisa dar feedback, mas esse membro é sensível a críticas e já ameaçou pedir demissão antes.',
            options: [
              { label: 'Dar feedback direto usando modelo SBI', tradeoffs: { upside: 'Transparência, clareza, chance de melhoria real', downside: 'Risco de reação emocional negativa', risk: 'medium' as const } },
              { label: 'Elogiar primeiro, depois mencionar a melhoria (sanduíche)', tradeoffs: { upside: 'Suaviza o impacto emocional', downside: 'Feedback sanduíche perde credibilidade — a pessoa sabe que vem crítica', risk: 'medium' as const } },
              { label: 'Não dar feedback individual — abordar "em geral" na reunião de equipe', tradeoffs: { upside: 'Evita confronto direto', downside: 'Mensagem diluída, equipe inteira se sente criticada injustamente', risk: 'high' as const } },
              { label: 'Esperar a próxima entrega e ver se melhora sozinho', tradeoffs: { upside: 'Evita conflito imediato', downside: 'Problema cresce silenciosamente, cliente pode cancelar', risk: 'high' as const } },
            ],
            realWorldAnalog: 'O modelo SBI (Center for Creative Leadership) é usado por Google, Netflix e Nubank. Separar comportamento de identidade ("você interrompeu" vs "você é rude") muda completamente a receptividade.',
            lesson: 'Feedback adiado é feedback multiplicado em dificuldade. A proporção ideal é 3:1 (3 positivos : 1 corretivo). Se você só dá feedback corretivo, a conta já está negativa.',
          },
          {
            id: 'M3-1-t6',
            type: 'text',
            title: 'Delegação — Por que Líderes Não Delegam (e o Custo Disso)',
            body: 'A incapacidade de delegar é o principal gargalo de crescimento de gestores e empresas. Se o líder precisa aprovar tudo, a velocidade da empresa = velocidade do líder.\n\n**Os 5 Níveis de Delegação:**\n\n**Nível 1 — "Faça o que eu disser"**\nO líder decide tudo. O liderado executa.\nQuando usar: Emergências, tarefas críticas com pessoa inexperiente.\nRisco: Cria dependência. Ninguém aprende.\n\n**Nível 2 — "Pesquise e me traga opções"**\nO liderado investiga. O líder decide.\nQuando usar: Pessoa em desenvolvimento que precisa aprender a pensar.\n\n**Nível 3 — "Recomende uma ação e eu aprovo"**\nO liderado propõe. O líder valida.\nQuando usar: Pessoa competente que ainda precisa de coaching.\n\n**Nível 4 — "Decida e me informe"**\nO liderado decide e comunica depois.\nQuando usar: Pessoa experiente em área conhecida.\n\n**Nível 5 — "Decida. Não precisa me contar."**\nAutonomia total.\nQuando usar: Pessoa sênior, confiança alta, área de especialidade.\n\n**A Matriz de Delegação — O que Delegar e O que Manter:**\n\nDelegar AGORA:\n— Tarefas operacionais que outra pessoa pode fazer com 80% da sua qualidade\n— Decisões reversíveis (se errar, corrige rápido)\n— Tarefas que desenvolvem a equipe\n\nNunca delegar:\n— Visão estratégica e direção\n— Feedback e desenvolvimento de pessoas\n— Decisões irreversíveis de alto impacto\n— Gestão de crise ativa\n\n**Por que líderes não delegam (e as desculpas reais):**\n— "Ninguém faz tão bem quanto eu" → Ego. E mesmo que fosse verdade, seu tempo vale mais em atividades estratégicas.\n— "É mais rápido eu fazer" → Verdade no curto prazo. Mentira no longo prazo. Cada vez que você faz, você ensina a equipe a depender de você.\n— "Se der errado, a culpa é minha" → Sim. E continua sendo sua culpa quando delega. A diferença é que delegando você multiplica capacidade.\n\n**Custo de não delegar:**\n— Líder sobrecarregado = decisões ruins por fadiga\n— Equipe infantilizada = zero iniciativa\n— Empresa limitada = cresce até o teto do líder e para',
          },
          {
            id: 'M3-1-t7',
            type: 'text',
            title: 'Gestão de Conflitos — Transformar Tensão em Resultado',
            body: 'Conflito não é problema. Conflito mal gerenciado é problema. Equipes sem conflito estão em estágio Forming (não se conhecem o suficiente para discordar) ou numa cultura de medo.\n\n**Modelo Thomas-Kilmann — 5 Estilos de Gestão de Conflitos:**\n\nCada estilo combina dois eixos: Assertividade (defender seus interesses) × Cooperação (considerar interesses do outro).\n\n**1. Competir (alta assertividade, baixa cooperação)**\n"Eu ganho, você perde."\nQuando usar: Emergências que exigem decisão rápida. Questões éticas inegociáveis.\nRisco: Destrói relacionamentos se usado frequentemente.\n\n**2. Acomodar (baixa assertividade, alta cooperação)**\n"Você ganha, eu cedo."\nQuando usar: Quando o assunto importa mais para o outro, ou para preservar uma relação crítica.\nRisco: Acumula ressentimento. Você para de ser ouvido.\n\n**3. Evitar (baixa assertividade, baixa cooperação)**\n"Ninguém lida com isso agora."\nQuando usar: Quando o timing é ruim ou a questão é trivial.\nRisco: Conflitos evitados crescem. O que era pequeno vira crise.\n\n**4. Comprometer (assertividade média, cooperação média)**\n"Cada um cede um pouco."\nQuando usar: Quando precisa de solução rápida e os dois lados têm poder similar.\nRisco: Ninguém fica satisfeito. Solução medíocre.\n\n**5. Colaborar (alta assertividade, alta cooperação)**\n"Vamos encontrar uma solução que atenda os dois."\nQuando usar: Quando a questão é importante e o relacionamento também.\nRisco: Consome mais tempo. Exige maturidade dos envolvidos.\n\n**Protocolo Prático para Mediar Conflitos na Equipe:**\n\n1. Separe as pessoas do problema\n— "Não estamos discutindo quem está certo. Estamos resolvendo como entregar o projeto."\n\n2. Ouça os dois lados sem interromper\n— Cada pessoa tem 3 minutos para explicar sua perspectiva. O outro escuta.\n\n3. Identifique interesses, não posições\n— Posição: "Eu quero mais prazo." Interesse: "Eu tenho medo de entregar com baixa qualidade."\n\n4. Gere opções antes de decidir\n— Brainstorm de 3+ alternativas antes de escolher.\n\n5. Acordo com critérios objetivos\n— "Vamos usar os dados de vendas do último trimestre para decidir, não a opinião de ninguém."\n\n6. Follow-up em 7 dias\n— Conflito resolvido sem follow-up = conflito adiado.',
          },
          {
            id: 'M3-1-s3',
            type: 'simulation',
            title: 'Gestão de Conflitos — Escolha a Abordagem Certa',
            simulationId: 'conflict-management',
            description: 'Receba 6 cenários reais de conflito em equipe. Para cada um, escolha o estilo Thomas-Kilmann mais adequado (Competir, Acomodar, Evitar, Comprometer ou Colaborar) e veja a análise.',
          },
          {
            id: 'M3-1-t8',
            type: 'text',
            title: 'Motivação — O que a Ciência Diz sobre Engajar Pessoas',
            body: 'A maioria dos gestores usa motivação errada: mais dinheiro, mais pressão, mais controle. A ciência mostra o oposto.\n\n**Teoria da Autodeterminação (Deci & Ryan)**\nAs 3 necessidades psicológicas universais para motivação intrínseca:\n\n**1. Autonomia** — a necessidade de sentir que você tem escolha\nNa prática:\n— Dê o "o quê" e o "por quê", mas deixe a pessoa decidir o "como"\n— Horário flexível, método de trabalho flexível, escolha de projetos\n— Anti-autonomia: microgerenciamento, aprovações para tudo, scripts rígidos\n\n**2. Competência** — a necessidade de sentir que você é capaz e está evoluindo\nNa prática:\n— Desafios calibrados: nem fácil demais (tédio) nem difícil demais (ansiedade)\n— Feedback frequente e específico (SBI)\n— Oportunidades de aprendizado e crescimento\n— Anti-competência: tarefas repetitivas sem variação, zero feedback, zero desenvolvimento\n\n**3. Pertencimento** — a necessidade de sentir que você importa para o grupo\nNa prática:\n— Reconhecimento público de contribuições\n— Rituais de equipe (daily, retrospectiva, celebrações)\n— Cultura de confiança onde vulnerabilidade é segura\n— Anti-pertencimento: favorecidos, panelinha, exclusão de decisões\n\n**Motivação Intrínseca vs. Extrínseca:**\n— Extrínseca (bônus, promoção, medo de demissão): funciona para tarefas simples e repetitivas. Para trabalho criativo e complexo, PREJUDICA a performance.\n— Intrínseca (propósito, domínio, autonomia): funciona para trabalho que exige pensamento, criatividade e julgamento. É sustentável a longo prazo.\n\nDaniel Pink (Drive, 2009) sintetiza: para trabalho do século XXI, os 3 motores são Autonomia, Maestria e Propósito — não cenoura e chicote.\n\n**Framework Prático de Motivação para Gestores:**\n1. Conecte cada tarefa a um propósito claro ("por que isso importa?")\n2. Dê autonomia no método (foque no resultado, não no processo)\n3. Calibre o desafio (pergunte: "isso está fácil demais ou difícil demais?")\n4. Reconheça publicamente, corrija em particular\n5. Invista em desenvolvimento (treinamento, mentoria, projetos desafiadores)\n6. Crie segurança psicológica (é seguro errar e pedir ajuda?)',
          },
          {
            id: 'M3-lid-concept3',
            type: 'concept',
            term: 'Teoria da Autodeterminação',
            definition: 'As 3 necessidades psicológicas universais para motivação intrínseca são: Autonomia (escolha), Competência (evolução) e Pertencimento (importar para o grupo). Satisfazer as três gera engajamento sustentável.',
            example: 'Nubank dá autonomia de método (squads decidem como entregar), competência (hackathons, budget de aprendizado) e pertencimento (cultura horizontal, rituais de time). Turnover 3x menor que bancos tradicionais.',
            antiExample: 'Microgerenciar o "como" (mata autonomia), dar tarefas repetitivas sem variação (mata competência) e excluir pessoas de decisões (mata pertencimento) = desengajamento garantido.',
          },
          {
            id: 'M3-1-t9',
            type: 'text',
            title: 'Reuniões 1:1 — A Ferramenta de Gestão Mais Subutilizada',
            body: 'O 1:1 (one-on-one) é a reunião mais importante da gestão de pessoas. É o momento em que o líder dá atenção individual, alinha expectativas, remove bloqueios e desenvolve o liderado.\n\n**Estrutura de um 1:1 Eficaz (30 min, semanal ou quinzenal):**\n\n**Primeiros 10 min — Agenda do Liderado**\n— "O que você quer discutir hoje?"\n— A pauta é DELE, não sua. Isso é autonomia na prática.\n— Se ele não trouxer pauta, pergunte: "O que te preocupa? Onde está travado? O que precisa de mim?"\n\n**10 min seguintes — Agenda do Líder**\n— Feedback (SBI) sobre situações recentes\n— Alinhamento de prioridades da semana\n— Checagem de desenvolvimento: "O que aprendeu? Onde quer crescer?"\n\n**Últimos 10 min — Acordos e Próximos Passos**\n— O que ficou decidido?\n— Quem faz o quê até quando?\n— Anote e siga no próximo 1:1\n\n**Erros que destroem o 1:1:**\n— Cancelar frequentemente → mensagem: "você não é prioridade"\n— Usar como reunião de status → para isso existem dailies e reports\n— Falar mais do que ouvir → proporção ideal: 70% liderado, 30% líder\n— Não anotar e não dar follow-up → perde credibilidade\n\n**Perguntas poderosas para 1:1:**\n— "Se você fosse eu, o que mudaria na equipe?"\n— "O que te faz perder energia no trabalho?"\n— "Qual é a coisa mais importante que eu posso fazer por você esta semana?"\n— "Onde você quer estar profissionalmente em 2 anos?"\n— "Tem algo que você não está me contando porque acha que eu não quero ouvir?"',
          },
          {
            id: 'M3-1-t10',
            type: 'text',
            title: 'Segurança Psicológica — O Segredo das Equipes do Google',
            body: 'O Projeto Aristóteles do Google analisou 180 equipes para descobrir o que diferencia as de alta performance. A resposta não foi QI, não foi talento, não foi experiência. Foi segurança psicológica.\n\n**O que é Segurança Psicológica (Amy Edmondson, Harvard):**\nA crença compartilhada de que é seguro tomar riscos interpessoais no grupo. Ou seja: posso discordar, admitir erro, pedir ajuda e propor ideias sem medo de punição ou humilhação.\n\n**O que o Google descobriu — Os 5 fatores de equipes de alta performance:**\n1. Segurança psicológica (disparadamente o mais importante)\n2. Confiabilidade (a equipe entrega o que promete)\n3. Estrutura e clareza (papéis e metas são claros)\n4. Significado (o trabalho é pessoalmente importante)\n5. Impacto (o trabalho faz diferença)\n\n**Na prática — Sinais de BAIXA segurança psicológica:**\n— Ninguém faz perguntas "óbvias" por medo de parecer incompetente\n— Erros são escondidos em vez de discutidos abertamente\n— As mesmas 2-3 pessoas falam em todas as reuniões\n— Feedback só acontece de cima para baixo, nunca de baixo para cima\n— Inovação é zero: ninguém arrisca porque "e se der errado?"\n\n**Sinais de ALTA segurança psicológica:**\n— Pessoas admitem erros abertamente: "errei aqui, e aprendi que..."\n— Todos participam das discussões, não só os seniores\n— Perguntas "ingênuas" são bem-vindas e frequentes\n— Críticas ao processo são normais e geram ação\n— O líder diz "não sei" e pede ajuda\n\n**7 Ações do Líder para Construir Segurança Psicológica:**\n1. Admita seus próprios erros primeiro e publicamente\n2. Faça perguntas em vez de dar respostas — "O que vocês acham?"\n3. Agradeça quem traz más notícias — "Obrigado por levantar isso"\n4. Responda a erros com curiosidade, não punição — "O que podemos aprender?"\n5. Nunca ridicularize uma pergunta ou sugestão\n6. Crie rituais de retrospectiva: "O que funcionou? O que não funcionou? O que mudamos?"\n7. Meça: "Numa escala de 1-5, quão seguro você se sente para discordar do líder nesta equipe?"',
          },
          {
            id: 'M3-1-s4',
            type: 'simulation',
            title: 'Diagnóstico de Liderança e Equipe — Avaliação 360°',
            simulationId: 'leadership-360',
            description: 'Avalie sua liderança e sua equipe em 8 dimensões: estilo de liderança, IE, delegação, feedback, conflitos, motivação, segurança psicológica e maturidade da equipe. Receba um radar completo com recomendações.',
          },
          {
            id: 'M3-1-t11',
            type: 'text',
            title: 'Mapa de Frameworks — Quando Usar Cada Ferramenta de Liderança',
            body: '**Resumo prático — qual ferramenta usar em cada situação:**\n\n**Liderança Situacional** (Hersey & Blanchard)\nQuando: Precisa adaptar seu estilo a diferentes pessoas e situações\nComo: Avalie competência + comprometimento do liderado → escolha o estilo (S1-S4)\nFrequência: Toda interação de gestão\n\n**Liderança Transformacional** (Burns/Bass)\nQuando: Precisa gerar mudança cultural ou engajar equipe em visão de longo prazo\nComo: Comunique propósito, seja modelo, desafie o status quo, desenvolva individualmente\nFrequência: Estratégia, momentos de mudança, onboarding\n\n**Grid Gerencial** (Blake & Mouton)\nQuando: Quer diagnosticar seu equilíbrio entre foco em tarefa e foco em pessoas\nComo: Autoavaliação nos dois eixos (1-9). Busque o (9,9)\nFrequência: Autoavaliação trimestral\n\n**Modelo Tuckman** (Forming→Performing)\nQuando: Equipe nova, reorganizada, ou com problemas de dinâmica\nComo: Identifique a fase atual → aplique as ações correspondentes\nFrequência: Ao formar equipe e sempre que houver mudança de membros\n\n**Thomas-Kilmann** (Gestão de Conflitos)\nQuando: Conflito entre membros da equipe ou entre áreas\nComo: Avalie importância do resultado × importância do relacionamento → escolha estilo\nFrequência: Sempre que surgir tensão\n\n**Modelo SBI** (Feedback)\nQuando: Precisa dar feedback construtivo ou positivo\nComo: Situação → Comportamento → Impacto\nFrequência: Semanal (mínimo quinzenal)\n\n**Autodeterminação** (Deci & Ryan)\nQuando: Equipe desmotivada ou com baixo engajamento\nComo: Diagnostique qual das 3 necessidades está insatisfeita (autonomia, competência, pertencimento)\nFrequência: Monitoramento contínuo\n\n**Segurança Psicológica** (Edmondson)\nQuando: Equipe não inova, não traz problemas, não discorda\nComo: 7 ações do líder + medição trimestral\nFrequência: Cultura permanente — não é projeto, é prática diária',
          },
        ],
      },
    ],
  },
  {
    moduleId: 'M4',
    topics: [
      {
        id: 'M4-0',
        title: 'Filosofia',
        blocks: [
          {
            id: 'M4-0-t1',
            type: 'text',
            title: 'Por que Filosofia em um Curso de Negócios?',
            body: 'Filosofia não é abstração inútil. É a disciplina que treina o pensamento rigoroso — a capacidade de questionar suposições, construir argumentos e tomar decisões sob incerteza. Todo modelo de negócio, toda estratégia, toda decisão ética parte de premissas filosóficas, mesmo quando não são explicitadas.\n\n**O que a filosofia treina:**\n— Pensamento crítico: separar opinião de argumento fundamentado\n— Lógica: identificar falácias, construir raciocínios válidos\n— Ética: decidir o que é certo quando não há resposta óbvia\n— Epistemologia: "como sei que sei?" — base para decisões baseadas em evidências\n\n**Na prática empresarial:**\n— "Nosso cliente quer isso" → Como você sabe? Qual a evidência? (epistemologia)\n— "É assim que sempre fizemos" → Essa premissa ainda é válida? (pensamento crítico)\n— "O concorrente fez, então devemos fazer" → Falácia do apelo à autoridade (lógica)\n— "Vamos demitir 500 pessoas para aumentar a margem" → É justo? Para quem? (ética)\n\nSócrates resumiu: "Uma vida não examinada não vale a pena ser vivida." Para negócios: uma estratégia não examinada não vale a pena ser executada.\n\n**Cases brasileiros onde filosofia fez falta:**\n— Americanas (2023): rombo de R$ 25 bilhões. A pergunta ética "é certo inflar resultados para manter o preço da ação?" nunca foi feita — ou foi ignorada. Lógica: se ninguém questiona as premissas contábeis, o sistema colapsa.\n— JBS: multas bilionárias por corrupção. A decisão de subornar fiscais sanitários parecia "racional" no curto prazo. Teste filosófico de Kant: "aceitaria que toda empresa fizesse isso?" Se sim, o sistema inteiro de inspeção colapsa.\n— Uber e iFood: motoristas sem direitos trabalhistas. Utilitarismo diria "maior bem para mais pessoas" (consumidores felizes). Contratualismo de Rawls diria "se você não soubesse se seria o CEO ou o motorista, aceitaria este modelo?"\n\nFilosofia não dá respostas prontas — dá as perguntas certas. E perguntas certas evitam desastres.',
          },
          {
            id: 'M4-0-t2',
            type: 'text',
            title: 'Pensamento Crítico e Lógica Aplicada a Decisões',
            body: 'Pensamento crítico é a capacidade de avaliar informações de forma objetiva, identificar vieses e construir conclusões fundamentadas. É a competência mais valorizada por CEOs globais (World Economic Forum, 2025).\n\n**Os 5 Passos do Pensamento Crítico:**\n\n1. Identifique a questão real\n— "Estamos vendendo pouco" não é uma questão — é um sintoma. A questão é: por que vendemos pouco? Qual segmento? Desde quando? O que mudou?\n\n2. Colete evidências relevantes\n— Dados, não opiniões. Fatos, não intuição. Se não há dados, assuma que você não sabe.\n\n3. Avalie as evidências\n— A fonte é confiável? A amostra é suficiente? Há viés de confirmação?\n\n4. Considere alternativas\n— Qual é a explicação mais simples (Navalha de Occam)? Existem outras hipóteses?\n\n5. Chegue a uma conclusão provisória\n— Toda conclusão é provisória até que novos dados a confirmem ou refutem.\n\n**As 10 Falácias Lógicas Mais Comuns em Negócios:**\n\n1. **Ad Hominem** — Atacar a pessoa em vez do argumento. "Ele é júnior, não sabe do que fala."\n2. **Apelo à Autoridade** — "O CEO da Apple disse isso, então é verdade."\n3. **Falsa Dicotomia** — "Ou cortamos custos ou falimos." (existem outras opções)\n4. **Correlação ≠ Causalidade** — "Vendas subiram depois da campanha, logo a campanha causou." (pode ser coincidência)\n5. **Viés de Confirmação** — Buscar apenas dados que confirmam o que já acreditamos\n6. **Falácia do Custo Irrecuperável** — "Já investimos R$ 2M, não podemos parar agora." (o investimento passado é irrelevante para a decisão futura)\n7. **Generalização Apressada** — "3 clientes reclamaram, logo o produto é ruim." (e os outros 10.000?)\n8. **Apelo à Tradição** — "Sempre fizemos assim." (e se o contexto mudou?)\n9. **Falsa Causa** — "Depois que troquei o gerente, o faturamento caiu." (post hoc ergo propter hoc)\n10. **Argumento da Ladeira Escorregadia** — "Se permitirmos home office, ninguém mais vai trabalhar." (salto lógico sem evidência)\n\n**Exercício prático:** Na próxima reunião, identifique pelo menos 2 falácias usadas nas discussões. Não precisa apontar publicamente — observe e anote. Esse exercício treina o olhar crítico.',
          },
          {
            id: 'M4-fil-concept1',
            type: 'concept',
            term: 'Pensamento Crítico',
            definition: 'Capacidade de avaliar informações objetivamente, identificar vieses e construir conclusões fundamentadas. É a competência #1 mais valorizada por CEOs globais (WEF, 2025).',
            example: '"Estamos vendendo pouco" não é uma questão — é um sintoma. Pensamento crítico pergunta: vendendo pouco em qual segmento? Desde quando? O que mudou? Quais dados sustentam isso?',
            antiExample: '"O gerente sênior acha que o problema é o preço, então é o preço." Isso é falácia de apelo à autoridade, não análise crítica.',
          },
          {
            id: 'M4-fil-exercise1',
            type: 'inline-exercise',
            prompt: 'Identifique 3 falácias lógicas em decisões reais que você presenciou no trabalho.',
            context: 'As 10 falácias mais comuns: Ad Hominem, Apelo à Autoridade, Falsa Dicotomia, Correlação ≠ Causalidade, Viés de Confirmação, Custo Irrecuperável, Generalização Apressada, Apelo à Tradição, Falsa Causa, Ladeira Escorregadia.',
            fields: [
              { id: 'fallacy1', label: 'Falácia 1: Qual foi a frase ou decisão?', placeholder: 'Ex: "Já investimos R$ 2M nesse projeto, não podemos parar agora"', multiline: true },
              { id: 'fallacy1-name', label: 'Qual falácia é essa?', placeholder: 'Ex: Custo Irrecuperável (investimento passado é irrelevante para decisão futura)' },
              { id: 'fallacy2', label: 'Falácia 2: Qual foi a frase ou decisão?', placeholder: 'Ex: "Sempre fizemos assim e funcionou"', multiline: true },
              { id: 'fallacy2-name', label: 'Qual falácia é essa?', placeholder: 'Ex: Apelo à Tradição (contexto pode ter mudado)' },
              { id: 'fallacy3', label: 'Falácia 3: Qual foi a frase ou decisão?', placeholder: 'Ex: "Depois da campanha, vendas subiram, logo a campanha causou"', multiline: true },
              { id: 'fallacy3-name', label: 'Qual falácia é essa?', placeholder: 'Ex: Falsa Causa / Post hoc ergo propter hoc' },
            ],
            evaluationCriteria: ['Identifica corretamente o nome da falácia', 'Explica por que o raciocínio é inválido', 'Propõe como seria o raciocínio correto'],
            expectedConcepts: ['falácia lógica', 'viés cognitivo', 'pensamento crítico'],
          },
          {
            id: 'M4-0-s1',
            type: 'simulation',
            title: 'Detector de Falácias — Identifique o Erro Lógico',
            simulationId: 'fallacy-detector',
            description: 'Receba 10 frases comuns do mundo corporativo e identifique qual falácia lógica cada uma contém. Desenvolva o olhar crítico para argumentos inválidos.',
          },
          {
            id: 'M4-0-t3',
            type: 'text',
            title: 'Ética Empresarial — Os 4 Frameworks para Decisões Difíceis',
            body: 'Toda decisão empresarial tem dimensão ética, mesmo quando não é óbvia. Demitir, precificar, terceirizar, usar dados — cada ação afeta pessoas.\n\n**Framework 1 — Utilitarismo (Consequencialismo)**\nPergunta: "Qual ação gera o maior bem para o maior número?"\nOrigem: Jeremy Bentham, John Stuart Mill (séc. XVIII-XIX)\nComo aplicar: Some os benefícios e custos para TODOS os afetados. Escolha a ação com saldo positivo máximo.\nExemplo: Fechar fábrica em cidade pequena (200 empregos) para abrir em cidade grande (500 empregos). Utilitarismo puro diria: fecha, porque 500 > 200.\nLimitação: Pode justificar injustiças contra minorias se a maioria se beneficia. Os 200 trabalhadores não são menos humanos que os 500.\n\n**Framework 2 — Deontologia (Ética do Dever)**\nPergunta: "Essa ação respeita regras morais universais, independente do resultado?"\nOrigem: Immanuel Kant (séc. XVIII)\nImperativo Categórico: "Aja apenas segundo uma máxima que você possa querer que se torne lei universal."\nComo aplicar: Se todo mundo fizesse isso, o mundo funcionaria? Se não, é errado.\nExemplo: Mentir para fechar uma venda. Mesmo que gere lucro (consequência boa), mentir não pode ser universalizado — se todos mentissem, o comércio colapsa.\nLimitação: Rígido demais. Às vezes a regra gera resultado pior (ex: "nunca mentir" pode causar dano em situações extremas).\n\n**Framework 3 — Ética das Virtudes**\nPergunta: "Uma pessoa virtuosa faria isso?"\nOrigem: Aristóteles (séc. IV a.C.)\nComo aplicar: Foque no caráter, não na ação isolada. Virtudes: coragem, justiça, temperança, prudência, honestidade, generosidade.\nExemplo: Um gestor descobre fraude de um amigo próximo. A ética das virtudes pergunta: o que uma pessoa justa e corajosa faria? Denunciar, mesmo com custo pessoal.\nLimitação: Subjetivo. Culturas diferentes valorizam virtudes diferentes.\n\n**Framework 4 — Ética do Cuidado**\nPergunta: "Essa decisão considera as relações e responsabilidades com quem é vulnerável?"\nOrigem: Carol Gilligan (1982)\nComo aplicar: Priorize relações e responsabilidades. Quem é mais vulnerável nesta decisão?\nExemplo: Ao terceirizar atendimento, a empresa reduz custos — mas os terceirizados ganham menos e não têm benefícios. A ética do cuidado pergunta: qual é nossa responsabilidade com essas pessoas?\nLimitação: Pode gerar paternalismo. Nem toda decisão pode priorizar relações sobre resultados.\n\n**Na prática — Como usar os 4 frameworks juntos:**\nQuando enfrentar uma decisão ética difícil, passe por todos:\n1. Utilitarismo: Quem se beneficia? Quem é prejudicado? Qual o saldo?\n2. Deontologia: Essa ação pode ser universalizada? Respeita direitos fundamentais?\n3. Virtudes: Uma pessoa que eu admiro faria isso?\n4. Cuidado: Quem é vulnerável nessa situação? Qual minha responsabilidade?\n\nSe os 4 frameworks apontam na mesma direção → decisão clara.\nSe divergem → a tensão é real e merece deliberação profunda.',
          },
          {
            id: 'M4-fil-compare1',
            type: 'compare',
            title: '4 Frameworks Éticos — Mesma Situação, Conclusões Diferentes',
            question: 'Se uma empresa precisa demitir 200 pessoas para não falir (e salvar 800 empregos), o que cada framework diz?',
            dimensions: ['Pergunta central', 'Veredicto sobre a demissão', 'Justificativa', 'Limitação'],
            items: [
              { id: 'util', label: 'Utilitarismo', values: ['Qual ação gera maior bem para mais pessoas?', 'AUTORIZA — 800 salvos > 200 demitidos', 'Saldo positivo: mais pessoas se beneficiam', 'Ignora o sofrimento dos 200. Minoria sacrificada pela maioria.'], highlight: 'Cuidado: pode justificar injustiças contra minorias.' },
              { id: 'deont', label: 'Deontologia (Kant)', values: ['Essa ação respeita regras morais universais?', 'QUESTIONA — demitir pessoas como "meio" para um fim viola a dignidade humana', 'Imperativo: trate pessoas como fins, nunca apenas como meios', 'Rígida demais: às vezes a alternativa (falir) é pior para todos.'], highlight: 'Se universalizar "demitir quando convém", a relação de trabalho perde sentido.' },
              { id: 'virt', label: 'Ética das Virtudes', values: ['Uma pessoa virtuosa faria isso?', 'DEPENDE — se fez o possível antes (cortar custos, renegociar), sim', 'A intenção e o caráter importam. Demitir com dignidade e suporte é virtuoso.', 'Subjetivo: depende de quem define "virtuoso".'], highlight: 'Como demite importa tanto quanto se demite.' },
              { id: 'care', label: 'Ética do Cuidado', values: ['Quem é vulnerável nessa decisão?', 'EXIGE CUIDADO — os 200 demitidos são os mais vulneráveis', 'Responsabilidade especial com quem será mais afetado', 'Pode gerar paternalismo ou paralisia decisória.'], highlight: 'Ofereceu outplacement? Aviso prévio justo? Extensão de plano de saúde?' },
            ],
            insight: 'Quando os 4 frameworks divergem, a tensão é REAL e merece deliberação profunda. Empresas éticas não escolhem 1 framework — passam a decisão por todos e buscam o caminho com menor dano total.',
          },
          {
            id: 'M4-fil-decision1',
            type: 'decision',
            scenario: 'Você é CEO de uma fintech brasileira. Seu algoritmo de crédito usa dados de redes sociais para prever inadimplência — e funciona (reduz default em 18%). Porém, uma análise interna revela que o modelo reprova 2.3x mais pessoas negras e de periferias. O que você faz?',
            options: [
              { label: 'Manter o modelo — os dados são objetivos', tradeoffs: { upside: 'Menor inadimplência, maior margem de lucro', downside: 'Reproduz discriminação sistêmica com verniz tecnológico', risk: 'high' as const } },
              { label: 'Remover variáveis discriminatórias e retreinar o modelo', tradeoffs: { upside: 'Modelo mais justo, alinhado com princípios ESG', downside: 'Pode aumentar inadimplência em 5-8%, reduzindo margem', risk: 'medium' as const } },
              { label: 'Criar modelo híbrido: IA + revisão humana para casos limítrofes', tradeoffs: { upside: 'Equilíbrio entre eficiência e justiça', downside: 'Custo operacional maior, processo mais lento', risk: 'low' as const } },
            ],
            realWorldAnalog: 'O caso COMPAS (EUA) mostrou que algoritmos de justiça criminal classificavam negros como 2.3x mais propensos a reincidir. No Brasil, o Nubank enfrentou críticas por limites de crédito mais baixos para clientes de periferias — e ajustou seus modelos.',
            lesson: 'Dados históricos carregam os vieses da sociedade que os gerou. "O algoritmo decidiu" não é defesa ética — a responsabilidade é de quem constrói e usa o sistema.',
          },
          {
            id: 'M4-0-s2',
            type: 'simulation',
            title: 'Dilemas Éticos Empresariais — Aplique os 4 Frameworks',
            simulationId: 'ethics-dilemmas',
            description: 'Enfrente 5 dilemas éticos reais de empresas. Para cada um, analise sob os 4 frameworks (Utilitarismo, Deontologia, Virtudes, Cuidado) e compare com a decisão que a empresa tomou.',
          },
          {
            id: 'M4-0-t4',
            type: 'text',
            title: 'Epistemologia Empresarial — Como Sabemos o que Sabemos?',
            body: 'Epistemologia é o estudo do conhecimento: o que é verdade? Como posso justificar uma crença? Qual a diferença entre saber e achar?\n\n**Por que importa para negócios:**\nA maioria das decisões empresariais é tomada com base em "achismos" que parecem dados.\n\n— "Nossos clientes querem X" → Você perguntou? Quantos? Como?\n— "O mercado está crescendo" → Baseado em qual fonte? Qual período?\n— "Essa estratégia funciona" → Funciona comparado a quê? Qual o contrafactual?\n\n**Hierarquia de Evidências para Decisões:**\n\nNível 1 (mais forte): Experimento controlado (teste A/B, RCT)\n— Dividimos clientes em dois grupos. Grupo A recebeu desconto, grupo B não. Vendas do grupo A subiram 23%.\n\nNível 2: Dados históricos com análise estatística\n— Analisamos 3 anos de vendas e identificamos correlação entre investimento em marketing e crescimento.\n\nNível 3: Pesquisa qualitativa estruturada\n— Entrevistamos 30 clientes com roteiro semi-estruturado e identificamos 5 padrões.\n\nNível 4: Opinião de especialista\n— O consultor com 20 anos de experiência recomenda.\n\nNível 5 (mais fraco): Intuição / "sempre fizemos assim"\n— "Eu sinto que é por aí."\n\n**Vieses Cognitivos que Distorcem o Conhecimento:**\n\n— Viés de Confirmação: buscamos informações que confirmam o que já acreditamos\n— Efeito Halo: se a pessoa/empresa é boa em uma coisa, assumimos que é boa em tudo\n— Viés de Sobrevivência: estudamos apenas quem teve sucesso, ignorando quem falhou fazendo a mesma coisa\n— Ancoragem: o primeiro número que vemos influencia toda a negociação\n— Efeito Dunning-Kruger: quem sabe pouco superestima seu conhecimento; quem sabe muito subestima\n\n**Regra prática para gestores:**\nAntes de tomar qualquer decisão baseada em "dados":\n1. Qual a fonte? É confiável?\n2. Qual o tamanho da amostra? É representativo?\n3. Existe uma explicação alternativa?\n4. Eu buscaria essa informação se ela contradissesse minha opinião?',
          },
          {
            id: 'M4-0-t5',
            type: 'text',
            title: 'Filosofia Política e Modelos Econômicos — De Smith a Rawls',
            body: 'Todo modelo de negócio opera dentro de um sistema econômico. Todo sistema econômico é baseado em premissas filosóficas sobre a natureza humana, justiça e o papel do Estado.\n\n**Adam Smith (1723–1790) — Liberalismo Econômico**\nIdeia central: O livre mercado, guiado pela "mão invisível", aloca recursos de forma mais eficiente do que qualquer planejamento central.\nPremissa: Indivíduos buscando seu interesse próprio inadvertidamente promovem o bem coletivo.\nLimitação: Smith também escreveu "Teoria dos Sentimentos Morais" — ele sabia que o mercado precisa de ética. O problema é que seus seguidores frequentemente ignoram essa parte.\nPara negócios: Justifica livre concorrência, desregulamentação e meritocracia.\n\n**Karl Marx (1818–1883) — Crítica ao Capitalismo**\nIdeia central: O capitalismo gera alienação (o trabalhador não se reconhece no produto), concentração de riqueza e exploração sistêmica.\nPremissa: A mais-valia (diferença entre o valor que o trabalhador produz e o que recebe) é a base do lucro capitalista.\nLimitação: As alternativas propostas (socialismo, comunismo) geraram sistemas ainda mais concentradores de poder.\nPara negócios: Entender Marx ajuda a diagnosticar tensões trabalhistas, desigualdade salarial e alienação no trabalho — problemas que custam caro em turnover e produtividade.\n\n**John Maynard Keynes (1883–1946) — Intervencionismo**\nIdeia central: O mercado não se autorregula perfeitamente. Em crises, o Estado deve intervir com gastos públicos para estimular a demanda.\nPremissa: Demanda insuficiente é o principal problema econômico, não oferta.\nPara negócios: Explica políticas anticíclicas (crédito subsidiado, incentivos fiscais) que afetam diretamente o ambiente de negócios.\n\n**John Rawls (1921–2002) — Justiça como Equidade**\nIdeia central: O "Véu da Ignorância" — se você não soubesse qual posição ocuparia na sociedade (rico/pobre, homem/mulher, branco/negro), que regras escolheria?\nDois princípios:\n1. Liberdades básicas iguais para todos\n2. Desigualdades são aceitáveis APENAS se beneficiam os menos favorecidos (Princípio da Diferença)\nPara negócios: Base filosófica do ESG e da justiça distributiva. Pergunta: "Esse modelo de negócio beneficia ou prejudica os mais vulneráveis?"\n\n**Aplicação prática para gestores:**\n— Política de salários: Smith diria "pague o mínimo que o mercado aceita". Rawls diria "pague de forma que os menos favorecidos se beneficiem". A maioria das empresas bem-sucedidas opera entre os dois.\n— Precificação: Cobrar o máximo que o mercado suporta (Smith) ou precificar de forma que o produto seja acessível (Rawls)?\n— Modelo de negócio: Maximizar lucro do acionista (Friedman/Smith) ou gerar valor compartilhado (Porter/Rawls)?',
          },
          {
            id: 'M4-fil-concept2',
            type: 'concept',
            term: 'Véu da Ignorância (Rawls)',
            definition: 'Experimento mental: se você não soubesse qual posição ocuparia na sociedade (rico/pobre, homem/mulher, branco/negro), que regras escolheria? As regras justas são as que protegem os mais vulneráveis.',
            example: 'Se você não soubesse se seria o CEO ou o motorista de app, aceitaria o modelo atual de trabalho por plataforma? Essa pergunta é a base filosófica do ESG e da justiça distributiva.',
            antiExample: '"O mercado define o salário justo" ignora que o poder de barganha é assimétrico. Rawls diria: o mercado sem regulação favorece quem já tem vantagem.',
          },
          {
            id: 'M4-fil-compare2',
            type: 'compare',
            title: 'Smith vs Marx vs Keynes vs Rawls — Filosofia Política e Negócios',
            question: 'Como cada pensador responderia: "Qual o salário justo para pagar aos funcionários?"',
            dimensions: ['Ideia central', 'Resposta sobre salários', 'Aplicação em negócios', 'Limitação prática'],
            items: [
              { id: 'smith', label: 'Adam Smith', values: ['Livre mercado aloca recursos melhor', 'Pague o que o mercado aceita (oferta × demanda)', 'Justifica meritocracia e livre concorrência', 'Ignora assimetria de poder e falhas de mercado'], highlight: 'Smith TAMBÉM escreveu sobre ética — seus seguidores frequentemente ignoram.' },
              { id: 'marx', label: 'Karl Marx', values: ['Capitalismo gera alienação e exploração', 'Lucro = diferença entre valor produzido e salário pago (mais-valia)', 'Explica tensões trabalhistas e turnover alto', 'Alternativas propostas geraram concentração de poder ainda maior'], highlight: 'Entender Marx ajuda a diagnosticar desigualdade salarial interna.' },
              { id: 'keynes', label: 'John M. Keynes', values: ['Mercado não se autorregula; Estado deve intervir', 'Salários devem sustentar consumo — demanda puxa a economia', 'Explica políticas anticíclicas e crédito subsidiado', 'Intervenção excessiva pode gerar inflação e ineficiência'], highlight: 'Quando o governo sobe o salário mínimo, Keynes está operando.' },
              { id: 'rawls', label: 'John Rawls', values: ['Desigualdade só é justa se beneficia os mais vulneráveis', 'Pague de forma que os menos favorecidos se beneficiem', 'Base do ESG, compliance e responsabilidade social', 'Pode reduzir incentivos de performance e meritocracia'], highlight: 'Teste: "Se eu não soubesse meu cargo, aceitaria essa estrutura salarial?"' },
            ],
            insight: 'A maioria das empresas bem-sucedidas opera entre Smith e Rawls: remunera pelo mercado, mas investe em equidade e desenvolvimento para reter talentos e reduzir turnover (que custa 1.5-2x o salário anual).',
          },
          {
            id: 'M4-0-t6',
            type: 'text',
            title: 'Existencialismo e Propósito — Por que Trabalho Precisa de Significado',
            body: 'O existencialismo é a filosofia que coloca a liberdade e a responsabilidade individual no centro da existência. Para negócios, responde à pergunta mais negligenciada: por que estamos fazendo isso?\n\n**Jean-Paul Sartre (1905–1980) — "A existência precede a essência"**\nIdeia: Não nascemos com um propósito definido. Somos livres — e condenados a escolher.\nPara negócios: A empresa não tem propósito inerente. O propósito é uma ESCOLHA. Se a liderança não escolhe conscientemente, o propósito default é "maximizar lucro" — e isso tem consequências.\n\nMá-fé (Mauvaise Foi): Sartre chama de "má-fé" quando fingimos que não temos escolha.\n— "O mercado exige que paguemos pouco" → Má-fé. Você ESCOLHE pagar pouco.\n— "Não temos alternativa senão demitir" → Má-fé, se alternativas não foram exploradas.\n— "É assim que a indústria funciona" → Má-fé. Você pode desafiar a indústria.\n\n**Viktor Frankl (1905–1997) — Logoterapia e a Busca por Sentido**\nFrankl sobreviveu a Auschwitz e concluiu: quem encontra SENTIDO no sofrimento sobrevive. Quem perde o sentido, desiste.\n\n"Quem tem um PORQUÊ suporta qualquer COMO." — Nietzsche (citado por Frankl)\n\nPara negócios:\n— Funcionários que entendem o PORQUÊ do trabalho têm 3x mais engajamento (Gallup)\n— Empresas com propósito claro superam o S&P 500 em 10x ao longo de 15 anos (Firms of Endearment, Sisodia et al.)\n— A geração Z (26% da força de trabalho em 2025) recusa empregos que não tenham propósito alinhado aos seus valores\n\n**Simon Sinek e o Golden Circle:**\nPor quê → Como → O quê\n— Apple: "Desafiamos o status quo" (por quê) → "Com design intuitivo" (como) → "Fazemos computadores" (o quê)\n— A maioria das empresas comunica ao contrário: "Vendemos computadores. Com bom design. Quer comprar?"\n\n**Exercício existencialista para gestores:**\n1. Por que sua empresa existe? (não vale "para dar lucro" — lucro é consequência)\n2. Se sua empresa fechasse amanhã, o que o mundo perderia?\n3. Seus funcionários sabem responder essas perguntas?\n4. Se não sabem — é aí que a desconexão começa.',
          },
          {
            id: 'M4-0-t7',
            type: 'text',
            title: 'Filosofia da Ciência — Como Separar Conhecimento Válido de Charlatanismo',
            body: 'No mundo dos negócios, consultores, gurus e influencers vendem "metodologias" que parecem ciência mas não são. A filosofia da ciência ensina a distinguir conhecimento válido de opinião fantasiada.\n\n**Karl Popper (1902–1994) — Falsificabilidade**\nIdeia: Uma teoria só é científica se pode ser REFUTADA. Se nenhum resultado possível pode provar que está errada, não é ciência — é pseudociência.\n\nExemplos no mundo corporativo:\n— "Nossa cultura é forte" → Como mediria se está errado? Se não pode medir, é crença.\n— "O mercado vai crescer" → Qual dado provaria que está errado? Defina antes.\n— "Ágil funciona para todos" → Qual cenário mostraria que ágil falha? Se não admite nenhum, é dogma.\n\nRegra Popper para gestores: Para toda afirmação estratégica, pergunte: "O que me faria mudar de ideia?"\n\n**Thomas Kuhn (1922–1996) — Paradigmas e Revoluções**\nIdeia: A ciência não evolui linearmente. Opera dentro de "paradigmas" (conjunto de pressupostos aceitos) até que anomalias se acumulam e um novo paradigma emerge (revolução).\n\nPara negócios:\n— Paradigma: "Lojas físicas são o canal principal" → Anomalia: Amazon cresce 30%/ano → Revolução: e-commerce domina\n— Paradigma: "Táxis são regulados e protegidos" → Anomalia: Uber cresce exponencialmente → Revolução: economia compartilhada\n— Paradigma: "Bancos precisam de agências" → Anomalia: Nubank atinge 80M de clientes sem nenhuma → Revolução: banco digital\n\nA maioria das empresas que morre não morre por incompetência — morre por se agarrar ao paradigma antigo quando o novo já está claro.\n\n**Nassim Taleb — Antifragilidade e Cisnes Negros**\nIdeia: Sistemas frágeis quebram sob estresse. Sistemas resilientes resistem. Sistemas antifrágeis MELHORAM sob estresse.\n\nPara negócios:\n— Frágil: Empresa com um único cliente (se perde, quebra)\n— Resiliente: Empresa com carteira diversificada (absorve choques)\n— Antifrágil: Empresa que usa crises para comprar concorrentes baratos e sair mais forte\n\nO Cisne Negro: evento raro, imprevisível, de impacto massivo. COVID, crise de 2008, ascensão do ChatGPT.\n— Você não pode prever Cisnes Negros\n— Mas pode se preparar: diversificação, caixa, opcionalidade\n\n**Método Científico Aplicado a Negócios:**\n1. Observação: "Vendas caíram 15% no trimestre"\n2. Hipótese: "A causa é o novo concorrente no segmento premium"\n3. Teste: Pesquisa com clientes perdidos + análise de market share\n4. Análise: "60% dos clientes perdidos migraram para o concorrente. 40% reduziram consumo geral"\n5. Conclusão provisória: "O concorrente é responsável por ~9pp da queda. A economia explica ~6pp"\n6. Ação: Estratégia diferenciada para cada causa\n7. Revisão: Medir resultado em 90 dias e ajustar',
          },
          {
            id: 'M4-fil-concept3',
            type: 'concept',
            term: 'Falsificabilidade (Popper)',
            definition: 'Uma teoria só é científica se pode ser REFUTADA. Se nenhum resultado possível pode provar que está errada, não é ciência — é pseudociência ou dogma.',
            example: '"Se investirmos em marketing de conteúdo, esperamos aumento de 15% em leads qualificados em 6 meses. Se não acontecer, a hipótese está errada." Isso é falsificável.',
            antiExample: '"Nossa cultura é forte" — como provaria que está errado? Se não pode medir nem refutar, é crença, não conhecimento.',
          },
          {
            id: 'M4-fil-framework1',
            type: 'framework',
            frameworkId: 'popper-business',
            title: 'Teste de Popper para Estratégias de Negócio',
            description: 'Pegue 3 afirmações estratégicas que sua empresa usa e aplique o teste de falsificabilidade. Se não pode ser refutada, não é estratégia — é fé.',
            fields: [
              { id: 'claim1', label: 'Afirmação estratégica 1', placeholder: 'Ex: "Nosso diferencial é o atendimento"', helpText: 'Escreva uma afirmação que sua empresa trata como verdade.' },
              { id: 'falsify1', label: 'O que provaria que está errada?', placeholder: 'Ex: "Se o NPS cair abaixo de 50 E clientes citarem atendimento como motivo de saída"', helpText: 'Se não consegue definir o que a refutaria, não é estratégia testável.' },
              { id: 'claim2', label: 'Afirmação estratégica 2', placeholder: 'Ex: "O mercado está crescendo"', helpText: 'Baseado em qual fonte? Qual período?' },
              { id: 'falsify2', label: 'O que provaria que está errada?', placeholder: 'Ex: "Se o crescimento do setor ficar abaixo de 5% por 2 trimestres consecutivos"', helpText: 'Defina o critério ANTES de ver os dados.' },
            ],
          },
          {
            id: 'M4-0-t8',
            type: 'text',
            title: 'Filosofia Oriental e Gestão — Zen, Taoísmo e a Arte de Liderar',
            body: 'A filosofia ocidental enfatiza análise, controle e ação. A filosofia oriental oferece perspectivas complementares que são cada vez mais valorizadas em liderança e inovação.\n\n**Taoísmo (Lao Tzu, séc. VI a.C.) — Wu Wei: A Ação pela Não-Ação**\n"O líder sábio não força. Quando o melhor líder termina seu trabalho, as pessoas dizem: nós fizemos isso sozinhos."\n\nPara negócios:\n— Wu Wei não é passividade. É agir no momento certo, da forma certa, sem forçar.\n— Microgerenciamento é o oposto do Wu Wei — é força sem sabedoria.\n— O melhor marketing não parece marketing. O melhor líder não parece estar liderando.\n\nCaso prático: A Toyota desenvolveu o Toyota Production System baseado em princípios taoístas — deixar o sistema fluir, remover obstáculos em vez de adicionar controles, confiar no processo.\n\n**Zen Budismo — Mente do Principiante (Shoshin)**\n"Na mente do especialista há poucas possibilidades. Na mente do principiante, infinitas." — Shunryu Suzuki\n\nPara negócios:\n— Especialistas ficam presos no que sabem. Principiantes fazem perguntas que experts não fazem.\n— Steve Jobs: "Stay hungry, stay foolish" — mantenha a mente do principiante.\n— Design Thinking é Shoshin aplicado: observar sem julgamento, perguntar "por quê?" como uma criança.\n\nExercício: Na próxima vez que alguém apresentar um problema "impossível", finja que nunca ouviu falar do assunto. Que perguntas faria?\n\n**Confucionismo — Relações, Hierarquia e Virtude**\nIdeia: A sociedade funciona quando cada pessoa cumpre seu papel com excelência e respeito.\n5 Relações fundamentais: governante-governado, pai-filho, marido-esposa, irmão mais velho-mais novo, amigo-amigo.\n\nPara negócios:\n— Empresas asiáticas (Samsung, Toyota, Alibaba) operam com forte influência confucionista\n— Lealdade à empresa, respeito à hierarquia, visão de longo prazo\n— Limitação: pode inibir dissenso e inovação disruptiva\n\n**Estoicismo (Marco Aurélio, Epicteto, Sêneca) — O que Você Controla?**\n"Não temos controle sobre eventos externos. O que podemos controlar é como respondemos." — Epicteto\n\nDicotomia do Controle:\n— O que você controla: suas decisões, sua preparação, sua resposta, seu esforço\n— O que NÃO controla: o mercado, concorrentes, economia, clima, opinião dos outros\n\nPara gestores:\n— Parou de chover e vendas de guarda-chuva caíram? Não controla o clima. Controla a diversificação de portfólio.\n— Concorrente baixou preço? Não controla o concorrente. Controla sua proposta de valor.\n— Funcionário pediu demissão? Não controla a decisão dele. Controla a cultura que constrói.\n\nMarco Aurélio governou o Império Romano com diário estoico (Meditações). Jeff Bezos, Tim Ferriss e Phil Jackson praticam estoicismo. É a filosofia mais prática para líderes sob pressão.',
          },
          {
            id: 'M4-0-t9',
            type: 'text',
            title: 'Filosofia da Linguagem e Comunicação — O Poder das Palavras nos Negócios',
            body: 'A linguagem não apenas descreve a realidade — ela CRIA a realidade. Como você nomeia as coisas determina como as pessoas pensam sobre elas.\n\n**Ludwig Wittgenstein (1889–1951) — "Os limites da minha linguagem são os limites do meu mundo"**\nIdeia: Só podemos pensar sobre aquilo que temos palavras para descrever.\n\nPara negócios:\n— "Custo" vs "Investimento" — mesma despesa, percepção oposta\n— "Funcionário" vs "Colaborador" vs "Parceiro" — cada termo cria expectativa diferente\n— "Problema" vs "Oportunidade" vs "Desafio" — cada palavra programa a resposta emocional\n— "Demissão" vs "Reestruturação" vs "Rightsizing" — linguagem corporativa frequentemente mascara realidade\n\n**Teoria dos Atos de Fala (John Austin, John Searle)**\nIdeia: Falar não é apenas descrever — é FAZER. Certas palavras são ações.\n\n5 tipos de atos de fala no contexto corporativo:\n1. Assertivos: "O mercado cresceu 5%" (descreve fato)\n2. Diretivos: "Prepare o relatório até sexta" (ordena ação)\n3. Comissivos: "Entregaremos o projeto em 30 dias" (compromete-se)\n4. Expressivos: "Estou frustrado com esse resultado" (expressa sentimento)\n5. Declarativos: "Você está promovido" (cria nova realidade ao ser dito)\n\nA maioria dos conflitos empresariais surge quando:\n— Alguém faz um comissivo ("vou entregar") sem intenção real\n— Um diretivo é interpretado como sugestão ("seria bom se..." lido como "se quiser...")\n— Um assertivo é aceito sem verificação ("o mercado cresceu" — fonte?)\n\n**Retórica (Aristóteles) — A Arte da Persuasão:**\n3 pilares da persuasão:\n— Ethos: Credibilidade do comunicador (quem fala importa)\n— Pathos: Conexão emocional com a audiência (como sente importa)\n— Logos: Lógica e evidência do argumento (o que diz importa)\n\nNa prática:\n— Pitch para investidor: Ethos (sua experiência) + Logos (dados de mercado) + Pathos (história do problema)\n— Email ao CEO: Logos primeiro (dados), Ethos implícito (você sabe do que fala), Pathos mínimo\n— Venda ao consumidor: Pathos (emocional) + Ethos (marca confiável) + Logos (especificações)\n\n**Erros de comunicação com raiz filosófica:**\n— Falácia naturalista: "É assim que o mercado funciona" (descrever como é ≠ justificar como deveria ser)\n— Ambiguidade estratégica: Usar linguagem vaga de propósito para evitar compromisso ("vamos analisar")\n— Eufemismo corporativo: Substituir palavras duras por suaves para evitar reação ("adequação de quadro" = demissão em massa)',
          },
          {
            id: 'M4-0-t10',
            type: 'text',
            title: 'Estética e Design Thinking — A Filosofia por trás da Experiência',
            body: 'Estética é o ramo da filosofia que estuda a beleza, a arte e a experiência sensorial. No mundo dos negócios, estética é diferencial competitivo.\n\n**Por que estética importa em negócios:**\n— Apple não vende tecnologia. Vende experiência estética. O unboxing de um iPhone é projetado com o mesmo cuidado que o chip.\n— Starbucks não vende café. Vende o "terceiro lugar" — uma experiência sensorial entre casa e trabalho.\n— Aesop não vende creme. Vende minimalismo e sofisticação — a embalagem É o produto.\n\n**Kant e a Experiência Estética:**\nKant distinguiu entre o belo (prazer desinteressado) e o agradável (prazer funcional).\nPara negócios: Produtos "agradáveis" resolvem problemas. Produtos "belos" transcendem a função e criam conexão emocional.\n— Carro agradável: Honda Civic (funciona perfeitamente)\n— Carro belo: Porsche 911 (funciona E emociona)\n— A margem de lucro do belo é 3-10x maior que a do agradável.\n\n**Design Thinking como Filosofia Aplicada:**\n\nDesign Thinking não é ferramenta. É postura filosófica:\n— Empatia (fenomenologia): entender a experiência do outro COMO ELE a vive, não como você imagina\n— Definição (epistemologia): qual é o VERDADEIRO problema? (não o problema que parece óbvio)\n— Ideação (pragmatismo): gerar alternativas sem julgamento prematuro\n— Prototipagem (empirismo): testar na realidade, não na planilha\n— Teste (falseabilidade/Popper): o que provaria que nossa solução está errada?\n\n**As 5 Fases do Design Thinking:**\n1. Empatizar — Observar e entrevistar o usuário no contexto real. Não pergunte o que ele quer. Observe o que ele FAZ.\n2. Definir — Sintetize em um "Problem Statement": "[Persona] precisa de [necessidade] porque [insight]"\n3. Idear — Brainstorm: quantidade > qualidade. Ideias ruins no início levam a ideias boas depois.\n4. Prototipar — Construa a versão mais simples possível em horas (não semanas). Papel, Figma, simulação.\n5. Testar — Coloque na mão do usuário. Observe. Não explique. Se precisa explicar, o design falhou.\n\n**Wabi-Sabi — A Estética da Imperfeição (filosofia japonesa):**\nIdeia: A beleza está na imperfeição, na impermanência e na incompletude.\nPara negócios: MVP não precisa ser perfeito. A primeira versão do Google era uma página em branco com uma caixa de busca. A imperfeição funcional vale mais que a perfeição adiada.',
          },
          {
            id: 'M4-0-t11',
            type: 'text',
            title: 'Filosofia da Tecnologia — Ética da IA, Privacidade e Transhumanismo',
            body: 'A tecnologia nunca é neutra. Toda ferramenta carrega os valores de quem a criou e transforma quem a usa. A filosofia da tecnologia questiona: para onde estamos indo?\n\n**Martin Heidegger (1889–1976) — A Questão da Técnica**\nIdeia: A tecnologia moderna transforma tudo em "recurso disponível" (Bestand). A natureza vira "recurso natural". Pessoas viram "recursos humanos". Atenção vira "recurso de engajamento".\nPerigo: Quando tudo é recurso, nada tem valor intrínseco. A eficiência substitui o significado.\nPara negócios: Automatizar tudo que pode ser automatizado não é necessariamente bom. Algumas interações humanas têm valor que a eficiência destrói (atendimento ao cliente, mentoria, criação).\n\n**Hannah Arendt (1906–1975) — A Banalidade do Mal**\nIdeia: O mal mais perigoso não vem de monstros — vem de pessoas normais que param de pensar e apenas seguem ordens.\nPara negócios:\n— Engenheiros que constroem algoritmos discriminatórios "porque o gerente pediu"\n— Funcionários que vendem dados de clientes "porque a meta exige"\n— Gestores que implementam layoffs "porque o mercado espera"\nA banalidade do mal corporativo: "Eu só estava fazendo meu trabalho" não é defesa ética.\n\n**Ética da Inteligência Artificial — Os 4 Princípios (IEEE/EU):**\n\n1. Transparência: O usuário sabe que está interagindo com IA? Sabe como a decisão foi tomada?\n2. Justiça: O sistema discrimina por raça, gênero, idade, renda? Viés nos dados = viés nas decisões.\n3. Responsabilidade: Se a IA erra, quem é responsável? O desenvolvedor? A empresa? O usuário?\n4. Privacidade: Os dados usados foram coletados com consentimento? São armazenados com segurança?\n\n**Casos reais que ilustram os dilemas:**\n— COMPAS (justiça criminal EUA): algoritmo previa reincidência criminal — classificava negros como 2x mais propensos a reincidir, mesmo com histórico similar. Viés nos dados históricos reproduziu racismo sistêmico.\n— Clearview AI: coletou 3 bilhões de fotos de redes sociais sem consentimento para reconhecimento facial vendido à polícia. Violação massiva de privacidade.\n— GPT/Claude: Modelos de linguagem podem gerar desinformação convincente, automatizar manipulação e substituir empregos criativos. Quem regula? Quem é responsável pelo uso?\n\n**Transhumanismo — O Futuro da Condição Humana:**\nIdeia: Usar tecnologia para superar limitações biológicas — longevidade, capacidade cognitiva, interface cérebro-máquina.\nPara negócios: Neuralink (interface cerebral), CRISPR (edição genética), longevidade (bilionários investindo em "não morrer"). Isso cria novos mercados E novos dilemas éticos.\nPergunta filosófica central: Se podemos melhorar humanos com tecnologia, DEVEMOS? Quem terá acesso — todos ou só os ricos?',
          },
          {
            id: 'M4-0-s3',
            type: 'simulation',
            title: 'Tribunal Filosófico — Julgue Decisões Empresariais',
            simulationId: 'philosophy-tribunal',
            description: 'Receba 6 decisões empresariais controversas. Para cada uma, avalie sob a perspectiva de 3 filósofos diferentes (Kant, Aristóteles, Sartre, Rawls, Lao Tzu, Popper). Descubra como a filosofia muda radicalmente a conclusão.',
          },
          {
            id: 'M4-0-t12',
            type: 'text',
            title: 'Mapa Filosófico para Gestores — Quando Usar Cada Pensador',
            body: '**Guia prático — qual filósofo consultar em cada situação:**\n\n**Decisão ética difícil:**\n→ Utilitarismo: Quem se beneficia e quem é prejudicado?\n→ Kant: Pode ser universalizado?\n→ Aristóteles: Uma pessoa virtuosa faria isso?\n→ Rawls: Os mais vulneráveis são protegidos?\n\n**Questionar uma estratégia:**\n→ Popper: O que provaria que estamos errados?\n→ Kuhn: Estamos presos a um paradigma ultrapassado?\n→ Wittgenstein: A linguagem que usamos esconde premissas?\n\n**Liderar em crise:**\n→ Estoicismo (Marco Aurélio): O que eu controlo? Foque nisso.\n→ Frankl: Qual o sentido desta situação?\n→ Taleb: Como saio mais forte disso (antifrágil)?\n\n**Inovar e criar:**\n→ Zen (Shoshin): Olhe com mente de principiante\n→ Design Thinking: Empatize antes de criar\n→ Wabi-Sabi: Imperfeição funcional > perfeição adiada\n\n**Construir propósito:**\n→ Sartre: O propósito é uma escolha — não uma descoberta\n→ Frankl: Significado gera resiliência\n→ Sinek: Por quê → Como → O quê\n\n**Avaliar tecnologia:**\n→ Heidegger: Isso transforma pessoas em recurso?\n→ Arendt: Estamos fazendo sem pensar?\n→ IEEE/EU: Transparência, justiça, responsabilidade, privacidade?\n\n**Tomar decisões sob incerteza:**\n→ Taleb: Posicione-se para ser antifrágil\n→ Popper: Defina o que falsificaria sua hipótese\n→ Bayes (epistemologia): Atualize crenças com evidências\n\n**Negociar e persuadir:**\n→ Aristóteles (Retórica): Ethos + Pathos + Logos\n→ Austin/Searle: Que ato de fala estou performando?\n→ Taoísmo: A melhor negociação não parece negociação\n\n**Gerir pessoas:**\n→ Confúcio: Relações e papéis claros\n→ Sartre: Respeite a liberdade do outro\n→ Liderança Servidora (Greenleaf): Sirva antes de comandar\n→ Estoicismo: Controle suas reações, não as pessoas',
          },
        ],
      },
      {
        id: 'M4-1',
        title: 'Calculo Aplicado a Negocios',
        blocks: [
          {
            id: 'M4-1-t1',
            type: 'text',
            title: 'Por que Cálculo Importa em Negócios — A Matemática da Mudança',
            body: 'Cálculo é a matemática da mudança. Se álgebra resolve problemas estáticos ("quanto custa?"), cálculo resolve problemas dinâmicos ("a que velocidade está mudando?" e "qual o acumulado?").\n\n**Onde cálculo aparece em negócios:**\n— Receita marginal: "Se vendermos mais uma unidade, quanto de receita extra ganhamos?" (derivada)\n— Custo marginal: "Se produzirmos mais uma unidade, quanto custa a mais?" (derivada)\n— Lucro máximo: "Em qual ponto a receita marginal = custo marginal?" (otimização)\n— Valor presente: "Quanto vale hoje um fluxo futuro de receitas?" (integral)\n— Elasticidade: "Se aumentarmos o preço em 1%, quanto a demanda cai?" (derivada percentual)\n\nVocê não precisa resolver equações diferenciais no dia a dia. Precisa entender o CONCEITO para:\n— Interpretar relatórios financeiros\n— Questionar projeções de analistas\n— Tomar decisões de preço, produção e investimento com fundamento',
          },
          {
            id: 'M4-1-t2',
            type: 'text',
            title: 'Funções — A Linguagem Matemática dos Negócios',
            body: 'Uma função é uma relação onde cada entrada produz exatamente uma saída. Negócios são feitos de funções.\n\n**Funções mais usadas em negócios:**\n\n**Função Linear: f(x) = ax + b**\nOnde aparece: Custos fixos + variáveis, depreciação linear, comissão de vendas\nExemplo: Custo total = R$ 50.000 (fixo) + R$ 12 × unidades produzidas\nC(x) = 50.000 + 12x\nSe x = 10.000 → C = R$ 170.000\n\n**Função Quadrática: f(x) = ax² + bx + c**\nOnde aparece: Receita com curva de demanda, lucro (que tem ponto máximo)\nExemplo: Receita = preço × quantidade, mas se o preço sobe, a quantidade cai\nR(p) = p × (1000 - 2p) = 1000p - 2p²\nO lucro máximo está no vértice da parábola.\n\n**Função Exponencial: f(x) = a × bˣ**\nOnde aparece: Juros compostos, crescimento de usuários, depreciação acelerada\nExemplo: Valor futuro = R$ 10.000 × (1,01)¹² = R$ 11.268 (1% ao mês por 12 meses)\nDinheiro cresce exponencialmente — essa é a base de todo investimento.\n\n**Função Logarítmica: f(x) = log(x)**\nOnde aparece: Retornos decrescentes, escalas de percepção (dB, Richter), tempo de duplicação\nExemplo: Se uma startup cresce 10% ao mês, em quantos meses dobra?\nlog(2) / log(1,10) = 7,3 meses\n\n**Na prática — Modelagem de Negócios:**\nToda planilha financeira é um conjunto de funções. Quando você muda uma variável e vê o impacto no resultado, está fazendo análise funcional. Entender a forma da função (linear? exponencial? com ponto máximo?) é mais importante que calcular o número exato.',
          },
          {
            id: 'M4-calc-number1',
            type: 'number-crunch',
            title: 'Calculadora de Juros Compostos — Quanto Seu Dinheiro Cresce?',
            scenario: 'Calcule o valor futuro de um investimento com juros compostos. Ajuste o capital inicial, a taxa mensal e o prazo para ver o poder dos juros sobre juros.',
            inputs: [
              { id: 'capital', label: 'Capital inicial (R$)', defaultValue: 10000, unit: 'R$', min: 100, max: 10000000 },
              { id: 'taxa', label: 'Taxa de juros mensal (%)', defaultValue: 1, unit: '%', min: 0.1, max: 15 },
              { id: 'meses', label: 'Prazo (meses)', defaultValue: 24, unit: 'meses', min: 1, max: 360 },
            ],
            formula: 'capital * Math.pow(1 + taxa/100, meses)',
            resultLabel: 'Valor futuro (R$)',
            interpretation: [
              { max: 1.5, label: 'Rendimento modesto — considere prazos maiores ou taxas melhores', color: 'amber' as const },
              { max: 3, label: 'Bom crescimento — juros compostos começando a trabalhar', color: 'green' as const },
              { max: 100, label: 'Crescimento expressivo — esse é o poder exponencial!', color: 'green' as const },
            ],
          },
          {
            id: 'M4-calc-concept1',
            type: 'concept',
            term: 'Função Exponencial nos Negócios',
            definition: 'A função exponencial f(x) = a × bˣ modela crescimento acelerado: juros compostos, base de usuários virais, depreciação acelerada. Cresce lentamente no início e explode depois.',
            example: 'R$ 10.000 a 1% ao mês por 30 anos (juros compostos) = R$ 359.496. Juros simples no mesmo período = R$ 46.000. A diferença de 7.8x é o poder exponencial.',
            antiExample: 'Assumir crescimento linear quando o fenômeno é exponencial (ou vice-versa) é o erro mais caro em projeções financeiras. COVID crescia exponencialmente — governos planejaram linearmente.',
          },
          {
            id: 'M4-1-t3',
            type: 'text',
            title: 'Derivadas — Taxas de Variação e Decisões Marginais',
            body: 'A derivada mede a taxa de variação instantânea. Em negócios: mede o impacto de uma mudança incremental.\n\n**Conceito intuitivo:**\nSe a receita é R(x) onde x = quantidade vendida, a derivada R\'(x) responde: "Se eu vender MAIS UMA unidade, quanto a receita muda?"\n\nIsso é a **receita marginal** — o conceito mais importante de microeconomia.\n\n**As 3 Derivadas Fundamentais em Negócios:**\n\n**1. Receita Marginal (RMg)**\nRMg = dR/dx = variação da receita por unidade adicional vendida\nExemplo: R(x) = 100x - 0.5x² → RMg = R\'(x) = 100 - x\nSe x = 60: RMg = R$ 40 (cada unidade extra gera R$ 40 de receita)\nSe x = 100: RMg = R$ 0 (vender mais não aumenta receita — ponto de saturação)\n\n**2. Custo Marginal (CMg)**\nCMg = dC/dx = variação do custo por unidade adicional produzida\nExemplo: C(x) = 5000 + 20x + 0.1x² → CMg = C\'(x) = 20 + 0.2x\nSe x = 50: CMg = R$ 30 (cada unidade extra custa R$ 30)\nNote: o custo marginal CRESCE — quanto mais você produz, mais caro fica a unidade adicional (rendimentos decrescentes).\n\n**3. Lucro Máximo**\nLucro = Receita - Custo → L(x) = R(x) - C(x)\nLucro máximo quando L\'(x) = 0, ou seja, RMg = CMg\n\nRegra de ouro: **Continue produzindo enquanto a receita marginal > custo marginal. Pare quando RMg = CMg.**\n\nExemplo completo:\nR(x) = 100x - 0.5x² → RMg = 100 - x\nC(x) = 5000 + 20x + 0.1x² → CMg = 20 + 0.2x\nRMg = CMg → 100 - x = 20 + 0.2x → 80 = 1.2x → x ≈ 67 unidades\n\nProduzir 67 unidades maximiza o lucro.\n\n**Aplicação direta:** Todo empresário que decide "quanto produzir" ou "quando parar de investir" está (conscientemente ou não) igualando receita marginal a custo marginal.',
          },
          {
            id: 'M4-1-s1',
            type: 'simulation',
            title: 'Otimização de Lucro — Encontre o Ponto Máximo',
            simulationId: 'profit-optimization',
            description: 'Ajuste preço e quantidade de produção em 4 cenários empresariais. Observe como receita marginal e custo marginal se cruzam e encontre o ponto de lucro máximo.',
          },
          {
            id: 'M4-1-t4',
            type: 'text',
            title: 'Elasticidade — Como Preço Afeta Demanda',
            body: 'Elasticidade-preço da demanda mede a sensibilidade da demanda a mudanças de preço. É a ferramenta mais importante de precificação.\n\n**Fórmula:**\nEp = (% variação na quantidade demandada) / (% variação no preço)\n\n**Interpretação:**\n— |Ep| > 1: Demanda ELÁSTICA — consumidor é sensível ao preço. Aumento de preço REDUZ receita total.\n— |Ep| < 1: Demanda INELÁSTICA — consumidor é pouco sensível. Aumento de preço AUMENTA receita total.\n— |Ep| = 1: Elasticidade unitária — receita total não muda.\n\n**Exemplos reais:**\n— Gasolina: Ep ≈ -0.3 (inelástica). Preço sobe 10%, demanda cai só 3%. Você PRECISA abastecer.\n— Restaurante casual: Ep ≈ -1.8 (elástica). Preço sobe 10%, demanda cai 18%. Fácil ir a outro restaurante.\n— Medicamento essencial: Ep ≈ -0.1 (muito inelástica). Preço sobe 10%, demanda cai 1%. Sem alternativa.\n— Streaming: Ep ≈ -1.5 (elástica). Preço sobe 10%, 15% cancelam. Muitas alternativas.\n\n**Fatores que determinam a elasticidade:**\n1. Disponibilidade de substitutos (mais substitutos → mais elástica)\n2. Proporção da renda (custo maior em relação à renda → mais elástica)\n3. Necessidade vs. luxo (necessidade → mais inelástica)\n4. Horizonte de tempo (longo prazo → mais elástica — tempo para encontrar alternativas)\n\n**Aplicação em precificação:**\n— Produto inelástico: Pode subir preço → receita sobe (mas cuidado com regulação e ética)\n— Produto elástico: Reduzir preço pode AUMENTAR receita total (mais volume compensa preço menor)\n— Produto com Ep ≈ -1: Receita é maximizada. Estamos no ponto ótimo.\n\n**Como estimar na prática:**\n1. Teste A/B: ofereça preços diferentes para grupos diferentes e meça a resposta\n2. Análise histórica: quando mudamos preço no passado, o que aconteceu com as vendas?\n3. Pesquisa de sensibilidade: "Você compraria este produto por R$ X? E por R$ Y?"',
          },
          {
            id: 'M4-calc-concept2',
            type: 'concept',
            term: 'Elasticidade-Preço da Demanda',
            definition: 'Mede a sensibilidade da demanda a mudanças de preço. Se |Ep| > 1 (elástica), aumento de preço REDUZ receita total. Se |Ep| < 1 (inelástica), aumento de preço AUMENTA receita total.',
            example: 'Gasolina (Ep ≈ -0.3, inelástica): preço sobe 10%, demanda cai só 3% — você PRECISA abastecer. Por isso postos aumentam preço sem medo.',
            antiExample: 'Streaming (Ep ≈ -1.5, elástica): preço sobe 10%, 15% cancelam — muitas alternativas. Netflix perdeu 1M de assinantes quando subiu preço em 2022.',
          },
          {
            id: 'M4-calc-decision1',
            type: 'decision',
            scenario: 'Você vende um SaaS B2B com 500 clientes pagando R$ 200/mês. Sua margem é apertada e precisa aumentar receita. Pesquisa indica elasticidade de -1.2 (elástica). O que você faz?',
            options: [
              { label: 'Aumentar preço em 20% para todos', tradeoffs: { upside: 'Se ninguém sair, receita sobe R$ 240K/ano', downside: 'Com Ep=-1.2, espere perder ~24% dos clientes (120). Receita CAI R$ 48K/ano.', risk: 'high' as const } },
              { label: 'Criar plano premium (R$ 350) com features extras, manter plano atual', tradeoffs: { upside: 'Captura willingness-to-pay dos top 20% sem perder o resto', downside: 'Exige desenvolvimento de features e gestão de 2 planos', risk: 'low' as const } },
              { label: 'Manter preço e focar em reduzir churn + aumentar base', tradeoffs: { upside: 'Receita cresce via volume, sem risco de perda', downside: 'CAC pode ser alto, crescimento mais lento', risk: 'medium' as const } },
            ],
            realWorldAnalog: 'O Spotify usa modelo freemium + tiers. Nunca aumentou o plano básico significativamente — criou o Duo (R$ 24.90) e Family (R$ 34.90) para capturar mais valor sem perder a base.',
            lesson: 'Quando demanda é elástica, aumentar preço destrói receita. A estratégia correta é segmentar: ofereça mais valor para quem pode pagar mais, sem tocar no preço base.',
          },
          {
            id: 'M4-1-t5',
            type: 'text',
            title: 'Integrais — Acumulação e Valor Presente',
            body: 'Se a derivada mede a taxa de variação, a integral mede o acumulado. Em negócios: quanto se acumula ao longo do tempo.\n\n**Conceito intuitivo:**\nSe CMg(x) é o custo de cada unidade adicional, a integral ∫CMg(x)dx é o custo TOTAL de produzir x unidades.\nSe R\'(t) é a receita por mês, a integral ∫R\'(t)dt é a receita TOTAL acumulada no período.\n\n**Aplicações em negócios:**\n\n**1. Custo Total a partir do Custo Marginal**\nSe CMg(x) = 20 + 0.2x\nEntão CT(x) = ∫(20 + 0.2x)dx = 20x + 0.1x² + C (onde C = custo fixo)\nSe custo fixo = R$ 5.000: CT(x) = 5000 + 20x + 0.1x²\n\n**2. Excedente do Consumidor**\nÁrea entre a curva de demanda e o preço de mercado. Representa o "ganho" que consumidores obtêm por pagar menos do que estariam dispostos.\nSe a demanda é D(p) = 500 - 2p e o preço é R$ 100:\nExcedente = ∫₁₀₀²⁵⁰ (500 - 2p - 100)dp = valor que o consumidor "economiza"\n\n**3. Valor Presente de Fluxos Contínuos**\nSe uma empresa gera receita contínua R(t) e a taxa de desconto é r:\nVP = ∫₀ᵀ R(t) × e⁻ʳᵗ dt\nIsso é a base do valuation por DCF (Discounted Cash Flow).\n\n**4. Depreciação Acumulada**\nSe a taxa de depreciação é D(t) por ano:\nDepreciação total em T anos = ∫₀ᵀ D(t)dt\n\n**Na prática:**\nVocê raramente calculará integrais manualmente. Mas entender que o Excel está fazendo somas de Riemann quando calcula NPV, IRR ou depreciação acumulada permite questionar os resultados e identificar erros em modelos financeiros.',
          },
          {
            id: 'M4-1-t6',
            type: 'text',
            title: 'Juros Compostos — A Oitava Maravilha do Mundo',
            body: 'Einstein (supostamente) disse: "Os juros compostos são a oitava maravilha do mundo. Quem entende, ganha. Quem não entende, paga."\n\n**Juros Simples vs. Compostos:**\n— Simples: J = C × i × n (juros sobre o capital original)\n— Compostos: M = C × (1 + i)ⁿ (juros sobre juros)\n\nExemplo comparativo — R$ 10.000 a 1% ao mês por 24 meses:\n— Simples: M = 10.000 × (1 + 0,01 × 24) = R$ 12.400\n— Compostos: M = 10.000 × (1,01)²⁴ = R$ 12.697\n— Diferença: R$ 297 a mais nos compostos. Parece pouco em 2 anos.\n\nAgora com 10% ao ano por 30 anos:\n— Simples: R$ 10.000 × (1 + 0,10 × 30) = R$ 40.000\n— Compostos: R$ 10.000 × (1,10)³⁰ = R$ 174.494\n— Diferença: R$ 134.494. Juros compostos são 4.4x maiores.\n\n**Regra dos 72 — Quanto tempo para dobrar?**\nTempo para dobrar ≈ 72 / taxa de juros (%)\n— A 6% ao ano: 72/6 = 12 anos\n— A 12% ao ano: 72/12 = 6 anos\n— A 1% ao mês: 72/1 = 72 meses (6 anos)\n\n**Na prática empresarial:**\n\n1. Valor Futuro (FV) — "Quanto terei?":\nInvesti R$ 50K em equipamento que gera R$ 5K/mês. Em 24 meses reinvestindo a 1%/mês:\nFV = 5.000 × [(1,01)²⁴ - 1] / 0,01 = R$ 135.024\n\n2. Valor Presente (PV) — "Quanto vale hoje?":\nCliente oferece pagar R$ 100K daqui a 2 anos. Com custo de capital de 15%/ano:\nPV = 100.000 / (1,15)² = R$ 75.614\nOu seja, R$ 100K em 2 anos vale R$ 75,6K hoje.\n\n3. Parcelas (PMT) — "Quanto vou pagar por mês?":\nEmpréstimo de R$ 200K a 1.5%/mês por 36 meses:\nPMT = 200.000 × [0,015 × (1,015)³⁶] / [(1,015)³⁶ - 1] = R$ 7.576/mês\nTotal pago: R$ 272.736 → Juros: R$ 72.736 (36% do valor emprestado!)\n\n**Armadilha do crédito brasileiro:**\nCartão de crédito: ~14% ao mês compostos\nR$ 1.000 de dívida no rotativo por 12 meses = R$ 4.887\nO brasileiro médio paga 4.9x o valor original. Isso não é crédito — é destruição de patrimônio.',
          },
          {
            id: 'M4-1-t7',
            type: 'text',
            title: 'Análise de Investimentos — VPL, TIR e Payback',
            body: 'Toda decisão de investimento responde a uma pergunta: "Este projeto gera mais valor do que custa?" As 3 ferramentas fundamentais:\n\n**1. VPL (Valor Presente Líquido) — "Quanto valor este projeto cria?"**\nVPL = Σ [FCₜ / (1+r)ᵗ] - Investimento Inicial\nOnde: FC = fluxo de caixa, r = taxa de desconto, t = período\n\nRegra de decisão:\n— VPL > 0 → Projeto cria valor. ACEITE.\n— VPL < 0 → Projeto destrói valor. REJEITE.\n— VPL = 0 → Indiferente.\n\nExemplo:\nInvestimento: R$ 500K\nFluxos anuais: R$ 150K, R$ 200K, R$ 250K, R$ 180K\nTaxa de desconto: 12%\nVPL = 150/1,12 + 200/1,12² + 250/1,12³ + 180/1,12⁴ - 500\nVPL = 133,9 + 159,4 + 177,9 + 114,4 - 500 = R$ 85,6K\nVPL positivo → projeto cria R$ 85,6K de valor. Aceite.\n\n**2. TIR (Taxa Interna de Retorno) — "Qual a rentabilidade do projeto?"**\nTIR = taxa r que faz VPL = 0\n\nRegra de decisão:\n— TIR > custo de capital → ACEITE\n— TIR < custo de capital → REJEITE\n\nNo exemplo acima: TIR = 21,3%\nComo 21,3% > 12% (custo de capital) → Aceite.\n\n**3. Payback — "Em quanto tempo recupero o investimento?"**\n\nPayback Simples:\nAno 1: -500 + 150 = -350\nAno 2: -350 + 200 = -150\nAno 3: -150 + 250 = +100 → Payback entre ano 2 e 3\nPayback = 2 + (150/250) = 2,6 anos\n\nPayback Descontado (considera o valor do dinheiro no tempo):\nAno 1: -500 + 133,9 = -366,1\nAno 2: -366,1 + 159,4 = -206,7\nAno 3: -206,7 + 177,9 = -28,8\nAno 4: -28,8 + 114,4 = +85,6 → Payback descontado = 3,25 anos\n\n**Quando usar qual:**\n— VPL: A métrica mais confiável. Use sempre.\n— TIR: Útil para comparar projetos. Mas cuidado: pode dar resultados estranhos com fluxos não convencionais.\n— Payback: Útil para avaliar risco de liquidez. Projetos com payback curto têm menos risco.\n\n**No Excel:**\n— VPL: =VPL(taxa; fluxo1:fluxoN) + investimento_inicial\n— TIR: =TIR(investimento_inicial:fluxoN)\n— Use Ctrl+Shift+Enter se for fórmula matricial.',
          },
          {
            id: 'M4-1-s2',
            type: 'simulation',
            title: 'Calculadora de Investimentos — VPL, TIR e Payback',
            simulationId: 'investment-calculator',
            description: 'Insira fluxos de caixa de projetos reais e calcule VPL, TIR e Payback automaticamente. Compare 2 projetos lado a lado e decida qual é melhor.',
          },
          {
            id: 'M4-1-t8',
            type: 'text',
            title: 'Ponto de Equilíbrio — Quando a Empresa Para de Perder Dinheiro',
            body: 'O ponto de equilíbrio (Break-Even Point) é a quantidade mínima que você precisa vender para cobrir todos os custos. Abaixo: prejuízo. Acima: lucro.\n\n**Fórmula básica:**\nPE (unidades) = Custo Fixo / (Preço - Custo Variável Unitário)\nPE (receita) = Custo Fixo / Margem de Contribuição %\n\nOnde: Margem de Contribuição = Preço - Custo Variável = quanto cada unidade contribui para pagar o custo fixo.\n\n**Exemplo prático — Cafeteria:**\n— Custo fixo: R$ 15.000/mês (aluguel, salários, energia)\n— Preço do café: R$ 12\n— Custo variável por café: R$ 4 (grão, leite, copo, guardanapo)\n— Margem de contribuição: R$ 12 - R$ 4 = R$ 8\n— PE = 15.000 / 8 = 1.875 cafés/mês\n— PE em receita = 1.875 × 12 = R$ 22.500/mês\n\nInterpretação: Precisa vender 1.875 cafés/mês (63 por dia) só para empatar. A partir do café 1.876, cada um gera R$ 8 de lucro puro.\n\n**Ponto de equilíbrio com múltiplos produtos:**\nA maioria das empresas vende mais de um produto. Neste caso:\n1. Calcule a margem de contribuição média ponderada\n2. Use os pesos de cada produto no mix de vendas\n\nExemplo:\n— Café (60% das vendas): MC = R$ 8\n— Bolo (30%): MC = R$ 15\n— Suco (10%): MC = R$ 6\n— MC média = 0,60×8 + 0,30×15 + 0,10×6 = 4,80 + 4,50 + 0,60 = R$ 9,90\n— PE = 15.000 / 9,90 = 1.515 unidades/mês\n\n**Análise de Sensibilidade — E se mudarem as variáveis?**\n— Se o aluguel subir 20%: PE sobe de 1.875 para 2.250 (aumento de 375 cafés/mês)\n— Se o preço subir para R$ 14: PE cai de 1.875 para 1.500 (economia de 375 cafés)\n— Se o custo do grão subir 50% (R$ 4 → R$ 6): PE sobe de 1.875 para 2.500 (aumento de 625!)\n\nA análise de sensibilidade mostra quais variáveis mais impactam seu ponto de equilíbrio. Foque em controlar estas.\n\n**Margem de Segurança:**\nMS = (Vendas Reais - Vendas no PE) / Vendas Reais × 100%\nSe vende 2.500 cafés/mês: MS = (2.500-1.875)/2.500 = 25%\nSignifica: vendas podem cair 25% antes de entrar no prejuízo.',
          },
          {
            id: 'M4-calc-number2',
            type: 'number-crunch',
            title: 'Calculadora de Ponto de Equilíbrio (Break-Even)',
            scenario: 'Descubra quantas unidades você precisa vender por mês para cobrir todos os custos e parar de perder dinheiro. Abaixo do break-even = prejuízo. Acima = lucro.',
            inputs: [
              { id: 'fixo', label: 'Custo fixo mensal (R$)', defaultValue: 15000, unit: 'R$', min: 100, max: 10000000 },
              { id: 'preco', label: 'Preço de venda unitário (R$)', defaultValue: 50, unit: 'R$', min: 1, max: 100000 },
              { id: 'cvu', label: 'Custo variável unitário (R$)', defaultValue: 20, unit: 'R$', min: 0, max: 99999 },
            ],
            formula: 'fixo / (preco - cvu)',
            resultLabel: 'Ponto de equilíbrio (unidades/mês)',
            interpretation: [
              { max: 100, label: 'Excelente — poucas vendas para empatar. Negócio com boa margem de contribuição.', color: 'green' as const },
              { max: 1000, label: 'Razoável — verifique se o volume é atingível com sua capacidade atual.', color: 'amber' as const },
              { max: 1000000, label: 'Alto — considere reduzir custo fixo, aumentar preço ou reduzir custo variável.', color: 'red' as const },
            ],
          },
          {
            id: 'M4-calc-exercise1',
            type: 'inline-exercise',
            prompt: 'Calcule o ponto de equilíbrio do seu negócio (ou de um negócio que você conhece) e faça análise de sensibilidade.',
            context: 'O break-even mostra o mínimo para sobreviver. A análise de sensibilidade mostra quais variáveis mais impactam — foque em controlá-las.',
            fields: [
              { id: 'breakeven', label: 'Qual o ponto de equilíbrio em unidades e em receita?', placeholder: 'PE = Custo Fixo / (Preço - CVu). Ex: R$ 15K / (R$ 50 - R$ 20) = 500 unidades = R$ 25K/mês', multiline: true },
              { id: 'sensitivity', label: 'Se o custo fixo subir 30%, como muda o PE?', placeholder: 'Recalcule com o novo custo fixo. Quantas unidades a mais precisa vender?', multiline: true },
              { id: 'margin-safety', label: 'Qual sua margem de segurança atual?', placeholder: 'MS = (Vendas Reais - PE) / Vendas Reais. Se < 20%, você está vulnerável.', multiline: true },
            ],
            evaluationCriteria: ['Calcula corretamente o ponto de equilíbrio', 'Identifica a variável mais sensível', 'Propõe ação para aumentar a margem de segurança'],
            expectedConcepts: ['ponto de equilíbrio', 'margem de contribuição', 'análise de sensibilidade', 'margem de segurança'],
          },
          {
            id: 'M4-1-t9',
            type: 'text',
            title: 'Depreciação e Amortização — O Custo Invisível dos Ativos',
            body: 'Depreciação é a perda de valor de um ativo ao longo do tempo. Não é saída de caixa — mas afeta lucro contábil e imposto de renda.\n\n**Por que importa para gestores:**\n— Afeta o lucro líquido (DRE) — mesmo sem gastar dinheiro\n— Reduz imposto a pagar (depreciação é despesa dedutível)\n— Determina quando substituir equipamentos\n— Impacta decisões de comprar vs. alugar\n\n**Métodos de depreciação:**\n\n**1. Linear (Linha Reta)**\nDepreciação/ano = (Valor de Aquisição - Valor Residual) / Vida Útil\n\nExemplo: Máquina de R$ 100K, valor residual R$ 10K, vida útil 10 anos\nDep/ano = (100.000 - 10.000) / 10 = R$ 9.000/ano\nO mais usado no Brasil. Simples e previsível.\n\n**2. Acelerada (Soma dos Dígitos)**\nDepreciação maior nos primeiros anos, menor nos últimos.\nFator do ano n = (Vida útil - n + 1) / Soma dos dígitos\n\nPara vida útil de 5 anos: Soma = 1+2+3+4+5 = 15\nAno 1: 5/15 = 33,3% → R$ 30K\nAno 2: 4/15 = 26,7% → R$ 24K\nAno 3: 3/15 = 20,0% → R$ 18K\nAno 4: 2/15 = 13,3% → R$ 12K\nAno 5: 1/15 = 6,7% → R$ 6K\n\nVantagem: Mais realista (ativos perdem mais valor no início). Benefício fiscal maior nos primeiros anos.\n\n**Taxas de depreciação no Brasil (Receita Federal):**\n— Imóveis: 4% ao ano (25 anos)\n— Veículos: 20% ao ano (5 anos)\n— Máquinas: 10% ao ano (10 anos)\n— Computadores: 20% ao ano (5 anos)\n— Móveis: 10% ao ano (10 anos)\n— Software: 20% ao ano (5 anos)\n\n**Amortização:**\nIgual à depreciação, mas para ativos intangíveis: patentes, marcas, goodwill, software.\nExemplo: Patente adquirida por R$ 500K com proteção de 10 anos → Amortização = R$ 50K/ano\n\n**Decisão prática — Comprar vs. Alugar:**\nComprar: Deprecia, deduz do IR, tem valor residual ao final\nAlugar: Despesa operacional total, deduz 100% do IR, sem valor residual\n\nRegra simplificada: Se a taxa de juros é baixa e o ativo será usado por mais de 3 anos → compre. Se juros altos ou uso < 3 anos → alugue.',
          },
          {
            id: 'M4-1-t10',
            type: 'text',
            title: 'Matemática Financeira no Dia a Dia do Gestor',
            body: '**Decisões comuns que exigem cálculo financeiro:**\n\n**1. Desconto à vista vs. Prazo**\nCliente pergunta: "Se pagar à vista, quanto de desconto?"\nVocê precisa saber: qual seu custo de capital?\n\nSe custo de capital = 2%/mês e o prazo é 30 dias:\nDesconto máximo que compensa = 2% (se der mais, está perdendo dinheiro)\nSe o cliente pede 5% de desconto à vista: NÃO compensa. É melhor vender a prazo.\n\n**2. Antecipar recebíveis**\nBanco oferece antecipar R$ 50K em recebíveis de 60 dias por taxa de 3%/mês.\nCusto: 50.000 × 0,03 × 2 = R$ 3.000\nVocê recebe: R$ 47.000 hoje em vez de R$ 50.000 em 60 dias.\nVale a pena? Só se o uso imediato dos R$ 47K gera mais de R$ 3K de retorno em 60 dias.\n\n**3. Leasing vs. Compra à vista vs. Financiamento**\nCarro R$ 120K:\n— À vista: R$ 120K agora. Deprecia 20%/ano. Após 5 anos vale ~R$ 40K.\n— Financiamento 60x: ~R$ 2.800/mês. Total: R$ 168K. Custo do dinheiro: R$ 48K.\n— Leasing 48x: ~R$ 3.200/mês. Total: R$ 153K. Devolveu o carro. Zero valor residual.\nDecisão depende: tem o dinheiro? O custo de oportunidade (investir os R$ 120K) supera o custo do financiamento?\n\n**4. Mark-up vs. Margem**\nMark-up = (Preço - Custo) / Custo × 100%\nMargem = (Preço - Custo) / Preço × 100%\n\nCusto R$ 60, Preço R$ 100:\nMark-up = 40/60 = 66,7%\nMargem = 40/100 = 40%\n\nERRO COMUM: "Tenho 66% de margem!" → Não. Tem 66% de mark-up e 40% de margem.\nIsso muda completamente a análise de rentabilidade.\n\n**5. Inflação e Correção**\nPreço de 2020: R$ 100. Inflação acumulada 2020-2025: 35%.\nPreço corrigido: R$ 100 × 1,35 = R$ 135.\nSe seu preço ainda é R$ 120, você NÃO subiu preço — você REDUZIU preço real em 11%.\n\nSalário de R$ 5.000 em 2020 = R$ 3.703 em poder de compra de 2025 (sem reajuste).\nReajuste de 20% em 5 anos = perda real de 11% de poder de compra.',
          },
          {
            id: 'M4-1-s3',
            type: 'simulation',
            title: 'Simulador Break-Even — Encontre Seu Ponto de Equilíbrio',
            simulationId: 'breakeven-simulator',
            description: 'Configure custos fixos, preço e custo variável de 3 cenários de negócio. Veja o ponto de equilíbrio mudar em tempo real. Teste análise de sensibilidade: o que acontece se o aluguel sobe 30%?',
          },
          {
            id: 'M4-1-t11',
            type: 'text',
            title: 'Mapa de Conceitos — Cálculo e Matemática Financeira Aplicados',
            body: '**Resumo — quando usar cada conceito:**\n\n**Funções**\nQuando: Modelar relações entre variáveis (preço × demanda, custo × produção)\nFerramenta: Excel, Google Sheets, Python\nPergunta: "Como uma variável afeta a outra?"\n\n**Derivada (Taxa de Variação)**\nQuando: Decisões marginais — "vale a pena produzir/vender MAIS UMA unidade?"\nConceitos-chave: Receita marginal, custo marginal, lucro máximo\nRegra de ouro: RMg = CMg → lucro máximo\n\n**Elasticidade**\nQuando: Decisões de preço\nRegra: |Ep| > 1 → não suba preço. |Ep| < 1 → pode subir.\n\n**Integral (Acumulação)**\nQuando: Calcular totais a partir de taxas, valuation, depreciação\n\n**Juros Compostos**\nQuando: Qualquer decisão envolvendo dinheiro no tempo\nFórmulas: FV = PV × (1+i)ⁿ / Regra dos 72 / PMT\nRegra: Sempre compare em valor presente.\n\n**VPL / TIR / Payback**\nQuando: Avaliar projetos de investimento\nRegra: VPL > 0 = aceite. TIR > custo de capital = aceite.\nFerramenta: Excel =VPL(), =TIR()\n\n**Ponto de Equilíbrio**\nQuando: Saber o mínimo para não ter prejuízo\nFórmula: PE = CF / (P - CVu)\nUse: Antes de abrir negócio, lançar produto, expandir\n\n**Depreciação**\nQuando: Avaliar custo real de ativos, planejar substituição, otimizar IR\nMétodos: Linear (simples), Acelerada (mais realista)\n\n**Mark-up vs. Margem**\nQuando: Precificação\nArmadilha: Não confundir os dois! Mark-up é sobre custo, margem é sobre preço.\n\n**Correção pela Inflação**\nQuando: Comparar valores de períodos diferentes\nRegra: Sempre deflacione para comparar em termos reais.',
          },
        ],
      },
      {
        id: 'M4-2',
        title: 'Analise Estatistica',
        blocks: [
          {
            id: 'M4-2-t1',
            type: 'text',
            title: 'Estatística — A Ciência de Tomar Decisões sob Incerteza',
            body: 'Estatística não é sobre números. É sobre decisões. Todo número é um resumo imperfeito da realidade — e a estatística ensina a lidar com essa imperfeição.\n\n**Duas grandes áreas:**\n\n**Estatística Descritiva** — "O que aconteceu?"\nResume dados em medidas compreensíveis: média, mediana, moda, desvio padrão, quartis.\nExemplo: "A receita média mensal é R$ 1.2M, com desvio padrão de R$ 300K."\n\n**Estatística Inferencial** — "O que podemos concluir?"\nUsa amostras para fazer afirmações sobre populações.\nExemplo: "Com 95% de confiança, a satisfação dos clientes está entre 7.2 e 8.1."\n\n**Por que gestores erram com estatística:**\n1. Confundem média com realidade → A média salarial é R$ 5.000, mas metade ganha menos de R$ 3.000 (distribuição assimétrica)\n2. Ignoram dispersão → "Vendas médias de R$ 100K" pode significar R$ 99K-101K (estável) ou R$ 20K-180K (caótico)\n3. Confundem correlação com causalidade → Vendas de sorvete e afogamentos são correlacionados (ambos sobem no verão), mas sorvete não causa afogamento\n4. Usam amostras pequenas para conclusões grandes → "3 clientes reclamaram" não significa nada estatisticamente\n5. Ignoram viés de seleção → Pesquisa de satisfação com quem já comprou ignora quem nem considerou comprar',
          },
          {
            id: 'M4-2-t2',
            type: 'text',
            title: 'Medidas de Tendência Central e Dispersão — O Básico que Muda Tudo',
            body: '**Medidas de Tendência Central — "Onde está o centro?"**\n\n**Média Aritmética** = soma / n\nUso: Quando os dados são simétricos e sem outliers\nArmadilha: Sensível a extremos. Salário médio de (R$ 2K, R$ 3K, R$ 3K, R$ 4K, R$ 100K) = R$ 22.4K. Ninguém na sala ganha isso.\n\n**Mediana** = valor do meio quando os dados estão ordenados\nUso: Quando há outliers ou distribuição assimétrica\nExemplo: Mediana dos salários acima = R$ 3K. Muito mais representativo.\nRegra: Se média ≠ mediana → distribuição é assimétrica. Use mediana.\n\n**Moda** = valor mais frequente\nUso: Dados categóricos (produto mais vendido, horário de pico)\n\n**Medidas de Dispersão — "Quanto os dados variam?"**\n\n**Amplitude** = máximo - mínimo\nUso rápido, mas ignora distribuição interna.\n\n**Variância** = média dos quadrados dos desvios\nSó útil matematicamente — unidade é ao quadrado (R$²).\n\n**Desvio Padrão (σ)** = raiz da variância\nA medida mais usada. Mesma unidade dos dados.\nInterpretação: ~68% dos dados estão entre μ-σ e μ+σ (distribuição normal)\n\nExemplo prático:\nReceita mensal: média R$ 120K, desvio padrão R$ 30K\n→ Em ~68% dos meses, receita ficou entre R$ 90K e R$ 150K\n→ Em ~95% dos meses, entre R$ 60K e R$ 180K\n→ Se em um mês a receita foi R$ 40K → evento atípico (investigar!)\n\n**Coeficiente de Variação (CV)** = σ/μ × 100%\nPermite comparar dispersão de variáveis diferentes.\nExemplo: Empresa A (média R$ 500K, CV = 10%) é mais estável que Empresa B (média R$ 2M, CV = 45%), mesmo faturando menos.',
          },
          {
            id: 'M4-stat-concept1',
            type: 'concept',
            term: 'Média vs Mediana',
            definition: 'A média é sensível a extremos (outliers). A mediana é o valor do meio e resiste a distorções. Se média ≠ mediana, a distribuição é assimétrica — use mediana.',
            example: 'Salários de uma equipe: R$ 2K, R$ 3K, R$ 3K, R$ 4K, R$ 100K. Média = R$ 22.4K (ninguém ganha isso). Mediana = R$ 3K (muito mais representativo).',
            antiExample: '"Nosso cliente médio gasta R$ 500/mês" pode esconder que 80% gastam R$ 100 e 20% gastam R$ 2.000. A média mente quando a distribuição é assimétrica.',
          },
          {
            id: 'M4-stat-number1',
            type: 'number-crunch',
            title: 'Coeficiente de Variação — Sua Receita é Estável ou Caótica?',
            scenario: 'O desvio padrão mede variação, mas não permite comparar empresas de tamanhos diferentes. O Coeficiente de Variação (CV = σ/μ × 100%) resolve isso. CV > 30% = alta variabilidade.',
            inputs: [
              { id: 'media', label: 'Receita média mensal (R$)', defaultValue: 120000, unit: 'R$', min: 1000, max: 100000000 },
              { id: 'desvio', label: 'Desvio padrão da receita (R$)', defaultValue: 30000, unit: 'R$', min: 0, max: 50000000 },
            ],
            formula: '(desvio / media) * 100',
            resultLabel: 'Coeficiente de Variação (%)',
            interpretation: [
              { max: 15, label: 'Receita estável — previsibilidade alta. Bom para planejamento.', color: 'green' as const },
              { max: 30, label: 'Variação moderada — investigue sazonalidade e fatores externos.', color: 'amber' as const },
              { max: 1000, label: 'Alta variabilidade — receita imprevisível. Priorize reserva de caixa e diversificação.', color: 'red' as const },
            ],
          },
          {
            id: 'M4-2-t3',
            type: 'text',
            title: 'Probabilidade — Quantificando Incerteza para Decisão',
            body: 'Probabilidade é a linguagem da incerteza. Todo risco empresarial é, no fundo, uma probabilidade.\n\n**Conceitos fundamentais:**\n\n**Probabilidade Simples:** P(A) = casos favoráveis / total de casos\nSe 30 de 100 clientes recompram → P(recompra) = 30% = 0.30\n\n**Probabilidade Condicional:** P(A|B) = probabilidade de A dado que B aconteceu\nP(recompra | atendimento excelente) = 65%\nP(recompra | atendimento ruim) = 8%\nIsso muda completamente a estratégia: investir em atendimento é investir em recompra.\n\n**Teorema de Bayes — Atualizar Crenças com Evidências:**\nP(H|E) = P(E|H) × P(H) / P(E)\n\nExemplo empresarial:\nVocê acha que um produto tem 20% de chance de sucesso (prior: P(H) = 0.20)\nUm teste de mercado positivo acontece em 80% dos produtos que dão certo (P(E|H) = 0.80)\nMas também acontece em 30% dos que falham (P(E|¬H) = 0.30)\n\nApós teste positivo:\nP(sucesso|teste positivo) = (0.80 × 0.20) / (0.80 × 0.20 + 0.30 × 0.80) = 0.16 / 0.40 = 40%\n\nO teste dobrou sua confiança de 20% para 40%. Mas ainda há 60% de chance de falha. Não é certeza.\n\n**Distribuição Normal — A Curva do Sino:**\nA maioria dos fenômenos naturais e de negócios segue (aproximadamente) uma distribuição normal:\n— 68% dentro de ±1σ\n— 95% dentro de ±2σ\n— 99.7% dentro de ±3σ\n\nAplicação direta em negócios:\n— Controle de qualidade: produto fora de 3σ → defeito\n— Gestão de risco: VaR (Value at Risk) usa percentis da distribuição\n— Meta de vendas: se média = R$ 100K e σ = R$ 20K, há 84% de chance de vender acima de R$ 80K',
          },
          {
            id: 'M4-2-s1',
            type: 'simulation',
            title: 'Análise de Dados — Interprete os Números',
            simulationId: 'data-interpretation',
            description: 'Receba conjuntos de dados reais de empresas. Calcule média, mediana, desvio padrão e coeficiente de variação. Interprete o que os números significam para a decisão de negócio.',
          },
          {
            id: 'M4-2-t4',
            type: 'text',
            title: 'Regressão e Correlação — Previsão Baseada em Dados',
            body: 'Regressão é a ferramenta que permite prever uma variável a partir de outra(s). É a base de toda previsão em negócios.\n\n**Correlação (r) — Medida de associação:**\nr varia de -1 a +1\n— r = +1: correlação positiva perfeita (X sobe, Y sobe proporcionalmente)\n— r = -1: correlação negativa perfeita (X sobe, Y desce proporcionalmente)\n— r = 0: nenhuma correlação linear\n— |r| > 0.7: correlação forte\n— |r| 0.4-0.7: correlação moderada\n— |r| < 0.4: correlação fraca\n\nALERTA CRÍTICO: Correlação ≠ Causalidade\n— Venda de guarda-chuvas e acidentes de trânsito são correlacionados (r ≈ 0.7)\n— Guarda-chuvas não causam acidentes. A variável oculta é a chuva.\n\n**Regressão Linear Simples:**\nY = a + bX\nOnde:\n— Y = variável que queremos prever (vendas, receita, demanda)\n— X = variável explicativa (preço, investimento em marketing, temperatura)\n— b = coeficiente angular (para cada unidade que X muda, Y muda b unidades)\n— a = intercepto (valor de Y quando X = 0)\n\nExemplo:\nVendas = 5.000 + 3.2 × Investimento em Marketing (R$ mil)\nSe investirmos R$ 100K em marketing: Vendas = 5.000 + 320 = R$ 325K\n\n**R² — Coeficiente de Determinação:**\n"Quanto da variação de Y é explicada por X?"\nR² = 0.85 → 85% da variação nas vendas é explicada pelo investimento em marketing\nR² = 0.30 → apenas 30% — outros fatores são mais importantes\n\n**Regressão Múltipla:**\nY = a + b₁X₁ + b₂X₂ + b₃X₃\nExemplo:\nVendas = 2.000 + 2.8×Marketing + 1.5×Equipe - 0.3×Preço\n→ Cada R$ 1K em marketing gera R$ 2.8K em vendas\n→ Cada vendedor adicional gera R$ 1.5K\n→ Cada R$ 1 de aumento no preço reduz vendas em R$ 300\n\n**Na prática — Como usar no Excel/Sheets:**\n1. Organize dados em colunas (X e Y)\n2. Insira gráfico de dispersão\n3. Adicione linha de tendência (trendline)\n4. Marque "exibir equação" e "R²"\n5. Se R² > 0.6, o modelo tem poder preditivo razoável',
          },
          {
            id: 'M4-2-t5',
            type: 'text',
            title: 'Testes de Hipóteses — Como Saber se um Resultado é Real',
            body: 'Teste de hipótese é a ferramenta que responde: "Esse resultado é estatisticamente significativo ou pode ser acaso?"\n\n**O Framework:**\n\n1. Hipótese Nula (H₀): "Não há diferença/efeito"\n— H₀: A campanha de marketing NÃO aumentou as vendas\n\n2. Hipótese Alternativa (H₁): "Há diferença/efeito"\n— H₁: A campanha de marketing AUMENTOU as vendas\n\n3. Defina o nível de significância (α)\n— α = 0.05 (5%) é o padrão — aceita 5% de chance de erro\n— α = 0.01 (1%) para decisões críticas\n\n4. Calcule o p-valor\n— p < α → Rejeita H₀ → O resultado é estatisticamente significativo\n— p ≥ α → Não rejeita H₀ → Não há evidência suficiente\n\n**Exemplo prático — Teste A/B em E-commerce:**\nVersão A do site (atual): taxa de conversão = 3.2% (n = 5.000 visitantes)\nVersão B (novo layout): taxa de conversão = 3.8% (n = 5.000 visitantes)\n\nH₀: Não há diferença entre A e B\nH₁: B é melhor que A\n\nTeste Z → p-valor = 0.03\nComo 0.03 < 0.05 → Rejeitamos H₀ → B é significativamente melhor.\n\n**Erros que gestores cometem:**\n\n— Erro Tipo I (Falso Positivo): Concluir que há efeito quando não há\n"A campanha funcionou!" → Na verdade, foi coincidência sazonal\nControle: Use α baixo (0.05 ou 0.01)\n\n— Erro Tipo II (Falso Negativo): Concluir que não há efeito quando há\n"A campanha não funcionou." → Na verdade, a amostra era pequena demais para detectar\nControle: Use amostras maiores (poder estatístico)\n\n**Significância Estatística ≠ Significância Prática:**\nCom amostra grande o suficiente, qualquer diferença fica "significativa".\nSe a versão B do site converte 3.201% vs 3.200% do A, pode ser p < 0.05 com n = 10 milhões.\nMas a diferença prática é irrelevante — não vale o custo de implementar.\n\nSempre pergunte: "Além de estatisticamente significativo, é economicamente relevante?"',
          },
          {
            id: 'M4-stat-concept2',
            type: 'concept',
            term: 'Significância Estatística vs Prática',
            definition: 'Significância estatística (p < 0.05) significa que o resultado provavelmente não é acaso. Significância prática significa que a diferença é grande o suficiente para justificar ação. São coisas DIFERENTES.',
            example: 'Teste A/B com 10 milhões de visitantes: versão B converte 3.201% vs 3.200% do A. p < 0.05? Sim. Vale implementar? Não — a diferença prática é irrelevante.',
            antiExample: '"O resultado é estatisticamente significativo, então devemos mudar!" Não necessariamente. Pergunte: a diferença é economicamente relevante? O custo de implementar justifica o ganho?',
          },
          {
            id: 'M4-stat-exercise1',
            type: 'inline-exercise',
            prompt: 'Desenhe um teste A/B para uma decisão real do seu negócio.',
            context: 'Teste A/B é o método científico aplicado a negócios: hipótese → experimento controlado → análise → decisão. A maioria dos gestores "acha" em vez de testar.',
            fields: [
              { id: 'hypothesis', label: 'Qual sua hipótese?', placeholder: 'Ex: "Mudar o CTA de azul para verde aumenta a conversão"' },
              { id: 'metric', label: 'Qual a métrica-alvo?', placeholder: 'Ex: Taxa de conversão de visitante para lead (atualmente 3.2%)' },
              { id: 'sample', label: 'Qual o tamanho da amostra e o prazo?', placeholder: 'Ex: 5.000 visitantes por grupo, 14 dias mínimo' },
              { id: 'success', label: 'Qual o critério de sucesso?', placeholder: 'Ex: p < 0.05 E diferença > 0.5pp (significância estatística + prática)', multiline: true },
            ],
            evaluationCriteria: ['Hipótese é falsificável (pode ser refutada por dados)', 'Métrica é acionável (se mudar, a decisão muda)', 'Define critério de sucesso ANTES de rodar o teste', 'Considera tanto significância estatística quanto prática'],
            expectedConcepts: ['teste A/B', 'hipótese nula', 'significância estatística', 'tamanho da amostra'],
          },
          {
            id: 'M4-2-t6',
            type: 'text',
            title: 'KPIs e Métricas de Negócio — O que o Mercado Mede',
            body: 'Estatística em negócios não é sobre fórmulas — é sobre saber O QUE medir. As métricas certas dirigem decisões certas. As erradas criam ilusão de controle.\n\n**Métricas de Vaidade vs. Métricas Acionáveis:**\n— Vaidade: pageviews, seguidores, downloads (parecem bons, não mudam decisões)\n— Acionáveis: conversão, retenção, LTV, CAC (mudam decisões diretamente)\n\nTeste: "Se essa métrica mudar 20%, minha decisão muda?" Se não → vaidade.\n\n**As 15 Métricas que Todo Gestor Precisa Dominar:**\n\n**RECEITA E CRESCIMENTO**\n1. MRR (Monthly Recurring Revenue) — receita recorrente mensal. O pulso de qualquer SaaS ou assinatura.\n2. ARR (Annual Recurring Revenue) — MRR × 12. É como investidores avaliam.\n3. Revenue Growth Rate — (receita atual - anterior) / anterior × 100%. Crescimento acima de 40%/ano = "T2D3" (triple, triple, double, double, double) — meta para startups VC.\n\n**CLIENTES**\n4. CAC (Customer Acquisition Cost) — quanto custa adquirir 1 cliente. Total gasto em marketing+vendas / novos clientes.\n5. LTV (Lifetime Value) — quanto 1 cliente vale ao longo da relação. Receita média × tempo médio de permanência.\n6. LTV/CAC — a métrica mais importante de unit economics. LTV/CAC > 3 = saudável. < 1 = você PAGA para perder dinheiro.\n7. Churn Rate — % de clientes que cancelam por mês. Churn de 5%/mês = metade dos clientes some em 1 ano.\n8. NPS (Net Promoter Score) — "De 0-10, quanto você recomendaria?" Promotores (9-10) - Detratores (0-6). Acima de 50 = excelente.\n\n**FINANCEIRO**\n9. Margem Bruta — (Receita - CMV) / Receita × 100%. SaaS saudável: >70%. Varejo: 30-50%. Indústria: 20-40%.\n10. EBITDA — Lucro antes de juros, impostos, depreciação e amortização. Proxy de geração de caixa operacional.\n11. Burn Rate — quanto dinheiro a empresa queima por mês (para startups pré-lucro). Runway = caixa / burn rate = meses de sobrevivência.\n\n**OPERACIONAL**\n12. Ticket Médio — receita / número de transações. Subiu = está vendendo mais por transação.\n13. Taxa de Conversão — visitantes que compraram / total de visitantes. E-commerce bom: 2-3%. Ótimo: 5%+.\n14. Ciclo de Vendas — dias entre primeiro contato e fechamento. Quanto menor, mais eficiente.\n15. Produtividade por Funcionário — receita / número de funcionários. Benchmark para comparar com o setor.',
          },
          {
            id: 'M4-2-t7',
            type: 'text',
            title: 'Análise de Cohort — A Métrica que Separa Amadores de Profissionais',
            body: 'A maioria dos gestores olha métricas agregadas: "vendemos R$ 1M este mês". Análise de cohort olha grupos específicos ao longo do tempo — e revela verdades que o agregado esconde.\n\n**O que é um Cohort:**\nGrupo de clientes que compartilham uma característica temporal. Exemplo: "clientes que compraram em janeiro de 2025".\n\n**Por que importa:**\nMétrica agregada: "Retenção de 80%"\nAnálise de cohort revela:\n— Cohort Jan/25: 90% reteve no mês 2, 85% no mês 3, 80% no mês 4\n— Cohort Abr/25: 70% reteve no mês 2, 55% no mês 3, 40% no mês 4\n\nO agregado de 80% ESCONDE que os clientes recentes estão saindo 2x mais rápido. Sem cohort, você descobre o problema quando já perdeu milhares.\n\n**Como construir uma tabela de cohort no Excel:**\n\n1. Crie uma coluna com o mês de aquisição de cada cliente\n2. Para cada mês posterior, marque se o cliente estava ativo\n3. Monte a tabela: linhas = mês de aquisição, colunas = meses desde aquisição\n4. Calcule a % de retenção em cada célula\n\n**O que procurar:**\n— Diagonal: se a retenção do mês 1 está caindo para cohorts recentes → algo piorou (produto? onboarding? expectativa?)\n— Estabilização: se a retenção se estabiliza em 40% após o mês 6 → seus "core users" são 40% dos adquiridos\n— Sazonalidade: cohorts de dezembro podem ter comportamento diferente (Black Friday = clientes de desconto = churn alto)\n\n**Cohort aplicado a diferentes negócios:**\n— E-commerce: recompra por cohort de primeira compra\n— SaaS: retenção de MRR por cohort de signup\n— App: DAU/MAU por cohort de download\n— Varejo físico: frequência de visita por cohort de primeiro registro no programa de fidelidade\n\n**Caso real — Spotify:**\nSpotify analisa cohorts por canal de aquisição. Descobriu que usuários vindos de indicação retêm 37% mais do que vindos de ads pagos. Resultado: investiu 3x mais em programa de referral e reduziu CAC em 22%.',
          },
          {
            id: 'M4-stat-compare1',
            type: 'compare',
            title: 'Métricas de Vaidade vs Métricas Acionáveis',
            question: 'Qual métrica você usaria para tomar decisões? E qual só parece boa mas não muda nada?',
            dimensions: ['Métrica', 'O que mede', 'Por que é de vaidade ou acionável', 'Alternativa melhor'],
            items: [
              { id: 'pageviews', label: 'Pageviews', values: ['Quantas páginas foram vistas', 'Não diz se gerou valor — bots, bounces e curiosos contam', 'Métrica de vaidade'], highlight: 'Use taxa de conversão: visitantes que completaram a ação desejada.' },
              { id: 'followers', label: 'Seguidores', values: ['Quantas pessoas seguem a marca', 'Seguir ≠ comprar. 100K seguidores com 0.1% de engajamento = irrelevante', 'Métrica de vaidade'], highlight: 'Use engagement rate + conversão por canal + atribuição de receita.' },
              { id: 'ltv-cac', label: 'LTV/CAC', values: ['Quanto 1 cliente vale vs. quanto custa adquirir', 'Se LTV/CAC < 1, você PAGA para perder dinheiro. Muda decisão imediatamente.', 'Métrica acionável'], highlight: 'LTV/CAC > 3 = saudável. A métrica que investidores mais olham.' },
              { id: 'churn', label: 'Churn Rate', values: ['% de clientes que cancelam por mês', 'Churn de 5%/mês = metade dos clientes some em 1 ano. Muda prioridade da empresa.', 'Métrica acionável'], highlight: 'Retenção é o multiplicador: sem ela, aquisição é balde furado.' },
              { id: 'nps', label: 'NPS', values: ['Net Promoter Score (recomendação)', 'Promotores - Detratores. Acima de 50 = excelente. Prediz crescimento orgânico.', 'Métrica acionável'], highlight: 'NPS alto = CAC baixo (indicação reduz custo de aquisição).' },
            ],
            insight: 'Teste rápido: "Se essa métrica mudar 20%, minha decisão muda?" Se não → é vaidade. Foque nas métricas que movem decisões, não nas que movem ego.',
          },
          {
            id: 'M4-2-s2',
            type: 'simulation',
            title: 'Dashboard de KPIs — Interprete o Painel de uma Startup',
            simulationId: 'kpi-dashboard',
            description: 'Receba o dashboard real de 3 startups (SaaS, E-commerce, Marketplace). Analise os KPIs, identifique problemas escondidos nos números e proponha ações.',
          },
          {
            id: 'M4-2-t8',
            type: 'text',
            title: 'Teste A/B — O Método Científico do Marketing Digital',
            body: 'Teste A/B é o experimento controlado aplicado a negócios. É a forma mais confiável de responder: "Essa mudança funciona de verdade ou é coincidência?"\n\n**Como funciona:**\n1. Divida aleatoriamente sua audiência em dois grupos iguais\n2. Grupo A (controle): vê a versão atual\n3. Grupo B (tratamento): vê a versão nova\n4. Meça a métrica-alvo (conversão, clique, receita) por tempo suficiente\n5. Aplique teste estatístico para verificar se a diferença é significativa\n\n**Os 7 Erros Mais Comuns em Testes A/B:**\n\n1. Parar o teste cedo demais\n"Já deu 2 dias e B está ganhando!" → Flutuações estatísticas nos primeiros dias são normais. Espere atingir o tamanho de amostra calculado.\nRegra: mínimo 2 semanas E mínimo 1.000 conversões por grupo.\n\n2. Olhar o resultado todo dia e "decidir quando parece bom"\n→ Isso é p-hacking. Quanto mais vezes você olha, maior a chance de achar significância por acaso. Defina o prazo ANTES e analise SÓ no final.\n\n3. Testar muitas variáveis ao mesmo tempo\n"Mudamos o botão, o título, a cor e o preço." → Se B ganha, o que causou? Não sabe. Teste UMA variável por vez.\n\n4. Amostra muito pequena\nSe você tem 200 visitantes/dia e quer detectar diferença de 5% na conversão → precisa de ~30 dias. A maioria para em 3.\n\n5. Ignorar sazonalidade\nTestar na Black Friday e concluir que "a nova página converte melhor" → Todo mundo converte melhor na Black Friday.\n\n6. Confundir significância estatística com relevância prática\np < 0.05 com diferença de 0.01% na conversão → estatisticamente significativo, praticamente irrelevante.\n\n7. Não documentar e não compartilhar resultados negativos\nTestes que "não funcionaram" são tão valiosos quanto os que funcionaram — impedem que outros repitam o erro.\n\n**Calculando o tamanho da amostra:**\nFórmula simplificada: n = 16 × σ² / δ²\nOnde σ = desvio padrão da métrica, δ = diferença mínima que quer detectar\n\nRegra prática:\n— Conversão base 5%, quer detectar diferença de 1pp → ~3.800 por grupo\n— Conversão base 2%, quer detectar diferença de 0.5pp → ~12.300 por grupo\n\n**Ferramentas para teste A/B:**\n— Google Optimize (grátis, descontinuado mas com alternativas)\n— Optimizely, VWO, AB Tasty (pagos, enterprise)\n— Statsig, GrowthBook (developer-first, freemium)\n— Manualmente: Excel + teste Z de proporções',
          },
          {
            id: 'M4-2-t9',
            type: 'text',
            title: 'Análise Preditiva — Machine Learning para Negócios',
            body: 'Análise preditiva usa dados históricos para prever o futuro. É a evolução natural da estatística descritiva (o que aconteceu?) e inferencial (por quê?) para prescritiva (o que vai acontecer? o que devemos fazer?).\n\n**Os 3 Níveis de Analytics:**\n\n1. Descritivo: "O que aconteceu?"\n→ Dashboards, relatórios, KPIs. Olha para o passado.\n\n2. Preditivo: "O que vai acontecer?"\n→ Modelos de previsão, scoring, classificação. Olha para o futuro.\n\n3. Prescritivo: "O que devemos fazer?"\n→ Otimização, simulação, recomendação. Sugere ação.\n\n**Aplicações Práticas de Análise Preditiva em Negócios:**\n\n**Previsão de Demanda (Forecasting)**\nO que é: Estimar vendas futuras com base em dados históricos + variáveis externas\nMétodos:\n— Média móvel: média dos últimos N períodos (simples mas limitado)\n— Suavização exponencial: pesa mais os dados recentes\n— ARIMA: modelo estatístico que captura tendência + sazonalidade\n— Prophet (Meta): open source, excelente para séries com sazonalidade e feriados\nCaso: Walmart usa previsão de demanda para cada SKU em cada loja. Reduz estoque parado em 15% e rupturas em 30%.\n\n**Scoring de Crédito**\nO que é: Classificar clientes por probabilidade de pagamento\nMétodos: Regressão logística, árvore de decisão, random forest\nVariáveis: histórico de pagamento, renda, tempo de relacionamento, comportamento de compra\nCaso: Nubank usa modelos de ML para aprovar crédito em minutos, com inadimplência menor que bancos tradicionais.\n\n**Churn Prediction**\nO que é: Prever quais clientes vão cancelar antes que cancelem\nSinais preditivos: frequência de uso caindo, tickets de suporte subindo, não abrir emails, downgrade de plano\nAção: Intervenção proativa — oferecer desconto, ligar, enviar conteúdo personalizado\nCaso: Netflix prevê churn e ajusta recomendações. Cada 1% de redução no churn = US$ 800M em receita retida.\n\n**Precificação Dinâmica**\nO que é: Ajustar preço em tempo real com base em demanda, concorrência e perfil do cliente\nExemplos: Uber (surge pricing), companhias aéreas, Amazon (muda preços milhões de vezes/dia)\nMétodo: Modelos de elasticidade + otimização + dados em tempo real\n\n**Detecção de Fraude**\nO que é: Identificar transações suspeitas em tempo real\nMétodo: Anomaly detection — treinar o modelo com transações normais e detectar desvios\nCaso: Visa processa 65.000 transações/segundo com modelos que detectam fraude em 1 milissegundo.\n\n**Para gestores que não são data scientists:**\nVocê não precisa construir modelos. Precisa:\n1. Saber que problemas podem ser resolvidos com predição\n2. Saber quais dados são necessários (e se estão sendo coletados)\n3. Saber fazer as perguntas certas ao time de dados\n4. Saber avaliar se o modelo funciona (acurácia, precision, recall)\n5. Saber que nenhum modelo é perfeito — e o custo do erro importa',
          },
          {
            id: 'M4-2-t10',
            type: 'text',
            title: 'Data Storytelling — Transformar Números em Decisões',
            body: 'Dados sem narrativa são ignorados. 65% dos executivos tomam decisões baseadas em "intuição" mesmo quando dados estão disponíveis (McKinsey). O problema não é falta de dados — é falta de comunicação dos dados.\n\n**Os 3 Elementos do Data Storytelling (Brent Dykes):**\n\n1. Dados: Os fatos quantitativos (o que aconteceu)\n2. Narrativa: O contexto e significado (por que importa)\n3. Visualização: A representação gráfica (como mostrar)\n\nDados + Narrativa (sem visual) = explicação\nDados + Visualização (sem narrativa) = decoração\nNarrativa + Visualização (sem dados) = opinião\nDados + Narrativa + Visualização = Data Storytelling → decisão\n\n**Framework para apresentar dados ao CEO (Pirâmide de Minto):**\n\n1. Comece pela conclusão (não pelo contexto!)\n→ "Devemos investir R$ 500K em marketing de conteúdo. Isso gerará R$ 2.1M em 12 meses."\n\n2. Apresente os 3 argumentos de suporte\n→ "Por 3 razões: (1) CAC de conteúdo é 3x menor que paid, (2) LTV de clientes orgânicos é 2.5x maior, (3) Concorrentes estão investindo e ganhando share."\n\n3. Para cada argumento, mostre o dado\n→ Gráfico 1: CAC por canal. Gráfico 2: LTV por fonte. Gráfico 3: Share of voice vs. concorrentes.\n\n**Os 7 Gráficos que Todo Gestor Precisa Saber Usar:**\n\n1. Barras: Comparar categorias ("Receita por produto")\n2. Linhas: Mostrar tendência ao longo do tempo ("MRR dos últimos 12 meses")\n3. Pizza/Donut: Composição de um todo (máx 5 fatias) ("Market share")\n4. Scatter (dispersão): Correlação entre 2 variáveis ("Investimento em marketing × Receita")\n5. Funil: Conversão em etapas ("Visitante → Lead → Oportunidade → Cliente")\n6. Heatmap: Intensidade em 2 dimensões ("Vendas por dia × hora")\n7. Waterfall: Composição de variação ("Lucro: receita - custos - impostos")\n\n**Regras de ouro da visualização:**\n— Menos é mais: cada gráfico deve comunicar UMA ideia\n— Título = conclusão, não descrição. Não: "Vendas 2024". Sim: "Vendas cresceram 23% em 2024, lideradas pelo segmento premium"\n— Destaque o insight: use cor para chamar atenção para o que importa\n— Elimine chartjunk: sem 3D, sem sombras, sem linhas de grade desnecessárias\n— O eixo Y sempre começa em zero para barras (nunca truncar para exagerar diferença)',
          },
          {
            id: 'M4-2-t11',
            type: 'text',
            title: 'Pesquisa de Mercado — Design, Amostragem e Vieses',
            body: 'Pesquisa de mercado é a ferramenta estatística mais usada em negócios — e a mais mal usada. A maioria das pesquisas empresariais tem vieses que invalidam as conclusões.\n\n**Tipos de Pesquisa:**\n\n**Quantitativa** — números, padrões, generalização\nExemplo: Survey com 500 clientes sobre satisfação (escala 1-10)\nQuando usar: Validar hipóteses, medir tamanho de mercado, quantificar comportamento\nFerramentas: Google Forms, Typeform, SurveyMonkey, Qualtrics\n\n**Qualitativa** — profundidade, compreensão, "por quê?"\nExemplo: 20 entrevistas em profundidade sobre experiência de compra\nQuando usar: Explorar motivações, descobrir insights, entender contexto\nFerramentas: Roteiro semi-estruturado, análise temática\n\n**Amostragem — Quem perguntar?**\n\nAmostra Probabilística (rigorosa):\n— Aleatória simples: cada pessoa tem a mesma chance de ser selecionada\n— Estratificada: divide a população em grupos (ex: faixa etária) e amostra proporcionalmente\n— Por clusters: seleciona grupos inteiros (ex: 10 lojas de 50)\n\nAmostra Não-Probabilística (conveniente):\n— Conveniência: quem está disponível ("clientes que responderam o email")\n— Bola de neve: um indica o outro ("entrevistei 5, cada um indicou mais 2")\n— Intencional: seleção deliberada de perfis específicos\n\nALERTA: Pesquisa por conveniência (a mais comum em empresas) tem viés de seleção. Quem responde survey são os mais engajados — você não ouve os insatisfeitos que já foram embora.\n\n**Tamanho da Amostra — Quanto é Suficiente?**\nPara pesquisa quantitativa com margem de erro de 5% e confiança de 95%:\n— População de 1.000: amostra de 278\n— População de 10.000: amostra de 370\n— População de 100.000: amostra de 383\n— População de 1.000.000: amostra de 384\n\nObserve: a partir de 10K, o tamanho da amostra quase não muda. O que importa é a amostra absoluta, não a proporção.\n\n**Os 8 Vieses que Destroem Pesquisas:**\n\n1. Viés de seleção: Só quem quer responde → opinião enviesada\n2. Viés de desejabilidade social: Pessoas respondem o que é "correto", não o que pensam\n3. Viés de aquiescência: Tendência a concordar com qualquer afirmação\n4. Efeito de ancoragem: A primeira opção influencia as respostas seguintes\n5. Viés de memória: "Quantas vezes você usou nosso app no último mês?" — ninguém lembra com precisão\n6. Viés do sobrevivente: Pesquisar só clientes atuais ignora quem cancelou\n7. Leading questions: "Você concorda que nosso atendimento é excelente?" → induz resposta\n8. Viés de não-resposta: Quem não respondeu pode ter opinião oposta\n\n**Como desenhar uma boa pesquisa:**\n1. Defina a pergunta de negócio ANTES de criar o questionário\n2. Use linguagem neutra (não induza respostas)\n3. Limite a 10-15 perguntas (acima disso, abandono cresce exponencialmente)\n4. Comece fácil, termine com perguntas sensíveis (renda, satisfação)\n5. Teste com 5 pessoas antes de lançar (piloto)\n6. Ofereça incentivo proporcional ao esforço (mas não tão alto que distorça)',
          },
          {
            id: 'M4-2-t12',
            type: 'text',
            title: 'Excel/Sheets para Análise de Dados — O Kit de Sobrevivência',
            body: 'Você não precisa de Python ou R para 80% das análises de negócio. Excel/Google Sheets resolve. Aqui estão as funções e ferramentas essenciais.\n\n**Funções Estatísticas Essenciais:**\n\n— MÉDIA(intervalo) / AVERAGE — média aritmética\n— MED(intervalo) / MEDIAN — mediana\n— MODO(intervalo) / MODE — moda\n— DESVPAD(intervalo) / STDEV — desvio padrão\n— VAR(intervalo) / VAR — variância\n— MÁXIMO / MÍNIMO — extremos\n— CONT.VALORES / COUNTA — contar preenchidos\n— CONT.SE / COUNTIF — contar com condição\n— SOMASE / SUMIF — somar com condição\n— MÉDIASE / AVERAGEIF — média com condição\n— PERCENTIL(intervalo; k) — percentil (ex: 0.25 para Q1)\n\n**Análise de Dados (menu Dados):**\n\n— Tabela Dinâmica (Pivot Table): A ferramenta mais poderosa. Cruza qualquer variável.\nExemplo: Receita por produto × região × mês em 3 cliques.\n\n— Análise de Dados → Regressão: Gera equação, R², p-valores automaticamente.\n\n— Análise de Dados → Histograma: Distribuição visual dos dados.\n\n— CORREL(X; Y): Correlação entre duas variáveis.\n\n**Gráficos que você precisa saber criar:**\n— Gráfico de linhas com eixo secundário (receita + margem no mesmo gráfico)\n— Gráfico de barras empilhadas (composição + comparação)\n— Scatter com linha de tendência + equação + R²\n— Sparklines (mini-gráficos dentro de células)\n\n**Atalhos que economizam horas:**\n— Ctrl+Shift+L: Filtro automático\n— Alt+= : AutoSoma\n— Ctrl+T: Transformar em tabela (formatação dinâmica + referência estruturada)\n— F4: Travar referência ($A$1)\n— Ctrl+;: Data atual / Ctrl+Shift+;: Hora atual\n\n**Google Sheets — Funções exclusivas úteis:**\n— GOOGLEFINANCE("PETR4.SA"; "price") — cotação em tempo real\n— IMPORTDATA(url) — importar dados de CSV/API\n— QUERY(dados; "SELECT A, SUM(B) GROUP BY A") — SQL dentro do Sheets\n— SPARKLINE(intervalo; {"charttype","bar"}) — mini-gráfico na célula',
          },
          {
            id: 'M4-2-s3',
            type: 'simulation',
            title: 'Análise de Negócio — Do Dado à Decisão',
            simulationId: 'data-to-decision',
            description: 'Receba datasets reais de 3 empresas. Use as ferramentas estatísticas certas para diagnosticar problemas, identificar oportunidades e recomendar ações com base nos números.',
          },
          {
            id: 'M4-2-t13',
            type: 'text',
            title: 'Mapa de Ferramentas Estatísticas — Quando Usar Cada Uma',
            body: '**Resumo prático — qual ferramenta usar em cada situação:**\n\n**Média, Mediana, Moda**\nQuando: Resumir dados. Regra: assimétrico/outliers → mediana.\n\n**Desvio Padrão / CV**\nQuando: Medir consistência. CV > 30% = alta variabilidade.\n\n**Correlação**\nQuando: Verificar associação. |r| > 0.7 = forte. ≠ causalidade.\n\n**Regressão**\nQuando: Prever. R² > 0.6 = razoável. Checar resíduos.\n\n**Teste A/B / Teste de Hipótese**\nQuando: Verificar se mudança é real. p < 0.05 + relevância prática.\n\n**Análise de Cohort**\nQuando: Entender retenção ao longo do tempo. Revela problemas que agregados escondem.\n\n**KPIs de Negócio**\nQuando: Medir saúde da empresa. LTV/CAC > 3, Churn < 5%/mês, NPS > 50.\n\n**Previsão de Demanda**\nQuando: Planejar estoque, equipe, fluxo de caixa. Prophet para séries com sazonalidade.\n\n**Pesquisa de Mercado**\nQuando: Ouvir o cliente. Mín 300 respostas para quanti. 15-20 para quali.\n\n**Data Storytelling**\nQuando: Apresentar para decisores. Conclusão primeiro, dados depois, gráfico como suporte.\n\n**Excel/Sheets**\nQuando: 80% das análises de negócio. Pivot Table + CORREL + SOMASE + Gráficos.\n\n**Python/R**\nQuando: Modelos preditivos, grandes volumes de dados, automação. Pandas, scikit-learn, Prophet.',
          },
        ],
      },
    ],
  },
  {
    moduleId: 'M5',
    topics: [
      {
        id: 'M5-0',
        title: 'Leitura e Escrita Academica',
        blocks: [
          {
            id: 'M5-0-t1',
            type: 'text',
            title: 'Por que Escrita Acadêmica Importa para Negócios',
            body: 'Escrever bem não é talento — é método. No mundo corporativo, quem escreve com clareza pensa com clareza. Relatórios, propostas, emails estratégicos, business cases — tudo exige estrutura argumentativa.\n\n**A diferença entre escrita acadêmica e escrita corporativa:**\n— Acadêmica: rigor metodológico, referências, revisão por pares, linguagem formal\n— Corporativa: clareza, objetividade, ação, linguagem acessível\n— O que têm em comum: estrutura lógica, evidências, argumentação fundamentada\n\n**Por que gestores precisam dominar escrita:**\n— 73% do tempo de executivos é gasto lendo e escrevendo (McKinsey, 2023)\n— Propostas mal escritas perdem investimento — não por falta de mérito, por falta de clareza\n— Emails confusos geram retrabalho — cada email mal escrito custa em média 25 minutos de follow-up\n— Relatórios sem estrutura não são lidos — se o CEO não entende na primeira página, ele para de ler\n\n**Os 3 princípios universais da boa escrita:**\n1. Clareza: se pode ser mal interpretado, será mal interpretado. Reescreva.\n2. Concisão: se pode ser dito em menos palavras, deve ser. Corte.\n3. Estrutura: se o leitor precisa reler para entender a lógica, reorganize.',
          },
          {
            id: 'M5-esc-concept1',
            type: 'concept',
            term: 'Pirâmide de Minto',
            definition: 'Estrutura de comunicação executiva que começa pela conclusão/recomendação, seguida de 3 argumentos de suporte e depois dados. Inversa à estrutura acadêmica (que começa pelo contexto).',
            example: '"Recomendamos investir R$ 2M no Nordeste até Q3 — retorno projetado de R$ 7.5M em 3 anos." → Conclusão na primeira frase. CEO entende em 5 segundos.',
            antiExample: '"Analisamos o mercado nos últimos 6 meses. Observamos que a demanda cresce. Concorrentes investem. A oportunidade é grande. Recomendamos expandir." → Conclusão só no final — CEO parou de ler na segunda frase.',
          },
          {
            id: 'M5-esc-exercise1',
            type: 'inline-exercise',
            prompt: 'Reescreva um texto real usando a Pirâmide de Minto: conclusão primeiro, argumentos depois.',
            context: 'CEOs leem centenas de documentos por semana. Você tem 30 segundos para capturar atenção. A Pirâmide de Minto (McKinsey) é a estrutura mais usada em consultoria estratégica.',
            fields: [
              { id: 'original', label: 'Cole ou descreva um texto/email que você escreveu recentemente', placeholder: 'Ex: um email pedindo aprovação de orçamento, um relatório mensal, uma proposta...', multiline: true },
              { id: 'rewritten', label: 'Reescreva usando Minto: conclusão → 3 argumentos → dados', placeholder: 'Primeira frase = o que você quer. Depois = por quê (3 razões). Depois = evidência.', multiline: true },
            ],
            evaluationCriteria: ['Conclusão/recomendação na primeira frase', 'No máximo 3 argumentos de suporte estruturados', 'Cada argumento sustentado por dado específico', 'Texto reduzido em pelo menos 30% vs original'],
            expectedConcepts: ['Pirâmide de Minto', 'comunicação executiva', 'conclusão primeiro'],
          },
          {
            id: 'M5-0-t2',
            type: 'text',
            title: 'Leitura Crítica — Como Ler Artigos, Relatórios e Dados',
            body: 'Ler criticamente não é ler mais — é ler melhor. A maioria das pessoas lê para confirmar o que já pensa (viés de confirmação). Leitura crítica é ler para questionar.\n\n**Framework de Leitura Crítica — 5 Perguntas:**\n\n1. Qual é a tese central?\n— Em uma frase: o que o autor está argumentando?\n— Se não consegue resumir, releia. Se ainda não consegue, o texto é confuso (não você).\n\n2. Quais são as evidências?\n— Dados empíricos? Estudo de caso? Opinião de especialista? Teoria?\n— Qual o nível de evidência? (veja hierarquia de evidências em M4-03)\n\n3. Quais são as premissas implícitas?\n— O que o autor assume como verdade sem demonstrar?\n— Exemplo: "O mercado brasileiro vai crescer 5% ao ano" — baseado em quê?\n\n4. Existem contra-argumentos?\n— O autor considera perspectivas opostas ou ignora?\n— Um bom texto acadêmico sempre antecipa objeções.\n\n5. Qual a relevância para minha decisão?\n— Como isso muda o que eu penso ou faço?\n— Se não muda nada, por que estou lendo?\n\n**Técnica SQ3R para Leitura Eficiente:**\n— Survey (Varredura): leia título, subtítulos, resumo e conclusão em 3 minutos\n— Question (Perguntas): o que espero aprender? Quais minhas dúvidas?\n— Read (Leitura): leia buscando respostas para suas perguntas\n— Recite (Recapitule): feche o texto e resuma em voz alta o que entendeu\n— Review (Revisão): releia apenas os trechos que não ficaram claros\n\n**Leitura de artigos científicos — Atalho prático:**\nNão leia na ordem. Leia nesta sequência:\n1. Abstract (resumo) → O que fizeram e o que encontraram?\n2. Conclusão → O que concluem?\n3. Figuras e tabelas → Os dados confirmam a conclusão?\n4. Metodologia → Como chegaram a esses dados? É robusto?\n5. Introdução → Qual o contexto?\n\nIsso economiza 60% do tempo e foca no que importa.',
          },
          {
            id: 'M5-0-t3',
            type: 'text',
            title: 'Estrutura Argumentativa — Como Construir um Argumento Sólido',
            body: 'Todo texto persuasivo — acadêmico ou corporativo — segue uma estrutura argumentativa. Sem estrutura, é opinião. Com estrutura, é argumento.\n\n**O Modelo Toulmin — 6 Elementos do Argumento:**\n\n1. **Claim (Tese):** O que você está afirmando\n→ "A empresa deve investir em energia renovável."\n\n2. **Data (Dados):** Evidências que sustentam a tese\n→ "Empresas com matriz energética renovável têm custo 18% menor em 5 anos (McKinsey, 2024)."\n\n3. **Warrant (Justificativa):** A lógica que conecta dados à tese\n→ "Reduzir custo energético aumenta margem operacional, fortalecendo a competitividade."\n\n4. **Backing (Suporte):** Evidência adicional que reforça a justificativa\n→ "No setor têxtil, 3 dos 5 líderes globais já operam com 70%+ renovável."\n\n5. **Qualifier (Qualificador):** Grau de certeza\n→ "Na maioria dos cenários..." / "Com alta probabilidade..." (evite "sempre" e "nunca")\n\n6. **Rebuttal (Contra-argumento):** Objeções reconhecidas e respondidas\n→ "Embora o investimento inicial seja alto (R$ 2M), o payback ocorre em 3.2 anos."\n\n**Aplicação em documentos corporativos:**\n\nBusiness Case:\n— Tese: "Devemos expandir para o mercado X"\n— Dados: tamanho do mercado, taxa de crescimento, análise competitiva\n— Justificativa: alinhamento com estratégia + retorno projetado\n— Contra-argumento: riscos e mitigações\n\nEmail estratégico:\n— Primeira frase: o que você quer (tese)\n— Segundo parágrafo: por que (dados + justificativa)\n— Terceiro parágrafo: próximos passos (ação)\n\n**A regra de ouro: Se você não consegue escrever sua tese em uma frase, você não sabe o que está argumentando.**',
          },
          {
            id: 'M5-esc-framework1',
            type: 'framework',
            frameworkId: 'toulmin-argument',
            title: 'Construa um Argumento com o Modelo Toulmin',
            description: 'Pegue uma recomendação que você precisa fazer (investimento, mudança, contratação) e estruture usando os 6 elementos do Modelo Toulmin. Se algum campo ficar vazio, seu argumento tem um buraco.',
            fields: [
              { id: 'claim', label: '1. Tese (Claim): O que você está afirmando?', placeholder: 'Ex: "A empresa deve investir em energia renovável"', helpText: 'Se não cabe em uma frase, você não sabe o que está argumentando.' },
              { id: 'data', label: '2. Dados (Data): Quais evidências sustentam?', placeholder: 'Ex: "Empresas com matriz renovável têm custo 18% menor em 5 anos (McKinsey, 2024)"', helpText: 'Dados > opinião. Números > adjetivos. Fontes > "todo mundo sabe".' },
              { id: 'warrant', label: '3. Justificativa (Warrant): Qual a lógica que conecta dados à tese?', placeholder: 'Ex: "Reduzir custo energético aumenta margem, fortalecendo competitividade"', helpText: 'Se a conexão não é óbvia, explicite. O leitor não vai fazer o trabalho por você.' },
              { id: 'qualifier', label: '4. Qualificador: Qual o grau de certeza?', placeholder: 'Ex: "Na maioria dos cenários..." ou "Com 85% de probabilidade..."', helpText: 'Evite "sempre" e "nunca". Qualificar mostra maturidade intelectual.' },
              { id: 'rebuttal', label: '5. Contra-argumento: Quais objeções reconhece?', placeholder: 'Ex: "Investimento inicial alto (R$ 2M), mas payback em 3.2 anos"', helpText: 'Antecipar objeções FORTALECE seu argumento. Ignorá-las o enfraquece.' },
            ],
          },
          {
            id: 'M5-esc-concept2',
            type: 'concept',
            term: 'Modelo Toulmin',
            definition: 'Estrutura argumentativa com 6 elementos: Tese (o que defende), Dados (evidências), Justificativa (lógica que conecta), Suporte (reforço), Qualificador (grau de certeza) e Contra-argumento (objeções antecipadas).',
            example: 'Business case: Tese = "expandir para o Nordeste". Dados = "mercado cresceu 22%/ano". Justificativa = "first-mover advantage". Contra-argumento = "logística é desafio, mas piloto em Recife validou em 6 meses".',
            antiExample: '"Devemos expandir porque eu acho que vai dar certo" — sem dados, sem justificativa, sem contra-argumento. Isso é opinião, não argumento.',
          },
          {
            id: 'M5-0-s1',
            type: 'simulation',
            title: 'Construtor de Argumentos — Monte um Business Case',
            simulationId: 'argument-builder',
            description: 'Receba 4 cenários empresariais e construa o argumento completo usando o Modelo Toulmin: tese, dados, justificativa, suporte, qualificador e contra-argumento.',
          },
          {
            id: 'M5-0-t4',
            type: 'text',
            title: 'Escrita Acadêmica na Prática — Do Fichamento ao Artigo',
            body: 'A escrita acadêmica segue convenções que garantem rigor e reprodutibilidade. Mesmo que você não vá publicar papers, dominar essas convenções melhora qualquer documento profissional.\n\n**Tipos de texto acadêmico e equivalentes corporativos:**\n— Fichamento → Executive Summary / Resumo Executivo\n— Resenha Crítica → Análise de Mercado / Due Diligence\n— Artigo Científico → White Paper / Relatório de Pesquisa\n— Monografia/TCC → Business Plan / Plano Estratégico\n\n**Estrutura IMRAD — O padrão universal:**\n\n**I — Introdução (Por quê?)**\nO que é o problema? Por que importa? O que já foi estudado? Qual o gap? Qual sua tese?\nCorporativo: "O mercado de X está crescendo 15%/ano, mas nossa participação caiu 3pp. Este relatório propõe..."\n\n**M — Metodologia (Como?)**\nComo você investigou? Quais dados usou? Qual o método de análise?\nCorporativo: "Analisamos dados de vendas de 24 meses + 30 entrevistas com clientes + benchmark de 5 concorrentes."\n\n**R — Resultados (O quê?)**\nO que você encontrou? Apresente dados sem interpretar.\nCorporativo: tabelas, gráficos, números puros.\n\n**A — Análise/Discussão (E daí?)**\nO que os resultados significam? Como se comparam com o esperado? Quais as implicações?\nCorporativo: "Os dados mostram que 62% da perda de market share vem do segmento jovem. Isso sugere..."\n\n**D — Conclusão (Então?)**\nResumo das descobertas + recomendações concretas.\nCorporativo: "Recomendamos 3 ações: (1)... (2)... (3)... com investimento de R$ X e retorno projetado de Y."\n\n**Normas ABNT — O Essencial:**\n— Citação direta curta (até 3 linhas): entre aspas, no corpo do texto, com (AUTOR, ano, p. XX)\n— Citação direta longa (4+ linhas): recuo de 4cm, sem aspas, fonte menor\n— Citação indireta (paráfrase): sem aspas, com (AUTOR, ano)\n— Referências: no final, em ordem alfabética, formato ABNT NBR 6023\n— Formato: Times New Roman 12, espaçamento 1.5, margens 3cm (superior/esquerda) e 2cm (inferior/direita)',
          },
          {
            id: 'M5-0-t5',
            type: 'text',
            title: 'Erros de Escrita que Destroem Credibilidade',
            body: '**Os 10 erros mais comuns em textos corporativos e acadêmicos:**\n\n1. **Falta de tese clara** → O leitor chega ao final sem saber o que você defende\nCorreção: Primeira frase do texto = sua tese. Sempre.\n\n2. **Parágrafos sem tópico frasal** → Parágrafo que começa com contexto em vez da ideia principal\nCorreção: Primeira frase de cada parágrafo = a ideia principal daquele parágrafo.\n\n3. **Citações sem análise** → Jogar citação e seguir em frente\nCorreção: Cite → Explique → Conecte com seu argumento. Nunca cite só para citar.\n\n4. **Linguagem vaga** → "Várias empresas", "muitos estudos", "acredita-se que"\nCorreção: "42 das 100 maiores empresas" (especifique), "Smith (2023) demonstrou" (cite a fonte)\n\n5. **Repetição de ideias** → Dizer a mesma coisa com palavras diferentes 3 vezes\nCorreção: Diga uma vez, com clareza. Se precisa repetir, o primeiro texto está fraco.\n\n6. **Excesso de jargão** → Termos técnicos que o leitor não conhece\nCorreção: Use jargão apenas quando o público é técnico. Na dúvida, explique.\n\n7. **Falta de transições** → Parágrafos soltos, sem conexão lógica\nCorreção: Use conectivos: "No entanto", "Além disso", "Em contraste", "Como resultado"\n\n8. **Conclusão que repete a introdução** → Copiar e colar o que já disse\nCorreção: Conclusão = síntese + implicações + recomendações + próximos passos\n\n9. **Plágio acidental** → Parafrasear sem citar a fonte\nCorreção: Toda ideia que não é sua precisa de referência. Sempre.\n\n10. **Não revisar** → Entregar o primeiro rascunho\nCorreção: Regra dos 3 passes — (1) Estrutura está lógica? (2) Argumento é sólido? (3) Gramática e formatação.',
          },
          {
            id: 'M5-esc-compare1',
            type: 'compare',
            title: 'Tipos de Documento Executivo — Qual Usar?',
            question: 'Você precisa comunicar uma recomendação. Qual formato escolher?',
            dimensions: ['Para que serve', 'Extensão', 'Estrutura', 'Quando usar'],
            items: [
              { id: 'memo', label: 'Memo', values: ['Decisões rápidas', '1 página', 'Contexto (2 linhas) → Recomendação → 3 razões → Próximos passos', 'Aprovação de orçamento, mudança de processo, decisão binária'], highlight: 'Se não cabe em 1 página, você não pensou o suficiente.' },
              { id: 'exec-summary', label: 'Executive Summary', values: ['Resumir relatório longo', '2-3 páginas', 'Objetivo → Descobertas → Recomendações → Impacto financeiro', 'Relatórios trimestrais, due diligence, pesquisa de mercado'], highlight: 'Quem lê SÓ o summary deve ter 80% da informação.' },
              { id: 'deck', label: 'Deck/Apresentação', values: ['Pitch, board, planejamento', '10-15 slides', '1 ideia por slide. 10/20/30 (Kawasaki)', 'Board meeting, pitch para investidor, kickoff de projeto'], highlight: 'Nunca leia o slide. Você fala o que NÃO está nele.' },
              { id: 'email', label: 'Email Estratégico', values: ['Ação imediata', '5 linhas', 'O que quer → Por quê → Próximo passo com data', 'Pedidos, alinhamentos, follow-ups'], highlight: 'Se precisa de mais de 1 scroll, deveria ser documento anexo.' },
            ],
            insight: 'Formato errado = mensagem ignorada. Um email de 3 páginas não é lido. Um memo sobre assunto complexo não convence. Escolha o formato que respeita o tempo do leitor.',
          },
          {
            id: 'M5-0-t6',
            type: 'text',
            title: 'Comunicação Executiva — Como Escrever para Quem Decide',
            body: 'CEOs e diretores leem centenas de documentos por semana. Eles não vão ler o seu inteiro. Você tem 30 segundos para capturar atenção e 2 minutos para convencer.\n\n**Pirâmide de Minto (Barbara Minto, McKinsey):**\nA estrutura mais poderosa para comunicação executiva. Começa pela conclusão, não pelo contexto.\n\n**Estrutura:**\n1. Conclusão/Recomendação (primeira frase!)\n2. 3 argumentos-chave de suporte\n3. Dados que sustentam cada argumento\n\n**Exemplo ruim:**\n"Analisamos o mercado nos últimos 6 meses. Observamos que a demanda está crescendo. Nossos concorrentes estão investindo. A oportunidade é grande. Por isso, recomendamos expandir."\n→ Só chegou na recomendação na última frase. O CEO já parou de ler na segunda.\n\n**Exemplo bom (Minto):**\n"Recomendamos investir R$ 2M na expansão para o Nordeste até Q3, com retorno projetado de R$ 7.5M em 3 anos.\n\nTrês razões:\n1. Mercado nordestino cresceu 22%/ano — 3x a média nacional (ABF 2024)\n2. Zero concorrente premium na região-alvo — janela de first-mover de ~18 meses\n3. Modelo operacional de SP é replicável com ajustes mínimos — piloto em Recife validou em 6 meses"\n\n→ Conclusão na primeira frase. Argumentos estruturados. Dados específicos.\n\n**Tipos de documento executivo:**\n\n**Memo (1 página):**\nPara: decisões rápidas\nEstrutura: Contexto (2 linhas) → Recomendação → 3 razões → Próximos passos\nRegra: Se não cabe em 1 página, você não pensou o suficiente.\n\n**Executive Summary (2-3 páginas):**\nPara: resumir relatório longo\nEstrutura: Objetivo → Principais descobertas (bullets) → Recomendações → Impacto financeiro\nRegra: Alguém que leia SÓ o summary deve ter 80% da informação.\n\n**Deck/Apresentação (10-15 slides):**\nPara: pitch, board meeting, planejamento\nEstrutura (Guy Kawasaki 10/20/30): 10 slides, 20 minutos, fonte mínima 30pt\nRegra: 1 ideia por slide. Se precisa de animação para explicar, o slide é complexo demais.\n\n**Email estratégico (5 linhas):**\nLinha 1: O que você quer\nLinha 2-3: Por que (1 frase por razão)\nLinha 4: Próximo passo com data\nLinha 5: Agradecimento\nRegra: Se o email tem mais de 1 scroll, deveria ser um documento anexo.',
          },
          {
            id: 'M5-0-t7',
            type: 'text',
            title: 'Tipos de Pesquisa Acadêmica — Qual Método Usar?',
            body: 'Cada pergunta de pesquisa exige um método diferente. Usar o método errado invalida todo o estudo.\n\n**Pesquisa Exploratória — "O que está acontecendo?"**\nObjetivo: Entender fenômeno pouco conhecido. Gerar hipóteses.\nMétodos: Entrevistas em profundidade, observação participante, grupos focais, revisão bibliográfica\nQuando usar: Início de projeto. Não sabe nem as perguntas certas.\nExemplo: "Por que clientes abandonam o carrinho?" → Entrevistar 20 clientes que abandonaram.\nResultado: Hipóteses, não conclusões.\n\n**Pesquisa Descritiva — "Qual o tamanho, perfil e comportamento?"**\nObjetivo: Descrever uma população ou fenômeno com precisão.\nMétodos: Survey (questionário), censo, dados secundários\nQuando usar: Quando já sabe o que perguntar. Precisa quantificar.\nExemplo: "Qual a taxa de abandono de carrinho por faixa etária?" → Survey com 2.000 clientes.\nResultado: Números, percentuais, distribuições.\n\n**Pesquisa Causal (Experimental) — "X causa Y?"**\nObjetivo: Estabelecer relação de causa e efeito.\nMétodos: Experimento controlado, teste A/B, quasi-experimento\nQuando usar: Precisa provar que uma mudança específica gera um resultado específico.\nExemplo: "Frete grátis reduz abandono?" → Teste A/B com grupo controle.\nResultado: Evidência causal (não apenas correlação).\n\n**Pesquisa-Ação — "Como resolver este problema enquanto estudo?"**\nObjetivo: Resolver problema prático E gerar conhecimento acadêmico simultaneamente.\nMétodos: Ciclos de ação-reflexão com a organização.\nQuando usar: TCC, MBA, projetos de consultoria-acadêmica.\nExemplo: Implementar Lean numa fábrica, medir resultados e documentar aprendizados.\n\n**Estudo de Caso — "Como funciona este caso específico?"**\nObjetivo: Análise profunda de um caso (empresa, projeto, evento).\nMétodos: Entrevistas, documentos, observação, triangulação de fontes.\nQuando usar: Fenômenos complexos que não podem ser isolados em laboratório.\nExemplo: "Como a Nubank democratizou o crédito no Brasil?" → Análise profunda de estratégia, dados e contexto.\n\n**Revisão Sistemática / Meta-análise — "O que a ciência já sabe?"**\nObjetivo: Sintetizar TODOS os estudos existentes sobre um tema.\nMétodos: Busca em bases (Scopus, Web of Science), critérios de inclusão/exclusão, síntese.\nQuando usar: Antes de qualquer pesquisa primária. Evita reinventar a roda.',
          },
          {
            id: 'M5-0-t8',
            type: 'text',
            title: 'Apresentações de Alto Impacto — Storytelling com Dados',
            body: 'Apresentar não é ler slides. É conduzir uma narrativa que move pessoas à ação.\n\n**Estrutura Narrativa para Apresentações (Nancy Duarte, TED):**\n\n**O que é → O que poderia ser → O que é → O que poderia ser → Call to action**\n\nAlterna entre o status quo (realidade) e a possibilidade (visão), criando tensão e desejo de mudança.\n\nExemplo — Pitch de produto:\n— "Hoje, 65% das PMEs fazem gestão financeira em planilha." (o que é)\n— "Imagine se cada decisão financeira fosse baseada em dados em tempo real." (o que poderia ser)\n— "Mas a realidade é que 73% dos empresários descobrem problemas de caixa quando já é tarde." (o que é)\n— "Com nossa plataforma, eles veem o problema 30 dias antes de acontecer." (o que poderia ser)\n— "Junte-se a nós. Estamos abrindo rodada de R$ 5M para levar isso a 10.000 empresas." (call to action)\n\n**Design de Slides — Menos é Exponencialmente Mais:**\n\n— Regra 1×1: 1 ideia por slide, 1 visual por slide\n— Regra dos 3 segundos: se o público não entende o slide em 3 segundos, refaça\n— Texto: máximo 6 palavras no título. Resto é visual ou bullet curto.\n— Números: destaque O NÚMERO, não a frase. "Crescemos 340%" deve ter 340% grande e o resto pequeno.\n— Cores: máximo 3. Fundo escuro para apresentação presencial, claro para documento.\n\n**Os 7 Tipos de Slide que Você Precisa:**\n1. Título: 1 frase impactante + sua proposta\n2. Problema: estatística chocante + visual\n3. Solução: antes/depois ou demonstração\n4. Dados: 1 gráfico, 1 insight, 1 conclusão\n5. Prova social: logos de clientes, depoimentos, métricas\n6. Timeline: 3-5 marcos com datas\n7. Call to action: o que você quer que o público faça AGORA\n\n**Dicas de performance:**\n— Primeiros 30 segundos: ganhe ou perca a audiência. Comece com dado surpreendente, pergunta provocativa ou história.\n— Nunca leia o slide. O slide é para o público. Você fala o que NÃO está no slide.\n— Contato visual: 3-5 segundos por pessoa. Não fale para a tela.\n— Silêncio é poder: pause 2 segundos após um dado impactante. Deixe absorver.\n— Encerre com ação, não com "obrigado". "Obrigado" é passivo. "Vamos começar na segunda?" é ativo.',
          },
          {
            id: 'M5-0-t9',
            type: 'text',
            title: 'Revisão Bibliográfica — Como Fazer em 7 Passos',
            body: 'A revisão bibliográfica é a fundação de qualquer trabalho acadêmico. Não é listar autores — é mapear o que já se sabe e identificar o que falta.\n\n**Os 7 Passos da Revisão Bibliográfica:**\n\n**1. Defina a pergunta de pesquisa**\n— Não: "Inovação nas empresas" (vago demais)\n— Sim: "Como a cultura organizacional influencia a adoção de inovação aberta em PMEs brasileiras?" (específico)\n\n**2. Escolha as bases de dados**\n— Internacionais: Scopus, Web of Science, Google Scholar, PubMed (saúde)\n— Brasileiras: SciELO, Periódicos CAPES, BDTD (teses e dissertações)\n— Negócios: SSRN, Harvard Business Review, MIT Sloan Management Review\n\n**3. Defina os termos de busca**\n— Use operadores booleanos: AND, OR, NOT\n— Exemplo: ("open innovation" OR "inovação aberta") AND ("organizational culture" OR "cultura organizacional") AND ("SME" OR "PME" OR "small business")\n— Teste em inglês E português — a maioria dos estudos relevantes está em inglês\n\n**4. Aplique critérios de inclusão/exclusão**\n— Período: últimos 10 anos (salvo clássicos)\n— Idioma: português e inglês\n— Tipo: artigos revisados por pares, teses, livros\n— Excluir: editoriais, notas de congresso sem peer review, blogs\n\n**5. Leia e fichare sistematicamente**\nPara cada artigo:\n— Referência completa (ABNT)\n— Objetivo do estudo\n— Metodologia usada\n— Principais resultados\n— Como se conecta com sua pesquisa\n— Citação relevante (com página)\n\n**6. Organize por temas, não por autor**\n— Errado: "Fulano (2020) diz X. Ciclano (2021) diz Y. Beltrano (2022) diz Z."\n— Certo: "A relação entre cultura e inovação é mediada por 3 fatores: autonomia (Fulano, 2020; Ciclano, 2021), tolerância ao erro (Beltrano, 2022) e comunicação aberta (Silva, 2023)."\n\n**7. Identifique o gap**\n— O que a literatura NÃO respondeu?\n— Onde há contradição entre autores?\n— Qual contexto foi pouco estudado?\n— Este gap justifica sua pesquisa.\n\n**Ferramentas essenciais:**\n— Mendeley ou Zotero: gerenciador de referências (gratuitos)\n— Connected Papers: mapa visual de artigos relacionados\n— Semantic Scholar: busca por relevância semântica\n— Elicit: IA que encontra e resume artigos acadêmicos',
          },
          {
            id: 'M5-0-s2',
            type: 'simulation',
            title: 'Revisão e Correção — Melhore Este Texto',
            simulationId: 'text-review',
            description: 'Receba 4 trechos de textos corporativos com erros de argumentação, estrutura e clareza. Identifique os problemas e reescreva aplicando as técnicas aprendidas.',
          },
          {
            id: 'M5-0-t10',
            type: 'text',
            title: 'Mapa de Ferramentas — Escrita e Comunicação',
            body: '**Resumo — quando usar cada ferramenta:**\n\n**Modelo Toulmin (Argumentação)**\nQuando: Construir qualquer argumento — business case, proposta, relatório\nComo: Tese + Dados + Justificativa + Suporte + Qualificador + Contra-argumento\n\n**Pirâmide de Minto (Comunicação Executiva)**\nQuando: Escrever para quem decide — CEO, board, investidor\nComo: Conclusão primeiro → 3 argumentos → dados de suporte\n\n**IMRAD (Escrita Acadêmica)**\nQuando: Artigo, relatório de pesquisa, white paper\nComo: Introdução → Metodologia → Resultados → Análise → Conclusão\n\n**SQ3R (Leitura Eficiente)**\nQuando: Ler artigo, relatório ou livro técnico com eficiência\nComo: Survey → Question → Read → Recite → Review\n\n**Nancy Duarte (Apresentações)**\nQuando: Apresentar para convencer — pitch, board, conferência\nComo: O que é → O que poderia ser → alternância → Call to action\n\n**ABNT (Formatação Acadêmica)**\nQuando: TCC, artigo, dissertação no Brasil\nComo: Citações diretas/indiretas + Referências em ordem alfabética\n\n**Revisão em 3 Passes**\nQuando: Antes de entregar QUALQUER texto\nComo: (1) Estrutura lógica? (2) Argumento sólido? (3) Gramática e formato\n\n**Regra do email de 5 linhas**\nQuando: Email que precisa de ação\nComo: O que quer → Por quê (2 frases) → Próximo passo com data → Fechamento',
          },
        ],
      },
      {
        id: 'M5-1',
        title: 'Empreendedorismo e Inovacao',
        blocks: [
          {
            id: 'M5-1-t1',
            type: 'text',
            title: 'Empreendedorismo — O que É e O que Não É',
            body: 'Empreendedorismo não é "abrir empresa". É identificar oportunidades e criar valor onde antes não existia — com recursos limitados e sob incerteza.\n\n**Definições que importam:**\n— Schumpeter: Empreendedor é o agente da "destruição criativa" — destrói o velho para criar o novo\n— Drucker: Empreendedorismo é a prática de transformar recursos em riqueza por meio de uma nova capacidade de criação\n— Sarasvathy: Empreendedores não preveem o futuro — eles o constroem (Effectuation)\n\n**Mitos do empreendedorismo:**\n\nMito 1: "Empreendedores nascem prontos"\nRealidade: Empreendedorismo é habilidade treinável. Pesquisa do MIT mostra que treinamento formal aumenta probabilidade de sucesso em 2.5x.\n\nMito 2: "Precisa de uma ideia genial"\nRealidade: 90% dos negócios de sucesso não são ideias originais — são execuções superiores de ideias existentes. McDonald\'s não inventou o hambúrguer.\n\nMito 3: "Precisa de muito dinheiro"\nRealidade: 70% das startups do Vale do Silício começaram com menos de US$ 10K. Bootstrapping é a norma, não a exceção.\n\nMito 4: "Empreendedores amam risco"\nRealidade: Bons empreendedores GERENCIAM risco. Calculam, mitigam e assumem risco calculado — não risco cego.\n\n**Tipos de empreendedorismo:**\n— Por oportunidade: identifica gap no mercado e cria solução (startup, inovação)\n— Por necessidade: empreende por falta de emprego (autônomos, MEIs)\n— Intraempreendedorismo: empreender dentro de uma organização existente\n— Social: resolver problemas sociais de forma sustentável (Grameen Bank, Ashoka)\n\n**Empreendedorismo no Brasil — Números reais:**\n— 53 milhões de empreendedores ativos (GEM, 2024) — 1 a cada 3 adultos\n— 70% são empreendedores por necessidade, não por oportunidade\n— Taxa de mortalidade: 29% das empresas fecham em até 5 anos (IBGE)\n— Causas principais de falência: falta de gestão financeira (82%), falta de planejamento (72%), falta de capacitação (55%)\n— MEI: 15 milhões de cadastros ativos — maior programa de formalização do mundo\n\n**Cases brasileiros de empreendedorismo por oportunidade:**\n— Nubank (2013): David Vélez identificou que brasileiros odiavam seus bancos → 100M+ clientes, US$ 45B valuation\n— Hotmart (2011): João Pedro Resende viu que criadores de conteúdo não tinham plataforma de monetização → líder em infoprodutos na AL\n— NotCo (2015): IA para criar alimentos plant-based → presente em 8 países\n— Quinto Andar (2013): alugar imóvel no Brasil era burocrático e inseguro → digitalizou tudo, US$ 5B valuation\n\nPergunta-chave: Você está empreendendo por oportunidade ou por necessidade? A resposta muda completamente a estratégia, o ritmo e o tipo de apoio que você precisa.',
          },
          {
            id: 'M5-emp-concept1',
            type: 'concept',
            term: 'Destruição Criativa (Schumpeter)',
            definition: 'Processo pelo qual inovações destroem modelos de negócio existentes para criar novos. O empreendedor é o agente dessa destruição — transforma o mercado ao criar valor onde antes não existia.',
            example: 'O Nubank destruiu o modelo de banco com agências ao criar banco 100% digital sem tarifas. Itaú e Bradesco perderam milhões de clientes — a destruição criativa em ação.',
            antiExample: 'Abrir uma padaria igual às outras do bairro NÃO é destruição criativa. É réplica. Empreendedorismo schumpeteriano exige criar algo que mude a lógica do mercado.',
          },
          {
            id: 'M5-emp-decision1',
            type: 'decision',
            scenario: 'Você tem uma ideia para um app de gestão financeira para MEIs. Tem R$ 30K em economias, conhecimento técnico e rede de contatos com pequenos empresários. O que faz primeiro?',
            options: [
              { label: 'Escrever business plan detalhado e buscar investidor', tradeoffs: { upside: 'Planejamento completo antes de gastar', downside: 'Meses planejando sem validar se alguém quer o produto', risk: 'medium' as const } },
              { label: 'Construir MVP em 30 dias e testar com 50 MEIs', tradeoffs: { upside: 'Validação rápida com dados reais de mercado', downside: 'MVP pode estar feio/incompleto e afastar primeiros usuários', risk: 'low' as const } },
              { label: 'Investir os R$ 30K em produto completo antes de lançar', tradeoffs: { upside: 'Produto polido na primeira impressão', downside: 'Se ninguém quiser, perdeu R$ 30K e meses de trabalho', risk: 'high' as const } },
              { label: 'Entrevistar 30 MEIs primeiro para validar o problema', tradeoffs: { upside: 'Custo zero, valida se o problema existe antes de construir', downside: 'Entrevistas consomem tempo e não provam que pagarão', risk: 'low' as const } },
            ],
            realWorldAnalog: 'Zappos (maior loja de sapatos online) começou SEM estoque: o fundador fotografava sapatos em lojas, postava online e comprava quando alguém pedia. Validou demanda com custo quase zero.',
            lesson: 'Effectuation: comece com o que tem (quem sou, o que sei, quem conheço). O maior risco não é falhar na execução — é construir algo que ninguém quer. Valide antes de investir.',
          },
          {
            id: 'M5-1-t2',
            type: 'text',
            title: 'Effectuation vs. Causation — Duas Lógicas de Empreender',
            body: 'Saras Sarasvathy (Universidade de Virginia) estudou como empreendedores experientes realmente pensam. Descobriu que a lógica é OPOSTA ao que se ensina na escola de negócios.\n\n**Causation (Planejamento Tradicional):**\n"Defina o objetivo → Planeje → Execute → Meça"\nLógica: Prever o futuro e se preparar para ele.\nFerramentas: Business plan, pesquisa de mercado, projeções financeiras\nFunciona quando: Mercado estável, informação disponível, baixa incerteza\n\n**Effectuation (Lógica Empreendedora):**\n"Com o que eu tenho → O que posso criar? → Teste → Adapte"\nLógica: Não prever o futuro — construí-lo com os recursos disponíveis.\n\n**Os 5 Princípios do Effectuation:**\n\n1. Pássaro na Mão (Bird-in-Hand)\n— Comece com o que você TEM: quem sou, o que sei, quem conheço\n— Não espere o recurso ideal. Use o recurso disponível.\n— Exemplo: A Airbnb começou porque os fundadores tinham um apartamento com quarto vazio e uma conferência lotando os hotéis da cidade.\n\n2. Perda Aceitável (Affordable Loss)\n— Não pergunte "quanto posso ganhar?" Pergunte: "quanto posso perder sem me destruir?"\n— Invista apenas o que pode perder. Isso elimina a paralisia.\n— Exemplo: Teste um MVP com R$ 5K em vez de investir R$ 500K num produto perfeito.\n\n3. Colcha de Retalhos (Crazy Quilt)\n— Construa parcerias com quem se compromete ANTES de ter o plano pronto\n— Cada parceiro traz novos recursos e muda o rumo do projeto — e isso é bom.\n\n4. Limonada (Lemonade)\n— Surpresas não são falhas — são oportunidades.\n— O Post-it nasceu de um adesivo que "falhou" — não colava permanentemente.\n— Slack nasceu como ferramenta interna de comunicação de um jogo que fracassou.\n\n5. Piloto do Avião (Pilot-in-the-Plane)\n— O futuro não é algo a ser previsto. É algo a ser criado pelas suas ações.\n— Você controla o que faz, não o que o mercado faz.\n\n**Quando usar qual:**\n— Causation: expansão de negócio existente, mercados maduros, decisões com dados\n— Effectuation: novo negócio, mercados incertos, early-stage, inovação radical',
          },
          {
            id: 'M5-1-t3',
            type: 'text',
            title: 'Lean Startup — Construir, Medir, Aprender',
            body: 'Eric Ries (2011) sistematizou o método que a maioria das startups de sucesso usa (conscientemente ou não).\n\n**O Problema que o Lean Resolve:**\nO maior risco de um novo negócio NÃO é falhar na execução. É construir algo que ninguém quer. 42% das startups falham por "falta de necessidade de mercado" (CB Insights).\n\n**O Ciclo Build-Measure-Learn:**\n\n**1. Build (Construir) — MVP**\nMínimo Produto Viável: a versão mais simples que permite testar a hipótese principal.\n— NÃO é o produto final com menos funcionalidades\n— É o experimento mais barato para aprender se a hipótese é verdadeira\n\nExemplos de MVP:\n— Dropbox: vídeo de 3 minutos mostrando como funcionaria. 75.000 inscritos na lista de espera em uma noite. Zero código.\n— Zappos: o fundador foi a lojas, fotografou sapatos, postou online. Quando alguém comprava, ele ia à loja comprar e enviava. Validou a demanda sem estoque.\n— Buffer: uma landing page com preços. Se a pessoa clicava em "assinar", aparecia "ainda não estamos prontos, deixe seu email". Mediu interesse real.\n\n**2. Measure (Medir) — Métricas que Importam**\nMétricas de vaidade: downloads, pageviews, seguidores (parecem bons, não dizem nada)\nMétricas acionáveis: taxa de conversão, retenção D7, LTV/CAC, NPS\n\nA pergunta: "Se essa métrica mudar, minha decisão muda?" Se não → métrica de vaidade.\n\n**3. Learn (Aprender) — Pivotar ou Perseverar**\nCom os dados do experimento:\n— Hipótese validada → Persevere. Escale.\n— Hipótese invalidada → Pivote. Mude a abordagem.\n\nPivot não é fracasso. É aprendizado aplicado. Instagram começou como Burbn (check-in app). Twitter começou como Odeo (plataforma de podcast). Slack começou como jogo online.\n\n**Canvas de Experimento — Template Prático:**\n1. Hipótese: "Acreditamos que [segmento] tem o problema [X]"\n2. Teste: "Vamos testar com [MVP] durante [prazo]"\n3. Métrica: "Sucesso = [métrica acionável] acima de [threshold]"\n4. Resultado: [dados reais]\n5. Decisão: Pivotar / Perseverar / Novo teste',
          },
          {
            id: 'M5-emp-framework1',
            type: 'framework',
            frameworkId: 'experiment-canvas',
            title: 'Canvas de Experimento — Desenhe Seu Primeiro Teste',
            description: 'Antes de construir, teste. Use este canvas para transformar sua ideia em experimento validável. Se não pode definir o critério de sucesso, não está pronto para testar.',
            fields: [
              { id: 'hypothesis', label: 'Hipótese: O que acredita ser verdade?', placeholder: 'Ex: "Acreditamos que MEIs têm dificuldade em controlar fluxo de caixa e pagariam R$ 49/mês por uma solução simples"', helpText: 'A hipótese deve ser falsificável — deve existir um resultado que prove que está errada.' },
              { id: 'mvp', label: 'MVP: Qual o teste mais simples?', placeholder: 'Ex: Landing page com proposta + botão "Quero testar" + formulário de email', helpText: 'O MVP não é o produto mínimo — é o experimento mais barato para aprender.' },
              { id: 'metric', label: 'Métrica: Como medir sucesso?', placeholder: 'Ex: >10% de conversão na landing page = interesse real', helpText: 'Métrica de vaidade: "100 pessoas viram". Métrica acionável: "15 deixaram email e 5 agendaram demo".' },
              { id: 'timeline', label: 'Prazo: Quanto tempo para rodar o teste?', placeholder: 'Ex: 14 dias, investimento máximo de R$ 500 em ads', helpText: 'Se o teste leva mais de 30 dias, simplifique. Velocidade de aprendizado é tudo.' },
              { id: 'decision', label: 'Decisão: O que faz se validar? E se não validar?', placeholder: 'Ex: Se >10% → construir MVP funcional. Se <5% → pivotar para outro segmento.', helpText: 'Defina a decisão ANTES de ver os dados. Isso evita viés de confirmação.' },
            ],
          },
          {
            id: 'M5-emp-concept2',
            type: 'concept',
            term: 'MVP (Mínimo Produto Viável)',
            definition: 'A versão mais simples possível que permite testar a hipótese principal do negócio. NÃO é o produto final com menos funcionalidades — é o experimento mais barato para validar se existe demanda real.',
            example: 'Dropbox: um vídeo de 3 minutos mostrando como funcionaria. 75.000 inscritos na lista de espera em uma noite. Zero código escrito.',
            antiExample: 'Gastar 6 meses construindo app completo com 50 funcionalidades NÃO é MVP. Se ninguém quiser o produto, você perdeu 6 meses. A pergunta é: qual a maneira mais rápida de descobrir se alguém quer isso?',
          },
          {
            id: 'M5-1-s1',
            type: 'simulation',
            title: 'Lean Canvas — Modele um Negócio em 20 Minutos',
            simulationId: 'lean-canvas',
            description: 'Preencha o Lean Canvas (9 blocos) para uma ideia de negócio. Receba análise de consistência e sugestões de MVP para validar as hipóteses mais arriscadas.',
          },
          {
            id: 'M5-1-t4',
            type: 'text',
            title: 'Business Model Canvas — O Mapa do Modelo de Negócio',
            body: 'O Business Model Canvas (Osterwalder & Pigneur, 2010) é a ferramenta mais usada no mundo para descrever, analisar e desenhar modelos de negócio.\n\n**Os 9 Blocos do Canvas:**\n\n**1. Segmentos de Clientes** — Para quem criamos valor?\n— Quem são os clientes mais importantes?\n— Existem segmentos distintos com necessidades diferentes?\n— Tipos: massa, nicho, segmentado, diversificado, multilateral (plataforma)\n\n**2. Proposta de Valor** — Que valor entregamos?\n— Qual problema resolvemos? Qual necessidade satisfazemos?\n— Por que o cliente nos escolhe e não o concorrente?\n— Pode ser: novidade, performance, customização, design, preço, redução de risco, conveniência\n\n**3. Canais** — Como alcançamos o cliente?\n— Como o cliente descobre, avalia, compra, recebe e obtém suporte?\n— Direto (site, loja) vs. Indireto (marketplace, revendedor)\n\n**4. Relacionamento com Cliente** — Que tipo de relação cada segmento espera?\n— Assistência pessoal, self-service, automatizado, comunidade, co-criação\n\n**5. Fontes de Receita** — Como o cliente paga?\n— Venda direta, assinatura, licenciamento, freemium, comissão, publicidade\n— Preço fixo vs. dinâmico\n\n**6. Recursos-Chave** — O que precisamos ter?\n— Físicos (fábricas, lojas), intelectuais (patentes, marca), humanos (talentos), financeiros\n\n**7. Atividades-Chave** — O que precisamos fazer?\n— Produção, resolução de problemas, plataforma/rede\n\n**8. Parcerias-Chave** — Quem são nossos parceiros essenciais?\n— Alianças estratégicas, joint ventures, fornecedores críticos\n— Por que terceirizar? Otimização, redução de risco, aquisição de recursos\n\n**9. Estrutura de Custos** — Quanto custa operar?\n— Custos fixos vs. variáveis\n— Economias de escala, economias de escopo\n— Cost-driven (menor custo possível) vs. Value-driven (premium)\n\n**Como usar na prática:**\n1. Imprima o canvas grande (A0 ou quadro branco)\n2. Use post-its — cada hipótese é um post-it\n3. Preencha nesta ordem: Segmento → Proposta de Valor → Canais → Relacionamento → Receita → Recursos → Atividades → Parcerias → Custos\n4. Questione cada post-it: "Isso é fato ou hipótese?" Se hipótese → teste\n5. Atualize mensalmente conforme aprende',
          },
          {
            id: 'M5-1-t5',
            type: 'text',
            title: 'Validação de Mercado — Do Problema ao Product-Market Fit',
            body: 'Product-Market Fit (PMF) é o momento em que o mercado puxa o produto — em vez de você empurrar.\n\nMarc Andreessen: "Product-market fit é a única coisa que importa."\n\n**Os 4 Estágios da Validação:**\n\n**Estágio 1 — Problem-Solution Fit**\nPergunta: "O problema existe e é doloroso o suficiente para alguém pagar para resolvê-lo?"\nComo validar:\n— Entrevistas de descoberta (mínimo 30): "Me conta sobre a última vez que você enfrentou [problema]..."\n— Regra: Se 8 de 10 entrevistados descrevem o mesmo problema com emoção → é real\n— NÃO pergunte: "Você compraria X?" (todo mundo diz sim)\n— PERGUNTE: "Quanto você pagou/perdeu por causa desse problema?" (dor real = valor real)\n\n**Estágio 2 — MVP e Primeiros Usuários**\nPergunta: "A solução resolve o problema de verdade?"\nComo validar:\n— Construa o MVP mais simples possível\n— Coloque nas mãos de 50-100 early adopters\n— Meça: retenção (voltam?), NPS (recomendam?), willingness to pay (pagam?)\n\n**Estágio 3 — Product-Market Fit**\nPergunta: "O mercado quer o produto sem precisar ser convencido?"\nMétrica de Sean Ellis: "Como você se sentiria se não pudesse mais usar este produto?"\n— Se 40%+ responde "muito desapontado" → você tem PMF\n— Se <40% → ainda não. Continue iterando.\n\nOutros sinais de PMF:\n— Crescimento orgânico (pessoas indicam sem você pedir)\n— Taxa de retenção estável ou crescente\n— Demanda maior que capacidade\n\n**Estágio 4 — Scale**\nSÓ escale após PMF. Escalar sem PMF é gastar dinheiro para descobrir mais rápido que não funciona.\n\n**Erro mais comum em startups brasileiras:**\nPular do Estágio 1 direto para o Estágio 4. Investir em marketing, equipe e infraestrutura antes de validar que alguém quer o produto. Resultado: 42% das startups morrem por "falta de necessidade de mercado".',
          },
          {
            id: 'M5-emp-concept3',
            type: 'concept',
            term: 'Product-Market Fit (PMF)',
            definition: 'O momento em que o mercado PUXA o produto — em vez de você empurrar. Métrica de Sean Ellis: se 40%+ dos usuários responderem "muito desapontado" se não pudessem mais usar o produto, você tem PMF.',
            example: 'WhatsApp: ninguém fez marketing. As pessoas baixavam porque TODO MUNDO usava. Crescimento orgânico explosivo = PMF claro.',
            antiExample: 'Se você precisa oferecer desconto, insistir, explicar demais e ainda assim as pessoas não voltam — você NÃO tem PMF. Volte para o ciclo Build-Measure-Learn.',
          },
          {
            id: 'M5-emp-exercise1',
            type: 'inline-exercise',
            prompt: 'Aplique o Teste de Sean Ellis ao seu produto/serviço (ou a um que você usa).',
            context: 'Sean Ellis (Growth Hackers): pergunte aos seus usuários "Como você se sentiria se não pudesse mais usar este produto?" Se 40%+ responde "muito desapontado", você tem Product-Market Fit.',
            fields: [
              { id: 'product', label: 'Qual o produto ou serviço?', placeholder: 'Ex: App de gestão financeira para MEIs' },
              { id: 'test', label: 'Se perguntasse a 100 clientes, quantos diriam "muito desapontado"?', placeholder: 'Estime (ou faça a pesquisa real!) a porcentagem', multiline: true },
              { id: 'signals', label: 'Quais outros sinais de PMF (ou falta dele) você observa?', placeholder: 'Crescimento orgânico? Indicações espontâneas? Ou precisa convencer muito?', multiline: true },
              { id: 'action', label: 'Se NÃO tem PMF, o que faria para chegar lá?', placeholder: 'Qual feature falta? Qual segmento atende melhor? O que os churned dizem?', multiline: true },
            ],
            evaluationCriteria: ['Estima PMF com base em dados/observação, não achismo', 'Identifica sinais reais de PMF (ou falta dele)', 'Propõe ação concreta se PMF ainda não existe'],
            expectedConcepts: ['product-market fit', 'teste de Sean Ellis', 'retenção', 'crescimento orgânico'],
          },
          {
            id: 'M5-1-t6',
            type: 'text',
            title: 'Fontes de Financiamento — Do Bootstrap ao IPO',
            body: 'Cada estágio do negócio tem fontes de capital adequadas. Usar a fonte errada no momento errado é tão perigoso quanto não ter capital.\n\n**Estágio 1 — Ideação / Pré-Revenue**\n— Bootstrapping: capital próprio, economia pessoal\n— FFF: Friends, Family & Fools\n— Aceleradoras: Programa de 3-6 meses com mentoria + capital semente (R$ 50K-500K por 5-10% de equity)\n— Editais e prêmios: FINEP, FAPESP, BNDES Garagem\n\n**Estágio 2 — Validação / Early Revenue**\n— Investidor Anjo: Pessoa física que investe R$ 50K-500K em troca de equity. Traz rede de contatos.\n— Crowdfunding: Equity crowdfunding (Kria, Captable) ou reward-based (Catarse)\n— Revenue-based financing: Empréstimo pago como % da receita\n\n**Estágio 3 — Crescimento / Tração**\n— Venture Capital Seed: R$ 500K-5M. Foco: provar que o modelo escala.\n— Série A: R$ 5M-30M. Foco: escalar aquisição de clientes.\n— Série B+: R$ 30M+. Foco: expansão geográfica, novas linhas, domínio de mercado.\n\n**Estágio 4 — Maturidade**\n— Private Equity: Compra participação majoritária. Reestrutura e busca saída.\n— IPO: Abertura de capital em bolsa. Acesso a capital público.\n— M&A: Venda para empresa maior (exit mais comum para startups).\n\n**Custo de cada fonte:**\n— Bootstrapping: zero custo de capital, mas limita velocidade\n— Anjo/VC: diluição de equity (10-25% por rodada)\n— Dívida/Empréstimo: juros, mas sem diluição\n— IPO: regulação pesada, custos de compliance, pressão trimestral\n\n**Regra prática:**\n— Valide antes de buscar capital externo\n— Não aceite dinheiro de quem não agrega valor além do capital\n— Entenda a tese do investidor — se não está alinhada com sua visão, diga não\n— Diluição: manter 10% de uma empresa de R$ 100M é melhor que 100% de uma de R$ 1M',
          },
          {
            id: 'M5-1-t7',
            type: 'text',
            title: 'Unit Economics — Os Números que Provam se o Negócio Funciona',
            body: 'Unit economics é a análise financeira de UMA unidade do seu negócio (1 cliente, 1 transação, 1 produto). Se a unidade não dá lucro, escalar = escalar prejuízo.\n\n**As Métricas Fundamentais:**\n\n**CAC (Customer Acquisition Cost)**\nFórmula: Total gasto em marketing + vendas / Novos clientes no período\nExemplo: Gastou R$ 50K em marketing, adquiriu 200 clientes → CAC = R$ 250\n\nArmadilha: Incluir TODOS os custos (salários do time de marketing, ferramentas, ads, eventos — não só o ad spend).\n\n**LTV (Lifetime Value)**\nFórmula simplificada: Ticket médio × Frequência de compra × Tempo médio de retenção\nExemplo: R$ 100/mês × 1 compra/mês × 18 meses = LTV de R$ 1.800\n\nFórmula com churn: LTV = ARPU / Churn mensal\nExemplo: ARPU R$ 100/mês, churn 5% → LTV = R$ 100 / 0.05 = R$ 2.000\n\n**LTV/CAC — A Métrica das Métricas**\n— LTV/CAC < 1: Você PAGA para perder dinheiro. Cada cliente é prejuízo.\n— LTV/CAC 1-3: Marginal. Funciona apenas se custos fixos forem baixos.\n— LTV/CAC 3-5: Saudável. Modelo sustentável.\n— LTV/CAC > 5: Excelente. Ou está sendo conservador no marketing (poderia investir mais).\n\n**Payback de CAC** — Em quanto tempo recupero o custo de aquisição?\nFórmula: CAC / Margem bruta mensal por cliente\nExemplo: CAC R$ 250, margem R$ 80/mês → Payback = 3.1 meses\nRegra: Payback de CAC deve ser < 12 meses. Acima disso, precisa de muito capital de giro.\n\n**Margem de Contribuição por Unidade**\n= Preço - Custos variáveis diretos\nExemplo app de delivery: Ticket R$ 45 - Custo do restaurante R$ 32 - Custo do entregador R$ 8 = R$ 5 de margem\nPergunta: Com R$ 5 de margem, quantas entregas para cobrir R$ 200K/mês de custos fixos? 40.000 entregas/mês.\n\n**Casos reais de unit economics:**\n— Uber (early stage): cada corrida dava PREJUÍZO. Subsidiava motoristas e passageiros para ganhar market share. Só funcionou porque tinha US$ 25B em VC.\n— Nubank: CAC de R$ 30 (viral + indicação), LTV de R$ 1.200. LTV/CAC = 40x. Por isso cresceu sem anúncio.\n— WeWork: aluguel + reforma > receita por estação. Unit economics negativo em escala. Implodiu.\n\n**Regra de ouro: Se a unidade não funciona, escalar não vai salvar. Corrija a unidade primeiro.**',
          },
          {
            id: 'M5-emp-number1',
            type: 'number-crunch',
            title: 'Calculadora de Unit Economics — LTV/CAC',
            scenario: 'Descubra se seu negócio é saudável na unidade. Se LTV/CAC < 1, cada cliente é prejuízo. Se > 3, modelo é sustentável. Se > 5, pode investir mais em aquisição.',
            inputs: [
              { id: 'ticket', label: 'Ticket médio mensal (R$)', defaultValue: 100, unit: 'R$', min: 1, max: 1000000 },
              { id: 'retention', label: 'Tempo médio de retenção (meses)', defaultValue: 18, unit: 'meses', min: 1, max: 120 },
              { id: 'cac', label: 'Custo de Aquisição por Cliente (R$)', defaultValue: 250, unit: 'R$', min: 1, max: 1000000 },
            ],
            formula: '(ticket * retention) / cac',
            resultLabel: 'Razão LTV/CAC',
            interpretation: [
              { max: 1, label: 'PREJUÍZO por cliente. Cada venda piora sua situação. Corrija urgentemente.', color: 'red' as const },
              { max: 3, label: 'Marginal. Modelo frágil — qualquer aumento de CAC ou churn quebra.', color: 'amber' as const },
              { max: 5, label: 'Saudável. Modelo sustentável. Continue otimizando.', color: 'green' as const },
              { max: 1000, label: 'Excelente. Considere investir mais em marketing — pode estar deixando crescimento na mesa.', color: 'green' as const },
            ],
          },
          {
            id: 'M5-emp-compare1',
            type: 'compare',
            title: 'Unit Economics de Startups Brasileiras — Quem é Saudável?',
            question: 'Por que algumas startups crescem sustentavelmente e outras implodem?',
            dimensions: ['CAC', 'LTV estimado', 'LTV/CAC', 'Veredicto'],
            items: [
              { id: 'nubank', label: 'Nubank', values: ['~R$ 30 (viral + indicação)', '~R$ 1.200 (cross-sell financeiro)', '~40x', 'Excepcional — cresceu sem anúncio por anos'], highlight: 'Indicação orgânica = CAC quase zero. O sonho de todo negócio.' },
              { id: 'ifood', label: 'iFood', values: ['~R$ 50 (cupons + ads)', '~R$ 800 (pedidos recorrentes)', '~16x', 'Saudável — margem por pedido é baixa mas frequência é alta'], highlight: 'Volume x frequência compensa margem unitária apertada.' },
              { id: 'wework', label: 'WeWork', values: ['~US$ 10K (showroom + vendas)', '~US$ 8K (churn alto + margem negativa)', '<1x', 'PREJUÍZO por unidade. Escalar = escalar prejuízo. Implodiu.'], highlight: 'Unit economics negativo + escala agressiva = desastre.' },
            ],
            insight: 'Se a unidade não funciona, escalar não vai salvar — vai acelerar a falência. Corrija CAC, retenção ou margem ANTES de pisar no acelerador.',
          },
          {
            id: 'M5-1-t8',
            type: 'text',
            title: 'Growth Hacking — Crescimento com Método, Não com Sorte',
            body: 'Growth hacking não é "truque viral". É aplicação do método científico ao crescimento: hipótese → experimento → dados → decisão.\n\n**O Funil AARRR (Pirate Metrics — Dave McClure):**\n\n**Acquisition (Aquisição)** — Como o usuário descobre você?\n— Canais: SEO, ads, indicação, PR, conteúdo, parcerias\n— Métrica: Custo por lead, volume de leads qualificados\n— Pergunta: "Qual canal traz mais clientes ao menor custo?"\n\n**Activation (Ativação)** — O primeiro uso foi bom?\n— Definir o "momento aha!": quando o usuário percebe valor\n— Slack: aha = equipe troca 2.000 mensagens (depois disso, nunca churn)\n— Dropbox: aha = salvar 1 arquivo na pasta sincronizada\n— Métrica: % que completa onboarding, tempo até primeiro valor\n\n**Retention (Retenção)** — O usuário volta?\n— A métrica mais importante. Sem retenção, aquisição é balde furado.\n— Métrica: DAU/MAU, retenção D1/D7/D30, churn\n— Regra: Se retenção D30 < 20%, seu produto não resolve o problema bem o suficiente.\n\n**Revenue (Receita)** — O usuário paga?\n— Conversão free→paid, ticket médio, expansão de receita (upsell/cross-sell)\n— Métrica: ARPU, MRR, Net Revenue Retention\n\n**Referral (Indicação)** — O usuário indica?\n— O canal mais barato e mais confiável de aquisição\n— Métrica: NPS, viral coefficient (K), % de clientes vindos de indicação\n— K > 1: crescimento viral orgânico (cada cliente traz mais de 1)\n\n**Processo de Growth — Sprint Semanal:**\n1. Segunda: revisar dados da semana anterior\n2. Terça: brainstorm de hipóteses (mínimo 5 ideias)\n3. Quarta: priorizar com ICE Score (Impact × Confidence × Ease)\n4. Quinta-Sexta: implementar e lançar o experimento\n5. Próxima semana: medir resultado e decidir (scale, kill ou iterate)\n\n**Exemplos de growth hacks reais:**\n— Hotmail (1996): "PS: Get your free email at Hotmail" no rodapé de cada email. 12M de usuários em 18 meses.\n— Dropbox: programa de indicação — ganhe 500MB por cada amigo. Signups subiram 60%.\n— LinkedIn: importação de contatos do email. Cada usuário convidava toda a rede.\n— PayPal: US$ 10 por cadastro + US$ 10 por indicação. Queimou dinheiro, conquistou mercado.',
          },
          {
            id: 'M5-1-t9',
            type: 'text',
            title: 'Pitch Deck — Como Apresentar para Investidores',
            body: 'O pitch deck é o documento que decide se você entra na sala ou fica do lado de fora. Um VC vê 200+ decks por mês. Gasta em média 3 minutos e 44 segundos por deck (DocSend, 2023).\n\n**Os 12 Slides do Pitch Deck Clássico (Sequoia Capital):**\n\n**1. Título** — Nome + tagline de 1 frase + logo\n"[Empresa] — [O que faz em 8 palavras]"\n\n**2. Problema** — Qual dor real e urgente o mercado tem?\nDado impactante + história concreta de 1 pessoa que sofre com o problema\n\n**3. Solução** — Como você resolve?\nDemo, screenshot ou fluxo visual. NÃO texto. Mostre, não conte.\n\n**4. Por que agora?** — O que mudou para essa oportunidade existir?\nTecnologia nova, regulação, comportamento, evento de mercado\n\n**5. Tamanho de mercado** — TAM / SAM / SOM\n— TAM (Total Addressable Market): mercado total teórico\n— SAM (Serviceable Addressable Market): quanto você pode alcançar\n— SOM (Serviceable Obtainable Market): quanto vai capturar em 3-5 anos\nINVESTIDOR OLHA O SOM, NÃO O TAM.\n\n**6. Modelo de negócio** — Como ganha dinheiro?\nPreço × quantidade. Simples.\n\n**7. Tração** — O que já conquistou?\nMRR, clientes, crescimento, retenção. GRÁFICO subindo. Se não tem receita: waitlist, LOIs, pilotos.\n\n**8. Competição** — Quem mais resolve o mesmo problema?\nNunca diga "não temos concorrente". Mostre um quadrante com sua diferenciação.\n\n**9. Equipe** — Por que VOCÊS vão conseguir?\nFotos, nomes, cargos e 1 frase de credencial cada. O VC investe em PESSOAS, não em ideias.\n\n**10. Go-to-market** — Como vai adquirir clientes?\nCanais, CAC, funil, parcerias\n\n**11. Financeiro** — Projeção de 3-5 anos\nReceita, margem, break-even, runway. NÃO invente números bonitos — mostre premissas.\n\n**12. Ask** — O que você precisa?\n"Estamos levantando R$ X para [objetivo específico] com prazo de [Y meses]."\n\n**Erros que matam o pitch:**\n— Slide de "solução" sem mostrar o produto (só texto)\n— TAM de "trilhões" sem SOM realista\n— "Não temos concorrentes" (demonstra ingenuidade)\n— Projeção "hockey stick" sem justificativa nas premissas\n— Pedir dinheiro sem dizer PARA QUÊ exatamente',
          },
          {
            id: 'M5-1-s2',
            type: 'simulation',
            title: 'Avalie o Pitch — Investiria ou Não?',
            simulationId: 'pitch-evaluation',
            description: 'Receba 4 pitch decks resumidos de startups. Analise unit economics, tração, equipe e mercado. Decida: investiria ou não? Veja o que VCs reais pensaram.',
          },
          {
            id: 'M5-1-t10',
            type: 'text',
            title: 'Ecossistema de Startups no Brasil — Quem é Quem',
            body: '**O ecossistema brasileiro em números (2024-2025):**\n— ~15.000 startups ativas (ABStartups)\n— US$ 3.5B investidos em VC em 2024 (após pico de US$ 9.4B em 2021)\n— 15 unicórnios brasileiros (valuation > US$ 1B)\n— São Paulo concentra ~55% do ecossistema, mas hubs regionais crescem\n\n**Os principais players:**\n\n**Aceleradoras:**\n— Endeavor (scale-ups, mentoria de alto nível)\n— ACE Cortex (early stage, vertical tech)\n— Wayra (Telefónica — telecom/tech)\n— InovAtiva Brasil (governo federal — maior aceleradora pública da AL)\n— Cubo Itaú (hub — não acelera, mas conecta)\n\n**VCs brasileiros:**\n— Kaszek (maior da AL — investiu em Nubank, QuintoAndar)\n— Monashees (early/growth — Rappi, Loggi)\n— Valor Capital Group (cross-border Brasil-EUA)\n— Canary (seed stage — maior deal flow do Brasil)\n— KPTL (deep tech e impacto)\n\n**Programas de apoio público:**\n— BNDES Garagem: aceleração + capital para startups early stage\n— FINEP: financiamento de inovação (subvenção econômica = dinheiro não reembolsável)\n— FAPESP PIPE: pesquisa inovativa em PMEs (São Paulo)\n— StartupRS, MinasDigital, CIETEC: ecossistemas regionais\n\n**Hubs regionais emergentes:**\n— Florianópolis: capital com mais startups per capita do Brasil\n— Recife/Porto Digital: 350+ empresas, foco em games e fintech\n— BH/San Pedro Valley: 300+ startups, comunidade forte\n— Curitiba: forte em agtech e healthtech\n— Manaus: Zona Franca + hardware + IoT\n\n**Tendências do ecossistema 2025-2026:**\n— IA generativa: toda startup nova precisa ter IA na proposta de valor\n— Climate tech: investimento ESG puxando capital para energia, carbono, agro sustentável\n— Consolidação: startups comprando startups (M&A > IPO como saída)\n— Revenue-based financing: alternativa a VC sem diluição\n— Regulação: Marco Legal das Startups (LC 182/21) facilitou investimento anjo e sandbox',
          },
          {
            id: 'M5-1-t11',
            type: 'text',
            title: 'Mapa do Empreendedor — Quando Usar Cada Ferramenta',
            body: '**Resumo — ferramenta certa para cada fase:**\n\n**Ideia → Validação:**\n— Effectuation: Comece com o que tem (quem sou, o que sei, quem conheço)\n— Lean Canvas: Modele o negócio em 1 página\n— Entrevistas de descoberta: 30 conversas com o público-alvo\n— MVP: Versão mais simples para testar a hipótese principal\n\n**Validação → Product-Market Fit:**\n— Build-Measure-Learn: Ciclo de experimentação contínua\n— Métricas de Sean Ellis: "Muito desapontado se não tivesse?" > 40%\n— Unit Economics: CAC, LTV, LTV/CAC > 3x\n— Cohort Analysis: Retenção por grupo ao longo do tempo\n\n**PMF → Crescimento:**\n— AARRR (Pirate Metrics): Funil completo de growth\n— Growth Sprints: Experimentação semanal com ICE Score\n— Business Model Canvas: Mapa operacional completo\n— Pitch Deck: Para captar investimento (se necessário)\n\n**Crescimento → Escala:**\n— OKRs: Alinhamento de metas em toda a empresa\n— Hiring plan: Contratar as pessoas certas na ordem certa\n— Processos: Documentar o que funciona para replicar\n— Cultura: Definir valores antes que a empresa fique grande demais\n\n**Financiamento por fase:**\n— Ideia: Bootstrap + FFF (R$ 0-50K)\n— Validação: Anjo + Aceleradoras (R$ 50K-500K)\n— PMF: Seed VC (R$ 500K-5M)\n— Growth: Série A+ (R$ 5M+)\n\n**Regra universal: Nunca escale o que não funciona. Corrija a unidade antes de multiplicar.**',
          },
        ],
      },
      {
        id: 'M5-2',
        title: 'Ambiente Macroeconomico',
        blocks: [
          {
            id: 'M5-2-t1',
            type: 'text',
            title: 'Macroeconomia — O Cenário que Nenhuma Empresa Controla',
            body: 'Macroeconomia é o ambiente externo que afeta todas as empresas simultaneamente. Você não controla inflação, juros, câmbio ou PIB — mas precisa entender para tomar decisões.\n\n**Os 5 Indicadores que Todo Gestor Precisa Acompanhar:**\n\n**1. PIB (Produto Interno Bruto)**\nO que é: Soma de tudo que o país produz em bens e serviços\nPor que importa: PIB crescendo = mercado expandindo = mais oportunidade. PIB caindo = recessão = consumo retraindo.\nOnde acompanhar: IBGE (trimestral)\nImpacto direto: PIB caiu 2 trimestres seguidos? → Recessão técnica → Prepare caixa, reduza risco.\n\n**2. Inflação (IPCA)**\nO que é: Taxa de aumento geral dos preços\nPor que importa: Inflação alta corrói poder de compra do consumidor e aumenta custo de insumos.\nOnde acompanhar: IBGE (mensal), meta definida pelo CMN\nImpacto direto: IPCA acima da meta → BC sobe juros → Crédito fica caro → Consumo cai → Sua receita pode cair.\n\n**3. Taxa Selic (Juros Básicos)**\nO que é: Taxa de juros que o Banco Central define para controlar inflação\nPor que importa: Selic alta → empréstimos caros → investimento cai → consumo cai. Selic baixa → crédito barato → economia aquece.\nOnde acompanhar: COPOM (a cada 45 dias)\nImpacto direto: Selic em 13.75%? → Custo de financiamento sobe. Renegocie dívidas. Priorize caixa.\n\n**4. Câmbio (R$/US$)**\nO que é: Preço do dólar em reais\nPor que importa: Real fraco → importações mais caras (insumos sobem) mas exportações mais competitivas. Real forte → importações baratas mas exportações perdem competitividade.\nOnde acompanhar: Banco Central (diário)\nImpacto direto: Se você importa insumos, dólar alto mata sua margem. Se exporta, dólar alto é oportunidade.\n\n**5. Taxa de Desemprego**\nO que é: % da força de trabalho que procura emprego e não encontra\nPor que importa: Desemprego alto = consumo fraco + mão-de-obra disponível. Desemprego baixo = consumo forte + guerra por talentos.\nOnde acompanhar: IBGE/PNAD (trimestral)',
          },
          {
            id: 'M5-macro-concept1',
            type: 'concept',
            term: 'Taxa Selic',
            definition: 'Taxa básica de juros da economia brasileira, definida pelo COPOM (a cada 45 dias). Selic alta = crédito caro, consumo cai, investimento freia. Selic baixa = crédito barato, consumo sobe, economia aquece.',
            example: 'Selic a 2% (2020): boom imobiliário, crédito farto, startups captando rodadas recordes. Selic a 13.75% (2023): financiamentos caros, consumo retraído, startups demitindo.',
            antiExample: '"A Selic subiu mas não me afeta porque não tenho empréstimo." Errado: Selic alta reduz poder de compra do seu cliente, encarece seu capital de giro e comprime margens de todo o mercado.',
          },
          {
            id: 'M5-macro-decision1',
            type: 'decision',
            scenario: 'A Selic subiu de 10% para 14% em 6 meses. Sua empresa tem R$ 500K em dívida pós-fixada (atrelada ao CDI) e R$ 200K em caixa. Vendas começaram a cair 8%. O que você faz?',
            options: [
              { label: 'Renegociar a dívida para taxa prefixada', tradeoffs: { upside: 'Previsibilidade de custo — sabe exatamente quanto vai pagar', downside: 'Taxa prefixada atual será alta (>14%). Se Selic cair, fica travado', risk: 'medium' as const } },
              { label: 'Usar o caixa para quitar parte da dívida', tradeoffs: { upside: 'Elimina custo de juros imediato — economia de ~R$ 70K/ano', downside: 'Reduz caixa em período de incerteza — se vendas caírem mais, pode faltar liquidez', risk: 'medium' as const } },
              { label: 'Manter a dívida e priorizar geração de caixa operacional', tradeoffs: { upside: 'Preserva liquidez para oportunidades e emergências', downside: 'Continua pagando juros altos — R$ 70K+/ano de custo financeiro', risk: 'low' as const } },
              { label: 'Cortar custos agressivamente para liberar caixa', tradeoffs: { upside: 'Melhora margem rapidamente, libera caixa para quitar dívida', downside: 'Cortes podem afetar qualidade e capacidade de atender demanda quando economia retomar', risk: 'high' as const } },
            ],
            realWorldAnalog: 'Em 2022-2023, com Selic a 13.75%, varejistas como Americanas (R$ 25B de dívida) e Marisa não conseguiram gerenciar o custo financeiro. Quem tinha caixa forte (Magazine Luiza) sobreviveu e comprou concorrentes fragilizados.',
            lesson: 'Selic alta é hora de caixa, não de expansão. Renegociar antes do aperto é estratégia. Renegociar durante o aperto é desespero — e bancos cobram mais.',
          },
          {
            id: 'M5-2-t2',
            type: 'text',
            title: 'Política Monetária e Fiscal — Como o Governo Afeta Seu Negócio',
            body: '**Política Monetária — O Banco Central e os Juros:**\n\nO Banco Central tem uma missão: manter a inflação na meta (atualmente 3% com banda de 1.5pp).\n\nFerramentas:\n— Selic: sobe juros para conter inflação, desce para estimular economia\n— Compulsório: % que bancos devem manter parado no BC (mais compulsório = menos crédito)\n— Operações de mercado aberto: compra/venda de títulos para controlar liquidez\n\nComo isso afeta sua empresa:\n— Selic sobe → CDI sobe → Custo de empréstimo sobe → Investimento cai → Consumo cai\n— Selic desce → CDI desce → Crédito barato → Investimento e consumo sobem\n\nDecisão prática: Com Selic alta, priorize caixa e eficiência. Com Selic baixa, invista e expanda.\n\n**Política Fiscal — O Governo e os Gastos:**\n\nO governo arrecada (impostos) e gasta (saúde, educação, infraestrutura, programas sociais).\n\n— Política Fiscal Expansionista: governo gasta mais que arrecada → estímulo de curto prazo, mas pode gerar inflação e dívida\n— Política Fiscal Contracionista: governo gasta menos → menos estímulo, mas controla inflação e dívida\n\nArcabouço Fiscal (2023): limita crescimento dos gastos do governo a 70% do crescimento da receita. Objetivo: estabilizar dívida pública.\n\nComo isso afeta sua empresa:\n— Aumento de imposto → custo sobe (pode precisar repassar ao preço)\n— Incentivo fiscal setorial → oportunidade (ex: Lei do Bem para P&D, Zona Franca de Manaus)\n— Gasto público em infraestrutura → demanda para construção civil, tecnologia, serviços\n\n**Relação entre as duas políticas:**\nSe o governo gasta muito (fiscal expansionista), o BC precisa subir juros (monetária contracionista) para compensar a pressão inflacionária. Quando as duas são conflitantes, o resultado é juros altos + crescimento baixo — o pior cenário para empresas.',
          },
          {
            id: 'M5-2-t3',
            type: 'text',
            title: 'Ciclos Econômicos — Quando Expandir e Quando Proteger',
            body: 'A economia não cresce em linha reta. Oscila em ciclos. Entender em qual fase estamos determina a estratégia correta.\n\n**As 4 Fases do Ciclo Econômico:**\n\n**1. Expansão**\nSinais: PIB crescendo, desemprego caindo, crédito abundante, otimismo\nEstratégia: Investir, expandir, contratar, lançar produtos\nRisco: Superaquecer — investir demais em ativos que vão desvalorizar na queda\n\n**2. Pico**\nSinais: Inflação subindo, ativos caros (bolsa em alta, imóveis caros), euforia\nEstratégia: Preparar caixa, reduzir dívida variável, diversificar receita\nRisco: "Desta vez é diferente" — a frase mais perigosa do mercado financeiro\n\n**3. Contração (Recessão)**\nSinais: PIB caindo, demissões, crédito restrito, pessimismo\nEstratégia: Proteger caixa, cortar custos não essenciais, renegociar contratos\nOportunidade: Aquisições baratas, talentos disponíveis, concorrentes fracos saem do mercado\n\n**4. Vale (Fundo)**\nSinais: Estabilização do PIB, inflação cedendo, BC começa a cortar juros\nEstratégia: Posicionar para a próxima expansão — investir enquanto está barato\nRisco: Esperar demais e perder a janela\n\n**Indicadores antecedentes — Como prever a mudança de fase:**\n— Curva de juros invertida (juros curtos > juros longos) → recessão em 12-18 meses (acerta 80% das vezes)\n— PMI abaixo de 50 → contração industrial\n— Confiança do consumidor caindo → consumo vai cair em 3-6 meses\n— Pedidos de seguro-desemprego subindo → demissões acelerando\n\n**Regra de ouro para gestores:**\n— Na expansão: invista, mas mantenha reserva (não gaste tudo)\n— No pico: tome lucro, reduza exposição\n— Na contração: preserve caixa, seja oportunista\n— No vale: compre ativos, invista em pessoas\n\nWarren Buffett: "Tenha medo quando os outros são gananciosos e seja ganancioso quando os outros têm medo."',
          },
          {
            id: 'M5-macro-compare1',
            type: 'compare',
            title: '4 Fases do Ciclo Econômico — Estratégia para Cada Momento',
            question: 'Em qual fase do ciclo estamos — e o que fazer em cada uma?',
            dimensions: ['Sinais', 'O que fazer', 'Oportunidade escondida', 'Maior erro'],
            items: [
              { id: 'expansion', label: 'Expansão', values: ['PIB crescendo, desemprego caindo, crédito farto', 'Investir, expandir, contratar, lançar produtos', 'Construir reserva de caixa ENQUANTO fatura alto', 'Alavancar demais no otimismo — "desta vez é diferente"'], highlight: 'Na festa, prepare-se para a ressaca.' },
              { id: 'peak', label: 'Pico', values: ['Inflação subindo, ativos caros, euforia generalizada', 'Preparar caixa, reduzir dívida variável, diversificar', 'Vender ativos no topo (imóveis, ações) com lucro máximo', 'Acreditar que o crescimento é eterno'], highlight: '"Quando todos são gananciosos, tenha medo." — Buffett' },
              { id: 'contraction', label: 'Contração', values: ['PIB caindo, demissões, crédito restrito, pessimismo', 'Proteger caixa, cortar não-essencial, renegociar', 'Aquisições baratas + talentos disponíveis a custo menor', 'Cortar investimento em inovação — quem para volta mais fraco'], highlight: 'Quem tem caixa na crise compra o futuro barato.' },
              { id: 'trough', label: 'Vale', values: ['Estabilização, inflação cedendo, BC cortando juros', 'Posicionar para próxima expansão — investir no barato', 'Ativos, empresas e talentos estão no preço mínimo', 'Esperar demais e perder a janela de recuperação'], highlight: '"Quando todos têm medo, seja ganancioso." — Buffett' },
            ],
            insight: 'A estratégia certa no momento errado é a estratégia errada. Expandir na contração ou preservar na expansão — ambos destroem valor. Leia o ciclo ANTES de decidir.',
          },
          {
            id: 'M5-macro-framework1',
            type: 'framework',
            frameworkId: 'macro-diagnostic',
            title: 'Diagnóstico Macroeconômico — Impacto no Seu Negócio',
            description: 'Analise os 5 indicadores macroeconômicos atuais e avalie como cada um afeta sua empresa. Isso é planejamento estratégico — não exercício acadêmico.',
            fields: [
              { id: 'pib', label: 'PIB: Está crescendo ou caindo? Como isso afeta sua demanda?', placeholder: 'Ex: PIB crescendo 2.5% — meu mercado cresce junto, mas abaixo do potencial', helpText: 'PIB é o termômetro geral. Se cai 2 trimestres seguidos = recessão técnica.' },
              { id: 'selic', label: 'Selic: Está alta ou baixa? Como afeta seu custo de capital?', placeholder: 'Ex: Selic a 13% — meu financiamento custa CDI+3% = 16%. Cada R$ 100K custa R$ 16K/ano', helpText: 'Selic alta = priorize caixa. Selic baixa = invista e expanda.' },
              { id: 'cambio', label: 'Câmbio: Dólar alto ou baixo? Você importa ou exporta?', placeholder: 'Ex: Dólar a R$ 5.50 — meus insumos importados subiram 15%', helpText: 'Real fraco = bom para exportador, ruim para importador.' },
              { id: 'action', label: 'Qual a ação estratégica principal dado o cenário atual?', placeholder: 'Ex: Renegociar dívida para prefixada enquanto Selic está no pico + buscar fornecedores nacionais para reduzir exposição cambial', helpText: 'Cada indicador sugere uma ação. Qual é a mais urgente?' },
            ],
          },
          {
            id: 'M5-2-s1',
            type: 'simulation',
            title: 'Cenário Macroeconômico — Tome a Decisão Certa',
            simulationId: 'macro-scenario',
            description: 'Receba 4 cenários macroeconômicos (expansão, pico, recessão, vale) com dados reais de indicadores. Para cada um, tome decisões de investimento, contratação e precificação.',
          },
          {
            id: 'M5-2-t4',
            type: 'text',
            title: 'Comércio Internacional e Globalização — Oportunidades e Riscos',
            body: 'Nenhuma empresa opera em bolha. Mesmo que você não exporte, seu fornecedor importa insumos, seu concorrente pode ser global e o câmbio afeta seus custos.\n\n**Conceitos fundamentais:**\n\n**Vantagem Comparativa (David Ricardo)**\nIdeia: Países devem se especializar no que produzem com menor custo de oportunidade.\nBrasil: vantagem em agronegócio, mineração, energia renovável\nImplicação: Comprar o que outros fazem melhor e vender o que fazemos melhor gera mais riqueza para todos.\n\n**Balança Comercial**\nExportações > Importações → Superávit (entrada de dólares, real se fortalece)\nImportações > Exportações → Déficit (saída de dólares, real se enfraquece)\nBrasil 2024: superávit de US$ 98 bilhões (recorde), puxado por agro e mineração.\n\n**Barreiras Comerciais:**\n— Tarifárias: impostos sobre importação (ex: imposto de importação brasileiro médio de 11%)\n— Não-tarifárias: cotas, regulamentações, certificações, subsídios locais\n— Sanitárias: exigências de saúde e segurança (ex: EU exige rastreabilidade completa de alimentos)\n\n**Impacto para empresas brasileiras:**\n— Exportadoras: câmbio favorável (real fraco) + acordos comerciais (Mercosul, BRICS) = oportunidade\n— Importadoras de insumos: câmbio desfavorável (real fraco) + tarifas = custo maior\n— Todas: ESG e CSRD europeia afetam cadeia de fornecimento global — mesmo empresas brasileiras que vendem para exportadoras europeias precisam se adequar\n\n**Globalização 2.0 — Tendências:**\n— Nearshoring: empresas trazendo produção para mais perto (México ganhando fábricas da China)\n— Friendshoring: alianças comerciais por afinidade geopolítica (EUA+EU vs China+Rússia)\n— Desglobalização seletiva: chips, energia e defesa voltando para produção doméstica\n— Digitalização do comércio: e-commerce cross-border, pagamentos internacionais instantâneos',
          },
          {
            id: 'M5-2-t5',
            type: 'text',
            title: 'Economia Brasileira — Estrutura, Desafios e Oportunidades',
            body: 'Para empreender no Brasil, é preciso entender a estrutura econômica e seus paradoxos.\n\n**O Brasil em números (2024-2025):**\n— PIB: ~R$ 11 trilhões (9ª maior economia do mundo)\n— População: 215 milhões\n— PIB per capita: ~R$ 51.000 (US$ 10.000) — renda média-alta\n— Inflação (IPCA): ~4.5%\n— Selic: 13.25%\n— Desemprego: ~6.5%\n— Dívida pública/PIB: ~78%\n\n**Estrutura do PIB:**\n— Serviços: 70% (comércio, finanças, TI, saúde, educação)\n— Indústria: 22% (transformação, construção, extrativa)\n— Agropecuária: 8% (mas 25% das exportações)\n\n**Os 5 Grandes Desafios:**\n\n1. Carga tributária complexa (33% do PIB)\n— Não é só alta — é complexa. Empresas gastam 1.500 horas/ano em compliance tributário (pior do mundo, World Bank).\n— Reforma Tributária (2024-2026): IBS + CBS substituem 5 tributos. Simplifica, mas transição é lenta.\n\n2. Infraestrutura deficiente\n— Custo logístico: 12% do PIB (vs 8% nos EUA). Rodovias precárias encarecem tudo.\n— Oportunidade: concessões e PPPs em rodovias, ferrovias, portos.\n\n3. Desigualdade extrema\n— Gini: 0.52 (um dos mais desiguais do mundo)\n— 10% mais ricos detêm 59% da renda\n— Impacto nos negócios: mercado consumidor fragmentado — luxo e base da pirâmide crescem, classe média encolhe.\n\n4. Custo de capital alto\n— Selic historicamente alta torna empréstimos caros e desestimula investimento produtivo\n— Spread bancário: ~20pp acima da Selic (um dos maiores do mundo)\n\n5. Burocracia\n— 120 dias para abrir empresa (vs 1 dia na Estônia)\n— Ambiente regulatório incerto afasta investimento de longo prazo\n\n**As 5 Grandes Oportunidades:**\n1. Agro-tech: maior produtor de soja, café, laranja, açúcar do mundo + tecnologia\n2. Energia renovável: 85% da matriz elétrica é limpa (hidro+eólica+solar) — diferencial ESG global\n3. Economia digital: 5º maior mercado de internet do mundo, fintech em explosão\n4. Biodiversidade: maior biodiversidade do planeta → bioeconomia, cosméticos, fármacos\n5. Demografia: bônus demográfico até ~2035 (população em idade produtiva > dependentes)',
          },
          {
            id: 'M5-macro-concept2',
            type: 'concept',
            term: 'Vantagem Comparativa (Ricardo)',
            definition: 'Países devem se especializar no que produzem com menor custo de oportunidade — não no que produzem mais barato em termos absolutos. O comércio internacional beneficia TODOS quando cada um se especializa.',
            example: 'Brasil tem vantagem comparativa em agro (terra fértil, clima, tecnologia), energia renovável (85% da matriz é limpa) e biodiversidade. Por isso exporta soja e importa chips.',
            antiExample: '"O Brasil deveria produzir tudo internamente para não depender de importação." Autarquia reduz eficiência: gastar R$ 100 produzindo algo que custa R$ 30 importar é desperdício de recursos.',
          },
          {
            id: 'M5-macro-exercise1',
            type: 'inline-exercise',
            prompt: 'Analise como os 5 grandes desafios da economia brasileira afetam SEU negócio (ou um negócio que você conhece).',
            context: 'Os 5 desafios estruturais: (1) Carga tributária complexa, (2) Infraestrutura deficiente, (3) Desigualdade extrema, (4) Custo de capital alto, (5) Burocracia. Cada um afeta diferentes setores de formas diferentes.',
            fields: [
              { id: 'business', label: 'Qual o negócio?', placeholder: 'Setor, tamanho, região' },
              { id: 'biggest-impact', label: 'Qual dos 5 desafios mais impacta este negócio e por quê?', placeholder: 'Ex: Custo de capital alto — financiamento a 18%/ano inviabiliza expansão', multiline: true },
              { id: 'opportunity', label: 'Qual das 5 oportunidades (agro-tech, energia renovável, economia digital, biodiversidade, bônus demográfico) é mais relevante?', placeholder: 'Ex: Economia digital — 5º maior mercado de internet do mundo', multiline: true },
              { id: 'action', label: 'Qual ação concreta faria para mitigar o desafio ou capturar a oportunidade?', placeholder: 'Ex: Migrar para regime tributário do Simples Nacional + usar BNDES Garagem para financiamento subsidiado', multiline: true },
            ],
            evaluationCriteria: ['Conecta desafio macroeconômico a impacto específico no negócio', 'Identifica oportunidade relevante para o contexto', 'Propõe ação concreta e viável'],
            expectedConcepts: ['desafios estruturais', 'oportunidades Brasil', 'ação estratégica'],
          },
          {
            id: 'M5-2-t6',
            type: 'text',
            title: 'Reforma Tributária — O que Muda para os Negócios',
            body: 'A Reforma Tributária (EC 132/2023) é a maior mudança no sistema de impostos brasileiros em 60 anos. Todo gestor precisa entender o impacto.\n\n**O que muda:**\n5 tributos (PIS, COFINS, IPI, ICMS, ISS) → 2 novos (CBS federal + IBS estadual/municipal)\n\nJuntos formam o IVA (Imposto sobre Valor Agregado) — modelo usado por 170+ países.\n\n**Princípios do novo sistema:**\n— Não-cumulatividade plena: crédito total de impostos pagos em etapas anteriores (fim da cascata)\n— Destino: imposto cobrado no local do CONSUMO, não da produção\n— Transparência: alíquota visível no preço final\n— Alíquota padrão estimada: 26.5% (uma das mais altas do mundo em IVA)\n\n**Impacto por setor:**\n\nSERVIÇOS (maioria vai pagar MAIS):\n— Hoje: ISS de 2-5%\n— Depois: IVA de ~26.5%\n— Impacto: Aumento significativo de carga para serviços puros (consultoria, TI, educação)\n— Mitigação: Empresas de serviços com poucos insumos tributáveis terão menos créditos para compensar\n\nINDÚSTRIA (maioria vai pagar MENOS):\n— Hoje: cascata de ICMS + IPI + PIS/COFINS = 30-45% efetivo\n— Depois: IVA de ~26.5% com crédito pleno\n— Impacto: Redução real de carga + eliminação da guerra fiscal entre estados\n\nCOMÉRCIO (neutro a positivo):\n— Hoje: ICMS com substituição tributária complexa\n— Depois: IVA com crédito pleno e sistema simplificado\n— Impacto: Menos burocracia, mais previsibilidade\n\n**Cronograma de transição (2026-2033):**\n— 2026: CBS entra em vigor (alíquota teste de 0.9%)\n— 2027: CBS em vigor pleno + IPI zerado (exceto Zona Franca)\n— 2029-2032: Transição gradual de ICMS/ISS para IBS\n— 2033: Sistema novo 100% em vigor\n\n**O que o gestor precisa fazer AGORA:**\n1. Simular impacto na sua empresa (nova carga vs. atual)\n2. Revisar precificação para setores que terão aumento\n3. Mapear créditos tributários que poderá utilizar\n4. Atualizar sistemas fiscais (ERP, nota fiscal)\n5. Capacitar equipe contábil e fiscal',
          },
          {
            id: 'M5-2-t7',
            type: 'text',
            title: 'Mercado de Trabalho e Capital Humano — O que Mudou',
            body: 'O mercado de trabalho brasileiro passou por transformações estruturais que afetam diretamente a gestão de negócios.\n\n**As 5 Transformações Estruturais:**\n\n**1. Escassez de Talentos Qualificados**\n— Desemprego geral: 6.5%. Desemprego em tech: ~1%.\n— Paradoxo: milhões desempregados, mas empresas não encontram quem contratar.\n— Causa: desalinhamento entre formação acadêmica e necessidade do mercado.\n— Impacto: salários em tech, dados e IA inflacionados. Guerra por talentos.\n— Ação: Investir em treinamento interno (upskilling). É mais barato formar do que competir por pronto.\n\n**2. Trabalho Remoto e Híbrido**\n— 38% dos trabalhadores qualificados no Brasil operam em modelo híbrido (2025)\n— Empresas 100% presenciais perdem candidatos para concorrentes flexíveis\n— Impacto em custos: redução de 30-40% em despesas de escritório\n— Desafio: manter cultura, colaboração e gestão de performance à distância\n— Dados: empresas híbridas retêm 12% mais talentos que 100% presenciais (McKinsey 2024)\n\n**3. Gig Economy e Pejotização**\n— 25 milhões de trabalhadores informais no Brasil\n— Plataformas: Uber, iFood, 99, Rappi — 1.5M de trabalhadores de app\n— Pejotização: contratação como PJ para reduzir encargos (prática arriscada juridicamente)\n— Reforma Trabalhista (2017): trouxe intermitente e teletrabalho, mas pejotização continua em zona cinzenta\n— Risco para empresa: passivo trabalhista se relação é subordinada e contínua\n\n**4. Diversidade como Vantagem Competitiva**\n— Empresas com diversidade étnica têm 36% mais chance de performance acima da média (McKinsey 2023)\n— Diversidade de gênero na liderança: 25% mais chance de lucratividade acima da média\n— Consumidores Gen Z (28% da pop.) priorizam marcas com diversidade real\n— Não é só ética — é business case comprovado\n\n**5. IA e Automação — Impacto no Emprego**\n— 30% das tarefas atuais podem ser automatizadas com IA generativa (McKinsey 2024)\n— Não são "empregos inteiros" eliminados — são TAREFAS dentro de empregos\n— Empregos mais afetados: administrativo, atendimento tier 1, data entry, tradução, design básico\n— Empregos menos afetados: gestão, criatividade complexa, relacionamento, trabalho manual especializado\n— A pergunta não é "IA vai substituir meu emprego?" — é "Alguém usando IA vai substituir quem não usa?"',
          },
          {
            id: 'M5-2-t8',
            type: 'text',
            title: 'Sistema Financeiro Brasileiro — Como Funciona na Prática',
            body: '**Os Players do Sistema Financeiro:**\n\n**Banco Central (BCB)**\n— Define Selic (política monetária)\n— Regula bancos e instituições financeiras\n— Opera o PIX (2.4 bilhões de transações/mês — maior sistema de pagamentos instantâneos do mundo)\n— Autoriza fintechs e bancos digitais\n\n**Bancos Comerciais**\n— Big 5: Itaú, Bradesco, BB, Santander, Caixa\n— Concentram 80% dos ativos bancários\n— Spread bancário de ~20pp (um dos maiores do mundo)\n— Spread = diferença entre taxa que captam (CDI) e taxa que emprestam\n\n**Fintechs**\n— Nubank: 100M+ clientes, maior banco digital do mundo\n— Inter, C6, PicPay, Mercado Pago: competem com bancos tradicionais\n— Reduziram custo de conta e transferência para zero\n— Open Banking/Finance: compartilhamento de dados entre instituições (com consentimento)\n\n**Mercado de Capitais**\n— B3 (Bolsa brasileira): ~450 empresas listadas\n— Ibovespa: principal índice (~130K pontos em 2025)\n— CDB, LCI, LCA, debêntures: renda fixa corporativa\n— Fundos de investimento: R$ 8 trilhões em patrimônio\n\n**Produtos financeiros que todo gestor precisa conhecer:**\n\n— CDI: Certificado de Depósito Interbancário — referência para aplicações (~Selic)\n— CDB: Certificado de Depósito Bancário — empréstimo ao banco, rende % do CDI\n— LCI/LCA: Letra de Crédito Imobiliário/Agronegócio — isento de IR para pessoa física\n— Debêntures: "empréstimo" que empresas tomam do mercado — alternativa a banco\n— Fundo DI: fundo que rende próximo ao CDI com liquidez diária\n— Tesouro Direto: títulos do governo federal (Selic, IPCA+, Prefixado)\n\n**Para o gestor na prática:**\n— Caixa da empresa: mínimo 3-6 meses de despesa em aplicação de liquidez diária (CDB 100% CDI ou Tesouro Selic)\n— Capital de giro: negocie com 3+ bancos. Nunca use cheque especial (>300%/ano)\n— Investimento: compare custo de capital próprio (equity) vs dívida (empréstimo) vs reinvestimento\n— PIX Cobrança: substitui boleto para cobranças — sem custo, liquidação imediata\n— Open Banking: permite comparar ofertas de crédito de múltiplos bancos automaticamente',
          },
          {
            id: 'M5-2-s2',
            type: 'simulation',
            title: 'Análise de Conjuntura — Leia o Cenário e Decida',
            simulationId: 'conjuntura-analysis',
            description: 'Receba um painel completo de indicadores macroeconômicos do Brasil em 4 momentos diferentes. Interprete os dados, identifique a fase do ciclo e tome 5 decisões empresariais fundamentadas.',
          },
          {
            id: 'M5-2-t9',
            type: 'text',
            title: 'Mapa Macroeconômico para Gestores — Quando Agir',
            body: '**Resumo — como cada indicador afeta sua decisão:**\n\n**PIB subindo**\n→ Expandir: contratar, investir, lançar produtos\n→ Cuidado: não se alavancar demais no otimismo\n\n**PIB caindo**\n→ Proteger: caixa, cortar não-essencial, renegociar\n→ Oportunidade: adquirir concorrentes fragilizados\n\n**Selic alta**\n→ Priorizar caixa sobre crescimento\n→ Renegociar dívida pós-fixada\n→ Foco em retenção (CAC sobe quando crédito aperta)\n\n**Selic baixa**\n→ Investir: empréstimo barato para expansão\n→ Aquisições: valuation de ativos cai\n→ Consumidor compra mais (parcelas menores)\n\n**Inflação alta**\n→ Revisar precificação (mas cuidado com elasticidade)\n→ Estocar insumos antes de novo reajuste\n→ Reajustar salários para reter talentos\n\n**Câmbio alto (real fraco)**\n→ Exportadores: margem sobe automaticamente\n→ Importadores: buscar fornecedores nacionais ou hedge cambial\n→ Turismo: brasileiro viaja menos, estrangeiro vem mais\n\n**Desemprego alto**\n→ Talento disponível a custo menor\n→ Consumo fraco: produtos essenciais > luxo\n→ Governo pode criar estímulos (oportunidade)\n\n**Desemprego baixo**\n→ Guerra por talentos: investir em employer branding\n→ Consumo forte: investir em capacidade\n→ Salários pressionam custos\n\n**Onde acompanhar:**\n— PIB: IBGE (trimestral)\n— IPCA: IBGE (mensal, dia 10)\n— Selic: BCB/COPOM (a cada 45 dias)\n— Câmbio: BCB (diário)\n— Desemprego: IBGE/PNAD (trimestral)\n— Confiança: FGV/IBRE (mensal)\n— Relatório Focus: BCB (semanal — expectativas do mercado)',
          },
        ],
      },
    ],
  },
  {
    moduleId: 'M6',
    topics: [
      {
        id: 'M6-0',
        title: 'Analise Financeira',
        blocks: [
          {
            id: 'M6-0-t1',
            type: 'text',
            title: 'Análise Vertical e Horizontal: Lendo as Entrelinhas dos Números',
            body: 'Demonstrações contábeis são um mapa — mas sem análise, são apenas números. A análise financeira transforma dados em diagnóstico.\n\n**Análise Vertical:**\nCompara cada item com um referencial dentro do mesmo período.\n— Na DRE: cada linha como % da Receita Líquida\n— No Balanço: cada conta como % do Ativo Total\n\nExemplo: Se o CMV representa 65% da receita líquida e no setor a média é 45%, sua operação é ineficiente. O problema pode ser: preço de compra alto, desperdício, ou produto subprecificado.\n\n**Análise Horizontal:**\nCompara o mesmo item ao longo de diferentes períodos.\n— Receita cresceu 15% ao ano? Lucro cresceu também ou foi consumido por despesas?\n— Despesas administrativas cresceram 40% enquanto receita cresceu 10%? A estrutura está inchando.\n\n**Combinando as duas:**\nA análise mais poderosa cruza vertical com horizontal:\n— Vertical mostra a estrutura (composição)\n— Horizontal mostra a tendência (evolução)\n— Juntas revelam: "a empresa está melhorando ou piorando, e onde?"\n\n**Índices de Análise Fundamentais:**\n\n**Ciclo Operacional** = Prazo Médio de Estoque + Prazo Médio de Recebimento\n— Quanto tempo entre comprar insumo e receber do cliente\n\n**Ciclo Financeiro** = Ciclo Operacional – Prazo Médio de Pagamento\n— Quanto tempo a empresa financia a operação com capital próprio\n— Negativo = empresa recebe antes de pagar (ideal: Mercado Livre, iFood)\n\n**Giro do Ativo** = Receita Líquida ÷ Ativo Total\n— Quantas vezes o ativo "gira" em receita por ano\n— Varejo: giro alto (3-5x) | Indústria pesada: giro baixo (0.5-1x)\n\nDica: Nunca analise um indicador isolado. ROE alto com endividamento explosivo é uma bomba-relógio. Liquidez alta com ROI baixo é ineficiência. Contexto é tudo.',
          },
          {
            id: 'M6-analise-c1',
            type: 'concept',
            term: 'Análise Vertical vs Análise Horizontal',
            definition: 'Análise Vertical compara itens dentro do mesmo período (cada linha como % de um referencial). Análise Horizontal compara o mesmo item ao longo de diferentes períodos (evolução temporal).',
            example: 'Se o CMV representa 65% da receita (vertical) e cresceu 20% em relação ao ano anterior (horizontal), a empresa está ficando mais ineficiente na produção — o custo está crescendo e pesando mais.',
            antiExample: 'Olhar apenas que o lucro cresceu 10% (horizontal) sem verificar que a margem líquida caiu de 15% para 8% (vertical). O lucro subiu porque a receita explodiu, mas a eficiência despencou.',
          },
          {
            id: 'M6-analise-nc1',
            type: 'number-crunch',
            title: 'Calculadora de Ciclo Financeiro',
            scenario: 'Descubra quanto tempo sua empresa financia a operação com capital próprio. Ciclo financeiro negativo é o ideal — significa que você recebe antes de pagar.',
            inputs: [
              { id: 'pme', label: 'Prazo Médio de Estoque', defaultValue: 45, unit: 'dias', min: 0, max: 360 },
              { id: 'pmr', label: 'Prazo Médio de Recebimento', defaultValue: 30, unit: 'dias', min: 0, max: 360 },
              { id: 'pmp', label: 'Prazo Médio de Pagamento', defaultValue: 40, unit: 'dias', min: 0, max: 360 },
            ],
            formula: '(pme + pmr) - pmp',
            resultLabel: 'Ciclo Financeiro (dias)',
            interpretation: [
              { max: 0, label: 'Ciclo negativo — você recebe antes de pagar. Excelente!', color: 'green' },
              { max: 45, label: 'Ciclo moderado — há espaço para otimizar prazos', color: 'amber' },
              { max: 999, label: 'Ciclo longo — capital de giro sob pressão, risco de caixa', color: 'red' },
            ],
          },
          {
            id: 'M6-0-s1',
            type: 'simulation',
            title: 'Simulador de Valuation — DCF e Múltiplos',
            simulationId: 'valuation-sim',
            description: 'Calcule o valor da sua empresa usando dois métodos: Fluxo de Caixa Descontado (DCF) e Múltiplos de Mercado. Compare os resultados.',
          },
          {
            id: 'M6-0-t2',
            type: 'text',
            title: 'Valuation: Quanto Vale uma Empresa?',
            body: 'Valuation é a estimativa do valor justo de uma empresa. É usado em fusões, aquisições, captação de investimento, venda de participação e planejamento sucessório.\n\n**3 Métodos Principais:**\n\n**1. Fluxo de Caixa Descontado (DCF)**\nO método mais robusto. Projeta os fluxos de caixa livres futuros e traz a valor presente usando uma taxa de desconto (WACC).\n— Valor = Σ(FCL futuro ÷ (1+WACC)^n) + Valor Residual\n— Requer: projeção de receita, custos, investimentos e capital de giro\n— Premissa-chave: taxa de crescimento e taxa de desconto\n— Sensível a: pequenas mudanças nas premissas mudam drasticamente o resultado\n\n**2. Múltiplos de Mercado**\nCompara a empresa com outras similares usando ratios:\n— EV/EBITDA: quantas vezes o EBITDA o mercado está pagando\n— P/L (Preço/Lucro): quantos anos de lucro para "pagar" o preço da ação\n— EV/Receita: usado quando a empresa não tem lucro (startups)\n— Benchmark: SaaS = 8-15x receita | Varejo = 6-10x EBITDA | Indústria = 4-7x EBITDA\n\n**3. Valor Patrimonial**\nValor dos ativos líquidos (Ativo – Passivo). Usado quando a empresa vale mais "desmontada" do que operando, ou para negócios asset-heavy.\n\n**Para startups (pré-receita):**\n— Método Berkus: 5 fatores qualitativos (ideia, protótipo, equipe, mercado, vendas) × até R$ 500k cada\n— Método Scorecard: compara com valuations de startups similares na região\n— Método VC: parte do retorno esperado pelo investidor e calcula para trás\n\nPergunta-chave: Se alguém quisesse comprar sua empresa hoje, qual número você apresentaria? E como justificaria?\n\nCuidado: Valuation não é ciência exata — é argumentação fundamentada. O valor "certo" é aquele que comprador e vendedor concordam.',
          },
          {
            id: 'M6-analise-c2',
            type: 'concept',
            term: 'Valuation por DCF vs Múltiplos',
            definition: 'DCF (Fluxo de Caixa Descontado) projeta fluxos de caixa futuros e traz a valor presente — é intrínseco. Múltiplos comparam a empresa com pares de mercado usando ratios como EV/EBITDA — é relativo.',
            example: 'Uma startup SaaS sem lucro pode ser avaliada por EV/Receita (8-15x). Já uma indústria madura com fluxo previsível é melhor avaliada por DCF, porque seus fluxos futuros são confiáveis.',
            antiExample: 'Usar múltiplos de empresas americanas (EV/EBITDA de 20x) para avaliar PME brasileira. Os mercados são diferentes — risco país, taxa de juros e liquidez mudam tudo.',
          },
          {
            id: 'M6-analise-cmp1',
            type: 'compare',
            title: '3 Métodos de Valuation — Quando Usar Cada Um',
            question: 'Qual método de valuation é mais adequado para cada tipo de empresa?',
            dimensions: ['Melhor para', 'Dados necessários', 'Complexidade', 'Ponto forte', 'Ponto fraco'],
            items: [
              {
                id: 'dcf',
                label: 'DCF (Fluxo de Caixa Descontado)',
                values: [
                  'Empresas com fluxo de caixa previsível',
                  'Projeções de receita, custos, WACC',
                  'Alta — sensível a premissas',
                  'Valor intrínseco, independe do mercado',
                  'Pequenas mudanças nas premissas mudam o resultado drasticamente',
                ],
              },
              {
                id: 'multiplos',
                label: 'Múltiplos de Mercado',
                values: [
                  'Empresas com comparáveis claros',
                  'EBITDA, receita e dados de empresas similares',
                  'Média — depende de encontrar bons comparáveis',
                  'Simples, rápido, reflete o mercado atual',
                  'Se o mercado estiver irracional, o múltiplo também será',
                ],
              },
              {
                id: 'patrimonial',
                label: 'Valor Patrimonial',
                values: [
                  'Empresas asset-heavy ou em liquidação',
                  'Balanço patrimonial atualizado',
                  'Baixa — direto dos demonstrativos',
                  'Objetivo, baseado em ativos reais',
                  'Ignora capacidade de gerar lucro futuro',
                ],
              },
            ],
            insight: 'Na prática, investidores sérios usam os 3 métodos e triangulam. Se DCF diz R$ 10M, múltiplos dizem R$ 8M e patrimonial diz R$ 3M, o valor justo está entre R$ 8-10M, com piso de R$ 3M.',
          },
          {
            id: 'M6-0-t3',
            type: 'text',
            title: 'Gestão de Capital de Giro e Tesouraria',
            body: 'Capital de giro é o dinheiro necessário para manter a operação funcionando no dia a dia. É a diferença entre quanto a empresa tem disponível no curto prazo e quanto deve no curto prazo.\n\n**Capital de Giro Líquido = Ativo Circulante – Passivo Circulante**\n— Positivo: a empresa tem folga para operar\n— Negativo: depende de financiamento externo para girar\n— Zero: opera no limite — qualquer imprevisto gera crise\n\n**Os 4 componentes do ciclo de capital de giro:**\n\n**Estoque** — dinheiro parado em produto. Quanto maior o estoque, mais capital imobilizado.\n— Giro de Estoque = CMV ÷ Estoque Médio\n— Prazo Médio de Estoque = 360 ÷ Giro\n— Meta: reduzir sem causar ruptura (falta de produto)\n\n**Contas a Receber** — dinheiro que o cliente deve.\n— Prazo Médio de Recebimento = (Contas a Receber ÷ Receita) × 360\n— Risco: inadimplência. Taxa média no Brasil: 5-8% do faturamento\n\n**Contas a Pagar** — tempo que o fornecedor financia a empresa.\n— Prazo Médio de Pagamento = (Fornecedores ÷ Compras) × 360\n— Negociar prazos maiores é financiamento gratuito\n\n**Caixa** — reserva de segurança. Regra: mínimo 3 meses de despesas fixas.\n\n**Estratégias para otimizar capital de giro:**\n— Reduzir estoque: just-in-time, previsão de demanda, dropshipping\n— Antecipar recebíveis: desconto de duplicatas (custo: 1.5-4%/mês)\n— Alongar pagamentos: negociar 30→60→90 dias com fornecedores\n— Descontos à vista: oferecer 3-5% para cliente pagar antecipado\n\nIMPORTANTE: 60% das falências no Brasil são causadas por má gestão de capital de giro, não por falta de vendas. A empresa vende, mas o dinheiro não circula na velocidade necessária.',
          },
          {
            id: 'M6-analise-nc2',
            type: 'number-crunch',
            title: 'Calculadora de Necessidade de Capital de Giro',
            scenario: 'Calcule quanto capital de giro sua empresa precisa para operar sem sufoco. Considere estoque, recebíveis e prazos de pagamento.',
            inputs: [
              { id: 'faturamento', label: 'Faturamento mensal', defaultValue: 100000, unit: 'R$', min: 1000, max: 10000000 },
              { id: 'pmr', label: 'Prazo Médio de Recebimento', defaultValue: 30, unit: 'dias', min: 0, max: 180 },
              { id: 'pme', label: 'Prazo Médio de Estoque', defaultValue: 45, unit: 'dias', min: 0, max: 180 },
              { id: 'pmp', label: 'Prazo Médio de Pagamento', defaultValue: 30, unit: 'dias', min: 0, max: 180 },
            ],
            formula: '(faturamento / 30) * ((pmr + pme) - pmp)',
            resultLabel: 'Necessidade de Capital de Giro (R$)',
            interpretation: [
              { max: 0, label: 'Capital de giro negativo — sua operação se autofinancia!', color: 'green' },
              { max: 200000, label: 'Necessidade moderada — mantenha reserva de caixa', color: 'amber' },
              { max: 99999999, label: 'Necessidade alta — planeje fontes de financiamento', color: 'red' },
            ],
          },
          {
            id: 'M6-analise-ex1',
            type: 'inline-exercise',
            prompt: 'Faça o diagnóstico financeiro de uma empresa usando análise vertical e horizontal.',
            context: 'Uma padaria artesanal faturou R$ 50.000/mês em 2024 e R$ 65.000/mês em 2025. O CMV era 40% da receita em 2024 e passou para 52% em 2025. Despesas fixas subiram de R$ 12.000 para R$ 15.000.',
            fields: [
              { id: 'horizontal', label: 'Análise Horizontal — o que cresceu e quanto?', placeholder: 'Receita cresceu X%, CMV cresceu Y%, despesas cresceram Z%...', multiline: true },
              { id: 'vertical', label: 'Análise Vertical — como mudou a estrutura de custos?', placeholder: 'CMV era X% e agora é Y%, o que isso significa...', multiline: true },
              { id: 'diagnostico', label: 'Diagnóstico — a empresa está melhor ou pior? Por quê?', placeholder: 'Considere margem, eficiência e sustentabilidade...', multiline: true },
            ],
            evaluationCriteria: [
              'Calculou corretamente os percentuais de crescimento (horizontal)',
              'Identificou a piora na estrutura de custos (vertical): CMV subiu de 40% para 52%',
              'Concluiu que apesar de faturar mais, a margem está sendo comprimida',
              'Sugeriu possíveis causas (inflação de insumos, desperdício, etc.)',
            ],
            expectedConcepts: ['análise vertical', 'análise horizontal', 'margem', 'estrutura de custos'],
          },
        ],
      },
      {
        id: 'M6-1',
        title: 'Precificacao',
        blocks: [
          {
            id: 'M6-1-t1',
            type: 'text',
            title: 'Precificação Estratégica: Custo, Valor e Mercado',
            body: 'Preço é a única variável do marketing mix que gera receita — todas as outras geram custo. Precificar errado pode destruir um negócio mesmo com produto excelente.\n\n**3 Abordagens de Precificação:**\n\n**1. Baseada em Custo (Cost-Plus)**\nPreço = Custo Total + Margem desejada\n— Vantagem: simples, garante margem mínima\n— Problema: ignora quanto o cliente está disposto a pagar\n— Risco: se o custo for alto, o preço fica fora do mercado\n— Uso: commodities, licitações, indústria\n\n**2. Baseada em Valor (Value-Based)**\nPreço = Valor percebido pelo cliente\n— Vantagem: captura máximo disposição a pagar\n— Problema: requer pesquisa profunda sobre percepção do cliente\n— Exemplo: iPhone — custo de produção ~US$ 400, preço de venda ~US$ 1.200\n— Uso: marcas fortes, produtos diferenciados, SaaS, consultoria\n\n**3. Baseada em Competição (Market-Based)**\nPreço = Referência do mercado ± posicionamento\n— Vantagem: mantém competitividade\n— Problema: corrida ao fundo (race to bottom) se todos baixam preço\n— Uso: mercados commoditizados, e-commerce, varejo\n\n**Conceitos avançados:**\n\n**Elasticidade-Preço** — quanto a demanda muda quando o preço muda:\n— Elástica: variação de 10% no preço → queda > 10% na demanda (luxo, não-essencial)\n— Inelástica: variação de 10% no preço → queda < 10% (combustível, remédios, utilities)\n\n**Preço Âncora** — o primeiro preço que o consumidor vê define a referência mental. "De R$ 299 por R$ 199" funciona porque a âncora (299) define o valor percebido.\n\n**Tiered Pricing** — oferecer 3 opções (básico, profissional, premium). 60-70% dos clientes escolhem o meio. Funciona para SaaS, consultorias e serviços.\n\nPergunta-chave: Você sabe exatamente qual é o seu custo unitário total (incluindo rateio de custos fixos)? Se não sabe, qualquer preço é um chute.',
          },
          {
            id: 'M6-1-s1',
            type: 'simulation',
            title: 'Calculadora de Precificação — 3 Métodos',
            simulationId: 'pricing-strategy',
            description: 'Compare preço por custo, valor e mercado. Descubra qual estratégia maximiza seu resultado.',
          },
          {
            id: 'M6-preco-cmp1',
            type: 'compare',
            title: '3 Abordagens de Precificação — Qual é a Sua?',
            question: 'Cada método tem seu lugar. Qual se aplica ao seu negócio?',
            dimensions: ['Lógica', 'Pergunta-chave', 'Vantagem', 'Risco', 'Melhor para'],
            items: [
              {
                id: 'custo',
                label: 'Baseada em Custo',
                values: [
                  'Custo + margem = preço',
                  'Qual é meu custo total?',
                  'Simples, garante margem mínima',
                  'Ignora disposição a pagar do cliente',
                  'Commodities, licitações, indústria',
                ],
              },
              {
                id: 'valor',
                label: 'Baseada em Valor',
                values: [
                  'Valor percebido = preço',
                  'Quanto o cliente pagaria?',
                  'Captura máximo valor',
                  'Requer pesquisa profunda',
                  'Marcas fortes, SaaS, consultoria',
                ],
                highlight: 'iPhone: custo ~US$ 400, preço ~US$ 1.200. A diferença é valor percebido.',
              },
              {
                id: 'mercado',
                label: 'Baseada em Competição',
                values: [
                  'Referência do mercado ± ajuste',
                  'Quanto o concorrente cobra?',
                  'Mantém competitividade',
                  'Race to bottom — todos baixam preço',
                  'E-commerce, varejo, commodities',
                ],
              },
            ],
            insight: 'Empresas maduras combinam as 3: custo define o PISO, mercado define a FAIXA, e valor define o TETO. O erro é usar apenas uma.',
          },
          {
            id: 'M6-preco-d1',
            type: 'decision',
            scenario: 'Você tem uma consultoria de marketing digital. Seu custo por projeto é R$ 3.000. A concorrência cobra entre R$ 5.000 e R$ 8.000. Um cliente grande diz que seu trabalho vale R$ 15.000 para ele (vai gerar R$ 150.000 em receita). Como você precifica?',
            options: [
              { label: 'R$ 4.500 (custo + 50% de margem)', tradeoffs: { upside: 'Preço seguro, garante margem', downside: 'Deixa R$ 10.000+ de valor na mesa', risk: 'low' } },
              { label: 'R$ 7.000 (referência de mercado)', tradeoffs: { upside: 'Competitivo, fácil de justificar', downside: 'Não captura o valor real que entrega', risk: 'low' } },
              { label: 'R$ 12.000 (baseado no valor gerado)', tradeoffs: { upside: 'Captura valor proporcional ao resultado', downside: 'Pode perder cliente se não provar ROI antes', risk: 'medium' } },
            ],
            realWorldAnalog: 'McKinsey e Bain cobram por valor, não por hora. Um projeto de estratégia pode custar R$ 2M porque o impacto esperado é R$ 200M.',
            lesson: 'Se você cobra por custo, compete por preço. Se cobra por valor, compete por resultado. A mudança é de mindset, não de planilha.',
          },
          {
            id: 'M6-1-t2',
            type: 'text',
            title: 'Markup, Margem e Ponto de Equilíbrio',
            body: 'Markup e margem são conceitos relacionados mas diferentes — confundi-los é um erro comum que distorce toda a análise de preço.\n\n**Markup** (fator multiplicador):\nMarkup = Preço de Venda ÷ Custo\n— Custo: R$ 50 | Preço: R$ 100 → Markup = 2.0 (ou 100%)\n— Fórmula reversa: Preço = Custo × (1 + Markup%)\n\n**Margem de Lucro** (% do preço):\nMargem = (Preço – Custo) ÷ Preço × 100\n— Custo: R$ 50 | Preço: R$ 100 → Margem = 50%\n\n**A armadilha:**\nMarkup de 100% NÃO é margem de 100%. É margem de 50%.\nMarkup de 50% = margem de 33%.\nMarkup de 30% = margem de 23%.\nMuitos empreendedores acham que aplicam 50% de margem quando na verdade aplicam 33%.\n\n**Ponto de Equilíbrio (Break-Even):**\nQuantas unidades preciso vender para cobrir todos os custos?\n— PE (unidades) = Custos Fixos ÷ (Preço Unitário – Custo Variável Unitário)\n— PE (receita) = Custos Fixos ÷ Margem de Contribuição %\n\nExemplo:\n— Custos Fixos: R$ 30.000/mês (aluguel, salários, sistemas)\n— Preço de Venda: R$ 100\n— Custo Variável: R$ 40/unidade\n— Margem de Contribuição: R$ 60 (60%)\n— PE = 30.000 ÷ 60 = 500 unidades/mês\n— Abaixo de 500: prejuízo. Acima: lucro.\n\n**Margem de Contribuição** é o conceito mais importante da precificação:\nMC = Preço – Custos Variáveis\n— Cada venda contribui com MC para cobrir custos fixos\n— Após cobrir fixos, cada MC adicional é lucro puro\n— MC negativa: cada venda AUMENTA o prejuízo (vender mais piora a situação)\n\nIMPORTANTE: Se sua margem de contribuição é negativa, o problema não é volume — é preço ou custo variável. Vender mais só acelera o prejuízo.',
          },
          {
            id: 'M6-1-s2',
            type: 'simulation',
            title: 'Calculadora de Break-Even — Ponto de Equilíbrio',
            simulationId: 'breakeven-calc',
            description: 'Descubra quantas unidades precisa vender para cobrir seus custos. Visualize lucro vs prejuízo.',
          },
          {
            id: 'M6-preco-c1',
            type: 'concept',
            term: 'Markup vs Margem de Lucro',
            definition: 'Markup é o fator multiplicador sobre o custo (Preço ÷ Custo). Margem é o percentual do preço que é lucro ((Preço - Custo) ÷ Preço). Markup de 100% = Margem de 50%. São conceitos diferentes!',
            example: 'Custo R$ 50, Preço R$ 100: Markup = 100% (dobrou o custo). Margem = 50% (metade do preço é lucro). Muitos empreendedores confundem e acham que têm 100% de margem.',
            antiExample: 'Dizer "aplico margem de 50%" quando na verdade aplica markup de 50% (que é margem de 33%). Esse erro pode fazer a empresa operar com 17% menos lucro do que imagina.',
          },
          {
            id: 'M6-preco-nc1',
            type: 'number-crunch',
            title: 'Calculadora de Margem vs Markup',
            scenario: 'Descubra a diferença real entre markup e margem. Muitos empreendedores perdem dinheiro por confundir os dois.',
            inputs: [
              { id: 'custo', label: 'Custo unitário do produto', defaultValue: 50, unit: 'R$', min: 1, max: 100000 },
              { id: 'markup', label: 'Markup aplicado', defaultValue: 100, unit: '%', min: 1, max: 500 },
            ],
            formula: '(markup / (100 + markup)) * 100',
            resultLabel: 'Margem real de lucro (%)',
            interpretation: [
              { max: 20, label: 'Margem baixa — cuidado com custos fixos', color: 'red' },
              { max: 40, label: 'Margem moderada — viável para varejo', color: 'amber' },
              { max: 100, label: 'Margem saudável — boa lucratividade', color: 'green' },
            ],
          },
          {
            id: 'M6-preco-ex1',
            type: 'inline-exercise',
            prompt: 'Calcule o ponto de equilíbrio e defina a estratégia de precificação de um restaurante.',
            context: 'Um restaurante tem custos fixos de R$ 45.000/mês (aluguel, salários, conta de luz). O prato médio custa R$ 18 em ingredientes e é vendido a R$ 55. O restaurante serve em média 40 pratos/dia, 26 dias/mês.',
            fields: [
              { id: 'mc', label: 'Qual a margem de contribuição por prato?', placeholder: 'Preço - Custo Variável = ...' },
              { id: 'pe', label: 'Quantos pratos/mês precisa vender para empatar? (Break-even)', placeholder: 'Custos Fixos ÷ MC = ...' },
              { id: 'situacao', label: 'Com 40 pratos/dia × 26 dias = 1.040/mês, está lucrando ou perdendo?', placeholder: 'Compare com o break-even...', multiline: true },
              { id: 'estrategia', label: 'Se quer aumentar o lucro em 30%, o que faria: subir preço, reduzir custo ou vender mais?', placeholder: 'Justifique com números...', multiline: true },
            ],
            evaluationCriteria: [
              'MC = R$ 55 - R$ 18 = R$ 37 por prato',
              'PE = 45.000 ÷ 37 = ~1.216 pratos/mês',
              'Vende 1.040 < 1.216 = está no PREJUÍZO (~R$ 6.500/mês)',
              'Propôs solução viável com cálculos (ex: subir para R$ 62 ou reduzir fixos)',
            ],
            expectedConcepts: ['margem de contribuição', 'ponto de equilíbrio', 'custo fixo', 'custo variável'],
          },
        ],
      },
      {
        id: 'M6-2',
        title: 'Etica',
        blocks: [
          {
            id: 'M6-2-t1',
            type: 'text',
            title: 'Ética Empresarial: Fundamentos e Frameworks Decisórios',
            body: 'Ética empresarial não é filantropia nem compliance — é o sistema de princípios que orienta decisões quando a lei não dá resposta clara ou quando o legal não coincide com o correto.\n\n**Por que ética importa para negócios?**\n— Reputação é o ativo mais valioso e mais frágil de uma empresa\n— 73% dos consumidores deixam de comprar de marcas envolvidas em escândalos éticos (Edelman Trust Barometer)\n— Processos trabalhistas, ambientais e de consumidor custam em média 8% do faturamento anual\n— ESG e governança exigem postura ética documentada e praticada\n\n**4 Frameworks Éticos para Decisão:**\n\n**Utilitarismo** (Bentham, Mill)\n— Pergunta: "Qual decisão gera o maior bem para o maior número de pessoas?"\n— Aplicação: análise custo-benefício social\n— Limite: pode justificar sacrificar uma minoria pelo bem da maioria\n\n**Deontologia** (Kant)\n— Pergunta: "Eu aceitaria que essa ação fosse uma regra universal?"\n— Aplicação: princípios invioláveis (não mentir, não explorar, cumprir contratos)\n— Limite: pode ser rígido em situações de trade-off complexo\n\n**Ética das Virtudes** (Aristóteles)\n— Pergunta: "Uma pessoa de caráter exemplar faria isso?"\n— Aplicação: cultura organizacional, formação de líderes\n— Limite: subjetivo — depende do que se considera "virtuoso"\n\n**Contratualismo** (Rawls)\n— Pergunta: "Se eu não soubesse qual papel ocuparia nessa situação, aceitaria essa decisão?"\n— Aplicação: políticas de diversidade, equidade salarial, justiça organizacional\n— Limite: abstrato para decisões operacionais rápidas\n\nNa prática: Quando enfrentar um dilema ético, passe a decisão pelos 4 filtros. Se todos apontam na mesma direção, a resposta é clara. Se divergem, o dilema é real e merece deliberação coletiva.\n\nPergunta-chave: Sua empresa tem um código de ética? Se sim, os funcionários sabem que ele existe? Se sabem, já viram ele ser aplicado em uma situação real?',
          },
          {
            id: 'M6-etica-c1',
            type: 'concept',
            term: 'Utilitarismo vs Deontologia',
            definition: 'Utilitarismo julga ações pelo resultado ("o maior bem para o maior número"). Deontologia julga pela intenção e pelo princípio ("existem regras invioláveis, independente do resultado").',
            example: 'Demitir 100 para salvar 1.000 empregos: o utilitarista aprova (resultado líquido positivo). O deontologista questiona: tratar pessoas como meio para um fim viola a dignidade.',
            antiExample: 'Usar análise custo-benefício para decidir se vale esconder um defeito de produto. O utilitarista pode calcular que recall custa mais que indenizações. O deontologista diz: mentir é errado, ponto.',
          },
          {
            id: 'M6-etica-d1',
            type: 'decision',
            scenario: 'Sua empresa descobriu que um lote de produto tem defeito que causa risco baixo (1 em 10.000) de lesão leve. O recall custaria R$ 2 milhões. Não fazer nada e pagar indenizações eventuais custaria ~R$ 300 mil. O que você faz?',
            options: [
              { label: 'Fazer o recall imediato', tradeoffs: { upside: 'Protege consumidores, fortalece reputação, evita processo coletivo', downside: 'Custo de R$ 2M e possível pânico desnecessário', risk: 'low' } },
              { label: 'Não fazer recall, lidar caso a caso', tradeoffs: { upside: 'Economiza R$ 1.7M no curto prazo', downside: 'Se vazar, escândalo destrói a marca. Risco legal pessoal do gestor', risk: 'high' } },
              { label: 'Recall silencioso — trocar apenas se cliente reclamar', tradeoffs: { upside: 'Custo moderado, menos exposição', downside: 'Não protege quem não sabe do defeito. Se descoberto, piora a crise', risk: 'medium' } },
            ],
            realWorldAnalog: 'Ford Pinto (1970s): a Ford calculou que era mais barato pagar indenizações por mortes do que fazer recall. Quando o memo vazou, a marca sofreu dano bilionário e o caso virou símbolo de antiética corporativa.',
            lesson: 'O cálculo utilitarista puro pode ser legalmente correto e moralmente catastrófico. O teste do jornal: se essa decisão saísse na Folha de São Paulo amanhã, você ficaria confortável?',
          },
          {
            id: 'M6-2-t2',
            type: 'text',
            title: 'Dilemas Éticos Contemporâneos: IA, Dados e Trabalho',
            body: 'A tecnologia criou novos dilemas éticos que não existiam há 10 anos. Gestores precisam navegar essas questões sem precedentes claros.\n\n**IA e Viés Algorítmico:**\n— Algoritmos de RH que discriminam por gênero, raça ou idade\n— IA de crédito que nega empréstimos baseada em CEP (proxy para raça/classe)\n— Reconhecimento facial com taxas de erro 10x maiores para pessoas negras\n— Pergunta ética: quem é responsável quando a IA erra — o desenvolvedor, a empresa que contratou, ou o gestor que aprovou?\n\n**Privacidade e Dados:**\n— LGPD/GDPR: consentimento informado para coleta e uso de dados\n— Dark patterns: interfaces que manipulam o usuário para compartilhar mais dados\n— Venda de dados para terceiros sem transparência\n— Monitoramento de funcionários (câmeras, keyloggers, rastreamento de produtividade)\n— Pergunta ética: até onde a empresa pode monitorar sem invadir a privacidade?\n\n**Trabalho e Dignidade:**\n— Gig economy: motoristas e entregadores sem direitos trabalhistas\n— Precarização disfarçada de "empreendedorismo"\n— Automação que elimina postos — a empresa tem responsabilidade com os demitidos?\n— Disparidade salarial: CEO ganha 300x mais que operário médio (nos EUA)\n— Pergunta ética: eficiência justifica qualquer forma de relação de trabalho?\n\n**Greenwashing e Socialwashing:**\n— Empresas que vendem imagem sustentável sem práticas reais\n— Marketing de diversidade sem diversidade no board\n— Relatórios ESG com métricas escolhidas a dedo\n— Certificações compradas sem mudança de comportamento\n\nDica: A ética empresarial não é sobre ter respostas certas — é sobre fazer as perguntas certas antes de agir. O teste do jornal: "Se essa decisão saísse na capa do jornal amanhã, eu ficaria confortável?"',
          },
          {
            id: 'M6-etica-cmp1',
            type: 'compare',
            title: '4 Frameworks Éticos — Qual Guia Sua Decisão?',
            question: 'Diante de um dilema ético, cada framework aponta para uma direção. Quando divergem, o dilema é real.',
            dimensions: ['Pergunta central', 'Foco', 'Força', 'Limite', 'Exemplo de aplicação'],
            items: [
              {
                id: 'utilitarismo',
                label: 'Utilitarismo',
                values: [
                  'Qual decisão gera o maior bem?',
                  'Resultado/consequência',
                  'Prático, mensurável',
                  'Pode sacrificar minoria',
                  'Análise custo-benefício de recall',
                ],
              },
              {
                id: 'deontologia',
                label: 'Deontologia',
                values: [
                  'Isso seria aceitável como regra universal?',
                  'Princípio/dever',
                  'Princípios invioláveis',
                  'Rígido em trade-offs',
                  'Nunca mentir em relatório, mesmo que beneficie',
                ],
              },
              {
                id: 'virtudes',
                label: 'Ética das Virtudes',
                values: [
                  'Uma pessoa exemplar faria isso?',
                  'Caráter/integridade',
                  'Forma líderes éticos',
                  'Subjetivo',
                  'Cultura organizacional e formação de líderes',
                ],
              },
              {
                id: 'contratualismo',
                label: 'Contratualismo',
                values: [
                  'Se eu não soubesse meu papel, aceitaria?',
                  'Justiça/equidade',
                  'Promove justiça social',
                  'Abstrato demais',
                  'Política salarial, diversidade, equidade',
                ],
              },
            ],
            insight: 'Na prática empresarial: se os 4 frameworks apontam na mesma direção, a decisão é clara. Se divergem, reserve tempo para deliberação coletiva — o dilema é genuíno.',
          },
          {
            id: 'M6-etica-ex1',
            type: 'inline-exercise',
            prompt: 'Aplique os 4 frameworks éticos a um dilema real de negócios.',
            context: 'Sua empresa de tecnologia usa IA para aprovar crédito. Você descobre que o algoritmo aprova 85% dos pedidos de bairros ricos e apenas 40% de bairros periféricos — mesmo quando renda e score são iguais. O algoritmo usa CEP como variável.',
            fields: [
              { id: 'utilitarista', label: 'Análise Utilitarista — qual decisão gera mais bem?', placeholder: 'Considere: manter reduz inadimplência, mas exclui milhares de pessoas...', multiline: true },
              { id: 'deontologica', label: 'Análise Deontológica — isso seria aceitável como regra universal?', placeholder: 'Discriminar por local de moradia é um princípio que você universalizaria?', multiline: true },
              { id: 'virtudes', label: 'Ética das Virtudes — um líder exemplar manteria esse algoritmo?', placeholder: '', multiline: true },
              { id: 'decisao', label: 'Sua decisão final — o que fazer e por quê?', placeholder: 'Considere: remover CEP, auditar viés, compensar os prejudicados...', multiline: true },
            ],
            evaluationCriteria: [
              'Identificou que usar CEP como proxy funciona como discriminação indireta',
              'Aplicou pelo menos 2 frameworks com profundidade',
              'Reconheceu o trade-off entre eficiência do modelo e justiça social',
              'Propôs ação concreta (não apenas "melhorar o algoritmo")',
            ],
            expectedConcepts: ['viés algorítmico', 'discriminação indireta', 'LGPD', 'frameworks éticos'],
          },
          {
            id: 'M6-2-s1',
            type: 'simulation',
            title: 'Árvore de Decisão Ética — Navegue os Dilemas',
            simulationId: 'ethics-decision-tree',
            description: 'Enfrente 5 dilemas éticos empresariais e descubra qual framework filosófico mais alinha com suas decisões.',
          },
        ],
      },
    ],
  },
  {
    moduleId: 'M7',
    topics: [
      {
        id: 'M7-0',
        title: 'Empreendedorismo Social',
        blocks: [
          {
            id: 'M7-0-t1',
            type: 'text',
            title: 'Empreendedorismo Social: Lucro com Propósito',
            body: 'Empreendedorismo social aplica a lógica empresarial para resolver problemas sociais e ambientais. Diferente de ONG (que depende de doações) e de empresa tradicional (que maximiza lucro), o negócio social busca sustentabilidade financeira COM impacto positivo.\n\n**Muhammad Yunus** (Nobel da Paz, 2006) — fundou o Grameen Bank em Bangladesh: microcrédito para pessoas em extrema pobreza sem garantias. Provou que os mais pobres são bons pagadores (inadimplência < 2%) e que negócios podem existir para resolver problemas sociais.\n\n**Tipos de Empreendedorismo Social:**\n\n**Negócio Social (Yunus)** — empresa que cobre custos e gera lucro moderado, mas reinveste tudo na missão social. Não distribui dividendos.\n\n**Empresa B (B Corp)** — empresa tradicional com compromisso formal de gerar benefício social/ambiental. Certificada pelo B Lab. Distribui lucro, mas equilibra retorno financeiro com impacto.\n\n**Organização Híbrida** — combina receita de mercado com doações/grants. Modelo comum em educação e saúde.\n\n**Negócio de Impacto** — qualquer negócio que resolve um problema social/ambiental de forma sustentável financeiramente.\n\n**Exemplos brasileiros:**\n— Gerando Falcões: ecossistema de impacto social em favelas (educação, emprego, moradia)\n— Badu Design: transforma resíduos têxteis em produtos de moda em comunidades\n— Geekie: tecnologia educacional adaptativa para escolas públicas\n— Vivenda: reforma de moradias precárias com financiamento acessível\n— BrazilFoundation: conecta doadores internacionais a projetos sociais brasileiros\n\n**Teoria da Mudança (Theory of Change):**\nFramework que conecta:\n1. Recursos (inputs) → o que você investe\n2. Atividades → o que você faz\n3. Produtos (outputs) → o que você entrega\n4. Resultados (outcomes) → o que muda na vida das pessoas\n5. Impacto → a mudança sistêmica de longo prazo\n\nPergunta-chave: Qual problema social ou ambiental sua empresa poderia resolver como parte do modelo de negócio — não como filantropia, mas como estratégia?',
          },
          {
            id: 'M7-social-c1',
            type: 'concept',
            term: 'Negócio Social vs Empresa B vs ONG',
            definition: 'Negócio Social (Yunus) reinveste todo lucro na missão. Empresa B (B Corp) distribui lucro mas equilibra com impacto. ONG depende de doações e não visa lucro. Os três resolvem problemas sociais, mas com modelos financeiros diferentes.',
            example: 'Grameen Bank (Yunus): microcrédito para extrema pobreza, reinveste tudo. Natura (B Corp): distribui dividendos mas se compromete com impacto ambiental certificado pelo B Lab.',
            antiExample: 'Empresa que doa 1% do lucro para caridade NÃO é negócio social. É filantropia corporativa. O impacto social precisa estar no MODELO de negócio, não no destino de uma fração do lucro.',
          },
          {
            id: 'M7-social-cmp1',
            type: 'compare',
            title: 'Modelos de Impacto Social — Qual Estrutura Escolher?',
            question: 'Cada modelo tem implicações diferentes para governança, financiamento e escala.',
            dimensions: ['Objetivo principal', 'Distribuição de lucro', 'Fonte de receita', 'Exemplo brasileiro', 'Escalabilidade'],
            items: [
              {
                id: 'negocio-social',
                label: 'Negócio Social',
                values: [
                  'Resolver problema social',
                  'Reinveste 100%',
                  'Venda de produtos/serviços',
                  'Vivenda (reforma de moradias)',
                  'Alta — modelo autossustentável',
                ],
              },
              {
                id: 'empresa-b',
                label: 'Empresa B (B Corp)',
                values: [
                  'Lucro + impacto equilibrados',
                  'Distribui, com compromisso social',
                  'Mercado tradicional',
                  'Natura, Fazenda Futuro',
                  'Alta — atrai investidores tradicionais',
                ],
                highlight: 'Natura: primeira empresa B Corp listada em bolsa na América Latina.',
              },
              {
                id: 'ong',
                label: 'ONG / OSCIP',
                values: [
                  'Impacto social puro',
                  'Não há lucro',
                  'Doações, grants, editais',
                  'Gerando Falcões',
                  'Limitada — depende de captação',
                ],
              },
              {
                id: 'hibrida',
                label: 'Organização Híbrida',
                values: [
                  'Sustentabilidade + impacto',
                  'Parcial ou nenhuma',
                  'Mercado + doações/grants',
                  'Geekie (edtech para escolas públicas)',
                  'Média — depende de mix de receita',
                ],
              },
            ],
            insight: 'A tendência global é convergência: empresas tradicionais incorporam impacto (ESG), e negócios sociais adotam práticas de mercado. O modelo "puro" de cada tipo está ficando raro.',
          },
          {
            id: 'M7-social-d1',
            type: 'decision',
            scenario: 'Você criou uma startup de educação que ensina programação para jovens de comunidades. O projeto atende 500 alunos gratuitamente. Um investidor oferece R$ 2 milhões, mas exige que 30% dos alunos paguem mensalidade para gerar receita. Isso excluiria os mais vulneráveis.',
            options: [
              { label: 'Aceitar o investimento e cobrar dos 30%', tradeoffs: { upside: 'Capital para escalar de 500 para 5.000 alunos', downside: 'Exclui justamente quem mais precisa. Missão comprometida.', risk: 'medium' } },
              { label: 'Recusar e buscar grants/doações', tradeoffs: { upside: 'Mantém 100% gratuito, missão intacta', downside: 'Crescimento lento, depende de doadores', risk: 'medium' } },
              { label: 'Negociar modelo híbrido: empresas patrocinam vagas', tradeoffs: { upside: 'Empresas pagam, alunos não. Win-win-win.', downside: 'Complexo de operar. Depende de parcerias corporativas.', risk: 'low' } },
            ],
            realWorldAnalog: 'Gerando Falcões usa modelo híbrido: grandes empresas financiam programas sociais em troca de impacto mensurável e associação de marca. Escala sem cobrar do público-alvo.',
            lesson: 'O dilema "escala vs missão" é falso quando você inova no MODELO DE FINANCIAMENTO. A criatividade não é só no produto — é em como pagar por ele.',
          },
          {
            id: 'M7-0-t2',
            type: 'text',
            title: 'Medindo Impacto Social: SROI e Métricas de Resultado',
            body: 'Sem medir, não há como provar impacto — e sem provar, não há como escalar. A mensuração de impacto social é o equivalente ao DRE para negócios sociais.\n\n**SROI — Social Return on Investment:**\nConceito: para cada R$ 1 investido, quanto valor social é gerado?\n— SROI de 3:1 significa que cada real investido gera R$ 3 em valor social\n— Combina dados quantitativos (econômicos) com qualitativos (bem-estar, dignidade)\n\n**Cálculo simplificado:**\n1. Identificar stakeholders afetados\n2. Mapear mudanças (outcomes) para cada grupo\n3. Atribuir valor monetário às mudanças (proxy financeiro)\n4. Deduzir o que teria acontecido sem a intervenção (deadweight)\n5. Calcular: SROI = Valor Social Líquido ÷ Investimento Total\n\n**Outras Métricas de Impacto:**\n\n**IRIS+** (GIIN — Global Impact Investing Network)\n— Catálogo padronizado de métricas de impacto\n— 500+ indicadores organizados por tema (educação, saúde, meio ambiente, emprego)\n— Permite comparabilidade entre organizações\n\n**ODS como framework de impacto:**\n— Conectar suas métricas aos 17 Objetivos de Desenvolvimento Sustentável da ONU\n— Exemplo: programa de capacitação profissional → ODS 4 (educação), ODS 8 (trabalho), ODS 10 (redução de desigualdades)\n\n**Armadilhas da mensuração:**\n— Confundir outputs com outcomes (formar 100 pessoas ≠ 100 pessoas empregadas)\n— Não considerar deadweight (o que teria acontecido sem a intervenção)\n— Cherry-picking de métricas favoráveis\n— Ignorar efeitos negativos não-intencionais\n\nNa prática: Comece simples. Defina 3-5 indicadores-chave que conectam sua atividade ao resultado na vida das pessoas. Meça trimestralmente. Relate com transparência — inclusive fracassos.',
          },
          {
            id: 'M7-social-nc1',
            type: 'number-crunch',
            title: 'Calculadora de SROI — Retorno Social sobre Investimento',
            scenario: 'Calcule quanto valor social seu projeto gera para cada real investido. SROI > 1 significa que o projeto gera mais valor do que consome.',
            inputs: [
              { id: 'investimento', label: 'Investimento total no projeto', defaultValue: 100000, unit: 'R$', min: 1000, max: 10000000 },
              { id: 'beneficiarios', label: 'Número de beneficiários diretos', defaultValue: 200, unit: 'pessoas', min: 1, max: 100000 },
              { id: 'valorPessoa', label: 'Valor social gerado por pessoa (proxy)', defaultValue: 1500, unit: 'R$', min: 100, max: 50000 },
              { id: 'deadweight', label: 'Deadweight — % que aconteceria sem o projeto', defaultValue: 20, unit: '%', min: 0, max: 80 },
            ],
            formula: '((beneficiarios * valorPessoa * (1 - deadweight / 100)) / investimento)',
            resultLabel: 'SROI (valor social por R$ investido)',
            interpretation: [
              { max: 1, label: 'SROI < 1 — projeto consome mais do que gera. Reavalie.', color: 'red' },
              { max: 3, label: 'SROI moderado — há espaço para otimizar impacto', color: 'amber' },
              { max: 999, label: 'SROI forte — cada real gera múltiplos em valor social!', color: 'green' },
            ],
          },
          {
            id: 'M7-social-ex1',
            type: 'inline-exercise',
            prompt: 'Desenhe a Teoria da Mudança de um negócio de impacto social.',
            context: 'Escolha um problema social brasileiro (educação, saúde, moradia, emprego, meio ambiente) e projete um negócio que o resolva de forma sustentável financeiramente.',
            fields: [
              { id: 'problema', label: 'Problema social escolhido (1 frase específica)', placeholder: 'Ex: 40% dos jovens de 18-24 anos em favelas de SP estão desempregados' },
              { id: 'inputs', label: 'Recursos (inputs) — o que você investiria?', placeholder: 'Ex: R$ 200k, 5 instrutores, parceria com empresas de tecnologia...', multiline: true },
              { id: 'atividades', label: 'Atividades — o que seu negócio faria?', placeholder: 'Ex: bootcamp de 3 meses em programação, mentoria individual, conexão com empresas...' },
              { id: 'outcomes', label: 'Resultados (outcomes) — o que muda na vida das pessoas?', placeholder: 'Ex: 70% empregados em 6 meses, renda média de R$ 3.500/mês...', multiline: true },
              { id: 'modelo', label: 'Como o negócio se sustenta financeiramente?', placeholder: 'Ex: empresas pagam fee por cada contratação, governo subsidia vagas...' },
            ],
            evaluationCriteria: [
              'Problema é específico e mensurável (não genérico)',
              'Teoria da Mudança conecta inputs → atividades → outputs → outcomes → impacto',
              'Modelo financeiro é viável e não depende 100% de doações',
              'Outcomes são mensuráveis e conectados ao problema original',
            ],
            expectedConcepts: ['teoria da mudança', 'negócio de impacto', 'SROI', 'outcomes vs outputs'],
          },
        ],
      },
      {
        id: 'M7-1',
        title: 'Teologia e Sociedade',
        blocks: [
          {
            id: 'M7-1-t1',
            type: 'text',
            title: 'Fé, Valores e Liderança: A Dimensão Espiritual nos Negócios',
            body: 'A interseção entre espiritualidade e gestão é um campo crescente na academia e na prática empresarial. Não se trata de religião institucional — trata-se de propósito, valores e sentido do trabalho.\n\n**Por que isso importa para gestores?**\n— 87% dos brasileiros se declaram religiosos ou espirituais (Datafolha, 2023)\n— Funcionários que encontram sentido no trabalho são 3x mais engajados (Gallup)\n— Empresas com propósito definido superam S&P 500 em 400% em 10 anos (Firms of Endearment)\n— A geração Z prioriza propósito sobre salário na escolha de emprego\n\n**Doutrina Social da Igreja e Negócios:**\nA Doutrina Social da Igreja Católica, desenvolvida desde a Rerum Novarum (1891), oferece princípios aplicáveis à gestão:\n\n**Dignidade da Pessoa Humana** — todo trabalho deve preservar a dignidade. Implicação: condições de trabalho, salário justo, respeito à diversidade.\n\n**Bem Comum** — a empresa existe não apenas para o acionista, mas para contribuir com a sociedade. Implicação: stakeholder capitalism vs shareholder capitalism.\n\n**Subsidiariedade** — decisões devem ser tomadas no nível mais próximo possível de quem é afetado. Implicação: descentralização, empowerment, liderança servidora.\n\n**Solidariedade** — interdependência entre as pessoas. Implicação: cadeia de valor justa, comércio justo, responsabilidade com comunidades.\n\n**Destino Universal dos Bens** — os bens da Terra são para todos. Implicação: acesso, inclusão, combate à concentração excessiva.\n\n**Liderança Servidora (Robert Greenleaf):**\nO líder existe para servir a equipe, não o contrário. Características:\n— Escuta ativa antes de decidir\n— Empatia como ferramenta de gestão\n— Compromisso com o crescimento das pessoas\n— Construção de comunidade no ambiente de trabalho\n\nPergunta-chave: Se sua empresa fechasse amanhã, além do impacto financeiro, qual vazio ela deixaria na comunidade? Se a resposta é "nenhum", há uma oportunidade de propósito não explorada.',
          },
          {
            id: 'M7-valores-c1',
            type: 'concept',
            term: 'Liderança Servidora vs Liderança Tradicional',
            definition: 'Na liderança tradicional, a equipe serve o líder. Na liderança servidora (Robert Greenleaf), o líder serve a equipe — removendo obstáculos, desenvolvendo pessoas e priorizando o bem comum sobre o ego.',
            example: 'Luiza Helena Trajano (Magazine Luiza): visita lojas, ouve vendedores, remove burocracias que atrapalham o atendimento. O líder existe para facilitar o trabalho de quem está na ponta.',
            antiExample: 'Líder que centraliza decisões, cobra resultados sem dar recursos, e toma crédito pelo trabalho da equipe. Isso é liderança de poder, não de serviço.',
          },
          {
            id: 'M7-valores-d1',
            type: 'decision',
            scenario: 'Você é CEO de uma empresa com 200 funcionários. A crise econômica exige corte de 15% nos custos. Você pode: (A) demitir 30 pessoas, (B) reduzir salário de todos em 15% temporariamente, ou (C) cortar bônus da diretoria + reduzir 8% geral.',
            options: [
              { label: 'Demitir 30 pessoas (15% do quadro)', tradeoffs: { upside: 'Corte rápido, atinge a meta imediata', downside: 'Destrói moral, perde talentos, custo de rescisão', risk: 'high' } },
              { label: 'Reduzir salário de todos em 15%', tradeoffs: { upside: 'Ninguém perde emprego, solidariedade coletiva', downside: 'Desmotivação geral, melhores talentos podem sair', risk: 'medium' } },
              { label: 'Cortar bônus da diretoria + redução de 8% geral', tradeoffs: { upside: 'Liderança dá o exemplo, corte é mais justo', downside: 'Pode não atingir os 15% necessários', risk: 'medium' } },
            ],
            realWorldAnalog: 'Durante a crise de 2008, a Barry-Wehmiller (CEO Bob Chapman) optou por licenças não-remuneradas rotativas em vez de demissões. Ninguém perdeu emprego. A empresa se recuperou mais rápido que concorrentes.',
            lesson: 'O princípio da Dignidade da Pessoa Humana (Doutrina Social) diz: pessoas não são "recursos" descartáveis. O princípio da Subsidiariedade diz: pergunte aos afetados qual solução preferem.',
          },
          {
            id: 'M7-valores-ex1',
            type: 'inline-exercise',
            prompt: 'Avalie se sua empresa (ou uma que conhece) pratica liderança servidora.',
            context: 'Robert Greenleaf definiu 5 características da liderança servidora: escuta ativa, empatia, compromisso com crescimento das pessoas, construção de comunidade, e decisão ética.',
            fields: [
              { id: 'empresa', label: 'Qual empresa você está analisando?', placeholder: 'Nome da empresa e seu papel nela' },
              { id: 'escuta', label: 'Escuta ativa — líderes ouvem antes de decidir?', placeholder: 'Dê exemplo concreto: reuniões, pesquisas internas, 1:1...', multiline: true },
              { id: 'crescimento', label: 'Compromisso com crescimento — investe no desenvolvimento das pessoas?', placeholder: 'Treinamentos, mentoria, plano de carreira...', multiline: true },
              { id: 'gap', label: 'Qual a maior lacuna e o que mudaria?', placeholder: 'Identifique 1 área fraca e proponha 1 ação concreta', multiline: true },
            ],
            evaluationCriteria: [
              'Analisou com exemplos concretos, não genéricos',
              'Diferenciou discurso (o que dizem) de prática (o que fazem)',
              'Identificou pelo menos 1 lacuna real com honestidade',
              'Propôs ação viável e específica (não "melhorar a comunicação")',
            ],
            expectedConcepts: ['liderança servidora', 'dignidade humana', 'bem comum', 'subsidiariedade'],
          },
        ],
      },
      {
        id: 'M7-2',
        title: 'Projeto de Intervencao em Negocios',
        blocks: [
          {
            id: 'M7-2-t1',
            type: 'text',
            title: 'Metodologia de Projeto de Intervenção: Do Diagnóstico à Ação',
            body: 'Um projeto de intervenção é uma ação planejada para resolver um problema específico identificado em uma organização. Diferente de consultoria (que diagnostica e recomenda), a intervenção executa a mudança.\n\n**Etapas do Projeto de Intervenção:**\n\n**1. Diagnóstico Situacional**\n— Análise SWOT aplicada ao problema específico\n— Entrevistas com stakeholders (gestores, funcionários, clientes)\n— Coleta de dados quantitativos (indicadores, relatórios, pesquisas)\n— Resultado: definição clara do problema e suas causas-raiz\n\n**2. Definição do Problema**\n— O problema deve ser específico, mensurável e relevante\n— Errado: "a empresa precisa melhorar"\n— Certo: "a taxa de inadimplência cresceu de 5% para 12% nos últimos 6 meses, causada pela ausência de análise de crédito nos pedidos acima de R$ 5.000"\n\n**3. Objetivos e Metas**\n— Objetivo geral: o que se pretende alcançar (reduzir inadimplência)\n— Objetivos específicos: como (implantar análise de crédito, treinar equipe comercial)\n— Metas: quantificação (reduzir de 12% para 5% em 90 dias)\n\n**4. Plano de Ação (5W2H)**\n— What: o que será feito?\n— Why: por que será feito?\n— Where: onde será implementado?\n— When: quando começa e termina?\n— Who: quem é responsável?\n— How: como será executado?\n— How much: quanto custará?\n\n**5. Execução e Monitoramento**\n— Cronograma com marcos (milestones)\n— Reuniões semanais de acompanhamento\n— Indicadores de progresso vs meta\n— Ajustes rápidos quando algo não funciona\n\n**6. Avaliação de Resultados**\n— Comparar indicadores antes vs depois\n— Documentar lições aprendidas\n— Identificar sustentabilidade da mudança (vai continuar sem o projeto?)\n\n**Ferramentas úteis:**\n— Diagrama de Ishikawa (espinha de peixe): mapear causas-raiz\n— 5 Porquês: aprofundar a causa real do problema\n— Matriz GUT (Gravidade, Urgência, Tendência): priorizar problemas\n— PDCA (Plan-Do-Check-Act): ciclo de melhoria contínua\n\nDica: O maior erro em projetos de intervenção é resolver o sintoma sem atacar a causa. Dedicar 40% do tempo ao diagnóstico correto economiza 80% do tempo de execução.',
          },
          {
            id: 'M7-intervencao-fw1',
            type: 'framework',
            frameworkId: 'intervencao-5w2h',
            title: 'Plano de Ação 5W2H — Monte Seu Projeto de Intervenção',
            description: 'Use o framework 5W2H para estruturar um plano de intervenção real. Preencha cada campo pensando em um problema concreto de uma empresa.',
            fields: [
              { id: 'what', label: 'WHAT — O que será feito?', placeholder: 'Descreva a ação principal da intervenção', helpText: 'Seja específico: não "melhorar vendas", mas "implantar CRM e treinar equipe comercial em 60 dias".' },
              { id: 'why', label: 'WHY — Por que será feito?', placeholder: 'Qual problema resolve? Qual evidência sustenta a necessidade?', helpText: 'Use dados: "inadimplência subiu de 5% para 12% em 6 meses".' },
              { id: 'where', label: 'WHERE — Onde será implementado?', placeholder: 'Qual departamento, filial ou processo?', helpText: 'Foque: não tente mudar a empresa inteira de uma vez.' },
              { id: 'when', label: 'WHEN — Quando começa e termina?', placeholder: 'Datas de início, marcos intermediários e prazo final', helpText: 'Projetos sem prazo não são projetos — são desejos.' },
              { id: 'who', label: 'WHO — Quem é responsável?', placeholder: 'Nome/cargo do líder do projeto e equipe envolvida' },
              { id: 'how', label: 'HOW — Como será executado?', placeholder: 'Etapas principais, ferramentas, método', helpText: 'Pense em 3-5 etapas sequenciais.' },
              { id: 'howmuch', label: 'HOW MUCH — Quanto custará?', placeholder: 'Orçamento estimado: pessoas, ferramentas, tempo', helpText: 'Inclua custo de oportunidade: tempo da equipe dedicado ao projeto.' },
            ],
          },
          {
            id: 'M7-intervencao-cmp1',
            type: 'compare',
            title: 'Ferramentas de Diagnóstico — Qual Usar em Cada Situação?',
            question: 'Cada ferramenta ataca o problema de um ângulo diferente. A combinação é mais poderosa que qualquer uma isolada.',
            dimensions: ['Para que serve', 'Como funciona', 'Quando usar', 'Limitação'],
            items: [
              {
                id: 'ishikawa',
                label: 'Diagrama de Ishikawa',
                values: [
                  'Mapear todas as causas possíveis de um problema',
                  'Categorias: Método, Máquina, Material, Mão de obra, Meio ambiente, Medida',
                  'Problema com múltiplas causas possíveis',
                  'Não prioriza — lista tudo sem filtrar',
                ],
              },
              {
                id: 'cinco-porques',
                label: '5 Porquês',
                values: [
                  'Encontrar a causa-raiz profunda',
                  'Pergunte "por quê?" 5 vezes consecutivas',
                  'Problema com causa aparente superficial',
                  'Pode simplificar demais problemas complexos',
                ],
                highlight: 'Toyota inventou os 5 Porquês. "A máquina parou" → "fusível queimou" → "sobrecarga" → "rolamento seco" → "sem manutenção preventiva" = causa-raiz.',
              },
              {
                id: 'gut',
                label: 'Matriz GUT',
                values: [
                  'Priorizar problemas por importância',
                  'Pontue: Gravidade (1-5), Urgência (1-5), Tendência (1-5). Multiplique.',
                  'Lista de problemas e precisa decidir por qual começar',
                  'Pontuação é subjetiva — depende do avaliador',
                ],
              },
              {
                id: 'pdca',
                label: 'Ciclo PDCA',
                values: [
                  'Melhoria contínua iterativa',
                  'Plan → Do → Check → Act. Repita.',
                  'Qualquer processo que precisa melhorar continuamente',
                  'Lento para problemas urgentes',
                ],
              },
            ],
            insight: 'Na prática: use Ishikawa para MAPEAR causas, 5 Porquês para APROFUNDAR a principal, GUT para PRIORIZAR ações, e PDCA para EXECUTAR e MELHORAR continuamente.',
          },
          {
            id: 'M7-intervencao-d1',
            type: 'decision',
            scenario: 'Você fez o diagnóstico: uma loja de roupas tem taxa de devolução de 25% (média do setor: 8%). O Ishikawa apontou 3 causas: fotos ruins no e-commerce, tabela de medidas imprecisa, e tecido diferente do esperado. Seu orçamento permite atacar apenas 2 causas agora.',
            options: [
              { label: 'Fotos + Tabela de medidas', tradeoffs: { upside: 'Resolve expectativa visual e de tamanho — 2 maiores reclamações', downside: 'Tecido continua frustrando. Cliente recebe e se decepciona.', risk: 'low' } },
              { label: 'Fotos + Qualidade do tecido', tradeoffs: { upside: 'Melhora percepção e realidade do produto', downside: 'Sem tabela correta, devoluções por tamanho errado continuam', risk: 'medium' } },
              { label: 'Tabela de medidas + Qualidade do tecido', tradeoffs: { upside: 'Produto chega como esperado em tamanho e qualidade', downside: 'Fotos ruins continuam gerando expectativa errada', risk: 'medium' } },
            ],
            realWorldAnalog: 'A Zattini reduziu devoluções de 22% para 11% focando em 2 ações: provador virtual (tabela) e fotos em 360° com modelos reais. Qualidade do tecido foi fase 2.',
            lesson: 'Em projetos de intervenção, priorize pelo impacto. Use GUT: qual causa é mais grave, mais urgente e com pior tendência? Comece por ela.',
          },
          {
            id: 'M7-intervencao-ex1',
            type: 'inline-exercise',
            prompt: 'Aplique os 5 Porquês a um problema real de negócio.',
            context: 'Uma empresa de delivery percebeu que as avaliações no iFood caíram de 4.7 para 3.9 nos últimos 3 meses. O dono diz: "os clientes estão exigentes demais".',
            fields: [
              { id: 'porques', label: 'Aplique os 5 Porquês — vá além da resposta óbvia', placeholder: '1. Por que as notas caíram? Porque...\n2. Por que isso acontece? Porque...\n3. Por que? ...\n4. Por que? ...\n5. Por que? ...', multiline: true },
              { id: 'causa-raiz', label: 'Qual é a causa-raiz que você identificou?', placeholder: 'A causa profunda (não o sintoma) é...' },
              { id: 'intervencao', label: 'Proponha 1 ação de intervenção com prazo e responsável', placeholder: 'Ação: ... | Responsável: ... | Prazo: ... | Meta: ...', multiline: true },
            ],
            evaluationCriteria: [
              'Não aceitou a resposta superficial ("clientes exigentes")',
              'Cada "por quê" aprofundou genuinamente — não repetiu a mesma causa com palavras diferentes',
              'Causa-raiz identificada é acionável (algo que pode ser mudado)',
              'Intervenção proposta tem responsável, prazo e meta mensuráveis',
            ],
            expectedConcepts: ['5 porquês', 'causa-raiz', 'diagnóstico', 'intervenção', '5W2H'],
          },
        ],
      },
    ],
  },
  {
    moduleId: 'M8',
    topics: [
      {
        id: 'M8-0',
        title: 'Educacao, Identidade e Solidariedade',
        blocks: [
          {
            id: 'M8-0-t1',
            type: 'text',
            title: 'Educação Corporativa: Aprendizagem como Vantagem Competitiva',
            body: 'A educação corporativa vai além de treinamento — é a estratégia de desenvolver competências alinhadas aos objetivos do negócio. Empresas que aprendem mais rápido que a concorrência vencem no longo prazo.\n\n**Peter Senge e a Organização que Aprende:**\n5 disciplinas para construir uma learning organization:\n1. Domínio Pessoal — compromisso individual com o aprendizado contínuo\n2. Modelos Mentais — questionar premissas e crenças que limitam a visão\n3. Visão Compartilhada — criar um propósito comum que engaja a equipe\n4. Aprendizagem em Equipe — diálogo > debate. Pensar coletivamente > pensar individualmente\n5. Pensamento Sistêmico — ver o todo, não apenas as partes. Entender como ações em uma área afetam o sistema inteiro\n\n**Andragogia — Como Adultos Aprendem:**\nMalcolm Knowles definiu que adultos aprendem diferente de crianças:\n— Precisam saber POR QUE estão aprendendo\n— Aprendem melhor resolvendo problemas reais\n— Trazem experiência prévia que deve ser respeitada\n— São motivados por aplicação prática, não por nota\n— Precisam de autonomia no processo\n\n**Implicações para empresas:**\n— Treinamentos longos e teóricos não funcionam para adultos\n— Microlearning (conteúdo curto, 5-10min) tem retenção 20% maior\n— Learning by doing: projetos reais > salas de aula\n— Mentoria e coaching: aprendizado contextualizado\n— Comunidades de prática: grupos que compartilham conhecimento\n\n**Universidades Corporativas:**\n— Ambev, Natura, Itaú, Magazine Luiza: investem milhões em educação interna\n— Foco: não é substituir universidade formal, é desenvolver competências específicas do negócio\n— ROI da educação corporativa: R$ 4-8 para cada R$ 1 investido (ATD Research)\n\nPergunta-chave: Quanto sua empresa investe por ano em capacitação? A média brasileira é 1.5% da folha de pagamento. Empresas líderes investem 3-5%.',
          },
          {
            id: 'M8-edu-c1',
            type: 'concept',
            term: 'Andragogia vs Pedagogia',
            definition: 'Pedagogia é a ciência de ensinar crianças (o professor decide o quê, como e quando). Andragogia (Malcolm Knowles) é a ciência de ensinar adultos: precisam de propósito, autonomia, aplicação prática e respeito à experiência prévia.',
            example: 'Treinamento corporativo eficaz: "Hoje vamos resolver o problema X que vocês enfrentam no dia a dia" (andragogia). Ineficaz: "Abram na página 42, vamos estudar a teoria Y" (pedagogia aplicada a adultos).',
            antiExample: 'Treinamento de 8 horas em sala com PowerPoint de 200 slides. Adultos retêm <10% nesse formato. Microlearning de 10 minutos com problema real tem retenção 5x maior.',
          },
          {
            id: 'M8-edu-cmp1',
            type: 'compare',
            title: '5 Disciplinas da Organização que Aprende (Senge) — Diagnóstico',
            question: 'Em qual disciplina sua empresa é forte e em qual é fraca?',
            dimensions: ['O que é', 'Pergunta diagnóstica', 'Sinais de força', 'Sinais de fraqueza'],
            items: [
              {
                id: 'dominio-pessoal',
                label: 'Domínio Pessoal',
                values: [
                  'Compromisso individual com aprendizado contínuo',
                  'As pessoas buscam aprender por conta própria?',
                  'Funcionários fazem cursos, leem, pedem feedback',
                  'Ninguém aprende nada novo há meses',
                ],
              },
              {
                id: 'modelos-mentais',
                label: 'Modelos Mentais',
                values: [
                  'Questionar premissas e crenças limitantes',
                  'Quando alguém questiona "sempre fizemos assim", o que acontece?',
                  'Debate saudável, abertura para mudar de ideia',
                  'Resistência a mudança, "aqui sempre foi assim"',
                ],
              },
              {
                id: 'visao-compartilhada',
                label: 'Visão Compartilhada',
                values: [
                  'Propósito comum que engaja todos',
                  'Se perguntar a 10 funcionários "qual nosso objetivo?", quantos respondem igual?',
                  '8 de 10 respondem a mesma coisa',
                  'Cada um puxa para um lado. Sem norte.',
                ],
              },
              {
                id: 'aprendizagem-equipe',
                label: 'Aprendizagem em Equipe',
                values: [
                  'Pensar coletivamente, diálogo > debate',
                  'Reuniões geram soluções novas ou só cobranças?',
                  'Times resolvem problemas juntos, compartilham aprendizados',
                  'Silos, competição interna, "cada um por si"',
                ],
              },
              {
                id: 'pensamento-sistemico',
                label: 'Pensamento Sistêmico',
                values: [
                  'Ver o todo, entender interdependências',
                  'Quando algo dá errado, buscam causa-raiz ou culpado?',
                  'Analisam o sistema, não só o sintoma',
                  'Apagam incêndios sem entender a causa',
                ],
                highlight: 'Pensamento sistêmico é a "quinta disciplina" — integra todas as outras. Sem ele, as 4 anteriores são esforços isolados.',
              },
            ],
            insight: 'A disciplina mais fraca é o gargalo de toda a organização. Investir na mais forte gera retorno marginal decrescente. Foque no elo mais fraco.',
          },
          {
            id: 'M8-0-t2',
            type: 'text',
            title: 'Identidade Organizacional e Cultura: DNA do Negócio',
            body: 'A identidade organizacional é o conjunto de características que tornam a empresa única — como ela se vê, como quer ser vista e como é percebida de fato.\n\n**Os 3 elementos da identidade:**\n\n**Missão** — por que a empresa existe? Qual problema resolve?\n— Ruim: "Ser a melhor empresa do segmento" (genérico, não diferencia)\n— Bom: "Democratizar o acesso à educação financeira para empreendedores brasileiros" (específico, claro, acionável)\n\n**Visão** — onde a empresa quer chegar?\n— Define a ambição de longo prazo\n— Deve ser inspiradora mas alcançável\n— Deve ser revisada a cada 3-5 anos\n\n**Valores** — o que a empresa não negocia?\n— Valores reais vs valores de parede\n— Teste: sua empresa já demitiu alguém por violar um valor? Se não, eles são decorativos.\n— Valores devem guiar decisões difíceis, não apenas discursos bonitos.\n\n**Cultura Organizacional (Edgar Schein):**\n3 níveis de cultura:\n\n**Artefatos** (visível) — escritório, dress code, linguagem, rituais, ferramentas\n— Open office vs salas fechadas diz muito sobre hierarquia\n— Happy hour vs meditação matinal diz muito sobre valores\n\n**Valores Declarados** (consciente) — o que a empresa diz que valoriza\n— Documentado em código de ética, site, onboarding\n\n**Pressupostos Básicos** (inconsciente) — crenças profundas que governam comportamento\n— "Erro é aprendizado" vs "erro é punição"\n— "Meritocracia" vs "quem manda é quem tem mais tempo"\n— "O cliente tem sempre razão" vs "protegemos nosso time primeiro"\n\nDica: Para descobrir a cultura real de uma empresa, não leia o site — observe como as pessoas se comportam quando o chefe não está olhando. A cultura é o que acontece quando ninguém está monitorando.\n\nPergunta-chave: Se um funcionário novo perguntasse "como as coisas realmente funcionam aqui?", o que os colegas diriam em particular?',
          },
          {
            id: 'M8-cultura-fw1',
            type: 'framework',
            frameworkId: 'cultura-schein',
            title: 'Diagnóstico de Cultura Organizacional (Edgar Schein)',
            description: 'Analise os 3 níveis de cultura da sua empresa. Seja brutalmente honesto — a cultura real é o que acontece quando ninguém está monitorando.',
            fields: [
              { id: 'artefatos', label: 'Artefatos (visível) — o que qualquer visitante perceberia?', placeholder: 'Escritório, dress code, linguagem, rituais, ferramentas, horários...', helpText: 'Open office ou salas fechadas? Slack ou e-mail formal? Happy hour ou hora extra?' },
              { id: 'valores', label: 'Valores Declarados — o que a empresa DIZ que valoriza?', placeholder: 'O que está no site, no onboarding, no código de ética?', helpText: 'Liste os 3-5 valores oficiais da empresa.' },
              { id: 'pressupostos', label: 'Pressupostos Básicos — o que REALMENTE governa o comportamento?', placeholder: 'Erro é aprendizado ou punição? Quem cresce: quem entrega ou quem é amigo do chefe?', helpText: 'Pense: se um novo funcionário perguntasse "como as coisas realmente funcionam aqui?", o que diriam?' },
              { id: 'gap', label: 'Qual o GAP entre valores declarados e pressupostos reais?', placeholder: 'Ex: dizemos "inovação" mas punem quem erra. Dizemos "meritocracia" mas promovem por tempo de casa.', helpText: 'Esse gap é o principal risco cultural.' },
            ],
          },
          {
            id: 'M8-cultura-d1',
            type: 'decision',
            scenario: 'Você é RH de uma empresa que diz valorizar "inovação" e "ousadia". Um funcionário propôs uma mudança radical no processo de vendas. O teste piloto falhou e custou R$ 50 mil. O diretor comercial quer punir o funcionário. O que você recomenda?',
            options: [
              { label: 'Punir — dar advertência formal', tradeoffs: { upside: 'Sinaliza responsabilidade com recursos da empresa', downside: 'Mata inovação. Ninguém mais vai arriscar.', risk: 'high' } },
              { label: 'Ignorar — não fazer nada', tradeoffs: { upside: 'Não pune, mas também não aprende', downside: 'Perda de R$ 50k sem nenhuma lição extraída', risk: 'medium' } },
              { label: 'Celebrar a tentativa + extrair aprendizados', tradeoffs: { upside: 'Reforça cultura de inovação, transforma erro em case interno', downside: 'Pode parecer que "gastar R$ 50k em erro é ok"', risk: 'low' } },
            ],
            realWorldAnalog: 'Na Amazon, Jeff Bezos criou o "Just Do It Award" — prêmio para quem tenta algo ousado, mesmo se falhar. O Fire Phone fracassou (R$ 170M de prejuízo), mas a mesma equipe criou a Alexa.',
            lesson: 'Cultura é o que acontece quando alguém erra. Se o erro é punido, os valores de parede ("inovação", "ousadia") são mentira. A reação ao fracasso define a cultura real.',
          },
          {
            id: 'M8-cultura-ex1',
            type: 'inline-exercise',
            prompt: 'Redija a missão, visão e valores de uma empresa real — e teste se são genuínos.',
            context: 'Escolha sua empresa ou uma que conhece bem. Muitas empresas têm missão/visão/valores genéricos de parede que ninguém segue.',
            fields: [
              { id: 'missao', label: 'Missão — por que a empresa existe? (1 frase)', placeholder: 'Não vale "ser a melhor". Específico e acionável. Teste: se trocar o nome da empresa, a missão ainda funciona? Se sim, é genérica demais.' },
              { id: 'visao', label: 'Visão — onde quer chegar em 5 anos? (1 frase)', placeholder: 'Deve ser inspiradora mas alcançável' },
              { id: 'valores', label: 'Liste 3 valores — e para cada um, dê 1 exemplo REAL de quando foi praticado', placeholder: 'Valor 1: Transparência → Exemplo: CEO compartilhou resultados ruins abertamente em reunião all-hands', multiline: true },
              { id: 'teste', label: 'Teste do fogo: a empresa já demitiu ou puniu alguém por violar algum desses valores?', placeholder: 'Se a resposta é "não", os valores podem ser decorativos...', multiline: true },
            ],
            evaluationCriteria: [
              'Missão é específica (não genérica) e diferencia a empresa',
              'Cada valor tem exemplo concreto de prática real',
              'Admitiu honestamente se os valores são praticados ou decorativos',
              'Reflexão sobre o "teste do fogo" demonstra pensamento crítico',
            ],
            expectedConcepts: ['missão', 'visão', 'valores', 'cultura organizacional', 'Edgar Schein'],
          },
        ],
      },
      {
        id: 'M8-1',
        title: 'Pesquisa Aplicada a Negocios',
        blocks: [
          {
            id: 'M8-1-t1',
            type: 'text',
            title: 'Pesquisa Aplicada: Métodos para Decisão Empresarial',
            body: 'Pesquisa aplicada a negócios usa métodos científicos para responder perguntas práticas do dia a dia empresarial. Diferente da pesquisa acadêmica (que busca conhecimento), a pesquisa aplicada busca solução.\n\n**Quando usar pesquisa no negócio?**\n— Antes de lançar um produto: o mercado quer isso?\n— Para entender churn: por que clientes estão saindo?\n— Para precificar: quanto o cliente pagaria?\n— Para expandir: qual região tem maior potencial?\n— Para inovar: quais dores não estão sendo atendidas?\n\n**Pesquisa Quantitativa:**\n— Dados numéricos, amostras grandes, análise estatística\n— Ferramentas: questionários (Google Forms, Typeform), analytics, A/B testing\n— Vantagem: generalizável, objetiva, comparável\n— Quando usar: validar hipóteses, medir satisfação, dimensionar mercado\n\n**Pesquisa Qualitativa:**\n— Dados descritivos, amostras pequenas, análise interpretativa\n— Ferramentas: entrevistas em profundidade, grupos focais, observação, etnografia\n— Vantagem: profundidade, nuance, descoberta de insights não óbvios\n— Quando usar: explorar motivações, entender comportamentos, gerar hipóteses\n\n**Métodos Mistos (Mixed Methods):**\n— Combinar quanti + quali para visão completa\n— Exemplo: pesquisa com 500 clientes (quanti) + 15 entrevistas em profundidade (quali)\n— O quanti diz O QUE acontece; o quali explica POR QUE acontece\n\n**Ferramentas práticas para gestores:**\n— NPS (Net Promoter Score): "de 0-10, recomendaria?" — simples e poderoso\n— Customer Discovery (Steve Blank): sair do escritório e conversar com 100 potenciais clientes\n— Design Thinking: empatizar → definir → idear → prototipar → testar\n— Jobs to Be Done: qual "trabalho" o cliente está "contratando" seu produto para fazer?\n\nNa prática: Não precisa de PhD para fazer pesquisa útil. 10 entrevistas de 30 minutos com clientes reais revelam mais do que qualquer relatório de mercado comprado.\n\nPergunta-chave: Quando foi a última vez que alguém da sua empresa conversou diretamente com um cliente insatisfeito para entender o porquê?',
          },
          {
            id: 'M8-pesquisa-c1',
            type: 'concept',
            term: 'Pesquisa Quantitativa vs Qualitativa',
            definition: 'Quantitativa usa números e amostras grandes para responder "O QUE" e "QUANTO" (ex: 73% dos clientes estão insatisfeitos). Qualitativa usa entrevistas e observação para responder "POR QUE" e "COMO" (ex: clientes saem porque o suporte demora 48h).',
            example: 'NPS de 32 (quanti) diz que há problema. 15 entrevistas com detratores (quali) revelam que o problema é o prazo de entrega, não o produto. Sem o quali, você corrigiria a coisa errada.',
            antiExample: 'Fazer pesquisa com 10 pessoas e generalizar para o mercado inteiro. Amostra pequena não é pesquisa quantitativa — é anedota com formulário.',
          },
          {
            id: 'M8-pesquisa-d1',
            type: 'decision',
            scenario: 'Você quer lançar um novo produto (assinatura de snacks saudáveis). Tem R$ 15.000 e 30 dias para pesquisar. O que faz?',
            options: [
              { label: 'Pesquisa quantitativa — questionário online para 500 pessoas', tradeoffs: { upside: 'Dados robustos, generalizável, dimensiona mercado', downside: 'Não revela motivações profundas. Pessoas dizem que compram saudável mas compram Doritos.', risk: 'medium' } },
              { label: 'Pesquisa qualitativa — 20 entrevistas em profundidade', tradeoffs: { upside: 'Entende POR QUE compraria, descobre dores ocultas', downside: 'Não dimensiona mercado. 20 pessoas podem ser atípicas.', risk: 'medium' } },
              { label: 'Método misto — 10 entrevistas + questionário com 200 pessoas', tradeoffs: { upside: 'Entende o POR QUE (quali) e valida com O QUANTO (quanti)', downside: 'Menos profundidade em cada método. Mais trabalho em 30 dias.', risk: 'low' } },
            ],
            realWorldAnalog: 'Steve Blank (Customer Discovery): "Nenhum plano de negócio sobrevive ao primeiro contato com o cliente." As 10 primeiras entrevistas mudam tudo — inclusive o produto.',
            lesson: 'Método misto é quase sempre a resposta certa. O quali gera as hipóteses, o quanti valida. Fazer só quanti é como atirar no escuro com mira laser — preciso, mas na direção errada.',
          },
          {
            id: 'M8-pesquisa-ex1',
            type: 'inline-exercise',
            prompt: 'Desenhe uma pesquisa para resolver um problema real de negócio.',
            context: 'Uma academia de bairro perdeu 30% dos alunos nos últimos 6 meses. O dono acha que é preço. Os professores acham que é concorrência. Ninguém perguntou aos alunos.',
            fields: [
              { id: 'hipoteses', label: 'Liste 3 hipóteses para a perda de alunos', placeholder: '1. Preço alto em relação aos concorrentes\n2. Horários inconvenientes\n3. ...', multiline: true },
              { id: 'metodo', label: 'Qual método usaria? (Quanti, Quali ou Misto) Justifique.', placeholder: 'Método: ... Justificativa: ...', multiline: true },
              { id: 'instrumento', label: 'Desenhe o instrumento — 5 perguntas que faria', placeholder: '1. Em escala de 0-10, quanto recomendaria a academia?\n2. O que mais motivou sua saída?\n3. ...', multiline: true },
              { id: 'amostra', label: 'Para quem aplicaria e quantas pessoas?', placeholder: 'Ex: 50 ex-alunos que cancelaram + 30 alunos atuais para comparar' },
            ],
            evaluationCriteria: [
              'Hipóteses vão além do óbvio (não só preço)',
              'Método escolhido é justificado com lógica',
              'Perguntas do instrumento são objetivas e acionáveis',
              'Amostra inclui ex-alunos E alunos atuais para comparação',
            ],
            expectedConcepts: ['pesquisa quantitativa', 'pesquisa qualitativa', 'NPS', 'amostra', 'hipótese'],
          },
          {
            id: 'M8-1-t2',
            type: 'text',
            title: 'Análise de Dados para Negócios: Do Excel ao BI',
            body: 'A análise de dados é a competência mais valorizada do mercado atual. Não se trata de ser cientista de dados — trata-se de saber fazer as perguntas certas e interpretar as respostas.\n\n**4 Níveis de Análise de Dados:**\n\n**Descritiva** — O que aconteceu?\n— Dashboards, relatórios, KPIs\n— Ferramentas: Excel, Google Sheets, Power BI, Google Data Studio\n— Exemplo: "Vendas caíram 15% no último trimestre"\n\n**Diagnóstica** — Por que aconteceu?\n— Drill-down, correlações, análise de causa-raiz\n— Ferramentas: tabelas dinâmicas, filtros cruzados, segmentação\n— Exemplo: "Vendas caíram porque o produto X perdeu share para concorrente Y na região Sul"\n\n**Preditiva** — O que vai acontecer?\n— Modelos estatísticos, machine learning, séries temporais\n— Ferramentas: Python, R, AutoML, forecasting\n— Exemplo: "Com base na tendência, vendas cairão mais 8% se nenhuma ação for tomada"\n\n**Prescritiva** — O que devemos fazer?\n— Otimização, simulação, cenários\n— Ferramentas: solver, simulação Monte Carlo, árvores de decisão\n— Exemplo: "Recomendação: desconto de 10% no produto X + campanha focada na região Sul"\n\n**Métricas que todo negócio deveria acompanhar:**\n\n**Receita:**\n— MRR (Monthly Recurring Revenue): receita recorrente mensal\n— ARR (Annual Recurring Revenue): MRR × 12\n— Ticket Médio: receita ÷ número de vendas\n\n**Clientes:**\n— CAC (Custo de Aquisição): quanto custa trazer um novo cliente\n— LTV (Lifetime Value): quanto um cliente gera ao longo da relação\n— Churn Rate: % de clientes que cancelam por período\n— Regra de ouro: LTV > 3 × CAC\n\n**Operação:**\n— Margem de contribuição por produto/serviço\n— Ponto de equilíbrio atualizado mensalmente\n— Ciclo financeiro (prazo de recebimento – prazo de pagamento)\n\nIMPORTANTE: Dados sem ação são custo, não investimento. A pergunta não é "quais dados temos?" — é "quais decisões precisamos tomar e quais dados as informam?"',
          },
          {
            id: 'M8-dados-cmp1',
            type: 'compare',
            title: '4 Níveis de Análise de Dados — Onde Sua Empresa Está?',
            question: 'Cada nível adiciona mais valor à decisão. Qual nível sua empresa pratica hoje?',
            dimensions: ['Pergunta', 'O que faz', 'Ferramentas', 'Complexidade', 'Valor para decisão'],
            items: [
              {
                id: 'descritiva',
                label: 'Descritiva',
                values: [
                  'O que aconteceu?',
                  'Dashboards e relatórios',
                  'Excel, Power BI, Google Sheets',
                  'Baixa',
                  'Base — sem isso não há nada',
                ],
              },
              {
                id: 'diagnostica',
                label: 'Diagnóstica',
                values: [
                  'Por que aconteceu?',
                  'Drill-down, correlações',
                  'Tabelas dinâmicas, filtros cruzados',
                  'Média',
                  'Explica causas — evita repetir erros',
                ],
              },
              {
                id: 'preditiva',
                label: 'Preditiva',
                values: [
                  'O que vai acontecer?',
                  'Modelos, machine learning',
                  'Python, R, AutoML',
                  'Alta',
                  'Antecipa problemas e oportunidades',
                ],
              },
              {
                id: 'prescritiva',
                label: 'Prescritiva',
                values: [
                  'O que devemos fazer?',
                  'Otimização, simulação',
                  'Solver, Monte Carlo, IA',
                  'Muito alta',
                  'Máximo — recomenda ações concretas',
                ],
              },
            ],
            insight: 'A maioria das empresas brasileiras está presa no nível descritivo — gera relatórios bonitos mas não sabe explicar POR QUE as coisas acontecem. O salto de descritiva para diagnóstica já transforma decisões.',
          },
          {
            id: 'M8-dados-nc1',
            type: 'number-crunch',
            title: 'Calculadora de LTV vs CAC — Saúde do Negócio',
            scenario: 'A regra de ouro é LTV > 3x CAC. Se o custo de adquirir um cliente é maior que o valor que ele gera, o negócio está queimando dinheiro.',
            inputs: [
              { id: 'ticketMedio', label: 'Ticket médio mensal', defaultValue: 200, unit: 'R$', min: 10, max: 50000 },
              { id: 'mesesRetencao', label: 'Meses médios de retenção', defaultValue: 18, unit: 'meses', min: 1, max: 120 },
              { id: 'margemBruta', label: 'Margem bruta (%)', defaultValue: 60, unit: '%', min: 5, max: 95 },
              { id: 'cac', label: 'Custo de Aquisição (CAC)', defaultValue: 500, unit: 'R$', min: 10, max: 50000 },
            ],
            formula: '((ticketMedio * mesesRetencao * margemBruta / 100) / cac)',
            resultLabel: 'Ratio LTV/CAC',
            interpretation: [
              { max: 1, label: 'Crítico — você paga mais para adquirir do que o cliente gera', color: 'red' },
              { max: 3, label: 'Atenção — ratio abaixo do ideal (meta: >3x)', color: 'amber' },
              { max: 999, label: 'Saudável — LTV supera 3x o CAC. Escale com confiança!', color: 'green' },
            ],
          },
          {
            id: 'M8-dados-ex1',
            type: 'inline-exercise',
            prompt: 'Defina o painel de métricas essenciais para um negócio real.',
            context: 'Imagine que você acabou de assumir como gestor de uma loja online de moda feminina com 2.000 clientes ativos, ticket médio de R$ 180, e churn de 8% ao mês. O CEO quer um dashboard com as métricas mais importantes.',
            fields: [
              { id: 'metricas-receita', label: 'Métricas de Receita — quais 3 você acompanharia?', placeholder: 'Ex: MRR, ticket médio, taxa de recompra...', multiline: true },
              { id: 'metricas-cliente', label: 'Métricas de Cliente — quais 3 são prioritárias?', placeholder: 'Ex: CAC, LTV, churn rate...', multiline: true },
              { id: 'acao-churn', label: 'Churn de 8%/mês é grave? Que ação você tomaria primeiro?', placeholder: 'Calcule: quantos clientes perde por mês? Em quanto tempo perde metade da base?', multiline: true },
            ],
            evaluationCriteria: [
              'Escolheu métricas relevantes e justificou por que cada uma importa',
              'Calculou impacto do churn: 8% de 2.000 = 160 clientes/mês perdidos',
              'Identificou que sem aquisição, a base cai pela metade em ~8 meses',
              'Propôs ação concreta para reduzir churn (não genérica)',
            ],
            expectedConcepts: ['LTV', 'CAC', 'churn rate', 'MRR', 'análise de dados'],
          },
        ],
      },
    ],
  },
]
