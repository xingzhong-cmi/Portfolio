from __future__ import annotations

import os
from functools import lru_cache
from typing import BinaryIO

import boto3


class R2Service:
    def __init__(self) -> None:
        account_id = os.getenv("R2_ACCOUNT_ID")
        access_key = os.getenv("R2_ACCESS_KEY_ID")
        secret_key = os.getenv("R2_SECRET_ACCESS_KEY")
        self.bucket = os.getenv("R2_BUCKET_NAME")
        self.public_url = os.getenv("R2_PUBLIC_URL", "").rstrip("/")

        if not account_id or not access_key or not secret_key or not self.bucket:
            raise RuntimeError("R2 environment variables are missing")

        self._client = boto3.client(
            "s3",
            endpoint_url=f"https://{account_id}.r2.cloudflarestorage.com",
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name="auto",
        )

    def upload_file(self, file_obj: BinaryIO, key: str, content_type: str) -> str:
        self._client.upload_fileobj(
            file_obj,
            self.bucket,
            key,
            ExtraArgs={"ContentType": content_type},
        )

        if self.public_url:
            return f"{self.public_url}/{key}"

        return key

    def delete_file(self, key: str) -> None:
        self._client.delete_object(Bucket=self.bucket, Key=key)


@lru_cache(maxsize=1)
def get_r2_service() -> R2Service:
    return R2Service()
