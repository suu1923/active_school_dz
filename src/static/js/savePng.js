function draw(imgArr, title, callback) {
    let c = document.getElementById('canvas'),
        ctx = c.getContext('2d'),
        len = imgArr.length
    let devicePixelRatio = window.devicePixelRatio || 1,
        backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1,
        ratio = devicePixelRatio / backingStoreRatio;
    c.width = 375 * ratio;
    c.height = 667 * ratio;
    let oldWidth = c.width;
    let oldHeight = c.height;
    c.style.width = oldWidth + 'px';
    c.style.height = oldHeight + 'px';

    function canvas_text(_paint, _text, _fontSzie, _color, _height) {
        _paint.font = _fontSzie;
        _paint.fillStyle = _color;
        _paint.textAlign = "center";
        _paint.textBaseline = "middle";
        _paint.fillText(_text, c.width / 2, _height);
    }

    function drawing(n) {
        if (n < len) {
            let img = new Image()
            img.crossOrigin = 'Anonymous';
            img.src = imgArr[n]
            img.onload = function () {
                // 0:背景 1:人物 2:头像
                if (n == 0) {
                    ctx.drawImage(img, 0, 0, c.width, c.height)
                    canvas_text(ctx, title, "62px bold 微软雅黑", "#FFF", c.height * 0.15)
                } else if (n == 1) {
                    ctx.drawImage(img, (c.width / 2) * 0.45, c.height * 0.25, c.width * 0.6, c.width * 0.6)
                } else if (n == 2) {
                    ctx.drawImage(img, (c.width / 2) * 0.825, (c.height / 1.125), c.width * 0.2, c.width * 0.2)
                }
                drawing(n + 1)
            }
        } else {
            callback(c.toDataURL('image/png', 1))
        }
    }

    drawing(0)
}
