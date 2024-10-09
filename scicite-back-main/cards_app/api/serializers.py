from rest_framework import serializers

from cards_app.models import (ArticleMeta, Authors, Cards, Category, Keywords,
                              RequiredBase, Tariff, Theme)
from offers_app.models import Offers
from profiles_app.api.serializers import UserSerializer
from profiles_app.models import Counter, UserAchievement


class AuthorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Authors
        fields = (
            'id',
            'name',
        )

class KeywordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keywords
        fields = (
            'id',
            'name',
        )

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            'id',
            'name',
        )

class RequiredBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequiredBase
        fields = (
            'id',
            'name',
        )

class TariffSerializer(serializers.ModelSerializer):
    scicoins = serializers.IntegerField()
    period = serializers.IntegerField()

    class Meta:
        model = Tariff
        fields = (
            'id',
            'scicoins',
            'period',
        )

class BaseArticleMeta(serializers.ModelSerializer):
    class Meta:
        model = ArticleMeta
        fields = (
            'id',
            'doi',
            'title',
            'abstract',
            'file',
            'file_publication',
            'citation_url',
            'journal_name',
            'authors',
            'publication_year',
            'volume',
            'page_numbers',
            'keywords',
        )


class ArticleMetaSerializer(BaseArticleMeta):
    keywords = KeywordsSerializer(many=True, read_only=True)#, source='keywords_set')
    authors = AuthorsSerializer(many=True, read_only=True)
    class Meta(BaseArticleMeta.Meta):
        pass


class ArticleMetaCardCreateSerializer(BaseArticleMeta):
#       keywords = serializers.ListField(child=serializers.IntegerField())
#    authors = AuthorsSerializer(many=True, allow_empty=True)
    class Meta(BaseArticleMeta.Meta):
        pass


class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = (
            'id',
            'name',
        )


class BaseCardsSerializer(serializers.ModelSerializer):
    offers_count = serializers.SerializerMethodField()

    class Meta:
        model = Cards
        fields = (
            'id',
            'user',
            'base',
            'tariff',
            'article',
            'is_exchangable',
            'is_active',
            'theme',
            'category',
            'offers_count',
            'cart_number',
        )
        read_only_fields = ('cart_number',)
    def get_offers_count(self, obj):
        return Offers.objects.filter(card=obj).count()


class CardsSerializer(BaseCardsSerializer):
    article = ArticleMetaSerializer()    
    tariff = TariffSerializer()
    base = RequiredBaseSerializer()
    user = UserSerializer()
    category = CategorySerializer(many=True)
    class Meta(BaseCardsSerializer.Meta):
        fields = BaseCardsSerializer.Meta.fields + ('created_at', 'updated_at')


class CardsCreateSerializer(BaseCardsSerializer):
    class Meta(BaseCardsSerializer.Meta):
        pass

    def create(self, validated_data):
        instance = super().create(validated_data)
        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data