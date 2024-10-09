from django.apps import AppConfig


class CardsAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cards_app'

    def ready(self):
        import cards_app.signals