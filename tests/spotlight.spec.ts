import { test, expect } from "@playwright/test";
import { listInitiatives } from "../src/lib/initiatives";
import { spotlightEnded, spotlightHidden, spotlightVisible } from "../src/lib/spotlight";
import { spotlight } from "../src/data/spotlight";

// The server-side half of the sunset: the Initiatives list and the visibility helpers, with an explicit clock (no browser needed).
const t = (iso: string) => new Date(iso).getTime();
const has = (now: number) => listInitiatives(now).some((r) => r.event.slug === spotlight.slug);

test("the sunset is exactly seven days after the finale ends", () => {
  expect(spotlight.until).toBe("2026-10-31T20:00:00+05:30");
  expect(new Date(spotlight.hideFromListsAfter).getTime() - t(spotlight.until)).toBe(7 * 24 * 3600 * 1000);
});

test("3 Oct: promoted, upcoming, with a status chip", () => {
  const now = t("2026-10-03T12:00:00+05:30");
  expect(spotlightVisible(now) && !spotlightEnded(now)).toBe(true);
  const row = listInitiatives(now).find((r) => r.event.slug === spotlight.slug)!;
  expect(row.upcoming).toBe(true);
  expect(row.chip).toBe("Open");
});

test("1 Nov: concluded but still listed, now under Past and with no status chip", () => {
  const now = t("2026-11-01T00:00:00+05:30");
  expect(spotlightVisible(now)).toBe(true);
  expect(spotlightEnded(now)).toBe(true);
  expect(spotlightHidden(now)).toBe(false);
  const row = listInitiatives(now).find((r) => r.event.slug === spotlight.slug)!;
  expect(row.upcoming).toBe(false);
  expect(row.chip).toBeNull();
});

test("8 Nov: the Initiatives list has dropped it and nothing promotes it", () => {
  const now = t("2026-11-08T00:00:00+05:30");
  expect(spotlightVisible(now)).toBe(false);
  expect(spotlightHidden(now)).toBe(true);
  expect(has(now)).toBe(false);
  expect(listInitiatives(now).length).toBe(3);
});

test("the boundary: 7 Nov 19:59 still lists it, 7 Nov 20:00 does not", () => {
  expect(has(t("2026-11-07T19:59:00+05:30"))).toBe(true);
  expect(has(t("2026-11-07T20:00:00+05:30"))).toBe(false);
});
