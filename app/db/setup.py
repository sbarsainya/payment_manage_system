from contextlib import asynccontextmanager
from logging import info

from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient

mongodb_client = None

@asynccontextmanager
async def db_lifespan(app: FastAPI):
    global mongodb_client
    # Startup
    mongodb_client = AsyncIOMotorClient("mongodb://localhost:27017/adcore")
    mongodb_client = mongodb_client.get_default_database()
    ping_response = await mongodb_client.command("ping")
    if int(ping_response["ok"]) != 1:
        raise Exception("Problem connecting to database cluster.")
    else:
        breakpoint()
        info("Connected to database cluster.")

    yield
    # Shutdown
    mongodb_client.close()