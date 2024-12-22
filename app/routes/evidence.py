from bson import ObjectId
from fastapi import HTTPException, UploadFile, File, APIRouter
from motor.motor_asyncio import (
    AsyncIOMotorClient,
    AsyncIOMotorDatabase,
    AsyncIOMotorGridFSBucket,
)
from starlette.responses import StreamingResponse

from app.models.payment import PaymentStatusEnum
from app.repository.payment import update_evidence, get
from app.routes import router

client = AsyncIOMotorClient("mongodb://localhost:27017")
db: AsyncIOMotorDatabase = client["evidence"]
fs = AsyncIOMotorGridFSBucket(db)


@router.post("/payments/{payment_id}/evidence")
async def upload_evidence(payment_id: str, file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png", "application/pdf"]:
        raise HTTPException(status_code=400, detail="Invalid file format")

    payment = await get(payment_id)
    if not payment or payment.payee_payment_status == PaymentStatusEnum.completed:
        raise HTTPException(
            status_code=400, detail="Payment not found or already completed"
        )

    try:
        evidence_id = await fs.upload_from_stream(
            file.filename, file.file, metadata={"contentType": file.content_type}
        )

        await update_evidence(payment_id, str(evidence_id))

        return {"message": "Evidence uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/payments/{payment_id}/evidence")
async def download_evidence(payment_id: str):
    payment = await get(payment_id)
    if not payment or not payment.evidence_id:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        stream = await fs.open_download_stream(payment.evidence_id)
        filename = stream.filename
        content_type = stream.metadata["contentType"]

        headers = {"Content-Disposition": f'attachment; filename="{filename}"'}

        return StreamingResponse(stream, media_type=content_type, headers=headers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
