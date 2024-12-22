from typing import List

from fastapi import HTTPException

from app.models.payment import (
    Payment,
    PaymentCreateRequest,
    PaymentUpdateRequest,
    PaymentSearchCriteria,
)
from app.repository.payment import create, get, delete, update, list_payment
from app.routes import router


@router.post("/payments/", response_model=Payment)
async def create_payment(request: PaymentCreateRequest):
    return await create(Payment(**request.model_dump()))


@router.get("/payments/{payment_id}", response_model=Payment)
async def get_payment(payment_id: str):
    result = await get(payment_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    return result


@router.put("/payments/{payment_id}", response_model=Payment)
async def update_payment(payment_id: str, payment_request: PaymentUpdateRequest):
    payment = await get(payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    updated_payment = await update(
        payment_id, payment_request.model_dump(exclude_unset=True)
    )
    if updated_payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    return updated_payment


@router.delete("/payments/{payment_id}", response_model=dict)
async def delete_payment(payment_id: str):
    delete_result = await delete(payment_id)
    if not delete_result:
        raise HTTPException(status_code=404, detail="Payment not found")
    return {"message": "Payment deleted successfully"}


@router.post("/payments/list/", response_model=List[Payment])
async def list_payments(search_criteria: PaymentSearchCriteria):
    query = search_criteria.model_dump(exclude_unset=True, exclude={"limit", "skip", "order_by"})
    payments = (
        await list_payment(query, search_criteria.skip, search_criteria.limit, search_criteria.order_by)
    )
    return payments
