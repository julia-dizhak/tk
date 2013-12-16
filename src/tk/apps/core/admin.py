from django.contrib import admin

from .models import Task


class TaskAdmin(admin.ModelAdmin):
    list_display = ("__unicode__", "status", "uuid")


admin.site.register(Task, TaskAdmin)
