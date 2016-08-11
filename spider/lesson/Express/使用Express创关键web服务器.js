/**
 * Created by 汤文辉 on 2016-08-06.
 */

var express = require("express");
var morgan = require("morgan");//打印日志服务模块


//创建一个Express的示例
var app = new express();


//实际应用中，我们通常会把用户认证等操作写成中间件进行调用

//注册打印日志中间件
app.use(morgan());

//服务器监听端口的定义
var port = 18001;

//当服务器监听目标端口完成时回调此方法
var listenHandler = function(){

    console.log("express服务器监听[" + port + "]端口成功...");

};

//通过path的方式请求
app.get("/",function(req,res){

    res.end("Hello Kiner!!\n");

});

//通过router的方式请求
var router = express.Router();

//定义路由转发路径
router.get("/kiner",function(req,res){

    res.end("通过路由转发：/kiner\n");

});

router.get("/add",function(req,res){

    res.end("通过路由转发：/add\n");

});

//在express中注册路由,其中第一个参数为基础路径，即我们访问时通过url:http://localhost:18001/post/kiner访问到我们定义的第一个路由处理函数
app.use("/post",router);

//采用route方式处理一个路由下不同方法的处理
app.route("/lesson")
    .get(function(req,res){
        //curl http://localhost:18001/lesson
        res.end("路由转发：/lesson中的get方法\n");
    })
    .post(function(req,res){

        //curl -X POST http://localhost:18001/lesson
        res.end("路由转发：/lesson中的post方法\n");

    });

//路由参数的用法，例如：http://example.com/news/123    其中123便是路由参数
app.param("newsId",function(req,res,next,newsId){

    //在实际应用中我们通常会在这里做一些读取缓存中信息，如缓存的新闻信息的操作，然后在交给其他路由处理其他操作

    //可以直接将路由参数存储到请求对象中，在做进一步的处理
    req.newsId = newsId;

    //处理完成后必须执行next()让程序进行下一步操作
    next();

});

//现在我们来使用上面存入的newsId做一些简单的操作,注意，使用路由参数前需带上:
//请求url示例：curl http://localhost:18001/news/123  --> 路由参数为：123
app.get("/news/:newsId",function(req,res){

    res.end("路由参数为："+req.newsId+"\n");

});


//引用express的中间件实现静态文件服务,其中../../public为静态文件存放的目录
app.use(express.static("../../public"));


//指定服务器监听端口，并给定监听完成的回调函数
app.listen(port,listenHandler);



