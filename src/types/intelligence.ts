export type TextBlock = {
  id: string
  type: 'text'
  title?: string
  body: string
}

export type VideoBlock = {
  id: string
  type: 'video'
  title: string
  url: string
  thumbnail?: string
  duration?: string
}

export type SimulationBlock = {
  id: string
  type: 'simulation'
  title: string
  simulationId: string
  description?: string
}

export type AttachmentBlock = {
  id: string
  type: 'attachment'
  title: string
  url: string
  fileType: string
}

// ── Novos tipos interativos ──

export type ConceptBlock = {
  id: string
  type: 'concept'
  term: string
  definition: string
  example?: string
  antiExample?: string
  relatedTerms?: string[]
}

export type ChallengeBlock = {
  id: string
  type: 'challenge'
  prompt: string
  contextNeeded?: string[]
  rubric: string[]
  artifactType: 'analysis' | 'canvas' | 'matrix' | 'decision' | 'calculation'
  exampleResponse?: string
}

export type DecisionBlock = {
  id: string
  type: 'decision'
  scenario: string
  options: Array<{
    label: string
    tradeoffs: { upside: string; downside: string; risk: 'low' | 'medium' | 'high' }
  }>
  realWorldAnalog?: string
  lesson?: string
}

export type FrameworkBlock = {
  id: string
  type: 'framework'
  frameworkId: string
  title: string
  description: string
  fields: Array<{
    id: string
    label: string
    placeholder: string
    helpText?: string
  }>
}

export type NumberCrunchBlock = {
  id: string
  type: 'number-crunch'
  title: string
  scenario: string
  inputs: Array<{ id: string; label: string; defaultValue: number; unit: string; min?: number; max?: number }>
  formula: string
  resultLabel: string
  interpretation: Array<{ max: number; label: string; color: 'green' | 'amber' | 'red' }>
}

export type AIProbeBlock = {
  id: string
  type: 'ai-probe'
  context: string
  sampleQuestions: string[]
}

// ── Redesign: conteúdo em camadas, referências vivas e estudo dirigido ──

/**
 * Referência inline — autor, estudo, case ou livro citado dentro de um texto.
 * Vira pílula clicável no SmartContentRenderer; abre ficha lateral com contexto.
 */
export type InlineRef = {
  id: string
  label: string                // "Guilford (1967)"
  kind: 'author' | 'study' | 'case' | 'book' | 'framework'
  summary: string              // 1-2 linhas de contexto
  year?: number
  affiliation?: string         // universidade, empresa
  details?: string             // texto longo opcional
  relatedRefs?: string[]       // ids de outras refs ligadas
}

/**
 * Texto em camadas de profundidade. Aluno escolhe quanto quer aprofundar.
 * Toda camada pode ter referências inline marcadas com {{refId}}.
 */
export type LayeredTextBlock = {
  id: string
  type: 'layered-text'
  title: string
  essence: string              // ~50 palavras — o que é, quando usar
  development: string          // ~200 palavras — como funciona, 1 exemplo
  depth: string                // texto completo — autores, estudos, nuances
  mastery?: string             // referências externas, livros, estudos originais
  refs?: InlineRef[]           // refs citadas nas camadas (marcadas {{refId}})
}

/**
 * Comparação lado a lado. Aluno enxerga padrão entre itens.
 * Usado para cases (Havaianas vs Nubank vs Embraer) ou frameworks (GRI vs SASB).
 */
export type CompareBlock = {
  id: string
  type: 'compare'
  title: string
  question?: string            // pergunta que provoca a comparação
  dimensions: string[]         // linhas da tabela: "Setor", "Criou em", "Base"
  items: Array<{
    id: string
    label: string              // "Havaianas"
    values: string[]           // valores alinhados com dimensions
    highlight?: string         // insight que essa coluna revela
  }>
  insight?: string             // padrão que emerge da comparação
}

/**
 * Exercício embutido no fluxo do texto. Não é challenge grande — é micro-tarefa.
 * IA avalia em tempo real e devolve feedback curto.
 */
export type InlineExerciseBlock = {
  id: string
  type: 'inline-exercise'
  prompt: string               // o que aluno deve fazer
  context?: string             // contexto do exercício (caso, dado)
  fields: Array<{
    id: string
    label: string
    placeholder?: string
    multiline?: boolean
  }>
  evaluationCriteria: string[] // o que IA deve avaliar
  expectedConcepts?: string[]  // conceitos que resposta deveria tocar
}

/**
 * Ficha de autor/pesquisador. Pode ser bloco standalone ou aberta via InlineRef.
 */
export type AuthorCardBlock = {
  id: string
  type: 'author-card'
  name: string
  role: string                 // "Psicólogo cognitivo"
  affiliation: string          // universidade
  years: string                // "1897-1987"
  keyStudy: string             // estudo principal
  keyYear: number
  contribution: string         // o que trouxe de novo
  book?: string
  quote?: string               // citação marcante
}

/**
 * Linha do tempo de eventos/autores/conceitos.
 * Aluno navega cronologicamente e vê evolução do conhecimento.
 */
export type TimelineBlock = {
  id: string
  type: 'timeline'
  title: string
  events: Array<{
    year: number
    title: string
    description: string
    authorRef?: string         // id de InlineRef/AuthorCard relacionado
    milestone?: boolean        // marco decisivo
  }>
}

/**
 * Card de método/framework com quando usar + quando NÃO usar.
 * Ensina julgamento, não só o método.
 */
