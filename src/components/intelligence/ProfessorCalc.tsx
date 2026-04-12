'use client'

/**
 * PROFESSOR CALC — mini-calculadora embutida nas respostas do Professor.
 *
 * Aparece no modo "Aplicar" — permite que o aluno veja o impacto
 * numérico do conceito na prática, com sliders interativos.
 *
 * Props: título, cenário, sliders, fórmula JS, interpretação.
 * Mesma lógica do NumberCruncher, mas compacto e embutido no Professor.
 */

import { useState, useMemo } from 'react'

interface CalcSlider {
  id: string
  label: string
  min: number
  max: number
  default: number
  unit: string
  step?: number
}

interface CalcInterpretation {
  max: number
  label: string
  color: string
}

interface Props {
  title: string
  description: string
  sliders: CalcSlider[]
  formula: string
  resultLabel: string
  resultFormat?: 'currency' | 'percent' | 'number'
  interpretation?: CalcInterpretation[]
}

function formatResult(value: number, format?: string): string {
  if (format === 'currency') {
    if (value >= 1_000_000_000) return `R$ ${(value / 1_000_000_000).toFixed(1)} bi`
    if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)} mi`
    if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)} mil`
    return `R$ ${value.toFixed(0)}`
  }
  if (format === 'percent') return `${value.toFixed(1)}%`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toFixed(1)
}

export default function ProfessorCalc({
  title,
  description,
  sliders,
  formula,
  resultLabel,
  resultFormat,
  interpretation,
}: Props) {
  const [values, setValues] = useState<Record<string, number>>(
    () => {
      const init: Record<string, number> = {}
      sliders.forEach((s) => (init[s.id] = s.default))
      return init
    }
  )

  const result = useMemo(() => {
    try {
      const fn = new Function(...sliders.map((s) => s.id), `return ${formula}`)
      return fn(...sliders.map((s) => values[s.id])) as number
    } catch {
      return 0
    }
  }, [values, sliders, formula])

  const interp = interpretation?.find((i) => result <= i.max)

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: '16px 16px',
        marginBottom: 14,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: 'rgba(255,255,255,0.55)',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        Calculadora
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#ffffff',
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 10,
          lineHeight: 1.5,
          color: 'rgba(255,255,255,0.55)',
          marginBottom: 16,
        }}
      >
        {description}
      </div>

      {/* Sliders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
        {sliders.map((s) => (
          <div key={s.id}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.6)',
                  fontWeight: 600,
                }}
              >
                {s.label}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: 'ui-monospace, monospace',
                  fontWeight: 700,
                  color: '#ffffff',
                }}
              >
                {s.unit === 'R$' ? formatResult(values[s.id], 'currency') : `${values[s.id]}${s.unit}`}
              </span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step ?? 1}
              value={values[s.id]}
              onChange={(e) =>
                setValues((v) => ({ ...v, [s.id]: Number(e.target.value) }))
              }
              style={{
                width: '100%',
                accentColor: '#ffffff',
                height: 3,
              }}
            />
          </div>
        ))}
      </div>

      {/* Resultado */}
      <div
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 8,
          padding: '14px 16px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.45)',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          {resultLabel}
        </div>
        <div
          style={{
            fontSize: 22,
            fontFamily: 'ui-monospace, monospace',
            fontWeight: 700,
            color: interp?.color ?? '#ffffff',
            letterSpacing: '-0.02em',
          }}
        >
          {formatResult(result, resultFormat)}
        </div>
        {interp && (
          <div
            style={{
              fontSize: 10,
              color: interp.color,
              marginTop: 6,
              fontWeight: 600,
            }}
          >
            {interp.label}
          </div>
        )}
      </div>
    </div>
  )
}
