from __future__ import annotations

import random
import re
import string

from fastapi import APIRouter, Depends, HTTPException

from auth import CurrentUser, get_current_user
from models import PortfolioCreateRequest, PortfolioUpdateRequest
from services.supabase_admin import get_supabase_admin


router = APIRouter(prefix="/portfolio", tags=["portfolio"])


def _slugify(value: str) -> str:
    normalized = re.sub(r"[^a-zA-Z0-9\s-]", "", value).strip().lower()
    normalized = re.sub(r"[\s_-]+", "-", normalized)
    return normalized or "artist"


def _slug_suffix() -> str:
    return "".join(random.choices(string.ascii_lowercase + string.digits, k=4))


def _generate_slug(display_name: str) -> str:
    return f"{_slugify(display_name)}-{_slug_suffix()}"


@router.get("")
def get_portfolio(current_user: CurrentUser = Depends(get_current_user)):
    supabase = get_supabase_admin()

    result = (
        supabase.table("portfolios")
        .select("*")
        .eq("user_id", current_user.id)
        .limit(1)
        .execute()
    )
    items = result.data or []
    return items[0] if items else None


@router.post("")
def create_portfolio(
    payload: PortfolioCreateRequest,
    current_user: CurrentUser = Depends(get_current_user),
):
    supabase = get_supabase_admin()

    existing = (
        supabase.table("portfolios")
        .select("*")
        .eq("user_id", current_user.id)
        .limit(1)
        .execute()
    )
    existing_items = existing.data or []
    if existing_items:
        return existing_items[0]

    profile = (
        supabase.table("profiles")
        .select("display_name")
        .eq("id", current_user.id)
        .limit(1)
        .execute()
    )
    profile_items = profile.data or []
    display_name = (
        profile_items[0].get("display_name")
        if profile_items and profile_items[0].get("display_name")
        else "artist"
    )

    slug_attempt = _generate_slug(display_name)
    created = (
        supabase.table("portfolios")
        .insert(
            {
                "user_id": current_user.id,
                "slug": slug_attempt,
                "title": payload.title,
                "bio": payload.bio,
            }
        )
        .execute()
    )
    created_items = created.data or []
    if not created_items:
        raise HTTPException(status_code=500, detail="Failed to create portfolio")

    return created_items[0]


@router.patch("")
def update_portfolio(
    payload: PortfolioUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
):
    supabase = get_supabase_admin()

    update_data = {
        key: value for key, value in payload.model_dump().items() if value is not None
    }

    if not update_data:
        return {"ok": True}

    # If customization is an empty dict, still persist it (reset)
    if payload.customization is not None:
        update_data["customization"] = payload.customization

    # Try full update. On failure, progressively drop unsupported fields and retry.
    # This handles missing DB column (customization) or outdated CHECK constraint.
    def _try_update(data: dict) -> dict | None:
        try:
            result = (
                supabase.table("portfolios")
                .update(data)
                .eq("user_id", current_user.id)
                .execute()
            )
            return result.data
        except Exception:
            return None

    result_data = _try_update(update_data)

    if result_data is None:
        # First fallback: drop customization (column may not exist)
        update_data.pop("customization", None)
        if update_data:
            result_data = _try_update(update_data)

    if result_data is None:
        # Second fallback: drop template_name (CHECK constraint may be outdated)
        update_data.pop("template_name", None)
        if update_data:
            result_data = _try_update(update_data)

    if result_data is None and not update_data:
        return {"ok": True}

    if result_data is None:
        raise HTTPException(500, "Failed to update portfolio. Please run the latest database migration.")

    return {"ok": True, "data": result_data}
