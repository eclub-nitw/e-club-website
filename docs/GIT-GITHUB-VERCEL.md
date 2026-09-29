# Git, GitHub and Vercel — exact steps (Wahid creates; everyone else follows section 4)

GitHub and Vercel menus change now and then; if a label differs slightly, look for the closest match.

## 0. Once per computer (everyone)
Install **Node.js 20+ LTS** (nodejs.org), **Git for Windows** (git-scm.com) and **VS Code**. Check in PowerShell: `node -v` and `git --version`. Then set your identity: `git config --global user.name "Your Name"` and `git config --global user.email "the-email-on-your-github-account"`.

## 1. The project folder is already on your PC
`C:\Users\tipty\E-club-website` was written directly (code, docs, data, tokens, legal drafts, master prompts) — the `setup-repos.ps1` script is no longer needed. Open PowerShell in the folder and run:
```
npm install
npm run dev        # http://localhost:3000
```
`npm install` needs internet access and takes a minute or two; it generates `node_modules` and `package-lock.json`, which are gitignored, so nobody commits them.

## 2. Wahid: create the GitHub account structure
1. Sign in at github.com (or create an account with a club-owned email if one exists).
2. **Recommended:** create a free **Organization** so the repos belong to the club and outlive any one student: click your avatar → *Your organizations* → *New organization* → *Free* → name it e.g. `eclub-nitw` → add a second owner (another trusted member) so access is never lost.
3. Create the repo: **+** (top right) → *New repository* → Owner = the organization → name `e-club-website` → **Public** (there are no secrets in this repo, and public avoids Vercel free-plan limits) → leave "Add a README", ".gitignore" and "license" **unticked** → *Create repository*.
4. GitHub then shows push commands. In the project folder run:
```
git init
git branch -M main
git add -A
git commit -m "chore: initial scaffold, docs, tokens, data, legal drafts"
git remote add origin https://github.com/<ORG>/e-club-website.git
git push -u origin main
```
The first push may open a browser sign-in; approve it.

## 3. Wahid: give the team access (collaborators)
**Repo → Settings → Collaborators and teams → Add people**, type each teammate's GitHub username or email, choose the role **Write**, send. Each person gets an email/notification and must **accept the invitation** (github.com/notifications or the email link). Write lets them create branches and open pull requests, which is all they need.
Faster for many repos: **Organization → Teams → New team** (`tech`), add members once, then repo → Settings → Collaborators and teams → **Add teams** → `tech` with Write.
Everyone needs their own free GitHub account first (github.com/signup).

## 3b. Wahid: protect `main` so nobody breaks production
Repo → **Settings → Branches → Add branch ruleset / protection rule** for `main`: tick **Require a pull request before merging**, **Require approvals: 1**, and (optionally) **Block force pushes**. From now on all work goes through pull requests and a review.

## 4. Everyone: daily workflow
```
git clone https://github.com/<ORG>/<REPO>.git
cd <REPO>
npm install
npm run dev                      # http://localhost:3000
git checkout -b yourname/what-you-build      # e.g. saad/events-index
# ... build, then:
git add -A
git commit -m "events: ledger list with year filter"
git push -u origin yourname/what-you-build
```
Then open the repo on github.com → the yellow banner **Compare & pull request** → fill the checklist → *Create pull request*. Wahid reviews and merges (green **Merge pull request** button). To start new work: `git checkout main`, `git pull`, new branch.
If a PR says "This branch has conflicts": `git checkout main && git pull && git checkout yourname/branch && git merge main`, fix the files with `<<<<<<<` markers in VS Code (pick the right lines), then `git add -A && git commit && git push`. Ask Wahid if stuck.

## 5. Wahid: deploy on Vercel
1. vercel.com → **Sign Up → Continue with GitHub**. Choose the free **Hobby** plan.
2. **Add New… → Project** → find the repo → **Import**. If the organization's repos are not listed, click *Adjust GitHub App Permissions* and grant Vercel access to the organization. If Vercel's free plan refuses an organization-owned repo, either transfer the repo to your personal account (repo → Settings → Transfer) or start a Vercel trial; check Vercel's current plan terms.
3. Framework preset: **Next.js** (auto). Do not change anything → **Deploy**. You get `https://<name>.vercel.app`.
4. From now on: every push to `main` deploys to production; every pull request gets its own **Preview URL** (a comment appears on the PR). Teammates do NOT need Vercel accounts.
5. Cookieless analytics: Project → **Analytics → Enable**, then `npm i @vercel/analytics` and add `<Analytics />` in `layout.tsx`.
6. **Custom domain:** buy the domain in the club's name (registrar login held by two people) → Vercel → Project → **Settings → Domains → Add** → copy the DNS records Vercel shows into the registrar. Update `site.url` in `src/data/site.ts` to the final address immediately (canonical, sitemap and Open Graph read it). See also docs/CONTEXT.md for the institute subdomain question due 30 Sep 2026.

## 6. Merging Venture Vortex into this site
See `docs/SITEMAP-AND-PAGES.md` → "Merge plan". Keep both live until this site is ready, then merge and 301-redirect the standalone Vercel URL.
