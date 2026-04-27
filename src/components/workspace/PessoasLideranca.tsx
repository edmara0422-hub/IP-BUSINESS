'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWorkspaceData } from '@/hooks/useWorkspaceData'
import {
  Users2, Brain, ChevronRight, CheckCircle2, Circle, Loader2, Target,
} from 'lucide-react'

const TEAL   = '#17a589'
const GREEN  = '#1e8449'
const AMBER  = '#9a7d0a'
const RED    = '#c0392b'
const PURPLE = '#7d3c98'
const BLUE   = '#5dade2'

interface PesState {
  pesLiderados: number
  pesMetaEquipe: string
  pesKpiEquipe: string
  pesUltimo1a1: string
  pesAcordos: string
  pesGapHabilidade: string
  pesPlanoDev: string
  pesRituais: boolean[]
  pesPerfScore: number
  pesReconhecimento: boolean
  pesReflexao: string
}

const DEFAULT: PesState = {
  pesLiderados: 0,
  pesMetaEquipe: '',
  pesKpiEquipe: '',
  pesUltimo1a1: '',
  pesAcordos: '',
  pesGapHabilidade: '',
  pesPlanoDev: '',
  pesRituais: [false, false, false],
  pesPerfScore: 0,
  pesReconhecimento: false,
  pesReflexao: '',
}

