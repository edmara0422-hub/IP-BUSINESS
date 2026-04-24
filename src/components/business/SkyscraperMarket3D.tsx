'use client'

import { useRef, useState, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Grid } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'

export interface StockItem {
  ticker: string
  label: string
  price?: number
  pct: number
}

function stockColor(pct: number): string {
  if (pct >  2.0) return '#00fff7'
  if (pct >  0.2) return '#14b8a6'
  if (pct >= -0.2) return '#8b5cf6'
  if (pct > -2.0) return '#f87171'
  return '#ec4899'
}

/* ── Single stock building ── */
function StockBuilding({
  stock,
  position,
  height,
  isSelected,
  onSelect,
}: {
  stock: StockItem
  position: [number, number, number]
  height: number
  isSelected: boolean
  onSelect: () => void
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)
  const colorStr = stockColor(stock.pct)
  const emBase   = isSelected ? 0.92 : hovered ? 0.62 : 0.28

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const tgt = isSelected ? 1.14 : hovered ? 1.06 : 1
    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, tgt, delta * 10)
    groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, tgt, delta * 10)
  })

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={e => { e.stopPropagation(); onSelect() }}
      onPointerOver={e => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
    >
      {/* Foundation */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[1.4, 0.24, 1.4]} />
        <meshStandardMaterial color={colorStr} emissive={colorStr} emissiveIntensity={emBase * 1.1} metalness={0.88} roughness={0.12} />
      </mesh>

      {/* Main tower */}
      <mesh position={[0, height / 2 + 0.24, 0]}>
        <boxGeometry args={[1.05, height, 1.05]} />
        <meshStandardMaterial color={colorStr} emissive={colorStr} emissiveIntensity={emBase * 0.5} metalness={0.75} roughness={0.28} transparent opacity={0.9} />
      </mesh>

      {/* Setback upper section */}
      {height > 4 && (
        <mesh position={[0, height * 0.62 + 0.24, 0]}>
          <boxGeometry args={[0.68, height * 0.36, 0.68]} />
          <meshStandardMaterial color={colorStr} emissive={colorStr} emissiveIntensity={emBase * 0.78} metalness={0.8} roughness={0.2} transparent opacity={0.88} />
        </mesh>
      )}

      {/* Spire */}
      <mesh position={[0, height + 0.24 + 0.44, 0]}>
        <coneGeometry args={[0.14, 0.88, 4]} />
        <meshStandardMaterial color={colorStr} emissive={colorStr} emissiveIntensity={emBase * 1.8} metalness={0.92} roughness={0.06} />
      </mesh>

      {/* Floor ring */}
      <mesh position={[0, 0.016, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.58, 0.98, 32]} />
        <meshBasicMaterial color={colorStr} transparent opacity={isSelected ? 0.55 : hovered ? 0.34 : 0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Label */}
      <Html
        position={[0, -0.55, 0]}
        center
        distanceFactor={12}
        style={{ pointerEvents: 'none', width: 80, userSelect: 'none' }}
      >
        <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: colorStr, textShadow: `0 0 10px ${colorStr}90`, lineHeight: 1.3 }}>
          {stock.ticker}
        </div>
        {stock.price !== undefined && (
          <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 10, fontWeight: 800, color: '#ffffff', textShadow: `0 0 14px ${colorStr}` }}>
            R${stock.price.toFixed(2)}
          </div>
        )}
        <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: colorStr, textShadow: `0 0 8px ${colorStr}` }}>
          {stock.pct >= 0 ? '+' : ''}{stock.pct.toFixed(2)}%
        </div>
      </Html>
    </group>
  )
}

