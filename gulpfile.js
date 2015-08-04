var gulp = require('gulp'),
  gutil = require('gulp-util'),
  sass = require('gulp-sass'),
  jade = require('gulp-jade'),
  concat = require('gulp-concat'),
  livereload = require('gulp-livereload'), // Livereload plugin needed: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
  tinylr = require('tiny-lr'),
  express = require('express'),
  app = express(),
  path = require('path'),
  server = tinylr();


// --- Basic Tasks ---
gulp.task('css', function() {
  return gulp.src('src/css/*.scss')
    .pipe(
      sass( {
        includePaths: ['src/css'],
        errLogToConsole: true
      } ) )
    .pipe( gulp.dest('public/css/') )
    .pipe( livereload( server ));
});

gulp.task('js', function() {
  return gulp.src('src/js/*.js')
    .pipe( concat('all.min.js'))
    .pipe( gulp.dest('public/js/'))
    .pipe( livereload( server ));
});

gulp.task('templates', function() {
  return gulp.src('src/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('public/'))
    .pipe( livereload( server ));
});

gulp.task('express', function() {
  app.use(express.static(path.resolve('./public')));
  app.listen(1337);
  gutil.log('Listening on port: 1337');
});

gulp.task('watch', function () {
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err);
    }

    gulp.watch('src/css/*.scss',['css']);

    gulp.watch('src/js/*.js',['js']);

    gulp.watch('src/*.jade',['templates']);

  });
});

// Default Task
gulp.task('default', ['js','css','templates','express','watch']);
