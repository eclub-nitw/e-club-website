import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Body, Display, Label } from "@/components/ui/Type";

/** The 404 is a slide too: "Slide not found". */
export default function NotFound() {
  return (
    <div data-section="404 — Slide not found" className="bg-bg pb-32 pt-44 text-fg">
      <Container>
        <Label className="border-t border-line pt-4">404 — Slide not found</Label>
        <h1 className="sr-only">Slide not found</h1>
        <Display className="mt-6" aria-hidden="true">404</Display>
        <Body className="mt-8">That address is not in this deck. It may have moved, or never existed.</Body>
        <div className="mt-8"><Button href="/">Back to the cover</Button></div>
      </Container>
    </div>
  );
}
