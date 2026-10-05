# Part C — interactive textbook

[Open the textbook](https://habibh0.github.io/part-c-textbook/). The frontend runs on GitHub Pages; Neon Functions and PostgreSQL provide accounts, automatic marking and saved progress. Local development is also supported.

C6.1 Numerical Linear Algebra: Chapter 1 covers the notation needed from pp. 5–6, Section 0, and **all of Section 1**, including the review identities at the top of page 14. Chapter 2 covers the full SVD exposition and low-rank approximation in Sections 2–3, including the image-compression discussion (pp. 14–22). Chapter 3 covers all of Section 4 (pp. 21, 23–25): Courant–Fischer, Weyl, nonsymmetric eigenvalue sensitivity, block inequalities, and the decomposition review, including the optional material. Chapter 4 covers all of Section 5 (pp. 25–28): LU as rank-one updates, triangular solves and reuse, pivoted LU, complete-pivoting context, Cholesky, and semidefinite/indefinite qualifications. Chapter 5 covers all of Section 6 (pp. 29–36): Gram–Schmidt, Householder QR, Givens rotations, least-squares geometry, normal equations, best approximation and polynomial regression, including all optional material. Chapter 6 covers all of Section 7 (pp. 37–44): floating-point arithmetic, conditioning, forward/backward/mixed stability, matrix perturbation bounds, triangular/LU/Cholesky solves, matrix products and inverse formation, and Householder/Gram–Schmidt stability, including the optional material. Chapter 7 covers all of Section 8 (pp. 45–49, ending before Section 9): companion matrices, Schur form, power iteration, optional PageRank, shifted inverse iteration and optional Rayleigh quotient iteration. Chapter 8 covers all of Section 9 (pp. 49–55): QR iteration, shifts, Hessenberg reduction, deflation, and optional refinements. Chapter 9 covers all of Section 10 (pp. 55–58): symmetric QR, spectral divide-and-conquer, bidiagonal SVD, generalised eigenvalues and QZ, and polynomial/nonlinear spectral problems. Section 11 (iterative methods and Arnoldi) begins the next chapter.

## Run locally

Requires Node.js 24 or newer.

```powershell
npm.cmd install
npm.cmd run build
npm.cmd start
```

Open http://127.0.0.1:3000. For editing with live updates, use `npm.cmd run dev` instead. Both modes use one server and the same database. Source PDFs remain in the sibling `nla` folder for editorial use and are not linked from the app.

## Accounts and persistence

Create an account using a username, display name, and a password of at least 12 characters. No email account is required. Reading is available without signing in; saving and checking exercises require an account.

In the hosted app, accounts, password hashes, hashed sessions, lesson checkpoints, exercise drafts, attempts and hint usage live in **Neon PostgreSQL**. Locally these live in `data/textbook.sqlite` on the server. No learning data is stored in browser storage. The hosted app keeps only its opaque session credential in sessionStorage; the theme choice is in localStorage. A fresh browser session requires signing in again. Local development uses an HttpOnly, SameSite=Strict cookie. Both modes store only hashed session tokens on the server; the database is authoritative. Sign in to the same account in another browser to retrieve the same records. Exercise drafts are saved explicitly with “Save draft”; checking an answer also saves it. Using help first saves any edited answer. Unsaved changes are labelled.

Both servers use scrypt password hashes with unique salts, parameterised SQL, server-derived account ownership, origin validation, login rate limiting and hashed session tokens. The local server validates CSRF tokens; the hosted API requires bearer authorization for progress endpoints and validates write-request headers. Sign-out revokes the current session; sessions expire after 30 days. This version has no email verification or self-service password reset. Existing local accounts and progress have been migrated to Neon with the same login credentials. Local and hosted databases are independent after migration.

For local development, SQLite supports multiple accounts. It requires no separately managed database service. Back up the **server data**, not browser storage: stop the server before copying `data/textbook.sqlite`, or use a SQLite-aware online backup. Do not delete `data/` when updating the application. Do not serve this directory as static files.

By default the server binds to `127.0.0.1`, so only this computer can reach it. Another device would need access to this same server. A controlled LAN setup can use `HOST=0.0.0.0` with `ALLOWED_HOSTS` listing the actual hostname/IP. For any remote deployment, put it behind HTTPS, set `COOKIE_SECURE=true`, and configure the host allowlist. `PORT` defaults to 3000; `DATABASE_PATH` can point to a durable alternative location. The app does not open firewall ports or publish itself.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md). Pushes to `main` run tests and publish the frontend through GitHub Actions. Backend changes deploy separately using `npm run deploy:backend`, after testing on an isolated Neon branch. The repository variable `VITE_API_BASE_URL` holds the public API URL; database credentials must never use a `VITE_` prefix. Environment files and local databases are excluded from Git.

## Coverage rule for future chapters

Preserve every definition, result, assumption, proof, example, exercise, footnote qualification, and optional/non-examinable topic in the relevant lecture-note sections, at least at the source’s level of mathematical detail. Explain terse steps clearly instead of summarising them away. Map each source item to a lesson and record any mathematical corrections. Optional or non-examinable labels change how content is presented, not whether it is included.

## Reader layout

The interface is styled as an Oxford-style printed book (Oxford blue, parchment, EB Garamond and Cinzel, bundled locally through `@fontsource`). Content is organised as **Library → course → chapter → lesson**, and every page shows breadcrumbs back up that hierarchy.

- **Library** (`#library`): every course as a spine on a shelf, with a card per course. It is the home page once there is more than one course; with one course the home page is that course's contents.
- **Course contents** (`#course/<id>`): every chapter and its lessons, with progress. Chapters with no lessons yet are shown as *in preparation*.
- **Chapter contents** (`#chapter/<id>`): the chapter's lessons, with links to the neighbouring chapters.
- **Lesson** (`#lesson/<id>/<section>`): §I Lecture, §II Demonstration, §III Problem sheet, §IV Collections. The end of each lesson links to the previous and next lessons, continuing across chapter boundaries.

