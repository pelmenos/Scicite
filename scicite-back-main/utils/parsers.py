from rest_framework import parsers


class NestedMultipartParser(parsers.MultiPartParser):
    def parse(self, stream, media_type=None, parser_context=None):
        result = super().parse(stream=stream, media_type=media_type, parser_context=parser_context)

        data = {}
        for key, value in result.data.items():
            if '[' in key and ']' in key:
                index_left_bracket = key.index('[')
                index_right_bracket = key.index(']')
                nested_dict_key = key[:index_left_bracket]
                nested_value_key = key[index_left_bracket + 1:index_right_bracket]
                if nested_dict_key not in data:
                    data[nested_dict_key] = []

                data[nested_dict_key].append({nested_value_key: value})
            else:
                data[key] = value

        for key, file_list in result.files.items():
            for file_item in file_list:
                data[key] = file_item

        return parsers.DataAndFiles(data, {})