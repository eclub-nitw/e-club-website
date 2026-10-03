"use client";
import { useState } from "react";

/** Copies the club address; the confirmation is announced through a polite live region and clears itself after three seconds. */
export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");
  const copy = async () => {
    try { await navigator.clipboard.writeText(email); setState("done"); } catch { setState("failed"); }
    setTimeout(() => setState("idle"), 3000);
  };
  return (
    <>
      <button type="button" onClick={copy} className="t-label inline-flex min-h-11 items-center underline underline-offset-4 hover:text-fg">Copy email</button>
      <span role="status" className="t-label text-muted">{state === "done" ? "Copied" : state === "failed" ? "Copy failed. Select the address instead." : ""}</span>
    </>
  );
}
