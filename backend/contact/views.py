"""
Views for contact app.
"""
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import ContactSubmission
from .serializers import ContactSubmissionSerializer, ContactSubmissionCreateSerializer


class ContactSubmissionViewSet(viewsets.ModelViewSet):
    """ViewSet for ContactSubmission model."""
    
    queryset = ContactSubmission.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['subject', 'is_read', 'created_at']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'create':
            return ContactSubmissionCreateSerializer
        return ContactSubmissionSerializer
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action == 'create':
            return []  # Allow anyone to create contact submissions
        return super().get_permissions()
    
    def create(self, request, *args, **kwargs):
        """Create a new contact submission."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {'message': 'Thank you for your message. We will get back to you soon!'},
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark a contact submission as read."""
        submission = self.get_object()
        submission.is_read = True
        submission.save()
        return Response({'status': 'marked as read'})
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread submissions."""
        count = ContactSubmission.objects.filter(is_read=False).count()
        return Response({'unread_count': count})
