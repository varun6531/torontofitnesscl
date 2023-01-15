from django.http import HttpResponse
from django.shortcuts import render
from django.template.context_processors import request
from django.views.generic import FormView, TemplateView

from classes.forms.add_class import AddClassForm
from classes.models import Class
#
#
# class AddClassView(FormView):
#     template_name = 'classes/add_class.html'
#     form_class = AddClassForm
#
#     def form_valid(self, form):
#         if self.request.user.is_admin:
#             print(self.request.POST)
#             # new_class = Class.objects.create(studio=self.request.studio,
#             #                                    name=form.cleaned_data['name'],
#             #                                    description=form.cleaned_data['description'],
#             #                                    coach=form.cleaned_data['coach'],
#             #                                    keyword=form.cleaned_data['keyword'],
#             #                                    capacity=form.cleaned_data['capacity'],
#             #                                    times=form.cleaned_data['times'],
#             #                                    end_date=form.cleaned_data['end_date'])
#         return HttpResponse("Added")
#

