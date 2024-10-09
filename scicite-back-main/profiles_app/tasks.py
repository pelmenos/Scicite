import logging
from datetime import datetime, timedelta

from celery import shared_task
from django.utils.timezone import now

from profiles_app.models import User

logger = logging.getLogger(__name__)

@shared_task(name="delete_inactive_users")
def delete_inactive_users():
    try:
        ten_minutes_ago = now() - timedelta(minutes=1)
        inactive_users = User.objects.filter(is_active=False, created_at__lt=ten_minutes_ago)

        logger.info(f"Deleting {inactive_users.count()} inactive users.")
        inactive_users.delete()
    except Exception as e:
        logger.error(f"Error deleting inactive users: {str(e)}")