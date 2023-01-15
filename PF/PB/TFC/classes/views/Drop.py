from django.core.exceptions import ObjectDoesNotExist

from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from classes.models import Class, RecurringClass, ClassUser


class DropAllClass(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request, *args, **kwargs):
        try:
            class_ = Class.objects.get(id=self.kwargs['class_id'])
            class_list = RecurringClass.objects.filter(main_class=class_.id)
        except ObjectDoesNotExist:
            return Response({"msg": "class not found!"})
        for recurring_class in class_list:
            print(recurring_class)
            attendance = ClassUser.objects.filter(recurringClass=recurring_class)
            user = attendance.filter(user=self.request.user)
            user.delete()
        return Response({"msg": "You have dropped from class"})


class DropOneClass(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request, *args, **kwargs):
        recurring_class = self.kwargs['recurring_class']
        attendance = ClassUser.objects.filter(recurringClass=recurring_class)
        attendance.get(user=self.request.user).delete()
        return Response({"msg": "you have dropped from class"})