from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache
from typing import Any

import httpx
import jwt as pyjwt
from fastapi import Header, HTTPException, status


SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_JWKS_URL = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"


@dataclass
class CurrentUser:
    id: str
    email: str | None


@lru_cache(maxsize=1)
def _fetch_jwks() -> list[dict[str, Any]]:
    """Fetch JWKS from Supabase and return the list of key dicts."""
    if not SUPABASE_URL:
        raise RuntimeError("SUPABASE_URL is not configured")
    resp = httpx.get(SUPABASE_JWKS_URL, timeout=10)
    resp.raise_for_status()
    return resp.json().get("keys", [])


def _find_key_and_algorithm(token: str) -> tuple[Any, str]:
    """Match the token's kid to a JWK and return (key, algorithm)."""
    jwks = _fetch_jwks()
    header = pyjwt.get_unverified_header(token)
    kid = header.get("kid")
    alg = header.get("alg", "RS256")

    for jwk_dict in jwks:
        if jwk_dict.get("kid") == kid:
            key = pyjwt.algorithms.get_default_algorithms()[alg].from_jwk(jwk_dict)
            return key, alg

    raise ValueError("No matching signing key found")


def decode_supabase_jwt(token: str) -> dict[str, Any]:
    if not SUPABASE_URL:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SUPABASE_URL missing",
        )

    try:
        key, alg = _find_key_and_algorithm(token)
        payload = pyjwt.decode(
            token,
            key,
            algorithms=[alg],
            options={"verify_aud": False},
            issuer=f"{SUPABASE_URL}/auth/v1",
        )
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        ) from exc

    return payload


def extract_bearer_token(authorization: str | None) -> str:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
        )

    prefix = "Bearer "
    if not authorization.startswith(prefix):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization scheme",
        )

    return authorization[len(prefix) :].strip()


def get_current_user(authorization: str | None = Header(default=None)) -> CurrentUser:
    token = extract_bearer_token(authorization)
    payload = decode_supabase_jwt(token)
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing sub",
        )

    return CurrentUser(id=user_id, email=payload.get("email"))
