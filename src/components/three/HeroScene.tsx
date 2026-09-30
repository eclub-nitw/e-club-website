"use client";
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Environment, Float, Lightformer, MeshReflectorMaterial } from "@react-three/drei";
import { MathUtils, type Group } from "three";
import { token } from "@/lib/webgl";

const HEIGHTS = [0.6, 1.0, 1.5, 2.1, 2.8, 3.6, 4.6];
const COINS: { p: [number, number, number]; r: number; s: number }[] = [
  { p: [0.6, 3.6, 1.6], r: 0.9, s: 1 }, { p: [3.4, 5.4, 0.4], r: 2.2, s: 0.8 }, { p: [-1.1, 2.3, 2.4], r: 0.4, s: 1.15 },
  { p: [5.2, 2.6, 1.9], r: 1.7, s: 0.9 }, { p: [2.6, 0.9, 3.2], r: 1.2, s: 1.1 }, { p: [6.5, 5.6, -0.6], r: 2.6, s: 0.7 },
];
const ease = (t: number) => 1 - Math.pow(1 - t, 4); // power4.out, the one easing family

function Bars({ glass, accent }: { glass: string; accent: string }) {
  const refs = useRef<(Group | null)[]>([]);
  const t0 = useRef(-1);
  useFrame((state) => {
    if (t0.current < 0) t0.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - t0.current;
    refs.current.forEach((g, i) => { if (g) g.scale.y = Math.max(0.001, ease(MathUtils.clamp((t - 0.15 - i * 0.09) / 1.1, 0, 1))); });
  });
  return (
    <group position={[-0.4, 0, 0]}>
      {HEIGHTS.map((h, i) => (
        <group key={i} ref={(g) => { refs.current[i] = g; }} position={[i * 1.08, 0, 0]}>
          <mesh position={[0, h / 2, 0]}>
            <boxGeometry args={[0.82, h, 0.82]} />
            <meshPhysicalMaterial color={glass} roughness={0.18} metalness={0.55} clearcoat={1} clearcoatRoughness={0.06} envMapIntensity={2.2} />
            <Edges threshold={15} color={accent} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Coins({ accent }: { accent: string }) {
  return (
    <>
      {COINS.map((c, i) => (
        <Float key={i} speed={1.1 + i * 0.12} rotationIntensity={0.5} floatIntensity={0.6} position={c.p}>
          <mesh rotation={[Math.PI / 2 - 0.55 - (i % 3) * 0.18, c.r, c.r * 0.35]} scale={c.s}>
            <cylinderGeometry args={[0.42, 0.42, 0.07, 48]} />
            <meshStandardMaterial color={accent} metalness={0.9} roughness={0.42} envMapIntensity={1.5} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

/** Damped pointer parallax, scroll-linked dolly out of the hero, and a view offset that keeps the bars right of the title. */
function Rig({ active }: { active: boolean }) {
  const { camera, size, invalidate } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => { pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1; pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1; };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  const aspect = size.width / size.height;
  // Portrait needs a much longer lens distance to fit the bars' width.
  const baseZ = aspect >= 1.2 ? 12.5 : Math.min(34, 15.7 / aspect);
  useEffect(() => {
    // Wide: push the scene right of the title. Portrait: lift it into the empty upper half above the title.
    if (aspect >= 1.2) camera.setViewOffset(size.width, size.height, -size.width * 0.13, 0, size.width, size.height);
    else camera.setViewOffset(size.width, size.height, 0, size.height * 0.27, size.width, size.height);
    invalidate();
  }, [camera, size, aspect, invalidate]);
  useFrame(({ camera: cam }, dt) => {
    if (!active) return;
    const dolly = MathUtils.clamp(window.scrollY / window.innerHeight, 0, 1);
    cam.position.set(
      MathUtils.damp(cam.position.x, 2.4 + pointer.current.x * 0.7, 3, dt),
      MathUtils.damp(cam.position.y, 1.3 - pointer.current.y * 0.35 - dolly * 0.5, 3, dt),
      MathUtils.damp(cam.position.z, baseZ - dolly * 2.6, 3, dt),
    );
    cam.lookAt(2.6, 1.7, 0);
  });
  return null;
}

/** "Rising Ledger": glass bar columns on a reflective floor with brass coins in the air. Colours come from CSS tokens. */
export default function HeroScene({ active, onReady }: { active: boolean; onReady: () => void }) {
  const c = useMemo(() => ({ bg: token("--bg"), surface: token("--surface"), accent: token("--accent"), cyan: token("--color-club-cyan") }), []);
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 2]}
      camera={{ position: [2.4, 1.3, 12.5], fov: 32, near: 0.5, far: 90 }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
      onCreated={() => requestAnimationFrame(onReady)}
      className="!pointer-events-none"
    >
      <color attach="background" args={[c.bg]} />
      <fog attach="fog" args={[c.bg, 14, 60]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[8, 5, -4]} intensity={3.2} color={c.accent} />
      <pointLight position={[-6, 3, 5]} intensity={60} color={c.cyan} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={9} color={c.accent} position={[8, 3, -1]} rotation-y={-Math.PI / 2.2} scale={[9, 6, 1]} />
        <Lightformer form="rect" intensity={2} color={c.cyan} position={[-8, 2, 2]} rotation-y={Math.PI / 2.2} scale={[7, 5, 1]} />
        <Lightformer form="rect" intensity={3.2} color="white" position={[0, 9, 3]} rotation-x={Math.PI / 2} scale={[14, 6, 1]} />
        <Lightformer form="rect" intensity={2} color="white" position={[2, 2.5, 12]} scale={[16, 3.5, 1]} />
        <Lightformer form="ring" intensity={4} color={c.accent} position={[-3, 4, 7]} scale={2.5} />
      </Environment>
      <Bars glass={c.surface} accent={c.accent} />
      <Coins accent={c.accent} />
      <mesh rotation-x={-Math.PI / 2} position={[3, 0, 10]}>
        <planeGeometry args={[90, 70]} />
        <MeshReflectorMaterial blur={[220, 70]} resolution={512} mixBlur={1} mixStrength={26} mirror={0.65} roughness={0.85} depthScale={0.8} minDepthThreshold={0.4} maxDepthThreshold={1.3} color={c.bg} metalness={0.6} />
      </mesh>
      <Rig active={active} />
    </Canvas>
  );
}
