'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GREEN = '#1e8449'
const RED = '#c0392b'
const AMBER = '#9a7d0a'
const BLUE = '#2e86c1'

// ── Business Model Canvas ──────────────────────────────────────────────────────

const CANVAS_BLOCKS = [
  { key: 'partners', label: 'Parcerias-chave', placeholder: 'Quem são seus aliados estratégicos?' },
  { key: 'activities', label: 'Atividades-chave', placeholder: 'O que sua empresa faz excepcionalmente bem?' },
  { key: 'resources', label: 'Recursos-chave', placeholder: 'Quais ativos são essenciais?' },
  { key: 'value', label: 'Proposta de Valor', placeholder: 'Qual problema você resolve? Qual dor elimina?' },
  { key: 'relationships', label: 'Relacionamento', placeholder: 'Que tipo de relação mantém com clientes?' },
  { key: 'channels', label: 'Canais', placeholder: 'Como você alcança e entrega valor?' },
  { key: 'segments', label: 'Segmentos de Clientes', placeholder: 'Para quem você cria valor?' },
  { key: 'costs', label: 'Estrutura de Custos', placeholder: 'Quais são os custos mais relevantes?' },
  { key: 'revenue', label: 'Fontes de Receita', placeholder: 'Como o negócio gera dinheiro?' },
]

const EXAMPLE_CANVAS: Record<string, string> = {
  partners: 'Fornecedores de matéria-prima, Marketplace (Mercado Livre), Transportadora',
  activities: 'Produção artesanal, Marketing digital, Atendimento personalizado',
  resources: 'Receitas próprias, Marca registrada, Equipe de 5 pessoas',
  value: 'Produtos naturais e artesanais, sem conservantes, entrega em 24h',
  relationships: 'Atendimento via WhatsApp, Comunidade de clientes no Instagram',
  channels: 'E-commerce próprio, Instagram, Mercado Livre',
  segments: 'Mulheres 25-45 anos, classe B, preocupadas com saúde e bem-estar',
  costs: 'Matéria-prima (40%), Embalagens (15%), Marketing (20%), Logística (15%)',
  revenue: 'Venda direta (70%), Assinatura mensal (20%), Kits corporativos (10%)',
}

export function BusinessModelCanvas() {
  const [data, setData] = useState<Record<string, string>>({})
  const filled = Object.values(data).filter(v => v.trim()).length

  const loadExample = () => setData({ ...EXAMPLE_CANVAS })
  const clear = () => setData({})

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-white/25">Business Model Canvas</p>
        <div className="flex gap-2">
          <button onClick={loadExample} className="text-[11px] px-3 py-1 rounded-lg" style={{ background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}30` }}>
            Carregar Exemplo
          </button>
          <button onClick={clear} className="text-[11px] px-3 py-1 rounded-lg text-white/30" style={{ background: 'rgba(255,255,255,0.03)' }}>
            Limpar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {CANVAS_BLOCKS.map((block) => (
          <motion.div key={block.key}
            className={`rounded-xl p-3 ${block.key === 'value' ? 'md:row-span-2' : ''} ${block.key === 'costs' || block.key === 'revenue' ? 'md:col-span-1' : ''}`}
            style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${data[block.key]?.trim() ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}` }}>
            <label className="text-[11px] font-bold uppercase tracking-wider text-white/30 block mb-1.5">{block.label}</label>
            <textarea
              value={data[block.key] || ''}
              onChange={(e) => setData(prev => ({ ...prev, [block.key]: e.target.value }))}
              placeholder={block.placeholder}
              className="w-full bg-transparent text-[13px] text-white/60 placeholder:text-white/15 resize-none outline-none leading-relaxed"
              rows={3}
            />
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 rounded-full overflow-hidden bg-white/5">
          <motion.div className="h-full rounded-full" style={{ background: GREEN, width: `${(filled / 9) * 100}%` }} />
        </div>
        <span className="text-[11px] text-white/25 font-mono">{filled}/9 blocos</span>
      </div>

      {filled === 9 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-4" style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}20` }}>
          <p className="text-[13px] font-semibold" style={{ color: GREEN }}>Canvas Completo!</p>
          <p className="text-[12px] text-white/40 mt-1">Revise cada bloco e pergunte: há coerência entre Proposta de Valor, Segmento e Canais?</p>
        </motion.div>
      )}
    </div>
  )
}

