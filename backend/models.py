from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class RegisterProfileRequest(BaseModel):
    email: EmailStr
    display_name: str | None = None
    avatar_url: str | None = None


class RegisterProfileResponse(BaseModel):
    profile_id: str


class ArtworkUpdateRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    sort_order: int | None = Field(default=None, ge=0)


class PortfolioCreateRequest(BaseModel):
    title: str | None = None
    bio: str | None = None


class PortfolioUpdateRequest(BaseModel):
    template_name: Literal["minimal", "dark", "magazine", "cyber"] | None = None
    title: str | None = None
    bio: str | None = Field(default=None, max_length=200)
    is_published: bool | None = None
