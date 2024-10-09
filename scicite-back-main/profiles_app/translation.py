from modeltranslation.translator import translator, TranslationOptions
from profiles_app.models import Levels, Notification


class LevelsTranslationOptions(TranslationOptions):
    fields = ('name',)


class NotificationTranslationOptions(TranslationOptions):
    fields = ('message',)


translator.register(Levels, LevelsTranslationOptions)
translator.register(Notification, NotificationTranslationOptions)
