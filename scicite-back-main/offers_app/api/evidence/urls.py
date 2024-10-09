from django.urls import include, path
from rest_framework.routers import DefaultRouter

from offers_app.api.evidence.views import EvidenceViewSet

router = DefaultRouter()

router.register(r'', EvidenceViewSet)


urlpatterns = [
    path('', include(router.urls)),
]
