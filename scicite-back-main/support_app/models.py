import random

from django.db import models

from utils.choices import (SupportStatusCodeChoices, SupportStatusNameChoices,
                           SupportTypeChoices)
from utils.models_abstract import BaseModel, ServiceModel


class Support(BaseModel):
    offer = models.ForeignKey(
        'offers_app.offers',
        models.CASCADE,
        verbose_name='Заказ',
        null=True
    )
    declarer = models.ForeignKey(
        'profiles_app.user',
        models.CASCADE,
        related_name="declarer_user",
        verbose_name='Заявитель'
    )
    reporter = models.ForeignKey(
        'profiles_app.user',
        models.CASCADE,
        related_name="reporter_user",
        verbose_name="Сотрудник",
        null=True
    )
    status = models.ForeignKey(
        'support_app.supportstatus',
        models.CASCADE,
        verbose_name="Статус"
    )
    narrative = models.TextField(
        verbose_name="Запрос"
    )
    response = models.TextField(
        verbose_name="Ответ",
        null=True
    )
    type_support = models.ForeignKey(
        "support_app.supporttype",
        models.CASCADE,
        db_column="type",
        verbose_name="Тип поддержки"
    )
    support_number = models.IntegerField(
        null=True
    )
    def save(self, *args, **kwargs):
        if not self.support_number:
            self.support_number = self.generate_unique_support_number()
        super().save(*args, **kwargs)

    def generate_unique_support_number(self):
        while True:
            support_number = random.randint(10000000, 99999999)
            if not Support.objects.filter(support_number=support_number).exists():
                return support_number
    class Meta:
        db_table = 'support'
        verbose_name = "Обращение в ТП"
        verbose_name_plural = "Обращения в ТП"


class SupportType(ServiceModel):
    name = models.TextField(
        verbose_name="Назание типа",
    )
    description = models.TextField(
        verbose_name="Описание типа"
    )

    class Meta:
        db_table = 'support_type'
        verbose_name = "Тип обращения в ТП"
        verbose_name_plural = "Типы обращения в ТП"


class SupportStatus(ServiceModel):
    code = models.IntegerField(
        "Код статуса",
        default=0,
        choices=SupportStatusCodeChoices.choices
    )
    name = models.TextField(
        "Название статуса",
        choices=SupportStatusNameChoices.choices
    )
    description = models.TextField(
        "Описание статуса",
    )

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'support_status'
        verbose_name = "Статус обращения в ТП"
        verbose_name_plural = "Статусы обращения в ТП"
