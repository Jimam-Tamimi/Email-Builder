from rest_framework import serializers
from .models import Template

class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = ('id', 'title', 'description', 'creator', 'data', 'created_at', 'updated_at')
        read_only_fields = ('id', 'creator', 'created_at', 'updated_at')