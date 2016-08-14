
/**
 * 注意：本插件运用了rem屏幕适配方案，一律采用rem作为单位，若项目中不是采用这种方案的，请在kinerTreeMenu.css中修改样式，此段代码不会影响功能使用，仅会影响控件样式
 */
// (function (doc, win) {
//     // if (window.isScreenAdpat) {
//     var docEl = doc.documentElement,
//         body = doc.body,
//         resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
//         recalc = function () {
//             var clientWidth = docEl.clientWidth;
//             if (!clientWidth) return;
//             docEl["style"].fontSize = 20 * (clientWidth / 720) + 'px';
//             // win.remDefineCallback&&win.remDefineCallback(clientWidth,720,20);//屏幕宽度  设计图宽度  设计图字体大小
//         };
//     //alert(doc.addEventListener)
//     if (!doc.addEventListener) return;
//     win.addEventListener(resizeEvt, recalc, false);
//     //doc.addEventListener('DOMContentLoaded', recalc, false);
//     recalc();
//     // }
//
// })(document, window);

(function (win, doc, $) {

    var defaultOpt = {

        rotateNum:5,//转盘转动圈数
        rotateTime:'5s',//转动一周所用时间
        body:"",//大转盘整体的选择符或zepto对象


        disabledHandler:function(){},//禁止抽奖时回调

        clickCallback:function(){},//点击抽奖按钮,再次回调中实现访问后台获取抽奖结果,拿到抽奖结果后显示抽奖画面

        lotteryHandler:function(deg){}//抽奖结束回调


    };

    function Lottery(opts) {

        this.opts = $.extend(true,{},defaultOpt,opts);

        this.init();

    }

    Lottery.prototype.setOpts = function(opts){


        this.opts = $.extend(true,{},defaultOpt,opts);

        this.init();

    };

    Lottery.prototype.init = function () {

        var self = this;


        this.defNum = this.opts.rotateNum * 360;//转盘需要转动的角度
        console.log(this.defNum);


        // alert(this.defNum);

        //点击抽奖
        $('body').on('click',".lotteryBtn",function(){


            if($(this).hasClass('start')){

                console.log('点击');

                self.opts.clickCallback.call(self);

            }else{

                self.opts.disabledHandler();

            }


        });

        $(this.opts.body).find('.lotteryContent').get(0).addEventListener('webkitTransitionEnd',function(){

            var deg = $(self.opts.body).attr('data-deg');

            $(self.opts.body).find('.lotteryContent').css({
                '-webkit-transition':'none',
                'transition':'none',
                '-webkit-transform':'rotate('+(deg)+'deg)',
                'transform':'rotate('+(deg)+'deg)'
            });

            self.opts.lotteryHandler(deg);

        });



    };


    Lottery.prototype.goLottery = function(_deg){

        var deg=_deg+this.defNum;

        $(this.opts.body).find('.lotteryContent').css({
            '-webkit-transition':'all 5s',
            'transition':'all 5s',
            '-webkit-transform':'rotate('+deg+'deg)',
            'transform':'rotate('+deg+'deg)'
        }).end().attr('data-deg',_deg);

    };



    win.Lottery = Lottery;

})(window, document, $);


/*


 $(function() {
 window.requestAnimFrame = (function() {
 return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
 window.setTimeout(callback, 1000 / 60)
 }
 })();
 var totalDeg = 360 * 3 + 0;
 var steps = [];
 var lostDeg = [36, 66, 96, 156, 186, 216, 276, 306, 336];
 var prizeDeg = [6, 126, 246];
 var prize, sncode;
 var count = 0;
 var now = 0;
 var a = 0.01;
 var outter, inner, timer, running = false;

 function countSteps() {
 var t = Math.sqrt(2 * totalDeg / a);
 var v = a * t;
 for (var i = 0; i < t; i++) {
 steps.push((2 * v * i - a * i * i) / 2)
 }
 steps.push(totalDeg)
 }

 function step() {
 outter.style.webkitTransform = 'rotate(' + steps[now++] + 'deg)';
 outter.style.MozTransform = 'rotate(' + steps[now++] + 'deg)';
 if (now < steps.length) {
 requestAnimFrame(step)
 } else {
 running = false;
 setTimeout(function() {
 if (prize != null) {
 $("#sncode").text(sncode);
 var type = "";
 if (prize == 1) {
 type = "一等奖"
 } else if (prize == 2) {
 type = "二等奖"
 } else if (prize == 3) {
 type = "三等奖"
 }
 $("#prizetype").text(type);
 $("#result").slideToggle(500);
 $("#outercont").slideUp(500)
 } else {
 alert("谢谢您的参与，下次再接再厉")
 }
 }, 200)
 }
 }

 function start(deg) {
 deg = deg || lostDeg[parseInt(lostDeg.length * Math.random())];
 running = true;
 clearInterval(timer);
 totalDeg = 360 * 5 + deg;
 steps = [];
 now = 0;
 countSteps();
 requestAnimFrame(step)
 }
 window.start = start;
 outter = document.getElementById('outer');
 inner = document.getElementById('inner');
 i = 10;
 $("#inner").click(function() {
 if (running) return;
 if (count >= 3) {
 alert("您已经抽了 3 次奖。");
 return
 }
 if (prize != null) {
 alert("亲，你不能再参加本次活动了喔！下次再来吧~");
 return
 }
 $.ajax({
 url: "index.php",
 dataType: "json",
 data: {
 token: "o7MB9ji5fQRsE0ZoVAMU7SlnRyMI",
 ac: "activityuser",
 tid: "5",
 t: Math.random()
 },
 beforeSend: function() {
 running = true;
 timer = setInterval(function() {
 i += 5;
 outter.style.webkitTransform = 'rotate(' + i + 'deg)';
 outter.style.MozTransform = 'rotate(' + i + 'deg)'
 }, 1)
 },
 success: function(data) {
 if (data.error == "invalid") {
 alert("您已经抽了 3 次奖。");
 count = 3;
 clearInterval(timer);
 return
 }
 if (data.error == "getsn") {
 alert('本次活动你已经中过奖，本次只显示你上次抽奖结果!兑奖SN码为:' + data.sn);
 count = 3;
 clearInterval(timer);
 prize = data.prizetype;
 sncode = data.sn;
 start(prizeDeg[data.prizetype - 1]);
 return
 }
 if (data.success) {
 prize = data.prizetype;
 sncode = data.sn;
 start(prizeDeg[data.prizetype - 1])
 } else {
 prize = null;
 start()
 }
 running = false;
 count++
 },
 error: function() {
 prize = null;
 start();
 running = false;
 count++
 },
 timeout: 4000
 })
 })
 });
 $("#save-btn").bind("click", function() {
 var btn = $(this);
 var tel = $("#tel").val();
 if (tel == '') {
 alert("请输入手机号码");
 return
 }
 var regu = /^[1][0-9]{10}$/;
 var re = new RegExp(regu);
 if (!re.test(tel)) {
 alert("请输入正确手机号码");
 return
 }
 var submitData = {
 tid: 5,
 code: $("#sncode").text(),
 tel: tel,
 action: "setTel"
 };
 $.post('index.php?ac=activityuser', submitData, function(data) {
 if (data.success == true) {
 alert("提交成功，谢谢您的参与");
 return
 } else {}
 }, "json")
 });*/
