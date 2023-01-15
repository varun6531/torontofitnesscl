from django.urls import path
from .views import RegistrationView, LoginView, LogoutView, ProfileEdit, ViewProfile

app_name = 'accounts'

urlpatterns = [
    path('register/', RegistrationView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('edit-profile/', ProfileEdit.as_view(), name='edit_profile'),
    path('view-profile/', ViewProfile.as_view(), name='register')
]
