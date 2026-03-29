'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, Leaf, BarChart3, FileText, Building2,
  Globe, Handshake, Award,
} from 'lucide-react'

/* ── Colors ── */
const GREEN  = '#1e8449'
const BLUE   = '#1a5276'
const AMBER  = '#9a7d0a'
const PURPLE = '#7d3c98'
const ORANGE = '#e67e22'

/* ── Types ── */
interface Framework {
  id: string
  title: string
  subtitle: string
  color: string
  icon: typeof Leaf
  content: React.ReactNode
}

/* ── Reusable tiny components ── */
const SectionTitle = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <p className="text-[11px] uppercase tracking-widest font-bold mt-4 mb-2" style={{ color }}>
    {children}
  </p>
)

const Bullet = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <li className="flex items-start gap-2 text-[13px] text-zinc-300 leading-relaxed">
    <span className="mt-[7px] w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
    <span>{children}</span>
  </li>
)

const KeyQuestion = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[13px] italic text-zinc-400 mt-2 pl-4 border-l-2 border-zinc-700">
    {children}
  </p>
)

const ExampleBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-zinc-800/50 rounded-md px-4 py-3 mt-2 text-[13px] text-zinc-300 leading-relaxed">
    {children}
  </div>
)

const Divider = () => <hr className="border-zinc-800 my-4" />

/* ── Framework content ── */

