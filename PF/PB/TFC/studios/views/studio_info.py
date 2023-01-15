from django.http import HttpResponse, JsonResponse
from django.views.generic import FormView, TemplateView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from studios.models import Studio, Image


# TemplateView to see studio information after the user clicks on the studio from the list
class StudioView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request, *args, **kwargs):
        # get the studio and the location from the url
        studio = Studio.objects.get(id=kwargs['studio_id'])
        location = kwargs['location'].replace(' ', '')

        images = []

        for image in Image.objects.all():
            if image.studio.id == studio.id:
                images.append(image.image.url)

        if location == 'e':
            link = ('https://www.google.com/maps/dir/?api=1' +
                    '&destination=' + studio.postal_code.replace(" ", ''))
        else:
            link = ('https://www.google.com/maps/dir/?api=1' + '&origin=' + location +
                    '&destination=' + studio.postal_code.replace(" ", ''))

        # add response data of the studio and return it using Json
        response_data = {
            'name': studio.name,
            'address': studio.address,
            'geographical_location': studio.geographical_location,
            'phone_number': studio.phone_number,

            'link': link,
            'images': images
        }

        return JsonResponse(response_data)
