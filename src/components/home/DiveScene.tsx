"use client";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { AdditiveBlending, Color, MathUtils, SRGBColorSpace, TextureLoader } from "three";
import { token } from "@/lib/webgl";

export type DiveFrame = { id: string; src: string };
const SPACING = 6;
const INK = "#0b2226"; // = --bg; WebGL needs a literal, and this scene is always on the ink theme

/** Deterministic pseudo-random in [0,1): identical layout on every mount. */
const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

function Tunnel({ frames, progress }: { frames: DiveFrame[]; progress: MutableRefObject<number> }) {
  const textures = useLoader(TextureLoader, frames.map((f) => f.src));
  const pointer = useThree((s) => s.pointer);
  const gl = useThree((s) => s.gl);
  const depth = frames.length * SPACING;
  const smooth = useRef(0);

  const { accent, planes, streaks } = useMemo(() => {
    const accent = new Color(token("--accent"));
    textures.forEach((t) => { t.colorSpace = SRGBColorSpace; t.anisotropy = 4; });
    const planes = frames.map((_, i) => {
      const angle = i * 2.4 + hash(i) * 0.6, r = 2.6 + (i % 3) * 0.75;
      return { x: Math.cos(angle) * r, y: Math.sin(angle) * r * 0.55, z: -i * SPACING, roll: (hash(i + 3) - 0.5) * 0.12 };
    });
    const n = 140, pos = new Float32Array(n * 6);
    for (let i = 0; i < n; i++) {
      const a = hash(i + 50) * Math.PI * 2, r = 4.5 + hash(i + 80) * 5, z = 6 - hash(i + 20) * (depth + 14), len = 1.5 + hash(i + 90) * 3.5;
      pos.set([Math.cos(a) * r, Math.sin(a) * r * 0.7, z, Math.cos(a) * r, Math.sin(a) * r * 0.7, z - len], i * 6);
    }
    return { accent, planes, streaks: pos };
  }, [textures, frames, depth]);

  // Upload the 13 textures to the GPU one per idle slot instead of all inside the first frame (that was a 130 ms task at the Dive's entrance).
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
    smooth.current = MathUtils.damp(smooth.current, progress.current, 4, dt);
    const z = 4 - smooth.current * ((frames.length - 1) * SPACING - 2); // stop 6 units before the last photograph
    camera.position.z = z;
    camera.position.x = MathUtils.damp(camera.position.x, pointer.x * 0.35, 3, dt);
    camera.position.y = MathUtils.damp(camera.position.y, pointer.y * 0.2, 3, dt);
    camera.rotation.z = Math.sin(smooth.current * Math.PI * 3) * 0.05;
  });

  return (
    <group>
      {planes.map((p, i) => (
        <mesh key={frames[i].id} position={[p.x, p.y, p.z]} rotation={[0, 0, p.roll]}>
          <planeGeometry args={[5.6, 4.2]} />
          <meshBasicMaterial map={textures[i]} toneMapped={false} />
        </mesh>
      ))}
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[streaks, 3]} /></bufferGeometry>
        <lineBasicMaterial color={accent} transparent opacity={0.55} blending={AdditiveBlending} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

/** The Dive: photographs on staggered rings, a camera flying forward with scroll, ink depth fog, orange light streaks. */
export default function DiveScene({ frames, progress, active, onReady }: {
  frames: DiveFrame[]; progress: MutableRefObject<number>; active: boolean; onReady: () => void;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4], fov: 55, near: 0.1, far: 40 }}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      onCreated={() => requestAnimationFrame(onReady)}
      className="!pointer-events-none"
    >
      <color attach="background" args={[INK]} />
      <fog attach="fog" args={[INK, 6, 26]} />
      <Tunnel frames={frames} progress={progress} />
    </Canvas>
  );
}
