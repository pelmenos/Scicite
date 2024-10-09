from django.urls import include, path
from rest_framework.routers import DefaultRouter

from support_app.api.support.views import AdminHelpView, SupportViewSet

router = DefaultRouter()

router.register(r'', SupportViewSet)


urlpatterns = [
    path('admin/help/', AdminHelpView.as_view(), name='helpadmin'),
    path('', include(router.urls)),
]
