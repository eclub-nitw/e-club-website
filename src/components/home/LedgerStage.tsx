"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { canRunWebGL } from "@/lib/webgl";
import { whenScrollQuiet } from "@/lib/quiet";

const RisingLedger = dynamic(() => import("./RisingLedger"), { ssr: false });

/**
 * Mounts the live Rising Ledger over the cover poster. Only desktop devices that pass the capability test mount it, and only after
 * load + idle, so the poster stays the LCP element and nothing competes with first paint. Everyone else keeps the poster.
 * `data-live` on the section fades the poster back to atmosphere once the first frame has drawn.
 */
export function LedgerStage() {
  const box = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const grow = useRef(0); // 0..1 as the hero scrolls away; the bars grow with it
  const [mount, setMount] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches || !canRunWebGL()) return; // the live composition is the wide one
    let cancelled = false, timer = 0;
    const go = () => { timer = window.setTimeout(() => { if (!cancelled) setEligible(true); }, 1200); };
    if (document.readyState === "complete") go(); else window.addEventListener("load", go, { once: true });
    return () => { cancelled = true; clearTimeout(timer); window.removeEventListener("load", go); };
  }, []);

  useEffect(() => {
    const el = box.current, host = el?.closest("section");
    if (!el || !host) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(host);
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer.current = { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: ((e.clientY - r.top) / r.height) * 2 - 1 };
    };
    const vis = () => setTabVisible(document.visibilityState === "visible");
    const scroll = () => { const r = host.getBoundingClientRect(); grow.current = Math.min(1, Math.max(0, -r.top / r.height)); };
    window.addEventListener("scroll", scroll, { passive: true });
    host.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", vis);
    return () => { io.disconnect(); host.removeEventListener("pointermove", move); window.removeEventListener("scroll", scroll); document.removeEventListener("visibilitychange", vis); };
  }, []);

  // One canvas alive at a time: leaving the hero for good tears the scene down (the poster returns); coming back remounts it.
  useEffect(() => {
    if (!eligible) return;
    if (onScreen) { const id = requestAnimationFrame(() => setMount(true)); return () => cancelAnimationFrame(id); }
    let cancel = () => {};
    const t = window.setTimeout(() => { cancel = whenScrollQuiet(() => { setMount(false); box.current?.closest("section")?.removeAttribute("data-live"); }); }, 2500);
    return () => { clearTimeout(t); cancel(); };
  }, [eligible, onScreen]);

  const ready = () => box.current?.closest("section")?.setAttribute("data-live", "");
  return (
    <div ref={box} aria-hidden="true" data-scene={mount ? "live" : "poster"} className="pointer-events-none absolute inset-0 -z-10">
      {mount && <RisingLedger pointer={pointer} grow={grow} active={onScreen && tabVisible} onReady={ready} />}
    </div>
  );
}
