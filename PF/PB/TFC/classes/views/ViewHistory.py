import datetime

from django.http import JsonResponse
from pytz import utc
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.core.paginator import Paginator

from accounts.models import GymUser
from classes.models import ClassUser, RecurringClass, Class
from subscriptions.models import ActiveSubscription


class ViewHistory(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request, *args, **kwargs):
        hist_page = kwargs['hist_page']
        sch_page = kwargs['sch_page']
        user_schedule = ClassUser.objects.filter(user=self.request.user)
        # put all the recurring date for this user in response dict
        history = {}
        schedule = {}
        response ={}
        today = datetime.datetime.today().date()
        for recurring_class in user_schedule:
            date = recurring_class.recurringClass.date
            name = recurring_class.recurringClass.main_class.name
            studio = recurring_class.recurringClass.main_class.studio
            if date > today:
                schedule[str(date)] = {"class_name": name, "studio": studio.name}
            else:
                history[str(date)] = {"class_name": name, "studio": studio.name}
            
        # sort by earliest day
        sorted_history = {}
        sorted_schedule = {}
        # for i in sorted(response.keys()):
        #     sorted_response[i] = response[i]
        for i in sorted(history.keys()):
            sorted_history[i] = history[i]
        for i in sorted(schedule.keys()):
            sorted_schedule[i] = schedule[i]

        hist_tup = tuple(sorted_history.items())
        hist_p = Paginator(hist_tup, 5)
        cur_hist_page = hist_p.page(hist_page).object_list

        sch_tup = tuple(sorted_schedule.items())
        sch_p = Paginator(sch_tup, 5)
        cur_sch_page = sch_p.page(sch_page).object_list

        
        res_sch = {}
        for tup in cur_sch_page:
            res_sch[tup[0]] = tup[1]
        res_hist = {}
        for tup in cur_hist_page:
            res_hist[tup[0]] = tup[1]

        print(res_sch)
        response = {"user": {"first_name": self.request.user.first_name, "last_name": self.request.user.last_name}, 
                    "schedule": {"page_num": sch_p.num_pages, "data": res_sch}, 
                    "history": {"page_num": hist_p.num_pages, "data": res_hist}}
        res = JsonResponse(response, safe=False)
        return res
