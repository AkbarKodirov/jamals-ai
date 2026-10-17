import { useMemo, useRef } from 'react'
import { useFrame, type ThreeElements } from '@react-three/fiber'
import * as THREE from 'three'
import { humoMood } from './humoMood'

/**
 * Procedural 3D Humo — the bird of fortune, shown in the heraldic
 * front-facing pose with wings spread (as on Uzbekistan's state emblem).
 * Everything is built from geometry, so there are no model files to load.
 */

const GOLD = {
  deep: '#cf8d24',
  base: '#e9a23b',
  bright: '#f7c76a',
  pale: '#fde3a2',
}

/** 0 → 1 over the first ~2s after mount: Humo unfolds its wings and rises into place. */
const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3)
export function introProgress(t: number, delay = 0.2, dur = 1.9) {
  return easeOut((t - delay) / dur)
}

function featherGeometry(len: number, width: number) {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.bezierCurveTo(width * 0.95, len * 0.18, width * 0.9, len * 0.62, 0, len)
  s.bezierCurveTo(-width * 0.55, len * 0.6, -width * 0.6, len * 0.16, 0, 0)
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.012,
    bevelEnabled: true,
    bevelThickness: 0.014,
    bevelSize: 0.014,
    bevelSegments: 3,
    curveSegments: 28,
  })
  g.translate(0, 0, -0.006)
  g.computeVertexNormals()
  return g
}

function useGoldMaterials() {
  return useMemo(() => {
    const make = (color: string, roughness: number) =>
      new THREE.MeshPhysicalMaterial({
        color,
        metalness: 1,
        roughness,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        envMapIntensity: 2.1,
      })
    return {
      deep: make(GOLD.deep, 0.32),
      base: make(GOLD.base, 0.22),
      bright: make(GOLD.bright, 0.16),
      pale: make(GOLD.pale, 0.12),
      beak: new THREE.MeshPhysicalMaterial({ color: '#7a4306', metalness: 0.9, roughness: 0.3, clearcoat: 1 }),
      eye: new THREE.MeshPhysicalMaterial({ color: '#050302', metalness: 0.2, roughness: 0.05, clearcoat: 1 }),
    }
  }, [])
}

type FeatherSpec = {
  pos: [number, number, number]
  rot: number
  len: number
  width: number
  mat: 'deep' | 'base' | 'bright' | 'pale'
  phase: number
}

function buildWing(): FeatherSpec[] {
  const out: FeatherSpec[] = []
  const arm = new THREE.Vector2(Math.cos(0.42), Math.sin(0.42)) // arm rises up and out
  const rows = [
    { n: 11, lenMax: 2.15, lenMin: 1.15, width: 0.2, z: -0.06, mat: 'deep' as const, armLen: 1.35, from: -0.5, to: -2.25 },
    { n: 9, lenMax: 1.35, lenMin: 0.8, width: 0.18, z: 0.0, mat: 'base' as const, armLen: 1.1, from: -0.62, to: -2.1 },
    { n: 7, lenMax: 0.75, lenMin: 0.5, width: 0.15, z: 0.06, mat: 'bright' as const, armLen: 0.88, from: -0.78, to: -2.0 },
    { n: 5, lenMax: 0.42, lenMin: 0.32, width: 0.13, z: 0.11, mat: 'pale' as const, armLen: 0.58, from: -0.95, to: -1.9 },
  ]
  rows.forEach((r) => {
    for (let i = 0; i < r.n; i++) {
      const u = i / (r.n - 1)
      const along = THREE.MathUtils.lerp(r.armLen, 0.12, u)
      const len = THREE.MathUtils.lerp(r.lenMax, r.lenMin, Math.pow(u, 1.3))
      out.push({
        pos: [arm.x * along, arm.y * along - u * 0.05, r.z + u * 0.01],
        rot: THREE.MathUtils.lerp(r.from, r.to, u),
        len,
        width: r.width * (0.9 + 0.2 * Math.sin(u * Math.PI)),
        mat: r.mat,
        phase: u,
      })
    }
  })
  return out
}

