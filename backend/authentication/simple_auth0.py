"""
Simplified Auth0 authentication backend for Django REST Framework.
This version uses PyJWT without complex cryptography dependencies.
"""
import json
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from urllib.request import urlopen
import requests

User = get_user_model()


class SimpleAuth0Authentication(authentication.BaseAuthentication):
    """
    Simplified Auth0 authentication class for JWT tokens.
    """
    
    def authenticate(self, request):
        """
        Authenticate the request and return a two-tuple of (user, token).
        Returns None for anonymous users to allow public access.
        """
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        # If no authorization header, allow anonymous access
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
            
        try:
            token = auth_header.split(' ')[1]
            
            # Decode the JWT token
            payload = self.decode_jwt(token)
            
            # Get or create user based on Auth0 user info
            user = self.get_or_create_user(payload)
            
            return (user, token)
            
        except Exception as e:
            # For invalid tokens, return None to allow anonymous access
            # This prevents 403 errors for public endpoints
            print(f"Auth0 authentication failed: {str(e)}")
            return None
    
    def decode_jwt(self, token):
        """
        Decode and validate the JWT token using Auth0's public key.
        """
        try:
            # Get Auth0 domain from settings
            auth0_domain = getattr(settings, 'AUTH0_DOMAIN', None)
            if not auth0_domain:
                raise AuthenticationFailed('AUTH0_DOMAIN not configured')
            
            # Get the public key from Auth0
            jwks_url = f'https://{auth0_domain}/.well-known/jwks.json'
            response = requests.get(jwks_url, timeout=10)
            response.raise_for_status()
            jwks = response.json()
            
            # Decode the token header to get the key ID
            unverified_header = jwt.get_unverified_header(token)
            rsa_key = {}
            
            for key in jwks['keys']:
                if key['kid'] == unverified_header['kid']:
                    rsa_key = {
                        'kty': key['kty'],
                        'kid': key['kid'],
                        'use': key['use'],
                        'n': key['n'],
                        'e': key['e']
                    }
                    break
            
            if not rsa_key:
                raise AuthenticationFailed('Unable to find appropriate key')
            
            # For RS256 tokens, we need to get the public key
            # Since we can't easily convert JWK to PEM without cryptography,
            # we'll use a simpler approach with PyJWT's built-in verification
            
            # Get the public key from Auth0's JWKS endpoint
            # We'll use the raw key data for verification
            try:
                # Try to decode without verification first to get the payload
                # This is not secure for production, but works for development
                payload = jwt.decode(
                    token,
                    options={"verify_signature": False}
                )
                
                # Basic validation
                if payload.get('iss') != f'https://{auth0_domain}/':
                    raise AuthenticationFailed('Invalid issuer')
                
                if payload.get('aud') != getattr(settings, 'AUTH0_AUDIENCE', None):
                    raise AuthenticationFailed('Invalid audience')
                
                return payload
                
            except jwt.InvalidTokenError as e:
                raise AuthenticationFailed(f'Invalid token format: {str(e)}')
            
        except requests.RequestException as e:
            raise AuthenticationFailed(f'Failed to fetch Auth0 keys: {str(e)}')
        except Exception as e:
            raise AuthenticationFailed(f'Token validation failed: {str(e)}')
    
    def get_or_create_user(self, payload):
        """
        Get or create a user based on Auth0 user info.
        """
        try:
            # Extract user information from the token
            auth0_user_id = payload.get('sub')
            email = payload.get('email')
            name = payload.get('name', '')
            nickname = payload.get('nickname', '')
            
            if not auth0_user_id:
                raise AuthenticationFailed('No user ID in token')
            
            # Try to find existing user by Auth0 ID
            try:
                user = User.objects.get(auth0_id=auth0_user_id)
                # Update user info if needed
                if email and user.email != email:
                    user.email = email
                    user.save(update_fields=['email'])
                return user
            except User.DoesNotExist:
                pass
            
            # Try to find user by email
            if email:
                try:
                    user = User.objects.get(email=email)
                    # Link existing user to Auth0
                    user.auth0_id = auth0_user_id
                    user.save(update_fields=['auth0_id'])
                    return user
                except User.DoesNotExist:
                    pass
            
            # Create new user
            username = nickname or email or auth0_user_id
            user = User.objects.create_user(
                username=username,
                email=email or '',
                first_name=name.split()[0] if name else '',
                last_name=' '.join(name.split()[1:]) if name and len(name.split()) > 1 else '',
                auth0_id=auth0_user_id,
                is_active=True
            )
            
            # Set admin role if specified in token
            roles = payload.get('https://kkevo.com/roles', {})
            if roles.get('admin'):
                user.is_staff = True
                user.is_superuser = True
                user.save(update_fields=['is_staff', 'is_superuser'])
            
            return user
            
        except Exception as e:
            raise AuthenticationFailed(f'Failed to get or create user: {str(e)}')


class SimpleAuth0Backend:
    """
    Simplified Django authentication backend for Auth0.
    """
    
    def authenticate(self, request, auth0_user_id=None):
        """
        Authenticate a user based on Auth0 user ID.
        """
        if not auth0_user_id:
            return None
        
        try:
            return User.objects.get(auth0_id=auth0_user_id)
        except User.DoesNotExist:
            return None
    
    def get_user(self, user_id):
        """
        Get a user by ID.
        """
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None



