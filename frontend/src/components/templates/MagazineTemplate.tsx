/* eslint-disable @next/next/no-img-element */
import type { Artwork, TemplateCustomization } from "@/types";

type TemplateProps = {
  artworks: Artwork[];
  portfolioTitle: string;
  bio: string;
  customization?: TemplateCustomization;
};

export default function MagazineTemplate({
  artworks,
  portfolioTitle,
  bio,
}: TemplateProps) {
  return (
    <main className="min-h-screen bg-[#f8f6f1] px-8 py-16 text-[#1a1a1a]">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-6xl font-semibold">{portfolioTitle || "My Portfolio"}</h1>
        {bio ? <p className="mt-4 max-w-2xl text-base text-[#1a1a1a]/70">{bio}</p> : null}
        {artworks.length === 0 ? (
          <p className="mt-12 text-sm text-[#1a1a1a]/40">还没有作品，去编辑器上传吧。</p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-6">
            {artworks.map((artwork, index) => (
              <article
                key={artwork.id}
                className={`group overflow-hidden rounded-xl border border-[#1a1a1a]/10 bg-white/60 ${
                  index === 0 ? "md:col-span-6" : "md:col-span-2"
                }`}
              >
                <div className={`w-full overflow-hidden ${
                  index === 0 ? "aspect-[21/9]" : "aspect-square"
                }`}>
                  <img
                    src={artwork.image_url}
                    alt={artwork.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs tracking-[0.24em] text-[#1a1a1a]/60">
                    {(index + 1).toString().padStart(2, "0")}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">{artwork.title}</h2>
                  {artwork.description ? (
                    <p className="mt-1 text-sm text-[#1a1a1a]/60">{artwork.description}</p>
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
