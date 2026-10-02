// Speakers and guests. Rendered only when the list is non-empty. A portrait is shown only with `photoConsent: true`.
export type Speaker = { name: string; title: string; event: string; photo?: string; photoConsent: boolean };
export const speakers: Speaker[] = [];
