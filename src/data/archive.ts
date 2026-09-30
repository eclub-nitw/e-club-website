// Photo sessions from the club's own camera rolls. The club has not yet told us the event names, so each set is
// labelled neutrally ("Club event 01"). `when` comes from the camera's capture date (EXIF), not from the club.
// CONFIRM: event names, dates and what each session was; see docs/COPY-REVIEW.md.
export type ArchiveSet = {
  slug: string; label: string; title: string;
  when: string;                      // shown in captions, e.g. "Aug 2026"
  cover: string; hover: string;      // photo ids in data/media.ts, used for the hover-swap pair
};

export const archive: ArchiveSet[] = [
  { slug: "club-event-01", label: "CLUB EVENT 01", title: "Club event 01", when: "Aug 2026", cover: "01-04", hover: "01-10" },
  { slug: "club-event-02", label: "CLUB EVENT 02", title: "Club event 02", when: "Mar 2026", cover: "02-23", hover: "02-17" },
  { slug: "club-event-03", label: "CLUB EVENT 03", title: "Club event 03", when: "Mar 2026", cover: "03-33", hover: "03-39" },
];
