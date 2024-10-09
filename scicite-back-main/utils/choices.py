from django.db import models


class LevelsChoices(models.TextChoices):
	BEGINNER = "beginner", "Начинающий"
	ADVANCED = "advanced", "Продвинутый"
	EXPERIENCED = "experienced", "Опытный"
	PROFESSIONAL = "professional", "Профессионал"


class ThemeChoices(models.TextChoices):
	NATURAL_SCIENCES = "natural_sciences", "Естественные науки"
	TECHNICAL_SCIENCES = "technical_sciences", "Технические науки"
	MEDICAL_SCIENCES = "medical_sciences", "Медицинские науки"
	AGRICULTURAL_SCIENCES = "agricultural_sciences", "Сельскохозяйственные науки"
	SOCIAL_SCIENCES = "social_sciences", "Общественные (социальные) науки"
	HUMANITIES = "humanities", "Гуманитарные науки"


class TariffCoinsChoices(models.IntegerChoices):
	COINS_0 = 0, "0"
	COINS_300 = 300, "300"
	COINS_500 = 500, "500"
	COINS_100 = 100, "100"


class TariffPeriodChoices(models.IntegerChoices):
	PERIOD_0 = 0, "0"
	PERIOD_3 = 3, '3'
	PERIOD_6 = 6, '6'
	PERIOD_9 = 9, '9'
	PERIOD_12 = 12, '12'


class SupportStatusNameChoices(models.TextChoices):
	OPEN = "open", "Открыт"
	IN_PROGRESS = "in_progress", "В работе"
	RESOLVED = "resolved", "Решено"
	REJECTED = "rejected", "Отклонено"


class SupportStatusCodeChoices(models.IntegerChoices):
	OPEN = "10", "10"
	IN_PROGRESS = "20", "20"
	RESOLVED = "30", "30"
	REJECTED = "40", "40"


class SupportTypeChoices(models.TextChoices):
    DISPUTE = "спор", "Спор"
    REFUSAL = "отказ", "Отказ"
    WEBSITE_INFORMATION = "информация_на_сайте", "Информация на сайте"
    WEBSITE_ERROR = "ошибка_в_работе_сайта", "Ошибка в работе сайта"
    WEBSITE_SUGGESTIONS = "предложения_по_сайту", "Предложения по сайту"
    REGISTRATION_AUTHORIZATION = "регистрация_авторизация", "Регистрация/Авторизация"
    COOPERATION = "сотрудничество", "Сотрудничество"
    OTHER = "другое", "Другое"


class TransactionsBasisChoices(models.TextChoices):
	CREATED_CARD = "create_card", "Создание карточки" #
	CITATION_FORMAT = "citation_format", "Оформление цитирования"
	PUBLICATION_FORMAT = "publication_format", "Оформление публикации"
	ENROLLMENT_ADMIN = "enrollment_admin", "Зачисление Admin"
	ACHIEVEMENT = "achievement", "Получение достижения"
	START_BONUS = "start_bonus", "Стартовый бонус"
	CARD_UP = "card_up", "Продление карточке"


class TransactionsTypeChoices(models.TextChoices):
	PLUS = "plus", "Пополнение"
	MINUS = "minus", "Списание"


class AchievementChoices(models.TextChoices):
	REGISTRATION = 'registration', 'Регистрация'
	FIRST_CARD = 'first_card', 'Первая карточка'
	FIRST_RESPONSE = 'first_offer', 'Первый отклик'
	FIRST_QUOTE = 'first_quote', 'Первое цитирование'
	FIRST_PUBLICATION = 'first_publication', 'Первое публикация'