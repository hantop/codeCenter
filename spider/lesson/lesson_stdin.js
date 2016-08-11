console.log("请输入您的姓名：");
process.stdin.resume();
process.stdin.setEncoding("UTF-8");


process.stdin.on("data", function(name) {

    console.log("您好：" + name);

});
