# Deployment and maintenance

## Live services

- Frontend: https://habibh0.github.io/part-c-textbook/
- Repository: https://github.com/HabibH0/part-c-textbook
- Neon project: `part-c-textbook` (`calm-heart-19669867`), AWS Frankfurt.
- Production branch: `main` (`br-frosty-wave-b21h0sxw`).
- API: https://br-frosty-wave-b21h0sxw-textbook.compute.c-6.eu-central-1.aws.neon.tech/

GitHub Pages serves static files. Accounts, automatic marking and saved learning data use the Neon Function and PostgreSQL. Functions receive `DATABASE_URL` from Neon automatically. `FRONTEND_ORIGINS` permits the exact frontend origin, `https://habibh0.github.io`, without a path or trailing slash.

## Frontend updates

The repository variable `VITE_API_BASE_URL` contains the public API URL above. It is not a secret. Database connections must never be placed in a `VITE_` variable or committed.

Push to `main`. The Pages workflow installs locked dependencies, runs tests, builds with the repository path prefix, uploads `dist/` and deploys it. Pages must use GitHub Actions as its publishing source. Hash routes allow reloading lessons without server rewrites.

## Backend updates

Use Node.js 24 and the pinned Neon CLI. These commands use PowerShell. Authenticate using `npx.cmd neon auth` if needed, then link the existing project:

```powershell
npm.cmd ci
$env:FRONTEND_ORIGINS='https://habibh0.github.io'
npx.cmd neon link --project-id calm-heart-19669867 --branch main --no-env-pull --no-config -y
```

Create a temporary branch for schema or backend changes. `checkout --create` applies `neon.ts` and creates that branch's function. Select existing branches without `--create`.

```powershell
npx.cmd neon checkout review-change --create --no-env-pull
npx.cmd neon env pull --file .env.preview --service postgres
node --env-file=.env.preview scripts/migrate-postgres.mjs
node --env-file=.env.preview scripts/test-postgres.mjs
npm.cmd test
```

Database tests create uniquely named accounts and remove only those accounts. Use an isolated branch because the tests exercise writes. Add versioned migrations for future schema changes; do not edit an already-applied migration.

After validation, select production explicitly and apply the reviewed change:

```powershell
npx.cmd neon checkout main --no-env-pull
npx.cmd neon env pull --file .env.production --service postgres
node --env-file=.env.production scripts/migrate-postgres.mjs
npm.cmd run deploy:backend
node --env-file=.env.local scripts/smoke-hosted.mjs
```

`neon deploy` writes the branch's connection variables and public Function URL into ignored `.env.local`. The smoke test creates and removes a temporary account while verifying the live HTTPS API. Remove temporary Neon branches when no process needs them.

Backend and frontend content must match. When adding a chapter, deploy the backend and then publish the frontend. Course, chapter, lesson and exercise IDs must remain stable so saved progress stays attached to its content.

## Initial account import

The initial production import is complete. Do not repeat it for normal deployments.

For a separate new, empty deployment, apply the schema, then run:

```powershell
node --env-file=.env.production scripts/import-sqlite.mjs data/textbook.sqlite
```

The importer uses a consistent read-only SQLite snapshot and a single PostgreSQL transaction. It copies users, existing scrypt hashes, lesson progress, exercise progress and attempts. It refuses to run if users exist or an import was already recorded. Sessions are not copied; readers sign in with their existing credentials. The source file is unchanged. Local and hosted data are independent after import.

## Configuration and access

Keep `.env.local`, `.env.preview`, `.env.production` and `.neon` out of Git. `.env.example` lists public configuration only. Do not serve the project root or `data/` as static files.

Hosted sessions use bearer tokens to avoid third-party cookies. The browser stores the credential in session storage; the database stores only its SHA-256 hash. CORS restricts browser access to the configured frontend origin. Every progress endpoint separately authenticates the session and derives the user ID server-side. Authentication limits are shared in PostgreSQL across Function instances.

The public repository contains the educational content and answer keys. These are study exercises, not secure examination grades. No reader data or credentials are committed. There is no self-service password recovery in this version.
