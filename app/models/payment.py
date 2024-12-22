import datetime
from enum import Enum
from typing import Optional
from uuid import UUID, uuid4

from beanie import Document, PydanticObjectId
from pydantic import Field, EmailStr, ConfigDict, computed_field, FutureDate, BaseModel
from pydantic_extra_types.country import CountryAlpha2
from pydantic_extra_types.currency_code import Currency
from pydantic_extra_types.phone_numbers import PhoneNumber

from app.common.util import utc_now, PydanticObjectIdSchema


class PaymentStatusEnum(str, Enum):
    completed = "completed"
    due_now = "due_now"
    overdue = "overdue"
    pending = "pending"


class Payment(Document):

    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: UUID = Field(default_factory=uuid4)
    payee_first_name: str
    payee_last_name: str
    payee_payment_status: PaymentStatusEnum = PaymentStatusEnum.pending
    payee_added_date_utc: datetime.datetime = Field(default_factory=utc_now)
    payee_due_date: datetime.date
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
    evidence_id: Optional[PydanticObjectId] = Field(None, exclude=True)

    @computed_field
    @property
    def total_due(self) -> float:
        tax_amount = (self.tax_percent or 0) * self.due_amount / 100
        discount_amount = (self.discount_percent or 0) * self.due_amount / 100
        return self.due_amount + tax_amount - discount_amount


class PaymentCreateRequest(BaseModel):
    payee_first_name: str
    payee_last_name: str
    payee_due_date: FutureDate
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


class PaymentUpdateRequest(BaseModel):
    payee_due_date: Optional[FutureDate] = None
    due_amount: Optional[float] = Field(None, ge=0)


class PaymentSearchCriteria(BaseModel):
    payee_first_name: Optional[str] = None
    payee_last_name: Optional[str] = None
    payee_payment_status: Optional[PaymentStatusEnum] = None
    payee_address_line_1: Optional[str] = None
    payee_address_line_2: Optional[str] = None
    payee_city: Optional[str] = None
    payee_country: Optional[str] = None
    payee_province_or_state: Optional[str] = None
    payee_postal_code: Optional[str] = None
    payee_phone_number: Optional[str] = None
    payee_email: Optional[str] = None
    currency: Optional[str] = None

    skip: int = 0
    limit: int = 10
    order_by: Optional[str] = "payee_added_date_utc"
