"use client";
import { useId, useState } from "react";
import { LIMITS, validateContact, type Field, type Kind } from "@/lib/contact-schema";
import { Toast } from "./Toast";

type Status = "idle" | "sending" | "sent" | "mailto" | "error";

const input = "t-body peer block min-h-14 w-full max-w-none rounded-[2px] border border-line bg-transparent px-4 pb-2 pt-6 text-fg placeholder-transparent transition-colors hover:border-fg/40 focus-visible:border-accent disabled:opacity-50 aria-[invalid=true]:border-accent-text";
const floating = "t-ui pointer-events-none absolute left-4 top-4 origin-left text-muted transition-transform duration-200 peer-focus:-translate-y-3 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75 motion-reduce:transition-none";

/**
 * Contact and join form. The message goes to our own API (/api/contact: validated again on the server, rate limited, same-origin, honeypot,
 * stored in Firestore). If storage is not configured or unreachable the API answers 503 and the form opens the visitor's own email app with the
 * message pre-filled instead, and says so, so a message is never lost. 18+ confirmation is required before anything is sent.
 */
export function ContactForm({ to, subject, kind = "contact" }: { to: string; subject: string; kind?: Kind }) {
  const uid = useId();
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [toast, setToast] = useState<{ text: string; tone: "ok" | "error" } | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("company")) return; // honeypot: real people never see this field, so a filled one is a bot: send nothing
    const parsed = validateContact({ kind, name: fd.get("name"), email: fd.get("email"), message: fd.get("message"), age: fd.get("age") });
    if (!parsed.ok) {
      setErrors(parsed.errors); setStatus("error"); setToast({ text: "Some fields need another look.", tone: "error" });
      requestAnimationFrame(() => (form.querySelector("[aria-invalid=true]") as HTMLElement | null)?.focus());
      return;
    }
    setErrors({}); setStatus("sending");
    const { name, email, message } = parsed.data;
    const mailto = () => {
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${message}\n\n${name}\n${email}`)}`;
      setStatus("mailto"); setToast({ text: "Our message service is unavailable, so your email app should have opened. If not, write to us directly.", tone: "ok" });
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "content-type": "application/json" }, signal: AbortSignal.timeout(12000),
        body: JSON.stringify({ kind, name, email, message, age: true, company: "" }),
      });
      if (res.ok) { setStatus("sent"); setToast({ text: "Thanks. We have your message and will reply by email.", tone: "ok" }); form.reset(); return; }
      if (res.status === 429) { setStatus("error"); setToast({ text: "Too many messages from this connection. Please try again in a few minutes.", tone: "error" }); return; }
      if (res.status === 400) {
        const j = (await res.json().catch(() => ({}))) as { fields?: Partial<Record<Field, string>> };
        setErrors(j.fields ?? {}); setStatus("error"); setToast({ text: "Some fields need another look.", tone: "error" }); return;
      }
      mailto(); // 503 and anything unexpected: never lose the message
    } catch { mailto(); }
  };

  const err = (f: Field) => errors[f];
  const busy = status === "sending";
  const field = (f: "name" | "email", label: string, type: string, autoComplete: string, max: number) => (
    <div className="relative">
      <input id={`${uid}-${f}`} name={f} type={type} autoComplete={autoComplete} maxLength={max} placeholder=" " disabled={busy} aria-invalid={!!err(f)} aria-describedby={err(f) ? `${uid}-${f}-e` : undefined} className={input} />
      <label htmlFor={`${uid}-${f}`} className={floating}>{label}</label>
      {err(f) && <p id={`${uid}-${f}-e`} className="t-ui mt-2 text-accent-text">{err(f)}</p>}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="grid max-w-2xl gap-5">
      <div className="grid gap-5 sm:grid-cols-2">{field("name", "Your name", "text", "name", LIMITS.name)}{field("email", "Your email", "email", "email", LIMITS.email)}</div>
      <div className="relative">
        <textarea id={`${uid}-message`} name="message" rows={5} maxLength={LIMITS.message} placeholder=" " disabled={busy} aria-invalid={!!err("message")} aria-describedby={err("message") ? `${uid}-message-e` : undefined} className={`${input} min-h-40 resize-y`} />
        <label htmlFor={`${uid}-message`} className={floating}>Your message</label>
        {err("message") && <p id={`${uid}-message-e`} className="t-ui mt-2 text-accent-text">{err("message")}</p>}
      </div>
      <div aria-hidden="true" className="t-ui absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
      <div>
        <label className="flex min-h-11 cursor-pointer items-start gap-3">
          <input type="checkbox" name="age" aria-invalid={!!err("age")} aria-describedby={err("age") ? `${uid}-age-e` : undefined} className="mt-1 size-5 accent-[var(--accent)]" />
          <span className="t-body">I am 18 or older.</span>
        </label>
        {err("age") && <p id={`${uid}-age-e`} className="t-ui mt-1 text-accent-text">{err("age")}</p>}
      </div>
      <p className="t-label text-muted">We use your details only to reply to you.</p>
      <div>
        <button type="submit" disabled={busy} className="group relative isolate inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-[2px] border border-club-paper/25 bg-club-ink px-6 t-ui text-club-paper transition-colors duration-300 hover:text-club-ink focus-visible:text-club-ink disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none">
          <span aria-hidden="true" className="absolute inset-0 -z-10 -translate-x-full bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0 group-focus-visible:translate-x-0 motion-reduce:transition-none" />
          {busy ? "Sending…" : status === "sent" || status === "mailto" ? "Send another" : "Send message"}
        </button>
      </div>
      {toast && <Toast message={toast.text} tone={toast.tone} onDone={() => setToast(null)} />}
    </form>
  );
}
