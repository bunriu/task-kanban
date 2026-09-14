"use client";

import { deleteTask } from "@/app/actions/tasks";
import type { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DeleteConfirmDialog({
  task,
  open,
  onClose,
}: {
  task: Task;
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
          <DialogTitle>タスクを削除しますか?</DialogTitle>
          <DialogDescription>
            「{task.title}」を削除しますか?この操作は取り消せません。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <form
            action={async () => {
              await deleteTask(task.id);
              onClose();
            }}
          >
            <Button type="submit" variant="destructive">
              削除
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
