import re

from rest_framework import serializers


class PasswordValidator:
    def __init__(self, min_length=8, max_length=14):
        self.min_length = min_length
        self.max_length = max_length
        self.regex = re.compile(r'^[A-Za-z0-9а-яА-ЯёЁ!@#$%^&*()_+{}\[\]:;<>,.?~\\]+$')

    def __call__(self, value):
        if len(value) < self.min_length or len(value) > self.max_length:
            raise serializers.ValidationError(f'Пароль должен быть от {self.min_length} до {self.max_length} символов.')

        if not re.search(r'[a-zа-я]', value):
            raise serializers.ValidationError('Пароль должен содержать строчные буквы.')

        if not re.search(r'[A-ZА-Я]', value):
            raise serializers.ValidationError('Пароль должен содержать заглавные буквы.')

        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError('Пароль должен содержать цифры.')

        if not self.regex.match(value):
            raise serializers.ValidationError('Пароль может содержать только латинские и кириллические буквы, арабские цифры (0-9) и специальные символы.')

        return value