The sticky band lists the pages beside the current one: courses in the Library, chapters on a course page, lessons in a chapter. Its left-hand button, the masthead's course name, or the menu button on phones opens the **navigator**: courses, every chapter with its lessons and progress, a search across all lessons, and a link to resume. Keyboard: `[` and `]` step to the previous or next lesson, `/` or Ctrl+K opens search, and Esc closes it. Night reading is available from the band; only that choice is kept in localStorage. Leaving a page with unsaved answers asks for confirmation. Older links (`#overview`, `#lesson/...`, `#chapter/...`) still work. Progress counts in the masthead are for the current course.

## Adding chapters and courses

The hierarchy picks up new content automatically; new interactive demonstrations also need a component and a route in `src/Labs.jsx`.

1. **A new course:** add an entry to `content/courses.js` (`id`, `code`, `title`, `short`, `description`, and optionally a spine `color`).
2. **A new chapter:** add it to `content/chapters.js` with `course`, `number` (its order within the course), `title`, `short` (for the band), `description`, and `lessonIds`. Leave `lessonIds` empty to list it as *in preparation*.
3. **Its lessons and exercises:** define them as in `content/chapter2.js` and append them in `content/catalog.js`. Each lesson's text goes in `content/<lesson id>.md`, which is picked up automatically.
4. Run `npm.cmd test`. It checks that every chapter names a real course, that ids and chapter numbers are unique, and that every lesson has its Markdown.

Course, chapter, lesson, and exercise ids must be unique across *all* courses, because saved progress is stored against them. Never rename an id once people have progress recorded against it. No database migration is needed when adding content.

## Learning content

- Chapter 1: four full lessons in `content/lesson-1.md` through `lesson-4.md`.
- Chapter 2: four full lessons in `content/svd-*.md`.
- Chapter 3: four full lessons in `content/minmax-*.md`.
- Chapter 4: four full lessons in `content/lu-*.md`.
- Chapter 5: six full lessons in `content/qr-*.md`.
- Chapter 6: six full lessons in `content/stability-*.md`.
- Chapter 7: five full lessons in `content/eigen-*.md`.
- Chapter 8: five full lessons in `content/qralg-*.md`, covering Section 9 (pp. 49–55): QR iteration, shifts and rational filtering, Hessenberg reduction, deflation, and all optional refinements. 
- Chapter 9: four full lessons in `content/spectral-*.md`, covering all of Section 10, including optional material.
- Chapter 9 adds 32 practice problems and 12 mastery questions.
- 38 Chapter 1 practice problems, 32 per chapter in Chapters 2–4, and 48 per chapter in Chapters 5–6 and 40 per chapter in Chapters 7–8, including checked proofs and counterexamples.
- 12 automatically checked mastery questions in each of Chapters 1–4, and 18 per chapter in Chapters 5–6, and 15 per chapter in Chapters 7–8.
- Progressive hints, worked solutions, and automatically checked proof steps.
- Forty-two mathematical explorations, rendered locally with SVG, canvas, and React. Chapter 2 includes a real image SVD, generated reproducibly by `scripts/generate-compression.py` (NumPy and Pillow).
- `content/coverage-chapter2.md` through `content/coverage-chapter9.md` are internal coverage and corrections checklists; they are excluded from the reader bundle.

Content is original explanatory prose based on the supplied C6.1 material. The reader is self-contained, without source links or coverage maps. Chapter 2 expands the SVD existence proof to deficient and wide matrices, explains all subspaces and uniqueness cases, and gives the complete spectral low-rank optimality proof.

Reading checkpoints do not imply mastery. “Independent” means the exercise was answered correctly before opening help within this account. “Completed with support” is distinguished from independent success. These are study indicators, not secure examination grades. Previously completed questions remain completed even when a new draft is edited. Three independent mastery answers pass that lesson's short check; the interface does not claim that this proves mastery of every theorem.

## Project structure

- `src/`: React reader, maths rendering, exercises, and explorations. `src/structure.js` holds the course/chapter/lesson hierarchy and routes.
- `content/`: lesson Markdown, exercise definitions, course and chapter metadata (`courses.js`, `chapters.js`), and internal editorial coverage documentation.
- `server/`: Neon/Hono API and PostgreSQL migrations, local Express/SQLite server, and their shared numerical checker.
- `tests/app.test.js`: mathematical markup validation, checker cases, and account/persistence integration tests.

## Validate

```powershell
npm.cmd test
npm.cmd run build
```

Local tests use an isolated temporary database. Hosted database tests run separately with `node --env-file=.env.preview scripts/test-postgres.mjs` against an isolated Neon branch, checking ownership, concurrent answers, session expiry and revocation. The live HTTPS smoke test creates and removes a temporary account. They verify ownership isolation, CSRF/origin rejection, password login, session revocation, progress across server restarts and browser sessions, supported versus independent answers, multipart proof marking, public answer-key omission, and renderability of all LaTeX. Numerical entries accept decimal/scientific notation and simple fractions; arbitrary code and symbolic expressions are never evaluated.

React + Vite build the interface; KaTeX renders mathematics. Neon Functions with Hono and PostgreSQL run the hosted API; Express and Node's SQLite driver retain the account-backed local development server. The package lock fixes the installed dependencies. There are no external font or script dependencies at runtime.

## Automatic marking
All 468 exercises are checked on the server. Former written questions now contain numeric and proof-reasoning parts with feedback per part. Every part must pass for completion. Revised questions use new IDs ending in `-auto`: old written drafts remain in the database but do not count as automatically checked completion.
