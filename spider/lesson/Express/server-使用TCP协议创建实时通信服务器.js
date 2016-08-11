/**
 * Created by 汤文辉 on 2016-08-07.
 */

var net = require("net");//导入核心模块net,用此模块创建TCP服务器

var conf = {};//tcp服务器配置信息

var self_socket;

//定义监听端口和地址为常量
const PORT = 18002;//监听端口
const HOST = '127.0.0.1';//监听地址

//监听回调,当客户端于服务端创建连接的时候，变灰调用此方法，并传入socket的实例
var clientHandler = function(socket){

    self_socket = socket;

    console.log("客户端接入服务器...\n");

    var who = socket.remoteAddress+":"+socket.remotePort;

    //当客户端发送消息到服务端时触发此方法
    socket.on("data",function dataHandler(data){

        console.log("\n("+who+")"+ data.toString()+"\n");


        console.log("请输入命令：\n");

        //激活标准输入流
        process.stdin.resume();

    });

    //当客户端与服务端关闭连接时调用此方法
    socket.on("close",function closeHandler(data){

        console.log(who + " ：断开链接...\n");

        process.exit();

    });

};

//创建一个TCP协议实例
var app  = net.createServer(conf,clientHandler);

//给TCP服务器注册监听端口和地址，并指定回调
app.listen(PORT,HOST,function listenHandler(){
    console.log("\nTCP服务器正在监听地址：", HOST, "正在监听端口：", PORT,"\n");
});

//可使用telnet进行测试链接

//设置标准输入流的编码
process.stdin.setEncoding("UTF-8");

//对标准输入流输入的数据进行处理
process.stdin.on("data",function(data){

    self_socket.write("[server]:"+data);

});