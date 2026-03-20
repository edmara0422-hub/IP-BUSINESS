'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── TBL Diagnostic ──────────────────────────────────────────────────────────

const TBL_COMPANIES = [
  {
    name: 'EcoTêxtil Ltda',
    sector: 'Indústria Têxtil',
    description: 'Fábrica de roupas com 200 funcionários no interior de SC. Exporta para Europa.',
    data: {
      profit: { revenue: 'R$ 45M/ano', growth: '+12%', jobs: 210, rdInvest: '1.2%' },
      people: { training: '8h/ano', genderGap: '28%', turnover: '35%', accidents: 12, communityInvest: '0.3%' },
      planet: { co2: '1.200 tCO2/ano', waterUse: '850m³/dia', recycleRate: '22%', renewableEnergy: '5%', riverDischarge: 'Sim, com tratamento básico' },
    },
    insights: {
      profit: 'Financeiramente saudável, mas P&D baixo indica risco de obsolescência',
      people: 'Turnover alto (35%) e gap salarial de 28% indicam problemas graves de retenção e equidade',
      planet: 'Apenas 5% renovável e descarte em rio são red flags para exportação EU (CSRD)',
    },
  },
  {
    name: 'AgroVerde S.A.',
    sector: 'Agronegócio',
    description: 'Cooperativa de soja orgânica com 1.500 produtores associados no MT.',
    data: {
      profit: { revenue: 'R$ 320M/ano', growth: '+8%', jobs: 4800, rdInvest: '3.1%' },
      people: { training: '32h/ano', genderGap: '12%', turnover: '8%', accidents: 3, communityInvest: '2.8%' },
      planet: { co2: '15.000 tCO2/ano', waterUse: '2.100m³/dia', recycleRate: '68%', renewableEnergy: '42%', riverDischarge: 'Não. Sistema fechado de reúso' },
    },
    insights: {
      profit: 'Modelo cooperativo distribui valor. P&D alto para o setor. Base sólida.',
      people: 'Excelente em treinamento e comunidade. Gap de gênero aceitável mas pode melhorar.',
      planet: 'Emissões altas pelo setor, mas reúso de água e 42% renovável são diferenciais reais.',
    },
  },
  {
    name: 'TechPay Digital',
    sector: 'Fintech',
    description: 'Startup de pagamentos com 80 funcionários em SP. Série B de R$ 50M.',
    data: {
      profit: { revenue: 'R$ 18M/ano', growth: '+85%', jobs: 80, rdInvest: '22%' },
      people: { training: '64h/ano', genderGap: '5%', turnover: '22%', accidents: 0, communityInvest: '0.1%' },
      planet: { co2: '45 tCO2/ano', waterUse: '12m³/dia', recycleRate: '91%', renewableEnergy: '100%', riverDischarge: 'N/A' },
    },
    insights: {
      profit: 'Crescimento acelerado com alto investimento em P&D. Modelo de venture capital.',
      people: 'Excelente em equidade. Turnover de 22% é normal para startups. Pouco investimento na comunidade.',
      planet: 'Pegada ambiental mínima. 100% renovável. O risco ESG está na governança, não no ambiente.',
    },
  },
  {
    name: 'Mineração Atlântica',
    sector: 'Mineração',
    description: 'Mineradora de ferro com 3.000 funcionários em MG. Listada na B3.',
    data: {
      profit: { revenue: 'R$ 2.8B/ano', growth: '+3%', jobs: 3200, rdInvest: '0.8%' },
      people: { training: '16h/ano', genderGap: '38%', turnover: '11%', accidents: 28, communityInvest: '1.2%' },
      planet: { co2: '180.000 tCO2/ano', waterUse: '45.000m³/dia', recycleRate: '34%', renewableEnergy: '15%', riverDischarge: 'Sim, barragem de rejeitos classe C' },
    },
    insights: {
      profit: 'Alta receita mas crescimento estagnado e P&D muito baixo. Dependência de commodity.',
      people: 'Gap salarial de 38% e 28 acidentes/ano são problemas sérios. Risco regulatório.',
      planet: 'Altíssimo impacto ambiental. Barragem classe C é risco catastrófico (Brumadinho). Rating ESG comprometido.',
    },
  },
]

const PILLARS = ['profit', 'people', 'planet'] as const
const PILLAR_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  profit: { label: 'Profit', icon: '$', color: '#4ade80' },
  people: { label: 'People', icon: '♡', color: '#60a5fa' },
  planet: { label: 'Planet', icon: '◉', color: '#a78bfa' },
}

