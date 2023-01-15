from django.contrib import admin

# Register your models here.
from classes.models import Class, RecurringClass, ClassUser

admin.site.register(Class)
admin.site.register(RecurringClass)
admin.site.register(ClassUser)