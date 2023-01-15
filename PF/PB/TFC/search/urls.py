from django.urls import path

from search.views.search_class import SearchClassView
from search.views.search_studio import SearchStudioView

app_name = 'search'

urlpatterns = [
    # http://localhost:8000/search/studio_name/tfc/
    path('<str:search_by>/<str:search_term>/', SearchStudioView.as_view()),
    path('classes/<str:search_by>/<str:search_term>/', SearchClassView.as_view())
]
