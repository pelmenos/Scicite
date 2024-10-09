from django.conf import settings
from django.template.loader import render_to_string

from profiles_app.models import Notification
from utils.email import EmailSender
from utils.prices import get_price_citation


def send_email(email, subject, html_message):
    EmailSender(
        settings.EMAIL_HOST, settings.EMAIL_PORT,
        settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD
    ).send_email(subject, [email], html_message)


def create_notification(user, message, object_id, message_en=None):
    notification = Notification.objects.create(
        user=user,
        message=message,
        object_id=object_id
    )
    setattr(notification, 'message_ru', message)
    setattr(notification, 'message_en', message_en)
    notification.save()
    return notification


def notify_crediting(instance):
    user = instance.user
    subject = "Зачисление SciCoin"
    html_message = render_to_string(
        'mail/crediting.html',
        {'transaction': instance}
    )
    send_email(user.email, subject, html_message)

    notification_message = f"На ваш счет зачислено {instance.sum} SciCoin"
    notification_message_en = f"You have been credited with {instance.sum} SciCoin(s) to your account."
    create_notification(user, notification_message, instance.id, notification_message_en)


def notify_dispute(support_instance):
    declarer = support_instance.declarer
    offer = support_instance.offer
    card = offer.card
    perfomer = offer.perfomer
    cart_number = card.cart_number
    
    notification_message = f"Вы открыли спор по цитированию карточки №{cart_number} с пользователем {perfomer.login}"
    notification_message_en = f"You opened a dispute on quoting card №{cart_number} with user {perfomer.login}"
    create_notification(declarer, notification_message, support_instance.id, notification_message_en)
    
    html_message = render_to_string(
        'mail/argument.html', 
        {
            'cart_number': cart_number,
            'username': perfomer.login,
            'message': support_instance.narrative
        }
    )
    subject = 'Вы открыли новый спор'
    send_email(declarer.email, subject, html_message)

    notification_message = f"Вы стали участником спора по карточке №{cart_number} с пользователем {perfomer.login}"
    notification_message_en = f"You became a participant in the dispute over card №{cart_number} with user {perfomer.login}"
    create_notification(perfomer, notification_message, support_instance.id, notification_message_en)
    
    html_message = render_to_string(
        'mail/member_of_dispute.html', 
        {
            'cart_number': cart_number,
            'name_cart': card.theme,
            'username': declarer.login,
            'message': support_instance.narrative
        }
    )
    subject = "Вы стали участником спора"
    send_email(perfomer.email, subject, html_message)
    notification_message = f"Вы стали участником спора по карточке №{cart_number} с пользователем {perfomer.login}"
    notification_message_en = f"You became a participant in the dispute over card №{cart_number} with user {perfomer.login}"
    create_notification(perfomer, notification_message, support_instance.id, notification_message_en)
    
    html_message = render_to_string(
        'mail/member_of_dispute.html', 
        {
            'cart_number': cart_number,
            'name_cart': card.theme,
            'username': declarer.login,
            'message': support_instance.narrative
        }
    )
    subject = "Вы стали участником спора"
    send_email(perfomer.email, subject, html_message)


def notify_barter(instance):
    user = instance.card.user
    perfomer = instance.perfomer
    
    notification_message = f"Вам предложен обмен по карточке №{instance.card.cart_number}"
    notification_message_en = f"You have been offered a trade for card №{instance.card.cart_number}"
    create_notification(user, notification_message, f"{instance.id}", notification_message_en)
    html_message = render_to_string(
        'mail/offer_barter.html',
        {'offer': instance}
    )
    send_email(user.email, notification_message, html_message)

    notification_message = f"Вы предложили обмен по карточке №{instance.card.cart_number}"
    notification_message_en = f"You offered a trade for card №{instance.card.cart_number}"
    create_notification(perfomer, notification_message, instance.id, notification_message_en)


def notify_barter_confirm(instance):
    user = instance.barter.user
    perfomer = instance.perfomer
    notification_message = f"Обмен по карточке №{instance.card.cart_number} подтвержден"
    notification_message_en = f"Trade for card №{instance.card.cart_number} confirmed"
    create_notification(perfomer, notification_message, f"{instance.id}", notification_message_en)
    html_message = render_to_string(
        'mail/confirm_barter.html',
        {'offer': instance}
    )
    send_email(perfomer.email, notification_message, html_message)

    notification_message = f"Вы подтвердили обмен по карточке №{instance.card.cart_number}"
    notification_message_en = f"You confirmed the trade for card №{instance.card.cart_number}"
    create_notification(user, notification_message, instance.id, notification_message_en)


def notify_barter_reject(instance):
    user = instance.barter.user
    perfomer = instance.perfomer
    notification_message = f"Обмен по карточке №{instance.card.cart_number} отклонен"
    notification_message_en = f"Trade for card №{instance.card.cart_number} rejected"
    create_notification(perfomer, notification_message, f"{instance.id}", notification_message_en)

    notification_message = f"Вы отклонили обмен по карточке №{instance.card.cart_number}"
    notification_message_en = f"You rejected the trade for card №{instance.card.cart_number}"
    create_notification(user, notification_message, instance.id, notification_message_en)


