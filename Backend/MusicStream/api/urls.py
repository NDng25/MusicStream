from typing import List
from django.urls import include, path
from rest_framework import routers
from .views import *

# router = routers.DefaultRouter()
# router.register(r'songs', views.ListSongsView)

urlpatterns = [
    path('songs/', ListSongsView.as_view()),
    path('songs/<int:pk>/', SongDetailView.as_view()),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]