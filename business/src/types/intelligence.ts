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

export type ContentBlock = TextBlock | VideoBlock | SimulationBlock | AttachmentBlock

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
