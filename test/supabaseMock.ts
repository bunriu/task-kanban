import { vi } from "vitest";

type QueryResult<T> = { data: T; error: null } | { data: null; error: { message: string } };

export interface SupabaseQueryMock<T> {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  then: (resolve: (value: QueryResult<T>) => unknown) => Promise<unknown>;
}

/**
 * Mimics supabase-js's chainable PostgrestFilterBuilder: every method returns
 * the same object so `.select().eq().order()` chains, and the object itself
 * is thenable so `await supabase.from(...).x().y()` resolves to `result`.
 */
export function createSupabaseQueryMock<T>(result: QueryResult<T>): SupabaseQueryMock<T> {
  const builder: SupabaseQueryMock<T> = {
    select: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    order: vi.fn(() => builder),
    single: vi.fn(() => Promise.resolve(result)),
    then: (resolve: (value: QueryResult<T>) => unknown) =>
      Promise.resolve(result).then(resolve),
  };
  return builder;
}
