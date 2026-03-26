'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, SendHorizontal, Loader2, Sparkles } from 'lucide-react'
import { apiFetch } from '@/lib/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function IAAdvisor({ marketData }: { marketData: any }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // Welcome message
  useEffect(() => {
    const selic = marketData?.macro?.selic?.value ?? '—'
    const ipca = marketData?.macro?.ipca?.value ?? '—'
    const pib = marketData?.macro?.pib?.value ?? '—'
    const usd = marketData?.macro?.usdBrl?.value ?? '—'

    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: `Olá! Sou o IA Advisor do IPB. Estou conectado ao mercado em tempo real:\n\n• SELIC: ${selic}%\n• IPCA: ${ipca}%\n• PIB: ${pib}%\n• USD/BRL: R$${usd}\n\nMe pergunte qualquer coisa sobre seu negócio — eu cruzo com esses dados e te dou a ação.`,
      timestamp: new Date(),
    }])
  }, [marketData])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const selic = marketData?.macro?.selic?.value ?? 'N/A'
      const ipca = marketData?.macro?.ipca?.value ?? 'N/A'
      const pib = marketData?.macro?.pib?.value ?? 'N/A'
      const usd = marketData?.macro?.usdBrl?.value ?? 'N/A'
      const sectors = marketData?.sectors?.map((s: { label: string; heat: number; change: number }) =>
        `${s.label}: heat ${s.heat}, ${s.change > 0 ? '+' : ''}${s.change.toFixed(1)}%`
      ).join('; ') ?? ''
      const cac = marketData?.marketing?.cacTrend?.value ?? 'N/A'
      const cacDelta = marketData?.marketing?.cacTrend?.delta ?? 'N/A'

      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMsg.content,
          marketContext: `SELIC: ${selic}%, IPCA: ${ipca}%, PIB: ${pib}%, USD/BRL: R$${usd}, CAC: R$${cac} (${cacDelta}% delta), Setores: ${sectors}`,
        }),
      })

      const data = await res.json()

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer ?? 'Não consegui processar. Tente novamente.',
        timestamp: new Date(),
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Erro ao conectar com a IA. Verifique se a GROQ_API_KEY está configurada.',
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  const suggestions = [
    'Como a SELIC atual afeta meu negócio?',
    'Qual o melhor setor pra investir agora?',
    'Meu CAC está alto, o que fazer?',
    'Devo reajustar preços com essa inflação?',
  ]

  return (
    <div className="flex flex-col h-[70vh] max-h-[600px]">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(93,173,226,0.15)' }}>
          <Brain size={16} color="#5dade2" />
        </div>
        <div>
          <p className="text-[14px] font-bold text-white/80">IA Advisor</p>
          <p className="text-[11px] text-white/30">Conectado ao mercado em tempo real</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400/60 animate-pulse" />
          <span className="text-[10px] text-white/25">LIVE</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[85%] rounded-xl px-3.5 py-2.5"
                style={{
                  background: msg.role === 'user'
                    ? 'rgba(93,173,226,0.15)'
                    : 'rgba(255,255,255,0.04)',
                  border: msg.role === 'user'
                    ? '1px solid rgba(93,173,226,0.25)'
                    : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles size={10} color="#5dade2" />
                    <span className="text-[9px] font-mono font-bold tracking-wider" style={{ color: '#5dade2' }}>IA ADVISOR</span>
                  </div>
                )}
                <p className="text-[13px] text-white/70 leading-relaxed whitespace-pre-line">
                  {msg.content}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Loader2 size={16} className="animate-spin text-white/30" />
            </div>
          </div>
        )}
      </div>

      {/* Suggestions (only when no user messages) */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-[10px] text-white/20 mb-2 font-mono">PERGUNTE À IA</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => { setInput(s); }}
                className="text-[11px] text-white/40 px-3 py-1.5 rounded-full transition-colors hover:text-white/60 hover:bg-white/[0.04]"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/5">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Pergunte sobre seu negócio..."
            className="flex-1 bg-transparent text-[13px] text-white/80 placeholder:text-white/25 outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="p-1.5 rounded-lg transition-colors hover:bg-white/[0.06] disabled:opacity-30"
          >
            <SendHorizontal size={16} className="text-white/50" />
          </button>
        </div>
      </div>
    </div>
  )
}
