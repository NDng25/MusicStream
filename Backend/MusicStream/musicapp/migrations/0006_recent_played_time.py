# Generated by Django 3.1.12 on 2022-06-03 15:12

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('musicapp', '0005_auto_20220603_1504'),
    ]

    operations = [
        migrations.AddField(
            model_name='recent',
            name='played_time',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
