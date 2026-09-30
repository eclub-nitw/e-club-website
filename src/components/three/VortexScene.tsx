"use client";
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdditiveBlending, CanvasTexture, Color, MathUtils, type Group } from "three";
import { token } from "@/lib/webgl";

const COUNT = 3600; // budget is 4000
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
        <pointsMaterial map={sprite} size={0.11} sizeAttenuation vertexColors transparent depthWrite={false} blending={AdditiveBlending} />
      </points>
      <mesh>
        <torusGeometry args={[ring, 0.012, 8, 128]} />
        <meshBasicMaterial color={accent} />
      </mesh>
    </group>
  );
}

/** Particle spiral swirling into a ring. Speeds up on hover; the camera dives in when `falling`. */
export default function VortexScene({ active, hover, falling, onReady, coarse }: { active: boolean; hover: boolean; falling: boolean; onReady: () => void; coarse: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, coarse ? 1.5 : 2]}
      camera={{ position: [0, 0, 7.5], fov: 50, near: 0.1, far: 40 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => requestAnimationFrame(onReady)}
      className="!pointer-events-none"
    >
      <Spiral hover={hover} falling={falling} />
    </Canvas>
  );
}
