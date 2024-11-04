import os
from datetime import timedelta
from pathlib import Path

from decouple import config
from django.utils.translation import gettext_lazy as _

BASE_DIR = Path(__file__).resolve().parent.parent.parent
EMAILS_XLS_PATH = os.path.join(BASE_DIR, 'profiles_app', 'emails.xlsx')

SECRET_KEY = config('SECRET_KEY')

DEBUG = config('DEBUG', default='False')

ALLOWED_HOSTS = [
    "*"
]

APP_URL = config('APP_URL', 'http://localhost')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'modeltranslation',

    'corsheaders',

    'rest_framework',
    'rest_framework.authtoken',
    'drf_yasg',

    'celery',
    'django_celery_beat',
    'django_celery_results',

    'cards_app',
    'offers_app',
    'profiles_app',
    'support_app',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 40,
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.MultiPartParser'
    ],
    'PAGE_NUMBER_PAGINATION': {
        'PAGE_SIZE': 40,
        'ORDERING_PARAM': '-created_at', 
    }
}
CELERY_ALWAYS_EAGER = True
CELERY_BROKER_URL = 'redis://localhost:6379/0'  
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'

CELERY_BEAT_SCHEDULE = {
    'delete_inactive_users': {
        'task': 'delete_inactive_users',
        'schedule': 60, 
    },
    'set_inactive_if_expired': {
        'task': 'set_inactive_if_expired',
        'schedule': 60, 
    },
}

CELERYBEAT_SCHEDULER = 'django_celery_beat.schedulers.DatabaseScheduler'

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
    'SLIDING_TOKEN_LIFETIME': timedelta(days=30),
    'SLIDING_TOKEN_REFRESH_AFTER_LIFETIME': timedelta(days=7),
}

ROOT_URLCONF = 'scicite_project_hpace.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, "templates")],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'scicite_project_hpace.wsgi.application'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTH_USER_MODEL = 'profiles_app.User'

LANGUAGE_CODE = 'ru-RU'
LANGUAGES = [
    ('ru', _('Russian')),
    ('en', _('English')),
]
MODELTRANSLATION_DEFAULT_LANGUAGE = 'ru'

LOCALE_PATHS = [
    os.path.join(BASE_DIR, 'locale'),
]

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_L10N = True

USE_TZ = True


APPEND_SLASH = False


LOG_DIR = os.path.join(BASE_DIR, 'logs')
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

LOGGING_DIR = os.path.join(BASE_DIR, 'logs')
if not os.path.exists(LOGGING_DIR):
    os.makedirs(LOGGING_DIR)

LOGGING_LEVEL = 'INFO'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': LOGGING_LEVEL,
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(LOGGING_DIR, 'app.log'),
            'maxBytes': 10 * 1024 * 1024,  
            'backupCount': 10, 
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['file'],
        'level': LOGGING_LEVEL,
    },
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# DATABASES = {
#    'default': {
#        'ENGINE': 'django.db.backends.sqlite3',
#        'NAME': BASE_DIR / "db.sqlite3",
#        'TEST': {
#            'ENGINE': 'django.db.backends.sqlite3',
#            'NAME': BASE_DIR / "test_db.sqlite3"
#        }
#
#    }
# }

STATIC_URL = config('STATIC_URL', default='/static/')
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = config('MEDIA_URL', default='/media/')
MEDIA_ROOT = os.path.join(BASE_DIR, 'mediafiles')


SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'Bearer Token': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header',
        },
        'Basic Authentication': {
            'type': 'basic',
        },
    },
}


EMAIL_HOST = config('EMAIL_HOST')
EMAIL_PORT = config('EMAIL_PORT')
EMAIL_HOST_USER = config('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True


PRICE_ACHIEVEMENT_REGISTRATION = 50
PRICE_ACHIEVEMENT_FIRST_CARD = 50
PRICE_ACHIEVEMENT_FIRST_RESPONSE = 50
PRICE_ACHIEVEMENT_FIRST_QUOTE = 50
PRICE_ACHIEVEMENT_FIRST_PUBLICATION = 50

