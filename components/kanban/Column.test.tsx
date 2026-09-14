import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Task } from "@/types/task";
import { Column } from "@/components/kanban/Column";

const tasks: Task[] = [
  {
    id: "1",
    title: "Task one",
    description: null,
    status: "todo",
    position: 0,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Task two",
    description: null,
    status: "todo",
    position: 1,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
];

describe("Column", () => {
  it("renders the status label as a header", () => {
    render(
      <Column status="todo" tasks={tasks} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByRole("heading", { name: "未着手" })).toBeInTheDocument();
  });

  it("renders only the tasks it is given", () => {
    render(
      <Column status="todo" tasks={tasks} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText("Task one")).toBeInTheDocument();
    expect(screen.getByText("Task two")).toBeInTheDocument();
  });

  it("renders nothing extra when given an empty list", () => {
    render(<Column status="done" tasks={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "完了" })).toBeInTheDocument();
    expect(screen.queryByText("Task one")).not.toBeInTheDocument();
  });
});
