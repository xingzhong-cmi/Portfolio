/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import type { Artwork } from "@/types";
import { uploadArtwork, deleteArtwork, updateArtwork } from "@/lib/api";

type Props = {
  artworks: Artwork[];
  onChanged: () => void;
};

function SortableCard({
  art,
  editingId,
  editTitle,
  setEditingId,
  setEditTitle,
  onRename,
  onDelete,
}: {
  art: Artwork;
  editingId: string | null;
  editTitle: string;
  setEditingId: (id: string | null) => void;
  setEditTitle: (t: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: art.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative overflow-hidden rounded-xl border border-foreground/10 bg-white/50"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-2 z-10 cursor-grab rounded-lg bg-black/50 px-1.5 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        ⠿
      </div>
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
              onKeyDown={(e) => e.key === "Enter" && onRename(art.id)}
              className="flex-1 rounded-lg border border-foreground/20 bg-white px-2 py-1 text-sm outline-none focus:border-accent"
              autoFocus
            />
            <button
              onClick={() => onRename(art.id)}
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
        onClick={() => onDelete(art.id)}
        className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
      >
        删除
      </button>
    </div>
  );
}

export default function ArtworkUploader({ artworks, onChanged }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await uploadArtwork(files[i]);
      }
      toast.success(`${files.length} 张作品上传成功`);
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteArtwork(deleting);
      toast.success("作品已删除");
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "删除失败");
    } finally {
      setDeleting(null);
    }
  };

  const handleRename = async (id: string) => {
    if (!editTitle.trim()) return;
    try {
      await updateArtwork(id, { title: editTitle.trim() });
      setEditingId(null);
      toast.success("标题已更新");
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "更新失败");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = artworks.findIndex((a) => a.id === active.id);
    const newIndex = artworks.findIndex((a) => a.id === over.id);
    const reordered = arrayMove(artworks, oldIndex, newIndex);

    // Optimistically update, then persist sort_order
    try {
      await Promise.all(
        reordered.map((art, i) => updateArtwork(art.id, { sort_order: i })),
      );
      onChanged();
    } catch {
      toast.error("排序保存失败");
      onChanged();
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
              支持 JPG, PNG, WebP, GIF（最大 10 MB）· 拖拽卡片可排序
            </p>
          </>
        )}
      </div>

      {/* Artwork grid with drag-and-drop */}
      {artworks.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={artworks.map((a) => a.id)} strategy={rectSortingStrategy}>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {artworks.map((art) => (
                <SortableCard
                  key={art.id}
                  art={art}
                  editingId={editingId}
                  editTitle={editTitle}
                  setEditingId={setEditingId}
                  setEditTitle={setEditTitle}
                  onRename={handleRename}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Delete confirmation dialog */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl border border-foreground/10 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold">确认删除</h3>
            <p className="mt-2 text-sm text-foreground/70">删除后无法恢复，确定要继续吗？</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleting(null)}
                className="rounded-xl border border-foreground/20 px-4 py-2 text-sm font-medium"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
