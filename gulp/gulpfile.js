/**
 * Created by kiner on 2016-07-26.
 */
var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")(),
    sass = require("gulp-sass"),
    del = require("del"),
    plumber = require("gulp-plumber"),
    colors = require("colors"),
    conf = require("./desc.js"),
    livereload = require('gulp-livereload');


var tools = {

    p: function (type, message, bold) {
        
        switch (type){

            case config.P_TYPE.WARN:{
                if(bold){
                    console.log(message.yellow.bold + "\n");
                }else{
                    console.log(message.yellow + "\n");
                }
                break;
            }
            case config.P_TYPE.INFO:{
                if(bold){
                    console.log(message.green.bold + "\n");
                }else{
                    console.log(message.green + "\n");
                }
                break;
            }
            case config.P_TYPE.ERROR:{
                if(bold){
                    console.log(message.red.bold + "\n");
                }else{
                    console.log(message.red + "\n");
                }
                break;
            }
            case config.P_TYPE.LOG:
            default:
                if(bold){
                    console.log(message.blue.bold+"\n");
                }else{
                    console.log(message.blue+"\n");
                }

        }
        
    }

};

/**
 * 编译sass文件
 */
gulp.task("sass", function () {
    
    // del(["dist", "assets/sass/pro.sass"]);
    // gulp.src(["dist","assets/sass/output"])
    //     .pipe(plugins.rimraf({force: true}));
    gulp.src([basePath+"assets/sass/public/common.sass", "assets/sass/*.sass"])
        .pipe(plugins.concat("all.sass"))
        .pipe(plumber())
        .pipe(gulp.dest(basePath+"assets/sass/output"))
        .pipe(sass())
        .pipe(plugins.cssnano())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest(basePath+"dist/css"))
        .pipe(livereload());
});

/**
 * 压缩编译js
 */
gulp.task("js",function(){
    //
    // gulp.src(["dist","assets/js/output"])
    //     .pipe(plugins.rimraf({force: true}));

    gulp.src([basePath+"assets/js/lib/*.js", "assets/js/*.js"])
        .pipe(plugins.concat("all.js"))
        .pipe(plumber())
        .pipe(gulp.dest(basePath+"assets/js/output"))
        .pipe(plugins.uglify())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest(basePath+"dist/js"))
        .pipe(livereload());
});

/**
 * 清理临时目录和发布目录
 */
gulp.task("clean",function(){
    gulp.src([basePath+"dist",basePath+"assets/sass/output"])
        .pipe(plugins.rimraf({force: true}));
});

gulp.task("dev",["sass","js"],function(){

    console.log(kinerVersion.red);

    tools.p(config.P_TYPE.LOG,"开始编译项目...",true);

    livereload.listen();
    gulp.watch([basePath+"assets/sass/public/*.sass",basePath+"assets/sass/*.sass"],["sass"]);
    gulp.watch([basePath+"assets/js/lib/*.js",basePath+"assets/js/*.js"],["js"]);

});