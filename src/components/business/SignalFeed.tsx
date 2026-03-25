'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface Signal {
  id: string
  type: 'risk' | 'opportunity' | 'info' | 'alert'
  event: string
  impact: string
  action: string
  urgency: number
}

interface SignalFeedProps {
  signals: Signal[]
}

const BORDER_COLORS: Record<Signal['type'], string> = {
  risk: 'border-l-red-900/60',
  opportunity: 'border-l-emerald-700/60',
  alert: 'border-l-amber-600/60',
  info: 'border-l-white/20',
}

const TYPE_LABELS: Record<Signal['type'], string> = {
  risk: 'RISCO',
  opportunity: 'OPORTUNIDADE',
  alert: 'ALERTA',
  info: 'INFO',
}

export default function SignalFeed({ signals }: SignalFeedProps) {
  return (
    <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: '280px' }}>
      <div className="flex items-center gap-2 px-1">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/40" />
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/25">Sinais ao Vivo</span>
      </div>
      <AnimatePresence mode="popLayout">
        {signals.map((signal, i) => (
          <motion.div
            key={signal.id}
            initial={{ opacity: 0, x: 20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: 'auto' }}
            exit={{ opacity: 0, x: -20, height: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className={`rounded-r-lg border-l-2 ${BORDER_COLORS[signal.type]} px-3 py-2`}
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-bold uppercase tracking-wider text-white/25">
                {TYPE_LABELS[signal.type]}
              </span>
              <span className="font-mono text-[9px] text-white/20">{signal.urgency}%</span>
            </div>
            <p className="mt-0.5 text-[11px] font-semibold text-white/70">{signal.event}</p>
            <p className="text-[10px] text-white/35">→ {signal.impact}</p>
            <p className="text-[10px] font-medium text-white/50">→ AÇÃO: {signal.action}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function buildSignals(data: {
  macro: { selic: { value: number; delta: number }; ipca: { value: number }; pib: { value: number }; usdBrl: { value: number } }
  centralProblems: Array<{ id: string; label: string; affected: number }>
  opportunities: Array<{ id: string; label: string; urgency: number }>
}): Signal[] {
  const signals: Signal[] = []
  const selic = data.macro.selic.value
  const ipca = data.macro.ipca.value
  const pib = data.macro.pib.value
  const usd = data.macro.usdBrl.value

  // Cadeia causal SELIC
  if (selic > 10) {
    signals.push({
      id: 'sig-selic-chain',
      type: 'alert',
      event: `SELIC ${selic.toFixed(1)}% → Crédito caro → Consumo cai → Varejo sofre`,
      impact: `Juros altos comprimem margem. ${data.centralProblems.find(p => p.id === 'credit')?.affected ?? 47}% das PMEs sem acesso a crédito. Famílias endividadas reduzem consumo.`,
      action: 'Refinanciar dívida curta, migrar para capital próprio, revisar pricing para manter volume',
      urgency: Math.min(92, Math.round(selic * 6)),
    })
  }

  // Cadeia causal Inflação
  if (ipca > 4.5) {
    signals.push({
      id: 'sig-ipca-chain',
      type: 'risk',
      event: `IPCA ${ipca.toFixed(2)}% → Poder de compra ▼ → Demanda retraída → Margem comprimida`,
      impact: `Inflação acima da meta do BC (3.25%). Custo de insumos sobe, repasse ao consumidor limitado. ${data.centralProblems.find(p => p.id === 'margin')?.affected ?? 68}% das empresas com margem comprimida.`,
      action: 'Renegociar fornecedores, otimizar mix de produtos, focar em valor percebido ao invés de preço',
      urgency: Math.min(88, Math.round(ipca * 14)),
    })
  }

  // Cadeia causal PIB positivo
  if (pib > 2) {
    signals.push({
      id: 'sig-pib-chain',
      type: 'opportunity',
      event: `PIB +${pib.toFixed(1)}% → Expansão → Emprego ▲ → Consumo ▲ → Janela de crescimento`,
      impact: `Economia crescendo acima da média histórica. Mercado de trabalho aquecido. Confiança do consumidor em alta. Setores de tecnologia (+34%) e agro (+28%) liderando.`,
      action: 'Expandir operações, investir em aquisição de clientes, aproveitar janela antes da desaceleração',
      urgency: Math.round(pib * 22),
    })
  }

  // Cadeia causal Câmbio
  if (usd > 5.3) {
    signals.push({
      id: 'sig-cambio-chain',
      type: 'alert',
      event: `Dólar R$${usd.toFixed(2)} → Importação cara → Insumos ▲ → Custo de produção ▲`,
      impact: `Real desvalorizado encarece matéria-prima importada. Tecnologia, eletrônicos e combustível mais caros. Exportadores se beneficiam (agro, mineração).`,
      action: 'Buscar fornecedores nacionais, hedge cambial para contratos em dólar, ajustar precificação',
      urgency: Math.min(80, Math.round(usd * 12)),
    })
  }

  // Oportunidades com contexto
  data.opportunities.slice(0, 2).forEach(opp => {
    signals.push({
      id: `sig-opp-${opp.id}`,
      type: 'opportunity',
      event: opp.label,
      impact: `Urgência ${opp.urgency}% — janela temporal limitada. Quem agir primeiro captura valor.`,
      action: 'Alocar orçamento de teste, validar em 30 dias, escalar se ROI > 3x',
      urgency: opp.urgency,
    })
  })

  return signals.sort((a, b) => b.urgency - a.urgency).slice(0, 5)
}
