from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/books/', include('books.urls')),
    path('api/discussions/', include('discussions.urls')),
]