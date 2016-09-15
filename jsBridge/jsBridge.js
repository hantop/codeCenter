/**
 * Created by Administrator on 16/9/9.
 */

;(function(win,doc){


    win.appConfig = {
        actionName:{
            share: "doShare",//分享
            jumpLogin: "jumpLogin",//跳转至登录页
            getUserStatus: "getUserStatus",//获取用户登录状态
            uiMenu: "uiMenu"//页面暂时菜单操作
        }
    };

    var useAgen = win.navigator;
    console.log(useAgen);

    /**
     * 与原生交互的公用方法
     * @type {{}}
     */
    win.app = {
        //是否为民贷客户端,如果是,则可调用此文件内方法,否则,采用默认操作
        isMindaiApp: true,

        /**
         * 跳转至登录页(已实现)
         */
        jumpLogin: function (callback) {
            if(this.isMindaiApp){
                callApp(appConfig.actionName.jumpLogin,null,function(message){
                    "use strict";
                    callback&&callback(message);
                });
            }else{
                //TODO  非民贷App处理逻辑
            }
        },

        /**
         * 获取用户当前登录状态,并返回用户id   (已实现)
         * @param callback
         */
        getUserStatus: function(callback){

            if(this.isMindaiApp){

                callApp(appConfig.actionName.getUserStatus,null,function(message){
                    "use strict";
                    callback&&callback(message);
                });

            }else{
                //TODO  非民贷App处理逻辑
            }

        },

        /**
         * 弹出框
         * @param message
         */
        doAlert: function(message){

            if(this.isMindai){
                //TODO  调用原生弹框方法
                var data = {
                    message: message
                };
                callApp(appConfig.actionName.alert,data);
            }else{
                alert(message);
            }

        },
        /**
         * 分享功能     (已实现)
         * @param title     分享标题
         * @param message   分享消息内容主体
         * @param link      分享链接
         * @param img       分享图片
         */
        doShare: function(title,message,link,img){

            var data = {
                title: title,
                content: message,
                link:link,
                image_url: img
            };

            if(this.isMindaiApp){
                return callApp(appConfig.actionName.share,data);
            }else{
                //TODO  当不是在App中时的分享功能
            }

        },

        /**
         * 更新界面,显示标题栏对应按钮
         * @param data
         * @param callback
         */
        uiMenu: function(data,callback){
            "use strict";

            var param = {
                title: data.title || "",
                image_url: data.imageUrl || "",
                site: data.site || "right"
            };
            if(this.isMindaiApp){
                callApp(appConfig.actionName.uiMenu,param,function(message){
                    "use strict";
                    callback&&callback(message);
                });
            }else{
                //TODO  当不是在App中时的分享功能
            }

        },

        /**
         * 接收原生传过来的消息并进行处理
         * @param message
         * @param responseCallback
         */
        notice: function(message,responseCallback){

            //TODO  对原生传回的消息message进行处理,并通过responseCallback返回数据给原生

        }
    };


    /**
     * 当连接桥搭建好后初始化接收原生通知方法
     * @param bridge
     */
    win.appReady = function(bridge){

        bridge.init(function(msg,responseCallback){

            win.app.notice.apply(this,arguments);


        });

    };


    /**
     * 向App端发起消息或调用方法
     * @param action    发起消息的类型或方法名
     * @param data      需要向app端传递的参数,json对象的形式
     * @param callback  app端响应回调
     */
    win.callApp = function(action,data,callback){
        connectWebViewJavascriptBridge(function(bridge){

            console.log(action,data);
            bridge.callHandler(action, data || {}, function(message){
                "use strict";
                try{
                    message = JSON.parse(message);
                }catch (e){

                }
                console.log(message);
                callback&&callback(message);
            });

        });
    };



    /**
     * 绑定连接桥监听
     * @param callback
     */
    function connectWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
        } else {
            document.addEventListener(
                'WebViewJavascriptBridgeReady'
                , function() {
                    callback(WebViewJavascriptBridge)
                },
                false
            );
        }
    }

    /**
     * 当连接桥搭建好后毁掉
     */
    connectWebViewJavascriptBridge(function(bridge) {

        win.appReady&&win.appReady.apply(bridge,arguments);

    });

})(window,document);
