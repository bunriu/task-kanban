"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TASK_STATUSES, type Task } from "@/types/task";
import { Column } from "@/components/kanban/Column";
import { TaskFormDialog, type FormTarget } from "@/components/kanban/TaskFormDialog";
import { DeleteConfirmDialog } from "@/components/kanban/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";

export function Board({ tasks }: { tasks: Task[] }) {
  const [formTarget, setFormTarget] = useState<FormTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button type="button" onClick={() => setFormTarget({ mode: "create" })}>
          <Plus />
          タスクを追加
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
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
        <TaskFormDialog
          target={formTarget}
          open={true}
          onClose={() => setFormTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmDialog
          task={deleteTarget}
          open={true}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