def notify_request_citation(instance):
    card_user = instance.card.user
    notification_message = f"У вас новый запрос на цитирование по карточке №{instance.card.cart_number}"
    notification_message_en = f"You have a new quotation request for card №{instance.card.cart_number}"
    create_notification(card_user, notification_message, instance.card.id, notification_message_en)

    html_message = render_to_string(
        'mail/request_citation.html',
        {'offer': instance}
    )
    subject = "Запрос на цитирование"
    send_email(card_user.email, subject, html_message)


def notify_request_publication(instance):
    card_user = instance.card.user
    notification_message = f"У вас новый запрос на публикацию по карточке №{instance.card.cart_number}"
    notification_message_en = f"You have a new publication request for card №{instance.card.cart_number}"
    create_notification(card_user, notification_message, instance.id, notification_message_en)
    html_message = render_to_string(
        'mail/request_publication.html',
        {'offer': instance}
    )
    subject = "Запрос на публикацию"
    send_email(card_user.email, subject, html_message)


def notify_reject_citation(instance):
    perfomer = instance.perfomer

    notification_message = "Ваше подтверждение цитирования отклонено"
    notification_message_en = "Your citation confirmation has been rejected"
    create_notification(perfomer, notification_message, instance.id, notification_message_en)
    html_message = render_to_string(
        'mail/reject_citation.html',
        {'offer': instance}
    )
    send_email(perfomer.email, notification_message, html_message)


def notify_expire_date_card(instance):
    user = instance.user
    cart_number = instance.cart_number
    days = 0
    notification_message = f"Срок размещения карточки №{cart_number} заканчивается через {days} дн."
    notification_message_en = f"The placement period for card №{cart_number} ends in {days} days."
    create_notification(user, notification_message, instance.id, notification_message_en)
    html_message = render_to_string(
        'mail/expire_data.html',
        {'card': instance, 'days':days}
    )
    send_email(user.email, notification_message, html_message)


def notify_deadline(instance):
    user = instance.perfomer
    cart_number = instance.cart_number
    notification_message = f"Срок размещения публикации по карточке №{cart_number} заканчивается через 10 дн."
    notification_message_en = f"The publication period for card №{cart_number} ends in 10 days."
    create_notification(user, notification_message, instance.id, notification_message_en)
    html_message = render_to_string(
        'mail/deadline_publication.html',
        {'offer': instance}
    )
    send_email(user.email, notification_message, html_message)


def notfiy_citation_confirm(instance):
    user = instance.card.user
    perfomer = instance.perfomer
    notification_message = f"{user.login} предоставил(-а) подтверждение цитирования по карточке №{instance.card.cart_number}"
    notification_message_en = f"{user.login} provided confirmation of citation for card №{instance.card.cart_number}"
    create_notification(perfomer, notification_message, instance.id, notification_message_en)

    html_message = render_to_string(
        'mail/confirm_citation.html',
        {'offer': instance, 'price': None if instance.barter else get_price_citation(instance) / 2}
    )
    subject = "Цитирование подтверждено"
    send_email(perfomer.email, subject, html_message)


def notfiy_pub_cit_confirm(instance):
    user = instance.card.user
    perfomer = instance.perfomer
    notification_message = f"{user.login} предоставил(-а) подтверждение публикации с цитированием по карточке №{instance.card.cart_number}"
    notification_message_en = f"{user.login} provided confirmation of publication with citation for card №{instance.card.cart_number}"
    create_notification(perfomer, notification_message, instance.id, notification_message_en)

    html_message = render_to_string(
        'mail/confirm_publication.html',
        {'offer': instance, 'price': None if instance.barter else get_price_citation(instance) / 2}
    )
    subject = "Цитирование подтверждено"
    send_email(perfomer.email, subject, html_message)


def notfiy_pub_confirm(instance):
    user = instance.card.user
    perfomer = instance.perfomer
    notification_message = f"{user.login} предоставил(-а) подтверждение публикации по карточке №{instance.card.cart_number}"
    notification_message_en = f"{user.login} provided confirmation of publication for card №{instance.card.cart_number}"
    create_notification(perfomer, notification_message, instance.id, notification_message_en)

    html_message = render_to_string(
        'mail/confirm_publication.html',
        {'offer': instance}
    )
    subject = "Цитирование подтверждено"
    send_email(perfomer.email, subject, html_message)


def notify_create_card(instance):
    user = instance.user
    notification_message = f"Карточка №{instance.cart_number} добавлена в Мои карточки"
    notification_message_en = f"Card №{instance.cart_number} added to My Cards"
    create_notification(user, notification_message, instance.id, notification_message_en)


def notify_create_offer(instance):
    perfomer = instance.perfomer
    notification_message = f"Карточка №{instance.card.cart_number} добавлена в отклики"
    notification_message_en = f"Card №{instance.card.cart_number} added to responses"
    create_notification(perfomer, notification_message, instance.id, notification_message_en)
    notification_message = f"По карточке №{instance.card.cart_number} получен отклик"
    notification_message_en = f"A response has been received for card №{instance.card.cart_number}"
    create_notification(instance.card.user, notification_message, instance.id, notification_message_en)


def notify_message(support_instance):
    offer = support_instance.offer
    perfomer = offer.perfomer

    notification_message = f"Вы получили сообщение"
    notification_message_en = f"You have received a message"
    create_notification(perfomer, notification_message, support_instance.id, notification_message_en)

    html_message = render_to_string(
        'mail/message.html',
        {
            'support': support_instance,
        }
    )
    subject = "Вам отправлено сообщение"
    send_email(perfomer.email, subject, html_message)
