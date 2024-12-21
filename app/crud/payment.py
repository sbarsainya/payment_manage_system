from bson.objectid import ObjectId

from app.db.setup import mongodb_client
from app.models.payment import Payment


async def create(payment: Payment):
    result = await mongodb_client["payments"].insert_one(payment.model_dump())
    return result.inserted_id


async def get(payment_id: str):
    item = await mongodb_client["payments"].find_one({"_id": payment_id})
    return item


async def update(payment_id: str, payment: Payment):
    result = await mongodb_client["payments"].update_one(
        {"_id": ObjectId(payment_id)},
        {"$set": payment.model_dump()}
    )
    return result.modified_count


async def delete(payment_id: str):
    result = await mongodb_client["payments"].delete_one({"_id": ObjectId(payment_id)})
    return result.deleted_count
