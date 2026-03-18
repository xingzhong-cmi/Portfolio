import os

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import artworks, auth, portfolio, public



app = FastAPI(title="Folio API", version="0.1.0")

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(artworks.router, prefix="/api")
app.include_router(portfolio.router, prefix="/api")
app.include_router(public.router, prefix="/api")


@app.get("/health")
def health_check():
    return {"ok": True}
