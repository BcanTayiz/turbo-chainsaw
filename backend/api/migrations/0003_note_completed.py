# Generated by Django 5.0.3 on 2024-03-29 10:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_note_task_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='note',
            name='completed',
            field=models.BooleanField(default=False),
        ),
    ]
