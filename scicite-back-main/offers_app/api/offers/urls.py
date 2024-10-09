from django.urls import include, path
from rest_framework.routers import DefaultRouter

from offers_app.api.offers.views import OffersViewSet

router = DefaultRouter()

router.register(r'', OffersViewSet)


urlpatterns = [
    path('', include(router.urls)),
]
