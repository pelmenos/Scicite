from django.conf import settings
from django.contrib.auth import password_validation
from django.contrib.auth.tokens import default_token_generator
from django.db import models
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from scicite_project_hpace.settings.base import APP_URL

from profiles_app.models import (Counter, Levels, Notification, Permission,
                                 Role, RolePermission, SettingsModel,
                                 Transacitons, User, UserAchievement)
from cards_app.models import Cards
from offers_app.models import Offers

from utils.email import EmailSender
from utils.statistic import get_user_statistic


#from profiles_app.api.users.views import UserStatisticView


class CounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Counter
        fields = ('count_created_cards', 'count_created_offers', 'count_get_offers', 'count_publication', 'count_citation', 'count_barters')


class UserStatisticSerializer(serializers.Serializer):
    citations_received = serializers.IntegerField()
    citations_formatted = serializers.IntegerField()
    successful_citations = serializers.CharField()
    scicoins_spent = serializers.IntegerField()
    scicoins_earned = serializers.IntegerField()
    exchanges_completed = serializers.IntegerField()
    card_create = serializers.IntegerField()


class UserLoginSerializer(serializers.Serializer):
    login = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(  
        required=True,
        allow_blank=False,
        write_only=True,
        validators=[UniqueValidator(queryset=User.objects.all())]  
    )

    def validate(self, data):
        login = data.get('login')
        password = data.get('password')

        if not login or not password:
            raise serializers.ValidationError("Неверный логин или пароль.")

        return data
    

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    email = serializers.EmailField(  
        required=True,
        allow_blank=False,
        write_only=True,
        validators=[UniqueValidator(queryset=User.objects.all())]  
    )

    class Meta:
        model = User
        fields = ['id', 'number_phone', 'login', 'password', 'password_confirm', 'email']
        extra_kwargs = {
            'full_name': {'required': False},
        }
       
    def __init__(self, *args, **kwargs):
        super(UserRegistrationSerializer, self).__init__(*args, **kwargs)
        
    def validate_password(self, value):
        password_validation.validate_password(value)
        return value

    def validate(self, data):
        password = data.get('password')
        password_confirm = data.get('password_confirm')

        if password != password_confirm:
            raise serializers.ValidationError("Пароли не совпадают")

        del data['password_confirm']

        return data

    def create(self, validated_data):
        
        password = validated_data.pop('password')
        validated_data['username'] = validated_data['login']

        return self.user_create(validated_data, password)

    def user_create(self, validated_data, password):
        user = super().create(validated_data)
        user.set_password(password)
        user.level = Levels.objects.order_by('limit').first()
        role_obj = Role.objects.get(name="client")
        settings = SettingsModel.objects.first()
        user.balance = settings.welcome_bonus
        user.roles = role_obj
        user.username = validated_data['login']
        user.save()
        self.send_verification_email(user)
        return user
    
    def send_verification_email(self, user):
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        verification_link = f"{APP_URL}/main?uid={uid}&token={token}"
        subject = 'Подтвердите ваш email'
        recipient_list = [user.email]

        html_message = render_to_string('mail/registration.html', {'link': verification_link})

        return EmailSender(
                settings.EMAIL_HOST, settings.EMAIL_PORT,
                settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD
            ).send_email(subject, recipient_list, html_message)

    
class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = (
            'id',
            'description',
            'code',
            'created_at',
            'updated_at',
        )


class RolePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolePermission
        fields = (
            'id',
            'role',
            'permission',
            'created_at',
            'updated_at',
        )


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = (
            'id',
            'name',
            'description',

        )


class LevelsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Levels
        fields = (
            'id',
            'name',
            'limit',
            'count_offers'
        )
        read_only_fields = (
            'name',
        )
        
    def create(self, validated_data):
        raise serializers.ValidationError("Создание новых уровней запрещено")

    def destroy(self, instance):
        raise serializers.ValidationError("Удаление уровней запрещено")
    

class UserSerializer(serializers.ModelSerializer):
    level = LevelsSerializer()
    roles = RoleSerializer()
    class Meta:
        model = User
        fields = (
            'id',
            'level',
            'balance',
            'login',
            'roles',
            'full_name',
            'created_at',
            'is_staff',
            'updated_at',
            'email',
            'number_phone'
        )
        extra_kwargs = {
            'full_name': {'required': False, 'allow_blank': True},
        }
        # read_only_fields = (
        #     'balance',
        #     'level',
        # ) # TODO

    def to_representation(self, instance):
        data = super().to_representation(instance)
        user = self.context['request'].user
        if user == instance:
            data['email'] = instance.email  
            data['number_phone'] = instance.number_phone

        return data
    
    def update(self, instance, validated_data):
        user = self.context['request'].user
        if user == instance:
            instance.email = validated_data.get('email', instance.email)
            instance.number_phone = validated_data.get('number_phone', instance.number_phone)
        instance.save()
        super().update(instance, validated_data)
        return instance


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')

        if new_password != confirm_password:
            raise serializers.ValidationError("New passwords do not match")

        return data
    

class DeactivateTokenSerializer(serializers.Serializer):
    refresh_token = serializers.CharField(required=True, help_text="Refresh token to deactivate")


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    confirm_new_password = serializers.CharField(write_only=True)


class UserAchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAchievement
        fields = '__all__'


class BaseTransactionsSerializer(serializers.ModelSerializer):
    user = serializers.CharField()
    sum = serializers.CharField()
    class Meta:
        model = Transacitons
        fields = (
            "id",
            "user",
            "sum",
            "balance",
            "type_transaction",
            "canceled_is",
            "basis_creation",
            "created_at",
            "source"
        )


class TransactionsSerializer(BaseTransactionsSerializer):
    user = UserSerializer()

    def to_representation(self, instance):
        from offers_app.api.serializers import OffersSerializer
        from cards_app.api.serializers import CardsSerializer

        representation = super().to_representation(instance)
        
        user_instance = instance.user

        representation['statistic'] = UserStatisticSerializer(get_user_statistic(user_instance)).data
        print(representation)
        if representation.get('source'):
            if representation['source'].get('card'):
                source_object = Cards.objects.filter(id=representation['source'].get('card'))
                representation['source_object'] = CardsSerializer(source_object, many=True, context={'request': self.context["request"]}).data
            elif representation['source'].get('offer'):
                source_object = Offers.objects.filter(id=representation['source'].get('offer'))
                representation['source_object'] = OffersSerializer(source_object, many=True, context={'request': self.context["request"]}).data

        return representation
    class Meta(BaseTransactionsSerializer.Meta):
        pass
    

class CreateTransactionsSerializer(BaseTransactionsSerializer):

    class Meta(BaseTransactionsSerializer.Meta):
        pass

    def validate_user(self, value):
        # Check if the provided value is a valid username
        try:
            user = User.objects.filter(username__iexact=value).first()
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid user login")
        
        return user



class SettingsModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SettingsModel
        fields = '__all__'

    def validate(self, data):
        model_fields = self.Meta.model._meta.fields

        if not data:
            raise serializers.ValidationError({"error": True})
        for field in model_fields:
            if isinstance(field, models.JSONField):
                field_name = field.name
                default_value = field.default
                new_value = data.get(field_name, {})

                if not self.validate_json_field(new_value, default_value):
                    raise serializers.ValidationError({field_name: 'Некорректные данные'})

        return data

    def validate_json_field(self, new_value, default_value):
        if isinstance(default_value, dict):
            for key, value in default_value.items():
                if key not in new_value or not isinstance(new_value[key], type(value)):
                    return False
        return True