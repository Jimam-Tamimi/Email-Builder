from drf_yasg.inspectors import PaginatorInspector
from drf_yasg import openapi

class CustomIntegerPaginatorInspector(PaginatorInspector):
    def __init__(self, view, path, method, components, request, **kwargs):
        super().__init__(view, path, method, components, request, **kwargs)

    def inspect(self, path, method, auto_schema):
        schema = super().inspect(path, method, auto_schema)

        if schema and 'properties' in schema:
            properties = schema['properties']
            properties['next'] = openapi.Schema(type=openapi.TYPE_INTEGER, example=None)
            properties['previous'] = openapi.Schema(type=openapi.TYPE_INTEGER, example=None)

        return schema
