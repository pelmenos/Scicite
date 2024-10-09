from django.urls import include, path

urlpatterns = [
    path('evidence/', include('offers_app.api.evidence.urls')),
    path('offersstatus/', include('offers_app.api.offersstatus.urls')),
	path('', include('offers_app.api.offers.urls')),
]
