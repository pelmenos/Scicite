from django.urls import include, path
from rest_framework.routers import DefaultRouter

from profiles_app.api.transactions.views import TransacitonsViewSet

router = DefaultRouter()

router.register(r'', TransacitonsViewSet)

urlpatterns = [
    path('transactions/<int:pk>/cancel/', TransacitonsViewSet.as_view({'post': 'cancel_transaction'}), name='cancel-transaction'),
    path('', include(router.urls)),
]
