# Home Security

Expo app for managing Home Church security team service availability, floor-plan assignments, and roster details.

## Setup

Install dependencies:

```bash
npm install
```

Create a local env file with the required Supabase/Expo values:

```bash
cp .env.example .env.local
```

Start the app:

```bash
npm start
```

## Checks

Run the same checks used by CI:

```bash
npm run lint
npm test -- --runInBand
npm run typecheck
```

## CI

GitHub Actions runs lint, tests, and typecheck on pull requests and pushes to `main`.

Workflow: `.github/workflows/ci.yml`

## QA And Security

- Manual QA checklist: [docs/manual-qa-checklist.md](docs/manual-qa-checklist.md)
- E2E test plan: [docs/e2e-plan.md](docs/e2e-plan.md)
- Supabase RLS audit: [docs/supabase-rls-audit.md](docs/supabase-rls-audit.md)

## Supabase Types

Regenerate database types after schema changes:

```bash
npm run gen:types
```
