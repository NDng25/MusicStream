from multiprocessing import context
from django.http import Http404
from django.shortcuts import get_object_or_404, render
from rest_framework.views import Response, APIView, status
from rest_framework import viewsets
from rest_framework import generics ,filters, permissions
from rest_framework.parsers import FileUploadParser
# from PIL import Image
from musicapp.models import *
from .serializers import *

class ImageUploadParser(FileUploadParser):
    media_type = 'image/*'

class ListSongsView(APIView):
    # parser_classes = (ImageUploadParser,)
    def get(self, request, format=None):
        #get 10 songs
        songs = Song.objects.all()[:10]
        serializer = SongSerializer(songs, context={'request': request},many=True)
        return Response(serializer.data)
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