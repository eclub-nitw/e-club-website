import { test, expect } from "@playwright/test";
import { phaseAt, viewOf, type Phase } from "../src/lib/phase";

// Every boundary, one minute either side. IST is UTC+05:30, so each instant is written with its offset: the result must not depend on the machine's timezone.
const t = (iso: string) => new Date(iso).getTime();
const cases: [string, Phase][] = [
  ["2026-09-21T23:59:00+05:30", "pre"],
  ["2026-09-22T00:00:00+05:30", "registration"],
  ["2026-10-03T23:59:00+05:30", "registration"],
  ["2026-10-04T00:00:00+05:30", "submissions"],
  ["2026-10-09T07:59:00+05:30", "submissions"],
  ["2026-10-09T08:00:00+05:30", "pending"],
  ["2026-10-10T12:00:00+05:30", "pending"],
  ["2026-10-11T07:59:00+05:30", "pending"],
  ["2026-10-11T08:00:00+05:30", "round2"],
  ["2026-10-18T19:59:00+05:30", "round2"],
  ["2026-10-18T20:00:00+05:30", "between"],
  ["2026-10-30T07:59:00+05:30", "between"],
  ["2026-10-30T08:00:00+05:30", "round3"],
  ["2026-10-31T19:59:00+05:30", "round3"],
  ["2026-10-31T20:00:00+05:30", "finished"],
  ["2026-11-01T00:00:00+05:30", "finished"],
];

for (const [iso, phase] of cases) test(`${iso} is ${phase}`, () => expect(phaseAt(t(iso))).toBe(phase));

test("the 3 Oct cut-off is the same instant in UTC (18:29:59 on 3 Oct)", () => {
  expect(phaseAt(t("2026-10-03T18:29:00Z"))).toBe("registration");
  expect(phaseAt(t("2026-10-03T18:30:00Z"))).toBe("submissions");
});

test("after registration closes no label, pill or CTA says Register", () => {
  for (const p of ["submissions", "pending", "round2", "between", "round3", "finished"] as Phase[]) {
    const v = viewOf(p);
    const text = [v.pill?.label, v.action?.label, v.hero.label, v.ticker, v.countdown.label].filter(Boolean).join(" | ");
    expect(text, p).not.toMatch(/register on|registration is live|register now/i);
  }
});

test("only registration offers the registration link; submissions point at the Unstop page", () => {
  expect(viewOf("registration").action?.label).toBe("Register on Unstop");
  expect(viewOf("submissions").action?.label).toMatch(/submissions/i);
  expect(viewOf("submissions").pill?.label).toBe("Registration closed · Submissions open until 9 Oct, 08:00 IST");
  expect(viewOf("pending").action).toBeNull();
  expect(viewOf("finished").pill).toBeNull();
});
