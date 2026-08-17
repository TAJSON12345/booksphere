from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers


User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    password_confirm = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'password',
            'password_confirm',
        ]

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({
                'password': 'Passwords do not match.'
            })

        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')

        password = validated_data.pop('password')

        user = User(**validated_data)
        user.set_password(password)

        user.role = 'member'
        user.status = 'active'

        user.save()

        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        user = authenticate(
            username=username,
            password=password
        )

        if user is None:
            raise serializers.ValidationError(
                'Invalid username or password.'
            )

        if user.status != 'active':
            raise serializers.ValidationError(
                'This account is currently suspended.'
            )

        data['user'] = user

        return data