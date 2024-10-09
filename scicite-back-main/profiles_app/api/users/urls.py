from django.urls import include, path
from rest_framework.routers import DefaultRouter

from profiles_app.api.users.views import (NotificationClearView,
                                          NotificationListView,
                                          PasswordChangeViewSet, UserAdminView,
                                          UserStatisticView, UserViewSet)

router = DefaultRouter()

router.register(r'', UserViewSet)


urlpatterns = [
	path('statistic/<str:id>/', UserStatisticView.as_view(), name='user-statistic'),
	path('change_password/', PasswordChangeViewSet.as_view({'post': 'change_password'}), name='change_password'),
	path('notify/', NotificationListView.as_view(), name='get_notify'),
	path('notify/clear/', NotificationClearView.as_view(), name='clear_notify'),
	path('admin/', UserAdminView.as_view(), name='user_admin'),
	path('', include(router.urls)),
]
