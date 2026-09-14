import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSupabaseQueryMock } from "@/test/supabaseMock";

vi.mock("@/lib/supabase", () => ({ supabase: { from: vi.fn() } }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { createTask, updateTask, deleteTask } from "@/app/actions/tasks";

const fromMock = supabase.from as unknown as ReturnType<typeof vi.fn>;
const revalidatePathMock = revalidatePath as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  fromMock.mockReset();
  revalidatePathMock.mockReset();
});

function formDataFrom(fields: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }
  return formData;
}

describe("createTask", () => {
  it("returns an error without calling supabase when title is blank", async () => {
    const result = await createTask({}, formDataFrom({ title: "   ", description: "", status: "todo" }));

    expect(result.error).toBeTruthy();
    expect(fromMock).not.toHaveBeenCalled();
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("returns an error when title exceeds 200 characters", async () => {
    const result = await createTask(
      {},
      formDataFrom({ title: "a".repeat(201), description: "", status: "todo" })
    );

    expect(result.error).toBeTruthy();
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("inserts a task and revalidates on success", async () => {
    const builder = createSupabaseQueryMock({ data: null, error: null });
    fromMock.mockReturnValue(builder);

    const result = await createTask(
      {},
      formDataFrom({ title: " Buy milk ", description: "  2%  ", status: "in_progress" })
    );

    expect(fromMock).toHaveBeenCalledWith("tasks");
    expect(builder.insert).toHaveBeenCalledWith({
      title: "Buy milk",
      description: "2%",
      status: "in_progress",
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(result).toEqual({});
  });

  it("returns the supabase error message and does not revalidate on failure", async () => {
    const builder = createSupabaseQueryMock({ data: null, error: { message: "insert failed" } });
    fromMock.mockReturnValue(builder);

    const result = await createTask({}, formDataFrom({ title: "Task", description: "", status: "todo" }));

    expect(result.error).toBe("insert failed");
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });
});

describe("updateTask", () => {
  it("updates a task by id and revalidates on success", async () => {
    const builder = createSupabaseQueryMock({ data: null, error: null });
    fromMock.mockReturnValue(builder);

    const result = await updateTask(
      "task-1",
      {},
      formDataFrom({ title: "Updated", description: "", status: "done" })
    );

    expect(fromMock).toHaveBeenCalledWith("tasks");
    expect(builder.update).toHaveBeenCalledWith({
      title: "Updated",
      description: null,
      status: "done",
    });
    expect(builder.eq).toHaveBeenCalledWith("id", "task-1");
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(result).toEqual({});
  });

  it("returns an error without calling supabase when title is blank", async () => {
    const result = await updateTask("task-1", {}, formDataFrom({ title: "", description: "", status: "todo" }));

    expect(result.error).toBeTruthy();
    expect(fromMock).not.toHaveBeenCalled();
  });
});

describe("deleteTask", () => {
  it("deletes a task by id and revalidates", async () => {
    const builder = createSupabaseQueryMock({ data: null, error: null });
    fromMock.mockReturnValue(builder);

    await deleteTask("task-1");

    expect(fromMock).toHaveBeenCalledWith("tasks");
    expect(builder.delete).toHaveBeenCalled();
    expect(builder.eq).toHaveBeenCalledWith("id", "task-1");
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
  });
});