const TBLContent = () => (
  <div className="space-y-1">
    <SectionTitle color={GREEN}>O QUE E</SectionTitle>
    <p className="text-[13px] text-zinc-300 leading-relaxed">
      O TBL propoe que o sucesso de uma empresa seja medido em tres dimensoes simultaneas — nao apenas no lucro.
    </p>

    <Divider />
    <SectionTitle color={GREEN}>OS 3Ps</SectionTitle>

    {/* PROFIT */}
    <p className="text-[14px] font-bold text-amber-400 mt-3">PROFIT (Economico) — &quot;A empresa e viavel?&quot;</p>
    <p className="text-[11px] uppercase tracking-wider text-zinc-500 mt-2 mb-1">O que medir:</p>
    <ul className="space-y-1">
      <Bullet color="#f59e0b">Receita liquida e margem operacional</Bullet>
      <Bullet color="#f59e0b">Empregos gerados (diretos e indiretos)</Bullet>
      <Bullet color="#f59e0b">Impostos pagos e contribuicao fiscal</Bullet>
      <Bullet color="#f59e0b">Investimento em inovacao (% da receita em P&D)</Bullet>
      <Bullet color="#f59e0b">Distribuicao de valor entre stakeholders</Bullet>
    </ul>
    <KeyQuestion>Pergunta-chave: &quot;O lucro esta sendo gerado de forma que fortalece ou enfraquece o sistema ao redor?&quot;</KeyQuestion>

    {/* PEOPLE */}
    <p className="text-[14px] font-bold text-blue-400 mt-5">PEOPLE (Social) — &quot;A empresa e justa?&quot;</p>
    <p className="text-[11px] uppercase tracking-wider text-zinc-500 mt-2 mb-1">O que medir:</p>
    <ul className="space-y-1">
      <Bullet color="#3b82f6">Horas de treinamento por colaborador/ano</Bullet>
      <Bullet color="#3b82f6">Gap salarial entre generos (mesma funcao)</Bullet>
      <Bullet color="#3b82f6">Taxa de turnover e satisfacao interna (eNPS)</Bullet>
      <Bullet color="#3b82f6">Acidentes de trabalho (taxa de frequencia)</Bullet>
      <Bullet color="#3b82f6">Investimento em comunidades locais (% da receita)</Bullet>
      <Bullet color="#3b82f6">Diversidade em cargos de lideranca</Bullet>
    </ul>
    <KeyQuestion>Pergunta-chave: &quot;As pessoas que constroem o negocio estao sendo desenvolvidas ou consumidas?&quot;</KeyQuestion>

    {/* PLANET */}
    <p className="text-[14px] font-bold text-green-400 mt-5">PLANET (Ambiental) — &quot;A empresa e sustentavel?&quot;</p>
    <p className="text-[11px] uppercase tracking-wider text-zinc-500 mt-2 mb-1">O que medir:</p>
    <ul className="space-y-1">
      <Bullet color="#22c55e">Emissoes de CO2 (Escopo 1, 2 e 3)</Bullet>
      <Bullet color="#22c55e">Consumo de agua por unidade produzida</Bullet>
      <Bullet color="#22c55e">% de residuos reciclados vs. aterro</Bullet>
      <Bullet color="#22c55e">Uso de energia renovavel (% da matriz)</Bullet>
      <Bullet color="#22c55e">Impacto na biodiversidade local</Bullet>
    </ul>
    <KeyQuestion>Pergunta-chave: &quot;A operacao consome mais recursos do que o planeta consegue regenerar?&quot;</KeyQuestion>

    <Divider />
    <SectionTitle color={GREEN}>COMO APLICAR — PASSO A PASSO</SectionTitle>
    <ol className="space-y-1 list-decimal pl-5">
      <li className="text-[13px] text-zinc-300">Escolha 3 indicadores por pilar (total: 9 metricas)</li>
      <li className="text-[13px] text-zinc-300">Estabeleca a linha de base (onde estamos hoje)</li>
      <li className="text-[13px] text-zinc-300">Defina metas para 12 meses</li>
      <li className="text-[13px] text-zinc-300">Integre no relatorio trimestral junto com resultados financeiros</li>
      <li className="text-[13px] text-zinc-300">Apresente ao conselho/diretoria com o mesmo peso dos resultados financeiros</li>
    </ol>

    <Divider />
    <SectionTitle color={GREEN}>O RECALL DE ELKINGTON (2018)</SectionTitle>
    <ExampleBox>
      Em 2018, John Elkington publicou na Harvard Business Review: <strong className="text-white">&quot;25 Years Ago I Coined the Phrase Triple Bottom Line. Here&apos;s Why It&apos;s Time to Rethink It.&quot;</strong> Ele fez um recall do proprio conceito.
    </ExampleBox>

    <p className="text-[11px] uppercase tracking-wider text-zinc-500 mt-3 mb-1">O que deu errado:</p>
    <ul className="space-y-2">
      <Bullet color="#ef4444">
        <strong className="text-white">Trade-off em vez de Sinergia</strong> — empresas usavam TBL para compensar: &quot;poluimos, mas geramos empregos&quot;. Mineradora desmata 500ha mas patrocina escola R$200k. Dano ambiental: R$50M.
      </Bullet>
      <Bullet color="#ef4444">
        <strong className="text-white">Greenwashing Institucionalizado</strong> — 75% das maiores publicam GRI. Emissoes continuam subindo.
      </Bullet>
      <Bullet color="#ef4444">
        <strong className="text-white">A &quot;Ultima Linha&quot; Sempre Vence</strong> — quando trimestre aperta, social e ambiental sao cortados primeiro.
      </Bullet>
    </ul>

    <Divider />
    <SectionTitle color={GREEN}>CIRCULOS ANINHADOS</SectionTitle>
    <ExampleBox>
      <strong className="text-white">Economia &#8834; Sociedade &#8834; Planeta</strong> — a economia existe DENTRO da sociedade, que existe DENTRO do planeta.
    </ExampleBox>

    <p className="text-[11px] uppercase tracking-wider text-zinc-500 mt-3 mb-1">Teste dos Circulos:</p>
    <ol className="space-y-1 list-decimal pl-5">
      <li className="text-[13px] text-zinc-300">Isso viola algum limite ecologico? (Se sim → <span className="text-red-400 font-bold">PARE</span>)</li>
      <li className="text-[13px] text-zinc-300">Isso prejudica algum grupo social? (Se sim → <span className="text-amber-400 font-bold">REDESENHE</span>)</li>
      <li className="text-[13px] text-zinc-300">Isso e financeiramente viavel? (Se sim → <span className="text-green-400 font-bold">EXECUTE</span>)</li>
    </ol>

    <Divider />
    <SectionTitle color={GREEN}>ERRO COMUM</SectionTitle>
    <ExampleBox>
      Tratar o TBL como relatorio de marketing. O TBL funciona quando esta integrado na tomada de decisao — nao quando e preenchido pelo departamento de comunicacao uma vez por ano.
    </ExampleBox>
  </div>
)

