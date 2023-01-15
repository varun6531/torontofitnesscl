from django.contrib import admin

from .models import CardInfo, SubscriptionPlan, ActiveSubscription, Payment

admin.site.register(SubscriptionPlan)
admin.site.register(ActiveSubscription)
admin.site.register(CardInfo)
admin.site.register(Payment)
# Register your models here.
