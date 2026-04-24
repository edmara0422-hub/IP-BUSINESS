'use client'

import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Grid } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'

interface Sector { id: string; label: string; heat: number; change: number }

const ANALYSIS: Record<string, { oportunidade: string; risco: string; como: string; quem: string }> = {
  retail:    { oportunidade: 'SELIC em queda estimula consumo. Fintechs de BNPL crescem. Omnichannel em expansão.', risco: 'Inflação corrói poder de compra. Inadimplência PJ 5.8%. Margens 3-8%.', como: 'Parcelamento sem juros + cashback. Integrar físico/digital. Estoque enxuto.', quem: 'Varejo popular, e-commerce, marketplace, franquias' },
  fintech:   { oportunidade: 'Open Finance abre novas receitas. Crédito digital cresce 30% a.a. Embedded finance.', risco: 'BACEN mais rigoroso. NIM comprimido com SELIC alta. Fraude elevada.', como: 'Renda fixa com cashback. BaaS para nichos. Crédito consignado digital.', quem: 'Fintechs de crédito, pagamentos, banking-as-a-service' },
  tech:      { oportunidade: 'IA generativa reduz custo 30-60%. SaaS vertical cresce 22% a.a. no Brasil.', risco: 'Câmbio encarece custos em USD. Churn SaaS BR 5-8%/mês. CAC elevado.', como: 'Precificação em USD. PLG para reduzir CAC. Verticais com alto switching cost.', quem: 'SaaS vertical, AI-native, devtools, marketplaces B2B' },
  agro:      { oportunidade: 'Commodities em alta histórica. Câmbio favorece exportação. Agrotech +45% a.a.', risco: 'Risco climático (La Niña/El Niño). Custo de insumos em dólar.', como: 'Hedge cambial. Futuro de commodities. Tecnologia de precisão.', quem: 'Produtores de soja, milho, pecuária, café; agtechs' },
  energy:    { oportunidade: 'Mercado livre cresce 18% a.a. Solar distribuído em boom. ESG como diferencial.', risco: 'Regulação ANEEL/CMSE. Risco hidrológico em ano seco. Capital intensivo.', como: 'Solar com financiamento no cliente. PCLD com grandes consumidores.', quem: 'Geradoras, distribuidoras, integradores solar, energytechs' },
  health:    { oportunidade: 'Envelhecimento da população. Telemedicina cresce 28% a.a. Healthtech SaaS recorrente.', risco: 'ANS com regulação crescente. Inadimplência nos planos >15%.', como: 'B2B via planos corporativos. Preventivo e wellness. IA para diagnóstico.', quem: 'Healthtechs, clínicas, operadoras de plano, farmácias' },
  logistics: { oportunidade: 'E-commerce gera demanda last-mile. Fulfillment centers ganham escala.', risco: 'Câmbio encarece frota importada. Diesel e pedágio pressionam margem.', como: 'Roteirização com IA. Micro-fulfillment urban. Frota elétrica delivery.', quem: 'Transportadoras, 3PLs, marketplaces de entrega' },
  services:  { oportunidade: 'Terceirização de TI e BPO acelera. Consultoria ESG em alta demanda.', risco: 'SELIC alta limita expansão PME. Comoditização. Alta rotatividade de talentos.', como: 'Contratos recorrentes com SLA. Precificação por resultado.', quem: 'Consultorias, bureaus, prestadores B2B, agências' },
  media:     { oportunidade: 'Criadores independentes escalam com plataformas. Adtech BR cresce.', risco: 'CPM volátil com macro. Atenção fragmentada. LGPD limita targeting.', como: 'Owned media (newsletter, podcast). Comunidade paga. Branded content B2B.', quem: 'Agências, creators, adtechs, OTTs, publishers' },
}

function neonColor(heat: number): string {
  if (heat >= 75) return '#00fff7'
  if (heat >= 60) return '#14b8a6'
  if (heat >= 50) return '#7c3aed'
  if (heat >= 35) return '#f59e0b'
  return '#ef4444'
}

function signalLabel(heat: number) {
  if (heat >= 75) return 'OPORTUNIDADE'
  if (heat >= 50) return 'NEUTRO'
  if (heat >= 30) return 'CAUTELA'
  return 'ALTO RISCO'
}

