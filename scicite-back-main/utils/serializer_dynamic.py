from rest_framework import serializers


class DynamicFieldsSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def validate_email(self, value):
        existing_user = User.objects.filter(email__iexact=value).exclude(id=self.instance.id).first()
        if existing_user:
            raise serializers.ValidationError("Пользователь с таким адресом электронной почты уже существует.")
        return value