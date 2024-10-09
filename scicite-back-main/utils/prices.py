from profiles_app.models import SettingsModel


def get_price_citation(offer):
    card = offer.card
    settings = SettingsModel.objects.first()

    base = card.base
    base_name = base.__dict__['name'].lower()
    
    settings = SettingsModel.objects.first()
    price_citation = settings.price_citation
    if base_name == 'ринц':
        price = price_citation['ринц']
    elif base_name in ['web of science', 'scopus']:
        price = price_citation['scopus/wos']
    else:
        price = price_citation['вак']

    return price