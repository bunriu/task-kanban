"use client";

import { useState } from "react";
import { TASK_STATUSES, type Task } from "@/types/task";
import { Column } from "@/components/kanban/Column";
import { TaskForm } from "@/components/kanban/TaskForm";
import { DeleteConfirmDialog } from "@/components/kanban/DeleteConfirmDialog";

type FormTarget = { mode: "create" } | { mode: "edit"; task: Task };

export function Board({ tasks }: { tasks: Task[] }) {
  const [formTarget, setFormTarget] = useState<FormTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setFormTarget({ mode: "create" })}
          className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white dark:bg-zinc-50 dark:text-zinc-900"
        >
          + タスクを追加
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        {TASK_STATUSES.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            onEdit={(task) => setFormTarget({ mode: "edit", task })}
            onDelete={(task) => setDeleteTarget(task)}
          />
        ))}
      </div>

      {formTarget && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-4 dark:bg-zinc-900">
            <TaskForm
              mode={formTarget.mode}
              task={formTarget.mode === "edit" ? formTarget.task : undefined}
              onClose={() => setFormTarget(null)}
            />
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <DeleteConfirmDialog
            task={deleteTarget}
            open={true}
            onClose={() => setDeleteTarget(null)}
          />
        </div>
      )}
    </div>
  );
}
