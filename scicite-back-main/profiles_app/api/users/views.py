from django.conf import settings
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.tokens import default_token_generator
from django.db.models import Sum
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.pagination import (LimitOffsetPagination,
                                       PageNumberPagination)
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from cards_app.models import Cards
from mixin.response import ResponseHandlerMixin
from offers_app.models import Offers
from profiles_app.api.serializers import (LevelsSerializer,
                                          NotificationSerializer,
                                          PasswordChangeSerializer,
                                          UserSerializer,
                                          UserStatisticSerializer)
from profiles_app.models import (Counter, Notification, Transacitons, User,
                                 UserAchievement)
from utils.custom_permissions import CustomPermission
from utils.email import EmailSender


class UserViewSet(ResponseHandlerMixin, viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
        'level__id': ['exact'],
        'roles__id': ['exact'],
    }
    search_fields = ['username', 'login']
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
            email = serializer.validated_data.get('email')
            if email and email != instance.email:
                if User.objects.filter(email=email):
                    return self.error_response("E-mail уже используется")
                instance.new_email = email
                instance.save()
                user = instance
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                token = default_token_generator.make_token(user)
                subject = "Подтверждение почты"
                verification_link = f"https://scisource.ru/main?edit_email&uid={uid}&token={token}"
                html_message = render_to_string('mail/change_mail.html', {'link': verification_link})
                EmailSender(
                    settings.EMAIL_HOST, settings.EMAIL_PORT,
                    settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD
                ).send_email(subject, email, html_message)
            serializer.save()
            return self.success_response(serializer.data)
        return self.error_response(serializer.errors)


class UserStatisticView(ResponseHandlerMixin, APIView):
    authentication_classes = []
    permission_classes = []
    
    def get(self, request, id):
        user = get_object_or_404(User, id=id)
        user_statistic = self.get_user_statistic(user)
        serializer = UserStatisticSerializer(data=user_statistic)

        if serializer.is_valid(raise_exception=True):
            return self.success_response(serializer.data)
        
    def get_user_statistic(self, user):
        counter, _ = Counter.objects.get_or_create(user=user)
        citations_received = counter.count_publication
        citations_formatted = counter.count_created_citation

        offers = Offers.objects.filter(perfomer=user)
        count_all_offers_user = offers.filter(status_executor__code=5).count()
        successful_citations = 0
        if count_all_offers_user != 0:
            try:
                successful_citations = round((counter.count_created_citation / (counter.count_created_citation+counter.count_reject)) * 100, 2)
            except ZeroDivisionError:
                successful_citations = 0

        cards_user = Cards.objects.filter(user=user)

        scicoins_spent = Transacitons.objects.filter(user=user, type_transaction='minus').aggregate(Sum('sum'))['sum__sum']

        scicoins_earned = Transacitons.objects.filter(user=user, type_transaction='plus').aggregate(Sum('sum'))['sum__sum']

        counter_obj, created_counter = Counter.objects.get_or_create(
            user=user
        )

        if created_counter:
            counter_obj.count_created_cards = cards_user.count()
            counter_obj.save()

        cards_count = counter_obj.count_created_cards

        achievement_count = UserAchievement.objects.filter(user=user).count()

        return {
            "citations_received": counter.count_citation,
            "citations_formatted": citations_formatted,
            "successful_citations": f"{successful_citations}%",
            "scicoins_spent": scicoins_spent or 0,
            "scicoins_earned": scicoins_earned or 0,
            "exchanges_completed": offers.filter(status_executor__code=5, barter_is=True).count(),
            "card_create": cards_count,
            "achievement_count": achievement_count,
        }
        

class PasswordChangeViewSet(ResponseHandlerMixin, viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]

    @action(detail=False, methods=['post'])
    @swagger_auto_schema(
        request_body=PasswordChangeSerializer,
        responses={status.HTTP_200_OK: 'Password changed successfully', status.HTTP_400_BAD_REQUEST: 'Bad Request'}
    )
    def change_password(self, request):
        user = request.user
        serializer = PasswordChangeSerializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']
            confirm_password = serializer.validated_data['confirm_password']

            if not user.check_password(old_password):
                return self.error_response({'error': 'Incorrect old password'})

            if new_password != confirm_password:
                return self.error_response({'error': 'New passwords do not match'})

            user.set_password(new_password)
            user.save()
            update_session_auth_hash(request, user) 
            return self.success_response({'message': 'Password changed successfully'})
        return self.error_response(serializer.errors)


class NotificationListView(ResponseHandlerMixin, APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        history = request.query_params.get('history', False) == 'true' 
        if history:
            notifications = Notification.objects.filter(user=self.request.user)
        else:
            query = Notification.objects.filter(user=self.request.user, is_read=False, is_active=True).order_by('-created_at')
            notifications = list(query)
           # query.update(is_read=True)
        serializer = NotificationSerializer(notifications, many=True)
        return self.success_response({"rows":serializer.data})


class NotificationClearView(ResponseHandlerMixin, APIView):
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        Notification.objects.filter(user=self.request.user).update(is_active=False)
        
        return self.success_response({"message": "Уведомления успешно очищены."})
    

class UserAdminView(ResponseHandlerMixin, APIView):
    authentication_classes = []
    permission_classes = []
    pagination_class = LimitOffsetPagination

    def get(self, request):
        login = request.query_params.get('filter_login', None)

        if login:
            users = User.objects.filter(username__icontains=login).order_by('-created_at')
        else:
            users = User.objects.all().order_by('-created_at')

        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(users, request)
        users_data = []
        for user in result_page:
            transactions_sum = Transacitons.objects.filter(user=user, type_transaction='plus').aggregate(Sum('sum'))['sum__sum'] or 0

            counter_data = Counter.objects.filter(user=user).values(
                'count_created_cards', 'count_created_offers',
            
            ).first()

            if counter_data:
                count_created_cards = counter_data['count_created_cards'] or 0
                count_created_offers = counter_data['count_created_offers'] or 0

            user_statistic = UserStatisticView().get_user_statistic(user)

            user_data = {
                "id": user.id,
                "login": user.username,
                "date_joined": user.date_joined,
                "transactions_sum": transactions_sum,
                "user_created_at":user.created_at,
                "full_name":user.full_name,
                "number_phone":user.number_phone,
                "email":user.email,
                "level":LevelsSerializer(user.level).data,
                "balance": user.balance,
                "count_created_cards": count_created_cards,
                "count_created_offers": count_created_offers,
                **user_statistic,
            }
            users_data.append(user_data)

        return paginator.get_paginated_response(users_data)


    