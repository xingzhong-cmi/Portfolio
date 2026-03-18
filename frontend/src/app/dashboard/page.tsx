"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import RequireAuth from "@/components/RequireAuth";
import { getMyPortfolio, listMyArtworks, updatePortfolio } from "@/lib/api";
import type { Portfolio } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [artworkCount, setArtworkCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [portfolioData, artworks] = await Promise.all([
        getMyPortfolio(),
        listMyArtworks(),
      ]);
      // New user with no content → go straight to editor
      if (!portfolioData || artworks.length === 0) {
        router.replace("/editor");
        return;
      }
      setPortfolio(portfolioData);
      setArtworkCount(artworks.length);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "加载数据失败",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const togglePublish = async () => {
    if (!portfolio) return;
    setToggling(true);
    try {
      await updatePortfolio({ is_published: !portfolio.is_published });
      await loadData();
      toast.success(portfolio.is_published ? "已取消发布" : "作品集已发布！");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "操作失败");
    } finally {
      setToggling(false);
    }
  };

  const copyLink = () => {
    if (!portfolio?.slug) return;
    const url = `${window.location.origin}/${portfolio.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("链接已复制到剪贴板");
    });
  };

  if (loading) {
    return (
      <RequireAuth>
        <Navbar />
        <main className="flex min-h-[40vh] items-center justify-center text-sm text-foreground/70">
          加载中...
        </main>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <Navbar />
      <main className="fade-in mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-5xl font-semibold">Dashboard</h1>
        <p className="mt-3 text-foreground/70">你的 Folio 工作台</p>

        {error ? (
          <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-foreground/10 bg-white/50 p-6">
            <p className="text-sm text-foreground/70">状态</p>
            <p className={`mt-2 text-2xl font-semibold ${portfolio?.is_published ? "text-green-600" : ""}`}>
              {portfolio?.is_published ? "Published ✓" : "Draft"}
            </p>
          </article>
          <article className="rounded-2xl border border-foreground/10 bg-white/50 p-6">
            <p className="text-sm text-foreground/70">作品数</p>
            <p className="mt-2 text-2xl font-semibold">{artworkCount}</p>
          </article>
          <article className="rounded-2xl border border-foreground/10 bg-white/50 p-6">
            <p className="text-sm text-foreground/70">公开地址</p>
            {portfolio?.slug ? (
              <div className="mt-2 flex items-center gap-2">
                <span className={`text-sm font-medium ${portfolio.is_published ? "text-accent" : "text-foreground/40"}`}>
                  /{portfolio.slug}
                  {!portfolio.is_published && " (未发布)"}
                </span>
                <button
                  type="button"
                  onClick={copyLink}
                  className="rounded-lg border border-foreground/15 px-2 py-0.5 text-xs text-foreground/60 transition-colors hover:border-accent hover:text-accent"
                  title="复制链接"
                >
                  复制
                </button>
              </div>
            ) : (
              <p className="mt-2 text-sm font-medium text-foreground/40">未生成</p>
            )}
          </article>
        </section>

        {portfolio?.template_name && (
          <section className="mt-6 rounded-2xl border border-foreground/10 bg-white/50 p-6">
            <p className="text-sm text-foreground/70">当前模板</p>
            <p className="mt-1 text-lg font-medium capitalize">{portfolio.template_name}</p>
          </section>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/editor"
            className="rounded-xl bg-accent px-5 py-2.5 font-medium text-white"
          >
            编辑作品集
          </Link>
          {portfolio && (
            <Link
              href="/preview"
              className="rounded-xl border border-foreground/20 px-5 py-2.5 font-medium"
            >
              预览
            </Link>
          )}
          {portfolio && (
            <button
              type="button"
              onClick={togglePublish}
              disabled={toggling}
              className={`rounded-xl border px-5 py-2.5 font-medium disabled:opacity-60 ${
                portfolio.is_published
                  ? "border-red-300 text-red-600"
                  : "border-green-300 text-green-600"
              }`}
            >
              {toggling
                ? "处理中..."
                : portfolio.is_published
                  ? "取消发布"
                  : "发布"}
            </button>
          )}
          {portfolio?.slug && portfolio?.is_published ? (
            <Link
              href={`/${portfolio.slug}`}
              className="rounded-xl border border-foreground/20 px-5 py-2.5 font-medium"
            >
              查看公开页面
            </Link>
          ) : null}
        </div>
      </main>
    </RequireAuth>
  );
}
