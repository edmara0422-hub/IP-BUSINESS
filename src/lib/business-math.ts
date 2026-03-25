import Decimal from 'decimal.js'

export type BusinessModuleKey =
  | 'command'
  | 'scenarios'
  | 'twin'
  | 'market'
  | 'compliance'
  | 'people'
  | 'model'
  | 'innovation'
  | 'pricing'

export interface BusinessInputs {
  monthlyRevenue: number
  fixedCosts: number
  operatingExpenses: number
  variableCostRate: number
  cashReserve: number
  pricePerUnit: number
  unitsSold: number
  cac: number
  ltv: number
  leads: number
  conversionRate: number
  inventoryValue: number
  cogs: number
  equity: number
  plannedInvestment: number
  expectedReturn: number
  growthRate: number
  inflationRate: number
  fxRate: number
  gdpRate: number
  teamCost: number
  ethicsRisk: number
  esgInvestment: number
  taxExposure: number
}

export interface BusinessSnapshot {
  revenue: number
  variableCosts: number
  totalCosts: number
  profit: number
  marginPct: number
  contributionMargin: number
  contributionMarginPct: number
  breakEvenRevenue: number
  breakEvenUnits: number
  burnRate: number
  runwayMonths: number
  roiPct: number
  roePct: number
  ltvCac: number
  ebitda: number
  inventoryTurnover: number
  projectedRevenue6m: number
  projectedProfit6m: number
  projectedRevenue12m: number
  stressIndex: number
  healthScore: number
  revenuePerLead: number
  diagnostics: string[]
  isConfigured: boolean
  filledRequiredFields: number
  requiredFieldCount: number
}

export interface ScenarioSeriesPoint {
  month: string
  realisticRevenue: number
  realisticProfit: number
  optimisticRevenue: number
  pessimisticRevenue: number
  cashReserve: number
}

export interface ScenarioVariant {
  label: string
  revenue: number
  profit: number
  marginPct: number
  burnRate: number
  runwayMonths: number
}

const zero = new Decimal(0)

function dec(value: number) {
  if (!Number.isFinite(value)) return zero
  return new Decimal(value)
}

function toNumber(value: Decimal) {
  return Number(value.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toString())
}

