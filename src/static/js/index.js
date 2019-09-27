$(document).ready(function () {
    // set page width and height
    $(".box").css("width", ($(window).width()) * 4);
    $(".page,#getImage,.mask_pic").css({
        "width": $(window).width(),
        "height": $(window).height(),
    })
    // $("canvas").css({
    //     "width": $(window).width(),
    //     "height": $(window).height(),
    // })
});
/*
* animation
*/
// star twinkle
setInterval(function () {
    $(".star").fadeOut(1000).fadeIn(1000);
}, 500);
// all .animate element add fade effect
// $(".animate").fadeToggle(2000)
$(".goto_next_page").fadeToggle(2000)

// slide
var slideNameArr = ["宇航员", "厨师", "人民医生", "人民教师", "中国人民解放军", "学生", "运动员", "工人", "艺术工作者", "消防员"];

var nowSortNum = 0;
// default
$("#people_name").text(slideNameArr[nowSortNum]);
$("#slide_img").attr("src", "static/images/peoples/" + nowSortNum + ".png");
// left right btn click
$(".left_btn").on("click", function () {
    if (nowSortNum <= 0) {
        nowSortNum = 9;
    } else {
        nowSortNum -= 1;
    }
    $("#people_name").text(slideNameArr[nowSortNum]);
    $("#slide_img").attr("src", "static/images/peoples/" + nowSortNum + ".png");
})
$(".right_btn").on("click", function () {
    if (nowSortNum >= 9) {
        nowSortNum = 0;
    } else {
        nowSortNum += 1;
    }
    $("#people_name").text(slideNameArr[nowSortNum]);
    $("#slide_img").attr("src", "static/images/peoples/" + nowSortNum + ".png");

})
// page jump
$("#start_btn").on("click", function () {
    $(".choose_num,.people_choose,.goto_write").fadeToggle(2000).show();
    $(this).parents("li").hide();
})
$("#two_btn").on("click", function () {
    // goto next & save page data
    $(this).parents("li").hide();

    $(".write_btn").show();
    $(".write_title").show();
    $(".write_content").show();
})

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


// reset  & save
$("#reset_btn").on("click", function () {
    $("input,textarea").val("");
    $(".write_title input").focus()
})
$(".share").on('click',function(){
    $(".mask_pic").show();
})
$(".mask_pic").on("click",function(){
    $(this).hide()
})
$("#save_btn").on("click", function () {
    // judge data
    var title = $(".write_title input").val();
    var content = $(".write_content textarea").val();
    if(title.length == 0 || title.length > 5){
    	alert("名字不能为空");
    	$(".write_title input").focus();
    	return false;
    }
    if(content.length == 0 || content.length > 25){
    	alert("内容不能为空");
    	$(".write_content textarea").focus();
    	return false;
    }
    // goto next
    $(this).parents("li").hide("slow");
    
    // socket
    // 生成数组
    var userdata = {
        // headImg:"{$Think.session.wx_member_info.headimgurl}",
        nickName:title,
        content:content,
        chooseNum:nowSortNum,
        type:"user"
    }
    var ws = new WebSocket("ws://120.77.153.138:2346");
    ws.onopen = function() {
        console.log("socket connect success");
        ws.send(JSON.stringify(userdata));
        // console.log("给服务端发送一个字符串：tom");
    };

    let peopleImage = "static/images/peoples/" + nowSortNum + ".png"
    $("#people_name_end").text(title);
    $(".people_choosed").fadeToggle(2000).show();
    $("#slide_img_end").attr("src", peopleImage);
    $(".qr,.share").show("slow")
    let imgArr = ['static/images/share-bg.png', peopleImage, 'static/images/qr.png']
    draw(imgArr, title+":<br/>"+content, function (e) {
        // console.log(e)
        $('#getImage').attr('src', e)
    })
})
