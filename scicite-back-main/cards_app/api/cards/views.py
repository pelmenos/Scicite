from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import filters, status, viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from cards_app.api.serializers import CardsCreateSerializer, CardsSerializer
from cards_app.models import Cards, Tariff
from mixin.response import ResponseHandlerMixin
from offers_app.api.serializers import OffersSerializer
from offers_app.models import Offers
from profiles_app.models import Counter, SettingsModel, UserAchievement
from utils.achievements import create_achievement
from utils.custom_permissions import CustomPermission
from utils.payment import create_payment


class CardsViewSet(ResponseHandlerMixin, viewsets.ModelViewSet):
    lookup_field = 'id'
    queryset = Cards.objects.all()
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = {
        'user': ['exact'],
        'base': ['in'],
        'tariff': ['in'],
        'article': ['exact'],
        'article__title': ['exact'],
        'article__keywords__name': ['exact'],
        'category__name': ['exact'],
        'is_exchangable': ['exact'],
        'is_active': ['exact'],
        'theme': ['exact'],
        'category': ['exact'],
    }
    ordering_fields = '__all__'
    search_fields = ['article__title']
    ordering = ['-id']
    pagination_class = PageNumberPagination
    authentication_classes = [JWTAuthentication]
    permission_classes = [CustomPermission]

    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT', 'PATCH']:
            return CardsCreateSerializer
        else:
            return CardsSerializer
        
    def get_object(self):
        if 'pk' not in self.kwargs:
            return super().get_object()
        return self.queryset.get(pk=self.kwargs['pk'])
    

    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter('search', openapi.IN_QUERY, description='Search term', type=openapi.TYPE_STRING),
    ])
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        search_query = request.GET.get('search')

        combined_q = Q()

        if search_query:
            search_terms = search_query.split()

            keywords_queries = [Q(article__keywords__name__icontains=term) for term in search_terms]
            theme_queries = [Q(theme__icontains=term) for term in search_terms]
            cart_number_queries = [Q(cart_number__icontains=term) for term in search_terms]

            title_q = Q()
            category_q = Q()
            cart_number_q = Q()

            for query in keywords_queries:
                title_q |= query

            for query in theme_queries:
                category_q |= query

            for query in cart_number_queries:
                cart_number_q |= query

            combined_q = title_q | category_q | cart_number_q

        queryset = queryset.filter(combined_q).order_by('-created_at').distinct()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return self.success_response(serializer.data)

    def create(self, request, *args, **kwargs):        
        serializer = self.get_serializer(data=request.data)
        settings = SettingsModel.objects.first()
        if serializer.is_valid(raise_exception=True):
            validated_data = serializer.validated_data
            tariff = validated_data['tariff']
            tariff_period = validated_data['tariff'].period
            user = validated_data['user']
            base = validated_data['base']
            base_name = base.__dict__['name'].lower()
            price = 0
            price_publication = settings.price_publication
            discount = settings.discount
            if tariff_period != 0:
                if base_name == 'ринц':
                    price = price_publication['ринц']
                elif base_name in ['web of science', 'scopus']:
                    price = price_publication['scopus/wos']
                else:
                    price = price_publication['вак']
                if tariff_period >= discount['month']:
                    price -= price*discount['percent']/100
                price *= tariff_period // 3 or 1

            else:
                price = 0

            transaction = create_payment(user, price, 'CREATED_CARD')
            
            if not transaction:
                validated_data['article'].delete()
                return self.error_response(f"Недостаточно scicoins")
            instance = serializer.save()

            transaction.source = {'card':str(instance.id)}
            transaction.save()
            
            data_dict = dict(serializer.data)

            if Counter.objects.filter(user=user, count_created_cards=1).exists():
                achievement = UserAchievement.objects.get(user=user, achievement='first_card')
                data_dict["achievement"] = achievement.id
            
            return self.success_response(
                data_dict, status_code=status.HTTP_201_CREATED)
        return self.error_response(serializer.errors)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.success_response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            validated_data = serializer.validated_data
            tariff = validated_data.get('tariff')
            if tariff:
                new_period = tariff.period - instance.tariff.period
                base_name = instance.base.__dict__['name'].lower()
                settings = SettingsModel.objects.first()
                price_publication = settings.price_publication
                discount = settings.discount
                if base_name == 'ринц':
                    price = price_publication['ринц']
                elif base_name in ['web of science', 'scopus']:
                    price = price_publication['scopus/wos']
                else:
                    price = price_publication['вак']
                if new_period >= discount['month']:
                    price -= price*discount['percent']/100
                price *= new_period // 3 or 1
                user = instance.user
                if tariff:
                    transaction = create_payment(user, price, 'card_up')
                    if not transaction:
                        return self.error_response("Не хватает scioins")
                instance.tariff = Tariff.objects.filter(period=new_period).last()
                instance.save()
            serializer.save()
            return self.success_response(serializer.data)
        return self.error_response(serializer.errors)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        offers_with_blocked_status = Offers.objects.filter(
            card=instance,
            status_executor__code__in=[2, 4]
        ).exists()

        if offers_with_blocked_status:
            return self.error_response(
                {'detail': 'Cannot delete card with blocked offer status.'},
                status_code=status.HTTP_400_BAD_REQUEST
            )

        self.perform_destroy(instance)
        return self.success_response()


