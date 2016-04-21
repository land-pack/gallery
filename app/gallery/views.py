import os
from PIL import Image as Img
from flask import Blueprint, render_template, request, current_app, send_from_directory, \
    redirect, url_for, flash, abort
from flask.ext.login import login_user, login_required, current_user
from werkzeug import secure_filename
import simplejson
from ..models import Image, User
from . import gallery
from .forms import ImageForm, ImageSettingForm
from app import db


def gen_thumbnail(filename):
    height = width = 200
    personal_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], str(current_user.id))
    if os.path.exists(personal_dir):
        original = Img.open(os.path.join(personal_dir, filename))
        thumbnail = original.resize((width, height), Img.ANTIALIAS)
        thumbnail.save(os.path.join(personal_dir, 'thumb_' + filename))


@gallery.route('/', methods=['GET', 'POST'])
@gallery.route('/index', methods=['GET', 'POST'])
def index():
    page = request.args.get('page', 1, type=int)
    user = User.query.filter_by(username=current_user.username).first_or_404()
    if user is None:
        abort(404)
    pagination = user.image.order_by(Image.timestamp.desc()).paginate(
            page, per_page=current_app.config['LANDPACK_IMAGE_PER_PAGE'],
            error_out=False
    )
    posts = pagination.items
    return render_template('gallery/index.html', posts=posts, pagination=pagination)


@gallery.route('/upload', methods=['GET', 'POST'])
def upload():
    form = ImageForm()
    if request.method == 'POST':
        if form.image.data.filename:
            filename = secure_filename(form.image.data.filename)
            personal_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], str(current_user.id))
            if not os.path.exists(personal_dir):
                os.mkdir(personal_dir)
            image_url = os.path.join(personal_dir, filename)
            form.image.data.save(image_url)
            image = Image(url=filename, author=current_user._get_current_object())
            gen_thumbnail(filename)
            db.session.add(image)
            db.session.commit()
            flash('You have add a new photo!')
            return redirect(url_for('.index'))
        else:
            flash('You should choose a image to input')
            return redirect(url_for('.upload'))
    else:
        filename = None

    return render_template('gallery/upload.html', form=form)


@gallery.route('/uploads/<filename>')
def send_image(filename):
    personal_dir = current_app.config['UPLOAD_FOLDER'] + '/' + str(current_user.id)
    return send_from_directory(personal_dir, 'thumb_' + filename)


@gallery.route('/scale/<filename>')
def scale_image(filename):
    personal_dir = current_app.config['UPLOAD_FOLDER'] + '/' + str(current_user.id)
    return send_from_directory(personal_dir, filename)


@gallery.route('/detail/<filename>', methods=['GET', 'POST'])
def image_detail(filename):
    myform = ImageSettingForm()
    if myform.validate_on_submit():
        pass
    return render_template('gallery/image_detail.html', filename=filename, myform=myform)
