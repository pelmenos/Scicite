from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.authentication import JWTAuthentication

from cards_app.api.serializers import TariffSerializer
from cards_app.models import Tariff
from mixin.response import ResponseHandlerMixin
from utils.custom_permissions import CustomPermission


class TariffViewSet(viewsets.ModelViewSet, ResponseHandlerMixin):
    queryset = Tariff.objects.all()
    serializer_class = TariffSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'scicoins': ['exact'],
        'period': ['exact'],
    }
    authentication_classes = [JWTAuthentication]
    permission_classes = [CustomPermission]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter()

        serializer = self.get_serializer(queryset, many=True)
        return self.success_response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return self.success_response(
            serializer.data, status_code=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, pk=pk)
        serializer = self.get_serializer(obj)
        return self.success_response(serializer.data)

    def update(self, request, pk=None):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, pk=pk)
        serializer = self.get_serializer(obj, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return self.success_response(serializer.data)

    def destroy(self, request, pk=None):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, pk=pk)
        obj.delete()
        return self.success_response(status_code=status.HTTP_204_NO_CONTENT)
