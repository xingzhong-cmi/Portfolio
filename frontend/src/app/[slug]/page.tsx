import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PublicPortfolioResponse } from "@/types";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import DarkTemplate from "@/components/templates/DarkTemplate";
import MagazineTemplate from "@/components/templates/MagazineTemplate";
import CyberTemplate from "@/components/templates/CyberTemplate";

async function fetchPortfolio(slug: string): Promise<PublicPortfolioResponse | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${apiUrl}/api/public/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<PublicPortfolioResponse>;
  } catch {
    return null;
  }
}

type PageProps = { params: { slug: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await fetchPortfolio(params.slug);
  if (!data) {
    return { title: "作品集未找到 | Folio" };
  }
  const { portfolio, artworks } = data;
  const title = portfolio.title || "My Portfolio";
  const description = portfolio.bio || "在 Folio 上查看作品集";
  const coverImage = artworks[0]?.image_url;

  return {
    title: `${title} | Folio`,
    description,
    openGraph: {
      title,
      description,
      ...(coverImage ? { images: [{ url: coverImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(coverImage ? { images: [coverImage] } : {}),
    },
  };
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const data = await fetchPortfolio(params.slug);

  if (!data) {
    notFound();
  }

  const { portfolio, artworks } = data;

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