const ESGContent = () => (
  <div className="space-y-1">
    <SectionTitle color={BLUE}>O QUE E</SectionTitle>
    <p className="text-[13px] text-zinc-300 leading-relaxed">
      Como o mercado financeiro avalia sustentabilidade. Sao os 3 pilares que investidores analisam.
    </p>

    <Divider />

    {/* E */}
    <p className="text-[14px] font-bold text-green-400 mt-3">E — Environmental</p>
    <ul className="space-y-1 mt-1">
      <Bullet color="#22c55e">Emissoes de carbono (Escopo 1, 2, 3)</Bullet>
      <Bullet color="#22c55e">Gestao hidrica (consumo, reuso, descarte)</Bullet>
      <Bullet color="#22c55e">Gestao de residuos (% reciclado, destinacao)</Bullet>
      <Bullet color="#22c55e">Energia renovavel (% da matriz)</Bullet>
      <Bullet color="#22c55e">Risco climatico (exposicao a eventos extremos)</Bullet>
    </ul>
    <p className="text-[11px] text-zinc-500 mt-1 italic">Como medir: GHG Protocol (ghgprotocol.org), inventario agua/energia 12 meses</p>

    {/* S */}
    <p className="text-[14px] font-bold text-blue-400 mt-5">S — Social</p>
    <ul className="space-y-1 mt-1">
      <Bullet color="#3b82f6">Diversidade e inclusao (genero, raca em lideranca)</Bullet>
      <Bullet color="#3b82f6">Saude e seguranca (taxa acidentes, afastamentos)</Bullet>
      <Bullet color="#3b82f6">Relacao com comunidade</Bullet>
      <Bullet color="#3b82f6">Direitos humanos na cadeia (trabalho analogo)</Bullet>
      <Bullet color="#3b82f6">Satisfacao colaboradores (eNPS, turnover)</Bullet>
    </ul>
    <p className="text-[11px] text-zinc-500 mt-1 italic">Como medir: gap salarial por genero, eNPS trimestral, auditoria fornecedores</p>

    {/* G */}
    <p className="text-[14px] font-bold text-amber-400 mt-5">G — Governance</p>
    <ul className="space-y-1 mt-1">
      <Bullet color="#f59e0b">Independencia do conselho (% membros independentes)</Bullet>
      <Bullet color="#f59e0b">Separacao CEO e presidente do conselho</Bullet>
      <Bullet color="#f59e0b">Politica anticorrupcao e canal de denuncias</Bullet>
      <Bullet color="#f59e0b">Transparencia fiscal e tributaria</Bullet>
      <Bullet color="#f59e0b">Remuneracao executiva atrelada a metas ESG</Bullet>
    </ul>
    <p className="text-[11px] text-zinc-500 mt-1 italic">Como medir: canal denuncias anonimo, metas ESG no bonus</p>

    <Divider />
    <SectionTitle color={BLUE}>RATING ESG</SectionTitle>
    <p className="text-[13px] text-zinc-300 leading-relaxed">
      Agencias como <strong className="text-white">MSCI</strong>, <strong className="text-white">Sustainalytics</strong> e <strong className="text-white">ISS</strong> avaliam empresas de CCC a AAA.
    </p>
    <ExampleBox>
      Rating baixo = custo de capital maior + exclusao de fundos ESG.<br />
      <strong className="text-green-400">Natura: AAA.</strong> <strong className="text-red-400">Vale pos-Brumadinho: B.</strong>
    </ExampleBox>
  </div>
)

const GRIContent = () => (
  <div className="space-y-1">
    <SectionTitle color={AMBER}>O QUE E</SectionTitle>
    <p className="text-[13px] text-zinc-300 leading-relaxed">
      Padrao mais usado no mundo para relatos de sustentabilidade. <strong className="text-white">75% das 250 maiores usam.</strong>
    </p>
    <p className="text-[13px] text-zinc-400 italic mt-1">Logica: &quot;De dentro para fora — como a empresa impacta o mundo&quot;</p>

    <Divider />
    <SectionTitle color={AMBER}>ESTRUTURA</SectionTitle>
    <ul className="space-y-2">
      <Bullet color={AMBER}><strong className="text-white">GRI 1: Fundamentos</strong> — principios: precisao, equilibrio, clareza, comparabilidade, completude</Bullet>
      <Bullet color={AMBER}><strong className="text-white">GRI 2: Informacoes Gerais</strong> — perfil, governanca, estrategia, stakeholders</Bullet>
      <Bullet color={AMBER}><strong className="text-white">GRI 3: Temas Materiais</strong> — como identifica impactos mais significativos</Bullet>
      <Bullet color={AMBER}><strong className="text-white">GRI 300: Temas Ambientais</strong> — energia, agua, emissoes, residuos, biodiversidade</Bullet>
      <Bullet color={AMBER}><strong className="text-white">GRI 400: Temas Sociais</strong> — emprego, saude, treinamento, diversidade, direitos humanos</Bullet>
      <Bullet color={AMBER}><strong className="text-white">GRI 200: Temas Economicos</strong> — desempenho, presenca no mercado, anticorrupcao</Bullet>
    </ul>

    <Divider />
    <SectionTitle color={AMBER}>COMO APLICAR EM PMEs</SectionTitle>
    <ol className="space-y-1 list-decimal pl-5">
      <li className="text-[13px] text-zinc-300"><strong className="text-white">Analise de Materialidade</strong> — liste stakeholders, identifique temas relevantes, cruze</li>
      <li className="text-[13px] text-zinc-300"><strong className="text-white">Coleta de Dados</strong> — para cada tema material, defina indicadores GRI</li>
      <li className="text-[13px] text-zinc-300"><strong className="text-white">Elaboracao do Relatorio</strong> — contexto + dados + metas + comparacao periodo anterior</li>
      <li className="text-[13px] text-zinc-300"><strong className="text-white">Verificacao Externa</strong> (opcional mas recomendada)</li>
    </ol>
    <ExampleBox>
      Erro: &quot;Reportar tudo. GRI nao exige todos os 300+ indicadores.&quot;
    </ExampleBox>
  </div>
)

