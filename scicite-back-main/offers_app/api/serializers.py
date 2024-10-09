from django.utils.timezone import now
from rest_framework import serializers

from cards_app.api.serializers import ArticleMetaSerializer, CardsSerializer
from offers_app.models import Evidence, Offers, OffersStatus
from profiles_app.api.serializers import UserSerializer
from profiles_app.models import Counter, Levels, UserAchievement


class BaseEvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evidence
        fields = (
            'id',
            'article',
            'created_at',
            'updated_at',
        )


class EvidenceSerializer(serializers.ModelSerializer):
    article = ArticleMetaSerializer()

    class Meta(BaseEvidenceSerializer.Meta):
        pass


class EvidenceCreateSerializer(serializers.ModelSerializer):
    class Meta(BaseEvidenceSerializer.Meta):
        pass


class OffersStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = OffersStatus
        fields = (
            'id',
            'code',
            'name',
            'description',
            'created_at',
            'updated_at',
        )


class BaseOffersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offers
        fields = (
            'id',
            'card',
            'perfomer',
            'deadline_at',
            'evidence',
            'status_executor',
            'barter_is',
            'status_customer',
            'barter',
            'barter_offer',
            'created_at',
            'updated_at',
            'offer_number',
        )


class OffersSerializer(BaseOffersSerializer):
    status_customer = OffersStatusSerializer()
    status_executor = OffersStatusSerializer()
    evidence = EvidenceSerializer()
    card = CardsSerializer()
    barter = CardsSerializer()
    barter_offer = CardsSerializer()
    perfomer = UserSerializer()

    class Meta(BaseOffersSerializer.Meta):
        read_only_fields = (
            'barter_is',
        )
        pass


class OffersUpdateSerializer(BaseOffersSerializer):

    class Meta(BaseOffersSerializer.Meta):
        pass

    
class OffersCreateSerializer(BaseOffersSerializer):

    class Meta(BaseOffersSerializer.Meta):
        pass

    def validate(self, data):
        # card = data['card']
        # perfomer = data['perfomer']
        # card_user = card.user

        # current_month_offers = Offers.objects.filter(
        #     created_at__month=now().month,
        #     perfomer=perfomer
        # ).count()

        # current_level = card_user.level
        # level_limit = current_level.limit

        # if current_month_offers >= level_limit:
        #     raise serializers.ValidationError({"error": True, "message": f"Превышено ограничение на количество откликов для уровня '{current_level.name}'."})

        # if card_user == perfomer:
        #     raise serializers.ValidationError({"error":True, "message":"Невозможно создать отклик к своей карточке."})

        return data
    
    def create(self, validated_data):
        return super().create(validated_data)
        # if card and Counter.objects.filter(user=card.user, count_get_offers=1).exists():
        #     achievement = UserAchievement.objects.get(user=card.user, achievement='first_offer').id
        #     data['achievement'] = achievement

        return validated_data
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data

