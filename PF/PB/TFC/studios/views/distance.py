from operator import itemgetter
import re


from django.core.paginator import Paginator
from django.http import JsonResponse, HttpResponse
from django.views.generic import FormView, TemplateView
from rest_framework.views import APIView

from TFC import settings
import requests

from studios.models import Studio

from rest_framework.permissions import IsAuthenticated

url = 'https://maps.googleapis.com/maps/api/distancematrix/json?'
url_crd = 'https://maps.googleapis.com/maps/api/geocode/json?'


# TemplateView to get a list of studios from a location
class SortByDistance(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request, *args, **kwargs):
        # get the location from the url
        location = kwargs['location']
        page_num = kwargs['page_num']
        # array of distances
        distance_arr = []
        return_arr = []
        # for each studio, get the distance of it from the location, and sort it to return a
        # Json formatted string
        for studio in Studio.objects.all():

            r = requests.get(url + 'origins=' + location +
                             '&destinations=' + studio.geographical_location +
                             '&key=' + 'AIzaSyAqacoZngz8V4d51H5mshGuqsj_AFQeQ4A' +
                             '&sensor=false')
            distance = r.json()["rows"][0]["elements"][0]["distance"]["text"]

            if len(location) < 8:
                w = requests.get(url_crd + 'address=' + location
                                 + ',CA&key=AIzaSyAqacoZngz8V4d51H5mshGuqsj_AFQeQ4A')

                crds = w.json()['results'][0]['geometry']['bounds']['northeast']
            else:
                crds = location
            distance_arr.append({'id': studio.id, 'name': studio.name,
                                 'distance': float(distance.split(" ", 1)[0]),
                                 "studio_location": studio.geographical_location,
                                 "origin_coordinates": crds})
        sorted_arr = sorted(distance_arr, key=itemgetter('distance'))

        p = Paginator(sorted_arr, 2)
        return_arr.append({'objects': p.count, 'pages': p.num_pages})
        page = p.page(page_num)
        return_arr.append(page.object_list)
        json_sorted = JsonResponse(return_arr, safe=False)
        print(return_arr)
        return json_sorted