export type MethodCardBlock = {
  id: string
  type: 'method-card'
  name: string                 // "Design Thinking"
  origin: string               // "IDEO / Stanford d.school"
  whenToUse: string[]          // situações onde brilha
  whenNotToUse: string[]       // situações onde falha
  cost: 'low' | 'medium' | 'high'
  time: string                 // "3 dias" ou "2-6 semanas"
  steps: string[]              // etapas do método
  example: string              // case real curto
}

// ── Guided Lesson (Brilliant-style step-by-step interactive) ──

export type GLStepPrompt = {
  type: 'prompt'
  text: string
  options: Array<{ label: string; correct?: boolean; feedback: string }>
}

export type GLStepTimeline = {
  type: 'timeline-reveal'
  markers: Array<{ year: string; label: string; sublabel: string; detail: string }>
  closingText?: string
}

export type GLStepCaseQuiz = {
  type: 'case-quiz'
  company: string
  context: string
  question: string
  options: Array<{ label: string; correct?: boolean; feedback: string }>
  phaseTag?: string
}

export type GLStepDrag = {
  type: 'drag-connect'
  instruction: string
  items: Array<{ from: string; to: string }>
  completionText: string
}

export type GLStepOpenQuestion = {
  type: 'open-question'
  context: string
  question: string
  aiSystemPrompt: string
  expectedKeywords?: string[]
}

export type GLStepSelfAssess = {
  type: 'self-assess'
  instruction: string
  axes: Array<{ id: string; label: string; options: string[] }>
  gapLogic: Array<{ condition: string; message: string }>
}

export type GLStepAIFeedback = {
  type: 'ai-feedback'
  variants: Array<{ condition: string; message: string }>
  fallback: string
}

export type GLStepCalculator = {
  type: 'calculator'
  title: string
  sliders: Array<{ id: string; label: string; min: number; max: number; default: number; unit: string }>
  formula: string
  resultLabel: string
  resultSuffix?: string
  interpretation: Array<{ max: number; label: string; color: 'green' | 'amber' | 'red' }>
}

export type GLStepSummary = {
  type: 'summary'
  checkmarks: string[]
  fullTextBlockId?: string
}

export type GLStepSandbox = {
  type: 'sandbox'
  title: string
  description: string
  variables: Array<{ id: string; label: string; min: number; max: number; default: number; step?: number; unit: string }>
  outputs: Array<{
    id: string
    label: string
    formula: string
    unit: string
    color: string
    format?: 'currency' | 'percent' | 'number'
  }>
  insight: string
}

export type GLStepDecisionSim = {
  type: 'decision-sim'
  title: string
  rounds: Array<{
    year: string
    context: string
    options: Array<{
      label: string
      effects: Record<string, number>
      feedback: string
    }>
  }>
  metrics: Array<{ id: string; label: string; initial: number; unit: string; format?: 'currency' | 'percent' | 'number' }>
  finalInsight: string
}

export type GLStepDiagnosticRadar = {
  type: 'diagnostic-radar'
  title: string
  description: string
  dimensions: Array<{ id: string; label: string; question: string; options: Array<{ label: string; value: number }> }>
  interpretation: Array<{ maxAvg: number; label: string; message: string; color: string }>
}

export type GLStepBuildCanvas = {
  type: 'build-canvas'
  title: string
  description: string
  zones: Array<{ id: string; label: string; accepts: string[] }>
  pieces: Array<{ id: string; label: string; zone: string; hint?: string }>
  completionText: string
}

export type GLStepLiveComparator = {
  type: 'live-comparator'
  title: string
  scenarios: Array<{ id: string; label: string; description: string; metrics: Record<string, string | number> }>
  metricLabels: Record<string, string>
  insight: string
}

export type GLStep =
  | GLStepPrompt | GLStepTimeline | GLStepCaseQuiz | GLStepDrag
  | GLStepOpenQuestion | GLStepSelfAssess | GLStepAIFeedback
  | GLStepCalculator | GLStepSummary
  | GLStepSandbox | GLStepDecisionSim | GLStepDiagnosticRadar
  | GLStepBuildCanvas | GLStepLiveComparator

export type GuidedLessonBlock = {
  id: string
  type: 'guided-lesson'
  title: string
  estimatedMinutes: number
  steps: GLStep[]
  fullTextBlockId?: string
}

export type ContentBlock =
  | TextBlock | VideoBlock | SimulationBlock | AttachmentBlock
  | ConceptBlock | ChallengeBlock | DecisionBlock | FrameworkBlock | NumberCrunchBlock | AIProbeBlock
  | LayeredTextBlock | CompareBlock | InlineExerciseBlock | AuthorCardBlock | TimelineBlock | MethodCardBlock
  | GuidedLessonBlock

export type SubmoduleTopic = {
  id: string
  title: string
  blocks: ContentBlock[]
}

export type ModuleContent = {
  moduleId: string
  topics: SubmoduleTopic[]
}

export type TutorMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type ComprehensionScore = {
  conceptsCorrect: number
  conceptsTotal: number
  challengesCompleted: string[]
  challengeScores: Record<string, number>
  frameworksFilled: string[]
  aiProbesPassed: number
  aiProbesTotal: number
  timeSpent: number
}

export type StudyArtifact = {
  id: string
  type: 'framework' | 'challenge' | 'decision' | 'calculation'
  moduleId: string
  title: string
  data: Record<string, string | number>
  score?: number
  createdAt: string
}
