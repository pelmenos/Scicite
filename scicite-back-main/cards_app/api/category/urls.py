from django.urls import include, path
from rest_framework.routers import DefaultRouter

from cards_app.api.category.views import CategoryViewSet

router = DefaultRouter()

router.register(r'', CategoryViewSet)

urlpatterns = [
    path(r'', include(router.urls)),
]


