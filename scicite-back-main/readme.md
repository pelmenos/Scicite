# SCICITE-PROJECT

## Установка

#### 1. Install Python
Установите ```python-3.10``` и ```python-pip```. Следуйте инструкциям в документе по ссылке ниже, в зависимости от вашей операционной системы.
[https://docs.python-guide.org/starting/installation/](https://docs.python-guide.org/starting/installation/)

#### 2. Склонируйте репозиторий:

```bash
git clone https://gitlab.com/fomch/scicite-project-hpace-current
```

#### 3. Создайте виртуальное окружение

```bash
python -m venv venv
source venv/bin/activate
```

#### 4. Установите зависимостей
```bash
pip install -r requirements.txt
```

#### 5. Создайте .env файл
```bash
vim scicite_project_hpace/settings/.env

DB_NAME=scicite
DB_USER=<user>
DB_PASSWORD=<password>
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=<secret_key>
DEBUG=False

STATIC_URL=/static/
MEDIA_URL=/media/

# save file
```

#### 6. Примените миграции
```bash
python manage.py migrate
```

#### 7. Загрузите fixtures
```bash
python manage.py loaddata profiles_app/fixtures.json
python manage.py loaddata support_app/fixtures.json
python manage.py loaddata cards_app/fixtures.json
```

#### 8. Запустите проект
```bash
python manage.py runserver
```
