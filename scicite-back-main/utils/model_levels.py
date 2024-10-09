
from profiles_app.models import Levels


def get_next_level(level_user):
    custom_order_list = ['d974bf8d-0f8a-4e9e-b072-43c49498ceeb', 'd3cfcffe-71f1-4643-9b48-ba7a47613201', '8c9a22b2-9b0f-461a-afef-c215a897988a', '290f9830-9b28-4aa2-93d9-4db282ba384c']

    current_index = custom_order_list.index(str(level_user.id))
    next_index = current_index + 1

    if next_index < len(custom_order_list):
        next_level_name = custom_order_list[next_index]
        print(next_level_name)
        next_level = Levels.objects.get(id=next_level_name)
    else:
        next_level = None
    return next_level