/**
 * Created by kiner on 2016-07-15.
 */
/**
 * 注意：本插件运用了rem屏幕适配方案，一律采用rem作为单位，若项目中不是采用这种方案的，请在kinerTreeMenu.css中修改样式，此段代码不会影响功能使用，仅会影响控件样式
 */
(function (doc, win) {
    // if (window.isScreenAdpat) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 20 * (clientWidth / 720) + 'px';
            // win.remDefineCallback&&win.remDefineCallback(clientWidth,720,20);//屏幕宽度  设计图宽度  设计图字体大小
        };
    //alert(doc.addEventListener)
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    //doc.addEventListener('DOMContentLoaded', recalc, false);
    recalc();
    // }

})(document, window);


;(function(win,doc){

    function I(name){

        var _name = name,_nickname = "王八蛋",_property="丑不垃圾，傻乎乎，榆木脑袋，王八羔子";

        this.getProperty = function(){
            return _property;
        };

        this.setProperty = function(property){
            _property = property;
        };
        this.setName = function(name){
            _name = name;
        };

        this.getName = function(name){
            return _name;
        };

        this.Love = function(u){

            if(u instanceof U){
                doc.getElementById("box").innerHTML+="<b class='message mine'>我是"+_name+"，我的妻子是"+u.getName()+"，我爱"+u.getName()+"<div class='tongue'></div></b>";
            }else{
                doc.getElementById("box").innerHTML+="<b class='message mine'>我是"+_name+"，我的性取向没有问题，别来烦我！<div class='tongue'></div></b>";
            }

            return true;

        };


        this.say = function(u){
            doc.getElementById("box").innerHTML+="<b class='say mine'>"+u.getName()+"，我爱你！</b>";
        };

    }

    function U(name){

        I.apply(this,arguments);

        var _nickName = "萌萌",_property="冰雪聪明，美丽倾城，善解人意，温柔可爱，贤良淑德";

        this.getProperty = function(){
            return _property;
        };

        this.setProperty = function(property){
            _property = property;
        };

        this.Love = function(i){

            if(i instanceof I){
                doc.getElementById("box").innerHTML += "<b class='message you'>我叫"+name+"，你也可以叫我"+_nickName+"，我的老公是"+i.getName()+"，我也很爱他！<div class='tongue'></div></b>";
            }else{
                doc.getElementById("box").innerHTML += "<b class='message you'>讨厌，人家喜欢男的啦！<div class='tongue'></div></b>"
            }

            return true;
        };

        this.say = function(i){
            doc.getElementById("box").innerHTML+="<b class='say you'>虽然我"+_property+"，而你又"+i.getProperty()+"，但我还是想对你说："+i.getName()+"，我爱你！</b>";
        };

    }

    win.I = I;
    win.U = U;

})(window,document);
