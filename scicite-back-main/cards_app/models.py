import random
import uuid
from pathlib import Path

from django.core.exceptions import ValidationError
from django.db import models

from utils.choices import TariffCoinsChoices, TariffPeriodChoices, ThemeChoices
from utils.models_abstract import BaseModel, ServiceModel


def get_upload_to(instance, filename):
    ext = Path(filename).suffix
    safe_filename = f"{uuid.uuid4()}{ext}"
    return safe_filename


def validate_pdf_extension(value):
    if not value.name.endswith('.pdf'):
        raise ValidationError('Файл должен быть в формате PDF')


def validate_file_size(value):
    limit = 20 * 1024 * 1024 
    if value.size > limit:
        raise ValidationError('File size must be no more than 20 MB.')


class Cards(BaseModel):
    user = models.ForeignKey(
        'profiles_app.user',
        models.CASCADE,
        verbose_name='Пользователь'
    )
    base = models.ForeignKey(
        'cards_app.requiredbase',
        models.CASCADE,
        verbose_name='Публикационная база для индексирования',
        null=True
    )
    tariff = models.ForeignKey(
        'cards_app.tariff',
        models.CASCADE,
        verbose_name='Тарифный план'
    )
    article = models.ForeignKey(
        'cards_app.articlemeta',
        models.CASCADE,
        verbose_name='Описание статьи'
    )
    is_exchangable = models.BooleanField(
        default=False,
        verbose_name='Обмен статьи'
    )
    is_active = models.BooleanField(
        default=False,
        verbose_name='Архив'
    )
    theme = models.TextField(
        verbose_name='Название'
    )
    category = models.ManyToManyField(
        'cards_app.category',
        verbose_name='Категория',
        null=True
    )
    cart_number = models.IntegerField(
        null=True
        )
    created_at = models.DateTimeField(auto_now_add=True)
    def save(self, *args, **kwargs):
        if not self.cart_number:
            self.cart_number = self.generate_unique_cart_number()
        super().save(*args, **kwargs)

    def generate_unique_cart_number(self):
        while True:
            cart_number = random.randint(10000000, 99999999)
            if not Cards.objects.filter(cart_number=cart_number).exists():
                return cart_number

    class Meta:
        db_table = 'cards'
        verbose_name = 'Карточка'
        verbose_name_plural = 'Карточки'


class Category(BaseModel):
    name = models.CharField(
        max_length=256,
        verbose_name='Название'
    )

    class Meta:
        db_table = 'category'
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'


class RequiredBase(BaseModel):
    name = models.CharField(
        max_length=256,
        verbose_name="Название"
    )

    class Meta:
        db_table = 'required_base'
        verbose_name = "Публикационная база для индексирования"
        verbose_name_plural = "Публикационные базы для индексирования"


class Tariff(ServiceModel):
    scicoins = models.IntegerField(
        "Кол-во для оплаты тарифа",
        choices=TariffCoinsChoices.choices
    )
    period = models.IntegerField(
        "Кол-во мес",
        null=True,
        choices=TariffPeriodChoices.choices
    )

    def __str__(self):
        return f"Месяцев: {self.period} - оплата: {self.scicoins}"

    class Meta:
        db_table = 'tariff'
        verbose_name = "Тарифы"
        verbose_name_plural = "Тарифы"


class Authors(BaseModel):
    name = models.CharField(
         max_length=100, 
         verbose_name="Имя автора",
         null=True,
    )
    class Meta:
        db_table = "authors"


class Keywords(models.Model):
    name = models.CharField(
         max_length=50, verbose_name="Ключевое слово",
         null=True,
    )
    class Meta:
        db_table = "keywords"


class ArticleMetaBase(BaseModel):
    doi = models.TextField(
        unique=True,
        verbose_name="DOI",
        null=True
    )
    title = models.TextField(
        verbose_name="Название",
        null=True
    )
    abstract = models.TextField(
        verbose_name="Анотация",
        null=True
    )
    file = models.FileField(
        verbose_name="Файл цитирования",
        upload_to=get_upload_to,
        validators=[validate_pdf_extension, validate_file_size],
        null=True
    )
    file_publication = models.FileField(
        verbose_name="Файл публикации",
        upload_to=get_upload_to,
        validators=[validate_pdf_extension, validate_file_size],
        null=True
    )
    citation_url = models.TextField(
        verbose_name="Данные для цитирования",
        null=True
    )
    journal_name = models.TextField(
        verbose_name="Название журнала",
        null=True
    )
    authors = models.ManyToManyField(
        Authors, 
        verbose_name="Авторы", 
        blank=True
    )
    publication_year = models.IntegerField(
        verbose_name="Год",
        null=True
    )
    volume = models.IntegerField(
        verbose_name="Том",
        null=True
    )
    page_numbers = models.CharField(
        verbose_name="Страница",
        max_length=20,
        null=True
    )
    keywords = models.ManyToManyField(
        Keywords, 
        verbose_name="Ключевые слова", 
        blank=True
    )
    # def save(self, *args, **kwargs):
    #     if not self.doi:
    #         transliterated_title = unidecode(self.title)
    #         doi = f"{slugify(transliterated_title)}-{timezone.now().strftime('%Y%m%d%H%M%S')}"
    #         self.doi = doi
    #     super().save(*args, **kwargs)

    class Meta:
        abstract = True


class ArticleMeta(ArticleMetaBase):
    class Meta:
        db_table = 'article_meta'
        verbose_name = "Прямое описание статьи"
        verbose_name_plural = "Прямые описания статьи"


class Theme(BaseModel):
    name = models.TextField(
        verbose_name="Название",
    )

    class Meta:
        db_table = 'theme'
        verbose_name = "Область науки"
        verbose_name_plural = "Области науки"
