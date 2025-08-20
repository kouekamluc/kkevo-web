"""
Views for lead magnets app.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils import timezone
from django.db.models import Count, Q
from .models import LeadMagnetSubmission
from .serializers import (
    LeadMagnetSubmissionSerializer,
    LeadMagnetSubmissionCreateSerializer,
    LeadMagnetSubmissionUpdateSerializer
)


class LeadMagnetSubmissionViewSet(viewsets.ModelViewSet):
    """ViewSet for LeadMagnetSubmission model."""
    
    queryset = LeadMagnetSubmission.objects.all()
    permission_classes = [AllowAny]  # Allow public submissions
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'create':
            return LeadMagnetSubmissionCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return LeadMagnetSubmissionUpdateSerializer
        return LeadMagnetSubmissionSerializer
    
    def create(self, request, *args, **kwargs):
        """Create a new lead magnet submission."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        submission = serializer.save()
        
        # Return success response with submission ID
        return Response({
            'success': True,
            'message': 'Lead magnet submission created successfully',
            'submission_id': submission.id,
            'lead_score': submission.lead_score,
            'status': submission.status
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def mark_pdf_downloaded(self, request, pk=None):
        """Mark PDF as downloaded for a submission."""
        try:
            submission = self.get_object()
            submission.mark_pdf_downloaded()
            
            return Response({
                'success': True,
                'message': 'PDF download marked successfully',
                'pdf_downloaded_at': submission.pdf_downloaded_at.isoformat()
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def mark_email_opened(self, request, pk=None):
        """Mark email as opened for a submission."""
        try:
            submission = self.get_object()
            submission.mark_email_opened()
            
            return Response({
                'success': True,
                'message': 'Email opened marked successfully',
                'email_opened_at': submission.email_opened_at.isoformat()
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def update_lead_score(self, request, pk=None):
        """Update lead score for a submission."""
        try:
            submission = self.get_object()
            score = request.data.get('score', 0)
            
            if not isinstance(score, int) or score < 0 or score > 100:
                return Response({
                    'success': False,
                    'message': 'Score must be an integer between 0 and 100'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            submission.update_lead_score(score)
            
            return Response({
                'success': True,
                'message': 'Lead score updated successfully',
                'lead_score': submission.lead_score,
                'status': submission.status
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Get analytics data for lead magnets."""
        try:
            # Get date range from query params
            days = int(request.query_params.get('days', 30))
            start_date = timezone.now() - timezone.timedelta(days=days)
            
            # Filter submissions by date range
            recent_submissions = self.queryset.filter(
                created_at__gte=start_date
            )
            
            # Calculate metrics
            total_submissions = recent_submissions.count()
            pdf_downloads = recent_submissions.filter(
                pdf_downloaded_at__isnull=False
            ).count()
            qualified_leads = recent_submissions.filter(
                status__in=['engaged', 'qualified', 'contacted', 'converted']
            ).count()
            
            # Conversion rate
            conversion_rate = (pdf_downloads / total_submissions * 100) if total_submissions > 0 else 0
            
            # Lead magnet type breakdown
            type_breakdown = recent_submissions.values('lead_magnet_type').annotate(
                count=Count('id')
            ).order_by('-count')
            
            # Source breakdown
            source_breakdown = recent_submissions.values('source').annotate(
                count=Count('id')
            ).order_by('-count')
            
            # Status breakdown
            status_breakdown = recent_submissions.values('status').annotate(
                count=Count('id')
            ).order_by('-count')
            
            # Average lead score
            avg_lead_score = recent_submissions.aggregate(
                avg_score=Count('lead_score')
            )['avg_score'] or 0
            
            return Response({
                'success': True,
                'data': {
                    'period_days': days,
                    'total_submissions': total_submissions,
                    'pdf_downloads': pdf_downloads,
                    'qualified_leads': qualified_leads,
                    'conversion_rate': round(conversion_rate, 2),
                    'avg_lead_score': avg_lead_score,
                    'type_breakdown': list(type_breakdown),
                    'source_breakdown': list(source_breakdown),
                    'status_breakdown': list(status_breakdown)
                }
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """Get dashboard statistics for lead magnets."""
        try:
            # Today's submissions
            today = timezone.now().date()
            today_submissions = self.queryset.filter(
                created_at__date=today
            ).count()
            
            # This week's submissions
            week_start = today - timezone.timedelta(days=today.weekday())
            week_submissions = self.queryset.filter(
                created_at__date__gte=week_start
            ).count()
            
            # This month's submissions
            month_start = today.replace(day=1)
            month_submissions = self.queryset.filter(
                created_at__date__gte=month_start
            ).count()
            
            # Pending follow-ups
            pending_follow_ups = self.queryset.filter(
                follow_up_scheduled__lte=timezone.now(),
                follow_up_completed__isnull=True
            ).count()
            
            # High-value leads (score >= 75)
            high_value_leads = self.queryset.filter(
                lead_score__gte=75
            ).count()
            
            return Response({
                'success': True,
                'data': {
                    'today_submissions': today_submissions,
                    'week_submissions': week_submissions,
                    'month_submissions': month_submissions,
                    'pending_follow_ups': pending_follow_ups,
                    'high_value_leads': high_value_leads
                }
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
