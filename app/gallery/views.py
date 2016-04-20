import os
from flask import Blueprint, render_template, request, current_app, send_from_directory, \
    redirect, url_for, flash
from flask.ext.login import login_user, login_required
from werkzeug import secure_filename
import simplejson
from ..models import Image
from . import gallery
from .forms import ImageForm
from app import db


@gallery.route('/', methods=['GET', 'POST'])
@gallery.route('/index', methods=['GET', 'POST'])
def index():
    page = request.args.get('page', 1, type=int)
    pagination = Image.query.order_by(Image.timestamp.desc()).paginate(
            page, per_page=current_app.config['LANDPACK_POSTS_PER_PAGE'],
            error_out=False
    )
    posts = pagination.items
    return render_template('gallery/index.html', posts=posts, pagination=pagination)


@gallery.route('/upload', methods=['GET', 'POST'])
def upload():
    form = ImageForm()
    if request.method == 'POST':
        filename = secure_filename(form.image.data.filename)
        image_url = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        form.image.data.save(image_url)
        image = Image(url=filename)
        db.session.add(image)
        db.session.commit()
        flash('You have add a new photo!')
        return redirect(url_for('.index'))
    else:
        filename = None

    return render_template('gallery/upload.html', form=form)


@gallery.route('/uploads/<filename>')
def send_image(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)


@gallery.route('/scale/<filename>')
def scale_image(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)
