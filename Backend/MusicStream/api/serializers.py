from dataclasses import field
import datetime
import email
import os
from wsgiref.validate import validator
from attr import fields
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from email.policy import default
from musicapp.models import *
from rest_framework import serializers


class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    class Meta:
        model = Profile

class GenreSerializer(serializers.ModelSerializer):

    class Meta:
        model = Genre
        fields = ['id', 'name']

class SongSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=False, queryset=User.objects.all(), default=serializers.CurrentUserDefault())
    genres = GenreSerializer(many=True,read_only=True)
    class Meta:
        model = Song
        fields = ['id', 'title', 'artist', 'lyrics','year', 'genres', 'user', 'cover', 'song_file']
    
    def validate(self, data):
        if data['year'] < 0 or data['year'] > datetime.datetime.now().date().year:
            raise serializers.ValidationError("Year must be greater than 0")
        return data
    
    def create(self, validated_data):
        genres = self.context['genre']
        song = Song.objects.create(**validated_data)
        #change song_file name to song_id before saving
        name, extension = os.path.splitext(song.song_file.name)
        name = str(song.id)+ song.title
        song.song_file.name = name + extension
        c_name, c_extension = os.path.splitext(song.cover.name)
        c_name = str(song.id)+ song.title
        song.cover.name = c_name + c_extension
        song.save()
        for genre in genres:
            genre_obj = Genre.objects.filter(id=genre).first()
            song.genres.add(genre_obj)
        return song
    
    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.artist = validated_data.get('artist', instance.artist)
        instance.lyrics = validated_data.get('lyrics', instance.lyrics)
        instance.year = validated_data.get('year', instance.year)
        instance.cover = validated_data.get('cover', instance.cover)
        instance.song_file = validated_data.get('song_file', instance.song_file)
        instance.genres.clear()
        genre_ids = self.context['genre']
        print(genre_ids)
        for id in genre_ids:
            try:
                genre_obj = Genre.objects.filter(id=id).first()
                print(genre_obj)
                instance.genres.add(genre_obj)
            except Exception as e:
                print('genre error')
                raise serializers.ValidationError(str(e))
        instance.save()
        return instance

class FavoriteSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    songs = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = Favorite
        fields = '__all__'

class PlaylistSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    songs = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = Playlist
        fields = '__all__'  
     


class RecentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    song = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = Recent
        fields = '__all__'