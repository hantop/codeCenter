/**
 * Created by kiner on 2016-07-26.
 */
var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")(),//加载package.json中配置的插件进plugins中
    sass = require("gulp-sass"),//sass编译插件
    plumber = require("gulp-plumber"),//捕获处理任务中的错误
    colors = require("colors"),//控制台输出文件格式
    livereload = require('gulp-livereload'),
    through2 = require('through2'),//用于获取当前处理文件信息
    clean = require("gulp-clean"),//清理目录
    notify = require("gulp-notify"),//通知方法
    inquirer = require("inquirer"),//选项插件
    less = require("gulp-less"),//less编译插件
    img = require("gulp-imagemin"),//图片压缩
    rev = require('gulp-rev'),//对文件名加md5后缀
    argv = require('yargs').argv,//用于获取启动参数，针对不同参数，切换任务执行过程时需要
    revCollector = require("gulp-rev-collector"),//路径替换
    browserSync = require('browser-sync').create(),//浏览器动态是刷新
    fs = require('fs'),//文件操作
    mkdirp = require("mkdirp"),//目录操作
    File = require("vinyl"),//文件对象

    conf = require("./desc.js");//配置文件






/**
 * 工具类
 * @type {{p: tools.p, notify: tools.notify}}
 */
var tools = {

    /**
     * 消息输出方法
     * @param type  消息类型    config.P_TYPE.WARN【警告类型】    config.P_TYPE.INFO【消息类型】    config.P_TYPE.ERROR【错误类型】   config.P_TYPE.LOG【日志类型】
     * @param message   消息内容主体
     * @param bold      是否加粗
     * @returns {string}
     */
    p: function (type, message, bold) {

        switch (type) {

            case config.P_TYPE.WARN:
            {
                if (bold) {
                    console.log(message.yellow.bold + "\n");
                    return message.yellow.bold + "\n";
                } else {
                    console.log(message.yellow + "\n");
                    return message.yellow + "\n";
                }
                break;
            }
            case config.P_TYPE.INFO:
            {
                if (bold) {
                    console.log(message.green.bold + "\n");
                    return message.green.bold + "\n";
                } else {
                    console.log(message.green + "\n");
                    return message.green + "\n";
                }
                break;
            }
            case config.P_TYPE.ERROR:
            {
                if (bold) {
                    console.log(message.red.bold + "\n");
                    return message.red.bold + "\n";
                } else {
                    console.log(message.red + "\n");
                    return message.red + "\n";
                }
                break;
            }
            case config.P_TYPE.LOG:
            default:
                if (bold) {
                    console.log(message.blue.bold + "\n");
                    return message.blue.bold + "\n";
                } else {
                    console.log(message.blue + "\n");
                    return message.blue + "\n";
                }

        }

    },

    /**
     * 用于在控制台及系统中推送通知消息
     * @param message   消息内容
     * @returns {*}
     */
    notify: function (message) {
        return through2.obj(function (file, enc, cb) {
            notify({message: tools.p(config.P_TYPE.INFO, "【" + file.path + "】 : " + message)});
            this.push(file);
            cb();
        });
    },
    /**
     * 常用io操作
     */
    io:{
        /**
         * 同步文件读取操作
         * @param path  文件路径
         * @returns {*}
         */
        fileReadSync: function(path){
            return fs.readFileSync(path,encode);
        },

        /**
         * 文件写入操作
         * @param path  文件路径
         * @param content   文件内容
         * @param callback  回调函数
         */
        fileWrite: function(path,content,callback){
            fs.writeFile(path, content, {
                encoding:encode
            }, function (err) {
                if (err) throw err;
                callback&&callback.apply(this,arguments);
            });
        },

        makeFile: function(fileName,content){

            gulp.task("createFile",function(){
                console.log(("\n\n创建文件：" + fileName+"\n\n").cyan);
                gulp.dest(fileName);
                tools.io.fileWrite(fileName,content)
            });

            gulp.start("createFile");

            //tools.io.fileWrite(fileName,content);

        },

        mkdirs: function(path){

            console.log(("\n\n创建目录：" + path+"\n\n").cyan);
            mkdirp.sync(path);

        }

    }

};


var projectData = tools.io.fileReadSync(projectInfoPath);//异步读取文件内容

var oProjectData = JSON.parse(projectData);//转换json对象

var projectList = oProjectData.projectList;//项目信息对象




