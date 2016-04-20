from hashlib import md5
import time
import os
from flask import render_template, request, abort, redirect, url_for
from flask.ext.login import login_required
from . import gallery

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])


def check_extension(extension):
    return extension in ALLOWED_EXTENSIONS


@gallery.route('/index')
@gallery.route('/')
@login_required
def index():
    print 'come here'

    return render_template('gallery/index.html')

# @gallery.route('/', methods=['GET', 'POST'])
# def upload_pic():
#     if request.method == 'POST':
#         file = request.files['file']
#         try:
#             extension = file.filename.rsplit('.', 1)[1].lower()
#         except IndexError, e:
#             abort(404)
#         if file and check_extension(extension):
#             # Salt and hash the file contents
#             filename = md5(file.read() + str(round(time.time() * 1000))).hexdigest() + '.' + extension
#             file.seek(0)  # Move cursor back to beginning so we can write to disk
#             # file.save(os.path.join(gallery.config['UPLOAD_DIR'] or , filename))
#             file.save(os.path.join('/var/landpack/', filename))
#             add_pic(filename)
#             gen_thumbnail(filename)
#             return redirect(url_for('show_pic', filename=filename))
#         else:  # Bad file extension
#             abort(404)
#     else:
#         return render_template('upload.html', pics=get_last_pics())
