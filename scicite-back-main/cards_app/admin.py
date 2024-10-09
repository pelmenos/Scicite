from django.contrib import admin

from cards_app.models import (ArticleMeta, Cards, Category, RequiredBase,
                              Tariff, Theme)


@admin.register(Cards)
class CardsAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'base',
        'tariff',
        'article',
        'is_exchangable',
        'is_active',
    )
    list_display_links = (
        'user',
        'base',
        'tariff',
        'article',
    )
    search_fields = (
        'user__login',
    )
    list_filter = ('is_exchangable', 'is_active')
    fields = (
        'user',
        'base',
        'tariff',
        'article',
        'is_exchangable',
        'is_active',
        'theme',
        'category',
    )
    readonly_fields = ('created_at', 'updated_at')
    list_per_page = 10
    list_max_show_all = 100
    save_on_top = True


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'name',
    )
    list_display_links = (
        'id', 'name',
    )
    search_fields = (
        'name',
    )
    list_per_page = 10
    list_max_show_all = 100
    save_on_top = True


@admin.register(RequiredBase)
class RequiredBaseAdmin(admin.ModelAdmin):
    list_display = (
        'name',
    )
    list_display_links = (
        'name',
    )
    search_fields = (
        'name',
    )
    list_per_page = 10
    list_max_show_all = 100
    save_on_top = True


@admin.register(Tariff)
class TariffAdmin(admin.ModelAdmin):
    list_display = (
        'scicoins',
        'period',
    )
    list_display_links = (
        'scicoins',
        'period',
    )
    list_per_page = 10
    list_max_show_all = 100
    save_on_top = True


@admin.register(ArticleMeta)
class ArticleMetaAdmin(admin.ModelAdmin):
    list_display = (
        'doi',
        'title',
        'abstract',
        'journal_name',
    )
    list_display_links = (
        'doi',
        'title',
    )
    search_fields = (
        'doi',
        'title',
    )
    list_per_page = 10
    list_max_show_all = 100
    save_on_top = True


@admin.register(Theme)
class ThemeAdmin(admin.ModelAdmin):
    list_display = (
        'name',
    )
    list_display_links = (
        'name',
    )
    search_fields = (
        'name',
    )
    list_per_page = 10
    list_max_show_all = 100
    save_on_top = True
