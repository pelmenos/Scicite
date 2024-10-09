from django.conf import settings
from django.contrib.auth import authenticate, logout
from django.contrib.auth.tokens import default_token_generator
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView)

from mixin.response import ResponseHandlerMixin
from profiles_app.api.serializers import (DeactivateTokenSerializer,
                                          PasswordResetConfirmSerializer,
                                          PasswordResetSerializer,
                                          SettingsModel,
                                          UserRegistrationSerializer)
from profiles_app.models import User, UserAchievement
from utils.achievements import create_achievement
from utils.email import EmailSender
from utils.payment import create_transaction


class AuthenticationViewSet(ResponseHandlerMixin, viewsets.ViewSet):
    authentication_classes = []
    permission_classes = []

    @swagger_auto_schema(
        request_body=UserRegistrationSerializer,
        responses={200: 'Success', 400: 'Bad Request'},
        operation_summary="Регистрация",
        operation_description="Регистрирует пользователя.",
    )
    @action(detail=False, methods=['post'])
    def registration(self, request):
        """ Регистрация пользователя """
        lang = request.headers.get("Accept-Language")
        email = request.data.get('email', None)
        login = request.data.get('login', None)
        phone = request.data.get('number_phone', None)

        if User.objects.filter(email=email).exists():
            text = "Email уже используется" if lang != 'en' else "Email already exists"
            return Response({"email": [text]}, status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(login=login).exists():
            text = "Имя пользователя уже используется" if lang != 'en' else "Login already exists"
            return Response({"login": [text]}, status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(number_phone=phone).exists():
            text = "Номер телефона уже используется" if lang != 'en' else "Phone number already exists"
            return Response({"number_phone": [text]}, status.HTTP_400_BAD_REQUEST)
        
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            return ResponseHandlerMixin.success_response({'success': True})
        return ResponseHandlerMixin.error_response(serializer.errors)


class EmailVerificationViewSet(ResponseHandlerMixin, viewsets.ViewSet):
    authentication_classes = []
    permission_classes = []

    @action(detail=False, methods=['get'])
    def verify_email(self, request):
        uid = request.query_params.get('uid')
        token = request.query_params.get('token')
        try:
            uid = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user.is_active:
            return ResponseHandlerMixin.success_response({'message': 'Пользователь уже подтвержден'})

        if user and default_token_generator.check_token(user, token):
            achievement = create_achievement(user, "registration")
            user.is_active = True
            user.save()
            settings_welcome_bonus = SettingsModel.objects.first().welcome_bonus
            return ResponseHandlerMixin.success_response(
                {'message': 'Email успешно подтвержден', 'achievement':achievement.id, "start_bonus":settings_welcome_bonus}
                )
        else:
            return ResponseHandlerMixin.error_response({'message': 'Неверная ссылка для подтверждения email'})


class CustomTokenObtainPairView(TokenObtainPairView, ResponseHandlerMixin):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == status.HTTP_200_OK:
                user = User.objects.get(username=request.data.get('username'))
                response.data['user_id'] = user.id  
                return response
        except AuthenticationFailed as e:
            return Response({"detail":"Неверный логин или пароль"}, status=401)
    

class CustomTokenRefreshView(TokenRefreshView):
    authentication_classes = [JWTAuthentication]
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            user = request.user 
            if user.is_authenticated: 
                response.data['user_ud'] = str(user.id)
                return response
            return Response({'error': 'User is not authenticated'}, status=status.HTTP_400_BAD_REQUEST)
        return response
    

class LogoutView(APIView):
    @swagger_auto_schema(
        request_body=DeactivateTokenSerializer,
        responses={status.HTTP_200_OK: 'Success', status.HTTP_400_BAD_REQUEST: 'Bad Request'},
        operation_summary="Выход",
        operation_description="Выход",
    )
    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                logout(request)
                return Response({'message': 'success'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Отсутствует refresh_token в запросе'}, status=status.HTTP_400_BAD_REQUEST)
        

class PasswordResetRequestView(APIView, ResponseHandlerMixin):
    authentication_classes = []
    permission_classes = []
    @swagger_auto_schema(
        request_body=PasswordResetSerializer,
        operation_description="Request to reset user password",
        responses={
            200: "Password reset instructions sent successfully",
            400: "Bad request - Invalid data provided",
            404: "User not found with the specified email",
        },
    )
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return self.error_response('Пользователь с указанным email не найден', status.HTTP_404_NOT_FOUND)

            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            subject = 'Восстановление пароля'
            recipient_list = [user.email]
            verification_link = f"https://scisource.ru/main?reset_password&uid={uid}&token={token}"
            html_message = render_to_string('mail/password_restore.html', {'verification_link': verification_link})

            EmailSender(
                settings.EMAIL_HOST, settings.EMAIL_PORT,
                settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD
            ).send_email(subject, recipient_list, html_message)

            return self.success_response({'message': 'Инструкции по сбросу пароля отправлены на ваш email'})
        else:
            return self.error_response(message=serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)
        
        
class PasswordResetConfirmView(APIView, ResponseHandlerMixin):
    authentication_classes = []
    permission_classes = []
    @swagger_auto_schema(
        request_body=PasswordResetConfirmSerializer,
        operation_description="Confirm password reset",
        responses={
            200: "Password successfully changed",
            400: "Bad request - Invalid data provided",
            400: "Invalid token or user for password reset",
        },
    )
    def post(self, request, uid, token):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            try:
                uid = urlsafe_base64_decode(uid).decode()
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                return self.error_response('Неверные данные для сброса пароля', status.HTTP_400_BAD_REQUEST)

            if default_token_generator.check_token(user, token):
                new_password = serializer.validated_data['new_password']
                confirm_new_password = serializer.validated_data['confirm_new_password']

                if new_password == confirm_new_password:
                    user.set_password(new_password)
                    user.save()
                    return self.success_response({'message': 'Пароль успешно изменен'})
                else:
                    return self.error_response('Новые пароли не совпадают', status.HTTP_400_BAD_REQUEST)
            else:
                return self.error_response('Неверный токен для сброса пароля', status.HTTP_400_BAD_REQUEST)
        else:
            return self.error_response(message=serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)
       