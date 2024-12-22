"""This module defines a health check route."""

from http import HTTPStatus

from app.routes import router


@router.get(
    path="/ht",
    status_code=HTTPStatus.OK,
    description="Health check status of payment service",
    summary="Get health check status",
    operation_id="get_ht",
    response_model=dict[str, str],
)
async def health_check() -> dict[str, str] | None:
    """
    Return 200 signifying a successful health check.

    :return: None
    """
    return {}
