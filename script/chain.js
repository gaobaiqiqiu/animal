var ajaxBox=function () {
    function GetQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
//定义变量接收url参数
    var myresId=GetQueryString("resourceId");
    $.ajax({
        type:"post",
        url:"http://www.dadpat.com/foodChain/get.do",
        dataType:"jsonp",
        data:{"resId":myresId}, //以键/值对的形式
        async:false,
        success:function (data) {
            var datas=data.data;
            console.log(datas)
            var windowRealHeight = document.documentElement.clientHeight;
            var windowRealWidth = document.documentElement.clientWidth;
            var sourceWidth = 1080;
            var sourceHeight = 1920;
            //背景图
            $("body").append('<img src=http://www.dadpat.com/'+datas.bgImg+' class="backgroundImg">');
            $('body').css({
                'height': windowRealHeight,
                'width': windowRealWidth,
                'position': 'absolute',
                'top': 0,
                'bottom': 0
            });
            $('.backgroundImg').css({
                'height': windowRealHeight,
                'width': windowRealWidth,
                'position': 'absolute',
                'top': 0,
                'z-index': -1
            });
            $('.chainUlBox .chainLi1 img').css({
                "width": Math.floor(53 / sourceWidth * windowRealWidth),
                "height": Math.floor(118 / sourceHeight * windowRealHeight),
                "margin-top": Math.floor(30 / sourceHeight * windowRealHeight)
            });
            $('.chainUlBox .chainLi3 img').css({
                "width": Math.floor(53 / sourceWidth * windowRealWidth),
                "height": Math.floor(118 / sourceHeight * windowRealHeight),
                "margin-top": Math.floor(30 / sourceHeight * windowRealHeight)
            });
            $('.chainUlBox').css({
                'height': windowRealHeight,
                'width': windowRealWidth,
            });
            $('.chainBox')[0].attributes[1].nodeValue='http://www.dadpat.com/'+datas.fullImg;
            var itemLent = datas.items;
            console.log(itemLent);
            var arr = [];
            for(var i=0,item;i<itemLent.length;i++){
                /*获取上、中、下游的动、植物*/
                if(itemLent[i].itemLocation=='up'){
                    //获取上游动物
                    $(".chainDiv0").append('<div><span class="animalAll"><img src=http://www.dadpat.com/'+
                        itemLent[i].itemImg+' alt="" class="img01" style="height:'+ Math.floor(itemLent[i].itemHeight / sourceHeight * windowRealHeight ) +'px; width:'
                        + Math.floor(itemLent[i].itemWidth / sourceWidth * windowRealWidth ) +'px;margin-left: '+ Math.floor(itemLent[i].itemLeft / sourceWidth * windowRealWidth ) +'px;margin-top:'+
                        Math.floor(itemLent[i].itemTop / sourceHeight * windowRealHeight )+'px ;"/><p style="margin-left: '+ Math.floor(itemLent[i].itemLeft / sourceWidth * windowRealWidth ) +'px">'+itemLent[i].itemName+'</p></span></div>')
                }else if(itemLent[i].itemLocation=='self'){
                    $(".chainDiv2").append('<div class="arrSelfTwo"><span class="animalAll"><img src=http://www.dadpat.com/'+
                        itemLent[i].itemImg+' alt="" class="img01" style="height:'+ Math.floor(itemLent[i].itemHeight / sourceHeight * windowRealHeight ) +'px; width:'
                        + Math.floor(itemLent[i].itemWidth / sourceWidth * windowRealWidth ) +'px;margin-left: '+ Math.floor(itemLent[i].itemLeft / sourceWidth * windowRealWidth ) +'px;margin-top:'+
                        Math.floor(itemLent[i].itemTop / sourceHeight * windowRealHeight )+'px ;"/><p style="margin-left: '+ Math.floor(itemLent[i].itemLeft / sourceWidth * windowRealWidth ) +'px">'+itemLent[i].itemName+'</p></span></div>')
                }else if(itemLent[i].itemLocation=='down'){
                    //获取下游动物
                    $(".chainDiv4").append('<div><span class="animalAll"><img src=http://www.dadpat.com/'+
                        itemLent[i].itemImg+' alt="" class="img01" style="height:'+ Math.floor(itemLent[i].itemHeight / sourceHeight * windowRealHeight ) +'px; width:'
                        + Math.floor(itemLent[i].itemWidth / sourceWidth * windowRealWidth ) +'px;margin-left: '+ Math.floor(itemLent[i].itemLeft / sourceWidth * windowRealWidth ) +'px;margin-top:'+
                        Math.floor(itemLent[i].itemTop / sourceHeight * windowRealHeight )+'px ;"/><p style="margin-left: '+ Math.floor(itemLent[i].itemLeft / sourceWidth * windowRealWidth ) +'px">'+itemLent[i].itemName+'</p></span></div>')
                }
                /*获取动、植物的描述*/
                var pDesc = document.querySelectorAll('.chainUlBox p');
                for (var n=0;n<pDesc.length;n++){
                    let itemIdP = itemLent[i].resId;
                    if(itemIdP!=null){  //判断是否存在可跳转的resId
                        if(pDesc[n].innerText==itemLent[i].itemName){
                            let imDesc= pDesc[n].previousSibling;
                            imDesc.onclick=function () {
                                $.ajax({
                                    type:"post",
                                    url:"http://www.dadpat.com/resource/getResourceInfo.do",
                                    dataType:"jsonp",
                                    data:{"resourceId":itemIdP}, //以键/值对的形式
                                    async:true,
                                    success:function(){
                                        window.location.href="details.html?resourceId="+itemIdP+"&imgType=default";
                                    }
                                })
                            }
                        }
                    }else if(itemLent[i].itemDesc!=null){ //判断动物是否有简介--描述
                        let itemLentI =itemLent[i].itemDesc;
                        if(pDesc[n].innerText==itemLent[i].itemName){
                            var imDescS= pDesc[n].previousSibling;  //点击的div
                            imDescS.onclick=function () {
                                document.querySelector(".abstract").addEventListener("click", function (e) {
                                    e.stopPropagation()
                                });
                                document.querySelector(".abstract").addEventListener("touchmove", function (e) {
                                    e.stopPropagation()
                                });
                                document.querySelector('.abstract').style.display="block";
                                document.querySelector('.dang').style.display="block";
                                $('.abstract').append('<button>'+itemLentI+'</button><img src="image/closeTwo.png">');
                                $(".abstract img").click(function () {
                                    document.querySelector('.abstract').style.display="none";
                                    document.querySelector('.dang').style.display="none";
                                    document.querySelector('.abstract').innerHTML = "";
                                })
                            }
                        }
                    }else if(pDesc[n].innerText==itemLent[i].itemName&&itemLent[i].itemType=='type'){
                        var imDescT= pDesc[n].previousSibling;
                        $(pDesc[n]).append('<img src="image/downTriangle.png" style="height: 0.25rem;">');
                        arr.push(imDescT);
                        let abc = itemLent[i];
                        var body = document.querySelector('body');
                        let imDescTc = imDescT;
                        imDescT.onclick=function(even) {
                            var imDescTParent = imDescTc.parentNode;
                            even.stopPropagation();
                            var pThis = $(this)[0].nextSibling;
                            $(pThis).after('<ul class="chainUlTwo"></ul>');
                            $('.chainUlTwo').css({
                                'display': 'flex',
                                'justify-content': 'center',
                                'position': 'absolute',
                                'z-index': 100,
                                'top': (imDescTParent.offsetTop+imDescTParent.offsetHeight+10)+'px',
                                'left': 0,
                                'width': '100%',
                                'border-top': '0.1rem solid rgba(255,255,255,0.7)',
                                'border-bottom': '0.1rem solid rgba(255,255,255,0.7)',
                                'background-color': 'rgba(0,0,0,0.5)'
                            });
                            $.ajax({
                                type: "post",
                                url: "http://www.dadpat.com/foodChain/item/list.do",
                                dataType: "jsonp",
                                data: {"ownerId": abc.itemId}, //以键/值对的形式
                                async: true,
                                success: function (data) {
                                    var listDatas = data.data;
                                    document.querySelector('.dang').style.display = "block";

                                    /*当遮挡层出现时，禁用放大镜*/
                                    $('.chainUlTwo').append('<li><img src="image/zhengsanjiao.png" class="chainUlImg"></li>');
                                    $('.chainUlImg').css({
                                        'position': 'absolute',
                                        'z-index': 110,
                                        'top': '-0.55rem',
                                        'left': (imDescTc.offsetLeft+imDescTc.offsetWidth/2-18)+'px',
                                        'width':'1rem',
                                    });
                                    document.querySelector(".chainUlTwo").addEventListener("click", function (e) {
                                        e.stopPropagation()
                                    });
                                    document.querySelector(".chainUlTwo").addEventListener("touchmove", function (e) {
                                        e.stopPropagation()
                                    });
                                    for (var k = 0; k < listDatas.length; k++) {
                                        $('.chainUlTwo').append('<li><img src=http://www.dadpat.com/'+ listDatas[k].itemImg + ' style="height:'+ Math.floor(listDatas[k].itemHeight / sourceHeight * windowRealHeight ) +'px; width:'+ Math.floor(listDatas[k].itemWidth / sourceWidth * windowRealWidth ) +'px;"/><p style="margin-bottom: 0.1rem">' + listDatas[k].itemName + '</p></li>')
                                        var pDesc = document.querySelectorAll('.chainUlTwo p');
                                        for (var n=0;n<pDesc.length;n++){
                                        /*获取分类下动、植物的描述*/
                                            if(listDatas[k].itemDesc!=null){
                                                let itemLentI =listDatas[k].itemDesc;
                                                if(pDesc[n].innerText==listDatas[k].itemName){
                                                    var imDesc= pDesc[n].previousSibling;
                                                    imDesc.onclick=function () {
                                                        document.querySelector('.abstract').style.display="block";
                                                        document.querySelector('.dang').style.display="block";
                                                        $('.abstract').append('<button>'+itemLentI+'</button><img src="image/closeTwo.png">');
                                                        if($('.abstract')[0].style.display=='block'){
                                                            document.onclick=null;
                                                            $(".abstract img").click(function (e) {
                                                                e.stopPropagation();
                                                                document.querySelector('.abstract').style.display="none";
                                                                document.querySelector('.dang').style.display="block";
                                                                document.querySelector('.abstract').innerHTML = "";
                                                                if ($('.abstract')[0].style.display=='none'){
                                                                    document.onclick = function () {
                                                                        var chainUlTwo = document.querySelector('.chainUlTwo');
                                                                        if(chainUlTwo==null){
                                                                            return false
                                                                        }else{
                                                                            chainUlTwo.parentNode.removeChild(chainUlTwo);
                                                                            document.querySelector('.dang').style.display = "none";
                                                                        }
                                                                    };
                                                                }
                                                            });
                                                        }
                                                    };
                                                    document.onclick = function () {
                                                        var chainUlTwo = document.querySelector('.chainUlTwo');
                                                        if(chainUlTwo==null){
                                                            return false
                                                        }else{
                                                            chainUlTwo.parentNode.removeChild(chainUlTwo);
                                                            document.querySelector('.dang').style.display = "none";
                                                        }
                                                    };
                                                }
                                            }else if(listDatas[k].resId!=null){
                                                if(pDesc[n].innerText==listDatas[k].itemName){
                                                    let imDescF= pDesc[n].previousSibling;
                                                    imDescF.onclick=function () {
                                                        $.ajax({
                                                            type:"post",
                                                            url:"http://www.dadpat.com/resource/getResourceInfo.do",
                                                            dataType:"jsonp",
                                                            data:{"resourceId":itemIdP}, //以键/值对的形式
                                                            async:true,
                                                            success:function(){
                                                                window.location.href="details.html?resourceId="+itemIdP+"&imgType=default";
                                                            }
                                                        })
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        };
                        document.onclick = function () {
                            var chainUlTwo = document.querySelector('.chainUlTwo');
                            if(chainUlTwo==null){
                                return false
                            }else{
                                chainUlTwo.parentNode.removeChild(chainUlTwo);
                                document.querySelector('.dang').style.display = "none";
                            }
                        };
                    }
                }
            }
            //设置问号下边的文字为空字符串
            var pAll = document.querySelectorAll('p');
            for(var i=0;i<pAll.length;i++){
                if(pAll[i].innerText=='未知'){
                    pAll[i].innerText='';
                }
            }
            if($('.chainDiv2 .animalAll').length>1){
                $('.chainLi1').remove();
                $('.chainDiv2 .animalAll').before('<li class="chainLiAdd"><img src="image/jiantou.png"></li>');
                $('.arrSelfTwo').css({
                    'display':'fixed',
                    'flex-direction': 'column',
                    'float': 'left'
                });
                var chainDiv2Img = document.querySelectorAll('.chainDiv2 .animalAll img');
                var chainLiAddImg = document.querySelectorAll('.chainLiAdd img');
                for(var j=0;j<chainDiv2Img.length;j++){
                    chainLiAddImg[j].style.height = Math.floor(118 / sourceHeight * windowRealHeight)+'px';
                    chainLiAddImg[j].style.width = Math.floor(53 / sourceWidth * windowRealWidth)+'px';
                    chainLiAddImg[j].style.marginTop = Math.floor(30 / sourceHeight * windowRealHeight)+'px';
                    chainLiAddImg[j].style.marginLeft =Math.floor(chainDiv2Img[j].width/2-chainLiAddImg[j].width/2+parseInt(chainDiv2Img[j].style.marginLeft))+'px';
                }
            }
            $( document ).bind( "enhance", function(){
                $( "body" ).addClass( "enhanced" );
            });
            $( document ).trigger( "enhance" );
            setTimeout(function(){
            	document.querySelector('.button').style.display='none';
            },2000)
        }
    });
};