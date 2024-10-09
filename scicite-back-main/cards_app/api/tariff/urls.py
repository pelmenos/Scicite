from django.urls import include, path
from rest_framework.routers import DefaultRouter

from cards_app.api.tariff.views import TariffViewSet

router = DefaultRouter()

router.register(r'', TariffViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
