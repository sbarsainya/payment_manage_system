"""Initializes FastAPI APIRouter."""

from fastapi import APIRouter

router: APIRouter = APIRouter(
    tags=["payment"],
)
