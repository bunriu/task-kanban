"use client";

import { deleteTask } from "@/app/actions/tasks";
import type { Task } from "@/types/task";

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
    <dialog
      open
      className="rounded border border-zinc-300 p-4 dark:border-zinc-700 dark:bg-zinc-900"
    >
      <p>「{task.title}」を削除しますか?この操作は取り消せません。</p>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="rounded px-3 py-1">
          キャンセル
        </button>
        <form
          action={async () => {
            await deleteTask(task.id);
            onClose();
          }}
        >
          <button type="submit" className="rounded bg-red-600 px-3 py-1 text-white">
            削除
          </button>
        </form>
      </div>
    </dialog>
  );
}
