/* eslint-disable @next/next/no-img-element */
import type { Artwork, TemplateCustomization } from "@/types";

type TemplateProps = {
  artworks: Artwork[];
  portfolioTitle: string;
  bio: string;
  customization?: TemplateCustomization;
};

export default function DarkTemplate({
  artworks,
  portfolioTitle,
  bio,
}: TemplateProps) {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-8 py-16 text-[#F8F6F1]">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-5xl font-semibold">{portfolioTitle || "My Portfolio"}</h1>
        {bio ? <p className="mt-3 max-w-2xl text-sm text-white/70">{bio}</p> : null}
        {artworks.length === 0 ? (
          <p className="mt-12 text-sm text-white/40">还没有作品，去编辑器上传吧。</p>
        ) : (
          <div className="mt-12 space-y-10">
            {artworks.map((artwork) => (
              <article key={artwork.id} className="grid gap-6 md:grid-cols-2 items-center">
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-white/10">
                  <img
                    src={artwork.image_url}
                    alt={artwork.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{artwork.title}</h2>
                  {artwork.description ? (
                    <p className="mt-2 text-sm text-white/70">{artwork.description}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
