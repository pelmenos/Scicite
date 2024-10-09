from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.authentication import JWTAuthentication

from mixin.response import ResponseHandlerMixin
from profiles_app.api.serializers import (CreateTransactionsSerializer,
                                          TransactionsSerializer)
from profiles_app.models import Transacitons, User
from utils.custom_permissions import CustomPermission
from utils.payment import create_payment, create_transaction


class TransacitonsViewSet(viewsets.ModelViewSet, ResponseHandlerMixin):
    queryset = Transacitons.objects.all()
    serializer_class = TransactionsSerializer
    pagination_class = PageNumberPagination
    authentication_classes = [JWTAuthentication]
    permission_classes = [CustomPermission]

    def get_object(self):
        if 'pk' not in self.kwargs:
            return super().get_object()
        return self.queryset.get(pk=self.kwargs['pk'])

    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return CreateTransactionsSerializer
        elif self.request.method in ['PUT', 'PATCH']:
            return CreateTransactionsSerializer
        else:
            return TransactionsSerializer

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
            user = User.objects.filter(login=request.data['user'].lower())
            if not user:
                return self.error_response("Not found", 404)
            user = user.last()
            if request.data['type_transaction'] == 'plus':
                create_transaction(user, int(request.data['sum']), 'enrollment_admin')
            elif request.data['type_transaction'] == 'minus':
                create_payment(user, int(request.data['sum']), 'enrollment_admin')
            else:
                return self.error_response("Баланс не может быть 0")
            return self.success_response(
                serializer.data, status_code=status.HTTP_201_CREATED)
        return self.error_response(serializer.errors)
    
    def cancel_transaction(self, request, pk):
        try:
            transaction = Transacitons.objects.get(pk=pk)
        except Transacitons.DoesNotExist:
            return self.error_response("Не найдена транзакция")

        if not transaction.canceled_is:
            transaction.canceled_is = True
            transaction.save()
            user = transaction.user  
            user.balance -= transaction.sum
            user.save()

            return self.success_response()
        else:
            return self.error_response()

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
