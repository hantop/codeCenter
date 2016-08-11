/**
 * Created by 汤文辉 on 2016-08-07.
 */
var koa = require("koa");

//创建koa实例
var app  = koa();

app.keys = ['my name is kiner','i love kanger'];

app.use(function *(){

    //this.body = "Hello Koa!!";


    this.cookies.set("name","kiner",{
        signed:true
    });
    this.body = {
        name : "kiner"
    };
    console.log(this);
});

app.listen(18003);

/*
var koa = require('koa');
var app = koa();

// x-response-time

app.use(function *(next){
    var start = new Date;
    yield next;
    var ms = new Date - start;
    this.set('X-Response-Time', ms + 'ms');
});

// logger

app.use(function *(next){
    var start = new Date;
    yield next;
    var ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms);
});

// response

app.use(function *(){
    this.body = 'Hello World';
});

app.listen(18003);
*/
