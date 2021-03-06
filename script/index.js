var docuWidth = document.documentElement.clientWidth;
var docuHeight = document.documentElement.clientHeight;
//js获取url参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
var arrayAudio = [];
$.ajax({
    type: "post",
    url: "http://www.dadpat.com/api/res/batch/list/top.do",
    dataType: "jsonp", //以键/值对的形式
    async: true,
    success: function (data) {
        var datasA = data.data;
        var random = Math.floor(Math.random() * datasA.length);
        var myownerId = datasA[random].batchId;
        console.log(myownerId)
        $.ajax({
            type: "post",
            url: "http://www.dadpat.com/api/res/list/summary.do",
            dataType: "jsonp",
            data: { "ownerId": myownerId }, //以键/值对的形式
            async: true,
            success: function (data) {
                var datasB = data.data;
                //console.log(datasB)
                var responseLen = 0;
                for (var i = 0; i < datasB.length; i++) {
                    var myresourceId = datasB[i].resourceId;
                    //console.log(myresourceId)
                    $.ajax({
                        type: "post",
                        url: "http://www.dadpat.com/api/res/get.do",
                        dataType: "jsonp",
                        data: { "resId": myresourceId }, //以键/值对的形式
                        async: true,
                        success: function (data) {
                            var datasC = data.data;
                            //console.log(datasC)
                            var sourceWidth = 1080;
                            var sourceHeight = 1920;
                            try {
                                $('body').css({
                                    'height': docuHeight,
                                    'width': docuWidth,
                                    'background-color': '#272E38',
                                    'overflow': 'hidden'
                                });
                                $('#wrapper').append('<div class="swiper-slide"><div class="animal" style="background: -webkit-linear-gradient(left top,' +
                                    datasC.colorBegin + ',' + datasC.colorEnd + ')"id="a1"><a href="details.html?resourceId=' + datasC.resourceId +
                                    '"><img data-src="http://www.dadpat.com/' + datasC.image.cover.attUrl +
                                    '" class="swiper-lazy" alt=""/><div class="swiper-lazy-preloader"></div></a><div class="voice"><img  src="image/voiced.png" class="swiperes" alt=""/><a onclick="opendetails(' +
                                    datasC.resourceId + ')">' + datasC.resourceTitle + '</a></div></div></div>');
                                $('.animal').css({
                                    'width': Math.floor(0.73 * docuWidth),
                                    'height': Math.floor(0.74 * docuHeight),
                                    'margin': '0 auto',
                                    'border-radius': '0.3rem',
                                    'position': 'relative',
                                    'margin-top': '3.5rem'
                                });
                                $('.animal a img').css({
                                    'position': 'absolute',
                                    'max-width': Math.floor(874 / sourceWidth * docuWidth),
                                    'max-height': Math.floor(760 / sourceHeight * docuHeight),
                                    'display': 'block',
                                    'left': Math.floor(-0.1 * 0.73 * docuWidth),
                                    'top': Math.floor(0.08 * 0.74 * docuHeight),
                                    'cursor': 'pointer',
                                    'padding-bottom': '8rem'
                                });
                                $('.animal .voice').css({
                                    'position': 'absolute',
                                    'right': Math.floor(0.04 * 0.73 * docuWidth),
                                    'top': Math.floor(0.61 * 0.74 * docuHeight)
                                });
                                var audio = datasC.audio;
                                arrayAudio.push(audio);
                                $('.audioBox').append('<audio src="http://www.dadpat.com/' + datasC.audio[0].attUrl + '" autoplay></audio>');
                            }
                            catch (err) {

                            }
                            if (++responseLen == datasB.length) {
                                loadSwiper();
                            }

                            // 调用Android的自动播音频--初始化音乐
                            var audioBox = document.querySelectorAll('.audioBox audio');
                            window.android.initMusic(audioBox[0].src);
                            window.android.startMusic();
                        },
                        error: function () {
                            ++responseLen;
                        }
                    })
                }
            }
        })
    }
});


function loadSwiper() {
    //Swiper滑动js
    var animalAudio = $('.cry');
    var m_swiper = new Swiper('.swiper-container', {
        direction: 'horizontal', //水平方向滑动
        loop: true,  //让Swiper看起来是循环的
        observer: true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,//修改swiper的父元素时，自动初始化swiper
        watchSlidesVisibility: true,
        lazy: {
            loadPrevNext: true  //设置为true允许将延迟加载应用到最接近的slide的图片（前一个和后一个slide）
        },
        slideToClickedSlide: true, //点击的slide会居中
        on: {
            slideChangeTransitionStart: function () {
                //自动播放声音
                var audioBox = document.querySelectorAll('.audioBox audio');
                var imgclick = document.querySelectorAll('.swiperes');
                var imgClick = Array.prototype.slice.call(imgclick).slice(1, -1);
                var inde = this.activeIndex - 1;
                if (inde > audioBox.length - 1) {
                    inde = 0;
                }
                let arrayLength = '';
                for (var i = 0; i < arrayAudio.length; i++) {
                    if (inde == -1) {
                        inde = audioBox.length - 1;
                    }
                    arrayLength = arrayAudio[inde].length;
                }
                var audio = '';
                if (arrayLength > 1) {
                    var random = Math.floor(Math.random() * arrayLength);
                    audio = arrayAudio[inde][random];
                } else {
                    audio = arrayAudio[inde]
                }
                if (inde) {
                    audioBox[inde].src = 'http://www.dadpat.com/' + audio.attUrl;
                } else {

                }
                for (var j = 0; j < imgClick.length; j++) {
                    imgClick[j].onclick = '';
                }
                if (audioBox[inde].paused) { //如果播放停止为ture
                    for (var i = 0; i < audioBox.length; i++) {
                        audioBox[i].pause();
                    }
                    audioBox[inde].play();
                    imgClick[inde].onclick = function () {
                        var audioA = document.querySelectorAll('.audioBox audio');
                        for (var k = 0; k < audioA.length; k++) {
                            audioA[k].pause();
                        }
                        audioA[inde].play();
                        var times = Math.ceil($(audioBox[inde])[0].duration + 1) + '000';
                        $(this).attr('src', "image/gif.gif");
                        setTimeout(function () {
                            $(".swiperes").attr('src', 'image/voiced.png')
                        }, times)
                    };
                }
                $(window).one('touchstart', function () {
                    audioBox[inde].play();
                });
            }
        }
    });
}
function indexBack() {
    if (typeof (goofypapaGame) != "undefined" && goofypapaGame) {
        window.location.href = 'goofypapa://back';
    }
}

// 调用Android的退出app
$('.back').click(function(){
    window.android.exitApp();
})