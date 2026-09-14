"use client";

import type { Task } from "@/types/task";

export function TaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  return (
    <div className="rounded border border-zinc-300 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="font-medium text-zinc-900 dark:text-zinc-50">{task.title}</h3>
      {task.description && (
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{task.description}</p>
      )}
      <div className="mt-3 flex justify-end gap-2 text-sm">
        <button type="button" onClick={() => onEdit(task)} className="text-zinc-600 dark:text-zinc-400">
          編集
        </button>
        <button type="button" onClick={() => onDelete(task)} className="text-red-600 dark:text-red-400">
          削除
        </button>
      </div>
    </div>
  );
}
