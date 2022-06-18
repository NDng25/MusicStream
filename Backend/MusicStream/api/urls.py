from django.urls import include, path
from .views import *
from api import views

# router = routers.DefaultRouter()
# router.register(r'songs', views.ListSongsView)
signup = views.UserDetailView.as_view({
    'post': 'signup'
})

login = views.UserDetailView.as_view({
    'post': 'login'
})

view_users = views.UserDetailView.as_view({
    'post': 'view_users'
})

urlpatterns = [
    # path('login/',UserDetailView.as_view(), name='login' ),
    # path('signup/',RegisterUserView.as_view(), name='signup'),
    path("signup/", signup),
    path("login/", login),
    path("view-users/", view_users),
    path('songs/', ListSongsView.as_view()),
    path('songs/<int:pk>/', SongDetailView.as_view()),
    path('recently_played/', RecentPlayedView.as_view()),
    path('playlist/', PlaylistView.as_view()),
    path('playlist/<int:pk>/', PlaylistDetailView.as_view()),
    path('genres/', ListGenreView.as_view()),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]