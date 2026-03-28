'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, SendHorizontal, Loader2, Sparkles, RefreshCw } from 'lucide-react'
import { useAccessibility } from '@/hooks/useAccessibility'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function IAAdvisor({ marketData }: { marketData: any }) {
  const { iaModifier } = useAccessibility()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [briefingLoaded, setBriefingLoaded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // Build full market context string
  const buildContext = useCallback(() => {
    if (!marketData?.macro) return ''
    const selic = marketData.macro?.selic?.value ?? 'N/A'
    const ipca = marketData.macro?.ipca?.value ?? 'N/A'
    const pib = marketData.macro?.pib?.value ?? 'N/A'
    const usd = marketData.macro?.usdBrl?.value ?? 'N/A'
    const sectors = marketData.sectors?.map((s: any) =>
      `${s.label}: heat ${s.heat}/100, variação ${s.change > 0 ? '+' : ''}${s.change?.toFixed(1)}%`
    ).join('\n  ') ?? ''
    const commodities = Object.entries(marketData.commodities ?? {}).map(([, c]: [string, any]) =>
      `${c.label}: US$${c.value?.toFixed(c.value > 100 ? 0 : 2)} (${c.delta > 0 ? '+' : ''}${c.delta?.toFixed(1)}%)`
    ).join('\n  ') ?? ''
    const agents = marketData.globalAgents?.map((a: any) =>
      `${a.label}: ${a.delta > 0 ? '+' : ''}${a.delta?.toFixed(1)}%`
    ).join(', ') ?? ''
    const cac = marketData.marketing?.cacTrend?.value ?? 'N/A'
    const cacD = marketData.marketing?.cacTrend?.delta ?? 'N/A'
    const cpm = marketData.marketing?.cpmGlobal?.value ?? 'N/A'
    const organic = marketData.marketing?.organicShare?.value ?? 'N/A'
    const problems = marketData.centralProblems?.map((p: any) =>
      `${p.label}: afeta ${p.affected}% das empresas`
    ).join('\n  ') ?? ''
    const opps = marketData.opportunities?.map((o: any) =>
      `${o.label}: urgência ${o.urgency}%`
    ).join('\n  ') ?? ''

    return `DADOS MACRO:
  SELIC: ${selic}%
  IPCA: ${ipca}%
  PIB: ${pib}%
  USD/BRL: R$${usd}

SETORES (heat 0-100):
  ${sectors}

COMMODITIES:
  ${commodities}

AGENTES GLOBAIS: ${agents}

MARKETING:
  CAC médio: R$${cac} (${cacD}% delta)
  CPM global: US$${cpm}
  Tráfego orgânico: ${organic}%

PROBLEMAS CENTRAIS:
  ${problems}

OPORTUNIDADES:
  ${opps}`
  }, [marketData])

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
          question: `Faça uma ANÁLISE COMPLETA do mercado brasileiro agora. Organize assim:

📊 PANORAMA GERAL (1 parágrafo resumindo o momento)

💰 MACRO — como SELIC, IPCA, câmbio e PIB se conectam e o que isso gera pra quem tem negócio

📈 SETORES — quais estão quentes, quais estão frios, onde está a oportunidade

🎯 MARKETING — CAC, CPM, orgânico: está caro crescer? o que fazer?

⚠️ RISCOS — os 3 maiores riscos agora e como LUCRAR com cada um

🚀 AÇÃO IMEDIATA — as 3 coisas que qualquer empresa deveria fazer AGORA baseado nesses dados

Use TODOS os dados que te passei. Seja específico com números reais. Não seja genérico.${iaModifier}`,
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
        body: JSON.stringify({ question: userMsg.content + iaModifier, marketContext: ctx }),
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
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles size={11} color="#5dade2" />
                    <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: '#5dade2' }}>ANÁLISE IPB</span>
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
