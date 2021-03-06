# Generated by Django 3.1.12 on 2022-05-05 14:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('musicapp', '0002_auto_20220504_1022'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='avatar',
            field=models.ImageField(default='default.jpg', upload_to='media/profile_pics'),
        ),
        migrations.AlterField(
            model_name='song',
            name='cover',
            field=models.ImageField(blank=True, db_index=True, default='default.jpg', null=True, upload_to='media/cover_pics', verbose_name='file'),
        ),
        migrations.AlterField(
            model_name='song',
            name='lyrics',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='song',
            name='song_file',
            field=models.FileField(blank=True, default='default.mp3', upload_to='media/songs'),
        ),
        migrations.AlterField(
            model_name='song',
            name='year',
            field=models.IntegerField(default=2022),
        ),
    ]
