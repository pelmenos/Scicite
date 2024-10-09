from offers_app.models import Offers, OffersStatus
from profiles_app.models import Counter, SettingsModel
from utils.achievements import create_achievement
from utils.model_levels import get_next_level
from utils.notifications import (notfiy_citation_confirm,
                                 notfiy_pub_cit_confirm, notify_barter,
                                 notify_barter_confirm, notify_barter_reject,
                                 notify_reject_citation,
                                 notify_request_citation,
                                 notify_request_publication)
from utils.payment import create_transaction
from utils.prices import get_price_citation


class OfferHandler:

    def __init__(self, instance: Offers, validated_data):
        self.STATUS_RESPONSE = OffersStatus.objects.get(code=1)
        self.STATUS_CITATION = OffersStatus.objects.get(code=2)
        self.STATUS_WAIT = OffersStatus.objects.get(code=3)
        self.STATUS_PUBLICATION = OffersStatus.objects.get(code=4)
        self.STATUS_ACCEPT = OffersStatus.objects.get(code=5)
        self.STATUS_REJECT = OffersStatus.objects.get(code=6)

        self.instance = instance
        self.validated_data = validated_data
        self.perfomer = instance.perfomer
        self.counter, _ = Counter.objects.get_or_create(user=self.perfomer)
        self.card = instance.card
        self.settings = SettingsModel.objects.first()

        base = self.card.base
        base_name = base.name.lower()
        
        self.price = get_price_citation(instance)

    def handle_barter(self):
        if self.offer_customer_status_id == self.STATUS_CITATION:
            notify_barter(self.instance)
        elif self.offer_executor_status_id == self.STATUS_REJECT:
            notify_barter_reject(self.instance)

    def handle_offer(self):
        achievement = None
        if self.offer_executor_status_id == self.STATUS_CITATION and self.offer_customer_status_id == None and not self.instance.barter_is:
            self.instance.status_executor = self.STATUS_WAIT
            self.instance.status_executor = self.STATUS_WAIT
            self.instance.save()
            notify_request_citation(self.instance)
        elif (
            self.offer_executor_status_id == self.STATUS_PUBLICATION
            and self.offer_customer_status_id == self.STATUS_WAIT
        ):
            notfiy_citation_confirm(self.instance)
            if not self.instance.barter:
                create_transaction(self.perfomer, self.price / 2, 'citation_format', {'offer':str(self.instance.id)})
            self.counter.count_created_citation += 1
            self.counter.save()
            if self.counter.count_created_citation == 1:
                achievement = create_achievement(self.perfomer, 'first_quote')
            
            next_level = get_next_level(self.perfomer.level)
            if next_level and self.counter.count_publication >= next_level.count_offers:
                self.perfomer.level = next_level
                self.perfomer.save()

            counter_user, _ = Counter.objects.get_or_create(user=self.instance.card.user)
            counter_user.count_citation += 1
            counter_user.save()
        elif (
            self.offer_customer_status_id == self.STATUS_PUBLICATION
            and self.offer_executor_status_id == self.STATUS_PUBLICATION
        ):
            notify_request_publication(self.instance)
        elif (
            self.offer_customer_status_id == self.STATUS_ACCEPT
            and self.offer_executor_status_id == self.STATUS_ACCEPT
        ):
            notfiy_pub_cit_confirm(self.instance)
            if not self.instance.barter:
                create_transaction(self.perfomer, self.price / 2, 'publication_format', {'offer':str(self.instance.id)})
            self.counter.count_publication += 1
            self.counter.save()
            if self.counter.count_publication == 1:
                achievement = create_achievement(self.perfomer, 'first_publication')

        elif self.offer_executor_status_id == self.STATUS_REJECT:
            notify_reject_citation(self.instance)
            self.counter.count_reject += 1
            self.counter.save()
        return achievement

    def update_instance(self):
        self.status_executor = self.validated_data.get("status_executor")
        self.offer_executor_status_id = (
            self.status_executor
            if self.status_executor
            else self.instance.status_executor
        )

        self.status_customer = self.validated_data.get("status_customer")
        self.offer_customer_status_id = (
            self.status_customer
            if self.status_customer
            else self.instance.status_customer
        )
        if len(dict(self.validated_data).keys()) == 1 and "barter_is" in self.validated_data:
            return notify_barter_confirm(self.instance)
        # if not (self.status_customer or self.status_executor):
        #     return

        if self.instance.barter_is:
            self.handle_barter()

        return self.handle_offer()
    

