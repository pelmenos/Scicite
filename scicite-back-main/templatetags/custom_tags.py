import base64

from django import template
from django.conf import settings
from django.template.defaultfilters import stringfilter

register = template.Library()

@register.filter(name='base64_encode')
@stringfilter
def base64_encode(value):
    return base64.b64encode(value.encode()).decode()

@register.simple_tag
def static_base64(file_path):
    static_url = f"{settings.STATIC_URL}{file_path}"
    return base64_encode(static_url)
