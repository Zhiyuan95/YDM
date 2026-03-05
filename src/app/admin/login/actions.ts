"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Return an error to the frontend instead of generic redirect for better UX later, 
    // or just redirect to an error page for MVP simplicity.
    redirect("/admin/login?message=Could not authenticate user");
  }

  revalidatePath("/", "layout");
  redirect("/admin/upload");
}
