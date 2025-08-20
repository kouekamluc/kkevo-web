"""
Views for contact app.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils import timezone
from django.db.models import Count, Q, Avg
from django.contrib.auth.models import User
from .models import ContactSubmission
from .serializers import (
    ContactSubmissionSerializer,
    ContactSubmissionCreateSerializer,
    ContactSubmissionUpdateSerializer,
    ContactSubmissionListSerializer,
    ContactAnalyticsSerializer,
    ContactDashboardStatsSerializer
)


class ContactSubmissionViewSet(viewsets.ModelViewSet):
    """ViewSet for ContactSubmission model."""

    queryset = ContactSubmission.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'create':
            return ContactSubmissionCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ContactSubmissionUpdateSerializer
        elif self.action == 'list':
            return ContactSubmissionListSerializer
        return ContactSubmissionSerializer

    def create(self, request, *args, **kwargs):
        """Create a new contact submission."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Extract UTM parameters from request
        utm_data = {}
        for key in ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']:
            if key in request.data:
                utm_data[key] = request.data[key]
        
        # Create submission with UTM data
        submission = serializer.save(**utm_data)
        
        # Get the full serialized data for response
        response_serializer = ContactSubmissionSerializer(submission)
        
        return Response({
            'success': True,
            'message': 'Contact submission created successfully',
            'submission_id': submission.id,
            'lead_score': submission.lead_score,
            'status': submission.status,
            'data': response_serializer.data
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def mark_as_contacted(self, request, pk=None):
        """Mark a contact submission as contacted."""
        try:
            submission = self.get_object()
            submission.mark_as_contacted()
            return Response({
                'success': True,
                'message': 'Contact marked as contacted successfully',
                'first_contacted_at': submission.first_contacted_at.isoformat(),
                'last_contacted_at': submission.last_contacted_at.isoformat()
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def schedule_follow_up(self, request, pk=None):
        """Schedule a follow-up for a contact submission."""
        try:
            submission = self.get_object()
            follow_up_date = request.data.get('follow_up_date')
            
            if not follow_up_date:
                return Response({
                    'success': False,
                    'message': 'follow_up_date is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Parse the date string
            try:
                from datetime import datetime
                follow_up_datetime = datetime.fromisoformat(follow_up_date.replace('Z', '+00:00'))
                submission.schedule_follow_up(follow_up_datetime)
                return Response({
                    'success': True,
                    'message': 'Follow-up scheduled successfully',
                    'follow_up_scheduled': submission.follow_up_scheduled.isoformat()
                })
            except ValueError:
                return Response({
                    'success': False,
                    'message': 'Invalid date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def complete_follow_up(self, request, pk=None):
        """Mark a follow-up as completed."""
        try:
            submission = self.get_object()
            submission.complete_follow_up()
            return Response({
                'success': True,
                'message': 'Follow-up marked as completed successfully',
                'follow_up_completed': submission.follow_up_completed.isoformat()
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def update_lead_score(self, request, pk=None):
        """Manually update the lead score."""
        try:
            submission = self.get_object()
            score = request.data.get('score')
            
            if score is None:
                return Response({
                    'success': False,
                    'message': 'score is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                score = int(score)
                if not 0 <= score <= 100:
                    raise ValueError("Score must be between 0 and 100")
            except (ValueError, TypeError):
                return Response({
                    'success': False,
                    'message': 'Score must be a valid integer between 0 and 100'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            submission.lead_score = score
            submission.save(update_fields=['lead_score', 'updated_at'])
            
            return Response({
                'success': True,
                'message': 'Lead score updated successfully',
                'lead_score': submission.lead_score
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Get contact analytics data."""
        try:
            days = int(request.query_params.get('days', 30))
            
            # Date range
            end_date = timezone.now()
            start_date = end_date - timezone.timedelta(days=days)
            
            # Filter submissions within date range
            submissions = self.queryset.filter(submitted_at__range=(start_date, end_date))
            
            # Basic counts
            total_submissions = submissions.count()
            new_leads = submissions.filter(status='new').count()
            qualified_leads = submissions.filter(lead_score__gte=50).count()
            high_priority_leads = submissions.filter(lead_score__gte=75).count()
            needs_follow_up = submissions.filter(follow_up_scheduled__lte=timezone.now()).count()
            
            # Average lead score
            avg_lead_score = submissions.aggregate(avg_score=Avg('lead_score'))['avg_score'] or 0
            
            # Status breakdown
            status_breakdown = dict(submissions.values_list('status').annotate(count=Count('id')))
            
            # Subject breakdown
            subject_breakdown = dict(submissions.values_list('subject').annotate(count=Count('id')))
            
            # Industry breakdown
            industry_breakdown = dict(submissions.values_list('industry').annotate(count=Count('id')))
            
            # Timeline trends (simplified for now)
            daily_submissions = []
            weekly_submissions = []
            monthly_submissions = []
            
            # Generate daily data for the last 7 days
            for i in range(7):
                date = end_date - timezone.timedelta(days=i)
                count = submissions.filter(submitted_at__date=date.date()).count()
                daily_submissions.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'count': count
                })
            
            # Generate weekly data for the last 4 weeks
            for i in range(4):
                week_start = end_date - timezone.timedelta(weeks=i+1)
                week_end = end_date - timezone.timedelta(weeks=i)
                count = submissions.filter(submitted_at__range=(week_start, week_end)).count()
                weekly_submissions.append({
                    'week': f"Week {4-i}",
                    'count': count
                })
            
            # Generate monthly data for the last 3 months
            for i in range(3):
                month_start = end_date.replace(day=1) - timezone.timedelta(days=30*i)
                month_end = month_start.replace(day=28) + timezone.timedelta(days=4)
                month_end = month_end.replace(day=1) - timezone.timedelta(days=1)
                count = submissions.filter(submitted_at__range=(month_start, month_end)).count()
                monthly_submissions.append({
                    'month': month_start.strftime('%B %Y'),
                    'count': count
                })
            
            analytics_data = {
                'total_submissions': total_submissions,
                'new_leads': new_leads,
                'qualified_leads': qualified_leads,
                'high_priority_leads': high_priority_leads,
                'needs_follow_up': needs_follow_up,
                'avg_lead_score': round(avg_lead_score, 1),
                'status_breakdown': status_breakdown,
                'subject_breakdown': subject_breakdown,
                'industry_breakdown': industry_breakdown,
                'daily_submissions': list(reversed(daily_submissions)),
                'weekly_submissions': list(reversed(weekly_submissions)),
                'monthly_submissions': list(reversed(monthly_submissions))
            }
            
            serializer = ContactAnalyticsSerializer(analytics_data)
            return Response({
                'success': True,
                'data': serializer.data
            })
            
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """Get quick dashboard statistics."""
        try:
            today = timezone.now().date()
            today_submissions = self.queryset.filter(submitted_at__date=today).count()
            
            week_start = today - timezone.timedelta(days=today.weekday())
            week_submissions = self.queryset.filter(submitted_at__date__gte=week_start).count()
            
            month_start = today.replace(day=1)
            month_submissions = self.queryset.filter(submitted_at__date__gte=month_start).count()
            
            pending_follow_ups = self.queryset.filter(
                follow_up_scheduled__lte=timezone.now(),
                follow_up_completed__isnull=True
            ).count()
            
            high_value_leads = self.queryset.filter(lead_score__gte=75).count()
            
            # Calculate average response time (simplified)
            responded_submissions = self.queryset.filter(
                first_contacted_at__isnull=False,
                submitted_at__isnull=False
            )
            
            if responded_submissions.exists():
                total_response_time = 0
                count = 0
                for submission in responded_submissions:
                    response_time = submission.first_contacted_at - submission.submitted_at
                    total_response_time += response_time.total_seconds() / 3600  # Convert to hours
                    count += 1
                avg_response_time = total_response_time / count
            else:
                avg_response_time = 0
            
            # Calculate conversion rate (simplified)
            total_submissions = self.queryset.count()
            converted_submissions = self.queryset.filter(status__in=['won', 'proposal_sent', 'negotiating']).count()
            conversion_rate = (converted_submissions / total_submissions * 100) if total_submissions > 0 else 0
            
            stats_data = {
                'today_submissions': today_submissions,
                'week_submissions': week_submissions,
                'month_submissions': month_submissions,
                'pending_follow_ups': pending_follow_ups,
                'high_value_leads': high_value_leads,
                'avg_response_time': round(avg_response_time, 1),
                'conversion_rate': round(conversion_rate, 1)
            }
            
            serializer = ContactDashboardStatsSerializer(stats_data)
            return Response({
                'success': True,
                'data': serializer.data
            })
            
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def high_priority_leads(self, request):
        """Get high priority leads that need immediate attention."""
        try:
            high_priority = self.queryset.filter(
                lead_score__gte=75,
                status__in=['new', 'reviewed']
            ).order_by('-lead_score', '-submitted_at')
            
            serializer = ContactSubmissionListSerializer(high_priority, many=True)
            return Response({
                'success': True,
                'data': serializer.data
            })
            
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def needs_follow_up(self, request):
        """Get leads that need follow-up."""
        try:
            needs_follow_up = self.queryset.filter(
                follow_up_scheduled__lte=timezone.now(),
                follow_up_completed__isnull=True
            ).order_by('follow_up_scheduled', '-lead_score')
            
            serializer = ContactSubmissionListSerializer(needs_follow_up, many=True)
            return Response({
                'success': True,
                'data': serializer.data
            })
            
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
