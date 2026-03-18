from fastapi import APIRouter, HTTPException

from services.supabase_admin import get_supabase_admin

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/{slug}")
def get_public_portfolio(slug: str):
    supabase = get_supabase_admin()

    # Find published portfolio by slug
    portfolio_result = (
        supabase.table("portfolios")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", "true")
        .limit(1)
        .execute()
    )

    if not portfolio_result.data:
        raise HTTPException(404, "Portfolio not found or not published")

    portfolio = portfolio_result.data[0]

    # Fetch artworks for this user
    artworks_result = (
        supabase.table("artworks")
        .select("*")
        .eq("user_id", portfolio["user_id"])
        .order("sort_order", desc=False)
        .execute()
    )

    return {
        "portfolio": portfolio,
        "artworks": artworks_result.data or [],
    }
