"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export default function Navbar() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <header className="border-b border-foreground/10 bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="text-2xl font-semibold">
          Folio
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="hover:text-accent transition-colors">
            Dashboard
          </Link>
          <Link href="/editor" className="hover:text-accent transition-colors">
            Editor
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-foreground/20 px-4 py-1.5 hover:border-accent hover:text-accent transition-colors"
          >
            退出
          </button>
        </nav>
      </div>
    </header>
  );
}
