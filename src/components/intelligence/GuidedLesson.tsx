'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Check, X, GripVertical, Sparkles, BookOpen, ArrowRight } from 'lucide-react'
import type { GLStep, GLStepPrompt, GLStepTimeline, GLStepCaseQuiz, GLStepDrag, GLStepOpenQuestion, GLStepSelfAssess, GLStepAIFeedback, GLStepCalculator, GLStepSummary, GLStepSandbox, GLStepDecisionSim, GLStepDiagnosticRadar, GLStepBuildCanvas, GLStepLiveComparator } from '@/types/intelligence'

/* ══════════════════════════════════════════════════════════════
   STEP COMPONENTS
   ══════════════════════════════════════════════════════════════ */

// ── PROMPT (multiple choice) ──
function StepPrompt({ step, onNext }: { step: GLStepPrompt; onNext: () => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const answered = selected !== null
  const isCorrect = answered && step.options[selected]?.correct

  return (
    <div className="flex flex-col gap-5">
      <p className="text-[16px] leading-relaxed text-white/80 font-medium">{step.text}</p>
      <div className="flex flex-col gap-2">
        {step.options.map((opt, i) => {
          const thisSelected = selected === i
          let bg = 'rgba(255,255,255,0.03)'
          let border = 'rgba(255,255,255,0.08)'
          if (answered && opt.correct) { bg = 'rgba(30,132,73,0.12)'; border = 'rgba(30,132,73,0.4)' }
          else if (thisSelected && !opt.correct) { bg = 'rgba(192,57,43,0.12)'; border = 'rgba(192,57,43,0.4)' }

          return (
            <button
              key={i}
              onClick={() => !answered && setSelected(i)}
              disabled={answered}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-[14px] transition-all"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${thisSelected ? (opt.correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400') : 'bg-white/8 text-white/40'}`}>
                {answered && thisSelected ? (opt.correct ? <Check size={12} /> : <X size={12} />) : String.fromCharCode(65 + i)}
              </span>
              <span className={`${answered ? (opt.correct ? 'text-green-400/80' : thisSelected ? 'text-red-400/60' : 'text-white/25') : 'text-white/60'}`}>
                {opt.label}
              </span>
            </button>
          )
        })}
      </div>
      {answered && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl px-4 py-3" style={{ background: isCorrect ? 'rgba(30,132,73,0.08)' : 'rgba(192,57,43,0.08)', border: `1px solid ${isCorrect ? 'rgba(30,132,73,0.15)' : 'rgba(192,57,43,0.15)'}` }}>
          <p className="text-[13px] leading-relaxed" style={{ color: isCorrect ? 'rgba(30,132,73,0.9)' : 'rgba(220,120,100,0.9)' }}>
            {step.options[selected]?.feedback}
          </p>
        </motion.div>
      )}
      {answered && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onNext} className="mx-auto flex items-center gap-2 rounded-full border border-white/16 bg-white/[0.06] px-6 py-2.5 text-[13px] font-medium text-white/70 transition hover:bg-white/[0.10]">
          Continuar <ChevronRight size={14} />
        </motion.button>
      )}
    </div>
  )
}

