import { posterBlur } from "@/data/poster-blur";
import { shownPosters } from "@/data/posters";
import { Container } from "@/components/ui/Container";
import { H2, Label } from "@/components/ui/Type";

/**
 * The club's own posters for this competition, four in a symmetric grid: one column below 560px, two from there up. Every poster sits in the same 5:7
 * frame on a mat with object-contain, so none is cropped and none sits off-centre. The poster's words are real text under each (a native details).
 */
export function Posters({ num }: { num: string }) {
  const list = shownPosters("venture-vortex-2026");
  if (list.length === 0) return null;
  return (
    <section id="posters" data-section={`${num} — Posters`} aria-labelledby="posters-h" className="bg-surface py-20 md:py-28">
      <Container>
        <header className="mb-10 md:mb-14">
          <Label className="border-t border-line pt-4">{num} — Posters</Label>
          <H2 id="posters-h" className="mt-6 max-w-[22ch]">Our own flyers.</H2>
        </header>
        <ul className="mx-auto grid max-w-[56rem] gap-[clamp(16px,2vw,32px)] min-[560px]:grid-cols-2">
          {list.map((p) => (
            <li key={p.slug}>
              <div className="aspect-[5/7] overflow-hidden rounded-[2px] border border-line bg-bg">
                <picture>
                  <source type="image/avif" srcSet={`/images/posters/${p.slug}-640.avif 640w, /images/posters/${p.slug}-1024.avif 1024w`} sizes="(min-width: 560px) 28rem, 90vw" />
                  <img src={`/images/posters/${p.slug}-640.webp`} srcSet={`/images/posters/${p.slug}-640.webp 640w, /images/posters/${p.slug}-1024.webp 1024w`} sizes="(min-width: 560px) 28rem, 90vw"
                    alt={p.alt} width={640} height={Math.round((640 * p.h) / p.w)} loading="lazy" decoding="async" className="size-full object-contain"
                    style={{ backgroundImage: `url(${posterBlur[p.slug]})`, backgroundSize: "cover" }} />
                </picture>
              </div>
              <Label className="mt-4">{p.title}</Label>
              <details className="mt-2">
                <summary className="t-ui inline-flex min-h-11 cursor-pointer items-center underline underline-offset-4">Poster text</summary>
                <ul className="mt-2 space-y-2">{p.text.map((t) => <li key={t} className="t-body">{t}</li>)}</ul>
              </details>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
