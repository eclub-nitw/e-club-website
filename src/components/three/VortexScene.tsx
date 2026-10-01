"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { AdditiveBlending, CanvasTexture, Color, MathUtils, PMREMGenerator, type Group } from "three";
import { token } from "@/lib/webgl";

const COUNT = 1700; // V4: the particles are a supporting layer under the coin, not the show
const COIN = "/models/ledger-coin.glb"; // 140 KB, 3.9k tris, KHR_mesh_quantization only: no Draco/Meshopt decoder (CSP forbids wasm-unsafe-eval)
const ARMS = 3;

/** Deterministic hash in [0,1): the same particles on every mount, no Math.random in render. */
const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

function Spiral({ hover, falling }: { hover: boolean; falling: boolean }) {
  const group = useRef<Group>(null);
  const speed = useRef(0.25);
  // Soft round sprite, drawn once: additive blending turns it into a glow.
  const sprite = useMemo(() => {
    const c = document.createElement("canvas"); c.width = c.height = 64;
    const g = c.getContext("2d");
    if (g) {
      const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255,255,255,1)"); grad.addColorStop(0.35, "rgba(255,255,255,0.55)"); grad.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
    }
    return new CanvasTexture(c);
  }, []);
  const { positions, colors, ring, accent } = useMemo(() => {
    const accent = new Color(token("--accent")), cyan = new Color(token("--color-club-cyan"));
    const positions = new Float32Array(COUNT * 3), colors = new Float32Array(COUNT * 3);
    const ring = 1.5;
    for (let i = 0; i < COUNT; i++) {
      const t = i / COUNT, arm = i % ARMS;
      const angle = t * 19 + (arm * Math.PI * 2) / ARMS + (hash(i) - 0.5) * 0.18;
      const r = ring + Math.pow(1 - t, 1.5) * 4.6 + (hash(i + 9) - 0.5) * 0.14;
      positions.set([Math.cos(angle) * r, Math.sin(angle) * r, (hash(i + 4) - 0.5) * 0.7 * (1 - t)], i * 3);
      const c = (arm === 1 ? cyan : accent).clone().multiplyScalar(0.35 + 0.65 * t);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    return { positions, colors, ring, accent };
  }, []);

  useFrame(({ camera }, dt) => {
    speed.current = MathUtils.damp(speed.current, falling ? 7 : hover ? 1.4 : 0.25, 3, dt);
    if (group.current) group.current.rotation.z += speed.current * dt;
    camera.position.z = MathUtils.damp(camera.position.z, falling ? 0.9 : 7.5, falling ? 5 : 3, dt);
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial map={sprite} size={0.075} sizeAttenuation vertexColors transparent opacity={0.8} depthWrite={false} blending={AdditiveBlending} />
      </points>
      <mesh>
        <torusGeometry args={[ring, 0.012, 8, 128]} />
        <meshBasicMaterial color={accent} />
      </mesh>
    </group>
  );
}

/** Procedural studio reflections for the brass (no HDRI fetched from anywhere). */
function Studio() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    // eslint-disable-next-line react-hooks/immutability -- three.js scenes are mutable by design; this is the documented way to set an environment map
    scene.environment = env;
    return () => { scene.environment = null; env.dispose(); pmrem.dispose(); };
  }, [gl, scene]);
  return null;
}

/** The brass ledger coin (modelled in Blender), turning slowly inside the ring. */
function Coin({ falling }: { falling: boolean }) {
  const { scene } = useLoader(GLTFLoader, COIN); // plain GLTFLoader: no Draco/Meshopt decoder is attached, so no wasm
  const { gl, scene: root, camera } = useThree();
  const ref = useRef<Group>(null);
  // Parallel shader compile while the portal is still off screen: otherwise the brass material compiles inside its first visible frame (a ~150 ms task).
  useEffect(() => { void gl.compileAsync(root, camera); }, [gl, root, camera]);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * (falling ? 4 : 0.5); });
  return <group ref={ref} scale={1.15}><primitive object={scene} /></group>;
}

/** A low pedestal under the standing coin, lit by one warm point light from above: the coin is staged, not floating in a ring. */
function Pedestal() {
  return (
    <group position={[0, -1.5, 0]}>
      <mesh><cylinderGeometry args={[0.95, 1.1, 0.24, 64]} /><meshStandardMaterial color="#0f3036" metalness={0.35} roughness={0.4} /></mesh>
      <mesh position={[0, 0.125, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.95, 0.018, 12, 96]} /><meshStandardMaterial color="#d99a4a" metalness={0.9} roughness={0.35} /></mesh>
      <pointLight position={[0, 3.2, 1.6]} intensity={14} color="#ed9038" distance={9} decay={2} />
    </group>
  );
}

/** Particle spiral swirling into a ring. Speeds up on hover; the camera dives in when `falling`. */
export default function VortexScene({ active, hover, falling, onReady }: { active: boolean; hover: boolean; falling: boolean; onReady: () => void }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 7.5], fov: 50, near: 0.1, far: 40 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => requestAnimationFrame(onReady)}
      className="!pointer-events-none"
    >
      <Spiral hover={hover} falling={falling} />
      <Studio />
      <Suspense fallback={null}><Coin falling={falling} /><Pedestal /></Suspense>
    </Canvas>
  );
}
