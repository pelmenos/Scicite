from datetime import datetime

from django.conf import settings
from django.template.loader import render_to_string
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import filters, status, viewsets
from rest_framework.filters import SearchFilter
from rest_framework.generics import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from cards_app.models import Cards
from mixin.response import ResponseHandlerMixin
from offers_app.api.serializers import (OffersCreateSerializer,
                                        OffersSerializer,
                                        OffersUpdateSerializer)
from offers_app.models import Offers, OffersStatus
from profiles_app.models import Counter, UserAchievement
from utils.custom_permissions import CustomPermission
from utils.offers_update import OfferHandler


class OffersViewSet(viewsets.ModelViewSet, ResponseHandlerMixin):
    queryset = Offers.objects.all()
    serializer_class = OffersSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'card__id': ['exact'],
        'status_executor__id': ['exact'],
        'status_customer__id': ['exact'],
        'perfomer__id': ['exact'],
    }
    search_fields = ['card__theme', 'perfomer__username']
    pagination_class = PageNumberPagination
    authentication_classes = [JWTAuthentication]
    permission_classes = [CustomPermission]

    def get_object(self):
        if 'pk' not in self.kwargs:
            return super().get_object()
        return self.queryset.get(pk=self.kwargs['pk'])
    
    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return OffersCreateSerializer
        elif self.request.method in ['PUT', 'PATCH']:
            return OffersUpdateSerializer
        else:
            return OffersSerializer

    def list(self, request, *args, **kwargs):
        is_evidence = self.request.query_params.get('is_evidence', False)

        queryset = self.filter_queryset(self.get_queryset())

        if is_evidence:
            queryset = queryset.exclude(evidence__isnull=True)

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
            validated_data = serializer.validated_data
            
            count_offers = Offers.objects.filter(
                perfomer=validated_data["perfomer"],
                created_at__year=datetime.now().year,
                created_at__month=datetime.now().month
            ).count()
            if count_offers >= validated_data["perfomer"].level.limit:
                return self.error_response("Превышен лимит откликов")
            instance = serializer.save()
            data_dict = dict(serializer.data)
            
            if Counter.objects.filter(user=validated_data["perfomer"], count_created_offers=1).exists() and not instance.barter:
                achievement, _ = UserAchievement.objects.get_or_create(user=validated_data["perfomer"], achievement='first_offer')
                achievement = achievement.id
                data_dict['achievement'] = achievement
            return self.success_response(
                data_dict,)
        return self.error_response(serializer.errors)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.success_response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            offer_handler = OfferHandler(instance, serializer.validated_data)
            serializer.save()
            achievement = offer_handler.update_instance()
            data_dict = dict(serializer.data)
            if achievement:
                data_dict['achievement'] = achievement.id
            return self.success_response(data_dict)
        return self.error_response(serializer.errors)

