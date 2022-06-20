from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.conf import settings
from django.core.files.base import ContentFile

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    displayName = models.CharField(max_length=50, blank=True, default=user.name)
    avatar = models.ImageField(default='default.jpg', upload_to='media/profile_pics')

    def __str__(self):
        return f'{self.displayName} Profile'

class Genre(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(max_length=500, blank=True)
    def __str__(self):
        return self.name

class Song(models.Model):
    title = models.CharField(max_length=50)
    artist = models.CharField(max_length=50)
    year = models.IntegerField(default=timezone.now().year)
    lyrics = models.TextField(blank=True)
    cover = models.ImageField(_('file'), db_index=True, null = True, blank=True,default='default.jpg', upload_to='media/cover_pics')
    time_played = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    genre = models.ManyToManyField(Genre, blank=True)
    song_file = models.FileField(blank=True, default='default.mp3', upload_to='media/songs')
    upload_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.title} by {self.artist}'
    
    @property
    def update_view_count(self):
        self.time_played += 1
        self.save()

#create model for favourite songs
class Favourite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    def __str__(self):
        return f'{self.user.username} likes {self.song.title}'

#create model for Playlist
class Playlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    cover = models.ImageField(default='default.jpg', upload_to='media/songs')
    songs = models.ManyToManyField(Song, blank=True)
    def __str__(self):
        return f'{self.user.username} playlist {self.name}'
    def addSong(self, song):
        self.songs.add(song)
        if self.cover == 'default.jpg':
            self.cover = song.cover
        self.save()
    

class Recent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    played_at = models.DateTimeField(default=timezone.now, blank=True)