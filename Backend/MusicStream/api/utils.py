def validateSongCover(request):
    try:
        if request.data['cover'] is None:
            raise Exception('File is null')
        img = request.data['cover']
        if img.content_type not in ['image/jpeg', 'image/png']:
            raise Exception('File type not supported')
        if img.size > 1024*1024*10:
            raise Exception('File size too large')
    except Exception:
        return False
    return True

def validateSongFile(request):
    try:
        song_file = request.data['song_file']
        if song_file.content_type not in ['audio/mpeg', 'audio/mp3']:
            raise Exception("Invalid file type")
        if song_file.size > 1024*1024*30:
            raise Exception("File too large")
        # if song_file.split('.')[-1] not in ['mp3', 'mpeg']:
        #     raise Exception("Invalid file type")
    except Exception:
        return False
    return True