// ── TIMELINE REVEAL ──
function StepTimelineReveal({ step, onNext }: { step: GLStepTimeline; onNext: () => void }) {
  const [revealed, setRevealed] = useState<number[]>([])
  const allRevealed = revealed.length === step.markers.length

  const reveal = (i: number) => {
    if (!revealed.includes(i)) setRevealed(prev => [...prev, i])
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="relative px-4">
        <div className="absolute left-0 right-0 top-[22px] h-px bg-white/10" />
        <div className="relative flex justify-between">
          {step.markers.map((m, i) => {
            const isOpen = revealed.includes(i)
            return (
              <button key={i} onClick={() => reveal(i)} className="flex flex-col items-center gap-2 relative z-10" style={{ width: `${100 / step.markers.length}%` }}>
                <motion.div
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${isOpen ? 'border-white/30 bg-white/12' : 'border-white/10 bg-white/[0.04]'}`}
                  whileHover={!isOpen ? { scale: 1.08 } : {}}
                  whileTap={!isOpen ? { scale: 0.95 } : {}}
                >
                  <span className={`text-[11px] font-bold ${isOpen ? 'text-white/80' : 'text-white/30'}`}>{m.year}</span>
                </motion.div>
                <AnimatePresence>
                  {isOpen ? (
                    <motion.div initial={{ opacity: 0, y: -6, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} className="text-center">
                      <p className="text-[12px] font-semibold text-white/70">{m.label}</p>
                      <p className="text-[10px] text-white/35 mt-0.5">{m.sublabel}</p>
                      <p className="text-[11px] text-white/45 mt-2 leading-relaxed max-w-[180px]">{m.detail}</p>
                    </motion.div>
                  ) : (
                    <motion.p className="text-[11px] text-white/20">Toque para revelar</motion.p>
                  )}
                </AnimatePresence>
              </button>
            )
          })}
        </div>
      </div>
      {allRevealed && step.closingText && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-[13px] text-white/50 italic mt-2">{step.closingText}</motion.p>
      )}
      {allRevealed && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onNext} className="mx-auto flex items-center gap-2 rounded-full border border-white/16 bg-white/[0.06] px-6 py-2.5 text-[13px] font-medium text-white/70 transition hover:bg-white/[0.10]">
          Continuar <ChevronRight size={14} />
        </motion.button>
      )}
    </div>
  )
}

// ── CASE QUIZ ──
function StepCaseQuiz({ step, onNext }: { step: GLStepCaseQuiz; onNext: () => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const answered = selected !== null

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-1">{step.company}</p>
        <p className="text-[14px] text-white/65 leading-relaxed">{step.context}</p>
      </div>
      <p className="text-[14px] font-medium text-white/75">{step.question}</p>
      <div className="flex flex-col gap-2">
        {step.options.map((opt, i) => {
          const thisSelected = selected === i
          let bg = 'rgba(255,255,255,0.03)'
          let border = 'rgba(255,255,255,0.08)'
          if (answered && opt.correct) { bg = 'rgba(30,132,73,0.12)'; border = 'rgba(30,132,73,0.4)' }
          else if (thisSelected && !opt.correct) { bg = 'rgba(192,57,43,0.12)'; border = 'rgba(192,57,43,0.4)' }

          return (
            <button key={i} onClick={() => !answered && setSelected(i)} disabled={answered}
              className="rounded-xl px-4 py-3 text-left text-[13px] transition-all"
              style={{ background: bg, border: `1px solid ${border}`, color: answered ? (opt.correct ? 'rgba(30,132,73,0.9)' : thisSelected ? 'rgba(220,120,100,0.7)' : 'rgba(255,255,255,0.2)') : 'rgba(255,255,255,0.55)' }}>
              {opt.label}
            </button>
          )
        })}
      </div>
      {answered && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl px-4 py-3 bg-white/[0.03] border border-white/[0.06]">
          <p className="text-[12px] text-white/50 leading-relaxed">{step.options[selected]?.feedback}</p>
          {step.phaseTag && <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/30">{step.phaseTag}</p>}
        </motion.div>
      )}
      {answered && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onNext} className="mx-auto flex items-center gap-2 rounded-full border border-white/16 bg-white/[0.06] px-6 py-2.5 text-[13px] font-medium text-white/70 transition hover:bg-white/[0.10]">
          Continuar <ChevronRight size={14} />
        </motion.button>
      )}
    </div>
  )
}

// ── DRAG CONNECT ──
function StepDragConnect({ step, onNext }: { step: GLStepDrag; onNext: () => void }) {
  const [connected, setConnected] = useState<number[]>([])
  const allDone = connected.length === step.items.length

  const connect = (i: number) => {
    if (!connected.includes(i)) setConnected(prev => [...prev, i])
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[13px] text-white/50">{step.instruction}</p>
      <div className="flex flex-col gap-3">
        {step.items.map((item, i) => {
          const done = connected.includes(i)
          return (
            <motion.button
              key={i}
              onClick={() => connect(i)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all"
              style={{ background: done ? 'rgba(30,132,73,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${done ? 'rgba(30,132,73,0.2)' : 'rgba(255,255,255,0.08)'}` }}
              whileTap={{ scale: 0.98 }}
            >
              <GripVertical size={14} className={done ? 'text-green-400/40' : 'text-white/20'} />
              <span className={`text-[13px] ${done ? 'text-green-400/70' : 'text-white/50'}`}>{item.from}</span>
              <ArrowRight size={12} className={done ? 'text-green-400/30' : 'text-white/15'} />
              <span className={`text-[13px] ${done ? 'text-green-400/70' : 'text-white/30'}`}>{done ? item.to : '???'}</span>
              {done && <Check size={14} className="ml-auto text-green-400/50" />}
            </motion.button>
          )
        })}
      </div>
      {allDone && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl px-4 py-3 bg-white/[0.03] border border-white/[0.06]">
          <p className="text-[13px] text-white/55 leading-relaxed">{step.completionText}</p>
        </motion.div>
      )}
      {allDone && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onNext} className="mx-auto flex items-center gap-2 rounded-full border border-white/16 bg-white/[0.06] px-6 py-2.5 text-[13px] font-medium text-white/70 transition hover:bg-white/[0.10]">
          Continuar <ChevronRight size={14} />
        </motion.button>
      )}
    </div>
  )
}

