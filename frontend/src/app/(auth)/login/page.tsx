"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import { registerProfile } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = getSupabaseClient();

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    try {
      await registerProfile({
        email: data.user?.email ?? email,
        display_name:
          (data.user?.user_metadata?.display_name as string | undefined) ?? "",
      });
    } catch {
      // 忽略 profile 幂等错误
    }

    router.replace(nextPath);
  };

  useEffect(() => {
    const maybeNext = new URLSearchParams(window.location.search).get("next");
    if (maybeNext) {
      setNextPath(maybeNext);
    }
  }, []);

  return (
    <main className="fade-in min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-foreground/10 bg-white/40 p-8 shadow-sm">
        <h1 className="text-4xl font-semibold">登录 Folio</h1>
        <p className="mt-2 text-sm text-foreground/70">继续管理你的作品集</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-foreground/20 bg-white px-3 py-2 outline-none focus:border-accent"
              placeholder="请输入密码"
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
            {loading ? "登录中..." : "登录"}
          </button>
        </form>

        <p className="mt-6 text-sm text-foreground/70">
          还没有账号？
          <Link href="/register" className="ml-1 text-accent hover:underline">
            立即注册
          </Link>
        </p>
      </div>
    </main>
  );
}