class BarterCardViewSet(ResponseHandlerMixin, APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_card_id': openapi.Schema(type=openapi.TYPE_STRING, description='ID of the user\'s card to exchange'),
                'other_user_card_id': openapi.Schema(type=openapi.TYPE_STRING, description='ID of the other user\'s card to exchange'),
            }
        ),
        responses={201: 'Created', 403: 'Permission Denied', 404: 'Not Found'},
    )
    def post(self, request, format=None):
        user = request.user
        user_card_id = request.data.get('user_card_id')
        other_user_card_id = request.data.get('other_user_card_id')
        
        try:
            user_card = Cards.objects.get(id=user_card_id)
            other_user_card = Cards.objects.get(id=other_user_card_id)
            
            if user != user_card.user:
                return self.success_response({'error': 'You do not have permission to create this barter.'})
            
            offer = Offers.objects.create(
                card=other_user_card,
                status_id=3,  
                perfomer=user,
            )
            
            serializer = OffersSerializer(offer)
            return self.success_response(serializer.data)
        
        except Cards.DoesNotExist:
            return self.error_response({'error': 'Card for exchange not found.'})


class BarterAcceptRejectView(ResponseHandlerMixin, APIView):

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'offer_id': openapi.Schema(type=openapi.TYPE_STRING, description='ID of the offer to accept/reject'),
                'is_accepted': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Accept or reject the offer'),
            }
        ),
        responses={200: 'OK', 403: 'Permission Denied', 404: 'Not Found'},
    )
    def post(self, request, format=None):
        user = request.user
        offer_id = request.data.get('offer_id')
        is_accepted = request.data.get('is_accepted')

        try:
            offer = Offers.objects.get(id=offer_id)

            if user != offer.card.user:
                return self.error_response({'error': 'Permission denied.'})

            if is_accepted:
                buyer_offer = Offers.objects.create(
                    card=offer.card,
                    status_id=3,
                    perfomer=user,
                )
                seller_offer = Offers.objects.create(
                    card=offer.card,
                    status_id=3,
                    perfomer=offer.perfomer,
                )
                offer.status_id = 2
                offer.save()
                buyer_serializer = OffersSerializer(buyer_offer)
                seller_serializer = OffersSerializer(seller_offer)
                return self.success_response({'buyer_offer': buyer_serializer.data, 'seller_offer': seller_serializer.data})
            else:
                offer.status_id = 5
                offer.save()
                serializer = OffersSerializer(offer)
                return self.success_response(serializer.data)

        except Offers.DoesNotExist:
            return self.error_response({'error': 'Offer not found.'})
