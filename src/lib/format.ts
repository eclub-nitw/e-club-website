const TZ = "Asia/Kolkata";

// Fixed timezone so server and client render identical text (no hydration drift).
export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: TZ });

export const fmtRange = (start: string, end?: string) => {
  if (!end) return fmtDate(start);
  const s = new Date(start), e = new Date(end);
  const part = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString("en-IN", { ...o, timeZone: TZ });
  if (part(s, { month: "short", year: "numeric" }) === part(e, { month: "short", year: "numeric" })) {
    return `${part(s, { day: "numeric" })}–${fmtDate(end)}`;
  }
  return `${fmtDate(start)} – ${fmtDate(end)}`;
};

export const yearOf = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { year: "numeric", timeZone: TZ });
