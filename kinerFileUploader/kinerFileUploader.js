/**
 * 基于webuploader进行二次封装的多浏览器兼容文件上传插件
 * Created by kiner on 2016-06-08.
 */

try {
    $.trim("");
} catch (e) {
    $ = undefined;
}

if(!window["console"]){
    window["console"] = {
        log: function(){},
        info: function(){},
        error: function(){},
        debug: function(){},
        dir: function(){}
    };
}

window.isDownloadFlash = false;

;(function ($, win, doc) {

    win.KinerFileUploader = win.KinerFileUploader || function (options) {
            this.opt = $.extend(true, {}, options);
        };

    win.KinerFileUploader.config = {
        scriptBasePath: "./lib",
        swfBasePath: "./lib",
        styleBasePath: "./lib"
    };

    win.KinerFileUploader.setConfig = function (opt) {
        win.KinerFileUploader.config = $.extend(true, {}, win.KinerFileUploader.config, opt);
    };

    win.KinerFileUploader.ready = function (conf, callback) {
        var args = arguments;
        if (args.length == 1 && $.isFunction(args[0])) {
            callback = args[0];
        }

        if (args.length == 2) {
            if ($.isPlainObject(args[0])) {
                win.KinerFileUploader.setConfig(conf);
            }
            if ($.isFunction(args[1])) {
                callback = args[1];
            }
        }

        this.config = win.KinerFileUploader.config;
        var link = $('<link rel="stylesheet" href="' + KinerFileUploader.config.styleBasePath + '/webuploader.css?_='+((new Date()).getTime())+'">');

        $(doc).find('head').append(link);

        var support = (!WebUploader.Uploader.support('flash') && WebUploader.browser.ie);

        if(support&&!win.isDownloadFlash){
            var res = win.confirm( 'Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
            if(res){
                win.isDownloadFlash = true;
                win.location.href = "https://www.baidu.com/link?url=b9IYMg5x0keDojqisotTgdyP8KWiIoeCbPu88FCP4XWmC9pGoPCz041SvBcgEHcKwJKYkXH3fihv6jftmWIskmzFjresEfkk-On7tc5GiaW&wd=&eqid=f3834bc80003829700000006576a56c1";
            }
            return;
        }

        callback && callback.call(KinerFileUploader, $, win, doc, new KinerFileUploader());

    };

    win.KinerFileUploader.prototype.init = function (options) {
        this.opt = $.extend(true, {}, options);
        this.config = win.KinerFileUploader.config;

        this.picker = $(this.opt.picker);

        var support = this.supportCheck();


        // console.log("是否支持base64：" + KinerFileUploader.isSupportBase64);
        // console.log("检测flash版本：" + KinerFileUploader.flashVersion);
        // console.log("是否支持transition：" + KinerFileUploader.supportTransition);

        this.uploader = this.initWebUploader();

        return this.uploader;

    };

    win.KinerFileUploader.prototype.initWebUploader = function () {

        var that = this;

        var uploader = WebUploader.create({
            pick: {
                id: this.picker,
                label: this.picker.text()
            },

            accept: {
                title: '上传文件',
                extensions: that.opt.extensions || undefined,
                mimeTypes: that.opt.mimeTypes || "*/*"
            },

            // swf文件路径
            swf: win.KinerFileUploader.config.swfBasePath+'/Uploader.swf',

            disableGlobalDnd: true,

            chunked: true,
            formData: that.opt.params || {},
            // server: 'http://webuploader.duapp.com/server/fileupload.php',
            server: that.opt.serverUrl || "",
            auto: that.opt.isAutoUpload || false,
            fileVal: that.opt.fileName,
            fileSingleSizeLimit: that.opt.fileSize || undefined
        });

        uploader.on("all", function (state, file, obj) {
            var args = [];
            try{
                args = Array.prototype.slice.call(arguments);
                args.push(uploader);
            }catch (e){
                args = [];
                for(var i=0;i<arguments.length;i++){
                    args.push(arguments[i]);
                }
            }
            that.opt.allCallback && that.opt.allCallback.apply(that, args);
            if (state == "ready") {
                var attr = {};
                if (that.opt.extensions) {
                    var extensions = that.opt.extensions.split(",");
                    attr.accept = "." + extensions.join(",.");
                }
                if (that.opt.fileSize) {
                    attr.size = that.opt.fileSize;
                }

                that.picker.find('.webuploader-container input[type="file"]').attr(attr);


                /**
                 * 解决xp系统中IE7内核浏览器选择文件按钮点击无反应问题
                 */
                that.picker.children().each(function(){
                    var id = $(this).attr('id');
                    if(id!=undefined&&id.indexOf("rt_rt_")!=-1){
                        $(this).width(that.picker.width()).height(that.picker.height()).attr('data-version','1.0');
                    }
                });

            } else if (state == "fileQueued") {
                that.opt.fileQueuedCallback && that.opt.fileQueuedCallback.apply(that, args);
            } else if (state == "uploadProgress") {
                that.opt.uploadProgressCallback && that.opt.uploadProgressCallback.apply(that, args);
            } else if (state == "uploadSuccess") {
                that.opt.uploadSuccessCallback && that.opt.uploadSuccessCallback.apply(that, args);
                uploader.reset();
            } else if (state == "uploadComplete") {
                that.opt.uploadCompleteCallback && that.opt.uploadCompleteCallback.apply(that, args);
                uploader.reset();
            } else if (state == "uploadAccept") {
                that.opt.uploadAcceptCallback && that.opt.uploadAcceptCallback.apply(that, args);
            } else if (state == "uploadError") {
                uploader.reset();
            } else if (state == "error") {
                uploader.reset();
                if (file == "F_EXCEED_SIZE") {
                    if (that.opt.fileSizeErrorCallback) {
                        that.opt.fileSizeErrorCallback && that.opt.fileSizeErrorCallback(arguments[3].size, that.opt.fileSize);
                    } else {
                        alert('请上传文件大小为' + that.computeFileSize(arguments[3].size) + '，超出限制文件大小' + that.computeFileSize(that.opt.fileSize));
                    }
                } else if (file == "Q_TYPE_DENIED") {
                    if (that.opt.fileTypeErrorCallback) {
                        that.opt.fileTypeErrorCallback && that.opt.fileTypeErrorCallback(obj.ext);
                    } else {
                        alert("上传文件格式为" + obj.ext + ",请上传规定格式的文件");
                    }
                }
            } else if (state == "uploadFinished") {
                uploader.reset();
                that.opt.uploadFinishedCallback && that.opt.uploadFinishedCallback.apply(that, args);
            }

        });


        var setHeader = function (object, data, headers) {
            headers['Access-Control-Allow-Origin'] = '*';
            headers['Access-Control-Request-Headers'] = 'content-type';
            headers['Access-Control-Request-Method'] = 'POST';
        };
        uploader.on('uploadBeforeSend ', setHeader);

        return uploader;

    };

    win.KinerFileUploader.prototype.computeFileSize = function (size) {

        console.log(size);
        if (size < 1024) {
            return size.toFixed(2) + "B";
        } else if (size >= 1024 && size < 1024 * 1024) {
            return (size / 1024).toFixed(2) + "KB";
        } else if (size >= 1024 * 1024 && size < 1024 * 1024 * 1024) {
            return (size / (1024 * 1024)).toFixed(2) + "MB";
        } else if (size >= 1024 * 1024 * 1024 && size < 1024 * 1024 * 1024 * 1024) {
            return (size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
        } else if (size >= 1024 * 1024 * 1024 * 1024 && size < 1024 * 1024 * 1024 * 1024 * 1024) {
            return (size / (1024 * 1024 * 1024 * 1024)).toFixed(2) + "TB";
        } else {
            throw "文件太大，无法计算";
        }

    };

    win.KinerFileUploader.prototype.supportCheck = function () {

        var that = this;


        // 判断浏览器是否支持图片的base64
        win.KinerFileUploader.isSupportBase64 = (function () {
            var data = new Image();
            var support = true;
            data.onload = data.onerror = function () {
                if (this.width != 1 || this.height != 1) {
                    support = false;
                }
            };
            data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            return support;
        })();

        // 检测是否已经安装flash，检测flash的版本
        win.KinerFileUploader.flashVersion = (function () {
            var version;

            try {
                version = navigator.plugins['Shockwave Flash'];
                version = version.description;
            } catch (ex) {
                try {
                    version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                        .GetVariable('$version');
                } catch (ex2) {
                    version = '0.0';
                }
            }
            version = version.match(/\d+/g);
            return parseFloat(version[0] + '.' + version[1], 10);
        })();

        win.KinerFileUploader.supportTransition = (function () {
            var s = document.createElement('p').style,
                r = 'transition' in s ||
                    'WebkitTransition' in s ||
                    'MozTransition' in s ||
                    'msTransition' in s ||
                    'OTransition' in s;
            s = null;
            return r;
        })();


        if (!WebUploader.Uploader.support('flash') && WebUploader.browser.ie) {

            // flash 安装了但是版本过低。
            console.log(window.KinerFileUploader.flashVersion);
            if (window.KinerFileUploader.flashVersion) {
                (function (container) {
                    window['expressinstallcallback'] = function (state) {
                        switch (state) {
                            case 'Download.Cancelled':
                                alert('您取消了更新！');
                                break;

                            case 'Download.Failed':
                                alert('安装失败');
                                break;

                            default:
                                alert('安装已成功，请刷新！');
                                break;
                        }
                        delete window['expressinstallcallback'];
                    };

                    var swf = win.KinerFileUploader.config.swfBasePath+'/expressInstall.swf';
                    console.log("swf路径：",swf);
                    // insert flash object
                    var html = '<object type="application/' +
                        'x-shockwave-flash" data="' + swf + '" ';

                    if (WebUploader.browser.ie) {
                        html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
                    }

                    html += 'width="100%" height="100%" style="outline:0">' +
                        '<param name="movie" value="' + swf + '" />' +
                        '<param name="wmode" value="transparent" />' +
                        '<param name="allowscriptaccess" value="always" />' +
                        '</object>';

                    console.log(html);

                    container.html(html);

                })(that.picker);

                // 压根就没有安转。
            } else {
                that.picker.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank"><img alt="get flash player" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" /></a>');
            }

            return false;
        } else if (!WebUploader.Uploader.support()) {
            alert('Web Uploader 不支持您的浏览器！');
            return false;
        }


        return WebUploader.Uploader.support();

    };


    if ($) {

        $.fn.extend({
            kinerFileUploader: function (options) {

                var opt = $.extend(true, {}, options);
                if (!opt.config) {

                    opt.config = win.KinerFileUploader.config;

                } else {
                    opt.config = $.extend(true, {}, win.KinerFileUploader.config, opt.config)
                }


                return $.extend(true, {}, $(this).each(function () {

                    opt.picker = $(this);

                    KinerFileUploader.ready(opt.config, function ($, win, doc, WU) {

                        WU.init(opt);

                    });

                }), {
                    kinerFileUploader: {
                        options: opt,
                        config: win.KinerFileUploader.config,
                        setConfig: win.KinerFileUploader.setConfig,
                        ready: win.KinerFileUploader.ready
                    }
                });
            }
        });


    }

})($, window, document);
