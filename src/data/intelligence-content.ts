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
            url: 'https://qvvqbngiwqfuxsbgcxtc.supabase.co/storage/v1/object/public/videos/IPB/Economia_Mercado.mp4',
          },
          {
            id: 'M3-0-cap1',
            type: 'chapter',
            number: 1,
            title: 'Fundamentos de Economia e Marketing',
            subtitle: 'Escassez, custo de oportunidade e a evolução do marketing — de trocas a ecossistemas',
            opening: {
              leadText: 'Marketing pode ser definido como uma série de atividades que levam a uma transação de troca com lucro entre comprador e vendedor. Mas antes de existir anúncio, marca ou estratégia, existe um problema mais profundo: como organizar trocas em um mundo onde recursos são {{limitados}} e escolhas têm custo?',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'A economia define escassez não como falta absoluta, mas como a condição estrutural na qual os recursos disponíveis são insuficientes para atender a todas as necessidades e desejos simultaneamente. Toda escolha implica {{custo de oportunidade}} — o valor da melhor alternativa que foi sacrificada. Quando a empresa aloca R$ 1 milhão em marketing, está dizendo "não" a R$ 1 milhão em P&D, contratação ou expansão.',
              },
              {
                kind: 'paragraph',
                text: 'O composto de marketing — produto, preço, ponto-de-venda e promoção — são as atividades que precisam ser conduzidas para que a empresa consiga consumidores dispostos a pagar um preço que, ao mesmo tempo, proporcione {{lucro}}.',
              },
              {
                kind: 'heading',
                text: 'A evolução do marketing',
              },
              {
                kind: 'paragraph',
                text: 'Marketing nasce no ponto em que economia e psicologia se encontram: entender o que as pessoas querem, por que querem, e como fazer essa troca funcionar para {{ambos os lados}}.',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Era da Produção (até 1930)',
                    period: 'Foco no produto',
                    text: '"Um bom produto se vende sozinho." Demanda superava oferta. Foco em {{eficiência produtiva}}. Bastava fabricar — o mercado absorvia.',
                    caseStudy: {
                      company: 'Ford',
                      year: 1908,
                      story: 'Henry Ford: "O cliente pode ter o carro da cor que quiser, desde que seja {{preto}}." Modelo T: 15 milhões de unidades, 1 cor, 1 modelo. Produção em massa como estratégia.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '15M', label: 'Modelo T produzidos' },
                        { value: '1 cor', label: 'Preto' },
                        { value: '$260', label: 'Preço final (vs $850 inicial)' },
                      ],
                      insight: 'Funcionou enquanto demanda > oferta. Quando GM ofereceu cores e modelos, Ford {{perdeu}} liderança.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Era do Marketing (1950-2000)',
                    period: 'Foco no cliente',
                    text: 'Oferta supera demanda. Não basta fabricar — precisa entender o que o cliente quer. {{Kotler}} (Northwestern) sistematiza: segmentação, targeting, posicionamento. Os 4Ps entram em cena.',
                    caseStudy: {
                      company: 'Coca-Cola',
                      year: 1985,
                      story: 'New Coke: mudou a fórmula baseada em pesquisa. Clientes {{rejeitaram}} — não era só sabor, era identidade. Voltou atrás em 79 dias. Marketing precisa entender emoção, não só dados.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '79 dias', label: 'Duração da New Coke' },
                        { value: '$4M', label: 'Gasto em pesquisa (falha)' },
                        { value: '+8%', label: 'Vendas após retorno da original' },
                      ],
                      quote: {
                        text: 'Marketing is not the art of finding clever ways to dispose of what you make. It is the art of creating genuine customer value.',
                        author: 'Philip Kotler · Marketing Management · Northwestern University',
                      },
                      insight: 'Kotler: marketing não é vender o que você faz — é fazer o que {{vale}} para o cliente.',
                    },
                  },
                  {
                    index: 3,
                    title: 'Era Digital (2000+)',
                    period: 'Foco em ecossistema',
                    text: 'Dados, algoritmos e plataformas redefinem marketing. O cliente não é mais audiência — é {{participante}} que co-cria valor. Marketing vira ciência de dados + psicologia + tecnologia.',
                    caseStudy: {
                      company: 'Amazon',
                      year: 2023,
                      story: '{{35%}} das vendas da Amazon vêm de recomendações algorítmicas. O marketing não é campanha — é o próprio produto. Cada clique treina o algoritmo que vende mais.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '35%', label: 'Vendas por recomendação' },
                        { value: 'Real-time', label: 'Personalização' },
                        { value: '$600B+', label: 'Receita Amazon (2023)' },
                      ],
                      insight: 'No marketing digital, o {{produto}} é o marketing. Recomendação, UX, dados — tudo é venda.',
                    },
                  },
                ],
              },
              {
                kind: 'heading',
                text: 'Definições clássicas de Marketing',
              },
              {
                kind: 'pillar-grid',
                title: '3 visões que definem o campo',
                pillars: [
                  { icon: '🇧🇷', title: 'Raimar Richers', description: '"Marketing são as atividades sistemáticas de uma organização humana voltadas à busca e realização de {{trocas}} para com o seu meio ambiente, visando benefícios específicos."' },
                  { icon: '📖', title: 'Peter Drucker', description: '"O objetivo do marketing é tornar a {{venda}} supérflua. Conhecer tão bem o cliente que o produto se vende sozinho." Marketing como filosofia, não departamento.' },
                  { icon: '🌍', title: 'Philip Kotler', description: '"Marketing é o processo social pelo qual pessoas obtêm aquilo de que necessitam e desejam com a {{criação}}, oferta e livre negociação de produtos e serviços de valor."' },
                ],
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada era do marketing tem foco diferente. Classifique.',
              compare: {
                columnHeaders: ['Produção', 'Marketing', 'Digital'],
                rows: [
                  { label: 'Foco', values: ['Fábrica', 'Cliente', 'Ecossistema'] },
                  { label: 'Lógica', values: ['Produzir mais', 'Entender desejo', 'Dados + algoritmo'] },
                  { label: 'Exemplo', values: ['Ford Modelo T', 'Coca-Cola', 'Amazon 35% recomendação'] },
                ],
              },
              drag: {
                instruction: 'Qual era do marketing?',
                zones: [
                  { id: 'prod', label: 'Produção' },
                  { id: 'mkt', label: 'Marketing' },
                  { id: 'dig', label: 'Digital' },
                ],
                items: [
                  { id: 'ford', label: '"Qualquer cor, desde que preta"', correctZone: 'prod', correctFeedback: 'Certo. Foco na produção, não no cliente.', wrongFeedback: 'Ford = era da produção.' },
                  { id: 'seg', label: 'Segmentação e posicionamento', correctZone: 'mkt', correctFeedback: 'Certo. Entender o cliente = era do marketing.', wrongFeedback: 'Segmentação = era do marketing (Kotler).' },
                  { id: 'algo', label: 'Recomendação por algoritmo', correctZone: 'dig', correctFeedback: 'Certo. Dados e personalização = era digital.', wrongFeedback: 'Algoritmo = era digital.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Marketing evoluiu de "fabricar e vender" para "{{entender e servir}}". A escassez obriga escolhas. O custo de oportunidade dá peso a cada decisão. E as 3 eras mostram que quem não evolui com o mercado, desaparece.',
              keyInsights: [
                'Toda escolha tem {{custo de oportunidade}} — o valor da melhor alternativa sacrificada.',
                'Kotler: marketing não é vender o que faz, é fazer o que {{vale}} para o cliente.',
                'Amazon: 35% das vendas por recomendação. No digital, o produto {{é}} o marketing.',
              ],
              nextChapterHint: 'Capítulo 2 · Valor',
              nextChapterBlurb: 'O conceito mais mal interpretado do marketing — valor não está no produto.',
            },
          },
          {
            id: 'M3-0-cap2',
            type: 'chapter',
            number: 2,
            title: 'Valor — O Conceito Central do Marketing',
            subtitle: 'Valor não está no produto — está na percepção do cliente',
            opening: {
              leadText: 'Valor não está no produto. Valor está na relação entre {{benefício percebido}} e {{custo percebido}}. O cérebro nunca pergunta "isso é objetivamente bom?" — ele pergunta "isso vale o que vai me custar?"',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'Valor percebido = Benefícios percebidos ÷ Custos percebidos. Os benefícios incluem funcionalidade, emoção, status, conveniência. Os custos incluem dinheiro, tempo, esforço, risco. Um iPhone de R$ 8.000 tem valor alto porque os benefícios percebidos (status, ecossistema, câmera, facilidade) superam o custo percebido para seu {{público-alvo}}.',
              },
              {
                kind: 'pillar-grid',
                title: 'Os 4 tipos de valor percebido',
                pillars: [
                  { icon: '⚙️', title: 'Funcional', description: 'O produto {{resolve}} o problema? Faz o que promete? Qualidade, durabilidade, desempenho técnico.' },
                  { icon: '❤️', title: 'Emocional', description: 'Como o cliente se {{sente}} ao usar? Alegria, segurança, pertencimento. Coca-Cola vende emoção, não refrigerante.' },
                  { icon: '👑', title: 'Social', description: 'O que usar esse produto diz sobre {{quem eu sou}}? Status, identidade, grupo. Apple vende pertencimento a uma tribo.' },
                  { icon: '💰', title: 'Econômico', description: 'A relação custo-benefício é {{justa}}? Economia de tempo, dinheiro, esforço. Nubank vende economia (zero tarifa).' },
                ],
              },
              {
                kind: 'paragraph',
                text: 'A estratégia de marketing inteira gira em torno de valor: o produto cria valor (funcional), o preço sinaliza valor (econômico), a comunicação transmite valor (emocional/social), e a distribuição entrega valor (conveniência). Os {{4Ps}} são 4 formas de gerenciar valor percebido.',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Valor vs Preço — Havaianas',
                    period: 'Mesmo produto, valor diferente',
                    text: 'Chinelo de borracha: custo de produção ~R$ 3. Versão básica: R$ 15. Versão designer: R$ 80. Colaboração exclusiva: R$ 300+. A borracha é a {{mesma}}. O valor percebido é radicalmente diferente.',
                    caseStudy: {
                      company: 'Havaianas',
                      year: 2020,
                      story: 'Colaboração com {{Dolce & Gabbana}}: chinelo a R$ 350. Esgotou em horas. O produto funcional é idêntico ao de R$ 15. O valor social (exclusividade, marca, escassez) justifica 23x o preço.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '~R$ 3', label: 'Custo produção' },
                        { value: 'R$ 350', label: 'Versão D&G' },
                        { value: '23x', label: 'Diferença de preço' },
                      ],
                      insight: 'O marketing não muda o produto — muda o {{valor percebido}}. E valor percebido determina quanto o cliente paga.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Valor vs Preço — Nubank',
                    period: 'Mesmo serviço, valor diferente',
                    text: 'Cartão de crédito: produto idêntico ao de qualquer banco. Diferença: {{zero tarifa}}, app intuitivo, atendimento humano rápido. O valor econômico (economia) + funcional (facilidade) + emocional (respeito) gera 80M de clientes.',
                    caseStudy: {
                      company: 'Nubank',
                      year: 2023,
                      story: 'NPS (Net Promoter Score) de {{87}} — o mais alto do setor financeiro brasileiro. Bancos tradicionais: NPS de 20-40. Mesma funcionalidade, {{4x mais satisfação}}. Valor está na experiência.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '87', label: 'NPS Nubank' },
                        { value: '20-40', label: 'NPS bancos tradicionais' },
                        { value: '80M', label: 'Clientes' },
                      ],
                      insight: 'Valor percebido não é só funcional. Nubank vende {{respeito}} ao cliente — algo que bancos tradicionais nunca priorizaram.',
                    },
                  },
                ],
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Os 4 tipos de valor se manifestam em diferentes produtos. Classifique.',
              compare: {
                columnHeaders: ['Funcional', 'Emocional', 'Social', 'Econômico'],
                rows: [
                  { label: 'Pergunta do cliente', values: ['Funciona?', 'Como me sinto?', 'O que diz de mim?', 'Vale o preço?'] },
                ],
              },
              drag: {
                instruction: 'Qual tipo de valor predomina?',
                zones: [
                  { id: 'func', label: 'Funcional' },
                  { id: 'emoc', label: 'Emocional' },
                  { id: 'soc', label: 'Social' },
                  { id: 'econ', label: 'Econômico' },
                ],
                items: [
                  { id: 'rolex', label: 'Relógio Rolex', correctZone: 'soc', correctFeedback: 'Certo. Rolex = status social.', wrongFeedback: 'Rolex vende status, não precisão.' },
                  { id: 'uber', label: 'Uber vs táxi', correctZone: 'econ', correctFeedback: 'Certo. Conveniência e preço = valor econômico.', wrongFeedback: 'Uber compete em preço/conveniência.' },
                  { id: 'coca', label: 'Coca-Cola na praia', correctZone: 'emoc', correctFeedback: 'Certo. Felicidade, nostalgia = emoção.', wrongFeedback: 'Coca vende emoção/momento.' },
                  { id: 'dyson', label: 'Aspirador Dyson', correctZone: 'func', correctFeedback: 'Certo. Tecnologia e desempenho = funcional.', wrongFeedback: 'Dyson vende desempenho técnico.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Valor = Benefício percebido ÷ Custo percebido. Não está no produto — está na {{mente}} do cliente. Os 4 tipos (funcional, emocional, social, econômico) determinam quanto o cliente paga e se volta.',
              keyInsights: [
                'Havaianas: mesma borracha, preço de R$ 15 a R$ 350. A diferença é {{valor percebido}}, não custo.',
                'Nubank NPS 87 vs bancos 20-40. Mesmo produto, 4x mais satisfação. Valor = {{experiência}}.',
                'Os 4Ps são 4 formas de gerenciar valor: criar (produto), sinalizar (preço), comunicar (promoção), {{entregar}} (distribuição).',
              ],
              nextChapterHint: 'Capítulo 3 · Necessidade, Desejo e Demanda',
              nextChapterBlurb: 'A diferença que separa marketing bom de marketing desperdiçado.',
            },
          },
          {
            id: 'M3-0-cap3',
            type: 'chapter',
            number: 3,
            title: 'Necessidade, Desejo e Demanda',
            subtitle: 'A diferença que separa marketing eficiente de marketing desperdiçado',
            opening: {
              leadText: 'Na teoria clássica: {{Necessidade}} é carência humana básica (fisiológica ou psicológica, independe de cultura). {{Desejo}} é a forma culturalmente específica de satisfazer uma necessidade. {{Demanda}} é desejo acompanhado de poder de compra.',
            },
            body: [
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Necessidade',
                    period: 'Universal e inata',
                    text: 'Carência humana básica, fisiológica ou psicológica. {{Independe}} de cultura. Fome, sede, segurança, pertencimento, autoestima — existem em qualquer sociedade, em qualquer época.',
                    caseStudy: {
                      company: 'Maslow (1943)',
                      year: 1943,
                      story: 'Pirâmide de Maslow: {{5 níveis}} de necessidade — fisiológicas, segurança, sociais, estima, autorrealização. Marketing opera em todos os níveis, não só no básico.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '5', label: 'Níveis de Maslow' },
                        { value: 'Universal', label: 'Toda cultura' },
                        { value: 'Inata', label: 'Não é criada pelo marketing' },
                      ],
                      insight: 'Marketing NÃO cria necessidades. Necessidades {{existem}}. Marketing cria desejos e habilita demanda.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Desejo',
                    period: 'Cultural e aprendido',
                    text: 'Forma culturalmente específica de satisfazer uma necessidade. Necessidade de alimentação é universal. Desejo de {{sushi}} é cultural. O desejo é aprendido — moldado por cultura, família, mídia e experiência.',
                    caseStudy: {
                      company: 'Starbucks',
                      year: 2000,
                      story: 'Necessidade: energia (cafeína). Desejo: {{experiência}} Starbucks (ambiente, status, ritual). Ninguém PRECISA de café de R$ 25. Mas milhões DESEJAM a experiência que ele proporciona.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'R$ 25', label: 'Café Starbucks' },
                        { value: 'R$ 3', label: 'Café padaria' },
                        { value: '8x', label: 'Diferença de preço' },
                      ],
                      insight: 'O marketing transforma necessidade em desejo {{específico}}. A necessidade é de cafeína. O desejo é de Starbucks.',
                    },
                  },
                  {
                    index: 3,
                    title: 'Demanda',
                    period: 'Desejo + poder de compra',
                    text: 'Desejo acompanhado de {{capacidade e disposição}} de pagar. Muitos desejam um iPhone. Nem todos podem pagar R$ 8.000. Demanda = desejo viável. É onde o marketing encontra o mercado real.',
                    caseStudy: {
                      company: 'Xiaomi',
                      year: 2020,
                      story: 'Necessidade: comunicação. Desejo: smartphone premium. Barreira: preço. Xiaomi oferece {{90% das funcionalidades}} por 30% do preço. Converteu desejo frustrado em demanda real.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '90%', label: 'Funcionalidades vs premium' },
                        { value: '30%', label: 'Do preço' },
                        { value: '#3', label: 'Market share global' },
                      ],
                      insight: 'Xiaomi não criou necessidade nem desejo — converteu {{desejo existente}} em demanda acessível. Esse é o poder do preço.',
                    },
                  },
                ],
              },
              {
                kind: 'paragraph',
                text: 'A distinção é estratégica: empresas que confundem necessidade com desejo lançam produtos genéricos. Empresas que confundem desejo com demanda lançam produtos que ninguém {{compra}} (tem vontade mas não tem dinheiro). O marketing eficiente atua nos três níveis: identifica necessidades, molda desejos e converte em demanda.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Necessidade, desejo e demanda são conceitos diferentes. Classifique.',
              compare: {
                columnHeaders: ['Necessidade', 'Desejo', 'Demanda'],
                rows: [
                  { label: 'Natureza', values: ['Universal', 'Cultural', 'Econômica'] },
                  { label: 'Exemplo', values: ['Fome', 'Sushi', 'Sushi que posso pagar'] },
                  { label: 'Marketing pode', values: ['Identificar', 'Moldar', 'Converter'] },
                ],
              },
              drag: {
                instruction: 'Classifique cada exemplo:',
                zones: [
                  { id: 'nec', label: 'Necessidade' },
                  { id: 'des', label: 'Desejo' },
                  { id: 'dem', label: 'Demanda' },
                ],
                items: [
                  { id: 'sede', label: 'Sentir sede no calor', correctZone: 'nec', correctFeedback: 'Certo. Sede é necessidade fisiológica universal.', wrongFeedback: 'Sede = necessidade básica.' },
                  { id: 'star', label: 'Querer um Frappuccino Starbucks', correctZone: 'des', correctFeedback: 'Certo. Forma específica de satisfazer sede = desejo.', wrongFeedback: 'Starbucks é desejo cultural.' },
                  { id: 'comp', label: 'Comprar o Frappuccino por R$ 25', correctZone: 'dem', correctFeedback: 'Certo. Desejo + pagamento = demanda.', wrongFeedback: 'Desejo viabilizado = demanda.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Marketing NÃO cria necessidades — elas {{existem}}. Marketing molda desejos (cultural) e converte em demanda (poder de compra). Confundir os três é desperdiçar orçamento.',
              keyInsights: [
                'Maslow: 5 níveis de necessidade. Marketing opera em {{todos}} — não só no básico.',
                'Starbucks: necessidade de cafeína → desejo de experiência → demanda de R$ 25. {{8x}} o preço da padaria.',
                'Xiaomi: não criou necessidade nem desejo — converteu desejo frustrado em {{demanda acessível}}.',
              ],
            },
          },
          {
            id: 'M3-0-s1',
            type: 'simulation',
            title: 'Timeline da Evolução do Marketing',
            simulationId: 'marketing-timeline',
            description: 'Navegue pelas eras do marketing e veja como a lógica mudou.',
          },
          {
            id: 'M3-0-s2',
            type: 'simulation',
            title: 'Mapa de Definições: Richers, Drucker e Kotler',
            simulationId: 'marketing-definitions',
            description: 'Compare as definições clássicas e conecte cada autor à sua visão.',
          },
          {
            id: 'M3-0-s3',
            type: 'simulation',
            title: 'Balança de Valor Percebido',
            simulationId: 'value-balance',
            description: 'Ajuste benefícios e custos percebidos e veja como valor muda.',
          },
          {
            id: 'M3-0-s4',
            type: 'simulation',
            title: 'Diagnóstico: Necessidade, Desejo ou Demanda?',
            simulationId: 'need-desire-demand',
            description: 'Cenários reais: classifique se é necessidade, desejo ou demanda.',
          },
        ],
      },

      {
        id: 'M3-1',
        title: 'Lideranca e Gestao de Equipes',
        blocks: [
          {
            id: 'M3-1-cap1',
            type: 'chapter',
            number: 1,
            title: 'Liderança, Teorias e Inteligência Emocional',
            subtitle: 'Liderança ≠ Gestão — as 5 teorias e por que IE importa mais que QI',
            opening: {
              leadText: 'Liderança e gestão são complementares, mas não são sinônimos. {{Gestão}} = fazer as coisas certas acontecerem. {{Liderança}} = inspirar pessoas a quererem que aconteçam. Confundir os dois é o erro mais comum em organizações.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'Gestão lida com complexidade: planejamento, orçamento, organização, controle. Liderança lida com mudança: visão, alinhamento, motivação, inspiração. Uma empresa precisa de ambos. O problema é que a maioria {{promove gestores}} esperando que virem líderes — e a maioria das formações ensina gestão, não liderança.',
              },
              {
                kind: 'heading',
                text: 'As 5 teorias de liderança',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Teoria dos Traços (1900-1940)',
                    period: 'Nasce-se líder?',
                    text: '"Líderes nascem prontos." Buscava traços universais: carisma, inteligência, determinação. {{Falhou}} porque não explica por que pessoas com os mesmos traços às vezes lideram e às vezes não.',
                    caseStudy: {
                      company: 'Estudo histórico',
                      year: 1940,
                      story: 'Revisão de Stogdill (1948): analisou {{124 estudos}} de traços. Conclusão: nenhum traço garante liderança. Contexto importa tanto quanto personalidade.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '124', label: 'Estudos analisados' },
                        { value: '0', label: 'Traços universais encontrados' },
                      ],
                      insight: 'Traços ajudam mas não determinam. Liderança é {{contexto + competência}}, não destino genético.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Teoria Comportamental (1940-1960)',
                    period: 'O que líderes FAZEM?',
                    text: 'Foco nos comportamentos, não nos traços. Liderança pode ser {{aprendida}}. Dois eixos: orientação para tarefas vs orientação para pessoas.',
                    caseStudy: {
                      company: 'Ohio State / Michigan',
                      year: 1950,
                      story: 'Estudos de Ohio State e Michigan identificaram 2 dimensões: {{estrutura}} (tarefa) e {{consideração}} (pessoas). Líderes eficazes pontuam alto em ambas.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '2 eixos', label: 'Tarefa + Pessoas' },
                        { value: 'Alto-alto', label: 'Líder ideal' },
                      ],
                      insight: 'Se liderança é comportamento, pode ser {{treinada}}. Primeira teoria com implicação prática para RH.',
                    },
                  },
                  {
                    index: 3,
                    title: 'Liderança Situacional (1969)',
                    period: 'Depende do contexto',
                    text: 'Hersey & Blanchard: não existe estilo melhor — existe o estilo certo para o {{nível de maturidade}} do liderado. 4 estilos: Direcionar (iniciante), Orientar (aprendiz), Apoiar (capaz mas inseguro), Delegar (autônomo).',
                    caseStudy: {
                      company: 'Gestão prática',
                      year: 2024,
                      story: 'Funcionário novo: precisa de {{direção}} (o que fazer, como fazer). Sênior: precisa de {{autonomia}} (defina o resultado, ele define o caminho). Usar o mesmo estilo para ambos é falha de liderança.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '4', label: 'Estilos situacionais' },
                        { value: 'Maturidade', label: 'Do liderado define o estilo' },
                      ],
                      insight: 'O líder que usa um estilo só está {{acertando}} em 25% dos casos e errando em 75%.',
                    },
                  },
                  {
                    index: 4,
                    title: 'Liderança Transformacional (1978)',
                    period: 'Inspirar mudança',
                    text: 'James MacGregor Burns: líderes transformacionais inspiram seguidores a transcender interesses individuais em prol de um {{propósito maior}}. 4 componentes: influência idealizada, motivação inspiradora, estimulação intelectual, consideração individualizada.',
                    caseStudy: {
                      company: 'Natura',
                      year: 2014,
                      story: 'Luiz Seabra (fundador) criou cultura de {{propósito}} que sobreviveu à sua saída. Colaboradores veem a empresa como causa, não emprego. Turnover 3x menor que mercado.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '4', label: 'Componentes transformacionais' },
                        { value: '3x', label: 'Menor turnover Natura' },
                      ],
                      insight: 'Transformacional funciona quando o líder {{genuinamente}} acredita no propósito. Se é performance, a equipe percebe.',
                    },
                  },
                  {
                    index: 5,
                    title: 'Liderança Servidora (1970)',
                    period: 'Servir para liderar',
                    text: 'Robert Greenleaf: o líder existe para servir a equipe, não o contrário. O líder remove {{obstáculos}}, fornece recursos e desenvolve pessoas. A equipe entrega resultado porque tem condições de fazer.',
                    caseStudy: {
                      company: 'Nubank',
                      year: 2020,
                      story: 'David Vélez pratica liderança servidora: "meu trabalho é garantir que {{vocês}} tenham o que precisam para resolver o problema do cliente." Resultado: equipes autônomas, decisão descentralizada.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'Servir', label: 'Líder serve a equipe' },
                        { value: 'Autonomia', label: 'Equipe decide' },
                      ],
                      insight: 'Servidora é a teoria mais {{moderna}} e a mais difícil de praticar — exige ego baixo do líder.',
                    },
                  },
                ],
              },
              {
                kind: 'heading',
                text: 'Inteligência Emocional — a competência #1',
              },
              {
                kind: 'paragraph',
                text: 'Daniel Goleman demonstrou que a inteligência emocional (IE) responde por {{67%}} das competências necessárias para performance superior em liderança — o dobro da importância de competências técnicas e QI combinados.',
              },
              {
                kind: 'pillar-grid',
                title: '5 dimensões da IE (Goleman, 1995)',
                pillars: [
                  { icon: '🪞', title: 'Autoconhecimento', description: 'Reconhecer suas próprias emoções e como afetam os {{outros}}. Base de tudo.' },
                  { icon: '🎛️', title: 'Autocontrole', description: 'Regular impulsos e emoções. Não reagir — {{responder}}. Pensar antes de agir.' },
                  { icon: '🔥', title: 'Motivação', description: 'Impulso interno para realizar além do esperado. Não por dinheiro — por {{propósito}}.' },
                  { icon: '🤝', title: 'Empatia', description: 'Compreender emoções dos outros. Não é concordar — é {{entender}} antes de agir.' },
                  { icon: '🌐', title: 'Habilidade Social', description: 'Gerenciar relacionamentos. Influenciar, comunicar, resolver conflitos, {{construir}} redes.' },
                ],
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada teoria responde a uma pergunta diferente. Classifique.',
              compare: {
                columnHeaders: ['Traços', 'Situacional', 'Transformacional', 'Servidora'],
                rows: [
                  { label: 'Pergunta', values: ['Nasce líder?', 'Qual contexto?', 'Qual propósito?', 'Quem serve quem?'] },
                  { label: 'Foco', values: ['Personalidade', 'Maturidade', 'Inspiração', 'Equipe'] },
                ],
              },
              drag: {
                instruction: 'Qual teoria se aplica?',
                zones: [
                  { id: 'sit', label: 'Situacional' },
                  { id: 'trans', label: 'Transformacional' },
                  { id: 'serv', label: 'Servidora' },
                ],
                items: [
                  { id: 'novo', label: 'Funcionário novo precisa de direção clara', correctZone: 'sit', correctFeedback: 'Certo. Adaptar estilo ao nível = situacional.', wrongFeedback: 'Nível de maturidade = situacional.' },
                  { id: 'prop', label: 'Equipe engajada por propósito, não salário', correctZone: 'trans', correctFeedback: 'Certo. Propósito maior = transformacional.', wrongFeedback: 'Inspirar propósito = transformacional.' },
                  { id: 'obst', label: 'Líder remove obstáculos para a equipe entregar', correctZone: 'serv', correctFeedback: 'Certo. Servir a equipe = servidora.', wrongFeedback: 'Remover obstáculos = líder servidor.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Liderança não é cargo — é {{comportamento}}. As 5 teorias mostram a evolução: de "nasce líder" para "líder serve". E Goleman provou que IE importa 2x mais que QI para liderar.',
              keyInsights: [
                'Gestão = complexidade. Liderança = {{mudança}}. Empresa precisa dos dois.',
                'Liderança Situacional: 4 estilos para 4 níveis de maturidade. Um estilo só = {{75% de erro}}.',
                'Goleman: IE responde por {{67%}} das competências de liderança superior.',
              ],
              nextChapterHint: 'Capítulo 2 · Equipes e Ferramentas',
              nextChapterBlurb: 'Tuckman, Feedback, Delegação — como formar equipes e desenvolver pessoas.',
            },
          },
          {
            id: 'M3-1-cap2',
            type: 'chapter',
            number: 2,
            title: 'Formação de Equipes e Ferramentas de Gestão',
            subtitle: 'Tuckman, Feedback SBI, Delegação e o custo de não delegar',
            opening: {
              leadText: 'Um grupo de pessoas trabalhando juntas NÃO é uma equipe. Equipe exige {{interdependência}}, objetivo compartilhado e responsabilidade mútua. A diferença entre grupo e equipe é a diferença entre 5 jogadores e um time.',
            },
            body: [
              {
                kind: 'step-flow',
                title: 'Modelo de Tuckman — 5 fases de formação de equipe',
                steps: [
                  { number: 1, title: 'Forming (Formação)', description: 'Polidez e cautela. Membros se conhecem, evitam conflito. Dependência do líder para {{direção}}.', caseSnippet: 'Equipe nova: todos concordam com tudo. Parece harmonia — é superficialidade.' },
                  { number: 2, title: 'Storming (Conflito)', description: 'Tensão emerge. Divergências de opinião, disputas de poder, frustração com processos. Fase mais {{desconfortável}} mas essencial.', caseSnippet: '70% das equipes ficam presas aqui. Líder que evita conflito impede amadurecimento.' },
                  { number: 3, title: 'Norming (Normatização)', description: 'Regras se estabelecem. Papéis ficam claros. Confiança cresce. Equipe começa a funcionar como {{unidade}}.', caseSnippet: 'Sinais: membros pedem feedback, reconhecem forças dos outros, aceitam crítica.' },
                  { number: 4, title: 'Performing (Desempenho)', description: 'Alta performance. Equipe autônoma, resolve problemas sem depender do líder. Foco em {{resultado}}, não em dinâmica.', caseSnippet: 'Google Aristotle: equipes performing têm segurança psicológica como base.' },
                  { number: 5, title: 'Adjourning (Dissolução)', description: 'Equipe se dissolve (projeto acabou). Importante: {{celebrar}} conquistas e documentar aprendizados.', caseSnippet: 'Equipes que não fazem retrospectiva repetem erros no próximo projeto.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Feedback — a ferramenta mais poderosa (e mal usada)',
              },
              {
                kind: 'paragraph',
                text: 'Feedback não é "bronca educada". É informação sobre desempenho com objetivo de gerar {{mudança}}. A maioria dos gestores evita dar feedback por medo de conflito — e a maioria dos que dão, dão mal (vago, tardio ou agressivo).',
              },
              {
                kind: 'pillar-grid',
                title: 'Modelo SBI — Feedback estruturado',
                pillars: [
                  { icon: '📍', title: 'S — Situação', description: 'Descreva o {{contexto}} específico. "Na reunião de segunda com o cliente X..." Não generalizar ("você sempre...").' },
                  { icon: '👁️', title: 'B — Comportamento', description: 'Descreva o {{comportamento}} observável. "Você interrompeu o cliente 3 vezes." Fato, não interpretação.' },
                  { icon: '💥', title: 'I — Impacto', description: 'Descreva o {{impacto}} do comportamento. "O cliente ficou frustrado e encerrou a reunião 15 min antes." Consequência real.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Delegação — o gargalo invisível',
              },
              {
                kind: 'paragraph',
                text: 'A incapacidade de delegar é o principal gargalo de crescimento de gestores e empresas. Se o líder precisa aprovar tudo, a velocidade da empresa = velocidade do líder. Razões para não delegar: "ninguém faz como eu", medo de perder controle, falta de {{confiança}} na equipe, falta de tempo para ensinar.',
              },
              {
                kind: 'paragraph',
                text: 'O custo de não delegar: líder sobrecarregado (burnout), equipe desmotivada (não cresce), empresa lenta (bottleneck). A regra: se alguém pode fazer 80% tão bem quanto você, {{delegue}}. Os 20% que faltam a pessoa aprende fazendo.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'As fases de Tuckman têm características distintas. Classifique.',
              compare: {
                columnHeaders: ['Forming', 'Storming', 'Performing'],
                rows: [
                  { label: 'Clima', values: ['Polidez', 'Tensão', 'Autonomia'] },
                  { label: 'Líder deve', values: ['Direcionar', 'Mediar', 'Empoderar'] },
                ],
              },
              drag: {
                instruction: 'Qual fase de Tuckman?',
                zones: [
                  { id: 'form', label: 'Forming' },
                  { id: 'storm', label: 'Storming' },
                  { id: 'perf', label: 'Performing' },
                ],
                items: [
                  { id: 'pol', label: 'Todos concordam sem questionar', correctZone: 'form', correctFeedback: 'Certo. Harmonia superficial = Forming.', wrongFeedback: 'Polidez excessiva = Forming.' },
                  { id: 'brig', label: 'Dois membros discordam sobre prioridades', correctZone: 'storm', correctFeedback: 'Certo. Conflito = Storming (normal e necessário).', wrongFeedback: 'Conflito = Storming.' },
                  { id: 'auto', label: 'Equipe resolve problema sem chamar o líder', correctZone: 'perf', correctFeedback: 'Certo. Autonomia = Performing.', wrongFeedback: 'Autonomia = alta performance.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Equipe não nasce — se {{forma}} em 5 fases. Feedback SBI (Situação-Comportamento-Impacto) é a ferramenta #1 de desenvolvimento. E delegar é aceitar 80% hoje para ter 100% amanhã.',
              keyInsights: [
                'Tuckman: {{70%}} das equipes ficam presas em Storming. Líder que evita conflito impede amadurecimento.',
                'Feedback SBI: Situação específica + Comportamento observável + Impacto {{real}}.',
                'Regra de delegação: se alguém faz 80% tão bem quanto você, {{delegue}}.',
              ],
              nextChapterHint: 'Capítulo 3 · Conflitos, Motivação e Cultura',
              nextChapterBlurb: 'Gestão de conflitos, ciência da motivação e segurança psicológica.',
            },
          },
          {
            id: 'M3-1-cap3',
            type: 'chapter',
            number: 3,
            title: 'Conflitos, Motivação e Segurança Psicológica',
            subtitle: 'Como transformar tensão em resultado e construir equipes que inovam',
            opening: {
              leadText: 'Conflito não é problema. Conflito {{mal gerenciado}} é problema. Equipes sem conflito estão em Forming — não se conhecem o suficiente para discordar. E motivação real não vem de dinheiro — vem de autonomia, maestria e propósito.',
            },
            body: [
              {
                kind: 'pillar-grid',
                title: '5 abordagens de gestão de conflitos (Thomas-Kilmann)',
                pillars: [
                  { icon: '🏆', title: 'Competir', description: 'Assertivo + não cooperativo. {{Ganhar}} a qualquer custo. Usar quando: decisão urgente, segurança em risco.' },
                  { icon: '🤝', title: 'Colaborar', description: 'Assertivo + cooperativo. Buscar solução que {{atenda}} ambos. Ideal mas exige tempo e confiança.' },
                  { icon: '⚖️', title: 'Comprometer', description: 'Meio-termo. Ambos cedem algo. Rápido mas pode gerar {{insatisfação}} mútua.' },
                  { icon: '🙈', title: 'Evitar', description: 'Não assertivo + não cooperativo. Ignorar o conflito. Usar quando: assunto trivial ou {{emoções}} muito altas.' },
                  { icon: '🎁', title: 'Acomodar', description: 'Não assertivo + cooperativo. Ceder para manter {{harmonia}}. Usar quando: você está errado ou a relação importa mais.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Motivação — o que a ciência diz',
              },
              {
                kind: 'paragraph',
                text: 'A maioria dos gestores usa motivação errada: mais dinheiro, mais pressão, mais controle. A ciência mostra o oposto. Deci & Ryan (Teoria da Autodeterminação, 1985): motivação intrínseca supera extrínseca em tarefas que exigem {{criatividade e pensamento complexo}}.',
              },
              {
                kind: 'pillar-grid',
                title: '3 drivers de motivação intrínseca (Daniel Pink, 2009)',
                pillars: [
                  { icon: '🔓', title: 'Autonomia', description: 'Poder decidir {{como}} fazer o trabalho. Não é liberdade total — é liberdade dentro de limites claros.', metric: { value: '+20%', label: 'produtividade com autonomia (Gallup)' } },
                  { icon: '📈', title: 'Maestria', description: 'O desejo de ficar cada vez {{melhor}} em algo que importa. Pessoas querem progredir, não estagnar.', metric: { value: '#1', label: 'razão de saída: estagnação' } },
                  { icon: '🎯', title: 'Propósito', description: 'Fazer algo que {{importa}} além de si mesmo. Empresas com propósito claro têm 3x mais engajamento.', metric: { value: '3x', label: 'mais engajamento (Deloitte)' } },
                ],
              },
              {
                kind: 'heading',
                text: 'Reuniões 1:1',
              },
              {
                kind: 'paragraph',
                text: 'O 1:1 é a reunião mais importante da gestão de pessoas. É o momento em que o líder dá atenção individual, alinha expectativas, remove bloqueios e desenvolve o colaborador. Regras: frequência fixa (semanal ou quinzenal), pauta do {{liderado}} (não do líder), foco em desenvolvimento (não em status de projeto).',
              },
              {
                kind: 'heading',
                text: 'Segurança psicológica',
              },
              {
                kind: 'paragraph',
                text: 'O Projeto Aristóteles do Google analisou {{180 equipes}} para descobrir o que diferencia as de alta performance. A resposta não foi QI, talento ou experiência — foi segurança psicológica: a crença compartilhada de que a equipe é segura para {{correr riscos}} interpessoais.',
              },
              {
                kind: 'paragraph',
                text: 'Amy Edmondson (Harvard, 2018): "A Fearless Organization" mostrou que equipes com alta segurança psicológica reportam mais erros (porque não escondem), aprendem mais rápido e inovam mais. Equipes com baixa segurança têm {{menos erros reportados}} — mas não menos erros reais. Apenas erros escondidos.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada abordagem de conflito serve a uma situação. Classifique.',
              compare: {
                columnHeaders: ['Competir', 'Colaborar', 'Evitar'],
                rows: [
                  { label: 'Quando', values: ['Urgência', 'Tempo + confiança', 'Trivial ou emocional'] },
                  { label: 'Resultado', values: ['Ganho unilateral', 'Ganho mútuo', 'Adiamento'] },
                ],
              },
              drag: {
                instruction: 'Qual abordagem usar?',
                zones: [
                  { id: 'comp', label: 'Competir' },
                  { id: 'colab', label: 'Colaborar' },
                  { id: 'evit', label: 'Evitar' },
                  { id: 'acom', label: 'Acomodar' },
                ],
                items: [
                  { id: 'fogo', label: 'Incêndio no prédio — evacuar agora', correctZone: 'comp', correctFeedback: 'Certo. Emergência = competir (decisão rápida).', wrongFeedback: 'Emergência exige decisão unilateral.' },
                  { id: 'strat', label: 'Definir estratégia de 5 anos da empresa', correctZone: 'colab', correctFeedback: 'Certo. Decisão importante = colaborar.', wrongFeedback: 'Estratégia precisa de solução que atenda todos.' },
                  { id: 'cafe', label: 'Discussão sobre sabor do café do escritório', correctZone: 'evit', correctFeedback: 'Certo. Trivial = evitar (não gaste energia).', wrongFeedback: 'Assunto trivial = não vale o conflito.' },
                  { id: 'errei', label: 'Você cometeu erro claro e o colega apontou', correctZone: 'acom', correctFeedback: 'Certo. Você está errado = aceitar com humildade.', wrongFeedback: 'Quando está errado, acomodar é sabedoria.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Conflito bem gerenciado {{fortalece}}. Motivação real vem de autonomia, maestria e propósito — não de dinheiro. 1:1 é a ferramenta mais subutilizada. E segurança psicológica é o fator #1 de alta performance.',
              keyInsights: [
                'Thomas-Kilmann: {{5 abordagens}} de conflito. Nenhuma é sempre certa — o contexto define.',
                'Daniel Pink (2009): Autonomia + Maestria + Propósito > dinheiro para motivação em trabalho {{complexo}}.',
                'Google Aristotle (180 equipes): segurança psicológica = fator {{#1}} de alta performance.',
              ],
            },
          },
          {
            id: 'M3-1-s1',
            type: 'simulation',
            title: 'Qual é o Seu Estilo de Liderança?',
            simulationId: 'leadership-style',
            description: 'Descubra seu estilo predominante e como adaptar a cada situação.',
          },
          {
            id: 'M3-1-s2',
            type: 'simulation',
            title: 'Diagnóstico Tuckman — Em Qual Fase Está Sua Equipe?',
            simulationId: 'tuckman-diagnostic',
            description: 'Avalie sua equipe nas 5 fases e veja recomendações de ação.',
          },
          {
            id: 'M3-1-s3',
            type: 'simulation',
            title: 'Gestão de Conflitos — Escolha a Abordagem Certa',
            simulationId: 'conflict-management',
            description: 'Cenários reais: qual abordagem Thomas-Kilmann usar?',
          },
          {
            id: 'M3-1-s4',
            type: 'simulation',
            title: 'Diagnóstico de Liderança e Equipe — Avaliação 360°',
            simulationId: 'leadership-360',
            description: 'Avaliação completa de liderança, equipe e cultura.',
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
            id: 'M4-0-cap1',
            type: 'chapter',
            number: 1,
            title: 'Pensamento Crítico e Lógica nos Negócios',
            subtitle: 'Por que filosofia importa — falácias, vieses e como pensar com rigor',
            opening: {
              leadText: 'Filosofia não é abstração inútil. É a disciplina que treina o {{pensamento rigoroso}} — questionar suposições, construir argumentos e tomar decisões sob incerteza. Todo gestor que já tomou uma decisão baseada em suposição não verificada precisava de filosofia.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'Pensamento crítico é a capacidade de avaliar informações de forma objetiva, identificar vieses e construir conclusões fundamentadas. É a competência mais valorizada por CEOs globais (World Economic Forum, 2023) — acima de liderança e {{comunicação}}.',
              },
              {
                kind: 'pillar-grid',
                title: 'Ferramentas do pensamento crítico',
                pillars: [
                  { icon: '🔍', title: 'Análise de argumentos', description: 'Separar premissa de conclusão. A conclusão {{decorre}} das premissas? Ou tem salto lógico?' },
                  { icon: '⚠️', title: 'Identificação de vieses', description: 'Viés de confirmação (buscar só o que confirma), ancoragem (primeira informação {{domina}}), efeito halo.' },
                  { icon: '🧪', title: 'Método socrático', description: 'Perguntar "por quê?" até chegar à premissa fundamental. Se a premissa é {{falsa}}, toda conclusão cai.' },
                  { icon: '❌', title: 'Detecção de falácias', description: 'Argumentos que parecem válidos mas não são: apelo à autoridade, falsa dicotomia, {{ad hominem}}, correlação ≠ causalidade.' },
                ],
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Falácia do Apelo à Autoridade',
                    period: 'Erro lógico #1 em negócios',
                    text: '"O CEO da empresa X disse que funciona, logo funciona." Autoridade não prova verdade. Até especialistas erram. A pergunta certa: quais são os {{dados}}, independente de quem falou?',
                    caseStudy: {
                      company: 'WeWork',
                      year: 2019,
                      story: 'Adam Neumann (CEO) convenceu investidores com carisma, não dados. Valuation de {{US$ 47 bilhões}} caiu para US$ 9 bilhões quando os números foram analisados. Autoridade sem dado = bolha.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '$47B → $9B', label: 'Queda de valuation' },
                        { value: '0', label: 'Lucro acumulado' },
                        { value: 'Carisma', label: 'Substituiu análise' },
                      ],
                      insight: 'Falácia de autoridade é o viés mais {{caro}} do mundo corporativo. Dados vencem cargo.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Correlação ≠ Causalidade',
                    period: 'Erro lógico #2 em dados',
                    text: '"Vendas subiram depois da campanha, logo a campanha causou a subida." Pode ser coincidência, sazonalidade ou outro fator. Correlação mostra {{associação}}, não causa.',
                    caseStudy: {
                      company: 'Marketing digital',
                      year: 2024,
                      story: 'Empresa investiu R$ 500k em branding. Vendas subiram 20%. Mas o mercado inteiro subiu 18%. O branding contribuiu {{2%}}, não 20%. Sem grupo controle, atribuição é chute.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '20%', label: 'Crescimento total' },
                        { value: '18%', label: 'Crescimento do mercado' },
                        { value: '2%', label: 'Contribuição real' },
                      ],
                      insight: 'Para provar causalidade: grupo controle, teste A/B ou análise {{contrafactual}}. Sem isso, é opinião.',
                    },
                  },
                  {
                    index: 3,
                    title: 'Viés de Confirmação',
                    period: 'O viés mais perigoso',
                    text: 'Buscar apenas informações que confirmam o que já acredita. Ignorar ou desqualificar evidências {{contrárias}}. Todo ser humano tem. Gestores disciplinados combatem ativamente.',
                    caseStudy: {
                      company: 'Kodak',
                      year: 1997,
                      story: 'Diretoria tinha dados mostrando crescimento de câmeras digitais. Mas buscava relatórios que confirmassem que filme era {{superior}}. Viés de confirmação custou 130 anos de história.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '130 anos', label: 'História perdida' },
                        { value: '2012', label: 'Falência' },
                        { value: '$6.75B', label: 'Dívidas' },
                      ],
                      insight: 'Antídoto: designar um "Red Team" que ataque a ideia dominante. CIA e militares usam. Empresas {{deveriam}}.',
                    },
                  },
                ],
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada falácia/viés opera de forma diferente. Identifique.',
              compare: {
                columnHeaders: ['Apelo à Autoridade', 'Correlação ≠ Causa', 'Viés Confirmação'],
                rows: [
                  { label: 'Erro', values: ['Cargo prova verdade', 'Associação prova causa', 'Busca só o que confirma'] },
                  { label: 'Antídoto', values: ['Exigir dados', 'Grupo controle', 'Red Team'] },
                ],
              },
              drag: {
                instruction: 'Qual falácia/viés?',
                zones: [
                  { id: 'aut', label: 'Apelo à Autoridade' },
                  { id: 'cor', label: 'Correlação ≠ Causa' },
                  { id: 'conf', label: 'Viés de Confirmação' },
                ],
                items: [
                  { id: 'ceo', label: '"O Elon Musk faz assim, logo devemos fazer"', correctZone: 'aut', correctFeedback: 'Certo. Autoridade ≠ verdade.', wrongFeedback: '"Fulano faz" = apelo à autoridade.' },
                  { id: 'sorvete', label: '"Vendas de sorvete sobem no verão, afogamentos também"', correctZone: 'cor', correctFeedback: 'Certo. Ambos correlacionam com calor, não entre si.', wrongFeedback: 'Coincidência temporal ≠ causa.' },
                  { id: 'rel', label: '"Li 5 artigos que confirmam minha tese"', correctZone: 'conf', correctFeedback: 'Certo. Buscou só confirmação.', wrongFeedback: 'Buscar só o que confirma = viés.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Pensamento crítico é a competência {{#1}} do século XXI (WEF 2023). Falácias e vieses custam bilhões — WeWork ($47B→$9B), Kodak (130 anos). O antídoto: dados, método e humildade intelectual.',
              keyInsights: [
                'WEF 2023: pensamento crítico é a competência mais valorizada por CEOs — acima de {{liderança}}.',
                'WeWork: falácia de autoridade custou {{US$ 38 bilhões}} em valuation.',
                'Viés de confirmação: designar Red Team que ataque a ideia dominante. Se {{sobrevive}}, é robusta.',
              ],
              nextChapterHint: 'Capítulo 2 · Ética Empresarial',
              nextChapterBlurb: '4 frameworks para decisões difíceis — utilitarismo, Kant, virtude e cuidado.',
            },
          },
          {
            id: 'M4-0-cap2',
            type: 'chapter',
            number: 2,
            title: 'Ética Empresarial e Epistemologia',
            subtitle: '4 frameworks éticos + como separar conhecimento válido de achismo',
            opening: {
              leadText: 'Toda decisão empresarial tem dimensão ética, mesmo quando não é óbvia. Demitir, precificar, terceirizar, usar dados — cada ação afeta {{pessoas}}. Os 4 frameworks éticos dão estrutura para decidir quando não há resposta fácil.',
            },
            body: [
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Utilitarismo',
                    period: 'Consequências',
                    text: 'Jeremy Bentham e John Stuart Mill. A ação correta é a que produz o {{maior bem para o maior número}}. Foco nas consequências, não nas intenções.',
                    caseStudy: {
                      company: 'Ford Pinto',
                      year: 1978,
                      story: 'Ford calculou: consertar tanque = {{US$ 137M}}. Indenizações por mortes = US$ 49M. Decisão utilitarista: não consertar. Resultado: escândalo, destruição de reputação, lição sobre os limites do cálculo.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '$137M', label: 'Custo do conserto' },
                        { value: '$49M', label: 'Custo das indenizações' },
                        { value: 'Bilhões', label: 'Custo reputacional real' },
                      ],
                      insight: 'Utilitarismo funciona para decisões de {{escala}} (política pública, alocação de recursos). Falha quando reduz vidas a números.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Deontologia (Kant)',
                    period: 'Dever e regras',
                    text: 'Immanuel Kant: a ação é ética se pode ser {{universalizada}} sem contradição. "Mentir é errado" — mesmo que a verdade cause prejuízo. O dever moral importa mais que a consequência.',
                    caseStudy: {
                      company: 'Johnson & Johnson',
                      year: 1982,
                      story: 'Tylenol envenenado matou 7 pessoas. J&J recolheu {{31 milhões}} de frascos, custando US$ 100M. Decisão kantiana: "se fosse nosso filho?" Resultado: confiança reconstruída, marca fortalecida.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '31M', label: 'Frascos recolhidos' },
                        { value: '$100M', label: 'Custo do recall' },
                        { value: '#1', label: 'Caso de ética corporativa' },
                      ],
                      insight: 'Kant funciona quando a ação {{pode ser universalizada}}: "se todos fizessem isso, o mundo seria melhor?"',
                    },
                  },
                  {
                    index: 3,
                    title: 'Ética das Virtudes (Aristóteles)',
                    period: 'Caráter',
                    text: 'Aristóteles: a ação ética vem do {{caráter}} do agente, não de regras ou cálculos. Cultive virtudes (coragem, temperança, justiça, prudência) e as decisões éticas seguem naturalmente.',
                    caseStudy: {
                      company: 'Patagonia',
                      year: 2022,
                      story: 'Yvon Chouinard doou a empresa inteira ({{US$ 3 bilhões}}) para combate às mudanças climáticas. Não por cálculo nem por regra — por caráter. "Earth is now our only shareholder."',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '$3B', label: 'Valor doado' },
                        { value: '100%', label: 'Da empresa' },
                        { value: 'Caráter', label: 'Não cálculo nem regra' },
                      ],
                      insight: 'Virtude não se ensina em PowerPoint — se {{cultiva}} ao longo do tempo. É a ética mais difícil e mais duradoura.',
                    },
                  },
                  {
                    index: 4,
                    title: 'Ética do Cuidado',
                    period: 'Relacionamentos',
                    text: 'Carol Gilligan (Harvard, 1982): ética baseada em {{relacionamentos e responsabilidade}} com os outros. A pergunta não é "o que é justo?" mas "quem será afetado e como posso cuidar?"',
                    caseStudy: {
                      company: 'Natura',
                      year: 2010,
                      story: 'Relação com comunidades amazônicas: não como fornecedores descartáveis mas como {{parceiros}} de longo prazo. 2.000+ famílias com renda garantida. Cuidado como modelo de negócio.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '2.000+', label: 'Famílias parceiras' },
                        { value: '33', label: 'Comunidades' },
                        { value: 'R$ 2B', label: 'Receita Amazônia' },
                      ],
                      insight: 'Ética do cuidado é a base da sustentabilidade real: tratar stakeholders como {{pessoas}}, não como variáveis.',
                    },
                  },
                ],
              },
              {
                kind: 'heading',
                text: 'Epistemologia — como sabemos o que sabemos?',
              },
              {
                kind: 'paragraph',
                text: 'Epistemologia estuda o conhecimento: o que é verdade? Como justificar uma crença? A maioria das decisões empresariais é baseada em suposições não verificadas — "o mercado quer isso", "nosso diferencial é qualidade", "o problema é preço". Epistemologia ensina a perguntar: "como eu {{sei}} isso? Qual a evidência?"',
              },
              {
                kind: 'paragraph',
                text: 'Karl Popper: conhecimento científico é aquele que pode ser {{falsificado}}. Se não existe experimento que possa provar que uma teoria é falsa, ela não é ciência — é crença. No mundo dos negócios: "nosso produto é o melhor" — como falsificar isso? Qual métrica? Qual benchmark? Se não tem como provar que é falso, não é dado — é fé.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada framework ético faz uma pergunta diferente. Classifique.',
              compare: {
                columnHeaders: ['Utilitarismo', 'Kant', 'Virtude', 'Cuidado'],
                rows: [
                  { label: 'Pergunta', values: ['Maior bem?', 'Universalizável?', 'Que caráter?', 'Quem é afetado?'] },
                  { label: 'Foco', values: ['Consequência', 'Dever', 'Caráter', 'Relação'] },
                ],
              },
              drag: {
                instruction: 'Qual framework ético guiou a decisão?',
                zones: [
                  { id: 'util', label: 'Utilitarismo' },
                  { id: 'kant', label: 'Kant' },
                  { id: 'virt', label: 'Virtude' },
                  { id: 'cuid', label: 'Cuidado' },
                ],
                items: [
                  { id: 'jj', label: 'J&J recolheu 31M frascos por dever moral', correctZone: 'kant', correctFeedback: 'Certo. "Se fosse nosso filho?" = dever universal.', wrongFeedback: 'Recolher por princípio = Kant.' },
                  { id: 'pat', label: 'Patagonia doou US$ 3B por caráter', correctZone: 'virt', correctFeedback: 'Certo. Não por cálculo — por quem Chouinard é.', wrongFeedback: 'Doação por caráter = virtude.' },
                  { id: 'nat', label: 'Natura cuida de comunidades como parceiras', correctZone: 'cuid', correctFeedback: 'Certo. Relação de cuidado = ética do cuidado.', wrongFeedback: 'Parceria de cuidado = ética do cuidado.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Não existe framework ético "melhor". Utilitarismo para {{escala}}, Kant para {{princípios}}, Virtude para {{caráter}}, Cuidado para {{relações}}. Usar os 4 juntos é a abordagem mais robusta.',
              keyInsights: [
                'Ford Pinto: utilitarismo puro reduz vidas a números. Consequências importam mas não são {{tudo}}.',
                'J&J Tylenol: decisão kantiana custou $100M mas salvou a marca. Princípio > {{cálculo}} de curto prazo.',
                'Popper: se não pode ser {{falsificado}}, não é conhecimento — é crença.',
              ],
              nextChapterHint: 'Capítulo 3 · Filosofia Política e Existencialismo',
              nextChapterBlurb: 'De Adam Smith a Rawls — e por que trabalho precisa de significado.',
            },
          },
          {
            id: 'M4-0-cap3',
            type: 'chapter',
            number: 3,
            title: 'Filosofia Política, Ciência e Propósito',
            subtitle: 'Smith, Marx, Rawls — e por que existencialismo importa para gestores',
            opening: {
              leadText: 'Todo modelo de negócio opera dentro de um sistema econômico. Todo sistema econômico é baseado em premissas filosóficas sobre a {{natureza humana}}, justiça e o papel do Estado. E o existencialismo responde à pergunta mais negligenciada: por que estamos fazendo isso?',
            },
            body: [
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Adam Smith — Mão Invisível',
                    period: 'Liberalismo econômico',
                    text: '"A Riqueza das Nações" (1776). O interesse próprio, guiado pela competição, leva ao {{bem coletivo}}. A "mão invisível" do mercado aloca recursos melhor que o Estado.',
                    caseStudy: {
                      company: 'Silicon Valley',
                      year: 2024,
                      story: 'Modelo de startups: competição feroz, auto-interesse dos fundadores, mas o resultado agrega valor para {{milhões}} de usuários. Smith aplicado ao extremo.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '1776', label: 'A Riqueza das Nações' },
                        { value: 'Mão invisível', label: 'Mercado regula' },
                      ],
                      insight: 'Smith não era anti-Estado. Defendia que o Estado garantisse {{regras do jogo}} — educação, justiça, defesa. Laissez-faire puro não é Smith.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Karl Marx — Crítica ao Capital',
                    period: 'Conflito de classes',
                    text: '"O Capital" (1867). O capitalismo gera {{desigualdade}} estrutural. O trabalhador produz mais valor do que recebe (mais-valia). A contradição entre capital e trabalho é insolúvel dentro do sistema.',
                    caseStudy: {
                      company: 'Gig Economy',
                      year: 2024,
                      story: 'Entregadores de iFood/Uber: produzem {{bilhões}} em GMV, recebem salário mínimo. Marx diria: mais-valia digital. O debate sobre regulação da gig economy é marxismo aplicado.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '1867', label: 'O Capital' },
                        { value: 'Mais-valia', label: 'Valor apropriado pelo capital' },
                      ],
                      insight: 'Não é preciso ser marxista para reconhecer que {{desigualdade extrema}} desestabiliza mercados e sociedades.',
                    },
                  },
                  {
                    index: 3,
                    title: 'John Rawls — Véu da Ignorância',
                    period: 'Justiça como equidade',
                    text: '"Uma Teoria da Justiça" (1971). Se você não soubesse qual posição ocuparia na sociedade ({{véu da ignorância}}), que regras criaria? As regras justas são as que protegem os mais vulneráveis.',
                    caseStudy: {
                      company: 'Políticas de diversidade',
                      year: 2024,
                      story: 'Rawls fundamenta cotas e programas de inclusão: se você não soubesse se nasceria homem ou mulher, negro ou branco, rico ou pobre — apoiaria {{igualdade}} de oportunidades.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '1971', label: 'Uma Teoria da Justiça' },
                        { value: 'Véu', label: 'Da ignorância' },
                      ],
                      insight: 'Rawls é a base filosófica do ESG social: criar regras que protejam os mais {{vulneráveis}}, não os mais poderosos.',
                    },
                  },
                ],
              },
              {
                kind: 'heading',
                text: 'Existencialismo e propósito',
              },
              {
                kind: 'paragraph',
                text: 'O existencialismo coloca liberdade e responsabilidade individual no centro. Sartre: "estamos condenados a ser {{livres}}" — cada escolha define quem somos. Para negócios: por que essa empresa existe? Se a resposta é apenas "lucro", funcionários, clientes e investidores cada vez mais procuram outra empresa com resposta {{melhor}}.',
              },
              {
                kind: 'paragraph',
                text: 'Viktor Frankl ("Em Busca de Sentido", 1946): pessoas que encontram significado no que fazem são mais resilientes, produtivas e engajadas. Empresas com propósito claro têm {{3x mais engajamento}} (Deloitte, 2023). Propósito não é slogan na parede — é critério de decisão em momentos difíceis.',
              },
              {
                kind: 'heading',
                text: 'Filosofia da ciência aplicada',
              },
              {
                kind: 'paragraph',
                text: 'No mundo dos negócios, consultores e influencers vendem "metodologias" que parecem ciência mas não são. Karl Popper ensinou: conhecimento científico é {{falsificável}}. Thomas Kuhn mostrou que paradigmas mudam por revoluções, não evolução gradual. Para gestores: questione "verdades" do setor. O que é paradigma estabelecido pode ser o próximo a {{cair}}.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada filósofo fundamenta uma visão diferente de economia e sociedade.',
              compare: {
                columnHeaders: ['Smith', 'Marx', 'Rawls'],
                rows: [
                  { label: 'Pergunta', values: ['Como criar riqueza?', 'Quem se beneficia?', 'O que é justo?'] },
                  { label: 'Resposta', values: ['Mercado livre', 'Trabalhador explorado', 'Proteger vulneráveis'] },
                ],
              },
              drag: {
                instruction: 'Qual filósofo fundamenta cada argumento?',
                zones: [
                  { id: 'smith', label: 'Smith' },
                  { id: 'marx', label: 'Marx' },
                  { id: 'rawls', label: 'Rawls' },
                ],
                items: [
                  { id: 'comp', label: '"Competição entre empresas beneficia o consumidor"', correctZone: 'smith', correctFeedback: 'Certo. Mão invisível = Smith.', wrongFeedback: 'Competição → bem coletivo = Smith.' },
                  { id: 'gig', label: '"Entregadores produzem bilhões e recebem mínimo"', correctZone: 'marx', correctFeedback: 'Certo. Mais-valia = Marx.', wrongFeedback: 'Desigualdade estrutural = Marx.' },
                  { id: 'cota', label: '"Se não soubesse sua posição, criaria cotas"', correctZone: 'rawls', correctFeedback: 'Certo. Véu da ignorância = Rawls.', wrongFeedback: 'Proteger vulneráveis = Rawls.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Smith, Marx e Rawls não são história — são as lentes pelas quais {{toda}} decisão econômica e política é debatida hoje. E o existencialismo lembra: sem propósito, a empresa é máquina de lucro sem alma.',
              keyInsights: [
                'Smith: mercado livre cria riqueza. Mas Smith também defendia que o Estado garantisse {{regras do jogo}}.',
                'Marx: desigualdade extrema {{desestabiliza}}. Gig economy é o debate marxista do século XXI.',
                'Frankl: empresas com propósito têm {{3x}} mais engajamento. Propósito não é marketing — é decisão.',
              ],
            },
          },
          {
            id: 'M4-0-cap4',
            type: 'chapter',
            number: 4,
            title: 'Filosofia Oriental, Linguagem, Estética e Tecnologia',
            subtitle: 'Zen e liderança, poder das palavras, beleza como diferencial e ética da IA',
            opening: {
              leadText: 'A filosofia ocidental enfatiza análise, controle e ação. A filosofia oriental oferece perspectivas complementares — e cada vez mais {{valorizadas}} em liderança e inovação. A linguagem cria realidade. A estética diferencia. E a tecnologia nunca é neutra.',
            },
            body: [
              {
                kind: 'pillar-grid',
                title: 'Filosofia Oriental aplicada a negócios',
                pillars: [
                  { icon: '☯️', title: 'Taoísmo (Lao Tzu)', description: '"O líder supremo é aquele cujo povo mal sabe que ele existe." Liderança como {{não-ação}} (wu wei). Criar condições para que as coisas aconteçam naturalmente.' },
                  { icon: '🧘', title: 'Zen Budismo', description: 'Foco no presente. Mente de principiante (shoshin). Steve Jobs praticava zen: "Stay hungry, stay foolish." Simplicidade como {{filosofia}}, não como limitação.' },
                  { icon: '⚔️', title: 'Sun Tzu', description: '"A Arte da Guerra" (500 a.C.). Estratégia como antecipação: "conheça o inimigo e a si mesmo e em 100 batalhas não {{correrá}} perigo." Aplicado a competição de mercado.' },
                  { icon: '🌊', title: 'Wabi-Sabi', description: 'Estética japonesa da imperfeição. Aceitar o imperfeito, o transitório, o incompleto. Aplicação: MVP — lance imperfeito, {{itere}}. Perfeição é inimiga do progresso.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Linguagem e comunicação',
              },
              {
                kind: 'paragraph',
                text: 'A linguagem não apenas descreve a realidade — ela {{CRIA}} a realidade. Ludwig Wittgenstein (1889-1951): "os limites da minha linguagem são os limites do meu mundo." Como você nomeia as coisas determina como as pessoas pensam sobre elas. "Demissão" vs "reestruturação" vs "realinhamento estratégico" — mesmo evento, narrativas completamente diferentes.',
              },
              {
                kind: 'heading',
                text: 'Estética e experiência',
              },
              {
                kind: 'paragraph',
                text: 'Estética é diferencial competitivo. Apple cobrou premium por décadas não por superioridade técnica — mas por {{beleza}} e experiência sensorial. Dieter Rams (Braun/Vitsoe): "bom design é o mínimo de design possível." Estética sustentável: produtos que envelhecem com {{dignidade}} em vez de virar lixo.',
              },
              {
                kind: 'heading',
                text: 'Filosofia da tecnologia e ética da IA',
              },
              {
                kind: 'paragraph',
                text: 'A tecnologia nunca é neutra. Toda ferramenta carrega os valores de quem a criou. Martin Heidegger alertou que a tecnologia moderna transforma tudo em "{{recurso a ser otimizado}}" — inclusive pessoas. A IA generativa amplifica vieses existentes. Quem decide o que a IA "aprende" decide o que ela reproduz. A pergunta não é "a IA pode fazer isso?" — é "a IA {{deve}} fazer isso?"',
              },
              {
                kind: 'pillar-grid',
                title: 'Dilemas da IA que gestores enfrentam',
                pillars: [
                  { icon: '🔍', title: 'Viés algorítmico', description: 'IA treinada com dados históricos reproduz {{discriminação}} histórica. Recrutamento por IA pode discriminar gênero e raça.' },
                  { icon: '👁️', title: 'Vigilância', description: 'Monitoramento de produtividade: eficiência ou {{invasão}} de privacidade? Onde está o limite?' },
                  { icon: '🤖', title: 'Substituição', description: 'Automatizar para reduzir custo: legítimo ou {{irresponsável}} socialmente? Quem absorve os desempregados?' },
                  { icon: '🧬', title: 'Transhumanismo', description: 'Implantes neurais, edição genética, extensão de vida. A pergunta: quem terá {{acesso}}? Pode criar desigualdade biológica irreversível.' },
                ],
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada ramo filosófico responde a uma dimensão diferente dos negócios.',
              compare: {
                columnHeaders: ['Oriental', 'Linguagem', 'Estética', 'Tecnologia'],
                rows: [
                  { label: 'Ensina', values: ['Equilíbrio', 'Narrativa', 'Beleza', 'Responsabilidade'] },
                  { label: 'Aplicação', values: ['Liderança', 'Comunicação', 'Produto', 'IA/Dados'] },
                ],
              },
              drag: {
                instruction: 'Qual filósofo/conceito se aplica?',
                zones: [
                  { id: 'ori', label: 'Oriental' },
                  { id: 'ling', label: 'Linguagem' },
                  { id: 'est', label: 'Estética' },
                  { id: 'tech', label: 'Tecnologia' },
                ],
                items: [
                  { id: 'jobs', label: 'Steve Jobs: "Stay hungry, stay foolish"', correctZone: 'ori', correctFeedback: 'Certo. Jobs era praticante de Zen.', wrongFeedback: 'Mente de principiante = Zen = oriental.' },
                  { id: 'witt', label: '"Limites da linguagem = limites do mundo"', correctZone: 'ling', correctFeedback: 'Certo. Wittgenstein = linguagem.', wrongFeedback: 'Wittgenstein = filosofia da linguagem.' },
                  { id: 'rams', label: '"Bom design é o mínimo de design possível"', correctZone: 'est', correctFeedback: 'Certo. Dieter Rams = estética.', wrongFeedback: 'Design mínimo = estética.' },
                  { id: 'bias', label: 'IA de recrutamento discrimina gênero', correctZone: 'tech', correctFeedback: 'Certo. Viés algorítmico = ética da tecnologia.', wrongFeedback: 'Viés de IA = filosofia da tecnologia.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Filosofia oriental ensina {{equilíbrio}}. Linguagem cria realidade. Estética diferencia. E a tecnologia nunca é neutra — quem programa a IA programa os {{valores}} que ela reproduz.',
              keyInsights: [
                'Lao Tzu: o melhor líder é aquele que o povo mal sabe que {{existe}}. Liderar é criar condições.',
                'Wittgenstein: "limites da linguagem = limites do {{mundo}}." Renomear muda a percepção.',
                'Heidegger: tecnologia transforma tudo em recurso. A pergunta não é "pode?" — é "{{deve}}?"',
              ],
            },
          },
          {
            id: 'M4-0-s1',
            type: 'simulation',
            title: 'Detector de Falácias — Identifique o Erro Lógico',
            simulationId: 'fallacy-detector',
            description: '10 argumentos empresariais. Identifique a falácia em cada um.',
          },
          {
            id: 'M4-0-s2',
            type: 'simulation',
            title: 'Dilemas Éticos Empresariais — Aplique os 4 Frameworks',
            simulationId: 'ethics-dilemmas',
            description: '5 dilemas reais. Analise cada um pelos 4 frameworks éticos.',
          },
          {
            id: 'M4-0-s3',
            type: 'simulation',
            title: 'Tribunal Filosófico — Julgue Decisões Empresariais',
            simulationId: 'philosophy-tribunal',
            description: 'Decisões polêmicas de empresas reais julgadas por diferentes filósofos.',
          },
        ],
      },

      {
        id: 'M4-1',
        title: 'Calculo Aplicado a Negocios',
        blocks: [
          {
            id: 'M4-1-cap1',
            type: 'chapter',
            number: 1,
            title: 'Funções, Derivadas e Otimização',
            subtitle: 'A matemática da mudança — como derivadas encontram o ponto ótimo de lucro',
            opening: {
              leadText: 'Cálculo não é abstração acadêmica. É a matemática da {{mudança}} — e negócios são sobre mudança: preço muda, demanda muda, custo muda. Quem domina cálculo toma decisões melhores porque entende como variáveis se relacionam.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'Uma função descreve a relação entre variáveis. Receita = Preço × Quantidade. Lucro = Receita - Custo. Demanda = f(Preço). No mundo dos negócios, tudo é {{função}} — e entender a função é entender o negócio.',
              },
              {
                kind: 'heading',
                text: 'Derivadas — taxas de variação',
              },
              {
                kind: 'paragraph',
                text: 'A derivada mede a taxa de variação instantânea. Em negócios: "se eu aumentar o preço em R$ 1, quanto muda a demanda?" Essa resposta é a derivada. Quando a derivada do lucro = 0, encontramos o {{ponto máximo}} (ou mínimo). É assim que se otimiza.',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Receita Marginal',
                    period: 'Derivada da receita',
                    text: 'Quanto a receita aumenta ao vender {{uma unidade a mais}}. Enquanto receita marginal > custo marginal, vale produzir mais. Quando se igualam, é o ponto ótimo.',
                    caseStudy: {
                      company: 'Netflix',
                      year: 2023,
                      story: 'Cada novo assinante tem receita marginal de {{~R$ 40/mês}}. Custo marginal de atender 1 a mais é quase zero (streaming). Por isso o modelo escala: marginal positiva em cada unidade.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '~R$ 40', label: 'Receita marginal por assinante' },
                        { value: '~R$ 0', label: 'Custo marginal por assinante' },
                        { value: '230M+', label: 'Assinantes globais' },
                      ],
                      insight: 'Negócios digitais têm custo marginal {{tendendo a zero}} — cada unidade adicional é quase lucro puro.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Custo Marginal',
                    period: 'Derivada do custo',
                    text: 'Quanto custa produzir {{uma unidade a mais}}. Em fábricas: cresce com capacidade (hora extra, desgaste). Em SaaS: quase zero. Entender custo marginal define precificação.',
                    caseStudy: {
                      company: 'Ambev',
                      year: 2023,
                      story: 'Produzir 1 cerveja a mais custa R$ 0,80 (matéria-prima + energia). Vende por R$ 3,50. Margem por unidade: {{R$ 2,70}}. Por isso volume é estratégia — cada unidade gera lucro.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'R$ 0,80', label: 'Custo marginal' },
                        { value: 'R$ 3,50', label: 'Preço de venda' },
                        { value: 'R$ 2,70', label: 'Margem por unidade' },
                      ],
                      insight: 'Ponto ótimo de produção: onde Receita Marginal = Custo Marginal. Antes disso, produzir {{mais}}. Depois, parar.',
                    },
                  },
                ],
              },
              {
                kind: 'heading',
                text: 'Elasticidade — como preço afeta demanda',
              },
              {
                kind: 'paragraph',
                text: 'Elasticidade-preço mede a sensibilidade da demanda ao preço. Se |E| > 1 = {{elástico}} (sobe preço, demanda cai muito — ex: pizza delivery). Se |E| < 1 = {{inelástico}} (sobe preço, demanda mal muda — ex: remédio, combustível). Entender elasticidade é a diferença entre precificar certo e perder clientes.',
              },
              {
                kind: 'pillar-grid',
                title: 'Elasticidade na prática',
                pillars: [
                  { icon: '🍕', title: 'Elástico (|E| > 1)', description: 'Pizza, roupas, streaming. Muitas alternativas. Subir preço = perder {{clientes}} rapidamente.', metric: { value: '|E| > 1', label: 'sensível ao preço' } },
                  { icon: '💊', title: 'Inelástico (|E| < 1)', description: 'Remédios, combustível, água. Poucas alternativas. Subir preço = demanda {{mal muda}}.', metric: { value: '|E| < 1', label: 'insensível ao preço' } },
                  { icon: '💎', title: 'Unitário (|E| = 1)', description: 'Variação de preço causa variação {{proporcional}} na demanda. Receita total fica constante.', metric: { value: '|E| = 1', label: 'equilíbrio' } },
                ],
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Entender elasticidade determina a estratégia de preço. Classifique.',
              compare: {
                columnHeaders: ['Elástico', 'Inelástico'],
                rows: [
                  { label: 'Reação ao preço', values: ['Demanda cai muito', 'Demanda mal muda'] },
                  { label: 'Estratégia', values: ['Competir por preço/volume', 'Aumentar preço com cuidado'] },
                ],
              },
              drag: {
                instruction: 'Elástico ou Inelástico?',
                zones: [
                  { id: 'el', label: 'Elástico' },
                  { id: 'in', label: 'Inelástico' },
                ],
                items: [
                  { id: 'gas', label: 'Gasolina', correctZone: 'in', correctFeedback: 'Certo. Poucas alternativas = inelástico.', wrongFeedback: 'Combustível = poucas alternativas.' },
                  { id: 'netflix', label: 'Assinatura Netflix', correctZone: 'el', correctFeedback: 'Certo. Muitas alternativas de entretenimento.', wrongFeedback: 'Streaming tem muitas alternativas.' },
                  { id: 'insulina', label: 'Insulina', correctZone: 'in', correctFeedback: 'Certo. Necessidade vital = inelástico.', wrongFeedback: 'Remédio essencial = inelástico.' },
                  { id: 'roupa', label: 'Camiseta básica', correctZone: 'el', correctFeedback: 'Certo. Muitas marcas e opções.', wrongFeedback: 'Roupa básica = muitas alternativas.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Derivadas encontram o {{ponto ótimo}}. Receita Marginal = Custo Marginal define quando parar de produzir. Elasticidade define como precificar. Cálculo não é teoria — é a linguagem das decisões de negócio.',
              keyInsights: [
                'Ponto ótimo: onde Receita Marginal = Custo Marginal. Antes: produzir mais. Depois: {{parar}}.',
                'Netflix: custo marginal ~R$ 0 por assinante. Por isso escala = {{lucro puro}}.',
                'Elasticidade: pizza = elástico (alternativas). Insulina = inelástico (sem {{alternativa}}).',
              ],
              nextChapterHint: 'Capítulo 2 · Investimentos e Valor do Dinheiro',
              nextChapterBlurb: 'Integrais, juros compostos, VPL, TIR — as ferramentas de decisão financeira.',
            },
          },
          {
            id: 'M4-1-cap2',
            type: 'chapter',
            number: 2,
            title: 'Investimentos e Valor do Dinheiro',
            subtitle: 'Integrais, juros compostos, VPL e TIR — decidir onde colocar dinheiro',
            opening: {
              leadText: 'Se a derivada mede a taxa de mudança, a {{integral}} mede o acumulado. No mundo financeiro: quanto acumulou ao longo do tempo? Juros compostos, VPL e TIR são integrais aplicadas — mesmo que você nunca vá resolver a integral na mão.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'A integral calcula a área sob a curva — em negócios, isso é {{acumulação}}: receita total ao longo do tempo, custo total acumulado, valor presente de um fluxo de caixa futuro. Juros compostos são a integral mais poderosa do mundo financeiro.',
              },
              {
                kind: 'pillar-grid',
                title: 'Ferramentas de decisão de investimento',
                pillars: [
                  { icon: '📊', title: 'VPL', description: 'Soma dos fluxos futuros trazidos a valor presente, menos investimento inicial. VPL > 0 = {{investir}}. É a ferramenta mais confiável.', metric: { value: '> 0', label: 'investir' } },
                  { icon: '📈', title: 'TIR', description: 'Taxa que faz VPL = 0. Se TIR > custo de capital (WACC), o investimento {{gera valor}}. Comparar TIRs entre projetos.', metric: { value: '> WACC', label: 'gera valor' } },
                  { icon: '⏱️', title: 'Payback', description: 'Tempo para recuperar o investimento. Simples ou descontado. Limitação: ignora o que acontece {{depois}}.', metric: { value: 'Quanto menor', label: 'melhor' } },
                  { icon: '💰', title: 'Juros Compostos', description: 'M = C × (1+i)^t. Einstein: "8ª maravilha." Regra dos 72: 72 ÷ taxa = anos para {{dobrar}}.', metric: { value: 'Exponencial', label: 'crescimento' } },
                ],
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'VPL na Prática',
                    period: 'Decisão de investir',
                    text: 'Nova linha de produção: investimento R$ 2M. Fluxos de R$ 600k/ano por 5 anos. Taxa: 12%. VPL = {{R$ 163k}} positivo. Investir — gera valor acima do custo de capital.',
                    caseStudy: {
                      company: 'Expansão industrial',
                      year: 2024,
                      story: 'Empresa avalia 2 projetos: Projeto A (VPL R$ 300k, TIR 18%) vs Projeto B (VPL R$ 150k, TIR {{25%}}). Escolha: se mutuamente exclusivos, priorize VPL (A). Se independentes, faça ambos.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'R$ 163k', label: 'VPL positivo' },
                        { value: '12%', label: 'Taxa de desconto' },
                        { value: '5 anos', label: 'Horizonte' },
                      ],
                      insight: 'VPL > 0 não garante sucesso — garante que SE os fluxos se confirmarem, o projeto {{gera valor}}.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Juros Compostos na Prática',
                    period: 'O poder do tempo',
                    text: 'R$ 1.000/mês a 1% a.m. por 20 anos: aporte R$ 240k. Resultado: {{R$ 989k}}. Os juros geraram R$ 749k — mais de 3x o que você colocou. Tempo é o ingrediente secreto.',
                    caseStudy: {
                      company: 'Investimento pessoal',
                      year: 2024,
                      story: 'Warren Buffett começou a investir aos {{11 anos}}. Aos 30, tinha US$ 1M. Aos 60, US$ 3.8B. Aos 90, US$ 100B+. 99% da riqueza veio depois dos 60 — juros compostos + tempo.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '3x', label: 'Juros > aporte em 20 anos' },
                        { value: '99%', label: 'Riqueza Buffett após 60 anos' },
                        { value: '72 ÷ taxa', label: 'Anos para dobrar' },
                      ],
                      insight: 'A variável mais importante dos juros compostos não é a taxa — é o {{tempo}}. Comece cedo.',
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
                ],
              },
              drag: {
                instruction: 'Qual ferramenta?',
                zones: [
                  { id: 'vpl', label: 'VPL' },
                  { id: 'tir', label: 'TIR' },
                  { id: 'pay', label: 'Payback' },
                ],
                items: [
                  { id: 'val', label: '"Quanto esse projeto agrega em reais?"', correctZone: 'vpl', correctFeedback: 'Certo. Valor absoluto = VPL.', wrongFeedback: 'Valor em R$ = VPL.' },
                  { id: 'ret', label: '"Qual a taxa de retorno?"', correctZone: 'tir', correctFeedback: 'Certo. Percentual = TIR.', wrongFeedback: 'Taxa = TIR.' },
                  { id: 'tmp', label: '"Quando recupero o que investi?"', correctZone: 'pay', correctFeedback: 'Certo. Tempo = Payback.', wrongFeedback: 'Tempo de recuperação = Payback.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Integrais acumulam. Juros compostos multiplicam. VPL decide se vale. TIR compara retornos. {{Tempo}} é a variável mais poderosa — Buffett provou.',
              keyInsights: [
                'VPL > 0 = investir. Quando VPL e TIR divergem, priorize {{VPL}}.',
                'Juros compostos: R$ 1.000/mês × 20 anos × 1% a.m. = {{R$ 989k}} (aporte: R$ 240k).',
                'Buffett: 99% da riqueza veio depois dos 60. O ingrediente secreto é {{tempo}}.',
              ],
              nextChapterHint: 'Capítulo 3 · Break-Even e Aplicações',
              nextChapterBlurb: 'Ponto de equilíbrio, depreciação e matemática no dia a dia do gestor.',
            },
          },
          {
            id: 'M4-1-cap3',
            type: 'chapter',
            number: 3,
            title: 'Break-Even, Depreciação e Aplicações',
            subtitle: 'Quando a empresa para de perder dinheiro — e o custo invisível dos ativos',
            opening: {
              leadText: 'O ponto de equilíbrio (break-even) é o momento em que receita total = custo total. Antes dele, a empresa opera no {{prejuízo}}. Depois, cada unidade vendida é lucro. Saber onde está esse ponto muda completamente a estratégia.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'Fórmula: Break-Even (unidades) = Custos Fixos ÷ (Preço Unitário - Custo Variável Unitário). A diferença (Preço - Custo Variável) é a {{margem de contribuição}} — quanto cada unidade contribui para pagar os custos fixos. Depois de pagar todos os fixos, cada unidade é lucro puro.',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Break-Even de Restaurante',
                    period: 'Exemplo prático',
                    text: 'Custo fixo: R$ 30.000/mês (aluguel + salários). Ticket médio: R$ 45. Custo variável por refeição: R$ 18. Margem de contribuição: R$ 27. Break-even: 30.000 ÷ 27 = {{1.111 refeições/mês}} = ~37/dia.',
                    caseStudy: {
                      company: 'Restaurante médio SP',
                      year: 2024,
                      story: 'Se atende {{50 refeições/dia}}, lucra (50-37) × R$ 27 × 30 = R$ 10.530/mês. Se atende 30, prejuízo de (37-30) × R$ 27 × 30 = {{-R$ 5.670/mês}}.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '1.111', label: 'Refeições break-even' },
                        { value: '37/dia', label: 'Mínimo para empatar' },
                        { value: 'R$ 27', label: 'Margem de contribuição' },
                      ],
                      insight: 'Todo restaurante que não sabe seu break-even está operando no {{escuro}}. É o número #1 do negócio.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Break-Even de SaaS',
                    period: 'Modelo digital',
                    text: 'Custo fixo: R$ 200k/mês (equipe + infra). Assinatura: R$ 99/mês. Custo variável por cliente: R$ 5/mês. Margem: R$ 94. Break-even: {{2.128 assinantes}}.',
                    caseStudy: {
                      company: 'Startup SaaS BR',
                      year: 2024,
                      story: 'Com 3.000 assinantes: lucro = (3.000 - 2.128) × R$ 94 = {{R$ 81.968/mês}}. A alavancagem do SaaS: depois do break-even, cada cliente é quase lucro puro (custo marginal baixíssimo).',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '2.128', label: 'Assinantes break-even' },
                        { value: 'R$ 94', label: 'Margem por assinante' },
                        { value: 'R$ 5', label: 'Custo variável (cloud)' },
                      ],
                      insight: 'SaaS tem custo variável baixíssimo. Depois do break-even, a escala é {{brutal}} — margem cresce com volume.',
                    },
                  },
                ],
              },
              {
                kind: 'heading',
                text: 'Depreciação e amortização',
              },
              {
                kind: 'paragraph',
                text: 'Depreciação é o custo invisível dos ativos. Uma máquina de R$ 500k que dura 10 anos deprecia R$ 50k/ano. Não sai dinheiro do caixa — mas reduz o valor do ativo e o {{lucro contábil}}. Gestores que ignoram depreciação acham que o negócio é mais lucrativo do que realmente é.',
              },
              {
                kind: 'paragraph',
                text: '**Amortização** é o mesmo conceito aplicado a ativos {{intangíveis}}: patentes, softwares, marcas. Um software de R$ 120k amortizado em 3 anos = R$ 40k/ano de custo. Impacta DRE mas não impacta caixa — por isso EBITDA (que exclui depreciação e amortização) é tão usado em valuation.',
              },
              {
                kind: 'pillar-grid',
                title: 'Matemática no dia a dia do gestor',
                pillars: [
                  { icon: '📊', title: 'Break-Even', description: 'Custos Fixos ÷ Margem de Contribuição = unidades mínimas. Saber esse número muda a {{estratégia}} inteira.' },
                  { icon: '📉', title: 'Depreciação', description: 'Custo do ativo distribuído no tempo. Não sai dinheiro mas reduz {{lucro contábil}} e valor do ativo.' },
                  { icon: '📈', title: 'Margem de Contribuição', description: 'Preço - Custo Variável. Quanto cada unidade {{contribui}} para pagar fixos. A métrica mais importante de precificação.' },
                  { icon: '🎯', title: 'Alavancagem Operacional', description: 'Quanto o lucro cresce para cada % de aumento em vendas. Custos fixos altos = alta alavancagem = alto {{risco}} e alto retorno.' },
                ],
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada conceito de custo tem impacto diferente. Classifique.',
              compare: {
                columnHeaders: ['Custo Fixo', 'Custo Variável', 'Depreciação'],
                rows: [
                  { label: 'Muda com volume?', values: ['Não', 'Sim', 'Não'] },
                  { label: 'Sai dinheiro?', values: ['Sim', 'Sim', 'Não (contábil)'] },
                ],
              },
              drag: {
                instruction: 'Fixo, Variável ou Depreciação?',
                zones: [
                  { id: 'fix', label: 'Fixo' },
                  { id: 'var', label: 'Variável' },
                  { id: 'dep', label: 'Depreciação' },
                ],
                items: [
                  { id: 'alug', label: 'Aluguel do escritório', correctZone: 'fix', correctFeedback: 'Certo. Não muda com volume = fixo.', wrongFeedback: 'Aluguel é igual todo mês = fixo.' },
                  { id: 'mat', label: 'Matéria-prima por unidade', correctZone: 'var', correctFeedback: 'Certo. Cresce com produção = variável.', wrongFeedback: 'Mais unidades = mais matéria = variável.' },
                  { id: 'maq', label: 'Desgaste da máquina ao longo de 10 anos', correctZone: 'dep', correctFeedback: 'Certo. Custo contábil distribuído = depreciação.', wrongFeedback: 'Desgaste no tempo = depreciação.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Break-even é o número que todo gestor deve saber de cor. Depreciação é o custo que ninguém vê mas que afeta o {{lucro real}}. E a margem de contribuição define se vale a pena vender mais.',
              keyInsights: [
                'Restaurante que não sabe break-even opera no {{escuro}}. É o número #1.',
                'SaaS: custo marginal baixíssimo. Depois do break-even, escala = {{lucro brutal}}.',
                'Depreciação: não sai dinheiro do caixa mas reduz lucro. Por isso existe {{EBITDA}}.',
              ],
            },
          },
          {
            id: 'M4-1-s1',
            type: 'simulation',
            title: 'Otimização de Lucro — Encontre o Ponto Máximo',
            simulationId: 'profit-optimization',
            description: 'Ajuste preço e veja lucro mudar. Encontre o ponto onde derivada = 0.',
          },
          {
            id: 'M4-1-s2',
            type: 'simulation',
            title: 'Calculadora de Investimentos — VPL, TIR e Payback',
            simulationId: 'investment-calculator',
            description: 'Insira investimento e fluxos. Veja VPL, TIR e Payback calculados.',
          },
          {
            id: 'M4-1-s3',
            type: 'simulation',
            title: 'Simulador Break-Even — Encontre Seu Ponto de Equilíbrio',
            simulationId: 'breakeven-simulator',
            description: 'Insira custos fixos, preço e custo variável. Veja quantas unidades precisa vender.',
          },
        ],
      },

      {
        id: 'M4-2',
        title: 'Analise Estatistica',
        blocks: [
          {
            id: 'M4-2-cap1',
            type: 'chapter',
            number: 1,
            title: 'Fundamentos de Estatística',
            subtitle: 'Média, dispersão e probabilidade — a base de toda decisão por dados',
            opening: {
              leadText: 'Estatística é a ciência de tomar decisões sob {{incerteza}}. Todo dado de negócio — vendas, churn, NPS, conversão — é estatística. Quem não domina o básico toma decisões por achismo disfarçado de análise.',
            },
            body: [
              {
                kind: 'pillar-grid',
                title: 'Medidas de tendência central',
                pillars: [
                  { icon: '📊', title: 'Média', description: 'Soma ÷ quantidade. Útil mas {{sensível a outliers}}. Salário médio brasileiro parece alto porque poucos bilionários puxam pra cima.', metric: { value: 'Σx/n', label: 'fórmula' } },
                  { icon: '📈', title: 'Mediana', description: 'Valor do meio quando ordenado. {{Imune a outliers}}. Mediana salarial é muito mais representativa que média.', metric: { value: '50º percentil', label: 'metade acima, metade abaixo' } },
                  { icon: '🏆', title: 'Moda', description: 'Valor mais {{frequente}}. Útil em pesquisa de mercado: qual tamanho mais vendido? Qual preço mais escolhido?', metric: { value: 'Max freq', label: 'mais comum' } },
                ],
              },
              {
                kind: 'pillar-grid',
                title: 'Medidas de dispersão',
                pillars: [
                  { icon: '↔️', title: 'Amplitude', description: 'Maior - menor valor. Simples mas {{ignora}} a distribuição no meio. Útil como primeira olhada.' },
                  { icon: '📉', title: 'Desvio Padrão', description: 'Quanto os dados se afastam da média. Desvio padrão {{pequeno}} = dados concentrados. Grande = espalhados.', metric: { value: 'σ', label: 'símbolo' } },
                  { icon: '📐', title: 'Variância', description: 'Desvio padrão ao quadrado. Usada em {{fórmulas}} estatísticas. Na prática, use desvio padrão (mais intuitivo).' },
                  { icon: '📊', title: 'Coeficiente de Variação', description: 'Desvio padrão ÷ média × 100. Permite {{comparar}} dispersão entre datasets com unidades diferentes.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Probabilidade aplicada',
              },
              {
                kind: 'paragraph',
                text: 'Probabilidade quantifica incerteza. Em negócios: qual a probabilidade de o cliente comprar? De o projeto atrasar? De a receita superar R$ 1M? Sem probabilidade, previsão é chute. Com probabilidade, previsão tem {{intervalo de confiança}}.',
              },
              {
                kind: 'paragraph',
                text: 'Distribuição Normal (curva de Gauss): a maioria dos fenômenos de negócio segue esse padrão — valores concentrados no centro, poucos nos extremos. {{68%}} dos dados ficam a 1 desvio padrão da média. 95% a 2 desvios. 99.7% a 3 desvios. Se um resultado está a 3+ desvios da média, é estatisticamente anômalo.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada medida serve a um propósito diferente. Classifique.',
              compare: {
                columnHeaders: ['Média', 'Mediana', 'Desvio Padrão'],
                rows: [
                  { label: 'Mede', values: ['Centro (sensível)', 'Centro (robusto)', 'Dispersão'] },
                  { label: 'Usar quando', values: ['Dados simétricos', 'Outliers presentes', 'Comparar variação'] },
                ],
              },
              drag: {
                instruction: 'Qual medida usar?',
                zones: [
                  { id: 'med', label: 'Média' },
                  { id: 'mdn', label: 'Mediana' },
                  { id: 'dp', label: 'Desvio Padrão' },
                ],
                items: [
                  { id: 'sal', label: 'Salário típico de uma empresa (CEO ganha 100x)', correctZone: 'mdn', correctFeedback: 'Certo. Outlier (CEO) distorce média. Mediana é robusta.', wrongFeedback: 'Com outlier grande, use mediana.' },
                  { id: 'nota', label: 'Nota média da turma numa prova', correctZone: 'med', correctFeedback: 'Certo. Sem outliers extremos, média funciona.', wrongFeedback: 'Dados simétricos = média.' },
                  { id: 'qual', label: 'Consistência de qualidade entre fábricas', correctZone: 'dp', correctFeedback: 'Certo. Dispersão mostra consistência.', wrongFeedback: 'Variação = desvio padrão.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Média mente quando tem outlier — use {{mediana}}. Desvio padrão mede consistência. Distribuição normal: 95% dos dados estão a 2 desvios da média. Fora disso, é {{anomalia}}.',
              keyInsights: [
                'Mediana salarial é mais honesta que média — poucos bilionários {{distorcem}} a média.',
                'Desvio padrão pequeno = dados concentrados = processo {{consistente}}.',
                'Distribuição Normal: {{68-95-99.7%}} a 1-2-3 desvios padrão. Regra de ouro da estatística.',
              ],
              nextChapterHint: 'Capítulo 2 · Regressão e Testes',
              nextChapterBlurb: 'Previsão, correlação, teste A/B e como saber se um resultado é real.',
            },
          },
          {
            id: 'M4-2-cap2',
            type: 'chapter',
            number: 2,
            title: 'Regressão, Hipóteses e Teste A/B',
            subtitle: 'Prever, testar e provar — a estatística que separa dado de achismo',
            opening: {
              leadText: 'Regressão prevê o futuro baseada no passado. Testes de hipóteses provam se um resultado é real ou acaso. Teste A/B é o método científico do marketing. Juntos, transformam {{dados em decisões}} defensáveis.',
            },
            body: [
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Regressão Linear',
                    period: 'Previsão',
                    text: 'Encontra a relação entre variáveis: "quanto mais invisto em marketing, mais vendo?" A reta de regressão prevê Y a partir de X. O {{R²}} mede quanto da variação Y é explicada por X (0 a 1).',
                    caseStudy: {
                      company: 'E-commerce',
                      year: 2024,
                      story: 'Regressão: investimento em Google Ads × vendas. R² = {{0.82}} — 82% das vendas são explicadas pelo investimento em ads. Os outros 18% são sazonalidade, orgânico, marca.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'R² = 0.82', label: '82% da variação explicada' },
                        { value: 'Y = aX + b', label: 'Equação da reta' },
                        { value: '18%', label: 'Outros fatores' },
                      ],
                      insight: 'R² alto não prova {{causalidade}} — prova correlação. Chuva e vendas de guarda-chuva correlacionam, mas chuva causa vendas (não o contrário).',
                    },
                  },
                  {
                    index: 2,
                    title: 'Teste de Hipóteses',
                    period: 'Prova estatística',
                    text: 'Pergunta: "o resultado é real ou pode ser acaso?" Hipótese nula (H0): não há efeito. Hipótese alternativa (H1): há efeito. Se p-valor < 0.05, rejeitamos H0 — resultado é {{estatisticamente significativo}}.',
                    caseStudy: {
                      company: 'Farmacêutica',
                      year: 2024,
                      story: 'Novo remédio reduz colesterol em {{15%}} vs placebo. p-valor = 0.003. Como p < 0.05, a diferença é real — não acaso. Se p-valor fosse 0.12, a diferença poderia ser coincidência.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'p < 0.05', label: 'Significativo' },
                        { value: '0.003', label: 'p-valor do estudo' },
                        { value: '95%', label: 'Nível de confiança' },
                      ],
                      insight: 'p-valor NÃO mede o tamanho do efeito — mede a probabilidade de o resultado ser {{acaso}}. Efeito pequeno pode ser significativo com amostra grande.',
                    },
                  },
                  {
                    index: 3,
                    title: 'Teste A/B',
                    period: 'Método científico do marketing',
                    text: 'Duas versões (A e B), mesmas condições, público aleatório. Mede qual performa melhor com {{significância estatística}}. É o padrão ouro de decisão em marketing digital.',
                    caseStudy: {
                      company: 'Booking.com',
                      year: 2023,
                      story: 'Roda mais de {{1.000 testes A/B simultâneos}}. Cada botão, cor, texto, posição é testado. Resultado: conversão 25% maior que concorrentes que decidem por opinião.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '1.000+', label: 'Testes simultâneos (Booking)' },
                        { value: '+25%', label: 'Conversão vs concorrentes' },
                        { value: '95%', label: 'Confiança mínima' },
                      ],
                      insight: 'Teste A/B resolve o debate "eu acho que X é melhor" com dados. Opinião do CEO ≠ {{dado}}.',
                    },
                  },
                ],
              },
              {
                kind: 'paragraph',
                text: 'Correlação ≠ Causalidade. Regressão mostra associação, não causa. Para provar causa: {{experimento controlado}} (teste A/B) ou análise contrafactual. Sem isso, é inferência — não prova.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada ferramenta estatística responde uma pergunta. Classifique.',
              compare: {
                columnHeaders: ['Regressão', 'Teste Hipótese', 'Teste A/B'],
                rows: [
                  { label: 'Pergunta', values: ['Qual a relação?', 'É real ou acaso?', 'A ou B é melhor?'] },
                  { label: 'Output', values: ['Equação + R²', 'p-valor', 'Vencedor + confiança'] },
                ],
              },
              drag: {
                instruction: 'Qual ferramenta usar?',
                zones: [
                  { id: 'reg', label: 'Regressão' },
                  { id: 'hip', label: 'Teste Hipótese' },
                  { id: 'ab', label: 'Teste A/B' },
                ],
                items: [
                  { id: 'prev', label: '"Se investir R$ 50k em ads, quanto vendo?"', correctZone: 'reg', correctFeedback: 'Certo. Prever Y a partir de X = regressão.', wrongFeedback: 'Previsão = regressão.' },
                  { id: 'real', label: '"A diferença de 5% é real ou acaso?"', correctZone: 'hip', correctFeedback: 'Certo. Real vs acaso = teste de hipótese.', wrongFeedback: 'Significância = teste de hipótese.' },
                  { id: 'btn', label: '"Botão verde ou azul converte mais?"', correctZone: 'ab', correctFeedback: 'Certo. Comparar versões = teste A/B.', wrongFeedback: 'Versão A vs B = teste A/B.' },
                ],
              },
            },
            synthesis: {
              closingText: 'Regressão {{prevê}}. Teste de hipótese {{prova}}. Teste A/B {{compara}}. Sem essas 3 ferramentas, decisão por dados é ilusão.',
              keyInsights: [
                'R² = quanto da variação é explicada. R² de 0.82 = {{82%}} explicado.',
                'p < 0.05 = resultado significativo. Mas p-valor não mede tamanho do {{efeito}}.',
                'Booking.com: 1.000+ testes A/B simultâneos. Opinião do CEO ≠ {{dado}}.',
              ],
              nextChapterHint: 'Capítulo 3 · KPIs e Data Storytelling',
              nextChapterBlurb: 'As métricas que o mercado mede, análise de cohort e como transformar números em decisões.',
            },
          },
          {
            id: 'M4-2-cap3',
            type: 'chapter',
            number: 3,
            title: 'KPIs, Cohort e Data Storytelling',
            subtitle: 'As métricas que importam e como transformar números em narrativa',
            opening: {
              leadText: 'KPIs (Key Performance Indicators) são as métricas que determinam se o negócio está {{saudável}}. Mas KPI sem interpretação é número morto. Data storytelling transforma dados em decisões — e cohort separa amadores de profissionais.',
            },
            body: [
              {
                kind: 'pillar-grid',
                title: 'KPIs essenciais por tipo de negócio',
                pillars: [
                  { icon: '🛒', title: 'E-commerce', description: 'CAC (Custo Aquisição Cliente), LTV (Lifetime Value), Taxa de Conversão, {{Ticket Médio}}, Churn.', metric: { value: 'LTV/CAC > 3', label: 'saudável' } },
                  { icon: '📱', title: 'SaaS', description: 'MRR (Receita Recorrente), Churn Rate, NRR (Net Revenue Retention), {{CAC Payback}}, NPS.', metric: { value: 'NRR > 100%', label: 'crescendo' } },
                  { icon: '🏪', title: 'Varejo Físico', description: 'Vendas/m², Ticket Médio, Giro de Estoque, {{Conversão}} (visitantes → compradores).', metric: { value: 'Giro > 12', label: 'estoque saudável' } },
                  { icon: '🏭', title: 'Indústria', description: 'OEE (Eficiência Equipamentos), Lead Time, Taxa de Defeito, {{Custo Unitário}}.', metric: { value: 'OEE > 85%', label: 'world-class' } },
                ],
              },
              {
                kind: 'heading',
                text: 'Análise de Cohort — a métrica que separa amadores de profissionais',
              },
              {
                kind: 'paragraph',
                text: 'Cohort agrupa usuários pelo momento em que chegaram e acompanha o comportamento ao longo do tempo. Em vez de "30% dos clientes cancelaram", cohort mostra: "clientes de janeiro cancelaram {{15%}} no mês 3, clientes de março cancelaram 25%." A diferença revela o que mudou entre janeiro e março — e onde agir.',
              },
              {
                kind: 'paragraph',
                text: 'Sem cohort, você vê média. Com cohort, vê {{tendência por grupo}}. É a diferença entre "o barco está afundando" e "há um furo no lado esquerdo que apareceu em março".',
              },
              {
                kind: 'heading',
                text: 'Data Storytelling — de número a decisão',
              },
              {
                kind: 'paragraph',
                text: 'Dados sem narrativa não geram ação. Data storytelling combina 3 elementos: {{Dados}} (o que aconteceu), {{Visual}} (gráfico que mostra o padrão) e {{Narrativa}} (o que significa e o que fazer). O erro mais comum: apresentar 30 gráficos sem dizer o que significam. O acerto: 1 gráfico com 1 insight e 1 recomendação.',
              },
              {
                kind: 'step-flow',
                title: 'Framework de Data Storytelling',
                steps: [
                  { number: 1, title: 'Contexto', description: 'O que o público precisa saber? Qual a {{pergunta}} que estamos respondendo?' },
                  { number: 2, title: 'Dado', description: 'Qual o número-chave? Não 30 métricas — {{1 ou 2}} que respondem a pergunta.' },
                  { number: 3, title: 'Visual', description: 'Qual gráfico mostra o padrão? Barra para comparar, linha para tendência, pizza {{nunca}} (quase sempre ruim).' },
                  { number: 4, title: 'Insight', description: 'O que o dado {{significa}}? "Churn subiu 5%" não é insight. "Churn subiu 5% porque o onboarding mudou em março" é.' },
                  { number: 5, title: 'Recomendação', description: 'O que {{fazer}} com isso? "Reverter onboarding ao modelo anterior e medir por 30 dias."' },
                ],
              },
              {
                kind: 'heading',
                text: 'Pesquisa de mercado',
              },
              {
                kind: 'paragraph',
                text: 'Pesquisa quantitativa responde "{{quanto}}?" (amostra grande, questionário). Qualitativa responde "{{por quê}}?" (amostra pequena, entrevista profunda). Vieses a evitar: pergunta indutora ("você não acha que X é bom?"), amostra enviesada (pesquisar só quem já é cliente), e viés de sobrevivência (analisar só empresas que deram certo).',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada métrica conta uma história diferente. Classifique por tipo de negócio.',
              compare: {
                columnHeaders: ['SaaS', 'E-commerce', 'Varejo Físico'],
                rows: [
                  { label: 'KPI #1', values: ['MRR', 'Conversão', 'Vendas/m²'] },
                  { label: 'Saúde', values: ['NRR > 100%', 'LTV/CAC > 3', 'Giro > 12'] },
                ],
              },
              drag: {
                instruction: 'Qual KPI para cada situação?',
                zones: [
                  { id: 'cac', label: 'CAC' },
                  { id: 'churn', label: 'Churn' },
                  { id: 'nps', label: 'NPS' },
                ],
                items: [
                  { id: 'custo', label: '"Quanto custa trazer 1 cliente novo?"', correctZone: 'cac', correctFeedback: 'Certo. Custo de aquisição = CAC.', wrongFeedback: 'Custo por cliente = CAC.' },
                  { id: 'saem', label: '"Quantos clientes cancelaram este mês?"', correctZone: 'churn', correctFeedback: 'Certo. Taxa de cancelamento = Churn.', wrongFeedback: 'Cancelamento = Churn.' },
                  { id: 'rec', label: '"O cliente recomendaria a empresa?"', correctZone: 'nps', correctFeedback: 'Certo. Recomendação = NPS.', wrongFeedback: 'Satisfação/recomendação = NPS.' },
                ],
              },
            },
            synthesis: {
              closingText: 'KPIs sem interpretação são números mortos. Cohort revela {{tendências}} que a média esconde. Data storytelling transforma dado em ação: contexto → dado → visual → insight → recomendação.',
              keyInsights: [
                'LTV/CAC > 3 = negócio saudável. Abaixo de 1 = cada cliente dá {{prejuízo}}.',
                'Cohort: não é "30% cancelaram". É "clientes de janeiro cancelaram 15%, março {{25%}}." A diferença é o insight.',
                'Data storytelling: 1 gráfico + 1 insight + 1 recomendação > 30 gráficos sem {{contexto}}.',
              ],
              nextChapterHint: 'Capítulo 4 · Análise Preditiva e Ferramentas',
              nextChapterBlurb: 'Machine learning para negócios e o kit de sobrevivência em Excel/Sheets.',
            },
          },
          {
            id: 'M4-2-cap4',
            type: 'chapter',
            number: 4,
            title: 'Análise Preditiva e Ferramentas',
            subtitle: 'Machine learning para negócios e Excel como kit de sobrevivência',
            opening: {
              leadText: 'Análise preditiva usa dados históricos para prever o futuro. {{Machine learning}} automatiza esse processo — encontra padrões que humanos não veem. Mas a ferramenta mais usada no mundo ainda é o Excel.',
            },
            body: [
              {
                kind: 'pillar-grid',
                title: 'Tipos de Machine Learning aplicado a negócios',
                pillars: [
                  { icon: '📈', title: 'Regressão', description: 'Prever um {{número}}: receita do próximo mês, preço de ação, demanda de produto. Usa dados históricos para projetar futuro.' },
                  { icon: '🏷️', title: 'Classificação', description: 'Categorizar: cliente vai {{cancelar}} ou não? E-mail é spam ou não? Lead é quente ou frio? Sim/Não baseado em padrões.' },
                  { icon: '👥', title: 'Clustering', description: 'Agrupar sem rótulo prévio: quais {{segmentos}} de clientes existem? Descobre grupos que não eram óbvios.' },
                  { icon: '🔮', title: 'Séries Temporais', description: 'Prever valores ao longo do {{tempo}}: vendas semanais, sazonalidade, tendência. Específico para dados cronológicos.' },
                ],
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'ML de Churn',
                    period: 'Classificação',
                    text: 'Modelo prevê quais clientes vão cancelar nos próximos 30 dias. Variáveis: frequência de uso, reclamações, tempo desde última compra, {{padrão de pagamento}}. Permite ação preventiva.',
                    caseStudy: {
                      company: 'Spotify',
                      year: 2023,
                      story: 'Modelo de churn identifica usuários em risco {{14 dias antes}} do cancelamento. Dispara playlist personalizada + oferta de desconto. Reduziu churn em 25%.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '14 dias', label: 'Antecedência da predição' },
                        { value: '-25%', label: 'Redução de churn' },
                        { value: 'Automático', label: 'Ação preventiva' },
                      ],
                      insight: 'ML de churn não substitui bom produto — {{complementa}}. Se o produto é ruim, prever cancelamento não adianta.',
                    },
                  },
                  {
                    index: 2,
                    title: 'ML de Recomendação',
                    period: 'Personalização',
                    text: 'Modelo sugere produtos/conteúdo baseado em comportamento: "quem comprou X também comprou Y." Amazon: {{35%}} das vendas vêm de recomendações algorítmicas.',
                    caseStudy: {
                      company: 'Netflix',
                      year: 2023,
                      story: 'O algoritmo de recomendação economiza {{US$ 1 bilhão/ano}} em retenção. Sem recomendação personalizada, usuários não encontram o que assistir e cancelam.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '$1B/ano', label: 'Economia Netflix' },
                        { value: '35%', label: 'Vendas Amazon por recomendação' },
                        { value: '80%', label: 'Conteúdo Netflix assistido via recomendação' },
                      ],
                      insight: 'Recomendação é o maior caso de ROI de ML no mundo. {{Personalização}} em escala = vantagem competitiva.',
                    },
                  },
                ],
              },
              {
                kind: 'heading',
                text: 'Excel/Sheets — o kit de sobrevivência',
              },
              {
                kind: 'paragraph',
                text: 'Apesar do hype de IA e ML, a ferramenta mais usada para análise de dados no mundo ainda é o {{Excel/Google Sheets}}. Dominar o básico resolve 80% dos problemas analíticos de uma PME.',
              },
              {
                kind: 'pillar-grid',
                title: 'Funções essenciais do Excel para gestores',
                pillars: [
                  { icon: '📊', title: 'PROCV / XLOOKUP', description: 'Cruzar dados entre tabelas. "Qual o faturamento do {{cliente X}}?" Busca em outra planilha e retorna valor.' },
                  { icon: '📈', title: 'Tabela Dinâmica', description: 'Resumir milhares de linhas em {{painel}} interativo. Arrastar campos, filtrar, agrupar. A ferramenta mais poderosa do Excel.' },
                  { icon: '🔢', title: 'SE / SOMASE / CONT.SE', description: 'Lógica condicional: "se vendas > meta, {{verde}}; senão, vermelho." Contar quantos clientes atendem critério.' },
                  { icon: '📉', title: 'Gráficos', description: 'Barra para comparar, linha para tendência, dispersão para correlação. {{Pizza nunca}} (quase sempre ruim).' },
                ],
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada tipo de ML resolve um tipo de problema. Classifique.',
              compare: {
                columnHeaders: ['Regressão', 'Classificação', 'Clustering'],
                rows: [
                  { label: 'Output', values: ['Número', 'Sim/Não', 'Grupos'] },
                  { label: 'Exemplo', values: ['Receita prevista', 'Vai cancelar?', 'Segmentos'] },
                ],
              },
              drag: {
                instruction: 'Qual tipo de ML?',
                zones: [
                  { id: 'reg', label: 'Regressão' },
                  { id: 'cls', label: 'Classificação' },
                  { id: 'clu', label: 'Clustering' },
                ],
                items: [
                  { id: 'rec', label: '"Quanto vamos faturar no próximo trimestre?"', correctZone: 'reg', correctFeedback: 'Certo. Prever número = regressão.', wrongFeedback: 'Prever valor = regressão.' },
                  { id: 'spam', label: '"Este e-mail é spam?"', correctZone: 'cls', correctFeedback: 'Certo. Sim/Não = classificação.', wrongFeedback: 'Categorizar = classificação.' },
                  { id: 'seg', label: '"Quais grupos de clientes temos?"', correctZone: 'clu', correctFeedback: 'Certo. Descobrir grupos = clustering.', wrongFeedback: 'Agrupar sem rótulo = clustering.' },
                ],
              },
            },
            synthesis: {
              closingText: 'ML não é mágica — é {{estatística automatizada}}. Regressão prevê números, classificação categoriza, clustering agrupa. E o Excel resolve 80% dos problemas analíticos de uma PME.',
              keyInsights: [
                'Spotify: ML de churn prevê cancelamento {{14 dias}} antes. Ação preventiva reduz 25%.',
                'Netflix: recomendação economiza {{$1B/ano}} em retenção. 80% do conteúdo assistido via algoritmo.',
                'Excel: PROCV + Tabela Dinâmica + SE resolvem {{80%}} dos problemas analíticos de PME.',
              ],
            },
          },
          {
            id: 'M4-2-s1',
            type: 'simulation',
            title: 'Análise de Dados — Interprete os Números',
            simulationId: 'data-interpretation',
            description: 'Dados reais de empresas. Calcule, interprete e decida.',
          },
          {
            id: 'M4-2-s2',
            type: 'simulation',
            title: 'Dashboard de KPIs — Interprete o Painel de uma Startup',
            simulationId: 'kpi-dashboard',
            description: 'Dashboard real com KPIs. Identifique problemas e recomende ações.',
          },
          {
            id: 'M4-2-s3',
            type: 'simulation',
            title: 'Análise de Negócio — Do Dado à Decisão',
            simulationId: 'data-to-decision',
            description: 'Receba dados brutos e construa a narrativa até a recomendação.',
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
          // ── CHAPTER 1 ──────────────────────────────────────────────
          {
            id: 'M5-0-cap1',
            type: 'chapter',
            number: 1,
            title: 'Escrever com Clareza',
            subtitle: 'Da clareza de pensamento à clareza de texto — como gestores comunicam para quem decide',
            opening: {
              leadText: 'Escrever bem não é talento — é método. No mundo corporativo, quem escreve com clareza pensa com clareza. {{73%}} do tempo de executivos é gasto lendo e escrevendo (McKinsey). Propostas mal escritas perdem investimento não por falta de mérito — por falta de clareza.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'Há uma distinção fundamental entre escrita acadêmica e escrita corporativa: a acadêmica preza rigor metodológico, referências e linguagem formal; a corporativa preza clareza, objetividade e ação. O que têm em comum é mais importante do que a diferença — {{estrutura lógica}}, evidências e argumentação fundamentada.',
              },
              {
                kind: 'pillar-grid',
                title: 'Os 3 princípios universais da boa escrita',
                pillars: [
                  { icon: '🔍', title: 'Clareza', description: 'Se pode ser mal interpretado, {{será}} mal interpretado. Reescreva até não restar ambiguidade.' },
                  { icon: '✂️', title: 'Concisão', description: 'Se pode ser dito em menos palavras, deve ser. Cada palavra extra {{custa}} atenção do leitor.' },
                  { icon: '🏗️', title: 'Estrutura', description: 'Se o leitor precisa reler para entender a lógica, {{reorganize}} — o problema é seu, não dele.' },
                ],
              },
              {
                kind: 'paragraph',
                text: 'CEOs e diretores leem centenas de documentos por semana. Você tem {{30 segundos}} para capturar atenção e 2 minutos para convencer. A Pirâmide de Minto (Barbara Minto, McKinsey) é a estrutura mais poderosa para isso: começa pela conclusão, não pelo contexto.',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Nível 1 — Texto Confuso',
                    period: 'O jeito errado',
                    text: '"Analisamos o mercado nos últimos 6 meses. Observamos que a demanda está crescendo. Nossos concorrentes estão investindo. A oportunidade é grande. {{Por isso, recomendamos expandir.}}" — Só chegou na recomendação na última frase. O CEO já parou de ler na segunda.',
                    caseStudy: {
                      company: 'Erro comum em relatórios',
                      year: 2024,
                      story: 'Emails confusos geram retrabalho — cada email mal escrito custa em média {{25 minutos}} de follow-up. Relatórios sem estrutura não são lidos: se o CEO não entende na primeira página, ele para de ler.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '25 min', label: 'Follow-up por email mal escrito' },
                        { value: '30 seg', label: 'Janela de atenção do executivo' },
                        { value: '73%', label: 'Tempo de exec gasto lendo/escrevendo' },
                      ],
                      insight: 'O paradoxo: quanto mais longo o texto, {{menos}} ele comunica. Prolixidade não é profundidade — é falta de disciplina para cortar.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Nível 2 — Texto Estruturado',
                    period: 'O jeito melhorado',
                    text: 'Contexto → Problema → Análise → Recomendação. A estrutura IMRAD (Introdução → Metodologia → Resultados → Análise → Conclusão) garante que qualquer leitor encontre o que precisa. Funciona para {{relatórios e artigos}} — mas ainda não é o padrão executivo ideal.',
                    caseStudy: {
                      company: 'Escrita acadêmica e técnica',
                      year: 2024,
                      story: 'A estrutura IMRAD é universal em artigos científicos e white papers. Permite {{replicabilidade}}: outro leitor entende o método e pode validar os resultados. É o padrão da escrita técnica séria.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '5 seções', label: 'Introdução, Método, Resultados, Análise, Conclusão' },
                        { value: '80%', label: 'Leitores que leem só o abstract e a conclusão' },
                        { value: '60%', label: 'Economia de tempo lendo fora da ordem' },
                      ],
                      insight: 'Para leitura eficiente de artigos: leia Abstract → Conclusão → Figuras → Metodologia → Introdução. {{Nunca}} na ordem linear.',
                    },
                  },
                  {
                    index: 3,
                    title: 'Nível 3 — Pirâmide de Minto',
                    period: 'O padrão McKinsey',
                    text: '"Recomendamos investir {{R$ 2M}} no Nordeste até Q3 — retorno projetado de {{R$ 7,5M}} em 3 anos. Três razões: (1) mercado cresceu 22%/ano — 3x a média nacional; (2) zero concorrente premium na região — janela de 18 meses; (3) piloto em Recife validou o modelo em 6 meses." Conclusão na primeira frase. Pronto.',
                    caseStudy: {
                      company: 'Barbara Minto / McKinsey',
                      year: 1973,
                      story: 'Barbara Minto desenvolveu a estrutura enquanto era consultora da McKinsey. Hoje é padrão em {{todas as grandes consultorias}} do mundo. A regra: o leitor deve entender sua posição antes de ler qualquer evidência.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '1ª frase', label: 'Onde a conclusão deve estar' },
                        { value: '3', label: 'Argumentos de suporte (máximo)' },
                        { value: '5 seg', label: 'CEO entende a proposta com Minto' },
                      ],
                      insight: 'A Pirâmide de Minto inverte a lógica aristotélica: você não {{constrói}} o argumento para chegar à conclusão. Você parte da conclusão e a sustenta.',
                    },
                  },
                ],
              },
              {
                kind: 'paragraph',
                text: 'Formato errado = mensagem ignorada. Um email de 3 páginas não é lido. Um memo sobre assunto complexo não convence. Escolha o formato que respeita o tempo do leitor: {{memo}} para decisões rápidas (1 página), executive summary para resumir relatório longo (2-3 páginas), deck para pitch (10-15 slides), email estratégico para ação imediata (5 linhas).',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Veja como os 3 níveis de escrita diferem em clareza, estrutura e impacto antes de classificar. Depois, identifique qual nível cada texto abaixo representa.',
              compare: {
                columnHeaders: ['Nível 1 · Confuso', 'Nível 2 · Estruturado', 'Nível 3 · Minto'],
                rows: [
                  {
                    label: 'Abertura',
                    values: ['Contexto longo', 'Introdução clara', 'Conclusão direta'],
                    viz: 'icons',
                    icons: ['◯', '◑', '●'],
                  },
                  {
                    label: 'Recomendação',
                    values: ['No final', 'No meio', 'Na 1ª frase'],
                    viz: 'icons',
                    icons: ['▦', '⊞', '◈'],
                  },
                  {
                    label: 'Tempo do leitor',
                    values: ['Alto', 'Médio', 'Mínimo'],
                    viz: 'bars',
                    intensities: [0.15, 0.55, 1.0],
                  },
                  {
                    label: 'Taxa de leitura',
                    values: ['Baixa', 'Média', 'Alta'],
                    viz: 'bars',
                    intensities: [0.1, 0.5, 1.0],
                  },
                ],
              },
              drag: {
                instruction: 'Toque no texto, depois toque no nível que ele representa:',
                zones: [
                  { id: 'nivel1', label: 'Nível 1 · Confuso' },
                  { id: 'nivel2', label: 'Nível 2 · Estruturado' },
                  { id: 'nivel3', label: 'Nível 3 · Minto' },
                ],
                items: [
                  {
                    id: 'texto-confuso',
                    label: 'Email de aprovação',
                    sublabel: '"Sabe, analisei bastante. O mercado está aquecido. Temos concorrentes investindo. Acho que deveríamos considerar expandir para o Nordeste talvez."',
                    correctZone: 'nivel1',
                    correctFeedback: 'Correto. Nenhuma tese clara, linguagem vaga ("acho", "talvez", "bastante"), conclusão enterrada no final. Quem recebe esse email não sabe o que fazer com ele.',
                    wrongFeedback: 'Repense. Há linguagem vaga ("acho", "talvez"), nenhuma conclusão clara, nenhum dado. É o padrão mais confuso: o leitor não sabe o que você quer.',
                  },
                  {
                    id: 'texto-imrad',
                    label: 'Relatório de pesquisa',
                    sublabel: '"Introdução: o problema de caixa. Metodologia: análise de 24 meses. Resultados: 62% dos problemas vêm de inadimplência. Conclusão: recomendam-se 3 ações."',
                    correctZone: 'nivel2',
                    correctFeedback: 'Correto. Estrutura IMRAD completa e lógica — o leitor sabe o que esperar em cada seção. Ótimo para relatório técnico, mas a conclusão ainda vem no final.',
                    wrongFeedback: 'Repense. O texto tem estrutura clara (Introdução → Metodologia → Resultados → Conclusão), mas a recomendação aparece só no final. Isso é Nível 2 — IMRAD — não Minto.',
                  },
                  {
                    id: 'texto-minto',
                    label: 'Memo executivo',
                    sublabel: '"Recomendo aprovar R$ 500K para o projeto X até sexta. Três razões: (1) ROI de 340% em 18 meses; (2) janela de mercado fecha em 60 dias; (3) time está disponível agora."',
                    correctZone: 'nivel3',
                    correctFeedback: 'Correto. Pirâmide de Minto perfeita: conclusão na primeira frase, 3 argumentos numerados, dados específicos. O leitor entende tudo em 10 segundos.',
                    wrongFeedback: 'Repense. Veja a estrutura: conclusão + pedido na primeira frase, 3 argumentos numerados com dados concretos. Isso é exatamente a Pirâmide de Minto — Nível 3.',
                  },
                  {
                    id: 'texto-jargao',
                    label: 'Relatório com jargão',
                    sublabel: '"Conforme análise sinérgica dos stakeholders-chave, identificamos oportunidades disruptivas no ecossistema que podem alavancar nossa proposta de valor..."',
                    correctZone: 'nivel1',
                    correctFeedback: 'Correto. Excesso de jargão sem substância é Nível 1: o leitor não consegue extrair nenhuma informação acionável. Palavras grandes não substituem ideias claras.',
                    wrongFeedback: 'Repense. Jargão sem dados, sem tese, sem ação concreta — é o padrão confuso. "Oportunidades disruptivas" não diz nada. Isso é Nível 1.',
                  },
                  {
                    id: 'texto-board',
                    label: 'Apresentação de board',
                    sublabel: '"Objetivo: aprovar orçamento de R$ 2M. Contexto: queda de 3pp de market share. Descobertas: 62% da perda vem do segmento jovem. Recomendação: 3 ações com retorno projetado de R$ 7M."',
                    correctZone: 'nivel2',
                    correctFeedback: 'Correto. Estrutura clara com objetivo, contexto, dados e recomendação — mas a recomendação vem depois do contexto e dos dados, não antes. Isso é Nível 2.',
                    wrongFeedback: 'Repense. O texto tem boa estrutura (objetivo → contexto → dados → recomendação), mas a recomendação ainda vem no final. Para Minto, ela deveria ser a primeira coisa.',
                  },
                ],
              },
            },
            synthesis: {
              closingText: 'A escrita não é sobre mostrar o quanto você sabe — é sobre {{fazer o leitor entender}} o que você quer que ele faça. A Pirâmide de Minto força essa clareza: se você não consegue escrever sua conclusão em uma frase, você ainda não sabe o que quer.',
              keyInsights: [
                'Clareza de texto é clareza de pensamento: quem não consegue escrever a tese em uma frase não sabe o que está argumentando.',
                'A Pirâmide de Minto inverte a lógica: {{conclusão primeiro}}, argumentos depois. Isso respeita o tempo do leitor.',
                'Formato importa: memo (1 página), executive summary (2-3 páginas), deck (10-15 slides), email (5 linhas) — cada situação tem seu {{veículo}}.',
              ],
              nextChapterHint: 'Capítulo 2 · Argumentar com Rigor',
              nextChapterBlurb: 'Da opinião ao argumento sólido — o Modelo Toulmin e os 6 elementos que tornam qualquer tese defensável.',
            },
          },

          // ── CHAPTER 2 ──────────────────────────────────────────────
          {
            id: 'M5-0-cap2',
            type: 'chapter',
            number: 2,
            title: 'Argumentar com Rigor',
            subtitle: 'Do Modelo Toulmin aos 10 erros que destroem credibilidade — como construir teses que convencem',
            opening: {
              leadText: 'Todo texto persuasivo segue uma estrutura argumentativa. Sem estrutura, é {{opinião}}. Com estrutura e evidências, é {{argumento}}. A diferença entre os dois não é o conteúdo — é a arquitetura.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'O filósofo Stephen Toulmin (1958) mapeou a anatomia do argumento robusto. O Modelo Toulmin não é só teoria acadêmica — é a estrutura por trás de todo business case, proposta de investimento e relatório estratégico que realmente convence.',
              },
              {
                kind: 'pillar-grid',
                title: 'Os 6 elementos do argumento (Modelo Toulmin)',
                pillars: [
                  { icon: '🎯', title: 'Claim — Tese', description: '"A empresa deve investir em energia renovável." Se não cabe em {{uma frase}}, você não sabe o que está defendendo.' },
                  { icon: '📊', title: 'Data — Dados', description: '"Custo 18% menor em 5 anos (McKinsey, 2024)." Dados > opinião. {{Números}} > adjetivos. Fontes > "todo mundo sabe".' },
                  { icon: '🔗', title: 'Warrant — Justificativa', description: 'A lógica que {{conecta}} os dados à tese. Não assuma que o leitor vai fazer esse trabalho por você.' },
                  { icon: '📐', title: 'Qualifier — Grau de certeza', description: '"Na maioria dos cenários..." Evite "sempre" e "nunca". {{Qualificar}} mostra maturidade intelectual.' },
                  { icon: '⚖️', title: 'Rebuttal — Contra-arg.', description: 'Antecipar objeções {{fortalece}} o argumento. Ignorá-las enfraquece. "Embora o investimento seja alto, o payback é de 3,2 anos."' },
                  { icon: '🔩', title: 'Backing — Suporte', description: 'Evidência adicional que reforça a justificativa. "No setor têxtil, {{3 dos 5}} líderes globais já operam com 70%+ renovável."' },
                ],
              },
              {
                kind: 'paragraph',
                text: 'A regra de ouro: {{se você não consegue escrever sua tese em uma frase, você não sabe o que está argumentando}}. Muitos relatórios corporativos falham não por falta de dados, mas por falta de tese — são coleções de informações sem posição.',
              },
              {
                kind: 'heading',
                text: 'Os 10 erros que destroem credibilidade',
              },
              {
                kind: 'step-flow',
                title: '',
                steps: [
                  { number: 1, title: 'Falta de tese clara', description: 'O leitor chega ao final sem saber o que você defende. Correção: primeira frase = sua tese. Sempre.' },
                  { number: 2, title: 'Parágrafos sem tópico frasal', description: 'Parágrafo que começa com contexto, não com a ideia. Correção: 1ª frase de cada parágrafo = ideia principal.' },
                  { number: 3, title: 'Citações sem análise', description: '"Conforme Drucker (1985)..." e segue em frente. Correção: Cite → Explique → Conecte com seu argumento.' },
                  { number: 4, title: 'Linguagem vaga', description: '"Várias empresas", "muitos estudos", "acredita-se que". Correção: especifique — "42 das 100 maiores empresas".' },
                  { number: 5, title: 'Plágio acidental', description: 'Parafrasear sem citar a fonte. Correção: toda ideia que não é sua precisa de referência. Sempre.' },
                ],
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Compare os 3 níveis de argumento — da opinião pura ao argumento Toulmin completo. Depois, classifique os 5 exemplos abaixo no nível correto.',
              compare: {
                columnHeaders: ['Nível 1 · Opinião', 'Nível 2 · Argumento básico', 'Nível 3 · Toulmin'],
                rows: [
                  {
                    label: 'Tese',
                    values: ['Vaga ou ausente', 'Presente, imprecisa', 'Clara e falsificável'],
                    viz: 'icons',
                    icons: ['◯', '◑', '●'],
                  },
                  {
                    label: 'Evidências',
                    values: ['Nenhuma', 'Alguma', 'Dados + fonte'],
                    viz: 'icons',
                    icons: ['▦', '⊞', '◈'],
                  },
                  {
                    label: 'Credibilidade',
                    values: ['Baixa', 'Média', 'Alta'],
                    viz: 'bars',
                    intensities: [0.1, 0.5, 1.0],
                  },
                  {
                    label: 'Contra-arg.',
                    values: ['Nenhum', 'Raramente', 'Sempre presente'],
                    viz: 'bars',
                    intensities: [0.05, 0.45, 1.0],
                  },
                ],
              },
              drag: {
                instruction: 'Toque no argumento, depois toque no nível que ele representa:',
                zones: [
                  { id: 'opiniao', label: 'Nível 1 · Opinião' },
                  { id: 'basico', label: 'Nível 2 · Básico' },
                  { id: 'toulmin', label: 'Nível 3 · Toulmin' },
                ],
                items: [
                  {
                    id: 'arg-opiniao',
                    label: 'Proposta de expansão',
                    sublabel: '"Devemos expandir para o Sul porque acho que tem muito potencial e o mercado está aquecido lá."',
                    correctZone: 'opiniao',
                    correctFeedback: 'Correto. "Acho que tem potencial" não é evidência — é impressão. Nenhum dado, nenhuma fonte, nenhuma tese falsificável. Isso é opinião pura.',
                    wrongFeedback: 'Repense. "Acho que tem potencial" não é evidência. Não há dado, não há fonte, a tese é vaga. Esse é o Nível 1 — opinião sem estrutura.',
                  },
                  {
                    id: 'arg-basico',
                    label: 'Pedido de orçamento',
                    sublabel: '"Precisamos de R$ 200K para marketing. O mercado cresceu bastante e nossos concorrentes estão investindo mais que nós."',
                    correctZone: 'basico',
                    correctFeedback: 'Correto. Há uma tese (precisamos de R$ 200K) e uma justificativa, mas os dados são vagos ("bastante") e não há fonte, qualificador nem contra-argumento. É Nível 2.',
                    wrongFeedback: 'Repense. Tem uma tese e uma justificativa, mas os dados são vagos ("bastante", sem número). Não há fonte, não há contra-argumento. Isso é Nível 2 — argumento básico.',
                  },
                  {
                    id: 'arg-toulmin',
                    label: 'Business case completo',
                    sublabel: '"Recomendo expandir para o Nordeste (tese). Mercado cresceu 22%/ano (dado, ABF 2024). First-mover advantage de 18 meses (justificativa). Embora logística seja desafio, piloto em Recife validou o modelo (contra-arg.)"',
                    correctZone: 'toulmin',
                    correctFeedback: 'Correto. Tese clara, dados com fonte, justificativa explícita, contra-argumento antecipado. Esse é o argumento Toulmin completo — o padrão de excelência.',
                    wrongFeedback: 'Repense. Veja os componentes: tese na primeira frase, dado com fonte (ABF 2024), justificativa conectando dado à tese, e contra-argumento reconhecido e respondido. Isso é Toulmin completo.',
                  },
                  {
                    id: 'arg-jargao',
                    label: 'Apresentação de resultados',
                    sublabel: '"Nossa performance foi subótima em virtude de fatores exógenos que impactaram negativamente o ecossistema de negócios no qual estamos inseridos."',
                    correctZone: 'opiniao',
                    correctFeedback: 'Correto. Jargão sem substância é o pior tipo de Nível 1: parece sofisticado mas não diz nada. "Fatores exógenos" significa "coisas de fora" — quais? "Subótima" — em quanto? Zero dado, zero tese.',
                    wrongFeedback: 'Repense. Palavras grandes não são argumentos. "Fatores exógenos que impactaram negativamente" não diz nada — quais fatores? Quanto? Quando? Isso é Nível 1 com fantasia de Nível 3.',
                  },
                  {
                    id: 'arg-parcial',
                    label: 'Proposta de produto',
                    sublabel: '"Devemos lançar o app mobile. Pesquisa mostra que 68% dos clientes preferem mobile. Custo de desenvolvimento é R$ 150K."',
                    correctZone: 'basico',
                    correctFeedback: 'Correto. Há dado real (68%) e número concreto (R$ 150K), mas falta a justificativa conectando dado à tese, falta qualificador e falta contra-argumento. Bom começo, mas incompleto — Nível 2.',
                    wrongFeedback: 'Repense. Tem dado bom (68%) e custo concreto, mas falta a lógica que conecta os dados à recomendação, falta qualificador e nenhum contra-argumento é considerado. Isso é Nível 2.',
                  },
                ],
              },
            },
            synthesis: {
              closingText: 'Um argumento sem dados é opinião. Um argumento com dados mas sem justificativa é correlação. Um argumento Toulmin completo — com tese, dados, justificativa, qualificador e contra-argumento — é a {{base da influência}} em qualquer organização.',
              keyInsights: [
                'A tese em uma frase é o teste mais simples: se não consegue escrever, não sabe o que está argumentando.',
                'Antecipar o contra-argumento não enfraquece sua posição — ela {{fortalece}}, porque mostra que você considerou o outro lado.',
                'Dados vagos são piores que nenhum dado: "bastante", "muito", "sempre" destroem credibilidade.',
              ],
              nextChapterHint: 'Capítulo 3 · Ler e Pesquisar',
              nextChapterBlurb: 'Como ler criticamente, escolher o método de pesquisa certo e construir uma revisão bibliográfica que sustenta qualquer argumento.',
            },
          },

          // ── CHAPTER 3 ──────────────────────────────────────────────
          {
            id: 'M5-0-cap3',
            type: 'chapter',
            number: 3,
            title: 'Ler e Pesquisar',
            subtitle: 'Leitura crítica, métodos de pesquisa e revisão bibliográfica — as fundações do conhecimento aplicado',
            opening: {
              leadText: 'Ler criticamente não é ler mais — é ler {{melhor}}. A maioria das pessoas lê para confirmar o que já pensa (viés de confirmação). Leitura crítica é ler para questionar, para encontrar o que o texto não diz, para separar evidência de opinião.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'O Framework de Leitura Crítica se resume em {{5 perguntas}} que devem ser feitas a qualquer texto: (1) Qual é a tese central? (2) Quais são as evidências? (3) Quais são as premissas implícitas? (4) Existem contra-argumentos? (5) Qual a relevância para minha decisão? Se não mudou o que você pensa ou faz, por que você estava lendo?',
              },
              {
                kind: 'pillar-grid',
                title: 'Técnica SQ3R — leitura eficiente',
                pillars: [
                  { icon: '🔭', title: 'Survey', description: 'Varredura: leia título, subtítulos, resumo e conclusão em {{3 minutos}}. Antes de qualquer leitura profunda.' },
                  { icon: '❓', title: 'Question', description: 'O que espero aprender? Quais minhas dúvidas? {{Formule}} perguntas antes de ler.' },
                  { icon: '📖', title: 'Read', description: 'Leia {{buscando respostas}} para suas perguntas. Não leia passivamente.' },
                  { icon: '🗣️', title: 'Recite', description: 'Feche o texto e {{resuma em voz alta}} o que entendeu. Se não consegue, não entendeu.' },
                  { icon: '🔄', title: 'Review', description: 'Releia apenas os trechos que não ficaram claros. {{Não releia}} o que você já domina.' },
                ],
              },
              {
                kind: 'paragraph',
                text: 'Cada pergunta de pesquisa exige um método diferente. Usar o método errado invalida todo o estudo — não importa quão bem executado. A escolha do método começa pela {{natureza da pergunta}}.',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Pesquisa Exploratória',
                    period: '"O que está acontecendo?"',
                    text: 'Objetivo: entender fenômeno pouco conhecido e gerar hipóteses. Métodos: entrevistas em profundidade, grupos focais, observação. Resultado: {{hipóteses}}, não conclusões. Use no início — quando nem sabe as perguntas certas.',
                    caseStudy: {
                      company: 'Nubank — pesquisa inicial',
                      year: 2013,
                      story: 'Antes de lançar, David Vélez entrevistou {{centenas de brasileiros}} sobre sua relação com bancos. Descobriu o problema real: não era o cartão de crédito — era a {{raiva}} do banco. Isso foi exploratório puro.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '20-30', label: 'Entrevistas para saturação de dados' },
                        { value: 'Hipóteses', label: 'O que a exploratória gera (não conclusões)' },
                        { value: 'Qualitativo', label: 'Método dominante na exploratória' },
                      ],
                      insight: 'A pesquisa exploratória responde "o quê e por quê" — não "quanto". Misturar exploratória com causal é o erro {{mais comum}} em projetos de pesquisa.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Pesquisa Descritiva',
                    period: '"Qual o tamanho e perfil?"',
                    text: 'Objetivo: descrever uma população com precisão. Métodos: survey, censo, dados secundários. Resultado: {{números, percentuais, distribuições}}. Use quando já sabe o que perguntar e precisa quantificar.',
                    caseStudy: {
                      company: 'IBGE / CETIC.br',
                      year: 2022,
                      story: 'A pesquisa CETIC.br TIC Empresas 2022 mostrou que apenas {{5%}} das PMEs brasileiras usam dados para decisão. Survey com 6.000 empresas — descritivo puro: mapeou o estado atual sem testar causa.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '6.000', label: 'Empresas pesquisadas (CETIC 2022)' },
                        { value: '5%', label: 'PMEs que usam dados para decisão' },
                        { value: '±2%', label: 'Margem de erro com 95% de confiança' },
                      ],
                      insight: 'Correlação não é causalidade — é o mantra da pesquisa descritiva. Descrever que {{X e Y coexistem}} não prova que X causa Y.',
                    },
                  },
                  {
                    index: 3,
                    title: 'Pesquisa Causal',
                    period: '"X realmente causa Y?"',
                    text: 'Objetivo: estabelecer relação de causa e efeito. Métodos: experimento controlado, teste A/B, quasi-experimento. Resultado: {{evidência causal}} — não só correlação. Use quando precisa provar que uma ação específica gera um resultado específico.',
                    caseStudy: {
                      company: 'Amazon — teste A/B',
                      year: 2024,
                      story: 'A Amazon roda {{mais de 1.000 testes A/B}} por mês. Cada mudança de layout, cor, preço ou copy é um experimento causal: grupo controle vs. grupo tratamento. Nenhuma mudança vai ao ar sem evidência causal.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '1.000+', label: 'Testes A/B rodando na Amazon/mês' },
                        { value: 'Grupo controle', label: 'Elemento essencial do experimento causal' },
                        { value: 'p < 0,05', label: 'Significância estatística padrão' },
                      ],
                      insight: 'O experimento causal é o único método que prova {{causa e efeito}}. Todo o resto prova associação. A diferença importa quando você decide investir R$ 2M numa mudança.',
                    },
                  },
                ],
              },
              {
                kind: 'paragraph',
                text: 'A revisão bibliográfica é a fundação de qualquer trabalho acadêmico. Não é listar autores — é mapear o que já se sabe e {{identificar o gap}} que sua pesquisa vai preencher. Use bases como Scopus, Web of Science e Periódicos CAPES. Organize por temas, não por autor. Identifique onde a literatura contradiz, onde há lacunas e onde seu contexto foi pouco estudado.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Compare os 3 tipos de pesquisa em 4 dimensões. Depois, classifique as 5 perguntas de pesquisa no método correto.',
              compare: {
                columnHeaders: ['Exploratória', 'Descritiva', 'Causal'],
                rows: [
                  {
                    label: 'Pergunta',
                    values: ['O quê / Por quê?', 'Quanto / Qual perfil?', 'X causa Y?'],
                    viz: 'icons',
                    icons: ['◯', '◑', '●'],
                  },
                  {
                    label: 'Método típico',
                    values: ['Entrevistas', 'Survey / censo', 'Experimento A/B'],
                    viz: 'icons',
                    icons: ['▦', '⊞', '◈'],
                  },
                  {
                    label: 'Rigor estatístico',
                    values: ['Baixo', 'Médio', 'Alto'],
                    viz: 'bars',
                    intensities: [0.2, 0.55, 1.0],
                  },
                  {
                    label: 'Generalização',
                    values: ['Limitada', 'Alta', 'Alta + causal'],
                    viz: 'bars',
                    intensities: [0.15, 0.6, 1.0],
                  },
                ],
              },
              drag: {
                instruction: 'Toque na pergunta de pesquisa, depois toque no método correto:',
                zones: [
                  { id: 'exploratoria', label: 'Exploratória' },
                  { id: 'descritiva', label: 'Descritiva' },
                  { id: 'causal', label: 'Causal' },
                ],
                items: [
                  {
                    id: 'perg-exploratoria',
                    label: 'Entendendo o cliente',
                    sublabel: '"Por que nossos clientes abandonam o carrinho na etapa de pagamento?"',
                    correctZone: 'exploratoria',
                    correctFeedback: 'Correto. "Por que" sinaliza pergunta exploratória: você quer entender motivações, não quantificar. O método ideal são entrevistas em profundidade com clientes que abandonaram.',
                    wrongFeedback: 'Repense. "Por que" é a pergunta da pesquisa exploratória — você quer entender as razões, não medir o tamanho do problema. Entrevistas em profundidade são o caminho.',
                  },
                  {
                    id: 'perg-descritiva',
                    label: 'Mapeando o mercado',
                    sublabel: '"Qual a distribuição de faturamento das PMEs de tecnologia no Brasil por porte e região?"',
                    correctZone: 'descritiva',
                    correctFeedback: 'Correto. "Qual a distribuição" é clássico de pesquisa descritiva — você quer mapear a realidade com números. Survey com amostra representativa ou dados do IBGE.',
                    wrongFeedback: 'Repense. "Qual a distribuição" quer descrever uma população com precisão — isso é pesquisa descritiva. Não está testando causa, está mapeando o estado atual.',
                  },
                  {
                    id: 'perg-causal',
                    label: 'Testando intervenção',
                    sublabel: '"O novo onboarding de 3 passos reduz o churn nos primeiros 30 dias?"',
                    correctZone: 'causal',
                    correctFeedback: 'Correto. "Reduz" implica relação causal: uma mudança específica (onboarding) causa um resultado específico (churn). Teste A/B: grupo com novo onboarding vs. grupo com onboarding antigo.',
                    wrongFeedback: 'Repense. A pergunta tem uma intervenção (novo onboarding) e um resultado esperado (redução de churn). Isso é pergunta causal — a única forma de responder é com experimento controlado ou teste A/B.',
                  },
                  {
                    id: 'perg-exploratoria2',
                    label: 'Entendendo resistência',
                    sublabel: '"Quais são os principais motivos que levam gestores a resistir à adoção de novos sistemas de BI?"',
                    correctZone: 'exploratoria',
                    correctFeedback: 'Correto. "Quais são os principais motivos" é exploratório — você quer identificar razões, não medir frequências. Entrevistas semi-estruturadas com gestores que resistiram.',
                    wrongFeedback: 'Repense. A pergunta busca entender motivações ("motivos que levam") — não quantifica nem testa causa. Isso é exploratório: você quer descobrir o que ainda não sabe.',
                  },
                  {
                    id: 'perg-descritiva2',
                    label: 'Perfil de uso',
                    sublabel: '"Qual percentual das empresas do setor varejista utiliza algum sistema de CRM integrado com e-commerce?"',
                    correctZone: 'descritiva',
                    correctFeedback: 'Correto. "Qual percentual" e "utiliza" são marcadores de pesquisa descritiva — você quer medir a prevalência de um comportamento numa população. Survey com amostra do setor varejista.',
                    wrongFeedback: 'Repense. "Qual percentual" quer um número — uma medida de prevalência. Isso é pesquisa descritiva: mapear o estado atual com precisão estatística.',
                  },
                ],
              },
            },
            synthesis: {
              closingText: 'Ler criticamente e pesquisar com rigor são as duas faces da mesma moeda: {{separar o que se sabe do que se acredita}}. Todo argumento forte começa por saber em qual tipo de evidência ele está ancorado.',
              keyInsights: [
                'Viés de confirmação é o inimigo da leitura crítica: leia para questionar, não para confirmar.',
                'Método de pesquisa errado invalida o estudo inteiro — não importa a qualidade da execução.',
                'Correlação não é causalidade: {{só o experimento}} prova causa e efeito.',
              ],
              nextChapterHint: 'Capítulo 4 · Apresentar com Impacto',
              nextChapterBlurb: 'Storytelling com dados, design de slides e a estrutura Duarte — como apresentações que movem pessoas à ação.',
            },
          },

          // ── CHAPTER 4 ──────────────────────────────────────────────
          {
            id: 'M5-0-cap4',
            type: 'chapter',
            number: 4,
            title: 'Apresentar com Impacto',
            subtitle: 'Storytelling com dados, design de slides e a estrutura que move pessoas à ação',
            opening: {
              leadText: 'Apresentar não é ler slides — é {{conduzir uma narrativa}} que move pessoas à ação. A diferença entre uma apresentação que convence e uma que é esquecida não está nos dados — está na estrutura da história.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'Nancy Duarte estudou as apresentações mais impactantes da história — de Steve Jobs ao discurso "I Have a Dream" de Martin Luther King. Encontrou um padrão universal: todas alternam entre {{o que é}} (a realidade atual) e {{o que poderia ser}} (a visão), criando tensão narrativa que move à ação.',
              },
              {
                kind: 'step-flow',
                title: 'Estrutura Duarte — A narrativa de alto impacto',
                steps: [
                  { number: 1, title: 'O que é', description: '"Hoje, 65% das PMEs fazem gestão financeira em planilha." — A realidade atual, com dado concreto.' },
                  { number: 2, title: 'O que poderia ser', description: '"Imagine se cada decisão fosse baseada em dados em tempo real." — A visão possível.' },
                  { number: 3, title: 'O que é', description: '"Mas 73% dos empresários descobrem problemas de caixa quando já é tarde." — A tensão que mantém.' },
                  { number: 4, title: 'O que poderia ser', description: '"Com nossa plataforma, veem o problema 30 dias antes." — A solução concreta.' },
                  { number: 5, title: 'Call to action', description: '"Junte-se a nós." — O que você quer que o público faça AGORA. Encerre com ação, não com "obrigado".' },
                ],
              },
              {
                kind: 'paragraph',
                text: 'Design não é estética — é {{clareza visual}}. A regra dos 3 segundos: se o público não entende o slide em 3 segundos, refaça. Um slide = uma ideia = um visual. Texto: máximo 6 palavras no título. Números: destaque o número, não a frase — "{{340%}}" deve ser grande, o contexto é pequeno.',
              },
              {
                kind: 'pillar-grid',
                title: 'Os 7 slides essenciais',
                pillars: [
                  { icon: '🎯', title: 'Título', description: '1 frase impactante + sua proposta. Quem você é e {{por que importa}}.' },
                  { icon: '⚡', title: 'Problema', description: 'Estatística chocante + visual. O problema que você {{resolve}}.' },
                  { icon: '✅', title: 'Solução', description: 'Antes/depois ou demonstração. O que {{muda}} com você.' },
                  { icon: '📊', title: 'Dados', description: '1 gráfico, 1 insight, 1 conclusão. Sem mais que isso por slide.' },
                  { icon: '🏆', title: 'Prova social', description: 'Logos de clientes, métricas reais, depoimentos. {{Evidência}} de que funciona.' },
                  { icon: '📅', title: 'Timeline', description: '3-5 marcos com datas. {{Quando} as coisas acontecem.' },
                  { icon: '🚀', title: 'Call to action', description: 'O que você quer que o público faça {{agora}}. Específico e com data.' },
                ],
              },
              {
                kind: 'paragraph',
                text: 'Os primeiros {{30 segundos}} ganham ou perdem a audiência. Comece com dado surpreendente, pergunta provocativa ou história — nunca com "bom dia, meu nome é X e hoje vou falar sobre...". Nunca leia o slide: o slide é para o público, você fala o que {{não está}} no slide. Silêncio é poder: pause 2 segundos após um dado impactante.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Compare os 3 formatos de apresentação em 4 dimensões. Depois, identifique qual formato se encaixa em cada situação.',
              compare: {
                columnHeaders: ['Email Estratégico', 'Deck / Slides', 'Business Case'],
                rows: [
                  {
                    label: 'Duração',
                    values: ['30 seg de leitura', '10-20 minutos', '30-60 minutos'],
                    viz: 'icons',
                    icons: ['◯', '◑', '●'],
                  },
                  {
                    label: 'Estrutura',
                    values: ['5 linhas', '10-15 slides', 'IMRAD completo'],
                    viz: 'icons',
                    icons: ['▦', '⊞', '◈'],
                  },
                  {
                    label: 'Profundidade',
                    values: ['Mínima', 'Média', 'Alta'],
                    viz: 'bars',
                    intensities: [0.15, 0.55, 1.0],
                  },
                  {
                    label: 'Urgência',
                    values: ['Imediata', 'Média', 'Planejada'],
                    viz: 'bars',
                    intensities: [1.0, 0.6, 0.25],
                  },
                ],
              },
              drag: {
                instruction: 'Toque na situação, depois toque no formato mais adequado:',
                zones: [
                  { id: 'email', label: 'Email Estratégico' },
                  { id: 'deck', label: 'Deck / Slides' },
                  { id: 'business-case', label: 'Business Case' },
                ],
                items: [
                  {
                    id: 'situ-email',
                    label: 'Aprovação urgente',
                    sublabel: 'Você precisa que o diretor aprove R$ 15K para um treinamento até amanhã. Ele está viajando.',
                    correctZone: 'email',
                    correctFeedback: 'Correto. Urgência + decisão simples = email estratégico. Linha 1: o que você quer. Linha 2-3: por quê. Linha 4: próximo passo com data. Máximo 5 linhas.',
                    wrongFeedback: 'Repense. Decisão simples, urgente, diretor viajando — o email é o único canal que respeita isso. Um deck para R$ 15K é excesso; um business case leva dias.',
                  },
                  {
                    id: 'situ-deck',
                    label: 'Pitch para investidor',
                    sublabel: 'Você vai apresentar sua startup para 3 investidores em reunião de 20 minutos.',
                    correctZone: 'deck',
                    correctFeedback: 'Correto. 20 minutos, audiência ao vivo, decisão de investimento — é o cenário clássico do deck. Use a estrutura Guy Kawasaki 10/20/30: 10 slides, 20 minutos, fonte 30pt.',
                    wrongFeedback: 'Repense. Apresentação presencial de 20 minutos para convencer = deck. Email não tem impacto visual; business case é para depois da reunião.',
                  },
                  {
                    id: 'situ-bc',
                    label: 'Proposta de expansão',
                    sublabel: 'Você quer propor ao board a abertura de 3 filiais no Nordeste — investimento de R$ 5M.',
                    correctZone: 'business-case',
                    correctFeedback: 'Correto. R$ 5M de investimento, decisão de board, risco alto — exige business case completo: metodologia, dados de mercado, projeções financeiras, análise de risco, contra-argumentos.',
                    wrongFeedback: 'Repense. R$ 5M e decisão de board exigem rigor total: metodologia clara, projeções detalhadas, análise de risco. Isso é business case — não cabe em email nem em 10 slides.',
                  },
                  {
                    id: 'situ-deck2',
                    label: 'Kickoff de projeto',
                    sublabel: 'Você vai apresentar o novo projeto de CRM para 15 pessoas da equipe na reunião de segunda.',
                    correctZone: 'deck',
                    correctFeedback: 'Correto. Reunião com equipe, apresentação presencial, objetivo de engajar — deck é o formato. Use os 7 tipos essenciais: problema, solução, timeline, responsáveis, call to action.',
                    wrongFeedback: 'Repense. 15 pessoas, reunião presencial, objetivo de engajar e alinhar a equipe — isso é deck. Business case é para aprovação de investimento, não para kickoff.',
                  },
                  {
                    id: 'situ-email2',
                    label: 'Follow-up de reunião',
                    sublabel: 'A reunião terminou. Você precisa resumir as 3 decisões tomadas e os responsáveis para todo o time.',
                    correctZone: 'email',
                    correctFeedback: 'Correto. Resumo pós-reunião = email direto: decisões tomadas (bullets), responsáveis, prazos. Não precisa de slide, não precisa de documento — 5-10 linhas com clareza Minto.',
                    wrongFeedback: 'Repense. Follow-up de reunião com 3 decisões e responsáveis é exatamente o caso do email estratégico: curto, direto, acionável. Ninguém abre um deck de follow-up.',
                  },
                ],
              },
            },
            synthesis: {
              closingText: 'Comunicação eficaz não é sobre você — é sobre o seu {{leitor ou audiência}}. Escolha o formato que respeita o tempo deles. Use a estrutura que organiza o seu pensamento. E lembre: clareza é respeito.',
              keyInsights: [
                'A estrutura Duarte cria tensão narrativa alternando realidade e possibilidade — é o padrão de {{todas as apresentações que movem pessoas}}.',
                'Um slide = uma ideia = um visual. Qualquer coisa além disso divide a atenção e dilui a mensagem.',
                'Os primeiros 30 segundos são decisivos — comece com impacto, nunca com apresentação pessoal.',
              ],
            },
          },

        ],
      },
      {
        id: 'M5-1',
        title: 'Empreendedorismo e Inovacao',
        blocks: [
          // ── CHAPTER 1 ──────────────────────────────────────────────
          {
            id: 'M5-1-cap1',
            type: 'chapter',
            number: 1,
            title: 'Empreender — O que É e Como Pensar',
            subtitle: 'De Schumpeter à Effectuation — as duas lógicas que separam empreendedores que criam do que os que apenas executam',
            opening: {
              leadText: 'Empreendedorismo não é "abrir empresa". É identificar oportunidades e criar valor onde antes não existia — com recursos limitados e sob incerteza. {{53 milhões}} de empreendedores ativos no Brasil (GEM, 2024), mas 70% empreendem por necessidade, não por oportunidade. A diferença muda tudo: estratégia, ritmo, capital e probabilidade de sucesso.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'Três pensadores definiram o que é empreender de formas complementares. Schumpeter: o empreendedor é agente da {{destruição criativa}} — destrói o velho para criar o novo (Nubank destruiu o banco com agências). Drucker: empreendedorismo é a prática de transformar recursos em riqueza por meio de uma nova capacidade. Sarasvathy: empreendedores não preveem o futuro — eles o constroem.',
              },
              {
                kind: 'pillar-grid',
                title: 'Mitos que precisam morrer',
                pillars: [
                  { icon: '🧬', title: '"Nascem prontos"', description: 'Falso. Pesquisa do MIT: treinamento formal aumenta probabilidade de sucesso em {{2,5x}}. É habilidade treinável.' },
                  { icon: '💡', title: '"Precisa de ideia genial"', description: 'Falso. {{90%}} dos negócios de sucesso não são ideias originais — são execuções superiores. McDonald\'s não inventou o hambúrguer.' },
                  { icon: '💰', title: '"Precisa de dinheiro"', description: 'Falso. {{70%}} das startups do Vale começaram com menos de US$ 10K. Bootstrapping é a norma, não a exceção.' },
                  { icon: '🎲', title: '"Amam risco"', description: 'Falso. Bons empreendedores {{gerenciam}} risco — calculam, mitigam, assumem risco calculado. Não risco cego.' },
                ],
              },
              {
                kind: 'paragraph',
                text: 'Saras Sarasvathy estudou como empreendedores experientes realmente pensam — e descobriu que a lógica é {{oposta}} ao que se ensina em MBA. Enquanto o planejamento tradicional parte do objetivo e trabalha para trás (Causation), empreendedores experientes partem do que têm e trabalham para frente (Effectuation).',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Causation — Planejamento tradicional',
                    period: 'Mercados estáveis',
                    text: '"Defina o objetivo → Planeje → Execute → Meça." Lógica: prever o futuro e se preparar. Ferramentas: business plan, pesquisa de mercado, projeções financeiras. Funciona quando o mercado é {{estável}}, a informação está disponível e a incerteza é baixa.',
                    caseStudy: {
                      company: 'Expansão Natura para Europa',
                      year: 2017,
                      story: 'Natura usou Causation para expandir internacionalmente: análise de mercado profunda, projeção de 5 anos, entrada faseada por país. Mercado maduro, modelo provado — {{planejar fazia sentido}}.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'Objetivo', label: 'Ponto de partida da Causation' },
                        { value: 'Recursos', label: 'Alocados para atingir o objetivo' },
                        { value: 'Previsão', label: 'Base de toda a lógica' },
                      ],
                      insight: 'Causation não é ruim — é {{inadequada para alta incerteza}}. Na expansão de negócio existente em mercado maduro, funciona perfeitamente.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Effectuation — Lógica empreendedora',
                    period: 'Mercados incertos',
                    text: '"Com o que tenho → O que posso criar? → Teste → Adapte." Os 5 princípios: Pássaro na Mão (comece com o que tem), Perda Aceitável (quanto pode perder sem se destruir?), Colcha de Retalhos (parceiros mudam o rumo), {{Limonada}} (surpresas são oportunidades) e Piloto do Avião (você cria o futuro).',
                    caseStudy: {
                      company: 'Airbnb — fundação',
                      year: 2008,
                      story: 'Os fundadores tinham: um apartamento com quarto vazio + uma conferência lotando os hotéis de São Francisco. {{Sem plano, sem projeção}} — usaram o que tinham. O produto emergiu das conversas com os primeiros 3 hóspedes.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'Recursos', label: 'Ponto de partida da Effectuation' },
                        { value: 'Parcerias', label: 'Moldam o produto antes do plano' },
                        { value: 'Surpresas', label: 'Tratadas como oportunidade (Limonada)' },
                      ],
                      insight: 'Post-it nasceu de adesivo que "falhou". Slack nasceu de jogo que fracassou. {{Limonada}} é o princípio mais difícil de aprender — e o mais valioso.',
                    },
                  },
                  {
                    index: 3,
                    title: 'Pivot — Quando aprender muda o rumo',
                    period: 'Aprendizado aplicado',
                    text: 'Pivot não é fracasso — é aprendizado que muda a direção. Instagram era Burbn (app de check-in). Twitter era Odeo (plataforma de podcast). Slack era um jogo online. {{O produto certo nasceu do produto errado}} quando os fundadores prestaram atenção no que os usuários realmente usavam.',
                    caseStudy: {
                      company: 'Instagram',
                      year: 2010,
                      story: 'Burbn tinha {{dezenas de funcionalidades}}. Os usuários só usavam uma: compartilhar fotos com filtros. Kevin Systrom cortou tudo e lançou só essa função. {{13 dias depois}}, 25.000 usuários. Pivot total.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '13 dias', label: 'Para 25.000 usuários após o pivot' },
                        { value: 'US$ 1B', label: 'Aquisição pelo Facebook em 2012' },
                        { value: '0', label: 'Funcionalidades originais que sobreviveram' },
                      ],
                      insight: 'A diferença entre pivot e desistência: {{pivot mantém a missão e muda o produto}}. Desistência abandona tudo. Kevin Systrom manteve a missão (conectar pessoas por imagem) e mudou tudo o mais.',
                    },
                  },
                ],
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Compare as três abordagens empreendedoras em 4 dimensões. Depois, classifique as 5 situações no modo de pensar que melhor descreve cada uma.',
              compare: {
                columnHeaders: ['Causation', 'Effectuation', 'Pivot'],
                rows: [
                  {
                    label: 'Ponto de partida',
                    values: ['Objetivo definido', 'Recursos disponíveis', 'Aprendizado real'],
                    viz: 'icons',
                    icons: ['◯', '◑', '●'],
                  },
                  {
                    label: 'Incerteza',
                    values: ['Baixa', 'Alta', 'Confirmada'],
                    viz: 'icons',
                    icons: ['▦', '⊞', '◈'],
                  },
                  {
                    label: 'Velocidade',
                    values: ['Lenta (planeja)', 'Rápida (age)', 'Radical (muda)'],
                    viz: 'bars',
                    intensities: [0.25, 0.7, 1.0],
                  },
                  {
                    label: 'Risco de capital',
                    values: ['Alto (investe antes)', 'Baixo (perda aceitável)', 'Médio (reaproveitado)'],
                    viz: 'bars',
                    intensities: [0.85, 0.2, 0.5],
                  },
                ],
              },
              drag: {
                instruction: 'Toque na situação, depois toque no modo de pensar que a descreve:',
                zones: [
                  { id: 'causation', label: 'Causation' },
                  { id: 'effectuation', label: 'Effectuation' },
                  { id: 'pivot', label: 'Pivot' },
                ],
                items: [
                  {
                    id: 'sit-causation',
                    label: 'Expansão de rede de franquias',
                    sublabel: 'Uma rede de 80 lojas planeja abrir mais 30 em 2 anos. Faz pesquisa de mercado por cidade, projeta break-even e define cronograma de expansão.',
                    correctZone: 'causation',
                    correctFeedback: 'Correto. Modelo comprovado, mercado conhecido, projeção baseada em dados reais — Causation pura. Quando existe incerteza baixa e modelo validado, planejar antes de agir é a abordagem certa.',
                    wrongFeedback: 'Repense. A rede já tem 80 lojas com modelo comprovado. Não é incerteza alta — é expansão de algo que funciona. Pesquisa + projeção + cronograma = Causation.',
                  },
                  {
                    id: 'sit-effectuation',
                    label: 'Primeiro produto com o que tem',
                    sublabel: 'Designer freelancer começa a vender templates prontos usando seus projetos existentes. Sem plano — testou com a própria rede, ajustou preço pelo feedback.',
                    correctZone: 'effectuation',
                    correctFeedback: 'Correto. "Comece com o que tem" é o primeiro princípio da Effectuation (Pássaro na Mão). Usou recursos disponíveis (projetos existentes + rede), testou sem plano prévio, adaptou com feedback real.',
                    wrongFeedback: 'Repense. Sem plano, sem objetivo pré-definido — só o que tinha disponível (projetos + rede). Isso é Effectuation: partir dos recursos e descobrir o que pode criar com eles.',
                  },
                  {
                    id: 'sit-pivot',
                    label: 'App que virou outra coisa',
                    sublabel: 'App de agendamento médico percebia que a funcionalidade mais usada era o prontuário compartilhado. Cortou o agendamento e focou só em prontuário digital.',
                    correctZone: 'pivot',
                    correctFeedback: 'Correto. Pivot clássico: dados de uso revelaram que o produto real não era o planejado. Cortaram funcionalidades para focar no que os usuários realmente valorizavam. A missão (saúde digital) permaneceu.',
                    wrongFeedback: 'Repense. O produto mudou radicalmente com base no comportamento real dos usuários — não no plano original. Isso é pivot: aprendizado que força mudança de direção.',
                  },
                  {
                    id: 'sit-effectuation2',
                    label: 'Startup fundada numa conferência',
                    sublabel: 'Dois engenheiros no hackathon resolveram um problema que viram no evento. Sem plano — formaram parceria ali, construíram protótipo em 48h, mostraram para 10 potenciais clientes no corredor.',
                    correctZone: 'effectuation',
                    correctFeedback: 'Correto. Colcha de Retalhos + Pássaro na Mão: parceria formada pelo encontro (recurso disponível), protótipo como teste de perda aceitável, feedback imediato. Não houve plano — houve ação.',
                    wrongFeedback: 'Repense. Parceria improvisada, protótipo em 48h, sem plano prévio — os fundadores usaram o que tinham (habilidades técnicas + oportunidade do evento). Effectuation.',
                  },
                  {
                    id: 'sit-pivot2',
                    label: 'Plataforma de games que virou Slack',
                    sublabel: 'Empresa de jogos online percebeu que os jogadores adoravam a ferramenta interna de comunicação que usavam — mais do que o jogo. Abandonaram o jogo e lançaram a ferramenta.',
                    correctZone: 'pivot',
                    correctFeedback: 'Correto. Esse é exatamente o caso real do Slack. A ferramenta interna tinha mais tração do que o produto principal. Pivot total: mesma empresa, mesma equipe, produto completamente diferente.',
                    wrongFeedback: 'Repense. Isso é a história real do Slack — o jogo falhou mas a ferramenta de comunicação criada internamente era o produto real. Abandonar o plano original com base em evidência = pivot.',
                  },
                ],
              },
            },
            synthesis: {
              closingText: 'Não existe lógica certa — existe a lógica {{adequada ao contexto}}. Causation para mercados maduros. Effectuation para mercados incertos. Pivot quando o aprendizado contradiz o plano. O empreendedor competente transita entre as três.',
              keyInsights: [
                'Destruição criativa não é sobre destruir — é sobre criar algo que torna o antigo {{desnecessário}}.',
                'Effectuation: a pergunta não é "o que preciso para atingir X?" — é "o que posso criar com o que tenho {{agora}}?"',
                'Pivot mantém a missão e muda o produto. Quem muda a missão a cada semana não pivotou — perdeu o rumo.',
              ],
              nextChapterHint: 'Capítulo 2 · Validar Antes de Construir',
              nextChapterBlurb: 'Lean Startup, MVP e Product-Market Fit — como provar que alguém quer o produto antes de gastar o capital todo.',
            },
          },

          // ── CHAPTER 2 ──────────────────────────────────────────────
          {
            id: 'M5-1-cap2',
            type: 'chapter',
            number: 2,
            title: 'Validar Antes de Construir',
            subtitle: 'Lean Startup, MVP e Product-Market Fit — o método que evita construir algo que ninguém quer',
            opening: {
              leadText: 'O maior risco de um novo negócio não é falhar na execução — é construir algo que ninguém quer. {{42%}} das startups falham por "falta de necessidade de mercado" (CB Insights). O Lean Startup de Eric Ries (2011) sistematizou o método para testar antes de gastar.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'O ciclo Build-Measure-Learn não começa no Build — começa no Learn. Defina primeiro o que precisa aprender (a hipótese mais arriscada), depois o experimento mais barato para aprender isso (o MVP), e só então construa. {{MVP não é o produto mínimo — é o experimento mais barato para validar se a hipótese é verdadeira.}}',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Build — O MVP',
                    period: 'Construir o mínimo',
                    text: 'MVP não é o produto final com menos funcionalidades. É o experimento mais barato para aprender se a hipótese é verdadeira. Dropbox: {{vídeo de 3 minutos}} mostrando como funcionaria → 75.000 inscritos em uma noite. Zero código. Zappos: fotografou sapatos em lojas, postou online, comprava quando alguém pedia. Validou demanda {{sem estoque}}.',
                    caseStudy: {
                      company: 'Buffer',
                      year: 2010,
                      story: 'Joel Gascoigne criou uma landing page com preços. Quando alguém clicava em "assinar", aparecia: "ainda não estamos prontos — deixe seu email." {{Mediu interesse real}} antes de escrever uma linha de código. Hoje: US$ 20M+ em ARR.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '75.000', label: 'Inscritos do MVP em vídeo do Dropbox (1 noite)' },
                        { value: 'R$ 0', label: 'Custo de código no MVP do Dropbox' },
                        { value: '3 min', label: 'Duração do vídeo que validou um negócio bilionário' },
                      ],
                      insight: 'A pergunta antes de qualquer MVP: "{{qual é a hipótese mais arriscada}} do nosso modelo?" Essa é a hipótese a testar primeiro — não a mais fácil de testar.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Measure — Métricas que importam',
                    period: 'Medir o certo',
                    text: 'Métricas de vaidade: downloads, pageviews, seguidores — parecem bons, {{não dizem nada}}. Métricas acionáveis: taxa de conversão, retenção D7, LTV/CAC, NPS. Teste: "se essa métrica mudar, minha decisão muda?" Se não — é vaidade.',
                    caseStudy: {
                      company: 'Slack — métrica Aha',
                      year: 2013,
                      story: 'Slack descobriu que equipes que trocam {{2.000 mensagens}} nunca cancelam. Isso virou a única métrica que importava no onboarding: fazer a equipe trocar as primeiras 2.000 mensagens o mais rápido possível.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '2.000', label: 'Mensagens = momento aha do Slack (churn ~0%)' },
                        { value: 'D30', label: 'Retenção D30 < 20% = produto não resolve o problema' },
                        { value: '40%', label: 'Usuários "muito desapontados" = limiar de PMF (Sean Ellis)' },
                      ],
                      insight: '{{Métricas de retenção}} são as mais honestas: se o usuário volta, o produto tem valor. Se não volta, o problema é do produto — não do marketing.',
                    },
                  },
                  {
                    index: 3,
                    title: 'Learn — Pivotar ou Perseverar',
                    period: 'Decidir com dados',
                    text: 'Hipótese validada → Persevere. Escale. Hipótese invalidada → Pivote. Mude a abordagem. Marc Andreessen: "{{Product-market fit}} é a única coisa que importa." Teste de Sean Ellis: pergunte aos usuários "Como se sentiria se não pudesse mais usar este produto?" Se {{40%+}} responde "muito desapontado" → PMF. Se <40% → continue iterando.',
                    caseStudy: {
                      company: 'WhatsApp',
                      year: 2009,
                      story: 'Sem marketing, sem anúncio, sem growth hack. As pessoas baixavam porque {{todo mundo usava}}. Crescimento orgânico explosivo = PMF nítido. Jan Koum não precisou do teste de Sean Ellis — os dados eram óbvios.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '40%', label: '"Muito desapontados" = PMF confirmado (Sean Ellis)' },
                        { value: 'Orgânico', label: 'Como WhatsApp cresceu — zero marketing' },
                        { value: 'US$ 19B', label: 'Aquisição pelo Facebook — 5 anos após o lançamento' },
                      ],
                      insight: 'PMF não é declaração — é {{comportamento}}. Indicadores reais: crescimento orgânico (pessoas indicam sem você pedir), retenção estável ou crescente, demanda maior que capacidade.',
                    },
                  },
                ],
              },
              {
                kind: 'paragraph',
                text: 'Os {{4 estágios da validação}}: (1) Problem-Solution Fit — o problema existe e é doloroso o suficiente para alguém pagar? (2) MVP e primeiros usuários — a solução resolve de verdade? (3) Product-Market Fit — o mercado puxa o produto sem precisar ser convencido? (4) Scale — só escale após PMF. Escalar sem PMF é gastar dinheiro para descobrir mais rápido que não funciona.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Compare os 3 momentos da jornada de validação. Depois, classifique as 5 situações no estágio correto.',
              compare: {
                columnHeaders: ['Ainda testando', 'Tem PMF', 'Hora de escalar'],
                rows: [
                  {
                    label: 'Retenção',
                    values: ['Instável / baixa', 'Estável e crescente', 'Alta + orgânica'],
                    viz: 'icons',
                    icons: ['◯', '◑', '●'],
                  },
                  {
                    label: 'Crescimento',
                    values: ['Lento / forçado', 'Orgânico parcial', 'Viral / orgânico'],
                    viz: 'icons',
                    icons: ['▦', '⊞', '◈'],
                  },
                  {
                    label: 'Sean Ellis',
                    values: ['< 20%', '40%+', '60%+'],
                    viz: 'bars',
                    intensities: [0.1, 0.55, 1.0],
                  },
                  {
                    label: 'Próx. ação',
                    values: ['Iterar / pivotar', 'Preparar escala', 'Investir em growth'],
                    viz: 'bars',
                    intensities: [0.15, 0.6, 1.0],
                  },
                ],
              },
              drag: {
                instruction: 'Toque na situação, depois toque no estágio correto:',
                zones: [
                  { id: 'testando', label: 'Ainda testando' },
                  { id: 'pmf', label: 'Tem PMF' },
                  { id: 'escalar', label: 'Hora de escalar' },
                ],
                items: [
                  {
                    id: 'val-testando',
                    label: 'App com churn alto',
                    sublabel: 'App de produtividade com 500 usuários. Metade abandona nos primeiros 7 dias. Quem fica adora, mas não indica espontaneamente.',
                    correctZone: 'testando',
                    correctFeedback: 'Correto. Churn D7 alto + crescimento não-orgânico = sem PMF. A metade que fica pode indicar que o produto tem potencial para um segmento menor. Itere: entreviste quem saiu e quem ficou.',
                    wrongFeedback: 'Repense. Metade abandonando em 7 dias é sinal claro: o produto não resolve o problema bem o suficiente para a maioria. Sem PMF — continue testando e iterando.',
                  },
                  {
                    id: 'val-pmf',
                    label: 'SaaS com 45% "muito desapontados"',
                    sublabel: 'Software B2B com 300 clientes. 45% diz que seria "muito desapontado" sem ele. Churn mensal de 2%. Crescimento via indicação: 30% dos novos clientes.',
                    correctZone: 'pmf',
                    correctFeedback: 'Correto. 45% no teste de Sean Ellis (acima do limiar de 40%), churn baixo e indicações orgânicas expressivas — PMF confirmado. Próximo passo: preparar escala de aquisição.',
                    wrongFeedback: 'Repense. 45% "muito desapontados" está acima do limiar de PMF (40%), churn de 2% é saudável, 30% de indicações é orgânico. Isso é PMF — não é mais "testando".',
                  },
                  {
                    id: 'val-escalar',
                    label: 'Fintech crescendo 40% ao mês',
                    sublabel: 'Fintech com 50.000 usuários. Crescimento de 40% ao mês puxado por indicação. NPS de 72. Demanda maior que capacidade de atendimento.',
                    correctZone: 'escalar',
                    correctFeedback: 'Correto. Crescimento viral (40%/mês por indicação), NPS alto (72), demanda > capacidade — PMF confirmado e comprovado. Hora de investir em infraestrutura e aquisição acelerada.',
                    wrongFeedback: 'Repense. 40%/mês por indicação orgânica + NPS 72 + demanda maior que capacidade. Isso é PMF evidente — e o mercado está pedindo escala. Não fique testando o que já está validado.',
                  },
                  {
                    id: 'val-testando2',
                    label: 'Marketplace com baixo engajamento',
                    sublabel: 'Marketplace conecta freelancers a empresas. 200 cadastros. Apenas 12 transações no primeiro mês. Usuários dizem que "é interessante mas não veem urgência em usar".',
                    correctZone: 'testando',
                    correctFeedback: 'Correto. "Interessante mas não urgente" é diagnóstico de sem PMF. O problema ou não é doloroso o suficiente, ou a solução não resolve o que importa. Volte ao Problem-Solution Fit — entreviste quem não transacionou.',
                    wrongFeedback: 'Repense. "Interessante mas não urgente" = o problema não é doloroso o suficiente para gerar uso. 12 transações em 200 cadastros é conversão de 6% — muito baixo. Ainda testando.',
                  },
                  {
                    id: 'val-pmf2',
                    label: 'EdTech com retenção crescente',
                    sublabel: 'Plataforma de cursos com 2.000 alunos. Retenção D30 de 55% (crescendo). 60% dos novos alunos chegam por indicação de alunos atuais. Ticket médio subindo.',
                    correctZone: 'pmf',
                    correctFeedback: 'Correto. Retenção D30 de 55% é forte para EdTech (média do setor é ~30%), indicação de 60% é orgânica expressiva, ticket médio subindo indica disposição a pagar mais. PMF confirmado.',
                    wrongFeedback: 'Repense. Retenção D30 de 55% acima da média setorial, 60% de indicações orgânicas e ticket subindo. Os três sinais juntos confirmam PMF — mas escala agressiva ainda pode ser prematura sem mais dados.',
                  },
                ],
              },
            },
            synthesis: {
              closingText: 'A validação não é uma fase do projeto — é uma {{mentalidade permanente}}. Startups que escalam sem PMF queimam capital para descobrir mais rápido que o produto não funciona. As que têm PMF e escalam devagar desperdiçam a janela de mercado.',
              keyInsights: [
                'MVP não é o produto mais simples — é o experimento mais barato para aprender se {{a hipótese principal é verdadeira}}.',
                'Métricas de vaidade enganam: downloads e pageviews não provam valor. {{Retenção}} é a métrica mais honesta.',
                'PMF é comportamento, não declaração: crescimento orgânico, retenção crescente e demanda maior que capacidade são os sinais reais.',
              ],
              nextChapterHint: 'Capítulo 3 · Modelo de Negócio e Unit Economics',
              nextChapterBlurb: 'Business Model Canvas, CAC, LTV e Growth Hacking — como saber se a unidade funciona antes de escalar.',
            },
          },

          // ── CHAPTER 3 ──────────────────────────────────────────────
          {
            id: 'M5-1-cap3',
            type: 'chapter',
            number: 3,
            title: 'Modelo de Negócio e Unit Economics',
            subtitle: 'Business Model Canvas, CAC, LTV e o funil AARRR — se a unidade não funciona, escalar é escalar o prejuízo',
            opening: {
              leadText: 'Unit economics é a análise financeira de {{uma unidade}} do seu negócio — 1 cliente, 1 transação, 1 produto. Se a unidade não dá lucro, escalar significa escalar o prejuízo. Nubank: CAC de R$ 30, LTV de R$ 1.200. WeWork: cada estação custava mais do que gerava. A diferença foi de bilhões.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'O Business Model Canvas (Osterwalder & Pigneur, 2010) mapeia o negócio inteiro em 9 blocos numa única página. Não substitui o plano de negócio — substitui o plano de negócio de {{200 páginas que ninguém lê}}. Cada bloco é uma hipótese a ser testada, não uma verdade a ser declarada.',
              },
              {
                kind: 'pillar-grid',
                title: 'Os 9 blocos do Business Model Canvas',
                pillars: [
                  { icon: '👥', title: 'Segmentos', description: 'Para quem criamos valor? {{Quem são os clientes mais importantes?}} Massa, nicho, plataforma multilateral?' },
                  { icon: '💎', title: 'Proposta de Valor', description: 'Que problema resolvemos? Por que o cliente nos escolhe e não o concorrente? {{Por que agora?}}' },
                  { icon: '📢', title: 'Canais', description: 'Como o cliente descobre, avalia, compra, recebe e obtém suporte? Direto vs. {{indireto}}.' },
                  { icon: '🤝', title: 'Relacionamento', description: 'Que tipo de relação cada segmento espera? Self-service, automatizado, {{comunidade}}?' },
                  { icon: '💵', title: 'Receita', description: 'Como o cliente paga? Venda direta, assinatura, freemium, comissão. Preço {{fixo vs. dinâmico}}.' },
                  { icon: '⚙️', title: 'Recursos-Chave', description: 'O que precisamos ter? Físicos, intelectuais ({{patentes}}, marca), humanos, financeiros.' },
                  { icon: '🔧', title: 'Atividades-Chave', description: 'O que precisamos fazer? Produção, resolução de problemas, {{plataforma/rede}}.' },
                  { icon: '🔗', title: 'Parcerias-Chave', description: 'Quem são os parceiros essenciais? Por que terceirizar? Otimização, risco ou {{recursos que não tenho}}.' },
                  { icon: '📊', title: 'Estrutura de Custos', description: 'Custos fixos vs. variáveis. Cost-driven (menor custo) vs. {{Value-driven}} (premium).' },
                ],
              },
              {
                kind: 'heading',
                text: 'Unit Economics — os números que provam se funciona',
              },
              {
                kind: 'paragraph',
                text: 'CAC (Customer Acquisition Cost): total gasto em marketing + vendas ÷ novos clientes. Armadilha: inclua {{todos os custos}} — salários do time, ferramentas, eventos. LTV (Lifetime Value): ticket médio × frequência × tempo de retenção. A métrica das métricas: {{LTV/CAC}}. Abaixo de 1 = cada cliente é prejuízo. Entre 3-5 = saudável. Acima de 5 = excelente — talvez esteja deixando crescimento na mesa.',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'AARRR — Acquisition',
                    period: 'Como o usuário te descobre?',
                    text: 'Canais: SEO, ads, indicação, PR, conteúdo, parcerias. Métrica: custo por lead, volume de leads qualificados. Pergunta crítica: "{{qual canal traz mais clientes ao menor CAC?}}" Não escale o canal mais fácil — escale o mais eficiente.',
                    caseStudy: {
                      company: 'Nubank',
                      year: 2014,
                      story: 'CAC de ~R$ 30 via indicação vs. {{R$ 800+ dos bancos tradicionais}} via TV e agências. A indicação viral não foi acidental — foi construída deliberadamente: produto tão bom que os clientes queriam indicar. Aquisição como consequência de produto.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'R$ 30', label: 'CAC Nubank (indicação)' },
                        { value: 'R$ 800+', label: 'CAC banco tradicional' },
                        { value: '26x', label: 'Vantagem de custo de aquisição' },
                      ],
                      insight: 'O canal mais barato de aquisição é o produto extraordinário que gera {{indicação espontânea}}. Antes de gastar em ads, pergunte: meus clientes indicam hoje? Se não — o problema não é aquisição.',
                    },
                  },
                  {
                    index: 2,
                    title: 'AARRR — Retention',
                    period: 'O usuário volta?',
                    text: 'A métrica mais importante — e a mais ignorada. Sem retenção, aquisição é {{balde furado}}. Regra: se retenção D30 < 20%, o produto não resolve o problema bem o suficiente. Não invista em aquisição antes de resolver retenção. É o erro mais caro das startups.',
                    caseStudy: {
                      company: 'iFood',
                      year: 2023,
                      story: 'Com pedido médio de R$ 45 e margem por pedido baixa, o modelo só funciona pela {{frequência}}: cliente médio faz 4+ pedidos/mês. A retenção não é "alguém vai usar de novo" — é "vai usar {{esta semana}}".',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'D30', label: 'Retenção 30 dias — a métrica de saúde' },
                        { value: '4x/mês', label: 'Frequência média iFood (modelo sustentável)' },
                        { value: '< 20%', label: 'Retenção D30 que indica produto não resolve' },
                      ],
                      insight: '{{DAU/MAU}} (usuários diários / mensais) revela a intensidade de uso: 50%+ = hábito formado. 20% = uso ocasional. 5% = produto dispensável.',
                    },
                  },
                  {
                    index: 3,
                    title: 'AARRR — Referral',
                    period: 'O usuário indica?',
                    text: 'O canal mais barato e confiável de aquisição. K > 1: cada cliente traz mais de 1 novo → crescimento viral orgânico. Dropbox: indicação = +500MB para o indicador e o indicado. {{Signups subiram 60%}} com o programa. A indicação não é sorte — é feature.',
                    caseStudy: {
                      company: 'Hotmail — 1996',
                      year: 1996,
                      story: '"PS: Get your free email at Hotmail" no rodapé de cada email enviado. {{12 milhões de usuários}} em 18 meses. Zero gasto em marketing. O produto se auto-distribuía a cada uso — o viral coefficient mais famoso da história da internet.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '12M', label: 'Usuários em 18 meses (Hotmail)' },
                        { value: 'K > 1', label: 'Viral coefficient para crescimento orgânico' },
                        { value: '+60%', label: 'Signups do programa de indicação Dropbox' },
                      ],
                      insight: 'Referral não é marketing — é produto. Se seus clientes não indicam, o produto não gerou valor suficiente. {{Corrija o produto antes de criar programa de indicação}}.',
                    },
                  },
                ],
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Compare 3 perfis de unit economics. Depois, classifique as 5 empresas no perfil que descreve sua situação.',
              compare: {
                columnHeaders: ['LTV/CAC ruim', 'LTV/CAC saudável', 'LTV/CAC excelente'],
                rows: [
                  {
                    label: 'Razão LTV/CAC',
                    values: ['< 1', '3 a 5', '> 5'],
                    viz: 'icons',
                    icons: ['◯', '◑', '●'],
                  },
                  {
                    label: 'Cada cliente',
                    values: ['Gera prejuízo', 'Gera lucro', 'Gera muito lucro'],
                    viz: 'icons',
                    icons: ['▦', '⊞', '◈'],
                  },
                  {
                    label: 'Sustentabilidade',
                    values: ['Inviável', 'Sustentável', 'Excelente'],
                    viz: 'bars',
                    intensities: [0.05, 0.55, 1.0],
                  },
                  {
                    label: 'Ação correta',
                    values: ['Parar / corrigir', 'Otimizar', 'Investir mais em CAC'],
                    viz: 'bars',
                    intensities: [0.1, 0.6, 1.0],
                  },
                ],
              },
              drag: {
                instruction: 'Toque na empresa, depois toque no perfil correto de unit economics:',
                zones: [
                  { id: 'ruim', label: 'LTV/CAC ruim' },
                  { id: 'saudavel', label: 'LTV/CAC saudável' },
                  { id: 'excelente', label: 'LTV/CAC excelente' },
                ],
                items: [
                  {
                    id: 'ue-nubank',
                    label: 'Nubank (early stage)',
                    sublabel: 'CAC: ~R$ 30 (indicação viral). LTV estimado: ~R$ 1.200 (cross-sell financeiro ao longo do tempo).',
                    correctZone: 'excelente',
                    correctFeedback: 'Correto. LTV/CAC ≈ 40x — excepcional. CAC praticamente zero (produto se vendia por indicação) e LTV crescendo com cross-sell (cartão → conta → empréstimo → investimento). Por isso cresceu sem anúncio.',
                    wrongFeedback: 'Repense. CAC de R$ 30 ÷ LTV de R$ 1.200 = razão de 40x. Isso é excelente — bem acima do limiar de 5x. O segredo: CAC quase zero por indicação + LTV crescente por cross-sell.',
                  },
                  {
                    id: 'ue-wework',
                    label: 'WeWork (no auge)',
                    sublabel: 'Custo por estação (reforma + aluguel): ~US$ 10K. Receita por estação antes do churn: ~US$ 8K.',
                    correctZone: 'ruim',
                    correctFeedback: 'Correto. LTV/CAC < 1 — cada estação gerava prejuízo. WeWork pagava mais para ter o espaço do que recebia de volta. Escalar esse modelo só acelerou as perdas. Resultado: US$ 40B → IPO cancelado.',
                    wrongFeedback: 'Repense. Custo > Receita por unidade = LTV/CAC < 1. Cada nova estação piorava a situação. Esse é o unit economics mais perigoso — parece crescimento, mas é multiplicação de prejuízo.',
                  },
                  {
                    id: 'ue-saas',
                    label: 'SaaS B2B hipotético',
                    sublabel: 'CAC: R$ 800 (time de vendas). Ticket: R$ 200/mês. Churn: 3%/mês. LTV = 200/0.03 = R$ 6.666.',
                    correctZone: 'saudavel',
                    correctFeedback: 'Correto. LTV/CAC = 6.666 / 800 = 8,3x — excelente tecnicamente. Mas churn de 3%/mês é preocupante (36%/ano). Monitorar: se churn subir para 5%, LTV cai para R$ 4K e o modelo se torna marginal.',
                    wrongFeedback: 'Repense. LTV = R$ 200 / 0,03 = R$ 6.666. Dividido por CAC de R$ 800 = 8,3x. Tecnicamente excelente, mas o churn de 3%/mês merece atenção — pequenas variações têm impacto enorme no LTV.',
                  },
                  {
                    id: 'ue-ifood',
                    label: 'iFood',
                    sublabel: 'CAC por usuário: ~R$ 50 (cupons + ads). Pedido médio: R$ 45. Margem por pedido: ~R$ 5. Frequência: 4 pedidos/mês. Retenção: 18 meses.',
                    correctZone: 'saudavel',
                    correctFeedback: 'Correto. LTV = R$ 5 × 4 × 18 = R$ 360. LTV/CAC = 360/50 = 7,2x — saudável. Margem por pedido é apertada, mas frequência alta compensa. O modelo funciona na escala.',
                    wrongFeedback: 'Repense. Margem por pedido baixa (R$ 5), mas frequência alta (4x/mês) e retenção de 18 meses resultam em LTV de R$ 360 vs CAC de R$ 50 = 7,2x. Saudável a excelente.',
                  },
                  {
                    id: 'ue-startup',
                    label: 'Startup com CAC alto e churn alto',
                    sublabel: 'CAC: R$ 1.200 (ads + demos + desconto no primeiro mês). Ticket: R$ 150/mês. Churn: 8%/mês. LTV = 150/0.08 = R$ 1.875.',
                    correctZone: 'saudavel',
                    correctFeedback: 'Correto. LTV/CAC = 1.875/1.200 = 1,56x — marginal. Funciona apenas se custos fixos forem muito baixos. O problema é o churn de 8%/mês (vida média de 12,5 meses). Reduzir churn para 4% duplica o LTV e muda tudo.',
                    wrongFeedback: 'Repense. LTV = R$ 150 / 0,08 = R$ 1.875. Dividido por CAC de R$ 1.200 = 1,56x. Marginal — não é ruim o suficiente para parar, mas não é sustentável sem reduzir CAC ou churn.',
                  },
                ],
              },
            },
            synthesis: {
              closingText: 'A regra de ouro: {{se a unidade não funciona, escalar não vai salvar — vai acelerar a falência}}. Corrija CAC, retenção ou margem antes de pisar no acelerador.',
              keyInsights: [
                'Business Model Canvas: cada bloco é hipótese, não verdade. Teste o mais arriscado primeiro.',
                'LTV/CAC > 3 = sustentável. > 5 = excelente. < 1 = cada cliente é prejuízo — {{pare de crescer e corrija a unidade}}.',
                'Retenção é o número mais honesto: se o usuário volta, o produto tem valor. Sem retenção, aquisição é balde furado.',
              ],
              nextChapterHint: 'Capítulo 4 · Financiamento, Pitch e Ecossistema',
              nextChapterBlurb: 'Fontes de capital por estágio, o pitch deck de 12 slides e o mapa do ecossistema de startups no Brasil.',
            },
          },

          // ── CHAPTER 4 ──────────────────────────────────────────────
          {
            id: 'M5-1-cap4',
            type: 'chapter',
            number: 4,
            title: 'Financiamento, Pitch e Ecossistema',
            subtitle: 'Do bootstrap ao VC — a fonte certa de capital no estágio certo, e como apresentar para investidores',
            opening: {
              leadText: 'Cada estágio do negócio tem fontes de capital adequadas. Usar a fonte errada no momento errado é {{tão perigoso quanto não ter capital}}. Um VC que investe em ideação sem validação desperdiça dinheiro. Um fundador que diluiu equity cedo demais perde o controle antes de precisar.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'A jornada de financiamento não é linear — é {{condicionada à validação}}. Não existe cheque para "ideia". Existe cheque para evidência de problema real, produto funcionando, tração mensurável. Cada rodada tem uma tese: o que o dinheiro vai provar?',
              },
              {
                kind: 'phase-group',
                cards: [
                  {
                    index: 1,
                    title: 'Estágio 1 — Ideação',
                    period: 'Pré-Revenue',
                    text: 'Fontes: Bootstrap (capital próprio), FFF (Friends, Family & Fools), Aceleradoras (R$ 50K-500K por 5-10% de equity + mentoria), Editais públicos (FINEP, FAPESP, BNDES Garagem). Regra: {{valide antes de buscar capital externo}}. Com dinheiro de aceleradora, você compra tempo para testar — não para construir o produto final.',
                    caseStudy: {
                      company: 'Hotmart — origem',
                      year: 2011,
                      story: 'João Pedro Resende e João Paulo Trajano criaram o Hotmart com {{recursos próprios}} e sem investidor externo por anos. Bootstrapping total até atingir escala suficiente para captar em condições favoráveis. Hoje: líder em infoprodutos na América Latina.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: 'R$ 50K-500K', label: 'Cheque típico de aceleradora (5-10% equity)' },
                        { value: '3-6 meses', label: 'Duração de programa de aceleração' },
                        { value: '0', label: 'Diluição no bootstrap — mas limita velocidade' },
                      ],
                      insight: 'Aceleradora não é só dinheiro — é {{rede, credibilidade e pressão produtiva}}. O mentor certo vale mais que o cheque.',
                    },
                  },
                  {
                    index: 2,
                    title: 'Estágio 2-3 — Validação a Crescimento',
                    period: 'Early Revenue → Tração',
                    text: 'Anjo (R$ 50K-500K): pessoa física, traz rede de contatos, menos burocracia. Seed VC (R$ 500K-5M): primeiro VC, foco em provar que o modelo escala. Série A (R$ 5-30M): escalar aquisição de clientes. Série B+ (R$ 30M+): expansão geográfica, novas linhas, domínio de mercado. Diluição: {{10-25% por rodada}} — é o preço da aceleração.',
                    caseStudy: {
                      company: 'QuintoAndar',
                      year: 2013,
                      story: 'Gabriel Braga começou com Anjo → Seed (Kaszek) → Série A → B → C. Cada rodada com {{tese clara}}: Anjo para validar o modelo, Seed para provar escala em SP, Série A para RJ e BH, B para Brasil inteiro. Resultado: US$ 5,1B de valuation.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '10-25%', label: 'Diluição típica por rodada de VC' },
                        { value: 'US$ 5,1B', label: 'Valuation QuintoAndar (2021)' },
                        { value: 'Tese', label: 'O que cada rodada precisa provar' },
                      ],
                      insight: 'Diluição: manter 10% de empresa de R$ 100M é melhor que 100% de empresa de R$ 1M. {{O bolo maior importa mais do que o tamanho da fatia.}}',
                    },
                  },
                  {
                    index: 3,
                    title: 'O Pitch de 12 Slides (Sequoia Capital)',
                    period: 'Como convencer investidores',
                    text: 'Um VC vê 200+ decks por mês. Gasta {{3 min 44 seg}} por deck em média (DocSend, 2023). Os 12 slides: Título, Problema (dado impactante + história), Solução (mostre, não conte), Por que agora?, Tamanho de mercado (TAM/SAM/{{SOM — o VC olha o SOM}}), Modelo de negócio, Tração, Competição (nunca diga "não temos concorrente"), Equipe, Go-to-market, Financeiro (3-5 anos com premissas), Ask (o que precisa e para quê).',
                    caseStudy: {
                      company: 'Airbnb — primeiro pitch',
                      year: 2009,
                      story: 'O pitch original do Airbnb para YCombinator tinha {{10 slides simples}}. Tração real: 10.000 usuários. A equipe já tinha passado por rejeição de 5 fundos antes. Paul Graham aceitou porque a ideia parecia "estranha mas os números eram reais." Tração honesta sempre supera narrativa bonita.',
                    },
                    deepDive: {
                      keyNumbers: [
                        { value: '3m 44s', label: 'Tempo médio de um VC por deck (DocSend 2023)' },
                        { value: '200+', label: 'Decks que um VC vê por mês' },
                        { value: 'SOM', label: 'O que o VC realmente quer ver no mercado' },
                      ],
                      insight: 'Erros que matam o pitch: TAM de "trilhões" sem SOM realista, "não temos concorrentes" (demonstra ingenuidade), projeção hockey stick sem {{premissas}}.',
                    },
                  },
                ],
              },
              {
                kind: 'paragraph',
                text: 'O ecossistema brasileiro em 2025: {{~15.000 startups}} ativas, 15 unicórnios, US$ 3,5B em VC. Os principais VCs: Kaszek (maior da AL — Nubank, QuintoAndar), Monashees (Rappi, Loggi), Canary (seed stage — maior deal flow). Programas públicos: BNDES Garagem, FINEP (subvenção econômica = dinheiro não reembolsável), FAPESP PIPE. {{Não aceite dinheiro de quem não agrega valor além do capital.}}',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Compare os 3 estágios de financiamento. Depois, classifique as 5 situações na fonte de capital mais adequada.',
              compare: {
                columnHeaders: ['Bootstrap / Anjo', 'Seed VC', 'Série A+'],
                rows: [
                  {
                    label: 'Cheque típico',
                    values: ['Até R$ 500K', 'R$ 500K–5M', 'R$ 5M+'],
                    viz: 'icons',
                    icons: ['◯', '◑', '●'],
                  },
                  {
                    label: 'O que prova',
                    values: ['Problema existe', 'Modelo escala', 'Crescimento acelerado'],
                    viz: 'icons',
                    icons: ['▦', '⊞', '◈'],
                  },
                  {
                    label: 'Diluição',
                    values: ['0-15%', '15-25%', '20-30%'],
                    viz: 'bars',
                    intensities: [0.2, 0.55, 1.0],
                  },
                  {
                    label: 'Velocidade',
                    values: ['Lenta', 'Média', 'Alta'],
                    viz: 'bars',
                    intensities: [0.2, 0.6, 1.0],
                  },
                ],
              },
              drag: {
                instruction: 'Toque na situação, depois toque na fonte de capital mais adequada:',
                zones: [
                  { id: 'bootstrap', label: 'Bootstrap / Anjo' },
                  { id: 'seed', label: 'Seed VC' },
                  { id: 'serieA', label: 'Série A+' },
                ],
                items: [
                  {
                    id: 'fin-bootstrap',
                    label: 'Ideia validada, sem receita',
                    sublabel: 'Fundador com protótipo funcional e 50 entrevistas validando o problema. Sem receita ainda. Quer R$ 200K para construir o MVP real e testar com primeiros pagantes.',
                    correctZone: 'bootstrap',
                    correctFeedback: 'Correto. Sem receita, problema validado mas modelo não testado — estágio de Anjo ou aceleradora. VC Seed pede tração inicial. Bootstrap ou anjo é a fonte certa para essa fase.',
                    wrongFeedback: 'Repense. Sem receita e com protótipo, o empreendedor ainda está validando o modelo — não provando escala. VC Seed quer ver primeiros clientes pagantes. Anjo ou aceleradora é a fonte certa.',
                  },
                  {
                    id: 'fin-seed',
                    label: 'SaaS com R$ 50K de MRR',
                    sublabel: 'SaaS com 80 clientes, R$ 50K de MRR crescendo 15% ao mês, churn de 3%. Quer provar que o modelo é replicável em 3 estados e precisa de R$ 2M.',
                    correctZone: 'seed',
                    correctFeedback: 'Correto. R$ 50K de MRR com crescimento consistente e churn controlado é o perfil clássico de Seed. O objetivo do capital: provar que o modelo funciona em outros mercados além do inicial.',
                    wrongFeedback: 'Repense. R$ 50K de MRR é tração suficiente para Seed, mas não é a tração que Série A pede (geralmente R$ 500K+ de MRR). O objetivo é provar replicabilidade — Seed VC é a fonte adequada.',
                  },
                  {
                    id: 'fin-serieA',
                    label: 'Fintech com R$ 5M de ARR',
                    sublabel: 'Fintech com 15.000 clientes ativos, R$ 5M de ARR, crescendo 30% ao mês. Provada em 2 estados. Quer expandir para todo o Brasil e contratar 40 pessoas em 12 meses.',
                    correctZone: 'serieA',
                    correctFeedback: 'Correto. R$ 5M de ARR, crescimento de 30% ao mês e modelo provado em 2 estados é o perfil de Série A. O objetivo: escalar aquisição e expandir geograficamente com capital maior.',
                    wrongFeedback: 'Repense. R$ 5M de ARR e crescimento de 30%/mês é maturidade além do Seed. A empresa já provou o modelo — agora precisa de capital para escalar. Isso é Série A.',
                  },
                  {
                    id: 'fin-edital',
                    label: 'Deep tech em fase de pesquisa',
                    sublabel: 'Startup de biotech desenvolvendo diagnóstico por IA. Equipe de pesquisadores, sem produto ainda. Precisa de R$ 300K para 18 meses de pesquisa e desenvolvimento.',
                    correctZone: 'bootstrap',
                    correctFeedback: 'Correto. Deep tech em pesquisa é exatamente o perfil dos editais públicos (FINEP, FAPESP PIPE, BNDES Garagem) — dinheiro não reembolsável para inovação de alto risco. VC não entra em pesquisa sem produto.',
                    wrongFeedback: 'Repense. Sem produto e em fase de pesquisa, VC Seed não investe — o risco é alto demais sem evidência de produto. Editais públicos (FINEP, FAPESP) são a fonte certa: dinheiro não reembolsável para pesquisa de inovação.',
                  },
                  {
                    id: 'fin-seed2',
                    label: 'Marketplace com primeiro PMF',
                    sublabel: 'Marketplace de serviços com R$ 80K de GMV/mês, crescendo após 18 meses de iteração. Quer R$ 1,5M para automatizar matching e expandir para 3 cidades.',
                    correctZone: 'seed',
                    correctFeedback: 'Correto. PMF confirmado, GMV crescendo e expansão geográfica como objetivo — Seed VC. O capital vai financiar o crescimento do que já funciona, não validar se funciona.',
                    wrongFeedback: 'Repense. R$ 80K de GMV/mês com PMF confirmado é tração de Seed — o modelo funciona, precisa de capital para replicar. Série A pediria tração bem maior antes de entrar.',
                  },
                ],
              },
            },
            synthesis: {
              closingText: 'Capital é combustível — mas {{sem direção, acelera na direção errada}}. A fonte certa no momento certo é estratégia. Não aceite dinheiro de quem não agrega valor além do cheque — o investidor errado pode ser mais destrutivo do que a falta de capital.',
              keyInsights: [
                'Valide antes de buscar capital externo: sem evidência de problema real, nenhum investidor sério vai entrar.',
                'Diluição é o preço da velocidade: manter 10% de empresa grande é melhor que 100% de empresa pequena — o tamanho do bolo importa mais.',
                'O pitch não vende a ideia — vende a {{equipe e a evidência}}. Tração honesta supera narrativa bonita.',
              ],
            },
          },
        ],
      },
      {
        id: 'M5-2',
        title: 'Ambiente Macroeconomico',
        blocks: [
          {
            id: 'M5-2-cap1',
            type: 'chapter',
            number: 1,
            title: 'Os 5 Indicadores — Lendo o Ambiente',
            subtitle: 'PIB, IPCA, Selic, câmbio e desemprego: o painel que nenhum gestor pode ignorar.',
            opening: {
              leadText: 'Macroeconomia é o ambiente externo que afeta todas as empresas ao mesmo tempo. Você não controla inflação, juros ou câmbio — mas precisa saber lê-los para decidir quando investir, quando proteger e quando esperar.',
            },
            body: [
              {
                kind: 'pillar-grid',
                title: 'Os 5 indicadores fundamentais',
                pillars: [
                  { icon: '📊', title: 'PIB', description: 'Soma de tudo que o país produz. Crescendo = mercado expandindo. Caindo 2 trimestres = {{recessão técnica}} → prepare caixa.' },
                  { icon: '🔥', title: 'IPCA', description: 'Taxa de inflação oficial. Alta → BC sobe juros → crédito caro → consumo cai. Acompanhe pelo {{IBGE mensalmente}}.' },
                  { icon: '🏦', title: 'Selic', description: 'Juros básicos definidos pelo COPOM. Alta = empréstimos caros, priorize caixa. {{Baixa = crédito barato, invista e expanda}}.' },
                  { icon: '💱', title: 'Câmbio', description: 'Real fraco = importações caras, exportações competitivas. Real forte = importações baratas, exportações perdem margem.' },
                  { icon: '👷', title: 'Desemprego', description: 'Alto = consumo fraco + mão de obra disponível. Baixo = consumo forte + {{guerra por talentos}} e pressão salarial.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Política Monetária e Fiscal',
              },
              {
                kind: 'paragraph',
                text: 'O Banco Central usa a Selic para controlar inflação: sobe juros para frear preços, desce para estimular a economia. O governo usa política fiscal — gastar mais estimula no curto prazo, mas pode pressionar inflação. Quando as duas políticas conflitam (governo expansionista + BC contracionista), o resultado é {{juros altos com crescimento baixo}}: o pior cenário para empresas.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada indicador sinaliza uma ação diferente. Classifique cada cenário na estratégia correta para o gestor.',
              compare: {
                columnHeaders: ['Sinal de Alerta', 'Impacto Direto', 'Ação do Gestor'],
                rows: [
                  { label: 'PIB', values: ['2 tri negativos = recessão', 'Consumo cai, mercado encolhe', 'Proteger caixa, cortar risco'], viz: 'icons' },
                  { label: 'IPCA acima da meta', values: ['BC eleva a Selic', 'Crédito fica caro, vendas caem', 'Revisar precificação e estoques'], viz: 'icons' },
                  { label: 'Selic alta', values: ['CDI sobe junto', 'Dívida pós-fixada fica cara', 'Renegociar para prefixado'], viz: 'bars' },
                  { label: 'Dólar alto', values: ['Insumos importados sobem', 'Margem de importadores cai', 'Buscar fornecedores nacionais'], viz: 'bars' },
                  { label: 'Desemprego baixo', values: ['Concorrência por talentos', 'Salários pressionados', 'Investir em retenção e upskilling'], viz: 'icons' },
                ],
              },
              drag: {
                instruction: 'Toque no cenário, depois toque na estratégia correta para o gestor:',
                zones: [
                  { id: 'expandir', label: 'Expandir agora' },
                  { id: 'proteger', label: 'Proteger caixa' },
                  { id: 'renegociar', label: 'Renegociar dívidas' },
                ],
                items: [
                  {
                    id: 'cen-pib-crescendo',
                    label: 'PIB crescendo 3% ao ano',
                    sublabel: 'Desemprego em queda, Selic em 10% (baixa histórica), crédito farto no mercado.',
                    correctZone: 'expandir',
                    correctFeedback: 'Correto. PIB crescendo + Selic baixa + desemprego caindo = ciclo de expansão. Invista, contrate, lance produtos — mas mantenha reserva.',
                    wrongFeedback: 'Repense. PIB crescendo + Selic baixa + desemprego caindo = ciclo de expansão. A estratégia certa é crescer com a maré, não proteger na bonança.',
                  },
                  {
                    id: 'cen-selic-alta',
                    label: 'Selic sobe de 10% para 14%',
                    sublabel: 'Empresa tem R$ 400K em dívida pós-fixada (CDI). Vendas começaram a cair.',
                    correctZone: 'renegociar',
                    correctFeedback: 'Correto. Selic alta encarece dívida pós-fixada rapidamente. O momento é renegociar para taxa prefixada antes de o aperto se agravar — renegociar durante o pico custa mais.',
                    wrongFeedback: 'Repense. Com Selic subindo e dívida pós-fixada, cada ponto percentual aumenta seu custo financeiro. Renegociar agora, antes do pico, é mais barato.',
                  },
                  {
                    id: 'cen-recessao',
                    label: 'PIB recua pelo 2º trimestre consecutivo',
                    sublabel: 'Inflação ainda alta, crédito restrito, demissões no mercado aumentando.',
                    correctZone: 'proteger',
                    correctFeedback: 'Correto. Recessão técnica + crédito restrito = momento de preservar liquidez. Corte o não-essencial, renegocie contratos e prepare-se para oportunidades que aparecem na crise.',
                    wrongFeedback: 'Repense. PIB negativo por 2 trimestres é recessão técnica. Expandir nesse ambiente é arriscar caixa quando o mercado está encolhendo. Proteja, depois expanda no vale.',
                  },
                  {
                    id: 'cen-dolar-alto',
                    label: 'Dólar sobe 25% em 6 meses',
                    sublabel: 'Empresa importa 40% dos insumos. Margem bruta caiu de 35% para 22%.',
                    correctZone: 'renegociar',
                    correctFeedback: 'Correto. Câmbio desfavorável para importadores exige renegociação: fornecedores nacionais, contratos em reais ou hedge cambial para travar o custo.',
                    wrongFeedback: 'Repense. Dólar alto destrói margem de quem importa insumos. A prioridade é renegociar a cadeia de suprimentos — antes de expandir.',
                  },
                  {
                    id: 'cen-vale',
                    label: 'BC começa a cortar juros',
                    sublabel: 'PIB estabilizando, inflação cedendo. Concorrentes fragilizados pela recessão anterior.',
                    correctZone: 'expandir',
                    correctFeedback: 'Correto. O vale do ciclo é o melhor momento para expandir: ativos estão baratos, crédito vai ficar mais barato, e concorrentes enfraquecidos abrem espaço.',
                    wrongFeedback: 'Repense. BC cortando juros com inflação cedendo = vale do ciclo — a janela de comprar ativos baratos e se posicionar para a próxima expansão.',
                  },
                ],
              },
            },
            synthesis: {
              closingText: 'Macroeconomia não é para prever o futuro — é para {{não ser pego de surpresa}}. Quem lê os indicadores com antecedência renegocia dívidas no pico, expande no vale e protege caixa na contração.',
              keyInsights: [
                'Os 5 indicadores (PIB, IPCA, Selic, câmbio, desemprego) formam um painel. Leia o conjunto, não cada um isolado.',
                'Selic alta = priorize caixa. Selic baixa = invista. {{Esta regra simples evita os erros mais caros}}.',
                'Política monetária e fiscal em conflito = pior cenário. Aprenda a identificar quando as duas estão alinhadas vs. brigando.',
              ],
            },
          },
          {
            id: 'M5-2-cap2',
            type: 'chapter',
            number: 2,
            title: 'Ciclos Econômicos — Quando Expandir e Quando Proteger',
            subtitle: 'A economia oscila em 4 fases. A estratégia certa no momento errado é a estratégia errada.',
            opening: {
              leadText: 'A economia não cresce em linha reta — oscila entre expansão e contração em ciclos previsíveis. Entender em qual fase estamos não é adivinhação: é leitura de indicadores. E essa leitura determina se você vai crescer ou sobreviver.',
            },
            body: [
              {
                kind: 'step-flow',
                title: 'As 4 fases do ciclo econômico',
                steps: [
                  { number: 1, title: 'Expansão', description: 'PIB crescendo, desemprego caindo, crédito farto, otimismo no mercado. {{Investir, expandir, contratar, lançar produtos}} — mas construa reserva. A festa acaba.' },
                  { number: 2, title: 'Pico', description: 'Inflação subindo, ativos caros (bolsa, imóveis em alta), euforia generalizada. {{Preparar caixa, reduzir dívida variável}}. "Desta vez é diferente" é a frase mais perigosa.' },
                  { number: 3, title: 'Contração', description: 'PIB caindo, demissões, crédito restrito, pessimismo. {{Proteger caixa, cortar não-essencial, renegociar contratos}}. Quem tem caixa compra o futuro barato.' },
                  { number: 4, title: 'Vale', description: 'PIB estabilizando, inflação cedendo, BC começa a cortar juros. {{Posicionar para a próxima expansão}} — investir enquanto está barato. Esperar demais perde a janela.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Indicadores que Antecipam a Mudança de Fase',
              },
              {
                kind: 'paragraph',
                text: 'Curva de juros invertida (juros curtos > longos) antecipa recessão em 12–18 meses com 80% de acerto. PMI abaixo de 50 = contração industrial. Confiança do consumidor caindo = consumo vai cair em 3–6 meses. {{Esses sinais chegam antes}} — quem lê, prepara. Quem ignora, reage tarde.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada situação de mercado corresponde a uma fase do ciclo. Identifique a fase correta para cada cenário.',
              compare: {
                columnHeaders: ['O que fazer', 'Oportunidade escondida', 'Maior erro'],
                rows: [
                  { label: 'Expansão', values: ['Investir, contratar, lançar', 'Construir reserva enquanto fatura alto', 'Alavancar demais no otimismo'], viz: 'icons' },
                  { label: 'Pico', values: ['Preparar caixa, reduzir dívida variável', 'Vender ativos no topo com lucro máximo', 'Acreditar que o crescimento é eterno'], viz: 'icons' },
                  { label: 'Contração', values: ['Proteger caixa, cortar não-essencial', 'Aquisições baratas + talentos disponíveis', 'Cortar investimento em inovação'], viz: 'bars' },
                  { label: 'Vale', values: ['Posicionar para próxima expansão', 'Ativos e empresas no preço mínimo', 'Esperar demais, perder a janela'], viz: 'bars' },
                ],
              },
              drag: {
                instruction: 'Toque na situação, depois toque na fase do ciclo em que ela ocorre:',
                zones: [
                  { id: 'expansao', label: 'Expansão' },
                  { id: 'contracao', label: 'Contração' },
                  { id: 'vale', label: 'Vale' },
                ],
                items: [
                  {
                    id: 'sit-bolsa-recorde',
                    label: 'Bolsa em recorde histórico',
                    sublabel: 'Ibovespa bate novo topo, imóveis valorizando 20%/ano, manchetes celebrando o "boom".',
                    correctZone: 'expansao',
                    correctFeedback: 'Correto. Ativos em alta com euforia é sinal de expansão avançando para o pico. Momento de construir reserva e reduzir risco — a euforia precede a queda.',
                    wrongFeedback: 'Repense. Bolsa em recorde com euforia = expansão no auge ou pico. Não é hora de dobrar a aposta — é hora de preparar caixa para a contração.',
                  },
                  {
                    id: 'sit-demissoes',
                    label: 'Demissões em massa no setor',
                    sublabel: 'Grandes empresas cortam 15-20% do quadro. Crédito restrito, consumo retraído.',
                    correctZone: 'contracao',
                    correctFeedback: 'Correto. Demissões generalizadas + crédito restrito = contração. Momento de proteger caixa — e capturar talentos qualificados disponíveis a custo menor.',
                    wrongFeedback: 'Repense. Demissões em massa + crédito restrito indicam contração. Proteja o não-essencial E fique de olho em oportunidades de aquisição e contratação.',
                  },
                  {
                    id: 'sit-bc-cortando',
                    label: 'BC anuncia 3º corte consecutivo da Selic',
                    sublabel: 'Inflação abaixo da meta, PIB voltando a crescer levemente após recessão.',
                    correctZone: 'vale',
                    correctFeedback: 'Correto. BC cortando juros com inflação cedendo = saída do vale. Janela de posicionamento para a próxima expansão — investir agora é comprar no desconto.',
                    wrongFeedback: 'Repense. BC cortando Selic com inflação cedendo = fundo do ciclo (vale). Melhor momento para investir: ativos ainda baratos, mas crédito ficando mais acessível.',
                  },
                  {
                    id: 'sit-pmi-abaixo',
                    label: 'PMI industrial abaixo de 50 por 3 meses seguidos',
                    sublabel: 'Pedidos caindo, estoques acumulando, empresas adiando investimentos.',
                    correctZone: 'contracao',
                    correctFeedback: 'Correto. PMI abaixo de 50 = indústria em contração. Três meses seguidos indicam tendência, não ruído. Hora de proteger, não expandir.',
                    wrongFeedback: 'Repense. PMI abaixo de 50 = atividade industrial contraindo. Sustentado por 3 meses = tendência clara. Contração — proteja o caixa.',
                  },
                  {
                    id: 'sit-desemprego-minimo',
                    label: 'Desemprego em mínima histórica',
                    sublabel: 'Taxa a 5%, empresas relatando dificuldade de contratar, salários subindo.',
                    correctZone: 'expansao',
                    correctFeedback: 'Correto. Desemprego mínimo + guerra por talentos + salários em alta = expansão plena. Invista em retenção e eficiência — e prepare caixa porque o pico está próximo.',
                    wrongFeedback: 'Repense. Desemprego mínimo com pressão salarial = mercado aquecido = expansão. A outra face: custo de pessoal sobe, comprimindo margens antes da desaceleração.',
                  },
                ],
              },
            },
            synthesis: {
              closingText: 'A regra de Buffett funciona porque é contraintuitiva: {{tenha medo quando os outros são gananciosos e seja ganancioso quando os outros têm medo}}. O ciclo econômico transforma covardia em inteligência — se você ler a fase certa.',
              keyInsights: [
                'Expansão: invista, mas guarde reserva. Pico: venda ativos, reduza dívida. Contração: preserve caixa. Vale: compre o futuro barato.',
                'Indicadores antecipam a virada: curva invertida → recessão em 12-18 meses. {{Quem espera o PIB cair para proteger, chegou tarde}}.',
                'Na contração, concorrentes enfraquecem, talentos ficam disponíveis e ativos ficam baratos. Caixa na crise é poder.',
              ],
            },
          },
          {
            id: 'M5-2-cap3',
            type: 'chapter',
            number: 3,
            title: 'Brasil — Estrutura, Desafios e Oportunidades',
            subtitle: 'Da reforma tributária ao agronegócio: entender o Brasil é vantagem competitiva.',
            opening: {
              leadText: 'O Brasil é a 9ª maior economia do mundo com paradoxos únicos: maior biodiversidade do planeta + carga tributária entre as mais complexas. Maior produtor de alimentos + 120 dias para abrir empresa. Entender esses paradoxos é o primeiro passo para transformá-los em vantagem.',
            },
            body: [
              {
                kind: 'paragraph',
                text: 'Serviços representam {{70% do PIB}} (comércio, finanças, TI, saúde, educação). Indústria: 22%. Agropecuária: apenas 8% do PIB — mas 25% das exportações. Esse desequilíbrio revela onde estão as vantagens comparativas brasileiras: produzimos alimentos com eficiência global.',
              },
              {
                kind: 'pillar-grid',
                title: '5 desafios estruturais do Brasil',
                pillars: [
                  { icon: '📋', title: 'Carga tributária complexa', description: '33% do PIB em impostos + 1.500 horas/ano de compliance (pior do mundo). {{Reforma Tributária (EC 132/2023)}} simplifica em 10 anos.' },
                  { icon: '🚧', title: 'Infraestrutura deficiente', description: 'Custo logístico: 12% do PIB vs. 8% nos EUA. Rodovias precárias encarecem tudo. Oportunidade: concessões e PPPs.' },
                  { icon: '⚖️', title: 'Desigualdade extrema', description: 'Gini 0,52 — 10% mais ricos detêm 59% da renda. Mercado fragmentado: luxo e base da pirâmide crescem, classe média encolhe.' },
                  { icon: '💳', title: 'Custo de capital alto', description: 'Spread bancário ~20pp acima da Selic. Empréstimos caros {{desincentivam investimento produtivo}}.' },
                  { icon: '🗂️', title: 'Burocracia', description: '120 dias para abrir empresa (vs. 1 dia na Estônia). Regulação incerta afasta investimento de longo prazo.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Reforma Tributária — O que Muda',
              },
              {
                kind: 'paragraph',
                text: '5 tributos (PIS, COFINS, IPI, ICMS, ISS) viram 2 (CBS federal + IBS estadual) formando o IVA. Princípio: não-cumulatividade plena e cobrança no destino. {{Serviços pagam mais}} (de ISS de 2-5% para ~26,5%). {{Indústria paga menos}} (fim da cascata). Transição: 2026 a 2033.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'A Reforma Tributária impacta setores de formas muito diferentes. Classifique cada setor pelo impacto esperado.',
              compare: {
                columnHeaders: ['Antes (sistema atual)', 'Depois (IVA)', 'Impacto para o setor'],
                rows: [
                  { label: 'Serviços', values: ['ISS: 2–5%', 'IVA: ~26,5%', 'Carga aumenta significativamente'], viz: 'bars' },
                  { label: 'Indústria', values: ['ICMS+IPI+PIS: 30–45% cascata', 'IVA: ~26,5% com crédito pleno', 'Carga cai + elimina guerra fiscal'], viz: 'bars' },
                  { label: 'Comércio', values: ['ICMS com substituição tributária', 'IVA com crédito pleno', 'Menos burocracia, mais previsibilidade'], viz: 'icons' },
                  { label: 'Exportações', values: ['Sem IVA sobre exportações', 'Mantido — exportações isentas', 'Sem mudança estrutural'], viz: 'icons' },
                ],
              },
              drag: {
                instruction: 'Toque no cenário, depois toque em como a Reforma Tributária afeta aquele setor:',
                zones: [
                  { id: 'paga-mais', label: 'Paga mais impostos' },
                  { id: 'paga-menos', label: 'Paga menos impostos' },
                  { id: 'neutro', label: 'Impacto neutro' },
                ],
                items: [
                  {
                    id: 'ref-consultoria',
                    label: 'Empresa de consultoria',
                    sublabel: 'Hoje paga ISS de 5%. Quase nenhum insumo tributável para gerar crédito no IVA.',
                    correctZone: 'paga-mais',
                    correctFeedback: 'Correto. Consultoria paga mais: ISS de 5% vai para IVA de ~26,5%. Com poucos insumos tributáveis, tem menos créditos para compensar. O preço dos serviços tende a subir.',
                    wrongFeedback: 'Repense. Serviços de consultoria têm poucos insumos tributáveis. ISS de 5% → IVA ~26,5% sem créditos suficientes = aumento real de carga.',
                  },
                  {
                    id: 'ref-industria-metal',
                    label: 'Indústria metalúrgica',
                    sublabel: 'Hoje recolhe ICMS + IPI + PIS/COFINS em cascata sobre insumos, embalagem e produto final.',
                    correctZone: 'paga-menos',
                    correctFeedback: 'Correto. Indústria paga menos: a cascata de 30-45% efetivo é substituída por IVA de ~26,5% com crédito pleno. Fim da guerra fiscal entre estados.',
                    wrongFeedback: 'Repense. A indústria sofre com cascata tributária hoje. O IVA com crédito pleno elimina essa cascata — carga efetiva cai para a maioria das indústrias.',
                  },
                  {
                    id: 'ref-exportadora',
                    label: 'Exportadora de soja',
                    sublabel: 'Vende 100% para o exterior. Hoje já tem imunidade de ICMS sobre exportações.',
                    correctZone: 'neutro',
                    correctFeedback: 'Correto. Exportações já são isentas hoje e continuarão isentas no novo sistema. O IVA não incide na saída do país — impacto neutro para exportadores.',
                    wrongFeedback: 'Repense. Exportações são isentas no modelo IVA (princípio do destino: imposto fica no local de consumo). Situação similar à atual.',
                  },
                  {
                    id: 'ref-restaurante',
                    label: 'Rede de restaurantes',
                    sublabel: 'Hoje no Simples Nacional com ISS reduzido. Insumos alimentares terão alíquota zerada no IVA.',
                    correctZone: 'neutro',
                    correctFeedback: 'Correto. Restaurantes têm situação mista: serviço paga mais, mas insumos alimentares ficam com alíquota zero. O equilíbrio entre os dois tende a impacto neutro para a maioria.',
                    wrongFeedback: 'Repense. Restaurantes têm dois lados: serviço (paga mais) e insumos alimentares (alíquota zero). O equilíbrio tende a impacto neutro para a maioria das operações.',
                  },
                  {
                    id: 'ref-varejista',
                    label: 'Varejista com loja física',
                    sublabel: 'Hoje lida com substituição tributária complexa do ICMS por estado.',
                    correctZone: 'paga-menos',
                    correctFeedback: 'Correto. Para o varejo, o maior ganho é simplificação: fim da substituição tributária e unificação de regras. Custo de compliance cai — o que é ganho real.',
                    wrongFeedback: 'Repense. Para o varejo, o ganho principal é simplificação. Fim da substituição tributária e unificação de regras por estado reduz custo de compliance significativamente.',
                  },
                ],
              },
            },
            synthesis: {
              closingText: 'O Brasil exige uma leitura dupla: {{os desafios são reais, mas as oportunidades estão exatamente onde os outros desistem}}. Energia renovável, agro-tech, economia digital e biodiversidade são vantagens competitivas globais ainda sendo exploradas.',
              keyInsights: [
                'Reforma Tributária: serviços pagam mais, indústria paga menos. Simule o impacto na sua empresa antes de 2026.',
                'Brasil tem 5 desafios estruturais e 5 oportunidades globais. Conhecer os dois é diferencial estratégico para qualquer gestor.',
                '{{Vantagem comparativa não é sorte — é decisão}}. O Brasil domina agro, energia limpa e biodiversidade. Onde sua empresa pode ancorar nisso?',
              ],
            },
          },
          {
            id: 'M5-2-cap4',
            type: 'chapter',
            number: 4,
            title: 'Trabalho e Dinheiro — O Sistema que Move o Negócio',
            subtitle: 'Mercado de trabalho em transformação + sistema financeiro: o que todo gestor precisa dominar.',
            opening: {
              leadText: 'Dois sistemas determinam a capacidade operacional de qualquer empresa: o mercado de trabalho (de onde vêm as pessoas) e o sistema financeiro (de onde vêm os recursos). Ambos estão em transformação acelerada — e quem entende as regras novas leva vantagem.',
            },
            body: [
              {
                kind: 'step-flow',
                title: 'As 5 transformações do mercado de trabalho',
                steps: [
                  { number: 1, title: 'Escassez de talento qualificado', description: 'Desemprego geral: 6,5%. Desemprego em tech: ~1%. Paradoxo: milhões desempregados, empresas sem candidato. Solução: {{upskilling interno}} — mais barato que competir por pronto.' },
                  { number: 2, title: 'Trabalho híbrido como padrão', description: '38% dos qualificados operam em modelo híbrido. Empresas 100% presenciais perdem candidatos. Dado: {{híbrido retém 12% mais talentos}} (McKinsey 2024).' },
                  { number: 3, title: 'Gig economy e pejotização', description: '25M trabalhadores informais. Pejotização reduz encargos mas cria {{risco jurídico}} se relação é subordinada e contínua.' },
                  { number: 4, title: 'Diversidade como resultado', description: 'Empresas com diversidade étnica: {{36% mais chance}} de superar a média (McKinsey). Diversidade de gênero na liderança: 25% mais lucratividade.' },
                  { number: 5, title: 'IA não substitui empregos — substitui tarefas', description: '30% das tarefas atuais podem ser automatizadas. A pergunta certa: "{{alguém usando IA vai substituir quem não usa}}" — e a resposta é sim.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Sistema Financeiro — O que o Gestor Precisa Saber',
              },
              {
                kind: 'paragraph',
                text: 'BCB define a Selic e opera o PIX (2,4 bilhões de transações/mês). Big 5 bancos concentram 80% dos ativos. Nubank com {{100M+ clientes}} e fintechs forçaram custo zero em contas. Open Banking permite comparar crédito de múltiplos bancos automaticamente. Regra de caixa: mínimo 3-6 meses de despesas em CDB 100% CDI — {{nunca em cheque especial}} (>300%/ano).',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Gestão financeira e trabalhista exige decisões certas. Classifique cada situação como correta, errada ou arriscada.',
              compare: {
                columnHeaders: ['Instrumento', 'Risco', 'Quando usar'],
                rows: [
                  { label: 'CDB 100% CDI', values: ['Baixo (garantido FGC até R$ 250K)', 'Liquidez diária disponível', 'Reserva operacional da empresa'], viz: 'bars' },
                  { label: 'Debêntures', values: ['Médio (risco da empresa emissora)', 'Prazo definido (1–5 anos)', 'Capital excedente, não reserva'], viz: 'bars' },
                  { label: 'Cheque especial', values: ['Altíssimo (>300%/ano)', 'Liquidez imediata', 'Nunca — substitua por capital de giro'], viz: 'icons' },
                  { label: 'PIX Cobrança', values: ['Nenhum (Banco Central)', 'Liquidação imediata', 'Substituir boleto — sem custo'], viz: 'icons' },
                ],
              },
              drag: {
                instruction: 'Toque na situação financeira, depois toque na decisão correta do gestor:',
                zones: [
                  { id: 'certo', label: 'Decisão correta' },
                  { id: 'errado', label: 'Decisão errada' },
                ],
                items: [
                  {
                    id: 'fin-cheque',
                    label: 'Usar cheque especial para cobrir folha de pagamento',
                    sublabel: 'Empresa tem déficit de caixa temporário. Cheque especial está disponível.',
                    correctZone: 'errado',
                    correctFeedback: 'Correto — é decisão errada. Cheque especial passa de 300%/ano. Alternativa: antecipação de recebíveis (1,5–4%/mês) ou capital de giro negociado.',
                    wrongFeedback: 'Repense. Cheque especial passa de 300%/ano de juros. Usar para cobrir folha é um dos erros mais caros. Antecipação de recebíveis ou FGI são alternativas muito mais baratas.',
                  },
                  {
                    id: 'fin-cdb',
                    label: 'Manter 4 meses de despesas em CDB com liquidez diária',
                    sublabel: 'Empresa lucrativa, sem dívidas. Gestor mantém reserva operacional aplicada.',
                    correctZone: 'certo',
                    correctFeedback: 'Correto. 3-6 meses de reserva em CDB 100% CDI com liquidez diária é a regra de ouro. Protege contra sazonalidade, inadimplência e imprevistos.',
                    wrongFeedback: 'Repense. Manter reserva operacional em CDB com liquidez diária é gestão de caixa básica e correta. 3-6 meses de despesas fixas protege contra qualquer interrupção de receita.',
                  },
                  {
                    id: 'fin-pejotizacao',
                    label: 'Contratar 5 funcionários de tempo integral como PJ',
                    sublabel: 'Empresa quer reduzir encargos. Trabalharão exclusivamente para ela, com horário definido.',
                    correctZone: 'errado',
                    correctFeedback: 'Correto — arriscado. Relação subordinada, contínua e exclusiva configura vínculo empregatício mesmo com contrato PJ. Alto risco de passivo trabalhista em fiscalização.',
                    wrongFeedback: 'Repense. Pejotização de relação subordinada (horário fixo, exclusividade, continuidade) é zona cinzenta com alto risco jurídico. A Justiça do Trabalho reconhece o vínculo mesmo com contrato PJ.',
                  },
                  {
                    id: 'fin-openbanking',
                    label: 'Usar Open Banking para comparar ofertas de crédito',
                    sublabel: 'Empresa precisa de capital de giro. Compartilha dados financeiros com 3 bancos.',
                    correctZone: 'certo',
                    correctFeedback: 'Correto. Open Banking foi feito exatamente para isso: aumentar poder de negociação do tomador. Comparar ofertas de múltiplos bancos automaticamente reduz spread.',
                    wrongFeedback: 'Repense. Open Banking permite que você compartilhe seu histórico com vários bancos e receba propostas competitivas. Resultado: juros menores e melhores condições.',
                  },
                  {
                    id: 'fin-debenture',
                    label: 'Investir reserva de caixa em debêntures de 3 anos',
                    sublabel: 'Empresa tem R$ 200K de reserva operacional. Gestor quer mais rentabilidade.',
                    correctZone: 'errado',
                    correctFeedback: 'Correto — errado para reserva operacional. Debêntures têm prazo definido e baixa liquidez. Reserva precisa estar disponível imediatamente. Use debêntures para capital excedente, não emergencial.',
                    wrongFeedback: 'Repense. Reserva operacional deve ter liquidez imediata. Debêntures de 3 anos bloqueiam o capital — se surgir emergência, você não consegue resgatar sem perda.',
                  },
                ],
              },
            },
            synthesis: {
              closingText: 'Trabalho e dinheiro são os dois recursos mais escassos de qualquer empresa. {{Quem gerencia bem o caixa sobrevive à crise. Quem gerencia bem o talento vence na expansão}}. Os dois juntos constroem empresas que duram.',
              keyInsights: [
                'Mercado de trabalho: escassez de qualificados é estrutural. Upskilling interno custa menos que competir por candidatos prontos.',
                'Regra de caixa: 3-6 meses de despesas em liquidez diária. {{Nunca use cheque especial — é o crédito mais caro que existe}}.',
                'Open Banking e PIX mudaram as regras do sistema financeiro. Quem ainda ignora essas ferramentas paga mais caro por tudo.',
              ],
            },
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
            id: 'M6-0-cap1',
            type: 'chapter',
            number: 1,
            title: 'Análise Vertical e Horizontal — Lendo as Entrelinhas',
            subtitle: 'Demonstrações contábeis são um mapa. Sem análise, são apenas números.',
            opening: {
              leadText: 'A análise financeira transforma dados em diagnóstico. Dois olhares complementares revelam o que os números escondem: a composição de cada período (vertical) e a tendência ao longo do tempo (horizontal). Juntos, dizem se a empresa está melhorando ou piorando — e onde.',
            },
            body: [
              {
                kind: 'heading',
                text: 'Análise Vertical — A Estrutura',
              },
              {
                kind: 'paragraph',
                text: 'Compara cada item com um referencial dentro do mesmo período. Na DRE: cada linha como % da Receita Líquida. No Balanço: cada conta como % do Ativo Total. Exemplo: CMV representando {{65% da receita}} quando o setor é 45% — a operação está ineficiente. Problema: preço de compra alto, desperdício ou produto subprecificado.',
              },
              {
                kind: 'heading',
                text: 'Análise Horizontal — A Tendência',
              },
              {
                kind: 'paragraph',
                text: 'Compara o mesmo item ao longo de diferentes períodos. Receita cresceu 15%/ano? Lucro cresceu junto ou foi consumido por despesas? Despesas administrativas subiram {{40% enquanto receita cresceu 10%}}? A estrutura está inchando. A horizontal expõe tendências que a vertical nunca mostraria.',
              },
              {
                kind: 'pillar-grid',
                title: 'Índices fundamentais de análise',
                pillars: [
                  { icon: '⏱️', title: 'Ciclo Operacional', description: 'PME + PMR. Quanto tempo entre comprar insumo e receber do cliente. Quanto menor, menos capital imobilizado.' },
                  { icon: '🔄', title: 'Ciclo Financeiro', description: 'Ciclo Operacional − PMP. Quanto tempo a empresa financia com capital próprio. {{Negativo = recebe antes de pagar}} (ideal: iFood, Mercado Livre).' },
                  { icon: '📈', title: 'Giro do Ativo', description: 'Receita ÷ Ativo Total. Quantas vezes o ativo gira em receita. Varejo: 3–5x. Indústria pesada: 0,5–1x.' },
                  { icon: '💰', title: 'Margem de Contribuição', description: 'Preço − Custos Variáveis. O quanto cada venda contribui para cobrir fixos. {{MC negativa = vender mais aumenta o prejuízo}}.' },
                ],
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada tipo de diagnóstico revela um ângulo diferente. Classifique cada situação no tipo de análise que a revela.',
              compare: {
                columnHeaders: ['O que mostra', 'Pergunta que responde', 'Sinal de alerta'],
                rows: [
                  { label: 'Análise Vertical', values: ['Composição: cada item como % do total', '"Quanto desta linha é custo ou margem?"', 'CMV > 60% da receita em varejo'], viz: 'icons' },
                  { label: 'Análise Horizontal', values: ['Tendência: evolução de um item no tempo', '"Esta conta cresce mais do que deveria?"', 'Despesas crescendo 2× mais que receita'], viz: 'icons' },
                  { label: 'Ciclo Financeiro', values: ['Velocidade: tempo do dinheiro preso', '"Preciso de capital de giro externo?"', 'Ciclo > 60 dias com receita estagnada'], viz: 'bars' },
                  { label: 'Giro do Ativo', values: ['Eficiência: quanto o ativo gera em receita', '"Estou usando bem meus ativos?"', 'Giro < 0,5x em negócios não asset-heavy'], viz: 'bars' },
                ],
              },
              drag: {
                instruction: 'Toque no diagnóstico, depois toque no tipo de análise que o revela:',
                zones: [
                  { id: 'vertical', label: 'Problema de Estrutura (Vertical)' },
                  { id: 'horizontal', label: 'Problema de Tendência (Horizontal)' },
                  { id: 'ciclo', label: 'Problema de Ciclo / Eficiência' },
                ],
                items: [
                  {
                    id: 'diag-cmv-alto',
                    label: 'CMV representa 68% da receita este ano',
                    sublabel: 'Setor benchmark é 45%. Empresa está com estrutura de custos fora do padrão.',
                    correctZone: 'vertical',
                    correctFeedback: 'Correto. CMV como % da receita dentro do mesmo período é análise vertical — mostra a estrutura. 68% vs. 45% = ineficiência operacional. Investigar: preço de compra, desperdício ou precificação baixa.',
                    wrongFeedback: 'Repense. Comparar CMV como % da receita dentro do mesmo período é análise vertical — ela mostra a composição, não a evolução temporal.',
                  },
                  {
                    id: 'diag-despesa-crescendo',
                    label: 'Despesas administrativas subiram 45% em 2 anos',
                    sublabel: 'Receita cresceu apenas 12% no mesmo período. A empresa está inchando.',
                    correctZone: 'horizontal',
                    correctFeedback: 'Correto. Comparar a mesma linha ao longo de períodos é análise horizontal — ela revela tendências. Despesas crescendo 4× mais que receita é sinal de estrutura inchando antes de uma crise.',
                    wrongFeedback: 'Repense. Quando você compara o crescimento de um item ao longo de diferentes períodos, está fazendo análise horizontal. Ela revela tendências que a vertical de um único período nunca mostraria.',
                  },
                  {
                    id: 'diag-ciclo-longo',
                    label: 'Empresa vende bem mas vive no limite do caixa',
                    sublabel: 'PME = 60 dias, PMR = 45 dias, PMP = 30 dias. Ciclo Financeiro = 75 dias.',
                    correctZone: 'ciclo',
                    correctFeedback: 'Correto. Ciclo financeiro de 75 dias significa que a empresa financia 2,5 meses de operação com capital próprio. O problema não é lucratividade — é timing. Reduzir PME ou PMR, ou alongar PMP resolveria.',
                    wrongFeedback: 'Repense. O sintoma (caixa apertado com boas vendas) é clássico de ciclo financeiro longo. A empresa é lucrativa mas o dinheiro demora muito para circular.',
                  },
                  {
                    id: 'diag-margem-caindo',
                    label: 'Lucro cresceu 8%, mas margem líquida caiu de 15% para 9%',
                    sublabel: 'Receita explodiu 40% no período, puxando o lucro absoluto para cima.',
                    correctZone: 'vertical',
                    correctFeedback: 'Correto. Margem líquida como % da receita é análise vertical — mostra a eficiência. Lucro absoluto crescendo mas margem caindo = empresa cresce mas fica menos eficiente.',
                    wrongFeedback: 'Repense. Analisar margem (lucro como % da receita) é análise vertical. O lucro cresceu (horizontal positivo), mas a estrutura piorou (vertical negativo).',
                  },
                  {
                    id: 'diag-giro-baixo',
                    label: 'Empresa tem R$ 5M em ativos mas gera R$ 2M de receita/ano',
                    sublabel: 'Giro do Ativo = 0,4x. Concorrentes do setor têm giro de 1,2x.',
                    correctZone: 'ciclo',
                    correctFeedback: 'Correto. Giro do Ativo de 0,4x vs. benchmark de 1,2x = ativos subutilizados. A empresa imobilizou recursos que não geram receita proporcional. Investigar: ativos ociosos ou capacidade mal utilizada.',
                    wrongFeedback: 'Repense. Giro do Ativo (Receita ÷ Ativo) mede eficiência. Abaixo do benchmark indica ativos subutilizados ou superdimensionados.',
                  },
                ],
              },
            },
            synthesis: {
              closingText: 'A análise mais poderosa cruza vertical com horizontal: a vertical mostra {{onde está o problema}} na estrutura, a horizontal mostra {{quando o problema começou}} e se está piorando. Juntas revelam o diagnóstico completo.',
              keyInsights: [
                'Nunca analise um indicador isolado. ROE alto com endividamento explosivo é bomba-relógio. Liquidez alta com ROI baixo é ineficiência.',
                'Ciclo Financeiro negativo é o ideal: empresa recebe antes de pagar, sem precisar de capital de giro externo.',
                '{{CMV acima do benchmark do setor não é dado — é diagnóstico}}. Alguma coisa está errada em compra, produção ou precificação.',
              ],
            },
          },
          {
            id: 'M6-0-cap2',
            type: 'chapter',
            number: 2,
            title: 'Valuation — Quanto Vale Sua Empresa?',
            subtitle: 'DCF, múltiplos e valor patrimonial: três lentes para chegar ao mesmo número.',
            opening: {
              leadText: 'Valuation é a estimativa do valor justo de uma empresa. É usado em fusões, aquisições, captação de investimento, venda de participação e planejamento sucessório. Não é ciência exata — é argumentação fundamentada. O valor certo é aquele que comprador e vendedor concordam.',
            },
            body: [
              {
                kind: 'step-flow',
                title: 'Os 3 métodos de valuation',
                steps: [
                  { number: 1, title: 'DCF — Fluxo de Caixa Descontado', description: 'Projeta fluxos de caixa livres futuros e traz a valor presente usando o WACC. Método mais robusto — mas {{sensível a premissas}}. Melhor para empresas com fluxo previsível. Pequenas mudanças nas premissas mudam o resultado dramaticamente.' },
                  { number: 2, title: 'Múltiplos de Mercado', description: 'Compara com empresas similares: EV/EBITDA, P/L, EV/Receita. SaaS: {{8–15× receita}}. Varejo: 6–10× EBITDA. Indústria: 4–7× EBITDA. Atenção: múltiplos americanos não valem para PME brasileira — risco país e juros mudam tudo.' },
                  { number: 3, title: 'Valor Patrimonial', description: 'Ativo − Passivo. Usado quando a empresa vale mais desmontada do que operando, ou para negócios asset-heavy. Não considera capacidade de gerar lucro futuro — é o {{piso do valuation}}.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Para Startups (pré-receita)',
              },
              {
                kind: 'paragraph',
                text: 'Método Berkus: 5 fatores qualitativos (ideia, protótipo, equipe, mercado, vendas) × até R$ 500K cada. Método VC: parte do retorno esperado e calcula para trás. Na prática, investidores sérios {{triangulam os 3 métodos}} — se DCF diz R$ 10M e múltiplos dizem R$ 8M, o valor justo está nessa faixa, com piso patrimonial.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada tipo de empresa tem um método mais adequado. Classifique as empresas abaixo.',
              compare: {
                columnHeaders: ['Melhor para', 'Dados necessários', 'Ponto fraco'],
                rows: [
                  { label: 'DCF', values: ['Empresas com fluxo previsível', 'Projeções de receita, custos, WACC', 'Premissas erradas = resultado errado'], viz: 'icons' },
                  { label: 'Múltiplos', values: ['Empresas com comparáveis claros', 'EBITDA, receita e pares de mercado', 'Mercado irracional = múltiplo irracional'], viz: 'icons' },
                  { label: 'Patrimonial', values: ['Asset-heavy ou em liquidação', 'Balanço patrimonial atualizado', 'Ignora capacidade de gerar lucro futuro'], viz: 'bars' },
                ],
              },
              drag: {
                instruction: 'Toque na empresa, depois toque no método de valuation mais adequado:',
                zones: [
                  { id: 'dcf', label: 'DCF' },
                  { id: 'multiplos', label: 'Múltiplos' },
                  { id: 'patrimonial', label: 'Valor Patrimonial' },
                ],
                items: [
                  {
                    id: 'val-saas',
                    label: 'SaaS B2B com 3 anos de receita recorrente',
                    sublabel: 'Receita crescendo 40%/ano, churn de 3%/mês, EBITDA negativo mas fluxo previsível.',
                    correctZone: 'multiplos',
                    correctFeedback: 'Correto. SaaS de alto crescimento sem EBITDA positivo é melhor avaliado por EV/Receita (8–15×). O DCF precisaria de muitas premissas incertas. Múltiplos capturam melhor o valor de crescimento.',
                    wrongFeedback: 'Repense. SaaS em crescimento sem EBITDA é difícil de avaliar por DCF e não tem ativos para método patrimonial. Múltiplos de receita (8–15× para SaaS) são o padrão de mercado.',
                  },
                  {
                    id: 'val-industria',
                    label: 'Indústria com 20 anos de história',
                    sublabel: 'Fluxo de caixa livre estável de R$ 2M/ano. Crescimento de 5-8%/ano previsível. Setor maduro.',
                    correctZone: 'dcf',
                    correctFeedback: 'Correto. Fluxo previsível + empresa madura = DCF é o método mais robusto. A previsibilidade elimina o principal risco do método. Complementar com múltiplos para triangular.',
                    wrongFeedback: 'Repense. Indústria madura com fluxo de caixa previsível é o caso ideal para DCF. Premissas realistas + fluxo estável = valuation defensável.',
                  },
                  {
                    id: 'val-imobiliaria',
                    label: 'Incorporadora em dificuldades financeiras',
                    sublabel: 'EBITDA negativo há 2 anos, mas tem terrenos e imóveis valorizados em carteira.',
                    correctZone: 'patrimonial',
                    correctFeedback: 'Correto. Quando a operação gera prejuízo mas os ativos têm valor, o método patrimonial é o mais adequado. A empresa pode valer mais desmontada (vendendo os ativos) do que operando.',
                    wrongFeedback: 'Repense. EBITDA negativo torna DCF e múltiplos inviáveis. Mas incorporadora tem terrenos com valor real — o ativo patrimonial define o piso e provavelmente o valor justo.',
                  },
                  {
                    id: 'val-startup',
                    label: 'Startup de biotech pré-receita',
                    sublabel: 'Tem patente registrada, equipe PhD, produto em fase 2 de testes. Sem receita ainda.',
                    correctZone: 'multiplos',
                    correctFeedback: 'Correto. Startups pré-receita são avaliadas por métodos qualitativos (Berkus, Scorecard) — variações de múltiplos comparáveis. O DCF é impossível sem fluxo, e o patrimonial ignoraria o valor da patente e equipe.',
                    wrongFeedback: 'Repense. Sem receita, o DCF não tem base e o patrimonial ignoraria o valor real. Startups pré-receita são avaliadas por múltiplos qualitativos (Berkus) ou comparáveis de investimentos similares.',
                  },
                  {
                    id: 'val-varejo',
                    label: 'Rede de farmácias regional',
                    sublabel: '12 lojas, EBITDA de R$ 4M/ano, crescimento de 8-10%/ano. Pares listados na B3.',
                    correctZone: 'multiplos',
                    correctFeedback: 'Correto. Com pares listados na B3, os múltiplos de mercado são o método mais objetivo. EV/EBITDA do setor farmacêutico como referência + complemento com DCF para triangular.',
                    wrongFeedback: 'Repense. Quando existem empresas comparáveis listadas em bolsa, os múltiplos são o método mais prático. Rede de farmácias com EBITDA claro e pares na B3 é caso perfeito para EV/EBITDA setorial.',
                  },
                ],
              },
            },
            synthesis: {
              closingText: 'Valuation não é matemática — é narrativa com números. {{DCF conta o futuro, múltiplos contam o mercado, patrimonial conta o presente}}. O analista sério usa os três e triangula. O número final é aquele que a lógica e o mercado sustentam juntos.',
              keyInsights: [
                'DCF: poderoso mas perigoso. Pequenas mudanças na taxa de crescimento ou desconto mudam o resultado em 30-50%.',
                'Múltiplos de mercado americano não valem para PME brasileira. Risco país + taxa de juros mudam o denominador de tudo.',
                '{{Triangule sempre}}: se DCF e múltiplos apontam faixas diferentes, o valor justo está no meio — o patrimonial é o piso.',
              ],
            },
          },
          {
            id: 'M6-0-cap3',
            type: 'chapter',
            number: 3,
            title: 'Capital de Giro — O Motor da Operação',
            subtitle: '60% das falências no Brasil não são por falta de vendas. São por má gestão do dinheiro que circula.',
            opening: {
              leadText: 'Capital de giro é o dinheiro que mantém a operação viva dia a dia. Uma empresa pode ser lucrativa e quebrar — se o dinheiro chega depois das contas. Entender o ciclo de caixa é a diferença entre crescer e estrangular.',
            },
            body: [
              {
                kind: 'heading',
                text: 'Capital de Giro Líquido = Ativo Circulante − Passivo Circulante',
              },
              {
                kind: 'paragraph',
                text: 'Positivo: há folga para operar. Negativo: depende de financiamento externo para girar. Zero: opera no limite — qualquer imprevisto gera crise.',
              },
              {
                kind: 'step-flow',
                title: 'Os 4 componentes do ciclo',
                steps: [
                  { number: 1, title: 'Estoque', description: 'Dinheiro parado em produto. PME = 360 ÷ Giro. Meta: reduzir sem causar ruptura. {{Just-in-time}} e previsão de demanda são as principais alavancas.' },
                  { number: 2, title: 'Contas a Receber', description: 'Dinheiro que o cliente deve. PMR = (Contas a Receber ÷ Receita) × 360. Risco: inadimplência (média 5–8% no Brasil). Antecipar recebíveis custa {{1,5–4%/mês}}.' },
                  { number: 3, title: 'Contas a Pagar', description: 'Quanto tempo o fornecedor financia a empresa. PMP = (Fornecedores ÷ Compras) × 360. Negociar prazos maiores (30→60→90 dias) é {{financiamento gratuito}}.' },
                  { number: 4, title: 'Caixa', description: 'Reserva de segurança. Regra: mínimo {{3–6 meses de despesas fixas}} em aplicação com liquidez diária. Nunca em cheque especial (>300%/ano).' },
                ],
              },
              {
                kind: 'paragraph',
                text: 'Estratégias para otimizar: reduzir estoque (just-in-time, dropshipping), antecipar recebíveis (desconto de duplicatas), alongar pagamentos (negociar 30→60→90 dias), descontos à vista para o cliente (3–5%). Cada alavanca age em um ponto do ciclo — use a que tem menor custo de oportunidade primeiro.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Algumas ações melhoram o capital de giro, outras pioram. Classifique cada decisão corretamente.',
              compare: {
                columnHeaders: ['Efeito no Ciclo', 'Custo/Benefício', 'Quando priorizar'],
                rows: [
                  { label: 'Reduzir estoque', values: ['Diminui PME → encurta ciclo', 'Sem custo direto, libera caixa imediato', 'Quando estoque gira lento'], viz: 'bars' },
                  { label: 'Antecipar recebíveis', values: ['Diminui PMR → encurta ciclo', 'Custo de 1,5–4%/mês (banco)', 'Quando cliente paga em 60+ dias e há urgência'], viz: 'bars' },
                  { label: 'Alongar pagamentos', values: ['Aumenta PMP → encurta ciclo', 'Sem custo — negociação direta', 'Primeiro a tentar — financiamento gratuito'], viz: 'icons' },
                ],
              },
              drag: {
                instruction: 'Toque na ação, depois toque em como ela impacta o capital de giro:',
                zones: [
                  { id: 'melhora', label: 'Melhora o capital de giro' },
                  { id: 'piora', label: 'Piora o capital de giro' },
                ],
                items: [
                  {
                    id: 'cg-prazo-cliente',
                    label: 'Ampliar prazo para o cliente de 30 para 60 dias',
                    sublabel: 'Estratégia comercial para ganhar novos clientes aumentando o prazo de pagamento.',
                    correctZone: 'piora',
                    correctFeedback: 'Correto — piora o capital de giro. Aumentar o PMR significa que o dinheiro demora mais para entrar. O ciclo financeiro cresce, aumentando a necessidade de capital próprio para financiar a operação.',
                    wrongFeedback: 'Repense. Ampliar prazo do cliente aumenta o PMR — o dinheiro demora mais para entrar. Isso aumenta o ciclo financeiro e a necessidade de capital de giro. O benefício comercial tem custo financeiro real.',
                  },
                  {
                    id: 'cg-prazo-fornecedor',
                    label: 'Negociar com fornecedor de 30 para 60 dias',
                    sublabel: 'Empresa negocia prazo maior com seu principal fornecedor de matéria-prima.',
                    correctZone: 'melhora',
                    correctFeedback: 'Correto — melhora. Aumentar o PMP encurta o ciclo financeiro. O fornecedor financia por mais tempo — é financiamento gratuito. Essa é a primeira alavanca a explorar.',
                    wrongFeedback: 'Repense. Aumentar PMP (tempo para pagar fornecedor) encurta o ciclo financeiro = menos capital próprio necessário. É, na prática, financiamento gratuito.',
                  },
                  {
                    id: 'cg-estoque-just',
                    label: 'Implantar sistema just-in-time de estoque',
                    sublabel: 'Empresa reduz PME de 45 para 15 dias comprando apenas com pedido confirmado.',
                    correctZone: 'melhora',
                    correctFeedback: 'Correto — melhora significativamente. Reduzir PME de 45 para 15 dias encurta o ciclo operacional em 30 dias e libera caixa imobilizado no estoque. Sem custo direto.',
                    wrongFeedback: 'Repense. Reduzir o PME (tempo com estoque parado) encurta o ciclo financeiro e libera caixa imobilizado em produto. É uma das alavancas mais poderosas e sem custo financeiro direto.',
                  },
                  {
                    id: 'cg-cheque',
                    label: 'Usar limite de cheque especial para cobrir folha',
                    sublabel: 'Empresa recorre ao cheque especial em meses de baixo faturamento.',
                    correctZone: 'piora',
                    correctFeedback: 'Correto — piora drasticamente. Cheque especial a mais de 300%/ano é o crédito mais caro que existe. Em poucos meses, os juros consomem a margem e transformam um problema de fluxo em crise de solvência.',
                    wrongFeedback: 'Repense. Cheque especial passa de 300%/ano. Cada mês usando esse crédito corrói margem e agrava o problema de caixa. Alternativa: antecipação de recebíveis (1,5–4%/mês).',
                  },
                  {
                    id: 'cg-desconto-avista',
                    label: 'Oferecer 4% de desconto para cliente pagar à vista',
                    sublabel: 'Empresa oferece desconto em troca de antecipação do pagamento (de 60 para 0 dias).',
                    correctZone: 'melhora',
                    correctFeedback: 'Correto — melhora. Pagar 4% de desconto para encurtar o PMR de 60 para 0 dias pode custar menos que antecipar recebíveis no banco (1,5–4%/mês). Caixa imediato vs. custo do desconto — compare antes de decidir.',
                    wrongFeedback: 'Repense. Dar desconto de 4% ao cliente que paga antecipado encurta o PMR — o dinheiro entra mais rápido. Se antecipar no banco custaria mais de 4%/mês, o desconto ao cliente é mais barato.',
                  },
                ],
              },
            },
            synthesis: {
              closingText: '60% das falências no Brasil são por má gestão de capital de giro — não por falta de vendas. {{A empresa pode vender muito e quebrar se o dinheiro chegar tarde demais}}. Gestão de ciclo financeiro é a habilidade mais subvalorizada em finanças empresariais.',
              keyInsights: [
                'Ciclo Financeiro negativo = empresa se autofinancia. Positivo = precisa de capital externo. Cada dia conta.',
                'Primeira alavanca: negocie prazo com fornecedor. É financiamento gratuito. Segunda: reduza estoque. Terceira: antecipe recebíveis.',
                '{{Cheque especial é o produto financeiro mais caro do mercado}}. Usar para cobrir operação é sinal de que o ciclo está quebrado.',
              ],
            },
          },
          {
            id: 'M6-0-cap4',
            type: 'chapter',
            number: 4,
            title: 'Diagnóstico Integrado — O Mapa Financeiro do Negócio',
            subtitle: 'Análise V/H, valuation, capital de giro e precificação: quatro lentes do mesmo negócio.',
            opening: {
              leadText: 'Análise financeira, valuation, capital de giro e precificação não são quatro temas separados — são quatro lentes do mesmo negócio. A empresa que entende sua estrutura, sua tendência, seu ciclo e seu preço tem informação para decidir. As outras adivinham.',
            },
            body: [
              {
                kind: 'pillar-grid',
                title: 'Os 4 instrumentos do diagnóstico financeiro',
                pillars: [
                  { icon: '🔬', title: 'Análise Vertical/Horizontal', description: 'Revela a estrutura (V) e a tendência (H). Vertical mostra {{onde está o problema}}. Horizontal mostra quando começou e se piora.' },
                  { icon: '💼', title: 'Valuation', description: 'DCF para fluxo previsível, múltiplos para comparáveis, patrimonial para asset-heavy. {{Triangule os três}} — o número certo está no cruzamento.' },
                  { icon: '⚙️', title: 'Capital de Giro', description: 'PME + PMR − PMP = Ciclo Financeiro. Negativo = autofinancia. Positivo = precisa de capital externo. {{60% das falências}} são por má gestão do ciclo.' },
                  { icon: '💲', title: 'Precificação', description: 'Custo define o piso, mercado define a faixa, valor define o teto. Markup de 50% ≠ margem de 50%. {{Break-even}} define quantas vendas precisa para sobreviver.' },
                ],
              },
              {
                kind: 'heading',
                text: 'O Diagnóstico em 4 Perguntas',
              },
              {
                kind: 'paragraph',
                text: '1) A estrutura está saudável? (Análise Vertical — CMV, margem bruta, despesas como % da receita). 2) A tendência está melhorando? (Análise Horizontal — evolução dos indicadores no tempo). 3) O dinheiro está circulando? (Capital de Giro — ciclo financeiro, PME, PMR, PMP). 4) O preço está correto? (Precificação — markup vs. margem, break-even, margem de segurança). {{Quatro perguntas, quatro respostas — esse é o mapa financeiro completo}}.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada instrumento financeiro resolve um tipo de problema. Identifique qual ferramenta usar em cada situação.',
              compare: {
                columnHeaders: ['Revela', 'Pergunta principal', 'Sinal crítico'],
                rows: [
                  { label: 'Análise V/H', values: ['Estrutura e tendência', '"Estou melhorando ou piorando, e onde?"', 'Margens caindo com receita crescendo'], viz: 'icons' },
                  { label: 'Valuation', values: ['Valor justo da empresa', '"Quanto vale meu negócio hoje?"', 'Diferença > 50% entre métodos'], viz: 'icons' },
                  { label: 'Capital de Giro', values: ['Saúde do fluxo de caixa', '"O dinheiro circula na velocidade certa?"', 'Ciclo financeiro > 60 dias'], viz: 'bars' },
                  { label: 'Precificação', values: ['Viabilidade e margem', '"Meu preço cobre custo e gera lucro?"', 'MC negativa ou abaixo do break-even'], viz: 'bars' },
                ],
              },
              drag: {
                instruction: 'Toque no problema da empresa, depois toque na ferramenta financeira mais indicada para resolvê-lo:',
                zones: [
                  { id: 'vh', label: 'Análise V/H' },
                  { id: 'valuation', label: 'Valuation' },
                  { id: 'cg', label: 'Capital de Giro' },
                  { id: 'preco', label: 'Precificação' },
                ],
                items: [
                  {
                    id: 'diag-fatura-mas-quebra',
                    label: 'Empresa fatura R$ 200K/mês mas sempre falta caixa',
                    sublabel: 'Lucrativa no papel, mas vive no limite. Usa cheque especial mensalmente.',
                    correctZone: 'cg',
                    correctFeedback: 'Correto. Faturamento alto com caixa no limite é clássico de ciclo financeiro longo. Investigar PME, PMR e PMP — o dinheiro está entrando mas devagar demais para cobrir as saídas.',
                    wrongFeedback: 'Repense. O sintoma (lucro no papel, falta de caixa) aponta para capital de giro. O dinheiro existe mas está preso em estoque ou recebíveis. Analise PME + PMR − PMP.',
                  },
                  {
                    id: 'diag-vende-mas-nao-lucra',
                    label: 'Vendas crescem 20%/ano mas lucro não sobe',
                    sublabel: 'Receita crescendo, mas resultado estagnado há 3 anos. Equipe aumentou muito.',
                    correctZone: 'vh',
                    correctFeedback: 'Correto. Crescimento de receita sem crescimento de lucro é sinal de estrutura inchando (análise vertical) e tendência de deterioração (análise horizontal). CMV ou despesas crescendo mais que receita.',
                    wrongFeedback: 'Repense. Receita crescendo sem crescimento de lucro = a estrutura de custos está comendo o ganho. Análise vertical (composição) e horizontal (tendência) revelam onde o lucro está sendo perdido.',
                  },
                  {
                    id: 'diag-investidor-quer-entrar',
                    label: 'Investidor quer comprar 30% da empresa',
                    sublabel: 'Negócio saudável, EBITDA de R$ 1,2M/ano. Sócio quer saber quanto vale antes de negociar.',
                    correctZone: 'valuation',
                    correctFeedback: 'Correto. Antes de negociar participação com investidor, é necessário estabelecer o valor da empresa. DCF + múltiplos de mercado do setor definem a faixa de negociação. Sem valuation, você negocia no escuro.',
                    wrongFeedback: 'Repense. Quando um investidor quer comprar participação, o primeiro passo é estabelecer o valor da empresa. Sem valuation (DCF + múltiplos), você não sabe se a oferta é justa ou não.',
                  },
                  {
                    id: 'diag-vende-mais-perde-mais',
                    label: 'Quanto mais vende, mais dinheiro some',
                    sublabel: 'Startup crescendo rápido mas queimando caixa. Cada novo cliente parece piorar a situação.',
                    correctZone: 'preco',
                    correctFeedback: 'Correto. Crescer e piorar é o sintoma clássico de Margem de Contribuição negativa — o preço não cobre os custos variáveis. Cada venda destrói caixa. Resolver precificação antes de qualquer outra coisa.',
                    wrongFeedback: 'Repense. Quando mais vendas = mais prejuízo, o problema é Margem de Contribuição negativa. O preço não cobre os custos variáveis. Crescimento com MC negativa é acelerador de falência — corrija antes de escalar.',
                  },
                  {
                    id: 'diag-custo-subiu',
                    label: 'Margem bruta caiu de 40% para 28% nos últimos 2 anos',
                    sublabel: 'Receita cresceu. Mas o lucro está cada vez menor em proporção.',
                    correctZone: 'vh',
                    correctFeedback: 'Correto. Margem bruta como % da receita é análise vertical. Queda de 40% para 28% ao longo de 2 anos é análise horizontal. A combinação revela: a estrutura piorou (vertical) e continua piorando (horizontal).',
                    wrongFeedback: 'Repense. Margem como % da receita é análise vertical. Evolução dessa margem ao longo de 2 anos é análise horizontal. As duas juntas revelam: estrutura piorou e a tendência é de deterioração contínua.',
                  },
                ],
              },
            },
            synthesis: {
              closingText: 'Análise financeira, valuation, capital de giro e precificação são {{quatro lentes do mesmo negócio}}. Gestores que dominam os quatro tomam decisões melhores — porque enxergam o que os outros não veem.',
              keyInsights: [
                'O diagnóstico em 4 perguntas: estrutura saudável? Tendência melhorando? Dinheiro circulando? Preço correto?',
                'Fatura bem mas falta caixa = capital de giro. Vende mas não lucra = estrutura (V/H). Cresce e piora = precificação.',
                '{{Nenhum indicador isolado conta a história completa}}. A análise financeira é cruzamento — não checklist individual.',
              ],
            },
          },
        ],
      },
      {
        id: 'M6-1',
        title: 'Precificacao',
        blocks: [
          {
            id: 'M6-1-cap1',
            type: 'chapter',
            number: 1,
            title: '3 Abordagens de Precificação — O Método Define o Resultado',
            subtitle: 'Preço é a única variável do mix que gera receita. Cobrar errado pode destruir um negócio excelente.',
            opening: {
              leadText: 'A maioria das empresas precifica por instinto ou por medo da concorrência. As que precificam estrategicamente ganham mais, crescem mais rápido e criam barreiras de entrada. A diferença começa na escolha do método.',
            },
            body: [
              {
                kind: 'pillar-grid',
                title: 'As 3 abordagens de precificação',
                pillars: [
                  { icon: '📐', title: 'Baseada em Custo', description: 'Preço = Custo + Margem. Garante que nenhuma venda dá prejuízo. Risco: ignora o que o cliente pagaria. Uso: commodities, licitações, indústria.' },
                  { icon: '💎', title: 'Baseada em Valor', description: 'Preço = Valor percebido pelo cliente. iPhone: custo ~US$ 400, preço ~US$ 1.200. Captura o máximo. Requer pesquisa profunda.' },
                  { icon: '⚔️', title: 'Baseada em Mercado', description: 'Preço = Referência dos concorrentes ± posicionamento. Risco: race to bottom. Uso: e-commerce, varejo, mercados commoditizados.' },
                ],
              },
              {
                kind: 'paragraph',
                text: 'Empresas maduras não escolhem um método — usam os 3 em camadas: custo define o {{PISO}} (abaixo disso é prejuízo), mercado define a {{FAIXA}} (onde o comprador pesquisa), e valor define o {{TETO}} (o máximo que você pode capturar sem perder o cliente). O erro é usar apenas uma camada.',
              },
              {
                kind: 'heading',
                text: 'Tiered Pricing — O Poder das 3 Opções',
              },
              {
                kind: 'paragraph',
                text: 'Oferecer 3 versões (básico, profissional, premium): 60–70% dos clientes escolhem o meio. O plano básico existe para não perder quem não pode pagar o premium. O premium existe para fazer o profissional parecer acessível. SaaS, consultorias e serviços que adotam tiered pricing aumentam receita média por cliente em {{30–50%}}.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Cada negócio tem uma abordagem natural. Veja as diferenças — depois classifique os casos abaixo.',
              compare: {
                columnHeaders: ['Lógica central', 'Vantagem real', 'Risco principal'],
                rows: [
                  { label: 'Baseada em Custo', values: ['Custo + margem = preço', 'Garante que nenhuma venda dá prejuízo', 'Deixa dinheiro na mesa se valor > custo'], viz: 'bars' },
                  { label: 'Baseada em Valor', values: ['Preço = quanto o cliente ganha', 'Captura máxima disposição a pagar', 'Requer pesquisa — sem dados, é achismo'], viz: 'bars' },
                  { label: 'Baseada em Mercado', values: ['Referência dos concorrentes ± ajuste', 'Mantém competitividade imediata', 'Race to bottom — todos perdem margem'], viz: 'icons' },
                ],
              },
              drag: {
                instruction: 'Toque no negócio, depois toque na abordagem de precificação mais adequada:',
                zones: [
                  { id: 'custo', label: 'Baseada em Custo' },
                  { id: 'valor', label: 'Baseada em Valor' },
                  { id: 'mercado', label: 'Baseada em Mercado' },
                ],
                items: [
                  {
                    id: 'prec-licitacao',
                    label: 'Empresa que participa de licitações públicas',
                    sublabel: 'Fornece uniformes para prefeituras. O critério de seleção é o menor preço entre propostas habilitadas.',
                    correctZone: 'custo',
                    correctFeedback: 'Correto. Em licitação o critério é menor preço — não valor percebido. A estratégia é calcular o custo com precisão máxima e cobrar o mínimo que ainda gera margem. Precificar por valor aqui seria perder o contrato.',
                    wrongFeedback: 'Repense. Licitações definem vencedor pelo menor preço entre propostas válidas. O único controle é o custo interno — quem sabe o custo exato pode ser competitivo sem operar no prejuízo.',
                  },
                  {
                    id: 'prec-consultoria',
                    label: 'Consultoria que identifica R$ 500K de economia',
                    sublabel: 'O projeto levou 3 semanas. Custo interno: R$ 15K. O cliente economizará meio milhão.',
                    correctZone: 'valor',
                    correctFeedback: 'Correto. Cobrar por custo (R$ 15K + margem = ~R$ 25K) deixa R$ 450K+ de valor na mesa. Cobrar por valor: 10% do ganho gerado = R$ 50K. A McKinsey cobra 1–5% do impacto — o preço é baseado no resultado, não no tempo.',
                    wrongFeedback: 'Repense. Consultoria que gera R$ 500K de retorno tem base para cobrar muito mais que o custo interno. Precificação por valor captura proporção do resultado entregue — não das horas trabalhadas.',
                  },
                  {
                    id: 'prec-ecommerce',
                    label: 'Loja online de eletrônicos genéricos',
                    sublabel: 'Vende fones de ouvido sem marca própria que o cliente pesquisa em 4 sites antes de comprar.',
                    correctZone: 'mercado',
                    correctFeedback: 'Correto. Produto sem diferenciação em canal onde o cliente compara preços = mercado define o teto. A estratégia é operar no preço competitivo e buscar eficiência de custo para manter margem.',
                    wrongFeedback: 'Repense. Fone sem marca em e-commerce onde o cliente pesquisa em 4 sites é commodity digital. O mercado define o preço — cobrar mais que os concorrentes sem diferenciação é perder vendas.',
                  },
                  {
                    id: 'prec-saas',
                    label: 'SaaS de gestão financeira para PMEs',
                    sublabel: 'O software evita em média R$ 8K/mês em despesas desnecessárias por cliente. Custo por cliente: R$ 200/mês.',
                    correctZone: 'valor',
                    correctFeedback: 'Correto. SaaS com ROI mensurável (R$ 8K economizados ÷ R$ 200 de custo = 40× ROI) tem base para precificar por valor. Cobrar R$ 800/mês ainda entrega 10× ROI ao cliente — e aumenta a receita 4× vs. custo.',
                    wrongFeedback: 'Repense. Quando o produto gera resultado mensurável (R$ 8K economizados), o preço pode ser uma fração desse valor. Cobrar R$ 200/mês (custo) deixa R$ 7.800 de valor capturável na mesa todo mês.',
                  },
                  {
                    id: 'prec-farmacia',
                    label: 'Farmácia de manipulação com 2 concorrentes no bairro',
                    sublabel: 'Produto diferenciado (manipulado), mas o cliente pesquisa preço antes de decidir onde fazer.',
                    correctZone: 'mercado',
                    correctFeedback: 'Correto — com nuance. Farmácia de manipulação tem diferenciação mas atua em mercado comparável. Estratégia híbrida: custo garante o piso, mercado define a faixa, e atendimento pode justificar um prêmio de 10–15%.',
                    wrongFeedback: 'Repense. Mesmo com produto diferenciado, se o cliente pesquisa preço entre concorrentes, o mercado ancora a decisão. Referência de mercado + pequeno prêmio por atributos (velocidade, qualidade, atendimento).',
                  },
                ],
              },
            },
            synthesis: {
              closingText: 'Se você cobra por custo, compete por preço. Se cobra por valor, compete por resultado. {{A mudança de método de precificação é a alavanca de margem mais rápida que existe}} — sem mudar produto, equipe ou estrutura.',
              keyInsights: [
                'Custo define o PISO, mercado define a FAIXA, valor define o TETO. Use os 3 — não apenas um.',
                'Tiered pricing aumenta receita média por cliente em 30–50%. A opção do meio vende sozinha.',
                '{{Cobrar pelo resultado entregue, não pela hora trabalhada}} é o salto de margem que transforma consultores em referências.',
              ],
            },
          },
          {
            id: 'M6-1-cap2',
            type: 'chapter',
            number: 2,
            title: 'Elasticidade e Psicologia do Preço',
            subtitle: 'O preço que o cliente vê não é o mesmo preço que ele sente. Entender isso é vantagem.',
            opening: {
              leadText: 'Elasticidade não é teoria acadêmica — é saber se um aumento de 10% no preço vai custar 15% de vendas ou apenas 3%. A diferença determina se o reajuste melhora ou destrói a receita. E a psicologia do preço explica por que R$ 199 vende mais que R$ 200.',
            },
            body: [
              {
                kind: 'heading',
                text: 'Elasticidade-Preço da Demanda',
              },
              {
                kind: 'pillar-grid',
                pillars: [
                  { icon: '📉', title: 'Demanda Elástica', description: 'Variação de 10% no preço → queda >10% na demanda. Produtos não-essenciais, substituíveis. Ex: viagens, roupas de grife, restaurantes finos.' },
                  { icon: '🪨', title: 'Demanda Inelástica', description: 'Variação de 10% no preço → queda <10% na demanda. Essenciais, sem substituto. Ex: insulina, combustível, água encanada.' },
                  { icon: '🔀', title: 'Elasticidade Cruzada', description: 'Como o preço do concorrente afeta sua demanda. Alta = produtos substitutos. Baixa = complementares ou sem alternativa percebida.' },
                  { icon: '🔒', title: 'Lock-in Reduz Elasticidade', description: 'Ecossistema Apple, software ERP, assinatura anual — o custo de troca alto torna a demanda inelástica mesmo em produtos não-essenciais.' },
                ],
              },
              {
                kind: 'heading',
                text: 'Psicologia do Preço — 3 Vieses que Todo Gestor Deve Usar',
              },
              {
                kind: 'step-flow',
                steps: [
                  { number: 1, title: 'Preço Âncora', description: 'O primeiro preço que o consumidor vê define a referência mental. "De R$ 299 por R$ 199" funciona porque a âncora (299) estabelece o valor percebido — o desconto parece enorme mesmo que o produto sempre valesse R$ 199.' },
                  { number: 2, title: 'Charm Pricing', description: 'R$ 199 vende mais que R$ 200. O cérebro lê da esquerda para a direita: "1" parece menor que "2". Eficaz especialmente abaixo de limiares psicológicos (R$ 100, R$ 500, R$ 1.000).' },
                  { number: 3, title: 'Efeito Decoy', description: 'Inserir uma terceira opção "sacrifício" torna outra mais atraente. Pipoca P: R$ 5. G: R$ 8. M: R$ 7. A M existe para fazer a G parecer obviamente melhor — 80% escolhem G.' },
                ],
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Elasticidade elástica ou inelástica muda toda a estratégia de reajuste. Classifique os produtos abaixo.',
              compare: {
                columnHeaders: ['Se subir 10% o preço', 'Estratégia recomendada', 'Exemplo de mercado'],
                rows: [
                  { label: 'Elástica', values: ['Perde >10% do volume — receita cai', 'Diferenciar antes de subir preço', 'Restaurante casual, roupas fast fashion'], viz: 'bars' },
                  { label: 'Inelástica', values: ['Perde <10% do volume — receita sobe', 'Subir preço captura margem com pouco custo', 'Medicamentos, utilities, nicho especializado'], viz: 'bars' },
                  { label: 'Âncora alta', values: ['Desconto parece maior, conversão sobe', 'Mostrar preço original antes do atual', 'E-commerce, Black Friday, planos de serviço'], viz: 'icons' },
                ],
              },
              drag: {
                instruction: 'Toque no produto, depois toque em como sua demanda responde a mudanças de preço:',
                zones: [
                  { id: 'elastica', label: 'Elástica — sensível ao preço' },
                  { id: 'inelastica', label: 'Inelástica — pouco sensível' },
                ],
                items: [
                  {
                    id: 'el-insulina',
                    label: 'Insulina para diabético tipo 1',
                    sublabel: 'Medicamento sem substituto. O paciente precisa da dose exata independente do preço.',
                    correctZone: 'inelastica',
                    correctFeedback: 'Correto. Demanda inelástica clássica: o paciente não tem alternativa e a necessidade é vital. Subir 30% no preço gera queda mínima no volume. Por isso regulação de preços de medicamentos existe.',
                    wrongFeedback: 'Repense. Insulina sem substituto para quem depende dela é inelástica — o consumidor compra independente do preço. Alta inelasticidade justifica regulação estatal de preços.',
                  },
                  {
                    id: 'el-restaurante',
                    label: 'Restaurante casual em praça de alimentação',
                    sublabel: 'Rodeado por 12 concorrentes com preço médio similar. O cliente decide onde comer na hora.',
                    correctZone: 'elastica',
                    correctFeedback: 'Correto. Com 12 substitutos à vista e decisão por impulso, a demanda é elástica. Subir R$ 5 no prato pode custar 20-30% dos clientes para o vizinho. Diferenciação reduz a elasticidade.',
                    wrongFeedback: 'Repense. Restaurante em praça de alimentação com muitos substitutos tem demanda elástica — o cliente literalmente olha para os outros lugares antes de decidir.',
                  },
                  {
                    id: 'el-iphone',
                    label: 'iPhone na versão mais recente',
                    sublabel: 'Usuário fiel ao ecossistema Apple. Apps, AirPods, iCloud e Apple Watch integrados.',
                    correctZone: 'inelastica',
                    correctFeedback: 'Correto. Ecossistema Apple cria lock-in que reduz a elasticidade drasticamente. O custo de troca (perder integração, reaprender, substituir acessórios) torna o preço secundário para usuários fiéis.',
                    wrongFeedback: 'Repense. O ecossistema Apple cria custo de troca alto — isso torna a demanda inelástica: subir o preço do iPhone não faz o usuário migrar para Android porque o custo de troca é maior.',
                  },
                  {
                    id: 'el-passagem',
                    label: 'Passagem aérea para destino de lazer',
                    sublabel: 'Viagem de férias não urgente. O cliente pesquisa por semanas antes de comprar.',
                    correctZone: 'elastica',
                    correctFeedback: 'Correto. Viagem de lazer com tempo de planejamento longo e múltiplos destinos substitutos = altamente elástica. Subir 15% leva muitos clientes a escolher outro destino ou adiar a viagem.',
                    wrongFeedback: 'Repense. Lazer com alternativas (outros destinos, datas flexíveis, adiar) torna a demanda elástica. Diferente de viagem de negócios com data fixa — essa tem menor elasticidade.',
                  },
                  {
                    id: 'el-energia',
                    label: 'Conta de energia elétrica residencial',
                    sublabel: 'Tarifa da distribuidora local — único fornecedor na região.',
                    correctZone: 'inelastica',
                    correctFeedback: 'Correto. Monopolista natural + bem essencial = inelasticidade máxima. O consumidor não tem alternativa no curto prazo. Por isso é regulado pela ANEEL — sem regulação, o preço poderia subir indefinidamente.',
                    wrongFeedback: 'Repense. Energia elétrica de monopolista local: sem alternativa, essencial e com custo de troca (geração própria) altíssimo. Regulação existe exatamente para controlar o poder de precificação.',
                  },
                ],
              },
            },
            synthesis: {
              closingText: 'Conhecer a elasticidade do seu produto é saber {{quanto poder de precificação você tem}}. Demanda inelástica = você pode aumentar preço sem perder volume. Elástica = diferenciação antes de reajuste. Sem saber a elasticidade, qualquer reajuste é aposta.',
              keyInsights: [
                'Elástico = substitutos fáceis. Inelástico = sem alternativa ou custo de troca alto. Produtos inelásticos têm margem estruturalmente maior.',
                'Preço âncora é o contexto que define o valor percebido. {{Sempre mostre de onde vem o preço atual}} — comparação ativa o juízo de valor.',
                'Tiered pricing não é sobre dar opções — é sobre fazer a opção do meio parecer obviamente a melhor escolha.',
              ],
            },
          },
          {
            id: 'M6-1-cap3',
            type: 'chapter',
            number: 3,
            title: 'Markup vs Margem — A Confusão que Custa Caro',
            subtitle: 'Markup de 50% não é margem de 50%. É margem de 33%. Este erro custa 17% do lucro esperado.',
            opening: {
              leadText: 'A confusão entre markup e margem é um dos erros mais comuns e mais caros da gestão financeira. Uma empresa que acredita ter 50% de margem quando tem 33% está planejando crescimento, contratações e distribuição de lucros com números errados.',
            },
            body: [
              {
                kind: 'heading',
                text: 'Markup — Fator Sobre o Custo',
              },
              {
                kind: 'paragraph',
                text: 'Markup = Preço ÷ Custo. Custo R$ 50, Preço R$ 100 → Markup = 100% (dobrou o custo). Fórmula reversa: Preço = Custo × (1 + Markup%). Markup de 100% significa que o preço é o dobro do custo — {{não que o lucro é 100%}}.',
              },
              {
                kind: 'heading',
                text: 'Margem — Percentual do Preço',
              },
              {
                kind: 'paragraph',
                text: 'Margem = (Preço − Custo) ÷ Preço × 100. Custo R$ 50, Preço R$ 100 → Margem = 50%. A margem mede o percentual do preço que sobra como lucro. Markup e margem partem de bases diferentes: {{markup usa o custo, margem usa o preço}}.',
              },
              {
                kind: 'pillar-grid',
                title: 'A tabela que todo gestor precisa decorar',
                pillars: [
                  { icon: '2️⃣', title: 'Markup 100%', description: 'Margem REAL: 50%. Preço = 2× o custo. "Dobrei o preço" ≠ "Tenho 100% de margem".' },
                  { icon: '➕', title: 'Markup 50%', description: 'Margem REAL: 33%. O erro mais comum: "aplico 50% de margem" quando a margem é 33%.' },
                  { icon: '📊', title: 'Markup 30%', description: 'Margem REAL: 23%. Muitas empresas de varejo operam aqui sem perceber.' },
                  { icon: '⚠️', title: 'Markup 25%', description: 'Margem REAL: 20%. Abaixo disso, qualquer oscilação de custo elimina o lucro.' },
                ],
              },
              {
                kind: 'paragraph',
                text: 'Fórmula correta para precificar com margem definida: {{Preço = Custo ÷ (1 − Margem%)}}. Se quer 35% de margem com custo de R$ 80: Preço = 80 ÷ 0,65 = R$ 123. Margem = (R$ 43 ÷ R$ 123) = 35% ✓. Não multiplique — divida.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Markup ou margem — a base importa. Identifique o erro que cada empreendedor está cometendo.',
              compare: {
                columnHeaders: ['Markup aplicado', 'Margem real', 'Custo R$ 100 → Preço'],
                rows: [
                  { label: 'Markup 200%', values: ['Margem real: 67%', 'Preço = R$ 300', 'Lucro de R$ 200 em cada venda'], viz: 'bars' },
                  { label: 'Markup 100%', values: ['Margem real: 50%', 'Preço = R$ 200', 'Lucro de R$ 100 em cada venda'], viz: 'bars' },
                  { label: 'Markup 50%', values: ['Margem real: 33%', 'Preço = R$ 150', 'Lucro de R$ 50 — não R$ 75'], viz: 'bars' },
                  { label: 'Markup 30%', values: ['Margem real: 23%', 'Preço = R$ 130', 'Lucro de R$ 30 — não R$ 39'], viz: 'bars' },
                ],
              },
              drag: {
                instruction: 'Toque na situação, depois toque no erro que o empreendedor está cometendo:',
                zones: [
                  { id: 'markup-como-margem', label: 'Confunde markup com margem' },
                  { id: 'correto', label: 'Cálculo correto' },
                  { id: 'subcusto', label: 'Vende abaixo do custo' },
                ],
                items: [
                  {
                    id: 'mk-caso1',
                    label: '"Aplico 40% de margem no meu produto"',
                    sublabel: 'Produto custa R$ 100. Ela multiplica por 1,4 e vende por R$ 140. Acredita ter R$ 40 de "margem".',
                    correctZone: 'markup-como-margem',
                    correctFeedback: 'Correto — ela calcula markup, não margem. R$ 40 ÷ R$ 140 = 28,5% de margem real. Ela acredita ter 40% mas tem 28,5% — diferença de 11,5pp que distorce todo o planejamento financeiro.',
                    wrongFeedback: 'Repense. Multiplicar o custo por 1,4 é markup de 40% — não margem de 40%. A margem real é (R$ 40 ÷ R$ 140) = 28,5%. Confundir os dois faz o empreendedor planejar com rentabilidade fictícia.',
                  },
                  {
                    id: 'mk-caso2',
                    label: '"Preço = Custo ÷ (1 − 0,35) para ter 35% de margem"',
                    sublabel: 'Custo R$ 80. Preço = 80 ÷ 0,65 = R$ 123. Margem = (R$ 43 ÷ R$ 123) = 35%.',
                    correctZone: 'correto',
                    correctFeedback: 'Correto — cálculo exato. A fórmula Preço = Custo ÷ (1 − Margem%) é a forma correta de precificar com margem definida. R$ 43 ÷ R$ 123 = 35% de margem real.',
                    wrongFeedback: 'Repense. Este cálculo está correto. A fórmula Preço = Custo ÷ (1 − Margem%) garante a margem desejada sobre o preço de venda — não sobre o custo.',
                  },
                  {
                    id: 'mk-caso3',
                    label: '"Tenho 100% de margem porque vendo pelo dobro do custo"',
                    sublabel: 'Produto custa R$ 50, vende por R$ 100. Empreendedor afirma ter "100% de margem".',
                    correctZone: 'markup-como-margem',
                    correctFeedback: 'Correto — o markup é 100%, mas a margem é 50%. R$ 50 ÷ R$ 100 = 50%. Dizer "100% de margem" cria expectativa errada sobre rentabilidade — especialmente ao calcular IR, distribuição e reinvestimento.',
                    wrongFeedback: 'Repense. Vender pelo dobro do custo = markup de 100%. Mas margem = lucro ÷ preço = R$ 50 ÷ R$ 100 = 50%. A base importa: markup usa custo, margem usa preço.',
                  },
                  {
                    id: 'mk-caso4',
                    label: '"Vendo a R$ 90 porque o cliente pediu desconto de 10%"',
                    sublabel: 'Produto custa R$ 95. Empresa deu desconto de 10% sobre o preço original R$ 100.',
                    correctZone: 'subcusto',
                    correctFeedback: 'Correto — venda abaixo do custo. R$ 90 de preço < R$ 95 de custo = prejuízo de R$ 5 por unidade. Desconto sem verificar se o preço ainda cobre o custo é erro grave — especialmente quando os custos subiram recentemente.',
                    wrongFeedback: 'Repense. Desconto de 10% sobre R$ 100 = R$ 90 de receita. Custo = R$ 95. Cada venda gera R$ 5 de prejuízo. Descontos precisam ser calculados sobre a margem disponível — não sobre o preço de tabela.',
                  },
                  {
                    id: 'mk-caso5',
                    label: '"Minha margem é de 25% porque lucro R$ 25 em R$ 100 de custo"',
                    sublabel: 'Produto custa R$ 100, vende por R$ 125. Ele calcula: R$ 25 ÷ R$ 100 = 25%.',
                    correctZone: 'markup-como-margem',
                    correctFeedback: 'Correto — ele calcula markup sobre custo (25%), não margem sobre preço. A margem real é R$ 25 ÷ R$ 125 = 20%. São 5pp de diferença que, em escala, mudam completamente a análise de rentabilidade.',
                    wrongFeedback: 'Repense. Dividir o lucro pelo custo é markup, não margem. Margem = lucro ÷ preço = R$ 25 ÷ R$ 125 = 20%. Markup usa custo, margem usa preço — e preço é o número que aparece na nota fiscal.',
                  },
                ],
              },
            },
            synthesis: {
              closingText: 'Markup e margem são dois números sobre o mesmo lucro — com bases diferentes. {{Confundir os dois é planejar em cima de uma ilusão}}. Antes de definir meta de crescimento ou distribuição, certifique-se de qual número você está usando.',
              keyInsights: [
                'Markup usa o custo como base. Margem usa o preço. Markup de 50% = margem de 33% — {{nunca são iguais}}.',
                'A fórmula correta para margem definida: Preço = Custo ÷ (1 − Margem%). Não multiplique — divida.',
                'Desconto concedido precisa ser calculado sobre a margem disponível, não sobre o preço. Descontar sem saber o custo real é vender no escuro.',
              ],
            },
          },
          {
            id: 'M6-1-cap4',
            type: 'chapter',
            number: 4,
            title: 'Break-Even e Margem de Contribuição — O Piso do Negócio',
            subtitle: 'Quantas unidades preciso vender para não ter prejuízo? Qualquer gestor deve responder isso de cabeça.',
            opening: {
              leadText: 'Ponto de equilíbrio não é exercício contábil — é a resposta para "meu negócio é viável neste volume?". Margem de Contribuição negativa é o sinal mais perigoso que existe: significa que vender mais piora a situação. Entender os dois protege o negócio de crescer para o prejuízo.',
            },
            body: [
              {
                kind: 'heading',
                text: 'Margem de Contribuição — A Unidade Fundamental',
              },
              {
                kind: 'paragraph',
                text: 'MC = Preço − Custos Variáveis. Cada venda contribui com MC para cobrir os custos fixos. Após cobrir todos os fixos, cada MC adicional é lucro puro. {{MC negativa significa que cada venda aumenta o prejuízo}} — vender o dobro dobra a perda. O problema não é volume, é preço ou custo variável.',
              },
              {
                kind: 'heading',
                text: 'Ponto de Equilíbrio — O Piso de Sobrevivência',
              },
              {
                kind: 'paragraph',
                text: 'PE (unidades) = Custos Fixos ÷ MC unitária. PE (receita) = Custos Fixos ÷ MC%. Exemplo: Custos Fixos R$ 30.000 | Preço R$ 100 | CV R$ 40 → MC = R$ 60 → {{PE = 500 unidades}}. Abaixo de 500: prejuízo. Acima: lucro. Simples assim — mas pouquíssimas PMEs calculam.',
              },
              {
                kind: 'heading',
                text: 'Margem de Segurança — Quanto Você Pode Perder',
              },
              {
                kind: 'paragraph',
                text: 'Margem de Segurança = (Vendas Atuais − PE) ÷ Vendas Atuais. Se você vende 700 unidades e o PE é 500: segurança = (700−500) ÷ 700 = {{28,6%}}. Você pode perder até 28,6% das vendas antes de entrar no prejuízo. Sazonalidade, crise ou perda de cliente grande: esse é o colchão que protege.',
              },
            ],
            application: {
              kind: 'compare-and-drag',
              intro: 'Break-even, MC e margem de segurança revelam a saúde real do negócio. Diagnostique cada caso.',
              compare: {
                columnHeaders: ['Fórmula', 'O que revela', 'Sinal de alerta'],
                rows: [
                  { label: 'Margem de Contribuição', values: ['MC = Preço − CV', 'Quanto cada venda contribui para fixos', 'MC negativa = cada venda piora'], viz: 'bars' },
                  { label: 'Break-Even (und)', values: ['PE = Fixos ÷ MC', 'Mínimo de vendas para não ter prejuízo', 'PE > capacidade operacional'], viz: 'bars' },
                  { label: 'Margem de Segurança', values: ['(Vendas − PE) ÷ Vendas', 'Quanto pode perder antes do prejuízo', 'Abaixo de 15% = vulnerável'], viz: 'icons' },
                ],
              },
              drag: {
                instruction: 'Toque no cenário do negócio, depois toque no diagnóstico correto:',
                zones: [
                  { id: 'lucro', label: 'Opera com lucro' },
                  { id: 'prejuizo', label: 'Opera no prejuízo' },
                  { id: 'critico', label: 'Situação crítica — risco imediato' },
                ],
                items: [
                  {
                    id: 'be-restaurante',
                    label: 'Restaurante: 1.040 pratos/mês, PE = 1.216',
                    sublabel: 'Custos fixos R$ 45.000. MC por prato = R$ 37. Vende 1.040 pratos/mês.',
                    correctZone: 'prejuizo',
                    correctFeedback: 'Correto. 1.040 < PE de 1.216 = prejuízo de (1.216 − 1.040) × R$ 37 = ~R$ 6.500/mês. Precisa vender mais 176 pratos por mês (7 por dia) ou reduzir fixos em R$ 6.500 para empatar.',
                    wrongFeedback: 'Repense. PE = R$ 45.000 ÷ R$ 37 = 1.216 pratos. Vendendo 1.040 — 176 abaixo do PE. Resultado: prejuízo de ~R$ 6.500/mês.',
                  },
                  {
                    id: 'be-saas',
                    label: 'SaaS: 300 clientes, PE = 209, MC = 96%',
                    sublabel: 'Custos fixos R$ 40.000. Ticket R$ 200, CV R$ 8. MC = R$ 192/cliente.',
                    correctZone: 'lucro',
                    correctFeedback: 'Correto — com folga confortável. PE ≈ 209. Com 300, supera em 91 clientes = R$ 17.472 de lucro mensal. Margem de segurança: (300−209) ÷ 300 = 30,3%. Pode perder 90 clientes antes do vermelho.',
                    wrongFeedback: 'Repense. PE = R$ 40.000 ÷ R$ 192 ≈ 209. Com 300 clientes, supera o PE em 91 = lucro de ~R$ 17.500/mês. Margem de segurança de 30% — saudável.',
                  },
                  {
                    id: 'be-mc-negativa',
                    label: 'Startup: Preço R$ 50, Custo Variável R$ 70',
                    sublabel: 'Estratégia de "queimar preço" para crescer. Custos fixos R$ 15.000/mês.',
                    correctZone: 'critico',
                    correctFeedback: 'Correto — situação crítica. MC = R$ 50 − R$ 70 = −R$ 20 por unidade. Não existe PE possível: cada venda adiciona R$ 20 de prejuízo. Crescimento com MC negativa é acelerador de falência.',
                    wrongFeedback: 'Repense. MC negativa (R$ 50 − R$ 70 = −R$ 20) é o sinal mais grave. O break-even é matematicamente impossível: cada venda adiciona prejuízo. Crescer nesse modelo destrói caixa mais rápido.',
                  },
                  {
                    id: 'be-margem-baixa',
                    label: 'Loja: PE = 950 unidades, vende 980',
                    sublabel: 'Margem de segurança de 3%. Resultado mensal: R$ 900 de lucro.',
                    correctZone: 'critico',
                    correctFeedback: 'Correto — tecnicamente no lucro, mas em situação crítica. Margem de segurança de 3%: basta perder 30 clientes para entrar no vermelho. Qualquer sazonalidade ou custo inesperado vira prejuízo.',
                    wrongFeedback: 'Repense. Lucro existe (980 > 950), mas margem de segurança de 3% é perigosa. Perder 30 vendas = prejuízo. Qualquer evento adverso elimina o resultado. Situação crítica apesar do lucro técnico.',
                  },
                  {
                    id: 'be-industria',
                    label: 'Indústria: PE = 800 unidades, produz 1.400',
                    sublabel: 'Custos fixos R$ 120.000. MC unitária R$ 150. Capacidade usada: 70%.',
                    correctZone: 'lucro',
                    correctFeedback: 'Correto — lucrativa com boa margem de segurança. PE = 800. Produz 1.400 = 600 acima do PE = R$ 90.000 de lucro. Margem de segurança: 43%. Aguenta absorver quedas significativas de demanda.',
                    wrongFeedback: 'Repense. PE = R$ 120.000 ÷ R$ 150 = 800. Produz 1.400 — 600 acima = R$ 90.000 de lucro mensal. Margem de segurança de 43% — excelente.',
                  },
                ],
              },
            },
            synthesis: {
              closingText: 'Break-even não é destino — é piso. {{Operar abaixo do PE é sangriar lentamente}}. A meta é margem de segurança > 20%: significa que o negócio aguenta surpresas sem entrar em crise imediata.',
              keyInsights: [
                'MC negativa: vender mais piora. Corrija preço ou custo variável antes de qualquer coisa — crescimento não resolve.',
                'Margem de segurança < 15% = empresa vulnerável. Qualquer choque externo vira crise.',
                '{{PE não é meta de vendas — é o piso de sobrevivência}}. A meta é operar 30%+ acima do PE para ter colchão real.',
              ],
            },
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
