from django.urls import path
from .import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("notes/update/<int:id>/", views.NoteUpdate.as_view(), name="update-note"),
    path('average-task-time/<str:title>/', views.AverageTaskTimeView.as_view(), name='average_task_time'),
    path('mark-as-completed/<int:id>/', views.MarkAsCompletedView.as_view(), name='mark-as-completed'),
]