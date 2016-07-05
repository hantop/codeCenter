/**
 * Created by kiner on 2016-05-05.
 */

(function($,win,doc){

    win.Util = win.Util || {};

    win.Util.rename = function(dtd,objFns){
        var pro = dtd.promise();
        for(var o in objFns){

            var fn = objFns[o];
            for(var i in fn){

                pro[i] = dtd[o];

            }

        }
        return pro;
    };

    function ajax(url,data,type,dataType,isLoading){

        var dtd = $.Deferred();
        $.ajax({
            url: url,
            data: data,
            type : type || "post",
            dataType: dataType || "text",
            beforeSend: function(){
                if(isLoading){
                    //TODO  再此添加显示加载代码
                }
            },
            success: function(data){
                dtd.resolve(data);
            },
            error: function(){
                dtd.reject.apply(this,arguments);
            },
            complete: function(){
                dtd.always.apply(this,arguments);
                if(isLoading){
                    //TODO  再此添加隐藏加载代码
                }
            }
        });

        return win.Util.rename(dtd,{
            done: {
                success: dtd.done
            },
            fail: {
                error: dtd.fail
            },
            always: {
                complete: dtd.always
            },
            progress: {
                pro: dtd.progress
            }
        });

    }

    /**
     *  ajax
     */
    win.Util.ajax = ajax;


    /**
     * 延迟执行
     * @param time
     * @returns {*}
     */
    win.Util.wait = function(time) {
        return $.Deferred(function(dfd) {
            setTimeout(dfd.resolve, time);
        });
    };

    /**
     * 定时任务
     * @param time  定时执行时间
     * @param breakCallback 结束任务回调，返回true为结束任务，返回为false继续执行任务
     * @returns {*}
     */
    win.Util.task = function(time,breakCallback){
        return $.Deferred(function(dfd){

            //计时因子
            var i = 0;
            var timer = setInterval(function(){
                if(breakCallback(i)){
                    clearInterval(timer);
                    dfd.resolve(i);
                }else{
                    i++;
                    dfd.notify(i);
                }
            },time);
        });
    };

})($,window,document);
