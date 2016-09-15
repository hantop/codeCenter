/**
 * Created by zhe on 2015/9/22.
 */
(function($){

    $.fn.imageUpload = function(options){

        var opt = $.extend(true,{
            selectCallback:function(){},
            remote:{
                autoUpload:true,
                beforeUpload:function(){},
                success:function(data){

                },
                complete:function(){},
                error:function(){},
                url:"./upload.php",
                data:{
                    type:"front"
                }
            }
        },options);

        var that = $(this);

        return this.each(function(){

            var _this = $(this);

            var input = $('<input type="file" name="file" id="file">');
			var previewImg = null;
			if(opt.previewImg)previewImg = $(opt.previewImg);

            _this.css({
                position:"relative"
            });

            input.css({
                width:_this.width()+_this.css('padding-left')+_this.css('padding-right'),
                height:_this.height()+_this.css('padding-top')+_this.css('padding-left'),
                opacity:0,
                position:"absolute",
                left:0,
                top:0
            });

            _this.append(input);

            input.change(function(){

                var file = $(this).get(0).files[0];
                opt.selectCallback&&opt.selectCallback(file);

                file2base64(file,function(src,info){

//                        previewImg.attr('src',src);
                    var formData = new FormData();

                    formData.append('file',file);
                    for(var i in opt.remote.data){

                        formData.append(i,opt.remote.data[i]);
                    }


                    console.log(info.blob);
                    $.ajax({
                        url:opt.remote.url,
                        data:formData,
                        type:"post",
                        dataType:"json",
                        cache: false,
                        processData: false,
                        contentType: false,
                        beforeUpload:function(){
                            opt.remote.beforeUpload&&opt.remote.beforeUpload(info,src);
                        },
                        success:function(data){
                            previewImg&&previewImg.attr('src',data.result);
                            opt.remote.success&&opt.remote.success(data,info,src);
                        },
                        error:function(data){
                            input.val('');
                            opt.remote.error&&opt.remote.error.apply(this,arguments);
                        },
                        complete:function(data){
                            opt.remote.complete&&opt.remote.complete(data,info,src);
                        }
                    });

                })

            });


            function file2base64(file,callback){

                // 使用FileReader读取

                var	oFile = file,sName,sFileType = oFile.type,nSize = 0,nModTime;

                // Android下读不到type信息，从文件名中解析

                if(!sFileType){
                    sFileType = "image/" + sName.split(".").pop().toLowerCase();
                }

                // 读取文件大小、修改时间等信息

                var oUploadInfo = {

                    name : oFile.name || oFile.fileName,

                    size : oFile.size || oFile.fileSize,
                    modTime : oFile.lastModifiedDate.valueOf(),
                    blob : oFile
                };

                var oReader = new FileReader();
                oReader.onload = function(e){
                    var sBase64 = e.target.result;
                    // 部分Android下base64字符串格式不完整
                    if(window.gIsAndroid && sBase64.indexOf("data:image/") != 0){
                        var sMime = sName.split(".").pop().toLowerCase();
                        sBase64 = sBase64.replace("base64,", "image/" + sMime + ";base64,");
                    }
                    callback&&callback(sBase64,oUploadInfo);
                };
                oReader.readAsDataURL(oFile);
            }

        });

    };

})($);