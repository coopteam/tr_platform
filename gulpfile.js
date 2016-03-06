/**
 * Created by NieFZ on 2016-03-05
 */

// 引入 gulp及组件
var gulp = require('gulp'),                     //gulp基础库
    uglify = require('gulp-uglify'),            //js压缩
    jshint = require('gulp-jshint'),            //js检查
    sass = require('gulp-sass'),                //sass编译
    openpage = require('gulp-open'),            //Open
    connect = require('gulp-connect'),          //本地web server
    rename = require('gulp-rename'),            //重命名
    livereload = require('gulp-livereload'),    //livereload
    autoprefixer = require('gulp-autoprefixer'),//增加私有变量前缀
    makeCssUrlVer = require('gulp-make-css-url-version'),
    watch = require('gulp-watch'),
    tmodjs = require("gulp-tmod");

var pkg = require("./package.json"),
    dirs = pkg.dirs;

/**
 * web server ,提供一个本地web server 用以测试及浏览器自动加载
 * */
gulp.task('serverSrc', function () {
    connect.server({
        root: [dirs.src],
        port: 8010,
        livereload: true
    });
});

gulp.task('openSrc', function () {
    gulp.src('')
        .pipe(openpage({
            app: 'chrome',
            uri: 'http://localhost:8010'
        }));
});

// HTML处理
gulp.task('html', function () {
    gulp.src(['./' + dirs.src + '/**/*.html',
        './' + dirs.src + '/**/*.js',
        './' + dirs.src + '/**/*.css'])
        .pipe(connect.reload());
});

//watch css and js files then run html task
gulp.task('watchCssJs', function () {
    gulp.watch(['./' + dirs.src + '/**/*.js', './' + dirs.src + '/**/*.css'], ['html']);
});

//js文件jshint语法检查
gulp.task('lint', function () {
    return gulp.src(['./' + dirs.src + '/js/page/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

/**
 * 编译sass文件
 * */
gulp.task('sass', [
    'sass:common',
    'sass:page',
    'sass:watch'
]);

gulp.task('sass:common', function () {
    gulp.src('./' + dirs.src + '/sass/common/common.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(rename({
            extname: ".css"
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 8', 'ie 9'],
            cascade: true,
            remove: true
        }))
        .pipe(makeCssUrlVer())
        .pipe(gulp.dest('./' + dirs.src + '/css/common'));
});

gulp.task('sass:page', function () {
    gulp.src('./' + dirs.src + '/sass/page/**/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(rename({
            extname: ".css"
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 8', 'ie 9'],
            cascade: true,
            remove: true
        }))
        .pipe(makeCssUrlVer())
        .pipe(gulp.dest('./' + dirs.src + '/css/page'));
});

gulp.task('sass:watch', function () {
    gulp.watch(['./' + dirs.src + '/sass/page/**/*.scss', './' + dirs.src + '/sass/common/**/*.scss'], ['sass:page', 'sass:common']);
});

/**
 * main task
 * */
gulp.task('dev', [
    'lint',
    'sass',
    'watchCssJs',
    'serverSrc',
    'openSrc'
]);
gulp.task("default", ['dev']);