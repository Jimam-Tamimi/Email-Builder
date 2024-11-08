
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import SimpleRouter

from builder.apis import TemplateViewSet
router = SimpleRouter()
router.register(r'templates', TemplateViewSet)

# router.register(r'users', UserViewSet) 
urlpatterns = [
    
] + router.urls
