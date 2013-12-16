from tastypie.resources import ModelResource
from tastypie.serializers import Serializer
from tastypie.authentication import Authentication
from tastypie.authorization import Authorization

from .models import Task


class TaskResource(ModelResource):
    class Meta:
        queryset = Task.objects.all()
        serializer = Serializer(['json',])
        detail_uri_name = 'uuid'
        authorization = Authorization()
        authentication = Authentication()
        always_return_data=True

    def dehydrate_id(self, bundle):
        return bundle.obj.uuid

    def hydrate(self, bundle):
        if bundle.data.get('id', None):
            bundle.data['id'] = Task.objects.get(uuid=bundle.data['uuid']).id
        return bundle