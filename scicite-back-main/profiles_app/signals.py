from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.template.loader import render_to_string

from profiles_app.models import Notification, Transacitons
from utils.notifications import notify_crediting


@receiver(post_save, sender=Transacitons)
def process_plus_transaction(sender, instance, **kwargs):
    pass
    # if instance.type_transaction == 'plus' and not instance.canceled_is and not instance.basis_creation=="achievement":
    #     notify_crediting(instance)
