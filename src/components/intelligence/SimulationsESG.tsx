'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Colors ────────────────────────────────────────────────────────────────────
const RED = '#c0392b', GREEN = '#1e8449', AMBER = '#9a7d0a', BLUE = '#1a5276'

// ── Shared helpers ────────────────────────────────────────────────────────────
const card = { background: 'rgba(255,255,255,0.02)' }
const innerCard = { background: 'rgba(255,255,255,0.015)' }
const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 }, transition: { duration: 0.3 } }

function Slider({ label, value, onChange, color }: { label: string; value: number; onChange: (v: number) => void; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-white/50">{label}</span>
        <span className="font-mono font-semibold" style={{ color }}>{value}</span>
      </div>
      <input type="range" min={0} max={100} value={value} onChange={e => onChange(+e.target.value)}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: color, background: `linear-gradient(90deg, ${color} ${value}%, rgba(255,255,255,0.08) ${value}%)` }} />
    </div>
  )
}

function Badge({ text, color }: { text: string; color: string }) {
  return <span className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ background: `${color}22`, color }}>{text}</span>
}

function Btn({ children, onClick, color = BLUE, disabled = false }: { children: React.ReactNode; onClick: () => void; color?: string; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="rounded-[0.75rem] border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all disabled:opacity-30"
      style={{ borderColor: `${color}44`, background: `${color}18`, color }}>{children}</button>
  )
}

function ScoreBar({ label, value, ref_val, color }: { label: string; value: number; ref_val: [number, number]; color: string }) {
  const inRange = value >= ref_val[0] && value <= ref_val[1]
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px]">
        <span className="text-white/50">{label}</span>
        <span className="font-mono" style={{ color: inRange ? GREEN : RED }}>{value} {inRange ? '✓' : `(ref: ${ref_val[0]}-${ref_val[1]})`}</span>
      </div>
      <div className="relative h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="absolute h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
        <div className="absolute h-full rounded-full border-x-2" style={{ left: `${ref_val[0]}%`, width: `${ref_val[1] - ref_val[0]}%`, borderColor: 'rgba(255,255,255,0.3)' }} />
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. TBL Diagnostic
// ══════════════════════════════════════════════════════════════════════════════

const TBL_COMPANIES = [
  { name: 'TechFlow', desc: 'Startup SaaS, margem alta, zero política ambiental, baixa diversidade.', ref: { profit: [80, 90], people: [25, 35], planet: [15, 25] } },
  { name: 'AgroVerde', desc: 'Exportadora agrícola, usa pesticidas, investe em comunidade rural.', ref: { profit: [65, 75], people: [55, 65], planet: [30, 40] } },
  { name: 'BancaSol', desc: 'Fintech de inclusão financeira, alto consumo de energia.', ref: { profit: [70, 80], people: [75, 85], planet: [35, 45] } },
  { name: 'ModaÉtica', desc: 'Moda sustentável, materiais reciclados, margem baixa.', ref: { profit: [30, 40], people: [70, 80], planet: [80, 90] } },
]

