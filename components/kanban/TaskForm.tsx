"use client";

import { useActionState, useEffect } from "react";
import { createTask, updateTask, type TaskFormState } from "@/app/actions/tasks";
import { TASK_STATUSES, TASK_STATUS_LABELS, type Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="task-title">タイトル</Label>
        <Input
          id="task-title"
          name="title"
          type="text"
          required
          maxLength={200}
          defaultValue={task?.title ?? ""}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="task-description">説明</Label>
        <Textarea
          id="task-description"
          name="description"
          maxLength={2000}
          defaultValue={task?.description ?? ""}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="task-status">ステータス</Label>
        <Select name="status" defaultValue={task?.status ?? "todo"} items={TASK_STATUS_LABELS}>
          <SelectTrigger id="task-status" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TASK_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {TASK_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          キャンセル
        </Button>
        <Button type="submit" disabled={pending}>
          保存
        </Button>
      </div>
    </form>
  );
}
