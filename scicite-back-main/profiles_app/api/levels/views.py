from rest_framework import status, viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from mixin.response import ResponseHandlerMixin
from profiles_app.api.serializers import LevelsSerializer
from profiles_app.models import Counter, Levels
from utils.custom_permissions import CustomPermission
from utils.model_levels import get_next_level


class LevelsViewSet(viewsets.ModelViewSet, ResponseHandlerMixin):
    queryset = Levels.objects.all()
    serializer_class = LevelsSerializer
    pagination_class = PageNumberPagination
    authentication_classes = [JWTAuthentication]
    permission_classes = [CustomPermission]

    def get_object(self):
        if 'pk' not in self.kwargs:
            return super().get_object()
        return self.queryset.get(pk=self.kwargs['pk'])

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter()

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


class ProgressView(ResponseHandlerMixin, APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        user = self.request.user
        level_user = user.level
        counter, _ = Counter.objects.get_or_create(user=user)
        next_level = get_next_level(level_user)

        data = {
            "level":LevelsSerializer(level_user).data,
            "count_publication":(counter.count_publication-counter.count_created_offers) if level_user.name!="beginner" else counter.count_publication,
            "next_level":LevelsSerializer(next_level).data if next_level else None
        }
        return self.success_response(data)