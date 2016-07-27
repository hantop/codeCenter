/**
 * Created by 汤文辉 on 2016-07-19.
 */


;(function(win,doc,$){

    $.fn.progress = function(options){

        var setting = {

            val: 0,
            showText: "#*val*#%"

        };

        var opt = $.extend({},setting,options);//扩展初始化参数

        return this.each(function(){

            //更新进度条进度（更新进度回调，100%回调）
            function update(val){
                $(this).attr('data-pro',val).find('.proBg').width(val+"%");
                $(this).find('.frontText').text(formatText(val));
            }

            //格式化显示文字
            function formatText(val){

                return opt.showText.replace("#*val*#",val);

            }


            //将定义的更新进度条的方法挂接至jquery的原型中
            $(this).__proto__.update = update;

            //初始化进度条
            $(this).update(opt.val);

            //获取进度条进度
            $(this).__proto__.getVal = function(){

                return $(this).attr('data-pro');

            };

        });

    };

})(window,document,$);