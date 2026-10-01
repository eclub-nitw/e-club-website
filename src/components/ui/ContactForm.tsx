"use client";
import { useId, useState } from "react";
import { z } from "zod";
import { Toast } from "./Toast";

const schema = z.object({
  name: z.string().trim().min(2, "Tell us your name."),
  email: z.email("Enter an email address we can reply to."),
  message: z.string().trim().min(10, "A sentence or two, please (at least 10 characters)."),
  age: z.literal("on", "Please confirm you are 18 or older."),
});
type Field = "name" | "email" | "message" | "age";
type Status = "idle" | "sending" | "sent" | "error";

const input = "peer block min-h-14 w-full rounded-[2px] border border-line bg-transparent px-4 pb-2 pt-6 text-base text-fg placeholder-transparent transition-colors hover:border-fg/40 focus-visible:border-accent disabled:opacity-50 aria-[invalid=true]:border-accent-text";
const floating = "pointer-events-none absolute left-4 top-4 origin-left text-base text-muted transition-transform duration-200 peer-focus:-translate-y-3 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75 motion-reduce:transition-none";

/**
 * Contact form UI. There is no backend yet (it is a later phase), and the site stores nothing: on submit the fields are validated,
 * then the visitor's own email app opens with the message pre-filled, so nothing is sent or kept by us. Honeypot included for when a
 * real endpoint is added. 18+ consent is required before anything is composed.
 */
export function ContactForm({ to, subject }: { to: string; subject: string }) {
  const uid = useId();
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [toast, setToast] = useState<string | null>(null);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("company")) return; // honeypot: real people never see this field
    const parsed = schema.safeParse({ name: fd.get("name"), email: fd.get("email"), message: fd.get("message"), age: fd.get("age") });
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as Field] ??= issue.message;
      setErrors(next); setStatus("error"); setToast("Some fields need another look.");
      (e.currentTarget.querySelector("[aria-invalid=true]") as HTMLElement | null)?.focus();
      return;
    }
    setErrors({}); setStatus("sending");
    const { name, email, message } = parsed.data;
    const body = `${message}\n\n${name}\n${email}`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.setTimeout(() => { setStatus("sent"); setToast("Your email app should have opened. If not, write to us directly."); }, 400);
  };

  const err = (f: Field) => errors[f];
  const field = (f: "name" | "email", label: string, type: string, autoComplete: string) => (
    <div className="relative">
      <input id={`${uid}-${f}`} name={f} type={type} autoComplete={autoComplete} placeholder=" " disabled={status === "sending"} aria-invalid={!!err(f)} aria-describedby={err(f) ? `${uid}-${f}-e` : undefined} className={input} />
      <label htmlFor={`${uid}-${f}`} className={floating}>{label}</label>
      {err(f) && <p id={`${uid}-${f}-e`} className="mt-2 text-sm text-accent-text">{err(f)}</p>}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="grid max-w-2xl gap-5">
      <div className="grid gap-5 sm:grid-cols-2">{field("name", "Your name", "text", "name")}{field("email", "Your email", "email", "email")}</div>
      <div className="relative">
        <textarea id={`${uid}-message`} name="message" rows={5} placeholder=" " disabled={status === "sending"} aria-invalid={!!err("message")} aria-describedby={err("message") ? `${uid}-message-e` : undefined} className={`${input} min-h-40 resize-y`} />
        <label htmlFor={`${uid}-message`} className={floating}>Your message</label>
        {err("message") && <p id={`${uid}-message-e`} className="mt-2 text-sm text-accent-text">{err("message")}</p>}
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
      <div>
        <label className="flex min-h-11 cursor-pointer items-start gap-3 text-base">
          <input type="checkbox" name="age" aria-invalid={!!err("age")} aria-describedby={err("age") ? `${uid}-age-e` : undefined} className="mt-1 size-5 accent-[var(--accent)]" />
          <span className="t-body">I am 18 or older.</span>
        </label>
        {err("age") && <p id={`${uid}-age-e`} className="mt-1 text-sm text-accent-text">{err("age")}</p>}
      </div>
      <p className="t-label text-muted">We do not store what you type here. Sending opens your email app.</p>
      <div>
        <button type="submit" disabled={status === "sending"} className="group relative isolate inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-[2px] border border-club-paper/25 bg-club-ink px-6 t-ui text-club-paper transition-colors duration-300 hover:text-club-ink focus-visible:text-club-ink disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none">
          <span aria-hidden="true" className="absolute inset-0 -z-10 -translate-x-full bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0 group-focus-visible:translate-x-0 motion-reduce:transition-none" />
          {status === "sending" ? "Opening your email app…" : status === "sent" ? "Send again" : "Send message"}
        </button>
      </div>
      {toast && <Toast message={toast} tone={status === "error" ? "error" : "ok"} onDone={() => setToast(null)} />}
    </form>
  );
}
