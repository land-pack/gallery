from flask.ext.mail import Message
from flask import current_app, render_template
from . import mail


def send_mail(to, subject, templates, **kwargs):
    msg = Message(current_app.config['LANDPACK_MAIL_SUBJECT_PREFIX'] + subject,
                  sender=current_app.config['LANDPACK_MAIL_SENDER'], recipients=[to])
    msg.body = render_template(templates + '.txt', **kwargs)
    # msg.html = render_template(templates + '.html', **kwargs)
    mail.send(msg)
