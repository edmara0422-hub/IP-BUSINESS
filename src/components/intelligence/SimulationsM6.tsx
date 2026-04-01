'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GREEN = '#1e8449'
const RED = '#c0392b'
const AMBER = '#9a7d0a'
const BLUE = '#2e86c1'

// ── Pricing Strategy Calculator ────────────────────────────────────────────────

export function PricingStrategy() {
  const [tab, setTab] = useState<'cost' | 'value' | 'market'>('cost')
  const [custoUnit, setCustoUnit] = useState(40)
  const [markup, setMarkup] = useState(100)
  const [valorPercebido, setValorPercebido] = useState(150)
  const [comp1, setComp1] = useState(90)
  const [comp2, setComp2] = useState(110)
  const [comp3, setComp3] = useState(100)

  const fmt = (n: number) => `R$ ${n.toFixed(2)}`

  // Cost-plus
  const precoCusto = custoUnit * (1 + markup / 100)
  const margemCusto = ((precoCusto - custoUnit) / precoCusto * 100)

  // Value-based
  const precoValor = valorPercebido * 0.85 // 85% of perceived value
  const margemValor = ((precoValor - custoUnit) / precoValor * 100)

  // Market-based
  const avgComp = (comp1 + comp2 + comp3) / 3
  const precoMercado = avgComp
  const margemMercado = ((precoMercado - custoUnit) / precoMercado * 100)

  const tabs = [
    { id: 'cost' as const, label: 'Custo + Markup' },
    { id: 'value' as const, label: 'Baseado em Valor' },
    { id: 'market' as const, label: 'Baseado no Mercado' },
  ]

  return (
    <div className="space-y-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-white/25">Calculadora de Precificação</p>

      <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.15)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] text-white/30">Custo Unitário:</span>
          <input type="number" value={custoUnit} onChange={(e) => setCustoUnit(Number(e.target.value))}
            className="w-24 bg-white/3 rounded px-2 py-1 text-right text-[12px] text-white/60 outline-none font-mono" />
        </div>

        <div className="flex gap-1 mb-4">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 text-[11px] py-2 rounded-lg transition-all font-medium"
              style={{ background: tab === t.id ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.15)', color: tab === t.id ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}>
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'cost' && (
            <motion.div key="cost" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-white/30">Markup (%):</span>
                <input type="number" value={markup} onChange={(e) => setMarkup(Number(e.target.value))}
                  className="w-20 bg-white/3 rounded px-2 py-1 text-right text-[12px] text-white/60 outline-none font-mono" />
              </div>
              <div className="rounded-lg p-3 text-center" style={{ background: `${BLUE}08`, border: `1px solid ${BLUE}15` }}>
                <p className="text-[10px] text-white/25 uppercase">Preço Sugerido</p>
                <p className="text-[24px] font-bold font-mono mt-1" style={{ color: BLUE }}>{fmt(precoCusto)}</p>
                <p className="text-[11px] text-white/30">Margem: {margemCusto.toFixed(1)}%</p>
              </div>
              <p className="text-[11px] text-white/25 italic">Simples e seguro, mas ignora disposição a pagar do cliente.</p>
            </motion.div>
          )}

          {tab === 'value' && (
            <motion.div key="value" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-white/30">Valor Percebido (R$):</span>
                <input type="number" value={valorPercebido} onChange={(e) => setValorPercebido(Number(e.target.value))}
                  className="w-24 bg-white/3 rounded px-2 py-1 text-right text-[12px] text-white/60 outline-none font-mono" />
              </div>
              <div className="rounded-lg p-3 text-center" style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}15` }}>
                <p className="text-[10px] text-white/25 uppercase">Faixa de Preço Sugerida</p>
                <p className="text-[24px] font-bold font-mono mt-1" style={{ color: GREEN }}>{fmt(valorPercebido * 0.7)} — {fmt(valorPercebido * 0.9)}</p>
                <p className="text-[11px] text-white/30">Captura 70-90% do valor percebido | Margem: {margemValor.toFixed(1)}%</p>
              </div>
              <p className="text-[11px] text-white/25 italic">Maximiza receita quando marca é forte e produto diferenciado.</p>
            </motion.div>
          )}

          {tab === 'market' && (
            <motion.div key="market" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {[{ l: 'Concorrente 1', v: comp1, s: setComp1 }, { l: 'Concorrente 2', v: comp2, s: setComp2 }, { l: 'Concorrente 3', v: comp3, s: setComp3 }].map((c, i) => (
                  <div key={i}>
                    <span className="text-[10px] text-white/25">{c.l}</span>
                    <input type="number" value={c.v} onChange={(e) => c.s(Number(e.target.value))}
                      className="w-full bg-white/3 rounded px-2 py-1 text-right text-[12px] text-white/60 outline-none font-mono mt-1" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Desconto', price: avgComp * 0.85, color: AMBER },
                  { label: 'Paridade', price: avgComp, color: BLUE },
                  { label: 'Premium', price: avgComp * 1.15, color: GREEN },
                ].map((pos, i) => (
                  <div key={i} className="rounded-lg p-3 text-center" style={{ background: `${pos.color}08`, border: `1px solid ${pos.color}15` }}>
                    <p className="text-[10px] text-white/25 uppercase">{pos.label}</p>
                    <p className="text-[16px] font-bold font-mono mt-1" style={{ color: pos.color }}>{fmt(pos.price)}</p>
                    <p className="text-[10px] text-white/20">Margem: {((pos.price - custoUnit) / pos.price * 100).toFixed(0)}%</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-white/25 italic">Média dos concorrentes: {fmt(avgComp)} | Margem a paridade: {margemMercado.toFixed(1)}%</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Comparison */}
      <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.1)' }}>
        <p className="text-[10px] text-white/20 uppercase tracking-wider mb-2">Comparação dos 3 Métodos</p>
        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
          <div><span className="text-white/25">Custo</span><br /><span className="font-mono text-white/50">{fmt(precoCusto)}</span></div>
          <div><span className="text-white/25">Valor</span><br /><span className="font-mono text-white/50">{fmt(precoValor)}</span></div>
          <div><span className="text-white/25">Mercado</span><br /><span className="font-mono text-white/50">{fmt(precoMercado)}</span></div>
        </div>
      </div>
    </div>
  )
}

// ── Break-Even Calculator ──────────────────────────────────────────────────────

export function BreakevenCalc() {
  const [custosFixos, setCustosFixos] = useState(30000)
  const [precoVenda, setPrecoVenda] = useState(100)
  const [custoVar, setCustoVar] = useState(40)
  const [unidadesVendidas, setUnidadesVendidas] = useState(600)

  const mc = precoVenda - custoVar
  const mcPct = precoVenda > 0 ? (mc / precoVenda * 100) : 0
  const peUnid = mc > 0 ? Math.ceil(custosFixos / mc) : Infinity
  const peReais = peUnid * precoVenda
  const lucro = (unidadesVendidas * mc) - custosFixos
  const acimaPE = unidadesVendidas > peUnid

  const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })

  return (
    <div className="space-y-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-white/25">Ponto de Equilíbrio</p>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Custos Fixos/mês', value: custosFixos, setter: setCustosFixos },
          { label: 'Preço de Venda', value: precoVenda, setter: setPrecoVenda },
          { label: 'Custo Variável/un.', value: custoVar, setter: setCustoVar },
          { label: 'Unidades Vendidas', value: unidadesVendidas, setter: setUnidadesVendidas },
        ].map((field, i) => (
          <div key={i} className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.15)' }}>
            <label className="text-[10px] text-white/25 uppercase tracking-wider">{field.label}</label>
            <input type="number" value={field.value} onChange={(e) => field.setter(Number(e.target.value))}
              className="w-full bg-transparent text-[14px] text-white/60 outline-none font-mono mt-1" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl p-3 text-center" style={{ background: `${BLUE}08`, border: `1px solid ${BLUE}15` }}>
          <p className="text-[10px] text-white/25 uppercase">MC/Unidade</p>
          <p className="text-[18px] font-bold font-mono mt-1" style={{ color: mc > 0 ? BLUE : RED }}>{fmt(mc)}</p>
          <p className="text-[10px] text-white/20">{mcPct.toFixed(1)}%</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: `${AMBER}08`, border: `1px solid ${AMBER}15` }}>
          <p className="text-[10px] text-white/25 uppercase">Break-Even</p>
          <p className="text-[18px] font-bold font-mono mt-1" style={{ color: AMBER }}>{peUnid === Infinity ? '∞' : peUnid} un.</p>
          <p className="text-[10px] text-white/20">{peUnid === Infinity ? '—' : fmt(peReais)}</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: `${acimaPE ? GREEN : RED}08`, border: `1px solid ${acimaPE ? GREEN : RED}15` }}>
          <p className="text-[10px] text-white/25 uppercase">{lucro >= 0 ? 'Lucro' : 'Prejuízo'}</p>
          <p className="text-[18px] font-bold font-mono mt-1" style={{ color: acimaPE ? GREEN : RED }}>{fmt(lucro)}</p>
          <p className="text-[10px] text-white/20">{unidadesVendidas} vendidas</p>
        </div>
      </div>

      {/* Visual bar */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.15)' }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] text-white/20">0</span>
          <div className="flex-1 relative h-6 rounded-full overflow-hidden bg-white/5">
            {peUnid !== Infinity && (
              <>
                <div className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${Math.min((unidadesVendidas / Math.max(peUnid * 1.5, 1)) * 100, 100)}%`, background: acimaPE ? GREEN : RED, opacity: 0.3 }} />
                <div className="absolute inset-y-0 flex items-center"
                  style={{ left: `${Math.min((peUnid / (peUnid * 1.5)) * 100, 100)}%` }}>
                  <div className="w-0.5 h-full bg-white/30" />
                </div>
              </>
            )}
          </div>
          <span className="text-[10px] text-white/20 font-mono">{peUnid !== Infinity ? Math.ceil(peUnid * 1.5) : '—'}</span>
        </div>
        <div className="flex justify-between text-[9px] text-white/15">
          <span>Prejuízo</span>
          <span>← PE: {peUnid} un. →</span>
          <span>Lucro</span>
        </div>
      </div>

      {mc <= 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-xl p-3" style={{ background: `${RED}08`, border: `1px solid ${RED}20` }}>
          <p className="text-[12px] font-semibold" style={{ color: RED }}>Margem de Contribuição negativa!</p>
          <p className="text-[11px] text-white/35 mt-1">Cada unidade vendida AUMENTA o prejuízo. Revise preço ou custo variável antes de qualquer outra ação.</p>
        </motion.div>
      )}
    </div>
  )
}

