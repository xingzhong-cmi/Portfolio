export type Artwork = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string;
  sort_order: number;
  created_at: string;
};

export type Portfolio = {
  id: string;
  user_id: string;
  slug: string;
  template_name: "minimal" | "dark" | "magazine" | "cyber";
  title: string | null;
  bio: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type PublicPortfolioResponse = {
  portfolio: Portfolio;
  artworks: Artwork[];
};
