# Repository Guidelines

## Project Structure & Module Organization

This repository is a small workspace whose product application lives in `app/`.

- `app/src/app/`: Next.js App Router routes, layouts, and global styles.
- `app/src/components/`: reusable UI components such as campaign cards and the site header.
- `app/src/lib/`: shared domain data and utilities.
- `app/public/`: static assets and the lightweight service worker.
- `supabase/migrations/`: schema, RPCs, RLS policies, and Jaén location seed.
- `app/src/**/*.test.ts`: Vitest unit and security-contract tests.
- Root `*.md` files: product, technical, design, and implementation references. Read these before making product-level changes.

Use the `@/*` import alias for modules below `app/src`; for example, `@/components/campaign-card`.

## Build, Test, and Development Commands

Run commands from the repository root:

- `npm run dev`: starts the Next.js development server through `app/`.
- `npm run build`: creates the production build.
- `npm run start`: serves an already-built production application.
- `npm run lint`, `npm run typecheck`, and `npm test`: run quality gates.

For app-specific commands, use `npm --prefix app run <script>`. Install dependencies with `npm install` at the root and, when changing app dependencies, `npm --prefix app install`.

Vitest covers validation and database security contracts. Name tests `*.test.ts`, keep them next to the module under test, and run `npm test`. For auth or RLS changes, add a regression assertion and manually verify worker, farmer, admin, and anonymous access. Before a pull request, run all four quality commands and check 375px mobile layout.

## Coding Style & Naming Conventions

Write TypeScript and React function components. Keep `strict` TypeScript compatibility and prefer `@/` imports over long relative paths. Use two-space indentation, semicolons, and descriptive Spanish product copy.

Name route directories by URL segment (`campanas/[slug]`), components in kebab-case filenames (`campaign-card.tsx`), and exported React components in PascalCase (`CampaignCard`). Keep shared data out of page components when it can live in `src/lib/`.

ESLint uses Next.js Core Web Vitals and TypeScript rules via `app/eslint.config.mjs`; resolve its findings instead of suppressing them without justification.

## Commit & Pull Request Guidelines

Follow the existing Conventional Commit style: `feat: add campaign details`, `fix: restore Tailwind styles`, or `chore: update tooling`. Keep each commit focused and use an imperative summary.

Pull requests should explain the user-facing change, list validation performed, link the relevant issue or plan phase when available, and include screenshots for visual changes. Do not commit `.env` files, secrets, or generated `.next/` output.
