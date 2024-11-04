from django.contrib.auth.models import AbstractUser
from django.db import models

from cards_app.models import Cards
from offers_app.models import Offers
from utils.choices import (AchievementChoices, LevelsChoices,
                           TransactionsBasisChoices, TransactionsTypeChoices)
from utils.models_abstract import BaseModel, ServiceModel
from .managers import CustomUserManager


class User(AbstractUser, BaseModel):
    level = models.ForeignKey(
        'profiles_app.levels',
        on_delete=models.CASCADE,
        null=True
    )
    balance = models.PositiveIntegerField(
        default=0,
        verbose_name="Баланс"
    )
    number_phone = models.CharField(
        max_length=15,
        unique=True,
        verbose_name="номером телефона"
    )
    login = models.CharField(
        max_length=32,
        unique=True,
        verbose_name="логином"
    )
    roles = models.ForeignKey(
        'profiles_app.Role',
        models.SET_NULL,
        null=True,
        verbose_name="Роли",
        blank=True
    )
    is_active = models.BooleanField(
        default=False
    )
    email = models.EmailField(
        unique=True
    )
    new_email = models.EmailField()
    first_name = None
    last_name = None

    full_name = models.CharField(
        max_length=60,
        verbose_name="Полное имя",
        null=True
    )

    objects = CustomUserManager()

    def __str__(self):
        return self.login

    def has_perm(self, perm):
        if self.is_staff:
            return True

        if not self.is_active:
            return False

        if self.roles in ['admin', 'maintainer']:
            return True
        
        return RolePermission.objects.filter(
            permission__description=perm, role=self.roles).exists() or True
    
    def save(self, *args, **kwargs):
        self.email = self.email.lower() if self.email else self.email
        self.number_phone = self.number_phone.lower() if self.number_phone else self.number_phone
        self.login = self.login.lower() if self.login else self.login
        self.full_name = self.full_name.lower() if self.full_name else self.full_name
        super(User, self).save(*args, **kwargs)


class Levels(ServiceModel):
    name = models.TextField(
        verbose_name="Название уровня",
    )
    limit = models.PositiveIntegerField(
        default=0,
        verbose_name="Доступное количество откликов на цитирование за месяц"
    )
    count_offers = models.IntegerField(
        default=0,
        verbose_name="Кол-во публикаций для перехода на следующий уровень"
    )

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'levels'
        verbose_name = "Уровень аккаунта пользователя"
        verbose_name_plural = "Уровни аккаунта пользователя"
        ordering = ['name']

    @classmethod
    def custom_order(cls):
        custom_order_list = ['beginner', 'advanced', 'experienced', 'professional']
        return sorted(cls.objects.all(), key=lambda x: custom_order_list.index(x.name))


class Role(ServiceModel):
    name = models.TextField(
        verbose_name="Название роли"
    )
    description = models.CharField(
        max_length=256,
        verbose_name="Описание роли"
    )

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'role'
        verbose_name = "Роль"
        verbose_name_plural = "Роли"


class RolePermission(ServiceModel):
    role = models.ForeignKey(
        "profiles_app.role",
        models.CASCADE,
        verbose_name="Роль"
    )
    permission = models.ForeignKey(
        "profiles_app.permission",
        models.CASCADE,
        verbose_name="Роль"
    )

    class Meta:
        db_table = 'role_permission'
        verbose_name = "Роль-Право"
        verbose_name_plural = "Роли-Права"


class Permission(ServiceModel):

    description = models.CharField(
        max_length=256,
        verbose_name="Описание"
    )
    code = models.TextField(
        default=0,
        verbose_name="Код"
    )

    def __str__(self):
        return self.description

    class Meta:
        db_table = 'permission'
        verbose_name = "Право"
        verbose_name_plural = "Права"


