'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface BusinessChartProps {
  option: echarts.EChartsOption
  className?: string
  highlightSequence?: Array<{
    seriesIndex: number
    dataIndex: number
  }>
  cycleMs?: number
}

export default function BusinessChart({
  option,
  className = '',
  highlightSequence,
  cycleMs = 2200,
}: BusinessChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const instance = echarts.getInstanceByDom(element) ?? echarts.init(element, undefined, {
      renderer: 'canvas',
    })

    instance.setOption(option, true)

    let cycleIndex = 0
    let previousPoint: { seriesIndex: number; dataIndex: number } | null = null
    let highlightTimer: number | null = null

    if (highlightSequence?.length) {
      const runHighlight = () => {
        if (previousPoint) {
          instance.dispatchAction({
            type: 'downplay',
            seriesIndex: previousPoint.seriesIndex,
            dataIndex: previousPoint.dataIndex,
          })
        }

        const point = highlightSequence[cycleIndex]

        instance.dispatchAction({
          type: 'highlight',
          seriesIndex: point.seriesIndex,
          dataIndex: point.dataIndex,
        })

        instance.dispatchAction({
          type: 'showTip',
          seriesIndex: point.seriesIndex,
          dataIndex: point.dataIndex,
        })

        previousPoint = point
        cycleIndex = (cycleIndex + 1) % highlightSequence.length
      }

      runHighlight()
      highlightTimer = window.setInterval(runHighlight, cycleMs)
    }

    const observer = new ResizeObserver(() => {
      instance.resize()
    })

    observer.observe(element)

    return () => {
      if (highlightTimer !== null) {
        window.clearInterval(highlightTimer)
      }

      observer.disconnect()
      instance.dispose()
    }
  }, [option, highlightSequence, cycleMs])

  return <div ref={containerRef} className={className} />
}
