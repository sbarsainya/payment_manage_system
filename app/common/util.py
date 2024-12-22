import datetime
from pydantic import BaseModel


def utc_now() -> datetime:
    return datetime.datetime.now(datetime.UTC)


def is_due_date_today(due_date: datetime.date) -> bool:
    return due_date == datetime.date.today()


def is_over_due(due_date: datetime.date) -> bool:
    return due_date < datetime.date.today()


class PydanticObjectIdSchema(BaseModel):
    @classmethod
    def __get_pydantic_json_schema__(cls, schema):
        schema.update(type="string", format="objectid")
        return schema
