---
name: branch-pr
description: Put the current work on a branch and open a draft pull request against the default branch. Use when the user asks to branch this work, open a PR, or push work up for review. Handles creating the branch, committing, pushing with upstream, and opening the PR via gh.
---

# Branch and open a pull request

Takes whatever the user is working on and gets it to a draft PR on GitHub in one
pass: branch → commit → push → PR.

## Arguments

```
/branch-pr <branch-name> <commit subject>
```

`$ARGUMENTS` holds both, split on the **first whitespace**:

| Part | Meaning |
|---|---|
| first token | branch name — a branch name can never contain a space, so the first token is unambiguously it |
| everything after | commit subject, used verbatim |

Both parts are optional and degrade independently:

- **Neither given** — derive a kebab-case branch name from the change, and write
  the commit subject yourself.
- **Branch only** — use it, and write the commit subject yourself.
- **Both given** — use each as supplied. Strip surrounding quotes from the
  subject if the user wrapped it.

Examples:

```
/branch-pr fix-nav-overflow fix: stop the header nav overflowing on mobile
/branch-pr TGC-dark-mode                 # subject written for you
/branch-pr                               # both derived from the diff
```

## The constraint that shapes this skill

**GitHub refuses a pull request when there are no commits between base and
head.** A newly created branch has nothing on it, so "create a branch and open a
PR" cannot happen in that order — there must be at least one commit first. If
the user asks for a PR with nothing to put in it, say so plainly and offer to
create the branch now and open the PR once there is a commit. Do not open an
empty PR with a placeholder commit to work around this.

## Preconditions

Check these first and stop with a clear message if one fails:

1. `gh --version` — if missing: `brew install gh`.
2. `gh auth status` — if not logged in, tell the user to run `gh auth login`
   themselves. It is an interactive browser flow; you cannot complete it.
3. `git rev-parse --is-inside-work-tree` — must be a repo with an `origin`.

## Steps

1. **Find the base branch.** Read it, do not assume `main`:
   `git symbolic-ref --short refs/remotes/origin/HEAD | sed 's|^origin/||'`.
   Fall back to `main` only if that is unset.

2. **Get onto a feature branch.** If HEAD is already on a non-base branch, reuse
   it — do not create a second branch, and say which one you reused. Otherwise
   `git checkout -b <branch-name>` using the first argument; without one, derive
   a short kebab-case name from the change (`fix-mobile-nav-overflow`), not from
   the file names.

3. **Make sure there is something to review.** Run `git status --short`.
   - Uncommitted changes → review them with `git diff`, then commit.
     - **A commit subject was supplied** → it is the subject of a single commit
       covering the work. Use the user's words verbatim; do not reword them.
       Still write a body explaining *why*, in the repository's existing style.
       If the subject carries no conventional-commit type (`feat:`, `fix:`,
       `chore:`…) and the repository's history uses them consistently, add the
       fitting one and say so when reporting — never silently reword.
     - **No subject supplied** → commit in logical units with real messages,
       following the repository's existing commit style.
   - Nothing uncommitted and `git rev-list --count origin/<base>..HEAD` is 0 →
     there is nothing to open a PR for. Stop and say so.

4. **Verify before pushing.** Run the project's checks (in this repo:
   `pnpm lint`, `pnpm type-check`, `pnpm test`) and report failures rather than
   pushing over them. If the user asked to push regardless, do it and say
   explicitly what is failing.

5. **Push.** `git push -u origin <branch>`. Never push to the base branch from
   this skill.

6. **Open the PR as a draft.**
   ```
   gh pr create --draft --base <base> --head <branch> \
     --title "<title>" --body "<body>"
   ```
   - Title: the supplied commit subject when there was one. Otherwise the
     single commit's subject if there is exactly one commit, else a short phrase
     describing the change as a whole.
   - Body: what changed and why, then anything the reviewer should know —
     trade-offs, follow-ups, things deliberately left out. Do not just list the
     commits; the PR page already shows them.
   - Draft is the default because the PR is being opened mechanically. Pass
     `--draft` unless the user explicitly asks for it to be ready for review.

7. **Report the URL** the command prints. If a PR already exists for the branch
   (`gh pr view <branch> --json url`), do not create a second one — surface the
   existing URL and, if there are new commits, note that the push updated it.

## Guardrails

- Never open a PR whose base and head are the same branch.
- Never force-push, and never rewrite published history, unless the user asks
  for that specific thing.
- If the branch already has an open PR, update it by pushing — do not open
  another.
- Report what actually happened. If the checks failed or a step was skipped, say
  which, rather than reporting a clean run.
