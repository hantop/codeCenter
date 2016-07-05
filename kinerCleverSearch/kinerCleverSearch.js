/**
 * 智能搜索框
 * Created by kiner on 2016-06-15.
 */

try {
    $.trim("");
} catch (e) {
    $ = undefined;
}
;(function(win,doc,$){

    win.kinerCleverSearch = function (options) {

        this.opt = $.extend(true,{},options);

    };

    win.kinerCleverSearch.prototype.init = function(options){
        this.opt = $.extend(true,{},this.opt,options);

        this.data = $.extend(true,{},this.opt.data);

        this.input = $(this.opt.input);

        this.createTipPanel();

    };

    win.kinerCleverSearch.prototype.createTipPanel = function(){

        this.tipPanel = $('<div class="kinerCleverSearch_tipPanel"></div>');

    };

})(window,document,$);
