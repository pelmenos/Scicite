from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.utils import timezone

from offers_app.models import Offers
from profiles_app.models import Counter, Notification, UserAchievement
from utils.achievements import create_achievement
from utils.email import EmailSender
from utils.notifications import notify_barter, notify_create_offer
from utils.payment import create_transaction


@receiver(post_save, sender=Offers)
def create_notification_on_offer_status_change(sender, instance, created, **kwargs):
    user = instance.card.user
    card = instance.card
    perfomer = instance.perfomer

    if created:
        counter_obj, _ = Counter.objects.get_or_create(user=perfomer)
        # if instance.barter:
        #     notify_barter(instance)
        #     counter_obj.count_created_barters += 1
        notify_create_offer(instance)
        counter_obj.count_created_offers += 1
        if counter_obj.count_created_offers == 1:
            create_achievement(perfomer, "first_quote")
        counter_obj.save()
        


