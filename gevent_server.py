from manage import app
from gevent.wsgi import WSGIServer

application = WSGIServer(("", 5000), app)