// ── Balance Sheet Builder ──────────────────────────────────────────────────────

type BSEntry = { label: string; value: number }

export function BalanceSheetBuilder() {
  const [ativoC, setAtivoC] = useState<BSEntry[]>([
    { label: 'Caixa', value: 50000 },
    { label: 'Contas a Receber', value: 80000 },
    { label: 'Estoque', value: 120000 },
  ])
  const [ativoNC, setAtivoNC] = useState<BSEntry[]>([
    { label: 'Imóveis', value: 300000 },
    { label: 'Máquinas', value: 150000 },
  ])
  const [passC, setPassC] = useState<BSEntry[]>([
    { label: 'Fornecedores', value: 60000 },
    { label: 'Salários', value: 45000 },
    { label: 'Impostos', value: 25000 },
  ])
  const [passNC, setPassNC] = useState<BSEntry[]>([
    { label: 'Financiamento LP', value: 200000 },
  ])
  const [pl, setPL] = useState<BSEntry[]>([
    { label: 'Capital Social', value: 300000 },
    { label: 'Reservas', value: 70000 },
  ])

  const sumEntries = (entries: BSEntry[]) => entries.reduce((s, e) => s + e.value, 0)
  const totalAtivo = sumEntries(ativoC) + sumEntries(ativoNC)
  const totalPassivo = sumEntries(passC) + sumEntries(passNC)
  const totalPL = sumEntries(pl)
  const totalPassivoPL = totalPassivo + totalPL
  const balanced = totalAtivo === totalPassivoPL
  const diff = totalAtivo - totalPassivoPL

  const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })

  const renderGroup = (title: string, entries: BSEntry[], setter: (e: BSEntry[]) => void, color: string) => (
    <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.15)', borderLeft: `3px solid ${color}35` }}>
      <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: `${color}` }}>{title}</p>
      {entries.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 mb-1.5">
          <input value={entry.label} onChange={(e) => { const n = [...entries]; n[i] = { ...n[i], label: e.target.value }; setter(n) }}
            className="flex-1 bg-transparent text-[12px] text-white/50 outline-none" />
          <input type="number" value={entry.value} onChange={(e) => { const n = [...entries]; n[i] = { ...n[i], value: Number(e.target.value) }; setter(n) }}
            className="w-28 bg-white/3 rounded px-2 py-1 text-right text-[12px] text-white/60 outline-none" />
        </div>
      ))}
      <p className="text-[12px] font-semibold text-right mt-2" style={{ color }}>{fmt(sumEntries(entries))}</p>
    </div>
  )

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-white/25">Balanço Patrimonial</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <p className="text-[13px] font-semibold text-white/50">ATIVO</p>
          {renderGroup('Circulante', ativoC, setAtivoC, BLUE)}
          {renderGroup('Não Circulante', ativoNC, setAtivoNC, BLUE)}
          <div className="rounded-lg p-2 text-right" style={{ background: `${BLUE}10` }}>
            <span className="text-[11px] text-white/30">Total Ativo: </span>
            <span className="text-[14px] font-bold" style={{ color: BLUE }}>{fmt(totalAtivo)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[13px] font-semibold text-white/50">PASSIVO + PL</p>
          {renderGroup('Passivo Circulante', passC, setPassC, RED)}
          {renderGroup('Passivo Não Circulante', passNC, setPassNC, AMBER)}
          {renderGroup('Patrimônio Líquido', pl, setPL, GREEN)}
          <div className="rounded-lg p-2 text-right" style={{ background: balanced ? `${GREEN}10` : `${RED}10` }}>
            <span className="text-[11px] text-white/30">Total P+PL: </span>
            <span className="text-[14px] font-bold" style={{ color: balanced ? GREEN : RED }}>{fmt(totalPassivoPL)}</span>
          </div>
        </div>
      </div>

      <motion.div className="rounded-xl p-4 text-center"
        style={{ background: balanced ? `${GREEN}08` : `${RED}08`, border: `1px solid ${balanced ? GREEN : RED}20` }}>
        {balanced ? (
          <p className="text-[14px] font-semibold" style={{ color: GREEN }}>Balanço equilibrado! Ativo = Passivo + PL</p>
        ) : (
          <div>
            <p className="text-[14px] font-semibold" style={{ color: RED }}>Balanço desequilibrado</p>
            <p className="text-[12px] text-white/40 mt-1">Diferença: {fmt(Math.abs(diff))} ({diff > 0 ? 'Ativo maior' : 'Passivo+PL maior'})</p>
          </div>
        )}
      </motion.div>

      <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.15)' }}>
        <p className="text-[11px] font-bold text-white/25 mb-2">INDICADORES</p>
        <div className="grid grid-cols-2 gap-2 text-[12px]">
          <div><span className="text-white/30">Liquidez Corrente: </span><span className="text-white/60 font-mono">{(sumEntries(ativoC) / Math.max(sumEntries(passC), 1)).toFixed(2)}</span></div>
          <div><span className="text-white/30">Endividamento: </span><span className="text-white/60 font-mono">{(totalPassivo / Math.max(totalAtivo, 1) * 100).toFixed(1)}%</span></div>
          <div><span className="text-white/30">PL/Ativo: </span><span className="text-white/60 font-mono">{(totalPL / Math.max(totalAtivo, 1) * 100).toFixed(1)}%</span></div>
          <div><span className="text-white/30">Liquidez Seca: </span><span className="text-white/60 font-mono">{((sumEntries(ativoC) - (ativoC.find(e => e.label.toLowerCase().includes('estoque'))?.value || 0)) / Math.max(sumEntries(passC), 1)).toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  )
}

