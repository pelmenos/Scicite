from django.urls import include, path
from rest_framework.routers import DefaultRouter

from cards_app.api.articlemeta.views import (ArticleMetaViewSet,
                                             AuthorsViewSet, KeywordsViewSet)

router = DefaultRouter()


router.register(r'authors', AuthorsViewSet)
router.register(r'keywords', KeywordsViewSet)
router.register(r'', ArticleMetaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]