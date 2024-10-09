from django.urls import include, path
from rest_framework.routers import DefaultRouter

from profiles_app.api.levels.views import LevelsViewSet, ProgressView

router = DefaultRouter()

router.register(r'', LevelsViewSet)

urlpatterns = [
    path('progress/', ProgressView.as_view(), name='progress'),
    path('', include(router.urls)),
]
