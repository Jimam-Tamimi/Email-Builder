
from rest_framework import viewsets
from builder.pagination import TemplatePagination
from builder.models import Template
from builder.serializers import TemplateSerializer
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend

class TemplateViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing template instances.
    """
    serializer_class = TemplateSerializer
    queryset = Template.objects.all()
    filter_backends = [DjangoFilterBackend]
    # filterset_class = ConversationFilter
    pagination_class = TemplatePagination
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)