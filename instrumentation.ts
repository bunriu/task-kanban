export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { supabase } = await import("@/lib/supabase");

  const { error } = await supabase.auth.getSession();

  if (error) {
    console.error("[Supabase] Connection check failed:", error.message);
  }
}
