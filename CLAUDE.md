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

## `tasks` table

- Created via MCP `apply_migration` (`create_tasks_table`, plus a follow-up `fix_set_updated_at_search_path` migration — always set `search_path = ''` on new `SECURITY`-relevant functions to avoid the `function_search_path_mutable` advisor warning from the start).
- Columns: `id uuid pk default gen_random_uuid()`, `title text not null` (check: non-blank after trim, ≤200 chars), `description text` (nullable, check: ≤2000 chars), `status public.task_status` (enum `todo`/`in_progress`/`done`, default `todo`), `position integer default 0` (reserved for future manual/drag-and-drop ordering — not used by any UI yet, don't repurpose it for something else), `created_at`/`updated_at timestamptz` (`updated_at` auto-maintained by the `tasks_set_updated_at` trigger — never set it manually from application code).
- RLS is **enabled but intentionally fully open** to the `anon` role (`for all using (true) with check (true)`) — this is a deliberate v1 scope decision (no login, single shared board), not an oversight. If auth is ever introduced, this policy must be replaced with per-user scoping; don't add auth-shaped columns/policies speculatively before that's actually decided.
- Run `get_advisors` (type `security`) after any further schema change here — it should return zero lints.

## Task kanban feature (CRUD)

Architecture: Server Actions + Server Components (Next.js App Router), not client-side `supabase-js` calls from components. Data flow:

- `lib/tasks.ts` — `getTasks()`, a plain async function (not a Server Action) that reads from Supabase. Kept out of `app/actions/tasks.ts` deliberately: a file-level `"use server"` directive turns every export into a publicly invocable Server Action, which is unwanted exposure for a read path.
- `app/actions/tasks.ts` (`"use server"`) — `createTask`/`updateTask`/`deleteTask`. Validation (title required/trimmed/≤200 chars, description ≤2000) happens here as the authoritative layer, on top of an HTML `required`/`maxLength` client-side hint and the DB `check` constraints as the last line of defense. Every mutation ends with `revalidatePath("/")`.
- `app/page.tsx` is an `async` Server Component that calls `getTasks()` and renders `<Board tasks={tasks} />`. **`Board` must derive its columns directly from the `tasks` prop on every render, never copy it into `useState`** — this is what makes `revalidatePath` produce an immediate list update after add/edit/delete; `useState(tasks)` would freeze the board on first-render data.
- `components/kanban/{Board,Column,TaskCard,TaskForm,DeleteConfirmDialog}.tsx` — `TaskForm` is shared by create/edit (via `useActionState`, action chosen by `mode`) and auto-closes itself (`useEffect` comparing `state` against the initial state object by reference) once a submission succeeds with no `error`. `DeleteConfirmDialog` is a native `<dialog>` that is **conditionally rendered** (`if (!open) return null`) rather than toggling the `open` attribute on an always-mounted element or using `showModal()/close()` — jsdom doesn't apply the UA stylesheet that hides a closed `<dialog>`, so an always-mounted approach would make "not open" indistinguishable from "open" in tests.

## Testing (Vitest + Testing Library)

Introduced from scratch for this feature — `vitest.config.ts` (jsdom, `vite-tsconfig-paths` for the `@/*` alias) + `vitest.setup.ts`. Run with `npm run test` (single run) / `npm run test:watch`. Conventions and gotchas worth knowing before adding more tests:

- Tests are colocated with the code they test (`Foo.tsx` + `Foo.test.tsx`), not under a parallel `__tests__/` tree.
- `vitest.setup.ts` registers `afterEach(cleanup)` from `@testing-library/react` explicitly — `test.globals` is off (each test file imports `describe/it/expect/vi` from `"vitest"` itself), so Testing Library's usual auto-cleanup-via-global-`afterEach` doesn't fire on its own. Without this, DOM from one test leaks into the next within the same file and breaks `getByRole`/`getByText` uniqueness.
- `test/supabaseMock.ts` exports `createSupabaseQueryMock(result)`, a thenable chainable fake for `supabase.from(...).select().eq().order()`-style chains. Any test touching `@/lib/supabase` or `@/lib/tasks`/`@/app/actions/tasks` should `vi.mock("@/lib/supabase", () => ({ supabase: { from: vi.fn() } }))` and drive `fromMock.mockReturnValue(createSupabaseQueryMock({ data, error }))` rather than hitting the real project.
- Any test that imports a module calling `revalidatePath` must `vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))` — it throws outside a real Next request context otherwise.
- `app/actions/tasks.ts`'s `"use server"` directive is inert under Vitest (Vite/esbuild, not the Next compiler) — its exports are just testable async functions, no special handling needed.
- `app/page.tsx` (async Server Component) is **not** unit-testable with RTL — it's covered by `npm run build`'s type-check/compile step plus manual/browser verification only. This is exactly why real logic lives in `lib/tasks.ts` and `components/kanban/Board.tsx` (a Client Component taking `tasks` as a prop) instead.
- Don't write a form-submission test against a truly empty `required` field expecting to see a server-returned error — jsdom honors HTML5 `required` validation and blocks submission before the action ever runs. To exercise server-side validation (e.g. the blank-title check), submit a value that passes HTML validation but fails the server's own rule (e.g. whitespace-only title).
