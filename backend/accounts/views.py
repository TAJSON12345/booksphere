from django.contrib.auth import login, logout
from django.middleware.csrf import get_token

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import LoginSerializer, RegisterSerializer

class CSRFTokenView(APIView):

    def get(self, request):
        return Response(
            {
                'csrfToken': get_token(request)
            },
            status=status.HTTP_200_OK
        )

class RegisterView(APIView):

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    'message': 'Registration successful.',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'role': user.role,
                    }
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class LoginView(APIView):

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']

            login(request, user)

            return Response(
                {
                    'message': 'Login successful.',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'role': user.role,
                        'status': user.status,
                    }
                },
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class LogoutView(APIView):

    def post(self, request):
        logout(request)

        return Response(
            {
                'message': 'Logout successful.'
            },
            status=status.HTTP_200_OK
        )


class CurrentUserView(APIView):

    def get(self, request):
        if not request.user.is_authenticated:
            return Response(
                {
                    'message': 'Authentication required.'
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        user = request.user

        return Response(
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'status': user.status,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            status=status.HTTP_200_OK
        )

    def patch(self, request):
        if not request.user.is_authenticated:
            return Response(
                {
                    'message': 'Authentication required.'
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        user = request.user

        allowed_fields = [
            'first_name',
            'last_name',
            'email',
        ]

        for field in allowed_fields:
            if field in request.data:
                setattr(user, field, request.data[field])

        user.save()

        return Response(
            {
                'message': 'Profile updated successfully.',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                    'status': user.status,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            },
            status=status.HTTP_200_OK
        )