const SASBContent = () => (
  <div className="space-y-1">
    <SectionTitle color={PURPLE}>O QUE E</SectionTitle>
    <p className="text-[13px] text-zinc-300 leading-relaxed">
      Padrao por industria focado em materialidade <strong className="text-white">FINANCEIRA</strong>.
    </p>
    <p className="text-[13px] text-zinc-400 italic mt-1">Logica: &quot;De fora para dentro — como o mundo impacta a empresa financeiramente&quot;</p>

    <Divider />
    <ExampleBox>
      Complementa o GRI: <strong className="text-amber-400">GRI = impacto da empresa no mundo</strong>. <strong className="text-purple-400">SASB = risco financeiro da empresa</strong>.
    </ExampleBox>
    <p className="text-[13px] text-zinc-400 mt-2">
      <strong className="text-white">Quando usar:</strong> empresas listadas, investidores internacionais
    </p>
  </div>
)

const ODSContent = () => (
  <div className="space-y-1">
    <SectionTitle color={ORANGE}>O QUE E</SectionTitle>
    <p className="text-[13px] text-zinc-300 leading-relaxed">
      17 metas globais da ONU ate 2030. Bussola estrategica.
    </p>

    <Divider />
    <SectionTitle color={ORANGE}>AGRUPADOS</SectionTitle>
    <ul className="space-y-2">
      <Bullet color="#3b82f6"><strong className="text-blue-400">Pessoas:</strong> ODS 1 (Pobreza), 2 (Fome), 3 (Saude), 4 (Educacao), 5 (Igualdade de Genero)</Bullet>
      <Bullet color="#f59e0b"><strong className="text-amber-400">Prosperidade:</strong> ODS 7 (Energia), 8 (Trabalho Decente), 9 (Industria/Inovacao), 10 (Reducao Desigualdades), 11 (Cidades)</Bullet>
      <Bullet color="#22c55e"><strong className="text-green-400">Planeta:</strong> ODS 6 (Agua), 12 (Consumo Responsavel), 13 (Acao Climatica), 14 (Vida na Agua), 15 (Vida Terrestre)</Bullet>
      <Bullet color="#a855f7"><strong className="text-purple-400">Paz:</strong> ODS 16 (Paz/Justica), 17 (Parcerias)</Bullet>
    </ul>

    <Divider />
    <SectionTitle color={ORANGE}>COMO CONECTAR A ESTRATEGIA</SectionTitle>
    <ol className="space-y-1 list-decimal pl-5">
      <li className="text-[13px] text-zinc-300">Mapeie impactos (positivos e negativos) na cadeia de valor</li>
      <li className="text-[13px] text-zinc-300">Cruze com os ODS</li>
      <li className="text-[13px] text-zinc-300">Priorize 3-5 ODS (maximo!) — <span className="text-red-400">&quot;contribuimos para todos os 17&quot; = greenwashing</span></li>
      <li className="text-[13px] text-zinc-300">Defina metas concretas: &quot;ODS 8 → Reduzir gap salarial de 22% para 5% ate 2026&quot;</li>
      <li className="text-[13px] text-zinc-300">Integre ao ESG: <strong className="text-white">&quot;ODS = O QUE. ESG = COMO.&quot;</strong></li>
    </ol>

    <ExampleBox>
      <strong className="text-white">Caso Natura:</strong> ODS 12, 13, 15 → rating AAA
    </ExampleBox>
  </div>
)

