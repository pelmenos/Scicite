from django.urls import include, path
from rest_framework.routers import DefaultRouter

from support_app.api.supportstatus.views import SupportStatusViewSet

router = DefaultRouter()

router.register(r'', SupportStatusViewSet)


urlpatterns = [
    path('', include(router.urls)),
]
