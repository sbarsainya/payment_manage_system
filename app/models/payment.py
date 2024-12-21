import datetime
from datetime import date
from enum import Enum
from typing import Optional, Annotated

from pydantic import BaseModel, Field, EmailStr, BeforeValidator
from pydantic_extra_types.country import CountryAlpha2
from pydantic_extra_types.currency_code import Currency
from pydantic_extra_types.phone_numbers import PhoneNumber

PyObjectId = Annotated[str, BeforeValidator(str)]

class PaymentStatusEnum(str, Enum):
    completed = 'completed'
    due_now = 'due_now'
    overdue = 'overdue'
    pending = 'pending'

class Payment(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    payee_first_name: str
    payee_last_name: str
    payee_payment_status: PaymentStatusEnum
    payee_added_date_utc: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    payee_due_date: date
    payee_address_line_1: str
    payee_address_line_2: Optional[str] = None
    payee_city: str
    payee_country: CountryAlpha2
    payee_province_or_state: Optional[str] = None
    payee_postal_code: str
    payee_phone_number: PhoneNumber
    payee_email: EmailStr
    currency: Currency
    discount_percent: Optional[float] = Field(None, ge=0, le=100)
    tax_percent: Optional[float] = Field(None, ge=0, le=100)
    due_amount: float = Field(..., ge=0)