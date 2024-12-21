import uvicorn
from fastapi import FastAPI

from app.db.setup import db_lifespan
from app.routes import health_check, payments

app: FastAPI = FastAPI(lifespan=db_lifespan)

app.include_router(health_check.router)
app.include_router(payments.router, prefix="/api/payments")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)