// ── Valuation Simulator ────────────────────────────────────────────────────────

const SECTORS = [
  { name: 'SaaS / Tecnologia', multiple: 12, range: '8–15x' },
  { name: 'E-commerce / Varejo', multiple: 8, range: '6–10x' },
  { name: 'Indústria', multiple: 5.5, range: '4–7x' },
  { name: 'Serviços Profissionais', multiple: 6, range: '4–8x' },
  { name: 'Agronegócio', multiple: 6.5, range: '5–8x' },
  { name: 'Saúde', multiple: 10, range: '7–13x' },
  { name: 'Educação', multiple: 7, range: '5–9x' },
  { name: 'Alimentação', multiple: 5, range: '3–7x' },
]

export function ValuationSimulator() {
  const [method, setMethod] = useState<'multiples' | 'dcf'>('multiples')
  const [sectorIdx, setSectorIdx] = useState(0)
  const [ebitda, setEbitda] = useState(500000)
  const [fcl, setFcl] = useState(400000)
  const [growth, setGrowth] = useState(10)
  const [discount, setDiscount] = useState(15)
  const [years, setYears] = useState(5)

  const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })

  const sector = SECTORS[sectorIdx]
  const valMultiples = ebitda * sector.multiple
  const valMultMin = ebitda * (sector.multiple - 2)
  const valMultMax = ebitda * (sector.multiple + 2)

  // Simplified DCF
  let dcfValue = 0
  for (let i = 1; i <= years; i++) {
    const cashflow = fcl * Math.pow(1 + growth / 100, i)
    dcfValue += cashflow / Math.pow(1 + discount / 100, i)
  }
  // Terminal value (perpetuity growth 3%)
  const terminalCF = fcl * Math.pow(1 + growth / 100, years + 1)
  const terminalValue = terminalCF / ((discount / 100) - 0.03)
  const pvTerminal = terminalValue / Math.pow(1 + discount / 100, years)
  dcfValue += pvTerminal

  return (
    <div className="space-y-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-white/25">Simulador de Valuation</p>

      <div className="flex gap-1 mb-2">
        {(['multiples', 'dcf'] as const).map(m => (
          <button key={m} onClick={() => setMethod(m)}
            className="flex-1 text-[11px] py-2 rounded-lg transition-all font-medium"
            style={{ background: method === m ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.15)', color: method === m ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}>
            {m === 'multiples' ? 'Múltiplos de Mercado' : 'DCF Simplificado'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {method === 'multiples' ? (
          <motion.div key="mult" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.15)' }}>
              <label className="text-[10px] text-white/25 uppercase tracking-wider block mb-2">Setor</label>
              <div className="flex flex-wrap gap-1.5">
                {SECTORS.map((s, i) => (
                  <button key={i} onClick={() => setSectorIdx(i)}
                    className="text-[10px] px-2.5 py-1.5 rounded-lg transition-all"
                    style={{ background: sectorIdx === i ? `${BLUE}20` : 'rgba(0,0,0,0.2)', color: sectorIdx === i ? BLUE : 'rgba(255,255,255,0.35)', border: `1px solid ${sectorIdx === i ? `${BLUE}40` : 'rgba(255,255,255,0.05)'}` }}>
                    {s.name}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-white/20 mt-2">EV/EBITDA típico: {sector.range} (usando {sector.multiple}x)</p>
            </div>

            <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.15)' }}>
              <label className="text-[10px] text-white/25 uppercase tracking-wider">EBITDA Anual (R$)</label>
              <input type="number" value={ebitda} onChange={(e) => setEbitda(Number(e.target.value))}
                className="w-full bg-transparent text-[16px] text-white/60 outline-none font-mono mt-1" />
            </div>

            <div className="rounded-xl p-4 text-center" style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}15` }}>
              <p className="text-[10px] text-white/25 uppercase">Valuation Estimado</p>
              <p className="text-[28px] font-bold font-mono mt-1" style={{ color: GREEN }}>{fmt(valMultiples)}</p>
              <p className="text-[11px] text-white/25 mt-1">Faixa: {fmt(valMultMin)} — {fmt(valMultMax)}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="dcf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'FCL Atual (R$/ano)', value: fcl, setter: setFcl },
                { label: 'Crescimento (%/ano)', value: growth, setter: setGrowth },
                { label: 'Taxa Desconto (%)', value: discount, setter: setDiscount },
                { label: 'Período (anos)', value: years, setter: setYears },
              ].map((f, i) => (
                <div key={i} className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.15)' }}>
                  <label className="text-[10px] text-white/25 uppercase tracking-wider">{f.label}</label>
                  <input type="number" value={f.value} onChange={(e) => f.setter(Number(e.target.value))}
                    className="w-full bg-transparent text-[14px] text-white/60 outline-none font-mono mt-1" />
                </div>
              ))}
            </div>

            <div className="rounded-xl p-4 text-center" style={{ background: `${BLUE}08`, border: `1px solid ${BLUE}15` }}>
              <p className="text-[10px] text-white/25 uppercase">Enterprise Value (DCF)</p>
              <p className="text-[28px] font-bold font-mono mt-1" style={{ color: BLUE }}>{fmt(dcfValue)}</p>
              <p className="text-[11px] text-white/25 mt-1">VP dos Fluxos + Valor Terminal (perpetuidade a 3%)</p>
            </div>

            {discount <= growth && (
              <div className="rounded-xl p-3" style={{ background: `${RED}08`, border: `1px solid ${RED}20` }}>
                <p className="text-[11px]" style={{ color: RED }}>Taxa de desconto deve ser maior que a taxa de crescimento para o modelo convergir.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side-by-side comparison */}
      <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.1)' }}>
        <p className="text-[10px] text-white/20 uppercase tracking-wider mb-2">Comparação</p>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <p className="text-[10px] text-white/25">Múltiplos ({sector.multiple}x EBITDA)</p>
            <p className="text-[16px] font-bold font-mono" style={{ color: GREEN }}>{fmt(valMultiples)}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/25">DCF ({years} anos + terminal)</p>
            <p className="text-[16px] font-bold font-mono" style={{ color: BLUE }}>{fmt(dcfValue)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Ethics Decision Tree ───────────────────────────────────────────────────────

const DILEMMAS = [
  {
    title: 'O Algoritmo Discriminatório',
    situation: 'Sua IA de RH rejeita 3x mais currículos de candidatos de periferias. O modelo é mais "eficiente" assim — menos turnover. O que você faz?',
    actions: [
      'Manter o modelo como está — os números comprovam eficiência',
      'Corrigir o viés mesmo que aumente o turnover temporariamente',
      'Desativar a IA e voltar à seleção manual',
    ],
    frameworks: [
      { name: 'Utilitarismo', supports: [1], reason: 'Maior bem social: eliminar discriminação beneficia mais pessoas a longo prazo' },
      { name: 'Deontologia', supports: [1, 2], reason: 'Discriminar é errado independentemente dos resultados — viola dignidade humana' },
      { name: 'Virtudes', supports: [1], reason: 'Uma empresa virtuosa não lucra com discriminação' },
      { name: 'Contratualismo', supports: [1, 2], reason: 'Se você fosse o candidato de periferia, aceitaria esse sistema?' },
    ],
  },
  {
    title: 'O Dado do Cliente',
    situation: 'Seu app coleta localização dos usuários. Um parceiro oferece R$ 500k/ano pelos dados anonimizados. Os Termos de Uso permitem, mas os usuários não sabem na prática.',
    actions: [
      'Vender — está nos Termos, é legal',
      'Vender, mas notificar os usuários com transparência',
      'Recusar a oferta e não vender dados de localização',
    ],
    frameworks: [
      { name: 'Utilitarismo', supports: [1], reason: 'R$ 500k pode financiar melhorias no app que beneficiam todos os usuários' },
      { name: 'Deontologia', supports: [2, 2], reason: 'Legal ≠ ético. Consentimento deve ser informado e explícito' },
      { name: 'Virtudes', supports: [2], reason: 'Transparência é virtude fundamental — esconder é vício' },
      { name: 'Contratualismo', supports: [2], reason: 'Você gostaria que seus dados fossem vendidos sem seu conhecimento real?' },
    ],
  },
  {
    title: 'A Automação que Demite',
    situation: 'Automatizar o atendimento vai eliminar 30 postos de trabalho, mas reduz custos em 40%. Os funcionários são de uma cidade pequena sem outras vagas.',
    actions: [
      'Automatizar imediatamente para garantir competitividade',
      'Automatizar gradualmente com programa de requalificação e realocação',
      'Não automatizar para preservar os empregos',
    ],
    frameworks: [
      { name: 'Utilitarismo', supports: [1], reason: 'Maximiza eficiência e sobrevivência da empresa (mais empregos a longo prazo)' },
      { name: 'Deontologia', supports: [1], reason: 'Há obrigação moral de minimizar o dano — transição responsável' },
      { name: 'Virtudes', supports: [1], reason: 'Coragem para mudar + compaixão para fazer direito' },
      { name: 'Contratualismo', supports: [1], reason: 'Justiça: quem perde emprego merece suporte na transição' },
    ],
  },
  {
    title: 'O Relatório ESG',
    situation: 'Seu time de sustentabilidade quer publicar métricas ESG, mas os números reais de emissões são 30% piores que o esperado. O marketing quer publicar só os indicadores positivos.',
    actions: [
      'Publicar apenas métricas positivas — é marketing, não auditoria',
      'Publicar todos os dados com plano de melhoria transparente',
      'Não publicar relatório ESG este ano',
    ],
    frameworks: [
      { name: 'Utilitarismo', supports: [1], reason: 'Transparência constrói confiança de longo prazo, que vale mais que imagem temporária' },
      { name: 'Deontologia', supports: [1], reason: 'Omitir dados negativos é enganar — viola o dever de honestidade' },
      { name: 'Virtudes', supports: [1], reason: 'Integridade: dizer a verdade mesmo quando é difícil' },
      { name: 'Contratualismo', supports: [1], reason: 'Stakeholders merecem informação completa para decidir' },
    ],
  },
  {
    title: 'O Fornecedor Barato',
    situation: 'Descobriu que seu fornecedor mais barato usa trabalho infantil em parte da cadeia. Trocar aumentaria custos em 25%. A concorrência usa o mesmo fornecedor.',
    actions: [
      'Manter — se todos usam, a culpa é sistêmica, não sua',
      'Trocar de fornecedor e absorver o custo, comunicando ao mercado',
      'Exigir certificação do fornecedor antes de romper contrato',
    ],
    frameworks: [
      { name: 'Utilitarismo', supports: [1, 2], reason: 'Trocar + comunicar gera pressão de mercado que pode eliminar a prática para todos' },
      { name: 'Deontologia', supports: [1, 2], reason: 'Trabalho infantil é errado — lucrar com ele é inadmissível em qualquer circunstância' },
      { name: 'Virtudes', supports: [1], reason: 'Justiça e coragem exigem ação, não cumplicidade' },
      { name: 'Contratualismo', supports: [1], reason: 'Se fosse seu filho, aceitaria? A posição original exige proteção dos mais vulneráveis' },
    ],
  },
]

export function EthicsDecisionTree() {
  const [current, setCurrent] = useState(0)
  const [choices, setChoices] = useState<number[]>([])
  const [showAnalysis, setShowAnalysis] = useState(false)

  const dilemma = DILEMMAS[current]
  const answered = choices.length > current
  const allDone = choices.length === DILEMMAS.length

  const handleChoice = (i: number) => {
    if (answered) return
    setChoices(prev => [...prev, i])
    setShowAnalysis(true)
  }

  const next = () => {
    setShowAnalysis(false)
    setCurrent(c => c + 1)
  }

  if (allDone) {
    // Calculate alignment with each framework
    const alignment: Record<string, number> = { Utilitarismo: 0, Deontologia: 0, Virtudes: 0, Contratualismo: 0 }
    DILEMMAS.forEach((d, i) => {
      d.frameworks.forEach(f => {
        if (f.supports.includes(choices[i])) alignment[f.name]++
      })
    })
    const maxAlign = Math.max(...Object.values(alignment))

    return (
      <div className="space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-white/25">Seu Perfil Ético</p>
        <div className="space-y-2">
          {Object.entries(alignment).map(([name, score]) => (
            <div key={name} className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.15)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] text-white/50 font-medium">{name}</span>
                <span className="text-[12px] font-mono" style={{ color: score === maxAlign ? GREEN : 'rgba(255,255,255,0.4)' }}>{score}/{DILEMMAS.length}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden bg-white/5">
                <div className="h-full rounded-full transition-all" style={{ width: `${(score / DILEMMAS.length) * 100}%`, background: score === maxAlign ? GREEN : 'rgba(255,255,255,0.2)' }} />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-4" style={{ background: `${BLUE}08`, border: `1px solid ${BLUE}15` }}>
          <p className="text-[13px] text-white/50">Seus critérios de decisão se alinham mais com <strong className="text-white/70">{Object.entries(alignment).find(([, s]) => s === maxAlign)?.[0]}</strong>.</p>
          <p className="text-[11px] text-white/30 mt-2">Nenhum framework é "melhor" — o importante é ter consciência dos seus padrões decisórios.</p>
        </div>
        <button onClick={() => { setCurrent(0); setChoices([]); setShowAnalysis(false) }}
          className="text-[12px] px-4 py-2 rounded-lg w-full" style={{ background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}30` }}>
          Refazer
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-white/25">Dilema Ético</p>
        <span className="text-[11px] text-white/20 font-mono">{current + 1}/{DILEMMAS.length}</span>
      </div>

      <div className="flex gap-1">
        {DILEMMAS.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full" style={{ background: i < current ? GREEN : i === current ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.06)' }} />
        ))}
      </div>

      <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[14px] font-semibold text-white/65 mb-2">{dilemma.title}</p>
        <p className="text-[13px] text-white/45 leading-relaxed mb-4">{dilemma.situation}</p>

        <div className="space-y-2">
          {dilemma.actions.map((action, i) => (
            <button key={i} onClick={() => handleChoice(i)} disabled={answered}
              className="w-full text-left px-3 py-2.5 rounded-lg text-[13px] transition-all"
              style={{
                background: answered && choices[current] === i ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.15)',
                border: `1px solid ${answered && choices[current] === i ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}`,
                color: answered && choices[current] === i ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)',
              }}>
              <span className="font-mono text-[11px] mr-2">{String.fromCharCode(65 + i)}.</span>{action}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showAnalysis && answered && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/20">Análise pelos 4 Frameworks</p>
            {dilemma.frameworks.map((f, i) => {
              const supports = f.supports.includes(choices[current])
              return (
                <div key={i} className="rounded-lg p-3 flex items-start gap-2"
                  style={{ background: supports ? `${GREEN}06` : 'rgba(0,0,0,0.1)', borderLeft: `3px solid ${supports ? GREEN : 'rgba(255,255,255,0.06)'}` }}>
                  <div>
                    <span className="text-[11px] font-semibold" style={{ color: supports ? GREEN : 'rgba(255,255,255,0.3)' }}>{f.name}</span>
                    <span className="text-[10px] text-white/20 ml-2">{supports ? '✓ Alinhado' : '✗ Diverge'}</span>
                    <p className="text-[11px] text-white/30 mt-0.5">{f.reason}</p>
                  </div>
                </div>
              )
            })}
            <button onClick={next}
              className="mt-2 text-[12px] font-medium px-4 py-2 rounded-lg w-full"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {current < DILEMMAS.length - 1 ? 'Próximo Dilema →' : 'Ver Perfil Ético'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Export map ──────────────────────────────────────────────────────────────────

export const SIM_M6: Record<string, React.ComponentType> = {
  'pricing-strategy': PricingStrategy,
  'breakeven-calc': BreakevenCalc,
  'valuation-sim': ValuationSimulator,
  'ethics-decision-tree': EthicsDecisionTree,
}
