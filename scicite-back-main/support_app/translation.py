from modeltranslation.translator import translator, TranslationOptions
from support_app.models import SupportType


class SupportTypeTranslationOptions(TranslationOptions):
    fields = ('name',)


translator.register(SupportType, SupportTypeTranslationOptions)
