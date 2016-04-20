from flask.ext.wtf import Form
from wtforms import StringField, PasswordField, BooleanField, SubmitField, IntegerField
from wtforms.validators import Required, Email, Length, Regexp, EqualTo
from wtforms import ValidationError
from flask_wtf.file import FileField


class ImageForm(Form):
    name = StringField('Image Name', validators=[Length(1, 64)])
    tag = IntegerField('Tag Value', default=50, validators=[Required(), Length(1, 64)])
    image = FileField('Your photo')
    submit = SubmitField('Upload Image')
