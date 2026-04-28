from django.urls import path
from . import views

urlpatterns  =  [
    path('', views.index, name='index'),
    path('api/distros/', views.get_distros, name='get-distros'),
    path('add/', views.add_distro, name='add_distro'),
]