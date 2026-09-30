/**
 * Signature element: a 2px accent line that draws itself down the left rail as the page scrolls.
 * CSS scroll-driven animation (transform only, zero JS). Browsers without `animation-timeline`
 * and reduced-motion visitors simply see the full line. See `.growth-line` in globals.css.
 */
export function GrowthLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-3 hidden w-[2px] bg-line lg:left-6 lg:block xl:left-10">
        <span className="growth-line absolute inset-0 origin-top bg-accent" />
      </div>
      {children}
    </div>
  );
}
