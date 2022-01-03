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

function clean() {
  return del(['./dist']);
}

function startAppServer() {
  // server.init({
  //   server: {
  //     baseDir: './',
  //   },
  // });

  browserSync.init({
    proxy: 'sample.local', // ローカルにある「Site Domain」に合わせる
    notify: false, // ブラウザ更新時に出てくる通知を非表示にする
    // open: 'external',
  });

  watch(['./css/*.scss', './**/css/*.scss'], styles);
  watch(['./**/*.scss']).on(
    'change',
    server.reload
  );
}

const build = series(clean, parallel(styles));
const serve = series(build, startAppServer);

exports.styles = styles;
exports.build = build;
exports.serve = serve;
exports.default = serve;