/* ── Scene interior ── */
function Scene({
  stocks,
  heights,
  selected,
  onSelect,
}: {
  stocks: StockItem[]
  heights: number[]
  selected: string | null
  onSelect: (ticker: string | null) => void
}) {
  const spacing = 2.5
  const totalW  = (stocks.length - 1) * spacing
  const startX  = -totalW / 2

  return (
    <>
      <fog attach="fog" args={['#050419', 10, 24]} />
      <color attach="background" args={['#050419']} />

      <ambientLight intensity={0.3} color="#9080d0" />
      <pointLight position={[0, 18, 0]}   intensity={2.4} color="#ffffff" />
      <pointLight position={[-6, 8, -6]} intensity={1.2} color="#00fff7" />
      <pointLight position={[6,  8,  6]} intensity={0.8} color="#7c3aed" />

      <Grid
        args={[20, 10]}
        cellSize={1}
        cellThickness={0.4}
        cellColor="#150828"
        sectionSize={2.5}
        sectionThickness={0.8}
        sectionColor="#3d1080"
        fadeDistance={18}
        fadeStrength={1.6}
        followCamera={false}
        position={[0, 0, 0]}
      />

      {stocks.map((stock, i) => (
        <StockBuilding
          key={stock.ticker}
          stock={stock}
          position={[startX + i * spacing, 0, 0]}
          height={heights[i]}
          isSelected={selected === stock.ticker}
          onSelect={() => onSelect(selected === stock.ticker ? null : stock.ticker)}
        />
      ))}

      <OrbitControls
        enableZoom
        minDistance={4}
        maxDistance={22}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.25}
        minPolarAngle={Math.PI / 10}
        maxPolarAngle={Math.PI / 2.2}
      />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.18}
          luminanceSmoothing={0.82}
          intensity={1.3}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

/* ── Info overlay ── */
function StockPanel({ stock, onClose }: { stock: StockItem; onClose: () => void }) {
  const color = stockColor(stock.pct)
  const dir   = stock.pct > 0.2 ? 'ALTA' : stock.pct < -0.2 ? 'BAIXA' : 'NEUTRO'

  return (
    <motion.div
      key={stock.ticker}
      initial={{ opacity: 0, y: -14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0,   scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute', left: '50%', top: 14,
        transform: 'translateX(-50%)',
        width: 260,
        background: 'rgba(5,4,25,0.97)',
        border: `1px solid ${color}35`,
        borderRadius: 16, padding: '14px 18px',
        backdropFilter: 'blur(40px)',
        boxShadow: `0 0 40px ${color}18, 0 20px 44px rgba(0,0,0,0.8)`,
        zIndex: 10,
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1.5, background: `linear-gradient(90deg, transparent, ${color}80, transparent)`, borderRadius: 2 }} />

      <button onClick={onClose}
        style={{ position: 'absolute', right: 11, top: 11, width: 22, height: 22, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, cursor: 'pointer', color: 'rgba(255,255,255,0.35)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        ×
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: 7, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.22em', color, background: color + '18', border: `1px solid ${color}30`, borderRadius: 99, padding: '2px 8px', fontWeight: 700, display: 'inline-block', marginBottom: 5 }}>{dir}</span>
          <p style={{ fontSize: 9, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(180,160,255,0.4)', marginBottom: 2 }}>{stock.ticker}</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'rgba(228,228,228,0.9)' }}>{stock.label}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          {stock.price !== undefined && (
            <p style={{ fontSize: 24, fontWeight: 800, fontFamily: 'monospace', color: 'rgba(235,235,235,0.95)', lineHeight: 1, textShadow: `0 0 16px ${color}60` }}>
              R${stock.price.toFixed(2)}
            </p>
          )}
          <p style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color, textShadow: `0 0 10px ${color}` }}>
            {stock.pct >= 0 ? '+' : ''}{stock.pct.toFixed(2)}%
          </p>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Root export ── */
export default function SkyscraperMarket3D({ stocks }: { stocks: StockItem[] }) {
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null)
  const selectedStock = stocks.find(s => s.ticker === selectedTicker) ?? null

  const heights = useMemo(() => {
    const prices = stocks.map(s => s.price).filter((p): p is number => p !== undefined)
    if (prices.length === 0) return stocks.map(() => 3)
    const minP = Math.min(...prices)
    const maxP = Math.max(...prices)
    const range = maxP - minP || 1
    return stocks.map(s =>
      s.price !== undefined
        ? 1.5 + ((s.price - minP) / range) * 7.5
        : 3
    )
  }, [stocks])

  return (
    <div style={{
      position: 'relative', width: '100%', height: 400,
      borderRadius: 18, overflow: 'hidden',
      border: '1px solid rgba(100,80,200,0.14)',
      boxShadow: '0 0 50px rgba(100,60,220,0.07)',
    }}>
      <Canvas
        camera={{ position: [0, 8, 12], fov: 52 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
        onClick={() => setSelectedTicker(null)}
      >
        <Suspense fallback={null}>
          <Scene
            stocks={stocks}
            heights={heights}
            selected={selectedTicker}
            onSelect={setSelectedTicker}
          />
        </Suspense>
      </Canvas>

      <AnimatePresence>
        {selectedStock && (
          <StockPanel
            key={selectedStock.ticker}
            stock={selectedStock}
            onClose={() => setSelectedTicker(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
