/**
 * Chrome compiles a GPU shader the first time each kind of effect is drawn, and on Windows (ANGLE/D3D11) that is a 50-250 ms stall that lands in the
 * middle of a scroll (traced: FinishPaintRenderPass + ANGLE worker tasks the first time the tilted map plane appeared). These near-invisible 3 px
 * elements draw each effect the site uses once, at load, while the page is idle. They are decorative, hidden from assistive tech, and cost nothing after.
 */
export function ShaderWarm() {
  const tiny = "pointer-events-none fixed left-0 top-0 size-[3px] opacity-[0.02]";
  return (
    <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-0 size-[3px] overflow-hidden">
      <div className={tiny} style={{ transform: "perspective(400px) rotateX(20deg) rotateZ(-1deg)", willChange: "transform", background: "var(--color-club-cyan)" }} />
      <div className={tiny} style={{ clipPath: "circle(40%)", background: "radial-gradient(circle, var(--accent), transparent)" }} />
      <div className={tiny} style={{ backdropFilter: "blur(6px)", background: "color-mix(in oklab, var(--bg) 90%, transparent)" }} />
      <div className={tiny} style={{ mixBlendMode: "overlay", background: "var(--fg)" }} />
      <svg width="3" height="3" viewBox="0 0 10 10" className={tiny}><defs><clipPath id="warm-clip"><path d="M0 0H10L5 10Z" /></clipPath></defs><g clipPath="url(#warm-clip)"><circle cx="5" cy="5" r="4" fill="none" stroke="var(--color-club-cyan)" strokeWidth="2" vectorEffect="non-scaling-stroke" /></g></svg>
    </div>
  );
}
