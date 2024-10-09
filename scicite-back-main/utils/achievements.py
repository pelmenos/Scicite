from django.conf import settings
from django.template.loader import render_to_string

from profiles_app.models import UserAchievement
from utils.email import EmailSender
from utils.payment import create_transaction

ACHIEVEMENTS = {
    "registration":{
        "amount":settings.PRICE_ACHIEVEMENT_REGISTRATION,
        "template":"bonus_registration.html",
        "theme":"Бонус - Регистрация"
    },
    "first_card":{
        "amount":settings.PRICE_ACHIEVEMENT_FIRST_CARD,
        "template":"bonus_first_card_created.html",
        "theme":"Бонус - Первая карточка"
    },
    "first_offer":{
        "amount":settings.PRICE_ACHIEVEMENT_FIRST_RESPONSE,
        "template":"bonus_first_response.html",
        "theme":"Бонус - Первый отклик"
    },
    "first_quote":{
        "amount":settings.PRICE_ACHIEVEMENT_FIRST_QUOTE,
        "template":"bonus_first_citation.html",
        "theme":"Бонус - Первое цитирование"
    },
    "first_publication":{
        "amount":settings.PRICE_ACHIEVEMENT_FIRST_PUBLICATION,
        "template":"bonus_first_publication.html",
        "theme":"Бонус - Первая публикация"
    },
}


def create_achievement(user, achievement_name):
    achievement = ACHIEVEMENTS[achievement_name]
    if UserAchievement.objects.filter(
        user=user, achievement=achievement_name
    ):
        return None
    amount = achievement['amount']
    create_transaction(
        user=user,
        amount=amount,
        basis_creation="achievement"
    )

    achievement_instance = UserAchievement.objects.create(
        user=user, achievement=achievement_name
    )

    theme = achievement['theme']
    template = achievement['template']
    recipient_list = [user.email]
    html_message = render_to_string(
        f'mail/{template}',
    )

    email_sender = EmailSender(
        settings.EMAIL_HOST,
        settings.EMAIL_PORT,
        settings.EMAIL_HOST_USER,
        settings.EMAIL_HOST_PASSWORD
    )
    email_sender.send_email(theme, recipient_list, html_message)
    return achievement_instance