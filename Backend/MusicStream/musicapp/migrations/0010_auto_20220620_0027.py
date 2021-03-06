# Generated by Django 3.1.12 on 2022-06-20 00:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('musicapp', '0009_auto_20220605_0758'),
    ]

    operations = [
        migrations.RenameField(
            model_name='song',
            old_name='genre',
            new_name='genres',
        ),
        migrations.AddField(
            model_name='genre',
            name='songs',
            field=models.ManyToManyField(blank=True, to='musicapp.Song'),
        ),
        migrations.AlterField(
            model_name='playlist',
            name='cover',
            field=models.ImageField(default='default.jpg', upload_to='media/songs'),
        ),
    ]
