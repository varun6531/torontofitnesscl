import datetime

from django.db import models
from django.db.models import CASCADE
from accounts.models import GymUser
from studios.models import Studio


class ClassManager(models.Manager):
    def create_class(self, name, description, coach, studio, keyword, capacity, day, time, start_date, end_date):
        class_ = self.create(name=name, description=description, coach=coach, studio=studio, keyword=keyword,
                             capacity=capacity, day=day, time=time, start_date=start_date, end_date=end_date)
        return class_


class Class(models.Model):
    DAYS = ((1 , 'Monday'), (2, 'Tuesday'), (3, 'Wednesday'),
            (4, 'Thursday'), (5, 'Friday'), (6, 'Saturday'), (7, 'Sunday'))
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    coach = models.CharField(max_length=100)
    studio = models.ForeignKey(to=Studio, on_delete=CASCADE, related_name='classes')
    keyword = models.CharField(max_length=200)  # bro its keyword don't be long
    capacity = models.IntegerField()
    day = models.IntegerField(choices=DAYS)
    time = models.TimeField()
    start_date = models.DateField()
    end_date = models.DateField()
    objects = ClassManager()

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        date = self.start_date
        print(date.isoweekday())
        if not RecurringClass.objects.filter(main_class=self):
            if self.day > date.isoweekday():
                date += datetime.timedelta(days=(self.day-date.isoweekday()))
            elif self.day < date.isoweekday():
                date += datetime.timedelta(days=(abs(date.isoweekday() - 7) + self.day))
            while date <= self.end_date:
                recurring_class = RecurringClass.objects.create_recurring_class(main_class=self, date=date)
                recurring_class.save()
                date += datetime.timedelta(weeks=1)
        else:
            if self.day != RecurringClass.objects.filter(main_class=self)[0].date.isoweekday():
                for class_ in RecurringClass.objects.filter(main_class=self):
                    recurring_date = class_.date
                    if self.day > recurring_date.isoweekday():
                        recurring_date += datetime.timedelta(days=(self.day-recurring_date.isoweekday()))
                    elif self.day < recurring_date.isoweekday():
                        recurring_date += datetime.timedelta(days=(abs(recurring_date.isoweekday() - 7) + self.day))
                    if recurring_date.date() > self.end_date:
                        class_.delete()
                    else:
                        class_.date = recurring_date
                        class_.save()

class RecurringClassManager(models.Manager):
    def create_recurring_class(self, main_class, date):
        recurring_class = self.create(main_class=main_class, date=date)
        return recurring_class


# storing all the instance of classes, let say
# (1, "2022-11-17"), (1, "2022-11-24")...
class RecurringClass(models.Model):
    main_class = models.ForeignKey(to=Class, on_delete=CASCADE, related_name='recurring_class')
    date = models.DateField()
    objects = RecurringClassManager()

    def __str__(self):
        return str(self.main_class) + " " + str(self.date)


class ClassUserManager(models.Manager):
    def create_class_user(self, recurringClass, user):
        class_user = self.create(recurringClass=recurringClass, user=user)
        return class_user


# storing recurringclass to user ((1, 1), (1, 2), (1, 3)...), can think about it as attendance
class ClassUser(models.Model):
    recurringClass = models.ForeignKey(to=RecurringClass, on_delete=CASCADE, related_name='attendance')
    user = models.ForeignKey(to=GymUser, on_delete=CASCADE, related_name='user')
    objects = ClassUserManager()

    def __str__(self):
        return str(self.recurringClass) + ' ' + str(self.user)
