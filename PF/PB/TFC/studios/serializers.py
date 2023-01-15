from rest_framework import serializers

from studios.models import Studio, Image


class StudioSerializer(serializers.ModelSerializer):

    class Meta:
        model = Studio
        fields = ['name', 'address', 'geographical_location', 'postal_code', 'phone_number']


class PictureSerializer(serializers.ModelSerializer):

    image_url = serializers.SerializerMethodField('get_image_url')

    class Meta:
        model = Image
        fields = ('name', 'studio', 'image')

    def get_image_url(self, obj):
        return obj.image.url
