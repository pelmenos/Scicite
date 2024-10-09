import os

from celery import Celery
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scicite_project_hpace.settings.base')

app = Celery('scicite_project_hpace')

app.config_from_object(settings, namespace='CELERY')

app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)