import type { Task, TaskStatus } from "@/types/task";
import { TASK_STATUS_LABELS } from "@/types/task";
import { TaskCard } from "@/components/kanban/TaskCard";
import { Badge } from "@/components/ui/badge";

const STATUS_BADGE_VARIANT: Record<TaskStatus, "outline" | "secondary" | "default"> = {
  todo: "outline",
  in_progress: "secondary",
  done: "default",
};

export function Column({
  status,
  tasks,
  onEdit,
  onDelete,
}: {
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  return (
    <div className="flex min-w-64 flex-1 flex-col gap-3 rounded-xl bg-muted/40 p-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-foreground">{TASK_STATUS_LABELS[status]}</h2>
        <Badge variant={STATUS_BADGE_VARIANT[status]}>{tasks.length}</Badge>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
