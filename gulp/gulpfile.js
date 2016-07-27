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
    livereload = require('gulp-livereload'),
    through2 = require('through2'),
    clean = require("gulp-clean"),
    notify = require("gulp-notify");


var tools = {

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

    }

};

/**
 * 编译sass文件
 */
gulp.task("sass", function () {

    // del(["dist", "assets/sass/pro.sass"]);
    // gulp.src(["dist","assets/sass/output"])
    //     .pipe(plugins.rimraf({force: true}));
    gulp.src([basePath + "assets/sass/public/common.sass", "assets/sass/*.sass"])
            .pipe(plugins.concat("all.sass"))
            .pipe(plumber())
            .pipe(gulp.dest(basePath + "assets/sass/output"))
            .pipe(sass())
            .pipe(plugins.cssnano())
            .pipe(plugins.rename({suffix: '.min'}))
            .pipe(gulp.dest(basePath + "dist/css"))
            .pipe(livereload())
            .pipe(through2.obj(function (file, enc, cb) {
                notify({message: tools.p(config.P_TYPE.INFO, file.path + "文件编译完成...")});
                this.push(file);
                cb();
            }));
});

/**
 * 压缩编译js
 */
gulp.task("js", function () {
    //
    // gulp.src(["dist","assets/js/output"])
    //     .pipe(plugins.rimraf({force: true}));
    gulp.src([basePath + "assets/js/lib/*.js", "assets/js/*.js"])
            .pipe(plugins.concat("all.js"))
            .pipe(plumber())
            .pipe(gulp.dest(basePath + "assets/js/output"))
            .pipe(plugins.uglify())
            .pipe(plugins.rename({suffix: '.min'}))
            .pipe(gulp.dest(basePath + "dist/js"))
            .pipe(livereload())
            .pipe(through2.obj(function (file, enc, cb) {
                notify({message: tools.p(config.P_TYPE.INFO, file.path + "文件编译完成...")});
                this.push(file);
                cb();
            }));

});

/**
 * 清理临时目录和发布目录
 */
gulp.task('clean', function() {
    return gulp.src(['dist', 'assets/js/output', 'assets/sass/output'], {read: false})
        .pipe(clean());
});

gulp.task('logo',function(){

    console.log(kinerVersion.red);

    tools.p(config.P_TYPE.LOG, "开始监听项目文件...", true);

});

gulp.task("dev", ["logo","clean","sass", "js"], function () {


    gulp.watch([basePath + "assets/sass/public/*.sass", basePath + "assets/sass/*.sass"], ["sass"]);
    gulp.watch([basePath + "assets/js/lib/*.js", basePath + "assets/js/*.js"], ["js"]);

});