from django.contrib import admin
from musicapp.models import *

# Register your models here.
admin.site.register(Profile)
admin.site.register(Song)
admin.site.register(Genre)
admin.site.register(Favorite)
admin.site.register(Playlist)
admin.site.register(Recent)
admin.site.site_header = 'MusicStream Admin'
admin.site.site_title = 'MusicStream Admin Area'
admin.site.index_title = 'Welcome to MusicStream Admin Area'