from django.urls import include, path
from .views import *

# router = routers.DefaultRouter()
# router.register(r'songs', views.ListSongsView)

urlpatterns = [
    path('songs/', ListSongsView.as_view()),
    path('songs/<int:pk>/', SongDetailView.as_view()),
    path('recently_played/', RecentPlayedView.as_view()),
    path('playlist/', PlaylistView.as_view()),
    path('playlist/<int:pk>/', PlaylistDetailView.as_view()),
    path('genres/', ListGenreView.as_view()),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]