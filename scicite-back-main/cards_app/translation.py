from modeltranslation.translator import translator, TranslationOptions
from cards_app.models import Category, RequiredBase


class CategoryTranslationOptions(TranslationOptions):
    fields = ('name',)


class RequiredBaseTranslationOptions(TranslationOptions):
    fields = ('name',)


translator.register(Category, CategoryTranslationOptions)
translator.register(RequiredBase, RequiredBaseTranslationOptions)
