'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, SendHorizontal, Loader2, Sparkles, RefreshCw } from 'lucide-react'
import { useAccessibility } from '@/hooks/useAccessibility'

function AudioBtn({ text }: { text: string }) {
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    if (!('speechSynthesis' in window)) return
    if (playing) { window.speechSynthesis.cancel(); setPlaying(false); return }
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = 'pt-BR'; utt.rate = 1.05; utt.pitch = 1
    const voices = window.speechSynthesis.getVoices()
    const ptBr = voices.find(v => v.lang === 'pt-BR') ?? voices.find(v => v.lang.startsWith('pt'))
    if (ptBr) utt.voice = ptBr
    utt.onend = () => setPlaying(false)
    utt.onerror = () => setPlaying(false)
    window.speechSynthesis.speak(utt)
    setPlaying(true)
  }

  useEffect(() => () => { if (playing) window.speechSynthesis.cancel() }, [playing])

  return (
    <button onClick={toggle} title={playing ? 'Parar áudio' : 'Ouvir resposta'}
      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s', background: playing ? 'rgba(93,173,226,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${playing ? 'rgba(93,173,226,0.35)' : 'rgba(255,255,255,0.08)'}` }}>
      {playing ? (
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <rect x="2" y="1" width="3" height="10" rx="1" fill="#5dade2" />
          <rect x="7" y="1" width="3" height="10" rx="1" fill="#5dade2" />
        </svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M3 2L10 6L3 10V2Z" fill="rgba(93,173,226,0.7)" />
        </svg>
      )}
      <span style={{ fontSize: 7, fontFamily: 'monospace', letterSpacing: '0.1em', color: playing ? '#5dade2' : 'rgba(255,255,255,0.28)' }}>
        {playing ? 'PARAR' : 'OUVIR'}
      </span>
    </button>
  )
}

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function IAAdvisor({ marketData, userProfile, contextMode = 'gestao' }: { marketData: any; userProfile?: any; contextMode?: 'gestao' | 'consultoria' | 'estudo' }) {
  const { iaModifier } = useAccessibility()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [briefingLoaded, setBriefingLoaded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // Build full market context string — todos os campos da API /market
  const buildContext = useCallback(() => {
    if (!marketData?.macro) return ''
    const m   = marketData.macro
    const selic = m.selic?.value ?? 'N/A'
    const ipca  = m.ipca?.value  ?? 'N/A'
    const pib   = m.pib?.value   ?? 'N/A'
    const usd   = m.usdBrl?.value ?? 'N/A'
    const usdD  = m.usdBrl?.delta ?? 0

    const sectors = (marketData.sectors ?? []).map((s: any) =>
      `${s.label}: heat ${s.heat}/100 | ${s.change >= 0 ? '+' : ''}${s.change?.toFixed(1)}% hoje | tendência: ${s.trend}`
    ).join('\n  ')

    const commodities = Object.entries(marketData.commodities ?? {}).map(([, c]: [string, any]) =>
      `${c.label}: US$${c.value?.toFixed(c.value > 100 ? 0 : 2)} (${c.delta >= 0 ? '+' : ''}${c.delta?.toFixed(1)}%)`
    ).join('\n  ')

    const agents = (marketData.globalAgents ?? []).map((a: any) =>
      `${a.label}: ${a.delta >= 0 ? '+' : ''}${a.delta?.toFixed(1)}% — ${a.impact}`
    ).join('\n  ')

    const stocks = (marketData.stocks?.br ?? []).map((s: any) =>
      `${s.ticker} R$${s.price} (${s.pct >= 0 ? '+' : ''}${s.pct}%)`
    ).join(' | ')
    const ibov = marketData.stocks?.ibov
      ? `IBOVESPA: ${marketData.stocks.ibov.value?.toLocaleString('pt-BR')} pts (${marketData.stocks.ibov.pct >= 0 ? '+' : ''}${marketData.stocks.ibov.pct}%)`
      : ''

    const credit = marketData.creditRates ?? {}
    const creditLines = Object.entries(credit).map(([, c]: [string, any]) =>
      `${c.label}: ${c.value}% a.a.`
    ).join(' | ')

    const mkt = marketData.marketing ?? {}
    const platforms = (marketData.platforms ?? []).map((p: any) =>
      `${p.label}: CPM US$${p.cpm ?? p.cpc ?? '—'} (${(p.cpmDelta ?? p.cpcDelta ?? 0) >= 0 ? '+' : ''}${(p.cpmDelta ?? p.cpcDelta ?? 0).toFixed(1)}%) — ${p.note ?? ''}`
    ).join('\n  ')

    const problems = (marketData.centralProblems ?? []).map((p: any) =>
      `${p.label}: afeta ${p.affected}% das empresas`
    ).join('\n  ')

    const opps = (marketData.opportunities ?? []).map((o: any) =>
      `${o.label} (urgência ${o.urgency}%)`
    ).join('\n  ')

    const phaseCtx = userProfile ? `PERFIL DO USUÁRIO:
  Tipo: ${userProfile.type === 'pj' ? 'Pessoa Jurídica' : 'Pessoa Física'}
  Fase: ${userProfile.subtype ?? 'não informada'}
  Setor(es): ${userProfile.sectors?.join(', ') || 'não informado'}
  Faturamento: ${userProfile.revenue || 'não informado'}
  Produto/Serviço: ${userProfile.product?.join(', ') || 'não informado'}

` : ''

    return `${phaseCtx}MACRO (dados reais BCB/IBGE/Focus):
  SELIC: ${selic}% a.a. | IPCA 12m: ${ipca}% | PIB projeção: ${pib}% | USD/BRL: R$${usd} (${usdD >= 0 ? '+' : ''}${usdD})
  IBC-Br (atividade real): ${marketData.ibcBr ?? '—'}% | Inadimplência PJ: ${marketData.inadimplenciaPJ ?? '—'}% | Desemprego PNAD: ${marketData.desemprego ?? '—'}%

CRÉDITO PJ (BCB, taxa média a.a.):
  ${creditLines}

SETORES (heat 0–100 | base editorial + variação B3 ×5):
  ${sectors}

COMMODITIES:
  ${commodities}

AÇÕES BR (Yahoo Finance ao vivo):
  ${ibov}
  ${stocks}

AGENTES GLOBAIS:
  ${agents}

MARKETING & PLATAFORMAS:
  CAC médio BR: R$${mkt.cacTrend?.value ?? '—'} (${(mkt.cacTrend?.delta ?? 0) >= 0 ? '+' : ''}${mkt.cacTrend?.delta ?? 0}% delta)
  CPM global médio: US$${mkt.cpmGlobal?.value ?? '—'} | Orgânico: ${mkt.organicShare?.value ?? '—'}% | Vídeo: ${mkt.videoShare?.value ?? '—'}% | IA Mkt adoção: ${mkt.aiAdoption?.value ?? '—'}%
  ${platforms}

PROBLEMAS CENTRAIS PME BR:
  ${problems}

OPORTUNIDADES ABERTAS:
  ${opps}`
  }, [marketData, userProfile])

  // Auto-generate full briefing on mount
  useEffect(() => {
    if (!marketData?.macro || briefingLoaded) return
    setBriefingLoaded(true)
    generateBriefing()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketData])

  const generateBriefing = async () => {
    const ctx = buildContext()
    if (!ctx) return
    setLoading(true)

    setMessages([{
      id: 'loading-msg',
      role: 'system',
      content: 'Analisando mercado em tempo real...',
    }])

    try {
      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: contextMode === 'estudo'
            ? `Analise os dados de mercado abaixo e explique de forma didática, conectando os números reais à teoria de gestão (OBI, Inteligência Organizacional, estratégia). Estruture assim:

📚 O QUE ESTÁ ACONTECENDO — leia os dados e explique em linguagem clara o que cada indicador significa na prática (SELIC, IPCA, setores, B3, crédito PJ)

🔗 CONEXÃO COM TEORIA — como os dados se encaixam nos frameworks de gestão: ciclos econômicos, análise setorial, custo de capital, comportamento do consumidor

📊 LEITURA DOS SETORES — quais setores estão em expansão (heat alto), quais estão em contração, e como isso se conecta às 5 Forças e curva S de inovação

💡 APRENDIZADO PRÁTICO — 3 lições que um gestor ou estudante deve extrair desse momento de mercado, com base nos números reais

Use os números reais fornecidos. Seja um educador que transforma dados em aprendizado.${iaModifier}`
            : `${userProfile ? `PERFIL: fase "${userProfile.subtype ?? '?'}", setor "${userProfile.sectors?.join(', ') || '?'}", faturamento "${userProfile.revenue || '?'}". Filtre TODA análise por esse perfil.\n\n` : ''}Faça uma ANÁLISE EXECUTIVA COMPLETA cruzando TODOS os dados. Organize assim:

📊 PANORAMA — 2 frases densas cruzando macro + setor + momento${userProfile?.subtype ? ` para fase ${userProfile.subtype}` : ''}

💰 MACRO CRUZADO — SELIC ${marketData?.macro?.selic?.value ?? '?'}% + IPCA ${marketData?.macro?.ipca?.value ?? '?'}% + IBC-Br + inadimplência PJ + câmbio: o que está apertando e o que está abrindo${userProfile?.sectors?.length ? ` para ${userProfile.sectors[0]}` : ''}

📈 SETORES & AÇÕES — quais heats mais altos, qual ação subiu mais, onde está o dinheiro. Cruze B3 com setores.${userProfile?.sectors?.length ? ` Destaque ${userProfile.sectors[0]}.` : ''}

🎯 MARKETING & CUSTO DE CRESCER — CAC atual, plataforma mais barata (CPM/CPC), orgânico vs pago. Canal específico com número.

💳 CRÉDITO & CAIXA — taxa PJ hoje por setor, custo mensal de R$10k, como otimizar capital nesse cenário.

⚠️ 3 RISCOS CRÍTICOS — número + ação de proteção ESTA SEMANA

🚀 3 AÇÕES IMEDIATAS — o que ${userProfile?.subtype ? `empresa ${userProfile.subtype}` : 'qualquer PME'} deve fazer AGORA. Mínimo 6 números reais. Zero generalidades.${iaModifier}`,
          marketContext: ctx,
        }),
      })
      const data = await res.json()

      setMessages([{
        id: 'briefing',
        role: 'assistant',
        content: data.answer ?? 'Não foi possível gerar a análise. Verifique a GROQ_API_KEY.',
      }])
    } catch {
      setMessages([{
        id: 'error',
        role: 'assistant',
        content: 'Erro ao conectar com a IA. Verifique se a GROQ_API_KEY está configurada no Vercel.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const ctx = buildContext()
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMsg.content + iaModifier,
          marketContext: ctx,
          ...(contextMode === 'estudo' ? { role: 'educator' } : {}),
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer ?? 'Não consegui processar.',
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Erro ao conectar com a IA.',
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[75vh] max-h-[700px]">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(93,173,226,0.15)' }}>
            <Brain size={16} color="#5dade2" />
          </div>
          <div>
            <p className="text-[14px] font-bold text-white/80">IA Advisor</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-pulse" />
              <span className="text-[10px] text-white/25">Conectado ao mercado em tempo real</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => { setBriefingLoaded(false); generateBriefing() }}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-white/30 hover:text-white/50 hover:bg-white/[0.04] transition-colors disabled:opacity-30"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Atualizar análise
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${msg.role === 'user' ? 'flex justify-end' : ''}`}
            >
              {msg.role === 'system' ? (
                <div className="flex items-center justify-center gap-2 py-4">
                  <Loader2 size={14} className="animate-spin text-white/30" />
                  <span className="text-[12px] text-white/30">{msg.content}</span>
                </div>
              ) : msg.role === 'user' ? (
                <div className="max-w-[85%] rounded-xl px-4 py-3"
                  style={{ background: 'rgba(93,173,226,0.12)', border: '1px solid rgba(93,173,226,0.2)' }}>
                  <p className="text-[13px] text-white/70 leading-relaxed">{msg.content}</p>
                </div>
              ) : (
                <div className="rounded-xl px-4 py-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={11} color="#5dade2" />
                      <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: '#5dade2' }}>ANÁLISE IPB</span>
                    </div>
                    <AudioBtn text={msg.content} />
                  </div>
                  <div className="text-[13px] text-white/65 leading-relaxed whitespace-pre-line">
                    {msg.content}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && messages[messages.length - 1]?.role !== 'system' && (
          <div className="flex items-center gap-2 py-2">
            <Loader2 size={14} className="animate-spin text-white/30" />
            <span className="text-[12px] text-white/30">Processando...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/5">
        <p className="text-[10px] text-white/15 mb-2 font-mono">PERGUNTE MAIS — A IA CRUZA COM TODOS OS DADOS DE MERCADO</p>
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ex: Como reduzir meu CAC? Devo investir em tech? Qual preço cobrar?"
            className="flex-1 bg-transparent text-[13px] text-white/80 placeholder:text-white/20 outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="p-2 rounded-lg transition-colors hover:bg-white/[0.06] disabled:opacity-30"
          >
            <SendHorizontal size={16} className="text-white/50" />
          </button>
        </div>
      </div>
    </div>
  )
}
