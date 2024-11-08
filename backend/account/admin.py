
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Profile, User

class UserAdminConfig(UserAdmin):
    model = User
    list_display = ('username', 'email', 'role', 'is_active')
    list_filter = ('role', 'is_active')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password', 'role', 'is_active')}),
        ('Permissions', {'fields': ('groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'created_at', 'updated_at')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role', 'is_active'),
        }),
    )
    search_fields = ('username', 'email')
    ordering = ('username',)
    filter_horizontal = ('user_permissions', 'groups')

admin.site.register(User, UserAdminConfig)

# Customize the Profile admin view
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'first_name', 'last_name', 'active_channel_name', 'last_active', 'created_at', 'updated_at')
    search_fields = ('user__username', 'first_name', 'last_name')
    list_filter = ('last_active', 'created_at')

admin.site.register(Profile, ProfileAdmin)