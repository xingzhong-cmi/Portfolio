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

export default function EtherealTemplate({
  artworks,
  portfolioTitle,
  bio,
  customization,
}: TemplateProps) {
  const accent = customization?.accent_color || "#8b5cf6";
  const tagline = customization?.tagline || "A curated collection";
  const avatarUrl = customization?.avatar_url;

  return (
    <div className="ethereal-tpl min-h-screen overflow-hidden" style={{ background: `linear-gradient(160deg, #faf5ff 0%, #f0f9ff 40%, #fdf4ff 70%, #fff7ed 100%)` }}>
      {/* ===== HERO ===== */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* Floating orbs */}
        <div
          className="ethereal-orb absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: accent }}
        />
        <div
          className="ethereal-orb absolute -bottom-24 -right-24 h-80 w-80 rounded-full opacity-20 blur-3xl"
          style={{ background: accent, animationDelay: "3s" }}
        />
        <div
          className="ethereal-orb absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full opacity-15 blur-3xl"
          style={{ background: `color-mix(in srgb, ${accent} 50%, #f472b6)`, animationDelay: "6s" }}
        />

        <div className="relative z-10">
          {avatarUrl && (
            <div className="mx-auto mb-8 h-28 w-28 overflow-hidden rounded-full ring-4 ring-white/80 ring-offset-4 ring-offset-transparent md:h-36 md:w-36">
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            </div>
          )}

          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] opacity-50">
            {tagline}
          </p>

          <h1
            className="ethereal-title text-5xl font-light leading-tight tracking-tight md:text-7xl lg:text-8xl"
            style={{ color: accent }}
          >
            {portfolioTitle || "Portfolio"}
          </h1>

          {bio && (
            <p className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-gray-500 md:text-lg">
              {bio}
            </p>
          )}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-12 flex flex-col items-center gap-3 text-gray-400">
          <span className="text-xs tracking-widest">SCROLL</span>
          <div className="h-10 w-px bg-gradient-to-b from-gray-300 to-transparent" />
        </div>
      </section>

      {/* ===== WORKS ===== */}
      <section className="relative px-6 py-24 md:px-12 lg:px-20">
        <h2 className="mb-16 text-center text-sm font-medium uppercase tracking-[0.3em] text-gray-400">
          Works · {artworks.length}
        </h2>

        {artworks.length === 0 ? (
          <p className="text-center text-sm text-gray-400">还没有作品，去编辑器上传吧。</p>
        ) : (
          <div className="mx-auto max-w-6xl space-y-32">
            {artworks.map((artwork, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={artwork.id}
                  className={`ethereal-reveal flex flex-col items-center gap-8 md:flex-row ${
                    isEven ? "" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Image */}
                  <div className="group relative w-full md:w-3/5">
                    <div
                      className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl transition-opacity duration-700 group-hover:opacity-40"
                      style={{ background: accent }}
                    />
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-gray-200/50">
                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className={`w-full md:w-2/5 ${isEven ? "md:pl-8" : "md:pr-8"}`}>
                    <span className="mb-3 block text-xs font-medium uppercase tracking-widest text-gray-400">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <h3 className="text-3xl font-light tracking-tight text-gray-800 md:text-4xl">
                      {artwork.title}
                    </h3>
                    {artwork.description && (
                      <p className="mt-4 text-sm leading-relaxed text-gray-500">
                        {artwork.description}
                      </p>
                    )}
                    <div
                      className="mt-6 h-px w-12"
                      style={{ backgroundColor: accent }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative border-t border-gray-200/50 px-6 py-20 text-center">
        <div
          className="ethereal-orb absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl"
          style={{ background: accent }}
        />
        <h2
          className="text-3xl font-light tracking-tight md:text-5xl"
          style={{ color: accent }}
        >
          {portfolioTitle || "Portfolio"}
        </h2>
        {bio && <p className="mx-auto mt-4 max-w-md text-sm text-gray-400">{bio}</p>}
        <p className="mt-8 text-xs text-gray-300">
          © {new Date().getFullYear()} · Built with Folio
        </p>
      </footer>

      <style jsx>{`
        .ethereal-orb {
          animation: etherealDrift 12s ease-in-out infinite alternate;
        }
        @keyframes etherealDrift {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -15px) scale(1.05); }
          66% { transform: translate(-10px, 10px) scale(0.95); }
          100% { transform: translate(15px, -5px) scale(1.02); }
        }

        .ethereal-title {
          animation: etherealFadeIn 1.2s ease-out;
        }
        @keyframes etherealFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ethereal-reveal {
          animation: etherealSlideUp 0.8s ease-out both;
        }
        @keyframes etherealSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
