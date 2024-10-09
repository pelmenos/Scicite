from django.urls import include, path
from rest_framework.routers import DefaultRouter

from profiles_app.api.subscribe.views import SubscribeAPIView

router = DefaultRouter()


urlpatterns = [
    path('', SubscribeAPIView.as_view(), name='subsc'),
]
