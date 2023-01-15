from datetime import datetime

from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from classes.models import Class, RecurringClass


class SearchClassView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request, *args, **kwargs):
        days_dict = {'1': 'Monday', '2': 'Tuesday', '3': 'Wednesday', '4': 'Thursday', '5': 'Friday',
                     '6': 'Saturday', '7': 'Sunday'}
        result_arr = []
        if kwargs['search_by'] == 'class_name':
            for class_taught in Class.objects.all():
                if kwargs['search_term'].lower() in class_taught.name.lower():
                    result_arr.append({'name': class_taught.name,
                                       'schedule': days_dict[class_taught.day]
                                                   + ' '
                                                   + class_taught.time.strftime('%H:%M:%S')
                                                   + " until " + class_taught.end_date.strftime('%Y-%m-%d'),
                                       'class': class_taught, 'studio_name': class_taught.studio.name,
                                       'studio_id': class_taught.studio.id,
                                       'coach': class_taught.coach})
            temp_arr = []
            for result in result_arr:
                temp_arr.append({'name': result['name'], 'schedule': result['schedule'],
                                 'studio_name': result['studio_name'], 'studio_id': result['studio_id'],
                                 'coach': result['coach']})
            return JsonResponse(temp_arr, safe=False)

        elif kwargs['search_by'] == 'coach_name':
            for class_taught in Class.objects.all():
                if kwargs['search_term'].lower() in class_taught.coach.lower():
                    result_arr.append({'name': class_taught.name,
                                       'schedule': days_dict[class_taught.day]
                                                   + ' '
                                                   + class_taught.time.strftime('%H:%M:%S')
                                                   + " until " + class_taught.end_date.strftime('%Y-%m-%d'),
                                       'coach': class_taught.coach,
                                       'class': class_taught, 'studio_name': class_taught.studio.name,
                                       'studio_id': class_taught.studio.id})
            temp_arr = []
            for result in result_arr:
                temp_arr.append({'name': result['name'], 'schedule': result['schedule'],
                                 'coach': result['coach'], 'studio_name': result['studio_name'],
                                 'studio_id': result['studio_id']})
            return JsonResponse(temp_arr, safe=False)

        elif kwargs['search_by'] == 'date':
            for recur_class in RecurringClass.objects.all():
                # return JsonResponse({"x": recur_class.date})
                if datetime.strptime(kwargs['search_term'], '%Y-%m-%d').date() == recur_class.date.date():
                    result_arr.append({'name': recur_class.main_class.name,
                                       'schedule': recur_class.date.date().strftime('%Y-%m-%d')
                                                   + ' '
                                                   + recur_class.date.time().strftime('%H:%M:%S')
                                                   + " until " + recur_class.main_class.end_date.strftime('%Y-%m-%d'),
                                       'class': recur_class.main_class, 'studio_name': recur_class.main_class.studio.name,
                                       'studio_id': recur_class.main_class.studio.id,
                                       'coach': recur_class.main_class.coach})
            temp_arr = []
            for result in result_arr:
                temp_arr.append({'name': result['name'], 'schedule': result['schedule'],
                                 'studio_name': result['studio_name'],
                                 'studio_id': result['studio_id'], 'coach': result['coach']})
            return JsonResponse(temp_arr, safe=False)

        elif kwargs['search_by'] == 'time':
            lst = kwargs['search_term'].split()
            for recur_class in RecurringClass.objects.all():
                if datetime.strptime(lst[0], '%H:%M:%S').time() < recur_class.date.time() < \
                        datetime.strptime(lst[1], '%H:%M:%S').time():
                    result_arr.append({'name': recur_class.main_class.name,
                                       'schedule': recur_class.date.date().strftime('%Y-%m-%d')
                                                   + ' '
                                                   + recur_class.date.time().strftime('%H:%M:%S')
                                                   + " until " + recur_class.main_class.end_date.strftime('%Y-%m-%d'),
                                       'class': recur_class.main_class,
                                       'studio_name': recur_class.main_class.studio.name,
                                       'studio_id': recur_class.main_class.studio.id,
                                       'coach': recur_class.main_class.coach})
            temp_arr = []
            for result in result_arr:
                temp_arr.append({'name': result['name'], 'schedule': result['schedule'],
                                 'studio_name': result['studio_name'],
                                 'studio_id': result['studio_id'], 'coach': result['coach']})
            return JsonResponse(temp_arr, safe=False)
