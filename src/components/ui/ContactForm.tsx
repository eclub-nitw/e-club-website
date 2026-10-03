"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/data/site";
import { EXTRA, LIMITS, TYPES, validateContact, type Field, type Type } from "@/lib/contact-schema";
import { Toast } from "./Toast";

type Status = "idle" | "sending" | "sent" | "mailto" | "error";

const TABS: Record<Type, { label: string; note: string; subject: string }> = {
  join: { label: "Join the club", note: "Tell us your branch and year", subject: "Join E-Club NIT Warangal" },
  query: { label: "Query", note: "About an event or the club", subject: "Question for E-Club NIT Warangal" },
  contact: { label: "Contact", note: "Anything else", subject: "Message from the E-Club website" },
  sponsor: { label: "Sponsor / Partnership", note: "Sponsors and collaborators", subject: "Partnership enquiry" },
};

const input = "t-body peer block min-h-14 w-full max-w-none rounded-[2px] border border-line bg-transparent px-4 pb-2 pt-6 text-fg placeholder-transparent transition-colors hover:border-fg/40 focus-visible:border-accent disabled:opacity-50 aria-[invalid=true]:border-accent-text";
const floating = "t-ui pointer-events-none absolute left-4 top-4 origin-left text-muted transition-transform duration-200 peer-focus:-translate-y-3 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75 motion-reduce:transition-none";

const fromHash = (): Type => { const h = window.location.hash.slice(1); return TYPES.find((t) => t === h) ?? "contact"; };

/**
 * The contact block: four tabs (an ARIA tablist; Left/Right/Home/End move between them, the URL hash #join #query #contact #sponsor selects one and
 * follows the choice) over one form whose fields depend on the tab. The message goes to our own API (/api/contact: validated again on the server,
 * rate limited, same-origin, honeypot, stored in Firestore). If storage is unavailable the form opens the visitor's own email app with the message
 * pre-filled and says so, so a message is never lost. There is no age checkbox (owner decision, see docs/LEGAL-REVIEW-NOTES.md).
 */
