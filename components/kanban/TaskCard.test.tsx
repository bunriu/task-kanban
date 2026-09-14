import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Task } from "@/types/task";
import { TaskCard } from "@/components/kanban/TaskCard";

const task: Task = {
  id: "task-1",
  title: "Buy milk",
  description: "2% milk, 1 gallon",
  status: "todo",
  position: 0,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("TaskCard", () => {
  it("renders the task title and description", () => {
    render(<TaskCard task={task} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByText("2% milk, 1 gallon")).toBeInTheDocument();
  });

  it("calls onEdit with the task when Edit is clicked", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    render(<TaskCard task={task} onEdit={onEdit} onDelete={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "編集" }));

    expect(onEdit).toHaveBeenCalledWith(task);
  });

  it("calls onDelete with the task when Delete is clicked", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<TaskCard task={task} onEdit={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: "削除" }));

    expect(onDelete).toHaveBeenCalledWith(task);
  });
});
