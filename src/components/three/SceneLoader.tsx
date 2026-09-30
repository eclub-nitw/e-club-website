"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { canRunWebGL } from "@/lib/webgl";

// three, R3F and drei live in this lazy chunk, fetched only after load + idle and only when the device qualifies.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

/**
 * Mounts the live hero scene over the poster. The poster is the LCP element and stays as the
 * fallback for reduced motion, weak devices and no-WebGL. The scene fades in once its first frame is drawn,
 * and rendering pauses when the hero is off screen or the tab is hidden.
 */
export function SceneLoader() {
  const box = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    if (!canRunWebGL()) return;
    let cancelled = false;
    const go = () => {
      const start = () => { if (!cancelled) { setCoarse(window.matchMedia("(pointer: coarse)").matches); setMount(true); } };
      if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(start, { timeout: 3000 });
      else window.setTimeout(start, 500);
    };
    if (document.readyState === "complete") go(); else window.addEventListener("load", go, { once: true });
    return () => { cancelled = true; window.removeEventListener("load", go); };
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    const vis = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", vis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", vis); };
  }, []);

  return (
    <div
      ref={box} aria-hidden="true" data-scene={mount ? (drawn ? "live" : "loading") : "poster"}
      className={`absolute inset-0 transition-opacity duration-700 ease-[var(--ease-out-expo)] ${drawn ? "opacity-100" : "opacity-0"}`}
    >
      {mount && <HeroScene active={onScreen && tabVisible} coarse={coarse} onReady={() => setDrawn(true)} />}
    </div>
  );
}
