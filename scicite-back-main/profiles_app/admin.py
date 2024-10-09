from django.contrib import admin

from profiles_app.models import Levels, Permission, Role, RolePermission, User, Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    pass

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        'login',
        'email',
        'balance',
        'number_phone',
        'level',
        'is_staff'
    )
    list_display_links = (
        'login',
        'email'
    )
    search_fields = (
        'login',
        'email',
        'number_phone'
    )
    list_filter = (
        'level',
        'is_staff'
    )
    fields = (
        'login',
        'email',
        "full_name",
        'balance',
        'number_phone',
        'level',
        'is_active',
        'is_staff',
        'roles'
    )
    readonly_fields = (
        'created_at',
        'updated_at'
    )
    list_per_page = 10
    list_max_show_all = 100
    save_on_top = True


@admin.register(Levels)
class LevelsAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'limit'
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


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
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
    list_per_page = 10
    list_max_show_all = 100
    save_on_top = True


@admin.register(RolePermission)
class RolePermissionAdmin(admin.ModelAdmin):
    list_display = (
        'role',
        'permission'
    )
    list_display_links = (
        'role',
        'permission'
    )
    list_per_page = 10
    list_max_show_all = 100
    save_on_top = True


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = (
        'description',
        'code'
    )
    list_display_links = (
        'description',
    )
    search_fields = (
        'description',
    )
    list_per_page = 10
    list_max_show_all = 100
    save_on_top = True
