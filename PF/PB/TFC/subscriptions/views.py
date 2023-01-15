from datetime import datetime, timedelta
from django.http import Http404

from django.shortcuts import render
from rest_framework.generics import CreateAPIView, DestroyAPIView, ListAPIView, \
    RetrieveUpdateDestroyAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.models import GymUser
from .models import ActiveSubscription, CardInfo, Payment, SubscriptionPlan
from .serializers import ActiveSubscriptionSerializer, CardInfoSerializer, PaymentSerializer, \
    UserSerializer, SubscriptionPlanSerializer
from rest_framework.exceptions import AuthenticationFailed
from dateutil.relativedelta import *



# Create your views here.
class SubscribeView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        copy_data =  request.data.copy()
        email = copy_data['email']
        subscriber = GymUser.objects.filter(email=email).first()
        copy_data['user'] = subscriber.pk
        if CardInfo.objects.filter(user=subscriber).first() == None:
            return Response({"error" : 'Please enter card information.'})
        copy_data['payment_info'] = CardInfo.objects.filter(user=subscriber).first().pk
        plan_number = copy_data['plan_number']
        subscription_plan = SubscriptionPlan.objects.filter(plan_number=plan_number).first()
        if subscription_plan == None:
            return Response({"error" : 'Please pick a valid plan.'})
        copy_data['subscription_plan'] = subscription_plan.pk
        if subscription_plan.recurrence == "week":
            copy_data['next_payment_day'] = (datetime.today() + relativedelta(weeks=+1)).date()
        elif subscription_plan.recurrence == "month":
            copy_data['next_payment_day'] = (datetime.today() + relativedelta(months=+1)).date()
        elif subscription_plan.recurrence == "year":
            copy_data['next_payment_day'] = (datetime.today() + relativedelta(years=+1)).date()
        active_serializer = ActiveSubscriptionSerializer(data=copy_data)
        active_serializer.is_valid(raise_exception=True)
        active_serializer.save()
        active_subscription = ActiveSubscription.objects.filter(
            user=subscriber).first()
        copy_data['active_subscription'] = active_subscription.pk
        copy_data['payment_datetime'] = active_subscription.start_date
        copy_data['cost'] = subscription_plan.cost
        payment_serializer = PaymentSerializer(data=copy_data)
        payment_serializer.is_valid(raise_exception=True)
        payment_serializer.save()
        return Response({'msg' : str(subscriber) + ' has subscribed to ' + str(subscription_plan)})


