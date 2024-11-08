# your_app/serializers.py

from rest_framework.serializers import ModelSerializer, IntegerField
from .models import User, Profile

class UserSerializer(ModelSerializer):
    id = IntegerField(read_only=True)

    class Meta:
        model = User
        fields = ("id", 'username', 'email', 'password', 'role', 'is_active', 'created_at', 'updated_at')
        extra_kwargs = {
            'password': {'write_only': True},
            'id': {'read_only': True},
            'role': {'read_only': True},
            'is_active': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields = ("id", 'user', 'first_name', 'last_name', 'active_channel_name', 'last_active', 'created_at', 'updated_at')
        extra_kwargs = {
            'id': {'read_only': True},
            'active_channel_name': {'read_only': True},
            'last_active': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }