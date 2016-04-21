from flask.ext.wtf import Form
from wtforms import StringField, PasswordField, BooleanField, SubmitField, IntegerField, SelectField
from wtforms.validators import Required, Email, Length, Regexp, EqualTo, Optional, DataRequired
from wtforms import ValidationError
from flask_wtf.file import FileField


class ImageForm(Form):
    name = StringField('Image Name', validators=[Length(1, 64)])
    tag = IntegerField('Tag Value', default=50, validators=[Required(), Length(1, 64)])
    image = FileField('Your photo')
    submit = SubmitField('Upload Image')


class ImageSettingForm(Form):
    name = StringField('A new Name For the Image', validators=[Optional()])
    alpha = IntegerField('Alpha Value', default=0.5)
    watermark_shape = StringField('WaterMark Shape')
    db = SelectField('DB range', choices=[('female', 'female'), ('male', 'male')], validators=[DataRequired()]
                     )  # 'db1', 'db2', 'db3', 'db4', 'db5', 'db6'

    submit = SubmitField('Go')