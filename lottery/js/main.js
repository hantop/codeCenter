/**
 * Created by Administrator on 16/8/15.
 */


(function () {

    var timer = null;

    //需要进行预加载的图片
    var preloadImgs = [
        // "./imgs/tip_title_bg.png",
        "./imgs/introduce.png",
        "./imgs/tip_bg.png",
        // "./imgs/dialog_bg_white.png",
        // "./imgs/dialog_bg_yellow.png",
        "./imgs/lotteryBtn.png",
        "./imgs/brand.png",
        "./imgs/btn_bg.png",
        "./imgs/input_bg.png",
        "./imgs/lotteryContent.png",
        "./imgs/page_footer.png",
        // "./imgs/result_panel.png",
        "./imgs/main_bg.png",
        "./imgs/main_title.png",
        "./imgs/redbag.png",
        "./imgs/award.png"
    ];

    var tools = {

        /**
         * 根据id显示对话框
         * @param id
         * @param clickMask2Close
         */
        showDialog: function (id, clickMask2Close, animated) {

            var dialogClass = $('#' + id).attr('class');
            var maskClass = $('.mask').attr('class');


            animated = true;
            if (animated) {

                $(".mask").show().addClass("fadeInDown");
                $('#' + id).show().addClass("fadeInDown")
                    .on('webkitAnimationEnd', function () {

                        $(".mask").attr('class', maskClass);
                        $(this).attr('class', dialogClass);

                    });


            } else {
                $('.mask').show();
                $('#' + id).show();

            }

            if (clickMask2Close) {

                (function(maskClass,dialogClass,id){

                    $(".mask").unbind('click').on('click', function () {



                        $(".mask").hide().attr('class', maskClass);
                        $("#"+id).hide().attr('class', dialogClass);
                        clearInterval(timer);
                        // $(".mask").addClass("fadeOut");
                        // $("#" + id).addClass("fadeOut")
                        //     .on('webkitAnimationEnd', function () {
                        //
                        //         $(".mask").hide().attr('class', maskClass);
                        //         $(this).hide().attr('class', dialogClass);
                        //
                        //     });

                    });

                })(maskClass,dialogClass,id);



            }




        },
        /**
         * 隐藏所有弹出框
         */
        hideDialog: function () {

            $(".mask").hide();
            $(".dialog").hide();
            clearInterval(timer);

        },

        /**
         * 倒计时基础函数
         * @param time
         * @param updateHandler
         * @param completeHandler
         */
        cutdown: function (time, updateHandler, completeHandler) {

            var timer = setInterval(function () {

                if (time == 0) {

                    clearInterval(timer);
                    completeHandler();

                } else {

                    updateHandler(time--);


                }


            }, 1000);

            return timer;

        },

        /**
         * 根据转盘旋转角度判断获得什么奖品
         * @param deg
         * @returns {*}
         */
        whichAward: function (deg) {

            if ((deg > 330 && deg <= 360) || (deg > 0 && deg <= 30)) {//10M流量
                return "三网通流量 10M";
            } else if ((deg > 30 && deg <= 90)) {//IPhone 7
                return "iPhone7";
            } else if (deg > 90 && deg <= 150) {//30M流量
                return "三网通流量 30M";
            } else if (deg > 150 && deg <= 210) {//5元话费
                return "话费5元";
            } else if (deg > 210 && deg <= 270) {//IPad mini 4
                return "ipad mini4";
            } else if (deg > 270 && deg <= 330) {//20元话费
                return "话费20元";
            }

        }

    };

    /**
     * 大转盘初始化
     */
    function lotteryInit(opt) {

        var lottery = new Lottery({
            rotateNum: 8,//转盘转动圈数
            body: "#box",//大转盘整体的选择符或zepto对象
            direction:0,//0为顺时针转动,1为逆时针转动

            disabledHandler: opt.disabledHandler || function (key) {

                switch (key) {
                    case "noStart":
                        alert("活动尚未开始");
                        break;
                    case "completed":
                        alert("活动已结束");
                        break;
                }

            },//禁止抽奖时回调

            clickCallback: opt.clickHandler || function () {

                //此处访问接口获取奖品
                function random() {
                    return Math.floor(Math.random() * 360);
                }


                this.goLottery(random());

            },//点击抽奖按钮,再次回调中实现访问后台获取抽奖结果,拿到抽奖结果后显示抽奖画面

            lotteryHandler: opt.lotteryHandler || function (deg) {

                alert('抽奖结果是:' + deg);
                alert("恭喜您获得:" + tools.whichAward(deg));


            }//抽奖结束回调
        });

        return lottery;

    }

    lotteryInit({

        clickHandler: function () {
            //此处访问接口获取奖品
            function random() {
                return Math.floor(Math.random() * 360);
            }


            this.goLottery(random());
        },
        lotteryHandler: function (deg) {


            var award = tools.whichAward(deg);
            var awardPic = $('.award-dialog .award-pic');


            if (award == "iPhone7" || award == "ipad mini4") {//手机
                awardPic.removeClass("liuliang").removeClass("huafei").addClass("phone");
            } else if (award.indexOf("流量") != -1) {//流量
                awardPic.removeClass("phone").removeClass("huafei").addClass("liuliang");
            } else if (award.indexOf("话费") != -1) {//话费
                awardPic.removeClass("liuliang").removeClass("phone").addClass("huafei");
            }

            $('#award-name').text(award);

            tools.showDialog("awardDialog", true)


        }

    });




    var pageController = {

        /**
         * 首次进入页面
         */
        page_1: function () {

            tools.hideDialog();
            $('.lotteryBox').show();
            $('.award-show').hide();//奖品展示
            $('.recharge').hide();//已充值提示
            $('#fourthBtn').hide();
            $('#inputArea').show();
            $('.lotteryBtn').removeClass('start').removeClass('completed').addClass('no-start');

        },
        /**
         * 非本次渠道注册用户进入此页面
         */
        page_2: function () {

            tools.hideDialog();
            $('.lotteryBox').hide();
            $('.award-show').hide();//奖品展示
            $('.recharge').hide();//已充值提示

            $('.award-show.redbag').show();//奖品展示

        },
        /**
         * 用户已经抽过奖进入此页面
         */
        page_3: function () {


            tools.hideDialog();
            $('.lotteryBox').hide();
            $('.award-show').hide();//奖品展示
            $('.recharge').hide();//已充值提示

            $('.award-show.phone').show();//奖品展示

        },

        /**
         * 抽奖结束
         */
        page_4: function () {
            tools.hideDialog();
            $('.lotteryBox').show();
            $('.award-show').hide();//奖品展示
            $('.recharge').hide();//已充值提示
            $('.lotteryBtn').removeClass('start').removeClass('no-start').addClass('completed');
            $('#fourthBtn').show();
            $('#inputArea').hide();
        },
        /**
         * 支付过,进入抽奖页面
         */
        page_5: function () {
            // tools.hideDialog();
            $('.lotteryBox').show();
            $('.award-show').hide();//奖品展示
            $('.recharge').show();//已充值提示
            $('#fourthBtn').hide();
            $('#inputArea').hide();
            $('.lotteryBtn').removeClass('no-start').removeClass('completed').addClass('start');
        },
        /**
         * 未支付,调用微信支付sdk跳转至支付页,支付完成后提交订单信息到后台,提交陈恭候返回page_5
         */
        page_6: function () {

        },
        preload:function(){


            var pro = new progress({

                width: '100%',//进度条宽度

                height: '.1rem',//进度条高度

                bgColor: "#fffeea",//背景颜色

                proColor: "#0088ff",//前景颜色

                fontColor: "#FFFFFF",//显示字体颜色

                val: 0,//默认值

                float: true,

                text: "当前进度为#*val*#%",//显示文字信息

                showPresent: true

            });

            var imgPreload = new ImagePreloader({

                imgs: preloadImgs || [],
                maxErrLoadNum:5,
                preloadSuccessHandler: function (pre,allTime) {

                    pro.update(pre);
                    console.log("正在加载图片[" + this.src + "],当前进度为:" + pre + "%;加载图片花费时间:"+allTime+"s");

                },
                preloadCompleteHandler: function (pre) {

                    $('.mask').hide().removeClass('unVisibility');
                    $('.preloadTip').hide();

                    pageController.page_1();

                    console.log("所有图片加载完成,当前进度为:" + pre + "%");

                }

            });


            $(document).ready(function(){
                $('.preloadTip').append(pro.getBody());
            });


            imgPreload.start();


        }

    };


    pageController.preload();

    $(document).ready(function(){



        //绑定规则提示弹出框
        $('.introduce').click(function () {

            tools.showDialog("ruleDialog", true);

        });

        //倒计时公用方法
        function doCutdown(id, time) {
            time = time || 60;
            $('#' + id + ' .getCode').attr('data-doing', true).removeClass('retry').text(time + "s");
            timer = tools.cutdown(time, function (time) {
                $('#' + id + ' .getCode').text(time + "s");
            }, function () {
                $('#' + id + ' .getCode').attr('data-doing', false).text("重新获取").addClass('retry');
            });
        }

        //用户输入框
        $('#firstInitBtn').click(function () {

            //首先获取到用户手机号码
            var mobile = $.trim($('#mobileNo').val());

            //前端校验手机号码码是否合法

            //将合法手机号码提交到后台,判断当前用户是否是新用户,该用户是否已经参与抽奖

            ///若用户为新用户
            // tools.showDialog("newUserDialog",true);

            //请求接口发送短信验证码

            //启动倒计时
            // doCutdown("newUserDialog",10);

            ///若用户未老用户且未参与过本次抽奖活动
            tools.showDialog("oldUserDialog", true);

            //请求接口发送短信验证码

            //启动倒计时
            doCutdown("oldUserDialog", 10);

            ///若用户为老用户但已经参与过本次抽奖活动

        });

        //重新获取验证码
        $('body').on('click', '.getCode', function () {

            var isDoing = $(this).attr('data-doing');

            if (isDoing != "true") {


                doCutdown($(this).parents('.dialog').attr('id'), 10);

            }

        });

        //新用户提交手机验证码和初始密码完成注册进入下一流程
        //老用户提交手机验证码进入下一流程
        $('.input-dialog .submit').click(function () {

            var p = $(this).parents(".input-dialog");

            var params = {

                code: $.trim(p.find('.code').val())

            };

            if (p.attr("id") == "newUserDialog") {

                params.password = $.trim(p.find('.pass').val());

            }

            if (params.code.length == 0) {

                alert('请输入您收到的短信验证码');
                return;

            }

            ///1.判断是否通过本次活动注册

            //1.1通过本次活动注册->2.判断是否已经抽过奖

            //2.1已经抽过奖->award-show phone

            //2.2未抽过奖->3.活动是否结束

            //3.1活动已经结束->显示lottery-box,lotteryBtn新增completed

            //3.2活动未结束->4.用户是否付款

            //4.1用户未付款->跳转到微信支付页->支付成功向后台提交订单信息

            //4.2用户已付款->显示lottery-box,lotteryBtn新增start->抽完奖后显示显示award-dialog->2.1

            //1.2不是通过本次活动注册->显示 award-show redbag


            //将数据提交之后端并跳转到下一流程: ?

            alert(JSON.stringify(params));


        });


    });


})(window, document, $);