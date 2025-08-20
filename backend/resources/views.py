import boto3
import logging
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View
import json
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name='dispatch')
class DjangoSaasChecklistDownloadView(View):
    """
    Generate presigned S3 URL for Django SaaS Checklist PDF download
    """
    
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            email = data.get('email')
            firstName = data.get('firstName')
            
            if not email:
                return JsonResponse({'error': 'Email is required'}, status=400)
            
            # Log the download request for analytics
            logger.info(f"PDF download requested for email: {email}, name: {firstName}")
            
            # Generate presigned URL for S3 download
            download_url = self._generate_presigned_url(email, firstName)
            
            return JsonResponse({
                'downloadUrl': download_url,
                'message': 'Download URL generated successfully'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            logger.error(f"Error generating download URL: {str(e)}")
            return JsonResponse({'error': 'Internal server error'}, status=500)
    
    def _generate_presigned_url(self, email, firstName):
        """
        Generate a presigned S3 URL for the Django SaaS Checklist PDF
        """
        try:
            # Initialize S3 client
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME
            )
            
            # Generate presigned URL (expires in 1 hour)
            presigned_url = s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
                    'Key': 'resources/django-saas-checklist.pdf'
                },
                ExpiresIn=3600  # 1 hour
            )
            
            return presigned_url
            
        except Exception as e:
            logger.error(f"Error generating S3 presigned URL: {str(e)}")
            # Fallback: return a direct download link if S3 is not configured
            return f"/static/resources/django-saas-checklist.pdf?email={email}&name={firstName}"


# Fallback view for direct downloads (when S3 is not configured)
@csrf_exempt
@require_http_methods(["POST"])
def django_saas_checklist_download_fallback(request):
    """
    Fallback download endpoint when S3 is not configured
    """
    try:
        data = json.loads(request.body)
        email = data.get('email')
        firstName = data.get('firstName')
        
        if not email:
            return JsonResponse({'error': 'Email is required'}, status=400)
        
        # Log the download request
        logger.info(f"Fallback PDF download for email: {email}, name: {firstName}")
        
        # Return a direct link to the static file
        download_url = f"/static/resources/django-saas-checklist.pdf"
        
        return JsonResponse({
            'downloadUrl': download_url,
            'message': 'Download URL generated successfully (fallback mode)'
        })
        
    except Exception as e:
        logger.error(f"Error in fallback download: {str(e)}")
        return JsonResponse({'error': 'Internal server error'}, status=500)

