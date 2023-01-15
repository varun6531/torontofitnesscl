import datetime

from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.core.paginator import Paginator
from classes.models import Class, RecurringClass
from studios.models import Studio


class AllClassesView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request, *args, **kwargs):
        studio_id = Studio.objects.get(id=kwargs['studio_id'])
        page_num = int(kwargs['page'])
        data = []
        today = datetime.datetime.today().date()
        for class_ in Class.objects.filter(studio=studio_id):
            temp = {}
            for recurring_class in RecurringClass.objects.filter(main_class=class_.id):
                recurring_date = recurring_class.date.date()
                # print(recurring_date)
                if today < recurring_date:
                    temp[recurring_class.id] = {"recurring_class_id": recurring_class.id,
                                                "date": recurring_class.date.date(),
                                                "main_class": class_.id}
            data.append(
                {"class_id": class_.id, "name": class_.name, "description": class_.description, "coach": class_.coach,
                 "studios": class_.studio.id, "keyword": class_.keyword, "capacity": class_.capacity,
                 "recurring_day": class_.day, "time": class_.time, "start_date": class_.start_date,
                 "end_date": class_.end_date, "recurring_class": temp})
            # data[class_.id] = {"name": class_.name, "description": class_.description, "coach": class_.coach,
            #                          "studios": class_.studio.id, "keyword": class_.keyword,
            #                          "capacity": class_.capacity,
            #                          "recurring_day": class_.day, "time": class_.time, "start_date": class_.start_date,
            #                          "end_date": class_.end_date}
        res = []
        p = Paginator(data, 3)
        res.append({'object': p.count, "pages": p.num_pages})
        res.append(p.page(page_num).object_list)
        res = JsonResponse(res, safe=False)
        return res


class RecurringClassView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request, *args, **kwargs):
        class_ = Class.objects.get(id=kwargs['class_id'])
        data = {}


        return JsonResponse(data, safe=False)
