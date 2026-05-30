# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with Turbopack (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
npm run db:migrate   # Run Sequelize migrations against the configured DB
```

No test framework is installed — there are no test scripts or test files.

## Architecture

Full-stack Next.js 15 app using the **App Router**. There is no separate backend server; API routes live under `src/app/api/` and run as serverless functions on Vercel.

**Database**: Neon serverless PostgreSQL. The ORM is Sequelize with sequelize-typescript. Models live in `models/`, migrations in `migrations/`, and DB config in `config/config.json`. The `.env` file holds the Neon connection string (`DATABASE_URL` pooler URL).

**Auth**: JWT-based sessions stored as `HttpOnly` cookies. `src/utils/auth.ts` handles token signing/verification (jose + jsonwebtoken) and bcrypt password hashing. `src/middleware.ts` protects routes by validating the JWT cookie. `src/contexts/AuthContext.tsx` provides auth state client-side.

**Roles**: Users can be `buyer`, `seller`, `user`, or `admin`. Route segments under `src/app/buyer/` and `src/app/seller/` serve role-specific views.

**Data model** (7 tables): Users → Requests (buyer postings) → Proposals (seller offers) → Messages (per-proposal thread) → Transactions → Reviews → Files (request attachments).

**AI feature**: `src/lib/ollama.js` calls a locally running Ollama instance (model `llama3.2:3b`) to translate natural language into SQL. The `/api/ollama-sql` route exposes this. The home page (`src/app/page.tsx`) has an AI search bar wired to this endpoint.

## Key Conventions

- Path alias `@/*` maps to `./src/*` (configured in `tsconfig.json`).
- Formatting: Prettier with single quotes, 2-space indent, 80-char line width (`.prettierrc`).
- Tailwind CSS 4 via PostCSS — no `tailwind.config.*` file; configuration is in `postcss.config.mjs`.
- `src/components/ClientLayout.tsx` wraps the app shell and reads auth context to show/hide navigation. Add new global client-side providers here.

## Environment

Required `.env` variables:
- `DATABASE_URL` — Neon Postgres pooler connection string
- `JWT_SECRET` — secret for signing JWTs (falls back to a hardcoded default if missing — always set explicitly)
- Ollama must be running locally for AI search features to work
