from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from mixin.response import ResponseHandlerMixin
from profiles_app.api.serializers import SettingsModelSerializer
from profiles_app.models import SettingsModel


class SettingsModelAPIView(APIView, ResponseHandlerMixin):
    authentication_classes = []
    permission_classes = []
    def get(self, request, *args, **kwargs):
        settings_instance = SettingsModel.objects.first()
        
        if not settings_instance:
            return self.error_response({"detail": "Настройки не найдены"})
        
        serializer = SettingsModelSerializer(settings_instance)
        return self.success_response(serializer.data)

    def put(self, request, *args, **kwargs):
        settings_instance = SettingsModel.objects.first()
        
        if not settings_instance:
            return self.error_response({"detail": "Настройки не найдены"})
        
        serializer = SettingsModelSerializer(settings_instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return self.success_response(serializer.data)
        return self.error_response(serializer.errors)
