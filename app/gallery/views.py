from flask import Blueprint, render_template, request, current_app
from flask.ext.login import login_user
import simplejson
from .models import Image

# Static files only work for blueprints registered with url_prefix
#  https://github.com/mitsuhiko/flask/issues/348
gallery = Blueprint('gallery', __name__, template_folder='templates', static_folder='static')


@gallery.route('/', methods=['GET', 'POST', ])
def show_gallery():
    images = Image.all()
    return render_template('gallery/index.html', images=images)


@gallery.route('/json')
def json():
    """Return a JSON containing an array of URL pointing to
    the images.
    """
    images = Image.all()
    start = 0
    stop = len(images)

    try:
        if request.method == 'GET' and 'start' in request.args:
            start = int(request.args.get('start'))
        if request.method == 'GET' and 'stop' in request.args:
            stop = int(request.args.get('stop'))
    except ValueError:
        current_app.logger.debug(request)
        return ("start/stop parameters must be numeric", 400)

    images = images[start:stop]

    image_filenames = map(lambda x: x.filename, images)

    return simplejson.dumps(image_filenames)


@gallery.route('/upload', methods=['POST', ])
def upload():
    if request.method == 'POST' and 'image' in request.files:
        image = request.files['image']
        Image('', image)

        return ("ok", 201,)
