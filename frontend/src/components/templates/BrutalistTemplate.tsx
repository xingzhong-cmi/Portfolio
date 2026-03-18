/* eslint-disable @next/next/no-img-element */
"use client";

import type { Artwork } from "@/types";
import type { TemplateCustomization } from "@/types";

type TemplateProps = {
  artworks: Artwork[];
  portfolioTitle: string;
  bio: string;
  customization?: TemplateCustomization;
};

export default function BrutalistTemplate({
  artworks,
  portfolioTitle,
  bio,
  customization,
}: TemplateProps) {
  const accent = customization?.accent_color || "#ff3200";
  const tagline = customization?.tagline || "SELECTED WORKS";
  const avatarUrl = customization?.avatar_url;

  return (
    <div className="brutalist-tpl min-h-screen bg-[#f0ece2] text-[#111] overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative border-b-4 border-[#111]">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b-2 border-[#111] px-4 py-2 font-mono text-xs uppercase tracking-widest md:px-8">
          <span>Portfolio</span>
          <span>{new Date().getFullYear()}</span>
        </div>

        <div className="px-4 py-16 md:px-8 md:py-24">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="flex-1">
              <h1
                className="brutalist-title text-[16vw] font-black uppercase leading-[0.85] tracking-tighter md:text-[12vw]"
                style={{ color: accent }}
              >
                {portfolioTitle || "Works"}
              </h1>
              <p className="mt-4 max-w-xl font-mono text-sm leading-relaxed text-[#111]/70 md:text-base">
                {bio || "—"}
              </p>
            </div>
            {avatarUrl && (
              <div className="h-32 w-32 flex-shrink-0 overflow-hidden border-4 border-[#111] md:h-40 md:w-40">
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== TAGLINE MARQUEE ===== */}
      <section className="overflow-hidden border-b-4 border-[#111] py-4" style={{ backgroundColor: accent }}>
        <div className="brutalist-marquee whitespace-nowrap font-black text-3xl uppercase tracking-widest text-white md:text-5xl">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-6">
              {tagline} ◆
            </span>
          ))}
        </div>
      </section>

      {/* ===== WORKS GRID ===== */}
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="mb-12 flex items-end justify-between border-b-2 border-[#111] pb-4">
          <h2 className="font-mono text-sm uppercase tracking-widest">
            Works ({artworks.length})
          </h2>
          <span className="font-mono text-xs text-[#111]/50">INDEX</span>
        </div>

        {artworks.length === 0 ? (
          <p className="font-mono text-sm text-[#111]/40">还没有作品，去编辑器上传吧。</p>
        ) : (
          <div className="space-y-0">
            {artworks.map((artwork, index) => (
              <div
                key={artwork.id}
                className="brutalist-card group border-b-2 border-[#111] transition-colors hover:bg-[#111] hover:text-[#f0ece2]"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden border-b-2 border-[#111] md:aspect-auto md:w-1/2 md:border-b-0 md:border-r-2">
                    <img
                      src={artwork.image_url}
                      alt={artwork.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Number overlay */}
                    <div
                      className="absolute bottom-0 right-0 px-3 py-1 font-black text-2xl text-white md:text-4xl"
                      style={{ backgroundColor: accent }}
                    >
                      {(index + 1).toString().padStart(2, "0")}
                    </div>
                  </div>
                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
                    <div>
                      <h3 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
                        {artwork.title}
                      </h3>
                      {artwork.description && (
                        <p className="mt-4 font-mono text-sm leading-relaxed opacity-60">
                          {artwork.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest opacity-40">
                      <span>Artwork</span>
                      <span>·</span>
                      <span>#{(index + 1).toString().padStart(2, "0")}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t-4 border-[#111] px-4 py-12 md:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-4xl font-black uppercase md:text-6xl" style={{ color: accent }}>
              {portfolioTitle || "Works"}
            </p>
            {bio && <p className="mt-2 max-w-md font-mono text-sm text-[#111]/50">{bio}</p>}
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-[#111]/40">
            <p>© {new Date().getFullYear()}</p>
            <p className="mt-1">Built with Folio</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .brutalist-marquee {
          display: inline-flex;
          animation: brutalistScroll 15s linear infinite;
        }
        @keyframes brutalistScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .brutalist-card {
          transition: background-color 0.3s, color 0.3s;
        }
      `}</style>
    </div>
  );
}
