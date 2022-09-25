from django.contrib import admin
from .models import Notes

@admin.register(Notes)
class NotesAdmin(admin.ModelAdmin):
	list_display = ('Title', 'pinned', 'created', 'updated')