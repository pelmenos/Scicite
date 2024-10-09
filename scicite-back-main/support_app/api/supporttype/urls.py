from django.urls import include, path
from rest_framework.routers import DefaultRouter

from support_app.api.supporttype.views import SupportTypeViewSet

router = DefaultRouter()

router.register(r'', SupportTypeViewSet)


urlpatterns = [
    path('', include(router.urls)),
]
