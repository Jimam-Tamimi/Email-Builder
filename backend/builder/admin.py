from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Template

@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    """
    Admin view for the Template model.
    """
    list_display = ('title', 'creator', 'created_at', 'updated_at')
    search_fields = ('title', 'description', 'creator__username')
    list_filter = ('created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'creator', 'data')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )