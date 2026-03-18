from __future__ import annotations

import os
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from auth import CurrentUser, get_current_user
from models import ArtworkUpdateRequest
from services.supabase_admin import get_supabase_admin


router = APIRouter(prefix="/artworks", tags=["artworks"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE = 10 * 1024 * 1024  # 10 MB


def _try_r2():
    """Return R2Service if configured, else None (fallback to URL-only mode)."""
    try:
        from services.r2 import get_r2_service
        return get_r2_service()
    except Exception:
        return None


@router.get("")
def list_artworks(current_user: CurrentUser = Depends(get_current_user)):
    supabase = get_supabase_admin()
    result = (
        supabase.table("artworks")
        .select("*")
        .eq("user_id", current_user.id)
        .order("sort_order", desc=False)
        .execute()
    )
    return result.data or []


@router.post("/upload")
async def upload_artwork(
    file: UploadFile = File(...),
    current_user: CurrentUser = Depends(get_current_user),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Unsupported image type")

    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(400, "File too large (max 10 MB)")

    ext = file.filename.rsplit(".", 1)[-1] if file.filename and "." in file.filename else "jpg"
    key = f"{current_user.id}/{uuid.uuid4().hex}.{ext}"

    r2 = _try_r2()
    if r2:
        import io
        image_url = r2.upload_file(io.BytesIO(contents), key, file.content_type or "image/jpeg")
    else:
        # Fallback: store as data URL for MVP when R2 is not configured
        import base64
        b64 = base64.b64encode(contents).decode()
        image_url = f"data:{file.content_type};base64,{b64}"

    supabase = get_supabase_admin()

    # Get next sort_order
    existing = (
        supabase.table("artworks")
        .select("sort_order")
        .eq("user_id", current_user.id)
        .order("sort_order", desc=True)
        .limit(1)
        .execute()
    )
    next_order = (existing.data[0]["sort_order"] + 1) if existing.data else 0

    result = (
        supabase.table("artworks")
        .insert({
            "user_id": current_user.id,
            "title": file.filename or "Untitled",
            "image_url": image_url,
            "sort_order": next_order,
        })
        .execute()
    )

    if not result.data:
        raise HTTPException(500, "Failed to save artwork")

    return result.data[0]


@router.patch("/{artwork_id}")
def update_artwork(
    artwork_id: str,
    payload: ArtworkUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
):
    supabase = get_supabase_admin()
    update_data = {
        key: value for key, value in payload.model_dump().items() if value is not None
    }
    if not update_data:
        return {"ok": True}

    result = (
        supabase.table("artworks")
        .update(update_data)
        .eq("id", artwork_id)
        .eq("user_id", current_user.id)
        .execute()
    )
    return {"ok": True, "data": result.data}


@router.delete("/{artwork_id}")
def delete_artwork(
    artwork_id: str,
    current_user: CurrentUser = Depends(get_current_user),
):
    supabase = get_supabase_admin()
    # Fetch artwork to get image key for cleanup
    artwork_result = (
        supabase.table("artworks")
        .select("*")
        .eq("id", artwork_id)
        .eq("user_id", current_user.id)
        .limit(1)
        .execute()
    )
    if not artwork_result.data:
        raise HTTPException(404, "Artwork not found")

    artwork = artwork_result.data[0]

    # Try R2 cleanup if URL is not a data URL
    if not artwork["image_url"].startswith("data:"):
        r2 = _try_r2()
        if r2:
            try:
                # Extract key from URL
                public_url = os.getenv("R2_PUBLIC_URL", "").rstrip("/")
                key = artwork["image_url"].replace(f"{public_url}/", "") if public_url else artwork["image_url"]
                r2.delete_file(key)
            except Exception:
                pass  # Best-effort cleanup

    supabase.table("artworks").eq("id", artwork_id).eq("user_id", current_user.id).delete().execute()
    return {"ok": True}
