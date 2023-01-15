from django.db import models
# Create your models here.
from django.db.models import ForeignKey, SET_NULL


class StudioManager(models.Manager):
    def create_studio(self, name, address, geographical_location, postal_code, phone_number):
        studio = self.create(name=name, address=address,
                             geographical_location=geographical_location, postal_code=postal_code,
                             phone_number=phone_number)
        return studio


class Studio(models.Model):
    # name, address, geographical location, postal code, phone number, and a set of images
    objects = StudioManager()
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    geographical_location = models.CharField(max_length=200)
    # Canada postal codes have 6 digits
    postal_code = models.CharField(max_length=7)
    # 10 digits so user knows to only input numbers
    phone_number = models.CharField(max_length=10)

    def __str__(self):
        return self.name


class ImageManager(models.Manager):
    def create_image(self, name, studio, image):
        image = self.create(name=name, studio=studio, image=image)
        return image


# model for images to allow the admin to add multiple images to a studio
class Image(models.Model):
    objects = ImageManager()
    name = models.CharField(max_length=200)
    studio = ForeignKey(Studio, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='studio_images/')

    def __str__(self):
        return self.name


class AmenityManger(models.Manager):
    def create_amenity(self, studio, type, quantity):
        amenity = self.create(studio=studio, type=type, quantity=quantity)
        return amenity


class Amenity(models.Model):
    objects = AmenityManger()
    studio = ForeignKey(to=Studio, related_name='amenity', on_delete=SET_NULL, null=True)
    type = models.CharField(max_length=200)
    quantity = models.PositiveIntegerField()







