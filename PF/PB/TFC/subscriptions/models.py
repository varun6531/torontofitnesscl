from django.db import models
from creditcards.models import CardExpiryField, SecurityCodeField, CardNumberField
from django.db.models import CASCADE, SET_NULL

from accounts.models import GymUser

RECURRENCE_CHOICES = [
    ("week", "week"),
    ("month", "month"),
    ("year", "year")
]


class SubscriptionPlanManager(models.Manager):
    def create_subscription_plan(self, plan_number, cost, renew_months):
        subscription_plan = self.create(plan_number=plan_number, cost=cost, renew_months=renew_months)
        return subscription_plan


class SubscriptionManager(models.Manager):
    def create_subscription(self, GymUser, subscription_plan, payment_info, next_payment_day, start_date, end_date):
        subscription = self.create(start_date=start_date, next_payment_day=next_payment_day, end_date=end_date, GymUser=GymUser, subscription_plan=subscription_plan,payment_info=payment_info)
        return subscription


class CardManager(models.Manager):
    def create_card(self, GymUser, cc_number, cc_expiry, cc_code):
        card = self.create(GymUser=GymUser, cc_number=cc_number,
                                   cc_expiry=cc_expiry, cc_code=cc_code)
        return card


class PaymentManager(models.Manager):
    def create_subscription(self, GymUser, active_subscription, payment_datetime, payment_info, cost):
        payment = self.create(GymUser=GymUser, active_subscription=active_subscription,
                              payment_datetime=payment_datetime, payment_info=payment_info, cost=cost)
        return payment



class SubscriptionPlan(models.Model):
    plan_number = models.IntegerField(unique=True)
    cost = models.FloatField()
    recurrence = models.CharField(max_length=50, choices=RECURRENCE_CHOICES)
    objects = SubscriptionPlanManager()

    def __str__(self):
        return 'Plan ' + str(self.plan_number) + ': $' + str(self.cost) + ' per ' + str(self.recurrence)


class CardInfo(models.Model):
    user = models.OneToOneField(GymUser, on_delete=CASCADE, unique=True)
    cc_number = CardNumberField('card number')
    cc_expiry = CardExpiryField('expiration date')
    cc_code = SecurityCodeField('security code')
    objects = CardManager()

    def __str__(self):
        return 'Card starting with ' + str(self.cc_number)[0:4]


class ActiveSubscription(models.Model):
    user = models.OneToOneField(GymUser, on_delete=CASCADE, unique=True)
    subscription_plan = models.ForeignKey(SubscriptionPlan, on_delete=CASCADE)
    start_date = models.DateTimeField(auto_now_add=True)
    next_payment_day = models.DateField()
    end_date = models.DateTimeField(blank=True, null=True)
    payment_info = models.ForeignKey(CardInfo, on_delete=CASCADE)
    objects = SubscriptionManager()

    def __str__(self):
        return str(self.user) + ' has subscribed to ' + str(self.subscription_plan)

class Payment(models.Model):
    user = models.ForeignKey(GymUser, on_delete=CASCADE)
    payment_datetime = models.DateTimeField(auto_now_add=True)
    active_subscription = models.ForeignKey(ActiveSubscription, on_delete=SET_NULL, null=True)
    payment_info = models.ForeignKey(CardInfo, on_delete=SET_NULL, null=True)
    cost = models.FloatField(blank=True, null=True)
    objects = PaymentManager()

    def __str__(self):
        return str(self.user) + ' paid $' + str(self.cost) + ' on: ' + str(self.payment_datetime) + ' with ' + str(self.payment_info)


