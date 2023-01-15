from django.urls import path
from .views import CancelSubscriptionView, FuturePaymentView, PaymentHistoryView, SubscribeView, \
    UpdateCardView, CreateCardView,  \
    UpdateSubscriptionView, PaymentHandler, ViewAllPlans

app_name = 'subscriptions'

urlpatterns = [
    path('subscribe/', SubscribeView.as_view(), name='subscribe'),
    path('create-credit-card/', CreateCardView.as_view(), name='create-card'),
    path('edit-credit-card/', UpdateCardView.as_view(), name='update-card'),
    path('payment-history/', PaymentHistoryView.as_view(), name='payment-history'),
    path('future-payments/', FuturePaymentView.as_view(), name='future-payments'),
    path('edit-subscription/', UpdateSubscriptionView.as_view(), name='update-subscription'),
    path('cancel-subscription/', CancelSubscriptionView.as_view(), name='cancel-subscription'),
    path('record-payments/', PaymentHandler.as_view(), name='payment-handler'),
    path('view-all-plans/', ViewAllPlans.as_view(), name='view-all-plans'),

]
