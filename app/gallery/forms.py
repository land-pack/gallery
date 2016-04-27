from flask.ext.wtf import Form
from wtforms import StringField, PasswordField, BooleanField, SubmitField, IntegerField, SelectField, FloatField
from wtforms.validators import Required, Email, Length, Regexp, EqualTo, Optional, DataRequired
from wtforms import ValidationError
from flask_wtf.file import FileField


class ImageForm(Form):
    name = StringField('Image Name', validators=[Length(1, 64)])
    tag = IntegerField('Tag Value', default=50, validators=[Required(), Length(1, 64)])
    image = FileField('Your photo')
    submit = SubmitField('Upload Image')


class ImageSettingForm(Form):
    name = StringField('The context of watermark', validators=[Optional(), Length(1, 32)])
    alpha = IntegerField('Alpha Value', default=0.5)
    watermark_shape = StringField('WaterMark Shape', validators=[Length(1, 32)])
    db = SelectField('DB range', choices=[('db1', 'bd1'), ('db2', 'db2'), ('db3', 'db3')], validators=[DataRequired()]
                     )  # 'db1', 'db2', 'db3', 'db4', 'db5', 'db6'

    submit = SubmitField('Go')


class ImageDetailForm(Form):
    text = StringField('The context of watermark', default="Hello AK", validators=[Optional(), Length(1, 32)])
    font_color = SelectField('Water Mark Color', choices=[('Blue', 'Blue'), ('Red', 'Red'), ('Yellow', 'Yellow')])
    font_size = IntegerField('Font Size', default=25)
    alpha = FloatField('Alpha Value', default=0.5)
    x1 = IntegerField('X1', default=0)
    y1 = IntegerField('Y1', default=0)
    x2 = IntegerField('X2', default=0)
    y2 = IntegerField('Y2', default=0)
    width = IntegerField('width', default=0)
    height = IntegerField('height', default=0)
    submit = SubmitField("Go")
