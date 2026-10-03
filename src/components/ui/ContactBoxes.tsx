"use client";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { site } from "@/data/site";
import { INTERESTS, LIMITS, validateContact, type Field, type Type } from "@/lib/contact-schema";
import { Toast } from "./Toast";
import { H2, Label } from "./Type";

type Status = "idle" | "sending" | "sent" | "mailto" | "error";
type Errors = Partial<Record<Field, string>>;

const input = "t-body peer block min-h-14 w-full max-w-none rounded-[2px] border border-line bg-transparent px-4 pb-2 pt-6 text-fg placeholder-transparent transition-colors hover:border-fg/40 focus-visible:border-accent disabled:opacity-50 aria-[invalid=true]:border-accent-text";
const floating = "t-ui pointer-events-none absolute left-4 top-4 origin-left text-muted transition-transform duration-200 peer-focus:-translate-y-3 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75 motion-reduce:transition-none";

const SUBJECT: Record<Type, string> = {
  join: "Join E-Club NIT Warangal", query: "Question for E-Club NIT Warangal", contact: "Message from the E-Club website", sponsor: "Sponsorship or partnership enquiry",
};

/**
 * Shared behaviour of both boxes: validate with the same schema the server uses, post to /api/contact, and never lose a message. A 400 shows the
 * server's field errors, a 429 asks the visitor to wait, anything else (503 included) opens the visitor's own email app with the message filled in.
 * Each box owns its status, errors and live region, so the two forms never interfere.
 */