function Wing({ side, mats }: { side: 1 | -1; mats: ReturnType<typeof useGoldMaterials> }) {
  const pivot = useRef<THREE.Group>(null)
  const featherRefs = useRef<(THREE.Mesh | null)[]>([])
  const specs = useMemo(buildWing, [])
  const geos = useMemo(() => specs.map((s) => featherGeometry(s.len, s.width)), [specs])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    humoMood.value += (humoMood.target - humoMood.value) * 0.04
    const beat = Math.sin(t * (1.15 + humoMood.value * 2.4)) * (1 + humoMood.value * 0.6)
    const k = introProgress(t)
    if (pivot.current) {
      pivot.current.rotation.z = 0.06 + beat * 0.16 * k - (1 - k) * 0.9
      pivot.current.rotation.y = Math.sin(t * 1.15 + 0.6) * 0.14 * k
      pivot.current.scale.setScalar(0.55 + 0.45 * k)
    }
    featherRefs.current.forEach((m, i) => {
      if (!m) return
      const s = specs[i]
      // feathers fan out from a folded bundle, then trail slightly behind the beat
      const folded = -1.7
      m.rotation.z = folded + (s.rot - folded) * easeOut(k * 1.15 - s.phase * 0.15) + Math.sin(t * 1.15 - s.phase * 1.1) * 0.05 * (1 - s.phase * 0.5) * k
      m.rotation.x = Math.sin(t * 1.15 - s.phase) * 0.06
    })
  })

  return (
    <group scale={[side, 1, 1]}>
      <group ref={pivot} position={[0.28, 0.42, -0.05]}>
        {specs.map((s, i) => (
          <mesh
            key={i}
            ref={(el) => {
              featherRefs.current[i] = el
            }}
            geometry={geos[i]}
            material={mats[s.mat]}
            position={s.pos}
            rotation={[0, 0, s.rot]}
            castShadow
          />
        ))}
      </group>
    </group>
  )
}

function Tail({ mats }: { mats: ReturnType<typeof useGoldMaterials> }) {
  const refs = useRef<(THREE.Mesh | null)[]>([])
  const specs = useMemo(() => {
    const n = 9
    return Array.from({ length: n }, (_, i) => {
      const u = i / (n - 1) - 0.5
      return {
        rot: Math.PI + u * 1.15,
        len: 2.3 - Math.abs(u) * 1.3,
        width: 0.2,
        z: -0.12 - Math.abs(u) * 0.06,
        mat: (Math.abs(u) < 0.2 ? 'bright' : Math.abs(u) < 0.4 ? 'base' : 'deep') as FeatherSpec['mat'],
        u,
      }
    })
  }, [])
  const geos = useMemo(() => specs.map((s) => featherGeometry(s.len, s.width)), [specs])
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    refs.current.forEach((m, i) => {
      if (!m) return
      m.rotation.z = specs[i].rot + Math.sin(t * 0.9 + specs[i].u * 2) * 0.05
    })
  })
  return (
    <group position={[0, -0.62, 0]}>
      {specs.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          geometry={geos[i]}
          material={mats[s.mat]}
          position={[0, 0, s.z]}
          rotation={[0, 0, s.rot]}
        />
      ))}
    </group>
  )
}