function safeDivide(numerator: Decimal, denominator: Decimal) {
  return denominator.eq(0) ? zero : numerator.div(denominator)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function adjustGrowth(inputs: BusinessInputs) {
  const inflationDrag = inputs.inflationRate * 0.32
  const fxDrag = Math.max(inputs.fxRate - 5, 0) * 1.8
  const gdpBoost = inputs.gdpRate * 0.65
  return inputs.growthRate + gdpBoost - inflationDrag - fxDrag
}

const requiredCockpitFields: Array<keyof BusinessInputs> = [
  'monthlyRevenue',
  'operatingExpenses',
  'cashReserve',
  'pricePerUnit',
  'cac',
  'ltv',
]

export function getBusinessInputProgress(inputs: BusinessInputs) {
  const filledRequiredFields = requiredCockpitFields.filter((field) => inputs[field] > 0).length

  return {
    filledRequiredFields,
    requiredFieldCount: requiredCockpitFields.length,
    isConfigured: filledRequiredFields === requiredCockpitFields.length,
  }
}

export const defaultBusinessInputs: BusinessInputs = {
  monthlyRevenue: 0,
  fixedCosts: 0,
  operatingExpenses: 0,
  variableCostRate: 0,
  cashReserve: 0,
  pricePerUnit: 0,
  unitsSold: 0,
  cac: 0,
  ltv: 0,
  leads: 0,
  conversionRate: 0,
  inventoryValue: 0,
  cogs: 0,
  equity: 0,
  plannedInvestment: 0,
  expectedReturn: 0,
  growthRate: 0,
  inflationRate: 0,
  fxRate: 0,
  gdpRate: 0,
  teamCost: 0,
  ethicsRisk: 0,
  esgInvestment: 0,
  taxExposure: 0,
}

export function computeBusinessSnapshot(inputs: BusinessInputs): BusinessSnapshot {
  const progress = getBusinessInputProgress(inputs)
  const revenue = dec(inputs.monthlyRevenue)
  const variableCosts = revenue.mul(dec(inputs.variableCostRate))
  const fixedCosts = dec(inputs.fixedCosts)
  const operatingExpenses = dec(inputs.operatingExpenses)
  const teamCost = dec(inputs.teamCost)
  const esgInvestment = dec(inputs.esgInvestment)
  const totalCosts = fixedCosts.plus(operatingExpenses).plus(teamCost).plus(variableCosts).plus(esgInvestment)
  const profit = revenue.minus(totalCosts)

  const contributionMargin = revenue.minus(variableCosts)
  const contributionMarginPct = safeDivide(contributionMargin, revenue)
  const breakEvenRevenue = contributionMarginPct.eq(0) ? zero : fixedCosts.plus(operatingExpenses).plus(teamCost).div(contributionMarginPct)

  const unitVariableCost = dec(inputs.pricePerUnit).mul(dec(inputs.variableCostRate))
  const unitContribution = dec(inputs.pricePerUnit).minus(unitVariableCost)
  const breakEvenUnits = unitContribution.lte(0)
    ? zero
    : fixedCosts.plus(operatingExpenses).plus(teamCost).div(unitContribution)

  const burnRate = Decimal.max(totalCosts.minus(revenue), zero)
  const runwayMonths = burnRate.eq(0) ? new Decimal(24) : dec(inputs.cashReserve).div(burnRate)

  const roiPct = safeDivide(dec(inputs.expectedReturn).minus(dec(inputs.plannedInvestment)), dec(inputs.plannedInvestment)).mul(100)
  const roePct = safeDivide(profit, dec(inputs.equity)).mul(100)
  const ltvCac = safeDivide(dec(inputs.ltv), dec(inputs.cac))
  const ebitda = revenue.minus(variableCosts).minus(fixedCosts).minus(operatingExpenses)
  const inventoryTurnover = safeDivide(dec(inputs.cogs), dec(inputs.inventoryValue))
  const revenuePerLead = safeDivide(revenue, dec(inputs.leads))

  const adjustedGrowth = adjustGrowth(inputs) / 100
  const projectedRevenue6m = revenue.mul(new Decimal(1 + adjustedGrowth).pow(6))
  const projectedProfit6m = projectedRevenue6m.minus(totalCosts.mul(6))
  const projectedRevenue12m = revenue.mul(new Decimal(1 + adjustedGrowth).pow(12))

  const stressIndex = clamp(
    inputs.inflationRate * 5 + Math.max(inputs.fxRate - 5, 0) * 12 + Number(burnRate.div(1000)) + inputs.ethicsRisk * 0.8,
    0,
    100,
  )

  const healthScore = clamp(
    100 -
      stressIndex * 0.42 +
      Number(clamp(toNumber(ltvCac.mul(8)), 0, 32)) +
      Number(clamp(toNumber(safeDivide(profit, revenue).mul(120)), -20, 20)) +
      Number(clamp(toNumber(runwayMonths), 0, 18)),
    12,
    98,
  )

  const diagnostics: string[] = []

  if (!progress.isConfigured) {
    diagnostics.push('Preencha a base mínima do cockpit ou conecte um arquivo para liberar a leitura oficial.')
  } else {
    if (ltvCac.lt(3)) diagnostics.push('Modelo de aquisição sob pressão. O LTV/CAC está abaixo da faixa recomendada.')
    if (profit.lt(0)) diagnostics.push('Queima operacional ativa. Reduza custos ou ajuste precificação imediatamente.')
    if (runwayMonths.lt(8)) diagnostics.push('Runway curto. O caixa exige defesa nos próximos meses.')
    if (contributionMarginPct.lt(0.45)) diagnostics.push('Margem de contribuição comprimida. Custos variáveis estão drenando escala.')
    if (inputs.ethicsRisk > 55) diagnostics.push('Risco ético elevado. O score de compliance precisa de intervenção antes de escalar.')
    if (diagnostics.length === 0) diagnostics.push('Estrutura financeira saudável, com espaço para expansão e testes estratégicos.')
  }

  return {
    revenue: toNumber(revenue),
    variableCosts: toNumber(variableCosts),
    totalCosts: toNumber(totalCosts),
    profit: toNumber(profit),
    marginPct: toNumber(safeDivide(profit, revenue).mul(100)),
    contributionMargin: toNumber(contributionMargin),
    contributionMarginPct: toNumber(contributionMarginPct.mul(100)),
    breakEvenRevenue: toNumber(breakEvenRevenue),
    breakEvenUnits: toNumber(breakEvenUnits),
    burnRate: toNumber(burnRate),
    runwayMonths: toNumber(runwayMonths),
    roiPct: toNumber(roiPct),
    roePct: toNumber(roePct),
    ltvCac: toNumber(ltvCac),
    ebitda: toNumber(ebitda),
    inventoryTurnover: toNumber(inventoryTurnover),
    projectedRevenue6m: toNumber(projectedRevenue6m),
    projectedProfit6m: toNumber(projectedProfit6m),
    projectedRevenue12m: toNumber(projectedRevenue12m),
    stressIndex,
    healthScore,
    revenuePerLead: toNumber(revenuePerLead),
    diagnostics,
    isConfigured: progress.isConfigured,
    filledRequiredFields: progress.filledRequiredFields,
    requiredFieldCount: progress.requiredFieldCount,
  }
}

export function buildScenarioVariants(inputs: BusinessInputs): ScenarioVariant[] {
  const presets = [
    { label: 'Otimista', revenueFactor: 1.2, costFactor: 0.92 },
    { label: 'Realista', revenueFactor: 1, costFactor: 1 },
    { label: 'Pessimista', revenueFactor: 0.8, costFactor: 1.12 },
  ]

  return presets.map((preset) => {
    const scenarioInputs: BusinessInputs = {
      ...inputs,
      monthlyRevenue: Number((inputs.monthlyRevenue * preset.revenueFactor).toFixed(2)),
      fixedCosts: Number((inputs.fixedCosts * preset.costFactor).toFixed(2)),
      operatingExpenses: Number((inputs.operatingExpenses * preset.costFactor).toFixed(2)),
      teamCost: Number((inputs.teamCost * preset.costFactor).toFixed(2)),
    }

    const snapshot = computeBusinessSnapshot(scenarioInputs)

    return {
      label: preset.label,
      revenue: snapshot.revenue,
      profit: snapshot.profit,
      marginPct: snapshot.marginPct,
      burnRate: snapshot.burnRate,
      runwayMonths: snapshot.runwayMonths,
    }
  })
}

export function buildScenarioSeries(inputs: BusinessInputs, months = 12): ScenarioSeriesPoint[] {
  const totalCosts = computeBusinessSnapshot(inputs).totalCosts
  const adjustedGrowth = adjustGrowth(inputs) / 100
  let cashReserve = inputs.cashReserve

  return Array.from({ length: months }, (_, index) => {
    const month = `M${index + 1}`
    const realisticRevenue = Number((inputs.monthlyRevenue * Math.pow(1 + adjustedGrowth, index)).toFixed(2))
    const optimisticRevenue = Number((realisticRevenue * 1.18).toFixed(2))
    const pessimisticRevenue = Number((realisticRevenue * 0.82).toFixed(2))
    const realisticProfit = Number((realisticRevenue - totalCosts).toFixed(2))

    cashReserve = Number((cashReserve + realisticProfit).toFixed(2))

    return {
      month,
      realisticRevenue,
      realisticProfit,
      optimisticRevenue,
      pessimisticRevenue,
      cashReserve,
    }
  })
}

export function buildAdvisorSummary(snapshot: BusinessSnapshot) {
  if (!snapshot.isConfigured) {
    return {
      primary: 'A base do cockpit ainda está incompleta.',
      recommendation: 'Preencha receita, despesas, caixa, preço, CAC e LTV ou conecte um arquivo da empresa.',
      narrative: `Base mínima preenchida: ${snapshot.filledRequiredFields}/${snapshot.requiredFieldCount} campos obrigatórios.`,
    }
  }

  const primary = snapshot.diagnostics[0]
  const recommendation =
    snapshot.ltvCac < 3
      ? 'Aumente ticket medio, reduza CAC e segmente canais de melhor retorno.'
      : snapshot.runwayMonths < 8
        ? 'Defenda caixa, corte custos nao essenciais e priorize receita recorrente.'
        : snapshot.marginPct < 18
          ? 'Revisar precificacao e custos variaveis para recuperar margem operacional.'
          : 'Expandir com testes controlados de mercado e monitoramento continuo.'

  return {
    primary,
    recommendation,
    narrative: `Health ${snapshot.healthScore}. Margem ${snapshot.marginPct.toFixed(1)}%, runway ${snapshot.runwayMonths.toFixed(1)} meses, LTV/CAC ${snapshot.ltvCac.toFixed(2)}.`,
  }
}
