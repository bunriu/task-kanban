"use client";

import { TaskForm } from "@/components/kanban/TaskForm";
import type { Task } from "@/types/task";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type FormTarget = { mode: "create" } | { mode: "edit"; task: Task };

export function TaskFormDialog({
  target,
  open,
  onClose,
}: {
  target: FormTarget;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <Dialog
      open
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{target.mode === "create" ? "タスクを追加" : "タスクを編集"}</DialogTitle>
        </DialogHeader>
        <TaskForm
          mode={target.mode}
          task={target.mode === "edit" ? target.task : undefined}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
