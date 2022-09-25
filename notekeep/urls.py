from django.contrib import admin
from django.urls import path, include
from . import views

app_name = 'notekeep'

urlpatterns = [
    path('', views.index, name='homepage'),
    path('notes/', views.notes, name='notes'),
    path('pinnednotes/', views.pinnednotes, name='pinnednotes'),
    path('pinNote/', views.pinNote, name='pin'),
    path('requestNote/<int:id>/', views.requestNote, name='requestNote'),
    path('saveNote/', views.saveNote, name='saveNote'),
]