class Notification(BaseModel):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="Пользователь"
    )
    message = models.TextField(
        verbose_name="Сообщение"
    )
    object_id = models.UUIDField(
        verbose_name="ИД объекта",
        null=True
    )
    is_read = models.BooleanField(
        default=False,
        verbose_name="Прочитано"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Удаленая запись"
    )
    link = models.TextField(
        null=True
    )

    def save(self, *args, **kwargs):
        if not self.link:
            self.link = None
            if self.object_id:
                if Cards.objects.filter(id=self.object_id).exists():
                    self.link = '/mycards'
                if Offers.objects.filter(id=self.object_id).exists():
                    self.link = '/responses'
        super().save(*args, **kwargs)

    class Meta:
        db_table = "notifications"
        verbose_name = "Уведомление"
        verbose_name_plural = "Уведомления"


class Transacitons(BaseModel):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="Пользователь"
    )
    sum = models.IntegerField(
        default=0,
        verbose_name="Сумма"
    )
    balance = models.IntegerField(
        default=0,
        verbose_name="Установленный баланс"
    )
    type_transaction = models.TextField(
        default="plus",
        choices=TransactionsTypeChoices.choices
    )
    canceled_is = models.BooleanField(
        default=False,
        verbose_name="Отмена транзакции"
    )
    basis_creation = models.TextField(
        choices=TransactionsBasisChoices.choices
    )
    source = models.JSONField(
        default={}
    )

class UserAchievement(BaseModel):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="Пользователь"
    )
    achievement = models.CharField(
        max_length=20,
        choices=AchievementChoices.choices,
        verbose_name="Достижение"
    )

    def __str__(self):
        return f"{self.user} - {self.get_achievement_display()}"

    class Meta:
        db_table = 'user_achievements'
        verbose_name = "Достижение пользователя"
        verbose_name_plural = "Достижения пользователей"
        unique_together = ('user', 'achievement')


class Counter(BaseModel):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="Пользователь"
    )
    count_created_cards = models.IntegerField(
        default=0,
        verbose_name="Кол-во созданных карточек"
    )
    count_created_offers = models.IntegerField(
        default=0,
        verbose_name="Кол-во созданных откликов"
    )
    count_get_offers = models.IntegerField(
        default=0,
        verbose_name="Кол-во полученных откликов"
    )
    count_publication = models.IntegerField(
        default=0,
        verbose_name="Кол-во публикаций"
    )
    count_citation = models.IntegerField(
        default=0,
        verbose_name="Кол-во цитат"
    )
    count_created_citation = models.IntegerField(
        default=0,
        verbose_name="Кол-во созданных цитат"
    )
    count_barters = models.IntegerField(
        default=0,
        verbose_name="Кол-во бартеров"
    )
    count_reject = models.IntegerField(
        default=0,
        verbose_name="Кол-во отказов полученных"
    )
    count_created_barters = models.IntegerField(
        default=0,
        verbose_name="Кол-во бартеров созданных"
    )
    class Meta:
        db_table = 'user_counter'
        verbose_name = "Счетчик пользователя"
        verbose_name_plural = "Счетчики пользвоателей"


class SettingsModel(models.Model):
    welcome_bonus = models.IntegerField(
        default=0,
        verbose_name="Приветственный бонус"
    )
    price_publication = models.JSONField(
        default={
            "ринц":40,
            "вак":80,
            "scopus/wos":160
        },
        verbose_name="Стоимость публикации"
    )
    discount = models.JSONField(
        default={
            "enabled":True,
            'month':6,
            "percent":20
        },
        verbose_name="Скидка на публикацию"
    )
    price_citation = models.JSONField(
        default={
            "ринц":50,
            "вак":100,
            "scopus/wos":200
        },
        verbose_name="Оплата цитирования"
    )
    scicoins = models.JSONField(
        default={
            "price":2,
            "discount":1000,
            "percent":20
        },
        verbose_name="Scicoins"
    )
    minimal_duration_card = models.IntegerField(
        default=3,
        verbose_name="Мин. длит. карточки"
    )
    free_card = models.JSONField(
        default={
            "enabled":True,
            "duration":6
        }
    )
    class Meta:
        db_table = 'settings'

try:
    SettingsModel.objects.get_or_create(id=1)
except Exception:
    pass