"""
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            instance = serializer.save()
            perfomer = instance.perfomer
            counter_obj, _ = Counter.objects.get_or_create(user=perfomer)

            validated_data = serializer.validated_data

            status_executor = validated_data.get("status_executor")
            offer_status_id = str(status_executor.id) if status_executor else str(instance.status_executor.id)

            status_customer = validated_data.get("status_customer")
            offer_customer_status_id = str(status_customer.id) if status_customer else str(instance.status_customer.id)
            achievement = None
            print(f'{"-"*20}\n', offer_status_id, offer_customer_status_id, (offer_status_id ==  offer_customer_status_id == "f3344148-246e-430e-9fe1-a0ca408e8e2f"), '\n')
            if status_executor or status_customer:
                
                if instance.barter_is:
                    if offer_customer_status_id == "f3344148-246e-430e-9fe1-a0ca408e8e2f":
                        notify_barter(instance)
                    elif offer_status_id == 'f770cd8d-a254-4815-a502-2dba14d4fa05':
                        notify_barter_reject(instance)
                    elif offer_status_id == "f3344148-246e-430e-9fe1-a0ca408e8e2f":
                        notify_barter_confirm(instance)






                if offer_status_id ==  offer_customer_status_id == "f3344148-246e-430e-9fe1-a0ca408e8e2f":
                    notify_request_citation(instance)
                if offer_status_id == "edd364ff-ad50-49c6-b6cc-b4446c2419d0" and offer_customer_status_id=="3794273b-2090-4ebf-9373-3a2a99e1b039":
                    notfiy_citation_confirm(instance)
                    if not instance.barter_is:
                        amount = 75 # TODO
                        create_transaction(perfomer, 75, 'citation_format')
                    counter_obj.count_created_citation += 1
                    counter_obj.save()
                    if counter_obj.count_created_citation == 1:
                        achievement = create_achievement(perfomer, 'first_quote')
                    counter_user, _ = Counter.objects.get_or_create(user=instance.card.user)
                    counter_user.count_citation += 1
                    counter_user.save()
                # elif offer_customer_status_id == "edd364ff-ad50-49c6-b6cc-b4446c2419d0":
                #     pass
                elif offer_customer_status_id=="edd364ff-ad50-49c6-b6cc-b4446c2419d0" and  offer_status_id == 'edd364ff-ad50-49c6-b6cc-b4446c2419d0':
                    notify_request_publication(instance)
                elif offer_customer_status_id=="145520d0-5ffb-42c9-b619-248db9d3e0d7" and  offer_status_id == '145520d0-5ffb-42c9-b619-248db9d3e0d7':
                    notfiy_pub_cit_confirm(instance)
                    if not instance.barter_is:
                        create_transaction(perfomer, 75, 'publication_format')
                    counter_obj.count_publication += 1
                    counter_obj.save()
                    if counter_obj.count_publication == 1:
                        achievement = create_achievement(perfomer, 'first_publication')

                    next_level = get_next_level(perfomer.level)
                    if next_level:
                        if counter_obj.count_publication >= next_level.count_offers:
                            perfomer.level = next_level
                            perfomer.save()
                elif offer_status_id == "f770cd8d-a254-4815-a502-2dba14d4fa05":
                    notify_reject_citation(instance)
            data_dict = dict(serializer.data)
            if achievement:
                data_dict['achievement'] = achievement.id
            return self.success_response(data_dict)
        return self.error_response(serializer.errors)



"""