export function TBLDiagnostic() {
  const [companyIdx, setCompanyIdx] = useState(0)
  const [scores, setScores] = useState<Record<number, Record<string, number>>>({})
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})
  const [activePillar, setActivePillar] = useState<string>('profit')

  const company = TBL_COMPANIES[companyIdx]
  const myScores = scores[companyIdx] || {}
  const isRevealed = revealed[companyIdx] || false
  const pillarData = company.data[activePillar as keyof typeof company.data]

  const setScore = (pillar: string, val: number) => {
    setScores(prev => ({ ...prev, [companyIdx]: { ...prev[companyIdx], [pillar]: val } }))
  }

  const canReveal = PILLARS.every(p => myScores[p] !== undefined)

  return (
    <div className="space-y-4">
      {/* Company selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TBL_COMPANIES.map((c, i) => (
          <button key={i} onClick={() => { setCompanyIdx(i); setActivePillar('profit') }}
            className={`shrink-0 rounded-[0.75rem] border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all ${
              companyIdx === i ? 'border-white/20 bg-white/[0.08] text-white/88' : 'border-white/[0.06] text-white/28 hover:text-white/54'
            }`}>
            {String(i + 1).padStart(2, '0')}
          </button>
        ))}
      </div>

      {/* Company info */}
      <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">{company.sector}</p>
          <p className="mt-1 text-[1rem] font-semibold text-white/90">{company.name}</p>
          <p className="mt-1 text-[12px] text-white/44">{company.description}</p>
        </div>

        {/* Pillar tabs */}
        <div className="flex gap-2">
          {PILLARS.map(p => (
            <button key={p} onClick={() => setActivePillar(p)}
              className={`flex-1 rounded-[0.7rem] border px-3 py-2 text-center transition-all ${
                activePillar === p ? 'border-white/20 bg-white/[0.06]' : 'border-white/[0.06] hover:border-white/12'
              }`}>
              <span className="text-[11px] font-bold" style={{ color: PILLAR_LABELS[p].color }}>
                {PILLAR_LABELS[p].icon} {PILLAR_LABELS[p].label}
              </span>
            </button>
          ))}
        </div>

        {/* Pillar data */}
        <AnimatePresence mode="wait">
          <motion.div key={activePillar} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="space-y-2">
            {Object.entries(pillarData).map(([key, val]) => (
              <div key={key} className="flex justify-between items-center rounded-[0.6rem] border border-white/[0.04] px-3 py-2">
                <p className="text-[11px] text-white/40">{formatLabel(key)}</p>
                <p className="text-[12px] font-medium text-white/72">{String(val)}</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Score input */}
        <div className="space-y-2">
          <p className="text-[9px] uppercase tracking-[0.22em] text-white/28">Sua avaliação — {PILLAR_LABELS[activePillar].label}</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => setScore(activePillar, n)}
                className={`flex-1 rounded-[0.6rem] border py-2 text-[12px] font-bold transition-all ${
                  myScores[activePillar] === n
                    ? 'border-white/30 bg-white/[0.1] text-white/90'
                    : 'border-white/[0.06] text-white/28 hover:text-white/56'
                }`}>
                {n}
              </button>
            ))}
          </div>
          <p className="text-[9px] text-white/20 text-center">1 = Crítico · 3 = Razoável · 5 = Excelente</p>
        </div>

        {/* Reveal */}
        {canReveal && !isRevealed && (
          <button onClick={() => setRevealed(prev => ({ ...prev, [companyIdx]: true }))}
            className="w-full rounded-[0.8rem] border border-white/20 bg-white/[0.06] py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:bg-white/[0.1] transition-all">
            Revelar Análise
          </button>
        )}

        {isRevealed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-2 border-t border-white/[0.06]">
            {PILLARS.map(p => (
              <div key={p} className="rounded-[0.8rem] border border-white/[0.06] p-3 space-y-1" style={{ background: 'rgba(255,255,255,0.015)' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: PILLAR_LABELS[p].color }}>
                  {PILLAR_LABELS[p].label} — Sua nota: {myScores[p]}/5
                </p>
                <p className="text-[12px] text-white/56 leading-relaxed">{company.insights[p as keyof typeof company.insights]}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button onClick={() => { setCompanyIdx(i => Math.max(0, i - 1)); setActivePillar('profit') }}
          disabled={companyIdx === 0}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">← Anterior</button>
        <p className="text-[10px] text-white/24">{companyIdx + 1}/{TBL_COMPANIES.length}</p>
        <button onClick={() => { setCompanyIdx(i => Math.min(TBL_COMPANIES.length - 1, i + 1)); setActivePillar('profit') }}
          disabled={companyIdx === TBL_COMPANIES.length - 1}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">Próxima →</button>
      </div>
    </div>
  )
}

function formatLabel(key: string): string {
  const map: Record<string, string> = {
    revenue: 'Receita', growth: 'Crescimento', jobs: 'Empregos', rdInvest: 'Investimento P&D',
    training: 'Treinamento/ano', genderGap: 'Gap salarial gênero', turnover: 'Turnover', accidents: 'Acidentes/ano', communityInvest: 'Investimento comunidade',
    co2: 'Emissões CO2', waterUse: 'Consumo água', recycleRate: 'Taxa reciclagem', renewableEnergy: 'Energia renovável', riverDischarge: 'Descarte em rio',
  }
  return map[key] || key
}

// ── ESG Rating ──────────────────────────────────────────────────────────────

const ESG_COMPANIES = [
  {
    name: 'Natura &Co',
    sector: 'Cosméticos',
    metrics: {
      E: [
        { label: 'Emissões Escopo 1+2', value: '-33% desde 2012', good: true },
        { label: 'Energia renovável', value: '83% da matriz', good: true },
        { label: 'Embalagens recicladas', value: '47% do total', good: true },
        { label: 'Água por unidade produzida', value: '-25% em 5 anos', good: true },
      ],
      S: [
        { label: 'Mulheres na liderança', value: '56%', good: true },
        { label: 'Comunidades fornecedoras', value: '38 comunidades amazônicas', good: true },
        { label: 'eNPS', value: '72 (excelente)', good: true },
        { label: 'Gap salarial', value: '6%', good: true },
      ],
      G: [
        { label: 'Conselheiros independentes', value: '60%', good: true },
        { label: 'Metas ESG no bônus', value: 'Sim, 20% do variável', good: true },
        { label: 'Canal de denúncias', value: 'Independente (Deloitte)', good: true },
        { label: 'Separação CEO/Presidente', value: 'Sim', good: true },
      ],
    },
    officialRating: 'MSCI: AAA',
    analysis: 'Referência global em ESG. Modelo de negócio intrinsecamente ligado à sustentabilidade (bioingredientes amazônicos). Rating AAA reflete integração real, não cosmética.',
  },
  {
    name: 'Petrobras',
    sector: 'Óleo & Gás',
    metrics: {
      E: [
        { label: 'Emissões Escopo 1+2', value: '59M tCO2eq/ano', good: false },
        { label: 'Meta Net-Zero', value: '2050 (Escopo 1+2 apenas)', good: false },
        { label: 'Investimento em renováveis', value: '6% do CAPEX', good: false },
        { label: 'Vazamentos registrados', value: '12 incidentes/ano', good: false },
      ],
      S: [
        { label: 'Mulheres na liderança', value: '19%', good: false },
        { label: 'Acidentes fatais', value: '2 em 2023', good: false },
        { label: 'Investimento social', value: 'R$ 1.2B/ano', good: true },
        { label: 'Programa de diversidade', value: 'Em implementação', good: false },
      ],
      G: [
        { label: 'Conselheiros independentes', value: '45%', good: false },
        { label: 'Histórico de corrupção', value: 'Lava-Jato (R$ 6.2B em multas)', good: false },
        { label: 'Canal de denúncias', value: 'Interno reestruturado', good: true },
        { label: 'Transparência fiscal', value: 'Relatório EITI publicado', good: true },
      ],
    },
    officialRating: 'MSCI: BBB',
    analysis: 'Setor de alto impacto ambiental limita o rating. Governança melhorou pós-Lava-Jato mas histórico pesa. Investimento social alto, mas métricas de diversidade e segurança precisam avançar.',
  },
  {
    name: 'Magazine Luiza',
    sector: 'Varejo',
    metrics: {
      E: [
        { label: 'Emissões Escopo 1+2', value: '18.000 tCO2/ano', good: true },
        { label: 'Logística reversa', value: '32% de eletrônicos coletados', good: true },
        { label: 'Energia renovável', value: '78% (lojas com solar)', good: true },
        { label: 'Gestão de resíduos', value: '61% reciclagem', good: true },
      ],
      S: [
        { label: 'Mulheres na liderança', value: '47% (CEO mulher)', good: true },
        { label: 'Programa racial', value: 'Trainee exclusivo para negros', good: true },
        { label: 'Turnover', value: '28%', good: false },
        { label: 'Salário médio vs mercado', value: '-8% abaixo', good: false },
      ],
      G: [
        { label: 'Conselheiros independentes', value: '55%', good: true },
        { label: 'Metas ESG no bônus', value: 'Sim, 15% do variável', good: true },
        { label: 'Comitê de sustentabilidade', value: 'Ativo desde 2020', good: true },
        { label: 'Conflito de interesses', value: 'Família fundadora no conselho', good: false },
      ],
    },
    officialRating: 'MSCI: A',
    analysis: 'Forte em diversidade e inclusão (referência no Brasil). Ambiental sólido para o setor. Governança boa mas concentração familiar é ponto de atenção para investidores institucionais.',
  },
]

const ESG_PILLARS = ['E', 'S', 'G'] as const
const ESG_COLORS: Record<string, string> = { E: '#4ade80', S: '#60a5fa', G: '#f59e0b' }
const RATING_SCALE = ['CCC', 'B', 'BB', 'BBB', 'A', 'AA', 'AAA']

export function ESGRating() {
  const [companyIdx, setCompanyIdx] = useState(0)
  const [pillar, setPillar] = useState<string>('E')
  const [ratings, setRatings] = useState<Record<number, Record<string, number>>>({})
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  const company = ESG_COMPANIES[companyIdx]
  const myRatings = ratings[companyIdx] || {}
  const isRevealed = revealed[companyIdx] || false
  const canReveal = ESG_PILLARS.every(p => myRatings[p] !== undefined)

  const setRating = (p: string, val: number) => {
    setRatings(prev => ({ ...prev, [companyIdx]: { ...prev[companyIdx], [p]: val } }))
  }

  const avgRating = canReveal ? Math.round(ESG_PILLARS.reduce((sum, p) => sum + (myRatings[p] || 0), 0) / 3) : 0

  return (
    <div className="space-y-4">
      {/* Company selector */}
      <div className="flex gap-2">
        {ESG_COMPANIES.map((c, i) => (
          <button key={i} onClick={() => { setCompanyIdx(i); setPillar('E') }}
            className={`flex-1 rounded-[0.75rem] border px-2 py-2 text-[10px] font-semibold transition-all text-center ${
              companyIdx === i ? 'border-white/20 bg-white/[0.08] text-white/88' : 'border-white/[0.06] text-white/28 hover:text-white/54'
            }`}>
            {c.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">{company.sector}</p>
          <p className="mt-1 text-[1rem] font-semibold text-white/90">{company.name}</p>
        </div>

        {/* E/S/G tabs */}
        <div className="flex gap-2">
          {ESG_PILLARS.map(p => (
            <button key={p} onClick={() => setPillar(p)}
              className={`flex-1 rounded-[0.7rem] border px-3 py-2 text-center transition-all ${
                pillar === p ? 'border-white/20 bg-white/[0.06]' : 'border-white/[0.06]'
              }`}>
              <span className="text-[12px] font-bold" style={{ color: ESG_COLORS[p] }}>
                {p === 'E' ? 'Environmental' : p === 'S' ? 'Social' : 'Governance'}
              </span>
            </button>
          ))}
        </div>

        {/* Metrics */}
        <AnimatePresence mode="wait">
          <motion.div key={pillar} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="space-y-2">
            {company.metrics[pillar as keyof typeof company.metrics].map((m, i) => (
              <div key={i} className="flex justify-between items-center rounded-[0.6rem] border border-white/[0.04] px-3 py-2">
                <p className="text-[11px] text-white/40">{m.label}</p>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-medium text-white/72">{m.value}</p>
                  <span className={`text-[10px] ${m.good ? 'text-green-400' : 'text-red-400'}`}>{m.good ? '●' : '●'}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Rating input */}
        <div className="space-y-2">
          <p className="text-[9px] uppercase tracking-[0.22em] text-white/28">Seu rating — Pilar {pillar}</p>
          <div className="flex gap-1">
            {RATING_SCALE.map((r, i) => (
              <button key={r} onClick={() => setRating(pillar, i)}
                className={`flex-1 rounded-[0.5rem] border py-1.5 text-[9px] font-bold transition-all ${
                  myRatings[pillar] === i ? 'border-white/30 bg-white/[0.12] text-white/90' : 'border-white/[0.06] text-white/24 hover:text-white/50'
                }`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Reveal */}
        {canReveal && !isRevealed && (
          <button onClick={() => setRevealed(prev => ({ ...prev, [companyIdx]: true }))}
            className="w-full rounded-[0.8rem] border border-white/20 bg-white/[0.06] py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:bg-white/[0.1] transition-all">
            Revelar Rating Oficial
          </button>
        )}

        {isRevealed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-[0.8rem] border border-white/[0.08] p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/28">Seu Rating Geral</p>
                <p className="text-[18px] font-bold text-white/72">{RATING_SCALE[avgRating]}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/28">Rating Oficial</p>
                <p className="text-[18px] font-bold text-white/90">{company.officialRating}</p>
              </div>
            </div>
            <p className="text-[12px] text-white/50 leading-relaxed">{company.analysis}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ── GRI vs SASB Choice ──────────────────────────────────────────────────────

const FRAMEWORK_SCENARIOS = [
  {
    name: 'NovaBio Startup',
    profile: 'Startup de biotecnologia com 15 funcionários. Pré-revenue. Buscando investidor anjo.',
    answer: 'gri',
    explanation: 'Pré-revenue e sem investidores institucionais — SASB é prematuro. GRI Core simplificado permite construir cultura de transparência desde cedo. Foco: materialidade dos 3-5 temas mais relevantes.',
  },
  {
    name: 'Siderúrgica Nacional',
    profile: 'Siderúrgica com 8.000 funcionários. Listada na B3 e NYSE. Fundos ESG representam 40% dos investidores.',
    answer: 'both',
    explanation: 'Dupla materialidade obrigatória. GRI para stakeholders amplos + SASB para comparabilidade com pares do setor (investidores exigem). Se opera na UE: CSRD adicional.',
  },
  {
    name: 'Cooperativa Café Sul',
    profile: 'Cooperativa de café com 800 produtores. Exporta para Europa via fair trade. Sem presença em bolsa.',
    answer: 'gri',
    explanation: 'Cooperativa não tem investidores de capital. GRI atende múltiplos stakeholders (cooperados, compradores europeus, certificadoras). SASB não agrega valor aqui. Atenção: CSRD pode impactar indiretamente via cadeia de valor dos clientes europeus.',
  },
  {
    name: 'DataCloud S.A.',
    profile: 'Empresa de cloud computing com 200 funcionários. IPO planejado para 2027. Clientes B2B globais.',
    answer: 'sasb',
    explanation: 'IPO iminente torna SASB prioritário — investidores institucionais usam SASB para comparar com AWS, Azure, GCP. Setor: Technology & Communications. Métricas-chave: consumo energético dos data centers, privacidade de dados.',
  },
  {
    name: 'ONG Educação Viva',
    profile: 'ONG educacional com 50 funcionários. Financiada por fundações e governo. Atende 12.000 alunos/ano.',
    answer: 'gri',
    explanation: 'ONGs não têm investidores de capital — SASB é irrelevante. GRI permite reportar impacto social (número de beneficiários, qualidade educacional) para financiadores e governo. Conectar com ODS 4 (Educação de Qualidade).',
  },
]

export function GRISASBChoice() {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  const scenario = FRAMEWORK_SCENARIOS[idx]
  const myAnswer = answers[idx]
  const isRevealed = revealed[idx] || false
  const isCorrect = myAnswer === scenario.answer

  const options = [
    { key: 'gri', label: 'GRI', desc: 'Multi-stakeholder' },
    { key: 'sasb', label: 'SASB', desc: 'Investidores' },
    { key: 'both', label: 'Ambos', desc: 'Dupla materialidade' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FRAMEWORK_SCENARIOS.map((_, i) => {
          const done = revealed[i]
          const correct = answers[i] === FRAMEWORK_SCENARIOS[i].answer
          return (
            <button key={i} onClick={() => setIdx(i)}
              className={`shrink-0 rounded-[0.75rem] border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all ${
                idx === i ? 'border-white/20 bg-white/[0.08] text-white/88'
                  : done ? (correct ? 'border-green-500/30 text-green-400/60' : 'border-red-500/30 text-red-400/60')
                    : 'border-white/[0.06] text-white/28'
              }`}>
              {String(i + 1).padStart(2, '0')}
            </button>
          )
        })}
      </div>

      <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">Cenário {idx + 1}/{FRAMEWORK_SCENARIOS.length}</p>
          <p className="mt-1 text-[1rem] font-semibold text-white/90">{scenario.name}</p>
          <p className="mt-2 text-[13px] text-white/56 leading-relaxed">{scenario.profile}</p>
        </div>

        <div className="space-y-2">
          <p className="text-[9px] uppercase tracking-[0.22em] text-white/28">Qual framework é mais adequado?</p>
          <div className="flex gap-2">
            {options.map(o => (
              <button key={o.key} onClick={() => !isRevealed && setAnswers(prev => ({ ...prev, [idx]: o.key }))}
                className={`flex-1 rounded-[0.7rem] border px-2 py-3 text-center transition-all ${
                  myAnswer === o.key
                    ? (isRevealed ? (o.key === scenario.answer ? 'border-green-500/40 bg-green-500/[0.08]' : 'border-red-500/40 bg-red-500/[0.08]') : 'border-white/20 bg-white/[0.08]')
                    : (isRevealed && o.key === scenario.answer ? 'border-green-500/30 bg-green-500/[0.04]' : 'border-white/[0.06]')
                }`}>
                <p className="text-[12px] font-bold text-white/72">{o.label}</p>
                <p className="text-[9px] text-white/28 mt-0.5">{o.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {myAnswer && !isRevealed && (
          <button onClick={() => setRevealed(prev => ({ ...prev, [idx]: true }))}
            className="w-full rounded-[0.8rem] border border-white/20 bg-white/[0.06] py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:bg-white/[0.1] transition-all">
            Verificar Resposta
          </button>
        )}

        {isRevealed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-[0.8rem] border p-4 ${isCorrect ? 'border-green-500/20' : 'border-amber-500/20'}`}
            style={{ background: isCorrect ? 'rgba(34,197,94,0.04)' : 'rgba(245,158,11,0.04)' }}>
            <p className="text-[11px] font-bold mb-1" style={{ color: isCorrect ? '#4ade80' : '#f59e0b' }}>
              {isCorrect ? 'Correto!' : `Resposta: ${options.find(o => o.key === scenario.answer)?.label}`}
            </p>
            <p className="text-[12px] text-white/56 leading-relaxed">{scenario.explanation}</p>
          </motion.div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">← Anterior</button>
        <button onClick={() => setIdx(i => Math.min(FRAMEWORK_SCENARIOS.length - 1, i + 1))} disabled={idx === FRAMEWORK_SCENARIOS.length - 1}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">Próximo →</button>
      </div>
    </div>
  )
}

// ── CSV Finder ──────────────────────────────────────────────────────────────

const CSV_SCENARIOS = [
  {
    name: 'Rede de Farmácias Vida',
    context: 'Rede de 120 farmácias no Nordeste. Região com alta prevalência de diabetes (18% da população). Muitos clientes compram insulina mas não têm acesso a orientação nutricional.',
    opportunities: [
      { level: 'Produto', title: 'Consultório nutricional nas farmácias', impact: 'Reduz complicações diabéticas → menos internações → mais fidelização. Receita: R$ 80/consulta × 500 consultas/mês = R$ 480K/ano', social: 'Saúde preventiva para 6.000 pacientes/ano. Redução de 30% em hospitalizações evitáveis.' },
      { level: 'Cadeia', title: 'Central de distribuição regional', impact: 'Reduz custo logístico em 22% (R$ 3.2M/ano). Elimina intermediários, melhora margem.', social: 'Gera 45 empregos diretos na região. Reduz perda de medicamentos por validade (de 8% para 2%).' },
      { level: 'Cluster', title: 'Parceria com escolas de farmácia locais', impact: 'Forma técnicos qualificados. Reduz custo de recrutamento em 40%.', social: 'Acesso a formação profissional para 200 jovens/ano. Fortalece ecossistema de saúde regional.' },
    ],
  },
  {
    name: 'Construtora Horizonte',
    context: 'Construtora de médio porte em BH. Déficit habitacional na região: 180.000 famílias. Material de construção desperdiçado nos canteiros: 12% do total.',
    opportunities: [
      { level: 'Produto', title: 'Habitação popular modular', impact: 'Novo mercado: 180K famílias. Ticket menor mas volume alto. Receita estimada: R$ 150M/ano em 3 anos.', social: 'Moradia digna para 2.000 famílias/ano. Redução do déficit habitacional de 1.1%/ano.' },
      { level: 'Cadeia', title: 'Logística reversa de materiais', impact: 'Reaproveitamento de 80% dos resíduos → economia de R$ 4.5M/ano em materiais.', social: 'Elimina 3.200 toneladas de resíduo em aterro/ano. Gera renda para cooperativas de reciclagem.' },
      { level: 'Cluster', title: 'Escola de construção civil para comunidades', impact: 'Mão-de-obra qualificada local. Reduz importação de profissionais (-25% custo).', social: 'Capacita 500 trabalhadores/ano. Renda média dos formados sobe 60%.' },
    ],
  },
  {
    name: 'Banco Conecta',
    context: 'Banco digital com 2M de clientes. 40% dos clientes são microempreendedores sem acesso a crédito adequado. Taxa de inadimplência: 8.5%.',
    opportunities: [
      { level: 'Produto', title: 'Microcrédito com mentoria', impact: 'Reduz inadimplência de 8.5% para 3.2% (modelo Grameen). Expansão de carteira: +R$ 800M em microcrédito.', social: '50.000 microempreendedores com acesso a capital e orientação. Formalização de 15.000 MEIs.' },
      { level: 'Cadeia', title: 'Score ESG para fornecedores', impact: 'Antecipa riscos na cadeia. Reduz perdas por compliance em 35%.', social: 'Eleva padrão ESG de 200 fornecedores. Efeito cascata na cadeia produtiva.' },
      { level: 'Cluster', title: 'Hub de empreendedorismo nas comunidades', impact: 'Aumenta base de clientes qualificados. LTV sobe 2.3x para clientes do hub.', social: 'Espaço de capacitação para 10.000 empreendedores/ano. Rede de negócios local fortalecida.' },
    ],
  },
  {
    name: 'AgroTech Sementes',
    context: 'Empresa de sementes geneticamente melhoradas. Pequenos agricultores (70% dos clientes) não conseguem usar o produto em potencial máximo por falta de assistência técnica.',
    opportunities: [
      { level: 'Produto', title: 'Kit semente + assistência técnica digital', impact: 'Produtividade dos clientes sobe 40%. Recompra aumenta de 62% para 89%. Receita: +R$ 25M/ano.', social: 'Renda de 12.000 pequenos agricultores aumenta em média 35%. Segurança alimentar regional.' },
      { level: 'Cadeia', title: 'Compra garantida da safra', impact: 'Elimina intermediários. Margem do agricultor sobe 28%. Qualidade da matéria-prima garantida.', social: 'Estabilidade financeira para 8.000 famílias. Reduz êxodo rural.' },
      { level: 'Cluster', title: 'Centro de pesquisa agrícola aberto', impact: 'Acesso a P&D compartilhado. Inovação aberta acelera desenvolvimento de novos produtos em 50%.', social: 'Pesquisa adaptada a condições locais. Formação de 300 técnicos agrícolas/ano.' },
    ],
  },
]

const LEVEL_COLORS: Record<string, string> = { Produto: '#4ade80', Cadeia: '#60a5fa', Cluster: '#a78bfa' }

export function CSVFinder() {
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState<Record<number, Record<number, boolean>>>({})

  const scenario = CSV_SCENARIOS[idx]

  const toggleReveal = (oppIdx: number) => {
    setRevealed(prev => ({
      ...prev,
      [idx]: { ...prev[idx], [oppIdx]: !(prev[idx]?.[oppIdx]) },
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CSV_SCENARIOS.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`shrink-0 rounded-[0.75rem] border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all ${
              idx === i ? 'border-white/20 bg-white/[0.08] text-white/88' : 'border-white/[0.06] text-white/28 hover:text-white/54'
            }`}>
            {String(i + 1).padStart(2, '0')}
          </button>
        ))}
      </div>

      <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">Cenário {idx + 1}</p>
          <p className="mt-1 text-[1rem] font-semibold text-white/90">{scenario.name}</p>
          <p className="mt-2 text-[13px] text-white/50 leading-relaxed">{scenario.context}</p>
        </div>

        <p className="text-[9px] uppercase tracking-[0.22em] text-white/28">Oportunidades de Valor Compartilhado</p>

        {scenario.opportunities.map((opp, i) => {
          const isOpen = revealed[idx]?.[i] || false
          return (
            <motion.div key={i} layout className="rounded-[0.9rem] border border-white/[0.06] overflow-hidden" style={{ background: 'rgba(255,255,255,0.015)' }}>
              <button onClick={() => toggleReveal(i)} className="w-full px-4 py-3 flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  <span className="shrink-0 rounded-[0.5rem] px-2 py-1 text-[9px] font-bold uppercase" style={{ color: LEVEL_COLORS[opp.level], border: `1px solid ${LEVEL_COLORS[opp.level]}33` }}>
                    {opp.level}
                  </span>
                  <p className="text-[12px] font-medium text-white/72">{opp.title}</p>
                </div>
                <span className="text-white/28 text-[12px]">{isOpen ? '−' : '+'}</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4 space-y-2 overflow-hidden">
                    <div className="rounded-[0.6rem] border border-green-500/10 px-3 py-2" style={{ background: 'rgba(34,197,94,0.03)' }}>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-green-400/50 mb-1">Impacto Financeiro</p>
                      <p className="text-[11px] text-white/56 leading-relaxed">{opp.impact}</p>
                    </div>
                    <div className="rounded-[0.6rem] border border-blue-500/10 px-3 py-2" style={{ background: 'rgba(96,165,250,0.03)' }}>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-blue-400/50 mb-1">Impacto Social</p>
                      <p className="text-[11px] text-white/56 leading-relaxed">{opp.social}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      <div className="flex justify-between items-center">
        <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">← Anterior</button>
        <button onClick={() => setIdx(i => Math.min(CSV_SCENARIOS.length - 1, i + 1))} disabled={idx === CSV_SCENARIOS.length - 1}
          className="text-[10px] uppercase tracking-[0.18em] text-white/28 hover:text-white/56 disabled:opacity-20">Próximo →</button>
      </div>
    </div>
  )
}

// ── Sustainability Diagnostic (integrador) ──────────────────────────────────

const DIAG_DIMENSIONS = [
  { id: 'tbl', label: 'Triple Bottom Line', desc: 'Equilíbrio People, Planet, Profit' },
  { id: 'esg', label: 'Maturidade ESG', desc: 'Prontidão para investidores e rating' },
  { id: 'reporting', label: 'Reporte', desc: 'Qualidade do relato (GRI/SASB)' },
  { id: 'ods', label: 'Alinhamento ODS', desc: 'Conexão com Agenda 2030' },
  { id: 'csv', label: 'Valor Compartilhado', desc: 'Lucro via impacto social' },
  { id: 'greenwashing', label: 'Risco Greenwashing', desc: 'Substância vs aparência' },
]

const MATURITY_LEVELS = [
  { min: 0, max: 1.5, label: 'Inexistente', color: '#ef4444', advice: 'Sustentabilidade ainda não faz parte da gestão. Comece pelo diagnóstico TBL e priorize 3 ODS.' },
  { min: 1.5, max: 2.5, label: 'Inicial', color: '#f97316', advice: 'Iniciativas pontuais sem integração. Estruture o ESG e defina metas mensuráveis para 12 meses.' },
  { min: 2.5, max: 3.5, label: 'Em Desenvolvimento', color: '#eab308', advice: 'Processos em construção. Implemente GRI Core e vincule metas ESG ao bônus da liderança.' },
  { min: 3.5, max: 4.5, label: 'Consolidado', color: '#22c55e', advice: 'Base sólida. Adote dupla materialidade (GRI+SASB) e busque oportunidades de CSV.' },
  { min: 4.5, max: 5.1, label: 'Referência', color: '#3b82f6', advice: 'Excelência. Explore capitalismo regenerativo e lidere a transformação no seu setor.' },
]

export function SustainabilityDiagnostic() {
  const [scores, setScores] = useState<Record<string, number>>({})
  const allFilled = DIAG_DIMENSIONS.every(d => scores[d.id] !== undefined)
  const avg = allFilled ? DIAG_DIMENSIONS.reduce((s, d) => s + (scores[d.id] || 0), 0) / DIAG_DIMENSIONS.length : 0
  const level = MATURITY_LEVELS.find(l => avg >= l.min && avg < l.max) || MATURITY_LEVELS[0]

  return (
    <div className="space-y-4">
      <p className="text-[9px] uppercase tracking-[0.28em] text-white/28">Avalie sua empresa em 6 dimensões de sustentabilidade</p>

      <div className="space-y-3">
        {DIAG_DIMENSIONS.map(dim => (
          <div key={dim.id} className="rounded-[0.9rem] border border-white/[0.06] p-4 space-y-2" style={{ background: 'rgba(255,255,255,0.015)' }}>
            <div>
              <p className="text-[12px] font-semibold text-white/72">{dim.label}</p>
              <p className="text-[10px] text-white/32">{dim.desc}</p>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setScores(prev => ({ ...prev, [dim.id]: n }))}
                  className={`flex-1 rounded-[0.5rem] border py-1.5 text-[11px] font-bold transition-all ${
                    scores[dim.id] === n ? 'border-white/30 bg-white/[0.1] text-white/90' : 'border-white/[0.06] text-white/24 hover:text-white/50'
                  }`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Result */}
      {allFilled && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.1rem] border border-white/[0.08] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/28">Maturidade em Sustentabilidade</p>
              <p className="text-[18px] font-bold mt-1" style={{ color: level.color }}>{level.label}</p>
            </div>
            <p className="text-[28px] font-bold text-white/60">{avg.toFixed(1)}</p>
          </div>

          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ background: level.color }}
              animate={{ width: `${(avg / 5) * 100}%` }} transition={{ duration: 0.5 }} />
          </div>

          {/* Radar bars */}
          <div className="space-y-2">
            {DIAG_DIMENSIONS.map(dim => {
              const val = scores[dim.id] || 0
              const dimLevel = MATURITY_LEVELS.find(l => val >= l.min && val < l.max + 0.1) || MATURITY_LEVELS[0]
              return (
                <div key={dim.id} className="flex items-center gap-3">
                  <p className="text-[10px] text-white/36 w-[100px] shrink-0 truncate">{dim.label}</p>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: dimLevel.color }}
                      animate={{ width: `${(val / 5) * 100}%` }} transition={{ duration: 0.4 }} />
                  </div>
                  <p className="text-[10px] font-bold text-white/40 w-4 text-right">{val}</p>
                </div>
              )
            })}
          </div>

          <div className="rounded-[0.8rem] border border-white/[0.06] p-3" style={{ background: 'rgba(255,255,255,0.015)' }}>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/28 mb-1">Recomendação</p>
            <p className="text-[12px] text-white/56 leading-relaxed">{level.advice}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ── Export map ───────────────────────────────────────────────────────────────

export const SIM_M1_SUSTAINABILITY: Record<string, React.ComponentType> = {
  'tbl-diagnostic': TBLDiagnostic,
  'esg-rating': ESGRating,
  'gri-sasb-choice': GRISASBChoice,
  'csv-finder': CSVFinder,
  'sustainability-diagnostic': SustainabilityDiagnostic,
}
