"use client";

import { useActionState, useEffect } from "react";
import { createTask, updateTask, type TaskFormState } from "@/app/actions/tasks";
import { TASK_STATUSES, TASK_STATUS_LABELS, type Task } from "@/types/task";

const initialState: TaskFormState = {};

export function TaskForm({
  mode,
  task,
  onClose,
}: {
  mode: "create" | "edit";
  task?: Task;
  onClose: () => void;
}) {
  const action = mode === "create" ? createTask : updateTask.bind(null, task!.id);
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state !== initialState && !state.error) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="task-title">タイトル</label>
        <input
          id="task-title"
          name="title"
          type="text"
          required
          maxLength={200}
          defaultValue={task?.title ?? ""}
          className="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="task-description">説明</label>
        <textarea
          id="task-description"
          name="description"
          maxLength={2000}
          defaultValue={task?.description ?? ""}
          className="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="task-status">ステータス</label>
        <select
          id="task-status"
          name="status"
          defaultValue={task?.status ?? "todo"}
          className="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900"
        >
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {TASK_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="rounded px-3 py-1">
          キャンセル
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-zinc-900 px-3 py-1 text-white dark:bg-zinc-50 dark:text-zinc-900"
        >
          保存
        </button>
      </div>
    </form>
  );
}
