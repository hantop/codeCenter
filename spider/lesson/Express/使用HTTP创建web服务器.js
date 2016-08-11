/**
 * Created by 汤文辉 on 2016-08-06.
 */
var http = require("http");

//服务器监听的端口号
var port = 18000;

//处理请求信息
var requestHandler = function(req,res){

    res.end("你好：kiner");

};


//创建一个web服务器
var web = http.createServer(requestHandler);

//绑定服务器监听的端口号
web.listen(port);

//成功提示
console.log("服务器启动成功，监听端口号为：" + port);