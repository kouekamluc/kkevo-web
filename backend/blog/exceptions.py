"""
Custom exceptions for blog operations.
"""
from rest_framework import status
from rest_framework.exceptions import APIException


class BlogServiceError(APIException):
    """Base exception for blog service errors."""
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = 'A blog service error occurred.'
    default_code = 'blog_service_error'


class DuplicateActionError(APIException):
    """Exception raised when trying to perform a duplicate action."""
    status_code = status.HTTP_409_CONFLICT
    default_detail = 'This action has already been performed.'
    default_code = 'duplicate_action'


class BlogValidationError(APIException):
    """Exception raised for blog validation errors."""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Invalid data provided.'
    default_code = 'blog_validation_error'


class BlogNotFoundError(APIException):
    """Exception raised when a blog resource is not found."""
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = 'Blog resource not found.'
    default_code = 'blog_not_found'


class BlogPermissionError(APIException):
    """Exception raised for blog permission errors."""
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = 'You do not have permission to perform this action.'
    default_code = 'blog_permission_error'

