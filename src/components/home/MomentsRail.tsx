import { copy } from "@/data/copy";
import { withRole } from "@/lib/photos";
import { Photo } from "@/components/ui/Photo";
import { EventsRail } from "@/components/ui/EventsRail";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Home scene 5. Horizontal strip of photographs, each captioned with event and date, with short unsigned club-voice lines between them.
 * Desktop: pinned and scrubbed by scroll (EventsRail). Touch and reduced motion: native swipe with scroll snap.
 */
export function MomentsRail() {
  const shots = withRole("moments");
  const items: React.ReactNode[] = [];
  shots.forEach((p, i) => {
    const portrait = p.h > p.w;
    items.push(
      <li key={p.id} className={`shrink-0 snap-start ${portrait ? "w-[62vw] sm:w-[20rem]" : "w-[82vw] sm:w-[30rem]"} ${i % 2 ? "lg:mt-16" : ""}`}>
        <Reveal><Photo photo={p} aspect={portrait ? "4/5" : "3/2"} sizes="(min-width: 640px) 30rem, 82vw" /></Reveal>
      </li>,
    );
    if (i % 3 === 2 && copy.quotes[Math.floor(i / 3)]) {
      items.push(
        <li key={`q${i}`} className="flex w-[78vw] shrink-0 snap-start flex-col justify-center border-l border-line pl-6 sm:w-[24rem]">
          <p className="font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-extrabold uppercase leading-[0.98] tracking-tight">{copy.quotes[Math.floor(i / 3)]}</p>
          <p className="label mt-5 text-accent">E-Club</p>
        </li>,
      );
    }
  });
  return <div data-cursor="SCROLL"><EventsRail>{items}</EventsRail></div>;
}
