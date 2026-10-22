import { useMemo, useRef } from 'react'
import { useFrame, type ThreeElements } from '@react-three/fiber'
import * as THREE from 'three'
import { humoMood } from './humoMood'

/**
 * Procedural 3D Sensai — an ensō (the single brush-stroke circle a Zen master draws in one breath)
 * in STEP12 crimson, around a living crimson light, and a small white spark of
 * insight resting in the gap of the stroke. Everything is built from geometry: no model files.
 */

const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3)
/** 0 → 1 over the first ~2s after mount: the stroke is drawn and the core lights up. */
export function introProgress(t: number, delay = 0.2, dur = 1.9) {
  return easeOut((t - delay) / dur)
}

/** A brush stroke swept along a circle: thick where the brush lands, thinning out to a dry tail. */
function ensoGeometry(R = 1.55, tube = 0.2, arc = Math.PI * 2 * 0.87, segs = 420, sides = 28) {
  const pos: number[] = []
  const nor: number[] = []
  const idx: number[] = []
  const start = Math.PI * 0.32 // the gap sits at the upper right
  for (let i = 0; i <= segs; i++) {
    const u = i / segs
    const a = start + u * arc
    // heavy landing, long even body, feathered tail; a slight wobble like real ink
    const w = tube * (Math.min(1, u * 9) ** 0.5 * (1 - 0.72 * u ** 2.2) * (0.94 + 0.06 * Math.sin(u * 37)))
    const c = new THREE.Vector3(Math.cos(a) * R, Math.sin(a) * R, 0)
    const n1 = new THREE.Vector3(Math.cos(a), Math.sin(a), 0)
    const n2 = new THREE.Vector3(0, 0, 1)
    for (let j = 0; j <= sides; j++) {
      const v = (j / sides) * Math.PI * 2
      // flattened like a brush: wider in the plane than in depth
      const d = n1.clone().multiplyScalar(Math.cos(v) * w).add(n2.clone().multiplyScalar(Math.sin(v) * w * 0.55))
      pos.push(c.x + d.x, c.y + d.y, c.z + d.z)
      const nn = n1.clone().multiplyScalar(Math.cos(v) * 0.55).add(n2.clone().multiplyScalar(Math.sin(v))).normalize()
      nor.push(nn.x, nn.y, nn.z)
    }
  }
  for (let i = 0; i < segs; i++)
    for (let j = 0; j < sides; j++) {
      const a = i * (sides + 1) + j
      const b = a + sides + 1
      idx.push(a, b, a + 1, b, b + 1, a + 1)
    }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
  g.setIndex(idx)
  return g
}

/** Four-pointed spark: two crossed, stretched octahedra. */
function Spark(props: ThreeElements['group']) {
  return (
    <group {...props}>
      <mesh scale={[0.07, 0.3, 0.07]}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={[3.2, 3.0, 3.1]} toneMapped={false} />
      </mesh>
      <mesh scale={[0.3, 0.07, 0.07]}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={[3.2, 3.0, 3.1]} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={[4, 3.6, 3.8]} toneMapped={false} />
      </mesh>
    </group>
  )
}

/** Soft radial glow drawn in a tiny shader (no textures, no flat discs). */
function glowMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    uniforms: { uOpacity: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `varying vec2 vUv; uniform float uOpacity;
      void main(){
        float d = distance(vUv, vec2(0.5)) * 2.0;
        float core = exp(-d * d * 60.0);
        float mid = exp(-d * d * 9.0);
        float outer = exp(-d * d * 3.0) * (1.0 - smoothstep(0.85, 1.0, d));
        vec3 col = vec3(1.0, 0.94, 0.96) * core * 1.6 + vec3(1.0, 0.32, 0.5) * mid * 0.9 + vec3(0.62, 0.02, 0.18) * outer * 0.6;
        gl_FragColor = vec4(col * uOpacity, 1.0);
      }`,
  })
}

export function SensaiCore(props: ThreeElements['group']) {
  const root = useRef<THREE.Group>(null)
  const stroke = useRef<THREE.Mesh>(null)
  const light = useRef<THREE.Mesh>(null)
  const halo = useRef<THREE.Mesh>(null)
  const spark = useRef<THREE.Group>(null)
  const geo = useMemo(() => ensoGeometry(), [])
  const glow = useMemo(() => glowMaterial(), [])
  const total = geo.index!.count

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    humoMood.value += (humoMood.target - humoMood.value) * 0.04
    const m = humoMood.value
    const p = introProgress(t)
    // the brush draws the circle in one breath
    geo.setDrawRange(0, Math.floor((total / 6) * p) * 6)
    if (root.current) {
      root.current.rotation.y = Math.sin(t * 0.35) * 0.28 + m * Math.sin(t * 1.6) * 0.12
      root.current.rotation.x = Math.sin(t * 0.27) * 0.08
      root.current.position.y = Math.sin(t * 0.9) * 0.06
    }
    if (stroke.current) stroke.current.rotation.z = Math.sin(t * 0.2) * 0.05 - m * 0.04
    const pulse = 0.5 + 0.5 * Math.sin(t * (1.4 + m * 3))
    if (light.current) light.current.scale.setScalar((0.13 + 0.03 * pulse + m * 0.05) * (0.2 + 0.8 * p))
    glow.uniforms.uOpacity.value = (0.75 + 0.25 * pulse + m * 0.35) * p
    if (spark.current) {
      const a = Math.PI * 0.32 - 0.14 + Math.sin(t * 0.8) * 0.03
      spark.current.position.set(Math.cos(a) * 1.62, Math.sin(a) * 1.62, 0.12)
      spark.current.rotation.z = t * (0.6 + m * 2.5)
      spark.current.scale.setScalar(p * (0.9 + 0.25 * pulse + m * 0.4))
    }
  })

  return (
    <group ref={root} {...props}>
      <mesh ref={stroke} geometry={geo}>
        <meshPhysicalMaterial color="#b80d3b" metalness={0.7} roughness={0.2} clearcoat={1} clearcoatRoughness={0.12} sheen={0.6} sheenColor="#ff9fb4" envMapIntensity={1.4} />
      </mesh>
      {/* the living light inside */}
      <mesh ref={light}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial color={[3.2, 1.6, 2.0]} toneMapped={false} />
      </mesh>
      <mesh ref={halo} position={[0, 0, -0.05]}>
        <planeGeometry args={[2.6, 2.6]} />
        <primitive object={glow} attach="material" />
      </mesh>
      <group ref={spark}>
        <Spark />
      </group>
    </group>
  )
}
