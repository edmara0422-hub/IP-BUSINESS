'use client'

import SmartContentRenderer from './SmartContentRenderer'
import ConceptCard from './ConceptCard'
import AIProbe from './AIProbe'
import FrameworkBuilder from './FrameworkBuilder'
import ChallengeEngine from './ChallengeEngine'
import NumberCruncher from './NumberCruncher'
import DecisionSimulator from './DecisionSimulator'
import LayeredText from './LayeredText'
import CompareTable from './CompareTable'
import InlineExercise from './InlineExercise'
import AuthorCard from './AuthorCard'
import Timeline from './Timeline'
import MethodCard from './MethodCard'
import GuidedLesson from './GuidedLesson'
import LivingText from './LivingText'
import type { ContentBlock } from '@/types/intelligence'

interface Props {
  block: ContentBlock
  moduleId?: string
  submoduleTitle?: string
}

export default function ContentBlockRenderer({ block, moduleId, submoduleTitle }: Props) {
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

    case 'layered-text':
      return <LayeredText
        title={block.title}
        essence={block.essence}
        development={block.development}
        depth={block.depth}
        mastery={block.mastery}
        refs={block.refs}
      />

    case 'compare':
      return <CompareTable
        title={block.title}
        question={block.question}
        dimensions={block.dimensions}
        items={block.items}
        insight={block.insight}
      />

    case 'inline-exercise':
      return <InlineExercise
        prompt={block.prompt}
        context={block.context}
        fields={block.fields}
        evaluationCriteria={block.evaluationCriteria}
        expectedConcepts={block.expectedConcepts}
        submoduleTitle={submoduleTitle}
      />

    case 'author-card':
      return <AuthorCard
        name={block.name}
        role={block.role}
        affiliation={block.affiliation}
        years={block.years}
        keyStudy={block.keyStudy}
        keyYear={block.keyYear}
        contribution={block.contribution}
        book={block.book}
        quote={block.quote}
      />

    case 'timeline':
      return <Timeline title={block.title} events={block.events} />

    case 'method-card':
      return <MethodCard
        name={block.name}
        origin={block.origin}
        whenToUse={block.whenToUse}
        whenNotToUse={block.whenNotToUse}
        cost={block.cost}
        time={block.time}
        steps={block.steps}
        example={block.example}
      />

    case 'guided-lesson':
      return <GuidedLesson
        title={block.title}
        estimatedMinutes={block.estimatedMinutes}
        steps={block.steps}
      />

    case 'living-text':
      return <LivingText
        blockId={block.id}
        title={block.title}
        body={block.body}
        refs={block.refs}
        concepts={block.concepts}
        pauses={block.pauses}
        calcs={block.calcs}
        anims={block.anims}
        quotes={block.quotes}
        estimatedReading={block.estimatedReading}
      />

    default:
      return null
  }
}
