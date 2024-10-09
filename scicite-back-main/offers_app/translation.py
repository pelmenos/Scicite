from modeltranslation.translator import translator, TranslationOptions
from offers_app.models import OffersStatus


class OffersStatusTranslationOptions(TranslationOptions):
    fields = ('name',)


translator.register(OffersStatus, OffersStatusTranslationOptions)
