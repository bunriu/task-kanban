import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Task } from "@/types/task";

vi.mock("@/app/actions/tasks", () => ({
  createTask: vi.fn(async () => ({})),
  updateTask: vi.fn(async () => ({})),
  deleteTask: vi.fn(async () => {}),
}));

import { deleteTask } from "@/app/actions/tasks";
import { Board } from "@/components/kanban/Board";

const deleteTaskMock = deleteTask as unknown as ReturnType<typeof vi.fn>;

const tasks: Task[] = [
  {
    id: "1",
    title: "Todo task",
    description: null,
    status: "todo",
    position: 0,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    title: "In progress task",
    description: null,
    status: "in_progress",
    position: 0,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    title: "Done task",
    description: null,
    status: "done",
    position: 0,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
];

beforeEach(() => {
  deleteTaskMock.mockClear();
});

describe("Board", () => {
  it("renders three columns with the correct task membership", () => {
    render(<Board tasks={tasks} />);

    expect(screen.getByRole("heading", { name: "未着手" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "進行中" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "完了" })).toBeInTheDocument();
    expect(screen.getByText("Todo task")).toBeInTheDocument();
    expect(screen.getByText("In progress task")).toBeInTheDocument();
    expect(screen.getByText("Done task")).toBeInTheDocument();
  });

  it("opens the create form when Add Task is clicked", async () => {
    const user = userEvent.setup();
    render(<Board tasks={tasks} />);

    await user.click(screen.getByRole("button", { name: "+ タスクを追加" }));

    expect(screen.getByLabelText("タイトル")).toBeInTheDocument();
  });

  it("opens the edit form pre-filled when a card's Edit is clicked", async () => {
    const user = userEvent.setup();
    render(<Board tasks={tasks} />);

    const todoCardEditButtons = screen.getAllByRole("button", { name: "編集" });
    await user.click(todoCardEditButtons[0]);

    expect(screen.getByLabelText("タイトル")).toHaveValue("Todo task");
  });

  it("deletes a task after confirming in the dialog", async () => {
    const user = userEvent.setup();
    render(<Board tasks={tasks} />);

    const deleteButtons = screen.getAllByRole("button", { name: "削除" });
    await user.click(deleteButtons[0]);

    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: "削除" }));

    expect(deleteTaskMock).toHaveBeenCalledWith("1");
  });
});