// ── OPEN QUESTION (with AI) ──
function StepOpenQuestion({ step, onNext }: { step: GLStepOpenQuestion; onNext: () => void }) {
  const [answer, setAnswer] = useState('')
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!answer.trim() || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: answer,
          submoduleTitle: step.context,
          selectedText: step.question,
          history: [{ role: 'user', content: `Contexto: ${step.context}\n\nPergunta para o aluno: ${step.question}\n\nResposta do aluno: ${answer}\n\n${step.aiSystemPrompt}` }],
        }),
      })
      const data = await res.json()
      setAiResponse(data.reply || data.message || 'Boa reflexão! Vamos continuar.')
    } catch {
      setAiResponse('Boa reflexão! Vamos continuar.')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4">
        <p className="text-[13px] text-white/45 leading-relaxed">{step.context}</p>
      </div>
      <p className="text-[15px] font-medium text-white/75">{step.question}</p>
      <textarea
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        disabled={!!aiResponse}
        placeholder="Sua resposta..."
        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-[14px] text-white/70 placeholder:text-white/20 outline-none resize-none min-h-[80px]"
      />
      {!aiResponse ? (
        <button onClick={submit} disabled={!answer.trim() || loading}
          className="mx-auto flex items-center gap-2 rounded-full border border-white/16 bg-white/[0.06] px-6 py-2.5 text-[13px] font-medium text-white/70 transition hover:bg-white/[0.10] disabled:opacity-30">
          {loading ? 'Analisando...' : 'Enviar'} <Sparkles size={14} />
        </button>
      ) : (
        <>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl px-4 py-3 border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={12} className="text-white/30" />
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">IA Tutor</p>
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed">{aiResponse}</p>
          </motion.div>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onNext} className="mx-auto flex items-center gap-2 rounded-full border border-white/16 bg-white/[0.06] px-6 py-2.5 text-[13px] font-medium text-white/70 transition hover:bg-white/[0.10]">
            Continuar <ChevronRight size={14} />
          </motion.button>
        </>
      )}
    </div>
  )
}

