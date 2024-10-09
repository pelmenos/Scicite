
from cards_app.models import Category
from offers_app import models
from profiles_app.models import Levels
from support_app.models import SupportType

arr = [
  ["Отказ", "Refusal"],
  ["Информация на сайте", "Website Information"],
  ["Ошибка в работе сайта", "Website Malfunction"],
  ["Предложения по сайту", "Website Suggestions"],
  ["Регистрация/Авторизация", "Registration/Authorization"],
  ["Сотрудничество", "Cooperation"],
  ["Другое", "Other"],
  ["спор", "Dispute"],
  ["связь", "Communication"],
]



model = SupportType
field_name = "name"

for i in arr:
    for x in model.objects.all():
        if x.__dict__['name'] == i[0]:
            data = {
                f"{field_name}":i[0],
                f"{field_name}_ru":i[0],
                f"{field_name}_en":i[1],
            }
            model.objects.filter(
                id=x.id
            ).update(
                **data
            )


# from profiles_app.models import Notification

# for x in Notification.objects.all():
#     Notification.objects.filter(
#         id=x.id
#     ).update(
#         message=x.__dict__['message'],
#         message_ru=x.__dict__['message'],
#         message_en=x.__dict__['message'],
#     )