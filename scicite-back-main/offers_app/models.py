import random

from django.core.exceptions import ValidationError
from django.db import models

from utils.models_abstract import BaseModel


class Offers(BaseModel):
    card = models.ForeignKey(
        'cards_app.cards',
        models.CASCADE,
        verbose_name="Карточки",
        related_name='card'
    )
    status_executor = models.ForeignKey(
        'offers_app.offersstatus',
        models.CASCADE,
        related_name="status_executor",
        null=True
    )
    status_customer = models.ForeignKey(
        'offers_app.offersstatus',
        models.CASCADE,
        related_name="status_customer",
        null=True
    )
    perfomer = models.ForeignKey(
        'profiles_app.user',
        models.CASCADE,
        verbose_name="Пользователь"
    )
    deadline_at = models.DateTimeField(
        null=True
    )
    evidence = models.ForeignKey(
        'offers_app.evidence',
        models.CASCADE,
        null=True
    )
    barter_is = models.BooleanField(
        default=False
    )
    barter = models.ForeignKey(
        'cards_app.cards',
        models.CASCADE,
        null=True,
        related_name='card_barter'
    )
    barter_offer = models.ForeignKey(
        'offers_app.offers',
        models.CASCADE,
        null=True,
        related_name='offer_barter'
    )
    offer_number = models.IntegerField(
        null=True
        )

    def save(self, *args, **kwargs):
        if not self.offer_number:
            self.offer_number = self.generate_unique_offer_number()
        super().save(*args, **kwargs)

    def generate_unique_offer_number(self):
        while True:
            offer_number = random.randint(10000000, 99999999)
            if not Offers.objects.filter(offer_number=offer_number).exists():
                return offer_number

    def clean(self):
        if (self.status_executor and self.status_executor.code < self.status_customer.code):
            raise ValidationError("Status Executor cannot be lower than Status Customer")

    class Meta:
        db_table = 'offers'
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"


class OffersStatus(BaseModel):
    CODE_CHOICES = [
        (1, 'отклик'),
        (2, 'цитирование'),
        (3, 'ожидание'),
        (4, 'публикация'),
        (5, 'откат'),
    ]
    code = models.IntegerField(
        "Код статуса",
        default=0,
        choices=CODE_CHOICES
    )
    name = models.TextField(
        "Название статуса",
    )
    description = models.TextField(
        "Название статуса",
    )

    class Meta:
        db_table = 'offers_status'
        verbose_name = "Статус заказа"
        verbose_name_plural = "Статусы заказа"


class Evidence(BaseModel):
    article = models.ForeignKey(
        'cards_app.articlemeta',
        models.CASCADE,
        verbose_name="Описание статьи"
    )

    class Meta:
        db_table = 'evidence'
        verbose_name = "Доказательство"
        verbose_name_plural = "Доказательства"


