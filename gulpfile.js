const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-mocha');

gulp.task('default', () => {
  return new Promise((resolve, reject) => {
    nodemon({
      script: 'app.js',
      ext: 'js',
      env: {
        PORT: 8081,
      },
      ignore: ['./node_modules/**'],
    })
      .on('restart', () => {
        console.log('Restarting');
      })
      .on('error', () => {
        console.error.bind(console);
        reject();
      });
    resolve();
  });
});

gulp.task('test', () => {
  return new Promise((resolve, reject) => {
    const testResults = gulp
      .src('test/**/*.test.js', { read: false })
      .pipe(mocha({ reporter: 'spec' }))
      .on('error', () => {
        console.log('TEST PIPELINE FAILED');
        console.error.bind(console);
        reject();
      });
    console.log(testResults);
    resolve();
  });
});
