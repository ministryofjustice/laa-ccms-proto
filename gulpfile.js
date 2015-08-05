'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');
var tinylr = require('tiny-lr');
var express = require('express');
var app = express();
var path = require('path');
var server = tinylr();

// --- Basic Tasks ---
gulp.task('css', function () {
  return gulp.src('src/css/*.scss')
    .pipe(
      sass({
        includePaths: ['src/css'],
        errLogToConsole: true
      }))
    .pipe(gulp.dest('public/css/'))
    .pipe(livereload(server));
});

gulp.task('js', function () {
  return gulp.src('src/js/*.js')
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('public/js/'))
    .pipe(livereload(server));
});

gulp.task('templates', function () {
  return gulp.src('src/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('public/'))
    .pipe(livereload(server));
});

gulp.task('express', function () {
  app.use(express.static(path.resolve('./public')));
  app.listen(1337);
  gutil.log('Listening on port: 1337');
});

gulp.task('static', function () {
  return gulp.src('src/web-determinations/staticresource/**/*')
    .pipe(gulp.dest('public/web-determinations/staticresource/'));
});

gulp.task('watch', function () {
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err);
    }

    gulp.watch('src/css/*.scss', ['css']);

    gulp.watch('src/js/*.js', ['js']);

    gulp.watch('src/*.jade', ['templates']);
  });
});

// Default Task
gulp.task('default', ['js', 'css', 'templates', 'static', 'express', 'watch']);
