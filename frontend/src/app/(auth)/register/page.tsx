"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import { registerProfile } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = getSupabaseClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setLoading(false);
      router.replace("/login");
      return;
    }

    try {
      await registerProfile({
        email,
        display_name: displayName,
      });
    } catch (profileError) {
      setError(
        profileError instanceof Error
          ? profileError.message
          : "Profile 创建失败",
      );
      setLoading(false);
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <main className="fade-in min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-foreground/10 bg-white/40 p-8 shadow-sm">
        <h1 className="text-4xl font-semibold">创建 Folio 账号</h1>
        <p className="mt-2 text-sm text-foreground/70">几步开始托管你的作品集</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm">显示名</label>
            <input
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="w-full rounded-xl border border-foreground/20 bg-white px-3 py-2 outline-none focus:border-accent"
              placeholder="Li Hua"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">邮箱</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-foreground/20 bg-white px-3 py-2 outline-none focus:border-accent"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">密码</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-foreground/20 bg-white px-3 py-2 outline-none focus:border-accent"
              placeholder="至少 6 位"
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent px-4 py-2.5 font-medium text-white transition-opacity disabled:opacity-60"
          >
            {loading ? "创建中..." : "注册"}
          </button>
        </form>

        <p className="mt-6 text-sm text-foreground/70">
          已有账号？
          <Link href="/login" className="ml-1 text-accent hover:underline">
            去登录
          </Link>
        </p>
      </div>
    </main>
  );
}
