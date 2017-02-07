
//npm install gulp-less --save-dev
//npm install gulp-concat --save-dev
//npm install gulp-uglify --save-dev
//npm install gulp-cssnano --save-dev
//npm install gulp-htmlmin --save-dev
//npm install browser-sync --save-dev

'use strict';

/**
 * 1. LESS编译 压缩 合并
 * 2. JS合并 压缩 混淆
 * 3. img复制
 * 4. html压缩
 */

//在gulpfile中先载入gulp包，因为这个包提供了一些API
var gulp = require('gulp');
var less = require('gulp-less');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var browserSync = require('browser-sync');


//1. LESS编译 压缩 --合并没有必要，一般预处理CSS都可以导包
gulp.task('style', function() {
  // 这里是在执行style任务时自动执行的
  gulp.src(['src/css/*.less', '!src/css/_*.less'])
    .pipe(less())
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

//css压缩
var minifycss = require('gulp-clean-css');
gulp.task('compress', function() {
  gulp.src(['src/css/*.css','!src/css/*.min.css'])
      .pipe(concat('all.css'))
      .pipe(minifycss())
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync().reload({
        stream: true
      }));
});

// 2. JS合并 压缩混淆
gulp.task('script', function() {
  gulp.src(['./src/**/*.js','!src/js/*min.js'])
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// 3. 图片复制
gulp.task('image', function() {
  gulp.src('src/images/*.*')
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// 4. HTML
gulp.task('html', function() {
  gulp.src('src/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,//去除空格
      removeComments: true//删除注释
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: ['dist'],
      index: 'src/index.html'
    }
  }, function(err, bs) {
    console.log(bs.options.getIn(["urls", "local"]));
  });
  gulp.watch('src/css/*.less',['style']);
  gulp.watch('src/css*.css',['compress']);
  gulp.watch('src/js/*.js',['script']);
  gulp.watch('src/images/*.*',['image']);
  gulp.watch('src/*.html',['html']);
});

gulp.task('default', ['browserSync']);