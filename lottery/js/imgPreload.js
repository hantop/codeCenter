/**
 * 图片预加载通用处理方法
 * Created by Administrator on 16/8/17.
 */
(function(win,doc,$){

    var defOpts = {
        maxErrLoadNum: 0
    };

    var ImagePreloader = function(opts){

        this.opts = $.extend(true,{},defOpts,opts);
        this.count = 0;
        this.len = this.opts.imgs.length;

    };

    ImagePreloader.prototype.errorImgs = {};


    ImagePreloader.prototype.start = function(){

        var self = this;

        if(this.opts.imgs.length==0){


            this.opts.preloadCompleteHandler&&this.opts.preloadCompleteHandler(100);

            return;

        }

        var url = this.opts.imgs.shift();


        (function(url){


            var img = new Image();

            img.src = url;

            var startTime = new Date().getTime();

            console.info("正在加载图片[" + url + "]...");

            img.onload = function(){

                var endTime = new Date().getTime();

                var allTime = (endTime-startTime)/1000;

                self.count++;

                var pre = Math.floor((self.count/self.len)*100);

                self.opts.preloadSuccessHandler&&self.opts.preloadSuccessHandler.call(img,pre,allTime);

                img = null;

                self.start();

            };

            img.onerror = function(){

                if(self.opts.maxErrLoadNum==0){
                    console.log("图片[" + url + "]加载出错",arguments);
                    self.start();
                }else{

                    if(self.errorImgs[url]==undefined){
                        self.errorImgs[url] = 1;
                    }else{
                        self.errorImgs[url]++;
                    }


                    if(self.errorImgs[url]<self.opts.maxErrLoadNum){
                        console.log("图片[" + url + "]加载出错"+self.errorImgs[url]+"次,重新加入队列",arguments);
                        self.opts.imgs.push(url);
                    }else{
                        console.log("图片[" + url + "]加载出错"+self.errorImgs[url]+"次,资源可能损坏或被迁移,请检查后重试",arguments);
                    }

                    self.start();
                }




            };

        })(url)


    };

    win.ImagePreloader = ImagePreloader;



    /**
     * 纯js进度条
     * Created by kiner on 15/3/22.
     */

    function progress(options){

        this.w = (options && options.width)?options.width : this.options.width;
        this.h = (options && options.height)?options.height : this.options.height;
        this.bgColor = (options && options.bgColor)?options.bgColor : this.options.bgColor;
        this.proColor = (options && options.proColor)?options.proColor : this.options.proColor;
        this.fontColor = (options && options.fontColor)?options.fontColor : this.options.fontColor;
        this.showPresent = (options && options.showPresent != undefined)?options.showPresent : this.options.showPresent;
        this.completeCallback = (options && options.completeCallback)?options.completeCallback : this.options.completeCallback;
        this.changeCallback = (options && options.changeCallback)?options.changeCallback : this.options.changeCallback;
        this.text = (options && options.text)?options.text : this.options.text;
        this.val = (options && options.val)?options.val : this.options.val;
        this.float = (options && options.float != undefined)?options.float:false;

        this.w = isNaN(this.w)?this.w:this.w+"px";
        this.h = isNaN(this.h)?this.h:this.h+"px";



        this.strTemp = this.text.substring(0,this.text.indexOf('#*'))+"{{pro}}"+this.text.substring(this.text.indexOf('*#')+2);

        this.init();

    }
    /**
     * 默认选项
     * @type {{width: number, height: number, bgColor: string, proColor: string, fontColor: string, val: number, text: string, showPresent: boolean, completeCallback: Function, changeCallback: Function}}
     */
    progress.prototype.options = {

        width : 200,
        height: 30,
        bgColor : "#005538",
        proColor : "#009988",
        fontColor : "#FFFFFF",
        val : 0,
        text:"当前进度为#*val*#%",
        showPresent : true,
        completeCallback:function(){},
        changeCallback:function(){}

    };

    /**
     * 初始化
     */
    progress.prototype.init = function(){

        this.proBox = document.createElement('div');
        this.proBg = document.createElement('div');
        this.proPre = document.createElement('div');
        this.proFont = document.createElement('div');

        addClass(this.proBox,'proBox');
        addClass(this.proBg,'proBg');
        addClass(this.proPre,'proPre');
        addClass(this.proFont,'proFont');

        this.proBox.setAttribute("style","width:"+this.w+"; height:"+this.h+"; position:relative; ");
        this.proBg.setAttribute("style","background-color:"+this.bgColor+"; position:absolute; z-index:1; width:100%; height:100%; top:0; left:0;");
        this.proPre.setAttribute("style","transition:all 300ms; -moz-transition:all 300ms; -webkit-transition:all 300ms; -o-transition:all 300ms; width:"+this.val+"%; height:100%; background-color:"+this.proColor+"; position:absolute; z-index:2; top:0; left:0;");
        if(this.showPresent){

            var float = "";
            if(this.float){
                float = " position: absolute; left: 50%; transform: translate(-50%,1200%); ";
            }

            this.proFont.setAttribute("style","text-overflow:ellipsis; white-space:nowrap; *white-space:nowrap; width:100%; height:100%; color:"+this.fontColor+"; text-align:center; line-height:"+this.h+"px; z-index:3; position:absolute; font-size:.6rem;"+float);

            var text = this.parseText();
            this.proFont.innerHTML = text;
            this.proFont.setAttribute("title",text);
            this.proBox.appendChild(this.proFont);
        }


        this.proBox.appendChild(this.proBg);
        this.proBox.appendChild(this.proPre);

    };

    /**
     *
     */
    progress.prototype.refresh = function(){
        this.proPre.style.width = this.val+"%";

        this.proFont.innerHTML = this.parseText();
    };

    /**
     * 转换文字
     * @returns {options.text|*}
     */
    progress.prototype.parseText = function(){
        this.text = this.strTemp.replace("{{pro}}",this.val);
        return this.text;
    };

    /**
     * 更新进度条进度
     * @param val
     */
    progress.prototype.update = function(val){

        this.val = val;
        this.refresh();

        this.changeCallback.call(this,val);
        if(val==100){

            this.completeCallback.call(this,val);

        }
    };
    /**
     * 获取进度条本身的html对象，可直接将其塞入容器中
     * @returns {HTMLElement|*}
     */
    progress.prototype.getBody = function(){
        return this.proBox;
    };
    /**
     * 获取当前进度条的值
     * @returns {*}
     */
    progress.prototype.getVal = function(){
        return this.val;
    };

    function hasClass(obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    function addClass(obj, cls) {
        if (!hasClass(obj, cls)) obj.className += " " + cls;
    }

    function removeClass(obj, cls) {
        if (hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    }

    function toggleClass(obj,cls){
        if(hasClass(obj,cls)){
            removeClass(obj, cls);
        }else{
            addClass(obj, cls);
        }
    }

    win.progress = progress;



})(window,document,$);