from datetime import datetime, timedelta

from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from classes.models import Class, RecurringClass, ClassUser


# Enrol to all instances of this class
# class EnrolAllClass(APIView):
#     permission_classes = [IsAuthenticated, ]
#
#     def post(self, request, *args, **kwargs):
#         # check if class exist
#         try:
#             class_ = Class.objects.get(id=self.kwargs['class_id'])
#         except ObjectDoesNotExist:
#             return HttpResponse("404 NOT FOUND", status=404)
#             # if the user is subscribed
#             # if self.request.user.is_subscribe:
#         date = class_.start_date
#             # check if the user enrolled on which date, dont enrol the day already pass
#         if datetime.today() > date:
#             date = datetime.today()
#             # see if the start day passed the recurring date or not
#         start_day = int(class_.start_date.isoweekday())
#         recurring_day = int(class_.day)
#
#             # so move it to next day
#         if start_day > recurring_day:
#             delta = abs(start_day - 7)
#             date += timedelta(days=delta + recurring_day - 1)
#
#         class_list = RecurringClass.objects.filter(main_class=class_.id)
#             # store the date that is full
#         full = []
#         while date + timedelta(weeks=1) < class_.end_date:
#                 # check capacity of that class on that specific date
#             class_on_date = class_list.objects.get(date=date)
#             if len(ClassUser.objects.filter(recurringClass=class_on_date.id)) < class_.capacity:
#                     # add it
#                 user = ClassUser.objects.create(recurringClass=class_on_date.id, user=self.request.user)
#                 user.save()
#             else:
#                 full.append(date)
#             date += timedelta(days=1)
#             # if any class is full for that date, print it out
#         if full:
#             response = "the following date is not enrolled due to full: "
#             for date in full:
#                 response += str(date) + " "
#             return Response({"msg": response})
#         return Response({"msg": "Successfully add to this class for all date"})
#

#       return Response({"msg": "You have not subscribe yet"})
from subscriptions.models import ActiveSubscription


class EnrolAllClass(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request, *args, **kwargs):
        try:
            class_ = Class.objects.get(id=self.kwargs['class_id'])
            class_list = RecurringClass.objects.filter(main_class=class_)
        except ObjectDoesNotExist:
            return HttpResponse("404 NOT FOUND", status=404)
        try: 
            ActiveSubscription.objects.get(user=self.request.user)
        except: 
            return Response({"msg": "You have not subscribe yet"})
        today = datetime.today()
        for recurring_class in class_list:
            recurring_date = recurring_class.date
            if today < recurring_date and len(Class.objects.filter(id=recurring_class.id)) < recurring_class.main_class.capacity:
                if not ClassUser.objects.filter(recurringClass=recurring_class, user=self.request.user):
                    user = ClassUser.objects.create(recurringClass=recurring_class, user=self.request.user)
                    user.save()
        return Response({"msg": "Successfully added"})
        


class EnrolClass(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request, *args, **kwargs):
        try:
            recurring_class = RecurringClass.objects.get(id=self.kwargs['recurring_class'])
        except ObjectDoesNotExist:
            return HttpResponse("404 NOT FOUND", status=404)

        try:
            ActiveSubscription.objects.get(user=self.request.user)
        except:
            return Response({"msg": "You have not subscribe yet"}, status=402)
            # check capacity of that class on that specific date
        if len(ClassUser.objects.filter(recurringClass=recurring_class)) < recurring_class.main_class.capacity:
                # add it
            if not ClassUser.objects.filter(recurringClass=recurring_class, user=self.request.user):
                attendance = ClassUser.objects.create(recurringClass=recurring_class, user=self.request.user)
                attendance.save()
                return Response({"msg": "Successfully added"})
            return Response({"msg": "You have enrolled!"})
        else:
            return Response({"msg": "Class is full"})
        
