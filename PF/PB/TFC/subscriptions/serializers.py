from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from accounts.models import GymUser
from .models import ActiveSubscription, CardInfo, Payment, SubscriptionPlan


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = GymUser
        fields = ('email', 'first_name', 'last_name', 'avatar', 'phone_number')
        lookup_field = 'email'


class SubscriptionPlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = SubscriptionPlan
        fields = ('plan_number', 'cost', 'recurrence')


class CardInfoSerializer(serializers.ModelSerializer):

    class Meta:
        model = CardInfo
        fields = ('user', 'cc_number', 'cc_expiry', 'cc_code')

    def create(self, validated_data):
        card = super().create(validated_data)
        card.save()
        return card

    def update(self, instance, validated_data):
        card = super().update(instance, validated_data)
        card.save()
        return card

class PaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment
        fields = ('user', 'active_subscription', 'payment_datetime', 'payment_info', 'cost')

    def create(self, validated_data):
        payment = super().create(validated_data)
        payment.save()
        return payment


class ActiveSubscriptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = ActiveSubscription
        fields = ('pk', 'user', 'subscription_plan', 'payment_info', 'next_payment_day', 'start_date', 'end_date')
        # payment_info, next_payment_date, end_date are not supplied by User

    def create(self, validated_data):
        subscription = super().create(validated_data)
        subscription.save()
        return subscription

    def update(self, instance, validated_data):
        subscription = super().update(instance, validated_data)
        subscription.save()
        return subscription
