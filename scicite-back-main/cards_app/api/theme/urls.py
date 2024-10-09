from django.urls import include, path
from rest_framework.routers import DefaultRouter

from cards_app.api.theme.views import ThemeViewSet

router = DefaultRouter()

router.register(r'', ThemeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