const CSVContent = () => (
  <div className="space-y-1">
    <SectionTitle color={GREEN}>O QUE E</SectionTitle>
    <p className="text-[13px] text-zinc-300 leading-relaxed">
      Diferenca fundamental: <strong className="text-zinc-400">CSR distribui parte do lucro</strong>. <strong className="text-white">CSV gera lucro PORQUE resolve problemas sociais.</strong>
    </p>

    <Divider />
    <SectionTitle color={GREEN}>3 NIVEIS</SectionTitle>

    <p className="text-[14px] font-bold text-green-400 mt-3">Nivel 1: Reconceber Produtos e Mercados</p>
    <KeyQuestion>&quot;Existe necessidade social nao atendida que pode virar mercado lucrativo?&quot;</KeyQuestion>
    <ul className="space-y-1 mt-2">
      <Bullet color="#22c55e">Unilever Pureit</Bullet>
      <Bullet color="#22c55e">Grameen Bank</Bullet>
      <Bullet color="#22c55e">Natura Ekos</Bullet>
    </ul>

    <p className="text-[14px] font-bold text-blue-400 mt-5">Nivel 2: Redefinir Produtividade na Cadeia</p>
    <KeyQuestion>&quot;Onde desperdicamos recursos que poderiam ser otimizados?&quot;</KeyQuestion>
    <ul className="space-y-1 mt-2">
      <Bullet color="#3b82f6">Walmart embalagens -5% = -$3.4B/ano + menos residuos</Bullet>
      <Bullet color="#3b82f6">Nestle: 600k agricultores treinados → qualidade sobe, custo rejeicao cai</Bullet>
    </ul>

    <p className="text-[14px] font-bold text-purple-400 mt-5">Nivel 3: Desenvolver Clusters Locais</p>
    <KeyQuestion>&quot;O ecossistema ao redor esta forte ou fraco?&quot;</KeyQuestion>
    <ul className="space-y-1 mt-2">
      <Bullet color="#a855f7">Embraer Sao Jose dos Campos: escolas tecnicas → mao-de-obra qualificada</Bullet>
      <Bullet color="#a855f7">Porto Digital Recife: ecossistema tech</Bullet>
    </ul>

    <Divider />
    <SectionTitle color={GREEN}>COMO AVALIAR NA SUA EMPRESA</SectionTitle>
    <ul className="space-y-2">
      <Bullet color="#22c55e"><strong className="text-white">Nivel 1:</strong> Liste 3 maiores problemas sociais da regiao → pode resolver lucrativamente?</Bullet>
      <Bullet color="#3b82f6"><strong className="text-white">Nivel 2:</strong> Liste 5 maiores custos → solucao que reduz custo E melhora impacto?</Bullet>
      <Bullet color="#a855f7"><strong className="text-white">Nivel 3:</strong> Infraestrutura local ajuda ou atrapalha? Investir melhora retorno operacional?</Bullet>
    </ul>
  </div>
)

