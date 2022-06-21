from cmath import exp
from django.http import Http404
from matplotlib.style import context
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import Response, APIView, status
from rest_framework.generics import *
# from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.parsers import FileUploadParser
from rest_framework.pagination import LimitOffsetPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from argparse import Namespace
from django.contrib.auth import authenticate
# from PIL import Image
from musicapp.models import *
from .serializers import *


class UserDetailView(ViewSet):
    def login(self, request):

        data = request.data

        data = Namespace(**data)

        try:

            user = authenticate(
                request, username=data.username, password=data.password)

            if user != None:

                token = Token.objects.filter(user=user).first()

                if token:

                    return Response({"result": "Success", "token": token.key, "username": token.user.username, "pk": user.pk}, status=status.HTTP_200_OK)

        except Exception as e:

            print(e)

            return Response({"result": "Failure"}, status=status.HTTP_401_UNAUTHORIZED)
    
    def signup(self, request):

        data = request.data

        data = Namespace(**data)

        try:

            user = User.objects.create(
                email=data.email, username=data.username)

            user.set_password(data.password)

            user.save()

            Token.objects.get_or_create(user=user)

            return Response({"result": "Success"}, status=status.HTTP_200_OK)

        except Exception as e:

            print(e)

            return Response({"result": "Failure"}, status=status.HTTP_226_IM_USED)
    
    def view_users(self, request):

        data = request.data

        data = Namespace(**data)

        token = Token.objects.filter(key=data.token).first()

        if token:

            curr_user = token.user

            users = User.objects.all().exclude(pk=curr_user.pk)

            users_dict = []

            for user in users:

                user_dict = {
                    "id": user.pk,
                    "name": user.username
                }

                users_dict.append(user_dict)

            return Response(users_dict)
        
        return Response({}, status=status.HTTP_400_BAD_REQUEST)

    
class ImageUploadParser(FileUploadParser):
    media_type = 'image/*'

class SongFilter(DjangoFilterBackend):
    def filter_queryset(self, request, queryset, view):
        search_filter_field = ['title', 'artist']
        if request.query_params.get('genre_name'):
            queryset = queryset.filter(genre__name__contains=request.query_params.get('genre_name'))
        elif request.query_params.get('recently_played'):
            user_id = int(request.query_params.get('user_id'))
            user = User.objects.filter(id=user_id).first()
            recently_songs = Recent.objects.filter(user=user).order_by('-played_at')[:10]
            if recently_songs.exists():
                for item in recently_songs:
                    item = item.song.id
            queryset = queryset.filter(id__in=recently_songs)
        elif request.query_params.get('search_field'):
            search_field = request.query_params.get('search_field')
            if search_field not in search_filter_field:
                return super().filter_queryset(request, queryset, view)
            query = request.query_params.get('query')
            queryset = queryset.filter(**{search_field + '__icontains': query})
            
        return super().filter_queryset(request, queryset, view)


