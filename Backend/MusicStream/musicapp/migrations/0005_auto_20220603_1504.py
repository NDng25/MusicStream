# Generated by Django 3.1.12 on 2022-06-03 15:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('musicapp', '0004_remove_song_profile'),
    ]

    operations = [
        migrations.AddField(
            model_name='song',
            name='time_played',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='song',
            name='genre',
            field=models.ManyToManyField(blank=True, to='musicapp.Genre'),
        ),
    ]
