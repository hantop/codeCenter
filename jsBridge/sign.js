;(function(win,doc){
    "use strict";

    var password = "r#PIo@gnA2%$K3@Z";


    /***
     *  数据加密
     * @param data
     * @returns {string}
     * @constructor
     */
    win.sign = function(data){

        var str = "";

        data = data || {};

        str = Aes.Ctr.encrypt(encodeURIComponent(JSON.stringify(data)), password, 256);


        return str;


    };

})(window,document);