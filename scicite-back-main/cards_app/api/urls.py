from django.urls import include, path

urlpatterns = [
    path('category/', include('cards_app.api.category.urls')),
    path('articlemeta/', include('cards_app.api.articlemeta.urls')),
    path('requiredbase/', include('cards_app.api.requiredbase.urls')),
    path('tariff/', include('cards_app.api.tariff.urls')),
    path('theme/', include('cards_app.api.theme.urls')),
    path('', include('cards_app.api.cards.urls')),
]
