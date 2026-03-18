"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import RequireAuth from "@/components/RequireAuth";
import ArtworkUploader from "@/components/ArtworkUploader";
import TemplateSelector from "@/components/TemplateSelector";
import {
  getMyPortfolio,
  createPortfolio,
  updatePortfolio,
  listMyArtworks,
} from "@/lib/api";
import type { Artwork, Portfolio } from "@/types";

type Step = 1 | 2 | 3;

export default function EditorPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [templateName, setTemplateName] = useState<"minimal" | "dark" | "magazine" | "cyber">("minimal");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [p, a] = await Promise.all([getMyPortfolio(), listMyArtworks()]);
      if (p) {
        setPortfolio(p);
        setTemplateName(p.template_name);
        setTitle(p.title ?? "");
        setBio(p.bio ?? "");
      }
      setArtworks(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleSaveAndNext = async () => {
    setSaving(true);
    setError(null);
    try {
      if (!portfolio) {
        const created = await createPortfolio({ title, bio });
        setPortfolio(created);
      }
      await updatePortfolio({ template_name: templateName, title, bio });
      toast.success("已保存");
      if (step < 3) setStep((s) => (s + 1) as Step);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    setError(null);
    try {
      if (!portfolio) {
        const created = await createPortfolio({ title, bio });
        setPortfolio(created);
      }
      await updatePortfolio({
        template_name: templateName,
        title,
        bio,
        is_published: true,
      });
      toast.success("作品集已发布！");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "发布失败");
    } finally {
      setSaving(false);
    }
  };

  const handleUnpublish = async () => {
    setSaving(true);
    try {
      await updatePortfolio({ is_published: false });
      const p = await getMyPortfolio();
      setPortfolio(p);
      toast.success("已取消发布");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "取消发布失败");
    } finally {
      setSaving(false);
    }
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
        <h1 className="text-5xl font-semibold">Portfolio Editor</h1>
        <p className="mt-3 text-foreground/70">
          Step {step}: {step === 1 ? "Upload" : step === 2 ? "Template" : "Publish"}
        </p>

        {/* Step indicator */}
        <div className="mt-6 flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStep(s as Step)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                s === step
                  ? "bg-accent text-white"
                  : s < step
                    ? "bg-accent/20 text-accent"
                    : "bg-foreground/10 text-foreground/50"
              }`}
            >
              {s}
            </button>
          ))}
          <div className="ml-2 text-sm text-foreground/50">
            {step === 1 ? "上传作品" : step === 2 ? "选择模板" : "发布设置"}
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-8">
          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="space-y-6">
              <ArtworkUploader artworks={artworks} onChanged={loadData} />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-xl bg-accent px-5 py-2.5 font-medium text-white disabled:opacity-60"
                  disabled={artworks.length === 0}
                >
                  下一步：选择模板 →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Template */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm">作品集标题</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="My Portfolio"
                    className="w-full rounded-xl border border-foreground/20 bg-white px-3 py-2 outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm">简介</label>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="一句话介绍你自己"
                    maxLength={200}
                    className="w-full rounded-xl border border-foreground/20 bg-white px-3 py-2 outline-none focus:border-accent"
                  />
                </div>
              </div>

              <TemplateSelector
                artworks={artworks}
                selected={templateName}
                portfolioTitle={title}
                bio={bio}
                onSelect={setTemplateName}
              />

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-foreground/20 px-5 py-2.5 font-medium"
                >
                  ← 上一步
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndNext}
                  disabled={saving}
                  className="rounded-xl bg-accent px-5 py-2.5 font-medium text-white disabled:opacity-60"
                >
                  {saving ? "保存中..." : "下一步：发布设置 →"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Publish */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-foreground/10 bg-white/50 p-6">
                <h2 className="text-2xl font-semibold">发布设置</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-foreground/60">模板</p>
                    <p className="mt-1 font-medium capitalize">{templateName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">作品数</p>
                    <p className="mt-1 font-medium">{artworks.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">公开地址</p>
                    <p className="mt-1 font-medium">
                      {portfolio?.slug ? `/${portfolio.slug}` : "发布后生成"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-xl border border-foreground/20 px-5 py-2.5 font-medium"
                >
                  ← 上一步
                </button>
                {portfolio?.slug && (
                  <button
                    type="button"
                    onClick={() => router.push("/preview")}
                    className="rounded-xl border border-foreground/20 px-5 py-2.5 font-medium"
                  >
                    预览
                  </button>
                )}
                {portfolio?.is_published ? (
                  <button
                    type="button"
                    onClick={handleUnpublish}
                    disabled={saving}
                    className="rounded-xl border border-red-300 px-5 py-2.5 font-medium text-red-600 disabled:opacity-60"
                  >
                    {saving ? "处理中..." : "取消发布"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={saving}
                    className="rounded-xl bg-accent px-5 py-2.5 font-medium text-white disabled:opacity-60"
                  >
                    {saving ? "发布中..." : "发布作品集 🚀"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </RequireAuth>
  );
}
