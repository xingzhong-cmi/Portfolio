/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import type { Artwork } from "@/types";
import { uploadArtwork, deleteArtwork, updateArtwork } from "@/lib/api";

type Props = {
  artworks: Artwork[];
  onChanged: () => void;
};

export default function ArtworkUploader({ artworks, onChanged }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await uploadArtwork(files[i]);
      }
      onChanged();
    } catch (err) {
      alert(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确认删除这张作品？")) return;
    try {
      await deleteArtwork(id);
      onChanged();
    } catch (err) {
      alert(err instanceof Error ? err.message : "删除失败");
    }
  };

  const handleRename = async (id: string) => {
    if (!editTitle.trim()) return;
    try {
      await updateArtwork(id, { title: editTitle.trim() });
      setEditingId(null);
      onChanged();
    } catch (err) {
      alert(err instanceof Error ? err.message : "更新失败");
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Upload Artworks</h2>
        <span className="text-sm text-foreground/60">{artworks.length} 张作品</span>
      </div>

      {/* Drop zone */}
      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-foreground/25 bg-white/40 p-8 transition-colors hover:border-accent/60"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <p className="text-sm text-foreground/70">上传中...</p>
        ) : (
          <>
            <p className="text-sm text-foreground/70">拖拽图片到此处，或点击选择文件</p>
            <p className="mt-1 text-xs text-foreground/40">
              支持 JPG, PNG, WebP, GIF（最大 10 MB）
            </p>
          </>
        )}
      </div>

      {/* Artwork grid */}
      {artworks.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {artworks.map((art) => (
            <div
              key={art.id}
              className="group relative overflow-hidden rounded-xl border border-foreground/10 bg-white/50"
            >
              <div className="aspect-square w-full overflow-hidden bg-neutral-100">
                <img
                  src={art.image_url}
                  alt={art.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-3">
                {editingId === art.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleRename(art.id)}
                      className="flex-1 rounded-lg border border-foreground/20 bg-white px-2 py-1 text-sm outline-none focus:border-accent"
                      autoFocus
                    />
                    <button
                      onClick={() => handleRename(art.id)}
                      className="text-xs text-accent hover:underline"
                    >
                      保存
                    </button>
                  </div>
                ) : (
                  <p
                    className="cursor-pointer truncate text-sm hover:text-accent"
                    onClick={() => {
                      setEditingId(art.id);
                      setEditTitle(art.title);
                    }}
                  >
                    {art.title}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(art.id)}
                className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
