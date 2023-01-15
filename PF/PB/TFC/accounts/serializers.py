from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import GymUser


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = GymUser
        fields = ('email', 'password', 'first_name', 'last_name', 'avatar', 'phone_number')
        lookup_field = 'email'

    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):
        user = super().update(instance, validated_data)
        try:
            user.set_password(validated_data['password'])
            user.save()
        except KeyError:
            pass
        return user
