import type { Task, TaskStatus } from "@/types/task";
import { TASK_STATUS_LABELS } from "@/types/task";
import { TaskCard } from "@/components/kanban/TaskCard";

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
    <div className="flex min-w-[16rem] flex-1 flex-col gap-3 rounded-lg bg-zinc-100 p-3 dark:bg-zinc-900/50">
      <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        {TASK_STATUS_LABELS[status]}
      </h2>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
