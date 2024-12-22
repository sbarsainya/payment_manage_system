from contextlib import asynccontextmanager

from beanie import init_beanie
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient

from app.models.payment import Payment


@asynccontextmanager
async def db_lifespan(app: FastAPI):
    client = AsyncIOMotorClient("mongodb://localhost:27017/adcore")

    await init_beanie(database=client.db_name, document_models=[Payment])

    yield
    # Shutdown
    client.close()
