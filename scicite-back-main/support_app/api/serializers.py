from rest_framework import serializers

from offers_app.api.serializers import OffersSerializer
from profiles_app.api.serializers import (CounterSerializer, UserSerializer,
                                          UserStatisticSerializer)
from profiles_app.api.users.views import UserStatisticView
from profiles_app.models import Counter
from support_app.models import Support, SupportStatus, SupportType


class SupportTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportType
        fields = ('id', 'name', 'description')


class SupportStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportStatus
        fields = ('id', 'code', 'name', 'description')


class BaseSupportSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Support
        fields = (
            'id',
            'offer',
            'declarer',
            'reporter',
            'status',
            'narrative',
            'response',
            'type_support',
            'support_number',
            'created_at',
        )


class SupportSerializer(BaseSupportSerializer):
    offer = OffersSerializer()
    declarer = UserSerializer()
    reporter = UserSerializer()
    status = SupportStatusSerializer()
    type_support = SupportTypeSerializer()

    class Meta(BaseSupportSerializer.Meta):
        pass

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        declarer_user_instance = instance.declarer
        declarer_user_reporter = instance.reporter

        representation['declarer']['statistic'] = UserStatisticSerializer(UserStatisticView().get_user_statistic(declarer_user_instance)).data
        if declarer_user_reporter:
            representation['reporter']['statistic'] = UserStatisticSerializer(UserStatisticView().get_user_statistic(declarer_user_reporter)).data

        return representation


class SupportCreateSerializer(BaseSupportSerializer):
    class Meta(BaseSupportSerializer.Meta):
        pass


class AdminSupportSerializer(serializers.ModelSerializer):
    declarer_user = UserSerializer(source='declarer', read_only=True)
    reporter_user = UserSerializer(source='reporter', read_only=True)
    declarer_cards_count = serializers.SerializerMethodField()
    total_supports_with_declarer = serializers.SerializerMethodField()
    counter = CounterSerializer(source='declarer.counter', read_only=True)
    status = SupportStatusSerializer()
    type_support = SupportTypeSerializer()

    class Meta:
        model = Support
        fields = (
            'id', 
            'declarer_user', 
            'reporter_user', 
            'status', 
            'narrative', 
            'response', 
            'type_support', 
            'support_number', 
            'created_at', 
            'declarer_cards_count', 
            'total_supports_with_declarer', 
            'counter'
            )

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        declarer_user_instance = instance.declarer

        representation['declarer_user']['statistic'] = UserStatisticSerializer(UserStatisticView().get_user_statistic(declarer_user_instance)).data

        return representation

    def get_declarer_cards_count(self, support):
        counter = Counter.objects.filter(user=support.declarer).first()
        if not counter:
            return 0
        return counter.count_created_cards

    def get_total_supports_with_declarer(self, support):
        return Support.objects.filter(declarer=support.declarer).count()