import sys
from PIL import Image, ImageDraw, ImageFont

txt = 'hello'


def text_image(text, FontType='Helvetica', tag=24):
    font = ImageFont.truetype(FontType, tag)
    im = Image.new("RGBA", (300, 200), (0, 0, 0))
    draw = ImageDraw.Draw(im)
    draw.text((0, 50), unicode(text, 'UTF-8'), font=font)
    del draw
    im.save(sys.stdout, "PNG")


if __name__ == '__main__':
    text_image(text=txt)
