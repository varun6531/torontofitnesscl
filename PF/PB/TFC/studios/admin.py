from django.contrib import admin

# Register your models here.
from studios.models import Studio, Image, Amenity

admin.site.register(Studio)
admin.site.register(Image)
admin.site.register(Amenity)
