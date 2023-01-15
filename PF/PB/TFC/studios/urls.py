from django.urls import path

from studios.views.distance import SortByDistance
from studios.views.studio_info import StudioView

app_name = 'studios'

urlpatterns = [
    # http://localhost:8000/studios/distance/43.887501,-79.428406/calculate/
    path('distance/<str:location>/calculate/<int:page_num>', SortByDistance.as_view()),
    # http://localhost:8000/studios/1/43.887501,-79.428406/information/
    path('<str:studio_id>/<str:location>/information/', StudioView.as_view())
]
