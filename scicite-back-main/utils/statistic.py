from django.db.models import Sum

from cards_app.models import Cards
from offers_app.models import Offers
from profiles_app.models import Counter, UserAchievement


def get_user_statistic(user):
    counter, _ = Counter.objects.get_or_create(user=user)
    citations_received = counter.count_publication
    citations_formatted = counter.count_citation

    offers = Offers.objects.filter(perfomer=user)
    successful_citations = offers.filter(status_executor__code=4).count() * 100.0 / offers.count() if offers.count() > 0 else 0

    cards_user = Cards.objects.filter(user=user)

    scicoins_spent = cards_user.aggregate(total_scicoins_spent=Sum('tariff__scicoins'))['total_scicoins_spent'] or 0
    scicoins_earned = cards_user.aggregate(total_scicoins_spent=Sum('tariff__scicoins'))['total_scicoins_spent'] or 0

    counter_obj, created_counter = Counter.objects.get_or_create(
        user=user
    )

    if created_counter:
        counter_obj.count_created_cards = cards_user.count()
        counter_obj.save()

    cards_count = counter_obj.count_created_cards

    achievement_count = UserAchievement.objects.filter(user=user).count()

    return {
        "citations_received": citations_received,
        "citations_formatted": citations_formatted,
        "successful_citations": f"{successful_citations}%",
        "scicoins_spent": scicoins_spent,
        "scicoins_earned": scicoins_earned,
        "exchanges_completed": 0,
        "card_create": cards_count,
        "achievement_count": achievement_count,
    }