function useBox(to: string, body: (fd: FormData) => Record<string, unknown>) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [toast, setToast] = useState<{ text: string; tone: "ok" | "error" } | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("company")) return; // honeypot: real people never see this field, so a filled one is a bot: send nothing
    const parsed = validateContact(body(fd));
    if (!parsed.ok) {
      setErrors(parsed.errors); setStatus("error"); setToast({ text: "Some fields need another look.", tone: "error" });
      requestAnimationFrame(() => (form.querySelector("[aria-invalid=true]") as HTMLElement | null)?.focus());
      return;
    }
    setErrors({}); setStatus("sending");
    const d = parsed.data;
    const mailto = () => {
      const extra = [d.organisation && `Organisation: ${d.organisation}`, d.role && `Role: ${d.role}`, d.website && `Website: ${d.website}`, d.interest && `Interest: ${d.interest}`].filter(Boolean).join("\n");
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(SUBJECT[d.type])}&body=${encodeURIComponent(`${d.message}\n\n${d.name}\n${d.email}${extra ? `\n${extra}` : ""}`)}`;
      setStatus("mailto"); setToast({ text: "Our message service is unavailable, so your email app should have opened. If not, write to us directly.", tone: "ok" });
    };
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, signal: AbortSignal.timeout(12000), body: JSON.stringify({ ...d, company: "" }) });
      if (res.ok) { setStatus("sent"); setToast({ text: "Thanks. We have your message and will reply by email.", tone: "ok" }); form.reset(); return; }
      if (res.status === 429) { setStatus("error"); setToast({ text: "Too many messages from this connection. Please try again in a few minutes.", tone: "error" }); return; }
      if (res.status === 400) {
        const j = (await res.json().catch(() => ({}))) as { fields?: Errors };
        setErrors(j.fields ?? {}); setStatus("error"); setToast({ text: "Some fields need another look.", tone: "error" }); return;
      }
      mailto(); // 503 and anything unexpected: never lose the message
    } catch { mailto(); }
  };
  return { errors, status, toast, setToast, submit, busy: status === "sending" };
}

type BoxApi = ReturnType<typeof useBox>;

function Input({ api, uid, name, label, kind = "text", autoComplete, required = false }: { api: BoxApi; uid: string; name: Field; label: string; kind?: string; autoComplete: string; required?: boolean }) {
  const err = api.errors[name];
  return (
    <div className="relative">
      <input id={`${uid}-${name}`} name={name} type={kind} autoComplete={autoComplete} maxLength={LIMITS[name as keyof typeof LIMITS]} placeholder=" " required={required} disabled={api.busy}
        aria-invalid={!!err} aria-describedby={err ? `${uid}-${name}-e` : undefined} className={input} />
      <label htmlFor={`${uid}-${name}`} className={floating}>{label}{required ? "" : " (optional)"}</label>
      {err && <p id={`${uid}-${name}-e`} className="t-ui mt-2 text-accent-text">{err}</p>}
    </div>
  );
}

function Message({ api, uid }: { api: BoxApi; uid: string }) {
  const err = api.errors.message;
  return (
    <div className="relative flex min-h-40 flex-1 flex-col">
      <textarea id={`${uid}-message`} name="message" rows={5} maxLength={LIMITS.message} placeholder=" " disabled={api.busy} aria-invalid={!!err} aria-describedby={err ? `${uid}-message-e` : undefined} className={`${input} min-h-40 flex-1 resize-none`} />
      <label htmlFor={`${uid}-message`} className={floating}>Your message</label>
      {err && <p id={`${uid}-message-e`} className="t-ui mt-2 text-accent-text">{err}</p>}
    </div>
  );
}

function Actions({ api, uid }: { api: BoxApi; uid: string }) {
  return (
    <>
      <div aria-hidden="true" className="t-ui absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
      <div>
        <button type="submit" disabled={api.busy} className="group relative isolate inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-[2px] border border-club-paper/25 bg-club-ink px-6 t-ui text-club-paper transition-colors duration-300 hover:text-club-ink focus-visible:text-club-ink disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none">
          <span aria-hidden="true" className="absolute inset-0 -z-10 -translate-x-full bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0 group-focus-visible:translate-x-0 motion-reduce:transition-none" />
          {api.busy ? "Sending…" : api.status === "sent" || api.status === "mailto" ? "Send another" : "Send message"}
        </button>
      </div>
      <p className="t-label text-muted">
        We use your details only to reply to you. <Link href="/privacy" className="underline underline-offset-4 hover:text-fg">Privacy Policy</Link>
        {site.forms.noticeApproved && <> · {site.forms.noticeLine}</>}
      </p>
      <p className="sr-only" role="status">{api.status === "sent" ? "Message sent." : api.status === "mailto" ? "Your email app was opened with the message." : ""}</p>
      {api.toast && <Toast message={api.toast.text} tone={api.toast.tone} onDone={() => api.setToast(null)} />}
    </>
  );
}

const REASONS = [
  { value: "query", label: "Ask a question" },
  { value: "join", label: "Join the club" },
  { value: "contact", label: "Say hello" },
] as const;
type Reason = (typeof REASONS)[number]["value"];

/** Box A, paper: questions, joining and hello. `#join` selects "Join the club"; `#contact` and no hash select "Ask a question". */
export function ContactBoxA({ to }: { to: string }) {
  const uid = useId();
  const [reason, setReason] = useState<Reason>("query");
  const api = useBox(to, (fd) => ({ type: reason, name: fd.get("name"), email: fd.get("email"), message: fd.get("message") }));

  useEffect(() => {
    const sync = () => { if (window.location.hash === "#join") setReason("join"); else if (window.location.hash === "#contact") setReason("query"); };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <section id="contact" aria-labelledby={`${uid}-h`} className="tone-paper !flex scroll-mt-28 flex-col rounded-[2px] border-t-4 border-transparent bg-bg p-6 text-fg md:p-8">
      <span id="join" className="scroll-mt-28" />
      <Label>A — Club</Label>
      <H2 id={`${uid}-h`} className="mt-3">Contact and queries</H2>
      <form onSubmit={api.submit} noValidate className="mt-6 flex flex-1 flex-col gap-5">
        {api.errors._ && <p role="alert" className="t-ui text-accent-text">{api.errors._}</p>}
        <fieldset disabled={api.busy} className="m-0 border-0 p-0">
          <legend className="t-label mb-2 text-muted">What is this about?</legend>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {REASONS.map((r) => (
              <label key={r.value} className="t-ui inline-flex min-h-11 cursor-pointer items-center gap-2">
                <input type="radio" name="reason" value={r.value} checked={reason === r.value} onChange={() => setReason(r.value)} className="size-4 accent-[var(--accent-text)]" />
                {r.label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-5 sm:grid-cols-2"><Input api={api} uid={uid} name="name" label="Your name" autoComplete="name" required /><Input api={api} uid={uid} name="email" label="Your email" kind="email" autoComplete="email" required /></div>
        <Message api={api} uid={uid} />
        <Actions api={api} uid={uid} />
      </form>
    </section>
  );
}

/** Box B, ink with an orange rule: sponsors, partners and media. Anchor `#sponsor`. The brochure link shows only when `site.brochureUrl` is set. */
export function ContactBoxB({ to }: { to: string }) {
  const uid = useId();
  const api = useBox(to, (fd) => ({
    type: "sponsor", name: fd.get("name"), email: fd.get("email"), message: fd.get("message"),
    organisation: fd.get("organisation"), website: fd.get("website"), role: fd.get("role"), interest: fd.get("interest"),
  }));
  const err = api.errors.interest;
  return (
    <section id="sponsor" aria-labelledby={`${uid}-h`} className="flex scroll-mt-28 flex-col rounded-[2px] border-t-4 border-accent bg-surface p-6 text-fg md:p-8">
      <Label>B — Partners</Label>
      <H2 id={`${uid}-h`} className="mt-3">Sponsorship and partnership</H2>
      {site.brochureUrl && <p className="mt-3"><a className="text-link underline underline-offset-4" href={site.brochureUrl} target="_blank" rel="noopener noreferrer">Sponsorship brochure<span className="sr-only"> (opens in a new tab)</span></a></p>}
      <form onSubmit={api.submit} noValidate className="mt-6 flex flex-1 flex-col gap-5">
        {api.errors._ && <p role="alert" className="t-ui text-accent-text">{api.errors._}</p>}
        <div className="grid gap-5 sm:grid-cols-2"><Input api={api} uid={uid} name="name" label="Your name" autoComplete="name" required /><Input api={api} uid={uid} name="role" label="Your role" autoComplete="organization-title" /></div>
        <div className="grid gap-5 sm:grid-cols-2"><Input api={api} uid={uid} name="organisation" label="Organisation" autoComplete="organization" required /><Input api={api} uid={uid} name="website" label="Website" kind="url" autoComplete="url" /></div>
        <Input api={api} uid={uid} name="email" label="Your email" kind="email" autoComplete="email" required />
        <div className="relative">
          <select id={`${uid}-interest`} name="interest" defaultValue="" disabled={api.busy} aria-invalid={!!err} aria-describedby={err ? `${uid}-interest-e` : undefined} className={`${input} pt-6`}>
            <option value="" disabled>Choose one</option>
            {INTERESTS.map((i) => <option key={i} value={i} className="text-club-ink">{i}</option>)}
          </select>
          <label htmlFor={`${uid}-interest`} className="t-ui pointer-events-none absolute left-4 top-2 origin-left scale-75 text-muted">What do you have in mind?</label>
          {err && <p id={`${uid}-interest-e`} className="t-ui mt-2 text-accent-text">{err}</p>}
        </div>
        <Message api={api} uid={uid} />
        <Actions api={api} uid={uid} />
      </form>
    </section>
  );
}