/* ── Architectural skyscraper ── */
function Building({
  sector,
  position,
  isSelected,
  onSelect,
}: {
  sector: Sector
  position: [number, number, number]
  isSelected: boolean
  onSelect: () => void
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)

  const height    = Math.max(sector.heat / 10, 0.5)
  const colorStr  = neonColor(sector.heat)
  const emBase    = isSelected ? 0.95 : hovered ? 0.65 : 0.32

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const tgt = isSelected ? 1.12 : hovered ? 1.05 : 1
    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, tgt, delta * 9)
    groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, tgt, delta * 9)
  })

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={e => { e.stopPropagation(); onSelect() }}
      onPointerOver={e => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
    >
      {/* Foundation platform */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[1.52, 0.24, 1.52]} />
        <meshStandardMaterial color={colorStr} emissive={colorStr} emissiveIntensity={emBase * 1.0} metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Main tower */}
      <mesh position={[0, height / 2 + 0.24, 0]}>
        <boxGeometry args={[1.12, height, 1.12]} />
        <meshStandardMaterial color={colorStr} emissive={colorStr} emissiveIntensity={emBase * 0.52} metalness={0.75} roughness={0.28} transparent opacity={0.9} />
      </mesh>

      {/* Upper setback (only on taller buildings) */}
      {height > 3.5 && (
        <mesh position={[0, height * 0.6 + 0.24, 0]}>
          <boxGeometry args={[0.72, height * 0.38, 0.72]} />
          <meshStandardMaterial color={colorStr} emissive={colorStr} emissiveIntensity={emBase * 0.75} metalness={0.8} roughness={0.2} transparent opacity={0.88} />
        </mesh>
      )}

      {/* Crown spire */}
      <mesh position={[0, height + 0.24 + 0.48, 0]}>
        <coneGeometry args={[0.16, 0.96, 4]} />
        <meshStandardMaterial color={colorStr} emissive={colorStr} emissiveIntensity={emBase * 1.7} metalness={0.9} roughness={0.08} />
      </mesh>

      {/* Floor glow ring */}
      <mesh position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.64, 1.08, 32]} />
        <meshBasicMaterial color={colorStr} transparent opacity={isSelected ? 0.52 : hovered ? 0.32 : 0.14} side={THREE.DoubleSide} />
      </mesh>

      {/* HTML overlay label */}
      <Html
        position={[0, -0.6, 0]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none', width: 92, userSelect: 'none' }}
      >
        <div style={{
          textAlign: 'center',
          fontFamily: 'monospace',
          fontSize: 7,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: colorStr,
          textShadow: `0 0 10px ${colorStr}90`,
          lineHeight: 1.4,
        }}>
          {sector.label}
        </div>
        <div style={{
          textAlign: 'center',
          fontFamily: 'monospace',
          fontSize: 14,
          fontWeight: 800,
          color: '#ffffff',
          textShadow: `0 0 18px ${colorStr}`,
          lineHeight: 1,
          marginTop: 2,
        }}>
          {sector.heat}
        </div>
      </Html>
    </group>
  )
}

/* ── 3D scene (inside Canvas) ── */
function Scene({
  sectors,
  selected,
  onSelect,
}: {
  sectors: Sector[]
  selected: string | null
  onSelect: (id: string | null) => void
}) {
  return (
    <>
      <fog attach="fog" args={['#050419', 13, 30]} />
      <color attach="background" args={['#050419']} />

      <ambientLight intensity={0.28} color="#9080d0" />
      <pointLight position={[0, 22, 0]}   intensity={2.8} color="#ffffff" />
      <pointLight position={[-8, 10, -8]} intensity={1.4} color="#00fff7" />
      <pointLight position={[8,  10,  8]} intensity={0.9} color="#7c3aed" />
      <pointLight position={[-6, 8,   8]} intensity={0.6} color="#f59e0b" />

      <Grid
        args={[24, 24]}
        cellSize={1}
        cellThickness={0.4}
        cellColor="#150828"
        sectionSize={2.7}
        sectionThickness={0.9}
        sectionColor="#3d1080"
        fadeDistance={22}
        fadeStrength={1.8}
        followCamera={false}
        position={[0, 0, 0]}
      />

      {sectors.map((sector, i) => {
        const col = i % 3
        const row = Math.floor(i / 3)
        const x   = (col - 1) * 2.72
        const z   = (row - 1) * 2.72
        return (
          <Building
            key={sector.id}
            sector={sector}
            position={[x, 0, z]}
            isSelected={selected === sector.id}
            onSelect={() => onSelect(selected === sector.id ? null : sector.id)}
          />
        )
      })}

      <OrbitControls
        enableZoom
        minDistance={5}
        maxDistance={28}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.35}
        minPolarAngle={Math.PI / 10}
        maxPolarAngle={Math.PI / 2.1}
      />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.18}
          luminanceSmoothing={0.82}
          intensity={1.4}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

