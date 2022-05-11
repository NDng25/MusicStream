from django.shortcuts import render
from .models import *

# Create your views here.
def index(request):
    # Get recent songs
    if request.user.is_authenticated:
        allsongs = User.objects.get(username=request.user).song_set.all()
    return render(request, 'musicapp/index.html')