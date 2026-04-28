'use client'

import { Suspense, useRef, useMemo, memo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

export interface GlobeSignal {
  signal?: { color: string } | null
  delta?: number
}

// ── Cidades financeiras globais ───────────────────────────────────────────────
const CITIES = [
  { name: 'São Paulo', lat: -23.55, lng:  -46.63 },
  { name: 'New York',  lat:  40.71, lng:  -74.01 },
  { name: 'London',    lat:  51.51, lng:   -0.13 },
  { name: 'Tokyo',     lat:  35.68, lng:  139.69 },
  { name: 'Shanghai',  lat:  31.23, lng:  121.47 },
  { name: 'Frankfurt', lat:  50.11, lng:    8.68 },
  { name: 'Mumbai',    lat:  19.08, lng:   72.88 },
  { name: 'Sydney',    lat: -33.87, lng:  151.21 },
]

const R      = 1
const SILVER = '#9aa5b4'

function latLngToVec3(lat: number, lng: number, r: number) {
  const phi   = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  )
}

// ── Geometrias estáticas — criadas uma vez no módulo ──────────────────────────
const CITY_POSITIONS = CITIES.map(c => latLngToVec3(c.lat, c.lng, R))
const SPHERE_GEO     = new THREE.SphereGeometry(R, 32, 32)
const ATMO_GEO       = new THREE.SphereGeometry(R * 1.14, 32, 32)
const CITY_GEO       = new THREE.SphereGeometry(0.026, 8, 8)
const PARTICLE_GEO   = new THREE.SphereGeometry(0.014, 6, 6)
const RING_GEO       = new THREE.RingGeometry(R - 0.002, R + 0.002, 64)

// Curvas dos arcos SP → mundo
const ARC_CURVES = CITY_POSITIONS.slice(1).map(to => {
  const from = CITY_POSITIONS[0]
  const mid  = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5)
  mid.normalize().multiplyScalar(R * 1.42)
  return new THREE.QuadraticBezierCurve3(from, mid, to)
})
const ARC_GEOS = ARC_CURVES.map(c =>
  new THREE.BufferGeometry().setFromPoints(c.getPoints(48))
)

