DEBUG = False
ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'webumlDB',
        'USER': 'webuml',
        'PASSWORD': 'webuml123',
        'HOST': 'localhost',
        'PORT': '',
    }
}
