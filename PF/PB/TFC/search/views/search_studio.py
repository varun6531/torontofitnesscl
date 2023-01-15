from django.http import HttpResponse, JsonResponse
from django.views.generic import FormView, TemplateView
from rest_framework.views import APIView

from classes.models import Class
from studios.models import Studio, Amenity
from rest_framework.permissions import IsAuthenticated


class SearchStudioView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request, *args, **kwargs):
        # array to store the name of whats being searched, as well as the object, and what
        # we want to show in the response
        result_arr = []
        if kwargs['search_by'] == 'studio_name':
            for studio in Studio.objects.all():
                if kwargs['search_term'].lower() in studio.name.lower():
                    result_arr.append({'name': studio.name, 'studio': studio, 'studio_id': studio.id})
            temp_arr = []
            for result in result_arr:
                temp_arr.append({'studio_name': result['name'], 'studio_id': result['studio_id']})
            return JsonResponse(temp_arr, safe=False)

        elif kwargs['search_by'] == 'amenity':
            for amenity in Amenity.objects.all():
                if kwargs['search_term'].lower() in amenity.type.lower():
                    result_arr.append({'type': amenity.type, 'quantity': amenity.quantity,
                                       "studio": amenity.studio.name, 'amenity': amenity,
                                       "studio_id": amenity.studio.id})
            temp_arr = []
            for result in result_arr:
                temp_arr.append({'type': result['type'], 'studio': result['studio'],
                                 'quantity': result['quantity'], 'studio_id': result['studio_id']})
            return JsonResponse(temp_arr, safe=False)
        elif kwargs['search_by'] == 'class_name':
            for class_taught in Class.objects.all():
                if kwargs['search_term'].lower() in class_taught.name.lower():
                    result_arr.append({'name': class_taught.name, 'class': class_taught,
                                       'studio': class_taught.studio.name, 'coach': class_taught.coach,
                                       'studio_id': class_taught.studio.id})
            temp_arr = []
            for result in result_arr:
                temp_arr.append({'class_name': result['name'], 'studio': result['studio'],
                                 'coach': result['coach']})
            return JsonResponse(temp_arr, safe=False)
        elif kwargs['search_by'] == 'coach_name':
            for class_taught in Class.objects.all():
                if kwargs['search_term'].lower() in class_taught.coach.lower():
                    result_arr.append({'class_name': class_taught.name, 'coach': class_taught.coach,
                                       'class': class_taught, 'studio': class_taught.studio.name,
                                       'studio_id': class_taught.studio.id})
            temp_arr = []
            for result in result_arr:
                temp_arr.append({'class_name': result['class_name'], 'coach': result['coach'],
                                 'studio_name': result['studio'], 'studio_id': result['studio_id']})
            return JsonResponse(temp_arr, safe=False)

#         do something else with result_arr, temp_arr for backend testing only

