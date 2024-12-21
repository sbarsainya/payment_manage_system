from typing import Optional, List

from fastapi import HTTPException
from fastapi import Request

from app.crud.payment import create, get, update, delete
from app.models.payment import Payment
from app.routes import router


@router.post("/", response_model=Payment)
async def create_payment(payment: Payment):
    payment_id = await create( payment)
    return {**payment.model_dump(), "id": str(payment_id)}

@router.get("/{payment_id}", response_model=Payment)
async def get_payment(payment_id: str):
    payment = await get( payment_id)
    return payment

@router.put("/{payment_id}", response_model=Payment)
async def update_payment(payment_id: str, payment: Payment):
    updated_count = await update( payment_id, payment)
    if updated_count == 0:
        raise HTTPException(status_code=404, detail="Payment not found")
    return {**payment.model_dump(), "id": payment_id}

@router.delete("/{payment_id}", response_model=dict)
async def delete_payment(payment_id: str):
    deleted_count = await delete( payment_id)
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Payment not found")
    return {"message": "Payment deleted successfully"}

@router.get("/", response_model=List[Payment])
async def list_payments(
        request: Request,
        payee_first_name: Optional[str] = None,
        payee_last_name: Optional[str] = None,
        payee_payment_status: Optional[str] = None,
        skip: int = 0,
        limit: int = 10
):
    query = {}
    if payee_first_name:
        query["payee_first_name"] = payee_first_name
    if payee_last_name:
        query["payee_last_name"] = payee_last_name
    if payee_payment_status:
        query["payee_payment_status"] = payee_payment_status

    payments = await request.app.mongodb["payments"].find(query).skip(skip).limit(limit).to_list(length=limit)
    return payments