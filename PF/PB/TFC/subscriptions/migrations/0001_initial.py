# Generated by Django 4.1.3 on 2022-11-19 03:32

import creditcards.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ActiveSubscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateTimeField(auto_now_add=True)),
                ('next_payment_day', models.DateField()),
                ('end_date', models.DateTimeField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='CardInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cc_number', creditcards.models.CardNumberField(max_length=25, verbose_name='card number')),
                ('cc_expiry', creditcards.models.CardExpiryField(verbose_name='expiration date')),
                ('cc_code', creditcards.models.SecurityCodeField(max_length=4, verbose_name='security code')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='SubscriptionPlan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('plan_number', models.IntegerField(unique=True)),
                ('cost', models.FloatField()),
                ('recurrence', models.CharField(choices=[('week', 'week'), ('month', 'month'), ('year', 'year')], max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('payment_datetime', models.DateTimeField(auto_now_add=True)),
                ('cost', models.FloatField(blank=True, null=True)),
                ('active_subscription', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='subscriptions.activesubscription')),
                ('payment_info', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='subscriptions.cardinfo')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='activesubscription',
            name='payment_info',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='subscriptions.cardinfo'),
        ),
        migrations.AddField(
            model_name='activesubscription',
            name='subscription_plan',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='subscriptions.subscriptionplan'),
        ),
        migrations.AddField(
            model_name='activesubscription',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
