from django.urls import include, path

urlpatterns = [
    path('authentication/', include('profiles_app.api.authentication.urls')),
    path('users/', include('profiles_app.api.users.urls')),
    path('levels/', include('profiles_app.api.levels.urls')),
    path('transactions/', include('profiles_app.api.transactions.urls')),
    path('achievement/', include('profiles_app.api.achievement.urls')),
    path('settings/', include('profiles_app.api.settings.urls')),
    path('subscribe/', include('profiles_app.api.subscribe.urls')),
]
