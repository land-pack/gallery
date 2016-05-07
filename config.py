import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard to guess string'
    SQLALCHEMY_COMMIT_ON_TEARDOWN = True
    LANDPACK_MAIL_SUBJECT_PREFIX = '[Gallery]'
    LANDPACK_MAIL_SENDER = 'Landpack <landpack@sina.com>'
    ADMIN = '123@qq.com'
    LANDPACK_POSTS_PER_PAGE = 20
    LANDPACK_IMAGE_PER_PAGE = 5
    UPLOAD_FOLDER = '/var/lib/flask-tmp/uploads'
    ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'git'])

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    # DEBUG = True
    MAIL_SERVER = 'smtp.sina.com'
    MAIL_PORT = 25
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME') or 'landpack@sina.com'
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD') or 'landpack911!@#'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or \
                              'sqlite:///' + os.path.join(basedir, 'data-dev.sqlite')


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL') or \
                              'sqlite:///' + os.path.join(basedir, 'data-test.sqlite')


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
                              'sqlite:///' + os.path.join(basedir, 'data.sqlite')


config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
