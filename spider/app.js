/**
 * Created by 汤文辉 on 2016-08-03.
 */
var express = require("express");
var Robot = require("./module/robot.js");
var schedule = require("node-schedule");
var getTime = require("./Time.js");

var options = {
    domain: "dytt8.net",
    firstUrl: "http://www.dytt8.net/",
    outputPath: "./output/testRobot/",
    outputFileName: "test.txt",
    encoding:"GBK",
    timeout:6000,
    robots:true,
    debug: true,
    handlerComplete:function(oResult,file){

        console.log("["+getTime()+"]抓取结束...");


        file.save("\n抓取完成...\n总共访问网页数为"+oResult.iCount+"条，其中成功访问网页数"+oResult.iSuccessNum+"条",true);

    }
};
var robot = new Robot(options);
var reg1 = /\/html\/[a-z0-9]+\/[a-z0-9]+\/[\d]+\/[\d]+\.html/gmi;
var reg2 = /\/html\/[a-z0-9]+\/index\.html/gmi;
//var reg3 = /(ftp|http):\/\/.+\.(rmvb|mp4|avi|flv|mkv|3gp|wmv|wav|mpg|mov)/gmi;


function start(){

    robot.go(function($,aType,url,aNewURLQueue,aTargetURLList,oTargetInfoList){

        var self = this;
        var pUrl = url;
        if(url===options.firstUrl){

            var aA = $("a");

            aA.each(function(){

                var href = $(this).attr('href');

                if(href.indexOf("http://")==-1){

                    href = options.firstUrl+href.substring(1);

                }

                var res = reg1.exec(href);

                if(res){

                    aNewURLQueue.indexOf(href)==-1&&aNewURLQueue.push(href);

                }

            });

        }else{

            $('a').each(function(){

                var href = $(this).attr('href');
                var res2 = reg2.exec(href);

                console.log("["+getTime()+"]页面["+pUrl+"]二级页面：【" + href + "】");

                if(href.indexOf("thunder://")!=-1){

                    var url = $(this).text().trim();
                    var name = $("h1").text().trim();
                    console.log("\n["+getTime()+"]目标链接【"+name+"】："+url+"\n");
                    if(aTargetURLList.indexOf(url)){
                        aTargetURLList.push(url);
                        oTargetInfoList[url] = {
                            name:name
                        };
                    }

                    self.file.save("["+getTime()+"]"+url+"\n",true);

                }else if(href.indexOf("ftp://")!=-1){
                    var url = $(this).attr("href");
                    var name = $("h1").text().trim();
                    console.log("\n["+getTime()+"]目标链接【"+name+"】："+url+"\n");
                    if(aTargetURLList.indexOf(url)){
                        aTargetURLList.push(url);
                        oTargetInfoList[url] = {
                            name:name
                        };
                    }
                    self.file.save("["+getTime()+"]"+url+"\n",true);


                }else if(res2){
                    if(href.indexOf("http://")==-1){

                        href = options.firstUrl+href.substring(1);

                    }

                    var res = reg1.exec(href);

                    if(res){

                        aNewURLQueue.indexOf(href)==-1&&aNewURLQueue.push(href);

                    }
                }

            });


        }

    });
}


var rule = new schedule.RecurrenceRule();

rule.dayOfWeek = [0, new schedule.Range(1, 6)];

rule.hour = 8;

rule.minute = 6;

console.log("定时爬取任务，下次爬取时间为"+rule.hour+"时"+rule.minute+"分");

var j = schedule.scheduleJob(rule, function(){

    robot.setOpt({
        outputFileName:getTime(1)+"-"+"电影天堂.txt"
    });
    console.log("["+getTime()+"]开始定时爬取任务...");
    start();

});



