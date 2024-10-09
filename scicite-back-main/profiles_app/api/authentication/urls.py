from django.urls import include, path
from rest_framework.routers import DefaultRouter

from profiles_app.api.authentication.views import (AuthenticationViewSet,
                                                   CustomTokenObtainPairView,
                                                   CustomTokenRefreshView,
                                                   EmailVerificationViewSet,
                                                   LogoutView,
                                                   PasswordResetConfirmView,
                                                   PasswordResetRequestView)

router = DefaultRouter()

router.register(r'', AuthenticationViewSet, basename='auth')
router.register(r'', EmailVerificationViewSet, basename='email-verification')

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='custom_token_obtain_pair'),  
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='custom_token_refresh'), 
    path('logout/', LogoutView.as_view(), name='logout'),
    path('password/reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password/reset/confirm/<str:uid>/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('', include(router.urls)),
]
