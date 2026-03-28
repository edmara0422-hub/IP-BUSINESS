'use client'

import { useState, useEffect, useCallback } from 'react'

export type AccessibilityMode = 'padrao' | 'foco' | 'calmo' | 'contraste'

export function useAccessibility() {
  const [mode, setMode] = useState<AccessibilityMode>('padrao')

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ipb-accessibility') as AccessibilityMode | null
      if (saved && ['padrao', 'foco', 'calmo', 'contraste'].includes(saved)) {
        setMode(saved)
      }
    }
  }, [])

  // Apply CSS classes to body
  useEffect(() => {
    if (typeof document === 'undefined') return
    const body = document.body

    // Remove all accessibility classes
    body.classList.remove('ipb-foco', 'ipb-calmo', 'ipb-contraste')

    // Apply current mode
    if (mode === 'foco') body.classList.add('ipb-foco')
    if (mode === 'calmo') body.classList.add('ipb-calmo')
    if (mode === 'contraste') body.classList.add('ipb-contraste')
  }, [mode])

  const changeMode = useCallback((newMode: AccessibilityMode) => {
    setMode(newMode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('ipb-accessibility', newMode)
    }
  }, [])

  // Get IA prompt modifier based on mode
  const iaModifier = mode === 'foco'
    ? '\n\nIMPORTANTE: Responda em bullets curtos, máximo 3 linhas por ponto. Vá direto ao essencial. Sem introduções.'
    : mode === 'calmo'
    ? '\n\nIMPORTANTE: Use linguagem literal e direta. Sem metáforas. Sem expressões ambíguas como "mercado aquecido". Diga "setor crescendo X%". Estruture em tópicos numerados.'
    : ''

  return { mode, changeMode, iaModifier }
}
