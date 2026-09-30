"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { canRunWebGL } from "@/lib/webgl";
import vortexArt from "../../../public/images/generated/vortex.webp";
import coinPoster from "../../../public/images/generated/coin-poster.webp";

const VortexScene = dynamic(() => import("./VortexScene"), { ssr: false });
const FALL_MS = 550; // "fall into the vortex" must stay under 600 ms

/**
 * The flagship portal: a link into the event page. Live particles when the device qualifies (mounted only when near
 * the viewport, after idle); otherwise the still artwork, slowly turning unless reduced motion is on.
 * Click plays the dive (camera zoom + fade to the page colour), then navigates. Without JS it is a plain link.
 */
export function VortexPortal({ href, label }: { href: string; label: string }) {
  const router = useRouter();
  const box = useRef<HTMLAnchorElement>(null);
  const [mount, setMount] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const [near, setNear] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [hover, setHover] = useState(false);
  const [falling, setFalling] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { setOnScreen(e.isIntersecting); if (e.isIntersecting) setNear(true); }, { rootMargin: "200px" });
    io.observe(el);
    const vis = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", vis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", vis); };
  }, []);

  // Create the context early, while the visitor is still on the hero (and paused off screen), so the shader
  // compile never lands in the middle of a scroll. Still only after load + idle, and never on devices that get the poster.
  useEffect(() => {
    if (!canRunWebGL()) return;
    let cancelled = false;
    let timer = 0;
    const go = () => { timer = window.setTimeout(() => { if (!cancelled) setMount(true); }, 2500); };
    if (document.readyState === "complete") go(); else window.addEventListener("load", go, { once: true });
    return () => { cancelled = true; clearTimeout(timer); window.removeEventListener("load", go); };
  }, []);

  const dive = (e: React.MouseEvent) => {
    if (!drawn || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // no live scene or a modified click: plain navigation
    e.preventDefault();
    setFalling(true);
    window.setTimeout(() => router.push(href), FALL_MS);
  };

  return (
    <Link
      ref={box} href={href} onClick={dive} aria-label={label}
      onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)}
      className="group relative isolate block aspect-square w-full max-w-[34rem] overflow-hidden rounded-[2px] border border-line bg-bg"
    >
      {/* Requested only once the portal is near the viewport, so it never competes with the hero for bandwidth. */}
      {near && <Image src={vortexArt} alt="" fill sizes="(min-width: 1024px) 34rem, 92vw" placeholder="blur" className={`vortex-still object-cover transition-opacity duration-500 ${drawn ? "opacity-0" : "opacity-100"}`} />}
      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-500 ${drawn ? "opacity-0" : "opacity-100"}`}>
        {near && <Image src={coinPoster} alt="" sizes="14rem" placeholder="empty" className="h-auto w-[38%]" />}
      </div>
      <div aria-hidden="true" data-portal={mount ? (drawn ? "live" : "loading") : "still"} className={`absolute inset-0 transition-opacity duration-500 ${drawn ? "opacity-100" : "opacity-0"}`}>
        {mount && <VortexScene active={onScreen && tabVisible} hover={hover} falling={falling} onReady={() => setDrawn(true)} />}
      </div>
      <span aria-hidden="true" className={`pointer-events-none absolute inset-0 z-10 bg-bg transition-opacity ease-in ${falling ? "opacity-100" : "opacity-0"}`} style={{ transitionDuration: `${FALL_MS}ms` }} />
      <span className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between bg-gradient-to-t from-bg to-transparent px-5 pb-4 pt-12 font-mono text-xs uppercase tracking-[0.08em]">
        <span>Enter the vortex</span>
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">→</span>
      </span>
    </Link>
  );
}
