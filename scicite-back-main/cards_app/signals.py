from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver

from cards_app.models import Cards, Category
from profiles_app.models import Counter, Notification
from utils.achievements import create_achievement
from utils.notifications import notify_create_card


@receiver(post_save, sender=Cards)
def create_notification_on_card_creation(sender, instance, created, **kwargs):
    if created:
        notify_create_card(instance)
        user = instance.user
        counter_obj, _ = Counter.objects.get_or_create(user=user)
        counter_obj.count_created_cards += 1
        counter_obj.save()
        if counter_obj.count_created_cards == 1:
            create_achievement(user, 'first_card')