export default function PessoasLideranca() {
  const { data: s, update } = useWorkspaceData<PesState>('pessoas-lideranca', DEFAULT)
  const [expandIdx, setExpandIdx] = useState<number | null>(0)
  const [iaLoading, setIaLoading] = useState(false)
  const [iaAnswer, setIaAnswer] = useState('')

  const etapas = [
    { id: 0, num: '01', label: 'Clareza',     color: BLUE,   desc: 'Meta + KPIs da equipe definidos?' },
    { id: 1, num: '02', label: 'Alinhamento', color: GREEN,  desc: '1:1 feito + acordos registrados?' },
    { id: 2, num: '03', label: 'Capacitação', color: PURPLE, desc: 'Gap de habilidade + plano de dev?' },
    { id: 3, num: '04', label: 'Execução',    color: AMBER,  desc: 'Rituais de time ativos?' },
    { id: 4, num: '05', label: 'Resultado',   color: TEAL,   desc: 'Performance medida + reconhecimento?' },
  ]

  const scores = [
    s.pesMetaEquipe.trim() && s.pesKpiEquipe.trim() ? 20 : s.pesMetaEquipe.trim() ? 10 : 0,
    s.pesUltimo1a1 && s.pesAcordos.trim() ? 20 : s.pesUltimo1a1 ? 10 : 0,
    s.pesGapHabilidade.trim() && s.pesPlanoDev.trim() ? 20 : s.pesGapHabilidade.trim() ? 10 : 0,
    s.pesRituais.filter(Boolean).length * Math.round(20 / 3),
    (s.pesPerfScore > 0 ? 10 : 0) + (s.pesReconhecimento ? 10 : 0),
  ]
  const liderScore = Math.min(100, scores.reduce((a, b) => a + b, 0))
  const liderColor = liderScore >= 80 ? TEAL : liderScore >= 50 ? AMBER : RED

  async function askCoach(question: string) {
    setIaLoading(true)
    setIaAnswer('')
    try {
      const ctx = `Líder com ${s.pesLiderados} liderados. Score: ${liderScore}/100. Rituais: ${s.pesRituais.filter(Boolean).length}/3. Meta equipe: ${s.pesMetaEquipe || 'não definida'}. Gap: ${s.pesGapHabilidade || 'não mapeado'}. Performance: ${['','Abaixo','Regular','Boa','Excelente'][s.pesPerfScore] || 'não avaliada'}.`
      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, marketContext: ctx, role: 'lider' }),
      })
      const j = await res.json()
      setIaAnswer(j.answer ?? '')
    } finally {
      setIaLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">

      {/* Score Header */}
      <div className="rounded-xl px-4 py-4" style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}30` }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users2 size={15} style={{ color: TEAL }} />
            <span className="text-[13px] font-bold text-white/70">Processo de Liderança para Resultados</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[26px] font-black font-mono" style={{ color: liderColor }}>{liderScore}</span>
            <span className="text-[12px] text-white/25 font-mono">/100</span>
          </div>
        </div>
        <div className="h-1.5 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${liderScore}%`, background: liderColor }} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-white/30 mb-1.5">Liderados diretos</p>
            <div className="flex flex-wrap gap-1.5">
              {[1,2,3,4,5,6,8,10].map(n => (
                <button key={n} onClick={() => update({ pesLiderados: n })}
                  className="w-8 h-8 rounded-lg text-[11px] font-mono font-bold transition-all"
                  style={{ background: s.pesLiderados === n ? `${TEAL}30` : 'rgba(0,0,0,0.3)', border: `1px solid ${s.pesLiderados === n ? TEAL + '70' : 'rgba(255,255,255,0.08)'}`, color: s.pesLiderados === n ? TEAL : 'rgba(255,255,255,0.3)' }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/30">Status atual</p>
            <p className="text-[12px] font-bold mt-0.5" style={{ color: liderColor }}>
              {liderScore >= 80 ? 'Liderança efetiva' : liderScore >= 50 ? 'Em desenvolvimento' : 'Atenção necessária'}
            </p>
          </div>
        </div>
      </div>

      {/* 5 Etapas colapsáveis */}
      {etapas.map(etapa => (
        <div key={etapa.id} className="rounded-xl overflow-hidden"
          style={{ border: `1px solid ${expandIdx === etapa.id ? etapa.color + '40' : 'rgba(255,255,255,0.06)'}`, background: expandIdx === etapa.id ? `${etapa.color}08` : 'rgba(0,0,0,0.15)' }}>

          <button className="w-full flex items-center gap-3 px-4 py-3.5"
            onClick={() => setExpandIdx(expandIdx === etapa.id ? null : etapa.id)}>
            <span className="text-[10px] font-mono font-bold" style={{ color: etapa.color, opacity: 0.55 }}>{etapa.num}</span>
            <span className="text-[13px] font-bold flex-1 text-left" style={{ color: expandIdx === etapa.id ? etapa.color : 'rgba(255,255,255,0.65)' }}>{etapa.label}</span>
            <span className="text-[10px] text-white/22 hidden sm:block">{etapa.desc}</span>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-[11px] font-mono font-bold" style={{ color: etapa.color }}>{scores[etapa.id]}/20</span>
              <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.2)', transform: expandIdx === etapa.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>
          </button>

          <AnimatePresence>
            {expandIdx === etapa.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="px-4 pb-4 flex flex-col gap-3">

                  {/* 01 Clareza */}
                  {etapa.id === 0 && <>
                    <div>
                      <p className="text-[10px] text-white/35 mb-1.5">Meta da equipe para o trimestre</p>
                      <input value={s.pesMetaEquipe} onChange={e => update({ pesMetaEquipe: e.target.value })}
                        placeholder="Ex: Fechar 10 novos contratos até 30/06"
                        className="w-full rounded-lg px-3 py-2.5 text-[12px] outline-none"
                        style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${etapa.color}25`, color: 'rgba(255,255,255,0.7)' }} />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/35 mb-1.5">KPI principal — como medir o progresso?</p>
                      <input value={s.pesKpiEquipe} onChange={e => update({ pesKpiEquipe: e.target.value })}
                        placeholder="Ex: Taxa de conversão ≥ 25% | NPS ≥ 70"
                        className="w-full rounded-lg px-3 py-2.5 text-[12px] outline-none"
                        style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${etapa.color}25`, color: 'rgba(255,255,255,0.7)' }} />
                    </div>
                    {(!s.pesMetaEquipe || !s.pesKpiEquipe) && (
                      <div className="rounded-md px-3 py-2" style={{ background: `${etapa.color}08`, border: `1px solid ${etapa.color}20` }}>
                        <p className="text-[11px]" style={{ color: etapa.color }}>Sem meta clara não há liderança — há apenas gerenciamento de agenda.</p>
                      </div>
                    )}
                  </>}

                  {/* 02 Alinhamento */}
                  {etapa.id === 1 && <>
                    <div>
                      <p className="text-[10px] text-white/35 mb-1.5">Último 1:1 realizado</p>
                      <div className="flex items-center gap-3">
                        <input type="date" value={s.pesUltimo1a1} onChange={e => update({ pesUltimo1a1: e.target.value })}
                          className="rounded-lg px-3 py-2 text-[12px] outline-none"
                          style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${etapa.color}25`, color: 'rgba(255,255,255,0.7)' }} />
                        {s.pesUltimo1a1 && (() => {
                          const diff = Math.floor((Date.now() - new Date(s.pesUltimo1a1).getTime()) / 86400000)
                          return <span className="text-[11px]" style={{ color: diff > 14 ? RED : diff > 7 ? AMBER : etapa.color }}>{diff === 0 ? 'hoje' : `há ${diff} dia${diff > 1 ? 's' : ''}`}</span>
                        })()}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/35 mb-1.5">Acordos e compromissos registrados</p>
                      <textarea value={s.pesAcordos} onChange={e => update({ pesAcordos: e.target.value })}
                        placeholder="Ex: Marcos entrega proposta até 5ª. Eu vou destravar acesso ao sistema até amanhã."
                        rows={3} className="w-full rounded-lg px-3 py-2 text-[12px] outline-none resize-none"
                        style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${etapa.color}25`, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }} />
                    </div>
                  </>}

                  {/* 03 Capacitação */}
                  {etapa.id === 2 && <>
                    <div>
                      <p className="text-[10px] text-white/35 mb-1.5">Principal gap de habilidade do time</p>
                      <input value={s.pesGapHabilidade} onChange={e => update({ pesGapHabilidade: e.target.value })}
                        placeholder="Ex: Negociação, técnico de produto, gestão do tempo..."
                        className="w-full rounded-lg px-3 py-2.5 text-[12px] outline-none"
                        style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${etapa.color}25`, color: 'rgba(255,255,255,0.7)' }} />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/35 mb-1.5">Plano de desenvolvimento ativo</p>
                      <textarea value={s.pesPlanoDev} onChange={e => update({ pesPlanoDev: e.target.value })}
                        placeholder="Ex: Curso X na semana 2, shadowing com sênior, leitura 1 livro/mês, feedback semanal..."
                        rows={3} className="w-full rounded-lg px-3 py-2 text-[12px] outline-none resize-none"
                        style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${etapa.color}25`, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }} />
                    </div>
                  </>}

                  {/* 04 Execução */}
                  {etapa.id === 3 && <>
                    <p className="text-[10px] text-white/35">Rituais de time ativos esta semana</p>
                    {[
                      { label: 'Daily (15 min / dia)',          sub: 'O que fiz, o que farei, o que bloqueia' },
                      { label: 'Reunião semanal de time',       sub: 'Revisão de metas, prioridades, bloqueios' },
                      { label: 'Retrospectiva mensal',          sub: 'O que funcionou, o que não, melhorias' },
                    ].map((r, ri) => (
                      <button key={ri}
                        onClick={() => { const arr = [...s.pesRituais]; arr[ri] = !arr[ri]; update({ pesRituais: arr }) }}
                        className="flex items-start gap-3 text-left p-3 rounded-lg transition-all"
                        style={{ background: s.pesRituais[ri] ? `${etapa.color}12` : 'rgba(0,0,0,0.2)', border: `1px solid ${s.pesRituais[ri] ? etapa.color + '35' : 'rgba(255,255,255,0.06)'}` }}>
                        {s.pesRituais[ri]
                          ? <CheckCircle2 size={14} style={{ color: etapa.color, marginTop: 1, flexShrink: 0 }} />
                          : <Circle size={14} style={{ color: 'rgba(255,255,255,0.15)', marginTop: 1, flexShrink: 0 }} />}
                        <div>
                          <p className="text-[12px] font-semibold" style={{ color: s.pesRituais[ri] ? etapa.color : 'rgba(255,255,255,0.5)' }}>{r.label}</p>
                          <p className="text-[10px] text-white/25 mt-0.5">{r.sub}</p>
                        </div>
                      </button>
                    ))}
                    {s.pesRituais.filter(Boolean).length === 0 && (
                      <div className="rounded-md px-3 py-2" style={{ background: `${RED}08`, border: `1px solid ${RED}20` }}>
                        <p className="text-[11px]" style={{ color: RED }}>Rituais são o esqueleto da execução. Sem eles, a equipe opera no improviso.</p>
                      </div>
                    )}
                  </>}

                  {/* 05 Resultado */}
                  {etapa.id === 4 && <>
                    <div>
                      <p className="text-[10px] text-white/35 mb-2">Performance geral da equipe este mês</p>
                      <div className="flex gap-2">
                        {[
                          { v: 1, label: 'Abaixo',   color: RED },
                          { v: 2, label: 'Regular',  color: AMBER },
                          { v: 3, label: 'Boa',      color: BLUE },
                          { v: 4, label: 'Excelente',color: TEAL },
                        ].map(opt => (
                          <button key={opt.v} onClick={() => update({ pesPerfScore: opt.v })}
                            className="flex-1 py-2.5 rounded-lg text-[11px] font-bold transition-all"
                            style={{ background: s.pesPerfScore === opt.v ? `${opt.color}20` : 'rgba(0,0,0,0.3)', border: `1px solid ${s.pesPerfScore === opt.v ? opt.color + '50' : 'rgba(255,255,255,0.07)'}`, color: s.pesPerfScore === opt.v ? opt.color : 'rgba(255,255,255,0.25)' }}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => update({ pesReconhecimento: !s.pesReconhecimento })}
                      className="flex items-center gap-3 p-3 rounded-lg transition-all text-left"
                      style={{ background: s.pesReconhecimento ? `${TEAL}12` : 'rgba(0,0,0,0.2)', border: `1px solid ${s.pesReconhecimento ? TEAL + '35' : 'rgba(255,255,255,0.06)'}` }}>
                      {s.pesReconhecimento
                        ? <CheckCircle2 size={14} style={{ color: TEAL, flexShrink: 0 }} />
                        : <Circle size={14} style={{ color: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />}
                      <div>
                        <p className="text-[12px] font-semibold" style={{ color: s.pesReconhecimento ? TEAL : 'rgba(255,255,255,0.5)' }}>Reconhecimento público feito esta semana</p>
                        <p className="text-[10px] text-white/25 mt-0.5">Celebrei resultados e comportamentos que quero repetir</p>
                      </div>
                    </button>
                    <div>
                      <p className="text-[10px] text-white/35 mb-1.5">Reflexão de liderança (o que posso melhorar?)</p>
                      <textarea value={s.pesReflexao} onChange={e => update({ pesReflexao: e.target.value })}
                        placeholder="O que mais limitou os resultados desta semana? O que eu, como líder, posso mudar?"
                        rows={3} className="w-full rounded-lg px-3 py-2 text-[12px] outline-none resize-none"
                        style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${TEAL}25`, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }} />
                    </div>
                  </>}

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* IA Coach */}
      <div className="rounded-xl p-4" style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}25` }}>
        <div className="flex items-center gap-2 mb-3">
          <Brain size={14} style={{ color: TEAL }} />
          <span className="text-[13px] font-bold" style={{ color: TEAL }}>Coach de Liderança IA</span>
        </div>
        <p className="text-[11px] text-white/40 mb-3 leading-relaxed">
          Baseado nos seus dados ({liderScore}/100 · {s.pesLiderados || '?'} liderados · {s.pesRituais.filter(Boolean).length}/3 rituais ativos), o que quer trabalhar hoje?
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            'Como dar feedback difícil?',
            'Time não bate meta — o que fazer?',
            'Como montar um 1:1 efetivo?',
            'Delegação sem perder controle',
            `Analisar meu score (${liderScore}/100)`,
          ].map(q => (
            <button key={q} onClick={() => askCoach(q)}
              className="px-3 py-1.5 rounded-lg text-[11px] transition-all"
              style={{ background: `${TEAL}15`, border: `1px solid ${TEAL}30`, color: TEAL }}>
              {q}
            </button>
          ))}
        </div>
        {iaLoading && (
          <div className="flex items-center gap-2 py-1">
            <Loader2 size={13} style={{ color: TEAL }} className="animate-spin" />
            <span className="text-[11px]" style={{ color: TEAL }}>Analisando...</span>
          </div>
        )}
        {iaAnswer && !iaLoading && (
          <div className="rounded-lg px-4 py-3" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${TEAL}20` }}>
            <p className="text-[12px] text-white/70 leading-relaxed whitespace-pre-wrap">{iaAnswer}</p>
          </div>
        )}
      </div>

    </div>
  )
}
