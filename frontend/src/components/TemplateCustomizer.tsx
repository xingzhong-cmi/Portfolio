/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import type { TemplateCustomization } from "@/types";
import type { TemplateName } from "@/components/TemplateSelector";
import { uploadArtwork } from "@/lib/api";

const COLOR_PRESETS: Record<string, { label: string; colors: string[] }> = {
  cyber: {
    label: "霓虹色系",
    colors: ["#21d94f", "#ff2d53", "#0075eb", "#7b00ff", "#ff6a00", "#00e5ff"],
  },
  brutalist: {
    label: "工业色系",
    colors: ["#ff3200", "#0038ff", "#ff9500", "#111111", "#cc0066", "#00aa55"],
  },
  ethereal: {
    label: "梦幻色系",
    colors: ["#8b5cf6", "#ec4899", "#06b6d4", "#f59e0b", "#10b981", "#6366f1"],
  },
};

const DEFAULT_TAGLINES: Record<string, string[]> = {
  cyber: [
    "ART — DESIGN — CREATE — INSPIRE — EXPLORE",
    "DIGITAL — FUTURE — VISION — CODE — ART",
    "NEON — PULSE — BYTE — DREAM — FLOW",
  ],
  brutalist: [
    "SELECTED WORKS",
    "NO COMPROMISE ◆ RAW VISION",
    "WORK HARD ◆ STAY BOLD",
  ],
  ethereal: [
    "A curated collection",
    "Where light meets imagination",
    "Stories told through art",
  ],
};

type Props = {
  templateName: TemplateName;
  customization: TemplateCustomization;
  onChange: (c: TemplateCustomization) => void;
};

export default function TemplateCustomizer({
  templateName,
  customization,
  onChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showCustomColor, setShowCustomColor] = useState(false);

  const presets = COLOR_PRESETS[templateName] ?? COLOR_PRESETS.cyber;
  const taglineOptions = DEFAULT_TAGLINES[templateName] ?? DEFAULT_TAGLINES.cyber;

  const handleAvatarUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("请上传图片文件");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("图片大小不能超过 5MB");
      return;
    }

    setUploading(true);
    try {
      // Reuse the artwork upload endpoint to get a hosted URL
      const result = await uploadArtwork(file);
      onChange({ ...customization, avatar_url: result.image_url });
      toast.success("头像已上传");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  const needsAccentColor = ["cyber", "brutalist", "ethereal"].includes(templateName);
  const needsTagline = ["cyber", "brutalist", "ethereal"].includes(templateName);
  const needsAvatar = ["brutalist", "ethereal"].includes(templateName);

  if (!needsAccentColor && !needsTagline && !needsAvatar) {
    return null;
  }

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold">Customize</h2>
        <p className="mt-1 text-sm text-foreground/60">个性化你的模板，实时预览效果</p>
      </div>

      {/* ===== Avatar upload ===== */}
      {needsAvatar && (
        <div className="rounded-2xl border border-foreground/10 bg-white/50 p-6">
          <h3 className="font-semibold">个人照片</h3>
          <p className="mt-1 text-xs text-foreground/50">
            上传一张你的照片，展示在模板的个人介绍区域
          </p>
          <div className="mt-4 flex items-center gap-4">
            {customization.avatar_url ? (
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-foreground/10">
                <img
                  src={customization.avatar_url}
                  alt="Avatar Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-foreground/20 text-foreground/30">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="rounded-xl border border-foreground/20 px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
              >
                {uploading ? "上传中..." : customization.avatar_url ? "更换照片" : "上传照片"}
              </button>
              {customization.avatar_url && (
                <button
                  type="button"
                  onClick={() => onChange({ ...customization, avatar_url: undefined })}
                  className="text-xs text-foreground/40 hover:text-red-500"
                >
                  移除照片
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleAvatarUpload(e.target.files)}
            />
          </div>
        </div>
      )}

      {/* ===== Accent color ===== */}
      {needsAccentColor && (
        <div className="rounded-2xl border border-foreground/10 bg-white/50 p-6">
          <h3 className="font-semibold">主题色</h3>
          <p className="mt-1 text-xs text-foreground/50">
            选择一个主题色，影响标题、装饰元素和按钮的颜色
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {presets.colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  onChange({ ...customization, accent_color: color });
                  setShowCustomColor(false);
                }}
                className={`h-10 w-10 rounded-full border-2 transition-transform hover:scale-110 ${
                  customization.accent_color === color
                    ? "border-foreground scale-110 ring-2 ring-foreground/20 ring-offset-2"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {/* Custom picker toggle */}
            <button
              type="button"
              onClick={() => setShowCustomColor(!showCustomColor)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold transition-transform hover:scale-110 ${
                showCustomColor ? "border-foreground" : "border-foreground/20"
              }`}
              title="自定义颜色"
            >
              🎨
            </button>
          </div>
          {showCustomColor && (
            <div className="mt-3 flex items-center gap-3">
              <input
                type="color"
                value={customization.accent_color || presets.colors[0]}
                onChange={(e) => onChange({ ...customization, accent_color: e.target.value })}
                className="h-10 w-14 cursor-pointer rounded border border-foreground/10"
              />
              <span className="font-mono text-xs text-foreground/50">
                {customization.accent_color || presets.colors[0]}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ===== Tagline / decorative text ===== */}
      {needsTagline && (
        <div className="rounded-2xl border border-foreground/10 bg-white/50 p-6">
          <h3 className="font-semibold">装饰文字</h3>
          <p className="mt-1 text-xs text-foreground/50">
            选择或自定义模板中的滚动文字 / 标语
          </p>
          <div className="mt-4 space-y-2">
            {taglineOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onChange({ ...customization, tagline: option })}
                className={`block w-full rounded-xl border px-4 py-2.5 text-left text-sm transition-colors ${
                  customization.tagline === option
                    ? "border-accent bg-accent/5 text-accent"
                    : "border-foreground/10 hover:border-foreground/30"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-xs text-foreground/50">或者自定义输入：</label>
            <input
              type="text"
              value={customization.tagline || ""}
              onChange={(e) => onChange({ ...customization, tagline: e.target.value })}
              placeholder="输入你自己的文字..."
              maxLength={100}
              className="w-full rounded-xl border border-foreground/20 bg-white px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
        </div>
      )}
    </section>
  );
}
