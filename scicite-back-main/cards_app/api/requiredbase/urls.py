from django.urls import include, path
from rest_framework.routers import DefaultRouter

from cards_app.api.requiredbase.views import RequiredBaseViewSet

router = DefaultRouter()

router.register(r'', RequiredBaseViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