class CreateCardView(UpdateAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = CardInfoSerializer

    def get_object(self):
        user = GymUser.objects.filter(email=self.request.data['email']).first().pk
        return CardInfo.objects.get(user=user)

    def partial_update(self, request, *args, **kwargs):
        copy_data = request.data.copy()
        copy_data['user'] = GymUser.objects.filter(email=self.request.data['email']).first().pk
        instance = self.get_object()
        user = GymUser.objects.filter(email=self.request.data['email']).first().pk
        if CardInfo.objects.filter(user=user).first() == None:
            raise Http404
        serializer = self.get_serializer(instance, data=copy_data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({'msg': 'card updated!'})

    def update(self, request, *args, **kwargs):
        copy_data = request.data.copy()
        copy_data['user'] = GymUser.objects.filter(email=self.request.data['email']).first().pk
        instance = self.get_object()
        user = GymUser.objects.filter(email=self.request.data['email']).first().pk
        if CardInfo.objects.filter(user=user).first() == None:
            raise Http404
        serializer = self.get_serializer(instance, data=copy_data, partial=False)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({'msg': 'card updated!'})

    def post(self, request):
        copy_data = request.data.copy()
        user_pk = GymUser.objects.filter(email=copy_data['email']).first().pk
        copy_data['user'] = user_pk
        card_serializer = CardInfoSerializer(data=copy_data)
        card_serializer.is_valid(raise_exception=True)
        card_serializer.save()
        return Response({'msg': 'card created!'})

class UpdateCardView(UpdateAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = CardInfoSerializer

    def get_object(self):
        user = GymUser.objects.filter(email=self.request.data['email']).first().pk
        return CardInfo.objects.get(user=user)

    def partial_update(self, request, *args, **kwargs):
        copy_data = request.data.copy()
        copy_data['user'] = GymUser.objects.filter(email=self.request.data['email']).first().pk
        instance = self.get_object()
        user = GymUser.objects.filter(email=self.request.data['email']).first().pk
        serializer = self.get_serializer(instance, data=copy_data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({'msg': 'card updated!'})

    def update(self, request, *args, **kwargs):
        copy_data = request.data.copy()
        copy_data['user'] = GymUser.objects.filter(email=self.request.data['email']).first().pk
        instance = self.get_object()
        user = GymUser.objects.filter(email=self.request.data['email']).first().pk
        serializer = self.get_serializer(instance, data=copy_data, partial=False)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({'msg': 'card updated!'})

class ViewAllPlans(ListAPIView):
    model = SubscriptionPlan
    model2 = GymUser
    serializer_class = SubscriptionPlanSerializer

    def post(self, request, *args, **kwargs):
                return self.list(request, *args, **kwargs)

    def get_queryset(self):
        queryset = self.model.objects.filter()
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        for item in serializer.data:
            item['plan'] = self.model.objects.filter(pk=item['subscription_plan']).first().plan
            item['cost'] = self.model.objects.filter(pk=item['subscription_plan']).first().cost
            item['recurrence'] = self.model.objects.filter(pk=item['subscription_plan']).first().recurrence
        return Response(serializer.data)


class PaymentHistoryView(ListAPIView):
    permission_classes = [IsAuthenticated, ]
    model = Payment
    model2 = GymUser
    model3 = ActiveSubscription
    model4 = CardInfo
    serializer_class = PaymentSerializer

    def post(self, request, *args, **kwargs):
                return self.list(request, *args, **kwargs)

    def get_queryset(self):
        user = self.model2.objects.filter(email=self.request.data['email']).first().pk
        queryset = self.model.objects.filter(user=user)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        for item in serializer.data:
            item['user'] = self.model2.objects.filter(pk=item['user']).first().email
            item['active_subscription'] = str(self.model3.objects.filter(pk=item['active_subscription']).first().subscription_plan)
            item['payment_info'] = self.model4.objects.filter(pk=item['payment_info']).first().cc_number
        return Response(serializer.data)


class FuturePaymentView(ListAPIView):
    permission_classes = [IsAuthenticated, ]
    model = ActiveSubscription
    model2 = GymUser
    model3 = SubscriptionPlan
    model4 = CardInfo
    serializer_class = ActiveSubscriptionSerializer

    def post(self, request, *args, **kwargs):
                return self.list(request, *args, **kwargs)

    def get_queryset(self):
        user = self.model2.objects.filter(email=self.request.data['email']).first().pk
        queryset = self.model.objects.filter(user=user)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        for item in serializer.data:
            item['user'] = self.model2.objects.filter(pk=item['user']).first().email
            item['subscription_plan'] = str(self.model3.objects.filter(
                pk=item['subscription_plan']).first())
            item['payment_info'] = self.model4.objects.filter(
                pk=item['payment_info']).first().cc_number
        return Response(serializer.data)


class CancelSubscriptionView(DestroyAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = ActiveSubscriptionSerializer
    model = ActiveSubscription

    def get_queryset(self):
        user = GymUser.objects.filter(email=self.request.data['email']).first().pk
        queryset = self.model.objects.filter(user=user)
        return queryset

    def get_object(self):
        user = GymUser.objects.filter(email=self.request.data['email']).first().pk
        return ActiveSubscription.objects.get(user=user)


class UpdateSubscriptionView(DestroyAPIView, CreateAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = ActiveSubscriptionSerializer
    model = ActiveSubscription

    def get_queryset(self):
        user = GymUser.objects.filter(email=self.request.data['email']).first().pk
        queryset = self.model.objects.filter(user=user)
        return queryset

    def get_object(self):
        user = GymUser.objects.filter(email=self.request.data['email']).first().pk
        return ActiveSubscription.objects.get(user=user)

    def post(self, request, *args, **kwargs):
        copy_data = request.data.copy()
        email = copy_data['email']
        subscriber = GymUser.objects.filter(email=email).first()
        copy_data['user'] = subscriber.pk
        copy_data['payment_info'] = CardInfo.objects.filter(user=subscriber).first().pk
        plan_number = copy_data['plan_number']
        subscription_plan = SubscriptionPlan.objects.filter(plan_number=plan_number).first()
        if subscription_plan is None:
            return Response({'error': 'Please choose a valid subscription plan.'})
        copy_data['subscription_plan'] = subscription_plan.pk
        copy_data['next_payment_day'] = ActiveSubscription.objects.filter(user=subscriber.pk).first().next_payment_day
        if ActiveSubscription.objects.filter(user=subscriber.pk, subscription_plan=subscription_plan.pk):
            return Response({'msg': 'Please choose a different plan you wish to subscribe to.'})
        else:
            self.destroy(request, *args, **kwargs)
            active_serializer = ActiveSubscriptionSerializer(data=copy_data)
            active_serializer.is_valid(raise_exception=True)
            active_serializer.save()
            return Response({'msg': str(subscriber) + ' has subscribed to ' + str(subscription_plan)})

class PaymentHandler(ListAPIView, DestroyAPIView):
    serializer_class = ActiveSubscriptionSerializer
    model = ActiveSubscription

    def post(self, request, *args, **kwargs):
                return self.list(request, *args, **kwargs)

    def get_object(self):
        return ActiveSubscription.objects.filter(next_payment_day=datetime.today())

    def get(self, request, *args, **kwargs):
        queryset = self.get_object()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        dopy_data = {}
        for item in serializer.data:
            active_subscription = ActiveSubscription.objects.filter(
                user=item['user']).first()
            subscription_plan = SubscriptionPlan.objects.filter(
                pk=item['subscription_plan']).first()
            dopy_data['subscription_plan'] = item['subscription_plan']
            dopy_data['user'] = item['user']
            dopy_data['active_subscription'] = active_subscription.pk
            dopy_data['payment_datetime'] = datetime.now()
            dopy_data['payment_info'] = CardInfo.objects.filter(user=item['user']).first().pk
            dopy_data['cost'] = subscription_plan.cost
            payment_serializer = PaymentSerializer(data=dopy_data)
            payment_serializer.is_valid(raise_exception=True)
            payment_serializer.save()
            if subscription_plan.recurrence == "week":
                dopy_data['next_payment_day'] = (datetime.today() + relativedelta(weeks=+1)).date()
            elif subscription_plan.recurrence == "month":
                dopy_data['next_payment_day'] = (datetime.today() + relativedelta(months=+1)).date()
            elif subscription_plan.recurrence == "year":
                dopy_data['next_payment_day'] = (datetime.today() + relativedelta(years=+1)).date()
            self.destroy(request, *args, **kwargs)
            active_serializer = ActiveSubscriptionSerializer(data=dopy_data)
            active_serializer.is_valid(raise_exception=True)
            active_serializer.save()
        return Response({'msg' : 'payments recorded'})