class ListSongsView(APIView):
    pagination_class = LimitOffsetPagination
    # parser_classes = (ImageUploadParser,)
    def get(self, request, format=None):
        songs = Song.objects.all()
        paginator = self.pagination_class()
        filtered = SongFilter().filter_queryset(request, songs, self)
        result = paginator.paginate_queryset(filtered, request)
        # if result.exists():
        serializer = SongSerializer(result, context={'request': request},many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        # else:
        #     return Response({"error": "No songs found"}, status=status.HTTP_404_NOT_FOUND)
        
        # permission_classes = (permissions.IsAuthenticated,)
    def post(self, request, format=None):
        data = request.data
        data['year'] = int(data['year'])
        user_id = int(data['user'])
        try:
            img = request.FILES['cover']
            if img.content_type not in ['image/jpeg', 'image/png']:
                raise Exception('File type not supported')
            if img.size > 1024*1024*10:
                raise Exception('File size too large')
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        #check songs file is valid
        try:
            song_file = request.FILES['song_file']
            if song_file.content_type not in ['audio/mpeg', 'audio/mp3']:
                raise Exception("Invalid file type")
            if song_file.size > 1024*1024*20:
                raise Exception("File too large")
            # if song_file.split('.')[-1] not in ['mp3', 'mpeg']:
            #     raise Exception("Invalid file type")
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        data['user'] = User.objects.filter(id=user_id).first().id
        genre_list = request.POST.get('genre')
        genre_list = list(map(int, genre_list.split(',')))
        data['genre'] = genre_list
        serializer = SongSerializer(data=data, context={'genre': genre_list})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class SongDetailView(APIView):
    """
    Retrieve, update or delete a song.
    """
    def get_object(self, pk):
        try:
            return Song.objects.filter(pk=pk).first()
        except Song.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        # if request.user.is_authenticated:
            snippet = self.get_object(pk)
            serializer = SongSerializer(snippet, context={'request': request})
            return Response(serializer.data)
        # else:
            # return Response(status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, pk, format=None):
        snippet = self.get_object(pk)
        data = request.data.copy()
        genre_ids = list(map(int, data['genre'].split(',')))
        #keep old cover file if not have the new one
        if data['cover'] is not None:
            data['cover'] = snippet.cover
        else:
            try:
                img = request.FILES['cover']
                if img.content_type not in ['image/jpeg', 'image/png']:
                    raise Exception('File type not supported')
                if img.size > 1024*1024*10:
                    raise Exception('File size too large')
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST) 
        #keep song file if not have the new one
        if data['song_file'] is not None:
            data['song_file'] = snippet.song_file
        else:
            try:
                song_file = request.FILES['song_file']
                if song_file.content_type not in ['audio/mpeg', 'audio/mp3']:
                    raise Exception("Invalid file type")
                if song_file.size > 1024*1024*20:
                    raise Exception("File too large")
                # if song_file.split('.')[-1] not in ['mp3', 'mpeg']:
                #     raise Exception("Invalid file type")
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        print(data)
        serializer = SongSerializer(instance=snippet, data=request.data, context={'genre':genre_ids,'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ListGenreView(APIView):
    def get(self, request, format=None):
        genres = Genre.objects.all()
        serializers = GenreSerializer(genres, many=True)
        return Response(serializers.data)

class RecentPlayedView(APIView):

    def get(seft, request, format=None):
        user_id = int(request.query_params.get('user_id'))
        user = User.objects.filter(id=user_id).first()
        recently_songs = Recent.objects.filter(user=user).order_by('-played_at')[:10]
        if recently_songs.exists():
            for item in recently_songs:
                item = item.song
            serializer = SongSerializer(recently_songs, context={'request': request}, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "No songs found"}, status=status.HTTP_404_NOT_FOUND)


    def post(self, request, format=None):
        data = request.data
        user_id = int(data['user'])
        song_id = int(data['song'])
        user = User.objects.filter(id=user_id).first()
        song = Song.objects.filter(id=song_id).first()
        if user and song:
            recent = Recent.objects.filter(user=user, song=song).first()
            if recent:
                recent.played_time = datetime.now()
                recent.save()
            else:
                recent = Recent(user=user, song=song)
                recent.save()

            song.update_view_count
            return Response({"result": "Success"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "user or song invalid"}, status=status.HTTP_400_BAD_REQUEST)
    

class PlaylistView(APIView):
    def get(self, request,format=None):
        user_id = int(request.query_params.get('user_id'))
        if user_id:
            user = User.objects.filter(id=user_id).first()
            playlists = Playlist.objects.filter(user=user).all()
            serializer = PlaylistSerializer(playlists, context={'request':request}, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid id"}, status=status.HTTP_400_BAD_REQUEST)
    def post(self, request, format=None):
        data = request.data
        user_id = request.POST.get('user_id')
        song_id = request.POST.get('song_id')
        #create new playlist
        if user_id and song_id:
            user_id = int(user_id)
            song_id = int(song_id)
            try:
                user = User.objects.filter(id=user_id).first()
                song = Song.objects.filter(id=song_id).first()
                if user and song:
                    playlist = Playlist(name=data['name'], user=user)
                    playlist.save()
                    playlist.addSong(song)
                    created_playlist = Playlist.objects.filter(id=playlist.id).first()
                    serializers = PlaylistSerializer(created_playlist, context={'request':request}, many=False)
                    return Response(serializers.data ,status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Invalid id"},status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
    def put(self, request, format=None):
        data = request.data
        user_id = request.POST.get('user_id')
        song_id = request.POST.get('song_id')
        playlist_id = request.POST.get('playlist_id')
        user = User.objects.filter(id=user_id).first()
        playlist = Playlist.objects.filter(user=user, id=playlist_id).first()
        if playlist:
            if song_id:
                song_id = int(song_id)
                song = Song.objects.filter(id=song_id).first()
                if song:
                    if playlist.songs.filter(id=song_id).exists():
                        playlist.songs.remove(song)
                    else:
                        playlist.songs.add(song)
                        playlist.save()
                    modified_playlist = Playlist.objects.filter(id=playlist.id).first()
                    return Response(modified_playlist, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Song does not found"},status=status.HTTP_400_BAD_REQUEST)
            else:
                playlist.name = data['name']
                playlist.save()
                modified_playlist = Playlist.objects.filter(id=playlist.id).first()
                return Response(modified_playlist, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Playlist does not found"},status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        user_id = request.POST.get('user_id')
        playlist_id = request.POST.get('playlist_id')
        user = User.objects.filter(id=user_id).first()
        playlist = Playlist.objects.filter(user=user, id=playlist_id).first()
        if playlist:
            playlist.delete()
            return Response({"result": "Delete successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Playlist does not found"}, status=status.HTTP_400_BAD_REQUEST)

class PlaylistDetailView(APIView):
    def get(self, request, pk, format=None):
        playlist = Playlist.objects.filter(id=pk).first()
        if playlist:
            playlist_tracks = playlist.songs.all()
            serializer = SongSerializer(playlist_tracks, context={'request': request}, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Playlist does not found"}, status=status.HTTP_404_NOT_FOUND)

        