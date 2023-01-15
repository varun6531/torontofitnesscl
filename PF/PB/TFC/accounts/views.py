from rest_framework.generics import RetrieveAPIView, UpdateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import GymUser
from .serializers import UserSerializer
from rest_framework.exceptions import AuthenticationFailed

# Create your views here.
class RegistrationView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = GymUser.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User not found!')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')

        response = Response({'response': 'login successful'})

        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        response = Response({
            'response': 'logout successful'
        })
        return response


class ProfileEdit(UpdateAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = UserSerializer

    def get_object(self):
        return GymUser.objects.get(email=self.request.data['email'])


class ViewProfile(ListAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = UserSerializer
    model = GymUser

    def post(self, request, *args, **kwargs):
            return self.list(request, *args, **kwargs)

    def get_queryset(self):
            queryset = self.model.objects.filter(email=self.request.data['email'])
            return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        for item in serializer.data:
            item['email'] = self.model.objects.filter(email=self.request.data['email']).first().email
            item['first_name'] = self.model.objects.filter(email=self.request.data['email']).first().first_name
            item['last_name'] = self.model.objects.filter(email=self.request.data['email']).first().last_name
            item['phone_number'] = self.model.objects.filter(email=self.request.data['email']).first().phone_number
            item['avatar'] = self.model.objects.filter(email=self.request.data['email']).first().avatar
        return Response(serializer.data)
