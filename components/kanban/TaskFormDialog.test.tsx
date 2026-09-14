import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Task } from "@/types/task";

vi.mock("@/app/actions/tasks", () => ({
  createTask: vi.fn(async () => ({})),
  updateTask: vi.fn(async () => ({})),
}));

import { createTask, updateTask } from "@/app/actions/tasks";
import { TaskFormDialog } from "@/components/kanban/TaskFormDialog";

const createTaskMock = createTask as unknown as ReturnType<typeof vi.fn>;
const updateTaskMock = updateTask as unknown as ReturnType<typeof vi.fn>;

const task: Task = {
  id: "task-1",
  title: "Existing task",
  description: null,
  status: "todo",
  position: 0,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

beforeEach(() => {
  createTaskMock.mockClear();
  updateTaskMock.mockClear();
});

describe("TaskFormDialog", () => {
  it("is not visible when open is false", () => {
    render(
      <TaskFormDialog target={{ mode: "create" }} open={false} onClose={vi.fn()} />
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the create title and an empty form when target is create", () => {
    render(<TaskFormDialog target={{ mode: "create" }} open={true} onClose={vi.fn()} />);

    expect(screen.getByRole("dialog")).toHaveTextContent("タスクを追加");
    expect(screen.getByLabelText("タイトル")).toHaveValue("");
  });

  it("shows the edit title and a pre-filled form when target is edit", () => {
    render(
      <TaskFormDialog target={{ mode: "edit", task }} open={true} onClose={vi.fn()} />
    );

    expect(screen.getByRole("dialog")).toHaveTextContent("タスクを編集");
    expect(screen.getByLabelText("タイトル")).toHaveValue("Existing task");
  });

  it("calls onClose when the form's cancel button is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<TaskFormDialog target={{ mode: "create" }} open={true} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "キャンセル" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when dismissed via Escape without touching the task actions", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<TaskFormDialog target={{ mode: "create" }} open={true} onClose={onClose} />);

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalled();
    expect(createTaskMock).not.toHaveBeenCalled();
  });
});
