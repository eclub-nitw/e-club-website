// 20px inline glyphs, decorative (the text link beside each carries the label). Our own drawings: a neutral envelope for email, simple marks for Instagram and LinkedIn.
const base = { width: 20, height: 20, viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.5, "aria-hidden": true, className: "shrink-0" } as const;
export const MailIcon = () => <svg {...base}><rect x="2.5" y="4.5" width="15" height="11" rx="1" /><path d="M3 5.5l7 5.5 7-5.5" /></svg>;
export const InstagramIcon = () => <svg {...base}><rect x="3" y="3" width="14" height="14" rx="4" /><circle cx="10" cy="10" r="3.2" /><circle cx="14.2" cy="5.8" r=".6" fill="currentColor" stroke="none" /></svg>;
export const LinkedInIcon = () => <svg {...base}><rect x="3" y="3" width="14" height="14" rx="1.5" /><path d="M6.6 9v5M6.6 6.6v.1M9.4 14V9m0 2.4c0-1.5 1-2.4 2.2-2.4s2 .8 2 2.3V14" /></svg>;