/**
 * 编译sass文件
 */
gulp.task("sass", function () {

    // del(["dist", "sass/pro.sass"]);
    // gulp.src(["dist","sass/output"])
    //     .pipe(plugins.rimraf({force: true}));
    gulp.src([basePath + "sass/public/*.sass", basePath + "sass/*.sass"])
        .pipe(plugins.concat("all.sass"))
        .pipe(plumber())
        .pipe(gulp.dest(tempPath + 'sass/'))
        .pipe(sass())
        .pipe(plugins.cssnano())
        .pipe(plugins.rename({suffix: '.min'}))
        // .pipe(rev())
        .pipe(gulp.dest(outputPath + "css"))
        // .pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
        // .pipe(gulp.dest(outputPath+'rev'))
        .pipe(browserSync.stream())
        .pipe(tools.notify("编译完成..."));
});


/**
 * 编译less文件
 */
gulp.task("less", function () {

    // del(["dist", "sass/pro.sass"]);
    // gulp.src(["dist","sass/output"])
    //     .pipe(plugins.rimraf({force: true}));
    gulp.src([basePath + "less/public/*.less", basePath + "less/*.less"])
        .pipe(plugins.concat("all.less"))
        .pipe(plumber())
        .pipe(gulp.dest(tempPath + 'less/'))
        .pipe(less())
        .pipe(plugins.cssnano())
        .pipe(plugins.rename({suffix: '.min'}))
        // .pipe(rev())
        .pipe(gulp.dest(outputPath + "css"))
        // .pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
        // .pipe(gulp.dest(outputPath+'rev'))
        .pipe(browserSync.stream())
        .pipe(tools.notify("编译完成..."));
});

/**
 * 压缩编译js
 */
gulp.task("js", function () {
    //
    // gulp.src(["dist","js/output"])
    //     .pipe(plugins.rimraf({force: true}));
    gulp.src([basePath + "js/lib/*.js", basePath + "js/*.js"])
        .pipe(plugins.concat("all.js"))
        .pipe(plumber())
        .pipe(gulp.dest(tempPath + 'js/'))
        .pipe(plugins.uglify())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest(outputPath + "js"))
        .pipe(browserSync.stream())
        .pipe(tools.notify("编译完成..."));

});

/**
 * 浏览器设置
 */
gulp.task('browser-sync', function() {
    var files = [
        outputPath+'*.html',
        outputPath+'css/*.css',
        outputPath+'js/*.js'
    ];
    browserSync.init(files,{
        server: {
            baseDir: outputPath,
            index: index
        }
    });
});


/**
 * 复制html并替换资源引入路径
 */
gulp.task("html",[/*"rev"*/], function () {

    gulp.src([basePath+"*.html"])
        .pipe(plugins.replace('<script src="js/all.js"></script>','<script src="js/all.min.js"></script>'))
        .pipe(plugins.replace('<link rel="stylesheet" href="all.css">','<link rel="stylesheet" href="css/all.min.css">'))
        .pipe(gulp.dest(outputPath))
        .pipe(tools.notify("复制完成..."));

});

/**
 * 图片的复制与压缩
 */
gulp.task("imgs",function(){

    tools.p(config.P_TYPE.INFO,"开始处理图片...");
    gulp.src([basePath+"imgs/**"])
        // .pipe(img({
        //     optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
        //     progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
        //     interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
        //     multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        // }))
        .pipe(gulp.dest(outputPath+'imgs/'));

});

/**
 * 清理临时目录和发布目录
 */
gulp.task('clean', function () {
    return gulp.src([outputPath, tempPath], {read: false})
        .pipe(clean());
});

/**
 * 清理指定目录
 * @param dir
 * @returns {*}
 */
function cleanDir(dir){

    var taskName;

    if(dir){

        taskName = 'clean_'+dir+"_"+(new Date()).getTime();

        gulp.task(taskName, function () {

            gulp.src([tempPath,outputPath+dir], {read: false})
                .pipe(clean());

        });
        tools.p(config.P_TYPE.INFO,"开始清理【"+outputPath+projectName+"】目录...");

        gulp.start(taskName);
    }else{

        taskName = 'clean'+"_"+(new Date()).getTime();

        gulp.task(taskName, function () {

            gulp.src([tempPath], {read: false})
                .pipe(clean());

        });
        tools.p(config.P_TYPE.INFO,"开始清理临时目录...");

        gulp.start(taskName);

    }


}