// ── SELF ASSESS ──
function StepSelfAssess({ step, onNext, onAssessComplete }: { step: GLStepSelfAssess; onNext: () => void; onAssessComplete: (selections: Record<string, string>) => void }) {
  const [selections, setSelections] = useState<Record<string, string>>({})
  const allDone = step.axes.every(a => selections[a.id])

  const select = (axisId: string, value: string) => {
    const next = { ...selections, [axisId]: value }
    setSelections(next)
    if (step.axes.every(a => next[a.id])) onAssessComplete(next)
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-[14px] text-white/60 leading-relaxed">{step.instruction}</p>
      {step.axes.map(axis => (
        <div key={axis.id}>
          <p className="text-[12px] uppercase tracking-[0.15em] text-white/30 mb-2">{axis.label}</p>
          <div className="flex flex-wrap gap-2">
            {axis.options.map(opt => (
              <button key={opt} onClick={() => select(axis.id, opt)}
                className="rounded-full px-4 py-2 text-[13px] transition-all"
                style={{
                  background: selections[axis.id] === opt ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selections[axis.id] === opt ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
                  color: selections[axis.id] === opt ? 'rgba(255,255,255,0.80)' : 'rgba(255,255,255,0.40)',
                }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      {allDone && (() => {
        const gap = step.axes[0] && step.axes[1] ? step.axes[0].options.indexOf(selections[step.axes[0].id]) - step.axes[1].options.indexOf(selections[step.axes[1].id]) : 0
        const absGap = Math.abs(gap)
        const barWidth = absGap === 0 ? 5 : absGap === 1 ? 50 : 100
        const barColor = absGap === 0 ? 'rgba(30,132,73,0.6)' : absGap === 1 ? 'rgba(200,170,50,0.6)' : 'rgba(192,57,43,0.6)'
        return (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl px-4 py-4 border border-white/[0.06] bg-white/[0.02]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/25 mb-3">Gap de Maturidade</p>
            <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${barWidth}%` }} transition={{ duration: 0.6 }} className="h-full rounded-full" style={{ background: barColor }} />
            </div>
            <p className="mt-2 text-[12px] text-white/40">
              {absGap === 0 ? 'Alinhado' : absGap === 1 ? 'Gap moderado' : 'Gap cr\u00edtico'}
            </p>
          </motion.div>
        )
      })()}
      {allDone && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onNext} className="mx-auto flex items-center gap-2 rounded-full border border-white/16 bg-white/[0.06] px-6 py-2.5 text-[13px] font-medium text-white/70 transition hover:bg-white/[0.10]">
          Continuar <ChevronRight size={14} />
        </motion.button>
      )}
    </div>
  )
}

// ── AI FEEDBACK ──
function StepAIFeedbackView({ step, assessData }: { step: GLStepAIFeedback; assessData: Record<string, string> }) {
  const message = useMemo(() => {
    for (const v of step.variants) {
      try {
        const fn = new Function('data', `return ${v.condition}`)
        if (fn(assessData)) return v.message
      } catch { /* skip */ }
    }
    return step.fallback
  }, [step, assessData])

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl px-5 py-4 border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={12} className="text-white/30" />
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">IA Tutor</p>
      </div>
      <p className="text-[14px] text-white/60 leading-relaxed">{message}</p>
    </motion.div>
  )
}

// ── CALCULATOR ──
function StepCalc({ step, onNext }: { step: GLStepCalculator; onNext: () => void }) {
  const defaults: Record<string, number> = {}
  step.sliders.forEach(s => { defaults[s.id] = s.default })
  const [values, setValues] = useState(defaults)

  const result = useMemo(() => {
    try {
      const fn = new Function(...Object.keys(values), `return ${step.formula}`)
      return fn(...Object.values(values)) as number
    } catch { return 0 }
  }, [values, step.formula])

  const interp = step.interpretation.find(i => result <= i.max) ?? step.interpretation[step.interpretation.length - 1]
  const colorMap = { green: 'rgba(30,132,73,0.8)', amber: 'rgba(200,170,50,0.8)', red: 'rgba(192,57,43,0.8)' }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[14px] font-medium text-white/70">{step.title}</p>
      {step.sliders.map(s => (
        <div key={s.id}>
          <div className="flex justify-between mb-1">
            <p className="text-[12px] text-white/40">{s.label}</p>
            <p className="text-[12px] text-white/60 font-mono">{s.unit === 'R$' ? `R$ ${values[s.id]}` : `${values[s.id]} ${s.unit}`}</p>
          </div>
          <input type="range" min={s.min} max={s.max} value={values[s.id]}
            onChange={e => setValues(v => ({ ...v, [s.id]: Number(e.target.value) }))}
            className="w-full accent-white/40 h-1"
          />
        </div>
      ))}
      <motion.div layout className="rounded-xl px-5 py-4 border border-white/[0.06] bg-white/[0.02] text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-1">{step.resultLabel}</p>
        <p className="text-[28px] font-bold font-mono" style={{ color: colorMap[interp?.color ?? 'amber'] }}>
          R$ {Math.round(result).toLocaleString('pt-BR')}{step.resultSuffix ?? '/m\u00eas'}
        </p>
        <p className="text-[12px] mt-1" style={{ color: colorMap[interp?.color ?? 'amber'] }}>{interp?.label}</p>
      </motion.div>
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onNext} className="mx-auto flex items-center gap-2 rounded-full border border-white/16 bg-white/[0.06] px-6 py-2.5 text-[13px] font-medium text-white/70 transition hover:bg-white/[0.10]">
        Continuar <ChevronRight size={14} />
      </motion.button>
    </div>
  )
}

// ── SUMMARY ──
function StepSummaryView({ step, onOpenText }: { step: GLStepSummary; onOpenText?: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">O que voc\u00ea aprendeu</p>
      <div className="flex flex-col gap-2">
        {step.checkmarks.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 bg-white/[0.02] border border-white/[0.06]">
            <Check size={14} className="text-green-400/50 shrink-0" />
            <span className="text-[13px] text-white/55">{item}</span>
          </motion.div>
        ))}
      </div>
      {onOpenText && (
        <button onClick={onOpenText} className="mx-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-[12px] text-white/35 transition hover:text-white/55 hover:bg-white/[0.06]">
          <BookOpen size={13} /> Ler texto completo
        </button>
      )}
    </div>
  )
}

// ── SANDBOX (manipulate variables, see outputs change in real-time) ──
function StepSandboxView({ step, onNext }: { step: GLStepSandbox; onNext: () => void }) {
  const defaults: Record<string, number> = {}
  step.variables.forEach(v => { defaults[v.id] = v.default })
  const [values, setValues] = useState(defaults)
  const [touched, setTouched] = useState(false)

  const outputs = useMemo(() => {
    return step.outputs.map(o => {
      try {
        const fn = new Function(...Object.keys(values), `return ${o.formula}`)
        const raw = fn(...Object.values(values)) as number
        let display = ''
        if (o.format === 'currency') display = `R$ ${Math.round(raw).toLocaleString('pt-BR')}`
        else if (o.format === 'percent') display = `${raw.toFixed(1)}%`
        else display = `${Math.round(raw).toLocaleString('pt-BR')} ${o.unit}`
        return { ...o, value: raw, display }
      } catch { return { ...o, value: 0, display: '—' } }
    })
  }, [values, step.outputs])

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[15px] font-semibold text-white/80">{step.title}</p>
        <p className="text-[12px] text-white/40 mt-1">{step.description}</p>
      </div>

      {/* Variables (sliders) */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-4">
        {step.variables.map(v => (
          <div key={v.id}>
            <div className="flex justify-between mb-1.5">
              <p className="text-[12px] text-white/45">{v.label}</p>
              <p className="text-[13px] text-white/70 font-mono font-medium">
                {v.unit === 'R$' ? `R$ ${values[v.id]?.toLocaleString('pt-BR')}` : `${values[v.id]} ${v.unit}`}
              </p>
            </div>
            <input type="range" min={v.min} max={v.max} step={v.step ?? 1} value={values[v.id]}
              onChange={e => { setValues(prev => ({ ...prev, [v.id]: Number(e.target.value) })); setTouched(true) }}
              className="w-full accent-white/50 h-1.5 cursor-pointer"
            />
            <div className="flex justify-between mt-0.5">
              <span className="text-[9px] text-white/15">{v.unit === 'R$' ? `R$ ${v.min}` : v.min}</span>
              <span className="text-[9px] text-white/15">{v.unit === 'R$' ? `R$ ${v.max}` : v.max}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Outputs (live results) */}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(outputs.length, 3)}, 1fr)` }}>
        {outputs.map(o => (
          <motion.div key={o.id} layout className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-center">
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/25 mb-1">{o.label}</p>
            <motion.p
              key={o.display}
              initial={touched ? { scale: 1.1, opacity: 0.6 } : false}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[22px] font-bold font-mono"
              style={{ color: o.color }}
            >
              {o.display}
            </motion.p>
          </motion.div>
        ))}
      </div>

      {touched && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[12px] text-white/40 text-center italic">{step.insight}</motion.p>
      )}

      {touched && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onNext} className="mx-auto flex items-center gap-2 rounded-full border border-white/16 bg-white/[0.06] px-6 py-2.5 text-[13px] font-medium text-white/70 transition hover:bg-white/[0.10]">
          Continuar <ChevronRight size={14} />
        </motion.button>
      )}
    </div>
  )
}

// ── DECISION SIMULATION (rounds with consequences) ──
function StepDecisionSimView({ step, onNext }: { step: GLStepDecisionSim; onNext: () => void }) {
  const [round, setRound] = useState(0)
  const [metrics, setMetrics] = useState<Record<string, number>>(() => {
    const m: Record<string, number> = {}
    step.metrics.forEach(mt => { m[mt.id] = mt.initial })
    return m
  })
  const [chosen, setChosen] = useState<number | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const done = round >= step.rounds.length

  const currentRound = step.rounds[round]

  const choose = (i: number) => {
    if (chosen !== null) return
    setChosen(i)
    const effects = currentRound.options[i].effects
    setMetrics(prev => {
      const next = { ...prev }
      Object.entries(effects).forEach(([k, v]) => { next[k] = (next[k] ?? 0) + v })
      return next
    })
    setHistory(prev => [...prev, currentRound.options[i].label])
  }

  const nextRound = () => {
    setChosen(null)
    setRound(r => r + 1)
  }

  const formatMetric = (mt: typeof step.metrics[0], val: number) => {
    if (mt.format === 'currency') return `R$ ${Math.round(val).toLocaleString('pt-BR')}`
    if (mt.format === 'percent') return `${val.toFixed(0)}%`
    return `${Math.round(val).toLocaleString('pt-BR')} ${mt.unit}`
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[15px] font-semibold text-white/80">{step.title}</p>

      {/* Metrics bar */}
      <div className="flex gap-2 flex-wrap">
        {step.metrics.map(mt => (
          <motion.div key={mt.id} layout className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-center flex-1 min-w-[80px]">
            <p className="text-[8px] uppercase tracking-[0.15em] text-white/25">{mt.label}</p>
            <motion.p key={metrics[mt.id]} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className="text-[16px] font-bold font-mono text-white/70">
              {formatMetric(mt, metrics[mt.id])}
            </motion.p>
          </motion.div>
        ))}
      </div>

      {!done ? (
        <AnimatePresence mode="wait">
          <motion.div key={round} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-4 mb-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-1">Rodada {round + 1}/{step.rounds.length} — {currentRound.year}</p>
              <p className="text-[14px] text-white/65 leading-relaxed">{currentRound.context}</p>
            </div>
            <div className="flex flex-col gap-2">
              {currentRound.options.map((opt, i) => {
                const thisChosen = chosen === i
                return (
                  <button key={i} onClick={() => choose(i)} disabled={chosen !== null}
                    className="rounded-xl px-4 py-3 text-left text-[13px] transition-all"
                    style={{
                      background: thisChosen ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${thisChosen ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
                      color: chosen !== null ? (thisChosen ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.2)') : 'rgba(255,255,255,0.55)',
                    }}>
                    {opt.label}
                  </button>
                )
              })}
            </div>
            {chosen !== null && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl px-4 py-3 bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[12px] text-white/50 leading-relaxed">{currentRound.options[chosen].feedback}</p>
              </motion.div>
            )}
            {chosen !== null && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={nextRound} className="mx-auto mt-3 flex items-center gap-2 rounded-full border border-white/16 bg-white/[0.06] px-6 py-2.5 text-[13px] font-medium text-white/70 transition hover:bg-white/[0.10]">
                {round < step.rounds.length - 1 ? 'Próxima rodada' : 'Ver resultado'} <ChevronRight size={14} />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-2">Suas decisões</p>
            {history.map((h, i) => (
              <p key={i} className="text-[12px] text-white/45"><span className="text-white/25">{step.rounds[i]?.year}:</span> {h}</p>
            ))}
          </div>
          <p className="text-[13px] text-white/50 leading-relaxed italic">{step.finalInsight}</p>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onNext} className="mx-auto flex items-center gap-2 rounded-full border border-white/16 bg-white/[0.06] px-6 py-2.5 text-[13px] font-medium text-white/70 transition hover:bg-white/[0.10]">
            Continuar <ChevronRight size={14} />
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

// ── DIAGNOSTIC RADAR ──
function StepDiagnosticRadarView({ step, onNext }: { step: GLStepDiagnosticRadar; onNext: () => void }) {
  const [scores, setScores] = useState<Record<string, number>>({})
  const allDone = step.dimensions.every(d => scores[d.id] !== undefined)

  const avg = allDone ? Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length : 0
  const interp = allDone ? (step.interpretation.find(i => avg <= i.maxAvg) ?? step.interpretation[step.interpretation.length - 1]) : null

  // Simple radar visualization using CSS
  const maxScore = Math.max(...step.dimensions.flatMap(d => d.options.map(o => o.value)), 5)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[15px] font-semibold text-white/80">{step.title}</p>
        <p className="text-[12px] text-white/40 mt-1">{step.description}</p>
      </div>

      <div className="space-y-3">
        {step.dimensions.map(d => (
          <div key={d.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <p className="text-[12px] text-white/55 mb-2">{d.question}</p>
            <div className="flex flex-wrap gap-1.5">
              {d.options.map(opt => (
                <button key={opt.value} onClick={() => setScores(prev => ({ ...prev, [d.id]: opt.value }))}
                  className="rounded-lg px-3 py-1.5 text-[12px] transition-all"
                  style={{
                    background: scores[d.id] === opt.value ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${scores[d.id] === opt.value ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.06)'}`,
                    color: scores[d.id] === opt.value ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.35)',
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {allDone && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-4 text-center">Seu Radar de Maturidade</p>
          {/* Bar chart visualization */}
          <div className="space-y-2">
            {step.dimensions.map(d => {
              const score = scores[d.id] ?? 0
              const pct = (score / maxScore) * 100
              return (
                <div key={d.id} className="flex items-center gap-3">
                  <p className="text-[10px] text-white/35 w-24 text-right shrink-0 truncate">{d.label}</p>
                  <div className="flex-1 h-3 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: 0.1 }}
                      className="h-full rounded-full" style={{ background: interp?.color ?? 'rgba(255,255,255,0.3)' }} />
                  </div>
                  <span className="text-[11px] font-mono text-white/40 w-6">{score}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.06] text-center">
            <p className="text-[20px] font-bold font-mono" style={{ color: interp?.color }}>{avg.toFixed(1)}</p>
            <p className="text-[12px] mt-1" style={{ color: interp?.color }}>{interp?.label}</p>
            <p className="text-[11px] text-white/40 mt-2 leading-relaxed">{interp?.message}</p>
          </div>
        </motion.div>
      )}

      {allDone && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onNext} className="mx-auto flex items-center gap-2 rounded-full border border-white/16 bg-white/[0.06] px-6 py-2.5 text-[13px] font-medium text-white/70 transition hover:bg-white/[0.10]">
          Continuar <ChevronRight size={14} />
        </motion.button>
      )}
    </div>
  )
}

// ── BUILD CANVAS (drag pieces to zones) ──
function StepBuildCanvasView({ step, onNext }: { step: GLStepBuildCanvas; onNext: () => void }) {
  const [placed, setPlaced] = useState<Record<string, string>>({})  // pieceId → zoneId
  const [available, setAvailable] = useState(step.pieces.map(p => p.id))
  const allPlaced = available.length === 0

  const place = (pieceId: string, zoneId: string) => {
    const piece = step.pieces.find(p => p.id === pieceId)
    if (!piece) return
    const correct = piece.zone === zoneId
    if (correct) {
      setPlaced(prev => ({ ...prev, [pieceId]: zoneId }))
      setAvailable(prev => prev.filter(id => id !== pieceId))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[15px] font-semibold text-white/80">{step.title}</p>
        <p className="text-[12px] text-white/40 mt-1">{step.description}</p>
      </div>

      {/* Available pieces */}
      {available.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {available.map(id => {
            const piece = step.pieces.find(p => p.id === id)!
            return (
              <motion.div key={id} layout className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-[12px] text-white/60 cursor-grab">
                <GripVertical size={10} className="inline mr-1.5 text-white/20" />
                {piece.label}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Zones */}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(step.zones.length, 3)}, 1fr)` }}>
        {step.zones.map(zone => {
          const zonePieces = step.pieces.filter(p => placed[p.id] === zone.id)
          const accepting = available.filter(id => step.pieces.find(p => p.id === id)?.zone === zone.id)
          return (
            <div key={zone.id} className="rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] px-3 py-3 min-h-[80px]">
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/30 mb-2">{zone.label}</p>
              {zonePieces.map(p => (
                <motion.div key={p.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="rounded-lg bg-green-500/10 border border-green-500/20 px-2 py-1.5 text-[11px] text-green-400/70 mb-1 flex items-center gap-1.5">
                  <Check size={10} /> {p.label}
                </motion.div>
              ))}
              {/* Drop targets */}
              {accepting.map(id => {
                const piece = step.pieces.find(p => p.id === id)!
                return (
                  <button key={id} onClick={() => place(id, zone.id)}
                    className="w-full rounded-lg border border-dashed border-white/[0.06] px-2 py-1.5 text-[10px] text-white/15 mb-1 transition hover:border-white/20 hover:bg-white/[0.03]">
                    {piece.hint ?? 'Solte aqui'}
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>

      {allPlaced && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl px-4 py-3 bg-green-500/[0.06] border border-green-500/[0.12]">
          <p className="text-[13px] text-green-400/70 leading-relaxed">{step.completionText}</p>
        </motion.div>
      )}

      {allPlaced && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onNext} className="mx-auto flex items-center gap-2 rounded-full border border-white/16 bg-white/[0.06] px-6 py-2.5 text-[13px] font-medium text-white/70 transition hover:bg-white/[0.10]">
          Continuar <ChevronRight size={14} />
        </motion.button>
      )}
    </div>
  )
}

// ── LIVE COMPARATOR ──
function StepLiveComparatorView({ step, onNext }: { step: GLStepLiveComparator; onNext: () => void }) {
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id])
  }

  const selectedScenarios = step.scenarios.filter(s => selected.includes(s.id))

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[15px] font-semibold text-white/80">{step.title}</p>

      {/* Scenario selector */}
      <div className="flex flex-wrap gap-2">
        {step.scenarios.map(s => (
          <button key={s.id} onClick={() => toggle(s.id)}
            className="rounded-xl px-4 py-2.5 text-left transition-all flex-1 min-w-[120px]"
            style={{
              background: selected.includes(s.id) ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${selected.includes(s.id) ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
            }}>
            <p className={`text-[13px] font-medium ${selected.includes(s.id) ? 'text-white/80' : 'text-white/45'}`}>{s.label}</p>
            <p className="text-[10px] text-white/25 mt-0.5">{s.description}</p>
          </button>
        ))}
      </div>

      {/* Comparison table */}
      {selectedScenarios.length === 2 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
          <div className="grid grid-cols-3 border-b border-white/[0.06]">
            <div className="px-3 py-2" />
            {selectedScenarios.map(s => (
              <div key={s.id} className="px-3 py-2 text-center border-l border-white/[0.06]">
                <p className="text-[11px] font-semibold text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
          {Object.keys(step.metricLabels).map(key => (
            <div key={key} className="grid grid-cols-3 border-b border-white/[0.04] last:border-0">
              <div className="px-3 py-2.5">
                <p className="text-[11px] text-white/35">{step.metricLabels[key]}</p>
              </div>
              {selectedScenarios.map(s => (
                <div key={s.id} className="px-3 py-2.5 text-center border-l border-white/[0.04]">
                  <p className="text-[13px] font-mono text-white/65">{s.metrics[key] ?? '—'}</p>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      )}

      {selectedScenarios.length === 2 && (
        <>
          <p className="text-[12px] text-white/40 text-center italic">{step.insight}</p>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onNext} className="mx-auto flex items-center gap-2 rounded-full border border-white/16 bg-white/[0.06] px-6 py-2.5 text-[13px] font-medium text-white/70 transition hover:bg-white/[0.10]">
            Continuar <ChevronRight size={14} />
          </motion.button>
        </>
      )}

      {selectedScenarios.length < 2 && (
        <p className="text-[11px] text-white/20 text-center">Selecione 2 cenários para comparar</p>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   MAIN GUIDED LESSON COMPONENT
   ══════════════════════════════════════════════════════════════ */

interface Props {
  title: string
  estimatedMinutes: number
  steps: GLStep[]
  onOpenFullText?: () => void
}

export default function GuidedLesson({ title, estimatedMinutes, steps, onOpenFullText }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [assessData, setAssessData] = useState<Record<string, string>>({})
  const containerRef = useRef<HTMLDivElement>(null)

  const step = steps[currentStep]
  const total = steps.length
  const progress = ((currentStep) / total) * 100

  const goNext = useCallback(() => {
    if (currentStep < total - 1) {
      setCurrentStep(c => c + 1)
    }
  }, [currentStep, total])

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [currentStep])

  return (
    <div ref={containerRef} className="scroll-mt-6 rounded-[1.5rem] border border-white/[0.08] overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(6,6,8,0.02) 100%)' }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[9px] uppercase tracking-[0.28em] text-white/26">Li\u00e7\u00e3o Guiada</p>
          <p className="text-[10px] text-white/20 font-mono">~{estimatedMinutes} min</p>
        </div>
        <h4 className="text-[1rem] font-semibold text-white/80 leading-snug" style={{ fontFamily: 'Poppins, sans-serif' }}>{title}</h4>
        {/* Progress bar */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div className="h-full rounded-full bg-white/20" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
          <span className="text-[10px] text-white/20 font-mono">{currentStep + 1}/{total}</span>
        </div>
      </div>

      {/* Step content */}
      <div className="px-5 pb-6 pt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {step?.type === 'prompt' && <StepPrompt step={step} onNext={goNext} />}
            {step?.type === 'timeline-reveal' && <StepTimelineReveal step={step} onNext={goNext} />}
            {step?.type === 'case-quiz' && <StepCaseQuiz step={step} onNext={goNext} />}
            {step?.type === 'drag-connect' && <StepDragConnect step={step} onNext={goNext} />}
            {step?.type === 'open-question' && <StepOpenQuestion step={step} onNext={goNext} />}
            {step?.type === 'self-assess' && <StepSelfAssess step={step} onNext={goNext} onAssessComplete={setAssessData} />}
            {step?.type === 'ai-feedback' && (
              <div className="flex flex-col gap-4">
                <StepAIFeedbackView step={step} assessData={assessData} />
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={goNext} className="mx-auto flex items-center gap-2 rounded-full border border-white/16 bg-white/[0.06] px-6 py-2.5 text-[13px] font-medium text-white/70 transition hover:bg-white/[0.10]">
                  Continuar <ChevronRight size={14} />
                </motion.button>
              </div>
            )}
            {step?.type === 'calculator' && <StepCalc step={step} onNext={goNext} />}
            {step?.type === 'sandbox' && <StepSandboxView step={step} onNext={goNext} />}
            {step?.type === 'decision-sim' && <StepDecisionSimView step={step} onNext={goNext} />}
            {step?.type === 'diagnostic-radar' && <StepDiagnosticRadarView step={step} onNext={goNext} />}
            {step?.type === 'build-canvas' && <StepBuildCanvasView step={step} onNext={goNext} />}
            {step?.type === 'live-comparator' && <StepLiveComparatorView step={step} onNext={goNext} />}
            {step?.type === 'summary' && <StepSummaryView step={step} onOpenText={onOpenFullText} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
