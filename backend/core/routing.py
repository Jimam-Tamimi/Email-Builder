from django.urls import re_path

from builder.consumers import UserConsumer

websocket_urlpatterns = [
    re_path(r'ws/(?P<user_id>\d+)/$', UserConsumer.as_asgi()),
]
