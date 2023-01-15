from django.contrib import admin
from .models import GymUser
from django.contrib.auth.admin import UserAdmin


class UserAdminConfig(UserAdmin):
    model = GymUser
    search_fields = ('email', 'first_name', 'last_name')
    list_filter = ('email', 'first_name','last_name')
    list_display = ('email','first_name','last_name', 'avatar', 'phone_number')
    ordering = ('email', )
    fieldsets = (
        (None, {'fields': ('email', 'first_name',)}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
        ('Personal', {'fields': ('avatar', 'phone_number')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
            'email', 'first_name', 'last_name', 'password1', 'password2', 'avatar',
            'phone_number',  'is_active',  'is_staff')}
         ),
    )


admin.site.register(GymUser, UserAdminConfig)
