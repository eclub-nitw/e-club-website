import { Button, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="bg-bg pb-32 pt-44 text-fg">
      <Container>
        <p className="border-t border-line pt-4 font-mono text-xs uppercase tracking-[0.08em] text-muted">404</p>
        <h1 className="mt-6 font-display text-6xl font-semibold tracking-tight md:text-8xl">Page not found</h1>
        <p className="mt-6 max-w-[48ch] text-lg text-muted">That address is not in our ledger. It may have moved, or never existed.</p>
        <div className="mt-8"><Button href="/">Back to home</Button></div>
      </Container>
    </div>
  );
}
