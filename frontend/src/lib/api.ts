import { getSupabaseClient } from "@/lib/supabase";
import type { Artwork, Portfolio, PublicPortfolioResponse } from "@/types";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? "";
}

async function getToken() {
  const supabase = getSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  return session.access_token;
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const apiBaseUrl = getApiBaseUrl();
  const token = await getToken();
  const res = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// --- Auth ---

export async function registerProfile(payload: {
  email: string;
  display_name?: string;
  avatar_url?: string;
}) {
  return apiRequest<{ profile_id: string }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// --- Portfolio ---

export async function getMyPortfolio() {
  return apiRequest<Portfolio | null>("/api/portfolio");
}

export async function createPortfolio(payload: { title?: string; bio?: string }) {
  return apiRequest<Portfolio>("/api/portfolio", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updatePortfolio(payload: {
  template_name?: string;
  title?: string;
  bio?: string;
  is_published?: boolean;
  customization?: Record<string, string | undefined>;
}) {
  return apiRequest<{ ok: boolean }>("/api/portfolio", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// --- Artworks ---

export async function listMyArtworks() {
  return apiRequest<Artwork[]>("/api/artworks");
}

export async function uploadArtwork(file: File): Promise<Artwork> {
  const apiBaseUrl = getApiBaseUrl();
  const token = await getToken();
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${apiBaseUrl}/api/artworks/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Upload failed: ${res.status}`);
  }

  return res.json() as Promise<Artwork>;
}

export async function updateArtwork(
  artworkId: string,
  payload: { title?: string; description?: string; sort_order?: number },
) {
  return apiRequest<{ ok: boolean }>(`/api/artworks/${artworkId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteArtwork(artworkId: string) {
  return apiRequest<{ ok: boolean }>(`/api/artworks/${artworkId}`, {
    method: "DELETE",
  });
}

// --- Public ---

export async function getPublicPortfolio(slug: string) {
  const apiBaseUrl = getApiBaseUrl();
  const res = await fetch(`${apiBaseUrl}/api/public/${slug}`);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<PublicPortfolioResponse>;
}
