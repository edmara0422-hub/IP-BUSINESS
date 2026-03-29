'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, Leaf, BarChart3, FileText, Building2,
  Globe, Handshake, Award, ShieldAlert,
} from 'lucide-react'

/* ── Colors ── */
const RED = '#c0392b'
const GREEN = '#1e8449'
const AMBER = '#9a7d0a'
const BLUE = '#1a5276'
const PURPLE = '#7d3c98'
const ORANGE = '#e67e22'

/* ── Framework data ── */
interface Framework {
  id: string
  title: string
  subtitle: string
  color: string
  icon: typeof Leaf
  quandoUsar: string
  oQueE: string
  content: React.ReactNode
}

const FRAMEWORKS: Framework[] = [
  {
    id: 'tbl', title: 'TBL — Triple Bottom Line', subtitle: 'People, Planet, Profit',
    color: GREEN, icon: Leaf,
    quandoUsar: 'Qualquer empresa — é o ponto de partida universal',
    oQueE: 'Mede sucesso em 3 dimensões: People, Planet, Profit',
    content: (
      <div className="space-y-3 text-sm text-zinc-300">
        <div>
          <p className="font-semibold text-white mb-1">Como aplicar:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="text-green-400 font-medium">People:</span> horas de treinamento, gap salarial, turnover, diversidade</li>
            <li><span className="text-blue-400 font-medium">Planet:</span> emissões CO₂, água, resíduos, energia renovável</li>
            <li><span className="text-amber-400 font-medium">Profit:</span> margem, impostos, investimento P&D</li>
          </ul>
          <p className="mt-2 text-zinc-400 italic">"Escolha 3 indicadores por pilar (total 9). Meça. Defina metas 12 meses."</p>
        </div>
        <div>
          <p className="font-semibold text-white mb-1">Teste dos Círculos:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Viola limite ecológico? → <span className="text-red-400 font-medium">pare</span></li>
            <li>Prejudica grupo social? → <span className="text-amber-400 font-medium">redesenhe</span></li>
            <li>Financeiramente viável? → <span className="text-green-400 font-medium">execute</span></li>
          </ol>
        </div>
        <p className="text-zinc-500 text-xs">Erro comum: Tratar TBL como marketing. Funciona quando integrado na decisão.</p>
      </div>
    ),
  },
  {
    id: 'esg', title: 'ESG Rating', subtitle: 'Rating CCC a AAA (MSCI)',
    color: BLUE, icon: BarChart3,
    quandoUsar: 'Empresas que buscam investidores ou crédito com taxas melhores',
    oQueE: 'Como investidores avaliam sustentabilidade — rating CCC a AAA (MSCI)',
    content: (
      <div className="space-y-3 text-sm text-zinc-300">
        <div>
          <p className="font-semibold text-white mb-1">Como aplicar:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="text-green-400 font-medium">E:</span> emissões, gestão hídrica, resíduos, energia renovável, risco climático</li>
            <li><span className="text-blue-400 font-medium">S:</span> diversidade, saúde/segurança, comunidade, direitos humanos, eNPS</li>
            <li><span className="text-amber-400 font-medium">G:</span> independência conselho, anticorrupção, transparência, remuneração ESG</li>
          </ul>
        </div>
        <p className="text-zinc-400 italic text-xs">"Natura: AAA. Vale pós-Brumadinho: B. Rating baixo = custo de capital sobe."</p>
      </div>
    ),
  },
  {
    id: 'gri', title: 'GRI — Global Reporting Initiative', subtitle: '75% das 250 maiores usam',
    color: AMBER, icon: FileText,
    quandoUsar: 'Empresas grandes, que exportam ou querem publicar relatório de sustentabilidade',
    oQueE: 'Padrão mais usado no mundo para relatos de sustentabilidade. 75% das 250 maiores usam.',
    content: (
      <div className="space-y-3 text-sm text-zinc-300">
        <p className="text-zinc-400 italic">Lógica: De dentro para fora — como a empresa impacta o mundo</p>
        <div>
          <p className="font-semibold text-white mb-1">Estrutura:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="font-medium text-white">GRI 1:</span> Fundamentos (princípios)</li>
            <li><span className="font-medium text-white">GRI 2:</span> Informações Gerais (perfil, governança)</li>
            <li><span className="font-medium text-white">GRI 3:</span> Temas Materiais (matriz de materialidade)</li>
            <li><span className="font-medium text-white">GRI 300:</span> Ambiental | <span className="font-medium text-white">GRI 400:</span> Social | <span className="font-medium text-white">GRI 200:</span> Econômico</li>
          </ul>
          <p className="mt-2 text-zinc-400 italic text-xs">"Não precisa reportar todos os 300+ indicadores. Identifique os materiais."</p>
        </div>
      </div>
    ),
  },
  {
    id: 'sasb', title: 'SASB — Sustainability Accounting Standards', subtitle: 'Materialidade financeira por indústria',
    color: PURPLE, icon: Building2,
    quandoUsar: 'Empresas listadas em bolsa ou que buscam investidores internacionais',
    oQueE: 'Padrão por indústria focado em materialidade financeira',
    content: (
      <div className="space-y-3 text-sm text-zinc-300">
        <p className="text-zinc-400 italic">Lógica: De fora para dentro — como o mundo impacta a empresa financeiramente</p>
        <p className="text-zinc-300">"Complementa o GRI: <span className="text-amber-400">GRI = impacto da empresa no mundo</span>. <span className="text-purple-400">SASB = risco financeiro do mundo na empresa</span>."</p>
      </div>
    ),
  },
  {
    id: 'ods', title: 'ODS — Objetivos de Desenvolvimento Sustentável', subtitle: '17 metas globais da ONU até 2030',
    color: ORANGE, icon: Globe,
    quandoUsar: 'Todas — é a bússola global. Mas NÃO abraçar todos os 17.',
    oQueE: '17 metas globais da ONU até 2030',
    content: (
      <div className="space-y-3 text-sm text-zinc-300">
        <div>
          <p className="font-semibold text-white mb-1">Agrupados:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="text-blue-400 font-medium">Pessoas:</span> ODS 1-5 (pobreza, fome, saúde, educação, igualdade)</li>
            <li><span className="text-amber-400 font-medium">Prosperidade:</span> ODS 7-11 (energia, trabalho, indústria, desigualdades, cidades)</li>
            <li><span className="text-green-400 font-medium">Planeta:</span> ODS 6, 12-15 (água, consumo, clima, oceanos, terra)</li>
            <li><span className="text-purple-400 font-medium">Paz:</span> ODS 16-17 (justiça, parcerias)</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white mb-1">Como aplicar:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Mapeie impactos na cadeia de valor</li>
            <li>Priorize 3-5 ODS (máximo!)</li>
            <li>Defina metas concretas com prazo</li>
          </ul>
          <p className="mt-2 text-zinc-400 italic text-xs">"ODS = O QUÊ (meta global). ESG = COMO (métrica interna)."</p>
        </div>
        <p className="text-zinc-500 text-xs">Referência: Natura prioriza ODS 12, 13, 15 → dados mensuráveis, rating AAA</p>
      </div>
    ),
  },
  {
    id: 'csv', title: 'CSV — Creating Shared Value (Porter)', subtitle: 'Lucro porque resolve problemas sociais',
    color: GREEN, icon: Handshake,
    quandoUsar: 'Empresas que querem lucrar PORQUE resolvem problemas sociais',
    oQueE: 'NÃO é caridade (CSR). É estratégia que gera lucro.',
    content: (
      <div className="space-y-3 text-sm text-zinc-300">
        <div>
          <p className="font-semibold text-white mb-1">3 Níveis:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="text-green-400 font-medium">Nível 1:</span> Reconceber produtos (problema social → mercado lucrativo)</li>
            <li><span className="text-blue-400 font-medium">Nível 2:</span> Redefinir cadeia (otimizar recursos → menos custo + mais impacto)</li>
            <li><span className="text-purple-400 font-medium">Nível 3:</span> Desenvolver clusters (investir no entorno → retorno operacional)</li>
          </ul>
        </div>
        <p className="text-zinc-400 italic text-xs">Exemplos: Natura Ekos, Walmart embalagens (-$3.4B), Grameen Bank</p>
      </div>
    ),
  },
  {
    id: 'ise', title: 'ISE B3 — Índice de Sustentabilidade Empresarial', subtitle: 'Selo de confiança da bolsa brasileira',
    color: BLUE, icon: Award,
    quandoUsar: 'Empresas listadas na B3 ou que querem benchmark com as melhores',
    oQueE: 'Carteira de ações da B3 com empresas sustentáveis. Selo de confiança.',
    content: (
      <div className="space-y-3 text-sm text-zinc-300">
        <p className="text-zinc-300">"Estar no ISE = opção de investimento sólida. Custo de capital menor."</p>
        <div>
          <p className="font-semibold text-white mb-1">Como funciona:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Questionário detalhado</li>
            <li>Auditoria independente</li>
            <li>Composição anual da carteira</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'greenwashing', title: 'Anti-Greenwashing', subtitle: 'Os 7 pecados do marketing verde',
    color: RED, icon: ShieldAlert,
    quandoUsar: 'SEMPRE — antes de comunicar qualquer prática sustentável',
    oQueE: 'Guia para evitar comunicação enganosa sobre sustentabilidade',
    content: (
      <div className="space-y-3 text-sm text-zinc-300">
        <div>
          <p className="font-semibold text-white mb-1">7 Pecados (TerraChoice):</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li><span className="text-red-400 font-medium">Custo Oculto</span> — destaca verde ignorando danos</li>
            <li><span className="text-red-400 font-medium">Sem Prova</span> — alegação sem certificação</li>
            <li><span className="text-red-400 font-medium">Vagueza</span> — "eco-friendly" sem especificar</li>
            <li><span className="text-red-400 font-medium">Irrelevância</span> — destaca obrigatório por lei</li>
            <li><span className="text-red-400 font-medium">Menor de Dois Males</span> — "cigarro orgânico"</li>
            <li><span className="text-red-400 font-medium">Mentira</span> — falso</li>
            <li><span className="text-red-400 font-medium">Falsos Rótulos</span> — selo inventado</li>
          </ol>
        </div>
        <p className="text-zinc-400 italic text-xs">CONAR: alegações devem ser precisas, comprováveis e não enganosas.</p>
        <p className="text-zinc-500 text-xs font-medium">Checklist: "Se qualquer resposta for não → revise antes de publicar"</p>
      </div>
    ),
  },
]

/* ── Component ── */
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
        <p className="text-zinc-400 text-sm md:text-base">
          8 frameworks de referência — quando usar, o que é, como aplicar.
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
                  <p className="text-white font-semibold text-sm truncate">{fw.title}</p>
                  <p className="text-zinc-500 text-xs truncate">{fw.subtitle}</p>
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
                    <div className="px-5 py-4 bg-zinc-900/60 space-y-3 border-t border-zinc-800">
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">Quando usar</p>
                        <p className="text-sm text-zinc-200">{fw.quandoUsar}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">O que é</p>
                        <p className="text-sm text-zinc-200">{fw.oQueE}</p>
                      </div>
                      <div className="pt-1">{fw.content}</div>
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
