"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { TASK_STATUSES, type TaskStatus } from "@/types/task";

export type TaskFormState = { error?: string };

const MAX_TITLE = 200;
const MAX_DESCRIPTION = 2000;

function parseTaskForm(
  formData: FormData
): TaskFormState & { title?: string; description?: string | null; status?: TaskStatus } {
  const title = String(formData.get("title") ?? "").trim();
  const descriptionRaw = String(formData.get("description") ?? "").trim();
  const description = descriptionRaw.length > 0 ? descriptionRaw : null;
  const statusRaw = String(formData.get("status") ?? "todo");
  const status = (TASK_STATUSES as readonly string[]).includes(statusRaw)
    ? (statusRaw as TaskStatus)
    : "todo";

  if (title.length === 0) return { error: "タイトルを入力してください。" };
  if (title.length > MAX_TITLE) return { error: `タイトルは${MAX_TITLE}文字以内で入力してください。` };
  if (description && description.length > MAX_DESCRIPTION) {
    return { error: `説明は${MAX_DESCRIPTION}文字以内で入力してください。` };
  }

  return { title, description, status };
}

export async function createTask(
  _prevState: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  const parsed = parseTaskForm(formData);
  if (parsed.error) return { error: parsed.error };

  const { error } = await supabase.from("tasks").insert({
    title: parsed.title,
    description: parsed.description,
    status: parsed.status,
  });
  if (error) return { error: error.message };

  revalidatePath("/");
  return {};
}

export async function updateTask(
  id: string,
  _prevState: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  const parsed = parseTaskForm(formData);
  if (parsed.error) return { error: parsed.error };

  const { error } = await supabase
    .from("tasks")
    .update({
      title: parsed.title,
      description: parsed.description,
      status: parsed.status,
    })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  return {};
}

export async function deleteTask(id: string): Promise<void> {
  await supabase.from("tasks").delete().eq("id", id);
  revalidatePath("/");
}
