# Generated by Django 4.1.4 on 2022-12-09 01:28

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('studios', '0002_remove_image_default'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Class',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.CharField(max_length=200)),
                ('coach', models.CharField(max_length=100)),
                ('keyword', models.CharField(max_length=200)),
                ('capacity', models.IntegerField()),
                ('day', models.CharField(choices=[('1', 'Monday'), ('2', 'Tuesday'), ('3', 'Wednesday'), ('4', 'Thursday'), ('5', 'Friday'), ('6', 'Saturday'), ('7', 'Sunday')], max_length=200)),
                ('time', models.TimeField()),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('studio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='classes', to='studios.studio')),
            ],
        ),
        migrations.CreateModel(
            name='RecurringClass',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('main_class', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='recurring_class', to='classes.class')),
            ],
        ),
        migrations.CreateModel(
            name='ClassUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('recurringClass', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attendance', to='classes.recurringclass')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
