@AGENTS.md

# Supabase

- Project: `task-kanban` (ref `oggcdgzzanjfsisgrlos`, region `ap-northeast-1`). Managed via the `supabase` MCP server (`.mcp.json`) — use its tools (`list_tables`, `apply_migration`, `execute_sql`, `get_advisors`, etc.) instead of guessing schema or editing the DB by hand.
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - `.env.example` holds the key names only and is committed.
  - `.env.local` holds the real values and is gitignored (`.gitignore` has `.env*` + `!.env.example`). Get fresh values via MCP `get_project_url` / `get_publishable_keys` if it's ever missing, never hardcode them elsewhere.
- Client: `lib/supabase.ts` exports a singleton `supabase` client built with `@supabase/supabase-js`'s `createClient`, using the anon key. It throws at import time if the env vars are missing — import it, don't re-instantiate clients ad hoc.
- Startup check: `instrumentation.ts` (`register()`) runs once when the Next.js server boots (Node runtime only) and calls `supabase.auth.getSession()` as a connectivity probe. Success is silent by design; failure logs `console.error("[Supabase] Connection check failed:", ...)`. Don't add a success log back — that was an explicit request.
- Schema changes: use MCP `apply_migration` (creates a tracked migration) rather than `execute_sql` for DDL, so history stays in `supabase/migrations`. Run `get_advisors` after schema changes to catch missing RLS policies etc.
- No server-side/service-role client exists yet — only the anon-key browser/server-shared client. Add a separate service-role client (`lib/supabase-admin.ts`, using `SUPABASE_SERVICE_ROLE_KEY`, server-only) only when a feature actually needs to bypass RLS.
