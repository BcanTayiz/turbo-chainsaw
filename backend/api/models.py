from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class Note(models.Model):
    title = models.CharField(max_length=100)
    task_time = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(1000)], default=0.0
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    completed = models.BooleanField(default=False)  # Yeni eklenen alan

    def __str__(self):
        return self.title


