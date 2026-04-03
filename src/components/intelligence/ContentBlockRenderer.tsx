'use client'

import SmartContentRenderer from './SmartContentRenderer'
import ConceptCard from './ConceptCard'
import AIProbe from './AIProbe'
import FrameworkBuilder from './FrameworkBuilder'
import ChallengeEngine from './ChallengeEngine'
import NumberCruncher from './NumberCruncher'
import DecisionSimulator from './DecisionSimulator'
import type { ContentBlock } from '@/types/intelligence'

interface Props {
  block: ContentBlock
  moduleId?: string
}

export default function ContentBlockRenderer({ block, moduleId }: Props) {
  switch (block.type) {
    case 'text':
      return <SmartContentRenderer title={block.title ?? ''} body={block.body} />

    case 'concept':
      return <ConceptCard term={block.term} definition={block.definition} example={block.example} antiExample={block.antiExample} />

    case 'ai-probe':
      return <AIProbe context={block.context} sampleQuestions={block.sampleQuestions} moduleId={moduleId} />

    case 'framework':
      return <FrameworkBuilder frameworkId={block.frameworkId} title={block.title} description={block.description} fields={block.fields} />

    case 'challenge':
      return <ChallengeEngine prompt={block.prompt} rubric={block.rubric} artifactType={block.artifactType} exampleResponse={block.exampleResponse} moduleId={moduleId} />

    case 'number-crunch':
      return <NumberCruncher title={block.title} scenario={block.scenario} inputs={block.inputs} formula={block.formula} resultLabel={block.resultLabel} interpretation={block.interpretation} />

    case 'decision':
      return <DecisionSimulator scenario={block.scenario} options={block.options} realWorldAnalog={block.realWorldAnalog} lesson={block.lesson} />

    default:
      return null
  }
}
