from django.urls import include, path
from rest_framework.routers import DefaultRouter

from profiles_app.api.achievement.views import UserAchievementViewSet

router = DefaultRouter()

router.register(r'', UserAchievementViewSet)


urlpatterns = [
	path('', include(router.urls)),
]
