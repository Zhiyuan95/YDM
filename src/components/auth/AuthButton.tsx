import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CloudUpload } from "lucide-react";
import SignOutButton from "@/components/auth/SignOutButton";

export default async function AuthButton() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  };

  if (!user) {
    return (
      <Link
        href="/admin/login"
        className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors bg-white/50 px-3 py-1.5 border border-zinc-200 rounded-full shadow-sm"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-white/50 px-3 py-1.5 border border-zinc-200 rounded-full shadow-sm backdrop-blur-sm">
      <Link 
        href="/admin/upload"
        className="flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
      >
        <CloudUpload className="w-4 h-4 mr-1.5" />
        上传
      </Link>
      <div className="w-px h-4 bg-zinc-300"></div>
      <form action={signOut}>
        <SignOutButton signOutAction={signOut} />
      </form>
    </div>
  );
}
