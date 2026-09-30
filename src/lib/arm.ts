/**
 * When to build a GSAP scroll scene. Fine pointers (desktop): at idle after load, so the setup work never lands in the
 * middle of a scroll. Touch: only once the element is about to be reached, so a phone that never scrolls there never
 * fetches GSAP. Returns a cleanup function.
 */
export function armWhenReady(el: Element, arm: () => void): () => void {
  if (window.matchMedia("(pointer: fine)").matches) {
    let cancelled = false;
    let handle = 0;
    const idle = typeof window.requestIdleCallback === "function";
    const go = () => {
      const run = () => { if (!cancelled) arm(); };
      handle = idle ? window.requestIdleCallback(run, { timeout: 4000 }) : window.setTimeout(run, 400);
    };
    if (document.readyState === "complete") go(); else window.addEventListener("load", go, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", go);
      if (idle) window.cancelIdleCallback(handle); else window.clearTimeout(handle);
    };
  }
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); arm(); } }, { rootMargin: "100px 0px" });
  io.observe(el);
  return () => io.disconnect();
}
