/**
 * Created by 汤文辉 on 2016-07-19.
 */

(function(win,doc){


    $.fn.progress = function(options){

        var defaultVal = {

            val: 0,
            showText:"当前进度为#*val*#%"

        };

        var opt = $.extend({},defaultVal,options);

        return this.each(function(){


            //1.实现更新进度条进度的方法

            function update(val){

                $(this).attr('data-pro',val).find('.proBg').width(val+"%");

                $(this).find('.frontText').text(format(val));


            }

            //文字格式化
            function format(val){

                return opt.showText.replace("#*val*#",val);

            }

            $(this).__proto__.update = update;

            $(this).update(opt.val);

            //2.获取进度条进度的的方法
            function getVal(){

                return $(this).attr('data-pro');

            }
            $(this).__proto__.getVal = getVal;



        });

    };



})(window,document,$);