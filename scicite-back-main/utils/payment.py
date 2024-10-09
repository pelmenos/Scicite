from django.db import transaction

from profiles_app.models import Transacitons, User


def create_transaction(user, amount, basis_creation, source={}):
    """ Пополнение баланса """
    with transaction.atomic():
        user.balance += amount
        transaction_obj = Transacitons.objects.create(
            user=user, 
            sum=amount, 
            balance=user.balance,
            basis_creation=basis_creation,
            type_transaction='plus',
            source=source
        )
        user.save()
        return transaction_obj
    return None


def create_payment(user, amount, basis_creation, source={}):
    """ Списание баланса """
    with transaction.atomic():
        user.balance -= amount
        if user.balance < 0 and basis_creation != 'enrollment_admin':
            return False
        transaction_obj = Transacitons.objects.create(
            user=user, 
            sum=amount, 
            balance=user.balance,
            basis_creation=basis_creation,
            type_transaction='minus',
            source=source
        )
        user.save()
        return transaction_obj
    return False