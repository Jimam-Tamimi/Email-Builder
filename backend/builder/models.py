from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
User = get_user_model()


# Create your models here.
class Template(models.Model):
    title = models.CharField(max_length=100, verbose_name=_("Title"))
    description = models.TextField(verbose_name=_("Description"), null=True, blank=True)
    creator = models.ForeignKey(User, verbose_name=_("Template Creator"), on_delete=models.CASCADE)
    data = models.JSONField(verbose_name=_("Data"), default=list, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-id']