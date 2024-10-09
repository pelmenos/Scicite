from django.contrib import admin

from offers_app.models import Evidence, Offers, OffersStatus


@admin.register(Offers)
class OffersAdmin(admin.ModelAdmin):
    list_display = (
        'card',
        'perfomer',
        'deadline_at',
    )
    list_display_links = (
        'card',
        'perfomer',
    )
    search_fields = (
        'card',
        'perfomer',
    )
    list_filter = ('deadline_at',)
    fields = (
        'card',
        'perfomer',
        'deadline_at',
        'evidence',
    )
    readonly_fields = ('created_at', 'updated_at')
    list_per_page = 10
    list_max_show_all = 100
    save_on_top = True


@admin.register(OffersStatus)
class OffersStatusAdmin(admin.ModelAdmin):
    list_display = (
        'code',
        'name',
        'description',
    )
    list_display_links = (
        'code',
        'name',
    )
    search_fields = (
        'name',
        'description',
    )
    list_per_page = 10
    list_max_show_all = 100
    save_on_top = True


@admin.register(Evidence)
class EvidenceAdmin(admin.ModelAdmin):
    list_display = (
        'article',
    )
    list_display_links = (
        'article',
    )
    search_fields = (
        'article__title',
    )
    list_per_page = 10
    list_max_show_all = 100
    save_on_top = True
