from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer,NoteSerializerCompleted
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Note
from rest_framework.views import APIView
from django.views.generic import View
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.db.models import Avg



from rest_framework import status

class MarkAsCompletedView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            instance = Note.objects.get(id=id)
            serializer = NoteSerializerCompleted(instance, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse({'success': True})
            else:
                return JsonResponse({'success': False, 'errors': serializer.errors}, status=400)
        except Note.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Model instance not found'}, status=404)


class AverageTaskTimeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, title):
        # Filter notes by title
        notes = Note.objects.filter(title=title)

        # Calculate average task time if notes exist
        if notes:
            total_time = sum(note.task_time for note in notes)
            average_time = total_time / len(notes)
            return Response({'average_task_time': average_time})
        else:
            return Response({'average_task_time': -1})


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)



class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
from rest_framework import status

class NoteUpdate(generics.UpdateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    queryset = Note.objects.all()  # Specify the queryset for updating notes
    lookup_field = 'id'  # Specify the field to use for looking up the note object

    def perform_update(self, serializer):
        serializer.save()

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]