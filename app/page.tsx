import { getTasks } from "@/lib/tasks";
import { Board } from "@/components/kanban/Board";

export default async function Home() {
  const tasks = await getTasks();

  return (
    <div className="flex flex-1 flex-col bg-muted/30 px-6 py-10 sm:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Task Board</h1>
          <p className="text-sm text-muted-foreground">
            タスクの追加・編集・削除ができるシンプルなカンバンボードです。
          </p>
        </div>
        <Board tasks={tasks} />
      </div>
    </div>
  );
}
