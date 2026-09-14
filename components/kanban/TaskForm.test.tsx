import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Task } from "@/types/task";

vi.mock("@/app/actions/tasks", () => ({
  createTask: vi.fn(async () => ({})),
  updateTask: vi.fn(async () => ({})),
}));

import { createTask, updateTask } from "@/app/actions/tasks";
import { TaskForm } from "@/components/kanban/TaskForm";

const createTaskMock = createTask as unknown as ReturnType<typeof vi.fn>;
const updateTaskMock = updateTask as unknown as ReturnType<typeof vi.fn>;

const task: Task = {
  id: "task-1",
  title: "Existing task",
  description: "Existing description",
  status: "in_progress",
  position: 0,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

beforeEach(() => {
  createTaskMock.mockClear();
  updateTaskMock.mockClear();
});

describe("TaskForm", () => {
  it("renders empty title/description/status fields in create mode", () => {
    render(<TaskForm mode="create" onClose={vi.fn()} />);

    expect(screen.getByLabelText("タイトル")).toHaveValue("");
    expect(screen.getByLabelText("説明")).toHaveValue("");
    expect(screen.getByLabelText("ステータス")).toHaveValue("todo");
  });

  it("pre-fills fields from the task in edit mode", () => {
    render(<TaskForm mode="edit" task={task} onClose={vi.fn()} />);

    expect(screen.getByLabelText("タイトル")).toHaveValue("Existing task");
    expect(screen.getByLabelText("説明")).toHaveValue("Existing description");
    expect(screen.getByLabelText("ステータス")).toHaveValue("in_progress");
  });

  it("submits via createTask in create mode", async () => {
    const user = userEvent.setup();
    render(<TaskForm mode="create" onClose={vi.fn()} />);

    await user.type(screen.getByLabelText("タイトル"), "New task");
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(createTaskMock).toHaveBeenCalled();
  });

  it("submits via updateTask bound to the task id in edit mode", async () => {
    const user = userEvent.setup();
    render(<TaskForm mode="edit" task={task} onClose={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(updateTaskMock).toHaveBeenCalled();
  });

  it("shows an error message returned by the action", async () => {
    createTaskMock.mockResolvedValueOnce({ error: "タイトルを入力してください。" });
    const user = userEvent.setup();
    render(<TaskForm mode="create" onClose={vi.fn()} />);

    await user.type(screen.getByLabelText("タイトル"), "   ");
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(await screen.findByText("タイトルを入力してください。")).toBeInTheDocument();
  });

  it("calls onClose when the cancel button is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<TaskForm mode="create" onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "キャンセル" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose automatically after a successful submission", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<TaskForm mode="create" onClose={onClose} />);

    await user.type(screen.getByLabelText("タイトル"), "New task");
    await user.click(screen.getByRole("button", { name: "保存" }));

    await vi.waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("does not call onClose automatically when the submission returns an error", async () => {
    createTaskMock.mockResolvedValueOnce({ error: "タイトルを入力してください。" });
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<TaskForm mode="create" onClose={onClose} />);

    await user.type(screen.getByLabelText("タイトル"), "   ");
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(await screen.findByText("タイトルを入力してください。")).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });
});