// ── Cena 3D ───────────────────────────────────────────────────────────────────
function GlobeScene({ marketColor, intensity }: { marketColor: string; intensity: number }) {
  const groupRef     = useRef<THREE.Group>(null)
  const cityRefs     = useRef<THREE.Mesh[]>([])
  const particleRefs = useRef<THREE.Mesh[]>([])
  const atmoRef      = useRef<THREE.Mesh>(null)

  // Arcos: recriados só quando a cor muda (evento infrequente)
  const arcLines = useMemo(() =>
    ARC_GEOS.map(geo => {
      const mat = new THREE.LineBasicMaterial({
        color: marketColor, transparent: true,
        opacity: 0.15 + intensity * 0.22,
      })
      return new THREE.Line(geo, mat)
    }),
  [marketColor, intensity])

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y += 0.0013
    const t = clock.getElapsedTime()

    // Pulso das cidades
    cityRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const amp  = i === 0 ? 0.55 : 0.28
      const base = i === 0 ? 1.0  : 0.82
      mesh.scale.setScalar(base + amp * Math.sin((t + i * 0.95) * 2.1))
    })

    // Atmosfera respira
    if (atmoRef.current) {
      ;(atmoRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.045 + 0.022 * Math.sin(t * 0.55)
    }

    // Partículas viajam pelos arcos
    particleRefs.current.forEach((mesh, i) => {
      if (!mesh || !ARC_CURVES[i]) return
      const speed = 0.09 + i * 0.013
      const tVal  = (t * speed) % 1
      mesh.position.copy(ARC_CURVES[i].getPoint(tVal))
      const s = Math.sin(tVal * Math.PI)
      mesh.scale.setScalar(0.35 + s * 1.5)
      ;(mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + s * 3.0
    })
  })

  return (
    <group ref={groupRef}>

      {/* Wireframe globe */}
      <mesh geometry={SPHERE_GEO}>
        <meshBasicMaterial color={SILVER} wireframe transparent opacity={0.05} />
      </mesh>

      {/* Atmosfera — glow emissivo */}
      <mesh ref={atmoRef} geometry={ATMO_GEO}>
        <meshStandardMaterial
          color={marketColor} emissive={marketColor}
          emissiveIntensity={0.22 * intensity}
          transparent opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Equador */}
      <mesh geometry={RING_GEO}>
        <meshBasicMaterial color={SILVER} transparent opacity={0.07} side={THREE.DoubleSide} />
      </mesh>

      {/* Meridiano */}
      <mesh geometry={RING_GEO} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={SILVER} transparent opacity={0.07} side={THREE.DoubleSide} />
      </mesh>

      {/* Trópicos */}
      {[23.44, -23.44].map((lat, i) => {
        const rr = R * Math.cos((lat * Math.PI) / 180)
        const y  = R * Math.sin((lat * Math.PI) / 180)
        return (
          <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[rr - 0.002, rr + 0.002, 48]} />
            <meshBasicMaterial color={SILVER} transparent opacity={0.04} side={THREE.DoubleSide} />
          </mesh>
        )
      })}

      {/* Cidades — emissivas para o bloom */}
      {CITY_POSITIONS.map((pos, i) => (
        <mesh
          key={CITIES[i].name}
          position={pos}
          geometry={CITY_GEO}
          ref={el => { if (el) cityRefs.current[i] = el }}
        >
          <meshStandardMaterial
            color={i === 0 ? marketColor : SILVER}
            emissive={i === 0 ? marketColor : SILVER}
            emissiveIntensity={i === 0 ? 3.2 * intensity : 0.55}
          />
        </mesh>
      ))}

      {/* Arcos — coloridos pelo mercado */}
      {arcLines.map((line, i) => (
        <primitive key={`arc-${i}`} object={line} />
      ))}

      {/* Partículas viajando pelos arcos */}
      {ARC_CURVES.map((_, i) => (
        <mesh
          key={`p-${i}`}
          geometry={PARTICLE_GEO}
          ref={el => { if (el) particleRefs.current[i] = el }}
        >
          <meshStandardMaterial
            color={marketColor}
            emissive={marketColor}
            emissiveIntensity={2.5}
          />
        </mesh>
      ))}

    </group>
  )
}

// ── Canvas ────────────────────────────────────────────────────────────────────
const Globe3DInner = memo(function Globe3DInner({
  marketColor, intensity,
}: {
  marketColor: string
  intensity: number
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.65], fov: 44 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.45} />
      <pointLight position={[2.5, 2.5, 2]} intensity={0.9} />
      <GlobeScene marketColor={marketColor} intensity={intensity} />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.08}
          luminanceSmoothing={0.88}
          intensity={1.5 * intensity}
        />
      </EffectComposer>
    </Canvas>
  )
})

// ── API pública ───────────────────────────────────────────────────────────────
export default function Globe3D({
  chips,
  className = '',
  data: _data,
}: {
  chips?: GlobeSignal[]
  className?: string
  data?: unknown
}) {
  const { marketColor, intensity } = useMemo(() => {
    if (!chips?.length) return { marketColor: '#34d399', intensity: 0.72 }
    const green = chips.filter(c => c.signal?.color === '#34d399').length
    const red   = chips.filter(c => c.signal?.color === '#f87171').length
    const score = green / chips.length
    const col   = score > 0.55 ? '#34d399' : score > 0.35 ? '#fbbf24' : '#f87171'
    // Intensidade maior em mercados estressados (mais drama visual)
    const int   = red > green ? 0.85 + score * 0.3 : 0.5 + score * 0.65
    return { marketColor: col, intensity: Math.min(int, 1.2) }
  }, [chips])

  return (
    <div
      className={className}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      <Suspense
        fallback={
          <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)', borderTopColor: 'rgba(255,255,255,0.55)', animation: 'spin 1s linear infinite' }} />
          </div>
        }
      >
        <Globe3DInner marketColor={marketColor} intensity={intensity} />
      </Suspense>
    </div>
  )
}
