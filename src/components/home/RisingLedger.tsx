"use client";
/* eslint-disable react-hooks/immutability -- the three.js scene graph and camera are mutable by design; every write here is the documented way to drive them */
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { BackSide, Color, type DirectionalLight, DoubleSide, EquirectangularReflectionMapping, MathUtils, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, ShadowMaterial, type Group, type Object3D } from "three";

const BARS = "/models/rising-ledger.glb"; // 7 beveled ink bars + brass caps, modelled in Blender, KHR_mesh_quantization only (no decoder: CSP forbids wasm-unsafe-eval)
const COIN = "/models/ledger-coin.glb";
const HDRI = "/models/studio-256.hdr"; // Poly Haven "Ferndale Studio 08", CC0, resampled to 256x128 (see docs/ASSETS.md)
const RISE_MS = 900, STAGGER_MS = 70;

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

type Pointer = { current: { x: number; y: number } };
type Grow = { current: number };

/** Studio reflections from a tiny HDRI; the scene itself stays transparent so the page ink shows through. */
function Studio() {
  const { gl, scene } = useThree();
  const tex = useLoader(RGBELoader, HDRI);
  useEffect(() => {
    tex.mapping = EquirectangularReflectionMapping;
    scene.environment = tex; scene.environmentIntensity = 1.15;
    return () => { scene.environment = null; };
  }, [tex, scene, gl]);
  return null;
}

/** The bars rise from the floor one after another, each pair (body + cap) scaling about the floor so cap and body stay joined. */
function Bars({ grow, pointer }: { grow: Grow; pointer: Pointer }) {
  const { scene } = useLoader(GLTFLoader, BARS);
  const mirror = useMemo(() => {
    const m = scene.clone(true);
    m.traverse((o: Object3D) => {
      if (!(o instanceof Mesh)) return;
      const src = o.material as MeshStandardMaterial;
      const c = src.clone(); c.transparent = true; c.opacity = 0.05; c.depthWrite = false; c.side = BackSide;
      o.material = c; o.castShadow = false;
    });
    m.scale.y = -1;
    return m;
  }, [scene]);
  const pairs = useMemo(() => {
    const out: { live: Object3D[]; ghost: Object3D[]; i: number }[] = [];
    for (let i = 0; i < 7; i++) {
      // quantisation puts a dequantisation scale AND translation on every node, so scaling about the floor means scaling both y-scale and y-position
      const pick = (root: Object3D) => [root.getObjectByName(`Bar${i}`), root.getObjectByName(`Cap${i}`)].filter((o): o is Object3D => !!o).map((o) => { o.userData.sy = o.scale.y; o.userData.ty = o.position.y; return o; });
      out.push({ live: pick(scene), ghost: pick(mirror), i });
    }
    return out;
  }, [scene, mirror]);
  const t0 = useRef<number | null>(null);

  useEffect(() => {
    scene.traverse((o) => {
      if (!(o instanceof Mesh)) return;
      o.castShadow = true; o.receiveShadow = false;
      const m = o.material as MeshPhysicalMaterial;
      m.anisotropy = 0; m.clearcoat = 0; m.sheen = 0; // the Blender brush maps to a smeared highlight that blows out the caps; keep plain PBR
      if (m.name === "InkMatte") { m.color.set("#2a5963"); m.metalness = 0.15; m.roughness = 0.5; } // ink body: lifted so the front reads teal, not black
      else { m.color.set("#e08a2e"); m.metalness = 0.5; m.roughness = 0.45; m.envMapIntensity = 0.6; } // brass cap
    });
    for (const p of pairs) for (const o of [...p.live, ...p.ghost]) { o.scale.y = o.userData.sy * 0.001; o.position.y = o.userData.ty * 0.001; }
  }, [scene, pairs]);

  useFrame(({ clock }, dt) => {
    if (t0.current === null) t0.current = clock.elapsedTime * 1000;
    const now = clock.elapsedTime * 1000 - t0.current;
    for (const p of pairs) {
      // bars also grow with the page scroll (up to +16% as the hero leaves)
      const s = Math.max(0.001, easeOutExpo(MathUtils.clamp((now - p.i * STAGGER_MS) / RISE_MS, 0, 1))) * (1 + 0.16 * grow.current);
      for (const o of [...p.live, ...p.ghost]) { o.scale.y = o.userData.sy * s; o.position.y = o.userData.ty * s; }
    }
  });
  return <><primitive object={scene} /><primitive object={mirror} /></>;
}

type CoinSpec = { pos: [number, number, number]; rot: [number, number, number]; scale: number; spin?: number };
// Same placements as the Blender poster (x, y-up, z toward the camera): one standing at the foot of the tallest bar, one lying on a cap, two in the air.
const COINS: CoinSpec[] = [
  { pos: [2.6, 0.5, 2.4], rot: [0, -0.38, 0], scale: 0.5 },
  { pos: [0, 2.19, 0], rot: [-1.45, 0.3, 0], scale: 0.3 },
  { pos: [-0.35, 2.9, 0.6], rot: [1.2, 0.4, 0.3], scale: 0.34, spin: 0.6 },
  { pos: [2.0, 3.3, 1.0], rot: [2.0, -0.3, -0.5], scale: 0.26, spin: -0.5 },
];

