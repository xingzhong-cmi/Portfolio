"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import RequireAuth from "@/components/RequireAuth";
import { getMyPortfolio, listMyArtworks } from "@/lib/api";
import type { Artwork, Portfolio } from "@/types";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import DarkTemplate from "@/components/templates/DarkTemplate";
import MagazineTemplate from "@/components/templates/MagazineTemplate";
import CyberTemplate from "@/components/templates/CyberTemplate";

export default function PreviewPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, a] = await Promise.all([getMyPortfolio(), listMyArtworks()]);
        setPortfolio(p);
        setArtworks(a);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

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

  const props = {
    artworks,
    portfolioTitle: portfolio?.title ?? "My Portfolio",
    bio: portfolio?.bio ?? "",
  };

  return (
    <RequireAuth>
      {/* Floating bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-foreground/10 bg-background/90 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link
            href="/editor"
            className="rounded-lg border border-foreground/20 px-3 py-1.5 text-sm font-medium"
          >
            ← 返回编辑
          </Link>
          <span className="text-sm text-foreground/60">
            预览模式 · {portfolio?.template_name ?? "minimal"}
          </span>
        </div>
        {portfolio?.slug && (
          <Link
            href={`/${portfolio.slug}`}
            className="text-sm text-accent hover:underline"
          >
            查看公开页面 →
          </Link>
        )}
      </div>

      {/* Template preview */}
      {portfolio?.template_name === "dark" ? (
        <DarkTemplate {...props} />
      ) : portfolio?.template_name === "magazine" ? (
        <MagazineTemplate {...props} />
      ) : portfolio?.template_name === "cyber" ? (
        <CyberTemplate {...props} />
      ) : (
        <MinimalTemplate {...props} />
      )}
    </RequireAuth>
  );
}
