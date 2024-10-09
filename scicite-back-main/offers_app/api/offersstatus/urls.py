from django.urls import include, path
from rest_framework.routers import DefaultRouter

from offers_app.api.offersstatus.views import OffersStatusViewSet

router = DefaultRouter()

router.register(r'', OffersStatusViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
