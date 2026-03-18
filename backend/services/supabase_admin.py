from __future__ import annotations

import os
from functools import lru_cache
from typing import Any

import httpx


def _get_config() -> tuple[str, str]:
    supabase_url = os.getenv("SUPABASE_URL", "")
    service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    if not supabase_url or not service_role_key:
        raise RuntimeError("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing")
    return supabase_url, service_role_key


@lru_cache(maxsize=1)
def _get_client() -> httpx.Client:
    supabase_url, service_role_key = _get_config()
    return httpx.Client(
        base_url=f"{supabase_url}/rest/v1",
        headers={
            "apikey": service_role_key,
            "Authorization": f"Bearer {service_role_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        },
        timeout=15,
    )


class SupabaseTable:
    """Lightweight PostgREST query builder (only the subset used by this project)."""

    def __init__(self, client: httpx.Client, table: str) -> None:
        self._client = client
        self._table = table
        self._params: dict[str, str] = {}
        self._method = "GET"
        self._body: Any = None
        self._extra_headers: dict[str, str] = {}

    # --- filters ---

    def select(self, columns: str = "*") -> SupabaseTable:
        self._params["select"] = columns
        return self

    def eq(self, column: str, value: str) -> SupabaseTable:
        self._params[column] = f"eq.{value}"
        return self

    def limit(self, n: int) -> SupabaseTable:
        self._extra_headers["Range"] = f"0-{n - 1}"
        return self

    def order(self, column: str, *, desc: bool = False) -> SupabaseTable:
        direction = "desc" if desc else "asc"
        self._params["order"] = f"{column}.{direction}"
        return self

    # --- mutations ---

    def insert(self, data: dict[str, Any] | list[dict[str, Any]]) -> SupabaseTable:
        self._method = "POST"
        self._body = data
        return self

    def upsert(self, data: dict[str, Any] | list[dict[str, Any]], *, on_conflict: str = "") -> SupabaseTable:
        self._method = "POST"
        self._body = data
        self._extra_headers["Prefer"] = "return=representation,resolution=merge-duplicates"
        if on_conflict:
            self._params["on_conflict"] = on_conflict
        return self

    def update(self, data: dict[str, Any]) -> SupabaseTable:
        self._method = "PATCH"
        self._body = data
        return self

    def delete(self) -> SupabaseTable:
        self._method = "DELETE"
        return self

    # --- execute ---

    def execute(self) -> _SupabaseResponse:
        url = f"/{self._table}"
        headers = {**self._extra_headers}
        if self._method == "GET":
            resp = self._client.get(url, params=self._params, headers=headers)
        elif self._method == "POST":
            resp = self._client.post(url, params=self._params, json=self._body, headers=headers)
        elif self._method == "PATCH":
            resp = self._client.patch(url, params=self._params, json=self._body, headers=headers)
        elif self._method == "DELETE":
            resp = self._client.delete(url, params=self._params, headers=headers)
        else:
            raise ValueError(f"Unsupported method {self._method}")

        resp.raise_for_status()

        try:
            data = resp.json()
        except Exception:
            data = []

        if isinstance(data, dict):
            data = [data]

        return _SupabaseResponse(data=data)


class _SupabaseResponse:
    def __init__(self, data: list[dict[str, Any]]) -> None:
        self.data = data


class SupabaseAdmin:
    """Drop-in replacement exposing only `.table(name)` used by routers."""

    def __init__(self, client: httpx.Client) -> None:
        self._client = client

    def table(self, name: str) -> SupabaseTable:
        return SupabaseTable(self._client, name).select("*")


def get_supabase_admin() -> SupabaseAdmin:
    return SupabaseAdmin(_get_client())
