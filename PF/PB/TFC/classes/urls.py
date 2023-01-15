from django.urls import path

from classes.views.ClassesView import AllClassesView, RecurringClassView
from classes.views.Drop import DropAllClass, DropOneClass
from classes.views.Enrol import EnrolClass, EnrolAllClass
from classes.views.ViewHistory import ViewHistory

app_name = 'classes'

urlpatterns = [
    path('<studio_id>/all-classes/<page>/', AllClassesView.as_view(), name='all_classes'),
    path('<class_id>/recurring-classes/', RecurringClassView.as_view(), name='all_recurring_classes'),
    path('<class_id>/enrol-all/', EnrolAllClass.as_view(), name='enrol_all_class'),
    path('<recurring_class>/enrol/', EnrolClass.as_view(), name='enroll_class'),
    path('<class_id>/drop-all/', DropAllClass.as_view(), name='drop_all_class'),
    path('<recurring_class>/drop/', DropOneClass.as_view(), name='drop_one_class'),
    path('view-classes/<hist_page>/<sch_page>/', ViewHistory.as_view(), name='view_history'),
]
