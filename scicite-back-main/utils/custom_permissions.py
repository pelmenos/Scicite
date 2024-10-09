from rest_framework import permissions


class CustomPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        user = request.user
        queryset = view.queryset

        self.model_name = queryset.model.__name__.lower()
        has_perm_is = user.has_perm(
                f'model.{self.model_name}.{view.action}')
        return True
        return has_perm_is
    