/* ── Info overlay ── */
function InfoPanel({ sector, onClose }: { sector: Sector; onClose: () => void }) {
  const a     = ANALYSIS[sector.id]
  const color = neonColor(sector.heat)
  const label = signalLabel(sector.heat)

  return (
    <motion.div
      key={sector.id}
      initial={{ opacity: 0, x: 20, scale: 0.96 }}
      animate={{ opacity: 1, x: 0,  scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.96 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute', right: 14, top: 14, width: 275,
        background: 'rgba(5,4,25,0.97)',
        border: `1px solid ${color}35`,
        borderRadius: 18, padding: '15px 17px',
        backdropFilter: 'blur(40px)',
        boxShadow: `0 0 50px ${color}18, 0 26px 56px rgba(0,0,0,0.85)`,
        zIndex: 10,
      }}
    >
      {/* Top accent */}
      <div style={{ position: 'absolute', top: 0, left: '6%', right: '6%', height: 1.5, background: `linear-gradient(90deg, transparent, ${color}80, transparent)`, borderRadius: 2 }} />

      {/* Corner decoration */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: 48, height: 48, background: `linear-gradient(225deg, ${color}10, transparent)`, borderRadius: '0 18px 0 48px' }} />

      <button onClick={onClose}
        style={{ position: 'absolute', right: 12, top: 12, width: 24, height: 24, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 6, cursor: 'pointer', color: 'rgba(255,255,255,0.35)', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        ×
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <span style={{ fontSize: 7, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.24em', color, background: color + '18', border: `1px solid ${color}30`, borderRadius: 99, padding: '2px 8px', fontWeight: 700, display: 'inline-block', marginBottom: 6, boxShadow: `0 0 10px ${color}20` }}>{label}</span>
          <p style={{ fontSize: 14.5, fontWeight: 700, color: 'rgba(228,228,228,0.9)', lineHeight: 1.2 }}>{sector.label}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 34, fontWeight: 800, fontFamily: 'monospace', color, lineHeight: 1, textShadow: `0 0 20px ${color}80` }}>{sector.heat}</p>
          <p style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(200,200,200,0.28)' }}>/100</p>
        </div>
      </div>

      {/* Heat bar */}
      <div style={{ height: 3, background: 'rgba(100,80,200,0.1)', borderRadius: 2, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ height: '100%', width: `${sector.heat}%`, background: `linear-gradient(90deg, ${color}40, ${color})`, borderRadius: 2, boxShadow: `0 0 6px ${color}60` }} />
      </div>

      {a && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {([
            { label: 'Oportunidade', text: a.oportunidade, color: '#00fff7' },
            { label: 'Risco',        text: a.risco,        color: '#ef4444' },
            { label: 'Como Atuar',   text: a.como,         color: '#8b5cf6' },
          ] as { label: string; text: string; color: string }[]).map(({ label: lbl, text, color: c }) => (
            <div key={lbl} style={{ padding: '9px 12px', background: c + '08', border: `1px solid ${c}18`, borderRadius: 11, borderLeft: `3px solid ${c}60` }}>
              <p style={{ fontSize: 7, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.18em', color: c + 'cc', fontWeight: 700, marginBottom: 4 }}>{lbl}</p>
              <p style={{ fontSize: 10.5, color: 'rgba(210,210,210,0.52)', lineHeight: 1.62 }}>{text}</p>
            </div>
          ))}
          <div style={{ padding: '7px 12px', borderTop: '1px solid rgba(100,80,200,0.1)', marginTop: 2 }}>
            <span style={{ fontSize: 7, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(180,160,255,0.3)' }}>Quem se beneficia: </span>
            <span style={{ fontSize: 9.5, color: 'rgba(200,200,200,0.38)' }}>{a.quem}</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

/* ── Legend ── */
function Legend() {
  return (
    <div style={{
      position: 'absolute', left: 14, bottom: 14,
      display: 'flex', flexDirection: 'column', gap: 5,
      background: 'rgba(5,4,25,0.88)',
      border: '1px solid rgba(100,80,200,0.14)',
      borderRadius: 12, padding: '9px 13px',
      backdropFilter: 'blur(24px)',
    }}>
      {([
        { color: '#00fff7', label: 'Oportunidade  ≥75' },
        { color: '#14b8a6', label: 'Avançando  60-74' },
        { color: '#7c3aed', label: 'Neutro  50-59' },
        { color: '#f59e0b', label: 'Cautela  30-49' },
        { color: '#ef4444', label: 'Alto Risco  <30' },
      ] as { color: string; label: string }[]).map(({ color, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: `0 0 7px ${color}`, flexShrink: 0 }} />
          <span style={{ fontSize: 8.5, fontFamily: 'monospace', color: 'rgba(200,200,200,0.36)', letterSpacing: '0.06em' }}>{label}</span>
        </div>
      ))}
      <p style={{ fontSize: 7.5, fontFamily: 'monospace', color: 'rgba(180,160,255,0.28)', marginTop: 4, letterSpacing: '0.1em' }}>ARRASTE · ZOOM · CLIQUE</p>
    </div>
  )
}

/* ── Root export ── */
export default function SectorScene3D({ sectors }: { sectors: Sector[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = sectors.find(s => s.id === selectedId) ?? null

  return (
    <div style={{
      position: 'relative', width: '100%', height: 540,
      borderRadius: 20, overflow: 'hidden',
      border: '1px solid rgba(100,80,200,0.14)',
      boxShadow: '0 0 60px rgba(100,60,220,0.08)',
    }}>
      <Canvas
        camera={{ position: [0, 13, 15], fov: 50 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
        onClick={() => setSelectedId(null)}
      >
        <Suspense fallback={null}>
          <Scene sectors={sectors} selected={selectedId} onSelect={setSelectedId} />
        </Suspense>
      </Canvas>

      <Legend />

      <AnimatePresence>
        {selected && <InfoPanel key={selected.id} sector={selected} onClose={() => setSelectedId(null)} />}
      </AnimatePresence>
    </div>
  )
}
