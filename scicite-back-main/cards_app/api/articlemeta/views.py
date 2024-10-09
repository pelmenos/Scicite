from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import JSONParser
from rest_framework_simplejwt.authentication import JWTAuthentication

from cards_app.api.serializers import (ArticleMetaCardCreateSerializer,
                                       ArticleMetaSerializer,
                                       AuthorsSerializer, KeywordsSerializer)
from cards_app.models import ArticleMeta, Authors, Keywords
from mixin.response import ResponseHandlerMixin
from utils.custom_permissions import CustomPermission
from utils.parsers import NestedMultipartParser


class ArticleMetaViewSet(viewsets.ModelViewSet, ResponseHandlerMixin):
    queryset = ArticleMeta.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'doi': ['exact'],
        'title': ['exact'],
        'journal_name': ['exact'],
    }
    pagination_class = PageNumberPagination
    authentication_classes = [JWTAuthentication]
    permission_classes = []
    #parser_classes = (JSONParser, NestedMultipartParser,)

    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT', 'PATCH']:
            return ArticleMetaCardCreateSerializer
        else:
            return ArticleMetaSerializer

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
            instance = serializer.save()
            for x in request.data.getlist('keywords[]', []):
                query = Keywords.objects.filter(id=x)
                if query:
                    instance.keywords.add(query.last())
            for x in request.data.getlist('authors[]', []):
                query = Authors.objects.filter(id=x)
                if query:
                    instance.authors.add(query.last())
            instance.save()
            return self.success_response(
                serializer.data, status_code=status.HTTP_201_CREATED
            )
        return self.error_response(serializer.errors)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.success_response(serializer.data)

    def update(self, request, *args, **kwargs):
        print(request.data)
        instance = self.get_object()
        serializer = ArticleMetaCardCreateSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return self.success_response(serializer.data)
        return self.error_response(serializer.errors)


class KeywordsViewSet(viewsets.ModelViewSet, ResponseHandlerMixin):
    queryset = Keywords.objects.all()
    serializer_class = KeywordsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'name': ['exact'],
    }
    pagination_class = PageNumberPagination
    authentication_classes = [JWTAuthentication]
    permission_classes = []



class AuthorsViewSet(viewsets.ModelViewSet, ResponseHandlerMixin):
    queryset = Authors.objects.all()
    serializer_class = AuthorsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'name': ['exact'],
    }
    pagination_class = PageNumberPagination
    authentication_classes = [JWTAuthentication]
    permission_classes = []
