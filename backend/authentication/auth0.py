"""
Auth0 authentication backend for Django REST Framework.
"""
import json
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from urllib.request import urlopen
from cryptography.hazmat.primitives.asymmetric.rsa import RSAPublicNumbers
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, serialization

User = get_user_model()


class Auth0Authentication(authentication.BaseAuthentication):
    """
    Custom authentication class for Auth0 JWT tokens.
    """
    
    def authenticate(self, request):
        """
        Authenticate the request and return a two-tuple of (user, token).
        """
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not auth_header.startswith('Bearer '):
            return None
            
        token = auth_header.split(' ')[1]
        
        try:
            # Decode the JWT token
            payload = self.decode_jwt(token)
            
            # Get or create user based on Auth0 user info
            user = self.get_or_create_user(payload)
            
            return (user, token)
            
        except Exception as e:
            raise AuthenticationFailed(f'Invalid token: {str(e)}')
    
    def decode_jwt(self, token):
        """
        Decode and validate the JWT token.
        """
        try:
            # Get Auth0 domain from settings
            auth0_domain = getattr(settings, 'AUTH0_DOMAIN', None)
            if not auth0_domain:
                raise AuthenticationFailed('AUTH0_DOMAIN not configured')
            
            # Get the public key from Auth0
            jwks_url = f'https://{auth0_domain}/.well-known/jwks.json'
            jwks = json.loads(urlopen(jwks_url).read())
            
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
            
            # Convert JWK to PEM format
            numbers = RSAPublicNumbers(
                int(rsa_key['n'], 16),
                int(rsa_key['e'], 16)
            )
            public_key = numbers.public_key(backend=default_backend())
            pem = public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            )
            
            # Verify and decode the token
            payload = jwt.decode(
                token,
                pem,
                algorithms=['RS256'],
                audience=getattr(settings, 'AUTH0_AUDIENCE', None),
                issuer=f'https://{auth0_domain}/'
            )
            
            return payload
            
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')
        except Exception as e:
            raise AuthenticationFailed(f'Token validation failed: {str(e)}')
    
    def get_or_create_user(self, payload):
        """
        Get or create a Django user based on Auth0 user info.
        """
        auth0_user_id = payload.get('sub')
        email = payload.get('email', '')
        name = payload.get('name', '')
        nickname = payload.get('nickname', '')
        
        if not auth0_user_id:
            raise AuthenticationFailed('No user ID in token')
        
        # Try to find existing user by Auth0 ID
        try:
            user = User.objects.get(auth0_id=auth0_user_id)
        except User.DoesNotExist:
            # Create new user if doesn't exist
            username = nickname or email.split('@')[0] if email else f'user_{auth0_user_id[:8]}'
            
            # Ensure username is unique
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f'{base_username}_{counter}'
                counter += 1
            
            user = User.objects.create_user(
                username=username,
                email=email,
                first_name=name.split(' ')[0] if name else '',
                last_name=' '.join(name.split(' ')[1:]) if name and len(name.split(' ')) > 1 else '',
                auth0_id=auth0_user_id,
                is_staff=payload.get('https://kkevo.com/roles', {}).get('admin', False),
                is_superuser=payload.get('https://kkevo.com/roles', {}).get('admin', False)
            )
        
        # Update user info if it has changed
        if user.email != email:
            user.email = email
        if user.first_name != (name.split(' ')[0] if name else ''):
            user.first_name = name.split(' ')[0] if name else ''
        if user.last_name != (' '.join(name.split(' ')[1:]) if name and len(name.split(' ')) > 1 else ''):
            user.last_name = ' '.join(name.split(' ')[1:]) if name and len(name.split(' ')) > 1 else ''
        
        # Update admin status based on roles
        is_admin = payload.get('https://kkevo.com/roles', {}).get('admin', False)
        if user.is_staff != is_admin:
            user.is_staff = is_admin
        if user.is_superuser != is_admin:
            user.is_superuser = is_admin
        
        user.save()
        return user


class Auth0Backend:
    """
    Django authentication backend for Auth0.
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






