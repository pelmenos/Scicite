import os

import pandas as pd
from django.conf import settings
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from mixin.response import ResponseHandlerMixin


class SubscribeAPIView(APIView, ResponseHandlerMixin):
    permission_classes = []
    authentication_classes = []

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING),
            },
            required=['email'],
        ),
        operation_description="Endpoint for subscribing with email",
        responses={
            200: "Email added successfully",
            400: "Bad Request - No email provided",
        },
    )
    def post(self, request, format=None):
        email = request.data.get('email')

        if not email:
            return self.error_response("No email")

        excel_file_path = settings.EMAILS_XLS_PATH

        if os.path.exists(excel_file_path):
            existing_df = pd.read_excel(excel_file_path, engine='openpyxl')

            new_data = {'Email': [email]}
            new_df = pd.DataFrame(new_data)
            updated_df = pd.concat([existing_df, new_df], ignore_index=True)

            updated_df.to_excel(excel_file_path, index=False, engine='openpyxl')

        else:
            data = {'Email': [email]}
            df = pd.DataFrame(data)
            df.to_excel(excel_file_path, index=False, engine='openpyxl')

        return self.success_response("Email added")