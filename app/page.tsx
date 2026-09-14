import { getTasks } from "@/lib/tasks";
import { Board } from "@/components/kanban/Board";

export default async function Home() {
  const tasks = await getTasks();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 px-6 py-10 dark:bg-black sm:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Task Board
        </h1>
        <Board tasks={tasks} />
      </div>
    </div>
  );
}