/**
 * 工作流logo展示
 */
gulp.task('logo',[], function (done) {

    console.log(kinerVersion.red);

    cleanDir();

    var conf = [

    ];

    inquirer.prompt({
        type: "list",
        name: "devModel",
        message: "请选择开发场景\n",
        choices: ['dev', 'product',"\n"],
        filter: function (val) { //过滤器
            return val.toLowerCase();  //toLowerCase()方法将val返回一个字符串，该字符串中的字母被转换为小写字母
        }
    }).then(function(devAnswer){

        devModel = devAnswer.devModel; //开发场景，定义全局的devModel


        if(projectList&&projectList.length!=0){


            var projects = [],indexs = [];

            for(var p in projectList){
                var pro = projectList[p];

                projects.push(pro.name);
                indexs.push(pro.index);

            }

            projects.push("\n");
            indexs.push("\n");


            inquirer.prompt({
                type: "confirm",
                name: "selectOrCreate",
                message: "请问是选择已有项目还是创建新项目\n",
                default: false
            }).then(function(selectOrCreateAnswer){
                if(selectOrCreateAnswer.selectOrCreate){

                    conf.push({
                        type: "list",
                        name: "projectName",
                        message: "请选择已有项目\n",
                        choices: projects,
                        filter: function (val) { //过滤器
                            return val.toLowerCase();  //toLowerCase()方法将val返回一个字符串，该字符串中的字母被转换为小写字母
                        }
                    });


                }else{

                    conf.push({
                        type: "input",
                        name: "projectName",
                        message: "请输入项目名称\n",
                        //default: function () { return "test"; },
                        validate: function (value) {
                            //var pass = value.match(/^([01]{1})?[\-\.\s]?\(?(\d{3})\)?[\-\.\s]?(\d{3})[\-\.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i);
                            if (value) {
                                //console.log(value);
                                return true;
                            } else {
                                return "项目名称不能为空！请重新输入!!!".red;
                            }
                        }
                    });

                    conf.push({
                        type: "input",
                        name: "index",
                        message: "请输入项目首页（默认首页为index.html）\n"
                    });

                }


                conf.push({
                    type: 'confirm',
                    message: '是否确认启动项目?\n',
                    default: true,
                    name: 'start'
                });


                //创建项目，输入配置
                inquirer.prompt(conf).then(function (answers) {

                    if (answers.start) {
                        console.log("kiner:",selectOrCreateAnswer.selectOrCreate);
                        if ((!selectOrCreateAnswer.selectOrCreate&&answers.projectName != "")||selectOrCreateAnswer.selectOrCreate) {
                            //gulp.start('your-gulp-task');

                            projectName = answers.projectName || projectName;
                            basePath = basePath + answers.projectName + "/"; //输入项目名称，定义全局的projectName
                            outputPath = outputPath + answers.projectName + "/";
                            tempPath = tempPath + answers.projectName + "/";
                            index = answers.index || index;

                            for(var p in projectList){

                                var pro = projectList[p];

                                if(pro.name.toLowerCase()==projectName.toLowerCase()){

                                    index = pro.index;
                                }

                            }


                            if(!selectOrCreateAnswer.selectOrCreate){

                                projectList.push({

                                    name: projectName,
                                    index: index,
                                    desc: projectName

                                });


                                tools.io.mkdirs(basePath);//创建新项目目录
                                tools.io.makeFile(basePath+index,tools.io.fileReadSync(templatePath));//从模版创建索引文件


                                /**
                                 * 更新项目配置文件
                                 */
                                tools.io.fileWrite(projectInfoPath,JSON.stringify({projectList:projectList}, null, 4),function(err){

                                    tools.p(config.P_TYPE.INFO,"项目配置文件更新成功...");

                                });
                                cleanDir();

                            }else{
                                cleanDir(projectName);
                            }

                            gulp.start(devModel);

                            console.log("\n\n项目启动成功~O(∩_∩)O开发场景：" + devModel.cyan + "  (⊙o⊙)…项目名称：" + answers.projectName.cyan+"，项目首页："+index.cyan+"\n\n");
                        } else {
                            console.log(">>项目启动失败！请输入项目名称!!!".red);
                        }
                    } else {
                        // console.log(answers.start);
                        console.log(">>项目已终止启动！请重新运行项目配置指令--gulp!!!".red);
                    }

                    done();

                });

            });


        }else{

            conf.push({
                type: "input",
                name: "projectName",
                message: "请输入项目名称\n",
                //default: function () { return "test"; },
                validate: function (value) {
                    //var pass = value.match(/^([01]{1})?[\-\.\s]?\(?(\d{3})\)?[\-\.\s]?(\d{3})[\-\.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i);
                    if (value) {
                        //console.log(value);
                        return true;
                    } else {
                        return "项目名称不能为空！请重新输入!!!".red;
                    }
                }
            });

            conf.push({
                type: "input",
                name: "index",
                message: "请输入项目首页（默认首页为index.html）\n"
            });


            conf.push({
                type: 'confirm',
                message: '是否确认启动项目?\n',
                default: true,
                name: 'start'
            });

            //创建项目，输入配置
            inquirer.prompt(conf).then(function (answers) {

                if (answers.start) {
                    if (answers.projectName != "") {
                        //gulp.start('your-gulp-task');

                        projectName = answers.projectName;
                        basePath = basePath + answers.projectName + "/"; //输入项目名称，定义全局的projectName
                        outputPath = outputPath + answers.projectName + "/";
                        tempPath = tempPath + answers.projectName + "/";
                        index = answers.index;


                        cleanDir(projectName);
                        gulp.start(devModel);

                        console.log("\n\n项目启动成功~O(∩_∩)O开发场景：" + devModel + "  (⊙o⊙)…项目名称：" + answers.projectName+"\n\n");
                    } else {
                        console.log(">>项目启动失败！请输入项目名称!!!".red);
                    }
                } else {
                    // console.log(answers.start);
                    console.log(">>项目已终止启动！请重新运行项目配置指令--gulp!!!".red);
                }

                done();

            });

        }



    });




});