function Coins() {
  const { scene } = useLoader(GLTFLoader, COIN);
  const refs = useRef<Group[]>([]);
  const clones = useMemo(() => COINS.map(() => scene.clone(true)), [scene]);
  useFrame(({ clock }) => {
    COINS.forEach((c, i) => {
      const g = refs.current[i]; if (!g) return;
      const k = easeOutExpo(MathUtils.clamp((clock.elapsedTime * 1000 - 500 - i * 120) / 800, 0, 1));
      g.scale.setScalar(Math.max(0.001, c.scale * k));
      if (c.spin) g.rotation.y = c.rot[1] + clock.elapsedTime * c.spin;
      if (c.pos[1] > 2.5) g.position.y = c.pos[1] + Math.sin(clock.elapsedTime * 0.9 + i) * 0.06;
    });
  });
  return <>{COINS.map((c, i) => (
    <group key={i} ref={(g) => { if (g) refs.current[i] = g; }} position={c.pos} rotation={c.rot}><primitive object={clones[i]} /></group>
  ))}</>;
}

/** Camera matches the Blender poster (35 mm, shifted so the scene sits right of the copy) and drifts a little with the pointer. */
function Rig({ pointer, width, height }: { pointer: Pointer; width: number; height: number }) {
  const { camera } = useThree();
  const base = useMemo(() => ({ x: -1.6, y: 2.6, z: 15.6 }), []);
  useEffect(() => {
    const cam = camera as import("three").PerspectiveCamera;
    cam.fov = 42; cam.aspect = width / height;
    cam.setViewOffset(width, height, -0.2 * width, 0.06 * height, width, height);
    cam.updateProjectionMatrix();
  }, [camera, width, height]);
  useFrame((_, dt) => {
    camera.position.x = MathUtils.damp(camera.position.x, base.x + pointer.current.x * 0.9, 2.5, dt);
    camera.position.y = MathUtils.damp(camera.position.y, base.y - pointer.current.y * 0.45, 2.5, dt);
    camera.position.z = base.z;
    camera.lookAt(0.1, 1.5, 0);
  });
  return null;
}

/** A slow warm light that travels across the bars: the highlight on the brass caps moves, so the scene never reads as a still. */
function Sweep() {
  const ref = useRef<DirectionalLight>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.position.set(Math.sin(t * 0.32) * 9, 4 + Math.cos(t * 0.21) * 1.2, 6);
  });
  return <directionalLight ref={ref} intensity={0.9} color={new Color("#ffd9a8")} />;
}

function Lights() {
  return (
    <>
      <Sweep />
      <directionalLight position={[-2, 3.5, 9]} intensity={1.0} color={new Color("#ffe9cc")} />
      <directionalLight position={[-7, 2, 5]} intensity={0.8} color={new Color("#36afaa")} />
      <directionalLight position={[8, 1.5, 2.5]} intensity={1.5} color={new Color("#ed9038")} />
      <directionalLight position={[3, 5, -7]} intensity={0.6} color={new Color("#ed9038")} />
      <directionalLight position={[0, 8, 3]} intensity={0.1} color={new Color("#fff1dc")} castShadow shadow-mapSize={[1024, 1024]} shadow-radius={6} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-3} />
    </>
  );
}

/** Soft contact shadow under everything; the plane itself is invisible. */
function Floor() {
  const mat = useMemo(() => { const m = new ShadowMaterial({ opacity: 0.45 }); m.side = DoubleSide; return m; }, []);
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow material={mat}><planeGeometry args={[40, 40]} /></mesh>;
}

/** Fires once everything inside the Suspense boundary has loaded and mounted, so the poster never fades to an empty stage. */
function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => { const id = requestAnimationFrame(onReady); return () => cancelAnimationFrame(id); }, [onReady]);
  return null;
}

function Sized({ pointer }: { pointer: Pointer }) {
  const size = useThree((s) => s.size);
  return <Rig pointer={pointer} width={size.width} height={size.height} />;
}

/**
 * Chapter 01's live scene: the Rising Ledger. Transparent canvas over the Blender poster; once the assets have loaded the poster
 * fades out and the bars rise from the floor. DPR is capped at 1.5, the loop pauses off screen, one context only.
 */
export default function RisingLedger({ pointer, grow, active, onReady }: { pointer: Pointer; grow: Grow; active: boolean; onReady: () => void }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"} dpr={[1, 1.5]} shadows
      camera={{ position: [-1.6, 2.6, 15.6], fov: 42, near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      className="!pointer-events-none"
    >
      <Suspense fallback={null}>
        <Studio /><Lights /><Floor />
        <Bars grow={grow} pointer={pointer} /><Coins />
        <Sized pointer={pointer} />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
