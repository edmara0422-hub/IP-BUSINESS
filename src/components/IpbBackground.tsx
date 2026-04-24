'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/* Canvas de partículas prata — sem DOM, alta performance */
function CanvasParticulas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; va: number }
    const N = 70
    const pts: P[] = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25 - 0.05,
      r: Math.random() * 1.2 + 0.3,
      a: Math.random(),
      va: (Math.random() - 0.5) * 0.004,
    }))

    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 110) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(192,192,192,${(1 - dist / 110) * 0.07})`
            ctx.lineWidth = 0.5
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.stroke()
          }
        }
      }

      for (const p of pts) {
        p.x += p.vx; p.y += p.vy; p.a += p.va
        if (p.a < 0) p.a = 0.7
        if (p.a > 1) p.a = 0.1
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2)
        g.addColorStop(0, `rgba(210,210,210,${p.a * 0.85})`)
        g.addColorStop(1, 'rgba(192,192,192,0)')
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-60" />
}

/* Grade com faíscas animadas */
function GradeSilver() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(192,192,192,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(192,192,192,0.022) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(192,192,192,0.07) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />
      {[8, 22, 38, 54, 68, 84].map((pos, i) => (
        <motion.div key={i} className="absolute top-0 bottom-0"
          style={{ left: `${pos}%`, width: 1 }}
          animate={{ opacity: [0, 0.13, 0] }}
          transition={{ duration: 4 + i * 0.8, repeat: Infinity, delay: i * 1.1, ease: 'easeInOut' }}>
          <div className="w-full h-full" style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(192,192,192,0.7) 50%, transparent 100%)'
          }} />
        </motion.div>
      ))}
      {[18, 44, 72].map((pos, i) => (
        <motion.div key={i} className="absolute left-0 right-0"
          style={{ top: `${pos}%`, height: 1 }}
          animate={{ opacity: [0, 0.09, 0] }}
          transition={{ duration: 6 + i * 1.2, repeat: Infinity, delay: i * 1.5, ease: 'easeInOut' }}>
          <div className="w-full h-full" style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(192,192,192,0.55) 50%, transparent 100%)'
          }} />
        </motion.div>
      ))}
    </div>
  )
}

/* Halo central suave — adiciona profundidade */
function HaloCentral() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70vw', height: '70vw', maxWidth: 700, maxHeight: 700,
        background: 'radial-gradient(circle, rgba(192,192,192,0.03) 0%, transparent 60%)',
        borderRadius: '50%',
      }} />
    </div>
  )
}

export default function IpbBackground() {
  return (
    <>
      <CanvasParticulas />
      <GradeSilver />
      <HaloCentral />
    </>
  )
}