/**
 * 默认任务
 */
gulp.task("default", ["logo"], function (done) {

    tools.p(config.P_TYPE.INFO, "项目启动...");

});

/**
 * 开发任务
 */
gulp.task("dev", ["sass", "js","html","imgs","browser-sync","less"], function (done) {

    tools.p(config.P_TYPE.INFO, "启动开发任务...");
    gulp.watch([basePath + "sass/public/*.sass", basePath + "sass/*.sass"], ["sass"]).on('change', browserSync.reload);
    gulp.watch([basePath + "less/public/*.less", basePath + "less/*.less"], ["less"]).on('change', browserSync.reload);
    gulp.watch([basePath + "js/lib/*.js", basePath + "js/*.js"], ["js"]).on('change', browserSync.reload);
    gulp.watch([basePath + "*.html"], ["html"]).on('change', browserSync.reload);
    gulp.watch([basePath + "imgs/**"], ["imgs"]);

});

/**
 * 产品导出任务
 */
gulp.task("product", ["sass", "js","html","imgs","browser-sync","less"], function (done) {

    tools.p(config.P_TYPE.INFO, "启动生产任务...");
    gulp.watch([basePath + "sass/public/*.sass", basePath + "sass/*.sass"], ["sass"]).on('change', browserSync.reload);
    gulp.watch([basePath + "less/public/*.less", basePath + "less/*.less"], ["less"]).on('change', browserSync.reload);
    gulp.watch([basePath + "js/lib/*.js", basePath + "js/*.js"], ["js"]).on('change', browserSync.reload);
    gulp.watch([basePath + "*.html"], ["html"]).on('change', browserSync.reload);
    gulp.watch([basePath + "imgs/**"], ["imgs"]);

});


// if(argv){
//
//
//     devModel = argv._[0];
//     projectName = argv.projectName;
//
//     if(devModel&&projectName){
//         basePath = basePath + projectName + "/"; //输入项目名称，定义全局的projectName
//         outputPath = outputPath + projectName + "/";
//         tempPath = tempPath + projectName + "/";
//         //
//         // console.log("devModel---->".green+devModel);
//         // console.log("projectName---->".green+projectName);
//         // console.log("basePath---->".green+basePath);
//         // console.log("outputPath---->".green+outputPath);
//         // console.log("tempPath---->".green+tempPath);
//
//
//         gulp.start("default");
//
//         console.log("\n\n项目启动成功~O(∩_∩)O开发场景：" + devModel + "  (⊙o⊙)…项目名称：" + projectName+"\n\n");
//     }
//
//
// }