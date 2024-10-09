from typing import Optional

from rest_framework import status
from rest_framework.response import Response


class ResponseHandlerMixin:
    @staticmethod
    def success_response(
            data: Optional[dict] = None,
            message: Optional[str] = None,
            status_code: int = status.HTTP_200_OK) -> Response:
        response_data = {'success': True}
        if data:
            response_data['data'] = data
        if message:
            response_data['message'] = message
        return Response(response_data, status=status_code)

    @staticmethod
    def error_response(
            message: str = None,
            status_code: int = status.HTTP_400_BAD_REQUEST) -> Response:
        response_data = {'error': True, 'message': message}
        return Response(response_data, status=status_code)
