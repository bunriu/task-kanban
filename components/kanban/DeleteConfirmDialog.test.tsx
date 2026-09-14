import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Task } from "@/types/task";

vi.mock("@/app/actions/tasks", () => ({
  deleteTask: vi.fn(async () => {}),
}));

import { deleteTask } from "@/app/actions/tasks";
import { DeleteConfirmDialog } from "@/components/kanban/DeleteConfirmDialog";

const deleteTaskMock = deleteTask as unknown as ReturnType<typeof vi.fn>;

const task: Task = {
  id: "task-1",
  title: "Buy milk",
  description: null,
  status: "todo",
  position: 0,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

beforeEach(() => {
  deleteTaskMock.mockClear();
});

describe("DeleteConfirmDialog", () => {
  it("is not visible when open is false", () => {
    render(<DeleteConfirmDialog task={task} open={false} onClose={vi.fn()} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the task title in the confirmation text when open", () => {
    render(<DeleteConfirmDialog task={task} open={true} onClose={vi.fn()} />);

    expect(screen.getByRole("dialog")).toHaveTextContent("Buy milk");
  });

  it("does not call deleteTask and closes when Cancel is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<DeleteConfirmDialog task={task} open={true} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "キャンセル" }));

    expect(deleteTaskMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("calls deleteTask with the task id when Delete is confirmed", async () => {
    const user = userEvent.setup();
    render(<DeleteConfirmDialog task={task} open={true} onClose={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "削除" }));

    expect(deleteTaskMock).toHaveBeenCalledWith("task-1");
  });
});
