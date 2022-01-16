const { src, dest, watch, series, parallel } = require('gulp');

const loadPlugins = require('gulp-load-plugins');

const $ = loadPlugins();

const fs = require('fs');
const del = require('del');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync');

const server = browserSync.create();
const isProd = process.env.NODE_ENV === 'production';

// Sass
function styles() {
  return src(['./css/*.scss', './**/css/*.scss'], { base: './' })
    .pipe($.if(!isProd, $.sourcemaps.init()))
    .pipe($.sass())
    .pipe($.postcss([autoprefixer()]))
    .pipe($.if(!isProd, $.sourcemaps.write('.')))
    .pipe($.if(isProd, $.postcss([cssnano({ safe: true, autoprefixer: false })])))
    .pipe(dest('./'));
}

// 追加・変更以外のファイルも影響されるためコーディング担当が2人以上の場合は現状手動で行う
function clean() {
  return del(['./dist']);
}

function startAppServer() {
  // server.init({
  //   server: {
  //     baseDir: './dist',
  //   },
  // });

  server.init({
      proxy: 'http://localhost:8888/template_gulp/', // パスを記入
  });


  watch(['css/*.scss', './**/css/*.scss'], styles);
  watch(['css/*.scss', './**/css/*.scss']).on('change', server.reload);
}

// const build = series(clean, parallel(styles)); clean()を使用する場合はコメントアウト
const build = series(styles);
const serve = series(build, startAppServer);

exports.styles = styles;
exports.build = build;
exports.serve = serve;
exports.default = serve;
