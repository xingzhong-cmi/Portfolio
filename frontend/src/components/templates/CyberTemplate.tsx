/* eslint-disable @next/next/no-img-element */
"use client";

import type { Artwork } from "@/types";

type TemplateProps = {
  artworks: Artwork[];
  portfolioTitle: string;
  bio: string;
};

export default function CyberTemplate({
  artworks,
  portfolioTitle,
  bio,
}: TemplateProps) {
  return (
    <div className="cyber-template relative min-h-screen bg-black text-white overflow-hidden">
      {/* Film grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[99] opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 z-50 h-1 w-full">
        <div className="h-full bg-[#21d94f] origin-left cyber-progress" />
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

        {/* Title */}
        <div className="relative z-10 text-center" style={{ perspective: "1000px" }}>
          <h1 className="cyber-title text-[18vw] font-black leading-none tracking-tight md:text-[15vw]">
            {(portfolioTitle || "Portfolio").split("").map((char, i) => (
              <span
                key={i}
                className={`inline-block cyber-float ${
                  i % 3 === 1
                    ? "text-white"
                    : "cyber-stroke text-white/90"
                }`}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  textShadow: i % 3 === 1 ? "0 0 40px rgba(255,255,255,0.3)" : "none",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          {bio && (
            <p className="mt-6 font-mono text-sm tracking-[0.3em] text-white/80 uppercase md:text-base">
              {bio}
            </p>
          )}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-8 left-8 font-mono text-xs text-white/50">
          <p>PORTFOLIO</p>
          <p>AVAILABLE FOR WORK</p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2">
          <span className="origin-center rotate-90 translate-y-4 font-mono text-xs tracking-widest text-white/50">
            SCROLL
          </span>
          <div className="h-12 w-px bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </section>

      {/* ===== MARQUEE SECTION ===== */}
      <section className="relative overflow-hidden border-y border-white/10 bg-black py-8">
        <div className="cyber-marquee whitespace-nowrap text-4xl font-black tracking-tighter md:text-6xl lg:text-7xl">
          <span className="mx-8 text-[#21d94f]">ART</span>
          <span className="mx-8 text-white/30">—</span>
          <span className="mx-8 text-white">DESIGN</span>
          <span className="mx-8 text-white/30">—</span>
          <span className="mx-8 text-[#ff2d53]">CREATE</span>
          <span className="mx-8 text-white/30">—</span>
          <span className="mx-8 text-white">INSPIRE</span>
          <span className="mx-8 text-white/30">—</span>
          <span className="mx-8 text-[#0075eb]">EXPLORE</span>
          <span className="mx-8 text-white/30">—</span>
          <span className="mx-8 text-[#21d94f]">ART</span>
          <span className="mx-8 text-white/30">—</span>
          <span className="mx-8 text-white">DESIGN</span>
          <span className="mx-8 text-white/30">—</span>
          <span className="mx-8 text-[#ff2d53]">CREATE</span>
          <span className="mx-8 text-white/30">—</span>
          <span className="mx-8 text-white">INSPIRE</span>
          <span className="mx-8 text-white/30">—</span>
          <span className="mx-8 text-[#0075eb]">EXPLORE</span>
          <span className="mx-8 text-white/30">—</span>
        </div>
        {/* Gradient fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-black to-transparent" />
      </section>

      {/* ===== WORKS SECTION ===== */}
      <section className="relative min-h-screen bg-black px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section title */}
          <div className="mb-16">
            <h2 className="mb-4 text-6xl font-black text-white md:text-8xl lg:text-9xl">
              <span className="cyber-stroke">WORKS</span>
              <span className="text-[#21d94f]">.</span>
            </h2>
            <p className="font-mono text-sm uppercase tracking-widest text-white/50">
              SELECTED WORKS
            </p>
          </div>

          {artworks.length === 0 ? (
            <p className="font-mono text-sm text-white/40">还没有作品，去编辑器上传吧。</p>
          ) : (
            /* Accordion-style gallery */
            <div className="flex h-[70vh] gap-2 md:gap-4">
              {artworks.map((artwork, index) => {
                const colors = ["#7b00ff", "#21d94f", "#ff6a00", "#0075eb", "#ff2d53"];
                const color = colors[index % colors.length];
                return (
                  <div
                    key={artwork.id}
                    className="cyber-accordion group relative cursor-pointer overflow-hidden"
                  >
                    {/* Image */}
                    <div className="absolute inset-0">
                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="h-full w-full object-cover grayscale transition-all duration-600 group-hover:grayscale-0 group-hover:scale-105"
                      />
                      {/* Color overlay */}
                      <div
                        className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-40 opacity-70"
                        style={{ backgroundColor: color }}
                      />
                    </div>

                    {/* Content overlay */}
                    <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-6">
                      {/* Top */}
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-xs tracking-wider text-white/70">
                          {(index + 1).toString().padStart(2, "0")}
                        </span>
                      </div>
                      {/* Bottom */}
                      <div>
                        <h3 className="mb-2 text-2xl font-black text-white transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 translate-y-4 opacity-70 md:text-4xl">
                          {artwork.title}
                        </h3>
                        {artwork.description && (
                          <p className="font-mono text-xs text-white/60 transition-all duration-500 delay-75 group-hover:translate-y-0 group-hover:opacity-100 translate-y-4 opacity-0">
                            {artwork.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Hover border glow */}
                    <div
                      className="pointer-events-none absolute inset-0 border-2 opacity-0 transition-all duration-300 group-hover:opacity-100"
                      style={{
                        borderColor: color,
                        boxShadow: `0 0 20px ${color}40`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===== ABOUT / FOOTER ===== */}
      <footer className="relative border-t border-white/10 bg-black px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-12 md:flex-row md:items-end">
            <div>
              <h2 className="text-4xl font-black text-white md:text-6xl">
                {portfolioTitle || "Portfolio"}
              </h2>
              {bio && (
                <p className="mt-4 max-w-xl text-white/50">{bio}</p>
              )}
            </div>
            <div className="font-mono text-xs text-white/40">
              <p>© {new Date().getFullYear()} All Rights Reserved</p>
              <p className="mt-1">Built with Folio</p>
            </div>
          </div>
        </div>

        {/* Decorative corners */}
        <div className="absolute bottom-0 right-0 h-32 w-32 border-b border-r border-white/5" />
        <div className="absolute bottom-8 right-8 h-16 w-16 border-b border-r border-[#21d94f]/20" />
      </footer>

      {/* ===== SCOPED STYLES ===== */}
      <style jsx>{`
        .cyber-stroke {
          -webkit-text-stroke: 2px currentColor;
          -webkit-text-fill-color: transparent;
        }

        .cyber-float {
          animation: cyberFloat 3s ease-in-out infinite;
        }

        @keyframes cyberFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .cyber-marquee {
          display: inline-flex;
          animation: cyberMarquee 20s linear infinite;
        }

        @keyframes cyberMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .cyber-accordion {
          flex: 1;
          transition: flex 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .cyber-accordion:hover {
          flex: 2.5;
        }

        .cyber-progress {
          animation: progressGrow 2s ease-out forwards;
        }

        @keyframes progressGrow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        .duration-600 {
          transition-duration: 600ms;
        }
      `}</style>
    </div>
  );
}
