"use client";

import type { Artwork } from "@/types";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import DarkTemplate from "@/components/templates/DarkTemplate";
import MagazineTemplate from "@/components/templates/MagazineTemplate";

import CyberTemplate from "@/components/templates/CyberTemplate";

const TEMPLATES = [
  { name: "minimal" as const, label: "Minimal", description: "简洁白底网格布局" },
  { name: "dark" as const, label: "Dark", description: "深色沉浸式大图展示" },
  { name: "magazine" as const, label: "Magazine", description: "杂志风错落排版" },
  { name: "cyber" as const, label: "Cyber", description: "赛博朋克黑底动效" },
] as const;

type TemplateName = "minimal" | "dark" | "magazine" | "cyber";

type Props = {
  artworks: Artwork[];
  selected: TemplateName;
  portfolioTitle: string;
  bio: string;
  onSelect: (name: TemplateName) => void;
};

function TemplatePreview({
  name,
  artworks,
  portfolioTitle,
  bio,
}: {
  name: TemplateName;
  artworks: Artwork[];
  portfolioTitle: string;
  bio: string;
}) {
  const previewArtworks = artworks.slice(0, 3);
  const props = { artworks: previewArtworks, portfolioTitle, bio };

  return (
    <div className="pointer-events-none h-[280px] origin-top-left scale-[0.25] overflow-hidden" style={{ width: "1200px" }}>
      {name === "minimal" && <MinimalTemplate {...props} />}
      {name === "dark" && <DarkTemplate {...props} />}
      {name === "magazine" && <MagazineTemplate {...props} />}
      {name === "cyber" && <CyberTemplate {...props} />}
    </div>
  );
}

export default function TemplateSelector({
  artworks,
  selected,
  portfolioTitle,
  bio,
  onSelect,
}: Props) {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-semibold">Choose Template</h2>
      <div className="grid gap-4 md:grid-cols-3">
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
            <div className="relative h-[70px] w-full overflow-hidden bg-neutral-50">
              <TemplatePreview
                name={tpl.name}
                artworks={artworks}
                portfolioTitle={portfolioTitle}
                bio={bio}
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
