"use client";

import type { Artwork, TemplateCustomization } from "@/types";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import DarkTemplate from "@/components/templates/DarkTemplate";
import MagazineTemplate from "@/components/templates/MagazineTemplate";
import CyberTemplate from "@/components/templates/CyberTemplate";
import BrutalistTemplate from "@/components/templates/BrutalistTemplate";
import EtherealTemplate from "@/components/templates/EtherealTemplate";

const TEMPLATES = [
  { name: "minimal" as const, label: "Minimal", description: "简洁白底网格布局" },
  { name: "dark" as const, label: "Dark", description: "深色沉浸式大图展示" },
  { name: "magazine" as const, label: "Magazine", description: "杂志风错落排版" },
  { name: "cyber" as const, label: "Cyber", description: "赛博朋克黑底动效" },
  { name: "brutalist" as const, label: "Brutalist", description: "粗野主义工业美学" },
  { name: "ethereal" as const, label: "Ethereal", description: "梦幻渐变柔光风格" },
] as const;

export type TemplateName = "minimal" | "dark" | "magazine" | "cyber" | "brutalist" | "ethereal";

type Props = {
  artworks: Artwork[];
  selected: TemplateName;
  portfolioTitle: string;
  bio: string;
  customization?: TemplateCustomization;
  onSelect: (name: TemplateName) => void;
};

function TemplatePreview({
  name,
  artworks,
  portfolioTitle,
  bio,
  customization,
}: {
  name: TemplateName;
  artworks: Artwork[];
  portfolioTitle: string;
  bio: string;
  customization?: TemplateCustomization;
}) {
  const previewArtworks = artworks.slice(0, 3);
  const props = { artworks: previewArtworks, portfolioTitle, bio, customization };

  return (
    <div className="pointer-events-none h-[400px] origin-top-left scale-[0.28] overflow-hidden" style={{ width: "1200px" }}>
      {name === "minimal" && <MinimalTemplate {...props} />}
      {name === "dark" && <DarkTemplate {...props} />}
      {name === "magazine" && <MagazineTemplate {...props} />}
      {name === "cyber" && <CyberTemplate {...props} />}
      {name === "brutalist" && <BrutalistTemplate {...props} />}
      {name === "ethereal" && <EtherealTemplate {...props} />}
    </div>
  );
}

export default function TemplateSelector({
  artworks,
  selected,
  portfolioTitle,
  bio,
  customization,
  onSelect,
}: Props) {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-semibold">Choose Template</h2>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((tpl) => (
          <button
            key={tpl.name}
            type="button"
            onClick={() => onSelect(tpl.name)}
            className={`overflow-hidden rounded-2xl border-2 text-left transition-all ${
              selected === tpl.name
                ? "border-accent shadow-lg"
                : "border-foreground/10 hover:border-foreground/30"
            }`}
          >
            <div className="relative h-[112px] w-full overflow-hidden bg-neutral-50">
              <TemplatePreview
                name={tpl.name}
                artworks={artworks}
                portfolioTitle={portfolioTitle}
                bio={bio}
                customization={customization}
              />
            </div>
            <div className="p-4">
              <p className="font-semibold">{tpl.label}</p>
              <p className="mt-1 text-xs text-foreground/60">{tpl.description}</p>
              {selected === tpl.name && (
                <span className="mt-2 inline-block rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                  当前选中
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
