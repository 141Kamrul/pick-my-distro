from django.db import models

# Create your models here.
class Distro(models.Model):
    # Define your model fields here
    name = models.CharField(max_length=100)
    description = models.TextField()
    website = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
