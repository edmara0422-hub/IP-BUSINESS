'use client'

import { Suspense, useRef, useMemo, memo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const SILVER = new THREE.Color('#c0c0c0')
const SILVER_HEX = '#c0c0c0'

const CITIES = [
  { name: 'São Paulo', lat: -23.55, lng: -46.63 },
  { name: 'New York', lat: 40.71, lng: -74.01 },
  { name: 'London', lat: 51.51, lng: -0.13 },
  { name: 'Tokyo', lat: 35.68, lng: 139.69 },
  { name: 'Shanghai', lat: 31.23, lng: 121.47 },
  { name: 'Frankfurt', lat: 50.11, lng: 8.68 },
  { name: 'Mumbai', lat: 19.08, lng: 72.88 },
  { name: 'Sydney', lat: -33.87, lng: 151.21 },
]

const R = 1

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

// Pre-compute geometry at module level (runs once, not per render)
const SPHERE_GEO = new THREE.SphereGeometry(R, 20, 20)
const SPHERE_MAT = new THREE.MeshBasicMaterial({ color: SILVER_HEX, wireframe: true, transparent: true, opacity: 0.07 })
const EQUATOR_GEO = new THREE.RingGeometry(R - 0.002, R + 0.002, 48)
const RING_MAT = new THREE.MeshBasicMaterial({ color: SILVER_HEX, transparent: true, opacity: 0.1, side: THREE.DoubleSide })
const CITY_GEO = new THREE.SphereGeometry(0.022, 6, 6)
const CITY_MAT = new THREE.MeshBasicMaterial({ color: SILVER_HEX })

const CITY_POSITIONS = CITIES.map(c => latLngToVector3(c.lat, c.lng, R))

// Pre-build all arc objects at module level
const ARC_OBJECTS = CITY_POSITIONS.slice(1).map(to => {
  const from = CITY_POSITIONS[0]
  const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5)
  mid.normalize().multiplyScalar(R * 1.35)
  const curve = new THREE.QuadraticBezierCurve3(from, mid, to)
  const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(24))
  const mat = new THREE.LineBasicMaterial({ color: SILVER_HEX, transparent: true, opacity: 0.2 })
  return new THREE.Line(geo, mat)
})

function GlobeScene() {
  const groupRef = useRef<THREE.Group>(null)
  const cityRefs = useRef<THREE.Mesh[]>([])

  // Single useFrame for everything — no per-city useFrame
  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y += 0.0018
    const t = clock.getElapsedTime()
    cityRefs.current.forEach((mesh, i) => {
      if (mesh) mesh.scale.setScalar(1 + 0.35 * Math.sin((t + i * 0.7) * 2.5))
    })
  })

  const meridianGeo = useMemo(() => new THREE.RingGeometry(R - 0.002, R + 0.002, 48), [])

  return (
    <group ref={groupRef}>
      {/* Wireframe globe — MeshBasicMaterial (no lighting calc) */}
      <primitive object={new THREE.Mesh(SPHERE_GEO, SPHERE_MAT)} />

      {/* Equator */}
      <primitive object={new THREE.Mesh(EQUATOR_GEO, RING_MAT)} />

      {/* Meridian */}
      <mesh rotation={[Math.PI / 2, 0, 0]} geometry={meridianGeo}>
        <meshBasicMaterial color={SILVER_HEX} transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Tropic rings */}
      {[23.44, -23.44].map((lat, i) => {
        const rr = R * Math.cos((lat * Math.PI) / 180)
        const y = R * Math.sin((lat * Math.PI) / 180)
        return (
          <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[rr - 0.002, rr + 0.002, 40]} />
            <meshBasicMaterial color={SILVER_HEX} transparent opacity={0.06} side={THREE.DoubleSide} />
          </mesh>
        )
      })}

      {/* City dots — shared geometry/material */}
      {CITY_POSITIONS.map((pos, i) => (
        <mesh key={CITIES[i].name} position={pos} geometry={CITY_GEO} material={CITY_MAT}
          ref={el => { if (el) cityRefs.current[i] = el }} />
      ))}

      {/* Arc lines — pre-built at module level */}
      {ARC_OBJECTS.map((obj, i) => <primitive key={i} object={obj} />)}
    </group>
  )
}

const Globe3DInner = memo(function Globe3DInner() {
  return (
    <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }} gl={{ antialias: false, powerPreference: 'high-performance' }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.6} />
      <GlobeScene />
    </Canvas>
  )
})

export default function Globe3D({ className = '' }: { className?: string; data?: unknown }) {
  return (
    <div className={`h-full w-full ${className}`}>
      <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/60" /></div>}>
        <Globe3DInner />
      </Suspense>
    </div>
  )
}
