import gulp from 'gulp';
import log from 'fancy-log';


global._SRC_PATH = 'exports/';
global._BUID_PATH = 'build/';
global._IMAGES_FORMATS = 'jpg,jpeg,svg,gif';


// Config
let config = {
  mode: 'development'
};

// node env mode production/development
process.env.NODE_ENV = process.env.NODE_ENV || config.mode || 'production';
log.info('Starting task in mode : ' + process.env.NODE_ENV );

/**
 * clean
 */
import {deleteAsync} from 'del';

export const clean = async () => {
  const deletedPaths = await deleteAsync([ `${_BUID_PATH}`]);
  log.info('Deleted files and directories:\n', deletedPaths.join('\n'));
}
/**
 * images
 */
export const images = async () => {
  const imagemin = (await import("gulp-imagemin")).default;
  const gifsicle = (await import("imagemin-gifsicle")).default;
  const mozjpeg = (await import("imagemin-mozjpeg")).default;
  const optipng = (await import("imagemin-optipng")).default;
  const svgo = (await import("imagemin-svgo")).default;

  return gulp.src(`./exports/assets/img/**/*.{${_IMAGES_FORMATS}}`)
        .pipe(imagemin([
          gifsicle({interlaced: true}),
          mozjpeg({quality: 75, progressive: true}),
          optipng({optimizationLevel: 5}),
          svgo({
            plugins: [
              {
                name: 'removeViewBox',
                active: true
              },
              {
                name: 'cleanupIds',
                active: false
              }
            ]
          })
        ]))
        .pipe(gulp.dest(_BUID_PATH));
}
/**
 * scripts
 *
 */
export const scripts = async () => {
  return gulp.src('./exports/**/*.js')
          .pipe(gulp.dest(_BUID_PATH));
}
/**
 * html
 *
 * https://www.npmjs.com/package/gulp-htmlmin
 */
import htmlmin from 'gulp-htmlmin';

export const html = async () => {
  return gulp.src('./exports/**/*.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest(_BUID_PATH));
}
/**
 * styles
 *
 * http://cssnext.io/postcss/#gulp-postcss
 *
 */
import postcss from 'gulp-postcss';

export const styles = async () => {
  return gulp.src('./exports/**/*.css')
      .pipe(postcss({ to: _BUID_PATH }))
      .pipe(gulp.dest(_BUID_PATH));
}

// https://www.npmjs.com/package/browser-sync
// var browserSync = require('browser-sync').create();
// gulp.task('build', ['styles','images','scripts','html'], function(){
//
// 	browserSync.init({
//         server: "./build"
//     });
// 	gulp.watch('./exports/assets/img/**/*.{jpeg,jpg,png,svg}',['images']);
// 	gulp.watch('./exports/assets/**/*.{css,js}',['styles','scripts']);
// 	gulp.watch('./exports/**/*.html',['html']);
// });
//
// gulp.task('default', ['styles'], function(){
//
// 	gulp.watch('./exports/assets/**/*.css',['styles']);
// });
const build = gulp.series(clean, gulp.parallel(images,scripts,styles,html));

export default build;
