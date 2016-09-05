/**
 * Created by Administrator on 16/8/28.
 */
;(function (win, doc, $) {

    $.fn.dataList = function (options) {

        var opts = $.extend(true, {}, $.fn.dataList.defaultOpt, options);

        var createId = (function () {

            return "kiner-select-box_" + (new Date()).getTime() + Math.floor(Math.random() * 999999);

        })();

        var tpl = [
            '<div class="kiner-select-box" id="' + createId + '">',
            '<div class="kiner-select-box-mask"></div>',
            '<div class="kiner-select-box-data-list">',
            '<h2 class="kiner-select-box-title"><span class="main-title"></span></h2>',
            '<ul class="kiner-select-box-list">',
            '</ul>',
            '</div>',
            '</div>'];

        return this.each(function () {

            var $this = $(this);
            var self = null;
            var thisOld = "";


            var time = 0;

            var tools = {
                self: null,
                show: function (handler) {
                    self.find('.kiner-select-box-data-list').slideUp(0);
                    self.find(".kiner-select-box-mask").fadeOut(0);
                    self.show();
                    thisOld = self.attr('data-value');

                    self.find(".kiner-select-box-mask").stop().fadeIn(time, function () {

                        self.find('.kiner-select-box-data-list').stop().slideDown(time, function () {

                            if(self.find(".kiner-select-box-list").find('.current').length!=0){


                                var top = (self.find(".kiner-select-box-list").find('.current').index())*self.find(".kiner-select-box-list").find('.current').height();

                                top-=(self.find('.kiner-select-box-data-list').height()-self.find('.kiner-select-box-title').height()-self.find(".kiner-select-box-list").find('.current').height())/2;

                                self.find(".kiner-select-box-list").scrollTop(top);
                            }
                            $this.triggerHandler('shown',[tools]);
                            handler && handler();

                        });

                    });
                },

                hide: function (handler) {

                    self.find('.kiner-select-box-data-list').stop().slideUp(time, function () {

                        self.find(".kiner-select-box-mask").stop().fadeOut(time, function () {

                            self.find(".kiner-select-box-list").scrollTop(0);
                            $this.triggerHandler('hidden',[tools]);

                            var thisNow = self.attr('data-value') + "";

                            if (thisOld == thisNow) {

                                $this.triggerHandler("cancel", [tools,thisNow || undefined, opts.data[thisNow + ""] || undefined]);

                            }

                            self.hide();
                            handler && handler();

                        });

                    });
                },
                setOptions: function(options){
                    tools.remove(createId);
                    opts = $.extend(true, {}, $.fn.dataList.defaultOpt, opts , options);
                    tools.init(opts,false);
                },

                remove:function(id){
                    // console.log("移除:"+id);
                    $("#"+id).remove();
                },

                getVal: function(){
                    return $this.attr("data-value");
                },

                init:function(opts,isReady){

                    time = opts.isAnimation ? 300 : 0;

                    var body = $(tpl.join(""));
                    var box = $(opts.target);

                    if(box.find('#'+createId).length==0){
                        box.append(body);
                    }


                    tools.self = self = box.find("#" + createId);


                    self.find(".kiner-select-box-title .main-title").text(opts.title || $this.text() || $this.val() || "默认标题");

                    if (opts.showResult && opts.val && opts.val.trim().length != 0) {

                        self.find(".kiner-select-box-title").append('<span class="result">(' + opts.data[opts.val] + ')</span>');
                    }

                    if (opts.showClose) {
                        self.find('.kiner-select-box-title').append('<span class="close">×</span>').on('click', '.close', function () {

                            tools.hide();

                        });
                    }


                    self.attr('data-value', opts.val);


                    for (var key in opts.data) {

                        if (opts.val != undefined) {

                            if (opts.val == key) {
                                self.find(".kiner-select-box-list").append('<li class="current" data-value="' + key + '">' + opts.data[key] + '</li>');
                            } else {
                                self.find(".kiner-select-box-list").append('<li data-value="' + key + '">' + opts.data[key] + '</li>');
                            }

                        } else {
                            self.find(".kiner-select-box-list").append('<li data-value="' + key + '">' + opts.data[key] + '</li>');
                        }


                    }



                    if(isReady){

                        opts.ready&&opts.ready.call(tools,opts);

                    }


                    $this.attr('data-id', createId).on('click', function () {

                        tools.show();


                    });

                    self.find('.kiner-select-box-list').on('click', 'li', function () {

                        var oldVal = self.attr('data-value');
                        $(this).addClass('current').siblings().removeClass('current');
                        var val = $(this).attr('data-value');
                        self.attr('data-value', val);
                        $this.attr('data-value',val);

                        var top = $(this).index()*$(this).height();

                        top-=(self.find('.kiner-select-box-data-list').height()-self.find('.kiner-select-box-title').height()-$(this).height())/2;

                        self.find(".kiner-select-box-list").scrollTop(top);

                        $this.triggerHandler('selected', [tools,val, opts.data[val]]);

                        if (oldVal != val) {

                            if (opts.showResult) {
                                if (self.find(".kiner-select-box-title").find('.result').length == 0) {
                                    self.find(".kiner-select-box-title").append('<span class="result">(' + opts.data[val] + ')</span>');
                                } else {
                                    self.find(".kiner-select-box-title .result").text('(' + opts.data[val] + ')');
                                }

                            }
                            $this.triggerHandler('change', [tools,val, opts.data[val]]);
                        }

                        if (opts.select2close) {
                            tools.hide();

                        }

                    });

                    self.find('.kiner-select-box-mask').click(function () {

                        if (opts.click2close) {
                            tools.hide();
                        }

                    });
                }

            };

            tools.init(opts,true);




        });

    };
    $.fn.dataList.defaultOpt = {
        title: "",
        val: "",
        data: {},
        showResult: true,
        showClose: true,
        click2close: true,
        select2close: true,
        isAnimation: true
    };


})(window, document, $);