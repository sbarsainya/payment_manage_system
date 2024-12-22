from beanie.odm.operators.update.general import Set

from app.common.util import is_due_date_today, is_over_due
from app.models.payment import Payment, PaymentStatusEnum


async def create(payment: Payment):
    result = await Payment.insert_one(payment)
    return result


async def get(payment_id: str):
    result = await Payment.get(payment_id)
    if result:
        if is_due_date_today(result.payee_due_date):
            result.payee_payment_status = PaymentStatusEnum.due_now
            await result.replace()
        elif is_over_due(result.payee_due_date):
            result.payee_payment_status = PaymentStatusEnum.overdue
            await result.replace()
    return result


async def update(payment_id, updated_data):
    payment = await get(payment_id)
    if payment:
        await payment.update(Set(updated_data))
    return payment


async def update_evidence(payment_id: str, evidence_id: str):
    payment = await get(payment_id)
    if payment:
        payment.evidence_id = evidence_id
        payment.payee_payment_status = PaymentStatusEnum.completed
        await payment.replace()
    return payment


async def delete(payment_id: str):
    payment = await get(payment_id)
    if payment:
        return await payment.delete()


async def list_payment(query, skip, limit, order_by):
    return await Payment.find(query)    .sort(order_by)    .skip(skip)    .limit(limit)    .to_list()
