from django.contrib import admin

from support_app.models import Support, SupportStatus, SupportType


@admin.register(Support)
class SupportAdmin(admin.ModelAdmin):
    list_display = (
        'offer',
        'declarer',
        'reporter',
        'status',
        'type_support',
        'created_at',
        'updated_at'
    )
    list_display_links = (
        'offer',
        'declarer'
    )
    search_fields = (
        'offer__name',
        'declarer__username',
        'reporter__username'
    )
    list_filter = (
        'status',
        'type_support'
    )
    fields = (
        'offer',
        'declarer',
        'reporter',
        'status',
        'narrative',
        'response',
        'type_support',
        'created_at',
        'updated_at'
    )
    readonly_fields = (
        'created_at',
        'updated_at'
    )
    list_per_page = 10
    list_max_show_all = 100
    save_on_top = True


@admin.register(SupportType)
class SupportTypeAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'description'
    )
    list_display_links = (
        'name',
    )
    search_fields = (
        'name',
    )
    fields = (
        'name',
        'description'
    )
    list_per_page = 10
    list_max_show_all = 100
    save_on_top = True


@admin.register(SupportStatus)
class SupportStatusAdmin(admin.ModelAdmin):
    list_display = (
        'code',
        'name',
        'description'
    )
    list_display_links = (
        'code',
    )
    search_fields = (
        'name',
        'description'
    )
    fields = (
        'code',
        'name',
        'description'
    )
    list_per_page = 10
    list_max_show_all = 100
    save_on_top = True
