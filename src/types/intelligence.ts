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

export type ContentBlock =
  | TextBlock | VideoBlock | SimulationBlock | AttachmentBlock
  | ConceptBlock | ChallengeBlock | DecisionBlock | FrameworkBlock | NumberCrunchBlock | AIProbeBlock

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
