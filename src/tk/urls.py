from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf import settings
from django.views.generic import TemplateView

admin.autodiscover()

from tastypie.api import Api
from core.resources import TaskResource
from core.views import index

v1_api = Api(api_name='v1')
v1_api.register(TaskResource())


urlpatterns = patterns('',
    (r'^api/', include(v1_api.urls)),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', index, name='index'),
    url(r'^task/(?P<task_id>[-\w]+)/$', index, name='index'),
)

if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.MEDIA_ROOT,
        }),
        url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.STATIC_ROOT,
        }),
    )
    urlpatterns += patterns('',
        url(r'^error-page/404/$', TemplateView.as_view(template_name='404.html')),
        url(r'^error-page/500/$', TemplateView.as_view(template_name='500.html'))
    )
