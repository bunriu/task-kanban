import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSupabaseQueryMock } from "@/test/supabaseMock";
import type { Task } from "@/types/task";

vi.mock("@/lib/supabase", () => ({ supabase: { from: vi.fn() } }));

import { supabase } from "@/lib/supabase";
import { getTasks } from "@/lib/tasks";

const fromMock = supabase.from as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  fromMock.mockReset();
});

const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Buy milk",
    description: null,
    status: "todo",
    position: 0,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
];

describe("getTasks", () => {
  it("returns tasks ordered by creation time on success", async () => {
    const builder = createSupabaseQueryMock<Task[]>({ data: sampleTasks, error: null });
    fromMock.mockReturnValue(builder);

    const result = await getTasks();

    expect(fromMock).toHaveBeenCalledWith("tasks");
    expect(builder.select).toHaveBeenCalledWith("*");
    expect(builder.order).toHaveBeenCalledWith("created_at", { ascending: true });
    expect(result).toEqual(sampleTasks);
  });

  it("returns an empty array when data is null", async () => {
    const builder = createSupabaseQueryMock<Task[] | null>({ data: null, error: null });
    fromMock.mockReturnValue(builder);

    const result = await getTasks();

    expect(result).toEqual([]);
  });

  it("throws a wrapped error when supabase returns an error", async () => {
    const builder = createSupabaseQueryMock<Task[]>({
      data: null,
      error: { message: "connection refused" },
    });
    fromMock.mockReturnValue(builder);

    await expect(getTasks()).rejects.toThrow(/connection refused/);
  });
});
