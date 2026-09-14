import { supabase } from "@/lib/supabase";
import type { Task } from "@/types/task";

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Failed to load tasks: ${error.message}`);

  return data ?? [];
}
