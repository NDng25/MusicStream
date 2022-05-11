from dataclasses import field
import datetime
from musicapp.models import *
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        field = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    class Meta:
        model = Profile

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']

class SongSerializer(serializers.ModelSerializer):
    #create relationship between song and user
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=False, queryset=User.objects.all())
    # profile = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    # create many to many relationship between song and genre
    genre = GenreSerializer(many=True,read_only=True)
    class Meta:
        model = Song
        fields = ['id', 'title', 'artist', 'lyrics','year', 'genre', 'user', 'cover', 'song_file']
    
    def validate(self, data):
        if data['year'] < 0 or data['year'] > datetime.datetime.now().date().year:
            raise serializers.ValidationError("Year must be greater than 0")
        return data
    
    def create(self, validated_data):
        genres = self.context['genre']
        song = Song.objects.create(**validated_data)
        for genre in genres:
            genre_obj = Genre.objects.filter(id=genre).first()
            song.genre.add(genre_obj)
        return song


class FavouriteSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    song = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    class Meta:
        model = Favourite
        fields = '__all__'

class PlaylistSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    songs = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = Playlist
        fields = '__all__'

class RecentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    song = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    class Meta:
        model = Recent
        fields = '__all__'