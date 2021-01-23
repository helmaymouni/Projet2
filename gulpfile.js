const { watch,src,dest,parallel,series } = require('gulp');
const gulp = require ('gulp');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const imagemin =require('gulp-imagemin');
const distRoot ='./dist';
const sass =require('gulp-sass');


/////////////////////////////////////////////////////////////////////////////////////

plugins = require('gulp-load-plugins')({
    pattern:'*',
    rename:{
      jshint:'jslint'
    }
});
  
plugins.browserSync.create();
async function debug() {
    await console.log(plugins);
}
  
//////////////////////////////////////// CSS ////////////////////////////////////////

function cssTask(){
    return src('css/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('style.css'))
    .pipe(postcss([autoprefixer(),cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'));
    }

//////////////////////////////////////// SASS ////////////////////////////////////////

function sassTask(){
  return gulp.src('scss/**/*')
    .pipe(sourcemaps.init())
    .pipe(concat('style.css'))
    .pipe(sass())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/scss'));
}
    
//////////////////////////////////////// JS ////////////////////////////////////////

function jsTask() {
    return src('js/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(terser())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('dist/js'));
  }
//////////////////////////////////////// JQuery ////////////////////////////////////////

function jqueryTask() {
  return src('js/jquery.js')
    .pipe(gulp.dest('dist/js'));
}

//////////////////////////////////////// HTML ////////////////////////////////////////

function htmlTask() {
    return src('*.html')
      .pipe(gulp.dest('dist'));
  }

function htmlCommonTask() {
    return src('common/**/*.html')
      .pipe(gulp.dest('dist/common'));
  }

//////////////////////////////////////// FONT ////////////////////////////////////////

function fontTask() {
    return src('font/**/*')
    .pipe(gulp.dest('dist/font'));
  }

//////////////////////////////////////// JSON ////////////////////////////////////////

function jsonTask() {
    return src('*.json')
    .pipe(gulp.dest('dist'));
    
}
//////////////////////////////////////// Image ////////////////////////////////////////

function imageTask() {
    return src('img/**/*')
    .pipe(imagemin())    //ppur mimiser la taille de l'image 
    .pipe(gulp.dest('dist/img'));
    
}

//////////////////////////////////////////////////////////////////////////////////////  

function watchTask(){
    watch(parallele(jsTask,htmlTask,htmlCommonTask,fontTask, jsonTask,imageTask,jqueryTask,sassTask));
}

exports.jsTask=jsTask;
exports.htmlCommonTask=htmlCommonTask;
exports.htmlTask=htmlTask;
exports.fontTask=fontTask;
exports.jsonTask=jsonTask;
exports.imageTask=imageTask;
exports.jqueryTask=jqueryTask;
exports.sassTask=sassTask;

//////////////////////////////////////// Servce ////////////////////////////////////////

gulp.task('serve',gulp.series(parallel(jsTask,htmlTask,htmlCommonTask,fontTask, jsonTask,imageTask,jqueryTask,sassTask),
  function () {
     plugins.browserSync.init({
       port:3010,
       server:{
         baseDir:distRoot ,
         https:true
       }
     }) ;
     watchTask
}));
gulp.task('default',gulp.parallel('serve'));
