"use strict";

const gulp = require('gulp');
const runSequence = require('run-sequence');
const del = require('del');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const less = require('gulp-less');
const concatCss = require('gulp-concat-css');
const cleanCSS = require('gulp-clean-css');
const pug = require('gulp-pug');
const yaml = require('yamljs');
const templateData = yaml.load('./src/data.yml');

gulp.task('dev', () => {
  browserSync.init({
    server: {
      baseDir: "./build/"
    }
  });
  gulp.watch(["src/*.pug", "src/*.yml"], ['build:assets:html']);
  gulp.watch("src/styles/*", ['build:assets:css']);
  gulp.watch("src/images/*", ['build:assets:images']);
  gulp.watch("build/**/*").on('change', browserSync.reload);
});

gulp.task('clean', () => {
  return del([
    './build/css/**/*',
    './build/js/**/*',
    './build/img/**/*',
    './build/index.html'
  ]);
});

gulp.task('build:assets:css', () => {
  return gulp.src(
      [
        'node_modules/bootstrap/less/bootstrap.less',
        'src/styles/main.less'
      ], {
        base: 'build'
      }
    )
    .pipe(less())
    .pipe(concatCss('css/main.css'))
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('build:assets:js', () => {
  return gulp.src(require('./src/scripts/index'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write('./build/js/maps/'))
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('build:assets:html', () => {
  return gulp.src('src/*.pug')
    .pipe(pug({
      locals: templateData
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('build:assets:images', () => {
  return gulp.src('src/images/*')
    .pipe(gulp.dest('build/img/'));
});

gulp.task('build:assets', ['build:assets:css', 'build:assets:js',
  'build:assets:images', 'build:assets:html'
]);

gulp.task('build', (cb) => {
  runSequence('clean', 'build:assets', cb);
});

gulp.task('default', ['build']);
