from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.filters import SearchFilter
from rest_framework.generics import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from mixin.response import ResponseHandlerMixin
from profiles_app.api.users.views import UserStatisticView
from profiles_app.models import Counter
from support_app.api.serializers import (AdminSupportSerializer,
                                         SupportCreateSerializer,
                                         SupportSerializer)
from support_app.models import Support
from utils.custom_permissions import CustomPermission


class SupportViewSet(viewsets.ModelViewSet, ResponseHandlerMixin):
    queryset = Support.objects.all()
    serializer_class = SupportSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
        'offer__id': ['exact'],
        'declarer__id': ['exact'],
        'reporter__id': ['exact'],
        'status': ['in'],
        'type_support': ['in'],
    }

    search_fields = ['narrative', 'response']
    pagination_class = PageNumberPagination
    authentication_classes = [JWTAuthentication]
    permission_classes = [CustomPermission]

    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT', 'PATCH']:
            return SupportCreateSerializer
        else:
            return SupportSerializer

    def get_object(self):
        if 'pk' not in self.kwargs:
            return super().get_object()
        return self.queryset.get(pk=self.kwargs['pk'])

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.order_by('-created_at')

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return self.success_response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return self.success_response(
                serializer.data, status_code=status.HTTP_201_CREATED)
        return self.error_response(serializer.errors)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.success_response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return self.success_response(serializer.data)
        return self.error_response(serializer.errors)


class AdminHelpView(APIView, ResponseHandlerMixin):
    authentication_classes = []
    permission_classes = []
    pagination_class = PageNumberPagination

    def get(self, request, *args, **kwargs):
        supports = Support.objects.exclude(type_support__name__in=["спор", "связь", 'Отказ'])
        supports = supports.order_by('-created_at')


        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(supports, request)
        
        serializer = AdminSupportSerializer(result_page, many=True, context={'request': request})

        return paginator.get_paginated_response(serializer.data)