from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from cards_app.models import Cards
from utils.notifications import notify_deadline


@shared_task(name='notify_card_last_day')
def notify_card_last_day():
    cards = Cards.objects.all()

    for card in cards:
        notification_date = card.created_at + timedelta(days=30 * card.tariff.period - 10)  # переводим месяцы в дни
        current_date = timezone.now().date()

        if current_date == notification_date.date():
            notify_deadline(card)
            pass

@shared_task(name='set_inactive_if_expired')
def set_inactive_if_expired():
    cards = Cards.objects.filter(is_active=True)

    for card in cards:
        expiration_date = card.created_at + timedelta(days=30 * card.tariff.period)  # переводим месяцы в дни
        current_date = timezone.now()

        if current_date > expiration_date:
            card.is_active = False
            card.save()