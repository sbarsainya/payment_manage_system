import uvicorn
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from app.db.setup import db_lifespan
from app.routes import health_check, payments, evidence

app: FastAPI = FastAPI(lifespan=db_lifespan)
# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(evidence.router)
app.include_router(payments.router)
app.include_router(health_check.router)

@app.get("/{full_path:path}")
async def serve_angular_app(full_path: str):
    return FileResponse("frontend/dist/frontend/browser/index.html")


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
