from django.contrib.auth import update_session_auth_hash
from django.db.models import Sum
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from mixin.response import ResponseHandlerMixin
from profiles_app.api.serializers import UserAchievementSerializer
from profiles_app.models import UserAchievement
from utils.custom_permissions import CustomPermission


class UserAchievementViewSet(ResponseHandlerMixin, viewsets.ReadOnlyModelViewSet):
    queryset = UserAchievement.objects.all()
    serializer_class = UserAchievementSerializer
    pagination_class = PageNumberPagination
    authentication_classes = [JWTAuthentication]
    permission_classes = [CustomPermission]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
        'user__id': ['exact'],
    }

    def get_object(self):
        if 'pk' not in self.kwargs:
            return super().get_object()
        return self.queryset.get(pk=self.kwargs['pk'])
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.success_response(serializer.data)

    # @swagger_auto_schema(
    #     operation_description="Get all achievements for a specific user",
    #     responses={200: UserAchievementSerializer(many=True)}
    # )
    # @action(detail=False, methods=['get'], url_path='(?P<user_id>[^/.]+)')
    # def get_user_achievements(self, request, user_id):
    #     queryset = self.get_queryset()
    #     serializer = self.get_serializer(queryset, many=True)
    #     return self.success_response(serializer.data)