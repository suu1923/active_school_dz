$(document).ready(function () {
    // set page width and height
    $(".box").css("width", ($(window).width()) * 4);
    $(".page").css({
        "width": $(window).width(),
        "height": $(window).height(),
    })
    $("canvas").css({
        "width": $(window).width(),
        "height": $(window).height(),
    })
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

    // $(this).parents("li").next().find("div[class='animate']").show("slow")
    // goto next
    $(this).parents("li").hide("slow");


})
$("#two_btn").on("click", function () {
    // goto next & save page data
    $(this).parents("li").hide("slow");

    $(".write_btn").show("slow");
    $(".write_title").show("slow");
    $(".write_content").show("slow");
})
// reset  & save
$("#reset_btn").on("click", function () {
    $("input,textarea").val("");
    $(".write_title input").focus()
})
$("#save_btn").on("click", function () {
    // judge data
    // var title = $(".write_title input").val();
    // var content = $(".write_content textarea").val();
    // if(title.length == 0 || title.length > 5){
    // 	alert("名字不能为空");
    // 	$(".write_title input").focus();
    // 	return false;
    // }
    // if(content.length == 0 || content.length > 25){
    // 	alert("内容不能为空");
    // 	$(".write_content textarea").focus();
    // 	return false;
    // }
    // goto next
    $(this).parents("li").hide("slow");
    //
    let peopleImage = "static/images/peoples/" + nowSortNum + ".png"
    $("#people_name_end").text(slideNameArr[nowSortNum]);
    $(".people_choosed").fadeToggle(2000).show();
    $("#slide_img_end").attr("src", peopleImage);
    $(".qr,.share").show("slow")
    let imgArr = ['static/images/share-bg.png', peopleImage, 'static/images/qr.png']
    draw(imgArr, slideNameArr[nowSortNum], function (e) {
        // console.log(e)
        $('#getImage').attr('src', e)
    })
})
