"use client";
import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

/** Pointer-driven 3D tilt (max 5deg) with a moving specular glare. Fine pointers only; static otherwise. */
export function Tilt({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const nx = useMotionValue(0), ny = useMotionValue(0);
  const sx = useSpring(nx, { stiffness: 160, damping: 20 }), sy = useSpring(ny, { stiffness: 160, damping: 20 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-5, 5]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5]);
  const glareX = useTransform(sx, [-0.5, 0.5], ["-30%", "30%"]);
  const glareY = useTransform(sy, [-0.5, 0.5], ["-30%", "30%"]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    nx.set((e.clientX - r.left) / r.width - 0.5);
    ny.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => { nx.set(0); ny.set(0); };

  return (
    <div className="[perspective:1200px]">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        whileHover={reduce ? undefined : { y: -4 }}
        transition={{ duration: 0.25 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`group relative overflow-hidden rounded-[2px] ${className}`}
      >
        {children}
        {!reduce && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -inset-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ x: glareX, y: glareY, background: "radial-gradient(closest-side, rgb(255 255 255 / .14), transparent)" }}
          />
        )}
      </motion.div>
    </div>
  );
}
