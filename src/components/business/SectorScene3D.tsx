'use client'

import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Grid } from '@react-three/drei'
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

function heatColor(heat: number) {
  if (heat >= 75) return '#34d399'
  if (heat >= 60) return '#86efac'
  if (heat >= 50) return '#c0c0c0'
  if (heat >= 35) return '#fbbf24'
  return '#f87171'
}

function signalLabel(heat: number) {
  if (heat >= 75) return 'OPORTUNIDADE'
  if (heat >= 50) return 'NEUTRO'
  if (heat >= 30) return 'CAUTELA'
  return 'ALTO RISCO'
}

/* ── Single 3D bar ──────────────────────────────────────────────── */
function SectorBar({
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
  const meshRef  = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const height   = Math.max(sector.heat / 10, 0.5)
  const colorStr = heatColor(sector.heat)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const targetXZ = isSelected ? 1.12 : hovered ? 1.06 : 1
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetXZ, delta * 8)
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetXZ, delta * 8)
  })

  return (
    <group position={position}>
      {/* Prism */}
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
        onClick={(e) => { e.stopPropagation(); onSelect() }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      >
        <boxGeometry args={[1.15, height, 1.15]} />
        <meshStandardMaterial
          color={colorStr}
          emissive={colorStr}
          emissiveIntensity={isSelected ? 0.85 : hovered ? 0.52 : 0.22}
          roughness={0.22}
          metalness={0.62}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Glow base ring */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.62, 0.88, 32]} />
        <meshBasicMaterial
          color={colorStr}
          transparent
          opacity={isSelected ? 0.45 : hovered ? 0.28 : 0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Heat score above bar */}
      <Text
        position={[0, height + 0.28, 0]}
        fontSize={0.3}
        color={colorStr}
        anchorX="center"
        anchorY="bottom"
      >
        {`${sector.heat}`}
      </Text>

      {/* Label below */}
      <Text
        position={[0, -0.32, 0]}
        fontSize={0.19}
        color="rgba(200,200,200,0.45)"
        anchorX="center"
        anchorY="top"
        maxWidth={1.8}
      >
        {sector.label.toUpperCase()}
      </Text>
    </group>
  )
}

