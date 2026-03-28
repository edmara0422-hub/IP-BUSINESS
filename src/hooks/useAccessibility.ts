'use client'

import { useState, useEffect, useCallback } from 'react'

export type AccessibilityMode = 'padrao' | 'foco' | 'calmo' | 'contraste'

const MODE_LABELS: Record<AccessibilityMode, string> = {
  padrao: 'Modo Padrão ativado',
  foco: 'Modo Foco ativado — menos estímulos visuais',
  calmo: 'Modo Calmo ativado — sem animações',
  contraste: 'Alto Contraste ativado — fontes maiores',
}

function showToast(message: string) {
  if (typeof document === 'undefined') return

  // Remove toast anterior se existir
  const old = document.getElementById('ipb-accessibility-toast')
  if (old) old.remove()

  const toast = document.createElement('div')
  toast.id = 'ipb-accessibility-toast'
  toast.textContent = message
  toast.style.cssText = `
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(93,173,226,0.95);
    color: #fff;
    padding: 10px 20px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    font-family: system-ui, sans-serif;
    z-index: 99999;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    animation: ipb-toast-in 0.3s ease-out;
    pointer-events: none;
  `
  document.body.appendChild(toast)
  setTimeout(() => {
    toast.style.animation = 'ipb-toast-out 0.3s ease-in forwards'
    setTimeout(() => toast.remove(), 300)
  }, 2000)
}

export function useAccessibility() {
  const [mode, setMode] = useState<AccessibilityMode>('padrao')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ipb-accessibility') as AccessibilityMode | null
      if (saved && ['padrao', 'foco', 'calmo', 'contraste'].includes(saved)) {
        setMode(saved)
      }
    }

    // Inject toast animation CSS
    if (typeof document !== 'undefined' && !document.getElementById('ipb-toast-css')) {
      const style = document.createElement('style')
      style.id = 'ipb-toast-css'
      style.textContent = `
        @keyframes ipb-toast-in { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @keyframes ipb-toast-out { from { opacity: 1; } to { opacity: 0; transform: translateX(-50%) translateY(20px); } }
      `
      document.head.appendChild(style)
    }
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const body = document.body
    body.classList.remove('ipb-foco', 'ipb-calmo', 'ipb-contraste')
    if (mode === 'foco') body.classList.add('ipb-foco')
    if (mode === 'calmo') body.classList.add('ipb-calmo')
    if (mode === 'contraste') body.classList.add('ipb-contraste')
  }, [mode])

  const changeMode = useCallback((newMode: AccessibilityMode) => {
    setMode(newMode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('ipb-accessibility', newMode)
    }
    showToast(MODE_LABELS[newMode])
  }, [])

  const iaModifier = mode === 'foco'
    ? '\n\nIMPORTANTE: Responda em bullets curtos, máximo 3 linhas por ponto. Vá direto ao essencial. Sem introduções.'
    : mode === 'calmo'
    ? '\n\nIMPORTANTE: Use linguagem literal e direta. Sem metáforas. Sem expressões ambíguas como "mercado aquecido". Diga "setor crescendo X%". Estruture em tópicos numerados.'
    : ''

  return { mode, changeMode, iaModifier }
}
