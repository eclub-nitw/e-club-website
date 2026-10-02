"use client";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { AdditiveBlending, CanvasTexture, Color, MathUtils, SRGBColorSpace, TextureLoader, type Group, type PerspectiveCamera } from "three";
import { dive } from "@/data/dive";
import { token } from "@/lib/webgl";

const INK = "#0b2226"; // = --bg; WebGL needs a literal and this scene is always on the ink theme
const RING = 1.5, SPACING = 5.5, FIRST = -7, COUNT = 1500, ARMS = 3;
const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const LAST_Z = FIRST - (dive.length - 1) * SPACING;

/** The ring and its spiral arms: small at first, then the camera dollies into it until it fills the frame. */
function Vortex({ progress }: { progress: MutableRefObject<number> }) {
  const group = useRef<Group>(null);
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
  const { positions, colors, accent } = useMemo(() => {
    const accent = new Color(token("--accent")), cyan = new Color(token("--color-club-cyan"));
    const positions = new Float32Array(COUNT * 3), colors = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const t = i / COUNT, arm = i % ARMS;
      const angle = t * 19 + (arm * Math.PI * 2) / ARMS + (hash(i) - 0.5) * 0.18;
      const r = RING + Math.pow(1 - t, 1.5) * 4.6 + (hash(i + 9) - 0.5) * 0.14;
      positions.set([Math.cos(angle) * r, Math.sin(angle) * r, (hash(i + 4) - 0.5) * 0.7 * (1 - t)], i * 3);
      const c = (arm === 1 ? cyan : accent).clone().multiplyScalar(0.35 + 0.65 * t);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    return { positions, colors, accent };
  }, []);
  useFrame((_, dt) => {
    if (!group.current) return;
    const p = progress.current;
    group.current.rotation.z += dt * (0.25 + p * 2.2);
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
      <mesh><torusGeometry args={[RING, 0.014, 8, 160]} /><meshBasicMaterial color={accent} /></mesh>
    </group>
  );
}

/** Art panels on staggered positions down the tunnel, and orange streaks that lengthen with speed. */
function Tunnel({ progress, onIndex }: { progress: MutableRefObject<number>; onIndex: (i: number) => void }) {
  const textures = useLoader(TextureLoader, dive.map((d) => `/images/dive/${d.slug}.webp`));
  const gl = useThree((s) => s.gl);
  const pointer = useThree((s) => s.pointer);
  const streaks = useRef<Group>(null);
  const smooth = useRef(0);
  const lastIdx = useRef(-1);

  const { planes, accent, pos } = useMemo(() => {
    textures.forEach((t) => { t.colorSpace = SRGBColorSpace; t.anisotropy = 4; });
    const planes = dive.map((d, i) => {
      const aspect = d.w / d.h, h = Math.min(4.2, 6 / aspect), w = h * aspect;
      const angle = i * 2.4 + hash(i) * 0.6, r = 2.9 + (i % 3) * 0.8;
      return { w, h, x: Math.cos(angle) * r, y: Math.sin(angle) * r * 0.6, z: FIRST - i * SPACING, roll: (hash(i + 3) - 0.5) * 0.12 };
    });
    const n = 160, pos = new Float32Array(n * 6);
    for (let i = 0; i < n; i++) {
      const a = hash(i + 50) * Math.PI * 2, r = 3.2 + hash(i + 80) * 6, z = 2 + hash(i + 20) * (LAST_Z - 20), len = 1 + hash(i + 90) * 3;
      pos.set([Math.cos(a) * r, Math.sin(a) * r * 0.7, z, Math.cos(a) * r, Math.sin(a) * r * 0.7, z - len], i * 6);
    }
    return { planes, accent: new Color(token("--accent")), pos };
  }, [textures]);

  // Upload textures one per idle slot instead of all inside the first frame.
  useEffect(() => {
    let i = 0, h = 0, cancelled = false;
    const idle = typeof window.requestIdleCallback === "function";
    const next = () => {
      if (cancelled || i >= textures.length) return;
      gl.initTexture(textures[i++]);
      h = idle ? window.requestIdleCallback(next, { timeout: 200 }) : window.setTimeout(next, 30);
    };
    h = idle ? window.requestIdleCallback(next, { timeout: 200 }) : window.setTimeout(next, 30);
    return () => { cancelled = true; if (idle) window.cancelIdleCallback(h); else window.clearTimeout(h); };
  }, [gl, textures]);

  useFrame(({ camera }, dt) => {
    smooth.current = MathUtils.damp(smooth.current, progress.current, 6, dt);
    const p = smooth.current;
    const cam = camera as PerspectiveCamera;
    // 0 to 0.3: dolly from the wide shot into the ring until it fills the frame. 0.3 to 1: fall through it and down the tunnel.
    const a = easeInOut(MathUtils.clamp(p / 0.3, 0, 1)), b = MathUtils.clamp((p - 0.3) / 0.7, 0, 1);
    const zEnd = LAST_Z + 7;
    cam.position.z = 9 - a * 8.4 + b * (zEnd - 0.6);
    const warp = Math.sin(Math.min(1, b * 3) * Math.PI) * 0.5;
    cam.fov = 50 + a * 14 + warp * 34;
    cam.updateProjectionMatrix();
    cam.position.x = MathUtils.damp(cam.position.x, pointer.x * 0.3 * a, 3, dt);
    cam.position.y = MathUtils.damp(cam.position.y, pointer.y * 0.18 * a, 3, dt);
    cam.rotation.z = Math.sin(p * Math.PI * 3) * 0.05 * b;
    if (streaks.current) streaks.current.scale.z = 1 + b * 4 * Math.min(1, b * 4); // streaks lengthen as the fall speeds up
    const shown = b > 0 ? Math.max(0, Math.min(dive.length - 1, Math.round((FIRST + 7 - cam.position.z) / SPACING))) : -1;
    if (shown !== lastIdx.current) { lastIdx.current = shown; onIndex(Math.max(0, shown)); }
  });

  return (
    <group>
      {planes.map((pl, i) => (
        <mesh key={dive[i].slug} position={[pl.x, pl.y, pl.z]} rotation={[0, 0, pl.roll]}>
          <planeGeometry args={[pl.w, pl.h]} />
          <meshBasicMaterial map={textures[i]} toneMapped={false} />
        </mesh>
      ))}
      <group ref={streaks}>
        <lineSegments>
          <bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry>
          <lineBasicMaterial color={accent} transparent opacity={0.5} blending={AdditiveBlending} depthWrite={false} />
        </lineSegments>
      </group>
    </group>
  );
}

/** Pinned vortex scene: ring and arms, expanding to fill the viewport, then a scrubbed fall through a tunnel of generated art and posters. */
export default function ExpandScene({ progress, active, onIndex, onReady }: {
  progress: MutableRefObject<number>; active: boolean; onIndex: (i: number) => void; onReady: () => void;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 50, near: 0.1, far: 90 }}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      onCreated={() => requestAnimationFrame(onReady)}
      className="!pointer-events-none"
    >
      <color attach="background" args={[INK]} />
      <fog attach="fog" args={[INK, 8, 34]} />
      <Vortex progress={progress} />
      <Tunnel progress={progress} onIndex={onIndex} />
    </Canvas>
  );
}
