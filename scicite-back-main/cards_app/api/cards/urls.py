from django.urls import include, path
from rest_framework.routers import DefaultRouter

from cards_app.api.cards.views import BarterCardViewSet, CardsViewSet

router = DefaultRouter()

router.register(r'', CardsViewSet, basename='cards')

urlpatterns = [
	path('barter/', BarterCardViewSet.as_view()),
	path('barter/handle/', BarterCardViewSet.as_view()),
	path('', include(router.urls)),
]
