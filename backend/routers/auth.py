from fastapi import APIRouter, Depends, HTTPException, status

from auth import CurrentUser, get_current_user
from models import RegisterProfileRequest, RegisterProfileResponse
from services.supabase_admin import get_supabase_admin


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=RegisterProfileResponse)
def register_profile(
    payload: RegisterProfileRequest,
    current_user: CurrentUser = Depends(get_current_user),
):

    if current_user.email and current_user.email.lower() != payload.email.lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email mismatch with current authenticated user",
        )

    supabase = get_supabase_admin()
    profile_payload = {
        "id": current_user.id,
        "email": payload.email,
        "display_name": payload.display_name,
        "avatar_url": payload.avatar_url,
    }
    supabase.table("profiles").upsert(profile_payload, on_conflict="id").execute()

    return RegisterProfileResponse(profile_id=current_user.id)
