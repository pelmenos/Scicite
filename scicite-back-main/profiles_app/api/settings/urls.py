from django.urls import include, path
from rest_framework.routers import DefaultRouter

from profiles_app.api.settings.views import SettingsModelAPIView

router = DefaultRouter()


urlpatterns = [
    path('', SettingsModelAPIView.as_view(), name='settings'),
    #path('', include(router.urls)),
]
