import base64

from django.contrib.auth import authenticate
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed


class BearerAuthentication(authentication.TokenAuthentication):
    """Для поддержки кастомных ключевых слов в токене в заголовке запроса и авторизации django."""

    def authenticate(self, request):
        auth_header = authentication.get_authorization_header(request).split()
        if not auth_header:
            return None

        if len(auth_header) != 2:
            try:
                token = auth_header[0].decode('utf-8')
            except Exception:
                msg = 'Invalid token header. Token string should not contain invalid characters.'
                raise AuthenticationFailed(msg)
            return self.authenticate_credentials(token)

        auth_type = auth_header[0].decode('utf-8').lower()
        if auth_type == 'token' or auth_type == 'bearer':
            try:
                token = auth_header[1].decode('utf-8')
                return self.authenticate_credentials(token)
            except UnicodeError:
                msg = 'Invalid token header. Token string should not contain invalid characters.'
                raise AuthenticationFailed(msg)
        elif auth_type == 'basic':
            try:
                auth_data = base64.b64decode(auth_header[1]).decode('utf-8')
                username, password = auth_data.split(':')
                user = authenticate(username=username, password=password)
                if user is None:
                    msg = 'Invalid username or password'
                    raise AuthenticationFailed(msg)
                return (user, None)
            except Exception:
                msg = 'Invalid basic authentication header'
                raise AuthenticationFailed(msg)

        return None

    def authenticate_credentials(self, key):
        try:
            return super().authenticate_credentials(key)
        except AuthenticationFailed:
            return None
