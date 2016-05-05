import logging
from logging.handlers import RotatingFileHandler


def create_logger(path='/tmp/gallery.log', level=logging.INFO):
    formatter = logging.Formatter(
            "[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s")

    handler = RotatingFileHandler(path, maxBytes=10000, backupCount=1)
    handler.setLevel(level)
    handler.setFormatter(formatter)
    return handler
