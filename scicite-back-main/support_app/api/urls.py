from django.urls import include, path

urlpatterns = [
    path('supportstatus/', include('support_app.api.supportstatus.urls')),
    path('supporttype/', include('support_app.api.supporttype.urls')),
	path('', include('support_app.api.support.urls')),
]
