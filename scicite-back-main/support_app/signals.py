from django.db.models.signals import post_save
from django.dispatch import receiver

from support_app.models import Support
from utils.notifications import notify_dispute, notify_message


@receiver(post_save, sender=Support)
def support_created(sender, instance, created, **kwargs):
    support_type_id = str(instance.type_support.id)

    if support_type_id == "cec9aa64-57b0-48a8-9a9b-ac19b7459a2a":
        notify_message(instance)

    if support_type_id == "5f64962e-1635-4e3d-b073-9b96c57d130d":
        notify_dispute(instance)