/* ── Scene interior (needs to be inside Canvas) ─────────────────── */
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
      <ambientLight intensity={0.55} color="#c8d0e0" />
      <pointLight position={[0, 18, 0]}  intensity={2.2} color="#ffffff" />
      <pointLight position={[-6, 8, -6]} intensity={0.9} color="#60a5fa" />
      <pointLight position={[6, 8, 6]}   intensity={0.7} color="#34d399" />

      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1a1a1a"
        sectionSize={2.5}
        sectionThickness={1}
        sectionColor="#333"
        fadeDistance={18}
        fadeStrength={1.2}
        followCamera={false}
        position={[0, 0, 0]}
      />

      {sectors.map((sector, i) => {
        const col = i % 3
        const row = Math.floor(i / 3)
        const x   = (col - 1) * 2.6
        const z   = (row - 1) * 2.6
        return (
          <SectorBar
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
        minDistance={6}
        maxDistance={26}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.2}
      />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.28}
          luminanceSmoothing={0.88}
          intensity={0.75}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

/* ── Info overlay panel ─────────────────────────────────────────── */
function InfoPanel({ sector }: { sector: Sector }) {
  const a     = ANALYSIS[sector.id]
  const color = heatColor(sector.heat)
  const label = signalLabel(sector.heat)

  return (
    <motion.div
      key={sector.id}
      initial={{ opacity: 0, x: 18, scale: 0.96 }}
      animate={{ opacity: 1, x: 0,  scale: 1 }}
      exit={{ opacity: 0, x: 18, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute', right: 14, top: 14, width: 270,
        background: 'rgba(4,4,4,0.96)',
        border: `1px solid ${color}28`,
        borderRadius: 18, padding: '14px 16px',
        backdropFilter: 'blur(36px)',
        boxShadow: `0 0 40px ${color}10, 0 24px 52px rgba(0,0,0,0.8)`,
        zIndex: 10,
      }}
    >
      {/* accent bar */}
      <div style={{ position: 'absolute', top: 0, left: '8%', right: '8%', height: 1.5, background: `linear-gradient(90deg, transparent, ${color}60, transparent)`, borderRadius: 2 }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <span style={{ fontSize: 7, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.24em', color: color, background: color + '18', border: `1px solid ${color}28`, borderRadius: 99, padding: '2px 8px', fontWeight: 700, display: 'inline-block', marginBottom: 6 }}>{label}</span>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'rgba(228,228,228,0.88)', lineHeight: 1.2 }}>{sector.label}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 30, fontWeight: 800, fontFamily: 'monospace', color, lineHeight: 1 }}>{sector.heat}</p>
          <p style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(200,200,200,0.30)' }}>/100</p>
        </div>
      </div>

      <div style={{ height: 3, background: 'rgba(200,200,200,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 12 }}>
        <div style={{ height: '100%', width: `${sector.heat}%`, background: `linear-gradient(90deg, ${color}40, ${color}cc)`, borderRadius: 2 }} />
      </div>

      {a && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {([
            { label: 'Oportunidade', text: a.oportunidade, color: '#34d399' },
            { label: 'Risco',        text: a.risco,        color: '#f87171' },
            { label: 'Como Atuar',   text: a.como,         color: '#c0c0c0' },
          ] as { label: string; text: string; color: string }[]).map(({ label: lbl, text, color: c }) => (
            <div key={lbl} style={{ padding: '9px 11px', background: c + '08', border: `1px solid ${c}14`, borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: c, flexShrink: 0 }} />
                <p style={{ fontSize: 7, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.18em', color: c + 'aa', fontWeight: 700 }}>{lbl}</p>
              </div>
              <p style={{ fontSize: 10.5, color: 'rgba(208,208,208,0.50)', lineHeight: 1.6 }}>{text}</p>
            </div>
          ))}
          <div style={{ padding: '7px 11px', borderTop: '1px solid rgba(200,200,200,0.05)' }}>
            <span style={{ fontSize: 7, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(200,200,200,0.22)' }}>Quem se beneficia: </span>
            <span style={{ fontSize: 9.5, color: 'rgba(200,200,200,0.36)' }}>{a.quem}</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

/* ── Legend overlay ─────────────────────────────────────────────── */
function Legend() {
  const items = [
    { color: '#34d399', label: 'Oportunidade  ≥75' },
    { color: '#c0c0c0', label: 'Neutro  50-74' },
    { color: '#fbbf24', label: 'Cautela  30-49' },
    { color: '#f87171', label: 'Alto Risco  <30' },
  ]
  return (
    <div style={{ position: 'absolute', left: 14, bottom: 14, display: 'flex', flexDirection: 'column', gap: 4, background: 'rgba(4,4,4,0.82)', border: '1px solid rgba(200,200,200,0.07)', borderRadius: 12, padding: '8px 12px', backdropFilter: 'blur(24px)' }}>
      {items.map(({ color, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}80`, flexShrink: 0 }} />
          <span style={{ fontSize: 8.5, fontFamily: 'monospace', color: 'rgba(200,200,200,0.38)', letterSpacing: '0.08em' }}>{label}</span>
        </div>
      ))}
      <p style={{ fontSize: 7.5, fontFamily: 'monospace', color: 'rgba(200,200,200,0.18)', marginTop: 3, letterSpacing: '0.1em' }}>CLIQUE · ARRASTE · SCROLL</p>
    </div>
  )
}

/* ── Root export ────────────────────────────────────────────────── */
export default function SectorScene3D({ sectors }: { sectors: Sector[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = sectors.find(s => s.id === selectedId) ?? null

  return (
    <div style={{ position: 'relative', width: '100%', height: 520, borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(200,200,200,0.07)' }}>
      <Canvas
        camera={{ position: [0, 12, 14], fov: 52 }}
        gl={{ antialias: true }}
        style={{ background: '#030303' }}
        onClick={() => setSelectedId(null)}
      >
        <Suspense fallback={null}>
          <Scene sectors={sectors} selected={selectedId} onSelect={setSelectedId} />
        </Suspense>
      </Canvas>

      <Legend />

      <AnimatePresence>
        {selected && <InfoPanel key={selected.id} sector={selected} />}
      </AnimatePresence>
    </div>
  )
}