function Body({ mats }: { mats: ReturnType<typeof useGoldMaterials> }) {
  const bodyGeo = useMemo(() => {
    const profile = [
      [0.001, -0.85], [0.17, -0.8], [0.31, -0.66], [0.41, -0.42], [0.46, -0.12], [0.44, 0.14],
      [0.37, 0.38], [0.27, 0.6], [0.2, 0.78], [0.185, 0.95], [0.12, 1.06], [0.001, 1.1],
    ].map(([r, y]) => new THREE.Vector2(r, y))
    const pts = new THREE.SplineCurve(profile).getPoints(64).map((v) => new THREE.Vector2(Math.max(v.x, 0.001), v.y))
    return new THREE.LatheGeometry(pts, 72)
  }, [])

  // Overlapping breast feathers — gives the chest a sculpted, jeweled read
  const chest = useMemo(() => {
    const out: { pos: [number, number, number]; rot: [number, number, number]; len: number; mat: FeatherSpec['mat'] }[] = []
    const rows = 5
    for (let r = 0; r < rows; r++) {
      const y = 0.45 - r * 0.22
      const cols = 5 - (r % 2)
      const radius = 0.44 * (1 - 0.18 * Math.abs(y - 0.0))
      for (let c = 0; c < cols; c++) {
        const a = ((c - (cols - 1) / 2) / cols) * 1.5
        out.push({
          pos: [Math.sin(a) * radius, y, Math.cos(a) * radius - 0.02],
          rot: [-0.25, a, Math.PI],
          len: 0.3 - r * 0.012,
          mat: r < 2 ? 'pale' : 'bright',
        })
      }
    }
    return out
  }, [])
  const chestGeo = useMemo(() => featherGeometry(0.3, 0.1), [])

  return (
    <group>
      <mesh geometry={bodyGeo} material={mats.base} />
      {chest.map((f, i) => (
        <mesh key={i} geometry={chestGeo} material={mats[f.mat]} position={f.pos} rotation={f.rot} scale={f.len / 0.3} />
      ))}
    </group>
  )
}

function Head({ mats }: { mats: ReturnType<typeof useGoldMaterials> }) {
  const ref = useRef<THREE.Group>(null)
  const crestGeo = useMemo(() => featherGeometry(0.34, 0.08), [])
  useFrame(({ clock, pointer }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.x * 0.5 + Math.sin(t * 0.4) * 0.12, 0.05)
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -pointer.y * 0.25, 0.05)
  })
  return (
    <group ref={ref} position={[0, 1.12, 0.03]}>
      <mesh material={mats.bright} scale={[1, 0.94, 1.08]}>
        <sphereGeometry args={[0.26, 48, 48]} />
      </mesh>
      {/* beak */}
      <mesh material={mats.beak} position={[0, -0.04, 0.28]} rotation={[Math.PI / 2 + 0.35, 0, 0]}>
        <coneGeometry args={[0.07, 0.24, 24]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} material={mats.eye} position={[s * 0.16, 0.05, 0.18]}>
          <sphereGeometry args={[0.036, 20, 20]} />
        </mesh>
      ))}
      {/* crest */}
      {[-0.32, 0, 0.32].map((a, i) => (
        <mesh key={i} geometry={crestGeo} material={mats.pale} position={[a * 0.25, 0.2, -0.05]} rotation={[-0.55, 0, -a]} scale={i === 1 ? 1.15 : 0.9} />
      ))}
    </group>
  )
}

export function HumoBird(props: ThreeElements['group']) {
  const mats = useGoldMaterials()
  const root = useRef<THREE.Group>(null)

  useFrame(({ clock, pointer }) => {
    if (!root.current) return
    const t = clock.getElapsedTime()
    const k = introProgress(t, 0, 1.6)
    root.current.position.y = Math.sin(t * 1.15 - 0.6) * 0.07 * k - (1 - k) * 0.8 // rises in, then lifts on each downstroke
    root.current.scale.setScalar(0.85 + 0.15 * k)
    root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, pointer.x * 0.35, 0.04)
    root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, -pointer.y * 0.12 + 0.04, 0.04)
  })

  return (
    <group {...props}>
      <group ref={root}>
        <Tail mats={mats} />
        <Wing side={1} mats={mats} />
        <Wing side={-1} mats={mats} />
        <Body mats={mats} />
        <Head mats={mats} />
      </group>
    </group>
  )
}
