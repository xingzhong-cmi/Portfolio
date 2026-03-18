"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPublicPortfolio } from "@/lib/api";
import type { Artwork, Portfolio } from "@/types";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import DarkTemplate from "@/components/templates/DarkTemplate";
import MagazineTemplate from "@/components/templates/MagazineTemplate";
import CyberTemplate from "@/components/templates/CyberTemplate";

export default function PublicPortfolioPage() {
  const params = useParams<{ slug: string }>();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPublicPortfolio(params.slug);
        setPortfolio(data.portfolio);
        setArtworks(data.artworks);
      } catch (err) {
        setError(err instanceof Error ? err.message : "加载失败");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [params.slug]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-sm text-foreground/70">
        加载中...
      </main>
    );
  }

  if (error || !portfolio) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-semibold">404</h1>
        <p className="mt-3 text-foreground/70">
          {error || "作品集不存在或尚未发布"}
        </p>
      </main>
    );
  }

  const props = {
    artworks,
    portfolioTitle: portfolio.title ?? "My Portfolio",
    bio: portfolio.bio ?? "",
  };

  switch (portfolio.template_name) {
    case "dark":
      return <DarkTemplate {...props} />;
    case "magazine":
      return <MagazineTemplate {...props} />;
    case "cyber":
      return <CyberTemplate {...props} />;
    default:
      return <MinimalTemplate {...props} />;
  }
}
