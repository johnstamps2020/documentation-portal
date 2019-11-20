const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const gulpMocha = require('gulp-mocha');
const env = require('gulp-env');
// const supertest = require('supertest');

gulp.task('default', () => {
    return new Promise((resolve, reject) => {
        nodemon({
            script: 'app.js',
            ext: 'js',
            env: {
                PORT: 8081
            },
            ignore: ['./node_modules/**']
        })
            .on('restart', () => {
                console.log('Restarting');
            });
        resolve();
    });

});