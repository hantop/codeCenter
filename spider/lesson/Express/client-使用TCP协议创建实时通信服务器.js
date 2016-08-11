/**
 * Created by 汤文辉 on 2016-08-07.
 */
var net = require("net");

//声明两个常量用于保存需要连接的主机地址和端口号
const HOST = "127.0.0.1";//主机地址
const PORT = "18002";//端口号

//创建一个tcp客户端的socket示例
var tcpClient = net.Socket();

//连接成功的回调
var connectHandler = function(){

    console.log("连接主机" + HOST + "成功，端口号为：" + PORT+"\n");

    //给服务端发送一条数据
    tcpClient.write("这是从tcp客户端发送过来的一条消息\n");
};

//建立连接，绑定主机地址和端口号
tcpClient.connect(PORT,HOST,connectHandler);

//当服务端有消息传回时执行的回调
var dataHandler = function(data){

    console.log("这是从服务端返回的消息：" + data.toString()+"\n");

    console.log("请输入命令：\n");

    //激活标准输入流
    process.stdin.resume();


};

//当服务器与客户端断开连接时触发的回调
var closeHandler = function(){
    console.log("与服务器["+HOST+":"+PORT+"]断开链接...");
    process.exit();
};

//监听socket的data、close等事件，当触发这些事件时作相应的处理
tcpClient.on("data",dataHandler);
tcpClient.on("close",closeHandler);

//设置标准输入流的编码
process.stdin.setEncoding("UTF-8");

//对标准输入流输入的数据进行处理
process.stdin.on("data",function(data){

    tcpClient.write("[client]:"+data);

});

