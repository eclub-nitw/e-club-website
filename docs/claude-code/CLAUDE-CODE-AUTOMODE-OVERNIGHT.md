# Claude Code master prompt — unattended overnight session
**Paste this as your first message to Claude Code when starting a session Wahid will not be watching.** Everything in `AGENTS.md` and `docs/claude-code/CLAUDE-CODE-MASTERPROMPT.md` still applies in full — this file adds the rules specific to running with nobody present to answer a question or approve a step. Read both of those, plus `docs/CONTEXT.md`, `docs/DESIGN.md`, `docs/SITEMAP-AND-PAGES.md`, `docs/TASKS.md`, before starting.

## The one difference from the attended session
In the attended session, you report after each page and keep going unless genuinely blocked. Tonight, there is no one to report to in real time and no one to ask. That changes exactly two things: **(1)** every decision you'd normally flag and ask about, you now make yourself, using the most conservative reading of the docs, and you write down what you decided and why; **(2)** instead of many small progress reports, you keep one continuous, timestamped log. It does not change the quality bar, the verification steps, or any non-negotiable rule — if anything, verify more rather than less, because nobody will catch a mistake before morning.

## Before you start: guardrails (do not violate these under any circumstance tonight)
1. **Work on exactly one branch for the whole session:** `git checkout -b claude/overnight-YYYY-MM-DD` (use tonight's real date). Commit to it frequently — after every page, not just at the end. **Never push to or merge into `main`.** Never open a PR either; leave that for Wahid to do in the morning once he's reviewed the branch. One branch, reviewed once, is safer and easier to review than several unattended PRs.
2. **Never touch, delete or weaken:** `.github/workflows/ci.yml`, `.github/dependabot.yml`, the security headers in `next.config.ts`, or any `.env*` file. If a CI check is failing and you don't know why after real investigation, log it clearly and move to the next task — do not "fix" it by disabling the check.
3. **Never invent a fact to unblock yourself.** This is the rule most tempting to bend when no one's watching and a page needs a number the club hasn't supplied. Don't. Leave the honest placeholder (see `CLAUDE-CODE-MASTERPROMPT.md` → "When you're blocked") and move on.
4. **Never run a destructive command:** no `git push --force`, no `git reset --hard` on shared history, no `rm -rf` outside files you created this session, no deleting other branches, no rewriting commit history that already existed before tonight.
5. **Time-box yourself per page.** If verification (build/lint/screenshot/Lighthouse) for one page is still failing after a genuine, logged attempt to fix it, stop fixing, log it as blocked with the specific error, and move to the next page in the queue. Don't spend the whole night stuck on one problem while the rest of the queue sits untouched — coverage of the queue matters when no one's here to redirect you.
6. **Never idle waiting for input.** There is no input coming. If you reach a point where the attended prompt says "ask Wahid," instead: make the most conservative choice consistent with the docs, log the question AND the decision you made in its place under "Needs a human decision" in the log, and continue.

## The log: `docs/handoff/BUILD-LOG-<date>.md`
Create this file at the start of the session (`if_version: new`-style — i.e. create it fresh, don't append to an old one). Append an entry every time you: start a page, finish a page, hit a blocker, make a judgment call you'd normally have asked about, or a verification step fails. Format:
```
### HH:MM — <page/task>
Status: started | done | blocked | judgment call
<2-4 lines: what happened, what you decided and why, what's still open>
```
This log, not your conversational output (which nobody will read live), is the actual deliverable of tonight's session alongside the code. Write it like you're explaining the night to Wahid over coffee, not like a commit message.

## Work queue (same order as the attended prompt; go as far down it as the night allows)
1. Shell (Nav, Footer, Button, Section, layout wiring).
2. Home.
3. `/events` + `/events/[slug]`.
4. `/team` + `/team/[year]`.
5. `/sponsors`.
6. `/gallery`.
7. `/contact`, `/join`.
8. Legal routes (render only — never edit the legal text).
9. Sitewide SEO/meta pass.

**Quality over coverage still holds, unattended or not.** If you're four pages in and the quality bar is starting to slip because you're rushing to reach page nine, stop adding new pages and spend the remaining time hardening what you have — a second full verification pass, an accessibility re-check, closing every TODO you can close honestly. A site with five excellent pages and a clear log of what's left beats nine rough ones.

## Every verification step from the attended prompt still applies, in full, per page
Typecheck, lint, build, Playwright screenshots at 360/768/1440 (actually generate and reference them in the log by file path — save them under `docs/handoff/screenshots/<date>/`), reduced-motion re-check, keyboard pass, Lighthouse targets (Performance ≥ 90 mobile, Accessibility ≥ 95, SEO 100). Do not skip any of these because it's late or because a human isn't watching — the whole point of this session is that it can be trusted without supervision, and that trust is earned by not cutting these corners specifically because no one's checking.

## End of session: write the morning summary
When you stop — either the queue is done or the session is ending — write a final section at the top of the log titled `## MORNING SUMMARY`, containing:
- Pages completed and verified (with their Lighthouse scores).
- Pages started but not finished, and exactly what's left.
- Every "Needs a human decision" item from the log, collected in one place.
- Every CONFIRM/TODO placeholder still in the code, with file and line.
- The exact commands Wahid should run: `git checkout claude/overnight-<date>`, `npm install` (if you added any dependency), `npm run dev`, then which pages to look at first.
- Anything you touched that a reviewer should specifically double-check before merging (this is not optional even if you're confident — a second pair of eyes on a fact-bearing page is the whole reason this stays on a branch).