export function ContactForm({ to }: { to: string }) {
  const uid = useId();
  const [type, setType] = useState<Type>("contact");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [toast, setToast] = useState<{ text: string; tone: "ok" | "error" } | null>(null);
  const tabs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const sync = () => setType(fromHash());
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const choose = (t: Type, focus = false) => {
    setType(t); setErrors({}); setStatus("idle");
    history.replaceState(null, "", `#${t}`);
    if (focus) tabs.current[t]?.focus();
  };
  const onKey = (e: React.KeyboardEvent) => {
    const i = TYPES.indexOf(type);
    const to_ = e.key === "ArrowRight" ? TYPES[(i + 1) % TYPES.length] : e.key === "ArrowLeft" ? TYPES[(i + TYPES.length - 1) % TYPES.length] : e.key === "Home" ? TYPES[0] : e.key === "End" ? TYPES[TYPES.length - 1] : null;
    if (to_) { e.preventDefault(); choose(to_, true); }
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("company")) return; // honeypot: real people never see this field, so a filled one is a bot: send nothing
    const body: Record<string, unknown> = { type, name: fd.get("name"), email: fd.get("email"), message: fd.get("message") };
    for (const f of EXTRA[type]) body[f] = fd.get(f) ?? "";
    const parsed = validateContact(body);
    if (!parsed.ok) {
      setErrors(parsed.errors); setStatus("error"); setToast({ text: "Some fields need another look.", tone: "error" });
      requestAnimationFrame(() => (form.querySelector("[aria-invalid=true]") as HTMLElement | null)?.focus());
      return;
    }
    setErrors({}); setStatus("sending");
    const d = parsed.data;
    const mailto = () => {
      const extra = [d.branch && `Branch: ${d.branch}`, d.year && `Year: ${d.year}`, d.organisation && `Organisation: ${d.organisation}`, d.website && `Website: ${d.website}`].filter(Boolean).join("\n");
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(TABS[type].subject)}&body=${encodeURIComponent(`${d.message}\n\n${d.name}\n${d.email}${extra ? `\n${extra}` : ""}`)}`;
      setStatus("mailto"); setToast({ text: "Our message service is unavailable, so your email app should have opened. If not, write to us directly.", tone: "ok" });
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "content-type": "application/json" }, signal: AbortSignal.timeout(12000),
        body: JSON.stringify({ ...d, company: "" }),
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

  const busy = status === "sending";
  const field = (f: Field, label: string, kind: string, autoComplete: string, required = false) => (
    <div className="relative">
      <input id={`${uid}-${f}`} name={f} type={kind} autoComplete={autoComplete} maxLength={LIMITS[f as keyof typeof LIMITS]} placeholder=" " required={required} disabled={busy}
        aria-invalid={!!errors[f]} aria-describedby={errors[f] ? `${uid}-${f}-e` : undefined} className={input} />
      <label htmlFor={`${uid}-${f}`} className={floating}>{label}{required ? "" : " (optional)"}</label>
      {errors[f] && <p id={`${uid}-${f}-e`} className="t-ui mt-2 text-accent-text">{errors[f]}</p>}
    </div>
  );

  return (
    <div>
      <div role="tablist" aria-label="What would you like to do?" onKeyDown={onKey} className="grid border-y border-line sm:grid-cols-2">
        {TYPES.map((t) => (
          <button key={t} ref={(el) => { tabs.current[t] = el; }} type="button" role="tab" id={`${uid}-tab-${t}`} aria-selected={type === t} aria-controls={`${uid}-panel`} tabIndex={type === t ? 0 : -1} onClick={() => choose(t)}
            className={`ledger-row flex min-h-16 flex-col items-start justify-center border-b border-line px-1 py-3 text-left sm:px-4 sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0 max-sm:last:border-b-0 ${type === t ? "text-fg shadow-[inset_0_-2px_0_var(--accent)]" : "text-muted hover:text-fg"}`}>
            <span className="t-h3">{TABS[t].label}</span>
            <span className="t-label mt-1">{TABS[t].note}</span>
          </button>
        ))}
      </div>

      <form key={type} id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${type}`} onSubmit={submit} noValidate className="mt-8 grid max-w-2xl gap-5">
        {errors._ && <p role="alert" className="t-ui text-accent-text">{errors._}</p>}
        <div className="grid gap-5 sm:grid-cols-2">{field("name", "Your name", "text", "name", true)}{field("email", "Your email", "email", "email", true)}</div>
        {type === "join" && <div className="grid gap-5 sm:grid-cols-2">{field("branch", "Branch", "text", "off")}{field("year", "Year", "text", "off")}</div>}
        {type === "sponsor" && <div className="grid gap-5 sm:grid-cols-2">{field("organisation", "Organisation", "text", "organization", true)}{field("website", "Website", "url", "url")}</div>}
        <div className="relative">
          <textarea id={`${uid}-message`} name="message" rows={5} maxLength={LIMITS.message} placeholder=" " disabled={busy} aria-invalid={!!errors.message} aria-describedby={errors.message ? `${uid}-message-e` : undefined} className={`${input} min-h-40 resize-y`} />
          <label htmlFor={`${uid}-message`} className={floating}>Your message</label>
          {errors.message && <p id={`${uid}-message-e`} className="t-ui mt-2 text-accent-text">{errors.message}</p>}
        </div>
        <div aria-hidden="true" className="t-ui absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
        <div>
          <button type="submit" disabled={busy} className="group relative isolate inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-[2px] border border-club-paper/25 bg-club-ink px-6 t-ui text-club-paper transition-colors duration-300 hover:text-club-ink focus-visible:text-club-ink disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none">
            <span aria-hidden="true" className="absolute inset-0 -z-10 -translate-x-full bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0 group-focus-visible:translate-x-0 motion-reduce:transition-none" />
            {busy ? "Sending…" : status === "sent" || status === "mailto" ? "Send another" : "Send message"}
          </button>
        </div>
        <p className="t-label text-muted">
          We use your details only to reply to you. <Link href="/privacy" className="underline underline-offset-4 hover:text-fg">Privacy Policy</Link>
          {site.forms.noticeApproved && <> · {site.forms.noticeLine}</>}
        </p>
      </form>
      <p className="sr-only" role="status">{status === "sent" ? "Message sent." : ""}</p>
      {toast && <Toast message={toast.text} tone={toast.tone} onDone={() => setToast(null)} />}
    </div>
  );
}
