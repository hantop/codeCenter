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
    rev = require('gulp-rev'),//对文件名加md5后缀
    argv = require('yargs').argv,//用于获取启动参数，针对不同参数，切换任务执行过程时需要
    revCollector = require("gulp-rev-collector"),//路径替换
    browserSync = require('browser-sync').create(),//浏览器动态是刷新
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
    }

};

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
            baseDir: outputPath
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
        // .pipe(plugins.imagemin())
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
 * 工作流logo展示
 */
gulp.task('logo',["clean"], function (done) {

    console.log(kinerVersion.red);

    //创建项目，输入配置
    inquirer.prompt(
        [
            {
                type: "list",
                name: "devModel",
                message: "请选择开发场景\n",
                choices: ['dev', 'product',"\n"],
                filter: function (val) { //过滤器
                    return val.toLowerCase();  //toLowerCase()方法将val返回一个字符串，该字符串中的字母被转换为小写字母
                }
            },
            {
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
            },
            {
                type: 'confirm',
                message: '是否确认启动项目?\n',
                default: true,
                name: 'start'
            }
        ]).then(function (answers) {

        if (answers.start) {
            if (answers.projectName != "") {
                //gulp.start('your-gulp-task');

                projectName = answers.projectName;
                devModel = answers.devModel; //开发场景，定义全局的devModel
                basePath = basePath + answers.projectName + "/"; //输入项目名称，定义全局的projectName
                outputPath = outputPath + answers.projectName + "/";
                tempPath = tempPath + answers.projectName + "/";


                gulp.start(devModel);

                console.log("\n\n项目启动成功~O(∩_∩)O开发场景：" + answers.devModel + "  (⊙o⊙)…项目名称：" + answers.projectName+"\n\n");
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

/**
 * 默认任务
 */
gulp.task("default", ["logo"], function (done) {


    tools.p(config.P_TYPE.INFO, "项目启动...");

});

/**
 * 开发任务
 */
gulp.task("dev", ["clean", "sass", "js","html","imgs","browser-sync"], function (done) {

    tools.p(config.P_TYPE.INFO, "启动开发任务...");
    gulp.watch([basePath + "sass/public/*.sass", basePath + "sass/*.sass"], ["sass"]).on('change', browserSync.reload);
    gulp.watch([basePath + "js/lib/*.js", basePath + "js/*.js"], ["js"]).on('change', browserSync.reload);
    gulp.watch([basePath + "*.html"], ["html"]).on('change', browserSync.reload);
    gulp.watch([basePath + "imgs/**"], ["imgs"]);

});

/**
 * 产品导出任务
 */
gulp.task("product", ["clean", "sass", "js","html","imgs","browser-sync"], function (done) {


    tools.p(config.P_TYPE.INFO, "启动生产任务...");
    gulp.watch([basePath + "sass/public/*.sass", basePath + "sass/*.sass"], ["sass"]).on('change', browserSync.reload);
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