// ── DRE Analyzer ───────────────────────────────────────────────────────────────

export function DREAnalyzer() {
  const [recBruta, setRecBruta] = useState(1000000)
  const [deducoes, setDeducoes] = useState(150000)
  const [cmv, setCmv] = useState(350000)
  const [despOp, setDespOp] = useState(250000)
  const [depAmort, setDepAmort] = useState(30000)
  const [despFin, setDespFin] = useState(40000)
  const [ir, setIr] = useState(0)

  const recLiq = recBruta - deducoes
  const lucroBruto = recLiq - cmv
  const ebitda = lucroBruto - despOp
  const ebit = ebitda - depAmort
  const lair = ebit - despFin
  const irCalc = ir > 0 ? ir : Math.max(lair * 0.34, 0)
  const lucroLiq = lair - irCalc

  const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
  const pct = (n: number) => recLiq > 0 ? `${(n / recLiq * 100).toFixed(1)}%` : '—'
  const color = (n: number) => n >= 0 ? GREEN : RED

  const rows = [
    { label: 'Receita Bruta', value: recBruta, setter: setRecBruta, indent: 0, calc: false },
    { label: '(–) Deduções', value: deducoes, setter: setDeducoes, indent: 0, calc: false },
    { label: '= Receita Líquida', value: recLiq, indent: 0, calc: true },
    { label: '(–) CMV / CPV', value: cmv, setter: setCmv, indent: 0, calc: false },
    { label: '= Lucro Bruto', value: lucroBruto, indent: 0, calc: true },
    { label: '(–) Despesas Operacionais', value: despOp, setter: setDespOp, indent: 0, calc: false },
    { label: '= EBITDA', value: ebitda, indent: 0, calc: true },
    { label: '(–) Depreciação e Amortização', value: depAmort, setter: setDepAmort, indent: 0, calc: false },
    { label: '= EBIT (Lucro Operacional)', value: ebit, indent: 0, calc: true },
    { label: '(–) Despesas Financeiras', value: despFin, setter: setDespFin, indent: 0, calc: false },
    { label: '= LAIR', value: lair, indent: 0, calc: true },
    { label: '(–) IR + CSLL (34%)', value: irCalc, indent: 0, calc: true },
    { label: '= Lucro Líquido', value: lucroLiq, indent: 0, calc: true },
  ]

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-white/25">DRE — Demonstração do Resultado</p>

      <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.05)' }}>
        {rows.map((row, i) => (
          <div key={i} className="flex items-center px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: row.calc ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
            <span className={`flex-1 text-[12px] ${row.calc ? 'font-semibold text-white/60' : 'text-white/40'}`}>{row.label}</span>
            {row.calc ? (
              <span className="text-[13px] font-mono font-semibold" style={{ color: color(row.value) }}>{fmt(row.value)}</span>
            ) : (
              <input type="number" value={row.value}
                onChange={(e) => row.setter?.(Number(e.target.value))}
                className="w-32 bg-white/3 rounded px-2 py-1 text-right text-[12px] text-white/60 outline-none font-mono" />
            )}
            {row.calc && <span className="text-[10px] text-white/20 ml-2 w-12 text-right font-mono">{pct(row.value)}</span>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Margem Bruta', value: pct(lucroBruto), ok: lucroBruto > 0 },
          { label: 'Margem EBITDA', value: pct(ebitda), ok: ebitda > 0 },
          { label: 'Margem Líquida', value: pct(lucroLiq), ok: lucroLiq > 0 },
        ].map((m, i) => (
          <div key={i} className="rounded-xl p-3 text-center" style={{ background: `${m.ok ? GREEN : RED}08`, border: `1px solid ${m.ok ? GREEN : RED}15` }}>
            <p className="text-[10px] text-white/25 uppercase tracking-wider">{m.label}</p>
            <p className="text-[18px] font-bold font-mono mt-1" style={{ color: m.ok ? GREEN : RED }}>{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Compound Interest Simulator ────────────────────────────────────────────────

export function CompoundInterestSim() {
  const [capital, setCapital] = useState(10000)
  const [rate, setRate] = useState(1)
  const [months, setMonths] = useState(24)

  const simpleTotal = capital + (capital * (rate / 100) * months)
  const compoundTotal = capital * Math.pow(1 + rate / 100, months)
  const diff = compoundTotal - simpleTotal

  const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })

  // Generate data points
  const points = Array.from({ length: Math.min(months + 1, 61) }, (_, i) => ({
    month: i,
    simple: capital + (capital * (rate / 100) * i),
    compound: capital * Math.pow(1 + rate / 100, i),
  }))

  const maxVal = Math.max(...points.map(p => p.compound))

  return (
    <div className="space-y-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-white/25">Juros Simples vs Compostos</p>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.15)' }}>
          <label className="text-[10px] text-white/25 uppercase tracking-wider">Capital (R$)</label>
          <input type="number" value={capital} onChange={(e) => setCapital(Number(e.target.value))}
            className="w-full bg-transparent text-[14px] text-white/60 outline-none font-mono mt-1" />
        </div>
        <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.15)' }}>
          <label className="text-[10px] text-white/25 uppercase tracking-wider">Taxa (% ao mês)</label>
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))}
            className="w-full bg-transparent text-[14px] text-white/60 outline-none font-mono mt-1" />
        </div>
        <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.15)' }}>
          <label className="text-[10px] text-white/25 uppercase tracking-wider">Período (meses)</label>
          <input type="number" value={months} onChange={(e) => setMonths(Math.min(Number(e.target.value), 360))}
            className="w-full bg-transparent text-[14px] text-white/60 outline-none font-mono mt-1" />
        </div>
      </div>

      {/* Visual bar comparison */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.15)' }}>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[11px] text-white/30">Juros Simples</span>
              <span className="text-[12px] font-mono text-white/50">{fmt(simpleTotal)}</span>
            </div>
            <div className="h-4 rounded-full overflow-hidden bg-white/5">
              <motion.div className="h-full rounded-full" style={{ background: AMBER, width: `${(simpleTotal / maxVal) * 100}%` }}
                initial={{ width: 0 }} animate={{ width: `${(simpleTotal / maxVal) * 100}%` }} transition={{ duration: 0.8 }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[11px] text-white/30">Juros Compostos</span>
              <span className="text-[12px] font-mono text-white/50">{fmt(compoundTotal)}</span>
            </div>
            <div className="h-4 rounded-full overflow-hidden bg-white/5">
              <motion.div className="h-full rounded-full" style={{ background: GREEN, width: `${(compoundTotal / maxVal) * 100}%` }}
                initial={{ width: 0 }} animate={{ width: `${(compoundTotal / maxVal) * 100}%` }} transition={{ duration: 0.8, delay: 0.2 }} />
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex justify-between">
            <span className="text-[12px] text-white/30">Diferença (compostos – simples)</span>
            <span className="text-[14px] font-bold font-mono" style={{ color: GREEN }}>+{fmt(diff)}</span>
          </div>
          <p className="text-[11px] text-white/20 mt-1">
            Compostos rendem {((diff / simpleTotal) * 100).toFixed(1)}% a mais que simples em {months} meses
          </p>
        </div>
      </div>

      {/* Mini timeline */}
      <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.1)' }}>
        <p className="text-[10px] text-white/20 uppercase tracking-wider mb-2">Evolução Mensal</p>
        <div className="flex gap-0.5 items-end h-20">
          {points.filter((_, i) => i % Math.max(1, Math.floor(points.length / 30)) === 0 || i === points.length - 1).map((p, i) => (
            <div key={i} className="flex-1 flex flex-col gap-0.5 items-center">
              <div className="w-full rounded-sm" style={{ background: GREEN, height: `${(p.compound / maxVal) * 70}px`, minHeight: 2 }} />
              <div className="w-full rounded-sm" style={{ background: AMBER, height: `${(p.simple / maxVal) * 70}px`, minHeight: 2, opacity: 0.6 }} />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-white/15 font-mono">Mês 0</span>
          <span className="text-[9px] text-white/15 font-mono">Mês {months}</span>
        </div>
      </div>
    </div>
  )
}

// ── Cash Flow Projection ───────────────────────────────────────────────────────

export function CashFlowProjection() {
  const MONTHS = ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6']
  const [receitas, setReceitas] = useState([80000, 85000, 90000, 75000, 95000, 100000])
  const [fixos, setFixos] = useState([45000, 45000, 45000, 45000, 45000, 45000])
  const [variaveis, setVariaveis] = useState([20000, 22000, 24000, 18000, 25000, 28000])
  const [saldoInicial, setSaldoInicial] = useState(30000)

  const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })

  const flows = MONTHS.map((_, i) => {
    const entrada = receitas[i]
    const saida = fixos[i] + variaveis[i]
    const fluxo = entrada - saida
    return { entrada, saida, fluxo }
  })

  const saldos = flows.reduce<number[]>((acc, f, i) => {
    const prev = i === 0 ? saldoInicial : acc[i - 1]
    acc.push(prev + f.fluxo)
    return acc
  }, [])

  const burnRate = flows.reduce((s, f) => s + f.saida, 0) / 6
  const avgFluxo = flows.reduce((s, f) => s + f.fluxo, 0) / 6
  const runway = avgFluxo < 0 ? Math.floor(saldoInicial / Math.abs(avgFluxo)) : Infinity

  const updateArr = (arr: number[], setter: (v: number[]) => void, i: number, val: number) => {
    const n = [...arr]; n[i] = val; setter(n)
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-white/25">Projeção de Fluxo de Caixa — 6 Meses</p>

      <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.15)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] text-white/30">Saldo Inicial:</span>
          <input type="number" value={saldoInicial} onChange={(e) => setSaldoInicial(Number(e.target.value))}
            className="w-32 bg-white/3 rounded px-2 py-1 text-right text-[12px] text-white/60 outline-none font-mono" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="text-white/25 uppercase tracking-wider">
                <th className="text-left py-1 pr-2"></th>
                {MONTHS.map((m, i) => <th key={i} className="text-right py-1 px-1 min-w-[90px]">{m}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-white/35 py-1.5 pr-2">Receitas</td>
                {receitas.map((v, i) => (
                  <td key={i} className="py-1.5 px-1">
                    <input type="number" value={v} onChange={(e) => updateArr(receitas, setReceitas, i, Number(e.target.value))}
                      className="w-full bg-white/3 rounded px-1 py-0.5 text-right text-[11px] text-white/60 outline-none font-mono" />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="text-white/35 py-1.5 pr-2">Custos Fixos</td>
                {fixos.map((v, i) => (
                  <td key={i} className="py-1.5 px-1">
                    <input type="number" value={v} onChange={(e) => updateArr(fixos, setFixos, i, Number(e.target.value))}
                      className="w-full bg-white/3 rounded px-1 py-0.5 text-right text-[11px] text-white/60 outline-none font-mono" />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="text-white/35 py-1.5 pr-2">Custos Variáveis</td>
                {variaveis.map((v, i) => (
                  <td key={i} className="py-1.5 px-1">
                    <input type="number" value={v} onChange={(e) => updateArr(variaveis, setVariaveis, i, Number(e.target.value))}
                      className="w-full bg-white/3 rounded px-1 py-0.5 text-right text-[11px] text-white/60 outline-none font-mono" />
                  </td>
                ))}
              </tr>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <td className="text-white/50 font-semibold py-2 pr-2">Fluxo Líquido</td>
                {flows.map((f, i) => (
                  <td key={i} className="py-2 px-1 text-right font-mono text-[11px] font-semibold" style={{ color: f.fluxo >= 0 ? GREEN : RED }}>
                    {fmt(f.fluxo)}
                  </td>
                ))}
              </tr>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <td className="text-white/50 font-semibold py-2 pr-2">Saldo Acum.</td>
                {saldos.map((s, i) => (
                  <td key={i} className="py-2 px-1 text-right font-mono text-[12px] font-bold" style={{ color: s >= 0 ? GREEN : RED }}>
                    {fmt(s)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual saldo bars */}
      <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.1)' }}>
        <div className="flex gap-2 items-end h-16">
          {saldos.map((s, i) => {
            const maxAbs = Math.max(...saldos.map(Math.abs), 1)
            const h = Math.abs(s) / maxAbs * 60
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="rounded-t" style={{ background: s >= 0 ? GREEN : RED, height: h, width: '100%', minHeight: 4 }} />
                <span className="text-[8px] text-white/20 font-mono">M{i + 1}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,0,0,0.15)' }}>
          <p className="text-[10px] text-white/25 uppercase">Burn Rate</p>
          <p className="text-[14px] font-bold font-mono text-white/60 mt-1">{fmt(burnRate)}/mês</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,0,0,0.15)' }}>
          <p className="text-[10px] text-white/25 uppercase">Fluxo Médio</p>
          <p className="text-[14px] font-bold font-mono mt-1" style={{ color: avgFluxo >= 0 ? GREEN : RED }}>{fmt(avgFluxo)}/mês</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,0,0,0.15)' }}>
          <p className="text-[10px] text-white/25 uppercase">Runway</p>
          <p className="text-[14px] font-bold font-mono mt-1" style={{ color: runway > 6 ? GREEN : runway > 3 ? AMBER : RED }}>
            {runway === Infinity ? '∞' : `${runway} meses`}
          </p>
        </div>
      </div>

      {saldos.some(s => s < 0) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-xl p-3" style={{ background: `${RED}08`, border: `1px solid ${RED}20` }}>
          <p className="text-[12px] font-semibold" style={{ color: RED }}>
            Alerta: Saldo negativo em {saldos.filter(s => s < 0).length} mês(es)!
          </p>
          <p className="text-[11px] text-white/35 mt-1">Ações: renegociar prazos, antecipar recebíveis, buscar capital de giro ou reduzir custos.</p>
        </motion.div>
      )}
    </div>
  )
}

// ── Financial Indicators Quiz ──────────────────────────────────────────────────

const FIN_SCENARIOS = [
  {
    scenario: 'Uma empresa investiu R$ 200.000 em uma campanha de marketing e gerou R$ 280.000 em receita adicional.',
    question: 'Qual é o ROI desta campanha?',
    options: ['20%', '40%', '80%', '140%'],
    correct: 1,
    explanation: 'ROI = (280.000 – 200.000) ÷ 200.000 × 100 = 40%. Para cada R$ 1 investido, retornaram R$ 1,40.',
  },
  {
    scenario: 'Empresa com Receita Líquida de R$ 500.000, CMV de R$ 200.000 e Lucro Líquido de R$ 50.000.',
    question: 'Qual a Margem Bruta e a Margem Líquida?',
    options: ['Bruta: 40%, Líquida: 10%', 'Bruta: 60%, Líquida: 10%', 'Bruta: 60%, Líquida: 15%', 'Bruta: 50%, Líquida: 10%'],
    correct: 1,
    explanation: 'Margem Bruta = (500k – 200k) ÷ 500k = 60%. Margem Líquida = 50k ÷ 500k = 10%.',
  },
  {
    scenario: 'Ativo Circulante: R$ 150.000. Passivo Circulante: R$ 100.000. Estoque: R$ 60.000.',
    question: 'Qual a Liquidez Corrente e a Liquidez Seca?',
    options: ['Corrente: 1.5, Seca: 1.5', 'Corrente: 1.5, Seca: 0.9', 'Corrente: 0.67, Seca: 0.6', 'Corrente: 2.5, Seca: 1.5'],
    correct: 1,
    explanation: 'LC = 150k ÷ 100k = 1.5. LS = (150k – 60k) ÷ 100k = 0.9. A liquidez seca exclui estoque.',
  },
  {
    scenario: 'Custos Fixos: R$ 60.000/mês. Preço de Venda: R$ 200. Custo Variável: R$ 80.',
    question: 'Qual o Ponto de Equilíbrio em unidades?',
    options: ['300 unidades', '500 unidades', '750 unidades', '1.000 unidades'],
    correct: 1,
    explanation: 'PE = 60.000 ÷ (200 – 80) = 60.000 ÷ 120 = 500 unidades. A margem de contribuição é R$ 120.',
  },
  {
    scenario: 'Custo do produto: R$ 40. Preço de venda: R$ 100.',
    question: 'Qual é o Markup e a Margem?',
    options: ['Markup: 60%, Margem: 60%', 'Markup: 150%, Margem: 60%', 'Markup: 250%, Margem: 40%', 'Markup: 100%, Margem: 60%'],
    correct: 1,
    explanation: 'Markup = (100 – 40) ÷ 40 = 150%. Margem = (100 – 40) ÷ 100 = 60%. Markup ≠ Margem!',
  },
  {
    scenario: 'EBITDA: R$ 800.000. Despesas Financeiras (juros): R$ 200.000.',
    question: 'Qual a Cobertura de Juros? É segura?',
    options: ['2.0x — Risco moderado', '4.0x — Confortável', '0.4x — Crítico', '8.0x — Excelente'],
    correct: 1,
    explanation: 'Cobertura = 800k ÷ 200k = 4.0x. Acima de 3.0x é confortável. A empresa gera 4x o valor dos juros.',
  },
]

export function FinancialIndicators() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const scenario = FIN_SCENARIOS[current]
  const answered = selected !== null

  const handleSelect = (i: number) => {
    if (answered) return
    setSelected(i)
    if (i === scenario.correct) setScore(s => s + 1)
  }

  const next = () => {
    if (current < FIN_SCENARIOS.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
    } else {
      setDone(true)
    }
  }

  if (done) {
    const pct = Math.round((score / FIN_SCENARIOS.length) * 100)
    return (
      <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${pct >= 70 ? GREEN : AMBER}20` }}>
        <p className="text-[11px] uppercase tracking-wider text-white/25 mb-2">Resultado</p>
        <p className="text-[32px] font-bold font-mono" style={{ color: pct >= 70 ? GREEN : pct >= 50 ? AMBER : RED }}>{pct}%</p>
        <p className="text-[14px] text-white/50 mt-2">{score} de {FIN_SCENARIOS.length} corretas</p>
        <p className="text-[12px] text-white/30 mt-3">
          {pct >= 80 ? 'Excelente domínio dos indicadores!' : pct >= 60 ? 'Bom conhecimento. Revise os erros.' : 'Recomendado revisar o conteúdo de indicadores financeiros.'}
        </p>
        <button onClick={() => { setCurrent(0); setSelected(null); setScore(0); setDone(false) }}
          className="mt-4 text-[12px] px-4 py-2 rounded-lg" style={{ background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}30` }}>
          Refazer Quiz
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-white/25">Quiz — Indicadores Financeiros</p>
        <span className="text-[11px] text-white/20 font-mono">{current + 1}/{FIN_SCENARIOS.length}</span>
      </div>

      <div className="flex gap-1 mb-2">
        {FIN_SCENARIOS.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full" style={{ background: i < current ? GREEN : i === current ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.06)' }} />
        ))}
      </div>

      <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[13px] text-white/55 leading-relaxed mb-3">{scenario.scenario}</p>
        <p className="text-[14px] text-white/70 font-semibold mb-4">{scenario.question}</p>

        <div className="space-y-2">
          {scenario.options.map((opt, i) => {
            const isCorrect = i === scenario.correct
            const isSelected = i === selected
            let bg = 'rgba(0,0,0,0.15)'
            let border = 'rgba(255,255,255,0.06)'
            let textColor = 'rgba(255,255,255,0.45)'
            if (answered) {
              if (isCorrect) { bg = `${GREEN}12`; border = GREEN; textColor = GREEN }
              else if (isSelected) { bg = `${RED}12`; border = RED; textColor = RED }
            }
            return (
              <button key={i} onClick={() => handleSelect(i)} disabled={answered}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-[13px] transition-all"
                style={{ background: bg, border: `1px solid ${border}`, color: textColor }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${border}` }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            )
          })}
        </div>

        <AnimatePresence>
          {answered && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
              <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.15)' }}>
                <p className="text-[12px] text-white/45 leading-relaxed">{scenario.explanation}</p>
              </div>
              <button onClick={next}
                className="mt-3 text-[12px] font-medium px-4 py-2 rounded-lg w-full"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {current < FIN_SCENARIOS.length - 1 ? 'Próxima Questão →' : 'Ver Resultado'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Export map ──────────────────────────────────────────────────────────────────

export const SIM_M2: Record<string, React.ComponentType> = {
  'business-model-canvas': BusinessModelCanvas,
  'balance-sheet-builder': BalanceSheetBuilder,
  'dre-analyzer': DREAnalyzer,
  'compound-interest': CompoundInterestSim,
  'cash-flow-projection': CashFlowProjection,
  'financial-indicators': FinancialIndicators,
}