function TBLDiagnostic() {
  const [idx, setIdx] = useState(0)
  const [scores, setScores] = useState<{ profit: number; people: number; planet: number }[]>(TBL_COMPANIES.map(() => ({ profit: 50, people: 50, planet: 50 })))
  const [submitted, setSubmitted] = useState<boolean[]>([false, false, false, false])
  const [done, setDone] = useState(false)

  const co = TBL_COMPANIES[idx]
  const s = scores[idx]
  const update = (dim: 'profit' | 'people' | 'planet', v: number) => {
    const next = [...scores]; next[idx] = { ...next[idx], [dim]: v }; setScores(next)
  }
  const submit = () => { const next = [...submitted]; next[idx] = true; setSubmitted(next) }
  const next = () => { if (idx < 3) setIdx(idx + 1); else setDone(true) }

  const feedback = (dim: 'profit' | 'people' | 'planet') => {
    const v = s[dim], r = co.ref[dim]
    if (v >= r[0] && v <= r[1]) return 'Dentro da faixa esperada!'
    return v < r[0] ? 'Você subestimou esse pilar.' : 'Você superestimou esse pilar.'
  }

  if (done) {
    return (
      <motion.div {...fadeIn} className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={card}>
        <p className="text-[9px] uppercase tracking-[0.3em] text-white/28">Resumo TBL</p>
        {TBL_COMPANIES.map((c, i) => (
          <div key={i} className="rounded-[0.9rem] border border-white/[0.06] p-4 space-y-2" style={innerCard}>
            <p className="text-[13px] font-semibold text-white/80">{c.name}</p>
            <ScoreBar label="Profit" value={scores[i].profit} ref_val={c.ref.profit as [number, number]} color={AMBER} />
            <ScoreBar label="People" value={scores[i].people} ref_val={c.ref.people as [number, number]} color={BLUE} />
            <ScoreBar label="Planet" value={scores[i].planet} ref_val={c.ref.planet as [number, number]} color={GREEN} />
          </div>
        ))}
        <Btn onClick={() => { setIdx(0); setSubmitted([false, false, false, false]); setScores(TBL_COMPANIES.map(() => ({ profit: 50, people: 50, planet: 50 }))); setDone(false) }}>Refazer</Btn>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {TBL_COMPANIES.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`shrink-0 rounded-[0.75rem] border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all ${idx === i ? 'border-white/20 bg-white/[0.08] text-white/88' : 'border-white/[0.06] text-white/28 hover:text-white/54'}`}>
            {String(i + 1).padStart(2, '0')}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={idx} {...fadeIn} className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={card}>
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/28">Empresa {idx + 1}/4</p>
            <p className="mt-1 text-[1rem] font-semibold text-white/90">{co.name}</p>
            <p className="mt-1 text-[12px] text-white/50 leading-relaxed">{co.desc}</p>
          </div>
          <div className="space-y-3">
            <Slider label="💰 Profit" value={s.profit} onChange={v => update('profit', v)} color={AMBER} />
            <Slider label="👥 People" value={s.people} onChange={v => update('people', v)} color={BLUE} />
            <Slider label="🌍 Planet" value={s.planet} onChange={v => update('planet', v)} color={GREEN} />
          </div>
          {!submitted[idx] ? (
            <Btn onClick={submit} color={GREEN}>Avaliar</Btn>
          ) : (
            <motion.div {...fadeIn} className="space-y-3">
              <ScoreBar label="Profit" value={s.profit} ref_val={co.ref.profit as [number, number]} color={AMBER} />
              <ScoreBar label="People" value={s.people} ref_val={co.ref.people as [number, number]} color={BLUE} />
              <ScoreBar label="Planet" value={s.planet} ref_val={co.ref.planet as [number, number]} color={GREEN} />
              <div className="rounded-[0.75rem] p-3 text-[11px] text-white/60 space-y-1" style={innerCard}>
                <p>{feedback('profit')}</p><p>{feedback('people')}</p><p>{feedback('planet')}</p>
              </div>
              <Btn onClick={next} color={BLUE}>{idx < 3 ? 'Próxima' : 'Ver Resumo'}</Btn>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. ESG Rating
// ══════════════════════════════════════════════════════════════════════════════

const ESG_COMPANIES = [
  { name: 'Natura', sector: 'Cosméticos', ref: { e: 90, s: 85, g: 92 }, rating: 'AAA' },
  { name: 'Itaú', sector: 'Bancário', ref: { e: 65, s: 75, g: 85 }, rating: 'AA' },
  { name: 'Vale', sector: 'Mineração', ref: { e: 25, s: 35, g: 50 }, rating: 'B' },
]

const MSCI_SCALE = ['CCC', 'B', 'BB', 'BBB', 'A', 'AA', 'AAA'] as const

function calcMSCI(e: number, s: number, g: number): string {
  const avg = (e + s + g) / 3
  if (avg >= 86) return 'AAA'
  if (avg >= 71) return 'AA'
  if (avg >= 57) return 'A'
  if (avg >= 43) return 'BBB'
  if (avg >= 29) return 'BB'
  if (avg >= 15) return 'B'
  return 'CCC'
}

function ESGRating() {
  const [idx, setIdx] = useState(0)
  const [scores, setScores] = useState(ESG_COMPANIES.map(() => ({ e: 50, s: 50, g: 50 })))
  const [submitted, setSubmitted] = useState([false, false, false])

  const co = ESG_COMPANIES[idx]
  const s = scores[idx]
  const userRating = calcMSCI(s.e, s.s, s.g)

  const update = (dim: 'e' | 's' | 'g', v: number) => {
    const next = [...scores]; next[idx] = { ...next[idx], [dim]: v }; setScores(next)
  }
  const submit = () => { const next = [...submitted]; next[idx] = true; setSubmitted(next) }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {ESG_COMPANIES.map((c, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`shrink-0 rounded-[0.75rem] border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all ${idx === i ? 'border-white/20 bg-white/[0.08] text-white/88' : 'border-white/[0.06] text-white/28 hover:text-white/54'}`}>
            {c.name}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={idx} {...fadeIn} className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={card}>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[1rem] font-semibold text-white/90">{co.name}</p>
              <Badge text={co.sector} color={BLUE} />
            </div>
            <p className="mt-1 text-[10px] text-white/40">Atribua notas E, S e G (0-100) para calcular o rating MSCI.</p>
          </div>
          <div className="space-y-3">
            <Slider label="E — Environmental" value={s.e} onChange={v => update('e', v)} color={GREEN} />
            <Slider label="S — Social" value={s.s} onChange={v => update('s', v)} color={BLUE} />
            <Slider label="G — Governance" value={s.g} onChange={v => update('g', v)} color={AMBER} />
          </div>
          <div className="flex items-center gap-3">
            <p className="text-[11px] text-white/40">Seu rating:</p>
            <Badge text={userRating} color={userRating === co.rating ? GREEN : AMBER} />
          </div>
          {!submitted[idx] ? (
            <Btn onClick={submit} color={GREEN}>Comparar</Btn>
          ) : (
            <motion.div {...fadeIn} className="rounded-[0.9rem] border border-white/[0.06] p-4 space-y-3" style={innerCard}>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/28">Rating oficial</p>
              <div className="flex items-center gap-3">
                <Badge text={co.rating} color={GREEN} />
                <span className="text-[11px] text-white/50">E={co.ref.e} S={co.ref.s} G={co.ref.g}</span>
              </div>
              <div className="flex gap-1 mt-2">
                {MSCI_SCALE.map(r => (
                  <div key={r} className="flex-1 text-center rounded py-1 text-[9px] font-bold" style={{
                    background: r === co.rating ? `${GREEN}33` : r === userRating ? `${AMBER}22` : 'rgba(255,255,255,0.03)',
                    color: r === co.rating ? GREEN : r === userRating ? AMBER : 'rgba(255,255,255,0.2)',
                    border: r === co.rating ? `1px solid ${GREEN}44` : '1px solid transparent'
                  }}>{r}</div>
                ))}
              </div>
              {userRating === co.rating
                ? <p className="text-[11px]" style={{ color: GREEN }}>Excelente! Seu rating coincide com o oficial.</p>
                : <p className="text-[11px]" style={{ color: AMBER }}>Seu rating ({userRating}) difere do oficial ({co.rating}). Revise os pilares.</p>}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. GRI/SASB Choice
// ══════════════════════════════════════════════════════════════════════════════

const GRI_PROFILES = [
  { title: 'Startup de tecnologia', desc: '10 funcionários, sem investidores institucionais, mercado local.', answer: 'Nenhum', why: 'Empresa muito pequena — frameworks formais são desproporcionais. Comece com relatório simples de impacto.' },
  { title: 'Multinacional listada em bolsa', desc: 'Presente em 12 países, 5.000 funcionários, investidores ESG.', answer: 'Ambos', why: 'GRI para stakeholders amplos + SASB para investidores. Obrigatório pela regulação e pressão do mercado.' },
  { title: 'Cooperativa agrícola', desc: '200 cooperados, foco regional, fornece para grandes redes.', answer: 'GRI', why: 'GRI é ideal para organizações com múltiplos stakeholders e impacto comunitário forte.' },
  { title: 'Indústria química exportadora', desc: 'Exporta para UE e EUA, cadeia de fornecedores complexa.', answer: 'Ambos', why: 'Exportação exige compliance (SASB para investidores internacionais) + GRI para transparência de cadeia.' },
  { title: 'Consultoria de gestão', desc: '50 funcionários, clientes corporativos, escritório único.', answer: 'GRI', why: 'GRI opcional como diferencial competitivo. SASB tem pouca materialidade para serviços profissionais.' },
]

function GRISASBChoice() {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>(GRI_PROFILES.map(() => null))
  const [revealed, setRevealed] = useState<boolean[]>(GRI_PROFILES.map(() => false))
  const options = ['GRI', 'SASB', 'Ambos', 'Nenhum']

  const pick = (opt: string) => { const next = [...answers]; next[idx] = opt; setAnswers(next) }
  const reveal = () => { const next = [...revealed]; next[idx] = true; setRevealed(next) }
  const score = answers.reduce((a, ans, i) => a + (revealed[i] && ans === GRI_PROFILES[i].answer ? 1 : 0), 0)
  const allDone = revealed.every(Boolean)

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {GRI_PROFILES.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`shrink-0 rounded-[0.75rem] border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all ${idx === i ? 'border-white/20 bg-white/[0.08] text-white/88' : 'border-white/[0.06] text-white/28 hover:text-white/54'}`}>
            {revealed[i] ? (answers[i] === GRI_PROFILES[i].answer ? '✓' : '✗') : String(i + 1).padStart(2, '0')}
          </button>
        ))}
        {allDone && <Badge text={`${score}/5`} color={score >= 4 ? GREEN : score >= 2 ? AMBER : RED} />}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={idx} {...fadeIn} className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={card}>
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/28">Perfil {idx + 1}/5</p>
            <p className="mt-1 text-[1rem] font-semibold text-white/90">{GRI_PROFILES[idx].title}</p>
            <p className="mt-1 text-[12px] text-white/50">{GRI_PROFILES[idx].desc}</p>
          </div>
          <p className="text-[10px] text-white/40">Qual framework de reporte é mais adequado?</p>
          <div className="grid grid-cols-2 gap-2">
            {options.map(opt => (
              <button key={opt} onClick={() => !revealed[idx] && pick(opt)}
                className="rounded-[0.75rem] border px-3 py-2.5 text-[11px] font-semibold transition-all"
                style={{
                  borderColor: answers[idx] === opt ? `${BLUE}66` : 'rgba(255,255,255,0.06)',
                  background: answers[idx] === opt ? `${BLUE}18` : 'transparent',
                  color: answers[idx] === opt ? BLUE : 'rgba(255,255,255,0.5)',
                  opacity: revealed[idx] ? (opt === GRI_PROFILES[idx].answer ? 1 : 0.3) : 1,
                }}>{opt}
                {revealed[idx] && opt === GRI_PROFILES[idx].answer && <span className="ml-1" style={{ color: GREEN }}>✓</span>}
              </button>
            ))}
          </div>
          {!revealed[idx] ? (
            <Btn onClick={reveal} color={GREEN} disabled={!answers[idx]}>Verificar</Btn>
          ) : (
            <motion.div {...fadeIn} className="rounded-[0.75rem] p-3 text-[11px] leading-relaxed" style={{ ...innerCard, color: answers[idx] === GRI_PROFILES[idx].answer ? GREEN : RED }}>
              {answers[idx] === GRI_PROFILES[idx].answer ? 'Correto! ' : `Resposta: ${GRI_PROFILES[idx].answer}. `}
              <span className="text-white/50">{GRI_PROFILES[idx].why}</span>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. CSV Finder
// ══════════════════════════════════════════════════════════════════════════════

const CSV_SCENARIOS = [
  { title: 'Padaria com alto desperdício', desc: 'Padaria artesanal descarta 30% da produção diária. Comunidade local com insegurança alimentar.', correct: 2, label: 'Nível 2 — Otimização da cadeia', why: 'Redistribuir excedentes reduz desperdício (custo) e alimenta comunidade (impacto social). Redesenhar cadeia de valor.' },
  { title: 'App de transporte urbano', desc: 'Startup de mobilidade quer criar produto para cidades congestionadas com alto índice de poluição.', correct: 1, label: 'Nível 1 — Reconceber produto', why: 'Oportunidade de criar produto intrinsecamente sustentável — mobilidade limpa é o core do valor.' },
  { title: 'Fábrica em região sem escola técnica', desc: 'Indústria metalúrgica não encontra mão de obra qualificada. Região tem alta evasão escolar.', correct: 3, label: 'Nível 3 — Cluster local', why: 'Investir em educação técnica local beneficia a empresa (pipeline de talentos) e a comunidade (emprego). Desenvolvimento de cluster.' },
  { title: 'E-commerce com devoluções altas', desc: 'Loja online tem 25% de taxa de devolução. Logística reversa consome 18% da margem.', correct: 2, label: 'Nível 2 — Otimização da cadeia', why: 'Melhorar descrições, sizing virtual e embalagem reduz devoluções — menos custo e menos impacto ambiental.' },
]

const CSV_LEVELS = [
  { level: 1, name: 'Reconceber produto/mercado', color: GREEN },
  { level: 2, name: 'Redefinir cadeia de valor', color: BLUE },
  { level: 3, name: 'Desenvolver cluster local', color: AMBER },
]

function CSVFinder() {
  const [idx, setIdx] = useState(0)
  const [picks, setPicks] = useState<(number | null)[]>(CSV_SCENARIOS.map(() => null))
  const [texts, setTexts] = useState<string[]>(CSV_SCENARIOS.map(() => ''))
  const [revealed, setRevealed] = useState<boolean[]>(CSV_SCENARIOS.map(() => false))

  const choose = (lv: number) => { const next = [...picks]; next[idx] = lv; setPicks(next) }
  const reveal = () => { const next = [...revealed]; next[idx] = true; setRevealed(next) }
  const score = picks.reduce((a, p, i) => a + (revealed[i] && p === CSV_SCENARIOS[i].correct ? 1 : 0), 0)
  const allDone = revealed.every(Boolean)

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {CSV_SCENARIOS.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`shrink-0 rounded-[0.75rem] border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all ${idx === i ? 'border-white/20 bg-white/[0.08] text-white/88' : 'border-white/[0.06] text-white/28 hover:text-white/54'}`}>
            {revealed[i] ? (picks[i] === CSV_SCENARIOS[i].correct ? '✓' : '✗') : String(i + 1).padStart(2, '0')}
          </button>
        ))}
        {allDone && <Badge text={`${score}/4`} color={score >= 3 ? GREEN : score >= 2 ? AMBER : RED} />}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={idx} {...fadeIn} className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={card}>
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/28">Cenário {idx + 1}/4</p>
            <p className="mt-1 text-[1rem] font-semibold text-white/90">{CSV_SCENARIOS[idx].title}</p>
            <p className="mt-1 text-[12px] text-white/50">{CSV_SCENARIOS[idx].desc}</p>
          </div>
          <p className="text-[10px] text-white/40">Identifique o nível CSV (Porter & Kramer):</p>
          <div className="space-y-2">
            {CSV_LEVELS.map(lv => (
              <button key={lv.level} onClick={() => !revealed[idx] && choose(lv.level)}
                className="w-full rounded-[0.75rem] border px-4 py-2.5 text-left text-[11px] font-medium transition-all"
                style={{
                  borderColor: picks[idx] === lv.level ? `${lv.color}66` : 'rgba(255,255,255,0.06)',
                  background: picks[idx] === lv.level ? `${lv.color}18` : 'transparent',
                  color: picks[idx] === lv.level ? lv.color : 'rgba(255,255,255,0.5)',
                  opacity: revealed[idx] ? (lv.level === CSV_SCENARIOS[idx].correct ? 1 : 0.3) : 1,
                }}>
                <span className="font-bold">Nível {lv.level}</span> — {lv.name}
                {revealed[idx] && lv.level === CSV_SCENARIOS[idx].correct && <span className="ml-2" style={{ color: GREEN }}>✓</span>}
              </button>
            ))}
          </div>
          <textarea value={texts[idx]} onChange={e => { const next = [...texts]; next[idx] = e.target.value; setTexts(next) }}
            placeholder="Descreva brevemente a oportunidade CSV..."
            className="w-full rounded-[0.75rem] border border-white/[0.06] bg-transparent p-3 text-[11px] text-white/70 placeholder:text-white/20 focus:outline-none focus:border-white/20 resize-none"
            rows={2} />
          {!revealed[idx] ? (
            <Btn onClick={reveal} color={GREEN} disabled={picks[idx] === null}>Verificar</Btn>
          ) : (
            <motion.div {...fadeIn} className="rounded-[0.75rem] p-3 text-[11px] leading-relaxed" style={{ ...innerCard, color: picks[idx] === CSV_SCENARIOS[idx].correct ? GREEN : RED }}>
              {picks[idx] === CSV_SCENARIOS[idx].correct ? 'Correto! ' : `Resposta: ${CSV_SCENARIOS[idx].label}. `}
              <span className="text-white/50">{CSV_SCENARIOS[idx].why}</span>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. Sustainability Diagnostic (5-step wizard)
// ══════════════════════════════════════════════════════════════════════════════

const DIAG_COMPANY = {
  name: 'NutriTech Brasil',
  desc: 'Empresa de alimentos funcionais com 120 funcionários. Faturamento R$ 45M/ano. Usa embalagens plásticas, fornecedores rurais familiares, exporta 30% para Europa. Alto consumo de água. Programa de inclusão de PCDs. Conselho com 3 membros (todos homens). Sem relatório ESG publicado.',
}

const ODS_OPTIONS = [
  { n: 1, name: 'Erradicação da pobreza' }, { n: 2, name: 'Fome zero' }, { n: 3, name: 'Saúde e bem-estar' },
  { n: 6, name: 'Água potável' }, { n: 8, name: 'Trabalho decente' }, { n: 9, name: 'Indústria e inovação' },
  { n: 10, name: 'Redução das desigualdades' }, { n: 12, name: 'Consumo responsável' },
  { n: 13, name: 'Ação climática' }, { n: 15, name: 'Vida terrestre' },
]

const STEPS = ['TBL', 'ESG', 'ODS', 'Framework', 'CSV']

function SustainabilityDiagnostic() {
  const [step, setStep] = useState(0)
  const [tbl, setTbl] = useState({ profit: 50, people: 50, planet: 50 })
  const [esg, setEsg] = useState({ e: 50, s: 50, g: 50 })
  const [ods, setOds] = useState<number[]>([])
  const [framework, setFramework] = useState<string | null>(null)
  const [csvLevel, setCsvLevel] = useState<number | null>(null)
  const [csvText, setCsvText] = useState('')
  const [done, setDone] = useState(false)

  const toggleOds = (n: number) => setOds(prev => prev.includes(n) ? prev.filter(x => x !== n) : prev.length < 5 ? [...prev, n] : prev)
  const esgRating = calcMSCI(esg.e, esg.s, esg.g)

  const copyReport = () => {
    const report = `DIAGNÓSTICO DE SUSTENTABILIDADE — ${DIAG_COMPANY.name}
TBL: Profit=${tbl.profit} | People=${tbl.people} | Planet=${tbl.planet}
ESG: E=${esg.e} S=${esg.s} G=${esg.g} → Rating ${esgRating}
ODS priorizados: ${ods.map(n => `ODS ${n}`).join(', ')}
Framework: ${framework}
CSV: Nível ${csvLevel} — ${csvText}`
    navigator.clipboard.writeText(report)
  }

  if (done) {
    return (
      <motion.div {...fadeIn} className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-4" style={card}>
        <p className="text-[9px] uppercase tracking-[0.3em] text-white/28">Diagnóstico completo</p>
        <p className="text-[1rem] font-semibold text-white/90">{DIAG_COMPANY.name}</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-[0.75rem] border border-white/[0.06] p-3 text-center" style={innerCard}>
            <p className="text-[9px] text-white/28">TBL</p>
            <p className="text-[13px] font-mono font-bold" style={{ color: AMBER }}>{tbl.profit}/{tbl.people}/{tbl.planet}</p>
          </div>
          <div className="rounded-[0.75rem] border border-white/[0.06] p-3 text-center" style={innerCard}>
            <p className="text-[9px] text-white/28">ESG</p>
            <p className="text-[13px] font-mono font-bold" style={{ color: GREEN }}>{esgRating}</p>
          </div>
          <div className="rounded-[0.75rem] border border-white/[0.06] p-3 text-center" style={innerCard}>
            <p className="text-[9px] text-white/28">CSV</p>
            <p className="text-[13px] font-mono font-bold" style={{ color: BLUE }}>Nível {csvLevel}</p>
          </div>
        </div>
        <div className="rounded-[0.75rem] border border-white/[0.06] p-3 space-y-1" style={innerCard}>
          <p className="text-[9px] text-white/28 uppercase tracking-wider">ODS Priorizados</p>
          <div className="flex flex-wrap gap-1">{ods.map(n => <Badge key={n} text={`ODS ${n}`} color={BLUE} />)}</div>
        </div>
        <div className="rounded-[0.75rem] border border-white/[0.06] p-3" style={innerCard}>
          <p className="text-[9px] text-white/28 uppercase tracking-wider">Framework</p>
          <p className="text-[12px] text-white/60 mt-1">{framework}</p>
        </div>
        <div className="rounded-[0.75rem] border border-white/[0.06] p-3" style={innerCard}>
          <p className="text-[9px] text-white/28 uppercase tracking-wider">Oportunidade CSV</p>
          <p className="text-[12px] text-white/60 mt-1">{csvText || '—'}</p>
        </div>
        <div className="flex gap-2">
          <Btn onClick={copyReport} color={GREEN}>Copiar Relatório</Btn>
          <Btn onClick={() => { setStep(0); setDone(false) }} color={BLUE}>Refazer</Btn>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {STEPS.map((s, i) => (
          <button key={s} onClick={() => i <= step && setStep(i)}
            className={`shrink-0 rounded-[0.75rem] border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all ${step === i ? 'border-white/20 bg-white/[0.08] text-white/88' : i < step ? 'border-white/[0.06] text-white/44' : 'border-white/[0.06] text-white/20'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="rounded-[1.2rem] border border-white/[0.08] p-5 space-y-3" style={card}>
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/28">{DIAG_COMPANY.name}</p>
          <p className="mt-1 text-[12px] text-white/50 leading-relaxed">{DIAG_COMPANY.desc}</p>
        </div>
        <div className="h-px bg-white/[0.06]" />

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="tbl" {...fadeIn} className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Etapa 1 — Triple Bottom Line</p>
              <Slider label="💰 Profit" value={tbl.profit} onChange={v => setTbl({ ...tbl, profit: v })} color={AMBER} />
              <Slider label="👥 People" value={tbl.people} onChange={v => setTbl({ ...tbl, people: v })} color={BLUE} />
              <Slider label="🌍 Planet" value={tbl.planet} onChange={v => setTbl({ ...tbl, planet: v })} color={GREEN} />
              <Btn onClick={() => setStep(1)} color={BLUE}>Próximo: ESG</Btn>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="esg" {...fadeIn} className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Etapa 2 — ESG Rating</p>
              <Slider label="E — Environmental" value={esg.e} onChange={v => setEsg({ ...esg, e: v })} color={GREEN} />
              <Slider label="S — Social" value={esg.s} onChange={v => setEsg({ ...esg, s: v })} color={BLUE} />
              <Slider label="G — Governance" value={esg.g} onChange={v => setEsg({ ...esg, g: v })} color={AMBER} />
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-white/40">Rating calculado:</p>
                <Badge text={esgRating} color={GREEN} />
              </div>
              <Btn onClick={() => setStep(2)} color={BLUE}>Próximo: ODS</Btn>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="ods" {...fadeIn} className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Etapa 3 — Selecione 3 a 5 ODS prioritários</p>
              <div className="flex flex-wrap gap-2">
                {ODS_OPTIONS.map(o => (
                  <button key={o.n} onClick={() => toggleOds(o.n)}
                    className="rounded-[0.75rem] border px-3 py-2 text-[10px] font-medium transition-all"
                    style={{
                      borderColor: ods.includes(o.n) ? `${BLUE}66` : 'rgba(255,255,255,0.06)',
                      background: ods.includes(o.n) ? `${BLUE}18` : 'transparent',
                      color: ods.includes(o.n) ? BLUE : 'rgba(255,255,255,0.4)',
                    }}>ODS {o.n} — {o.name}</button>
                ))}
              </div>
              <Btn onClick={() => setStep(3)} color={BLUE} disabled={ods.length < 3}>Próximo: Framework</Btn>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="fw" {...fadeIn} className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Etapa 4 — Framework de reporte</p>
              {['GRI', 'SASB', 'Ambos', 'Nenhum'].map(opt => (
                <button key={opt} onClick={() => setFramework(opt)}
                  className="block w-full rounded-[0.75rem] border px-4 py-2.5 text-left text-[11px] font-medium transition-all"
                  style={{
                    borderColor: framework === opt ? `${BLUE}66` : 'rgba(255,255,255,0.06)',
                    background: framework === opt ? `${BLUE}18` : 'transparent',
                    color: framework === opt ? BLUE : 'rgba(255,255,255,0.5)',
                  }}>{opt}</button>
              ))}
              <Btn onClick={() => setStep(4)} color={BLUE} disabled={!framework}>Próximo: CSV</Btn>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="csv" {...fadeIn} className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Etapa 5 — Valor Compartilhado (CSV)</p>
              {CSV_LEVELS.map(lv => (
                <button key={lv.level} onClick={() => setCsvLevel(lv.level)}
                  className="block w-full rounded-[0.75rem] border px-4 py-2.5 text-left text-[11px] font-medium transition-all"
                  style={{
                    borderColor: csvLevel === lv.level ? `${lv.color}66` : 'rgba(255,255,255,0.06)',
                    background: csvLevel === lv.level ? `${lv.color}18` : 'transparent',
                    color: csvLevel === lv.level ? lv.color : 'rgba(255,255,255,0.5)',
                  }}>Nível {lv.level} — {lv.name}</button>
              ))}
              <textarea value={csvText} onChange={e => setCsvText(e.target.value)}
                placeholder="Descreva a oportunidade de valor compartilhado para a NutriTech..."
                className="w-full rounded-[0.75rem] border border-white/[0.06] bg-transparent p-3 text-[11px] text-white/70 placeholder:text-white/20 focus:outline-none focus:border-white/20 resize-none" rows={3} />
              <Btn onClick={() => setDone(true)} color={GREEN} disabled={csvLevel === null}>Gerar Diagnóstico</Btn>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Export Map ─────────────────────────────────────────────────────────────────

export const SIM_ESG: Record<string, React.ComponentType> = {
  'tbl-diagnostic': TBLDiagnostic,
  'esg-rating': ESGRating,
  'gri-sasb-choice': GRISASBChoice,
  'csv-finder': CSVFinder,
  'sustainability-diagnostic': SustainabilityDiagnostic,
}
