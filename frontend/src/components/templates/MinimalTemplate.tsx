/* eslint-disable @next/next/no-img-element */
import type { Artwork, TemplateCustomization } from "@/types";

type TemplateProps = {
  artworks: Artwork[];
  portfolioTitle: string;
  bio: string;
  customization?: TemplateCustomization;
};

export default function MinimalTemplate({
  artworks,
  portfolioTitle,
  bio,
}: TemplateProps) {
  return (
    <main className="min-h-screen bg-white px-8 py-16 text-[#1A1A1A]">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-5xl font-semibold">{portfolioTitle || "My Portfolio"}</h1>
        {bio ? <p className="mt-3 max-w-2xl text-sm text-black/70">{bio}</p> : null}
        {artworks.length === 0 ? (
          <p className="mt-12 text-sm text-black/40">还没有作品，去编辑器上传吧。</p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {artworks.map((artwork) => (
              <article key={artwork.id} className="space-y-3">
                <div className="aspect-[4/5] w-full overflow-hidden rounded-lg bg-neutral-100">
                  <img
                    src={artwork.image_url}
                    alt={artwork.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="text-sm">{artwork.title}</p>
                {artwork.description ? (
                  <p className="text-xs text-black/50">{artwork.description}</p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
