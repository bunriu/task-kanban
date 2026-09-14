"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TASK_STATUSES, type Task } from "@/types/task";
import { Column } from "@/components/kanban/Column";
import { TaskForm } from "@/components/kanban/TaskForm";
import { DeleteConfirmDialog } from "@/components/kanban/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type FormTarget = { mode: "create" } | { mode: "edit"; task: Task };

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
        <Dialog
          open
          onOpenChange={(next) => {
            if (!next) setFormTarget(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {formTarget.mode === "create" ? "タスクを追加" : "タスクを編集"}
              </DialogTitle>
            </DialogHeader>
            <TaskForm
              mode={formTarget.mode}
              task={formTarget.mode === "edit" ? formTarget.task : undefined}
              onClose={() => setFormTarget(null)}
            />
          </DialogContent>
        </Dialog>
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
