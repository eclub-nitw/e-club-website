"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

/*
 * Decorative 3D "rising bars" (the growth motif from the club logo), built from CSS 3D boxes,
 * so there is no WebGL/three.js payload. Shading = per-face overlays on the token colours;
 * a pointer-driven spring tilts the whole scene. Transform + opacity only. Hidden from AT.
 * Bar heights are illustrative and carry no data.
 */
const BARS = [
  { h: 4, c: "var(--color-club-teal-deep)" },
  { h: 6.5, c: "var(--color-club-teal)" },
  { h: 9, c: "var(--color-club-teal)" },
  { h: 12, c: "var(--color-club-cyan)" },
  { h: 15.5, c: "var(--color-club-gold)" },
] as const;

const W = 3.4, D = 3.4, GAP = 1.1;
const sceneW = BARS.length * W + (BARS.length - 1) * GAP;

const face = "absolute overflow-hidden";
const gloss = "linear-gradient(115deg, rgb(255 255 255 / .28) 0%, rgb(255 255 255 / 0) 42%)";

function Bar({ h, c, i }: { h: number; c: string; i: number }) {
  return (
    <div
      className="relative [transform-style:preserve-3d] origin-bottom [animation:bar-rise_1000ms_var(--ease-out-expo)_both] motion-reduce:animate-none"
      style={{ width: `${W}em`, height: `${h}em`, animationDelay: `${300 + i * 90}ms`, "--c": c } as React.CSSProperties}
    >
      {/* contact shadow on the ground plane, cast away from the light */}
      <span aria-hidden className="absolute left-0 rounded-[2px] bg-club-ink/70 blur-[.55em]" style={{ width: `${W * 1.5}em`, height: `${D}em`, bottom: `${-D / 2}em`, transform: `rotateX(90deg) translate3d(${W * 0.55}em, 0, .05em)` }} />
      <span className={face} style={{ inset: 0, background: `${gloss}, var(--c)`, transform: `translateZ(${D / 2}em)`, boxShadow: "inset 0 0 0 1px rgb(255 255 255 / .16)" }} />
      <span className={face} style={{ inset: 0, background: "rgb(0 0 0 / .55)", transform: `rotateY(180deg) translateZ(${D / 2}em)` }} />
      <span className={face} style={{ left: "50%", marginLeft: `${-D / 2}em`, width: `${D}em`, top: 0, height: "100%", background: "linear-gradient(rgb(0 0 0 / .32), rgb(0 0 0 / .5)), var(--c)", transform: `rotateY(90deg) translateZ(${W / 2}em)` }} />
      <span className={face} style={{ left: "50%", marginLeft: `${-D / 2}em`, width: `${D}em`, top: 0, height: "100%", background: "linear-gradient(rgb(0 0 0 / .15), rgb(0 0 0 / .3)), var(--c)", transform: `rotateY(-90deg) translateZ(${W / 2}em)` }} />
      <span className={face} style={{ left: 0, width: "100%", top: "50%", marginTop: `${-D / 2}em`, height: `${D}em`, background: "linear-gradient(135deg, rgb(255 255 255 / .42), rgb(255 255 255 / .12)), var(--c)", transform: `rotateX(90deg) translateZ(${h / 2}em)`, boxShadow: "inset 0 0 0 1px rgb(255 255 255 / .3)" }} />
    </div>
  );
}

export function HeroBars() {
  const reduce = useReducedMotion();
  const px = useMotionValue(0), py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 70, damping: 16 }), sy = useSpring(py, { stiffness: 70, damping: 16 });
  const rotateY = useTransform(sx, [-1, 1], [-46, -16]);
  const rotateX = useTransform(sy, [-1, 1], [-34, -12]);

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, px, py]);

  return (
    <div aria-hidden="true" className="pointer-events-none relative select-none [perspective:1600px]" style={{ fontSize: "clamp(9px, 1.35vw, 18px)", width: `${sceneW + 6}em`, height: "24em" }}>
      <motion.div
        className="absolute bottom-[3em] left-1/2 flex items-end [transform-style:preserve-3d]"
        style={{ x: "-9em", rotateX: reduce ? -22 : rotateX, rotateY: reduce ? -31 : rotateY, gap: `${GAP}em`, width: `${sceneW}em`, marginLeft: `${-sceneW / 2}em` }}
      >
        {/* ground plane with a hairline grid */}
        <span
          className="absolute rounded-[2px] border border-club-paper/15 bg-club-deep/60"
          style={{ left: "-3em", right: "-3em", bottom: 0, height: "22em", transformOrigin: "bottom", transform: "rotateX(90deg) translateZ(0)", backgroundImage: "repeating-linear-gradient(0deg, rgb(245 241 230 / .1) 0 1px, transparent 1px 2.2em), repeating-linear-gradient(90deg, rgb(245 241 230 / .1) 0 1px, transparent 1px 2.2em)" }}
        />
        {BARS.map((b, i) => <Bar key={i} {...b} i={i} />)}
      </motion.div>
    </div>
  );
}