const ISEContent = () => (
  <div className="space-y-1">
    <SectionTitle color={BLUE}>ISE (INDICE DE SUSTENTABILIDADE EMPRESARIAL B3)</SectionTitle>
    <ul className="space-y-2">
      <Bullet color={BLUE}>Criado 2005 pela B3 para identificar empresas sustentaveis</Bullet>
      <Bullet color={BLUE}>Carteira de acoes composta por empresas com praticas ESG</Bullet>
      <Bullet color={BLUE}>Avaliacao anual: questionario + relatorios + auditorias</Bullet>
      <Bullet color={BLUE}>Estar no ISE = opcao de investimento solida = custo de capital menor</Bullet>
    </ul>
    <ExampleBox>
      Peter Drucker: <em>&quot;o objetivo do marketing e tornar a venda superflua&quot;</em> → ISE condiciona escolha do investidor
    </ExampleBox>

    <Divider />
    <SectionTitle color={BLUE}>ISP (INVESTIMENTO SOCIAL PRIVADO)</SectionTitle>
    <ul className="space-y-2">
      <Bullet color={BLUE}>Destinacao voluntaria de recursos para bem-estar social/ambiental/cultural</Bullet>
      <Bullet color={BLUE}>Diferente de doacao: alinha com RSC, busca impacto duradouro</Bullet>
      <Bullet color={BLUE}>Educacao, saude, meio ambiente, inclusao social</Bullet>
    </ul>
    <p className="text-[11px] uppercase tracking-wider text-zinc-500 mt-3 mb-1">Caracteristicas:</p>
    <ul className="space-y-1">
      <Bullet color={BLUE}>Natureza voluntaria</Bullet>
      <Bullet color={BLUE}>Visao de longo prazo</Bullet>
      <Bullet color={BLUE}>Interesse social genuino</Bullet>
    </ul>
    <p className="text-[13px] text-zinc-400 mt-2">
      <strong className="text-white">RSC:</strong> praticas alem das obrigacoes legais — condicoes justas, direitos humanos, recursos responsaveis
    </p>

    <Divider />
    <SectionTitle color={BLUE}>SETORES POLUENTES E ISE</SectionTitle>
    <ul className="space-y-1">
      <Bullet color={BLUE}>Transicao tecnologica estrutural (petroliferas → eolica)</Bullet>
      <Bullet color={BLUE}>DDDM para eficiencia operacional e monitoramento emissoes</Bullet>
      <Bullet color={BLUE}>AI-DSS para previsao de riscos ambientais</Bullet>
      <Bullet color={BLUE}>Frameworks de Governanca Digital (COBIT, ISO 38500)</Bullet>
    </ul>
  </div>
)

/* ── Framework definitions ── */
const FRAMEWORKS: Framework[] = [
  {
    id: 'tbl',
    title: 'TBL — Triple Bottom Line (Elkington, 1994)',
    subtitle: 'People, Planet, Profit',
    color: GREEN,
    icon: Leaf,
    content: <TBLContent />,
  },
  {
    id: 'esg',
    title: 'ESG — Environmental, Social, Governance',
    subtitle: 'Rating CCC a AAA (MSCI)',
    color: BLUE,
    icon: BarChart3,
    content: <ESGContent />,
  },
  {
    id: 'gri',
    title: 'GRI — Global Reporting Initiative',
    subtitle: '75% das 250 maiores usam',
    color: AMBER,
    icon: FileText,
    content: <GRIContent />,
  },
  {
    id: 'sasb',
    title: 'SASB — Sustainability Accounting Standards Board',
    subtitle: 'Materialidade financeira por industria',
    color: PURPLE,
    icon: Building2,
    content: <SASBContent />,
  },
  {
    id: 'ods',
    title: 'ODS — Objetivos de Desenvolvimento Sustentavel',
    subtitle: '17 metas globais da ONU ate 2030',
    color: ORANGE,
    icon: Globe,
    content: <ODSContent />,
  },
  {
    id: 'csv',
    title: 'CSV — Creating Shared Value (Porter & Kramer, 2011)',
    subtitle: 'Lucro porque resolve problemas sociais',
    color: GREEN,
    icon: Handshake,
    content: <CSVContent />,
  },
  {
    id: 'ise',
    title: 'ISE B3 + ISP',
    subtitle: 'Indice de Sustentabilidade + Investimento Social Privado',
    color: BLUE,
    icon: Award,
    content: <ISEContent />,
  },
]

/* ── Main component ── */
export default function ESGFrameworks() {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id))

  return (
    <div className="min-h-screen bg-zinc-950 p-6 md:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Frameworks de Sustentabilidade
        </h1>
        <p className="text-zinc-400 text-[13px] md:text-[14px]">
          7 frameworks de referencia — clique para expandir e explorar cada um em profundidade.
        </p>
      </motion.div>

      {/* Accordion */}
      <div className="space-y-3 max-w-3xl">
        {FRAMEWORKS.map((fw, idx) => {
          const isOpen = openId === fw.id
          const Icon = fw.icon

          return (
            <motion.div
              key={fw.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-lg overflow-hidden"
              style={{ borderLeft: `4px solid ${fw.color}` }}
            >
              {/* Header button */}
              <button
                onClick={() => toggle(fw.id)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-900 hover:bg-zinc-800/80 transition-colors text-left"
              >
                <Icon size={20} style={{ color: fw.color, flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-[14px] truncate">{fw.title}</p>
                  <p className="text-zinc-500 text-[11px] truncate">{fw.subtitle}</p>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: fw.color + '22', color: fw.color }}
                >
                  {fw.id.toUpperCase()}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} className="text-zinc-500" />
                </motion.div>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 py-4 bg-zinc-900/60 border-t border-zinc-800">
                      {fw.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
