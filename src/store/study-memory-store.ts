/**
 * STUDY MEMORY STORE — persiste o que o aluno leu, quando, e com que profundidade.
 *
 * Usa localStorage para persistir entre sessões. Cada entrada é um "conceito"
 * que o aluno encontrou (um capítulo, uma fase, um deepDive, uma classificação).
 *
 * O cálculo de retenção usa a curva de Ebbinghaus simplificada:
 *   R = e^(-t/S)
 *   R = retenção (0 a 1)
 *   t = tempo desde a última exposição (em horas)
 *   S = força da memória (aumenta com repetições e profundidade de interação)
 *
 * Quanto maior S, mais devagar o conceito é esquecido.
 * S começa em 24h (esquece em ~1 dia) e sobe com:
 *   - Releitura (+12h por vez)
 *   - Abertura do deepDive (+18h)
 *   - Classificação correta na interação (+24h)
 */

const STORAGE_KEY = 'ipb-study-memory'

export interface MemoryEntry {
  conceptId: string           // ex: 'M1-0-cap1-fase1', 'M1-0-cap1-deepdive-fase2'
  label: string               // ex: 'Fase 1 — Infraestrutura'
  moduleId: string            // 'M1'
  chapterId: string           // 'M1-0-cap1'
  /** ISO timestamp da primeira exposição */
  firstSeen: string
  /** ISO timestamp da última exposição */
  lastSeen: string
  /** Número de vezes que o aluno visitou este conceito */
  exposures: number
  /** Força da memória em horas (S na fórmula de Ebbinghaus) */
  strength: number
  /** Nível de profundidade alcançado: 'read' | 'deepdive' | 'applied' */
  depth: 'read' | 'deepdive' | 'applied'
}

export interface MemoryState {
  entries: Record<string, MemoryEntry>
}

// ── Persistence ──────────────────────────────────────────────────────

function load(): MemoryState {
  if (typeof window === 'undefined') return { entries: {} }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as MemoryState) : { entries: {} }
  } catch {
    return { entries: {} }
  }
}

function save(state: MemoryState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // silently fail
  }
}

// ── Ebbinghaus ───────────────────────────────────────────────────────

/** Calcula retenção (0 a 1) de um conceito agora */
export function calcRetention(entry: MemoryEntry): number {
  const now = Date.now()
  const lastSeen = new Date(entry.lastSeen).getTime()
  const hoursElapsed = (now - lastSeen) / (1000 * 60 * 60)
  const R = Math.exp(-hoursElapsed / entry.strength)
  return Math.max(0, Math.min(1, R))
}

/** Urgência de revisão (0 = não precisa, 1 = urgente) */
export function calcUrgency(entry: MemoryEntry): number {
  return 1 - calcRetention(entry)
}

/** Cor baseada na retenção: branco (fresco) → âmbar (esfriando) → vermelho (esquecendo) */
export function retentionColor(retention: number): string {
  if (retention > 0.7) return '#ffffff'           // fresco
  if (retention > 0.4) return 'rgba(255,180,60,0.9)' // esfriando
  return 'rgba(255,80,80,0.9)'                     // esquecendo
}

/** Label textual */
export function retentionLabel(retention: number): string {
  if (retention > 0.7) return 'Fresco na memória'
  if (retention > 0.4) return 'Esfriando — revise em breve'
  return 'Esquecendo — revise agora'
}

// ── Actions ──────────────────────────────────────────────────────────

const INITIAL_STRENGTH = 24     // horas
const READ_BOOST = 12           // +12h por releitura
const DEEPDIVE_BOOST = 18       // +18h por deepdive
const APPLIED_BOOST = 24        // +24h por classificação correta

/**
 * Registra que o aluno viu um conceito.
 * Se já existe, incrementa exposures e strength.
 */
export function recordExposure(
  conceptId: string,
  label: string,
  moduleId: string,
  chapterId: string,
  depth: 'read' | 'deepdive' | 'applied' = 'read',
): void {
  const state = load()
  const existing = state.entries[conceptId]
  const now = new Date().toISOString()

  const depthBoost =
    depth === 'applied' ? APPLIED_BOOST
    : depth === 'deepdive' ? DEEPDIVE_BOOST
    : READ_BOOST

  if (existing) {
    existing.lastSeen = now
    existing.exposures += 1
    existing.strength += depthBoost
    // Depth só sobe, nunca desce
    if (depth === 'applied') existing.depth = 'applied'
    else if (depth === 'deepdive' && existing.depth === 'read') existing.depth = 'deepdive'
  } else {
    state.entries[conceptId] = {
      conceptId,
      label,
      moduleId,
      chapterId,
      firstSeen: now,
      lastSeen: now,
      exposures: 1,
      strength: INITIAL_STRENGTH + depthBoost,
      depth,
    }
  }

  save(state)
}

/**
 * Retorna todos os conceitos de um módulo, ordenados por urgência (mais urgente primeiro).
 */
export function getModuleMemory(moduleId: string): Array<MemoryEntry & { retention: number; urgency: number }> {
  const state = load()
  return Object.values(state.entries)
    .filter((e) => e.moduleId === moduleId)
    .map((e) => ({ ...e, retention: calcRetention(e), urgency: calcUrgency(e) }))
    .sort((a, b) => b.urgency - a.urgency)
}

/**
 * Retorna os N conceitos mais urgentes (cross-module).
 */
export function getMostUrgent(n: number = 5): Array<MemoryEntry & { retention: number; urgency: number }> {
  const state = load()
  return Object.values(state.entries)
    .map((e) => ({ ...e, retention: calcRetention(e), urgency: calcUrgency(e) }))
    .sort((a, b) => b.urgency - a.urgency)
    .slice(0, n)
}

/**
 * Retorna dados formatados para o Professor usar no modo "review".
 */
export function getReviewData(moduleId: string): string {
  const entries = getModuleMemory(moduleId)
  if (entries.length === 0) return 'Nenhum conceito registrado ainda neste módulo.'

  const lines = entries.map((e) => {
    const pct = Math.round(e.retention * 100)
    const status = e.retention > 0.7 ? '✓' : e.retention > 0.4 ? '⚠' : '✗'
    const depthLabel = e.depth === 'applied' ? 'aplicou' : e.depth === 'deepdive' ? 'aprofundou' : 'leu'
    const hours = Math.round((Date.now() - new Date(e.lastSeen).getTime()) / 3600000)
    return `${status} ${e.label} — retenção ${pct}% — ${depthLabel} — última vez há ${hours}h — ${e.exposures}x visto`
  })

  return `MAPA DE MEMÓRIA DO ALUNO (curva de Ebbinghaus):\n${lines.join('\n')}\n\nConceitos com ✗ estão sendo esquecidos e devem ser priorizados na revisão.`
}
