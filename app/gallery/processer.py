#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
from PIL import Image, ImageEnhance, ImageDraw, ImageFont


def text2img(text, font_color="Blue", font_size=25, FontString='Helvetica'):
    """生成内容为 TEXT 的水印"""

    font = ImageFont.truetype(FontString, font_size)
    # 多行文字处理
    text = text.split('\n')
    mark_width = 0
    for i in range(len(text)):
        (width, height) = font.getsize(text[i])
        if mark_width < width:
            mark_width = width
    mark_height = height * len(text)

    # 生成水印图片
    mark = Image.new('RGBA', (mark_width, mark_height))
    draw = ImageDraw.ImageDraw(mark, "RGBA")
    draw.setfont(font)
    for i in range(len(text)):
        (width, height) = font.getsize(text[i])
        draw.text((0, i * height), text[i], fill=font_color)
    return mark


def set_opacity(im, opacity):
    """设置透明度"""

    assert opacity >= 0 and opacity < 1
    if im.mode != "RGBA":
        im = im.convert('RGBA')
    else:
        im = im.copy()
    alpha = im.split()[3]
    alpha = ImageEnhance.Brightness(alpha).enhance(opacity)
    im.putalpha(alpha)
    return im


def watermark(im, mark, x, y, alpha, opacity=1):
    """添加水印"""

    try:
        if opacity < 1:
            mark = set_opacity(mark, opacity)
        if im.mode != 'RGBA':
            im = im.convert('RGBA')
        if im.size[0] < mark.size[0] or im.size[1] < mark.size[1]:
            print "The mark image size is larger size than original image file."
            return False

        layer = Image.new('RGBA', im.size, )
        layer.paste(mark, (x, y))
        return Image.composite(layer, im, layer)
    except Exception as e:
        print ">>>>>>>>>>> WaterMark EXCEPTION:  " + str(e)
        return False


def generate_watermark(current_app, current_user, filename, text, x, y, alpha=0.9, font_size=25, myopacity=1,
                       font_color="Blue"):
    personal_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], str(current_user.id))
    im = Image.open(os.path.join(personal_dir, filename))
    mark = text2img(text, font_size=font_size, font_color=font_color)
    x_scale = x / 300.0
    y_scale = y / 300.0
    real_x = im.size[0] * x_scale  # origin x
    real_y = im.size[1] * y_scale  # origin y
    print real_x
    print real_y
    new_img = watermark(im, mark, int(real_x), int(real_y), alpha, opacity=myopacity)
    if new_img:
        new_img_name = 'mark_' + filename
        new_img.save(os.path.join(personal_dir, new_img_name))
    else:
        print "Sorry, Failed."


def main():
    text = u'Linsir.水印.\nvi5i0n@hotmail.com'
    # text = open('README.md').read().decode('utf-8')
    # print text
    im = Image.open('origal.png')
    mark = text2img(text)
    image = watermark(im, mark, 'center', 0.9)
    if image:
        image.save('watermark.png')
        image.show()
    else:
        print "Sorry, Failed."


if __name__ == '__main__':
    main()
