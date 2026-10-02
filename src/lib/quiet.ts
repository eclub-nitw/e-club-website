/** Runs `fn` once the page has not scrolled for `quietMs`, so heavy teardown (a WebGL context) never lands in the middle of a scroll. Returns a cancel function. */
export function whenScrollQuiet(fn: () => void, quietMs = 120): () => void {
  let last = performance.now(), timer = 0;
  const onScroll = () => { last = performance.now(); };
  const stop = () => { window.removeEventListener("scroll", onScroll); clearTimeout(timer); };
  const check = () => {
    if (performance.now() - last >= quietMs) { stop(); fn(); } else timer = window.setTimeout(check, quietMs);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  timer = window.setTimeout(check, quietMs);
  return stop;
}
